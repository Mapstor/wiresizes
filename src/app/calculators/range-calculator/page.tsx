import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { Byline } from '@/components/content/Byline';
import { DataTable, RSTICKY_TD, RSTICKY_TH, RTD, RTH } from '@/components/content/DataTable';
import { Num } from '@/components/content/Num';
import { Size } from '@/components/content/Size';
import { SourceLine } from '@/components/content/SourceLine';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { RangeTool } from '@/components/calculators/RangeTool';
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
import { ENGINE_ID } from '@/lib/calculations/range-circuit';
import { note1Steps } from '@/lib/calculations/load-calc-2023';
import { articleDates } from '@/lib/page-dates';
import { COMBO, COMBO_AMPS, COMBO_KW, DEMAND_ROWS, EXAMPLE, FRACTIONS, GOLDEN_COMBO, GOLDEN_COMBO_INPUT, WIRE_ROWS, wireRow } from '@/lib/range-page';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { TABLE_220_55, cookingRow } from '@/lib/verified/nec-220-2023';
import type { CookingRow } from '@/lib/verified/nec-220-2023';
import { FRIGIDAIRE_RANGE, MFR_DOMAIN, WHIRLPOOL_RANGE } from '@/lib/verified/mfr-equipment';
import { NEMA_DOMAIN, nemaConfig } from '@/lib/verified/nema-receptacle-configs';

// /calculators/range-calculator (WSZ-010b; spec: research/page-specs-held.md "WSZ-010"; data gate BUILD; withdrawn in
// WSZ-002, back as a new page): the branch-circuit load of household cooking appliances by NEC 2023 Table 220.55 and
// its notes, its current, and the wire and ground wire for the circuit the instructions give. The page never picks a
// circuit rating: the 210.19 household-range rule (8¾ kW, 40 A) is unverified, so it sizes from Table 220.55 and the
// maker's stated circuit (nec-continuous-load-2023.json notes). Notes after Note 3 are cited without a number.
const ROUTE = '/calculators/range-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Range Calculator: NEC Table 220.55 Load and Wire Size';
const DESCRIPTION =
  'Branch-circuit load of a range, or a cooktop and ovens, by NEC Table 220.55, its amps at 240 or 208 V, and the wire for the circuit the instructions give.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const L = 'nec-220-load-calcs';
const AMP = 'nec-310-16';
const TERM = 'nec-110-14c';
const SMALL = 'nec-240-4-d';
const OCPD = 'nec-240-ocpd';
const EGC = 'nec-250-grounding';
const EXC = 'nec-2023-rule-excerpts';
const CALC = `calc:${ENGINE_ID}`;
const N1 = TABLE_220_55.note1;
const COLUMN_C_1 = (cookingRow(1) as CookingRow).cBaseKw;
const R14 = nemaConfig(WHIRLPOOL_RANGE.receptacle4Wire);
const R10 = nemaConfig(WHIRLPOOL_RANGE.receptacle3Wire);
const [WROW1, WROW2] = WHIRLPOOL_RANGE.rows;
const [C40, C50] = WROW1.circuitsA;
const W40 = wireRow(C40);
const W50 = wireRow(C50);
const SEVERAL = TABLE_220_55.rows.slice(0, 10);
const COLD = TERMINATION_RULES.columnAtOrBelowLimit;
const WARM = TERMINATION_RULES.columnAboveLimit;

// the facts the copy states, checked when the page builds
if (EXAMPLE.loadKw !== COLUMN_C_1 || EXAMPLE.size !== '8' || EXAMPLE.egc !== '10') throw new Error('range page: the 12 kW example changed');
if (COMBO.equivalentRangeKw !== 12 || COMBO.loadKw !== COLUMN_C_1) throw new Error('range page: the oven and cooktop example changed');
if (GOLDEN_COMBO.equivalentRangeKw !== 15 || GOLDEN_COMBO.loadKw !== 9.2) throw new Error('range page: the golden Note 4 case changed');
if (W40.cuCable.size !== WHIRLPOOL_RANGE.directWire.cu || W40.alCable.size !== WHIRLPOOL_RANGE.directWire.al) {
  throw new Error('range page: the 40 A wire no longer matches the Whirlpool direct-wire sizes');
}
if (!R14.grounding || R10.grounding || R14.wires !== 4 || R10.wires !== 3) throw new Error('range page: the NEMA 14-50R and 10-50R facts changed');
if (WROW1.circuitsA.join() !== '40,50' || WROW2.circuitsA.join() !== '50') throw new Error('range page: the Whirlpool circuits changed');

const TOC: ([string, string] | [string, string, string])[] = [
  ['one-range', 'Table 220.55 for one range'],
  ['cooktop-ovens', 'A cooktop and wall ovens'],
  ['circuit', 'The circuit and its wire'],
  ['cord', 'Cord, receptacle and GFCI'],
  ['several', 'Several appliances: Table 220.55'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Range Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Range Calculator', url: URL, description: DESCRIPTION };

const a2 = (v: number, src = CALC) => <Val v={v} unit="A" src={src} format={{ upTo: 2 }} />;
const kw = (v: number, src = CALC) => <Val v={v} unit="kW" src={src} format={{ upTo: 2 }} />;
const span = (pair: [number, number]) => (
  <>
    <Val v={pair[0]} unit="kW" src={MFR_DOMAIN} /> to <Val v={pair[1]} unit="kW" src={MFR_DOMAIN} />
  </>
);
const circuits = (list: number[]) =>
  list.map((a, k) => (
    <span key={a}>
      {k > 0 ? ' or ' : ''}
      <Val v={a} unit="A" src={MFR_DOMAIN} />
    </span>
  ));

export default function RangeCalculatorPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Range Calculator" sub="Range Load and Wire Size, NEC Table 220.55" joiner=": " src={L} />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            The branch-circuit load of an electric range, or a cooktop and wall ovens, by NEC Table 220.55, its current, and the wire for the circuit
            the range&apos;s instructions give.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <RangeTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={L}>
            <strong>
              NEC Table 220.55 counts one range of <Val v={N1.fromKw} unit="kW" src={L} /> or less as <Val v={COLUMN_C_1} unit="kW" src={L} />,{' '}
              <span data-src={CALC}>{a2(EXAMPLE.amps)} at 240 V</span>; above <Val v={N1.fromKw} unit="kW" src={L} />, Note 1 adds{' '}
              <Val v={N1.pctPerKw} unit="%" src={L} /> for each kW.
            </strong>{' '}
            <span data-src={MFR_DOMAIN}>
              The circuit is the one the range&apos;s instructions give: Whirlpool&apos;s freestanding ranges call for {circuits(WROW1.circuitsA)} at{' '}
              {span(WROW1.kw240)} and <Val v={WROW2.circuitsA[0]} unit="A" src={MFR_DOMAIN} /> at {span(WROW2.kw240)} (120/240 V).
            </span>{' '}
            <span data-src={CALC}>
              A <Val v={C40} unit="A" src={MFR_DOMAIN} /> circuit takes <Size s={W40.cuCable.size} /> copper in NM cable, a{' '}
              <Val v={C50} unit="A" src={MFR_DOMAIN} /> circuit <Size s={W50.cuCable.size} />.
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="one-range" className="space-y-5">
            <h2 id="one-range" className={H2}>
              Table 220.55 for one range
            </h2>
            <p className={P} data-src={L}>
              A note to Table 220.55 lets the branch-circuit load of one range come from the table. Column C gives{' '}
              <Val v={COLUMN_C_1} unit="kW" src={L} /> for one range rated <Val v={N1.fromKw} unit="kW" src={L} /> or less. Note 1 raises it by{' '}
              <Val v={N1.pctPerKw} unit="%" src={L} /> for each kW, or major fraction of a kW, by which the rating exceeds{' '}
              <Val v={N1.fromKw} unit="kW" src={L} />, up to <Val v={N1.maxKw} unit="kW" src={L} />. The current is the load divided by the supply
              voltage.
            </p>
            <DataTable id="one-range-table" variant="ruled" src={CALC} caption="One range, NEC 2023 Table 220.55, Column C and Note 1" className="max-w-[34rem]">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Range rating
                  </th>
                  <th scope="col" className={RTH}>
                    Load
                  </th>
                  <th scope="col" className={RTH}>
                    At <Val v={240} unit="V" src="input" />
                  </th>
                  <th scope="col" className={RTH}>
                    At <Val v={208} unit="V" src="input" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {DEMAND_ROWS.map((r) => (
                  <tr key={r.ratingKw}>
                    <th scope="row" className={clsx(RSTICKY_TD, '!font-normal')}>
                      {r.ratingKw === N1.fromKw ? 'Up to ' : ''}
                      <Val v={r.ratingKw} unit="kW" src="input" />
                    </th>
                    <td className={RTD}>{kw(r.loadKw)}</td>
                    <td className={RTD}>{a2(r.amps240)}</td>
                    <td className={RTD}>{a2(r.amps208)}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className="text-[15px] leading-[1.6] text-[#333333]" data-src={L}>
              A rating between whole kW counts by Note 1&apos;s major fraction: <Val v={FRACTIONS[0]} unit="kW" src="input" /> counts as{' '}
              <Val v={N1.fromKw + note1Steps(FRACTIONS[0])} unit="kW" src={CALC} />, <Val v={FRACTIONS[1]} unit="kW" src="input" /> as{' '}
              <Val v={N1.fromKw + note1Steps(FRACTIONS[1])} unit="kW" src={CALC} />.
            </p>
            <SourceLine domains={[L]} />
          </section>

          <section aria-labelledby="cooktop-ovens" className="space-y-5">
            <h2 id="cooktop-ovens" className={H2}>
              A cooktop and wall ovens
            </h2>
            <p className={P} data-src={L}>
              On its own circuit, one wall-mounted oven or one counter-mounted cooking unit counts at its nameplate rating. A counter-mounted cooking
              unit and not more than two wall-mounted ovens, all on one branch circuit and in the same room, are added and treated as one range, so
              Column C and Note 1 apply to the total.{' '}
              <span data-src={CALC}>
                A <Val v={GOLDEN_COMBO_INPUT.cooktopKw} unit="kW" src="input" /> cooktop with two <Val v={GOLDEN_COMBO_INPUT.ovenKw} unit="kW" src="input" /> ovens
                adds up to{' '}
                {kw(GOLDEN_COMBO.equivalentRangeKw as number)}, and Note 1 takes that to {kw(GOLDEN_COMBO.loadKw)}.
              </span>
            </p>
            <h3 className={H3} data-src={CALC}>
              A <Val v={COMBO_AMPS.oven} unit="A" src="input" /> oven and a <Val v={COMBO_AMPS.cooktop} unit="A" src="input" /> cooktop
            </h3>
            <p className={P} data-src={CALC}>
              At <Val v={240} unit="V" src="input" /> those are {kw(COMBO_KW.oven)} and {kw(COMBO_KW.cooktop)}. On one circuit they add up to{' '}
              {kw(COMBO.equivalentRangeKw as number)}, which Column C counts as {kw(COMBO.loadKw)}: {a2(COMBO.amps)}. On separate circuits each counts
              at its nameplate, so each circuit carries its own <Val v={COMBO_AMPS.oven} unit="A" src="input" /> or{' '}
              <Val v={COMBO_AMPS.cooktop} unit="A" src="input" />. Either way, the circuit ratings come from the two appliances&apos; instructions.
            </p>
          </section>

          <section aria-labelledby="circuit" className="space-y-5">
            <h2 id="circuit" className={H2}>
              The circuit and its wire
            </h2>
            <p className={P} data-src={MFR_DOMAIN}>
              The calculator does not pick the circuit rating: a range&apos;s installation instructions give it. Whirlpool&apos;s freestanding range manual
              ({WHIRLPOOL_RANGE.doc}) calls for {circuits(WROW1.circuitsA)} for {span(WROW1.kw240)} at 120/240 V ({span(WROW1.kw208)} at 120/208 V), and{' '}
              <Val v={WROW2.circuitsA[0]} unit="A" src={MFR_DOMAIN} /> for {span(WROW2.kw240)} ({span(WROW2.kw208)}). For direct wiring it lists{' '}
              <Size s={WHIRLPOOL_RANGE.directWire.cu} /> copper or <Size s={WHIRLPOOL_RANGE.directWire.al} /> aluminum. Frigidaire&apos;s 40-inch range
              instructions ({FRIGIDAIRE_RANGE.doc}) use a <Val v={FRIGIDAIRE_RANGE.cordA} unit="A" src={MFR_DOMAIN} /> 4-wire cord and give its smallest
              copper conductors as <Size s={FRIGIDAIRE_RANGE.minCopper40A.hot} /> for the two hot wires, <Size s={FRIGIDAIRE_RANGE.minCopper40A.neutral} />{' '}
              for the neutral and <Size s={FRIGIDAIRE_RANGE.minCopper40A.ground} /> for the ground.
            </p>
            <p className={P} data-src={AMP}>
              The wire carries the full circuit rating, from Table 310.16 in the column the terminals allow (110.14(C)): the{' '}
              <Val v={COLD} unit="°C" src={TERM} /> column for NM cable and when not sure, the <Val v={WARM} unit="°C" src={TERM} /> column for single
              conductors on terminals listed for it, with the 240.4(D) limits and the Table 250.122 ground wire.
            </p>
            <DataTable id="wire-table" variant="ruled" src={CALC} caption="Wire for a range circuit">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Circuit
                  </th>
                  <th scope="col" className={RTH}>
                    Copper, NM cable
                  </th>
                  <th scope="col" className={RTH}>
                    Copper, <Val v={WARM} unit="°C" src={TERM} />
                  </th>
                  <th scope="col" className={RTH}>
                    Aluminum, <Val v={COLD} unit="°C" src={TERM} />
                  </th>
                  <th scope="col" className={RTH}>
                    Aluminum, <Val v={WARM} unit="°C" src={TERM} />
                  </th>
                  <th scope="col" className={RTH}>
                    Ground, copper
                  </th>
                </tr>
              </thead>
              <tbody>
                {WIRE_ROWS.map((r) => (
                  <tr key={r.circuitA}>
                    <th scope="row" className={clsx(RSTICKY_TD, '!font-normal')}>
                      <Val v={r.circuitA} unit="A" src={OCPD} />
                    </th>
                    <td className={RTD}>
                      <Size s={r.cuCable.size} />
                    </td>
                    <td className={RTD}>
                      <Size s={r.cuWarm.size} />
                    </td>
                    <td className={RTD}>
                      <Size s={r.alCable.size} />
                    </td>
                    <td className={RTD}>
                      <Size s={r.alWarm.size} />
                    </td>
                    <td className={RTD}>{r.egcCu ? <Size s={r.egcCu} /> : '–'}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <SourceLine domains={[AMP, TERM, SMALL, EGC, MFR_DOMAIN]} />
          </section>

          <section aria-labelledby="cord" className="space-y-5">
            <h2 id="cord" className={H2}>
              Cord, receptacle and GFCI
            </h2>
            <p className={P} data-src={NEMA_DOMAIN}>
              A cord-connected range plugs into a NEMA {R14.config} (rated <Val v={R14.amps} unit="A" src={NEMA_DOMAIN} />, {R14.volts} V,{' '}
              <Num v={R14.poles} src={NEMA_DOMAIN} />
              -pole, <Num v={R14.wires} src={NEMA_DOMAIN} />
              -wire with a ground) or an older {R10.config} (<Num v={R10.poles} src={NEMA_DOMAIN} />
              -pole, <Num v={R10.wires} src={NEMA_DOMAIN} />
              -wire, no ground).{' '}
              <span data-src={MFR_DOMAIN}>
                Whirlpool recommends the 4-wire {WHIRLPOOL_RANGE.receptacle4Wire} and allows the 3-wire {WHIRLPOOL_RANGE.receptacle3Wire} only where
                local codes permit. Frigidaire calls for the 4-wire connection in mobile homes, new installations and recreational vehicles, and where
                local codes do not permit grounding through the neutral.
              </span>
            </p>
            <p className={P} data-src={EXC}>
              The 2023 NEC requires GFCI protection for the branch circuit or outlet that supplies an electric range, a wall-mounted oven or a
              counter-mounted cooking unit (210.8(D)). States can amend that rule when they adopt the code:{' '}
              <Link href="/guides/nec-code-compliance" className={LINK}>
                NEC edition by state
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="several" className="space-y-5">
            <h2 id="several" className={H2}>
              Several appliances: Table 220.55
            </h2>
            <p className={P} data-src={L}>
              For a feeder or service, Table 220.55 counts all of a building&apos;s household cooking appliances rated over{' '}
              <Val v={TABLE_220_55.minKw} unit="kW" src={L} /> together. Column C gives the load for a number of appliances up to{' '}
              <Val v={N1.fromKw} unit="kW" src={L} /> each. Under Note 3, appliances over <Val v={TABLE_220_55.minKw} unit="kW" src={L} /> through{' '}
              <Val v={TABLE_220_55.columnBMaxKw} unit="kW" src={L} /> may instead have their nameplates added and multiplied by the Column A percent
              (under <Val v={TABLE_220_55.columnABelowKw} unit="kW" src={L} />) or the Column B percent. Note 2 averages ranges of different ratings
              over <Val v={TABLE_220_55.columnBMaxKw} unit="kW" src={L} />, counting any under <Val v={N1.fromKw} unit="kW" src={L} /> as{' '}
              <Val v={N1.fromKw} unit="kW" src={L} />, before Note 1.
            </p>
            <DataTable id="several-table" variant="ruled" src={L} caption="NEC 2023 Table 220.55, the first ten rows" className="max-w-[30rem]">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Appliances
                  </th>
                  <th scope="col" className={RTH}>
                    Column A
                  </th>
                  <th scope="col" className={RTH}>
                    Column B
                  </th>
                  <th scope="col" className={RTH}>
                    Column C
                  </th>
                </tr>
              </thead>
              <tbody>
                {SEVERAL.map((r) => (
                  <tr key={r.minCount}>
                    <th scope="row" className={clsx(RSTICKY_TD, '!font-normal')}>
                      <Num v={r.minCount} src={L} />
                    </th>
                    <td className={RTD}>
                      <Val v={r.aPct} unit="%" src={L} />
                    </td>
                    <td className={RTD}>
                      <Val v={r.bPct} unit="%" src={L} />
                    </td>
                    <td className={RTD}>
                      <Val v={r.cBaseKw} unit="kW" src={L} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className={P}>
              The{' '}
              <Link href="/calculators/residential-load-calculator" className={LINK}>
                residential load calculator
              </Link>{' '}
              puts a range into a whole dwelling&apos;s load by both NEC methods.
            </p>
            <SourceLine domains={[L]} />
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR_DOMAIN}>
                What size wire for a <Val v={C40} unit="A" src={MFR_DOMAIN} /> range circuit?
              </h3>
              <p className={P} data-src={CALC}>
                <Size s={W40.cuCable.size} /> copper in NM cable (<Val v={W40.cuCable.ampacity} unit="A" src={AMP} /> at{' '}
                <Val v={COLD} unit="°C" src={AMP} />) or <Size s={W40.alCable.size} /> aluminum, with {W40.egcCu ? <Size s={W40.egcCu} /> : null} copper as
                the ground wire.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR_DOMAIN}>
                What size wire for a <Val v={C50} unit="A" src={MFR_DOMAIN} /> range circuit?
              </h3>
              <p className={P} data-src={CALC}>
                <Size s={W50.cuCable.size} /> copper in NM cable (<Val v={W50.cuCable.ampacity} unit="A" src={AMP} /> at{' '}
                <Val v={COLD} unit="°C" src={AMP} />), or <Size s={W50.cuWarm.size} /> copper as single conductors on terminals listed for{' '}
                <Val v={WARM} unit="°C" src={TERM} /> (<Val v={W50.cuWarm.ampacity} unit="A" src={AMP} />); <Size s={W50.alCable.size} /> aluminum in
                cable.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src="input">
                What size breaker for a <Val v={12} unit="kW" src="input" /> range?
              </h3>
              <p className={P} data-src={CALC}>
                Table 220.55 counts it as {kw(EXAMPLE.loadKw)}, or {a2(EXAMPLE.amps)} at <Val v={240} unit="V" src="input" />, and the breaker must be at
                least that.{' '}
                <span data-src={MFR_DOMAIN}>
                  The rating to use is the one in the range&apos;s instructions: {circuits(WROW1.circuitsA)} for a Whirlpool freestanding range of that
                  rating.
                </span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src="input">
                What circuit for a <Val v={COMBO_AMPS.oven} unit="A" src="input" /> oven and a <Val v={COMBO_AMPS.cooktop} unit="A" src="input" />{' '}
                cooktop?
              </h3>
              <p className={P} data-src={CALC}>
                On one circuit in the same room they count as one range of {kw(COMBO.equivalentRangeKw as number)}, so {kw(COMBO.loadKw)} or{' '}
                {a2(COMBO.amps)} at <Val v={240} unit="V" src="input" />. On two circuits each carries its own nameplate current. The appliances&apos;
                instructions give the circuit ratings.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does an electric range need GFCI protection?</h3>
              <p className={P} data-src={EXC}>
                Under the 2023 NEC, yes: 210.8(D) covers the branch circuit or outlet of electric ranges, wall-mounted ovens and counter-mounted cooking
                units. Check your state&apos;s adoption for amendments.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR_DOMAIN}>
                3-wire or 4-wire for a range?
              </h3>
              <p className={P} data-src={MFR_DOMAIN}>
                4-wire, with a separate ground, in new installations: Whirlpool recommends it and Frigidaire requires it there. The 3-wire{' '}
                {WHIRLPOOL_RANGE.receptacle3Wire} has no ground and Whirlpool allows it only where local codes permit.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[L, AMP, TERM, SMALL, OCPD, EGC, MFR_DOMAIN, NEMA_DOMAIN, EXC]}
              hrefs={{ [MFR_DOMAIN]: WHIRLPOOL_RANGE.url }}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#range-method" className={LINK}>
                methodology page
              </Link>{' '}
              sets out each step and each source. Values from a maker&apos;s instructions apply to that maker&apos;s appliances. NFPA 70®, National
              Electrical Code® and NEC® are registered trademarks of the National Fire Protection Association; wiresizes.com is not affiliated with or
              endorsed by NFPA.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
