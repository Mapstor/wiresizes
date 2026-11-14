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
import { ENGINE_ID, SQRT3, TP_SIG, convertToAmps, isConvError } from '@/lib/calculations/power';
import type { ConvInput, ConvResult } from '@/lib/calculations/power';
import { articleDates } from '@/lib/page-dates';
import { assertNominal } from '@/lib/verified/us-nominal-voltages';

// /calculators/kilowatts-to-amps-calculator (WSZ-007b; spec: research/page-specs.md "WSZ-007"): the converter in the look
// (D-33, D-35), every number from the power engine's converter path (convertToAmps) or the registry, with its source in
// data-src. I = P ÷ (V × PF) single-phase (EIA Glossary: apparent power is volts times amperes, power factor is real over
// apparent power), I = P ÷ (√3 × V × PF) three-phase (DOE/GO-10097-517 Equation 1; MIT 6.061). Worked examples = golden
// "power" cases 7.2 kW at 240 V and 50 kW at 480 V three-phase, PF 0.9.
const ROUTE = '/calculators/kilowatts-to-amps-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'kW to Amps Calculator: Single-Phase and Three-Phase';
const DESCRIPTION =
  'Kilowatts to amps: I = kW × 1,000 ÷ (V × PF), or ÷ (√3 × V × PF) on three-phase. 7.2 kW at 240 V is 30 A. With a table of amps per kW.';

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
const PFC = 'doe-power-factor-cost';
const VOLTS = 'us-nominal-voltages';
const CALC = `calc:${ENGINE_ID}`;
const SIG = { sig: TP_SIG };

assertNominal([...SINGLE_PHASE_VOLTS, ...THREE_PHASE_VOLTS], 'kilowatts to amps quick voltages');

function solved(input: ConvInput): ConvResult {
  const r = convertToAmps(input);
  if (isConvError(r)) throw new Error('kilowatts to amps page: a worked example failed');
  return r;
}
// the golden worked examples (research/golden-cases.json, group power)
const EX_1 = solved({ phases: 1, volts: 240, known: 'kw-pf', kw: 7.2, pf: 1 });
const EX_3 = solved({ phases: 3, volts: 480, known: 'kw-pf', kw: 50, pf: 0.9 });
const EX_3_PF1 = solved({ phases: 3, volts: 480, known: 'kw-pf', kw: 50, pf: 1 });
const ONE_KW_120 = solved({ phases: 1, volts: 120, known: 'kw-pf', kw: 1, pf: 1 });
const ONE_KW_240 = solved({ phases: 1, volts: 240, known: 'kw-pf', kw: 1, pf: 1 });

/** Amps per kW: one kW at each voltage and power factor. */
const TABLE_PFS = [1, 0.95, 0.9, 0.85, 0.8];
const perKw = (phases: 1 | 3, volts: number, pf: number) => solved({ phases, volts, known: 'kw-pf', kw: 1, pf }).amps;
const TABLE_ROWS = [
  ...SINGLE_PHASE_VOLTS.map((volts) => ({ phases: 1 as const, volts })),
  ...THREE_PHASE_VOLTS.map((volts) => ({ phases: 3 as const, volts })),
];

const TOC: ([string, string] | [string, string, string])[] = [
  ['examples', 'Worked examples', CALC],
  ['formula', 'The formula'],
  ['power-factor', 'Why the power factor matters'],
  ['per-kw', 'Amps per kW', CALC],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Kilowatts to Amps Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Kilowatts to Amps Calculator', url: URL, description: DESCRIPTION };

export default function KilowattsToAmpsPage() {
  const amps = (r: ConvResult) => <Val v={r.amps} unit="A" src={CALC} format={SIG} />;
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Kilowatts to Amps Calculator" sub="kW to A, Single and Three Phase" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            Enter the power in kilowatts, the voltage and the power factor to get the current, on a single-phase or a three-phase circuit.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <PowerConverterTool mode="kw" />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={EIA}>
            <strong>Amps equal kilowatts times 1,000, divided by the voltage times the power factor; on three-phase, divide by √3 as well.</strong>{' '}
            <span data-src={CALC}>
              <Val v={EX_1.kw ?? 0} unit="kW" src={CALC} /> at <Val v={EX_1.volts} unit="V" src={VOLTS} /> single-phase is {amps(EX_1)}; one
              kilowatt draws <Val v={ONE_KW_120.amps} unit="A" src={CALC} format={SIG} /> at <Val v={ONE_KW_120.volts} unit="V" src={VOLTS} />{' '}
              and <Val v={ONE_KW_240.amps} unit="A" src={CALC} format={SIG} /> at <Val v={ONE_KW_240.volts} unit="V" src={VOLTS} /> at power
              factor <Num v={1} src={CALC} />.
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="examples" className="space-y-4">
            <h2 id="examples" className={H2} data-src={CALC}>
              Worked examples
            </h2>
            <h3 className={H3} data-src={CALC}>
              <Val v={EX_1.kw ?? 0} unit="kW" src={CALC} /> at <Val v={EX_1.volts} unit="V" src={VOLTS} />, single-phase
            </h3>
            <p className={P} data-src={CALC}>
              At power factor <Num v={1} src={CALC} />: I = <Val v={(EX_1.kw ?? 0) * 1000} unit="W" src={CALC} /> ÷ (
              <Val v={EX_1.volts} unit="V" src={VOLTS} /> × <Num v={1} src={CALC} />) = {amps(EX_1)}.
            </p>
            <h3 className={H3} data-src={CALC}>
              <Val v={EX_3.kw ?? 0} unit="kW" src={CALC} /> at <Val v={EX_3.volts} unit="V" src={VOLTS} />, three-phase
            </h3>
            <p className={P} data-src={CALC}>
              At power factor <Num v={EX_3.pf ?? 0} src={CALC} />: I = <Val v={(EX_3.kw ?? 0) * 1000} unit="W" src={CALC} /> ÷ (√3 ×{' '}
              <Val v={EX_3.volts} unit="V" src={VOLTS} /> × <Num v={EX_3.pf ?? 0} src={CALC} />) = {amps(EX_3)} in each line. At power
              factor <Num v={1} src={CALC} /> the same load would draw {amps(EX_3_PF1)}. The{' '}
              <Link href="/calculators/three-phase-calculator" className={LINK}>
                three-phase calculator
              </Link>{' '}
              also gives the reactive power and the capacitor that raises the power factor.
            </p>
          </section>

          <section aria-labelledby="formula" className="space-y-4">
            <h2 id="formula" className={H2}>
              The formula
            </h2>
            <p className={LOOK_FORMULA} data-src={EIA}>
              Single-phase: I = kW × 1,000 ÷ (V × PF)
            </p>
            <p className={LOOK_FORMULA} data-src={DOE}>
              Three-phase: I = kW × 1,000 ÷ (√3 × V × PF)
            </p>
            <p className={P} data-src={EIA}>
              The U.S. Energy Information Administration&apos;s glossary defines apparent power as volts times amperes and the power factor as
              real power divided by apparent power, so the current is the real power divided by the voltage and the power factor. The kW
              is multiplied by <Num v={1000} src={CALC} /> to put it in watts.
            </p>
            <p className={P} data-src={MIT}>
              <span data-src={DOE}>
                On three-phase, V is the voltage between two lines and I the current in one line; the U.S. Department of Energy&apos;s
                motor fact sheet uses the same formula.
              </span>{' '}
              √3, about <Num v={SQRT3} src={CALC} format={SIG} />, is the ratio of the line-to-line to the line-to-neutral voltage, as
              MIT&apos;s notes on three-phase power show. The{' '}
              <Link href="/guides/single-vs-three-phase" className={LINK}>
                single vs three phase guide
              </Link>{' '}
              compares the two.
            </p>
          </section>

          <section aria-labelledby="power-factor" className="space-y-4">
            <h2 id="power-factor" className={H2}>
              Why the power factor matters
            </h2>
            <p className={P} data-src={PFC}>
              The current follows the apparent power, the real power divided by the power factor. A motor or another inductive load with a
              low power factor draws more current for the same kilowatts, which the U.S. Department of Energy&apos;s fact sheet on power
              factor says reduces a system&apos;s capacity and causes voltage drops.
            </p>
            <p className={P} data-src={CALC}>
              <Val v={EX_3.kw ?? 0} unit="kW" src={CALC} /> at <Val v={EX_3.volts} unit="V" src={VOLTS} /> draws {amps(EX_3_PF1)} at power
              factor <Num v={1} src={CALC} /> and {amps(EX_3)} at <Num v={EX_3.pf ?? 0} src={CALC} />. Use the power factor from the
              nameplate or a meter; the{' '}
              <Link href="/guides/power-factor-explained" className={LINK}>
                power factor guide
              </Link>{' '}
              explains it.
            </p>
          </section>

          <section aria-labelledby="per-kw" className="space-y-5">
            <h2 id="per-kw" className={H2} data-src={CALC}>
              Amps per kW
            </h2>
            <p className={P} data-src={CALC}>
              The current one kilowatt draws at each voltage. Multiply by the load&apos;s kilowatts:{' '}
              <Val v={EX_3.kw ?? 0} unit="kW" src={CALC} /> × <Num v={perKw(3, EX_3.volts, EX_3.pf ?? 1)} src={CALC} format={SIG} /> ={' '}
              {amps(EX_3)} at <Val v={EX_3.volts} unit="V" src={VOLTS} /> three-phase, power factor <Num v={EX_3.pf ?? 0} src={CALC} />.
            </p>
            <DataTable id="per-kw-table" variant="ruled" src={CALC} caption="Amps per kW, by voltage and power factor">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Voltage
                  </th>
                  {TABLE_PFS.map((pf) => (
                    <th key={pf} scope="col" className={RTH}>
                      PF <Num v={pf} src={CALC} format={{ fixed: 2 }} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row) => (
                  <tr key={`${row.phases}-${row.volts}`}>
                    <th scope="row" className={RSTICKY_TD}>
                      <Val v={row.volts} unit="V" src={VOLTS} /> {row.phases === 1 ? 'single' : 'three'}
                    </th>
                    {TABLE_PFS.map((pf) => (
                      <td key={pf} className={RTD}>
                        <Num v={perKw(row.phases, row.volts, pf)} src={CALC} format={SIG} />
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
              <h3 className={H3}>How many amps is 1 kW?</h3>
              <p className={P} data-src={CALC}>
                At power factor <Num v={1} src={CALC} />, single-phase: <Val v={ONE_KW_120.amps} unit="A" src={CALC} format={SIG} /> at{' '}
                <Val v={ONE_KW_120.volts} unit="V" src={VOLTS} /> and <Val v={ONE_KW_240.amps} unit="A" src={CALC} format={SIG} /> at{' '}
                <Val v={ONE_KW_240.volts} unit="V" src={VOLTS} />. The table above gives the other voltages and power factors.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How do you convert kW to amps on three-phase?</h3>
              <p className={P} data-src={DOE}>
                Divide the watts by √3 times the line-to-line voltage times the power factor:{' '}
                <span data-src={CALC}>
                  <Val v={(EX_3.kw ?? 0) * 1000} unit="W" src={CALC} /> ÷ (√3 × <Val v={EX_3.volts} unit="V" src={VOLTS} /> ×{' '}
                  <Num v={EX_3.pf ?? 0} src={CALC} />) = {amps(EX_3)}
                </span>
                , the current in each line.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Is kW the same as kVA?</h3>
              <p className={P} data-src={EIA}>
                No. kW is real power, the part that does work; kVA is apparent power, volts times amps. kVA = kW ÷ PF, so they are equal only
                at power factor <Num v={1} src={CALC} />. The{' '}
                <Link href="/calculators/kva-to-amps-calculator" className={LINK}>
                  kVA to amps calculator
                </Link>{' '}
                starts from kVA.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What power factor should I enter?</h3>
              <p className={P} data-src={DOE}>
                The load&apos;s own: a motor&apos;s nameplate data can list its full-load power factor, and a meter can measure it. With{' '}
                <Num v={1} src={CALC} /> the calculator gives the least current the load could draw.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[EIA, DOE, MIT, PFC, VOLTS]}
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
