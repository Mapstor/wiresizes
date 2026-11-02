// Voltage drop with DC resistance of solid conductors at 75 °C from data/verified/awg.json:
// VD = k × I × R × L / 1000 (k = 2 single-phase, √3 three-phase; R in Ω per 1000 ft; L one way in ft),
// % = VD ÷ volts × 100. Power lost in the conductors: 2·I²·R·L/1000 single-phase, 3·I²·R·L/1000 three-phase.
import { formatFixed } from './format';
import { conductor, formatSize, materialName, tableAmpacity, TABLE_310_16_SIZES } from './sizes';
import type { Material, SizeKey } from './sizes';
import { voltsValid } from './inputs';
import type { Phase } from './inputs';

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

/** Voltage drop percent as the result panel shows it: "2.02 %". */
export function formatVdPct(pct: number): string {
  return `${formatFixed(pct, 2)} %`;
}

/** Voltage drop in volts as the result panel shows it: "4.86 V". */
export function formatVdVolts(volts: number): string {
  return `${formatFixed(volts, 2)} V`;
}

/** Ω per 1000 ft at 75 °C: copper AWG and kcmil, or aluminum EC-H19 (12 AWG and larger); null otherwise. */
export function resistance75(key: SizeKey, material: Material): number | null {
  const data = conductor(key);
  if (!data) return null;
  // copper AWG: r75_cu_solid_ohm_per_1000ft_derived; copper kcmil: r75_cu_solid_equiv_ohm_per_1000ft_derived;
  // aluminum: r75_al_ech19_ohm_per_1000ft_derived (sizes.ts maps the fields)
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
}

export interface VoltageDropResult {
  ohmsPer1000ft: number;
  vdVolts: number;
  vdPct: number;
  loadVolts: number;
  powerLossW: number;
}

export function voltageDrop(input: VoltageDropInput): VoltageDropResult | null {
  const { size, material, amps, lengthFt, volts, phase } = input;
  const r = resistance75(size, material);
  if (r === null || !voltsValid(volts, phase) || !(amps >= 0) || !(lengthFt >= 0)) return null;
  const vdVolts = (phaseFactor(phase) * amps * r * lengthFt) / 1000;
  const conductors = phase === 'three' ? 3 : 2;
  return {
    ohmsPer1000ft: r,
    vdVolts,
    vdPct: (vdVolts / volts) * 100,
    loadVolts: volts - vdVolts,
    powerLossW: (conductors * amps * amps * r * lengthFt) / 1000,
  };
}

/** A drop of 100 % or more of the supply voltage: DROP_EXCEEDS_SUPPLY_MESSAGE replaces its figures. */
export function dropExceedsSupply(result: VoltageDropResult): boolean {
  return result.vdPct >= 100;
}

/**
 * The 60 °C ampacity of the size and material in NEC Table 310.16 (cu_60 or al_60) when `amps` is above it;
 * null otherwise, and where the table has no 60 °C value.
 */
export function ampacityExceeded(size: SizeKey, material: Material, amps: number): number | null {
  const ampacity = tableAmpacity(size, material, 60);
  return ampacity !== null && amps > ampacity ? ampacity : null;
}

/** The note under a material's result when the current is above its 60 °C ampacity: before + link + after. */
export function ampacityNote(size: SizeKey, material: Material, ampacity: number): { before: string; link: string; after: string } {
  return {
    before: `This current is more than the 60 °C ampacity of ${formatSize(size)} ${materialName(material)} (${ampacity} A, NEC Table 310.16). Choose the size with the `,
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
