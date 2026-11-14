// Voltage drop with DC resistance of solid conductors at 75 °C from awg.json (src/lib/verified/awg.ts):
// VD = k × I × R × L / 1000 (k = 2 single-phase, √3 three-phase; R in Ω per 1000 ft; L one way in ft),
// % = VD ÷ volts × 100. Parallel sets: the areas add, so R divides by the number of sets. Power lost in the
// conductors: resistance.ts. Size search: from a size up through Table 310.16 until the drop meets the target.
import { materialName, partsText, withUnit } from './format';
import type { TextPart, ValueFormat } from './format';
import { areaCmil, conductor, formatSize } from '../verified/awg';
import type { Material, SizeKey } from '../verified/awg';
import { columnKey, nextLargerSize, smallestSizeWithArea, table31016, TABLE_310_16_SIZES } from '../verified/nec-310-16';
import type { AmpacityColumn } from '../verified/nec-310-16';
import { voltsValid } from './inputs';
import type { Phase } from './inputs';
import { powerLossWatts, resistanceAt, resistanceSig } from './resistance';

export const ENGINE_ID = 'voltage-drop';
const CALC = `calc:${ENGINE_ID}`;
export const DOMAINS = ['conductor-resistance-20c', 'nec-310-16', 'awg-geometry'];

/** Shown in place of the aluminum result when 14 AWG is selected (also on the ampacity calculator), in parts. */
export const NO_14_AWG_ALUMINUM_NOTE_PARTS: TextPart[] = [
  'NEC Table 310.16 lists aluminum from ',
  { size: '12' },
  ', so there is no ',
  { size: '14' },
  ' aluminum result.',
];
export const NO_14_AWG_ALUMINUM_NOTE = partsText(NO_14_AWG_ALUMINUM_NOTE_PARTS, formatSize);
export const MEETS_TARGET_TITLE = 'Meets your voltage-drop target';
export const ABOVE_TARGET_TITLE = 'Above your voltage-drop target';
/** Shown in place of a material's figures when its drop is 100 % or more of the supply voltage. */
export const DROP_EXCEEDS_SUPPLY_MESSAGE =
  'The calculated drop is larger than the supply voltage. Choose a larger size, a shorter run or a lower current.';
/** The link in the ampacity note. */
export const WIRE_SIZE_CALCULATOR_LINK = { href: '/calculators/wire-size-calculator', text: 'wire size calculator' };
export const RESISTANCE_BASIS_LABEL =
  'DC resistance of solid conductors at 75 °C, calculated from NIST Handbook 100 and 109 constants. Stranded conductors measure slightly higher, and AC reactance is not included.';
export const ALUMINUM_RESISTANCE_NOTE = 'about 64 % higher resistance than copper';
/** Labels of the copper and aluminum lines under the voltage drop inputs. */
export const VD_HEADLINE_LABELS = { Cu: 'Copper:', Al: 'Aluminum:' };

/** The conductor temperature of the resistances voltageDrop uses: awg.json's 75 °C values (r75_*). */
export const RESISTANCE_TEMP_C = 75;

export const VD_TARGET_OPTIONS = [1, 2, 3, 4, 5];
export const DEFAULT_VD_TARGET_PCT = 3;
export const LENGTH_MIN_FT = 0;
export const LENGTH_MAX_FT = 2000;

export function targetTitle(meetsTarget: boolean): string {
  return meetsTarget ? MEETS_TARGET_TITLE : ABOVE_TARGET_TITLE;
}

/** Voltage drop in volts and percent as the result panels show it: two decimals. */
export const VD_FORMAT: ValueFormat = { fixed: 2 };

/** Voltage drop percent as the result panel shows it: "2.02 %". */
export function formatVdPct(pct: number): string {
  return withUnit(pct, '%', VD_FORMAT);
}

/** Voltage drop in volts as the result panel shows it: "4.86 V". */
export function formatVdVolts(volts: number): string {
  return withUnit(volts, 'V', VD_FORMAT);
}

/** Ω per 1000 ft at 75 °C: copper AWG and kcmil, or aluminum EC-H19 (12 AWG and larger); null otherwise. */
export function resistance75(key: SizeKey, material: Material): number | null {
  const data = conductor(key);
  if (!data) return null;
  // copper AWG: r75_cu_solid_ohm_per_1000ft_derived; copper kcmil: r75_cu_solid_equiv_ohm_per_1000ft_derived;
  // aluminum: r75_al_ech19_ohm_per_1000ft_derived (src/lib/verified/awg.ts maps the fields)
  return material === 'Al' ? data.r75Al : data.r75Cu;
}

export function phaseFactor(phase: Phase): number {
  return phase === 'three' ? Math.sqrt(3) : 2;
}

/** Table 310.16 sizes the voltage-drop calculator offers: copper from 14 AWG, aluminum from 12 AWG. */
export function voltageDropSizes(material: Material): SizeKey[] {
  const first = TABLE_310_16_SIZES.indexOf(material === 'Cu' ? '14' : '12');
  return TABLE_310_16_SIZES.slice(first).filter((key) => resistance75(key, material) !== null);
}

export interface VoltageDropInput {
  size: SizeKey;
  material: Material;
  amps: number;
  lengthFt: number;
  volts: number;
  phase: Phase;
  /** Conductors in parallel per phase (1 when left out). */
  sets?: number;
}

export interface VoltageDropResult {
  ohmsPer1000ft: number;
  vdVolts: number;
  vdPct: number;
  loadVolts: number;
  powerLossW: number;
}

export function voltageDrop(input: VoltageDropInput): VoltageDropResult | null {
  const { size, material, amps, lengthFt, volts, phase, sets } = input;
  const single = resistance75(size, material);
  if (single === null || !voltsValid(volts, phase) || !(amps >= 0) || !(lengthFt >= 0)) return null;
  if (sets !== undefined && !(Number.isInteger(sets) && sets >= 1)) return null;
  const r = sets === undefined ? single : single / sets;
  const vdVolts = (phaseFactor(phase) * amps * r * lengthFt) / 1000;
  return {
    ohmsPer1000ft: r,
    vdVolts,
    vdPct: (vdVolts / volts) * 100,
    loadVolts: volts - vdVolts,
    powerLossW: powerLossWatts(amps, r, lengthFt, phase),
  };
}

export interface SizeForDrop {
  size: SizeKey;
  result: VoltageDropResult;
}

/**
 * From `input.size` up through Table 310.16 until the drop is at most `targetPct`, or to 2000 kcmil: the last size
 * tried and its drop (above the target only when 2000 kcmil is too).
 */
export function sizeForDrop(input: VoltageDropInput, targetPct: number): SizeForDrop {
  let size = input.size;
  let result = voltageDrop(input);
  if (!result) throw new Error(`No voltage drop for ${size} ${input.material}`);
  while (result.vdPct > targetPct) {
    const next = nextLargerSize(size);
    if (!next) break;
    size = next;
    result = voltageDrop({ ...input, size });
    if (!result) throw new Error(`No resistance for ${size} ${input.material}`);
  }
  return { size, result };
}

export interface ParallelEquivalent {
  /** Total area of the sets, in cmil. */
  totalCmil: number;
  /** The smallest single Table 310.16 size with at least that area, or null. */
  smallestSingleSize: SizeKey | null;
}

/** `sets` conductors of one size in parallel: their areas add (awg.json areas). */
export function parallelEquivalent(size: SizeKey, sets: number): ParallelEquivalent {
  const totalCmil = areaCmil(size) * sets;
  return { totalCmil, smallestSingleSize: smallestSizeWithArea(totalCmil) };
}

/** A drop of 100 % or more of the supply voltage: DROP_EXCEEDS_SUPPLY_MESSAGE replaces its figures. */
export function dropExceedsSupply(result: VoltageDropResult): boolean {
  return result.vdPct >= 100;
}

/** The Table 310.16 column the ampacity note compares the current with. */
export const AMPACITY_NOTE_COLUMN: AmpacityColumn = 60;

/**
 * The 60 °C ampacity of the size and material in NEC Table 310.16 (cu_60 or al_60) when `amps` is above it;
 * null otherwise, and where the table has no 60 °C value.
 */
export function ampacityExceeded(size: SizeKey, material: Material, amps: number): number | null {
  const ampacity = table31016(size, columnKey(material, AMPACITY_NOTE_COLUMN));
  return ampacity !== null && amps > ampacity ? ampacity : null;
}

/**
 * The note under a material's result when the current is above its 60 °C ampacity: before + link + after.
 * beforeParts is `before` in parts (before = partsText(beforeParts, formatSize)).
 */
export function ampacityNote(
  size: SizeKey,
  material: Material,
  ampacity: number,
): { before: string; beforeParts: TextPart[]; link: string; after: string } {
  const beforeParts: TextPart[] = [
    'This current is more than the ',
    { v: AMPACITY_NOTE_COLUMN, unit: '°C', src: CALC },
    ' ampacity of ',
    { size },
    ` ${materialName(material)} (`,
    { v: ampacity, unit: 'A', src: CALC },
    ', NEC Table 310.16). Choose the size with the ',
  ];
  return {
    before: partsText(beforeParts, formatSize),
    beforeParts,
    link: WIRE_SIZE_CALCULATOR_LINK.text,
    after: ' first.',
  };
}

export const VOLTAGE_DROP_DEFAULTS = {
  size: '10' as SizeKey,
  amps: 20,
  lengthFt: 100,
  volts: 240,
  phase: 'single' as Phase,
  targetPct: DEFAULT_VD_TARGET_PCT,
};

// ── WSZ-006b: the voltage drop calculator's calculation path ─────────────────────────────────────────────────────────
// The calculator takes the conductor temperature (R(T) from resistance.ts; 75 °C unless the reader changes it), DC as
// well as single-phase and three-phase, one to four sets in parallel, and either a size to check or a drop target to
// meet. A result keeps the significant figures of the resistance it comes from (resistanceSig, D-35): 12 AWG copper's
// drop to three, 4 AWG's to four. The functions above stay for the wire size calculator and the older tests.

/** DC and single-phase circuits drop on both conductors, out and back; a balanced three-phase circuit by √3. */
export type VdCircuit = 'single' | 'three' | 'dc';

export const VD_TOOL_DEFAULT_TEMP_C = RESISTANCE_TEMP_C;
export const VD_TOOL_SETS = [1, 2, 3, 4] as const;
export const VD_TOOL_LENGTH_MIN_FT = 1;
export const VD_TOOL_LENGTH_MAX_FT = 5000;
export const VD_TOOL_VOLTS_MAX = 1000;
export const VD_TOOL_AMPS_MAX = 10000;
export const VD_TOOL_TARGET_MIN_PCT = 0.1;
export const VD_TOOL_TARGET_MAX_PCT = 20;
/** The single-phase quick picks: nominal system voltages, or the line-to-neutral voltage of one (277 V of 480Y/277 V). */
export const VD_TOOL_SINGLE_QUICK_VOLTS = [120, 208, 240, 277];

/** k in VD = k × I × R × L ÷ 1000: 2 for DC and single-phase, √3 for three-phase on its line-to-line voltage. */
export function circuitFactor(circuit: VdCircuit): number {
  return circuit === 'three' ? Math.sqrt(3) : 2;
}

export interface DropInput {
  size: SizeKey;
  material: Material;
  /** Current per phase, all sets together, A. */
  amps: number;
  /** One way, ft. */
  lengthFt: number;
  /** Supply voltage; line to line on three-phase. */
  volts: number;
  circuit: VdCircuit;
  /** Conductor temperature, °C. */
  tempC: number;
  /** Conductors in parallel per phase (and in the return on DC and single-phase). */
  sets: number;
}

export interface DropRun extends DropInput {
  /** One conductor, Ω per 1000 ft at tempC. */
  perKft: number;
  /** The sets of one phase together: perKft ÷ sets. */
  phaseKft: number;
  vdVolts: number;
  vdPct: number;
  loadVolts: number;
  /** Heat in all the conductors, W: 2 × I² × R × L ÷ 1000 (3 × … on three-phase), R = phaseKft. */
  lossW: number;
  /** Significant figures of the resistance, and so of the drop and the loss (resistanceSig). */
  sig: number;
}

/** The drop of one run, or null for a size the calculator doesn't offer or an input out of range. */
export function dropRun(input: DropInput): DropRun | null {
  const { size, material, amps, lengthFt, volts, circuit, tempC, sets } = input;
  if (!voltageDropSizes(material).includes(size)) return null;
  const perKft = resistanceAt(size, material, tempC);
  if (perKft === null || !(perKft > 0)) return null;
  if (!(volts > 0) || !(amps >= 0) || !(lengthFt >= 0) || !(VD_TOOL_SETS as readonly number[]).includes(sets)) return null;
  const phaseKft = perKft / sets;
  const vdVolts = (circuitFactor(circuit) * amps * phaseKft * lengthFt) / 1000;
  return {
    ...input,
    perKft,
    phaseKft,
    vdVolts,
    vdPct: (vdVolts / volts) * 100,
    loadVolts: volts - vdVolts,
    lossW: powerLossWatts(amps, phaseKft, lengthFt, circuit),
    sig: resistanceSig(size, material),
  };
}

/** The run in up to two smaller and two larger sizes the calculator offers, smallest first, the given size among them. */
export function dropNeighbours(input: DropInput): DropRun[] {
  const sizes = voltageDropSizes(input.material);
  const i = sizes.indexOf(input.size);
  if (i === -1) return [];
  return sizes
    .slice(Math.max(0, i - 2), i + 3)
    .map((size) => dropRun({ ...input, size }))
    .filter((run): run is DropRun => run !== null);
}

export interface TargetSearch {
  /** The smallest size whose drop is at most the target, or null when 2000 kcmil is above it too. */
  found: DropRun | null;
  /** The next smaller size, above the target (null when the smallest size already meets it). */
  smaller: DropRun | null;
}

/** The smallest size the calculator offers whose drop is at most `targetPct` (compared unrounded). */
export function sizeForTarget(input: Omit<DropInput, 'size'>, targetPct: number): TargetSearch {
  let smaller: DropRun | null = null;
  for (const size of voltageDropSizes(input.material)) {
    const run = dropRun({ ...input, size });
    if (!run) continue;
    if (run.vdPct <= targetPct) return { found: run, smaller };
    smaller = run;
  }
  return { found: null, smaller };
}

/**
 * The 60 °C ampacity of the size when the current in each conductor (amps ÷ sets) is above it, or null
 * (ampacityExceeded on the current per conductor).
 */
export function ampacityPerConductorExceeded(run: Pick<DropRun, 'size' | 'material' | 'amps' | 'sets'>): number | null {
  return ampacityExceeded(run.size, run.material, run.amps / run.sets);
}

/** The one-way length, ft, at which the drop reaches `targetPct` of `volts`; null for a size without a resistance. */
export function lengthForDrop(input: Omit<DropInput, 'lengthFt'>, targetPct: number): number | null {
  const perKft = resistanceAt(input.size, input.material, input.tempC);
  if (perKft === null || !(input.amps > 0) || !(input.volts > 0)) return null;
  return ((targetPct / 100) * input.volts * 1000) / (circuitFactor(input.circuit) * input.amps * (perKft / input.sets));
}
