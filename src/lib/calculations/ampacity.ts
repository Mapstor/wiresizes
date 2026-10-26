// Ampacity arithmetic: NEC Table 310.16 value × Table 310.15(B)(1)(1) ambient correction factor
// × Table 310.15(C)(1) adjustment percent, with the 240.4(D) overcurrent limit reported separately.
import corrections from '../../../data/verified/nec-310-15-B-1-1.json';
import adjustments from '../../../data/verified/nec-310-15-C-1.json';
import limits240_4D from '../../../data/verified/nec-240-4-d.json';
import { tableAmpacity, TABLE_310_16_SIZES } from './sizes';
import type { AmpacityColumn, Material, SizeKey } from './sizes';

export type CorrectionColumn = 'f_60' | 'f_75' | 'f_90';

export const NOT_PERMITTED_MESSAGE = 'Not permitted at this ambient temperature for this insulation rating';

export interface AmbientRow {
  key: string;
  ambientF: string;
  f_60: number | null;
  f_75: number | null;
  f_90: number | null;
}

/** The 16 rows of Table 310.15(B)(1)(1), coldest first. */
export const AMBIENT_ROWS: AmbientRow[] = corrections.rows.map((row) => ({
  key: row.ambient_c,
  ambientF: row.ambient_f,
  f_60: row.f_60,
  f_75: row.f_75,
  f_90: row.f_90,
}));

/** A Table 310.15(B)(1)(1) factor with two decimals, as the table prints it: 1.00, 1.20; "–" where none applies. */
export function formatFactor(factor: number | null): string {
  return factor === null ? '–' : factor.toFixed(2);
}

export function correctionFactor(ambientRow: string, column: CorrectionColumn): number | null {
  const row = AMBIENT_ROWS.find((r) => r.key === ambientRow);
  if (!row) throw new Error(`Unknown Table 310.15(B)(1)(1) row: ${ambientRow}`);
  return row[column];
}

/** Table 310.15(C)(1) bands; 1–3 current-carrying conductors take no adjustment (100 %). */
export const NO_ADJUSTMENT_BAND = '1–3';
export const ADJUSTMENT_BANDS: { key: string; percent: number }[] = [
  { key: NO_ADJUSTMENT_BAND, percent: 100 },
  ...adjustments.rows.map((row) => ({ key: row.conductors, percent: row.percent })),
];

export function adjustmentPercent(band: string): number {
  const row = ADJUSTMENT_BANDS.find((b) => b.key === band);
  if (!row) throw new Error(`Unknown Table 310.15(C)(1) band: ${band}`);
  return row.percent;
}

export interface Limit240_4D {
  max_ocpd_a: number;
  conditions: string | null;
  status: string;
}

/** The nec-240-4-d.json row for a size and material (Cu, Al or CCA), conditional rows included, or null. */
export function maxOcpd240_4D(size: SizeKey, material: Material | 'CCA'): Limit240_4D | null {
  const row = limits240_4D.rows.find((r) => r.size === size && r.material === material);
  return row ? { max_ocpd_a: row.max_ocpd_a, conditions: row.conditions, status: row.status } : null;
}

export function ocpdLimitLabel(maxOcpdA: number): string {
  return `Overcurrent protection limited to ${maxOcpdA} A (NEC 240.4(D))`;
}

/** The 240.4(D) label shown beside a result: 14, 12 and 10 AWG copper and 12 and 10 AWG aluminum only. */
export function displayedOcpdLimit(size: SizeKey, material: Material): string | null {
  const shown = material === 'Cu' ? ['14', '12', '10'] : ['12', '10'];
  if (!shown.includes(size)) return null;
  const row = maxOcpd240_4D(size, material);
  return row && row.conditions === null ? ocpdLimitLabel(row.max_ocpd_a) : null;
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
}

export function calculateAmpacity(input: AmpacityInput): AmpacityResult {
  const base = tableAmpacity(input.size, input.material, input.column);
  const factor = correctionFactor(input.ambientRow, `f_${input.column}` as CorrectionColumn);
  const percent = adjustmentPercent(input.band);
  const notPermitted = factor === null;
  return {
    tableAmpacity: base,
    correctionFactor: factor,
    adjustmentPercent: percent,
    ampacity: base === null || factor === null ? null : (base * factor * percent) / 100,
    notPermitted,
    ocpdLimit: displayedOcpdLimit(input.size, input.material),
  };
}

/** Sizes the ampacity calculator offers: Table 310.16 from 14 AWG to 2000 kcmil. */
export const AMPACITY_SIZES: SizeKey[] = TABLE_310_16_SIZES.slice(TABLE_310_16_SIZES.indexOf('14'));

export const COLUMN_OPTIONS: { value: AmpacityColumn; label: string }[] = [
  { value: 60, label: '60°C (140°F)' },
  { value: 75, label: '75°C (167°F)' },
  { value: 90, label: '90°C (194°F)' },
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
