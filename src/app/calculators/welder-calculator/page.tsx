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
import { WelderTool } from '@/components/calculators/WelderTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { WelderDropChart } from '@/components/look/Charts';
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
import { WD_CALC, WD_VOLTS } from '@/lib/calculations/welder';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import {
  DROP_ROWS,
  EXAMPLE,
  EXAMPLE_75,
  EXAMPLE_FT,
  EXAMPLE_WELDER,
  FIFTY_60,
  FIFTY_75,
  FIFTY_A,
  LONG_RUN,
  LONG_RUN_FT,
  PRESET_ROWS,
  WD_DROP_PCT,
  WD_HIGH,
  WD_LOW,
} from '@/lib/welder-page';
import { max240_4D } from '@/lib/verified/nec-240-4-d';
import { NEC_440_DOMAIN } from '@/lib/verified/nec-440';
import { NEC_630_DOMAIN, WELDER_OCPD, WELDING_AREA_GFCI } from '@/lib/verified/nec-630';
import { MFR_WELDERS_DOMAIN, MILLER_AMBIENT_C, WELDERS, manualOcpd, welder } from '@/lib/verified/mfr-welders';
import { nemaConfig } from '@/lib/verified/nema-receptacle-configs';

// /calculators/welder-calculator (WSZ-011f; withdrawn in WSZ-002, back as a new page; sources WSZ-037): the copper
// circuit for a 240 V welder from its manual (mfr-welders): the wire from the manual's minimum, moved up until 630.12(B)
// allows the breaker and then for the drop at I1max (nec-310-16, nec-110-14c, conductor-resistance-20c); the breaker
// limits of 630.12 (nec-630-welders, nec-240-ocpd) with 240.4(G) over 240.4(D) (nec-440-hvac, nec-240-4-d); the ground
// wire (nec-250-grounding); 630.13, 630.8 and the 6-50R (nema-receptacle-configs). No 630.11 rule is stated.
const ROUTE = '/calculators/welder-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Welder Wire Size Calculator: 240 V Wire and Breaker Size';
const DESCRIPTION =
  'Copper wire, breaker and ground wire for a 240 V welder from its manual, with the NEC 630.12 breaker limits, voltage drop and Miller and Lincoln guides.';

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
const RES = 'conductor-resistance-20c';
const G440 = NEC_440_DOMAIN;
const N630 = NEC_630_DOMAIN;
const MFR = MFR_WELDERS_DOMAIN;
const NEMA = 'nema-receptacle-configs';
const CALC = WD_CALC;

function limit(size: '14' | '12' | '10'): number {
  const l = max240_4D(size, 'Cu');
  if (!l || l.conditions !== null) throw new Error(`welder page: no plain 240.4(D) limit for ${size} AWG`);
  return l.max_ocpd_a;
}
const LIMIT_14 = limit('14');
const LIMIT_12 = limit('12');
const LIMIT_10 = limit('10');

const AC225 = welder('ac-225c');
const MM220 = welder('multimatic-220');
const LN210 = welder('power-mig-210-mp');
const R650 = nemaConfig('6-50R');
const R650_V = Number(R650.volts);
if (!AC225.longRun || !AC225.receptacle || !/6-50R/.test(AC225.receptacle) || !Number.isFinite(R650_V)) throw new Error('welder page: AC-225C data changed');
const AC225_LONG = AC225.longRun;
const EX = EXAMPLE_WELDER;
const EX_TD = EX.fuseTimeDelayA as number;
const EX_NORMAL = EX.fuseNormalA as number;
const EX_TOO_SMALL = EXAMPLE.tooSmall[0];

const TOC: ([string, string] | [string, string, string])[] = [
  ['manuals', 'What the welder’s manual sets'],
  ['breaker', 'The breaker: 630.12'],
  ['long-runs', 'Long runs and voltage drop'],
  ['receptacle', 'The receptacle and the disconnect'],
  ['gfci', 'GFCI in the welding area'],
  ['not-covered', 'What the calculator does not cover'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Welder Wire Size Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Welder Wire Size Calculator', url: URL, description: DESCRIPTION };

function A({ v, src = MFR }: { v: number; src?: string }) {
  return <Val v={v} unit="A" src={src} />;
}
function C({ v }: { v: number }) {
  return <Val v={v} unit="°C" src={TERM} />;
}

function MakersTable() {
  return (
    <DataTable id="wd-manuals" variant="ruled" src={MFR} caption="What six welders’ manuals give for a 240 V circuit (Lincoln: 230 V)">
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Welder
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Wire
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0 !whitespace-normal')}>
            Fuse or breaker
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0 !whitespace-normal')}>
            Supply current
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0 !whitespace-normal')}>
            Longest run
          </th>
        </tr>
      </thead>
      <tbody>
        {WELDERS.map((w) => (
          <tr key={w.id}>
            <th scope="row" className={clsx(RSTICKY_TD, '!min-w-[8.5rem] !whitespace-normal !font-display !font-normal')} data-src={MFR}>
              {w.brand} {w.model}
            </th>
            <td className={RTD}>
              <Size s={w.minConductor} />
            </td>
            <td className={clsx(RTD, '!min-w-[9rem] !whitespace-normal')} data-src={MFR}>
              {w.fuseTimeDelayA !== null && w.fuseNormalA !== null ? (
                <>
                  <A v={w.fuseTimeDelayA} /> time-delay, <A v={w.fuseNormalA} /> normal
                </>
              ) : (
                <A v={manualOcpd(w)} />
              )}
            </td>
            <td className={clsx(RTD, '!min-w-[8rem] !whitespace-normal')} data-src={MFR}>
              {w.i1maxA !== null ? (
                <>
                  I1max <A v={w.i1maxA} />
                </>
              ) : w.inputAtRatedA !== null ? (
                <>
                  <A v={w.inputAtRatedA} /> at rated output
                </>
              ) : (
                'not given'
              )}
            </td>
            <td className={clsx(RTD, '!min-w-[7rem] !whitespace-normal')} data-src={MFR}>
              {w.maxLengthFt !== null ? (
                <Val v={w.maxLengthFt} unit="ft" src={MFR} />
              ) : w.longRun ? (
                <>
                  <Size s={w.longRun.conductor} /> past <Val v={w.longRun.overFt} unit="ft" src={MFR} />
                </>
              ) : (
                'not given'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function PresetTable() {
  return (
    <DataTable
      id="wd-columns"
      variant="ruled"
      src={CALC}
      caption={`Copper wire 630.12(B) allows for the manual’s breaker on a short run, by terminal rating`}
    >
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Welder
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Breaker
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')} data-src={TERM}>
            Copper <C v={WD_LOW} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')} data-src={TERM}>
            Copper <C v={WD_HIGH} />
          </th>
        </tr>
      </thead>
      <tbody>
        {PRESET_ROWS.map((r) => (
          <tr key={r.welder.id}>
            <th scope="row" className={clsx(RSTICKY_TD, '!min-w-[8.5rem] !whitespace-normal !font-display !font-normal')} data-src={MFR}>
              {r.welder.brand} {r.welder.model}
            </th>
            <td className={RTD}>
              <A v={r.ocpdA} />
            </td>
            <td className={RTD}>
              <Size s={r.cu60.size} />
            </td>
            <td className={RTD}>
              <Size s={r.cu75.size} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function DropTable() {
  return (
    <DataTable
      id="wd-drop"
      variant="ruled"
      src={CALC}
      caption={`One-way length at which an I1max of ${EX.i1maxA} A at ${WD_VOLTS} V drops ${WD_DROP_PCT} %`}
    >
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Copper
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Length
          </th>
        </tr>
      </thead>
      <tbody>
        {DROP_ROWS.map((r) => (
          <tr key={r.size}>
            <th scope="row" className={RSTICKY_TD}>
              <Size s={r.size} />
            </th>
            <td className={RTD}>
              <Val v={r.ft} unit="ft" src={CALC} format={{ sig: 3 }} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function WelderCalculatorPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Welder Wire Size Calculator" sub="240 V Wire and Breaker Size" joiner=": " src={MFR} />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            The copper wire, breaker and ground wire for a welder: start from the minimum wire in its manual, and the calculator applies the
            NEC&apos;s breaker limits for welders and the voltage drop over your run.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <WelderTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={CALC}>
            <strong>
              Miller&apos;s {EX.model}, <Val v={EXAMPLE_FT} unit="ft" src={CALC} /> from the panel, takes <Size s={EXAMPLE.size} /> copper on the{' '}
              <A v={EX_TD} /> time-delay fuse Miller lists, or a comparable breaker, with a <Size s={EXAMPLE.egc} /> ground wire.
            </strong>{' '}
            <span data-src={N630}>
              Miller&apos;s minimum, <Size s={EX.minConductor} />, is enough on a short run with <C v={WD_HIGH} /> terminals; at <C v={WD_LOW} /> it
              carries <A v={EX_TOO_SMALL.ampacity} src={AMP} />, and 630.12(B) holds its breaker to <A v={EX_TOO_SMALL.limitA} src={CALC} />.
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="manuals" className="space-y-5">
            <h2 id="manuals" className={H2}>
              What the welder&apos;s manual sets
            </h2>
            <p className={P} data-src={MFR}>
              A welder&apos;s manual has an electrical service guide: the supply current, the fuse or breaker and the smallest copper wire for one
              welder on its own circuit. Miller&apos;s current guides size the wire by Table 310.16 for <C v={WD_HIGH} /> copper and name the NEC
              edition behind them; Lincoln&apos;s POWER MIG 210 MP table is for <C v={WD_HIGH} /> copper in conduit. I1max is the supply current at the
              welder&apos;s maximum rated output, the number the NEC&apos;s breaker limit uses.
            </p>
            <MakersTable />
            <p className={P} data-src={MFR}>
              Miller&apos;s time-delay fuses are class RK5 and its normal-operating fuses class K5; for a circuit breaker it asks for time-current
              curves comparable to the fuse. The supply current is the welder&apos;s input, not its welding output: the {MM220.model} is rated{' '}
              {MM220.ratedOutput}, and its I1max is <A v={MM220.i1maxA as number} />.
            </p>
          </section>

          <section aria-labelledby="breaker" className="space-y-5">
            <h2 id="breaker" className={H2}>
              The breaker: 630.12
            </h2>
            <p className={P} data-src={N630}>
              630.12(A) holds a welder&apos;s breaker or fuse to <Val v={WELDER_OCPD.pctOfI1max} unit="%" src={N630} /> of I1max, or of the rated
              primary current where the nameplate gives no I1max. 630.12(B) holds it to <Val v={WELDER_OCPD.pctOfAmpacity} unit="%" src={N630} /> of
              the ampacity of the wire it protects. Where either value is not a standard rating, the next standard rating is permitted.
            </p>
            <p className={P} data-src={SMALL}>
              On other circuits 240.4(D) holds <Size s="14" /> copper to <A v={LIMIT_14} src={SMALL} />, <Size s="12" /> to{' '}
              <A v={LIMIT_12} src={SMALL} /> and <Size s="10" /> to <A v={LIMIT_10} src={SMALL} />. Table 240.4(G) sends welder circuit conductors to
              630.12 instead, so <A v={EX_NORMAL} /> fuses on <Size s={EX.minConductor} /> wire, as Miller lists for the {EX.model}, are judged by
              630.12(B).
            </p>
            <p className={P} data-src={CALC}>
              The terminal rating sets the ampacity: at <C v={WD_LOW} />, <Size s={EX_TOO_SMALL.size} /> carries <A v={EX_TOO_SMALL.ampacity} src={AMP} />,
              so its breaker can be at most <A v={EX_TOO_SMALL.limitA} src={CALC} />; at <C v={WD_HIGH} /> it carries{' '}
              <A v={EXAMPLE_75.firstAmpacity} src={AMP} />, so <A v={EXAMPLE_75.firstLimitA} src={CALC} />. The table runs each welder&apos;s breaker
              through both, on a run short enough that the drop does not move the wire.
            </p>
            <PresetTable />
          </section>

          <section aria-labelledby="long-runs" className="space-y-5">
            <h2 id="long-runs" className={H2}>
              Long runs and voltage drop
            </h2>
            <p className={P} data-src={MFR}>
              Miller gives a longest run for its minimum wire: <Val v={EX.maxLengthFt as number} unit="ft" src={MFR} /> for the {EX.model}&apos;s{' '}
              <Size s={EX.minConductor} />, <Val v={MM220.maxLengthFt as number} unit="ft" src={MFR} /> for the {MM220.model}&apos;s{' '}
              <Size s={MM220.minConductor} />. Lincoln asks for <Size s={AC225_LONG.conductor} /> on {AC225.model} runs over{' '}
              <Val v={AC225_LONG.overFt} unit="ft" src={MFR} />.
            </p>
            <p className={P} data-src={CALC}>
              The calculator takes the drop at I1max, copper at <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} />, and moves the wire up past your
              target. At the {EX.model}&apos;s I1max of <A v={EX.i1maxA as number} /> and <Val v={WD_VOLTS} unit="V" src={CALC} />, each size drops{' '}
              <Val v={WD_DROP_PCT} unit="%" src="input" /> at these lengths:
            </p>
            <DropTable />
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    The longest one-way copper run before the {EX.model}&apos;s I1max drops <Val v={WD_DROP_PCT} unit="%" src="input" /> at{' '}
                    <Val v={WD_VOLTS} unit="V" src={CALC} />.
                  </span>
                  <SourceLine domains={[AMP, RES]} />
                </>
              }
            >
              <WelderDropChart />
            </Figure>
          </section>

          <section aria-labelledby="receptacle" className="space-y-5">
            <h2 id="receptacle" className={H2}>
              The receptacle and the disconnect
            </h2>
            <p className={P} data-src={N630}>
              630.13 asks for a disconnecting means in the supply circuit of each arc welder that has none built in: a switch, a circuit breaker or a
              listed cord-and-plug connector, rated for the welder&apos;s overcurrent protection. A plug and receptacle can be it.
            </p>
            <p className={P} data-src={NEMA}>
              Lincoln&apos;s {AC225.model} comes with a NEMA 6-50P plug for a NEMA 6-50R receptacle, a <Val v={R650.amps} unit="A" src={NEMA} />,{' '}
              <Val v={R650_V} unit="V" src={NEMA} /> configuration, and asks for <A v={manualOcpd(AC225)} /> super lag fuses on both hot lines.
            </p>
          </section>

          <section aria-labelledby="gfci" className="space-y-5">
            <h2 id="gfci" className={H2}>
              GFCI in the welding area
            </h2>
            <p className={P} data-src={N630}>
              630.8 asks for GFCI protection on the <Val v={WELDING_AREA_GFCI.volts} unit="V" src={N630} />,{' '}
              <A v={WELDING_AREA_GFCI.amps[0]} src={N630} /> and <A v={WELDING_AREA_GFCI.amps[1]} src={N630} /> receptacles for hand tools and
              portable lighting in work areas where welders are operated, on single-phase circuits of{' '}
              <Val v={WELDING_AREA_GFCI.maxVoltsToGround} unit="V" src={N630} /> or less to ground. This page does not cover GFCI rules for the
              welder&apos;s own receptacle.
            </p>
          </section>

          <section aria-labelledby="not-covered" className="space-y-5">
            <h2 id="not-covered" className={H2}>
              What the calculator does not cover
            </h2>
            <ul className={clsx(P, 'list-disc space-y-2 pl-6')}>
              <li>
                The NEC&apos;s own rule for sizing a welder&apos;s supply wire, which this site has not read in a 2023 source: the calculator starts from
                the manual&apos;s minimum.
              </li>
              <li>Two or more welders on one circuit or feeder, resistance welders and three-phase supplies.</li>
              <li data-src={MFR}>
                <Val v={208} unit="V" src={CALC} /> supplies: the makers&apos; guides give <Val v={WD_VOLTS} unit="V" src={MFR} /> values (Lincoln{' '}
                <Val v={LN210.supplyV} unit="V" src={MFR} />).
              </li>
              <li data-src={MFR}>
                Corrections for a hot room or for more than three current-carrying wires in a conduit; Miller&apos;s 2026 guides correct their minimum
                wire for a <Val v={MILLER_AMBIENT_C} unit="°C" src={MFR} /> room.
              </li>
            </ul>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR}>
                What size wire for a <Val v={WD_VOLTS} unit="V" src={MFR} /> welder?
              </h3>
              <p className={P} data-src={MFR}>
                Start from its manual: Miller lists <Size s={EX.minConductor} /> copper for the {EX.model} and <Size s={MM220.minConductor} /> for the{' '}
                {MM220.model}, Lincoln <Size s={LN210.minConductor} /> for the POWER MIG 210 MP and <Size s={AC225.minConductor} /> for the{' '}
                {AC225.model}. With <C v={WD_LOW} /> terminals, 630.12(B) can move it up a size, and long runs move it up for the drop.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What size breaker for a welder?</h3>
              <p className={P} data-src={CALC}>
                At most <Val v={WELDER_OCPD.pctOfI1max} unit="%" src={N630} /> of I1max and <Val v={WELDER_OCPD.pctOfAmpacity} unit="%" src={N630} /> of
                the wire&apos;s ampacity, the next standard rating permitted (630.12). For the {EX.model}&apos;s <A v={EX.i1maxA as number} />, that is{' '}
                <A v={EXAMPLE.welderLimitA} src={CALC} /> by the welder, and <A v={EXAMPLE.firstLimitA} src={CALC} /> on <Size s={EXAMPLE.firstSize} />{' '}
                at <C v={WD_LOW} />; Miller lists <A v={EX_TD} /> time-delay or <A v={EX_NORMAL} /> fuses.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={CALC}>
                Can a welder go on a <A v={FIFTY_A} src="input" /> breaker?
              </h3>
              <p className={P} data-src={CALC}>
                If both limits allow it. For the {EX.model}, <A v={FIFTY_A} src="input" /> is within the <A v={FIFTY_60.welderLimitA} src={CALC} /> of
                630.12(A), and the wire must carry half of it: <Size s={FIFTY_60.firstSize} /> copper at <C v={WD_LOW} />, or{' '}
                <Size s={FIFTY_75.firstSize} /> at <C v={WD_HIGH} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={CALC}>
                What wire for a welder <Val v={LONG_RUN_FT} unit="ft" src={CALC} /> from the panel?
              </h3>
              <p className={P} data-src={CALC}>
                For the {EX.model}, <Size s={LONG_RUN.size} /> copper keeps the drop at I1max to{' '}
                <Val v={LONG_RUN.vdPct} unit="%" src={CALC} format={{ fixed: 2 }} />; <Size s={LONG_RUN.firstSize} /> would reach{' '}
                <Val v={LONG_RUN.firstVdPct} unit="%" src={CALC} format={{ fixed: 2 }} />. The ground wire grows with it, to <Size s={LONG_RUN.egc} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does a welder need a GFCI?</h3>
              <p className={P} data-src={N630}>
                630.8 asks for GFCI on the <Val v={WELDING_AREA_GFCI.volts} unit="V" src={N630} /> receptacles for hand tools and lighting in the
                welding area. Whether the welder&apos;s own receptacle needs it is set by other NEC rules, which this page does not cover.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Can I use aluminum wire for a welder?</h3>
              <p className={P} data-src={MFR}>
                The makers&apos; guides give copper sizes only, and so does the calculator.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, TERM, OCPD, SMALL, GND, RES, G440, N630, MFR, NEMA]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The breaker limits are the 2023 NEC&apos;s; the{' '}
              <Link href="/guides/nec-code-compliance" className={LINK}>
                NEC edition by state
              </Link>{' '}
              shows which edition applies where you live. The{' '}
              <Link href="/methodology#welder-method" className={LINK}>
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
