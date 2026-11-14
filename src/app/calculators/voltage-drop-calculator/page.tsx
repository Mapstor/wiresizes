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
import { VoltageDropTool } from '@/components/calculators/VoltageDropTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { DROP_CHART, DropDistanceChart, DropSplitDiagram, dropDistanceFt } from '@/components/look/Charts';
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
import { decimalsAtSig } from '@/lib/calculations/format';
import { COPPER_ALPHA, ENGINE_ID as RES_ENGINE, atTemperature, equivalentSize } from '@/lib/calculations/resistance';
import { ENGINE_ID, dropRun, parallelEquivalent } from '@/lib/calculations/voltage-drop';
import type { DropInput, DropRun } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import { AWG_CONSTANTS, areaCmil } from '@/lib/verified/awg';
import type { SizeKey } from '@/lib/verified/awg';
import { VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { table31016 } from '@/lib/verified/nec-310-16';

// /calculators/voltage-drop-calculator (WSZ-006b PHYSICS; spec: research/page-specs.md "WSZ-006"): the calculator in
// the look (D-33, D-35), every number from the voltage drop engine's calculator path (dropRun) or the data modules, with
// its source in data-src. VD = k × I × R × L ÷ 1000, R(T) from NIST's tables. Worked examples = golden cases
// "3/0 AWG Cu, 200 A…", "12 AWG Cu, 16 A…" and "4 AWG Cu, 60 A … three-phase"; the parallel example = golden "2 × 1/0".
// The voltage-drop note is 2023 NEC 215.2(A) Informational Note No. 2 (nec-continuous-load-2023.json), always as advice.
const ROUTE = '/calculators/voltage-drop-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Voltage Drop Calculator: Volts, Percent and Wire Size';
const DESCRIPTION =
  'Voltage drop in volts and percent for copper or aluminum wire on single-phase, three-phase or DC circuits, or the smallest size for your target.';

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
const VOLTS = 'us-nominal-voltages';
const POWER = 'power-definitions';
const CALC = `calc:${ENGINE_ID}`;
const RCALC = `calc:${RES_ENGINE}`;
/** 2023 NEC 215.2(A), Informational Note No. 2, read from nec-continuous-load-2023.json. */
const NOTE_FEEDER_PCT = VOLTAGE_DROP_NOTE.feederPct;
const NOTE_TOTAL_PCT = VOLTAGE_DROP_NOTE.totalPct;

function run(input: Omit<DropInput, 'tempC' | 'sets'> & { tempC?: number; sets?: number }): DropRun {
  const r = dropRun({ tempC: 75, sets: 1, ...input });
  if (!r) throw new Error(`voltage drop page: no result for ${input.size}`);
  return r;
}

// the three golden worked examples, at 75 °C
const EX_FEEDER = run({ size: '3/0', material: 'Cu', amps: 200, lengthFt: 100, volts: 240, circuit: 'single' });
const EX_BRANCH = run({ size: '12', material: 'Cu', amps: 16, lengthFt: 50, volts: 120, circuit: 'single' });
const EX_THREE = run({ size: '4', material: 'Cu', amps: 60, lengthFt: 150, volts: 480, circuit: 'three' });
const PARALLEL = parallelEquivalent('1/0', 2);
const AL_FOR_4 = equivalentSize('4', 'Cu', 'Al') as SizeKey;
const AL_TO_CU = AWG_CONSTANTS.aluminum_ECH19_resistivity_ohm_cmil_per_ft_20C / AWG_CONSTANTS.copper_resistivity_ohm_cmil_per_ft_20C;
const RISE_75 = (atTemperature(1, 'Cu', 75) - 1) * 100;
const TWELVE_120 = dropDistanceFt('12', 120, 'single');
const TWELVE_240 = dropDistanceFt('12', 240, 'single');
const FOUR_ZERO_120 = dropDistanceFt('4/0', 120, 'single');
/** °F from °C, for a temperature's first mention. */
const cToF = (c: number) => (c * 9) / 5 + 32;

/** The distance table's sizes: Table 310.16's copper sizes from 14 AWG to 500 kcmil. */
const DISTANCE_SIZES: SizeKey[] = ['14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0', '250', '300', '350', '400', '500'];
const DISTANCE_COLUMNS: { key: string; volts: number; circuit: 'single' | 'three'; label: string }[] = [
  { key: 's120', volts: 120, circuit: 'single', label: 'single-phase' },
  { key: 's240', volts: 240, circuit: 'single', label: 'single-phase' },
  { key: 't208', volts: 208, circuit: 'three', label: 'three-phase' },
  { key: 't480', volts: 480, circuit: 'three', label: 'three-phase' },
];

const TOC: [string, string][] = [
  ['read', 'Reading the result'],
  ['examples', 'Worked examples'],
  ['distance', 'How far a wire size can run'],
  ['acceptable', 'How much voltage drop is acceptable'],
  ['formula', 'The formula'],
  ['three-phase', 'Three-phase circuits'],
  ['parallel', 'Conductors in parallel'],
  ['aluminum', 'Copper or aluminum'],
  ['limits', 'What the calculator leaves out'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Voltage Drop Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Voltage Drop Calculator', url: URL, description: DESCRIPTION };

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

/** One worked example's arithmetic in a sentence: k × I × R × L ÷ 1,000 = VD, the percent and the load voltage. */
function Arithmetic({ r }: { r: DropRun }) {
  const sig = { sig: r.sig };
  return (
    <>
      {r.circuit === 'three' ? '√3' : <Num v={2} src={CALC} />} × <Val v={r.amps} unit="A" src={CALC} /> ×{' '}
      <Val v={r.perKft} unit="Ω" src={CALC} format={sig} /> × <Val v={r.lengthFt} unit="ft" src={CALC} /> ÷ 1,000 ={' '}
      <strong>
        <Val v={r.vdVolts} unit="V" src={CALC} format={sig} />
      </strong>
      , which is{' '}
      <strong>
        <Val v={r.vdPct} unit="%" src={CALC} format={sig} />
      </strong>{' '}
      of <Val v={r.volts} unit="V" src={VOLTS} />. The load gets{' '}
      <Val v={r.loadVolts} unit="V" src={CALC} format={{ fixed: decimalsAtSig(r.vdVolts, r.sig) }} />.
    </>
  );
}

export default function VoltageDropCalculatorPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Voltage Drop Calculator" sub="Single-Phase, Three-Phase and DC" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            Enter the circuit, the load, the wire and the length to get the volts lost in the wire, or let the calculator find the
            smallest size that stays within your target.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <VoltageDropTool />
        </section>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-12">
          <p className={LOOK_LEAD} data-src={CALC}>
            <strong>Voltage drop is the current times the resistance of the wire, out and back on a single-phase circuit.</strong> On a{' '}
            <Val v={120} unit="V" src={VOLTS} /> circuit, <Size s="12" /> copper carrying <Val v={TWELVE_120.amps} unit="A" src={AMP} /> loses{' '}
            <Val v={DROP_CHART.targetPct} unit="%" src={NOTE} /> of the supply, <Val v={(DROP_CHART.targetPct / 100) * 120} unit="V" src={CALC} format={{ upTo: 2 }} />,
            at <Val v={TWELVE_120.ft} unit="ft" src={CALC} /> one way; on <Val v={240} unit="V" src={VOLTS} /> it goes{' '}
            <Val v={TWELVE_240.ft} unit="ft" src={CALC} />. Thicker wire goes further: carrying the current its{' '}
            <Val v={60} unit="°C" src={AMP} /> rating allows, <Size s="4/0" /> reaches the same drop at{' '}
            <Val v={FOUR_ZERO_120.ft} unit="ft" src={CALC} /> on <Val v={120} unit="V" src={VOLTS} />.
          </p>
          <Figure
            caption={
              <>
                <span data-src={CALC}>
                  How far each copper size runs on a <Val v={120} unit="V" src={VOLTS} /> circuit before the drop reaches{' '}
                  <Val v={DROP_CHART.targetPct} unit="%" src={NOTE} />, carrying the current in the <Val v={60} unit="°C" src={AMP} /> column of
                  Table 310.16, conductor at <Val v={DROP_CHART.tempC} unit="°C" src={AMP} />. On <Val v={240} unit="V" src={VOLTS} /> each
                  distance doubles. Point at a bar to read it.
                </span>
                <SourceLine domains={[RES, AMP, NOTE]} />
              </>
            }
          >
            <DropDistanceChart />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="read" className="space-y-4">
            <h2 id="read" className={H2}>
              Reading the result
            </h2>
            <p className={P}>
              <strong>The large number</strong> is the drop as a percent of the supply voltage, and the line under it gives the volts lost in
              the wire and the voltage left at the load. The table lists the current (worked out from the watts if you entered power), the
              resistance the calculation used and the heat the conductors give off.
            </p>
            <p className={P}>
              <strong>In the second mode</strong> the large figure is a wire size: the smallest whose drop stays within your target. The size
              below it is shown with its drop, so you can see how close it came.
            </p>
            <p className={P}>
              <strong>The bars</strong> show the same run in the sizes around yours. A note appears when the current is more than the
              wire&apos;s ampacity, because a size that passes on voltage drop can still be too small to carry the load.
            </p>
          </section>

          <section aria-labelledby="examples" className="space-y-5">
            <h2 id="examples" className={H2}>
              Worked examples
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>
                A feeder: <Size s="3/0" /> copper, <Val v={200} unit="A" src={CALC} />, <Val v={100} unit="ft" src={CALC} />,{' '}
                <Val v={240} unit="V" src={VOLTS} />
              </h3>
              <p className={P} data-src={CALC}>
                At <Val v={75} unit="°C" src={AMP} /> (<Val v={cToF(75)} unit="°F" src={CALC} />), <Size s="3/0" /> copper is{' '}
                <Val v={EX_FEEDER.perKft} unit="Ω" src={CALC} format={{ sig: EX_FEEDER.sig }} /> per 1,000 ft. Single-phase, both conductors count:{' '}
                <Arithmetic r={EX_FEEDER} />
              </p>
            </div>
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    The same run drawn: the current goes out on one conductor and back on the other, and each drops half of the{' '}
                    <Val v={EX_FEEDER.vdVolts} unit="V" src={CALC} format={{ sig: EX_FEEDER.sig }} />.
                  </span>
                  <SourceLine domains={[RES]} />
                </>
              }
            >
              <DropSplitDiagram />
            </Figure>
            <div className="space-y-1.5">
              <h3 className={H3}>
                A branch circuit: <Size s="12" /> copper, <Val v={16} unit="A" src={CALC} />, <Val v={50} unit="ft" src={CALC} />,{' '}
                <Val v={120} unit="V" src={VOLTS} />
              </h3>
              <p className={P} data-src={CALC}>
                NIST gives <Size s="12" /> copper to three figures, so the result carries three: <Arithmetic r={EX_BRANCH} />
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                Three-phase: <Size s="4" /> copper, <Val v={60} unit="A" src={CALC} />, <Val v={150} unit="ft" src={CALC} />,{' '}
                <Val v={480} unit="V" src={VOLTS} />
              </h3>
              <p className={P} data-src={CALC}>
                On a balanced three-phase circuit the factor is √3 instead of <Num v={2} src={CALC} />: <Arithmetic r={EX_THREE} />
              </p>
            </div>
          </section>

          <section aria-labelledby="distance" className="space-y-5">
            <h2 id="distance" className={H2}>
              How far a wire size can run
            </h2>
            <p className={P} data-src={CALC}>
              The table turns the formula around. For each copper size carrying the current that the <Val v={60} unit="°C" src={AMP} /> column
              of NEC Table 310.16 allows, it gives the one-way length at which the drop reaches <Val v={DROP_CHART.targetPct} unit="%" src={NOTE} />,
              with the conductor at <Val v={DROP_CHART.tempC} unit="°C" src={AMP} />. Lengths are rounded down to the foot.
            </p>
            <DataTable
              id="distance-table"
              variant="ruled"
              src={CALC}
              caption={`One-way length in feet at which copper reaches a ${DROP_CHART.targetPct} % drop, carrying its 60 °C ampacity, conductor at ${DROP_CHART.tempC} °C`}
            >
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Size
                  </th>
                  <th scope="col" className={RTH}>
                    Current, <Val v={60} unit="°C" src={AMP} />
                  </th>
                  {DISTANCE_COLUMNS.map((c) => (
                    <th key={c.key} scope="col" className={RTH}>
                      <Val v={c.volts} unit="V" src={VOLTS} /> {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DISTANCE_SIZES.map((size) => (
                  <tr key={size}>
                    <th scope="row" className={RSTICKY_TD}>
                      <span data-size={size}>{size}</span>
                    </th>
                    <td className={RTD}>
                      <Num v={table31016(size, DROP_CHART.column) as number} src={AMP} />
                    </td>
                    {DISTANCE_COLUMNS.map((c) => (
                      <td key={c.key} className={RTD}>
                        <Num v={dropDistanceFt(size, c.volts, c.circuit).ft} src={CALC} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <SourceLine domains={[RES, AMP, NOTE, VOLTS]} />
            <p className={P} data-src={CALC}>
              The length is in proportion to the target and the voltage and in inverse proportion to the current: half the current goes twice
              as far, and a <Val v={NOTE_TOTAL_PCT} unit="%" src={NOTE} /> target goes <Num v={NOTE_TOTAL_PCT / NOTE_FEEDER_PCT} src={CALC} format={{ fixed: 2 }} />{' '}
              times as far as <Val v={NOTE_FEEDER_PCT} unit="%" src={NOTE} />. For any other load, the calculator does the arithmetic.
            </p>
          </section>

          <section aria-labelledby="acceptable" className="space-y-4">
            <h2 id="acceptable" className={H2}>
              How much voltage drop is acceptable
            </h2>
            <p className={P} data-src={NOTE}>
              The <Val v={NOTE_FEEDER_PCT} unit="%" src={NOTE} /> and <Val v={NOTE_TOTAL_PCT} unit="%" src={NOTE} /> figures come from a note,
              not a rule. In the 2023 NEC, an informational note in 215.2(A) says that feeder
              conductors sized to keep the drop at the farthest outlet under <Val v={NOTE_FEEDER_PCT} unit="%" src={NOTE} />, with the total on
              feeder and branch circuit within <Val v={NOTE_TOTAL_PCT} unit="%" src={NOTE} />, &ldquo;will provide reasonable efficiency of
              operation.&rdquo;
            </p>
            <Stat
              figure={<Val v={NOTE_FEEDER_PCT} unit="%" src={NOTE} />}
              text={
                <>
                  The drop at the farthest outlet that the 2023 NEC&apos;s informational note on feeders ties to reasonable efficiency;{' '}
                  <Val v={NOTE_TOTAL_PCT} unit="%" src={NOTE} /> for feeder and branch circuit together.
                </>
              }
              domains={[NOTE]}
            />
            <p className={P}>
              The note gives advice about efficiency and sets no limit. What a given load can tolerate is in its maker&apos;s documents: the
              nameplate or installation manual states the voltage it needs. The calculator&apos;s second mode starts at{' '}
              <Val v={NOTE_FEEDER_PCT} unit="%" src={NOTE} /> because of the note; set the target the job calls for.
            </p>
          </section>

          <section aria-labelledby="formula" className="space-y-4">
            <h2 id="formula" className={H2}>
              The formula
            </h2>
            <p className={LOOK_FORMULA} data-src={CALC}>
              VD = k × I × R × L ÷ 1,000
            </p>
            <p className={P} data-src={CALC}>
              I is the current in amperes, R the resistance of one conductor in ohms per 1,000 ft at its temperature, and L the one-way length
              in feet. k is <Num v={2} src={CALC} /> on DC and single-phase circuits, where the current flows out and back, and √3 on a
              balanced three-phase circuit. The percent is <Num v={100} src={CALC} /> × VD ÷ V, with V the supply voltage, line to line on
              three-phase.
            </p>
            <p className={P} data-src={RES}>
              R comes from NIST&apos;s copper wire tables at <Val v={20} unit="°C" src={RES} /> (<Val v={cToF(20)} unit="°F" src={RCALC} />),
              corrected to the conductor&apos;s temperature:
            </p>
            <p className={LOOK_FORMULA} data-src={RES}>
              R(T) = R<sub>20</sub> × (1 + α × (T − <Val v={20} unit="°C" src={RES} />))
            </p>
            <p className={P}>
              α is <Num v={COPPER_ALPHA} src={RES} /> per degree for copper, so between <Val v={20} unit="°C" src={RES} /> and{' '}
              <Val v={75} unit="°C" src={AMP} /> the resistance, and with it the drop, rises by{' '}
              <Val v={RISE_75} unit="%" src={RCALC} format={{ fixed: 1 }} />. The{' '}
              <Link href="/calculators/wire-resistance-calculator" className={LINK}>
                wire resistance calculator
              </Link>{' '}
              shows R for any size and temperature.
            </p>
            <p className={P} data-src={POWER}>
              A load given in watts becomes a current through I = P ÷ (V × PF) on a single-phase circuit, P ÷ (√3 × V × PF) on three-phase
              and P ÷ V on DC, PF being the power factor. The heat in the conductors is <Num v={2} src={CALC} /> × I² × R × L ÷ 1,000 watts
              on a two-wire circuit and <Num v={3} src={CALC} /> × I² × R × L ÷ 1,000 on three-phase.
            </p>
          </section>

          <section aria-labelledby="three-phase" className="space-y-4">
            <h2 id="three-phase" className={H2}>
              Three-phase circuits
            </h2>
            <p className={P} data-src={CALC}>
              On a balanced three-phase circuit the three line currents are equal and a third of a cycle apart. The drop between two lines is
              then √3 times the drop along one conductor, not twice it, which is why three-phase uses √3. Enter the line-to-line voltage:{' '}
              <span data-src={VOLTS}>
                <Val v={208} unit="V" src={VOLTS} /> on a 208Y/120 V system, <Val v={480} unit="V" src={VOLTS} /> on 480Y/277 V
              </span>
              .
            </p>
            <p className={P} data-src={VOLTS}>
              A load connected from one line to neutral, such as a <Val v={120} unit="V" src={VOLTS} /> circuit on a 208Y/120 V panel or a{' '}
              <Val v={277} unit="V" src={VOLTS} /> lighting circuit on 480Y/277 V, is a single-phase circuit: choose single-phase and that
              voltage.
            </p>
          </section>

          <section aria-labelledby="parallel" className="space-y-4">
            <h2 id="parallel" className={H2}>
              Conductors in parallel
            </h2>
            <p className={P} data-src={GEO}>
              A large feeder can run two or more conductors for each phase. Their areas add, so two sets of <Size s="1/0" /> (
              <Val v={areaCmil('1/0')} unit="cmil" src={GEO} /> each) give <Val v={PARALLEL.totalCmil} unit="cmil" src={CALC} />, just under one{' '}
              <Size s="4/0" /> at <Val v={areaCmil('4/0')} unit="cmil" src={GEO} />. The resistance of the run is divided by the number of
              sets, and so is the drop.
            </p>
            <p className={P}>
              The calculator takes one to four sets. It adds their areas and doesn&apos;t check the NEC&apos;s rules for running conductors in
              parallel.
            </p>
          </section>

          <section aria-labelledby="aluminum" className="space-y-4">
            <h2 id="aluminum" className={H2}>
              Copper or aluminum
            </h2>
            <p className={P} data-src={RES}>
              Aluminum conductor alloy EC-H19 has a resistivity of{' '}
              <Num v={AWG_CONSTANTS.aluminum_ECH19_resistivity_ohm_cmil_per_ft_20C} src={RES} /> Ω·cmil/ft at <Val v={20} unit="°C" src={RES} />{' '}
              against copper&apos;s <Num v={AWG_CONSTANTS.copper_resistivity_ohm_cmil_per_ft_20C} src={RES} />, so the same size and run in
              aluminum drops <Num v={AL_TO_CU} src={RCALC} format={{ fixed: 3 }} /> times as much. To drop no more than <Size s="4" /> copper,
              aluminum needs <Size s={AL_FOR_4} />. Aluminum starts at <Size s="12" /> in Table 310.16, and so does the calculator.
            </p>
          </section>

          <section aria-labelledby="limits" className="space-y-4">
            <h2 id="limits" className={H2}>
              What the calculator leaves out
            </h2>
            <p className={P}>
              <strong>Reactance.</strong> An AC circuit drops voltage across the conductors&apos; reactance as well as their resistance. The
              calculator uses resistance only. On small conductors resistance is most of the impedance; on large ones reactance can change the
              drop noticeably.
            </p>
            <p className={P}>
              <strong>Stranding.</strong> NIST&apos;s values are for solid conductors. A stranded conductor of the same size has slightly higher
              resistance, because each strand is laid in a spiral and runs a little longer than the cable.
            </p>
            <p className={P}>
              <strong>Ampacity.</strong> The drop says nothing about whether the wire can carry the current safely. That is a separate check,
              with its own corrections for heat and bundling: the{' '}
              <Link href="/calculators/wire-size-calculator" className={LINK}>
                wire size calculator
              </Link>{' '}
              does it, and the calculator here flags a current above the size&apos;s <Val v={60} unit="°C" src={AMP} /> ampacity.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>How do you calculate voltage drop?</h3>
              <p className={P} data-src={CALC}>
                Multiply the current by the resistance of the wire per 1,000 ft and by the one-way length, divide by <Num v={1000} src={CALC} />,
                and multiply by <Num v={2} src={CALC} /> for a single-phase or DC circuit or by √3 for three-phase.{' '}
                <a href="#formula" className={LINK}>
                  The formula, step by step
                </a>
                .
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What voltage drop does the NEC allow?</h3>
              <p className={P} data-src={NOTE}>
                For feeders and branch circuits in general, the 2023 NEC gives its figure in an informational note:{' '}
                <Val v={NOTE_FEEDER_PCT} unit="%" src={NOTE} /> at the farthest outlet and <Val v={NOTE_TOTAL_PCT} unit="%" src={NOTE} /> for
                feeder and branch circuit together give reasonable efficiency (215.2(A)). It is advice, not a limit.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                How far can you run <Size s="12" /> wire on a <Val v={20} unit="A" src={AMP} /> circuit?
              </h3>
              <p className={P} data-src={CALC}>
                At <Val v={TWELVE_120.amps} unit="A" src={AMP} />, copper at <Val v={75} unit="°C" src={AMP} /> reaches a{' '}
                <Val v={DROP_CHART.targetPct} unit="%" src={NOTE} /> drop at <Val v={TWELVE_120.ft} unit="ft" src={CALC} /> one way on{' '}
                <Val v={120} unit="V" src={VOLTS} /> and <Val v={TWELVE_240.ft} unit="ft" src={CALC} /> on <Val v={240} unit="V" src={VOLTS} />. A
                smaller load goes further in proportion; the table above has every size.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does a higher voltage reduce voltage drop?</h3>
              <p className={P}>
                For the same current, the drop in volts is the same, but it is a smaller share of a higher supply: on{' '}
                <Val v={240} unit="V" src={VOLTS} /> the percent is half what it is on <Val v={120} unit="V" src={VOLTS} />. For the same power,
                twice the voltage also draws half the current, so the volts lost halve as well.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Is voltage drop worse with aluminum wire?</h3>
              <p className={P}>
                Yes: <Num v={AL_TO_CU} src={RCALC} format={{ fixed: 3 }} /> times the drop of copper of the same size, from the two metals&apos;
                resistivities. Aluminum makes it up with larger sizes.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Why does the conductor temperature matter?</h3>
              <p className={P}>
                Copper&apos;s resistance rises with temperature, <Val v={RISE_75} unit="%" src={RCALC} format={{ fixed: 1 }} /> from{' '}
                <Val v={20} unit="°C" src={RES} /> to <Val v={75} unit="°C" src={AMP} />, and the drop rises with it. A conductor carrying close
                to its rated current runs warm, which is why the calculator starts at <Val v={75} unit="°C" src={AMP} />.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[RES, GEO, AMP, NOTE, VOLTS, POWER]}
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
