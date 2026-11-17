// data/verified/nec-ch9-annex-c.json: NEC 2023 conduit fill (registry domain nec-ch9-fill; WSZ-039). Chapter 9 Table 1
// with its Notes (First Revision 7763's base text, 2026 First Draft) and Informative Annex C Tables C.1 to C.13(A): the
// most conductors of one size in each trade size of 13 raceway types, as CMP-8's public input 1588 prints the 2023
// annex (no revision marks on those tables). The file throws at import unless its status is VERIFIED-2023 (D-09).
// Fixture wires are not carried; Table 4 (other than IMC) and Table 5 are not verified, so conductors of different
// sizes are not calculated anywhere on the site.
import data from '../../../data/verified/nec-ch9-annex-c.json';

export const CONDUIT_FILL_DOMAIN = 'nec-ch9-fill';

if (data.status !== 'VERIFIED-2023' || data.table_1.status !== 'VERIFIED-2023') {
  throw new Error('data/verified/nec-ch9-annex-c.json is not verified as 2023');
}

export interface TradeSize {
  /** The trade size as the NEC prints it: "1/2", "1-1/4". */
  trade: string;
  /** The metric designator: 16, 35. */
  metric: number;
}
export const TRADE_SIZES: TradeSize[] = data.trade_sizes;
if (TRADE_SIZES.length !== 13) throw new Error('Annex C: expected 13 trade sizes');

export interface Raceway {
  id: string;
  /** Its Annex C table, "C.1"; the compact table is the same with "(A)". */
  table: string;
  compactTable: string;
  name: string;
}
export const RACEWAYS: Raceway[] = data.raceways.map((r) => ({ id: r.id, table: r.table, compactTable: r.compact_table, name: r.name }));

/** Table 1: the percent of the cross section that conductors may fill, by how many there are. */
export const TABLE_1 = data.table_1.rows as { conductors: string; percent: number }[];
/** Table 1 Notes 4 and 7. */
export const FILL_NOTES = {
  nipplePercent: data.table_1.notes.nipple.percent,
  nippleMaxIn: data.table_1.notes.nipple.max_length_in,
  nippleMaxMm: data.table_1.notes.nipple.max_length_mm,
  roundUpDecimal: data.table_1.notes.round_up.decimal,
  jamLow: data.table_1.notes.jamming.ratio_low,
  jamHigh: data.table_1.notes.jamming.ratio_high,
};
export const FILL_PERCENT = {
  one: TABLE_1[0].percent,
  two: TABLE_1[1].percent,
  overTwo: TABLE_1[2].percent,
};
if (TABLE_1.map((r) => r.conductors).join('|') !== '1|2|over 2') throw new Error('Annex C: Table 1 rows moved');

type Row = (number | null)[];
const counts = data.counts as unknown as Record<string, Record<string, Record<string, Row>>>;

/**
 * Wire sizes smallest first, as Annex C prints them. A JSON object's integer-like keys ("14", "250") come back in
 * numeric order ahead of "1/0" and its kind, so every list of rows is sorted by this order, never by key order.
 */
const SIZE_ORDER = ['18', '16', '14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0', '250', '300', '350', '400', '500', '600', '700', '750', '800', '900', '1000', '1250', '1500', '1750', '2000'];
const sizeRank = (s: string) => {
  const k = SIZE_ORDER.indexOf(s);
  if (k < 0) throw new Error(`Annex C: unknown size ${s}`);
  return k;
};
/** A group's rows, smallest wire first. */
function orderedRows(block: Record<string, Row>): [string, Row][] {
  return Object.entries(block).sort((a, b) => sizeRank(a[0]) - sizeRank(b[0]));
}

/**
 * A conductor type the calculator offers, as rows of Annex C. A type can span two printed groups: THW and TW take
 * 14 to 8 AWG from their own rows and 6 AWG up from the rows they share with RHH and RHW without an outer covering;
 * XHHW takes 14 to 2 AWG from the rows it shares with ZW.
 */
export interface ConductorType {
  id: string;
  /** The types as the result names them. */
  label: string;
  /** The Annex C groups, in size order. */
  groups: string[];
  /** The compact-stranding group of the (A) tables, if the type has one. */
  compactGroup: string | null;
  compactLabel: string | null;
}
export const CONDUCTOR_TYPES: ConductorType[] = [
  { id: 'thhn', label: 'THHN, THWN, THWN-2', groups: ['thhn'], compactGroup: 'thhn-compact', compactLabel: 'THHN, THWN, THWN-2' },
  { id: 'xhhw', label: 'XHHW, XHHW-2, XHH', groups: ['xhhw-small', 'xhhw'], compactGroup: 'xhhw-compact', compactLabel: 'XHHW, XHHW-2' },
  { id: 'thw', label: 'THW, THW-2, THHW, TW', groups: ['tw-thw-small', 'tw-thw-rhh-bare'], compactGroup: 'thw-compact', compactLabel: 'THW, THW-2, THHW' },
  { id: 'rhh', label: 'RHH, RHW, RHW-2 with an outer covering', groups: ['rhh-rhw'], compactGroup: null, compactLabel: null },
  { id: 'rhh-bare', label: 'RHH, RHW, RHW-2 without an outer covering', groups: ['rhh-rhw-bare-small', 'tw-thw-rhh-bare'], compactGroup: null, compactLabel: null },
  { id: 'fep', label: 'FEP, FEPB', groups: ['fep'], compactGroup: null, compactLabel: null },
  { id: 'pfa', label: 'PFA, PFAH, TFE', groups: ['fep', 'pfa'], compactGroup: null, compactLabel: null },
  { id: 'z', label: 'Z', groups: ['z'], compactGroup: null, compactLabel: null },
];
const knownGroups = new Set(data.groups.map((g) => g.id));
for (const t of CONDUCTOR_TYPES) {
  for (const g of [...t.groups, ...(t.compactGroup ? [t.compactGroup] : [])]) if (!knownGroups.has(g)) throw new Error(`Annex C: no group ${g}`);
}

export function conductorType(id: string): ConductorType {
  const t = CONDUCTOR_TYPES.find((c) => c.id === id);
  if (!t) throw new Error(`Annex C: no conductor type ${id}`);
  return t;
}
export function raceway(id: string): Raceway {
  const r = RACEWAYS.find((x) => x.id === id);
  if (!r) throw new Error(`Annex C: no raceway ${id}`);
  return r;
}

/** The rows of a type in one table, keyed by size, smallest wire first; a compact size whose row is all dashes is left out. */
export function annexCRows(racewayId: string, typeId: string, compact: boolean): { size: string; counts: Row }[] {
  const r = raceway(racewayId);
  const t = conductorType(typeId);
  const table = counts[compact ? r.compactTable : r.table];
  if (!table) throw new Error(`Annex C: no table for ${racewayId}`);
  const groups = compact ? (t.compactGroup ? [t.compactGroup] : []) : t.groups;
  const rows: { size: string; counts: Row }[] = [];
  for (const g of groups) {
    const block = table[g];
    if (!block) throw new Error(`Annex C: table ${r.table} has no ${g} rows`);
    for (const [size, row] of orderedRows(block)) {
      if (row.length !== TRADE_SIZES.length) throw new Error(`Annex C: ${r.table} ${g} ${size} has ${row.length} cells`);
      if (row.every((v) => v === null)) continue;
      rows.push({ size, counts: row });
    }
  }
  return rows;
}

/** The trade sizes a raceway's table lists (a column with any count), as indexes into TRADE_SIZES. */
export function racewayTradeIndexes(racewayId: string): number[] {
  const r = raceway(racewayId);
  const block = counts[r.table];
  const any = TRADE_SIZES.map((_, k) => Object.values(block).some((g) => Object.values(g).some((row) => row[k] !== null)));
  return TRADE_SIZES.map((_, k) => k).filter((k) => any[k]);
}

/** Every Annex C cell the site carries, for the tests: [table, group, size, counts]. */
export function allAnnexCRows(): [string, string, string, Row][] {
  return Object.entries(counts).flatMap(([table, groups]) =>
    Object.entries(groups).flatMap(([g, rows]) => orderedRows(rows).map(([size, row]) => [table, g, size, row] as [string, string, string, Row])),
  );
}
