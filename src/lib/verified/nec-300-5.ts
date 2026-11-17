// data/verified/nec-300-5-2023.json: NEC 2023 Table 300.5(A), minimum cover for underground wiring of 0 to 1000 V ac
// (registry domain nec-300-5-burial; verified-sd2023, rendered as 2023 under D-09). Only the three wiring-method
// columns a feeder uses and the five locations a garage run meets are read here, and never an EMT depth: the file
// leaves EMT's column unresolved (its render rules). Row 3, under a building, has unresolved qualifiers and is left out.
import data from '../../../data/verified/nec-300-5-2023.json';

export const NEC_300_5_DOMAIN = 'nec-300-5-burial';

/** The wiring methods, by Table 300.5(A) column. */
export type BurialMethod = 'direct' | 'rmc' | 'nonmetallic';
/** The locations, by Table 300.5(A) row. */
export type BurialPlace = 'general' | 'trench-concrete' | 'slab' | 'dwelling-driveway' | 'street';

export const BURIAL_METHODS: { id: BurialMethod; column: 1 | 2 | 3; label: string; pick: string }[] = [
  { id: 'direct', column: 1, label: 'Cable or conductors buried directly', pick: 'Buried directly' },
  { id: 'nonmetallic', column: 3, label: 'Nonmetallic conduit listed for direct burial', pick: 'Nonmetallic conduit' },
  { id: 'rmc', column: 2, label: 'Rigid or intermediate metal conduit', pick: 'RMC or IMC conduit' },
];

/** label: the place as Table 300.5(A) words it, for lists; pick: the same place in a select box a phone can show whole;
 *  short: the same place in a sentence, without numbers. */
export const BURIAL_PLACES: { id: BurialPlace; row: number; label: string; pick: string; short: string }[] = [
  { id: 'general', row: 1, label: 'Lawn or open ground (any place not listed below)', pick: 'Lawn or open ground', short: 'under open ground' },
  {
    id: 'trench-concrete',
    row: 2,
    label: 'In a trench below 2 in thick concrete or equivalent',
    pick: 'Trench, 2 in concrete',
    short: 'in a trench under concrete',
  },
  {
    id: 'slab',
    row: 4,
    label: 'Under an exterior concrete slab at least 4 in thick with no vehicle traffic, extending at least 6 in past the run',
    pick: 'Under a 4 in slab',
    short: 'under an exterior concrete slab with no vehicle traffic',
  },
  {
    id: 'dwelling-driveway',
    row: 6,
    label: 'Under a one- or two-family dwelling driveway or parking area',
    pick: 'Home driveway or parking',
    short: 'under a dwelling driveway',
  },
  {
    id: 'street',
    row: 5,
    label: 'Under a street, road, alley, or other driveway or parking lot',
    pick: 'Street or other driveway',
    short: 'under a street or other driveway',
  },
];

interface RawRow {
  row: number;
  location: string;
  all_columns_in?: number;
  all_columns_mm?: number;
  [key: string]: unknown;
}

const table = data.table_300_5_A as unknown as { status: string; rows: RawRow[]; notes: Record<string, string> };
if (!table.status.startsWith('verified-sd2023')) throw new Error('nec-300-5-2023.json: Table 300.5(A) is not verified-sd2023');

export interface Cover {
  inches: number;
  mm: number;
}

function cell(row: RawRow, column: 1 | 2 | 3): Cover {
  const inches = row.all_columns_in ?? row[`col${column}_in`];
  const mm = row.all_columns_mm ?? row[`col${column}_mm`];
  if (typeof inches !== 'number' || typeof mm !== 'number') throw new Error(`Table 300.5(A): no column ${column} value in row ${row.row}`);
  return { inches, mm };
}

/** The minimum cover for a method and a location, Table 300.5(A). */
export function burialCover(method: BurialMethod, place: BurialPlace): Cover {
  const m = BURIAL_METHODS.find((x) => x.id === method);
  const p = BURIAL_PLACES.find((x) => x.id === place);
  if (!m || !p) throw new Error(`Table 300.5(A): unknown ${method} or ${place}`);
  const row = table.rows.find((r) => r.row === p.row);
  if (!row) throw new Error(`Table 300.5(A): no row ${p.row}`);
  return cell(row, m.column);
}

/** Table 300.5(A) Note 1: cover is measured from the top of the cable, conductor or raceway to the top of finished grade. */
export const COVER_NOTE = (() => {
  const n = table.notes['1'];
  if (!n || !n.includes('top surface of any direct-buried conductor, cable, conduit, or other raceway') || !n.includes('finished grade')) {
    throw new Error('nec-300-5-2023.json: Note 1 changed');
  }
  return n;
})();
