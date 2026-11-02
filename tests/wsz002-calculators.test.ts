// WSZ-002 regression tests: every case of the step-6 groups in research/golden-cases.json, run through the
// pure modules in src/lib/calculations within each case's tolerance, plus the exported titles, notes and defaults.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import golden from '../research/golden-cases.json';
import { areaCmil } from '../src/lib/verified/awg';
import type { Material, SizeKey } from '../src/lib/verified/awg';
import { TABLE_310_16_SIZES } from '../src/lib/verified/nec-310-16';
import type { Phase } from '../src/lib/calculations/inputs';
import {
  BASIS_LINES,
  EGC_LARGER_THAN_CONDUCTOR_NOTE,
  EGC_NONE_MESSAGE,
  EGC_UPSIZED_NOTE,
  isSizingError,
  sizeConductor,
  SIZING_ERROR_MESSAGES,
  WIRE_SIZE_DEFAULTS,
  WIRE_SIZE_RATINGS,
} from '../src/lib/calculations/conductor-sizing';
import {
  ABOVE_TARGET_TITLE,
  ALUMINUM_RESISTANCE_NOTE,
  MEETS_TARGET_TITLE,
  RESISTANCE_BASIS_LABEL,
  VD_TARGET_OPTIONS,
  voltageDrop,
  VOLTAGE_DROP_DEFAULTS,
} from '../src/lib/calculations/voltage-drop';
import {
  AMBIENT_ROWS,
  AMPACITY_DEFAULTS,
  correctionFactor,
  maxOcpd240_4D,
  NOT_PERMITTED_MESSAGE,
  ocpdLimitLabel,
} from '../src/lib/calculations/ampacity';
import type { CorrectionColumn } from '../src/lib/calculations/ampacity';
import { resistanceAt, RESISTANCE_DEFAULTS, wireResistance } from '../src/lib/calculations/resistance';
import {
  BASIS_LINE as DC_BASIS_LINE,
  DC_SIZING_DEFAULTS,
  dcSizing,
  NO_SIZE_MESSAGE,
} from '../src/lib/calculations/dc-sizing';
import { egcForOcpd, GROUND_WIRE_DEFAULTS, PROPORTIONAL_NOTE } from '../src/lib/calculations/grounding';
import {
  gecForServiceConductor,
  NO_ROW_MESSAGE,
  SCOPE_LINES,
  serviceConductors,
  serviceLookup,
  SERVICE_LOOKUP_DEFAULTS,
} from '../src/lib/calculations/service-lookup';
import {
  btuPerHourToWatts,
  BTU_DEFAULTS,
  horsepowerToWatts,
  tonsToWatts,
  wattsToBtuPerHour,
} from '../src/lib/calculations/conversions';
import type { HorsepowerKind } from '../src/lib/calculations/conversions';
import {
  currentByVoltage,
  fromApparentPower,
  fromCurrent,
  fromRealPower,
  isPowerError,
  VOLTS_TO_AMPS_COMPARISON_VOLTS,
} from '../src/lib/calculations/power';
import type { PowerFailure, PowerResult } from '../src/lib/calculations/power';
import { formatSi, OHMS_LAW_DEFAULTS, solveOhmsLaw } from '../src/lib/calculations/ohms-law';
import { VOLTAGE_INVALID_MESSAGE, voltsAfterPhaseChange } from '../src/lib/calculations/inputs';

interface GoldenCase {
  group: string;
  name: string;
  inputs: Record<string, unknown>;
  expected: Record<string, unknown>;
  tolerance: Record<string, unknown>;
}

const CASES = (golden as unknown as { cases: GoldenCase[] }).cases;

function group(name: string): GoldenCase[] {
  const cases = CASES.filter((c) => c.group === name);
  assert.ok(cases.length > 0, `golden group ${name} is empty`);
  return cases;
}

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

function phase(value: unknown): Phase {
  assert.ok(value === 1 || value === 3, `phase must be 1 or 3, got ${String(value)}`);
  return value === 3 ? 'three' : 'single';
}

function powerResult(result: PowerResult | PowerFailure): PowerResult {
  assert.ok(!isPowerError(result), `unexpected error ${isPowerError(result) ? result.error : ''}`);
  return result as PowerResult;
}

describe('wire-size-60c', () => {
  for (const c of group('wire-size-60c')) {
    it(c.name, () => {
      const i = c.inputs as {
        ocpd_a: number;
        load_a: number | null;
        length_ft_one_way: number;
        volts: number;
        phase: number;
        material: Material;
        vd_target_pct: number;
      };
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
      const result = sizeConductor({
        ocpdA: i.ocpd_a,
        loadA: i.load_a,
        lengthFt: i.length_ft_one_way,
        volts: i.volts,
        phase: phase(i.phase),
        material: i.material,
        vdTargetPct: i.vd_target_pct,
      });
      if (isSizingError(result)) assert.fail(`unexpected error ${result.error}`);
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
    });
  }

  it('egcLargerThanConductor is true only in the three 25 A aluminum cases', () => {
    const flagged = group('wire-size-60c').filter((c) => {
      const i = c.inputs as { ocpd_a: number; load_a: number | null; length_ft_one_way: number; volts: number; phase: number; material: Material; vd_target_pct: number };
      const result = sizeConductor({
        ocpdA: i.ocpd_a,
        loadA: i.load_a,
        lengthFt: i.length_ft_one_way,
        volts: i.volts,
        phase: phase(i.phase),
        material: i.material,
        vdTargetPct: i.vd_target_pct,
      });
      return !isSizingError(result) && result.egcLargerThanConductor;
    });
    assert.equal(flagged.length, 3);
    for (const c of flagged) {
      assert.equal(c.inputs.ocpd_a, 25);
      assert.equal(c.inputs.material, 'Al');
    }
  });
});

describe('wire-size-errors', () => {
  for (const c of group('wire-size-errors')) {
    it(c.name, () => {
      const i = c.inputs as {
        ocpd_a: number;
        load_a: number | null;
        length_ft_one_way: number;
        volts: number;
        phase: number;
        material: Material;
        vd_target_pct: number;
      };
      const result = sizeConductor({
        ocpdA: i.ocpd_a,
        loadA: i.load_a,
        lengthFt: i.length_ft_one_way,
        volts: i.volts,
        phase: phase(i.phase),
        material: i.material,
        vdTargetPct: i.vd_target_pct,
      });
      assert.ok(isSizingError(result), 'returns an error, never a size');
      assert.equal(result.error, c.expected.error);
      assert.ok(!('size' in result));
    });
  }
});

describe('service-lookup', () => {
  for (const c of group('service-lookup')) {
    it(c.name, () => {
      const e = c.expected as {
        cu: string;
        al_cca: string;
        gec_for_cu_service: { cu: string; al_cca: string };
        gec_for_al_service: { cu: string; al_cca: string };
      };
      const result = serviceLookup(c.inputs.rating_a as number);
      assert.ok(result);
      assert.equal(result.cu, sizeKey(e.cu));
      assert.equal(result.alCca, sizeKey(e.al_cca));
      assert.deepEqual(result.gecForCuService, { cu: sizeKey(e.gec_for_cu_service.cu), alCca: sizeKey(e.gec_for_cu_service.al_cca) });
      assert.deepEqual(result.gecForAlService, { cu: sizeKey(e.gec_for_al_service.cu), alCca: sizeKey(e.gec_for_al_service.al_cca) });
    });
  }
});

describe('table-310-12', () => {
  for (const c of group('table-310-12')) {
    it(c.name, () => {
      const row = serviceConductors(c.inputs.rating_a as number);
      if ('result' in c.expected) {
        assert.equal(c.expected.result, null);
        assert.equal(row, null);
        assert.equal(serviceLookup(c.inputs.rating_a as number), null);
      } else {
        assert.ok(row);
        assert.equal(row.cu, sizeKey(c.expected.cu));
        assert.equal(row.alCca, sizeKey(c.expected.al_cca));
      }
    });
  }
});

describe('table-250-66', () => {
  for (const c of group('table-250-66')) {
    it(c.name, () => {
      const i = c.inputs as { service_cu?: string; service_al?: string };
      const gec = i.service_cu !== undefined
        ? gecForServiceConductor(sizeKey(i.service_cu) as SizeKey, 'Cu')
        : gecForServiceConductor(sizeKey(i.service_al) as SizeKey, 'Al');
      assert.ok(gec);
      assert.equal(gec.cu, sizeKey(c.expected.gec_cu));
      assert.equal(gec.alCca, sizeKey(c.expected.gec_al_cca));
    });
  }
});

describe('table-250-122', () => {
  for (const c of group('table-250-122')) {
    it(c.name, () => {
      const row = egcForOcpd(c.inputs.ocpd_a as number);
      if ('result' in c.expected) {
        assert.equal(c.expected.result, null);
        assert.equal(row, null);
      } else {
        assert.ok(row);
        assert.equal(row.cu, sizeKey(c.expected.cu));
        assert.equal(row.alCca, sizeKey(c.expected.al_cca));
        assert.equal(row.rowA, c.expected.row_a);
      }
    });
  }
});

describe('ampacity-correction', () => {
  for (const c of group('ampacity-correction')) {
    it(c.name, () => {
      const factor = correctionFactor(c.inputs.ambient_c_row as string, c.inputs.column as CorrectionColumn);
      assert.equal(factor, c.expected.factor);
    });
  }
});

describe('240-4-D', () => {
  for (const c of group('240-4-D')) {
    it(c.name, () => {
      const row = maxOcpd240_4D(sizeKey(c.inputs.size) as SizeKey, c.inputs.material as Material | 'CCA');
      assert.ok(row);
      assert.equal(row.max_ocpd_a, c.expected.max_ocpd_a);
      assert.ok('conditions' in row && 'status' in row);
    });
  }
});

describe('resistance', () => {
  for (const c of group('resistance')) {
    it(c.name, () => {
      const size = sizeKey(c.inputs.size) as SizeKey;
      const material = c.inputs.material as Material;
      const tempC = c.inputs.temp_c as number;
      const r = resistanceAt(size, material, tempC);
      assert.ok(r !== null);
      near(r, c.expected.ohm_per_1000ft as number, c.tolerance.ohm_per_1000ft as number, 'ohm_per_1000ft');
      const wire = wireResistance(size, material, 1000, tempC);
      assert.ok(wire);
      near(wire.conductorOhms, r, 1e-12, 'one conductor over 1000 ft');
      near(wire.loopOhms, 2 * r, 1e-12, 'loop over 1000 ft');
    });
  }
});

describe('voltage-drop', () => {
  for (const c of group('voltage-drop')) {
    it(c.name, () => {
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
      const result = voltageDrop({
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
    });
  }
});

describe('dc-sizing', () => {
  for (const c of group('dc-sizing')) {
    it(c.name, () => {
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
      const result = dcSizing({
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
    });
  }
});

describe('power', () => {
  for (const c of group('power')) {
    it(c.name, () => {
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
    });
  }
});

describe('conversion', () => {
  for (const c of group('conversion')) {
    it(c.name, () => {
      const i = c.inputs as { btu_per_h?: number; watts?: number; tons?: number; hp?: number; kind?: HorsepowerKind };
      if (i.btu_per_h !== undefined) {
        near(btuPerHourToWatts(i.btu_per_h), c.expected.watts as number, c.tolerance.watts as number, 'watts');
      } else if (i.watts !== undefined) {
        near(wattsToBtuPerHour(i.watts), c.expected.btu_per_h as number, c.tolerance.btu_per_h as number, 'btu_per_h');
      } else if (i.tons !== undefined) {
        near(tonsToWatts(i.tons), c.expected.watts as number, c.tolerance.watts as number, 'watts');
      } else {
        near(horsepowerToWatts(i.hp as number, i.kind as HorsepowerKind), c.expected.watts as number, c.tolerance.watts as number, 'watts');
      }
    });
  }
});

describe('exported titles, notes and messages', () => {
  it('voltage-drop titles and labels', () => {
    assert.equal(MEETS_TARGET_TITLE, 'Meets your voltage-drop target');
    assert.equal(ABOVE_TARGET_TITLE, 'Above your voltage-drop target');
    assert.equal(
      RESISTANCE_BASIS_LABEL,
      'DC resistance of solid conductors at 75 °C, calculated from NIST Handbook 100 and 109 constants. Stranded conductors measure slightly higher, and AC reactance is not included.',
    );
    assert.equal(ALUMINUM_RESISTANCE_NOTE, 'about 64 % higher resistance than copper');
  });

  it('wire size basis lines and ground-wire notes', () => {
    assert.deepEqual(BASIS_LINES, [
      'Sized from the 60 °C column of NEC Table 310.16 (2023), limited by 240.4(D); ground wire from Table 250.122.',
      'Assumes 30 °C (86 °F) ambient and no more than three current-carrying conductors together. Hotter locations or more conductors need the factors in Tables 310.15(B)(1)(1) and 310.15(C)(1): use the ampacity calculator.',
      'A 120/240 V dwelling service or main power feeder is sized from NEC Table 310.12 instead: see the service entrance calculator.',
    ]);
    assert.equal(EGC_UPSIZED_NOTE, 'Ground wire increased in proportion to the larger conductors (NEC 250.122(B)).');
    assert.equal(
      EGC_LARGER_THAN_CONDUCTOR_NOTE,
      'For this rating, Table 250.122 lists a ground wire larger than the smallest conductor the rating allows.',
    );
    assert.equal(EGC_NONE_MESSAGE, 'No size in NEC Table 310.16 is large enough for this ground wire.');
    assert.equal(SIZING_ERROR_MESSAGES['voltage-invalid'], VOLTAGE_INVALID_MESSAGE);
  });

  it('ampacity, ground wire, low-voltage and service messages', () => {
    assert.equal(NOT_PERMITTED_MESSAGE, 'Not permitted at this ambient temperature for this insulation rating');
    assert.equal(ocpdLimitLabel(20), 'Overcurrent protection limited to 20 A (NEC 240.4(D))');
    assert.equal(
      PROPORTIONAL_NOTE,
      'Size increases in proportion if the phase conductors are upsized (NEC 250.122(B)); the wire size calculator does this.',
    );
    assert.equal(NO_SIZE_MESSAGE, 'No size in NEC Table 310.16 is large enough for this load.');
    assert.equal(DC_BASIS_LINE, 'Sized for voltage drop and for current (60 °C column of NEC Table 310.16, 30 °C ambient).');
    assert.equal(NO_ROW_MESSAGE, 'Table 310.12 has no row for this rating.');
    assert.deepEqual(SCOPE_LINES, [
      'For a 120/240 V single-phase service or main power feeder of one dwelling unit. Other services are sized from Table 310.16. Where the conductors run hotter than 30 °C or with more than three current-carrying conductors, the corrections in Tables 310.15(B)(1)(1) and 310.15(C)(1) still apply.',
      "Grounding electrode conductor from NEC Table 250.66 (values from NFPA's 2020 grounding fact sheet).",
    ]);
  });
});

describe('default and reset inputs', () => {
  it('ampacity: 60 °C column, 26–30 °C row, 1–3 conductors', () => {
    assert.equal(AMPACITY_DEFAULTS.column, 60);
    assert.equal(AMPACITY_DEFAULTS.ambientRow, '26–30');
    assert.equal(AMPACITY_DEFAULTS.band, '1–3');
    assert.equal(AMBIENT_ROWS.length, 16);
  });

  it('wire size: 20 A rating, 3 % target', () => {
    assert.equal(WIRE_SIZE_DEFAULTS.ocpdA, 20);
    assert.equal(WIRE_SIZE_DEFAULTS.vdTargetPct, 3);
    assert.equal(WIRE_SIZE_DEFAULTS.loadA, null);
    assert.deepEqual(VD_TARGET_OPTIONS, [1, 2, 3, 4, 5]);
    assert.equal(WIRE_SIZE_RATINGS[0], 15);
    assert.equal(WIRE_SIZE_RATINGS[WIRE_SIZE_RATINGS.length - 1], 400);
  });

  it('other tools', () => {
    assert.equal(VOLTAGE_DROP_DEFAULTS.targetPct, 3);
    assert.equal(RESISTANCE_DEFAULTS.tempF, 68);
    assert.equal(DC_SIZING_DEFAULTS.tempC, 75);
    assert.equal(GROUND_WIRE_DEFAULTS.ocpdA, 20);
    assert.equal(SERVICE_LOOKUP_DEFAULTS.ratingA, 200);
    assert.equal(BTU_DEFAULTS.mode, 'btu-to-watts');
    assert.equal(OHMS_LAW_DEFAULTS.mode, 'voltage');
  });

  it('switching to three-phase resets an invalid voltage to 240 V', () => {
    assert.equal(voltsAfterPhaseChange(120, 'three'), 240);
    assert.equal(voltsAfterPhaseChange(480, 'three'), 480);
  });
});

describe('spot checks', () => {
  it("Ohm's law: 12 V across 10 kΩ gives 1.200 mA", () => {
    const result = solveOhmsLaw('current', { voltage: 12, resistance: 10000 });
    assert.ok(result);
    assert.equal(formatSi(result.current, 'A'), '1.200 mA');
  });

  it('BTU: 12,000 Btu/h = 3,516.853 W ± 0.001', () => {
    near(btuPerHourToWatts(12000), 3516.853, 0.001, 'watts');
  });

  it('VoltsToAmps: at 10 kW three-phase 240 V, the 240 V row equals the headline current', () => {
    const headline = powerResult(fromRealPower({ watts: 10000, volts: 240, circuit: 'three', pf: 1 }));
    const rows = currentByVoltage({ watts: 10000 }, 'three', 1, VOLTS_TO_AMPS_COMPARISON_VOLTS);
    const row = rows.find((r) => r.volts === 240);
    assert.ok(row);
    assert.equal(row.amps, headline.amps);
    assert.ok(!rows.some((r) => r.volts === 120), 'three-phase shows line-to-line rows only');
  });

  it('three-phase inputs are limited to line-to-line voltages, and PF to (0, 1]', () => {
    const atNeutral = fromRealPower({ watts: 1000, volts: 277, circuit: 'three', pf: 1 });
    assert.ok(isPowerError(atNeutral) && atNeutral.error === 'voltage-invalid');
    const pfAboveOne = fromRealPower({ watts: 1000, volts: 240, circuit: 'single', pf: 1.1 });
    assert.ok(isPowerError(pfAboveOne) && pfAboveOne.error === 'power-factor-invalid');
  });
});
