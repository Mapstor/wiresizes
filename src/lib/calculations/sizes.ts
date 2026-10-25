// Conductor sizes. Modules take and return the size keys of data/verified/nec-310-16.json ("14", "1/0", "4/0",
// "250"). awg.json names 1/0 to 4/0 "0" to "0000"; this file maps between the two and formats sizes for display
// ("14 AWG", "1/0 AWG", "250 kcmil").
import awgData from '../../../data/verified/awg.json';
import table31016 from '../../../data/verified/nec-310-16.json';

export type SizeKey = string;
export type Material = 'Cu' | 'Al';
export type AmpacityColumn = 60 | 75 | 90;

const OUGHT_TO_AWG_NAME: Record<string, string> = { '1/0': '0', '2/0': '00', '3/0': '000', '4/0': '0000' };
const AWG_NAME_TO_OUGHT: Record<string, string> = { '0': '1/0', '00': '2/0', '000': '3/0', '0000': '4/0' };

export function isKcmil(key: SizeKey): boolean {
  return /^\d+$/.test(key) && Number(key) >= 250;
}

/** awg.json name for an AWG size key ("1/0" → "0"); kcmil keys are returned unchanged. */
export function awgName(key: SizeKey): string {
  return OUGHT_TO_AWG_NAME[key] ?? key;
}

/** Size key for an awg.json name ("0000" → "4/0"). */
export function sizeKeyFromAwgName(name: string): SizeKey {
  return AWG_NAME_TO_OUGHT[name] ?? name;
}

export function formatSize(key: SizeKey): string {
  return isKcmil(key) ? `${key} kcmil` : `${key} AWG`;
}

export function materialName(material: Material): string {
  return material === 'Cu' ? 'copper' : 'aluminum';
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
for (const row of awgData.awg) {
  const key = sizeKeyFromAwgName(row.awg);
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
for (const row of awgData.kcmil) {
  const key = String(row.kcmil);
  CONDUCTORS.set(key, {
    key,
    areaCmil: row.area_cmil,
    // kcmil: diameter of a solid round conductor, √cmil mils × 0.0254 mm
    diameterMm: Math.sqrt(row.area_cmil) * 0.0254,
    r20Cu: row.r20_cu_ohm_per_1000ft_derived,
    r75Cu: row.r75_cu_solid_equiv_ohm_per_1000ft_derived,
    r20Al: row.r20_al_ech19_ohm_per_1000ft_derived,
    r75Al: row.r75_al_ech19_ohm_per_1000ft_derived,
  });
}

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

export interface Table31016Row {
  size: SizeKey;
  cu_60: number | null;
  cu_75: number | null;
  cu_90: number | null;
  al_60: number | null;
  al_75: number | null;
  al_90: number | null;
}

/** All 30 rows of NEC Table 310.16 (2023), smallest size first. */
export const TABLE_310_16_ROWS: Table31016Row[] = table31016.rows.map((row) => ({
  size: row.size,
  cu_60: row.cu_60,
  cu_75: row.cu_75,
  cu_90: row.cu_90,
  al_60: row.al_60,
  al_75: row.al_75,
  al_90: row.al_90,
}));

export const TABLE_310_16_SIZES: SizeKey[] = TABLE_310_16_ROWS.map((row) => row.size);

export function tableAmpacity(key: SizeKey, material: Material, column: AmpacityColumn): number | null {
  const row = TABLE_310_16_ROWS.find((r) => r.size === key);
  if (!row) return null;
  const field = `${material === 'Cu' ? 'cu' : 'al'}_${column}` as keyof Table31016Row;
  return row[field] as number | null;
}

/** Next larger Table 310.16 size, or null after 2000 kcmil. */
export function nextLargerSize(key: SizeKey): SizeKey | null {
  const i = TABLE_310_16_SIZES.indexOf(key);
  return i === -1 || i === TABLE_310_16_SIZES.length - 1 ? null : TABLE_310_16_SIZES[i + 1];
}

/** Smallest Table 310.16 size whose awg.json area is at least `cmil`, or null. */
export function smallestSizeWithArea(cmil: number): SizeKey | null {
  return TABLE_310_16_SIZES.find((key) => areaCmil(key) >= cmil) ?? null;
}
