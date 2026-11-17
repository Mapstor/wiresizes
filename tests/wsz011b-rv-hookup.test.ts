// WSZ-011b (with WSZ-033's sourcing): the RV hookup calculator, back from its WSZ-002 withdrawal. The outlet circuit is
// the wire size engine's at 120 V (TT-30R) or 240 V (14-50R); the park load is 551.73(A)'s 2023 per-site loads times
// Table 551.73(A)'s factor for all sites (12,000 VA, not the 9,600 VA of an older edition); GFCI follows 210.8(F) and
// 551.71(F); the page's sources agree with /methodology, the registry and the page map.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { ROUTES } from '../src/lib/routes';
import { DOMAINS, ENGINE_ID, rvOutlet, rvPark } from '../src/lib/calculations/rv-hookup';
import { sizeConductor, isSizingError } from '../src/lib/calculations/conductor-sizing';
import { DEMAND_FACTORS, RECEPTACLE_SHARES, SITE_VA, demandFactor } from '../src/lib/verified/nec-551';
import { LONG_RUN, LONG_RUN_FIRST_DROP, NEC_EXAMPLE_PARK, PARK_EXAMPLE, outletRow } from '../src/lib/rv-page';

const ROUTE = '/calculators/rv-hookup-calculator';
const CITED = ['nec-310-16', 'nec-110-14c', 'nec-240-ocpd', 'nec-240-4-d', 'nec-250-grounding', 'conductor-resistance-20c', 'nema-receptacle-configs', 'nec-2023-rule-excerpts', 'nec-551-rv-demand'];
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
const code = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

describe('WSZ-011b the data', () => {
  it('551.73(A): 12,000, 3600, 2400 and 600 VA; Table 551.73(A): 14 rows, 100 % to 41 %', () => {
    assert.deepEqual(SITE_VA, { site50: 12000, site30: 3600, site20: 2400, tent: 600 });
    assert.equal(DEMAND_FACTORS.length, 14);
    assert.deepEqual(
      [1, 2, 3, 4, 5, 6, 7, 9, 10, 12, 15, 18, 21, 24, 25, 35, 36, 500].map(demandFactor),
      [100, 90, 80, 75, 65, 60, 55, 55, 50, 50, 48, 47, 45, 43, 42, 42, 41, 41],
    );
    assert.equal(demandFactor(0), null);
    assert.deepEqual(RECEPTACLE_SHARES, { min30Pct: 70, min50PctExisting: 20, min50PctNew: 40 });
  });
});

describe('WSZ-011b the engine', () => {
  it('outlets: the wire size engine at 120 V and 240 V; 14-50R 6 AWG copper at 60 °C, TT-30R 10 AWG; GFCI at a house', () => {
    assert.equal(ENGINE_ID, 'rv-hookup');
    assert.ok(DOMAINS.includes('nec-551-rv-demand'));
    for (const [outlet, ocpdA, volts] of [
      ['1450', 50, 240],
      ['tt30', 30, 120],
    ] as const) {
      const r = rvOutlet({ outlet, material: 'Cu', wiringMethod: 'conductors', termination: 'unknown', lengthFt: 80, vdTargetPct: 3 });
      assert.ok(!('error' in r));
      const w = sizeConductor({ ocpdA, material: 'Cu', wiringMethod: 'conductors', termination: 'unknown', loadA: null, continuous: false, lengthFt: 80, volts, phase: 'single', vdTargetPct: 3 });
      assert.ok(!isSizingError(w));
      assert.equal(r.feeder.size, w.size);
      assert.equal(r.gfciAtHouse, true);
    }
    assert.deepEqual([outletRow('1450').cu60.size, outletRow('1450').cu75.size, outletRow('1450').egcCu], ['6', '8', '10']);
    assert.deepEqual([outletRow('tt30').cu60.size, outletRow('tt30').al60.size, outletRow('tt30').egcAl], ['10', '8', '8']);
    assert.deepEqual([LONG_RUN.feeder.minSizeByAmpacity, LONG_RUN.feeder.size, LONG_RUN.feeder.egc], ['6', '4', '6']);
    assert.ok(LONG_RUN_FIRST_DROP > 3 && LONG_RUN.feeder.vdPct <= 3);
  });

  it('parks: per-site loads × the factor for all sites; the NEC example; the receptacle shares', () => {
    assert.equal(NEC_EXAMPLE_PARK.demandVa, 32400);
    assert.equal(NEC_EXAMPLE_PARK.amps240, 135);
    const r = rvPark({ sites50: 10, sites30: 20, sites20: 5, newPark: false });
    assert.ok(!('error' in r));
    assert.equal(r.sites, 35);
    assert.equal(r.demandPct, 42);
    assert.equal(r.connectedVa, 10 * 12000 + 20 * 3600 + 5 * 2400);
    assert.equal(r.demandVa, r.connectedVa * 0.42);
    assert.ok(Math.abs(r.amps208 - r.demandVa / (Math.sqrt(3) * 208)) < 1e-9);
    assert.ok(r.meets30 && r.meets50);
    assert.ok(PARK_EXAMPLE.meets50 && PARK_EXAMPLE.share50Pct === 40);
    const short = rvPark({ sites50: 3, sites30: 10, sites20: 10, newPark: true });
    assert.ok(!('error' in short) && !short.meets30 && !short.meets50);
    assert.ok('error' in rvPark({ sites50: 0, sites30: 0, sites20: 0, newPark: true }));
    assert.ok('error' in rvPark({ sites50: 1.5, sites30: 0, sites20: 0, newPark: true }));
  });
});

describe('WSZ-011b sources and listings', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];
  const page = code('../src/app/calculators/rv-hookup-calculator/page.tsx');

  it('/methodology, the registry and the page map list the calculator under its nine sources', () => {
    assert.deepEqual(METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(ROUTE)).map((s) => s.domain).sort(), [...CITED].sort());
    for (const d of CITED) {
      const row = registry.find((r) => r.domain === d);
      assert.ok(row && row.status === 'verified' && row.pages_served.split(';').includes(ROUTE), d);
    }
    assert.ok(!registry.some((r) => !CITED.includes(r.domain) && r.pages_served.split(';').includes(ROUTE)));
    assert.deepEqual(pageMap.find((r) => r.slug === ROUTE)?.data_sources_all.split(';').sort(), [...CITED].sort());
  });

  it('no withdrawal, no older load figure, joins the gates, the route list and the footer', () => {
    assert.ok(!page.includes('WithdrawnTool'));
    assert.ok(!/9,?600/.test(page));
    assert.ok(!read('../research/wsz002-withdrawals.csv').includes(ROUTE));
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE) && gates.necRefs.enforce.includes(ROUTE));
    const r = ROUTES.find((x) => x.path === ROUTE);
    assert.ok(r && r.name === 'RV Hookup Calculator' && r.group === 'wire-sizing');
    assert.match(read('../src/components/layout/Footer.tsx'), /rv-hookup-calculator/);
  });
});
