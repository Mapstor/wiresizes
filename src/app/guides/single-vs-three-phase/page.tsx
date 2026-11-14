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
import { CompareCurrentBars, PhasePowerChart } from '@/components/look/Charts';
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
import { SQRT3, TP_WYE_SYSTEMS } from '@/lib/calculations/power';
import { articleDates } from '@/lib/page-dates';
import { COMPARE_KW, COMPARE_ROWS, assertPowerGuideVolts } from '@/lib/power-guides';
import type { CompareRow } from '@/lib/power-guides';
import { NOMINAL_SINGLE_PHASE, NOMINAL_THREE_PHASE } from '@/lib/verified/us-nominal-voltages';

// /guides/single-vs-three-phase (WSZ-007a; spec: research/page-specs.md "WSZ-007"): what differs between single-phase and
// three-phase power. The comparison is the golden "10 kW at 240 V single-phase / 208 V and 480 V three-phase, PF 1" cases
// (src/lib/power-guides.ts); the reasons for three-phase, the power over a cycle, wye and delta and the line-to-neutral
// relation are MIT's polyphase notes (mit-polyphase-networks coverage); the voltages are NCUC Rule R8-17's list; the
// formulas are the EIA Glossary's and the DOE motor sheet's. Every number goes through Val/Num with its source.
const ROUTE = '/guides/single-vs-three-phase';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Single Phase vs Three Phase: One AC Voltage or Three';
const DESCRIPTION =
  'Single-phase power comes on one AC voltage, three-phase on three, 120° apart: steady power and less current per line. US voltages compared.';

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

const MIT = 'mit-polyphase-networks';
const DOE = 'doe-motor-load-efficiency';
const EIA = 'eia-power-glossary';
const VOLTS = 'us-nominal-voltages';
const SVC = 'nec-310-12';
const CALC = 'calc:power';
const SIG = { sig: 4 };

assertPowerGuideVolts('single-vs-three-phase guide');
const [SINGLE_240, THREE_208, THREE_480] = COMPARE_ROWS;
const [WYE_208, WYE_480] = TP_WYE_SYSTEMS;
const SPLIT = NOMINAL_SINGLE_PHASE.find((s) => s.includes('/'));
if (!SPLIT) throw new Error('single-vs-three-phase: us-nominal-voltages has no split single-phase system');
const [SPLIT_LOW, SPLIT_HIGH] = SPLIT.split('/').map(Number);
/** The registry's plain 240 V three-phase system, named in the 208 V question. */
const PLAIN_240 = Number(NOMINAL_THREE_PHASE.find((s) => s === String(SPLIT_HIGH)));
if (!PLAIN_240) throw new Error('single-vs-three-phase: us-nominal-voltages has no plain 240 V three-phase system');
if (SINGLE_240.volts !== SPLIT_HIGH) throw new Error('single-vs-three-phase: the comparison is not at the split system’s 240 V');

const TOC: ([string, string] | [string, string, string])[] = [
  ['how', 'How each one works'],
  ['same-load', 'The same load on each', CALC],
  ['why', 'Why three-phase carries power better'],
  ['voltages', 'US voltages for each'],
  ['single-loads', 'Single-phase loads on a three-phase supply'],
  ['formulas', 'The formulas'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Single Phase vs Three Phase', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

/** "208Y/120 V" from a wye system, its numbers traced to the registry. */
function Wye({ w }: { w: { lineVolts: number; neutralVolts: number } }) {
  return (
    <span data-src={VOLTS}>
      {w.lineVolts}Y/{w.neutralVolts} V
    </span>
  );
}

/** "120/240 V", the split single-phase system. */
function Split() {
  return (
    <span data-src={VOLTS}>
      {SPLIT_LOW}/{SPLIT_HIGH} V
    </span>
  );
}

/** A list of system names with "and": "208Y/120, 240/120 and 600". */
function names(list: string[]) {
  return list.map((s, k) => (
    <span key={s}>
      {k > 0 && (k === list.length - 1 ? ' and ' : ', ')}
      {s}
    </span>
  ));
}

function Amps({ r }: { r: CompareRow }) {
  return <Val v={r.amps} unit="A" src={CALC} format={SIG} />;
}

export default function SingleVsThreePhasePage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Single Phase vs Three Phase" sub="One AC Voltage or Three" joiner=": " />
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
          <div className="space-y-4">
            <p className={LOOK_LEAD} data-src={MIT}>
              <strong>
                Single-phase power arrives on one alternating voltage; three-phase on three, each a third of a cycle (
                <Num v={120} src={MIT} />
                °) behind the one before.
              </strong>{' '}
              Single-phase power pulses twice in every cycle. A balanced three-phase load takes power at a constant rate, and at the same
              voltage it draws less current in each line.
            </p>
            <p className={P} data-src={CALC}>
              A <Val v={COMPARE_KW} unit="kW" src={CALC} /> load draws <Amps r={SINGLE_240} /> at{' '}
              <Val v={SINGLE_240.volts} unit="V" src={VOLTS} /> single-phase, <Amps r={THREE_208} /> per line at{' '}
              <Val v={THREE_208.volts} unit="V" src={VOLTS} /> three-phase and <Amps r={THREE_480} /> at{' '}
              <Val v={THREE_480.volts} unit="V" src={VOLTS} />.
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={MIT}>
                  Power delivered over one cycle by a single-phase load and by a balanced three-phase load of the same average power, at power
                  factor <Num v={1} src={MIT} />. Single-phase falls to zero twice a cycle; the three phases add up to a constant.
                </span>
                <SourceLine domains={[MIT]} />
              </>
            }
          >
            <PhasePowerChart />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="how" className="space-y-4">
            <h2 id="how" className={H2}>
              How each one works
            </h2>
            <p className={P} data-src={MIT}>
              <strong>Single-phase</strong> power comes from one alternating voltage. The power a load takes from it pulses at twice the supply
              frequency; at power factor <Num v={1} src={MIT} /> it falls to zero twice in each cycle, and the load uses the average.
            </p>
            <p className={P} data-src={MIT}>
              <strong>Three-phase</strong> power comes from three alternating voltages of the same size, <Num v={120} src={MIT} />° apart. Each
              phase still pulses, but at different moments, and in a balanced load the three add up to a constant. A <strong>wye</strong>{' '}
              connection has a neutral point, where the three phases meet, so it can have four terminals; a <strong>delta</strong> connection
              has three.
            </p>
            <p className={P} data-src={MIT}>
              A wye system therefore has two voltages: between two lines, and from each line to the neutral, smaller by a factor of √3. On a{' '}
              <Wye w={WYE_208} /> system they are <Val v={WYE_208.lineVolts} unit="V" src={VOLTS} /> and{' '}
              <Val v={WYE_208.neutralVolts} unit="V" src={VOLTS} />.
            </p>
          </section>

          <section aria-labelledby="same-load" className="space-y-5">
            <h2 id="same-load" className={H2} data-src={CALC}>
              The same load on each
            </h2>
            <p className={P} data-src={CALC}>
              One <Val v={COMPARE_KW} unit="kW" src={CALC} /> load at power factor <Num v={1} src={CALC} /> on three of the nominal systems below.
              Three-phase shares the load among three lines, and a higher voltage needs less current for the same power.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    Current in each line for <Val v={COMPARE_KW} unit="kW" src={CALC} /> at power factor <Num v={1} src={CALC} />.
                  </span>
                  <SourceLine domains={[EIA, DOE, VOLTS]} />
                </>
              }
            >
              <CompareCurrentBars />
            </Figure>
            <DataTable
              id="same-load-table"
              variant="ruled"
              src={CALC}
              caption={
                <>
                  <Val v={COMPARE_KW} unit="kW" src={CALC} /> at power factor <Num v={1} src={CALC} />, by system
                </>
              }
            >
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    System
                  </th>
                  <th scope="col" className={RTH}>
                    Formula
                  </th>
                  <th scope="col" className={RTH}>
                    Current per line
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((r) => (
                  <tr key={r.key}>
                    <th scope="row" className={RSTICKY_TD}>
                      <Val v={r.volts} unit="V" src={VOLTS} /> {r.phases === 1 ? 'single-phase' : 'three-phase'}
                    </th>
                    <td className={RTD}>{r.phases === 1 ? 'I = P ÷ (V × PF)' : 'I = P ÷ (√3 × V × PF)'}</td>
                    <td className={RTD}>
                      <Amps r={r} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className={P} data-src={CALC}>
              At <Val v={THREE_480.volts} unit="V" src={VOLTS} /> three-phase the current is less than a third of the{' '}
              <Val v={SINGLE_240.volts} unit="V" src={VOLTS} /> single-phase figure: twice the voltage, times √3 for the three phases. Less
              current lets a smaller conductor carry the load, which the{' '}
              <Link href="/calculators/wire-size-calculator" className={LINK}>
                wire size calculator
              </Link>{' '}
              works out, and drops less voltage over the same run, which the{' '}
              <Link href="/calculators/voltage-drop-calculator" className={LINK}>
                voltage drop calculator
              </Link>{' '}
              finds for either system.
            </p>
          </section>

          <section aria-labelledby="why" className="space-y-4">
            <h2 id="why" className={H2}>
              Why three-phase carries power better
            </h2>
            <p className={P} data-src={MIT}>
              MIT&apos;s course notes on electric power systems give two major reasons for three-phase power:{' '}
              <strong>economical use of conductors</strong> and <strong>nearly constant power flow</strong>.
            </p>
            <ul className="max-w-[35rem] list-disc space-y-2 pl-6 text-[17px] leading-[1.65] text-ink marker:text-cut-line" data-src={MIT}>
              <li>
                Single-phase power pulses at twice the supply frequency. A balanced three-phase load takes the same power at every instant, as the
                chart at the top shows.
              </li>
              <li>
                In a balanced load the three currents cancel at the neutral, so the neutral current is zero.{' '}
                <span data-src={CALC}>
                  At the same voltage, each line carries 1/√3 of the current a single-phase circuit would for the same load.
                </span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="voltages" className="space-y-4">
            <h2 id="voltages" className={H2}>
              US voltages for each
            </h2>
            <p className={P} data-src={VOLTS}>
              North Carolina Utilities Commission Rule R8-17 has utilities use a nominal voltage from ANSI C84.1, the national standard for
              system voltages, and lists them. At the low voltages buildings use, single-phase systems are {names(NOMINAL_SINGLE_PHASE)} V;
              three-phase systems are {names(NOMINAL_THREE_PHASE)} V. A name like <Wye w={WYE_480} /> gives both voltages of a wye system,
              between lines and then to neutral, and the rule&apos;s note calls <Wye w={WYE_208} /> a three-phase, four-wire system.
            </p>
            <p className={P} data-src={SVC}>
              The NEC sizes the <Split /> single-phase service or main power feeder of one dwelling unit from a table of its own, Table 310.12,
              which the{' '}
              <Link href="/guides/nec-table-310-16#dwellings" className={LINK}>
                Table 310.16 guide
              </Link>{' '}
              covers.
            </p>
          </section>

          <section aria-labelledby="single-loads" className="space-y-4">
            <h2 id="single-loads" className={H2}>
              Single-phase loads on a three-phase supply
            </h2>
            <p className={P} data-src={MIT}>
              A three-phase supply also feeds single-phase loads, connected between two lines or from one line to the neutral. On a{' '}
              <Wye w={WYE_208} /> system that is <Val v={WYE_208.lineVolts} unit="V" src={VOLTS} /> or{' '}
              <Val v={WYE_208.neutralVolts} unit="V" src={VOLTS} />; on <Wye w={WYE_480} />,{' '}
              <Val v={WYE_480.lineVolts} unit="V" src={VOLTS} /> or <Val v={WYE_480.neutralVolts} unit="V" src={VOLTS} />. Sharing such loads
              evenly among the three phases keeps the load balanced and the neutral current low.
            </p>
          </section>

          <section aria-labelledby="formulas" className="space-y-4">
            <h2 id="formulas" className={H2}>
              The formulas
            </h2>
            <p className={P} data-src={EIA}>
              P is the real power in watts, V the voltage, I the current and PF the power factor, real power divided by apparent power:
            </p>
            <p className={LOOK_FORMULA} data-src={EIA}>
              Single-phase: P = V × I × PF
            </p>
            <p className={LOOK_FORMULA} data-src={DOE}>
              Three-phase: P = √3 × V × I × PF
            </p>
            <p className={P} data-src={DOE}>
              On three-phase, V is the voltage between two lines and I the current in one line. The U.S. Department of Energy&apos;s motor fact
              sheet uses the same formula, divided by <Num v={1000} src={CALC} /> for kilowatts. √3 is about{' '}
              <Num v={SQRT3} src={CALC} format={SIG} />. The{' '}
              <Link href="/calculators/three-phase-calculator" className={LINK}>
                three-phase calculator
              </Link>{' '}
              solves it from any two of real power, apparent power, current and power factor.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>Is three-phase more efficient than single-phase?</h3>
              <p className={P} data-src={MIT}>
                It moves power with less conductor: MIT&apos;s notes give economical use of conductors and nearly constant power flow as the two
                major reasons for three-phase power. At the same voltage, the same load draws less current in each line, so it can use smaller
                wire or lose less voltage.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                Why is three-phase <Val v={WYE_208.lineVolts} unit="V" src={VOLTS} /> and not <Val v={PLAIN_240} unit="V" src={VOLTS} />?
              </h3>
              <p className={P} data-src={MIT}>
                On a <Wye w={WYE_208} /> system each line is <Val v={WYE_208.neutralVolts} unit="V" src={VOLTS} /> from the neutral, and the
                voltage between two lines is √3 times that: <Val v={WYE_208.neutralVolts * SQRT3} unit="V" src={CALC} format={SIG} />, named{' '}
                <Val v={WYE_208.lineVolts} unit="V" src={VOLTS} />. A <Val v={PLAIN_240} unit="V" src={VOLTS} /> three-phase system is a different
                system in the same list.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                How much current does <Val v={COMPARE_KW} unit="kW" src={CALC} /> draw on single-phase and three-phase?
              </h3>
              <p className={P} data-src={CALC}>
                At power factor <Num v={1} src={CALC} />: <Amps r={SINGLE_240} /> at <Val v={SINGLE_240.volts} unit="V" src={VOLTS} />{' '}
                single-phase, <Amps r={THREE_208} /> at <Val v={THREE_208.volts} unit="V" src={VOLTS} /> three-phase and{' '}
                <Amps r={THREE_480} /> at <Val v={THREE_480.volts} unit="V" src={VOLTS} /> three-phase.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Can a single-phase appliance run on three-phase power?</h3>
              <p className={P} data-src={MIT}>
                Yes. Single-phase loads connect between two lines or, on a wye system, from one line to the neutral. On{' '}
                <Wye w={WYE_208} /> that gives <Val v={WYE_208.lineVolts} unit="V" src={VOLTS} /> or{' '}
                <Val v={WYE_208.neutralVolts} unit="V" src={VOLTS} />, and the appliance must be rated for the voltage it gets.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What voltages does three-phase power come in?</h3>
              <p className={P} data-src={VOLTS}>
                At building voltages in the US: {names(NOMINAL_THREE_PHASE)} V, the nominal systems of ANSI C84.1 as North Carolina&apos;s rule
                lists them. The utility can tell you which one serves a building.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[MIT, DOE, EIA, VOLTS, SVC]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#line-voltages" className={LINK}>
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
