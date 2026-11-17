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
import { GarageSubpanelTool } from '@/components/calculators/GarageSubpanelTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { BurialDepthChart, DetachedFeederDiagram } from '@/components/look/Charts';
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
import { GARAGE_CALC } from '@/lib/calculations/garage-subpanel';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import { COVER_ROWS, EXAMPLE_LOAD, EXAMPLE_LOAD_A, GARAGE_HIGH, GARAGE_LOW, GARAGE_VOLTS_DEFAULT, RATING_ROWS, ratingRow } from '@/lib/garage-page';
import type { RatingRow } from '@/lib/garage-page';
import type { SizeKey } from '@/lib/verified/awg';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { NEXT_SIZE_UP_MAX_A, max240_4D } from '@/lib/verified/nec-240-4-d';
import { CONTINUOUS_LOAD_PERCENT, VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { BURIAL_METHODS } from '@/lib/verified/nec-300-5';
import { DISCONNECT_MIN_A } from '@/lib/verified/nec-separate-buildings';

// /calculators/garage-subpanel-calculator (WSZ-008f; spec: research/page-specs-held.md "WSZ-008"; data gate BUILD since
// WSZ-029; withdrawn in WSZ-002, back as a new page): the feeder to a subpanel in a detached garage. The conductors come
// from Table 310.16 at the column 110.14(C) sets (nec-310-16, nec-110-14c), 240.4(D) and 240.4(B) (nec-240-4-d,
// nec-240-ocpd), the ground wire from Table 250.122 (nec-250-grounding), the four wires and the electrode from 250.32
// (nec-250-32), the neutral from 220.61 (nec-220-load-calcs), the garage's disconnect from 225.30, 225.31 and 225.39
// (nec-feeders-outbuildings), the cover from Table 300.5(A) (nec-300-5-burial; never an EMT depth, never row 3), the
// drop from the engine at 75 °C (conductor-resistance-20c) with the 215.2(A) note (nec-continuous-load). The calculator
// never picks the rating; no load estimates, no conduit sizes, no cable availability, no 340.80.
const ROUTE = '/calculators/garage-subpanel-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Garage Subpanel Calculator: Feeder Wire and Burial Depth';
const DESCRIPTION =
  'Size the feeder to a detached garage subpanel: copper or aluminum wire and ground wire from NEC tables, four wires, a 60 A disconnect and burial depth.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const AMP = 'nec-310-16';
const TERM = 'nec-110-14c';
const OCPD = 'nec-240-ocpd';
const SMALL = 'nec-240-4-d';
const GND = 'nec-250-grounding';
const OUT = 'nec-feeders-outbuildings';
const SEP = 'nec-250-32';
const BURY = 'nec-300-5-burial';
const RES = 'conductor-resistance-20c';
const LOAD = 'nec-continuous-load';
const LC = 'nec-220-load-calcs';
const CALC = GARAGE_CALC;

const R30 = ratingRow(30);
const R60 = ratingRow(60);
const R100 = ratingRow(100);
function must<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`garage page: ${what}`);
  return value;
}
const NEXT = must(EXAMPLE_LOAD.feeder.nextSizeUp, 'no 240.4(B) size for the 60 A example');
const AL10 = must(max240_4D('10', 'Al'), 'no 240.4(D) row for 10 AWG aluminum');
const GENERAL = must(
  COVER_ROWS.find((r) => r.place === 'general'),
  'no open-ground cover row',
);
const DRIVEWAY_COVER = must(
  COVER_ROWS.find((r) => r.place === 'dwelling-driveway'),
  'no dwelling driveway cover row',
);

// the facts the copy states, checked when the page builds
if (NEXT.size !== '6' || NEXT.ampacity !== 55 || EXAMPLE_LOAD_A > NEXT.ampacity) throw new Error('garage page: the 240.4(B) paragraph no longer fits');
if (!R30.al75.limited || R30.al75.size !== R30.al60.size) throw new Error('garage page: the 240.4(D) sentence no longer fits');
if (new Set(DRIVEWAY_COVER.covers.map((c) => c.cover.inches)).size !== 1) throw new Error('garage page: the driveway sentence no longer fits');
if (DISCONNECT_MIN_A.allOthers !== R60.ratingA) throw new Error('garage page: the 60 A example no longer matches 225.39(D)');

const cover = (method: string) => must(GENERAL.covers.find((x) => x.method === method)?.cover, `no open-ground cover for ${method}`);
const DIRECT = cover('direct');
const NONMETALLIC = cover('nonmetallic');
const RMC = cover('rmc');
const DRIVEWAY = DRIVEWAY_COVER.covers[0].cover;

const TOC: ([string, string] | [string, string, string])[] = [
  ['sizes', 'Feeder wire size by breaker'],
  ['four-wires', 'Four wires and a grounding electrode'],
  ['disconnect', 'The garage disconnect'],
  ['burial', 'How deep to bury the feeder'],
  ['voltage-drop', 'Voltage drop on a long run'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Garage Subpanel Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Garage Subpanel Calculator', url: URL, description: DESCRIPTION };

function A({ v, src = OCPD }: { v: number; src?: string }) {
  return <Val v={v} unit="A" src={src} />;
}
function C({ v, src = TERM }: { v: number; src?: string }) {
  return <Val v={v} unit="°C" src={src} />;
}
function In({ inches, mm }: { inches: number; mm: number }) {
  return (
    <>
      <Val v={inches} unit="in" src={BURY} /> (<Val v={mm} unit="mm" src={BURY} />)
    </>
  );
}
function Pair({ cu, al }: { cu: SizeKey; al: SizeKey }) {
  return (
    <>
      <Size s={cu} /> copper or <Size s={al} /> aluminum
    </>
  );
}

/** One material's feeder sizes by breaker, both columns, with the ground wire. */
function SizeTable({ material }: { material: 'cu' | 'al' }) {
  const name = material === 'cu' ? 'Copper' : 'Aluminum';
  return (
    <DataTable id={`garage-${material}`} variant="ruled" src={CALC} caption={`${name} feeder and ground wire`}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Breaker
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')} data-src={TERM}>
            <C v={GARAGE_LOW} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')} data-src={TERM}>
            <C v={GARAGE_HIGH} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Ground
          </th>
        </tr>
      </thead>
      <tbody>
        {RATING_ROWS.map((r: RatingRow) => (
          <tr key={r.ratingA}>
            <th scope="row" className={RSTICKY_TD}>
              <A v={r.ratingA} />
            </th>
            <td className={RTD}>
              <Size s={material === 'cu' ? r.cu60.size : r.al60.size} />
            </td>
            <td className={RTD}>
              <Size s={material === 'cu' ? r.cu75.size : r.al75.size} />
            </td>
            <td className={RTD} data-src={GND}>
              <Size s={material === 'cu' ? r.egcCu : r.egcAl} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function CoverTable() {
  const head = ['Buried directly', 'Nonmetallic conduit', 'RMC or IMC'];
  return (
    <DataTable id="garage-cover" variant="ruled" src={BURY} caption="Minimum cover, NEC Table 300.5(A)">
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH, '!whitespace-normal')}>
            Buried under
          </th>
          {BURIAL_METHODS.map((m, k) => (
            <th key={m.id} scope="col" className={clsx(RTH, 'max-sm:!min-w-0 !whitespace-normal')}>
              {head[k]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {COVER_ROWS.map((row) => (
          <tr key={row.place}>
            <th scope="row" className={clsx(RSTICKY_TD, '!min-w-[9rem] max-w-[14rem] !whitespace-normal !font-display !font-normal')} data-src={BURY}>
              {row.label}
            </th>
            {row.covers.map((c) => (
              <td key={c.method} className={RTD}>
                <Val v={c.cover.inches} unit="in" src={BURY} />
                <span className="block text-[13px] text-cut-muted">
                  <Val v={c.cover.mm} unit="mm" src={BURY} />
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function DropTable() {
  return (
    <DataTable id="garage-drop" variant="ruled" src={CALC} caption={`One-way length at which the full rating drops ${VOLTAGE_DROP_NOTE.feederPct} %`}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Breaker
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Copper
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Length
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Aluminum
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Length
          </th>
        </tr>
      </thead>
      <tbody>
        {RATING_ROWS.map((r) => (
          <tr key={r.ratingA}>
            <th scope="row" className={RSTICKY_TD}>
              <A v={r.ratingA} />
            </th>
            <td className={RTD}>
              <Size s={r.cu60.size} />
            </td>
            <td className={RTD}>
              <Val v={r.noteFt.cu60} unit="ft" src={CALC} format={{ sig: 3 }} />
            </td>
            <td className={RTD}>
              <Size s={r.al60.size} />
            </td>
            <td className={RTD}>
              <Val v={r.noteFt.al60} unit="ft" src={CALC} format={{ sig: 3 }} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function GarageSubpanelCalculatorPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Garage Subpanel Calculator" sub="Feeder Wire and Burial Depth" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            The feeder from a house panel to a subpanel in a detached garage: wire and ground wire, voltage drop, the four wires, the garage&apos;s
            disconnect and how deep to bury the run.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <GarageSubpanelTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={CALC}>
            <strong>
              A <A v={R60.ratingA} /> garage feeder takes <Pair cu={R60.cu60.size} al={R60.al60.size} /> at <C v={GARAGE_LOW} /> terminals, or{' '}
              <Pair cu={R60.cu75.size} al={R60.al75.size} /> where every termination is listed and identified for <C v={GARAGE_HIGH} /> conductors.
            </strong>{' '}
            <span data-src={GND}>
              Its ground wire is <Pair cu={R60.egcCu} al={R60.egcAl} /> (Table 250.122), the fourth of four wires.
            </span>
          </p>
          <p className={P} data-src={BURY}>
            Under open ground, Table 300.5(A) asks for <In {...NONMETALLIC} /> of cover over nonmetallic conduit and <In {...DIRECT} /> over cable
            buried directly.
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="sizes" className="space-y-5">
            <h2 id="sizes" className={H2}>
              Feeder wire size by breaker
            </h2>
            <p className={P} data-src={TERM}>
              Under 110.14(C)(1)(a), a feeder rated <A v={TERMINATION_RULES.limitA} src={TERM} /> or less is sized in the <C v={GARAGE_LOW} /> column
              of Table 310.16, unless the breaker, the subpanel and every other termination are listed and identified for <C v={GARAGE_HIGH} />{' '}
              conductors; above <A v={TERMINATION_RULES.limitA} src={TERM} />, 110.14(C)(1)(b) starts from <C v={GARAGE_HIGH} />. The site keeps NM
              and UF cable at <C v={TERMINATION_RULES.cableColumn} />.
            </p>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6 [&>*]:min-w-0">
              <SizeTable material="cu" />
              <SizeTable material="al" />
            </div>
            <p className="text-[15px] leading-[1.6] text-[#333333]" data-src={SMALL}>
              240.4(D) holds <Size s="10" /> aluminum to <A v={AL10.max_ocpd_a} src={SMALL} />, so a <A v={R30.ratingA} /> feeder takes{' '}
              <Size s={R30.al60.size} /> aluminum in both columns.
            </p>
            <h3 className={H3}>One size smaller under 240.4(B)</h3>
            <p className={P} data-src={OCPD}>
              Where a size&apos;s ampacity is not a standard rating in Table 240.6(A), 240.4(B) lets the next standard rating protect it, up to{' '}
              <A v={NEXT_SIZE_UP_MAX_A} />.{' '}
              <span data-src={AMP}>
                <Size s={NEXT.size} /> copper carries <A v={NEXT.ampacity} src={AMP} /> at <C v={GARAGE_LOW} />, so a <A v={R60.ratingA} /> breaker may
                protect it on a garage whose calculated load is <A v={NEXT.ampacity} src={AMP} /> or less.
              </span>{' '}
              <span data-src={LOAD}>
                The calculated load has to fit the feeder&apos;s ampacity under 215.2(A), continuous loads at{' '}
                <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={LOAD} />.
              </span>{' '}
              Enter the load in the calculator and it shows the smaller size when it fits.
            </p>
          </section>

          <section aria-labelledby="four-wires" className="space-y-5">
            <h2 id="four-wires" className={H2}>
              Four wires and a grounding electrode
            </h2>
            <p className={P} data-src={SEP}>
              A feeder to a separate building, such as a detached garage, runs four wires: the two hots, the neutral and an equipment grounding
              conductor. Under 250.32(B)(1), the equipment grounding conductor runs with the feeder, connects to the garage&apos;s disconnecting means
              and to its grounding electrodes, and is sized from Table 250.122. The neutral is not connected to the equipment grounding conductor or
              to the grounding electrode at the garage.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={SEP}>
                    A <A v={R60.ratingA} /> feeder to a garage: the two hots to its disconnecting means, the neutral to a bar that is not joined to
                    the equipment grounding conductor or the electrode, and the equipment grounding conductor to the disconnecting means and the
                    grounding electrode system.
                  </span>
                  <SourceLine domains={[SEP, OUT]} />
                </>
              }
            >
              <DetachedFeederDiagram ratingA={R60.ratingA} />
            </Figure>
            <p className={P} data-src={SEP}>
              The garage has its own grounding electrode system (250.32(A)), unless a single branch circuit with an equipment grounding conductor
              supplies it. A three-wire feeder installed under an earlier edition, with the neutral as the ground-fault return, may stay only under
              the three conditions of Exception No. 1 to 250.32(B)(1).
            </p>
            <p className={P} data-src={LC}>
              The neutral carries the feeder&apos;s neutral load: under 220.61, the largest load between it and either hot. A neutral the size of the
              hots always carries it, and the calculator sizes the hots.
            </p>
          </section>

          <section aria-labelledby="disconnect" className="space-y-4">
            <h2 id="disconnect" className={H2} data-src={OUT}>
              The garage disconnect
            </h2>
            <p className={P} data-src={OUT}>
              Under 225.31 the garage gets its own disconnecting means, inside or outside, at a readily accessible place nearest the point where the
              feeder enters. Under 225.39 its rating is at least the calculated load and never below <A v={DISCONNECT_MIN_A.allOthers} src={OUT} />, so
              a garage on a smaller feeder breaker still has a disconnect rated <A v={DISCONNECT_MIN_A.allOthers} src={OUT} /> or more. The floor
              drops to <A v={DISCONNECT_MIN_A.twoCircuits} src={OUT} /> where the garage has no more than two 2-wire branch circuits, and to{' '}
              <A v={DISCONNECT_MIN_A.oneCircuit} src={OUT} /> where one branch circuit supplies limited loads.
            </p>
            <p className={P} data-src={OUT}>
              Section 225.30 allows one feeder or branch circuit to the building unless one of its listed conditions permits more.
            </p>
          </section>

          <section aria-labelledby="burial" className="space-y-5">
            <h2 id="burial" className={H2}>
              How deep to bury the feeder
            </h2>
            <p className={P} data-src={BURY}>
              Table 300.5(A) sets the minimum cover by wiring method and by what lies above the run. Cover is measured from the top of the cable,
              conductor or conduit to the top of finished grade, concrete or a similar cover (Note 1 to the table).
            </p>
            <Figure
              caption={
                <>
                  <span data-src={BURY}>
                    Minimum cover under open ground, to scale: <In {...DIRECT} /> for cable or conductors buried directly,{' '}
                    <In {...NONMETALLIC} /> for nonmetallic conduit listed for direct burial, and <In {...RMC} /> for rigid or intermediate metal
                    conduit.
                  </span>
                  <SourceLine domains={[BURY]} />
                </>
              }
            >
              <BurialDepthChart />
            </Figure>
            <CoverTable />
            <p className={P} data-src={BURY}>
              Under a one- or two-family dwelling&apos;s driveway, all three methods need <In {...DRIVEWAY} />. The table&apos;s other
              columns, for residential branch circuits and low-voltage landscape circuits, do not apply to a feeder.
            </p>
          </section>

          <section aria-labelledby="voltage-drop" className="space-y-5">
            <h2 id="voltage-drop" className={H2}>
              Voltage drop on a long run
            </h2>
            <p className={P} data-src={CALC}>
              Table 310.16 sizes a feeder for current, not distance. At the full rating, single-phase at{' '}
              <Val v={GARAGE_VOLTS_DEFAULT} unit="V" src="input" /> with the conductors at <C v={RESISTANCE_TEMP_C} src={RES} />, each{' '}
              <C v={GARAGE_LOW} /> size reaches a drop of <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> at these lengths:
            </p>
            <DropTable />
            <p className={P} data-src={LOAD}>
              An informational note to 215.2(A) ties a feeder drop of up to <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />, and{' '}
              <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={LOAD} /> for feeder and branch circuit together, to reasonable efficiency: advice,
              not a rule. The drop falls in proportion to the current, so a garage that draws less than the rating drops less. Past your target,
              the calculator moves the feeder up a size and the ground wire with it, as 250.122(B) requires.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size wire for a <A v={R60.ratingA} /> subpanel in a detached garage?
              </h3>
              <p className={P} data-src={CALC}>
                <Pair cu={R60.cu60.size} al={R60.al60.size} /> at <C v={GARAGE_LOW} /> terminals; <Pair cu={R60.cu75.size} al={R60.al75.size} />{' '}
                where every termination is listed and identified for <C v={GARAGE_HIGH} /> conductors. Four wires in all; the ground wire is{' '}
                <Size s={R60.egcCu} /> copper or <Size s={R60.egcAl} /> aluminum.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size wire for a <A v={R100.ratingA} /> garage subpanel?
              </h3>
              <p className={P} data-src={CALC}>
                <Pair cu={R100.cu60.size} al={R100.al60.size} /> at <C v={GARAGE_LOW} /> terminals, <Pair cu={R100.cu75.size} al={R100.al75.size} />{' '}
                at <C v={GARAGE_HIGH} />; the ground wire is <Size s={R100.egcCu} /> copper or <Size s={R100.egcAl} /> aluminum. The{' '}
                <Link href="/guides/wire-size-for-100-amp" className={LINK}>
                  100 amp guide
                </Link>{' '}
                covers that feeder in full.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How deep do I bury wire to a detached garage?</h3>
              <p className={P} data-src={BURY}>
                Under open ground, <In {...DIRECT} /> for cable or conductors buried directly, <In {...NONMETALLIC} /> in nonmetallic conduit listed
                for direct burial and <In {...RMC} /> in rigid or intermediate metal conduit, measured to the top of the run (Table 300.5(A)).
                Under a dwelling&apos;s driveway, <In {...DRIVEWAY} /> for all three.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Can I run three wires to a detached garage?</h3>
              <p className={P} data-src={SEP}>
                Not for a new feeder. Under 250.32(B)(1) an equipment grounding conductor runs with it, and the neutral is not connected to it at the
                garage. A three-wire feeder installed under an earlier edition may stay only under the conditions of Exception No. 1.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does a detached garage need a ground rod?</h3>
              <p className={P} data-src={SEP}>
                It needs a grounding electrode system of its own under 250.32(A), connected to the equipment grounding conductor, unless a single
                branch circuit with an equipment grounding conductor supplies the garage.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What size disconnect does a garage subpanel need?</h3>
              <p className={P} data-src={OUT}>
                At least the calculated load and at least <A v={DISCONNECT_MIN_A.allOthers} src={OUT} />, or{' '}
                <A v={DISCONNECT_MIN_A.twoCircuits} src={OUT} /> where the garage has no more than two 2-wire branch circuits (225.39). It goes at a
                readily accessible place nearest where the feeder enters the garage (225.31).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Can <Size s={NEXT.size} /> copper go on a <A v={R60.ratingA} /> breaker?
              </h3>
              <p className={P} data-src={OCPD}>
                At <C v={GARAGE_LOW} /> it carries <A v={NEXT.ampacity} src={AMP} />, so only on a garage whose calculated load is{' '}
                <A v={NEXT.ampacity} src={AMP} /> or less, under 240.4(B). Where every termination is listed and identified for{' '}
                <C v={GARAGE_HIGH} /> conductors, it carries <A v={R60.cu75.ampacity} src={AMP} /> and needs no exception.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                How far can a <A v={R60.ratingA} /> garage feeder run?
              </h3>
              <p className={P} data-src={CALC}>
                At the full <A v={R60.ratingA} /> and <Val v={GARAGE_VOLTS_DEFAULT} unit="V" src="input" />, <Size s={R60.cu60.size} /> copper reaches a{' '}
                <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> drop at <Val v={R60.noteFt.cu60} unit="ft" src={CALC} format={{ sig: 3 }} />{' '}
                and <Size s={R60.al60.size} /> aluminum at <Val v={R60.noteFt.al60} unit="ft" src={CALC} format={{ sig: 3 }} />. That is advice, not a
                limit; the calculator finds the size for your length.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, TERM, OCPD, SMALL, GND, SEP, OUT, BURY, LC, RES, LOAD]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The rules are the 2023 NEC&apos;s; the{' '}
              <Link href="/guides/nec-code-compliance" className={LINK}>
                NEC edition by state
              </Link>{' '}
              shows which edition applies where you live. The{' '}
              <Link href="/methodology#garage-method" className={LINK}>
                methodology page
              </Link>{' '}
              describes how the calculator works and each source. NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the
              National Fire Protection Association; wiresizes.com is not affiliated with or endorsed by NFPA.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
