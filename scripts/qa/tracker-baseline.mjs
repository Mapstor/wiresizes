#!/usr/bin/env node
// Builds or refreshes qa/pages.csv from a running build of a site. Zero Claude tokens, no npm dependencies.
// Site copy of portfolio-qa kit/tracker-baseline.mjs plus the uncited_auto column (WSZ-018): keep the column,
// its imports from scripts/lib and the uncited() function when the kit file is updated.
//
//   node scripts/qa/tracker-baseline.mjs http://127.0.0.1:3303 [--sweep reports/site.json] [--csv qa/pages.csv] [--config qa/config.json]
//
// - One row per sitemap URL. Re-running keeps every status, badness and note; it only refreshes
//   template, words, uncited_auto, prose_auto, func_auto and sweep, adds new URLs as todo rows and flags rows
//   that left the sitemap.
// - uncited_auto = numbers in the <main> text that no citation covers: not inside an element whose data-src
//   traces (a verified domain of research/data-sources.csv, calc:<ENGINE_ID> of an engine whose DOMAINS are all
//   verified, or input; gate b's rule in scripts/lib/gate-rules.mjs) and not a size name inside [data-size].
//   Unlike gate b it also counts numbers without a unit: sizes in plain text, table cells, factors. Not counted:
//   years 1900–2099 without a unit, NEC references as gate c reads them, standard designations (NFPA 70, UL 1561,
//   NEMA 14-50). A value taken from data/verified but rendered without data-src counts until its wave wires it,
//   so this measures numbers left to cite, not proof that a number is wrong.
// - prose_auto = AI-writing tells per 1,000 words (same rules as portfolio-qa prose-score.mjs):
//   lexical tells in the main text plus em dashes in body paragraphs beyond 1 per 300 words.
//   It is a floor: rhythm, padding and generic structure need a read.
// - func_auto = findings on that URL in a portfolio-qa sweep report (--sweep), if given.
// - New rows: templates listed in config.outOfScope get n/a on every track; P starts clean when
//   prose_auto <= config.cleanAtOrBelow, else todo; S, D and F start todo.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { engineDomains, parseCsv as parseRepoCsv, registryRows, repoRoot, tokenizeHtml } from '../lib/build-output.mjs';
import { necRefs, unitNumbers, validDataSrc } from '../lib/gate-rules.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const base = args.find((a) => /^https?:\/\//.test(a))?.replace(/\/$/, '');
if (!base) { console.error('Usage: node tracker-baseline.mjs <base url> [--sweep report.json] [--csv qa/pages.csv] [--config qa/config.json]'); process.exit(2); }
const csvPath = opt('--csv', 'qa/pages.csv');
const cfg = JSON.parse(readFileSync(opt('--config', 'qa/config.json'), 'utf8'));
const sweep = opt('--sweep') ? JSON.parse(readFileSync(opt('--sweep'), 'utf8')) : null;
const today = new Date().toISOString().slice(0, 10);
const COLS = ['path', 'template', 'words', 'uncited_auto', 'prose_auto', 'func_auto', 'sweep', 'S', 'S_bad', 'P', 'P_bad', 'D', 'D_bad', 'F', 'F_bad', 'updated', 'notes'];

// CSV, RFC 4180 subset
const parseCsv = (s) => {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '"') { if (s[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (c !== '\r') f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const [head = [], ...body] = rows;
  return body.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
};
const cell = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const toCsv = (rows) => [COLS.join(','), ...rows.map((r) => COLS.map((c) => cell(r[c])).join(','))].join('\n') + '\n';

// Same rules as portfolio-qa prose-score.mjs
const AI = 'delve|delves|tapestry|testament|pivotal|crucial|intricate|meticulous|meticulously|seamless|seamlessly|leverage|leverages|harness|unlock|unlocks|elevate|empower|foster|garner|bolster|showcase|showcases|underscore|underscores|interplay|realm|vibrant|game-changer|cutting-edge|ever-evolving|a wide range of|plays a vital role|robust';
const allow = new Set((cfg.allowWords ?? []).map((w) => w.toLowerCase()));
const RULES = [
  /\b(?:it'?s|this is|that'?s|is|are|isn'?t|aren'?t)\s+(?:not\s+)?(?:just|only|merely)\b[^.]{0,80}[,;—-]\s*(?:it'?s|but|they'?re)\b|\bnot only\b[^.]{0,80}\bbut also\b/gi,
  /\b(?:here'?s the thing|here'?s why|it'?s worth noting|it is worth noting|it'?s important to note|it is important to note|when it comes to|in today'?s|let'?s dive|the truth is)\b/gi,
  /\b(?:may potentially|can help to|generally tends to|could potentially|might possibly)\b/gi,
  new RegExp(`\\b(?:${AI})\\b`, 'gi'),
  /(?:^|[.!?]\s+)(?:Additionally|Moreover|Furthermore|Notably)\b/g,
  /,\s(?:highlighting|underscoring|ensuring|reflecting|showcasing|emphasizing|demonstrating|illustrating)\s/gi,
  /\b(?:amazing|incredible|stunning|powerful|effortless|ultimate guide|everything you need to know)\b/gi,
  /\b(?:experts say|studies show|it is widely believed|research suggests)\b/gi,
  /\b(?:serves as|stands as|boasts)\b/gi,
  /\b(?:certainly!|great question|i hope this helps|let me know if|sure, here'?s)\b/gi,
  /\b(?:this (?:article|guide|page) will|in this (?:article|guide)|we'?ll cover)\b/gi,
  /(?:^|[.!?]\s+)(?:In conclusion|Overall|Ultimately)\b/g,
];
const decode = (s) => s.replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&mdash;|&#8212;|&#x2014;/gi, '—').replace(/&ndash;|&#8211;|&#x2013;/gi, '–');
const toText = (h) => decode(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const STRIP = /<(script|style|noscript|svg|template|table|nav|header|footer|head)\b[\s\S]*?<\/\1>/gi;

const score = (html) => {
  const main = (html.match(/<main\b[\s\S]*<\/main>/i)?.[0] ?? html.match(/<body\b[\s\S]*<\/body>/i)?.[0] ?? html).replace(STRIP, ' ');
  const text = toText(main);
  const words = text ? text.split(' ').length : 0;
  const paras = [...main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => toText(m[1])).filter((t) => t.split(' ').length >= 12);
  const ptext = paras.join(' ');
  const pwords = ptext ? ptext.split(' ').length : 0;
  let tells = 0;
  for (const re of RULES) tells += (text.match(re) ?? []).filter((m) => !allow.has(m.trim().toLowerCase())).length;
  const extraDash = Math.max(0, (ptext.match(/—/g) ?? []).length - Math.ceil(pwords / 300));
  return { words, per1k: words ? +(((tells + extraDash) / words) * 1000).toFixed(1) : 0 };
};

// uncited_auto (WSZ-018): the site's citation markup, read with the gates' own tokenizer and rules
const verified = new Set([...registryRows()].filter(([, row]) => row.status === 'verified').map(([domain]) => domain));
const engines = engineDomains();
const cites = (src) => src !== null && validDataSrc(src, verified, engines);
const necArticles = new Set(parseRepoCsv(readFileSync(join(repoRoot, 'research', 'nec-sections-allowlist.csv'), 'utf8'))
  .map((row) => Number(row.ref.replace(/^Article\s+/, '').split('.')[0])));
const NUMBER_RE = /(?<![\p{L}\p{N}.,/])[-−]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?/gu;
const STANDARD_RE = /\b(?:NFPA|UL|IEEE|IEC|ANSI|ASTM|CSA|NEMA|ISO|NIST(?:\s+SP)?)\s?\d[\d.-]*/gu;
const uncited = (html) => {
  // the <main> text as gate b reads <body>: a tag is a space and whitespace runs collapse; per character, the
  // nearest data-src and whether a [data-size] encloses it
  let text = '';
  const where = [];
  const NONE = { src: null, size: false };
  const push = (c, info) => { text += c; where.push(info); };
  for (const e of tokenizeHtml(html)) {
    if (e.type !== 'text') { if (text && !text.endsWith(' ')) push(' ', NONE); continue; }
    if (!e.stack.includes('main')) continue;
    let src = null, size = false;
    for (let k = e.ancestors.length - 1; k >= 0; k--) {
      const attrs = e.ancestors[k].attrs;
      if (attrs['data-size'] !== undefined) size = true;
      if (src === null && attrs['data-src'] !== undefined) src = attrs['data-src'];
    }
    const info = { src, size };
    for (const c of e.value) {
      if (/[ \t\n\r\f]/u.test(c)) { if (text && !text.endsWith(' ')) push(' ', info); } else push(c, info);
    }
  }
  const skip = [
    ...necRefs(text, necArticles).map((r) => [r.index, r.index + r.ref.replace(/^Article /, '').length]),
    ...[...text.matchAll(STANDARD_RE)].map((m) => [m.index, m.index + m[0].length]),
  ];
  const inside = (spans, at) => spans.some(([s, e]) => at >= s && at < e);
  const counts = (at) => !where[at].size && !cites(where[at].src);
  // unit-bearing numbers and $ amounts exactly as gate b finds them, then every other number
  const units = unitNumbers(text);
  const unit = units.filter((n) => counts(n.index)).length;
  const unitSpans = units.map((n) => [n.index, n.end]);
  let other = 0;
  for (const m of text.matchAll(NUMBER_RE)) {
    if (inside(unitSpans, m.index) || inside(skip, m.index) || !counts(m.index)) continue;
    if (/^(?:19|20)\d\d$/.test(m[0])) continue;
    other++;
  }
  return { unit, other };
};
let uncitedUnit = 0, uncitedOther = 0;

const locs = async (url) => {
  const xml = await (await fetch(url)).text();
  const l = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  return /<sitemapindex/i.test(xml) ? (await Promise.all(l.map((u) => locs(base + new URL(u).pathname)))).flat() : l;
};
const template = (p) => (cfg.templates.find(([re]) => new RegExp(re).test(p)) ?? [null, 'other'])[1];
const findings = new Map();
for (const f of sweep?.findings ?? []) {
  let p = f.url ?? '';
  try { if (/^https?:/.test(p)) p = new URL(p).pathname; } catch { /* keep as is */ }
  if (!findings.has(p)) findings.set(p, []);
  findings.get(p).push(`${f.sev} ${f.check}`);
}

const old = existsSync(csvPath) ? parseCsv(readFileSync(csvPath, 'utf8')) : [];
const byPath = new Map(old.map((r) => [r.path, r]));
const paths = [...new Set((await locs(base + '/sitemap.xml')).map((u) => new URL(u).pathname))];
let added = 0, refreshed = 0, failed = 0;
for (const path of paths) {
  const res = await fetch(base + path).catch(() => null);
  let r = byPath.get(path);
  const isNew = !r;
  if (isNew) { r = { path, S: 'todo', P: 'todo', D: 'todo', F: 'todo', updated: today, notes: '' }; byPath.set(path, r); added++; } else refreshed++;
  r.template = template(path);
  if (!res || res.status !== 200 || !/html/.test(res.headers.get('content-type') ?? '')) {
    failed++; r.notes = [r.notes, `HTTP ${res?.status ?? 'error'} on ${today}`].filter(Boolean).join('; ');
    continue;
  }
  const html = await res.text();
  const { words, per1k } = score(html);
  const u = uncited(html);
  r.words = words; r.uncited_auto = u.unit + u.other; r.prose_auto = per1k;
  uncitedUnit += u.unit; uncitedOther += u.other;
  if (sweep) { const f = findings.get(path) ?? []; r.func_auto = f.length; r.sweep = [...new Set(f)].join('; '); }
  if (isNew) {
    if ((cfg.outOfScope ?? []).includes(r.template)) { r.S = r.P = r.D = r.F = 'n/a'; }
    else if (per1k <= (cfg.cleanAtOrBelow ?? 2)) r.P = 'clean';
  }
}
const live = new Set(paths);
for (const r of byPath.values()) if (!live.has(r.path) && !/not in sitemap/.test(r.notes)) r.notes = [r.notes, `not in sitemap on ${today}`].filter(Boolean).join('; ');
const order = cfg.templates.map(([, t]) => t);
const rows = [...byPath.values()].sort((a, b) => (order.indexOf(a.template) - order.indexOf(b.template)) || a.path.localeCompare(b.path));
mkdirSync(dirname(csvPath), { recursive: true });
writeFileSync(csvPath, toCsv(rows));
console.log(`${csvPath}: ${rows.length} rows (${added} new, ${refreshed} refreshed, ${failed} not HTML 200)${sweep ? `, sweep ${sweep.date ?? ''}` : ''}`);
console.log(`uncited numbers in <main>: ${uncitedUnit + uncitedOther} (${uncitedUnit} with a unit, as gate b reads them; ${uncitedOther} without)`);
