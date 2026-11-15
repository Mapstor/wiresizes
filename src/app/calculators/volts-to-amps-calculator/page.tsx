import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { Byline } from '@/components/content/Byline';
import { Figure } from '@/components/content/Figure';
import { Num } from '@/components/content/Num';
import { SourceLine } from '@/components/content/SourceLine';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { PowerConverterTool } from '@/components/calculators/PowerConverterTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { VA_CHART, VA_CHART_OHMS, VoltsAmpsChart } from '@/components/look/Charts';
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
import { SINGLE_PHASE_VOLTS, THREE_PHASE_VOLTS } from '@/lib/calculations/inputs';
import { ENGINE_ID, TP_SIG, ampsFromResistance, convertToAmps, isConvError, isOhmError } from '@/lib/calculations/power';
import type { ConvInput, ConvResult, OhmResult } from '@/lib/calculations/power';
import { articleDates } from '@/lib/page-dates';
import { assertNominal } from '@/lib/verified/us-nominal-voltages';

// /calculators/volts-to-amps-calculator (WSZ-007b; spec: research/page-specs.md "WSZ-007": make the tool match its
// description, I = P ÷ (V × PF) or I = V ÷ R): the converter in the look (D-33, D-35), every number from the power engine
// (convertToAmps, ampsFromResistance) or the registry, with its source in data-src. I = P ÷ (V × PF) (EIA Glossary), on
// three-phase ÷ (√3 × V × PF) (DOE/GO-10097-517); I = V ÷ R and P = V × I (NIST SP 330: Ω = V/A, W = V·A). Worked
// example = golden "power" case 4500 W at 240 V, and the same element as its 12.8 Ω resistance (R = V² ÷ P).
const ROUTE = '/calculators/volts-to-amps-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Volts to Amps Calculator: From Watts or Ohms';
const DESCRIPTION =
  'Volts alone don’t give amps: you also need the power or the resistance. I = P ÷ (V × PF), or I = V ÷ R by Ohm’s law. 4500 W at 240 V is 18.75 A.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const EIA = 'eia-power-glossary';
const DOE = 'doe-motor-load-efficiency';
const MIT = 'mit-polyphase-networks';
const SI = 'nist-sp330-si-units';
const VOLTS = 'us-nominal-voltages';
const CALC = `calc:${ENGINE_ID}`;
const SIG = { sig: TP_SIG };

assertNominal([...SINGLE_PHASE_VOLTS, ...THREE_PHASE_VOLTS, VA_CHART.volts], 'volts to amps voltages');

function byPower(input: ConvInput): ConvResult {
  const r = convertToAmps(input);
  if (isConvError(r)) throw new Error('volts to amps page: a worked example failed');
  return r;
}
function byOhms(volts: number, ohms: number): OhmResult {
  const r = ampsFromResistance(volts, ohms);
  if (isOhmError(r)) throw new Error('volts to amps page: a worked example failed');
  return r;
}
const KW = VA_CHART.watts / 1000;
// golden case "4500 W at 240 V" (power), its resistance, and the same element at 208 V
const EX_P = byPower({ phases: 1, volts: VA_CHART.volts, known: 'kw-pf', kw: KW, pf: 1 });
const EX_R = byOhms(VA_CHART.volts, VA_CHART_OHMS);
const LOW_V = 208;
const AT_208_P = byPower({ phases: 1, volts: LOW_V, known: 'kw-pf', kw: KW, pf: 1 });
const AT_208_R = byOhms(LOW_V, VA_CHART_OHMS);
// "how many amps is 120 volts": a 1,500 W load at 120 V
const AT_120 = byPower({ phases: 1, volts: 120, known: 'kw-pf', kw: 1.5, pf: 1 });
assertNominal([LOW_V, AT_120.volts], 'volts to amps example voltages');

const TOC: ([string, string] | [string, string, string])[] = [
  ['two-ways', 'Two ways to get the current'],
  ['example', 'One heater, both ways', CALC],
  ['three-phase', 'On three-phase'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Volts to Amps Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Volts to Amps Calculator', url: URL, description: DESCRIPTION };

export default function VoltsToAmpsPage() {
  const A = (a: number) => <Val v={a} unit="A" src={CALC} format={SIG} />;
  const V = (v: number) => <Val v={v} unit="V" src={VOLTS} />;
  const Wt = (w: number) => <Val v={w} unit="W" src={CALC} format={SIG} />;
  const R = <Val v={VA_CHART_OHMS} unit="Ω" src={CALC} />;
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Volts to Amps Calculator" sub="From Watts or Ohms" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            Enter the voltage and either the load&apos;s power or its resistance to get the current it draws.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <PowerConverterTool mode="volts" />
        </section>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-12">
          <p className={LOOK_LEAD} data-src={SI}>
            <strong>Volts alone don&apos;t set the current: it takes the power the load uses or its resistance.</strong> Amps = watts ÷ volts
            (÷ the power factor on AC), or amps = volts ÷ ohms by Ohm&apos;s law.{' '}
            <span data-src={CALC}>
              A <Val v={VA_CHART.watts} unit="W" src={CALC} /> element at {V(EX_P.volts)} draws {A(EX_P.amps)}.
            </span>
          </p>
          <Figure
            caption={
              <>
                <span data-src={SI}>
                  The current of a <Val v={VA_CHART.watts} unit="W" src={CALC} /> load as the voltage changes. Held at its power, the current
                  falls as the voltage rises (I = P ÷ V); as a fixed resistance of {R}, it rises with the voltage (I = V ÷ R). The two meet at{' '}
                  {V(VA_CHART.volts)}.
                </span>
                <SourceLine domains={[SI, EIA]} />
              </>
            }
          >
            <VoltsAmpsChart />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="two-ways" className="space-y-4">
            <h2 id="two-ways" className={H2}>
              Two ways to get the current
            </h2>
            <p className={LOOK_FORMULA} data-src={EIA}>
              From power: I = P ÷ (V × PF)
            </p>
            <p className={LOOK_FORMULA} data-src={SI}>
              From resistance: I = V ÷ R
            </p>
            <p className={P} data-src={SI}>
              The SI units tie the three together: NIST&apos;s guide to the SI defines the volt as a watt per ampere and the ohm as a volt per
              ampere. So a load that takes P watts at V volts draws P ÷ V amperes on DC, and a resistance of R ohms draws V ÷ R amperes.
            </p>
            <p className={P} data-src={EIA}>
              On AC, the power factor enters: the U.S. Energy Information Administration&apos;s glossary defines it as real power divided by
              apparent power, volts times amps. Enter <Num v={1} src={CALC} /> for a DC load; for an AC load, use the power factor from its
              nameplate or a meter.
            </p>
          </section>

          <section aria-labelledby="example" className="space-y-4">
            <h2 id="example" className={H2} data-src={CALC}>
              One heater, both ways
            </h2>
            <p className={P} data-src={CALC}>
              A <Val v={VA_CHART.watts} unit="W" src={CALC} /> element at {V(EX_P.volts)}: I = <Val v={VA_CHART.watts} unit="W" src={CALC} /> ÷{' '}
              {V(EX_P.volts)} = {A(EX_P.amps)}. Its resistance is V² ÷ P = {R}, and Ohm&apos;s law gives the same current: I ={' '}
              {V(EX_R.volts)} ÷ {R} = {A(EX_R.amps)}.
            </p>
            <p className={P} data-src={CALC}>
              The two ways part when the voltage changes. On {V(LOW_V)}, holding the power would give {A(AT_208_P.amps)}, more current; the
              same resistance gives {A(AT_208_R.amps)} and takes {Wt(AT_208_R.watts)}, less current and less power. For a resistance that stays
              the same, the power changes with the voltage. Use the resistance when you know it, and the power when the load is rated for the
              voltage you entered.
            </p>
          </section>

          <section aria-labelledby="three-phase" className="space-y-4">
            <h2 id="three-phase" className={H2}>
              On three-phase
            </h2>
            <p className={LOOK_FORMULA} data-src={DOE}>
              I = P ÷ (√3 × V × PF)
            </p>
            <p className={P} data-src={MIT}>
              With V the voltage between two lines, I is the current in each line of a balanced load. Choose Three-phase in the calculator; the{' '}
              <Link href="/calculators/three-phase-calculator" className={LINK}>
                three-phase calculator
              </Link>{' '}
              also takes kVA, amps and the power factor in any pair, and the{' '}
              <Link href="/calculators/kilowatts-to-amps-calculator" className={LINK}>
                kilowatts to amps calculator
              </Link>{' '}
              starts from kW.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>How many amps is {V(AT_120.volts)}?</h3>
              <p className={P} data-src={CALC}>
                It depends on the load. A <Val v={1500} unit="W" src={CALC} /> load at {V(AT_120.volts)} and power factor{' '}
                <Num v={1} src={CALC} /> draws {A(AT_120.amps)}; a load of half the power draws half the current.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How do you convert volts to amps?</h3>
              <p className={P} data-src={SI}>
                Divide the watts by the volts (and by the power factor on AC), or divide the volts by the ohms. Without the power or the
                resistance there is no current to find.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does a lower voltage mean more amps?</h3>
              <p className={P} data-src={CALC}>
                For the same power, yes; for the same resistance, no. On {V(LOW_V)} instead of {V(EX_P.volts)}, the{' '}
                <Val v={VA_CHART.watts} unit="W" src={CALC} /> element above draws {A(AT_208_R.amps)}, less than its {A(EX_R.amps)}.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What about the wire?</h3>
              <p className={P}>
                Once you have the current, the{' '}
                <Link href="/calculators/wire-size-calculator" className={LINK}>
                  wire size calculator
                </Link>{' '}
                picks the conductor and the{' '}
                <Link href="/calculators/voltage-drop-calculator" className={LINK}>
                  voltage drop calculator
                </Link>{' '}
                checks the run.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[SI, EIA, DOE, MIT, VOLTS]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#si-units" className={LINK}>
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
