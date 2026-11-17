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
import { DetachedFeederDiagram, ServiceGroundDiscs, Subpanel100Ladder, SubpanelDropChart } from '@/components/look/Charts';
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
import type { DropRun } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import { GUIDE_100 } from '@/lib/subpanel-guide';
import type { LadderRow } from '@/lib/subpanel-guide';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { NEXT_SIZE_UP_MAX_A } from '@/lib/verified/nec-240-4-d';
import { SERVICE_AMPACITY_PERCENT } from '@/lib/verified/nec-310-12';
import { CONTINUOUS_LOAD_PERCENT, VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { TABLE_AMBIENT } from '@/lib/verified/nec-310-16';
import { DISCONNECT_MIN_A, NM_CABLE } from '@/lib/verified/nec-separate-buildings';

// /guides/wire-size-for-100-amp (WSZ-008d; spec: research/page-specs-held.md "WSZ-008"; data gate BUILD since WSZ-029):
// a 100 A feeder to a subpanel from Table 310.16 at the column 110.14(C)(1)(a) sets for circuits of 100 A or less
// (nec-310-16, nec-110-14c), NM cable held at 60 °C by 334.80 (nec-cable-rules), 2 AWG copper under 240.4(B)
// (nec-240-ocpd) with the 215.2(A) load rule (nec-continuous-load), a 100 A dwelling service from Table 310.12
// (nec-310-12, scope worded as D-39 sets it), the ground wires (nec-250-grounding), a feeder to a separate building
// (225.30, 225.31, 225.39: nec-feeders-outbuildings; 250.32(A) and (B)(1): nec-250-32) and the voltage drop at 75 °C
// (conductor-resistance-20c). Every value comes from src/lib/subpanel-guide.ts. Never 225.32 (not in the 2023 code),
// 230.79, 340.80 or 310.15(F); no burial depths, conduit sizes or cable availability.
const ROUTE = '/guides/wire-size-for-100-amp';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Wire Size for 100 Amp Subpanel or Service: 1 to 4 AWG Copper';
const DESCRIPTION =
  'A 100 A subpanel feeder takes 1 AWG copper or 1/0 aluminum at 60 °C terminals, 3 or 1 AWG at 75 °C; a 100 A dwelling service takes 4 AWG copper.';

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
const CABLE = 'nec-cable-rules';
const OCPD = 'nec-240-ocpd';
const LOAD = 'nec-continuous-load';
const GND = 'nec-250-grounding';
const OUT = 'nec-feeders-outbuildings';
const SEP = 'nec-250-32';
const RES = 'conductor-resistance-20c';
const GEO = 'awg-geometry';
const SVC_CALC = 'calc:service-lookup';
const VD = 'calc:voltage-drop';

const G = GUIDE_100;
const { service: S, egc: EGC, at60: A60, at75: A75, nextSizeUp: NEXT, run: RUN, noteFt: NOTE_FT } = G;
const GEC = S.gecForCuService;
if (!NEXT.protection.nextSizeUp || NEXT.protection.ratingA !== G.ratingA) throw new Error('100 A guide: the 240.4(B) paragraph no longer fits the data');
if (RUN.noteCu.size !== A60.cu.size) throw new Error('100 A guide: the voltage drop answer no longer fits the data');
if (NM_CABLE.maxColumnC !== G.low) throw new Error('100 A guide: 334.80 no longer holds NM cable to the 110.14(C)(1)(a) column');

// phones: the comparison table's header widths and padding give way so its three columns fit 390 px
const TIGHT_TH = 'max-sm:!min-w-0 max-sm:!px-2';
const TIGHT_TD = 'max-sm:!px-2';
/** A row header that names a use in words: the body face, wrapping. */
const USE_TH = '!whitespace-normal !font-display !font-normal';

const TOC: ([string, string] | [string, string, string])[] = [
  ['which-column', 'Which column: 60 °C or 75 °C', TERM],
  ['service', `A ${G.ratingA} A service`, OCPD],
  ['two-awg', `2 AWG copper on a ${G.ratingA} A breaker`, OCPD],
  ['detached', 'A subpanel in a detached garage'],
  ['ground-wires', 'Ground wires'],
  ['voltage-drop', 'Voltage drop on a long run'],
  ['ampacities', 'The ampacities behind the answer'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Wire Size for 100 Amp Subpanel or Service', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

function Pair({ cu, al }: { cu: string; al: string }) {
  return (
    <>
      <Size s={cu} /> copper or <Size s={al} /> aluminum
    </>
  );
}
function Drop({ run }: { run: DropRun }) {
  return (
    <>
      <Val v={run.vdVolts} unit="V" src={VD} format={{ fixed: 2 }} /> (<Val v={run.vdPct} unit="%" src={VD} format={{ fixed: 2 }} />)
    </>
  );
}
function C({ v }: { v: number }) {
  return <Val v={v} unit="°C" src={TERM} />;
}

/** One material's ladder: each size's ampacity in the 60 and 75 °C columns of Table 310.16. */
function AmpacityTable({ material }: { material: 'cu' | 'al' }) {
  const name = material === 'cu' ? 'Copper' : 'Aluminum';
  const rows: LadderRow[] = G.ladder[material];
  return (
    <DataTable id={`ampacities-${material}`} variant="ruled" src={AMP} caption={`${name}: Table 310.16 ampacity, A`}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Size
          </th>
          <th scope="col" className={RTH}>
            <Val v={G.low} unit="°C" src={AMP} />
          </th>
          <th scope="col" className={RTH}>
            <Val v={G.high} unit="°C" src={AMP} />
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.size}>
            <th scope="row" className={RSTICKY_TD}>
              <Size s={r.size} />
            </th>
            <td className={RTD}>
              <Val v={r.a60} unit="A" src={AMP} />
            </td>
            <td className={RTD}>
              <Val v={r.a75} unit="A" src={AMP} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function WireSizeFor100AmpPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Wire Size for 100 Amp Subpanel or Service" sub="1 to 4 AWG Copper" joiner=": " src={AMP} />
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
          <div className="space-y-4">
            <p className={LOOK_LEAD} data-src={AMP}>
              <strong>
                A feeder to a <Val v={G.ratingA} unit="A" src={OCPD} /> subpanel takes <Pair cu={A60.cu.size} al={A60.al.size} />, from the{' '}
                <C v={G.low} /> column of NEC Table 310.16.
              </strong>{' '}
              <span data-src={TERM}>
                Where every termination is listed and identified for <C v={G.high} /> conductors, it takes{' '}
                <Pair cu={A75.cu.size} al={A75.al.size} />.
              </span>
            </p>
            <p className={P} data-src={SVC}>
              A <Val v={G.ratingA} unit="A" src={OCPD} /> service for one dwelling takes <Pair cu={S.cu} al={S.alCca} /> (Table 310.12).{' '}
              <span data-src={GND}>
                The feeder&apos;s ground wire is <Pair cu={EGC.table.cu} al={EGC.table.alCca} /> (Table 250.122).
              </span>
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={AMP}>
                  The ampacity of the sizes around <Val v={G.ratingA} unit="A" src={OCPD} /> in the <C v={G.low} /> column (open dots) and the{' '}
                  <C v={G.high} /> column (filled). A <Val v={G.ratingA} unit="A" src={OCPD} /> feeder takes the smallest size that reaches{' '}
                  <Val v={G.ratingA} unit="A" src={OCPD} /> in the column its terminals allow.{' '}
                </span>
                <span data-src={SVC}>
                  A dwelling service may use a size that reaches <Val v={SERVICE_AMPACITY_PERCENT} unit="%" src={SVC} /> of the rating,{' '}
                  <Val v={G.minA} unit="A" src={SVC_CALC} /> (Table 310.12).
                </span>
                <SourceLine domains={[AMP, TERM, SVC]} />
              </>
            }
          >
            <Subpanel100Ladder />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="which-column" className="space-y-5">
            <h2 id="which-column" className={H2} data-src={TERM}>
              Which column: <C v={G.low} /> or <C v={G.high} />
            </h2>
            <p className={P} data-src={TERM}>
              Under 110.14(C), the temperature rating used for a conductor&apos;s ampacity may not exceed that of any termination, conductor
              or device it connects to. For circuits rated <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} /> or less, 110.14(C)(1)(a)
              starts from the <C v={G.low} /> column. Conductors with a higher rating may be used, but at their <C v={G.low} /> ampacity,
              unless the equipment is listed and identified for use with the higher-rated conductors.
            </p>
            <p className={P} data-src={AMP}>
              At <C v={G.low} />, <Size s={NEXT.size} /> copper carries <Val v={NEXT.amps} unit="A" src={AMP} />, short of{' '}
              <Val v={G.ratingA} unit="A" src={OCPD} />, so the copper answer is <Size s={A60.cu.size} /> at{' '}
              <Val v={A60.cu.amps} unit="A" src={AMP} />; in aluminum it is <Size s={A60.al.size} /> at <Val v={A60.al.amps} unit="A" src={AMP} />.
              Where the breaker, the subpanel and every other termination are listed and identified for <C v={G.high} /> conductors,{' '}
              <Size s={A75.cu.size} /> copper and <Size s={A75.al.size} /> aluminum each carry <Val v={A75.cu.amps} unit="A" src={AMP} />.
            </p>
            <p className={P} data-src={CABLE}>
              NM cable stays in the <Val v={NM_CABLE.maxColumnC} unit="°C" src={CABLE} /> column whatever its terminations: 334.80 holds its
              ampacity to that of a <Val v={NM_CABLE.maxColumnC} unit="°C" src={CABLE} /> conductor. Its{' '}
              <Val v={NM_CABLE.correctionsFromC} unit="°C" src={CABLE} /> rating may be the starting point for temperature and bundling
              corrections, but the result may not exceed the <Val v={NM_CABLE.maxColumnC} unit="°C" src={CABLE} /> value.
            </p>
            <DataTable id="by-use-100" variant="ruled" src={AMP} caption={`The conductors for a ${G.ratingA} A circuit, by use`}>
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH, TIGHT_TH)}>
                    Use
                  </th>
                  <th scope="col" className={clsx(RTH, TIGHT_TH)}>
                    Copper
                  </th>
                  <th scope="col" className={clsx(RTH, TIGHT_TH)}>
                    Aluminum
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, USE_TH, TIGHT_TD)} data-src={TERM}>
                    Feeder, <C v={G.low} /> terminals or NM cable
                  </th>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={A60.cu.size} />
                  </td>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={A60.al.size} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, USE_TH, TIGHT_TD)} data-src={TERM}>
                    Feeder, every termination listed and identified for <C v={G.high} />
                  </th>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={A75.cu.size} />
                  </td>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={A75.al.size} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, USE_TH, TIGHT_TD)} data-src={SVC}>
                    Dwelling service, Table 310.12
                  </th>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={S.cu} />
                  </td>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={S.alCca} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, USE_TH, TIGHT_TD)} data-src={GND}>
                    Ground wire of the feeder, Table 250.122
                  </th>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={EGC.table.cu} />
                  </td>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={EGC.table.alCca} />
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section aria-labelledby="service" className="space-y-4">
            <h2 id="service" className={H2} data-src={OCPD}>
              A <Val v={G.ratingA} unit="A" src={OCPD} /> service
            </h2>
            <p className={P} data-src={SVC}>
              Table 310.12 is for a 120/240 V single-phase service, or a feeder, that carries the entire load of a one-family dwelling or of
              one dwelling unit in a two-family or multifamily building. Section 310.12 lets those conductors have an ampacity of not less than{' '}
              <Val v={SERVICE_AMPACITY_PERCENT} unit="%" src={SVC} /> of the rating, <Val v={G.minA} unit="A" src={SVC_CALC} /> for{' '}
              <Val v={G.ratingA} unit="A" src={OCPD} />, and the table lists <Pair cu={S.cu} al={S.alCca} />.
            </p>
            <p className={P} data-src={AMP}>
              In Table 310.16, <Size s={G.ladder.cu[0].size} /> copper carries <Val v={G.ladder.cu[0].a75} unit="A" src={AMP} /> and{' '}
              <Size s={G.ladder.al[0].size} /> aluminum <Val v={G.ladder.al[0].a75} unit="A" src={AMP} /> at <C v={G.high} />: both reach{' '}
              <Val v={G.minA} unit="A" src={SVC_CALC} />, neither reaches <Val v={G.ratingA} unit="A" src={OCPD} />. A feeder that carries
              only part of the load, such as one to a subpanel, is sized from Table 310.16 instead, so these sizes do not carry a{' '}
              <Val v={G.ratingA} unit="A" src={OCPD} /> subpanel.
            </p>
          </section>

          <section aria-labelledby="two-awg" className="space-y-4">
            <h2 id="two-awg" className={H2} data-src={OCPD}>
              <Size s={NEXT.size} /> copper on a <Val v={G.ratingA} unit="A" src={OCPD} /> breaker
            </h2>
            <p className={P} data-src={OCPD}>
              At <C v={G.low} />, <Size s={NEXT.size} /> copper carries <Val v={NEXT.amps} unit="A" src={AMP} />. That is not a standard
              rating in Table 240.6(A), and 240.4(B) lets the next higher standard rating protect a conductor in that case, up to{' '}
              <Val v={NEXT_SIZE_UP_MAX_A} unit="A" src={OCPD} />, so a <Val v={NEXT.protection.ratingA} unit="A" src={OCPD} /> breaker may
              protect it.{' '}
              <span data-src={LOAD}>
                The feeder&apos;s calculated load must still fit the <Val v={NEXT.amps} unit="A" src={AMP} />, under 215.2(A), with continuous
                loads counted at <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={LOAD} />.
              </span>{' '}
              On a subpanel whose calculated load is <Val v={NEXT.amps} unit="A" src={AMP} /> or less, <Size s={NEXT.size} /> copper may stand
              in for <Size s={A60.cu.size} />.
            </p>
          </section>

          <section aria-labelledby="detached" className="space-y-5">
            <h2 id="detached" className={H2}>
              A subpanel in a detached garage
            </h2>
            <p className={P} data-src={SEP}>
              A feeder to a separate building, such as a detached garage, runs four wires: the two ungrounded conductors, the neutral and an
              equipment grounding conductor. Under 250.32(B)(1), the equipment grounding conductor runs with the feeder, connects to the
              building&apos;s disconnecting means and to its grounding electrodes, and is sized from Table 250.122:{' '}
              <Pair cu={EGC.table.cu} al={EGC.table.alCca} /> for <Val v={EGC.ocpdA} unit="A" src={GND} />. The neutral is not connected to
              the equipment grounding conductor or to the grounding electrode at that building.
            </p>
            <p className={P} data-src={SEP}>
              The building has its own grounding electrode system (250.32(A)), unless a single branch circuit with an equipment grounding
              conductor supplies it. A three-wire feeder installed under an earlier edition, with the neutral as the ground-fault return, may
              stay only under the three conditions of Exception No. 1 to 250.32(B)(1).
            </p>
            <Figure
              caption={
                <>
                  <span data-src={SEP}>
                    A <Val v={G.ratingA} unit="A" src={OCPD} /> feeder to a separate building: the two ungrounded conductors to its
                    disconnecting means, the neutral to a bar that is not joined to the equipment grounding conductor or the electrode, and
                    the equipment grounding conductor to the disconnecting means and the grounding electrode system.
                  </span>
                  <SourceLine domains={[SEP, OUT]} />
                </>
              }
            >
              <DetachedFeederDiagram />
            </Figure>
            <p className={P} data-src={OUT}>
              Under 225.31 the building gets its own disconnecting means, inside or outside, at a readily accessible place nearest the point
              where the feeder enters. Under 225.39 its rating covers the calculated load and is at least{' '}
              <Val v={DISCONNECT_MIN_A.allOthers} unit="A" src={OUT} /> for a garage or other building, or{' '}
              <Val v={DISCONNECT_MIN_A.oneFamilyDwelling} unit="A" src={OUT} />, {DISCONNECT_MIN_A.oneFamilyDwellingWires}-wire, where the
              building is a one-family dwelling; the floor drops to <Val v={DISCONNECT_MIN_A.twoCircuits} unit="A" src={OUT} /> where the
              building has no more than two 2-wire branch circuits. Section 225.30 allows one feeder or branch circuit to the building
              unless one of its listed conditions permits more.
            </p>
            <p className={P}>
              The{' '}
              <Link href="/calculators/garage-subpanel-calculator" className={LINK}>
                garage subpanel calculator
              </Link>{' '}
              sizes this feeder for other breakers and gives the burial depth for the run.
            </p>
          </section>

          <section aria-labelledby="ground-wires" className="space-y-5">
            <h2 id="ground-wires" className={H2}>
              Ground wires
            </h2>
            <p className={P} data-src={GND}>
              A feeder carries an equipment grounding conductor, sized by its breaker in Table 250.122:{' '}
              <Pair cu={EGC.table.cu} al={EGC.table.alCca} /> for <Val v={EGC.ocpdA} unit="A" src={GND} />. A service has a grounding
              electrode conductor instead, which connects it to the ground rod or other electrode. Table 250.66 sizes it by the largest
              service conductor: <Pair cu={GEC.cu} al={GEC.alCca} /> for <Size s={S.cu} /> copper service conductors. The values are those of
              NFPA&apos;s 2020 grounding fact sheet. The{' '}
              <Link href="/calculators/ground-wire-calculator" className={LINK}>
                ground wire calculator
              </Link>{' '}
              finds both for any rating.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={GND}>
                    A <Val v={G.ratingA} unit="A" src={OCPD} /> dwelling service&apos;s <Size s={S.cu} /> copper conductor (Table 310.12), its{' '}
                    <Size s={GEC.cu} /> copper electrode conductor (Table 250.66), and the <Size s={EGC.table.cu} /> copper equipment grounding
                    conductor of a <Val v={EGC.ocpdA} unit="A" src={GND} /> feeder (Table 250.122), drawn to one scale as solid conductors.
                  </span>
                  <SourceLine domains={[SVC, GND, GEO]} />
                </>
              }
            >
              <ServiceGroundDiscs ratingA={G.ratingA} />
            </Figure>
          </section>

          <section aria-labelledby="voltage-drop" className="space-y-5">
            <h2 id="voltage-drop" className={H2}>
              Voltage drop on a long run
            </h2>
            <p className={P} data-src={VD}>
              Table 310.16 sizes a feeder for its current, not its length. At the full <Val v={G.ratingA} unit="A" src={OCPD} /> over{' '}
              <Val v={RUN.lengthFt} unit="ft" src={VD} />, single-phase at <Val v={SERVICE_VOLTS} unit="V" src={SVC} /> with the conductors at{' '}
              <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} />: <Size s={A60.cu.size} /> copper drops <Drop run={RUN.cu60} />,{' '}
              <Size s={A60.al.size} /> aluminum <Drop run={RUN.al60} />, <Size s={A75.cu.size} /> copper <Drop run={RUN.cu75} /> and{' '}
              <Size s={A75.al.size} /> aluminum <Drop run={RUN.al75} />.
            </p>
            <p className={P} data-src={LOAD}>
              For feeders, an informational note to 215.2(A) says that conductors sized to keep the drop at the farthest outlet under{' '}
              <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />, with no more than{' '}
              <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={LOAD} /> on feeder and branch circuits together, will provide reasonable
              efficiency. It is advice, not a limit.{' '}
              <span data-src={VD}>
                At the full rating, <Size s={A60.cu.size} /> copper reaches <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> at{' '}
                <Val v={NOTE_FT.cu60} unit="ft" src={VD} format={{ sig: 3 }} />, <Size s={A60.al.size} /> aluminum at{' '}
                <Val v={NOTE_FT.al60} unit="ft" src={VD} format={{ sig: 3 }} />, <Size s={A75.cu.size} /> copper at{' '}
                <Val v={NOTE_FT.cu75} unit="ft" src={VD} format={{ sig: 3 }} /> and <Size s={A75.al.size} /> aluminum at{' '}
                <Val v={NOTE_FT.al75} unit="ft" src={VD} format={{ sig: 3 }} />.
              </span>
            </p>
            <Figure
              caption={
                <>
                  <span data-src={VD}>
                    Voltage drop of a <Val v={G.ratingA} unit="A" src={OCPD} /> feeder at full load, single-phase at{' '}
                    <Val v={SERVICE_VOLTS} unit="V" src={SVC} />, against one-way length: the <C v={G.low} /> sizes as solid lines, the{' '}
                    <C v={G.high} /> sizes dashed, with the 215.2(A) note&apos;s <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />.
                  </span>
                  <SourceLine domains={[AMP, RES, LOAD]} />
                </>
              }
            >
              <SubpanelDropChart />
            </Figure>
            <p className={P} data-src={VD}>
              The drop falls in proportion to the current, so a lighter load drops less. The{' '}
              <Link href="/calculators/voltage-drop-calculator" className={LINK}>
                voltage drop calculator
              </Link>{' '}
              takes your length, load and size.
            </p>
          </section>

          <section aria-labelledby="ampacities" className="space-y-5">
            <h2 id="ampacities" className={H2}>
              The ampacities behind the answer
            </h2>
            <p className={P} data-src={AMP}>
              The sizes from the Table 310.12 service size up to one past the <C v={G.low} /> answer, with their ampacity in both columns
              of Table 310.16, which assumes an ambient temperature of <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} /> and no more than
              three current-carrying conductors together.
            </p>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <AmpacityTable material="cu" />
              <AmpacityTable material="al" />
            </div>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size wire for a <Val v={G.ratingA} unit="A" src={OCPD} /> subpanel?
              </h3>
              <p className={P} data-src={AMP}>
                <Pair cu={A60.cu.size} al={A60.al.size} /> at <C v={G.low} /> terminals; <Pair cu={A75.cu.size} al={A75.al.size} /> where every
                termination is listed and identified for <C v={G.high} /> conductors. The ground wire is{' '}
                <Pair cu={EGC.table.cu} al={EGC.table.alCca} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size wire for a <Val v={G.ratingA} unit="A" src={OCPD} /> service?
              </h3>
              <p className={P} data-src={SVC}>
                <Pair cu={S.cu} al={S.alCca} /> for a 120/240 V dwelling service, from Table 310.12, with a <Pair cu={GEC.cu} al={GEC.alCca} />{' '}
                grounding electrode conductor (Table 250.66).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Can <Size s={NEXT.size} /> copper go on a <Val v={G.ratingA} unit="A" src={OCPD} /> breaker?
              </h3>
              <p className={P} data-src={OCPD}>
                On a feeder whose calculated load is <Val v={NEXT.amps} unit="A" src={AMP} /> or less, yes: it carries{' '}
                <Val v={NEXT.amps} unit="A" src={AMP} /> at <C v={G.low} />, and 240.4(B) allows the next standard rating,{' '}
                <Val v={NEXT.protection.ratingA} unit="A" src={OCPD} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={VD}>
                What size wire for a <Val v={G.ratingA} unit="A" src={OCPD} /> subpanel <Val v={RUN.lengthFt} unit="ft" src={VD} /> away?
              </h3>
              <p className={P} data-src={VD}>
                At the full <Val v={G.ratingA} unit="A" src={OCPD} />, <Size s={RUN.noteCu.size} /> copper drops <Drop run={RUN.noteCu} />,
                inside the <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> of the 215.2(A) note. In aluminum,{' '}
                <Size s={A60.al.size} /> drops <Drop run={RUN.al60} />; <Size s={RUN.noteAl.size} /> stays inside it at{' '}
                <Drop run={RUN.noteAl} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SEP}>
                Does a detached garage subpanel need four wires?
              </h3>
              <p className={P} data-src={SEP}>
                Yes. Under 250.32(B)(1) an equipment grounding conductor runs with the feeder, and the neutral is not connected to it or to
                the electrode at the garage. A three-wire feeder installed under an earlier edition may stay only under the conditions of
                Exception No. 1.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size aluminum wire for <Val v={G.ratingA} unit="A" src={OCPD} />?
              </h3>
              <p className={P} data-src={AMP}>
                <Size s={A60.al.size} /> for a feeder at <C v={G.low} /> terminals, <Size s={A75.al.size} /> at <C v={G.high} />, and{' '}
                <Size s={S.alCca} /> for a dwelling service (Table 310.12). The ground wire of the feeder is <Size s={EGC.table.alCca} />{' '}
                aluminum.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[SVC, AMP, TERM, CABLE, OCPD, LOAD, GND, OUT, SEP, RES, GEO]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#separate-buildings" className={LINK}>
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
