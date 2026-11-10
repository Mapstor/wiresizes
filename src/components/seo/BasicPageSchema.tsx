// Minimal schema for static pages (privacy, terms, disclaimer, etc.).
// Emits WebPage + BreadcrumbList in a single @graph so search engines can
// connect the page to the site's Organization/WebSite identity. The
// publisher, Organization (src/lib/identity.ts), is printed in the same graph.
// A page with a byline (D-18; /methodology) passes `authored`: its WebPage also
// gets author → the Person, printed in the same graph, and the page's dates
// from src/data/page-dates.json (check-structure 18).
import { ORGANIZATION, ORGANIZATION_REF, PERSON, PERSON_REF } from '@/lib/identity';
import { articleDates } from '@/lib/page-dates';

interface BasicPageSchemaProps {
  /** Path beginning with `/`, e.g. `/privacy`. */
  path: string;
  /** Human-readable page name used in WebPage.name and the final breadcrumb. */
  name: string;
  /** One-sentence description. */
  description: string;
  /** The page shows the byline: add author and the page dates. */
  authored?: boolean;
}

const ORIGIN = 'https://wiresizes.com';

export function BasicPageSchema({ path, name, description, authored = false }: BasicPageSchemaProps) {
  const url = `${ORIGIN}${path}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name,
        description,
        isPartOf: { '@id': `${ORIGIN}/#website` },
        inLanguage: 'en-US',
        ...(authored ? { author: PERSON_REF, ...articleDates(path) } : {}),
        publisher: ORGANIZATION_REF,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN },
          { '@type': 'ListItem', position: 2, name, item: url },
        ],
      },
      ...(authored ? [PERSON] : []),
      ORGANIZATION,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
