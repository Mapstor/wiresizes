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
const GUIDE_200 = '/guides/wire-size-for-200-amp';
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
    citedOn: [WIRE_SIZE, VOLTAGE_DROP, GROUND_WIRE, WIRE_RESISTANCE, LOW_VOLTAGE, SERVICE_ENTRANCE, GUIDE_200, AWG_CHART, HOME],
  },
  {
    id: 'resistance',
    domain: 'conductor-resistance-20c',
    title: 'Conductor resistance and voltage drop',
    citedOn: [WIRE_SIZE, VOLTAGE_DROP, WIRE_RESISTANCE, LOW_VOLTAGE, AWG_CHART, SERVICE_ENTRANCE, GUIDE_200],
  },
  {
    id: 'ampacity',
    domain: 'nec-310-16',
    title: 'Ampacity',
    citedOn: [WIRE_SIZE, VOLTAGE_DROP, AMPACITY, CIRCUIT_BREAKER, RANGE, DRYER, WIRE_RESISTANCE, LOW_VOLTAGE, AWG_CHART, TABLE_310_16, GUIDE_200, HOME],
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
    citedOn: [WIRE_SIZE, AMPACITY, CIRCUIT_BREAKER, RANGE, DRYER, GUIDE_200],
  },
  {
    id: 'small-conductors',
    domain: 'nec-240-4-d',
    title: 'Small-conductor limits',
    citedOn: [WIRE_SIZE, AMPACITY, CIRCUIT_BREAKER, RANGE, DRYER, AWG_CHART, TABLE_310_16, HOME],
  },
  {
    id: 'breaker-ratings',
    domain: 'nec-240-ocpd',
    title: 'Standard breaker and fuse ratings',
    citedOn: [WIRE_SIZE, CIRCUIT_BREAKER, RANGE, DRYER, GROUND_WIRE, GUIDE_200],
  },
  {
    id: 'continuous-loads',
    domain: 'nec-continuous-load',
    title: 'Continuous loads and the voltage-drop note',
    citedOn: [WIRE_SIZE, CIRCUIT_BREAKER, VOLTAGE_DROP, LOW_VOLTAGE, GUIDE_200],
  },
  {
    id: 'grounding',
    domain: 'nec-250-grounding',
    title: 'Ground wires and grounding electrode conductors',
    citedOn: [WIRE_SIZE, CIRCUIT_BREAKER, RANGE, DRYER, GROUND_WIRE, SERVICE_ENTRANCE, GUIDE_200],
  },
  {
    id: 'service-conductors',
    domain: 'nec-310-12',
    title: 'Dwelling services and feeders',
    citedOn: [WIRE_SIZE, SERVICE_ENTRANCE, RESIDENTIAL_LOAD, GROUND_WIRE, TABLE_310_16, SINGLE_VS_THREE, GUIDE_200],
  },
  {
    id: 'load-calcs',
    domain: 'nec-220-load-calcs',
    title: 'Dwelling load calculations',
    citedOn: [RESIDENTIAL_LOAD, RANGE, DRYER],
  },
  {
    id: 'maker-instructions',
    domain: 'mfr-dryer-range',
    title: 'Range and dryer makers’ instructions',
    citedOn: [RANGE, DRYER],
  },
  {
    id: 'nema-configs',
    domain: 'nema-receptacle-configs',
    title: 'NEMA receptacle configurations',
    citedOn: [RANGE, DRYER],
  },
  {
    id: 'rule-excerpts',
    domain: 'nec-2023-rule-excerpts',
    title: 'Other NEC 2023 sections',
    citedOn: [RANGE, DRYER],
  },
  {
    id: 'power-terms',
    domain: 'eia-power-glossary',
    title: 'Real, reactive and apparent power',
    citedOn: [VOLTAGE_DROP, THREE_PHASE, SINGLE_VS_THREE, POWER_FACTOR, KW_TO_AMPS, KVA_TO_AMPS, VOLTS_TO_AMPS, WATTS_TO_AMPS, AMPS_TO_WATTS, OHMS_LAW, POWER_CALCS],
  },
  {
    id: 'three-phase-power',
    domain: 'doe-motor-load-efficiency',
    title: 'Three-phase power',
    citedOn: [VOLTAGE_DROP, THREE_PHASE, SINGLE_VS_THREE, POWER_FACTOR, KW_TO_AMPS, VOLTS_TO_AMPS, WATTS_TO_AMPS, AMPS_TO_WATTS, POWER_CALCS],
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
    citedOn: [THREE_PHASE, POWER_FACTOR, KW_TO_AMPS, KVA_TO_AMPS, WATTS_TO_AMPS, POWER_CALCS],
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
    citedOn: [WIRE_SIZE, VOLTAGE_DROP, THREE_PHASE, SINGLE_VS_THREE, POWER_FACTOR, KW_TO_AMPS, KVA_TO_AMPS, VOLTS_TO_AMPS, WATTS_TO_AMPS, AMPS_TO_WATTS, POWER_CALCS],
  },
  {
    id: 'conversions',
    domain: 'nist-sp811-conversions',
    title: 'Unit conversions',
    citedOn: ['/calculators/btu-to-watts-calculator'],
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
    citedOn: [EDITIONS, TABLE_310_16, RESIDENTIAL_LOAD],
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
  notCovered: { id: 'not-covered', title: 'Not covered yet' },
  errors: { id: 'errors', title: 'Errors and corrections' },
} as const;
