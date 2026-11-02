// WSZ-015: the pure parts of the fixes from chat's re-test of the WSZ-014 build: the voltage-drop ampacity note and
// the over-100 % guard.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
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
