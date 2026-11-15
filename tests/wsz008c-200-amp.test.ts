// WSZ-008c: the 200 A guide rebuilt in the look. GUIDE_200 reproduces the golden 200 A service row, the golden
// Table 250.122 row for 200 A and the golden voltage drop of 4/0 AWG aluminum over 100 ft; the Table 310.16 feeder sizes
// are the smallest that reach each rating at the 110.14(C) column; 240.4(B) protects 4/0 AWG aluminum (180 A) at 200 A
// but not 2/0 AWG copper (175 A, a standard rating). /methodology gains a terminal temperature section, and the guide's
// eight sources agree across the page, /methodology, the registry and the page map. Table 310.12's scope reads as D-39
// words it. Golden values come from research/golden-cases.json, never typed here.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import golden from '../research/golden-cases.json';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { GUIDE_200, RATING_ROWS, feederColumn, feederSize, maxProtection } from '../src/lib/service-guides';
import { TERMINATION_RULES } from '../src/lib/verified/nec-110-14c';
import { NEXT_SIZE_UP_MAX_A } from '../src/lib/verified/nec-240-4-d';
import { ocpdRatings } from '../src/lib/verified/nec-240-6-a';
import { TABLE_310_16_ROWS, columnKey } from '../src/lib/verified/nec-310-16';
import { VOLTAGE_DROP_NOTE } from '../src/lib/verified/nec-continuous-load-2023';
import { lengthForDrop } from '../src/lib/calculations/voltage-drop';

interface GoldenCase {
  group: string;
  name: string;
  inputs: Record<string, number | string>;
  expected: Record<string, unknown>;
  tolerance?: Record<string, number>;
}
const cases = golden.cases as unknown as GoldenCase[];
const ROUTE = '/guides/wire-size-for-200-amp';
const CITED = ['nec-310-12', 'nec-310-16', 'nec-110-14c', 'nec-240-ocpd', 'nec-continuous-load', 'nec-250-grounding', 'conductor-resistance-20c', 'awg-geometry'];
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
/** A source file with its comments removed, so a test reads only what renders or runs. */
const code = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

describe('WSZ-008c the 200 A answers', () => {
  it('golden: the 200 A dwelling service row and its electrode conductor', () => {
    const c = cases.find((x) => x.group === 'service-lookup' && x.inputs.rating_a === 200);
    assert.ok(c);
    assert.equal(GUIDE_200.service.cu, c.expected.cu);
    assert.equal(GUIDE_200.service.alCca, c.expected.al_cca);
    const gec = c.expected.gec_for_cu_service as { cu: string; al_cca: string };
    assert.deepEqual(GUIDE_200.service.gecForCuService, { cu: gec.cu, alCca: gec.al_cca });
    assert.ok(Math.abs(GUIDE_200.minA - 166) < 1e-9);
  });

  it('golden: Table 250.122 for a 200 A feeder', () => {
    const c = cases.find((x) => x.group === 'table-250-122' && x.inputs.ocpd_a === 200);
    assert.ok(c);
    assert.deepEqual(GUIDE_200.egc.table, { cu: c.expected.cu, alCca: c.expected.al_cca });
  });

  it('golden: 4/0 AWG aluminum, 200 A, 100 ft, 240 V', () => {
    const c = cases.find((x) => x.name === '4/0 AWG Al, 200 A, 100 ft one way, 240 V, single-phase, 75 °C');
    assert.ok(c && c.tolerance);
    const d = GUIDE_200.drop100.al;
    assert.equal(d.lengthFt, c.inputs.length_ft_one_way);
    assert.ok(Math.abs(d.result.vdVolts - Number(c.expected.vd_volts)) <= c.tolerance.vd_volts);
    assert.ok(Math.abs(d.result.vdPct - Number(c.expected.vd_percent)) <= c.tolerance.vd_percent);
  });

  it('the feeder sizes: 75 °C above 100 A, the smallest size that reaches the rating', () => {
    assert.equal(feederColumn(GUIDE_200.ratingA), TERMINATION_RULES.columnAboveLimit);
    assert.throws(() => feederColumn(TERMINATION_RULES.limitA));
    assert.equal(GUIDE_200.cu.feeder, '3/0');
    assert.equal(GUIDE_200.al.feeder, '250');
    for (const r of RATING_ROWS) {
      assert.ok(r.ratingA > TERMINATION_RULES.limitA);
      for (const m of ['Cu', 'Al'] as const) {
        const key = columnKey(m, feederColumn(r.ratingA));
        const listed = TABLE_310_16_ROWS.filter((row) => row[key] !== null);
        const k = listed.findIndex((row) => row.size === feederSize(r.ratingA, m).size);
        assert.ok((listed[k][key] as number) >= r.ratingA, `${r.ratingA} ${m}`);
        assert.ok(k === 0 || (listed[k - 1][key] as number) < r.ratingA, `${r.ratingA} ${m} not the smallest`);
      }
    }
    assert.deepEqual(RATING_ROWS.map((r) => r.ratingA), [110, 125, 150, 175, 200, 225, 250, 300, 350, 400]);
  });

  it('240.4(B): 180 A takes a 200 A breaker, 175 A does not; never above 800 A', () => {
    assert.deepEqual(GUIDE_200.al.protection, { ratingA: 200, nextSizeUp: true });
    assert.deepEqual(GUIDE_200.cu.protection, { ratingA: 175, nextSizeUp: false });
    assert.equal(NEXT_SIZE_UP_MAX_A, 800);
    const ratings = ocpdRatings();
    assert.deepEqual(maxProtection(790), { ratingA: 800, nextSizeUp: true });
    const below = ratings.filter((r) => r < 900);
    assert.deepEqual(maxProtection(900), { ratingA: below[below.length - 1], nextSizeUp: false });
  });

  it('the note lengths reach the 215.2(A) feeder figure at full load', () => {
    for (const [m, size, ft] of [
      ['Cu', GUIDE_200.service.cu, GUIDE_200.noteFt.cu],
      ['Al', GUIDE_200.service.alCca, GUIDE_200.noteFt.al],
    ] as const) {
      const back = lengthForDrop({ size, material: m, amps: 200, volts: 240, circuit: 'single', sets: 1, tempC: 75 }, VOLTAGE_DROP_NOTE.feederPct);
      assert.ok(back !== null && Math.abs(back - ft) < 1e-9);
      assert.ok(ft > 150 && ft < 250, `${m} ${ft}`);
    }
  });
});

describe('WSZ-008c sources and wording', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];

  it('the eight sources agree on /methodology, the registry and the page map', () => {
    const listed = METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(ROUTE)).map((s) => s.domain);
    assert.deepEqual([...listed].sort(), [...CITED].sort());
    const terminals = METHODOLOGY_SECTIONS.find((s) => s.domain === 'nec-110-14c');
    assert.ok(terminals && terminals.id === 'terminals');
    for (const d of CITED) {
      const row = registry.find((r) => r.domain === d);
      assert.ok(row && row.status === 'verified' && row.pages_served.split(';').includes(ROUTE), d);
    }
    for (const row of registry.filter((r) => !CITED.includes(r.domain))) assert.ok(!row.pages_served.split(';').includes(ROUTE), row.domain);
    const mapRow = pageMap.find((r) => r.slug === ROUTE);
    assert.ok(mapRow);
    assert.deepEqual(mapRow.data_sources_all.split(';').sort(), [...CITED].sort());
  });

  it('gates b and c enforce the guide; it is a look guide', () => {
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE));
    assert.ok(gates.necRefs.enforce.includes(ROUTE));
    assert.match(read('../src/components/layout/GuidesFrame.tsx'), /'\/guides\/wire-size-for-200-amp'/);
  });

  it('nothing from the candidate installation row on the guide', () => {
    const page = code('../src/app/guides/wire-size-for-200-amp/page.tsx');
    for (const s of ['230.24', '230.79', '300.5', 'burial', 'utility', 'service drop', 'permit']) assert.ok(!page.includes(s), s);
  });

  it('D-39: no page that renders says "main power feeder" (the held 100 A guide waits for its rebuild)', () => {
    for (const rel of [
      '../src/app/guides/wire-size-for-200-amp/page.tsx',
      '../src/app/calculators/service-entrance-calculator/page.tsx',
      '../src/components/calculators/ServiceEntranceTool.tsx',
      '../src/app/guides/nec-table-310-16/page.tsx',
      '../src/app/guides/single-vs-three-phase/page.tsx',
      '../src/app/methodology/page.tsx',
      '../src/lib/methodology.ts',
      '../src/lib/routes.ts',
      '../src/lib/calculations/conductor-sizing.ts',
    ]) {
      assert.ok(!/main power feeder/i.test(code(rel)), rel);
    }
  });
});
