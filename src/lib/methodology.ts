// /methodology (WSZ-004b): one section per verified source domain that a live page's <Sources> lists, in reading
// order, each with the live calculators whose Sources list it ("Cited on"). nec-110-14c stays off until WSZ-009 adds
// it to the wire size calculator's Sources (D-06); domains that no live page cites (nec-continuous-load,
// doe-efficiency-standards and the rest) stay off too (WSZ-017 answers 10 and 12). check-structure 24 compares these
// lists with the built pages, so a domain added to or dropped from a page's Sources fails the build until this file
// follows. Pure data, no JSX: the tests import it.

export const METHODOLOGY_ROUTE = '/methodology';

/** Link text for the live pages that list a source under Sources (the calculators and, since WSZ-005a, the two table guides), by route. */
export const CALCULATOR_NAMES: Record<string, string> = {
  '/calculators/wire-size-calculator': 'Wire Size Calculator',
  '/calculators/voltage-drop-calculator': 'Voltage Drop Calculator',
  '/calculators/ampacity-calculator': 'Ampacity Calculator',
  '/calculators/ground-wire-calculator': 'Ground Wire Calculator',
  '/calculators/wire-resistance-calculator': 'Wire Resistance Calculator',
  '/calculators/low-voltage-calculator': 'Low Voltage Calculator',
  '/calculators/service-entrance-calculator': 'Service Entrance Calculator',
  '/calculators/watts-to-amps-calculator': 'Watts to Amps Calculator',
  '/calculators/amps-to-watts-calculator': 'Amps to Watts Calculator',
  '/calculators/volts-to-amps-calculator': 'Volts to Amps Calculator',
  '/calculators/kilowatts-to-amps-calculator': 'Kilowatts to Amps Calculator',
  '/calculators/kva-to-amps-calculator': 'kVA to Amps Calculator',
  '/calculators/three-phase-calculator': 'Three Phase Calculator',
  '/calculators/ohms-law-calculator': "Ohm's Law Calculator",
  '/calculators/btu-to-watts-calculator': 'BTU to Watts Calculator',
  '/guides/awg-wire-size-chart': 'AWG Wire Size Chart',
  '/guides/nec-table-310-16': 'NEC Table 310.16',
};

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
const GROUND_WIRE = '/calculators/ground-wire-calculator';
const WIRE_RESISTANCE = '/calculators/wire-resistance-calculator';
const LOW_VOLTAGE = '/calculators/low-voltage-calculator';
const SERVICE_ENTRANCE = '/calculators/service-entrance-calculator';
const AWG_CHART = '/guides/awg-wire-size-chart';
const TABLE_310_16 = '/guides/nec-table-310-16';

export const METHODOLOGY_SECTIONS: MethodologySection[] = [
  {
    id: 'wire-gauge',
    domain: 'awg-geometry',
    title: 'Wire gauge sizes and areas',
    citedOn: [WIRE_SIZE, VOLTAGE_DROP, AMPACITY, GROUND_WIRE, LOW_VOLTAGE, SERVICE_ENTRANCE, AWG_CHART],
  },
  {
    id: 'resistance',
    domain: 'conductor-resistance-20c',
    title: 'Conductor resistance and voltage drop',
    citedOn: [WIRE_SIZE, VOLTAGE_DROP, AMPACITY, WIRE_RESISTANCE, LOW_VOLTAGE, AWG_CHART],
  },
  {
    id: 'ampacity',
    domain: 'nec-310-16',
    title: 'Ampacity',
    citedOn: [WIRE_SIZE, VOLTAGE_DROP, AMPACITY, LOW_VOLTAGE, AWG_CHART, TABLE_310_16],
  },
  {
    id: 'corrections',
    domain: 'nec-310-15-corrections',
    title: 'Ambient temperature and bundling',
    citedOn: [WIRE_SIZE, AMPACITY, TABLE_310_16],
  },
  {
    id: 'small-conductors',
    domain: 'nec-240-4-d',
    title: 'Small-conductor limits',
    citedOn: [WIRE_SIZE, AMPACITY, AWG_CHART, TABLE_310_16],
  },
  {
    id: 'breaker-ratings',
    domain: 'nec-240-ocpd',
    title: 'Standard breaker and fuse ratings',
    citedOn: [WIRE_SIZE, GROUND_WIRE],
  },
  {
    id: 'grounding',
    domain: 'nec-250-grounding',
    title: 'Ground wires and grounding electrode conductors',
    citedOn: [WIRE_SIZE, GROUND_WIRE, SERVICE_ENTRANCE],
  },
  {
    id: 'service-conductors',
    domain: 'nec-310-12',
    title: 'Dwelling services and main feeders',
    citedOn: [SERVICE_ENTRANCE, GROUND_WIRE, TABLE_310_16],
  },
  {
    id: 'power',
    domain: 'power-definitions',
    title: 'Power, current and power factor',
    citedOn: [
      '/calculators/watts-to-amps-calculator',
      '/calculators/amps-to-watts-calculator',
      '/calculators/volts-to-amps-calculator',
      '/calculators/kilowatts-to-amps-calculator',
      '/calculators/kva-to-amps-calculator',
      '/calculators/three-phase-calculator',
      '/calculators/ohms-law-calculator',
    ],
  },
  {
    id: 'conversions',
    domain: 'nist-sp811-conversions',
    title: 'Unit conversions',
    citedOn: ['/calculators/btu-to-watts-calculator', '/calculators/amps-to-watts-calculator'],
  },
  {
    id: 'metric-sizes',
    domain: 'iec-60228-metric-sizes',
    title: 'Metric conductor sizes',
    citedOn: [AWG_CHART],
  },
  {
    id: 'nec-2026',
    domain: 'nec-2026-edition',
    title: 'The 2026 NEC edition',
    citedOn: [TABLE_310_16],
  },
];

/** The sections in a page's reading order that are not one source: the method overview and the closing notes. */
export const METHODOLOGY_EXTRA_SECTIONS = {
  method: { id: 'wire-size-method', title: 'How the wire size calculator picks a size' },
  notCovered: { id: 'not-covered', title: 'Not covered yet' },
  errors: { id: 'errors', title: 'Errors and corrections' },
} as const;
