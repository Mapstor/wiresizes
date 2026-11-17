// The box fill calculator page's worked numbers (WSZ-009d), from the engine and data/verified/nec-314-16.json, so the
// page, its chart and its tests read one set: a 3 × 2 × 3½ in device box (Table 314.16(A), 18.0 in³) with one
// receptacle fed by two cables, each with two insulated conductors and a ground wire, and internal clamps; once on
// 12 AWG, once on 14 AWG.
import { boxFill, isBoxFillError } from './calculations/box-fill';
import type { BoxFillInput, BoxFillResult } from './calculations/box-fill';
import { BOX_SIZES, METAL_BOXES, VOLUME_PER_CONDUCTOR } from './verified/nec-314-16';
import type { BoxSize, MetalBox } from './verified/nec-314-16';

export const NO_CONDUCTORS = Object.fromEntries(BOX_SIZES.map((s) => [s, 0])) as Record<BoxSize, number>;

function box(kind: MetalBox['kind'], inches: string): MetalBox {
  const b = METAL_BOXES.find((x) => x.kind === kind && x.inches === inches);
  if (!b) throw new Error(`box fill page: no ${kind} box ${inches} in Table 314.16(A)`);
  return b;
}

/** The example box: the deepest 3 × 2 device box of Table 314.16(A). */
export const EXAMPLE_BOX = box('device', '3 × 2 × 3½');
/** The 4 × 1½ square box of the questions. */
export const SQUARE_BOX = box('square', '4 × 1½');

function run(input: BoxFillInput): BoxFillResult {
  const r = boxFill(input);
  if (isBoxFillError(r)) throw new Error(`box fill page: ${r.error}`);
  return r;
}

export const exampleInput = (size: BoxSize): BoxFillInput => ({
  boxIn3: EXAMPLE_BOX.in3,
  boxSource: 'table',
  addedIn3: 0,
  conductors: { ...NO_CONDUCTORS, [size]: 4 },
  egcCount: 2,
  egcSize: size,
  devices: 1,
  deviceSize: size,
  extraGangs: 0,
  clamps: true,
  fittingTypes: 0,
});

/** One receptacle, two cables with a ground wire each, internal clamps, in the 18.0 in³ box: 12 AWG, then 14 AWG. */
export const EXAMPLE_12 = run(exampleInput('12'));
export const EXAMPLE_14 = run(exampleInput('14'));

/** The calculator's starting inputs: the 12 AWG example. */
export const DEFAULT_INPUT = exampleInput('12');

if (!EXAMPLE_12.fits || EXAMPLE_12.spareIn3 !== 0) throw new Error('box fill page: the 12 AWG example no longer fills the box exactly');
if (!EXAMPLE_14.fits || !(EXAMPLE_14.spareIn3 > 0)) throw new Error('box fill page: the 14 AWG example no longer leaves room');

/** Table 314.16(B)(1) rows for the page's table. */
export const VOLUME_ROWS = BOX_SIZES.map((s) => ({ size: s, ...VOLUME_PER_CONDUCTOR[s] }));

/** A ground wire beyond the fourth adds a quarter allowance: the fifth 12 AWG ground wire's share, in³. */
export const QUARTER_12 = VOLUME_PER_CONDUCTOR['12'].in3 / 4;

/** How many conductors of one size fit beside `allowances` other allowances of that size (whole conductors only). */
export function fitCount(boxIn3: number, size: BoxSize, allowances: number): number {
  const v = VOLUME_PER_CONDUCTOR[size].in3;
  return Math.floor((boxIn3 - allowances * v) / v + 1e-9);
}

/** The single-gang question: the example box with a receptacle (two allowances) and its ground wires (one), then with clamps. */
export const WITH_DEVICE_12 = fitCount(EXAMPLE_BOX.in3, '12', 3);
export const WITH_DEVICE_CLAMPS_12 = fitCount(EXAMPLE_BOX.in3, '12', 4);
/** The deeper 4 in square box of the questions. */
export const DEEP_SQUARE_BOX = box('square', '4 × 2⅛');
/** The round box whose 8 AWG count the 2023 edition corrected (First Revision 7727). */
export const ROUND_SHALLOW_BOX = box('round/octagonal', '4 × 1¼');

if (EXAMPLE_BOX.max['12'] !== fitCount(EXAMPLE_BOX.in3, '12', 0)) throw new Error('box fill page: Table 314.16(A) and Table 314.16(B)(1) disagree on the example box');
if (ROUND_SHALLOW_BOX.max['8'] !== fitCount(ROUND_SHALLOW_BOX.in3, '8', 0)) throw new Error('box fill page: the 2023 row 1 correction no longer holds');
