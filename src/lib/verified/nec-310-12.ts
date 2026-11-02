// data/verified/nec-310-12.json: NEC Table 310.12 (2023) conductor sizes for 120/240 V single-phase dwelling services
// and main power feeders, 100 A to 400 A.
import table from '../../../data/verified/nec-310-12.json';
import type { SizeKey } from './awg';

export interface ServiceRow {
  ratingA: number;
  cu: SizeKey;
  alCca: SizeKey;
}

/** The 11 rows of Table 310.12, 100 A to 400 A. */
export const TABLE_310_12_ROWS: ServiceRow[] = table.rows.map((row) => ({
  ratingA: row.rating_a,
  cu: row.cu,
  alCca: row.al_cca,
}));

/** The row for a rating, or null when the rating isn't a row: never interpolated. */
export function table31012(ratingA: number): ServiceRow | null {
  return TABLE_310_12_ROWS.find((row) => row.ratingA === ratingA) ?? null;
}
