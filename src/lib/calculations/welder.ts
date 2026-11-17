// The welder calculator (WSZ-011f; sources WSZ-037): the copper circuit for a 240 V welder from its manual. The manual
// gives I1max, the minimum supply wire and the fuse or breaker; the NEC's rule for sizing the supply conductors (630.11)
// is not verified, so the wire starts at the manual's minimum. 630.12(A) holds the breaker to 200 % of I1max and
// 630.12(B) to 200 % of the wire's ampacity (Table 310.16 in the 110.14(C) column; NM or UF cable at 60 °C), each with
// the next higher standard rating of 240.6(A) permitted; Table 240.4(G) sends welder circuits to 630.12, so 240.4(D)
// does not cap the breaker. The wire moves up until 630.12(B) allows the breaker, then for the voltage drop at I1max.
// The ground wire is Table 250.122's for the breaker, not larger than the manual's minimum wire (250.122(A)), grown
// with the wire (250.122(B)).
import type { TextPart } from './format';
import { indefiniteArticle, partsText } from './format';
import { terminationColumn } from './conductor-sizing';
import type { Termination, WiringMethod } from './conductor-sizing';
import { LENGTH_MAX_FT, LENGTH_MIN_FT, RESISTANCE_TEMP_C, VD_TARGET_OPTIONS, resistance75, sizeForDrop } from './voltage-drop';
import { areaCmil, formatSize } from '../verified/awg';
import type { SizeKey } from '../verified/awg';
import { columnKey, nextLargerSize, table31016 } from '../verified/nec-310-16';
import { egc as tableEgcFor, egcProportional } from '../verified/nec-250-122';
import { max240_4D } from '../verified/nec-240-4-d';
import { ocpdRatings } from '../verified/nec-240-6-a';
import { NEC_440_DOMAIN } from '../verified/nec-440';
import { NEC_630_DOMAIN, WELDER_OCPD } from '../verified/nec-630';
import { MFR_WELDERS_DOMAIN } from '../verified/mfr-welders';

export const ENGINE_ID = 'welder';
export const DOMAINS = [
  'nec-310-16',
  'nec-110-14c',
  'nec-240-ocpd',
  'nec-240-4-d',
  'nec-250-grounding',
  'conductor-resistance-20c',
  'awg-geometry',
  NEC_440_DOMAIN,
  NEC_630_DOMAIN,
  MFR_WELDERS_DOMAIN,
];
export const WD_CALC = `calc:${ENGINE_ID}`;

/** The supply the calculator takes the drop at, V (the makers' guides are for 240 V; Lincoln's for 230 V). */
export const WD_VOLTS = 240;
/** Input limits: I1max up to 100 A; the breaker from the standard ratings of 240.6(A), 15 to 125 A. */
export const WD_I1MAX_MAX = 100;
export const WD_OCPD_OPTIONS: number[] = ocpdRatings().filter((a) => a >= 15 && a <= 125);
/** The wire sizes a manual's minimum may be. */
export const WD_MIN_SIZES: SizeKey[] = ['14', '12', '10', '8', '6', '4'];

/** A value, or the next higher standard rating of 240.6(A) where it is not one (630.12). */
export function standardAtOrAbove(a: number): number {
  const r = ocpdRatings().find((x) => x >= a - 1e-9);
  if (r === undefined) throw new Error(`no standard rating at or above ${a} A`);
  return r;
}

export interface WelderInput {
  i1maxA: number;
  /** The manual's minimum supply wire. */
  minSize: SizeKey;
  /** The fuse or breaker rating. */
  ocpdA: number;
  wiringMethod: WiringMethod;
  termination: Termination;
  lengthFt: number;
  vdTargetPct: number;
}

export interface WelderRun {
  input: WelderInput;
  columnC: number;
  /** 630.12(A): 200 % of I1max, and that or the next higher standard rating. */
  welderPctA: number;
  welderLimitA: number;
  /** The smallest wire, from the manual's minimum, whose 630.12(B) limit allows the breaker; its ampacity and limit. */
  firstSize: SizeKey;
  firstAmpacity: number;
  firstLimitA: number;
  /** Sizes passed over because 630.12(B) does not allow the breaker on them (the manual's minimum first). */
  tooSmall: { size: SizeKey; ampacity: number; limitA: number }[];
  /** 240.4(D)'s limit for the first size where the breaker is above it (Table 240.4(G) lifts it). */
  overSmallLimitA: number | null;
  /** The wire after the drop at I1max, its ampacity and its 630.12(B) limit. */
  size: SizeKey;
  ampacity: number;
  conductorLimitA: number;
  /** The largest breaker 630.12 allows on the installed wire. */
  maxOcpdA: number;
  vdVolts: number;
  vdPct: number;
  firstVdPct: number;
  tableEgc: SizeKey;
  egc: SizeKey;
  egcCapped: boolean;
  egcGrown: boolean;
  stepParts: TextPart[][];
  steps: string[];
}

export function isWelderError(r: WelderRun | { error: string }): r is { error: string } {
  return 'error' in r;
}

function columnAmpacity(size: SizeKey, columnC: number): number | null {
  return table31016(size, columnKey('Cu', columnC as 60 | 75 | 90));
}

export function welderCircuit(input: WelderInput): WelderRun | { error: string } {
  const { i1maxA, minSize, ocpdA, lengthFt, vdTargetPct } = input;
  if (!(Number.isFinite(i1maxA) && i1maxA > 0 && i1maxA <= WD_I1MAX_MAX)) return { error: `Enter I1max from the nameplate or manual, up to ${WD_I1MAX_MAX} A.` };
  if (!WD_MIN_SIZES.includes(minSize)) return { error: 'Pick the minimum wire size from the manual.' };
  if (!WD_OCPD_OPTIONS.includes(ocpdA)) return { error: 'Pick the breaker or fuse rating.' };
  if (!(Number.isFinite(lengthFt) && lengthFt >= LENGTH_MIN_FT && lengthFt <= LENGTH_MAX_FT)) return { error: 'Enter the one-way length.' };
  if (!VD_TARGET_OPTIONS.includes(vdTargetPct)) return { error: 'Pick a voltage drop target.' };

  const welderPctA = (WELDER_OCPD.pctOfI1max / 100) * i1maxA;
  const welderLimitA = standardAtOrAbove(welderPctA);
  if (ocpdA > welderLimitA) {
    return { error: `${indefiniteArticle(ocpdA) === 'an' ? 'An' : 'A'} ${ocpdA} A breaker is more than 630.12(A) allows for an I1max of ${i1maxA} A: at most ${welderLimitA} A.` };
  }
  const columnC = terminationColumn(ocpdA, input.termination, input.wiringMethod);
  const limitFor = (size: SizeKey) => {
    const ampacity = columnAmpacity(size, columnC);
    return ampacity === null ? null : { ampacity, limitA: standardAtOrAbove((WELDER_OCPD.pctOfAmpacity / 100) * ampacity) };
  };
  const tooSmall: WelderRun['tooSmall'] = [];
  let firstSize: SizeKey | null = minSize;
  let first = limitFor(minSize);
  while (firstSize && (!first || first.limitA < ocpdA)) {
    if (first) tooSmall.push({ size: firstSize, ampacity: first.ampacity, limitA: first.limitA });
    firstSize = nextLargerSize(firstSize);
    first = firstSize ? limitFor(firstSize) : null;
  }
  if (!firstSize || !first || resistance75(firstSize, 'Cu') === null) return { error: 'No size in Table 310.16 carries this breaker.' };
  const small = max240_4D(firstSize, 'Cu');
  const overSmallLimitA = small && small.conditions === null && ocpdA > small.max_ocpd_a ? small.max_ocpd_a : null;

  const drop = { material: 'Cu' as const, amps: i1maxA, lengthFt, volts: WD_VOLTS, phase: 'single' as const };
  const firstDrop = sizeForDrop({ ...drop, size: firstSize }, Infinity).result;
  const { size, result } = sizeForDrop({ ...drop, size: firstSize }, vdTargetPct);
  const installed = limitFor(size);
  if (!installed) return { error: 'No ampacity for the installed size.' };
  const maxOcpdA = Math.min(welderLimitA, installed.limitA);

  const tableEgc = tableEgcFor(ocpdA, 'Cu');
  if (!tableEgc) return { error: 'No Table 250.122 row for this breaker.' };
  // 250.122(A): not required to be larger than the circuit conductors (the manual's circuit); 250.122(B): grown with the wire
  const egcCapped = areaCmil(tableEgc) > areaCmil(minSize);
  const base = egcCapped ? minSize : tableEgc;
  let egc = base;
  if (size !== minSize) {
    const grown = egcProportional(base, minSize, size).egc ?? size;
    egc = areaCmil(grown) > areaCmil(size) ? size : grown;
  }
  const egcGrown = egc !== base;

  const steps: TextPart[][] = [];
  steps.push([
    'From the manual: I1max ',
    { v: i1maxA, unit: 'A', src: 'input' },
    ', a minimum supply wire of ',
    { size: minSize },
    ' copper and ',
    { v: ocpdA, unit: 'A', src: 'input' },
    ' fuses or breaker.',
  ]);
  steps.push([
    '630.12(A): the breaker may be up to 200 % of I1max, ',
    { v: welderPctA, unit: 'A', src: WD_CALC, format: { upTo: 1 } },
    welderLimitA === welderPctA ? '' : ', or the next standard rating, ',
    ...(welderLimitA === welderPctA ? [] : [{ v: welderLimitA, unit: 'A' as const, src: 'nec-240-ocpd' }]),
    '; ',
    { v: ocpdA, unit: 'A', src: 'input' },
    ' is within it.',
  ]);
  const wireStep: TextPart[] = ['630.12(B): the breaker may be up to 200 % of the wire’s ampacity in Table 310.16 at ', { v: columnC, unit: '°C', src: 'nec-110-14c' }, '. '];
  for (const t of tooSmall) {
    wireStep.push({ size: t.size }, ' carries ', { v: t.ampacity, unit: 'A', src: 'nec-310-16' }, ', so at most ', { v: t.limitA, unit: 'A', src: WD_CALC }, '; ');
  }
  wireStep.push({ size: firstSize }, ' carries ', { v: first.ampacity, unit: 'A', src: 'nec-310-16' }, ', so up to ', { v: first.limitA, unit: 'A', src: WD_CALC }, '.');
  if (overSmallLimitA !== null) {
    wireStep.push(' Table 240.4(G) sends welder circuits to 630.12, so 240.4(D)’s ', { v: overSmallLimitA, unit: 'A', src: 'nec-240-4-d' }, ' cap on ', { size: firstSize }, ' does not apply.');
  }
  steps.push(wireStep);
  steps.push([
    'Voltage drop on ',
    { size: firstSize },
    ' at I1max over ',
    { v: lengthFt, unit: 'ft', src: 'input' },
    ' one way at ',
    { v: WD_VOLTS, unit: 'V', src: 'input' },
    ' (copper at ',
    { v: RESISTANCE_TEMP_C, unit: '°C', src: 'conductor-resistance-20c' },
    '): ',
    { v: firstDrop.vdVolts, unit: 'V', src: WD_CALC, format: { fixed: 2 } },
    ', ',
    { v: firstDrop.vdPct, unit: '%', src: WD_CALC, format: { fixed: 2 } },
    '.',
  ]);
  if (size !== firstSize) {
    steps.push([
      'That is above your ',
      { v: vdTargetPct, unit: '%', src: 'input' },
      ' target, so the wire moves up to ',
      { size },
      ': ',
      { v: result.vdVolts, unit: 'V', src: WD_CALC, format: { fixed: 2 } },
      ', ',
      { v: result.vdPct, unit: '%', src: WD_CALC, format: { fixed: 2 } },
      '.',
    ]);
  }
  const ground: TextPart[] = ['Ground wire: Table 250.122 gives ', { size: tableEgc }, ` for ${indefiniteArticle(ocpdA)} `, { v: ocpdA, unit: 'A', src: 'input' }, ' breaker'];
  if (egcCapped) ground.push(', but 250.122(A) does not require it to be larger than the circuit wire, so ', { size: minSize });
  if (egcGrown) ground.push('; the wire is larger than the manual’s minimum, so the ground wire grows with it (250.122(B)) to ', { size: egc });
  ground.push('.');
  steps.push(ground);

  return {
    input,
    columnC,
    welderPctA,
    welderLimitA,
    firstSize,
    firstAmpacity: first.ampacity,
    firstLimitA: first.limitA,
    tooSmall,
    overSmallLimitA,
    size,
    ampacity: installed.ampacity,
    conductorLimitA: installed.limitA,
    maxOcpdA,
    vdVolts: result.vdVolts,
    vdPct: result.vdPct,
    firstVdPct: firstDrop.vdPct,
    tableEgc,
    egc,
    egcCapped,
    egcGrown,
    stepParts: steps,
    steps: steps.map((p) => partsText(p, formatSize)),
  };
}

export const WELDER = { ENGINE_ID, DOMAINS };
