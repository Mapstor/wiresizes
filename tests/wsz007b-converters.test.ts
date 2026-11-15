// WSZ-007b: the converters' calculation path (convertToAmps, ampsAtVolts and ampsFromResistance in
// src/lib/calculations/power.ts) reproduces the golden "power" cases the kilowatts, kVA and volts to amps pages show, agrees
// with the three-phase calculator's path on every three-phase load, and refuses what no load has. Golden values come from
// research/golden-cases.json, never typed here.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import golden from '../research/golden-cases.json';
import {
  SQRT3,
  ampsAtVolts,
  ampsFromResistance,
  convertToAmps,
  isConvError,
  isOhmError,
  isTpError,
  threePhase,
} from '../src/lib/calculations/power';
import type { ConvInput, ConvResult } from '../src/lib/calculations/power';

interface GoldenCase {
  group: string;
  name: string;
  inputs: Record<string, number>;
  expected: Record<string, number>;
  tolerance: Record<string, number>;
}

const cases = (golden.cases as unknown as GoldenCase[]).filter((c) => c.group === 'power');
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

function solve(input: ConvInput): ConvResult {
  const r = convertToAmps(input);
  if (isConvError(r)) throw new Error(`convertToAmps refused ${JSON.stringify(input)}`);
  return r;
}

describe('WSZ-007b converters: the golden power cases', () => {
  const toAmps = cases.filter((c) => c.expected.amps !== undefined);
  it('the golden file has the cases the three pages show', () => {
    for (const name of [
      '7.2 kW single-phase 240 V, PF 1',
      '50 kW three-phase 480 V, PF 0.9',
      '75 kVA three-phase 208 V',
      '75 kVA three-phase 480 V',
      '25 kVA single-phase 240 V',
      '4500 W at 240 V',
    ]) {
      assert.ok(toAmps.some((c) => c.name === name), name);
    }
  });
  for (const c of toAmps) {
    it(c.name, () => {
      const i = c.inputs;
      const phases = i.phase === 3 ? 3 : 1;
      const r =
        i.kva !== undefined
          ? solve({ phases, volts: i.volts, known: 'kva', kva: i.kva, pf: i.pf ?? null })
          : solve({ phases, volts: i.volts, known: 'kw-pf', kw: i.kw ?? i.watts / 1000, pf: i.pf ?? 1 });
      assert.ok(near(r.amps, c.expected.amps, c.tolerance.amps), `${r.amps}`);
    });
  }
  it('4500 W at 240 V through a 12.8 Ω element is the same 18.75 A (Ohm’s law)', () => {
    const c = toAmps.find((x) => x.name === '4500 W at 240 V');
    assert.ok(c);
    const ohms = (c.inputs.volts * c.inputs.volts) / c.inputs.watts;
    assert.equal(ohms, 12.8);
    const r = ampsFromResistance(c.inputs.volts, ohms);
    assert.ok(!isOhmError(r));
    assert.ok(near(r.amps, c.expected.amps, c.tolerance.amps));
    assert.ok(near(r.watts, c.inputs.watts, 1e-9));
  });
});

describe('WSZ-007b converters: the results agree with each other', () => {
  it('three-phase goes through the three-phase calculator’s path', () => {
    for (const [volts, kw, pf] of [
      [208, 10, 1],
      [480, 50, 0.9],
      [600, 120, 0.8],
      [469.7, 22.97, 0.763],
    ]) {
      const r = solve({ phases: 3, volts, known: 'kw-pf', kw, pf });
      const t = threePhase({ volts, known: 'kw-pf', kw, pf });
      assert.ok(!isTpError(t));
      assert.equal(r.amps, t.amps);
      assert.equal(r.kva, t.kva);
      assert.equal(r.kvar, t.kvar);
      assert.deepEqual(r.wye, t.wye);
    }
  });
  it('S = V × I single-phase, S = √3 × V × I three-phase, P = S × PF, Q = √(S² − P²)', () => {
    const one = solve({ phases: 1, volts: 240, known: 'kw-pf', kw: 7.2, pf: 0.8 });
    assert.ok(near(one.kva * 1000, 240 * one.amps, 1e-9));
    assert.ok(one.kw !== null && one.kvar !== null && one.pf !== null);
    assert.ok(near(one.kw, one.kva * one.pf, 1e-12));
    assert.ok(near(one.kvar ** 2 + one.kw ** 2, one.kva ** 2, 1e-9));
    assert.equal(one.wye, null);
    assert.equal(one.lineToNeutral, null);
    const three = solve({ phases: 3, volts: 480, known: 'kva', kva: 75, pf: 0.85 });
    assert.ok(near(three.kva * 1000, SQRT3 * 480 * three.amps, 1e-9));
    assert.ok(three.kw !== null && near(three.kw, 75 * 0.85, 1e-12));
    assert.deepEqual(three.wye, { lineVolts: 480, neutralVolts: 277 });
  });
  it('kVA without a power factor gives the current only; the power factor does not change it', () => {
    const bare = solve({ phases: 3, volts: 208, known: 'kva', kva: 75 });
    assert.equal(bare.kw, null);
    assert.equal(bare.kvar, null);
    assert.equal(bare.pf, null);
    const withPf = solve({ phases: 3, volts: 208, known: 'kva', kva: 75, pf: 0.8 });
    assert.ok(near(bare.amps, withPf.amps, 1e-12));
    const single = solve({ phases: 1, volts: 240, known: 'kva', kva: 25 });
    assert.equal(single.kw, null);
  });
  it('the same load at other voltages: the current falls in proportion to the voltage', () => {
    const r = solve({ phases: 1, volts: 240, known: 'kw-pf', kw: 7.2, pf: 1 });
    const rows = ampsAtVolts(r, [120, 240, 480]);
    assert.ok(near(rows[1].amps, r.amps, 1e-12));
    assert.ok(near(rows[0].amps, 2 * r.amps, 1e-12));
    assert.ok(near(rows[2].amps, r.amps / 2, 1e-12));
    const t = solve({ phases: 3, volts: 480, known: 'kva', kva: 75 });
    assert.ok(near(ampsAtVolts(t, [208])[0].amps, solve({ phases: 3, volts: 208, known: 'kva', kva: 75 }).amps, 1e-9));
  });
});

describe('WSZ-007b converters: refusals', () => {
  it('no voltage, power, apparent power or resistance at or below 0, past the limits, or a power factor above 1', () => {
    const bad: ConvInput[] = [
      { phases: 1, volts: 0, known: 'kw-pf', kw: 1, pf: 1 },
      { phases: 1, volts: 100001, known: 'kw-pf', kw: 1, pf: 1 },
      { phases: 3, volts: 480, known: 'kw-pf', kw: 0, pf: 1 },
      { phases: 3, volts: 480, known: 'kw-pf', kw: 1, pf: 1.2 },
      { phases: 3, volts: 480, known: 'kw-pf', kw: 1, pf: 0 },
      { phases: 3, volts: 480, known: 'kw-pf', kw: 1 },
      { phases: 1, volts: 240, known: 'kva', kva: -5 },
      { phases: 1, volts: 240, known: 'kva', kva: 1000001 },
      { phases: 2 as never, volts: 240, known: 'kva', kva: 5 },
    ];
    for (const b of bad) assert.ok(isConvError(convertToAmps(b)), JSON.stringify(b));
    assert.ok(isOhmError(ampsFromResistance(240, 0)));
    assert.ok(isOhmError(ampsFromResistance(0, 10)));
    assert.ok(isOhmError(ampsFromResistance(240, Number.NaN)));
  });
});

describe('WSZ-007b converters: sources and the old components', () => {
  const CITED: Record<string, string[]> = {
    '/calculators/kilowatts-to-amps-calculator': ['eia-power-glossary', 'doe-motor-load-efficiency', 'mit-polyphase-networks', 'doe-power-factor-cost', 'us-nominal-voltages'],
    '/calculators/kva-to-amps-calculator': ['eia-power-glossary', 'mit-polyphase-networks', 'doe-power-factor-cost', 'us-nominal-voltages'],
    '/calculators/volts-to-amps-calculator': ['nist-sp330-si-units', 'eia-power-glossary', 'doe-motor-load-efficiency', 'mit-polyphase-networks', 'us-nominal-voltages'],
  };
  it('/methodology, the registry and the page map list each page under exactly the sources it cites', async () => {
    const { METHODOLOGY_SECTIONS } = await import('../src/lib/methodology');
    const { parseCsv } = await import('../src/lib/verified/csv.mjs');
    const { readFileSync } = await import('node:fs');
    const registry = parseCsv(readFileSync(new URL('../research/data-sources.csv', import.meta.url), 'utf8'));
    const pageMap = parseCsv(readFileSync(new URL('../research/page-map.csv', import.meta.url), 'utf8'));
    for (const [route, domains] of Object.entries(CITED)) {
      const listed = METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(route)).map((s) => s.domain);
      assert.deepEqual([...listed].sort(), [...domains].sort(), route);
      for (const d of domains) {
        const row = registry.find((r: Record<string, string>) => r.domain === d);
        assert.ok(row && row.status === 'verified' && row.pages_served.split(';').includes(route), `${d} → ${route}`);
      }
      const old = registry.find((r: Record<string, string>) => r.domain === 'power-definitions');
      assert.ok(old && !old.pages_served.split(';').includes(route), `power-definitions still serves ${route}`);
      const mapRow = pageMap.find((r: Record<string, string>) => Object.values(r).includes(route));
      assert.ok(mapRow, route);
      assert.deepEqual(mapRow.data_sources_all.split(';').sort(), [...domains].sort(), route);
      const page = readFileSync(new URL(`../src/app${route}/page.tsx`, import.meta.url), 'utf8');
      assert.ok(page.includes('<PowerConverterTool mode='), route);
    }
  });
  it('the three old calculator components are gone', async () => {
    const { existsSync } = await import('node:fs');
    for (const f of ['KilowattsToAmpsCalculator', 'kVAToAmpsCalculator', 'VoltsToAmpsCalculator']) {
      assert.equal(existsSync(new URL(`../src/components/calculators/${f}.tsx`, import.meta.url)), false, f);
    }
  });
});
