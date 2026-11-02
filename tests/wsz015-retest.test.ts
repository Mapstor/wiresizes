// WSZ-015: the pure parts of the fixes from chat's re-test of the WSZ-014 build: the voltage-drop ampacity note and
// the over-100 % guard, the wire resistance input ranges, and the number formatter.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatEntered, formatFixed, formatSignificant, formatUpTo } from '../src/lib/calculations/format';
import {
  maxLengthFt,
  RESISTANCE_INPUT_MESSAGES,
  resistanceInputErrors,
  wireResistance,
} from '../src/lib/calculations/resistance';
import type { ResistanceField } from '../src/lib/calculations/resistance';
import {
  ampacityExceeded,
  ampacityNote,
  DROP_EXCEEDS_SUPPLY_MESSAGE,
  dropExceedsSupply,
  voltageDrop,
  WIRE_SIZE_CALCULATOR_LINK,
} from '../src/lib/calculations/voltage-drop';
import type { VoltageDropResult } from '../src/lib/calculations/voltage-drop';

const noteText = (...args: Parameters<typeof ampacityNote>) => {
  const note = ampacityNote(...args);
  return note.before + note.link + note.after;
};

describe('voltage drop: current above the 60 °C ampacity', () => {
  it('14 AWG copper: no note at 15 A, a note at 16 A', () => {
    assert.equal(ampacityExceeded('14', 'Cu', 15), null);
    assert.equal(ampacityExceeded('14', 'Cu', 16), 15);
    assert.equal(
      noteText('14', 'Cu', 15),
      'This current is more than the 60 °C ampacity of 14 AWG copper (15 A, NEC Table 310.16). Choose the size with the wire size calculator first.',
    );
  });

  it('aluminum uses al_60 and the kcmil size as the result panel writes it', () => {
    assert.equal(ampacityExceeded('500', 'Al', 260), null);
    assert.equal(ampacityExceeded('500', 'Al', 261), 260);
    assert.equal(
      noteText('500', 'Al', 260),
      'This current is more than the 60 °C ampacity of 500 kcmil aluminum (260 A, NEC Table 310.16). Choose the size with the wire size calculator first.',
    );
  });

  it('no note where Table 310.16 has no 60 °C value (14 AWG aluminum)', () => {
    assert.equal(ampacityExceeded('14', 'Al', 100), null);
  });

  it('the link goes to the wire size calculator', () => {
    assert.deepEqual(WIRE_SIZE_CALCULATOR_LINK, { href: '/calculators/wire-size-calculator', text: 'wire size calculator' });
    assert.equal(ampacityNote('14', 'Cu', 15).link, 'wire size calculator');
  });
});

describe('voltage drop: drop at or above the supply voltage', () => {
  it('14 AWG copper, 200 A, 1000 ft, 240 V: the message replaces the figures', () => {
    const result = voltageDrop({ size: '14', material: 'Cu', amps: 200, lengthFt: 1000, volts: 240, phase: 'single' });
    assert.ok(result);
    assert.ok(Math.abs(result.vdPct - 510.83) < 0.01, `vdPct ${result.vdPct}`);
    assert.ok(result.loadVolts < 0);
    assert.equal(dropExceedsSupply(result), true);
    assert.equal(
      DROP_EXCEEDS_SUPPLY_MESSAGE,
      'The calculated drop is larger than the supply voltage. Choose a larger size, a shorter run or a lower current.',
    );
  });

  it('the guard starts at 100 %', () => {
    const at = (vdPct: number): VoltageDropResult => ({ ohmsPer1000ft: 1, vdVolts: vdPct * 2.4, vdPct, loadVolts: 240 - vdPct * 2.4, powerLossW: 0 });
    assert.equal(dropExceedsSupply(at(99.99)), false);
    assert.equal(dropExceedsSupply(at(100)), true);
  });

  it('the defaults (10 AWG, 20 A, 100 ft, 240 V) show figures and no note', () => {
    const result = voltageDrop({ size: '10', material: 'Cu', amps: 20, lengthFt: 100, volts: 240, phase: 'single' });
    assert.ok(result);
    assert.equal(dropExceedsSupply(result), false);
    assert.equal(ampacityExceeded('10', 'Cu', 20), null);
    assert.equal(ampacityExceeded('10', 'Al', 20), null);
  });
});

describe('wire resistance: input ranges', () => {
  const values = (patch: Partial<Record<ResistanceField, number>>): Record<ResistanceField, number> => ({
    lengthFt: 100,
    tempF: 68,
    amps: 20,
    maxLoopOhms: 0.5,
    ...patch,
  });

  it('temperature from −40 °F to 200 °F; empty is invalid and has the message', () => {
    for (const tempF of [-40, 200]) assert.equal(resistanceInputErrors('resistance', values({ tempF })).tempF, undefined, `${tempF} °F`);
    for (const tempF of [-41, 201, Number.NaN]) {
      assert.equal(resistanceInputErrors('resistance', values({ tempF })).tempF, 'Enter a temperature from −40 °F to 200 °F.', `${tempF} °F`);
    }
    // every mode checks the temperature
    assert.equal(resistanceInputErrors('distance', values({ tempF: 201 })).tempF, RESISTANCE_INPUT_MESSAGES.tempF);
    assert.equal(resistanceInputErrors('power', values({ tempF: -41 })).tempF, RESISTANCE_INPUT_MESSAGES.tempF);
  });

  it('one-way distance from 1 ft to 5000 ft in the modes that have it', () => {
    for (const lengthFt of [1, 5000]) assert.equal(resistanceInputErrors('resistance', values({ lengthFt })).lengthFt, undefined, `${lengthFt} ft`);
    for (const lengthFt of [0.5, 5001, Number.NaN]) {
      assert.equal(resistanceInputErrors('resistance', values({ lengthFt })).lengthFt, 'Enter a one-way distance from 1 ft to 5000 ft.', `${lengthFt} ft`);
      assert.equal(resistanceInputErrors('power', values({ lengthFt })).lengthFt, RESISTANCE_INPUT_MESSAGES.lengthFt, `${lengthFt} ft`);
    }
    // the distance mode has no distance field
    assert.deepEqual(resistanceInputErrors('distance', values({ lengthFt: 10_000_000 })), {});
  });

  it('Power Loss Analysis: one message per field', () => {
    assert.deepEqual(resistanceInputErrors('power', values({ lengthFt: 0, amps: 0 })), {
      lengthFt: 'Enter a one-way distance from 1 ft to 5000 ft.',
      amps: 'Enter a current greater than 0 A.',
    });
    assert.deepEqual(resistanceInputErrors('power', values({})), {});
  });

  it('maximum loop resistance keeps its message', () => {
    assert.equal(resistanceInputErrors('distance', values({ maxLoopOhms: 0 })).maxLoopOhms, 'Enter a loop resistance greater than 0 Ω.');
    assert.deepEqual(resistanceInputErrors('distance', values({ maxLoopOhms: 0.001 })), {});
  });
});

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
    // the longest run of a large loop resistance: grouped, one decimal
    const far = maxLengthFt('2000', 'Cu', 20, 100);
    assert.ok(far !== null && far > 1e6);
    assert.match(formatFixed(far, 1), /^\d{1,3}(,\d{3})+\.\d$/);
  });
});
