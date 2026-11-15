// WSZ-010a: the residential load calculator. The engine's dwellingLoadRun (both methods of NEC 2023 Article 220 from
// one set of inputs, the steps, the Table 310.12 service), the EV charger in the standard method, the heat pump and
// electric-heat selections of 220.82(C), the number-list parser of the appliance field, the page's examples, and the
// route coming back from its WSZ-002 withdrawal.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  DWELLING_VOLTS,
  ENGINE_ID,
  RANGE_MAX_KW,
  RANGE_OVER_KW,
  dwellingLoadRun,
  isDwellingError,
  note1Steps,
  rangeDemandKw,
  standardDwellingLoad,
} from '../src/lib/calculations/load-calc-2023';
import type { DwellingRun, DwellingRunInput } from '../src/lib/calculations/load-calc-2023';
import { parseNumberList } from '../src/lib/calculations/fields';
import { EXAMPLE, EXAMPLE_CONNECTED_A, EXAMPLE_CONNECTED_VA, EXAMPLE_INPUT, GAS_HEAT, SMALL_UNIT, WITH_EV, WITH_HEAT_PUMP } from '../src/lib/residential-load-page';
import { OPTIONAL_METHOD, STANDARD_METHOD } from '../src/lib/verified/nec-220-2023';
import { TABLE_310_12_ROWS } from '../src/lib/verified/nec-310-12';
import { ROUTES } from '../src/lib/routes';
import PAGE_DATES from '../src/data/page-dates.json';

const ROUTE = '/calculators/residential-load-calculator';
const CALC = `calc:${ENGINE_ID}`;

function ok(input: DwellingRunInput): DwellingRun {
  const r = dwellingLoadRun(input);
  if (isDwellingError(r)) throw new Error(`${r.error} for ${JSON.stringify(input)}`);
  return r;
}

describe('WSZ-010a dwellingLoadRun', () => {
  it('gives the golden house by both methods (load-calc-2023 and load-calc-2023-standard)', () => {
    const r = ok(EXAMPLE_INPUT);
    assert.equal(r.standard.totalVa, 34625);
    assert.ok(Math.abs(r.standard.amps - 144.271) < 0.001);
    assert.deepEqual(r.standard.serviceRow, { ratingA: 150, cu: '1', alCca: '2/0' });
    assert.equal(r.standard.detail.generalLightingVa, 10500);
    assert.equal(r.standard.detail.lightingAfterDemandVa, 5625);
    assert.equal(r.standard.detail.appliancesVa, 6000);
    assert.equal(r.standard.detail.rangeVa, 8000);
    assert.equal(r.standard.detail.heatOrAcVa, 10000);
    assert.equal(r.optional.detail.generalLoadVa, 35500);
    assert.equal(r.optional.detail.generalAfterDemandVa, 20200);
    assert.equal(r.optional.detail.heatingAcItem, '(C)(4)');
    assert.equal(r.optional.totalVa, 26700);
    assert.equal(r.optional.amps, 111.25);
    assert.deepEqual(r.optional.serviceRow, { ratingA: 125, cu: '2', alCca: '1/0' });
  });

  it('writes every step, ending with the current and the service', () => {
    const r = ok(EXAMPLE_INPUT);
    assert.deepEqual(r.standard.steps, [
      'General lighting, 220.41: 2,000 ft² at 3 VA per ft² = 6,000 VA.',
      'Small-appliance and laundry circuits, 220.52: 3 × 1,500 VA = 4,500 VA, counted with the lighting: 10,500 VA.',
      'Table 220.45 takes the first 3,000 VA at 100 % and the remaining 7,500 VA at 35 %: 5,625 VA.',
      'Appliances fastened in place, 220.53: with 4 of them (the rule needs 4 or more), 8,000 VA × 75 % = 6,000 VA.',
      'Dryer, 220.54: the larger of 5,000 W and its 5,000 W nameplate: 5,000 VA.',
      'Range, Table 220.55, Column C: one range of 12 kW or less counts as 8 kW: 8,000 VA.',
      'Heating and cooling: electric heat at 100 % (220.51), 10,000 VA; air conditioning at 125 % (220.60, as this calculator reads it), 6,250 VA. The two do not run at once, so only the larger counts: 10,000 VA.',
      'Total: 34,625 VA ÷ 240 V = 144.27 A.',
      'The smallest service rating in Table 310.12 at or above it: 150 A, with 1 AWG copper or 2/0 AWG aluminum or copper-clad aluminum.',
    ]);
    assert.deepEqual(r.optional.steps, [
      'General load, 220.82(B): 2,000 ft² at 3 VA per ft², 6,000 VA; 3 small-appliance and laundry circuits at 1,500 VA, 4,500 VA; the nameplates of the range, dryer, water heater and 3 other appliances, 25,000 VA. Together: 35,500 VA.',
      '220.82(B) takes the first 10,000 VA at 100 % and the remaining 25,500 VA at 40 %: 20,200 VA.',
      'Heating and cooling, 220.82(C): (C)(1), air conditioning at 100 %, gives 5,000 VA; (C)(4), electric heat in fewer than 4 separately controlled units at 65 %, gives 6,500 VA. Only the largest counts: 6,500 VA.',
      'Total: 26,700 VA ÷ 240 V = 111.25 A.',
      'The smallest service rating in Table 310.12 at or above it: 125 A, with 2 AWG copper or 1/0 AWG aluminum or copper-clad aluminum.',
    ]);
    // every value in a step names its source
    for (const parts of [...r.standard.stepParts, ...r.optional.stepParts]) {
      for (const part of parts) {
        if (typeof part === 'object' && 'v' in part) assert.ok(['input', CALC, 'nec-220-load-calcs', 'nec-310-12'].includes(part.src), part.src);
      }
    }
  });

  it('counts an EV charger at 220.57 in the standard method and at nameplate in the optional general load', () => {
    const base = standardDwellingLoad({
      ft2: 1000,
      smallApplianceCircuits: 2,
      laundryCircuits: 1,
      fastenedAppliancesW: [],
      dryerW: null,
      rangeKw: null,
      spaceHeatW: 0,
      acVa: 0,
      volts: 240,
    });
    assert.ok(base);
    assert.equal(base.evseVa, 0);
    const small = ok({ ...EXAMPLE_INPUT, evW: 3800 });
    assert.equal(small.standard.detail.evseVa, STANDARD_METHOD.evseMinW);
    assert.equal(small.standard.totalVa, EXAMPLE.standard.totalVa + STANDARD_METHOD.evseMinW);
    assert.equal(small.optional.detail.generalLoadVa, EXAMPLE.optional.detail.generalLoadVa + 3800);
    assert.equal(WITH_EV.standard.totalVa, 44225);
    assert.equal(WITH_EV.optional.totalVa, 30540);
    assert.ok(WITH_EV.standard.steps.includes('EV charger, 220.57: the larger of 7,200 W and its 9,600 W nameplate: 9,600 VA.'));
  });

  it('counts a heat pump by (C)(2) or (C)(3), and in the standard method as heating with its backup and as cooling alone', () => {
    const alone = ok({ ...EXAMPLE_INPUT, heating: 'heat-pump', heatPumpVa: 6000, heatW: 0, acVa: 0 });
    assert.equal(alone.optional.detail.heatingAcItem, '(C)(2)');
    assert.equal(alone.optional.detail.heatingAcVa, 6000);
    assert.equal(alone.standard.detail.heatVa, 6000);
    assert.equal(alone.standard.detail.coolingVa, 7500);
    assert.equal(alone.standard.detail.heatOrAcVa, 7500);
    assert.equal(WITH_HEAT_PUMP.optional.detail.heatingAcItem, '(C)(3)');
    assert.equal(WITH_HEAT_PUMP.optional.detail.heatingAcVa, 6000 + 6500);
    assert.equal(WITH_HEAT_PUMP.standard.detail.heatOrAcVa, 16000);
    assert.deepEqual([WITH_HEAT_PUMP.standard.serviceRow?.ratingA, WITH_HEAT_PUMP.optional.serviceRow?.ratingA], [175, 150]);
  });

  it('takes 220.82(C)(5) for four or more separately controlled heating units', () => {
    const four = ok({ ...EXAMPLE_INPUT, heatUnits: OPTIONAL_METHOD.spaceHeatUnitsLimit, acVa: 0 });
    assert.equal(four.optional.detail.heatingAcItem, '(C)(5)');
    assert.equal(four.optional.detail.heatingAcVa, 4000);
    assert.equal(four.standard.detail.heatOrAcVa, 10000);
  });

  it('applies Table 220.55 Note 1 above 12 kW and counts fewer than four appliances at full rating', () => {
    assert.deepEqual([note1Steps(12), note1Steps(13.4), note1Steps(13.6), note1Steps(16.6)], [0, 1, 2, 5]);
    assert.equal(rangeDemandKw(1, 16.6), 10);
    const r = ok({ ...EXAMPLE_INPUT, rangeKw: 13.4, otherAppliancesW: [1500] });
    assert.equal(r.standard.detail.rangeVa, 8400);
    assert.equal(r.standard.detail.appliancesVa, 6000);
    assert.ok(r.standard.steps.some((s) => s.startsWith('Range, Table 220.55, Column C with Note 1: 13.4 kW is 1.4 kW over 12 kW, which counts as 1 kW;')));
    assert.ok(r.standard.steps.some((s) => s.startsWith('Appliances fastened in place: with 2 of them (220.53 needs 4 or more)')));
    assert.deepEqual([RANGE_OVER_KW, RANGE_MAX_KW], [1.75, 27]);
  });

  it('starts the service at Table 310.12’s first row and gives none above its last', () => {
    assert.equal(SMALL_UNIT.standard.serviceRow?.ratingA, TABLE_310_12_ROWS[0].ratingA);
    assert.ok(SMALL_UNIT.standard.steps.at(-1)?.startsWith('Table 310.12 starts at 100 A'));
    const huge = ok({ ...EXAMPLE_INPUT, ft2: 40000, heatW: 60000 });
    assert.equal(huge.standard.serviceRow, null);
    assert.ok(huge.standard.steps.at(-1)?.startsWith('That is over 400 A'));
    assert.equal(DWELLING_VOLTS, 240);
  });

  it('reads 220.53’s thresholds and 220.82(A)’s 100 A from the data file', () => {
    assert.equal(STANDARD_METHOD.applianceMinW, 500);
    assert.equal(STANDARD_METHOD.applianceMinHp, '1/4');
    assert.equal(OPTIONAL_METHOD.minAmpacityA, 100);
  });
});

describe('WSZ-010a the appliance list', () => {
  it('parses commas, spaces and thousands separators', () => {
    assert.deepEqual(parseNumberList('1500, 1500, 500'), [1500, 1500, 500]);
    assert.deepEqual(parseNumberList('1500,1500,500'), [1500, 1500, 500]);
    assert.deepEqual(parseNumberList(' 1500 1500  500 '), [1500, 1500, 500]);
    assert.deepEqual(parseNumberList('1,500, 1,200.5; 500'), [1500, 1200.5, 500]);
    assert.deepEqual(parseNumberList(''), []);
    assert.ok(parseNumberList('1500, abc').some((n) => Number.isNaN(n)));
  });
});

describe('WSZ-010a the page', () => {
  it('keeps the worked examples the copy states', () => {
    assert.equal(EXAMPLE_CONNECTED_VA, 50500);
    assert.ok(Math.abs(EXAMPLE_CONNECTED_A - 210.417) < 0.001);
    assert.deepEqual([GAS_HEAT.standard.totalVa, GAS_HEAT.standard.serviceRow?.ratingA, GAS_HEAT.optional.totalVa, GAS_HEAT.optional.serviceRow?.ratingA], [30875, 150, 25200, 110]);
    assert.deepEqual([WITH_EV.standard.serviceRow?.ratingA, WITH_EV.optional.serviceRow?.ratingA], [200, 150]);
    assert.ok(SMALL_UNIT.standard.totalVa < SMALL_UNIT.optional.totalVa);
  });

  it('is back in the route list with its dates and no longer withdrawn', () => {
    const route = ROUTES.find((r) => r.path === ROUTE);
    assert.ok(route);
    assert.equal(route.group, 'load-calcs');
    assert.deepEqual((PAGE_DATES as Record<string, { published: string; modified: string }>)[ROUTE], { published: '2026-11-15', modified: '2026-11-15' });
    const withdrawals = readFileSync(join(process.cwd(), 'research', 'wsz002-withdrawals.csv'), 'utf8');
    assert.ok(!withdrawals.includes(`${ROUTE},`));
    const page = readFileSync(join(process.cwd(), 'src', 'app', 'calculators', 'residential-load-calculator', 'page.tsx'), 'utf8');
    assert.ok(!page.includes('WithdrawnTool'));
  });
});
