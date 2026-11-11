// WSZ-005b: the route list (src/lib/routes.ts, D-26) that the homepage, /calculators, /guides, the guides navigation,
// the sitemap and the /methodology "Cited on" names read, and the data the homepage's wire size table reads.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import PAGE_DATES from '../src/data/page-dates.json';
import { GROUPS, HUB_NAMES, ROUTES, pageName, sectionGroups, sectionOf, sectionRoutes } from '../src/lib/routes';
import { CITED_PAGE_NAMES, METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import sitemap from '../src/app/sitemap';
import { awgRow } from '../src/lib/verified/awg';
import { ROWS_240_4_D } from '../src/lib/verified/nec-240-4-d';
import { TABLE_310_16_SIZES, table31016 } from '../src/lib/verified/nec-310-16';
import { configRedirects, parseCsv, repoRoot, withdrawnRoutes } from '../scripts/lib/build-output.mjs';
import { necRefs } from '../scripts/lib/gate-rules.mjs';

const DATED = Object.keys(PAGE_DATES as Record<string, unknown>);
const PATHS = ROUTES.map((r) => r.path);

describe('the route list', () => {
  it('lists each live calculator and guide once, and nothing else', () => {
    assert.equal(new Set(PATHS).size, PATHS.length);
    const live = DATED.filter((route) => route.startsWith('/calculators/') || route.startsWith('/guides/')).sort();
    assert.deepEqual([...PATHS].sort(), live);
    assert.equal(sectionRoutes('calculators').length, 15);
    assert.equal(sectionRoutes('guides').length, 9);
  });

  it('holds no withdrawn route and no redirect source', () => {
    const withdrawn = new Set(withdrawnRoutes());
    const sources = new Set(configRedirects().map((r) => r.source));
    for (const path of PATHS) {
      assert.ok(!withdrawn.has(path), `${path} is withdrawn`);
      assert.ok(!sources.has(path), `${path} redirects`);
    }
  });

  it('puts each page in a group of its own section, and every group has pages', () => {
    const groupIds = GROUPS.map((g) => g.id);
    assert.equal(new Set(groupIds).size, groupIds.length);
    for (const r of ROUTES) {
      const group = GROUPS.find((g) => g.id === r.group);
      assert.ok(group, r.path);
      assert.equal(group.section, sectionOf(r.path), r.path);
    }
    for (const section of ['calculators', 'guides'] as const) {
      const groups = sectionGroups(section);
      assert.deepEqual(
        groups.map((g) => g.group.id),
        GROUPS.filter((g) => g.section === section).map((g) => g.id),
      );
      // the list runs group by group, so the hubs, the homepage and the sitemap show the pages in one order
      assert.deepEqual(
        groups.flatMap((g) => g.routes.map((r) => r.path)),
        sectionRoutes(section).map((r) => r.path),
      );
    }
  });

  it('gives each page a unique name and one line with no number outside an allowed NEC reference', () => {
    const names = ROUTES.map((r) => r.name);
    assert.equal(new Set(names).size, names.length);
    const allow = new Set(parseCsv(readFileSync(join(repoRoot, 'research', 'nec-sections-allowlist.csv'), 'utf8')).map((row) => row.ref));
    const articles = new Set([...allow].map((ref) => Number(ref.replace(/^Article\s+/, '').split('.')[0])));
    for (const r of ROUTES) {
      assert.equal(r.name, r.name.trim(), r.path);
      assert.match(r.line, /^[A-Z].*\.$/, r.path);
      let rest = r.line;
      for (const ref of necRefs(r.line, articles)) {
        assert.ok(allow.has(ref.ref), `${r.path}: ${ref.ref} is not in the NEC allowlist`);
        rest = rest.replace(ref.ref, '');
      }
      // years are not counted as numbers (the tracker's rule); everything else needs a citation the line cannot carry
      assert.doesNotMatch(rest.replace(/\b(?:19|20)\d\d\b/g, ''), /\d/, `${r.path}: a number in "${r.line}"`);
    }
  });

  it('flags only calculators for the guides navigation', () => {
    const flagged = ROUTES.filter((r) => r.guidesNav);
    assert.ok(flagged.length > 0);
    for (const r of flagged) assert.equal(sectionOf(r.path), 'calculators', r.path);
  });

  it('names the homepage, the hubs and every listed page, and throws for any other route', () => {
    assert.deepEqual(Object.keys(HUB_NAMES).sort(), ['/', '/calculators', '/guides']);
    for (const r of ROUTES) assert.equal(pageName(r.path), r.name);
    assert.equal(pageName('/'), 'Homepage');
    assert.throws(() => pageName('/calculators/welder-calculator'), /no page name/);
    assert.throws(() => sectionOf('/about'), /neither a calculator nor a guide/);
  });
});

describe('readers of the route list', () => {
  it('the sitemap lists the calculators and guides in route-list order', () => {
    const urls = sitemap().map((e) => e.url.replace(/^https:\/\/wiresizes\.com/, ''));
    assert.deepEqual(
      urls.filter((u) => u.startsWith('/calculators/') || u.startsWith('/guides/')),
      PATHS,
    );
  });

  it('/methodology names the pages it cites as the route list does, the homepage included', () => {
    for (const [route, name] of Object.entries(CITED_PAGE_NAMES)) assert.equal(name, pageName(route), route);
    const byDomain = Object.fromEntries(METHODOLOGY_SECTIONS.map((s) => [s.domain, s.citedOn]));
    for (const domain of ['awg-geometry', 'nec-310-16', 'nec-240-4-d']) assert.ok(byDomain[domain].includes('/'), domain);
    // the hubs cite nothing: their only sourced line, the 2026 edition's dates, waits for a working source link (DEVLOG §5)
    for (const [domain, routes] of Object.entries(byDomain)) {
      for (const hub of ['/calculators', '/guides']) assert.ok(!routes.includes(hub), `${domain}: ${hub}`);
    }
    assert.ok(!byDomain['nec-2026-edition'].includes('/'));
  });
});

describe('the homepage wire size table', () => {
  const sizes = TABLE_310_16_SIZES.slice(TABLE_310_16_SIZES.indexOf('14'), TABLE_310_16_SIZES.indexOf('4/0') + 1);

  it('has a diameter and a 75 °C copper ampacity for every size from 14 AWG to 4/0, and aluminum from 12 AWG', () => {
    assert.deepEqual(sizes, ['14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0']);
    for (const k of sizes) {
      const row = awgRow(k);
      assert.ok(row && row.diameter_in > 0 && row.diameter_mm > 0, k);
      assert.ok((table31016(k, 'cu_75') ?? 0) > 0, k);
      assert.equal(table31016(k, 'al_75') === null, k === '14', k);
    }
  });

  it('marks the five 240.4(D) limits without conditions on those sizes', () => {
    const limits = ROWS_240_4_D.filter((r) => r.conditions === null && (r.material === 'Cu' || r.material === 'Al') && sizes.includes(r.size));
    assert.deepEqual(
      limits.map((r) => `${r.size} ${r.material} ${r.max_ocpd_a}`).sort(),
      ['10 Al 25', '10 Cu 30', '12 Al 15', '12 Cu 20', '14 Cu 15'],
    );
  });
});
