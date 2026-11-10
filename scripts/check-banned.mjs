#!/usr/bin/env node
// WSZ-002 gate: no phrase from research/wsz002-banned-strings.txt (case-insensitive) and no "$" followed by a
// digit may appear in what the site publishes. Run after `rm -rf .next && npm run build`. Exits 1 on any hit.
//
// Inputs:
//   1. Every prerendered HTML file (.next/server/app, or .next/server/route-cache in an adapter build such as
//      Vercel's; scripts/lib/build-output.mjs): visible text (a space at every tag boundary, whitespace
//      collapsed), every attribute value, and the string values of JSON-LD blocks. Other <script> bodies (the RSC
//      payload holds $-prefixed tokens) and <style> bodies are skipped.
//   2. sitemap.xml (build output), public/robots.txt, public/llms.txt, public/manifest.json and the source text
//      of src/app/opengraph-image.tsx.
//   3. The source of every .ts/.tsx module a live route imports under src/components and src/lib, found by
//      following import declarations, `export … from` re-exports and import() calls from the live page.tsx files,
//      their layouts and the root not-found/error files. The components of the withdrawn routes are skipped by
//      name. Only string literals, template-literal text and JSX text are checked; module specifiers are skipped.
//      Template or JSX text that ends in "$" right before an interpolated value counts as a "$" amount too.
//      Reachable modules elsewhere (the entry files themselves, src/app helpers such as GuideClient.tsx,
//      src/utils, src/data) are checked the same way and counted separately.
//   4. (WSZ-014; every module since WSZ-015) No .ts/.tsx module under src/ may call alert(), confirm() or prompt(),
//      reachable from a live route or not (the withdrawn components too): call expressions in code, bare or on
//      window, globalThis or self; strings and comments don't count.
// Exceptions: scripts/check-banned.allow.txt, one per line: `<file> | <matched text> | <reason>` (file may be *).

import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import ts from 'typescript';
import {
  repoRoot, rel, walkFiles, htmlPages, bodyFile, withdrawnRoutes, tokenizeHtml, isJsonLd, visibleText, jsonLdStrings,
} from './lib/build-output.mjs';

const WITHDRAWN_COMPONENTS = new Set([
  'RangeCalculator', 'WelderCalculator', 'BoxFillCalculator', 'ClientBoxFillCalculator', 'WellPumpCalculator',
  'HotTubCalculator', 'PoolPumpCalculator', 'AirConditionerCalculator', 'DryerCalculator', 'MotorCircuitCalculator',
  'HorsepowerToAmpsCalculator', 'CircuitBreakerCalculator', 'ConduitFillCalculator', 'ResidentialLoadCalculator',
  'RVHookupCalculator', 'GarageSubpanelCalculator', 'ClientGarageSubpanelCalculator',
]);

const phrases = readFileSync(join(repoRoot, 'research', 'wsz002-banned-strings.txt'), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'));
const lowered = phrases.map((p) => p.toLowerCase());

const allowPath = join(repoRoot, 'scripts', 'check-banned.allow.txt');
const allow = existsSync(allowPath)
  ? readFileSync(allowPath, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => {
        const [file, match, reason] = l.split('|').map((s) => s.trim());
        if (!file || !match || !reason) throw new Error(`check-banned.allow.txt: need "<file> | <match> | <reason>": ${l}`);
        return { file, match: match.toLowerCase() };
      })
  : [];

const hits = [];
function report(file, where, match, context) {
  const f = rel(file);
  if (allow.some((a) => (a.file === '*' || a.file === f) && a.match === match.toLowerCase())) return;
  hits.push({ file: f, where, match, context: context.replace(/\s+/g, ' ').slice(0, 140) });
}

function snippet(text, at, len) {
  return text.slice(Math.max(0, at - 50), at + len + 50);
}

function checkText(file, where, text) {
  const low = text.toLowerCase();
  lowered.forEach((p, k) => {
    let at = low.indexOf(p);
    while (at !== -1) {
      report(file, where, phrases[k], snippet(text, at, p.length));
      at = low.indexOf(p, at + p.length);
    }
  });
  const re = /\$\d/g;
  let m;
  while ((m = re.exec(text))) report(file, where, m[0], snippet(text, m.index, 2));
}

// 1. Prerendered HTML
const pages = htmlPages();
for (const { file } of pages) {
  const events = tokenizeHtml(readFileSync(file, 'utf8'));
  checkText(file, 'text', visibleText(events));
  for (const e of events) {
    if (e.type === 'open') {
      for (const [name, value] of Object.entries(e.attrs)) if (value) checkText(file, `<${e.name} ${name}>`, value);
    } else if (isJsonLd(e)) {
      for (const s of jsonLdStrings(e.body)) checkText(file, 'JSON-LD', s);
    } else if (e.type === 'raw' && e.name === 'script') {
      for (const [name, value] of Object.entries(e.attrs)) if (value) checkText(file, `<script ${name}>`, value);
    }
  }
}

// 2. Text files
const sitemapBody = bodyFile('/sitemap.xml');
if (!sitemapBody) throw new Error('missing input: the prerendered /sitemap.xml (sitemap.xml.body)');
const textFiles = [
  sitemapBody,
  join(repoRoot, 'public', 'robots.txt'),
  join(repoRoot, 'public', 'llms.txt'),
  join(repoRoot, 'public', 'manifest.json'),
  join(repoRoot, 'src', 'app', 'opengraph-image.tsx'),
];
for (const file of textFiles) {
  if (!existsSync(file)) throw new Error(`missing input: ${rel(file)}`);
  checkText(file, 'file', readFileSync(file, 'utf8'));
}

// 3. Source reachable from the live routes
const srcDir = join(repoRoot, 'src');
const appDir = join(srcDir, 'app');
const withdrawn = new Set(withdrawnRoutes());

function routeOf(pageFile) {
  const r = rel(dirname(pageFile)).replace(/^src\/app/, '');
  return r === '' ? '/' : r;
}

const entries = [];
for (const page of walkFiles(appDir, (f) => basename(f) === 'page.tsx')) {
  if (withdrawn.has(routeOf(page))) continue;
  entries.push(page);
  // layouts on the route's path
  let dir = dirname(page);
  while (dir.startsWith(appDir)) {
    const layout = join(dir, 'layout.tsx');
    if (existsSync(layout) && !entries.includes(layout)) entries.push(layout);
    if (dir === appDir) break;
    dir = dirname(dir);
  }
}
for (const special of ['not-found.tsx', 'error.tsx', 'global-error.tsx']) {
  const f = join(appDir, special);
  if (existsSync(f)) entries.push(f);
}

const RESOLVE_SUFFIXES = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];
function resolveSpecifier(spec, fromFile) {
  let base;
  if (spec.startsWith('@/')) base = join(srcDir, spec.slice(2));
  else if (spec.startsWith('./') || spec.startsWith('../')) base = join(dirname(fromFile), spec);
  else return null;
  for (const suffix of RESOLVE_SUFFIXES) {
    const candidate = base + suffix;
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return ['.ts', '.tsx'].includes(extname(candidate)) ? candidate : null;
    }
  }
  return null;
}

function parse(file) {
  const text = readFileSync(file, 'utf8');
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
}

function moduleSpecifierNodes(sf) {
  const specs = new Set();
  const visit = (node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) specs.add(node.moduleSpecifier);
    else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0]) specs.add(node.arguments[0]);
    else if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) specs.add(node.moduleReference.expression);
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return specs;
}

const reachable = new Map(); // file -> SourceFile
const queue = [...entries];
while (queue.length) {
  const file = queue.shift();
  if (reachable.has(file)) continue;
  const sf = parse(file);
  reachable.set(file, sf);
  for (const node of moduleSpecifierNodes(sf)) {
    if (!ts.isStringLiteralLike(node)) continue;
    const target = resolveSpecifier(node.text, file);
    if (!target || reachable.has(target)) continue;
    if (WITHDRAWN_COMPONENTS.has(basename(target).replace(/\.tsx?$/, ''))) continue;
    queue.push(target);
  }
}

const DIALOGS = new Set(['alert', 'confirm', 'prompt']);
const GLOBAL_OBJECTS = new Set(['window', 'globalThis', 'self']);
const dialogCalls = [];

// alert(…), window.alert(…), window['alert'](…) and the same for confirm and prompt
function dialogCallName(node) {
  if (!ts.isCallExpression(node)) return null;
  const callee = node.expression;
  if (ts.isIdentifier(callee) && DIALOGS.has(callee.text)) return callee.text;
  const onGlobal = (expr) => ts.isIdentifier(expr) && GLOBAL_OBJECTS.has(expr.text);
  if (ts.isPropertyAccessExpression(callee) && DIALOGS.has(callee.name.text) && onGlobal(callee.expression)) {
    return `${callee.expression.text}.${callee.name.text}`;
  }
  if (
    ts.isElementAccessExpression(callee) &&
    ts.isStringLiteralLike(callee.argumentExpression) &&
    DIALOGS.has(callee.argumentExpression.text) &&
    onGlobal(callee.expression)
  ) {
    return `${callee.expression.text}['${callee.argumentExpression.text}']`;
  }
  return null;
}

function lineOf(sf, node) {
  return sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
}

function checkDialogs(file, sf) {
  const visit = (node) => {
    const dialog = dialogCallName(node);
    if (dialog) dialogCalls.push({ file: rel(file), line: lineOf(sf, node), name: dialog });
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

function checkSource(file, sf) {
  const skip = moduleSpecifierNodes(sf);
  const visit = (node) => {
    if (skip.has(node)) return;
    let text = null;
    let endsBeforeValue = false;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) text = node.text;
    else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node)) {
      text = node.text;
      endsBeforeValue = true;
    } else if (ts.isTemplateTail(node)) text = node.text;
    else if (ts.isJsxText(node)) {
      text = node.text;
      const parent = node.parent;
      const siblings = parent && 'children' in parent ? parent.children : null;
      if (siblings) {
        const k = siblings.indexOf(node);
        endsBeforeValue = k !== -1 && siblings[k + 1] && ts.isJsxExpression(siblings[k + 1]);
      }
    }
    if (text !== null) {
      checkText(file, `line ${lineOf(sf, node)}`, text);
      if (endsBeforeValue && /\$\s*$/.test(text)) report(file, `line ${lineOf(sf, node)}`, '$ before a value', text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

let libCount = 0;
let otherCount = 0;
const componentsDir = join(srcDir, 'components');
const libDir = join(srcDir, 'lib');
for (const [file, sf] of reachable) {
  if (file.startsWith(componentsDir) || file.startsWith(libDir)) libCount++;
  else otherCount++;
  checkSource(file, sf);
}

// 4. Dialog calls in every module under src/
const allModules = walkFiles(srcDir, (f) => ['.ts', '.tsx'].includes(extname(f)));
for (const file of allModules) checkDialogs(file, reachable.get(file) ?? parse(file));

for (const h of hits) console.log(`${h.file} [${h.where}] "${h.match}" … ${h.context}`);
for (const d of dialogCalls) console.log(`${d.file} [line ${d.line}] ${d.name}() call`);
console.log('');
console.log(`check-banned: ${hits.length} hit(s)`);
console.log(`  alert(), confirm() and prompt() calls in the ${allModules.length} .ts/.tsx modules under src/: ${dialogCalls.length}`);
console.log(`  prerendered HTML files: ${pages.length}`);
console.log(`  text files (sitemap.xml, robots.txt, llms.txt, manifest.json, opengraph-image.tsx): ${textFiles.length}`);
console.log(`  source modules under src/components and src/lib reachable from live routes: ${libCount}`);
console.log(`  other source modules reachable from live routes (entries, src/app helpers, src/utils, src/data): ${otherCount}`);
console.log(`  phrases: ${phrases.length}, allowlist entries: ${allow.length}`);
process.exit(hits.length || dialogCalls.length ? 1 : 0);
