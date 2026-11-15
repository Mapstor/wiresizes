import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { Byline } from '@/components/content/Byline';
import { DataTable, RSTICKY_TD, RSTICKY_TH, RTD, RTH } from '@/components/content/DataTable';
import { Num } from '@/components/content/Num';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { OhmsLawTool } from '@/components/calculators/OhmsLawTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
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
import { ENGINE_ID, solvePair } from '@/lib/calculations/ohms-law';
import type { OhmsLawValues, OhmsPair } from '@/lib/calculations/ohms-law';
import { articleDates } from '@/lib/page-dates';

// /calculators/ohms-law-calculator (WSZ-007d; spec: research/page-specs.md "WSZ-007": keep the correct examples, remove
// "+40% hot winding"): the calculator in the look (D-33, D-35), every number from the Ohm's law engine (solvePair) with its
// source in data-src. The relations are the SI definitions of NIST SP 330 Table 4 (V = W/A, Ω = V/A); the power factor
// note is the EIA Glossary's. Worked examples = golden "ohms-law" cases.
const ROUTE = '/calculators/ohms-law-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = "Ohm's Law Calculator: Volts, Amps, Ohms and Watts";
const DESCRIPTION =
  'Enter any two of volts, amps, ohms and watts to get the other two. V = I × R and P = V × I, with all twelve formulas and worked examples.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const SI = 'nist-sp330-si-units';
const EIA = 'eia-power-glossary';
const CALC = `calc:${ENGINE_ID}`;
const SIG = { sig: 4 };

function solved(pair: OhmsPair, a: number, b: number): OhmsLawValues {
  const r = solvePair(pair, a, b);
  if (!r) throw new Error('Ohm’s law page: a worked example failed');
  return r;
}
// golden "ohms-law" cases (research/golden-cases.json)
const HEATER = solved('vp', 240, 1500);
const LED = { supply: 12, load: 3.2, milliamps: 20 };
const RESISTOR = solved('vi', LED.supply - LED.load, LED.milliamps / 1000);
const TWELVE = solved('vr', 12, 4);

const FORMULAS: { find: string; symbol: string; rows: [string, string, string] }[] = [
  { find: 'Voltage', symbol: 'V', rows: ['I × R', 'P ÷ I', '√(P × R)'] },
  { find: 'Current', symbol: 'I', rows: ['V ÷ R', 'P ÷ V', '√(P ÷ R)'] },
  { find: 'Resistance', symbol: 'R', rows: ['V ÷ I', 'V² ÷ P', 'P ÷ I²'] },
  { find: 'Power', symbol: 'P', rows: ['V × I', 'I² × R', 'V² ÷ R'] },
];

const TOC: ([string, string] | [string, string, string])[] = [
  ['formulas', 'The twelve formulas'],
  ['examples', 'Worked examples', CALC],
  ['ac-dc', 'AC and DC'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: "Ohm's Law Calculator", description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: "Ohm's Law Calculator", url: URL, description: DESCRIPTION };

export default function OhmsLawPage() {
  const V = (v: number) => <Val v={v} unit="V" src={CALC} format={SIG} />;
  const I = (v: number) => <Val v={v} unit="A" src={CALC} format={SIG} />;
  const R = (v: number) => <Val v={v} unit="Ω" src={CALC} format={SIG} />;
  const W = (v: number) => <Val v={v} unit="W" src={CALC} format={SIG} />;
  const plain = (v: number, unit: 'V' | 'A' | 'Ω' | 'W') => <Val v={v} unit={unit} src={CALC} />;
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Ohm's Law Calculator" sub="Volts, Amps, Ohms and Watts" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>Enter any two of voltage, current, resistance and power to get the other two.</p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <OhmsLawTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={SI}>
            <strong>Ohm&apos;s law: voltage equals current times resistance, V = I × R. With power, P = V × I, any two of the four give the other two.</strong>{' '}
            <span data-src={CALC}>
              A {plain(HEATER.power, 'W')} heater on {plain(HEATER.voltage, 'V')} draws {I(HEATER.current)} and has a resistance of {R(HEATER.resistance)}.
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="formulas" className="space-y-5">
            <h2 id="formulas" className={H2}>
              The twelve formulas
            </h2>
            <p className={P} data-src={SI}>
              NIST&apos;s guide to the SI defines the volt as a watt per ampere and the ohm as a volt per ampere. From those two definitions come
              three ways to find each quantity:
            </p>
            <DataTable id="ohms-formulas" variant="ruled" src={SI} caption="Each quantity from each pair of the others">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    To find
                  </th>
                  <th scope="col" className={RTH}>
                    From two
                  </th>
                  <th scope="col" className={RTH}>
                    Or
                  </th>
                  <th scope="col" className={RTH}>
                    Or
                  </th>
                </tr>
              </thead>
              <tbody>
                {FORMULAS.map((f) => (
                  <tr key={f.symbol}>
                    <th scope="row" className={RSTICKY_TD}>
                      {f.find} ({f.symbol})
                    </th>
                    {f.rows.map((r) => (
                      <td key={r} className={RTD}>
                        {f.symbol} = {r}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section aria-labelledby="examples" className="space-y-4">
            <h2 id="examples" className={H2} data-src={CALC}>
              Worked examples
            </h2>
            <h3 className={H3} data-src={CALC}>
              A heater: {plain(HEATER.power, 'W')} on {plain(HEATER.voltage, 'V')}
            </h3>
            <p className={P} data-src={CALC}>
              I = P ÷ V = {plain(HEATER.power, 'W')} ÷ {plain(HEATER.voltage, 'V')} = {I(HEATER.current)}. R = V² ÷ P = ({plain(HEATER.voltage, 'V')})² ÷{' '}
              {plain(HEATER.power, 'W')} = {R(HEATER.resistance)}. Check: P = I² × R = ({I(HEATER.current)})² × {R(HEATER.resistance)} ={' '}
              {W(HEATER.current * HEATER.current * HEATER.resistance)}.
            </p>
            <h3 className={H3} data-src={CALC}>
              A resistor in series with a small load
            </h3>
            <p className={P} data-src={CALC}>
              A load that needs <Num v={LED.milliamps} src={CALC} /> mA at {plain(LED.load, 'V')}, from a {plain(LED.supply, 'V')} supply: the resistor
              takes the other {V(RESISTOR.voltage)}. R = V ÷ I = {V(RESISTOR.voltage)} ÷ {I(RESISTOR.current)} = {R(RESISTOR.resistance)}, and it
              turns P = V × I = {W(RESISTOR.power)} into heat. Pick a resistor rated above that power.
            </p>
            <h3 className={H3} data-src={CALC}>
              {plain(TWELVE.voltage, 'V')} across {plain(TWELVE.resistance, 'Ω')}
            </h3>
            <p className={P} data-src={CALC}>
              I = V ÷ R = {I(TWELVE.current)}; P = V² ÷ R = {W(TWELVE.power)}.
            </p>
          </section>

          <section aria-labelledby="ac-dc" className="space-y-4">
            <h2 id="ac-dc" className={H2}>
              AC and DC
            </h2>
            <p className={P} data-src={SI}>
              On DC the formulas hold as written. On AC they hold for a purely resistive load, whose current is in step with its voltage.
            </p>
            <p className={P} data-src={EIA}>
              For a motor or another load whose power factor is below <Num v={1} src={CALC} />, volts times amps is the apparent power, not the
              power: the U.S. Energy Information Administration&apos;s glossary defines the power factor as real power divided by apparent power.
              The{' '}
              <Link href="/calculators/watts-to-amps-calculator" className={LINK}>
                watts to amps calculator
              </Link>{' '}
              takes the power factor, and the{' '}
              <Link href="/guides/power-factor-explained" className={LINK}>
                power factor guide
              </Link>{' '}
              explains it.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>What is Ohm&apos;s law?</h3>
              <p className={P} data-src={SI}>
                The voltage across a resistance equals the current through it times the resistance: V = I × R. It follows from the SI definition
                of the ohm as a volt per ampere.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How do you find watts from volts and ohms?</h3>
              <p className={P} data-src={CALC}>
                P = V² ÷ R: {plain(TWELVE.voltage, 'V')} across {plain(TWELVE.resistance, 'Ω')} is {W(TWELVE.power)}.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How do you find resistance from watts and volts?</h3>
              <p className={P} data-src={CALC}>
                R = V² ÷ P: a {plain(HEATER.power, 'W')} element rated for {plain(HEATER.voltage, 'V')} has {R(HEATER.resistance)}.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What about the resistance of a wire?</h3>
              <p className={P}>
                The{' '}
                <Link href="/calculators/wire-resistance-calculator" className={LINK}>
                  wire resistance calculator
                </Link>{' '}
                gives it from the size, length and temperature, and the{' '}
                <Link href="/calculators/voltage-drop-calculator" className={LINK}>
                  voltage drop calculator
                </Link>{' '}
                applies V = I × R to a run.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[SI, EIA]}
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
