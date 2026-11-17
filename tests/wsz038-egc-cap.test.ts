// WSZ-038: NEC 250.122(A) (verified 2023 in WSZ-036) applied in every calculator that sizes a ground wire.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  egcCapCases,
  isSizingError,
  minimumConductor,
  sizeConductor,
  WIRE_SIZE_RATINGS,
} from '../src/lib/calculations/conductor-sizing';
import { egcFor, isEgcError } from '../src/lib/calculations/grounding';
import { areaCmil } from '../src/lib/verified/awg';

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');

describe('WSZ-038 250.122(A) ground wire cap', () => {
  it('only 25 A on aluminum has a Table 250.122 ground wire larger than its conductor', () => {
    assert.deepEqual(egcCapCases(), [{ ocpdA: 25, material: 'Al', tableEgc: '8', size: '10' }]);
  });

  it('the minimum conductor keeps the table size and installs the capped one', () => {
    const m = minimumConductor({ ocpdA: 25, material: 'Al', termination: '75', wiringMethod: 'conductors' });
    assert.ok(m);
    assert.deepEqual([m.size, m.tableEgc, m.egc, m.egcCapped], ['10', '8', '10', true]);
    const cu = minimumConductor({ ocpdA: 25, material: 'Cu', termination: '75', wiringMethod: 'conductors' });
    assert.ok(cu);
    assert.deepEqual([cu.size, cu.tableEgc, cu.egc, cu.egcCapped], ['10', '10', '10', false]);
  });

  it('the wire size engine never returns a ground wire larger than the conductors', () => {
    for (const ocpdA of WIRE_SIZE_RATINGS) {
      for (const material of ['Cu', 'Al'] as const) {
        for (const lengthFt of [25, 150, 600]) {
          const r = sizeConductor({ ocpdA, material, lengthFt, volts: 120, phase: 'single', vdTargetPct: 3, termination: 'unknown', wiringMethod: 'cable' } as never);
          if (isSizingError(r) || r.egc === null) continue;
          assert.ok(areaCmil(r.egc) <= areaCmil(r.size), `${ocpdA} A ${material} ${lengthFt} ft: ${r.egc} > ${r.size}`);
          assert.equal(r.egcLargerThanConductor, false);
        }
      }
    }
  });

  it('the ground wire calculator holds the base at the minimum size, then grows it by 250.122(B)', () => {
    const big = egcFor(25, 'Al', { minSize: '10', installedSize: '2/0' });
    assert.ok(!isEgcError(big) && big.upsized);
    assert.deepEqual([big.tableEgc, big.upsized.base, big.upsized.capped, big.upsized.egc], ['8', '10', true, '2/0']);
    const next = egcFor(25, 'Al', { minSize: '10', installedSize: '8' });
    assert.ok(!isEgcError(next) && next.upsized);
    assert.deepEqual([next.upsized.base, next.upsized.egc], ['10', '8']);
    const cu = egcFor(20, 'Cu', { minSize: '12', installedSize: '6' });
    assert.ok(!isEgcError(cu) && cu.upsized);
    // the table size equals the conductor here, so the ground wire follows the circuit wires size for size
    assert.deepEqual([cu.upsized.base, cu.upsized.capped, cu.upsized.egc], ['12', false, '6']);
  });

  it('the old note is gone and every sizing engine shows the 250.122(A) step', () => {
    const sizing = read('../src/lib/calculations/conductor-sizing.ts');
    assert.ok(!sizing.includes('EGC_LARGER_THAN_CONDUCTOR_NOTE'));
    for (const engine of ['breaker-sizing', 'dryer-circuit', 'range-circuit']) {
      assert.match(read(`../src/lib/calculations/${engine}.ts`), /egcStepParts\(/, engine);
    }
    for (const tool of ['WireSizeTool', 'BreakerTool', 'DryerTool', 'RangeTool', 'GarageSubpanelTool']) {
      assert.ok(!read(`../src/components/calculators/${tool}.tsx`).includes('egcLargerThanConductor'), tool);
    }
    const tool = read('../src/components/calculators/GroundWireTool.tsx');
    assert.match(tool, /!up && cap &&/);
    assert.match(read('../src/app/calculators/ground-wire-calculator/page.tsx'), /<GroundWireTool capCases=\{CAP_CASES\} \/>/);
    const method = read('../src/app/methodology/page.tsx');
    assert.ok(!method.includes('do not apply it yet'));
    assert.match(method, /Every\s+calculator that sizes the circuit wires therefore holds/);
  });
});
