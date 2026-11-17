// The EV charger guide's figures (WSZ-008e): for each charger output that Tesla's and ChargePoint's tables share, the
// breaker 625.41 and 210.20(A) set (125 % of the output, a standard rating), the smallest copper size in the 60 °C
// column (NM cable, or terminations rated 60 °C) and in the 75 °C column (every termination listed and identified for
// 75 °C conductors), the Table 250.122 ground wire and the one-way length at which the full output drops 3 % (the
// 215.2(A) note's figure). Every value comes from data/verified through the engines; the makers' own tables must give
// the same breaker, or the module throws at import.
import type { SizeKey } from './verified/awg';
import { columnKey, table31016 } from './verified/nec-310-16';
import type { AmpacityColumn } from './verified/nec-310-16';
import { TERMINATION_RULES } from './verified/nec-110-14c';
import { CONTINUOUS_LOAD_PERCENT, VOLTAGE_DROP_NOTE } from './verified/nec-continuous-load-2023';
import { EV_OCPD_PERCENT } from './verified/nec-625';
import { CHARGEPOINT, CHARGEPOINT_TOP, EMPORIA, SHARED_OUTPUTS_A, TESLA, TESLA_MAX_WIRE } from './verified/mfr-evse';
import type { EvMaker } from './verified/mfr-evse';
import { NM_CABLE } from './verified/nec-separate-buildings';
import { isSizingError, ratingForContinuous, sizeConductor } from './calculations/conductor-sizing';
import type { Termination, WiringMethod } from './calculations/conductor-sizing';
import { egcFor, isEgcError } from './calculations/grounding';
import { RESISTANCE_TEMP_C, dropRun, lengthForDrop } from './calculations/voltage-drop';
import type { DropRun } from './calculations/voltage-drop';
import { buildQuery } from './calculations/fields';

/** The makers' tables give power at 240 V; the drop runs at it too. */
export const EV_VOLTS = 240;

if (EV_OCPD_PERCENT !== CONTINUOUS_LOAD_PERCENT) throw new Error('EV guide: 625.41 and 210.20(A) no longer agree');

export interface EvPick {
  size: SizeKey;
  /** Its ampacity in the column, A. */
  ampacity: number;
}

/** The smallest copper size for a continuous load on the breaker, in one column (no derating). */
function pick(outputA: number, breakerA: number, wiringMethod: WiringMethod, termination: Termination, column: AmpacityColumn): EvPick {
  const r = sizeConductor({ ocpdA: breakerA, material: 'Cu', wiringMethod, termination, loadA: outputA, continuous: true, lengthFt: 0, volts: EV_VOLTS, phase: 'single' });
  if (isSizingError(r)) throw new Error(`EV guide: no size for ${outputA} A on ${breakerA} A (${r.error})`);
  if (r.columnC !== column) throw new Error(`EV guide: ${outputA} A sized in the ${r.columnC} °C column, not ${column} °C`);
  const size = r.nextSizeUp && r.nextSizeUp.maxContinuousA >= outputA ? r.nextSizeUp.size : r.minSizeByAmpacity;
  const ampacity = table31016(size, columnKey('Cu', column));
  if (ampacity === null) throw new Error(`EV guide: ${size} has no ${column} °C ampacity`);
  return { size, ampacity };
}

function egc(breakerA: number): SizeKey {
  const r = egcFor(breakerA, 'Cu');
  if (isEgcError(r)) throw new Error(`EV guide: no Table 250.122 row for ${breakerA} A`);
  return r.tableEgc;
}

/** The full output over a one-way run at EV_VOLTS, single-phase, conductors at the engine's 75 °C. */
export function evDrop(size: SizeKey, outputA: number, lengthFt: number): DropRun {
  const r = dropRun({ size, material: 'Cu', amps: outputA, lengthFt, volts: EV_VOLTS, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C });
  if (!r) throw new Error(`EV guide: no drop for ${size}`);
  return r;
}

/** The one-way length at which the full output drops the 215.2(A) note's feeder figure, ft. */
function noteFt(size: SizeKey, outputA: number): number {
  const ft = lengthForDrop({ size, material: 'Cu', amps: outputA, volts: EV_VOLTS, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C }, VOLTAGE_DROP_NOTE.feederPct);
  if (ft === null) throw new Error(`EV guide: no note length for ${size}`);
  return ft;
}

function breakerFor(outputA: number): number {
  const a = ratingForContinuous(outputA);
  if (a === null) throw new Error(`EV guide: no rating for ${outputA} A`);
  return a;
}

/** The maker's breaker for an output, or null when its table has no such row. */
function makerBreaker(m: EvMaker, outputA: number): number | null {
  return m.circuits.find((c) => c.outputA === outputA)?.breakerA ?? null;
}

export const EV_LOW = TERMINATION_RULES.columnAtOrBelowLimit as AmpacityColumn;
export const EV_HIGH = TERMINATION_RULES.columnAboveLimit as AmpacityColumn;
if (NM_CABLE.maxColumnC !== EV_LOW) throw new Error('EV guide: 334.80 no longer holds NM cable to the 60 °C column');

export interface EvRow {
  outputA: number;
  /** Tesla's printed power at 240 V, kW. */
  kw: number;
  breakerA: number;
  /** NM cable, or any termination rated 60 °C. */
  nm: EvPick;
  /** Single conductors with the breaker and every termination listed and identified for 75 °C conductors. */
  c75: EvPick;
  /** Table 250.122, copper. */
  egc: SizeKey;
  /** ChargePoint allows a plug-in charger on this circuit. */
  plugIn: boolean;
  /** One-way length at which the full output drops the note's 3 %, ft. */
  noteFt: { nm: number; c75: number };
}

export const EV_ROWS: EvRow[] = SHARED_OUTPUTS_A.map((outputA) => {
  const breakerA = breakerFor(outputA);
  for (const m of [TESLA, CHARGEPOINT, EMPORIA]) {
    const b = makerBreaker(m, outputA);
    if (b !== null && b !== breakerA) throw new Error(`EV guide: ${m.maker} puts ${outputA} A on ${b} A, the rule gives ${breakerA} A`);
  }
  const kw = TESLA.circuits.find((c) => c.outputA === outputA)?.kw;
  if (kw === null || kw === undefined) throw new Error(`EV guide: Tesla prints no kW for ${outputA} A`);
  const nm = pick(outputA, breakerA, 'cable', 'unknown', EV_LOW);
  const c75 = pick(outputA, breakerA, 'conductors', '75', EV_HIGH);
  return {
    outputA,
    kw,
    breakerA,
    nm,
    c75,
    egc: egc(breakerA),
    plugIn: CHARGEPOINT.circuits.find((c) => c.outputA === outputA)?.plugIn ?? false,
    noteFt: { nm: noteFt(nm.size, outputA), c75: noteFt(c75.size, outputA) },
  };
});

const byOutput = (a: number) => {
  const r = EV_ROWS.find((x) => x.outputA === a);
  if (!r) throw new Error(`EV guide: no ${a} A row`);
  return r;
};

/** The top shared output (48 A) and the one below it (40 A): the answers the page leads with. */
export const EV_TOP = EV_ROWS[EV_ROWS.length - 1];
export const EV_SECOND = EV_ROWS[EV_ROWS.length - 2];
if (EV_TOP.nm.size !== TESLA_MAX_WIRE.at60 || EV_TOP.c75.size !== TESLA_MAX_WIRE.at75) {
  throw new Error("EV guide: Tesla's 48 A wire no longer matches the table answer");
}
/** The plug-in rows: the outputs ChargePoint allows on a receptacle. */
export const EV_PLUG_IN = EV_ROWS.filter((r) => r.plugIn);
/** Emporia's plug-in: the 14-50 on its 50 A circuit. */
export const EMPORIA_PLUG = (() => {
  const c = EMPORIA.circuits.find((x) => x.plugIn);
  if (!c) throw new Error('EV guide: Emporia lists no plug-in circuit');
  byOutput(c.outputA);
  return c;
})();

/** ChargePoint's 50 A setting on its 70 A circuit: hardwired, above the shared rows. */
export const EV_CP_TOP = (() => {
  const outputA = CHARGEPOINT_TOP.outputA;
  const breakerA = breakerFor(outputA);
  if (breakerA !== CHARGEPOINT_TOP.breakerA) throw new Error('EV guide: ChargePoint 50 A breaker changed');
  const r = sizeConductor({ ocpdA: breakerA, material: 'Cu', wiringMethod: 'conductors', termination: '75', loadA: outputA, continuous: true, lengthFt: 0, volts: EV_VOLTS, phase: 'single' });
  if (isSizingError(r) || !r.nextSizeUp) throw new Error('EV guide: the 50 A case no longer uses 240.4(B)');
  return {
    outputA,
    breakerA,
    /** 125 % of the output, A. */
    neededA: (outputA * CONTINUOUS_LOAD_PERCENT) / 100,
    nm: pick(outputA, breakerA, 'cable', 'unknown', EV_LOW),
    /** 240.4(B): a size whose 75 °C ampacity is not a standard rating, protected at the next one up. */
    c75: { size: r.nextSizeUp.size, ampacity: r.nextSizeUp.ampacity },
    egc: egc(breakerA),
  };
})();

/** The voltage drop chart's axis, ft. */
export const EV_DROP_MAX_FT = 300;

/** The wire size calculator, opened on a row's breaker and continuous load at 240 V single-phase. */
export function wireSizeLink(row: { breakerA: number; outputA: number }): string {
  return `/calculators/wire-size-calculator?${buildQuery({ rating: row.breakerA, load: row.outputA, continuous: 'yes', phase: 'single', voltage: EV_VOLTS })}`;
}
