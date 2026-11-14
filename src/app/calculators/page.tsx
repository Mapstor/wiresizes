import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import { PageTitle } from '@/components/look/PageTitle';
import {
  LOOK_LEAD,
  LOOK_LINK as LINK,
  LOOK_P as P,
  LOOK_PAGE,
  LOOK_SOURCES_HEADING,
  LOOK_SOURCES_LIST,
  LOOK_SOURCES_NOTE,
  LOOK_SOURCES_SECTION,
} from '@/components/look/styles';
import { EDITION_NOTE_DOMAINS, EditionNote } from '@/components/content/EditionNote';
import { RouteList } from '@/components/content/RouteIndex';
import { Sources } from '@/components/content/Sources';
import { ORGANIZATION, ORGANIZATION_REF } from '@/lib/identity';
import { sectionRoutes } from '@/lib/routes';
import { ADOPTION_TABLE_HREF, NEC_ADOPTION_DOMAIN } from '@/lib/verified/nec-adoption';

// /calculators (WSZ-005b): every live calculator from the route list (src/lib/routes.ts, D-26), grouped, each with one
// factual line; the NEC edition line with its two sources (WSZ-005c). Spec: research/page-specs.md "WSZ-005", hubs.
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
    <div className={LOOK_PAGE}>
      <div className="container pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorsCollectionSchema) }} />

      <header className="pt-10 sm:pt-12">
        <PageTitle main={H1} />
        <p className={clsx(LOOK_LEAD, 'mt-6')}>
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

      <div className="mt-12 max-w-5xl space-y-14">
        <RouteList section="calculators" />
      </div>

      <div className="mt-14 space-y-8 border-t border-cut-rule pt-10">
        <EditionNote className={P} linkClassName={LINK} />
        <section aria-labelledby="sources" className={clsx(LOOK_SOURCES_SECTION, 'max-w-[44rem]')}>
          <Sources
            domains={EDITION_NOTE_DOMAINS}
            hrefs={{ [NEC_ADOPTION_DOMAIN]: ADOPTION_TABLE_HREF }}
            headingClassName={LOOK_SOURCES_HEADING}
            listClassName={LOOK_SOURCES_LIST}
            linkClassName={LINK}
            noteClassName={LOOK_SOURCES_NOTE}
          />
        </section>
      </div>
      </div>
    </div>
  );
}
