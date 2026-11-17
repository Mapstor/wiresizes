// WSZ-002 regression tests: the exported titles, notes and defaults of the pure modules in src/lib/calculations, and
// spot checks. The golden-case loops moved to tests/golden.test.ts (WSZ-003a), which runs every case once.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  EGC_NONE_MESSAGE,
  EGC_UPSIZED_NOTE,
  SIZING_ERROR_MESSAGES,
  WIRE_SIZE_DEFAULTS,
  WIRE_SIZE_RATINGS,
} from '../src/lib/calculations/conductor-sizing';
import { ABOVE_TARGET_TITLE, MEETS_TARGET_TITLE, VD_TARGET_OPTIONS } from '../src/lib/calculations/voltage-drop';
import {
  AMBIENT_ROWS,
  ocpdLimitLabel,
} from '../src/lib/calculations/ampacity';
import { NO_SIZE_MESSAGE } from '../src/lib/calculations/dc-sizing';
import { GROUND_WIRE_DEFAULTS, PROPORTIONAL_NOTE } from '../src/lib/calculations/grounding';
import {
  SERVICE_LOOKUP_DEFAULTS,
} from '../src/lib/calculations/service-lookup';
import { btuPerHourToWatts } from '../src/lib/calculations/conversions';
import {
  fromRealPower,
  isPowerError,
} from '../src/lib/calculations/power';
import { solveOhmsLaw } from '../src/lib/calculations/ohms-law';
import { VOLTAGE_INVALID_MESSAGE, voltsAfterPhaseChange } from '../src/lib/calculations/inputs';

function near(actual: number, expected: number, tolerance: number, label: string): void {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: ${actual} is not within ${tolerance} of ${expected}`,
  );
}

describe('exported titles, notes and messages', () => {
  it('voltage-drop target titles (the wire size result)', () => {
    assert.equal(MEETS_TARGET_TITLE, 'Meets your voltage-drop target');
    assert.equal(ABOVE_TARGET_TITLE, 'Above your voltage-drop target');
  });

  it('wire size basis lines and ground-wire notes', () => {
    assert.equal(EGC_UPSIZED_NOTE, 'Ground wire increased in proportion to the larger conductors (NEC 250.122(B)).');
    assert.equal(EGC_NONE_MESSAGE, 'No size in NEC Table 310.16 is large enough for this ground wire.');
    assert.equal(SIZING_ERROR_MESSAGES['voltage-invalid'], VOLTAGE_INVALID_MESSAGE);
  });

  it('ampacity, ground wire and low-voltage messages', () => {
    assert.equal(ocpdLimitLabel(20), 'Overcurrent protection limited to 20 A (NEC 240.4(D))');
    assert.equal(
      PROPORTIONAL_NOTE,
      'Size increases in proportion if the phase conductors are upsized (NEC 250.122(B)); the wire size calculator does this.',
    );
    assert.equal(NO_SIZE_MESSAGE, 'No size in NEC Table 310.16 is large enough for this load.');
  });
});

describe('default and reset inputs', () => {
  it('ampacity: Table 310.15(B)(1)(1) has 16 rows', () => {
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
    assert.equal(GROUND_WIRE_DEFAULTS.ocpdA, 20);
    assert.equal(SERVICE_LOOKUP_DEFAULTS.ratingA, 200);
  });

  it('switching to three-phase resets an invalid voltage to 240 V', () => {
    assert.equal(voltsAfterPhaseChange(120, 'three'), 240);
    assert.equal(voltsAfterPhaseChange(480, 'three'), 480);
  });
});

describe('spot checks', () => {
  it("Ohm's law: 12 V across 10 kΩ gives 1.2 mA", () => {
    const result = solveOhmsLaw('current', { voltage: 12, resistance: 10000 });
    assert.ok(result);
    near(result.current, 0.0012, 1e-12, 'amps');
  });

  it('BTU: 12,000 Btu/h = 3,516.853 W ± 0.001', () => {
    near(btuPerHourToWatts(12000), 3516.853, 0.001, 'watts');
  });

  it('three-phase inputs are limited to line-to-line voltages, and PF to (0, 1]', () => {
    const atNeutral = fromRealPower({ watts: 1000, volts: 277, circuit: 'three', pf: 1 });
    assert.ok(isPowerError(atNeutral) && atNeutral.error === 'voltage-invalid');
    const pfAboveOne = fromRealPower({ watts: 1000, volts: 240, circuit: 'single', pf: 1.1 });
    assert.ok(isPowerError(pfAboveOne) && pfAboveOne.error === 'power-factor-invalid');
  });
});
