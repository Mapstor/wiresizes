// The power pages' worked figures, from the power engine (WSZ-007a): the golden power-factor correction, one 10 kW load on
// three systems, one 100 kW load at 480 V as its power factor falls, and capacitor kVAR per kW of load. Pure data, no JSX:
// the charts (src/components/look/Charts.tsx), the three-phase calculator, the two power guides and
// tests/wsz007a-power-guides.test.ts read the same values. Every voltage is a nominal system voltage of the registry
// (assertNominal, when a page that uses them builds); research/golden-cases.json pins the results. Server only (the
// voltage list reads the registry CSV).
import 'server-only';
import { fromRealPower, isPowerError, isTpError, kvarAt, threePhase } from '@/lib/calculations/power';
import type { TpCorrection, TpResult } from '@/lib/calculations/power';
import { assertNominal } from '@/lib/verified/us-nominal-voltages';

function solved(r: ReturnType<typeof threePhase>, what: string): TpResult {
  if (isTpError(r)) throw new Error(`power-guides: ${what} failed (${r.error})`);
  return r;
}

/** The correction of a result that asked for a target power factor. */
export function correctionOf(r: TpResult): TpCorrection {
  if (!r.correction) throw new Error('power-guides: the example has no correction');
  return r.correction;
}

/** Golden case "100 kW from PF 0.80 to 0.95" (pf-correction), at 480 V for its currents. */
export const PF_EXAMPLE_VOLTS = 480;
export const PF_EXAMPLE: TpResult = solved(
  threePhase({ volts: PF_EXAMPLE_VOLTS, known: 'kw-pf', kw: 100, pf: 0.8, targetPf: 0.95 }),
  'the golden correction',
);
correctionOf(PF_EXAMPLE);

/** Golden cases "10 kW at 240 V single-phase, PF 1" and "10 kW at 208 V / 480 V three-phase, PF 1" (power). */
export const COMPARE_KW = 10;
export interface CompareRow {
  key: string;
  volts: number;
  phases: 1 | 3;
  amps: number;
}
export const COMPARE_ROWS: CompareRow[] = (() => {
  const single = fromRealPower({ watts: COMPARE_KW * 1000, volts: 240, circuit: 'single', pf: 1 });
  if (isPowerError(single)) throw new Error('power-guides: the single-phase comparison failed');
  const three = (volts: number) => solved(threePhase({ volts, known: 'kw-pf', kw: COMPARE_KW, pf: 1 }), `${volts} V comparison`).amps;
  return [
    { key: '240-1', volts: 240, phases: 1, amps: single.amps },
    { key: '208-3', volts: 208, phases: 3, amps: three(208) },
    { key: '480-3', volts: 480, phases: 3, amps: three(480) },
  ];
})();

/** One 100 kW three-phase load at 480 V as its power factor falls. */
export const PF_BARS = { kw: 100, volts: 480, pfs: [1, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6] };
export interface PfBarRow {
  pf: number;
  amps: number;
  kva: number;
}
export const PF_BAR_ROWS: PfBarRow[] = PF_BARS.pfs.map((pf) => {
  const r = solved(threePhase({ volts: PF_BARS.volts, known: 'kw-pf', kw: PF_BARS.kw, pf }), `PF ${pf} bar`);
  return { pf, amps: r.amps, kva: r.kva };
});

/** The row at one power factor. */
export function pfBarRow(pf: number): PfBarRow {
  const row = PF_BAR_ROWS.find((r) => r.pf === pf);
  if (!row) throw new Error(`power-guides: no bar row at PF ${pf}`);
  return row;
}

/** Capacitor kVAR per kW of load, from a present power factor to a target: Q/P before less Q/P after. */
export const KVAR_TABLE = { from: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9], to: [0.9, 0.95, 1] };
export function kvarPerKw(from: number, to: number): number | null {
  return to > from ? kvarAt(1, from) - kvarAt(1, to) : null;
}

/** Throws unless every voltage these figures use is a nominal system voltage. */
export function assertPowerGuideVolts(what: string): void {
  assertNominal([PF_EXAMPLE_VOLTS, PF_BARS.volts, ...COMPARE_ROWS.map((r) => r.volts)], what);
}
