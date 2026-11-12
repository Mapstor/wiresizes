// /methodology (WSZ-004b): one section per verified source domain that a live page's <Sources> lists, in reading
// order, each with the live pages whose Sources list it ("Cited on"), named as the route list names them
// (src/lib/routes.ts, D-26). nec-110-14c stays off until WSZ-009 adds
// it to the wire size calculator's Sources (D-06); domains that no live page cites (nec-continuous-load,
// doe-efficiency-standards and the rest) stay off too (WSZ-017 answers 10 and 12). check-structure 24 compares these
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
const GROUND_WIRE = '/calculators/ground-wire-calculator';
const WIRE_RESISTANCE = '/calculators/wire-resistance-calculator';
const LOW_VOLTAGE = '/calculators/low-voltage-calculator';
const SERVICE_ENTRANCE = '/calculators/service-entrance-calculator';
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
    citedOn: [WIRE_SIZE, VOLTAGE_DROP, AMPACITY, GROUND_WIRE, LOW_VOLTAGE, SERVICE_ENTRANCE, AWG_CHART, HOME],
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
    citedOn: [WIRE_SIZE, VOLTAGE_DROP, AMPACITY, LOW_VOLTAGE, AWG_CHART, TABLE_310_16, HOME],
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
    citedOn: [WIRE_SIZE, AMPACITY, AWG_CHART, TABLE_310_16, HOME],
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
    citedOn: [EDITIONS, TABLE_310_16],
  },
];

/** Link text of the pages a section cites, by route: each page's name in the route list (src/lib/routes.ts). */
export const CITED_PAGE_NAMES: Record<string, string> = Object.fromEntries(
  [...new Set(METHODOLOGY_SECTIONS.flatMap((s) => s.citedOn))].map((route) => [route, pageName(route)]),
);

/** The sections in a page's reading order that are not one source: the method overview and the closing notes. */
export const METHODOLOGY_EXTRA_SECTIONS = {
  method: { id: 'wire-size-method', title: 'How the wire size calculator picks a size' },
  notCovered: { id: 'not-covered', title: 'Not covered yet' },
  errors: { id: 'errors', title: 'Errors and corrections' },
} as const;
