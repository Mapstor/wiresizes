// WSZ-006d PHYSICS: the three-phase calculator's calculation path (threePhase in src/lib/calculations/power.ts, which
// ThreePhaseTool and the page call) reproduces the golden three-phase "power" cases and both "pf-correction" cases from
// every pair of known values it accepts, and its results agree with each other: P = S × PF, Q = √(S² − P²),
// S = √3 × V × I. Golden values come from research/golden-cases.json, never typed here; the DOE fact sheet's measured
// example (DOE/GO-10097-517) is the one value read from a source, as the registry records it.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import golden from '../research/golden-cases.json';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { DOE_MOTOR, DOE_PF } from '../src/lib/verified/power-examples';
import { NOMINAL_THREE_PHASE } from '../src/lib/verified/us-nominal-voltages';
import { SQRT3, TP_KNOWN, TP_WYE_SYSTEMS, ampsFromKva, isTpError, kvaFromAmps, kvarAt, threePhase } from '../src/lib/calculations/power';
import type { TpInput, TpResult } from '../src/lib/calculations/power';

interface GoldenCase {
  group: string;
  name: string;
  inputs: Record<string, number>;
  expected: Record<string, number>;
  tolerance: Record<string, number>;
}

const cases = golden.cases as unknown as GoldenCase[];
const threePhaseCases = cases.filter((c) => c.group === 'power' && c.inputs.phase === 3);
const pfCases = cases.filter((c) => c.group === 'pf-correction');

function solve(input: TpInput): TpResult {
  const r = threePhase(input);
  if (isTpError(r)) throw new Error(`threePhase: ${r.error} for ${JSON.stringify(input)}`);
  return r;
}

const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

describe('WSZ-006d three-phase calculator: golden power cases', () => {
  it('the golden file has three-phase power cases and two power factor corrections', () => {
    assert.ok(threePhaseCases.length >= 5, `${threePhaseCases.length} cases`);
    assert.equal(pfCases.length, 2);
  });
  for (const c of threePhaseCases) {
    it(c.name, () => {
      const i = c.inputs;
      const pf = i.pf ?? 1;
      let r: TpResult;
      if (i.kw !== undefined) r = solve({ volts: i.volts, known: 'kw-pf', kw: i.kw, pf });
      else if (i.kva !== undefined) r = solve({ volts: i.volts, known: 'kva-pf', kva: i.kva, pf });
      else r = solve({ volts: i.volts, known: 'amps-pf', amps: i.amps, pf });
      if (c.expected.amps !== undefined) assert.ok(near(r.amps, c.expected.amps, c.tolerance.amps), `${r.amps}`);
      if (c.expected.watts !== undefined) assert.ok(near(r.kw * 1000, c.expected.watts, c.tolerance.watts), `${r.kw * 1000}`);
      // every other pair gives the same load back
      const pairs: TpInput[] = [
        { volts: r.volts, known: 'kw-pf', kw: r.kw, pf: r.pf },
        { volts: r.volts, known: 'kva-pf', kva: r.kva, pf: r.pf },
        { volts: r.volts, known: 'amps-pf', amps: r.amps, pf: r.pf },
        { volts: r.volts, known: 'kw-kva', kw: r.kw, kva: r.kva },
        { volts: r.volts, known: 'kw-amps', kw: r.kw, amps: r.amps },
      ];
      assert.deepEqual(pairs.map((p) => p.known), [...TP_KNOWN]);
      for (const p of pairs) {
        const q = solve(p);
        assert.ok(near(q.amps, r.amps, 1e-9 * r.amps) && near(q.kw, r.kw, 1e-9 * r.kw) && near(q.pf, r.pf, 1e-12), p.known);
      }
    });
  }
});

describe('WSZ-006d three-phase calculator: power factor correction', () => {
  it(pfCases[0].name, () => {
    const c = pfCases[0];
    const r = solve({ volts: 480, known: 'kw-pf', kw: c.inputs.kw, pf: c.inputs.pf_from, targetPf: c.inputs.pf_to });
    assert.equal(r.correctionState, 'applied');
    assert.ok(r.correction);
    assert.ok(near(r.correction.capKvar, c.expected.kvar, c.tolerance.kvar), `${r.correction.capKvar}`);
    assert.ok(near(r.correction.currentDownPct, c.expected.current_reduction_pct, c.tolerance.current_reduction_pct));
    // the current falls by the same share at any voltage
    const r208 = solve({ volts: 208, known: 'kw-pf', kw: c.inputs.kw, pf: c.inputs.pf_from, targetPf: c.inputs.pf_to });
    assert.ok(near(1 - (r208.correction?.ampsAfter ?? 0) / r208.amps, c.expected.current_reduction_pct / 100, 1e-4));
  });
  it(pfCases[1].name, () => {
    const c = pfCases[1];
    const r = solve({ volts: 480, known: 'kw-kva', kw: c.inputs.kw, kva: c.inputs.kva, targetPf: c.inputs.pf_to });
    assert.ok(near(r.pf, c.expected.pf_from, 1e-4), `${r.pf}`);
    assert.ok(r.correction);
    assert.ok(near(r.correction.capKvar, c.expected.kvar, c.tolerance.kvar), `${r.correction.capKvar}`);
    assert.ok(near(r.correction.currentDownPct, c.expected.current_reduction_pct, c.tolerance.current_reduction_pct));
    // the fact sheet's after-correction apparent power: 100 kW at PF 0.95 is about 105 kVA
    assert.ok(near(r.correction.kvaAfter, c.inputs.kw / c.inputs.pf_to, 1e-9));
  });
  it('a capacitor supplies the difference in reactive power at the same real power', () => {
    const r = solve({ volts: 480, known: 'kw-pf', kw: 100, pf: 0.8, targetPf: 0.95 });
    assert.ok(r.correction);
    assert.ok(near(r.kvar - r.correction.kvarAfter, r.correction.capKvar, 1e-9));
    assert.ok(near(r.correction.kvarAfter, kvarAt(100, 0.95), 1e-12));
  });
  it('no capacitor when the power factor already meets the target, and none without a target', () => {
    const above = solve({ volts: 480, known: 'kw-pf', kw: 50, pf: 0.9, targetPf: 0.85 });
    assert.equal(above.correctionState, 'at-or-above');
    assert.equal(above.correction, null);
    const at = solve({ volts: 480, known: 'kw-pf', kw: 50, pf: 0.95, targetPf: 0.95 });
    assert.equal(at.correctionState, 'at-or-above');
    const none = solve({ volts: 480, known: 'kw-pf', kw: 50, pf: 0.9 });
    assert.equal(none.correctionState, 'none');
  });
});

describe('WSZ-006d three-phase calculator: the relations hold', () => {
  it('S = √3 × V × I, P = S × PF and Q = √(S² − P²)', () => {
    const r = solve({ volts: 480, known: 'kw-pf', kw: 50, pf: 0.9 });
    assert.ok(near(r.kva, (SQRT3 * r.volts * r.amps) / 1000, 1e-9));
    assert.ok(near(r.kw, r.kva * r.pf, 1e-9));
    assert.ok(near(r.kvar ** 2 + r.kw ** 2, r.kva ** 2, 1e-9));
    assert.ok(near(ampsFromKva(kvaFromAmps(37, 469.7), 469.7), 37, 1e-12));
  });
  it("the DOE fact sheet's measured motor gives the kW it prints (read from the registry row)", () => {
    assert.deepEqual(DOE_MOTOR, { volts: 469.7, amps: 37, pf: 0.763, printedKw: 22.9 });
    const r = solve({ volts: DOE_MOTOR.volts, known: 'amps-pf', amps: DOE_MOTOR.amps, pf: DOE_MOTOR.pf });
    assert.ok(r.kw >= DOE_MOTOR.printedKw && r.kw < DOE_MOTOR.printedKw + 0.1, `${r.kw}`);
  });
  it("the DOE power factor sheet's example matches golden case 74 and the sheet's own rounded figures", () => {
    assert.deepEqual(DOE_PF, { kw: 100, kva: 142, kvaAfter: 105, to: 0.95, printedPct: 26 });
    const r = solve({ volts: 480, known: 'kw-kva', kw: DOE_PF.kw, kva: DOE_PF.kva, targetPf: DOE_PF.to });
    assert.ok(r.correction);
    assert.equal(Math.round(r.correction.kvaAfter), DOE_PF.kvaAfter);
    assert.equal(Math.round(r.correction.currentDownPct), DOE_PF.printedPct);
  });
  it('the wye systems are the ones the registry lists', () => {
    const wyes = NOMINAL_THREE_PHASE.filter((s) => s.includes('Y/')).map((s) => s.split('Y/').map(Number));
    assert.deepEqual(wyes, TP_WYE_SYSTEMS.map((w) => [w.lineVolts, w.neutralVolts]));
  });
  it('line to neutral is V ÷ √3, and 208 V and 480 V name the two nominal wye systems', () => {
    for (const w of TP_WYE_SYSTEMS) {
      const r = solve({ volts: w.lineVolts, known: 'kw-pf', kw: 10, pf: 1 });
      assert.deepEqual(r.wye, w);
      assert.equal(Math.round(r.lineToNeutral), w.neutralVolts);
    }
    assert.equal(solve({ volts: 240, known: 'kw-pf', kw: 10, pf: 1 }).wye, null);
    assert.equal(solve({ volts: 600, known: 'kw-pf', kw: 10, pf: 1 }).wye, null);
  });
  it('real power above apparent power is refused, from kVA or from the current', () => {
    assert.deepEqual(threePhase({ volts: 480, known: 'kw-kva', kw: 60, kva: 55 }), { error: 'kw-above-kva' });
    assert.deepEqual(threePhase({ volts: 480, known: 'kw-amps', kw: 60, amps: 60 }), { error: 'kw-above-kva' });
    // equal values are a power factor of 1
    assert.equal(solve({ volts: 480, known: 'kw-kva', kw: 55, kva: 55 }).pf, 1);
  });
  it('missing or out-of-range values are refused', () => {
    for (const bad of [
      { volts: 0, known: 'kw-pf', kw: 50, pf: 0.9 },
      { volts: 480, known: 'kw-pf', kw: 50, pf: 0 },
      { volts: 480, known: 'kw-pf', kw: 50, pf: 1.2 },
      { volts: 480, known: 'kw-pf', pf: 0.9 },
      { volts: 480, known: 'kva-pf', kw: 50, pf: 0.9 },
      { volts: 480, known: 'kw-pf', kw: 50, pf: 0.9, targetPf: 1.5 },
      { volts: 480, known: 'kw-pf', kw: -5, pf: 0.9 },
    ] as TpInput[]) {
      assert.deepEqual(threePhase(bad), { error: 'input-invalid' }, JSON.stringify(bad));
    }
  });
});

describe('WSZ-006d power sources: one registry row per document', () => {
  const registry = new Map(parseCsv(readFileSync('research/data-sources.csv', 'utf8')).map((row) => [row.domain, row]));
  const DOCS = ['eia-power-glossary', 'doe-motor-load-efficiency', 'doe-power-factor-cost', 'nist-sp330-si-units', 'mit-polyphase-networks'];
  const cited = (domain: string) => METHODOLOGY_SECTIONS.find((s) => s.domain === domain)?.citedOn ?? [];

  it('each document has its own verified row and url', () => {
    const urls = DOCS.map((d) => {
      const row = registry.get(d);
      assert.equal(row?.status, 'verified', d);
      assert.match(row?.url ?? '', /^https:\/\//, d);
      return row?.url;
    });
    assert.equal(new Set(urls).size, DOCS.length);
  });

  it('the rebuilt calculators cite the documents, and the combined row only the pages still to move', () => {
    for (const route of ['/calculators/three-phase-calculator', '/calculators/voltage-drop-calculator', '/calculators/low-voltage-calculator']) {
      assert.ok(!cited('power-definitions').includes(route), route);
    }
    assert.ok(cited('doe-motor-load-efficiency').includes('/calculators/three-phase-calculator'));
    assert.ok(cited('eia-power-glossary').includes('/calculators/three-phase-calculator'));
    // later waves add their pages to these lists (WSZ-007a: the two power guides, tests/wsz007a-power-guides.test.ts)
    assert.ok(cited('doe-power-factor-cost').includes('/calculators/three-phase-calculator'));
    assert.ok(cited('mit-polyphase-networks').includes('/calculators/three-phase-calculator'));
    for (const route of ['/calculators/voltage-drop-calculator', '/calculators/low-voltage-calculator']) {
      assert.ok(cited('nist-sp330-si-units').includes(route), route);
    }
  });
});
