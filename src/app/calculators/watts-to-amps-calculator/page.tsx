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
import { PowerConverterTool } from '@/components/calculators/PowerConverterTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
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
import { ENGINE_ID, TP_SIG, convertToAmps, isConvError } from '@/lib/calculations/power';
import type { ConvInput, ConvResult } from '@/lib/calculations/power';
import { articleDates } from '@/lib/page-dates';
import { assertNominal } from '@/lib/verified/us-nominal-voltages';

// /calculators/watts-to-amps-calculator (WSZ-007c; spec: research/page-specs.md "WSZ-007"): the converter in the look
// (D-33, D-35), every number from the power engine's converter path (convertToAmps) or the registry, with its source in
// data-src. I = P ÷ V on DC (NIST SP 330: the volt is a watt per ampere), I = P ÷ (V × PF) single-phase (EIA Glossary),
// I = P ÷ (√3 × V × PF) three-phase (DOE/GO-10097-517). Worked example = golden "power" case 4500 W at 240 V, with the
// makers' note that the two elements of a water heater heat one at a time (mfr-water-heaters).
const ROUTE = '/calculators/watts-to-amps-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Watts to Amps Calculator: DC, Single and Three Phase';
const DESCRIPTION =
  'Watts to amps: I = P ÷ V on DC, P ÷ (V × PF) single-phase, P ÷ (√3 × V × PF) three-phase. A 4,500 W water heater element at 240 V draws 18.75 A.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const SI = 'nist-sp330-si-units';
const EIA = 'eia-power-glossary';
const DOE = 'doe-motor-load-efficiency';
const MIT = 'mit-polyphase-networks';
const WH = 'mfr-water-heaters';
const PFC = 'doe-power-factor-cost';
const VOLTS = 'us-nominal-voltages';
const CALC = `calc:${ENGINE_ID}`;
const SIG = { sig: TP_SIG };

assertNominal([...SINGLE_PHASE_VOLTS, ...THREE_PHASE_VOLTS], 'watts to amps quick voltages');

function solved(input: ConvInput): ConvResult {
  const r = convertToAmps(input);
  if (isConvError(r)) throw new Error('watts to amps page: a worked example failed');
  return r;
}
const W = (watts: number, volts: number, phases: 1 | 3 = 1, pf = 1) => solved({ phases, volts, known: 'kw-pf', kw: watts / 1000, pf });
// golden case "4500 W at 240 V" (power): one water heater element
const HEATER = W(4500, 240);
const BOTH = W(9000, 240);
const Q_1500 = W(1500, 120);

/** Amps by watts at the single-phase voltages, power factor 1. */
const TABLE_WATTS = [100, 250, 500, 750, 1000, 1500, 1800, 2000, 2400, 3000, 3600, 4500, 5000, 6000, 7200, 9600, 10000];
const TABLE_VOLTS = [120, 208, 240, 277];
assertNominal(TABLE_VOLTS, 'watts to amps table voltages');

const TOC: ([string, string] | [string, string, string])[] = [
  ['heater', 'A water heater, worked out', CALC],
  ['formulas', 'The formulas'],
  ['table', 'Amps by watts', CALC],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Watts to Amps Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Watts to Amps Calculator', url: URL, description: DESCRIPTION };

export default function WattsToAmpsPage() {
  const A = (r: ConvResult) => <Val v={r.amps} unit="A" src={CALC} format={SIG} />;
  const V = (v: number) => <Val v={v} unit="V" src={VOLTS} />;
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Watts to Amps Calculator" sub="DC, Single and Three Phase" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            Enter the power in watts and the voltage to get the current of a DC, single-phase or three-phase load.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <PowerConverterTool mode="watts" />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={SI}>
            <strong>Amps equal watts divided by volts; on AC, divide by the power factor too, and by √3 on three-phase.</strong>{' '}
            <span data-src={CALC}>
              A <Val v={4500} unit="W" src={CALC} /> water heater element at {V(HEATER.volts)} draws {A(HEATER)}.
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="heater" className="space-y-4">
            <h2 id="heater" className={H2} data-src={CALC}>
              A water heater, worked out
            </h2>
            <p className={P} data-src={CALC}>
              One <Val v={4500} unit="W" src={CALC} /> element at {V(HEATER.volts)}, at power factor <Num v={1} src={CALC} />: I ={' '}
              <Val v={4500} unit="W" src={CALC} /> ÷ {V(HEATER.volts)} = {A(HEATER)}.
            </p>
            <p className={P} data-src={WH}>
              Rheem&apos;s and A.O. Smith&apos;s documents for their <Val v={240} unit="V" src={WH} /> water heaters with two{' '}
              <Val v={4500} unit="W" src={WH} /> elements wire them so only one heats at a time, so such a heater draws {A(HEATER)}, not the{' '}
              <span data-src={CALC}>{A(BOTH)}</span> both would draw together.
            </p>
          </section>

          <section aria-labelledby="formulas" className="space-y-4">
            <h2 id="formulas" className={H2}>
              The formulas
            </h2>
            <p className={LOOK_FORMULA} data-src={SI}>
              DC: I = P ÷ V
            </p>
            <p className={LOOK_FORMULA} data-src={EIA}>
              Single-phase: I = P ÷ (V × PF)
            </p>
            <p className={LOOK_FORMULA} data-src={DOE}>
              Three-phase: I = P ÷ (√3 × V × PF)
            </p>
            <p className={P} data-src={SI}>
              NIST&apos;s guide to the SI defines the volt as a watt per ampere, so on DC the current is the power divided by the voltage. On
              AC, the U.S. Energy Information Administration&apos;s glossary defines the power factor as real power divided by apparent power,
              volts times amps, so the current is the watts divided by the volts and the power factor.
            </p>
            <p className={P} data-src={MIT}>
              On three-phase, V is the voltage between two lines and I the current in each line; the{' '}
              <Link href="/calculators/three-phase-calculator" className={LINK}>
                three-phase calculator
              </Link>{' '}
              works from any two of power, apparent power, current and power factor. The{' '}
              <Link href="/guides/power-factor-explained" className={LINK}>
                power factor guide
              </Link>{' '}
              shows how a low one raises the current.
            </p>
          </section>

          <section aria-labelledby="table" className="space-y-5">
            <h2 id="table" className={H2} data-src={CALC}>
              Amps by watts
            </h2>
            <p className={P} data-src={CALC}>
              The current of a single-phase load at power factor <Num v={1} src={CALC} />, such as a heater, at four voltages.
            </p>
            <DataTable id="watts-table" variant="ruled" src={CALC} caption="Amps by watts, single-phase, power factor 1">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Watts
                  </th>
                  {TABLE_VOLTS.map((v) => (
                    <th key={v} scope="col" className={RTH}>
                      {V(v)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_WATTS.map((w) => (
                  <tr key={w}>
                    <th scope="row" className={RSTICKY_TD}>
                      <Val v={w} unit="W" src={CALC} />
                    </th>
                    {TABLE_VOLTS.map((v) => (
                      <td key={v} className={RTD}>
                        <Val v={W(w, v).amps} unit="A" src={CALC} format={SIG} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>
                How many amps is <Val v={1500} unit="W" src={CALC} />?
              </h3>
              <p className={P} data-src={CALC}>
                {A(Q_1500)} at {V(Q_1500.volts)} and power factor <Num v={1} src={CALC} />; at {V(240)}, half as much.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How do you convert watts to amps on DC?</h3>
              <p className={P} data-src={SI}>
                Divide the watts by the volts: there is no power factor on DC. Choose DC in the calculator.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Why does a motor draw more amps than its watts suggest?</h3>
              <p className={P} data-src={PFC}>
                Motors are inductive loads, which the DOE power factor sheet names as the cause of a low power factor: they draw more apparent
                power than real power.{' '}
                <span data-src={DOE}>
                  Use the power factor from the nameplate data or a meter; the DOE motor fact sheet lists the full-load power factor among the
                  nameplate values.
                </span>{' '}
                For a motor rated in horsepower, the{' '}
                <Link href="/calculators/horsepower-to-amps-calculator" className={LINK}>
                  horsepower to amps calculator
                </Link>{' '}
                reads its full-load current from the NEC tables.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>And the reverse?</h3>
              <p className={P}>
                The{' '}
                <Link href="/calculators/amps-to-watts-calculator" className={LINK}>
                  amps to watts calculator
                </Link>{' '}
                gives the power from the current, and the{' '}
                <Link href="/calculators/wire-size-calculator" className={LINK}>
                  wire size calculator
                </Link>{' '}
                the conductor for it.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[SI, EIA, DOE, MIT, PFC, WH, VOLTS]}
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
