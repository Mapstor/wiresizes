// The homepage's and the hubs' lists of pages, from the route list (src/lib/routes.ts, D-26), so a page added there or
// dropped from it changes every list at once. Names carry data-name (D-20). Server component, no client JS.
import Link from 'next/link';
import { sectionGroups } from '@/lib/routes';
import type { Section } from '@/lib/routes';

/** A link in the index: underlined in a light tint, the tint darkening on hover (links are never told apart by color alone). */
export const INDEX_LINK =
  'text-blue-700 underline decoration-blue-300 decoration-1 underline-offset-4 hover:text-blue-900 hover:decoration-blue-700';

/** The homepage's compact index: each group of a section as a short heading over its page names. */
export function RouteLinks({ section, columnsClassName }: { section: Section; columnsClassName: string }) {
  return (
    <div className={columnsClassName}>
      {sectionGroups(section).map(({ group, routes }) => (
        <div key={group.id}>
          <h3 id={`${group.id}-links`} className="text-base font-semibold text-gray-900">
            {group.title}
          </h3>
          <ul aria-labelledby={`${group.id}-links`} className="mt-2">
            {routes.map((r) => (
              <li key={r.path}>
                <Link href={r.path} data-name="" className={`${INDEX_LINK} inline-block py-1.5`}>
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
        <section key={group.id} aria-labelledby={group.id} className="scroll-mt-20">
          <h2 id={group.id} className="border-b border-gray-300 pb-2 text-2xl font-semibold text-gray-900">
            {group.title}
          </h2>
          <dl className="divide-y divide-gray-200">
            {routes.map((r) => (
              <div key={r.path} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8">
                <dt className="font-semibold">
                  <Link href={r.path} data-name="" className={INDEX_LINK}>
                    {r.name}
                  </Link>
                </dt>
                <dd className="leading-relaxed text-gray-700">{r.line}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </>
  );
}
