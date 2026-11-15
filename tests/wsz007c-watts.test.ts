// WSZ-007c: amps to watts on the converter path (convertFromAmps) reproduces the golden case the page shows and inverts
// convertToAmps; watts to amps is convertToAmps from watts, with DC as power factor 1. Golden values come from
// research/golden-cases.json, never typed here.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import golden from '../research/golden-cases.json';
import { convertFromAmps, convertToAmps, isConvError, threePhase, isTpError } from '../src/lib/calculations/power';

interface GoldenCase {
  group: string;
  name: string;
  inputs: Record<string, number>;
  expected: Record<string, number>;
  tolerance: Record<string, number>;
}
const cases = golden.cases as unknown as GoldenCase[];
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

describe('WSZ-007c amps to watts and watts to amps', () => {
  it('50 A three-phase 480 V PF 0.92 to watts (golden)', () => {
    const c = cases.find((x) => x.name === '50 A three-phase 480 V PF 0.92 to watts');
    assert.ok(c);
    const r = convertFromAmps({ phases: 3, volts: c.inputs.volts, amps: c.inputs.amps, pf: c.inputs.pf });
    assert.ok(!isConvError(r));
    assert.ok(r.kw !== null && near(r.kw * 1000, c.expected.watts, c.tolerance.watts), `${r.kw}`);
    const t = threePhase({ volts: c.inputs.volts, known: 'amps-pf', amps: c.inputs.amps, pf: c.inputs.pf });
    assert.ok(!isTpError(t) && near(t.kw, r.kw ?? 0, 1e-12));
  });
  it('4500 W at 240 V to amps (golden), and DC as power factor 1', () => {
    const c = cases.find((x) => x.name === '4500 W at 240 V');
    assert.ok(c);
    const r = convertToAmps({ phases: 1, volts: c.inputs.volts, known: 'kw-pf', kw: c.inputs.watts / 1000, pf: 1 });
    assert.ok(!isConvError(r) && near(r.amps, c.expected.amps, c.tolerance.amps));
  });
  it('amps to watts inverts watts to amps on both circuits', () => {
    for (const [phases, volts, kw, pf] of [
      [1, 120, 1.8, 1],
      [1, 240, 7.2, 0.85],
      [3, 208, 10, 0.9],
      [3, 480, 50, 0.92],
    ] as const) {
      const a = convertToAmps({ phases, volts, known: 'kw-pf', kw, pf });
      assert.ok(!isConvError(a));
      const b = convertFromAmps({ phases, volts, amps: a.amps, pf });
      assert.ok(!isConvError(b) && b.kw !== null && near(b.kw, kw, 1e-9 * kw));
    }
  });
  it('refuses a current, voltage or power factor out of range', () => {
    for (const bad of [
      { phases: 1 as const, volts: 120, amps: 0, pf: 1 },
      { phases: 1 as const, volts: 0, amps: 10, pf: 1 },
      { phases: 3 as const, volts: 480, amps: 10, pf: 1.1 },
      { phases: 3 as const, volts: 480, amps: 1000001, pf: 1 },
    ]) {
      assert.ok(isConvError(convertFromAmps(bad)), JSON.stringify(bad));
    }
  });
});

describe('WSZ-007c sources and the old components', () => {
  const CITED: Record<string, string[]> = {
    '/calculators/watts-to-amps-calculator': [
      'nist-sp330-si-units',
      'eia-power-glossary',
      'doe-motor-load-efficiency',
      'mit-polyphase-networks',
      'doe-power-factor-cost',
      'mfr-water-heaters',
      'us-nominal-voltages',
    ],
    '/calculators/amps-to-watts-calculator': ['nist-sp330-si-units', 'eia-power-glossary', 'doe-motor-load-efficiency', 'mit-polyphase-networks', 'us-nominal-voltages'],
  };
  it('/methodology, the registry and the page map list each page under exactly the sources it cites', async () => {
    const { METHODOLOGY_SECTIONS } = await import('../src/lib/methodology');
    const { parseCsv } = await import('../src/lib/verified/csv.mjs');
    const { readFileSync } = await import('node:fs');
    const registry = parseCsv(readFileSync(new URL('../research/data-sources.csv', import.meta.url), 'utf8'));
    const pageMap = parseCsv(readFileSync(new URL('../research/page-map.csv', import.meta.url), 'utf8'));
    for (const [route, domains] of Object.entries(CITED)) {
      const listed = METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(route)).map((s) => s.domain);
      assert.deepEqual([...listed].sort(), [...domains].sort(), route);
      for (const d of domains) {
        const row = registry.find((r: Record<string, string>) => r.domain === d);
        assert.ok(row && row.status === 'verified' && row.pages_served.split(';').includes(route), `${d} → ${route}`);
      }
      const mapRow = pageMap.find((r: Record<string, string>) => Object.values(r).includes(route));
      assert.ok(mapRow, route);
      assert.deepEqual(mapRow.data_sources_all.split(';').sort(), [...domains].sort(), route);
    }
    // WSZ-007d moved Ohm's law off it too; WSZ-007e deletes the row with the guide's rebuild
    const old = registry.find((r: Record<string, string>) => r.domain === 'power-definitions');
    for (const route of Object.keys(CITED)) assert.ok(!old || !old.pages_served.split(';').includes(route), route);
  });
  it('the two old calculator components are gone', async () => {
    const { existsSync } = await import('node:fs');
    for (const f of ['WattsToAmpsCalculator', 'AmpsToWattsCalculator']) {
      assert.equal(existsSync(new URL(`../src/components/calculators/${f}.tsx`, import.meta.url)), false, f);
    }
  });
});
