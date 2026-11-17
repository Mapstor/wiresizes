// The conduit fill calculator (WSZ-039): NEC 2023 Informative Annex C, Tables C.1 to C.13(A), which apply Chapter 9
// Table 1 (53 % of the cross section for one conductor, 31 % for two, 40 % for more), Table 4 and Table 5 (Table 5A for
// compact stranding) with Note 7's rounding. Conductors all of one size and type: the most that fit in a trade size,
// or the smallest trade size that holds a number of them. Every count is the annex's own; nothing is computed from
// areas, because Table 4 (other than IMC) and Table 5 are not verified (conductors of different sizes are not
// covered). Pure; no estimates.
import type { TextPart } from './format';
import { formatValue, partsText } from './format';
import { formatSize } from '../verified/awg';
import { CONDUIT_FILL_DOMAIN, FILL_NOTES, FILL_PERCENT, TRADE_SIZES, annexCRows, conductorType, raceway, racewayTradeIndexes } from '../verified/nec-annex-c';
import type { Raceway, TradeSize } from '../verified/nec-annex-c';

export const ENGINE_ID = 'conduit-fill';
export const DOMAINS = [CONDUIT_FILL_DOMAIN];
export const CONDUIT_FILL_CALC = `calc:${ENGINE_ID}`;
const SRC = CONDUIT_FILL_DOMAIN;

/** Input limit for "how many conductors": no Annex C cell is above 2,000 (the largest is 1,290 of 14 AWG in 6 EMT). */
export const FILL_LIMITS = { conductors: 2000 } as const;

export type FillMode = 'count' | 'size';

export interface ConduitFillInput {
  raceway: string;
  type: string;
  compact: boolean;
  size: string;
  mode: FillMode;
  /** count mode: the trade size, an index into TRADE_SIZES. */
  tradeIndex?: number;
  /** size mode: the number of conductors to pull, ground wires of the same size included. */
  conductors?: number;
}

export interface FillCell {
  tradeIndex: number;
  trade: TradeSize;
  /** The most conductors Annex C lists for this trade size (0: not even one). */
  max: number;
}

export interface ConduitFillResult {
  raceway: Raceway;
  /** The Annex C table read: "C.1" or "C.1(A)". */
  table: string;
  typeLabel: string;
  compact: boolean;
  size: string;
  mode: FillMode;
  /** Every trade size the raceway's table lists, with its count for this conductor. */
  row: FillCell[];
  /** count mode: the chosen trade size's cell. */
  cell: FillCell | null;
  /** size mode: the number asked for, and the smallest trade size whose count reaches it (null: none does). */
  conductors: number | null;
  smallest: FillCell | null;
  stepParts: TextPart[][];
  steps: string[];
}

export type ConduitFillError = 'size-not-listed' | 'trade-not-listed' | 'count-invalid';
export const CONDUIT_FILL_ERROR_MESSAGES: Record<ConduitFillError, string> = {
  'size-not-listed': 'Annex C does not list this size for this conductor type.',
  'trade-not-listed': 'Annex C does not list this trade size for this raceway.',
  'count-invalid': `Enter a whole number of conductors from 1 to ${formatValue(FILL_LIMITS.conductors)}.`,
};

export function isConduitFillError(r: ConduitFillResult | { error: ConduitFillError }): r is { error: ConduitFillError } {
  return 'error' in r;
}

/** The sizes the calculator offers for a type: every size its rows list in this raceway, smallest wire first. */
export function sizesFor(racewayId: string, typeId: string, compact: boolean): string[] {
  return annexCRows(racewayId, typeId, compact).map((r) => r.size);
}

const tradeName = (t: TradeSize) => `trade size ${t.trade} (metric designator ${t.metric})`;

/** A raceway's name inside a sentence: "electrical metallic tubing (EMT)", but "Type A rigid PVC conduit". */
export function racewayInSentence(name: string): string {
  return name.startsWith('Type ') ? name : name.charAt(0).toLowerCase() + name.slice(1);
}

export function conduitFill(input: ConduitFillInput): ConduitFillResult | { error: ConduitFillError } {
  const r = raceway(input.raceway);
  const t = conductorType(input.type);
  const compact = input.compact && t.compactGroup !== null;
  const rows = annexCRows(r.id, t.id, compact);
  const found = rows.find((x) => x.size === input.size);
  if (!found) return { error: 'size-not-listed' };
  const listed = racewayTradeIndexes(r.id);
  const row: FillCell[] = listed
    .filter((k) => found.counts[k] !== null)
    .map((k) => ({ tradeIndex: k, trade: TRADE_SIZES[k], max: found.counts[k] as number }));
  const table = compact ? r.compactTable : r.table;
  const typeLabel = compact ? `compact ${t.compactLabel}` : t.label;
  const size = { size: input.size };

  const stepParts: TextPart[][] = [
    [
      `NEC Informative Annex C, Table ${table}, ${racewayInSentence(r.name)}: the most ${typeLabel} conductors of `,
      size,
      ` that fit in each trade size, all of one size. It applies Chapter 9 Table 1 (`,
      { v: FILL_PERCENT.one, unit: '%', src: SRC },
      ' of the cross section for one conductor, ',
      { v: FILL_PERCENT.two, unit: '%', src: SRC },
      ' for two, ',
      { v: FILL_PERCENT.overTwo, unit: '%', src: SRC },
      ` for more), Table 4 and Table ${compact ? '5A' : '5'}, and rounds a count up when its decimal is `,
      { n: FILL_NOTES.roundUpDecimal, src: SRC },
      ' or more (Note 7).',
    ],
  ];

  let cell: FillCell | null = null;
  let conductors: number | null = null;
  let smallest: FillCell | null = null;
  if (input.mode === 'count') {
    const k = input.tradeIndex ?? -1;
    cell = row.find((c) => c.tradeIndex === k) ?? null;
    if (!cell) return { error: 'trade-not-listed' };
    stepParts.push([
      `In ${tradeName(cell.trade)}: `,
      { n: cell.max, src: SRC },
      cell.max === 1 ? ' conductor.' : ' conductors.',
    ]);
  } else {
    const n = input.conductors ?? NaN;
    if (!Number.isInteger(n) || n < 1 || n > FILL_LIMITS.conductors) return { error: 'count-invalid' };
    conductors = n;
    smallest = row.find((c) => c.max >= n) ?? null;
    const largest = row[row.length - 1];
    stepParts.push(
      smallest
        ? [
            'The smallest trade size whose count reaches ',
            { n, src: 'input' },
            `: ${tradeName(smallest.trade)}, which holds `,
            { n: smallest.max, src: SRC },
            '.',
          ]
        : [
            'No trade size holds ',
            { n, src: 'input' },
            `: the largest the table lists, ${tradeName(largest.trade)}, holds `,
            { n: largest.max, src: SRC },
            '. Use two raceways, or a larger conductor and fewer of them.',
          ],
    );
  }
  stepParts.push([
    'Ground wires of the same size count among the conductors (Chapter 9, Note 3 to the tables). Conductors of different sizes need the areas of Tables 4 and 5, which this calculator does not apply.',
  ]);
  return {
    raceway: r,
    table,
    typeLabel,
    compact,
    size: input.size,
    mode: input.mode,
    row,
    cell,
    conductors,
    smallest,
    stepParts,
    steps: stepParts.map((p) => partsText(p, formatSize)),
  };
}

/** One count, for the page's tables: throws when Annex C does not list the cell. */
export function annexCCount(racewayId: string, typeId: string, size: string, trade: string, compact = false): number {
  const k = TRADE_SIZES.findIndex((t) => t.trade === trade);
  const row = annexCRows(racewayId, typeId, compact).find((x) => x.size === size);
  const v = row && k >= 0 ? row.counts[k] : null;
  if (v === null || v === undefined) throw new Error(`Annex C lists no ${racewayId} ${typeId} ${size} in trade size ${trade}`);
  return v;
}
