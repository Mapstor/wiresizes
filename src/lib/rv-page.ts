// The RV hookup page's numbers (WSZ-011b), from the engines and src/lib/verified, so the page, its chart and its tests
// read one set: the wire for each RV outlet in both metals and both terminal columns, the lengths at which each size
// reaches a 3 % drop at the full rating, and the park examples.
import type { Material, SizeKey } from './verified/awg';
import { columnKey, table31016 } from './verified/nec-310-16';
import { TERMINATION_RULES } from './verified/nec-110-14c';
import { minimumConductor } from './calculations/conductor-sizing';
import { egcFor, isEgcError } from './calculations/grounding';
import { RESISTANCE_TEMP_C, lengthForDrop } from './calculations/voltage-drop';
import { RV_OUTLETS, rvOutlet, rvPark } from './calculations/rv-hookup';
import type { RvOutlet, RvOutletRun, RvParkInput, RvParkRun } from './calculations/rv-hookup';

export const RV_LOW = TERMINATION_RULES.columnAtOrBelowLimit;
export const RV_HIGH = TERMINATION_RULES.columnAboveLimit;
/** The drop target the length table uses, percent (the reader's own target in the calculator). */
export const RV_DROP_PCT = 3;

interface Pick {
  size: SizeKey;
  ampacity: number;
}
function pick(ratingA: number, material: Material, column: number): Pick {
  const m = minimumConductor({ ocpdA: ratingA, material, wiringMethod: 'conductors', termination: column === RV_LOW ? '60' : '75' });
  if (!m || m.columnC !== column) throw new Error(`rv page: no ${material} size for ${ratingA} A at ${column} °C`);
  const ampacity = table31016(m.size, columnKey(material, column as 60 | 75));
  if (ampacity === null) throw new Error(`rv page: no ampacity for ${m.size}`);
  return { size: m.size, ampacity };
}
function egc(ratingA: number, material: Material): SizeKey {
  const r = egcFor(ratingA, material);
  if (isEgcError(r)) throw new Error(`rv page: no Table 250.122 row for ${ratingA} A`);
  return r.tableEgc;
}

export interface OutletRow {
  outlet: RvOutlet;
  config: string;
  breakerA: number;
  volts: number;
  cu60: Pick;
  cu75: Pick;
  al60: Pick;
  al75: Pick;
  egcCu: SizeKey;
  egcAl: SizeKey;
}

export const OUTLET_ROWS: OutletRow[] = (Object.keys(RV_OUTLETS) as RvOutlet[]).map((outlet) => {
  const o = RV_OUTLETS[outlet];
  return {
    outlet,
    config: o.config,
    breakerA: o.breakerA,
    volts: o.volts,
    cu60: pick(o.breakerA, 'Cu', RV_LOW),
    cu75: pick(o.breakerA, 'Cu', RV_HIGH),
    al60: pick(o.breakerA, 'Al', RV_LOW),
    al75: pick(o.breakerA, 'Al', RV_HIGH),
    egcCu: egc(o.breakerA, 'Cu'),
    egcAl: egc(o.breakerA, 'Al'),
  };
});

export function outletRow(outlet: RvOutlet): OutletRow {
  const r = OUTLET_ROWS.find((x) => x.outlet === outlet);
  if (!r) throw new Error(`rv page: no row for ${outlet}`);
  return r;
}

/** Copper sizes the length table lists for each outlet: the 60 °C size and the next few up. */
const DROP_SIZES: Record<RvOutlet, SizeKey[]> = { tt30: ['10', '8', '6', '4'], '1450': ['6', '4', '3', '2', '1'] };

/** One-way length, ft, at which the full rating drops RV_DROP_PCT on copper at 75 °C. */
export function dropFt(outlet: RvOutlet, size: SizeKey): number {
  const o = RV_OUTLETS[outlet];
  const ft = lengthForDrop({ size, material: 'Cu', amps: o.breakerA, volts: o.volts, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C }, RV_DROP_PCT);
  if (ft === null) throw new Error(`rv page: no drop length for ${size}`);
  return ft;
}
export const DROP_ROWS = (Object.keys(DROP_SIZES) as RvOutlet[]).map((outlet) => ({
  outlet,
  config: RV_OUTLETS[outlet].config,
  rows: DROP_SIZES[outlet].map((size) => ({ size, ft: dropFt(outlet, size) })),
}));

function outletRun(outlet: RvOutlet, lengthFt: number): RvOutletRun {
  const r = rvOutlet({ outlet, material: 'Cu', wiringMethod: 'conductors', termination: 'unknown', lengthFt, vdTargetPct: RV_DROP_PCT });
  if ('error' in r) throw new Error(`rv page: ${r.error}`);
  return r;
}
/** The question's 175 ft run to a 50 A outlet, copper, 3 % target. */
export const LONG_RUN_FT = 175;
export const LONG_RUN = outletRun('1450', LONG_RUN_FT);

function park(input: RvParkInput): RvParkRun {
  const r = rvPark(input);
  if ('error' in r) throw new Error(`rv page: ${r.error}`);
  return r;
}
/** The calculator's starting park: 30 new sites, 12 with 50 A (the 40 % 551.71(C) asks of new sites) and 18 with 20 A and 30 A. */
export const PARK_DEFAULT: RvParkInput = { sites50: 12, sites30: 18, sites20: 0, newPark: true };
export const PARK_EXAMPLE = park(PARK_DEFAULT);
/** 551.73(B)'s own example as a park: 20 sites with 20 A and 30 A. */
export const NEC_EXAMPLE_PARK = park({ sites50: 0, sites30: 20, sites20: 0, newPark: false });

/** The long run's drop on the first size, before the calculator moves it up: linear in length, percent. */
export const LONG_RUN_FIRST_DROP = (RV_DROP_PCT * LONG_RUN_FT) / dropFt('1450', LONG_RUN.feeder.minSizeByAmpacity);
if (!(LONG_RUN_FIRST_DROP > RV_DROP_PCT) || LONG_RUN.feeder.size === LONG_RUN.feeder.minSizeByAmpacity) throw new Error('rv page: the long-run question no longer steps up');
