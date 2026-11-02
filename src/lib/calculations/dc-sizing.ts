// Copper conductor size for a DC (low-voltage) load, sized for voltage drop and for current:
// CM = 2 × K × I × L ÷ VD, K = 10.371 × (1 + 0.00393 × (T − 20)) Ω·cmil/ft (awg.json constants), L one way in ft,
// VD = volts × target % ÷ 100. Voltage-drop size: smallest NEC Table 310.16 size whose awg.json area is at least CM.
// Current size: smallest size whose 60 °C copper ampacity is at least I. The larger of the two applies.
import { areaCmil, AWG_CONSTANTS } from '../verified/awg';
import type { SizeKey } from '../verified/awg';
import { columnKey, smallestSizeWithArea, table31016, TABLE_310_16_SIZES } from '../verified/nec-310-16';
import { atTemperature } from './resistance';

export const ENGINE_ID = 'dc-sizing';
export const DOMAINS = ['conductor-resistance-20c', 'awg-geometry', 'nec-310-16'];

export const COPPER_K20 = AWG_CONSTANTS.copper_resistivity_ohm_cmil_per_ft_20C;

export const DC_TEMPERATURE_OPTIONS = [
  { value: 20, label: '20 °C (68 °F)' },
  { value: 75, label: '75 °C (167 °F)' },
];
export const NO_SIZE_MESSAGE = 'No size in NEC Table 310.16 is large enough for this load.';
export const BASIS_LINE = 'Sized for voltage drop and for current (60 °C column of NEC Table 310.16, 30 °C ambient).';
export const INPUT_INVALID_MESSAGE = 'Enter volts, watts, length and a voltage-drop target greater than 0.';

export type Governs = 'voltage drop' | 'current' | 'both';

export const GOVERNS_LABELS: Record<Governs, string> = {
  'voltage drop': 'Voltage drop',
  current: 'Current',
  both: 'Both (same size)',
};

export interface DcSizingInput {
  volts: number;
  /** Total load in watts. */
  watts: number;
  lengthFt: number;
  dropPct: number;
  tempC: number;
}

export interface DcSizingResult {
  amps: number;
  /** Ω·cmil per ft at the conductor temperature. */
  k: number;
  vdVolts: number;
  requiredCmil: number;
  vdSize: SizeKey | null;
  currentSize: SizeKey | null;
  /** null when either size is missing. */
  resultSize: SizeKey | null;
  governs: Governs | null;
}

export function resistivityK(tempC: number): number {
  return atTemperature(COPPER_K20, 'Cu', tempC);
}

export function dcSizing(input: DcSizingInput): DcSizingResult | { error: 'input-invalid' } {
  const { volts, watts, lengthFt, dropPct, tempC } = input;
  if (!(volts > 0 && watts > 0 && lengthFt > 0 && dropPct > 0)) return { error: 'input-invalid' };
  const amps = watts / volts;
  const k = resistivityK(tempC);
  const vdVolts = (volts * dropPct) / 100;
  const requiredCmil = (2 * k * amps * lengthFt) / vdVolts;
  const vdSize = smallestSizeWithArea(requiredCmil);
  const currentSize =
    TABLE_310_16_SIZES.find((key) => {
      const a = table31016(key, columnKey('Cu', 60));
      return a !== null && a >= amps;
    }) ?? null;
  let resultSize: SizeKey | null = null;
  let governs: Governs | null = null;
  if (vdSize && currentSize) {
    const vdArea = areaCmil(vdSize);
    const currentArea = areaCmil(currentSize);
    resultSize = vdArea >= currentArea ? vdSize : currentSize;
    governs = vdSize === currentSize ? 'both' : vdArea > currentArea ? 'voltage drop' : 'current';
  }
  return { amps, k, vdVolts, requiredCmil, vdSize, currentSize, resultSize, governs };
}

export const DC_SIZING_DEFAULTS = {
  volts: 12,
  loads: 8,
  wattsPerLoad: 3,
  lengthFt: 100,
  dropPct: 3,
  tempC: 75,
};
