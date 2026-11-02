#!/usr/bin/env node
// WSZ-003a: a text snapshot of every prerendered page (live and withdrawn), so a refactor can prove it changed nothing
// a reader or a crawler sees. Node built-ins only. Run after `rm -rf .next && npm run build`:
//   node scripts/snapshot-pages.mjs <dir>        (then `diff -r <before> <after>`)
// One file per page, named after its route ("/" → index.txt, "/guides/nec-table-310-16" → guides__nec-table-310-16.txt),
// holding the title, meta description, robots, canonical, og:title and og:description, the visible text of <body> (one
// text run per line: the text between two tags, comments ignored, ASCII whitespace collapsed, non-breaking spaces
// kept) and every JSON-LD string value. Nothing else: no scripts, hashes, build ids or x-build.

import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { htmlPages, isJsonLd, jsonLdStrings, tokenizeHtml } from './lib/build-output.mjs';

const outDir = process.argv[2];
if (!outDir) {
  console.error('usage: node scripts/snapshot-pages.mjs <dir>');
  process.exit(2);
}

const collapse = (s) => s.replace(/[ \t\n\r\f]+/g, ' ').trim();

function fileName(route) {
  return `${route === '/' ? 'index' : route.slice(1).split('/').join('__')}.txt`;
}

function snapshot(html) {
  const events = tokenizeHtml(html);
  const head = { title: [], description: [], robots: [], canonical: [], 'og:title': [], 'og:description': [] };
  const runs = [];
  const jsonLd = [];
  let run = null;
  let inTitle = false;
  let title = '';
  for (const e of events) {
    if (e.type === 'text') {
      if (inTitle) title += e.value;
      if (e.stack.includes('body')) run = (run ?? '') + e.value;
      continue;
    }
    // any tag ends the current text run
    if (run !== null) {
      const text = collapse(run);
      if (text) runs.push(text);
      run = null;
    }
    if (e.type === 'open' && e.name === 'title' && !e.stack.includes('body')) {
      inTitle = true;
      title = '';
    } else if (e.type === 'close' && e.name === 'title' && inTitle) {
      inTitle = false;
      head.title.push(collapse(title));
    } else if (e.type === 'open' && e.name === 'meta') {
      const name = (e.attrs.name ?? '').toLowerCase();
      const property = (e.attrs.property ?? '').toLowerCase();
      if (name === 'description' || name === 'robots') head[name].push(e.attrs.content ?? '');
      if (property === 'og:title' || property === 'og:description') head[property].push(e.attrs.content ?? '');
    } else if (e.type === 'open' && e.name === 'link' && (e.attrs.rel ?? '').toLowerCase() === 'canonical') {
      head.canonical.push(e.attrs.href ?? '');
    } else if (isJsonLd(e)) {
      jsonLd.push(...jsonLdStrings(e.body));
    }
  }
  if (run !== null && collapse(run)) runs.push(collapse(run));

  const lines = [];
  for (const [key, values] of Object.entries(head)) {
    if (values.length === 0) lines.push(`${key}: (none)`);
    for (const value of values) lines.push(`${key}: ${value}`);
  }
  lines.push('', '--- visible text', ...runs, '', '--- JSON-LD strings', ...jsonLd);
  return `${lines.join('\n')}\n`;
}

mkdirSync(resolve(outDir), { recursive: true });
const pages = htmlPages();
for (const page of pages) {
  writeFileSync(join(resolve(outDir), fileName(page.route)), snapshot(readFileSync(page.file, 'utf8')));
}
console.log(`snapshot-pages: ${pages.length} files in ${resolve(outDir)}`);
