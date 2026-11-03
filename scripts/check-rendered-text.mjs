#!/usr/bin/env node
// WSZ-003b gate a: nothing written for the builder reaches the reader (content-page "Rendering rules"). Node built-ins
// only. Run after `rm -rf .next && npm run build` (postbuild runs it). Enforced site-wide: exits 1 on any hit the
// allowlist doesn't cover.
//
// Inputs:
//   1. Every prerendered live page in .next/server/app (the withdrawn routes skipped): <title>, the meta description,
//      og:* and twitter:* meta tags, alt, title and aria-label attributes, visible text (SVG <text> included; a space
//      at every tag boundary) and the string values of JSON-LD blocks. Other scripts, <style> and <noscript> are
//      skipped (scripts/lib/build-output.mjs).
//   2. public/llms.txt.
//   3. The rendered text of the OG image sources (src/app/**/opengraph-image.* and twitter-image.*): JSX text and the
//      `alt` export.
// Rules (scripts/lib/gate-rules.mjs): spec vocabulary, status notes, self-praise and UK spellings as whole words
// (plurals included); a digit run into a letter or into %, °C or °F (wye designations such as "480Y/277", ordinals,
// plane angles, URLs, hashes and ISO dates excepted); a closing inline tag run into a letter ("Q:</span>What").
// Exceptions: scripts/check-rendered-text.allow.txt, one per line: `<route or file> | <matched text> | <reason>`.

import { readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { repoRoot, rel, walkFiles, livePages, withdrawnRoutes, tokenizeHtml, visibleText, pageTexts } from './lib/build-output.mjs';
import { inlineJoinHits, ogSourceTexts, parseAllowlist, textHits } from './lib/gate-rules.mjs';

const allowPath = join(repoRoot, 'scripts', 'check-rendered-text.allow.txt');
const allowlist = existsSync(allowPath) ? parseAllowlist(readFileSync(allowPath, 'utf8'), 'check-rendered-text.allow.txt') : [];

const hits = [];
const used = new Set();
function keep(where, hit) {
  const entry = allowlist.find((a) => (a.where === '*' || a.where === where) && a.match === hit.match.toLowerCase());
  if (entry) used.add(entry);
  return !entry;
}
function check(where, part, text) {
  for (const h of textHits(text)) {
    if (!keep(where, h)) continue;
    const context = text.slice(Math.max(0, h.index - 50), h.index + h.match.length + 50).replace(/\s+/g, ' ');
    hits.push({ where, part, ...h, context });
  }
}

// 1. Live pages
const pages = livePages();
for (const { file, route } of pages) {
  const events = tokenizeHtml(readFileSync(file, 'utf8'));
  for (const { part, text } of pageTexts(events)) check(route, part, text);
  check(route, 'text', visibleText(events));
  for (const h of inlineJoinHits(events)) if (keep(route, h)) hits.push({ where: route, part: 'markup', ...h, context: h.match });
}

// 2. llms.txt
const llms = join(repoRoot, 'public', 'llms.txt');
check(rel(llms), 'file', readFileSync(llms, 'utf8'));

// 3. OG image sources
const ogSources = walkFiles(join(repoRoot, 'src', 'app'), (f) => /^(opengraph|twitter)-image\.(tsx|ts|jsx|js)$/.test(basename(f)));
for (const file of ogSources) for (const text of ogSourceTexts(readFileSync(file, 'utf8'))) check(rel(file), 'OG image text', text);

for (const h of hits) console.log(`${h.where} [${h.part}] ${h.category}: "${h.match}" … ${h.context}`);
const unused = allowlist.filter((a) => !used.has(a));
for (const a of unused) console.log(`allowlist line matches nothing: ${a.where} | ${a.match}`);
const byCategory = new Map();
for (const h of hits) byCategory.set(h.category, (byCategory.get(h.category) ?? 0) + 1);
console.log('');
console.log(`check-rendered-text: ${hits.length} hit(s)${byCategory.size ? ` (${[...byCategory].map(([c, n]) => `${c} ${n}`).join(', ')})` : ''}`);
console.log(`  live prerendered pages: ${pages.length} (${withdrawnRoutes().length} withdrawn routes skipped)`);
console.log(`  files: ${rel(llms)}, ${ogSources.map(rel).join(', ')}`);
console.log(`  allowlist entries: ${allowlist.length} (${allowlist.length - unused.length} in use)`);
process.exit(hits.length ? 1 : 0);
