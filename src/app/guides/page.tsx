import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import { PageTitle } from '@/components/look/PageTitle';
import {
  LOOK_LEAD,
  LOOK_LINK as LINK,
  LOOK_P as P,
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

      <header className="pt-10 sm:pt-12">
        <PageTitle main={H1} />
        <p className={clsx(LOOK_LEAD, 'mt-6')}>
          Use the AWG chart and NEC Table 310.16 for wire sizes and ampacities, and the other guides for dwelling services, EV chargers,
          power factor and three-phase systems. The tools that apply them are on the{' '}
          <Link href="/calculators" className={LINK}>
            calculators
          </Link>{' '}
          page.
        </p>
      </header>

      <div className="mt-12 max-w-5xl space-y-14">
        <RouteList section="guides" />
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
    </>
  );
}
