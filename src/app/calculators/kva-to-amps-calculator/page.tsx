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
import { ENGINE_ID, SQRT3, TP_SIG, ampsOf, convertToAmps, isConvError } from '@/lib/calculations/power';
import type { ConvInput, ConvResult } from '@/lib/calculations/power';
import { articleDates } from '@/lib/page-dates';
import { assertNominal } from '@/lib/verified/us-nominal-voltages';

// /calculators/kva-to-amps-calculator (WSZ-007b; spec: research/page-specs.md "WSZ-007"): the converter in the look (D-33,
// D-35), every number from the power engine's converter path (convertToAmps, ampsOf) or the registry, with its source in
// data-src. I = S ÷ V single-phase (EIA Glossary: apparent power is volts times amperes), I = S ÷ (√3 × V) three-phase
// (MIT 6.061 eq. 56); P = S × PF. Worked examples = golden "power" cases 75 kVA at 208 V and 480 V three-phase and
// 25 kVA at 240 V single-phase; the questions answer the searched 750 and 125 kVA.
const ROUTE = '/calculators/kva-to-amps-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'kVA to Amps Calculator: Single-Phase and Three-Phase';
const DESCRIPTION =
  'kVA to amps: I = kVA × 1,000 ÷ V single-phase, ÷ (√3 × V) three-phase. 75 kVA at 480 V is 90.21 A. With a table of amps by kVA and voltage.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const EIA = 'eia-power-glossary';
const MIT = 'mit-polyphase-networks';
const PFC = 'doe-power-factor-cost';
const VOLTS = 'us-nominal-voltages';
const CALC = `calc:${ENGINE_ID}`;
const SIG = { sig: TP_SIG };

assertNominal([...SINGLE_PHASE_VOLTS, ...THREE_PHASE_VOLTS], 'kVA to amps quick voltages');

function solved(input: ConvInput): ConvResult {
  const r = convertToAmps(input);
  if (isConvError(r)) throw new Error('kVA to amps page: a worked example failed');
  return r;
}
// the golden worked examples (research/golden-cases.json, group power)
const EX_208 = solved({ phases: 3, volts: 208, known: 'kva', kva: 75 });
const EX_480 = solved({ phases: 3, volts: 480, known: 'kva', kva: 75 });
const EX_240 = solved({ phases: 1, volts: 240, known: 'kva', kva: 25 });
const EX_PF = solved({ phases: 3, volts: 480, known: 'kva', kva: 75, pf: 0.8 });
// the searched ratings
const Q_750 = solved({ phases: 3, volts: 480, known: 'kva', kva: 750 });
const Q_125_208 = solved({ phases: 3, volts: 208, known: 'kva', kva: 125 });
const Q_125_480 = solved({ phases: 3, volts: 480, known: 'kva', kva: 125 });

/** Amps by kVA: the columns are the circuits a kVA rating is most often read at. */
const TABLE_KVA = [5, 10, 15, 25, 30, 37.5, 45, 50, 75, 100, 112.5, 125, 150, 200, 225, 300, 500, 750, 1000, 1500, 2000, 2500];
const TABLE_COLS = [
  { key: '240-1', phases: 1 as const, volts: 240 },
  { key: '208-3', phases: 3 as const, volts: 208 },
  { key: '240-3', phases: 3 as const, volts: 240 },
  { key: '480-3', phases: 3 as const, volts: 480 },
  { key: '600-3', phases: 3 as const, volts: 600 },
];
assertNominal(TABLE_COLS.map((c) => c.volts), 'kVA to amps table voltages');

const TOC: ([string, string] | [string, string, string])[] = [
  ['examples', 'Worked examples', CALC],
  ['formula', 'The formula'],
  ['kva-kw', 'kVA, kW and the power factor'],
  ['table', 'Amps by kVA', CALC],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'kVA to Amps Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'kVA to Amps Calculator', url: URL, description: DESCRIPTION };

export default function KvaToAmpsPage() {
  const amps = (r: ConvResult) => <Val v={r.amps} unit="A" src={CALC} format={SIG} />;
  const kva = (r: ConvResult) => <Val v={r.kva} unit="kVA" src={CALC} />;
  const v = (r: ConvResult) => <Val v={r.volts} unit="V" src={VOLTS} />;
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="kVA to Amps Calculator" sub="Single-Phase and Three-Phase" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            Enter the apparent power in kVA and the voltage to get the current, for a transformer, a generator or any load on a single-phase
            or three-phase circuit.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <PowerConverterTool mode="kva" />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={EIA}>
            <strong>Amps equal kVA times 1,000 divided by the voltage, and by √3 as well on three-phase.</strong>{' '}
            <span data-src={CALC}>
              {kva(EX_480)} at {v(EX_480)} three-phase is {amps(EX_480)} in each line; at {v(EX_208)} it is {amps(EX_208)}.
            </span>{' '}
            The power factor doesn&apos;t enter: kVA is already volts times amps.
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="examples" className="space-y-4">
            <h2 id="examples" className={H2} data-src={CALC}>
              Worked examples
            </h2>
            <ul className="max-w-[35rem] list-disc space-y-2 pl-6 text-[17px] leading-[1.65] text-ink marker:text-cut-line" data-src={CALC}>
              <li>
                {kva(EX_208)} at {v(EX_208)} three-phase: I = <Val v={EX_208.kva * 1000} unit="VA" src={CALC} /> ÷ (√3 × {v(EX_208)}) ={' '}
                {amps(EX_208)}.
              </li>
              <li>
                {kva(EX_480)} at {v(EX_480)} three-phase: I = <Val v={EX_480.kva * 1000} unit="VA" src={CALC} /> ÷ (√3 × {v(EX_480)}) ={' '}
                {amps(EX_480)}.
              </li>
              <li>
                {kva(EX_240)} at {v(EX_240)} single-phase: I = <Val v={EX_240.kva * 1000} unit="VA" src={CALC} /> ÷ {v(EX_240)} ={' '}
                {amps(EX_240)}.
              </li>
            </ul>
            <p className={P} data-src={CALC}>
              The same {kva(EX_208)} draws {amps(EX_208)} at {v(EX_208)} but {amps(EX_480)} at {v(EX_480)}: the current falls in proportion
              as the voltage rises.
            </p>
          </section>

          <section aria-labelledby="formula" className="space-y-4">
            <h2 id="formula" className={H2}>
              The formula
            </h2>
            <p className={LOOK_FORMULA} data-src={EIA}>
              Single-phase: I = kVA × 1,000 ÷ V
            </p>
            <p className={LOOK_FORMULA} data-src={MIT}>
              Three-phase: I = kVA × 1,000 ÷ (√3 × V)
            </p>
            <p className={P} data-src={EIA}>
              The U.S. Energy Information Administration&apos;s glossary defines apparent power as volts times amperes, so dividing the
              volt-amperes by the voltage gives the current. The kVA is multiplied by <Num v={1000} src={CALC} /> to put it in volt-amperes.
            </p>
            <p className={P} data-src={MIT}>
              On three-phase the apparent power is √3 times the line-to-line voltage times the line current (MIT&apos;s notes on three-phase
              power), so V is the voltage between two lines and I the current in each line. √3 is about{' '}
              <Num v={SQRT3} src={CALC} format={SIG} />.
            </p>
          </section>

          <section aria-labelledby="kva-kw" className="space-y-4">
            <h2 id="kva-kw" className={H2}>
              kVA, kW and the power factor
            </h2>
            <p className={P} data-src={EIA}>
              kVA is apparent power; kW is real power, the part that does work; the power factor is real power divided by apparent power. A
              kVA rating sets the current whatever the power factor, while the real power depends on it.
            </p>
            <p className={P} data-src={CALC}>
              {kva(EX_PF)} at power factor <Num v={EX_PF.pf ?? 0} src={CALC} /> is <Val v={EX_PF.kw ?? 0} unit="kW" src={CALC} /> of real power,
              and the current is still {amps(EX_PF)} at {v(EX_PF)}. Enter a power factor in the calculator to get the real and reactive power;
              the{' '}
              <Link href="/calculators/kilowatts-to-amps-calculator" className={LINK}>
                kilowatts to amps calculator
              </Link>{' '}
              starts from kW, and the{' '}
              <Link href="/guides/power-factor-explained" className={LINK}>
                power factor guide
              </Link>{' '}
              explains the difference.
            </p>
          </section>

          <section aria-labelledby="table" className="space-y-5">
            <h2 id="table" className={H2} data-src={CALC}>
              Amps by kVA
            </h2>
            <p className={P} data-src={CALC}>
              The current at the rated kVA, in amperes, for single-phase at <Val v={240} unit="V" src={VOLTS} /> and three-phase at four
              line-to-line voltages.
            </p>
            <DataTable id="kva-table" variant="ruled" src={CALC} caption="Amps by kVA and voltage">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    kVA
                  </th>
                  {TABLE_COLS.map((c) => (
                    <th key={c.key} scope="col" className={RTH}>
                      <Val v={c.volts} unit="V" src={VOLTS} /> {c.phases === 1 ? 'single' : 'three'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_KVA.map((s) => (
                  <tr key={s}>
                    <th scope="row" className={RSTICKY_TD}>
                      <Num v={s} src={CALC} />
                    </th>
                    {TABLE_COLS.map((c) => (
                      <td key={c.key} className={RTD}>
                        <Val v={ampsOf(s, c.volts, c.phases)} unit="A" src={CALC} format={SIG} />
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
                How many amps is <Val v={Q_750.kva} unit="kVA" src={CALC} />?
              </h3>
              <p className={P} data-src={CALC}>
                {amps(Q_750)} in each line at {v(Q_750)} three-phase: <Val v={Q_750.kva * 1000} unit="VA" src={CALC} /> ÷ (√3 × {v(Q_750)}).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                How many amps is <Val v={Q_125_208.kva} unit="kVA" src={CALC} />?
              </h3>
              <p className={P} data-src={CALC}>
                Three-phase, {amps(Q_125_208)} at {v(Q_125_208)} and {amps(Q_125_480)} at {v(Q_125_480)}.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does the power factor change the current from kVA?</h3>
              <p className={P} data-src={EIA}>
                No. kVA is volts times amps, so the current follows from the kVA and the voltage alone. The power factor sets how much of the
                kVA is real power.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How do I find a transformer&apos;s current on each side?</h3>
              <p className={P} data-src={MIT}>
                Use its kVA rating with each side&apos;s voltage: the same formula gives the current at that voltage, losses aside. A{' '}
                {kva(EX_480)} three-phase transformer from {v(EX_480)} to {v(EX_208)} carries {amps(EX_480)} on the{' '}
                <Val v={EX_480.volts} unit="V" src={VOLTS} /> side and {amps(EX_208)} on the <Val v={EX_208.volts} unit="V" src={VOLTS} /> side
                at its rating.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[EIA, MIT, PFC, VOLTS]}
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
