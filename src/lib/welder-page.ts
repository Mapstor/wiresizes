// The welder page's numbers (WSZ-011f), from the engine and src/lib/verified: the four presets' wire at 60 °C and 75 °C
// on a short run, the lengths at which each size drops 3 % at the Millermatic 211 PRO's I1max, and the questions'
// examples.
import type { SizeKey } from './verified/awg';
import { TERMINATION_RULES } from './verified/nec-110-14c';
import { WELDER_PRESETS, manualOcpd, welder } from './verified/mfr-welders';
import type { Welder } from './verified/mfr-welders';
import { RESISTANCE_TEMP_C, lengthForDrop } from './calculations/voltage-drop';
import { WD_VOLTS, welderCircuit } from './calculations/welder';
import type { WelderRun } from './calculations/welder';

export const WD_LOW = TERMINATION_RULES.columnAtOrBelowLimit;
export const WD_HIGH = TERMINATION_RULES.columnAboveLimit;
/** The drop target of the length table, the chart and the long-run question, percent. */
export const WD_DROP_PCT = 3;
/** A short run, ft: the table's wire is set by 630.12(B), not by the drop. */
export const SHORT_RUN_FT = 25;

export function run(w: Welder, termination: 'unknown' | '75', lengthFt: number, ocpdA = manualOcpd(w)): WelderRun {
  const r = welderCircuit({ i1maxA: w.i1maxA as number, minSize: w.minConductor, ocpdA, wiringMethod: 'conductors', termination, lengthFt, vdTargetPct: WD_DROP_PCT });
  if ('error' in r) throw new Error(`welder page: ${w.model}: ${r.error}`);
  return r;
}

export interface PresetRow {
  welder: Welder;
  ocpdA: number;
  cu60: WelderRun;
  cu75: WelderRun;
}
export const PRESET_ROWS: PresetRow[] = WELDER_PRESETS.map((w) => {
  const row = { welder: w, ocpdA: manualOcpd(w), cu60: run(w, 'unknown', SHORT_RUN_FT), cu75: run(w, '75', SHORT_RUN_FT) };
  if (row.cu60.columnC !== WD_LOW || row.cu75.columnC !== WD_HIGH) throw new Error('welder page: terminal columns changed');
  if (row.cu60.size !== row.cu60.firstSize || row.cu75.size !== row.cu75.firstSize) throw new Error(`welder page: ${w.model} short run moved for the drop`);
  return row;
});

/** The page's main example: Miller's Millermatic 211 PRO. */
export const EXAMPLE_WELDER = welder('millermatic-211-pro');
export const EXAMPLE_FT = 50;
export const EXAMPLE = run(EXAMPLE_WELDER, 'unknown', EXAMPLE_FT);
export const EXAMPLE_75 = run(EXAMPLE_WELDER, '75', SHORT_RUN_FT);
if (EXAMPLE.size === EXAMPLE_WELDER.minConductor || EXAMPLE.tooSmall.length !== 1) throw new Error('welder page: the example no longer shows 630.12(B) moving the wire');
if (EXAMPLE_75.size !== EXAMPLE_WELDER.minConductor) throw new Error('welder page: at 75 °C the example no longer stays at the manual minimum');
if (EXAMPLE.overSmallLimitA === null || EXAMPLE.size !== EXAMPLE.firstSize) throw new Error('welder page: the example changed');

/** One-way length, ft, at which the example's I1max drops WD_DROP_PCT on copper at 75 °C. */
export function dropFt(size: SizeKey, amps = EXAMPLE_WELDER.i1maxA as number): number {
  const ft = lengthForDrop({ size, material: 'Cu', amps, volts: WD_VOLTS, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C }, WD_DROP_PCT);
  if (ft === null) throw new Error(`welder page: no drop length for ${size}`);
  return ft;
}
export const DROP_SIZES: SizeKey[] = ['14', '12', '10', '8'];
export const DROP_ROWS = DROP_SIZES.map((size) => ({ size, ft: dropFt(size) }));

/** The question's 100 ft run for the example. */
export const LONG_RUN_FT = 100;
export const LONG_RUN = run(EXAMPLE_WELDER, 'unknown', LONG_RUN_FT);
if (LONG_RUN.size === LONG_RUN.firstSize) throw new Error('welder page: the long-run question no longer steps up');

/** The 50 A breaker question for the example, at both columns. */
export const FIFTY_A = 50;
export const FIFTY_60 = run(EXAMPLE_WELDER, 'unknown', SHORT_RUN_FT, FIFTY_A);
export const FIFTY_75 = run(EXAMPLE_WELDER, '75', SHORT_RUN_FT, FIFTY_A);
if (FIFTY_60.firstSize === FIFTY_75.firstSize) throw new Error('welder page: the 50 A question no longer differs by column');
