#!/usr/bin/env node
// Replace internal links to /calculators/* paths that 308-redirect or 404
// with their canonical equivalents. Uses negative lookahead so partial
// matches inside the canonical path don't get mangled.

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const srcDir = join(repoRoot, 'src');

// Order matters: do the longest/most-specific replacements first so they
// don't get partially clobbered by shorter ones.
const rewrites = [
  // wrong slug entirely
  ['/calculators/motor-circuit-calculator', '/calculators/motor-circuit'],
  ['/calculators/motor-calculator', '/calculators/motor-circuit'],
  // wrong base name
  ['/calculators/kw-to-amps', '/calculators/kilowatts-to-amps-calculator'],
  ['/calculators/ac-wire-size', '/calculators/air-conditioner-calculator'],
  ['/calculators/ground-wire-size', '/calculators/ground-wire-calculator'],
  ['/calculators/garage-subpanel-wire-size', '/calculators/garage-subpanel-calculator'],
  // missing -calculator suffix (308 redirects in next.config.ts)
  ['/calculators/amps-to-watts', '/calculators/amps-to-watts-calculator'],
  ['/calculators/watts-to-amps', '/calculators/watts-to-amps-calculator'],
  ['/calculators/ohms-law', '/calculators/ohms-law-calculator'],
  ['/calculators/conduit-fill', '/calculators/conduit-fill-calculator'],
  ['/calculators/three-phase', '/calculators/three-phase-calculator'],
  ['/calculators/pool-pump', '/calculators/pool-pump-calculator'],
  ['/calculators/horsepower-to-amps', '/calculators/horsepower-to-amps-calculator'],
  // missing suffix that AREN'T currently redirects (would 404):
  ['/calculators/kilowatts-to-amps', '/calculators/kilowatts-to-amps-calculator'],
  ['/calculators/kva-to-amps', '/calculators/kva-to-amps-calculator'],
];

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(tsx?|md|json)$/.test(entry.name)) yield full;
  }
}

let totalChanges = 0;
const perFile = [];

for (const file of walk(srcDir)) {
  let src = readFileSync(file, 'utf8');
  let fileChanges = 0;
  for (const [from, to] of rewrites) {
    // Build a regex: escape special chars in `from`, then add a negative
    // lookahead for any character that could extend the slug (alphanumerics
    // and hyphens). This makes /calculators/amps-to-watts NOT match the
    // longer /calculators/amps-to-watts-calculator.
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped + '(?![a-zA-Z0-9-])', 'g');
    const before = src;
    src = src.replace(re, to);
    if (src !== before) {
      const count = (before.match(re) || []).length;
      fileChanges += count;
    }
  }
  if (fileChanges) {
    writeFileSync(file, src);
    totalChanges += fileChanges;
    perFile.push({ file: relative(repoRoot, file), changes: fileChanges });
  }
}

console.log(`Total replacements: ${totalChanges}\n`);
for (const { file, changes } of perFile) {
  console.log(`  ${changes}\t${file}`);
}
