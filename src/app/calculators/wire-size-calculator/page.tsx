import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { Byline } from '@/components/content/Byline';
import { DataTable, RSTICKY_TD, RSTICKY_TH, RTD, RTH } from '@/components/content/DataTable';
import { Figure } from '@/components/content/Figure';
import { Size } from '@/components/content/Size';
import { SourceLine } from '@/components/content/SourceLine';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { WireSizeTool } from '@/components/calculators/WireSizeTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { LengthBandsChart } from '@/components/look/Charts';
import { OnThisPage } from '@/components/look/OnThisPage';
import { PageTitle } from '@/components/look/PageTitle';
import {
  LOOK_BYLINE,
  LOOK_BYLINE_LINK,
  LOOK_H2 as H2,
  LOOK_H3 as H3,
  LOOK_LEAD,
  LOOK_LINK as LINK,
  LOOK_P as P,
  LOOK_PAGE,
  LOOK_SOURCES_HEADING,
  LOOK_SOURCES_LIST,
  LOOK_SOURCES_NOTE,
  LOOK_SOURCES_SECTION,
} from '@/components/look/styles';
import { ENGINE_ID } from '@/lib/calculations/conductor-sizing';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import {
  BUNDLED,
  BUNDLED_8_A,
  BUNDLED_PLAIN,
  CONTINUOUS,
  CONTINUOUS_LOAD_A,
  CONTINUOUS_NEEDED_A,
  CONTINUOUS_RATING_A,
  LENGTH_TRACKS,
  LONG_RUN,
  LONG_RUN_AT_12,
  RATING_ROWS,
  ratingRow,
} from '@/lib/wire-size-page';
import type { RatingRow, SizedAt } from '@/lib/wire-size-page';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { CONTINUOUS_LOAD_PERCENT, VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { max240_4D, NEXT_SIZE_UP_MAX_A } from '@/lib/verified/nec-240-4-d';
import { adjustment } from '@/lib/verified/nec-310-15-C-1';
import { AMPACITY_COLUMNS, COLUMN_TYPES, TABLE_AMBIENT, table31016 } from '@/lib/verified/nec-310-16';
import type { Material, SizeKey } from '@/lib/verified/awg';

// /calculators/wire-size-calculator (WSZ-009b; spec: research/page-specs-held.md "WSZ-009"; data gate BUILD): the
// smallest conductor for a breaker or fuse rating in the Table 310.16 column the terminals allow (110.14(C)), corrected
// for heat and bundling, moved up by 240.4(D), checked against the 125 % continuous-load rule (210.20(A), 210.19(A)) and
// sized up for voltage drop, with the Table 250.122 ground wire. Every number below comes from the engine through
// src/lib/wire-size-page.ts or from a verified table. NM and UF cable stay at 60 °C (engine rule nm-cable), as on the
// ampacity calculator; the cable articles' own rules (registry nec-cable-rules) are not covered.
const ROUTE = '/calculators/wire-size-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Wire Size Calculator: AWG by Breaker Size, NEC Table 310.16';
const DESCRIPTION =
  'Wire size for a 15 to 400 A breaker from NEC Table 310.16, with terminal temperatures, heat, bundling, continuous loads, the ground wire and voltage drop.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const AMP = 'nec-310-16';
const COR = 'nec-310-15-corrections';
const TERM = 'nec-110-14c';
const CONT = 'nec-continuous-load';
const SMALL = 'nec-240-4-d';
const OCPD = 'nec-240-ocpd';
const EGC = 'nec-250-grounding';
const RES = 'conductor-resistance-20c';
const GEO = 'awg-geometry';
const SVC = 'nec-310-12';
const VOLTS = 'us-nominal-voltages';
const CALC = `calc:${ENGINE_ID}`;
const [, , C90] = AMPACITY_COLUMNS;
const COLD = TERMINATION_RULES.columnAtOrBelowLimit;
const WARM = TERMINATION_RULES.columnAboveLimit;

// the facts the copy states, checked when the page builds
const ANSWER_RATINGS = [15, 20, 30, 40, 50];
const R20 = { Cu: ratingRow('Cu', 20), Al: ratingRow('Al', 20) };
const R30 = { Cu: ratingRow('Cu', 30), Al: ratingRow('Al', 30) };
const R40 = { Cu: ratingRow('Cu', 40), Al: ratingRow('Al', 40) };
const R50 = { Cu: ratingRow('Cu', 50), Al: ratingRow('Al', 50) };
const R60 = { Cu: ratingRow('Cu', 60), Al: ratingRow('Al', 60) };
const R100 = { Cu: ratingRow('Cu', 100), Al: ratingRow('Al', 100) };
const B60 = R60.Cu.below60 as SizedAt;
const B100 = R100.Cu.below60 as SizedAt;
function plainLimit(size: SizeKey): number {
  const row = max240_4D(size, 'Cu');
  if (!row || row.conditions !== null) throw new Error(`wire size page: no plain 240.4(D) row for ${size} copper`);
  return row.max_ocpd_a;
}
const LIMIT_14 = plainLimit('14');
const LIMIT_12 = plainLimit(R20.Cu.c60.size);
const EGC_30_TO_60 = RATING_ROWS.Cu.filter((r) => r.ratingA >= 30 && r.ratingA <= 60);
const THHN_90 = COLUMN_TYPES[C90].includes('THHN');
const BUNDLE_PERCENT = adjustment('7–9');
const [TRACK_20, TRACK_30] = LENGTH_TRACKS;
if (!B60 || !B100 || R60.Cu.below75 !== null) throw new Error('wire size page: the 240.4(B) examples changed');
if (R30.Cu.c60.size !== R30.Cu.c75.size || R30.Al.c60.size !== R30.Al.c75.size) throw new Error('wire size page: 30 A differs by column');
if (R40.Cu.c60.size !== R40.Cu.c75.size) throw new Error('wire size page: 40 A copper differs by column');
if (new Set(EGC_30_TO_60.map((r) => r.egc)).size !== 1) throw new Error('wire size page: the 30–60 A ground wires differ');
if (!THHN_90) throw new Error('wire size page: Table 310.16 no longer lists THHN at 90 °C');
if (LONG_RUN.size === LONG_RUN.minSizeByAmpacity || !LONG_RUN.egcUpsized) throw new Error('wire size page: the long run no longer steps up');
if (BUNDLED.size === BUNDLED_PLAIN.size || BUNDLED.nextSizeUp !== null) throw new Error('wire size page: the bundling example changed');
if (TRACK_20.ratingA !== R20.Cu.ratingA || TRACK_30.ratingA !== R30.Cu.ratingA) throw new Error('wire size page: the chart circuits moved');
if (CONTINUOUS.minSizeByAmpacity !== R30.Cu.c60.size || CONTINUOUS_RATING_A !== R30.Cu.ratingA) throw new Error('wire size page: the continuous example changed');
if (LIMIT_12 !== R20.Cu.ratingA) throw new Error('wire size page: 12 AWG copper is no longer limited to 20 A');

const TOC: ([string, string] | [string, string, string])[] = [
  ['by-rating', 'Wire size by breaker rating'],
  ['distance', 'Wire size by distance'],
  ['continuous', 'Continuous loads'],
  ['heat-bundling', 'Heat and bundling'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Wire Size Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Wire Size Calculator', url: URL, description: DESCRIPTION };

/** "12 AWG copper (20 A at 60 °C)": a size the engine found, with its ampacity in a column. */
function SizeAmps({ s, column, metal }: { s: SizedAt; column: number; metal?: string }) {
  return (
    <>
      <Size s={s.size} />
      {metal ? ` ${metal}` : ''} (<Val v={s.amps} unit="A" src={AMP} /> at <Val v={column} unit="°C" src={AMP} />)
    </>
  );
}

function RatingTable({ material }: { material: Material }) {
  const rows: RatingRow[] = RATING_ROWS[material];
  const name = material === 'Cu' ? 'Copper' : 'Aluminum or copper-clad aluminum';
  return (
    <DataTable id={`by-rating-${material.toLowerCase()}`} variant="ruled" src={CALC} caption={name}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Breaker or fuse
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0 max-sm:!px-2')}>
            <Val v={COLD} unit="°C" src={TERM} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0 max-sm:!px-2')}>
            <Val v={WARM} unit="°C" src={TERM} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0 max-sm:!px-2')}>
            Ground wire
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.ratingA}>
            <th scope="row" className={clsx(RSTICKY_TD, '!font-normal')}>
              <Val v={r.ratingA} unit="A" src={OCPD} />
            </th>
            <td className={clsx(RTD, 'max-sm:!min-w-0 max-sm:!px-2')}>
              <Size s={r.c60.size} />
            </td>
            <td className={clsx(RTD, 'max-sm:!min-w-0 max-sm:!px-2')}>
              <Size s={r.c75.size} />
            </td>
            <td className={clsx(RTD, 'max-sm:!min-w-0 max-sm:!px-2')} data-src={EGC}>
              <Size s={r.egc} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function sizesIn(material: Material): SizeKey[] {
  return ANSWER_RATINGS.map((a) => ratingRow(material, a).c60.size);
}

export default function WireSizeCalculatorPage() {
  const answer = sizesIn('Cu');
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Wire Size Calculator" sub="AWG by Breaker Size, NEC Table 310.16" joiner=": " src={AMP} />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            The smallest copper or aluminum wire for a breaker or fuse, held to the terminals and 240.4(D), then sized up for the voltage drop
            over the run.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <WireSizeTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={CALC}>
            <strong>
              In NM cable, a <Val v={ANSWER_RATINGS[0]} unit="A" src={OCPD} /> breaker takes <Size s={answer[0]} /> copper,{' '}
              <Val v={ANSWER_RATINGS[1]} unit="A" src={OCPD} /> takes <Size s={answer[1]} />, <Val v={ANSWER_RATINGS[2]} unit="A" src={OCPD} /> takes{' '}
              <Size s={answer[2]} />, <Val v={ANSWER_RATINGS[3]} unit="A" src={OCPD} /> takes <Size s={answer[3]} /> and{' '}
              <Val v={ANSWER_RATINGS[4]} unit="A" src={OCPD} /> takes <Size s={answer[4]} />, from the <Val v={COLD} unit="°C" src={AMP} /> column of NEC
              Table 310.16.
            </strong>{' '}
            A long run needs more: at <Val v={100} unit="ft" src="input" />, a <Val v={20} unit="A" src="input" /> circuit at{' '}
            <Val v={120} unit="V" src="input" /> takes <Size s={LONG_RUN.size} /> to keep the drop within <Val v={3} unit="%" src="input" />.
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="by-rating" className="space-y-5">
            <h2 id="by-rating" className={H2}>
              Wire size by breaker rating
            </h2>
            <p className={P} data-src={TERM}>
              Under 110.14(C), the temperature column used may not exceed the rating of any connected termination, conductor or device. Equipment
              for circuits rated <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} /> or less, or with terminals marked for <Size s="14" /> through{' '}
              <Size s="1" />, is used at the <Val v={COLD} unit="°C" src={TERM} /> ampacity unless it is listed and identified for higher-rated
              conductors; above <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} />, at the <Val v={WARM} unit="°C" src={TERM} /> ampacity. The
              site also keeps NM and UF cable at <Val v={COLD} unit="°C" src={TERM} />. Each size below carries the full rating in its column and
              meets the 240.4(D) limits.
            </p>
            {/* min-w-0: a grid item may shrink below its table, which then scrolls in its own frame on a phone */}
            <div className="grid gap-8 md:grid-cols-2 md:gap-6 [&>*]:min-w-0">
              <RatingTable material="Cu" />
              <RatingTable material="Al" />
            </div>
            <SourceLine domains={[AMP, TERM, SMALL, OCPD, EGC]} />
            <p className={P} data-src={OCPD}>
              240.4(B) lets a breaker or fuse of up to <Val v={NEXT_SIZE_UP_MAX_A} unit="A" src={OCPD} /> protect a conductor whose ampacity falls
              between two standard ratings, at the next rating up, when the circuit does not supply more than one receptacle for
              cord-and-plug-connected portable loads. So a <Val v={R60.Cu.ratingA} unit="A" src={OCPD} /> breaker may protect{' '}
              <SizeAmps s={B60} column={COLD} metal="copper" /> instead of <Size s={R60.Cu.c60.size} />, and a{' '}
              <Val v={R100.Cu.ratingA} unit="A" src={OCPD} /> breaker <SizeAmps s={B100} column={COLD} metal="copper" /> instead of{' '}
              <Size s={R100.Cu.c60.size} />, as long as the load fits the smaller size. The calculator notes these cases under its result.
            </p>
            <p className={P} data-src={SVC}>
              A 120/240 V single-phase service, or a feeder, that carries the entire load of a one-family dwelling or of one dwelling unit is sized
              from Table 310.12 instead: see the{' '}
              <Link href="/calculators/service-entrance-calculator" className={LINK}>
                service entrance calculator
              </Link>{' '}
              and the{' '}
              <Link href="/guides/wire-size-for-200-amp" className={LINK}>
                200 amp guide
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="distance" className="space-y-5">
            <h2 id="distance" className={H2}>
              Wire size by distance
            </h2>
            <p className={P} data-src={CALC}>
              Voltage drop grows with the length and the current, so a long run can need a larger size than the rating alone. The calculator
              works out the drop at the load current, with resistance at <Val v={RESISTANCE_TEMP_C} unit="°C" src={CALC} />, and moves up one size
              at a time until the drop is within your target. The ground wire grows in proportion to the conductor area, as 250.122(B) requires.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    The smallest copper size in NM cable for each one-way length, with the circuit carrying its rating and the drop held to{' '}
                    <Val v={TRACK_20.targetPct} unit="%" src="input" />: a <Val v={TRACK_20.ratingA} unit="A" src="input" /> circuit at{' '}
                    <Val v={TRACK_20.volts} unit="V" src="input" /> and a <Val v={TRACK_30.ratingA} unit="A" src="input" /> circuit at{' '}
                    <Val v={TRACK_30.volts} unit="V" src="input" />, single-phase.
                  </span>
                  <SourceLine domains={[AMP, SMALL, RES]} />
                </>
              }
            >
              <LengthBandsChart />
            </Figure>
            <p className={P} data-src={CALC}>
              At <Val v={100} unit="ft" src="input" /> one way, the <Val v={20} unit="A" src="input" /> circuit at <Val v={120} unit="V" src="input" />{' '}
              would drop <Val v={LONG_RUN_AT_12.vdPct} unit="%" src={CALC} format={{ fixed: 2 }} /> on <Size s={LONG_RUN.minSizeByAmpacity} />;{' '}
              <Size s={LONG_RUN.size} /> brings it to <Val v={LONG_RUN.vdPct} unit="%" src={CALC} format={{ fixed: 2 }} />, and the ground wire goes
              from <Size s={R20.Cu.egc} /> to <Size s={LONG_RUN.egc as SizeKey} />.
            </p>
            <p className={P} data-src={CONT}>
              The target is yours. An informational note in the 2023 NEC (215.2(A)) ties a feeder drop of up to{' '}
              <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={CONT} />, and <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={CONT} /> for feeder and
              branch circuit together, to reasonable efficiency: advice, not a rule. The{' '}
              <Link href="/calculators/voltage-drop-calculator" className={LINK}>
                voltage drop calculator
              </Link>{' '}
              works out the drop for a size you already have.
            </p>
          </section>

          <section aria-labelledby="continuous" className="space-y-4">
            <h2 id="continuous" className={H2}>
              Continuous loads
            </h2>
            <p className={P} data-src={CONT}>
              NEC 210.20(A) asks that the breaker or fuse be rated at least the noncontinuous load plus{' '}
              <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={CONT} /> of the continuous load, and 210.19(A) asks the same of the conductors&apos;
              ampacity.{' '}
              <span data-src={CALC}>
                A continuous load of <Val v={CONTINUOUS_LOAD_A} unit="A" src="input" /> needs at least{' '}
                <Val v={CONTINUOUS_NEEDED_A} unit="A" src={CALC} />: a <Val v={CONTINUOUS_RATING_A} unit="A" src={OCPD} /> breaker on{' '}
                <Size s={CONTINUOUS.size} /> copper.
              </span>{' '}
              Enter the load and set Continuous load to Yes, and the calculator checks the rating against it.
            </p>
          </section>

          <section aria-labelledby="heat-bundling" className="space-y-4">
            <h2 id="heat-bundling" className={H2}>
              Heat and bundling
            </h2>
            <p className={P} data-src={COR}>
              Table 310.16 assumes <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} /> (<Val v={TABLE_AMBIENT.f} unit="°F" src={AMP} />) and no more than
              three current-carrying conductors together. Enter a different ambient or more conductors, and the calculator corrects the ampacity by
              the factors of Tables 310.15(B)(1)(1) and 310.15(C)(1): from the <Val v={C90} unit="°C" src={AMP} /> column for single conductors, which
              it takes as rated <Val v={C90} unit="°C" src={AMP} />, like THHN, and from the <Val v={COLD} unit="°C" src={TERM} /> column for cable. It
              then holds the result to the size&apos;s value in the terminal column.
            </p>
            <p className={P} data-src={CALC}>
              On a <Val v={50} unit="A" src="input" /> circuit with <Val v={WARM} unit="°C" src="input" /> terminals, <Size s={BUNDLED_PLAIN.size} />{' '}
              copper carries <Val v={BUNDLED_PLAIN.minAmpacity} unit="A" src={AMP} />. With seven to nine current-carrying conductors in the
              raceway, it keeps <Val v={BUNDLE_PERCENT} unit="%" src={COR} /> of its <Val v={C90} unit="°C" src={AMP} /> value of{' '}
              <Val v={table31016(BUNDLED_PLAIN.size, 'cu_90') as number} unit="A" src={AMP} />, or <Val v={BUNDLED_8_A} unit="A" src={CALC} format={{ upTo: 1 }} />,
              so the calculator moves to <Size s={BUNDLED.size} />: <Val v={BUNDLED.minAmpacity} unit="A" src={CALC} format={{ upTo: 1 }} />.
            </p>
            <p className={P} data-src={TERM}>
              The site keeps NM and UF cable at <Val v={COLD} unit="°C" src={TERM} />, corrections included, so a hot attic can call for a larger
              cable than single conductors would need. The{' '}
              <Link href="/calculators/ampacity-calculator" className={LINK}>
                ampacity calculator
              </Link>{' '}
              shows each correction for one size.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src="input">
                What size wire for a <Val v={20} unit="A" src="input" /> breaker?
              </h3>
              <p className={P} data-src={CALC}>
                <Size s={R20.Cu.c60.size} /> copper, or <Size s={R20.Al.c60.size} /> aluminum. <Size s={R20.Cu.c60.size} /> copper carries{' '}
                <Val v={R20.Cu.c60.amps} unit="A" src={AMP} /> in the <Val v={COLD} unit="°C" src={AMP} /> column, and 240.4(D) allows it a breaker of up
                to <Val v={LIMIT_12} unit="A" src={SMALL} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src="input">
                What size wire for a <Val v={30} unit="A" src="input" /> breaker?
              </h3>
              <p className={P} data-src={CALC}>
                <Size s={R30.Cu.c60.size} /> copper or <Size s={R30.Al.c60.size} /> aluminum, in both the <Val v={COLD} unit="°C" src={TERM} /> and the{' '}
                <Val v={WARM} unit="°C" src={TERM} /> column.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src="input">
                What size wire for a <Val v={40} unit="A" src="input" /> breaker?
              </h3>
              <p className={P} data-src={CALC}>
                <Size s={R40.Cu.c60.size} /> copper in either column. Aluminum takes <Size s={R40.Al.c60.size} /> at <Val v={COLD} unit="°C" src={TERM} />{' '}
                and <Size s={R40.Al.c75.size} /> at <Val v={WARM} unit="°C" src={TERM} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src="input">
                What size wire for a <Val v={50} unit="A" src="input" /> breaker?
              </h3>
              <p className={P} data-src={CALC}>
                In NM cable, <SizeAmps s={R50.Cu.c60} column={COLD} metal="copper" />; on <Val v={WARM} unit="°C" src={TERM} /> terminals,{' '}
                <SizeAmps s={R50.Cu.c75} column={WARM} metal="copper" />. Aluminum takes <Size s={R50.Al.c60.size} /> and <Size s={R50.Al.c75.size} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src="input">
                What size wire for a <Val v={60} unit="A" src="input" /> breaker?
              </h3>
              <p className={P} data-src={CALC}>
                On <Val v={WARM} unit="°C" src={TERM} /> terminals, <SizeAmps s={R60.Cu.c75} column={WARM} metal="copper" />. In NM cable,{' '}
                <SizeAmps s={R60.Cu.c60} column={COLD} metal="copper" /> carries the full rating;{' '}
                <span data-src={OCPD}>
                  240.4(B) also allows <SizeAmps s={B60} column={COLD} /> when the load is at most <Val v={B60.amps} unit="A" src={CALC} /> and the
                  circuit does not supply more than one receptacle for cord-and-plug-connected portable loads.
                </span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src="input">
                What size wire for a <Val v={100} unit="A" src="input" /> breaker?
              </h3>
              <p className={P} data-src={CALC}>
                On <Val v={WARM} unit="°C" src={TERM} /> terminals, <Size s={R100.Cu.c75.size} /> copper or <Size s={R100.Al.c75.size} /> aluminum. In the{' '}
                <Val v={COLD} unit="°C" src={TERM} /> column, copper takes <Size s={R100.Cu.c60.size} /> and aluminum <Size s={R100.Al.c60.size} />, and
                240.4(B) also allows <SizeAmps s={B100} column={COLD} metal="copper" />. For a dwelling service, Table 310.12 applies instead: see the{' '}
                <Link href="/calculators/service-entrance-calculator" className={LINK}>
                  service entrance calculator
                </Link>
                .
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-size="14">
                Can I use <Size s="14" /> wire on a <Val v={20} unit="A" src="input" /> circuit?
              </h3>
              <p className={P} data-src={SMALL}>
                No. 240.4(D) limits <Size s="14" /> copper to a <Val v={LIMIT_14} unit="A" src={SMALL} /> breaker or fuse, although Table
                310.16 lists it at <Val v={table31016('14', 'cu_75') as number} unit="A" src={AMP} /> in the <Val v={WARM} unit="°C" src={AMP} /> column.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What size ground wire do I need?</h3>
              <p className={P} data-src={EGC}>
                Table 250.122 sizes it by the breaker or fuse rating: <Size s={R20.Cu.egc} /> copper for <Val v={20} unit="A" src={EGC} />,{' '}
                <Size s={EGC_30_TO_60[0].egc} /> from <Val v={30} unit="A" src={EGC} /> to <Val v={60} unit="A" src={EGC} /> and <Size s={R100.Cu.egc} /> for{' '}
                <Val v={100} unit="A" src={EGC} />. When the conductors grow for voltage drop, it grows in proportion. The{' '}
                <Link href="/calculators/ground-wire-calculator" className={LINK}>
                  ground wire calculator
                </Link>{' '}
                covers every rating.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, COR, TERM, CONT, SMALL, OCPD, EGC, SVC, RES, GEO, VOLTS]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#wire-size-method" className={LINK}>
                methodology page
              </Link>{' '}
              sets out each step and each source. NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the National Fire
              Protection Association; wiresizes.com is not affiliated with or endorsed by NFPA.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
