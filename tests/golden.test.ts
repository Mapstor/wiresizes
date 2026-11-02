// WSZ-003a: every case of research/golden-cases.json through the engine or src/lib/verified accessor that computes it,
// each case once (the WSZ-002 loops moved here from tests/wsz002-calculators.test.ts with their assertions). Tolerance:
// a key with its own tolerance is compared within it; "exact" (the whole case) or "other": "exact" (the keys without
// their own) means equality; a number with neither is compared at the decimals it is written with (pf_from 0.7042).
// The run fails if a group has no runner, and the last test checks that the cases run equal the file's count.
// Also: every engine's ENGINE_ID is its file name and unique, and its DOMAINS are verified rows of
// research/data-sources.csv.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import golden from '../research/golden-cases.json';
import { parseCsv } from '../scripts/lib/build-output.mjs';
import { areaCmil, awgRow, sizeKeyFromAwgName } from '../src/lib/verified/awg';
import type { Material, SizeKey } from '../src/lib/verified/awg';
import { TABLE_310_16_SIZES } from '../src/lib/verified/nec-310-16';
import type { AmpacityColumn } from '../src/lib/verified/nec-310-16';
import { correction } from '../src/lib/verified/nec-310-15-B-1-1';
import type { CorrectionColumn } from '../src/lib/verified/nec-310-15-B-1-1';
import { max240_4D } from '../src/lib/verified/nec-240-4-d';
import { egcRow } from '../src/lib/verified/nec-250-122';
import { gec } from '../src/lib/verified/nec-250-66';
import { table31012 } from '../src/lib/verified/nec-310-12';
import type { Phase } from '../src/lib/calculations/inputs';
import * as ampacity from '../src/lib/calculations/ampacity';
import * as awgGeometry from '../src/lib/calculations/awg-geometry';
import * as breakerSizing from '../src/lib/calculations/breaker-sizing';
import * as conductorSizing from '../src/lib/calculations/conductor-sizing';
import * as conversions from '../src/lib/calculations/conversions';
import * as dcSizing from '../src/lib/calculations/dc-sizing';
import * as grounding from '../src/lib/calculations/grounding';
import * as loadCalc from '../src/lib/calculations/load-calc-2023';
import * as motorFlc from '../src/lib/calculations/motor-flc';
import * as ohmsLaw from '../src/lib/calculations/ohms-law';
import * as power from '../src/lib/calculations/power';
import * as resistance from '../src/lib/calculations/resistance';
import * as serviceLookup from '../src/lib/calculations/service-lookup';
import * as voltageDrop from '../src/lib/calculations/voltage-drop';
import type { HorsepowerKind } from '../src/lib/calculations/conversions';
import type { PowerFailure, PowerResult } from '../src/lib/calculations/power';
import type { SizeConductorError, SizeConductorResult } from '../src/lib/calculations/conductor-sizing';

interface GoldenCase {
  group: string;
  name: string;
  inputs: Record<string, unknown>;
  expected: Record<string, unknown>;
  tolerance: Record<string, unknown>;
}

const FILE = golden as unknown as { count: number; cases: GoldenCase[] };
const CASES = FILE.cases;
const { isSizingError, sizeConductor, WIRE_SIZE_DEFAULTS } = conductorSizing;
const { fromApparentPower, fromCurrent, fromRealPower, isPowerError } = power;

function near(actual: number, expected: number, tolerance: number, label: string): void {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: ${actual} is not within ${tolerance} of ${expected}`,
  );
}

/** Golden size keys in these groups are nec-310-16.json keys (the file's size-key rule). */
function sizeKey(value: unknown): SizeKey | null {
  if (value === null) return null;
  assert.ok(typeof value === 'string' && TABLE_310_16_SIZES.includes(value), `not a Table 310.16 key: ${String(value)}`);
  return value;
}

/** An awg.json name ("0000") as a size key ("4/0"). */
function awgKey(value: unknown): SizeKey {
  assert.ok(typeof value === 'string' && awgRow(sizeKeyFromAwgName(value)) !== null, `not an awg.json name: ${String(value)}`);
  return sizeKeyFromAwgName(value);
}

function phase(value: unknown): Phase {
  assert.ok(value === 1 || value === 3, `phase must be 1 or 3, got ${String(value)}`);
  return value === 3 ? 'three' : 'single';
}

function powerResult(result: PowerResult | PowerFailure): PowerResult {
  assert.ok(!isPowerError(result), `unexpected error ${isPowerError(result) ? result.error : ''}`);
  return result as PowerResult;
}

function sized(result: SizeConductorResult | SizeConductorError): SizeConductorResult {
  if (isSizingError(result)) assert.fail(`unexpected error ${result.error}`);
  return result;
}

/** Each expected key against `actual`, under the case's tolerance (see the file header); `checkedAbove` keys are skipped. */
function check(c: GoldenCase, actual: Record<string, unknown>, checkedAbove: string[] = []): void {
  for (const [key, expected] of Object.entries(c.expected)) {
    if (checkedAbove.includes(key)) continue;
    assert.ok(key in actual, `no result for ${key}`);
    const value = actual[key];
    const tolerance = c.tolerance[key];
    if (typeof tolerance === 'number') {
      assert.equal(typeof value, 'number', key);
      near(value as number, expected as number, tolerance, key);
    } else if (c.tolerance.exact === true || c.tolerance.other === 'exact' || typeof expected !== 'number') {
      assert.deepEqual(value, expected, key);
    } else {
      const decimals = (String(expected).split('.')[1] ?? '').length;
      assert.equal(typeof value, 'number', key);
      assert.equal(Number((value as number).toFixed(decimals)), expected, `${key}: ${value} at ${decimals} decimals`);
    }
  }
}

function sizeConductorCase(c: GoldenCase): SizeConductorResult | SizeConductorError {
  const i = c.inputs as {
    ocpd_a: number;
    load_a: number | null;
    length_ft_one_way: number;
    volts: number;
    phase: number;
    material: Material;
    vd_target_pct: number;
  };
  return sizeConductor({
    ocpdA: i.ocpd_a,
    loadA: i.load_a,
    lengthFt: i.length_ft_one_way,
    volts: i.volts,
    phase: phase(i.phase),
    material: i.material,
    vdTargetPct: i.vd_target_pct,
  });
}

/** One runner per group; a runner asserts one case. */
const RUNNERS: Record<string, (c: GoldenCase) => void> = {
  'wire-size-60c': (c) => {
    const e = c.expected as {
      size: string;
      ampacity_60c: number;
      min_size_by_ampacity: string;
      vd_volts: number;
      vd_percent: number;
      meets_target: boolean;
      egc: string | null;
      egc_upsized: boolean;
      egc_larger_than_conductor: boolean;
    };
    const t = c.tolerance as { vd_volts: number; vd_percent: number };
    const result = sized(sizeConductorCase(c));
    assert.equal(result.size, sizeKey(e.size));
    assert.equal(result.ampacity60, e.ampacity_60c);
    assert.equal(result.minSizeByAmpacity, sizeKey(e.min_size_by_ampacity));
    near(result.vdVolts, e.vd_volts, t.vd_volts, 'vd_volts');
    near(result.vdPct, e.vd_percent, t.vd_percent, 'vd_percent');
    assert.equal(result.meetsTarget, e.meets_target);
    assert.equal(result.egc, sizeKey(e.egc));
    assert.equal(result.egcUpsized, e.egc_upsized);
    assert.equal(result.egcLargerThanConductor, e.egc_larger_than_conductor);
    // egcLargerThanConductor is true exactly when the EGC is null or its area is larger than the conductor's
    assert.equal(
      result.egcLargerThanConductor,
      result.egc === null || areaCmil(result.egc) > areaCmil(result.size),
    );
    // ampacity, ground wire and voltage drop always add a line; 240.4(D) and the upsizing steps add one when they apply
    assert.ok(result.steps.length >= 3, 'steps[] explains each step');
  },

  'wire-size-errors': (c) => {
    const result = sizeConductorCase(c);
    assert.ok(isSizingError(result), 'returns an error, never a size');
    assert.equal(result.error, c.expected.error);
    assert.ok(!('size' in result));
  },

  'wire-size-termination': (c) => {
    const i = c.inputs as {
      ocpd_a: number;
      material: Material;
      termination: conductorSizing.Termination;
      wiring_method: conductorSizing.WiringMethod;
    };
    // no circuit in this group: a 0 ft run, so voltage drop never moves the size
    const result = sized(
      sizeConductor({
        ocpdA: i.ocpd_a,
        material: i.material,
        termination: i.termination,
        wiringMethod: i.wiring_method,
        lengthFt: 0,
        volts: WIRE_SIZE_DEFAULTS.volts,
        phase: WIRE_SIZE_DEFAULTS.phase,
      }),
    );
    assert.equal(result.columnC, conductorSizing.terminationColumn(i.ocpd_a, i.termination, i.wiring_method));
    check(c, {
      column_c: result.columnC,
      size: result.size,
      ampacity: result.ampacity,
      limited_by_240_4_D: result.limitedBy240_4D,
      egc: result.egc,
    });
  },

  'wire-size-derated': (c) => {
    const i = c.inputs as {
      ocpd_a: number;
      load_a: number;
      length_ft_one_way: number;
      volts: number;
      phase: number;
      material: Material;
      vd_target_pct: number;
      wiring_method: conductorSizing.WiringMethod;
      termination: conductorSizing.Termination;
      ambient_c_row: string;
      ccc_band: string | null;
    };
    const result = sized(
      sizeConductor({
        ocpdA: i.ocpd_a,
        loadA: i.load_a,
        lengthFt: i.length_ft_one_way,
        volts: i.volts,
        phase: phase(i.phase),
        material: i.material,
        vdTargetPct: i.vd_target_pct,
        wiringMethod: i.wiring_method,
        termination: i.termination,
        ambientRow: i.ambient_c_row,
        cccBand: i.ccc_band,
      }),
    );
    check(c, {
      column_c: result.columnC,
      start_column_c: result.startColumnC,
      min_size_by_ampacity: result.minSizeByAmpacity,
      derated_ampacity: result.deratedAmpacity,
      size: result.size,
      vd_volts: result.vdVolts,
      vd_percent: result.vdPct,
      meets_target: result.meetsTarget,
      egc: result.egc,
      egc_upsized: result.egcUpsized,
      egc_larger_than_conductor: result.egcLargerThanConductor,
    });
  },

  'service-lookup': (c) => {
    const e = c.expected as {
      cu: string;
      al_cca: string;
      gec_for_cu_service: { cu: string; al_cca: string };
      gec_for_al_service: { cu: string; al_cca: string };
    };
    const result = serviceLookup.serviceLookup(c.inputs.rating_a as number);
    assert.ok(result);
    assert.equal(result.cu, sizeKey(e.cu));
    assert.equal(result.alCca, sizeKey(e.al_cca));
    assert.deepEqual(result.gecForCuService, { cu: sizeKey(e.gec_for_cu_service.cu), alCca: sizeKey(e.gec_for_cu_service.al_cca) });
    assert.deepEqual(result.gecForAlService, { cu: sizeKey(e.gec_for_al_service.cu), alCca: sizeKey(e.gec_for_al_service.al_cca) });
  },

  'table-310-12': (c) => {
    const row = table31012(c.inputs.rating_a as number);
    if ('result' in c.expected) {
      assert.equal(c.expected.result, null);
      assert.equal(row, null);
      assert.equal(serviceLookup.serviceLookup(c.inputs.rating_a as number), null);
    } else {
      assert.ok(row);
      assert.equal(row.cu, sizeKey(c.expected.cu));
      assert.equal(row.alCca, sizeKey(c.expected.al_cca));
    }
  },

  'table-250-66': (c) => {
    const i = c.inputs as { service_cu?: string; service_al?: string };
    const result = i.service_cu !== undefined
      ? gec(sizeKey(i.service_cu) as SizeKey, 'Cu')
      : gec(sizeKey(i.service_al) as SizeKey, 'Al');
    assert.ok(result);
    assert.equal(result.cu, sizeKey(c.expected.gec_cu));
    assert.equal(result.alCca, sizeKey(c.expected.gec_al_cca));
  },

  'table-250-122': (c) => {
    const row = egcRow(c.inputs.ocpd_a as number);
    if ('result' in c.expected) {
      assert.equal(c.expected.result, null);
      assert.equal(row, null);
    } else {
      assert.ok(row);
      assert.equal(row.cu, sizeKey(c.expected.cu));
      assert.equal(row.alCca, sizeKey(c.expected.al_cca));
      assert.equal(row.rowA, c.expected.row_a);
    }
  },

  'ampacity-correction': (c) => {
    const factor = correction(c.inputs.ambient_c_row as string, c.inputs.column as CorrectionColumn);
    assert.equal(factor, c.expected.factor);
  },

  'ampacity-arithmetic': (c) => {
    const i = c.inputs as { size: string; column: string; ambient_c_row: string; ccc_band: string | null };
    const column = /^(cu|al)_(60|75|90)$/.exec(i.column);
    assert.ok(column, `not a Table 310.16 column: ${i.column}`);
    const result = ampacity.calculateAmpacity({
      size: sizeKey(i.size) as SizeKey,
      material: column[1] === 'cu' ? 'Cu' : 'Al',
      column: Number(column[2]) as AmpacityColumn,
      ambientRow: i.ambient_c_row,
      band: i.ccc_band ?? ampacity.NO_ADJUSTMENT_BAND,
    });
    check(c, {
      table_a: result.tableAmpacity,
      correction: result.correctionFactor,
      adjustment_pct: result.adjustmentPercent,
      result_a: result.ampacity,
    });
  },

  '240-4-D': (c) => {
    const row = max240_4D(sizeKey(c.inputs.size) as SizeKey, c.inputs.material as Material | 'CCA');
    assert.ok(row);
    assert.equal(row.max_ocpd_a, c.expected.max_ocpd_a);
    assert.ok('conditions' in row && 'status' in row);
  },

  resistance: (c) => {
    const size = sizeKey(c.inputs.size) as SizeKey;
    const material = c.inputs.material as Material;
    const tempC = c.inputs.temp_c as number;
    const r = resistance.resistanceAt(size, material, tempC);
    assert.ok(r !== null);
    near(r, c.expected.ohm_per_1000ft as number, c.tolerance.ohm_per_1000ft as number, 'ohm_per_1000ft');
    const wire = resistance.wireResistance(size, material, 1000, tempC);
    assert.ok(wire);
    near(wire.conductorOhms, r, 1e-12, 'one conductor over 1000 ft');
    near(wire.loopOhms, 2 * r, 1e-12, 'loop over 1000 ft');
  },

  'voltage-drop': (c) => {
    const i = c.inputs as {
      size: string;
      material: Material;
      amps: number;
      length_ft_one_way: number;
      volts: number;
      phase: number;
      conductor_temp_c: number;
    };
    assert.equal(i.conductor_temp_c, 75);
    const result = voltageDrop.voltageDrop({
      size: sizeKey(i.size) as SizeKey,
      material: i.material,
      amps: i.amps,
      lengthFt: i.length_ft_one_way,
      volts: i.volts,
      phase: phase(i.phase),
    });
    assert.ok(result);
    near(result.vdVolts, c.expected.vd_volts as number, c.tolerance.vd_volts as number, 'vd_volts');
    near(result.vdPct, c.expected.vd_percent as number, c.tolerance.vd_percent as number, 'vd_percent');
    const conductors = i.phase === 3 ? 3 : 2;
    near(result.powerLossW, (conductors * i.amps ** 2 * result.ohmsPer1000ft * i.length_ft_one_way) / 1000, 1e-9, 'power loss');
  },

  parallel: (c) => {
    const result = voltageDrop.parallelEquivalent(sizeKey(c.inputs.size) as SizeKey, c.inputs.sets as number);
    check(c, { total_cmil: result.totalCmil, smallest_single_size_at_least: result.smallestSingleSize });
  },

  'dc-sizing': (c) => {
    const i = c.inputs as {
      volts: number;
      watts: number;
      length_ft_one_way: number;
      max_drop_pct: number;
      conductor_temp_c: number;
    };
    const e = c.expected as {
      amps: number;
      required_cmil: number;
      vd_size: string | null;
      current_size: string | null;
      result_size: string | null;
      governs: string | null;
    };
    const t = c.tolerance as { required_cmil: number; amps: number };
    const result = dcSizing.dcSizing({
      volts: i.volts,
      watts: i.watts,
      lengthFt: i.length_ft_one_way,
      dropPct: i.max_drop_pct,
      tempC: i.conductor_temp_c,
    });
    if ('error' in result) assert.fail(`unexpected error ${result.error}`);
    near(result.amps, e.amps, t.amps, 'amps');
    near(result.requiredCmil, e.required_cmil, t.required_cmil, 'required_cmil');
    assert.equal(result.vdSize, sizeKey(e.vd_size));
    assert.equal(result.currentSize, sizeKey(e.current_size));
    assert.equal(result.resultSize, sizeKey(e.result_size));
    assert.equal(result.governs, e.governs);
  },

  power: (c) => {
    const i = c.inputs as { kw?: number; kva?: number; watts?: number; amps?: number; volts: number; phase: number; pf?: number };
    const base = { volts: i.volts, circuit: phase(i.phase), pf: i.pf ?? 1 };
    if (i.amps !== undefined) {
      const r = powerResult(fromCurrent({ ...base, amps: i.amps }));
      near(r.watts, c.expected.watts as number, c.tolerance.watts as number, 'watts');
      return;
    }
    const r = i.kva !== undefined
      ? powerResult(fromApparentPower({ ...base, va: i.kva * 1000 }))
      : powerResult(fromRealPower({ ...base, watts: i.kw !== undefined ? i.kw * 1000 : (i.watts as number) }));
    near(r.amps, c.expected.amps as number, c.tolerance.amps as number, 'amps');
  },

  'pf-correction': (c) => {
    const i = c.inputs as { kw: number; pf_from?: number; kva?: number; pf_to: number };
    const result = power.pfCorrection({ kw: i.kw, pfFrom: i.pf_from, kva: i.kva, pfTo: i.pf_to });
    assert.ok(result);
    check(c, { pf_from: result.pfFrom, kvar: result.kvar, current_reduction_pct: result.currentReductionPct });
  },

  conversion: (c) => {
    const i = c.inputs as { btu_per_h?: number; watts?: number; tons?: number; hp?: number; kind?: HorsepowerKind };
    if (i.btu_per_h !== undefined) {
      near(conversions.btuPerHourToWatts(i.btu_per_h), c.expected.watts as number, c.tolerance.watts as number, 'watts');
    } else if (i.watts !== undefined) {
      near(conversions.wattsToBtuPerHour(i.watts), c.expected.btu_per_h as number, c.tolerance.btu_per_h as number, 'btu_per_h');
    } else if (i.tons !== undefined) {
      near(conversions.tonsToWatts(i.tons), c.expected.watts as number, c.tolerance.watts as number, 'watts');
    } else {
      near(conversions.horsepowerToWatts(i.hp as number, i.kind as HorsepowerKind), c.expected.watts as number, c.tolerance.watts as number, 'watts');
    }
  },

  'awg-geometry': (c) => {
    const result = awgGeometry.awgGeometry(awgKey(c.inputs.awg));
    assert.ok(result);
    check(c, {
      diameter_in: result.diameterIn,
      diameter_mm: result.diameterMm,
      area_cmil: result.areaCmil,
      area_mm2: result.areaMm2,
    });
  },

  'awg-table': (c) => {
    const row = awgRow(awgKey(c.inputs.awg));
    assert.ok(row);
    check(c, {
      diameter_mils: row.diameter_mils,
      area_cmil: row.area_cmil,
      r20_cu_ohm_per_1000ft: row.r20_cu_ohm_per_1000ft,
      weight_cu_lb_per_1000ft: row.weight_cu_lb_per_1000ft,
    });
  },

  weight: (c) => {
    check(c, { lb_per_ft: awgGeometry.copperWeightLbPerFt(awgKey(c.inputs.awg)) });
  },

  'load-calc-2023': (c) => {
    const i = c.inputs;
    if ('ranges' in i) {
      check(c, { demand_kw: loadCalc.rangeDemandKw(i.ranges as number, i.rating_kw as number) });
    } else if ('wall_oven_kw' in i) {
      check(c, { branch_load_kw: loadCalc.singleUnitBranchLoadKw(i.wall_oven_kw as number) });
    } else if ('cooktop_kw' in i) {
      const result = loadCalc.cooktopAndOvensBranchLoad(i.cooktop_kw as number, i.ovens_kw as number[]);
      assert.ok(result);
      check(c, { equivalent_range_kw: result.equivalentRangeKw, demand_kw: result.demandKw });
    } else if ('appliances_kw' in i) {
      const result = loadCalc.note3DemandKw(i.appliances_kw as number[]);
      assert.ok(result);
      check(c, { demand_kw: result.demandKw, column: result.column, pct: result.pct });
    } else if ('dryer_w' in i) {
      check(c, { load_w: loadCalc.dryerLoadW(i.dryer_w as number) });
    } else if ('dryers' in i) {
      check(c, { pct: loadCalc.dryerDemandPct(i.dryers as number) });
    } else if ('evse_w' in i) {
      check(c, { load_w: loadCalc.evseLoadW(i.evse_w as number) });
    } else if ('total_va' in i) {
      check(c, { demand_va: loadCalc.existingDwellingLoad(i.total_va as number) });
    } else {
      const o = i as {
        ft2: number;
        small_appliance_and_laundry_circuits: number;
        nameplate_items_w: number[];
        space_heat_w_central_1_unit: number;
        ac_va: number;
        volts: number;
      };
      const result = loadCalc.optionalDwellingLoad({
        ft2: o.ft2,
        smallApplianceAndLaundryCircuits: o.small_appliance_and_laundry_circuits,
        nameplateItemsVa: o.nameplate_items_w,
        // space_heat_w_central_1_unit: one central unit, so one separately controlled unit
        spaceHeatVa: o.space_heat_w_central_1_unit,
        spaceHeatUnits: 1,
        acVa: o.ac_va,
        volts: o.volts,
      });
      assert.ok(result && result.serviceRow && result.heatingAcItem);
      // heating_ac_selection names the 220.82(C) item first: "(C)(4) heat 65 % (<4 units)"
      const selection = c.expected.heating_ac_selection as string;
      assert.ok(selection.startsWith(`${result.heatingAcItem} `), `${selection} is not item ${result.heatingAcItem}`);
      check(
        c,
        {
          general_load_va: result.generalLoadVa,
          general_after_220_82_b_va: result.generalAfterDemandVa,
          heating_ac_va: result.heatingAcVa,
          total_va: result.totalVa,
          amps_at_240: result.amps,
          service_310_12_row_a: result.serviceRow.ratingA,
          cu: result.serviceRow.cu,
          al_cca: result.serviceRow.alCca,
        },
        ['heating_ac_selection'],
      );
    }
  },

  'load-calc-2023-standard': (c) => {
    const i = c.inputs as {
      ft2: number;
      small_appliance_circuits: number;
      laundry_circuits: number;
      fastened_appliances_w: number[];
      dryer_w: number;
      range_kw: number;
      space_heat_w: number;
      ac_va: number;
      volts: number;
    };
    const result = loadCalc.standardDwellingLoad({
      ft2: i.ft2,
      smallApplianceCircuits: i.small_appliance_circuits,
      laundryCircuits: i.laundry_circuits,
      fastenedAppliancesW: i.fastened_appliances_w,
      dryerW: i.dryer_w,
      rangeKw: i.range_kw,
      spaceHeatW: i.space_heat_w,
      acVa: i.ac_va,
      volts: i.volts,
    });
    assert.ok(result && result.serviceRow);
    check(c, {
      general_lighting_va: result.generalLightingVa,
      lighting_after_demand_va: result.lightingAfterDemandVa,
      appliances_after_220_53_va: result.appliancesVa,
      dryer_va: result.dryerVa,
      range_va: result.rangeVa,
      heat_or_ac_va: result.heatOrAcVa,
      total_va: result.totalVa,
      amps_at_240: result.amps,
      service_310_12_row_a: result.serviceRow.ratingA,
      cu: result.serviceRow.cu,
      al_cca: result.serviceRow.alCca,
    });
  },

  'motor-flc': (c) => {
    const i = c.inputs as { phase: motorFlc.MotorPhase; hp: string; system_volts?: number; volts?: number };
    const result = motorFlc.motorFlc({ phase: i.phase, hp: i.hp, volts: (i.system_volts ?? i.volts) as number });
    assert.ok(result);
    assert.ok(['verified-2023', 'verified-sd2023'].includes(result.status), result.status);
    check(c, { column: result.column, flc_a: result.flcA });
  },

  'breaker-sizing': (c) => {
    const result = breakerSizing.breakerSizing({
      continuousA: c.inputs.continuous_a as number,
      noncontinuousA: c.inputs.noncontinuous_a as number,
    });
    assert.ok(result);
    check(c, {
      min_ocpd_a: result.minOcpdA,
      breaker_a: result.breakerA,
      cu: result.cu,
      al: result.al,
      egc_cu: result.egcCu,
      egc_al: result.egcAl,
    });
  },
};

const GROUPS = [...new Set(CASES.map((c) => c.group))];
let casesRun = 0;

it('every golden group has a runner', () => {
  assert.deepEqual(GROUPS.filter((group) => !(group in RUNNERS)), []);
  assert.deepEqual(Object.keys(RUNNERS).filter((group) => !GROUPS.includes(group)), []);
});

for (const group of GROUPS) {
  describe(group, () => {
    for (const c of CASES.filter((x) => x.group === group)) {
      it(c.name, () => {
        const run = RUNNERS[group];
        assert.ok(run, `no runner for group ${group}`);
        run(c);
        casesRun++;
      });
    }
  });
}

it('egcLargerThanConductor is true only in the three 25 A aluminum cases', () => {
  const flagged = CASES.filter((c) => c.group === 'wire-size-60c').filter((c) => {
    const result = sizeConductorCase(c);
    return !isSizingError(result) && result.egcLargerThanConductor;
  });
  assert.equal(flagged.length, 3);
  for (const c of flagged) {
    assert.equal(c.inputs.ocpd_a, 25);
    assert.equal(c.inputs.material, 'Al');
  }
});

it('runs every case of the file once', (t) => {
  t.diagnostic(`golden: ${casesRun} of ${FILE.count} cases run, ${GROUPS.length} groups, 0 skipped`);
  assert.equal(CASES.length, FILE.count);
  assert.equal(casesRun, FILE.count);
});

describe('engines', () => {
  const ENGINES: Record<string, { ENGINE_ID: string; DOMAINS: string[] }> = {
    ampacity,
    'awg-geometry': awgGeometry,
    'breaker-sizing': breakerSizing,
    'conductor-sizing': conductorSizing,
    conversions,
    'dc-sizing': dcSizing,
    grounding,
    'load-calc-2023': loadCalc,
    'motor-flc': motorFlc,
    'ohms-law': ohmsLaw,
    power,
    resistance,
    'service-lookup': serviceLookup,
    'voltage-drop': voltageDrop,
  };
  // helpers, and the old import path of the guides (until WSZ-005)
  const NOT_ENGINES = ['fields', 'format', 'inputs', 'sizes'];

  it('every module in src/lib/calculations is an engine or a helper', () => {
    const modules = readdirSync(new URL('../src/lib/calculations/', import.meta.url))
      .filter((f) => f.endsWith('.ts'))
      .map((f) => f.replace(/\.ts$/, ''));
    assert.deepEqual(modules.filter((m) => !(m in ENGINES) && !NOT_ENGINES.includes(m)), []);
  });

  it('ENGINE_ID is the file name and unique', () => {
    const ids = Object.values(ENGINES).map((m) => m.ENGINE_ID);
    assert.equal(new Set(ids).size, ids.length);
    for (const [file, m] of Object.entries(ENGINES)) assert.equal(m.ENGINE_ID, file);
  });

  it('every DOMAINS entry is a verified row of research/data-sources.csv', () => {
    const rows = parseCsv(readFileSync(new URL('../research/data-sources.csv', import.meta.url), 'utf8')) as Record<string, string>[];
    const status = new Map(rows.map((row) => [row.domain, row.status]));
    for (const [file, m] of Object.entries(ENGINES)) {
      assert.ok(Array.isArray(m.DOMAINS), file);
      for (const domain of m.DOMAINS) assert.equal(status.get(domain), 'verified', `${file}: ${domain}`);
    }
  });
});
