// WSZ-008e: the EV charger guide rebuilt in the look, on the Article 625 text of WSZ-031. Each row's breaker is 125 % of
// the output (625.41) and the makers' own; each copper size is the smallest that reaches the breaker in its column (60 °C
// for NM cable, 75 °C with every termination rated for it), the one below falls short; the ground wire is Table 250.122's;
// the 48 A row is Tesla's own statement; ChargePoint's 50 A setting rides 240.4(B). The guide's fourteen sources agree
// across the page, /methodology, the registry and the page map, and the page never names what the site has not verified.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ev625 from '../data/verified/nec-625-2023.json';
import evse from '../data/verified/mfr-evse.json';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { ROUTES } from '../src/lib/routes';
import { EMPORIA_PLUG, EV_CP_TOP, EV_HIGH, EV_LOW, EV_PLUG_IN, EV_ROWS, EV_TOP, EV_VOLTS, wireSizeLink } from '../src/lib/ev-guide';
import { CHARGEPOINT, EMPORIA, EVSE_WIRE_C, SHARED_OUTPUTS_A, TESLA, TESLA_MAX_WIRE } from '../src/lib/verified/mfr-evse';
import { DISCONNECT_ABOVE, EV_OCPD_PERCENT, INDIVIDUAL_CIRCUIT, RECEPTACLE_125_250_A } from '../src/lib/verified/nec-625';
import { OUTDOOR_GFCI } from '../src/lib/verified/nec-210-8-f';
import { TABLE_310_16_ROWS, columnKey, table31016 } from '../src/lib/verified/nec-310-16';
import { egcRow } from '../src/lib/verified/nec-250-122';
import { ocpdRatings } from '../src/lib/verified/nec-240-6-a';
import { VOLTAGE_DROP_NOTE } from '../src/lib/verified/nec-continuous-load-2023';
import { RESISTANCE_TEMP_C, lengthForDrop } from '../src/lib/calculations/voltage-drop';

const ROUTE = '/guides/wire-size-for-ev-charger';
const CITED = [
  'nec-625-ev',
  'mfr-evse',
  'nec-continuous-load',
  'nec-310-16',
  'nec-110-14c',
  'nec-cable-rules',
  'nec-240-ocpd',
  'nec-250-grounding',
  'conductor-resistance-20c',
  'nema-receptacle-configs',
  'nec-2023-rule-excerpts',
  'nec-2026-edition',
  'nec-220-load-calcs',
  'irs-30c-credit',
];
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
/** A source file with its comments removed, so a test reads only what renders or runs. */
const code = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const STANDARD = ocpdRatings();
const sizes = TABLE_310_16_ROWS.map((r) => r.size);

describe('WSZ-031 Article 625 and the makers', () => {
  it('every Article 625 rule the guide uses is VERIFIED-2023, from NFPA documents', () => {
    for (const ref of ['625.40', '625.41', '625.42', '625.43', '625.44', '625.54']) {
      const r = ev625.rules.find((x) => x.ref === ref);
      assert.ok(r && r.status.startsWith('VERIFIED-2023'), ref);
    }
    assert.match(ev625.source.url, /^https:\/\/docinfofiles\.nfpa\.org\/files\/AboutTheCodes\/70\/70_A2025_NEC_P12_PISubmittals\.pdf/);
    assert.deepEqual(INDIVIDUAL_CIRCUIT, { aboveA: 16, aboveV: 120 });
    assert.equal(EV_OCPD_PERCENT, 125);
    assert.deepEqual(DISCONNECT_ABOVE, { a: 60, voltsToGround: 150 });
    assert.deepEqual(RECEPTACLE_125_250_A, [30, 50, 60]);
    assert.deepEqual(OUTDOOR_GFCI, { maxVoltsToGround: 150, maxA: 50 });
  });

  it('the makers’ tables: Tesla and ChargePoint share 16 to 48 A; copper only; terminal limits', () => {
    assert.deepEqual(SHARED_OUTPUTS_A, [16, 24, 32, 40, 48]);
    for (const m of evse.makers) assert.equal(m.copper_only, true, m.id);
    assert.equal(TESLA.largestAwg, '4');
    assert.equal(CHARGEPOINT.largestAwg, '6');
    assert.equal(EMPORIA.largestAwg, '6');
    assert.deepEqual(TESLA_MAX_WIRE, { at60: '4', at75: '6' });
    assert.equal(EVSE_WIRE_C, 90);
    const quotes = evse.makers.flatMap((m) => Object.values(m.quotes));
    for (const q of ['must be rated for 125% of the maximum load', '4 AWG will not fit', 'Do NOT install cord-and-plug type connections']) {
      assert.ok(quotes.some((x) => x.includes(q)), q);
    }
  });
});

describe('WSZ-008e the chart', () => {
  it('each breaker is 125 % of the output, a standard rating, and the one every maker lists', () => {
    for (const r of EV_ROWS) {
      assert.equal(r.breakerA, (r.outputA * EV_OCPD_PERCENT) / 100, `${r.outputA} A`);
      assert.ok(STANDARD.includes(r.breakerA));
      for (const m of [TESLA, CHARGEPOINT, EMPORIA]) {
        const c = m.circuits.find((x) => x.outputA === r.outputA);
        if (c) assert.equal(c.breakerA, r.breakerA, `${m.maker} ${r.outputA} A`);
      }
    }
    assert.deepEqual(
      EV_ROWS.map((r) => [r.outputA, r.kw, r.breakerA]),
      [
        [16, 3.8, 20],
        [24, 5.7, 30],
        [32, 7.6, 40],
        [40, 9.6, 50],
        [48, 11.5, 60],
      ],
    );
  });

  it('each size is the smallest copper that reaches the breaker in its column, and the one below falls short', () => {
    assert.equal(EV_LOW, 60);
    assert.equal(EV_HIGH, 75);
    for (const r of EV_ROWS) {
      const picks: [typeof r.nm, number][] = [
        [r.nm, EV_LOW],
        [r.c75, EV_HIGH],
      ];
      for (const [pick, column] of picks) {
        const a = table31016(pick.size, columnKey('Cu', column as 60 | 75));
        assert.equal(pick.ampacity, a);
        assert.ok(a !== null && a >= r.breakerA, `${r.outputA} A: ${pick.size} at ${column} °C`);
        const below = sizes[sizes.indexOf(pick.size) - 1];
        const belowA = table31016(below, columnKey('Cu', column as 60 | 75));
        // 14 AWG reaches 20 A at 75 °C, but 240.4(D) caps it at 15 A
        if (below === '14') assert.equal(r.breakerA, 20);
        else assert.ok(belowA !== null && belowA < r.breakerA, `${r.outputA} A: ${below} at ${column} °C`);
      }
    }
    assert.deepEqual(
      EV_ROWS.map((r) => [r.nm.size, r.c75.size, r.egc]),
      [
        ['12', '12', '12'],
        ['10', '10', '10'],
        ['8', '8', '10'],
        ['6', '8', '10'],
        ['4', '6', '10'],
      ],
    );
  });

  it('the ground wire is Table 250.122’s copper size for the breaker', () => {
    for (const r of EV_ROWS) assert.equal(r.egc, egcRow(r.breakerA)?.cu);
  });

  it('the 48 A row is Tesla’s own; ChargePoint and Emporia need the 75 °C size there', () => {
    assert.equal(EV_TOP.outputA, 48);
    assert.equal(EV_TOP.nm.size, TESLA_MAX_WIRE.at60);
    assert.equal(EV_TOP.c75.size, TESLA_MAX_WIRE.at75);
    assert.equal(sizes.indexOf(EV_TOP.nm.size) > sizes.indexOf(CHARGEPOINT.largestAwg), true);
    assert.equal(EV_TOP.c75.size, CHARGEPOINT.largestAwg);
  });

  it('plug-in: ChargePoint on the 40 and 50 A circuits, Emporia’s 14-50 on 50 A', () => {
    assert.deepEqual(
      EV_PLUG_IN.map((r) => r.breakerA),
      [40, 50],
    );
    assert.deepEqual([EMPORIA_PLUG.breakerA, EMPORIA_PLUG.outputA], [50, 40]);
  });

  it('ChargePoint’s 50 A setting: 70 A, hardwired; 6 AWG at 75 °C under 240.4(B), 4 AWG in NM cable', () => {
    assert.equal(EV_CP_TOP.outputA, 50);
    assert.equal(EV_CP_TOP.neededA, 62.5);
    assert.equal(EV_CP_TOP.breakerA, 70);
    assert.deepEqual(EV_CP_TOP.c75, { size: '6', ampacity: 65 });
    assert.ok(!STANDARD.includes(65) && STANDARD.find((x) => x > 65) === 70);
    assert.deepEqual(EV_CP_TOP.nm, { size: '4', ampacity: 70 });
    assert.equal(EV_CP_TOP.egc, egcRow(70)?.cu);
  });

  it('the 3 % lengths are the engine’s at 240 V, conductors at 75 °C', () => {
    assert.equal(EV_VOLTS, 240);
    for (const r of EV_ROWS) {
      for (const [k, size] of [
        ['nm', r.nm.size],
        ['c75', r.c75.size],
      ] as const) {
        const ft = lengthForDrop({ size, material: 'Cu', amps: r.outputA, volts: 240, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C }, VOLTAGE_DROP_NOTE.feederPct);
        assert.equal(r.noteFt[k], ft);
      }
    }
    assert.equal(wireSizeLink(EV_TOP), '/calculators/wire-size-calculator?rating=60&load=48&continuous=yes&phase=single&voltage=240');
  });
});

describe('WSZ-008e sources, listings and limits', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];
  const allowlist = parseCsv(read('../research/nec-sections-allowlist.csv')) as Record<string, string>[];
  const page = code('../src/app/guides/wire-size-for-ev-charger/page.tsx');

  it('/methodology, the registry and the page map list the guide under its fourteen sources', () => {
    const listed = METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(ROUTE)).map((s) => s.domain);
    assert.deepEqual([...listed].sort(), [...CITED].sort());
    for (const d of CITED) {
      const row = registry.find((r) => r.domain === d);
      assert.ok(row && row.status === 'verified' && row.pages_served.split(';').includes(ROUTE), d);
      assert.ok(page.includes(`'${d}'`), `the page cites ${d}`);
    }
    const mapRow = pageMap.find((r) => r.slug === ROUTE);
    assert.ok(mapRow);
    assert.deepEqual(mapRow.data_sources_all.split(';').sort(), [...CITED].sort());
    assert.ok(!registry.some((r) => !CITED.includes(r.domain) && r.pages_served.split(';').includes(ROUTE)));
  });

  it('the allowlist carries Article 625 as 2023 and verified, the D-09 hold closed', () => {
    for (const ref of ['625.40', '625.41', '625.42', '625.42(A)', '625.42(B)', '625.43', '625.44', '625.54']) {
      const row = allowlist.find((r) => r.ref === ref);
      assert.ok(row && row.edition === '2023' && row.status === 'verified' && row.domain === 'nec-625-ev', ref);
    }
  });

  it('never names what the site has not verified, nor the old page’s claims', () => {
    for (const gone of ['340.80', '310.15(F)', '625.17', '750.30', 'JuiceBox', 'through 2032', 'DC Fast', 'Level 3', 'lucide-react', 'aluminum wire for 50']) {
      assert.ok(!page.includes(gone), gone);
    }
  });

  it('joins gates b and c, and the route list names it', () => {
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE));
    assert.ok(gates.necRefs.enforce.includes(ROUTE));
    const r = ROUTES.find((x) => x.path === ROUTE);
    assert.ok(r && r.name === 'Wire Size for EV Charger');
    assert.match(read('../src/components/layout/GuidesFrame.tsx'), /'\/guides\/wire-size-for-ev-charger'/);
  });
});
