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
import { DropText, LadderTable, LengthTable, Pair, Pct } from '@/components/look/AmpParts';
import { AmpDropChart, AmpLadder } from '@/components/look/Charts';
import type { AmpDropLine } from '@/components/look/Charts';
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
import { AMP_VOLTS, DROP_50_LENGTHS, wireSizeLink } from '@/lib/amp-guide';
import type { AmpGuide } from '@/lib/amp-guide';
import { GUIDE_125, LOW_VOLTS } from '@/lib/amp-guides';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { NEXT_SIZE_UP_MAX_A } from '@/lib/verified/nec-240-4-d';
import { SERVICE_AMPACITY_PERCENT } from '@/lib/verified/nec-310-12';
import { VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { TABLE_AMBIENT } from '@/lib/verified/nec-310-16';

// /guides/wire-size-for-125-amp (WSZ-042; research/kw: primary "wire size for 125 amp"): a 125 A dwelling service from
// Table 310.12 (nec-310-12, scope worded as D-39 sets it) beside a 125 A feeder at the 75 °C column 110.14(C)(1)(b) sets
// above 100 A (nec-310-16, nec-110-14c); the service sizes coming back on a feeder under 240.4(B) with the load they may
// carry (nec-240-ocpd, nec-continuous-load); the ground wires, Table 250.122 and Table 250.66 (nec-250-grounding); a
// feeder to a separate building (nec-250-32, nec-feeders-outbuildings); the voltage drop at 240 V
// (conductor-resistance-20c). Every value from src/lib/amp-guides.ts. Never 230.79 or a cable type's availability.
const ROUTE = '/guides/wire-size-for-125-amp';
const URL = `https://wiresizes.com${ROUTE}`;

const G = GUIDE_125;
const { service: S, feeder: F, run: RUN } = G;
function must<T>(v: T | null, what: string): T {
  if (v === null) throw new Error(`125 A guide: ${what} is gone`);
  return v;
}
const FB = must(F.cu.below, 'the copper 240.4(B) size');
const FBA = must(F.al.below, 'the aluminum 240.4(B) size');
const GEC = S.gecForCuService;

/** The chart's guide: the feeder sizes in both columns' places, and the service-to-feeder ladder. */
const CHART: AmpGuide = { ratingA: G.ratingA, low: G.low, high: G.high, nm: F, c75: F, egc: G.egc, ladder: G.ladder };

const TITLE = `Wire Size for ${G.ratingA} Amp Service or Subpanel: ${S.cu} or ${F.cu.size} AWG Copper`;
const DESCRIPTION =
  `A ${G.ratingA} A dwelling service takes ${S.cu} AWG copper or ${S.alCca} AWG aluminum (Table 310.12). A ${G.ratingA} A feeder to a subpanel ` +
  `takes ${F.cu.size} AWG copper or ${F.al.size} AWG aluminum at ${G.high} °C, or the service sizes when its load fits them.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'article', locale: 'en_US', siteName: 'WireSizes.com', title: TITLE, description: DESCRIPTION, url: URL, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/twitter-image'] },
};

const SVC = 'nec-310-12';
const SVC_CALC = 'calc:service-lookup';
const AMP = 'nec-310-16';
const TERM = 'nec-110-14c';
const OCPD = 'nec-240-ocpd';
const LOAD = 'nec-continuous-load';
const GND = 'nec-250-grounding';
const SEP = 'nec-250-32';
const OUTB = 'nec-feeders-outbuildings';
const RES = 'conductor-resistance-20c';
const VD = 'calc:voltage-drop';

const TOC: ([string, string] | [string, string, string])[] = [
  ['which-table', 'Service or feeder: which table', SVC],
  ['smaller', 'The service sizes on a feeder, under 240.4(B)', OCPD],
  ['ground', `Ground wires at ${G.ratingA} A`, GND],
  ['detached', `A ${G.ratingA} A subpanel in a detached building`, SEP],
  ['distance', `${G.ratingA} A over a long run`, VD],
  ['ampacities', `Ampacity of the sizes around ${G.ratingA} A`, AMP],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: `Wire Size for ${G.ratingA} Amp Service or Subpanel`, description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

function A({ v, src = OCPD }: { v: number; src?: string }) {
  return <Val v={v} unit="A" src={src} />;
}
function C({ v }: { v: number }) {
  return <Val v={v} unit="°C" src={TERM} />;
}

const DROP_LINES: AmpDropLine[] = [
  { key: 'cu-feeder', material: 'Cu', size: F.cu.size, column: G.high, dashed: false, label: <><Size s={F.cu.size} svg /> copper, feeder</>, words: `${F.cu.size} AWG copper, feeder` },
  { key: 'al-feeder', material: 'Al', size: F.al.size, column: G.high, dashed: false, label: <><Size s={F.al.size} svg /> aluminum, feeder</>, words: `${F.al.size} AWG aluminum, feeder` },
  { key: 'cu-svc', material: 'Cu', size: S.cu, column: G.high, dashed: true, label: <><Size s={S.cu} svg /> copper, service</>, words: `${S.cu} AWG copper, service` },
  { key: 'al-svc', material: 'Al', size: S.alCca, column: G.high, dashed: true, label: <><Size s={S.alCca} svg /> aluminum, service</>, words: `${S.alCca} AWG aluminum, service` },
];

export default function WireSizeFor125AmpPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main={`Wire Size for ${G.ratingA} Amp Service or Subpanel`} sub={`${S.cu} or ${F.cu.size} AWG Copper`} joiner=": " src={AMP} />
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
          <div className="space-y-4">
            <p className={LOOK_LEAD} data-src={SVC}>
              <strong>
                A <A v={G.ratingA} /> dwelling service takes <Pair cu={S.cu} al={S.alCca} />, from NEC Table 310.12.
              </strong>{' '}
              <span data-src={AMP}>
                A <A v={G.ratingA} /> feeder to a subpanel takes <Pair cu={F.cu.size} al={F.al.size} />, from the <C v={G.high} /> column of Table
                310.16, which 110.14(C)(1)(b) sets above <A v={TERMINATION_RULES.limitA} src={TERM} />.
              </span>
            </p>
            <p className={P} data-src={GND}>
              The feeder&apos;s ground wire is <Pair cu={G.egc.cu} al={G.egc.al} /> (Table 250.122); a service with <Size s={S.cu} /> copper takes a{' '}
              <Size s={GEC.cu} /> copper grounding electrode conductor (Table 250.66).
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={AMP}>
                  The ampacity of the sizes around <A v={G.ratingA} /> in the <C v={G.low} /> column (open dots) and the <C v={G.high} /> column
                  (filled). A feeder needs a size that reaches <A v={G.ratingA} /> at <C v={G.high} />.{' '}
                </span>
                <span data-src={SVC}>
                  In the shaded band, from <Val v={SERVICE_AMPACITY_PERCENT} unit="%" src={SVC} /> of the rating (
                  <A v={G.minA} src={SVC_CALC} />) up, a dwelling service may stop under Table 310.12.
                </span>
                <SourceLine domains={[AMP, TERM, SVC]} />
              </>
            }
          >
            <AmpLadder
              guide={CHART}
              opts={{
                band: { fromA: G.minA },
                picks: { cu: [S.cu, F.cu.size], al: [S.alCca, F.al.size] },
                legend: [
                  <>
                    <Val v={G.low} unit="°C" src={AMP} svg /> column
                  </>,
                  <>
                    <Val v={G.high} unit="°C" src={AMP} svg /> column, the one above <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} svg />
                  </>,
                ],
                answer: `A ${G.ratingA} A feeder takes ${F.cu.size} AWG copper or ${F.al.size} AWG aluminum at ${G.high} °C; a dwelling service may stop at ${G.minA} A, at ${S.cu} AWG copper or ${S.alCca} AWG aluminum (Table 310.12).`,
              }}
            />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="which-table" className="space-y-5">
            <h2 id="which-table" className={H2} data-src={SVC}>
              Service or feeder: which table
            </h2>
            <p className={P} data-src={SVC}>
              Table 310.12 is for a <span className="whitespace-nowrap">120/240 V</span> single-phase service, or a feeder, that carries the entire
              load of a one-family dwelling or of one dwelling unit in a two-family or multifamily building. Section 310.12 lets those conductors
              have an ampacity of not less than <Val v={SERVICE_AMPACITY_PERCENT} unit="%" src={SVC} /> of the rating,{' '}
              <A v={G.minA} src={SVC_CALC} /> for <A v={G.ratingA} />, and the table lists <Pair cu={S.cu} al={S.alCca} />.
            </p>
            <p className={P} data-src={AMP}>
              Every other <A v={G.ratingA} /> feeder, such as one to a subpanel, is sized from Table 310.16.{' '}
              <span data-src={TERM}>
                Above <A v={TERMINATION_RULES.limitA} src={TERM} />, 110.14(C)(1)(b) uses the <C v={G.high} /> column,
              </span>{' '}
              where <Size s={F.cu.size} /> copper carries <A v={F.cu.ampacity} src={AMP} /> and <Size s={F.al.size} /> aluminum{' '}
              <A v={F.al.ampacity} src={AMP} />.
            </p>
            <DataTable id="by-use-125" variant="ruled" src={AMP} caption={`The conductors for ${G.ratingA} A, by use`}>
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH, 'max-sm:!min-w-0 max-sm:!px-2')}>
                    Use
                  </th>
                  <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0 max-sm:!px-2')}>
                    Copper
                  </th>
                  <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0 max-sm:!px-2')}>
                    Aluminum
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, '!whitespace-normal !font-display !font-normal max-sm:!px-2')} data-src={SVC}>
                    Dwelling service, Table 310.12
                  </th>
                  <td className={clsx(RTD, 'max-sm:!px-2')}>
                    <Size s={S.cu} />
                  </td>
                  <td className={clsx(RTD, 'max-sm:!px-2')}>
                    <Size s={S.alCca} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, '!whitespace-normal !font-display !font-normal max-sm:!px-2')} data-src={TERM}>
                    Feeder, Table 310.16 at <C v={G.high} />
                  </th>
                  <td className={clsx(RTD, 'max-sm:!px-2')}>
                    <Size s={F.cu.size} />
                  </td>
                  <td className={clsx(RTD, 'max-sm:!px-2')}>
                    <Size s={F.al.size} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, '!whitespace-normal !font-display !font-normal max-sm:!px-2')} data-src={OCPD}>
                    Feeder whose load fits, 240.4(B)
                  </th>
                  <td className={clsx(RTD, 'max-sm:!px-2')}>
                    <Size s={FB.size} />
                  </td>
                  <td className={clsx(RTD, 'max-sm:!px-2')}>
                    <Size s={FBA.size} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, '!whitespace-normal !font-display !font-normal max-sm:!px-2')} data-src={GND}>
                    Feeder ground wire, Table 250.122
                  </th>
                  <td className={clsx(RTD, 'max-sm:!px-2')}>
                    <Size s={G.egc.cu} />
                  </td>
                  <td className={clsx(RTD, 'max-sm:!px-2')}>
                    <Size s={G.egc.al} />
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section aria-labelledby="smaller" className="space-y-4">
            <h2 id="smaller" className={H2} data-src={OCPD}>
              The service sizes on a feeder, under 240.4(B)
            </h2>
            <p className={P} data-src={OCPD}>
              At <C v={G.high} />, <Size s={FB.size} /> copper carries <A v={FB.ampacity} src={AMP} /> and <Size s={FBA.size} /> aluminum{' '}
              <A v={FBA.ampacity} src={AMP} />. Neither is a standard rating of Table 240.6(A), so 240.4(B) lets the next higher standard rating,{' '}
              <A v={G.ratingA} />, protect them, up to <A v={NEXT_SIZE_UP_MAX_A} />, on a feeder that does not supply more than one receptacle for
              cord-and-plug-connected portable loads. They are the Table 310.12 sizes again, reached by a different rule.
            </p>
            <p className={P} data-src={LOAD}>
              The catch is the load: under 215.2(A) the feeder carries its noncontinuous load plus <Val v={G.continuousPercent} unit="%" src={LOAD} />{' '}
              of its continuous load, and that sum must fit the smaller wire, <A v={FB.ampacity} src={AMP} /> on <Size s={FB.size} /> copper. A
              subpanel whose calculated load is that or less can use them; a fully loaded <A v={G.ratingA} /> feeder cannot.
            </p>
          </section>

          <section aria-labelledby="ground" className="space-y-4">
            <h2 id="ground" className={H2} data-src={GND}>
              Ground wires at <A v={G.ratingA} />
            </h2>
            <p className={P} data-src={GND}>
              A feeder carries an equipment grounding conductor sized by its breaker: a <A v={G.ratingA} /> breaker falls in the row of Table 250.122
              for breakers up to <A v={G.egc.rowA} src={GND} />, so <Pair cu={G.egc.cu} al={G.egc.al} />. A service has a grounding electrode
              conductor instead, sized by its largest service conductor in Table 250.66: <Pair cu={GEC.cu} al={GEC.alCca} /> for{' '}
              <Size s={S.cu} /> copper service conductors. The values are those of NFPA&apos;s 2020 grounding fact sheet. The{' '}
              <Link href="/calculators/ground-wire-calculator" className={LINK}>
                ground wire calculator
              </Link>{' '}
              finds both for any rating.
            </p>
          </section>

          <section aria-labelledby="detached" className="space-y-4">
            <h2 id="detached" className={H2} data-src={SEP}>
              A <A v={G.ratingA} /> subpanel in a detached building
            </h2>
            <p className={P} data-src={SEP}>
              A feeder to a separate building runs four wires: two hots, the neutral and an equipment grounding conductor, and at that building the
              neutral stays off the grounding conductor and the electrode (250.32(B)(1)).{' '}
              <span data-src={OUTB}>
                Its disconnecting means is rated at least <A v={G.disconnect.dwelling} src={OUTB} /> where the building is a one-family dwelling and{' '}
                <A v={G.disconnect.others} src={OUTB} /> for a garage or other building (225.39).
              </span>{' '}
              The{' '}
              <Link href="/calculators/garage-subpanel-calculator" className={LINK}>
                garage subpanel calculator
              </Link>{' '}
              sizes such a feeder and gives its burial depth.
            </p>
          </section>

          <section aria-labelledby="distance" className="space-y-5">
            <h2 id="distance" className={H2} data-src={VD}>
              <A v={G.ratingA} /> over a long run
            </h2>
            <p className={P} data-src={VD}>
              At the full <A v={G.ratingA} /> over <Val v={RUN.lengthFt} unit="ft" src={VD} />, single-phase at <Val v={AMP_VOLTS} unit="V" src={VD} />{' '}
              with the conductors at <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} />: <Size s={F.cu.size} /> copper drops <DropText run={RUN.cu} />,{' '}
              <Size s={F.al.size} /> aluminum <DropText run={RUN.al} />, <Size s={S.cu} /> copper <DropText run={RUN.cuSvc} /> and{' '}
              <Size s={S.alCca} /> aluminum <DropText run={RUN.alSvc} />.
            </p>
            <p className={P} data-src={LOAD}>
              For feeders, an informational note to 215.2(A) says conductors sized to keep the drop at the farthest outlet under{' '}
              <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />, with no more than <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={LOAD} /> on
              feeder and branch circuits together, will provide reasonable efficiency. It is advice, not a limit.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={VD}>
                    Voltage drop at the full <A v={G.ratingA} />, single-phase at <Val v={AMP_VOLTS} unit="V" src={VD} />, against one-way length: the
                    feeder sizes as solid lines, the service sizes dashed, with the 215.2(A) note&apos;s{' '}
                    <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />.
                  </span>
                  <SourceLine domains={[AMP, SVC, RES, LOAD]} />
                </>
              }
            >
              <AmpDropChart guide={CHART} lengths={DROP_50_LENGTHS} lines={DROP_LINES} />
            </Figure>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <LengthTable id="lengths-125-cu" rows={G.lengths.cu} metal="Copper" both={false} lowVolts={LOW_VOLTS} highVolts={AMP_VOLTS} />
              <LengthTable id="lengths-125-al" rows={G.lengths.al} metal="Aluminum" both={false} lowVolts={LOW_VOLTS} highVolts={AMP_VOLTS} />
            </div>
            <p className={P}>
              The{' '}
              <Link href={wireSizeLink(G.ratingA, { length: RUN.lengthFt })} className={LINK}>
                wire size calculator
              </Link>{' '}
              finds the size for your length and load and grows the ground wire with it (250.122(B)).
            </p>
          </section>

          <section aria-labelledby="ampacities" className="space-y-5">
            <h2 id="ampacities" className={H2} data-src={AMP}>
              Ampacity of the sizes around <A v={G.ratingA} />
            </h2>
            <p className={P} data-src={AMP}>
              From the service sizes to one past the feeder sizes, in both columns of{' '}
              <Link href="/guides/nec-table-310-16" className={LINK}>
                NEC Table 310.16
              </Link>
              , which assumes an ambient temperature of <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} /> and no more than three current-carrying
              conductors together.
            </p>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <LadderTable id="ampacities-125-cu" rows={G.ladder.cu} metal="Copper" low={G.low} high={G.high} />
              <LadderTable id="ampacities-125-al" rows={G.ladder.al} metal="Aluminum" low={G.low} high={G.high} />
            </div>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size wire for a <A v={G.ratingA} /> service?
              </h3>
              <p className={P} data-src={SVC}>
                <Pair cu={S.cu} al={S.alCca} /> for a <span className="whitespace-nowrap">120/240 V</span> dwelling service (Table 310.12), with a{' '}
                <Pair cu={GEC.cu} al={GEC.alCca} /> grounding electrode conductor (Table 250.66).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size wire for a <A v={G.ratingA} /> subpanel?
              </h3>
              <p className={P} data-src={AMP}>
                <Pair cu={F.cu.size} al={F.al.size} /> at <C v={G.high} />, with a <Pair cu={G.egc.cu} al={G.egc.al} /> ground wire;{' '}
                <span data-src={OCPD}>
                  <Pair cu={FB.size} al={FBA.size} /> where the subpanel&apos;s calculated load fits them (240.4(B)).
                </span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size aluminum wire for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={SVC}>
                <Size s={S.alCca} /> for a dwelling service, <Size s={F.al.size} /> for a feeder at <C v={G.high} />, and <Size s={FBA.size} /> on a
                feeder whose load stays within <A v={FBA.ampacity} src={AMP} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={GND}>
                What size ground wire for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={GND}>
                <Pair cu={G.egc.cu} al={G.egc.al} /> with a feeder (Table 250.122); a <Size s={GEC.cu} /> copper grounding electrode conductor for a
                service with <Size s={S.cu} /> copper (Table 250.66).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={VD}>
                What size wire for a <A v={G.ratingA} /> subpanel <Val v={RUN.lengthFt} unit="ft" src={VD} /> away?
              </h3>
              <p className={P} data-src={VD}>
                At the full <A v={G.ratingA} />, <Size s={F.cu.size} /> copper drops <Pct run={RUN.cu} /> and <Size s={F.al.size} /> aluminum{' '}
                <Pct run={RUN.al} />, inside the <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> of the 215.2(A) note.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[SVC, AMP, TERM, OCPD, LOAD, GND, SEP, OUTB, RES]}
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
