// WSZ-008a: the ground wire calculator rebuilt in the look with its two modes kept apart. The equipment grounding
// conductor path (egcFor) reproduces the golden Table 250.122 rows and the 250.122(B) results of the golden wire size
// cases; the electrode conductor path (gecFor) the golden Table 250.66 rows; the dwelling-service rows the page shows
// come from the golden service lookup. /methodology, the registry and the page map list the page under the four sources
// it cites; it never states the unverified 250.66(A)/(B) limits or the 250.122 cap. Golden values come from
// research/golden-cases.json, never typed here.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import golden from '../research/golden-cases.json';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { GROUND_WIRE_RATINGS, GROUND_WIRE_SIZES, egcFor, gecFor, isEgcError } from '../src/lib/calculations/grounding';
import { SERVICE_RATINGS, serviceLookup } from '../src/lib/calculations/service-lookup';

interface GoldenCase {
  group: string;
  name: string;
  inputs: Record<string, number | string>;
  expected: Record<string, unknown>;
}
const cases = golden.cases as unknown as GoldenCase[];
const ROUTE = '/calculators/ground-wire-calculator';
const CITED = ['nec-250-grounding', 'nec-240-ocpd', 'nec-310-12', 'awg-geometry'];
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');

describe('WSZ-008a equipment grounding conductor (Table 250.122, 250.122(B))', () => {
  for (const c of cases.filter((x) => x.group === 'table-250-122')) {
    const a = Number(c.inputs.ocpd_a);
    if (!GROUND_WIRE_RATINGS.includes(a)) continue; // the tool offers the Table 240.6(A) ratings only (61 A, 6001 A)
    it(c.name, () => {
      for (const [m, key] of [
        ['Cu', 'cu'],
        ['Al', 'al_cca'],
      ] as const) {
        const r = egcFor(a, m);
        assert.ok(!isEgcError(r));
        assert.equal(r.tableEgc, c.expected[key], `${m}`);
        assert.equal(r.egc, c.expected[key]);
        assert.equal(r.rowA, c.expected.row_a);
      }
    });
  }

  it('a rating outside Table 240.6(A), 15–6000 A, is refused', () => {
    for (const a of [61, 6001, 0, 14]) assert.ok(isEgcError(egcFor(a, 'Cu')), `${a}`);
  });

  it('the upsized examples are golden wire size cases (20 A Cu 12 → 6 AWG; 60 A Al 3 → 2 AWG)', () => {
    const cu = cases.find((x) => x.name === '20 A OCPD, 16 A load, 150 ft, 120 V, single-phase, Cu');
    const al = cases.find((x) => x.name === '60 A OCPD, 48 A load, 200 ft, 240 V, single-phase, Al');
    assert.ok(cu && al);
    for (const [c, m] of [
      [cu, 'Cu'],
      [al, 'Al'],
    ] as const) {
      assert.equal(c.expected.egc_upsized, true);
      const r = egcFor(Number(c.inputs.ocpd_a), m, { minSize: String(c.expected.min_size_by_ampacity), installedSize: String(c.expected.size) });
      assert.ok(!isEgcError(r));
      assert.equal(r.egc, c.expected.egc, c.name);
    }
  });

  it('upsizing needs an installed size larger than the minimum', () => {
    const same = egcFor(20, 'Cu', { minSize: '12', installedSize: '12' });
    const smaller = egcFor(20, 'Cu', { minSize: '10', installedSize: '12' });
    assert.ok(isEgcError(same) && same.error === 'sizes-invalid');
    assert.ok(isEgcError(smaller) && smaller.error === 'sizes-invalid');
  });
});

describe('WSZ-008a grounding electrode conductor (Table 250.66)', () => {
  for (const c of cases.filter((x) => x.group === 'table-250-66')) {
    it(c.name, () => {
      const cu = c.inputs.service_cu !== undefined;
      const r = gecFor(String(cu ? c.inputs.service_cu : c.inputs.service_al), cu ? 'Cu' : 'Al');
      assert.ok(r);
      assert.equal(r.gec.cu, c.expected.gec_cu);
      assert.equal(r.gec.alCca, c.expected.gec_al_cca);
    });
  }

  it('offers 14 AWG to 2000 kcmil and nothing else', () => {
    assert.equal(GROUND_WIRE_SIZES[0], '14');
    assert.equal(GROUND_WIRE_SIZES[GROUND_WIRE_SIZES.length - 1], '2000');
    assert.equal(gecFor('18', 'Cu'), null);
  });

  it('every dwelling-service row gives the same electrode conductor for its copper and its aluminum service (the page says so)', () => {
    for (const a of SERVICE_RATINGS) {
      const s = serviceLookup(a);
      assert.ok(s);
      assert.deepEqual(s.gecForCuService, s.gecForAlService, `${a} A`);
    }
  });
});

describe('WSZ-008a sources and removals', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];
  const page = read('../src/app/calculators/ground-wire-calculator/page.tsx');
  const tool = read('../src/components/calculators/GroundWireTool.tsx');

  it('/methodology, the registry and the page map list the page under its four sources', () => {
    const listed = METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(ROUTE)).map((s) => s.domain);
    assert.deepEqual([...listed].sort(), [...CITED].sort());
    for (const d of CITED) {
      const row = registry.find((r) => r.domain === d);
      assert.ok(row && row.status === 'verified' && row.pages_served.split(';').includes(ROUTE), d);
    }
    const mapRow = pageMap.find((r) => r.slug === ROUTE);
    assert.ok(mapRow);
    assert.deepEqual(mapRow.data_sources_all.split(';').sort(), [...CITED].sort());
  });

  it('states none of the unverified electrode limits, and states the 250.122(A) cap it now applies (WSZ-038)', () => {
    // the code comments name the electrode limits to say why they are left out; the rendered text must not
    const code = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    for (const text of [code(page), code(tool)]) {
      assert.ok(!/250\.66\s*\((A|B)\)/.test(text));
      assert.match(text, /250\.122\(A\)/);
    }
  });

  it('the old component and its unsourced lists are gone; the page joins gates b and c', () => {
    assert.ok(!existsSync(new URL('../src/components/calculators/GroundWireCalculator.tsx', import.meta.url)));
    for (const gone of ['8 ft minimum', 'Swimming Pools', 'Ufer', '250.118', 'Common Installation Errors']) assert.ok(!page.includes(gone), gone);
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE));
    assert.ok(gates.necRefs.enforce.includes(ROUTE));
  });

  it('check-structure forbids 340.80 (UF stays unverified), not 334.80 (verified in WSZ-029) or 110.14(C)', () => {
    const gate = read('../scripts/check-structure.mjs');
    assert.match(gate, /text\.includes\('340\.80'\)/);
    assert.ok(!gate.includes("'334.80'"));
    assert.ok(!gate.includes("['110.14(C)'"));
  });
});
