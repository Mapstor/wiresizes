// The air conditioner calculator (WSZ-011e; sources WSZ-036): the copper circuit for a condenser from its nameplate.
// 440.4(B) puts two numbers on the nameplate: the minimum supply circuit conductor ampacity (MCA) and the maximum rating
// of the branch-circuit protective device (MOCP). The conductor is the smallest Table 310.16 size whose ampacity in the
// 110.14(C) column (by the MOCP's rating; NM or UF cable at 60 °C) is at least the MCA. 240.4(D) does not cap the breaker
// on it ("unless specifically permitted in 240.4(E) or (G)"; Table 240.4(G) sends air-conditioning conductors to Article
// 440). The voltage drop at the MCA over the run may move the size up. The ground wire is Table 250.122's for a breaker
// at the MOCP, not larger than the circuit conductors (250.122(A)), grown with them when the drop moves them up
// (250.122(B)). Copper only, as both makers' documents ask (mfr-equipment.json ac_unit_notes). No 440.32 or 440.35 rule.
import type { TextPart } from './format';
import { indefiniteArticle, partsText } from './format';
import { terminationColumn } from './conductor-sizing';
import type { Termination, WiringMethod } from './conductor-sizing';
import { LENGTH_MAX_FT, LENGTH_MIN_FT, RESISTANCE_TEMP_C, VD_TARGET_OPTIONS, resistance75, sizeForDrop } from './voltage-drop';
import { areaCmil, formatSize } from '../verified/awg';
import type { SizeKey } from '../verified/awg';
import { TABLE_310_16_SIZES, columnKey, table31016 } from '../verified/nec-310-16';
import { egc as tableEgcFor, egcProportional } from '../verified/nec-250-122';
import { max240_4D } from '../verified/nec-240-4-d';
import { ocpdRatings } from '../verified/nec-240-6-a';
import { NEC_440_DOMAIN } from '../verified/nec-440';
import { MFR_HVAC_DOMAIN } from '../verified/mfr-hvac';

export const ENGINE_ID = 'ac-circuit';
export const DOMAINS = [
  'nec-310-16',
  'nec-110-14c',
  'nec-240-ocpd',
  'nec-240-4-d',
  'nec-250-grounding',
  'conductor-resistance-20c',
  'awg-geometry',
  NEC_440_DOMAIN,
  MFR_HVAC_DOMAIN,
];
export const AC_CALC = `calc:${ENGINE_ID}`;

/** The largest MCA the calculator takes, A (the MOCP list stops at 100 A). */
export const AC_MCA_MAX = 100;
/** The MOCP choices: the standard ratings of 240.6(A) from 15 to 100 A. */
export const AC_MOCP_OPTIONS: number[] = ocpdRatings().filter((a) => a >= 15 && a <= AC_MCA_MAX);

export interface AcInput {
  mcaA: number;
  mocpA: number;
  /** The supply: 240 V or 208 V, single phase. */
  volts: 240 | 208;
  wiringMethod: WiringMethod;
  termination: Termination;
  lengthFt: number;
  vdTargetPct: number;
}

export interface AcRun {
  input: AcInput;
  columnC: number;
  /** The smallest size whose ampacity is at least the MCA, and that ampacity. */
  firstSize: SizeKey;
  firstAmpacity: number;
  /** 240.4(D)'s limit for the first size, when the MOCP is above it (the breaker 240.4(G) allows anyway). */
  overSmallLimitA: number | null;
  /** The size after the voltage drop, its ampacity and its drop at the MCA. */
  size: SizeKey;
  ampacity: number;
  vdVolts: number;
  vdPct: number;
  /** The first size's drop, percent. */
  firstVdPct: number;
  /** Table 250.122's ground wire for a breaker at the MOCP, and the one the circuit takes. */
  tableEgc: SizeKey;
  egc: SizeKey;
  /** 250.122(A) kept the ground wire at the circuit conductors' size. */
  egcCapped: boolean;
  /** 250.122(B) grew it with conductors the drop moved up. */
  egcGrown: boolean;
  stepParts: TextPart[][];
  steps: string[];
}

export function isAcError(r: AcRun | { error: string }): r is { error: string } {
  return 'error' in r;
}

export function acCircuit(input: AcInput): AcRun | { error: string } {
  const { mcaA, mocpA, volts, lengthFt, vdTargetPct } = input;
  if (!(Number.isFinite(mcaA) && mcaA > 0 && mcaA <= AC_MCA_MAX)) return { error: 'Enter the MCA from the nameplate.' };
  if (!AC_MOCP_OPTIONS.includes(mocpA)) return { error: 'Pick the MOCP from the nameplate.' };
  if (mocpA < mcaA) return { error: 'The MOCP is below the MCA: check the two numbers on the nameplate.' };
  if (volts !== 240 && volts !== 208) return { error: 'Pick 240 V or 208 V.' };
  if (!(Number.isFinite(lengthFt) && lengthFt >= LENGTH_MIN_FT && lengthFt <= LENGTH_MAX_FT)) return { error: 'Enter the one-way length.' };
  if (!VD_TARGET_OPTIONS.includes(vdTargetPct)) return { error: 'Pick a voltage drop target.' };

  const columnC = terminationColumn(mocpA, input.termination, input.wiringMethod);
  const column = columnKey('Cu', columnC);
  const firstSize = TABLE_310_16_SIZES.find((k) => {
    const a = table31016(k, column);
    return a !== null && a >= mcaA && resistance75(k, 'Cu') !== null;
  });
  if (!firstSize) return { error: 'No size in Table 310.16 carries this MCA.' };
  const firstAmpacity = table31016(firstSize, column) as number;
  const small = max240_4D(firstSize, 'Cu');
  const overSmallLimitA = small && small.conditions === null && mocpA > small.max_ocpd_a ? small.max_ocpd_a : null;

  const drop = { material: 'Cu' as const, amps: mcaA, lengthFt, volts, phase: 'single' as const };
  const first = sizeForDrop({ ...drop, size: firstSize }, Infinity).result;
  const { size, result } = sizeForDrop({ ...drop, size: firstSize }, vdTargetPct);
  const ampacity = table31016(size, column) as number;

  const tableEgc = tableEgcFor(mocpA, 'Cu');
  if (!tableEgc) return { error: 'No Table 250.122 row for this MOCP.' };
  // 250.122(A): not required to be larger than the circuit conductors; 250.122(B): grown with conductors moved up
  const egcCapped = areaCmil(tableEgc) > areaCmil(firstSize);
  const base = egcCapped ? firstSize : tableEgc;
  let egc = base;
  if (size !== firstSize) {
    const grown = egcProportional(base, firstSize, size).egc ?? size;
    egc = areaCmil(grown) > areaCmil(size) ? size : grown;
  }
  const egcGrown = egc !== base;

  const steps: TextPart[][] = [];
  steps.push([
    'The nameplate gives the minimum circuit ampacity (MCA), ',
    { v: mcaA, unit: 'A', src: 'input' },
    ', and the largest breaker or fuse (MOCP), ',
    { v: mocpA, unit: 'A', src: 'input' },
    ' (440.4(B)).',
  ]);
  steps.push([
    'The smallest copper size whose ampacity in Table 310.16 at ',
    { v: columnC, unit: '°C', src: 'nec-110-14c' },
    ' is at least the MCA: ',
    { size: firstSize },
    ' (',
    { v: firstAmpacity, unit: 'A', src: 'nec-310-16' },
    ').',
  ]);
  if (overSmallLimitA !== null) {
    steps[1].push(
      ' 240.4(D) would hold ',
      { size: firstSize },
      ` to ${indefiniteArticle(overSmallLimitA)} `,
      { v: overSmallLimitA, unit: 'A', src: 'nec-240-4-d' },
      ' breaker, but Table 240.4(G) sends air-conditioning circuits to Article 440, whose Part III sets the MOCP.',
    );
  } else if (mocpA > firstAmpacity) {
    steps[1].push(
      ' The MOCP is above that ampacity: Table 240.4(G) sends air-conditioning circuits to Article 440, whose Part III sets the MOCP.',
    );
  }
  steps.push([
    'Voltage drop on ',
    { size: firstSize },
    ' at the MCA over ',
    { v: lengthFt, unit: 'ft', src: 'input' },
    ' one way at ',
    { v: volts, unit: 'V', src: 'input' },
    ' (copper at ',
    { v: RESISTANCE_TEMP_C, unit: '°C', src: 'conductor-resistance-20c' },
    '): ',
    { v: first.vdVolts, unit: 'V', src: AC_CALC, format: { fixed: 2 } },
    ', ',
    { v: first.vdPct, unit: '%', src: AC_CALC, format: { fixed: 2 } },
    '.',
  ]);
  if (size !== firstSize) {
    steps.push([
      'That is above your ',
      { v: vdTargetPct, unit: '%', src: 'input' },
      ' target, so the wire moves up to ',
      { size },
      ': ',
      { v: result.vdVolts, unit: 'V', src: AC_CALC, format: { fixed: 2 } },
      ', ',
      { v: result.vdPct, unit: '%', src: AC_CALC, format: { fixed: 2 } },
      '.',
    ]);
  }
  const ground: TextPart[] = ['Ground wire: Table 250.122 gives ', { size: tableEgc }, ` for ${indefiniteArticle(mocpA)} `, { v: mocpA, unit: 'A', src: 'input' }, ' breaker'];
  if (egcCapped) ground.push(', but 250.122(A) does not require it to be larger than the circuit conductors, so ', { size: firstSize });
  if (egcGrown) ground.push('; the wire moved up for the drop, so the ground wire moves up with it (250.122(B)) to ', { size: egc });
  ground.push('.');
  steps.push(ground);
  steps.push(['Breaker or fuse: no larger than the MOCP, ', { v: mocpA, unit: 'A', src: 'input' }, '.']);

  return {
    input,
    columnC,
    firstSize,
    firstAmpacity,
    overSmallLimitA,
    size,
    ampacity,
    vdVolts: result.vdVolts,
    vdPct: result.vdPct,
    firstVdPct: first.vdPct,
    tableEgc,
    egc,
    egcCapped,
    egcGrown,
    stepParts: steps,
    steps: steps.map((p) => partsText(p, formatSize)),
  };
}

export const AC_CIRCUIT = { ENGINE_ID, DOMAINS };
