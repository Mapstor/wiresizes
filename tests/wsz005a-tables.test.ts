// WSZ-005a: the data helpers and the engine function the two rebuilt table guides use.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AWG_TABLE, KCMIL_TABLE } from '../src/lib/verified/awg';
import { areaRatio, diameterRatio } from '../src/lib/calculations/awg-geometry';
import { conditions240_4D, ROWS_240_4_D } from '../src/lib/verified/nec-240-4-d';
import { AMPACITY_COLUMNS, COLUMN_TYPES } from '../src/lib/verified/nec-310-16';
import { minimumServiceAmpacity } from '../src/lib/calculations/service-lookup';
import { NEC_2026_EFFECTIVE, NEC_2026_ISSUED, NEC_2026_MIN_SIZES } from '../src/lib/verified/nec-2026-edition';

describe('WSZ-005a table guides', () => {
  it('awg.json gives every AWG size from 0000 to 40 and the kcmil sizes from 250 to 2000', () => {
    assert.equal(AWG_TABLE.length, 44);
    assert.equal(AWG_TABLE[0].awg, '0000');
    assert.equal(AWG_TABLE[AWG_TABLE.length - 1].awg, '40');
    assert.deepEqual([KCMIL_TABLE[0].kcmil, KCMIL_TABLE[KCMIL_TABLE.length - 1].kcmil], [250, 2000]);
  });

  it('the AWG scaling rules come out of the definition', () => {
    assert.ok(Math.abs(diameterRatio(6) - 2.005) < 0.0005);
    assert.ok(Math.abs(areaRatio(3) - 2.005) < 0.0005);
    // research/page-specs.md says ×10.19 for 10 steps; the definition gives 92^(20/39) = 10.16
    assert.ok(Math.abs(areaRatio(10) - 10.164) < 0.001);
  });

  it('240.4(D) conditions are read from the data text', () => {
    const byItem = (item: string, material: string) => ROWS_240_4_D.find((r) => r.item === item && r.material === material);
    const d1 = byItem('(D)(1)', 'Cu');
    assert.ok(d1);
    assert.deepEqual(conditions240_4D(d1), { continuousMaxA: 5.6, fuseClasses: ['CC', 'CF', 'J', 'T'] });
    const d3 = byItem('(D)(3)', 'CCA');
    assert.ok(d3);
    assert.deepEqual(conditions240_4D(d3), { continuousMaxA: 8, fuseClasses: null });
    const d6 = byItem('(D)(6)', 'Cu');
    assert.ok(d6);
    assert.equal(conditions240_4D(d6), null);
  });

  it('Table 310.16 lists insulation types for each temperature column', () => {
    assert.deepEqual(AMPACITY_COLUMNS, [60, 75, 90]);
    for (const c of AMPACITY_COLUMNS) assert.ok(COLUMN_TYPES[c].length > 0);
    assert.match(COLUMN_TYPES[90], /THHN/);
  });

  it('310.12(A): a 200 A dwelling service needs 166 A of conductor ampacity', () => {
    assert.equal(minimumServiceAmpacity(200), 166);
  });

  it('the 2026 edition facts come from the registry row', () => {
    assert.equal(NEC_2026_ISSUED, '2025-08-20');
    assert.equal(NEC_2026_EFFECTIVE, '2025-09-09');
    assert.deepEqual(NEC_2026_MIN_SIZES, { Cu: '16', CCA: '14', Al: '12' });
  });
});
