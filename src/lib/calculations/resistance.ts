// Conductor resistance R(T) = R20 × (1 + α(T − 20)) with R20 and α from data/verified/awg.json:
// copper R20 from HB100 (kcmil sizes calculated), α 0.00393; aluminum EC-H19 R20 calculated from HB109
// constants, α 0.00403, 12 AWG and larger. Power loss: 2·I²·R·L/1000 for DC or single-phase,
// 3·I²·R·L/1000 for three-phase (R in Ω per 1000 ft, L one way in ft), in watts.
import awgData from '../../../data/verified/awg.json';
import { conductor, TABLE_310_16_SIZES } from './sizes';
import type { Material, SizeKey } from './sizes';

export const COPPER_ALPHA = awgData.constants.copper_alpha_per_C_20C;
export const ALUMINUM_ALPHA = awgData.constants.aluminum_ECH19_alpha_per_C_20C;

export type ResistanceMode = 'resistance' | 'distance' | 'power';
export type CircuitType = 'dc' | 'single' | 'three';

/** Ω per 1000 ft at 20 °C, or null where awg.json has no value (aluminum below 12 AWG). */
export function r20(key: SizeKey, material: Material): number | null {
  const data = conductor(key);
  if (!data) return null;
  return material === 'Cu' ? data.r20Cu : data.r20Al;
}

export function alpha(material: Material): number {
  return material === 'Cu' ? COPPER_ALPHA : ALUMINUM_ALPHA;
}

/** Ω per 1000 ft at `tempC`. */
export function resistanceAt(key: SizeKey, material: Material, tempC: number): number | null {
  const base = r20(key, material);
  return base === null ? null : base * (1 + alpha(material) * (tempC - 20));
}

export function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

/** Table 310.16 sizes offered: copper from 14 AWG, aluminum from 12 AWG, both up to 2000 kcmil. */
export function resistanceSizes(material: Material): SizeKey[] {
  const first = TABLE_310_16_SIZES.indexOf(material === 'Cu' ? '14' : '12');
  return TABLE_310_16_SIZES.slice(first).filter((key) => r20(key, material) !== null);
}

export interface ResistanceResult {
  ohmsPer1000ft: number;
  /** One conductor over the one-way length. */
  conductorOhms: number;
  /** Out and back, two conductors. */
  loopOhms: number;
}

export function wireResistance(size: SizeKey, material: Material, lengthFt: number, tempC: number): ResistanceResult | null {
  const r = resistanceAt(size, material, tempC);
  if (r === null || !(lengthFt >= 0)) return null;
  const conductorOhms = (r * lengthFt) / 1000;
  return { ohmsPer1000ft: r, conductorOhms, loopOhms: 2 * conductorOhms };
}

/** Longest one-way run whose loop (out and back) resistance stays within `maxLoopOhms`. */
export function maxLengthFt(size: SizeKey, material: Material, tempC: number, maxLoopOhms: number): number | null {
  const r = resistanceAt(size, material, tempC);
  if (r === null || !(maxLoopOhms > 0)) return null;
  return (maxLoopOhms * 1000) / (2 * r);
}

export function powerLossWatts(amps: number, ohmsPer1000ft: number, lengthFt: number, circuit: CircuitType): number {
  const conductors = circuit === 'three' ? 3 : 2;
  return (conductors * amps * amps * ohmsPer1000ft * lengthFt) / 1000;
}

export const RESISTANCE_MODE_OPTIONS: { value: ResistanceMode; label: string; description: string }[] = [
  { value: 'resistance', label: 'Resistance from Wire Size', description: 'Calculate resistance for known wire and distance' },
  { value: 'distance', label: 'Distance from Resistance', description: 'Calculate maximum distance for resistance limit' },
  { value: 'power', label: 'Power Loss Analysis', description: 'Analyze power loss in conductor' },
];

export const CIRCUIT_OPTIONS: { value: CircuitType; label: string }[] = [
  { value: 'dc', label: 'DC Circuit' },
  { value: 'single', label: 'Single-Phase AC' },
  { value: 'three', label: 'Three-Phase' },
];

export const RESISTANCE_NOTES = [
  'R(T) = R20 × (1 + α × (T − 20 °C)). Copper: R20 from NIST Handbook 100 (kcmil sizes calculated), α = 0.00393. Aluminum EC-H19: R20 calculated from NIST Handbook 109 constants, α = 0.00403, 12 AWG and larger.',
  'Power loss: 2 × I² × R × L ÷ 1000 for DC or single-phase, 3 × I² × R × L ÷ 1000 for three-phase (R in Ω per 1000 ft, L one way in ft).',
];

/** The message for an invalid input in each mode. */
export const RESISTANCE_INPUT_MESSAGES: Record<ResistanceMode, string> = {
  resistance: 'Enter a one-way distance greater than 0 ft.',
  distance: 'Enter a loop resistance greater than 0 Ω.',
  power: 'Enter a one-way distance and a current greater than 0.',
};

export const RESISTANCE_DEFAULTS = {
  mode: 'resistance' as ResistanceMode,
  size: '12' as SizeKey,
  material: 'Cu' as Material,
  lengthFt: 100,
  tempF: 68,
  amps: 20,
  circuit: 'single' as CircuitType,
  maxLoopOhms: 0.5,
};
