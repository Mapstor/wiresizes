// WSZ-009c: the circuit breaker calculator. The engine's breakerRun (the 210.20(A) minimum, the standard rating, the
// wire in the terminal column, 240.4(D), the ground wire, the 240.4(B) note with 210.19(A)), largestBreaker, the move
// of maxProtection, the page's data and examples, and the route coming back from its WSZ-002 withdrawal.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  DOMAINS,
  ENGINE_ID,
  BREAKER_ERROR_MESSAGES,
  breakerRun,
  breakerSizing,
  isBreakerError,
  largestBreaker,
  largestContinuousLoad,
  maxProtection,
  minimumRating,
} from '../src/lib/calculations/breaker-sizing';
import type { BreakerRun, BreakerRunInput } from '../src/lib/calculations/breaker-sizing';
import { maxProtection as guideMaxProtection } from '../src/lib/service-guides';
import { RATING_MAX_A, RATING_MIN_A, WIRE_SIZE_RATINGS } from '../src/lib/calculations/conductor-sizing';
import { CONTINUOUS_EXAMPLES, CONTINUOUS_ROWS, MIXED, NEXT_SIZE_UP, WIRE_ROWS, WIRE_SIZES } from '../src/lib/breaker-page';
import { ocpdRatings } from '../src/lib/verified/nec-240-6-a';
import { max240_4D } from '../src/lib/verified/nec-240-4-d';
import { columnKey, table31016, TABLE_310_16_SIZES } from '../src/lib/verified/nec-310-16';
import { CONTINUOUS_LOAD_PERCENT } from '../src/lib/verified/nec-continuous-load-2023';
import { ROUTES } from '../src/lib/routes';
import PAGE_DATES from '../src/data/page-dates.json';

const CALC = `calc:${ENGINE_ID}`;
const RATINGS = ocpdRatings();
const ROUTE = '/calculators/circuit-breaker-calculator';

function ok(input: BreakerRunInput): BreakerRun {
  const r = breakerRun(input);
  if (isBreakerError(r)) throw new Error(`${r.error} for ${JSON.stringify(input)}`);
  return r;
}

describe('WSZ-009c breakerRun', () => {
  it('matches the golden breaker-sizing cases for copper NM cable', () => {
    for (const [c, n] of [[16, 0], [24, 0], [40, 0], [10, 8], [48, 0], [0, 100], [32, 0], [0, 15]]) {
      const golden = breakerSizing({ continuousA: c, noncontinuousA: n });
      assert.ok(golden);
      const r = ok({ continuousA: c, noncontinuousA: n, material: 'Cu' });
      assert.equal(r.minOcpdA, golden.minOcpdA);
      assert.equal(r.breakerA, golden.breakerA);
      assert.equal(r.size, golden.cu);
      assert.equal(r.egc, golden.egcCu);
      assert.equal(ok({ continuousA: c, noncontinuousA: n, material: 'Al' }).size, golden.al);
    }
  });

  it('takes the smallest standard rating at or above the minimum, from the calculator floor', () => {
    for (let c = 0; c <= 320; c += 0.5) {
      for (const n of [0, 3, 17.5]) {
        if (c + n === 0) continue;
        const r = breakerRun({ continuousA: c, noncontinuousA: n, material: 'Cu' });
        const min = n + (c * CONTINUOUS_LOAD_PERCENT) / 100;
        const expected = RATINGS.find((a) => a >= RATING_MIN_A && a >= min);
        if (expected === undefined || expected > RATING_MAX_A) {
          assert.deepEqual(r, { error: 'load-too-large' });
          continue;
        }
        assert.ok(!isBreakerError(r));
        if (isBreakerError(r)) continue;
        assert.equal(r.minOcpdA, min);
        assert.equal(r.breakerA, expected);
        assert.ok(r.ampacity >= r.breakerA, `${c} + ${n}`);
        assert.equal(r.maxContinuousA, (r.breakerA * 100) / CONTINUOUS_LOAD_PERCENT);
      }
    }
    assert.equal(ok({ continuousA: 320, noncontinuousA: 0, material: 'Cu' }).breakerA, 400);
    assert.deepEqual(breakerRun({ continuousA: 320.5, noncontinuousA: 0, material: 'Cu' }), { error: 'load-too-large' });
  });

  it('refuses an empty, a negative or a non-number load', () => {
    assert.deepEqual(breakerRun({ continuousA: 0, noncontinuousA: 0, material: 'Cu' }), { error: 'load-missing' });
    assert.deepEqual(breakerRun({ continuousA: -1, noncontinuousA: 5, material: 'Cu' }), { error: 'load-invalid' });
    assert.deepEqual(breakerRun({ continuousA: Number.NaN, noncontinuousA: 5, material: 'Cu' }), { error: 'load-invalid' });
    for (const message of Object.values(BREAKER_ERROR_MESSAGES)) assert.ok(message.length > 0);
  });

  it('reads the wire from the column the terminals allow', () => {
    // 60 A on single conductors with 75 °C terminals: 6 AWG copper (65 A); in cable at 60 °C: 4 AWG (70 A)
    assert.equal(ok({ continuousA: 48, noncontinuousA: 0, material: 'Cu', wiringMethod: 'conductors', termination: '75' }).size, '6');
    assert.equal(ok({ continuousA: 48, noncontinuousA: 0, material: 'Cu' }).size, '4');
    // over 100 A with terminals not known: 75 °C
    const big = ok({ continuousA: 60, noncontinuousA: 30, material: 'Al', wiringMethod: 'conductors', termination: 'unknown' });
    assert.equal(big.breakerA, 110);
    assert.equal(big.columnC, 75);
    assert.equal(big.size, '1/0');
  });

  it('explains each case in words, every value with its source', () => {
    assert.deepEqual(ok({ continuousA: 16, noncontinuousA: 0, material: 'Cu' }).steps, [
      'The breaker or fuse must be rated at least 125 % of the continuous load (NEC 210.20(A)): 125 % × 16 A = 20 A.',
      'The smallest standard rating of NEC Table 240.6(A) at or above it: 20 A.',
      'Smallest copper size with a 60 °C ampacity of at least 20 A in NEC Table 310.16: 12 AWG (20 A).',
      'NEC 240.4(D) limits 12 AWG copper to 20 A overcurrent protection; 20 A is within that limit.',
      'Ground wire for a 20 A breaker or fuse, NEC Table 250.122 (copper column): 12 AWG.',
    ]);
    assert.equal(
      ok({ continuousA: 10, noncontinuousA: 8, material: 'Cu' }).steps[0],
      'The breaker or fuse must be rated at least the noncontinuous load plus 125 % of the continuous load (NEC 210.20(A)): 8 A + 125 % × 10 A = 20.5 A.',
    );
    const small = ok({ continuousA: 0, noncontinuousA: 7, material: 'Al' }).steps;
    assert.equal(small[0], 'With no continuous load, the rating needs only to reach the load: 7 A.');
    assert.equal(small[1], 'The smallest standard rating of NEC Table 240.6(A) at or above it, from 15 A, the smallest this calculator offers: 15 A.');
    assert.ok(ok({ continuousA: 64, noncontinuousA: 0, material: 'Cu' }).steps.some((s) => s.startsWith('Ground wire for an 80 A breaker')));
    for (const r of [ok({ continuousA: 10, noncontinuousA: 8, material: 'Cu' }), ok({ continuousA: 0, noncontinuousA: 7, material: 'Al' })]) {
      for (const parts of r.stepParts) {
        for (const part of parts) {
          if (typeof part !== 'object' || 'size' in part) continue;
          assert.ok(part.src === 'input' || part.src === CALC || DOMAINS.includes(part.src), part.src);
        }
      }
    }
  });

  it('flags a ground wire larger than the wire, as Table 250.122 lists for 25 A aluminum', () => {
    const r = ok({ continuousA: 0, noncontinuousA: 25, material: 'Al' });
    assert.deepEqual([r.size, r.egc, r.egcLargerThanConductor], ['10', '8', true]);
    assert.equal(ok({ continuousA: 16, noncontinuousA: 0, material: 'Cu' }).egcLargerThanConductor, false);
  });

  it('notes the 240.4(B) size only when it still carries the minimum the load needs (210.19(A))', () => {
    const r44 = ok({ continuousA: 44, noncontinuousA: 0, material: 'Cu' });
    assert.equal(r44.breakerA, 60);
    assert.deepEqual(r44.below, { size: '6', ampacity: 55 });
    // 48 A continuous needs 60 A, and 6 AWG carries 55 A: no note
    assert.equal(ok({ continuousA: 48, noncontinuousA: 0, material: 'Cu' }).below, null);
    // 25 A: 12 AWG copper carries 20 A at 60 °C, but 240.4(D) holds it to 20 A
    assert.equal(ok({ continuousA: 0, noncontinuousA: 25, material: 'Cu' }).below, null);
    let notes = 0;
    for (const n of [5, 18, 33, 47, 55, 57, 77, 95, 113, 140, 190, 230, 290, 380]) {
      for (const material of ['Cu', 'Al'] as const) {
        const r = ok({ continuousA: 0, noncontinuousA: n, material });
        if (!r.below) continue;
        notes++;
        assert.ok(r.below.ampacity >= r.minOcpdA && r.below.ampacity < r.breakerA);
        assert.ok(!RATINGS.includes(r.below.ampacity));
        assert.equal(RATINGS.find((x) => x > r.below!.ampacity), r.breakerA);
        const limit = max240_4D(r.below.size, material);
        assert.ok(!limit || r.breakerA <= limit.max_ocpd_a);
      }
    }
    assert.ok(notes >= 5, `${notes} notes`);
  });
});

describe('WSZ-009c largestBreaker and maxProtection', () => {
  it('holds the small sizes to 240.4(D) in both columns', () => {
    for (const [size, material, limit] of [['14', 'Cu', 15], ['12', 'Cu', 20], ['10', 'Cu', 30], ['12', 'Al', 15], ['10', 'Al', 25]] as const) {
      for (const column of [60, 75] as const) {
        const b = largestBreaker(size, material, column);
        assert.ok(b);
        assert.equal(b.ratingA, limit, `${size} ${material} ${column}`);
        assert.equal(b.nextSizeUp, false);
      }
    }
  });

  it('above them, gives the ampacity when it is a standard rating and the next one under 240.4(B)', () => {
    for (const material of ['Cu', 'Al'] as const) {
      for (const size of WIRE_SIZES[material]) {
        if (max240_4D(size, material)) continue;
        for (const column of [60, 75] as const) {
          const b = largestBreaker(size, material, column);
          assert.ok(b);
          assert.equal(b.ampacity, table31016(size, columnKey(material, column)));
          if (RATINGS.includes(b.ampacity)) assert.deepEqual([b.ratingA, b.nextSizeUp], [b.ampacity, false]);
          else assert.deepEqual([b.ratingA, b.nextSizeUp], [RATINGS.find((r) => r > b.ampacity), true]);
        }
      }
    }
    assert.deepEqual(largestBreaker('6', 'Cu', 60), { ampacity: 55, ratingA: 60, nextSizeUp: true, limitedBy240_4D: false });
    assert.deepEqual(largestBreaker('8', 'Cu', 75), { ampacity: 50, ratingA: 50, nextSizeUp: false, limitedBy240_4D: false });
    assert.equal(largestBreaker('14', 'Al', 60), null);
  });

  it('still serves the 200 A guide through src/lib/service-guides.ts', () => {
    assert.equal(guideMaxProtection, maxProtection);
    assert.deepEqual(maxProtection(180), { ratingA: 200, nextSizeUp: true });
    assert.deepEqual(maxProtection(200), { ratingA: 200, nextSizeUp: false });
  });
});

describe('WSZ-009c page data', () => {
  it('caps the continuous load of each offered rating at the rating ÷ 1.25', () => {
    assert.deepEqual(
      CONTINUOUS_ROWS.map((r) => r.ratingA),
      WIRE_SIZE_RATINGS,
    );
    for (const r of CONTINUOUS_ROWS) {
      assert.equal(r.maxContinuousA, largestContinuousLoad(r.ratingA));
      assert.equal(minimumRating(r.maxContinuousA, 0), r.ratingA);
    }
    assert.deepEqual(
      CONTINUOUS_ROWS.filter((r) => [15, 20, 30, 50, 60].includes(r.ratingA)).map((r) => r.maxContinuousA),
      [12, 16, 24, 40, 48],
    );
  });

  it('lists the largest breaker for every common size in both columns', () => {
    for (const material of ['Cu', 'Al'] as const) {
      assert.deepEqual(
        WIRE_ROWS[material].map((r) => r.size),
        WIRE_SIZES[material],
      );
      for (const r of WIRE_ROWS[material]) {
        assert.ok(TABLE_310_16_SIZES.includes(r.size));
        assert.deepEqual(r.c60, largestBreaker(r.size, material, 60));
        assert.deepEqual(r.c75, largestBreaker(r.size, material, 75));
      }
    }
  });

  it('keeps the worked examples the copy states', () => {
    assert.deepEqual(
      CONTINUOUS_EXAMPLES.map((r) => [r.breakerA, r.size]),
      [
        [20, '12'],
        [30, '10'],
        [50, '6'],
        [60, '4'],
      ],
    );
    assert.deepEqual([MIXED.run.minOcpdA, MIXED.run.breakerA, MIXED.run.size, MIXED.run.ampacity], [20.5, 25, '10', 30]);
    assert.deepEqual([NEXT_SIZE_UP.run.minOcpdA, NEXT_SIZE_UP.run.breakerA, NEXT_SIZE_UP.run.size], [55, 60, '4']);
    assert.deepEqual(NEXT_SIZE_UP.run.below, { size: '6', ampacity: 55 });
  });
});

describe('WSZ-009c the route is back', () => {
  it('is in the route list with its dates and no longer withdrawn', () => {
    const route = ROUTES.find((r) => r.path === ROUTE);
    assert.ok(route);
    assert.equal(route.group, 'wire-sizing');
    assert.deepEqual((PAGE_DATES as Record<string, { published: string; modified: string }>)[ROUTE], { published: '2026-11-15', modified: '2026-11-15' });
    const withdrawals = readFileSync(join(process.cwd(), 'research', 'wsz002-withdrawals.csv'), 'utf8');
    assert.ok(!withdrawals.includes(`${ROUTE},`));
    const page = readFileSync(join(process.cwd(), 'src', 'app', 'calculators', 'circuit-breaker-calculator', 'page.tsx'), 'utf8');
    assert.ok(!page.includes('WithdrawnTool'));
  });
});
