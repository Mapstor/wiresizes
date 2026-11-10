// Conductor resistance R(T) = R20 × (1 + α(T − 20)) with R20 and α from awg.json (src/lib/verified/awg.ts):
// copper R20 from HB100 (kcmil sizes calculated), α 0.00393; aluminum EC-H19 R20 calculated from HB109
// constants, α 0.00403, 12 AWG and larger. Power loss: 2·I²·R·L/1000 for DC or single-phase,
// 3·I²·R·L/1000 for three-phase (R in Ω per 1000 ft, L one way in ft), in watts.
import { AWG_CONSTANTS, awgRow, conductor } from '../verified/awg';
import type { Material, SizeKey } from '../verified/awg';
import { TABLE_310_16_SIZES } from '../verified/nec-310-16';

export const ENGINE_ID = 'resistance';
export const DOMAINS = ['conductor-resistance-20c'];

export const COPPER_ALPHA = AWG_CONSTANTS.copper_alpha_per_C_20C;
export const ALUMINUM_ALPHA = AWG_CONSTANTS.aluminum_ECH19_alpha_per_C_20C;
// the awg.json resistances, resistivities and α are for 20 °C
export const REFERENCE_TEMP_C = 20;

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

/** A 20 °C resistance or resistivity of the material at `tempC`: value × (1 + α × (T − 20 °C)). */
export function atTemperature(value20: number, material: Material, tempC: number): number {
  return value20 * (1 + alpha(material) * (tempC - REFERENCE_TEMP_C));
}

/** Ω per 1000 ft at `tempC`. */
export function resistanceAt(key: SizeKey, material: Material, tempC: number): number | null {
  const base = r20(key, material);
  return base === null ? null : atTemperature(base, material, tempC);
}

/** Ω per km of copper AWG sizes at `tempC`, from awg.json r20_cu_ohm_per_km (HB100); null for other sizes and aluminum. */
export function resistancePerKmAt(key: SizeKey, material: Material, tempC: number): number | null {
  const row = material === 'Cu' ? awgRow(key) : null;
  return row ? atTemperature(row.r20_cu_ohm_per_km, material, tempC) : null;
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

export type ResistanceField = 'lengthFt' | 'tempF' | 'amps' | 'maxLoopOhms';

export const DISTANCE_MIN_FT = 1;
export const DISTANCE_MAX_FT = 5000;
export const TEMPERATURE_MIN_F = -40;
export const TEMPERATURE_MAX_F = 200;

/** The message under each invalid field. */
export const RESISTANCE_INPUT_MESSAGES: Record<ResistanceField, string> = {
  lengthFt: 'Enter a one-way distance from 1 ft to 5000 ft.',
  tempF: 'Enter a temperature from −40 °F to 200 °F.',
  amps: 'Enter a current greater than 0 A.',
  maxLoopOhms: 'Enter a loop resistance greater than 0 Ω.',
};

/** The fields each mode uses. */
export function resistanceFields(mode: ResistanceMode): ResistanceField[] {
  if (mode === 'distance') return ['tempF', 'maxLoopOhms'];
  if (mode === 'power') return ['lengthFt', 'tempF', 'amps'];
  return ['lengthFt', 'tempF'];
}

/** Whether a field's value is in its range: distance 1–5000 ft, temperature −40–200 °F, current and loop resistance above 0. */
export function resistanceFieldValid(field: ResistanceField, value: number): boolean {
  if (field === 'lengthFt') return value >= DISTANCE_MIN_FT && value <= DISTANCE_MAX_FT;
  if (field === 'tempF') return value >= TEMPERATURE_MIN_F && value <= TEMPERATURE_MAX_F;
  return Number.isFinite(value) && value > 0;
}

/** The message for each invalid field the mode uses (NaN, an empty field, is invalid). */
export function resistanceInputErrors(
  mode: ResistanceMode,
  values: Record<ResistanceField, number>,
): Partial<Record<ResistanceField, string>> {
  const errors: Partial<Record<ResistanceField, string>> = {};
  for (const field of resistanceFields(mode)) {
    if (!resistanceFieldValid(field, values[field])) errors[field] = RESISTANCE_INPUT_MESSAGES[field];
  }
  return errors;
}

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
