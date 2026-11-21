// The amp-rating guides' figures (WSZ-041): for one breaker rating, the copper and aluminum sizes the wire size engine
// gives in NM cable (334.80 holds it at 60 °C), with single conductors at 60 °C terminals, and with every termination
// listed and identified for 75 °C conductors (110.14(C)); the 240.4(B) size below where it applies; the Table 250.122
// ground wire; the one-way lengths at which the full rating drops the 215.2(A) note's 3 %; and the Table 310.16
// ampacities around the answer. Each guide's own facts (the 50 A guide's outlets, loads and runs) sit beside its core.
// Nothing is typed in but the ratings and the run lengths a page asks about.
import type { Material, SizeKey } from './verified/awg';
import { AMPACITY_COLUMNS, TABLE_310_16_ROWS, COLUMN_TYPES, columnKey, table31016 } from './verified/nec-310-16';
import type { AmpacityColumn } from './verified/nec-310-16';
import { TERMINATION_RULES } from './verified/nec-110-14c';
import { VOLTAGE_DROP_NOTE } from './verified/nec-continuous-load-2023';
import { DISCONNECT_MIN_A, NM_CABLE } from './verified/nec-separate-buildings';
import { max240_4D } from './verified/nec-240-4-d';
import { nemaConfig } from './verified/nema-receptacle-configs';
import type { NemaConfig } from './verified/nema-receptacle-configs';
import { SPA_MAKERS } from './verified/mfr-spas';
import { WHIRLPOOL_RANGE } from './verified/mfr-equipment';
import { welder } from './verified/mfr-welders';
import { EV_OCPD_PERCENT } from './verified/nec-625';
import { TABLE_310_12_ROWS } from './verified/nec-310-12';
import { STANDARD_RATINGS, minimumConductor } from './calculations/conductor-sizing';
import type { Termination, WiringMethod } from './calculations/conductor-sizing';
import { egcFor, isEgcError } from './calculations/grounding';
import { RESISTANCE_TEMP_C, dropRun, lengthForDrop, voltageDropSizes } from './calculations/voltage-drop';
import type { DropRun } from './calculations/voltage-drop';
import { buildQuery } from './calculations/fields';
import { EV_ROWS } from './ev-guide';
import type { LadderRow } from './subpanel-guide';

/** The amp guides run single-phase at 240 V, the voltage of the circuits they size. */
export const AMP_VOLTS = 240;

export interface AmpPick {
  size: SizeKey;
  /** Its Table 310.16 ampacity in the column the rule sets, A. */
  ampacity: number;
  /** The Table 250.122 ground wire, held at the circuit wire by 250.122(A). */
  egc: SizeKey;
  /** 240.4(B): the next smaller size a rating may protect when its ampacity is not a standard rating; else null. */
  below: { size: SizeKey; ampacity: number } | null;
}

/** The engine's size for a rating in one material, termination and wiring method. */
export function pick(ratingA: number, material: Material, termination: Termination, wiringMethod: WiringMethod): AmpPick {
  const m = minimumConductor({ ocpdA: ratingA, material, termination, wiringMethod });
  if (!m || m.egc === null) throw new Error(`amp guide: no ${material} size for ${ratingA} A`);
  const ampacity = table31016(m.size, columnKey(material, m.columnC));
  if (ampacity === null) throw new Error(`amp guide: ${m.size} ${material} has no ${m.columnC} °C ampacity`);
  return { size: m.size, ampacity, egc: m.egc, below: m.below };
}

/** Table 310.16 at the two columns, from one size below `from` to one size above `to`. */
export function ladder(material: Material, from: SizeKey, to: SizeKey, low: AmpacityColumn, high: AmpacityColumn): LadderRow[] {
  const sizes = TABLE_310_16_ROWS.filter((r) => r[columnKey(material, low)] !== null).map((r) => r.size);
  // one size either side, or from the column's first size when `from` is already the smallest
  const i = Math.max(0, sizes.indexOf(from) - 1);
  const j = sizes.indexOf(to) + 1;
  if (sizes.indexOf(from) < 0 || j >= sizes.length) throw new Error('amp guide: the ladder runs off Table 310.16');
  return sizes.slice(i, j + 1).map((size) => {
    const a60 = table31016(size, columnKey(material, low));
    const a75 = table31016(size, columnKey(material, high));
    if (a60 === null || a75 === null) throw new Error(`amp guide: ${size} has no 60 or 75 °C ampacity`);
    return { size, a60, a75 };
  });
}

/** The full rating over a one-way run, single-phase at AMP_VOLTS (or `volts`), conductors at the engine's 75 °C. */
export function ampDrop(size: SizeKey, material: Material, amps: number, lengthFt: number, volts: number = AMP_VOLTS): DropRun {
  const r = dropRun({ size, material, amps, lengthFt, volts, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C });
  if (!r) throw new Error(`amp guide: no drop for ${size} ${material}`);
  return r;
}

/** The one-way length at which the full rating reaches the 215.2(A) note's 3 %, single-phase at AMP_VOLTS (or `volts`), ft. */
export function noteFt(size: SizeKey, material: Material, amps: number, volts: number = AMP_VOLTS): number {
  const ft = lengthForDrop({ size, material, amps, volts, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C }, VOLTAGE_DROP_NOTE.feederPct);
  if (ft === null) throw new Error(`amp guide: no note length for ${size} ${material}`);
  return ft;
}

export interface AmpGuide {
  ratingA: number;
  /** 110.14(C)(1)(a)'s column for circuits of its rating or less, and the 75 °C column, °C. */
  low: AmpacityColumn;
  high: AmpacityColumn;
  /** NM cable: 334.80 holds it at the 60 °C column whatever its terminations. */
  nm: { cu: AmpPick; al: AmpPick };
  /** Single conductors where every termination is listed and identified for 75 °C conductors. */
  c75: { cu: AmpPick; al: AmpPick };
  /** Table 250.122 as printed for the rating: its row and the copper and aluminum sizes. */
  egc: { rowA: number; cu: SizeKey; al: SizeKey };
  /** Table 310.16 at 60 and 75 °C, from one size below the 75 °C pick to one above the 60 °C pick. */
  ladder: { cu: LadderRow[]; al: LadderRow[] };
}

export function ampGuide(ratingA: number): AmpGuide {
  if (ratingA > TERMINATION_RULES.limitA) throw new Error('amp guide: the rating is above the 110.14(C)(1)(a) split');
  const low = TERMINATION_RULES.columnAtOrBelowLimit as AmpacityColumn;
  const high = TERMINATION_RULES.columnAboveLimit as AmpacityColumn;
  if (NM_CABLE.maxColumnC !== low) throw new Error('amp guide: 334.80 no longer holds NM cable to the 110.14(C)(1)(a) column');
  const nm = { cu: pick(ratingA, 'Cu', 'unknown', 'cable'), al: pick(ratingA, 'Al', 'unknown', 'cable') };
  const c60 = { cu: pick(ratingA, 'Cu', '60', 'conductors'), al: pick(ratingA, 'Al', '60', 'conductors') };
  if (c60.cu.size !== nm.cu.size || c60.al.size !== nm.al.size) throw new Error('amp guide: 60 °C conductors and NM cable no longer agree');
  const c75 = { cu: pick(ratingA, 'Cu', '75', 'conductors'), al: pick(ratingA, 'Al', '75', 'conductors') };
  const r = egcFor(ratingA, 'Cu');
  if (isEgcError(r)) throw new Error(`amp guide: no Table 250.122 row for ${ratingA} A`);
  return {
    ratingA,
    low,
    high,
    nm,
    c75,
    egc: { rowA: r.rowA, cu: r.table.cu, al: r.table.alCca },
    ladder: { cu: ladder('Cu', c75.cu.size, nm.cu.size, low, high), al: ladder('Al', c75.al.size, nm.al.size, low, high) },
  };
}

/** The wire size calculator opened on a rating, single-phase at AMP_VOLTS; options as the calculator names them. */
export function wireSizeLink(ratingA: number, options: { material?: 'al'; method?: 'c'; terminals?: '75'; length?: number } = {}): string {
  return `/calculators/wire-size-calculator?${buildQuery({ rating: ratingA, phase: 'single', voltage: AMP_VOLTS, ...options })}`;
}

// ── /guides/wire-size-for-50-amp ─────────────────────────────────────────────────────────────────────────────────────

/** The searched run, ft. */
export const RUN_50_FT = 100;
/** The drop chart's axis, ft. */
export const DROP_50_MAX_FT = 300;
export const DROP_50_LENGTHS = [0, 50, 100, 150, 200, 250, 300];

function outlet(config: string): NemaConfig {
  const c = nemaConfig(config);
  if (c.amps !== 50) throw new Error(`50 A guide: ${config} is not a 50 A receptacle`);
  return c;
}

export const GUIDE_50 = (() => {
  const g = ampGuide(50);
  const { nm, c75 } = g;
  // the page says 240.4(B) does not apply at 50 A: the 75 °C copper size's 60 °C ampacity is itself a standard rating
  if (nm.cu.below || nm.al.below || c75.cu.below || c75.al.below) throw new Error('50 A guide: 240.4(B) now applies');
  const short = table31016(c75.cu.size, columnKey('Cu', g.low));
  if (short === null || short >= g.ratingA || !STANDARD_RATINGS.includes(short)) throw new Error('50 A guide: the 8 AWG paragraph no longer fits');
  const thhnC = AMPACITY_COLUMNS.find((c) => COLUMN_TYPES[c].includes('THHN'));
  if (thhnC === undefined || thhnC <= g.high) throw new Error('50 A guide: Table 310.16 no longer lists THHN above 75 °C');
  const thhnA = table31016(c75.cu.size, columnKey('Cu', thhnC));
  if (thhnA === null) throw new Error('50 A guide: no THHN-column ampacity for the 75 °C size');
  // 240.4(D) holds 10 AWG copper below 50 A
  const ten = max240_4D('10', 'Cu');
  if (!ten || ten.conditions !== null || ten.max_ocpd_a >= g.ratingA) throw new Error('50 A guide: the 10 AWG answer no longer fits 240.4(D)');
  const lengthSizes = (material: Material, from: SizeKey) => {
    const sizes = voltageDropSizes(material);
    return sizes.slice(sizes.indexOf(from), sizes.indexOf(from) + 7);
  };
  const lengths = {
    cu: lengthSizes('Cu', c75.cu.size).map((size) => ({ size, ft: noteFt(size, 'Cu', g.ratingA) })),
    al: lengthSizes('Al', c75.al.size).map((size) => ({ size, ft: noteFt(size, 'Al', g.ratingA) })),
  };
  // the outlets: two grounding configurations and the older non-grounding one
  const outlets = { f1450: outlet('14-50R'), f650: outlet('6-50R'), f1050: outlet('10-50R') };
  if (!outlets.f1450.grounding || !outlets.f650.grounding || outlets.f1050.grounding) throw new Error('50 A guide: the outlets changed');
  // the loads, each from its own page's data
  const ev = EV_ROWS.find((r) => r.breakerA === g.ratingA);
  if (!ev) throw new Error('50 A guide: no EV output on a 50 A breaker');
  const spaMakers = [...new Set(SPA_MAKERS.filter((m) => m.volts === AMP_VOLTS && m.breaker_a.includes(g.ratingA)).map((m) => m.maker))];
  if (spaMakers.length < 2) throw new Error('50 A guide: fewer than two hot tub makers list 50 A at 240 V');
  if (WHIRLPOOL_RANGE.receptacle4Wire !== outlets.f1450.config || WHIRLPOOL_RANGE.receptacle3Wire !== outlets.f1050.config) {
    throw new Error("50 A guide: Whirlpool's range receptacles changed");
  }
  if (!WHIRLPOOL_RANGE.rows.some((r) => r.circuitsA.includes(g.ratingA))) throw new Error('50 A guide: no Whirlpool range row allows 50 A');
  const stick = welder('ac-225c');
  if (!stick.receptacle || !stick.receptacle.includes(outlets.f650.config)) throw new Error("50 A guide: the AC-225C's receptacle changed");
  const serviceFromA = TABLE_310_12_ROWS[0].ratingA;
  if (!(serviceFromA > g.ratingA)) throw new Error('50 A guide: Table 310.12 now lists 50 A');
  return {
    ...g,
    /** 8 AWG copper at 60 °C: short of the rating, and itself a standard rating, A. */
    shortAt60: short,
    /** THHN's Table 310.16 column, °C, and the 75 °C copper size's ampacity in it, A. */
    thhn: { c: thhnC, a: thhnA },
    /** 240.4(D): 10 AWG copper's limit, A. */
    tenLimitA: ten.max_ocpd_a,
    lengths,
    /** The searched run on the four picks. */
    run: {
      lengthFt: RUN_50_FT,
      cuNm: ampDrop(nm.cu.size, 'Cu', g.ratingA, RUN_50_FT),
      alNm: ampDrop(nm.al.size, 'Al', g.ratingA, RUN_50_FT),
      cu75: ampDrop(c75.cu.size, 'Cu', g.ratingA, RUN_50_FT),
      al75: ampDrop(c75.al.size, 'Al', g.ratingA, RUN_50_FT),
    },
    noteFt: {
      cuNm: noteFt(nm.cu.size, 'Cu', g.ratingA),
      alNm: noteFt(nm.al.size, 'Al', g.ratingA),
      cu75: noteFt(c75.cu.size, 'Cu', g.ratingA),
      al75: noteFt(c75.al.size, 'Al', g.ratingA),
    },
    outlets,
    ev: { outputA: ev.outputA, breakerA: ev.breakerA, percent: EV_OCPD_PERCENT },
    spaMakers,
    range: { brand: WHIRLPOOL_RANGE.brand },
    stick: { brand: stick.brand, model: stick.model },
    /** Table 310.12's first rating, A. */
    serviceFromA,
    disconnect: { others: DISCONNECT_MIN_A.allOthers, twoCircuits: DISCONNECT_MIN_A.twoCircuits, oneCircuit: DISCONNECT_MIN_A.oneCircuit },
  };
})();
