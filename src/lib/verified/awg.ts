// data/verified/awg.json: AWG 0000–40 diameters, areas, 20 °C copper resistances and weights (NBS Handbook 100
// Table 5), the kcmil sizes, resistances derived from the HB100/HB109 constants, and the AWG definition. Modules take
// and return the size keys of nec-310-16.json ("14", "1/0", "4/0", "250"); awg.json names 1/0 to 4/0 "0" to "0000",
// and this file maps between the two.
import awgData from '../../../data/verified/awg.json';

export type SizeKey = string;
export type Material = 'Cu' | 'Al';

export type AwgRow = (typeof awgData.awg)[number];
export type KcmilRow = (typeof awgData.kcmil)[number];

/** d(n) = d_36_in × (d_0000_in ÷ d_36_in)^((36 − n) ÷ steps); n = −3 for 0000. */
export const AWG_DEFINITION = awgData.definition;
/** HB100 copper and HB109 aluminum EC-H19 constants at 20 °C, and mm² per cmil. */
export const AWG_CONSTANTS = awgData.constants;

// unit definition: 1 mil = 0.001 in = 0.0254 mm
const MM_PER_MIL = 0.0254;

const OUGHT_TO_AWG_NAME: Record<string, string> = { '1/0': '0', '2/0': '00', '3/0': '000', '4/0': '0000' };
const AWG_NAME_TO_OUGHT: Record<string, string> = { '0': '1/0', '00': '2/0', '000': '3/0', '0000': '4/0' };

/** awg.json name for an AWG size key ("1/0" → "0"); kcmil keys are returned unchanged. */
export function awgName(key: SizeKey): string {
  return OUGHT_TO_AWG_NAME[key] ?? key;
}

/** Size key for an awg.json name ("0000" → "4/0"). */
export function sizeKeyFromAwgName(name: string): SizeKey {
  return AWG_NAME_TO_OUGHT[name] ?? name;
}

/** All awg.json AWG rows in table order, 0000 to 40. */
export const AWG_TABLE: AwgRow[] = awgData.awg;
/** All awg.json kcmil rows in table order, 250 to 2000 kcmil. */
export const KCMIL_TABLE: KcmilRow[] = awgData.kcmil;

const AWG_ROWS = new Map<SizeKey, AwgRow>(awgData.awg.map((row) => [sizeKeyFromAwgName(row.awg), row]));
const KCMIL_ROWS = new Map<SizeKey, KcmilRow>(awgData.kcmil.map((row) => [String(row.kcmil), row]));

/** The full awg.json row of an AWG size (diameter, area, weights, IEC sizes, r20_cu_ohm_per_km …), or null. */
export function awgRow(key: SizeKey): AwgRow | null {
  return AWG_ROWS.get(key) ?? null;
}

/** The full awg.json row of a kcmil size, or null. */
export function kcmilRow(key: SizeKey): KcmilRow | null {
  return KCMIL_ROWS.get(key) ?? null;
}

/** A kcmil size of awg.json (250 to 2000 kcmil). */
export function isKcmil(key: SizeKey): boolean {
  return KCMIL_ROWS.has(key);
}

/** "14 AWG", "1/0 AWG", "250 kcmil": sizes are names, so no digit grouping (D-11). */
export function formatSize(key: SizeKey): string {
  return isKcmil(key) ? `${key} kcmil` : `${key} AWG`;
}

export interface ConductorData {
  key: SizeKey;
  areaCmil: number;
  diameterMm: number;
  /** Ω per 1000 ft, solid annealed copper at 20 °C (HB100; calculated for kcmil sizes). */
  r20Cu: number;
  /** Ω per 1000 ft, solid copper at 75 °C (calculated). */
  r75Cu: number;
  /** Ω per 1000 ft, aluminum EC-H19 at 20 °C (calculated); null where awg.json has no aluminum value. */
  r20Al: number | null;
  /** Ω per 1000 ft, aluminum EC-H19 at 75 °C (calculated); null where awg.json has no aluminum value. */
  r75Al: number | null;
}

const CONDUCTORS = new Map<SizeKey, ConductorData>();
for (const [key, row] of AWG_ROWS) {
  CONDUCTORS.set(key, {
    key,
    areaCmil: row.area_cmil,
    diameterMm: row.diameter_mm,
    r20Cu: row.r20_cu_ohm_per_1000ft,
    r75Cu: row.r75_cu_solid_ohm_per_1000ft_derived,
    // awg.json has no aluminum values below 12 AWG
    r20Al: 'r20_al_ech19_ohm_per_1000ft_derived' in row ? (row.r20_al_ech19_ohm_per_1000ft_derived ?? null) : null,
    r75Al: 'r75_al_ech19_ohm_per_1000ft_derived' in row ? (row.r75_al_ech19_ohm_per_1000ft_derived ?? null) : null,
  });
}
for (const [key, row] of KCMIL_ROWS) {
  CONDUCTORS.set(key, {
    key,
    areaCmil: row.area_cmil,
    // kcmil: diameter of a solid round conductor, √cmil mils
    diameterMm: Math.sqrt(row.area_cmil) * MM_PER_MIL,
    r20Cu: row.r20_cu_ohm_per_1000ft_derived,
    r75Cu: row.r75_cu_solid_equiv_ohm_per_1000ft_derived,
    r20Al: row.r20_al_ech19_ohm_per_1000ft_derived,
    r75Al: row.r75_al_ech19_ohm_per_1000ft_derived,
  });
}

/** Area, diameter and resistances of an AWG or kcmil size, or null. */
export function conductor(key: SizeKey): ConductorData | null {
  return CONDUCTORS.get(key) ?? null;
}

export function areaCmil(key: SizeKey): number {
  const data = CONDUCTORS.get(key);
  if (!data) throw new Error(`Unknown conductor size: ${key}`);
  return data.areaCmil;
}

export function diameterMm(key: SizeKey): number | null {
  return CONDUCTORS.get(key)?.diameterMm ?? null;
}
