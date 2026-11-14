// WSZ-006c PHYSICS: the low voltage calculator's calculation path (lowVoltageSize, lvDrop and lvLengthForDrop in
// src/lib/calculations/dc-sizing.ts, which LowVoltageTool, the page and its drawings call) reproduces every golden case
// of the "dc-sizing" group from the current, and its drops agree with the sizing: the size for the drop meets the
// target and the size below it does not. Golden values come from research/golden-cases.json, never typed here.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import golden from '../research/golden-cases.json';
import { AWG_CONSTANTS } from '../src/lib/verified/awg';
import { TABLE_310_16_SIZES } from '../src/lib/verified/nec-310-16';
import { LV_TOOL_TEMPS, dcSizing, lowVoltageSize, lvDrop, lvLengthForDrop } from '../src/lib/calculations/dc-sizing';

interface DcCase {
  group: string;
  name: string;
  inputs: { volts: number; watts: number; length_ft_one_way: number; max_drop_pct: number; conductor_temp_c: number };
  expected: { amps: number; required_cmil: number; vd_size: string | null; current_size: string | null; result_size: string | null; governs: string | null };
  tolerance: { required_cmil: number; amps: number };
}

const cases = (golden.cases as unknown as DcCase[]).filter((c) => c.group === 'dc-sizing');
const key = (s: string | null) => (s === null ? null : s.replace(/^(\d)\/0$/, '$1/0'));

describe('WSZ-006c low voltage calculator: golden cases through lowVoltageSize', () => {
  it('the dc-sizing group has cases', () => assert.ok(cases.length >= 6, `${cases.length} cases`));
  for (const c of cases) {
    it(c.name, () => {
      const i = c.inputs;
      const r = lowVoltageSize({ volts: i.volts, amps: i.watts / i.volts, lengthFt: i.length_ft_one_way, dropPct: i.max_drop_pct, tempC: i.conductor_temp_c });
      assert.ok(r, 'a result');
      assert.ok(Math.abs(r.amps - c.expected.amps) <= c.tolerance.amps);
      assert.ok(Math.abs(r.requiredCmil - c.expected.required_cmil) <= c.tolerance.required_cmil, `${r.requiredCmil}`);
      assert.equal(r.vdSize, key(c.expected.vd_size));
      assert.equal(r.currentSize, key(c.expected.current_size));
      assert.equal(r.resultSize, key(c.expected.result_size));
      assert.equal(r.governs, c.expected.governs);
      // the same as the watts path the older pages use
      const w = dcSizing({ volts: i.volts, watts: i.watts, lengthFt: i.length_ft_one_way, dropPct: i.max_drop_pct, tempC: i.conductor_temp_c });
      assert.ok(!('error' in w));
      assert.equal(w.resultSize, r.resultSize);
      assert.ok(Math.abs(r.requiredMm2 - r.requiredCmil * AWG_CONSTANTS.mm2_per_cmil) < 1e-9);
    });
  }
});

describe('WSZ-006c low voltage calculator: drops agree with the sizing', () => {
  const input = { volts: 12, amps: 33.333333333333336, lengthFt: 40, dropPct: 2, tempC: 75 };
  it('the size for the drop meets the target and the size below it does not', () => {
    const r = lowVoltageSize(input);
    assert.ok(r && r.vdSize);
    assert.ok(lvDrop(r.vdSize, input).vdPct <= input.dropPct);
    const below = TABLE_310_16_SIZES[TABLE_310_16_SIZES.indexOf(r.vdSize) - 1];
    assert.ok(lvDrop(below, input).vdPct > input.dropPct);
  });
  it('the result carries its drop and up to two sizes either side', () => {
    const r = lowVoltageSize(input);
    assert.ok(r && r.result && r.resultSize);
    assert.equal(r.result.size, r.resultSize);
    const i = TABLE_310_16_SIZES.indexOf(r.resultSize);
    assert.deepEqual(r.neighbours.map((n) => n.size), TABLE_310_16_SIZES.slice(Math.max(0, i - 2), i + 3));
    assert.equal(r.currentAmpacity !== null && r.currentAmpacity >= input.amps, true);
  });
  it('lvLengthForDrop inverts lvDrop', () => {
    const length = lvLengthForDrop('10', 12, 10, 3, 75);
    const drop = lvDrop('10', { volts: 12, amps: 10, lengthFt: length, dropPct: 3, tempC: 75 });
    assert.ok(Math.abs(drop.vdPct - 3) < 1e-9);
  });
  it('doubling the voltage at the same power cuts the area to a quarter', () => {
    const at = (volts: number) => lowVoltageSize({ volts, amps: 400 / volts, lengthFt: 40, dropPct: 2, tempC: 75 });
    const a = at(12);
    const b = at(24);
    assert.ok(a && b);
    assert.ok(Math.abs(b.requiredCmil / a.requiredCmil - 0.25) < 1e-12);
  });
  it('takes only the two temperatures it offers, and refuses empty input', () => {
    assert.deepEqual(LV_TOOL_TEMPS, [20, 75]);
    assert.equal(lowVoltageSize({ ...input, tempC: 30 }), null);
    assert.equal(lowVoltageSize({ ...input, amps: 0 }), null);
  });
  it('reports no size when even 2000 kcmil is too small for the drop', () => {
    const r = lowVoltageSize({ volts: 12, amps: 250, lengthFt: 100, dropPct: 1, tempC: 75 });
    assert.ok(r);
    assert.equal(r.vdSize, null);
    assert.equal(r.resultSize, null);
    assert.equal(r.result, null);
    assert.equal(r.neighbours.at(-1)?.size, TABLE_310_16_SIZES.at(-1));
  });
});
