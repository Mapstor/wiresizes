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
  /** The 2023 item number, "(D)(1)" to "(D)(8)". */
  item: string;
  size: SizeKey;
  material: Material | 'CCA';
}

/** Every row as the file holds it, conditional rows included, in file order. */
export const ROWS_240_4_D: Row240_4D[] = table.rows.map((r) => ({
  item: r.item,
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

/** A conditional row's conditions, read from its text for plain-words rendering (WSZ-005a). */
export interface Conditions240_4D {
  /** "Continuous loads do not exceed N amperes." */
  continuousMaxA: number;
  /** The fuse classes also permitted ("Class CC, Class CF, Class J, or Class T"), or null where the text names none. */
  fuseClasses: string[] | null;
}

/** Parses a conditional row's text; throws when a regenerated file words it differently (fix the pattern here). */
export function conditions240_4D(row: Row240_4D): Conditions240_4D | null {
  if (row.conditions === null) return null;
  const load = /Continuous loads do not exceed ([\d.]+) amperes\./.exec(row.conditions);
  if (!load) throw new Error(`nec-240-4-d.json ${row.item}: no "Continuous loads do not exceed N amperes."`);
  const fuses = /c\. ((?:Class [A-Z]+,? (?:or )?)+)fuses\./.exec(row.conditions);
  return {
    continuousMaxA: Number(load[1]),
    fuseClasses: fuses ? [...fuses[1].matchAll(/Class ([A-Z]+)/g)].map((m) => m[1]) : null,
  };
}
