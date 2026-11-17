// The air conditioner page's numbers (WSZ-011e), from the engine and src/lib/verified: the copper wire and ground wire
// for each of the makers' units at 60 °C and 75 °C, the lengths at which each size drops 3 % at a 3-ton unit's MCA, and
// the questions' examples.
import type { SizeKey } from './verified/awg';
import { TERMINATION_RULES } from './verified/nec-110-14c';
import { AC_UNITS } from './verified/mfr-hvac';
import type { AcUnit } from './verified/mfr-hvac';
import { RESISTANCE_TEMP_C, lengthForDrop } from './calculations/voltage-drop';
import { acCircuit } from './calculations/ac-circuit';
import type { AcRun } from './calculations/ac-circuit';

export const AC_LOW = TERMINATION_RULES.columnAtOrBelowLimit;
export const AC_HIGH = TERMINATION_RULES.columnAboveLimit;
/** The drop target of the length table, the chart and the long-run question, percent. */
export const AC_DROP_PCT = 3;
/** The house supply the page's examples use, V. */
export const AC_VOLTS = 240;

function run(mcaA: number, mocpA: number, termination: 'unknown' | '75', lengthFt = 0): AcRun {
  const r = acCircuit({ mcaA, mocpA, volts: AC_VOLTS, wiringMethod: 'conductors', termination, lengthFt, vdTargetPct: AC_DROP_PCT });
  if ('error' in r) throw new Error(`air conditioner page: ${r.error} (${mcaA} A, ${mocpA} A)`);
  return r;
}

export interface UnitRow {
  unit: AcUnit;
  cu60: AcRun;
  cu75: AcRun;
}
export const UNIT_ROWS: UnitRow[] = AC_UNITS.map((unit) => {
  const row = { unit, cu60: run(unit.mcaA, unit.mocpA, 'unknown'), cu75: run(unit.mcaA, unit.mocpA, '75') };
  if (row.cu60.columnC !== AC_LOW || row.cu75.columnC !== AC_HIGH) throw new Error('air conditioner page: terminal columns changed');
  if (unit.coastalMocpA !== null) {
    // the coastal sheet's higher MOCP gives the same wire and ground wire, so the table shows one row
    const coastal = run(unit.mcaA, unit.coastalMocpA, 'unknown');
    if (coastal.size !== row.cu60.size || coastal.egc !== row.cu60.egc) throw new Error(`air conditioner page: ${unit.model} coastal MOCP changes the circuit`);
  }
  return row;
});

function unit(brand: AcUnit['brand'], tons: number): UnitRow {
  const r = UNIT_ROWS.find((x) => x.unit.brand === brand && x.unit.tons === tons);
  if (!r) throw new Error(`air conditioner page: no ${brand} ${tons} ton row`);
  return r;
}
/** The page's main example: Carrier's 3-ton 26SCA5. */
export const EXAMPLE = unit('Carrier', 3);
export const AMANA_3 = unit('Amana', 3);
export const TWO_TON = unit('Carrier', 2);
export const FIVE_TON = unit('Carrier', 5);
export const AMANA_FIVE = unit('Amana', 5);
// the questions give one answer for both makers' 3-ton and 5-ton units
for (const [c, a] of [[EXAMPLE, AMANA_3], [FIVE_TON, AMANA_FIVE]] as const) {
  if (c.cu60.size !== a.cu60.size || c.cu75.size !== a.cu75.size || c.cu60.egc !== a.cu60.egc || c.unit.mocpA !== a.unit.mocpA) {
    throw new Error(`air conditioner page: Carrier and Amana ${c.unit.tons} ton units differ`);
  }
}
export const COASTAL_ROWS = UNIT_ROWS.filter((r) => r.unit.coastalMocpA !== null);
/** Same tonnage, different wire: the 2.5-ton units. */
export const CARRIER_HALF = unit('Carrier', 2.5);
export const AMANA_HALF = unit('Amana', 2.5);
if (CARRIER_HALF.cu60.size === AMANA_HALF.cu60.size) throw new Error('air conditioner page: the 2.5-ton units no longer differ');
if (EXAMPLE.cu60.overSmallLimitA === null || !EXAMPLE.cu60.egcCapped) throw new Error('air conditioner page: the example no longer shows 240.4(G) and 250.122(A)');
if (TWO_TON.cu60.overSmallLimitA === null) throw new Error('air conditioner page: the 2-ton example no longer shows 240.4(G)');
if (FIVE_TON.cu60.size === FIVE_TON.cu75.size) throw new Error('air conditioner page: the 5-ton example no longer differs by column');

/** One-way length, ft, at which the example's MCA drops AC_DROP_PCT on copper at 75 °C. */
export function dropFt(size: SizeKey, amps = EXAMPLE.unit.mcaA): number {
  const ft = lengthForDrop({ size, material: 'Cu', amps, volts: AC_VOLTS, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C }, AC_DROP_PCT);
  if (ft === null) throw new Error(`air conditioner page: no drop length for ${size}`);
  return ft;
}
export const DROP_SIZES: SizeKey[] = ['12', '10', '8', '6'];
export const DROP_ROWS = DROP_SIZES.map((size) => ({ size, ft: dropFt(size) }));
if (DROP_SIZES[0] !== EXAMPLE.cu60.size) throw new Error('air conditioner page: the drop table no longer starts at the example size');

/** The question's 150 ft run to the 3-ton example, 3 % target. */
export const LONG_RUN_FT = 150;
export const LONG_RUN = run(EXAMPLE.unit.mcaA, EXAMPLE.unit.mocpA, 'unknown', LONG_RUN_FT);
if (LONG_RUN.size === LONG_RUN.firstSize || !LONG_RUN.egcGrown) throw new Error('air conditioner page: the long-run question no longer steps up');
