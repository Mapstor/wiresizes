// WSZ-007e: the electrical power calculations guide, rebuilt in the look. Its worked examples come from
// src/lib/power-guides.ts (the power and ohms-law engines) and must reproduce the golden "power" and "ohms-law" cases;
// its watts per amp agree with P = V × I and √3 × V × I; the guide cites six per-document rows, /methodology lists it
// under each, and power-definitions, the combined row it was the last page of, is gone from the registry, the page map,
// /methodology and the engines. Golden values come from research/golden-cases.json, never typed here.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import golden from '../research/golden-cases.json';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { SQRT3 } from '../src/lib/calculations/power';
import { GUIDE_EXAMPLES, WATTS_PER_AMP_ROWS, assertPowerGuideVolts } from '../src/lib/power-guides';

interface GoldenCase {
  group: string;
  name: string;
  inputs: Record<string, number>;
  expected: Record<string, number>;
  tolerance: Record<string, number>;
}

const cases = golden.cases as unknown as GoldenCase[];
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
const ROUTE = '/guides/electrical-power-calculations';
/** The sources the guide's Sources list names (the page passes these to <Sources>). */
const CITED = ['nist-sp330-si-units', 'eia-power-glossary', 'doe-motor-load-efficiency', 'mit-polyphase-networks', 'doe-power-factor-cost', 'us-nominal-voltages'];

function golden1(name: string): GoldenCase {
  const c = cases.find((x) => x.name === name);
  assert.ok(c, name);
  return c;
}

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');

describe('WSZ-007e electrical power calculations: worked examples', () => {
  const { dc, element, elementOhms, elementAt208, motor, fromAmps, kva } = GUIDE_EXAMPLES;

  it('4,500 W on 240 V (golden "4500 W at 240 V")', () => {
    const c = golden1('4500 W at 240 V');
    assert.equal(element.volts, c.inputs.volts);
    assert.equal((element.kw ?? 0) * 1000, c.inputs.watts);
    assert.ok(near(element.amps, c.expected.amps, c.tolerance.amps), `${element.amps}`);
  });

  it('50 kW on 480 V three-phase at PF 0.9 (golden)', () => {
    const c = golden1('50 kW three-phase 480 V, PF 0.9');
    assert.deepEqual([motor.volts, motor.phases, motor.kw, motor.pf], [c.inputs.volts, c.inputs.phase, c.inputs.kw, c.inputs.pf]);
    assert.ok(near(motor.amps, c.expected.amps, c.tolerance.amps), `${motor.amps}`);
  });

  it('50 A on 480 V three-phase at PF 0.92 to watts (golden), with S and Q of the triangle', () => {
    const c = golden1('50 A three-phase 480 V PF 0.92 to watts');
    assert.deepEqual([fromAmps.volts, fromAmps.phases, fromAmps.amps, fromAmps.pf], [c.inputs.volts, c.inputs.phase, c.inputs.amps, c.inputs.pf]);
    assert.ok(near((fromAmps.kw ?? 0) * 1000, c.expected.watts, c.tolerance.watts), `${fromAmps.kw}`);
    assert.ok(near(fromAmps.kva, (SQRT3 * fromAmps.volts * fromAmps.amps) / 1000, 1e-9));
    const kw = fromAmps.kw ?? 0;
    const kvar = fromAmps.kvar ?? 0;
    assert.ok(near(kvar * kvar + kw * kw, fromAmps.kva * fromAmps.kva, 1e-6), 'S² = P² + Q²');
  });

  it('75 kVA on 208 V three-phase (golden)', () => {
    const c = golden1('75 kVA three-phase 208 V');
    assert.deepEqual([kva.volts, kva.phases, kva.kva], [c.inputs.volts, c.inputs.phase, c.inputs.kva]);
    assert.equal(kva.pf, null, 'no power factor: the current only');
    assert.ok(near(kva.amps, c.expected.amps, c.tolerance.amps), `${kva.amps}`);
  });

  it('12 V across 4 Ω (golden "12 V across 4 ohms")', () => {
    const c = golden1('12 V across 4 ohms');
    assert.deepEqual([dc.voltage, dc.resistance], [c.inputs.volts, c.inputs.ohms]);
    assert.ok(near(dc.current, c.expected.amps, c.tolerance.amps));
    assert.ok(near(dc.power, c.expected.watts, c.tolerance.watts));
  });

  it('the element as a fixed resistance: 12.8 Ω at 240 V, and at 208 V about three quarters of its rating', () => {
    const watts = (element.kw ?? 0) * 1000;
    assert.ok(near(elementOhms.resistance, (element.volts * element.volts) / watts, 1e-9));
    assert.ok(near(elementOhms.current, element.amps, 1e-9), 'the same current both ways');
    assert.equal(elementAt208.voltage, 208);
    assert.ok(near(elementAt208.current, 208 / elementOhms.resistance, 1e-9));
    assert.ok(near(elementAt208.power, (208 * 208) / elementOhms.resistance, 1e-6));
    const share = elementAt208.power / watts;
    assert.ok(share > 0.74 && share < 0.76, `${share} is about three quarters`);
  });

  it('every voltage is a nominal system voltage', () => {
    assert.doesNotThrow(() => assertPowerGuideVolts('test'));
  });
});

describe('WSZ-007e watts per amp', () => {
  it('120 and 240 V single-phase, 208 and 480 V three-phase, at PF 1', () => {
    assert.deepEqual(
      WATTS_PER_AMP_ROWS.map((r) => [r.volts, r.phases]),
      [
        [120, 1],
        [240, 1],
        [208, 3],
        [480, 3],
      ],
    );
    for (const r of WATTS_PER_AMP_ROWS) {
      const expected = (r.phases === 3 ? SQRT3 : 1) * r.volts;
      assert.ok(near(r.watts, expected, 1e-9), `${r.key}: ${r.watts}`);
      assert.ok(near(r.ampsPerKw, 1000 / expected, 1e-9), `${r.key}: ${r.ampsPerKw} A per kW`);
    }
  });

  it('the 10 kW comparison of the single vs three phase guide agrees (golden)', () => {
    for (const [name, key] of [
      ['10 kW at 240 V single-phase, PF 1 (comparison)', '240-1'],
      ['10 kW at 208 V three-phase, PF 1 (comparison)', '208-3'],
      ['10 kW at 480 V three-phase, PF 1 (comparison)', '480-3'],
    ]) {
      const c = golden1(name);
      const row = WATTS_PER_AMP_ROWS.find((r) => r.key === key);
      assert.ok(row, key);
      assert.ok(near(row.ampsPerKw * c.inputs.kw, c.expected.amps, c.tolerance.amps), `${key}: ${row.ampsPerKw * c.inputs.kw}`);
    }
  });
});

describe('WSZ-007e sources: per-document rows only; power-definitions gone', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];

  it('/methodology lists the guide under exactly the sources it cites', () => {
    const listed = METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(ROUTE)).map((s) => s.domain);
    assert.deepEqual([...listed].sort(), [...CITED].sort());
  });

  it('the registry serves the guide from each cited source, and from no other', () => {
    for (const d of CITED) {
      const row = registry.find((r) => r.domain === d);
      assert.ok(row && row.status === 'verified' && row.pages_served.split(';').includes(ROUTE), `${d} → ${ROUTE}`);
    }
    const others = registry.filter((r) => !CITED.includes(r.domain) && r.pages_served.split(';').includes(ROUTE)).map((r) => r.domain);
    assert.deepEqual(others, [], 'no NEC 220 or SP 811 row for the guide');
    const mapRow = pageMap.find((r) => r.slug === ROUTE);
    assert.ok(mapRow);
    assert.equal(mapRow.data_source, 'eia-power-glossary');
    assert.deepEqual(mapRow.data_sources_all.split(';').sort(), [...CITED].sort());
  });

  it('the page passes the same six sources to <Sources>', () => {
    const page = read('../src/app/guides/electrical-power-calculations/page.tsx');
    const m = /<Sources\s+domains=\{\[([^\]]+)\]\}/.exec(page);
    assert.ok(m);
    const consts: Record<string, string> = {};
    for (const [, name, value] of page.matchAll(/^const (\w+) = '([a-z0-9-]+)';$/gm)) consts[name] = value;
    const named = m[1].split(',').map((s) => consts[s.trim()]);
    assert.deepEqual([...named].sort(), [...CITED].sort());
  });

  it('power-definitions is gone from the registry, the page map, /methodology and the code', () => {
    assert.equal(registry.find((r) => r.domain === 'power-definitions'), undefined);
    assert.ok(!pageMap.some((r) => Object.values(r).some((v) => v.split(';').includes('power-definitions'))));
    assert.ok(!METHODOLOGY_SECTIONS.some((s) => s.domain === 'power-definitions'));
    const walk = (dir: URL): string[] =>
      readdirSync(dir).flatMap((name) => {
        const u = new URL(name, dir);
        return statSync(u).isDirectory() ? walk(new URL(`${name}/`, dir)) : [u.pathname];
      });
    const quoted = walk(new URL('../src/', import.meta.url)).filter(
      (f) => /\.(ts|tsx|json)$/.test(f) && /['"]power-definitions['"]/.test(readFileSync(f, 'utf8')),
    );
    assert.deepEqual(quoted, [], 'no file names the domain as a source');
  });

  it('the guide renders in the look and joins gate b', () => {
    assert.match(read('../src/components/layout/GuidesFrame.tsx'), new RegExp(`'${ROUTE}'`));
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE));
    assert.ok(gates.necRefs.enforce.includes(ROUTE));
  });

  it('the old page’s removals stay out', () => {
    const page = read('../src/app/guides/electrical-power-calculations/page.tsx');
    for (const gone of ['lucide-react', 'VOLTAGE_SYSTEMS', 'POWER_TRIANGLE_DATA', 'Motor Efficiency', 'Capacitor bank', '13,158', '73%', 'refrigerator']) {
      assert.ok(!page.includes(gone), gone);
    }
    assert.ok(existsSync(new URL('../src/app/guides/electrical-power-calculations/page.tsx', import.meta.url)));
  });
});
