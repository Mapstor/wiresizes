// data/verified/nec-310-15-B-1-1.json: NEC Table 310.15(B)(1)(1) (2023) ambient temperature correction factors,
// based on 30 °C (86 °F), for the 60, 75 and 90 °C columns of Table 310.16.
import table from '../../../data/verified/nec-310-15-B-1-1.json';

export type CorrectionColumn = 'f_60' | 'f_75' | 'f_90';

export interface AmbientRow {
  /** The °C range, as the table prints it ("26–30", "10 or less"). */
  key: string;
  ambientF: string;
  f_60: number | null;
  f_75: number | null;
  f_90: number | null;
}

/** The 16 rows of Table 310.15(B)(1)(1), coldest first. */
export const AMBIENT_ROWS: AmbientRow[] = table.rows.map((row) => ({
  key: row.ambient_c,
  ambientF: row.ambient_f,
  f_60: row.f_60,
  f_75: row.f_75,
  f_90: row.f_90,
}));

/** The factor for an ambient row and column; null where the table has no factor (not permitted). */
export function correction(ambientRow: string, column: CorrectionColumn): number | null {
  const row = AMBIENT_ROWS.find((r) => r.key === ambientRow);
  if (!row) throw new Error(`Unknown Table 310.15(B)(1)(1) row: ${ambientRow}`);
  return row[column];
}
