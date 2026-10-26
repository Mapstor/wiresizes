// WSZ-014: the pure parts of the calculator form behaviour: number fields kept as text, share-link parsing and
// writing, and the per-field power input messages.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '../src/lib/calculations/fields';
import { POWER_ERROR_MESSAGES, powerInputErrors, hasPowerInputError } from '../src/lib/calculations/power';

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
