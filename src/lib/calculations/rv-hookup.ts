// The RV hookup calculator (WSZ-011b). Two jobs:
// - One RV outlet at a house: a TT-30R (30 A, 125 V) or a 14-50R (50 A, 125/250 V) circuit sized by the wire size
//   engine (sizeConductor: Table 310.16 in the column 110.14(C) allows, NM or UF cable at 60 °C, 240.4(D), Table
//   250.122, the voltage drop at the length and the reader's target, 250.122(B) when the drop moves the size up), at
//   120 V for the TT-30R and 240 V for the 14-50R; GFCI under 210.8(F) for an outdoor outlet at a dwelling.
// - An RV park feeder or service: 551.73(A)'s per-site loads times the Table 551.73(A) demand factor for the number of
//   sites, as current at 120/240 V single-phase and 208Y/120 V three-phase, and the 551.71 receptacle shares.
// Pure; no estimates. Tent sites, other park buildings and two-vehicle supplies are not asked for (the page says so).
import { isSizingError, sizeConductor, SIZING_ERROR_MESSAGES } from './conductor-sizing';
import type { SizeConductorResult, Termination, WiringMethod } from './conductor-sizing';
import { SQRT3 } from './power';
import type { TextPart } from './format';
import { partsText } from './format';
import { formatSize } from '../verified/awg';
import type { Material } from '../verified/awg';
import { OUTDOOR_GFCI } from '../verified/nec-210-8-f';
import { NEC_551_DOMAIN, RECEPTACLE_SHARES, SITE_VA, demandFactor } from '../verified/nec-551';
import { nemaConfig } from '../verified/nema-receptacle-configs';

export const ENGINE_ID = 'rv-hookup';
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
  'nec-2023-rule-excerpts',
  'nema-receptacle-configs',
  NEC_551_DOMAIN,
];
export const RV_CALC = `calc:${ENGINE_ID}`;
const RV = NEC_551_DOMAIN;

/** The two RV receptacles: the circuit breaker and the voltage the drop is figured at. */
export const RV_OUTLETS = {
  tt30: { config: 'TT-30R', breakerA: 30, volts: 120 },
  '1450': { config: '14-50R', breakerA: 50, volts: 240 },
} as const;
export type RvOutlet = keyof typeof RV_OUTLETS;
for (const o of Object.values(RV_OUTLETS)) {
  if (nemaConfig(o.config).amps !== o.breakerA) throw new Error(`rv-hookup: ${o.config} is not a ${o.breakerA} A configuration`);
}

export interface RvOutletInput {
  outlet: RvOutlet;
  material: Material;
  wiringMethod: WiringMethod;
  termination: Termination;
  lengthFt: number;
  vdTargetPct: number;
}

export interface RvOutletRun {
  outlet: (typeof RV_OUTLETS)[RvOutlet];
  feeder: SizeConductorResult;
  /** 210.8(F): an outdoor outlet at a dwelling on this circuit needs GFCI protection. */
  gfciAtHouse: boolean;
  stepParts: TextPart[][];
  steps: string[];
}

export function rvOutlet(input: RvOutletInput): RvOutletRun | { error: string } {
  const outlet = RV_OUTLETS[input.outlet];
  const feeder = sizeConductor({
    ocpdA: outlet.breakerA,
    material: input.material,
    wiringMethod: input.wiringMethod,
    termination: input.termination,
    loadA: null,
    continuous: false,
    lengthFt: input.lengthFt,
    volts: outlet.volts,
    phase: 'single',
    vdTargetPct: input.vdTargetPct,
  });
  if (isSizingError(feeder)) return { error: SIZING_ERROR_MESSAGES[feeder.error] };
  // a 120 V or 120/240 V circuit is 120 V to ground
  const gfciAtHouse = outlet.breakerA <= OUTDOOR_GFCI.maxA;
  const config = nemaConfig(outlet.config);
  const steps: TextPart[][] = [
    [
      `A ${outlet.config} receptacle is rated `,
      { v: config.amps, unit: 'A', src: 'nema-receptacle-configs' },
      `, ${config.volts} V, ${config.poles}-pole ${config.wires}-wire grounding; the circuit is sized for a `,
      { v: outlet.breakerA, unit: 'A', src: 'nema-receptacle-configs' },
      " breaker, the receptacle's rating.",
    ],
    ...feeder.stepParts,
  ];
  if (gfciAtHouse) {
    steps.push([
      'Outdoors at a house, an outlet on a single-phase circuit of up to ',
      { v: OUTDOOR_GFCI.maxA, unit: 'A', src: 'nec-2023-rule-excerpts' },
      ' and ',
      { v: OUTDOOR_GFCI.maxVoltsToGround, unit: 'V', src: 'nec-2023-rule-excerpts' },
      ' to ground needs GFCI protection (NEC 210.8(F)). At an RV park site, 551.71(F) asks for GFCI only on the 125 V, 15 A and 20 A receptacles.',
    ]);
  }
  return { outlet, feeder, gfciAtHouse, stepParts: steps, steps: steps.map((p) => partsText(p, formatSize)) };
}

/** Input limit: sites of each kind. */
export const RV_SITES_MAX = 500;

export interface RvParkInput {
  /** Sites with 50 A, 120/240 V or 208Y/120 V supply. */
  sites50: number;
  /** Sites with both 20 A and 30 A supply (and no 50 A). */
  sites30: number;
  /** Sites with only 20 A supply (not tent sites). */
  sites20: number;
  /** A new park (551.71(C) asks 40 % of new sites for 50 A, 20 % of existing). */
  newPark: boolean;
}

export interface RvParkLine {
  kind: 'site50' | 'site30' | 'site20';
  what: string;
  sites: number;
  siteVa: number;
  va: number;
}

export interface RvParkRun {
  lines: RvParkLine[];
  sites: number;
  connectedVa: number;
  demandPct: number;
  demandVa: number;
  /** The calculated load as current: 120/240 V single-phase, and 208Y/120 V three-phase. */
  amps240: number;
  amps208: number;
  /** 551.71: share of sites with a 30 A receptacle (50 A sites have one too), and with a 50 A receptacle, percent. */
  share30Pct: number;
  share50Pct: number;
  min50Pct: number;
  meets30: boolean;
  meets50: boolean;
  stepParts: TextPart[][];
  steps: string[];
}

export function rvPark(input: RvParkInput): RvParkRun | { error: string } {
  const counts = [input.sites50, input.sites30, input.sites20];
  if (!counts.every((n) => Number.isInteger(n) && n >= 0 && n <= RV_SITES_MAX)) return { error: `Enter whole numbers of sites, up to ${RV_SITES_MAX} of a kind.` };
  const sites = counts.reduce((a, b) => a + b, 0);
  const pct = demandFactor(sites);
  if (pct === null) return { error: 'Enter at least one site.' };
  const lines: RvParkLine[] = (
    [
      { kind: 'site50', what: 'Sites with 50 A supply', sites: input.sites50, siteVa: SITE_VA.site50 },
      { kind: 'site30', what: 'Sites with 20 A and 30 A supply', sites: input.sites30, siteVa: SITE_VA.site30 },
      { kind: 'site20', what: 'Sites with only 20 A supply', sites: input.sites20, siteVa: SITE_VA.site20 },
    ] as const
  )
    .filter((l) => l.sites > 0)
    .map((l) => ({ ...l, va: l.sites * l.siteVa }));
  const connectedVa = lines.reduce((s, l) => s + l.va, 0);
  const demandVa = (connectedVa * pct) / 100;
  const amps240 = demandVa / 240;
  const amps208 = demandVa / (SQRT3 * 208);
  const share30Pct = ((input.sites50 + input.sites30) / sites) * 100;
  const share50Pct = (input.sites50 / sites) * 100;
  const min50Pct = input.newPark ? RECEPTACLE_SHARES.min50PctNew : RECEPTACLE_SHARES.min50PctExisting;
  const steps: TextPart[][] = lines.map((l) => [
    `${l.what}: `,
    { n: l.sites, src: 'input' },
    '\u00a0×\u00a0', // a product keeps to one line
    { v: l.siteVa, unit: 'VA', src: RV },
    ' = ',
    { v: l.va, unit: 'VA', src: RV_CALC },
    ' (NEC 551.73(A)).',
  ]);
  steps.push([
    'Demand factor for ',
    { n: sites, src: 'input' },
    ' sites, Table 551.73(A): ',
    { v: pct, unit: '%', src: RV },
    ', applied to all of them (551.73(B)): ',
    { v: connectedVa, unit: 'VA', src: RV_CALC },
    '\u00a0×\u00a0', // a product keeps to one line
    { v: pct, unit: '%', src: RV },
    ' = ',
    { v: demandVa, unit: 'VA', src: RV_CALC, format: { upTo: 1 } },
    '.',
  ]);
  steps.push([
    'As current: ',
    { v: amps240, unit: 'A', src: RV_CALC, format: { fixed: 1 } },
    ' at ',
    { v: 240, unit: 'V', src: RV },
    ' single-phase (VA ÷ 240), or ',
    { v: amps208, unit: 'A', src: RV_CALC, format: { fixed: 1 } },
    ' at ',
    { v: 208, unit: 'V', src: RV },
    ' three-phase (VA ÷ (√3 × 208)).',
  ]);
  steps.push([
    'Receptacles (551.71): ',
    { v: share30Pct, unit: '%', src: RV_CALC, format: { upTo: 1 } },
    ' of sites have a 30 A receptacle (at least ',
    { v: RECEPTACLE_SHARES.min30Pct, unit: '%', src: RV },
    '), and ',
    { v: share50Pct, unit: '%', src: RV_CALC, format: { upTo: 1 } },
    ` a 50 A receptacle (at least `,
    { v: min50Pct, unit: '%', src: RV },
    ` for ${input.newPark ? 'new' : 'existing'} sites).`,
  ]);
  return {
    lines,
    sites,
    connectedVa,
    demandPct: pct,
    demandVa,
    amps240,
    amps208,
    share30Pct,
    share50Pct,
    min50Pct,
    meets30: share30Pct >= RECEPTACLE_SHARES.min30Pct - 1e-9,
    meets50: share50Pct >= min50Pct - 1e-9,
    stepParts: steps,
    steps: steps.map((p) => partsText(p, formatSize)),
  };
}

export const RV_HOOKUP = { ENGINE_ID, DOMAINS };
