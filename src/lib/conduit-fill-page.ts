// Page values for /calculators/conduit-fill-calculator (WSZ-039): every count comes from Annex C through the engine
// (src/lib/calculations/conduit-fill.ts); nothing is typed by hand. The page renders these, so a changed data file
// changes the page or fails the build.
import { annexCCount, conduitFill, isConduitFillError, sizesFor } from './calculations/conduit-fill';
import type { ConduitFillResult } from './calculations/conduit-fill';
import { RACEWAYS, TRADE_SIZES, racewayTradeIndexes } from './verified/nec-annex-c';

function run(input: Parameters<typeof conduitFill>[0]): ConduitFillResult {
  const r = conduitFill(input);
  if (isConduitFillError(r)) throw new Error(`conduit fill page: ${JSON.stringify(input)} gave ${r.error}`);
  return r;
}

/** The answer block: THHN in EMT, 14 to 10 AWG, trade sizes 1/2 to 1. */
export const ANSWER_TRADES = ['1/2', '3/4', '1'] as const;
export const ANSWER = (['14', '12', '10'] as const).map((size) => ({
  size,
  counts: ANSWER_TRADES.map((trade) => ({ trade, n: annexCCount('emt', 'thhn', size, trade) })),
}));

/** The quick tables: THHN in EMT and in Schedule 40 PVC, 14 AWG to 4/0, trade sizes 1/2 to 2. */
export const QUICK_TRADES = ['1/2', '3/4', '1', '1-1/4', '1-1/2', '2'] as const;
export const QUICK_SIZES = ['14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0'] as const;
export const QUICK = (['emt', 'pvc-40'] as const).map((id) => ({
  raceway: RACEWAYS.find((r) => r.id === id) as (typeof RACEWAYS)[number],
  rows: QUICK_SIZES.map((size) => ({ size, counts: QUICK_TRADES.map((trade) => annexCCount(id, 'thhn', size, trade)) })),
}));

/** The comparison chart: 12 AWG THHN in trade size 1 of every raceway whose table lists trade size 1. */
const ONE = TRADE_SIZES.findIndex((t) => t.trade === '1');
export const COMPARE_SIZE = '12';
export const COMPARE_TRADE = '1';
export const COMPARE = RACEWAYS.filter((r) => racewayTradeIndexes(r.id).includes(ONE))
  .map((r) => ({ id: r.id, name: r.name, n: annexCCount(r.id, 'thhn', COMPARE_SIZE, COMPARE_TRADE) }))
  .sort((a, b) => b.n - a.n);
if (COMPARE.length < 10) throw new Error('conduit fill page: fewer raceways list trade size 1 than expected');
/** Raceways whose tables do not list trade size 1 (Type EB PVC). */
export const NO_TRADE_ONE = RACEWAYS.filter((r) => !racewayTradeIndexes(r.id).includes(ONE));

/** What size conduit for four 6 AWG THHN (three hots and a ground of the same size) in EMT and in Schedule 40 PVC. */
export const SIZE_EXAMPLE = {
  size: '6',
  conductors: 4,
  emt: run({ raceway: 'emt', type: 'thhn', compact: false, size: '6', mode: 'size', conductors: 4 }),
  pvc40: run({ raceway: 'pvc-40', type: 'thhn', compact: false, size: '6', mode: 'size', conductors: 4 }),
};
if (!SIZE_EXAMPLE.emt.smallest || !SIZE_EXAMPLE.pvc40.smallest) throw new Error('conduit fill page: the size example found no trade size');

/** Compact stranding: 4/0 XHHW in trade size 2 EMT, concentric (Table C.1) and compact (Table C.1(A)). */
export const COMPACT_EXAMPLE = {
  size: '4/0',
  trade: '2',
  regular: annexCCount('emt', 'xhhw', '4/0', '2'),
  compact: annexCCount('emt', 'xhhw', '4/0', '2', true),
};
if (!(COMPACT_EXAMPLE.compact > COMPACT_EXAMPLE.regular)) throw new Error('conduit fill page: compact 4/0 XHHW no longer fits more than concentric');

/** The calculator's default: twelve-gauge THHN in 3/4 EMT. */
export const DEFAULT_EXAMPLE = run({ raceway: 'emt', type: 'thhn', compact: false, size: '12', mode: 'count', tradeIndex: TRADE_SIZES.findIndex((t) => t.trade === '3/4') });

/** The first question: 12 AWG in trade size 3/4 EMT, three insulation types. */
export const FAQ_12_34 = {
  thhn: annexCCount('emt', 'thhn', '12', '3/4'),
  thw: annexCCount('emt', 'thw', '12', '3/4'),
  xhhw: annexCCount('emt', 'xhhw', '12', '3/4'),
};
/** The second: 10 AWG THHN in trade size 1/2 EMT. */
export const FAQ_10_12 = annexCCount('emt', 'thhn', '10', '1/2');

/** Compact THHN's smallest size in the (A) tables (8 AWG prints as dashes). */
export const COMPACT_THHN_FIRST = sizesFor('emt', 'thhn', true)[0];
/** The (A) tables' smallest size (XHHW and THW). */
export const COMPACT_FIRST = sizesFor('emt', 'xhhw', true)[0];
if (sizesFor('emt', 'thw', true)[0] !== COMPACT_FIRST) throw new Error('conduit fill page: the compact tables start at different sizes');
