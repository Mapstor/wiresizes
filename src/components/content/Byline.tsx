// The byline of the 24 content and tool pages (D-18): "By Marko Visic, BSc Physics · Updated {Month D, YYYY}", plus
// " · Sources below" where the page renders <Sources>. The name links to /about and "Sources below" to the Sources
// heading (#sources); the date is the route's modified date in src/data/page-dates.json (D-17). One small muted line:
// the page passes the text and link classes of the surface it sits on. data-byline marks it for check-structure 20.
// A client component (GuideClient.tsx) gets it as a prop from its server page.tsx, so it is in the server HTML.
import Link from 'next/link';
import { AUTHOR_CREDENTIAL, AUTHOR_NAME } from '@/lib/identity';
import { formatDate, pageDates } from '@/lib/page-dates';

interface BylineProps {
  /** The page's route, e.g. "/guides/nec-table-310-16". */
  route: string;
  /** True where the page renders <Sources>. */
  sources?: boolean;
  className?: string;
  linkClassName?: string;
}

export function Byline({
  route,
  sources = false,
  className = 'text-sm text-gray-600',
  linkClassName = 'text-blue-600 hover:underline',
}: BylineProps) {
  const { modified } = pageDates(route);
  return (
    <p data-byline="" className={className}>
      By{' '}
      <Link href="/about" className={linkClassName}>
        {AUTHOR_NAME}
      </Link>
      , {AUTHOR_CREDENTIAL} · Updated <time dateTime={modified}>{formatDate(modified)}</time>
      {sources && (
        <>
          {' · '}
          <a href="#sources" className={linkClassName}>
            Sources below
          </a>
        </>
      )}
    </p>
  );
}
