// WSZ-007d: the Ohm's law calculator's any-two path (solvePair) and the BTU conversions reproduce the golden "ohms-law"
// and "conversion" cases the pages show; the six pairs agree with each other. Golden values come from
// research/golden-cases.json, never typed here.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import golden from '../research/golden-cases.json';
import { OHMS_PAIRS, solvePair } from '../src/lib/calculations/ohms-law';
import { btuPerHourToTons, btuPerHourToWatts, tonsToWatts, wattsToBtuPerHour } from '../src/lib/calculations/conversions';

interface GoldenCase {
  group: string;
  name: string;
  inputs: Record<string, number>;
  expected: Record<string, number>;
  tolerance: Record<string, number>;
}
const cases = golden.cases as unknown as GoldenCase[];
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

describe('WSZ-007d Ohm’s law: any two of volts, amps, ohms and watts', () => {
  const ohms = cases.filter((c) => c.group === 'ohms-law');
  it('the golden file has the three worked examples', () => assert.equal(ohms.length, 3));
  for (const c of ohms) {
    it(c.name, () => {
      const i = c.inputs;
      const r =
        i.watts !== undefined
          ? solvePair('vp', i.volts, i.watts)
          : i.amps !== undefined
            ? solvePair('vi', i.volts, i.amps)
            : solvePair('vr', i.volts, i.ohms);
      assert.ok(r);
      const got: Record<string, number> = { amps: r.current, ohms: r.resistance, watts: r.power, volts: r.voltage };
      for (const [k, v] of Object.entries(c.expected)) assert.ok(near(got[k], v, c.tolerance[k]), `${k}: ${got[k]}`);
    });
  }
  it('every pair gives the same four values for one load', () => {
    const base = { voltage: 240, current: 6.25, resistance: 38.4, power: 1500 };
    for (const p of OHMS_PAIRS) {
      const [qa, qb] = p.known;
      const r = solvePair(p.value, base[qa], base[qb]);
      assert.ok(r, p.value);
      for (const k of Object.keys(base) as (keyof typeof base)[]) assert.ok(near(r[k], base[k], 1e-9 * base[k]), `${p.value} ${k}`);
    }
  });
  it('refuses values at or below 0, past the limit or not numbers', () => {
    for (const [a, b] of [
      [0, 5],
      [5, -1],
      [Number.NaN, 5],
      [5, 2e9],
    ]) {
      assert.equal(solvePair('vi', a, b), null);
    }
  });
});

describe('WSZ-007d BTU to watts: the golden conversion cases', () => {
  const conv = cases.filter((c) => c.group === 'conversion');
  it('12,000 Btu/h, 9,000 Btu/h, 1,000 W and 1 ton', () => {
    const by = (name: string) => {
      const c = conv.find((x) => x.name === name);
      assert.ok(c, name);
      return c;
    };
    let c = by('12,000 Btu/h to watts');
    assert.ok(near(btuPerHourToWatts(c.inputs.btu_per_h), c.expected.watts, c.tolerance.watts));
    assert.ok(near(btuPerHourToTons(c.inputs.btu_per_h), 1, 1e-12));
    c = by('9,000 Btu/h to watts');
    assert.ok(near(btuPerHourToWatts(c.inputs.btu_per_h), c.expected.watts, c.tolerance.watts));
    c = by('1000 W to Btu/h');
    assert.ok(near(wattsToBtuPerHour(c.inputs.watts), c.expected.btu_per_h, c.tolerance.btu_per_h));
    c = by('1 ton of refrigeration to watts');
    assert.ok(near(tonsToWatts(c.inputs.tons), c.expected.watts, c.tolerance.watts));
  });
});
