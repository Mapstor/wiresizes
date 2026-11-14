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
import { WireResistanceTool } from '@/components/calculators/WireResistanceTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { ResistanceChart, TemperatureChart } from '@/components/look/Charts';
import { OnThisPage } from '@/components/look/OnThisPage';
import { PageTitle } from '@/components/look/PageTitle';
import { RunBars } from '@/components/look/RunBars';
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
import { areaRatio } from '@/lib/calculations/awg-geometry';
import {
  ALUMINUM_ALPHA,
  COPPER_ALPHA,
  ENGINE_ID,
  atTemperature,
  equivalentSize,
  ohmsPerKm,
  resistanceAt,
  resistanceRun,
  resistanceSig,
} from '@/lib/calculations/resistance';
import { articleDates } from '@/lib/page-dates';
import { AWG_CONSTANTS, AWG_TABLE, areaCmil, conductor, sizeKeyFromAwgName } from '@/lib/verified/awg';
import type { SizeKey } from '@/lib/verified/awg';
import { TABLE_310_16_SIZES } from '@/lib/verified/nec-310-16';

// /calculators/wire-resistance-calculator (WSZ-006 PHYSICS; spec: research/page-specs.md "WSZ-006"): the calculator in
// the look (D-33), every number from the resistance engine or awg.json with its source in data-src. Copper R20 from
// NIST Handbook 100 (kcmil calculated), aluminum EC-H19 from Handbook 109's resistivity, R(T) = R20 × (1 + α(T − 20 °C)).
// Worked example = golden case "14 AWG copper at 75 °C"; the typical-values tables come from the same engine.
const ROUTE = '/calculators/wire-resistance-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Wire Resistance Calculator: Ohms per 1,000 ft and per km';
const DESCRIPTION =
  'Resistance of copper or aluminum wire from 40 AWG to 2000 kcmil for your length and temperature, from NIST’s copper wire tables, with the method shown.';

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
const CALC = `calc:${ENGINE_ID}`;
const GCALC = 'calc:awg-geometry';
const SIG4 = { sig: 4 } as const;

const r20 = (key: SizeKey) => (conductor(key) as NonNullable<ReturnType<typeof conductor>>).r20Cu;
const FACTOR_75_CU = atTemperature(1, 'Cu', 75);
const FACTOR_75_AL = atTemperature(1, 'Al', 75);
const AL_TO_CU = AWG_CONSTANTS.aluminum_ECH19_resistivity_ohm_cmil_per_ft_20C / AWG_CONSTANTS.copper_resistivity_ohm_cmil_per_ft_20C;
const AL_FOR_12 = equivalentSize('12', 'Cu', 'Al') as SizeKey;
const EXAMPLE = resistanceRun('14', 'Cu', 100, 75) as NonNullable<ReturnType<typeof resistanceRun>>;
const STEP = areaRatio(1);
/** °F from °C, for the parenthetical at a temperature's first mention. */
const cToF = (c: number) => (c * 9) / 5 + 32;
/** The significant figures of 14 AWG and 12 AWG copper as NIST prints them, for values calculated from them. */
const EX = { sig: EXAMPLE.sig };
const SIG12 = { sig: resistanceSig('12', 'Cu') };

/** Building wire, 14 AWG to 4/0: Table 310.16's sizes in that range. */
const BUILDING = TABLE_310_16_SIZES.slice(TABLE_310_16_SIZES.indexOf('14'), TABLE_310_16_SIZES.indexOf('4/0') + 1);
/** Every gauge thinner than 14 AWG, 16 to 40 AWG, thick to thin. */
const SMALL = AWG_TABLE.map((row) => sizeKeyFromAwgName(row.awg)).filter((key) => {
  const n = Number(key);
  return Number.isFinite(n) && n >= 16;
});

const TOC: [string, string][] = [
  ['read', 'How to read the results'],
  ['example', 'Worked example'],
  ['table', 'Resistance by wire size'],
  ['temperature', 'Temperature'],
  ['aluminum', 'Copper or aluminum'],
  ['formula', 'How it is calculated'],
  ['stranded', 'Solid and stranded wire'],
  ['uses', 'When you would use it'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Wire Resistance Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Wire Resistance Calculator', url: URL, description: DESCRIPTION };

/** A stat callout: one figure in Azeret Mono at the headline size, what it is, and its source, under a 2 px ink rule. */
function Stat({ figure, text, domains, prefix }: { figure: ReactNode; text: ReactNode; domains: string[]; prefix?: string }) {
  return (
    <aside className="max-w-[35rem] border-t-2 border-ink pt-3" aria-label="Key figure">
      <p className="font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]">
        {prefix}
        {figure}
      </p>
      <p className="mt-2 text-[15px] leading-[1.55] text-cut-caption">{text}</p>
      <SourceLine domains={domains} />
    </aside>
  );
}

/** A value or the site's "no value" mark (an aria-hidden dash and screen-reader text). */
function Cell({ v, src, sig }: { v: number | null; src: string; sig?: number }) {
  if (v === null) {
    return (
      <>
        <span aria-hidden="true">–</span>
        <span className="sr-only">no value</span>
      </>
    );
  }
  // a published value as awg.json writes it; a calculated one at the significant figures of its source
  return <Num v={v} src={src} format={sig ? { sig } : undefined} />;
}

export default function WireResistanceCalculatorPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Wire Resistance Calculator" sub="Copper and Aluminum, Any Length" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            Choose a wire size, a length and a temperature to get the resistance of the run in ohms, from NIST&apos;s copper wire tables.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <WireResistanceTool />
        </section>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-12">
          <p className={LOOK_LEAD} data-src={RES}>
            <strong>
              Copper wire at <Val v={20} unit="°C" src={RES} /> (<Val v={cToF(20)} unit="°F" src={CALC} />)
            </strong>{' '}
            runs from <Val v={r20('4/0')} unit="Ω" src={GEO} /> per 1,000 ft for <Size s="4/0" /> to{' '}
            <Val v={r20('40')} unit="Ω" src={GEO} /> for <Size s="40" />. Building wire: <Size s="14" /> is <Val v={r20('14')} unit="Ω" src={GEO} />,{' '}
            <Size s="12" /> <Val v={r20('12')} unit="Ω" src={GEO} /> and <Size s="10" /> <Val v={r20('10')} unit="Ω" src={GEO} /> per 1,000 ft. At{' '}
            <Val v={75} unit="°C" src={AMP} /> (<Val v={cToF(75)} unit="°F" src={CALC} />) copper reads{' '}
            <Val v={(FACTOR_75_CU - 1) * 100} unit="%" src={CALC} format={{ fixed: 1 }} /> higher, and aluminum EC-H19 reads{' '}
            <Num v={AL_TO_CU} src={CALC} format={{ fixed: 3 }} /> times copper of the same size.
          </p>
          <Figure
            caption={
              <>
                Each gauge step multiplies the resistance by the same factor, so on a logarithmic scale every gauge falls on one straight line.
                Point at a gauge to read its copper value.
                <SourceLine domains={[GEO, RES]} />
              </>
            }
          >
            <ResistanceChart />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="read" className="space-y-4">
            <h2 id="read" className={H2}>
              How to read the results
            </h2>
            <p className={P}>
              <strong>The large number</strong> is the resistance of one conductor over the length you entered, at your temperature. A cable
              that feeds a load carries the current out on one conductor and back on another, so the result also gives the{' '}
              <strong>two-wire circuit</strong>: the same run counted twice.
            </p>
            <p className={P} data-src={RES}>
              <strong>Per 1,000 ft and per km</strong> are the rates of the size at each temperature; the run is the rate times its length. The
              table shows them at your temperature, at <Val v={20} unit="°C" src={RES} />, the temperature of NIST&apos;s tables, and at{' '}
              <Val v={75} unit="°C" src={AMP} />, one of the conductor temperature ratings in NEC Table 310.16.
            </p>
            <p className={P}>
              <strong>The bars</strong> compare your run in the two sizes thinner and the two thicker. A size entered in mm² is matched to the
              nearest listed size, and the result names it.
            </p>
          </section>

          <section aria-labelledby="example" className="space-y-4">
            <h2 id="example" className={H2}>
              Worked example: <Val v={100} unit="ft" src={CALC} /> of <Size s="14" /> copper at <Val v={75} unit="°C" src={AMP} />
            </h2>
            <p className={P} data-src={CALC}>
              NIST gives <Size s="14" /> copper <Val v={r20('14')} unit="Ω" src={GEO} /> per 1,000 ft at <Val v={20} unit="°C" src={RES} />.
              Warmed to <Val v={75} unit="°C" src={AMP} /> it rises by a factor of <Num v={FACTOR_75_CU} src={CALC} format={{ fixed: 5 }} /> to{' '}
              <Val v={EXAMPLE.perKft} unit="Ω" src={CALC} format={EX} /> per 1,000 ft. One conductor 100 ft long is a tenth of that,{' '}
              <strong>
                <Val v={EXAMPLE.conductor} unit="Ω" src={CALC} format={EX} />
              </strong>
              , and a two-wire circuit 100 ft long, out and back, is{' '}
              <strong>
                <Val v={EXAMPLE.loop} unit="Ω" src={CALC} format={EX} />
              </strong>
              . At room temperature the same run would read <Val v={EXAMPLE.at20.conductor} unit="Ω" src={CALC} format={EX} />.
            </p>
            <figure className="max-w-[40rem] space-y-3">
              <RunBars
                rows={EXAMPLE.neighbours.map((n) => ({ size: n.size, value: n.conductor, format: { sig: n.sig } }))}
                chosen="14"
                material="Cu"
                src={CALC}
                unit="Ω"
                label="One conductor, 100 ft, at 75 °C, in nearby sizes"
              />
              <figcaption className="border-t-2 border-ink pt-3 text-[15px] leading-[1.55] text-cut-caption">
                The same <Val v={100} unit="ft" src={CALC} /> at <Val v={75} unit="°C" src={AMP} /> in the sizes around <Size s="14" />. Moving up to <Size s="12" /> cuts the
                resistance by a factor of <Num v={areaRatio(2)} src={GCALC} format={{ fixed: 3 }} />, two gauge steps of{' '}
                <Num v={STEP} src={GCALC} format={{ fixed: 3 }} />.
              </figcaption>
            </figure>
          </section>

          <section aria-labelledby="table" className="space-y-5">
            <h2 id="table" className={H2} data-src={RES}>
              Resistance per 1,000 ft by wire size
            </h2>
            <p className={P}>
              Copper at <Val v={20} unit="°C" src={RES} /> is NIST Handbook 100&apos;s; the <Val v={75} unit="°C" src={CALC} /> values and
              every aluminum value are calculated from NIST&apos;s constants. Aluminum EC-H19 is listed from <Size s="12" /> up.
            </p>
            <DataTable id="building-table" variant="ruled" src={RES} caption="Building wire, 14 AWG to 4/0: ohms per 1,000 ft, solid conductor">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    AWG
                  </th>
                  <th scope="col" className={RTH}>
                    Copper, <Val v={20} unit="°C" src={RES} />
                  </th>
                  <th scope="col" className={RTH}>
                    Copper, <Val v={75} unit="°C" src={CALC} />
                  </th>
                  <th scope="col" className={RTH}>
                    Aluminum, <Val v={20} unit="°C" src={RES} />
                  </th>
                  <th scope="col" className={RTH}>
                    Aluminum, <Val v={75} unit="°C" src={CALC} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {BUILDING.map((key) => (
                  <tr key={key}>
                    <th scope="row" className={RSTICKY_TD}>
                      <span data-size={key}>{key}</span>
                    </th>
                    <td className={RTD}>
                      <Cell v={r20(key)} src={GEO} />
                    </td>
                    <td className={RTD}>
                      <Cell v={resistanceAt(key, 'Cu', 75)} src={RES} sig={resistanceSig(key, 'Cu')} />
                    </td>
                    <td className={RTD}>
                      <Cell v={resistanceAt(key, 'Al', 20)} src={RES} sig={4} />
                    </td>
                    <td className={RTD}>
                      <Cell v={resistanceAt(key, 'Al', 75)} src={RES} sig={4} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <DataTable id="small-table" variant="ruled" src={GEO} caption="Small gauges, 16 to 40 AWG: copper, ohms per 1,000 ft and per km">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    AWG
                  </th>
                  <th scope="col" className={RTH}>
                    Per 1,000 ft, <Val v={20} unit="°C" src={RES} />
                  </th>
                  <th scope="col" className={RTH}>
                    Per 1,000 ft, <Val v={75} unit="°C" src={CALC} />
                  </th>
                  <th scope="col" className={RTH}>
                    Per km, <Val v={20} unit="°C" src={RES} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {SMALL.map((key) => (
                  <tr key={key}>
                    <th scope="row" className={RSTICKY_TD}>
                      <span data-size={key}>{key}</span>
                    </th>
                    <td className={RTD}>
                      <Cell v={r20(key)} src={GEO} />
                    </td>
                    <td className={RTD}>
                      <Cell v={resistanceAt(key, 'Cu', 75)} src={RES} sig={resistanceSig(key, 'Cu')} />
                    </td>
                    <td className={RTD}>
                      <Cell v={ohmsPerKm(key, 'Cu', 20)} src={GEO} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <SourceLine domains={[GEO, RES]} />
            <p className={P}>
              The kcmil sizes, <Size s="250" /> to <Size s="2000" />, are in the calculator and on the{' '}
              <Link href="/guides/awg-wire-size-chart#kcmil-table" className={LINK}>
                AWG wire size chart
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="temperature" className="space-y-4">
            <h2 id="temperature" className={H2}>
              How temperature changes resistance
            </h2>
            <p className={P}>
              A metal conductor resists more as it warms. Over the range this calculator covers, the change is close to a straight line:
            </p>
            <p className={LOOK_FORMULA}>
              R(T) = R<sub>20</sub> × (1 + α × (T − <Val v={20} unit="°C" src={RES} />))
            </p>
            <Stat
              figure={<Val v={(FACTOR_75_CU - 1) * 100} unit="%" src={CALC} format={{ fixed: 1 }} />}
              text={
                <>
                  Copper&apos;s resistance from <Val v={20} unit="°C" src={RES} /> to <Val v={75} unit="°C" src={AMP} />, from NIST&apos;s α of{' '}
                  <Num v={COPPER_ALPHA} src={RES} />.
                </>
              }
              domains={[RES]}
              prefix="+"
            />
            <p className={P}>
              α is <Num v={COPPER_ALPHA} src={RES} /> per degree for copper and <Num v={ALUMINUM_ALPHA} src={RES} /> for aluminum EC-H19, so
              from <Val v={20} unit="°C" src={RES} /> to <Val v={75} unit="°C" src={AMP} /> copper gains{' '}
              <Val v={(FACTOR_75_CU - 1) * 100} unit="%" src={CALC} format={{ fixed: 1 }} /> and aluminum{' '}
              <Val v={(FACTOR_75_AL - 1) * 100} unit="%" src={CALC} format={{ fixed: 1 }} />. A wire on a reel at room temperature matches
              the tables; the same wire carrying its full rated current runs warmer, and its resistance rises with it.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    <Size s="12" /> copper and aluminum per 1,000 ft from <Val v={-40} unit="°C" src={CALC} /> to{' '}
                    <Val v={90} unit="°C" src={CALC} />, the dots at <Val v={20} unit="°C" src={RES} /> and <Val v={75} unit="°C" src={AMP} />.
                  </span>
                  <SourceLine domains={[RES]} />
                </>
              }
            >
              <TemperatureChart />
            </Figure>
          </section>

          <section aria-labelledby="aluminum" className="space-y-4">
            <h2 id="aluminum" className={H2}>
              Copper or aluminum
            </h2>
            <p className={P}>
              Aluminum conductor alloy EC-H19 has a resistivity of{' '}
              <Num v={AWG_CONSTANTS.aluminum_ECH19_resistivity_ohm_cmil_per_ft_20C} src={RES} /> Ω·cmil/ft at{' '}
              <Val v={20} unit="°C" src={RES} /> against copper&apos;s <Num v={AWG_CONSTANTS.copper_resistivity_ohm_cmil_per_ft_20C} src={RES} />;
              its conductivity is <Val v={AWG_CONSTANTS.aluminum_ECH19_pct_IACS} unit="%" src={RES} /> of the International Annealed Copper
              Standard. Of the same size, aluminum reads <Num v={AL_TO_CU} src={CALC} format={{ fixed: 3 }} /> times copper.
            </p>
            <Stat
              figure={<Num v={AL_TO_CU} src={CALC} format={{ fixed: 3 }} prefix="×" />}
              text={
                <>
                  Aluminum EC-H19 against copper of the same size: <Num v={AWG_CONSTANTS.aluminum_ECH19_resistivity_ohm_cmil_per_ft_20C} src={RES} />{' '}
                  ÷ <Num v={AWG_CONSTANTS.copper_resistivity_ohm_cmil_per_ft_20C} src={RES} />, the two resistivities.
                </>
              }
              domains={[RES]}
            />
            <p className={P} data-src={CALC}>
              To match the resistance of <Size s="12" /> copper, aluminum needs <Size s={AL_FOR_12} />:{' '}
              <Val v={resistanceAt(AL_FOR_12, 'Al', 20) as number} unit="Ω" src={CALC} format={SIG4} /> per 1,000 ft against copper&apos;s{' '}
              <Val v={r20('12')} unit="Ω" src={GEO} />. Ampacity is a separate question with its own table: the{' '}
              <Link href="/guides/nec-table-310-16" className={LINK}>
                Table 310.16 page
              </Link>{' '}
              lists both metals.
            </p>
          </section>

          <section aria-labelledby="formula" className="space-y-4">
            <h2 id="formula" className={H2}>
              How wire resistance is calculated
            </h2>
            <p className={P}>Resistance is the resistivity of the metal times the length, divided by the area:</p>
            <p className={LOOK_FORMULA}>R = ρ × L ÷ A</p>
            <p className={P} data-src={CALC}>
              In the units of US tables, ρ for copper is <Num v={AWG_CONSTANTS.copper_resistivity_ohm_cmil_per_ft_20C} src={RES} /> Ω·cmil/ft at{' '}
              <Val v={20} unit="°C" src={RES} /> and the area is in circular mils. <Size s="12" /> has an area of{' '}
              <Val v={areaCmil('12')} unit="cmil" src={GEO} />, so 1,000 ft of it reads{' '}
              <Num v={AWG_CONSTANTS.copper_resistivity_ohm_cmil_per_ft_20C} src={RES} /> × 1,000 ÷ <Num v={areaCmil('12')} src={GEO} /> ={' '}
              <Val v={(AWG_CONSTANTS.copper_resistivity_ohm_cmil_per_ft_20C * 1000) / areaCmil('12')} unit="Ω" src={CALC} format={SIG12} />, the
              figure NIST lists. In metric units ρ is <Num v={AWG_CONSTANTS.copper_resistivity_ohm_mm2_per_m_20C} src={RES} /> Ω·mm²/m.
            </p>
          </section>

          <section aria-labelledby="stranded" className="space-y-4">
            <h2 id="stranded" className={H2}>
              Solid and stranded wire
            </h2>
            <p className={P}>
              The values here are for a solid conductor. A stranded conductor of the same size has slightly higher resistance: its strands
              are laid in a spiral, so each is a little longer than the cable. This calculator doesn&apos;t estimate that difference; the
              conductor&apos;s data sheet gives it.
            </p>
          </section>

          <section aria-labelledby="uses" className="space-y-5">
            <h2 id="uses" className={H2}>
              When you would use it
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>A long low-voltage run</h3>
              <p className={P}>
                On a low-voltage DC system, a fraction of an ohm costs a large share of the supply. Find the run&apos;s resistance here, then
                size the wire in the{' '}
                <Link href="/calculators/low-voltage-calculator" className={LINK}>
                  low voltage calculator
                </Link>
                .
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Checking a meter reading</h3>
              <p className={P}>
                An ohmmeter across both ends of a run reads its resistance. Compare it with this result at the wire&apos;s temperature: a much
                higher reading points to a poor connection or the wrong size.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Thin signal and data wire</h3>
              <p className={P}>
                The small-gauge table above runs to <Size s="40" />, so the resistance of sensor, speaker or data wire over a long run is a quick
                look-up.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Voltage drop on a branch circuit or feeder</h3>
              <p className={P}>
                Resistance times current is the voltage lost in the wire. The{' '}
                <Link href="/calculators/voltage-drop-calculator" className={LINK}>
                  voltage drop calculator
                </Link>{' '}
                does that step for single-phase and three-phase circuits.
              </p>
            </div>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={RES}>
                What is the resistance of copper wire per 1,000 ft?
              </h3>
              <p className={P}>
                At <Val v={20} unit="°C" src={RES} />: <Size s="14" /> <Val v={r20('14')} unit="Ω" src={GEO} />, <Size s="12" />{' '}
                <Val v={r20('12')} unit="Ω" src={GEO} />, <Size s="10" /> <Val v={r20('10')} unit="Ω" src={GEO} />, <Size s="8" />{' '}
                <Val v={r20('8')} unit="Ω" src={GEO} /> and <Size s="6" /> <Val v={r20('6')} unit="Ω" src={GEO} />. The table above lists
                every size from <Size s="40" /> to <Size s="4/0" />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={CALC}>
                What is the resistance per 100 ft?
              </h3>
              <p className={P} data-src={CALC}>
                A tenth of the value per 1,000 ft: 100 ft of <Size s="12" /> copper is{' '}
                <Val v={r20('12') / 10} unit="Ω" src={CALC} format={SIG12} /> at <Val v={20} unit="°C" src={RES} /> and{' '}
                <Val v={(resistanceAt('12', 'Cu', 75) as number) / 10} unit="Ω" src={CALC} format={SIG12} /> at{' '}
                <Val v={75} unit="°C" src={AMP} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How does temperature change wire resistance?</h3>
              <p className={P}>
                It rises by α of the <Val v={20} unit="°C" src={RES} /> value for every degree: <Num v={COPPER_ALPHA} src={RES} /> for copper.
                At <Val v={75} unit="°C" src={AMP} /> copper reads <Val v={(FACTOR_75_CU - 1) * 100} unit="%" src={CALC} format={{ fixed: 1 }} />{' '}
                above its table value.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Is aluminum wire more resistive than copper?</h3>
              <p className={P}>
                Yes, <Num v={AL_TO_CU} src={CALC} format={{ fixed: 3 }} /> times for EC-H19 of the same size. <Size s={AL_FOR_12} /> aluminum
                comes closest to the resistance of <Size s="12" /> copper without going over it.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How is wire resistance calculated?</h3>
              <p className={P}>
                R = ρ × L ÷ A, with ρ = <Num v={AWG_CONSTANTS.copper_resistivity_ohm_cmil_per_ft_20C} src={RES} /> Ω·cmil/ft for copper at{' '}
                <Val v={20} unit="°C" src={RES} />, L in feet and A in circular mils.{' '}
                <a href="#formula" className={LINK}>
                  The full method is above
                </a>
                .
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What is the resistance in ohms per meter?</h3>
              <p className={P}>
                The value per km divided by 1,000. <Size s="12" /> copper is <Val v={ohmsPerKm('12', 'Cu', 20) as number} unit="Ω" src={GEO} />{' '}
                per km at <Val v={20} unit="°C" src={RES} />, so{' '}
                <Val v={(ohmsPerKm('12', 'Cu', 20) as number) / 1000} unit="Ω" src={CALC} format={{ sig: 4 }} /> per meter. The calculator takes
                lengths in meters too.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[RES, GEO, AMP]}
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
