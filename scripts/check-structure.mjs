#!/usr/bin/env node
// WSZ-002 gate: structural checks on the Next.js build output (checks 11–15 added in WSZ-014). Node built-ins only.
// Run after `rm -rf .next && npm run build`. Prints a PASS/FAIL line per check and exits 1 on any FAIL.

import { readFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import {
  repoRoot, appOutDir, rel, htmlPages, withdrawnRoutes, configRedirects, tokenizeHtml, isJsonLd, visibleText,
  jsonLdStrings, walkFiles, SITE_ORIGIN,
} from './lib/build-output.mjs';

const NEW_REDIRECTS = [
  ['/calculators/ev-charger-calculator', '/guides/wire-size-for-ev-charger'],
  ['/calculators/ev-charger-wire-size-calculator', '/guides/wire-size-for-ev-charger'],
  ['/calculators/hot-tub-wire-size-calculator', '/calculators/hot-tub-calculator'],
  ['/calculators/electrical-load-calculator', '/calculators/residential-load-calculator'],
  ['/guides/wire-sizing-guide', '/calculators/wire-size-calculator'],
  ['/guides/electrical-safety', '/guides'],
];
const BANNED_TYPES = new Set(['FAQPage', 'HowTo', 'SearchAction', 'Review']);
const URL_KEYS = new Set(['url', '@id', 'item', 'logo', 'image']);
const MAX_DETAILS = 25;

const results = [];
function check(name, failures, summary) {
  results.push({ name, failures, summary });
  const ok = failures.length === 0;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${summary ? ` (${summary})` : ''}`);
  for (const f of failures.slice(0, MAX_DETAILS)) console.log(`        - ${f}`);
  if (failures.length > MAX_DETAILS) console.log(`        … and ${failures.length - MAX_DETAILS} more`);
}

function normalizePath(href) {
  let path = href.trim();
  if (path.startsWith(SITE_ORIGIN)) path = path.slice(SITE_ORIGIN.length) || '/';
  if (!path.startsWith('/')) return null;
  path = path.replace(/[?#].*$/, '');
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return path;
}

function sourceMatcher(source) {
  // next.config sources are plain paths here; ":param" segments match one segment, ":param*" the rest
  const pattern = source
    .split('/')
    .map((seg) => (seg.startsWith(':') ? (seg.endsWith('*') ? '.*' : '[^/]+') : seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    .join('/');
  return new RegExp(`^${pattern}$`);
}

function isSiteUrl(value) {
  return value === SITE_ORIGIN || value.startsWith(`${SITE_ORIGIN}/`);
}

// ── Load the build output ───────────────────────────────────────────────────
const pages = htmlPages().map((p) => {
  const html = readFileSync(p.file, 'utf8');
  return { ...p, html, events: tokenizeHtml(html) };
});
const withdrawn = withdrawnRoutes();
const withdrawnSet = new Set(withdrawn);
const redirects = configRedirects();
const redirectMatchers = redirects.map((r) => ({ ...r, re: sourceMatcher(r.source) }));
const sitemapFile = join(appOutDir, 'sitemap.xml.body');
const sitemap = existsSync(sitemapFile) ? readFileSync(sitemapFile, 'utf8') : '';
const sitemapLocs = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
const sitemapPaths = new Set(sitemapLocs.map((loc) => normalizePath(loc)));
const pageByRoute = new Map(pages.map((p) => [p.route, p]));
const livePages = pages.filter((p) => !withdrawnSet.has(p.route));

// 1. Withdrawn routes: noindex, follow and not in the sitemap
{
  const failures = [];
  if (!sitemap) failures.push(`no sitemap at ${rel(sitemapFile)}`);
  for (const route of withdrawn) {
    const page = pageByRoute.get(route);
    if (!page) {
      failures.push(`${route}: no prerendered HTML`);
      continue;
    }
    const robots = page.events
      .filter((e) => e.type === 'open' && e.name === 'meta' && (e.attrs.name ?? '').toLowerCase() === 'robots')
      .map((e) => (e.attrs.content ?? '').toLowerCase().replace(/\s+/g, ''));
    if (!robots.some((c) => c.split(',').includes('noindex') && c.split(',').includes('follow'))) {
      failures.push(`${route}: robots meta is ${JSON.stringify(robots)}`);
    }
    if (sitemapPaths.has(route)) failures.push(`${route}: listed in sitemap.xml`);
  }
  check('withdrawn routes have robots "noindex, follow" and are absent from sitemap.xml', failures, `${withdrawn.length} routes`);
}

// 2. No live page links to a withdrawn route or a redirect source
{
  const failures = [];
  let links = 0;
  for (const page of livePages) {
    for (const e of page.events) {
      if (e.type !== 'open' || e.name !== 'a' || e.attrs.href === undefined) continue;
      links++;
      const path = normalizePath(e.attrs.href);
      if (!path) continue;
      if (withdrawnSet.has(path)) failures.push(`${page.route} → ${e.attrs.href} (withdrawn)`);
      const redirect = redirectMatchers.find((r) => r.re.test(path));
      if (redirect) failures.push(`${page.route} → ${e.attrs.href} (redirect source ${redirect.source})`);
    }
  }
  check('no live page links to a withdrawn route or a redirect source', failures, `${livePages.length} live pages, ${links} links, ${redirects.length} redirects`);
}

// 3. next.config.ts: the six new redirects; no destination is itself a redirect source
{
  const failures = [];
  for (const [source, destination] of NEW_REDIRECTS) {
    const r = redirects.find((x) => x.source === source);
    if (!r) failures.push(`missing ${source}`);
    else {
      if (r.destination !== destination) failures.push(`${source} → ${r.destination}, expected ${destination}`);
      if (!r.permanent) failures.push(`${source} is not permanent`);
    }
  }
  for (const r of redirects) {
    const chained = redirectMatchers.find((x) => x.re.test(normalizePath(r.destination) ?? ''));
    if (chained) failures.push(`${r.source} → ${r.destination} is itself redirected by ${chained.source}`);
    if (!r.destination.startsWith('/')) failures.push(`${r.source}: destination ${r.destination} is not relative`);
    if (r.destination.length > 1 && r.destination.endsWith('/')) failures.push(`${r.source}: trailing slash`);
  }
  check('next.config.ts holds the six new redirects, one hop each', failures, `${redirects.length} redirects`);
}

// 4. Canonicals, sitemap and JSON-LD URLs on https://wiresizes.com
{
  const failures = [];
  let urls = 0;
  for (const loc of sitemapLocs) {
    urls++;
    if (!isSiteUrl(loc)) failures.push(`sitemap.xml <loc> ${loc}`);
  }
  for (const page of pages) {
    for (const e of page.events) {
      if (e.type === 'open' && e.name === 'link' && (e.attrs.rel ?? '').toLowerCase() === 'canonical') {
        urls++;
        if (!isSiteUrl(e.attrs.href ?? '')) failures.push(`${page.route}: canonical ${e.attrs.href}`);
      }
      if (!isJsonLd(e)) continue;
      let data;
      try {
        data = JSON.parse(e.body);
      } catch {
        failures.push(`${page.route}: JSON-LD block does not parse`);
        continue;
      }
      const walk = (node, key) => {
        if (typeof node === 'string') {
          if (URL_KEYS.has(key)) {
            urls++;
            if (!isSiteUrl(node)) failures.push(`${page.route}: JSON-LD ${key} ${node}`);
          }
        } else if (Array.isArray(node)) node.forEach((v) => walk(v, key));
        else if (node && typeof node === 'object') {
          for (const [k, v] of Object.entries(node)) if (k !== '@context' && k !== '@type') walk(v, k);
        }
      };
      walk(data, null);
    }
  }
  check('canonicals, sitemap <loc> and JSON-LD url/@id/item/logo/image values are on https://wiresizes.com', failures, `${urls} URLs`);
}

// 5. JSON-LD types and keys
{
  const failures = [];
  let blocks = 0;
  for (const page of pages) {
    for (const e of page.events) {
      if (!isJsonLd(e)) continue;
      blocks++;
      let data;
      try {
        data = JSON.parse(e.body);
      } catch {
        continue;
      }
      const walk = (node) => {
        if (Array.isArray(node)) node.forEach(walk);
        else if (node && typeof node === 'object') {
          const types = [].concat(node['@type'] ?? []);
          for (const t of types) if (BANNED_TYPES.has(t)) failures.push(`${page.route}: @type ${t}`);
          if ('aggregateRating' in node) failures.push(`${page.route}: aggregateRating`);
          Object.values(node).forEach(walk);
        }
      };
      walk(data);
      for (const s of jsonLdStrings(e.body)) {
        if (/creativecommons\.org/i.test(s)) failures.push(`${page.route}: creativecommons URL ${s}`);
      }
    }
  }
  check('no JSON-LD FAQPage, HowTo, SearchAction or Review, no aggregateRating, no creativecommons URL', failures, `${blocks} blocks`);
}

// 6. No Google Fonts
{
  const failures = pages
    .filter((p) => /fonts\.(googleapis|gstatic)\.com/i.test(p.html))
    .map((p) => p.route);
  check('no built page references fonts.googleapis.com or fonts.gstatic.com', failures, `${pages.length} pages`);
}

// 7. No 110.14(C) or 334.80 on a rendered page
{
  const failures = [];
  for (const page of pages) {
    const parts = [visibleText(page.events)];
    for (const e of page.events) {
      if (e.type === 'open') parts.push(...Object.values(e.attrs));
      if (isJsonLd(e)) parts.push(...jsonLdStrings(e.body));
    }
    const text = parts.join(' ');
    for (const needle of ['110.14(C)', '334.80']) if (text.includes(needle)) failures.push(`${page.route}: ${needle}`);
  }
  check('no rendered page contains "110.14(C)" or "334.80"', failures, `${pages.length} pages`);
}

// 8. No <tr> directly inside <table>
{
  const failures = [];
  for (const page of pages) {
    const n = page.events.filter((e) => e.type === 'open' && e.name === 'tr' && e.parent === 'table').length;
    if (n) failures.push(`${page.route}: ${n} <tr> directly inside <table>`);
  }
  check('no <table> has a <tr> as a direct child', failures, `${pages.length} pages`);
}

// 9. Form controls have labels; buttons have text or an aria-label
{
  const failures = [];
  let controls = 0;
  let buttons = 0;
  for (const page of pages) {
    const labelFor = new Set(
      page.events.filter((e) => e.type === 'open' && e.name === 'label' && e.attrs.for).map((e) => e.attrs.for),
    );
    const ids = new Set(page.events.filter((e) => e.type === 'open' && e.attrs.id).map((e) => e.attrs.id));
    page.events.forEach((e, index) => {
      if (e.type !== 'open') return;
      if (['input', 'select', 'textarea'].includes(e.name)) {
        if (e.name === 'input' && (e.attrs.type ?? '').toLowerCase() === 'hidden') return;
        controls++;
        const labelledBy = (e.attrs['aria-labelledby'] ?? '').split(/\s+/).filter(Boolean);
        const labelled =
          (e.attrs['aria-label'] ?? '').trim() !== '' ||
          (labelledBy.length > 0 && labelledBy.every((id) => ids.has(id))) ||
          (e.attrs.id && labelFor.has(e.attrs.id)) ||
          e.stack.includes('label');
        if (!labelled) failures.push(`${page.route}: <${e.name}${e.attrs.id ? ` id="${e.attrs.id}"` : ''}${e.attrs.name ? ` name="${e.attrs.name}"` : ''}> has no label`);
      }
      if (e.name === 'button') {
        buttons++;
        if ((e.attrs['aria-label'] ?? '').trim() || (e.attrs['aria-labelledby'] ?? '').trim()) return;
        let depth = 0;
        let text = '';
        for (let k = index; k < page.events.length; k++) {
          const t = page.events[k];
          if (t.type === 'open' && t.name === 'button') depth++;
          else if (t.type === 'close' && t.name === 'button') {
            depth--;
            if (depth === 0) break;
          } else if (t.type === 'text') text += t.value;
          else if (t.type === 'open' && t.name === 'img' && t.attrs.alt) text += t.attrs.alt;
        }
        if (!text.trim()) failures.push(`${page.route}: <button> without text or aria-label`);
      }
    });
  }
  check('every input, select and textarea has a label; every button has text or an aria-label', failures, `${controls} controls, ${buttons} buttons`);
}

// 10. Google's tag never ships in the prerendered HTML
{
  const failures = [];
  for (const page of pages) {
    for (const e of page.events) {
      if (e.type === 'raw' && e.name === 'script' && /googletagmanager\.com/i.test(`${e.attrs.src ?? ''} ${e.body}`)) {
        failures.push(`${page.route}: <script> loads googletagmanager.com`);
      }
    }
  }
  check('no prerendered page has a <script> that loads googletagmanager.com', failures, `${pages.length} pages`);
}

// ── WSZ-014 ─────────────────────────────────────────────────────────────────
const LIVE_CALCULATORS = livePages.filter((p) => p.route.startsWith('/calculators/')).map((p) => p.route);
const LIVE_GUIDES = livePages.filter((p) => p.route.startsWith('/guides/')).map((p) => p.route);
const NOT_FOUND_ROUTE = '/_not-found';
const inMain = (e) => e.stack.includes('main');

function mainLinks(page) {
  return new Set(
    page.events
      .filter((e) => e.type === 'open' && e.name === 'a' && e.attrs.href !== undefined && inMain(e))
      .map((e) => normalizePath(e.attrs.href))
      .filter(Boolean),
  );
}

// 11. Every live calculator page renders its form on the server
{
  const failures = [];
  if (LIVE_CALCULATORS.length !== 15) failures.push(`${LIVE_CALCULATORS.length} live calculator pages, expected 15`);
  for (const route of LIVE_CALCULATORS) {
    const page = pageByRoute.get(route);
    const controls = page.events.filter((e) => e.type === 'open' && (e.name === 'input' || e.name === 'select') && inMain(e));
    if (controls.length === 0) failures.push(`${route}: no <input> or <select> inside <main>`);
  }
  check('each live calculator page has an <input> or <select> inside <main> in its prerendered HTML', failures, `${LIVE_CALCULATORS.length} pages`);
}

// 12. Hubs link to every live page of their kind inside <main> (header and footer links don't count)
{
  const failures = [];
  if (LIVE_GUIDES.length !== 9) failures.push(`${LIVE_GUIDES.length} live guides, expected 9`);
  const expectLinks = (route, targets) => {
    const page = pageByRoute.get(route);
    if (!page) {
      failures.push(`${route}: no prerendered HTML`);
      return;
    }
    const links = mainLinks(page);
    for (const target of targets) if (target !== route && !links.has(target)) failures.push(`${route}: no link to ${target} inside <main>`);
  };
  expectLinks('/', LIVE_CALCULATORS);
  expectLinks('/calculators', LIVE_CALCULATORS);
  expectLinks('/guides', LIVE_GUIDES);
  for (const route of LIVE_GUIDES) expectLinks(route, LIVE_GUIDES);
  check('inside <main>, / and /calculators link to all 15 live calculators, /guides to all 9 live guides, and each guide to every other guide', failures, `${2 + 1 + LIVE_GUIDES.length} pages`);
}

// 13. Internal links on live pages and the 404 page reach a built page or route, and their #fragments exist
{
  const failures = [];
  let links = 0;
  const targets = new Set(pages.map((p) => p.route).filter((r) => r !== NOT_FOUND_ROUTE && r !== '/_global-error'));
  for (const f of walkFiles(appOutDir, (x) => x.endsWith('.body'))) {
    targets.add('/' + relative(appOutDir, f).split(sep).join('/').replace(/\.body$/, ''));
  }
  for (const f of walkFiles(join(appOutDir, 'api'), (x) => x.endsWith('/route.js') || x.endsWith('\\route.js'))) {
    targets.add('/' + relative(appOutDir, f).split(sep).join('/').replace(/\/route\.js$/, ''));
  }
  for (const f of walkFiles(join(repoRoot, 'public'), () => true)) {
    targets.add('/' + relative(join(repoRoot, 'public'), f).split(sep).join('/'));
  }
  const idsOf = new Map(
    pages.map((p) => [p.route, new Set(p.events.filter((e) => e.type === 'open' && e.attrs.id).map((e) => e.attrs.id))]),
  );
  const checked = livePages.filter((p) => p.route !== '/_global-error');
  for (const page of checked) {
    for (const e of page.events) {
      if (e.type !== 'open' || e.name !== 'a' || e.attrs.href === undefined) continue;
      const href = e.attrs.href.trim();
      if (!href.startsWith('/') || href.startsWith('//')) {
        if (!href.startsWith('#')) continue;
      }
      links++;
      const hashAt = href.indexOf('#');
      const fragment = hashAt === -1 ? null : decodeURIComponent(href.slice(hashAt + 1));
      const path = href.startsWith('#') ? page.route : normalizePath(href);
      if (!targets.has(path)) {
        failures.push(`${page.route} → ${href}: no built page or route at ${path}`);
        continue;
      }
      if (fragment) {
        const ids = idsOf.get(path);
        if (!ids || !ids.has(fragment)) failures.push(`${page.route} → ${href}: no id "${fragment}" on ${path}`);
      }
    }
  }
  check('every internal <a href> on a live page and on the 404 page reaches a built page or route, and its #fragment exists there', failures, `${checked.length} pages, ${links} links, ${targets.size} targets`);
}

// 14. Inside <main>, no heading is more than one level deeper than the heading before it
{
  const failures = [];
  let headings = 0;
  for (const page of pages) {
    let previous = null;
    for (const e of page.events) {
      if (e.type !== 'open' || !/^h[1-6]$/.test(e.name) || !inMain(e)) continue;
      headings++;
      const level = Number(e.name[1]);
      if (previous !== null && level > previous.level + 1) {
        failures.push(`${page.route}: <h${level}> after <h${previous.level}> "${previous.text}"`);
      }
      // the heading's own text, for the report
      const at = page.events.indexOf(e);
      let text = '';
      for (let k = at + 1; k < page.events.length && text.length < 60; k++) {
        const t = page.events[k];
        if (t.type === 'close' && t.name === e.name) break;
        if (t.type === 'text') text += t.value;
      }
      previous = { level, text: text.replace(/\s+/g, ' ').trim() };
    }
  }
  check('inside <main>, no prerendered page has a heading more than one level deeper than the heading before it', failures, `${pages.length} pages, ${headings} headings`);
}

// 15. Table 250.66 values carry NFPA's 2020 grounding fact sheet note
{
  const failures = [];
  let pagesWith = 0;
  for (const page of pages) {
    const text = visibleText(page.events);
    if (!text.includes('Table 250.66')) continue;
    pagesWith++;
    if (!text.includes('2020 grounding fact sheet')) failures.push(`${page.route}: "Table 250.66" without "2020 grounding fact sheet"`);
  }
  check('every prerendered page whose text contains "Table 250.66" also contains "2020 grounding fact sheet"', failures, `${pagesWith} pages mention Table 250.66`);
}

const failed = results.filter((r) => r.failures.length > 0).length;
console.log(`\ncheck-structure: ${results.length - failed}/${results.length} checks pass (${pages.length} prerendered pages under ${rel(appOutDir)})`);
process.exit(failed ? 1 : 0);
