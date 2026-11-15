import type { Metadata } from 'next';
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
import { HorsepowerTool } from '@/components/calculators/HorsepowerTool';
import { HpRatioBars } from '@/components/look/Charts';
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
import { ENGINE_ID, hpText, voltageColumns } from '@/lib/calculations/motor-flc';
import type { ToolPhase } from '@/lib/calculations/motor-flc';
import { W_PER_ELECTRICAL_HP } from '@/lib/calculations/conversions';
import { articleDates } from '@/lib/page-dates';
import { DC_10, EXAMPLE, EXAMPLE_115, FIVE_208, FIVE_460, RATIO_ROWS, THREE_1, THREE_500, THREE_HALF } from '@/lib/hp-page';
import { flcTable } from '@/lib/verified/nec-430-440-2023';

// /calculators/horsepower-to-amps-calculator (WSZ-011; spec: research/page-specs-held.md "WSZ-011"; data gate BUILD on
// nec-430-flc; withdrawn in WSZ-002, back as a new page): a motor's full-load current read from NEC Tables 430.247,
// 430.248 and 430.250 (induction), as 430.6(A) requires, never from a formula. The current of the rated power alone
// (hp × 746 W ÷ V) is shown only as a comparison. No conductor, overload or breaker output: 430.22, 430.32 and the rest
// of Article 430's sizing rules are unverified (nec-430-motors GAP, nec-430-440-2023.json notes). Synchronous motors,
// Table 430.250's power factor footnote and the two-phase Table 430.249 stay off the page.
const ROUTE = '/calculators/horsepower-to-amps-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'HP to Amps Calculator: Motor Full-Load Current, NEC Tables';
const DESCRIPTION =
  'Full-load amps of a single-phase, three-phase or DC motor by horsepower and voltage, read from NEC Tables 430.247, 430.248 and 430.250 as 430.6(A) requires.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const FLC = 'nec-430-flc';
const EXC = 'nec-2023-rule-excerpts';
const NIST = 'nist-sp811-conversions';
const DOE = 'doe-motor-load-efficiency';
const PFC = 'doe-power-factor-cost';
const EIA = 'eia-power-glossary';
const NOMINAL = 'us-nominal-voltages';
const CALC = `calc:${ENGINE_ID}`;

const FIRST = RATIO_ROWS[0];
const THREE_ROWS = flcTable('430.250').rows;
const DC_ROWS = flcTable('430.247').rows;
/** The last rating the 115 V three-phase column prints, and the first the 2300 V column prints. */
const LAST_115 = [...THREE_ROWS].reverse().find((r) => r.amps['115'] !== null)?.hp ?? '';
const FIRST_2300 = THREE_ROWS.find((r) => r.amps['2300'] !== null)?.hp ?? '';
const FIVE_230 = FIVE_208.others.find((o) => o.column.column === '230');
const LAST = RATIO_ROWS[RATIO_ROWS.length - 1];
const ONE_PHASE_1 = flcTable('430.248').rows.find((r) => r.hp === '1/2');
const ONE_PHASE_5 = flcTable('430.248').rows.find((r) => r.hp === '5');
const THREE_1_ROW = flcTable('430.250').rows.find((r) => r.hp === '1');

// the facts the copy states, checked when the page builds
if (EXAMPLE.flcA !== 8 || EXAMPLE_115.flcA !== 16 || FIVE_460.flcA !== 7.6 || FIVE_208.flcA !== 16.7) throw new Error('hp page: the golden currents changed');
if (!ONE_PHASE_1 || !ONE_PHASE_5 || !THREE_1_ROW || !FIVE_230 || !LAST_115 || !FIRST_2300) throw new Error('hp page: a row the copy quotes is missing');
const FIVE_230_A = FIVE_230;
if (!flcTable('430.248').rows.every((r) => r.amps['115'] === 2 * (r.amps['230'] as number))) throw new Error('hp page: the 115 V current is no longer twice the 230 V current');
if (!RATIO_ROWS.every((r, k) => k === 0 || r.ratio < RATIO_ROWS[k - 1].ratio)) throw new Error('hp page: the 230 V ratios no longer fall row by row');
if (THREE_HALF.hp !== THREE_ROWS[0].hp || THREE_500.hp !== THREE_ROWS[THREE_ROWS.length - 1].hp || !((THREE_HALF.ratio as number) > (THREE_500.ratio as number))) {
  throw new Error('hp page: the 460 V ends no longer match the copy');
}

const TOC: ([string, string] | [string, string, string])[] = [
  ['why-tables', 'Table current, not a formula'],
  ['single-phase', 'Single-phase motors: Table 430.248'],
  ['three-phase', 'Three-phase motors: Table 430.250'],
  ['dc', 'DC motors: Table 430.247'],
  ['columns', 'Which voltage column'],
  ['nameplate', 'Nameplate current and motor circuits'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Horsepower to Amps Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Horsepower to Amps Calculator', url: URL, description: DESCRIPTION };

/** One full-load current table as printed, a dash where it prints no current. */
function FlcTable({ phase, id, caption, maxWidth }: { phase: ToolPhase; id: string; caption: string; maxWidth: string }) {
  const table = phase === 'dc' ? '430.247' : phase === '1' ? '430.248' : '430.250';
  const { rows } = flcTable(table);
  const columns = voltageColumns(phase);
  return (
    <DataTable id={id} variant="ruled" src={FLC} caption={caption} className={maxWidth}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Motor
          </th>
          {columns.map((c) => (
            <th key={c.column} scope="col" className={RTH}>
              <Val v={c.volts} unit="V" src={FLC} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.hp}>
            <th scope="row" className={clsx(RSTICKY_TD, '!font-normal')}>
              {hpText(r.hp)} hp
            </th>
            {columns.map((c) => {
              const a = r.amps[c.column];
              return (
                <td key={c.column} className={RTD}>
                  {a === null ? <span aria-label="no current in the table">–</span> : <Val v={a} unit="A" src={FLC} />}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function HorsepowerToAmpsPage() {
  const ac = voltageColumns('3');
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Horsepower to Amps Calculator" sub="Motor Full-Load Current From the NEC Tables" joiner=": " src={FLC} />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            A motor&apos;s full-load current by horsepower and voltage, read from the NEC&apos;s motor tables as 430.6(A) requires, never from a
            formula.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <HorsepowerTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={FLC}>
            <strong>
              A {hpText(EXAMPLE.hp)} hp single-phase motor draws <Val v={EXAMPLE.flcA as number} unit="A" src={FLC} /> at{' '}
              <Val v={EXAMPLE.column.volts} unit="V" src={FLC} /> and <Val v={EXAMPLE_115.flcA as number} unit="A" src={FLC} /> at{' '}
              <Val v={EXAMPLE_115.column.volts} unit="V" src={FLC} /> by NEC Table 430.248.
            </strong>{' '}
            A {hpText(FIVE_460.hp)} hp three-phase motor draws <Val v={FIVE_460.flcA as number} unit="A" src={FLC} /> at{' '}
            <Val v={FIVE_460.column.volts} unit="V" src={FLC} /> (Table 430.250).{' '}
            <span data-src={EXC}>
              The NEC sizes a motor&apos;s conductors and short-circuit protection from these table currents, not from the nameplate (430.6(A)).
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="why-tables" className="space-y-5">
            <h2 id="why-tables" className={H2}>
              Table current, not a formula
            </h2>
            <p className={P} data-src={CALC}>
              <span data-src={NIST}>
                One horsepower is <Val v={W_PER_ELECTRICAL_HP} unit="W" src={NIST} />, the electric horsepower in NIST&apos;s conversion tables.
              </span>{' '}
              At <Val v={EXAMPLE.column.volts} unit="V" src={FLC} />, that power alone would draw <Val v={EXAMPLE.powerAmps} unit="A" src={CALC} format={{ upTo: 2 }} />;{' '}
              <span data-src={FLC}>
                Table 430.248 gives a {hpText(EXAMPLE.hp)} hp motor <Val v={EXAMPLE.flcA as number} unit="A" src={FLC} />
              </span>
              , <Num v={EXAMPLE.ratio as number} src={CALC} format={{ upTo: 2 }} /> times as much.
            </p>
            <p className={P} data-src={DOE}>
              The U.S. Department of Energy&apos;s motor fact sheets explain the gap. A motor of a given horsepower is expected to deliver that power
              in mechanical form, and it takes in more than it delivers: its efficiency is its useful power output over its total power input.{' '}
              <span data-src={PFC}>
                A motor is also an inductive load, a cause of low power factor, and a low power factor raises the current for the same power.
              </span>
            </p>
            <p className={P} data-src={CALC}>
              The gap is widest on small motors. In Table 430.248&apos;s <Val v={EXAMPLE.column.volts} unit="V" src={FLC} /> column it falls row by row
              from <Num v={FIRST.ratio} src={CALC} format={{ upTo: 2 }} /> times at {hpText(FIRST.hp)} hp to{' '}
              <Num v={LAST.ratio} src={CALC} format={{ upTo: 2 }} /> times at {hpText(LAST.hp)} hp. In Table 430.250&apos;s{' '}
              <Val v={THREE_HALF.column.volts} unit="V" src={FLC} /> column it is <Num v={THREE_HALF.ratio as number} src={CALC} format={{ upTo: 2 }} /> times
              at {hpText(THREE_HALF.hp)} hp and <Num v={THREE_500.ratio as number} src={CALC} format={{ upTo: 2 }} /> times at {hpText(THREE_500.hp)} hp.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    Each single-phase rating in the <Val v={EXAMPLE.column.volts} unit="V" src={FLC} /> column: the table&apos;s full-load current over
                    the current of the rated power alone. The dashed line marks the two as equal.
                  </span>
                  <SourceLine domains={[FLC, NIST]} />
                </>
              }
            >
              <HpRatioBars />
            </Figure>
          </section>

          <section aria-labelledby="single-phase" className="space-y-5">
            <h2 id="single-phase" className={H2}>
              Single-phase motors: Table 430.248
            </h2>
            <p className={P} data-src={FLC}>
              Single-phase AC motors from {hpText(FIRST.hp)} hp to {hpText(LAST.hp)} hp. In every row the{' '}
              <Val v={EXAMPLE_115.column.volts} unit="V" src={FLC} /> current is twice the <Val v={EXAMPLE.column.volts} unit="V" src={FLC} /> current.
            </p>
            <FlcTable phase="1" id="table-430-248" caption="NEC 2023 Table 430.248, full-load current" maxWidth="max-w-[34rem]" />
            <SourceLine domains={[FLC]} />
          </section>

          <section aria-labelledby="three-phase" className="space-y-5">
            <h2 id="three-phase" className={H2}>
              Three-phase motors: Table 430.250
            </h2>
            <p className={P} data-src={FLC}>
              Induction motors from {hpText(THREE_ROWS[0].hp)} hp to {hpText(THREE_500.hp)} hp. A dash marks a voltage the table gives no current
              for: the <Val v={ac[0].volts} unit="V" src={FLC} /> column stops at {hpText(LAST_115)} hp, and the{' '}
              <Val v={ac[ac.length - 1].volts} unit="V" src={FLC} /> column starts at {hpText(FIRST_2300)} hp. The table also lists synchronous motors;
              this page and the calculator give the induction motor currents.
            </p>
            <FlcTable phase="3" id="table-430-250" caption="NEC 2023 Table 430.250, induction motors, full-load current" maxWidth="max-w-[46rem]" />
            <SourceLine domains={[FLC]} />
          </section>

          <section aria-labelledby="dc" className="space-y-5">
            <h2 id="dc" className={H2}>
              DC motors: Table 430.247
            </h2>
            <p className={P} data-src={FLC}>
              DC motors from {hpText(DC_ROWS[0].hp)} hp to {hpText(DC_ROWS[DC_ROWS.length - 1].hp)} hp, by rated voltage.{' '}
              <span data-src={EIA}>
                DC has no power factor (on DC one volt-ampere is one watt), so the gap to the rated power is the motor&apos;s efficiency alone:
              </span>{' '}
              <span data-src={CALC}>
                a {hpText(DC_10.hp)} hp motor at <Val v={DC_10.column.volts} unit="V" src={FLC} /> is <Val v={DC_10.flcA as number} unit="A" src={FLC} />{' '}
                in the table against <Val v={DC_10.powerAmps} unit="A" src={CALC} format={{ upTo: 2 }} /> for the power alone.
              </span>
            </p>
            <FlcTable phase="dc" id="table-430-247" caption="NEC 2023 Table 430.247, full-load current" maxWidth="max-w-[42rem]" />
            <SourceLine domains={[FLC, EIA]} />
          </section>

          <section aria-labelledby="columns" className="space-y-5">
            <h2 id="columns" className={H2}>
              Which voltage column
            </h2>
            <p className={P} data-src={FLC}>
              The columns are rated motor voltages. The tables&apos; notes give the column for each system voltage, which is what the calculator asks
              for; Table 430.248 has the first four:
            </p>
            <DataTable id="voltage-columns" variant="ruled" src={FLC} caption="System voltage and the table column it takes" className="max-w-[24rem]">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    System
                  </th>
                  <th scope="col" className={RTH}>
                    Column
                  </th>
                </tr>
              </thead>
              <tbody>
                {ac.map((c) => (
                  <tr key={c.column}>
                    <th scope="row" className={clsx(RSTICKY_TD, '!font-normal')}>
                      {c.min === c.max ? (
                        <Val v={c.volts} unit="V" src={FLC} />
                      ) : (
                        <>
                          <Num v={c.min} src={FLC} />–<Val v={c.max} unit="V" src={FLC} />
                        </>
                      )}
                    </th>
                    <td className={RTD}>
                      <Val v={c.volts} unit="V" src={FLC} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className={P} data-src={FLC}>
              <Val v={FIVE_208.column.volts} unit="V" src={FLC} /> is not <Val v={FIVE_230_A.column.volts} unit="V" src={FLC} />: a{' '}
              {hpText(FIVE_208.hp)} hp three-phase motor is <Val v={FIVE_208.flcA as number} unit="A" src={FLC} /> in the{' '}
              <Val v={FIVE_208.column.volts} unit="V" src={FLC} /> column and <Val v={FIVE_230_A.flcA} unit="A" src={FLC} /> in the{' '}
              <Val v={FIVE_230_A.column.volts} unit="V" src={FLC} /> column.{' '}
              <span data-src={NOMINAL}>
                A house&apos;s 120/240 V supply is single-phase in ANSI C84.1&apos;s list of system voltages, as North Carolina&apos;s rule R8-17
                prints it,
              </span>{' '}
              so a <Val v={240} unit="V" src={NOMINAL} /> motor there reads Table 430.248. Table 430.249 is for two-phase motors, a different
              system, and the calculator leaves it out.
            </p>
            <SourceLine domains={[FLC, NOMINAL]} />
          </section>

          <section aria-labelledby="nameplate" className="space-y-5">
            <h2 id="nameplate" className={H2}>
              Nameplate current and motor circuits
            </h2>
            <p className={P} data-src={EXC}>
              430.6(A) takes the table values, instead of the current marked on the motor&apos;s nameplate, for the conductors&apos; ampacity, the
              switch ratings and the branch-circuit short-circuit and ground-fault protection. Separate overload protection follows the nameplate
              current, and the rule uses the nameplate current for low-speed, high-torque and multispeed motors too.
            </p>
            <p className={P}>
              This site does not size motor conductors, overload protection or the breaker or fuse yet: the NEC&apos;s rules for them are still
              being checked against the 2023 text, so the calculator stops at the current (
              <Link href="/methodology#not-covered" className={LINK}>
                not covered yet
              </Link>
              ). For a motor&apos;s measured power, the{' '}
              <Link href="/calculators/kilowatts-to-amps-calculator" className={LINK}>
                kilowatts to amps calculator
              </Link>{' '}
              and the{' '}
              <Link href="/calculators/three-phase-calculator" className={LINK}>
                three phase calculator
              </Link>{' '}
              convert with its power factor.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={FLC}>
                How many amps does a 1 hp motor draw?
              </h3>
              <p className={P} data-src={FLC}>
                Single-phase: <Val v={EXAMPLE_115.flcA as number} unit="A" src={FLC} /> at <Val v={EXAMPLE_115.column.volts} unit="V" src={FLC} /> and{' '}
                <Val v={EXAMPLE.flcA as number} unit="A" src={FLC} /> at <Val v={EXAMPLE.column.volts} unit="V" src={FLC} /> (Table 430.248).
                Three-phase: <Val v={THREE_1_ROW?.amps['230'] as number} unit="A" src={FLC} /> at <Val v={230} unit="V" src={FLC} /> and{' '}
                <Val v={THREE_1.flcA as number} unit="A" src={FLC} /> at <Val v={THREE_1.column.volts} unit="V" src={FLC} /> (Table 430.250). A{' '}
                {hpText('1/2')} hp single-phase motor: <Val v={ONE_PHASE_1?.amps['115'] as number} unit="A" src={FLC} /> at{' '}
                <Val v={115} unit="V" src={FLC} /> and <Val v={ONE_PHASE_1?.amps['230'] as number} unit="A" src={FLC} /> at{' '}
                <Val v={230} unit="V" src={FLC} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={FLC}>
                How many amps is a 5 hp motor?
              </h3>
              <p className={P} data-src={FLC}>
                Single-phase at <Val v={230} unit="V" src={FLC} />: <Val v={ONE_PHASE_5?.amps['230'] as number} unit="A" src={FLC} />. Three-phase:{' '}
                <Val v={FIVE_230_A.flcA} unit="A" src={FLC} /> at <Val v={FIVE_230_A.column.volts} unit="V" src={FLC} />,{' '}
                <Val v={FIVE_208.flcA as number} unit="A" src={FLC} /> at <Val v={208} unit="V" src={FLC} /> and{' '}
                <Val v={FIVE_460.flcA as number} unit="A" src={FLC} /> at <Val v={FIVE_460.column.volts} unit="V" src={FLC} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What is the formula for horsepower to amps?</h3>
              <p className={P} data-src={DOE}>
                With the full-load efficiency and power factor from the motor&apos;s nameplate data: amps = hp × <Num v={W_PER_ELECTRICAL_HP} src={NIST} />{' '}
                ÷ (volts × efficiency × power factor), divided by √3 more on three-phase. Without them it gives the current of the rated power alone,
                below the table&apos;s. <span data-src={EXC}>For a motor circuit, 430.6(A) takes the table current instead.</span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={NOMINAL}>
                Is 240 V single-phase or two-phase?
              </h3>
              <p className={P} data-src={NOMINAL}>
                Single-phase: 120/240 V is a single-phase system in ANSI C84.1&apos;s list (North Carolina rule R8-17). A{' '}
                <Val v={240} unit="V" src={NOMINAL} /> motor in a house reads the <Val v={230} unit="V" src={FLC} /> column of Table 430.248, not
                the two-phase Table 430.249.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Nameplate amps or table amps?</h3>
              <p className={P} data-src={EXC}>
                Both, for different parts of the circuit. 430.6(A) takes the table current for the conductors, the switches and the short-circuit
                and ground-fault protection, and the nameplate current for separate overload protection.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What size wire does a motor need?</h3>
              <p className={P}>
                The table current is where that sizing starts, but this site does not yet turn it into a wire size or a breaker: the NEC&apos;s rules
                for motor conductors and protection are still being checked against the 2023 text.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[FLC, EXC, NIST, DOE, PFC, EIA, NOMINAL]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#hp-method" className={LINK}>
                methodology page
              </Link>{' '}
              sets out each step and each source. NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the National Fire
              Protection Association; wiresizes.com is not affiliated with or endorsed by NFPA.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
