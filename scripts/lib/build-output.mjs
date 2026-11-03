// Shared helpers for the build gates (scripts/check-banned.mjs, scripts/check-structure.mjs).
// Node built-ins only. Reads the Next.js build output in .next/server/app after `npm run build`.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv } from '../../src/lib/verified/csv.mjs';

// The repo's one CSV parser lives beside the site's source registry (src/lib/verified/registry.ts).
export { parseCsv };

export const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const appOutDir = join(repoRoot, '.next', 'server', 'app');
export const SITE_ORIGIN = 'https://wiresizes.com';

export function rel(file) {
  return relative(repoRoot, file).split(sep).join('/');
}

export function walkFiles(dir, predicate) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out.sort();
}

// Prerendered HTML pages: [{ file, route }]. index.html → "/", about.html → "/about".
export function htmlPages() {
  if (!existsSync(appOutDir)) {
    throw new Error(`No build output at ${rel(appOutDir)}. Run \`rm -rf .next && npm run build\` first.`);
  }
  return walkFiles(appOutDir, (f) => f.endsWith('.html')).map((file) => {
    const r = relative(appOutDir, file).split(sep).join('/').replace(/\.html$/, '');
    return { file, route: r === 'index' ? '/' : '/' + r };
  });
}

export function withdrawnRoutes() {
  const csv = readFileSync(join(repoRoot, 'research', 'wsz002-withdrawals.csv'), 'utf8');
  return parseCsv(csv).map((r) => r.slug.trim()).filter(Boolean);
}

// Redirect pairs from next.config.ts redirects(): [{ source, destination, permanent }].
export function configRedirects() {
  const src = readFileSync(join(repoRoot, 'next.config.ts'), 'utf8');
  const out = [];
  const re = /\{[^{}]*?source:\s*['"]([^'"]+)['"][^{}]*?destination:\s*['"]([^'"]+)['"][^{}]*?\}/g;
  let m;
  while ((m = re.exec(src))) {
    out.push({ source: m[1], destination: m[2], permanent: /permanent:\s*true/.test(m[0]) });
  }
  return out;
}

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', copy: '©', reg: '®', trade: '™',
  ndash: '–', mdash: '—', hellip: '…', deg: '°', times: '×', divide: '÷', plusmn: '±', middot: '·',
  bull: '•', rarr: '→', larr: '←', le: '≤', ge: '≥', ne: '≠', asymp: '≈', micro: 'µ', ohm: 'Ω',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', sup2: '²', sup3: '³', frac12: '½', frac14: '¼', frac34: '¾',
};

export function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/g, (all, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : all;
    }
    return NAMED_ENTITIES[body] ?? all;
  });
}

export const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

function parseAttributes(tagSource, nameLength) {
  const attrs = {};
  const body = tagSource.slice(1 + nameLength).replace(/\/?>$/, '');
  const re = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = re.exec(body))) {
    const value = m[2] ?? m[3] ?? m[4] ?? '';
    attrs[m[1].toLowerCase()] = decodeEntities(value);
  }
  return attrs;
}

// Tokenizes HTML into events, tracking the open-element stack:
//   { type: 'open', name, attrs, parent, stack }   (stack = ancestor names, outermost first)
//   { type: 'close', name }
//   { type: 'text', value, stack }                  (entities decoded)
//   { type: 'raw', name: 'script' | 'style', attrs, body }
// HTML comments are dropped without a boundary, so React's "$<!-- -->12" reads "$12".
export function tokenizeHtml(html) {
  const events = [];
  const stack = [];
  const n = html.length;
  let i = 0;
  const pushText = (value) => {
    if (value) events.push({ type: 'text', value: decodeEntities(value), stack: stack.slice() });
  };
  while (i < n) {
    const lt = html.indexOf('<', i);
    if (lt === -1) {
      pushText(html.slice(i));
      break;
    }
    pushText(html.slice(i, lt));
    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt + 4);
      i = end === -1 ? n : end + 3;
      continue;
    }
    if (html[lt + 1] === '!' || html[lt + 1] === '?') {
      const end = html.indexOf('>', lt);
      i = end === -1 ? n : end + 1;
      events.push({ type: 'boundary' });
      continue;
    }
    const m = /^<(\/?)([a-zA-Z][a-zA-Z0-9:-]*)/.exec(html.slice(lt, lt + 80));
    if (!m) {
      pushText('<');
      i = lt + 1;
      continue;
    }
    let j = lt + m[0].length;
    let quote = null;
    while (j < n) {
      const c = html[j];
      if (quote) {
        if (c === quote) quote = null;
      } else if (c === '"' || c === "'") quote = c;
      else if (c === '>') break;
      j++;
    }
    const tagSource = html.slice(lt, j + 1);
    i = j + 1;
    const name = m[2].toLowerCase();
    if (m[1] === '/') {
      const at = stack.lastIndexOf(name);
      if (at !== -1) stack.length = at;
      events.push({ type: 'close', name });
      continue;
    }
    const attrs = parseAttributes(tagSource, m[2].length);
    if (name === 'script' || name === 'style') {
      const closeRe = new RegExp(`</${name}\\s*>`, 'i');
      const rest = html.slice(i);
      const cm = closeRe.exec(rest);
      const body = cm ? rest.slice(0, cm.index) : rest;
      i = cm ? i + cm.index + cm[0].length : n;
      events.push({ type: 'raw', name, attrs, body });
      continue;
    }
    const selfClosing = tagSource.endsWith('/>');
    events.push({ type: 'open', name, attrs, parent: stack[stack.length - 1] ?? null, stack: stack.slice() });
    if (!VOID_ELEMENTS.has(name) && !selfClosing) stack.push(name);
  }
  return events;
}

export function isJsonLd(event) {
  return event.type === 'raw' && event.name === 'script' && /application\/ld\+json/i.test(event.attrs.type ?? '');
}

// Visible text with a space at every tag boundary and whitespace runs collapsed.
export function visibleText(events) {
  const parts = [];
  for (const e of events) {
    if (e.type === 'text') parts.push(e.value);
    else parts.push(' ');
  }
  return parts.join('').replace(/\s+/g, ' ').trim();
}

// Every string value in a JSON-LD block (or the raw text when it does not parse).
export function jsonLdStrings(body) {
  const out = [];
  try {
    const walk = (v) => {
      if (typeof v === 'string') out.push(v);
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === 'object') Object.values(v).forEach(walk);
    };
    walk(JSON.parse(body));
  } catch {
    out.push(body);
  }
  return out;
}
