// The dryer calculator (WSZ-010c): the two numbers an electric clothes dryer carries. For a feeder or service, NEC 2023
// 220.54 counts each dryer at the larger of 5000 W and its nameplate, and Table 220.54 lowers the total for five or
// more dryers. Its own branch circuit is the rating the dryer's instructions give; the calculator sizes the wire and
// ground wire for that rating as the wire size calculator does (minimumConductor) and never picks the rating.
import { dryerDemandPct, dryerLoadW } from './load-calc-2023';
import { egcStepParts, minimumConductor } from './conductor-sizing';
import type { Termination, WiringMethod } from './conductor-sizing';
import { indefiniteArticle, materialName, partsText } from './format';
import type { TextPart, ValuePart } from './format';
import { STANDARD_METHOD } from '../verified/nec-220-2023';
import { columnKey, table31016 } from '../verified/nec-310-16';
import type { AmpacityColumn } from '../verified/nec-310-16';
import { ocpdRatings } from '../verified/nec-240-6-a';
import { areaCmil, formatSize } from '../verified/awg';
import type { Material, SizeKey } from '../verified/awg';

export const ENGINE_ID = 'dryer-circuit';
export const DOMAINS = ['nec-220-load-calcs', 'nec-310-16', 'nec-110-14c', 'nec-240-4-d', 'nec-250-grounding', 'nec-240-ocpd'];

/** The circuit ratings the calculator offers: the standard ratings of Table 240.6(A) from 20 A to 50 A. */
export const DRYER_CIRCUITS: number[] = ocpdRatings().filter((a) => a >= 20 && a <= 50);
export const DRYER_VOLTS = [240, 208] as const;
export type DryerVolts = (typeof DRYER_VOLTS)[number];
/** The most dryers the calculator takes on one feeder. */
export const DRYERS_MAX = 100;

export interface DryerRunInput {
  nameplateW: number;
  dryers: number;
  volts: DryerVolts;
  circuitA: number;
  material: Material;
  wiringMethod: WiringMethod;
  termination: Termination;
}

export interface DryerRun {
  /** 220.54: one dryer's load for a feeder or service. */
  perDryerW: number;
  /** Table 220.54's percent for the number of dryers. */
  demandPct: number;
  /** The dryers' load on the feeder or service after Table 220.54. */
  feederW: number;
  feederAmps: number;
  circuitA: number;
  columnC: AmpacityColumn;
  size: SizeKey;
  ampacity: number;
  limitedBy240_4D: boolean;
  egc: SizeKey | null;
  /** 250.122(A) held the ground wire at the wire's size (Table 250.122 lists a larger one for the rating). */
  egcCapped: boolean;
  steps: string[];
  stepParts: TextPart[][];
}

export type DryerError = 'nameplate-invalid' | 'dryers-invalid' | 'circuit-invalid';

const L = 'nec-220-load-calcs';
const CALC = `calc:${ENGINE_ID}`;
const w = (v: number, src: string): ValuePart => ({ v, unit: 'W', src, format: Number.isInteger(v) ? undefined : { upTo: 1 } });
const amps = (v: number, src: string): ValuePart => ({ v, unit: 'A', src, format: Number.isInteger(v) ? undefined : { upTo: 2 } });

export function dryerRun(input: DryerRunInput): DryerRun | { error: DryerError } {
  if (!(Number.isFinite(input.nameplateW) && input.nameplateW > 0)) return { error: 'nameplate-invalid' };
  if (!(Number.isInteger(input.dryers) && input.dryers >= 1 && input.dryers <= DRYERS_MAX)) return { error: 'dryers-invalid' };
  if (!DRYER_CIRCUITS.includes(input.circuitA)) return { error: 'circuit-invalid' };
  const perDryerW = dryerLoadW(input.nameplateW);
  const demandPct = dryerDemandPct(input.dryers) as number;
  const feederW = (input.dryers * perDryerW * demandPct) / 100;
  const feederAmps = feederW / input.volts;
  const steps: TextPart[][] = [];
  steps.push(['220.54: each dryer counts at the larger of ', w(STANDARD_METHOD.dryerMinW, L), ' and its ', w(input.nameplateW, 'input'), ' nameplate: ', w(perDryerW, CALC), '.']);
  if (input.dryers === 1) {
    steps.push(['Table 220.54 keeps one dryer at ', { v: demandPct, unit: '%', src: L }, ': ', w(feederW, CALC), '.']);
  } else {
    steps.push([
      'Table 220.54 takes ',
      { n: input.dryers, src: 'input' },
      ' dryers at ',
      { v: demandPct, unit: '%', src: L, format: Number.isInteger(demandPct) ? undefined : { upTo: 1 } },
      ': ',
      { n: input.dryers, src: 'input' },
      ' × ',
      w(perDryerW, CALC),
      ' × ',
      { v: demandPct, unit: '%', src: L, format: Number.isInteger(demandPct) ? undefined : { upTo: 1 } },
      ' = ',
      w(feederW, CALC),
      '.',
    ]);
  }
  steps.push(['On the feeder or service: ', w(feederW, CALC), ' ÷ ', { v: input.volts, unit: 'V', src: 'input' }, ' = ', amps(feederAmps, CALC), '.']);
  const m = minimumConductor({ ocpdA: input.circuitA, material: input.material, wiringMethod: input.wiringMethod, termination: input.termination });
  if (!m) throw new Error(`dryerRun: no ${materialName(input.material)} size carries ${input.circuitA} A`);
  const metal = materialName(input.material);
  const col = columnKey(input.material, m.columnC);
  steps.push([
    'Each dryer has its own circuit, rated as its instructions give: ',
    amps(input.circuitA, 'input'),
    `. Smallest ${metal} size with a `,
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
    steps.push(egcStepParts([`Ground wire for ${indefiniteArticle(input.circuitA)} `, amps(input.circuitA, 'input'), ' circuit,'], m, input.material));
  }
  return {
    perDryerW,
    demandPct,
    feederW,
    feederAmps,
    circuitA: input.circuitA,
    columnC: m.columnC,
    size: m.size,
    ampacity: table31016(m.size, col) as number,
    limitedBy240_4D: m.limitedBy240_4D,
    egc: m.egc,
    egcCapped: m.egcCapped,
    steps: steps.map((parts) => partsText(parts, formatSize)),
    stepParts: steps,
  };
}

export function isDryerError(r: DryerRun | { error: DryerError }): r is { error: DryerError } {
  return 'error' in r;
}

/** Table 220.54 as the calculator reads it: each printed band's first and last count (null: no end), its percent and,
 *  for the sliding bands, the percent less for each dryer over a count. */
export function dryerTableRows(): { from: number; to: number | null; pct: number; lessPct: number; over: number }[] {
  return STANDARD_METHOD.dryerRows.map((row) => ({
    from: row.minCount,
    to: Number.isFinite(row.maxCount) ? row.maxCount : null,
    pct: row.basePct,
    lessPct: row.lessPctPerDryer,
    over: row.over,
  }));
}
