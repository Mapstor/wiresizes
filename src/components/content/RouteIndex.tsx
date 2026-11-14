// The homepage's and the hubs' lists of pages, from the route list (src/lib/routes.ts, D-26), so a page added there or
// dropped from it changes every list at once. Names carry data-name (D-20). Server component, no client JS.
import Link from 'next/link';
import { LOOK_H2 } from '@/components/look/styles';
import { sectionGroups } from '@/lib/routes';
import type { Section } from '@/lib/routes';

/** A link in the index: the look's link (D-33), ink with a copper underline that deepens on hover. */
export const INDEX_LINK =
  'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px] hover:text-cut-deep hover:decoration-cut-deep';

/** The homepage's compact index: each group of a section as a short heading over its page names. */
export function RouteLinks({ section, columnsClassName }: { section: Section; columnsClassName: string }) {
  return (
    <div className={columnsClassName}>
      {sectionGroups(section).map(({ group, routes }) => (
        <div key={group.id}>
          <h3 id={`${group.id}-links`} className="font-display text-[15px] font-semibold text-cut-muted">
            {group.title}
          </h3>
          <ul aria-labelledby={`${group.id}-links`} className="mt-2">
            {routes.map((r) => (
              <li key={r.path}>
                <Link href={r.path} data-name="" className={`${INDEX_LINK} inline-block py-1.5 text-[17px]`}>
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** A hub's index: one section per group, each page's name beside its one-line description. */
export function RouteList({ section }: { section: Section }) {
  return (
    <>
      {sectionGroups(section).map(({ group, routes }) => (
        <section key={group.id} aria-labelledby={group.id} className="scroll-mt-24">
          <h2 id={group.id} className={`${LOOK_H2} border-b-2 border-ink pb-3`}>
            {group.title}
          </h2>
          <dl className="divide-y divide-cut-rule">
            {routes.map((r) => (
              <div key={r.path} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8">
                <dt className="text-[17px] font-semibold">
                  <Link href={r.path} data-name="" className={INDEX_LINK}>
                    {r.name}
                  </Link>
                </dt>
                <dd className="max-w-[35rem] text-[17px] leading-[1.6] text-ink">{r.line}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </>
  );
}
