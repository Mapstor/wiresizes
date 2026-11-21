// The amp guides after the 50 A one (WSZ-042): 15, 20, 30, 40 and 60 A from ampGuide(), 70, 80 and 90 A on one page,
// and 125 A, where 110.14(C)(1)(b) sets the 75 °C column and Table 310.12 sizes a dwelling service. Each guide carries
// its own facts beside the engine's sizes (the 240.4(D) limits, the receptacles of its rating, the loads other pages
// size, its 240.4(B) cases), and each throws at import when the data no longer says what its page's sentences say.
// Nothing is typed in but ratings, the receptacle names a page shows, and the run lengths a page asks about.
import type { Material, SizeKey } from './verified/awg';
import { TABLE_310_16_SIZES, columnKey, nextLargerSize, table31016 } from './verified/nec-310-16';
import type { AmpacityColumn } from './verified/nec-310-16';
import { ROWS_240_4_D, conditions240_4D, max240_4D } from './verified/nec-240-4-d';
import { nemaConfig } from './verified/nema-receptacle-configs';
import type { NemaConfig } from './verified/nema-receptacle-configs';
import { SPA_MAKERS } from './verified/mfr-spas';
import { FRIGIDAIRE_RANGE, GE_DRYER, WHIRLPOOL_DRYER, WHIRLPOOL_RANGE } from './verified/mfr-equipment';
import { TERMINATION_RULES } from './verified/nec-110-14c';
import { CONTINUOUS_LOAD_PERCENT, VOLTAGE_DROP_NOTE } from './verified/nec-continuous-load-2023';
import { DISCONNECT_MIN_A } from './verified/nec-separate-buildings';
import { TABLE_310_12_ROWS } from './verified/nec-310-12';
import { NEXT_SIZE_UP_MAX_A } from './verified/nec-240-4-d';
import { STANDARD_RATINGS, minimumConductor } from './calculations/conductor-sizing';
import { egcFor, isEgcError } from './calculations/grounding';
import { minimumServiceAmpacity, serviceLookup } from './calculations/service-lookup';
import { voltageDropSizes } from './calculations/voltage-drop';
import type { DropRun } from './calculations/voltage-drop';
import { RV_OUTLETS } from './calculations/rv-hookup';
import { EV_CP_TOP, EV_ROWS } from './ev-guide';
import { AMP_VOLTS, ampDrop, ampGuide, ladder, noteFt, pick } from './amp-guide';
import type { AmpGuide, AmpPick } from './amp-guide';

/** The voltage of a 120 V circuit, for the guides whose ratings run at either voltage. */
export const LOW_VOLTS = 120;

export interface LengthRow {
  size: SizeKey;
  /** One-way length at which the full rating drops 3 % at 120 V and at 240 V, ft. */
  ft120: number;
  ft240: number;
}

/** `count` sizes from `from` up, with the one-way length to the note's 3 % at the full rating, at 120 and 240 V. */
export function lengthRows(material: Material, from: SizeKey, count: number, amps: number): LengthRow[] {
  const sizes = voltageDropSizes(material);
  const i = sizes.indexOf(from);
  if (i < 0 || i + count > sizes.length) throw new Error(`amp guides: no ${count} ${material} sizes from ${from}`);
  return sizes.slice(i, i + count).map((size) => ({ size, ft120: noteFt(size, material, amps, LOW_VOLTS), ft240: noteFt(size, material, amps) }));
}

/** The smallest size whose drop at the full rating over the run stays within the note's 3 %. */
export function smallestFor(material: Material, from: SizeKey, amps: number, lengthFt: number, volts: number): DropRun {
  const sizes = voltageDropSizes(material);
  for (const size of sizes.slice(sizes.indexOf(from))) {
    const r = ampDrop(size, material, amps, lengthFt, volts);
    if (r.vdPct <= VOLTAGE_DROP_NOTE.feederPct) return r;
  }
  throw new Error(`amp guides: no ${material} size keeps ${lengthFt} ft within the note`);
}

function egc(ratingA: number): { rowA: number; cu: SizeKey; al: SizeKey } {
  const r = egcFor(ratingA, 'Cu');
  if (isEgcError(r)) throw new Error(`amp guides: no Table 250.122 row for ${ratingA} A`);
  return { rowA: r.rowA, cu: r.table.cu, al: r.table.alCca };
}

function outlet(config: string, amps: number): NemaConfig {
  const c = nemaConfig(config);
  if (c.amps !== amps) throw new Error(`amp guides: ${config} is not a ${amps} A receptacle`);
  return c;
}

function evRow(breakerA: number) {
  const r = EV_ROWS.find((x) => x.breakerA === breakerA);
  if (!r) throw new Error(`amp guides: no EV output on a ${breakerA} A breaker`);
  return r;
}

// ── 240.4(D) against Table 310.16: the chart on the 15, 20 and 30 A guides ─────────────────────────────────────────

export interface LimitRow {
  size: SizeKey;
  material: Material;
  /** Table 310.16 at 60, 75 and 90 °C, A. */
  a60: number;
  a75: number;
  a90: number;
  /** 240.4(D): the largest breaker or fuse, A. */
  maxA: number;
}

/** The 240.4(D) rows without conditions, copper then aluminum, smallest first. */
export const LIMIT_ROWS: LimitRow[] = (['Cu', 'Al'] as const).flatMap((material) =>
  ROWS_240_4_D.filter((r) => r.material === material && r.conditions === null)
    .sort((a, b) => TABLE_310_16_SIZES.indexOf(a.size) - TABLE_310_16_SIZES.indexOf(b.size))
    .map((r) => {
      const [a60, a75, a90] = ([60, 75, 90] as AmpacityColumn[]).map((c) => table31016(r.size, columnKey(material, c)));
      if (a60 === null || a75 === null || a90 === null) throw new Error(`amp guides: ${r.size} ${material} has no Table 310.16 row`);
      return { size: r.size, material, a60, a75, a90, maxA: r.max_ocpd_a };
    }),
);
if (LIMIT_ROWS.length !== 5) throw new Error('amp guides: 240.4(D) no longer has five unconditioned copper and aluminum rows');

function limitRow(size: SizeKey, material: Material): LimitRow {
  const r = LIMIT_ROWS.find((x) => x.size === size && x.material === material);
  if (!r) throw new Error(`amp guides: no 240.4(D) row for ${size} ${material}`);
  return r;
}

/** The 15, 20 and 30 A guides: the column changes neither answer there, so one copper and one aluminum size. */
function smallGuide(ratingA: number) {
  const g = ampGuide(ratingA);
  if (g.nm.cu.size !== g.c75.cu.size || g.nm.al.size !== g.c75.al.size) throw new Error(`${ratingA} A guide: the column now changes the answer`);
  const cu75 = minimumConductor({ ocpdA: ratingA, material: 'Cu', termination: '75', wiringMethod: 'conductors' });
  const al75 = minimumConductor({ ocpdA: ratingA, material: 'Al', termination: '75', wiringMethod: 'conductors' });
  if (!cu75 || !al75) throw new Error(`${ratingA} A guide: no size at 75 °C`);
  return {
    ...g,
    cu: g.nm.cu.size,
    al: g.nm.al.size,
    /** The 75 °C step: the size Table 310.16 alone gives, and the 240.4(D) row that moved it, if any. */
    firstCu75: cu75.firstSize,
    firstAl75: al75.firstSize,
  };
}

// ── 15 A ─────────────────────────────────────────────────────────────────────────────────────────────────────────

export const GUIDE_15 = (() => {
  const g = smallGuide(15);
  const cuRow = limitRow(g.cu, 'Cu');
  const alRow = limitRow(g.al, 'Al');
  // the page: the copper size's limit is the rating, while Table 310.16 gives it more at 75 and 90 °C
  if (cuRow.maxA !== g.ratingA || !(cuRow.a75 > g.ratingA) || alRow.maxA !== g.ratingA) throw new Error('15 A guide: the 240.4(D) paragraph no longer fits');
  const up = nextLargerSize(g.cu);
  if (!up) throw new Error('15 A guide: no size above the copper answer');
  const upRow = limitRow(up, 'Cu');
  if (!(upRow.maxA > g.ratingA)) throw new Error('15 A guide: the next size up is not allowed on 15 A');
  const plugIn = SPA_MAKERS.filter((m) => m.volts === LOW_VOLTS && m.breaker_a.includes(g.ratingA)).map((m) => `${m.maker} ${m.model.replace(/, plug-in$/, '')}`);
  if (plugIn.length < 1) throw new Error('15 A guide: no plug-in hot tub on 15 A');
  // 14 AWG copper-clad aluminum: its own 240.4(D) row, with conditions
  const ccaRow = ROWS_240_4_D.find((r) => r.size === g.cu && r.material === 'CCA');
  const ccaCond = ccaRow ? conditions240_4D(ccaRow) : null;
  if (!ccaRow || !ccaCond || !(ccaRow.max_ocpd_a < g.ratingA)) throw new Error('15 A guide: the copper-clad aluminum sentence no longer fits');
  return {
    ...g,
    cuRow,
    alRow,
    up,
    upRow,
    cca: { maxA: ccaRow.max_ocpd_a, continuousMaxA: ccaCond.continuousMaxA },
    egc: egc(g.ratingA),
    lengths: { cu: lengthRows('Cu', g.cu, 4, g.ratingA), al: lengthRows('Al', g.al, 4, g.ratingA) },
    receptacle: outlet('5-15R', g.ratingA),
    plugIn,
  };
})();

// ── 20 A ─────────────────────────────────────────────────────────────────────────────────────────────────────────

export const RUN_20_FT = 100;

export const GUIDE_20 = (() => {
  const g = smallGuide(20);
  // the page: Table 310.16 alone would give 14 AWG copper at 75 °C, and 240.4(D) moves it to 12 AWG
  const small = limitRow(g.firstCu75, 'Cu');
  if (g.firstCu75 === g.cu || small.a75 < g.ratingA || small.maxA >= g.ratingA) throw new Error('20 A guide: the 14 AWG paragraph no longer fits');
  const smallAl = limitRow(g.firstAl75, 'Al');
  if (g.firstAl75 === g.al || smallAl.maxA >= g.ratingA) throw new Error('20 A guide: the aluminum paragraph no longer fits');
  const cuRow = limitRow(g.cu, 'Cu');
  if (cuRow.maxA !== g.ratingA) throw new Error('20 A guide: 12 AWG copper is no longer held to 20 A');
  const ev = evRow(g.ratingA);
  const plugIn = SPA_MAKERS.filter((m) => m.volts === LOW_VOLTS && m.breaker_a.includes(g.ratingA)).map((m) => `${m.maker} ${m.model.replace(/, plug-in$/, '')}`);
  if (plugIn.length < 1) throw new Error('20 A guide: no plug-in hot tub on 20 A');
  return {
    ...g,
    small,
    smallAl,
    cuRow,
    egc: egc(g.ratingA),
    lengths: { cu: lengthRows('Cu', g.cu, 4, g.ratingA), al: lengthRows('Al', g.al, 4, g.ratingA) },
    run: {
      lengthFt: RUN_20_FT,
      cu120: ampDrop(g.cu, 'Cu', g.ratingA, RUN_20_FT, LOW_VOLTS),
      cu240: ampDrop(g.cu, 'Cu', g.ratingA, RUN_20_FT),
      need120: smallestFor('Cu', g.cu, g.ratingA, RUN_20_FT, LOW_VOLTS),
      need240: smallestFor('Cu', g.cu, g.ratingA, RUN_20_FT, AMP_VOLTS),
    },
    receptacles: [outlet('5-20R', g.ratingA), outlet('6-20R', g.ratingA)],
    ev: { outputA: ev.outputA, breakerA: ev.breakerA },
    plugIn,
  };
})();

// ── 30 A ─────────────────────────────────────────────────────────────────────────────────────────────────────────

export const RUN_30_FT = 100;

export const GUIDE_30 = (() => {
  const g = smallGuide(30);
  const cuRow = limitRow(g.cu, 'Cu');
  if (cuRow.maxA !== g.ratingA) throw new Error('30 A guide: 10 AWG copper is no longer held to exactly 30 A');
  // aluminum: Table 310.16 would allow 10 AWG at 75 °C, and 240.4(D) holds it below 30 A
  const smallAl = limitRow(g.firstAl75, 'Al');
  if (g.firstAl75 === g.al || smallAl.a75 < g.ratingA || smallAl.maxA >= g.ratingA) throw new Error('30 A guide: the aluminum paragraph no longer fits');
  const over = STANDARD_RATINGS.find((a) => a > g.ratingA);
  if (over === undefined) throw new Error('30 A guide: no standard rating above 30 A');
  const tt30 = RV_OUTLETS.tt30;
  if (tt30.breakerA !== g.ratingA || tt30.volts !== LOW_VOLTS) throw new Error('30 A guide: the RV outlet changed');
  for (const d of [WHIRLPOOL_DRYER, GE_DRYER]) if (d.circuitA !== g.ratingA) throw new Error(`30 A guide: ${d.brand} no longer asks for a 30 A circuit`);
  const four = WHIRLPOOL_DRYER.receptacles.find((r) => r.wires === 4);
  const three = WHIRLPOOL_DRYER.receptacles.find((r) => r.wires === 3);
  if (!four || !three) throw new Error("30 A guide: Whirlpool's dryer receptacles changed");
  if (WHIRLPOOL_DRYER.directWireCu !== g.cu || GE_DRYER.minCopper !== g.cu) throw new Error("30 A guide: the dryer makers' copper size changed");
  const after = /homes built after (\d{4})/.exec(WHIRLPOOL_DRYER.fourWireStatement);
  if (!after) throw new Error("30 A guide: Whirlpool's 4-wire sentence changed");
  const ev = evRow(g.ratingA);
  const twelve = max240_4D('12', 'Cu');
  if (!twelve || twelve.conditions !== null || twelve.max_ocpd_a >= g.ratingA) throw new Error('30 A guide: the 12 AWG answer no longer fits 240.4(D)');
  return {
    ...g,
    cuRow,
    smallAl,
    twelveLimitA: twelve.max_ocpd_a,
    run: {
      lengthFt: RUN_30_FT,
      cu240: ampDrop(g.cu, 'Cu', g.ratingA, RUN_30_FT),
      cu120: ampDrop(g.cu, 'Cu', g.ratingA, RUN_30_FT, LOW_VOLTS),
      need240: smallestFor('Cu', g.cu, g.ratingA, RUN_30_FT, AMP_VOLTS),
      need120: smallestFor('Cu', g.cu, g.ratingA, RUN_30_FT, LOW_VOLTS),
    },
    /** The next standard rating, which 10 AWG copper may not carry on an ordinary circuit, A. */
    over,
    egc: egc(g.ratingA),
    lengths: { cu: lengthRows('Cu', g.cu, 4, g.ratingA), al: lengthRows('Al', g.al, 4, g.ratingA) },
    receptacles: [outlet(tt30.config, g.ratingA), outlet('6-30R', g.ratingA), outlet('10-30R', g.ratingA), outlet('14-30R', g.ratingA)],
    rv: { config: tt30.config, volts: tt30.volts },
    dryer: { whirlpool: WHIRLPOOL_DRYER.brand, ge: GE_DRYER.brand, four: four.config, three: three.config, fourAfterYear: Number(after[1]) },
    ev: { outputA: ev.outputA, breakerA: ev.breakerA },
    disconnect: { twoCircuits: DISCONNECT_MIN_A.twoCircuits, others: DISCONNECT_MIN_A.allOthers },
  };
})();

// ── 40 A ─────────────────────────────────────────────────────────────────────────────────────────────────────────

export const RUN_40_FT = 100;

export const GUIDE_40 = (() => {
  const g = ampGuide(40);
  // the page: copper is the same size in NM cable and at 75 °C, aluminum is not
  if (g.nm.cu.size !== g.c75.cu.size || g.nm.al.size === g.c75.al.size) throw new Error('40 A guide: the column paragraph no longer fits');
  // 8 AWG copper in NM cable carries exactly the rating
  if (g.nm.cu.ampacity !== g.ratingA) throw new Error('40 A guide: NM cable is no longer exactly at the rating');
  const ten = max240_4D('10', 'Cu');
  if (!ten || ten.conditions !== null || ten.max_ocpd_a >= g.ratingA) throw new Error('40 A guide: the 10 AWG answer no longer fits 240.4(D)');
  const f = FRIGIDAIRE_RANGE;
  if (f.cordA !== g.ratingA || f.minCopper40A.hot !== g.nm.cu.size) throw new Error("40 A guide: Frigidaire's 40 A circuit changed");
  const whirlpool = WHIRLPOOL_RANGE.rows.find((r) => r.circuitsA.includes(g.ratingA));
  if (!whirlpool) throw new Error('40 A guide: no Whirlpool range row allows 40 A');
  const ev = evRow(g.ratingA);
  return {
    ...g,
    tenLimitA: ten.max_ocpd_a,
    egc: egc(g.ratingA),
    lengths: { cu: lengthRows('Cu', g.nm.cu.size, 6, g.ratingA), al: lengthRows('Al', g.c75.al.size, 6, g.ratingA) },
    run: {
      lengthFt: RUN_40_FT,
      cu: ampDrop(g.nm.cu.size, 'Cu', g.ratingA, RUN_40_FT),
      alNm: ampDrop(g.nm.al.size, 'Al', g.ratingA, RUN_40_FT),
      al75: ampDrop(g.c75.al.size, 'Al', g.ratingA, RUN_40_FT),
    },
    frigidaire: { brand: f.brand, receptacle: f.receptacle, cordA: f.cordA, hot: f.minCopper40A.hot, neutral: f.minCopper40A.neutral, ground: f.minCopper40A.ground },
    whirlpool: { brand: WHIRLPOOL_RANGE.brand, kwFrom: whirlpool.kw240[0], kwTo: whirlpool.kw240[1], circuitsA: whirlpool.circuitsA },
    ev: { outputA: ev.outputA, breakerA: ev.breakerA, plugIn: ev.plugIn },
  };
})();

// ── 60 A ─────────────────────────────────────────────────────────────────────────────────────────────────────────

export const RUN_60_FT = 100;

export const GUIDE_60 = (() => {
  const g = ampGuide(60);
  // the page: in NM cable 240.4(B) lets 60 A protect the next smaller size, whose ampacity is not a standard rating
  const below = g.nm.cu.below;
  const belowAl = g.nm.al.below;
  if (!below || !belowAl || g.c75.cu.below || STANDARD_RATINGS.includes(below.ampacity)) throw new Error('60 A guide: the 240.4(B) paragraph no longer fits');
  if (g.ratingA > NEXT_SIZE_UP_MAX_A) throw new Error('60 A guide: above the 240.4(B) limit');
  // a continuous load on that size: its ampacity at 125 %
  const continuousMaxA = (below.ampacity * 100) / CONTINUOUS_LOAD_PERCENT;
  // the 48 A EV charger: its breaker is the rating, and 125 % of its output is more than the smaller size carries
  const ev = evRow(g.ratingA);
  const evNeedA = (ev.outputA * CONTINUOUS_LOAD_PERCENT) / 100;
  if (!(evNeedA > below.ampacity) || ev.nm.size !== g.nm.cu.size || ev.c75.size !== g.c75.cu.size) throw new Error('60 A guide: the EV paragraph no longer fits');
  const bullfrog = SPA_MAKERS.filter((m) => m.volts === AMP_VOLTS && m.breaker_a.includes(g.ratingA)).map((m) => m.maker);
  if (bullfrog.length < 1) throw new Error('60 A guide: no hot tub maker lists 60 A');
  if (DISCONNECT_MIN_A.allOthers !== g.ratingA) throw new Error('60 A guide: the 225.39 floor is no longer the rating');
  if (!(TABLE_310_12_ROWS[0].ratingA > g.ratingA)) throw new Error('60 A guide: Table 310.12 now lists 60 A');
  // 8 AWG copper at 75 °C: a standard rating below 60 A, so 240.4(B) does not lift it to 60 A
  const eight = table31016('8', columnKey('Cu', g.high));
  if (eight === null || !(eight < g.ratingA) || !STANDARD_RATINGS.includes(eight)) throw new Error('60 A guide: the 8 AWG answer no longer fits');
  return {
    ...g,
    eight75: eight,
    below,
    belowAl,
    continuousMaxA,
    ev: { outputA: ev.outputA, breakerA: ev.breakerA, needA: evNeedA },
    spaMakers: bullfrog,
    disconnect: { others: DISCONNECT_MIN_A.allOthers, dwelling: DISCONNECT_MIN_A.oneFamilyDwelling },
    serviceFromA: TABLE_310_12_ROWS[0].ratingA,
    egc: egc(g.ratingA),
    lengths: { cu: lengthRows('Cu', g.c75.cu.size, 6, g.ratingA), al: lengthRows('Al', g.c75.al.size, 6, g.ratingA) },
    run: {
      lengthFt: RUN_60_FT,
      cuNm: ampDrop(g.nm.cu.size, 'Cu', g.ratingA, RUN_60_FT),
      cu75: ampDrop(g.c75.cu.size, 'Cu', g.ratingA, RUN_60_FT),
      alNm: ampDrop(g.nm.al.size, 'Al', g.ratingA, RUN_60_FT),
      al75: ampDrop(g.c75.al.size, 'Al', g.ratingA, RUN_60_FT),
    },
  };
})();

// ── 70, 80 and 90 A ──────────────────────────────────────────────────────────────────────────────────────────────

export const RATINGS_7090 = [70, 80, 90];

export interface RatingRow {
  ratingA: number;
  nm: { cu: AmpPick; al: AmpPick };
  c75: { cu: AmpPick; al: AmpPick };
  /** One-way length to the note's 3 % at 240 V on the 60 °C and 75 °C copper sizes, ft. */
  noteFt: { cuNm: number; cu75: number; alNm: number; al75: number };
}

export const GUIDE_7090 = (() => {
  const guides: AmpGuide[] = RATINGS_7090.map((a) => ampGuide(a));
  const rows: RatingRow[] = guides.map((g) => ({
    ratingA: g.ratingA,
    nm: g.nm,
    c75: g.c75,
    noteFt: {
      cuNm: noteFt(g.nm.cu.size, 'Cu', g.ratingA),
      cu75: noteFt(g.c75.cu.size, 'Cu', g.ratingA),
      alNm: noteFt(g.nm.al.size, 'Al', g.ratingA),
      al75: noteFt(g.c75.al.size, 'Al', g.ratingA),
    },
  }));
  const egcs = RATINGS_7090.map(egc);
  if (egcs.some((e) => e.rowA !== egcs[0].rowA)) throw new Error('70 to 90 A guide: the ratings no longer share a Table 250.122 row');
  // every 240.4(B) case among the twelve picks, for the page's list
  const belows = rows.flatMap((r) =>
    (['nm', 'c75'] as const).flatMap((col) =>
      (['cu', 'al'] as const).flatMap((m) => {
        const p = r[col][m];
        return p.below ? [{ ratingA: r.ratingA, column: col === 'nm' ? guides[0].low : guides[0].high, material: m, size: p.below.size, ampacity: p.below.ampacity }] : [];
      }),
    ),
  );
  if (belows.length < 4) throw new Error('70 to 90 A guide: fewer 240.4(B) cases than the page describes');
  // ChargePoint's 50 A output on a 70 A breaker: 240.4(B) at 75 °C
  const cp = EV_CP_TOP;
  if (cp.breakerA !== RATINGS_7090[0] || cp.c75.size !== rows[0].c75.cu.below?.size || cp.nm.size !== rows[0].nm.cu.size) {
    throw new Error("70 to 90 A guide: ChargePoint's 70 A circuit no longer matches the table");
  }
  const low = guides[0].low;
  const high = guides[0].high;
  const ladderCu = ladder('Cu', rows[0].c75.cu.below?.size ?? rows[0].c75.cu.size, rows[rows.length - 1].nm.cu.size, low, high);
  const ladderAl = ladder('Al', rows[0].c75.al.below?.size ?? rows[0].c75.al.size, rows[rows.length - 1].nm.al.size, low, high);
  return {
    rows,
    low,
    high,
    egc: egcs[0],
    belows,
    cp: { outputA: cp.outputA, breakerA: cp.breakerA, needA: cp.neededA, nm: cp.nm, c75: cp.c75 },
    disconnect: { others: DISCONNECT_MIN_A.allOthers, dwelling: DISCONNECT_MIN_A.oneFamilyDwelling },
    ladder: { cu: ladderCu, al: ladderAl },
    /** The ladder chart's guide: the middle rating's picks for bold labels. */
    chart: { ...guides[1], ladder: { cu: ladderCu, al: ladderAl } } as AmpGuide,
  };
})();

// ── 125 A ────────────────────────────────────────────────────────────────────────────────────────────────────────

export const RUN_125_FT = 100;

export const GUIDE_125 = (() => {
  const ratingA = 125;
  if (!(ratingA > TERMINATION_RULES.limitA)) throw new Error('125 A guide: the rating is no longer above the 110.14(C)(1)(a) split');
  const high = TERMINATION_RULES.columnAboveLimit as AmpacityColumn;
  const low = TERMINATION_RULES.columnAtOrBelowLimit as AmpacityColumn;
  const s = serviceLookup(ratingA);
  if (!s) throw new Error('125 A guide: no Table 310.12 row');
  // a feeder with unmarked terminations sits in the 75 °C column above 100 A
  const cu = pick(ratingA, 'Cu', 'unknown', 'conductors');
  const al = pick(ratingA, 'Al', 'unknown', 'conductors');
  const cuCheck = minimumConductor({ ocpdA: ratingA, material: 'Cu', termination: 'unknown', wiringMethod: 'conductors' });
  if (!cuCheck || cuCheck.columnC !== high) throw new Error('125 A guide: the feeder is no longer sized at 75 °C');
  if (!cu.below || !al.below) throw new Error('125 A guide: the 240.4(B) paragraph no longer fits');
  // the page: the service sizes are the 240.4(B) sizes
  if (s.cu !== cu.below.size || s.alCca !== al.below.size) throw new Error('125 A guide: the service and 240.4(B) sizes no longer match');
  const minA = minimumServiceAmpacity(ratingA);
  const e = egc(ratingA);
  const ladderCu = ladder('Cu', s.cu, cu.size, low, high);
  const ladderAl = ladder('Al', s.alCca, al.size, low, high);
  return {
    ratingA,
    low,
    high,
    service: s,
    minA,
    feeder: { cu, al },
    egc: e,
    continuousPercent: CONTINUOUS_LOAD_PERCENT,
    disconnect: { others: DISCONNECT_MIN_A.allOthers, dwelling: DISCONNECT_MIN_A.oneFamilyDwelling },
    ladder: { cu: ladderCu, al: ladderAl },
    lengths: { cu: lengthRows('Cu', s.cu, 6, ratingA), al: lengthRows('Al', s.alCca, 6, ratingA) },
    run: {
      lengthFt: RUN_125_FT,
      cu: ampDrop(cu.size, 'Cu', ratingA, RUN_125_FT),
      al: ampDrop(al.size, 'Al', ratingA, RUN_125_FT),
      cuSvc: ampDrop(s.cu, 'Cu', ratingA, RUN_125_FT),
      alSvc: ampDrop(s.alCca, 'Al', ratingA, RUN_125_FT),
    },
  };
})();
