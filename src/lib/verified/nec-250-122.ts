// data/verified/nec-250-122.json: NEC Table 250.122 equipment grounding conductor (EGC) sizes by the rating of the
// overcurrent device ahead of the circuit, and the 250.122(B) proportional increase (rule_250_122_b, verified-sd2023).
import table from '../../../data/verified/nec-250-122.json';
import { areaCmil } from './awg';
import type { Material, SizeKey } from './awg';
import { smallestSizeWithArea } from './nec-310-16';

export interface EgcRow {
  rowA: number;
  cu: SizeKey;
  alCca: SizeKey;
}

/** The 19 rows of Table 250.122, 15 A to 6000 A. */
export const TABLE_250_122_ROWS: EgcRow[] = table.rows.map((row) => ({
  rowA: row.ocpd_a_not_exceeding,
  cu: row.cu,
  alCca: row.al_cca,
}));

/** The first row whose rating the device does not exceed, or null above 6000 A (and for 0 A or less). */
export function egcRow(ocpdA: number): EgcRow | null {
  if (!(ocpdA > 0)) return null;
  return TABLE_250_122_ROWS.find((row) => row.rowA >= ocpdA) ?? null;
}

/** The EGC for a rating: the copper column, or the aluminum or copper-clad aluminum column for aluminum. */
export function egc(ocpdA: number, material: Material): SizeKey | null {
  const row = egcRow(ocpdA);
  if (!row) return null;
  return material === 'Cu' ? row.cu : row.alCca;
}

export interface EgcProportional {
  /** Table EGC area × installed area ÷ minimum area, in cmil. */
  requiredCmil: number;
  /** null when no Table 310.16 size reaches the required area. */
  egc: SizeKey | null;
}

/**
 * 250.122(B) (rule_250_122_b.method) when the ungrounded conductors are larger than the minimum size: the table EGC's
 * area × the installed size's area ÷ the minimum size's area, multiplied before dividing; the smallest Table 310.16
 * size at or above it, never smaller than the table EGC, and not capped at the conductor (D-08).
 */
export function egcProportional(egcSize: SizeKey, minSize: SizeKey, installedSize: SizeKey): EgcProportional {
  const requiredCmil = (areaCmil(egcSize) * areaCmil(installedSize)) / areaCmil(minSize);
  const candidate = smallestSizeWithArea(requiredCmil);
  return {
    requiredCmil,
    egc: candidate === null ? null : areaCmil(candidate) >= areaCmil(egcSize) ? candidate : egcSize,
  };
}
