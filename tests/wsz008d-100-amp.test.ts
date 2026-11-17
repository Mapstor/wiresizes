// WSZ-008d: the 100 A guide rebuilt in the look. GUIDE_100 reproduces the golden 100 A service row and the golden Table
// 250.122 row for 100 A; the feeder sizes are the smallest that reach 100 A in the 60 °C column 110.14(C)(1)(a) sets and
// in the 75 °C column; 240.4(B) protects 2 AWG copper (95 A at 60 °C) at 100 A; the drops are the engine's at 75 °C.
// The 225.39 and 334.80 values come from data/verified (WSZ-029). The guide's eleven sources agree across the page,
// /methodology, the registry and the page map, and the page never names a section the site has not verified.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import golden from '../research/golden-cases.json';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { ROUTES } from '../src/lib/routes';
import { GUIDE_100, smallestAt } from '../src/lib/subpanel-guide';
import { TERMINATION_RULES } from '../src/lib/verified/nec-110-14c';
import { TABLE_310_16_ROWS, columnKey, table31016 } from '../src/lib/verified/nec-310-16';
import { VOLTAGE_DROP_NOTE } from '../src/lib/verified/nec-continuous-load-2023';
import { DISCONNECT_MIN_A, NM_CABLE } from '../src/lib/verified/nec-separate-buildings';
import { RESISTANCE_TEMP_C, dropRun, lengthForDrop } from '../src/lib/calculations/voltage-drop';

interface GoldenCase {
  group: string;
  name: string;
  inputs: Record<string, number | string>;
  expected: Record<string, unknown>;
}
const cases = golden.cases as unknown as GoldenCase[];
const ROUTE = '/guides/wire-size-for-100-amp';
const CITED = ['nec-310-12', 'nec-310-16', 'nec-110-14c', 'nec-cable-rules', 'nec-240-ocpd', 'nec-continuous-load', 'nec-250-grounding', 'nec-feeders-outbuildings', 'nec-250-32', 'conductor-resistance-20c', 'awg-geometry'];
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
/** A source file with its comments removed, so a test reads only what renders or runs. */
const code = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

describe('WSZ-008d the 100 A answers', () => {
  it('golden: the 100 A dwelling service row and its electrode conductor; 83 % of 100 A', () => {
    const c = cases.find((x) => x.group === 'service-lookup' && x.inputs.rating_a === 100);
    assert.ok(c);
    assert.equal(GUIDE_100.service.cu, c.expected.cu);
    assert.equal(GUIDE_100.service.alCca, c.expected.al_cca);
    const gec = c.expected.gec_for_cu_service as { cu: string; al_cca: string };
    assert.deepEqual(GUIDE_100.service.gecForCuService, { cu: gec.cu, alCca: gec.al_cca });
    assert.ok(Math.abs(GUIDE_100.minA - 83) < 1e-9);
  });

  it('golden: Table 250.122 for the 100 A breaker ahead of the feeder', () => {
    const c = cases.find((x) => x.group === 'table-250-122' && x.inputs.ocpd_a === 100);
    assert.ok(c);
    assert.deepEqual(GUIDE_100.egc.table, { cu: c.expected.cu, alCca: c.expected.al_cca });
  });

  it('the columns are the ones 110.14(C) sets at or below its 100 A split', () => {
    assert.ok(GUIDE_100.ratingA <= TERMINATION_RULES.limitA);
    assert.equal(GUIDE_100.low, TERMINATION_RULES.columnAtOrBelowLimit);
    assert.equal(GUIDE_100.high, TERMINATION_RULES.columnAboveLimit);
  });

  it('each pick is the smallest size that reaches 100 A in its column, and the one below falls short', () => {
    for (const [pick, material, column] of [
      [GUIDE_100.at60.cu, 'Cu', 60], [GUIDE_100.at60.al, 'Al', 60], [GUIDE_100.at75.cu, 'Cu', 75], [GUIDE_100.at75.al, 'Al', 75],
    ] as const) {
      const key = columnKey(material, column);
      assert.equal(table31016(pick.size, key), pick.amps);
      assert.ok(pick.amps >= GUIDE_100.ratingA);
      const sizes = TABLE_310_16_ROWS.map((r) => r.size);
      const below = table31016(sizes[sizes.indexOf(pick.size) - 1], key);
      assert.ok(below === null || below < GUIDE_100.ratingA, `${pick.size} ${key}`);
      assert.deepEqual(smallestAt(GUIDE_100.ratingA, material, column), pick);
    }
    assert.deepEqual([GUIDE_100.at60.cu.size, GUIDE_100.at60.al.size, GUIDE_100.at75.cu.size, GUIDE_100.at75.al.size], ['1', '1/0', '3', '1']);
  });

  it('240.4(B): 2 AWG copper, 95 A at 60 °C, may sit on a 100 A breaker', () => {
    assert.equal(GUIDE_100.nextSizeUp.size, '2');
    assert.equal(GUIDE_100.nextSizeUp.amps, table31016('2', 'cu_60'));
    assert.deepEqual(GUIDE_100.nextSizeUp.protection, { ratingA: 100, nextSizeUp: true });
  });

  it('the ladder carries Table 310.16 in both columns, from the service size up', () => {
    for (const [rows, material, first] of [[GUIDE_100.ladder.cu, 'Cu', GUIDE_100.service.cu], [GUIDE_100.ladder.al, 'Al', GUIDE_100.service.alCca]] as const) {
      assert.equal(rows[0].size, first);
      for (const r of rows) {
        assert.equal(r.a60, table31016(r.size, columnKey(material, 60)));
        assert.equal(r.a75, table31016(r.size, columnKey(material, 75)));
      }
    }
  });

  it('the drops and the note lengths are the engine’s, at 75 °C on 240 V single-phase', () => {
    const { run } = GUIDE_100;
    const again = dropRun({ size: '1', material: 'Cu', amps: 100, lengthFt: run.lengthFt, volts: 240, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C });
    assert.ok(again && Math.abs(again.vdVolts - run.cu60.vdVolts) < 1e-12);
    assert.ok(run.noteCu.vdPct <= VOLTAGE_DROP_NOTE.feederPct && run.noteAl.vdPct <= VOLTAGE_DROP_NOTE.feederPct);
    assert.ok(run.al60.vdPct > VOLTAGE_DROP_NOTE.feederPct, '1/0 AWG aluminum is past the note at 200 ft');
    const ft = lengthForDrop({ size: '1', material: 'Cu', amps: 100, volts: 240, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C }, VOLTAGE_DROP_NOTE.feederPct);
    assert.ok(ft !== null && Math.abs(ft - GUIDE_100.noteFt.cu60) < 1e-9);
  });

  it('225.39 and 334.80 come from data/verified', () => {
    const f225 = JSON.parse(read('../data/verified/nec-225-2023.json'));
    const v = f225.rules.find((r: { ref: string }) => r.ref === '225.39').values.values_2023;
    assert.deepEqual(DISCONNECT_MIN_A, { oneCircuit: v.A_one_circuit_A, twoCircuits: v.B_two_2wire_circuits_A, oneFamilyDwelling: v.C_one_family_dwelling_A, oneFamilyDwellingWires: v.C_wires, allOthers: v.D_all_others_A });
    assert.deepEqual(NM_CABLE, { maxColumnC: 60, correctionsFromC: 90 });
  });
});

describe('WSZ-008d sources, listings and limits', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];
  const page = code('../src/app/guides/wire-size-for-100-amp/page.tsx');

  it('/methodology, the registry and the page map list the guide under its eleven sources', () => {
    const listed = METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(ROUTE)).map((s) => s.domain);
    assert.deepEqual([...listed].sort(), [...CITED].sort());
    for (const d of CITED) {
      const row = registry.find((r) => r.domain === d);
      assert.ok(row && row.status === 'verified' && row.pages_served.split(';').includes(ROUTE), d);
      assert.ok(page.includes(`'${d}'`), `the page cites ${d}`);
    }
    const mapRow = pageMap.find((r) => r.slug === ROUTE);
    assert.ok(mapRow);
    assert.deepEqual(mapRow.data_sources_all.split(';').sort(), [...CITED].sort());
    assert.ok(!registry.some((r) => !CITED.includes(r.domain) && r.pages_served.split(';').includes(ROUTE)));
  });

  it('never names a section the site has not verified, nor the old page’s lists', () => {
    for (const gone of ['225.32', '230.79', '340.80', '310.15(F)', 'Install Conduit', 'Pull Conductors', 'Wet Locations', 'lucide-react']) {
      assert.ok(!page.includes(gone), gone);
    }
  });

  it('joins gates b and c, and the route list names it for both intents', () => {
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE));
    assert.ok(gates.necRefs.enforce.includes(ROUTE));
    const r = ROUTES.find((x) => x.path === ROUTE);
    assert.ok(r && r.name === 'Wire Size for 100 Amp Subpanel or Service');
    assert.match(read('../src/components/layout/GuidesFrame.tsx'), /'\/guides\/wire-size-for-100-amp'/);
  });
});
