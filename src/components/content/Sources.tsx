// A page's Sources: under the heading "Sources", one item per data domain, the registry's attribution text linked to
// its registry URL (never hand-typed), then <AsOf>: one line when every domain was verified in the same month,
// otherwise the month under each item. Each item carries data-src={domain}, so the numbers in its text trace to it.
// Server only (registry.ts). The page wraps it in its own secondary-section markup and passes that section's classes.
import { attribution } from '@/lib/verified/registry';
import { AsOf } from './AsOf';

interface SourcesProps {
  /** Registry domains, in order; repeats are dropped. */
  domains: readonly string[];
  headingClassName?: string;
  listClassName?: string;
  linkClassName?: string;
  /** The "Data as of" line. */
  noteClassName?: string;
}

export function Sources({ domains, headingClassName, listClassName, linkClassName, noteClassName }: SourcesProps) {
  const items = [...new Set(domains)].map((domain) => ({ domain, ...attribution(domain) }));
  if (items.length === 0) throw new Error('<Sources> needs at least one domain');
  const oneMonth = new Set(items.map((item) => item.verified_date.slice(0, 7))).size === 1;
  return (
    <>
      <h2 className={headingClassName}>Sources</h2>
      <ul className={listClassName}>
        {items.map((item) => (
          <li key={item.domain} data-src={item.domain}>
            <a href={item.url} className={linkClassName}>
              {item.text}
            </a>
            {!oneMonth && <AsOf domain={item.domain} className={noteClassName} />}
          </li>
        ))}
      </ul>
      {oneMonth && <AsOf domain={items[0].domain} className={noteClassName} />}
    </>
  );
}
