// Data of the wire size calculator page (WSZ-009b), all from the sizing engine (src/lib/calculations/conductor-sizing.ts):
// the size each rating needs in the 60 °C and 75 °C columns of NEC Table 310.16 with the Table 250.122 ground wire, the
// sizes 240.4(B) lets the rating protect, the worked examples, and the size each one-way length needs on two common
// circuits at the calculator's default drop target. Pure data, no JSX: the tests import it.
import { isSizingError, minimumConductor, ratingForContinuous, sizeConductor, WIRE_SIZE_RATINGS } from './calculations/conductor-sizing';
import type { SizeConductorInput, SizeConductorResult, Termination, WiringMethod } from './calculations/conductor-sizing';
import { correctedAmpacity } from './calculations/ampacity';
import { DEFAULT_VD_TARGET_PCT, voltageDrop } from './calculations/voltage-drop';
import type { VoltageDropResult } from './calculations/voltage-drop';
import { adjustment } from './verified/nec-310-15-C-1';
import { CONTINUOUS_LOAD_PERCENT } from './verified/nec-continuous-load-2023';
import type { Material, SizeKey } from './verified/awg';
import { columnKey, table31016 } from './verified/nec-310-16';
import type { AmpacityColumn } from './verified/nec-310-16';

/** A size and its ampacity in a column. */
export interface SizedAt {
  size: SizeKey;
  amps: number;
}

export interface RatingRow {
  ratingA: number;
  /** NM or UF cable, or single conductors on terminals rated 60 °C. */
  c60: SizedAt;
  /** Single conductors on terminals listed for 75 °C. */
  c75: SizedAt;
  /** The Table 250.122 ground wire for the rating. */
  egc: SizeKey;
  /** 240.4(B): the next smaller size the rating may protect in each column, or null. */
  below60: SizedAt | null;
  below75: SizedAt | null;
}

function minimum(ratingA: number, material: Material, method: WiringMethod, termination: Termination) {
  const m = minimumConductor({ ocpdA: ratingA, material, wiringMethod: method, termination });
  if (!m || m.egc === null) throw new Error(`wire size page: no size for ${ratingA} A ${material}`);
  return m;
}

function sizedAt(size: SizeKey, material: Material, column: AmpacityColumn): SizedAt {
  return { size, amps: table31016(size, columnKey(material, column)) as number };
}

/** Every rating of the calculator, 15 A to 400 A, for one material. */
export function ratingRows(material: Material): RatingRow[] {
  return WIRE_SIZE_RATINGS.map((ratingA) => {
    const m60 = minimum(ratingA, material, 'cable', 'unknown');
    const m75 = minimum(ratingA, material, 'conductors', '75');
    if (m60.columnC !== 60 || m75.columnC !== 75) throw new Error('wire size page: the columns moved');
    return {
      ratingA,
      c60: sizedAt(m60.size, material, 60),
      c75: sizedAt(m75.size, material, 75),
      egc: m60.egc as SizeKey,
      below60: m60.below ? { size: m60.below.size, amps: m60.below.ampacity } : null,
      below75: m75.below ? { size: m75.below.size, amps: m75.below.ampacity } : null,
    };
  });
}

export const RATING_ROWS = { Cu: ratingRows('Cu'), Al: ratingRows('Al') };

/** The row of a rating. */
export function ratingRow(material: Material, ratingA: number): RatingRow {
  const row = RATING_ROWS[material].find((r) => r.ratingA === ratingA);
  if (!row) throw new Error(`wire size page: no row for ${ratingA} A`);
  return row;
}

/** One run of the engine, or a throw. */
export function run(input: SizeConductorInput): SizeConductorResult {
  const r = sizeConductor(input);
  if (isSizingError(r)) throw new Error(`wire size page: ${r.error} for ${JSON.stringify(input)}`);
  return r;
}

/** A stretch of one-way length over which the circuit needs the same size. */
export interface LengthBand {
  size: SizeKey;
  fromFt: number;
  toFt: number;
}

export interface LengthTrack {
  ratingA: number;
  volts: number;
  material: Material;
  targetPct: number;
  maxFt: number;
  bands: LengthBand[];
}

/**
 * The size an NM-cable copper circuit carrying its rating needs at each whole foot of one-way length from 0 to maxFt,
 * single-phase, at the default drop target, grouped into bands; the last band ends at maxFt.
 */
export function lengthTrack(ratingA: number, volts: number, maxFt: number): LengthTrack {
  const bands: LengthBand[] = [];
  for (let ft = 0; ft <= maxFt; ft++) {
    const { size } = run({ ocpdA: ratingA, material: 'Cu', lengthFt: ft, volts, phase: 'single', vdTargetPct: DEFAULT_VD_TARGET_PCT });
    const last = bands[bands.length - 1];
    if (last && last.size === size) last.toFt = ft;
    else bands.push({ size, fromFt: ft, toFt: ft });
  }
  return { ratingA, volts, material: 'Cu', targetPct: DEFAULT_VD_TARGET_PCT, maxFt, bands };
}

export const LENGTH_MAX_FT_CHART = 240;
/** A 20 A circuit at 120 V and a 30 A circuit at 240 V, the two most common household branch circuits on the site's pages. */
export const LENGTH_TRACKS = [lengthTrack(20, 120, LENGTH_MAX_FT_CHART), lengthTrack(30, 240, LENGTH_MAX_FT_CHART)];

/** The band of a length on a track. */
export function bandAt(track: LengthTrack, ft: number): LengthBand {
  const band = track.bands.find((b) => ft >= b.fromFt && ft <= b.toFt);
  if (!band) throw new Error(`wire size page: no band at ${ft} ft`);
  return band;
}

// Worked examples, each checked by tests/wsz009b-wire-size.test.ts.
/** 100 ft one way, 20 A at 120 V, copper NM cable: voltage drop moves the size up from 12 AWG. */
export const LONG_RUN = run({ ocpdA: 20, material: 'Cu', lengthFt: 100, volts: 120, phase: 'single', vdTargetPct: DEFAULT_VD_TARGET_PCT });
/** The drop 12 AWG would give on that run. */
export const LONG_RUN_AT_12 = voltageDrop({ size: '12', material: 'Cu', amps: 20, lengthFt: 100, volts: 120, phase: 'single' }) as VoltageDropResult;
/** A continuous load of 24 A: 125 % of it, the smallest rating that meets that, and the run at that rating. */
export const CONTINUOUS_LOAD_A = 24;
export const CONTINUOUS_NEEDED_A = (CONTINUOUS_LOAD_A * CONTINUOUS_LOAD_PERCENT) / 100;
export const CONTINUOUS_RATING_A = ratingForContinuous(CONTINUOUS_LOAD_A) as number;
export const CONTINUOUS = run({
  ocpdA: CONTINUOUS_RATING_A,
  material: 'Cu',
  loadA: CONTINUOUS_LOAD_A,
  continuous: true,
  lengthFt: 0,
  volts: 240,
  phase: 'single',
});
/** 50 A on single copper conductors with 75 °C terminals: alone, and with 7–9 current-carrying conductors at 30 °C. */
export const BUNDLED_PLAIN = run({ ocpdA: 50, material: 'Cu', wiringMethod: 'conductors', termination: '75', lengthFt: 0, volts: 240, phase: 'single' });
export const BUNDLED = run({
  ocpdA: 50,
  material: 'Cu',
  wiringMethod: 'conductors',
  termination: '75',
  ambientRow: '26–30',
  cccBand: '7–9',
  lengthFt: 0,
  volts: 240,
  phase: 'single',
});
/** 8 AWG copper's 90 °C value with the 7–9 adjustment: what the bundled example's smaller size would carry. */
export const BUNDLED_8_A = correctedAmpacity(table31016('8', 'cu_90') as number, 1, adjustment('7–9'));
