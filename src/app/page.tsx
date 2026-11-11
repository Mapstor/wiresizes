import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import { DataTable, STICKY_TD, STICKY_TH, TD, TH } from '@/components/content/DataTable';
import { EditionNote } from '@/components/content/EditionNote';
import { Num } from '@/components/content/Num';
import { INDEX_LINK, RouteLinks } from '@/components/content/RouteIndex';
import { Size } from '@/components/content/Size';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { ORGANIZATION, ORGANIZATION_REF } from '@/lib/identity';
import { awgRow } from '@/lib/verified/awg';
import type { AwgRow, SizeKey } from '@/lib/verified/awg';
import { ROWS_240_4_D } from '@/lib/verified/nec-240-4-d';
import { NEC_2026_DOMAIN } from '@/lib/verified/nec-2026-edition';
import { AMPACITY_COLUMNS, TABLE_310_16_SIZES, TABLE_AMBIENT, columnKey, table31016 } from '@/lib/verified/nec-310-16';
import type { AmpacityColumn } from '@/lib/verified/nec-310-16';

// The homepage (WSZ-005b): what the site covers and who keeps it, every live calculator and guide from the route list
// (src/lib/routes.ts, D-26), and a short wire size table, 14 AWG to 4/0, read from awg.json, Table 310.16 and 240.4(D).
// Spec: research/page-specs.md "WSZ-005", homepage. Every number renders inside an element whose data-src names its
// source.
const H1 = 'Wire Size Charts and Electrical Calculators';
const TITLE = `${H1} | WireSizes.com`;
const DESCRIPTION =
  'AWG wire size chart, NEC Table 310.16 ampacity and calculators for wire size, voltage drop and amps to watts, from the 2023 NEC and NIST wire tables.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'WireSizes.com',
    title: H1,
    description: DESCRIPTION,
    url: 'https://wiresizes.com',
    images: ['/opengraph-image'],
  },
  twitter: { card: 'summary_large_image', title: H1, description: DESCRIPTION, images: ['/twitter-image'] },
};

const GEO = 'awg-geometry';
const AMP = 'nec-310-16';
const OCPD = 'nec-240-4-d';
const SOURCE_DOMAINS = [GEO, AMP, OCPD, NEC_2026_DOMAIN];

const LINK = 'text-blue-700 underline underline-offset-2 hover:text-blue-900';
const H2 = 'text-2xl font-semibold text-gray-900';
const P = 'max-w-prose leading-relaxed text-gray-700';
// The table's cells with less side padding, so its four columns fit a 360 px phone without scrolling
const CTH = TH.replace('px-3', 'px-2');
const CTD = TD.replace('px-3', 'px-2');

// The table shows one ampacity column of Table 310.16; a column the data lacks fails the build
function dataColumn(column: AmpacityColumn): AmpacityColumn {
  if (!AMPACITY_COLUMNS.includes(column)) throw new Error(`nec-310-16.json has no ${column} °C column`);
  return column;
}
const COLUMN = dataColumn(75);
const FIRST = TABLE_310_16_SIZES.indexOf('14');
const LAST = TABLE_310_16_SIZES.indexOf('4/0');
if (FIRST === -1 || LAST < FIRST) throw new Error('nec-310-16.json lacks the 14 AWG or the 4/0 AWG row');
const SIZES: SizeKey[] = TABLE_310_16_SIZES.slice(FIRST, LAST + 1);

function row(key: SizeKey): AwgRow {
  const found = awgRow(key);
  if (!found) throw new Error(`awg.json has no ${key} AWG row`);
  return found;
}

// 240.4(D) limits without conditions on the table's sizes, copper first: the breaker or fuse may not exceed them
const LIMITS = (['Cu', 'Al'] as const).flatMap((material) =>
  ROWS_240_4_D.filter((r) => r.material === material && r.conditions === null && SIZES.includes(r.size)).map((r) => ({
    size: r.size,
    material,
    maxA: r.max_ocpd_a,
  })),
);
const LIMITED = new Set(LIMITS.map((l) => l.size));

const websiteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://wiresizes.com/#website',
      url: 'https://wiresizes.com',
      name: 'WireSizes.com',
      description: 'Wire gauge charts, NEC table values and calculators for sizing conductors.',
      publisher: ORGANIZATION_REF,
      inLanguage: 'en-US',
    },
    ORGANIZATION,
  ],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  url: 'https://wiresizes.com',
  name: H1,
  description: DESCRIPTION,
  isPartOf: { '@id': 'https://wiresizes.com/#website' },
  inLanguage: 'en-US',
};

function Dash() {
  return (
    <>
      <span aria-hidden="true">–</span>
      <span className="sr-only">no value</span>
    </>
  );
}

function Cell({ v, src }: { v: number | null; src: string }) {
  return v === null ? <Dash /> : <Num v={v} src={src} />;
}

const materialWord = (m: 'Cu' | 'Al') => (m === 'Cu' ? 'copper' : 'aluminum');

export default function HomePage() {
  return (
    <div className="container py-10 lg:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <header className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{H1}</h1>
        <p className="max-w-prose text-lg leading-relaxed text-gray-700">
          Wire gauge charts, NEC ampacity tables and calculators for wire size and power, with code values from the 2023 NEC and wire data
          from the NIST copper wire tables.
        </p>
        <p className={P}>
          Written and maintained by{' '}
          <Link href="/about" className={LINK}>
            Marko Visic, BSc Physics
          </Link>
          . The{' '}
          <Link href="/methodology" className={LINK}>
            methodology
          </Link>{' '}
          page lists the sources and formulas behind the calculators.
        </p>
      </header>

      <section aria-labelledby="calculators" className="mt-12 max-w-4xl">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-gray-300 pb-2">
          <h2 id="calculators" className={H2}>
            Calculators
          </h2>
          <Link href="/calculators" className={INDEX_LINK}>
            What each calculator does
          </Link>
        </div>
        <RouteLinks section="calculators" columnsClassName="mt-5 grid gap-x-12 gap-y-6 sm:grid-cols-2" />
      </section>

      <section aria-labelledby="wire-sizes" className="mt-14 space-y-4">
        <h2 id="wire-sizes" className={clsx(H2, 'border-b border-gray-300 pb-2')}>
          Wire diameter and ampacity, <Size s="14" /> to <Size s="4/0" />
        </h2>
        <p className={P} data-src={AMP}>
          Each row gives a size&apos;s diameter as solid wire and its allowable ampacity in the{' '}
          <Val v={COLUMN} unit="°C" src={AMP} /> column of 2023 NEC Table 310.16, for not more than three current-carrying conductors
          at <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} /> (<Val v={TABLE_AMBIENT.f} unit="°F" src={AMP} />). For a given breaker or
          fuse rating, the{' '}
          <Link href="/calculators/wire-size-calculator" className={LINK}>
            wire size calculator
          </Link>{' '}
          picks the size.
        </p>
        <DataTable
          id="wire-sizes-table"
          src={AMP}
          className="max-w-2xl"
          caption={
            <>
              Solid-wire diameter, and allowable ampacity in amperes at <Val v={COLUMN} unit="°C" src={AMP} />
            </>
          }
        >
          <thead>
            <tr>
              <th scope="col" rowSpan={2} className={clsx(CTH, STICKY_TH)}>
                Size
              </th>
              <th scope="col" rowSpan={2} className={CTH}>
                Diameter
              </th>
              <th scope="colgroup" colSpan={2} className={clsx(CTH, 'text-center')}>
                Ampacity (A) at <Val v={COLUMN} unit="°C" src={AMP} />
              </th>
            </tr>
            <tr>
              <th scope="col" className={CTH}>
                Copper
              </th>
              <th scope="col" className={CTH}>
                Aluminum
              </th>
            </tr>
          </thead>
          <tbody>
            {SIZES.map((k) => (
              <tr key={k}>
                <th scope="row" className={clsx(CTD, STICKY_TD, 'whitespace-nowrap')}>
                  <Size s={k} />
                  {LIMITED.has(k) && (
                    <>
                      <span aria-hidden="true" className="ml-1 text-gray-900">
                        †
                      </span>
                      <span className="sr-only"> (breaker limit in the note below the table)</span>
                    </>
                  )}
                </th>
                <td className={CTD}>
                  <Val v={row(k).diameter_in} unit="in" src={GEO} format={{ fixed: 4 }} />
                  <span className="block text-xs text-gray-600">
                    <Val v={row(k).diameter_mm} unit="mm" src={GEO} format={{ fixed: 3 }} />
                  </span>
                </td>
                <td className={CTD}>
                  <Cell v={table31016(k, columnKey('Cu', COLUMN))} src={AMP} />
                </td>
                <td className={CTD}>
                  <Cell v={table31016(k, columnKey('Al', COLUMN))} src={AMP} />
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
        <p className={P} data-src={OCPD}>
          † Under 2023 NEC 240.4(D), the breaker or fuse may not exceed{' '}
          {LIMITS.map((l, i) => (
            <span key={`${l.size}-${l.material}`}>
              {i > 0 && (i === LIMITS.length - 1 ? ' and ' : ', ')}
              <Val v={l.maxA} unit="A" src={OCPD} /> on <Size s={l.size} /> {materialWord(l.material)}
            </span>
          ))}
          , even where the table lists more.
        </p>
        <p className={P} data-src={GEO}>
          A stranded conductor of the same size has the same metal area and a larger overall diameter. The{' '}
          <Link href="/guides/awg-wire-size-chart" className={LINK}>
            AWG wire size chart
          </Link>{' '}
          adds the smaller gauges and the kcmil sizes with their area and resistance, and the{' '}
          <Link href="/guides/nec-table-310-16" className={LINK}>
            NEC Table 310.16 page
          </Link>{' '}
          has every ampacity column with the corrections for heat and bundling.
        </p>
      </section>

      <section aria-labelledby="guides" className="mt-14 max-w-4xl">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-gray-300 pb-2">
          <h2 id="guides" className={H2}>
            Charts and guides
          </h2>
          <Link href="/guides" className={INDEX_LINK}>
            What each guide covers
          </Link>
        </div>
        <RouteLinks section="guides" columnsClassName="mt-5 grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3" />
      </section>

      <div className="mt-14 space-y-8 border-t border-gray-300 pt-8">
        <EditionNote className={P} />
        <section aria-labelledby="sources" className="max-w-prose space-y-3">
          <Sources
            domains={SOURCE_DOMAINS}
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
