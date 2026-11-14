import type { Metadata } from 'next';
import type { ReactNode } from 'react';
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
import { LowVoltageTool } from '@/components/calculators/LowVoltageTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { DISC_ROWS, DISC_SCENARIO, LV_BAR_SCENARIO, LowVoltageBars, LowVoltageDiscs } from '@/components/look/Charts';
import { OnThisPage } from '@/components/look/OnThisPage';
import { PageTitle } from '@/components/look/PageTitle';
import {
  LOOK_BYLINE,
  LOOK_BYLINE_LINK,
  LOOK_FORMULA,
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
import { COPPER_K20, ENGINE_ID, LV_SIG, dcSizing, lowVoltageSize } from '@/lib/calculations/dc-sizing';
import type { LvResult } from '@/lib/calculations/dc-sizing';
import type { DcSizingResult } from '@/lib/calculations/dc-sizing';
import { COPPER_ALPHA } from '@/lib/calculations/resistance';
import { articleDates } from '@/lib/page-dates';
import { areaCmil } from '@/lib/verified/awg';
import type { SizeKey } from '@/lib/verified/awg';
import { VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { table31016 } from '@/lib/verified/nec-310-16';

// /calculators/low-voltage-calculator (WSZ-006c PHYSICS; spec: research/page-specs.md "WSZ-006"): the calculator in the
// look (D-33, D-35), every number from the DC sizing engine (dcSizing, lowVoltageSize) or the data modules, with its source
// in data-src. CM = 2 × K × I × L ÷ VD, K = 10.371 × (1 + 0.00393 × (T − 20 °C)) Ω·cmil/ft; the larger of the size for the
// drop and the size for the current (60 °C column of Table 310.16) applies. Worked examples = golden dc-sizing cases.
const ROUTE = '/calculators/low-voltage-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Low Voltage Wire Size Calculator: 12 V, 24 V and 48 V DC';
const DESCRIPTION =
  'Copper wire size for a 12, 24 or 48 V DC run from the load, the one-way length and your voltage-drop target, checked against the current too.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'WireSizes.com',
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    images: ['/opengraph-image'],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const RES = 'conductor-resistance-20c';
const GEO = 'awg-geometry';
const AMP = 'nec-310-16';
const NOTE = 'nec-continuous-load';
const SI = 'nist-sp330-si-units';
const CALC = `calc:${ENGINE_ID}`;
const SIG = { sig: LV_SIG };

function sized(volts: number, watts: number, lengthFt: number, dropPct: number, tempC: number): DcSizingResult {
  const r = dcSizing({ volts, watts, lengthFt, dropPct, tempC });
  if ('error' in r) throw new Error('low voltage page: a worked example failed');
  return r;
}

// the golden worked examples (research/golden-cases.json, group dc-sizing)
const EX_20 = sized(12, 400, 40, 2, 20);
const EX_75 = sized(12, 400, 40, 2, 75);
const EX_SHORT = sized(12, 360, 1, 3, 75);
const K75 = EX_75.k;
const [D12, D24, D48] = DISC_ROWS;

/** The 12 V chart: currents down, one-way lengths across, the size the calculator would give at 3 % and 75 °C. */
const CHART_AMPS = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];
const CHART_FT = [5, 10, 15, 20, 25, 30, 40, 50];
const CHART_TARGET = VOLTAGE_DROP_NOTE.feederPct;
function chartSize(amps: number, lengthFt: number): SizeKey | null {
  return lowVoltageSize({ volts: 12, amps, lengthFt, dropPct: CHART_TARGET, tempC: 75 })?.resultSize ?? null;
}
const Q12_20_20 = chartSize(20, 20) as SizeKey;
/** Two runs from the chart: a small load on a short run (the current decides) and a larger one farther away (the drop does). */
function lv12(amps: number, lengthFt: number): LvResult {
  const r = lowVoltageSize({ volts: 12, amps, lengthFt, dropPct: CHART_TARGET, tempC: 75 });
  if (!r) throw new Error('low voltage page: no result for the chart example');
  return r;
}
const GOV_CURRENT = lv12(5, 5);
const GOV_DROP = lv12(20, 20);
if (GOV_CURRENT.governs !== 'current' || GOV_DROP.governs !== 'voltage drop') throw new Error('low voltage page: the governs examples changed');

const TOC: ([string, string] | [string, string, string])[] = [
  ['read', 'Reading the result'],
  ['examples', 'Worked examples'],
  ['chart', '12 V wire size chart', `calc:${ENGINE_ID}`],
  ['governs', 'Drop or current: which sets the size'],
  ['voltage', 'Why a higher voltage needs less copper'],
  ['formula', 'The formula'],
  ['covers', 'What the calculator covers'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Low Voltage Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Low Voltage Calculator', url: URL, description: DESCRIPTION };

/** A stat callout: one figure in Azeret Mono at the headline size, what it is, and its source, under a 2 px ink rule. */
function Stat({ figure, text, domains }: { figure: ReactNode; text: ReactNode; domains: string[] }) {
  return (
    <aside className="max-w-[35rem] border-t-2 border-ink pt-3" aria-label="Key figure">
      <p className="font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]">{figure}</p>
      <p className="mt-2 text-[15px] leading-[1.55] text-cut-caption">{text}</p>
      <SourceLine domains={domains} />
    </aside>
  );
}

function SizeOf({ s }: { s: SizeKey | null }) {
  return s ? <Size s={s} /> : <>none</>;
}

export default function LowVoltageCalculatorPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Low Voltage Calculator" sub="Wire Size for 12 V, 24 V and 48 V DC" joiner=": " src={CALC} />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            Enter the DC voltage, the load and the one-way length to get the copper size that keeps the voltage drop within your target and
            carries the current.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <LowVoltageTool />
        </section>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-12">
          <p className={LOOK_LEAD} data-src={CALC}>
            <strong>Doubling the voltage cuts the copper a DC run needs to a quarter.</strong> A{' '}
            <Val v={DISC_SCENARIO.watts} unit="W" src={CALC} /> load <Val v={DISC_SCENARIO.lengthFt} unit="ft" src={CALC} /> away, held to a{' '}
            <Val v={DISC_SCENARIO.dropPct} unit="%" src={CALC} /> drop, needs about <Val v={D12.cmil} unit="cmil" src={CALC} format={SIG} /> at{' '}
            <Val v={D12.volts} unit="V" src={CALC} />, a <Size s={D12.size} /> conductor; at <Val v={D24.volts} unit="V" src={CALC} />,{' '}
            <Val v={D24.cmil} unit="cmil" src={CALC} format={SIG} /> (<Size s={D24.size} />); at <Val v={D48.volts} unit="V" src={CALC} />,{' '}
            <Val v={D48.cmil} unit="cmil" src={CALC} format={SIG} /> (<Size s={D48.size} />).
          </p>
          <Figure
            caption={
              <>
                <span data-src={CALC}>
                  The three conductors drawn to one scale, for a <Val v={DISC_SCENARIO.watts} unit="W" src={CALC} /> load{' '}
                  <Val v={DISC_SCENARIO.lengthFt} unit="ft" src={CALC} /> away with a <Val v={DISC_SCENARIO.dropPct} unit="%" src={CALC} /> drop,
                  copper at <Val v={DISC_SCENARIO.tempC} unit="°C" src={AMP} />; under each, the current at that voltage.
                </span>
                <SourceLine domains={[GEO, RES, AMP]} />
              </>
            }
          >
            <LowVoltageDiscs />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="read" className="space-y-4">
            <h2 id="read" className={H2}>
              Reading the result
            </h2>
            <p className={P}>
              <strong>The large figure</strong> is the wire size to use. The calculator works out two sizes and gives the larger: the smallest
              size whose copper area keeps the drop within your target, and the smallest size that can carry the current. The line under it
              says which of the two set the result.
            </p>
            <p className={P}>
              <strong>The table</strong> shows the current, the drop your target allows in volts, the copper area that drop needs in circular
              mils and mm², both sizes, and the drop the chosen size gives. <strong>The bars</strong> compare the drop in the sizes around it,
              with your target marked.
            </p>
          </section>

          <section aria-labelledby="examples" className="space-y-5">
            <h2 id="examples" className={H2}>
              Worked examples
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>
                <Val v={400} unit="W" src={CALC} /> at <Val v={12} unit="V" src={CALC} />, <Val v={40} unit="ft" src={CALC} />, a{' '}
                <Val v={2} unit="%" src={CALC} /> drop
              </h3>
              <p className={P} data-src={CALC}>
                The current is <Val v={400} unit="W" src={CALC} /> ÷ <Val v={12} unit="V" src={CALC} /> ={' '}
                <Val v={EX_75.amps} unit="A" src={CALC} format={SIG} />, and the drop allowed is <Val v={EX_75.vdVolts} unit="V" src={CALC} format={SIG} />.
                With copper at <Val v={75} unit="°C" src={AMP} />, K is <Num v={K75} src={CALC} format={{ sig: 4 }} /> Ω·cmil/ft, so the area needed is
                about <Val v={EX_75.requiredCmil} unit="cmil" src={CALC} format={SIG} />: <SizeOf s={EX_75.vdSize} />. At{' '}
                <Val v={20} unit="°C" src={RES} /> it would be <Val v={EX_20.requiredCmil} unit="cmil" src={CALC} format={SIG} />,{' '}
                <SizeOf s={EX_20.vdSize} />. The current alone needs only <SizeOf s={EX_75.currentSize} />, so the drop sets the size.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                <Val v={360} unit="W" src={CALC} /> at <Val v={12} unit="V" src={CALC} />, <Val v={1} unit="ft" src={CALC} />, a{' '}
                <Val v={3} unit="%" src={CALC} /> drop
              </h3>
              <p className={P} data-src={CALC}>
                A one-foot run hardly drops anything: the drop alone would allow <SizeOf s={EX_SHORT.vdSize} />. But{' '}
                <Val v={EX_SHORT.amps} unit="A" src={CALC} format={SIG} /> is more than that size can carry, and the smallest copper size whose{' '}
                <Val v={60} unit="°C" src={AMP} /> ampacity covers it is <SizeOf s={EX_SHORT.currentSize} />. The current sets the size:{' '}
                <SizeOf s={EX_SHORT.resultSize} />.
              </p>
            </div>
          </section>

          <section aria-labelledby="chart" className="space-y-5">
            <h2 id="chart" className={H2} data-src={CALC}>
              12 V wire size chart
            </h2>
            <p className={P} data-src={CALC}>
              The size the calculator gives at <Val v={12} unit="V" src={CALC} /> for a <Val v={CHART_TARGET} unit="%" src={NOTE} /> drop, copper at{' '}
              <Val v={75} unit="°C" src={AMP} />: the larger of the size for the drop and the size for the current in the{' '}
              <Val v={60} unit="°C" src={AMP} /> column of NEC Table 310.16. Short runs of small loads stop at <Size s="14" />, the smallest
              copper size that column lists.
            </p>
            <DataTable id="chart-table" variant="ruled" src={CALC} caption="Copper wire size at 12 V DC for a 3 % drop, by current and one-way length">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Current
                  </th>
                  {CHART_FT.map((ft) => (
                    <th key={ft} scope="col" className={RTH}>
                      <Val v={ft} unit="ft" src={CALC} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHART_AMPS.map((amps) => (
                  <tr key={amps}>
                    <th scope="row" className={RSTICKY_TD}>
                      <Val v={amps} unit="A" src={CALC} />
                    </th>
                    {CHART_FT.map((ft) => {
                      const size = chartSize(amps, ft);
                      return (
                        <td key={ft} className={RTD}>
                          {size ? (
                            <span data-size={size}>{size}</span>
                          ) : (
                            <>
                              <span aria-hidden="true">–</span>
                              <span className="sr-only">no value</span>
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <SourceLine domains={[RES, GEO, AMP]} />
            <p className={P} data-src={CALC}>
              At <Val v={LV_BAR_SCENARIO.amps} unit="A" src={CALC} />, even a modest load runs out of length quickly: the chart below gives how far
              each size reaches before the drop hits <Val v={LV_BAR_SCENARIO.dropPct} unit="%" src={NOTE} />.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    One-way length at which <Val v={LV_BAR_SCENARIO.amps} unit="A" src={CALC} /> at <Val v={LV_BAR_SCENARIO.volts} unit="V" src={CALC} />{' '}
                    reaches a <Val v={LV_BAR_SCENARIO.dropPct} unit="%" src={NOTE} /> drop, copper at <Val v={LV_BAR_SCENARIO.tempC} unit="°C" src={AMP} />.
                    Point at a bar to read it.
                  </span>
                  <SourceLine domains={[RES, GEO]} />
                </>
              }
            >
              <LowVoltageBars />
            </Figure>
          </section>

          <section aria-labelledby="governs" className="space-y-4">
            <h2 id="governs" className={H2}>
              Drop or current: which sets the size
            </h2>
            <p className={P}>
              The copper a run needs for the drop grows with its length; the copper it needs for the current does not. On a short run the
              current sets the size, because almost any wire keeps the drop small; past a certain length the drop takes over, and the size climbs
              with every extra foot. The calculator works out both and shows which one decided.
            </p>
            <p className={P} data-src={CALC}>
              From the chart above: <Val v={GOV_CURRENT.input.amps} unit="A" src={CALC} /> at <Val v={GOV_CURRENT.input.lengthFt} unit="ft" src={CALC} />{' '}
              would get by on <SizeOf s={GOV_CURRENT.vdSize} /> for the drop, but the current needs <SizeOf s={GOV_CURRENT.currentSize} />;{' '}
              <Val v={GOV_DROP.input.amps} unit="A" src={CALC} /> at <Val v={GOV_DROP.input.lengthFt} unit="ft" src={CALC} /> needs{' '}
              <SizeOf s={GOV_DROP.vdSize} /> for the drop, far more than the <SizeOf s={GOV_DROP.currentSize} /> the current needs.
            </p>
          </section>

          <section aria-labelledby="voltage" className="space-y-4">
            <h2 id="voltage" className={H2}>
              Why a higher voltage needs less copper
            </h2>
            <p className={P} data-src={SI}>
              For the same power, twice the voltage draws half the current (I = P ÷ V). The drop allowed doubles too, since it is a share of a
              voltage twice as high. The copper area needed is in proportion to the current and in inverse proportion to the allowed drop, so it
              falls to a quarter.
            </p>
            <Stat
              figure={<Num v={1 / 4} src={CALC} format={{ fixed: 2 }} prefix="×" />}
              text={
                <span data-src={CALC}>
                  The copper area a DC run needs when its voltage doubles at the same power and the same percent drop: from{' '}
                  <Val v={D12.cmil} unit="cmil" src={CALC} format={SIG} /> at <Val v={D12.volts} unit="V" src={CALC} /> to{' '}
                  <Val v={D24.cmil} unit="cmil" src={CALC} format={SIG} /> at <Val v={D24.volts} unit="V" src={CALC} /> in the drawing above.
                </span>
              }
              domains={[RES, GEO]}
            />
          </section>

          <section aria-labelledby="formula" className="space-y-4">
            <h2 id="formula" className={H2}>
              The formula
            </h2>
            <p className={LOOK_FORMULA} data-src={CALC}>
              CM = 2 × K × I × L ÷ VD
            </p>
            <p className={P} data-src={CALC}>
              CM is the copper area in circular mils, I the current in amperes, L the one-way length in feet and VD the drop allowed in volts:
              the supply voltage times your target percent. The <Num v={2} src={CALC} /> counts the wire out and back. K is copper&apos;s
              resistivity in Ω·cmil/ft at the conductor&apos;s temperature:
            </p>
            <p className={LOOK_FORMULA} data-src={RES}>
              K = <Num v={COPPER_K20} src={RES} /> × (1 + <Num v={COPPER_ALPHA} src={RES} /> × (T − <Val v={20} unit="°C" src={RES} />))
            </p>
            <p className={P} data-src={CALC}>
              <Num v={COPPER_K20} src={RES} /> is NIST&apos;s resistivity of annealed copper at <Val v={20} unit="°C" src={RES} />; at{' '}
              <Val v={75} unit="°C" src={AMP} /> K is <Num v={K75} src={CALC} format={{ sig: 4 }} />. A size meets the drop when its area is at least
              CM: <Size s="10" />, for example, has <Val v={areaCmil('10')} unit="cmil" src={GEO} />.
            </p>
          </section>

          <section aria-labelledby="covers" className="space-y-4">
            <h2 id="covers" className={H2}>
              What the calculator covers
            </h2>
            <p className={P}>
              <strong>Copper only</strong>, solid conductors at the temperature you choose. A stranded conductor of the same size has slightly
              higher resistance, so leave some margin under your target.
            </p>
            <p className={P} data-src={AMP}>
              <strong>The current check</strong> uses the <Val v={60} unit="°C" src={AMP} /> column of NEC Table 310.16, which assumes{' '}
              <Val v={30} unit="°C" src={AMP} /> around the wire and no more than three current-carrying conductors together. For a hotter place or
              a bundle, the{' '}
              <Link href="/guides/nec-table-310-16" className={LINK}>
                Table 310.16 page
              </Link>{' '}
              gives the corrections. Smallest in that column is <Size s="14" /> at <Val v={table31016('14', 'cu_60') as number} unit="A" src={AMP} />.
            </p>
            <p className={P}>
              <strong>Not covered:</strong> boats, vehicles and RVs follow wiring standards of their own, and the fuse or breaker that protects
              the run is a separate choice.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>
                What size wire for <Val v={20} unit="A" src={CALC} /> at <Val v={12} unit="V" src={CALC} />, <Val v={20} unit="ft" src={CALC} /> away?
              </h3>
              <p className={P} data-src={CALC}>
                <SizeOf s={Q12_20_20} /> for a <Val v={CHART_TARGET} unit="%" src={NOTE} /> drop with copper at <Val v={75} unit="°C" src={AMP} />. The
                chart above has other currents and lengths, and the calculator any combination.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                Why does a <Val v={12} unit="V" src={CALC} /> system need such thick wire?
              </h3>
              <p className={P}>
                The same power at <Val v={12} unit="V" src={CALC} /> draws ten times the current it would at <Val v={120} unit="V" src={CALC} />, and a
                given percent of <Val v={12} unit="V" src={CALC} /> is a tenth of the volts. Both push the copper area up.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                Does <Val v={24} unit="V" src={CALC} /> need smaller wire than <Val v={12} unit="V" src={CALC} />?
              </h3>
              <p className={P}>
                Yes: for the same power and the same percent drop, a quarter of the copper area, which is about six gauge steps smaller.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How much voltage drop is acceptable on a low-voltage run?</h3>
              <p className={P} data-src={NOTE}>
                It depends on what the load can tolerate; its maker&apos;s documents give the voltage it needs. The calculator starts at{' '}
                <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={NOTE} />, the figure in the 2023 NEC&apos;s informational note on feeders
                (215.2(A)), which is advice about efficiency rather than a limit.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                Should the run be sized at <Val v={20} unit="°C" src={RES} /> or <Val v={75} unit="°C" src={AMP} />?
              </h3>
              <p className={P}>
                <Val v={75} unit="°C" src={AMP} /> is the safer choice and the calculator&apos;s start: copper&apos;s resistance there is higher, so the
                size covers a warm conductor. <Val v={20} unit="°C" src={RES} /> suits a lightly loaded run at room temperature.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[RES, GEO, AMP, NOTE, SI]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#resistance" className={LINK}>
                methodology page
              </Link>{' '}
              describes each source and how the calculated values are derived. NFPA 70®, National Electrical Code® and NEC® are registered
              trademarks of the National Fire Protection Association; wiresizes.com is not affiliated with or endorsed by NFPA.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
