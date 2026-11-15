// WSZ-015: the pure parts of the fixes from chat's re-test of the WSZ-014 build that still apply: the number formatter.
// Ohm's law's two-value rule and its SI-prefix formatter went with the old tool (WSZ-007e); the any-two tool's tests
// are tests/wsz007d-ohms-btu.test.ts. The voltage-drop ampacity note, the over-100 % guard and the wire resistance input
// ranges belonged to the old calculators, which WSZ-006 replaced (their tests: wsz006, wsz006b).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatEntered, formatFixed, formatSignificant, formatUpTo } from '../src/lib/calculations/format';
import { fromApparentPower, fromCurrent, fromRealPower, isPowerError } from '../src/lib/calculations/power';
import type { PowerFailure, PowerResult } from '../src/lib/calculations/power';
import { isSizingError, sizeConductor } from '../src/lib/calculations/conductor-sizing';
import { formatSize } from '../src/lib/verified/awg';
import { wireResistance } from '../src/lib/calculations/resistance';

describe('number format', () => {
  it('en-US grouping with the decimals the tools show', () => {
    assert.equal(formatFixed(38243.68, 2), '38,243.68');
    assert.equal(formatFixed(41666.666666, 2), '41,666.67');
    assert.equal(formatFixed(14150741.89, 2), '14,150,741.89');
    assert.equal(formatFixed(66.8213, 2), '66.82');
    assert.equal(formatFixed(1234.56, 1), '1,234.6');
    assert.equal(formatFixed(999.996, 2), '1,000.00');
    assert.equal(formatFixed(4160.4, 0), '4,160');
    assert.equal(formatFixed(-0.001, 2), '0.00');
    assert.equal(formatUpTo(1234.5, 3), '1,234.5');
    assert.equal(formatUpTo(37.5, 1), '37.5');
    assert.equal(formatUpTo(20, 2), '20');
    assert.equal(formatEntered(1500), '1,500');
    assert.equal(formatEntered(0.85), '0.85');
    assert.equal(formatEntered(-40), '-40');
  });

  it('small values stay fixed-point; nothing uses exponential notation', () => {
    assert.equal(formatSignificant(0.000005186, 4), '0.000005186');
    assert.equal(formatSignificant(15900, 4), '15,900');
    assert.equal(formatSignificant(1.59, 4), '1.590');
    assert.equal(formatEntered(0.0000001), '0.0000001');
    const samples = [
      formatSignificant(2.5e7, 4),
      formatSignificant(1.234e-9, 4),
      formatFixed(1e21, 2),
      formatUpTo(3e22, 1),
      formatEntered(1e21),
      formatEntered(1e-7),
    ];
    for (const text of samples) assert.ok(!/e[+-]?\d/i.test(text), text);
    assert.equal(formatFixed(1e21, 0), '1,000,000,000,000,000,000,000');
  });

  it('wire resistance results: no exponential notation at the range limits', () => {
    // 2000 kcmil copper over 1 ft at −40 °F: one conductor of a few µΩ, still fixed-point
    const tiny = wireResistance('2000', 'Cu', 1, -40);
    assert.ok(tiny);
    assert.match(formatSignificant(tiny.conductorOhms, 4), /^0\.00000\d{4}$/);
    // a long run's figure: grouped, one decimal
    assert.match(formatFixed(12345678.9, 1), /^\d{1,3}(,\d{3})+\.\d$/);
  });
});

describe('number format in results (step 3)', () => {
  const ok = (r: PowerResult | PowerFailure): PowerResult => {
    assert.ok(!isPowerError(r));
    return r;
  };

  it("chat's cases get thousands separators with the same decimals", () => {
    // volts to amps: 10,000,000 W at 240 V, PF 1
    assert.equal(formatFixed(ok(fromRealPower({ watts: 1e7, volts: 240, circuit: 'single', pf: 1 })).amps, 2), '41,666.67');
    // kilowatts to amps: 10,000,000 kW at 480 V three-phase, PF 0.85
    assert.equal(formatFixed(ok(fromRealPower({ watts: 1e10, volts: 480, circuit: 'three', pf: 0.85 })).amps, 2), '14,150,741.89');
    // kVA to amps: 10,000,000 kVA at 480 V three-phase
    assert.equal(formatFixed(ok(fromApparentPower({ va: 1e10, volts: 480, circuit: 'three', pf: 0.85 })).amps, 2), '12,028,130.61');
    // amps to watts: 100 A at 240 V three-phase, PF 0.92
    const w = ok(fromCurrent({ amps: 100, volts: 240, circuit: 'three', pf: 0.92 }));
    assert.equal(formatFixed(w.watts, 2), '38,243.68');
    assert.equal(formatFixed(w.va, 2), '41,569.22');
  });

  it('wire size steps group lengths; kcmil sizes keep no separator', () => {
    // chat's 320 px cases: 25 A, 1500 ft, 1 %, 120 V aluminum → 1500 kcmil; 400 A, 50 ft aluminum → 1250 kcmil
    const result = sizeConductor({ ocpdA: 25, loadA: 25, lengthFt: 1500, volts: 120, phase: 'single', material: 'Al', vdTargetPct: 1 });
    assert.ok(!isSizingError(result));
    assert.equal(formatSize(result.size), '1500 kcmil');
    assert.ok(result.steps.some((step) => step.includes('over 1,500 ft one way')), result.steps.join(' | '));
    assert.ok(result.steps.every((step) => !/\d,\d{3} kcmil/.test(step) && !/e[+-]\d/.test(step)), result.steps.join(' | '));
    const large = sizeConductor({ ocpdA: 400, lengthFt: 50, volts: 240, phase: 'single', material: 'Al' });
    assert.ok(!isSizingError(large));
    assert.equal(formatSize(large.size), '1250 kcmil');
  });
});
