// WSZ-039: the conduit fill calculator on NEC 2023 Informative Annex C (data/verified/nec-ch9-annex-c.json).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import data from '../data/verified/nec-ch9-annex-c.json';
import { CONDUCTOR_TYPES, FILL_NOTES, FILL_PERCENT, RACEWAYS, TRADE_SIZES, allAnnexCRows, annexCRows, racewayTradeIndexes } from '../src/lib/verified/nec-annex-c';
import { annexCCount, conduitFill, isConduitFillError, racewayInSentence, sizesFor } from '../src/lib/calculations/conduit-fill';
import { ANSWER, COMPACT_EXAMPLE, COMPACT_FIRST, COMPACT_THHN_FIRST, COMPARE, NO_TRADE_ONE, SIZE_EXAMPLE } from '../src/lib/conduit-fill-page';
import { ROUTES } from '../src/lib/routes';
import PAGE_DATES from '../src/data/page-dates.json';

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
const ROUTE = '/calculators/conduit-fill-calculator';
const trade = (t: string) => TRADE_SIZES.findIndex((x) => x.trade === t);

describe('WSZ-039 Annex C data', () => {
  it('has the 26 tables, 134 conductor rows and 57 compact rows each, 2,483 rows in all', () => {
    const counts = data.counts as unknown as Record<string, Record<string, Record<string, unknown>>>;
    assert.equal(Object.keys(counts).length, 26);
    for (const [table, groups] of Object.entries(counts)) {
      const rows = Object.values(groups).reduce((n, g) => n + Object.keys(g).length, 0);
      assert.equal(rows, table.endsWith('(A)') ? 57 : 134, table);
    }
    assert.equal(allAnnexCRows().length, 2483);
  });

  it('counts never fall as the trade size grows, nor rise as the wire grows', () => {
    const byGroup = new Map<string, (number | null)[][]>();
    for (const [table, group, , row] of allAnnexCRows()) {
      const vals = row.filter((v): v is number => v !== null);
      for (let k = 1; k < vals.length; k++) assert.ok(vals[k] >= vals[k - 1], `${table} ${group}`);
      const key = `${table}|${group}`;
      byGroup.set(key, [...(byGroup.get(key) ?? []), row]);
    }
    for (const [key, rows] of byGroup) {
      for (let r = 1; r < rows.length; r++) {
        for (let c = 0; c < 13; c++) {
          const a = rows[r - 1][c];
          const b = rows[r][c];
          if (a !== null && b !== null) assert.ok(b <= a, `${key} column ${c}`);
        }
      }
    }
  });

  it('matches the known THHN counts in EMT and Schedule 40 PVC', () => {
    assert.deepEqual(['1/2', '3/4', '1'].map((t) => annexCCount('emt', 'thhn', '12', t)), [9, 16, 26]);
    assert.deepEqual(['1/2', '3/4', '1'].map((t) => annexCCount('emt', 'thhn', '14', t)), [12, 22, 35]);
    assert.deepEqual(['1/2', '3/4', '1'].map((t) => annexCCount('emt', 'thhn', '10', t)), [5, 10, 16]);
    assert.deepEqual(['1/2', '3/4', '1', '1-1/4', '1-1/2', '2'].map((t) => annexCCount('pvc-40', 'thhn', '12', t)), [8, 15, 25, 43, 59, 99]);
  });

  it('reads the two RMC rows printed without the 3/8 dash as dashes', () => {
    const c9 = (data.counts as unknown as Record<string, Record<string, Record<string, (number | null)[]>>>)['C.9'];
    assert.deepEqual(c9.thhn['500'], [null, 0, 0, 0, 1, 1, 1, 2, 4, 5, 7, 11, 16]);
    assert.deepEqual(c9.fep['2'], [null, 1, 1, 3, 6, 8, 14, 20, 31, 41, 53, 83, 120]);
  });

  it('Table 1 and the notes the page uses', () => {
    assert.deepEqual(FILL_PERCENT, { one: 53, two: 31, overTwo: 40 });
    assert.deepEqual([FILL_NOTES.nipplePercent, FILL_NOTES.nippleMaxIn, FILL_NOTES.roundUpDecimal], [60, 24, 0.8]);
    assert.deepEqual([FILL_NOTES.jamLow, FILL_NOTES.jamHigh], [2.8, 3.2]);
  });

  it('every type reads its rows in size order, across shared groups', () => {
    assert.deepEqual(sizesFor('emt', 'thw', false).slice(0, 6), ['14', '12', '10', '8', '6', '4']);
    assert.equal(sizesFor('emt', 'thw', false).at(-1), '2000');
    assert.equal(sizesFor('emt', 'xhhw', false).length, 28);
    assert.deepEqual(sizesFor('emt', 'pfa', false).slice(-2), ['3/0', '4/0']);
    assert.equal(sizesFor('emt', 'thhn', false).at(-1), '1000');
    assert.equal(COMPACT_FIRST, '8');
    assert.equal(COMPACT_THHN_FIRST, '6');
    for (const t of CONDUCTOR_TYPES) for (const r of RACEWAYS) assert.ok(annexCRows(r.id, t.id, false).length > 0, `${r.id} ${t.id}`);
  });

  it('lists only the trade sizes each table prints', () => {
    assert.deepEqual(racewayTradeIndexes('ent').map((k) => TRADE_SIZES[k].trade), ['1/2', '3/4', '1', '1-1/4', '1-1/2', '2']);
    assert.deepEqual(racewayTradeIndexes('pvc-eb').map((k) => TRADE_SIZES[k].trade), ['2', '3', '3-1/2', '4', '5', '6']);
    assert.equal(racewayTradeIndexes('emt')[0], trade('1/2'));
  });
});

describe('WSZ-039 engine', () => {
  it('how many fit: 12 AWG THHN in 3/4 EMT is 16', () => {
    const r = conduitFill({ raceway: 'emt', type: 'thhn', compact: false, size: '12', mode: 'count', tradeIndex: trade('3/4') });
    assert.ok(!isConduitFillError(r));
    assert.equal(r.cell?.max, 16);
    assert.equal(r.table, 'C.1');
    assert.match(r.steps[0], /Table C\.1, electrical metallic tubing \(EMT\).*53 %.*31 %.*40 %.*0\.8 or more/);
    assert.match(r.steps[1], /trade size 3\/4 \(metric designator 21\): 16 conductors\./);
  });

  it('conduit size: four 6 AWG THHN need 3/4 in EMT; none holds 2,000 of 14 AWG in ENT', () => {
    const r = conduitFill({ raceway: 'emt', type: 'thhn', compact: false, size: '6', mode: 'size', conductors: 4 });
    assert.ok(!isConduitFillError(r));
    assert.equal(r.smallest?.trade.trade, '3/4');
    const none = conduitFill({ raceway: 'ent', type: 'thhn', compact: false, size: '14', mode: 'size', conductors: 2000 });
    assert.ok(!isConduitFillError(none));
    assert.equal(none.smallest, null);
    assert.match(none.steps[1], /No trade size holds 2,000/);
  });

  it('compact stranding reads the (A) table', () => {
    const r = conduitFill({ raceway: 'emt', type: 'xhhw', compact: true, size: '4/0', mode: 'count', tradeIndex: trade('2') });
    assert.ok(!isConduitFillError(r));
    assert.equal(r.table, 'C.1(A)');
    assert.equal(r.typeLabel, 'compact XHHW, XHHW-2');
    assert.deepEqual([COMPACT_EXAMPLE.regular, COMPACT_EXAMPLE.compact], [4, 5]);
  });

  it('rejects a size, trade size or count the tables do not list', () => {
    const e1 = conduitFill({ raceway: 'emt', type: 'fep', compact: false, size: '1', mode: 'count', tradeIndex: trade('1') });
    assert.deepEqual(e1, { error: 'size-not-listed' });
    const e2 = conduitFill({ raceway: 'emt', type: 'thhn', compact: false, size: '12', mode: 'count', tradeIndex: trade('3/8') });
    assert.deepEqual(e2, { error: 'trade-not-listed' });
    for (const n of [0, 2.5, 2001]) {
      assert.deepEqual(conduitFill({ raceway: 'emt', type: 'thhn', compact: false, size: '12', mode: 'size', conductors: n }), { error: 'count-invalid' });
    }
  });

  it('names raceways inside a sentence', () => {
    assert.equal(racewayInSentence('Rigid metal conduit (RMC)'), 'rigid metal conduit (RMC)');
    assert.equal(racewayInSentence('Type A rigid PVC conduit'), 'Type A rigid PVC conduit');
  });
});

describe('WSZ-039 page and registration', () => {
  it('page values come from the tables', () => {
    assert.deepEqual(ANSWER.map((a) => a.counts.map((c) => c.n)), [[12, 22, 35], [9, 16, 26], [5, 10, 16]]);
    assert.equal(COMPARE[0].id, 'pvc-a');
    assert.equal(COMPARE.at(-1)?.id, 'pvc-80');
    assert.deepEqual(NO_TRADE_ONE.map((r) => r.id), ['pvc-eb']);
    assert.equal(SIZE_EXAMPLE.pvc40.smallest?.trade.trade, '3/4');
  });

  it('the page is live: route, dates, gates, footer, methodology; the withdrawal is gone', () => {
    assert.ok(ROUTES.some((r) => r.path === ROUTE));
    assert.equal((PAGE_DATES as Record<string, { published: string }>)[ROUTE].published, '2026-11-17');
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE));
    assert.ok(gates.necRefs.enforce.includes(ROUTE));
    assert.ok(read('../src/components/layout/Footer.tsx').includes(ROUTE));
    const page = read('../src/app/calculators/conduit-fill-calculator/page.tsx');
    assert.ok(!page.includes('WithdrawnTool'));
    assert.ok(!read('../research/wsz002-withdrawals.csv').includes(ROUTE));
    const method = read('../src/app/methodology/page.tsx');
    assert.match(method, /domain="nec-ch9-fill"/);
    assert.ok(read('../src/lib/methodology.ts').includes("id: 'conduit-fill-method'"));
    assert.ok(!method.includes('Conduit fill: how many conductors fit in a conduit'));
  });
});
