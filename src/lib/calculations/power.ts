// Power and current for DC, single-phase and balanced three-phase loads (three-phase on line-to-line voltage):
// I = P ÷ (V × PF) single-phase, I = P ÷ (√3 × V × PF) three-phase, DC with PF 1;
// I = S ÷ V or S ÷ (√3 × V) from apparent power; P = V × I × PF or √3 × V × I × PF;
// S = P ÷ PF, Q = √(S² − P²).
import { powerFactorValid, voltsValid, POWER_FACTOR_INVALID_MESSAGE, VOLTAGE_INVALID_MESSAGE } from './inputs';
import type { Phase } from './inputs';

export type Circuit = Phase | 'dc';

export type PowerError = 'value-invalid' | 'voltage-invalid' | 'power-factor-invalid';

export const POWER_ERROR_MESSAGES: Record<PowerError, string> = {
  'value-invalid': 'Enter a value greater than 0.',
  'voltage-invalid': VOLTAGE_INVALID_MESSAGE,
  'power-factor-invalid': POWER_FACTOR_INVALID_MESSAGE,
};

export interface PowerResult {
  amps: number;
  /** Real power P, W. */
  watts: number;
  /** Apparent power S, VA. */
  va: number;
  /** Reactive power Q, var. */
  vars: number;
  pf: number;
}

export interface PowerFailure {
  error: PowerError;
}

export function isPowerError(result: PowerResult | PowerFailure): result is PowerFailure {
  return 'error' in result;
}

/** √3 for three-phase, 1 otherwise. */
export function phaseMultiplier(circuit: Circuit): number {
  return circuit === 'three' ? Math.sqrt(3) : 1;
}

function check(value: number, volts: number, circuit: Circuit, pf: number): PowerError | null {
  if (!(Number.isFinite(value) && value > 0)) return 'value-invalid';
  if (!voltsValid(volts, circuit)) return 'voltage-invalid';
  if (!powerFactorValid(pf)) return 'power-factor-invalid';
  return null;
}

function result(amps: number, watts: number, va: number, pf: number): PowerResult {
  return { amps, watts, va, vars: Math.sqrt(Math.max(0, va * va - watts * watts)), pf };
}

export interface PowerInput {
  volts: number;
  circuit: Circuit;
  /** Ignored for DC (PF 1). */
  pf?: number;
}

/** From real power P in watts. */
export function fromRealPower(input: PowerInput & { watts: number }): PowerResult | PowerFailure {
  const pf = input.circuit === 'dc' ? 1 : (input.pf ?? 1);
  const error = check(input.watts, input.volts, input.circuit, pf);
  if (error) return { error };
  const amps = input.watts / (phaseMultiplier(input.circuit) * input.volts * pf);
  return result(amps, input.watts, input.watts / pf, pf);
}

/** From apparent power S in volt-amperes. */
export function fromApparentPower(input: PowerInput & { va: number }): PowerResult | PowerFailure {
  const pf = input.circuit === 'dc' ? 1 : (input.pf ?? 1);
  const error = check(input.va, input.volts, input.circuit, pf);
  if (error) return { error };
  const amps = input.va / (phaseMultiplier(input.circuit) * input.volts);
  return result(amps, input.va * pf, input.va, pf);
}

/** From current in amperes. */
export function fromCurrent(input: PowerInput & { amps: number }): PowerResult | PowerFailure {
  const pf = input.circuit === 'dc' ? 1 : (input.pf ?? 1);
  const error = check(input.amps, input.volts, input.circuit, pf);
  if (error) return { error };
  const va = phaseMultiplier(input.circuit) * input.volts * input.amps;
  return result(input.amps, va * pf, va, pf);
}

export interface VoltageRow {
  volts: number;
  amps: number;
}

/**
 * Current at each listed voltage that is valid for the circuit (three-phase: line-to-line voltages only),
 * computed with the same formula as the headline result.
 */
export function currentByVoltage(
  basis: { watts: number } | { va: number },
  circuit: Circuit,
  pf: number,
  voltages: number[],
): VoltageRow[] {
  const rows: VoltageRow[] = [];
  for (const volts of voltages) {
    const r = 'watts' in basis
      ? fromRealPower({ watts: basis.watts, volts, circuit, pf })
      : fromApparentPower({ va: basis.va, volts, circuit, pf });
    if (!isPowerError(r)) rows.push({ volts, amps: r.amps });
  }
  return rows;
}

export const PHASE_OPTIONS: { value: Phase; label: string }[] = [
  { value: 'single', label: 'Single-phase' },
  { value: 'three', label: 'Three-phase' },
];

// Default and reset inputs of each converter
export const KILOWATTS_TO_AMPS_DEFAULTS = { kilowatts: 5, volts: 480, phase: 'three' as Phase, pf: 0.85 };
export const KILOWATTS_TO_AMPS_COMPARISON_VOLTS = [120, 208, 240, 480];

export const KVA_TO_AMPS_DEFAULTS = {
  kva: 50,
  volts: 480,
  phase: 'three' as Phase,
  pf: 0.85,
  isTransformer: false,
  primaryVolts: 480,
};
export const KVA_TO_AMPS_COMPARISON_VOLTS = [208, 240, 480];

export const WATTS_TO_AMPS_DEFAULTS = { watts: 1000, volts: 120, phase: 'single' as Phase, pf: 1 };

export type LoadType = 'resistive' | 'inductive' | 'mixed';
export const VOLTS_TO_AMPS_DEFAULTS = {
  volts: 240,
  watts: 1000,
  phase: 'single' as Phase,
  pf: 1,
  loadType: 'resistive' as LoadType,
};
export const VOLTS_TO_AMPS_COMPARISON_VOLTS = [120, 240, 480];

export const AMPS_TO_WATTS_DEFAULTS = { amps: 20, volts: 120, circuit: 'single' as Circuit, pf: 0.9 };

/** Three-phase systems by name, with the line-to-line voltage the converter uses. */
export const THREE_PHASE_SYSTEMS: { system: string; lineVolts: number }[] = [
  { system: '208Y/120V', lineVolts: 208 },
  { system: '240Δ/120V', lineVolts: 240 },
  { system: '480Y/277V', lineVolts: 480 },
  { system: '480Δ', lineVolts: 480 },
  { system: '600Y/347V', lineVolts: 600 },
];

export type ThreePhaseMode = 'power' | 'current';
export const THREE_PHASE_MODE_OPTIONS: { value: ThreePhaseMode; label: string }[] = [
  { value: 'power', label: 'Known Power (kW)' },
  { value: 'current', label: 'Known Current' },
];
export const THREE_PHASE_DEFAULTS = {
  system: '208Y/120V',
  mode: 'power' as ThreePhaseMode,
  kilowatts: 50,
  amps: 100,
  pf: 0.85,
};
