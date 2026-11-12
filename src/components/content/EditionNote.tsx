// Which NEC edition the site's code values come from, for the homepage and the two hubs (WSZ-005b), with the 2026
// edition's dates (nec-2026-issuance), the states that have adopted the newest edition (nec-adoption) and a link to the
// editions page (WSZ-005c). Each page that renders it lists EDITION_NOTE_DOMAINS under Sources. Server only
// (nec-2026-edition.ts reads the registry).
import Link from 'next/link';
import { formatDate } from '@/lib/page-dates';
import { NEC_2026_EFFECTIVE, NEC_2026_ISSUANCE_DOMAIN, NEC_2026_ISSUED } from '@/lib/verified/nec-2026-edition';
import { ADOPTION_AS_OF, joinNames, NEC_ADOPTION_DOMAIN, newestEdition, stateName } from '@/lib/verified/nec-adoption';

/** The domains the edition line cites, for the Sources of the pages that render it. */
export const EDITION_NOTE_DOMAINS = [NEC_2026_ISSUANCE_DOMAIN, NEC_ADOPTION_DOMAIN] as const;

const monthYear = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export function EditionNote({ className, linkClassName }: { className?: string; linkClassName?: string }) {
  const newest = newestEdition();
  const object = newest.edition === '2026' ? 'it' : `the ${newest.edition} edition`;
  return (
    <p className={className}>
      Code values on this site come from the 2023 edition of the National Electrical Code (NEC) unless a page names another. NFPA issued the
      2026 edition on{' '}
      <time dateTime={NEC_2026_ISSUED} data-src={NEC_2026_ISSUANCE_DOMAIN}>
        {formatDate(NEC_2026_ISSUED)}
      </time>
      , effective{' '}
      <time dateTime={NEC_2026_EFFECTIVE} data-src={NEC_2026_ISSUANCE_DOMAIN}>
        {formatDate(NEC_2026_EFFECTIVE)}
      </time>
      ; as of{' '}
      <time dateTime={ADOPTION_AS_OF} data-src={NEC_ADOPTION_DOMAIN}>
        {monthYear(ADOPTION_AS_OF)}
      </time>
      ,{' '}
      <span data-src={NEC_ADOPTION_DOMAIN}>
        {joinNames(newest.states.map(stateName))} {newest.states.length === 1 ? 'has' : 'have'} adopted {object}
      </span>
      . The edition that applies is the one adopted where the work is done, and{' '}
      <Link href="/guides/nec-code-compliance" className={linkClassName}>
        NEC edition by state
      </Link>{' '}
      lists it for each state.
    </p>
  );
}
