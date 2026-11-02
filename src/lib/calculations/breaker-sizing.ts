// Breaker or fuse for a load, 210.20(A) and 215.3 (nec-continuous-load-2023.json): the device is rated at least the
// noncontinuous load plus 125 % of the continuous load; the next standard rating of Table 240.6(A) from 15 A (the
// lowest rating the wire size calculator offers); copper and aluminum conductors from the 60 °C sizing (ampacity at
// least the rating, then 240.4(D)); ground wires from Table 250.122.
import { CONTINUOUS_LOAD_PERCENT } from '../verified/nec-continuous-load-2023';
import { ocpdRatings } from '../verified/nec-240-6-a';
import { egc } from '../verified/nec-250-122';
import type { SizeKey } from '../verified/awg';
import { minimumConductor, RATING_MIN_A } from './conductor-sizing';

export const ENGINE_ID = 'breaker-sizing';
export const DOMAINS = ['nec-continuous-load', 'nec-240-ocpd', 'nec-310-16', 'nec-240-4-d', 'nec-250-grounding'];

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

/** Null for a negative or empty load, or one above the largest standard rating. */
export function breakerSizing(input: BreakerSizingInput): BreakerSizingResult | null {
  const { continuousA, noncontinuousA } = input;
  if (!(continuousA >= 0 && noncontinuousA >= 0 && continuousA + noncontinuousA > 0)) return null;
  const minOcpdA = noncontinuousA + (continuousA * CONTINUOUS_LOAD_PERCENT) / 100;
  const breakerA = ocpdRatings().find((a) => a >= RATING_MIN_A && a >= minOcpdA);
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
