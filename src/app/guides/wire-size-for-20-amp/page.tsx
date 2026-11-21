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
import { Cfg, Ft, LengthTable, Pair, Pct, ReceptacleTable } from '@/components/look/AmpParts';
import { LengthBars, LimitChart } from '@/components/look/Charts';
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
import { AMP_VOLTS, wireSizeLink } from '@/lib/amp-guide';
import { GUIDE_20, LIMIT_ROWS, LOW_VOLTS } from '@/lib/amp-guides';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import { VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { EV_OCPD_PERCENT } from '@/lib/verified/nec-625';
import { NM_CABLE } from '@/lib/verified/nec-separate-buildings';

// /guides/wire-size-for-20-amp (WSZ-042; research/kw: primary "wire size for 20 amp"): 12 AWG copper or 10 AWG aluminum
// in every column; why 14 AWG, which Table 310.16 lists at 20 A at 75 °C, may not go on a 20 A breaker (nec-240-4-d,
// nec-310-16, nec-110-14c); 120 V against 240 V over a run, with the 100 ft answer (conductor-resistance-20c, the
// 215.2(A) note: nec-continuous-load); the 5-20R and 6-20R (nema-receptacle-configs); a 16 A EV charger (nec-625-ev)
// and a plug-in hot tub (mfr-spas) on 20 A; NM cable (nec-cable-rules); the ground wire (nec-250-grounding). Every value
// from src/lib/amp-guides.ts.
const ROUTE = '/guides/wire-size-for-20-amp';
const URL = `https://wiresizes.com${ROUTE}`;

const G = GUIDE_20;
const { run: RUN } = G;
const CU12 = G.lengths.cu[0];
const CU10 = G.lengths.cu[1];
if (CU12.size !== G.cu) throw new Error('20 A guide: the length rows no longer start at the answer');

const TITLE = `Wire Size for ${G.ratingA} Amp Breaker: ${G.cu} AWG Copper`;
const DESCRIPTION =
  `A ${G.ratingA} A breaker takes ${G.cu} AWG copper or ${G.al} AWG aluminum. ${G.small.size} AWG copper is held to ${G.small.maxA} A by 240.4(D), ` +
  `and over ${RUN.lengthFt} ft at ${LOW_VOLTS} V the full load needs ${RUN.need120.size} AWG to stay within ${VOLTAGE_DROP_NOTE.feederPct} %.`;

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
const NEMA = 'nema-receptacle-configs';
const EV = 'nec-625-ev';
const SPAS = 'mfr-spas';
const RES = 'conductor-resistance-20c';
const VD = 'calc:voltage-drop';

const TOC: ([string, string] | [string, string, string])[] = [
  ['fourteen', `Why ${G.small.size} AWG can't go on a ${G.ratingA} A breaker`, SMALL],
  ['volts', `${G.ratingA} A at ${LOW_VOLTS} V and at ${AMP_VOLTS} V`, VD],
  ['receptacles', `${G.ratingA} A receptacles`, NEMA],
  ['loads', `What else runs on ${G.ratingA} A`, EV],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: `Wire Size for ${G.ratingA} Amp Breaker`, description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

function A({ v, src = OCPD }: { v: number; src?: string }) {
  return <Val v={v} unit="A" src={src} />;
}
function C({ v }: { v: number }) {
  return <Val v={v} unit="°C" src={AMP} />;
}
function V({ v }: { v: number }) {
  return <Val v={v} unit="V" src={VD} />;
}

export default function WireSizeFor20AmpPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main={`Wire Size for ${G.ratingA} Amp Breaker`} sub={`${G.cu} AWG Copper`} joiner=": " src={AMP} />
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
          <div className="space-y-4">
            <p className={LOOK_LEAD} data-src={SMALL}>
              <strong>
                A <A v={G.ratingA} /> breaker takes <Pair cu={G.cu} al={G.al} />, whatever the terminals or cable.
              </strong>{' '}
              <span data-src={AMP}>
                <Size s={G.small.size} /> copper reaches <A v={G.small.a75} src={AMP} /> in the <C v={G.high} /> column of Table 310.16, but
                240.4(D) limits it to a <A v={G.small.maxA} src={SMALL} /> breaker.
              </span>
            </p>
            <p className={P} data-src={GND}>
              The ground wire is <Pair cu={G.egc.cu} al={G.egc.al} /> (Table 250.122).{' '}
              <span data-src={VD}>
                Over <Val v={RUN.lengthFt} unit="ft" src={VD} /> the full <A v={G.ratingA} /> on <Size s={G.cu} /> drops <Pct run={RUN.cu120} /> at{' '}
                <V v={LOW_VOLTS} /> and <Pct run={RUN.cu240} /> at <V v={AMP_VOLTS} />.
              </span>
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={SMALL}>
                  Each bar ends at the largest breaker 240.4(D) allows on the size; the dots show its Table 310.16 ampacity at <C v={G.low} /> (open)
                  and <C v={G.high} /> (filled). <Size s={G.small.size} /> copper&apos;s <C v={G.high} /> dot reaches <A v={G.ratingA} />, its bar
                  stops at <A v={G.small.maxA} src={SMALL} />.
                </span>
                <SourceLine domains={[AMP, SMALL]} />
              </>
            }
          >
            <LimitChart rows={LIMIT_ROWS} highlight={[`${G.cu}-Cu`, `${G.al}-Al`]} ratingA={G.ratingA} low={G.low} high={G.high} />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="fourteen" className="space-y-4">
            <h2 id="fourteen" className={H2} data-src={SMALL}>
              Why <Size s={G.small.size} /> can&apos;t go on a <A v={G.ratingA} /> breaker
            </h2>
            <p className={P} data-src={AMP}>
              Read from Table 310.16 alone, a <A v={G.ratingA} /> circuit with <C v={G.high} /> terminations would take <Size s={G.small.size} />{' '}
              copper: it carries <A v={G.small.a60} src={AMP} /> at <C v={G.low} /> and <A v={G.small.a75} src={AMP} /> at <C v={G.high} />.{' '}
              <span data-src={SMALL}>
                240.4(D) overrides the table for the small sizes. It holds <Size s={G.small.size} /> copper to a <A v={G.small.maxA} src={SMALL} />{' '}
                breaker and <Size s={G.cu} /> copper to <A v={G.cuRow.maxA} src={SMALL} />, so <Size s={G.cu} /> is the smallest copper a{' '}
                <A v={G.ratingA} /> breaker may protect.
              </span>
            </p>
            <p className={P} data-src={SMALL}>
              Aluminum moves the same way: <Size s={G.smallAl.size} /> aluminum carries <A v={G.smallAl.a75} src={AMP} /> at <C v={G.high} />, but
              240.4(D) holds it to <A v={G.smallAl.maxA} src={SMALL} />, so a <A v={G.ratingA} /> breaker takes <Size s={G.al} /> aluminum.{' '}
              <span data-src={TERM}>
                The terminal rating of 110.14(C), which splits the answer at larger ratings, makes no difference here.
              </span>
            </p>
            <p className={P} data-src={CABLE}>
              In NM cable, 334.80 holds <Size s={G.cu} /> copper to the <Val v={NM_CABLE.maxColumnC} unit="°C" src={CABLE} /> column, where it carries{' '}
              <A v={G.cuRow.a60} src={AMP} />: the same size, at exactly the breaker&apos;s rating.
            </p>
          </section>

          <section aria-labelledby="volts" className="space-y-5">
            <h2 id="volts" className={H2} data-src={VD}>
              <A v={G.ratingA} /> at <V v={LOW_VOLTS} /> and at <V v={AMP_VOLTS} />
            </h2>
            <p className={P} data-src={VD}>
              The wire size is the same at either voltage; the distance is not. The same current drops the same number of volts, which is twice
              the percentage of <V v={LOW_VOLTS} /> as of <V v={AMP_VOLTS} />. At the full <A v={G.ratingA} />, single-phase with the conductors
              at <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} />, <Size s={G.cu} /> copper reaches{' '}
              <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> at <Ft v={CU12.ft120} /> on <V v={LOW_VOLTS} /> and at{' '}
              <Ft v={CU12.ft240} /> on <V v={AMP_VOLTS} />.
            </p>
            <p className={P} data-src={LOAD}>
              That <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> comes from an informational note to 215.2(A), which says feeders
              sized to keep the drop under it, with no more than <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={LOAD} /> on feeder and branch
              circuits together, will provide reasonable efficiency. It is advice, not a limit.{' '}
              <span data-src={VD}>
                Over <Val v={RUN.lengthFt} unit="ft" src={VD} />, staying within it at full load takes <Size s={RUN.need120.size} /> copper at{' '}
                <V v={LOW_VOLTS} /> (<Pct run={RUN.need120} />) and <Size s={RUN.need240.size} /> at <V v={AMP_VOLTS} /> (<Pct run={RUN.need240} />).
              </span>
            </p>
            <Figure
              caption={
                <>
                  <span data-src={VD}>
                    One-way length at which <A v={G.ratingA} /> drops <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> on copper, at{' '}
                    <V v={LOW_VOLTS} /> (gray) and <V v={AMP_VOLTS} /> (copper).
                  </span>
                  <SourceLine domains={[RES, LOAD]} />
                </>
              }
            >
              <LengthBars rows={G.lengths.cu} ratingA={G.ratingA} highlight={G.cu} />
            </Figure>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <LengthTable id="lengths-20-cu" rows={G.lengths.cu} metal="Copper" both lowVolts={LOW_VOLTS} highVolts={AMP_VOLTS} />
              <LengthTable id="lengths-20-al" rows={G.lengths.al} metal="Aluminum" both lowVolts={LOW_VOLTS} highVolts={AMP_VOLTS} />
            </div>
            <p className={P}>
              A larger wire for distance takes a larger ground wire too (250.122(B)); the{' '}
              <Link href={wireSizeLink(G.ratingA, { length: RUN.lengthFt })} className={LINK}>
                wire size calculator
              </Link>{' '}
              sizes both for your length and load.
            </p>
          </section>

          <section aria-labelledby="receptacles" className="space-y-5">
            <h2 id="receptacles" className={H2} data-src={NEMA}>
              <A v={G.ratingA} src={NEMA} /> receptacles
            </h2>
            <p className={P} data-src={NEMA}>
              Two NEMA receptacles carry a <A v={G.ratingA} src={NEMA} /> rating: the <Cfg c={G.receptacles[0].config} /> at{' '}
              {G.receptacles[0].volts} V, with a hot and a neutral, and the <Cfg c={G.receptacles[1].config} /> at {G.receptacles[1].volts} V, with
              two hots. Both take the circuit&apos;s <Size s={G.cu} /> copper.
            </p>
            <ReceptacleTable id="receptacles-20" configs={G.receptacles} caption={`The ${G.ratingA} A receptacles`} />
          </section>

          <section aria-labelledby="loads" className="space-y-4">
            <h2 id="loads" className={H2} data-src={EV}>
              What else runs on <A v={G.ratingA} />
            </h2>
            <p className={P} data-src={EV}>
              An EV charger set to a <A v={G.ev.outputA} src={EV} /> output goes on a <A v={G.ev.breakerA} src={EV} /> breaker: 625.41 calls for
              a breaker of at least <Val v={EV_OCPD_PERCENT} unit="%" src={EV} /> of the output. The{' '}
              <Link href="/guides/wire-size-for-ev-charger" className={LINK}>
                EV charger wire guide
              </Link>{' '}
              has the makers&apos; tables.
            </p>
            <p className={P} data-src={SPAS}>
              The {G.plugIn.join(' and ')} plug-in hot tub lists a <A v={G.ratingA} src={SPAS} /> circuit at <Val v={LOW_VOLTS} unit="V" src={SPAS} />;
              the{' '}
              <Link href="/calculators/hot-tub-calculator" className={LINK}>
                hot tub calculator
              </Link>{' '}
              sizes it with the drop over your run.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Is <Size s={G.cu} /> wire good for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={SMALL}>
                Yes: <Size s={G.cu} /> copper carries <A v={G.cuRow.a60} src={AMP} /> at <C v={G.low} />, and 240.4(D) allows up to a{' '}
                <A v={G.cuRow.maxA} src={SMALL} /> breaker on it.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Can I use <Size s={CU10.size} /> wire on a <A v={G.ratingA} /> breaker?
              </h3>
              <p className={P} data-src={VD}>
                Yes. A larger wire is always allowed, and it runs farther: <Size s={CU10.size} /> copper reaches{' '}
                <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> at <Ft v={CU10.ft120} /> on <V v={LOW_VOLTS} />, against{' '}
                <Ft v={CU12.ft120} /> for <Size s={G.cu} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={VD}>
                What size wire for a <A v={G.ratingA} /> circuit <Val v={RUN.lengthFt} unit="ft" src={VD} /> away?
              </h3>
              <p className={P} data-src={VD}>
                For the full load within <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />: <Size s={RUN.need120.size} /> copper at{' '}
                <V v={LOW_VOLTS} />, <Size s={RUN.need240.size} /> at <V v={AMP_VOLTS} />. A lighter load can stay on a smaller size.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={CABLE}>
                What size NM cable for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={CABLE}>
                <Size s={G.cu} /> copper NM cable: it carries <A v={G.cuRow.a60} src={AMP} /> in the{' '}
                <Val v={NM_CABLE.maxColumnC} unit="°C" src={CABLE} /> column 334.80 holds it to.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size aluminum wire for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={SMALL}>
                <Size s={G.al} /> aluminum, with a <Size s={G.egc.al} /> aluminum ground wire. <Size s={G.smallAl.size} /> aluminum is held to{' '}
                <A v={G.smallAl.maxA} src={SMALL} /> by 240.4(D).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={GND}>
                What size ground wire for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={GND}>
                <Pair cu={G.egc.cu} al={G.egc.al} />, from the <A v={G.egc.rowA} src={GND} /> row of Table 250.122.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, SMALL, TERM, CABLE, OCPD, GND, NEMA, EV, SPAS, LOAD, RES]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#small-conductors" className={LINK}>
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
