// WSZ-009b: the wire size calculator in the look. The engine's continuous-load check (210.20(A), 210.19(A)), the
// derating steps, the 240.4(B) note, the errors that replace a throw, and the page's data and examples.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DOMAINS,
  ENGINE_ID,
  SIZING_ERROR_MESSAGES,
  WIRE_SIZE_RATINGS,
  isSizingError,
  ratingForContinuous,
  sizeConductor,
} from '../src/lib/calculations/conductor-sizing';
import type { SizeConductorInput, SizeConductorResult } from '../src/lib/calculations/conductor-sizing';
import { partsText } from '../src/lib/calculations/format';
import type { TextPart } from '../src/lib/calculations/format';
import { formatSize } from '../src/lib/verified/awg';
import { CONTINUOUS_LOAD_PERCENT } from '../src/lib/verified/nec-continuous-load-2023';
import { ocpdRatings } from '../src/lib/verified/nec-240-6-a';
import { max240_4D, NEXT_SIZE_UP_MAX_A } from '../src/lib/verified/nec-240-4-d';
import { COLUMN_TYPES, columnKey, table31016, TABLE_310_16_SIZES } from '../src/lib/verified/nec-310-16';
import {
  BUNDLED,
  BUNDLED_8_A,
  BUNDLED_PLAIN,
  CONTINUOUS,
  CONTINUOUS_NEEDED_A,
  CONTINUOUS_RATING_A,
  LENGTH_MAX_FT_CHART,
  LENGTH_TRACKS,
  LONG_RUN,
  LONG_RUN_AT_12,
  RATING_ROWS,
} from '../src/lib/wire-size-page';

const CALC = `calc:${ENGINE_ID}`;
const BASE = { material: 'Cu', lengthFt: 50, volts: 240, phase: 'single' } as const;

function ok(input: SizeConductorInput): SizeConductorResult {
  const r = sizeConductor(input);
  if (isSizingError(r)) throw new Error(`${r.error} for ${JSON.stringify(input)}`);
  return r;
}
const text = (r: SizeConductorResult) => r.stepParts.map((p) => partsText(p, formatSize));

describe('WSZ-009b continuous loads', () => {
  it('asks for a rating of at least 125 % of a continuous load', () => {
    assert.equal(CONTINUOUS_LOAD_PERCENT, 125);
    assert.deepEqual(sizeConductor({ ...BASE, ocpdA: 20, loadA: 17, continuous: true }), { error: 'rating-below-continuous' });
    assert.ok(!isSizingError(sizeConductor({ ...BASE, ocpdA: 20, loadA: 16, continuous: true })));
    // the same load is fine when it is not continuous
    assert.ok(!isSizingError(sizeConductor({ ...BASE, ocpdA: 20, loadA: 17 })));
    assert.match(SIZING_ERROR_MESSAGES['rating-below-continuous'], /125 %.*210\.20\(A\)/);
  });

  it('names the smallest standard rating for a continuous load', () => {
    assert.equal(ratingForContinuous(16), 20);
    assert.equal(ratingForContinuous(17), 25);
    assert.equal(ratingForContinuous(48), 60);
    assert.equal(ratingForContinuous(400), null);
    for (const a of [1, 7.5, 24, 33, 100, 250, 320]) {
      const r = ratingForContinuous(a);
      if (r === null) continue;
      assert.ok(r >= (a * CONTINUOUS_LOAD_PERCENT) / 100 && WIRE_SIZE_RATINGS.includes(r));
      assert.ok(WIRE_SIZE_RATINGS.filter((x) => x < r).every((x) => x < (a * CONTINUOUS_LOAD_PERCENT) / 100), `${a} A`);
    }
  });

  it('explains the rule with a load, and the largest continuous load without one', () => {
    const withLoad = text(ok({ ...BASE, ocpdA: 20, loadA: 16, continuous: true }));
    assert.equal(
      withLoad[0],
      'A continuous load of 16 A needs a breaker or fuse rated at least 125 % of it, 20 A (NEC 210.20(A)), and conductors with at least that ampacity (NEC 210.19(A)). The 20 A rating meets the first, and a size that carries the rating meets the second.',
    );
    const without = text(ok({ ...BASE, ocpdA: 60, continuous: true }));
    assert.equal(without[0], 'For a continuous load, the breaker or fuse must be rated at least 125 % of the load (NEC 210.20(A)): a 60 A rating serves a continuous load of up to 48 A.');
    assert.ok(!text(ok({ ...BASE, ocpdA: 60 })).some((s) => s.includes('continuous')));
  });
});

describe('WSZ-009b derating steps', () => {
  it('always returns steps, and the derating steps name the factor and the adjustment that apply', () => {
    const hot = ok({ ...BASE, ocpdA: 30, wiringMethod: 'conductors', termination: 'unknown', ambientRow: '41–45', cccBand: '4–6', lengthFt: 60 });
    assert.equal(hot.size, '8');
    assert.deepEqual(text(hot).slice(0, 2), [
      'The corrections start from the 90 °C column (conductors rated 90 °C): the ambient factor 0.87 (NEC Table 310.15(B)(1)(1)) and the adjustment for 4–6 current-carrying conductors, 80 % (NEC Table 310.15(C)(1)).',
      'Smallest copper size whose corrected ampacity, held to its 60 °C value, is at least 30 A: 8 AWG (38.3 A).',
    ]);
    const bundled = text(ok({ ...BASE, ocpdA: 50, wiringMethod: 'conductors', termination: '75', ambientRow: '26–30', cccBand: '7–9' }));
    assert.equal(bundled[0], 'The corrections start from the 90 °C column (conductors rated 90 °C): the adjustment for 7–9 current-carrying conductors, 70 % (NEC Table 310.15(C)(1)).');
    const cable = text(ok({ ...BASE, ocpdA: 30, wiringMethod: 'cable', ambientRow: '11–15' }));
    assert.equal(cable[0], 'The corrections start from the 60 °C column: the ambient factor 1.22 (NEC Table 310.15(B)(1)(1)).');
    assert.deepEqual(hot.steps, text(hot));
  });

  it('cites every value: an input, the engine or one of its domains', () => {
    const runs = [
      ok({ ...BASE, ocpdA: 30, wiringMethod: 'conductors', ambientRow: '41–45', cccBand: '4–6' }),
      ok({ ...BASE, ocpdA: 60, loadA: 40, continuous: true }),
      ok({ ...BASE, ocpdA: 40, continuous: true }),
    ];
    for (const r of runs) {
      for (const parts of r.stepParts) {
        for (const part of parts as TextPart[]) {
          if (typeof part !== 'object' || 'size' in part) continue;
          assert.ok(part.src === 'input' || part.src === CALC || DOMAINS.includes(part.src), part.src);
        }
      }
    }
  });

  it('returns errors where the derating leaves no factor or no size', () => {
    // NM cable stays at 60 °C, and Table 310.15(B)(1)(1) gives that column no factor at 56–60 °C
    assert.deepEqual(sizeConductor({ ...BASE, ocpdA: 20, wiringMethod: 'cable', ambientRow: '56–60' }), { error: 'ambient-no-factor' });
    assert.deepEqual(sizeConductor({ ...BASE, ocpdA: 400, wiringMethod: 'conductors', ambientRow: '81–85', cccBand: '41 and above' }), { error: 'no-size' });
    assert.ok(SIZING_ERROR_MESSAGES['ambient-no-factor'].length > 0 && SIZING_ERROR_MESSAGES['no-size'].length > 0);
  });
});

describe('WSZ-009b 240.4(B) note', () => {
  const RATINGS = ocpdRatings();

  it('offers the next smaller size only under all of 240.4(B), 240.4(D) and the load', () => {
    const r60 = ok({ ...BASE, ocpdA: 60, lengthFt: 0 });
    assert.deepEqual(r60.nextSizeUp, { size: '6', ampacity: 55, maxLoadA: 55, maxContinuousA: 44 });
    // a load the smaller size cannot carry, continuous or not
    assert.equal(ok({ ...BASE, ocpdA: 60, loadA: 58, lengthFt: 0 }).nextSizeUp, null);
    assert.equal(ok({ ...BASE, ocpdA: 60, loadA: 48, continuous: true, lengthFt: 0 }).nextSizeUp, null);
    assert.notEqual(ok({ ...BASE, ocpdA: 60, loadA: 44, continuous: true, lengthFt: 0 }).nextSizeUp, null);
    // 25 A: 12 AWG copper carries 20 A at 60 °C, but 240.4(D) holds it to 20 A
    assert.equal(ok({ ...BASE, ocpdA: 25, lengthFt: 0 }).nextSizeUp, null);
    // voltage drop chose a larger size: no note
    const long = ok({ ...BASE, ocpdA: 60, lengthFt: 600 });
    assert.notEqual(long.size, long.minSizeByAmpacity);
    assert.equal(long.nextSizeUp, null);
  });

  it('every note it gives meets the rule, for every rating, material and column', () => {
    let notes = 0;
    for (const ocpdA of WIRE_SIZE_RATINGS) {
      for (const material of ['Cu', 'Al'] as const) {
        for (const [wiringMethod, termination] of [['cable', 'unknown'], ['conductors', '75']] as const) {
          const r = ok({ ocpdA, material, wiringMethod, termination, lengthFt: 0, volts: 240, phase: 'single' });
          const b = r.nextSizeUp;
          if (!b) continue;
          notes++;
          assert.ok(ocpdA <= NEXT_SIZE_UP_MAX_A);
          assert.ok(b.ampacity < ocpdA && !RATINGS.includes(b.ampacity));
          assert.equal(RATINGS.find((x) => x > b.ampacity), ocpdA);
          assert.equal(b.ampacity, table31016(b.size, columnKey(material, r.columnC)));
          const i = TABLE_310_16_SIZES.indexOf(r.minSizeByAmpacity);
          const smaller = TABLE_310_16_SIZES.slice(0, i).reverse().find((k) => table31016(k, columnKey(material, r.columnC)) !== null);
          assert.equal(b.size, smaller);
          const limit = max240_4D(b.size, material);
          assert.ok(!limit || (limit.conditions === null && ocpdA <= limit.max_ocpd_a));
          assert.equal(b.maxContinuousA, (b.ampacity * 100) / CONTINUOUS_LOAD_PERCENT);
        }
      }
    }
    assert.ok(notes > 20, `${notes} notes`);
  });
});

describe('WSZ-009b page data', () => {
  it('sizes every rating in both columns with the full rating and the Table 250.122 ground wire', () => {
    for (const material of ['Cu', 'Al'] as const) {
      assert.deepEqual(
        RATING_ROWS[material].map((r) => r.ratingA),
        WIRE_SIZE_RATINGS,
      );
      for (const row of RATING_ROWS[material]) {
        assert.ok(row.c60.amps >= row.ratingA && row.c75.amps >= row.ratingA, `${row.ratingA} A ${material}`);
        const plain = ok({ ocpdA: row.ratingA, material, lengthFt: 0, volts: 240, phase: 'single' });
        assert.equal(plain.size, row.c60.size);
        assert.equal(plain.egc, row.egc);
        const warm = ok({ ocpdA: row.ratingA, material, wiringMethod: 'conductors', termination: '75', lengthFt: 0, volts: 240, phase: 'single' });
        assert.equal(warm.size, row.c75.size);
      }
    }
    const cu = (a: number) => RATING_ROWS.Cu.find((r) => r.ratingA === a);
    assert.deepEqual([15, 20, 30, 40, 50].map((a) => cu(a)?.c60.size), ['14', '12', '10', '8', '6']);
    assert.deepEqual(cu(60)?.below60, { size: '6', amps: 55 });
    assert.deepEqual(cu(100)?.below60, { size: '2', amps: 95 });
  });

  it('draws contiguous length bands that match the engine at each edge', () => {
    for (const t of LENGTH_TRACKS) {
      assert.equal(t.bands[0].fromFt, 0);
      assert.equal(t.bands[t.bands.length - 1].toFt, LENGTH_MAX_FT_CHART);
      for (let k = 1; k < t.bands.length; k++) assert.equal(t.bands[k].fromFt, t.bands[k - 1].toFt + 1);
      const sizeAt = (ft: number) => ok({ ocpdA: t.ratingA, material: 'Cu', lengthFt: ft, volts: t.volts, phase: 'single', vdTargetPct: t.targetPct }).size;
      for (const b of t.bands) {
        assert.equal(sizeAt(b.fromFt), b.size);
        assert.equal(sizeAt(b.toFt), b.size);
      }
      // the last band runs past the chart: no band shorter than a tenth of it
      assert.ok(t.bands.every((b) => b.toFt - b.fromFt >= LENGTH_MAX_FT_CHART / 10), JSON.stringify(t.bands));
    }
    assert.deepEqual(
      LENGTH_TRACKS.map((t) => t.bands.map((b) => [b.size, b.toFt])),
      [
        [['12', 46], ['10', 74], ['8', 117], ['6', 187], ['4', 240]],
        [['10', 98], ['8', 157], ['6', 240]],
      ],
    );
  });

  it('keeps the worked examples the copy states', () => {
    assert.equal(LONG_RUN.minSizeByAmpacity, '12');
    assert.equal(LONG_RUN.size, '8');
    assert.ok(LONG_RUN_AT_12.vdPct > 3 && LONG_RUN.vdPct <= 3);
    assert.equal(LONG_RUN.egc, '8');
    assert.equal(CONTINUOUS_NEEDED_A, 30);
    assert.equal(CONTINUOUS_RATING_A, 30);
    assert.equal(CONTINUOUS.size, '10');
    assert.equal(BUNDLED_PLAIN.size, '8');
    assert.equal(BUNDLED_PLAIN.minAmpacity, 50);
    assert.equal(BUNDLED.size, '6');
    assert.equal(BUNDLED.minAmpacity, 52.5);
    assert.equal(BUNDLED_8_A, 38.5);
    assert.ok(COLUMN_TYPES[90].includes('THHN'));
  });
});

describe('WSZ-009b unitless numbers in steps', () => {
  it('render through partsText without a unit', () => {
    assert.equal(partsText(['factor ', { n: 0.8666, src: 'nec-310-15-corrections', format: { fixed: 2 } }]), 'factor 0.87');
  });
});

describe('WSZ-009b "a" or "an" before a number', () => {
  it('follows how the number is read aloud', async () => {
    const { indefiniteArticle } = await import('../src/lib/calculations/format');
    const an = [8, 11, 18, 80, 85, 800, 8000, 11000, 18000, '8', '18', '800', '80,000'];
    const a = [1, 2, 10, 12, 14, 100, 110, 180, 1000, 1100, 1800, 2000, '1/0', '4/0', '250', 'AWG'];
    for (const v of an) assert.equal(indefiniteArticle(v), 'an', String(v));
    for (const v of a) assert.equal(indefiniteArticle(v), 'a', String(v));
    const r80 = sizeConductor({ ...BASE, ocpdA: 80, continuous: true, lengthFt: 0 });
    assert.ok(!isSizingError(r80));
    if (isSizingError(r80)) return;
    assert.ok(text(r80).some((s) => s.startsWith('Ground wire for an 80 A breaker')));
    assert.ok(text(r80)[0].includes(': an 80 A rating serves'));
  });
});
