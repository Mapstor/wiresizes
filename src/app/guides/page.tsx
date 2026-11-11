import type { Metadata } from 'next';
import Link from 'next/link';
import { EditionNote } from '@/components/content/EditionNote';
import { RouteList } from '@/components/content/RouteIndex';
import { ORGANIZATION, ORGANIZATION_REF } from '@/lib/identity';
import { sectionRoutes } from '@/lib/routes';

// /guides (WSZ-005b): every live guide from the route list (src/lib/routes.ts, D-26), grouped, each with one factual
// line; the NEC edition line. The guides layout shows no navigation column on this page
// (GuidesFrame). Spec: research/page-specs.md "WSZ-005", hubs.
const ROUTE = '/guides';
const URL = `https://wiresizes.com${ROUTE}`;
const H1 = 'Electrical Guides';
const TITLE = 'Electrical Guides: AWG Charts and NEC Tables';
const DESCRIPTION =
  'The AWG wire size chart, NEC Table 310.16 ampacity, wire sizes for dwelling services and EV chargers, and power factor and three-phase basics.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'WireSizes.com',
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    images: ['/opengraph-image'],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/twitter-image'] },
};

const LINK = 'text-blue-700 underline underline-offset-2 hover:text-blue-900';
const P = 'max-w-prose leading-relaxed text-gray-700';
const GUIDES = sectionRoutes('guides');

const guidesCollectionSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${URL}#webpage`,
      url: URL,
      name: H1,
      description: DESCRIPTION,
      isPartOf: { '@id': 'https://wiresizes.com/#website' },
      publisher: ORGANIZATION_REF,
      inLanguage: 'en-US',
      breadcrumb: { '@id': `${URL}#breadcrumb` },
      mainEntity: { '@id': `${URL}#guide-list` },
    },
    {
      '@type': 'ItemList',
      '@id': `${URL}#guide-list`,
      name: 'WireSizes.com electrical guides',
      numberOfItems: GUIDES.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: GUIDES.map((g, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://wiresizes.com${g.path}`,
        name: g.name,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wiresizes.com' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: URL },
      ],
    },
    ORGANIZATION,
  ],
};

export default function GuidesHomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guidesCollectionSchema) }} />

      <header className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{H1}</h1>
        <p className="max-w-prose text-lg leading-relaxed text-gray-700">
          Use the AWG chart and NEC Table 310.16 for wire sizes and ampacities, and the other guides for dwelling services, EV chargers,
          power factor and three-phase systems. The tools that apply them are on the{' '}
          <Link href="/calculators" className={LINK}>
            calculators
          </Link>{' '}
          page.
        </p>
      </header>

      <div className="mt-12 max-w-4xl space-y-12">
        <RouteList section="guides" />
      </div>

      <div className="mt-14 border-t border-gray-300 pt-8">
        <EditionNote className={P} />
      </div>
    </>
  );
}
