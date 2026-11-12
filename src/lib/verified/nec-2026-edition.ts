// The 2026 NEC facts the pages state, read from two registry rows (research/data-sources.csv) so no date or size is
// typed into a page (WSZ-005c): nec-2026-issuance (NFPA Standards Council minutes, August 2025: the issue and
// effective dates, and the appeal decision that kept the 310.5 minimum sizes in the issued text) and nec-2026-edition
// (Minnesota DLI's summary of the issued edition: the changes). Server only (registry.ts reads the CSV). Throws when
// the registry words a fact differently: fix the pattern here, never type the value into a page.
import 'server-only';
import { coverage } from './registry';
import type { SizeKey } from './awg';

/** Minnesota DLI's summary of significant changes in the issued 2026 edition. */
export const NEC_2026_DOMAIN = 'nec-2026-edition';
/** NFPA Standards Council minutes: issue and effective dates, appeal decisions on the final text. */
export const NEC_2026_ISSUANCE_DOMAIN = 'nec-2026-issuance';

const changes = coverage(NEC_2026_DOMAIN);
const issuance = coverage(NEC_2026_ISSUANCE_DOMAIN);

function match(text: string, domain: string, re: RegExp, what: string): RegExpExecArray {
  const m = re.exec(text);
  if (!m) throw new Error(`data-sources.csv ${domain} coverage: no ${what}`);
  return m;
}

const dates = match(issuance, NEC_2026_ISSUANCE_DOMAIN, /issued (\d{4}-\d{2}-\d{2}), effective (\d{4}-\d{2}-\d{2})/, 'issued/effective dates');
/** YYYY-MM-DD (nec-2026-issuance) */
export const NEC_2026_ISSUED = dates[1];
/** YYYY-MM-DD (nec-2026-issuance) */
export const NEC_2026_EFFECTIVE = dates[2];

const sizes = match(changes, NEC_2026_DOMAIN, /310\.5\(A\) minimum sizes (\d+) AWG Cu \/ (\d+) AWG CCA \/ (\d+) AWG Al/, 'minimum sizes');
/** 2026 NEC 310.5 (2023: 310.3(A)): the smallest permitted size per material (nec-2026-edition). */
export const NEC_2026_MIN_SIZES: { Cu: SizeKey; CCA: SizeKey; Al: SizeKey } = { Cu: sizes[1], CCA: sizes[2], Al: sizes[3] };

// The Standards Council's decision D#25-8 names the same copper and copper-clad aluminum sizes as in the issued text
const upheld = match(
  issuance,
  NEC_2026_ISSUANCE_DOMAIN,
  /310\.5\(A\) as amended by Second Revision \d+ is in the issued edition, recognizing (\d+) AWG copper and (\d+) AWG copper-clad aluminum/,
  'the 310.5(A) appeal decision',
);
if (upheld[1] !== NEC_2026_MIN_SIZES.Cu || upheld[2] !== NEC_2026_MIN_SIZES.CCA) {
  throw new Error(`data-sources.csv: nec-2026-issuance gives ${upheld[1]} AWG Cu / ${upheld[2]} AWG CCA, nec-2026-edition ${NEC_2026_MIN_SIZES.Cu} / ${NEC_2026_MIN_SIZES.CCA}`);
}

match(changes, NEC_2026_DOMAIN, /Article 220 → Article 120/, 'Article 220 → Article 120');

const gfci = match(
  changes,
  NEC_2026_DOMAIN,
  /210\.8\(F\) outdoor-outlet GFCI threshold (\d+) A → (\d+) A for single-phase branch circuits rated (\d+) V or less to ground/,
  'the 210.8(F) threshold',
);
/** 210.8(F), outdoor outlets at dwellings: the branch-circuit rating GFCI protection reaches, 2023 and 2026, and the
 *  voltage to ground it applies at or below. */
export const NEC_2026_OUTDOOR_GFCI = { fromA: Number(gfci[1]), toA: Number(gfci[2]), maxVoltsToGround: Number(gfci[3]) };

// Stated in words only on the pages; the patterns hold the wording the copy relies on
match(changes, NEC_2026_DOMAIN, /120\.7 Power Control System \(energy management systems renamed power control systems\)/, '120.7 power control systems');
match(changes, NEC_2026_DOMAIN, /230\.70\(A\)\(1\) one- and two-family dwelling service disconnect in a readily accessible outdoor location/, '230.70 outdoor disconnect');
