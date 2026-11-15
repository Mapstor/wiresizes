// The residential load calculator page's examples (WSZ-010a), run through the load engine so the copy, the tables and
// the chart show the engine's numbers. EXAMPLE is the golden house of "load-calc-2023-standard" and the optional-method
// case of "load-calc-2023" (research/golden-cases.json): 2,000 ft², a 12 kW range, a 5,000 W dryer, a 4,500 W water
// heater, three more appliances, 10 kW of electric heat in one unit and 5,000 VA of air conditioning.
import { DWELLING_VOLTS, dwellingLoadRun, isDwellingError } from './calculations/load-calc-2023';
import type { DwellingRun, DwellingRunInput } from './calculations/load-calc-2023';

function run(input: DwellingRunInput): DwellingRun {
  const r = dwellingLoadRun(input);
  if (isDwellingError(r)) throw new Error(`residential load page: ${r.error}`);
  return r;
}

export const EXAMPLE_INPUT: DwellingRunInput = {
  ft2: 2000,
  smallApplianceCircuits: 2,
  laundryCircuits: 1,
  rangeKw: 12,
  dryerW: 5000,
  waterHeaterW: 4500,
  otherAppliancesW: [1500, 1500, 500],
  evW: null,
  heating: 'electric',
  heatW: 10000,
  heatUnits: 1,
  heatPumpVa: 0,
  acVa: 5000,
};
export const EXAMPLE = run(EXAMPLE_INPUT);

/** The example's connected load: every load at its rating at once, the floor area and circuits at their unit loads. */
export const EXAMPLE_CONNECTED_VA =
  EXAMPLE.optional.detail.generalLoadVa + EXAMPLE_INPUT.heatW + EXAMPLE_INPUT.acVa;
export const EXAMPLE_CONNECTED_A = EXAMPLE_CONNECTED_VA / DWELLING_VOLTS;

/** The same house heated by gas: no electric heat, the air conditioning stays. */
export const GAS_HEAT = run({ ...EXAMPLE_INPUT, heating: 'none', heatW: 0 });

/** The example with an EV charger of 9,600 W (40 A at 240 V) added. */
export const EV_W = 9600;
export const WITH_EV = run({ ...EXAMPLE_INPUT, evW: EV_W });

/** The same house with a heat pump of 6,000 VA and 10 kW of backup heat in place of the electric heat and air conditioning. */
export const HEAT_PUMP_VA = 6000;
export const WITH_HEAT_PUMP = run({ ...EXAMPLE_INPUT, heating: 'heat-pump', heatPumpVa: HEAT_PUMP_VA, heatW: 10000, acVa: 0 });

/** A small unit with no electric appliances: 800 ft², the two small-appliance circuits and a laundry circuit only. */
export const SMALL_FT2 = 800;
export const SMALL_UNIT = run({
  ...EXAMPLE_INPUT,
  ft2: SMALL_FT2,
  rangeKw: null,
  dryerW: null,
  waterHeaterW: null,
  otherAppliancesW: [],
  heating: 'none',
  heatW: 0,
  acVa: 0,
});
