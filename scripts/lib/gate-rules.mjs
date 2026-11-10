// Pattern rules of the WSZ-003b gates (check-rendered-text.mjs, check-number-trace.mjs, check-nec-refs.mjs), kept
// apart from the scripts so tests/wsz003b-gates.test.ts can run them on examples. Node built-ins only; pure functions.

// ── Gate a: rendered text ────────────────────────────────────────────────────

// [category, label, pattern]: whole words, case-insensitive, plurals included.
/** @type {[string, string, RegExp][]} */
const WORD_RULES = [
  // spec vocabulary (content-page "Rendering rules")
  ['spec vocabulary', 'hook', /\bhooks?\b/giu],
  ['spec vocabulary', 'promise', /\bpromises?\b/giu],
  ['spec vocabulary', 'wedge', /\bwedges?\b/giu],
  ['spec vocabulary', 'information gain', /\binformation gains?\b/giu],
  ['spec vocabulary', 'fan-out', /\bfan-outs?\b/giu],
  ['spec vocabulary', 'attack plan', /\battack plans?\b/giu],
  ['spec vocabulary', 'ledger', /\bledgers?\b/giu],
  ['spec vocabulary', 'registry', /\bregistry\b|\bregistries\b/giu],
  ['spec vocabulary', 'archetype', /\barchetypes?\b/giu],
  ['spec vocabulary', 'cluster', /\bclusters?\b/giu],
  ['spec vocabulary', 'flagship', /\bflagships?\b/giu],
  ['spec vocabulary', 'money query', /\bmoney quer(?:y|ies)\b/giu],
  ['spec vocabulary', 'engine', /\bengines?\b/giu],
  ['spec vocabulary', 'single-sourced', /\bsingle-sourced\b/giu],
  ['spec vocabulary', 'by construction', /\bby construction\b/giu],
  ['spec vocabulary', 'build pipeline', /\bbuild pipelines?\b/giu],
  ['spec vocabulary', 'crawlable', /\bcrawlable\b/giu],
  ['spec vocabulary', 'crawler', /\bcrawlers?\b/giu],
  ['spec vocabulary', 'LLM', /\bLLMs?\b/giu],
  ['spec vocabulary', 'citation-worthy', /\bcitation-worthy\b/giu],
  ['spec vocabulary', 'cite us', /\bcite us\b/giu],
  // status notes
  ['status note', 'coming soon', /\bcoming soon\b/giu],
  ['status note', 'shipping later', /\bshipping later\b/giu],
  ['status note', 'now shipped', /\bnow shipped\b/giu],
  ['status note', 'when … ships', /\bwhen\b[^.!?\n]{1,60}?\bships\b/giu],
  // self-praise
  ['self-praise', 'trusted', /\btrusted\b/giu],
  ['self-praise', 'professional-grade', /\bprofessional-grade\b/giu],
  ['self-praise', 'ultimate', /\bultimate\b/giu],
  ['self-praise', 'comprehensive guide', /\bcomprehensive guides?\b/giu],
  ['self-praise', 'rigorous', /\brigorous\b/giu],
  ['self-praise', 'honest', /\bhonest\b/giu],
  ['self-praise', 'exact', /\bexact\b/giu],
  ['self-praise', 'accurate', /\baccurate\b/giu],
  ['self-praise', 'compliant', /\bcompliant\b/giu],
  // UK spellings (with their inflections; "analyses" is also the US plural of "analysis", so it is not flagged)
  ['UK spelling', 'colour', /\bcolour\p{L}*/giu],
  ['UK spelling', 'behaviour', /\bbehaviour\p{L}*/giu],
  ['UK spelling', 'metre', /\p{L}*metres?\b/giu],
  ['UK spelling', 'litre', /\p{L}*litres?\b/giu],
  ['UK spelling', 'centre', /\bcentre(?:s|d)?\b/giu],
  ['UK spelling', 'aluminium', /\baluminium\b/giu],
  ['UK spelling', 'analyse', /\banalys(?:e|ed|ing)\b/giu],
  ['UK spelling', 'modelling', /\bmodelling\b/giu],
];

// Spans that are exempt from the joined-text rule: URLs (absolute, www., or a site path), hashes and ISO dates.
const EXEMPT_SPANS = [
  /\bhttps?:\/\/[^\s"'<>)\]]+/giu,
  /\bwww\.[^\s"'<>)\]]+/giu,
  /(?<![\p{L}\p{N}])\/[\p{L}\p{N}_\-./?=&%#]+(?:\?[^\s"'<>)\]]*)?/giu,
  /\b\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?\b/gu,
  /\b[0-9a-f]{7,}\b/giu,
];

function exemptSpans(text) {
  const spans = [];
  for (const re of EXEMPT_SPANS) {
    for (const m of text.matchAll(re)) {
      // a hash needs digits and letters; a word made of a–f letters is not one
      if (re === EXEMPT_SPANS[4] && !(/\d/.test(m[0]) && /[a-f]/i.test(m[0]))) continue;
      spans.push([m.index, m.index + m[0].length]);
    }
  }
  return spans;
}

const TOKEN_EDGE = /^[([{"'“‘]+|[)\]}"'”’.,;:!?]+$/gu;

/** The whitespace-delimited token around `at`, without surrounding brackets or punctuation. */
function tokenAt(text, at) {
  let start = at;
  let end = at;
  while (start > 0 && !/\s/u.test(text[start - 1])) start--;
  while (end < text.length && !/\s/u.test(text[end])) end++;
  return text.slice(start, end).replace(TOKEN_EDGE, '');
}

/**
 * A digit running into a letter or into %, °C or °F ("240V", "15A", "3%", "104°F"). Built-in exceptions: wye
 * designations ("480Y/277"), ordinals ("1st", "2nd", "3rd", "21st") and anything inside a URL, hash or ISO date.
 * Plane angles ("120°") never match: "°" is only joined when C or F follows.
 */
export function joinedHits(text) {
  const hits = [];
  const spans = exemptSpans(text);
  const re = /\d(?=\p{L}|%|°[CF])/gu;
  let lastToken = null;
  let lastEnd = -1;
  for (const m of text.matchAll(re)) {
    const at = m.index;
    if (spans.some(([s, e]) => at >= s && at < e)) continue;
    const next = text.slice(at + 1, at + 3);
    if (/^Y\//u.test(next)) continue;
    // ordinal: the digits before and the letters after form 1st, 2nd, 3rd or Nth
    const ordinal = /^\d*(?:1st|2nd|3rd|[04-9]th|1[123]th)(?!\p{L})/u;
    let digitsStart = at;
    while (digitsStart > 0 && /\d/u.test(text[digitsStart - 1])) digitsStart--;
    if (ordinal.test(text.slice(digitsStart))) continue;
    const token = tokenAt(text, at);
    // one hit per token ("10AWG2" reports "10AWG2" once)
    if (token === lastToken && at < lastEnd) continue;
    lastToken = token;
    lastEnd = at + token.length + 1;
    hits.push({ category: 'joined text', label: 'digit run into a unit or word', match: token, index: at });
  }
  return hits;
}

/** Word, status, self-praise and spelling hits plus joined text, in one text. */
export function textHits(text) {
  const hits = [];
  for (const [category, label, re] of WORD_RULES) {
    for (const m of text.matchAll(re)) hits.push({ category, label, match: m[0], index: m.index });
  }
  hits.push(...joinedHits(text));
  return hits.sort((a, b) => a.index - b.index);
}

// Inline elements: a closing tag of one of these, run straight into a letter, reads as one word ("Q:</span>What").
export const INLINE_ELEMENTS = new Set([
  'a', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'label', 'mark', 'q', 's', 'samp',
  'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var',
]);

/**
 * A closing inline tag followed straight by a letter, with visible text and no space before it ("Q:</span>What",
 * "240</strong>V"). A tag between the two ("</a><a>About") is not a join. `events` are tokenizeHtml events
 * (scripts/lib/build-output.mjs).
 */
export function inlineJoinHits(events) {
  const hits = [];
  // the visible text right before the current event, across inline tags
  let before = '';
  for (let k = 0; k < events.length; k++) {
    const e = events[k];
    if (e.type === 'text') {
      before = (before + e.value).slice(-40);
      continue;
    }
    if ((e.type !== 'open' && e.type !== 'close') || !INLINE_ELEMENTS.has(e.name)) {
      // a block tag, a void element, a raw element or a boundary: the text before no longer touches what follows
      before = '';
      continue;
    }
    const next = events[k + 1];
    if (e.type === 'close' && before && !/\s$/u.test(before) && next?.type === 'text' && /^\p{L}/u.test(next.value)) {
      const left = before.split(/\s/u).pop();
      const right = next.value.split(/\s/u)[0];
      hits.push({ category: 'joined text', label: 'closing inline tag run into a letter', match: `${left}</${e.name}>${right}` });
    }
  }
  return hits;
}

/** Text a page renders as JSX in an OG image source: JSX text between tags and the `alt` export. Comments dropped. */
export function ogSourceTexts(source) {
  const code = source.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const texts = [];
  for (const m of code.matchAll(/>([^<>{}]+)</g)) {
    const t = m[1].replace(/\s+/g, ' ').trim();
    if (t && !/^[)\],;]/.test(t)) texts.push(t);
  }
  for (const m of code.matchAll(/export\s+const\s+alt\s*=\s*(['"`])([\s\S]*?)\1/g)) texts.push(m[2]);
  return texts;
}

// ── Gate b: number trace ─────────────────────────────────────────────────────

// Longest first. Symbols are case-sensitive; words take a capital too. "in" counts as inches only when no lowercase
// word follows ("12 in." and "0.081 in)" count; "3 in the table" does not).
const UNITS = [
  '[Aa]mps?', '[Vv]olts?', '[Oo]hms?', '[Ff]eet', '[Ff]oot', '[Ii]nch(?:es)?', '[Tt]ons?',
  'kVAR', 'kVA', 'kV', 'kW', 'VA', 'kcmil', 'cmil', 'mm²', 'mm', 'km', 'kg', 'lbs?', 'hp', 'Btu/h', 'BTU/h',
  '°C', '°F', '%', 'Ω', 'A', 'V', 'W', 'm', 'ft', 'in(?!\\s+\\p{Ll})',
];
const NUMBER = String.raw`(?<![\p{L}\p{N}.,/])[-−]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?`;
const UNIT_NUMBER_RE = new RegExp(`(${NUMBER})[ \\u00a0]?(${UNITS.join('|')})(?![\\p{L}\\p{N}])`, 'gu');
const DOLLAR_RE = /\$\s?\d[\d,]*(?:\.\d+)?/gu;
// "Table 310.16", "NEC 240.4", "Section 230.70", "Article 220": a section number, never a measurement
const SECTION_BEFORE = /(?:\bTables?|\bNEC|\bSections?|§|\bArticles?)\s*$/u;

/** Unit-bearing numbers in a text: [{ index, end, match }] ("20 A", "3.5 %", "1,200 ft", "$12"). */
export function unitNumbers(text) {
  const out = [];
  for (const m of text.matchAll(UNIT_NUMBER_RE)) {
    if (SECTION_BEFORE.test(text.slice(Math.max(0, m.index - 12), m.index))) continue;
    out.push({ index: m.index, end: m.index + m[0].length, match: m[0] });
  }
  for (const m of text.matchAll(DOLLAR_RE)) out.push({ index: m.index, end: m.index + m[0].length, match: m[0] });
  return out.sort((a, b) => a.index - b.index);
}

/**
 * The unit-bearing numbers of a page's visible <body> text, each with the data-src of its nearest ancestor that has
 * one: [{ match, src, traced }]. `events` are tokenizeHtml events; as in visibleText, a tag reads as a space and
 * whitespace runs collapse, so "20<!-- --> A" and "<strong>20</strong> A" both read "20 A". Numbers inside [data-size]
 * (size names) and [data-name] (page names in navigation and related links, D-20) are skipped. `isValid(src)` says
 * whether a data-src value traces.
 */
export function traceNumbers(events, isValid) {
  let text = '';
  // per character of `text`: the nearest data-src and whether a [data-size] or [data-name] encloses it
  const where = [];
  const NONE = { src: null, exempt: false };
  const push = (c, info) => {
    text += c;
    where.push(info);
  };
  for (const e of events) {
    if (e.type !== 'text') {
      if (text && !text.endsWith(' ')) push(' ', NONE);
      continue;
    }
    if (!e.stack.includes('body')) continue;
    let src = null;
    let exempt = false;
    for (let k = e.ancestors.length - 1; k >= 0; k--) {
      const attrs = e.ancestors[k].attrs;
      if (attrs['data-size'] !== undefined || attrs['data-name'] !== undefined) exempt = true;
      if (src === null && attrs['data-src'] !== undefined) src = attrs['data-src'];
    }
    const info = { src, exempt };
    for (const c of e.value) {
      if (/[ \t\n\r\f]/u.test(c)) {
        if (text && !text.endsWith(' ')) push(' ', info);
      } else push(c, info);
    }
  }
  return unitNumbers(text)
    .filter((n) => !where[n.index].exempt)
    .map((n) => {
      const src = where[n.index].src;
      return { match: n.match, src, traced: src !== null && isValid(src) };
    });
}

/** Whether a data-src value traces: a verified registry domain, calc:<ENGINE_ID> of an all-verified engine, or input. */
export function validDataSrc(value, verifiedDomains, engines) {
  if (value === 'input') return true;
  if (value.startsWith('calc:')) {
    const domains = engines.get(value.slice('calc:'.length));
    return Array.isArray(domains) && domains.every((d) => verifiedDomains.has(d));
  }
  return verifiedDomains.has(value);
}

// ── Gate c: NEC references ───────────────────────────────────────────────────

const SECTION = String.raw`\d{2,3}\.\d{1,3}(?:\([A-Za-z0-9]{1,3}\))*`;
const UNIT_AFTER = new RegExp(`^[ \\u00a0]?(?:${UNITS.join('|')})(?![\\p{L}\\p{N}])`, 'u');
const LIST_JOIN = String.raw`\s*(?:,|and|or|&|through|to|–|-)\s*`;
// "Table 310.16", "Tables 310.15(B)(1)(1) and 310.15(C)(1)", "NEC 240.4(D)", "Sections 220.82 and 220.83",
// "§ 230.70", "Tables 430.247–430.250"
const KEYWORD_RE = new RegExp(`(?:\\bTables?|\\bNEC|\\bSections?|§)\\s*(${SECTION}(?:${LIST_JOIN}${SECTION})*)`, 'gu');
// "Article 120", "Articles 210 and 220"
const ARTICLE_RE = /\bArticles?\s+(\d{2,3}(?:\s*(?:,|and|or|&)\s*\d{2,3})*)\b/gu;
// a bare section number: "240.4(D)" (with a subdivision) or "310.12"
const BARE_RE = new RegExp(`(?<![\\p{L}\\p{N}.,$/])(${SECTION})(?![\\p{N}])`, 'gu');

function articleOf(ref) {
  return Number(ref.split('.')[0]);
}

/**
 * NEC references in a text: [{ ref, index }]. A keyword ("Table", "NEC", "Section", "§", "Article") makes a
 * reference of the section numbers it leads; a bare number counts when it has a subdivision ("240.4(D)") or its
 * article is one the allowlist uses (`articles`). Articles below 90 do not exist, so "17.002" is a constant; a number
 * followed by a unit is a measurement ("120.5 V", "17.002 Ω·cmil/ft").
 */
export function necRefs(text, articles) {
  const refs = [];
  const taken = [];
  const isMeasurement = (end) => UNIT_AFTER.test(text.slice(end));
  for (const m of text.matchAll(KEYWORD_RE)) {
    const listStart = m.index + m[0].length - m[1].length;
    for (const s of m[1].matchAll(new RegExp(SECTION, 'gu'))) {
      const at = listStart + s.index;
      const end = at + s[0].length;
      taken.push([at, end]);
      if (articleOf(s[0]) < 90 || isMeasurement(end)) continue;
      refs.push({ ref: s[0], index: at });
    }
  }
  for (const m of text.matchAll(ARTICLE_RE)) {
    for (const n of m[1].matchAll(/\d{2,3}/gu)) refs.push({ ref: `Article ${n[0]}`, index: m.index + m[0].indexOf(n[0]) });
    taken.push([m.index, m.index + m[0].length]);
  }
  for (const m of text.matchAll(BARE_RE)) {
    const at = m.index;
    const end = at + m[0].length;
    if (taken.some(([s, e]) => at >= s && at < e)) continue;
    const article = articleOf(m[1]);
    if (article < 90 || isMeasurement(end)) continue;
    if (!m[1].includes('(') && !articles.has(article)) continue;
    refs.push({ ref: m[1], index: at });
  }
  return refs.sort((a, b) => a.index - b.index);
}

// ── Allowlists ───────────────────────────────────────────────────────────────

/** Lines "<route or file> | <matched text> | <reason>"; # starts a comment. */
export function parseAllowlist(text, name) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const [where, match, reason] = l.split('|').map((s) => s.trim());
      if (!where || !match || !reason) throw new Error(`${name}: need "<route or file> | <matched text> | <reason>": ${l}`);
      return { where, match: match.toLowerCase(), reason };
    });
}

export function allowed(allowlist, where, match) {
  return allowlist.some((a) => (a.where === '*' || a.where === where) && a.match === match.toLowerCase());
}
