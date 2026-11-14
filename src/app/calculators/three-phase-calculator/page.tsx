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
import { SourceLine } from '@/components/content/SourceLine';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { ThreePhaseTool } from '@/components/calculators/ThreePhaseTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { PF_EXAMPLE, PowerTriangle, WYE_DRAWN, WyePhasors } from '@/components/look/Charts';
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
import { THREE_PHASE_VOLTS } from '@/lib/calculations/inputs';
import { ENGINE_ID, SQRT3, TP_SIG, TP_WYE_SYSTEMS, ampsFromKva, isTpError, threePhase } from '@/lib/calculations/power';
import type { TpCorrection, TpInput, TpResult } from '@/lib/calculations/power';
import { articleDates } from '@/lib/page-dates';
import { NOMINAL_THREE_PHASE, assertNominal } from '@/lib/verified/us-nominal-voltages';
import { DOE_MOTOR, DOE_PF } from '@/lib/verified/power-examples';

// /calculators/three-phase-calculator (WSZ-006d PHYSICS; spec: research/page-specs.md "WSZ-006"): the calculator in the
// look (D-33, D-35), every number from the power engine's three-phase path (threePhase) or the registry, with its source
// in data-src. S = √3 × V × I (MIT 6.061 polyphase notes; DOE/GO-10097-517 Equation 1 with the power factor),
// P = S × PF and PF = P ÷ S (EIA Glossary), Q = √(S² − P²) (reactive power at 90° to real power, DOE/GO-10096-286).
// Worked examples = golden "power" and "pf-correction" cases and the DOE fact sheet's measured motor.
const ROUTE = '/calculators/three-phase-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Three Phase Calculator: Amps, kW, kVA and Power Factor';
const DESCRIPTION =
  'Three-phase amps, kW, kVA, kVAR and power factor from the line-to-line voltage and any two known values, plus the capacitor kVAR to raise power factor.';

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

const DOE = 'doe-motor-load-efficiency';
const EIA = 'eia-power-glossary';
const PFC = 'doe-power-factor-cost';
const MIT = 'mit-polyphase-networks';
const VOLTS = 'us-nominal-voltages';
const CALC = `calc:${ENGINE_ID}`;
const SIG = { sig: TP_SIG };

// The quick voltages and the wye systems the tool shows must be systems the registry lists (us-nominal-voltages)
assertNominal(THREE_PHASE_VOLTS, 'three-phase calculator quick voltages');
const REGISTRY_WYES = NOMINAL_THREE_PHASE.filter((s) => s.includes('Y/')).map((s) => s.split('Y/').map(Number));
if (
  REGISTRY_WYES.length !== TP_WYE_SYSTEMS.length ||
  TP_WYE_SYSTEMS.some((w, k) => REGISTRY_WYES[k][0] !== w.lineVolts || REGISTRY_WYES[k][1] !== w.neutralVolts)
) {
  throw new Error('three-phase page: TP_WYE_SYSTEMS differs from the wye systems in us-nominal-voltages');
}
const [WYE_208, WYE_480] = TP_WYE_SYSTEMS;
/** The registry's three-wire 480 V system (no Y), named in the line-to-neutral question. */
const PLAIN_480 = Number(NOMINAL_THREE_PHASE.find((s) => s === String(WYE_480.lineVolts)));
if (!PLAIN_480) throw new Error('three-phase page: us-nominal-voltages has no plain 480 V system');

function solved(input: TpInput): TpResult {
  const r = threePhase(input);
  if (isTpError(r)) throw new Error(`three-phase page: a worked example failed (${r.error})`);
  return r;
}

// the golden worked examples (research/golden-cases.json, groups power and pf-correction)
const EX_KW = solved({ volts: 480, known: 'kw-pf', kw: 50, pf: 0.9 });
const EX_KW_PF1 = solved({ volts: 480, known: 'kw-pf', kw: 50, pf: 1 });
const EX_AMPS = solved({ volts: 480, known: 'amps-pf', amps: 50, pf: 0.92 });
const EX_KVA_208 = solved({ volts: 208, known: 'kva-pf', kva: 75, pf: 1 });
const EX_KVA_480 = solved({ volts: 480, known: 'kva-pf', kva: 75, pf: 1 });
// DOE/GO-10097-517's measured motor and DOE/GO-10096-286's example, from their registry rows (power-examples.ts)
const EX_DOE = solved({ volts: DOE_MOTOR.volts, known: 'amps-pf', amps: DOE_MOTOR.amps, pf: DOE_MOTOR.pf });
const EX_DOE_PF = solved({ volts: 480, known: 'kw-kva', kw: DOE_PF.kw, kva: DOE_PF.kva, targetPf: DOE_PF.to });
function correctionOf(r: TpResult): TpCorrection {
  if (!r.correction) throw new Error('three-phase page: a correction example has no result');
  return r.correction;
}
const PFX = PF_EXAMPLE;
const PFX_C = correctionOf(PFX);
const DOE_PF_C = correctionOf(EX_DOE_PF);
const PFX_AMPS_AFTER = PFX_C.ampsAfter;

/** The table: amperes per kVA and per kW at each nominal three-phase voltage. */
const TABLE_PFS = [0.95, 0.9, 0.85, 0.8];
const perKva = (volts: number) => ampsFromKva(1, volts);

const TOC: ([string, string] | [string, string, string])[] = [
  ['read', 'Reading the result'],
  ['examples', 'Worked examples'],
  ['formulas', 'The formulas'],
  ['root3', 'Why √3: line to line and line to neutral'],
  ['power', 'kW, kVA, kVAR and power factor'],
  ['correction', 'Raising the power factor'],
  ['per-kw', 'Current per kW and per kVA'],
  ['covers', 'What the calculator covers'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Three Phase Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Three Phase Calculator', url: URL, description: DESCRIPTION };

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

/** "208Y/120 V" from a wye system, its numbers traced to the registry. */
function Wye({ w }: { w: { lineVolts: number; neutralVolts: number } }) {
  return (
    <span data-src={VOLTS}>
      {w.lineVolts}Y/{w.neutralVolts} V
    </span>
  );
}

export default function ThreePhaseCalculatorPage() {
  const kvaCase = (r: TpResult) => <Val v={r.amps} unit="A" src={CALC} format={SIG} />;
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Three Phase Calculator" sub="Amps, kW, kVA and Power Factor" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            Enter the line-to-line voltage and any two of real power, apparent power, current and power factor to get the rest, and the
            capacitor that raises the power factor to a target.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <ThreePhaseTool />
        </section>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-12">
          <p className={LOOK_LEAD} data-src={DOE}>
            <strong>Three-phase current is the real power divided by √3 times the line-to-line voltage times the power factor.</strong> A{' '}
            <Val v={EX_KW.kw} unit="kW" src={CALC} /> load at <Val v={EX_KW.volts} unit="V" src={CALC} /> with a power factor of{' '}
            <Num v={EX_KW.pf} src={CALC} /> draws <Val v={EX_KW.amps} unit="A" src={CALC} format={SIG} /> in each line. The √3 is the
            ratio of the voltage between two lines to the voltage from a line to neutral:{' '}
            <Val v={WYE_480.lineVolts} unit="V" src={VOLTS} /> and <Val v={WYE_480.neutralVolts} unit="V" src={VOLTS} /> on a{' '}
            <Wye w={WYE_480} /> system.
          </p>
          <Figure
            caption={
              <>
                <span data-src={MIT}>
                  A <Wye w={WYE_DRAWN} /> system: three voltages of <Val v={WYE_DRAWN.neutralVolts} unit="V" src={VOLTS} /> from the neutral,{' '}
                  <Num v={120} src={MIT} />° apart, and <Val v={WYE_DRAWN.lineVolts} unit="V" src={VOLTS} /> between any two lines, √3 times as
                  much.
                </span>
                <SourceLine domains={[VOLTS, MIT]} />
              </>
            }
          >
            <WyePhasors />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="read" className="space-y-4">
            <h2 id="read" className={H2}>
              Reading the result
            </h2>
            <p className={P}>
              <strong>The large figure</strong> is the value you didn&apos;t enter: the current in each line, or the real power when you
              entered the current, or the power factor when you entered both the power and the current.
            </p>
            <p className={P} data-src={VOLTS}>
              <strong>The table</strong> lists all five values for the load: current, real power, apparent power, reactive power and power
              factor. At <Val v={WYE_208.lineVolts} unit="V" src={VOLTS} /> and <Val v={WYE_480.lineVolts} unit="V" src={VOLTS} />, the two
              wye systems in the list of nominal voltages, it adds the voltage from each line to neutral. <strong>With a target</strong>{' '}
              power factor, the capacitor bank and the current after correction follow, and <strong>the bars</strong> draw the powers to one
              scale.
            </p>
          </section>

          <section aria-labelledby="examples" className="space-y-5">
            <h2 id="examples" className={H2}>
              Worked examples
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>
                <Val v={EX_KW.kw} unit="kW" src={CALC} /> at <Val v={EX_KW.volts} unit="V" src={CALC} />, power factor{' '}
                <Num v={EX_KW.pf} src={CALC} />
              </h3>
              <p className={P} data-src={DOE}>
                I = P ÷ (√3 × V × PF) = <Val v={EX_KW.kw * 1000} unit="W" src={CALC} /> ÷ (√3 × <Val v={EX_KW.volts} unit="V" src={CALC} /> ×{' '}
                <Num v={EX_KW.pf} src={CALC} />) = <Val v={EX_KW.amps} unit="A" src={CALC} format={SIG} /> in each line. The load draws{' '}
                <Val v={EX_KW.kva} unit="kVA" src={CALC} format={SIG} />, of which <Val v={EX_KW.kvar} unit="kVAR" src={CALC} format={SIG} /> is
                reactive. At a power factor of <Num v={1} src={CALC} />, the same <Val v={EX_KW_PF1.kw} unit="kW" src={CALC} /> would draw{' '}
                <Val v={EX_KW_PF1.amps} unit="A" src={CALC} format={SIG} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                <Val v={EX_AMPS.amps} unit="A" src={CALC} /> at <Val v={EX_AMPS.volts} unit="V" src={CALC} />, power factor{' '}
                <Num v={EX_AMPS.pf} src={CALC} />
              </h3>
              <p className={P} data-src={DOE}>
                P = √3 × V × I × PF = √3 × <Val v={EX_AMPS.volts} unit="V" src={CALC} /> × <Val v={EX_AMPS.amps} unit="A" src={CALC} /> ×{' '}
                <Num v={EX_AMPS.pf} src={CALC} /> = <Val v={EX_AMPS.kw * 1000} unit="W" src={CALC} format={{ fixed: 1 }} />, or{' '}
                <Val v={EX_AMPS.kw} unit="kW" src={CALC} format={SIG} /> of real power.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>A measured motor</h3>
              <p className={P} data-src={DOE}>
                The DOE fact sheet behind the formula works it on a motor measured at <Val v={DOE_MOTOR.volts} unit="V" src={DOE} /> between
                lines, <Val v={DOE_MOTOR.amps} unit="A" src={DOE} /> per line and a power factor of <Num v={DOE_MOTOR.pf} src={DOE} />, each the
                mean of three readings. The calculator gives <Val v={EX_DOE.kw} unit="kW" src={CALC} format={SIG} />; the sheet prints{' '}
                <Val v={DOE_MOTOR.printedKw} unit="kW" src={DOE} />. Measured values go straight into the calculator, whatever the voltage.
              </p>
            </div>
          </section>

          <section aria-labelledby="formulas" className="space-y-4">
            <h2 id="formulas" className={H2}>
              The formulas
            </h2>
            <p className={P} data-src={DOE}>
              V is the voltage between two lines, I the current in one line and PF the power factor. With P in watts and S in volt-amperes
              (divide by <Num v={1000} src={CALC} /> for kW and kVA):
            </p>
            <p className={LOOK_FORMULA} data-src={DOE}>
              P = √3 × V × I × PF
            </p>
            <p className={LOOK_FORMULA} data-src={MIT}>
              S = √3 × V × I
            </p>
            <p className={LOOK_FORMULA} data-src={EIA}>
              PF = P ÷ S
            </p>
            <p className={LOOK_FORMULA} data-src={PFC}>
              Q = √(S² − P²)
            </p>
            <p className={P} data-src={DOE}>
              The first is Equation 1 of the U.S. Department of Energy&apos;s fact sheet on motor load, which gives P in kilowatts by dividing
              by <Num v={1000} src={CALC} />. Turned around, they give the current: I = P ÷ (√3 × V × PF) from real power, I = S ÷ (√3 × V)
              from apparent power. The formulas hold for a wye or a delta load, as long as the three lines carry the same current.
            </p>
          </section>

          <section aria-labelledby="root3" className="space-y-4">
            <h2 id="root3" className={H2}>
              Why √3: line to line and line to neutral
            </h2>
            <p className={P} data-src={MIT}>
              The three voltages of a three-phase supply are <Num v={120} src={MIT} />° apart. The voltage between two lines is the difference of
              two of them: √3 times the voltage from one line to the neutral, about <Num v={SQRT3} src={CALC} format={SIG} /> times. On a <Wye w={WYE_208} /> system that is{' '}
              <Val v={WYE_208.lineVolts} unit="V" src={VOLTS} /> between lines and <Val v={WYE_208.neutralVolts} unit="V" src={VOLTS} /> to
              neutral; on <Wye w={WYE_480} />, <Val v={WYE_480.lineVolts} unit="V" src={VOLTS} /> and{' '}
              <Val v={WYE_480.neutralVolts} unit="V" src={VOLTS} />.
            </p>
            <p className={P} data-src={MIT}>
              The power formula takes its √3 from the same place. Each phase delivers its line-to-neutral voltage times the line current, so
              the three together deliver <Num v={3} src={MIT} /> × V(line to neutral) × I. Written with the line-to-line voltage, that is √3 ×
              V(line to line) × I, because <Num v={3} src={MIT} /> ÷ √3 = √3.
            </p>
            <Stat
              figure={<Num v={SQRT3} src={CALC} format={SIG} />}
              text={
                <span data-src={MIT}>
                  √3, the ratio of line-to-line to line-to-neutral voltage in a balanced three-phase system:{' '}
                  <Val v={WYE_480.lineVolts} unit="V" src={VOLTS} /> ÷ √3 ={' '}
                  <Val v={WYE_480.lineVolts / SQRT3} unit="V" src={CALC} format={SIG} />, the <Val v={WYE_480.neutralVolts} unit="V" src={VOLTS} />{' '}
                  of a <Wye w={WYE_480} /> system.
                </span>
              }
              domains={[MIT, VOLTS]}
            />
          </section>

          <section aria-labelledby="power" className="space-y-4">
            <h2 id="power" className={H2}>
              kW, kVA, kVAR and power factor
            </h2>
            <p className={P} data-src={EIA}>
              <strong>Apparent power</strong>, in kVA, is volts times amps. It splits into <strong>real power</strong>, in kW, the part that
              does work, and <strong>reactive power</strong>, in kVAR, which does none but which motors and other magnetic equipment need.{' '}
              <strong>Power factor</strong> is real power divided by apparent power, so it is at most <Num v={1} src={EIA} />.
            </p>
            <p className={P} data-src={PFC}>
              Reactive power acts at a right angle to real power, so the three make a right triangle: S² = P² + Q². A load at power factor{' '}
              <Num v={EX_KW.pf} src={CALC} /> draws <Val v={EX_KW.kva} unit="kVA" src={CALC} format={SIG} /> for{' '}
              <Val v={EX_KW.kw} unit="kW" src={CALC} /> of real power. The current follows the apparent power, which is why a low power factor
              takes more current for the same work.
            </p>
            <p className={P} data-src={MIT}>
              A rating in kVA gives the current without any power factor: <Val v={EX_KVA_208.kva} unit="kVA" src={CALC} /> is{' '}
              {kvaCase(EX_KVA_208)} at <Val v={EX_KVA_208.volts} unit="V" src={CALC} /> and {kvaCase(EX_KVA_480)} at{' '}
              <Val v={EX_KVA_480.volts} unit="V" src={CALC} />. The{' '}
              <Link href="/calculators/kva-to-amps-calculator" className={LINK}>
                kVA to amps calculator
              </Link>{' '}
              covers single-phase too.
            </p>
          </section>

          <section aria-labelledby="correction" className="space-y-4">
            <h2 id="correction" className={H2}>
              Raising the power factor
            </h2>
            <p className={P} data-src={PFC}>
              A capacitor bank next to the load supplies reactive power, so the source no longer has to. The real power stays the same; the
              reactive power from the source, the apparent power and the current fall. The bank&apos;s size is the reactive power it takes
              over: the load&apos;s reactive power before, less what it draws at the target power factor.
            </p>
            <p className={P} data-src={CALC}>
              <strong>
                From <Num v={PFX.pf} src={CALC} format={{ fixed: 2 }} /> to <Num v={PFX_C.targetPf} src={CALC} format={{ fixed: 2 }} /> on{' '}
                <Val v={PFX.kw} unit="kW" src={CALC} />
              </strong>
              : the reactive power falls from <Val v={PFX.kvar} unit="kVAR" src={CALC} format={{ upTo: 2 }} /> to{' '}
              <Val v={PFX_C.kvarAfter} unit="kVAR" src={CALC} format={SIG} />, so the bank is{' '}
              <Val v={PFX_C.capKvar} unit="kVAR" src={CALC} format={SIG} />. The apparent power falls from{' '}
              <Val v={PFX.kva} unit="kVA" src={CALC} format={{ upTo: 2 }} /> to <Val v={PFX_C.kvaAfter} unit="kVA" src={CALC} format={SIG} />,
              and at <Val v={PFX.volts} unit="V" src={CALC} /> the current from <Val v={PFX.amps} unit="A" src={CALC} format={SIG} /> to{' '}
              <Val v={PFX_AMPS_AFTER} unit="A" src={CALC} format={SIG} />, <Val v={PFX_C.currentDownPct} unit="%" src={CALC} format={SIG} /> less
              at any voltage.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={PFC}>
                    The power triangle of <Val v={PFX.kw} unit="kW" src={CALC} /> before and after the capacitor bank, drawn to one scale: real
                    power along the bottom, reactive power up the side, apparent power as the long side.
                  </span>
                  <SourceLine domains={[PFC, EIA]} />
                </>
              }
            >
              <PowerTriangle />
            </Figure>
            <DataTable id="correction-table" variant="ruled" src={CALC} caption={`${PFX.kw} kW at ${PFX.volts} V before and after the capacitor bank`}>
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Value
                  </th>
                  <th scope="col" className={RTH}>
                    Before
                  </th>
                  <th scope="col" className={RTH}>
                    After
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Power factor', <Num key="a" v={PFX.pf} src={CALC} format={{ fixed: 2 }} />, <Num key="b" v={PFX_C.targetPf} src={CALC} format={{ fixed: 2 }} />],
                  ['Real power', <Val key="a" v={PFX.kw} unit="kW" src={CALC} />, <Val key="b" v={PFX.kw} unit="kW" src={CALC} />],
                  [
                    'Reactive power',
                    <Val key="a" v={PFX.kvar} unit="kVAR" src={CALC} format={{ upTo: 2 }} />,
                    <Val key="b" v={PFX_C.kvarAfter} unit="kVAR" src={CALC} format={SIG} />,
                  ],
                  [
                    'Apparent power',
                    <Val key="a" v={PFX.kva} unit="kVA" src={CALC} format={{ upTo: 2 }} />,
                    <Val key="b" v={PFX_C.kvaAfter} unit="kVA" src={CALC} format={SIG} />,
                  ],
                  [
                    'Current per line',
                    <Val key="a" v={PFX.amps} unit="A" src={CALC} format={SIG} />,
                    <Val key="b" v={PFX_AMPS_AFTER} unit="A" src={CALC} format={SIG} />,
                  ],
                ].map(([label, a, b]) => (
                  <tr key={label as string}>
                    <th scope="row" className={RSTICKY_TD}>
                      {label}
                    </th>
                    <td className={RTD}>{a}</td>
                    <td className={RTD}>{b}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className={P} data-src={PFC}>
              The DOE fact sheet on power factor cost works its own example: <Val v={DOE_PF.kw} unit="kW" src={PFC} /> drawing{' '}
              <Val v={DOE_PF.kva} unit="kVA" src={PFC} />, a power factor of <Num v={EX_DOE_PF.pf} src={CALC} format={SIG} />, corrected to{' '}
              <Num v={DOE_PF.to} src={PFC} />. The calculator gives <Val v={DOE_PF_C.capKvar} unit="kVAR" src={CALC} format={SIG} />{' '}
              and <Val v={DOE_PF_C.currentDownPct} unit="%" src={CALC} format={SIG} /> less current; the sheet rounds the current
              to about <Val v={DOE_PF.printedPct} unit="%" src={PFC} />.
            </p>
            <Stat
              figure={<Val v={PFX_C.capKvar} unit="kVAR" src={CALC} format={SIG} />}
              text={
                <span data-src={CALC}>
                  The capacitor bank that raises <Val v={PFX.kw} unit="kW" src={CALC} /> from power factor{' '}
                  <Num v={PFX.pf} src={CALC} format={{ fixed: 2 }} /> to <Num v={PFX_C.targetPf} src={CALC} format={{ fixed: 2 }} />; the current
                  in each line falls <Val v={PFX_C.currentDownPct} unit="%" src={CALC} format={SIG} />.
                </span>
              }
              domains={[PFC, EIA]}
            />
          </section>

          <section aria-labelledby="per-kw" className="space-y-5">
            <h2 id="per-kw" className={H2}>
              Current per kW and per kVA
            </h2>
            <p className={P} data-src={CALC}>
              The table gives the amperes in each line for every kVA, and for every kW at four power factors, at the nominal three-phase
              voltages. Multiply by your load: at <Val v={EX_KW.volts} unit="V" src={CALC} />, <Val v={EX_KW.kw} unit="kW" src={CALC} /> at power factor{' '}
              <Num v={EX_KW.pf} src={CALC} /> is <Val v={EX_KW.kw} unit="kW" src={CALC} /> ×{' '}
              <Num v={perKva(EX_KW.volts) / EX_KW.pf} src={CALC} format={SIG} /> ≈ <Val v={EX_KW.amps} unit="A" src={CALC} format={{ sig: 3 }} />.
            </p>
            <DataTable id="per-kw-table" variant="ruled" src={CALC} caption="Amperes per line for each kVA, and for each kW at a power factor">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Voltage, line to line
                  </th>
                  <th scope="col" className={RTH}>
                    Per kVA
                  </th>
                  {TABLE_PFS.map((pf) => (
                    <th key={pf} scope="col" className={RTH}>
                      Per kW, PF <Num v={pf} src={CALC} format={{ fixed: 2 }} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {THREE_PHASE_VOLTS.map((v) => (
                  <tr key={v}>
                    <th scope="row" className={RSTICKY_TD}>
                      <Val v={v} unit="V" src={VOLTS} />
                    </th>
                    <td className={RTD}>
                      <Num v={perKva(v)} src={CALC} format={SIG} />
                    </td>
                    {TABLE_PFS.map((pf) => (
                      <td key={pf} className={RTD}>
                        <Num v={perKva(v) / pf} src={CALC} format={SIG} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <SourceLine domains={[DOE, MIT, VOLTS]} />
            <p className={P} data-src={CALC}>
              At a power factor of <Num v={1} src={CALC} />, a kW draws what a kVA does.
            </p>
          </section>

          <section aria-labelledby="covers" className="space-y-4">
            <h2 id="covers" className={H2}>
              What the calculator covers
            </h2>
            <p className={P}>
              <strong>Balanced loads</strong> with sinusoidal voltage and current: the same current in all three lines. For an unbalanced
              load, each line has its own current, and one figure can&apos;t describe it.
            </p>
            <p className={P} data-src={VOLTS}>
              <strong>Any voltage</strong> between two lines, from a nameplate, a meter or a nominal system; the buttons hold the nominal
              three-phase voltages: {THREE_PHASE_VOLTS.map((v, k) => (
                <span key={v}>
                  {k > 0 && (k === THREE_PHASE_VOLTS.length - 1 ? ' and ' : ', ')}
                  <Val v={v} unit="V" src={VOLTS} />
                </span>
              ))}
              .
            </p>
            <p className={P}>
              <strong>Not covered:</strong> sizing the conductors, the breaker or the capacitor bank&apos;s own protection. The{' '}
              <Link href="/calculators/wire-size-calculator" className={LINK}>
                wire size calculator
              </Link>{' '}
              picks conductors for a current, and the{' '}
              <Link href="/calculators/voltage-drop-calculator" className={LINK}>
                voltage drop calculator
              </Link>{' '}
              checks a three-phase run.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>
                How many amps is <Val v={EX_KW.kw} unit="kW" src={CALC} /> at <Val v={EX_KW.volts} unit="V" src={CALC} /> three-phase?
              </h3>
              <p className={P} data-src={DOE}>
                <Val v={EX_KW.amps} unit="A" src={CALC} format={SIG} /> in each line at a power factor of <Num v={EX_KW.pf} src={CALC} />, and{' '}
                <Val v={EX_KW_PF1.amps} unit="A" src={CALC} format={SIG} /> at a power factor of <Num v={1} src={CALC} />: I = P ÷ (√3 × V × PF).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What is the formula for three-phase power?</h3>
              <p className={P} data-src={DOE}>
                P = √3 × V × I × PF, with V the voltage between two lines, I the current in one line and PF the power factor; divide by{' '}
                <Num v={1000} src={CALC} /> for kW. Apparent power is the same without the power factor: S = √3 × V × I.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Why is √3 in three-phase formulas?</h3>
              <p className={P} data-src={MIT}>
                The voltage between two lines is √3 times the voltage from a line to neutral. The three phases deliver{' '}
                <Num v={3} src={MIT} /> × V(line to neutral) × I together, which is √3 × V(line to line) × I.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                What is the line-to-neutral voltage of <Val v={WYE_480.lineVolts} unit="V" src={VOLTS} /> three-phase?
              </h3>
              <p className={P} data-src={VOLTS}>
                <Val v={WYE_480.neutralVolts} unit="V" src={VOLTS} /> on a <Wye w={WYE_480} /> system:{' '}
                <Val v={WYE_480.lineVolts} unit="V" src={VOLTS} /> ÷ √3 = <Val v={WYE_480.lineVolts / SQRT3} unit="V" src={CALC} format={SIG} />.
                A <Wye w={WYE_208} /> system has <Val v={WYE_208.neutralVolts} unit="V" src={VOLTS} /> from each line to neutral. The list of
                nominal voltages also has a plain <Val v={PLAIN_480} unit="V" src={VOLTS} /> system, which names no line-to-neutral voltage.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Is kVA the same as kW?</h3>
              <p className={P} data-src={EIA}>
                Only at a power factor of <Num v={1} src={EIA} />. kVA is volts times amps; kW is the part that does work, kVA times the power
                factor. At power factor <Num v={0.9} src={CALC} />, <Val v={EX_KVA_480.kva} unit="kVA" src={CALC} /> is{' '}
                <Val v={EX_KVA_480.kva * 0.9} unit="kW" src={CALC} /> of real power.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                How big a capacitor raises the power factor from <Num v={PFX.pf} src={CALC} format={{ fixed: 2 }} /> to{' '}
                <Num v={PFX_C.targetPf} src={CALC} format={{ fixed: 2 }} />?
              </h3>
              <p className={P} data-src={CALC}>
                <Val v={PFX_C.capKvar} unit="kVAR" src={CALC} format={SIG} /> for every <Val v={PFX.kw} unit="kW" src={CALC} /> of load, which cuts
                the current <Val v={PFX_C.currentDownPct} unit="%" src={CALC} format={SIG} />. Enter your load and a target power factor in the
                calculator for your own figures.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[DOE, EIA, PFC, MIT, VOLTS]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#three-phase-power" className={LINK}>
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
