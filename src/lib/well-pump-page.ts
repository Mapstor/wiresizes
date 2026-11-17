// Page values for /calculators/well-pump-calculator (WSZ-011c), all from Franklin's AIM tables
// (src/lib/verified/mfr-well-pump.ts) or the well pump engine (src/lib/calculations/well-pump.ts).
import { wellPump } from './calculations/well-pump';
import type { WellPumpRun } from './calculations/well-pump';
import { CABLE_ROWS, CABLE_SIZES, cableRow, fuseRow, motorRow } from './verified/mfr-well-pump';
import type { PumpHp } from './verified/mfr-well-pump';
import type { SizeKey } from './verified/awg';

function run(input: Parameters<typeof wellPump>[0]): WellPumpRun {
  const r = wellPump(input);
  if ('error' in r) throw new Error(`well-pump page: ${r.error}`);
  return r;
}

/** The lead's example: a 1 hp, 230 V 2-wire pump with 300 ft of jacketed cable. */
export const LEAD_FT = 300;
export const LEAD = run({ volts: 230, wires: 2, hp: '1', lengthFt: LEAD_FT, dropPct: 5, cable: 'jacketed' });

/** Lengths at a 5 % drop for one 230 V motor, sizes 14 to 8 AWG (the sizes most pumps use). */
export function lengthsFor(hp: PumpHp): { size: SizeKey; ft: number | null; shaded: boolean }[] {
  const row = cableRow(230, hp);
  if (!row) throw new Error(`well-pump page: no 230 V ${hp} hp row`);
  return CABLE_SIZES.slice(0, 4).map((size, i) => ({ size, ft: row.ft[i], shaded: row.shaded.includes(size) }));
}

/** The cable table as the page shows it: 230 V rows, then the 115 V row, sizes 14 AWG to 1/0. */
export const TABLE_SIZES: SizeKey[] = CABLE_SIZES.slice(0, 10);
export const TABLE_ROWS = [...CABLE_ROWS.filter((r) => r.volts === 230), ...CABLE_ROWS.filter((r) => r.volts === 115)];

/** 10 AWG copper, the chart's size: maximum length per 230 V motor at a 5 % drop. */
export const CHART_SIZE: SizeKey = '10';
export const CHART_ROWS = CABLE_ROWS.filter((r) => r.volts === 230).map((r) => {
  const ft = r.ft[CABLE_SIZES.indexOf(CHART_SIZE)];
  if (typeof ft !== 'number' || ft <= 0) throw new Error(`well-pump page: no 10 AWG length for ${r.hp} hp`);
  return { hp: r.hp, ft };
});

/** Franklin's own two-size example (cable combinations, pdf p. 52): 3 hp, 230 V; 160 ft of 10 AWG, then 310 ft down the well. */
export const COMBO = (() => {
  const row = cableRow(230, '3');
  if (!row) throw new Error('well-pump page: no 230 V 3 hp row');
  const at = (s: SizeKey) => row.ft[CABLE_SIZES.indexOf(s)] as number;
  const first = { size: '10', ft: 160, max: at('10') };
  const tryA = { size: '8', ft: 310, max: at('8') };
  const tryB = { size: '6', ft: 310, max: at('6') };
  const share = (x: { ft: number; max: number }) => x.ft / x.max;
  return { first, tryA, tryB, sumA: share(first) + share(tryA), sumB: share(first) + share(tryB), shareFirst: share(first), shareA: share(tryA), shareB: share(tryB) };
})();
if (!(COMBO.sumA > 1 && COMBO.sumB <= 1)) throw new Error("well-pump page: Franklin's combination example no longer holds");

/** The FAQ's long run: a 2 hp, 230 V pump 300 ft away. */
export const FAQ_2HP_FT = 300;
export const FAQ_2HP = run({ volts: 230, wires: 3, hp: '2', lengthFt: FAQ_2HP_FT, dropPct: 5, cable: 'jacketed' });

const f15 = fuseRow(3, 230, '1.5');
const m1 = motorRow(2, 230, '1');
if (!f15 || !m1) throw new Error('well-pump page: Franklin rows missing');
/** The FAQ's breaker (1.5 hp, 230 V) and amps (1 hp, 230 V) rows. */
export const F_15 = f15;
export const M_1 = m1;
