// data/verified/nec-240-4-d.json: NEC 240.4(D) (2023) overcurrent protection limits for small conductors. Rows with
// conditions (18 and 16 AWG copper, 14 AWG copper-clad aluminum) carry them as text; each row keeps its status (D-09).
import table from '../../../data/verified/nec-240-4-d.json';
import type { Material, SizeKey } from './awg';

export interface Limit240_4D {
  max_ocpd_a: number;
  conditions: string | null;
  status: string;
}

export interface Row240_4D extends Limit240_4D {
  size: SizeKey;
  material: Material | 'CCA';
}

/** Every row as the file holds it, conditional rows included, in file order. */
export const ROWS_240_4_D: Row240_4D[] = table.rows.map((r) => ({
  size: r.size,
  material: r.material as Material | 'CCA',
  max_ocpd_a: r.max_ocpd_a,
  conditions: r.conditions,
  status: r.status,
}));

/** The row for a size and material (Cu, Al or CCA), conditional rows included, or null. */
export function max240_4D(key: SizeKey, material: Material | 'CCA'): Limit240_4D | null {
  const row = table.rows.find((r) => r.size === key && r.material === material);
  return row ? { max_ocpd_a: row.max_ocpd_a, conditions: row.conditions, status: row.status } : null;
}
