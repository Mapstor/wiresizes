// The site's live calculators and guides, in reading order (WSZ-005b, D-26): one entry per page. The homepage,
// /calculators, /guides, the guides navigation, the sitemap and the "Cited on" names on /methodology all read this
// list, so a page added here shows up in each of them, and a page that is not here shows up in none.
// tests/wsz005b-home-hubs.test.ts fails when an entry is a withdrawn route (research/wsz002-withdrawals.csv) or a
// redirect source (next.config.ts), when it has no src/data/page-dates.json entry, or when a dated calculator or guide
// is missing here. Names render with data-name (D-20). Lines are reader text with no numbers, so they need no
// citation; NEC section references in them come from research/nec-sections-allowlist.csv. Pure data, no JSX: the
// tests import it.

export type Section = 'calculators' | 'guides';

export interface RouteGroup {
  id: string;
  section: Section;
  /** The group's heading on the homepage, the hubs and the guides navigation. */
  title: string;
}

export const GROUPS = [
  { id: 'wire-sizing', section: 'calculators', title: 'Wire and conductor sizing' },
  { id: 'load-calcs', section: 'calculators', title: 'Load calculations' },
  { id: 'conversions', section: 'calculators', title: 'Power and unit conversions' },
  { id: 'tables', section: 'guides', title: 'Charts and code tables' },
  { id: 'service-circuit', section: 'guides', title: 'Wire size by service or circuit' },
  { id: 'basics', section: 'guides', title: 'Power and circuit basics' },
] as const satisfies readonly RouteGroup[];

export type GroupId = (typeof GROUPS)[number]['id'];

export interface SiteRoute {
  path: string;
  group: GroupId;
  /** The page's name in navigation and related links. */
  name: string;
  /** One factual line: what the page gives the reader. */
  line: string;
  /** Listed under Calculators in the guides navigation. */
  guidesNav?: true;
}

export const ROUTES: readonly SiteRoute[] = [
  {
    path: '/calculators/wire-size-calculator',
    group: 'wire-sizing',
    name: 'Wire Size Calculator',
    line: 'Copper or aluminum wire size for a breaker or fuse rating, from NEC Table 310.16 at the terminal temperature, with heat, bundling, continuous loads, the ground wire and voltage drop.',
    guidesNav: true,
  },
  {
    path: '/calculators/ampacity-calculator',
    group: 'wire-sizing',
    name: 'Ampacity Calculator',
    line: 'Allowable ampacity of a copper or aluminum conductor from NEC Table 310.16, corrected for the surrounding temperature and for more than three current-carrying conductors.',
    guidesNav: true,
  },
  {
    path: '/calculators/circuit-breaker-calculator',
    group: 'wire-sizing',
    name: 'Circuit Breaker Calculator',
    line: 'Breaker or fuse size for a continuous and a noncontinuous load under NEC 210.20(A), the next standard rating from Table 240.6(A), and the wire and ground wire it needs.',
  },
  {
    path: '/calculators/voltage-drop-calculator',
    group: 'wire-sizing',
    name: 'Voltage Drop Calculator',
    line: 'Voltage drop in volts and percent for a DC, single-phase or three-phase run, or the smallest wire size that keeps it within your target.',
    guidesNav: true,
  },
  {
    path: '/calculators/ground-wire-calculator',
    group: 'wire-sizing',
    name: 'Ground Wire Calculator',
    line: 'Equipment grounding conductor size for a breaker or fuse rating, copper or aluminum, from NEC Table 250.122.',
  },
  {
    path: '/calculators/service-entrance-calculator',
    group: 'wire-sizing',
    name: 'Service Entrance Calculator',
    line: 'Dwelling service conductors from NEC Table 310.12, with the grounding electrode conductor and the voltage drop over your run.',
  },
  {
    path: '/calculators/wire-resistance-calculator',
    group: 'wire-sizing',
    name: 'Wire Resistance Calculator',
    line: 'Resistance in ohms of a copper or aluminum run, one conductor and a two-wire circuit, at the temperature you choose.',
  },
  {
    path: '/calculators/low-voltage-calculator',
    group: 'wire-sizing',
    name: 'Low Voltage Calculator',
    line: 'Copper wire size for a low-voltage DC circuit from the load, the one-way length and your voltage-drop target, checked against the current.',
  },
  {
    path: '/calculators/residential-load-calculator',
    group: 'load-calcs',
    name: 'Residential Load Calculator',
    line: "A dwelling's calculated load by the NEC standard and optional methods, side by side with every step, and the service rating and conductors from Table 310.12.",
  },
  {
    path: '/calculators/range-calculator',
    group: 'load-calcs',
    name: 'Range Calculator',
    line: 'Branch-circuit load of a range, or a cooktop and wall ovens, by NEC Table 220.55, its current, and the wire and ground wire for the circuit the range instructions give.',
  },
  {
    path: '/calculators/watts-to-amps-calculator',
    group: 'conversions',
    name: 'Watts to Amps Calculator',
    line: 'Amps from watts and the voltage for DC, single-phase and three-phase loads, with a table of amps by watts.',
  },
  {
    path: '/calculators/amps-to-watts-calculator',
    group: 'conversions',
    name: 'Amps to Watts Calculator',
    line: 'Watts from amps and the voltage for DC, single-phase and three-phase loads, with a table of watts by amps.',
  },
  {
    path: '/calculators/volts-to-amps-calculator',
    group: 'conversions',
    name: 'Volts to Amps Calculator',
    line: 'Amps from the voltage and either the power in watts or the resistance in ohms, single-phase or three-phase.',
  },
  {
    path: '/calculators/kilowatts-to-amps-calculator',
    group: 'conversions',
    name: 'Kilowatts to Amps Calculator',
    line: 'Amps from kilowatts and the power factor, single-phase or three-phase, with a table of amps per kW.',
  },
  {
    path: '/calculators/kva-to-amps-calculator',
    group: 'conversions',
    name: 'kVA to Amps Calculator',
    line: "Amps from a kVA rating, such as a transformer's or a generator's, single-phase or three-phase, with a table of amps by kVA.",
  },
  {
    path: '/calculators/three-phase-calculator',
    group: 'conversions',
    name: 'Three Phase Calculator',
    line: 'Three-phase amps, kW, kVA, kVAR and power factor from the line-to-line voltage and any two known values, with the capacitor bank for a target power factor.',
  },
  {
    path: '/calculators/ohms-law-calculator',
    group: 'conversions',
    name: "Ohm's Law Calculator",
    line: 'Any two of volts, amps, ohms and watts give the other two, with all twelve formulas.',
  },
  {
    path: '/calculators/btu-to-watts-calculator',
    group: 'conversions',
    name: 'BTU to Watts Calculator',
    line: "Btu per hour, watts and tons of refrigeration from any one of them, on NIST's conversion factors.",
  },
  {
    path: '/guides/awg-wire-size-chart',
    group: 'tables',
    name: 'AWG Wire Size Chart',
    line: 'Diameter, area, resistance and weight of each AWG gauge in the NIST copper wire tables, and the kcmil sizes, with metric sizes and NEC ampacity.',
  },
  {
    path: '/guides/nec-table-310-16',
    group: 'tables',
    name: 'NEC Table 310.16',
    line: 'Every row of the 2023 ampacity table for copper and aluminum, with the corrections for temperature and conductor count and a worked example.',
  },
  {
    path: '/guides/nec-code-compliance',
    group: 'tables',
    name: 'NEC Edition by State',
    line: 'The National Electrical Code edition each state has adopted, with its start date, who it covers and any scheduled change, from state records.',
  },
  {
    path: '/guides/wire-size-for-100-amp',
    group: 'service-circuit',
    name: 'Wire Size for 100 Amp Service',
    line: 'Copper and aluminum conductors for a dwelling service from NEC Table 310.12, with the grounding conductors.',
  },
  {
    path: '/guides/wire-size-for-200-amp',
    group: 'service-circuit',
    name: 'Wire Size for 200 Amp Service',
    line: 'Dwelling service conductors from NEC Table 310.12 beside Table 310.16 for other feeders, with the ground wires and the voltage drop.',
  },
  {
    path: '/guides/wire-size-for-ev-charger',
    group: 'service-circuit',
    name: 'EV Charger Wire Size Guide',
    line: 'How the EV charging levels differ, and the circuit and wire size for a charger at home.',
  },
  {
    path: '/guides/electrical-power-calculations',
    group: 'basics',
    name: 'Electrical Power Calculations',
    line: 'Formulas linking watts, amps, volts and power factor in DC, single-phase and three-phase circuits, with worked examples.',
  },
  {
    path: '/guides/power-factor-explained',
    group: 'basics',
    name: 'Power Factor Explained',
    line: 'Power factor as real power over apparent power, why a low one raises the current, and the capacitor kVAR that corrects it.',
  },
  {
    path: '/guides/single-vs-three-phase',
    group: 'basics',
    name: 'Single vs Three Phase Systems',
    line: 'One AC voltage or three: how the power, the current for the same load and the US voltages differ.',
  },
];

/** The homepage and the two hubs, by route: their names where another page lists them (the "Cited on" lines of /methodology). */
export const HUB_NAMES: Readonly<Record<string, string>> = {
  '/': 'Homepage',
  '/calculators': 'Electrical Calculators',
  '/guides': 'Electrical Guides',
};

export function sectionOf(path: string): Section {
  if (path.startsWith('/calculators/')) return 'calculators';
  if (path.startsWith('/guides/')) return 'guides';
  throw new Error(`routes.ts: ${path} is neither a calculator nor a guide`);
}

/** A section's routes in list order. */
export function sectionRoutes(section: Section): SiteRoute[] {
  return ROUTES.filter((r) => sectionOf(r.path) === section);
}

/** A section's groups in order, each with its routes; a group with no routes is left out. */
export function sectionGroups(section: Section): { group: RouteGroup; routes: SiteRoute[] }[] {
  return GROUPS.filter((g) => g.section === section)
    .map((group) => ({ group, routes: ROUTES.filter((r) => r.group === group.id) }))
    .filter((g) => g.routes.length > 0);
}

/** A page's name: a calculator's or guide's from ROUTES, or the homepage's or a hub's from HUB_NAMES. Throws for any other route. */
export function pageName(path: string): string {
  const name = ROUTES.find((r) => r.path === path)?.name ?? HUB_NAMES[path];
  if (name === undefined) throw new Error(`routes.ts: no page name for ${path}`);
  return name;
}
