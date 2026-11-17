// The well pump calculator (WSZ-011c): cable size, fuses and breakers and the motor's amps for a Franklin Electric
// 4-inch single-phase submersible motor, from Franklin's AIM Manual (2026 edition; data/verified/mfr-well-pump.json):
// - the smallest copper size whose maximum length in the 75 °C cable table (5 % drop at maximum nameplate amps; × 0.6
//   for 3 %) covers the total cable from the service entrance to the motor, skipping shaded cells when the cable is
//   jacketed (shaded cells meet the NEC ampacity rules only as individual conductors);
// - the share of that size's maximum the run uses (Franklin's cable combination rule: shares of all sizes sum to ≤ 1);
// - aluminum two gauges larger than the copper size (Franklin's rule; none past 4/0 AWG);
// - Franklin's fuse and breaker table row: maximum per NEC and typical submersible sizes;
// - the motor's line amps at full load and at maximum service factor load (standard motors without the "G" suffix).
// Pure; Franklin's tables only. No NEC Article 430 rule is applied (nec-430-motors is a GAP).
import type { TextPart } from './format';
import { partsText } from './format';
import { formatSize } from '../verified/awg';
import type { SizeKey } from '../verified/awg';
import {
  CABLE_RULES,
  CABLE_SIZES,
  MFR_WELL_PUMP_DOMAIN,
  cableRow,
  fuseRow,
  hpValue,
  motorRow,
} from '../verified/mfr-well-pump';
import type { CableRow, FuseRow, MotorRow, PumpHp, PumpVolts, PumpWires } from '../verified/mfr-well-pump';

export const ENGINE_ID = 'well-pump';
export const DOMAINS = [MFR_WELL_PUMP_DOMAIN];
export const WP_CALC = `calc:${ENGINE_ID}`;
const MFR = MFR_WELL_PUMP_DOMAIN;

/** Input limit: total cable length, ft (Franklin's single-phase table tops out at 9,350 ft). */
export const WP_LENGTH_MAX = 10000;

/** The motors the calculator offers, as Franklin's single-phase tables list them. */
export const WP_MOTORS: { volts: PumpVolts; wires: PumpWires; hp: PumpHp }[] = [
  { volts: 115, wires: 2, hp: '1/2' },
  { volts: 115, wires: 3, hp: '1/2' },
  ...(['1/2', '3/4', '1', '1.5'] as const).map((hp) => ({ volts: 230 as const, wires: 2 as const, hp })),
  ...(['1/2', '3/4', '1', '1.5', '2', '3', '5'] as const).map((hp) => ({ volts: 230 as const, wires: 3 as const, hp })),
];
for (const m of WP_MOTORS) {
  if (!cableRow(m.volts, m.hp) || !fuseRow(m.wires, m.volts, m.hp) || !motorRow(m.wires, m.volts, m.hp)) {
    throw new Error(`well-pump: no Franklin rows for ${m.volts} V ${m.wires}-wire ${m.hp} hp`);
  }
}

export type CableKind = 'jacketed' | 'conductors';

export interface WellPumpInput {
  volts: PumpVolts;
  wires: PumpWires;
  hp: PumpHp;
  /** Total cable from the service entrance (or power supply) to the motor, ft. */
  lengthFt: number;
  /** Franklin's 5 % basis, or 3 % (the 5 % length × 0.6). */
  dropPct: 5 | 3;
  /** Jacketed 75 °C cable (flat, web or round jacketed) or individual conductors. */
  cable: CableKind;
}

export interface WellPumpRun {
  input: WellPumpInput;
  cableRow: CableRow;
  fuses: FuseRow;
  motor: MotorRow;
  /** Length factor for the drop: 1 at 5 %, 0.6 at 3 %. */
  factor: number;
  copper: SizeKey;
  /** Maximum length on that size at the chosen drop, ft. */
  copperMaxFt: number;
  /** The next smaller size and its maximum, when it exists and is too short (or shaded for jacketed cable). */
  smaller: { size: SizeKey; maxFt: number; shaded: boolean } | null;
  /** A smaller size long enough but shaded, skipped for jacketed cable. */
  skippedShaded: SizeKey | null;
  /** The run as a share of the copper size's maximum, percent. */
  sharePct: number;
  /** Two gauges larger than the copper size; null past 4/0 AWG. */
  aluminum: SizeKey | null;
  stepParts: TextPart[][];
  steps: string[];
}

/** AWG gauge number of a size key (1/0 = 0, 2/0 = −1, 3/0 = −2, 4/0 = −3). */
function gauge(key: SizeKey): number {
  const ought: Record<string, number> = { '1/0': 0, '2/0': -1, '3/0': -2, '4/0': -3 };
  return key in ought ? ought[key] : Number(key);
}
function keyOfGauge(n: number): SizeKey | null {
  if (n >= 1) return String(n);
  return ({ 0: '1/0', [-1]: '2/0', [-2]: '3/0', [-3]: '4/0' } as Record<number, string>)[n] ?? null;
}

/** Franklin's aluminum rule: two gauges larger than the copper size (#12 copper → #10 aluminum); null past 4/0 AWG. */
export function aluminumFor(copper: SizeKey): SizeKey | null {
  return keyOfGauge(gauge(copper) - CABLE_RULES.aluminumGaugesLarger);
}
if (aluminumFor(CABLE_RULES.aluminumExample.copper) !== CABLE_RULES.aluminumExample.aluminum) throw new Error("well-pump: Franklin's aluminum example disagrees");

const HP_TEXT = (hp: PumpHp) => `${hp} hp`;

export function wellPump(input: WellPumpInput): WellPumpRun | { error: string } {
  const offered = WP_MOTORS.some((m) => m.volts === input.volts && m.wires === input.wires && m.hp === input.hp);
  if (!offered) {
    if (input.volts === 115) return { error: "Franklin's 115 V motors are 1/2 hp; pick 230 V for a larger pump." };
    if (input.wires === 2) return { error: "Franklin's 2-wire motors go up to 1.5 hp; a larger pump is a 3-wire motor." };
    return { error: 'Pick a motor from the list.' };
  }
  if (!(Number.isFinite(input.lengthFt) && input.lengthFt > 0 && input.lengthFt <= WP_LENGTH_MAX)) {
    return { error: `Enter the cable length in feet, from 1 to ${WP_LENGTH_MAX.toLocaleString('en-US')}.` };
  }
  const row = cableRow(input.volts, input.hp) as CableRow;
  const fuses = fuseRow(input.wires, input.volts, input.hp) as FuseRow;
  const motor = motorRow(input.wires, input.volts, input.hp) as MotorRow;
  const factor = input.dropPct === 3 ? CABLE_RULES.threePctFactor : 1;
  const maxAt = (i: number) => {
    const ft = row.ft[i];
    return typeof ft === 'number' && ft > 0 ? ft * factor : null;
  };
  let pick = -1;
  let skipped: SizeKey | null = null;
  for (let i = 0; i < CABLE_SIZES.length; i++) {
    const m = maxAt(i);
    if (m === null || m < input.lengthFt) continue;
    if (input.cable === 'jacketed' && row.shaded.includes(CABLE_SIZES[i])) {
      skipped ??= CABLE_SIZES[i];
      continue;
    }
    pick = i;
    break;
  }
  if (pick < 0) {
    const last = row.ft.reduce<number>((a, x) => (typeof x === 'number' && x > a ? x : a), 0) * factor;
    return {
      error: `${input.lengthFt.toLocaleString('en-US')} ft is past Franklin's table for this motor: the largest size listed reaches ${Math.round(last).toLocaleString('en-US')} ft at a ${input.dropPct} % drop.`,
    };
  }
  const copper = CABLE_SIZES[pick];
  const copperMaxFt = maxAt(pick) as number;
  let smaller: WellPumpRun['smaller'] = null;
  for (let i = pick - 1; i >= 0; i--) {
    const m = maxAt(i);
    if (m !== null) {
      smaller = { size: CABLE_SIZES[i], maxFt: m, shaded: row.shaded.includes(CABLE_SIZES[i]) };
      break;
    }
  }
  const sharePct = (input.lengthFt / copperMaxFt) * 100;
  const aluminum = aluminumFor(copper);
  const lengthPart: TextPart = { v: input.lengthFt, unit: 'ft', src: 'input' };
  const steps: TextPart[][] = [];
  steps.push([
    `Franklin's 4-inch single-phase 75 °C cable table: a ${HP_TEXT(input.hp)}, `,
    { v: input.volts, unit: 'V', src: MFR },
    ' motor runs up to ',
    { v: row.ft[pick] as number, unit: 'ft', src: MFR },
    ' of ',
    { size: copper },
    ' copper at a ',
    { v: CABLE_RULES.dropPct, unit: '%', src: MFR },
    ' drop at maximum nameplate amps',
    ...(factor !== 1
      ? ([', or ', { v: copperMaxFt, unit: 'ft', src: WP_CALC, format: { upTo: 0 } }, ` at ${input.dropPct} % (× ${factor})`] as TextPart[])
      : []),
    '.',
  ]);
  if (skipped) {
    steps.push([
      { size: skipped },
      " would reach the length, but its cell in Franklin's table is shaded: it meets the NEC ampacity rules only as individual conductors, not as jacketed cable.",
    ]);
  } else if (smaller) {
    steps.push([
      { size: smaller.size },
      ' reaches only ',
      { v: smaller.maxFt, unit: 'ft', src: factor !== 1 ? WP_CALC : MFR, format: { upTo: 0 } },
      ', short of ',
      lengthPart,
      '.',
    ]);
  }
  steps.push([
    lengthPart,
    ' is ',
    { v: sharePct, unit: '%', src: WP_CALC, format: { upTo: 1 } },
    ' of the ',
    { size: copper },
    " maximum. Where a run joins two sizes, Franklin's rule adds each size's share; the total must stay at or under ",
    { v: 100, unit: '%', src: MFR },
    '.',
  ]);
  steps.push(
    aluminum
      ? [
          'Aluminum must be two sizes larger than copper (Franklin): ',
          { size: aluminum },
          ', with oxidation inhibitor on the connections.',
        ]
      : ['Aluminum must be two sizes larger than copper (Franklin), which is past 4/0 AWG here; use copper.'],
  );
  steps.push([
    `Fuses and breakers for Franklin motor ${fuses.model} (${input.wires}-wire, ${HP_TEXT(input.hp)}): circuit breaker up to `,
    { v: fuses.max_nec.breaker, unit: 'A', src: MFR },
    ' per the NEC (',
    { v: fuses.typical.breaker, unit: 'A', src: MFR },
    ' typical); dual element time delay fuse up to ',
    { v: fuses.max_nec.dual_element_fuse, unit: 'A', src: MFR },
    ' (',
    { v: fuses.typical.dual_element_fuse, unit: 'A', src: MFR },
    ' typical); standard fuse up to ',
    { v: fuses.max_nec.fuse, unit: 'A', src: MFR },
    ' (',
    { v: fuses.typical.fuse, unit: 'A', src: MFR },
    ' typical).',
  ]);
  steps.push([
    'The motor draws ',
    { v: motor.fl_amps, unit: 'A', src: MFR, format: { fixed: 1 } },
    ' at full load and up to ',
    { v: motor.max_amps, unit: 'A', src: MFR, format: { fixed: 1 } },
    ` at its ${motor.sf} service factor (Franklin's standard motor ${motor.model}; the cable table is figured at this maximum).`,
  ]);
  if (input.wires === 3) {
    steps.push([
      'With a control box that has a line contactor, keep the cable between the power supply and the control box to ',
      { v: CABLE_RULES.contactorBoxMaxSharePct, unit: '%', src: MFR },
      ' of the allowed maximum or less (Franklin).',
    ]);
  }
  return {
    input,
    cableRow: row,
    fuses,
    motor,
    factor,
    copper,
    copperMaxFt,
    smaller,
    skippedShaded: skipped,
    sharePct,
    aluminum,
    stepParts: steps,
    steps: steps.map((p) => partsText(p, formatSize)),
  };
}

/** The offered horsepower ratings for a voltage and wire count, smallest first. */
export function wpHpOptions(volts: PumpVolts, wires: PumpWires): PumpHp[] {
  return WP_MOTORS.filter((m) => m.volts === volts && m.wires === wires)
    .map((m) => m.hp)
    .sort((a, b) => hpValue(a) - hpValue(b));
}

export const WELL_PUMP = { ENGINE_ID, DOMAINS };
