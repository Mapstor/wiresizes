// Data of the circuit breaker calculator page (WSZ-009c), all from the breaker engine
// (src/lib/calculations/breaker-sizing.ts): the largest continuous load on each rating, the largest breaker for each
// wire size, and the worked examples (the golden "breaker-sizing" cases and one 240.4(B) case). Pure data, no JSX: the
// tests import it.
import { breakerRun, isBreakerError, largestBreaker, largestContinuousLoad } from './calculations/breaker-sizing';
import type { BreakerRun, BreakerRunInput, LargestBreaker } from './calculations/breaker-sizing';
import { WIRE_SIZE_RATINGS } from './calculations/conductor-sizing';
import type { Material, SizeKey } from './verified/awg';

/** One run of the engine, or a throw. */
export function run(input: BreakerRunInput): BreakerRun {
  const r = breakerRun(input);
  if (isBreakerError(r)) throw new Error(`breaker page: ${r.error} for ${JSON.stringify(input)}`);
  return r;
}

/** Each rating the calculator offers, with the largest continuous load it serves (210.20(A)). */
export const CONTINUOUS_ROWS = WIRE_SIZE_RATINGS.map((ratingA) => ({ ratingA, maxContinuousA: largestContinuousLoad(ratingA) }));

export const WIRE_SIZES: Record<Material, SizeKey[]> = {
  Cu: ['14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0'],
  Al: ['12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0'],
};

export interface WireRow {
  size: SizeKey;
  c60: LargestBreaker;
  c75: LargestBreaker;
}

function largest(size: SizeKey, material: Material, column: 60 | 75): LargestBreaker {
  const b = largestBreaker(size, material, column);
  if (!b) throw new Error(`breaker page: no largest breaker for ${size} ${material} at ${column} °C`);
  return b;
}

/** The largest breaker or fuse for each common size, in the 60 °C and 75 °C columns. */
export const WIRE_ROWS: Record<Material, WireRow[]> = {
  Cu: WIRE_SIZES.Cu.map((size) => ({ size, c60: largest(size, 'Cu', 60), c75: largest(size, 'Cu', 75) })),
  Al: WIRE_SIZES.Al.map((size) => ({ size, c60: largest(size, 'Al', 60), c75: largest(size, 'Al', 75) })),
};

export function wireRow(material: Material, size: SizeKey): WireRow {
  const row = WIRE_ROWS[material].find((r) => r.size === size);
  if (!row) throw new Error(`breaker page: no row for ${size} ${material}`);
  return row;
}

// Worked examples, each checked by tests/wsz009c-breaker.test.ts.
/** The golden continuous cases: 16, 24, 40 and 48 A continuous, copper NM cable. */
export const CONTINUOUS_EXAMPLES = [16, 24, 40, 48].map((continuousA) => run({ continuousA, noncontinuousA: 0, material: 'Cu' }));
/** The golden mixed case: 10 A continuous and 8 A noncontinuous. */
export const MIXED = { continuousA: 10, noncontinuousA: 8, run: run({ continuousA: 10, noncontinuousA: 8, material: 'Cu' }) };
/** 44 A continuous: a 60 A breaker, where 240.4(B) lets 6 AWG copper (55 A) serve. */
export const NEXT_SIZE_UP = { continuousA: 44, run: run({ continuousA: 44, noncontinuousA: 0, material: 'Cu' }) };
