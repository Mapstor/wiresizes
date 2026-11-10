import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { DatasetSchema } from '@/components/seo/DatasetSchema';
import { Byline } from '@/components/content/Byline';
import { Figure } from '@/components/content/Figure';
import { DataTable, STICKY_TD, STICKY_TH, TD, TH } from '@/components/content/DataTable';
import { Num } from '@/components/content/Num';
import { Size } from '@/components/content/Size';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { areaRatio, diameterRatio } from '@/lib/calculations/awg-geometry';
import { articleDates } from '@/lib/page-dates';
import { AWG_CONSTANTS, AWG_DEFINITION, AWG_TABLE, KCMIL_TABLE, awgRow, sizeKeyFromAwgName } from '@/lib/verified/awg';
import type { AwgRow, SizeKey } from '@/lib/verified/awg';
import { max240_4D } from '@/lib/verified/nec-240-4-d';
import { TABLE_310_16_ROWS, TABLE_310_16_SIZES, table31016 } from '@/lib/verified/nec-310-16';
import { attribution } from '@/lib/verified/registry';

// /guides/awg-wire-size-chart (WSZ-005a): the full AWG 0000–40 and 250–2000 kcmil chart from data/verified/awg.json
// (NBS Handbook 100 Table 5; calculated resistances labeled as such), the 2023 Table 310.16 excerpt and the 240.4(D)
// limits, and the AWG scaling rules from the awg-geometry engine. Spec: research/page-specs.md "WSZ-005". Every number
// renders inside an element whose data-src names its source; the tables carry their default source on <table>.
const ROUTE = '/guides/awg-wire-size-chart';
const URL = `https://wiresizes.com${ROUTE}`;
const H1 = 'AWG Wire Size Chart: Diameter, Area, Resistance and Ampacity';
const TITLE = 'AWG Wire Size Chart: Diameter, Area and Ampacity';
const DESCRIPTION =
  'AWG chart for every gauge from 4/0 to 40 AWG plus 250–2000 kcmil: diameter in inches and mm, area in mm², copper resistance and 2023 NEC ampacity.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: {
    type: 'article',
    locale: 'en_US',
    siteName: 'WireSizes.com',
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    images: ['/opengraph-image'],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/twitter-image'] },
};

const GEO = 'awg-geometry';
const RES = 'conductor-resistance-20c';
const IEC = 'iec-60228-metric-sizes';
const AMP = 'nec-310-16';
const OCPD = 'nec-240-4-d';
const CALC = 'calc:awg-geometry';
const SOURCE_DOMAINS = [GEO, RES, IEC, AMP, OCPD];

const LINK = 'text-blue-700 underline underline-offset-2 hover:text-blue-900';
const H2 = 'scroll-mt-20 text-2xl font-semibold text-gray-900';
const H3 = 'text-lg font-semibold text-gray-900';
const P = 'leading-relaxed text-gray-800';

function row(key: SizeKey): AwgRow {
  const found = awgRow(key);
  if (!found) throw new Error(`awg.json has no ${key} AWG row`);
  return found;
}

// Values the copy states, read from the data modules and the awg-geometry engine (none typed here)
const SIZE_0000 = row('4/0');
const SIZE_36 = row('36');
const SIX_STEPS = diameterRatio(6);
const THREE_STEPS_AREA = areaRatio(3);
const TEN_STEPS_RESISTANCE = areaRatio(10);
const STEP_RATIO = AWG_DEFINITION.ratio;
const SPAN = AWG_DEFINITION.d_0000_in / AWG_DEFINITION.d_36_in;
const AMPACITY_SIZES = TABLE_310_16_SIZES.slice(TABLE_310_16_SIZES.indexOf('14'), TABLE_310_16_SIZES.indexOf('4/0') + 1);
const INCH = { fixed: 4 } as const;
const MM = { fixed: 3 } as const;

const amp = (key: SizeKey, column: Parameters<typeof table31016>[1]) => table31016(key, column);
/** The 240.4(D) limit of a size without conditions (14, 12 and 10 AWG copper; 12 and 10 AWG aluminum), else null. */
function ocpdLimit(key: SizeKey, material: 'Cu' | 'Al'): number | null {
  const limit = max240_4D(key, material);
  return limit && limit.conditions === null ? limit.max_ocpd_a : null;
}

const CARD_SIZES: SizeKey[] = ['4/0', '1/0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24'];
const anchor = (key: SizeKey) => `awg-${key.replace('/', '-')}`;

function Dash() {
  return <span aria-label="no value">–</span>;
}

/** A cell value, or a dash where the source has none. */
function Cell({ v, src, format }: { v: number | null | undefined; src: string; format?: Parameters<typeof Num>[0]['format'] }) {
  if (v === null || v === undefined) return <Dash />;
  return <Num v={v} src={src} format={format} />;
}

// ── SVGs ──────────────────────────────────────────────────────────────────────────────────────────────────────────
// Tokens: copper #b45309 fill at 25 % with a #92400e stroke, text #111827 at 13 and 11 px, background white.
const HERO_SIZES: SizeKey[] = ['4/0', '1/0', '4', '10', '14', '24'];

/** To-scale cross sections of six gauges (solid conductors, diameters from awg.json): one row from sm up, two rows of
 *  three below it, so the labels stay legible at 320 px. */
function GaugeCircles({ narrow = false }: { narrow?: boolean }) {
  const pxPerIn = narrow ? 230 : 300;
  const rows = narrow ? [HERO_SIZES.slice(0, 3), HERO_SIZES.slice(3)] : [HERO_SIZES];
  const font = narrow ? { name: 15, value: 13 } : { name: 13, value: 11 };
  const minStep = narrow ? 92 : 84;
  const rowHeight = narrow ? 175 : 200;
  const laid = rows.map((sizes) => {
    const radii = sizes.map((key) => (row(key).diameter_in * pxPerIn) / 2);
    const centers: number[] = [];
    radii.forEach((r, i) => centers.push(i === 0 ? Math.max(12 + r, 40) : centers[i - 1] + Math.max(radii[i - 1] + r + 16, minStep)));
    return { sizes, radii, centers };
  });
  const width = Math.ceil(Math.max(...laid.map((l) => l.centers[l.centers.length - 1] + Math.max(l.radii[l.radii.length - 1], 36) + 12)));
  const id = narrow ? 'gauge-circles-narrow-title' : 'gauge-circles-title';
  return (
    <svg
      viewBox={`0 0 ${width} ${rowHeight * rows.length}`}
      width="100%"
      role="img"
      aria-labelledby={id}
      className={clsx('h-auto', narrow ? 'max-w-[360px] sm:hidden' : 'hidden max-w-[640px] sm:block')}
      data-src={GEO}
    >
      <title id={id}>{`Cross sections of ${HERO_SIZES.slice(0, -1).join(', ')} and ${HERO_SIZES[HERO_SIZES.length - 1]} AWG solid wire drawn to the same scale`}</title>
      {laid.map(({ sizes, radii, centers }, r) =>
        sizes.map((key, i) => {
          const top = r * rowHeight;
          const cy = top + (narrow ? 62 : 84);
          return (
            <g key={key}>
              <circle cx={centers[i]} cy={cy} r={radii[i]} fill="#f59e0b40" stroke="#92400e" strokeWidth={1.5} />
              <text x={centers[i]} y={top + rowHeight - 34} textAnchor="middle" fontSize={font.name} fontWeight={600} fill="#111827">
                <Size s={key} svg />
              </text>
              <text x={centers[i]} y={top + rowHeight - 16} textAnchor="middle" fontSize={font.value} fill="#374151">
                <Val v={row(key).diameter_mm} unit="mm" src={GEO} format={{ fixed: 2 }} svg />
              </text>
            </g>
          );
        }),
      )}
    </svg>
  );
}

/** One 10 AWG cross section beside two 13 AWG ones: three gauge steps halve the area. */
function ThreeSteps() {
  const pxPerIn = 900;
  const big = row('10');
  const small = row('13');
  const R = (big.diameter_in * pxPerIn) / 2;
  const r = (small.diameter_in * pxPerIn) / 2;
  const cy = 70;
  const leftX = 16 + R;
  const eqX = leftX + R + 34;
  const s1 = eqX + 34 + r;
  const s2 = s1 + 2 * r + 10;
  const width = Math.ceil(s2 + r + 16);
  return (
    <svg viewBox={`0 0 ${width} 180`} width="100%" role="img" aria-labelledby="three-steps-title" className="h-auto max-w-[460px]" data-src={GEO}>
      <title id="three-steps-title">One 10 AWG wire has about the same cross-section area as two 13 AWG wires</title>
      <circle cx={leftX} cy={cy} r={R} fill="#f59e0b40" stroke="#92400e" strokeWidth={1.5} />
      <text x={eqX} y={cy + 6} textAnchor="middle" fontSize={20} fill="#111827" aria-hidden="true">
        ≈
      </text>
      <circle cx={s1} cy={cy} r={r} fill="#f59e0b40" stroke="#92400e" strokeWidth={1.5} />
      <circle cx={s2} cy={cy} r={r} fill="#f59e0b40" stroke="#92400e" strokeWidth={1.5} />
      <text x={leftX} y={150} textAnchor="middle" fontSize={15} fontWeight={600} fill="#111827">
        <Size s="10" svg />
      </text>
      <text x={leftX} y={167} textAnchor="middle" fontSize={13} fill="#374151">
        <Val v={big.area_cmil} unit="cmil" src={GEO} svg />
      </text>
      <text x={(s1 + s2) / 2} y={150} textAnchor="middle" fontSize={15} fontWeight={600} fill="#111827">
        2 × <Size s="13" svg />
      </text>
      <text x={(s1 + s2) / 2} y={167} textAnchor="middle" fontSize={13} fill="#374151">
        2 × <Val v={small.area_cmil} unit="cmil" src={GEO} svg />
      </text>
    </svg>
  );
}


// ── Sections ──────────────────────────────────────────────────────────────────────────────────────────────────────
function GaugeCard({ k }: { k: SizeKey }) {
  const r = row(k);
  const listed = TABLE_310_16_ROWS.find((x) => x.size === k);
  const limit = ocpdLimit(k, 'Cu');
  let note: ReactNode;
  if (!listed) note = <>Table 310.16 does not list this size.</>;
  else if (listed.cu_60 === null)
    note = <>Table 310.16 lists it only in the 90 °C column, and NEC 240.4(D) adds conditions before it may be used.</>;
  else if (limit !== null)
    note = (
      <>
        NEC 240.4(D) limits copper of this size to <Val v={limit} unit="A" src={OCPD} /> overcurrent protection.
      </>
    );
  else note = <>Ampacities from the 2023 NEC Table 310.16 copper columns.</>;
  return (
    <section id={anchor(k)} data-src={GEO} aria-labelledby={`${anchor(k)}-title`} className="scroll-mt-20 rounded-md border border-gray-200 bg-white p-4">
      <h3 id={`${anchor(k)}-title`} className="text-base font-semibold text-gray-900">
        <Size s={k} />
      </h3>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-gray-600">Diameter</dt>
        <dd>
          <Val v={r.diameter_in} unit="in" src={GEO} format={INCH} /> (<Val v={r.diameter_mm} unit="mm" src={GEO} format={MM} />)
        </dd>
        <dt className="text-gray-600">Area</dt>
        <dd>
          <Val v={r.area_cmil} unit="cmil" src={GEO} /> (<Val v={r.area_mm2} unit="mm²" src={GEO} />)
        </dd>
        <dt className="text-gray-600">Copper, 20 °C</dt>
        <dd>
          <Val v={r.r20_cu_ohm_per_1000ft} unit="Ω" src={GEO} /> per thousand feet
        </dd>
        {listed && (
          <>
            <dt className="text-gray-600">Ampacity, Cu</dt>
            <dd data-src={AMP}>
              {[listed.cu_60, listed.cu_75, listed.cu_90].map((v, i) => (
                <span key={i}>
                  {i > 0 && ' / '}
                  {v === null ? <Dash /> : <Val v={v} unit="A" src={AMP} />}
                </span>
              ))}{' '}
              <span className="text-gray-600">(60 / 75 / 90 °C)</span>
            </dd>
          </>
        )}
      </dl>
      <p data-src={AMP} className="mt-2 text-sm text-gray-700">
        {note}
      </p>
    </section>
  );
}

const TOC: [string, string][] = [
  ['chart', 'AWG wire size chart'],
  ['gauges', 'Gauge by gauge'],
  ['meaning', 'What the gauge numbers mean'],
  ['scaling', 'How diameter, area and resistance scale'],
  ['metric', 'AWG to mm²'],
  ['ampacity', 'Ampacity is set by the code'],
  ['resistance', 'Resistance and weight'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: H1, description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

export default function AwgWireSizeChartPage() {
  const dates = articleDates(ROUTE);
  const r14 = row('14');
  const r12 = row('12');
  const r10 = row('10');
  const r6 = row('6');
  const r24 = row('24');
  const r20 = row('20');
  const limit12 = ocpdLimit('12', 'Cu');
  const limit10 = ocpdLimit('10', 'Cu');
  const limit14 = ocpdLimit('14', 'Cu');
  return (
    <article className="space-y-10 pb-12 text-base">
      <ArticleSchema article={articleData} />
      <DatasetSchema
        path={ROUTE}
        name="AWG wire sizes: diameter, area, resistance and weight"
        alternateName="AWG wire size chart"
        description="Diameter, cross-section area, 20 °C resistance and weight of solid annealed copper for AWG 0000 to 40 (NBS Handbook 100, Table 5), with calculated 75 °C and aluminum resistances, kcmil sizes 250 to 2000 and nearest IEC 60228 sizes."
        variableMeasured={[
          { name: 'Diameter', unitText: 'inch', unitCode: 'INH' },
          { name: 'Diameter', unitText: 'millimeter', unitCode: 'MMT' },
          { name: 'Cross-section area', unitText: 'circular mil' },
          { name: 'Cross-section area', unitText: 'square millimeter', unitCode: 'MMK' },
          { name: 'Resistance per 1000 ft at 20 °C', unitText: 'ohm', unitCode: 'OHM' },
          { name: 'Weight per 1000 ft', unitText: 'pound', unitCode: 'LBR' },
        ]}
        keywords={['AWG', 'American Wire Gauge', 'wire gauge chart', 'wire diameter', 'circular mil']}
        isBasedOn={[GEO, RES, IEC].map((d) => ({ name: attribution(d).publisher, url: attribution(d).url }))}
        datePublished={dates.datePublished}
        dateModified={dates.dateModified}
      />

      <header className="space-y-3">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{H1}</h1>
        <Byline route={ROUTE} sources className="text-sm text-gray-600" linkClassName="text-blue-700" />
      </header>

      <div className="rounded-md border border-blue-200 bg-blue-50 px-5 py-4" data-src={GEO}>
        <p className={P}>
          <strong>American Wire Gauge (AWG) numbers wire on a fixed geometric scale, and a smaller number is a thicker wire.</strong>{' '}
          Every six gauge steps the diameter about halves (<Num v={SIX_STEPS} src={CALC} format={{ fixed: 3 }} prefix="×" />), and every three
          steps the cross-section area about halves. <Size s="14" /> is <Val v={r14.diameter_in} unit="in" src={GEO} format={INCH} /> (
          <Val v={r14.diameter_mm} unit="mm" src={GEO} format={MM} />) across; <Size s="12" /> is{' '}
          <Val v={r12.diameter_in} unit="in" src={GEO} format={INCH} /> (<Val v={r12.diameter_mm} unit="mm" src={GEO} format={MM} />).
        </p>
      </div>

      <Figure
        caption={
          <>
            Drawn to one scale from the chart&apos;s diameters. <Size s="4" /> to <Size s="10" /> is six gauge steps, and its diameter falls
            from <Val v={row('4').diameter_mm} unit="mm" src={GEO} format={{ fixed: 2 }} /> to{' '}
            <Val v={r10.diameter_mm} unit="mm" src={GEO} format={{ fixed: 2 }} />.
          </>
        }
      >
        <GaugeCircles />
        <GaugeCircles narrow />
      </Figure>

      <nav aria-label="On this page" className="rounded-md border border-gray-200 bg-white p-4">
        <p className="mb-2 text-sm font-semibold text-gray-900">On this page</p>
        <ol className="grid gap-1 text-sm sm:grid-cols-2">
          {TOC.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className={LINK}>
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section aria-labelledby="chart" className="space-y-4">
        <h2 id="chart" className={H2}>
          AWG wire size chart
        </h2>
        <p className={P}>
          Diameters and areas are for a solid round conductor, from the National Bureau of Standards copper wire tables (now NIST). A stranded
          conductor of the same gauge has the same copper area but a larger overall diameter, and insulation adds more; neither is in this
          data.
        </p>
        <DataTable id="awg-table" src={GEO} caption="AWG sizes 4/0 (0000) to 40: diameter and cross-section area, solid conductor">
          <thead>
            <tr>
              <th scope="col" className={clsx(TH, STICKY_TH)}>
                AWG
              </th>
              <th scope="col" className={TH}>
                Diameter, in
              </th>
              <th scope="col" className={TH}>
                Diameter, mm
              </th>
              <th scope="col" className={TH}>
                Area, cmil
              </th>
              <th scope="col" className={TH}>
                Area, mm²
              </th>
              <th scope="col" className={TH}>
                Nearest IEC 60228 size, mm²
              </th>
            </tr>
          </thead>
          <tbody>
            {AWG_TABLE.map((r) => {
              const key = sizeKeyFromAwgName(r.awg);
              return (
                <tr key={r.awg}>
                  <th scope="row" className={clsx(TD, STICKY_TD)}>
                    <span data-size={key}>{key === r.awg ? key : `${key} (${r.awg})`}</span>
                  </th>
                  <td className={TD}>
                    <Cell v={r.diameter_in} src={GEO} format={INCH} />
                  </td>
                  <td className={TD}>
                    <Cell v={r.diameter_mm} src={GEO} format={MM} />
                  </td>
                  <td className={TD}>
                    <Cell v={r.area_cmil} src={GEO} />
                  </td>
                  <td className={TD}>
                    <Cell v={r.area_mm2} src={GEO} />
                  </td>
                  <td className={TD}>
                    <Cell v={r.iec60228_nearest_mm2} src={IEC} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
        <p className={P}>
          Above <Size s="4/0" />, sizes are named by area in thousands of circular mils (kcmil). Copper resistances in this table are calculated
          from the NIST copper and aluminum constants for a solid conductor of the same area.
        </p>
        <DataTable id="kcmil-table" src={GEO} caption="kcmil sizes 250 to 2000: area and calculated resistance at 20 °C">
          <thead>
            <tr>
              <th scope="col" className={clsx(TH, STICKY_TH)}>
                Size
              </th>
              <th scope="col" className={TH}>
                Area, cmil
              </th>
              <th scope="col" className={TH}>
                Area, mm²
              </th>
              <th scope="col" className={TH}>
                Copper, Ω per 1,000 ft (calculated)
              </th>
              <th scope="col" className={TH}>
                Aluminum, Ω per 1,000 ft (calculated)
              </th>
              <th scope="col" className={TH}>
                Nearest IEC 60228 size, mm²
              </th>
            </tr>
          </thead>
          <tbody>
            {KCMIL_TABLE.map((r) => (
              <tr key={r.kcmil}>
                <th scope="row" className={clsx(TD, STICKY_TD)}>
                  <Size s={String(r.kcmil)} />
                </th>
                <td className={TD}>
                  <Cell v={r.area_cmil} src={GEO} />
                </td>
                <td className={TD}>
                  <Cell v={r.area_mm2} src={GEO} />
                </td>
                <td className={TD}>
                  <Cell v={r.r20_cu_ohm_per_1000ft_derived} src={RES} />
                </td>
                <td className={TD}>
                  <Cell v={r.r20_al_ech19_ohm_per_1000ft_derived} src={RES} />
                </td>
                <td className={TD}>
                  <Cell v={r.iec60228_nearest_mm2} src={IEC} />
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section aria-labelledby="gauges" className="space-y-4">
        <h2 id="gauges" className={H2}>
          Gauge by gauge
        </h2>
        <p className={P}>
          The same values for fourteen sizes, each with its own link. Ampacities are the copper columns of the 2023 NEC Table 310.16.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CARD_SIZES.map((k) => (
            <GaugeCard key={k} k={k} />
          ))}
        </div>
      </section>

      <section aria-labelledby="meaning" className="space-y-4">
        <h2 id="meaning" className={H2}>
          What the gauge numbers mean
        </h2>
        <p className={P} data-src={GEO}>
          AWG is fixed by two diameters: <Size s="4/0" /> (written 0000) is <Val v={SIZE_0000.diameter_in} unit="in" src={GEO} format={INCH} />{' '}
          and <Size s="36" /> is <Val v={SIZE_36.diameter_in} unit="in" src={GEO} format={INCH} />, with{' '}
          <Num v={AWG_DEFINITION.steps} src={GEO} /> equal steps between them. Each step multiplies the diameter by the same ratio, so the
          sizes form a geometric series.
        </p>
        <p className={P} data-src={GEO}>
          The numbers count down as wires get thicker. Past <Size s="1" /> the scale continues with 0, 00, 000 and 0000, said &quot;one
          aught&quot; to &quot;four aught&quot; and written <Size s="1/0" /> to <Size s="4/0" />. 4/0 means four zeros, not a fraction. Larger
          conductors are named by area in kcmil, starting at <Size s="250" />.
        </p>
        <p className={P}>
          A circular mil is the area of a circle one mil (one thousandth of an inch) across. A round conductor&apos;s area in circular mils
          is its diameter in mils squared, so <Size s="4/0" /> at <Num v={SIZE_0000.diameter_mils} src={GEO} /> mils across has an area
          of <Val v={SIZE_0000.area_cmil} unit="cmil" src={GEO} />.
        </p>
      </section>

      <section aria-labelledby="scaling" className="space-y-4">
        <h2 id="scaling" className={H2}>
          How diameter, area and resistance scale
        </h2>
        <p className={P}>
          One gauge step changes the diameter by a factor of <Num v={STEP_RATIO} src={GEO} format={{ fixed: 4 }} />. Three rules follow, each
          worked out from the AWG definition:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-gray-800">
          <li>
            <strong>Six steps:</strong> the diameter changes by <Num v={SIX_STEPS} src={CALC} format={{ fixed: 3 }} prefix="×" />, about double
            or half.
          </li>
          <li>
            <strong>Three steps:</strong> the area changes by <Num v={THREE_STEPS_AREA} src={CALC} format={{ fixed: 3 }} prefix="×" />, so the
            resistance per foot about doubles or halves.
          </li>
          <li>
            <strong>Ten steps:</strong> the area, and with it the resistance, changes by{' '}
            <Num v={TEN_STEPS_RESISTANCE} src={CALC} format={{ fixed: 2 }} prefix="×" />, close to a factor of ten.
          </li>
        </ul>
        <Figure
          caption={
            <>
              <Size s="10" /> is three gauge steps above <Size s="13" />, so it carries about as much copper as two of them and has about
              half their resistance per foot.
            </>
          }
        >
          <ThreeSteps />
        </Figure>
        <p className={P} data-src={GEO}>
          The general formula is d = <Val v={AWG_DEFINITION.d_36_in} unit="in" src={GEO} format={INCH} /> × <Num v={SPAN} src={GEO} />
          <sup>(36 − n) / {AWG_DEFINITION.steps}</sup>, where n is the gauge number and 1/0 to 4/0 count as 0, −1, −2 and −3.
        </p>
      </section>

      <section aria-labelledby="metric" className="space-y-4">
        <h2 id="metric" className={H2}>
          AWG to mm²
        </h2>
        <p className={P}>
          Metric cable is sold in the IEC 60228 series of nominal areas, and those sizes do not line up with AWG. <Size s="14" /> has{' '}
          <Val v={r14.area_mm2} unit="mm²" src={GEO} />, and the next IEC size up is{' '}
          <Val v={r14.iec60228_next_larger_mm2 as number} unit="mm²" src={IEC} />. When you replace one with the other, compare areas and
          check what the local code requires; the closest size can be the smaller one.
        </p>
        <DataTable id="metric-table" src={GEO} caption="AWG area in mm² beside the IEC 60228 sizes">
          <thead>
            <tr>
              <th scope="col" className={clsx(TH, STICKY_TH)}>
                AWG
              </th>
              <th scope="col" className={TH}>
                Area, mm²
              </th>
              <th scope="col" className={TH}>
                Nearest IEC size, mm²
              </th>
              <th scope="col" className={TH}>
                Next IEC size up, mm²
              </th>
            </tr>
          </thead>
          <tbody>
            {AWG_TABLE.filter((r) => r.iec60228_nearest_mm2 !== null && r.iec60228_nearest_mm2 !== undefined).map((r) => {
              const key = sizeKeyFromAwgName(r.awg);
              return (
                <tr key={r.awg}>
                  <th scope="row" className={clsx(TD, STICKY_TD)}>
                    <Size s={key} />
                  </th>
                  <td className={TD}>
                    <Cell v={r.area_mm2} src={GEO} />
                  </td>
                  <td className={TD}>
                    <Cell v={r.iec60228_nearest_mm2} src={IEC} />
                  </td>
                  <td className={TD}>
                    <Cell v={r.iec60228_next_larger_mm2} src={IEC} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
        <p className="text-sm text-gray-700">
          Rows stop at <Size s="21" /> because smaller gauges fall below the smallest IEC 60228 size in this data.
        </p>
      </section>

      <section aria-labelledby="ampacity" className="space-y-4">
        <h2 id="ampacity" className={H2}>
          Ampacity is set by the code
        </h2>
        <p className={P}>
          A gauge fixes the copper&apos;s size. How much current the wire may carry is set by the electrical code, and it depends on the
          insulation&apos;s temperature rating, the surrounding temperature and how many current-carrying conductors run together. The table
          below is an excerpt of the 2023 NEC Table 310.16 at its base conditions; the{' '}
          <Link href="/guides/nec-table-310-16" className={LINK}>
            full Table 310.16 page
          </Link>{' '}
          has every size and the corrections.
        </p>
        <DataTable id="ampacity-table" src={AMP} caption="2023 NEC Table 310.16 excerpt, amperes, with the 240.4(D) protection limit for copper">
          <thead>
            <tr>
              <th scope="col" className={clsx(TH, STICKY_TH)}>
                AWG
              </th>
              <th scope="col" className={TH}>
                Cu 60 °C
              </th>
              <th scope="col" className={TH}>
                Cu 75 °C
              </th>
              <th scope="col" className={TH}>
                Cu 90 °C
              </th>
              <th scope="col" className={TH}>
                Al 60 °C
              </th>
              <th scope="col" className={TH}>
                Al 75 °C
              </th>
              <th scope="col" className={TH}>
                Al 90 °C
              </th>
              <th scope="col" className={TH}>
                Cu protection limit, 240.4(D)
              </th>
            </tr>
          </thead>
          <tbody>
            {AMPACITY_SIZES.map((k) => (
              <tr key={k}>
                <th scope="row" className={clsx(TD, STICKY_TD)}>
                  <Size s={k} />
                </th>
                {(['cu_60', 'cu_75', 'cu_90', 'al_60', 'al_75', 'al_90'] as const).map((c) => (
                  <td key={c} className={TD}>
                    <Cell v={amp(k, c)} src={AMP} />
                  </td>
                ))}
                <td className={TD}>
                  <Cell v={ocpdLimit(k, 'Cu')} src={OCPD} />
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
        <p className={P}>
          Under 2023 NEC 240.4(D), the overcurrent protection for <Size s="14" />, <Size s="12" /> and <Size s="10" /> copper may not exceed{' '}
          <Val v={limit14 as number} unit="A" src={OCPD} />, <Val v={limit12 as number} unit="A" src={OCPD} /> and{' '}
          <Val v={limit10 as number} unit="A" src={OCPD} />, even where a temperature column lists more. This limit applies to the breaker or
          fuse, not to the wire&apos;s ampacity.
        </p>
        <p className={P} data-src={AMP}>
          Gauge also decides whether solid wire is allowed: under 2023 NEC 310.3(C), conductors <Size s="8" /> and larger installed in a
          raceway must be stranded unless the Code permits or requires otherwise elsewhere.
        </p>
      </section>

      <section aria-labelledby="resistance" className="space-y-4">
        <h2 id="resistance" className={H2}>
          Resistance and weight
        </h2>
        <p className={P} data-src={RES}>
          The 20 °C copper resistance and the weight come from the NIST copper wire tables for solid annealed copper. The 75 °C column and the
          aluminum column are calculated by this site from NIST&apos;s constants and are marked as such; a stranded conductor measures slightly
          higher than these solid values.
        </p>
        <p className={P} data-src={RES}>
          The 75 °C values use R<sub>75</sub> = R<sub>20</sub> × (1 + <Num v={AWG_CONSTANTS.copper_alpha_per_C_20C} src={RES} /> × 55), the
          copper temperature coefficient from NIST. Aluminum is EC-H19 at <Val v={AWG_CONSTANTS.aluminum_ECH19_pct_IACS} unit="%" src={RES} />{' '}
          IACS, given from <Size s="12" /> up. For another temperature or a run length, use the{' '}
          <Link href="/calculators/wire-resistance-calculator" className={LINK}>
            wire resistance calculator
          </Link>
          ; for the drop on a circuit, the{' '}
          <Link href="/calculators/voltage-drop-calculator" className={LINK}>
            voltage drop calculator
          </Link>{' '}
          or, for low-voltage DC runs, the{' '}
          <Link href="/calculators/low-voltage-calculator" className={LINK}>
            low voltage calculator
          </Link>
          .
        </p>
        <DataTable id="resistance-table" src={GEO} caption="Resistance and weight per AWG size, solid conductor">
          <thead>
            <tr>
              <th scope="col" className={clsx(TH, STICKY_TH)}>
                AWG
              </th>
              <th scope="col" className={TH}>
                Copper 20 °C, Ω per 1,000 ft
              </th>
              <th scope="col" className={TH}>
                Copper 20 °C, Ω per km
              </th>
              <th scope="col" className={TH}>
                Copper 75 °C, Ω per 1,000 ft (calculated)
              </th>
              <th scope="col" className={TH}>
                Aluminum 20 °C, Ω per 1,000 ft (calculated)
              </th>
              <th scope="col" className={TH}>
                Copper, lb per 1,000 ft
              </th>
              <th scope="col" className={TH}>
                Copper, kg per km
              </th>
            </tr>
          </thead>
          <tbody>
            {AWG_TABLE.map((r) => {
              const key = sizeKeyFromAwgName(r.awg);
              const al = 'r20_al_ech19_ohm_per_1000ft_derived' in r ? r.r20_al_ech19_ohm_per_1000ft_derived : null;
              return (
                <tr key={r.awg}>
                  <th scope="row" className={clsx(TD, STICKY_TD)}>
                    <Size s={key} />
                  </th>
                  <td className={TD}>
                    <Cell v={r.r20_cu_ohm_per_1000ft} src={GEO} />
                  </td>
                  <td className={TD}>
                    <Cell v={r.r20_cu_ohm_per_km} src={GEO} />
                  </td>
                  <td className={TD}>
                    <Cell v={r.r75_cu_solid_ohm_per_1000ft_derived} src={RES} />
                  </td>
                  <td className={TD}>
                    <Cell v={al} src={RES} />
                  </td>
                  <td className={TD}>
                    <Cell v={r.weight_cu_lb_per_1000ft} src={GEO} />
                  </td>
                  <td className={TD}>
                    <Cell v={r.weight_cu_kg_per_km} src={GEO} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      </section>

      <section aria-labelledby="faq" className="space-y-5">
        <h2 id="faq" className={H2}>
          Questions
        </h2>
        <div className="space-y-1">
          <h3 className={H3}>What does AWG mean?</h3>
          <p className={P} data-src={GEO}>
            American Wire Gauge, the standard series of wire sizes used in the United States. Its numbers run from 0000 (<Size s="4/0" />) for
            the thickest wire to <Size s="40" /> and beyond for the thinnest.
          </p>
        </div>
        <div className="space-y-1">
          <h3 className={H3}>
            Is <Size s="6" /> bigger than <Size s="24" />?
          </h3>
          <p className={P}>
            Yes. A smaller gauge number is a thicker wire. <Size s="6" /> is <Val v={r6.diameter_mm} unit="mm" src={GEO} format={MM} />{' '}
            across and <Size s="24" /> is <Val v={r24.diameter_mm} unit="mm" src={GEO} format={MM} />, about{' '}
            <Num v={diameterRatio(18)} src={CALC} format={{ fixed: 1 }} /> times the diameter.
          </p>
        </div>
        <div className="space-y-1">
          <h3 className={H3}>How are AWG sizes calculated?</h3>
          <p className={P}>
            From two fixed diameters, <Size s="4/0" /> and <Size s="36" />, with <Num v={AWG_DEFINITION.steps} src={GEO} /> equal ratio
            steps between them. Each step changes the diameter by <Num v={STEP_RATIO} src={GEO} format={{ fixed: 4 }} />; the formula is under{' '}
            <a href="#scaling" className={LINK}>
              how diameter, area and resistance scale
            </a>
            .
          </p>
        </div>
        <div className="space-y-1">
          <h3 className={H3}>
            What is <Size s="14" /> in mm²?
          </h3>
          <p className={P}>
            <Val v={r14.area_mm2} unit="mm²" src={GEO} />. The nearest IEC 60228 size is{' '}
            <Val v={r14.iec60228_nearest_mm2 as number} unit="mm²" src={IEC} />, and the next one up is{' '}
            <Val v={r14.iec60228_next_larger_mm2 as number} unit="mm²" src={IEC} />.
          </p>
        </div>
        <div className="space-y-1">
          <h3 className={H3}>
            What is the diameter of <Size s="20" /> wire in mm?
          </h3>
          <p className={P}>
            <Val v={r20.diameter_mm} unit="mm" src={GEO} format={MM} /> (<Val v={r20.diameter_in} unit="in" src={GEO} format={INCH} />) for a
            solid conductor. Stranded and insulated wire is larger overall.
          </p>
        </div>
        <div className="space-y-1">
          <h3 className={H3}>
            What do <span data-size="1/0">1/0</span> and <span data-size="4/0">4/0</span> mean?
          </h3>
          <p className={P} data-src={GEO}>
            They are the gauges written 0 and 0000, one size and four sizes thicker than <Size s="1" />. <Size s="4/0" /> is the largest AWG
            size, at <Val v={SIZE_0000.area_cmil} unit="cmil" src={GEO} />; the next common size is <Size s="250" />.
          </p>
        </div>
        <div className="space-y-1">
          <h3 className={H3}>
            What is the difference between <Size s="10" /> and <Size s="12" />?
          </h3>
          <p className={P}>
            <Size s="10" /> is two gauge steps thicker: <Val v={r10.diameter_mm} unit="mm" src={GEO} format={MM} /> against{' '}
            <Val v={r12.diameter_mm} unit="mm" src={GEO} format={MM} />, with <Num v={areaRatio(2)} src={CALC} format={{ fixed: 2 }} /> times
            the area and correspondingly lower resistance. Under 2023 NEC 240.4(D), <Size s="10" /> copper may be protected at up to{' '}
            <Val v={limit10 as number} unit="A" src={OCPD} /> and <Size s="12" /> copper at up to <Val v={limit12 as number} unit="A" src={OCPD} />.
          </p>
        </div>
        <div className="space-y-1">
          <h3 className={H3}>
            How much current can <Size s="12" /> copper carry?
          </h3>
          <p className={P} data-src={AMP}>
            Table 310.16 (2023 NEC) lists <Val v={amp('12', 'cu_60') as number} unit="A" src={AMP} />,{' '}
            <Val v={amp('12', 'cu_75') as number} unit="A" src={AMP} /> and <Val v={amp('12', 'cu_90') as number} unit="A" src={AMP} /> in its
            60, 75 and 90 °C columns, for up to three current-carrying conductors at 30 °C. NEC 240.4(D) limits the breaker or fuse to{' '}
            <Val v={limit12 as number} unit="A" src={OCPD} />. Higher ambient temperatures and more conductors lower the ampacity; the{' '}
            <Link href="/calculators/ampacity-calculator" className={LINK}>
              ampacity calculator
            </Link>{' '}
            applies both corrections.
          </p>
        </div>
      </section>

      <section aria-label="Sources and method" className="space-y-3 border-t border-gray-200 pt-6 text-sm text-gray-700">
        <Sources domains={SOURCE_DOMAINS} headingClassName={H2} listClassName="list-disc space-y-1 pl-6" linkClassName={LINK} />
        <p data-src={AMP}>
          Values marked calculated are worked out by this site from NIST&apos;s constants; the{' '}
          <Link href="/methodology" className={LINK}>
            methodology page
          </Link>{' '}
          gives each formula. ASTM B258 defines the AWG diameters; its text is not reproduced here. NFPA 70®, National Electrical Code® and
          NEC® are registered trademarks of the National Fire Protection Association; NEC values are shown as data with attribution.
        </p>
      </section>
    </article>
  );
}
