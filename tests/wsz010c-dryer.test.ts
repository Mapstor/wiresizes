// WSZ-010c: the dryer calculator. The engine's dryerRun (220.54 and Table 220.54 for the feeder or service, kept apart
// from the dryer's own circuit and its wire), the dryer maker accessors, the page's examples, and the route coming back
// from its WSZ-002 withdrawal.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DRYER_CIRCUITS, ENGINE_ID, dryerRun, dryerTableRows, isDryerError } from '../src/lib/calculations/dryer-circuit';
import type { DryerRun, DryerRunInput } from '../src/lib/calculations/dryer-circuit';
import { EXAMPLE, FIVE, SMALL, WIRE_30 } from '../src/lib/dryer-page';
import { GE_DBLR333EE, GE_DRYER, WHIRLPOOL_DRYER } from '../src/lib/verified/mfr-equipment';
import { ROUTES } from '../src/lib/routes';
import PAGE_DATES from '../src/data/page-dates.json';

const ROUTE = '/calculators/dryer-calculator';
const CALC = `calc:${ENGINE_ID}`;
const BASE = { dryers: 1, volts: 240 as const, circuitA: 30, material: 'Cu' as const, wiringMethod: 'cable' as const, termination: 'unknown' as const };

function ok(input: DryerRunInput): DryerRun {
  const r = dryerRun(input);
  if (isDryerError(r)) throw new Error(`${r.error} for ${JSON.stringify(input)}`);
  return r;
}

describe('WSZ-010c dryerRun', () => {
  it('counts each dryer at the larger of 5000 W and its nameplate (golden load-calc-2023 cases)', () => {
    assert.equal(ok({ ...BASE, nameplateW: 4500 }).perDryerW, 5000);
    assert.equal(ok({ ...BASE, nameplateW: 5600 }).perDryerW, 5600);
  });

  it('applies Table 220.54 for several dryers (golden: five at 85 %)', () => {
    assert.equal(ok({ ...BASE, nameplateW: 5000, dryers: 5 }).demandPct, 85);
    assert.equal(ok({ ...BASE, nameplateW: 5000, dryers: 4 }).demandPct, 100);
    assert.equal(ok({ ...BASE, nameplateW: 5000, dryers: 12 }).demandPct, 46);
    assert.equal(ok({ ...BASE, nameplateW: 5000, dryers: 30 }).demandPct, 31.5);
    assert.equal(ok({ ...BASE, nameplateW: 5000, dryers: 50 }).demandPct, 25);
    const r = ok({ ...BASE, nameplateW: 5000, dryers: 5 });
    assert.deepEqual([r.feederW, r.feederAmps.toFixed(2)], [21250, '88.54']);
  });

  it('sizes the wire and ground wire for the circuit the instructions give', () => {
    const r = ok({ ...BASE, nameplateW: 5600 });
    assert.deepEqual([r.size, r.ampacity, r.egc, r.columnC], ['10', 30, '10', 60]);
    const al = ok({ ...BASE, nameplateW: 5600, material: 'Al' });
    assert.deepEqual([al.size, al.egc], ['8', '8']);
    assert.deepEqual(DRYER_CIRCUITS, [20, 25, 30, 35, 40, 45, 50]);
  });

  it('rejects a missing nameplate, a bad count and a circuit it does not offer', () => {
    assert.deepEqual(dryerRun({ ...BASE, nameplateW: 0 }), { error: 'nameplate-invalid' });
    assert.deepEqual(dryerRun({ ...BASE, nameplateW: 5000, dryers: 0 }), { error: 'dryers-invalid' });
    assert.deepEqual(dryerRun({ ...BASE, nameplateW: 5000, dryers: 2.5 }), { error: 'dryers-invalid' });
    assert.deepEqual(dryerRun({ ...BASE, nameplateW: 5000, circuitA: 60 }), { error: 'circuit-invalid' });
  });

  it('writes every step with its source', () => {
    const r = ok({ ...BASE, nameplateW: 5600 });
    assert.deepEqual(r.steps, [
      '220.54: each dryer counts at the larger of 5,000 W and its 5,600 W nameplate: 5,600 W.',
      'Table 220.54 keeps one dryer at 100 %: 5,600 W.',
      'On the feeder or service: 5,600 W ÷ 240 V = 23.33 A.',
      'Each dryer has its own circuit, rated as its instructions give: 30 A. Smallest copper size with a 60 °C ampacity of at least 30 A in NEC Table 310.16: 10 AWG (30 A).',
      'NEC 240.4(D) limits 10 AWG copper to 30 A overcurrent protection; 30 A is within that limit.',
      'Ground wire for a 30 A circuit, NEC Table 250.122 (copper column): 10 AWG.',
    ]);
    for (const parts of r.stepParts) {
      for (const part of parts) {
        if (typeof part === 'object' && 'v' in part) assert.ok(['input', CALC, 'nec-220-load-calcs'].includes(part.src), part.src);
      }
    }
  });

  it('reads Table 220.54 band by band', () => {
    const rows = dryerTableRows();
    assert.equal(rows.length, 11);
    assert.deepEqual(rows[8], { from: 12, to: 23, pct: 47, lessPct: 1, over: 11 });
    assert.deepEqual(rows[10], { from: 43, to: null, pct: 25, lessPct: 0, over: 0 });
  });
});

describe('WSZ-010c maker data and the page', () => {
  it('reads the Whirlpool and GE dryer documents', () => {
    assert.deepEqual([WHIRLPOOL_DRYER.circuitA, WHIRLPOOL_DRYER.directWireCu, WHIRLPOOL_DRYER.cord.size, WHIRLPOOL_DRYER.cord.amps], [30, '10', '10', 30]);
    assert.deepEqual(WHIRLPOOL_DRYER.receptacles, [
      { config: '14-30R', wires: 4 },
      { config: '10-30R', wires: 3 },
    ]);
    assert.deepEqual([GE_DRYER.circuitA, GE_DRYER.minCopper], [30, '10']);
    assert.deepEqual([GE_DBLR333EE.breakerA, GE_DBLR333EE.at240, GE_DBLR333EE.at208], [30, { w: 5600, a: 24 }, { w: 4400, a: 22 }]);
  });

  it('keeps the worked examples the copy states', () => {
    assert.deepEqual([EXAMPLE.perDryerW, SMALL.perDryerW, FIVE.demandPct, FIVE.feederW], [5600, 5000, 85, 21250]);
    assert.deepEqual(WIRE_30, { cuCable: '10', cuWarm: '10', alCable: '8', alWarm: '8', egcCu: '10', egcAl: '8' });
  });

  it('is back in the route list with its dates and no longer withdrawn', () => {
    const route = ROUTES.find((r) => r.path === ROUTE);
    assert.ok(route);
    assert.equal(route.group, 'load-calcs');
    assert.deepEqual((PAGE_DATES as Record<string, { published: string; modified: string }>)[ROUTE], { published: '2026-11-15', modified: '2026-11-15' });
    const withdrawals = readFileSync(join(process.cwd(), 'research', 'wsz002-withdrawals.csv'), 'utf8');
    assert.ok(!withdrawals.includes(`${ROUTE},`));
    const page = readFileSync(join(process.cwd(), 'src', 'app', 'calculators', 'dryer-calculator', 'page.tsx'), 'utf8');
    assert.ok(!page.includes('WithdrawnTool'));
  });
});
