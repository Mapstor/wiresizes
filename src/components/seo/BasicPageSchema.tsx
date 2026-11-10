// Minimal schema for static pages (privacy, terms, disclaimer, etc.).
// Emits WebPage + BreadcrumbList in a single @graph so search engines can
// connect the page to the site's Organization/WebSite identity. The
// publisher, Organization (src/lib/identity.ts), is printed in the same graph.
import { ORGANIZATION, ORGANIZATION_REF } from '@/lib/identity';

interface BasicPageSchemaProps {
  /** Path beginning with `/`, e.g. `/privacy`. */
  path: string;
  /** Human-readable page name used in WebPage.name and the final breadcrumb. */
  name: string;
  /** One-sentence description. */
  description: string;
}

const ORIGIN = 'https://wiresizes.com';

export function BasicPageSchema({ path, name, description }: BasicPageSchemaProps) {
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
