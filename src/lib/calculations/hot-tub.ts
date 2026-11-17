// The hot tub calculator (WSZ-011d): the copper circuit for the breaker a hot tub's manual asks for, sized by the
// wire size engine (sizeConductor: Table 310.16 in the column 110.14(C) allows, NM or UF cable at 60 °C, 240.4(D),
// Table 250.122, the voltage drop at the length and the reader's target, 250.122(B) when the drop moves the size up)
// at 240 V (four wires: two hots, a neutral, a ground) or 120 V (three wires). Copper only, as every reviewed maker
// asks (data/verified/mfr-spas.json). GFCI and the disconnect are the makers' requirements; no NEC Article 680 rule is
// applied (nec-680-pools-spas is a GAP).
import { isSizingError, sizeConductor, SIZING_ERROR_MESSAGES } from './conductor-sizing';
import type { SizeConductorResult, Termination, WiringMethod } from './conductor-sizing';
import type { TextPart } from './format';
import { partsText } from './format';
import { formatSize } from '../verified/awg';
import { MFR_SPAS_DOMAIN } from '../verified/mfr-spas';

export const ENGINE_ID = 'hot-tub';
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
  MFR_SPAS_DOMAIN,
];
export const HT_CALC = `calc:${ENGINE_ID}`;

/** The breakers the calculator offers: 240 V spas 30 to 60 A, 120 V spas 15 and 20 A. */
export const HT_BREAKERS: Record<240 | 120, number[]> = { 240: [30, 40, 50, 60], 120: [15, 20] };

export interface HotTubInput {
  volts: 240 | 120;
  breakerA: number;
  wiringMethod: WiringMethod;
  termination: Termination;
  lengthFt: number;
  vdTargetPct: number;
}

export interface HotTubRun {
  input: HotTubInput;
  feeder: SizeConductorResult;
  /** Four wires at 240 V (two hots, neutral, ground), three at 120 V. */
  wires: 4 | 3;
  stepParts: TextPart[][];
  steps: string[];
}

export function hotTub(input: HotTubInput): HotTubRun | { error: string } {
  if (!HT_BREAKERS[input.volts]?.includes(input.breakerA)) return { error: 'Pick the breaker size from the hot tub’s manual.' };
  const feeder = sizeConductor({
    ocpdA: input.breakerA,
    material: 'Cu',
    wiringMethod: input.wiringMethod,
    termination: input.termination,
    loadA: null,
    continuous: false,
    lengthFt: input.lengthFt,
    volts: input.volts,
    phase: 'single',
    vdTargetPct: input.vdTargetPct,
  });
  if (isSizingError(feeder)) return { error: SIZING_ERROR_MESSAGES[feeder.error] };
  const wires = input.volts === 240 ? 4 : 3;
  const steps: TextPart[][] = [
    [
      'The circuit is sized for the ',
      { v: input.breakerA, unit: 'A', src: 'input' },
      ' breaker the hot tub’s manual asks for, in copper: every reviewed maker rules out aluminum.',
    ],
    ...feeder.stepParts,
    [
      wires === 4
        ? 'Four wires: two hots, a neutral and a ground, as the makers ask for 240 V hot tubs.'
        : 'Three wires: a hot, a neutral and a ground.',
    ],
    ['GFCI protection: every reviewed maker asks for it (a GFCI breaker, a GFCI subpanel or the cord’s own GFCI).'],
  ];
  return { input, feeder, wires, stepParts: steps, steps: steps.map((p) => partsText(p, formatSize)) };
}

export const HOT_TUB = { ENGINE_ID, DOMAINS };
