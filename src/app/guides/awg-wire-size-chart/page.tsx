import type { Metadata } from 'next';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { DatasetSchema } from '@/components/seo/DatasetSchema';
import { Byline } from '@/components/content/Byline';
import { DataTable, RSTICKY_TD, RSTICKY_TH, RTD, RTH } from '@/components/content/DataTable';
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
import { attribution, attributionParts } from '@/lib/verified/registry';
import { GuidesNav } from '@/components/layout/GuidesFrame';
import { GUIDE_CALCULATORS, GUIDE_GROUPS } from '@/lib/guides-nav';

// /guides/awg-wire-size-chart (WSZ-005a): the full AWG 0000–40 and 250–2000 kcmil chart from data/verified/awg.json
// (NBS Handbook 100 Table 5; calculated resistances labeled as such), the 2023 Table 310.16 excerpt and the 240.4(D)
// limits, and the AWG scaling rules from the awg-geometry engine. Spec: research/page-specs.md "WSZ-005". Every number
// renders inside an element whose data-src names its source; the tables carry their default source on <table>.
// WSZ-025: the first page in the look the owner picked on 2026-11-13 (D-33): a full-width hero with the copper spiral
// of all 44 gauges, ruled tables, and the guides navigation in a column beside the body (the frame leaves this page alone).
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

const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px] hover:text-cut-deep';
const H2 = 'scroll-mt-24 text-balance font-display text-[34px] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink sm:text-[46px]';
const H3 = 'text-balance font-display text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-ink';
const P = 'max-w-[35rem] text-[17px] leading-[1.65] text-ink';
const SRC = 'mt-2 text-sm text-cut-muted';

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
  return (
    <>
      <span aria-hidden="true">–</span>
      <span className="sr-only">no value</span>
    </>
  );
}

/** "Source: …" under a table or drawing: each domain's short attribution from the registry, inside its own data-src. */
function SourceLine({ domains, className = SRC }: { domains: string[]; className?: string }) {
  return (
    <p className={className}>
      Source:{' '}
      {domains.map((d, i) => (
        <span key={d} data-src={d}>
          {i > 0 && '; '}
          {attributionParts(attribution(d).text).short}
        </span>
      ))}
      .
    </p>
  );
}

/** A cell value, or a dash where the source has none. */
function Cell({ v, src, format }: { v: number | null | undefined; src: string; format?: Parameters<typeof Num>[0]['format'] }) {
  if (v === null || v === undefined) return <Dash />;
  return <Num v={v} src={src} format={format} />;
}

// ── SVGs ──────────────────────────────────────────────────────────────────────────────────────────────────────────
// The picked look (D-33): cut copper, a flat face lit from the top left (#f3c193 → #d6904f → #a95a26) with a #6b3112
// rim; labels in Archivo, #2a1205 on the copper (7:1 at the face's middle tone) and ink on white.

const STEP_ANGLE = Math.PI / 4; // one gauge per 45°: eight discs a turn, so the turns of the spiral do not touch

/** Every gauge from 4/0 to 40 as a cut solid conductor at one scale (diameters from awg.json), each disc placed one
 *  gauge step further along a logarithmic spiral. Discs touch their neighbors because each is the last one's diameter
 *  divided by the AWG step ratio, the same ratio the spiral shrinks by. */
function spiralLayout(pxPerIn: number) {
  const q = 1 / STEP_RATIO;
  const reach = (1 + q) / Math.sqrt(1 + q * q - 2 * q * Math.cos(STEP_ANGLE));
  const start = (150 * Math.PI) / 180;
  const raw = AWG_TABLE.map((r, i) => {
    const radius = (r.diameter_in * pxPerIn) / 2;
    const angle = start + i * STEP_ANGLE;
    return { key: sizeKeyFromAwgName(r.awg), x: reach * radius * Math.cos(angle), y: reach * radius * Math.sin(angle), radius };
  });
  const pad = 8;
  const minX = Math.min(...raw.map((d) => d.x - d.radius)) - pad;
  const minY = Math.min(...raw.map((d) => d.y - d.radius)) - pad;
  const width = Math.ceil(Math.max(...raw.map((d) => d.x + d.radius)) - minX + pad);
  const height = Math.ceil(Math.max(...raw.map((d) => d.y + d.radius)) - minY + pad);
  return { discs: raw.map((d) => ({ ...d, x: d.x - minX, y: d.y - minY })), width, height };
}

function Spiral({ narrow = false }: { narrow?: boolean }) {
  // Labels stay at 13 px or more on screen (§5: SVG labels below 13 px). The wide drawing (569 px) keeps its size; the
  // narrow one (342 px) shrinks only on screens under 342 px, to 94 % at 320 px, so its labels start at 14 px.
  const { discs, width, height } = spiralLayout(narrow ? 268 : 455);
  const fontMin = narrow ? 14 : 13;
  const fontMax = narrow ? 26 : 34;
  const id = narrow ? 'spiral-narrow' : 'spiral-wide';
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('mx-auto block overflow-visible font-display', narrow ? 'spiral-narrow' : 'spiral-wide')}
      data-src={GEO}
    >
      <title id={`${id}-title`}>
        Cross sections of solid copper wire from 4/0 to 40 AWG drawn to one scale, each one gauge step smaller than the last, laid in a spiral
      </title>
      <defs>
        <linearGradient id={`${id}-cu`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f3c193" />
          <stop offset="0.45" stopColor="#d6904f" />
          <stop offset="1" stopColor="#a95a26" />
        </linearGradient>
      </defs>
      {discs.map((d, i) => {
        const diameter = 2 * d.radius;
        const font = Math.max(fontMin, Math.min(fontMax, 0.36 * diameter));
        return (
          <g key={d.key} className="spiral-disc" style={{ animationDelay: `${(0.25 + i * 0.055).toFixed(3)}s` }}>
            <circle cx={d.x} cy={d.y} r={d.radius} fill={`url(#${id}-cu)`} stroke={diameter > 6 ? '#6b3112' : 'none'} strokeWidth={0.8} />
            {diameter > 14 && <circle cx={d.x} cy={d.y} r={d.radius - 2.2} fill="none" stroke="#ffe2c4" strokeOpacity={0.55} strokeWidth={1} />}
            {diameter > 10 && (
              <ellipse
                className="spiral-shine"
                style={{ animationDelay: `${(3.4 + i * 0.07).toFixed(2)}s` }}
                cx={d.x - d.radius * 0.28}
                cy={d.y - d.radius * 0.32}
                rx={d.radius * 0.5}
                ry={d.radius * 0.26}
                transform={`rotate(-32 ${d.x - d.radius * 0.28} ${d.y - d.radius * 0.32})`}
                fill="#fff6ec"
              />
            )}
            {diameter >= 21 && (
              <text x={d.x} y={d.y + font * 0.36} textAnchor="middle" fontSize={font} fontWeight={700} fill="#2a1205">
                <tspan data-size={d.key}>{d.key}</tspan>
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** One 10 AWG cross section beside two 13 AWG ones: three gauge steps halve the area. Drawn 271 px wide, so it fits
 *  the 288 px column at 320 px without shrinking its 14 px labels, and scaled up to 420 px where there is room. */
function ThreeSteps() {
  const pxPerIn = 760;
  const big = row('10');
  const small = row('13');
  const R = (big.diameter_in * pxPerIn) / 2;
  const r = (small.diameter_in * pxPerIn) / 2;
  const cy = 18 + R;
  const leftX = 52;
  const eqX = leftX + R + 24;
  const s1 = eqX + 24 + r;
  const s2 = s1 + 2 * r + 10;
  const width = Math.ceil(s2 + r + 12);
  const height = Math.ceil(cy + R + 58);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-labelledby="three-steps-title"
      className="block h-auto w-full max-w-[420px] font-display"
      data-src={GEO}
    >
      <title id="three-steps-title">One 10 AWG wire has about the same cross-section area as two 13 AWG wires</title>
      <defs>
        <linearGradient id="three-steps-cu" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f3c193" />
          <stop offset="0.45" stopColor="#d6904f" />
          <stop offset="1" stopColor="#a95a26" />
        </linearGradient>
      </defs>
      {[
        [leftX, R],
        [s1, r],
        [s2, r],
      ].map(([x, radius]) => (
        <g key={x}>
          <circle cx={x} cy={cy} r={radius} fill="url(#three-steps-cu)" stroke="#6b3112" strokeWidth={1} />
          <circle cx={x} cy={cy} r={radius - 2.2} fill="none" stroke="#ffe2c4" strokeOpacity={0.55} strokeWidth={1} />
        </g>
      ))}
      <text x={eqX} y={cy + 9} textAnchor="middle" fontSize={26} fill="#111111" aria-hidden="true">
        ≈
      </text>
      <text x={leftX} y={cy + R + 26} textAnchor="middle" fontSize={17} fontWeight={800} fill="#111111">
        <Size s="10" svg />
      </text>
      <text x={leftX} y={cy + R + 45} textAnchor="middle" fontSize={14} fill="#3d3d3d">
        <Val v={big.area_cmil} unit="cmil" src={GEO} svg />
      </text>
      <text x={(s1 + s2) / 2} y={cy + R + 26} textAnchor="middle" fontSize={17} fontWeight={800} fill="#111111">
        2 × <Size s="13" svg />
      </text>
      <text x={(s1 + s2) / 2} y={cy + R + 45} textAnchor="middle" fontSize={14} fill="#3d3d3d">
        2 × <Val v={small.area_cmil} unit="cmil" src={GEO} svg />
      </text>
    </svg>
  );
}

/** A gauge's cross section at 200 px per inch beside its values (the gauge-by-gauge list). Decorative: the diameter is
 *  in the text beside it. */
function GaugeDisc({ k }: { k: SizeKey }) {
  const d = row(k).diameter_in * 200;
  const box = 96;
  const id = `disc-${k.replace('/', '-')}-cu`;
  return (
    <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} aria-hidden="true" className="block">
      <defs>
        <linearGradient id={id} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f3c193" />
          <stop offset="0.45" stopColor="#d6904f" />
          <stop offset="1" stopColor="#a95a26" />
        </linearGradient>
      </defs>
      <circle cx={box / 2} cy={box / 2} r={d / 2} fill={`url(#${id})`} stroke={d > 6 ? '#6b3112' : 'none'} strokeWidth={0.8} />
    </svg>
  );
}

// ── Sections ──────────────────────────────────────────────────────────────────────────────────────────────────────
function GaugeCard({ k }: { k: SizeKey }) {
  const r = row(k);
  const listed = TABLE_310_16_ROWS.find((x) => x.size === k);
  const limit = ocpdLimit(k, 'Cu');
  let note: ReactNode = null;
  if (!listed) note = <>Table 310.16 does not list this size.</>;
  else if (listed.cu_60 === null)
    note = <>Table 310.16 lists it only in the 90 °C column, and NEC 240.4(D) adds conditions before it may be used.</>;
  else if (limit !== null)
    note = (
      <>
        NEC 240.4(D) limits copper of this size to <Val v={limit} unit="A" src={OCPD} /> overcurrent protection.
      </>
    );
  const columns = listed
    ? ([
        [listed.cu_60, '60'],
        [listed.cu_75, '75'],
        [listed.cu_90, '90'],
      ] as const).filter(([v]) => v !== null)
    : [];
  return (
    <section
      id={anchor(k)}
      data-src={GEO}
      aria-labelledby={`${anchor(k)}-title`}
      className="grid scroll-mt-24 grid-cols-[96px_minmax(0,1fr)] content-start gap-x-4 gap-y-3 border-t border-cut-rule py-5"
    >
      <div className="sm:row-span-2">
        <GaugeDisc k={k} />
      </div>
      <h3 id={`${anchor(k)}-title`} className={clsx(H3, 'self-center sm:self-start')}>
        <Size s={k} />
      </h3>
      <div className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2">
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-[15px] tabular-nums">
          <dt className="text-cut-muted">Diameter</dt>
          <dd>
            <Val v={r.diameter_in} unit="in" src={GEO} format={INCH} /> (<Val v={r.diameter_mm} unit="mm" src={GEO} format={MM} />)
          </dd>
          <dt className="text-cut-muted">Area</dt>
          <dd>
            <Val v={r.area_cmil} unit="cmil" src={GEO} /> (<Val v={r.area_mm2} unit="mm²" src={GEO} />)
          </dd>
          <dt className="text-cut-muted">Resistance, 20 °C</dt>
          <dd>
            <Val v={r.r20_cu_ohm_per_1000ft} unit="Ω" src={GEO} /> per 1,000 ft
          </dd>
          {columns.map(([v, t]) => (
            <Fragment key={t}>
              <dt className="text-cut-muted" data-src={AMP}>
                Ampacity, {t} °C
              </dt>
              <dd data-src={AMP}>
                <Val v={v as number} unit="A" src={AMP} />
              </dd>
            </Fragment>
          ))}
        </dl>
        {note && (
          <p data-src={AMP} className="mt-2 text-[15px] text-ink">
            {note}
          </p>
        )}
      </div>
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
  const sameIec = r14.iec60228_nearest_mm2 === r14.iec60228_next_larger_mm2;
  return (
    <div className="look bg-white font-display text-ink">
      <article className="container pb-16">
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

        {/* The hero: the H1 across the top, then the answer, the spiral of every gauge and its caption */}
        <header className="pt-10 sm:pt-12">
          <h1 className="font-display font-extrabold tracking-[-0.04em] text-ink">
            <span className="block text-balance text-[54px] leading-[0.92] sm:text-[76px] lg:text-[96px]">
              AWG Wire Size Chart<span className="sr-only">:</span>
            </span>{' '}
            <span className="mt-4 block text-[23px] font-medium leading-[1.15] tracking-[-0.015em] text-[#2a2a2a] sm:text-[31px]">
              Diameter, Area, Resistance and Ampacity
            </span>
          </h1>
          <Byline
            route={ROUTE}
            sources
            className="mt-5 text-[15px] text-cut-muted"
            linkClassName="text-ink decoration-cut-line decoration-2 hover:text-cut-deep"
          />
        </header>

        <div className="mt-6 grid items-center gap-6 lg:grid-cols-[330px_minmax(0,1fr)] lg:gap-9">
          <p className="text-[18px] leading-[1.6] text-ink sm:text-[19.5px]" data-src={GEO}>
            <strong className="font-bold">
              American Wire Gauge (AWG) numbers wire on a fixed geometric scale, and a smaller number is a thicker wire.
            </strong>{' '}
            Every six gauge steps the diameter about halves (<Num v={SIX_STEPS} src={CALC} format={{ fixed: 3 }} prefix="×" />), and every three
            steps the cross-section area about halves. <Size s="14" /> is <Val v={r14.diameter_in} unit="in" src={GEO} format={INCH} /> (
            <Val v={r14.diameter_mm} unit="mm" src={GEO} format={MM} />) across; <Size s="12" /> is{' '}
            <Val v={r12.diameter_in} unit="in" src={GEO} format={INCH} /> (<Val v={r12.diameter_mm} unit="mm" src={GEO} format={MM} />).
          </p>
          <figure className="grid items-center gap-5 xl:grid-cols-[minmax(0,1fr)_230px] xl:gap-9">
            <div className="relative -mx-4 overflow-hidden sm:mx-0 sm:overflow-visible">
              <Spiral />
              <Spiral narrow />
            </div>
            <figcaption className="border-t-2 border-ink pt-3 text-[15px] leading-[1.55] text-[#3d3d3d]" data-src={GEO}>
              Every disc is a cut solid copper conductor drawn to one scale from the chart&apos;s diameters, each one gauge step (
              <Num v={STEP_RATIO} src={GEO} format={{ fixed: 4 }} prefix="×" /> in diameter) smaller than the one before it: <Size s="4/0" /> on
              the outside, <Size s="40" /> at the center.
              <SourceLine domains={[GEO]} className="mt-2" />
            </figcaption>
          </figure>
        </div>

        <div className="mt-12 grid gap-12 border-t border-cut-rule pt-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="min-w-0 space-y-14">
            <nav aria-label="On this page" className="grid gap-3 border-t-2 border-ink pt-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
              <p className="text-[15px] font-bold">On this page</p>
              <ol className="gap-x-8 text-[16.5px] sm:columns-2">
                {TOC.map(([id, label]) => (
                  <li key={id} className="mb-1.5 break-inside-avoid">
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
                Diameters and areas are for a solid round conductor, from the National Bureau of Standards copper wire tables (now NIST). A
                stranded conductor of the same gauge has the same copper area but a larger overall diameter, and insulation adds more; neither
                is in this data.
              </p>
              <DataTable id="awg-table" variant="ruled" src={GEO} caption="AWG sizes 4/0 (0000) to 40: diameter and cross-section area, solid conductor">
                <thead>
                  <tr>
                    <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                      AWG
                    </th>
                    <th scope="col" className={RTH}>
                      Diameter, in
                    </th>
                    <th scope="col" className={RTH}>
                      Diameter, mm
                    </th>
                    <th scope="col" className={RTH}>
                      Area, cmil
                    </th>
                    <th scope="col" className={RTH}>
                      Area, mm²
                    </th>
                    <th scope="col" className={RTH}>
                      Nearest IEC 60228 size, mm²
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {AWG_TABLE.map((r) => {
                    const key = sizeKeyFromAwgName(r.awg);
                    return (
                      <tr key={r.awg}>
                        <th scope="row" className={RSTICKY_TD}>
                          <span data-size={key}>
                            {key}
                            {key !== r.awg && <span className="font-normal text-cut-muted"> ({r.awg})</span>}
                          </span>
                        </th>
                        <td className={RTD}>
                          <Cell v={r.diameter_in} src={GEO} format={INCH} />
                        </td>
                        <td className={RTD}>
                          <Cell v={r.diameter_mm} src={GEO} format={MM} />
                        </td>
                        <td className={RTD}>
                          <Cell v={r.area_cmil} src={GEO} />
                        </td>
                        <td className={RTD}>
                          <Cell v={r.area_mm2} src={GEO} />
                        </td>
                        <td className={RTD}>
                          <Cell v={r.iec60228_nearest_mm2} src={IEC} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </DataTable>
              <SourceLine domains={[GEO, IEC]} />
              <p className={clsx(P, 'pt-4')}>
                Above <Size s="4/0" />, sizes are named by area in thousands of circular mils (kcmil). Copper resistances in this table are
                calculated from the NIST copper and aluminum constants for a solid conductor of the same area.
              </p>
              <DataTable id="kcmil-table" variant="ruled" src={GEO} caption="kcmil sizes 250 to 2000: area and calculated resistance at 20 °C">
                <thead>
                  <tr>
                    <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                      Size
                    </th>
                    <th scope="col" className={RTH}>
                      Area, cmil
                    </th>
                    <th scope="col" className={RTH}>
                      Area, mm²
                    </th>
                    <th scope="col" className={RTH}>
                      Copper, Ω per 1,000 ft (calculated)
                    </th>
                    <th scope="col" className={RTH}>
                      Aluminum, Ω per 1,000 ft (calculated)
                    </th>
                    <th scope="col" className={RTH}>
                      Nearest IEC 60228 size, mm²
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {KCMIL_TABLE.map((r) => (
                    <tr key={r.kcmil}>
                      <th scope="row" className={RSTICKY_TD}>
                        <Size s={String(r.kcmil)} />
                      </th>
                      <td className={RTD}>
                        <Cell v={r.area_cmil} src={GEO} />
                      </td>
                      <td className={RTD}>
                        <Cell v={r.area_mm2} src={GEO} />
                      </td>
                      <td className={RTD}>
                        <Cell v={r.r20_cu_ohm_per_1000ft_derived} src={RES} />
                      </td>
                      <td className={RTD}>
                        <Cell v={r.r20_al_ech19_ohm_per_1000ft_derived} src={RES} />
                      </td>
                      <td className={RTD}>
                        <Cell v={r.iec60228_nearest_mm2} src={IEC} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
              <SourceLine domains={[GEO, RES, IEC]} />
            </section>

            <section aria-labelledby="gauges" className="space-y-4">
              <h2 id="gauges" className={H2}>
                Gauge by gauge
              </h2>
              <p className={P}>
                The same values for fourteen sizes, each with its own link. Ampacities are the copper columns of the 2023 NEC Table 310.16.
              </p>
              <div className="grid gap-x-10 border-b border-cut-rule md:grid-cols-2">
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
                aught&quot; to &quot;four aught&quot; and written <Size s="1/0" /> to <Size s="4/0" />. 4/0 means four zeros, not a fraction.
                Larger conductors are named by area in kcmil, starting at <Size s="250" />.
              </p>
              <p className={P}>
                A circular mil is the area of a circle one mil (one thousandth of an inch) across. A round conductor&apos;s area in circular
                mils is its diameter in mils squared, so <Size s="4/0" /> at <Num v={SIZE_0000.diameter_mils} src={GEO} /> mils across has an
                area of <Val v={SIZE_0000.area_cmil} unit="cmil" src={GEO} />.
              </p>
            </section>

            <section aria-labelledby="scaling" className="space-y-5">
              <h2 id="scaling" className={H2}>
                How diameter, area and resistance scale
              </h2>
              <p className={P}>
                One gauge step changes the diameter by a factor of <Num v={STEP_RATIO} src={GEO} format={{ fixed: 4 }} />. Three rules follow,
                each worked out from the AWG definition:
              </p>
              <ul className="grid max-w-[880px] gap-5 md:grid-cols-3">
                <li className="border-t-2 border-ink pt-2.5 text-base leading-normal">
                  <strong className="block text-[22px] font-extrabold tracking-[-0.02em]">Six steps</strong> The diameter changes by{' '}
                  <Num v={SIX_STEPS} src={CALC} format={{ fixed: 3 }} prefix="×" />, about double or half.
                </li>
                <li className="border-t-2 border-ink pt-2.5 text-base leading-normal">
                  <strong className="block text-[22px] font-extrabold tracking-[-0.02em]">Three steps</strong> The area changes by{' '}
                  <Num v={THREE_STEPS_AREA} src={CALC} format={{ fixed: 3 }} prefix="×" />, so the resistance per foot about doubles or halves.
                </li>
                <li className="border-t-2 border-ink pt-2.5 text-base leading-normal">
                  <strong className="block text-[22px] font-extrabold tracking-[-0.02em]">Ten steps</strong> The area, and with it the
                  resistance, changes by <Num v={TEN_STEPS_RESISTANCE} src={CALC} format={{ fixed: 2 }} prefix="×" />, close to a factor of ten.
                </li>
              </ul>
              <figure className="space-y-2 pt-2">
                <ThreeSteps />
                <figcaption className="max-w-[34rem] text-[15px] text-[#3d3d3d]">
                  <Size s="10" /> is three gauge steps above <Size s="13" />, so it carries about as much copper as two of them and has about
                  half their resistance per foot.
                </figcaption>
              </figure>
              <p className={P} data-src={GEO}>
                The general formula is{' '}
                <span className="whitespace-nowrap">
                  d = <Val v={AWG_DEFINITION.d_36_in} unit="in" src={GEO} format={INCH} /> × <Num v={SPAN} src={GEO} />
                  <sup>(36 − n) / {AWG_DEFINITION.steps}</sup>
                </span>
                , where n is the gauge number and 1/0 to 4/0 count as 0, −1, −2 and −3.
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
              <DataTable id="metric-table" variant="ruled" src={GEO} caption="AWG area in mm² beside the IEC 60228 sizes">
                <thead>
                  <tr>
                    <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                      AWG
                    </th>
                    <th scope="col" className={RTH}>
                      Area, mm²
                    </th>
                    <th scope="col" className={RTH}>
                      Nearest IEC size, mm²
                    </th>
                    <th scope="col" className={RTH}>
                      Next IEC size up, mm²
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {AWG_TABLE.filter((r) => r.iec60228_nearest_mm2 !== null && r.iec60228_nearest_mm2 !== undefined).map((r) => {
                    const key = sizeKeyFromAwgName(r.awg);
                    return (
                      <tr key={r.awg}>
                        <th scope="row" className={RSTICKY_TD}>
                          <span data-size={key}>{key}</span>
                        </th>
                        <td className={RTD}>
                          <Cell v={r.area_mm2} src={GEO} />
                        </td>
                        <td className={RTD}>
                          <Cell v={r.iec60228_nearest_mm2} src={IEC} />
                        </td>
                        <td className={RTD}>
                          <Cell v={r.iec60228_next_larger_mm2} src={IEC} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </DataTable>
              <SourceLine domains={[GEO, IEC]} />
              <p className="text-[15px] text-[#3d3d3d]">
                Rows stop at <Size s="21" /> because smaller gauges fall below the smallest IEC 60228 size in this data.
              </p>
            </section>

            <section aria-labelledby="ampacity" className="space-y-4">
              <h2 id="ampacity" className={H2}>
                Ampacity is set by the code
              </h2>
              <p className={P}>
                A gauge fixes the copper&apos;s size. How much current the wire may carry is set by the electrical code, and it depends on the
                insulation&apos;s temperature rating, the surrounding temperature and how many current-carrying conductors run together. The
                table below is an excerpt of the 2023 NEC Table 310.16 at its base conditions; the{' '}
                <Link href="/guides/nec-table-310-16" className={LINK}>
                  full Table 310.16 page
                </Link>{' '}
                has every size and the corrections.
              </p>
              <DataTable id="ampacity-table" variant="ruled" src={AMP} caption="2023 NEC Table 310.16 excerpt, amperes, with the 240.4(D) protection limit for copper">
                <thead>
                  <tr>
                    <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                      AWG
                    </th>
                    <th scope="col" className={RTH}>
                      Cu 60 °C
                    </th>
                    <th scope="col" className={RTH}>
                      Cu 75 °C
                    </th>
                    <th scope="col" className={RTH}>
                      Cu 90 °C
                    </th>
                    <th scope="col" className={RTH}>
                      Al 60 °C
                    </th>
                    <th scope="col" className={RTH}>
                      Al 75 °C
                    </th>
                    <th scope="col" className={RTH}>
                      Al 90 °C
                    </th>
                    <th scope="col" className={RTH}>
                      Cu protection limit, 240.4(D)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {AMPACITY_SIZES.map((k) => (
                    <tr key={k}>
                      <th scope="row" className={RSTICKY_TD}>
                        <span data-size={k}>{k}</span>
                      </th>
                      {(['cu_60', 'cu_75', 'cu_90', 'al_60', 'al_75', 'al_90'] as const).map((c) => (
                        <td key={c} className={RTD}>
                          <Cell v={amp(k, c)} src={AMP} />
                        </td>
                      ))}
                      <td className={RTD}>
                        <Cell v={ocpdLimit(k, 'Cu')} src={OCPD} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
              <SourceLine domains={[AMP, OCPD]} />
              <p className={clsx(P, 'pt-2')}>
                Under 2023 NEC 240.4(D), the overcurrent protection for <Size s="14" />, <Size s="12" /> and <Size s="10" /> copper may not
                exceed <Val v={limit14 as number} unit="A" src={OCPD} />, <Val v={limit12 as number} unit="A" src={OCPD} /> and{' '}
                <Val v={limit10 as number} unit="A" src={OCPD} />, even where a temperature column lists more. This limit applies to the breaker
                or fuse, not to the wire&apos;s ampacity.
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
                The 20 °C copper resistance and the weight come from the NIST copper wire tables for solid annealed copper. The 75 °C column and
                the aluminum column are calculated by this site from NIST&apos;s constants and are marked as such; a stranded conductor measures
                slightly higher than these solid values.
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
              <DataTable id="resistance-table" variant="ruled" src={GEO} caption="Resistance and weight per AWG size, solid conductor">
                <thead>
                  <tr>
                    <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                      AWG
                    </th>
                    <th scope="col" className={RTH}>
                      Copper 20 °C, Ω per 1,000 ft
                    </th>
                    <th scope="col" className={RTH}>
                      Copper 20 °C, Ω per km
                    </th>
                    <th scope="col" className={RTH}>
                      Copper 75 °C, Ω per 1,000 ft (calculated)
                    </th>
                    <th scope="col" className={RTH}>
                      Aluminum 20 °C, Ω per 1,000 ft (calculated)
                    </th>
                    <th scope="col" className={RTH}>
                      Copper, lb per 1,000 ft
                    </th>
                    <th scope="col" className={RTH}>
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
                        <th scope="row" className={RSTICKY_TD}>
                          <span data-size={key}>{key}</span>
                        </th>
                        <td className={RTD}>
                          <Cell v={r.r20_cu_ohm_per_1000ft} src={GEO} />
                        </td>
                        <td className={RTD}>
                          <Cell v={r.r20_cu_ohm_per_km} src={GEO} />
                        </td>
                        <td className={RTD}>
                          <Cell v={r.r75_cu_solid_ohm_per_1000ft_derived} src={RES} />
                        </td>
                        <td className={RTD}>
                          <Cell v={al} src={RES} />
                        </td>
                        <td className={RTD}>
                          <Cell v={r.weight_cu_lb_per_1000ft} src={GEO} />
                        </td>
                        <td className={RTD}>
                          <Cell v={r.weight_cu_kg_per_km} src={GEO} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </DataTable>
              <SourceLine domains={[GEO, RES]} />
            </section>

            <section aria-labelledby="faq" className="space-y-6">
              <h2 id="faq" className={H2}>
                Questions
              </h2>
              <div className="space-y-1.5">
                <h3 className={H3}>What does AWG mean?</h3>
                <p className={P} data-src={GEO}>
                  American Wire Gauge, the standard series of wire sizes used in the United States. Its numbers run from 0000 (<Size s="4/0" />)
                  for the thickest wire to <Size s="40" /> and beyond for the thinnest.
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className={H3}>
                  Is <Size s="6" /> bigger than <Size s="24" />?
                </h3>
                <p className={P}>
                  Yes. A smaller gauge number is a thicker wire. <Size s="6" /> is <Val v={r6.diameter_mm} unit="mm" src={GEO} format={MM} />{' '}
                  across and <Size s="24" /> is <Val v={r24.diameter_mm} unit="mm" src={GEO} format={MM} />, about{' '}
                  <Num v={diameterRatio(18)} src={CALC} format={{ fixed: 1 }} /> times the diameter.
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className={H3}>How are AWG sizes calculated?</h3>
                <p className={P}>
                  From two fixed diameters, <Size s="4/0" /> and <Size s="36" />, with <Num v={AWG_DEFINITION.steps} src={GEO} /> equal ratio
                  steps between them. Each step changes the diameter by <Num v={STEP_RATIO} src={GEO} format={{ fixed: 4 }} />; the formula is
                  under{' '}
                  <a href="#scaling" className={LINK}>
                    how diameter, area and resistance scale
                  </a>
                  .
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className={H3}>
                  What is <Size s="14" /> in mm²?
                </h3>
                <p className={P}>
                  <Val v={r14.area_mm2} unit="mm²" src={GEO} />.{' '}
                  {sameIec ? (
                    <>
                      The nearest IEC 60228 size, <Val v={r14.iec60228_nearest_mm2 as number} unit="mm²" src={IEC} />, is also the next size up.
                    </>
                  ) : (
                    <>
                      The nearest IEC 60228 size is <Val v={r14.iec60228_nearest_mm2 as number} unit="mm²" src={IEC} />, and the next one up is{' '}
                      <Val v={r14.iec60228_next_larger_mm2 as number} unit="mm²" src={IEC} />.
                    </>
                  )}
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className={H3}>
                  What is the diameter of <Size s="20" /> wire in mm?
                </h3>
                <p className={P}>
                  <Val v={r20.diameter_mm} unit="mm" src={GEO} format={MM} /> (<Val v={r20.diameter_in} unit="in" src={GEO} format={INCH} />) for
                  a solid conductor. Stranded and insulated wire is larger overall.
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className={H3}>
                  What do <span data-size="1/0">1/0</span> and <span data-size="4/0">4/0</span> mean?
                </h3>
                <p className={P} data-src={GEO}>
                  They are the gauges written 0 and 0000, one size and four sizes thicker than <Size s="1" />. <Size s="4/0" /> is the largest AWG
                  size, at <Val v={SIZE_0000.area_cmil} unit="cmil" src={GEO} />; the next common size is <Size s="250" />.
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className={H3}>
                  What is the difference between <Size s="10" /> and <Size s="12" />?
                </h3>
                <p className={P}>
                  <Size s="10" /> is two gauge steps thicker: <Val v={r10.diameter_mm} unit="mm" src={GEO} format={MM} /> against{' '}
                  <Val v={r12.diameter_mm} unit="mm" src={GEO} format={MM} />, with <Num v={areaRatio(2)} src={CALC} format={{ fixed: 2 }} /> times
                  the area and correspondingly lower resistance. Under 2023 NEC 240.4(D), <Size s="10" /> copper may be protected at up to{' '}
                  <Val v={limit10 as number} unit="A" src={OCPD} /> and <Size s="12" /> copper at up to{' '}
                  <Val v={limit12 as number} unit="A" src={OCPD} />.
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className={H3}>
                  How much current can <Size s="12" /> copper carry?
                </h3>
                <p className={P} data-src={AMP}>
                  Table 310.16 (2023 NEC) lists <Val v={amp('12', 'cu_60') as number} unit="A" src={AMP} />,{' '}
                  <Val v={amp('12', 'cu_75') as number} unit="A" src={AMP} /> and <Val v={amp('12', 'cu_90') as number} unit="A" src={AMP} /> in
                  its 60, 75 and 90 °C columns, for up to three current-carrying conductors at 30 °C. NEC 240.4(D) limits the breaker or fuse to{' '}
                  <Val v={limit12 as number} unit="A" src={OCPD} />. Higher ambient temperatures and more conductors lower the ampacity; the{' '}
                  <Link href="/calculators/ampacity-calculator" className={LINK}>
                    ampacity calculator
                  </Link>{' '}
                  applies both corrections.
                </p>
              </div>
            </section>

            <section aria-label="Sources and method" className="space-y-3 border-t-2 border-ink pt-4 text-[15.5px] text-[#333333]">
              <Sources
                domains={SOURCE_DOMAINS}
                headingClassName="font-display text-[32px] font-extrabold tracking-[-0.035em] text-ink"
                listClassName="list-disc space-y-1 pl-6"
                linkClassName={LINK}
              />
              <p data-src={AMP} className="max-w-[34rem]">
                Values marked calculated are worked out by this site from NIST&apos;s constants; the{' '}
                <Link href="/methodology" className={LINK}>
                  methodology page
                </Link>{' '}
                gives each formula. ASTM B258 defines the AWG diameters; its text is not reproduced here. NFPA 70®, National Electrical Code® and
                NEC® are registered trademarks of the National Fire Protection Association; NEC values are shown as data with attribution.
              </p>
            </section>
          </div>

          <GuidesNav guides={GUIDE_GROUPS} calculators={GUIDE_CALCULATORS} look="look" />
        </div>
      </article>
    </div>
  );
}
