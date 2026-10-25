// NIST SP 811 (2008) Appendix B.8/B.9 conversion factors (research/data-sources.csv, nist-sp811-conversions):
// 1 Btu_IT/h = 0.2930711 W; electrical horsepower = 746 W (exact); horsepower (550 ft·lbf/s) = 745.6999 W;
// ton of refrigeration = 3516.853 W. Tons from Btu/h: Btu/h ÷ 12,000.

export const W_PER_BTU_PER_H = 0.2930711;
export const W_PER_ELECTRICAL_HP = 746;
export const W_PER_MECHANICAL_HP = 745.6999;
export const W_PER_TON_REFRIGERATION = 3516.853;
export const BTU_PER_H_PER_TON = 12000;

export type HorsepowerKind = 'electric' | 'mechanical';

export function btuPerHourToWatts(btuPerHour: number): number {
  return btuPerHour * W_PER_BTU_PER_H;
}

export function wattsToBtuPerHour(watts: number): number {
  return watts / W_PER_BTU_PER_H;
}

export function btuPerHourToTons(btuPerHour: number): number {
  return btuPerHour / BTU_PER_H_PER_TON;
}

export function tonsToWatts(tons: number): number {
  return tons * W_PER_TON_REFRIGERATION;
}

export function horsepowerToWatts(hp: number, kind: HorsepowerKind): number {
  return hp * (kind === 'electric' ? W_PER_ELECTRICAL_HP : W_PER_MECHANICAL_HP);
}

/** Watts expressed in electrical horsepower (746 W). */
export function wattsToElectricalHorsepower(watts: number): number {
  return watts / W_PER_ELECTRICAL_HP;
}

export type BtuMode = 'btu-to-watts' | 'watts-to-btu';

export const BTU_MODE_OPTIONS: { value: BtuMode; label: string }[] = [
  { value: 'btu-to-watts', label: 'Btu/h to watts' },
  { value: 'watts-to-btu', label: 'Watts to Btu/h' },
];

export const BTU_INPUT_INVALID_MESSAGE = 'Enter a value greater than 0.';

export interface ThermalConversion {
  btuPerHour: number;
  watts: number;
  tons: number;
}

export function thermalConversion(mode: BtuMode, value: number): ThermalConversion | null {
  if (!(value > 0)) return null;
  const btuPerHour = mode === 'btu-to-watts' ? value : wattsToBtuPerHour(value);
  const watts = mode === 'btu-to-watts' ? btuPerHourToWatts(value) : value;
  return { btuPerHour, watts, tons: btuPerHourToTons(btuPerHour) };
}

export const BTU_DEFAULTS = { mode: 'btu-to-watts' as BtuMode, value: 24000 };
