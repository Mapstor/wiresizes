#!/usr/bin/env node
// Wire getArticleDates(...) into every guide's articleData declaration.
// Idempotent: safe to re-run; skips files that already import it.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

// Server-component guides — articleData is at module scope in page.tsx.
const SERVER_GUIDES = [
  'src/app/guides/nec-code-compliance/page.tsx',
  'src/app/guides/wire-size-for-200-amp/page.tsx',
  'src/app/guides/nec-table-310-16/page.tsx',
  'src/app/guides/electrical-power-calculations/page.tsx',
  'src/app/guides/awg-wire-size-chart/page.tsx',
  'src/app/guides/wire-size-for-ev-charger/page.tsx',
  'src/app/guides/wire-size-for-100-amp/page.tsx',
];

let totalEdits = 0;

for (const rel of SERVER_GUIDES) {
  const file = join(repoRoot, rel);
  let src = readFileSync(file, 'utf8');
  let changed = false;

  // 1. Add `import { getArticleDates } from '@/lib/article-dates';` after the
  //    existing seo schema import line (if not already present).
  if (!/from ['"]@\/lib\/article-dates['"]/.test(src)) {
    const replaced = src.replace(
      /(import \{ Article(?:FAQ)?Schema \} from '@\/components\/seo\/Article(?:FAQ)?Schema'[;\n])/,
      (m) => `${m}import { getArticleDates } from '@/lib/article-dates';\n`,
    );
    if (replaced !== src) {
      src = replaced;
      changed = true;
    }
  }

  // 2. Inject `...getArticleDates('<path>'),` into the articleData object.
  //    Match `const articleData = { ... }` (multi-line, balanced braces).
  if (!/getArticleDates\(/.test(src)) {
    const startIdx = src.search(/const articleData\s*=\s*\{/);
    if (startIdx !== -1) {
      // Find matching closing brace for that object.
      let i = src.indexOf('{', startIdx);
      let depth = 0;
      let endIdx = -1;
      for (; i < src.length; i++) {
        const c = src[i];
        if (c === '{') depth++;
        else if (c === '}') {
          depth--;
          if (depth === 0) {
            endIdx = i;
            break;
          }
        }
      }
      if (endIdx !== -1) {
        // Look at the line before the closing brace to determine indent +
        // whether a trailing comma is needed before our spread.
        const lineStart = src.lastIndexOf('\n', endIdx - 1) + 1;
        const beforeEnd = src.slice(lineStart, endIdx);
        const indent = (beforeEnd.match(/^[ \t]*/) || [''])[0];
        const propIndent = indent.length === 0 ? '  ' : indent;
        // Ensure the previous property has a trailing comma.
        const beforeBraceText = src.slice(0, endIdx);
        const trimmed = beforeBraceText.replace(/[ \t]*\n*$/, '');
        const lastChar = trimmed[trimmed.length - 1];
        const needComma = lastChar !== ',' && lastChar !== '{';
        const spread = `${propIndent}...getArticleDates('${rel}'),\n${indent}`;
        const insertion = `${needComma ? ',\n' : '\n'}${spread}`;
        src = trimmed + insertion + src.slice(endIdx);
        changed = true;
      }
    }
  }

  if (changed) {
    writeFileSync(file, src);
    totalEdits++;
    console.log(`  updated ${rel}`);
  } else {
    console.log(`  skipped ${rel} (already has dates)`);
  }
}

console.log(`\n${totalEdits} file(s) updated.`);
