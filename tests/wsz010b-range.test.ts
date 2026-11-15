// WSZ-010b: the range calculator. The engine's rangeRun (Table 220.55 with Note 1 and the notes after Note 3, the
// current, the wire and ground wire for the circuit the instructions give), the maker and NEMA accessors, the page's
// examples, and the route coming back from its WSZ-002 withdrawal.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ENGINE_ID, RANGE_CIRCUITS, isRangeError, rangeDemandRows, rangeRun } from '../src/lib/calculations/range-circuit';
import type { RangeRun, RangeRunInput } from '../src/lib/calculations/range-circuit';
import { COMBO, COMBO_KW, EXAMPLE, GOLDEN_COMBO, WIRE_ROWS } from '../src/lib/range-page';
import { FRIGIDAIRE_RANGE, WHIRLPOOL_RANGE, whirlpoolRangeRow } from '../src/lib/verified/mfr-equipment';
import { NEMA_CONFIGS, nemaConfig } from '../src/lib/verified/nema-receptacle-configs';
import { ROUTES } from '../src/lib/routes';
import PAGE_DATES from '../src/data/page-dates.json';

const ROUTE = '/calculators/range-calculator';
const CALC = `calc:${ENGINE_ID}`;
const BASE = { volts: 240 as const, circuitA: 40, material: 'Cu' as const, wiringMethod: 'cable' as const, termination: 'unknown' as const };

function ok(input: RangeRunInput): RangeRun {
  const r = rangeRun(input);
  if (isRangeError(r)) throw new Error(`${r.error} for ${JSON.stringify(input)}`);
  return r;
}

describe('WSZ-010b rangeRun', () => {
  it('takes one range through Column C and Note 1 (golden load-calc-2023 cases)', () => {
    assert.equal(ok({ ...BASE, setup: 'range', kw: 12 }).loadKw, 8);
    assert.equal(ok({ ...BASE, setup: 'range', kw: 14 }).loadKw, 8.8);
    assert.equal(ok({ ...BASE, setup: 'range', kw: 16.6 }).loadKw, 10);
    assert.equal(ok({ ...BASE, setup: 'range', kw: 13.4 }).loadKw, 8.4);
    assert.equal(ok({ ...BASE, setup: 'range', kw: 9 }).loadKw, 8);
  });

  it('adds a cooktop and up to two ovens as one range, and counts one oven or cooktop at its nameplate', () => {
    const golden = ok({ ...BASE, setup: 'combo', cooktopKw: 7, ovensKw: [4, 4] });
    assert.deepEqual([golden.equivalentRangeKw, golden.loadKw], [15, 9.2]);
    const exact = ok({ ...BASE, setup: 'combo', cooktopKw: 7.2, ovensKw: [4.8] });
    assert.deepEqual([exact.equivalentRangeKw, exact.loadKw], [12, 8]);
    assert.equal(ok({ ...BASE, setup: 'single', kw: 5 }).loadKw, 5);
    assert.deepEqual(rangeRun({ ...BASE, setup: 'combo', cooktopKw: 7, ovensKw: [4, 4, 4] }), { error: 'outside-table' });
  });

  it('rejects ratings outside Table 220.55, a missing rating and a circuit it does not offer', () => {
    assert.deepEqual(rangeRun({ ...BASE, setup: 'range', kw: 30 }), { error: 'outside-table' });
    assert.deepEqual(rangeRun({ ...BASE, setup: 'range', kw: 1.5 }), { error: 'outside-table' });
    assert.deepEqual(rangeRun({ ...BASE, setup: 'combo', cooktopKw: 20, ovensKw: [8] }), { error: 'outside-table' });
    assert.deepEqual(rangeRun({ ...BASE, setup: 'single' }), { error: 'rating-invalid' });
    assert.deepEqual(rangeRun({ ...BASE, setup: 'range', kw: 12, circuitA: 42 }), { error: 'circuit-invalid' });
    assert.deepEqual(RANGE_CIRCUITS, [20, 25, 30, 35, 40, 45, 50, 60, 70, 80]);
  });

  it('sizes the wire and ground wire for the circuit and flags a circuit below the load', () => {
    const r = ok({ ...BASE, setup: 'range', kw: 12 });
    assert.deepEqual([r.amps.toFixed(2), r.size, r.ampacity, r.egc, r.circuitCarriesLoad], ['33.33', '8', 40, '10', true]);
    const at208 = ok({ ...BASE, setup: 'range', kw: 12, volts: 208, circuitA: 35 });
    assert.equal(at208.circuitCarriesLoad, false);
    assert.ok(at208.steps.includes('The 35 A circuit entered is below it: the circuit needs a larger rating.'));
    const al75 = ok({ ...BASE, setup: 'range', kw: 12, circuitA: 50, material: 'Al', wiringMethod: 'conductors', termination: '75' });
    assert.deepEqual([al75.size, al75.ampacity, al75.egc, al75.columnC], ['6', 50, '8', 75]);
  });

  it('writes every step with its source', () => {
    const r = ok({ ...BASE, setup: 'range', kw: 14 });
    assert.deepEqual(r.steps, [
      'Table 220.55, Column C with Note 1: 14 kW is 2 kW over 12 kW; each kW, or major fraction of one, adds 5 % to 8 kW: 8.8 kW.',
      '8.8 kW ÷ 240 V = 36.67 A.',
      'The 40 A circuit the instructions give is at least that.',
      'Smallest copper size with a 60 °C ampacity of at least 40 A in NEC Table 310.16: 8 AWG (40 A).',
      'Ground wire for a 40 A circuit, NEC Table 250.122 (copper column): 10 AWG.',
    ]);
    for (const parts of r.stepParts) {
      for (const part of parts) {
        if (typeof part === 'object' && 'v' in part) assert.ok(['input', CALC, 'nec-220-load-calcs'].includes(part.src), part.src);
      }
    }
  });

  it('lists Table 220.55 for one range from 12 kW to 27 kW', () => {
    const rows = rangeDemandRows();
    assert.equal(rows.length, 16);
    assert.deepEqual([rows[0].ratingKw, rows[0].loadKw, rows[15].ratingKw, rows[15].loadKw], [12, 8, 27, 14]);
  });
});

describe('WSZ-010b maker and NEMA data', () => {
  it('reads the Whirlpool range table and the Frigidaire cord', () => {
    assert.deepEqual(WHIRLPOOL_RANGE.rows, [
      { kw240: [8.8, 16.5], kw208: [7.8, 12.5], circuitsA: [40, 50] },
      { kw240: [16.6, 22.5], kw208: [12.6, 18.5], circuitsA: [50] },
    ]);
    assert.deepEqual([WHIRLPOOL_RANGE.receptacle4Wire, WHIRLPOOL_RANGE.receptacle3Wire, WHIRLPOOL_RANGE.directWire], ['14-50R', '10-50R', { cu: '8', al: '6' }]);
    assert.deepEqual(whirlpoolRangeRow(12, 240)?.circuitsA, [40, 50]);
    assert.deepEqual(whirlpoolRangeRow(18, 240)?.circuitsA, [50]);
    assert.equal(whirlpoolRangeRow(8, 240), null);
    assert.deepEqual([FRIGIDAIRE_RANGE.receptacle, FRIGIDAIRE_RANGE.cordA, FRIGIDAIRE_RANGE.minCopper40A], ['14-50R', 40, { hot: '8', neutral: '10', ground: '8' }]);
  });

  it('reads the NEMA configurations', () => {
    assert.equal(NEMA_CONFIGS.length, 10);
    assert.deepEqual(nemaConfig('14-50R'), { config: '14-50R', amps: 50, volts: '125/250', poles: 3, wires: 4, grounding: true });
    assert.equal(nemaConfig('10-50R').grounding, false);
    assert.throws(() => nemaConfig('14-40R'));
  });
});

describe('WSZ-010b the page', () => {
  it('keeps the worked examples the copy states', () => {
    assert.deepEqual([EXAMPLE.loadKw, EXAMPLE.size, EXAMPLE.egc], [8, '8', '10']);
    assert.deepEqual([COMBO_KW.oven, COMBO_KW.cooktop, COMBO.equivalentRangeKw, COMBO.loadKw], [4.8, 7.2, 12, 8]);
    assert.deepEqual([GOLDEN_COMBO.equivalentRangeKw, GOLDEN_COMBO.loadKw], [15, 9.2]);
    assert.deepEqual(
      WIRE_ROWS.map((r) => [r.circuitA, r.cuCable.size, r.cuWarm.size, r.alCable.size, r.alWarm.size, r.egcCu]),
      [
        [30, '10', '10', '8', '8', '10'],
        [40, '8', '8', '6', '8', '10'],
        [50, '6', '8', '4', '6', '10'],
        [60, '4', '6', '3', '4', '10'],
      ],
    );
  });

  it('is back in the route list with its dates and no longer withdrawn', () => {
    const route = ROUTES.find((r) => r.path === ROUTE);
    assert.ok(route);
    assert.equal(route.group, 'load-calcs');
    assert.deepEqual((PAGE_DATES as Record<string, { published: string; modified: string }>)[ROUTE], { published: '2026-11-15', modified: '2026-11-15' });
    const withdrawals = readFileSync(join(process.cwd(), 'research', 'wsz002-withdrawals.csv'), 'utf8');
    assert.ok(!withdrawals.includes(`${ROUTE},`));
    const page = readFileSync(join(process.cwd(), 'src', 'app', 'calculators', 'range-calculator', 'page.tsx'), 'utf8');
    assert.ok(!page.includes('WithdrawnTool'));
  });
});
