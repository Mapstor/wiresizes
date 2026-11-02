// AWG geometry from the awg.json definition: d(n) = d_36 × (d_0000 ÷ d_36)^((36 − n) ÷ steps), with d_36 = 0.005 in,
// d_0000 = 0.46 in and 39 steps from 0000 (n = −3) to 36; area = (d in mils)² cmil and cmil × mm2_per_cmil mm².
// Each gauge step multiplies the diameter by (d_0000 ÷ d_36)^(1 ÷ steps) (awg.json `ratio`) and the area by its
// square. Copper weight per foot is HB100's weight per 1000 ft ÷ 1000.
import { AWG_CONSTANTS, AWG_DEFINITION, awgRow } from '../verified/awg';
import type { SizeKey } from '../verified/awg';

export const ENGINE_ID = 'awg-geometry';
export const DOMAINS = ['awg-geometry'];

// unit definitions: 1 in = 1000 mil = 25.4 mm
const MILS_PER_INCH = 1000;
const MM_PER_INCH = 25.4;
const FEET_PER_1000_FT = 1000;

/** d_0000 ÷ d_36: the diameter ratio over all `steps` gauge steps (92). */
const SPAN_RATIO = AWG_DEFINITION.d_0000_in / AWG_DEFINITION.d_36_in;
const N_0000 = (awgRow('4/0') as NonNullable<ReturnType<typeof awgRow>>).n;
/** The gauge number of d_36: steps above 0000. */
const N_36 = N_0000 + AWG_DEFINITION.steps;

export interface AwgGeometry {
  diameterIn: number;
  diameterMm: number;
  areaCmil: number;
  areaMm2: number;
}

/** Diameter and area of gauge number n (0000 = −3, 000 = −2, 00 = −1, 0 = 0) by the AWG definition. */
export function gaugeGeometry(n: number): AwgGeometry {
  const diameterIn = AWG_DEFINITION.d_36_in * SPAN_RATIO ** ((N_36 - n) / AWG_DEFINITION.steps);
  const areaCmil = (diameterIn * MILS_PER_INCH) ** 2;
  return {
    diameterIn,
    diameterMm: diameterIn * MM_PER_INCH,
    areaCmil,
    areaMm2: areaCmil * AWG_CONSTANTS.mm2_per_cmil,
  };
}

/** gaugeGeometry for an AWG size key ("4/0", "14", "40"); null for kcmil and unknown sizes. */
export function awgGeometry(key: SizeKey): AwgGeometry | null {
  const row = awgRow(key);
  return row ? gaugeGeometry(row.n) : null;
}

/** The diameter ratio across `steps` gauge steps (a smaller gauge number is the larger wire). */
export function diameterRatio(steps: number): number {
  return SPAN_RATIO ** (steps / AWG_DEFINITION.steps);
}

/** The area ratio across `steps` gauge steps: the diameter ratio squared. */
export function areaRatio(steps: number): number {
  return diameterRatio(steps) ** 2;
}

/** Solid copper weight in lb per ft (HB100 Table 5), AWG sizes only; null otherwise. */
export function copperWeightLbPerFt(key: SizeKey): number | null {
  const row = awgRow(key);
  return row ? row.weight_cu_lb_per_1000ft / FEET_PER_1000_FT : null;
}
