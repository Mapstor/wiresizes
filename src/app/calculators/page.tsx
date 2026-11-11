import type { Metadata } from 'next';
import Link from 'next/link';
import { EditionNote } from '@/components/content/EditionNote';
import { RouteList } from '@/components/content/RouteIndex';
import { Sources } from '@/components/content/Sources';
import { ORGANIZATION, ORGANIZATION_REF } from '@/lib/identity';
import { sectionRoutes } from '@/lib/routes';
import { NEC_2026_DOMAIN } from '@/lib/verified/nec-2026-edition';

// /calculators (WSZ-005b): every live calculator from the route list (src/lib/routes.ts, D-26), grouped, each with one
// factual line; the NEC edition line from the registry. Spec: research/page-specs.md "WSZ-005", hubs.
const ROUTE = '/calculators';
const URL = `https://wiresizes.com${ROUTE}`;
const H1 = 'Electrical Calculators';
const TITLE = 'Electrical Calculators for Wire and Power';
const DESCRIPTION =
  'Wire size, ampacity, voltage drop and ground wire calculators built on 2023 NEC tables, plus converters for watts, amps, volts, kVA and BTU.';

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
const CALCULATORS = sectionRoutes('calculators');

const calculatorsCollectionSchema = {
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
      mainEntity: { '@id': `${URL}#calculator-list` },
    },
    {
      '@type': 'ItemList',
      '@id': `${URL}#calculator-list`,
      name: 'WireSizes.com electrical calculators',
      numberOfItems: CALCULATORS.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: CALCULATORS.map((calc, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://wiresizes.com${calc.path}`,
        name: calc.name,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wiresizes.com' },
        { '@type': 'ListItem', position: 2, name: 'Calculators', item: URL },
      ],
    },
    ORGANIZATION,
  ],
};

export default function CalculatorsPage() {
  return (
    <div className="container py-10 lg:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorsCollectionSchema) }} />

      <header className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{H1}</h1>
        <p className="max-w-prose text-lg leading-relaxed text-gray-700">
          Size copper and aluminum wire from the NEC tables, or convert between watts, amps, volts, kilowatts, kVA and Btu per hour. Each
          calculator lists its sources below the tool, and the{' '}
          <Link href="/methodology" className={LINK}>
            methodology
          </Link>{' '}
          page explains the formulas. The AWG chart, NEC Table 310.16 and the other references are on the{' '}
          <Link href="/guides" className={LINK}>
            guides
          </Link>{' '}
          page.
        </p>
      </header>

      <div className="mt-12 max-w-4xl space-y-12">
        <RouteList section="calculators" />
      </div>

      <div className="mt-14 space-y-8 border-t border-gray-300 pt-8">
        <EditionNote className={P} />
        <section aria-labelledby="sources" className="max-w-prose space-y-3">
          <Sources
            domains={[NEC_2026_DOMAIN]}
            headingClassName="text-xl font-semibold text-gray-900"
            listClassName="list-disc space-y-1 pl-6 text-sm text-gray-700"
            linkClassName={LINK}
            noteClassName="text-sm text-gray-600"
          />
        </section>
      </div>
    </div>
  );
}
