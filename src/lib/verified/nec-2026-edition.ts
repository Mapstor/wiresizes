// The registry row nec-2026-edition (research/data-sources.csv): final-edition facts of NFPA 70-2026, read from its
// coverage text so no date or size is typed into a page. Server only (registry.ts reads the CSV). Throws when the
// registry words a fact differently: fix the pattern here, never type the value into a page.
import 'server-only';
import { coverage } from './registry';
import type { SizeKey } from './awg';

export const NEC_2026_DOMAIN = 'nec-2026-edition';

const text = coverage(NEC_2026_DOMAIN);

function match(re: RegExp, what: string): RegExpExecArray {
  const m = re.exec(text);
  if (!m) throw new Error(`data-sources.csv nec-2026-edition coverage: no ${what}`);
  return m;
}

const dates = match(/issued (\d{4}-\d{2}-\d{2}), effective (\d{4}-\d{2}-\d{2})/, 'issued/effective dates');
/** YYYY-MM-DD */
export const NEC_2026_ISSUED = dates[1];
/** YYYY-MM-DD */
export const NEC_2026_EFFECTIVE = dates[2];

const sizes = match(/310\.3 → 310\.5 with minimum sizes (\d+) AWG Cu \/ (\d+) AWG CCA \/ (\d+) AWG Al/, 'minimum sizes');
/** 2026 NEC 310.5 (was 310.3): the smallest permitted size per material. */
export const NEC_2026_MIN_SIZES: { Cu: SizeKey; CCA: SizeKey; Al: SizeKey } = { Cu: sizes[1], CCA: sizes[2], Al: sizes[3] };

match(/Article 220 → Article 120/, 'Article 220 → Article 120');
