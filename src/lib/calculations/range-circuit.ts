// The range calculator (WSZ-010b): the branch-circuit load of household cooking appliances by NEC 2023 Table 220.55
// and its notes (one range by the table, with Note 1 above 12 kW; one wall-mounted oven or one counter-mounted cooking
// unit at its nameplate; a counter-mounted cooking unit with not more than two wall-mounted ovens, on one branch
// circuit in one room, added and treated as one range), its current at 240 or 208 V, and the wire and ground wire for
// the circuit rating the appliance's instructions give (minimumConductor, as the wire size calculator sizes them).
// The engine never picks the circuit: the 210.19 household-range rule (8¾ kW, 40 A) is unverified, so range pages size
// from Table 220.55 and the maker's stated circuit (nec-continuous-load-2023.json notes). The notes of Table 220.55
// after Note 3 are cited without a number (their numbers were inferred, nec-220-2023.json notes).
import { cooktopAndOvensBranchLoad, note1Steps, rangeDemandKw, singleUnitBranchLoadKw } from './load-calc-2023';
import { minimumConductor } from './conductor-sizing';
import type { Termination, WiringMethod } from './conductor-sizing';
import { indefiniteArticle, materialName, partsText } from './format';
import type { TextPart, ValuePart } from './format';
import { TABLE_220_55, cookingRow } from '../verified/nec-220-2023';
import type { CookingRow } from '../verified/nec-220-2023';
import { columnKey, table31016 } from '../verified/nec-310-16';
import type { AmpacityColumn } from '../verified/nec-310-16';
import { ocpdRatings } from '../verified/nec-240-6-a';
import { areaCmil, formatSize } from '../verified/awg';
import type { Material, SizeKey } from '../verified/awg';

export const ENGINE_ID = 'range-circuit';
export const DOMAINS = ['nec-220-load-calcs', 'nec-310-16', 'nec-110-14c', 'nec-240-4-d', 'nec-250-grounding', 'nec-240-ocpd'];

/** One range; a counter-mounted cooking unit with up to two wall-mounted ovens on one circuit; one oven or one cooktop. */
export type CookingSetup = 'range' | 'combo' | 'single';
/** The two nominal supplies of household ranges: 120/240 V and 120/208 V (the Whirlpool table prints both). */
export const RANGE_VOLTS = [240, 208] as const;
export type RangeVolts = (typeof RANGE_VOLTS)[number];
/** The circuit ratings the calculator offers: the standard ratings of Table 240.6(A) from 20 A to 80 A. */
export const RANGE_CIRCUITS: number[] = ocpdRatings().filter((a) => a >= 20 && a <= 80);

export interface RangeRunInput {
  setup: CookingSetup;
  /** 'range': the range's nameplate kW; 'single': the oven's or cooktop's. */
  kw?: number;
  /** 'combo': the cooktop's nameplate kW and one or two ovens'. */
  cooktopKw?: number;
  ovensKw?: number[];
  volts: RangeVolts;
  /** The circuit rating the appliance's installation instructions give. */
  circuitA: number;
  material: Material;
  wiringMethod: WiringMethod;
  termination: Termination;
}

export interface RangeRun {
  /** The branch-circuit load in kW. */
  loadKw: number;
  /** 'combo': the added nameplates treated as one range; null otherwise. */
  equivalentRangeKw: number | null;
  amps: number;
  circuitA: number;
  /** The circuit rating reaches the calculated current. */
  circuitCarriesLoad: boolean;
  columnC: AmpacityColumn;
  size: SizeKey;
  ampacity: number;
  limitedBy240_4D: boolean;
  egc: SizeKey | null;
  egcLargerThanConductor: boolean;
  steps: string[];
  stepParts: TextPart[][];
}

export type RangeError = 'rating-invalid' | 'outside-table' | 'circuit-invalid';

export const RANGE_ERROR_MESSAGES: Record<RangeError, string> = {
  'rating-invalid': 'Enter each rating in kW, more than 0.',
  'outside-table': `Table 220.55 covers ranges over ${TABLE_220_55.minKw} kW up to ${TABLE_220_55.note1.maxKw} kW.`,
  'circuit-invalid': 'Choose a standard circuit rating.',
};

const L = 'nec-220-load-calcs';
const CALC = `calc:${ENGINE_ID}`;
const W_PER_KW = 1000;

const kw = (v: number, src: string): ValuePart => ({ v, unit: 'kW', src, format: Number.isInteger(v) ? undefined : { upTo: 2 } });
const amps = (v: number, src: string): ValuePart => ({ v, unit: 'A', src, format: Number.isInteger(v) ? undefined : { upTo: 2 } });

/** Table 220.55, Column C with Note 1, for one range of `ratingKw`, in sentence parts. */
function columnCStep(ratingKw: number, loadKw: number): TextPart[] {
  const { fromKw, pctPerKw } = TABLE_220_55.note1;
  const base = kw((cookingRow(1) as CookingRow).cBaseKw, L);
  if (ratingKw <= fromKw) return ['Table 220.55, Column C: one range of ', kw(fromKw, L), ' or less counts as ', base, '.'];
  const over = ratingKw - fromKw;
  return [
    'Table 220.55, Column C with Note 1: ',
    kw(ratingKw, 'input'),
    ' is ',
    kw(over, CALC),
    ' over ',
    kw(fromKw, L),
    ...(Number.isInteger(over) ? [] : [', which counts as ', kw(note1Steps(ratingKw), CALC)]),
    '; each kW, or major fraction of one, adds ',
    { v: pctPerKw, unit: '%', src: L } as ValuePart,
    ' to ',
    base,
    ': ',
    kw(loadKw, CALC),
    '.',
  ];
}

function validRating(v: number | undefined): v is number {
  return v !== undefined && Number.isFinite(v) && v > 0;
}

export function rangeRun(input: RangeRunInput): RangeRun | { error: RangeError } {
  if (!RANGE_CIRCUITS.includes(input.circuitA)) return { error: 'circuit-invalid' };
  const steps: TextPart[][] = [];
  let loadKw: number;
  let equivalentRangeKw: number | null = null;
  if (input.setup === 'single') {
    if (!validRating(input.kw)) return { error: 'rating-invalid' };
    loadKw = singleUnitBranchLoadKw(input.kw);
    steps.push(['A note to Table 220.55: one wall-mounted oven or one counter-mounted cooking unit counts at its nameplate rating, ', kw(loadKw, 'input'), '.']);
  } else if (input.setup === 'combo') {
    const ovens = input.ovensKw ?? [];
    if (!validRating(input.cooktopKw) || ovens.length === 0 || !ovens.every(validRating)) return { error: 'rating-invalid' };
    const combo = cooktopAndOvensBranchLoad(input.cooktopKw, ovens);
    if (!combo) return { error: 'outside-table' };
    equivalentRangeKw = combo.equivalentRangeKw;
    loadKw = combo.demandKw;
    steps.push([
      'A note to Table 220.55: a counter-mounted cooking unit and not more than two wall-mounted ovens, on one branch circuit in one room, are added and treated as one range: ',
      kw(input.cooktopKw, 'input'),
      ...ovens.flatMap((o) => [' + ', kw(o, 'input')]),
      ' = ',
      kw(equivalentRangeKw, CALC),
      '.',
    ]);
    steps.push(columnCStep(equivalentRangeKw, loadKw));
  } else {
    if (!validRating(input.kw)) return { error: 'rating-invalid' };
    const demand = rangeDemandKw(1, input.kw);
    if (demand === null) return { error: 'outside-table' };
    loadKw = demand;
    steps.push(columnCStep(input.kw, loadKw));
  }
  const current = (loadKw * W_PER_KW) / input.volts;
  steps.push([kw(loadKw, CALC), ' ÷ ', { v: input.volts, unit: 'V', src: 'input' }, ' = ', amps(current, CALC), '.']);
  const circuitCarriesLoad = input.circuitA >= current;
  steps.push(
    circuitCarriesLoad
      ? ['The ', amps(input.circuitA, 'input'), ' circuit the instructions give is at least that.']
      : ['The ', amps(input.circuitA, 'input'), ' circuit entered is below it: the circuit needs a larger rating.'],
  );
  const m = minimumConductor({ ocpdA: input.circuitA, material: input.material, wiringMethod: input.wiringMethod, termination: input.termination });
  if (!m) throw new Error(`rangeRun: no ${materialName(input.material)} size carries ${input.circuitA} A`);
  const metal = materialName(input.material);
  const col = columnKey(input.material, m.columnC);
  steps.push([
    `Smallest ${metal} size with a `,
    { v: m.columnC, unit: '°C', src: CALC },
    ' ampacity of at least ',
    amps(input.circuitA, 'input'),
    ' in NEC Table 310.16: ',
    { size: m.firstSize },
    ' (',
    amps(table31016(m.firstSize, col) as number, CALC),
    ').',
  ]);
  for (const limit of m.limits240_4D) {
    const text: TextPart[] = ['NEC 240.4(D) limits ', { size: limit.size }, ` ${metal} to `, amps(limit.maxOcpdA, CALC)];
    steps.push(
      limit.movedTo === null
        ? [...text, ' overcurrent protection; ', amps(input.circuitA, 'input'), ' is within that limit.']
        : [...text, ' overcurrent protection, so the size moves up to ', { size: limit.movedTo }, '.'],
    );
  }
  if (m.egc) {
    steps.push([
      `Ground wire for ${indefiniteArticle(input.circuitA)} `,
      amps(input.circuitA, 'input'),
      ` circuit, NEC Table 250.122 (${input.material === 'Cu' ? 'copper' : 'aluminum or copper-clad aluminum'} column): `,
      { size: m.egc },
      '.',
    ]);
  }
  return {
    loadKw,
    equivalentRangeKw,
    amps: current,
    circuitA: input.circuitA,
    circuitCarriesLoad,
    columnC: m.columnC,
    size: m.size,
    ampacity: table31016(m.size, col) as number,
    limitedBy240_4D: m.limitedBy240_4D,
    egc: m.egc,
    egcLargerThanConductor: m.egc !== null && areaCmil(m.egc) > areaCmil(m.size),
    steps: steps.map((parts) => partsText(parts, formatSize)),
    stepParts: steps,
  };
}

export function isRangeError(r: RangeRun | { error: RangeError }): r is { error: RangeError } {
  return 'error' in r;
}

/** Table 220.55 for one range of each whole kW from 12 kW to Note 1's 27 kW: its branch-circuit load and current. */
export function rangeDemandRows(): { ratingKw: number; loadKw: number; amps240: number; amps208: number }[] {
  const rows = [];
  for (let r = TABLE_220_55.note1.fromKw; r <= TABLE_220_55.note1.maxKw; r++) {
    const loadKw = rangeDemandKw(1, r) as number;
    rows.push({ ratingKw: r, loadKw, amps240: (loadKw * W_PER_KW) / 240, amps208: (loadKw * W_PER_KW) / 208 });
  }
  return rows;
}
