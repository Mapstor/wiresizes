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
import { Cfg, Ft, LengthTable, Pair } from '@/components/look/AmpParts';
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
import { GUIDE_15, LIMIT_ROWS, LOW_VOLTS } from '@/lib/amp-guides';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import { VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { NM_CABLE } from '@/lib/verified/nec-separate-buildings';
import { AMPACITY_COLUMNS } from '@/lib/verified/nec-310-16';

// /guides/wire-size-for-15-amp (WSZ-042; research/kw: primary "wire size for 15 amp"): at 15 A the 240.4(D) limit, not
// Table 310.16, sets the answer (nec-240-4-d, nec-310-16, nec-110-14c; NM cable at 60 °C, nec-cable-rules); a larger
// size is always allowed; how far 15 A runs at 120 and 240 V before the 215.2(A) note's 3 % (conductor-resistance-20c,
// nec-continuous-load); aluminum and copper-clad aluminum; the 5-15R (nema-receptacle-configs) and the plug-in hot
// tubs on 15 A (mfr-spas); the Table 250.122 ground wire (nec-250-grounding). Every value from src/lib/amp-guides.ts.
const ROUTE = '/guides/wire-size-for-15-amp';
const URL = `https://wiresizes.com${ROUTE}`;

const G = GUIDE_15;
/** Table 310.16's hottest column, °C. */
const C90 = Math.max(...AMPACITY_COLUMNS);
const CU14 = G.lengths.cu[0];
const CU12 = G.lengths.cu[1];
if (CU14.size !== G.cu || CU12.size !== G.up) throw new Error('15 A guide: the length rows no longer start at the answer');

const TITLE = `Wire Size for ${G.ratingA} Amp Breaker: ${G.cu} AWG Copper`;
const DESCRIPTION =
  `A ${G.ratingA} A breaker takes ${G.cu} AWG copper or ${G.al} AWG aluminum, with a ${G.egc.cu} AWG copper ground. ` +
  `At ${LOW_VOLTS} V the full ${G.ratingA} A drops ${VOLTAGE_DROP_NOTE.feederPct} % in ${Math.round(CU14.ft120)} ft of ${G.cu} AWG.`;

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
const SPAS = 'mfr-spas';
const RES = 'conductor-resistance-20c';
const VD = 'calc:voltage-drop';

const TOC: ([string, string] | [string, string, string])[] = [
  ['limit', `Why ${G.cu} AWG stops at ${G.ratingA} A`, SMALL],
  ['larger', `${G.up} AWG on a ${G.ratingA} A breaker`, OCPD],
  ['distance', `How far ${G.ratingA} A goes at ${LOW_VOLTS} V`, VD],
  ['aluminum', 'Aluminum and copper-clad aluminum', SMALL],
  ['receptacle', `The ${G.ratingA} A receptacle`, NEMA],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: `Wire Size for ${G.ratingA} Amp Breaker`, description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

function A({ v, src = OCPD }: { v: number; src?: string }) {
  return <Val v={v} unit="A" src={src} />;
}
function C({ v, src = AMP }: { v: number; src?: string }) {
  return <Val v={v} unit="°C" src={src} />;
}

/** The five small conductors: Table 310.16 at each column beside the largest breaker 240.4(D) allows. */
function LimitTable() {
  return (
    <DataTable id="limits-15" variant="ruled" src={AMP} caption="Table 310.16 ampacity and the largest breaker under 240.4(D), A">
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Size
          </th>
          <th scope="col" className={RTH}>
            <C v={G.low} />
          </th>
          <th scope="col" className={RTH}>
            <C v={G.high} />
          </th>
          <th scope="col" className={RTH}>
            <C v={C90} />
          </th>
          <th scope="col" className={RTH} data-src={SMALL}>
            Breaker
          </th>
        </tr>
      </thead>
      <tbody>
        {LIMIT_ROWS.map((r) => (
          <tr key={`${r.size}-${r.material}`}>
            <th scope="row" className={RSTICKY_TD}>
              <Size s={r.size} /> {r.material === 'Cu' ? 'Cu' : 'Al'}
            </th>
            <td className={RTD}>
              <A v={r.a60} src={AMP} />
            </td>
            <td className={RTD}>
              <A v={r.a75} src={AMP} />
            </td>
            <td className={RTD}>
              <A v={r.a90} src={AMP} />
            </td>
            <td className={RTD} data-src={SMALL}>
              <A v={r.maxA} src={SMALL} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function WireSizeFor15AmpPage() {
  const R = G.receptacle;
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
                A <A v={G.ratingA} /> breaker takes <Pair cu={G.cu} al={G.al} />.
              </strong>{' '}
              <span data-src={AMP}>
                Table 310.16 lists <Size s={G.cu} /> copper at <A v={G.cuRow.a75} src={AMP} /> in the <C v={G.high} /> column, but 240.4(D) holds
                it to a <A v={G.cuRow.maxA} src={SMALL} /> breaker, so the breaker limit sets the answer whatever the terminals.
              </span>
            </p>
            <p className={P} data-src={GND}>
              The ground wire is <Pair cu={G.egc.cu} al={G.egc.al} /> (Table 250.122).{' '}
              <span data-src={VD}>
                At <Val v={LOW_VOLTS} unit="V" src={VD} /> the full <A v={G.ratingA} /> drops{' '}
                <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> in <Ft v={CU14.ft120} /> of <Size s={G.cu} /> copper, so longer runs
                go up a size.
              </span>
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={SMALL}>
                  The small conductors 240.4(D) limits: each bar ends at the largest breaker it allows, the dots show its Table 310.16 ampacity at{' '}
                  <C v={G.low} /> (open) and <C v={G.high} /> (filled). <Size s={G.cu} /> copper and <Size s={G.al} /> aluminum stop at{' '}
                  <A v={G.ratingA} />.
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

          <section aria-labelledby="limit" className="space-y-5">
            <h2 id="limit" className={H2} data-src={SMALL}>
              Why <Size s={G.cu} /> stops at <A v={G.ratingA} />
            </h2>
            <p className={P} data-src={SMALL}>
              Table 310.16 gives a conductor&apos;s ampacity; 240.4(D) then caps the breaker or fuse on the small sizes, whatever the table says.
              For <Size s={G.cu} /> copper the cap is <A v={G.cuRow.maxA} src={SMALL} />, while the table lists{' '}
              <A v={G.cuRow.a60} src={AMP} /> at <C v={G.low} />, <A v={G.cuRow.a75} src={AMP} /> at <C v={G.high} /> and{' '}
              <A v={G.cuRow.a90} src={AMP} /> at <C v={C90} />.
            </p>
            <p className={P} data-src={TERM}>
              That is why the terminal rating, which decides the answer at larger ratings under 110.14(C), changes nothing here: in every column
              the cap is the tighter limit.{' '}
              <span data-src={CABLE}>
                In NM cable, 334.80 holds <Size s={G.cu} /> to its <Val v={NM_CABLE.maxColumnC} unit="°C" src={CABLE} /> value, which is the{' '}
                <A v={G.cuRow.a60} src={AMP} /> of the breaker anyway.
              </span>
            </p>
            <LimitTable />
          </section>

          <section aria-labelledby="larger" className="space-y-4">
            <h2 id="larger" className={H2} data-src={OCPD}>
              <Size s={G.up} /> on a <A v={G.ratingA} /> breaker
            </h2>
            <p className={P} data-src={SMALL}>
              240.4(D) limits the breaker on each wire size, never the wire size on a breaker, so a larger wire on a <A v={G.ratingA} /> breaker
              is always allowed. <Size s={G.up} /> copper may carry up to <A v={G.upRow.maxA} src={SMALL} /> under 240.4(D), and on a{' '}
              <A v={G.ratingA} /> breaker it simply runs farther:{' '}
              <span data-src={VD}>
                at <Val v={LOW_VOLTS} unit="V" src={VD} /> the full <A v={G.ratingA} /> reaches <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />{' '}
                at <Ft v={CU12.ft120} /> on <Size s={G.up} />, against <Ft v={CU14.ft120} /> on <Size s={G.cu} />.
              </span>
            </p>
          </section>

          <section aria-labelledby="distance" className="space-y-5">
            <h2 id="distance" className={H2} data-src={VD}>
              How far <A v={G.ratingA} /> goes at <Val v={LOW_VOLTS} unit="V" src={VD} />
            </h2>
            <p className={P} data-src={LOAD}>
              For feeders, an informational note to 215.2(A) says that conductors sized to keep the drop at the farthest outlet under{' '}
              <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />, with no more than <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={LOAD} />{' '}
              on feeder and branch circuits together, will provide reasonable efficiency. It is advice, not a limit; the lengths below use the
              same percentage.
            </p>
            <p className={P} data-src={VD}>
              At the full <A v={G.ratingA} />, single-phase with the conductors at <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} />, the drop
              reaches <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> at these one-way lengths. A <Val v={LOW_VOLTS} unit="V" src={VD} />{' '}
              circuit gets half the distance of a <Val v={AMP_VOLTS} unit="V" src={VD} /> one on the same wire, and a load below{' '}
              <A v={G.ratingA} /> drops less in proportion.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={VD}>
                    One-way length at which <A v={G.ratingA} /> drops <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> on copper, at{' '}
                    <Val v={LOW_VOLTS} unit="V" src={VD} /> (gray) and <Val v={AMP_VOLTS} unit="V" src={VD} /> (copper).
                  </span>
                  <SourceLine domains={[RES, LOAD]} />
                </>
              }
            >
              <LengthBars rows={G.lengths.cu} ratingA={G.ratingA} highlight={G.cu} />
            </Figure>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <LengthTable id="lengths-15-cu" rows={G.lengths.cu} metal="Copper" both lowVolts={LOW_VOLTS} highVolts={AMP_VOLTS} />
              <LengthTable id="lengths-15-al" rows={G.lengths.al} metal="Aluminum" both lowVolts={LOW_VOLTS} highVolts={AMP_VOLTS} />
            </div>
            <p className={P}>
              The{' '}
              <Link href={wireSizeLink(G.ratingA)} className={LINK}>
                wire size calculator
              </Link>{' '}
              takes your length and load and grows the ground wire with a larger circuit wire, as 250.122(B) requires.
            </p>
          </section>

          <section aria-labelledby="aluminum" className="space-y-4">
            <h2 id="aluminum" className={H2} data-src={SMALL}>
              Aluminum and copper-clad aluminum
            </h2>
            <p className={P} data-src={SMALL}>
              Under 240.4(D), <Size s={G.al} /> aluminum is held like <Size s={G.cu} /> copper: a <A v={G.alRow.maxA} src={SMALL} /> breaker at most, though
              Table 310.16 lists it at <A v={G.alRow.a75} src={AMP} /> at <C v={G.high} />. <Size s={G.cu} /> copper-clad aluminum is held to{' '}
              <A v={G.cca.maxA} src={SMALL} />, and only where continuous loads stay at <A v={G.cca.continuousMaxA} src={SMALL} /> or less, so it
              does not reach a <A v={G.ratingA} /> circuit.
            </p>
          </section>

          <section aria-labelledby="receptacle" className="space-y-4">
            <h2 id="receptacle" className={H2} data-src={NEMA}>
              The <A v={G.ratingA} src={NEMA} /> receptacle
            </h2>
            <p className={P} data-src={NEMA}>
              The <Cfg c={R.config} /> is rated <A v={R.amps} src={NEMA} /> at {R.volts} V, {R.poles}-pole {R.wires}-wire grounding: one hot, a
              neutral and a ground, each landing on the circuit&apos;s <Size s={G.cu} /> copper.
            </p>
            <p className={P} data-src={SPAS}>
              Some plug-in hot tubs run on such a circuit: the {G.plugIn.join(' and ')} list a <A v={G.ratingA} src={SPAS} /> circuit at{' '}
              <Val v={LOW_VOLTS} unit="V" src={SPAS} />. The{' '}
              <Link href="/calculators/hot-tub-calculator" className={LINK}>
                hot tub calculator
              </Link>{' '}
              covers their circuits and the larger <Val v={AMP_VOLTS} unit="V" src={SPAS} /> ones.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What gauge wire for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={SMALL}>
                <Pair cu={G.cu} al={G.al} />, the smallest sizes 240.4(D) allows on a <A v={G.ratingA} /> breaker. Past <Ft v={CU14.ft120} /> at{' '}
                <Val v={LOW_VOLTS} unit="V" src={VD} /> the full load drops more than the <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />{' '}
                of the 215.2(A) note on <Size s={G.cu} />; <Size s={G.up} /> holds it to <Ft v={CU12.ft120} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Can I use <Size s={G.up} /> wire on a <A v={G.ratingA} /> circuit?
              </h3>
              <p className={P} data-src={SMALL}>
                Yes. A larger wire is always allowed; 240.4(D) only limits how large a breaker may protect each size.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size wire for <A v={G.ratingA} /> at <Val v={AMP_VOLTS} unit="V" src={VD} />?
              </h3>
              <p className={P} data-src={VD}>
                The same <Size s={G.cu} /> copper. At <Val v={AMP_VOLTS} unit="V" src={VD} /> the full <A v={G.ratingA} /> reaches{' '}
                <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> at <Ft v={CU14.ft240} />, twice the{' '}
                <Val v={LOW_VOLTS} unit="V" src={VD} /> distance.
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
            <div className="space-y-1.5">
              <h3 className={H3} data-src={CABLE}>
                What size NM cable for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={CABLE}>
                <Size s={G.cu} /> copper NM cable, which 334.80 holds to the <Val v={NM_CABLE.maxColumnC} unit="°C" src={CABLE} /> column:{' '}
                <A v={G.cuRow.a60} src={AMP} />, the breaker&apos;s rating.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Can <Size s={G.cu} /> wire go on a bigger breaker?
              </h3>
              <p className={P} data-src={SMALL}>
                Not on an ordinary circuit: 240.4(D) protects <Size s={G.cu} /> copper at <A v={G.cuRow.maxA} src={SMALL} /> at most. The{' '}
                <Link href="/guides/wire-size-for-20-amp" className={LINK}>
                  wire size for 20 amp
                </Link>{' '}
                guide covers the next breaker up.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, SMALL, TERM, CABLE, OCPD, GND, NEMA, SPAS, LOAD, RES]}
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
