// Ohm's law from any two of voltage, current, resistance and power: V = I × R, P = V × I = I² × R = V² ÷ R.
// Values stay unrounded; display formats them to 4 significant figures with an SI prefix (12 V ÷ 10 kΩ = 1.200 mA).
import { formatSignificant } from './format';

export type OhmsLawMode = 'voltage' | 'current' | 'resistance' | 'power';

export const OHMS_LAW_MODE_OPTIONS: { value: OhmsLawMode; label: string }[] = [
  { value: 'voltage', label: 'Calculate Voltage (V)' },
  { value: 'current', label: 'Calculate Current (I)' },
  { value: 'resistance', label: 'Calculate Resistance (R)' },
  { value: 'power', label: 'Calculate Power (P)' },
];

export const OHMS_LAW_EMPTY_TITLE = 'Enter values to calculate';
export const OHMS_LAW_EMPTY_HINT = 'Provide any two values to calculate the others';

export interface OhmsLawValues {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
}

export type OhmsLawInputs = Partial<Record<keyof OhmsLawValues, number | null>>;

/** Solves for every quantity from the first usable pair of inputs (values above 0), or null. */
export function solveOhmsLaw(mode: OhmsLawMode, inputs: OhmsLawInputs): OhmsLawValues | null {
  const given = (key: keyof OhmsLawValues): number => {
    const value = inputs[key];
    return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
  };
  let v = mode === 'voltage' ? 0 : given('voltage');
  let i = mode === 'current' ? 0 : given('current');
  let r = mode === 'resistance' ? 0 : given('resistance');
  let p = mode === 'power' ? 0 : given('power');

  switch (mode) {
    case 'voltage':
      if (i > 0 && r > 0) { v = i * r; p = i * i * r; }
      else if (p > 0 && r > 0) { v = Math.sqrt(p * r); i = v / r; }
      else if (p > 0 && i > 0) { v = p / i; r = v / i; }
      break;
    case 'current':
      if (v > 0 && r > 0) { i = v / r; p = (v * v) / r; }
      else if (p > 0 && v > 0) { i = p / v; r = v / i; }
      else if (p > 0 && r > 0) { i = Math.sqrt(p / r); v = i * r; }
      break;
    case 'resistance':
      if (v > 0 && i > 0) { r = v / i; p = v * i; }
      else if (v > 0 && p > 0) { r = (v * v) / p; i = p / v; }
      else if (p > 0 && i > 0) { r = p / (i * i); v = i * r; }
      break;
    case 'power':
      if (v > 0 && i > 0) { p = v * i; r = v / i; }
      else if (v > 0 && r > 0) { p = (v * v) / r; i = v / r; }
      else if (i > 0 && r > 0) { p = i * i * r; v = i * r; }
      break;
  }
  return v > 0 && i > 0 && r > 0 && p > 0 ? { voltage: v, current: i, resistance: r, power: p } : null;
}

const PREFIXES: [number, string][] = [
  [9, 'G'],
  [6, 'M'],
  [3, 'k'],
  [0, ''],
  [-3, 'm'],
  [-6, 'µ'],
  [-9, 'n'],
];

/** 4 significant figures with an SI prefix: formatSi(0.0012, 'A') → "1.200 mA". */
export function formatSi(value: number, unit: string): string {
  if (!Number.isFinite(value)) return `– ${unit}`;
  if (value === 0) return `0.000 ${unit}`;
  const magnitude = Math.abs(value);
  let index = PREFIXES.findIndex(([exp]) => magnitude >= 10 ** exp);
  if (index === -1) index = PREFIXES.length - 1;
  // rounding can carry to 1000 (999.96 → "1000"): use the next prefix up
  if (Math.abs(Number((value / 10 ** PREFIXES[index][0]).toPrecision(4))) >= 1000 && index > 0) index -= 1;
  // en-US grouping and no exponential notation beyond the largest and smallest prefix ("15,000 GV")
  return `${formatSignificant(value / 10 ** PREFIXES[index][0], 4)} ${PREFIXES[index][1]}${unit}`;
}

export const OHMS_LAW_DEFAULTS = {
  mode: 'voltage' as OhmsLawMode,
  voltage: '' as number | '',
  current: '' as number | '',
  resistance: '' as number | '',
  power: '' as number | '',
};
