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
import { BTU_PER_H_PER_TON, W_PER_BTU_PER_H, W_PER_ELECTRICAL_HP } from '@/lib/calculations/conversions';
import { voltageColumns } from '@/lib/calculations/motor-flc';
import { flcTable } from '@/lib/verified/nec-430-440-2023';
import { DC_TEMPERATURE_OPTIONS } from '@/lib/calculations/dc-sizing';
import { formatValue } from '@/lib/calculations/format';
import { GROUND_WIRE_RATINGS } from '@/lib/calculations/grounding';
import { ALUMINUM_ALPHA, COPPER_ALPHA, REFERENCE_TEMP_C } from '@/lib/calculations/resistance';
import { RESISTANCE_TEMP_C, VD_TOOL_DEFAULT_TEMP_C, VD_TOOL_SINGLE_QUICK_VOLTS } from '@/lib/calculations/voltage-drop';
import { SINGLE_PHASE_VOLTS, THREE_PHASE_VOLTS } from '@/lib/calculations/inputs';
import { TP_WYE_SYSTEMS, isTpError, threePhase } from '@/lib/calculations/power';
import { DOE_MOTOR, DOE_PF } from '@/lib/verified/power-examples';
import { CONTINUOUS_LOAD_PERCENT, VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { NOMINAL_SINGLE_PHASE, NOMINAL_THREE_PHASE, assertNominal } from '@/lib/verified/us-nominal-voltages';
import { CITED_PAGE_NAMES, METHODOLOGY_EXTRA_SECTIONS, METHODOLOGY_ROUTE, METHODOLOGY_SECTIONS } from '@/lib/methodology';
import type { MethodologySection } from '@/lib/methodology';
import { AWG_CONSTANTS, AWG_DEFINITION, awgRow, kcmilRow } from '@/lib/verified/awg';
import { NEXT_SIZE_UP_MAX_A, ROWS_240_4_D } from '@/lib/verified/nec-240-4-d';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { ocpdRatings } from '@/lib/verified/nec-240-6-a';
import { TABLE_250_122_ROWS } from '@/lib/verified/nec-250-122';
import { ADJUSTMENT_ROWS } from '@/lib/verified/nec-310-15-C-1';
import { SERVICE_AMPACITY_PERCENT, TABLE_310_12_ROWS } from '@/lib/verified/nec-310-12';
import { OPTIONAL_METHOD, STANDARD_METHOD, TABLE_220_55, cookingRow } from '@/lib/verified/nec-220-2023';
import type { CookingRow } from '@/lib/verified/nec-220-2023';
import { DWELLING_VOLTS } from '@/lib/calculations/load-calc-2023';
import { RANGE_CIRCUITS, RANGE_VOLTS } from '@/lib/calculations/range-circuit';
import { FRIGIDAIRE_RANGE, GE_DBLR333EE, GE_DRYER, WHIRLPOOL_DRYER, WHIRLPOOL_RANGE } from '@/lib/verified/mfr-equipment';
import { DRYER_CIRCUITS } from '@/lib/calculations/dryer-circuit';
import { NEMA_CONFIGS } from '@/lib/verified/nema-receptacle-configs';
import { AMPACITY_COLUMNS, TABLE_310_16_ROWS, TABLE_310_16_SIZES, TABLE_AMBIENT } from '@/lib/verified/nec-310-16';
import { attribution, attributionParts, coverage, nextCheck } from '@/lib/verified/registry';
import { NEC_2026_DOMAIN, NEC_2026_EFFECTIVE, NEC_2026_ISSUANCE_DOMAIN, NEC_2026_ISSUED, NEC_2026_MIN_SIZES } from '@/lib/verified/nec-2026-edition';
import { formatDate } from '@/lib/page-dates';
import { ADOPTION_AS_OF, ADOPTION_TABLE_HREF, joinNames, NEC_ADOPTION_DOMAIN, NOT_VERIFIED, stateName } from '@/lib/verified/nec-adoption';
import { PageTitle } from '@/components/look/PageTitle';
import { LOOK_BYLINE, LOOK_BYLINE_LINK, LOOK_H2, LOOK_H3, LOOK_LINK, LOOK_PAGE } from '@/components/look/styles';

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

const LINK = LOOK_LINK;
const H2 = `${LOOK_H2} pt-6`;
const H3 = LOOK_H3;
const LIST = 'list-disc space-y-2 pl-6 marker:text-cut-line';

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
const MAX_COLUMN_C = Math.max(...AMPACITY_COLUMNS);
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
// Dwelling load calculations (WSZ-010a), all read from nec-220-2023.json
const LS = STANDARD_METHOD;
const LO = OPTIONAL_METHOD;
const LH = LO.heatingAc;
const [L_FIRST, L_SECOND, L_REST] = LS.lightingTiers;
const [G_FIRST, G_REST] = LO.generalTiers;
const L_COMBINED = LH.heatPumpWithSupplementalHeat.pct as { compressor: number; supplemental_heat: number };
const L_RANGE_KW = (cookingRow(1) as CookingRow).cBaseKw;
const lpct = (item: { pct: number | object }) => item.pct as number;
const LV = (v: number, unit: 'VA' | 'W' | 'kW' | '%') => <Val v={v} unit={unit} src="nec-220-load-calcs" />;
// The IEC 60228 sizes the registry row covers, from its coverage text ("0.5–1600 mm² Class 1 series")
const IEC_RANGE = /([\d.]+)–([\d.]+) mm²/.exec(coverage('iec-60228-metric-sizes'));
if (!IEC_RANGE) throw new Error('data-sources.csv iec-60228-metric-sizes coverage: no "N–N mm²" range');
const IEC_SMALLEST = <Val v={Number(IEC_RANGE[1])} unit="mm²" src="iec-60228-metric-sizes" />;
const IEC_LARGEST = <Val v={Number(IEC_RANGE[2])} unit="mm²" src="iec-60228-metric-sizes" />;

// The DOE fact sheets' examples (their registry rows' coverage), the correction worked by the engine
const DOE_PF_RUN = threePhase({ volts: 480, known: 'kw-kva', kw: DOE_PF.kw, kva: DOE_PF.kva, targetPf: DOE_PF.to });
if (isTpError(DOE_PF_RUN) || !DOE_PF_RUN.correction) throw new Error('methodology: the DOE power factor example has no result');
const DOE_PF_KVAR = DOE_PF_RUN.correction.capKvar;

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

// In the look (D-33): a formula sits between two ink rules, flat, with no box
const FORMULA_BOX = 'border-y border-ink py-3 text-ink';
// Symbols in the site's figure face (Azeret Mono, as the tables set figures); a formula written in words stays in the text face
const MONO = 'font-figures text-[14px] sm:text-[15px]';

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
          <dt className="text-cut-muted">{label}</dt>
          <dd className={clsx(MONO, 'mb-2 last:mb-0 sm:mb-0')}>{formula}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

/** The source's link, publisher, retrieval month and the pages that list it under Sources. `href` replaces the link of a
 *  source whose records are linked one per row on a page (nec-adoption: the editions page's state table). */
function SourceFacts({ s, href }: { s: MethodologySection; href?: string }) {
  const { text, publisher, url, verified_date } = attribution(s.domain);
  const { short } = attributionParts(text);
  return (
    <dl className="grid gap-x-4 gap-y-1 text-[15px] sm:grid-cols-[7rem_1fr]">
      <dt className="font-semibold text-ink">Source</dt>
      <dd>
        <a href={href ?? url} className={LINK}>
          {short}
        </a>
      </dd>
      <dt className="font-semibold text-ink">Publisher</dt>
      <dd>{publisher}</dd>
      <dt className="font-semibold text-ink">Retrieved</dt>
      <dd>
        <time dateTime={verified_date}>{monthOf(verified_date)}</time>
      </dd>
      <dt className="font-semibold text-ink">Cited on</dt>
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
    <section id={s.id} data-src={s.domain} aria-labelledby={`${s.id}-title`} className="scroll-mt-24 space-y-4">
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

assertNominal(THREE_PHASE_VOLTS, 'three-phase voltages (inputs.ts)');
assertNominal(VD_TOOL_SINGLE_QUICK_VOLTS, 'voltage drop calculator quick voltages');

const TOC = [
  METHODOLOGY_EXTRA_SECTIONS.method,
  METHODOLOGY_EXTRA_SECTIONS.breakerMethod,
  METHODOLOGY_EXTRA_SECTIONS.loadMethod,
  METHODOLOGY_EXTRA_SECTIONS.rangeMethod,
  METHODOLOGY_EXTRA_SECTIONS.dryerMethod,
  METHODOLOGY_EXTRA_SECTIONS.hpMethod,
  ...METHODOLOGY_SECTIONS.map(({ id, title }) => ({ id, title })),
  METHODOLOGY_EXTRA_SECTIONS.notCovered,
  METHODOLOGY_EXTRA_SECTIONS.errors,
];

// The horsepower to amps sections: the system voltages the motor tables' notes give each column, and the last Table
// 430.250 row the Eaton reprint covers
const HP_THREE_SYSTEMS = (() => {
  const columns = voltageColumns('3');
  const ranges = columns
    .filter((c) => c.min !== c.max)
    .map((c, k) => `${formatValue(c.min)}–${formatValue(c.max)} V ${k === 0 ? 'takes ' : ''}the ${formatValue(c.volts)} V column`);
  const own = columns.filter((c) => c.min === c.max).map((c) => `${formatValue(c.volts)} V`);
  return `${ranges.slice(0, -1).join(', ')} and ${ranges[ranges.length - 1]}; ${own.join(' and ')} have columns of their own`;
})();
const HP_EATON_LAST = (() => {
  const rows = flcTable('430.250').rows;
  const last = [...rows].reverse().find((r) => r.status === 'verified-2023');
  if (!last) throw new Error('methodology: no Table 430.250 row matched the Eaton reprint');
  return last.hp;
})();

export default function MethodologyPage() {
  const { method, breakerMethod, loadMethod, rangeMethod, dryerMethod, hpMethod, notCovered, errors } = METHODOLOGY_EXTRA_SECTIONS;
  return (
    <div className={LOOK_PAGE}>
    <div className="container pb-16">
      <header className="pt-10 sm:pt-12">
        <PageTitle main="Methodology" sub="sources and formulas" joiner=": " />
        <Byline route={METHODOLOGY_ROUTE} className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
      </header>
      <article className="mt-10 max-w-[35rem] space-y-6 text-[17px] leading-[1.65] text-ink">

        <p>
          The calculators on wiresizes.com work from the published tables and definitions on this page. Each source
          has a section below: what it is and which edition was used, where it was read, how the calculators use it,
          and where that use stops. The first six sections show how the wire size, circuit breaker, residential load,
          range, dryer and horsepower to amps calculators put several of them together. Every calculator page, the AWG wire size chart, the NEC Table 310.16 page, NEC edition by state, the
          homepage and the calculators and guides pages also list their sources under Sources, near the bottom of the
          page.
        </p>
        <p>
          Code values are from NFPA 70, the National Electrical Code (NEC), 2023 edition, unless a section says
          otherwise. They were read from documents NFPA publishes openly, such as its records of revisions to the
          code, and from reprints made with NFPA&apos;s permission; each section names its document. States and cities
          adopt NEC editions on their own schedules, and some amend them, so check which edition applies where the
          work is done.
        </p>

        <nav aria-label="On this page" className="border-t-2 border-ink pt-3 text-[16.5px]">
          <p className="text-[15px] font-bold">On this page</p>
          <ul className="mt-2 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
            {TOC.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={LINK}>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section id={method.id} data-src="calc:conductor-sizing" aria-labelledby={`${method.id}-title`} className="scroll-mt-24 space-y-4">
          <h2 id={`${method.id}-title`} className={H2}>
            {method.title}
          </h2>
          <p>
            The{' '}
            <Link href="/calculators/wire-size-calculator" className={LINK}>
              wire size calculator
            </Link>{' '}
            starts from the breaker or fuse rating you choose, the conductor material, how the conductors are run and
            the circuit, and works in these steps:
          </p>
          <ol className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-cut-line">
            <li>
              Pick the column of Table 310.16: <Val v={TERMINATION_RULES.cableColumn} unit="°C" src="nec-110-14c" /> for NM
              or UF cable; for single conductors, the column 110.14(C) allows,{' '}
              <Val v={TERMINATION_RULES.columnAtOrBelowLimit} unit="°C" src="nec-110-14c" /> on circuits rated{' '}
              <Val v={TERMINATION_RULES.limitA} unit="A" src="nec-110-14c" /> or less and{' '}
              <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src="nec-110-14c" /> above, unless you say the terminals
              are marked <Val v={TERMINATION_RULES.columnAtOrBelowLimit} unit="°C" src="nec-110-14c" /> or listed and
              identified for <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src="nec-110-14c" /> conductors (see{' '}
              <SectionLink domain="nec-110-14c">Terminal temperatures</SectionLink>).
            </li>
            <li>
              Take the smallest size whose ampacity in that column is at least the rating (see{' '}
              <SectionLink domain="nec-310-16">Ampacity</SectionLink>). With an ambient other than the table&apos;s{' '}
              <Val v={TABLE_AMBIENT.c} unit="°C" src="nec-310-16" />, or more than three current-carrying conductors, the
              ampacity is first corrected, from the <Val v={MAX_COLUMN_C} unit="°C" src="nec-310-16" /> column for single
              conductors, which it takes as rated <Val v={MAX_COLUMN_C} unit="°C" src="nec-310-16" />, or from the{' '}
              <Val v={TERMINATION_RULES.cableColumn} unit="°C" src="nec-110-14c" /> column for cable, and then held to the
              size&apos;s value in the column of step 1 (see{' '}
              <SectionLink domain="nec-310-15-corrections">Ambient temperature and bundling</SectionLink>).
            </li>
            <li>
              If that size is {gauges(COPPER_LIMITS)} copper, or {gauges(ALUMINUM_LIMITS)} aluminum, move up while the
              rating is above the size&apos;s 240.4(D) limit (see{' '}
              <SectionLink domain="nec-240-4-d">Small-conductor limits</SectionLink>).
            </li>
            <li>
              With a load current marked continuous, check that the rating is at least{' '}
              <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src="nec-continuous-load" /> of it, as 210.20(A) requires; a size
              that carries the rating then has the ampacity 210.19(A) asks of it (see{' '}
              <SectionLink domain="nec-continuous-load">Continuous loads</SectionLink>).
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
              <Size s={LARGEST_SIZE} />, and enlarge the ground wire in proportion to the conductor area, as 250.122(B)
              requires.
            </li>
          </ol>
          <p>
            Where 240.4(B) would let the rating protect the next smaller size, because that size&apos;s ampacity,
            corrected like the others, falls between two standard ratings with the rating the next one up, and 240.4(D)
            allows it, the result says so, with the largest load the smaller size may carry under 210.19(A). The
            calculator&apos;s own answer always carries the full rating. It starts from the rating you choose and does not
            pick one for a load.
          </p>
          <Limits>
            <li>
              NM and UF cable are corrected from the{' '}
              <Val v={TERMINATION_RULES.cableColumn} unit="°C" src="nec-110-14c" /> column; the cable articles&apos; own
              ampacity rules are not covered yet.
            </li>
            <li>
              Single conductors rated below <Val v={MAX_COLUMN_C} unit="°C" src="nec-310-16" /> need the{' '}
              <Link href="/calculators/ampacity-calculator" className={LINK}>
                ampacity calculator
              </Link>
              , which takes the insulation rating.
            </li>
            <li>
              A load is entered as all continuous or all noncontinuous, and you enter the count of current-carrying
              conductors: the rules for whether neutral and ground wires count are not covered.
            </li>
          </Limits>
        </section>

        <section id={breakerMethod.id} data-src="calc:breaker-sizing" aria-labelledby={`${breakerMethod.id}-title`} className="scroll-mt-24 space-y-4">
          <h2 id={`${breakerMethod.id}-title`} className={H2}>
            {breakerMethod.title}
          </h2>
          <p>
            The{' '}
            <Link href="/calculators/circuit-breaker-calculator" className={LINK}>
              circuit breaker calculator
            </Link>{' '}
            starts from a continuous and a noncontinuous load in amperes, the conductor material and how the conductors
            are run:
          </p>
          <ol className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-cut-line">
            <li>
              The smallest rating the load allows is the noncontinuous load plus{' '}
              <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src="nec-continuous-load" /> of the continuous load, as 210.20(A)
              requires (see <SectionLink domain="nec-continuous-load">Continuous loads</SectionLink>). With no continuous
              load, it is the load.
            </li>
            <li>
              Take the smallest standard rating of Table 240.6(A) at or above it, from{' '}
              <Val v={RATING_MIN_A} unit="A" src="nec-240-ocpd" /> (see{' '}
              <SectionLink domain="nec-240-ocpd">Standard breaker and fuse ratings</SectionLink>).
            </li>
            <li>
              Size the wire for that rating as steps 1 to 3 of the{' '}
              <a href={`#${method.id}`} className={LINK}>
                wire size calculator
              </a>{' '}
              do, at <Val v={TABLE_AMBIENT.c} unit="°C" src="nec-310-16" /> with no more than three current-carrying
              conductors: the column the terminals allow, the smallest size whose ampacity is at least the rating, then
              240.4(D).
            </li>
            <li>
              Take the ground wire for the rating from Table 250.122 (see{' '}
              <SectionLink domain="nec-250-grounding">Ground wires</SectionLink>).
            </li>
          </ol>
          <p>
            Where 240.4(B) lets the rating protect the next smaller size, and that size&apos;s ampacity still reaches the
            smallest rating the load allows, as 210.19(A) asks of the conductors, the result says so. The page&apos;s table
            of the largest breaker for each wire size runs the same rules the other way: the 240.4(D) limit for{' '}
            {gauges(COPPER_LIMITS)} copper and {gauges(ALUMINUM_LIMITS)} aluminum; above them, the ampacity when it is a
            standard rating, or the next standard rating above it under 240.4(B).
          </p>
          <Limits>
            <li>
              A breaker or fuse whose assembly is listed for operation at{' '}
              <Val v={100} unit="%" src="nec-continuous-load" /> of its rating (the exception to 215.3) is not covered.
            </li>
            <li>
              Motor, air conditioner and other equipment circuits follow rules of their own (see{' '}
              <a href={`#${notCovered.id}`} className={LINK}>
                {notCovered.title}
              </a>
              ).
            </li>
          </Limits>
        </section>

        <section id={loadMethod.id} data-src="calc:load-calc-2023" aria-labelledby={`${loadMethod.id}-title`} className="scroll-mt-24 space-y-4">
          <h2 id={`${loadMethod.id}-title`} className={H2}>
            {loadMethod.title}
          </h2>
          <p>
            The{' '}
            <Link href="/calculators/residential-load-calculator" className={LINK}>
              residential load calculator
            </Link>{' '}
            runs both methods of NEC 2023 Article 220 on the same inputs for one dwelling unit and shows every step (see{' '}
            <SectionLink domain="nec-220-load-calcs">Dwelling load calculations</SectionLink>). The standard method adds:
          </p>
          <ol className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-cut-line">
            <li>
              The floor area at {LV(LS.vaPerFt2, 'VA')} per ft² (220.41) and {LV(LS.smallApplianceCircuitVa, 'VA')} for each
              small-appliance and laundry circuit (220.52), through Table 220.45.
            </li>
            <li>
              The water heater and the other appliances fastened in place, at {LV(LS.appliancePct, '%')} of their total when
              there are {LS.minAppliances} or more (220.53).
            </li>
            <li>
              The dryer at {LV(LS.dryerMinW, 'W')} or its nameplate, whichever is larger (220.54), and one range from Table
              220.55, Column C: {LV(L_RANGE_KW, 'kW')} up to {LV(TABLE_220_55.note1.fromKw, 'kW')}, with Note 1 above that.
            </li>
            <li>An EV charger at {LV(LS.evseMinW, 'W')} or its nameplate, whichever is larger (220.57).</li>
            <li>
              The larger of the heating at {LV(LS.spaceHeatPct, '%')} (220.51) and the cooling at{' '}
              {LV(LS.noncoincidentMotorPct, '%')}, read from 220.60 as set out below.
            </li>
          </ol>
          <p>
            The optional method of 220.82 puts the floor area at {LV(LO.vaPerFt2, 'VA')} per ft²,{' '}
            {LV(LO.smallApplianceAndLaundryCircuitVa, 'VA')} per small-appliance and laundry circuit and the nameplates of the
            range, dryer, water heater, other appliances and EV charger into one general load, counts the first{' '}
            {LV(G_FIRST.upToVa, 'VA')} of it at {LV(G_FIRST.pct, '%')} and the rest at {LV(G_REST.pct, '%')}, and adds the
            largest heating or cooling selection of 220.82(C) that applies: air conditioning at{' '}
            {LV(lpct(LH.airConditioning), '%')}; a heat pump at {LV(lpct(LH.heatPumpWithoutSupplementalHeat), '%')}, or at{' '}
            {LV(L_COMBINED.compressor, '%')} plus {LV(L_COMBINED.supplemental_heat, '%')} of its backup heat; electric heat at{' '}
            {LV(lpct(LH.spaceHeatFewUnits), '%')} in fewer than {LO.spaceHeatUnitsLimit} separately controlled units, or{' '}
            {LV(lpct(LH.spaceHeatManyUnits), '%')} in {LO.spaceHeatUnitsLimit} or more. Each method&apos;s total is divided by{' '}
            <Val v={DWELLING_VOLTS} unit="V" src="nec-310-12" />, and the service is the smallest Table 310.12 rating at or
            above the current (see <SectionLink domain="nec-310-12">Dwelling services and feeders</SectionLink>).
          </p>
          <h3 className={H3}>Readings</h3>
          <ul className={LIST}>
            <li>
              220.60 lets a calculation keep only the largest of loads unlikely to run at the same time; where a motor or
              air-conditioning load is not the largest of them, it calls for &ldquo;125 percent of either the motor load or
              air-conditioning load.&rdquo; The calculator compares the heating with the cooling taken at{' '}
              {LV(LS.noncoincidentMotorPct, '%')} and keeps the larger.
            </li>
            <li>
              The standard method names no heat pump. The calculator counts one as heating together with its backup heat
              (220.51) and as cooling on its own.
            </li>
            <li>
              The 2023 optional method has no item for an EV charger. The calculator adds its nameplate to the general load,
              with the appliances 220.82(B) lists as located on a specific circuit.
            </li>
          </ul>
          <Limits>
            <li>One dwelling unit: no multifamily (220.84), existing dwelling (220.83) or two-unit (220.85) calculation.</li>
            <li>
              Motors other than the air conditioning or heat pump count at their rating: the motor and air-conditioning
              rules 220.50 points to are not applied.
            </li>
            <li>One range: a separate cooktop and wall ovens, and the 220.61 neutral load, are not calculated.</li>
            <li>A heat pump whose compressor is locked out while the backup heat runs is still counted with both.</li>
            <li>2023 values only; the 2026 values in Article 120 are not verified yet.</li>
          </Limits>
        </section>

        <section id={rangeMethod.id} data-src="calc:range-circuit" aria-labelledby={`${rangeMethod.id}-title`} className="scroll-mt-24 space-y-4">
          <h2 id={`${rangeMethod.id}-title`} className={H2}>
            {rangeMethod.title}
          </h2>
          <p>
            The{' '}
            <Link href="/calculators/range-calculator" className={LINK}>
              range calculator
            </Link>{' '}
            starts from what the circuit supplies, the nameplate ratings in kW, the supply voltage and the circuit rating the
            appliance&apos;s instructions give:
          </p>
          <ol className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-cut-line">
            <li>
              The branch-circuit load from Table 220.55 and its notes (see{' '}
              <SectionLink domain="nec-220-load-calcs">Dwelling load calculations</SectionLink>): one range by Column C with
              Note 1; one wall-mounted oven or one counter-mounted cooking unit at its nameplate; a counter-mounted cooking
              unit with not more than two wall-mounted ovens, on one circuit in one room, added and treated as one range.
            </li>
            <li>
              The current: that load divided by the supply, {RANGE_VOLTS.map((v, k) => (
                <span key={v}>
                  {k > 0 ? ' or ' : ''}
                  <Val v={v} unit="V" src="input" />
                </span>
              ))}
              . The circuit rating entered must reach it.
            </li>
            <li>
              The wire for the circuit rating as steps 1 to 3 of the{' '}
              <a href={`#${method.id}`} className={LINK}>
                wire size calculator
              </a>{' '}
              size it, and the ground wire from Table 250.122.
            </li>
          </ol>
          <p>
            The calculator offers circuit ratings from <Val v={RANGE_CIRCUITS[0]} unit="A" src="nec-240-ocpd" /> to{' '}
            <Val v={RANGE_CIRCUITS[RANGE_CIRCUITS.length - 1]} unit="A" src="nec-240-ocpd" />, the standard ratings of
            Table 240.6(A) between them, and never picks one: the NEC&apos;s minimum circuit for household ranges has not
            been verified here, so the rating comes from the appliance&apos;s instructions (see{' '}
            <SectionLink domain="mfr-dryer-range">Range and dryer makers&apos; instructions</SectionLink>).
          </p>
          <Limits>
            <li>One circuit: a feeder or service with several appliances is counted by the residential load calculator.</li>
            <li>No continuous-load factor: a household range is counted at its Table 220.55 load.</li>
            <li>The neutral, taps and cord sets are not sized.</li>
          </Limits>
        </section>

        <section id={dryerMethod.id} data-src="calc:dryer-circuit" aria-labelledby={`${dryerMethod.id}-title`} className="scroll-mt-24 space-y-4">
          <h2 id={`${dryerMethod.id}-title`} className={H2}>
            {dryerMethod.title}
          </h2>
          <p>
            The{' '}
            <Link href="/calculators/dryer-calculator" className={LINK}>
              dryer calculator
            </Link>{' '}
            keeps a dryer&apos;s two numbers apart:
          </p>
          <ol className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-cut-line">
            <li>
              Its load on a feeder or service: each dryer at <Val v={LS.dryerMinW} unit="W" src="nec-220-load-calcs" /> or its
              nameplate, whichever is larger (220.54), times the number of dryers and Table 220.54&apos;s percent for that
              number, and the current at the supply voltage.
            </li>
            <li>
              Its own circuit: the rating the dryer&apos;s instructions give, from{' '}
              <Val v={DRYER_CIRCUITS[0]} unit="A" src="nec-240-ocpd" /> to{' '}
              <Val v={DRYER_CIRCUITS[DRYER_CIRCUITS.length - 1]} unit="A" src="nec-240-ocpd" />, with the wire and ground wire as
              steps 1 to 3 of the{' '}
              <a href={`#${method.id}`} className={LINK}>
                wire size calculator
              </a>{' '}
              size them.
            </li>
          </ol>
          <Limits>
            <li>The calculator never picks the circuit rating; the dryer&apos;s instructions give it.</li>
            <li>Dryers on a 3-phase feeder and the 220.61 neutral are not calculated.</li>
          </Limits>
        </section>

        <section id={hpMethod.id} data-src="calc:motor-flc" aria-labelledby={`${hpMethod.id}-title`} className="scroll-mt-24 space-y-4">
          <h2 id={`${hpMethod.id}-title`} className={H2}>
            {hpMethod.title}
          </h2>
          <p>
            The{' '}
            <Link href="/calculators/horsepower-to-amps-calculator" className={LINK}>
              horsepower to amps calculator
            </Link>{' '}
            reads one cell of an NEC full-load current table and does no arithmetic on it:
          </p>
          <ol className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-cut-line">
            <li>
              The table by motor: Table 430.248 for single-phase AC, Table 430.250&apos;s induction motors for three-phase AC, Table 430.247 for DC
              (see <SectionLink domain="nec-430-flc">Motor full-load currents</SectionLink>).
            </li>
            <li>
              The column by voltage: a single- or three-phase system voltage takes the rated-voltage column the tables&apos; notes give it; a DC
              motor takes the column of its rated voltage.
            </li>
            <li>The cell in the horsepower&apos;s row, or none where the table prints none.</li>
          </ol>
          <p>
            Beside the current it shows the rated power, the horsepower times{' '}
            <Val v={W_PER_ELECTRICAL_HP} unit="W" src="nist-sp811-conversions" />, and the current that power alone would draw at the
            column&apos;s voltage at <Val v={100} unit="%" src="calc:motor-flc" /> efficiency and a power factor of 1, divided by √3 more on
            three-phase. That second current is a comparison, never an answer.
          </p>
          <Limits>
            <li>No conductor, overload or breaker size: Article 430&apos;s rules for them are not verified here yet.</li>
            <li>Synchronous motors, two-phase motors (Table 430.249) and Table 430.250&apos;s power factor footnote are left out.</li>
          </Limits>
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
            uses the conductor temperature you enter, starting at{' '}
            <Val v={VD_TOOL_DEFAULT_TEMP_C} unit="°C" src="calc:voltage-drop" />; the voltage-drop step of the wire size
            calculator uses <Val v={RESISTANCE_TEMP_C} unit="°C" src="calc:voltage-drop" />. With I the current, R the
            resistance per 1000 ft of one conductor, n the number of conductors in parallel, L the one-way length in feet,
            V the supply voltage (line to line on three-phase), and k = 2 on a DC or single-phase circuit or √3 on a
            three-phase circuit:
          </p>
          <Formulas
            src="calc:voltage-drop"
            rows={[
              ['Voltage drop', 'VD = k × I × (R ÷ n) × L ÷ 1000'],
              ['Percent drop', '100 × VD ÷ V'],
            ]}
          />
          <p>
            Asked for the smallest size, the voltage drop calculator tries each Table 310.16 size from the smallest it
            offers until the drop is at most your target. A load entered in watts becomes a current through the formulas
            in <SectionLink domain="eia-power-glossary">Real, reactive and apparent power</SectionLink>,{' '}
            <SectionLink domain="doe-motor-load-efficiency">Three-phase power</SectionLink> and{' '}
            <SectionLink domain="nist-sp330-si-units">Watts, volts and ohms</SectionLink>.
          </p>
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
            circuit needs for your voltage-drop target, with the current I you enter (or watts ÷ volts, see{' '}
            <SectionLink domain="nist-sp330-si-units">Watts, volts and ohms</SectionLink>) and the allowed drop VD in volts:
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
            The wire size calculator uses the column the terminals allow (see{' '}
            <SectionLink domain="nec-110-14c">Terminal temperatures</SectionLink>). The ampacity calculator shows the
            column you choose. The voltage drop calculator notes when the current is
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
            The ampacity calculator reads the row whose printed range holds the temperature you enter, in °C or °F, and
            the band that holds your count of current-carrying conductors. The wire size calculator applies both the
            same way, from the <Val v={MAX_COLUMN_C} unit="°C" src="nec-310-16" /> column for single conductors and the{' '}
            <Val v={TERMINATION_RULES.cableColumn} unit="°C" src="nec-110-14c" /> column for cable.
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

        <SourceSection domain="nec-110-14c">
          <p>
            Section 110.14(C) of the NEC (2023) limits the column of Table 310.16 a conductor is sized from: the
            temperature rating used may not exceed the lowest rating of any connected termination, conductor or device.
            The terminals of equipment for circuits rated <Val v={TERMINATION_RULES.limitA} unit="A" src="nec-110-14c" /> or
            less, or marked for <Size s="14" /> through <Size s="1" /> conductors, are used at the{' '}
            <Val v={TERMINATION_RULES.columnAtOrBelowLimit} unit="°C" src="nec-110-14c" /> ampacity unless the equipment is
            listed and identified for higher-rated conductors. Those for circuits rated over{' '}
            <Val v={TERMINATION_RULES.limitA} unit="A" src="nec-110-14c" />, or marked for conductors larger than{' '}
            <Size s="1" />, are used at the <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src="nec-110-14c" />{' '}
            ampacity unless listed and identified for more. A conductor with a higher rating may start from its own column
            for ampacity correction and adjustment.
          </p>
          <SourceFacts s={section('nec-110-14c')} />
          <p>
            The text was read in NFPA&apos;s Second Draft for the 2023 edition, where revision SR-7793 changed only the
            informational notes of 110.14(C). The{' '}
            <Link href="/calculators/ampacity-calculator" className={LINK}>
              ampacity calculator
            </Link>{' '}
            shows a corrected ampacity against the{' '}
            <Val v={TERMINATION_RULES.columnAtOrBelowLimit} unit="°C" src="nec-110-14c" /> and{' '}
            <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src="nec-110-14c" /> values of the same size, never above the
            conductor&apos;s own column, and keeps NM and UF cable at the{' '}
            <Val v={TERMINATION_RULES.cableColumn} unit="°C" src="nec-110-14c" /> column. The{' '}
            <Link href="/guides/wire-size-for-200-amp" className={LINK}>
              200 A guide
            </Link>{' '}
            sizes a feeder rated over <Val v={TERMINATION_RULES.limitA} unit="A" src="nec-110-14c" /> from the{' '}
            <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src="nec-110-14c" /> column, and the{' '}
            <Link href="/calculators/wire-size-calculator" className={LINK}>
              wire size calculator
            </Link>{' '}
            sizes single conductors from the column these rules give for the rating, or from the one you confirm for the
            terminals.
          </p>
          <Limits>
            <li>
              Terminals listed and identified for <Val v={MAX_COLUMN_C} unit="°C" src="nec-310-16" /> conductors are not
              covered.
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
            reprint of the 2023 table, made with NFPA&apos;s permission. Section 240.4(B) lets the next higher standard
            rating protect a conductor whose ampacity is not a standard rating, up to{' '}
            <Val v={NEXT_SIZE_UP_MAX_A} unit="A" src="nec-240-ocpd" />, where the conductors are not part of a branch circuit
            supplying more than one receptacle for cord-and-plug-connected portable loads.
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
              The calculators pick a conductor whose ampacity is at least the rating. The wire size calculator notes where
              240.4(B) would allow the next smaller size, and the{' '}
              <Link href="/guides/wire-size-for-200-amp#subpanel" className={LINK}>
                200 A guide
              </Link>{' '}
              shows the allowance for a feeder of <Size s="4/0" /> aluminum.
            </li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nec-continuous-load">
          <p>
            The 2023 NEC sizes branch circuits (210.19(A) and 210.20(A)), feeders (215.2(A) and 215.3) and service-entrance
            conductors (230.42(A)) for the noncontinuous load plus{' '}
            <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src="nec-continuous-load" /> of the continuous load, the conductors and
            the breaker or fuse ahead of them alike. 215.2(A) also carries an informational note on voltage drop: feeder
            conductors sized to keep the drop at the farthest outlet under{' '}
            <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src="nec-continuous-load" />, with no more than{' '}
            <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src="nec-continuous-load" /> on feeder and branch circuit together,
            &ldquo;will provide reasonable efficiency of operation.&rdquo;
          </p>
          <SourceFacts s={section('nec-continuous-load')} />
          <p>
            NFPA&apos;s public inputs and First Draft for the 2026 edition print these 2023 sections as their base text; the
            voltage-drop note was read in two public inputs that quote 215.2(A) word for word.
          </p>
          <p>
            The{' '}
            <Link href="/calculators/voltage-drop-calculator" className={LINK}>
              voltage drop calculator
            </Link>{' '}
            quotes the note as advice and starts its search for the smallest size at the note&apos;s{' '}
            <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src="nec-continuous-load" />, a target you can change; the{' '}
            <Link href="/calculators/low-voltage-calculator" className={LINK}>
              low voltage calculator
            </Link>{' '}
            starts at the same figure. The{' '}
            <Link href="/calculators/wire-size-calculator" className={LINK}>
              wire size calculator
            </Link>{' '}
            applies the branch-circuit rules: for a load marked continuous, it asks for a rating of at least{' '}
            <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src="nec-continuous-load" /> of the load.
          </p>
          <Limits>
            <li>The matching note for branch circuits has not been read in a 2023 text, so no page quotes it.</li>
            <li>The pages give the note&apos;s figures as advice about efficiency, never as limits.</li>
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
            copper-clad aluminum column. The ground wire calculator and the{' '}
            <Link href="/calculators/service-entrance-calculator" className={LINK}>
              service entrance calculator
            </Link>{' '}
            take the grounding electrode conductor from Table 250.66 for the largest service conductor. When the wire
            size calculator chooses larger conductors for voltage drop, or when you tell the ground wire calculator the
            circuit wires were upsized, the ground wire grows in proportion, as 250.122(B) requires, rounded up to a
            Table 310.16 size and never below the table&apos;s ground wire:
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
            Table 310.12 of the NEC (2023) lists conductor sizes for a 120/240 V single-phase service, or a feeder, that
            carries the entire load of a one-family dwelling or of one dwelling unit, from{' '}
            <Val v={SERVICE_FIRST.ratingA} unit="A" src="nec-310-12" /> to{' '}
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
              Only for a 120/240 V single-phase service, or a feeder, that carries the entire load of one dwelling unit.
              Other services and feeders are sized from Table 310.16, as the{' '}
              <Link href="/guides/wire-size-for-200-amp" className={LINK}>
                200 A guide
              </Link>{' '}
              compares.
            </li>
            <li>The corrections for ambient temperature and bundling still apply.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nec-220-load-calcs">
          <p>
            Article 220 of the NEC (2023) sets the load calculation for a dwelling: the standard method&apos;s unit loads
            and demand factors, from 220.41 to 220.61, and the optional method of 220.82. The values were read from NFPA
            Public Input 4311, which reproduces the 2023 text under the Article 120 numbers it proposed; the site maps
            them back to Article 220.
          </p>
          <SourceFacts s={section('nec-220-load-calcs')} />
          <p>
            The values the calculator uses: {LV(LS.vaPerFt2, 'VA')} per ft² of floor area; {LV(LS.smallApplianceCircuitVa, 'VA')}{' '}
            for each small-appliance and laundry circuit; Table 220.45&apos;s first {LV(L_FIRST.upToVa, 'VA')} at{' '}
            {LV(L_FIRST.pct, '%')}, up to {LV(L_SECOND.upToVa, 'VA')} at {LV(L_SECOND.pct, '%')} and the rest at{' '}
            {LV(L_REST.pct, '%')}; Table 220.55&apos;s Column C and its Note 1, which adds {LV(TABLE_220_55.note1.pctPerKw, '%')}{' '}
            for each kW, or major fraction of one, over {LV(TABLE_220_55.note1.fromKw, 'kW')}, up to{' '}
            {LV(TABLE_220_55.note1.maxKw, 'kW')}; and the percents of 220.51, 220.53, 220.54, 220.57, 220.60 and 220.82
            listed above.
          </p>
          <Limits>
            <li>
              The numbers of the last two notes to Table 220.55 were inferred from their order, so the site cites those
              notes without a number.
            </li>
            <li>The 2026 edition moved these rules to Article 120; its values have not been verified here.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="mfr-dryer-range">
          <p>
            Installation instructions that ranges and dryers ship with. The range calculator quotes two: Whirlpool&apos;s
            freestanding electric range manual {WHIRLPOOL_RANGE.doc} (the same kW table as its earlier W10403811C and
            W10575959A), which gives the circuit for each band of range ratings, the cords and receptacles and the
            direct-wire sizes, and Frigidaire&apos;s 40-inch electric range instructions {FRIGIDAIRE_RANGE.doc}. The dryer
            calculator quotes Whirlpool&apos;s electric dryer instructions {WHIRLPOOL_DRYER.doc}, GE&apos;s {GE_DRYER.doc} and
            GE&apos;s {GE_DBLR333EE.model} spec sheet: the circuit, the cord, the conductors and the ratings.
          </p>
          <SourceFacts s={section('mfr-dryer-range')} href={WHIRLPOOL_RANGE.url} />
          <Limits>
            <li>Each value belongs to that maker&apos;s appliances and documents; none is used as a rule for others.</li>
            <li>The calculator asks for the circuit rating; it shows the Whirlpool band only as an example.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nema-receptacle-configs">
          <p>
            The ratings, poles and wires of NEMA straight-blade receptacles, {NEMA_CONFIGS.length} configurations in all,
            read from Hubbell and Leviton device sheets that state compliance with NEMA WD 6. The standard itself is sold
            through ANSI and was not read.
          </p>
          <SourceFacts s={section('nema-receptacle-configs')} />
          <Limits>
            <li>Only the configurations in the file; a configuration not in it is not named on the site.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nec-2023-rule-excerpts">
          <p>
            Single sections of the 2023 NEC that the site cites, read from Leviton&apos;s Captain Code 2023 pages, which
            reprint them with NFPA&apos;s permission. The range and dryer calculators cite 210.8(D): GFCI protection for the
            branch circuit or outlet that supplies an electric range, a wall-mounted oven, a counter-mounted cooking unit or
            a clothes dryer. The horsepower to amps calculator cites 430.6(A): the full-load current tables, not the
            nameplate current, for a motor&apos;s conductor ampacity, switch ratings and short-circuit and ground-fault
            protection, and the nameplate current for its separate overload protection.
          </p>
          <SourceFacts s={section('nec-2023-rule-excerpts')} />
          <Limits>
            <li>Only the sections that source covers; state adoptions can amend them.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nec-430-flc">
          <p data-src="nec-430-flc">
            NEC 2023 Tables 430.247 to 430.250 list a motor&apos;s full-load current by horsepower and rated voltage: DC,
            single-phase, two-phase and three-phase motors. The values were read from NFPA&apos;s 2023-cycle Second Draft
            (SR-7559 changed the titles and notes only) and from Eaton&apos;s 2023 reprint, which carries NFPA&apos;s
            permission; Table 430.250&apos;s rows up to {HP_EATON_LAST} hp match that reprint cell for cell, and every other
            cell was confirmed twice against the Second Draft. The tables&apos; notes give the columns for system voltages:{' '}
            {HP_THREE_SYSTEMS}.
          </p>
          <SourceFacts s={section('nec-430-flc')} />
          <Limits>
            <li>Only the induction motor columns of Table 430.250; the synchronous motor columns are not used.</li>
            <li>Table 430.250&apos;s footnote for synchronous motors at other power factors is not used.</li>
            <li>Two-phase motors (Table 430.249) are in the file but not offered: a 120/240 V supply is single-phase.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="eia-power-glossary">
          <p>
            The U.S. Energy Information Administration&apos;s glossary defines the powers the calculators work with.
            Apparent power is volts times amperes, in volt-amperes. It splits into real power, the part that does work,
            in watts, and reactive power, which does none and which motors and other magnetic equipment need, in vars.
            Power factor is real power divided by apparent power, so it is at most 1.
          </p>
          <SourceFacts s={section('eia-power-glossary')} />
          <p>With P the real power, S the apparent power, V the voltage and PF the power factor:</p>
          <Formulas
            src="calc:power"
            rows={[
              ['Power factor', 'PF = P ÷ S'],
              ['Apparent power', 'S = P ÷ PF'],
              ['Current, single-phase AC', 'I = P ÷ (V × PF)'],
              ['Current from S, single-phase', 'I = S ÷ V'],
            ]}
          />
          <Limits>
            <li>The calculators use the power factor you enter; none measures or estimates it.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="doe-motor-load-efficiency">
          <p data-src="doe-motor-load-efficiency">
            The U.S. Department of Energy&apos;s Motor Challenge fact sheet on motor load and efficiency gives the power of
            a three-phase load as V × I × PF × √3 ÷ 1000 kilowatts, V being the voltage between two lines and I the
            current in one line, and works it on a measured motor: <Val v={DOE_MOTOR.volts} unit="V" src="doe-motor-load-efficiency" />,{' '}
            <Val v={DOE_MOTOR.amps} unit="A" src="doe-motor-load-efficiency" /> and a power factor of {DOE_MOTOR.pf} give{' '}
            <Val v={DOE_MOTOR.printedKw} unit="kW" src="doe-motor-load-efficiency" />.
          </p>
          <p data-src="doe-motor-load-efficiency">
            The{' '}
            <Link href="/calculators/horsepower-to-amps-calculator" className={LINK}>
              horsepower to amps calculator
            </Link>{' '}
            quotes the sheet on horsepower and efficiency: a motor of a given rated horsepower is expected to deliver that
            power in mechanical form, and its efficiency is the ratio of its useful power output to its total power input.
          </p>
          <SourceFacts s={section('doe-motor-load-efficiency')} />
          <Formulas
            src="calc:power"
            rows={[
              ['Three-phase real power', 'P = √3 × V × I × PF'],
              ['Current, three-phase AC', 'I = P ÷ (√3 × V × PF)'],
            ]}
          />
          <p>
            The{' '}
            <Link href="/calculators/three-phase-calculator" className={LINK}>
              three-phase calculator
            </Link>{' '}
            solves it for whichever value you leave out, and the{' '}
            <Link href="/calculators/voltage-drop-calculator" className={LINK}>
              voltage drop calculator
            </Link>{' '}
            uses it to turn a three-phase load in watts into a current.
          </p>
          <Limits>
            <li>A balanced load: the same current in all three lines, with sinusoidal voltage and current.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="mit-polyphase-networks">
          <p data-src="mit-polyphase-networks">
            MIT&apos;s course notes on polyphase networks (6.061, J. L. Kirtley Jr.) show that in a balanced three-phase
            system the voltage between two lines is √3 times the voltage from a line to neutral, and that three-phase
            power, 3 × V(line to neutral) × I, is the same as √3 × V(line to line) × I. The nominal wye systems bear it
            out:{' '}
            {TP_WYE_SYSTEMS.map((w, k) => (
              <span key={w.lineVolts} data-src="us-nominal-voltages">
                {k > 0 && ' and '}
                {w.lineVolts}Y/{w.neutralVolts} V
              </span>
            ))}
            .
          </p>
          <SourceFacts s={section('mit-polyphase-networks')} />
          <Formulas
            src="calc:power"
            rows={[
              ['Apparent power, three-phase', 'S = √3 × V × I'],
              ['Line to neutral, wye', 'V(line to neutral) = V(line to line) ÷ √3'],
            ]}
          />
          <Limits>
            <li>
              The three-phase calculator names a line-to-neutral voltage only at{' '}
              {TP_WYE_SYSTEMS.map((w, k) => (
                <span key={w.lineVolts}>
                  {k > 0 && ' and '}
                  <Val v={w.lineVolts} unit="V" src="us-nominal-voltages" />
                </span>
              ))}
              , the wye systems among the nominal voltages.
            </li>
          </Limits>
        </SourceSection>

        <SourceSection domain="doe-power-factor-cost">
          <p data-src="doe-power-factor-cost">
            The U.S. Department of Energy&apos;s Motor Challenge fact sheet on power factor cost draws real, reactive and
            apparent power as a right triangle, reactive power at 90° to real power, and shows a capacitor bank taking over
            reactive power so the apparent power and the current fall: <Val v={DOE_PF.kw} unit="kW" src="doe-power-factor-cost" /> at{' '}
            <Val v={DOE_PF.kva} unit="kVA" src="doe-power-factor-cost" />, raised to a power factor of {DOE_PF.to}.
          </p>
          <SourceFacts s={section('doe-power-factor-cost')} />
          <Formulas
            src="calc:power"
            rows={[
              ['Reactive power', 'Q = √(S² − P²)'],
              ['Capacitor bank', 'Qc = Q before − Q after, at the same P'],
              ['Current after', 'I′ = I × PF ÷ PF′'],
            ]}
          />
          <Limits>
            <li>
              The sheet gives its capacitor in kW; capacitors are rated in kVAR, and the sheet&apos;s own figures give{' '}
              <Val v={DOE_PF_KVAR} unit="kVAR" src="calc:power" format={{ sig: 4 }} />.
            </li>
            <li>The capacitor bank&apos;s own protection and switching are outside the calculator.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="nist-sp330-si-units">
          <p>
            NIST Special Publication 330, the U.S. edition of the International System of Units, defines the volt as a watt
            per ampere and the ohm as a volt per ampere (Table 4). A watt is therefore a volt times an ampere, and on DC
            the current is the power divided by the voltage.
          </p>
          <SourceFacts s={section('nist-sp330-si-units')} />
          <Formulas src="calc:power" rows={[['Current, DC', 'I = P ÷ V']]} />
          <p>
            The{' '}
            <Link href="/calculators/ohms-law-calculator" className={LINK}>
              Ohm&apos;s law calculator
            </Link>{' '}
            works out the other two of voltage, current, resistance and power from any two you enter:
          </p>
          <Formulas
            src="calc:ohms-law"
            rows={[
              ["Ohm's law", 'V = I × R'],
              ['Power', 'P = V × I = I² × R = V² ÷ R'],
            ]}
          />
          <Limits>
            <li>Ohm&apos;s law here is for DC, or AC with a purely resistive load; the resistance is taken as constant.</li>
          </Limits>
        </SourceSection>

        <SourceSection domain="mfr-water-heaters">
          <p data-src="mfr-water-heaters">
            Rheem&apos;s and A.O. Smith&apos;s documents for their <Val v={240} unit="V" src="mfr-water-heaters" /> electric water heaters with
            two <Val v={4500} unit="W" src="mfr-water-heaters" /> elements wire the elements so only one heats at a time. The watts to amps
            calculator uses this to show why such a heater draws the current of one element; the current itself is calculated.
          </p>
          <SourceFacts s={section('mfr-water-heaters')} />
        </SourceSection>

        <SourceSection domain="us-nominal-voltages">
          <p data-src="us-nominal-voltages">
            North Carolina Utilities Commission Rule R8-17 has utilities use a nominal voltage from ANSI C84.1, the national
            standard for system voltages, and lists them. At the low voltages buildings use: {NOMINAL_SINGLE_PHASE.join(' and ')}{' '}
            V single-phase; {NOMINAL_THREE_PHASE.slice(0, -1).join(', ')} and {NOMINAL_THREE_PHASE[NOMINAL_THREE_PHASE.length - 1]} V
            three-phase. ANSI C84.1 itself is sold, not published openly, so the rule is the public record the calculators cite.
          </p>
          <SourceFacts s={section('us-nominal-voltages')} />
          <p data-src="us-nominal-voltages">
            The{' '}
            <Link href="/calculators/voltage-drop-calculator" className={LINK}>
              voltage drop calculator
            </Link>{' '}
            offers {THREE_PHASE_VOLTS.join(', ')} V line to line on three-phase, and {VD_TOOL_SINGLE_QUICK_VOLTS.join(', ')} V as
            quick choices on single-phase: each is a voltage one of these systems names, line to line or line to neutral.
            The{' '}
            <Link href="/calculators/three-phase-calculator" className={LINK}>
              three-phase calculator
            </Link>{' '}
            offers the same three-phase voltages as buttons and takes any other you type. The{' '}
            <Link href="/calculators/wire-size-calculator" className={LINK}>
              wire size calculator
            </Link>{' '}
            offers {SINGLE_PHASE_VOLTS.join(', ')} V on single-phase and the same three-phase voltages.
          </p>
          <Limits>
            <li>A nominal voltage names the system; the voltage actually delivered varies within the limits the standard sets.</li>
            <li>Other voltages can be typed into the voltage drop and three-phase calculators.</li>
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
              ['Horsepower (electric)', <>1 hp = <Val v={W_PER_ELECTRICAL_HP} unit="W" src="nist-sp811-conversions" /></>],
            ]}
          />
          <p>
            The{' '}
            <Link href="/calculators/btu-to-watts-calculator" className={LINK}>
              BTU to watts calculator
            </Link>{' '}
            converts both ways and gives the load in tons. The{' '}
            <Link href="/calculators/horsepower-to-amps-calculator" className={LINK}>
              horsepower to amps calculator
            </Link>{' '}
            gives a motor&apos;s rating in watts.
          </p>
          <Limits>
            <li>The Btu is the International Table Btu, the one SP 811 lists for Btu per hour.</li>
            <li>A ton is a ton of refrigeration, a rate of heat removal, not a weight.</li>
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

        <SourceSection domain={NEC_ADOPTION_DOMAIN}>
          <p>
            Which NEC edition applies depends on what each state has adopted, or, where a state has no single statewide
            electrical code, what its cities and counties have adopted. The{' '}
            <Link href={ADOPTION_TABLE_HREF} className={LINK}>
              NEC edition by state
            </Link>{' '}
            table has one row per state code, each read from a state or District of Columbia government record: a statute, an
            administrative rule or a page of the agency that enforces the code. Each row links its record.
          </p>
          <SourceFacts s={section(NEC_ADOPTION_DOMAIN)} href={ADOPTION_TABLE_HREF} />
          <p>
            The pages under Cited on give, from these rows, the states on the newest edition and the number of states on
            each edition, counting each state and the District of Columbia once.
          </p>
          <Limits>
            <li>
              {joinNames(NOT_VERIFIED.map((n) => stateName(n.state)))} {NOT_VERIFIED.length === 1 ? 'has' : 'have'} no
              verified edition, and none is guessed.
            </li>
            <li>City and county codes and their amendments are not listed; the local inspection office says which apply.</li>
            <li>
              The rows were verified as of{' '}
              <time dateTime={ADOPTION_AS_OF} data-src={NEC_ADOPTION_DOMAIN}>
                {formatDate(ADOPTION_AS_OF)}
              </time>{' '}
              and are checked again by{' '}
              <time dateTime={nextCheck(NEC_ADOPTION_DOMAIN).slice(0, 7)} data-src={NEC_ADOPTION_DOMAIN}>
                {monthOf(nextCheck(NEC_ADOPTION_DOMAIN))}
              </time>
              .
            </li>
          </Limits>
        </SourceSection>

        <SourceSection domain={NEC_2026_ISSUANCE_DOMAIN}>
          <p>
            NFPA&apos;s Standards Council issues each edition of the NEC. The final minutes of the meeting that issued the
            2026 edition give its issue date,{' '}
            <time dateTime={NEC_2026_ISSUED}>{formatDate(NEC_2026_ISSUED)}</time>, and its effective date,{' '}
            <time dateTime={NEC_2026_EFFECTIVE}>{formatDate(NEC_2026_EFFECTIVE)}</time>. They also record the council&apos;s
            decisions on appeals against parts of the final text, one of which kept the 310.5 rule that allows{' '}
            <Size s={NEC_2026_MIN_SIZES.Cu} /> copper and <Size s={NEC_2026_MIN_SIZES.CCA} /> copper-clad aluminum
            branch-circuit conductors.
          </p>
          <SourceFacts s={section(NEC_2026_ISSUANCE_DOMAIN)} />
          <p>The pages under Cited on take the two dates from these minutes.</p>
          <Limits>
            <li>The minutes give dates and decisions, not the code text, so the changes themselves come from the state review in the next section.</li>
            <li>
              NFPA can amend an issued edition with Tentative Interim Amendments. None issued for the 2026 edition by{' '}
              {monthOf(attribution(NEC_2026_ISSUANCE_DOMAIN).verified_date)} changes a section this site states.
            </li>
          </Limits>
        </SourceSection>

        <SourceSection domain={NEC_2026_DOMAIN}>
          <p>
            Minnesota&apos;s Department of Labor and Industry reviewed the issued 2026 edition before the state adopted it.
            The minutes of its review committee include a table of the significant changes, section by section, and the
            site states only changes that table describes. The site&apos;s calculators and tables stay on the 2023 edition.
          </p>
          <SourceFacts s={section(NEC_2026_DOMAIN)} />
          <p>
            The{' '}
            <Link href="/guides/nec-table-310-16#nec-2026" className={LINK}>
              NEC Table 310.16 page
            </Link>{' '}
            uses it for the new minimum sizes, <Size s={NEC_2026_MIN_SIZES.Cu} /> copper,{' '}
            <Size s={NEC_2026_MIN_SIZES.CCA} /> copper-clad aluminum and <Size s={NEC_2026_MIN_SIZES.Al} /> aluminum, in a
            section renumbered to 310.5, and for the load-calculation article, renumbered from 220 to 120.{' '}
            <Link href="/guides/nec-code-compliance#changes" className={LINK}>
              NEC edition by state
            </Link>{' '}
            lists those changes and others from the summary, among them the threshold of outdoor GFCI protection at
            dwellings and the outdoor service disconnect of one- and two-family dwellings.
          </p>
          <Limits>
            <li>Changes seen only in NFPA&apos;s revision drafts are labeled as drafts and never shown as final.</li>
            <li>The final 2026 Table 310.16 has not been seen, so no 2026 ampacity is shown.</li>
            <li>One line of the summary, on electric vehicle charging, describes draft text that the issued edition left out; the site does not use it.</li>
          </Limits>
        </SourceSection>

        <section id={notCovered.id} aria-labelledby={`${notCovered.id}-title`} className="scroll-mt-24 space-y-4">
          <h2 id={`${notCovered.id}-title`} className={H2}>
            {notCovered.title}
          </h2>
          <p>
            No calculator on the site covers the topics below. Their 2023 NEC text, or the maker&apos;s current
            tables, has not yet been checked in full against a document that can be cited:
          </p>
          <ul className={LIST}>
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

        <section id={errors.id} aria-labelledby={`${errors.id}-title`} className="scroll-mt-24 space-y-4">
          <h2 id={`${errors.id}-title`} className={H2}>
            {errors.title}
          </h2>
          <p>
            If a number on this site disagrees with its source, email info@wiresizes.com. Fixes are dated in the
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
    </div>
  );
}
