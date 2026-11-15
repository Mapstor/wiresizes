// WSZ-008b: the service entrance calculator rebuilt in the look. serviceEntrance reproduces the golden service lookup
// rows and, with a run, the golden voltage drop of 4/0 AWG aluminum at 200 A over 100 ft; it refuses runs outside
// 0–2,000 ft and loads above the rating. /methodology, the registry and the page map list the page under the four
// sources it cites, and no longer under NEC 220 or the candidate installation row. Golden values come from
// research/golden-cases.json, never typed here.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import golden from '../research/golden-cases.json';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { DOMAINS, SERVICE_RATINGS, SERVICE_VOLTS, isServiceError, minimumServiceAmpacity, serviceEntrance } from '../src/lib/calculations/service-lookup';

interface GoldenCase {
  group: string;
  name: string;
  inputs: Record<string, number | string>;
  expected: Record<string, unknown>;
  tolerance?: Record<string, number>;
}
const cases = golden.cases as unknown as GoldenCase[];
const ROUTE = '/calculators/service-entrance-calculator';
const CITED = ['nec-310-12', 'nec-250-grounding', 'conductor-resistance-20c', 'awg-geometry'];
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');

describe('WSZ-008b service conductors and electrode conductor', () => {
  for (const c of cases.filter((x) => x.group === 'service-lookup')) {
    it(c.name, () => {
      for (const m of ['Cu', 'Al'] as const) {
        const r = serviceEntrance(Number(c.inputs.rating_a), m);
        assert.ok(!isServiceError(r));
        assert.equal(r.size, m === 'Cu' ? c.expected.cu : c.expected.al_cca);
        const g = (m === 'Cu' ? c.expected.gec_for_cu_service : c.expected.gec_for_al_service) as { cu: string; al_cca: string };
        assert.deepEqual(r.gec, { cu: g.cu, alCca: g.al_cca });
        assert.equal(r.drop, null);
      }
    });
  }

  it('83 % of the rating, from the 310.12(A) rule', () => {
    const r = serviceEntrance(200, 'Cu');
    assert.ok(!isServiceError(r));
    assert.equal(r.minAmpacity, minimumServiceAmpacity(200));
    assert.ok(Math.abs(r.minAmpacity - 166) < 1e-9);
  });

  it('a rating that is not a Table 310.12 row is refused', () => {
    for (const a of [120, 0, 500]) assert.ok(isServiceError(serviceEntrance(a, 'Cu')), `${a}`);
    assert.deepEqual(SERVICE_RATINGS, [100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400]);
  });
});

describe('WSZ-008b voltage drop over the run', () => {
  it('golden: 4/0 AWG aluminum, 200 A, 100 ft one way, 240 V', () => {
    const c = cases.find((x) => x.name === '4/0 AWG Al, 200 A, 100 ft one way, 240 V, single-phase, 75 °C');
    assert.ok(c && c.tolerance);
    assert.equal(SERVICE_VOLTS, c.inputs.volts);
    const r = serviceEntrance(200, 'Al', { lengthFt: Number(c.inputs.length_ft_one_way), amps: Number(c.inputs.amps) });
    assert.ok(!isServiceError(r) && r.drop);
    assert.equal(r.size, c.inputs.size);
    assert.ok(Math.abs(r.drop.result.vdVolts - Number(c.expected.vd_volts)) <= c.tolerance.vd_volts);
    assert.ok(Math.abs(r.drop.result.vdPct - Number(c.expected.vd_percent)) <= c.tolerance.vd_percent);
  });

  it('the drop scales with the load; runs outside 0–2,000 ft and loads above the rating are refused', () => {
    const full = serviceEntrance(200, 'Cu', { lengthFt: 175, amps: 200 });
    const half = serviceEntrance(200, 'Cu', { lengthFt: 175, amps: 100 });
    assert.ok(!isServiceError(full) && full.drop && !isServiceError(half) && half.drop);
    assert.ok(Math.abs(half.drop.result.vdVolts * 2 - full.drop.result.vdVolts) < 1e-9);
    for (const run of [
      { lengthFt: 0, amps: 100 },
      { lengthFt: 2001, amps: 100 },
      { lengthFt: 100, amps: 0 },
      { lengthFt: 100, amps: 201 },
    ]) {
      const r = serviceEntrance(200, 'Cu', run);
      assert.ok(isServiceError(r), JSON.stringify(run));
    }
  });
});

describe('WSZ-008b sources and removals', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];

  it('the engine, /methodology, the registry and the page map agree on the four sources', () => {
    assert.deepEqual([...DOMAINS].sort(), [...CITED].sort());
    const listed = METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(ROUTE)).map((s) => s.domain);
    assert.deepEqual([...listed].sort(), [...CITED].sort());
    for (const d of CITED) {
      const row = registry.find((r) => r.domain === d);
      assert.ok(row && row.status === 'verified' && row.pages_served.split(';').includes(ROUTE), d);
    }
    for (const d of ['nec-220-load-calcs', 'nec-misc-installation']) {
      const row = registry.find((r) => r.domain === d);
      assert.ok(!row || !row.pages_served.split(';').includes(ROUTE), d);
    }
    const mapRow = pageMap.find((r) => r.slug === ROUTE);
    assert.ok(mapRow);
    assert.deepEqual(mapRow.data_sources_all.split(';').sort(), [...CITED].sort());
  });

  it('the old component is gone; the page joins gates b and c', () => {
    assert.ok(!existsSync(new URL('../src/components/calculators/ServiceEntranceCalculator.tsx', import.meta.url)));
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE));
    assert.ok(gates.necRefs.enforce.includes(ROUTE));
  });
});
