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
import { powerLossWatts } from './resistance';

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
export const VD_INPUT_INVALID_MESSAGE = 'Enter a current of 0 A or more and a one-way length from 0 ft to 2000 ft.';
/** Labels of the copper and aluminum lines under the voltage drop inputs. */
export const VD_HEADLINE_LABELS = { Cu: 'Copper:', Al: 'Aluminum:' };

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

/** The smallest size the voltage drop calculator offers whose drop is at most `targetPct` (or 2000 kcmil). */
export function smallestSizeForDrop(input: Omit<VoltageDropInput, 'size'>, targetPct: number): SizeForDrop {
  return sizeForDrop({ ...input, size: voltageDropSizes(input.material)[0] }, targetPct);
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
