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

function rulePercent(prefix: string): number {
  const rule = table.rules_seen.find((r) => r.startsWith(prefix));
  const match = rule === undefined ? null : /not less than (\d+) percent of the/.exec(rule);
  if (!match) throw new Error(`nec-310-12.json: no "not less than N percent" in the ${prefix} rule`);
  return Number(match[1]);
}

/**
 * 310.12(A) and (B), which the table applies: a dwelling service or main power feeder conductor needs an ampacity of
 * at least this percent of the service or feeder rating (83). Read from rules_seen; the two rules must agree.
 */
export const SERVICE_AMPACITY_PERCENT = rulePercent('310.12(A)');

if (rulePercent('310.12(B)') !== SERVICE_AMPACITY_PERCENT) {
  throw new Error('nec-310-12.json: the 310.12(A) and 310.12(B) rules give different percents');
}
