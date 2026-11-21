import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { Byline } from '@/components/content/Byline';
import { Figure } from '@/components/content/Figure';
import { Size } from '@/components/content/Size';
import { SourceLine } from '@/components/content/SourceLine';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { Cfg, DropText, Ft, LadderTable, LengthTable, Pair, Pct } from '@/components/look/AmpParts';
import { AmpDropChart, AmpLadder } from '@/components/look/Charts';
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
import { GUIDE_40, LOW_VOLTS } from '@/lib/amp-guides';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import { VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { EV_OCPD_PERCENT } from '@/lib/verified/nec-625';
import { TABLE_AMBIENT } from '@/lib/verified/nec-310-16';
import { DISCONNECT_MIN_A, NM_CABLE } from '@/lib/verified/nec-separate-buildings';

// /guides/wire-size-for-40-amp (WSZ-042; research/kw: primary "wire size for 40 amp"): 8 AWG copper in every column and
// aluminum split by the terminals (nec-310-16, nec-110-14c, nec-cable-rules); 8 AWG NM cable at exactly 40 A; ranges
// (Frigidaire's and Whirlpool's instructions: mfr-dryer-range) and 32 A EV chargers (nec-625-ev) on 40 A; the voltage
// drop at 240 V (conductor-resistance-20c, the 215.2(A) note: nec-continuous-load); 10 AWG held to 30 A (nec-240-4-d)
// with Table 240.4(G)'s air conditioners (nec-440-hvac); a 40 A subpanel (nec-250-32, nec-feeders-outbuildings); the
// ground wire (nec-250-grounding). Every value from src/lib/amp-guides.ts.
const ROUTE = '/guides/wire-size-for-40-amp';
const URL = `https://wiresizes.com${ROUTE}`;

const G = GUIDE_40;
const { nm: NM, c75: C75, run: RUN, frigidaire: F, whirlpool: W } = G;
const CU8 = G.lengths.cu[0];
if (CU8.size !== NM.cu.size) throw new Error('40 A guide: the length rows no longer start at the answer');

const TITLE = `Wire Size for ${G.ratingA} Amp Breaker: ${NM.cu.size} AWG Copper`;
const DESCRIPTION =
  `A ${G.ratingA} A breaker takes ${NM.cu.size} AWG copper in NM cable or with ${G.high} °C terminations. Aluminum depends on the terminals: ` +
  `${NM.al.size} AWG at ${G.low} °C, ${C75.al.size} AWG at ${G.high} °C. The ground wire is ${G.egc.cu} AWG copper.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'article', locale: 'en_US', siteName: 'WireSizes.com', title: TITLE, description: DESCRIPTION, url: URL, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/twitter-image'] },
};

const AMP = 'nec-310-16';
const TERM = 'nec-110-14c';
const CABLE = 'nec-cable-rules';
const OCPD = 'nec-240-ocpd';
const SMALL = 'nec-240-4-d';
const LOAD = 'nec-continuous-load';
const GND = 'nec-250-grounding';
const SEP = 'nec-250-32';
const OUTB = 'nec-feeders-outbuildings';
const RANGE = 'mfr-dryer-range';
const EV = 'nec-625-ev';
const HVAC = 'nec-440-hvac';
const RES = 'conductor-resistance-20c';
const VD = 'calc:voltage-drop';

const TOC: ([string, string] | [string, string, string])[] = [
  ['column', `Copper stays ${NM.cu.size} AWG; aluminum depends on the terminals`, TERM],
  ['nm-cable', `${NM.cu.size} AWG NM cable at exactly ${G.ratingA} A`, CABLE],
  ['ranges', `Ranges and EV chargers on ${G.ratingA} A`, RANGE],
  ['distance', `${G.ratingA} A at ${AMP_VOLTS} V: how far each size goes`, VD],
  ['ampacities', `Ampacity of the sizes around ${G.ratingA} A`, AMP],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: `Wire Size for ${G.ratingA} Amp Breaker`, description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

function A({ v, src = OCPD }: { v: number; src?: string }) {
  return <Val v={v} unit="A" src={src} />;
}
function C({ v }: { v: number }) {
  return <Val v={v} unit="°C" src={TERM} />;
}

export default function WireSizeFor40AmpPage() {
  const ten = G.ladder.cu[0];
  if (ten.size !== '10') throw new Error('40 A guide: the copper ladder no longer starts at 10 AWG');
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main={`Wire Size for ${G.ratingA} Amp Breaker`} sub={`${NM.cu.size} AWG Copper`} joiner=": " src={AMP} />
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
          <div className="space-y-4">
            <p className={LOOK_LEAD} data-src={AMP}>
              <strong>
                A <A v={G.ratingA} /> breaker takes <Size s={NM.cu.size} /> copper, in NM cable or as single conductors.
              </strong>{' '}
              <span data-src={TERM}>
                Aluminum depends on the terminals: <Size s={NM.al.size} /> at <C v={G.low} />, <Size s={C75.al.size} /> where every termination is
                listed and identified for <C v={G.high} /> conductors.
              </span>
            </p>
            <p className={P} data-src={GND}>
              The ground wire is <Pair cu={G.egc.cu} al={G.egc.al} /> (Table 250.122).{' '}
              <span data-src={VD}>
                At <Val v={AMP_VOLTS} unit="V" src={VD} /> the full <A v={G.ratingA} /> runs <Ft v={CU8.ft240} /> on <Size s={NM.cu.size} /> copper
                before the drop reaches <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />.
              </span>
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={AMP}>
                  The ampacity of the sizes around <A v={G.ratingA} /> in the <C v={G.low} /> column (open dots) and the <C v={G.high} /> column
                  (filled). <Size s={NM.cu.size} /> copper reaches <A v={G.ratingA} /> in both; <Size s={C75.al.size} /> aluminum only in the{' '}
                  <C v={G.high} /> column.
                </span>
                <SourceLine domains={[AMP, TERM]} />
              </>
            }
          >
            <AmpLadder guide={G} />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="column" className="space-y-4">
            <h2 id="column" className={H2} data-src={TERM}>
              Copper stays <Size s={NM.cu.size} />; aluminum depends on the terminals
            </h2>
            <p className={P} data-src={TERM}>
              Under 110.14(C)(1)(a), circuits of this size start from the <C v={G.low} /> column of Table 310.16, and use the <C v={G.high} /> column
              only where the equipment is listed and identified for <C v={G.high} /> conductors. At <A v={G.ratingA} /> that choice moves aluminum,
              not copper.
            </p>
            <p className={P} data-src={AMP}>
              <Size s={NM.cu.size} /> copper carries <A v={NM.cu.ampacity} src={AMP} /> at <C v={G.low} /> and <A v={C75.cu.ampacity} src={AMP} /> at{' '}
              <C v={G.high} />. The next size down, <Size s={ten.size} />, carries only <A v={ten.a75} src={AMP} /> even at <C v={G.high} />,{' '}
              <span data-src={SMALL}>and 240.4(D) holds it to a <A v={G.tenLimitA} src={SMALL} /> breaker anyway.</span> In aluminum,{' '}
              <Size s={NM.al.size} /> carries <A v={NM.al.ampacity} src={AMP} /> at <C v={G.low} />, while <Size s={C75.al.size} /> reaches{' '}
              <A v={C75.al.ampacity} src={AMP} /> only at <C v={G.high} />.
            </p>
          </section>

          <section aria-labelledby="nm-cable" className="space-y-4">
            <h2 id="nm-cable" className={H2} data-src={CABLE}>
              <Size s={NM.cu.size} /> NM cable at exactly <A v={G.ratingA} />
            </h2>
            <p className={P} data-src={CABLE}>
              334.80 holds NM cable to the <Val v={NM_CABLE.maxColumnC} unit="°C" src={CABLE} /> column, where <Size s={NM.cu.size} /> copper
              carries <A v={NM.cu.ampacity} src={AMP} />, the breaker&apos;s rating with nothing to spare. Its{' '}
              <Val v={NM_CABLE.correctionsFromC} unit="°C" src={CABLE} /> rating is the starting point for heat and bundling corrections, and the
              result may not exceed the <Val v={NM_CABLE.maxColumnC} unit="°C" src={CABLE} /> value. The{' '}
              <Link href={wireSizeLink(G.ratingA)} className={LINK}>
                wire size calculator
              </Link>{' '}
              applies both for cable in a hot attic or bundled with others.
            </p>
          </section>

          <section aria-labelledby="ranges" className="space-y-4">
            <h2 id="ranges" className={H2} data-src={RANGE}>
              Ranges and EV chargers on <A v={G.ratingA} />
            </h2>
            <p className={P} data-src={RANGE}>
              {F.brand}&apos;s electric range instructions call for a <Cfg c={F.receptacle} /> with a matching{' '}
              <A v={F.cordA} src={RANGE} /> range cord, and on a 4-wire <A v={G.ratingA} /> circuit at least <Size s={F.hot} /> copper for the hots,{' '}
              <Size s={F.neutral} /> for the neutral and <Size s={F.ground} /> for the ground, a size larger than the <Size s={G.egc.cu} /> of{' '}
              <span data-src={GND}>Table 250.122</span>. {W.brand}&apos;s freestanding
              ranges rated <Val v={W.kwFrom} unit="kW" src={RANGE} /> to <Val v={W.kwTo} unit="kW" src={RANGE} /> at{' '}
              <Val v={AMP_VOLTS} unit="V" src={RANGE} /> take a <A v={W.circuitsA[0]} src={RANGE} /> or <A v={W.circuitsA[1]} src={RANGE} /> circuit.
              The{' '}
              <Link href="/calculators/range-calculator" className={LINK}>
                range calculator
              </Link>{' '}
              works out a range&apos;s load from its rating.
            </p>
            <p className={P} data-src={EV}>
              An EV charger set to a <A v={G.ev.outputA} src={EV} /> output goes on a <A v={G.ev.breakerA} src={EV} /> breaker, because 625.41
              calls for at least <Val v={EV_OCPD_PERCENT} unit="%" src={EV} /> of the output. The{' '}
              <Link href="/guides/wire-size-for-ev-charger" className={LINK}>
                EV charger wire guide
              </Link>{' '}
              has the makers&apos; tables.
            </p>
          </section>

          <section aria-labelledby="distance" className="space-y-5">
            <h2 id="distance" className={H2} data-src={VD}>
              <A v={G.ratingA} /> at <Val v={AMP_VOLTS} unit="V" src={VD} />: how far each size goes
            </h2>
            <p className={P} data-src={VD}>
              At the full <A v={G.ratingA} /> over <Val v={RUN.lengthFt} unit="ft" src={VD} />, single-phase at <Val v={AMP_VOLTS} unit="V" src={VD} />{' '}
              with the conductors at <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} />: <Size s={NM.cu.size} /> copper drops <DropText run={RUN.cu} />,{' '}
              <Size s={NM.al.size} /> aluminum <DropText run={RUN.alNm} /> and <Size s={C75.al.size} /> aluminum <DropText run={RUN.al75} />.
            </p>
            <p className={P} data-src={LOAD}>
              An informational note to 215.2(A) says feeders sized to keep the drop under <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />,
              with no more than <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={LOAD} /> on feeder and branch circuits together, will provide
              reasonable efficiency. It is advice, not a limit; the lengths below are where each size reaches it at the full rating.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={VD}>
                    Voltage drop of a <A v={G.ratingA} /> circuit at full load, single-phase at <Val v={AMP_VOLTS} unit="V" src={VD} />, against one-way
                    length, with the 215.2(A) note&apos;s <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />.
                  </span>
                  <SourceLine domains={[AMP, RES, LOAD]} />
                </>
              }
            >
              <AmpDropChart guide={G} lengths={DROP_50_LENGTHS} />
            </Figure>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <LengthTable id="lengths-40-cu" rows={G.lengths.cu} metal="Copper" both={false} lowVolts={LOW_VOLTS} highVolts={AMP_VOLTS} />
              <LengthTable id="lengths-40-al" rows={G.lengths.al} metal="Aluminum" both={false} lowVolts={LOW_VOLTS} highVolts={AMP_VOLTS} />
            </div>
            <p className={P} data-src={GND}>
              A larger wire for distance takes a larger ground wire too, in proportion (250.122(B)); the wire size calculator sizes both.
            </p>
          </section>

          <section aria-labelledby="ampacities" className="space-y-5">
            <h2 id="ampacities" className={H2} data-src={AMP}>
              Ampacity of the sizes around <A v={G.ratingA} />
            </h2>
            <p className={P} data-src={AMP}>
              Both columns of{' '}
              <Link href="/guides/nec-table-310-16" className={LINK}>
                NEC Table 310.16
              </Link>{' '}
              for the sizes on either side of the answer. The table assumes an ambient temperature of{' '}
              <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} /> and no more than three current-carrying conductors together.
            </p>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <LadderTable id="ampacities-40-cu" rows={G.ladder.cu} metal="Copper" low={G.low} high={G.high} />
              <LadderTable id="ampacities-40-al" rows={G.ladder.al} metal="Aluminum" low={G.low} high={G.high} />
            </div>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Is <Size s={NM.cu.size} /> wire good for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={AMP}>
                Yes, in NM cable or as single conductors: it carries <A v={NM.cu.ampacity} src={AMP} /> at <C v={G.low} /> and{' '}
                <A v={C75.cu.ampacity} src={AMP} /> at <C v={G.high} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Can <Size s={ten.size} /> wire go on a <A v={G.ratingA} /> breaker?
              </h3>
              <p className={P} data-src={SMALL}>
                Not on an ordinary circuit: 240.4(D) protects <Size s={ten.size} /> copper at <A v={G.tenLimitA} src={SMALL} /> at most.{' '}
                <span data-src={HVAC}>
                  Air conditioners are the exception, since Table 240.4(G) sends them to Article 440; the{' '}
                  <Link href="/calculators/air-conditioner-calculator" className={LINK}>
                    air conditioner calculator
                  </Link>{' '}
                  applies it.
                </span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size wire for a <A v={G.ratingA} /> subpanel?
              </h3>
              <p className={P} data-src={AMP}>
                The same sizes: <Size s={NM.cu.size} /> copper, or <Size s={NM.al.size} /> aluminum (<Size s={C75.al.size} /> with{' '}
                <C v={G.high} /> terminations).{' '}
                <span data-src={SEP}>A feeder to a separate building runs four wires, with the ground kept apart from the neutral there (250.32(B)(1)).</span>{' '}
                <span data-src={OUTB}>
                  That building&apos;s disconnect is rated at least <A v={DISCONNECT_MIN_A.allOthers} src={OUTB} /> unless it has no more than two
                  2-wire circuits (225.39).
                </span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size wire for <A v={G.ratingA} /> at <Val v={AMP_VOLTS} unit="V" src={VD} />?
              </h3>
              <p className={P} data-src={VD}>
                <Size s={NM.cu.size} /> copper; at the full <A v={G.ratingA} /> it drops <Pct run={RUN.cu} /> over{' '}
                <Val v={RUN.lengthFt} unit="ft" src={VD} /> and reaches <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> at{' '}
                <Ft v={CU8.ft240} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size aluminum wire for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={TERM}>
                <Size s={NM.al.size} /> at <C v={G.low} /> terminals, <Size s={C75.al.size} /> where every termination is listed and identified for{' '}
                <C v={G.high} /> conductors, with an <Size s={G.egc.al} /> aluminum ground wire.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={GND}>
                What size ground wire for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={GND}>
                <Pair cu={G.egc.cu} al={G.egc.al} />, from the <A v={G.egc.rowA} src={GND} /> row of Table 250.122.{' '}
                <span data-src={RANGE}>
                  {F.brand}&apos;s range instructions ask for <Size s={F.ground} /> copper on their <A v={G.ratingA} src={RANGE} /> circuit.
                </span>
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, TERM, CABLE, OCPD, SMALL, GND, SEP, OUTB, RANGE, EV, HVAC, LOAD, RES]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#terminals" className={LINK}>
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
