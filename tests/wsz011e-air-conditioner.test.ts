// WSZ-011e (with WSZ-036's sources): the air conditioner calculator, back from its WSZ-002 withdrawal. The copper wire is
// sized to the nameplate's MCA (440.4(B)) in Table 310.16 at the terminal column for the MOCP; Table 240.4(G) lifts the
// 240.4(D) cap; the ground wire is Table 250.122's at the MOCP, not larger than the wire (250.122(A)) and grown with it
// (250.122(B)); the breaker is at most the MOCP. Copper only. The page's sources agree with /methodology, the registry
// and the page map, and it states no 440.32 or 440.35 rule.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { ROUTES } from '../src/lib/routes';
import { AC_MOCP_OPTIONS, DOMAINS, ENGINE_ID, acCircuit } from '../src/lib/calculations/ac-circuit';
import type { AcInput } from '../src/lib/calculations/ac-circuit';
import { AC_DOCS, AC_UNITS } from '../src/lib/verified/mfr-hvac';
import { AC_CONDUCTORS_240_4_G, COMPRESSOR_PROTECTION, NAMEPLATE_MARKINGS } from '../src/lib/verified/nec-440';
import { EGC_CAP_250_122_A } from '../src/lib/verified/nec-250-122';
import { DROP_ROWS, EXAMPLE, FIVE_TON, LONG_RUN, TWO_TON, UNIT_ROWS } from '../src/lib/ac-page';

const ROUTE = '/calculators/air-conditioner-calculator';
const CITED = ['nec-310-16', 'nec-110-14c', 'nec-240-ocpd', 'nec-240-4-d', 'nec-250-grounding', 'conductor-resistance-20c', 'nec-440-hvac', 'mfr-hvac-specs'];
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
const code = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const base: AcInput = { mcaA: 17.6, mocpA: 30, volts: 240, wiringMethod: 'conductors', termination: 'unknown', lengthFt: 50, vdTargetPct: 3 };
const run = (patch: Partial<AcInput>) => {
  const r = acCircuit({ ...base, ...patch });
  if ('error' in r) throw new Error(r.error);
  return r;
};

describe('WSZ-036 the sources', () => {
  it('440.4(B), 240.4(G), 440.22(A) and 250.122(A) as the 2023 text gives them', () => {
    assert.match(NAMEPLATE_MARKINGS.mca, /minimum supply circuit conductor ampacity/);
    assert.match(NAMEPLATE_MARKINGS.mocp, /maximum rating/);
    assert.match(AC_CONDUCTORS_240_4_G, /Article 440, Parts III, IV, VI/);
    assert.deepEqual(COMPRESSOR_PROTECTION, { maxPct: 175, startPct: 225 });
    assert.equal(EGC_CAP_250_122_A, 'The equipment grounding conductor shall not be required to be larger than the circuit conductors supplying the equipment.');
  });

  it('Carrier 26SCA5 and Amana ALXS3N: 14 units, 1.5 to 5 tons, copper only; Carrier 3.5 and 4 ton carry the coastal MOCP', () => {
    assert.equal(AC_UNITS.length, 14);
    const carrier = AC_UNITS.filter((u) => u.brand === 'Carrier').map((u) => [u.tons, u.mcaA, u.mocpA]);
    assert.deepEqual(carrier, [[1.5, 10.9, 15], [2, 13.6, 20], [2.5, 16.5, 25], [3, 17.6, 30], [3.5, 22.7, 35], [4, 29.1, 40], [5, 31.1, 50]]);
    const amana = AC_UNITS.filter((u) => u.brand === 'Amana').map((u) => [u.tons, u.mcaA, u.mocpA]);
    assert.deepEqual(amana, [[1.5, 10.9, 15], [2, 10.9, 15], [2.5, 14.7, 25], [3, 17.5, 30], [3.5, 19.4, 30], [4, 25.6, 45], [5, 31.1, 50]]);
    assert.deepEqual(AC_UNITS.filter((u) => u.coastalMocpA !== null).map((u) => [u.tons, u.coastalMocpA]), [[3.5, 40], [4, 50]]);
    assert.match(AC_DOCS.carrier.copper, /Copper wire must be used from service disconnect to unit/);
    assert.match(AC_DOCS.amana.protective_device, /time-delay fuses or HACR-type circuit breakers/);
  });
});

describe('WSZ-011e the engine', () => {
  it('a 3-ton unit (MCA 17.6 A, MOCP 30 A): 12 AWG at 60 °C on a 30 A breaker, 240.4(G) over 240.4(D), a 12 AWG ground (250.122(A))', () => {
    const r = run({});
    assert.deepEqual([r.columnC, r.firstSize, r.firstAmpacity, r.size, r.overSmallLimitA, r.tableEgc, r.egc, r.egcCapped, r.egcGrown], [60, '12', 20, '12', 20, '10', '12', true, false]);
    assert.match(r.steps[1], /240\.4\(D\) would hold 12 AWG to a 20 A breaker, but Table 240\.4\(G\)/);
    assert.match(r.steps[r.steps.length - 2], /250\.122\(A\) does not require it to be larger than the circuit conductors, so 12 AWG/);
    const r75 = run({ termination: '75' });
    assert.deepEqual([r75.columnC, r75.size, r75.egc], [75, '14', '14']);
    const cable = run({ wiringMethod: 'cable', termination: '75' });
    assert.equal(cable.columnC, 60);
  });

  it('the drop moves the wire up and the ground wire with it (250.122(B)); 208 V drops more than 240 V', () => {
    const long = run({ lengthFt: 150 });
    assert.deepEqual([long.firstSize, long.size, long.egc, long.egcGrown], ['12', '10', '10', true]);
    assert.ok(long.firstVdPct > 3 && long.vdPct <= 3);
    assert.ok(run({ volts: 208 }).vdPct > run({}).vdPct);
    assert.deepEqual([LONG_RUN.firstSize, LONG_RUN.size, LONG_RUN.egc], ['12', '10', '10']);
  });

  it('a 5-ton unit: 8 AWG at 60 °C, 10 AWG at 75 °C, a 10 AWG ground; the MOCP above the ampacity is explained', () => {
    assert.deepEqual([FIVE_TON.cu60.size, FIVE_TON.cu75.size, FIVE_TON.cu60.egc], ['8', '10', '10']);
    assert.equal(FIVE_TON.cu60.overSmallLimitA, null);
    assert.match(FIVE_TON.cu60.steps[1], /The MOCP is above that ampacity: Table 240\.4\(G\)/);
    assert.deepEqual([TWO_TON.cu60.size, TWO_TON.cu60.tableEgc, TWO_TON.cu60.egc], ['14', '12', '14']);
    assert.equal(EXAMPLE.unit.model, '26SCA5 size 36');
  });

  it('refuses an MOCP below the MCA, a rating outside 240.6(A) and an MCA past 100 A; offers 15 to 100 A', () => {
    assert.ok('error' in acCircuit({ ...base, mcaA: 31, mocpA: 30 }));
    assert.ok('error' in acCircuit({ ...base, mocpA: 33 }));
    assert.ok('error' in acCircuit({ ...base, mcaA: 120, mocpA: 100 }));
    assert.ok('error' in acCircuit({ ...base, mcaA: 0 }));
    assert.equal(AC_MOCP_OPTIONS[0], 15);
    assert.equal(AC_MOCP_OPTIONS[AC_MOCP_OPTIONS.length - 1], 100);
    assert.ok(AC_MOCP_OPTIONS.includes(45));
    assert.equal(run({ mcaA: 80, mocpA: 80 }).steps.some((s) => s.includes('for an 80 A breaker')), true);
  });

  it('the page tables: 14 units; 12 AWG first in the drop table', () => {
    assert.equal(UNIT_ROWS.length, 14);
    assert.equal(DROP_ROWS[0].size, '12');
    for (let k = 1; k < DROP_ROWS.length; k++) assert.ok(DROP_ROWS[k].ft > DROP_ROWS[k - 1].ft);
  });
});

describe('WSZ-011e sources and listings', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];
  const page = code('../src/app/calculators/air-conditioner-calculator/page.tsx');

  it('/methodology, the registry and the page map list the calculator under its eight sources; no 440.32 or 440.35', () => {
    assert.equal(ENGINE_ID, 'ac-circuit');
    assert.ok(DOMAINS.includes('nec-440-hvac') && DOMAINS.includes('mfr-hvac-specs'));
    assert.deepEqual(METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(ROUTE)).map((s) => s.domain).sort(), [...CITED].sort());
    for (const d of CITED) {
      const row = registry.find((r) => r.domain === d);
      assert.ok(row && row.status === 'verified' && row.pages_served.split(';').includes(ROUTE), d);
    }
    assert.ok(!registry.some((r) => !CITED.includes(r.domain) && r.pages_served.split(';').includes(ROUTE)));
    assert.deepEqual(pageMap.find((r) => r.slug === ROUTE)?.data_sources_all.split(';').sort(), [...CITED].sort());
    assert.ok(!/440\.3[25]/.test(page));
  });

  it('no withdrawal; joins the gates, the route list and the footer', () => {
    assert.ok(!page.includes('WithdrawnTool'));
    assert.ok(!read('../research/wsz002-withdrawals.csv').includes(ROUTE));
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE) && gates.necRefs.enforce.includes(ROUTE));
    const r = ROUTES.find((x) => x.path === ROUTE);
    assert.ok(r && r.name === 'Air Conditioner Wire Size Calculator' && r.group === 'wire-sizing' && !/\d/.test(r.line));
    assert.match(read('../src/components/layout/Footer.tsx'), /air-conditioner-calculator/);
  });
});
