import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { Byline } from '@/components/content/Byline';
import { DataTable, RSTICKY_TD, RSTICKY_TH, RTD, RTH } from '@/components/content/DataTable';
import { Figure } from '@/components/content/Figure';
import { Num } from '@/components/content/Num';
import { SourceLine } from '@/components/content/SourceLine';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { PfCurrentBars, PowerTriangle } from '@/components/look/Charts';
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
import { isTpError, threePhase } from '@/lib/calculations/power';
import type { TpResult } from '@/lib/calculations/power';
import { articleDates } from '@/lib/page-dates';
import { KVAR_TABLE, PF_BARS, PF_EXAMPLE, PF_EXAMPLE_VOLTS, assertPowerGuideVolts, correctionOf, kvarPerKw, pfBarRow } from '@/lib/power-guides';
import { DOE_PF } from '@/lib/verified/power-examples';

// /guides/power-factor-explained (WSZ-007a; spec: research/page-specs.md "WSZ-007"): power factor from the EIA Glossary's
// definitions; the power triangle, the loads behind a low power factor and capacitor correction from DOE/GO-10096-286 (its
// example as DOE states it, about 26 % less current, beside the engine's exact figures; never its "67-kW" misprint); the
// power factor against efficiency and nameplate data from DOE/GO-10097-517; the golden 0.80 → 0.95 case and a table of
// capacitor kVAR per kW from the power engine (src/lib/power-guides.ts). Every number goes through Val/Num with its source.
const ROUTE = '/guides/power-factor-explained';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Power Factor Explained: kW, kVA and kVAR';
const DESCRIPTION =
  'Power factor is real power (kW) divided by apparent power (kVA). Why a low power factor raises the current, the power triangle, and capacitor correction.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: {
    type: 'article',
    locale: 'en_US',
    siteName: 'WireSizes.com',
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    images: ['/opengraph-image'],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/twitter-image'] },
};

const EIA = 'eia-power-glossary';
const PFC = 'doe-power-factor-cost';
const DOE = 'doe-motor-load-efficiency';
const MIT = 'mit-polyphase-networks';
const VOLTS = 'us-nominal-voltages';
const CALC = 'calc:power';
const SIG = { sig: 4 };
const PF2 = { fixed: 2 };
/** The kVAR table's target columns, sized to their figures (the ruled table's 7.5em minimum would make it scroll at 390 px). */
const KVAR_TH = RTH.replace('min-w-[7.5em]', 'min-w-0');
if (KVAR_TH === RTH) throw new Error('power factor guide: RTH no longer sets min-w-[7.5em]');
/** A computed value at 4 significant figures with no trailing zeros ("125", "32.87"). */
const r4 = (v: number) => Number(v.toPrecision(4));

assertPowerGuideVolts('power factor guide');

/** DOE/GO-10096-286's example (registry coverage, power-examples.ts), solved exactly at the golden case's voltage. */
const DOE_RUN: TpResult = (() => {
  const r = threePhase({ volts: PF_EXAMPLE_VOLTS, known: 'kw-kva', kw: DOE_PF.kw, kva: DOE_PF.kva, targetPf: DOE_PF.to });
  if (isTpError(r)) throw new Error(`power factor guide: the DOE example failed (${r.error})`);
  return r;
})();
const DOE_C = correctionOf(DOE_RUN);
/** Golden case "100 kW from PF 0.80 to 0.95". */
const GOLD = PF_EXAMPLE;
const GOLD_C = correctionOf(GOLD);
const BAR_PF1 = pfBarRow(1);
const BAR_08 = pfBarRow(0.8);
const LOWEST_PF = Math.min(...PF_BARS.pfs);
const GOLD_PER_KW: number = (() => {
  const v = kvarPerKw(GOLD.pf, GOLD_C.targetPf);
  if (v === null) throw new Error('power factor guide: the golden case has no kVAR per kW');
  return v;
})();

const TOC: ([string, string] | [string, string, string])[] = [
  ['three-powers', 'Real, reactive and apparent power'],
  ['current', 'Why a low power factor raises the current'],
  ['causes', 'What lowers the power factor'],
  ['correction', 'Raising the power factor with capacitors'],
  ['table', 'Capacitor kVAR per kW', CALC],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Power Factor Explained', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

export default function PowerFactorExplainedPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Power Factor Explained" sub="kW, kVA and kVAR" joiner=": " />
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
          <div className="space-y-4">
            <p className={LOOK_LEAD} data-src={EIA}>
              <strong>Power factor is real power divided by apparent power: the share of the volt-amperes a load draws that does work.</strong>{' '}
              The other part, reactive power, does no work; motors and other magnetic equipment need it.
            </p>
            <p className={P}>
              <span data-src={CALC}>
                A load of <Val v={GOLD.kw} unit="kW" src={CALC} /> at power factor <Num v={GOLD.pf} src={CALC} format={PF2} /> draws{' '}
                <Val v={r4(GOLD.kva)} unit="kVA" src={CALC} />, and the current follows the kVA.
              </span>{' '}
              <span data-src={PFC}>
                Capacitors can supply the reactive power at the load, which lowers the current from the source.
              </span>
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={PFC}>
                  The U.S. Department of Energy&apos;s example drawn to scale: <Val v={DOE_PF.kw} unit="kW" src={PFC} /> drawing{' '}
                  <Val v={DOE_PF.kva} unit="kVA" src={PFC} />, power factor <Num v={DOE_RUN.pf} src={CALC} format={PF2} />, and the same load after a
                  capacitor bank of <Val v={DOE_C.capKvar} unit="kVAR" src={CALC} format={SIG} />, at power factor{' '}
                  <Num v={DOE_C.targetPf} src={PFC} format={PF2} />.
                </span>
                <SourceLine domains={[PFC, EIA]} />
              </>
            }
          >
            <PowerTriangle example={DOE_RUN} idPrefix="pf-triangle" />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="three-powers" className="space-y-4">
            <h2 id="three-powers" className={H2}>
              Real, reactive and apparent power
            </h2>
            <p className={P} data-src={EIA}>
              The U.S. Energy Information Administration&apos;s glossary splits the power an AC load draws into three:
            </p>
            <ul className="max-w-[35rem] list-disc space-y-2 pl-6 text-[17px] leading-[1.65] text-ink marker:text-cut-line" data-src={EIA}>
              <li>
                <strong>Apparent power</strong> (S, in volt-amperes or kVA): the voltage times the current.
              </li>
              <li>
                <strong>Real power</strong> (P, in watts or kW): the part that performs work, sometimes called active power.
              </li>
              <li>
                <strong>Reactive power</strong> (Q, in kVAR): the part that establishes and sustains the electric and magnetic fields of AC
                equipment. Most magnetic equipment, such as motors and transformers, needs it.
              </li>
            </ul>
            <p className={P} data-src={PFC}>
              Reactive power acts at a right angle to real power, so the three form a right triangle with apparent power as its long side:
            </p>
            <p className={LOOK_FORMULA} data-src={PFC}>
              S² = P² + Q² and PF = P ÷ S
            </p>
            <p className={P} data-src={CALC}>
              At power factor <Num v={GOLD.pf} src={CALC} format={PF2} />, <Val v={GOLD.kw} unit="kW" src={CALC} /> of real power comes with{' '}
              <Val v={r4(GOLD.kvar)} unit="kVAR" src={CALC} /> of reactive power and <Val v={r4(GOLD.kva)} unit="kVA" src={CALC} /> of apparent
              power.
            </p>
          </section>

          <section aria-labelledby="current" className="space-y-5">
            <h2 id="current" className={H2}>
              Why a low power factor raises the current
            </h2>
            <p className={P}>
              <span data-src={EIA}>
                Apparent power is the voltage times the current, so at a given voltage the current follows the apparent power, not the real
                power. For the same work, a lower power factor means more kVA and more current.
              </span>{' '}
              <span data-src={PFC}>
                The U.S. Department of Energy&apos;s fact sheet on power factor cost says this reduces a system&apos;s distribution capacity and
                causes voltage drops.
              </span>
            </p>
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    The current in each line of the same <Val v={PF_BARS.kw} unit="kW" src={CALC} /> three-phase load at{' '}
                    <Val v={PF_BARS.volts} unit="V" src={VOLTS} />, at power factors from <Num v={1} src={CALC} format={PF2} /> down to{' '}
                    <Num v={LOWEST_PF} src={CALC} format={PF2} />.
                  </span>
                  <SourceLine domains={[DOE, MIT, EIA, VOLTS]} />
                </>
              }
            >
              <PfCurrentBars />
            </Figure>
            <p className={P} data-src={CALC}>
              At power factor <Num v={1} src={CALC} /> the load draws <Val v={BAR_PF1.amps} unit="A" src={CALC} format={SIG} />; at{' '}
              <Num v={BAR_08.pf} src={CALC} format={PF2} />, <Val v={BAR_08.amps} unit="A" src={CALC} format={SIG} />. For the same real power and
              voltage, the current is in proportion to <Num v={1} src={CALC} /> ÷ PF. The{' '}
              <Link href="/calculators/three-phase-calculator" className={LINK}>
                three-phase calculator
              </Link>{' '}
              gives the current for any load, voltage and power factor.
            </p>
          </section>

          <section aria-labelledby="causes" className="space-y-4">
            <h2 id="causes" className={H2}>
              What lowers the power factor
            </h2>
            <p className={P} data-src={PFC}>
              The DOE power factor sheet names inductive loads: transformers, electric motors and high-intensity discharge lighting. It sets
              them against resistive loads, which create heat by consuming kilowatts.
            </p>
            <p className={P} data-src={DOE}>
              For a motor, the DOE motor fact sheet lists the full-load power factor among the nameplate data to record. Its worked example
              measures it instead: the electrician&apos;s readings include the power factor of each phase, averaged for the motor. With the real
              power and the current measured, the three-phase calculator&apos;s &quot;kW and amps&quot; choice works it out.
            </p>
          </section>

          <section aria-labelledby="correction" className="space-y-4">
            <h2 id="correction" className={H2}>
              Raising the power factor with capacitors
            </h2>
            <p className={P} data-src={PFC}>
              Capacitors supply reactive power: the DOE sheet says they store kVARs and release energy opposing the reactive energy of the
              inductive load. Installed in the circuit, they lower the reactive power, and with it the apparent power and the current, that the
              source supplies for the same real power. The bank&apos;s size in kVAR is the load&apos;s reactive power before, less its reactive
              power at the target power factor.
            </p>
            <p className={P}>
              <strong data-src={PFC}>The fact sheet&apos;s own example:</strong>{' '}
              <span data-src={PFC}>
                <Val v={DOE_PF.kw} unit="kW" src={PFC} /> drawing <Val v={DOE_PF.kva} unit="kVA" src={PFC} />, corrected to{' '}
                <Num v={DOE_PF.to} src={PFC} format={PF2} />, falls to about <Val v={DOE_PF.kvaAfter} unit="kVA" src={PFC} /> with about{' '}
                <Val v={DOE_PF.printedPct} unit="%" src={PFC} /> less current.
              </span>{' '}
              <span data-src={CALC}>
                Worked exactly, from a power factor of <Num v={DOE_RUN.pf} src={CALC} format={SIG} />, the bank is{' '}
                <Val v={DOE_C.capKvar} unit="kVAR" src={CALC} format={SIG} />, the apparent power{' '}
                <Val v={DOE_C.kvaAfter} unit="kVA" src={CALC} format={SIG} /> and the current{' '}
                <Val v={DOE_C.currentDownPct} unit="%" src={CALC} format={SIG} /> lower.
              </span>
            </p>
            <p className={P} data-src={CALC}>
              <strong>
                From <Num v={GOLD.pf} src={CALC} format={PF2} /> to <Num v={GOLD_C.targetPf} src={CALC} format={PF2} />
              </strong>{' '}
              on <Val v={GOLD.kw} unit="kW" src={CALC} />: the reactive power falls from <Val v={r4(GOLD.kvar)} unit="kVAR" src={CALC} /> to{' '}
              <Val v={GOLD_C.kvarAfter} unit="kVAR" src={CALC} format={SIG} />, so the bank is{' '}
              <Val v={GOLD_C.capKvar} unit="kVAR" src={CALC} format={SIG} />, and the current falls{' '}
              <Val v={GOLD_C.currentDownPct} unit="%" src={CALC} format={SIG} />. For the same real power, the current is multiplied by PF ÷ PF′,
              the old power factor over the new one.
            </p>
            <p className={LOOK_FORMULA} data-src={CALC}>
              kVAR = kW × (√(1 ÷ PF² − 1) − √(1 ÷ PF′² − 1))
            </p>
          </section>

          <section aria-labelledby="table" className="space-y-5">
            <h2 id="table" className={H2} data-src={CALC}>
              Capacitor kVAR per kW
            </h2>
            <p className={P} data-src={CALC}>
              Multiply the load&apos;s kW by the figure for its present power factor and the target: <Val v={GOLD.kw} unit="kW" src={CALC} /> from{' '}
              <Num v={GOLD.pf} src={CALC} format={PF2} /> to <Num v={GOLD_C.targetPf} src={CALC} format={PF2} /> takes{' '}
              <Val v={GOLD.kw} unit="kW" src={CALC} /> × <Num v={GOLD_PER_KW} src={CALC} format={SIG} /> ={' '}
              <Val v={GOLD_C.capKvar} unit="kVAR" src={CALC} format={SIG} />.
            </p>
            <DataTable id="kvar-table" variant="ruled" src={CALC} caption="kVAR of capacitor per kW of load">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Present power factor
                  </th>
                  {KVAR_TABLE.to.map((to) => (
                    <th key={to} scope="col" className={KVAR_TH}>
                      To <Num v={to} src={CALC} format={PF2} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KVAR_TABLE.from.map((from) => (
                  <tr key={from}>
                    <th scope="row" className={RSTICKY_TD}>
                      <Num v={from} src={CALC} format={PF2} />
                    </th>
                    {KVAR_TABLE.to.map((to) => {
                      const v = kvarPerKw(from, to);
                      return (
                        <td key={to} className={RTD}>
                          {v === null ? (
                            <>
                              <span aria-hidden="true">–</span>
                              <span className="sr-only">none needed</span>
                            </>
                          ) : (
                            <Num v={v} src={CALC} format={SIG} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <SourceLine domains={[PFC, EIA]} />
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>Is power factor the same as efficiency?</h3>
              <p className={P} data-src={DOE}>
                No. Power factor is real power over apparent power. Efficiency, in the NEMA definition the DOE motor fact sheet uses, is useful
                power output over total power input. The two also change differently: as a motor&apos;s load falls, its power factor tends to
                drop off sooner than its efficiency, but less steeply.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How do you calculate kVAR?</h3>
              <p className={P} data-src={PFC}>
                From the power triangle: kVAR = √(kVA² − kW²). For <Val v={GOLD.kw} unit="kW" src={CALC} /> at{' '}
                <Val v={r4(GOLD.kva)} unit="kVA" src={CALC} />, that is <Val v={r4(GOLD.kvar)} unit="kVAR" src={CALC} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How much more current does a low power factor draw?</h3>
              <p className={P} data-src={CALC}>
                For the same real power and voltage, the current is in proportion to <Num v={1} src={CALC} /> ÷ PF. At power factor{' '}
                <Num v={BAR_08.pf} src={CALC} format={PF2} />, a load draws <Val v={r4((1 / BAR_08.pf - 1) * 100)} unit="%" src={CALC} /> more
                current than at power factor <Num v={1} src={CALC} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What power factor should a facility aim for?</h3>
              <p className={P} data-src={PFC}>
                The DOE fact sheet corrects its example to <Num v={DOE_PF.to} src={PFC} format={PF2} /> and says many utilities charge an
                additional fee below that. NREL&apos;s record dates the sheet to 1996, so the utility&apos;s current rate terms are the figure to check.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does correcting the power factor change the load&apos;s real power?</h3>
              <p className={P} data-src={PFC}>
                No. The load does the same work at the same real power, <Val v={DOE_PF.kw} unit="kW" src={PFC} /> before and after in the DOE
                example; the capacitors lower the apparent power and the current the source supplies.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[EIA, PFC, DOE, MIT, VOLTS]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#power-factor-correction" className={LINK}>
                methodology page
              </Link>{' '}
              describes each source and how the calculated values are derived.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
