#!/usr/bin/env node
// One-time script: add per-page alternates.canonical to every page.tsx in src/app.
// - Uses relative paths (resolved against metadataBase set in layout.tsx).
// - Converts existing absolute https://wiresizes.com/... canonicals to relative.
// - Skips 'use client' pages (they cannot export metadata; handled separately).
// - Skips dynamic [slug] route (slated for deletion).

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const appDir = join(repoRoot, 'src', 'app');

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name === 'page.tsx') yield full;
  }
}

function pathFromFile(file) {
  // /…/src/app/calculators/wire-size-calculator/page.tsx → /calculators/wire-size-calculator
  // /…/src/app/page.tsx → /
  const rel = relative(appDir, file).replace(/\/page\.tsx$/, '');
  if (rel === 'page.tsx' || rel === '') return '/';
  if (rel.includes('[')) return null; // dynamic route — skip
  return '/' + rel;
}

const results = { added: [], converted: [], skipped: [], unchanged: [] };

for (const file of walk(appDir)) {
  const path = pathFromFile(file);
  if (!path) {
    results.skipped.push({ file, reason: 'dynamic route' });
    continue;
  }

  let src = readFileSync(file, 'utf8');

  if (/^['"]use client['"]/m.test(src.split('\n').slice(0, 2).join('\n'))) {
    results.skipped.push({ file, reason: 'use client (needs server-wrapper refactor)' });
    continue;
  }

  // Locate the metadata export. Support `export const metadata: Metadata = {`
  // and `export const metadata = {`.
  const metaStart = src.search(/export\s+const\s+metadata\s*(?::\s*Metadata\s*)?=\s*\{/);
  if (metaStart === -1) {
    results.skipped.push({ file, reason: 'no metadata export' });
    continue;
  }

  // Find matching closing brace for the metadata object.
  let depth = 0;
  let i = src.indexOf('{', metaStart);
  let metaEnd = -1;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        metaEnd = i;
        break;
      }
    }
  }
  if (metaEnd === -1) {
    results.skipped.push({ file, reason: 'unmatched braces in metadata' });
    continue;
  }

  const metaBlock = src.slice(metaStart, metaEnd + 1);

  // Already has alternates? Try to normalize absolute https://wiresizes.com URLs to relative.
  if (/\balternates\s*:/.test(metaBlock)) {
    const absoluteRe = /canonical\s*:\s*['"]https:\/\/(?:www\.)?wiresizes\.com(\/[^'"]*)?['"]/;
    const m = metaBlock.match(absoluteRe);
    if (m) {
      const desired = m[1] && m[1].length > 0 ? m[1] : '/';
      const replaced = metaBlock.replace(absoluteRe, `canonical: '${desired}'`);
      if (replaced !== metaBlock) {
        const expected = path === '/' ? '/' : path;
        src = src.slice(0, metaStart) + replaced + src.slice(metaEnd + 1);
        writeFileSync(file, src);
        if (desired !== expected) {
          results.converted.push({ file, from: m[0], toPath: desired, expectedPath: expected, mismatch: true });
        } else {
          results.converted.push({ file, from: m[0], toPath: desired });
        }
        continue;
      }
    }
    results.unchanged.push({ file, reason: 'has alternates already' });
    continue;
  }

  // Inject alternates just before the metadata's closing brace.
  // Determine indentation by looking at the line before the closing brace.
  const lineStart = src.lastIndexOf('\n', metaEnd - 1) + 1;
  const closingLine = src.slice(lineStart, metaEnd);
  const indent = (closingLine.match(/^[ \t]*/) || [''])[0];
  // Sibling-property indent matches the closing brace's indent + 2 spaces typically;
  // most files use 2-space indent inside metadata. Default to 2-space if closing brace is at column 0.
  const propIndent = indent.length === 0 ? '  ' : indent + '  ';

  // Insert before metaEnd; ensure a leading newline.
  const before = src.slice(0, metaEnd);
  const after = src.slice(metaEnd);
  // Make sure we don't end up with weird trailing content right at the brace.
  const trimmedBefore = before.replace(/[ \t]*\n*$/, '\n');
  const insertion = `${propIndent}alternates: { canonical: '${path}' },\n${indent}`;
  src = trimmedBefore + insertion + after;
  writeFileSync(file, src);
  results.added.push({ file, path });
}

const fmt = (arr) => arr.map(r => `  ${r.path || r.toPath || r.reason || ''}\t${relative(repoRoot, r.file)}`).join('\n');
console.log(`Added (${results.added.length}):\n${fmt(results.added)}\n`);
console.log(`Converted to relative (${results.converted.length}):\n${fmt(results.converted)}\n`);
console.log(`Unchanged with existing alternates (${results.unchanged.length}):\n${fmt(results.unchanged)}\n`);
console.log(`Skipped (${results.skipped.length}):\n${fmt(results.skipped)}\n`);
