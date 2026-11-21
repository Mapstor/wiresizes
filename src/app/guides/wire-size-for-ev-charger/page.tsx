import type { Metadata } from 'next';
import Link from 'next/link';
import { AmpGuideLink } from '@/components/content/AmpGuideLink';
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
import { EvCircuitChart, EvDropChart } from '@/components/look/Charts';
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
import { articleDates } from '@/lib/page-dates';
import { EMPORIA_PLUG, EV_CP_TOP, EV_HIGH, EV_LOW, EV_PLUG_IN, EV_ROWS, EV_SECOND, EV_TOP, EV_VOLTS, wireSizeLink } from '@/lib/ev-guide';
import type { EvRow } from '@/lib/ev-guide';
import type { SizeKey } from '@/lib/verified/awg';
import { CHARGEPOINT, CHARGEPOINT_CIRCUIT_PCT, CHARGEPOINT_TERMINAL_C, EMPORIA, EVSE_WIRE_C, TESLA, TESLA_TERMINALS } from '@/lib/verified/mfr-evse';
import { DISCONNECT_ABOVE, EV_OCPD_PERCENT, INDIVIDUAL_CIRCUIT, RECEPTACLE_125_250_A } from '@/lib/verified/nec-625';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { CONTINUOUS_LOAD_PERCENT, VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { columnKey, table31016, TABLE_AMBIENT } from '@/lib/verified/nec-310-16';
import { NM_CABLE } from '@/lib/verified/nec-separate-buildings';
import { STANDARD_METHOD } from '@/lib/verified/nec-220-2023';
import { nemaConfig } from '@/lib/verified/nema-receptacle-configs';
import { OUTDOOR_GFCI } from '@/lib/verified/nec-210-8-f';
import { NEC_2026_OUTDOOR_GFCI } from '@/lib/verified/nec-2026-edition';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';

// /guides/wire-size-for-ev-charger (WSZ-008e; spec: research/page-specs-held.md "WSZ-008"; sources: WSZ-031): for each
// charger output Tesla's and ChargePoint's tables share, the breaker 625.41 sets (125 % of the output; 625.42 makes
// charging a continuous load: nec-625-ev), the smallest copper size in the 60 °C column (NM cable under 334.80,
// nec-cable-rules; any 60 °C termination, 110.14(C)(1)(a), nec-110-14c) and in the 75 °C column (nec-310-16), the
// ground wire (Table 250.122, nec-250-grounding), the makers' terminals and plug-in rules (mfr-evse), the receptacle
// and GFCI rules (625.44, 625.54), the 240.4(B) case of ChargePoint's 50 A setting (nec-240-ocpd), the voltage drop
// (conductor-resistance-20c; the 215.2(A) note, nec-continuous-load), 220.57 (nec-220-load-calcs), 210.8(F)
// (nec-2023-rule-excerpts) and the IRS credit dates (irs-30c-credit). Every value comes from src/lib/ev-guide.ts and
// data/verified. No aluminum (the makers take copper only), no conduit sizes, no burial depths.
const ROUTE = '/guides/wire-size-for-ev-charger';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Wire Size for EV Charger: 12 to 4 AWG Copper';
const DESCRIPTION =
  'A 48 A EV charger takes a 60 A breaker and 6 AWG copper at 75 °C terminals or 4 AWG NM cable; a 40 A charger, 50 A and 8 or 6 AWG. Chart and rules.';

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

const EV = 'nec-625-ev';
const MFR = 'mfr-evse';
const AMP = 'nec-310-16';
const TERM = 'nec-110-14c';
const CABLE = 'nec-cable-rules';
const OCPD = 'nec-240-ocpd';
const LOAD = 'nec-continuous-load';
const GND = 'nec-250-grounding';
const RES = 'conductor-resistance-20c';
const LC = 'nec-220-load-calcs';
const NEMA = 'nema-receptacle-configs';
const EXC = 'nec-2023-rule-excerpts';
const IRS = 'irs-30c-credit';
const ED26 = 'nec-2026-edition';
const SIZING = 'calc:conductor-sizing';
const VD = 'calc:voltage-drop';

const TOP = EV_TOP;
const SECOND = EV_SECOND;
const CP = EV_CP_TOP;
const NEMA_14_50 = nemaConfig('14-50R');
const NOTE_C75 = EV_ROWS.map((r) => r.noteFt.c75);
const NOTE_MIN = Math.min(...NOTE_C75);
const NOTE_MAX = Math.max(...NOTE_C75);
const SIZES: SizeKey[] = [...new Set(EV_ROWS.flatMap((r) => [r.c75.size, r.nm.size]))].sort((a, b) => Number(b) - Number(a));
/** A copper size's Table 310.16 ampacity in a column; throws when the table has none. */
function cu(size: SizeKey, column: number): number {
  const a = table31016(size, columnKey('Cu', column as 60 | 75 | 90));
  if (a === null) throw new Error(`EV guide page: no ${column} °C ampacity for ${size}`);
  return a;
}
const below48 = SIZES[SIZES.indexOf(TOP.nm.size) - 1];
const BELOW48_A60 = cu(below48, EV_LOW);
const EIGHT_A60 = cu('8', EV_LOW);
const EIGHT_A75 = cu('8', EV_HIGH);
const THIRTY_TWO: EvRow = (() => {
  const r = EV_ROWS.find((x) => x.outputA === 32);
  if (!r) throw new Error('EV guide page: no 32 A row');
  return r;
})();
if (below48 !== TOP.c75.size) throw new Error('EV guide page: the 48 A paragraph no longer fits the data');
if (CHARGEPOINT_CIRCUIT_PCT !== EV_OCPD_PERCENT) throw new Error('EV guide page: ChargePoint and 625.41 no longer agree');
if (THIRTY_TWO.nm.size !== '8' || SECOND.c75.size !== '8' || SECOND.nm.size === '8') throw new Error('EV guide page: the 8 AWG answer changed');
if (NM_CABLE.maxColumnC !== EV_LOW) throw new Error('EV guide page: 334.80 no longer holds NM cable to the 60 °C column');
if (EV_PLUG_IN.map((r) => r.breakerA).join() !== '40,50' || EMPORIA_PLUG.breakerA !== SECOND.breakerA) {
  throw new Error('EV guide page: the plug-in paragraph no longer fits the makers’ tables');
}
if (!RECEPTACLE_125_250_A.includes(NEMA_14_50.amps) || NEMA_14_50.wires !== 4 || NEMA_14_50.poles !== 3) {
  throw new Error('EV guide page: the 14-50 no longer fits 625.44');
}
if (OUTDOOR_GFCI.maxA !== NEC_2026_OUTDOOR_GFCI.fromA || OUTDOOR_GFCI.maxVoltsToGround !== NEC_2026_OUTDOOR_GFCI.maxVoltsToGround) {
  throw new Error('EV guide page: the 2023 and 2026 210.8(F) sources disagree');
}
if (NEC_2026_OUTDOOR_GFCI.toA !== TOP.breakerA) throw new Error('EV guide page: the 2026 210.8(F) sentence no longer fits the 48 A circuit');

// phones: the chart table's header widths and padding give way so its columns fit 390 px
const TIGHT_TH = 'max-sm:!min-w-0 max-sm:!px-2';
const TIGHT_TD = 'max-sm:!px-2';

const TOC: ([string, string] | [string, string, string])[] = [
  ['chart', 'EV charger wire size chart'],
  ['breaker', `Why the breaker is ${EV_OCPD_PERCENT} % of the output`, EV],
  ['which-column', 'NM cable or single conductors'],
  ['makers', 'What the makers say'],
  ['plug-in', 'Plug-in or hardwired'],
  ['voltage-drop', 'Voltage drop on a long run'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Wire Size for EV Charger', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

function A({ v, src = EV }: { v: number; src?: string }) {
  return <Val v={v} unit="A" src={src} />;
}
function Out({ r }: { r: { outputA: number } }) {
  return <Val v={r.outputA} unit="A" src={MFR} />;
}
function C({ v, src = TERM }: { v: number; src?: string }) {
  return <Val v={v} unit="°C" src={src} />;
}
function Ft({ v }: { v: number }) {
  return <Val v={v} unit="ft" src={VD} format={{ sig: 3 }} />;
}

/** The chart as a table: one row per charger output. */
function ChartTable() {
  return (
    <DataTable id="ev-chart" variant="ruled" src={SIZING} caption={`Level 2 charger circuits at ${EV_VOLTS} V, copper`}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH, TIGHT_TH)}>
            Charger
          </th>
          <th scope="col" className={clsx(RTH, TIGHT_TH)}>
            Breaker
          </th>
          <th scope="col" className={clsx(RTH, TIGHT_TH)} data-src={CABLE}>
            NM cable
          </th>
          <th scope="col" className={clsx(RTH, TIGHT_TH)} data-src={TERM}>
            <C v={EV_HIGH} /> terminals
          </th>
          <th scope="col" className={clsx(RTH, TIGHT_TH)}>
            Ground
          </th>
        </tr>
      </thead>
      <tbody>
        {EV_ROWS.map((r: EvRow) => (
          <tr key={r.outputA}>
            <th scope="row" className={clsx(RSTICKY_TD, TIGHT_TD)}>
              <Out r={r} />
              <span className="block font-figures text-[13px] font-normal text-cut-muted">
                <Val v={r.kw} unit="kW" src={MFR} />
              </span>
            </th>
            <td className={clsx(RTD, TIGHT_TD)}>
              <A v={r.breakerA} />
            </td>
            <td className={clsx(RTD, TIGHT_TD)}>
              <Size s={r.nm.size} />
            </td>
            <td className={clsx(RTD, TIGHT_TD)}>
              <Size s={r.c75.size} />
            </td>
            <td className={clsx(RTD, TIGHT_TD)} data-src={GND}>
              <Size s={r.egc} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

/** Table 310.16 for the sizes the chart uses, copper, both columns. */
function AmpacityTable() {
  return (
    <DataTable id="ev-ampacities" variant="ruled" src={AMP} caption="Copper: Table 310.16 ampacity, A">
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Size
          </th>
          <th scope="col" className={RTH}>
            <C v={EV_LOW} src={AMP} />
          </th>
          <th scope="col" className={RTH}>
            <C v={EV_HIGH} src={AMP} />
          </th>
        </tr>
      </thead>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s}>
            <th scope="row" className={RSTICKY_TD}>
              <Size s={s} />
            </th>
            <td className={RTD}>
              <Val v={cu(s, EV_LOW)} unit="A" src={AMP} />
            </td>
            <td className={RTD}>
              <Val v={cu(s, EV_HIGH)} unit="A" src={AMP} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

/** The three makers side by side. */
function MakersTable() {
  const rows = [
    { m: TESLA, plug: <>No, hardwired only</>, top: TESLA.circuits.find((c) => c.outputA === TOP.outputA) },
    {
      m: CHARGEPOINT,
      plug: (
        <>
          On <A v={EV_PLUG_IN[0].breakerA} src={MFR} /> and <A v={EV_PLUG_IN[1].breakerA} src={MFR} /> circuits
        </>
      ),
      top: CHARGEPOINT.circuits.find((c) => c.outputA === TOP.outputA),
    },
    {
      m: EMPORIA,
      plug: (
        <>
          On a <A v={EMPORIA_PLUG.breakerA} src={MFR} /> circuit
        </>
      ),
      top: EMPORIA.circuits.find((c) => c.outputA === TOP.outputA),
    },
  ];
  return (
    <DataTable id="ev-makers" variant="ruled" src={MFR} caption="What three makers’ instructions say">
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH, TIGHT_TH)}>
            Maker
          </th>
          <th scope="col" className={clsx(RTH, TIGHT_TH)}>
            Largest wire
          </th>
          <th scope="col" className={clsx(RTH, TIGHT_TH, '!text-left')}>
            Plug-in
          </th>
          <th scope="col" className={clsx(RTH, TIGHT_TH)}>
            Breaker at <Out r={TOP} />
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ m, plug, top }) => (
          <tr key={m.id}>
            <th scope="row" className={clsx(RSTICKY_TD, TIGHT_TD, '!whitespace-normal !font-display !font-normal')}>
              <a href={m.url} className={LINK}>
                {m.maker}
              </a>
            </th>
            <td className={clsx(RTD, TIGHT_TD)}>
              <Size s={m.largestAwg} />
            </td>
            <td className={clsx(RTD, TIGHT_TD, '!whitespace-normal !text-left !font-display')}>{plug}</td>
            <td className={clsx(RTD, TIGHT_TD)}>{top ? <A v={top.breakerA} src={MFR} /> : null}</td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

/** The voltage drop chart as a table. */
function DropTable() {
  return (
    <DataTable id="ev-drop" variant="ruled" src={VD} caption={`One-way length at which the full output drops ${VOLTAGE_DROP_NOTE.feederPct} %`}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH, TIGHT_TH)}>
            Charger
          </th>
          <th scope="col" className={clsx(RTH, TIGHT_TH)} data-src={TERM}>
            <C v={EV_HIGH} /> size
          </th>
          <th scope="col" className={clsx(RTH, TIGHT_TH)}>
            Length
          </th>
          <th scope="col" className={clsx(RTH, TIGHT_TH)} data-src={CABLE}>
            NM size
          </th>
          <th scope="col" className={clsx(RTH, TIGHT_TH)}>
            Length
          </th>
        </tr>
      </thead>
      <tbody>
        {EV_ROWS.map((r) => (
          <tr key={r.outputA}>
            <th scope="row" className={clsx(RSTICKY_TD, TIGHT_TD)}>
              <Out r={r} />
            </th>
            <td className={clsx(RTD, TIGHT_TD)}>
              <Size s={r.c75.size} />
            </td>
            <td className={clsx(RTD, TIGHT_TD)}>
              <Ft v={r.noteFt.c75} />
            </td>
            <td className={clsx(RTD, TIGHT_TD)}>
              <Size s={r.nm.size} />
            </td>
            <td className={clsx(RTD, TIGHT_TD)}>
              <Ft v={r.noteFt.nm} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function CalcLinks() {
  return (
    <>
      {EV_ROWS.map((r, k) => (
        <span key={r.outputA}>
          {k > 0 && (k === EV_ROWS.length - 1 ? ' or ' : ', ')}
          <Link href={wireSizeLink(r)} className={LINK}>
            <Out r={r} />
          </Link>
        </span>
      ))}
    </>
  );
}

export default function WireSizeForEvChargerPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Wire Size for EV Charger" sub="12 to 4 AWG Copper" joiner=": " src={SIZING} />
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
          <div className="space-y-4">
            <p className={LOOK_LEAD} data-src={SIZING}>
              <strong>
                A <Out r={TOP} /> charger takes a <AmpGuideLink a={TOP.breakerA} className={LINK}><A v={TOP.breakerA} /> breaker</AmpGuideLink> and <Size s={TOP.c75.size} /> copper where the breaker and
                every termination are rated <C v={EV_HIGH} />, or <Size s={TOP.nm.size} /> in NM cable.
              </strong>{' '}
              A <Out r={SECOND} /> charger takes a <AmpGuideLink a={SECOND.breakerA} className={LINK}><A v={SECOND.breakerA} /> breaker</AmpGuideLink> and <Size s={SECOND.c75.size} /> copper at{' '}
              <C v={EV_HIGH} />, or <Size s={SECOND.nm.size} /> in NM cable.
            </p>
            <p className={P} data-src={EV}>
              Each breaker is <Val v={EV_OCPD_PERCENT} unit="%" src={EV} /> of the charger&apos;s output. The NEC counts EV charging as a
              continuous load (625.42) and sizes its overcurrent protection at <Val v={EV_OCPD_PERCENT} unit="%" src={EV} /> of the
              equipment&apos;s maximum load (625.41).{' '}
              <span data-src={MFR}>Tesla&apos;s and ChargePoint&apos;s own tables give the same breakers.</span>
            </p>
          </div>
          <Figure
            caption={
              <>
                <span data-src={SIZING}>
                  Each charger&apos;s output (filled) inside its breaker (outlined), and the copper it takes in NM cable, held to the{' '}
                  <C v={EV_LOW} src={CABLE} /> column, and as single conductors with every termination rated <C v={EV_HIGH} />. The cross
                  sections are drawn to one scale.
                </span>
                <SourceLine domains={[MFR, EV, AMP, CABLE, TERM]} />
              </>
            }
          >
            <EvCircuitChart />
          </Figure>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="chart" className="space-y-5">
            <h2 id="chart" className={H2}>
              EV charger wire size chart
            </h2>
            <p className={P} data-src={MFR}>
              Copper only: Tesla, ChargePoint and Emporia all take copper conductors at the charger.{' '}
              <span data-src={GND}>The ground wire comes from Table 250.122, by the breaker.</span>{' '}
              <span data-src={MFR}>The power under each charger is Tesla&apos;s, at <Val v={EV_VOLTS} unit="V" src={MFR} />.</span>
            </p>
            <ChartTable />
            <p className={P} data-src={TERM}>
              The NM cable column also holds for single conductors on a breaker or other termination rated only <C v={EV_LOW} />. The{' '}
              <Link href="/calculators/wire-size-calculator" className={LINK}>
                wire size calculator
              </Link>{' '}
              takes your length, ambient temperature and wiring method; these links open it on a charger&apos;s breaker and continuous load:{' '}
              <CalcLinks />.
            </p>
          </section>

          <section aria-labelledby="breaker" className="space-y-4">
            <h2 id="breaker" className={H2} data-src={EV}>
              Why the breaker is <Val v={EV_OCPD_PERCENT} unit="%" src={EV} /> of the output
            </h2>
            <p className={P} data-src={EV}>
              Section 625.42 makes electric vehicle charging a continuous load. Section 625.41 then sizes the overcurrent protection of a
              charger&apos;s branch circuit or feeder for continuous duty, at no less than <Val v={EV_OCPD_PERCENT} unit="%" src={EV} /> of
              the equipment&apos;s maximum load. For <Out r={TOP} /> that is <A v={TOP.breakerA} />, a standard breaker rating, so the
              circuit is <A v={TOP.breakerA} />.
            </p>
            <p className={P} data-src={LOAD}>
              The wire follows the same rule. Under 210.19(A), a branch circuit&apos;s conductors have an ampacity of at least the noncontinuous
              load plus{' '}
              <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={LOAD} /> of the continuous load. With the breaker at exactly{' '}
              <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={LOAD} /> of the output, the smallest wire is the first size whose ampacity reaches
              the breaker&apos;s rating in the column its terminations allow.
            </p>
            <p className={P} data-src={MFR}>
              The makers agree. Tesla&apos;s table puts <Out r={TOP} /> on a <A v={TOP.breakerA} src={MFR} /> breaker and{' '}
              <Out r={EV_ROWS[0]} /> on <AmpGuideLink a={EV_ROWS[0].breakerA} className={LINK}><A v={EV_ROWS[0].breakerA} src={MFR} /></AmpGuideLink>, and ChargePoint&apos;s guide calls its charger a continuous
              load whose circuit must be rated for <Val v={CHARGEPOINT_CIRCUIT_PCT} unit="%" src={MFR} /> of the maximum load.
            </p>
            <p className={P} data-src={EV}>
              A charger set below its maximum takes the smaller circuit. Under 625.42(B), a charger whose ampere setting sits behind
              restricted access may carry a rating equal to that setting, shown on its label.{' '}
              <span data-src={MFR}>
                The breaker size is programmed into Tesla&apos;s Wall Connector when it is commissioned, and ChargePoint&apos;s Home Flex must
                be set to match the circuit&apos;s rating: on a <A v={EV_ROWS[2].breakerA} src={MFR} /> circuit, a <Out r={TOP} /> charger runs
                at <Out r={EV_ROWS[2]} />.
              </span>
            </p>
          </section>

          <section aria-labelledby="which-column" className="space-y-5">
            <h2 id="which-column" className={H2}>
              NM cable or single conductors
            </h2>
            <p className={P} data-src={TERM}>
              Under 110.14(C), the temperature rating used for a conductor&apos;s ampacity may not exceed that of any termination, conductor
              or device it connects to. For circuits rated <A v={TERMINATION_RULES.limitA} src={TERM} /> or less, 110.14(C)(1)(a) starts
              from the <C v={EV_LOW} /> column. Conductors with a higher rating may be used, but at their <C v={EV_LOW} /> ampacity, unless
              the equipment is listed and identified for use with the higher-rated conductors.
            </p>
            <p className={P} data-src={CABLE}>
              NM cable stays in the <C v={NM_CABLE.maxColumnC} src={CABLE} /> column whatever its terminations: 334.80 holds its ampacity to
              that of a <C v={NM_CABLE.maxColumnC} src={CABLE} /> conductor.{' '}
              <span data-src={AMP}>
                At <Out r={TOP} /> that means <Size s={TOP.nm.size} /> NM cable, which carries <A v={TOP.nm.ampacity} src={AMP} />;{' '}
                <Size s={below48} /> NM cable carries <A v={BELOW48_A60} src={AMP} />, short of the <A v={TOP.breakerA} /> breaker.
              </span>
            </p>
            <p className={P} data-src={MFR}>
              Tesla gives the same split for its Wall Connector at full power: <Size s={TOP.nm.size} /> copper with a breaker rated{' '}
              <C v={EV_LOW} src={MFR} />, <Size s={TOP.c75.size} /> with one rated <C v={EV_HIGH} src={MFR} />. Its instructions ask you to
              check the temperature rating of the breaker first.
            </p>
            <AmpacityTable />
            <p className={P} data-src={AMP}>
              Table 310.16 assumes an ambient temperature of <C v={TABLE_AMBIENT.c} src={AMP} /> and no more than three current-carrying
              conductors together; the wire size calculator corrects for a hotter location or more conductors.
            </p>
          </section>

          <section aria-labelledby="makers" className="space-y-5">
            <h2 id="makers" className={H2}>
              What the makers say
            </h2>
            <p className={P} data-src={MFR}>
              ChargePoint&apos;s and Emporia&apos;s terminals take <Size s={CHARGEPOINT.largestAwg} /> at most, and Emporia warns that{' '}
              <Size s={TOP.nm.size} /> &ldquo;will not fit.&rdquo; At <Out r={TOP} />, those chargers need the <C v={EV_HIGH} /> answer:{' '}
              <Size s={TOP.c75.size} /> single conductors with a breaker and terminations rated <C v={EV_HIGH} />, not{' '}
              <Size s={TOP.nm.size} /> NM cable. Tesla&apos;s terminals take <Size s={TESLA_TERMINALS.smallest} /> to{' '}
              <Size s={TESLA_TERMINALS.largest} />.
            </p>
            <MakersTable />
            <p className={P} data-src={MFR}>
              All three take copper only, and Emporia says aluminum conductors are not compatible. ChargePoint rates its field-wiring
              terminal at <C v={CHARGEPOINT_TERMINAL_C} src={MFR} />, and both ChargePoint and Tesla call for copper wire rated{' '}
              <C v={EVSE_WIRE_C} src={MFR} />, such as THWN-2.{' '}
              <span data-src={TERM}>That wire&apos;s ampacity still comes from the column the terminations allow.</span>
            </p>
          </section>

          <section aria-labelledby="plug-in" className="space-y-4">
            <h2 id="plug-in" className={H2}>
              Plug-in or hardwired
            </h2>
            <p className={P} data-src={EV}>
              Every charger above <A v={INDIVIDUAL_CIRCUIT.aboveA} /> or <Val v={INDIVIDUAL_CIRCUIT.aboveV} unit="V" src={EV} /> gets a branch
              circuit of its own (625.40), plugged in or hardwired. Section 625.44 lists the receptacles a charger may plug into, and a
              charger not connected by one of them is permanently wired. At 125/250 V single-phase, the list has grounding receptacles of
              the 3-pole, 4-wire type rated{' '}
              {RECEPTACLE_125_250_A.map((a, k) => (
                <span key={a}>
                  {k > 0 && (k === RECEPTACLE_125_250_A.length - 1 ? ' or ' : ', ')}
                  <A v={a} />
                </span>
              ))}
              , for portable chargers and for chargers fastened in place.{' '}
              <span data-src={NEMA}>
                A NEMA 14-50 is that type at <A v={NEMA_14_50.amps} src={NEMA} />.
              </span>
            </p>
            <p className={P} data-src={MFR}>
              ChargePoint allows a plug-in Home Flex only on <A v={EV_PLUG_IN[0].breakerA} src={MFR} /> and{' '}
              <A v={EV_PLUG_IN[1].breakerA} src={MFR} /> circuits (<Out r={EV_PLUG_IN[0]} /> and <Out r={EV_PLUG_IN[1]} />), with a NEMA
              14-50 or 6-50 plug. Emporia&apos;s 14-50 plug takes a <A v={EMPORIA_PLUG.breakerA} src={MFR} /> breaker for up to{' '}
              <A v={EMPORIA_PLUG.outputA} src={MFR} />. Tesla&apos;s Wall Connector is hardwired only. None of the three plugs in at{' '}
              <Out r={TOP} />.{' '}
              <span data-src={SIZING}>
                On its <A v={SECOND.breakerA} /> circuit, a 14-50 takes the chart&apos;s <Out r={SECOND} /> row: <Size s={SECOND.nm.size} /> in
                NM cable, or <Size s={SECOND.c75.size} /> single conductors where every termination, the receptacle&apos;s included, is rated{' '}
                <C v={EV_HIGH} />.
              </span>
            </p>
            <p className={P} data-src={EV}>
              In the 2023 NEC, every receptacle installed for EV charging needs ground-fault circuit-interrupter protection for personnel
              (625.54); the rule names receptacles, not hardwired chargers.{' '}
              <span data-src={MFR}>
                ChargePoint doesn&apos;t recommend a GFCI breaker for its charger, which has its own charging circuit interrupting device; it
                says a GFCI breaker in the panel causes nuisance tripping, and where code calls for one on a plug-in installation, it
                recommends hardwiring instead.
              </span>
            </p>
          </section>

          <section aria-labelledby="voltage-drop" className="space-y-5">
            <h2 id="voltage-drop" className={H2}>
              Voltage drop on a long run
            </h2>
            <p className={P} data-src={VD}>
              Table 310.16 sizes the wire for current, not distance. At full output on the <C v={EV_HIGH} /> sizes, each circuit reaches a{' '}
              <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> drop between <Ft v={NOTE_MIN} /> and <Ft v={NOTE_MAX} /> one way at{' '}
              <Val v={EV_VOLTS} unit="V" src={MFR} />, with the conductors at <C v={RESISTANCE_TEMP_C} src={RES} />. The larger NM cable sizes go further:{' '}
              <Size s={SECOND.nm.size} /> at <Out r={SECOND} /> to <Ft v={SECOND.noteFt.nm} />, <Size s={TOP.nm.size} /> at <Out r={TOP} />{' '}
              to <Ft v={TOP.noteFt.nm} />.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={VD}>
                    The one-way length at which each charger&apos;s full output drops{' '}
                    <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} /> at <Val v={EV_VOLTS} unit="V" src={MFR} />, on the{' '}
                    <C v={EV_HIGH} /> size (filled) and the NM cable size (open). Where the two sizes are the same, one dot.
                  </span>
                  <SourceLine domains={[AMP, RES, LOAD]} />
                </>
              }
            >
              <EvDropChart />
            </Figure>
            <DropTable />
            <p className={P} data-src={LOAD}>
              An informational note to 215.2(A) ties a feeder drop of up to <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={LOAD} />, and{' '}
              <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={LOAD} /> for feeder and branch circuit together, to reasonable efficiency:
              advice, not a rule. For a longer run, go up a size: the wire size calculator finds it for your length and increases the ground
              wire in proportion, as 250.122(B) requires.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR}>
                What size wire for a <Out r={TOP} /> EV charger?
              </h3>
              <p className={P} data-src={SIZING}>
                <Size s={TOP.c75.size} /> copper on a <A v={TOP.breakerA} /> breaker where the breaker and every termination are rated{' '}
                <C v={EV_HIGH} />; <Size s={TOP.nm.size} /> in NM cable or with a breaker rated <C v={EV_LOW} />. The ground wire is{' '}
                <Size s={TOP.egc} /> copper.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={EV}>
                What size wire for a <A v={SECOND.breakerA} /> EV charger?
              </h3>
              <p className={P} data-src={SIZING}>
                If that is the circuit, a <A v={SECOND.breakerA} /> breaker serves a <Out r={SECOND} /> charger: <Size s={SECOND.c75.size} />{' '}
                copper at <C v={EV_HIGH} /> or <Size s={SECOND.nm.size} /> NM cable.{' '}
                <span data-src={MFR}>
                  ChargePoint&apos;s top setting draws <Out r={CP} /> itself.
                </span>{' '}
                <span data-src={EV}>
                  Its breaker must be at least <Val v={EV_OCPD_PERCENT} unit="%" src={EV} /> of <Out r={CP} />, <A v={CP.neededA} />, so the
                  circuit is <A v={CP.breakerA} />, the next standard rating, and hardwired.
                </span>{' '}
                <span data-src={OCPD}>
                  <Size s={CP.c75.size} /> copper carries <A v={CP.c75.ampacity} src={AMP} /> at <C v={EV_HIGH} />, above the{' '}
                  <A v={CP.neededA} src={EV} /> that 210.19(A) requires, and 240.4(B) lets the next standard rating, <A v={CP.breakerA} src={OCPD} />,
                  protect it; in NM cable the circuit takes <Size s={CP.nm.size} />, which ChargePoint&apos;s terminal won&apos;t accept. Its
                  ground wire is <Size s={CP.egc} />.
                </span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                Is <Size s="8" /> wire enough for an EV charger?
              </h3>
              <p className={P} data-src={AMP}>
                For a <Out r={THIRTY_TWO} /> charger on a <AmpGuideLink a={THIRTY_TWO.breakerA} className={LINK}><A v={THIRTY_TWO.breakerA} /> breaker</AmpGuideLink>, yes, in NM cable or single conductors. For a{' '}
                <Out r={SECOND} /> charger on a <A v={SECOND.breakerA} /> breaker, only as single conductors with a breaker and terminations
                rated <C v={EV_HIGH} />, where <Size s="8" /> copper carries <A v={EIGHT_A75} src={AMP} />; in NM cable it carries{' '}
                <A v={EIGHT_A60} src={AMP} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR}>
                What wire does an <Val v={11} unit="kW" src="input" /> charger need?
              </h3>
              <p className={P} data-src={MFR}>
                Chargers come in fixed steps, and Tesla&apos;s table lists <Val v={TOP.kw} unit="kW" src={MFR} /> at <Out r={TOP} />, its top
                step, on a <A v={TOP.breakerA} src={MFR} /> breaker: <Size s={TOP.c75.size} /> copper at <C v={EV_HIGH} /> or{' '}
                <Size s={TOP.nm.size} /> NM cable. The next step down is <Val v={SECOND.kw} unit="kW" src={MFR} /> at <Out r={SECOND} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Can I use aluminum wire for an EV charger?</h3>
              <p className={P} data-src={MFR}>
                Not at the charger. Tesla, ChargePoint and Emporia take copper only at their terminals, and Emporia says aluminum conductors
                are not compatible.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does an EV charger need a GFCI breaker?</h3>
              <p className={P} data-src={EV}>
                A receptacle for EV charging does: in the 2023 NEC, 625.54 requires GFCI protection for every one. The rule names receptacles
                only.{' '}
                <span data-src={EXC}>
                  Outdoors at a dwelling, 210.8(F) requires GFCI protection for outlets on single-phase branch circuits rated{' '}
                  <Val v={OUTDOOR_GFCI.maxVoltsToGround} unit="V" src={EXC} /> or less to ground and <A v={OUTDOOR_GFCI.maxA} src={EXC} /> or
                  less.
                </span>{' '}
                <span data-src={ED26}>
                  The 2026 edition raises that limit to <A v={NEC_2026_OUTDOOR_GFCI.toA} src={ED26} />, which takes in the{' '}
                  <A v={TOP.breakerA} /> circuit of a <Out r={TOP} /> charger.
                </span>{' '}
                <span data-src={MFR}>ChargePoint recommends hardwiring where a plug-in charger would need a GFCI breaker.</span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does an EV charger need its own circuit?</h3>
              <p className={P} data-src={EV}>
                Yes, above <A v={INDIVIDUAL_CIRCUIT.aboveA} /> or <Val v={INDIVIDUAL_CIRCUIT.aboveV} unit="V" src={EV} /> (625.40). Its
                exception lets one branch circuit feed several chargers when an energy management system or restricted ampere settings
                limit their load, under 625.42(A) or 625.42(B).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does an EV charger need a disconnect switch?</h3>
              <p className={P} data-src={EV}>
                Only a charger rated more than <A v={DISCONNECT_ABOVE.a} /> or more than <Val v={DISCONNECT_ABOVE.voltsToGround} unit="V" src={EV} />{' '}
                to ground: 625.43 then requires a disconnecting means in a readily accessible place that can be locked open.{' '}
                <span data-src={MFR}>
                  Tesla says external disconnect switches are neither required nor recommended for its Wall Connector, which delivers{' '}
                  <Out r={TOP} /> at most.
                </span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Will my panel handle an EV charger?</h3>
              <p className={P} data-src={LC}>
                That takes a load calculation. Under 220.57 a charger counts at <Val v={STANDARD_METHOD.evseMinW} unit="W" src={LC} /> or its
                nameplate rating, whichever is larger; the{' '}
                <Link href="/calculators/residential-load-calculator" className={LINK}>
                  residential load calculator
                </Link>{' '}
                adds it to the rest of the house.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Is there still a tax credit for a home charger?</h3>
              <p className={P} data-src={IRS}>
                Not for one placed in service after June 30, 2026. The IRS credit for home chargers covers property placed in service at your
                main home from January 1, 2023, to June 30, 2026.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[EV, MFR, LOAD, AMP, TERM, CABLE, OCPD, GND, RES, NEMA, EXC, ED26, LC, IRS]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The rules are the 2023 NEC&apos;s; the{' '}
              <Link href="/guides/nec-code-compliance" className={LINK}>
                NEC edition by state
              </Link>{' '}
              shows which edition applies where you live. The{' '}
              <Link href="/methodology#ev-charging" className={LINK}>
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
