// Breaker or fuse for a load, 210.20(A) and 215.3 (nec-continuous-load-2023.json): the device is rated at least the
// noncontinuous load plus 125 % of the continuous load; the next standard rating of Table 240.6(A) from 15 A (the
// lowest rating the wire size calculator offers). breakerSizing gives copper and aluminum from the 60 °C sizing (the
// golden "breaker-sizing" cases); breakerRun (WSZ-009c, the circuit breaker calculator) gives one material in the
// column the terminals allow (110.14(C), through conductor-sizing's minimumConductor), the 240.4(D) moves, the Table
// 250.122 ground wire, the next smaller size 240.4(B) lets the rating protect when it still carries the load
// (210.19(A)), and every step in words. largestBreaker is the other direction: the largest standard rating a size may
// have, 240.4(D) for the small sizes and 240.4(B) above them. maxProtection lives here since WSZ-009c (the 200 A guide
// reads it through src/lib/service-guides.ts).
import { CONTINUOUS_LOAD_PERCENT } from '../verified/nec-continuous-load-2023';
import { ocpdRatings } from '../verified/nec-240-6-a';
import { egc } from '../verified/nec-250-122';
import { max240_4D, NEXT_SIZE_UP_MAX_A } from '../verified/nec-240-4-d';
import { columnKey, table31016 } from '../verified/nec-310-16';
import type { AmpacityColumn } from '../verified/nec-310-16';
import { formatSize } from '../verified/awg';
import type { Material, SizeKey } from '../verified/awg';
import { indefiniteArticle, materialName, partsText } from './format';
import type { TextPart, ValuePart } from './format';
import { minimumConductor, RATING_MAX_A, RATING_MIN_A } from './conductor-sizing';
import type { MinimumConductor, Termination, WiringMethod } from './conductor-sizing';

export const ENGINE_ID = 'breaker-sizing';
export const DOMAINS = ['nec-continuous-load', 'nec-240-ocpd', 'nec-310-16', 'nec-110-14c', 'nec-240-4-d', 'nec-250-grounding'];
const CALC = `calc:${ENGINE_ID}`;
const CONT = 'nec-continuous-load';

export interface BreakerSizingInput {
  continuousA: number;
  noncontinuousA: number;
}

export interface BreakerSizingResult {
  /** Noncontinuous load + continuous load × CONTINUOUS_LOAD_PERCENT ÷ 100. */
  minOcpdA: number;
  /** The smallest standard rating at or above minOcpdA. */
  breakerA: number;
  /** null where no Table 310.16 size reaches the rating in the 60 °C column. */
  cu: SizeKey | null;
  al: SizeKey | null;
  egcCu: SizeKey | null;
  egcAl: SizeKey | null;
}

/** The smallest rating a load needs: the noncontinuous load plus CONTINUOUS_LOAD_PERCENT of the continuous load. */
export function minimumRating(continuousA: number, noncontinuousA: number): number {
  return noncontinuousA + (continuousA * CONTINUOUS_LOAD_PERCENT) / 100;
}

/** The largest continuous load a rating serves under 210.20(A): the rating × 100 ÷ CONTINUOUS_LOAD_PERCENT. */
export function largestContinuousLoad(ratingA: number): number {
  return (ratingA * 100) / CONTINUOUS_LOAD_PERCENT;
}

/** The smallest standard rating, from RATING_MIN_A, at or above a minimum; undefined above the last one. */
function standardRatingFor(minOcpdA: number): number | undefined {
  return ocpdRatings().find((a) => a >= RATING_MIN_A && a >= minOcpdA);
}

/** Null for a negative or empty load, or one above the largest standard rating. */
export function breakerSizing(input: BreakerSizingInput): BreakerSizingResult | null {
  const { continuousA, noncontinuousA } = input;
  if (!(continuousA >= 0 && noncontinuousA >= 0 && continuousA + noncontinuousA > 0)) return null;
  const minOcpdA = minimumRating(continuousA, noncontinuousA);
  const breakerA = standardRatingFor(minOcpdA);
  if (breakerA === undefined) return null;
  return {
    minOcpdA,
    breakerA,
    cu: minimumConductor({ ocpdA: breakerA, material: 'Cu' })?.size ?? null,
    al: minimumConductor({ ocpdA: breakerA, material: 'Al' })?.size ?? null,
    egcCu: egc(breakerA, 'Cu'),
    egcAl: egc(breakerA, 'Al'),
  };
}

export interface Protection {
  /** The largest standard rating that may protect the conductor, A. */
  ratingA: number;
  /** True when that rating is above the ampacity, under 240.4(B). */
  nextSizeUp: boolean;
}

/**
 * The largest standard rating of Table 240.6(A) that may protect a conductor of this ampacity: the ampacity itself when
 * it is a standard rating, otherwise the next higher standard rating where 240.4(B) allows it (not above 800 A),
 * otherwise the next lower one. 240.4(D) is not applied here: see largestBreaker.
 */
export function maxProtection(ampacity: number): Protection {
  const ratings = ocpdRatings();
  if (ratings.includes(ampacity)) return { ratingA: ampacity, nextSizeUp: false };
  const next = ratings.find((r) => r > ampacity);
  if (next !== undefined && next <= NEXT_SIZE_UP_MAX_A) return { ratingA: next, nextSizeUp: true };
  const below = ratings.filter((r) => r < ampacity);
  if (below.length === 0) throw new Error(`maxProtection: no standard rating below ${ampacity} A`);
  return { ratingA: below[below.length - 1], nextSizeUp: false };
}

export interface LargestBreaker {
  /** The size's Table 310.16 ampacity in the column. */
  ampacity: number;
  /** The largest standard rating that may protect it. */
  ratingA: number;
  /** ratingA is above the ampacity: 240.4(B), under its conditions. */
  nextSizeUp: boolean;
  /** 240.4(D) holds ratingA below what the ampacity alone allows. */
  limitedBy240_4D: boolean;
}

/** The largest breaker or fuse for a size in a column; null where the column has no value or 240.4(D) adds conditions. */
export function largestBreaker(size: SizeKey, material: Material, column: AmpacityColumn): LargestBreaker | null {
  const ampacity = table31016(size, columnKey(material, column));
  if (ampacity === null) return null;
  const limit = max240_4D(size, material);
  if (limit && limit.conditions !== null) return null;
  const p = maxProtection(ampacity);
  if (limit && limit.max_ocpd_a < p.ratingA) {
    return { ampacity, ratingA: limit.max_ocpd_a, nextSizeUp: limit.max_ocpd_a > ampacity, limitedBy240_4D: true };
  }
  return { ampacity, ratingA: p.ratingA, nextSizeUp: p.nextSizeUp, limitedBy240_4D: false };
}

export type BreakerError = 'load-invalid' | 'load-missing' | 'load-too-large';

export const BREAKER_ERROR_MESSAGES: Record<BreakerError, string> = {
  'load-invalid': 'Enter loads of 0 A or more.',
  'load-missing': 'Enter a continuous or a noncontinuous load.',
  'load-too-large': `This load needs a breaker above ${RATING_MAX_A} A, beyond this calculator.`,
};

export interface BreakerRunInput extends BreakerSizingInput {
  material: Material;
  /** Default 'cable' (NM or UF, 60 °C). */
  wiringMethod?: WiringMethod;
  /** Default 'unknown'. */
  termination?: Termination;
}

export interface BreakerRun {
  minOcpdA: number;
  breakerA: number;
  /** The Table 310.16 column the terminals allow. */
  columnC: AmpacityColumn;
  /** The smallest size that carries the rating, after 240.4(D). */
  size: SizeKey;
  ampacity: number;
  limitedBy240_4D: boolean;
  /** Table 250.122 for the rating. */
  egc: SizeKey | null;
  /** The largest continuous load the rating serves (210.20(A)). */
  maxContinuousA: number;
  /** 240.4(B): the next smaller size the rating may protect, when its ampacity still reaches minOcpdA (210.19(A)). */
  below: { size: SizeKey; ampacity: number } | null;
  steps: string[];
  stepParts: TextPart[][];
}

export function isBreakerError(r: BreakerRun | { error: BreakerError }): r is { error: BreakerError } {
  return 'error' in r;
}

/** A current: whole amperes as entered, others with up to two decimals. */
function amps(value: number, src: string): ValuePart {
  return { v: value, unit: 'A', src, format: Number.isInteger(value) ? undefined : { upTo: 2 } };
}

function explain(input: BreakerRunInput, minOcpdA: number, breakerA: number, m: MinimumConductor): TextPart[][] {
  const { continuousA: c, noncontinuousA: n, material } = input;
  const pct: ValuePart = { v: CONTINUOUS_LOAD_PERCENT, unit: '%', src: CONT };
  const metal = materialName(material);
  const col = columnKey(material, m.columnC);
  const steps: TextPart[][] = [];
  if (c > 0 && n > 0) {
    steps.push([
      'The breaker or fuse must be rated at least the noncontinuous load plus ',
      pct,
      ' of the continuous load (NEC 210.20(A)): ',
      amps(n, 'input'),
      ' + ',
      pct,
      ' × ',
      amps(c, 'input'),
      ' = ',
      amps(minOcpdA, CALC),
      '.',
    ]);
  } else if (c > 0) {
    steps.push(['The breaker or fuse must be rated at least ', pct, ' of the continuous load (NEC 210.20(A)): ', pct, ' × ', amps(c, 'input'), ' = ', amps(minOcpdA, CALC), '.']);
  } else {
    steps.push(['With no continuous load, the rating needs only to reach the load: ', amps(n, 'input'), '.']);
  }
  steps.push([
    'The smallest standard rating of NEC Table 240.6(A) at or above it',
    ...(minOcpdA < RATING_MIN_A ? [', from ', amps(RATING_MIN_A, CALC), ', the smallest this calculator offers'] : []),
    ': ',
    amps(breakerA, CALC),
    '.',
  ]);
  steps.push([
    `Smallest ${metal} size with a `,
    { v: m.columnC, unit: '°C', src: CALC },
    ' ampacity of at least ',
    amps(breakerA, CALC),
    ' in NEC Table 310.16: ',
    { size: m.firstSize },
    ' (',
    amps(table31016(m.firstSize, col) as number, CALC),
    ').',
  ]);
  for (const limit of m.limits240_4D) {
    const text: TextPart[] = ['NEC 240.4(D) limits ', { size: limit.size }, ` ${metal} to `, amps(limit.maxOcpdA, CALC)];
    steps.push(
      limit.movedTo === null
        ? [...text, ' overcurrent protection; ', amps(breakerA, CALC), ' is within that limit.']
        : [...text, ' overcurrent protection, so the size moves up to ', { size: limit.movedTo }, '.'],
    );
  }
  if (m.egc) {
    steps.push([
      `Ground wire for ${indefiniteArticle(breakerA)} `,
      amps(breakerA, CALC),
      ` breaker or fuse, NEC Table 250.122 (${material === 'Cu' ? 'copper' : 'aluminum or copper-clad aluminum'} column): `,
      { size: m.egc },
      '.',
    ]);
  }
  return steps;
}

export function breakerRun(input: BreakerRunInput): BreakerRun | { error: BreakerError } {
  const { continuousA: c, noncontinuousA: n, material } = input;
  if (!(Number.isFinite(c) && Number.isFinite(n) && c >= 0 && n >= 0)) return { error: 'load-invalid' };
  if (!(c + n > 0)) return { error: 'load-missing' };
  const minOcpdA = minimumRating(c, n);
  const breakerA = standardRatingFor(minOcpdA);
  if (breakerA === undefined || breakerA > RATING_MAX_A) return { error: 'load-too-large' };
  const m = minimumConductor({ ocpdA: breakerA, material, wiringMethod: input.wiringMethod ?? 'cable', termination: input.termination ?? 'unknown' });
  if (!m) throw new Error(`breakerRun: no ${materialName(material)} size carries ${breakerA} A`);
  const stepParts = explain(input, minOcpdA, breakerA, m);
  return {
    minOcpdA,
    breakerA,
    columnC: m.columnC,
    size: m.size,
    ampacity: table31016(m.size, columnKey(material, m.columnC)) as number,
    limitedBy240_4D: m.limitedBy240_4D,
    egc: m.egc,
    maxContinuousA: largestContinuousLoad(breakerA),
    below: m.below && m.below.ampacity >= minOcpdA ? m.below : null,
    steps: stepParts.map((parts) => partsText(parts, formatSize)),
    stepParts,
  };
}
