// /methodology (WSZ-004b): one section per verified source domain that a live page's <Sources> lists, in reading
// order, each with the live pages whose Sources list it ("Cited on"), named as the route list names them
// (src/lib/routes.ts, D-26). Domains that no live page cites (doe-efficiency-standards and the rest) stay off
// (WSZ-017 answers 10 and 12). check-structure 24 compares these
// lists with the built pages, so a domain added to or dropped from a page's Sources fails the build until this file
// follows. Pure data, no JSX: the tests import it.
import { pageName } from './routes';

export const METHODOLOGY_ROUTE = '/methodology';

export interface MethodologySection {
  /** The section's id, its #fragment. */
  id: string;
  /** The verified domain of research/data-sources.csv the section describes. */
  domain: string;
  /** Its h2. */
  title: string;
  /** Routes of the live pages whose <Sources> list the domain. */
  citedOn: string[];
}

const WIRE_SIZE = '/calculators/wire-size-calculator';
const VOLTAGE_DROP = '/calculators/voltage-drop-calculator';
const AMPACITY = '/calculators/ampacity-calculator';
const CIRCUIT_BREAKER = '/calculators/circuit-breaker-calculator';
const GROUND_WIRE = '/calculators/ground-wire-calculator';
const WIRE_RESISTANCE = '/calculators/wire-resistance-calculator';
const LOW_VOLTAGE = '/calculators/low-voltage-calculator';
const THREE_PHASE = '/calculators/three-phase-calculator';
const SINGLE_VS_THREE = '/guides/single-vs-three-phase';
const KW_TO_AMPS = '/calculators/kilowatts-to-amps-calculator';
const KVA_TO_AMPS = '/calculators/kva-to-amps-calculator';
const VOLTS_TO_AMPS = '/calculators/volts-to-amps-calculator';
const WATTS_TO_AMPS = '/calculators/watts-to-amps-calculator';
const AMPS_TO_WATTS = '/calculators/amps-to-watts-calculator';
const OHMS_LAW = '/calculators/ohms-law-calculator';
const POWER_FACTOR = '/guides/power-factor-explained';
const POWER_CALCS = '/guides/electrical-power-calculations';
const SERVICE_ENTRANCE = '/calculators/service-entrance-calculator';
const RESIDENTIAL_LOAD = '/calculators/residential-load-calculator';
const RANGE = '/calculators/range-calculator';
const DRYER = '/calculators/dryer-calculator';
const HP_TO_AMPS = '/calculators/horsepower-to-amps-calculator';
const GUIDE_200 = '/guides/wire-size-for-200-amp';
const GUIDE_100 = '/guides/wire-size-for-100-amp';
const GUIDE_50 = '/guides/wire-size-for-50-amp';
const GUIDE_15 = '/guides/wire-size-for-15-amp';
const GUIDE_20 = '/guides/wire-size-for-20-amp';
const GUIDE_30 = '/guides/wire-size-for-30-amp';
const GUIDE_40 = '/guides/wire-size-for-40-amp';
const GUIDE_60 = '/guides/wire-size-for-60-amp';
const GUIDE_7090 = '/guides/wire-size-for-70-80-90-amp';
const GUIDE_125 = '/guides/wire-size-for-125-amp';
const GUIDE_EV = '/guides/wire-size-for-ev-charger';
const GARAGE = '/calculators/garage-subpanel-calculator';
const BOX_FILL = '/calculators/box-fill-calculator';
const CONDUIT_FILL = '/calculators/conduit-fill-calculator';
const RV_HOOKUP = '/calculators/rv-hookup-calculator';
const WELL_PUMP = '/calculators/well-pump-calculator';
const HOT_TUB = '/calculators/hot-tub-calculator';
const AIR_CONDITIONER = '/calculators/air-conditioner-calculator';
const WELDER = '/calculators/welder-calculator';
const AWG_CHART = '/guides/awg-wire-size-chart';
const TABLE_310_16 = '/guides/nec-table-310-16';
const EDITIONS = '/guides/nec-code-compliance';
// The homepage lists the three sources of its wire size table under Sources (WSZ-005b); it and the two hubs also list
// the two sources of the NEC edition line (WSZ-005c)
const HOME = '/';
const CALCULATORS_HUB = '/calculators';
const GUIDES_HUB = '/guides';

export const METHODOLOGY_SECTIONS: MethodologySection[] = [
  {
    id: 'wire-gauge',
    domain: 'awg-geometry',
    title: 'Wire gauge sizes and areas',
    citedOn: [WIRE_SIZE, VOLTAGE_DROP, GROUND_WIRE, WIRE_RESISTANCE, LOW_VOLTAGE, SERVICE_ENTRANCE, GUIDE_200, GUIDE_100, AWG_CHART, HOME],
  },
  {
    id: 'resistance',
    domain: 'conductor-resistance-20c',
    title: 'Conductor resistance and voltage drop',
    citedOn: [WIRE_SIZE, VOLTAGE_DROP, WIRE_RESISTANCE, LOW_VOLTAGE, AWG_CHART, SERVICE_ENTRANCE, GUIDE_200, GUIDE_100, GUIDE_EV, GARAGE, RV_HOOKUP, HOT_TUB, AIR_CONDITIONER, WELDER, GUIDE_50, GUIDE_15, GUIDE_20, GUIDE_30, GUIDE_40, GUIDE_60, GUIDE_7090, GUIDE_125],
  },
  {
    id: 'ampacity',
    domain: 'nec-310-16',
    title: 'Ampacity',
    citedOn: [WIRE_SIZE, VOLTAGE_DROP, AMPACITY, CIRCUIT_BREAKER, RANGE, DRYER, WIRE_RESISTANCE, LOW_VOLTAGE, AWG_CHART, TABLE_310_16, GUIDE_200, GUIDE_100, HOME, GUIDE_EV, GARAGE, RV_HOOKUP, HOT_TUB, AIR_CONDITIONER, WELDER, GUIDE_50, GUIDE_15, GUIDE_20, GUIDE_30, GUIDE_40, GUIDE_60, GUIDE_7090, GUIDE_125],
  },
  {
    id: 'corrections',
    domain: 'nec-310-15-corrections',
    title: 'Ambient temperature and bundling',
    citedOn: [WIRE_SIZE, AMPACITY, TABLE_310_16],
  },
  {
    id: 'terminals',
    domain: 'nec-110-14c',
    title: 'Terminal temperatures',
    citedOn: [WIRE_SIZE, AMPACITY, CIRCUIT_BREAKER, RANGE, DRYER, GUIDE_200, GUIDE_100, GUIDE_EV, GARAGE, RV_HOOKUP, HOT_TUB, AIR_CONDITIONER, WELDER, GUIDE_50, GUIDE_15, GUIDE_20, GUIDE_30, GUIDE_40, GUIDE_60, GUIDE_7090, GUIDE_125],
  },
  {
    id: 'small-conductors',
    domain: 'nec-240-4-d',
    title: 'Small-conductor limits',
    citedOn: [WIRE_SIZE, AMPACITY, CIRCUIT_BREAKER, RANGE, DRYER, AWG_CHART, TABLE_310_16, HOME, GARAGE, RV_HOOKUP, HOT_TUB, AIR_CONDITIONER, WELDER, GUIDE_50, GUIDE_15, GUIDE_20, GUIDE_30, GUIDE_40],
  },
  {
    id: 'breaker-ratings',
    domain: 'nec-240-ocpd',
    title: 'Standard breaker and fuse ratings',
    citedOn: [WIRE_SIZE, CIRCUIT_BREAKER, RANGE, DRYER, GROUND_WIRE, GUIDE_200, GUIDE_100, GUIDE_EV, GARAGE, RV_HOOKUP, HOT_TUB, AIR_CONDITIONER, WELDER, GUIDE_50, GUIDE_15, GUIDE_20, GUIDE_30, GUIDE_40, GUIDE_60, GUIDE_7090, GUIDE_125],
  },
  {
    id: 'continuous-loads',
    domain: 'nec-continuous-load',
    title: 'Continuous loads and the voltage-drop note',
    citedOn: [WIRE_SIZE, CIRCUIT_BREAKER, VOLTAGE_DROP, LOW_VOLTAGE, GUIDE_200, GUIDE_100, GUIDE_EV, GARAGE, GUIDE_50, GUIDE_15, GUIDE_20, GUIDE_30, GUIDE_40, GUIDE_60, GUIDE_7090, GUIDE_125],
  },
  {
    id: 'grounding',
    domain: 'nec-250-grounding',
    title: 'Ground wires and grounding electrode conductors',
    citedOn: [WIRE_SIZE, CIRCUIT_BREAKER, RANGE, DRYER, GROUND_WIRE, SERVICE_ENTRANCE, GUIDE_200, GUIDE_100, GUIDE_EV, GARAGE, RV_HOOKUP, HOT_TUB, AIR_CONDITIONER, WELDER, GUIDE_50, GUIDE_15, GUIDE_20, GUIDE_30, GUIDE_40, GUIDE_60, GUIDE_7090, GUIDE_125],
  },
  {
    id: 'service-conductors',
    domain: 'nec-310-12',
    title: 'Dwelling services and feeders',
    citedOn: [WIRE_SIZE, SERVICE_ENTRANCE, RESIDENTIAL_LOAD, GROUND_WIRE, TABLE_310_16, SINGLE_VS_THREE, GUIDE_200, GUIDE_100, GUIDE_50, GUIDE_60, GUIDE_125],
  },
  {
    id: 'separate-buildings',
    domain: 'nec-feeders-outbuildings',
    title: 'Feeders to a separate building',
    citedOn: [GUIDE_100, GARAGE, GUIDE_50, GUIDE_30, GUIDE_40, GUIDE_60, GUIDE_7090, GUIDE_125],
  },
  {
    id: 'separate-building-grounding',
    domain: 'nec-250-32',
    title: 'Grounding at a separate building',
    citedOn: [GUIDE_100, GARAGE, GUIDE_50, GUIDE_40, GUIDE_60, GUIDE_7090, GUIDE_125],
  },
  {
    id: 'burial-depth',
    domain: 'nec-300-5-burial',
    title: 'Underground cover',
    citedOn: [GARAGE],
  },
  {
    id: 'box-fill',
    domain: 'nec-314-16-box-fill',
    title: 'Box fill',
    citedOn: [BOX_FILL],
  },
  {
    id: 'conduit-fill',
    domain: 'nec-ch9-fill',
    title: 'Conduit fill',
    citedOn: [CONDUIT_FILL],
  },
  {
    id: 'rv-parks',
    domain: 'nec-551-rv-demand',
    title: 'RV parks',
    citedOn: [RV_HOOKUP],
  },
  {
    id: 'well-pumps',
    domain: 'mfr-well-pump',
    title: 'Submersible well pumps (Franklin Electric)',
    citedOn: [WELL_PUMP],
  },
  {
    id: 'spa-makers',
    domain: 'mfr-spas',
    title: 'Hot tub makers’ instructions',
    citedOn: [HOT_TUB, GUIDE_50, GUIDE_15, GUIDE_20, GUIDE_60],
  },
  {
    id: 'air-conditioning',
    domain: 'nec-440-hvac',
    title: 'Air conditioner circuits, NEC Article 440',
    citedOn: [AIR_CONDITIONER, WELDER, GUIDE_50, GUIDE_30, GUIDE_40],
  },
  {
    id: 'ac-makers',
    domain: 'mfr-hvac-specs',
    title: 'Air conditioner makers’ product data',
    citedOn: [AIR_CONDITIONER],
  },
  {
    id: 'welders',
    domain: 'nec-630-welders',
    title: 'Welder circuits, NEC Article 630',
    citedOn: [WELDER],
  },
  {
    id: 'welder-makers',
    domain: 'mfr-welders',
    title: 'Welder makers’ electrical service guides',
    citedOn: [WELDER, GUIDE_50],
  },
  {
    id: 'cable-ampacity',
    domain: 'nec-cable-rules',
    title: 'NM cable and neutral counting',
    citedOn: [GUIDE_100, GUIDE_EV, GUIDE_50, GUIDE_15, GUIDE_20, GUIDE_40, GUIDE_60],
  },
  {
    id: 'ev-charging',
    domain: 'nec-625-ev',
    title: 'EV charger circuits, NEC Article 625',
    citedOn: [GUIDE_EV, GUIDE_50, GUIDE_20, GUIDE_30, GUIDE_40, GUIDE_60, GUIDE_7090],
  },
  {
    id: 'ev-makers',
    domain: 'mfr-evse',
    title: 'EV charger makers’ instructions',
    citedOn: [GUIDE_EV, GUIDE_7090],
  },
  {
    id: 'ev-credit',
    domain: 'irs-30c-credit',
    title: 'The federal credit for home chargers',
    citedOn: [GUIDE_EV],
  },
  {
    id: 'load-calcs',
    domain: 'nec-220-load-calcs',
    title: 'Dwelling load calculations',
    citedOn: [RESIDENTIAL_LOAD, RANGE, DRYER, GUIDE_EV, GARAGE],
  },
  {
    id: 'maker-instructions',
    domain: 'mfr-dryer-range',
    title: 'Range and dryer makers’ instructions',
    citedOn: [RANGE, DRYER, GUIDE_50, GUIDE_30, GUIDE_40],
  },
  {
    id: 'nema-configs',
    domain: 'nema-receptacle-configs',
    title: 'NEMA receptacle configurations',
    citedOn: [RANGE, DRYER, GUIDE_EV, RV_HOOKUP, WELDER, GUIDE_50, GUIDE_15, GUIDE_20, GUIDE_30],
  },
  {
    id: 'rule-excerpts',
    domain: 'nec-2023-rule-excerpts',
    title: 'Other NEC 2023 sections',
    citedOn: [RANGE, DRYER, HP_TO_AMPS, GUIDE_EV, RV_HOOKUP],
  },
  {
    id: 'motor-currents',
    domain: 'nec-430-flc',
    title: 'Motor full-load currents',
    citedOn: [HP_TO_AMPS],
  },
  {
    id: 'power-terms',
    domain: 'eia-power-glossary',
    title: 'Real, reactive and apparent power',
    citedOn: [VOLTAGE_DROP, THREE_PHASE, SINGLE_VS_THREE, POWER_FACTOR, KW_TO_AMPS, KVA_TO_AMPS, VOLTS_TO_AMPS, WATTS_TO_AMPS, AMPS_TO_WATTS, OHMS_LAW, HP_TO_AMPS, POWER_CALCS],
  },
  {
    id: 'three-phase-power',
    domain: 'doe-motor-load-efficiency',
    title: 'Three-phase power',
    citedOn: [VOLTAGE_DROP, THREE_PHASE, SINGLE_VS_THREE, POWER_FACTOR, KW_TO_AMPS, VOLTS_TO_AMPS, WATTS_TO_AMPS, AMPS_TO_WATTS, HP_TO_AMPS, POWER_CALCS],
  },
  {
    id: 'line-voltages',
    domain: 'mit-polyphase-networks',
    title: 'Line-to-line and line-to-neutral voltage',
    citedOn: [THREE_PHASE, SINGLE_VS_THREE, POWER_FACTOR, KW_TO_AMPS, KVA_TO_AMPS, VOLTS_TO_AMPS, WATTS_TO_AMPS, AMPS_TO_WATTS, POWER_CALCS],
  },
  {
    id: 'power-factor-correction',
    domain: 'doe-power-factor-cost',
    title: 'Power factor correction',
    citedOn: [THREE_PHASE, POWER_FACTOR, KW_TO_AMPS, KVA_TO_AMPS, WATTS_TO_AMPS, HP_TO_AMPS, POWER_CALCS],
  },
  {
    id: 'si-units',
    domain: 'nist-sp330-si-units',
    title: 'Watts, volts and ohms',
    citedOn: [VOLTAGE_DROP, LOW_VOLTAGE, VOLTS_TO_AMPS, WATTS_TO_AMPS, AMPS_TO_WATTS, OHMS_LAW, POWER_CALCS],
  },
  {
    id: 'water-heaters',
    domain: 'mfr-water-heaters',
    title: 'Water heater elements',
    citedOn: [WATTS_TO_AMPS],
  },
  {
    id: 'nominal-voltages',
    domain: 'us-nominal-voltages',
    title: 'Nominal system voltages',
    citedOn: [WIRE_SIZE, VOLTAGE_DROP, THREE_PHASE, SINGLE_VS_THREE, POWER_FACTOR, KW_TO_AMPS, KVA_TO_AMPS, VOLTS_TO_AMPS, WATTS_TO_AMPS, AMPS_TO_WATTS, HP_TO_AMPS, POWER_CALCS],
  },
  {
    id: 'conversions',
    domain: 'nist-sp811-conversions',
    title: 'Unit conversions',
    citedOn: ['/calculators/btu-to-watts-calculator', HP_TO_AMPS],
  },
  {
    id: 'metric-sizes',
    domain: 'iec-60228-metric-sizes',
    title: 'Metric conductor sizes',
    citedOn: [AWG_CHART],
  },
  {
    id: 'nec-adoption',
    domain: 'nec-adoption',
    title: 'NEC editions adopted by the states',
    citedOn: [EDITIONS, TABLE_310_16, HOME, CALCULATORS_HUB, GUIDES_HUB],
  },
  {
    id: 'nec-2026-issuance',
    domain: 'nec-2026-issuance',
    title: 'The 2026 NEC: issue and effective dates',
    citedOn: [EDITIONS, TABLE_310_16, HOME, CALCULATORS_HUB, GUIDES_HUB],
  },
  {
    id: 'nec-2026',
    domain: 'nec-2026-edition',
    title: 'Changes in the 2026 NEC',
    citedOn: [EDITIONS, TABLE_310_16, RESIDENTIAL_LOAD, GUIDE_EV],
  },
];

/** Link text of the pages a section cites, by route: each page's name in the route list (src/lib/routes.ts). */
export const CITED_PAGE_NAMES: Record<string, string> = Object.fromEntries(
  [...new Set(METHODOLOGY_SECTIONS.flatMap((s) => s.citedOn))].map((route) => [route, pageName(route)]),
);

/** The sections in a page's reading order that are not one source: the method overview and the closing notes. */
export const METHODOLOGY_EXTRA_SECTIONS = {
  method: { id: 'wire-size-method', title: 'How the wire size calculator picks a size' },
  breakerMethod: { id: 'breaker-method', title: 'How the circuit breaker calculator picks a breaker' },
  loadMethod: { id: 'load-method', title: 'How the residential load calculator counts a house' },
  rangeMethod: { id: 'range-method', title: 'How the range calculator sizes a range circuit' },
  dryerMethod: { id: 'dryer-method', title: 'How the dryer calculator counts a dryer' },
  hpMethod: { id: 'hp-method', title: 'How the horsepower to amps calculator reads the tables' },
  garageMethod: { id: 'garage-method', title: 'How the garage subpanel calculator sizes a feeder' },
  boxFillMethod: { id: 'box-fill-method', title: 'How the box fill calculator adds the fill' },
  conduitFillMethod: { id: 'conduit-fill-method', title: 'How the conduit fill calculator reads Annex C' },
  rvMethod: { id: 'rv-method', title: 'How the RV hookup calculator sizes an outlet and a park' },
  wellPumpMethod: { id: 'well-pump-method', title: 'How the well pump calculator reads Franklin’s tables' },
  hotTubMethod: { id: 'hot-tub-method', title: 'How the hot tub calculator sizes a hot tub circuit' },
  acMethod: { id: 'ac-method', title: 'How the air conditioner calculator sizes a circuit' },
  welderMethod: { id: 'welder-method', title: 'How the welder calculator sizes a circuit' },
  notCovered: { id: 'not-covered', title: 'Not covered yet' },
  errors: { id: 'errors', title: 'Errors and corrections' },
} as const;
