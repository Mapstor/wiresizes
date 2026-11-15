// Ohm's law from any two of voltage, current, resistance and power: V = I × R, P = V × I = I² × R = V² ÷ R.
// Values stay unrounded; the Ohm's law tool rounds what it shows.

export const ENGINE_ID = 'ohms-law';
// NIST SP 330 Table 4 (V = W/A, Ω = V/A) gives every relation here (WSZ-007d; power-definitions retired)
export const DOMAINS = ['nist-sp330-si-units'];

export type OhmsLawMode = 'voltage' | 'current' | 'resistance' | 'power';

export interface OhmsLawValues {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
}

export type OhmsLawQuantity = keyof OhmsLawValues;
export type OhmsLawInputs = Partial<Record<OhmsLawQuantity, number | null>>;

const QUANTITIES: OhmsLawQuantity[] = ['voltage', 'current', 'resistance', 'power'];

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

// ── Any two of the four (WSZ-007d, the Ohm's law calculator in the look) ──────────────────────────────────────────

export type OhmsPair = 'vi' | 'vr' | 'vp' | 'ir' | 'ip' | 'rp';

/** The six pairs a reader can know, in the order the calculator lists them. */
export const OHMS_PAIRS: { value: OhmsPair; label: string; known: [OhmsLawQuantity, OhmsLawQuantity] }[] = [
  { value: 'vi', label: 'Volts and amps', known: ['voltage', 'current'] },
  { value: 'vr', label: 'Volts and ohms', known: ['voltage', 'resistance'] },
  { value: 'vp', label: 'Volts and watts', known: ['voltage', 'power'] },
  { value: 'ir', label: 'Amps and ohms', known: ['current', 'resistance'] },
  { value: 'ip', label: 'Amps and watts', known: ['current', 'power'] },
  { value: 'rp', label: 'Ohms and watts', known: ['resistance', 'power'] },
];

/** Largest value the calculator takes for any quantity. */
export const OHMS_VALUE_MAX = 1e9;

/** All four quantities from any two, or null when a value is not above 0 or past the limit. */
export function solvePair(pair: OhmsPair, a: number, b: number): OhmsLawValues | null {
  const entry = OHMS_PAIRS.find((p) => p.value === pair);
  if (!entry) return null;
  if (![a, b].every((v) => Number.isFinite(v) && v > 0 && v <= OHMS_VALUE_MAX)) return null;
  const [qa, qb] = entry.known;
  const target = QUANTITIES.find((q) => q !== qa && q !== qb) as OhmsLawMode;
  return solveOhmsLaw(target, { [qa]: a, [qb]: b });
}
