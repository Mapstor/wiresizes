// WSZ-002 regression tests: the exported titles, notes and defaults of the pure modules in src/lib/calculations, and
// spot checks. The golden-case loops moved to tests/golden.test.ts (WSZ-003a), which runs every case once.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  BASIS_LINES,
  EGC_LARGER_THAN_CONDUCTOR_NOTE,
  EGC_NONE_MESSAGE,
  EGC_UPSIZED_NOTE,
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
  VOLTAGE_DROP_DEFAULTS,
} from '../src/lib/calculations/voltage-drop';
import {
  AMBIENT_ROWS,
  AMPACITY_DEFAULTS,
  NOT_PERMITTED_MESSAGE,
  ocpdLimitLabel,
} from '../src/lib/calculations/ampacity';
import { RESISTANCE_DEFAULTS } from '../src/lib/calculations/resistance';
import {
  BASIS_LINE as DC_BASIS_LINE,
  DC_SIZING_DEFAULTS,
  NO_SIZE_MESSAGE,
} from '../src/lib/calculations/dc-sizing';
import { GROUND_WIRE_DEFAULTS, PROPORTIONAL_NOTE } from '../src/lib/calculations/grounding';
import {
  NO_ROW_MESSAGE,
  SCOPE_LINES,
  SERVICE_LOOKUP_DEFAULTS,
} from '../src/lib/calculations/service-lookup';
import { btuPerHourToWatts, BTU_DEFAULTS } from '../src/lib/calculations/conversions';
import {
  currentByVoltage,
  fromRealPower,
  isPowerError,
  VOLTS_TO_AMPS_COMPARISON_VOLTS,
} from '../src/lib/calculations/power';
import type { PowerFailure, PowerResult } from '../src/lib/calculations/power';
import { formatSi, OHMS_LAW_DEFAULTS, solveOhmsLaw } from '../src/lib/calculations/ohms-law';
import { VOLTAGE_INVALID_MESSAGE, voltsAfterPhaseChange } from '../src/lib/calculations/inputs';

function near(actual: number, expected: number, tolerance: number, label: string): void {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: ${actual} is not within ${tolerance} of ${expected}`,
  );
}

function powerResult(result: PowerResult | PowerFailure): PowerResult {
  assert.ok(!isPowerError(result), `unexpected error ${isPowerError(result) ? result.error : ''}`);
  return result as PowerResult;
}

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
