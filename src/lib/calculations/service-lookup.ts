// 120/240 V single-phase dwelling service or main power feeder: conductor sizes from NEC Table 310.12, then the
// grounding electrode conductor from Table 250.66 for each of those conductors (src/lib/verified/nec-250-66.ts turns
// each Table 250.66 cell into an area range).
import { table31012, TABLE_310_12_ROWS } from '../verified/nec-310-12';
import { gec } from '../verified/nec-250-66';
import type { GecSizes } from '../verified/nec-250-66';
import type { SizeKey } from '../verified/awg';

export const ENGINE_ID = 'service-lookup';
export const DOMAINS = ['nec-310-12', 'nec-250-grounding', 'awg-geometry'];

export { TABLE_310_12_ROWS } from '../verified/nec-310-12';
export type { ServiceRow } from '../verified/nec-310-12';
export type { GecSizes } from '../verified/nec-250-66';
// The names before WSZ-003a, for the guides
export { table31012 as serviceConductors } from '../verified/nec-310-12';
export { gec as gecForServiceConductor } from '../verified/nec-250-66';

export const NO_ROW_MESSAGE = 'Table 310.12 has no row for this rating.';
export const SCOPE_LINES = [
  'For a 120/240 V single-phase service or main power feeder of one dwelling unit. Other services are sized from Table 310.16. Where the conductors run hotter than 30 °C or with more than three current-carrying conductors, the corrections in Tables 310.15(B)(1)(1) and 310.15(C)(1) still apply.',
  "Grounding electrode conductor from NEC Table 250.66 (values from NFPA's 2020 grounding fact sheet).",
];

export interface ServiceLookupResult {
  ratingA: number;
  cu: SizeKey;
  alCca: SizeKey;
  gecForCuService: GecSizes;
  gecForAlService: GecSizes;
}

export function serviceLookup(ratingA: number): ServiceLookupResult | null {
  const row = table31012(ratingA);
  if (!row) return null;
  const gecForCuService = gec(row.cu, 'Cu');
  const gecForAlService = gec(row.alCca, 'Al');
  if (!gecForCuService || !gecForAlService) throw new Error(`No Table 250.66 row for the ${ratingA} A service`);
  return { ratingA, cu: row.cu, alCca: row.alCca, gecForCuService, gecForAlService };
}

export const SERVICE_RATINGS: number[] = TABLE_310_12_ROWS.map((row) => row.ratingA);

export const SERVICE_LOOKUP_DEFAULTS = { ratingA: 200 };
