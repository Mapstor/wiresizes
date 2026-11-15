// WSZ-014: the pure parts of the calculator form behaviour: number fields kept as text, share-link parsing and
// writing, and the per-field power input messages.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '../src/lib/calculations/fields';
import { NO_14_AWG_ALUMINUM_NOTE, voltageDrop } from '../src/lib/calculations/voltage-drop';
import { calculateAmpacity, formatFactor } from '../src/lib/calculations/ampacity';

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

describe('WSZ-014 step 3 texts and formats', () => {
  it('no 14 AWG aluminum voltage drop result', () => {
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
});
