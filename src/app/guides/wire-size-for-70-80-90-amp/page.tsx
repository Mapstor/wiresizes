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
import { Ft, LadderTable, Pair } from '@/components/look/AmpParts';
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
import { GUIDE_7090, RATINGS_7090 } from '@/lib/amp-guides';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import { NEXT_SIZE_UP_MAX_A } from '@/lib/verified/nec-240-4-d';
import { CONTINUOUS_LOAD_PERCENT, VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { EV_OCPD_PERCENT } from '@/lib/verified/nec-625';
import { TABLE_AMBIENT } from '@/lib/verified/nec-310-16';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';

// /guides/wire-size-for-70-80-90-amp (WSZ-042; research/kw: primary "wire size for 80 amp", with 70 and 90 A on the same
// page by the policy gate): the three ratings at 60 and 75 °C (nec-310-16, nec-110-14c), every 240.4(B) case among them
// with the load it may carry (nec-240-ocpd, nec-continuous-load), ChargePoint's 50 A setting on a 70 A breaker
// (mfr-evse, nec-625-ev), feeders to a separate building (nec-250-32, nec-feeders-outbuildings), the shared ground wire
// (nec-250-grounding) and the lengths to 3 % at 240 V (conductor-resistance-20c). Every value from src/lib/amp-guides.ts.
const ROUTE = '/guides/wire-size-for-70-80-90-amp';
const URL = `https://wiresizes.com${ROUTE}`;

const G = GUIDE_7090;
const [R70, R80, R90] = G.rows;
if (R70.ratingA !== RATINGS_7090[0] || R90.ratingA !== RATINGS_7090[2]) throw new Error('70 to 90 A guide: the rows changed order');
const NAMES = `${R70.ratingA}, ${R80.ratingA} and ${R90.ratingA}`;
// the page: two columns repeat a size across neighbouring ratings, and 70 A at 75 °C has a 240.4(B) size below it
if (R70.c75.cu.size !== R80.c75.cu.size || R80.c75.al.size !== R90.c75.al.size) throw new Error('70 to 90 A guide: the shared sizes changed');
const B70 = (() => {
  const b = R70.c75.cu.below;
  if (!b) throw new Error('70 to 90 A guide: no 240.4(B) size below the 70 A copper answer at 75 °C');
  return b;
})();

const TITLE = `Wire Size for ${NAMES} Amp Breakers: ${R70.nm.cu.size} to ${R90.nm.cu.size} AWG Copper`;
const DESCRIPTION =
  `At ${G.low} °C terminals or in NM cable, ${NAMES} A take ${R70.nm.cu.size}, ${R80.nm.cu.size} and ${R90.nm.cu.size} AWG copper; ` +
  `with ${G.high} °C terminations ${R70.c75.cu.size}, ${R80.c75.cu.size} and ${R90.c75.cu.size} AWG, and 240.4(B) often allows one size smaller.`;

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
const LOAD = 'nec-continuous-load';
const GND = 'nec-250-grounding';
const SEP = 'nec-250-32';
const OUTB = 'nec-feeders-outbuildings';
const EVMFR = 'mfr-evse';
const EV = 'nec-625-ev';
const RES = 'conductor-resistance-20c';
const VD = 'calc:voltage-drop';

const TOC: ([string, string] | [string, string, string])[] = [
  ['by-breaker', `Wire by breaker, ${R70.ratingA} to ${R90.ratingA} A`, AMP],
  ['smaller', 'One size smaller under 240.4(B)', OCPD],
  ['charger', `ChargePoint's ${G.cp.outputA} A setting on a ${G.cp.breakerA} A breaker`, EVMFR],
  ['feeders', 'Feeders to a subpanel or a detached building', SEP],
  ['distance', `How far each rating goes at ${AMP_VOLTS} V`, VD],
  ['ampacities', 'Ampacity of the sizes in this range', AMP],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: `Wire Size for ${NAMES} Amp Breakers`, description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

function A({ v, src = OCPD }: { v: number; src?: string }) {
  return <Val v={v} unit="A" src={src} />;
}
function C({ v }: { v: number }) {
  return <Val v={v} unit="°C" src={TERM} />;
}
const metal = (m: 'cu' | 'al') => (m === 'cu' ? 'copper' : 'aluminum');

export default function WireSizeFor708090AmpPage() {
  const picksCu = [...new Set(G.rows.flatMap((r) => [r.nm.cu.size, r.c75.cu.size]))];
  const picksAl = [...new Set(G.rows.flatMap((r) => [r.nm.al.size, r.c75.al.size]))];
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main={`Wire Size for ${NAMES} Amp Breakers`} sub={`${R70.nm.cu.size} to ${R90.nm.cu.size} AWG Copper`} joiner=": " src={AMP} />
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
          <div className="space-y-4">
            <p className={LOOK_LEAD} data-src={AMP}>
              <strong>
                At <C v={G.low} /> terminals or in NM cable, a <A v={R70.ratingA} /> breaker takes <Size s={R70.nm.cu.size} /> copper, a{' '}
                <A v={R80.ratingA} /> breaker <Size s={R80.nm.cu.size} /> and a <A v={R90.ratingA} /> breaker <Size s={R90.nm.cu.size} />.
              </strong>{' '}
              <span data-src={TERM}>
                Where every termination is listed and identified for <C v={G.high} /> conductors, the three take <Size s={R70.c75.cu.size} />,{' '}
                <Size s={R80.c75.cu.size} /> and <Size s={R90.c75.cu.size} />.
              </span>
            </p>
            <p className={P} data-src={GND}>
              All three share one ground wire, <Pair cu={G.egc.cu} al={G.egc.al} /> (Table 250.122).{' '}
              <span data-src={OCPD}>In this range 240.4(B) often lets a breaker protect the next size down when the load fits it.</span>
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={AMP}>
                  The ampacity of the sizes from <Size s={G.ladder.cu[0].size} /> copper up, in the <C v={G.low} /> column (open dots) and the{' '}
                  <C v={G.high} /> column (filled), against the three breakers. A size answers a rating when its dot for the column in use reaches
                  the line.
                </span>
                <SourceLine domains={[AMP, TERM]} />
              </>
            }
          >
            <AmpLadder
              guide={G.chart}
              opts={{
                ratings: RATINGS_7090,
                picks: { cu: picksCu, al: picksAl },
                name: '70-90',
                answer: G.rows
                  .map((r) => `${r.ratingA} A takes ${r.nm.cu.size} AWG copper at ${G.low} °C and ${r.c75.cu.size} AWG at ${G.high} °C`)
                  .join('; '),
              }}
            />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="by-breaker" className="space-y-5">
            <h2 id="by-breaker" className={H2} data-src={AMP}>
              Wire by breaker, <A v={R70.ratingA} /> to <A v={R90.ratingA} />
            </h2>
            <p className={P} data-src={TERM}>
              110.14(C)(1)(a) starts circuits of <A v={TERMINATION_RULES.limitA} src={TERM} /> or less from the <C v={G.low} /> column of Table 310.16, which is also
              where NM cable stays; the <C v={G.high} /> column applies only where the breaker, the panel and every device are listed and
              identified for <C v={G.high} /> conductors. The table gives the smallest size that reaches each rating in each column.
            </p>
            <DataTable id="by-breaker-7090" variant="ruled" src={AMP} caption="Smallest size that reaches the breaker rating, Table 310.16">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Breaker
                  </th>
                  <th scope="col" className={RTH}>
                    Cu <C v={G.low} />
                  </th>
                  <th scope="col" className={RTH}>
                    Cu <C v={G.high} />
                  </th>
                  <th scope="col" className={RTH}>
                    Al <C v={G.low} />
                  </th>
                  <th scope="col" className={RTH}>
                    Al <C v={G.high} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {G.rows.map((r) => (
                  <tr key={r.ratingA}>
                    <th scope="row" className={RSTICKY_TD}>
                      <A v={r.ratingA} />
                    </th>
                    <td className={RTD}>
                      <Size s={r.nm.cu.size} />
                    </td>
                    <td className={RTD}>
                      <Size s={r.c75.cu.size} />
                    </td>
                    <td className={RTD}>
                      <Size s={r.nm.al.size} />
                    </td>
                    <td className={RTD}>
                      <Size s={r.c75.al.size} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className={P} data-src={AMP}>
              Two sizes answer two ratings each: <Size s={R70.c75.cu.size} /> copper carries <A v={R70.c75.cu.ampacity} src={AMP} /> at{' '}
              <C v={G.high} />, enough for <A v={R70.ratingA} /> and <A v={R80.ratingA} />, and <Size s={R80.c75.al.size} /> aluminum carries{' '}
              <A v={R80.c75.al.ampacity} src={AMP} />, enough for <A v={R80.ratingA} /> and <A v={R90.ratingA} />.
            </p>
          </section>

          <section aria-labelledby="smaller" className="space-y-5">
            <h2 id="smaller" className={H2} data-src={OCPD}>
              One size smaller under 240.4(B)
            </h2>
            <p className={P} data-src={OCPD}>
              Where a conductor&apos;s ampacity is not a standard rating of Table 240.6(A), 240.4(B) lets the next higher standard rating protect
              it, up to <A v={NEXT_SIZE_UP_MAX_A} />, provided it is not part of a branch circuit supplying more than one receptacle for
              cord-and-plug-connected portable loads. Between <A v={R70.ratingA} /> and <A v={R90.ratingA} /> it applies often, because several
              sizes here carry ampacities that fall between standard ratings.{' '}
              <span data-src={LOAD}>
                The load must still fit the smaller wire: the noncontinuous load plus <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={LOAD} /> of the
                continuous load (210.19(A) for a branch circuit, 215.2(A) for a feeder).
              </span>
            </p>
            <DataTable id="smaller-7090" variant="ruled" src={OCPD} caption="Sizes a breaker may protect under 240.4(B), with the load they carry">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Breaker
                  </th>
                  <th scope="col" className={RTH}>
                    Size
                  </th>
                  <th scope="col" className={RTH}>
                    Column
                  </th>
                  <th scope="col" className={RTH}>
                    Ampacity
                  </th>
                  <th scope="col" className={RTH} data-src={LOAD}>
                    Continuous load up to
                  </th>
                </tr>
              </thead>
              <tbody>
                {G.belows.map((b) => (
                  <tr key={`${b.ratingA}-${b.column}-${b.material}`}>
                    <th scope="row" className={RSTICKY_TD}>
                      <A v={b.ratingA} />
                    </th>
                    <td className={RTD}>
                      <Size s={b.size} /> {b.material === 'cu' ? 'Cu' : 'Al'}
                    </td>
                    <td className={RTD}>
                      <Val v={b.column} unit="°C" src={TERM} />
                    </td>
                    <td className={RTD}>
                      <A v={b.ampacity} src={AMP} />
                    </td>
                    <td className={RTD} data-src={LOAD}>
                      <A v={(b.ampacity * 100) / CONTINUOUS_LOAD_PERCENT} src={LOAD} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section aria-labelledby="charger" className="space-y-4">
            <h2 id="charger" className={H2} data-src={EVMFR}>
              ChargePoint&apos;s <A v={G.cp.outputA} src={EVMFR} /> setting on a <A v={G.cp.breakerA} src={EVMFR} /> breaker
            </h2>
            <p className={P} data-src={EVMFR}>
              ChargePoint&apos;s instructions put its <A v={G.cp.outputA} src={EVMFR} /> setting on a <A v={G.cp.breakerA} src={EVMFR} /> breaker,
              hardwired.{' '}
              <span data-src={EV}>
                625.41 asks for a breaker of at least <Val v={EV_OCPD_PERCENT} unit="%" src={EV} /> of the output, and the wire must carry{' '}
                <A v={G.cp.needA} src={EV} /> too. <Size s={G.cp.c75.size} /> copper at <C v={G.high} /> carries <A v={G.cp.c75.ampacity} src={AMP} />:
                enough for the load, and a <A v={G.cp.breakerA} /> breaker may protect it under 240.4(B). In NM cable the answer is{' '}
                <Size s={G.cp.nm.size} />, at <A v={G.cp.nm.ampacity} src={AMP} />.
              </span>{' '}
              The{' '}
              <Link href="/guides/wire-size-for-ev-charger" className={LINK}>
                EV charger wire guide
              </Link>{' '}
              covers the other outputs.
            </p>
          </section>

          <section aria-labelledby="feeders" className="space-y-4">
            <h2 id="feeders" className={H2} data-src={SEP}>
              Feeders to a subpanel or a detached building
            </h2>
            <p className={P} data-src={SEP}>
              A feeder to a separate building runs four wires: two hots, the neutral and an
              equipment grounding conductor, and at that building the neutral stays off the grounding conductor and the electrode
              (250.32(B)(1)).{' '}
              <span data-src={GND}>
                The grounding conductor is <Pair cu={G.egc.cu} al={G.egc.al} /> for all three ratings, from the row of Table 250.122 for breakers
                up to <A v={G.egc.rowA} src={GND} />.
              </span>
            </p>
            <p className={P} data-src={OUTB}>
              225.39 sets the least rating of that building&apos;s disconnecting means: <A v={G.disconnect.others} src={OUTB} /> for a garage or other
              building, which any of these feeders exceeds, but <A v={G.disconnect.dwelling} src={OUTB} /> for a one-family dwelling, more than the
              feeder that supplies it. The{' '}
              <Link href="/calculators/garage-subpanel-calculator" className={LINK}>
                garage subpanel calculator
              </Link>{' '}
              sizes these feeders and gives the burial depth.
            </p>
          </section>

          <section aria-labelledby="distance" className="space-y-5">
            <h2 id="distance" className={H2} data-src={VD}>
              How far each rating goes at <Val v={AMP_VOLTS} unit="V" src={VD} />
            </h2>
            <p className={P} data-src={LOAD}>
              An informational note to 215.2(A) says feeders sized to keep the drop under <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />,
              with no more than <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={LOAD} /> on feeder and branch circuits together, will provide
              reasonable efficiency. It is advice, not a limit.{' '}
              <span data-src={VD}>
                The table gives the one-way length at which each answer reaches it at the full rating, single-phase at{' '}
                <Val v={AMP_VOLTS} unit="V" src={VD} /> with the conductors at <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} />.
              </span>
            </p>
            <DataTable id="lengths-7090" variant="ruled" src={VD} caption={`One-way length to a ${VOLTAGE_DROP_NOTE.feederPct} % drop at full load, ft`}>
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Breaker
                  </th>
                  <th scope="col" className={RTH}>
                    Cu <C v={G.low} />
                  </th>
                  <th scope="col" className={RTH}>
                    Cu <C v={G.high} />
                  </th>
                  <th scope="col" className={RTH}>
                    Al <C v={G.low} />
                  </th>
                  <th scope="col" className={RTH}>
                    Al <C v={G.high} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {G.rows.map((r) => (
                  <tr key={r.ratingA}>
                    <th scope="row" className={RSTICKY_TD}>
                      <A v={r.ratingA} />
                    </th>
                    <td className={RTD}>
                      <Ft v={r.noteFt.cuNm} />
                    </td>
                    <td className={RTD}>
                      <Ft v={r.noteFt.cu75} />
                    </td>
                    <td className={RTD}>
                      <Ft v={r.noteFt.alNm} />
                    </td>
                    <td className={RTD}>
                      <Ft v={r.noteFt.al75} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <Figure
              caption={
                <>
                  <span data-src={VD}>
                    Voltage drop of an <A v={R80.ratingA} /> circuit at full load, single-phase at <Val v={AMP_VOLTS} unit="V" src={VD} />, against
                    one-way length: the <C v={G.low} /> sizes as solid lines, the <C v={G.high} /> sizes dashed, with the 215.2(A) note&apos;s{' '}
                    <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />.
                  </span>
                  <SourceLine domains={[AMP, RES, LOAD]} />
                </>
              }
            >
              <AmpDropChart guide={G.chart} lengths={DROP_50_LENGTHS} />
            </Figure>
            <p className={P}>
              The{' '}
              <Link href={wireSizeLink(R80.ratingA)} className={LINK}>
                wire size calculator
              </Link>{' '}
              finds the size for your length and load and grows the ground wire with it (250.122(B)).
            </p>
          </section>

          <section aria-labelledby="ampacities" className="space-y-5">
            <h2 id="ampacities" className={H2} data-src={AMP}>
              Ampacity of the sizes in this range
            </h2>
            <p className={P} data-src={AMP}>
              Both columns of{' '}
              <Link href="/guides/nec-table-310-16" className={LINK}>
                NEC Table 310.16
              </Link>
              , which assumes an ambient temperature of <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} /> and no more than three current-carrying
              conductors together.
            </p>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <LadderTable id="ampacities-7090-cu" rows={G.ladder.cu} metal="Copper" low={G.low} high={G.high} />
              <LadderTable id="ampacities-7090-al" rows={G.ladder.al} metal="Aluminum" low={G.low} high={G.high} />
            </div>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            {G.rows.map((r) => (
              <div key={r.ratingA} className="space-y-1.5">
                <h3 className={H3} data-src={OCPD}>
                  What size wire for <A v={r.ratingA} />?
                </h3>
                <p className={P} data-src={AMP}>
                  <Pair cu={r.nm.cu.size} al={r.nm.al.size} /> at <C v={G.low} /> terminals or in NM cable; <Pair cu={r.c75.cu.size} al={r.c75.al.size} />{' '}
                  where every termination is listed and identified for <C v={G.high} /> conductors.
                </p>
              </div>
            ))}
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Can <Size s={B70.size} /> copper go on a <A v={R70.ratingA} /> breaker?
              </h3>
              <p className={P} data-src={OCPD}>
                With <C v={G.high} /> terminations, under 240.4(B), when the load fits its <A v={B70.ampacity} src={AMP} />. At{' '}
                <C v={G.low} /> or in NM cable it carries less, and <Size s={R70.nm.cu.size} /> is the answer.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size wire for an <A v={R80.ratingA} /> subpanel?
              </h3>
              <p className={P} data-src={AMP}>
                <Pair cu={R80.nm.cu.size} al={R80.nm.al.size} /> at <C v={G.low} />, <Pair cu={R80.c75.cu.size} al={R80.c75.al.size} /> at{' '}
                <C v={G.high} />, with an <Size s={G.egc.cu} /> copper ground wire and four wires to a detached building.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={GND}>
                What size ground wire for <A v={R70.ratingA} /> to <A v={R90.ratingA} />?
              </h3>
              <p className={P} data-src={GND}>
                <Pair cu={G.egc.cu} al={G.egc.al} /> for all three, larger in proportion if the circuit wires are upsized for distance (250.122(B)).
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, TERM, OCPD, LOAD, GND, SEP, OUTB, EVMFR, EV, RES]}
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
