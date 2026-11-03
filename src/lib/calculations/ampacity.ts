// Ampacity arithmetic: NEC Table 310.16 value × Table 310.15(B)(1)(1) ambient correction factor
// × Table 310.15(C)(1) adjustment percent, with the 240.4(D) overcurrent limit reported separately.
import { correction } from '../verified/nec-310-15-B-1-1';
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
export const DOMAINS = ['nec-310-16', 'nec-310-15-corrections', 'nec-240-4-d'];

export { AMBIENT_ROWS } from '../verified/nec-310-15-B-1-1';
export type { AmbientRow, CorrectionColumn } from '../verified/nec-310-15-B-1-1';
export type { Limit240_4D } from '../verified/nec-240-4-d';
// The names before WSZ-003a, for the ampacity calculator page and the guides
export { correction as correctionFactor } from '../verified/nec-310-15-B-1-1';
export { max240_4D as maxOcpd240_4D } from '../verified/nec-240-4-d';

export const NOT_PERMITTED_MESSAGE = 'Not permitted at this ambient temperature for this insulation rating';

/** A Table 310.15(B)(1)(1) factor with two decimals, as the table prints it: 1.00, 1.20; "–" where none applies. */
export function formatFactor(factor: number | null): string {
  return factor === null ? '–' : factor.toFixed(2);
}

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

export const COLUMN_OPTIONS: { value: AmpacityColumn; label: string }[] = [
  { value: 60, label: '60 °C (140 °F)' },
  { value: 75, label: '75 °C (167 °F)' },
  { value: 90, label: '90 °C (194 °F)' },
];

/** "26–30 °C (78–86 °F)"; "10 °C or less (50 °F or less)". */
export function ambientLabel(row: AmbientRow): string {
  const orLess = ' or less';
  if (row.key.endsWith(orLess)) {
    return `${row.key.slice(0, -orLess.length)} °C or less (${row.ambientF.replace(orLess, '')} °F or less)`;
  }
  return `${row.key} °C (${row.ambientF} °F)`;
}

/** "4–6 conductors (80 %)". */
export function bandLabel(band: { key: string; percent: number }): string {
  return `${band.key} conductors (${band.percent} %)`;
}

export const AMPACITY_NEC_REFERENCES =
  'Table 310.16, Table 310.15(B)(1)(1) (ambient temperature correction), Table 310.15(C)(1) (adjustment for more than three current-carrying conductors)';

export const AMPACITY_DEFAULTS: AmpacityInput = {
  size: '12',
  material: 'Cu',
  column: 60,
  ambientRow: '26–30',
  band: NO_ADJUSTMENT_BAND,
};
