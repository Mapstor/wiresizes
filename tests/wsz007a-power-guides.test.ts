// WSZ-007a: the single vs three phase and power factor guides, rebuilt in the look. Their figures come from
// src/lib/power-guides.ts (the power engine), which must reproduce the golden "comparison" and "pf-correction" cases;
// the capacitor table must agree with the engine's correction; /methodology must list each guide under every source
// the guide cites, and the registry must list the guide under each of those sources; both guides render in the look
// (LOOK_GUIDES) and their old client components are gone. Golden values come from research/golden-cases.json, never
// typed here.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import golden from '../research/golden-cases.json';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { SQRT3, kvarAt } from '../src/lib/calculations/power';
import {
  COMPARE_KW,
  COMPARE_ROWS,
  KVAR_TABLE,
  PF_BARS,
  PF_BAR_ROWS,
  PF_EXAMPLE,
  assertPowerGuideVolts,
  correctionOf,
  kvarPerKw,
  pfBarRow,
} from '../src/lib/power-guides';

interface GoldenCase {
  group: string;
  name: string;
  inputs: Record<string, number>;
  expected: Record<string, number>;
  tolerance: Record<string, number>;
}

const cases = golden.cases as unknown as GoldenCase[];
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
const SINGLE = '/guides/single-vs-three-phase';
const PF_GUIDE = '/guides/power-factor-explained';
/** The sources each guide's Sources list names (the pages pass these to <Sources>). */
const CITED: Record<string, string[]> = {
  [SINGLE]: ['mit-polyphase-networks', 'doe-motor-load-efficiency', 'eia-power-glossary', 'us-nominal-voltages', 'nec-310-12'],
  [PF_GUIDE]: ['eia-power-glossary', 'doe-power-factor-cost', 'doe-motor-load-efficiency', 'mit-polyphase-networks', 'us-nominal-voltages'],
};

describe('WSZ-007a power guides: the figures match the golden cases', () => {
  it('the same 10 kW load on 240 V single-phase and 208 V and 480 V three-phase', () => {
    const comparison = cases.filter((c) => c.group === 'power' && c.name.includes('(comparison)'));
    assert.equal(comparison.length, COMPARE_ROWS.length);
    for (const c of comparison) {
      const row = COMPARE_ROWS.find((r) => r.volts === c.inputs.volts && r.phases === c.inputs.phase);
      assert.ok(row, c.name);
      assert.equal(c.inputs.kw, COMPARE_KW);
      assert.equal(c.inputs.pf, 1);
      assert.ok(near(row.amps, c.expected.amps, c.tolerance.amps), `${c.name}: ${row.amps}`);
    }
  });
  it('100 kW from PF 0.80 to 0.95: the bank and the current saved', () => {
    const c = cases.find((x) => x.group === 'pf-correction' && x.name === '100 kW from PF 0.80 to 0.95');
    assert.ok(c);
    assert.equal(PF_EXAMPLE.kw, c.inputs.kw);
    assert.equal(PF_EXAMPLE.pf, c.inputs.pf_from);
    const k = correctionOf(PF_EXAMPLE);
    assert.equal(k.targetPf, c.inputs.pf_to);
    assert.ok(near(k.capKvar, c.expected.kvar, c.tolerance.kvar), `${k.capKvar}`);
    assert.ok(near(k.currentDownPct, c.expected.current_reduction_pct, c.tolerance.current_reduction_pct), `${k.currentDownPct}`);
  });
  it('the 480 V three-phase comparison is 2√3 times smaller than 240 V single-phase', () => {
    const [single, , three480] = COMPARE_ROWS;
    assert.ok(near(single.amps / three480.amps, 2 * SQRT3, 1e-9));
    assert.ok(three480.amps < single.amps / 3);
  });
  it('every voltage the figures use is a nominal system voltage', () => {
    assert.doesNotThrow(() => assertPowerGuideVolts('test'));
  });
});

describe('WSZ-007a power guides: the power factor figures agree with each other', () => {
  it('the current of the same load is in proportion to 1 ÷ PF', () => {
    const one = pfBarRow(1);
    for (const r of PF_BAR_ROWS) {
      assert.ok(near(r.amps, (PF_BARS.kw * 1000) / (SQRT3 * PF_BARS.volts * r.pf), 1e-9), `PF ${r.pf}`);
      assert.ok(near(r.amps * r.pf, one.amps, 1e-9));
      assert.ok(near(r.kva, PF_BARS.kw / r.pf, 1e-9));
    }
    assert.ok(near(pfBarRow(0.8).amps / one.amps, 1.25, 1e-12));
    assert.throws(() => pfBarRow(0.42));
  });
  it('the table gives the golden bank: 100 kW × the 0.80 → 0.95 figure', () => {
    const perKw = kvarPerKw(PF_EXAMPLE.pf, correctionOf(PF_EXAMPLE).targetPf);
    assert.ok(perKw !== null);
    assert.ok(near(PF_EXAMPLE.kw * perKw, correctionOf(PF_EXAMPLE).capKvar, 1e-9));
    assert.ok(near(perKw, kvarAt(1, 0.8) - kvarAt(1, 0.95), 1e-15));
  });
  it('a lower present power factor or a higher target takes more capacitor, and no target at or below the present one', () => {
    for (const to of KVAR_TABLE.to) {
      const column = KVAR_TABLE.from.map((from) => kvarPerKw(from, to));
      for (let k = 0; k < KVAR_TABLE.from.length; k++) {
        const from = KVAR_TABLE.from[k];
        const v = column[k];
        if (to <= from) {
          assert.equal(v, null, `${from} → ${to}`);
          continue;
        }
        assert.ok(v !== null && v > 0, `${from} → ${to}`);
        const next = column[k + 1];
        if (k + 1 < column.length && next !== null) assert.ok(v > next, `${from} → ${to} above ${KVAR_TABLE.from[k + 1]}`);
      }
    }
    for (const from of KVAR_TABLE.from) {
      const row = KVAR_TABLE.to.map((to) => kvarPerKw(from, to)).filter((v): v is number => v !== null);
      for (let k = 1; k < row.length; k++) assert.ok(row[k] > row[k - 1], `${from}`);
    }
    assert.ok(near(kvarPerKw(0.6, 1) ?? 0, 4 / 3, 1e-12));
  });
});

describe('WSZ-007a power guides: sources, the look and the old pages', () => {
  it('/methodology lists each guide under exactly the sources it cites', () => {
    for (const [route, domains] of Object.entries(CITED)) {
      const listed = METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(route)).map((s) => s.domain);
      assert.deepEqual([...listed].sort(), [...domains].sort(), route);
    }
  });
  it('the registry lists each guide under the sources it cites, and the page map names them', () => {
    const registry = parseCsv(readFileSync(new URL('../research/data-sources.csv', import.meta.url), 'utf8'));
    const pageMap = parseCsv(readFileSync(new URL('../research/page-map.csv', import.meta.url), 'utf8'));
    for (const [route, domains] of Object.entries(CITED)) {
      for (const d of domains) {
        const row = registry.find((r) => r.domain === d);
        assert.ok(row, d);
        assert.equal(row.status, 'verified', d);
        assert.ok(row.pages_served.split(';').includes(route), `${d} pages_served lacks ${route}`);
      }
      const mapRow = pageMap.find((r) => Object.values(r).includes(route));
      assert.ok(mapRow, route);
      assert.deepEqual(mapRow.data_sources_all.split(';').sort(), [...domains].sort(), route);
      // WSZ-007e deleted the power-definitions row
      const old = registry.find((r) => r.domain === 'power-definitions');
      assert.ok(!old || !old.pages_served.split(';').includes(route), `power-definitions still serves ${route}`);
    }
  });
  it('both guides render in the look, and their client components are gone', () => {
    const frame = readFileSync(new URL('../src/components/layout/GuidesFrame.tsx', import.meta.url), 'utf8');
    const look = /const LOOK_GUIDES = new Set\(\[([^\]]*)\]\)/.exec(frame);
    assert.ok(look, 'LOOK_GUIDES');
    for (const route of [SINGLE, PF_GUIDE]) {
      assert.ok(look[1].includes(`'${route}'`), route);
      assert.equal(existsSync(new URL(`../src/app${route}/GuideClient.tsx`, import.meta.url)), false, route);
      const page = readFileSync(new URL(`../src/app${route}/page.tsx`, import.meta.url), 'utf8');
      assert.ok(!page.includes("'use client'"), route);
      for (const d of CITED[route]) assert.ok(page.includes(`'${d}'`), `${route} cites ${d}`);
    }
  });
  it('the power factor guide never copies the fact sheet\'s "67-kW" misprint', () => {
    const page = readFileSync(new URL(`../src/app${PF_GUIDE}/page.tsx`, import.meta.url), 'utf8');
    const text = page.replace(/\/\/.*$/gm, '');
    assert.ok(!/67[- ]kW/.test(text));
  });
});
