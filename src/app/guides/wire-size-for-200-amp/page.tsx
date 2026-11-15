import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { Byline } from '@/components/content/Byline';
import { DataTable, RSTICKY_TD, RSTICKY_TH, RTD, RTH } from '@/components/content/DataTable';
import { Figure } from '@/components/content/Figure';
import { Size } from '@/components/content/Size';
import { SourceLine } from '@/components/content/SourceLine';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { Service200Ladder, ServiceDropChart, ServiceGroundDiscs } from '@/components/look/Charts';
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
import { SERVICE_VOLTS } from '@/lib/calculations/service-lookup';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import { GUIDE_200, RATING_ROWS } from '@/lib/service-guides';
import type { RatingRow } from '@/lib/service-guides';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { NEXT_SIZE_UP_MAX_A } from '@/lib/verified/nec-240-4-d';
import { TABLE_AMBIENT } from '@/lib/verified/nec-310-16';
import { SERVICE_AMPACITY_PERCENT } from '@/lib/verified/nec-310-12';
import { CONTINUOUS_LOAD_PERCENT, VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';

// /guides/wire-size-for-200-amp (WSZ-008c; spec: research/page-specs-held.md "WSZ-008"; data gate BUILD): the conductor
// size for a 200 A, 120/240 V dwelling service and why it is smaller than any other 200 A feeder's. Table 310.12
// (nec-310-12) against Table 310.16 at the column 110.14(C)(1)(b) sets above 100 A (nec-310-16, nec-110-14c); 240.4(B)
// for 4/0 AWG aluminum on a 200 A breaker (nec-240-ocpd) with the feeder load rule of 215.2(A) (nec-continuous-load);
// the electrode conductor (Table 250.66) and a feeder's equipment grounding conductor (Table 250.122), NFPA's 2020 fact
// sheet (nec-250-grounding); the voltage drop at 75 °C (conductor-resistance-20c) beside the 215.2(A) note. Every value
// comes from src/lib/service-guides.ts. Nothing from nec-misc-installation (candidate): no utility-side or burial
// claims. The 310.12 scope is worded as D-39 sets it.
const ROUTE = '/guides/wire-size-for-200-amp';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Wire Size for 200 Amp Service: 2/0 Copper or 4/0 Aluminum';
const DESCRIPTION =
  'A 200 A dwelling service takes 2/0 AWG copper or 4/0 AWG aluminum (NEC Table 310.12); another 200 A feeder takes 3/0 copper or 250 kcmil aluminum.';

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

const SVC = 'nec-310-12';
const AMP = 'nec-310-16';
const TERM = 'nec-110-14c';
const OCPD = 'nec-240-ocpd';
const LOAD = 'nec-continuous-load';
const GND = 'nec-250-grounding';
const RES = 'conductor-resistance-20c';
const GEO = 'awg-geometry';
const SVC_CALC = 'calc:service-lookup';
const VD = 'calc:voltage-drop';

const G = GUIDE_200;
const { cu: CU, al: AL, egc: EGC, service: S } = G;
const GEC = S.gecForCuService;
const D100 = G.drop100;
const D175 = G.drop175;
if (!AL.protection.nextSizeUp || CU.protection.nextSizeUp) throw new Error('200 A guide: the 240.4(B) paragraph no longer fits the data');
const FIRST = RATING_ROWS[0];
const LAST = RATING_ROWS[RATING_ROWS.length - 1];

const TOC: ([string, string] | [string, string, string])[] = [
  ['two-tables', 'Why a service takes smaller wire'],
  ['which-table', 'Which table applies'],
  ['subpanel', `A ${G.ratingA} A subpanel feeder`, SVC],
  ['ground-wires', 'Ground wires'],
  ['voltage-drop', 'Voltage drop on a long run'],
  ['ratings', 'Other ratings'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Wire Size for 200 Amp Service', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

function Pair({ cu, al }: { cu: string; al: string }) {
  return (
    <>
      <Size s={cu} /> copper or <Size s={al} /> aluminum
    </>
  );
}
function Drop({ volts, pct }: { volts: number; pct: number }) {
  return (
    <>
      <Val v={volts} unit="V" src={VD} format={{ fixed: 2 }} /> (<Val v={pct} unit="%" src={VD} format={{ fixed: 2 }} />)
    </>
  );
}

/** A ratings table: the Table 310.12 size beside the Table 310.16 size and its ampacity, for one material. */
function RatingsTable({ material }: { material: 'cu' | 'al' }) {
  const name = material === 'cu' ? 'Copper' : 'Aluminum';
  return (
    <DataTable
      id={`ratings-${material}`}
      variant="ruled"
      src={AMP}
      caption={`${name}: Table 310.12 for a dwelling service, Table 310.16 at ${G.column} °C for another feeder`}
    >
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Rating
          </th>
          <th scope="col" className={RTH}>
            Dwelling
          </th>
          <th scope="col" className={RTH}>
            Other feeder
          </th>
        </tr>
      </thead>
      <tbody>
        {RATING_ROWS.map((r: RatingRow) => (
          <tr key={r.ratingA}>
            <th scope="row" className={RSTICKY_TD}>
              <Val v={r.ratingA} unit="A" src={SVC} />
            </th>
            <td className={RTD} data-src={SVC}>
              <Size s={r.dwelling[material]} />
            </td>
            <td className={RTD}>
              <Size s={r.feeder[material].size} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function WireSizeFor200AmpPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Wire Size for 200 Amp Service" sub="2/0 Copper or 4/0 Aluminum" joiner=": " src={SVC} />
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
          <div className="space-y-4">
            <p className={LOOK_LEAD} data-src={SVC}>
              <strong>
                A <Val v={G.ratingA} unit="A" src={SVC} />, 120/240 V service for one dwelling takes <Pair cu={S.cu} al={S.alCca} />{' '}
                conductors, from NEC Table 310.12.
              </strong>{' '}
              <span data-src={GND}>
                Its grounding electrode conductor is <Pair cu={GEC.cu} al={GEC.alCca} /> (Table 250.66).
              </span>
            </p>
            <p className={P} data-src={AMP}>
              Any other <Val v={G.ratingA} unit="A" src={SVC} /> feeder, such as one to a subpanel, is sized from Table 310.16 instead and
              takes <Pair cu={CU.feeder} al={AL.feeder} />, with a <Pair cu={EGC.table.cu} al={EGC.table.alCca} /> equipment grounding
              conductor.
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={AMP}>
                  The ampacity at <Val v={G.column} unit="°C" src={TERM} /> of the sizes around a <Val v={G.ratingA} unit="A" src={SVC} />{' '}
                  service. Table 310.12 lets a dwelling service use conductors with an ampacity of at least{' '}
                  <Val v={SERVICE_AMPACITY_PERCENT} unit="%" src={SVC} /> of the rating, <Val v={G.minA} unit="A" src={SVC_CALC} />; sized
                  from Table 310.16, any other feeder takes a size that reaches the full <Val v={G.ratingA} unit="A" src={SVC} />.
                </span>
                <SourceLine domains={[AMP, SVC, TERM]} />
              </>
            }
          >
            <Service200Ladder />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="two-tables" className="space-y-5">
            <h2 id="two-tables" className={H2}>
              Why a service takes smaller wire
            </h2>
            <p className={P} data-src={SVC}>
              Section 310.12 lets the conductors of a dwelling service have an ampacity of not less than{' '}
              <Val v={SERVICE_AMPACITY_PERCENT} unit="%" src={SVC} /> of the service rating, and Table 310.12 lists the sizes that meet it.
              For <Val v={G.ratingA} unit="A" src={SVC} /> that is <Val v={G.minA} unit="A" src={SVC_CALC} />.{' '}
              <span data-src={AMP}>
                In Table 310.16, <Size s={CU.dwelling} /> copper carries <Val v={CU.dwellingA} unit="A" src={AMP} /> and <Size s={AL.dwelling} />{' '}
                aluminum <Val v={AL.dwellingA} unit="A" src={AMP} /> at <Val v={G.column} unit="°C" src={TERM} />: both reach{' '}
                <Val v={G.minA} unit="A" src={SVC_CALC} />, neither reaches <Val v={G.ratingA} unit="A" src={SVC} />.
              </span>
            </p>
            <p className={P} data-src={AMP}>
              Sized from Table 310.16, a feeder on a <Val v={G.ratingA} unit="A" src={SVC} /> breaker takes the smallest size whose ampacity
              reaches <Val v={G.ratingA} unit="A" src={SVC} />, one size up from each: <Size s={CU.feeder} /> copper at{' '}
              <Val v={CU.feederA} unit="A" src={AMP} /> or <Size s={AL.feeder} /> aluminum at <Val v={AL.feederA} unit="A" src={AMP} />. One
              allowance for aluminum is under{' '}
              <a href="#subpanel" className={LINK}>
                the subpanel feeder
              </a>
              .
            </p>
            <DataTable id="two-tables-200" variant="ruled" src={AMP} caption={`The conductors for ${G.ratingA} A from each table`}>
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Use
                  </th>
                  <th scope="col" className={RTH}>
                    Copper
                  </th>
                  <th scope="col" className={RTH}>
                    Aluminum
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, 'whitespace-normal font-display font-normal')} data-src={SVC}>
                    Dwelling service, Table 310.12
                  </th>
                  <td className={RTD}>
                    <Size s={CU.dwelling} />
                  </td>
                  <td className={RTD}>
                    <Size s={AL.dwelling} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, 'whitespace-normal font-display font-normal')} data-src={AMP}>
                    Other feeder, Table 310.16
                  </th>
                  <td className={RTD}>
                    <Size s={CU.feeder} />
                  </td>
                  <td className={RTD}>
                    <Size s={AL.feeder} />
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section aria-labelledby="which-table" className="space-y-4">
            <h2 id="which-table" className={H2}>
              Which table applies
            </h2>
            <p className={P} data-src={SVC}>
              Table 310.12 is for a 120/240 V single-phase service, or a feeder, that carries the entire load of a one-family dwelling or of
              one dwelling unit in a two-family or multifamily building. A feeder that carries part of the
              load, and every other service or feeder, is sized from Table 310.16.
            </p>
            <p className={P} data-src={TERM}>
              Which column of Table 310.16 depends on the terminals. Under 110.14(C), the temperature rating used may not exceed that of any
              termination, conductor or device. The terminals of equipment for circuits rated over{' '}
              <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} /> are used with <Val v={G.column} unit="°C" src={TERM} /> conductors, or
              with higher-rated ones at no more than their <Val v={G.column} unit="°C" src={TERM} /> ampacity unless the equipment is listed
              and identified for more (110.14(C)(1)(b)). That is the column of the <Val v={CU.feederA} unit="A" src={AMP} /> and{' '}
              <Val v={AL.feederA} unit="A" src={AMP} /> above.
            </p>
            <p className={P} data-src={SVC}>
              Both tables assume no corrections. Where the ambient temperature is above{' '}
              <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} />, or more than three current-carrying conductors share a raceway or cable, the
              factors of Tables 310.15(B)(1)(1) and 310.15(C)(1) apply, and a dwelling service&apos;s corrected ampacity must still reach{' '}
              <Val v={SERVICE_AMPACITY_PERCENT} unit="%" src={SVC} /> of the rating.
            </p>
          </section>

          <section aria-labelledby="subpanel" className="space-y-4">
            <h2 id="subpanel" className={H2} data-src={SVC}>
              A <Val v={G.ratingA} unit="A" src={SVC} /> subpanel feeder
            </h2>
            <p className={P} data-src={AMP}>
              A feeder to a subpanel carries part of the load, so Table 310.16 sizes it: <Pair cu={CU.feeder} al={AL.feeder} /> on a{' '}
              <Val v={G.ratingA} unit="A" src={SVC} /> breaker.
            </p>
            <p className={P} data-src={OCPD}>
              <Size s={AL.dwelling} /> aluminum is the exception you will meet most. Its <Val v={AL.dwellingA} unit="A" src={AMP} /> is not a
              standard rating in Table 240.6(A), and 240.4(B) lets the next higher standard rating protect a conductor in that case, up to{' '}
              <Val v={NEXT_SIZE_UP_MAX_A} unit="A" src={OCPD} />, so a <Val v={AL.protection.ratingA} unit="A" src={OCPD} /> breaker may
              protect it.{' '}
              <span data-src={LOAD}>
                The feeder&apos;s calculated load must still fit its <Val v={AL.dwellingA} unit="A" src={AMP} />, under 215.2(A), with continuous
                loads counted at <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={LOAD} />.
              </span>{' '}
              <Size s={CU.dwelling} /> copper gets no such allowance: its <Val v={CU.dwellingA} unit="A" src={AMP} /> is a standard rating, so
              its largest breaker is <Val v={CU.protection.ratingA} unit="A" src={OCPD} />.
            </p>
          </section>

          <section aria-labelledby="ground-wires" className="space-y-5">
            <h2 id="ground-wires" className={H2}>
              Ground wires
            </h2>
            <p className={P} data-src={GND}>
              A service has a grounding electrode conductor, which connects it to the ground rod or other electrode. Table 250.66 sizes it by
              the largest service conductor: <Pair cu={GEC.cu} al={GEC.alCca} /> for <Size s={S.cu} /> copper or <Size s={S.alCca} /> aluminum
              service conductors. The values are those of NFPA&apos;s 2020 grounding fact sheet.
            </p>
            <p className={P} data-src={GND}>
              A feeder carries an equipment grounding conductor instead, sized by its breaker in Table 250.122:{' '}
              <Pair cu={EGC.table.cu} al={EGC.table.alCca} /> for <Val v={EGC.ocpdA} unit="A" src={GND} />. The{' '}
              <Link href="/calculators/ground-wire-calculator" className={LINK}>
                ground wire calculator
              </Link>{' '}
              finds both for any rating.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={GND}>
                    A <Val v={G.ratingA} unit="A" src={SVC} /> dwelling service&apos;s <Size s={S.cu} /> copper conductor (Table 310.12), its{' '}
                    <Size s={GEC.cu} /> copper electrode conductor (Table 250.66), and the <Size s={EGC.table.cu} /> copper equipment grounding
                    conductor of a <Val v={EGC.ocpdA} unit="A" src={GND} /> feeder (Table 250.122), drawn to one scale as solid conductors.
                  </span>
                  <SourceLine domains={[SVC, GND, GEO]} />
                </>
              }
            >
              <ServiceGroundDiscs />
            </Figure>
          </section>

          <section aria-labelledby="voltage-drop" className="space-y-5">
            <h2 id="voltage-drop" className={H2}>
              Voltage drop on a long run
            </h2>
            <p className={P} data-src={VD}>
              The tables size a service for its current, not for its length. At the full <Val v={G.ratingA} unit="A" src={SVC} />,{' '}
              <Val v={D100.cu.lengthFt} unit="ft" src={VD} /> of <Size s={S.cu} /> copper drops{' '}
              <Drop volts={D100.cu.result.vdVolts} pct={D100.cu.result.vdPct} /> of <Val v={SERVICE_VOLTS} unit="V" src={SVC} />, and{' '}
              <Size s={S.alCca} /> aluminum <Drop volts={D100.al.result.vdVolts} pct={D100.al.result.vdPct} />, with the conductors at{' '}
              <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} />.
            </p>
            <p className={P} data-src={LOAD}>
              For feeders, an informational note to 215.2(A) says that conductors sized to keep the drop at the farthest outlet under{' '}
              <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />, with no more than{' '}
              <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={LOAD} /> on feeder and branch circuits together, will provide reasonable
              efficiency. It is advice, not a limit.{' '}
              <span data-src={VD}>
                At the full rating, <Size s={S.cu} /> copper reaches <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> at{' '}
                <Val v={G.noteFt.cu} unit="ft" src={VD} format={{ sig: 3 }} /> and <Size s={S.alCca} /> aluminum at{' '}
                <Val v={G.noteFt.al} unit="ft" src={VD} format={{ sig: 3 }} />.
              </span>
            </p>
            <Figure
              caption={
                <>
                  <span data-src={VD}>
                    Voltage drop of a <Val v={G.ratingA} unit="A" src={SVC} /> dwelling service at full load, single-phase at{' '}
                    <Val v={SERVICE_VOLTS} unit="V" src={SVC} />, against the one-way length of its Table 310.12 conductors, with the 215.2(A)
                    note&apos;s <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />.
                  </span>
                  <SourceLine domains={[SVC, RES, LOAD]} />
                </>
              }
            >
              <ServiceDropChart note />
            </Figure>
            <p className={P} data-src={VD}>
              The drop falls in proportion to the current, so a smaller load drops less. The{' '}
              <Link href="/calculators/service-entrance-calculator" className={LINK}>
                service entrance calculator
              </Link>{' '}
              takes your length and load.
            </p>
          </section>

          <section aria-labelledby="ratings" className="space-y-5">
            <h2 id="ratings" className={H2}>
              Other ratings
            </h2>
            <p className={P} data-src={AMP}>
              The same comparison for each rating of Table 310.12 above <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} />, from{' '}
              <Val v={FIRST.ratingA} unit="A" src={SVC} /> to <Val v={LAST.ratingA} unit="A" src={SVC} />. The other-feeder column is the
              smallest size whose <Val v={G.column} unit="°C" src={TERM} /> ampacity reaches the rating, without the 240.4(B) allowance.
            </p>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <RatingsTable material="cu" />
              <RatingsTable material="al" />
            </div>
            <p className={P} data-src={TERM}>
              At <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} /> and below, 110.14(C)(1)(a) starts from the{' '}
              <Val v={TERMINATION_RULES.columnAtOrBelowLimit} unit="°C" src={TERM} /> column unless every termination is listed and identified
              for <Val v={G.column} unit="°C" src={TERM} /> conductors, so that rating is left out here.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SVC}>
                What size wire for a <Val v={G.ratingA} unit="A" src={SVC} /> service?
              </h3>
              <p className={P} data-src={SVC}>
                <Pair cu={S.cu} al={S.alCca} /> for a 120/240 V dwelling service, from Table 310.12.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SVC}>
                What size ground wire for a <Val v={G.ratingA} unit="A" src={SVC} /> service?
              </h3>
              <p className={P} data-src={GND}>
                The grounding electrode conductor is <Pair cu={GEC.cu} al={GEC.alCca} /> (Table 250.66). A{' '}
                <Val v={EGC.ocpdA} unit="A" src={GND} /> feeder&apos;s equipment grounding conductor is{' '}
                <Pair cu={EGC.table.cu} al={EGC.table.alCca} /> (Table 250.122).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SVC}>
                Copper or aluminum for <Val v={G.ratingA} unit="A" src={SVC} />?
              </h3>
              <p className={P} data-src={SVC}>
                Table 310.12 allows either: <Size s={S.cu} /> copper or <Size s={S.alCca} /> aluminum, two sizes larger.{' '}
                <span data-src={VD}>
                  The two have nearly the same resistance, so over <Val v={D100.cu.lengthFt} unit="ft" src={VD} /> they drop{' '}
                  <Val v={D100.cu.result.vdPct} unit="%" src={VD} format={{ fixed: 2 }} /> and{' '}
                  <Val v={D100.al.result.vdPct} unit="%" src={VD} format={{ fixed: 2 }} />.
                </span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SVC}>
                What size wire for a <Val v={G.ratingA} unit="A" src={SVC} /> subpanel?
              </h3>
              <p className={P} data-src={AMP}>
                <Pair cu={CU.feeder} al={AL.feeder} />, from the <Val v={G.column} unit="°C" src={TERM} /> column of Table 310.16, with a{' '}
                <Pair cu={EGC.table.cu} al={EGC.table.alCca} /> ground wire. <Size s={AL.dwelling} /> aluminum may sit on a{' '}
                <Val v={AL.protection.ratingA} unit="A" src={OCPD} /> breaker under 240.4(B) if the load is no more than{' '}
                <Val v={AL.dwellingA} unit="A" src={AMP} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={VD}>
                How much voltage drop on <Val v={D175.cu.lengthFt} unit="ft" src={VD} /> of{' '}
                <Val v={G.ratingA} unit="A" src={SVC} /> service wire?
              </h3>
              <p className={P} data-src={VD}>
                At the full <Val v={G.ratingA} unit="A" src={SVC} />: <Drop volts={D175.cu.result.vdVolts} pct={D175.cu.result.vdPct} /> on{' '}
                <Size s={S.cu} /> copper and <Drop volts={D175.al.result.vdVolts} pct={D175.al.result.vdPct} /> on <Size s={S.alCca} />{' '}
                aluminum.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[SVC, AMP, TERM, OCPD, LOAD, GND, RES, GEO]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#service-conductors" className={LINK}>
                methodology page
              </Link>{' '}
              describes each source and how the values are found. NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the
              National Fire Protection Association; wiresizes.com is not affiliated with or endorsed by NFPA.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
