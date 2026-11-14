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
  return dcSizingFromAmps({ volts, amps: watts / volts, lengthFt, dropPct, tempC });
}

/** The same sizing from the current in amperes (the low voltage calculator takes amps or watts). */
export function dcSizingFromAmps(input: Omit<DcSizingInput, 'watts'> & { amps: number }): DcSizingResult {
  const { volts, amps, lengthFt, dropPct, tempC } = input;
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

// ── WSZ-006c: the low voltage calculator's calculation path ─────────────────────────────────────────────────────────
// The calculator takes amps or watts, any DC voltage (12, 24 and 48 V one click away), the reader's drop target and 20
// or 75 °C. Around dcSizingFromAmps it adds the area in mm², the drop of the result size and of its neighbours by the same
// formula (VD = 2 × K × I × L ÷ CM, so a size that meets the target by area meets it by drop), and the 60 °C ampacity
// the current check used.

export const LV_TOOL_QUICK_VOLTS = [12, 24, 48];
export const LV_TOOL_TEMPS = DC_TEMPERATURE_OPTIONS.map((o) => o.value);
export const LV_TOOL_VOLTS_MAX = 600;
export const LV_TOOL_AMPS_MAX = 5000;
export const LV_TOOL_LENGTH_MIN_FT = 1;
export const LV_TOOL_LENGTH_MAX_FT = 5000;
export const LV_TOOL_DROP_MIN_PCT = 0.1;
export const LV_TOOL_DROP_MAX_PCT = 20;
/** The significant figures the low voltage calculator shows for areas, drops and lengths it works out. */
export const LV_SIG = 3;

export interface LvInput {
  volts: number;
  amps: number;
  lengthFt: number;
  dropPct: number;
  tempC: number;
}

export interface LvSizeDrop {
  size: SizeKey;
  areaCmil: number;
  vdVolts: number;
  vdPct: number;
}

export interface LvResult extends DcSizingResult {
  input: LvInput;
  requiredMm2: number;
  /** The 60 °C copper ampacity of the current size (the value the current check met). */
  currentAmpacity: number | null;
  /** The drop of the result size, null when there is none. */
  result: LvSizeDrop | null;
  /** Up to two smaller and two larger Table 310.16 sizes around the result (or the largest size when none meets it). */
  neighbours: LvSizeDrop[];
}

/** The drop of a size by the sizing formula: VD = 2 × K × I × L ÷ area. */
export function lvDrop(size: SizeKey, input: LvInput): LvSizeDrop {
  const area = areaCmil(size);
  const vdVolts = (2 * resistivityK(input.tempC) * input.amps * input.lengthFt) / area;
  return { size, areaCmil: area, vdVolts, vdPct: (vdVolts / input.volts) * 100 };
}

/** The low voltage calculator's result, or null for an input out of range. */
export function lowVoltageSize(input: LvInput): LvResult | null {
  const { volts, amps, lengthFt, dropPct, tempC } = input;
  if (!(volts > 0 && amps > 0 && lengthFt > 0 && dropPct > 0) || !LV_TOOL_TEMPS.includes(tempC)) return null;
  const base = dcSizingFromAmps(input);
  const around = base.resultSize ?? TABLE_310_16_SIZES[TABLE_310_16_SIZES.length - 1];
  const i = TABLE_310_16_SIZES.indexOf(around);
  const neighbours = TABLE_310_16_SIZES.slice(Math.max(0, i - 2), i + 3).map((size) => lvDrop(size, input));
  return {
    ...base,
    input,
    requiredMm2: base.requiredCmil * AWG_CONSTANTS.mm2_per_cmil,
    currentAmpacity: base.currentSize ? table31016(base.currentSize, columnKey('Cu', 60)) : null,
    result: base.resultSize ? lvDrop(base.resultSize, input) : null,
    neighbours,
  };
}

/** The one-way length, ft, at which `size` carrying `amps` at `volts` reaches `dropPct`: L = VD × area ÷ (2 × K × I). */
export function lvLengthForDrop(size: SizeKey, volts: number, amps: number, dropPct: number, tempC: number): number {
  return (((volts * dropPct) / 100) * areaCmil(size)) / (2 * resistivityK(tempC) * amps);
}
