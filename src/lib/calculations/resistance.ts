// Conductor resistance R(T) = R20 × (1 + α(T − 20)) with R20 and α from awg.json (src/lib/verified/awg.ts):
// copper R20 from HB100 (kcmil sizes calculated), α 0.00393; aluminum EC-H19 R20 calculated from HB109
// constants, α 0.00403, 12 AWG and larger. Power loss: 2·I²·R·L/1000 for DC or single-phase,
// 3·I²·R·L/1000 for three-phase (R in Ω per 1000 ft, L one way in ft), in watts.
import { AWG_CONSTANTS, AWG_TABLE, KCMIL_TABLE, areaCmil, awgRow, conductor, sizeKeyFromAwgName } from '../verified/awg';
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

// ── WSZ-006: the wire resistance calculator's calculation path ──────────────────────────────────────────────────────

/** Feet in a kilometre, by the definition of the foot (0.3048 m). */
export const FT_PER_KM = 1000 / 0.3048;

/** The calculator's temperature range and its quick choices, °C: 20 °C is the tables' temperature, 75 °C the NEC column's. */
export const TOOL_TEMP_MIN_C = -40;
export const TOOL_TEMP_MAX_C = 90;
export const TOOL_TEMP_QUICK_C = [20, 75] as const;
/** The calculator's length range, ft (1 to 5,000 ft; 0.3 to 1,524 m). */
export const TOOL_LENGTH_MIN_FT = 1;
export const TOOL_LENGTH_MAX_FT = 5000;

/** Every size with a resistance for the material, thin to thick: 40 AWG to 4/0, then 250 to 2000 kcmil (aluminum EC-H19 from 12 AWG). */
export function toolSizes(material: Material): SizeKey[] {
  const awg = [...AWG_TABLE].reverse().map((row) => sizeKeyFromAwgName(row.awg));
  const kcmil = KCMIL_TABLE.map((row) => String(row.kcmil));
  return [...awg, ...kcmil].filter((key) => r20(key, material) !== null);
}

/**
 * The significant figures a size's resistance carries, at any temperature and length. NIST Handbook 100 prints copper
 * Ω per 1000 ft to four figures below 1 Ω and to three from 1 Ω up (awg.json: 0.9988, then 1.26, 1.59, 2.0 for 2.00),
 * so 12 AWG's 1.59 never shows as "1.590". kcmil and aluminum values are calculated from five-figure constants: 4.
 */
export function resistanceSig(key: SizeKey, material: Material): number {
  const row = material === 'Cu' ? awgRow(key) : null;
  if (!row) return 4;
  return row.r20_cu_ohm_per_1000ft < 1 ? 4 : 3;
}

/** The same for Ω per km: HB100's metric column has four figures throughout, and calculated values get 4. */
export const PER_KM_SIG = 4;

/** The sizes people buy, thin to thick: every gauge thinner than 18 AWG, then Table 310.16's sizes from 18 AWG up. */
export function commonSizes(material: Material): SizeKey[] {
  return toolSizes(material).filter((k) => TABLE_310_16_SIZES.includes(k) || (awgRow(k)?.n ?? -99) > 18);
}

/** Ω per km at `tempC`: copper AWG sizes from HB100's metric column, other sizes from Ω per 1000 ft. */
export function ohmsPerKm(key: SizeKey, material: Material, tempC: number): number | null {
  const metric = resistancePerKmAt(key, material, tempC);
  if (metric !== null) return metric;
  const perKft = resistanceAt(key, material, tempC);
  return perKft === null ? null : (perKft * FT_PER_KM) / 1000;
}

/** A size's area in mm², from its area in circular mils. */
export function areaMm2(key: SizeKey): number {
  return areaCmil(key) * AWG_CONSTANTS.mm2_per_cmil;
}

/** The size of the material nearest an area in mm², nearest on a log scale as gauge steps run; null for a non-positive area. */
export function nearestSizeForMm2(mm2: number, material: Material): SizeKey | null {
  if (!(mm2 > 0)) return null;
  let best: SizeKey | null = null;
  let bestGap = Infinity;
  for (const key of toolSizes(material)) {
    const gap = Math.abs(Math.log(areaMm2(key) / mm2));
    if (gap < bestGap) {
      best = key;
      bestGap = gap;
    }
  }
  return best;
}

export interface RunValues {
  /** Ω per 1000 ft */
  perKft: number;
  /** Ω per km */
  perKm: number;
  /** One conductor over the length, Ω */
  conductor: number;
  /** Out and back in a two-wire circuit of the length (twice the wire), Ω */
  loop: number;
}

export interface RunResult extends RunValues {
  size: SizeKey;
  material: Material;
  lengthFt: number;
  tempC: number;
  /** Significant figures of the per-1000-ft, conductor and loop values (resistanceSig) and of per km (perKmSig). */
  sig: number;
  kmSig: number;
  at20: RunValues;
  at75: RunValues;
  /** Up to two thinner and two thicker sizes of the material, thin to thick, the chosen size among them, at `tempC`: Table 310.16's
   *  sizes from 18 AWG up and every gauge thinner, so 14 AWG sits between 18, 16, 12 and 10 AWG. */
  neighbours: { size: SizeKey; conductor: number; sig: number }[];
}

function runValues(size: SizeKey, material: Material, lengthFt: number, tempC: number): RunValues | null {
  const perKft = resistanceAt(size, material, tempC);
  const perKm = ohmsPerKm(size, material, tempC);
  if (perKft === null || perKm === null || !(lengthFt >= 0)) return null;
  const conductorOhms = (perKft * lengthFt) / 1000;
  return { perKft, perKm, conductor: conductorOhms, loop: 2 * conductorOhms };
}

/** Resistance of a run: one conductor and a two-wire circuit, per 1000 ft and per km, at `tempC`, 20 °C and 75 °C. */
export function resistanceRun(size: SizeKey, material: Material, lengthFt: number, tempC: number): RunResult | null {
  const at = runValues(size, material, lengthFt, tempC);
  const at20 = runValues(size, material, lengthFt, 20);
  const at75 = runValues(size, material, lengthFt, 75);
  if (!at || !at20 || !at75) return null;
  const sizes = commonSizes(material).includes(size) ? commonSizes(material) : toolSizes(material).filter((k) => k === size || commonSizes(material).includes(k));
  const i = sizes.indexOf(size);
  const neighbours = sizes
    .slice(Math.max(0, i - 2), i + 3)
    .map((key) => ({
      size: key,
      conductor: ((resistanceAt(key, material, tempC) as number) * lengthFt) / 1000,
      sig: resistanceSig(key, material),
    }));
  return {
    size,
    material,
    lengthFt,
    tempC,
    sig: resistanceSig(size, material),
    kmSig: PER_KM_SIG,
    ...at,
    at20,
    at75,
    neighbours,
  };
}

/** The thinnest common size of `to` whose resistance per length is at most that of `size` in `from`, at 20 °C (both materials scale alike with temperature within 0.5 %). */
export function equivalentSize(size: SizeKey, from: Material, to: Material): SizeKey | null {
  const target = r20(size, from);
  if (target === null) return null;
  return commonSizes(to).find((key) => (r20(key, to) as number) <= target) ?? null;
}

