// WSZ-011c (with WSZ-034's sourcing): the well pump calculator, back from its WSZ-002 withdrawal on Franklin Electric's
// AIM Manual (2026 edition) for its 4-inch single-phase motors: the cable table (5 % drop, × 0.6 for 3 %, shaded cells
// for single conductors only), aluminum two sizes larger, the fuse and breaker table and the motors' amps. No NEC
// Article 430 rule; the page cites one source, and /methodology, the registry and the page map agree.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { ROUTES } from '../src/lib/routes';
import { DOMAINS, ENGINE_ID, WP_MOTORS, aluminumFor, wellPump } from '../src/lib/calculations/well-pump';
import { CABLE_ROWS, CABLE_RULES, CABLE_SIZES, FUSE_ROWS, MOTOR_ROWS, cableRow, fuseRow, motorRow } from '../src/lib/verified/mfr-well-pump';
import { COMBO, FAQ_2HP, LEAD } from '../src/lib/well-pump-page';

const ROUTE = '/calculators/well-pump-calculator';
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
const code = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const run = (input: Parameters<typeof wellPump>[0]) => {
  const r = wellPump(input);
  assert.ok(!('error' in r), JSON.stringify(input));
  return r as Exclude<ReturnType<typeof wellPump>, { error: string }>;
};

describe('WSZ-011c the data', () => {
  it("Franklin's single-phase cable table: 8 rows, 14 AWG to 4/0, as printed", () => {
    assert.equal(CABLE_ROWS.length, 8);
    assert.deepEqual(CABLE_SIZES, ['14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0']);
    assert.deepEqual(cableRow(115, '1/2')?.ft, [100, 160, 250, 390, 620, 960, 1190, 1460, 1780, 2160, 2630, 3140, 3770]);
    assert.deepEqual(cableRow(230, '1')?.ft, [250, 400, 630, 990, 1540, 2380, 2960, 3610, 4410, 5360, 6520, 7780, 9350]);
    assert.deepEqual(cableRow(230, '1/2')?.ft.slice(9), [8720, null, null, null]);
    assert.deepEqual(cableRow(230, '5')?.ft.slice(0, 3), [0, 110, 180]);
    const shaded = CABLE_ROWS.flatMap((r) => r.shaded.map((s) => `${r.volts} V ${r.hp} hp ${s}`));
    assert.deepEqual(shaded, ['230 V 3 hp 14', '230 V 5 hp 12']);
  });

  it('the rules, the fuse table and the motor amps', () => {
    assert.equal(CABLE_RULES.dropPct, 5);
    assert.equal(CABLE_RULES.threePctFactor, 0.6);
    assert.equal(CABLE_RULES.contactorBoxMaxSharePct, 25);
    assert.equal(FUSE_ROWS.length, 13);
    assert.equal(MOTOR_ROWS.length, 13);
    assert.deepEqual(fuseRow(2, 115, '1/2'), {
      wires: 2, model: '244504', hp: '1/2', kw: 0.37, volts: 115,
      max_nec: { fuse: 35, dual_element_fuse: 20, breaker: 30 },
      typical: { fuse: 30, dual_element_fuse: 15, breaker: 30 },
    });
    assert.deepEqual(fuseRow(3, 230, '5')?.max_nec, { fuse: 80, dual_element_fuse: 45, breaker: 60 });
    assert.deepEqual([motorRow(3, 230, '5')?.fl_amps, motorRow(3, 230, '5')?.max_amps], [23, 27.5]);
    assert.deepEqual([motorRow(2, 230, '1.5')?.fl_amps, motorRow(2, 230, '1.5')?.max_amps], [10.6, 13.1]);
    assert.equal(WP_MOTORS.length, 13);
  });
});

describe('WSZ-011c the engine', () => {
  it('picks the smallest copper size that reaches the run, with its share, aluminum, breaker and amps', () => {
    const r = run({ volts: 230, wires: 2, hp: '1', lengthFt: 300, dropPct: 5, cable: 'jacketed' });
    assert.equal(r.copper, '12');
    assert.equal(r.copperMaxFt, 400);
    assert.equal(r.sharePct, 75);
    assert.deepEqual(r.smaller, { size: '14', maxFt: 250, shaded: false });
    assert.equal(r.aluminum, '10');
    assert.equal(r.fuses.max_nec.breaker, 25);
    assert.deepEqual([r.motor.fl_amps, r.motor.max_amps], [8.2, 10.4]);
    assert.deepEqual([LEAD.copper, LEAD.copperMaxFt], ['12', 400]);
  });

  it('jacketed cable skips the shaded cells; single conductors may use them; "0" is never used', () => {
    assert.equal(run({ volts: 230, wires: 3, hp: '3', lengthFt: 100, dropPct: 5, cable: 'jacketed' }).copper, '12');
    assert.equal(run({ volts: 230, wires: 3, hp: '3', lengthFt: 100, dropPct: 5, cable: 'conductors' }).copper, '14');
    const five = run({ volts: 230, wires: 3, hp: '5', lengthFt: 100, dropPct: 5, cable: 'jacketed' });
    assert.deepEqual([five.copper, five.skippedShaded], ['10', '12']);
    assert.equal(run({ volts: 230, wires: 3, hp: '5', lengthFt: 50, dropPct: 5, cable: 'conductors' }).copper, '12');
  });

  it('3 % is 0.6 times the 5 % length; aluminum is two gauges larger and stops at 4/0', () => {
    const r = run({ volts: 230, wires: 2, hp: '1', lengthFt: 400, dropPct: 3, cable: 'jacketed' });
    assert.deepEqual([r.copper, Math.round(r.copperMaxFt)], ['8', 594]);
    assert.deepEqual(['14', '12', '4', '2', '1', '1/0', '2/0', '3/0'].map(aluminumFor), ['12', '10', '2', '1/0', '2/0', '3/0', '4/0', null]);
    assert.deepEqual([FAQ_2HP.copper, FAQ_2HP.copperMaxFt], ['10', 390]);
  });

  it("Franklin's own two-size example: 10 AWG then 8 AWG is too much, 10 AWG then 6 AWG passes", () => {
    assert.ok(Math.abs(COMBO.shareFirst - 160 / 300) < 1e-12 && COMBO.sumA > 1 && COMBO.sumB < 1);
    assert.equal(Math.round(COMBO.sumB * 1000) / 1000, 0.947);
  });

  it('refuses motors Franklin does not list and lengths past the table', () => {
    assert.ok('error' in wellPump({ volts: 230, wires: 2, hp: '2', lengthFt: 100, dropPct: 5, cable: 'jacketed' }));
    assert.ok('error' in wellPump({ volts: 115, wires: 2, hp: '1', lengthFt: 100, dropPct: 5, cable: 'jacketed' }));
    assert.ok('error' in wellPump({ volts: 230, wires: 2, hp: '1', lengthFt: 0, dropPct: 5, cable: 'jacketed' }));
    assert.match((wellPump({ volts: 115, wires: 2, hp: '1/2', lengthFt: 5000, dropPct: 5, cable: 'jacketed' }) as { error: string }).error, /3,770 ft/);
  });
});

describe('WSZ-011c sources and listings', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];
  const page = code('../src/app/calculators/well-pump-calculator/page.tsx');

  it('one source: Franklin, verified, on /methodology, the registry and the page map; no Article 430 rule', () => {
    assert.equal(ENGINE_ID, 'well-pump');
    assert.deepEqual(DOMAINS, ['mfr-well-pump']);
    assert.deepEqual(METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(ROUTE)).map((s) => s.domain), ['mfr-well-pump']);
    const row = registry.find((r) => r.domain === 'mfr-well-pump');
    assert.ok(row && row.status === 'verified' && row.pages_served === ROUTE && row.url.includes('#page=52'));
    assert.ok(!registry.some((r) => r.domain !== 'mfr-well-pump' && r.pages_served.split(';').includes(ROUTE)));
    assert.equal(pageMap.find((r) => r.slug === ROUTE)?.data_sources_all, 'mfr-well-pump');
    assert.ok(!/430\.\d/.test(page));
  });

  it('no withdrawal; joins the gates, the route list and the footer', () => {
    assert.ok(!page.includes('WithdrawnTool'));
    assert.ok(!read('../research/wsz002-withdrawals.csv').includes(ROUTE));
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE) && gates.necRefs.enforce.includes(ROUTE));
    const r = ROUTES.find((x) => x.path === ROUTE);
    assert.ok(r && r.name === 'Well Pump Wire Size Calculator' && r.group === 'wire-sizing' && !/\d/.test(r.line));
    assert.match(read('../src/components/layout/Footer.tsx'), /well-pump-calculator/);
  });
});
