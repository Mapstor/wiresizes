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
import { WattsPerAmpBars, WorkedPowerTriangle } from '@/components/look/Charts';
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
import { ENGINE_ID as OHMS_ENGINE } from '@/lib/calculations/ohms-law';
import { SQRT3 } from '@/lib/calculations/power';
import { articleDates } from '@/lib/page-dates';
import { GUIDE_EXAMPLES, WATTS_PER_AMP_ROWS, assertPowerGuideVolts } from '@/lib/power-guides';
import type { WattsPerAmpRow } from '@/lib/power-guides';

// /guides/electrical-power-calculations (WSZ-007e; spec: research/page-specs.md "WSZ-007"): the formulas for power and
// current on DC, single-phase and three-phase circuits, with worked examples that are golden cases
// (src/lib/power-guides.ts GUIDE_EXAMPLES). The relations are NIST SP 330's (the watt as a volt times an ampere, the ohm
// as a volt per ampere), the EIA Glossary's (apparent power = volts × amperes, PF = P ÷ S), DOE/GO-10097-517's
// (three-phase P = √3 × V × I × PF), MIT 6.061's (√3 between line-to-line and line-to-neutral voltage) and
// DOE/GO-10096-286's (the power triangle, Q = √(S² − P²)); the voltages are NCUC Rule R8-17's nominal systems. Every
// number goes through Val/Num with its source.
const ROUTE = '/guides/electrical-power-calculations';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Electrical Power Calculations: Watts, Volts and Amps';
const DESCRIPTION =
  'Power is volts times amps; AC multiplies by the power factor, three-phase by √3 as well. The formulas for watts, amps and kVA, with worked examples.';

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

const SI = 'nist-sp330-si-units';
const EIA = 'eia-power-glossary';
const DOE = 'doe-motor-load-efficiency';
const MIT = 'mit-polyphase-networks';
const PFC = 'doe-power-factor-cost';
const VOLTS = 'us-nominal-voltages';
const CALC = 'calc:power';
const OHMS = `calc:${OHMS_ENGINE}`;
const SIG = { sig: 4 };

assertPowerGuideVolts('electrical power calculations guide');
const { dc, element, elementOhms, elementAt208, motor, fromAmps, kva } = GUIDE_EXAMPLES;
if (element.kw === null || motor.kw === null || motor.pf === null || fromAmps.kw === null || fromAmps.kvar === null || fromAmps.pf === null) {
  throw new Error('electrical power calculations guide: an example lost its power factor');
}
const ELEMENT_W = element.kw * 1000;
const MOTOR_KW = motor.kw;
const MOTOR_PF = motor.pf;
const FROM_PF = fromAmps.pf;
const FROM_KW = fromAmps.kw;
const FROM_KVAR = fromAmps.kvar;
const FROM_AMPS_W = Number((FROM_KW * 1000).toPrecision(6));

const [W120, W240, W208, W480] = WATTS_PER_AMP_ROWS;

const TOC: ([string, string] | [string, string, string])[] = [
  ['formulas', 'The formulas'],
  ['examples', 'Worked examples'],
  ['three-powers', 'Real, reactive and apparent power'],
  ['per-amp', 'Watts per amp'],
  ['other-voltage', 'A heater on another voltage'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

/** The formulas column: left-aligned, with less side padding, so the table fits a 390 px screen. */
const FORMULA_CELL = '!text-left !pl-3 !pr-1.5';
/** The formulas table: one row per circuit, each the source that states its formulas. */
const FORMULA_ROWS = [
  { circuit: 'DC', power: 'P = V × I', current: 'I = P ÷ V', src: SI },
  { circuit: 'Single-phase', power: 'P = V × I × PF', current: 'I = P ÷ (V × PF)', src: EIA },
  { circuit: 'Three-phase', power: 'P = √3 × V × I × PF', current: 'I = P ÷ (√3 × V × PF)', src: DOE },
];

const articleData = { headline: 'Electrical Power Calculations', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

/** Four significant figures, trailing zeros dropped (66.82, 208.2, 360.3). */
const r4 = (v: number) => Number(v.toPrecision(4));

/** "240 V single" from a row, as the bars name it, the voltage traced to the nominal systems. */
function System({ r }: { r: WattsPerAmpRow }) {
  return (
    <>
      <Val v={r.volts} unit="V" src={VOLTS} /> {r.phases === 1 ? 'single' : 'three'}
    </>
  );
}

function PerAmp({ r }: { r: WattsPerAmpRow }) {
  return <Val v={r4(r.watts)} unit="W" src={CALC} />;
}

export default function ElectricalPowerCalculationsPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Electrical Power Calculations" sub="Watts, Volts and Amps" joiner=": " />
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
          <div className="space-y-4">
            <p className={LOOK_LEAD} data-src={SI}>
              <strong>Electrical power is voltage times current: P = V × I, in watts.</strong>{' '}
              <span data-src={EIA}>
                On AC that product is the apparent power, and the power factor gives the share of it that does work. Three-phase adds a factor of
                √3.
              </span>
            </p>
            <p className={P} data-src={CALC}>
              A <Val v={ELEMENT_W} unit="W" src={CALC} /> heating element on <Val v={element.volts} unit="V" src={VOLTS} /> draws{' '}
              <Val v={element.amps} unit="A" src={CALC} />, and <Val v={fromAmps.amps} unit="A" src={CALC} /> on{' '}
              <Val v={fromAmps.volts} unit="V" src={VOLTS} /> three-phase at power factor <Num v={FROM_PF} src={CALC} /> is{' '}
              <Val v={FROM_AMPS_W} unit="W" src={CALC} /> of real power.
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={CALC}>
                  The power of <Val v={fromAmps.amps} unit="A" src={CALC} /> on <Val v={fromAmps.volts} unit="V" src={VOLTS} /> three-phase at
                  power factor <Num v={FROM_PF} src={CALC} />, drawn to one scale. Apparent power is √3 × V × I, real power is apparent power
                  times the power factor, and reactive power is the third side of the right triangle.
                </span>
                <SourceLine domains={[EIA, MIT, PFC]} />
              </>
            }
          >
            <WorkedPowerTriangle />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="formulas" className="space-y-5">
            <h2 id="formulas" className={H2}>
              The formulas
            </h2>
            <p className={P} data-src={SI}>
              P is the real power in watts, V the voltage, I the current in amperes and PF the power factor. NIST&apos;s guide to the SI defines
              the watt as a volt times an ampere, which is the DC formula; <span data-src={EIA}>the U.S. Energy Information Administration&apos;s
              glossary defines the power factor as real power divided by apparent power.</span>
            </p>
            <DataTable id="formulas-table" variant="ruled" src={EIA} caption="Power and current by circuit">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Circuit
                  </th>
                  <th scope="col" className={clsx(RTH, FORMULA_CELL)}>
                    Power, W, and current, A
                  </th>
                </tr>
              </thead>
              <tbody>
                {FORMULA_ROWS.map((r) => (
                  <tr key={r.circuit} data-src={r.src}>
                    <th scope="row" className={RSTICKY_TD}>
                      {r.circuit}
                    </th>
                    <td className={clsx(RTD, FORMULA_CELL)}>
                      <span className="block">{r.power}</span>
                      <span className="block">{r.current}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className={P} data-src={EIA}>
              On AC, volts times amps is the apparent power S, in volt-amperes. The power factor gives the real power, and the reactive power Q
              is the third side of the right triangle the two form:
            </p>
            <p className={LOOK_FORMULA} data-src={EIA}>
              Apparent power: S = V × I, or √3 × V × I on three-phase
            </p>
            <p className={LOOK_FORMULA} data-src={EIA}>
              Real power: P = S × PF
            </p>
            <p className={LOOK_FORMULA} data-src={PFC}>
              Reactive power: Q = √(S² − P²)
            </p>
            <p className={P} data-src={DOE}>
              On three-phase, V is the voltage between two lines and I the current in one line, as in the U.S. Department of Energy&apos;s motor
              fact sheet, which divides the product by <Num v={1000} src={DOE} /> for kilowatts.{' '}
              <span data-src={MIT}>
                √3, about <Num v={SQRT3} src={CALC} format={SIG} />, is the ratio of the voltage between two lines to the voltage from a line to
                neutral.
              </span>
            </p>
          </section>

          <section aria-labelledby="examples" className="space-y-5">
            <h2 id="examples" className={H2}>
              Worked examples
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OHMS}>
                DC: <Val v={dc.voltage} unit="V" src={OHMS} /> across <Val v={dc.resistance} unit="Ω" src={OHMS} />
              </h3>
              <p className={P} data-src={OHMS}>
                I = V ÷ R = <Val v={dc.voltage} unit="V" src={OHMS} /> ÷ <Val v={dc.resistance} unit="Ω" src={OHMS} /> ={' '}
                <Val v={r4(dc.current)} unit="A" src={OHMS} />, and P = V × I = <Val v={r4(dc.power)} unit="W" src={OHMS} />. On DC the formula
                needs no power factor. The{' '}
                <Link href="/calculators/ohms-law-calculator" className={LINK}>
                  Ohm&apos;s law calculator
                </Link>{' '}
                solves any two of volts, amps, ohms and watts.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={CALC}>
                Single-phase: <Val v={ELEMENT_W} unit="W" src={CALC} /> on <Val v={element.volts} unit="V" src={VOLTS} />
              </h3>
              <p className={P} data-src={CALC}>
                A heating element at power factor <Num v={1} src={CALC} />: I = P ÷ (V × PF) = <Val v={ELEMENT_W} unit="W" src={CALC} /> ÷{' '}
                <Val v={element.volts} unit="V" src={VOLTS} /> = <Val v={element.amps} unit="A" src={CALC} />. The{' '}
                <Link href="/calculators/watts-to-amps-calculator" className={LINK}>
                  watts to amps calculator
                </Link>{' '}
                does the same for DC, single-phase and three-phase.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={CALC}>
                Three-phase: <Val v={MOTOR_KW} unit="kW" src={CALC} /> on <Val v={motor.volts} unit="V" src={VOLTS} /> at power factor{' '}
                <Num v={MOTOR_PF} src={CALC} />
              </h3>
              <p className={P} data-src={CALC}>
                I = P ÷ (√3 × V × PF) = <Val v={MOTOR_KW * 1000} unit="W" src={CALC} /> ÷ (√3 ×{' '}
                <Val v={motor.volts} unit="V" src={VOLTS} /> × <Num v={MOTOR_PF} src={CALC} />) ={' '}
                <Val v={r4(motor.amps)} unit="A" src={CALC} /> in each line. The{' '}
                <Link href="/calculators/kilowatts-to-amps-calculator" className={LINK}>
                  kilowatts to amps calculator
                </Link>{' '}
                works from kilowatts.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={CALC}>
                From current: <Val v={fromAmps.amps} unit="A" src={CALC} /> on <Val v={fromAmps.volts} unit="V" src={VOLTS} /> three-phase at power
                factor <Num v={FROM_PF} src={CALC} />
              </h3>
              <p className={P} data-src={CALC}>
                S = √3 × V × I = √3 × <Val v={fromAmps.volts} unit="V" src={VOLTS} /> × <Val v={fromAmps.amps} unit="A" src={CALC} /> ={' '}
                <Val v={r4(fromAmps.kva)} unit="kVA" src={CALC} />; P = S × PF = <Val v={FROM_AMPS_W} unit="W" src={CALC} />; Q = √(S² − P²) ={' '}
                <Val v={r4(FROM_KVAR)} unit="kVAR" src={CALC} />. These are the three sides of the triangle at the top. The{' '}
                <Link href="/calculators/amps-to-watts-calculator" className={LINK}>
                  amps to watts calculator
                </Link>{' '}
                gives them for any current.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={CALC}>
                From apparent power: <Val v={kva.kva} unit="kVA" src={CALC} /> on <Val v={kva.volts} unit="V" src={VOLTS} /> three-phase
              </h3>
              <p className={P} data-src={CALC}>
                I = S ÷ (√3 × V) = <Val v={kva.kva * 1000} unit="VA" src={CALC} /> ÷ (√3 × <Val v={kva.volts} unit="V" src={VOLTS} />) ={' '}
                <Val v={r4(kva.amps)} unit="A" src={CALC} />. Apparent power gives the current without a power factor; the real power needs one.
                The{' '}
                <Link href="/calculators/kva-to-amps-calculator" className={LINK}>
                  kVA to amps calculator
                </Link>{' '}
                takes it as an option.
              </p>
            </div>
          </section>

          <section aria-labelledby="three-powers" className="space-y-4">
            <h2 id="three-powers" className={H2}>
              Real, reactive and apparent power
            </h2>
            <p className={P} data-src={EIA}>
              The U.S. Energy Information Administration&apos;s glossary splits the power an AC load draws in two. <strong>Real power</strong>, in
              watts, does the work. <strong>Reactive power</strong>, in vars, does none, and motors and other magnetic equipment need it.{' '}
              <strong>Apparent power</strong>, volts times amperes, carries both, and the power factor is the share that is real, so it is at
              most <Num v={1} src={EIA} />.
            </p>
            <p className={P} data-src={PFC}>
              The U.S. Department of Energy&apos;s fact sheet on power factor draws the three as a right triangle, reactive power at{' '}
              <Num v={90} src={PFC} />° to real power, which is why S² = P² + Q². A lower power factor means more current for the same real
              power; the{' '}
              <Link href="/guides/power-factor-explained" className={LINK}>
                power factor guide
              </Link>{' '}
              shows how far, and how a capacitor bank brings it back.
            </p>
          </section>

          <section aria-labelledby="per-amp" className="space-y-5">
            <h2 id="per-amp" className={H2}>
              Watts per amp
            </h2>
            <p className={P} data-src={CALC}>
              One ampere carries more power at a higher voltage, and more again on three-phase: at power factor <Num v={1} src={CALC} />,{' '}
              <PerAmp r={W120} /> at <Val v={W120.volts} unit="V" src={VOLTS} /> and <PerAmp r={W240} /> at{' '}
              <Val v={W240.volts} unit="V" src={VOLTS} /> single-phase, <PerAmp r={W208} /> at <Val v={W208.volts} unit="V" src={VOLTS} /> and{' '}
              <PerAmp r={W480} /> at <Val v={W480.volts} unit="V" src={VOLTS} /> three-phase. Multiply by the power factor when it is below{' '}
              <Num v={1} src={CALC} />.
            </p>
            <p className={P} data-src={MIT}>
              MIT&apos;s notes on polyphase networks show why three-phase gives more: its power, three times the line-to-neutral voltage times
              the current, equals √3 times the voltage between lines times the current in one line.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    Watts per ampere of line current at power factor <Num v={1} src={CALC} />: P = V × I on single-phase, √3 × V × I on
                    three-phase.
                  </span>
                  <SourceLine domains={[SI, MIT, VOLTS]} />
                </>
              }
            >
              <WattsPerAmpBars />
            </Figure>
            <DataTable id="per-amp-table" variant="ruled" src={CALC} caption="Watts per amp and amps per kilowatt, single- and three-phase, at power factor 1">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    System
                  </th>
                  <th scope="col" className={RTH}>
                    Watts per amp
                  </th>
                  <th scope="col" className={RTH}>
                    Amps per kW
                  </th>
                </tr>
              </thead>
              <tbody>
                {WATTS_PER_AMP_ROWS.map((r) => (
                  <tr key={r.key}>
                    <th scope="row" className={RSTICKY_TD}>
                      <System r={r} />
                    </th>
                    <td className={RTD}>
                      <PerAmp r={r} />
                    </td>
                    <td className={RTD}>
                      <Val v={r4(r.ampsPerKw)} unit="A" src={CALC} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section aria-labelledby="other-voltage" className="space-y-4">
            <h2 id="other-voltage" className={H2}>
              A heater on another voltage
            </h2>
            <p className={P} data-src={OHMS}>
              A heater&apos;s rating holds at its rated voltage. Taken as a fixed resistance, the <Val v={ELEMENT_W} unit="W" src={CALC} />,{' '}
              <Val v={element.volts} unit="V" src={VOLTS} /> element above has R = V² ÷ P = <Val v={r4(elementOhms.resistance)} unit="Ω" src={OHMS} />
              . On <Val v={elementAt208.voltage} unit="V" src={VOLTS} /> that resistance draws I = V ÷ R ={' '}
              <Val v={r4(elementAt208.current)} unit="A" src={OHMS} /> and takes P = V × I = <Val v={r4(elementAt208.power)} unit="W" src={OHMS} />,
              about three quarters of its rating. The{' '}
              <Link href="/calculators/volts-to-amps-calculator" className={LINK}>
                volts to amps calculator
              </Link>{' '}
              draws the current of both kinds of load against voltage.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>How do you calculate electrical power?</h3>
              <p className={P} data-src={SI}>
                Multiply volts by amps: P = V × I gives watts on DC. <span data-src={EIA}>On AC, multiply by the power factor as well</span>
                <span data-src={DOE}>, and on three-phase by √3, with V the voltage between two lines.</span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How many watts is one amp?</h3>
              <p className={P} data-src={CALC}>
                It depends on the voltage. At power factor <Num v={1} src={CALC} />: <PerAmp r={W120} /> at{' '}
                <Val v={W120.volts} unit="V" src={VOLTS} /> and <PerAmp r={W240} /> at <Val v={W240.volts} unit="V" src={VOLTS} /> single-phase;{' '}
                <PerAmp r={W208} /> at <Val v={W208.volts} unit="V" src={VOLTS} /> and <PerAmp r={W480} /> at{' '}
                <Val v={W480.volts} unit="V" src={VOLTS} /> three-phase, for each ampere of line current.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What is the difference between kW and kVA?</h3>
              <p className={P} data-src={EIA}>
                kW is real power, the part that does work; kVA is apparent power, volts times amps. kW = kVA × power factor, so the two are equal
                only at power factor <Num v={1} src={EIA} />. <span data-src={CALC}>In the example above, <Val v={r4(fromAmps.kva)} unit="kVA" src={CALC} /> at
                power factor <Num v={FROM_PF} src={CALC} /> is <Val v={r4(FROM_KW)} unit="kW" src={CALC} />.</span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MIT}>
                Why is there √3 in three-phase formulas?
              </h3>
              <p className={P} data-src={MIT}>
                In a balanced three-phase system the voltage between two lines is √3 times the voltage from a line to neutral. The power, three
                times the line-to-neutral voltage times the current, is therefore √3 times the line-to-line voltage times the current.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How do you calculate amps from watts?</h3>
              <p className={P} data-src={EIA}>
                Divide by the voltage, and on AC by the power factor too: I = P ÷ V on DC, I = P ÷ (V × PF) on single-phase,{' '}
                <span data-src={DOE}>I = P ÷ (√3 × V × PF) on three-phase.</span> The{' '}
                <Link href="/calculators/watts-to-amps-calculator" className={LINK}>
                  watts to amps calculator
                </Link>{' '}
                does all three.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[SI, EIA, DOE, MIT, PFC, VOLTS]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#power-terms" className={LINK}>
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
