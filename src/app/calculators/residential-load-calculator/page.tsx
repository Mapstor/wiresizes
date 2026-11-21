import type { Metadata } from 'next';
import Link from 'next/link';
import { AmpGuideLink } from '@/components/content/AmpGuideLink';
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
import { ValText } from '@/components/content/ValText';
import { ResidentialLoadTool } from '@/components/calculators/ResidentialLoadTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { LoadMethodsChart } from '@/components/look/Charts';
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
import { DWELLING_VOLTS, ENGINE_ID } from '@/lib/calculations/load-calc-2023';
import type { DwellingMethodRun } from '@/lib/calculations/load-calc-2023';
import { articleDates } from '@/lib/page-dates';
import { EV_W, EXAMPLE, EXAMPLE_CONNECTED_A, EXAMPLE_INPUT, GAS_HEAT, HEAT_PUMP_VA, SMALL_FT2, SMALL_UNIT, WITH_EV, WITH_HEAT_PUMP } from '@/lib/residential-load-page';
import { OPTIONAL_METHOD, STANDARD_METHOD, TABLE_220_55, cookingRow } from '@/lib/verified/nec-220-2023';
import type { CookingRow } from '@/lib/verified/nec-220-2023';
import { TABLE_310_12_ROWS } from '@/lib/verified/nec-310-12';
import type { ServiceRow } from '@/lib/verified/nec-310-12';

// /calculators/residential-load-calculator (WSZ-010a; spec: research/page-specs-held.md "WSZ-010"; data gate BUILD;
// withdrawn in WSZ-002, back as a new page): one dwelling unit's calculated load by both methods of NEC 2023 Article
// 220, side by side, with each step and the smallest Table 310.12 service at or above it. Every number comes from the
// load engine through src/lib/residential-load-page.ts or from a verified table. The example is the golden house of
// "load-calc-2023-standard" and the optional-method case of "load-calc-2023".
const ROUTE = '/calculators/residential-load-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Residential Load Calculator: NEC 220 Service Size';
const DESCRIPTION =
  "A dwelling's calculated load by the NEC 2023 standard and optional (220.82) methods, side by side with every step, and the service it needs.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const L = 'nec-220-load-calcs';
const SVC = 'nec-310-12';
const NEC26 = 'nec-2026-edition';
const CALC = `calc:${ENGINE_ID}`;
const S = STANDARD_METHOD;
const O = OPTIONAL_METHOD;
const H = O.heatingAc;
const COLUMN_C_1 = (cookingRow(1) as CookingRow).cBaseKw;
const [LIGHT_FIRST, LIGHT_SECOND, LIGHT_REST] = S.lightingTiers;
const [GENERAL_FIRST, GENERAL_REST] = O.generalTiers;
const COMBINED = H.heatPumpWithSupplementalHeat.pct as { compressor: number; supplemental_heat: number };
const pctOf = (item: { pct: number | object }) => item.pct as number;

function service(run: DwellingMethodRun): ServiceRow {
  if (!run.serviceRow) throw new Error('residential load page: an example has no Table 310.12 service');
  return run.serviceRow;
}
// the facts the copy states, checked when the page builds
const STD = service(EXAMPLE.standard);
const OPT = service(EXAMPLE.optional);
if (EXAMPLE.standard.totalVa !== 34625 || STD.ratingA !== 150 || EXAMPLE.optional.totalVa !== 26700 || OPT.ratingA !== 125) {
  throw new Error('residential load page: the golden house changed');
}
if (!(SMALL_UNIT.standard.totalVa < SMALL_UNIT.optional.totalVa)) throw new Error('residential load page: the small unit no longer favors the standard method');
if (!(EXAMPLE.standard.detail.heatVa > EXAMPLE.standard.detail.coolingVa)) throw new Error('residential load page: the example heat no longer exceeds the cooling');
function row200(): ServiceRow {
  const row = TABLE_310_12_ROWS.find((r) => r.ratingA === 200);
  if (!row) throw new Error('residential load page: Table 310.12 has no 200 A row');
  return row;
}
const ROW_200 = row200();
const EV_STD = service(WITH_EV.standard);
const EV_OPT = service(WITH_EV.optional);
const GAS_STD = service(GAS_HEAT.standard);
const GAS_OPT = service(GAS_HEAT.optional);
const HP_STD = service(WITH_HEAT_PUMP.standard);
const HP_OPT = service(WITH_HEAT_PUMP.optional);

const TOC: ([string, string] | [string, string, string])[] = [
  ['methods', 'The same house by both methods'],
  ['standard', 'Standard method, step by step'],
  ['optional', 'Optional method, step by step'],
  ['loads', 'Where each load goes'],
  ['service', 'From the load to the service'],
  ['editions', 'NEC 2023 and 2026'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Residential Load Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Residential Load Calculator', url: URL, description: DESCRIPTION };

const amps = (v: number) => <Val v={v} unit="A" src={CALC} format={{ upTo: 2 }} />;
// the load table holds words, so it keeps the body type and wraps
const TEXT_TH = 'sticky left-0 z-10 min-w-[8.5rem] max-w-[11rem] border-b border-cut-rule bg-white px-3.5 py-2 text-left align-top text-[15px] font-semibold leading-[1.45] text-ink';
const TEXT_TD = 'min-w-[13rem] border-b border-cut-rule px-3.5 py-2 text-left align-top text-[15px] leading-[1.45] text-ink';
const vaOf = (v: number) => <Val v={v} unit="VA" src={CALC} format={{ upTo: 1 }} />;

function StepList({ run, id }: { run: DwellingMethodRun; id: string }) {
  return (
    <ol aria-labelledby={id} className="max-w-[44rem] list-decimal space-y-2 pl-6 text-[17px] leading-[1.65] text-ink" data-src={CALC}>
      {run.stepParts.map((parts, k) => (
        <li key={k}>
          <ValText parts={parts} />
        </li>
      ))}
    </ol>
  );
}

const LOAD_ROWS: { load: string; standard: React.ReactNode; optional: React.ReactNode }[] = [
  {
    load: 'Floor area',
    standard: (
      <>
        <Val v={S.vaPerFt2} unit="VA" src={L} /> per ft² (220.41), then Table 220.45 with the circuits below
      </>
    ),
    optional: (
      <>
        <Val v={O.vaPerFt2} unit="VA" src={L} /> per ft², in the general load
      </>
    ),
  },
  {
    load: 'Small-appliance and laundry circuits',
    standard: (
      <>
        <Val v={S.smallApplianceCircuitVa} unit="VA" src={L} /> each, added to the lighting (220.52)
      </>
    ),
    optional: (
      <>
        <Val v={O.smallApplianceAndLaundryCircuitVa} unit="VA" src={L} /> each, in the general load
      </>
    ),
  },
  {
    load: 'Water heater and other appliances fastened in place',
    standard: (
      <>
        Nameplate; <Val v={S.appliancePct} unit="%" src={L} /> of the total with <Num v={S.minAppliances} src={L} /> or more (220.53)
      </>
    ),
    optional: 'Nameplate, in the general load',
  },
  {
    load: 'Clothes dryer',
    standard: (
      <>
        <Val v={S.dryerMinW} unit="W" src={L} /> or the nameplate, the larger (220.54)
      </>
    ),
    optional: 'Nameplate, in the general load',
  },
  {
    load: 'Range',
    standard: (
      <>
        Table 220.55, Column C: <Val v={COLUMN_C_1} unit="kW" src={L} /> for one range of{' '}
        <Val v={TABLE_220_55.note1.fromKw} unit="kW" src={L} /> or less
      </>
    ),
    optional: 'Nameplate, in the general load',
  },
  {
    load: 'EV charger',
    standard: (
      <>
        <Val v={S.evseMinW} unit="W" src={L} /> or the nameplate, the larger (220.57)
      </>
    ),
    optional: 'Nameplate, in the general load (this calculator’s reading)',
  },
  {
    load: 'Electric heat',
    standard: (
      <>
        <Val v={S.spaceHeatPct} unit="%" src={L} /> (220.51)
      </>
    ),
    optional: (
      <>
        <Val v={pctOf(H.spaceHeatFewUnits)} unit="%" src={L} />, or <Val v={pctOf(H.spaceHeatManyUnits)} unit="%" src={L} /> with{' '}
        <Num v={O.spaceHeatUnitsLimit} src={L} /> or more separately controlled units
      </>
    ),
  },
  {
    load: 'Air conditioning',
    standard: (
      <>
        <Val v={S.noncoincidentMotorPct} unit="%" src={L} />, against the heat; the larger counts (220.60, as read here)
      </>
    ),
    optional: (
      <>
        <Val v={pctOf(H.airConditioning)} unit="%" src={L} />; the largest heating or cooling selection counts
      </>
    ),
  },
  {
    load: 'Heat pump',
    standard: (
      <>
        With its backup heat at <Val v={S.spaceHeatPct} unit="%" src={L} /> as heating, alone at{' '}
        <Val v={S.noncoincidentMotorPct} unit="%" src={L} /> as cooling (as read here)
      </>
    ),
    optional: (
      <>
        <Val v={COMBINED.compressor} unit="%" src={L} />, plus <Val v={COMBINED.supplemental_heat} unit="%" src={L} /> of any backup heat
      </>
    ),
  },
  {
    load: 'The sum',
    standard: 'No further factor',
    optional: (
      <>
        General load: the first <Val v={GENERAL_FIRST.upToVa} unit="VA" src={L} /> at <Val v={GENERAL_FIRST.pct} unit="%" src={L} />, the rest at{' '}
        <Val v={GENERAL_REST.pct} unit="%" src={L} /> (220.82(B))
      </>
    ),
  },
];

export default function ResidentialLoadCalculatorPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Residential Load Calculator" sub="Dwelling Service Size, NEC Article 220" joiner=": " src={L} />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            A house&apos;s calculated load by both NEC methods, standard and optional, with every step, and the service and conductors it needs.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <ResidentialLoadTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={L}>
            <strong>
              The NEC calculates a dwelling&apos;s load two ways. The standard method gives each kind of load its own rule; the optional
              method of 220.82 adds most loads at their rating, counts the first <Val v={GENERAL_FIRST.upToVa} unit="VA" src={L} /> at{' '}
              <Val v={GENERAL_FIRST.pct} unit="%" src={L} /> and the rest at <Val v={GENERAL_REST.pct} unit="%" src={L} />, then adds the largest
              heating or cooling selection.
            </strong>{' '}
            <span data-src={CALC}>
              A <Val v={EXAMPLE_INPUT.ft2} unit="ft²" src="input" /> house with an electric range, dryer, water heater and heat comes to{' '}
              {vaOf(EXAMPLE.standard.totalVa)}, or {amps(EXAMPLE.standard.amps)}, by the standard method: a{' '}
              <Val v={STD.ratingA} unit="A" src={SVC} /> service. The optional method gives {vaOf(EXAMPLE.optional.totalVa)}, or{' '}
              {amps(EXAMPLE.optional.amps)}, and a <AmpGuideLink a={OPT.ratingA} className={LINK}><Val v={OPT.ratingA} unit="A" src={SVC} /> service</AmpGuideLink>.
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="methods" className="space-y-5">
            <h2 id="methods" className={H2}>
              The same house by both methods
            </h2>
            <p className={P} data-src={CALC}>
              The example house has <Val v={EXAMPLE_INPUT.ft2} unit="ft²" src="input" />, two small-appliance circuits and a laundry circuit, a{' '}
              <Val v={EXAMPLE_INPUT.rangeKw as number} unit="kW" src="input" /> range, a <Val v={EXAMPLE_INPUT.dryerW as number} unit="W" src="input" />{' '}
              dryer, a <Val v={EXAMPLE_INPUT.waterHeaterW as number} unit="W" src="input" /> water heater, three more appliances of{' '}
              <Val v={EXAMPLE_INPUT.otherAppliancesW[0]} unit="W" src="input" />, <Val v={EXAMPLE_INPUT.otherAppliancesW[1]} unit="W" src="input" /> and{' '}
              <Val v={EXAMPLE_INPUT.otherAppliancesW[2]} unit="W" src="input" />, <Val v={EXAMPLE_INPUT.heatW} unit="W" src="input" /> of electric heat in
              one unit and <Val v={EXAMPLE_INPUT.acVa} unit="VA" src="input" /> of air conditioning. With everything at its rating at once it would
              draw {amps(EXAMPLE_CONNECTED_A)} at <Val v={DWELLING_VOLTS} unit="V" src={SVC} />. Neither method assumes that.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    The example house at <Val v={DWELLING_VOLTS} unit="V" src={SVC} />: its connected load, then the calculated load by each method and the
                    smallest Table 310.12 service at or above it.
                  </span>
                  <SourceLine domains={[L, SVC]} />
                </>
              }
            >
              <LoadMethodsChart />
            </Figure>
            <p className={P} data-src={CALC}>
              The optional method lands lower here because it takes <Val v={GENERAL_REST.pct} unit="%" src={L} /> of the general load past the first{' '}
              <Val v={GENERAL_FIRST.upToVa} unit="VA" src={L} />, and the heat at <Val v={pctOf(H.spaceHeatFewUnits)} unit="%" src={L} /> instead of{' '}
              <Val v={S.spaceHeatPct} unit="%" src={L} />. It is not always lower: an <Val v={SMALL_FT2} unit="ft²" src="input" /> unit with no electric
              appliances or heat comes to {vaOf(SMALL_UNIT.standard.totalVa)} by the standard method and {vaOf(SMALL_UNIT.optional.totalVa)} by the
              optional one, because the standard method counts lighting past the first{' '}
              <Val v={LIGHT_FIRST.upToVa} unit="VA" src={L} /> at <Val v={LIGHT_SECOND.pct} unit="%" src={L} />. The calculator shows both, so the
              smaller one is in view.
            </p>
          </section>

          <section aria-labelledby="standard" className="space-y-5">
            <h2 id="standard" className={H2}>
              Standard method, step by step
            </h2>
            <p className={P} data-src={L}>
              Article 220, Part III, gives each kind of load its own rule, and the results add up. For the example house:
            </p>
            <StepList run={EXAMPLE.standard} id="standard" />
          </section>

          <section aria-labelledby="optional" className="space-y-5">
            <h2 id="optional" className={H2}>
              Optional method, step by step
            </h2>
            <p className={P} data-src={L}>
              220.82 puts the floor area, the circuits and the nameplates of the range, dryer, water heater and appliances into one general load,
              reduces it once, and adds the largest of six heating and cooling selections. For the same house:
            </p>
            <StepList run={EXAMPLE.optional} id="optional" />
          </section>

          <section aria-labelledby="loads" className="space-y-5">
            <h2 id="loads" className={H2}>
              Where each load goes
            </h2>
            <p className={P} data-src={L}>
              The two methods count the same loads differently. Floor area is measured from the outside dimensions and leaves out open porches and
              unfinished spaces not adaptable for future use; the optional method also names garages.
            </p>
            <DataTable id="load-rules" variant="ruled" src={L} caption="How each method counts a dwelling's loads, NEC 2023">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Load
                  </th>
                  <th scope="col" className={clsx(RTH, '!text-left')}>
                    Standard method
                  </th>
                  <th scope="col" className={clsx(RTH, '!text-left')}>
                    Optional method, 220.82
                  </th>
                </tr>
              </thead>
              <tbody>
                {LOAD_ROWS.map((row) => (
                  <tr key={row.load}>
                    <th scope="row" className={TEXT_TH}>
                      {row.load}
                    </th>
                    <td className={TEXT_TD}>{row.standard}</td>
                    <td className={TEXT_TD}>{row.optional}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className="text-[15px] leading-[1.6] text-[#333333]" data-src={L}>
              Table 220.45 counts the first <Val v={LIGHT_FIRST.upToVa} unit="VA" src={L} /> of lighting and circuits at{' '}
              <Val v={LIGHT_FIRST.pct} unit="%" src={L} />, up to <Val v={LIGHT_SECOND.upToVa} unit="VA" src={L} /> at{' '}
              <Val v={LIGHT_SECOND.pct} unit="%" src={L} /> and the rest at <Val v={LIGHT_REST.pct} unit="%" src={L} />. “As read here” marks the
              calculator&apos;s reading of a rule; the methodology page sets out each one.
            </p>
            <SourceLine domains={[L]} />
          </section>

          <section aria-labelledby="service" className="space-y-5">
            <h2 id="service" className={H2}>
              From the load to the service
            </h2>
            <p className={P} data-src={SVC}>
              Divide the calculated load by <Val v={DWELLING_VOLTS} unit="V" src={SVC} /> and take the smallest service rating at or above the current.
              Table 310.12 gives the conductors for each rating, for a 120/240 V single-phase service, or a feeder, that carries the entire load of a
              one-family dwelling or of one dwelling unit.{' '}
              <span data-src={CALC}>
                A <AmpGuideLink a={ROW_200.ratingA} className={LINK}><Val v={ROW_200.ratingA} unit="A" src={SVC} /> service</AmpGuideLink> covers a calculated load of up to{' '}
                <Val v={ROW_200.ratingA * DWELLING_VOLTS} unit="VA" src={CALC} />.
              </span>
            </p>
            <DataTable id="service-rows" variant="ruled" src={SVC} caption="Table 310.12, NEC 2023" className="max-w-[34rem]">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Service
                  </th>
                  <th scope="col" className={RTH}>
                    Copper
                  </th>
                  <th scope="col" className={RTH}>
                    Aluminum or copper-clad aluminum
                  </th>
                </tr>
              </thead>
              <tbody>
                {TABLE_310_12_ROWS.map((row) => (
                  <tr key={row.ratingA}>
                    <th scope="row" className={clsx(RSTICKY_TD, '!font-normal')}>
                      <Val v={row.ratingA} unit="A" src={SVC} />
                    </th>
                    <td className={RTD}>
                      <Size s={row.cu} />
                    </td>
                    <td className={RTD}>
                      <Size s={row.alCca} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className={P}>
              The{' '}
              <Link href="/calculators/service-entrance-calculator" className={LINK}>
                service entrance calculator
              </Link>{' '}
              adds the ground wire and the voltage drop for a rating; the{' '}
              <Link href="/guides/wire-size-for-200-amp" className={LINK}>
                <Val v={ROW_200.ratingA} unit="A" src={SVC} /> guide
              </Link>{' '}
              compares Table 310.12 with the ampacity table.
            </p>
          </section>

          <section aria-labelledby="editions" className="space-y-4">
            <h2 id="editions" className={H2}>
              NEC 2023 and 2026
            </h2>
            <p className={P} data-src={NEC26}>
              The 2026 NEC moved these load calculations from Article 220 to Article 120.{' '}
              <span data-src={L}>
                The calculator uses the 2023 values and section numbers; the 2026 values are not verified here yet, so it does not offer them.
              </span>{' '}
              Which edition applies depends on the state or city:{' '}
              <Link href="/guides/nec-code-compliance" className={LINK}>
                NEC edition by state
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src="input">
                What size service does a <Val v={EXAMPLE_INPUT.ft2} unit="ft²" src="input" /> house need?
              </h3>
              <p className={P} data-src={CALC}>
                It depends more on what runs on electricity than on the floor area, which adds <Val v={S.vaPerFt2} unit="VA" src={L} /> per ft². The
                example house needs <Val v={STD.ratingA} unit="A" src={SVC} /> by the standard method or <Val v={OPT.ratingA} unit="A" src={SVC} /> by the
                optional one. Heated by gas instead, it comes to {amps(GAS_HEAT.standard.amps)} by the standard method, still a{' '}
                <Val v={GAS_STD.ratingA} unit="A" src={SVC} /> service, and {amps(GAS_HEAT.optional.amps)} by the optional one, a{' '}
                <Val v={GAS_OPT.ratingA} unit="A" src={SVC} /> service.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SVC}>
                Is a <Val v={ROW_200.ratingA} unit="A" src={SVC} /> service enough?
              </h3>
              <p className={P} data-src={CALC}>
                Yes when the calculated load stays at or under <Val v={ROW_200.ratingA * DWELLING_VOLTS} unit="VA" src={CALC} />, which is{' '}
                <Val v={ROW_200.ratingA} unit="A" src={SVC} /> at <Val v={DWELLING_VOLTS} unit="V" src={SVC} />. Adding a{' '}
                <Val v={EV_W} unit="W" src="input" /> EV charger to the example house takes the standard method to {amps(WITH_EV.standard.amps)} (
                <Val v={EV_STD.ratingA} unit="A" src={SVC} />) and the optional method to {amps(WITH_EV.optional.amps)} (
                <Val v={EV_OPT.ratingA} unit="A" src={SVC} />).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Do the heat and the air conditioning both count?</h3>
              <p className={P} data-src={L}>
                No, only the larger. 220.60 lets a calculation use only the largest of loads that are unlikely to run at the same time, and where a
                motor or air-conditioning load is not the largest, it says &ldquo;125 percent of either the motor load or air-conditioning load&rdquo; is
                used. The calculator reads that as comparing the heat with the air conditioning at <Val v={S.noncoincidentMotorPct} unit="%" src={L} />.
                The optional method takes the largest of its six heating and cooling selections (220.82(C)).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How does an EV charger count?</h3>
              <p className={P} data-src={L}>
                In the standard method at <Val v={S.evseMinW} unit="W" src={L} /> or its nameplate, whichever is larger (220.57). The 2023 optional
                method has no line of its own for one; the calculator adds its nameplate to the general load with the appliances on a specific
                circuit, its reading of 220.82(B).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How does a heat pump count?</h3>
              <p className={P} data-src={CALC}>
                <span data-src={L}>
                  In the optional method at <Val v={COMBINED.compressor} unit="%" src={L} /> of its rating plus{' '}
                  <Val v={COMBINED.supplemental_heat} unit="%" src={L} /> of its backup electric heat, or at{' '}
                  <Val v={pctOf(H.heatPumpWithoutSupplementalHeat)} unit="%" src={L} /> with no backup heat (220.82(C)).
                </span>{' '}
                The standard method names no heat pump, so the calculator counts it as heating with its backup heat and as cooling on its own. With a{' '}
                <Val v={HEAT_PUMP_VA} unit="VA" src="input" /> heat pump and <Val v={EXAMPLE_INPUT.heatW} unit="W" src="input" /> of backup heat in place
                of its heat and air conditioning, the example house needs <Val v={HP_STD.ratingA} unit="A" src={SVC} /> by the standard method and{' '}
                <Val v={HP_OPT.ratingA} unit="A" src={SVC} /> by the optional one.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Which appliances count as fastened in place?</h3>
              <p className={P} data-src={L}>
                Appliances rated <Val v={S.applianceMinW} unit="W" src={L} /> or more, or {S.applianceMinHp} hp or more, that are fastened in place, such as
                a water heater.
                Cooking equipment, clothes dryers, space heating, air conditioning and EV chargers have rules of their own and stay out of the count
                (220.53).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Can any house use the optional method?</h3>
              <p className={P} data-src={L}>
                220.82 covers a dwelling unit whose entire load is served by a single 120/240 V or 208Y/120 V 3-wire set of service or feeder
                conductors with an ampacity of <Val v={O.minAmpacityA} unit="A" src={L} /> or more. Every service in Table 310.12 is at least that.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[L, SVC, NEC26]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#load-method" className={LINK}>
                methodology page
              </Link>{' '}
              sets out each step, each source and each reading. A calculated load is the code&apos;s minimum for the loads entered; it leaves no room for
              loads added later. NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the National Fire Protection Association;
              wiresizes.com is not affiliated with or endorsed by NFPA.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
