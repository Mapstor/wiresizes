// The hot tub page's numbers (WSZ-011d), from the engines and src/lib/verified: the copper wire for each breaker in both
// terminal columns with its ground wire, the lengths at which each size reaches a 3 % drop on a 50 A circuit, and the
// long-run question.
import type { SizeKey } from './verified/awg';
import { columnKey, table31016 } from './verified/nec-310-16';
import { TERMINATION_RULES } from './verified/nec-110-14c';
import { minimumConductor } from './calculations/conductor-sizing';
import { egcFor, isEgcError } from './calculations/grounding';
import { RESISTANCE_TEMP_C, lengthForDrop } from './calculations/voltage-drop';
import { HT_BREAKERS, hotTub } from './calculations/hot-tub';
import type { HotTubRun } from './calculations/hot-tub';

export const HT_LOW = TERMINATION_RULES.columnAtOrBelowLimit;
export const HT_HIGH = TERMINATION_RULES.columnAboveLimit;
/** The drop target of the length table and the long-run question, percent (Hot Spring's own figure for long runs). */
export const HT_DROP_PCT = 3;
/** The breaker most hot tub makers ask for, A. */
export const HT_MAIN_A = 50;

interface Pick {
  size: SizeKey;
  ampacity: number;
}
function pick(ratingA: number, column: number): Pick {
  const m = minimumConductor({ ocpdA: ratingA, material: 'Cu', wiringMethod: 'conductors', termination: column === HT_LOW ? '60' : '75' });
  if (!m || m.columnC !== column) throw new Error(`hot tub page: no copper size for ${ratingA} A at ${column} °C`);
  const ampacity = table31016(m.size, columnKey('Cu', column as 60 | 75));
  if (ampacity === null) throw new Error(`hot tub page: no ampacity for ${m.size}`);
  return { size: m.size, ampacity };
}
function egc(ratingA: number): SizeKey {
  const r = egcFor(ratingA, 'Cu');
  if (isEgcError(r)) throw new Error(`hot tub page: no Table 250.122 row for ${ratingA} A`);
  return r.tableEgc;
}

export interface BreakerRow {
  volts: 240 | 120;
  breakerA: number;
  cu60: Pick;
  cu75: Pick;
  egc: SizeKey;
}
export const BREAKER_ROWS: BreakerRow[] = ([240, 120] as const).flatMap((volts) =>
  HT_BREAKERS[volts].map((breakerA) => ({ volts, breakerA, cu60: pick(breakerA, HT_LOW), cu75: pick(breakerA, HT_HIGH), egc: egc(breakerA) })),
);
export function breakerRow(volts: 240 | 120, breakerA: number): BreakerRow {
  const r = BREAKER_ROWS.find((x) => x.volts === volts && x.breakerA === breakerA);
  if (!r) throw new Error(`hot tub page: no row for ${breakerA} A at ${volts} V`);
  return r;
}

/** One-way length, ft, at which a 50 A, 240 V circuit drops HT_DROP_PCT on copper at 75 °C. */
export function dropFt(size: SizeKey, amps = HT_MAIN_A, volts: 240 | 120 = 240): number {
  const ft = lengthForDrop({ size, material: 'Cu', amps, volts, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C }, HT_DROP_PCT);
  if (ft === null) throw new Error(`hot tub page: no drop length for ${size}`);
  return ft;
}
export const DROP_SIZES: SizeKey[] = ['8', '6', '4', '3', '2', '1'];
export const DROP_ROWS = DROP_SIZES.map((size) => ({ size, ft: dropFt(size) }));

function run(lengthFt: number): HotTubRun {
  const r = hotTub({ volts: 240, breakerA: HT_MAIN_A, wiringMethod: 'conductors', termination: 'unknown', lengthFt, vdTargetPct: HT_DROP_PCT });
  if ('error' in r) throw new Error(`hot tub page: ${r.error}`);
  return r;
}
/** The question's 200 ft run to a 50 A hot tub, 3 % target. */
export const LONG_RUN_FT = 200;
export const LONG_RUN = run(LONG_RUN_FT);
if (LONG_RUN.feeder.size === LONG_RUN.feeder.minSizeByAmpacity) throw new Error('hot tub page: the long-run question no longer steps up');
/** The long run's drop on the first size, before the calculator moves it up, percent. */
export const LONG_RUN_FIRST_DROP = (HT_DROP_PCT * LONG_RUN_FT) / dropFt(LONG_RUN.feeder.minSizeByAmpacity);
