// The range calculator page's examples (WSZ-010b), run through the range engine so the copy, the tables and the chart
// show the engine's numbers. The golden "load-calc-2023" cases behind them: one range of 12 kW (8 kW), Note 1 at 14,
// 16.6 and 13.4 kW, and a 7 kW cooktop with two 4 kW ovens (15 kW, 9.2 kW).
import { RANGE_CIRCUITS, isRangeError, rangeDemandRows, rangeRun } from './calculations/range-circuit';
import type { RangeRun, RangeRunInput } from './calculations/range-circuit';
import { minimumConductor } from './calculations/conductor-sizing';
import { columnKey, table31016 } from './verified/nec-310-16';
import type { Material, SizeKey } from './verified/awg';

function run(input: RangeRunInput): RangeRun {
  const r = rangeRun(input);
  if (isRangeError(r)) throw new Error(`range page: ${r.error}`);
  return r;
}

const BASE = { volts: 240 as const, circuitA: 40, material: 'Cu' as const, wiringMethod: 'cable' as const, termination: 'unknown' as const };

/** One 12 kW range on a 40 A circuit in copper NM cable. */
export const EXAMPLE = run({ ...BASE, setup: 'range', kw: 12 });
/** Table 220.55 for one range of each whole kW from 12 to 27 kW. */
export const DEMAND_ROWS = rangeDemandRows();

/** "A 20 A oven and a 30 A cooktop": their nameplate currents at 240 V, as kW, on one circuit. */
export const COMBO_AMPS = { oven: 20, cooktop: 30 };
const kwAt240 = (a: number) => (a * 240) / 1000;
export const COMBO_KW = { oven: kwAt240(COMBO_AMPS.oven), cooktop: kwAt240(COMBO_AMPS.cooktop) };
export const COMBO = run({ ...BASE, setup: 'combo', cooktopKw: COMBO_KW.cooktop, ovensKw: [COMBO_KW.oven] });
/** The golden Note 4 case: a 7 kW cooktop and two 4 kW ovens. */
export const GOLDEN_COMBO_INPUT = { cooktopKw: 7, ovenKw: 4 };
export const GOLDEN_COMBO = run({ ...BASE, setup: 'combo', cooktopKw: GOLDEN_COMBO_INPUT.cooktopKw, ovensKw: [GOLDEN_COMBO_INPUT.ovenKw, GOLDEN_COMBO_INPUT.ovenKw] });
/** Note 1's major fraction on either side of half a kW. */
export const FRACTIONS = [13.4, 13.6];

/** The wire and ground wire for range circuits, by material and column (as the calculator sizes them). */
export const WIRE_CIRCUITS = RANGE_CIRCUITS.filter((a) => [30, 40, 50, 60].includes(a));
export interface WireCell {
  size: SizeKey;
  ampacity: number;
}
function wire(circuitA: number, material: Material, warm: boolean): WireCell {
  const m = minimumConductor({ ocpdA: circuitA, material, wiringMethod: warm ? 'conductors' : 'cable', termination: warm ? '75' : 'unknown' });
  if (!m) throw new Error(`range page: no ${material} size for ${circuitA} A`);
  return { size: m.size, ampacity: table31016(m.size, columnKey(material, m.columnC)) as number };
}
export const WIRE_ROWS = WIRE_CIRCUITS.map((a) => {
  const egcCu = minimumConductor({ ocpdA: a, material: 'Cu' });
  const egcAl = minimumConductor({ ocpdA: a, material: 'Al' });
  return {
    circuitA: a,
    cuCable: wire(a, 'Cu', false),
    cuWarm: wire(a, 'Cu', true),
    alCable: wire(a, 'Al', false),
    alWarm: wire(a, 'Al', true),
    egcCu: egcCu?.egc ?? null,
    egcAl: egcAl?.egc ?? null,
  };
});
export const wireRow = (a: number) => {
  const row = WIRE_ROWS.find((r) => r.circuitA === a);
  if (!row) throw new Error(`range page: no wire row for ${a} A`);
  return row;
};
