import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
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
import { GUIDE_30, LIMIT_ROWS, LOW_VOLTS } from '@/lib/amp-guides';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import { VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { EV_OCPD_PERCENT } from '@/lib/verified/nec-625';

// /guides/wire-size-for-30-amp (WSZ-042; research/kw: primary "wire size for 30 amp"): 10 AWG copper at exactly its
// 240.4(D) limit and 8 AWG aluminum, since 240.4(D) holds 10 AWG aluminum below 30 A (nec-240-4-d, nec-310-16,
// nec-110-14c); 240 V against 120 V, the RV case, with the 100 ft answer (conductor-resistance-20c, the 215.2(A) note:
// nec-continuous-load); the four 30 A receptacles (nema-receptacle-configs) and the dryers (mfr-dryer-range), RV outlet
// and 24 A EV chargers (nec-625-ev) that use them; 10 AWG on a larger breaker only through Table 240.4(G)
// (nec-440-hvac); a 30 A feeder to an outbuilding (225.39: nec-feeders-outbuildings); the ground wire
// (nec-250-grounding). Every value from src/lib/amp-guides.ts.
const ROUTE = '/guides/wire-size-for-30-amp';
const URL = `https://wiresizes.com${ROUTE}`;

const G = GUIDE_30;
const { run: RUN } = G;
const CU10 = G.lengths.cu[0];
if (CU10.size !== G.cu) throw new Error('30 A guide: the length rows no longer start at the answer');

const TITLE = `Wire Size for ${G.ratingA} Amp Breaker: ${G.cu} AWG Copper`;
const DESCRIPTION =
  `A ${G.ratingA} A breaker takes ${G.cu} AWG copper or ${G.al} AWG aluminum, with a ${G.egc.cu} AWG copper ground. ` +
  `${G.ratingA} A is the most 240.4(D) allows on ${G.cu} AWG copper; at ${LOW_VOLTS} V the full load drops ${VOLTAGE_DROP_NOTE.feederPct} % in ${Math.round(CU10.ft120)} ft.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'article', locale: 'en_US', siteName: 'WireSizes.com', title: TITLE, description: DESCRIPTION, url: URL, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/twitter-image'] },
};

const AMP = 'nec-310-16';
const TERM = 'nec-110-14c';
const OCPD = 'nec-240-ocpd';
const SMALL = 'nec-240-4-d';
const LOAD = 'nec-continuous-load';
const GND = 'nec-250-grounding';
const OUTB = 'nec-feeders-outbuildings';
const NEMA = 'nema-receptacle-configs';
const DRYER = 'mfr-dryer-range';
const EV = 'nec-625-ev';
const HVAC = 'nec-440-hvac';
const RES = 'conductor-resistance-20c';
const VD = 'calc:voltage-drop';

const TOC: ([string, string] | [string, string, string])[] = [
  ['limit', `${G.cu} AWG at its limit`, SMALL],
  ['volts', `${G.ratingA} A at ${AMP_VOLTS} V and at ${LOW_VOLTS} V`, VD],
  ['receptacles', `The four ${G.ratingA} A receptacles`, NEMA],
  ['bigger', `${G.cu} AWG on a bigger breaker`, SMALL],
  ['outbuilding', `A ${G.ratingA} A feeder to a shed or garage`, OUTB],
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

export default function WireSizeFor30AmpPage() {
  const [tt30, f630, f1030, f1430] = G.receptacles;
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
                A <A v={G.ratingA} /> breaker takes <Pair cu={G.cu} al={G.al} />, whatever the terminals.
              </strong>{' '}
              <A v={G.ratingA} /> is exactly the most 240.4(D) allows on <Size s={G.cu} /> copper.{' '}
              <span data-src={AMP}>
                <Size s={G.smallAl.size} /> aluminum carries <A v={G.smallAl.a75} src={AMP} /> at <C v={G.high} />, but 240.4(D) stops it at{' '}
                <A v={G.smallAl.maxA} src={SMALL} />, so aluminum goes up to <Size s={G.al} />.
              </span>
            </p>
            <p className={P} data-src={GND}>
              The ground wire is <Pair cu={G.egc.cu} al={G.egc.al} /> (Table 250.122).{' '}
              <span data-src={VD}>
                At <V v={LOW_VOLTS} />, as on an RV&apos;s <Cfg c={G.rv.config} />, the full <A v={G.ratingA} /> drops{' '}
                <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> in <Ft v={CU10.ft120} /> of <Size s={G.cu} />.
              </span>
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={SMALL}>
                  Each bar ends at the largest breaker 240.4(D) allows on the size; the dots show its Table 310.16 ampacity at <C v={G.low} /> (open)
                  and <C v={G.high} /> (filled). <Size s={G.cu} /> copper&apos;s bar ends at <A v={G.ratingA} />; <Size s={G.smallAl.size} />{' '}
                  aluminum&apos;s stops short of it.
                </span>
                <SourceLine domains={[AMP, SMALL]} />
              </>
            }
          >
            <LimitChart rows={LIMIT_ROWS} highlight={[`${G.cu}-Cu`, `${G.smallAl.size}-Al`]} ratingA={G.ratingA} low={G.low} high={G.high} />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="limit" className="space-y-4">
            <h2 id="limit" className={H2} data-src={SMALL}>
              <Size s={G.cu} /> at its limit
            </h2>
            <p className={P} data-src={AMP}>
              Table 310.16 gives <Size s={G.cu} /> copper <A v={G.cuRow.a60} src={AMP} /> at <C v={G.low} /> and <A v={G.cuRow.a75} src={AMP} /> at{' '}
              <C v={G.high} />.{' '}
              <span data-src={SMALL}>
                240.4(D) then caps its breaker at <A v={G.cuRow.maxA} src={SMALL} />, which is this rating exactly, so <Size s={G.cu} /> is both
                the smallest copper a <A v={G.ratingA} /> breaker may protect and the largest breaker that <Size s={G.cu} /> may sit on.
              </span>{' '}
              <span data-src={TERM}>The terminal rating that 110.14(C) looks at changes nothing here.</span>
            </p>
            <p className={P} data-src={SMALL}>
              Aluminum is where the limit bites: <Size s={G.smallAl.size} /> aluminum would reach <A v={G.ratingA} /> in the <C v={G.high} /> column,
              but 240.4(D) holds it to <A v={G.smallAl.maxA} src={SMALL} />. A <A v={G.ratingA} /> breaker takes <Size s={G.al} /> aluminum, with
              an <Size s={G.egc.al} /> aluminum ground wire.
            </p>
          </section>

          <section aria-labelledby="volts" className="space-y-5">
            <h2 id="volts" className={H2} data-src={VD}>
              <A v={G.ratingA} /> at <V v={AMP_VOLTS} /> and at <V v={LOW_VOLTS} />
            </h2>
            <p className={P} data-src={VD}>
              The wire size is the same at <V v={AMP_VOLTS} /> and at <V v={LOW_VOLTS} />, the voltage of an RV&apos;s <Cfg c={G.rv.config} />; the
              distance is not, since the same drop in volts is twice the percentage at <V v={LOW_VOLTS} />. At the full <A v={G.ratingA} />, single-phase with the
              conductors at <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} />, <Size s={G.cu} /> copper reaches{' '}
              <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> at <Ft v={CU10.ft240} /> on <V v={AMP_VOLTS} /> and at{' '}
              <Ft v={CU10.ft120} /> on <V v={LOW_VOLTS} />.
            </p>
            <p className={P} data-src={LOAD}>
              The <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> is from an informational note to 215.2(A): feeders sized to keep the
              drop under it, with no more than <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={LOAD} /> on feeder and branch circuits together,
              will provide reasonable efficiency. It is advice, not a limit.{' '}
              <span data-src={VD}>
                Over <Val v={RUN.lengthFt} unit="ft" src={VD} />, <Size s={G.cu} /> drops <Pct run={RUN.cu240} /> at <V v={AMP_VOLTS} /> and{' '}
                <Pct run={RUN.cu120} /> at <V v={LOW_VOLTS} />; staying within it takes <Size s={RUN.need240.size} /> copper (<Pct run={RUN.need240} />)
                and <Size s={RUN.need120.size} /> (<Pct run={RUN.need120} />).
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
              <LengthTable id="lengths-30-cu" rows={G.lengths.cu} metal="Copper" both lowVolts={LOW_VOLTS} highVolts={AMP_VOLTS} />
              <LengthTable id="lengths-30-al" rows={G.lengths.al} metal="Aluminum" both lowVolts={LOW_VOLTS} highVolts={AMP_VOLTS} />
            </div>
            <p className={P}>
              Going up a size for distance means a larger ground wire too (250.122(B)); the{' '}
              <Link href={wireSizeLink(G.ratingA, { length: RUN.lengthFt })} className={LINK}>
                wire size calculator
              </Link>{' '}
              sizes both.
            </p>
          </section>

          <section aria-labelledby="receptacles" className="space-y-5">
            <h2 id="receptacles" className={H2} data-src={NEMA}>
              The four <A v={G.ratingA} src={NEMA} /> receptacles
            </h2>
            <p className={P} data-src={NEMA}>
              Four NEMA receptacles carry a <A v={G.ratingA} src={NEMA} /> rating, and they differ in voltage and in the wires that land on them.
              All four take the circuit&apos;s <Size s={G.cu} /> copper.
            </p>
            <ReceptacleTable id="receptacles-30" configs={G.receptacles} caption={`The ${G.ratingA} A receptacles`} />
            <ul className={clsx(P, 'list-disc space-y-2 pl-5')}>
              <li data-src={DRYER}>
                {G.dryer.whirlpool} and {G.dryer.ge} both ask for a <A v={G.ratingA} src={DRYER} /> circuit for their electric dryers, with{' '}
                <Size s={G.cu} /> copper. {G.dryer.whirlpool}&apos;s instructions show a 4-wire cord on a <Cfg c={f1430.config} /> and a 3-wire cord on a{' '}
                <Cfg c={f1030.config} />, and say a 4-wire connection is required in homes built after {G.dryer.fourAfterYear}. The{' '}
                <Link href="/calculators/dryer-calculator" className={LINK}>
                  dryer calculator
                </Link>{' '}
                keeps the circuit apart from the dryer&apos;s load on a service.
              </li>
              <li data-src={NEMA}>
                An RV&apos;s <A v={G.ratingA} src={NEMA} /> outlet is a <Cfg c={tt30.config} /> at {tt30.volts} V; the{' '}
                <Link href="/calculators/rv-hookup-calculator" className={LINK}>
                  RV hookup calculator
                </Link>{' '}
                sizes it for your run.
              </li>
              <li data-src={EV}>
                An EV charger set to a <A v={G.ev.outputA} src={EV} /> output goes on a <A v={G.ev.breakerA} src={EV} /> breaker, because 625.41
                calls for at least <Val v={EV_OCPD_PERCENT} unit="%" src={EV} /> of the output; the{' '}
                <Link href="/guides/wire-size-for-ev-charger" className={LINK}>
                  EV charger wire guide
                </Link>{' '}
                has the makers&apos; tables.
              </li>
              <li data-src={NEMA}>
                The <Cfg c={f630.config} /> is the {f630.volts} V receptacle with two hots and a ground, for equipment with no neutral.
              </li>
            </ul>
          </section>

          <section aria-labelledby="bigger" className="space-y-4">
            <h2 id="bigger" className={H2} data-src={SMALL}>
              <Size s={G.cu} /> on a bigger breaker
            </h2>
            <p className={P} data-src={SMALL}>
              On an ordinary circuit, no: 240.4(D) protects <Size s={G.cu} /> copper at <A v={G.cuRow.maxA} src={SMALL} /> at most, so the next
              standard rating, <A v={G.over} />, needs <Size s={G.lengths.cu[1].size} />.{' '}
              <span data-src={HVAC}>
                Air conditioners are an exception: Table 240.4(G) sends their circuits to Article 440, where the wire follows
                the nameplate&apos;s minimum circuit ampacity and the breaker may be larger than 240.4(D) would allow. The{' '}
                <Link href="/calculators/air-conditioner-calculator" className={LINK}>
                  air conditioner calculator
                </Link>{' '}
                applies those rules.
              </span>
            </p>
          </section>

          <section aria-labelledby="outbuilding" className="space-y-4">
            <h2 id="outbuilding" className={H2} data-src={OUTB}>
              A <A v={G.ratingA} /> feeder to a shed or garage
            </h2>
            <p className={P} data-src={OUTB}>
              A <A v={G.ratingA} /> feeder takes the same <Pair cu={G.cu} al={G.al} />. At the building, 225.39 sets the least rating of its
              disconnecting means: <A v={G.disconnect.twoCircuits} src={OUTB} /> where the building has no more than two 2-wire circuits, and{' '}
              <A v={G.disconnect.others} src={OUTB} /> for a garage or other building with more, whatever the feeder behind it. The{' '}
              <Link href="/calculators/garage-subpanel-calculator" className={LINK}>
                garage subpanel calculator
              </Link>{' '}
              sizes the feeder for larger breakers and gives the burial depth.
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
                Yes, exactly: <Size s={G.cu} /> copper carries <A v={G.cuRow.a60} src={AMP} /> at <C v={G.low} />, and 240.4(D) allows a breaker up to{' '}
                <A v={G.cuRow.maxA} src={SMALL} /> on it.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Can I use <Size s="12" /> wire on a <A v={G.ratingA} /> breaker?
              </h3>
              <p className={P} data-src={SMALL}>
                No. 240.4(D) protects <Size s="12" /> copper at <A v={G.twelveLimitA} src={SMALL} /> at most.{' '}
                <span data-src={HVAC}>Air conditioners sized under Article 440 are the exception; their nameplate sets the wire.</span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size wire for a <A v={G.ratingA} /> circuit at <V v={AMP_VOLTS} />?
              </h3>
              <p className={P} data-src={VD}>
                <Size s={G.cu} /> copper, which takes the full <A v={G.ratingA} /> <Ft v={CU10.ft240} /> before the drop reaches{' '}
                <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={VD}>
                What size wire for <A v={G.ratingA} /> at <Val v={RUN.lengthFt} unit="ft" src={VD} />?
              </h3>
              <p className={P} data-src={VD}>
                For the full load within <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />: <Size s={RUN.need240.size} /> copper at{' '}
                <V v={AMP_VOLTS} />, <Size s={RUN.need120.size} /> at <V v={LOW_VOLTS} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size aluminum wire for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={SMALL}>
                <Size s={G.al} /> aluminum. <Size s={G.smallAl.size} /> aluminum is held to <A v={G.smallAl.maxA} src={SMALL} /> by 240.4(D).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={GND}>
                What size ground wire for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={GND}>
                <Pair cu={G.egc.cu} al={G.egc.al} />: a <A v={G.ratingA} /> breaker falls in the row for breakers up to{' '}
                <A v={G.egc.rowA} src={GND} /> in Table 250.122.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, SMALL, TERM, OCPD, GND, NEMA, DRYER, EV, HVAC, OUTB, LOAD, RES]}
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
