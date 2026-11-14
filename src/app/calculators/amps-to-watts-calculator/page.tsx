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
import { ENGINE_ID, convertFromAmps, isConvError } from '@/lib/calculations/power';
import type { ConvResult, FromAmpsInput } from '@/lib/calculations/power';
import { articleDates } from '@/lib/page-dates';
import { assertNominal } from '@/lib/verified/us-nominal-voltages';

// /calculators/amps-to-watts-calculator (WSZ-007c; spec: research/page-specs.md "WSZ-007"): the converter in the look
// (D-33, D-35), every number from the power engine's converter path (convertFromAmps) or the registry, with its source in
// data-src. P = V × I on DC (NIST SP 330), P = V × I × PF single-phase (EIA Glossary), P = √3 × V × I × PF three-phase
// (DOE/GO-10097-517). Worked example = golden "power" case 50 A at 480 V three-phase, PF 0.92: 38,243.7 W.
const ROUTE = '/calculators/amps-to-watts-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Amps to Watts Calculator: DC, Single and Three Phase';
const DESCRIPTION =
  'Amps to watts: P = V × I on DC, V × I × PF single-phase, √3 × V × I × PF three-phase. 50 A at 480 V three-phase, PF 0.92, is 38,243.7 W.';

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
const VOLTS = 'us-nominal-voltages';
const CALC = `calc:${ENGINE_ID}`;
const W6 = (w: number) => Number(w.toPrecision(6));

assertNominal([...SINGLE_PHASE_VOLTS, ...THREE_PHASE_VOLTS], 'amps to watts quick voltages');

function solved(input: FromAmpsInput): ConvResult {
  const r = convertFromAmps(input);
  if (isConvError(r) || r.kw === null) throw new Error('amps to watts page: a worked example failed');
  return r;
}
const watts = (r: ConvResult) => W6((r.kw ?? 0) * 1000);
// golden case "50 A three-phase 480 V PF 0.92 to watts" (power), the same load at PF 1, and the searched circuits
const EX_3 = solved({ phases: 3, volts: 480, amps: 50, pf: 0.92 });
const EX_3_PF1 = solved({ phases: 3, volts: 480, amps: 50, pf: 1 });
const Q_15 = solved({ phases: 1, volts: 120, amps: 15, pf: 1 });
const Q_20 = solved({ phases: 1, volts: 240, amps: 20, pf: 1 });

/** Watts by amps at power factor 1: single-phase at three voltages, three-phase at two. */
const TABLE_AMPS = [1, 5, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100];
const TABLE_COLS = [
  { key: '120-1', phases: 1 as const, volts: 120 },
  { key: '240-1', phases: 1 as const, volts: 240 },
  { key: '208-3', phases: 3 as const, volts: 208 },
  { key: '480-3', phases: 3 as const, volts: 480 },
];
assertNominal(TABLE_COLS.map((c) => c.volts), 'amps to watts table voltages');

const TOC: ([string, string] | [string, string, string])[] = [
  ['example', 'Worked example', CALC],
  ['formulas', 'The formulas'],
  ['table', 'Watts by amps', CALC],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Amps to Watts Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Amps to Watts Calculator', url: URL, description: DESCRIPTION };

export default function AmpsToWattsPage() {
  const Wt = (r: ConvResult) => <Val v={watts(r)} unit="W" src={CALC} />;
  const V = (v: number) => <Val v={v} unit="V" src={VOLTS} />;
  const I = (a: number) => <Val v={a} unit="A" src={CALC} />;
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Amps to Watts Calculator" sub="DC, Single and Three Phase" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            Enter the current and the voltage, and on AC the power factor, to get the power in watts.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <PowerConverterTool mode="amps" />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={SI}>
            <strong>Watts equal volts times amps; on AC, times the power factor too, and times √3 on three-phase.</strong>{' '}
            <span data-src={CALC}>
              {I(EX_3.amps)} at {V(EX_3.volts)} three-phase and power factor <Num v={EX_3.pf ?? 0} src={CALC} /> is {Wt(EX_3)}.
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="example" className="space-y-4">
            <h2 id="example" className={H2} data-src={CALC}>
              Worked example
            </h2>
            <p className={P} data-src={CALC}>
              {I(EX_3.amps)} in each line at {V(EX_3.volts)} three-phase, power factor <Num v={EX_3.pf ?? 0} src={CALC} />: P = √3 ×{' '}
              {V(EX_3.volts)} × {I(EX_3.amps)} × <Num v={EX_3.pf ?? 0} src={CALC} /> = {Wt(EX_3)}. At power factor{' '}
              <Num v={1} src={CALC} /> the same current would carry {Wt(EX_3_PF1)}: the apparent power, √3 × V × I.
            </p>
          </section>

          <section aria-labelledby="formulas" className="space-y-4">
            <h2 id="formulas" className={H2}>
              The formulas
            </h2>
            <p className={LOOK_FORMULA} data-src={SI}>
              DC: P = V × I
            </p>
            <p className={LOOK_FORMULA} data-src={EIA}>
              Single-phase: P = V × I × PF
            </p>
            <p className={LOOK_FORMULA} data-src={DOE}>
              Three-phase: P = √3 × V × I × PF
            </p>
            <p className={P} data-src={SI}>
              NIST&apos;s guide to the SI defines the volt as a watt per ampere, so on DC a volt times an ampere is a watt. On AC, volts times
              amps is the apparent power, and the U.S. Energy Information Administration&apos;s glossary defines the power factor as the share
              of it that is real power, so the watts are volts times amps times the power factor.
            </p>
            <p className={P} data-src={DOE}>
              On three-phase, V is the voltage between two lines and I the current in each line, as in the U.S. Department of Energy&apos;s motor
              fact sheet; <span data-src={MIT}>√3 is the ratio of the line-to-line to the line-to-neutral voltage.</span> The{' '}
              <Link href="/calculators/three-phase-calculator" className={LINK}>
                three-phase calculator
              </Link>{' '}
              also gives the reactive power.
            </p>
          </section>

          <section aria-labelledby="table" className="space-y-5">
            <h2 id="table" className={H2} data-src={CALC}>
              Watts by amps
            </h2>
            <p className={P} data-src={CALC}>
              The power at power factor <Num v={1} src={CALC} />; for a lower power factor, multiply by it.
            </p>
            <DataTable id="amps-table" variant="ruled" src={CALC} caption="Watts by amps, power factor 1">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Amps
                  </th>
                  {TABLE_COLS.map((c) => (
                    <th key={c.key} scope="col" className={RTH}>
                      {V(c.volts)} {c.phases === 1 ? 'single' : 'three'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_AMPS.map((a) => (
                  <tr key={a}>
                    <th scope="row" className={RSTICKY_TD}>
                      {I(a)}
                    </th>
                    {TABLE_COLS.map((c) => (
                      <td key={c.key} className={RTD}>
                        {Wt(solved({ phases: c.phases, volts: c.volts, amps: a, pf: 1 }))}
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
                How many watts is {I(Q_15.amps)} at {V(Q_15.volts)}?
              </h3>
              <p className={P} data-src={CALC}>
                {Wt(Q_15)} at power factor <Num v={1} src={CALC} />: {V(Q_15.volts)} × {I(Q_15.amps)}.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                How many watts is {I(Q_20.amps)} at {V(Q_20.volts)}?
              </h3>
              <p className={P} data-src={CALC}>
                {Wt(Q_20)} at power factor <Num v={1} src={CALC} />, single-phase.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Why is the power lower with a power factor?</h3>
              <p className={P} data-src={EIA}>
                Volts times amps is the apparent power; the power factor is the share of it that does work. The{' '}
                <Link href="/guides/power-factor-explained" className={LINK}>
                  power factor guide
                </Link>{' '}
                explains it.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>And the reverse?</h3>
              <p className={P}>
                The{' '}
                <Link href="/calculators/watts-to-amps-calculator" className={LINK}>
                  watts to amps calculator
                </Link>{' '}
                gives the current from the power.
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
