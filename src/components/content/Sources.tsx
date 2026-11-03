// A page's Sources: under the heading "Sources", one item per data domain, the registry's attribution text without its
// leading "Source: ", linked to its registry URL (never retyped: attributionParts transforms the registry text). When
// every item was retrieved in the month its verified_date falls in, the items drop their " — retrieved {Mon YYYY}"
// segment and one line "Retrieved {Mon YYYY}." follows the list; otherwise each item keeps its own segment. Each item
// carries data-src={domain}, so the numbers in its text trace to it. Server only (registry.ts). The page wraps it in
// its own secondary-section markup and passes that section's classes. The heading is #sources, the target of the
// byline's "Sources below" (WSZ-004a); scroll-mt-20 keeps it clear of the sticky header.
import { clsx } from 'clsx';
import { attribution, attributionParts } from '@/lib/verified/registry';
import { monthOf } from './AsOf';

interface SourcesProps {
  /** Registry domains, in order; repeats are dropped. */
  domains: readonly string[];
  headingClassName?: string;
  listClassName?: string;
  linkClassName?: string;
  /** The "Retrieved" line. */
  noteClassName?: string;
}

export function Sources({ domains, headingClassName, listClassName, linkClassName, noteClassName }: SourcesProps) {
  const items = [...new Set(domains)].map((domain) => {
    const { text, url, verified_date } = attribution(domain);
    return { domain, url, verified_date, ...attributionParts(text) };
  });
  if (items.length === 0) throw new Error('<Sources> needs at least one domain');
  const retrieved = items[0].retrieved;
  const oneMonth = retrieved !== null && items.every((item) => item.retrieved === retrieved && monthOf(item.verified_date) === retrieved);
  return (
    <>
      <h2 id="sources" className={clsx('scroll-mt-20', headingClassName)}>
        Sources
      </h2>
      <ul className={listClassName}>
        {items.map((item) => (
          <li key={item.domain} data-src={item.domain}>
            <a href={item.url} className={linkClassName}>
              {oneMonth ? item.short : item.full}
            </a>
          </li>
        ))}
      </ul>
      {oneMonth && (
        <p className={noteClassName}>
          Retrieved <time dateTime={items[0].verified_date.slice(0, 7)}>{retrieved}</time>.
        </p>
      )}
    </>
  );
}
