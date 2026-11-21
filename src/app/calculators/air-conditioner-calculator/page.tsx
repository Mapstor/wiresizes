import type { Metadata } from 'next';
import Link from 'next/link';
import { AmpGuideLink } from '@/components/content/AmpGuideLink';
import { clsx } from 'clsx';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { Byline } from '@/components/content/Byline';
import { DataTable, RSTICKY_TD, RSTICKY_TH, RTD, RTH } from '@/components/content/DataTable';
import { Figure } from '@/components/content/Figure';
import { Size } from '@/components/content/Size';
import { SourceLine } from '@/components/content/SourceLine';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { AcTool } from '@/components/calculators/AcTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { AcDropChart } from '@/components/look/Charts';
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
import { AC_CALC } from '@/lib/calculations/ac-circuit';
import { formatValue } from '@/lib/calculations/format';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import {
  AC_DROP_PCT,
  AC_HIGH,
  AC_LOW,
  AC_VOLTS,
  AMANA_3,
  AMANA_FIVE,
  AMANA_HALF,
  CARRIER_HALF,
  COASTAL_ROWS,
  DROP_ROWS,
  EXAMPLE,
  FIVE_TON,
  LONG_RUN,
  LONG_RUN_FT,
  TWO_TON,
  UNIT_ROWS,
} from '@/lib/ac-page';
import { max240_4D } from '@/lib/verified/nec-240-4-d';
import { COMPRESSOR_PROTECTION, NEC_440_DOMAIN } from '@/lib/verified/nec-440';
import { MFR_HVAC_DOMAIN } from '@/lib/verified/mfr-hvac';

// /calculators/air-conditioner-calculator (WSZ-011e; withdrawn in WSZ-002, back as a new page; sources WSZ-036): the
// copper circuit for an air conditioner from the MCA and MOCP on its nameplate (440.4(B)), sized to the MCA in Table
// 310.16 (nec-310-16, nec-110-14c) with 240.4(G) lifting the 240.4(D) cap (nec-440-hvac, nec-240-4-d), the ground wire by
// Table 250.122 and 250.122(A) and (B) (nec-250-grounding), the drop at the MCA (conductor-resistance-20c), and two
// makers' units (mfr-hvac-specs). No 440.32 or 440.35 rule is stated.
const ROUTE = '/calculators/air-conditioner-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Air Conditioner Wire Size Calculator: MCA, MOCP and Breaker Size';
const DESCRIPTION =
  'Copper wire, ground wire and breaker for an air conditioner from the MCA and MOCP on its nameplate, with voltage drop and real Carrier and Amana units.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const AMP = 'nec-310-16';
const TERM = 'nec-110-14c';
const OCPD = 'nec-240-ocpd';
const SMALL = 'nec-240-4-d';
const GND = 'nec-250-grounding';
const RES = 'conductor-resistance-20c';
const NEC440 = NEC_440_DOMAIN;
const MFR = MFR_HVAC_DOMAIN;
const CALC = AC_CALC;

function limit(size: '14' | '12' | '10'): number {
  const l = max240_4D(size, 'Cu');
  if (!l || l.conditions !== null) throw new Error(`air conditioner page: no plain 240.4(D) limit for ${size} AWG`);
  return l.max_ocpd_a;
}
const LIMIT_14 = limit('14');
const LIMIT_12 = limit('12');
const LIMIT_10 = limit('10');

const TOC: ([string, string] | [string, string, string])[] = [
  ['nameplate', 'MCA and MOCP: the two numbers on the nameplate'],
  ['by-unit', 'Wire for real air conditioners'],
  ['breaker', 'Why the breaker can be larger than the wire'],
  ['ground', 'The ground wire'],
  ['long-runs', 'Long runs and voltage drop'],
  ['disconnect', 'The disconnect'],
  ['not-covered', 'What the calculator does not cover'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Air Conditioner Wire Size Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Air Conditioner Wire Size Calculator', url: URL, description: DESCRIPTION };

function A({ v, src = MFR }: { v: number; src?: string }) {
  return <Val v={v} unit="A" src={src} />;
}
function C({ v }: { v: number }) {
  return <Val v={v} unit="°C" src={TERM} />;
}
function Tons({ v }: { v: number }) {
  return (
    <span data-src={MFR} className="whitespace-nowrap">
      {formatValue(v)}-ton
    </span>
  );
}

function UnitTable() {
  return (
    <DataTable
      id="ac-units"
      variant="ruled"
      src={CALC}
      caption="Copper wire and ground wire for Carrier and Amana air conditioners, from the MCA and MOCP in their 2025 product data"
    >
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Unit
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')} data-src={TERM}>
            Copper <C v={AC_LOW} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')} data-src={TERM}>
            Copper <C v={AC_HIGH} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Ground
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            MCA
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            MOCP
          </th>
        </tr>
      </thead>
      <tbody>
        {UNIT_ROWS.map((r) => (
          <tr key={`${r.unit.brand}-${r.unit.model}`}>
            <th scope="row" className={clsx(RSTICKY_TD, '!whitespace-nowrap')} data-src={MFR}>
              {formatValue(r.unit.tons)} ton<span className="max-sm:hidden">,</span> <br className="sm:hidden" />
              {r.unit.brand}
            </th>
            <td className={RTD}>
              <Size s={r.cu60.size} />
            </td>
            <td className={RTD}>
              <Size s={r.cu75.size} />
            </td>
            <td className={RTD} data-src={GND}>
              <Size s={r.cu60.egc} />
            </td>
            <td className={RTD}>
              <A v={r.unit.mcaA} />
            </td>
            <td className={RTD}>
              <A v={r.unit.mocpA} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function DropTable() {
  return (
    <DataTable
      id="ac-drop"
      variant="ruled"
      src={CALC}
      caption={`One-way length at which a ${formatValue(EXAMPLE.unit.mcaA)} A MCA at ${AC_VOLTS} V drops ${AC_DROP_PCT} %`}
    >
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Copper
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Length
          </th>
        </tr>
      </thead>
      <tbody>
        {DROP_ROWS.map((r) => (
          <tr key={r.size}>
            <th scope="row" className={RSTICKY_TD}>
              <Size s={r.size} />
            </th>
            <td className={RTD}>
              <Val v={r.ft} unit="ft" src={CALC} format={{ sig: 3 }} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function AirConditionerCalculatorPage() {
  const ex = EXAMPLE.cu60;
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Air Conditioner Wire Size Calculator" sub="MCA, MOCP and Breaker Size" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            The copper wire, ground wire and breaker for an air conditioner from the two numbers on its nameplate, the minimum circuit ampacity
            (MCA) and the maximum breaker or fuse (MOCP), with the voltage drop over your run.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <AcTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={CALC}>
            <strong>
              Carrier&apos;s <Tons v={EXAMPLE.unit.tons} /> air conditioner, with an MCA of <A v={EXAMPLE.unit.mcaA} /> and an MOCP of{' '}
              <A v={EXAMPLE.unit.mocpA} />, takes <Size s={ex.size} /> copper on a <AmpGuideLink a={EXAMPLE.unit.mocpA} className={LINK}><A v={EXAMPLE.unit.mocpA} /> breaker</AmpGuideLink>, with a <Size s={ex.egc} />{' '}
              ground wire.
            </strong>{' '}
            <span data-src={NEC440}>
              The wire is sized to the MCA, not to the breaker: Table 240.4(G) sends air-conditioning circuits to Article 440, so the{' '}
              <A v={EXAMPLE.unit.mocpA} /> breaker is allowed on wire that 240.4(D) would otherwise hold to <A v={LIMIT_12} src={SMALL} />.
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="nameplate" className="space-y-5">
            <h2 id="nameplate" className={H2}>
              MCA and MOCP: the two numbers on the nameplate
            </h2>
            <p className={P} data-src={NEC440}>
              Section 440.4(B) of the NEC asks multimotor and combination-load equipment, such as an air conditioner with its compressor and fan,
              for a nameplate with two numbers for the circuit: the minimum supply circuit conductor ampacity (MCA) and the maximum rating of the
              breaker or fuse (MOCP). The MCA is worked out by Part IV of Article 440, counting every motor and load that runs at the same time,
              and the maximum breaker by Part III. The wire is sized to the MCA, and no breaker or fuse may be larger than the MOCP.
            </p>
            <p className={P} data-src={MFR}>
              Carrier&apos;s product data prints them as MCA and max fuse or circuit breaker; Amana&apos;s as minimum circuit ampacity and max
              overcurrent protection, with a note to check the rating plate of the unit being installed. Read your own unit&apos;s plate: two units
              of the same size can differ.
            </p>
          </section>

          <section aria-labelledby="by-unit" className="space-y-5">
            <h2 id="by-unit" className={H2}>
              Wire for real air conditioners
            </h2>
            <p className={P} data-src={CALC}>
              Carrier&apos;s 26SCA5 and Amana&apos;s ALXS3N product data, both from 2025, give the MCA and MOCP of their{' '}
              <span data-src={MFR}>1.5- to 5-ton</span> split-system air conditioners. The table runs each through the calculator: copper at{' '}
              <C v={AC_LOW} />, which covers NM and UF cable and terminals not listed for more, at <C v={AC_HIGH} /> where the breaker, the
              disconnect and the unit are all listed for it, the ground wire for the <C v={AC_LOW} /> wire, then the nameplate&apos;s two numbers. Tonnage alone does not set the wire:
              Carrier&apos;s <Tons v={CARRIER_HALF.unit.tons} /> unit needs <Size s={CARRIER_HALF.cu60.size} />, Amana&apos;s{' '}
              <Size s={AMANA_HALF.cu60.size} />.
            </p>
            <UnitTable />
            <p className={P} data-src={MFR}>
              Carrier&apos;s coastal version, the 26SCA5C, prints{' '}
              {COASTAL_ROWS.map((r, k) => (
                <span key={r.unit.model}>
                  {k > 0 ? ' and ' : ''}
                  <A v={r.unit.coastalMocpA as number} /> for the <Tons v={r.unit.tons} /> size
                </span>
              ))}
              ; the wire and the ground wire come out the same.
            </p>
          </section>

          <section aria-labelledby="breaker" className="space-y-5">
            <h2 id="breaker" className={H2}>
              Why the breaker can be larger than the wire
            </h2>
            <p className={P} data-src={SMALL}>
              On most circuits the breaker protects the wire, and 240.4(D) holds <Size s="14" /> copper to <AmpGuideLink a={LIMIT_14} className={LINK}><A v={LIMIT_14} src={SMALL} /></AmpGuideLink>,{' '}
              <Size s="12" /> to <AmpGuideLink a={LIMIT_12} className={LINK}><A v={LIMIT_12} src={SMALL} /></AmpGuideLink> and <Size s="10" /> to <A v={LIMIT_10} src={SMALL} />. Its opening words leave room
              for the conductors 240.4(G) lists, and Table 240.4(G) sends air-conditioning and refrigeration circuit conductors to Parts III, IV and
              VI of Article 440.
            </p>
            <p className={P} data-src={NEC440}>
              There the wire is sized to the MCA, and the compressor&apos;s breaker or fuse may go up to{' '}
              <Val v={COMPRESSOR_PROTECTION.maxPct} unit="%" src={NEC440} /> of its rated-load current, or{' '}
              <Val v={COMPRESSOR_PROTECTION.startPct} unit="%" src={NEC440} /> where that will not carry the starting current (440.22(A)); the MOCP on
              the nameplate is that limit worked out for the unit. Carrier&apos;s <Tons v={EXAMPLE.unit.tons} /> unit, MCA <A v={EXAMPLE.unit.mcaA} />, runs on{' '}
              <Size s={ex.size} /> copper with a <A v={EXAMPLE.unit.mocpA} /> breaker; its <Tons v={TWO_TON.unit.tons} /> unit, MCA{' '}
              <A v={TWO_TON.unit.mcaA} />, on <Size s={TWO_TON.cu60.size} /> with a <A v={TWO_TON.unit.mocpA} /> breaker.
            </p>
            <p className={P} data-src={MFR}>
              Amana asks for time-delay fuses or HACR-type circuit breakers of the size its sheet lists. Carrier&apos;s maximum is for a time-delay
              fuse or a breaker.
            </p>
          </section>

          <section aria-labelledby="ground" className="space-y-5">
            <h2 id="ground" className={H2}>
              The ground wire
            </h2>
            <p className={P} data-src={GND}>
              Table 250.122 sizes the ground wire by the breaker ahead of the circuit: <Size s={ex.tableEgc} /> copper for{' '}
              <A v={EXAMPLE.unit.mocpA} src={OCPD} />. Section 250.122(A) adds that the ground wire does not have to be larger than the circuit
              conductors, so the <Tons v={EXAMPLE.unit.tons} /> example&apos;s <Size s={ex.size} /> circuit takes a <Size s={ex.egc} /> ground wire,
              and the <Tons v={TWO_TON.unit.tons} /> unit&apos;s <Size s={TWO_TON.cu60.size} /> circuit a <Size s={TWO_TON.cu60.egc} /> one. When the
              wire goes up a size for voltage drop, 250.122(B) grows the ground wire in proportion; the calculator does both.
            </p>
          </section>

          <section aria-labelledby="long-runs" className="space-y-5">
            <h2 id="long-runs" className={H2}>
              Long runs and voltage drop
            </h2>
            <p className={P} data-src={CALC}>
              Table 310.16 sizes for current, not distance, and Amana&apos;s sheet notes that long runs need larger wire. At the example&apos;s MCA of{' '}
              <A v={EXAMPLE.unit.mcaA} /> and <Val v={AC_VOLTS} unit="V" src="input" />, copper at <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} />{' '}
              drops <Val v={AC_DROP_PCT} unit="%" src="input" /> at the lengths below. Past your target, the calculator moves the wire up a size and the
              ground wire with it.
            </p>
            <DropTable />
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    The longest one-way copper run before an MCA of <A v={EXAMPLE.unit.mcaA} /> drops <Val v={AC_DROP_PCT} unit="%" src="input" /> at{' '}
                    <Val v={AC_VOLTS} unit="V" src="input" />.
                  </span>
                  <SourceLine domains={[AMP, RES]} />
                </>
              }
            >
              <AcDropChart />
            </Figure>
          </section>

          <section aria-labelledby="disconnect" className="space-y-5">
            <h2 id="disconnect" className={H2}>
              The disconnect
            </h2>
            <p className={P} data-src={NEC440}>
              Section 440.14 puts the disconnect within sight from the air conditioner and readily accessible from it. It may be mounted on or in
              the unit, but not on a panel that opens for service or where it hides the nameplate, and it needs the working space of 110.26(A). The
              calculator&apos;s length is the whole run, from the panel through the disconnect to the unit.
            </p>
          </section>

          <section aria-labelledby="not-covered" className="space-y-5">
            <h2 id="not-covered" className={H2}>
              What the calculator does not cover
            </h2>
            <ul className={clsx(P, 'list-disc space-y-2 pl-6')}>
              <li>Equipment without the two numbers: the calculator does not work out an MCA or MOCP.</li>
              <li>Heat and bundling: wire on a hot roof, in a hot attic or in a full conduit may need corrections the calculator does not apply.</li>
              <li>The indoor unit&apos;s circuit, with any electric heat, and three-phase units.</li>
              <li data-src={NEC440}>Room air conditioners, some of which need not carry the two numbers (440.4(B), Exception No. 2).</li>
            </ul>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR}>
                What size wire for a <Tons v={EXAMPLE.unit.tons} /> air conditioner?
              </h3>
              <p className={P} data-src={CALC}>
                <Size s={ex.size} /> copper with a <Size s={ex.egc} /> ground wire for Carrier&apos;s and Amana&apos;s{' '}
                <Tons v={EXAMPLE.unit.tons} /> units (MCA <A v={EXAMPLE.unit.mcaA} /> and <A v={AMANA_3.unit.mcaA} />, MOCP{' '}
                <A v={EXAMPLE.unit.mocpA} />); <Size s={EXAMPLE.cu75.size} /> copper where everything on the circuit is listed for <C v={AC_HIGH} />.
                Read your own nameplate: the MCA, not the tonnage, sets the wire.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR}>
                What size wire for a <Tons v={FIVE_TON.unit.tons} /> air conditioner?
              </h3>
              <p className={P} data-src={CALC}>
                <Size s={FIVE_TON.cu60.size} /> copper at <C v={AC_LOW} /> or <Size s={FIVE_TON.cu75.size} /> at <C v={AC_HIGH} /> for Carrier&apos;s
                and Amana&apos;s <Tons v={FIVE_TON.unit.tons} /> units (MCA{' '}
                {FIVE_TON.unit.mcaA === AMANA_FIVE.unit.mcaA ? (
                  <>
                    <A v={FIVE_TON.unit.mcaA} /> for both
                  </>
                ) : (
                  <>
                    <A v={FIVE_TON.unit.mcaA} /> and <A v={AMANA_FIVE.unit.mcaA} />
                  </>
                )}
                ), on a breaker of up to <A v={FIVE_TON.unit.mocpA} />, with a <Size s={FIVE_TON.cu60.egc} /> ground wire.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR}>
                Can a <A v={EXAMPLE.unit.mocpA} /> breaker go on <Size s={ex.size} /> wire for an air conditioner?
              </h3>
              <p className={P} data-src={NEC440}>
                Yes, when the nameplate allows it, as on the <Tons v={EXAMPLE.unit.tons} /> units above: an MCA the wire carries and an MOCP of{' '}
                <A v={EXAMPLE.unit.mocpA} />. Table 240.4(G) sends air-conditioning circuits to Article 440, so the{' '}
                <A v={LIMIT_12} src={SMALL} /> cap of 240.4(D) on <Size s={ex.size} /> does not apply.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={CALC}>
                What wire for an air conditioner <Val v={LONG_RUN_FT} unit="ft" src={CALC} /> from the panel?
              </h3>
              <p className={P} data-src={CALC}>
                For the <Tons v={EXAMPLE.unit.tons} /> example, <Size s={LONG_RUN.size} /> copper keeps the drop at the MCA to{' '}
                <Val v={LONG_RUN.vdPct} unit="%" src={CALC} format={{ fixed: 2 }} />; <Size s={LONG_RUN.firstSize} /> would reach{' '}
                <Val v={LONG_RUN.firstVdPct} unit="%" src={CALC} format={{ fixed: 2 }} />. The ground wire grows with it, to{' '}
                <Size s={LONG_RUN.egc} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Can I use aluminum wire for an air conditioner?</h3>
              <p className={P} data-src={MFR}>
                Not on these units: Carrier&apos;s product data says copper wire must be used from the service disconnect to the unit, and
                Amana&apos;s wiring diagrams say to use copper conductors only. The calculator gives copper only.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Where does the air conditioner&apos;s disconnect go?</h3>
              <p className={P} data-src={NEC440}>
                Within sight from the unit and readily accessible from it (440.14). It may be on or in the unit, but not on a service panel or over
                the nameplate.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, TERM, OCPD, SMALL, GND, RES, NEC440, MFR]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The wire sizes are the 2023 NEC&apos;s; the{' '}
              <Link href="/guides/nec-code-compliance" className={LINK}>
                NEC edition by state
              </Link>{' '}
              shows which edition applies where you live. The{' '}
              <Link href="/methodology#ac-method" className={LINK}>
                methodology page
              </Link>{' '}
              describes how the calculator works and each source. NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the
              National Fire Protection Association; wiresizes.com is not affiliated with or endorsed by NFPA.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
