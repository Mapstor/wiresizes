// data/verified/nec-240-4-d.json: NEC 240.4(D) (2023) overcurrent protection limits for small conductors. Rows with
// conditions (18 and 16 AWG copper, 14 AWG copper-clad aluminum) carry them as text; each row keeps its status (D-09).
import table from '../../../data/verified/nec-240-4-d.json';
import type { Material, SizeKey } from './awg';

export interface Limit240_4D {
  max_ocpd_a: number;
  conditions: string | null;
  status: string;
}

/** The row for a size and material (Cu, Al or CCA), conditional rows included, or null. */
export function max240_4D(key: SizeKey, material: Material | 'CCA'): Limit240_4D | null {
  const row = table.rows.find((r) => r.size === key && r.material === material);
  return row ? { max_ocpd_a: row.max_ocpd_a, conditions: row.conditions, status: row.status } : null;
}
