import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { DatasetSchema } from '@/components/seo/DatasetSchema';
import { Byline } from '@/components/content/Byline';
import { DataTable, STICKY_TD, STICKY_TH, TD, TH } from '@/components/content/DataTable';
import { Figure } from '@/components/content/Figure';
import { Num } from '@/components/content/Num';
import { Size } from '@/components/content/Size';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { calculateAmpacity } from '@/lib/calculations/ampacity';
import { minimumServiceAmpacity } from '@/lib/calculations/service-lookup';
import { articleDates, formatDate } from '@/lib/page-dates';
import { conditions240_4D, max240_4D, ROWS_240_4_D } from '@/lib/verified/nec-240-4-d';
import type { Row240_4D } from '@/lib/verified/nec-240-4-d';
import { NEC_2026_DOMAIN, NEC_2026_EFFECTIVE, NEC_2026_ISSUED, NEC_2026_MIN_SIZES } from '@/lib/verified/nec-2026-edition';
import { SERVICE_AMPACITY_PERCENT, TABLE_310_12_ROWS, table31012 } from '@/lib/verified/nec-310-12';
import { AMBIENT_ROWS } from '@/lib/verified/nec-310-15-B-1-1';
import { ADJUSTMENT_ROWS } from '@/lib/verified/nec-310-15-C-1';
import { AMPACITY_COLUMNS, COLUMN_TYPES, TABLE_310_16_ROWS, TABLE_AMBIENT, table31016 } from '@/lib/verified/nec-310-16';
import type { Table31016Column } from '@/lib/verified/nec-310-16';
import { attribution } from '@/lib/verified/registry';

// /guides/nec-table-310-16 (WSZ-005a): all 30 rows of the 2023 NEC Table 310.16, both correction tables, the 240.4(D)
// limits, the Table 310.12 dwelling sizes and the final 2026-edition facts, every value from src/lib/verified, the
// registry or an engine. Spec: research/page-specs.md "WSZ-005". Not here until their waves: the column a circuit may
// use (WSZ-009), NM cable, Table 310.17. NFPA's text is not quoted; values are shown as data with attribution.
const ROUTE = '/guides/nec-table-310-16';
const URL = `https://wiresizes.com${ROUTE}`;
const H1 = 'NEC Table 310.16 Ampacity Chart (2023 NEC)';
const TITLE = 'NEC Table 310.16 Ampacity Chart (2023 NEC)';
const DESCRIPTION =
  'All 30 rows of 2023 NEC Table 310.16, copper and aluminum at 60, 75 and 90 °C, with the ambient and conductor-count corrections and a worked example.';

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

const AMP = 'nec-310-16';
const COR = 'nec-310-15-corrections';
const OCPD = 'nec-240-4-d';
const SVC = 'nec-310-12';
const ED = NEC_2026_DOMAIN;
const CALC_AMP = 'calc:ampacity';
const CALC_SVC = 'calc:service-lookup';
const SOURCE_DOMAINS = [AMP, COR, OCPD, SVC, ED];

const LINK = 'text-blue-700 underline underline-offset-2 hover:text-blue-900';
const H2 = 'scroll-mt-20 text-2xl font-semibold text-gray-900';
const H3 = 'text-lg font-semibold text-gray-900';
const P = 'leading-relaxed text-gray-800';

const COLUMNS: Table31016Column[] = ['cu_60', 'cu_75', 'cu_90', 'al_60', 'al_75', 'al_90'];
const amp = (size: string, column: Table31016Column) => table31016(size, column) as number;
/** Sizes with a 240.4(D) row (conditional rows included). */
const LIMITED = new Set(ROWS_240_4_D.map((r) => r.size));
const unconditional = (size: string, material: 'Cu' | 'Al') => {
  const row = max240_4D(size, material);
  return row && row.conditions === null ? row.max_ocpd_a : null;
};

// The worked example: the golden case "6 AWG cu_90 at 41–45 °C, 4–6 current-carrying" through the ampacity engine
const EXAMPLE = { size: '6', material: 'Cu' as const, column: 90 as const, ambientRow: '41–45', band: '4–6' };
function required<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`nec-table-310-16 page: no ${what}`);
  return value;
}
const RESULT = calculateAmpacity(EXAMPLE);
const EXAMPLE_RESULT = {
  tableAmpacity: required(RESULT.tableAmpacity, 'worked example table value'),
  correctionFactor: required(RESULT.correctionFactor, 'worked example correction factor'),
  adjustmentPercent: RESULT.adjustmentPercent,
  ampacity: required(RESULT.ampacity, 'worked example result'),
};
const EXAMPLE_AMBIENT = required(AMBIENT_ROWS.find((r) => r.key === EXAMPLE.ambientRow), 'worked example ambient row');

const SERVICE_200 = required(table31012(200), 'Table 310.12 row for 200 A');
const MIN_200 = minimumServiceAmpacity(SERVICE_200.ratingA);

function Dash({ label = 'no value' }: { label?: string }) {
  return <span aria-label={label}>–</span>;
}

const materialName = (m: string) => (m === 'Cu' ? 'copper' : m === 'Al' ? 'aluminum' : 'copper-clad aluminum');

/** A 240.4(D) row's conditions in plain words; numbers from the data text (conditions240_4D). */
function ConditionWords({ row }: { row: Row240_4D }) {
  const c = conditions240_4D(row);
  if (!c) return <span className="text-gray-600">None</span>;
  return (
    <>
      Continuous load no more than <Val v={c.continuousMaxA} unit="A" src={OCPD} />, and a breaker or fuse listed and marked for{' '}
      <Size s={row.size} /> {materialName(row.material)}
      {c.fuseClasses && <>, or Class {c.fuseClasses.slice(0, -1).join(', ')} or {c.fuseClasses[c.fuseClasses.length - 1]} fuses</>}
    </>
  );
}

// ── SVGs ──────────────────────────────────────────────────────────────────────────────────────────────────────────
// Tokens as on the AWG chart: copper #f59e0b at 25 % with a #92400e stroke, text #111827 at 13 and 11 px, rules
// #9ca3af, accent #1d4ed8.

/** What the table assumes: up to three current-carrying conductors together, in 30 °C (86 °F) surroundings. Labels
 *  beside the raceway from sm up, below it on narrow screens. */
function BaseConditions({ narrow = false }: { narrow?: boolean }) {
  const id = narrow ? 'base-narrow-title' : 'base-title';
  const [w, h] = narrow ? [300, 330] : [520, 210];
  const [cx, cy] = narrow ? [150, 100] : [130, 105];
  const labelX = narrow ? 24 : 230;
  const labelY = narrow ? 210 : 70;
  const font = narrow ? 16 : 13;
  const conductor = (dx: number, dy: number, n: number) => (
    <g key={n}>
      <circle cx={cx + dx} cy={cy + dy} r={22} fill="#f59e0b40" stroke="#92400e" strokeWidth={1.5} />
      <text x={cx + dx} y={cy + dy + 5} textAnchor="middle" fontSize={14} fontWeight={600} fill="#111827" aria-hidden="true">
        {n}
      </text>
    </g>
  );
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-labelledby={id}
      className={clsx('h-auto', narrow ? 'max-w-[360px] sm:hidden' : 'hidden max-w-[560px] sm:block')}
      data-src={AMP}
    >
      <title id={id}>{`Table 310.16 conditions: not more than three current-carrying conductors, in ${TABLE_AMBIENT.c} °C (${TABLE_AMBIENT.f} °F) surroundings`}</title>
      <rect x={1} y={1} width={w - 2} height={h - 2} rx={8} fill="#eff6ff" stroke="#bfdbfe" />
      <circle cx={cx} cy={cy} r={70} fill="#ffffff" stroke="#6b7280" strokeWidth={3} />
      {conductor(-26, -17, 1)}
      {conductor(26, -17, 2)}
      {conductor(0, 27, 3)}
      <text x={labelX} y={labelY} fontSize={font} fontWeight={600} fill="#111827">
        Not more than three
      </text>
      <text x={labelX} y={labelY + font + 5} fontSize={font} fill="#111827">
        current-carrying conductors
      </text>
      <text x={labelX} y={labelY + 3 * font + 8} fontSize={font} fontWeight={600} fill="#111827">
        Ambient temperature
      </text>
      <text x={labelX} y={labelY + 4 * font + 13} fontSize={font} fill="#111827">
        <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} svg /> (<Val v={TABLE_AMBIENT.f} unit="°F" src={AMP} svg />)
      </text>
    </svg>
  );
}

/** The worked example as four boxes: table value, ambient factor, adjustment percent, result. One row from sm up, two
 *  rows of two on narrow screens. */
function CorrectionChain({ narrow = false }: { narrow?: boolean }) {
  const steps = [
    { label: 'Table 310.16', value: <Val v={EXAMPLE_RESULT.tableAmpacity} unit="A" src={AMP} svg />, sub: `${EXAMPLE.column} °C column` },
    { label: 'Ambient', value: <Num v={EXAMPLE_RESULT.correctionFactor} src={COR} format={{ fixed: 2 }} prefix="× " svg />, sub: `${EXAMPLE.ambientRow} °C` },
    { label: 'Conductors', value: <Val v={EXAMPLE_RESULT.adjustmentPercent} unit="%" src={COR} svg />, sub: `${EXAMPLE.band} together` },
    { label: 'Ampacity', value: <Val v={EXAMPLE_RESULT.ampacity} unit="A" src={CALC_AMP} format={{ fixed: 1 }} svg />, sub: 'corrected' },
  ];
  const w = 128;
  const gap = 8;
  const perRow = narrow ? 2 : 4;
  const rowsCount = Math.ceil(steps.length / perRow);
  const id = narrow ? 'chain-narrow-title' : 'chain-title';
  return (
    <svg
      viewBox={`0 0 ${perRow * w + (perRow - 1) * gap} ${rowsCount * 120 + (rowsCount - 1) * gap}`}
      width="100%"
      role="img"
      aria-labelledby={id}
      className={clsx('h-auto', narrow ? 'max-w-[300px] sm:hidden' : 'hidden max-w-[560px] sm:block')}
      data-src={COR}
    >
      <title id={id}>{`Worked example: ${EXAMPLE.size} AWG copper, ${EXAMPLE.column} °C column, ${EXAMPLE.ambientRow} °C ambient, ${EXAMPLE.band} current-carrying conductors`}</title>
      {steps.map((s, i) => {
        const x = (i % perRow) * (w + gap);
        const y = Math.floor(i / perRow) * (120 + gap);
        const last = i === steps.length - 1;
        return (
          <g key={s.label} data-src={i === 0 ? AMP : i === 3 ? CALC_AMP : COR}>
            <rect x={x + 1} y={y + 1} width={w - 2} height={118} rx={8} fill={last ? '#1d4ed8' : '#ffffff'} stroke={last ? '#1d4ed8' : '#9ca3af'} />
            <text x={x + w / 2} y={y + 30} textAnchor="middle" fontSize={13} fontWeight={600} fill={last ? '#ffffff' : '#374151'}>
              {s.label}
            </text>
            <text x={x + w / 2} y={y + 68} textAnchor="middle" fontSize={22} fontWeight={700} fill={last ? '#ffffff' : '#111827'}>
              {s.value}
            </text>
            <text x={x + w / 2} y={y + 98} textAnchor="middle" fontSize={12} fill={last ? '#dbeafe' : '#4b5563'}>
              {s.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const TOC: [string, string][] = [
  ['table', 'Table 310.16, all sizes'],
  ['columns', 'Reading the columns'],
  ['ambient', 'Ambient temperature correction'],
  ['bundling', 'More than three current-carrying conductors'],
  ['example', 'Worked example'],
  ['small-conductors', 'Small conductors and 240.4(D)'],
  ['dwellings', 'Dwelling services and Table 310.12'],
  ['nec-2026', 'What the 2026 NEC changed'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: H1, description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

export default function NecTable31016Page() {
  const dates = articleDates(ROUTE);
  return (
    <article className="space-y-10 pb-12 text-base">
      <ArticleSchema article={articleData} />
      <DatasetSchema
        path={ROUTE}
        name="NEC Table 310.16 allowable ampacities (2023)"
        alternateName={['NEC 310.16', 'Table 310.16 ampacity chart']}
        description="Allowable ampacities of insulated copper and aluminum or copper-clad aluminum conductors, 18 AWG to 2000 kcmil, in the 60, 75 and 90 °C columns of NFPA 70 (NEC) 2023 Table 310.16, with the Table 310.15(B)(1)(1) ambient correction factors and Table 310.15(C)(1) adjustment percents. Values shown as data with attribution to NFPA."
        variableMeasured={[
          { name: 'Allowable ampacity', unitText: 'ampere', unitCode: 'AMP' },
          { name: 'Ambient temperature correction factor' },
          { name: 'Adjustment for more than three current-carrying conductors', unitText: 'percent', unitCode: 'P1' },
        ]}
        keywords={['NEC Table 310.16', 'ampacity', 'ampacity chart', 'NFPA 70', '2023 NEC']}
        isBasedOn={[AMP, COR].map((d) => ({ name: attribution(d).publisher, url: attribution(d).url }))}
        datePublished={dates.datePublished}
        dateModified={dates.dateModified}
      />

      <header className="space-y-3">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{H1}</h1>
        <Byline route={ROUTE} sources className="text-sm text-gray-600" linkClassName="text-blue-700" />
      </header>

      <div className="rounded-md border border-blue-200 bg-blue-50 px-5 py-4" data-src={AMP}>
        <p className={P}>
          <strong>NEC Table 310.16 gives the allowable ampacity of insulated copper and aluminum conductors</strong> for not more than three
          current-carrying conductors in raceway, cable or earth at an ambient temperature of <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} /> (
          <Val v={TABLE_AMBIENT.f} unit="°F" src={AMP} />). For example, <Size s="12" /> copper is rated{' '}
          <Val v={amp('12', 'cu_60')} unit="A" src={AMP} />, <Val v={amp('12', 'cu_75')} unit="A" src={AMP} /> and{' '}
          <Val v={amp('12', 'cu_90')} unit="A" src={AMP} /> in the 60, 75 and 90 °C columns, and 2023 NEC 240.4(D) limits its breaker or fuse
          to <Val v={unconditional('12', 'Cu') as number} unit="A" src={OCPD} />.
        </p>
      </div>

      <Figure
        caption={
          <span data-src={AMP}>
            Every value in the table assumes these two conditions. Hotter surroundings or more conductors together lower the ampacity through
            the two correction tables below.
          </span>
        }
      >
        <BaseConditions />
        <BaseConditions narrow />
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

      <section aria-labelledby="table" className="space-y-4">
        <h2 id="table" className={H2}>
          Table 310.16, all sizes
        </h2>
        <p className={P} data-src={AMP}>
          Amperes per conductor from the 2023 edition, for every size the table lists. A dash means the table gives no value in that column.
          Sizes marked † have an overcurrent protection limit under 240.4(D), listed under{' '}
          <a href="#small-conductors" className={LINK}>
            small conductors
          </a>
          .
        </p>
        <DataTable id="ampacity-table" src={AMP} caption="2023 NEC Table 310.16, allowable ampacities in amperes">
          <thead>
            <tr>
              <th scope="col" rowSpan={2} className={clsx(TH, STICKY_TH)}>
                Size
              </th>
              <th scope="colgroup" colSpan={3} className={clsx(TH, 'text-center')}>
                Copper
              </th>
              <th scope="colgroup" colSpan={3} className={clsx(TH, 'text-center')}>
                Aluminum or copper-clad aluminum
              </th>
            </tr>
            <tr>
              {COLUMNS.map((c) => (
                <th key={c} scope="col" className={TH}>
                  {c.split('_')[1]} °C
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_310_16_ROWS.map((r) => (
              <tr key={r.size}>
                <th scope="row" className={clsx(TD, STICKY_TD, 'whitespace-nowrap')}>
                  <Size s={r.size} />
                  {LIMITED.has(r.size) && (
                    <a href="#small-conductors" className="ml-1 text-blue-700 no-underline" aria-label="240.4(D) limit applies">
                      †
                    </a>
                  )}
                </th>
                {COLUMNS.map((c) => (
                  <td key={c} className={TD}>
                    {r[c] === null ? <Dash /> : <Num v={r[c] as number} src={AMP} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section aria-labelledby="columns" className="space-y-4">
        <h2 id="columns" className={H2}>
          Reading the columns
        </h2>
        <p className={P} data-src={AMP}>
          The three temperatures are insulation ratings: the highest temperature the conductor&apos;s insulation is rated to run at. A hotter
          rating allows more current through the same metal. The table groups insulation types under each column:
        </p>
        <dl className="grid gap-x-4 gap-y-2 rounded-md border border-gray-200 bg-white p-4 text-sm sm:grid-cols-[6rem_1fr]" data-src={AMP}>
          {AMPACITY_COLUMNS.map((c) => (
            <div key={c} className="contents">
              <dt className="font-semibold text-gray-900">
                <Val v={c} unit="°C" src={AMP} />
              </dt>
              <dd className="text-gray-800">{COLUMN_TYPES[c]}</dd>
            </div>
          ))}
        </dl>
        <p className={P} data-src={AMP}>
          The copper columns are for copper conductors. The other three are for aluminum and copper-clad aluminum, which carry less current at
          the same size: <Size s="4/0" /> is <Val v={amp('4/0', 'cu_75')} unit="A" src={AMP} /> in copper and{' '}
          <Val v={amp('4/0', 'al_75')} unit="A" src={AMP} /> in aluminum at 75 °C. The 2023 table lists <Size s="18" /> and <Size s="16" />{' '}
          copper only in the 90 °C column, and starts aluminum at <Size s="12" />.
        </p>
      </section>

      <section aria-labelledby="ambient" className="space-y-4">
        <h2 id="ambient" className={H2}>
          Ambient temperature correction
        </h2>
        <p className={P} data-src={COR}>
          Where the conductors run in surroundings other than <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} />, multiply the Table 310.16 value
          by the factor for the ambient temperature, taken from the same temperature column. Factors above 1 apply in cooler surroundings. A
          dash means conductors of that rating may not be used at that temperature.
        </p>
        <DataTable id="ambient-table" src={COR} caption="2023 NEC Table 310.15(B)(1)(1), correction factors based on 30 °C (86 °F)">
          <thead>
            <tr>
              <th scope="col" className={clsx(TH, STICKY_TH)}>
                Ambient, °C
              </th>
              <th scope="col" className={TH}>
                Ambient, °F
              </th>
              <th scope="col" className={TH}>
                60 °C column
              </th>
              <th scope="col" className={TH}>
                75 °C column
              </th>
              <th scope="col" className={TH}>
                90 °C column
              </th>
            </tr>
          </thead>
          <tbody>
            {AMBIENT_ROWS.map((r) => (
              <tr key={r.key}>
                <th scope="row" className={clsx(TD, STICKY_TD, 'whitespace-nowrap')}>
                  {r.key}
                </th>
                <td className={clsx(TD, 'whitespace-nowrap')}>{r.ambientF}</td>
                {[r.f_60, r.f_75, r.f_90].map((f, i) => (
                  <td key={i} className={TD}>
                    {f === null ? <Dash label="not permitted" /> : <Num v={f} src={COR} format={{ fixed: 2 }} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section aria-labelledby="bundling" className="space-y-4">
        <h2 id="bundling" className={H2}>
          More than three current-carrying conductors
        </h2>
        <p className={P} data-src={COR}>
          Table 310.16 assumes no more than three current-carrying conductors in a raceway or cable. With more, multiply by the percent below,
          after any ambient correction. This site has not yet verified the rules for which conductors count as current-carrying, such as
          neutrals and equipment grounding conductors, so check them in the Code.
        </p>
        <DataTable id="adjustment-table" src={COR} caption="2023 NEC Table 310.15(C)(1), percent of the Table 310.16 value">
          <thead>
            <tr>
              <th scope="col" className={clsx(TH, STICKY_TH)}>
                Current-carrying conductors
              </th>
              <th scope="col" className={TH}>
                Percent of table value
              </th>
            </tr>
          </thead>
          <tbody>
            {ADJUSTMENT_ROWS.map((r) => (
              <tr key={r.key}>
                <th scope="row" className={clsx(TD, STICKY_TD)}>
                  {r.key}
                </th>
                <td className={TD}>
                  <Val v={r.percent} unit="%" src={COR} />
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section aria-labelledby="example" className="space-y-4">
        <h2 id="example" className={H2}>
          Worked example
        </h2>
        <p className={P} data-src={AMP}>
          <Size s={EXAMPLE.size} /> copper with <Val v={EXAMPLE.column} unit="°C" src={AMP} /> insulation, in a space that reaches{' '}
          <span data-src={COR}>
            {EXAMPLE_AMBIENT.key} °C ({EXAMPLE_AMBIENT.ambientF} °F)
          </span>
          , with <span data-src={COR}>{EXAMPLE.band}</span> current-carrying conductors in the raceway. The ampacity calculator
          works it out the same way, in three steps:
        </p>
        <Figure
          caption={
            <>
              <Val v={EXAMPLE_RESULT.tableAmpacity} unit="A" src={AMP} /> ×{' '}
              <Num v={EXAMPLE_RESULT.correctionFactor} src={COR} format={{ fixed: 2 }} /> ×{' '}
              <Val v={EXAMPLE_RESULT.adjustmentPercent} unit="%" src={COR} /> ={' '}
              <Val v={EXAMPLE_RESULT.ampacity} unit="A" src={CALC_AMP} format={{ fixed: 1 }} />. The same arithmetic runs in the{' '}
              <Link href="/calculators/ampacity-calculator" className={LINK}>
                ampacity calculator
              </Link>{' '}
              for any size and condition.
            </>
          }
        >
          <CorrectionChain />
          <CorrectionChain narrow />
        </Figure>
        <ol className="list-decimal space-y-2 pl-6 text-gray-800" data-src={AMP}>
          <li>
            Table 310.16 gives <Val v={EXAMPLE_RESULT.tableAmpacity} unit="A" src={AMP} /> for <Size s={EXAMPLE.size} /> copper in
            the <Val v={EXAMPLE.column} unit="°C" src={AMP} /> column.
          </li>
          <li>
            Table 310.15(B)(1)(1) gives <Num v={EXAMPLE_RESULT.correctionFactor} src={COR} format={{ fixed: 2 }} /> for that ambient in the
            same column.
          </li>
          <li>
            Table 310.15(C)(1) gives <Val v={EXAMPLE_RESULT.adjustmentPercent} unit="%" src={COR} /> for that number of conductors, which
            leaves <Val v={EXAMPLE_RESULT.ampacity} unit="A" src={CALC_AMP} format={{ fixed: 1 }} />.
          </li>
        </ol>
      </section>

      <section aria-labelledby="small-conductors" className="space-y-4">
        <h2 id="small-conductors" className={H2}>
          Small conductors and 240.4(D)
        </h2>
        <p className={P} data-src={OCPD}>
          For the smallest sizes, 2023 NEC 240.4(D) caps the breaker or fuse rating below what the ampacity columns would allow. The cap
          applies after the ambient and conductor-count corrections. <Size s="14" /> copper, for instance, has{' '}
          <Val v={amp('14', 'cu_75')} unit="A" src={AMP} /> in the 75 °C column but may not be protected above{' '}
          <Val v={unconditional('14', 'Cu') as number} unit="A" src={OCPD} />. Three of the sizes come with conditions, shown in plain words
          below.
        </p>
        <DataTable id="limits-table" src={OCPD} caption="2023 NEC 240.4(D), maximum overcurrent protection">
          <thead>
            <tr>
              <th scope="col" className={clsx(TH, STICKY_TH)}>
                Size
              </th>
              <th scope="col" className={TH}>
                Material
              </th>
              <th scope="col" className={TH}>
                Maximum protection
              </th>
              <th scope="col" className={TH}>
                Conditions
              </th>
              <th scope="col" className={TH}>
                Item
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS_240_4_D.map((r) => (
              <tr key={`${r.item}-${r.material}`}>
                <th scope="row" className={clsx(TD, STICKY_TD, 'whitespace-nowrap')}>
                  <Size s={r.size} />
                </th>
                <td className={TD}>{materialName(r.material)}</td>
                <td className={TD}>
                  <Val v={r.max_ocpd_a} unit="A" src={OCPD} />
                </td>
                <td className={clsx(TD, 'min-w-[16rem]')}>
                  <ConditionWords row={r} />
                </td>
                <td className={clsx(TD, 'whitespace-nowrap')}>{r.item}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section aria-labelledby="dwellings" className="space-y-4">
        <h2 id="dwellings" className={H2}>
          Dwelling services and Table 310.12
        </h2>
        <p className={P} data-src={SVC}>
          For the 120/240 V single-phase service or main power feeder of one dwelling unit, Table 310.12 may be used instead. Its conductors need
          an ampacity of at least <Val v={SERVICE_AMPACITY_PERCENT} unit="%" src={SVC} /> of the service rating, so the sizes are smaller than
          Table 310.16 alone would give. Corrections for hot surroundings or more than three conductors still apply. The{' '}
          <Link href="/guides/wire-size-for-200-amp" className={LINK}>
            200 amp service guide
          </Link>{' '}
          and the{' '}
          <Link href="/calculators/service-entrance-calculator" className={LINK}>
            service entrance calculator
          </Link>{' '}
          use this table.
        </p>
        <DataTable id="service-table" src={SVC} caption="2023 NEC Table 310.12, dwelling services and main power feeders">
          <thead>
            <tr>
              <th scope="col" className={clsx(TH, STICKY_TH)}>
                Service rating, A
              </th>
              <th scope="col" className={TH}>
                Copper
              </th>
              <th scope="col" className={TH}>
                Aluminum or copper-clad aluminum
              </th>
            </tr>
          </thead>
          <tbody>
            {TABLE_310_12_ROWS.map((r) => (
              <tr key={r.ratingA}>
                <th scope="row" className={clsx(TD, STICKY_TD)}>
                  <Num v={r.ratingA} src={SVC} />
                </th>
                <td className={TD}>
                  <Size s={r.cu} />
                </td>
                <td className={TD}>
                  <Size s={r.alCca} />
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section aria-labelledby="nec-2026" className="space-y-4">
        <h2 id="nec-2026" className={H2}>
          What the 2026 NEC changed
        </h2>
        <p className={P} data-src={ED}>
          NFPA issued the 2026 edition on <time dateTime={NEC_2026_ISSUED}>{formatDate(NEC_2026_ISSUED)}</time>, effective{' '}
          <time dateTime={NEC_2026_EFFECTIVE}>{formatDate(NEC_2026_EFFECTIVE)}</time>. It moves the minimum-size rule from 310.3(A) to 310.5, with
          minimum sizes of <Size s={NEC_2026_MIN_SIZES.Cu} /> copper, <Size s={NEC_2026_MIN_SIZES.CCA} /> copper-clad aluminum and{' '}
          <Size s={NEC_2026_MIN_SIZES.Al} /> aluminum, and it renumbers the load-calculation article from 220 to 120.
        </p>
        <p className={P} data-src={AMP}>
          NFPA&apos;s 2026 revision drafts show the Table 310.16 rows from <Size s="12" /> to <Size s="2000" /> unchanged. This site has not seen
          the final 2026 table, so this page shows the 2023 values. Which edition applies depends on what your state or city has adopted.
        </p>
      </section>

      <section aria-labelledby="faq" className="space-y-5">
        <h2 id="faq" className={H2}>
          Questions
        </h2>
        <div className="space-y-1">
          <h3 className={H3}>What is NEC Table 310.16?</h3>
          <p className={P} data-src={AMP}>
            The National Electrical Code table of allowable ampacities for insulated conductors, from <Size s="18" /> to <Size s="2000" />, for
            copper and for aluminum or copper-clad aluminum, at 60, 75 and 90 °C insulation ratings. Its values assume no more than three
            current-carrying conductors and <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} /> surroundings.
          </p>
        </div>
        <div className="space-y-1">
          <h3 className={H3}>
            What is the ampacity of <Size s="10" /> copper?
          </h3>
          <p className={P} data-src={AMP}>
            <Val v={amp('10', 'cu_60')} unit="A" src={AMP} />, <Val v={amp('10', 'cu_75')} unit="A" src={AMP} /> and{' '}
            <Val v={amp('10', 'cu_90')} unit="A" src={AMP} /> in the 60, 75 and 90 °C columns. 240.4(D) limits its overcurrent protection to{' '}
            <Val v={unconditional('10', 'Cu') as number} unit="A" src={OCPD} />.
          </p>
        </div>
        <div className="space-y-1">
          <h3 className={H3}>
            What is the ampacity of <Size s="8" /> copper?
          </h3>
          <p className={P} data-src={AMP}>
            <Val v={amp('8', 'cu_60')} unit="A" src={AMP} />, <Val v={amp('8', 'cu_75')} unit="A" src={AMP} /> and{' '}
            <Val v={amp('8', 'cu_90')} unit="A" src={AMP} /> in the 60, 75 and 90 °C columns. 240.4(D) does not cover this size.
          </p>
        </div>
        <div className="space-y-1">
          <h3 className={H3}>
            What is the ampacity of <Size s="14" /> copper, and why is it protected at <Val v={unconditional('14', 'Cu') as number} unit="A" src={OCPD} />?
          </h3>
          <p className={P} data-src={AMP}>
            <Val v={amp('14', 'cu_60')} unit="A" src={AMP} />, <Val v={amp('14', 'cu_75')} unit="A" src={AMP} /> and{' '}
            <Val v={amp('14', 'cu_90')} unit="A" src={AMP} /> in the 60, 75 and 90 °C columns. 240.4(D) separately caps the breaker or fuse
            for <Size s="14" /> copper at <Val v={unconditional('14', 'Cu') as number} unit="A" src={OCPD} />, whatever the column.
          </p>
        </div>
        <div className="space-y-1">
          <h3 className={H3}>
            Why does a <Val v={SERVICE_200.ratingA} unit="A" src={SVC} /> dwelling service use <Size s={SERVICE_200.alCca} /> aluminum when
            Table 310.16 lists <Val v={amp(SERVICE_200.alCca, 'al_75')} unit="A" src={AMP} />?
          </h3>
          <p className={P} data-src={SVC}>
            Because Table 310.12 applies to dwelling services, and it needs only{' '}
            <Val v={SERVICE_AMPACITY_PERCENT} unit="%" src={SVC} /> of the service rating: <Val v={MIN_200} unit="A" src={CALC_SVC} /> for a{' '}
            <Val v={SERVICE_200.ratingA} unit="A" src={SVC} /> service. It lists <Size s={SERVICE_200.alCca} /> aluminum or copper-clad
            aluminum and <Size s={SERVICE_200.cu} /> copper for that rating. Other services and feeders are sized from Table 310.16.
          </p>
        </div>
        <div className="space-y-1">
          <h3 className={H3}>Did the 2026 NEC change Table 310.16?</h3>
          <p className={P} data-src={AMP}>
            NFPA&apos;s 2026 revision drafts show the rows from <Size s="12" /> to <Size s="2000" /> unchanged. This site has not seen the
            final 2026 table text, so it cannot confirm the smaller sizes; the values here are from the 2023 edition.
          </p>
        </div>
      </section>

      <section aria-label="Sources and notices" className="space-y-3 border-t border-gray-200 pt-6 text-sm text-gray-700">
        <Sources domains={SOURCE_DOMAINS} headingClassName={H2} listClassName="list-disc space-y-1 pl-6" linkClassName={LINK} />
        <p data-src={AMP}>
          Values are shown as data with attribution; NFPA&apos;s table notes are not reproduced. The{' '}
          <Link href="/methodology" className={LINK}>
            methodology page
          </Link>{' '}
          describes each source. NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the National Fire Protection
          Association; wiresizes.com is not affiliated with or endorsed by NFPA.
        </p>
        <p>
          For sizes, diameters and resistance of each gauge, see the{' '}
          <Link href="/guides/awg-wire-size-chart" className={LINK}>
            AWG wire size chart
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
