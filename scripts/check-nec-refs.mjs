#!/usr/bin/env node
// WSZ-003b gate c: every NEC reference in a live page's rendered text ("Table 310.16", "310.12", "240.4(D)",
// "Article 120") matches a ref of research/nec-sections-allowlist.csv. A held ref (625.54, D-09) does not count as
// allowed. Node built-ins only. Run after `rm -rf .next && npm run build` (postbuild runs it).
//
// Rendered text: <title>, the meta description, og:* and twitter:* meta tags, alt, title and aria-label attributes,
// visible text and JSON-LD string values (scripts/lib/build-output.mjs). References (scripts/lib/gate-rules.mjs
// necRefs): section numbers after "Table", "NEC", "Section" or "§" (lists and ranges included), "Article N", and bare
// section numbers with a subdivision ("240.4(D)") or in an article the allowlist uses ("310.12"). A number followed
// by a unit is a measurement, not a reference ("120.5 V", "17.002 Ω·cmil/ft").
// Text whose nearest data-src is a verified domain outside the NEC (NIST, IEC and other physics or unit sources) is a
// measurement, never a reference, and is not read (WSZ-005a: the AWG chart's "250.5" Ω per 1,000 ft for 33 AWG at
// 75 °C). Text cited to an nec-* domain, an engine or nothing is read as before.
// Prints the hits per route. Fails only for routes in scripts/gates.config.json necRefs.enforce.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gatesConfig, livePages, pageTexts, parseCsv, registryRows, repoRoot, tokenizeHtml, visibleText, withdrawnRoutes } from './lib/build-output.mjs';
import { necRefs } from './lib/gate-rules.mjs';

const rows = parseCsv(readFileSync(join(repoRoot, 'research', 'nec-sections-allowlist.csv'), 'utf8'));
const allowedRefs = new Set(rows.filter((row) => row.status !== 'held').map((row) => row.ref.trim()));
const heldRefs = new Set(rows.filter((row) => row.status === 'held').map((row) => row.ref.trim()));
// the articles the allowlist uses: a bare section number in one of them counts as a reference
const articles = new Set(rows.map((row) => Number(row.ref.replace(/^Article\s+/, '').split('.')[0])));
const enforce = new Set(gatesConfig().necRefs?.enforce ?? []);

const measurementDomains = new Set([...registryRows()].filter(([domain, row]) => row.status === 'verified' && !domain.startsWith('nec-')).map(([domain]) => domain));
/** The events with the text of measurement-cited elements blanked. */
function withoutMeasurements(events) {
  return events.map((e) => {
    if (e.type !== 'text') return e;
    for (let k = e.ancestors.length - 1; k >= 0; k--) {
      const src = e.ancestors[k].attrs['data-src'];
      if (src === undefined) continue;
      return measurementDomains.has(src) ? { ...e, value: ' ' } : e;
    }
    return e;
  });
}

const pages = livePages();
const missing = [...enforce].filter((route) => !pages.some((p) => p.route === route));
const failures = [];
const zeroHit = [];
let refCount = 0;
for (const { file, route } of pages) {
  const events = tokenizeHtml(readFileSync(file, 'utf8'));
  const texts = [{ part: 'text', text: visibleText(withoutMeasurements(events)) }, ...pageTexts(events)];
  const hits = new Map();
  for (const { part, text } of texts) {
    for (const { ref } of necRefs(text, articles)) {
      refCount++;
      if (allowedRefs.has(ref)) continue;
      const key = `${ref}${heldRefs.has(ref) ? ' (held)' : ''} [${part}]`;
      hits.set(key, (hits.get(key) ?? 0) + 1);
    }
  }
  const count = [...hits.values()].reduce((a, b) => a + b, 0);
  const enforced = enforce.has(route);
  const list = [...hits].map(([key, n]) => (n > 1 ? `${key} ×${n}` : key)).join(', ');
  console.log(`${enforced ? 'enforced' : 'report  '}  ${route}: ${count} hit(s)${list ? `: ${list}` : ''}`);
  if (count === 0) zeroHit.push(route);
  if (enforced && count) failures.push(`${route}: ${list}`);
}

for (const route of missing) console.log(`enforced route without a live page: ${route}`);
for (const line of failures) console.log(`FAIL ${line}`);
console.log('');
console.log(`check-nec-refs: ${failures.length} enforced route(s) with references outside the allowlist`);
console.log(`  live prerendered pages: ${pages.length} (${withdrawnRoutes().length} withdrawn routes skipped); enforced routes: ${enforce.size}`);
console.log(`  references read: ${refCount}; allowlist refs: ${allowedRefs.size} (+${heldRefs.size} held); routes with 0 hits: ${zeroHit.length}`);
process.exit(failures.length || missing.length ? 1 : 0);
