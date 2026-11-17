// WSZ-011f (with WSZ-037's sources): the welder calculator, back from its WSZ-002 withdrawal. The wire starts from the
// manual's minimum, moves up until 630.12(B) (200 % of the wire's ampacity) allows the breaker and then for the drop at
// I1max; the breaker is held to 200 % of I1max by 630.12(A), the next standard rating permitted; the ground wire is Table
// 250.122's, capped by 250.122(A) and grown by 250.122(B). No 630.11 rule is stated. The page's sources agree with
// /methodology, the registry and the page map.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { ROUTES } from '../src/lib/routes';
import { DOMAINS, ENGINE_ID, WD_OCPD_OPTIONS, standardAtOrAbove, welderCircuit } from '../src/lib/calculations/welder';
import type { WelderInput } from '../src/lib/calculations/welder';
import { WELDERS, WELDER_PRESETS, manualOcpd, welder } from '../src/lib/verified/mfr-welders';
import { WELDER_OCPD, WELDING_AREA_GFCI } from '../src/lib/verified/nec-630';
import { DROP_ROWS, EXAMPLE, EXAMPLE_75, FIFTY_60, FIFTY_75, LONG_RUN, PRESET_ROWS } from '../src/lib/welder-page';

const ROUTE = '/calculators/welder-calculator';
const CITED = [
  'nec-310-16',
  'nec-110-14c',
  'nec-240-ocpd',
  'nec-240-4-d',
  'nec-250-grounding',
  'conductor-resistance-20c',
  'nec-440-hvac',
  'nec-630-welders',
  'mfr-welders',
  'nema-receptacle-configs',
];
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
const code = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const base: WelderInput = { i1maxA: 28.9, minSize: '14', ocpdA: 35, wiringMethod: 'conductors', termination: 'unknown', lengthFt: 25, vdTargetPct: 3 };
const run = (patch: Partial<WelderInput>) => {
  const r = welderCircuit({ ...base, ...patch });
  if ('error' in r) throw new Error(r.error);
  return r;
};

describe('WSZ-037 the sources', () => {
  it('630.12: 200 % of I1max and of the ampacity; 630.8: 125 V, 15 and 20 A', () => {
    assert.deepEqual(WELDER_OCPD, { pctOfI1max: 200, pctOfAmpacity: 200 });
    assert.deepEqual([WELDING_AREA_GFCI.volts, WELDING_AREA_GFCI.amps, WELDING_AREA_GFCI.maxVoltsToGround], [125, [15, 20], 150]);
  });

  it('six machines as their manuals give them; four with an I1max', () => {
    assert.equal(WELDERS.length, 6);
    assert.deepEqual(
      WELDER_PRESETS.map((w) => [w.model, w.i1maxA, w.minConductor, manualOcpd(w)]),
      [
        ['Millermatic 211 PRO', 28.9, '14', 35],
        ['Multimatic 215 PRO', 28.9, '14', 35],
        ['Multimatic 220 AC/DC', 32, '12', 40],
        ['POWER MIG 210 MP', 27, '12', 40],
      ],
    );
    const ac = welder('ac-225c');
    assert.deepEqual([ac.minConductor, ac.fuseOrBreakerA, ac.longRun], ['10', 50, { overFt: 100, conductor: '8' }]);
    assert.deepEqual([welder('millermatic-211').inputAtRatedA, welder('millermatic-211').fuseNormalA], [16.6, 30]);
  });
});

describe('WSZ-011f the engine', () => {
  it('the next standard rating: 57.8 A → 60 A, 40 A stays 40 A', () => {
    assert.equal(standardAtOrAbove(57.8), 60);
    assert.equal(standardAtOrAbove(40), 40);
    assert.ok(WD_OCPD_OPTIONS.includes(35) && WD_OCPD_OPTIONS.includes(45));
  });

  it('Millermatic 211 PRO, 35 A: 12 AWG at 60 °C (14 AWG allows 30 A), 14 AWG at 75 °C; 240.4(G) over 240.4(D)', () => {
    const r60 = run({});
    assert.deepEqual([r60.columnC, r60.welderLimitA, r60.tooSmall, r60.firstSize, r60.firstLimitA, r60.size], [60, 60, [{ size: '14', ampacity: 15, limitA: 30 }], '12', 40, '12']);
    assert.equal(r60.overSmallLimitA, 20);
    assert.match(r60.steps[2], /14 AWG carries 15 A, so at most 30 A; 12 AWG carries 20 A, so up to 40 A\. Table 240\.4\(G\) sends welder circuits to 630\.12/);
    const r75 = run({ termination: '75' });
    assert.deepEqual([r75.columnC, r75.firstSize, r75.firstLimitA, r75.egc], [75, '14', 40, '14']);
    assert.equal(run({ wiringMethod: 'cable', termination: '75' }).columnC, 60);
  });

  it('the drop at I1max moves the wire up and the ground wire with it; the ground wire stops at the manual minimum (250.122(A))', () => {
    const long = run({ lengthFt: 100 });
    assert.deepEqual([long.firstSize, long.size, long.egc, long.egcGrown], ['12', '10', '10', true]);
    assert.ok(long.firstVdPct > 3 && long.vdPct <= 3);
    const short = run({ termination: '75' });
    assert.deepEqual([short.tableEgc, short.egc, short.egcCapped, short.egcGrown], ['10', '14', true, false]);
  });

  it('refuses a breaker above 630.12(A), an I1max past 100 A and a rating outside 240.6(A)', () => {
    const r = welderCircuit({ ...base, ocpdA: 70 });
    assert.ok('error' in r && /at most 60 A/.test(r.error));
    assert.ok('error' in welderCircuit({ ...base, i1maxA: 120 }));
    assert.ok('error' in welderCircuit({ ...base, ocpdA: 33 }));
    assert.ok(!('error' in welderCircuit({ ...base, ocpdA: 60 })));
  });

  it('the page values: presets, the example, the 50 A question, the long run and the drop table', () => {
    assert.deepEqual(
      PRESET_ROWS.map((r) => [r.welder.model, r.cu60.size, r.cu75.size]),
      [
        ['Millermatic 211 PRO', '12', '14'],
        ['Multimatic 215 PRO', '12', '14'],
        ['Multimatic 220 AC/DC', '12', '12'],
        ['POWER MIG 210 MP', '12', '12'],
      ],
    );
    assert.deepEqual([EXAMPLE.size, EXAMPLE.egc, EXAMPLE_75.size], ['12', '12', '14']);
    assert.deepEqual([FIFTY_60.firstSize, FIFTY_75.firstSize, FIFTY_60.welderLimitA], ['10', '12', 60]);
    assert.deepEqual([LONG_RUN.firstSize, LONG_RUN.size], ['12', '10']);
    assert.equal(DROP_ROWS[0].size, '14');
    for (let k = 1; k < DROP_ROWS.length; k++) assert.ok(DROP_ROWS[k].ft > DROP_ROWS[k - 1].ft);
  });
});

describe('WSZ-011f sources and listings', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];
  const page = code('../src/app/calculators/welder-calculator/page.tsx');

  it('/methodology, the registry and the page map list the calculator under its ten sources; no 630.11', () => {
    assert.equal(ENGINE_ID, 'welder');
    assert.ok(DOMAINS.includes('nec-630-welders') && DOMAINS.includes('mfr-welders'));
    assert.deepEqual(METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(ROUTE)).map((s) => s.domain).sort(), [...CITED].sort());
    for (const d of CITED) {
      const row = registry.find((r) => r.domain === d);
      assert.ok(row && row.status === 'verified' && row.pages_served.split(';').includes(ROUTE), d);
    }
    assert.ok(!registry.some((r) => !CITED.includes(r.domain) && r.pages_served.split(';').includes(ROUTE)));
    assert.deepEqual(pageMap.find((r) => r.slug === ROUTE)?.data_sources_all.split(';').sort(), [...CITED].sort());
    assert.ok(!/630\.11/.test(page));
  });

  it('no withdrawal; joins the gates, the route list and the footer', () => {
    assert.ok(!page.includes('WithdrawnTool'));
    assert.ok(!read('../research/wsz002-withdrawals.csv').includes(ROUTE));
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE) && gates.necRefs.enforce.includes(ROUTE));
    const r = ROUTES.find((x) => x.path === ROUTE);
    assert.ok(r && r.name === 'Welder Wire Size Calculator' && r.group === 'wire-sizing' && !/\d/.test(r.line));
    assert.match(read('../src/components/layout/Footer.tsx'), /welder-calculator/);
  });
});
