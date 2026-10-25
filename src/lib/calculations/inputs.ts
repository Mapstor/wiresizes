// Input rules shared by the calculators: volts must be greater than 0, three-phase is allowed only at the
// line-to-line voltages 208, 240, 480 and 600 V, and power factor must be greater than 0 and at most 1.

export type Phase = 'single' | 'three';

export const SINGLE_PHASE_VOLTS = [120, 208, 240, 277, 480];
export const THREE_PHASE_VOLTS = [208, 240, 480, 600];

/** Voltage that applies after switching phase: an invalid voltage resets to 240 V. */
export const PHASE_SWITCH_VOLTS = 240;

export const VOLTAGE_INVALID_MESSAGE =
  'Enter a voltage above 0 V. Three-phase uses the line-to-line voltages 208, 240, 480 or 600 V.';
export const POWER_FACTOR_INVALID_MESSAGE = 'Power factor must be greater than 0 and at most 1.';

export function voltsValid(volts: number, phase: Phase | 'dc'): boolean {
  if (!Number.isFinite(volts) || volts <= 0) return false;
  if (phase === 'three') return THREE_PHASE_VOLTS.includes(volts);
  return true;
}

export function powerFactorValid(pf: number): boolean {
  return Number.isFinite(pf) && pf > 0 && pf <= 1;
}

export function voltageOptions(phase: Phase): number[] {
  return phase === 'three' ? THREE_PHASE_VOLTS : SINGLE_PHASE_VOLTS;
}

/** Voltage to keep when the phase changes: the current value if it is on the new phase's list, else 240 V. */
export function voltsAfterPhaseChange(volts: number, phase: Phase): number {
  return voltageOptions(phase).includes(volts) ? volts : PHASE_SWITCH_VOLTS;
}
