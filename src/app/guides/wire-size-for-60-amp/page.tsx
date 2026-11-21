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
import { DropText, Ft, LadderTable, LengthTable, Pair, Pct } from '@/components/look/AmpParts';
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
import { GUIDE_60, LOW_VOLTS } from '@/lib/amp-guides';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import { NEXT_SIZE_UP_MAX_A } from '@/lib/verified/nec-240-4-d';
import { CONTINUOUS_LOAD_PERCENT, VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { EV_OCPD_PERCENT } from '@/lib/verified/nec-625';
import { TABLE_AMBIENT } from '@/lib/verified/nec-310-16';
import { NM_CABLE } from '@/lib/verified/nec-separate-buildings';

// /guides/wire-size-for-60-amp (WSZ-042; research/kw: primary "wire size for 60 amp"): 4 or 6 AWG copper by the terminals
// (nec-310-16, nec-110-14c, nec-cable-rules); the 240.4(B) case of 6 AWG at 60 °C with the load it may carry
// (nec-240-ocpd, nec-continuous-load); 8 AWG's 75 °C value a standard rating; a 60 A subpanel or service (nec-250-32,
// nec-feeders-outbuildings, nec-310-12); a 48 A EV charger (nec-625-ev) and a 60 A hot tub (mfr-spas); the ground wire
// (nec-250-grounding); the voltage drop at 240 V (conductor-resistance-20c). Every value from src/lib/amp-guides.ts.
const ROUTE = '/guides/wire-size-for-60-amp';
const URL = `https://wiresizes.com${ROUTE}`;

const G = GUIDE_60;
const { nm: NM, c75: C75, run: RUN, below: B, belowAl: BA } = G;

const TITLE = `Wire Size for ${G.ratingA} Amp Breaker: ${NM.cu.size} or ${C75.cu.size} AWG Copper`;
const DESCRIPTION =
  `A ${G.ratingA} A breaker takes ${NM.cu.size} AWG copper or ${NM.al.size} AWG aluminum in NM cable or at ${G.low} °C terminals, ` +
  `${C75.cu.size} AWG copper or ${C75.al.size} AWG aluminum at ${G.high} °C, and a ${G.egc.cu} AWG copper ground wire.`;

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
const LOAD = 'nec-continuous-load';
const GND = 'nec-250-grounding';
const SEP = 'nec-250-32';
const OUTB = 'nec-feeders-outbuildings';
const SVC = 'nec-310-12';
const EV = 'nec-625-ev';
const SPAS = 'mfr-spas';
const RES = 'conductor-resistance-20c';
const VD = 'calc:voltage-drop';

const TOC: ([string, string] | [string, string, string])[] = [
  ['six', `${B.size} AWG on a ${G.ratingA} A breaker`, OCPD],
  ['subpanel', `A ${G.ratingA} A subpanel or service`, OCPD],
  ['ev', `A ${G.ev.outputA} A EV charger on ${G.ratingA} A`, EV],
  ['ground', `Ground wire for ${G.ratingA} A`, GND],
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
function Picks({ p }: { p: typeof NM }) {
  return <Pair cu={p.cu.size} al={p.al.size} />;
}

export default function WireSizeFor60AmpPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main={`Wire Size for ${G.ratingA} Amp Breaker`} sub={`${NM.cu.size} or ${C75.cu.size} AWG Copper`} joiner=": " src={AMP} />
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
          <div className="space-y-4">
            <p className={LOOK_LEAD} data-src={AMP}>
              <strong>
                A <A v={G.ratingA} /> breaker takes <Picks p={NM} /> in NM cable or at <C v={G.low} /> terminals.
              </strong>{' '}
              <span data-src={TERM}>
                Where every termination is listed and identified for <C v={G.high} /> conductors, <Picks p={C75} /> is enough.
              </span>{' '}
              <span data-src={OCPD}>
                240.4(B) also lets a <A v={G.ratingA} /> breaker protect <Size s={B.size} /> copper at <C v={G.low} /> when the load fits its{' '}
                <A v={B.ampacity} src={AMP} />.
              </span>
            </p>
            <p className={P} data-src={GND}>
              The ground wire is <Pair cu={G.egc.cu} al={G.egc.al} /> (Table 250.122).
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={AMP}>
                  The ampacity of the sizes around <A v={G.ratingA} /> in the <C v={G.low} /> column (open dots) and the <C v={G.high} /> column
                  (filled). <Size s={B.size} /> copper&apos;s open dot falls short of <A v={G.ratingA} /> at <A v={B.ampacity} src={AMP} />, a value
                  that is not a standard breaker rating.
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

          <section aria-labelledby="six" className="space-y-4">
            <h2 id="six" className={H2} data-src={OCPD}>
              <Size s={B.size} /> on a <A v={G.ratingA} /> breaker
            </h2>
            <p className={P} data-src={AMP}>
              In the <C v={G.low} /> column, which covers NM cable <span data-src={CABLE}>(334.80)</span> and terminals rated <C v={G.low} />,{' '}
              <Size s={B.size} /> copper carries{' '}
              <A v={B.ampacity} src={AMP} /> and <Size s={NM.cu.size} /> carries <A v={NM.cu.ampacity} src={AMP} />, so a full{' '}
              <A v={G.ratingA} /> circuit takes <Size s={NM.cu.size} />.
            </p>
            <p className={P} data-src={OCPD}>
              240.4(B) opens a second answer. Where a conductor&apos;s ampacity is not a standard rating of Table 240.6(A), the next higher standard
              rating may protect it, up to <A v={NEXT_SIZE_UP_MAX_A} />, provided the conductors are not part of a branch circuit supplying more
              than one receptacle for cord-and-plug-connected portable loads. <A v={B.ampacity} src={AMP} /> is not a standard rating, so a{' '}
              <A v={G.ratingA} /> breaker may protect <Size s={B.size} /> copper at <C v={G.low} />, and <Size s={BA.size} /> aluminum the same way.
            </p>
            <p className={P} data-src={LOAD}>
              The load still has to fit the wire: under 210.19(A) for a branch circuit and 215.2(A) for a feeder, the conductors carry the
              noncontinuous load plus <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={LOAD} /> of the continuous load. On <Size s={B.size} /> copper
              that is <A v={B.ampacity} src={AMP} /> of noncontinuous load, or <A v={G.continuousMaxA} src={LOAD} /> of continuous load.{' '}
              <span data-src={TERM}>
                Where every termination is listed and identified for <C v={G.high} /> conductors, <Size s={C75.cu.size} /> carries{' '}
                <A v={C75.cu.ampacity} src={AMP} /> and none of this applies.
              </span>
            </p>
          </section>

          <section aria-labelledby="subpanel" className="space-y-4">
            <h2 id="subpanel" className={H2} data-src={OCPD}>
              A <A v={G.ratingA} /> subpanel or service
            </h2>
            <p className={P} data-src={AMP}>
              A <A v={G.ratingA} /> feeder takes the same sizes: <Picks p={NM} /> at <C v={G.low} />, <Picks p={C75} /> at <C v={G.high} />.{' '}
              <span data-src={SVC}>
                Table 310.12, for a <span className="whitespace-nowrap">120/240 V</span> single-phase service, or a feeder, that carries the entire
                load of a one-family dwelling or of one dwelling unit, starts at <A v={G.serviceFromA} src={SVC} />, so a <A v={G.ratingA} /> service
                or feeder is sized from Table 310.16 too.
              </span>
            </p>
            <p className={P} data-src={SEP}>
              A feeder to a separate building, such as a detached garage, runs four wires: two hots, the neutral and an equipment grounding
              conductor, and at that building the neutral stays off the grounding conductor and the electrode (250.32(B)(1)).{' '}
              <span data-src={OUTB}>
                The building&apos;s own disconnecting means must be rated at least <A v={G.disconnect.others} src={OUTB} /> for a garage or other
                building, which a <A v={G.ratingA} /> feeder matches, and at least <A v={G.disconnect.dwelling} src={OUTB} /> for a one-family dwelling
                (225.39).
              </span>{' '}
              The{' '}
              <Link href="/calculators/garage-subpanel-calculator" className={LINK}>
                garage subpanel calculator
              </Link>{' '}
              sizes the feeder for your run and gives the burial depth.
            </p>
          </section>

          <section aria-labelledby="ev" className="space-y-4">
            <h2 id="ev" className={H2} data-src={EV}>
              A <A v={G.ev.outputA} src={EV} /> EV charger on <A v={G.ratingA} />
            </h2>
            <p className={P} data-src={EV}>
              625.41 sizes an EV charger&apos;s breaker at no less than <Val v={EV_OCPD_PERCENT} unit="%" src={EV} /> of its output, so a{' '}
              <A v={G.ev.outputA} src={EV} /> charger goes on a <A v={G.ev.breakerA} src={EV} /> breaker. Its wire must carry{' '}
              <A v={G.ev.needA} src={EV} /> too, more than the <A v={B.ampacity} src={AMP} /> of <Size s={B.size} /> copper at <C v={G.low} />, so the
              240.4(B) answer is out: the charger takes <Size s={NM.cu.size} /> copper in NM cable, or <Size s={C75.cu.size} /> where every
              termination is listed and identified for <C v={G.high} />. The{' '}
              <Link href="/guides/wire-size-for-ev-charger" className={LINK}>
                EV charger wire guide
              </Link>{' '}
              shows the makers&apos; own tables.
            </p>
            <p className={P} data-src={SPAS}>
              {G.spaMakers.join(' and ')} also lists a <A v={G.ratingA} src={SPAS} /> circuit at <Val v={AMP_VOLTS} unit="V" src={SPAS} /> for its hot
              tubs; the{' '}
              <Link href="/calculators/hot-tub-calculator" className={LINK}>
                hot tub calculator
              </Link>{' '}
              sizes it.
            </p>
          </section>

          <section aria-labelledby="ground" className="space-y-4">
            <h2 id="ground" className={H2} data-src={GND}>
              Ground wire for <A v={G.ratingA} />
            </h2>
            <p className={P} data-src={GND}>
              Table 250.122 sizes the equipment grounding conductor by the breaker. Its row for breakers up to <A v={G.egc.rowA} src={GND} /> gives{' '}
              <Pair cu={G.egc.cu} al={G.egc.al} />, so a <A v={G.ratingA} /> circuit sits at the top of that row. Going up a size for distance
              increases the ground wire in proportion to the larger circuit wires (250.122(B)); the{' '}
              <Link href="/calculators/ground-wire-calculator" className={LINK}>
                ground wire calculator
              </Link>{' '}
              does that arithmetic.
            </p>
          </section>

          <section aria-labelledby="distance" className="space-y-5">
            <h2 id="distance" className={H2} data-src={VD}>
              <A v={G.ratingA} /> at <Val v={AMP_VOLTS} unit="V" src={VD} />: how far each size goes
            </h2>
            <p className={P} data-src={VD}>
              At the full <A v={G.ratingA} /> over <Val v={RUN.lengthFt} unit="ft" src={VD} />, single-phase at <Val v={AMP_VOLTS} unit="V" src={VD} />{' '}
              with the conductors at <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} />: <Size s={NM.cu.size} /> copper drops <DropText run={RUN.cuNm} />,{' '}
              <Size s={C75.cu.size} /> copper <DropText run={RUN.cu75} />, <Size s={NM.al.size} /> aluminum <DropText run={RUN.alNm} /> and{' '}
              <Size s={C75.al.size} /> aluminum <DropText run={RUN.al75} />.
            </p>
            <p className={P} data-src={LOAD}>
              An informational note to 215.2(A) says feeders sized to keep the drop under <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />,
              with no more than <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={LOAD} /> on feeder and branch circuits together, will provide
              reasonable efficiency. It is advice, not a limit.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={VD}>
                    Voltage drop of a <A v={G.ratingA} /> circuit at full load, single-phase at <Val v={AMP_VOLTS} unit="V" src={VD} />, against
                    one-way length: the <C v={G.low} /> sizes as solid lines, the <C v={G.high} /> sizes dashed, with the 215.2(A) note&apos;s{' '}
                    <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />.
                  </span>
                  <SourceLine domains={[AMP, RES, LOAD]} />
                </>
              }
            >
              <AmpDropChart guide={G} lengths={DROP_50_LENGTHS} />
            </Figure>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <LengthTable id="lengths-60-cu" rows={G.lengths.cu} metal="Copper" both={false} lowVolts={LOW_VOLTS} highVolts={AMP_VOLTS} />
              <LengthTable id="lengths-60-al" rows={G.lengths.al} metal="Aluminum" both={false} lowVolts={LOW_VOLTS} highVolts={AMP_VOLTS} />
            </div>
            <p className={P}>
              The{' '}
              <Link href={wireSizeLink(G.ratingA, { length: RUN.lengthFt })} className={LINK}>
                wire size calculator
              </Link>{' '}
              finds the size for your length and load.
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
              </Link>
              , which assumes an ambient temperature of <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} /> and no more than three current-carrying
              conductors together.{' '}
              <span data-src={CABLE}>
                NM cable uses the <Val v={NM_CABLE.maxColumnC} unit="°C" src={CABLE} /> column whatever its terminations (334.80).
              </span>
            </p>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <LadderTable id="ampacities-60-cu" rows={G.ladder.cu} metal="Copper" low={G.low} high={G.high} />
              <LadderTable id="ampacities-60-al" rows={G.ladder.al} metal="Aluminum" low={G.low} high={G.high} />
            </div>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Is <Size s={B.size} /> wire good for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={OCPD}>
                With <C v={G.high} /> terminations throughout, yes: it carries <A v={C75.cu.ampacity} src={AMP} />. At <C v={G.low} /> or in NM cable it
                carries <A v={B.ampacity} src={AMP} />, and a <A v={G.ratingA} /> breaker may protect it under 240.4(B) only when the load fits that.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Can <Size s="8" /> wire go on a <A v={G.ratingA} /> breaker?
              </h3>
              <p className={P} data-src={AMP}>
                No. <Size s="8" /> copper carries <A v={G.eight75} src={AMP} /> even at <C v={G.high} />, and since that is a standard rating, 240.4(B)
                does not lift it to <A v={G.ratingA} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={VD}>
                What size wire for a <A v={G.ratingA} /> subpanel <Val v={RUN.lengthFt} unit="ft" src={VD} /> away?
              </h3>
              <p className={P} data-src={VD}>
                At the full <A v={G.ratingA} />, <Size s={NM.cu.size} /> copper drops <Pct run={RUN.cuNm} /> and <Size s={C75.cu.size} /> copper{' '}
                <Pct run={RUN.cu75} />, both inside the <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> of the 215.2(A) note; the{' '}
                <Size s={C75.cu.size} /> answer needs <C v={G.high} /> terminations. The feeder to a detached building runs four wires.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size wire for a <A v={G.ratingA} /> service?
              </h3>
              <p className={P} data-src={SVC}>
                Table 310.12 starts at <A v={G.serviceFromA} src={SVC} />, so the Table 310.16 sizes apply:{' '}
                <span data-src={AMP}>
                  <Picks p={NM} /> at <C v={G.low} />, <Picks p={C75} /> at <C v={G.high} />.
                </span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size aluminum wire for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={AMP}>
                <Size s={NM.al.size} /> at <C v={G.low} /> terminals, <Size s={C75.al.size} /> where every termination is listed and identified for{' '}
                <C v={G.high} /> conductors, with an <Size s={G.egc.al} /> aluminum ground wire. <Size s={BA.size} /> aluminum at <C v={G.low} /> fits
                under 240.4(B) when the load stays within <A v={BA.ampacity} src={AMP} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={GND}>
                What size ground wire for a <A v={G.ratingA} /> subpanel?
              </h3>
              <p className={P} data-src={GND}>
                <Pair cu={G.egc.cu} al={G.egc.al} />, from the <A v={G.egc.rowA} src={GND} /> row of Table 250.122, run with the feeder.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, TERM, CABLE, OCPD, LOAD, GND, SVC, SEP, OUTB, EV, SPAS, RES]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#breaker-ratings" className={LINK}>
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
