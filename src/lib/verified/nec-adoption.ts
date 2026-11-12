// data/verified/nec-adoption.json: the NEC edition in force by state, from state and DC government records, rendered
// per the file's rules array (WSZ-005c). Pure data, no JSX: the tests import it. What a rule states only in its text
// (the jurisdiction total, the reasons a state is not verified, the local-adoption label, the next-change wording, the
// Tennessee qualifier) is read from that text, and a reworded rule throws at load: fix the pattern here, never type the
// value into a page (DEVLOG §4).
import data from '../../../data/verified/nec-adoption.json';

export const NEC_ADOPTION_DOMAIN = 'nec-adoption';
/** The editions page's state table, where each row links its state's record. */
export const ADOPTION_TABLE_HREF = '/guides/nec-code-compliance#states';

export type AdoptionRow = (typeof data.states)[number];

/** YYYY-MM-DD: the day the rows were verified as a set. */
export const ADOPTION_AS_OF: string = data.as_of;

function rule(re: RegExp, what: string): RegExpExecArray {
  for (const text of data.rules) {
    const m = re.exec(text);
    if (m) return m;
  }
  throw new Error(`nec-adoption.json rules: no ${what}`);
}

// Rule 0: only rows with status "verified" render (HI, "conflicting", stays in the file for its notes)
rule(/^Render only rows with status 'verified'\./, 'verified-rows rule');

/** The rows a page renders, in the file's order. */
export function adoption(): AdoptionRow[] {
  return data.states.filter((row) => row.status === 'verified');
}

// Rule 2: counts are per jurisdiction, one separately listed city excluded, a state with two rows counted once
const counting = rule(
  /^Counts are per jurisdiction: distinct state codes, ([A-Z]{2}-[A-Z]+) excluded and ([A-Z]{2}) counted once, out of (\d+) \((\d+) states and DC\)\.$/,
  'jurisdiction count rule',
);
const EXCLUDED_ROW = counting[1];
/** The jurisdictions the counts are out of: the states and DC. */
export const JURISDICTION_TOTAL = Number(counting[3]);

// Rule 1: checked states without a verified edition, each with the reason the file gives
const notVerifiedText = rule(
  /^States in not_verified were checked but have no verified edition: list them as 'not verified', with no edition\. (.+) A state with no row that is not in not_verified is 'not yet checked' \(none at present\)\.$/,
  'not-verified rule',
)[1];
export const NOT_VERIFIED: { state: string; reason: string }[] = data.not_verified.map((state) => {
  const m = new RegExp(`(?:^| )${state}: (.+?\\.)(?= [A-Z]{2}: |$)`).exec(notVerifiedText);
  if (!m) throw new Error(`nec-adoption.json rules: no reason for ${state}`);
  return { state, reason: m[1] };
});

// Rule 6: the label for rows with no statewide code
const LOCAL = 'local';
export const LOCAL_LABEL = rule(/^Rows with edition 'local' mean no single statewide electrical code: render '([^']+)' plus the scope text\.$/, 'local-adoption label')[1];

// Rule 9: the wording of a scheduled change, with and without a date
const nextChange = rule(/^next_change: with a date, say '([^']+)'; without a date, say (the \{edition\} NEC is proposed or pending), never a date\.$/, 'next-change wording');
const NEXT_DATED = nextChange[1];
const NEXT_UNDATED = nextChange[2];
if (!NEXT_DATED.includes('{edition}') || !NEXT_DATED.includes('{date}')) throw new Error('nec-adoption.json rules: next-change wording without {edition} or {date}');

// Rule 10: Tennessee's qualifier after the edition
const qualifier = rule(/^([A-Z]{2}): after the edition add '(.+?)'; /, 'state qualifier');
const QUALIFIED_STATE = qualifier[1];
const QUALIFIER = qualifier[2];

/** "2023 NEC", or the local-adoption label. */
export function editionLabel(edition: string): string {
  return edition === LOCAL ? LOCAL_LABEL : `${edition} NEC`;
}

/** The text rule 10 puts after a row's edition, or null. */
export function editionQualifier(row: AdoptionRow): string | null {
  return row.state === QUALIFIED_STATE ? QUALIFIER : null;
}

/**
 * A row's scheduled change in the file's wording, as parts so the page can render the date in a <time>: dated,
 * "changes to the 2023 NEC on {date}"; undated, "the 2023 NEC is proposed or pending". Null when none is scheduled.
 */
export function nextChangeParts(row: AdoptionRow): { before: string; date: string | null; after: string } | null {
  const next = row.next_change;
  if (!next) return null;
  if (next.effective) {
    const [before, after] = NEXT_DATED.replace('{edition}', next.edition).split('{date}');
    return { before, date: next.effective, after };
  }
  return { before: NEXT_UNDATED.replace('{edition}', next.edition), date: null, after: '' };
}

/** USPS codes to names. NY-NYC is New York City's own row. */
export const STATE_NAMES: Readonly<Record<string, string>> = {
  AK: 'Alaska', AL: 'Alabama', AR: 'Arkansas', AZ: 'Arizona', CA: 'California', CO: 'Colorado', CT: 'Connecticut',
  DC: 'District of Columbia', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', IA: 'Iowa', ID: 'Idaho',
  IL: 'Illinois', IN: 'Indiana', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', MA: 'Massachusetts', MD: 'Maryland',
  ME: 'Maine', MI: 'Michigan', MN: 'Minnesota', MO: 'Missouri', MS: 'Mississippi', MT: 'Montana', NC: 'North Carolina',
  ND: 'North Dakota', NE: 'Nebraska', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NV: 'Nevada',
  NY: 'New York', 'NY-NYC': 'New York City', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
  VA: 'Virginia', VT: 'Vermont', WA: 'Washington', WI: 'Wisconsin', WV: 'West Virginia', WY: 'Wyoming',
};

export function stateName(code: string): string {
  const name = STATE_NAMES[code];
  if (!name) throw new Error(`nec-adoption: no name for "${code}"`);
  return name;
}

/** The rows a page renders, by state name; a state's rows keep the file's order (Ohio: commercial, then residential). */
export function adoptionByName(): AdoptionRow[] {
  return adoption()
    .map((row, i) => ({ row, i }))
    .sort((a, b) => stateName(a.row.state).localeCompare(stateName(b.row.state), 'en-US') || a.i - b.i)
    .map(({ row }) => row);
}

export interface EditionGroup {
  edition: string;
  /** State codes, each state once, by name. */
  states: string[];
}

/**
 * The jurisdictions on each edition (rule 2): one entry per state code, the separately listed city left out, newest
 * edition first and local adoption last. Throws when one state's rows name two editions, or when the verified and
 * not-verified states do not add up to the total (rule 1: no state is "not yet checked").
 */
export function editionGroups(): EditionGroup[] {
  const byState = new Map<string, string>();
  for (const row of adoption()) {
    if (row.state === EXCLUDED_ROW) continue;
    const seen = byState.get(row.state);
    if (seen !== undefined && seen !== row.edition) throw new Error(`nec-adoption.json: ${row.state} rows name ${seen} and ${row.edition}`);
    byState.set(row.state, row.edition);
  }
  if (byState.size + NOT_VERIFIED.length !== JURISDICTION_TOTAL) {
    throw new Error(`nec-adoption.json: ${byState.size} verified + ${NOT_VERIFIED.length} not verified ≠ ${JURISDICTION_TOTAL}`);
  }
  for (const { state } of NOT_VERIFIED) if (byState.has(state)) throw new Error(`nec-adoption.json: ${state} is both verified and not verified`);
  const editions = [...new Set(byState.values())].sort((a, b) => (a === LOCAL ? 1 : b === LOCAL ? -1 : Number(b) - Number(a)));
  return editions.map((edition) => ({
    edition,
    states: [...byState].filter(([, e]) => e === edition).map(([state]) => state).sort((a, b) => stateName(a).localeCompare(stateName(b), 'en-US')),
  }));
}

/** The verified jurisdictions (rule 2). */
export function verifiedCount(): number {
  return editionGroups().reduce((n, g) => n + g.states.length, 0);
}

/** The newest edition any state has adopted, and its group. */
export function newestEdition(): EditionGroup {
  const group = editionGroups().find((g) => g.edition !== LOCAL);
  if (!group) throw new Error('nec-adoption.json: no edition rows');
  return group;
}

/** The earliest and the latest start date among the rows on an edition (rows with no start date left out). */
export function startDateRange(edition: string): { first: AdoptionRow; last: AdoptionRow } | null {
  const dated = adoption()
    .filter((row) => row.edition === edition && row.state !== EXCLUDED_ROW && row.effective !== null)
    .sort((a, b) => (a.effective as string).localeCompare(b.effective as string));
  return dated.length ? { first: dated[0], last: dated[dated.length - 1] } : null;
}

/**
 * Source links that answered 404 when WSZ-005c checked every row's link (2026-11-12): those rows show their publisher
 * without a link until the state's record is read again and the data file regenerated (DEVLOG §5). A URL here that the
 * data file no longer holds fails tests/wsz005c-editions.test.ts, so the list empties itself with the next data file.
 */
export const OFFLINE_SOURCE_URLS: ReadonlySet<string> = new Set([
  'https://doa.louisiana.gov/media/1kbejceb/2312emr003.pdf',
  'https://dsps.wi.gov/Documents/NewsMedia/20260901NewElectricalCodeNewsRelease.pdf',
]);

/** "a, b and c" (the site's lists take no serial comma). */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}
