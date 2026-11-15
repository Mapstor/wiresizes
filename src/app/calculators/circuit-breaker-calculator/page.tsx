import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { Byline } from '@/components/content/Byline';
import { DataTable, RSTICKY_TD, RSTICKY_TH, RTD, RTH } from '@/components/content/DataTable';
import { Figure } from '@/components/content/Figure';
import { Num } from '@/components/content/Num';
import { Size } from '@/components/content/Size';
import { SourceLine } from '@/components/content/SourceLine';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { BreakerTool } from '@/components/calculators/BreakerTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { BreakerStepsChart } from '@/components/look/Charts';
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
import { ENGINE_ID, largestContinuousLoad } from '@/lib/calculations/breaker-sizing';
import type { LargestBreaker } from '@/lib/calculations/breaker-sizing';
import { RATING_MAX_A, RATING_MIN_A } from '@/lib/calculations/conductor-sizing';
import { articleDates } from '@/lib/page-dates';
import { CONTINUOUS_EXAMPLES, CONTINUOUS_ROWS, MIXED, NEXT_SIZE_UP, WIRE_ROWS, wireRow } from '@/lib/breaker-page';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { CONTINUOUS_LOAD_PERCENT } from '@/lib/verified/nec-continuous-load-2023';
import { NEXT_SIZE_UP_MAX_A } from '@/lib/verified/nec-240-4-d';
import { ocpdRatings } from '@/lib/verified/nec-240-6-a';
import type { Material } from '@/lib/verified/awg';

// /calculators/circuit-breaker-calculator (WSZ-009c; spec: research/page-specs-held.md "WSZ-009"; data gate BUILD;
// withdrawn in WSZ-002, back as a new page): a continuous and a noncontinuous load give the smallest rating 210.20(A)
// allows, the next standard rating of Table 240.6(A), the wire for it and the ground wire. Every number comes from the
// breaker engine through src/lib/breaker-page.ts or from a verified table. The examples are golden "breaker-sizing"
// cases (16, 24, 40 and 48 A continuous; 10 A continuous with 8 A noncontinuous) and one 240.4(B) case (44 A).
const ROUTE = '/calculators/circuit-breaker-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Circuit Breaker Size Calculator: NEC 125 % Rule and Wire';
const DESCRIPTION =
  'Breaker size for continuous and noncontinuous loads (NEC 210.20(A)), the wire and ground wire it needs, and the largest breaker for each wire size.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const AMP = 'nec-310-16';
const TERM = 'nec-110-14c';
const CONT = 'nec-continuous-load';
const SMALL = 'nec-240-4-d';
const OCPD = 'nec-240-ocpd';
const EGC = 'nec-250-grounding';
const CALC = `calc:${ENGINE_ID}`;
const COLD = TERMINATION_RULES.columnAtOrBelowLimit;
const WARM = TERMINATION_RULES.columnAboveLimit;
const RATINGS = ocpdRatings();

// the facts the copy states, checked when the page builds
const [C16, C24, C40, C48] = CONTINUOUS_EXAMPLES;
const W14 = wireRow('Cu', '14');
const W12 = { Cu: wireRow('Cu', '12'), Al: wireRow('Al', '12') };
const W10 = { Cu: wireRow('Cu', '10'), Al: wireRow('Al', '10') };
const W8 = wireRow('Cu', '8');
const W6 = wireRow('Cu', '6');
const below = (b: LargestBreaker) => RATINGS.filter((r) => r < b.ampacity).pop() as number;
function nextSizeUp() {
  const b = NEXT_SIZE_UP.run.below;
  if (!b || NEXT_SIZE_UP.run.breakerA !== 60) throw new Error('breaker page: the 240.4(B) example changed');
  return b;
}
const NSU = nextSizeUp();
if ([C16, C24, C40, C48].map((r) => r.breakerA).join() !== '20,30,50,60') throw new Error('breaker page: the golden breakers changed');
if (MIXED.run.breakerA !== 25 || MIXED.run.minOcpdA !== 20.5) throw new Error('breaker page: the mixed example changed');
if (!W6.c60.nextSizeUp || !W6.c75.nextSizeUp || W8.c60.nextSizeUp || W8.c75.nextSizeUp) throw new Error('breaker page: the 6 and 8 AWG answers changed');
if (!W12.Cu.c75.limitedBy240_4D || W12.Cu.c60.ratingA !== W12.Cu.c75.ratingA) throw new Error('breaker page: 12 AWG copper is no longer held by 240.4(D)');
if (!W14.c75.limitedBy240_4D || W14.c60.ratingA !== W14.c75.ratingA || W10.Cu.c60.ratingA !== W10.Cu.c75.ratingA) throw new Error('breaker page: 240.4(D) no longer holds both columns');
if (RATINGS[0] >= RATING_MIN_A) throw new Error('breaker page: Table 240.6(A) no longer starts below the calculator');

const TOC: ([string, string] | [string, string, string])[] = [
  ['continuous-loads', 'Largest continuous load on each breaker'],
  ['by-wire', 'Largest breaker for each wire size'],
  ['example', 'A mixed load, step by step'],
  ['ratings', 'Standard breaker and fuse ratings'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Circuit Breaker Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Circuit Breaker Calculator', url: URL, description: DESCRIPTION };

/** A breaker in a table cell: its rating, with a dagger where only 240.4(B) allows it. */
function BreakerCell({ b }: { b: LargestBreaker }) {
  return (
    <>
      <Val v={b.ratingA} unit="A" src={CALC} />
      {b.nextSizeUp ? (
        <>
          <span aria-hidden="true">†</span>
          <span className="sr-only"> under 240.4(B)</span>
        </>
      ) : (
        <span aria-hidden="true" className="invisible">
          †
        </span>
      )}
    </>
  );
}

function WireTable({ material }: { material: Material }) {
  const name = material === 'Cu' ? 'Copper' : 'Aluminum or copper-clad aluminum';
  return (
    <DataTable id={`by-wire-${material.toLowerCase()}`} variant="ruled" src={CALC} caption={name}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Size
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0 max-sm:!px-2')}>
            <Val v={COLD} unit="°C" src={TERM} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0 max-sm:!px-2')}>
            <Val v={WARM} unit="°C" src={TERM} />
          </th>
        </tr>
      </thead>
      <tbody>
        {WIRE_ROWS[material].map((r) => (
          <tr key={r.size}>
            <th scope="row" className={RSTICKY_TD}>
              <Size s={r.size} />
            </th>
            <td className={clsx(RTD, 'max-sm:!min-w-0 max-sm:!px-2')}>
              <BreakerCell b={r.c60} />
            </td>
            <td className={clsx(RTD, 'max-sm:!min-w-0 max-sm:!px-2')}>
              <BreakerCell b={r.c75} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function CircuitBreakerCalculatorPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Circuit Breaker Calculator" sub="Breaker Size for a Load, NEC 210.20(A)" joiner=": " src={CONT} />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            The smallest standard breaker or fuse for a load, with continuous loads at <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={CONT} />, and the
            wire and ground wire it needs.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <BreakerTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={CONT}>
            <strong>
              A breaker or fuse must be rated at least the noncontinuous load plus <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={CONT} /> of the
              continuous load (NEC 210.20(A)), rounded up to a standard rating in Table 240.6(A).
            </strong>{' '}
            <span data-src={CALC}>
              A continuous load of <Val v={16} unit="A" src="input" /> takes a <Val v={C16.breakerA} unit="A" src={CALC} /> breaker,{' '}
              <Val v={24} unit="A" src="input" /> takes <Val v={C24.breakerA} unit="A" src={CALC} />, <Val v={40} unit="A" src="input" /> takes{' '}
              <Val v={C40.breakerA} unit="A" src={CALC} /> and <Val v={48} unit="A" src="input" /> takes <Val v={C48.breakerA} unit="A" src={CALC} />.
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="continuous-loads" className="space-y-5">
            <h2 id="continuous-loads" className={H2}>
              Largest continuous load on each breaker
            </h2>
            <p className={P} data-src={CONT}>
              Turned around, the rule caps a continuous load at the rating divided by{' '}
              <Num v={CONTINUOUS_LOAD_PERCENT / 100} src={CONT} format={{ upTo: 2 }} />:{' '}
              <span data-src={CALC}>
                <Val v={largestContinuousLoad(20)} unit="A" src={CALC} /> on a <Val v={20} unit="A" src={OCPD} /> breaker,{' '}
                <Val v={largestContinuousLoad(30)} unit="A" src={CALC} /> on <Val v={30} unit="A" src={OCPD} />.
              </span>{' '}
              A noncontinuous load may use the full rating, and a mixed load fits when the noncontinuous part plus{' '}
              <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={CONT} /> of the continuous part stays within it.
            </p>
            <DataTable id="continuous-table" variant="ruled" src={CALC} caption="Each rating the calculator offers" className="max-w-[28rem]">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Breaker or fuse
                  </th>
                  <th scope="col" className={RTH}>
                    Largest continuous load
                  </th>
                </tr>
              </thead>
              <tbody>
                {CONTINUOUS_ROWS.map((r) => (
                  <tr key={r.ratingA}>
                    <th scope="row" className={clsx(RSTICKY_TD, '!font-normal')}>
                      <Val v={r.ratingA} unit="A" src={OCPD} />
                    </th>
                    <td className={RTD}>
                      <Val v={r.maxContinuousA} unit="A" src={CALC} format={{ upTo: 1 }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section aria-labelledby="by-wire" className="space-y-5">
            <h2 id="by-wire" className={H2}>
              Largest breaker for each wire size
            </h2>
            <p className={P} data-src={SMALL}>
              The breaker protects the wire. 240.4(D) holds <Size s="14" />, <Size s="12" /> and <Size s="10" /> copper to{' '}
              <Val v={W14.c60.ratingA} unit="A" src={SMALL} />, <Val v={W12.Cu.c60.ratingA} unit="A" src={SMALL} /> and{' '}
              <Val v={W10.Cu.c60.ratingA} unit="A" src={SMALL} /> in either column, and <Size s="12" /> and <Size s="10" /> aluminum to{' '}
              <Val v={W12.Al.c60.ratingA} unit="A" src={SMALL} /> and <Val v={W10.Al.c60.ratingA} unit="A" src={SMALL} />.{' '}
              <span data-src={OCPD}>
                Above those sizes, a wire&apos;s breaker may match its ampacity, or under 240.4(B) be the next standard rating above it, up to{' '}
                <Val v={NEXT_SIZE_UP_MAX_A} unit="A" src={OCPD} />, when the circuit does not supply more than one receptacle for
                cord-and-plug-connected portable loads.
              </span>{' '}
              <span data-src={TERM}>
                Read the <Val v={COLD} unit="°C" src={TERM} /> column for NM or UF cable and for circuits of{' '}
                <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} /> or less, the <Val v={WARM} unit="°C" src={TERM} /> column for terminals listed
                for it and for circuits over <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} />.
              </span>
            </p>
            {/* min-w-0: a grid item may shrink below its table, which then scrolls in its own frame on a phone */}
            <div className="grid gap-8 md:grid-cols-2 md:gap-6 [&>*]:min-w-0">
              <WireTable material="Cu" />
              <WireTable material="Al" />
            </div>
            <p className="text-[15px] leading-[1.6] text-[#333333]" data-src={OCPD}>
              † Only under 240.4(B), with its condition met; otherwise the standard rating below it, such as{' '}
              <Val v={below(W6.c60)} unit="A" src={CALC} /> for <Size s="6" /> copper at <Val v={COLD} unit="°C" src={AMP} />.
            </p>
            <SourceLine domains={[AMP, TERM, SMALL, OCPD]} />
          </section>

          <section aria-labelledby="example" className="space-y-5">
            <h2 id="example" className={H2}>
              A mixed load, step by step
            </h2>
            <p className={P} data-src={CALC}>
              A circuit carries <Val v={MIXED.continuousA} unit="A" src="input" /> that runs continuously and{' '}
              <Val v={MIXED.noncontinuousA} unit="A" src="input" /> that does not. The smallest rating is{' '}
              <Val v={MIXED.noncontinuousA} unit="A" src="input" /> plus <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={CONT} /> of{' '}
              <Val v={MIXED.continuousA} unit="A" src="input" />, or <Val v={MIXED.run.minOcpdA} unit="A" src={CALC} format={{ upTo: 2 }} />, so the
              breaker is the next standard rating, <Val v={MIXED.run.breakerA} unit="A" src={CALC} />, and the wire is <Size s={MIXED.run.size} /> copper,
              which carries <Val v={MIXED.run.ampacity} unit="A" src={AMP} /> at <Val v={MIXED.run.columnC} unit="°C" src={AMP} />.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    <Val v={MIXED.noncontinuousA} unit="A" src="input" /> noncontinuous and <Val v={MIXED.continuousA} unit="A" src="input" /> continuous:
                    the load as it runs, the smallest rating with the continuous part at <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={CONT} />, the
                    breaker, and the ampacity of the wire for it.
                  </span>
                  <SourceLine domains={[CONT, OCPD, AMP]} />
                </>
              }
            >
              <BreakerStepsChart />
            </Figure>
            <p className={P} data-src={CALC}>
              A continuous load of <Val v={NEXT_SIZE_UP.continuousA} unit="A" src="input" /> needs{' '}
              <Val v={NEXT_SIZE_UP.run.minOcpdA} unit="A" src={CALC} />, so a <Val v={NEXT_SIZE_UP.run.breakerA} unit="A" src={CALC} /> breaker. The
              wire that carries the full rating is <Size s={NEXT_SIZE_UP.run.size} /> copper in NM cable, but{' '}
              <span data-src={OCPD}>
                240.4(B) also lets the breaker protect <Size s={NSU.size} /> (<Val v={NSU.ampacity} unit="A" src={AMP} /> at{' '}
                <Val v={NEXT_SIZE_UP.run.columnC} unit="°C" src={AMP} />), which still carries the{' '}
                <Val v={NEXT_SIZE_UP.run.minOcpdA} unit="A" src={CALC} /> the load needs (210.19(A)).
              </span>{' '}
              The calculator shows both.
            </p>
          </section>

          <section aria-labelledby="ratings" className="space-y-4">
            <h2 id="ratings" className={H2}>
              Standard breaker and fuse ratings
            </h2>
            <p className={P} data-src={OCPD}>
              Table 240.6(A) lists the standard ratings of fuses and inverse time circuit breakers:{' '}
              {RATINGS.map((r, k) => (
                <span key={r}>
                  <Num v={r} src={OCPD} />
                  {k < RATINGS.length - 2 ? ', ' : k === RATINGS.length - 2 ? ' and ' : ' A.'}
                </span>
              ))}{' '}
              The calculator offers <Val v={RATING_MIN_A} unit="A" src={OCPD} /> to <Val v={RATING_MAX_A} unit="A" src={OCPD} />, the range of its wire
              sizing.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-size="12">
                What size breaker for <Size s="12" /> wire?
              </h3>
              <p className={P} data-src={SMALL}>
                <Val v={W12.Cu.c60.ratingA} unit="A" src={SMALL} /> for <Size s="12" /> copper and <Val v={W12.Al.c60.ratingA} unit="A" src={SMALL} /> for{' '}
                <Size s="12" /> aluminum: 240.4(D) sets both, whatever the column.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-size="10">
                What size breaker for <Size s="10" /> wire?
              </h3>
              <p className={P} data-src={SMALL}>
                <Val v={W10.Cu.c60.ratingA} unit="A" src={SMALL} /> for <Size s="10" /> copper and <Val v={W10.Al.c60.ratingA} unit="A" src={SMALL} /> for{' '}
                <Size s="10" /> aluminum, the 240.4(D) limits.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-size="8">
                What size breaker for <Size s="8" /> wire?
              </h3>
              <p className={P} data-src={AMP}>
                <Size s="8" /> copper carries <Val v={W8.c60.ampacity} unit="A" src={AMP} /> at <Val v={COLD} unit="°C" src={AMP} />, so{' '}
                <Val v={W8.c60.ratingA} unit="A" src={CALC} /> in NM cable, and <Val v={W8.c75.ampacity} unit="A" src={AMP} /> at{' '}
                <Val v={WARM} unit="°C" src={AMP} />, so <Val v={W8.c75.ratingA} unit="A" src={CALC} /> on terminals listed for it.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-size="6">
                What size breaker for <Size s="6" /> wire?
              </h3>
              <p className={P} data-src={AMP}>
                <Size s="6" /> copper carries <Val v={W6.c60.ampacity} unit="A" src={AMP} /> at <Val v={COLD} unit="°C" src={AMP} /> and{' '}
                <Val v={W6.c75.ampacity} unit="A" src={AMP} /> at <Val v={WARM} unit="°C" src={AMP} />.{' '}
                <span data-src={OCPD}>
                  Neither is a standard rating, so 240.4(B) allows <Val v={W6.c60.ratingA} unit="A" src={CALC} /> and{' '}
                  <Val v={W6.c75.ratingA} unit="A" src={CALC} /> when the circuit does not supply more than one receptacle for cord-and-plug-connected
                  portable loads; otherwise <Val v={below(W6.c60)} unit="A" src={CALC} /> and <Val v={below(W6.c75)} unit="A" src={CALC} />.
                </span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src="input">
                How many amps can a <Val v={20} unit="A" src="input" /> breaker carry?
              </h3>
              <p className={P} data-src={CONT}>
                <Val v={largestContinuousLoad(20)} unit="A" src={CALC} /> of continuous load, since <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={CONT} /> of
                it must fit the rating, and the full <Val v={20} unit="A" src="input" /> of noncontinuous load.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src="input">
                What size breaker for a <Val v={40} unit="A" src="input" /> continuous load?
              </h3>
              <p className={P} data-src={CALC}>
                <Val v={C40.breakerA} unit="A" src={CALC} />: <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={CONT} /> of <Val v={40} unit="A" src="input" />{' '}
                is <Val v={C40.minOcpdA} unit="A" src={CALC} />, a standard rating, with <Size s={C40.size} /> copper in NM cable.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Can I put a bigger breaker on the same wire?</h3>
              <p className={P} data-src={SMALL}>
                Not past two limits: 240.4(D) caps <Size s="14" />, <Size s="12" /> and <Size s="10" /> copper at{' '}
                <Val v={W14.c60.ratingA} unit="A" src={SMALL} />, <Val v={W12.Cu.c60.ratingA} unit="A" src={SMALL} /> and{' '}
                <Val v={W10.Cu.c60.ratingA} unit="A" src={SMALL} />,{' '}
                <span data-src={OCPD}>
                  and for larger wire 240.4(B) allows at most the next standard rating above its ampacity.
                </span>{' '}
                A larger load needs larger wire: the{' '}
                <Link href="/calculators/wire-size-calculator" className={LINK}>
                  wire size calculator
                </Link>{' '}
                sizes it.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[CONT, OCPD, AMP, TERM, SMALL, EGC]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#breaker-method" className={LINK}>
                methodology page
              </Link>{' '}
              sets out each step and each source. Motor and air conditioner circuits follow rules of their own, which this calculator does not cover. NFPA
              70®, National Electrical Code® and NEC® are registered trademarks of the National Fire Protection Association; wiresizes.com is not
              affiliated with or endorsed by NFPA.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
