// The garage subpanel calculator (WSZ-008f): a feeder from the house panel to a subpanel in a detached garage or other
// separate building. The conductors are the wire size calculator's (sizeConductor: Table 310.16 in the column 110.14(C)
// allows, NM or UF cable kept at 60 °C, 240.4(D), Table 250.122, the voltage drop at the length and the 215.2(A) note's
// target, 250.122(B) when the drop moves the size up). On top of them: the four wires 250.32(B)(1) sets for a feeder to
// a separate building, the 225.39 floor for the building's own disconnect, and the minimum cover from Table 300.5(A)
// for the wiring method and the place the run is buried. The calculator never picks the feeder's rating: the reader's
// load calculation does (Article 220), and the residential load calculator links from the page.
import { isSizingError, sizeConductor, WIRE_SIZE_RATINGS, SIZING_ERROR_MESSAGES } from './conductor-sizing';
import type { SizeConductorResult, Termination, WiringMethod } from './conductor-sizing';
import type { TextPart } from './format';
import { partsText } from './format';
import { formatSize } from '../verified/awg';
import type { Material } from '../verified/awg';
import { DISCONNECT_MIN_A } from '../verified/nec-separate-buildings';
import { BURIAL_METHODS, BURIAL_PLACES, burialCover } from '../verified/nec-300-5';
import type { BurialMethod, BurialPlace, Cover } from '../verified/nec-300-5';

export const ENGINE_ID = 'garage-subpanel';
export const DOMAINS = [
  'nec-310-16',
  'nec-240-4-d',
  'nec-240-ocpd',
  'nec-250-grounding',
  'conductor-resistance-20c',
  'awg-geometry',
  'nec-110-14c',
  'nec-310-15-corrections',
  'nec-continuous-load',
  'nec-feeders-outbuildings',
  'nec-250-32',
  'nec-300-5-burial',
  'nec-220-load-calcs',
];
const CALC = `calc:${ENGINE_ID}`;

/** The feeder ratings the calculator offers: Table 240.6(A)'s standard ratings from 30 A to 200 A. */
export const GARAGE_RATINGS: number[] = WIRE_SIZE_RATINGS.filter((a) => a >= 30 && a <= 200);
export const GARAGE_VOLTS = [240, 208] as const;
export type GarageVolts = (typeof GARAGE_VOLTS)[number];
/** 'none': the run is not buried (overhead, or inside), so no cover applies. */
export type GarageBurial = BurialMethod | 'none';

export interface GarageInput {
  feederA: number;
  material: Material;
  wiringMethod: WiringMethod;
  termination: Termination;
  /** The garage's calculated load (Article 220), or null. */
  loadA: number | null;
  lengthFt: number;
  volts: GarageVolts;
  vdTargetPct: number;
  burial: GarageBurial;
  place: BurialPlace;
}

export interface GarageRun {
  feeder: SizeConductorResult;
  /** 250.32(B)(1): two ungrounded conductors, the neutral and an equipment grounding conductor. */
  wires: 4;
  /** 225.39: the garage's disconnecting means is rated at least this, A. */
  disconnectMinA: number;
  /** Table 300.5(A), or null when the run is not buried. */
  cover: Cover | null;
  stepParts: TextPart[][];
  steps: string[];
}

export type GarageError = { error: string };

export function isGarageError(r: GarageRun | GarageError): r is GarageError {
  return 'error' in r;
}

export function garageRun(input: GarageInput): GarageRun | GarageError {
  if (!GARAGE_RATINGS.includes(input.feederA)) return { error: 'Choose a feeder rating from 30 A to 200 A.' };
  if (!(GARAGE_VOLTS as readonly number[]).includes(input.volts)) return { error: 'Choose 240 V or 208 V.' };
  const feeder = sizeConductor({
    ocpdA: input.feederA,
    material: input.material,
    wiringMethod: input.wiringMethod,
    termination: input.wiringMethod === 'cable' ? 'unknown' : input.termination,
    loadA: input.loadA,
    continuous: false,
    lengthFt: input.lengthFt,
    volts: input.volts,
    phase: 'single',
    vdTargetPct: input.vdTargetPct,
  });
  if (isSizingError(feeder)) return { error: SIZING_ERROR_MESSAGES[feeder.error] };

  const cover = input.burial === 'none' ? null : burialCover(input.burial, input.place);
  const steps: TextPart[][] = [...feeder.stepParts];
  if (feeder.nextSizeUp && input.loadA !== null) {
    steps.push([
      'With a calculated load of ',
      { v: input.loadA, unit: 'A', src: 'input' },
      ', the next size down, ',
      { size: feeder.nextSizeUp.size },
      ' at ',
      { v: feeder.nextSizeUp.ampacity, unit: 'A', src: CALC },
      ', may also be used: that ampacity is not a standard rating, and NEC 240.4(B) lets the next standard rating, ',
      { v: input.feederA, unit: 'A', src: 'input' },
      ', protect it.',
    ]);
  }
  steps.push([
    'A feeder to a separate building runs four wires: the two hots, the neutral and the equipment grounding conductor (NEC 250.32(B)(1)). The neutral carries the largest load between it and either hot (NEC 220.61), so the hots\' size always carries it; at the garage it is not connected to the ground wire or the electrode.',
  ]);
  steps.push([
    "The garage's own disconnecting means is rated at least the calculated load and never less than ",
    { v: DISCONNECT_MIN_A.allOthers, unit: 'A', src: 'nec-feeders-outbuildings' },
    ', or ',
    { v: DISCONNECT_MIN_A.twoCircuits, unit: 'A', src: 'nec-feeders-outbuildings' },
    ' where the garage has no more than two 2-wire branch circuits (NEC 225.39). It sits at a readily accessible place nearest where the feeder enters (225.31).',
  ]);
  if (cover) {
    const method = BURIAL_METHODS.find((m) => m.id === input.burial)?.label.toLowerCase();
    const place = BURIAL_PLACES.find((p) => p.id === input.place)?.short;
    steps.push([
      `Minimum cover for ${method} ${place}: `,
      { v: cover.inches, unit: 'in', src: 'nec-300-5-burial' },
      ' (',
      { v: cover.mm, unit: 'mm', src: 'nec-300-5-burial' },
      '), NEC Table 300.5(A), measured from the top of the cable or conduit to finished grade.',
    ]);
  }
  return {
    feeder,
    wires: 4,
    disconnectMinA: DISCONNECT_MIN_A.allOthers,
    cover,
    stepParts: steps,
    steps: steps.map((parts) => partsText(parts, formatSize)),
  };
}

/** The engine's own value source, for the page's data-src. */
export const GARAGE_CALC = CALC;
