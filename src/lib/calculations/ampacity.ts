// Ampacity arithmetic: NEC Table 310.16 value × Table 310.15(B)(1)(1) ambient correction factor
// × Table 310.15(C)(1) adjustment percent, with the 240.4(D) overcurrent limit reported separately.
import { AMBIENT_ROWS, correction } from '../verified/nec-310-15-B-1-1';
import { TERMINATION_RULES } from '../verified/nec-110-14c';
import type { AmbientRow, CorrectionColumn } from '../verified/nec-310-15-B-1-1';
import { adjustment, ADJUSTMENT_ROWS } from '../verified/nec-310-15-C-1';
import { max240_4D } from '../verified/nec-240-4-d';
import { columnKey, table31016, TABLE_310_16_SIZES } from '../verified/nec-310-16';
import type { AmpacityColumn } from '../verified/nec-310-16';
import type { Material, SizeKey } from '../verified/awg';
import { partsText } from './format';
import type { TextPart } from './format';

export const ENGINE_ID = 'ampacity';
const CALC = `calc:${ENGINE_ID}`;
// nec-110-14c since WSZ-009a: the termination caps
export const DOMAINS = ['nec-310-16', 'nec-310-15-corrections', 'nec-240-4-d', 'nec-110-14c'];

export { AMBIENT_ROWS } from '../verified/nec-310-15-B-1-1';
export type { AmbientRow, CorrectionColumn } from '../verified/nec-310-15-B-1-1';
export type { Limit240_4D } from '../verified/nec-240-4-d';
// The name before WSZ-003a, for the guides
export { correction as correctionFactor } from '../verified/nec-310-15-B-1-1';

/** Table 310.15(C)(1) bands; 1–3 current-carrying conductors take no adjustment (100 %). */
export const NO_ADJUSTMENT_BAND = '1–3';
export const ADJUSTMENT_BANDS: { key: string; percent: number }[] = [
  { key: NO_ADJUSTMENT_BAND, percent: adjustment(null) },
  ...ADJUSTMENT_ROWS,
];

export function adjustmentPercent(band: string): number {
  return adjustment(band === NO_ADJUSTMENT_BAND ? null : band);
}

/** Table value × correction factor × adjustment percent ÷ 100. */
export function correctedAmpacity(tableA: number, factor: number, percent: number): number {
  return (tableA * factor * percent) / 100;
}

/** "Overcurrent protection limited to 20 A (NEC 240.4(D))" in parts. */
export function ocpdLimitParts(maxOcpdA: number): TextPart[] {
  return ['Overcurrent protection limited to ', { v: maxOcpdA, unit: 'A', src: CALC }, ' (NEC 240.4(D))'];
}

export function ocpdLimitLabel(maxOcpdA: number): string {
  return partsText(ocpdLimitParts(maxOcpdA));
}

/** The 240.4(D) limit shown beside a result: the rows without conditions (14, 12 and 10 AWG copper, 12 and 10 AWG aluminum). */
export function displayedOcpdLimitA(size: SizeKey, material: Material): number | null {
  const row = max240_4D(size, material);
  return row && row.conditions === null ? row.max_ocpd_a : null;
}

/** displayedOcpdLimitA as the label shown beside a result. */
export function displayedOcpdLimit(size: SizeKey, material: Material): string | null {
  const limitA = displayedOcpdLimitA(size, material);
  return limitA === null ? null : ocpdLimitLabel(limitA);
}

export interface AmpacityInput {
  size: SizeKey;
  material: Material;
  column: AmpacityColumn;
  ambientRow: string;
  band: string;
}

export interface AmpacityResult {
  tableAmpacity: number | null;
  correctionFactor: number | null;
  adjustmentPercent: number;
  /** null when the size has no value in the column or the factor is null (not permitted). */
  ampacity: number | null;
  notPermitted: boolean;
  ocpdLimit: string | null;
  /** The 240.4(D) limit behind ocpdLimit, in amperes. */
  ocpdLimitA: number | null;
}

export function calculateAmpacity(input: AmpacityInput): AmpacityResult {
  const base = table31016(input.size, columnKey(input.material, input.column));
  const factor = correction(input.ambientRow, `f_${input.column}` as CorrectionColumn);
  const percent = adjustmentPercent(input.band);
  const notPermitted = factor === null;
  return {
    tableAmpacity: base,
    correctionFactor: factor,
    adjustmentPercent: percent,
    ampacity: base === null || factor === null ? null : correctedAmpacity(base, factor, percent),
    notPermitted,
    ocpdLimit: displayedOcpdLimit(input.size, input.material),
    ocpdLimitA: displayedOcpdLimitA(input.size, input.material),
  };
}

/** Sizes the ampacity calculator offers: Table 310.16 from 14 AWG to 2000 kcmil. */
export const AMPACITY_SIZES: SizeKey[] = TABLE_310_16_SIZES.slice(TABLE_310_16_SIZES.indexOf('14'));

/** "26–30 °C (78–86 °F)"; "10 °C or less (50 °F or less)". */
export function ambientLabel(row: AmbientRow): string {
  const orLess = ' or less';
  if (row.key.endsWith(orLess)) {
    return `${row.key.slice(0, -orLess.length)} °C or less (${row.ambientF.replace(orLess, '')} °F or less)`;
  }
  return `${row.key} °C (${row.ambientF} °F)`;
}


// ── The ampacity calculator in the look (WSZ-009a) ────────────────────────────────────────────────────────────────
// A temperature in either unit picks its Table 310.15(B)(1)(1) row by the range the table prints in that unit; a count
// of current-carrying conductors picks its Table 310.15(C)(1) band. The result adds the 110.14(C) termination caps:
// the corrected ampacity, never above the size's Table 310.16 value in the column of the terminals (data/verified/
// nec-110-14c.json engine_rules column-cap and derating-start). NM and UF cable stay in the 60 °C column, corrections
// included (engine rule nm-cable, while nec-cable-rules is GAP).

export type TempUnit = 'C' | 'F';
export type WiringMethod = 'conductors' | 'cable';

/** The whole-degree range a row prints in one unit: [low, high]; low is -Infinity for "10 or less". */
function rowRange(row: AmbientRow, unit: TempUnit): [number, number] {
  const text = unit === 'C' ? row.key : row.ambientF;
  const orLess = /^(\d+) or less$/.exec(text);
  if (orLess) return [-Infinity, Number(orLess[1])];
  const span = /^(\d+)–(\d+)$/.exec(text);
  if (!span) throw new Error(`Table 310.15(B)(1)(1): cannot read the range "${text}"`);
  return [Number(span[1]), Number(span[2])];
}

/** The row whose printed range holds a whole-degree temperature, or null above the table's warmest row. */
export function ambientRowFor(temp: number, unit: TempUnit): AmbientRow | null {
  if (!Number.isInteger(temp)) throw new Error(`ambientRowFor: ${temp} is not a whole degree`);
  return AMBIENT_ROWS.find((row) => {
    const [lo, hi] = rowRange(row, unit);
    return temp >= lo && temp <= hi;
  }) ?? null;
}

/** The warmest whole degree the table covers in a unit (85 °C, 185 °F). */
export function warmestTemp(unit: TempUnit): number {
  return rowRange(AMBIENT_ROWS[AMBIENT_ROWS.length - 1], unit)[1];
}

/** The Table 310.15(C)(1) band of a count of current-carrying conductors: "1–3" (no adjustment), "4–6" … "41 and above". */
export function bandFor(count: number): string {
  if (!Number.isInteger(count) || count < 1) throw new Error(`bandFor: ${count} is not a count of conductors`);
  for (const band of ADJUSTMENT_BANDS) {
    const span = /^(\d+)–(\d+)$/.exec(band.key);
    if (span && count >= Number(span[1]) && count <= Number(span[2])) return band.key;
    const above = /^(\d+) and above$/.exec(band.key);
    if (above && count >= Number(above[1])) return band.key;
  }
  throw new Error(`bandFor: no Table 310.15(C)(1) band holds ${count}`);
}

/** The termination columns a result shows: 60 °C and 75 °C, never 90 °C as the final column (engine rule 90C-final). */
export const TERMINAL_COLUMNS = [TERMINATION_RULES.columnAtOrBelowLimit, TERMINATION_RULES.columnAboveLimit] as AmpacityColumn[];

export interface TerminalCap {
  column: AmpacityColumn;
  /** The size's Table 310.16 value in that column, A, or null where the table has none. */
  tableA: number | null;
  /** The corrected ampacity, not above tableA, A; null where either is missing. */
  usableA: number | null;
  /** True where the termination column, not the correction, sets usableA. */
  capped: boolean;
}

export interface AmpacityRun {
  size: SizeKey;
  material: Material;
  method: WiringMethod;
  /** The column the conductor starts from: its insulation's, or 60 °C for cable. */
  column: AmpacityColumn;
  temp: number;
  unit: TempUnit;
  count: number;
  row: AmbientRow | null;
  band: string;
  /** The calculateAmpacity result for the column, row and band (row null: not permitted). */
  result: AmpacityResult;
  /** One cap per termination column the method allows: 60 and 75 °C for conductors, 60 °C for cable. */
  caps: TerminalCap[];
}

export type AmpacityError = 'size-invalid' | 'temp-invalid' | 'count-invalid';

export function isAmpacityError(r: AmpacityRun | { error: AmpacityError }): r is { error: AmpacityError } {
  return 'error' in r;
}

/** The cable column: engine rule nm-cable (60 °C, corrections included). */
export const CABLE_COLUMN = TERMINATION_RULES.cableColumn as AmpacityColumn;

export function ampacityRun(input: {
  size: SizeKey;
  material: Material;
  method: WiringMethod;
  column: AmpacityColumn;
  temp: number;
  unit: TempUnit;
  count: number;
}): AmpacityRun | { error: AmpacityError } {
  const { size, material, method, temp, unit, count } = input;
  if (!AMPACITY_SIZES.includes(size) || table31016(size, columnKey(material, 60)) === null && table31016(size, columnKey(material, 90)) === null) {
    return { error: 'size-invalid' };
  }
  if (!Number.isInteger(temp) || temp < -100 || temp > 1000) return { error: 'temp-invalid' };
  if (!Number.isInteger(count) || count < 1 || count > 1000) return { error: 'count-invalid' };
  const column = method === 'cable' ? CABLE_COLUMN : input.column;
  const row = ambientRowFor(temp, unit);
  const band = bandFor(count);
  const result: AmpacityResult = row
    ? calculateAmpacity({ size, material, column, ambientRow: row.key, band })
    : {
        tableAmpacity: table31016(size, columnKey(material, column)),
        correctionFactor: null,
        adjustmentPercent: adjustmentPercent(band),
        ampacity: null,
        notPermitted: true,
        ocpdLimit: displayedOcpdLimit(size, material),
        ocpdLimitA: displayedOcpdLimitA(size, material),
      };
  const columns = method === 'cable' ? [CABLE_COLUMN] : TERMINAL_COLUMNS.filter((c) => c <= column);
  const caps = columns.map((c) => {
    const tableA = table31016(size, columnKey(material, c));
    const usableA = tableA === null || result.ampacity === null ? null : Math.min(result.ampacity, tableA);
    return { column: c, tableA, usableA, capped: tableA !== null && result.ampacity !== null && tableA < result.ampacity };
  });
  return { size, material, method, column, temp, unit, count, row, band, result, caps };
}
