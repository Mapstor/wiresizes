// The 200 A guide's figures (WSZ-008c): a 200 A dwelling service's conductors from NEC Table 310.12 beside the
// conductors Table 310.16 gives any other 200 A feeder at the column 110.14(C) sets above 100 A, the 240.4(B)
// next-size-up case, the two ground wires and the voltage drop. Every value is read from data/verified through the
// engines; nothing here is typed in.
import type { Material, SizeKey } from './verified/awg';
import { TERMINATION_RULES } from './verified/nec-110-14c';
import { TABLE_310_16_ROWS, columnKey, table31016 } from './verified/nec-310-16';
import type { AmpacityColumn } from './verified/nec-310-16';
import { VOLTAGE_DROP_NOTE } from './verified/nec-continuous-load-2023';
import { maxProtection } from './calculations/breaker-sizing';
import type { Protection } from './calculations/breaker-sizing';
import { egcFor, isEgcError } from './calculations/grounding';
import type { EgcResult } from './calculations/grounding';
import { SERVICE_VOLTS, TABLE_310_12_ROWS, isServiceError, minimumServiceAmpacity, serviceEntrance, serviceLookup } from './calculations/service-lookup';
import type { ServiceLookupResult, ServiceResult } from './calculations/service-lookup';
import { RESISTANCE_TEMP_C, lengthForDrop } from './calculations/voltage-drop';

/** The Table 310.16 column 110.14(C)(1)(b) sets for a feeder rated above 100 A: 75 °C. Throws at 100 A or less. */
export function feederColumn(ratingA: number): AmpacityColumn {
  if (!(ratingA > TERMINATION_RULES.limitA)) {
    throw new Error(`feederColumn: ${ratingA} A is not above the ${TERMINATION_RULES.limitA} A split of 110.14(C)`);
  }
  return TERMINATION_RULES.columnAboveLimit as AmpacityColumn;
}

export interface FeederSize {
  size: SizeKey;
  /** The size's ampacity in that column, A. */
  amps: number;
}

/** The smallest Table 310.16 size whose ampacity in the feeder column is at least the rating. */
export function feederSize(ratingA: number, material: Material): FeederSize {
  const key = columnKey(material, feederColumn(ratingA));
  for (const row of TABLE_310_16_ROWS) {
    const amps = row[key];
    if (amps !== null && amps >= ratingA) return { size: row.size, amps };
  }
  throw new Error(`feederSize: no Table 310.16 size carries ${ratingA} A in ${key}`);
}

// maxProtection and Protection moved to the breaker engine in WSZ-009c; re-exported for the 200 A guide and its tests
export { maxProtection };
export type { Protection };

export interface GuideSide {
  material: Material;
  /** Table 310.12's size for the service, and its ampacity in the feeder column. */
  dwelling: SizeKey;
  dwellingA: number;
  /** Table 310.16's size for any other feeder of the rating, and its ampacity. */
  feeder: SizeKey;
  feederA: number;
  /** From one size below the service size to one above the feeder size, with the feeder column's ampacity. */
  ladder: FeederSize[];
  /** What 240.4(B) lets protect the service size as a feeder of part of the load. */
  protection: Protection;
}

function guideSide(ratingA: number, material: Material, dwelling: SizeKey): GuideSide {
  const key = columnKey(material, feederColumn(ratingA));
  const listed = TABLE_310_16_ROWS.filter((r) => r[key] !== null).map((r) => r.size);
  const dwellingA = table31016(dwelling, key);
  if (dwellingA === null) throw new Error(`guideSide: ${dwelling} has no ${key} ampacity`);
  const feeder = feederSize(ratingA, material);
  const from = listed.indexOf(dwelling) - 1;
  const to = listed.indexOf(feeder.size) + 1;
  if (from < 0 || to >= listed.length) throw new Error('guideSide: the ladder runs off Table 310.16');
  const ladder = listed.slice(from, to + 1).map((size) => ({ size, amps: table31016(size, key) as number }));
  return { material, dwelling, dwellingA, feeder: feeder.size, feederA: feeder.amps, ladder, protection: maxProtection(dwellingA) };
}

function service(ratingA: number): ServiceLookupResult {
  const r = serviceLookup(ratingA);
  if (!r) throw new Error(`service guide: no Table 310.12 row for ${ratingA} A`);
  return r;
}

/** A run's length, current and drop. */
export type ServiceDrop = NonNullable<ServiceResult['drop']>;

function run(ratingA: number, material: Material, lengthFt: number): ServiceDrop {
  const r = serviceEntrance(ratingA, material, { lengthFt, amps: ratingA });
  if (isServiceError(r) || !r.drop) throw new Error(`service guide: no drop for ${ratingA} A over ${lengthFt} ft`);
  return r.drop;
}

function egc(ratingA: number): EgcResult {
  const r = egcFor(ratingA, 'Cu');
  if (isEgcError(r)) throw new Error(`service guide: no Table 250.122 row for ${ratingA} A`);
  return r;
}

/** The one-way length at which a service size at full load reaches the 215.2(A) note's feeder figure, ft. */
function noteLength(ratingA: number, size: SizeKey, material: Material): number {
  const ft = lengthForDrop(
    { size, material, amps: ratingA, volts: SERVICE_VOLTS, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C },
    VOLTAGE_DROP_NOTE.feederPct,
  );
  if (ft === null) throw new Error(`service guide: no note length for ${size} ${material}`);
  return ft;
}

/** A 200 A, 120/240 V dwelling service and a 200 A feeder that carries part of a load. */
export const GUIDE_200 = (() => {
  const ratingA = 200;
  const s = service(ratingA);
  const cu = guideSide(ratingA, 'Cu', s.cu);
  const al = guideSide(ratingA, 'Al', s.alCca);
  return {
    ratingA,
    service: s,
    /** 310.12(A): 83 % of the rating, A. */
    minA: minimumServiceAmpacity(ratingA),
    column: feederColumn(ratingA),
    cu,
    al,
    /** Table 250.122 for a 200 A feeder's overcurrent device. */
    egc: egc(ratingA),
    /** The full load over 100 ft, the golden voltage-drop case's run. */
    drop100: { cu: run(ratingA, 'Cu', 100), al: run(ratingA, 'Al', 100) },
    /** The full load over 175 ft, a searched run. */
    drop175: { cu: run(ratingA, 'Cu', 175), al: run(ratingA, 'Al', 175) },
    noteFt: { cu: noteLength(ratingA, s.cu, 'Cu'), al: noteLength(ratingA, s.alCca, 'Al') },
  };
})();

export interface RatingRow {
  ratingA: number;
  dwelling: { cu: SizeKey; al: SizeKey };
  feeder: { cu: FeederSize; al: FeederSize };
}

/** Every Table 310.12 rating above the 100 A split of 110.14(C), with Table 310.16's feeder sizes at that column. */
export const RATING_ROWS: RatingRow[] = TABLE_310_12_ROWS.filter((r) => r.ratingA > TERMINATION_RULES.limitA).map((r) => ({
  ratingA: r.ratingA,
  dwelling: { cu: r.cu, al: r.alCca },
  feeder: { cu: feederSize(r.ratingA, 'Cu'), al: feederSize(r.ratingA, 'Al') },
}));
