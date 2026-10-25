// 120/240 V single-phase dwelling service or main power feeder: conductor sizes from NEC Table 310.12, then the
// grounding electrode conductor from Table 250.66 for each of those conductors. Each Table 250.66 cell ("2 or
// smaller", "1 or 1/0", "Over 3/0 through 350", "Over 1100") becomes an area range: AWG sizes from awg.json, kcmil
// numbers as kcmil × 1000 cmil (awg.json has no 1100 kcmil row).
import table31012 from '../../../data/verified/nec-310-12.json';
import table25066 from '../../../data/verified/nec-250-66.json';
import { areaCmil, isKcmil } from './sizes';
import type { SizeKey } from './sizes';

export const NO_ROW_MESSAGE = 'Table 310.12 has no row for this rating.';
export const SCOPE_LINES = [
  'For a 120/240 V single-phase service or main power feeder of one dwelling unit. Other services are sized from Table 310.16. Where the conductors run hotter than 30 °C or with more than three current-carrying conductors, the corrections in Tables 310.15(B)(1)(1) and 310.15(C)(1) still apply.',
  "Grounding electrode conductor from NEC Table 250.66 (values from NFPA's 2020 grounding fact sheet).",
];

export interface ServiceRow {
  ratingA: number;
  cu: SizeKey;
  alCca: SizeKey;
}

/** The 11 rows of Table 310.12, 100 A to 400 A. */
export const TABLE_310_12_ROWS: ServiceRow[] = table31012.rows.map((row) => ({
  ratingA: row.rating_a,
  cu: row.cu,
  alCca: row.al_cca,
}));

export const SERVICE_RATINGS: number[] = TABLE_310_12_ROWS.map((row) => row.ratingA);

/** Table 310.12 row for a rating, or null: no interpolation between rows. */
export function serviceConductors(ratingA: number): ServiceRow | null {
  return TABLE_310_12_ROWS.find((row) => row.ratingA === ratingA) ?? null;
}

interface AreaRange {
  /** Inclusive lower bound in cmil, or null. */
  min: number | null;
  /** Exclusive lower bound in cmil ("Over …"), or null. */
  above: number | null;
  /** Inclusive upper bound in cmil, or null. */
  max: number | null;
}

function sizeArea(token: string): number {
  return isKcmil(token) ? Number(token) * 1000 : areaCmil(token);
}

export function parseCell(cell: string): AreaRange {
  let match = /^(\S+) or smaller$/.exec(cell);
  if (match) return { min: null, above: null, max: sizeArea(match[1]) };
  match = /^(\S+) or (\S+)$/.exec(cell);
  if (match) return { min: sizeArea(match[1]), above: null, max: sizeArea(match[2]) };
  match = /^Over (\S+) through (\S+)$/.exec(cell);
  if (match) return { min: null, above: sizeArea(match[1]), max: sizeArea(match[2]) };
  match = /^Over (\S+)$/.exec(cell);
  if (match) return { min: null, above: sizeArea(match[1]), max: null };
  throw new Error(`Unrecognised Table 250.66 cell: ${cell}`);
}

function inRange(area: number, range: AreaRange): boolean {
  return (
    (range.min === null || area >= range.min) &&
    (range.above === null || area > range.above) &&
    (range.max === null || area <= range.max)
  );
}

export interface GecSizes {
  cu: SizeKey;
  alCca: SizeKey;
}

const TABLE_250_66_ROWS = table25066.rows.map((row) => ({
  cu: parseCell(row.service_cu),
  alCca: parseCell(row.service_al_cca),
  gec: { cu: row.gec_cu, alCca: row.gec_al_cca } as GecSizes,
}));

/** Copper and aluminum/CCA grounding electrode conductors for a service conductor of the given material. */
export function gecForServiceConductor(size: SizeKey, material: 'Cu' | 'Al'): GecSizes | null {
  const area = areaCmil(size);
  const row = TABLE_250_66_ROWS.find((r) => inRange(area, material === 'Cu' ? r.cu : r.alCca));
  return row ? row.gec : null;
}

export interface ServiceLookupResult {
  ratingA: number;
  cu: SizeKey;
  alCca: SizeKey;
  gecForCuService: GecSizes;
  gecForAlService: GecSizes;
}

export function serviceLookup(ratingA: number): ServiceLookupResult | null {
  const row = serviceConductors(ratingA);
  if (!row) return null;
  const gecForCuService = gecForServiceConductor(row.cu, 'Cu');
  const gecForAlService = gecForServiceConductor(row.alCca, 'Al');
  if (!gecForCuService || !gecForAlService) throw new Error(`No Table 250.66 row for the ${ratingA} A service`);
  return { ratingA, cu: row.cu, alCca: row.alCca, gecForCuService, gecForAlService };
}

export const SERVICE_LOOKUP_DEFAULTS = { ratingA: 200 };
