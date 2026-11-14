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
