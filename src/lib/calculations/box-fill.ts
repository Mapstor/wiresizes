// The box fill calculator (WSZ-009d): NEC 2023 314.16. The fill is the sum of the volume allowances 314.16(B) lists,
// each a Table 314.16(B)(1) volume: (B)(1) the conductors as the reader counts them (each one entering or passing
// through once, a long loop twice, none that stays inside), (B)(2) one allowance for internal cable clamps and (B)(3)
// one for each type of support fitting, both on the largest conductor in the box, (B)(4) a double allowance per yoke
// on the largest conductor connected to its devices (and per gang of a wide device), (B)(5) one allowance for up to
// four equipment grounding conductors entering and a quarter for each more, on the largest of them. The box holds the
// fill when its volume (Table 314.16(A), or the volume marked on it, plus marked rings and covers) is at least the
// fill (314.16). Terminal blocks ((B)(6)) are not asked for. Pure; no estimates.
import type { TextPart, ValueFormat } from './format';
import { partsText } from './format';
import { formatSize } from '../verified/awg';
import { BOX_FILL_DOMAIN, BOX_SIZES, FILL_RULES, METAL_BOXES, VOLUME_PER_CONDUCTOR } from '../verified/nec-314-16';
import type { BoxKind, BoxSize, MetalBox } from '../verified/nec-314-16';

export const ENGINE_ID = 'box-fill';
export const DOMAINS = [BOX_FILL_DOMAIN];
export const BOX_FILL_CALC = `calc:${ENGINE_ID}`;
const SRC = BOX_FILL_DOMAIN;

/** Input limits: counts a single box can hold, and volumes up to the 100 in³ that 314.16(A)(2) marks. */
export const BOX_LIMITS = { conductorsPerSize: 40, egc: 20, devices: 6, extraGangs: 6, fittingTypes: 2, volumeIn3: 100, addedIn3: 100 } as const;

export interface BoxFillInput {
  /** The box's volume, in³: a Table 314.16(A) box, or the volume marked on the box. */
  boxIn3: number;
  /** Where boxIn3 comes from: Table 314.16(A), or the volume marked on the box (314.16(A)(2)). */
  boxSource: 'table' | 'marked';
  /** The marked volume of plaster rings, extension rings and domed covers, in³ (314.16(A)); 0 for none. */
  addedIn3: number;
  /** (B)(1): conductors counted per size, the equipment grounding conductors apart. */
  conductors: Record<BoxSize, number>;
  /** (B)(5): equipment grounding conductors entering the box, and the size of the largest. */
  egcCount: number;
  egcSize: BoxSize;
  /** (B)(4): yokes or straps, and the largest conductor connected to their devices. */
  devices: number;
  deviceSize: BoxSize;
  /** (B)(4): gangs beyond one taken by devices wider than a single device box. */
  extraGangs: number;
  /** (B)(2): one or more internal cable clamps. */
  clamps: boolean;
  /** (B)(3): types of support fitting (luminaire studs, hickeys) present. */
  fittingTypes: number;
}

export type FillRule = '(B)(1)' | '(B)(2)' | '(B)(3)' | '(B)(4)' | '(B)(5)';

export interface FillLine {
  rule: FillRule;
  /** What the line counts, in words. */
  what: string;
  size: BoxSize;
  /** Allowances counted: 2 per device yoke, 1.25 for five ground wires. */
  allowances: number;
  /** How the rule counts it, in a few words. */
  basis: string;
  /** Table 314.16(B)(1) volume of one allowance, in³. */
  perIn3: number;
  in3: number;
}

export interface BoxFillResult {
  lines: FillLine[];
  fillIn3: number;
  /** The box's volume plus marked rings and covers. */
  boxIn3: number;
  fits: boolean;
  /** Box minus fill; negative when the fill is larger. */
  spareIn3: number;
  /** The largest conductor in the box, the size (B)(2) and (B)(3) use. */
  largest: BoxSize;
  /** How the fill and spare volumes are written: two decimals, or four for a quarter allowance. */
  fillFormat: ValueFormat;
  /** The smallest Table 314.16(A) box of each kind with room for the fill, rings not counted. */
  smallestByKind: { kind: BoxKind; box: MetalBox }[];
  stepParts: TextPart[][];
  steps: string[];
}

export interface BoxFillError {
  error: string;
}

export function isBoxFillError(r: BoxFillResult | BoxFillError): r is BoxFillError {
  return 'error' in r;
}

const sizeRank = (s: BoxSize) => BOX_SIZES.indexOf(s);
const larger = (a: BoxSize, b: BoxSize) => (sizeRank(a) >= sizeRank(b) ? a : b);

/** How an in³ value is written: two decimals, or as many as it needs up to four (a quarter of 2.25 is 0.5625). */
export function in3Format(v: number): ValueFormat {
  return decimalsFor([v]);
}

/** Two decimals, or as many as the values need up to four. */
function decimalsFor(values: number[]): ValueFormat {
  for (const d of [2, 3, 4]) if (values.every((v) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-9)) return { fixed: d };
  return { fixed: 4 };
}

const COUNT_WORDS: Record<number, string> = { 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six' };

/** How each rule counts, in a few words, for the result table. */
export const BASIS: Record<FillRule, string> = {
  '(B)(1)': 'each one counted',
  '(B)(2)': 'one for all clamps, on the largest conductor',
  '(B)(3)': 'one per type, on the largest conductor',
  '(B)(4)': 'two per yoke or gang, on the largest wire on the devices',
  '(B)(5)': `one for up to ${COUNT_WORDS[FILL_RULES.egcSingleUpTo] ?? FILL_RULES.egcSingleUpTo}, a quarter for each more, on the largest`,
};

export const KIND_ORDER: BoxKind[] = ['device', 'square', 'round/octagonal', 'masonry box/gang', 'FS/FD box'];

export function boxFill(input: BoxFillInput): BoxFillResult | BoxFillError {
  const { conductors, egcCount, devices, extraGangs, fittingTypes } = input;
  if (!(input.boxIn3 > 0 && input.boxIn3 <= BOX_LIMITS.volumeIn3)) return { error: `Enter a box volume above 0 and up to ${BOX_LIMITS.volumeIn3} in³.` };
  if (!(input.addedIn3 >= 0 && input.addedIn3 <= BOX_LIMITS.addedIn3)) return { error: `Enter a ring or cover volume from 0 to ${BOX_LIMITS.addedIn3} in³.` };
  const whole = (n: number, max: number) => Number.isInteger(n) && n >= 0 && n <= max;
  if (!BOX_SIZES.every((s) => whole(conductors[s], BOX_LIMITS.conductorsPerSize))) return { error: `Enter whole numbers of conductors, up to ${BOX_LIMITS.conductorsPerSize} of a size.` };
  if (!whole(egcCount, BOX_LIMITS.egc) || !whole(devices, BOX_LIMITS.devices) || !whole(extraGangs, BOX_LIMITS.extraGangs) || !whole(fittingTypes, BOX_LIMITS.fittingTypes))
    return { error: 'Enter whole numbers for ground wires, devices, gangs and fittings.' };
  const counted = BOX_SIZES.filter((s) => conductors[s] > 0);
  if (counted.length === 0) return { error: 'Count at least one conductor that enters the box.' };
  if (extraGangs > 0 && devices === 0) return { error: 'Extra gangs belong to a device: enter the devices first.' };
  const largestCounted = counted.reduce(larger);
  if (devices > 0 && sizeRank(input.deviceSize) > sizeRank(largestCounted))
    return { error: `The devices' conductor is larger than any conductor counted (largest: ${formatSize(largestCounted)}).` };

  let largest = largestCounted;
  if (egcCount > 0) largest = larger(largest, input.egcSize);

  const vol = (s: BoxSize) => VOLUME_PER_CONDUCTOR[s].in3;
  const lines: FillLine[] = [];
  for (const s of [...counted].reverse()) {
    lines.push({ rule: '(B)(1)', basis: BASIS['(B)(1)'], what: `${formatSize(s)} conductors`, size: s, allowances: conductors[s], perIn3: vol(s), in3: conductors[s] * vol(s) });
  }
  if (input.clamps) {
    lines.push({ rule: '(B)(2)', basis: BASIS['(B)(2)'], what: 'Internal cable clamps', size: largest, allowances: FILL_RULES.clampAllowances, perIn3: vol(largest), in3: FILL_RULES.clampAllowances * vol(largest) });
  }
  if (fittingTypes > 0) {
    const n = fittingTypes * FILL_RULES.fittingAllowancesPerType;
    lines.push({ rule: '(B)(3)', basis: BASIS['(B)(3)'], what: fittingTypes === 1 ? 'One type of support fitting' : `${fittingTypes} types of support fitting`, size: largest, allowances: n, perIn3: vol(largest), in3: n * vol(largest) });
  }
  if (devices > 0) {
    const n = (devices + extraGangs) * FILL_RULES.deviceAllowances;
    const what = `${devices === 1 ? 'One device yoke' : `${devices} device yokes`}${extraGangs > 0 ? ` and ${extraGangs === 1 ? 'one extra gang' : `${extraGangs} extra gangs`}` : ''}`;
    lines.push({ rule: '(B)(4)', basis: BASIS['(B)(4)'], what, size: input.deviceSize, allowances: n, perIn3: vol(input.deviceSize), in3: n * vol(input.deviceSize) });
  }
  if (egcCount > 0) {
    const n = 1 + FILL_RULES.egcExtraFraction * Math.max(0, egcCount - FILL_RULES.egcSingleUpTo);
    lines.push({
      rule: '(B)(5)',
      basis: BASIS['(B)(5)'],
      what: egcCount === 1 ? 'One ground wire' : `${egcCount} ground wires`,
      size: input.egcSize,
      allowances: n,
      perIn3: vol(input.egcSize),
      in3: n * vol(input.egcSize),
    });
  }

  const fillIn3 = lines.reduce((sum, l) => sum + l.in3, 0);
  const boxIn3 = input.boxIn3 + input.addedIn3;
  const spareIn3 = boxIn3 - fillIn3;
  const fits = spareIn3 > -1e-9;
  const fillFormat = decimalsFor([fillIn3, spareIn3, ...lines.map((l) => l.in3)]);
  const smallestByKind = KIND_ORDER.flatMap((kind) => {
    const box = METAL_BOXES.filter((b) => b.kind === kind && b.in3 >= fillIn3 - 1e-9).sort((a, b) => a.in3 - b.in3)[0];
    return box ? [{ kind, box }] : [];
  });

  const RULE_TEXT: Record<FillRule, string> = {
    '(B)(1)': 'each conductor counted, NEC 314.16(B)(1)',
    '(B)(2)': 'one allowance for the clamps, on the largest conductor in the box, NEC 314.16(B)(2)',
    '(B)(3)': 'one allowance for each type of fitting, on the largest conductor in the box, NEC 314.16(B)(3)',
    '(B)(4)': 'a double allowance for each yoke or gang, on the largest conductor connected to the devices, NEC 314.16(B)(4)',
    '(B)(5)': `one allowance for up to ${COUNT_WORDS[FILL_RULES.egcSingleUpTo] ?? FILL_RULES.egcSingleUpTo} ground wires and a quarter for each more, on the largest, NEC 314.16(B)(5)`,
  };
  const stepParts: TextPart[][] = lines.map((l) => [
    `${l.what}: `,
    { n: l.allowances, src: l.rule === '(B)(1)' ? 'input' : BOX_FILL_CALC },
    ' × ',
    { v: l.perIn3, unit: 'in³', src: SRC, format: { fixed: 2 } },
    ' (',
    { size: l.size },
    `, Table 314.16(B)(1)) = `,
    { v: l.in3, unit: 'in³', src: BOX_FILL_CALC, format: in3Format(l.in3) },
    `; ${RULE_TEXT[l.rule]}.`,
  ]);
  stepParts.push([
    'Fill: ',
    { v: fillIn3, unit: 'in³', src: BOX_FILL_CALC, format: in3Format(fillIn3) },
    '. Box',
    input.addedIn3 > 0 ? ' with its rings and covers' : '',
    ': ',
    input.addedIn3 > 0
      ? { v: boxIn3, unit: 'in³', src: BOX_FILL_CALC, format: { upTo: 3 } }
      : input.boxSource === 'table'
        ? { v: boxIn3, unit: 'in³', src: SRC, format: { fixed: 1 } }
        : { v: boxIn3, unit: 'in³', src: 'input' },
    fits ? '. The box is large enough: under NEC 314.16 its volume may not be less than the fill.' : '. The box is too small: under NEC 314.16 its volume may not be less than the fill.',
  ]);
  return { lines, fillIn3, boxIn3, fits, spareIn3, largest, fillFormat, smallestByKind, stepParts, steps: stepParts.map((p) => partsText(p, formatSize)) };
}

export const BOX_FILL = { ENGINE_ID, DOMAINS };
