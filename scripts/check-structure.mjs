#!/usr/bin/env node
// WSZ-002 gate: structural checks on the Next.js build output (checks 11–15 added in WSZ-014, 16 in WSZ-015, 17 onward in
// WSZ-004a). Node built-ins only.
// Run after `rm -rf .next && npm run build`. Prints a PASS/FAIL line per check and exits 1 on any FAIL.

import { readFileSync, existsSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { join, relative, sep } from 'node:path';
import {
  repoRoot, appOutDir, routeCacheDir, rel, htmlPages, prerendered, bodyFile, withdrawnRoutes, configRedirects,
  tokenizeHtml, isJsonLd, visibleText, jsonLdStrings, walkFiles, SITE_ORIGIN,
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
const sitemapFile = bodyFile('/sitemap.xml');
const sitemap = sitemapFile ? readFileSync(sitemapFile, 'utf8') : '';
const sitemapLocs = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
const sitemapPaths = new Set(sitemapLocs.map((loc) => normalizePath(loc)));
const pageByRoute = new Map(pages.map((p) => [p.route, p]));
const livePages = pages.filter((p) => !withdrawnSet.has(p.route));

// 1. Withdrawn routes: noindex, follow and not in the sitemap
{
  const failures = [];
  if (!sitemap) failures.push(sitemapFile ? `empty sitemap at ${rel(sitemapFile)}` : 'no prerendered /sitemap.xml (sitemap.xml.body)');
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
  for (const body of prerendered('.body')) targets.add(body.route);
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

// ── WSZ-015 ─────────────────────────────────────────────────────────────────
// 16. Every prerendered page has exactly one main landmark: one <main>, and no other element with role="main".
//     /_global-error is Next.js's built-in root error page (the app has no global-error.tsx): it replaces the root
//     layout, so it has no <main>, and it is not counted.
{
  const GLOBAL_ERROR_ROUTE = '/_global-error';
  const failures = [];
  const counted = pages.filter((p) => p.route !== GLOBAL_ERROR_ROUTE);
  for (const page of counted) {
    const mains = page.events.filter(
      (e) => e.type === 'open' && (e.name === 'main' || (e.attrs.role ?? '').trim().toLowerCase() === 'main'),
    );
    if (mains.length !== 1 || mains[0].name !== 'main') {
      const found = mains.map((e) => `<${e.name}${e.attrs.role ? ` role="${e.attrs.role}"` : ''}>`).join(', ') || 'none';
      failures.push(`${page.route}: ${mains.length} main landmark(s): ${found}`);
    }
  }
  const skipped = pages.length - counted.length;
  check(
    'every prerendered page has exactly one <main> and no other role="main" element',
    failures,
    `${counted.length} pages${skipped ? `; ${GLOBAL_ERROR_ROUTE} not counted (Next.js's built-in root error page, without the site layout)` : ''}`,
  );
}

// ── WSZ-004a ────────────────────────────────────────────────────────────────
// Page dates (D-17): src/data/page-dates.json holds { "/route": { published, modified } } for every live route.
const PAGE_DATES_FILE = join(repoRoot, 'src', 'data', 'page-dates.json');
const pageDates = JSON.parse(readFileSync(PAGE_DATES_FILE, 'utf8'));
const NOT_ROUTES = new Set([NOT_FOUND_ROUTE, '/_global-error']);
const LIVE_ROUTES = livePages.map((p) => p.route).filter((r) => !NOT_ROUTES.has(r));

/** Whether a string is a real calendar day written YYYY-MM-DD. */
function isCalendarDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  if (!m) return false;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  return days !== undefined && day >= 1 && day <= days;
}

// The latest calendar day anywhere on Earth right now (UTC+14): a date set on the owner's local day is never "after
// today" on a build machine that runs on UTC.
const TODAY = new Date(Date.now() + 14 * 3600 * 1000).toISOString().slice(0, 10);

/** Every JSON-LD object with an @type on a page: [{ node, types, block }] (block = index of its <script>). */
function jsonLdNodes(page) {
  const out = [];
  let block = 0;
  for (const e of page.events) {
    if (!isJsonLd(e)) continue;
    let data;
    try {
      data = JSON.parse(e.body);
    } catch {
      block++;
      continue;
    }
    const walk = (node) => {
      if (Array.isArray(node)) node.forEach(walk);
      else if (node && typeof node === 'object') {
        const types = [].concat(node['@type'] ?? []);
        if (types.length) out.push({ node, types, block });
        Object.values(node).forEach(walk);
      }
    };
    walk(data);
    block++;
  }
  return out;
}

// 17. page-dates.json: one entry per live route, real dates, published ≤ modified ≤ today
{
  const failures = [];
  const live = new Set(LIVE_ROUTES);
  for (const route of LIVE_ROUTES) if (!(route in pageDates)) failures.push(`${route}: no entry`);
  for (const [route, dates] of Object.entries(pageDates)) {
    if (!live.has(route)) failures.push(`${route}: not a live route`);
    const { published, modified } = dates ?? {};
    if (!isCalendarDate(published)) failures.push(`${route}: published ${JSON.stringify(published)} is not a YYYY-MM-DD date`);
    if (!isCalendarDate(modified)) failures.push(`${route}: modified ${JSON.stringify(modified)} is not a YYYY-MM-DD date`);
    if (Object.keys(dates ?? {}).sort().join() !== 'modified,published') failures.push(`${route}: keys ${Object.keys(dates ?? {}).join(', ')}`);
    if (isCalendarDate(published) && isCalendarDate(modified) && published > modified) failures.push(`${route}: published ${published} after modified ${modified}`);
    if (isCalendarDate(modified) && modified > TODAY) failures.push(`${route}: modified ${modified} after today (${TODAY})`);
  }
  check(
    'src/data/page-dates.json has one entry per live route, with real YYYY-MM-DD dates and published ≤ modified ≤ today',
    failures,
    `${Object.keys(pageDates).length} entries, ${LIVE_ROUTES.length} live routes, today ${TODAY}`,
  );
}

// The identity nodes (src/lib/identity.ts) and the values check 22 requires of them (research/trust-frame-spec.md).
const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
const PERSON_ID = `${SITE_ORIGIN}/about#marko-visic`;
const REQUIRED = {
  [ORGANIZATION_ID]: {
    '@type': 'Organization',
    name: 'Moving Data Systems d.o.o.',
    legalName: 'Moving Data Systems d.o.o.',
    url: SITE_ORIGIN,
    address: { '@type': 'PostalAddress', streetAddress: 'Smolnik 62', postalCode: '2342', addressLocality: 'Ruše', addressCountry: 'SI' },
    vatID: 'SI94001154',
    logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/icons/icon-512.png`, width: 512, height: 512 },
  },
  [PERSON_ID]: {
    '@type': 'Person',
    name: 'Marko Visic',
    url: `${SITE_ORIGIN}/about`,
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Ljubljana, Faculty of Mathematics and Physics' },
    hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'BSc Physics' },
    knowsAbout: ['conductor resistance', 'electrical units and conversions', 'wire gauge geometry'],
    sameAs: ['https://www.linkedin.com/in/marko-visic/'],
  },
};
const isRef = (value, id) =>
  value !== null && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 1 && value['@id'] === id;
/** JSON with object keys sorted, so two values compare equal whatever their key order. */
const canon = (value) =>
  JSON.stringify(value, (_, v) =>
    v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : 1))) : v,
  );

// 18. Article, Dataset and WebApplication: author → the Person, publisher → the Organization; Article and Dataset
//     dates equal the route's page-dates.json dates. One Article per live guide, one WebApplication per live calculator,
//     Datasets on the two table guides.
{
  const DATASET_ROUTES = ['/guides/awg-wire-size-chart', '/guides/nec-table-310-16'];
  const failures = [];
  const counts = { Article: 0, Dataset: 0, WebApplication: 0 };
  const perRoute = new Map();
  for (const page of livePages) {
    for (const { node, types } of jsonLdNodes(page)) {
      const type = types.find((t) => t in counts);
      if (!type) continue;
      counts[type]++;
      perRoute.set(`${page.route} ${type}`, (perRoute.get(`${page.route} ${type}`) ?? 0) + 1);
      if (!isRef(node.author, PERSON_ID)) failures.push(`${page.route}: ${type} author ${JSON.stringify(node.author)}, expected {"@id":"${PERSON_ID}"}`);
      if (!isRef(node.publisher, ORGANIZATION_ID)) failures.push(`${page.route}: ${type} publisher ${JSON.stringify(node.publisher)}, expected {"@id":"${ORGANIZATION_ID}"}`);
      if (type === 'WebApplication') continue;
      const dates = pageDates[page.route];
      if (!dates) {
        failures.push(`${page.route}: ${type} on a route without page dates`);
        continue;
      }
      if (node.datePublished !== dates.published) failures.push(`${page.route}: ${type} datePublished ${node.datePublished}, page-dates.json ${dates.published}`);
      if (node.dateModified !== dates.modified) failures.push(`${page.route}: ${type} dateModified ${node.dateModified}, page-dates.json ${dates.modified}`);
    }
  }
  const expectOne = (routes, type) => {
    for (const route of routes) {
      const n = perRoute.get(`${route} ${type}`) ?? 0;
      if (n !== 1) failures.push(`${route}: ${n} ${type} nodes, expected 1`);
    }
  };
  expectOne(LIVE_GUIDES, 'Article');
  expectOne(LIVE_CALCULATORS, 'WebApplication');
  expectOne(DATASET_ROUTES, 'Dataset');
  if (counts.Dataset !== DATASET_ROUTES.length) failures.push(`${counts.Dataset} Dataset nodes, expected ${DATASET_ROUTES.length}`);
  check(
    'every Article, Dataset and WebApplication has author → the Person and publisher → the Organization; Article and Dataset dates equal page-dates.json',
    failures,
    `${counts.Article} Article, ${counts.Dataset} Dataset, ${counts.WebApplication} WebApplication nodes`,
  );
}

// 19. Every sitemap.xml <url> has a lastmod equal to its route's page-dates.json modified date
{
  const failures = [];
  const urls = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  const seen = new Set();
  for (const body of urls) {
    const loc = /<loc>\s*([^<\s]+)\s*<\/loc>/.exec(body)?.[1] ?? '';
    const lastmod = /<lastmod>\s*([^<\s]+)\s*<\/lastmod>/.exec(body)?.[1];
    const route = normalizePath(loc);
    seen.add(route);
    const dates = pageDates[route];
    if (!dates) failures.push(`${loc}: no page-dates.json entry`);
    else if (lastmod !== dates.modified) failures.push(`${loc}: lastmod ${lastmod ?? '(none)'}, page-dates.json modified ${dates.modified}`);
  }
  for (const route of Object.keys(pageDates)) if (!seen.has(route)) failures.push(`${route}: in page-dates.json, not in sitemap.xml`);
  check('every sitemap.xml <url> has a <lastmod> equal to its page-dates.json modified date, and the sitemap lists every dated route', failures, `${urls.length} URLs`);
}

/** The events inside the element that opens at events[at], up to its matching close. */
function elementEvents(events, at) {
  const name = events[at].name;
  const out = [];
  let depth = 1;
  for (let k = at + 1; k < events.length; k++) {
    const e = events[k];
    if (e.type === 'open' && e.name === name) depth++;
    else if (e.type === 'close' && e.name === name && --depth === 0) break;
    out.push(e);
  }
  return out;
}

/** Text events joined as the reader sees them (no space at tag boundaries), whitespace collapsed. */
const joinedText = (events) =>
  events
    .filter((e) => e.type === 'text')
    .map((e) => e.value)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const usDate = (iso) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}, ${iso.slice(0, 4)}`;

// 20. The byline (D-18): exactly the 24 content and tool routes render one [data-byline] block, "By Marko Visic, BSc
//     Physics · Updated {Month D, YYYY}" with the name linked to /about and the date = page-dates.json modified;
//     " · Sources below", linked to #sources, appears exactly where the page renders <Sources> (its h2#sources).
{
  const BYLINE_ROUTES = new Set([...LIVE_CALCULATORS, ...LIVE_GUIDES]);
  const failures = [];
  let bylines = 0;
  let withSources = 0;
  for (const page of pages) {
    const starts = [];
    page.events.forEach((e, i) => {
      if (e.type === 'open' && e.attrs['data-byline'] !== undefined) starts.push(i);
    });
    const expected = BYLINE_ROUTES.has(page.route) ? 1 : 0;
    if (starts.length !== expected) failures.push(`${page.route}: ${starts.length} [data-byline] blocks, expected ${expected}`);
    const sourcesHeading = page.events.findIndex((e) => e.type === 'open' && e.name === 'h2' && e.attrs.id === 'sources');
    const hasSources = sourcesHeading !== -1 && joinedText(elementEvents(page.events, sourcesHeading)) === 'Sources';
    const sourcesBelow = (visibleText(page.events).match(/Sources below/g) ?? []).length;
    const bylineHasSources = starts.length === 1 && hasSources;
    if (sourcesBelow !== (bylineHasSources ? 1 : 0)) {
      failures.push(`${page.route}: "Sources below" ${sourcesBelow}×, page ${hasSources ? 'renders' : 'does not render'} <Sources>`);
    }
    for (const at of starts) {
      bylines++;
      const inner = elementEvents(page.events, at);
      const dates = pageDates[page.route];
      if (!dates) {
        failures.push(`${page.route}: byline on a route without page dates`);
        continue;
      }
      const expectedText = `By Marko Visic, BSc Physics · Updated ${usDate(dates.modified)}${hasSources ? ' · Sources below' : ''}`;
      const text = joinedText(inner);
      if (text !== expectedText) failures.push(`${page.route}: byline "${text}", expected "${expectedText}"`);
      const links = inner.filter((e) => e.type === 'open' && e.name === 'a').map((e) => e.attrs.href);
      const expectedLinks = hasSources ? ['/about', '#sources'] : ['/about'];
      if (links.join(' ') !== expectedLinks.join(' ')) failures.push(`${page.route}: byline links ${links.join(', ')}, expected ${expectedLinks.join(', ')}`);
      const times = inner.filter((e) => e.type === 'open' && e.name === 'time').map((e) => e.attrs.datetime);
      if (times.join(' ') !== dates.modified) failures.push(`${page.route}: byline <time datetime> ${times.join(', ')}, page-dates.json modified ${dates.modified}`);
      if (hasSources) withSources++;
    }
  }
  check(
    'exactly the 15 live calculators and 9 live guides render one byline (name → /about, Updated = page-dates.json modified); "Sources below" only beside a rendered <Sources>',
    failures,
    `${bylines} bylines, ${withSources} with "Sources below"`,
  );
}

// 21. Every live route but the home page has a BreadcrumbList that starts at Home and ends at the page
{
  const failures = [];
  let lists = 0;
  for (const route of LIVE_ROUTES) {
    if (route === '/') continue;
    const found = jsonLdNodes(pageByRoute.get(route)).filter((x) => x.types.includes('BreadcrumbList'));
    if (found.length === 0) failures.push(`${route}: no BreadcrumbList`);
    for (const { node } of found) {
      lists++;
      const items = [].concat(node.itemListElement ?? []);
      if (items[0]?.item !== SITE_ORIGIN) failures.push(`${route}: BreadcrumbList starts at ${items[0]?.item}`);
      if (items[items.length - 1]?.item !== `${SITE_ORIGIN}${route}`) failures.push(`${route}: BreadcrumbList ends at ${items[items.length - 1]?.item}`);
      items.forEach((item, i) => {
        if (item.position !== i + 1) failures.push(`${route}: BreadcrumbList item ${i + 1} has position ${item.position}`);
      });
    }
  }
  check('every live route but / has a BreadcrumbList from Home to the page', failures, `${LIVE_ROUTES.length - 1} routes, ${lists} lists`);
}

// 22. The Organization and the Person carry their required keys; every JSON-LD block that references one by @id prints it
//     in the same block; every printed copy is identical; no other Organization or Person node.
{
  const failures = [];
  const copies = new Map();
  let printedCount = 0;
  let refCount = 0;
  for (const page of pages) {
    let block = 0;
    for (const e of page.events) {
      if (!isJsonLd(e)) continue;
      block++;
      let data;
      try {
        data = JSON.parse(e.body);
      } catch {
        continue;
      }
      const printed = new Map();
      const referenced = new Set();
      const walk = (node) => {
        if (Array.isArray(node)) return node.forEach(walk);
        if (!node || typeof node !== 'object') return;
        const id = node['@id'];
        const types = [].concat(node['@type'] ?? []);
        if (types.includes('Organization') || types.includes('Person')) {
          if (!Object.hasOwn(REQUIRED, id)) failures.push(`${page.route}: ${types.join('/')} node with @id ${id ?? '(none)'}`);
          else printed.set(id, node);
        }
        if (Object.hasOwn(REQUIRED, id) && Object.keys(node).length === 1) referenced.add(id);
        Object.values(node).forEach(walk);
      };
      walk(data);
      for (const [id, node] of printed) {
        printedCount++;
        for (const [key, value] of Object.entries(REQUIRED[id])) {
          if (canon(node[key]) !== canon(value)) failures.push(`${page.route}: ${id} ${key} is ${JSON.stringify(node[key])}`);
        }
        if (id === ORGANIZATION_ID && 'sameAs' in node) failures.push(`${page.route}: the Organization has sameAs`);
        const json = canon(node);
        if (!copies.has(id)) copies.set(id, json);
        else if (copies.get(id) !== json) failures.push(`${page.route}: ${id} differs from its first printed copy`);
      }
      for (const id of referenced) {
        refCount++;
        if (!printed.has(id)) failures.push(`${page.route}: JSON-LD block ${block} references ${id} without printing it`);
      }
    }
  }
  for (const id of Object.keys(REQUIRED)) if (!copies.has(id)) failures.push(`no page prints ${id}`);
  check(
    'the Organization and the Person carry their required keys, and every JSON-LD block that references one prints it',
    failures,
    `${printedCount} printed nodes, ${refCount} block references`,
  );
}

// 23. Site icon (D-19): every page links each icon once; the Organization logo and the manifest icons are files under
//     public/ at their declared sizes; /favicon.ico (src/app/favicon.ico, as built) holds 16, 32 and 48 px PNG images
//     that decode; src/app/icon.svg and public/favicon.ico are gone.
{
  /** Width and height of a PNG after inflating its image data to the size IHDR implies (throws when it does not). */
  const decodePng = (buf) => {
    if (buf.length < 33 || buf.readUInt32BE(0) !== 0x89504e47 || buf.readUInt32BE(4) !== 0x0d0a1a0a) throw new Error('no PNG signature');
    let at = 8;
    let ihdr = null;
    const idat = [];
    while (at + 8 <= buf.length) {
      const length = buf.readUInt32BE(at);
      const type = buf.toString('latin1', at + 4, at + 8);
      const data = buf.subarray(at + 8, at + 8 + length);
      if (type === 'IHDR') ihdr = { width: data.readUInt32BE(0), height: data.readUInt32BE(4), depth: data[8], color: data[9], interlace: data[12] };
      if (type === 'IDAT') idat.push(data);
      at += 12 + length;
      if (type === 'IEND') break;
    }
    if (!ihdr || idat.length === 0) throw new Error('no IHDR or IDAT');
    const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.color];
    const raw = inflateSync(Buffer.concat(idat));
    const expected = ihdr.height * (1 + Math.ceil((ihdr.width * ihdr.depth * channels) / 8));
    if (ihdr.interlace === 0 && raw.length !== expected) throw new Error(`image data ${raw.length} bytes, expected ${expected}`);
    return { width: ihdr.width, height: ihdr.height };
  };
  const failures = [];
  let iconLinks = 0;
  for (const page of pages) {
    const seen = new Set();
    for (const e of page.events) {
      if (e.type !== 'open' || e.name !== 'link' || !/(^|\s)(icon|apple-touch-icon)(\s|$)/.test(e.attrs.rel ?? '')) continue;
      iconLinks++;
      const href = (e.attrs.href ?? '').replace(/\?.*$/, '');
      if (seen.has(href)) failures.push(`${page.route}: icon link ${href} twice`);
      seen.add(href);
    }
  }
  const publicFile = (url) => join(repoRoot, 'public', url.replace(SITE_ORIGIN, '').replace(/^\//, ''));
  const expectPng = (url, width, height, what) => {
    const file = publicFile(url);
    if (!existsSync(file)) return failures.push(`${what} ${url}: no file at ${rel(file)}`);
    try {
      const size = decodePng(readFileSync(file));
      if (size.width !== width || size.height !== height) failures.push(`${what} ${url}: ${size.width}×${size.height}, declared ${width}×${height}`);
    } catch (err) {
      failures.push(`${what} ${url}: ${err.message}`);
    }
  };
  const logo = REQUIRED[ORGANIZATION_ID].logo;
  expectPng(logo.url, logo.width, logo.height, 'Organization logo');
  const manifest = JSON.parse(readFileSync(join(repoRoot, 'public', 'manifest.json'), 'utf8'));
  for (const icon of manifest.icons ?? []) {
    if (icon.type === 'image/png') {
      const [w, h] = (icon.sizes ?? '').split('x').map(Number);
      expectPng(icon.src, w, h, 'manifest icon');
    } else if (!existsSync(publicFile(icon.src))) failures.push(`manifest icon ${icon.src}: no file under public/`);
  }
  const icoSizes = (buf) => {
    if (buf.readUInt16LE(0) !== 0 || buf.readUInt16LE(2) !== 1) throw new Error('not an ICO');
    const sizes = [];
    for (let i = 0; i < buf.readUInt16LE(4); i++) {
      const entry = 6 + 16 * i;
      const png = buf.subarray(buf.readUInt32LE(entry + 12), buf.readUInt32LE(entry + 12) + buf.readUInt32LE(entry + 8));
      const { width, height } = decodePng(png);
      const declared = buf[entry] || 256;
      if (width !== declared || height !== (buf[entry + 1] || 256)) throw new Error(`entry ${i} declares ${declared} px, image is ${width}×${height}`);
      sizes.push(width);
    }
    return sizes;
  };
  const icoSource = join(repoRoot, 'src', 'app', 'favicon.ico');
  const icoBuilt = bodyFile('/favicon.ico');
  try {
    const source = readFileSync(icoSource);
    const sizes = icoSizes(source);
    if (sizes.join(',') !== '16,32,48') failures.push(`${rel(icoSource)}: images ${sizes.join(', ')} px, expected 16, 32, 48`);
    if (!icoBuilt || !readFileSync(icoBuilt).equals(source)) failures.push(`the prerendered /favicon.ico is not ${rel(icoSource)}`);
  } catch (err) {
    failures.push(`${rel(icoSource)}: ${err.message}`);
  }
  for (const gone of [join(repoRoot, 'src', 'app', 'icon.svg'), join(repoRoot, 'public', 'favicon.ico')]) {
    if (existsSync(gone)) failures.push(`${rel(gone)} exists (D-19: /icon.svg is public/icon.svg, /favicon.ico is src/app/favicon.ico)`);
  }
  check(
    'each icon link once per page; the Organization logo and manifest icons decode at their declared sizes; /favicon.ico holds 16, 32 and 48 px PNG images',
    failures,
    `${iconLinks} icon links on ${pages.length} pages, ${(manifest.icons ?? []).length} manifest icons`,
  );
}

const failed = results.filter((r) => r.failures.length > 0).length;
const pagesDir = pages[0].file.startsWith(routeCacheDir) ? routeCacheDir : appOutDir;
console.log(`\ncheck-structure: ${results.length - failed}/${results.length} checks pass (${pages.length} prerendered pages under ${rel(pagesDir)})`);
process.exit(failed ? 1 : 0);
