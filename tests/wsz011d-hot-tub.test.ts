// WSZ-011d (with WSZ-035's re-read of the makers' manuals): the hot tub calculator, back from its WSZ-002 withdrawal.
// The circuit is the wire size engine's for the breaker the hot tub's manual asks for, in copper only, at 240 V (four
// wires) or 120 V; GFCI and the disconnect are the makers' requirements; no NEC Article 680 rule is stated; the page's
// sources agree with /methodology, the registry and the page map.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { ROUTES } from '../src/lib/routes';
import { DOMAINS, ENGINE_ID, HT_BREAKERS, hotTub } from '../src/lib/calculations/hot-tub';
import { SPA_MAKERS, makerBreakers } from '../src/lib/verified/mfr-spas';
import { BREAKER_ROWS, LONG_RUN, breakerRow } from '../src/lib/hot-tub-page';

const ROUTE = '/calculators/hot-tub-calculator';
const CITED = ['nec-310-16', 'nec-110-14c', 'nec-240-ocpd', 'nec-240-4-d', 'nec-250-grounding', 'conductor-resistance-20c', 'mfr-spas'];
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
const code = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

describe('WSZ-011d the makers', () => {
  it('Hot Spring, Bullfrog and Marquis: 50 A at 240 V (Bullfrog also 60 A), 4 wires, copper; 15 or 20 A at 120 V', () => {
    assert.deepEqual(makerBreakers(240), [50, 60]);
    assert.deepEqual(makerBreakers(120), [15, 20]);
    for (const m of SPA_MAKERS.filter((x) => x.volts === 240)) assert.ok(m.wires === 4 && m.copper_only === true, m.maker);
    const mq = SPA_MAKERS.find((m) => m.maker === 'Marquis' && m.volts === 240);
    assert.match(mq?.conductors ?? '', /6 AWG copper plus an 8 AWG copper ground/);
    assert.equal(SPA_MAKERS.find((m) => m.maker === 'Hot Spring' && m.volts === 240)?.volts_printed, 230);
  });
});

describe('WSZ-011d the engine', () => {
  it('sizes the breaker circuit in copper: 50 A takes 6 AWG at 60 °C, 8 AWG at 75 °C, a 10 AWG ground, four wires', () => {
    assert.deepEqual(HT_BREAKERS, { 240: [30, 40, 50, 60], 120: [15, 20] });
    const r50 = breakerRow(240, 50);
    assert.deepEqual([r50.cu60.size, r50.cu75.size, r50.egc], ['6', '8', '10']);
    assert.deepEqual([breakerRow(240, 60).cu60.size, breakerRow(240, 60).cu75.size], ['4', '6']);
    assert.deepEqual([breakerRow(120, 20).cu60.size, breakerRow(120, 15).cu60.size], ['12', '14']);
    assert.equal(BREAKER_ROWS.length, 6);
    const r = hotTub({ volts: 240, breakerA: 50, wiringMethod: 'conductors', termination: 'unknown', lengthFt: 50, vdTargetPct: 3 });
    assert.ok(!('error' in r));
    if (!('error' in r)) assert.deepEqual([r.feeder.size, r.feeder.egc, r.wires], ['6', '10', 4]);
    const plug = hotTub({ volts: 120, breakerA: 20, wiringMethod: 'conductors', termination: 'unknown', lengthFt: 30, vdTargetPct: 3 });
    assert.ok(!('error' in plug) && plug.wires === 3);
  });

  it('a long run steps the copper up and the ground wire with it; breakers outside the lists are refused', () => {
    assert.deepEqual([LONG_RUN.feeder.minSizeByAmpacity, LONG_RUN.feeder.size, LONG_RUN.feeder.egc], ['6', '4', '6']);
    assert.ok('error' in hotTub({ volts: 240, breakerA: 45, wiringMethod: 'conductors', termination: 'unknown', lengthFt: 50, vdTargetPct: 3 }));
    assert.ok('error' in hotTub({ volts: 120, breakerA: 50, wiringMethod: 'conductors', termination: 'unknown', lengthFt: 50, vdTargetPct: 3 }));
  });
});

describe('WSZ-011d sources and listings', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];
  const page = code('../src/app/calculators/hot-tub-calculator/page.tsx');

  it('/methodology, the registry and the page map list the calculator under its seven sources; no Article 680 section', () => {
    assert.equal(ENGINE_ID, 'hot-tub');
    assert.ok(DOMAINS.includes('mfr-spas') && !DOMAINS.includes('nec-680-pools-spas'));
    assert.deepEqual(METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(ROUTE)).map((s) => s.domain).sort(), [...CITED].sort());
    for (const d of CITED) {
      const row = registry.find((r) => r.domain === d);
      assert.ok(row && row.status === 'verified' && row.pages_served.split(';').includes(ROUTE), d);
    }
    assert.ok(!registry.some((r) => !CITED.includes(r.domain) && r.pages_served.split(';').includes(ROUTE)));
    assert.deepEqual(pageMap.find((r) => r.slug === ROUTE)?.data_sources_all.split(';').sort(), [...CITED].sort());
    assert.ok(!/680\.\d/.test(page));
  });

  it('no withdrawal; joins the gates, the route list and the footer', () => {
    assert.ok(!page.includes('WithdrawnTool'));
    assert.ok(!read('../research/wsz002-withdrawals.csv').includes(ROUTE));
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE) && gates.necRefs.enforce.includes(ROUTE));
    const r = ROUTES.find((x) => x.path === ROUTE);
    assert.ok(r && r.name === 'Hot Tub Wire Size Calculator' && r.group === 'wire-sizing' && !/\d/.test(r.line));
    assert.match(read('../src/components/layout/Footer.tsx'), /hot-tub-calculator/);
  });
});
