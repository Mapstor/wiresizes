// WSZ-009a: the ampacity calculator rebuilt in the look. ampacityRun reproduces the golden ampacity-arithmetic cases from
// a temperature and a count (the row and band they fall in), reads both temperature units by the ranges the table
// prints, keeps NM and UF cable at 60 °C and caps the corrected ampacity at each termination column 110.14(C) allows.
// Golden values come from research/golden-cases.json, never typed here.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import golden from '../research/golden-cases.json';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { AMBIENT_ROWS } from '../src/lib/verified/nec-310-15-B-1-1';
import { DOMAINS, ampacityRun, ambientRowFor, bandFor, isAmpacityError, warmestTemp } from '../src/lib/calculations/ampacity';
import type { AmpacityRun } from '../src/lib/calculations/ampacity';
import type { AmpacityColumn } from '../src/lib/verified/nec-310-16';
import type { Material, SizeKey } from '../src/lib/verified/awg';

interface GoldenCase {
  group: string;
  name: string;
  inputs: Record<string, string | null>;
  expected: Record<string, number>;
}
const cases = (golden.cases as unknown as GoldenCase[]).filter((c) => c.group === 'ampacity-arithmetic');
const ROUTE = '/calculators/ampacity-calculator';
const CITED = ['nec-310-16', 'nec-310-15-corrections', 'nec-110-14c', 'nec-240-4-d'];
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');

/** A whole-degree temperature inside a printed row ("41–45" → 43; "10 or less" → 10). */
function tempIn(row: string): number {
  const span = /^(\d+)–(\d+)$/.exec(row);
  if (span) return Math.floor((Number(span[1]) + Number(span[2])) / 2);
  return Number(/^(\d+) or less$/.exec(row)?.[1]);
}
/** A count inside a band ("4–6" → 5; null → 3). */
function countIn(band: string | null): number {
  if (band === null) return 3;
  const span = /^(\d+)–(\d+)$/.exec(band);
  return span ? Number(span[1]) : Number(/^(\d+) and above$/.exec(band)?.[1]);
}

describe('WSZ-009a golden ampacity cases through ampacityRun', () => {
  for (const c of cases) {
    it(c.name, () => {
      const [mat, col] = String(c.inputs.column).split('_');
      const r = ampacityRun({
        size: c.inputs.size as SizeKey,
        material: (mat === 'cu' ? 'Cu' : 'Al') as Material,
        method: 'conductors',
        column: Number(col) as AmpacityColumn,
        temp: tempIn(String(c.inputs.ambient_c_row)),
        unit: 'C',
        count: countIn(c.inputs.ccc_band),
      });
      assert.ok(!isAmpacityError(r));
      const run = r as AmpacityRun;
      assert.equal(run.result.tableAmpacity, c.expected.table_a);
      assert.equal(run.result.correctionFactor, c.expected.correction);
      assert.equal(run.result.adjustmentPercent, c.expected.adjustment_pct);
      assert.ok(Math.abs((run.result.ampacity ?? NaN) - c.expected.result_a) < 1e-9);
    });
  }
});

describe('WSZ-009a lookups and caps', () => {
  it('every row is found from both of its printed ends, in both units', () => {
    for (const row of AMBIENT_ROWS) {
      for (const [text, unit] of [[row.key, 'C'], [row.ambientF, 'F']] as const) {
        const span = /^(\d+)–(\d+)$/.exec(text);
        const ends = span ? [Number(span[1]), Number(span[2])] : [Number(/^(\d+)/.exec(text)?.[1])];
        for (const t of ends) assert.equal(ambientRowFor(t, unit)?.key, row.key, `${t} °${unit}`);
      }
    }
    assert.equal(ambientRowFor(warmestTemp('C') + 1, 'C'), null);
    assert.equal(ambientRowFor(warmestTemp('F') + 1, 'F'), null);
    assert.equal(ambientRowFor(-40, 'C')?.key, AMBIENT_ROWS[0].key);
  });

  it('bands from counts', () => {
    assert.deepEqual([1, 3, 4, 6, 7, 9, 10, 20, 21, 30, 31, 40, 41, 99].map(bandFor), ['1–3', '1–3', '4–6', '4–6', '7–9', '7–9', '10–20', '10–20', '21–30', '21–30', '31–40', '31–40', '41 and above', '41 and above']);
  });

  it('caps: a 90 °C conductor against 60 and 75 °C terminals; a 60 °C conductor only against 60', () => {
    const r = ampacityRun({ size: '12', material: 'Cu', method: 'conductors', column: 90, temp: 30, unit: 'C', count: 3 }) as AmpacityRun;
    assert.deepEqual(r.caps.map((c) => [c.column, c.usableA, c.capped]), [[60, 20, true], [75, 25, true]]);
    assert.equal(r.result.ocpdLimitA, 20);
    const sixty = ampacityRun({ size: '12', material: 'Cu', method: 'conductors', column: 60, temp: 30, unit: 'C', count: 3 }) as AmpacityRun;
    assert.deepEqual(sixty.caps.map((c) => c.column), [60]);
  });

  it('NM and UF cable stay in the 60 °C column, corrections included', () => {
    const r = ampacityRun({ size: '10', material: 'Cu', method: 'cable', column: 90, temp: 40, unit: 'C', count: 5 }) as AmpacityRun;
    assert.equal(r.column, 60);
    assert.deepEqual(r.caps.map((c) => c.column), [60]);
    assert.ok(Math.abs((r.result.ampacity ?? NaN) - 30 * 0.82 * 0.8) < 1e-9);
  });

  it('refusals and the not-permitted case', () => {
    assert.ok(isAmpacityError(ampacityRun({ size: '14', material: 'Al', method: 'conductors', column: 75, temp: 30, unit: 'C', count: 3 })));
    assert.ok(isAmpacityError(ampacityRun({ size: '12', material: 'Cu', method: 'conductors', column: 75, temp: 30.5, unit: 'C', count: 3 })));
    assert.ok(isAmpacityError(ampacityRun({ size: '12', material: 'Cu', method: 'conductors', column: 75, temp: 30, unit: 'C', count: 0 })));
    const hot = ampacityRun({ size: '12', material: 'Cu', method: 'conductors', column: 60, temp: 60, unit: 'C', count: 3 }) as AmpacityRun;
    assert.equal(hot.result.ampacity, null);
    assert.equal(hot.result.notPermitted, true);
    const past = ampacityRun({ size: '12', material: 'Cu', method: 'conductors', column: 90, temp: 90, unit: 'C', count: 3 }) as AmpacityRun;
    assert.equal(past.row, null);
    assert.equal(past.result.ampacity, null);
  });
});

describe('WSZ-009a sources and removals', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];

  it('the engine, /methodology, the registry and the page map agree on the four sources', () => {
    assert.deepEqual([...DOMAINS].sort(), [...CITED].sort());
    const listed = METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(ROUTE)).map((s) => s.domain);
    assert.deepEqual([...listed].sort(), [...CITED].sort());
    for (const row of registry) {
      const serves = row.pages_served.split(';').includes(ROUTE);
      assert.equal(serves, CITED.includes(row.domain), row.domain);
    }
    const mapRow = pageMap.find((r) => r.slug === ROUTE);
    assert.ok(mapRow);
    assert.deepEqual(mapRow.data_sources_all.split(';').sort(), [...CITED].sort());
  });

  it('the old component is gone; gates b and c enforce the page', () => {
    assert.ok(!existsSync(new URL('../src/components/calculators/AmpacityCalculator.tsx', import.meta.url)));
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE));
    assert.ok(gates.necRefs.enforce.includes(ROUTE));
  });
});
