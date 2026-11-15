// 120/240 V single-phase dwelling service or main power feeder: conductor sizes from NEC Table 310.12, then the
// grounding electrode conductor from Table 250.66 for each of those conductors (src/lib/verified/nec-250-66.ts turns
// each Table 250.66 cell into an area range).
import { SERVICE_AMPACITY_PERCENT, table31012, TABLE_310_12_ROWS } from '../verified/nec-310-12';
import { gec } from '../verified/nec-250-66';
import type { GecSizes } from '../verified/nec-250-66';
import type { Material, SizeKey } from '../verified/awg';
import { LENGTH_MAX_FT, voltageDrop } from './voltage-drop';
import type { VoltageDropResult } from './voltage-drop';

export const ENGINE_ID = 'service-lookup';
// conductor-resistance-20c since WSZ-008b: the service entrance calculator's voltage drop
export const DOMAINS = ['nec-310-12', 'nec-250-grounding', 'awg-geometry', 'conductor-resistance-20c'];

export { TABLE_310_12_ROWS } from '../verified/nec-310-12';
export type { ServiceRow } from '../verified/nec-310-12';
export type { GecSizes } from '../verified/nec-250-66';
// The names before WSZ-003a, for the guides
export { table31012 as serviceConductors } from '../verified/nec-310-12';
export { gec as gecForServiceConductor } from '../verified/nec-250-66';

/** 310.12(A): the least ampacity a dwelling service conductor needs for a service rating, in amperes (83 % of it). */
export function minimumServiceAmpacity(ratingA: number): number {
  return (ratingA * SERVICE_AMPACITY_PERCENT) / 100;
}

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

// ── The service entrance calculator in the look (WSZ-008b) ────────────────────────────────────────────────────────

/** The 120/240 V system's voltage between the two ungrounded conductors, which the voltage drop is a share of. */
export const SERVICE_VOLTS = 240;

export interface ServiceRun {
  /** One-way length of the service conductors, ft. */
  lengthFt: number;
  /** Load current, A (at most the rating). */
  amps: number;
}

export interface ServiceResult {
  lookup: ServiceLookupResult;
  material: Material;
  /** The Table 310.12 conductor in the chosen material, and the Table 250.66 electrode conductor for it. */
  size: SizeKey;
  gec: GecSizes;
  /** 310.12(A): the least ampacity the conductors need, 83 % of the rating. */
  minAmpacity: number;
  /** Voltage drop at 75 °C over the reader's run, single-phase at 240 V; null without a run. */
  drop: (ServiceRun & { result: VoltageDropResult }) | null;
}

export type ServiceError = 'rating-invalid' | 'length-invalid' | 'amps-invalid';

export function isServiceError(r: ServiceResult | { error: ServiceError }): r is { error: ServiceError } {
  return 'error' in r;
}

/** The service conductor, its electrode conductor and, with a run, the voltage drop at the load current. */
export function serviceEntrance(ratingA: number, material: Material, run?: ServiceRun | null): ServiceResult | { error: ServiceError } {
  const lookup = serviceLookup(ratingA);
  if (!lookup) return { error: 'rating-invalid' };
  const size = material === 'Cu' ? lookup.cu : lookup.alCca;
  const gecSizes = material === 'Cu' ? lookup.gecForCuService : lookup.gecForAlService;
  let drop: ServiceResult['drop'] = null;
  if (run) {
    if (!(Number.isFinite(run.lengthFt) && run.lengthFt > 0 && run.lengthFt <= LENGTH_MAX_FT)) return { error: 'length-invalid' };
    if (!(Number.isFinite(run.amps) && run.amps > 0 && run.amps <= ratingA)) return { error: 'amps-invalid' };
    const result = voltageDrop({ size, material, amps: run.amps, lengthFt: run.lengthFt, volts: SERVICE_VOLTS, phase: 'single' });
    if (!result) throw new Error(`No voltage drop for ${size} ${material}`);
    drop = { ...run, result };
  }
  return { lookup, material, size, gec: gecSizes, minAmpacity: minimumServiceAmpacity(ratingA), drop };
}
