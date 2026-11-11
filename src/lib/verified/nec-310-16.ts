// data/verified/nec-310-16.json: NEC Table 310.16 (2023) allowable ampacities, 18 AWG to 2000 kcmil, in the 60, 75
// and 90 °C columns for copper and for aluminum or copper-clad aluminum.
import table from '../../../data/verified/nec-310-16.json';
import { areaCmil } from './awg';
import type { Material, SizeKey } from './awg';

export type AmpacityColumn = 60 | 75 | 90;
export type Table31016Column = 'cu_60' | 'cu_75' | 'cu_90' | 'al_60' | 'al_75' | 'al_90';

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
export const TABLE_310_16_ROWS: Table31016Row[] = table.rows.map((row) => ({
  size: row.size,
  cu_60: row.cu_60,
  cu_75: row.cu_75,
  cu_90: row.cu_90,
  al_60: row.al_60,
  al_75: row.al_75,
  al_90: row.al_90,
}));

export const TABLE_310_16_SIZES: SizeKey[] = TABLE_310_16_ROWS.map((row) => row.size);

const AMBIENT = /(\d+) °C \((\d+) °F\) ambient/.exec(table.title);
if (!AMBIENT) throw new Error('nec-310-16.json: the title no longer names the ambient temperature as "N °C (N °F) ambient"');

/** The ambient temperature the table's values assume, read from the file's title: 30 °C (86 °F). */
export const TABLE_AMBIENT = { c: Number(AMBIENT[1]), f: Number(AMBIENT[2]) };

/** Insulation types per temperature column as the file lists them (keyed by 60, 75, 90; written for copper). */
export const COLUMN_TYPES: Record<AmpacityColumn, string> = Object.fromEntries(
  Object.entries(table.columns_types).map(([key, types]) => [Number(key.split('_')[1]), types]),
) as Record<AmpacityColumn, string>;

/** The temperature columns of the table (columns_types: cu_60, cu_75, cu_90), coolest first. */
export const AMPACITY_COLUMNS = Object.keys(table.columns_types).map((key) => Number(key.split('_')[1]) as AmpacityColumn);

/** "cu_60" for copper at 60 °C, "al_75" for aluminum at 75 °C. */
export function columnKey(material: Material, column: AmpacityColumn): Table31016Column {
  return `${material === 'Cu' ? 'cu' : 'al'}_${column}`;
}

/** The ampacity of a size in a column, or null where the table has no value (or no such size). */
export function table31016(key: SizeKey, column: Table31016Column): number | null {
  const row = TABLE_310_16_ROWS.find((r) => r.size === key);
  return row ? row[column] : null;
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
