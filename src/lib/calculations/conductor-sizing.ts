// Conductor size for a breaker or fuse rating:
// 1. smallest NEC Table 310.16 size whose ampacity in the termination column is at least the rating. The column is
//    60 °C by default (terminations unknown, cable); terminationColumn() follows the 110.14(C) engine_rules of
//    nec-110-14c.json. With derating inputs the size's derated ampacity counts instead: start-column ampacity (90 °C
//    for individual conductors, 60 °C for cable) × Table 310.15(B)(1)(1) factor for that column × Table 310.15(C)(1)
//    percent, capped at the termination-column ampacity;
// 2. NEC 240.4(D) rows without conditions move the size up while the rating exceeds their limit;
// 3. equipment grounding conductor (EGC) from Table 250.122 by rating, copper or aluminum/CCA column, not larger than the
//    step-2 conductor (250.122(A), verified 2023 in WSZ-036; D-08 lifted in WSZ-038);
// 4. voltage drop at the load current with 75 °C resistance from awg.json;
// 5. larger Table 310.16 sizes until the drop meets the reader's target, 2000 kcmil at most (voltage-drop.ts);
// 6. if step 5 upsized, the EGC grows in proportion (250.122(B), egcProportional): step-3 EGC area × chosen area ÷
//    step-2 area, multiplied first, smallest Table 310.16 size at or above it, never smaller than the step-3 EGC and
//    never larger than the chosen size. It starts from the step-2 size, so increases needed for correction and
//    adjustment never scale the EGC.
// Without the optional inputs (termination 'unknown', wiring method 'cable', no derating) the results are the 60 °C
// results of WSZ-002. steps[] explains each step, except in the derating mode, whose text WSZ-009 writes; stepParts
// holds the same sentences in parts, so the result panel renders their numbers through <Val> and sizes through <Size>.
import { indefiniteArticle, materialName, partsText } from './format';
import type { TextPart, ValuePart } from './format';
import { areaCmil, formatSize } from '../verified/awg';
import type { Material, SizeKey } from '../verified/awg';
import { AMPACITY_COLUMNS, columnKey, nextLargerSize, table31016, TABLE_310_16_SIZES } from '../verified/nec-310-16';
import type { AmpacityColumn } from '../verified/nec-310-16';
import { correction } from '../verified/nec-310-15-B-1-1';
import type { CorrectionColumn } from '../verified/nec-310-15-B-1-1';
import { adjustment } from '../verified/nec-310-15-C-1';
import { max240_4D, NEXT_SIZE_UP_MAX_A } from '../verified/nec-240-4-d';
import { ocpdRatings } from '../verified/nec-240-6-a';
import { egc as tableEgcFor, egcProportional } from '../verified/nec-250-122';
import type { EgcProportional } from '../verified/nec-250-122';
import { TERMINATION_RULES } from '../verified/nec-110-14c';
import { voltsValid } from './inputs';
import type { Phase } from './inputs';
import { DEFAULT_VD_TARGET_PCT, LENGTH_MAX_FT, LENGTH_MIN_FT, RESISTANCE_TEMP_C, sizeForDrop, VD_FORMAT, voltageDrop } from './voltage-drop';
import type { SizeForDrop, VoltageDropResult } from './voltage-drop';
import { correctedAmpacity } from './ampacity';
import { CONTINUOUS_LOAD_PERCENT } from '../verified/nec-continuous-load-2023';

export const ENGINE_ID = 'conductor-sizing';
const CALC = `calc:${ENGINE_ID}`;
export const DOMAINS = [
  'nec-310-16',
  'nec-240-4-d',
  'nec-240-ocpd',
  'nec-250-grounding',
  'conductor-resistance-20c',
  'awg-geometry',
  'nec-110-14c',
  'nec-310-15-corrections',
  // since WSZ-009b: the 125 % continuous-load rules (210.19(A), 210.20(A))
  'nec-continuous-load',
];

export type SizingError =
  | 'rating-not-standard'
  | 'rating-out-of-range'
  | 'load-above-rating'
  | 'rating-below-continuous'
  | 'length-out-of-range'
  | 'vd-target-out-of-range'
  | 'voltage-invalid'
  | 'ambient-no-factor'
  | 'no-size';

export const SIZING_ERROR_MESSAGES: Record<SizingError, string> = {
  'rating-not-standard': 'Choose a standard breaker or fuse rating from NEC Table 240.6(A).',
  'rating-out-of-range': 'This calculator covers breaker and fuse ratings from 15 A to 400 A.',
  'load-above-rating': 'The load current must be between 0 A and the breaker or fuse rating.',
  'rating-below-continuous': 'A continuous load needs a breaker or fuse of at least 125 % of the load (NEC 210.20(A)).',
  'length-out-of-range': 'Enter a one-way length from 0 ft to 2000 ft.',
  'vd-target-out-of-range': 'Choose a voltage-drop target from 1 % to 10 %.',
  'ambient-no-factor':
    'NEC Table 310.15(B)(1)(1) gives no factor for these conductors at this temperature: they may not be used there.',
  'no-size': 'With these corrections, no size in NEC Table 310.16 carries this rating.',
  'voltage-invalid':
    'Enter a voltage above 0 V. Three-phase uses the line-to-line voltages 208, 240, 480 or 600 V.',
};

export const RATING_MIN_A = 15;
export const RATING_MAX_A = 400;
export const VD_TARGET_MIN_PCT = 1;
export const VD_TARGET_MAX_PCT = 10;

/** NEC Table 240.6(A) standard ratings. */
export const STANDARD_RATINGS: number[] = ocpdRatings();
/** Ratings the wire size calculator offers: 15 A to 400 A. */
export const WIRE_SIZE_RATINGS: number[] = STANDARD_RATINGS.filter((a) => a >= RATING_MIN_A && a <= RATING_MAX_A);

export const EGC_UPSIZED_NOTE = 'Ground wire increased in proportion to the larger conductors (NEC 250.122(B)).';
export const EGC_NONE_MESSAGE = 'No size in NEC Table 310.16 is large enough for this ground wire.';

/** 250.122(A): the Table 250.122 EGC, not required to be larger than the circuit conductors. */
function cappedEgc(tableEgc: SizeKey | null, conductor: SizeKey): { tableEgc: SizeKey | null; egc: SizeKey | null; egcCapped: boolean } {
  const egcCapped = tableEgc !== null && areaCmil(tableEgc) > areaCmil(conductor);
  return { tableEgc, egc: egcCapped ? conductor : tableEgc, egcCapped };
}

/** The ground wire step: Table 250.122's size after `lead`, and 250.122(A)'s cap at the circuit conductors when it applies. */
export function egcStepParts(lead: TextPart[], m: Pick<MinimumConductor, 'tableEgc' | 'egc' | 'egcCapped' | 'size'>, material: Material): TextPart[] {
  const column = material === 'Cu' ? 'copper' : 'aluminum or copper-clad aluminum';
  const parts: TextPart[] = [...lead, ` NEC Table 250.122 (${column} column): `, { size: m.tableEgc as SizeKey }];
  if (m.egcCapped) parts.push('; 250.122(A) does not require it to be larger than the ', { size: m.size }, ' circuit conductors, so ', { size: m.egc as SizeKey });
  parts.push('.');
  return parts;
}

/** 'unknown'; '60': terminations marked 60 °C; '75': the reader confirmed every termination is listed and identified for 75 °C conductors. */
export type Termination = 'unknown' | '60' | '75';
/** 'cable': NM, UF or not sure (always 60 °C); 'conductors': individual conductors, where the termination rules apply. */
export type WiringMethod = 'cable' | 'conductors';

/** The Table 310.16 column for a rating, per the 110.14(C) engine_rules (never the 90 °C column). */
export function terminationColumn(ocpdA: number, termination: Termination, wiringMethod: WiringMethod): AmpacityColumn {
  if (wiringMethod === 'cable') return TERMINATION_RULES.cableColumn as AmpacityColumn;
  if (termination === 'unknown') {
    const limited = ocpdA <= TERMINATION_RULES.limitA;
    return (limited ? TERMINATION_RULES.columnAtOrBelowLimit : TERMINATION_RULES.columnAboveLimit) as AmpacityColumn;
  }
  return Number(termination) as AmpacityColumn;
}

/** Derating starts from the conductor's own column: the highest Table 310.16 column for individual conductors, the cable column for NM or UF. */
function startColumn(wiringMethod: WiringMethod): AmpacityColumn {
  return wiringMethod === 'cable' ? (TERMINATION_RULES.cableColumn as AmpacityColumn) : (Math.max(...AMPACITY_COLUMNS) as AmpacityColumn);
}

export interface MinimumConductorInput {
  ocpdA: number;
  material: Material;
  /** Default 'unknown'. */
  termination?: Termination;
  /** Default 'cable'. */
  wiringMethod?: WiringMethod;
  /** Derating: a Table 310.15(B)(1)(1) row key ("36–40"). The derating mode applies when this is set. */
  ambientRow?: string | null;
  /** Derating: a Table 310.15(C)(1) row key ("4–6"), or null for 1–3 current-carrying conductors. */
  cccBand?: string | null;
}

/** A 240.4(D) row met in step 2. */
export interface Limit240_4DStep {
  size: SizeKey;
  maxOcpdA: number;
  /** The next larger size when the rating is above the limit; null when the rating is within it. */
  movedTo: SizeKey | null;
}

export interface MinimumConductor {
  /** The termination column. */
  columnC: AmpacityColumn;
  /** Derating: the column correction and adjustment start from; null without derating. */
  startColumnC: AmpacityColumn | null;
  /** Step 1: the smallest size whose ampacity (derated, with derating) is at least the rating. */
  firstSize: SizeKey;
  /** Step 2: the 240.4(D) rows met on the way up from firstSize. */
  limits240_4D: Limit240_4DStep[];
  /** firstSize after 240.4(D). */
  size: SizeKey;
  /** 240.4(D) moved the size above firstSize. */
  limitedBy240_4D: boolean;
  /** Derating: the size's derated ampacity, capped at its termination-column ampacity; null without derating. */
  deratedAmpacity: number | null;
  /** Step 3: the Table 250.122 EGC for the rating. */
  tableEgc: SizeKey | null;
  /** Step 3: the EGC to install: tableEgc, not larger than the step-2 size (250.122(A)). */
  egc: SizeKey | null;
  /** 250.122(A) held the EGC at the step-2 size (Table 250.122 lists a larger one for the rating). */
  egcCapped: boolean;
  /**
   * 240.4(B): the next smaller size, when 240.4(D) did not move the size, the rating is at most NEXT_SIZE_UP_MAX_A, the
   * smaller size's ampacity (derated and capped like the others) is not a standard rating and the rating is the next
   * standard one above it, and 240.4(D) allows the rating on it; otherwise null.
   */
  below: { size: SizeKey; ampacity: number } | null;
}

/**
 * The ratings and materials where 250.122(A) holds the Table 250.122 EGC at the step-2 size: every offered rating, both
 * materials and both termination columns, without derating (derating only makes the conductor larger, so it adds none).
 */
export function egcCapCases(): { ocpdA: number; material: Material; tableEgc: SizeKey; size: SizeKey }[] {
  const seen = new Map<string, { ocpdA: number; material: Material; tableEgc: SizeKey; size: SizeKey }>();
  for (const ocpdA of WIRE_SIZE_RATINGS) {
    for (const material of ['Cu', 'Al'] as const) {
      for (const [termination, wiringMethod] of [['unknown', 'cable'], ['60', 'conductors'], ['75', 'conductors']] as const) {
        const m = minimumConductor({ ocpdA, material, termination, wiringMethod });
        if (m && m.egcCapped && m.tableEgc !== null) seen.set(`${ocpdA}|${material}|${m.size}`, { ocpdA, material, tableEgc: m.tableEgc, size: m.size });
      }
    }
  }
  return [...seen.values()];
}

/** Steps 1 to 3; null when no Table 310.16 size reaches the rating. */
export function minimumConductor(input: MinimumConductorInput): MinimumConductor | null {
  const { ocpdA, material } = input;
  const wiringMethod = input.wiringMethod ?? 'cable';
  const columnC = terminationColumn(ocpdA, input.termination ?? 'unknown', wiringMethod);
  const column = columnKey(material, columnC);
  const ambientRow = input.ambientRow ?? null;
  const startColumnC = ambientRow === null ? null : startColumn(wiringMethod);
  const factor = ambientRow === null ? null : correction(ambientRow, `f_${startColumnC}` as CorrectionColumn);
  const percent = adjustment(input.cccBand ?? null);

  // the ampacity a size counts with: its termination-column value, or with derating the derated value capped at it
  const ampacityOf = (key: SizeKey): number | null => {
    const columnA = table31016(key, column);
    if (columnA === null || startColumnC === null) return columnA;
    const startA = table31016(key, columnKey(material, startColumnC));
    return startA === null || factor === null ? null : Math.min(correctedAmpacity(startA, factor, percent), columnA);
  };

  // Step 1: smallest size whose ampacity is at least the rating (sizes without a value in the column are skipped)
  const firstSize = TABLE_310_16_SIZES.find((key) => {
    const a = ampacityOf(key);
    return a !== null && a >= ocpdA;
  });
  if (!firstSize) return null;

  // Step 2: 240.4(D) rows without conditions
  const limits240_4D: Limit240_4DStep[] = [];
  let size = firstSize;
  for (;;) {
    const limit = max240_4D(size, material);
    if (!limit || limit.conditions !== null) break;
    if (ocpdA <= limit.max_ocpd_a) {
      limits240_4D.push({ size, maxOcpdA: limit.max_ocpd_a, movedTo: null });
      break;
    }
    let next = nextLargerSize(size);
    while (next && table31016(next, column) === null) next = nextLargerSize(next);
    if (!next) break;
    limits240_4D.push({ size, maxOcpdA: limit.max_ocpd_a, movedTo: next });
    size = next;
  }

  // 240.4(B): the next smaller size with a value in the column, protected at the next standard rating above its ampacity
  let below: MinimumConductor['below'] = null;
  if (size === firstSize && ocpdA <= NEXT_SIZE_UP_MAX_A) {
    const smaller = TABLE_310_16_SIZES.slice(0, TABLE_310_16_SIZES.indexOf(firstSize))
      .reverse()
      .find((key) => ampacityOf(key) !== null);
    const a = smaller ? ampacityOf(smaller) : null;
    const limit = smaller ? max240_4D(smaller, material) : null;
    const limitAllows = !limit || (limit.conditions === null && ocpdA <= limit.max_ocpd_a);
    if (smaller && a !== null && limitAllows && !STANDARD_RATINGS.includes(a) && STANDARD_RATINGS.find((r) => r > a) === ocpdA) {
      below = { size: smaller, ampacity: a };
    }
  }

  return {
    columnC,
    startColumnC,
    firstSize,
    limits240_4D,
    size,
    limitedBy240_4D: size !== firstSize,
    deratedAmpacity: startColumnC === null ? null : ampacityOf(size),
    // Step 3: EGC by rating and material, not larger than the circuit conductors (250.122(A))
    ...cappedEgc(tableEgcFor(ocpdA, material), size),
    below,
  };
}

export interface SizeConductorInput extends MinimumConductorInput {
  /** Load current for voltage drop; defaults to the rating. */
  loadA?: number | null;
  /**
   * The load is continuous. With loadA, the rating must be at least CONTINUOUS_LOAD_PERCENT of it (210.20(A)); without,
   * the steps give the largest continuous load the rating serves.
   */
  continuous?: boolean;
  lengthFt: number;
  volts: number;
  phase: Phase;
  vdTargetPct?: number;
}

export interface SizeConductorResult {
  size: SizeKey;
  /** 60 °C ampacity of the returned size. */
  ampacity60: number;
  /** The termination column (60 °C by default). */
  columnC: AmpacityColumn;
  /** The returned size's ampacity in that column. */
  ampacity: number;
  /** 240.4(D) moved the size above the first size whose column (or derated) ampacity reaches the rating. */
  limitedBy240_4D: boolean;
  /** Derating: the start column; null without derating. */
  startColumnC: AmpacityColumn | null;
  /** Derating: minSizeByAmpacity's derated ampacity, capped at its termination-column ampacity; null without derating. */
  deratedAmpacity: number | null;
  /** Size required by the ampacity and 240.4(D) (steps 1 and 2). */
  minSizeByAmpacity: SizeKey;
  /** minSizeByAmpacity's ampacity: its termination-column value, or with derating its derated value capped at that. */
  minAmpacity: number;
  vdVolts: number;
  vdPct: number;
  meetsTarget: boolean;
  /** null only when no Table 310.16 size reaches the required area. */
  egc: SizeKey | null;
  /** The returned EGC is larger than the Table 250.122 size (or none is large enough). */
  egcUpsized: boolean;
  /** The EGC is null (no size is large enough); 250.122(A) keeps it from being larger than the conductor otherwise. */
  egcLargerThanConductor: boolean;
  /** 250.122(A) held the step-3 EGC at the step-2 size. */
  egcCapped: boolean;
  /**
   * 240.4(B): the next smaller size the rating may protect, with the largest load it carries (210.19(A)) and the largest
   * continuous load; null when there is none, when voltage drop chose a larger size, or when the entered load is too large.
   */
  nextSizeUp: { size: SizeKey; ampacity: number; maxLoadA: number; maxContinuousA: number } | null;
  /** Each step in words. */
  steps: string[];
  /** steps[] in parts: steps[k] is partsText(stepParts[k], formatSize). */
  stepParts: TextPart[][];
}

export interface SizeConductorError {
  error: SizingError;
}

export function isSizingError(result: SizeConductorResult | SizeConductorError): result is SizeConductorError {
  return 'error' in result;
}

/** The smallest standard rating of at least CONTINUOUS_LOAD_PERCENT of a continuous load (210.20(A)), or null past 400 A. */
export function ratingForContinuous(loadA: number): number | null {
  const needed = (loadA * CONTINUOUS_LOAD_PERCENT) / 100;
  return WIRE_SIZE_RATINGS.find((a) => a >= needed) ?? null;
}

export const WIRE_SIZE_DEFAULTS = {
  ocpdA: 20,
  loadA: null as number | null,
  lengthFt: 50,
  volts: 240,
  phase: 'single' as Phase,
  vdTargetPct: DEFAULT_VD_TARGET_PCT,
};

/** A current: whole amperes as entered, others with one decimal. */
function amps(value: number, src: string): ValuePart {
  return { v: value, unit: 'A', src, format: Number.isInteger(value) ? undefined : { fixed: 1 } };
}

/** An area in whole circular mils. */
function cmil(value: number): ValuePart {
  return { v: Math.round(value), unit: 'cmil', src: CALC };
}

/** stepParts of the plain and termination modes. */
function explain(
  input: SizeConductorInput,
  loadA: number,
  target: number,
  minimum: MinimumConductor,
  atMinimum: VoltageDropResult,
  steppedUp: SizeForDrop | null,
  proportional: EgcProportional | null,
): TextPart[][] {
  const { ocpdA, lengthFt, volts, phase, material } = input;
  const metal = materialName(material);
  const baseEgc = minimum.egc as SizeKey;
  const rating = amps(ocpdA, 'input');
  const drop = (vd: VoltageDropResult): TextPart[] => [
    { v: vd.vdVolts, unit: 'V', src: CALC, format: VD_FORMAT },
    ', ',
    { v: vd.vdPct, unit: '%', src: CALC, format: VD_FORMAT },
  ];
  const yourTarget: ValuePart = { v: target, unit: '%', src: 'input' };
  const steps: TextPart[][] = [];
  const percent125: ValuePart = { v: CONTINUOUS_LOAD_PERCENT, unit: '%', src: 'nec-continuous-load' };
  if (input.continuous && input.loadA !== null && input.loadA !== undefined) {
    steps.push([
      'A continuous load of ',
      amps(input.loadA, 'input'),
      ' needs a breaker or fuse rated at least ',
      percent125,
      ' of it, ',
      amps((input.loadA * CONTINUOUS_LOAD_PERCENT) / 100, CALC),
      ' (NEC 210.20(A)), and conductors with at least that ampacity (NEC 210.19(A)). The ',
      rating,
      ' rating meets the first, and a size that carries the rating meets the second.',
    ]);
  } else if (input.continuous) {
    steps.push([
      'For a continuous load, the breaker or fuse must be rated at least ',
      percent125,
      ` of the load (NEC 210.20(A)): ${indefiniteArticle(ocpdA)} `,
      rating,
      ' rating serves a continuous load of up to ',
      amps((ocpdA * 100) / CONTINUOUS_LOAD_PERCENT, CALC),
      '.',
    ]);
  }
  if (minimum.startColumnC === null) {
    steps.push([
      `Smallest ${metal} size with a `,
      { v: minimum.columnC, unit: '°C', src: CALC },
      ' ampacity of at least ',
      rating,
      ' in NEC Table 310.16: ',
      { size: minimum.firstSize },
      ' (',
      amps(table31016(minimum.firstSize, columnKey(material, minimum.columnC)) as number, CALC),
      ').',
    ]);
  } else {
    const start = minimum.startColumnC;
    const factor = correction(input.ambientRow as string, `f_${start}` as CorrectionColumn) as number;
    const percent = adjustment(input.cccBand ?? null);
    const startA = table31016(minimum.firstSize, columnKey(material, start)) as number;
    const capA = table31016(minimum.firstSize, columnKey(material, minimum.columnC)) as number;
    const derated = correctedAmpacity(startA, factor, percent);
    const corrections: TextPart[][] = [];
    if (factor !== 1) {
      corrections.push(['the ambient factor ', { n: factor, src: 'nec-310-15-corrections', format: { fixed: 2 } }, ' (NEC Table 310.15(B)(1)(1))']);
    }
    if (percent !== 100) {
      corrections.push([
        `the adjustment for ${input.cccBand} current-carrying conductors, `,
        { v: percent, unit: '%', src: 'nec-310-15-corrections' },
        ' (NEC Table 310.15(C)(1))',
      ]);
    }
    steps.push([
      'The corrections start from the ',
      { v: start, unit: '°C', src: CALC },
      ' column',
      ...(start === minimum.columnC ? [] : [' (conductors rated ', { v: start, unit: '°C', src: CALC } as ValuePart, ')']),
      ': ',
      ...(corrections.length === 0 ? ['no factor applies'] : corrections.flatMap((c, k) => (k === 0 ? c : [' and ', ...c]))),
      '.',
    ]);
    steps.push([
      `Smallest ${metal} size whose corrected ampacity, held to its `,
      { v: minimum.columnC, unit: '°C', src: CALC },
      ' value, is at least ',
      rating,
      ': ',
      { size: minimum.firstSize },
      ' (',
      amps(Math.min(derated, capA), CALC),
      ').',
    ]);
  }
  for (const limit of minimum.limits240_4D) {
    const limitText: TextPart[] = ['NEC 240.4(D) limits ', { size: limit.size }, ` ${metal} to `, amps(limit.maxOcpdA, CALC)];
    steps.push(
      limit.movedTo === null
        ? [...limitText, ' overcurrent protection; ', rating, ' is within that limit.']
        : [...limitText, ' overcurrent protection, so the size moves up to ', { size: limit.movedTo }, '.'],
    );
  }
  steps.push(egcStepParts([`Ground wire for ${indefiniteArticle(ocpdA)} `, rating, ' breaker or fuse,'], minimum, material));
  steps.push([
    'Voltage drop with ',
    { size: minimum.size },
    ` ${metal} at `,
    amps(loadA, 'input'),
    ' over ',
    { v: lengthFt, unit: 'ft', src: 'input' },
    ` one way, ${phase === 'three' ? 'three-phase' : 'single-phase'} `,
    { v: volts, unit: 'V', src: 'input' },
    ' (',
    { v: atMinimum.ohmsPer1000ft, unit: 'Ω', src: CALC },
    ' per 1000 ft at ',
    { v: RESISTANCE_TEMP_C, unit: '°C', src: CALC },
    '): ',
    ...drop(atMinimum),
    '.',
  ]);
  if (steppedUp) {
    const { size, result: vd } = steppedUp;
    steps.push(
      vd.vdPct <= target
        ? ['Above your ', yourTarget, ' target, so the size steps up to ', { size }, ': ', ...drop(vd), '.']
        : ['Even ', { size }, ', the largest size in NEC Table 310.16, gives ', ...drop(vd), ', above your ', yourTarget, ' target.'],
    );
  }
  if (steppedUp && proportional) {
    const formula: TextPart[] = [
      'Ground wire increased in proportion to the larger conductors (NEC 250.122(B)): ',
      cmil(areaCmil(baseEgc)),
      ' × ',
      cmil(areaCmil(steppedUp.size)),
      ' ÷ ',
      cmil(areaCmil(minimum.size)),
      ' = ',
      cmil(proportional.requiredCmil),
    ];
    steps.push(proportional.egc ? [...formula, ', so ', { size: proportional.egc }, '.'] : [...formula, `. ${EGC_NONE_MESSAGE}`]);
  }
  return steps;
}

export function sizeConductor(input: SizeConductorInput): SizeConductorResult | SizeConductorError {
  const { ocpdA, lengthFt, volts, phase, material } = input;
  const loadA = input.loadA ?? ocpdA;
  const target = input.vdTargetPct ?? DEFAULT_VD_TARGET_PCT;

  if (!STANDARD_RATINGS.includes(ocpdA)) return { error: 'rating-not-standard' };
  if (ocpdA < RATING_MIN_A || ocpdA > RATING_MAX_A) return { error: 'rating-out-of-range' };
  if (!(loadA >= 0 && loadA <= ocpdA)) return { error: 'load-above-rating' };
  if (input.continuous && input.loadA !== null && input.loadA !== undefined && ocpdA < (input.loadA * CONTINUOUS_LOAD_PERCENT) / 100) {
    return { error: 'rating-below-continuous' };
  }
  if (!(lengthFt >= LENGTH_MIN_FT && lengthFt <= LENGTH_MAX_FT)) return { error: 'length-out-of-range' };
  if (!(target >= VD_TARGET_MIN_PCT && target <= VD_TARGET_MAX_PCT)) return { error: 'vd-target-out-of-range' };
  if (!voltsValid(volts, phase)) return { error: 'voltage-invalid' };

  if (input.ambientRow && correction(input.ambientRow, `f_${startColumn(input.wiringMethod ?? 'cable')}` as CorrectionColumn) === null) {
    return { error: 'ambient-no-factor' };
  }

  // Steps 1 to 3
  const minimum = minimumConductor(input);
  if (!minimum) {
    if (input.ambientRow) return { error: 'no-size' };
    throw new Error(`No ${materialName(material)} size in NEC Table 310.16 carries ${ocpdA} A`);
  }
  const step2 = minimum.size;
  const baseEgc = minimum.egc as SizeKey;

  // Step 4: voltage drop at the load current
  const circuit = { material, amps: loadA, lengthFt, volts, phase };
  const atMinimum = voltageDrop({ ...circuit, size: step2 });
  if (!atMinimum) throw new Error(`No resistance for ${step2} ${materialName(material)}`);

  // Step 5: step up until the drop meets the target or 2000 kcmil
  const steppedUp = atMinimum.vdPct > target ? sizeForDrop({ ...circuit, size: step2 }, target) : null;
  const size = steppedUp ? steppedUp.size : step2;
  const vd = steppedUp ? steppedUp.result : atMinimum;

  // Step 6: proportional EGC when step 5 upsized
  const proportional = size !== step2 ? egcProportional(baseEgc, step2, size) : null;
  const grown = proportional ? proportional.egc : baseEgc;
  // never larger than the chosen conductors (250.122(A)); the area ratio can only reach that size
  const egc = grown !== null && areaCmil(grown) > areaCmil(size) ? size : grown;
  const egcUpsized = egc === null || areaCmil(egc) > areaCmil(baseEgc);
  const egcLargerThanConductor = egc === null || areaCmil(egc) > areaCmil(size);
  const stepParts = explain(input, loadA, target, minimum, atMinimum, steppedUp, proportional ? { ...proportional, egc } : null);
  // 240.4(B): only for the size the rating needs, and only when the entered load fits the smaller size (210.19(A))
  const below = size === step2 ? minimum.below : null;
  const neededA = input.loadA === null || input.loadA === undefined ? 0 : input.continuous ? (input.loadA * CONTINUOUS_LOAD_PERCENT) / 100 : input.loadA;
  const nextSizeUp =
    below && neededA <= below.ampacity
      ? { ...below, maxLoadA: below.ampacity, maxContinuousA: (below.ampacity * 100) / CONTINUOUS_LOAD_PERCENT }
      : null;

  return {
    size,
    ampacity60: table31016(size, columnKey(material, 60)) as number,
    columnC: minimum.columnC,
    ampacity: table31016(size, columnKey(material, minimum.columnC)) as number,
    limitedBy240_4D: minimum.limitedBy240_4D,
    startColumnC: minimum.startColumnC,
    deratedAmpacity: minimum.deratedAmpacity,
    minSizeByAmpacity: step2,
    minAmpacity: minimum.deratedAmpacity ?? (table31016(step2, columnKey(material, minimum.columnC)) as number),
    vdVolts: vd.vdVolts,
    vdPct: vd.vdPct,
    meetsTarget: vd.vdPct <= target,
    egc,
    egcUpsized,
    egcLargerThanConductor,
    egcCapped: minimum.egcCapped,
    nextSizeUp,
    steps: stepParts.map((parts) => partsText(parts, formatSize)),
    stepParts,
  };
}
