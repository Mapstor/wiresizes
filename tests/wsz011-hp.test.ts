// WSZ-011: the horsepower to amps calculator. motorRun reads one cell of NEC Table 430.248, 430.250 (induction) or
// 430.247 by horsepower and voltage column, lists the rest of the row and sets the table current beside the current of
// the rated power alone; every golden motor-flc case runs again through the page's path (the column a system voltage
// takes). Then the page's worked values, and the route back from its WSZ-002 withdrawal.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  DOMAINS,
  columnForTool,
  hpNumber,
  hpRatings,
  hpText,
  isMotorRunError,
  motorRun,
  ratedPowerAmps,
  voltageColumns,
} from '../src/lib/calculations/motor-flc';
import type { MotorRun, ToolPhase } from '../src/lib/calculations/motor-flc';
import { DC_10, EXAMPLE, FIVE_208, FIVE_460, RATIO_ROWS, THREE_1, THREE_500, THREE_HALF } from '../src/lib/hp-page';
import { ROUTES } from '../src/lib/routes';
import PAGE_DATES from '../src/data/page-dates.json';

const ROUTE = '/calculators/horsepower-to-amps-calculator';
const root = process.cwd();
const golden = JSON.parse(readFileSync(join(root, 'research', 'golden-cases.json'), 'utf8')) as {
  cases: { group: string; name: string; inputs: { phase: number | string; hp: string; system_volts?: number; volts?: number }; expected: { column?: string; flc_a: number } }[];
};

function ok(phase: ToolPhase, hp: string, column: string): MotorRun {
  const r = motorRun({ phase, hp, column });
  if (isMotorRunError(r)) throw new Error(`${r.error} for ${phase} ${hp} ${column}`);
  return r;
}

describe('WSZ-011 motorRun', () => {
  it('reproduces every golden motor-flc case through the page path (two-phase is not offered)', () => {
    const cases = golden.cases.filter((c) => c.group === 'motor-flc');
    const twoPhase = cases.filter((c) => c.inputs.phase === 2);
    assert.equal(twoPhase.length, 1);
    let run = 0;
    for (const c of cases.filter((x) => x.inputs.phase !== 2)) {
      const phase = String(c.inputs.phase) as ToolPhase;
      const column = columnForTool(phase, (c.inputs.system_volts ?? c.inputs.volts) as number);
      assert.ok(column, c.name);
      if (c.expected.column) assert.equal(column, c.expected.column, c.name);
      assert.equal(ok(phase, c.inputs.hp, column).flcA, c.expected.flc_a, c.name);
      run += 1;
    }
    assert.equal(run, 15);
  });

  it('declares the sources of its comparison current', () => {
    assert.deepEqual(DOMAINS, ['nec-430-flc', 'nist-sp811-conversions', 'doe-motor-load-efficiency']);
  });

  it('reads the printed horsepower and the columns the table notes give', () => {
    assert.deepEqual([hpNumber('7-1/2'), hpNumber('10'), hpNumber('1/2')], [7.5, 10, 0.5]);
    assert.ok(Math.abs(hpNumber('1/6') - 1 / 6) < 1e-12);
    assert.throws(() => hpNumber('2.5'), /not a horsepower/);
    assert.equal(hpText('1-1/2'), '1 1/2');
    assert.deepEqual(hpRatings('1'), ['1/6', '1/4', '1/3', '1/2', '3/4', '1', '1-1/2', '2', '3', '5', '7-1/2', '10']);
    assert.equal(hpRatings('3').length, 27);
    assert.equal(hpRatings('dc').length, 23);
    assert.deepEqual(
      voltageColumns('1').map((c) => [c.column, c.min, c.max]),
      [
        ['115', 110, 120],
        ['200', 200, 200],
        ['208', 208, 208],
        ['230', 220, 240],
      ],
    );
    assert.deepEqual(voltageColumns('3').map((c) => c.column), ['115', '200', '208', '230', '460', '575', '2300']);
    assert.deepEqual(voltageColumns('dc').map((c) => c.column), ['90', '120', '180', '240', '500', '550']);
    assert.equal(columnForTool('1', 240), '230');
    assert.equal(columnForTool('dc', 230), null);
  });

  it('sets the table current beside the current of the rated power alone', () => {
    assert.ok(Math.abs(ratedPowerAmps(1, 230, '1') - 746 / 230) < 1e-12);
    assert.ok(Math.abs(ratedPowerAmps(5, 460, '3') - 3730 / (Math.sqrt(3) * 460)) < 1e-12);
    const r = ok('1', '1', '230');
    assert.deepEqual([r.table, r.flcA, r.watts, r.status], ['430.248', 8, 746, 'verified-sd2023']);
    assert.equal(r.ratio?.toFixed(2), '2.47');
    assert.deepEqual(
      r.others.map((o) => [o.column.column, o.flcA]),
      [
        ['115', 16],
        ['200', 9.2],
        ['208', 8.8],
      ],
    );
    assert.deepEqual(r.steps, [
      'Table 430.248 lists single-phase AC motors by horsepower and rated voltage; a 220–240 V system takes the 230 V column.',
      'The 1 hp row of the 230 V column: 8 A.',
      '1 hp × 746 W per horsepower = 746 W.',
      'At 100 % efficiency and power factor 1, that power at 230 V would draw 746 W ÷ 230 V = 3.24 A; the table current is 2.47 times that.',
    ]);
  });

  it('says so where the table prints no current, and rejects what it does not offer', () => {
    const r = ok('3', '3', '115');
    assert.equal(r.flcA, null);
    assert.equal(r.ratio, null);
    assert.equal(r.others.length, 5);
    assert.equal(r.steps[1], 'The 3 hp row prints no current in the 115 V column.');
    assert.deepEqual(motorRun({ phase: '1', hp: '15', column: '230' }), { error: 'hp-invalid' });
    assert.deepEqual(motorRun({ phase: '1', hp: '1', column: '460' }), { error: 'column-invalid' });
    assert.deepEqual(motorRun({ phase: '2' as ToolPhase, hp: '1', column: '230' }), { error: 'phase-invalid' });
  });

  it('writes the three-phase and DC steps with their own divisors', () => {
    assert.equal(ok('3', '5', '460').steps[3], 'At 100 % efficiency and power factor 1, that power at 460 V would draw 3,730 W ÷ (√3 × 460 V) = 4.68 A; the table current is 1.62 times that.');
    assert.equal(ok('dc', '10', '240').steps[0], 'Table 430.247 lists DC motors by horsepower and rated voltage: the 240 V column.');
    assert.equal(ok('dc', '10', '240').steps[3], 'At 100 % efficiency, that power at 240 V would draw 7,460 W ÷ 240 V = 31.08 A; the table current is 1.22 times that.');
    assert.equal(ok('3', '5', '208').steps[0], 'Table 430.250 lists three-phase AC motors by horsepower and rated voltage; 208 V has a column of its own.');
  });
});

describe('WSZ-011 the page', () => {
  it('keeps the worked values the copy states', () => {
    assert.deepEqual([EXAMPLE.flcA, FIVE_460.flcA, FIVE_208.flcA, DC_10.flcA], [8, 7.6, 16.7, 38]);
    assert.deepEqual([THREE_HALF.ratio?.toFixed(2), THREE_1.ratio?.toFixed(2), THREE_500.ratio?.toFixed(2)], ['2.35', '2.24', '1.26']);
    assert.equal(RATIO_ROWS.length, 12);
    assert.deepEqual([RATIO_ROWS[0].ratio.toFixed(2), RATIO_ROWS[11].ratio.toFixed(2)], ['4.07', '1.54']);
  });

  it('is back in the route list with its dates, and the old component is gone', () => {
    const route = ROUTES.find((r) => r.path === ROUTE);
    assert.ok(route);
    assert.equal(route.group, 'conversions');
    assert.deepEqual((PAGE_DATES as Record<string, { published: string; modified: string }>)[ROUTE], { published: '2026-11-15', modified: '2026-11-15' });
    const withdrawals = readFileSync(join(root, 'research', 'wsz002-withdrawals.csv'), 'utf8');
    assert.ok(!withdrawals.includes(`${ROUTE},`));
    const page = readFileSync(join(root, 'src', 'app', 'calculators', 'horsepower-to-amps-calculator', 'page.tsx'), 'utf8');
    assert.ok(!page.includes('WithdrawnTool'));
    assert.ok(!existsSync(join(root, 'src', 'components', 'calculators', 'HorsepowerToAmpsCalculator.tsx')));
  });
});
