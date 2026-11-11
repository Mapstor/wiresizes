// Which NEC edition the site's code values come from, and the 2026 edition's issue and effective dates, read from the
// registry row nec-2026-edition (src/lib/verified/nec-2026-edition.ts), for the homepage and the two hubs (WSZ-005b).
// A page that renders it lists nec-2026-edition under Sources. Server only (the module reads the registry).
import { formatDate } from '@/lib/page-dates';
import { NEC_2026_DOMAIN, NEC_2026_EFFECTIVE, NEC_2026_ISSUED } from '@/lib/verified/nec-2026-edition';

export function EditionNote({ className }: { className?: string }) {
  return (
    <p data-src={NEC_2026_DOMAIN} className={className}>
      Code values on this site come from the 2023 edition of the National Electrical Code (NEC) unless a page names another. NFPA issued
      the 2026 edition on <time dateTime={NEC_2026_ISSUED}>{formatDate(NEC_2026_ISSUED)}</time>, effective{' '}
      <time dateTime={NEC_2026_EFFECTIVE}>{formatDate(NEC_2026_EFFECTIVE)}</time>, and the edition that applies is the one adopted where the
      work is done.
    </p>
  );
}
