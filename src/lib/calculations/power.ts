// Power and current for DC, single-phase and balanced three-phase loads (three-phase on line-to-line voltage):
// I = P ÷ (V × PF) single-phase, I = P ÷ (√3 × V × PF) three-phase, DC with PF 1;
// I = S ÷ V or S ÷ (√3 × V) from apparent power; P = V × I × PF or √3 × V × I × PF;
// S = P ÷ PF, Q = √(S² − P²). Power factor correction: Qc = P × (tan φ1 − tan φ2), current reduction = 1 − PF1 ÷ PF2.
import { powerFactorValid, voltsValid, POWER_FACTOR_INVALID_MESSAGE, VOLTAGE_INVALID_MESSAGE } from './inputs';
import type { Phase } from './inputs';

export const ENGINE_ID = 'power';
export const DOMAINS = ['power-definitions'];

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

/** Power, apparent power or current: a finite number greater than 0. */
export function powerValueValid(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function check(value: number, volts: number, circuit: Circuit, pf: number): PowerError | null {
  if (!powerValueValid(value)) return 'value-invalid';
  if (!voltsValid(volts, circuit)) return 'voltage-invalid';
  if (!powerFactorValid(pf)) return 'power-factor-invalid';
  return null;
}

export interface PowerInputErrors {
  value: string | null;
  volts: string | null;
  pf: string | null;
}

/** The message for each invalid input at once (the calculations stop at the first); DC has no power factor. */
export function powerInputErrors(input: { value: number; volts: number; circuit: Circuit; pf: number }): PowerInputErrors {
  return {
    value: powerValueValid(input.value) ? null : POWER_ERROR_MESSAGES['value-invalid'],
    volts: voltsValid(input.volts, input.circuit) ? null : POWER_ERROR_MESSAGES['voltage-invalid'],
    pf: input.circuit === 'dc' || powerFactorValid(input.pf) ? null : POWER_ERROR_MESSAGES['power-factor-invalid'],
  };
}

export function hasPowerInputError(errors: PowerInputErrors): boolean {
  return errors.value !== null || errors.volts !== null || errors.pf !== null;
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

export interface PfCorrectionInput {
  /** Real power P in kW. */
  kw: number;
  /** The power factor to correct to. */
  pfTo: number;
  /** The present power factor, or kva: apparent power in kVA (PF = kW ÷ kVA). */
  pfFrom?: number;
  kva?: number;
}

export interface PfCorrectionResult {
  pfFrom: number;
  /** Capacitor reactive power Qc = P × (tan φ1 − tan φ2), in kVAR. */
  kvar: number;
  /** Line current reduction at the same real power and voltage: (1 − PF1 ÷ PF2) × 100. */
  currentReductionPct: number;
}

/** tan φ of a power factor: √(1 − PF²) ÷ PF. */
function tanPhi(pf: number): number {
  return Math.sqrt(1 - pf * pf) / pf;
}

/** Null unless P is above 0, both power factors are in (0, 1] and the target is not below the present one. */
export function pfCorrection(input: PfCorrectionInput): PfCorrectionResult | null {
  const pfFrom = input.pfFrom ?? (input.kva !== undefined ? input.kw / input.kva : Number.NaN);
  if (!powerValueValid(input.kw) || !powerFactorValid(pfFrom) || !powerFactorValid(input.pfTo) || input.pfTo < pfFrom) {
    return null;
  }
  return {
    pfFrom,
    kvar: input.kw * (tanPhi(pfFrom) - tanPhi(input.pfTo)),
    currentReductionPct: (1 - pfFrom / input.pfTo) * 100,
  };
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

export const VOLTS_TO_AMPS_DEFAULTS = {
  volts: 240,
  watts: 1000,
  phase: 'single' as Phase,
  pf: 1,
};
/** Under the volts-to-amps power factor input. */
export const POWER_FACTOR_NAMEPLATE_NOTE =
  'Enter the power factor from the equipment nameplate. Resistive loads such as heaters have a power factor of 1.';
export const VOLTS_TO_AMPS_COMPARISON_VOLTS = [120, 240, 480];

export const AMPS_TO_WATTS_DEFAULTS = { amps: 20, volts: 120, circuit: 'single' as Circuit, pf: 0.9 };

// ── The three-phase calculator (WSZ-006d; spec: research/page-specs.md "WSZ-006"): the line-to-line voltage plus any
// two of real power, apparent power, line current and power factor; the rest follows from S = √3 × V × I (MIT 6.061
// polyphase notes, eq. 56; DOE/GO-10097-517 Equation 1 with PF), P = S × PF (EIA Glossary) and Q = √(S² − P²) (reactive
// power at 90° to real power, DOE/GO-10096-286). Any voltage the reader measures or names is allowed; the nominal ones
// are buttons. A target power factor adds the capacitor that reaches it at the same real power.

/** √3, the ratio of line-to-line to line-to-neutral voltage in a balanced three-phase set. */
export const SQRT3 = Math.sqrt(3);

/** The pairs of known values the calculator accepts (with the voltage). kVA and amps together fix each other at a voltage. */
export const TP_KNOWN = ['kw-pf', 'kva-pf', 'amps-pf', 'kw-kva', 'kw-amps'] as const;
export type TpKnown = (typeof TP_KNOWN)[number];

/** Significant figures of the calculator's results: the spec's golden values carry four (66.82 A, 42.13 kVAR, 15.79 %). */
export const TP_SIG = 4;
export const TP_VOLTS_MIN = 1;
export const TP_VOLTS_MAX = 100000;

/**
 * The nominal wye systems among the three-phase voltages (us-nominal-voltages: 208Y/120 and 480Y/277), as line-to-line
 * and line-to-neutral volts; the page checks this list against the registry when it builds.
 */
export const TP_WYE_SYSTEMS: { lineVolts: number; neutralVolts: number }[] = [
  { lineVolts: 208, neutralVolts: 120 },
  { lineVolts: 480, neutralVolts: 277 },
];

export interface TpInput {
  /** Line-to-line voltage, V. */
  volts: number;
  known: TpKnown;
  /** Real power, kW. */
  kw?: number;
  /** Apparent power, kVA. */
  kva?: number;
  /** Line current, A. */
  amps?: number;
  /** Power factor, 0 to 1. */
  pf?: number;
  /** The power factor to correct to, or null for none. */
  targetPf?: number | null;
}

export interface TpCorrection {
  targetPf: number;
  /** The capacitor bank's reactive power, kVAR: Q before − Q after at the same real power. */
  capKvar: number;
  kvarAfter: number;
  kvaAfter: number;
  ampsAfter: number;
  /** (1 − PF ÷ target) × 100. */
  currentDownPct: number;
}

export interface TpResult {
  input: TpInput;
  volts: number;
  amps: number;
  kw: number;
  kva: number;
  kvar: number;
  pf: number;
  /** V ÷ √3: the line-to-neutral voltage a wye system at this line-to-line voltage has. */
  lineToNeutral: number;
  /** The nominal wye system the voltage names, if it names one. */
  wye: { lineVolts: number; neutralVolts: number } | null;
  /** 'none': no target; 'at-or-above': the power factor already meets the target; 'applied': see correction. */
  correctionState: 'none' | 'at-or-above' | 'applied';
  correction: TpCorrection | null;
}

/** 'input-invalid': a value the pair needs is missing or out of range; 'kw-above-kva': real power above apparent power. */
export type TpError = 'input-invalid' | 'kw-above-kva';

const positive = (v: number | undefined): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0;

/** Reactive power of P at a power factor: P × √(1 ÷ PF² − 1), which is √(S² − P²) with S = P ÷ PF. */
export function kvarAt(kw: number, pf: number): number {
  return kw * Math.sqrt(Math.max(0, 1 / (pf * pf) - 1));
}

/** Line current of an apparent power at a line-to-line voltage: I = S ÷ (√3 × V), with S in kVA. */
export function ampsFromKva(kva: number, volts: number): number {
  return (kva * 1000) / (SQRT3 * volts);
}

/** Apparent power of a line current at a line-to-line voltage: S = √3 × V × I ÷ 1000, in kVA. */
export function kvaFromAmps(amps: number, volts: number): number {
  return (SQRT3 * volts * amps) / 1000;
}

/** Everything about a balanced three-phase load from its line-to-line voltage and two known values. */
export function threePhase(input: TpInput): TpResult | { error: TpError } {
  const { volts, known } = input;
  if (!(Number.isFinite(volts) && volts >= TP_VOLTS_MIN && volts <= TP_VOLTS_MAX)) return { error: 'input-invalid' };
  if (!TP_KNOWN.includes(known)) return { error: 'input-invalid' };
  const needsPf = known === 'kw-pf' || known === 'kva-pf' || known === 'amps-pf';
  if (needsPf && !(positive(input.pf) && powerFactorValid(input.pf))) return { error: 'input-invalid' };
  let kw: number;
  let kva: number;
  let pf: number;
  switch (known) {
    case 'kw-pf':
      if (!positive(input.kw)) return { error: 'input-invalid' };
      pf = input.pf as number;
      kw = input.kw;
      kva = kw / pf;
      break;
    case 'kva-pf':
      if (!positive(input.kva)) return { error: 'input-invalid' };
      pf = input.pf as number;
      kva = input.kva;
      kw = kva * pf;
      break;
    case 'amps-pf':
      if (!positive(input.amps)) return { error: 'input-invalid' };
      pf = input.pf as number;
      kva = kvaFromAmps(input.amps, volts);
      kw = kva * pf;
      break;
    case 'kw-kva':
      if (!positive(input.kw) || !positive(input.kva)) return { error: 'input-invalid' };
      kw = input.kw;
      kva = input.kva;
      if (kw > kva * (1 + 1e-9)) return { error: 'kw-above-kva' };
      pf = Math.min(1, kw / kva);
      break;
    case 'kw-amps':
      if (!positive(input.kw) || !positive(input.amps)) return { error: 'input-invalid' };
      kw = input.kw;
      kva = kvaFromAmps(input.amps, volts);
      if (kw > kva * (1 + 1e-9)) return { error: 'kw-above-kva' };
      pf = Math.min(1, kw / kva);
      break;
  }
  const amps = known === 'amps-pf' || known === 'kw-amps' ? (input.amps as number) : ampsFromKva(kva, volts);
  // a difference below rounding noise is no reactive power (PF 1)
  const diff = kva * kva - kw * kw;
  const kvar = diff <= kva * kva * 1e-12 ? 0 : Math.sqrt(diff);
  const target = input.targetPf ?? null;
  if (target !== null && !(positive(target) && powerFactorValid(target))) return { error: 'input-invalid' };
  let correctionState: TpResult['correctionState'] = 'none';
  let correction: TpCorrection | null = null;
  if (target !== null) {
    if (pf >= target) {
      correctionState = 'at-or-above';
    } else {
      const c = pfCorrection({ kw, pfFrom: pf, pfTo: target });
      if (!c) return { error: 'input-invalid' };
      const kvaAfter = kw / target;
      correctionState = 'applied';
      correction = {
        targetPf: target,
        capKvar: c.kvar,
        kvarAfter: kvarAt(kw, target),
        kvaAfter,
        ampsAfter: ampsFromKva(kvaAfter, volts),
        currentDownPct: c.currentReductionPct,
      };
    }
  }
  return {
    input,
    volts,
    amps,
    kw,
    kva,
    kvar,
    pf,
    lineToNeutral: volts / SQRT3,
    wye: TP_WYE_SYSTEMS.find((w) => w.lineVolts === volts) ?? null,
    correctionState,
    correction,
  };
}

export function isTpError(r: TpResult | { error: TpError }): r is { error: TpError } {
  return 'error' in r;
}

// ── The converters (WSZ-007b; spec: research/page-specs.md "WSZ-007"): kilowatts or kVA to amps on a single-phase or a
// balanced three-phase circuit, and volts to amps from power or from resistance. Three-phase runs through threePhase(), so
// the converters and the three-phase calculator give the same numbers; single-phase uses S = V × I (EIA Glossary: apparent
// power is volts times amperes) and P = S × PF. From resistance it is Ohm's law, I = V ÷ R (NIST SP 330: the ohm is a volt
// per ampere), with P = V × I (the watt is a volt-ampere).

export type ConvPhases = 1 | 3;
export const CONV_PHASES = [1, 3] as const;
/** Largest power, apparent power or resistance a converter takes. */
export const CONV_VALUE_MAX = 1000000;

export interface ConvInput {
  phases: ConvPhases;
  /** Line-to-line voltage on three-phase, V. */
  volts: number;
  /** Real power in kW with its power factor, or apparent power in kVA (the power factor optional). */
  known: 'kw-pf' | 'kva';
  kw?: number;
  kva?: number;
  pf?: number | null;
}

export interface ConvResult {
  input: ConvInput;
  phases: ConvPhases;
  volts: number;
  /** Current in each line, A. */
  amps: number;
  kva: number;
  /** Real and reactive power and power factor; null when apparent power came without a power factor. */
  kw: number | null;
  kvar: number | null;
  pf: number | null;
  /** Three-phase only: V ÷ √3 and the nominal wye system the voltage names, if any. */
  lineToNeutral: number | null;
  wye: { lineVolts: number; neutralVolts: number } | null;
}

/** Current of an apparent power in kVA: S ÷ V single-phase, S ÷ (√3 × V) three-phase. */
export function ampsOf(kva: number, volts: number, phases: ConvPhases): number {
  return phases === 3 ? ampsFromKva(kva, volts) : (kva * 1000) / volts;
}

/** Amps, kVA and, with a power factor, kW and kVAR of a load on a single-phase or balanced three-phase circuit. */
export function convertToAmps(input: ConvInput): ConvResult | { error: 'input-invalid' } {
  const { phases, volts, known } = input;
  if (!CONV_PHASES.includes(phases)) return { error: 'input-invalid' };
  if (!(Number.isFinite(volts) && volts >= TP_VOLTS_MIN && volts <= TP_VOLTS_MAX)) return { error: 'input-invalid' };
  const pf = input.pf ?? null;
  if (pf !== null && !(positive(pf) && powerFactorValid(pf))) return { error: 'input-invalid' };
  const value = known === 'kw-pf' ? input.kw : input.kva;
  if (!positive(value) || value > CONV_VALUE_MAX) return { error: 'input-invalid' };
  if (known === 'kw-pf' && pf === null) return { error: 'input-invalid' };
  if (known !== 'kw-pf' && known !== 'kva') return { error: 'input-invalid' };
  if (phases === 3 && pf !== null) {
    const r = threePhase(known === 'kw-pf' ? { volts, known: 'kw-pf', kw: value, pf } : { volts, known: 'kva-pf', kva: value, pf });
    if (isTpError(r)) return { error: 'input-invalid' };
    return { input, phases, volts, amps: r.amps, kva: r.kva, kw: r.kw, kvar: r.kvar, pf: r.pf, lineToNeutral: r.lineToNeutral, wye: r.wye };
  }
  const kva = known === 'kw-pf' ? value / (pf as number) : value;
  const kw = pf === null ? null : known === 'kw-pf' ? value : value * pf;
  return {
    input,
    phases,
    volts,
    amps: ampsOf(kva, volts, phases),
    kva,
    kw,
    kvar: kw === null || pf === null ? null : kvarAt(kw, pf),
    pf,
    lineToNeutral: phases === 3 ? volts / SQRT3 : null,
    wye: phases === 3 ? (TP_WYE_SYSTEMS.find((w) => w.lineVolts === volts) ?? null) : null,
  };
}

export function isConvError(r: ConvResult | { error: 'input-invalid' }): r is { error: 'input-invalid' } {
  return 'error' in r;
}

/** The same load's current at other voltages of its circuit: the apparent power held, I = S ÷ V or S ÷ (√3 × V). */
export function ampsAtVolts(r: ConvResult, voltages: readonly number[]): { volts: number; amps: number }[] {
  return voltages.map((volts) => ({ volts, amps: ampsOf(r.kva, volts, r.phases) }));
}

export interface OhmResult {
  volts: number;
  ohms: number;
  /** I = V ÷ R, A. */
  amps: number;
  /** P = V × I, W. */
  watts: number;
}

/** Ohm's law: the current through a resistance R at a voltage V, and the power it takes. */
export function ampsFromResistance(volts: number, ohms: number): OhmResult | { error: 'input-invalid' } {
  if (!(Number.isFinite(volts) && volts >= TP_VOLTS_MIN && volts <= TP_VOLTS_MAX)) return { error: 'input-invalid' };
  if (!positive(ohms) || ohms > CONV_VALUE_MAX) return { error: 'input-invalid' };
  const amps = volts / ohms;
  return { volts, ohms, amps, watts: volts * amps };
}

export function isOhmError(r: OhmResult | { error: 'input-invalid' }): r is { error: 'input-invalid' } {
  return 'error' in r;
}

/** The reverse: power from the current (WSZ-007c, amps to watts). S = V × I single-phase, √3 × V × I three-phase; P = S × PF. */
export interface FromAmpsInput {
  phases: ConvPhases;
  volts: number;
  amps: number;
  pf: number;
}

export function convertFromAmps(input: FromAmpsInput): ConvResult | { error: 'input-invalid' } {
  const { phases, volts, amps, pf } = input;
  if (!CONV_PHASES.includes(phases)) return { error: 'input-invalid' };
  if (!(Number.isFinite(volts) && volts >= TP_VOLTS_MIN && volts <= TP_VOLTS_MAX)) return { error: 'input-invalid' };
  if (!positive(amps) || amps > CONV_VALUE_MAX) return { error: 'input-invalid' };
  if (!(positive(pf) && powerFactorValid(pf))) return { error: 'input-invalid' };
  const kva = phases === 3 ? kvaFromAmps(amps, volts) : (volts * amps) / 1000;
  const kw = kva * pf;
  return {
    input: { phases, volts, known: 'kva', kva, pf },
    phases,
    volts,
    amps,
    kva,
    kw,
    kvar: kvarAt(kw, pf),
    pf,
    lineToNeutral: phases === 3 ? volts / SQRT3 : null,
    wye: phases === 3 ? (TP_WYE_SYSTEMS.find((w) => w.lineVolts === volts) ?? null) : null,
  };
}
