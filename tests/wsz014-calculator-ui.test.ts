// WSZ-014: the pure parts of the calculator form behaviour: number fields kept as text, share-link parsing and
// writing, and the per-field power input messages.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '../src/lib/calculations/fields';
import {
  POWER_ERROR_MESSAGES,
  POWER_FACTOR_NAMEPLATE_NOTE,
  powerInputErrors,
  hasPowerInputError,
  VOLTS_TO_AMPS_DEFAULTS,
} from '../src/lib/calculations/power';
import { formatVdPct, formatVdVolts, NO_14_AWG_ALUMINUM_NOTE, VD_HEADLINE_LABELS, voltageDrop } from '../src/lib/calculations/voltage-drop';
import { RESISTANCE_INPUT_MESSAGES } from '../src/lib/calculations/resistance';
import { calculateAmpacity, formatFactor } from '../src/lib/calculations/ampacity';
import { DC_SIZING_DEFAULTS } from '../src/lib/calculations/dc-sizing';

describe('number fields', () => {
  it('empty or blank text is NaN, numbers parse', () => {
    assert.ok(Number.isNaN(fieldNumber('')));
    assert.ok(Number.isNaN(fieldNumber('  ')));
    assert.equal(fieldNumber('12.5'), 12.5);
    assert.equal(fieldNumber('0'), 0);
    assert.equal(fieldNumber('-3'), -3);
  });
});

describe('share links', () => {
  it('numberParam takes the first finite number among its keys', () => {
    const params = new URLSearchParams('distance=150&length=abc');
    assert.equal(numberParam(params, 'length', 'distance'), '150');
    assert.equal(numberParam(params, 'missing'), null);
    assert.equal(numberParam(new URLSearchParams('x='), 'x'), null);
    assert.equal(numberParam(new URLSearchParams('x=Infinity'), 'x'), null);
  });

  it('choiceParam accepts only listed values', () => {
    const params = new URLSearchParams('rating=30&phase=three&target=7');
    assert.equal(choiceParam(params, 'rating', [15, 20, 30]), 30);
    assert.equal(choiceParam(params, 'phase', ['single', 'three']), 'three');
    assert.equal(choiceParam(params, 'target', [1, 2, 3, 4, 5]), null);
    assert.equal(choiceParam(params, 'missing', ['a']), null);
  });

  it('buildQuery leaves out empty values and keeps the order', () => {
    assert.equal(buildQuery({ rating: 20, load: '', length: '50', note: null, on: true }), 'rating=20&length=50&on=true');
  });
});

describe('power inputs', () => {
  it('reports every invalid field at once', () => {
    const errors = powerInputErrors({ value: Number.NaN, volts: 277, circuit: 'three', pf: 1.2 });
    assert.equal(errors.value, POWER_ERROR_MESSAGES['value-invalid']);
    assert.equal(errors.volts, POWER_ERROR_MESSAGES['voltage-invalid']);
    assert.equal(errors.pf, POWER_ERROR_MESSAGES['power-factor-invalid']);
    assert.ok(hasPowerInputError(errors));
  });

  it('valid inputs have no messages; DC ignores the power factor', () => {
    assert.ok(!hasPowerInputError(powerInputErrors({ value: 1000, volts: 240, circuit: 'single', pf: 0.9 })));
    assert.ok(!hasPowerInputError(powerInputErrors({ value: 20, volts: 12, circuit: 'dc', pf: Number.NaN })));
  });
});

describe('WSZ-014 step 3 texts and formats', () => {
  it('voltage drop headline labels and formats; no 14 AWG aluminum result', () => {
    assert.deepEqual(VD_HEADLINE_LABELS, { Cu: 'Copper:', Al: 'Aluminum:' });
    assert.equal(formatVdPct(2.0234), '2.02 %');
    assert.equal(formatVdVolts(4.8561), '4.86 V');
    assert.equal(NO_14_AWG_ALUMINUM_NOTE, 'NEC Table 310.16 lists aluminum from 12 AWG, so there is no 14 AWG aluminum result.');
    assert.equal(voltageDrop({ size: '14', material: 'Al', amps: 10, lengthFt: 50, volts: 120, phase: 'single' }), null);
    assert.notEqual(voltageDrop({ size: '14', material: 'Cu', amps: 10, lengthFt: 50, volts: 120, phase: 'single' }), null);
  });

  it('ampacity: factors with two decimals; no 14 AWG aluminum value', () => {
    assert.equal(formatFactor(1), '1.00');
    assert.equal(formatFactor(1.2), '1.20');
    assert.equal(formatFactor(0.82), '0.82');
    assert.equal(formatFactor(null), '–');
    const al14 = calculateAmpacity({ size: '14', material: 'Al', column: 60, ambientRow: '26–30', band: '1–3' });
    assert.equal(al14.tableAmpacity, null);
  });

  it('wire resistance: one message per field (WSZ-015 replaced the per-mode messages)', () => {
    assert.deepEqual(RESISTANCE_INPUT_MESSAGES, {
      lengthFt: 'Enter a one-way distance from 1 ft to 5000 ft.',
      tempF: 'Enter a temperature from −40 °F to 200 °F.',
      amps: 'Enter a current greater than 0 A.',
      maxLoopOhms: 'Enter a loop resistance greater than 0 Ω.',
    });
  });

  it('low voltage: the default target is one of the 1–5 % choices', () => {
    assert.equal(DC_SIZING_DEFAULTS.dropPct, 3);
  });

  it('volts to amps: no load type; the power factor note', () => {
    assert.ok(!('loadType' in VOLTS_TO_AMPS_DEFAULTS));
    assert.equal(
      POWER_FACTOR_NAMEPLATE_NOTE,
      'Enter the power factor from the equipment nameplate. Resistive loads such as heaters have a power factor of 1.',
    );
  });
});
