// data/verified/nec-310-15-C-1.json: NEC Table 310.15(C)(1) (2023) adjustment percents for more than three
// current-carrying conductors in a raceway or cable.
import table from '../../../data/verified/nec-310-15-C-1.json';

// unit definition: 100 % is the whole Table 310.16 value. Table 310.16 is for not more than three current-carrying
// conductors, so 1–3 conductors take no adjustment.
const WHOLE_PERCENT = 100;

export interface AdjustmentRow {
  /** The conductor count band, as the table prints it ("4–6", "41 and above"). */
  key: string;
  percent: number;
}

/** The six rows of Table 310.15(C)(1), 4–6 conductors first. */
export const ADJUSTMENT_ROWS: AdjustmentRow[] = table.rows.map((row) => ({ key: row.conductors, percent: row.percent }));

/** Percent of the Table 310.16 value for a row key ("4–6"), or for null (1–3 conductors, no adjustment). */
export function adjustment(cccBand: string | null): number {
  if (cccBand === null) return WHOLE_PERCENT;
  const row = ADJUSTMENT_ROWS.find((r) => r.key === cccBand);
  if (!row) throw new Error(`Unknown Table 310.15(C)(1) band: ${cccBand}`);
  return row.percent;
}
