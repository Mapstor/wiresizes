// WSZ-006b PHYSICS: the voltage drop calculator's calculation path (dropRun, dropNeighbours, sizeForTarget and
// lengthForDrop in src/lib/calculations/voltage-drop.ts, which VoltageDropTool, the page and its charts call) reproduces
// every golden case of the "voltage-drop" and "parallel" groups, keeps the significant figures of the resistance, and
// finds the smallest size for a target. Golden values come from research/golden-cases.json, never typed here.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import golden from '../research/golden-cases.json';
import type { Material, SizeKey } from '../src/lib/verified/awg';
import { areaCmil } from '../src/lib/verified/awg';
import { decimalsAtSig } from '../src/lib/calculations/format';
import { fromRealPower, isPowerError } from '../src/lib/calculations/power';
import { resistanceAt, resistanceSig } from '../src/lib/calculations/resistance';
import {
  VD_TOOL_SINGLE_QUICK_VOLTS,
  ampacityPerConductorExceeded,
  circuitFactor,
  dropNeighbours,
  dropRun,
  lengthForDrop,
  parallelEquivalent,
  sizeForTarget,
  voltageDropSizes,
} from '../src/lib/calculations/voltage-drop';
import { THREE_PHASE_VOLTS } from '../src/lib/calculations/inputs';
import { VOLTAGE_DROP_NOTE } from '../src/lib/verified/nec-continuous-load-2023';

interface VdCase {
  group: string;
  name: string;
  inputs: { size: SizeKey; material: Material; amps: number; length_ft_one_way: number; volts: number; phase: number; conductor_temp_c: number };
  expected: { vd_volts: number; vd_percent: number };
  tolerance: { vd_volts: number; vd_percent: number };
}

interface ParallelCase {
  group: string;
  name: string;
  inputs: { size: SizeKey; sets: number };
  expected: { total_cmil: number; smallest_single_size_at_least: SizeKey };
  tolerance: { total_cmil: number };
}

const all = golden.cases as unknown as { group: string }[];
const vdCases = all.filter((c) => c.group === 'voltage-drop') as unknown as VdCase[];
const parallelCases = all.filter((c) => c.group === 'parallel') as unknown as ParallelCase[];

const base = (c: VdCase) => ({
  size: c.inputs.size,
  material: c.inputs.material,
  amps: c.inputs.amps,
  lengthFt: c.inputs.length_ft_one_way,
  volts: c.inputs.volts,
  circuit: c.inputs.phase === 3 ? ('three' as const) : ('single' as const),
  tempC: c.inputs.conductor_temp_c,
  sets: 1,
});

describe('WSZ-006b voltage drop calculator: golden cases through dropRun', () => {
  it('the voltage-drop group has cases', () => assert.ok(vdCases.length >= 6, `${vdCases.length} cases`));
  for (const c of vdCases) {
    it(c.name, () => {
      const run = dropRun(base(c));
      assert.ok(run, 'a result');
      assert.ok(Math.abs(run.vdVolts - c.expected.vd_volts) <= c.tolerance.vd_volts, `${run.vdVolts} vs ${c.expected.vd_volts}`);
      assert.ok(Math.abs(run.vdPct - c.expected.vd_percent) <= c.tolerance.vd_percent, `${run.vdPct} vs ${c.expected.vd_percent}`);
      assert.ok(Math.abs(run.loadVolts - (c.inputs.volts - run.vdVolts)) < 1e-12);
      const conductors = c.inputs.phase === 3 ? 3 : 2;
      assert.ok(Math.abs(run.lossW - (conductors * c.inputs.amps ** 2 * run.phaseKft * c.inputs.length_ft_one_way) / 1000) < 1e-9);
      assert.equal(run.sig, resistanceSig(c.inputs.size, c.inputs.material));
    });
  }
  it('DC drops like single-phase: two conductors', () => {
    const c = vdCases[0];
    const single = dropRun(base(c));
    const dc = dropRun({ ...base(c), circuit: 'dc' });
    assert.ok(single && dc);
    assert.equal(dc.vdVolts, single.vdVolts);
    assert.equal(circuitFactor('dc'), 2);
    assert.equal(circuitFactor('three'), Math.sqrt(3));
  });
  it('the conductor temperature changes the resistance as R(T) does', () => {
    const c = vdCases[0];
    const at20 = dropRun({ ...base(c), tempC: 20 });
    const at75 = dropRun(base(c));
    assert.ok(at20 && at75);
    assert.ok(Math.abs(at75.vdVolts / at20.vdVolts - (resistanceAt(c.inputs.size, 'Cu', 75) as number) / (resistanceAt(c.inputs.size, 'Cu', 20) as number)) < 1e-12);
  });
  it('refuses sizes it does not offer and sets outside 1–4', () => {
    const c = vdCases[0];
    assert.equal(dropRun({ ...base(c), size: '16' }), null);
    assert.equal(dropRun({ ...base(c), material: 'Al', size: '14' }), null);
    assert.equal(dropRun({ ...base(c), sets: 5 }), null);
    assert.equal(dropRun({ ...base(c), sets: 0 }), null);
  });
});

describe('WSZ-006b voltage drop calculator: parallel sets', () => {
  it('the parallel group has cases', () => assert.ok(parallelCases.length >= 3));
  for (const c of parallelCases) {
    it(c.name, () => {
      const eq = parallelEquivalent(c.inputs.size, c.inputs.sets);
      assert.ok(Math.abs(eq.totalCmil - c.expected.total_cmil) <= c.tolerance.total_cmil);
      assert.equal(eq.smallestSingleSize, c.expected.smallest_single_size_at_least);
    });
  }
  it('n sets divide the drop by n', () => {
    const c = vdCases[0];
    const one = dropRun(base(c));
    const two = dropRun({ ...base(c), sets: 2 });
    assert.ok(one && two);
    assert.ok(Math.abs(two.vdVolts - one.vdVolts / 2) < 1e-12);
    assert.ok(Math.abs(two.lossW - one.lossW / 2) < 1e-9);
  });
  it('the ampacity check uses the current in each conductor', () => {
    // 100 A on one 6 AWG copper exceeds its 60 °C ampacity; split over two sets it doesn't
    const run = { size: '6', material: 'Cu' as Material, amps: 100, sets: 1 };
    assert.ok(ampacityPerConductorExceeded(run) !== null);
    assert.equal(ampacityPerConductorExceeded({ ...run, sets: 2 }), null);
  });
});

describe('WSZ-006b voltage drop calculator: smallest size for a target', () => {
  const input = { material: 'Cu' as Material, amps: 20, lengthFt: 100, volts: 120, circuit: 'single' as const, tempC: 75, sets: 1 };
  it('finds the first size at or under the target, with the size below it above the target', () => {
    const search = sizeForTarget(input, VOLTAGE_DROP_NOTE.feederPct);
    assert.ok(search.found && search.smaller);
    assert.ok(search.found.vdPct <= VOLTAGE_DROP_NOTE.feederPct);
    assert.ok(search.smaller.vdPct > VOLTAGE_DROP_NOTE.feederPct);
    const sizes = voltageDropSizes('Cu');
    assert.equal(sizes.indexOf(search.found.size), sizes.indexOf(search.smaller.size) + 1);
    // every size before the one found is above the target
    for (const size of sizes.slice(0, sizes.indexOf(search.found.size))) {
      assert.ok((dropRun({ ...input, size }) as NonNullable<ReturnType<typeof dropRun>>).vdPct > VOLTAGE_DROP_NOTE.feederPct);
    }
  });
  it('a run no size can meet reports none', () => {
    const search = sizeForTarget({ ...input, amps: 5000, lengthFt: 5000 }, 0.1);
    assert.equal(search.found, null);
    assert.ok(search.smaller);
  });
  it('the smallest size meets a generous target at once', () => {
    const search = sizeForTarget({ ...input, amps: 1, lengthFt: 1 }, 20);
    assert.equal(search.found?.size, voltageDropSizes('Cu')[0]);
    assert.equal(search.smaller, null);
  });
});

describe('WSZ-006b voltage drop calculator: neighbours, lengths and figures', () => {
  it('neighbours: up to two smaller and two larger offered sizes', () => {
    const c = vdCases[0];
    const sizes = dropNeighbours(base(c)).map((r) => r.size);
    const all = voltageDropSizes('Cu');
    const i = all.indexOf(c.inputs.size);
    assert.deepEqual(sizes, all.slice(Math.max(0, i - 2), i + 3));
    assert.deepEqual(dropNeighbours({ ...base(c), size: '14' }).map((r) => r.size), ['14', '12', '10']);
  });
  it('lengthForDrop inverts dropRun', () => {
    const c = vdCases[0];
    const { lengthFt: _l, ...rest } = base(c);
    void _l;
    const length = lengthForDrop(rest, VOLTAGE_DROP_NOTE.feederPct);
    assert.ok(length !== null);
    const run = dropRun({ ...rest, lengthFt: length });
    assert.ok(run && Math.abs(run.vdPct - VOLTAGE_DROP_NOTE.feederPct) < 1e-9);
  });
  it('the informational note reads 3 % and 5 % from the data file', () => {
    assert.equal(VOLTAGE_DROP_NOTE.feederPct, 3);
    assert.equal(VOLTAGE_DROP_NOTE.totalPct, 5);
  });
  it('decimalsAtSig: the load voltage keeps the drop\'s decimals', () => {
    assert.equal(decimalsAtSig(3.094, 3), 2);
    assert.equal(decimalsAtSig(3.0073, 4), 3);
    assert.equal(decimalsAtSig(0.0123, 3), 3);
    assert.equal(decimalsAtSig(0, 3), 0);
    assert.equal(decimalsAtSig(123.4, 3), 0);
  });
  it('a load in watts becomes a current through the power engine', () => {
    const r = fromRealPower({ watts: 1500, volts: 120, circuit: 'single', pf: 1 });
    assert.ok(!isPowerError(r));
    assert.equal(r.amps, 12.5);
  });
  it('the offered voltages are numbers, three-phase on its line-to-line list', () => {
    assert.ok(THREE_PHASE_VOLTS.length > 0 && VD_TOOL_SINGLE_QUICK_VOLTS.every((v) => v > 0));
    assert.ok(areaCmil('1/0') > 0);
  });
});
