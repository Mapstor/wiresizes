import type { Metadata } from 'next';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { monthOf } from '@/components/content/AsOf';
import { Byline } from '@/components/content/Byline';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import { BasicPageSchema } from '@/components/seo/BasicPageSchema';
import { RATING_MAX_A, RATING_MIN_A, terminationColumn } from '@/lib/calculations/conductor-sizing';
import { BTU_PER_H_PER_TON, W_PER_BTU_PER_H, W_PER_ELECTRICAL_HP, W_PER_MECHANICAL_HP } from '@/lib/calculations/conversions';
import { DC_TEMPERATURE_OPTIONS } from '@/lib/calculations/dc-sizing';
import { formatValue } from '@/lib/calculations/format';
import { GROUND_WIRE_RATINGS } from '@/lib/calculations/grounding';
import { ALUMINUM_ALPHA, COPPER_ALPHA, REFERENCE_TEMP_C } from '@/lib/calculations/resistance';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { CITED_PAGE_NAMES, METHODOLOGY_EXTRA_SECTIONS, METHODOLOGY_ROUTE, METHODOLOGY_SECTIONS } from '@/lib/methodology';
import type { MethodologySection } from '@/lib/methodology';
import { AWG_CONSTANTS, AWG_DEFINITION, awgRow, kcmilRow } from '@/lib/verified/awg';
import { ROWS_240_4_D } from '@/lib/verified/nec-240-4-d';
import { ocpdRatings } from '@/lib/verified/nec-240-6-a';
import { TABLE_250_122_ROWS } from '@/lib/verified/nec-250-122';
import { ADJUSTMENT_ROWS } from '@/lib/verified/nec-310-15-C-1';
import { SERVICE_AMPACITY_PERCENT, TABLE_310_12_ROWS } from '@/lib/verified/nec-310-12';
import { AMPACITY_COLUMNS, TABLE_310_16_ROWS, TABLE_310_16_SIZES, TABLE_AMBIENT } from '@/lib/verified/nec-310-16';
import { attribution, attributionParts, coverage } from '@/lib/verified/registry';
import { NEC_2026_EFFECTIVE, NEC_2026_ISSUED, NEC_2026_MIN_SIZES } from '@/lib/verified/nec-2026-edition';
import { formatDate } from '@/lib/page-dates';

// /methodology (WSZ-004b): one section per verified source the live calculators cite (src/lib/methodology.ts lists
// them and the pages that cite each; check-structure 24 holds that list to the built pages), the wire size method,
// and the topics not covered yet. Copy written in the WSZ-004b session (WSZ-017 answer 11 gave it to chat; cloud
// sessions carry chat's role since D-21). Every number renders from src/lib/verified or an engine, inside an element
// whose data-src names it; publisher, link and retrieval month come from research/data-sources.csv through registry.ts.
const TITLE = 'Methodology: Sources and Formulas';
const DESCRIPTION =
  'The NEC tables, NIST wire tables and conversion factors behind the wiresizes.com calculators, with the edition of each, the formulas used and their limits.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: METHODOLOGY_ROUTE },
  openGraph: {
    type: 'website',
    siteName: 'WireSizes.com',
    title: TITLE,
    description: DESCRIPTION,
    url: `https://wiresizes.com${METHODOLOGY_ROUTE}`,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

const LINK = 'text-blue-600 underline underline-offset-2 hover:text-blue-800';
const H2 = 'text-2xl font-semibold text-gray-900 pt-4';
const H3 = 'text-lg font-semibold text-gray-900';
const LIST = 'list-disc pl-6 space-y-2';

const SECTION = new Map(METHODOLOGY_SECTIONS.map((s) => [s.domain, s]));
function section(domain: string): MethodologySection {
  const found = SECTION.get(domain);
  if (!found) throw new Error(`METHODOLOGY_SECTIONS has no section for ${domain}`);
  return found;
}

// Values the copy states, all read from the data modules and engines (none typed here)
const minus = (n: number) => formatValue(n).replace('-', '−');
const N_0000 = (awgRow('4/0') as NonNullable<ReturnType<typeof awgRow>>).n;
/** The gauge number of the definition's smaller end (36): 0000 plus the definition's steps. */
const N_SMALL_END = N_0000 + AWG_DEFINITION.steps;
const OUGHT_SIZES = ['4/0', '3/0', '2/0', '1/0'].map((key) => ({ key, n: (awgRow(key) as NonNullable<ReturnType<typeof awgRow>>).n }));
const SMALLEST_AWG = '40';
const FIRST_KCMIL = '250';
const SIZING_COLUMN_C = terminationColumn(RATING_MIN_A, 'unknown', 'cable');
const LARGEST_SIZE = TABLE_310_16_SIZES[TABLE_310_16_SIZES.length - 1];
const SMALLEST_SIZE = TABLE_310_16_SIZES[0];
const SMALLEST_ALUMINUM = (TABLE_310_16_ROWS.find((row) => row.al_60 !== null) as (typeof TABLE_310_16_ROWS)[number]).size;
const LIMIT_ROWS = ROWS_240_4_D.filter((row) => row.conditions === null);
const COPPER_LIMITS = LIMIT_ROWS.filter((row) => row.material === 'Cu');
const ALUMINUM_LIMITS = LIMIT_ROWS.filter((row) => row.material === 'Al');
const CONDITIONAL_ROWS = ROWS_240_4_D.filter((row) => row.conditions !== null);
const RATINGS = ocpdRatings();
const FIRST_ADJUSTMENT = ADJUSTMENT_ROWS[0];
const LAST_ADJUSTMENT = ADJUSTMENT_ROWS[ADJUSTMENT_ROWS.length - 1];
const EGC_FIRST = TABLE_250_122_ROWS[0];
const EGC_LAST = TABLE_250_122_ROWS[TABLE_250_122_ROWS.length - 1];
const SERVICE_FIRST = TABLE_310_12_ROWS[0];
const SERVICE_LAST = TABLE_310_12_ROWS[TABLE_310_12_ROWS.length - 1];
const DC_TEMPS = DC_TEMPERATURE_OPTIONS.map((option) => option.value);
// The IEC 60228 sizes the registry row covers, from its coverage text ("0.5–1600 mm² Class 1 series")
const IEC_RANGE = /([\d.]+)–([\d.]+) mm²/.exec(coverage('iec-60228-metric-sizes'));
if (!IEC_RANGE) throw new Error('data-sources.csv iec-60228-metric-sizes coverage: no "N–N mm²" range');
const IEC_SMALLEST = <Val v={Number(IEC_RANGE[1])} unit="mm²" src="iec-60228-metric-sizes" />;
const IEC_LARGEST = <Val v={Number(IEC_RANGE[2])} unit="mm²" src="iec-60228-metric-sizes" />;

const materialLabel = (material: string) => (material === 'Cu' ? 'copper' : 'aluminum or copper-clad aluminum');

/** "a, b and c" (or "a, b or c") from parts. */
function series(parts: ReactNode[], conjunction: 'and' | 'or' = 'and'): ReactNode {
  return parts.map((part, i) => (
    <span key={i}>
      {i === 0 ? '' : i === parts.length - 1 ? ` ${conjunction} ` : ', '}
      {part}
    </span>
  ));
}

/** "14, 12 or 10 AWG" from AWG size keys (never kcmil). */
function gauges(rows: { size: string }[]): string {
  const keys = rows.map((row) => row.size);
  if (keys.some((key) => kcmilRow(key) !== null || awgRow(key) === null)) throw new Error(`not AWG sizes: ${keys.join(', ')}`);
  return keys.length === 1 ? `${keys[0]} AWG` : `${keys.slice(0, -1).join(', ')} or ${keys[keys.length - 1]} AWG`;
}

const FORMULA_BOX = 'rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900';
// Symbols in the site's formula face (mono, as the guides set formulas); a formula written in words stays in the text face
const MONO = 'font-mono text-sm sm:text-base';

/** One formula. */
function Formula({ src, words = false, children }: { src: string; words?: boolean; children: ReactNode }) {
  return (
    <p data-src={src} className={clsx(FORMULA_BOX, words ? 'text-base font-medium' : MONO)}>
      {children}
    </p>
  );
}

/** Several formulas, each with a label in the text face. */
function Formulas({ src, rows }: { src: string; rows: [string, ReactNode][] }) {
  return (
    <dl data-src={src} className={clsx(FORMULA_BOX, 'grid gap-x-6 gap-y-1 text-base sm:grid-cols-[auto_1fr]')}>
      {rows.map(([label, formula]) => (
        <Fragment key={label}>
          <dt className="text-gray-700">{label}</dt>
          <dd className={clsx(MONO, 'mb-2 last:mb-0 sm:mb-0')}>{formula}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

/** The source's link, publisher, retrieval month and the pages that list it under Sources. */
function SourceFacts({ s }: { s: MethodologySection }) {
  const { text, publisher, url, verified_date } = attribution(s.domain);
  const { short } = attributionParts(text);
  return (
    <dl className="grid gap-x-4 gap-y-1 text-base sm:grid-cols-[7rem_1fr]">
      <dt className="font-semibold text-gray-900">Source</dt>
      <dd>
        <a href={url} className={LINK}>
          {short}
        </a>
      </dd>
      <dt className="font-semibold text-gray-900">Publisher</dt>
      <dd>{publisher}</dd>
      <dt className="font-semibold text-gray-900">Retrieved</dt>
      <dd>
        <time dateTime={verified_date}>{monthOf(verified_date)}</time>
      </dd>
      <dt className="font-semibold text-gray-900">Cited on</dt>
      <dd data-cited-on="">
        {s.citedOn.map((route, i) => (
          <span key={route}>
            {i > 0 && ', '}
            <Link href={route} data-name="" className={LINK}>
              {CITED_PAGE_NAMES[route]}
            </Link>
          </span>
        ))}
      </dd>
    </dl>
  );
}

function SourceSection({ domain, children }: { domain: string; children: ReactNode }) {
  const s = section(domain);
  return (
    <section id={s.id} data-src={s.domain} aria-labelledby={`${s.id}-title`} className="scroll-mt-20 space-y-4">
      <h2 id={`${s.id}-title`} className={H2}>
        {s.title}
      </h2>
      {children}
    </section>
  );
}

function Limits({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className={H3}>Limits</h3>
      <ul className={LIST}>{children}</ul>
    </>
  );
}

function SectionLink({ domain, children }: { domain: string; children: ReactNode }) {
  return (
    <a href={`#${section(domain).id}`} className={LINK}>
      {children}
    </a>
  );
}

const TOC = [
  METHODOLOGY_EXTRA_SECTIONS.method,
  ...METHODOLOGY_SECTIONS.map(({ id, title }) => ({ id, title })),
  METHODOLOGY_EXTRA_SECTIONS.notCovered,
  METHODOLOGY_EXTRA_SECTIONS.errors,
];

export default function MethodologyPage() {
  const { method, notCovered, errors } = METHODOLOGY_EXTRA_SECTIONS;
  return (
    <div className="container py-12">
      <article className="max-w-3xl space-y-6 text-lg text-gray-700 leading-relaxed">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Methodology: sources and formulas</h1>
          <Byline route={METHODOLOGY_ROUTE} />
        </header>

        <p>
          The calculators on wiresizes.com work from the published tables and definitions on this page. Each source
          has a section below: what it is and which edition was used, where it was read, how the calculators use it,
          and where that use stops. The first section shows how the wire size calculator puts several of them
          together. Every calculator page, the AWG wire size chart, the NEC Table 310.16 page and the homepage also list
          their sources under Sources, near the bottom of the page.
        </p>
        <p>
          Code values are from NFPA 70, the National Electrical Code (NEC), 2023 edition, unless a section says
          otherwise. They were read from documents NFPA publishes openly, such as its records of revisions to the
          code, and from reprints made with NFPA&apos;s permission; each section names its document. States and cities
          adopt NEC editions on their own schedules, and some amend them, so check which edition applies where the
          work is done.
        </p>

        <nav aria-label="On this page" className="text-base">
          <p className="font-semibold text-gray-900">On this page</p>
          <ul className="mt-2 grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {TOC.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={LINK}>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section id={method.id} data-src="calc:conductor-sizing" aria-labelledby={`${method.id}-title`} className="scroll-mt-20 space-y-4">
          <h2 id={`${method.id}-title`} className={H2}>
            {method.title}
          </h2>
          <p>
            The{' '}
            <Link href="/calculators/wire-size-calculator" className={LINK}>
              wire size calculator
            </Link>{' '}
            starts from the breaker or fuse rating, the circuit and the length you enter, and works in six steps, once
            for copper and once for aluminum:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Take the smallest size whose ampacity in the <Val v={SIZING_COLUMN_C} unit="°C" src="nec-310-16" /> column
              of NEC Table 310.16 is at least the rating (see <SectionLink domain="nec-310-16">Ampacity</SectionLink>).
            </li>
            <li>
              If that size is {gauges(COPPER_LIMITS)} copper, or {gauges(ALUMINUM_LIMITS)} aluminum, move up while the
              rating is above the size&apos;s 240.4(D) limit (see{' '}
              <SectionLink domain="nec-240-4-d">Small-conductor limits</SectionLink>).
            </li>
            <li>
              Take the ground wire for the rating from NEC Table 250.122 (see{' '}
              <SectionLink domain="nec-250-grounding">Ground wires</SectionLink>).
            </li>
            <li>
              Work out the voltage drop at the load current over the one-way length, with conductor resistance at{' '}
              <Val v={RESISTANCE_TEMP_C} unit="°C" src="calc:voltage-drop" />. With no load entered, the rating is the
              load (see <SectionLink domain="conductor-resistance-20c">Conductor resistance</SectionLink>).
            </li>
            <li>
              If the drop is above your target, try each larger size in Table 310.16 until it is not, up to{' '}
              <Size s={LARGEST_SIZE} />.
            </li>
            <li>
              If step 5 chose a larger size, enlarge the ground wire in proportion to the conductor area, as 250.122(B)
              requires.
            </li>
          </ol>
          <p>
            It assumes an ambient temperature of <Val v={TABLE_AMBIENT.c} unit="°C" src="nec-310-16" /> (
            <Val v={TABLE_AMBIENT.f} unit="°F" src="nec-310-16" />) and no more than three current-carrying conductors
            together; the{' '}
            <Link href="/calculators/ampacity-calculator" className={LINK}>
              ampacity calculator
            </Link>{' '}
            handles other conditions. It does not choose the breaker or fuse rating for a load: it starts from the
            rating you enter.
          </p>
        </section>

        <SourceSection domain="awg-geometry">
          <p>
            NIST&apos;s Copper Wire Tables (Handbook 100, published in 1966 by the National Bureau of Standards, now
            NIST) list every American Wire Gauge size from <Size s="4/0" /> to <Size s={SMALLEST_AWG} /> with its
            diameter, cross-sectional area, resistance and weight, for solid annealed copper at{' '}
            <Val v={REFERENCE_TEMP_C} unit="°C" src="awg-geometry" />. The site takes AWG diameters and areas from its
            Table 5.
          </p>
          <SourceFacts s={section('awg-geometry')} />
          <p>
            The gauge numbers follow one geometric rule. Gauge {N_SMALL_END} is{' '}
            <Val v={AWG_DEFINITION.d_36_in} unit="in" src="awg-geometry" /> across, <Size s="4/0" /> (written 0000) is{' '}
            <Val v={AWG_DEFINITION.d_0000_in} unit="in" src="awg-geometry" />, and there are {AWG_DEFINITION.steps}{' '}
            equal steps between them, so each step changes the diameter by the same factor, about{' '}
            {formatValue(AWG_DEFINITION.ratio, { fixed: 4 })}. With n the gauge number, counting{' '}
            {series(OUGHT_SIZES.map(({ key, n }) => (
              <span key={key}>
                <Size s={key} /> as {minus(n)}
              </span>
            )))}
            , the diameter is:
          </p>
          <Formula src="awg-geometry">
            d(n) = <Val v={AWG_DEFINITION.d_36_in} unit="in" src="awg-geometry" /> ×{' '}
            {formatValue(AWG_DEFINITION.d_0000_in / AWG_DEFINITION.d_36_in, { upTo: 4 })}
            <span className="sr-only"> to the power </span>
            <sup>
              ({N_SMALL_END} − n)/{AWG_DEFINITION.steps}
            </sup>
          </Formula>
          <p>
            A mil is a thousandth of an inch, and the area in circular mils (cmil) is the diameter in mils, squared.
            Sizes above <Size s="4/0" /> are named by their area in thousands of circular mils: <Size s={FIRST_KCMIL} />{' '}
            is <Val v={(kcmilRow(FIRST_KCMIL) as NonNullable<ReturnType<typeof kcmilRow>>).area_cmil} unit="cmil" src="awg-geometry" />.
          </p>
          <Limits>
            <li>The values are for solid round wire.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="conductor-resistance-20c">
          <p>
            Copper resistance at <Val v={REFERENCE_TEMP_C} unit="°C" src="conductor-resistance-20c" /> comes from the
            same Handbook 100 table, which is based on a resistivity of{' '}
            <Val v={AWG_CONSTANTS.copper_resistivity_ohm_cmil_per_ft_20C} unit="Ω" src="conductor-resistance-20c" />
            ·cmil/ft and a temperature coefficient of {formatValue(COPPER_ALPHA)} per °C. For aluminum, NIST&apos;s
            Aluminum Wire Tables (Handbook 109) give the constants of EC-H19 aluminum: a conductivity of{' '}
            <Val v={AWG_CONSTANTS.aluminum_ECH19_pct_IACS} unit="%" format={{ fixed: 1 }} src="conductor-resistance-20c" /> of
            the International Annealed Copper Standard (IACS), a resistivity of{' '}
            <Val v={AWG_CONSTANTS.aluminum_ECH19_resistivity_ohm_cmil_per_ft_20C} unit="Ω" src="conductor-resistance-20c" />
            ·cmil/ft and a temperature coefficient of {formatValue(ALUMINUM_ALPHA)} per °C.
          </p>
          <SourceFacts s={section('conductor-resistance-20c')} />
          <p>
            Aluminum resistance, and the resistance of copper kcmil sizes, which Table 5 does not cover, are
            calculated from the resistivity ρ and the area A in circular mils:
          </p>
          <Formula src="conductor-resistance-20c">R per 1000 ft = ρ × 1000 ÷ A</Formula>
          <p>
            Resistance at another temperature T comes from the value at{' '}
            <Val v={REFERENCE_TEMP_C} unit="°C" src="conductor-resistance-20c" /> and the temperature coefficient α:
          </p>
          <Formula src="calc:resistance">
            R(T) = R(<Val v={REFERENCE_TEMP_C} unit="°C" src="calc:resistance" />) × (1 + α × (T −{' '}
            <Val v={REFERENCE_TEMP_C} unit="°C" src="calc:resistance" />))
          </Formula>
          <p>
            The{' '}
            <Link href="/calculators/voltage-drop-calculator" className={LINK}>
              voltage drop calculator
            </Link>{' '}
            and the voltage-drop step of the wire size calculator use resistance at{' '}
            <Val v={RESISTANCE_TEMP_C} unit="°C" src="calc:voltage-drop" />. With I the current, R the resistance per
            1000 ft, L the one-way length in feet, V the supply voltage, and k = 2 on a single-phase circuit or √3 on a
            three-phase circuit:
          </p>
          <Formulas
            src="calc:voltage-drop"
            rows={[
              ['Voltage drop', 'VD = k × I × R × L ÷ 1000'],
              ['Percent drop', '100 × VD ÷ V'],
            ]}
          />
          <p>The power lost in the conductors, in watts:</p>
          <Formulas
            src="calc:resistance"
            rows={[
              ['DC or single-phase', '2 × I² × R × L ÷ 1000'],
              ['Three-phase', '3 × I² × R × L ÷ 1000'],
            ]}
          />
          <p>
            The{' '}
            <Link href="/calculators/wire-resistance-calculator" className={LINK}>
              wire resistance calculator
            </Link>{' '}
            uses the temperature you enter. The{' '}
            <Link href="/calculators/low-voltage-calculator" className={LINK}>
              low voltage calculator
            </Link>{' '}
            lets you choose <Val v={DC_TEMPS[0]} unit="°C" src="calc:dc-sizing" /> or{' '}
            <Val v={DC_TEMPS[DC_TEMPS.length - 1]} unit="°C" src="calc:dc-sizing" /> and finds the copper area a DC
            circuit needs for your voltage-drop target, with the current I = watts ÷ volts and the allowed drop VD in
            volts:
          </p>
          <Formulas
            src="calc:dc-sizing"
            rows={[
              ['Area needed, in cmil', 'CM = 2 × K × I × L ÷ VD'],
              [
                'Copper resistivity at T',
                <>
                  K = <Val v={AWG_CONSTANTS.copper_resistivity_ohm_cmil_per_ft_20C} unit="Ω" src="calc:dc-sizing" />
                  ·cmil/ft × (1 + {formatValue(COPPER_ALPHA)} × (T −{' '}
                  <Val v={REFERENCE_TEMP_C} unit="°C" src="calc:dc-sizing" />))
                </>,
              ],
            ]}
          />
          <p>
            It then takes the smallest Table 310.16 size with at least that area, or the size the current needs in the{' '}
            <Val v={SIZING_COLUMN_C} unit="°C" src="nec-310-16" /> column, whichever is larger.
          </p>
          <Limits>
            <li>Solid conductors: stranded conductors of the same size measure slightly higher.</li>
            <li>DC resistance only: the reactance of AC circuits is not included.</li>
            <li>
              Aluminum values are calculated from the Handbook 109 constants, because the handbook&apos;s rows for
              each size could not be read in the scanned copy. Aluminum starts at <Size s={SMALLEST_ALUMINUM} />, the
              smallest aluminum size in NEC Table 310.16.
            </li>
            <li>These are calculated values, not the conductor tables in Chapter 9 of the NEC.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nec-310-16">
          <p>
            Table 310.16 of the NEC (2023) gives the allowable ampacity of insulated conductors from{' '}
            <Size s={SMALLEST_SIZE} /> to <Size s={LARGEST_SIZE} /> in three temperature columns,{' '}
            {series(AMPACITY_COLUMNS.map((c) => <Val key={c} v={c} unit="°C" src="nec-310-16" />))}, for copper and for
            aluminum or copper-clad aluminum. Its values assume not more than three current-carrying conductors in a
            raceway, cable or earth, at <Val v={TABLE_AMBIENT.c} unit="°C" src="nec-310-16" /> (
            <Val v={TABLE_AMBIENT.f} unit="°F" src="nec-310-16" />).
          </p>
          <SourceFacts s={section('nec-310-16')} />
          <p>
            The 2023 values were read from NFPA&apos;s reprint of the table in the public comment document for a
            proposed amendment, TIA 1691, in February 2023. The amendment failed, so the printed table stands.
            NFPA&apos;s drafts of the 2026 edition show the same values from <Size s="12" /> to{' '}
            <Size s={LARGEST_SIZE} />.
          </p>
          <p>
            The wire size calculator uses the <Val v={SIZING_COLUMN_C} unit="°C" src="nec-310-16" /> column. The
            ampacity calculator shows the column you choose. The voltage drop calculator notes when the current is
            above the size&apos;s <Val v={SIZING_COLUMN_C} unit="°C" src="nec-310-16" /> ampacity, and the low voltage
            calculator never picks a size whose <Val v={SIZING_COLUMN_C} unit="°C" src="nec-310-16" /> copper ampacity
            is below the current.
          </p>
          <Limits>
            <li>
              Other temperatures and more conductors need the corrections in{' '}
              <SectionLink domain="nec-310-15-corrections">Ambient temperature and bundling</SectionLink>.
            </li>
            <li>
              The final 2026 table has not been read. NFPA&apos;s 2026 drafts change only the rows for sizes smaller
              than <Size s="12" />.
            </li>
            <li>
              The wire size calculator does not size from the higher columns: see{' '}
              <a href={`#${notCovered.id}`} className={LINK}>
                {notCovered.title}
              </a>
              .
            </li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nec-310-15-corrections">
          <p>
            Two NEC tables (2023) adjust Table 310.16 for conditions it does not assume. Table 310.15(B)(1)(1) gives
            correction factors by ambient temperature, based on <Val v={TABLE_AMBIENT.c} unit="°C" src="nec-310-15-corrections" /> (
            <Val v={TABLE_AMBIENT.f} unit="°F" src="nec-310-15-corrections" />), for each temperature column. Table
            310.15(C)(1) gives adjustment percentages for more than three current-carrying conductors in a raceway or
            cable, from <Val v={FIRST_ADJUSTMENT.percent} unit="%" src="nec-310-15-corrections" /> for{' '}
            {FIRST_ADJUSTMENT.key} conductors down to{' '}
            <Val v={LAST_ADJUSTMENT.percent} unit="%" src="nec-310-15-corrections" /> for {LAST_ADJUSTMENT.key}.
          </p>
          <SourceFacts s={section('nec-310-15-corrections')} />
          <p>
            The 2023 values were read from NFPA&apos;s First Draft of the 2026 edition, which prints the 2023 tables as
            its base text; no revision in that draft changed them. The ampacity calculator applies both:
          </p>
          <Formula src="calc:ampacity" words>
            corrected ampacity = Table 310.16 value × correction factor × adjustment percent ÷ 100
          </Formula>
          <p>
            The wire size calculator assumes <Val v={TABLE_AMBIENT.c} unit="°C" src="nec-310-15-corrections" /> and no
            more than three current-carrying conductors.
          </p>
          <Limits>
            <li>
              Where the table has no factor for an ambient temperature, that insulation rating is not permitted there,
              and the calculator says so.
            </li>
            <li>
              You enter the number of current-carrying conductors. The rules for whether neutral and ground wires
              count are not covered yet.
            </li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nec-240-4-d">
          <p>
            Section 240.4(D) of the NEC (2023) sets the largest breaker or fuse allowed on small conductors, whatever
            their ampacity:{' '}
            {series(COPPER_LIMITS.map((row) => (
              <span key={row.size}>
                <Val v={row.max_ocpd_a} unit="A" src="nec-240-4-d" /> for <Size s={row.size} />
              </span>
            )))}{' '}
            {materialLabel('Cu')};{' '}
            {series(ALUMINUM_LIMITS.map((row) => (
              <span key={row.size}>
                <Val v={row.max_ocpd_a} unit="A" src="nec-240-ocpd" /> for <Size s={row.size} />
              </span>
            )))}{' '}
            {materialLabel('Al')}.
          </p>
          <SourceFacts s={section('nec-240-4-d')} />
          <p>
            The limits were read from NFPA&apos;s records of revisions for the 2023 and 2026 editions (SR-8285 and
            SR-8377) and from the 2023 text as Leviton reprinted it with NFPA&apos;s permission. The wire size calculator
            moves up a size whenever the rating is above the limit, and the ampacity calculator shows the limit beside
            its result.
          </p>
          <Limits>
            <li>
              The rows that come with conditions, for{' '}
              {series(CONDITIONAL_ROWS.map((row) => (
                <span key={`${row.size} ${row.material}`}>
                  <Size s={row.size} /> {row.material === 'CCA' ? 'copper-clad aluminum' : 'copper'}
                </span>
              )))}
              , are not used: no calculator recommends a conductor smaller than <Size s="14" /> copper or{' '}
              <Size s={SMALLEST_ALUMINUM} /> aluminum.
            </li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nec-240-ocpd">
          <p>
            Table 240.6(A) of the NEC (2023) lists the standard ampere ratings of fuses and inverse time circuit
            breakers, from <Val v={RATINGS[0]} unit="A" src="nec-240-ocpd" /> to{' '}
            <Val v={RATINGS[RATINGS.length - 1]} unit="A" src="nec-240-ocpd" />. The values come from Eaton&apos;s
            reprint of the 2023 table, made with NFPA&apos;s permission.
          </p>
          <SourceFacts s={section('nec-240-ocpd')} />
          <p>
            The wire size calculator offers the standard ratings from <Val v={RATING_MIN_A} unit="A" src="nec-240-ocpd" /> to{' '}
            <Val v={RATING_MAX_A} unit="A" src="nec-240-ocpd" />, and the{' '}
            <Link href="/calculators/ground-wire-calculator" className={LINK}>
              ground wire calculator
            </Link>{' '}
            those from <Val v={GROUND_WIRE_RATINGS[0]} unit="A" src="nec-240-ocpd" /> to{' '}
            <Val v={GROUND_WIRE_RATINGS[GROUND_WIRE_RATINGS.length - 1]} unit="A" src="nec-240-ocpd" />.
          </p>
          <Limits>
            <li>The extra fuse-only ratings named in the text of 240.6(A) are not offered.</li>
            <li>
              The calculators pick a conductor whose ampacity is at least the rating, so they never rely on the
              next-size-up allowance of 240.4(B).
            </li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nec-250-grounding">
          <p>
            NFPA&apos;s 2020 grounding fact sheet, Using the Tables in Article 250 of the NEC, prints two tables the
            calculators use. Table 250.122 sizes the equipment grounding conductor (the ground wire) by the rating of
            the breaker or fuse ahead of the circuit, from <Val v={EGC_FIRST.rowA} unit="A" src="nec-250-grounding" /> to{' '}
            <Val v={EGC_LAST.rowA} unit="A" src="nec-250-grounding" />. Table 250.66 sizes the grounding electrode
            conductor by the largest service-entrance conductor.
          </p>
          <SourceFacts s={section('nec-250-grounding')} />
          <p>
            Table 250.122 is the same in the fact sheet and in NFPA&apos;s record of revisions for the 2026 edition
            (SR-8360), which made no technical change to it. Table 250.66 comes from the fact sheet only; no 2023 or
            2026 printing of it has been read.
          </p>
          <p>
            The ground wire calculator and the wire size calculator take the ground wire from the first row of Table
            250.122 whose rating is at least the breaker or fuse rating, in the copper column or the aluminum and
            copper-clad aluminum column. The{' '}
            <Link href="/calculators/service-entrance-calculator" className={LINK}>
              service entrance calculator
            </Link>{' '}
            takes the grounding electrode conductor from Table 250.66 for the service conductors it finds. When the
            wire size calculator chooses larger conductors for voltage drop, it enlarges the ground wire in proportion,
            as 250.122(B) requires, rounds up to a Table 310.16 size and never goes below the table&apos;s ground
            wire:
          </p>
          <Formula src="calc:conductor-sizing" words>
            ground wire area = Table 250.122 area × installed conductor area ÷ minimum conductor area
          </Formula>
          <Limits>
            <li>
              The ground wire is never reduced to the size of the circuit conductors. The sentence that allows that has
              been found only in the 2026 draft, not in the 2023 text, so for some ratings the calculators show a
              ground wire larger than the smallest conductor the rating allows, with a note.
            </li>
            <li>
              Limits on grounding electrode conductors to ground rods and concrete-encased electrodes are not covered
              yet.
            </li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nec-310-12">
          <p>
            Table 310.12 of the NEC (2023) lists conductor sizes for 120/240 V single-phase dwelling services and main
            power feeders from <Val v={SERVICE_FIRST.ratingA} unit="A" src="nec-310-12" /> to{' '}
            <Val v={SERVICE_LAST.ratingA} unit="A" src="nec-310-12" />, in copper and in aluminum or copper-clad
            aluminum. It applies the rule that these conductors may have an ampacity as low as{' '}
            <Val v={SERVICE_AMPACITY_PERCENT} unit="%" src="nec-310-12" /> of the service rating.
          </p>
          <SourceFacts s={section('nec-310-12')} />
          <p>
            The 2023 values were read from NFPA&apos;s First Draft of the 2026 edition, which carries the 2023 table as
            its base text; the revisions in that draft changed only its wording. The service entrance calculator looks
            up the row for the rating you choose and never interpolates between rows.
          </p>
          <Limits>
            <li>
              Only for the service or main power feeder of one dwelling unit at 120/240 V single-phase. Other services
              and feeders are sized from Table 310.16.
            </li>
            <li>The corrections for ambient temperature and bundling still apply.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="power-definitions">
          <p>
            The power formulas follow U.S. government definitions: real, reactive and apparent power and power factor
            from the U.S. Energy Information Administration&apos;s glossary, the balanced three-phase power formula
            from U.S. Department of Energy Motor Challenge fact sheets, and the watt and the ohm from NIST Special
            Publication 330, The International System of Units.
          </p>
          <SourceFacts s={section('power-definitions')} />
          <p>
            With P the real power in watts, S the apparent power in volt-amperes, Q the reactive power, V the voltage
            (line to line on three-phase) and PF the power factor, the calculators use:
          </p>
          <Formulas
            src="calc:power"
            rows={[
              ['Current, single-phase AC', 'I = P ÷ (V × PF)'],
              ['Current, three-phase AC', 'I = P ÷ (√3 × V × PF)'],
              ['Current, DC', 'I = P ÷ V'],
              ['Current from S, single-phase', 'I = S ÷ V'],
              ['Current from S, three-phase', 'I = S ÷ (√3 × V)'],
              ['Apparent power', 'S = P ÷ PF'],
              ['Reactive power', 'Q = √(S² − P²)'],
            ]}
          />
          <p>
            The{' '}
            <Link href="/calculators/ohms-law-calculator" className={LINK}>
              Ohm&apos;s law calculator
            </Link>{' '}
            works out the other values from any two you enter:
          </p>
          <Formulas
            src="calc:ohms-law"
            rows={[
              ["Ohm's law", 'V = I × R'],
              ['Power', 'P = V × I = I² × R = V² ÷ R'],
            ]}
          />
          <Limits>
            <li>The three-phase formulas assume a balanced load.</li>
            <li>The calculators use the power factor you enter; DC circuits use 1.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nist-sp811-conversions">
          <p>
            NIST Special Publication 811 (2008), the Guide for the Use of the International System of Units, lists
            the conversion factors in its Appendix B.8.
          </p>
          <SourceFacts s={section('nist-sp811-conversions')} />
          <p>The calculators use these:</p>
          <Formulas
            src="nist-sp811-conversions"
            rows={[
              ['Btu per hour', <>1 Btu/h = <Val v={W_PER_BTU_PER_H} unit="W" src="nist-sp811-conversions" /></>],
              ['Ton of refrigeration', <>1 ton = <Val v={BTU_PER_H_PER_TON} unit="Btu/h" src="nist-sp811-conversions" /></>],
              ['Electric horsepower', <>1 hp = <Val v={W_PER_ELECTRICAL_HP} unit="W" src="nist-sp811-conversions" /></>],
            ]}
          />
          <p>
            The{' '}
            <Link href="/calculators/btu-to-watts-calculator" className={LINK}>
              BTU to watts calculator
            </Link>{' '}
            converts both ways and gives the load in tons, and the{' '}
            <Link href="/calculators/amps-to-watts-calculator" className={LINK}>
              amps to watts calculator
            </Link>{' '}
            gives its result in horsepower too.
          </p>
          <Limits>
            <li>The Btu is the International Table Btu, the one SP 811 lists for Btu per hour.</li>
            <li>A ton is a ton of refrigeration, a rate of heat removal, not a weight.</li>
            <li>
              Horsepower is electric horsepower. Mechanical horsepower,{' '}
              <Val v={W_PER_MECHANICAL_HP} unit="W" src="nist-sp811-conversions" />, is not used.
            </li>
          </Limits>
        </SourceSection>

        <SourceSection domain="iec-60228-metric-sizes">
          <p>
            IEC 60228 is the international standard for the nominal cross-sections of cable conductors, in square
            millimeters. The site uses only its list of nominal sizes, to show beside each AWG size the metric size
            nearest to it and the next one up.
          </p>
          <SourceFacts s={section('iec-60228-metric-sizes')} />
          <p>
            The nearest size compares the AWG area in mm² from NIST&apos;s table with the IEC series; the{' '}
            <Link href="/guides/awg-wire-size-chart#metric" className={LINK}>
              AWG wire size chart
            </Link>{' '}
            lists both for each size.
          </p>
          <Limits>
            <li>
              Only the sizes from {IEC_SMALLEST} to {IEC_LARGEST} were read, so AWG sizes with less area than {IEC_SMALLEST} get
              no IEC size.
            </li>
            <li>The comparison is by area alone; nothing else in the standard is used.</li>
            <li>Whether a metric cable may replace an AWG one is a question for the local code, not this list.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nec-2026-edition">
          <p>
            NFPA issued the 2026 edition of the NEC on{' '}
            <time dateTime={NEC_2026_ISSUED}>{formatDate(NEC_2026_ISSUED)}</time>, effective{' '}
            <time dateTime={NEC_2026_EFFECTIVE}>{formatDate(NEC_2026_EFFECTIVE)}</time>. The site&apos;s calculators and tables
            stay on the 2023 edition; the 2026 facts it states come from NFPA&apos;s issue record and from state reviews of the
            final edition.
          </p>
          <SourceFacts s={section('nec-2026-edition')} />
          <p>
            The{' '}
            <Link href="/guides/nec-table-310-16#nec-2026" className={LINK}>
              NEC Table 310.16 page
            </Link>{' '}
            uses it for the edition&apos;s dates and the new minimum sizes: <Size s={NEC_2026_MIN_SIZES.Cu} /> copper,{' '}
            <Size s={NEC_2026_MIN_SIZES.CCA} /> copper-clad aluminum and <Size s={NEC_2026_MIN_SIZES.Al} /> aluminum, in a
            section renumbered to 310.5.
          </p>
          <Limits>
            <li>Changes seen only in NFPA&apos;s revision drafts are labeled as drafts and never shown as final.</li>
            <li>The final 2026 Table 310.16 has not been seen, so no 2026 ampacity is shown.</li>
          </Limits>
        </SourceSection>

        <section id={notCovered.id} aria-labelledby={`${notCovered.id}-title`} className="scroll-mt-20 space-y-4">
          <h2 id={`${notCovered.id}-title`} className={H2}>
            {notCovered.title}
          </h2>
          <p>
            No calculator on the site covers the topics below. Their 2023 NEC text, or the maker&apos;s current
            tables, has not yet been checked in full against a document that can be cited:
          </p>
          <ul className={LIST}>
            <li>
              Sizing from the <Val v={AMPACITY_COLUMNS[1]} unit="°C" src="nec-310-16" /> column of Table 310.16, and
              the termination temperature rules that decide when it may be used. The wire size calculator uses the{' '}
              <Val v={SIZING_COLUMN_C} unit="°C" src="nec-310-16" /> column for every rating.
            </li>
            <li>Ampacity rules for NM and UF cable, and whether neutral and ground wires count as current-carrying.</li>
            <li>Stranded conductor dimensions, and the AC resistance and reactance of conductors.</li>
            <li>Conduit fill: how many conductors fit in a conduit, with conduit and wire areas.</li>
            <li>Box fill: how many conductors and devices fit in a box.</li>
            <li>Feeders to a detached garage or another separate building.</li>
            <li>
              Grounding electrode conductors to ground rods and concrete-encased electrodes, and how electrodes are
              installed.
            </li>
            <li>Working space around electrical equipment and clearances for service conductors.</li>
            <li>Motor circuits: conductor size, overload protection and the breaker or fuse.</li>
            <li>Air conditioner and heat pump circuits.</li>
            <li>Pool pump, spa and hot tub circuits.</li>
            <li>Welder circuits.</li>
            <li>RV site and RV park loads.</li>
            <li>Submersible well pump cable lengths from the pump maker&apos;s current tables.</li>
          </ul>
        </section>

        <section id={errors.id} aria-labelledby={`${errors.id}-title`} className="scroll-mt-20 space-y-4">
          <h2 id={`${errors.id}-title`} className={H2}>
            {errors.title}
          </h2>
          <p>
            If a number on this site disagrees with its source, email contact@wiresizes.com. Fixes are dated in the
            corrections list on the{' '}
            <Link href="/about" className={LINK}>
              About page
            </Link>
            .
          </p>
          <p>
            NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the National Fire Protection
            Association. wiresizes.com is not affiliated with or endorsed by NFPA.
          </p>
        </section>
      </article>
      <BasicPageSchema path={METHODOLOGY_ROUTE} name={TITLE} description={DESCRIPTION} authored />
    </div>
  );
}
