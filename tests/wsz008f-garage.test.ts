// WSZ-008f: the garage subpanel calculator, back from its WSZ-002 withdrawal. The feeder sizes are the wire size engine's
// (Table 310.16 in the column 110.14(C) sets, 240.4(D)), the ground wire Table 250.122's in the chosen metal (the old
// tool showed copper on aluminum), the garage disconnect 225.39's 60 A, the cover Table 300.5(A)'s without EMT or row 3,
// and the calculator never estimates a load. The page's eleven sources agree with /methodology, the registry and the page
// map, and the withdrawal is gone.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import burial from '../data/verified/nec-300-5-2023.json';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { ROUTES } from '../src/lib/routes';
import { DOMAINS, ENGINE_ID, GARAGE_RATINGS, garageRun, isGarageError } from '../src/lib/calculations/garage-subpanel';
import type { GarageInput } from '../src/lib/calculations/garage-subpanel';
import { minimumConductor, sizeConductor, isSizingError } from '../src/lib/calculations/conductor-sizing';
import { COVER_ROWS, DEFAULT_INPUT, EXAMPLE, EXAMPLE_LOAD, GENERAL_COVERS, RATING_ROWS } from '../src/lib/garage-page';
import { BURIAL_METHODS, BURIAL_PLACES, burialCover } from '../src/lib/verified/nec-300-5';
import { egcRow } from '../src/lib/verified/nec-250-122';
import { columnKey, table31016 } from '../src/lib/verified/nec-310-16';
import { DISCONNECT_MIN_A } from '../src/lib/verified/nec-separate-buildings';

const ROUTE = '/calculators/garage-subpanel-calculator';
const CITED = [
  'nec-310-16',
  'nec-110-14c',
  'nec-240-ocpd',
  'nec-240-4-d',
  'nec-250-grounding',
  'nec-250-32',
  'nec-feeders-outbuildings',
  'nec-300-5-burial',
  'nec-220-load-calcs',
  'conductor-resistance-20c',
  'nec-continuous-load',
];
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
/** A source file with its comments removed, so a test reads only what renders or runs. */
const code = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const run = (patch: Partial<GarageInput> = {}) => {
  const r = garageRun({ ...DEFAULT_INPUT, ...patch });
  assert.ok(!isGarageError(r));
  return r;
};

describe('WSZ-008f the engine', () => {
  it('offers the standard ratings from 30 A to 200 A and rejects any other', () => {
    assert.equal(GARAGE_RATINGS[0], 30);
    assert.equal(GARAGE_RATINGS[GARAGE_RATINGS.length - 1], 200);
    assert.ok(isGarageError(garageRun({ ...DEFAULT_INPUT, feederA: 65 })));
    assert.ok(isGarageError(garageRun({ ...DEFAULT_INPUT, feederA: 225 })));
    assert.equal(ENGINE_ID, 'garage-subpanel');
    for (const d of ['nec-feeders-outbuildings', 'nec-250-32', 'nec-300-5-burial']) assert.ok(DOMAINS.includes(d), d);
  });

  it('sizes the conductors exactly as the wire size calculator does', () => {
    for (const material of ['Cu', 'Al'] as const) {
      for (const feederA of [30, 60, 100, 125, 200]) {
        const r = run({ feederA, material, lengthFt: 50 });
        const w = sizeConductor({ ocpdA: feederA, material, wiringMethod: 'conductors', termination: 'unknown', loadA: null, continuous: false, lengthFt: 50, volts: 240, phase: 'single', vdTargetPct: 3 });
        assert.ok(!isSizingError(w));
        assert.equal(r.feeder.size, w.size, `${feederA} A ${material}`);
        assert.equal(r.feeder.egc, w.egc, `${feederA} A ${material}`);
      }
    }
  });

  it('gives the ground wire in the chosen metal (the old tool showed copper on aluminum)', () => {
    const al = run({ material: 'Al', lengthFt: 10 });
    assert.equal(al.feeder.egc, egcRow(DEFAULT_INPUT.feederA)?.alCca);
    const cu = run({ material: 'Cu', lengthFt: 10 });
    assert.equal(cu.feeder.egc, egcRow(DEFAULT_INPUT.feederA)?.cu);
    assert.notEqual(al.feeder.egc, cu.feeder.egc);
  });

  it('four wires, a 60 A garage disconnect, and the cover only for a buried run', () => {
    const r = run();
    assert.equal(r.wires, 4);
    assert.equal(r.disconnectMinA, DISCONNECT_MIN_A.allOthers);
    assert.equal(r.disconnectMinA, 60);
    assert.deepEqual(r.cover, { inches: 18, mm: 450 });
    assert.equal(run({ burial: 'none' }).cover, null);
    assert.ok(r.steps.some((s) => s.includes('250.32(B)(1)')));
    assert.ok(r.steps.some((s) => s.includes('225.39')));
    assert.ok(r.steps.some((s) => s.includes('Table 300.5(A)')));
  });

  it('a calculated load that fits the next size down shows it under 240.4(B)', () => {
    assert.deepEqual(EXAMPLE_LOAD.feeder.nextSizeUp && [EXAMPLE_LOAD.feeder.nextSizeUp.size, EXAMPLE_LOAD.feeder.nextSizeUp.ampacity], ['6', 55]);
    assert.ok(EXAMPLE_LOAD.steps.some((s) => s.includes('240.4(B)')));
    assert.ok(!EXAMPLE.steps.some((s) => s.includes('240.4(B)')));
    assert.equal(run({ loadA: 58 }).feeder.nextSizeUp, null);
  });
});

describe('WSZ-008f the tables', () => {
  it('each size is the smallest that reaches the rating in its column, after 240.4(D)', () => {
    for (const r of RATING_ROWS) {
      for (const [pick, material, column] of [
        [r.cu60, 'Cu', 60],
        [r.cu75, 'Cu', 75],
        [r.al60, 'Al', 60],
        [r.al75, 'Al', 75],
      ] as const) {
        const m = minimumConductor({ ocpdA: r.ratingA, material, wiringMethod: 'conductors', termination: column === 60 ? '60' : '75' });
        assert.equal(pick.size, m?.size, `${r.ratingA} A ${material} ${column} °C`);
        assert.ok(pick.ampacity >= r.ratingA);
        assert.equal(pick.ampacity, table31016(pick.size, columnKey(material, column)));
      }
      assert.equal(r.egcCu, egcRow(r.ratingA)?.cu);
      assert.equal(r.egcAl, egcRow(r.ratingA)?.alCca);
    }
    const r60 = RATING_ROWS.find((x) => x.ratingA === 60);
    assert.deepEqual(r60 && [r60.cu60.size, r60.al60.size, r60.cu75.size, r60.al75.size, r60.egcCu, r60.egcAl], ['4', '3', '6', '4', '10', '8']);
  });

  it('Table 300.5(A): the three methods under open ground and the five places, never EMT or row 3', () => {
    assert.deepEqual(
      GENERAL_COVERS.map((c) => [c.method, c.cover.inches, c.cover.mm]),
      [
        ['direct', 24, 600],
        ['nonmetallic', 18, 450],
        ['rmc', 6, 150],
      ],
    );
    assert.equal(COVER_ROWS.length, 5);
    assert.ok(!BURIAL_PLACES.some((p) => p.row === 3));
    assert.ok(!BURIAL_METHODS.some((m) => /EMT|electrical metallic tubing/i.test(m.label)));
    const row1 = burial.table_300_5_A.rows.find((r) => r.row === 1) as unknown as Record<string, number>;
    assert.equal(burialCover('direct', 'general').inches, row1.col1_in);
    assert.equal(burialCover('rmc', 'general').inches, row1.col2_in);
    assert.equal(burialCover('nonmetallic', 'general').inches, row1.col3_in);
    assert.deepEqual(
      ['direct', 'nonmetallic', 'rmc'].map((m) => burialCover(m as 'direct', 'dwelling-driveway').inches),
      [18, 18, 18],
    );
  });
});

describe('WSZ-008f sources, listings and the withdrawal', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];
  const page = code('../src/app/calculators/garage-subpanel-calculator/page.tsx');
  const tool = code('../src/components/calculators/GarageSubpanelTool.tsx');

  it('/methodology, the registry and the page map list the calculator under its eleven sources', () => {
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

  it('no load estimate, no withdrawal notice, nothing unverified', () => {
    assert.ok(!page.includes('WithdrawnTool'));
    assert.ok(!read('../research/wsz002-withdrawals.csv').includes(ROUTE));
    for (const gone of ['demand factor', '340.80', '310.15(F)', 'EMT', 'ground rod is', 'Schedule 80']) {
      assert.ok(!page.includes(gone), gone);
      assert.ok(!tool.includes(gone), gone);
    }
  });

  it('joins gates b and c, the route list and the footer', () => {
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE));
    assert.ok(gates.necRefs.enforce.includes(ROUTE));
    const r = ROUTES.find((x) => x.path === ROUTE);
    assert.ok(r && r.name === 'Garage Subpanel Calculator' && r.group === 'wire-sizing');
    assert.match(read('../src/components/layout/Footer.tsx'), /garage-subpanel-calculator/);
  });
});
