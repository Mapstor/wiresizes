// Equipment grounding conductor from NEC Table 250.122: the first row whose overcurrent device rating is not
// exceeded; copper column for copper, aluminum or copper-clad aluminum column for aluminum.
import table250122 from '../../../data/verified/nec-250-122.json';
import ratings from '../../../data/verified/nec-240-6-a.json';
import type { Material, SizeKey } from './sizes';

export const PROPORTIONAL_NOTE =
  'Size increases in proportion if the phase conductors are upsized (NEC 250.122(B)); the wire size calculator does this.';

export interface EgcRow {
  rowA: number;
  cu: SizeKey;
  alCca: SizeKey;
}

/** The 19 rows of Table 250.122, 15 A to 6000 A. */
export const TABLE_250_122_ROWS: EgcRow[] = table250122.rows.map((row) => ({
  rowA: row.ocpd_a_not_exceeding,
  cu: row.cu,
  alCca: row.al_cca,
}));

export function egcForOcpd(ocpdA: number): EgcRow | null {
  if (!(ocpdA > 0)) return null;
  return TABLE_250_122_ROWS.find((row) => row.rowA >= ocpdA) ?? null;
}

export function egcSize(ocpdA: number, material: Material): SizeKey | null {
  const row = egcForOcpd(ocpdA);
  if (!row) return null;
  return material === 'Cu' ? row.cu : row.alCca;
}

/** Breaker and fuse ratings offered: NEC Table 240.6(A) ratings from 15 A to 6000 A. */
export const GROUND_WIRE_RATINGS: number[] = ratings.ratings_a.filter((a) => a >= 15 && a <= 6000);

export const GROUND_WIRE_DEFAULTS = { ocpdA: 20 };
