// NIST SP 811 (2008) Appendix B.8/B.9 conversion factors (research/data-sources.csv, nist-sp811-conversions):
// 1 Btu_IT/h = 0.2930711 W; electrical horsepower = 746 W (exact); horsepower (550 ft·lbf/s) = 745.6999 W;
// ton of refrigeration = 3516.853 W. Tons from Btu/h: Btu/h ÷ 12,000.

export const ENGINE_ID = 'conversions';
export const DOMAINS = ['nist-sp811-conversions'];

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
