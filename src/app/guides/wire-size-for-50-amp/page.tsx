import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { Byline } from '@/components/content/Byline';
import { DataTable, RSTICKY_TD, RSTICKY_TH, RTD, RTH } from '@/components/content/DataTable';
import { Figure } from '@/components/content/Figure';
import { Size } from '@/components/content/Size';
import { SourceLine } from '@/components/content/SourceLine';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { AmpDropChart, AmpLadder } from '@/components/look/Charts';
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
import { AMP_VOLTS, DROP_50_LENGTHS, GUIDE_50, wireSizeLink } from '@/lib/amp-guide';
import type { AmpPick } from '@/lib/amp-guide';
import { RV_OUTLETS } from '@/lib/calculations/rv-hookup';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import type { DropRun } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import type { SizeKey } from '@/lib/verified/awg';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { TABLE_AMBIENT } from '@/lib/verified/nec-310-16';
import { NM_CABLE } from '@/lib/verified/nec-separate-buildings';

// /guides/wire-size-for-50-amp (WSZ-041; research/kw: primary "wire size for 50 amp"): the 50 A answer from Table 310.16
// at the column 110.14(C)(1)(a) sets for circuits of 100 A or less (nec-310-16, nec-110-14c), NM cable held at 60 °C by
// 334.80 (nec-cable-rules), 8 AWG copper's 60 °C value a standard rating so 240.4(B) does not reach 50 A (nec-240-ocpd),
// the three 50 A receptacles (nema-receptacle-configs) and the loads other pages size (mfr-dryer-range, nec-625-ev,
// mfr-spas, mfr-welders), a feeder to a separate building (250.32(B)(1): nec-250-32; 225.31 and 225.39:
// nec-feeders-outbuildings), the Table 250.122 ground wire (nec-250-grounding), the voltage drop at 75 °C
// (conductor-resistance-20c; the 215.2(A) note, nec-continuous-load), 240.4(D) for 10 AWG (nec-240-4-d) and Table
// 240.4(G)'s air-conditioning row (nec-440-hvac). Every value comes from src/lib/amp-guide.ts. Never 230.79, 250.140,
// 551.81, 340.80 or a conduit size for the set (mixed sizes need Chapter 9 Table 5, not verified).
const ROUTE = '/guides/wire-size-for-50-amp';
const URL = `https://wiresizes.com${ROUTE}`;

const G = GUIDE_50;
const { nm: NM, c75: C75, egc: EGC, run: RUN, noteFt: NOTE_FT, outlets: OUT_CFG } = G;
if (!/^\d+$/.test(NM.cu.size) || !/^\d+$/.test(C75.cu.size)) throw new Error('50 A guide: the title expects plain AWG sizes');
if (RV_OUTLETS['1450'].config !== OUT_CFG.f1450.config || RV_OUTLETS['1450'].breakerA !== G.ratingA) throw new Error("50 A guide: the RV outlet changed");

const TITLE = `Wire Size for ${G.ratingA} Amp Breaker: ${NM.cu.size} or ${C75.cu.size} AWG Copper`;
const DESCRIPTION =
  `A ${G.ratingA} A breaker takes ${NM.cu.size} AWG copper or ${NM.al.size} AWG aluminum in NM cable or at ${G.low} °C terminals, ` +
  `${C75.cu.size} AWG copper or ${C75.al.size} AWG aluminum at ${G.high} °C, with a ${EGC.cu} AWG copper ground.`;

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

const AMP = 'nec-310-16';
const TERM = 'nec-110-14c';
const CABLE = 'nec-cable-rules';
const OCPD = 'nec-240-ocpd';
const SMALL = 'nec-240-4-d';
const LOAD = 'nec-continuous-load';
const GND = 'nec-250-grounding';
const OUTB = 'nec-feeders-outbuildings';
const SEP = 'nec-250-32';
const SVC = 'nec-310-12';
const NEMA = 'nema-receptacle-configs';
const RANGE = 'mfr-dryer-range';
const EV = 'nec-625-ev';
const SPAS = 'mfr-spas';
const WELD = 'mfr-welders';
const HVAC = 'nec-440-hvac';
const RES = 'conductor-resistance-20c';
const VD = 'calc:voltage-drop';

// phones: the three-column tables' header widths and padding give way so they fit 390 px
const TIGHT_TH = 'max-sm:!min-w-0 max-sm:!px-2';
const TIGHT_TD = 'max-sm:!px-2';
/** A row header that names a use in words: the body face, wrapping. */
const USE_TH = '!whitespace-normal !font-display !font-normal';
/** A cell of words: the body face, wrapping, left-aligned. */
const WORDS_TD = '!whitespace-normal !font-display !text-left';

const TOC: ([string, string] | [string, string, string])[] = [
  ['column', `${NM.cu.size} or ${C75.cu.size} AWG: the terminals decide`, TERM],
  ['nm-cable', `NM cable on a ${G.ratingA} A breaker`, CABLE],
  ['outlet', `A ${G.ratingA} A outlet`, NEMA],
  ['subpanel', `A ${G.ratingA} A subpanel or service`, OCPD],
  ['ground', `Ground wire for ${G.ratingA} A`, GND],
  ['distance', `${G.ratingA} A at ${AMP_VOLTS} V: how far each size goes`, VD],
  ['ampacities', `Ampacity of the sizes around ${G.ratingA} A`, AMP],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: `Wire Size for ${G.ratingA} Amp Breaker`, description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

function A({ v, src = OCPD }: { v: number; src?: string }) {
  return <Val v={v} unit="A" src={src} />;
}
function C({ v }: { v: number }) {
  return <Val v={v} unit="°C" src={TERM} />;
}
function Pair({ cu, al }: { cu: SizeKey; al: SizeKey }) {
  return (
    <>
      <Size s={cu} /> copper or <Size s={al} /> aluminum
    </>
  );
}
function Picks({ p }: { p: { cu: AmpPick; al: AmpPick } }) {
  return <Pair cu={p.cu.size} al={p.al.size} />;
}
function Drop({ run }: { run: DropRun }) {
  return (
    <>
      <Val v={run.vdVolts} unit="V" src={VD} format={{ fixed: 2 }} /> (<Val v={run.vdPct} unit="%" src={VD} format={{ fixed: 2 }} />)
    </>
  );
}
function Ft({ v }: { v: number }) {
  return <Val v={v} unit="ft" src={VD} format={{ fixed: 0 }} />;
}
function Cfg({ c }: { c: string }) {
  return <span className="whitespace-nowrap">{c}</span>;
}

/** One material's ladder: each size's ampacity in the 60 and 75 °C columns of Table 310.16. */
function AmpacityTable({ material }: { material: 'cu' | 'al' }) {
  const name = material === 'cu' ? 'Copper' : 'Aluminum';
  return (
    <DataTable id={`ampacities-${material}`} variant="ruled" src={AMP} caption={`${name}: Table 310.16 ampacity, A`}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Size
          </th>
          <th scope="col" className={RTH}>
            <Val v={G.low} unit="°C" src={AMP} />
          </th>
          <th scope="col" className={RTH}>
            <Val v={G.high} unit="°C" src={AMP} />
          </th>
        </tr>
      </thead>
      <tbody>
        {G.ladder[material].map((r) => (
          <tr key={r.size}>
            <th scope="row" className={RSTICKY_TD}>
              <Size s={r.size} />
            </th>
            <td className={RTD}>
              <Val v={r.a60} unit="A" src={AMP} />
            </td>
            <td className={RTD}>
              <Val v={r.a75} unit="A" src={AMP} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

/** One material's lengths: how far the full rating runs on each size before the drop reaches the note's 3 %. */
function LengthTable({ material }: { material: 'cu' | 'al' }) {
  const name = material === 'cu' ? 'Copper' : 'Aluminum';
  return (
    <DataTable id={`lengths-${material}`} variant="ruled" src={VD} caption={`${name}: one-way length to a ${VOLTAGE_DROP_NOTE.feederPct} % drop, ft`}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Size
          </th>
          <th scope="col" className={RTH}>
            Length
          </th>
        </tr>
      </thead>
      <tbody>
        {G.lengths[material].map((r) => (
          <tr key={r.size}>
            <th scope="row" className={RSTICKY_TD}>
              <Size s={r.size} />
            </th>
            <td className={RTD}>
              <Ft v={r.ft} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

/** What lands on a receptacle, from its NEMA ratings: a 125/250 V device has a neutral pole, the rest are hots. */
const OUTLET_ROWS = [OUT_CFG.f1450, OUT_CFG.f650, OUT_CFG.f1050].map((o) => {
  const neutral = o.volts.includes('/');
  const hots = o.poles - (neutral ? 1 : 0);
  if (hots !== 2 || o.wires !== o.poles + (o.grounding ? 1 : 0)) throw new Error(`50 A guide: ${o.config} no longer reads as two hots`);
  return { ...o, neutral };
});

export default function WireSizeFor50AmpPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main={`Wire Size for ${G.ratingA} Amp Breaker`} sub={`${NM.cu.size} or ${C75.cu.size} AWG Copper`} joiner=": " src={AMP} />
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
          <div className="space-y-4">
            <p className={LOOK_LEAD} data-src={AMP}>
              <strong>
                A <A v={G.ratingA} /> breaker takes <Picks p={NM} /> from the <C v={G.low} /> column of NEC Table 310.16, the column for NM
                cable and for terminals rated <C v={G.low} />.
              </strong>{' '}
              <span data-src={TERM}>
                Where the breaker and every other termination are listed and identified for <C v={G.high} /> conductors, single conductors of{' '}
                <Picks p={C75} /> are enough.
              </span>
            </p>
            <p className={P} data-src={GND}>
              The ground wire is <Pair cu={EGC.cu} al={EGC.al} /> (Table 250.122).{' '}
              <span data-src={CABLE}>
                In NM cable, <Size s={C75.cu.size} /> copper carries only <A v={G.shortAt60} src={AMP} />, which is why the cable answer is{' '}
                <Size s={NM.cu.size} />.
              </span>
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={AMP}>
                  The ampacity of the sizes around <A v={G.ratingA} /> in the <C v={G.low} /> column (open dots) and the <C v={G.high} /> column
                  (filled). <Size s={C75.cu.size} /> copper reaches <A v={G.ratingA} /> only in the <C v={G.high} /> column;{' '}
                  <Size s={NM.cu.size} /> copper passes it in both.
                </span>
                <SourceLine domains={[AMP, TERM]} />
              </>
            }
          >
            <AmpLadder guide={G} />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="column" className="space-y-5">
            <h2 id="column" className={H2} data-src={TERM}>
              {NM.cu.size} or <Size s={C75.cu.size} />: the terminals decide
            </h2>
            <p className={P} data-src={TERM}>
              Under 110.14(C), the temperature rating used for a conductor&apos;s ampacity may not exceed that of any termination, conductor or
              device it connects to. For circuits rated <A v={TERMINATION_RULES.limitA} src={TERM} /> or less, 110.14(C)(1)(a) starts from the{' '}
              <C v={G.low} /> column. Conductors with a higher rating may be used, but at their <C v={G.low} /> ampacity, unless the equipment is
              listed and identified for use with the higher-rated conductors.
            </p>
            <p className={P} data-src={AMP}>
              That splits the <A v={G.ratingA} /> answer. <Size s={C75.cu.size} /> copper carries <A v={G.shortAt60} src={AMP} /> at <C v={G.low} />{' '}
              and <A v={C75.cu.ampacity} src={AMP} /> at <C v={G.high} />, so it works only where the breaker, the panel and every device on the
              circuit are listed and identified for <C v={G.high} /> conductors. <Size s={NM.cu.size} /> copper carries{' '}
              <A v={NM.cu.ampacity} src={AMP} /> at <C v={G.low} /> and needs no such check. In aluminum the pair is <Size s={C75.al.size} /> (
              <A v={C75.al.ampacity} src={AMP} /> at <C v={G.high} />) and <Size s={NM.al.size} /> (<A v={NM.al.ampacity} src={AMP} /> at{' '}
              <C v={G.low} />).
            </p>
            <p className={P} data-src={AMP}>
              THHN is rated <Val v={G.thhn.c} unit="°C" src={AMP} />, and Table 310.16 gives <Size s={C75.cu.size} /> copper{' '}
              <A v={G.thhn.a} src={AMP} /> in that column. <span data-src={TERM}>Under 110.14(C) the circuit still uses the column of its terminals.</span>
            </p>
            <DataTable id="by-wiring-50" variant="ruled" src={AMP} caption={`Wire for a ${G.ratingA} A breaker, by wiring method`}>
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH, TIGHT_TH)}>
                    Wiring
                  </th>
                  <th scope="col" className={clsx(RTH, TIGHT_TH)}>
                    Copper
                  </th>
                  <th scope="col" className={clsx(RTH, TIGHT_TH)}>
                    Aluminum
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, USE_TH, TIGHT_TD)} data-src={TERM}>
                    NM cable, or terminals rated <C v={G.low} />
                  </th>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={NM.cu.size} />
                  </td>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={NM.al.size} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, USE_TH, TIGHT_TD)} data-src={TERM}>
                    Single conductors, every termination listed and identified for <C v={G.high} />
                  </th>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={C75.cu.size} />
                  </td>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={C75.al.size} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, USE_TH, TIGHT_TD)} data-src={GND}>
                    Ground wire, Table 250.122
                  </th>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={EGC.cu} />
                  </td>
                  <td className={clsx(RTD, TIGHT_TD)}>
                    <Size s={EGC.al} />
                  </td>
                </tr>
              </tbody>
            </DataTable>
            <p className={P}>
              For a run through a hot attic, or more than three current-carrying wires in one conduit, the{' '}
              <Link href={wireSizeLink(G.ratingA)} className={LINK}>
                wire size calculator
              </Link>{' '}
              opens on this breaker and applies the corrections.
            </p>
          </section>

          <section aria-labelledby="nm-cable" className="space-y-4">
            <h2 id="nm-cable" className={H2} data-src={CABLE}>
              NM cable on a <A v={G.ratingA} /> breaker
            </h2>
            <p className={P} data-src={CABLE}>
              NM cable stays in the <Val v={NM_CABLE.maxColumnC} unit="°C" src={CABLE} /> column whatever its terminations: 334.80 holds its
              ampacity to that of a <Val v={NM_CABLE.maxColumnC} unit="°C" src={CABLE} /> conductor. Its{' '}
              <Val v={NM_CABLE.correctionsFromC} unit="°C" src={CABLE} /> rating may be the starting point for temperature and bundling
              corrections, but the result may not exceed the <Val v={NM_CABLE.maxColumnC} unit="°C" src={CABLE} /> value.
            </p>
            <p className={P} data-src={OCPD}>
              So <A v={G.ratingA} /> in NM cable means <Size s={NM.cu.size} /> copper, which carries <A v={NM.cu.ampacity} src={AMP} />.{' '}
              <Size s={C75.cu.size} /> cable carries <A v={G.shortAt60} src={AMP} />, and since that is itself a standard rating in Table 240.6(A),
              the next-size-up allowance of 240.4(B), which covers only ampacities that fall between standard ratings, does not reach{' '}
              <A v={G.ratingA} />.
            </p>
          </section>

          <section aria-labelledby="outlet" className="space-y-5">
            <h2 id="outlet" className={H2} data-src={NEMA}>
              A <A v={G.ratingA} src={NEMA} /> outlet
            </h2>
            <p className={P} data-src={NEMA}>
              Three NEMA receptacles carry a <A v={G.ratingA} src={NEMA} /> rating. They differ in voltage and in the wires that land on them,
              and the older <Cfg c={OUT_CFG.f1050.config} /> has no ground. Behind any of them the wire is the circuit&apos;s:{' '}
              <Size s={NM.cu.size} /> copper in NM cable.
            </p>
            <DataTable id="outlets-50" variant="ruled" src={NEMA} caption={`The ${G.ratingA} A receptacles`}>
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH, TIGHT_TH)}>
                    Receptacle
                  </th>
                  <th scope="col" className={clsx(RTH, TIGHT_TH)}>
                    Volts
                  </th>
                  <th scope="col" className={clsx(RTH, TIGHT_TH)}>
                    Wires
                  </th>
                </tr>
              </thead>
              <tbody>
                {OUTLET_ROWS.map((o) => (
                  <tr key={o.config}>
                    <th scope="row" className={clsx(RSTICKY_TD, TIGHT_TD)}>
                      {o.config}
                    </th>
                    <td className={clsx(RTD, TIGHT_TD)}>{o.volts} V</td>
                    <td className={clsx(RTD, TIGHT_TD, WORDS_TD)}>
                      {o.wires}: two hots{o.neutral ? ', a neutral' : ''}
                      {o.grounding ? ' and a ground' : ', no ground'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <ul className={clsx(P, 'list-disc space-y-2 pl-5')}>
              <li data-src={RANGE}>
                {G.range.brand}&apos;s freestanding electric ranges take a {OUT_CFG.f1450.wires}-wire cord on a <Cfg c={OUT_CFG.f1450.config} />,
                or a {OUT_CFG.f1050.wires}-wire cord on a <Cfg c={OUT_CFG.f1050.config} /> only where local codes permit. The{' '}
                <Link href="/calculators/range-calculator" className={LINK}>
                  range calculator
                </Link>{' '}
                works out a range&apos;s load from its rating.
              </li>
              <li data-src={NEMA}>
                An RV&apos;s <A v={G.ratingA} src={NEMA} /> outlet is a <Cfg c={OUT_CFG.f1450.config} />; the{' '}
                <Link href="/calculators/rv-hookup-calculator" className={LINK}>
                  RV hookup calculator
                </Link>{' '}
                sizes it for your run.
              </li>
              <li data-src={EV}>
                An EV charger set to a <A v={G.ev.outputA} src={EV} /> output goes on a <A v={G.ev.breakerA} src={EV} /> breaker, because 625.41
                calls for a breaker of at least <Val v={G.ev.percent} unit="%" src={EV} /> of the output. The{' '}
                <Link href="/guides/wire-size-for-ev-charger" className={LINK}>
                  EV charger wire guide
                </Link>{' '}
                covers plug-in and hardwired chargers.
              </li>
              <li data-src={SPAS}>
                {G.spaMakers.slice(0, -1).join(', ')} and {G.spaMakers[G.spaMakers.length - 1]} each list a <A v={G.ratingA} src={SPAS} /> circuit
                at <Val v={AMP_VOLTS} unit="V" src={SPAS} /> for their hot tubs, run with four wires. The{' '}
                <Link href="/calculators/hot-tub-calculator" className={LINK}>
                  hot tub calculator
                </Link>{' '}
                sizes it.
              </li>
              <li data-src={WELD}>
                {G.stick.brand}&apos;s {G.stick.model} welder plugs into a <Cfg c={OUT_CFG.f650.config} />. The{' '}
                <Link href="/calculators/welder-calculator" className={LINK}>
                  welder calculator
                </Link>{' '}
                sizes a welder&apos;s circuit from its own input current.
              </li>
            </ul>
          </section>

          <section aria-labelledby="subpanel" className="space-y-4">
            <h2 id="subpanel" className={H2} data-src={OCPD}>
              A <A v={G.ratingA} /> subpanel or service
            </h2>
            <p className={P} data-src={AMP}>
              A <A v={G.ratingA} /> feeder to a subpanel is sized the same way, from Table 310.16 at the column its terminations allow:{' '}
              <Picks p={NM} /> at <C v={G.low} />, <Picks p={C75} /> at <C v={G.high} />.{' '}
              <span data-src={SVC}>
                Table 310.12, for a <span className="whitespace-nowrap">120/240 V</span> single-phase service, or a feeder, that carries the entire
                load of a one-family dwelling or of one dwelling unit, starts at <A v={G.serviceFromA} src={SVC} />, so it has no <A v={G.ratingA} /> row.
              </span>
            </p>
            <p className={P} data-src={SEP}>
              A feeder to a separate building, such as a detached garage or shop, runs four wires: two hots, the neutral and an equipment
              grounding conductor (250.32(B)(1)). At that building the neutral is not connected to the equipment grounding conductor or to the
              grounding electrode.
            </p>
            <p className={P} data-src={OUTB}>
              The building gets its own disconnecting means (225.31), and 225.39 sets its least rating: <A v={G.disconnect.others} src={OUTB} />{' '}
              for a garage or other building, more than the <A v={G.ratingA} /> feeder that supplies it, unless the building has no more than two
              2-wire circuits (<A v={G.disconnect.twoCircuits} src={OUTB} />) or a single circuit (<A v={G.disconnect.oneCircuit} src={OUTB} />). The{' '}
              <Link href="/calculators/garage-subpanel-calculator" className={LINK}>
                garage subpanel calculator
              </Link>{' '}
              sizes the feeder for other breakers and gives the burial depth.
            </p>
          </section>

          <section aria-labelledby="ground" className="space-y-4">
            <h2 id="ground" className={H2} data-src={GND}>
              Ground wire for <A v={G.ratingA} />
            </h2>
            <p className={P} data-src={GND}>
              Table 250.122 sizes the equipment grounding conductor by the breaker ahead of it. A <A v={G.ratingA} /> breaker falls in the row for
              breakers up to <A v={EGC.rowA} src={GND} />: <Pair cu={EGC.cu} al={EGC.al} />, whichever column sized the circuit wires. Going up a
              size for a long run changes that: 250.122(B) increases the ground wire in proportion to the area of the larger circuit wires. The{' '}
              <Link href="/calculators/ground-wire-calculator" className={LINK}>
                ground wire calculator
              </Link>{' '}
              does that arithmetic.
            </p>
          </section>

          <section aria-labelledby="distance" className="space-y-5">
            <h2 id="distance" className={H2} data-src={VD}>
              <A v={G.ratingA} /> at <Val v={AMP_VOLTS} unit="V" src={VD} />: how far each size goes
            </h2>
            <p className={P} data-src={VD}>
              Table 310.16 sizes a circuit for its current, not its length. At the full <A v={G.ratingA} /> over{' '}
              <Val v={RUN.lengthFt} unit="ft" src={VD} />, single-phase at <Val v={AMP_VOLTS} unit="V" src={VD} /> with the conductors at{' '}
              <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} />: <Size s={NM.cu.size} /> copper drops <Drop run={RUN.cuNm} />,{' '}
              <Size s={NM.al.size} /> aluminum <Drop run={RUN.alNm} />, <Size s={C75.cu.size} /> copper <Drop run={RUN.cu75} /> and{' '}
              <Size s={C75.al.size} /> aluminum <Drop run={RUN.al75} />.
            </p>
            <p className={P} data-src={LOAD}>
              For feeders, an informational note to 215.2(A) says that conductors sized to keep the drop at the farthest outlet under{' '}
              <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />, with no more than <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={LOAD} />{' '}
              on feeder and branch circuits together, will provide reasonable efficiency. It is advice, not a limit.{' '}
              <span data-src={VD}>
                At the full rating, <Size s={C75.cu.size} /> copper reaches <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> at{' '}
                <Ft v={NOTE_FT.cu75} />, <Size s={NM.cu.size} /> copper at <Ft v={NOTE_FT.cuNm} />, <Size s={C75.al.size} /> aluminum at{' '}
                <Ft v={NOTE_FT.al75} /> and <Size s={NM.al.size} /> aluminum at <Ft v={NOTE_FT.alNm} />.
              </span>
            </p>
            <Figure
              caption={
                <>
                  <span data-src={VD}>
                    Voltage drop of a <A v={G.ratingA} /> circuit at full load, single-phase at <Val v={AMP_VOLTS} unit="V" src={VD} />, against
                    one-way length: the <C v={G.low} /> sizes as solid lines, the <C v={G.high} /> sizes dashed, with the 215.2(A) note&apos;s{' '}
                    <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />.
                  </span>
                  <SourceLine domains={[AMP, RES, LOAD]} />
                </>
              }
            >
              <AmpDropChart guide={G} lengths={DROP_50_LENGTHS} />
            </Figure>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <LengthTable material="cu" />
              <LengthTable material="al" />
            </div>
            <p className={P} data-src={VD}>
              The drop falls in proportion to the current, so a lighter load drops less. If you go up a size for distance, the ground wire grows
              with it (250.122(B)), and the{' '}
              <Link href={wireSizeLink(G.ratingA, { length: RUN.lengthFt })} className={LINK}>
                wire size calculator
              </Link>{' '}
              sizes both for your length and load.
            </p>
          </section>

          <section aria-labelledby="ampacities" className="space-y-5">
            <h2 id="ampacities" className={H2} data-src={AMP}>
              Ampacity of the sizes around <A v={G.ratingA} />
            </h2>
            <p className={P} data-src={AMP}>
              The sizes from one below the <C v={G.high} /> answer to one past the <C v={G.low} /> answer, with their ampacity in both columns of{' '}
              <Link href="/guides/nec-table-310-16" className={LINK}>
                NEC Table 310.16
              </Link>
              , which assumes an ambient temperature of <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} /> and no more than three current-carrying
              conductors together. The{' '}
              <Link href="/guides/awg-wire-size-chart" className={LINK}>
                AWG wire size chart
              </Link>{' '}
              gives each gauge&apos;s diameter and resistance.
            </p>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <AmpacityTable material="cu" />
              <AmpacityTable material="al" />
            </div>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size wire for a <A v={G.ratingA} /> service?
              </h3>
              <p className={P} data-src={SVC}>
                Table 310.12 starts at <A v={G.serviceFromA} src={SVC} />, so a <A v={G.ratingA} /> service or feeder
                takes the Table 310.16 sizes: <span data-src={AMP}><Picks p={NM} /> at <C v={G.low} /> terminals, <Picks p={C75} /> where every
                termination is listed and identified for <C v={G.high} /> conductors.</span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={VD}>
                What size wire for a <A v={G.ratingA} /> subpanel <Val v={RUN.lengthFt} unit="ft" src={VD} /> away?
              </h3>
              <p className={P} data-src={VD}>
                At the full <A v={G.ratingA} /> over <Val v={RUN.lengthFt} unit="ft" src={VD} /> at <Val v={AMP_VOLTS} unit="V" src={VD} />,{' '}
                <Size s={NM.cu.size} /> copper drops <Val v={RUN.cuNm.vdPct} unit="%" src={VD} format={{ fixed: 2 }} /> and <Size s={NM.al.size} />{' '}
                aluminum <Val v={RUN.alNm.vdPct} unit="%" src={VD} format={{ fixed: 2 }} />, inside the{' '}
                <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> of the 215.2(A) note. <Size s={C75.cu.size} /> copper, allowed with{' '}
                <C v={G.high} /> terminations, drops <Val v={RUN.cu75.vdPct} unit="%" src={VD} format={{ fixed: 2 }} />. To a detached building the
                feeder runs four wires.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={GND}>
                What size ground wire for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={GND}>
                <Pair cu={EGC.cu} al={EGC.al} />, from the <A v={EGC.rowA} src={GND} /> row of Table 250.122, and larger in proportion when the
                circuit wires are upsized for distance (250.122(B)).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={NEMA}>
                What wire does a <A v={G.ratingA} src={NEMA} /> outlet need?
              </h3>
              <p className={P} data-src={NEMA}>
                A <Cfg c={OUT_CFG.f1450.config} /> takes two hots, a neutral and a ground; a <Cfg c={OUT_CFG.f650.config} /> two hots and a ground.
                Size them like the circuit: <Size s={NM.cu.size} /> copper in NM cable.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                What size aluminum wire for <A v={G.ratingA} />?
              </h3>
              <p className={P} data-src={AMP}>
                <Size s={NM.al.size} /> at <C v={G.low} /> terminals, <Size s={C75.al.size} /> where every termination is listed and identified for{' '}
                <C v={G.high} /> conductors, with an <Size s={EGC.al} /> aluminum ground wire.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Can <Size s={C75.cu.size} /> wire go on a <A v={G.ratingA} /> breaker?
              </h3>
              <p className={P} data-src={TERM}>
                Yes, as single conductors, such as THHN in conduit, where the breaker and every other termination are listed and identified for{' '}
                <C v={G.high} /> conductors: <Size s={C75.cu.size} /> copper carries <A v={C75.cu.ampacity} src={AMP} /> there. Not in NM cable,
                which holds it to <A v={G.shortAt60} src={AMP} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={OCPD}>
                Can <Size s="10" /> wire go on a <A v={G.ratingA} /> breaker?
              </h3>
              <p className={P} data-src={SMALL}>
                Not on an ordinary circuit: 240.4(D) protects <Size s="10" /> copper at <A v={G.tenLimitA} src={SMALL} /> at most.{' '}
                <span data-src={HVAC}>
                  Air conditioners are the usual exception. Table 240.4(G) sends their circuits to Article 440, where the wire is sized to the
                  nameplate&apos;s minimum circuit ampacity, so the breaker the nameplate allows can be larger than 240.4(D) would let the wire
                  have. The{' '}
                  <Link href="/calculators/air-conditioner-calculator" className={LINK}>
                    air conditioner calculator
                  </Link>{' '}
                  applies those rules.
                </span>
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, TERM, CABLE, OCPD, SMALL, GND, SVC, SEP, OUTB, NEMA, RANGE, EV, SPAS, WELD, HVAC, LOAD, RES]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#terminals" className={LINK}>
                methodology page
              </Link>{' '}
              describes each source and how the values are found. NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the
              National Fire Protection Association; wiresizes.com is not affiliated with or endorsed by NFPA.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
