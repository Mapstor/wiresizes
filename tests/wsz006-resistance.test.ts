// WSZ-006 PHYSICS: the wire resistance calculator's calculation path (resistanceRun and its helpers in
// src/lib/calculations/resistance.ts, which WireResistanceTool and the page call) reproduces every golden case of the
// "resistance" group and the page's worked example, and its size lists, mm² matching and neighbours behave as the
// page says. Golden values come from research/golden-cases.json, never typed here.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import golden from '../research/golden-cases.json';
import { AWG_CONSTANTS, areaCmil } from '../src/lib/verified/awg';
import type { Material, SizeKey } from '../src/lib/verified/awg';
import {
  FT_PER_KM,
  areaMm2,
  commonSizes,
  equivalentSize,
  nearestSizeForMm2,
  ohmsPerKm,
  resistanceAt,
  resistanceRun,
  toolSizes,
} from '../src/lib/calculations/resistance';

interface Case {
  group: string;
  name: string;
  inputs: { size: SizeKey; material: Material; temp_c: number };
  expected: { ohm_per_1000ft: number };
  tolerance: { ohm_per_1000ft: number };
}

const cases = (golden.cases as unknown as Case[]).filter((c) => c.group === 'resistance');

describe('WSZ-006 wire resistance calculator: golden cases through resistanceRun', () => {
  it('the resistance group has cases', () => assert.ok(cases.length >= 8, `${cases.length} cases`));
  for (const c of cases) {
    it(c.name, () => {
      // 1000 ft: one conductor equals the rate per 1000 ft
      const run = resistanceRun(c.inputs.size, c.inputs.material, 1000, c.inputs.temp_c);
      assert.ok(run, 'a result');
      assert.ok(Math.abs(run.perKft - c.expected.ohm_per_1000ft) <= c.tolerance.ohm_per_1000ft, `${run.perKft} vs ${c.expected.ohm_per_1000ft}`);
      assert.ok(Math.abs(run.conductor - c.expected.ohm_per_1000ft) <= c.tolerance.ohm_per_1000ft);
      assert.equal(run.loop, 2 * run.conductor);
    });
  }
});

describe('WSZ-006 wire resistance calculator: the worked example and the side-by-side values', () => {
  const example = cases.find((c) => c.inputs.size === '14' && c.inputs.material === 'Cu' && c.inputs.temp_c === 75);
  it('100 ft of 14 AWG copper at 75 °C is a tenth of the golden rate, twice that out and back', () => {
    assert.ok(example);
    const run = resistanceRun('14', 'Cu', 100, 75);
    assert.ok(run);
    assert.ok(Math.abs(run.conductor - example.expected.ohm_per_1000ft / 10) <= example.tolerance.ohm_per_1000ft / 10);
    assert.ok(Math.abs(run.loop - (2 * example.expected.ohm_per_1000ft) / 10) <= example.tolerance.ohm_per_1000ft / 5);
    assert.equal(run.at75.conductor, run.conductor);
    assert.equal(run.at20.perKft, resistanceAt('14', 'Cu', 20));
  });
  it('the neighbours of 14 AWG are the sizes people buy: 18, 16, 14, 12 and 10 AWG', () => {
    const run = resistanceRun('14', 'Cu', 100, 75);
    assert.deepEqual(run?.neighbours.map((n) => n.size), ['18', '16', '14', '12', '10']);
  });
  it('an odd gauge keeps its own place among its neighbours', () => {
    const run = resistanceRun('13', 'Cu', 100, 20);
    assert.ok(run?.neighbours.some((n) => n.size === '13'));
  });
  it('the ends of the list have fewer neighbours', () => {
    assert.equal(resistanceRun('40', 'Cu', 100, 20)?.neighbours.length, 3);
    assert.equal(resistanceRun('2000', 'Cu', 100, 20)?.neighbours.length, 3);
  });
});

describe('WSZ-006 wire resistance calculator: sizes, mm² and per km', () => {
  it('copper runs 40 AWG to 2000 kcmil; aluminum EC-H19 starts at 12 AWG', () => {
    const cu = toolSizes('Cu');
    assert.equal(cu[0], '40');
    assert.equal(cu.at(-1), '2000');
    assert.equal(toolSizes('Al')[0], '12');
    assert.ok(!toolSizes('Al').includes('14'));
  });
  it('common sizes skip odd gauges from 18 AWG up but keep every thinner gauge', () => {
    const common = commonSizes('Cu');
    assert.ok(!common.includes('13') && !common.includes('17'));
    assert.ok(common.includes('19') && common.includes('23'));
  });
  it('2.5 mm² matches 13 AWG, 4 mm² 11 AWG, and an aluminum 1.5 mm² the smallest aluminum size', () => {
    assert.equal(nearestSizeForMm2(2.5, 'Cu'), '13');
    assert.equal(nearestSizeForMm2(4, 'Cu'), '11');
    assert.equal(nearestSizeForMm2(1.5, 'Al'), '12');
    assert.equal(nearestSizeForMm2(0, 'Cu'), null);
  });
  it('areaMm2 converts circular mils with awg.json\'s constant', () => {
    assert.equal(areaMm2('12'), areaCmil('12') * AWG_CONSTANTS.mm2_per_cmil);
  });
  it('per km: HB100\'s metric column for copper AWG, the foot\'s definition elsewhere', () => {
    assert.ok(Math.abs((ohmsPerKm('250', 'Cu', 20) as number) - ((resistanceAt('250', 'Cu', 20) as number) * FT_PER_KM) / 1000) < 1e-12);
    assert.ok(Math.abs((ohmsPerKm('12', 'Al', 20) as number) - ((resistanceAt('12', 'Al', 20) as number) * FT_PER_KM) / 1000) < 1e-12);
    assert.ok(Math.abs(FT_PER_KM - 3280.839895013123) < 1e-9);
  });
  it('the aluminum size that matches 12 AWG copper is 8 AWG (10 AWG reads higher)', () => {
    assert.equal(equivalentSize('12', 'Cu', 'Al'), '8');
    assert.ok((resistanceAt('10', 'Al', 20) as number) > (resistanceAt('12', 'Cu', 20) as number));
  });
});

describe('WSZ-006 wire resistance calculator: significant figures', () => {
  it('copper AWG: four figures below 1 Ω per 1000 ft, three from 1 Ω up, as NIST prints them', async () => {
    const { resistanceSig } = await import('../src/lib/calculations/resistance');
    assert.equal(resistanceSig('10', 'Cu'), 4);
    assert.equal(resistanceSig('12', 'Cu'), 3);
    assert.equal(resistanceSig('13', 'Cu'), 3);
    assert.equal(resistanceSig('40', 'Cu'), 3);
    assert.equal(resistanceSig('4/0', 'Cu'), 4);
    assert.equal(resistanceSig('250', 'Cu'), 4);
    assert.equal(resistanceSig('12', 'Al'), 4);
  });
});
