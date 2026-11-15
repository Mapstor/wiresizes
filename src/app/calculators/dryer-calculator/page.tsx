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
import { DryerTool } from '@/components/calculators/DryerTool';
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
import { ENGINE_ID } from '@/lib/calculations/dryer-circuit';
import { articleDates } from '@/lib/page-dates';
import { EXAMPLE, FIVE, SMALL, SMALL_NAMEPLATE_W, TABLE_ROWS, WIRE_30 } from '@/lib/dryer-page';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { STANDARD_METHOD } from '@/lib/verified/nec-220-2023';
import { GE_DBLR333EE, GE_DRYER, MFR_DOMAIN, WHIRLPOOL_DRYER } from '@/lib/verified/mfr-equipment';
import { NEMA_DOMAIN, nemaConfig } from '@/lib/verified/nema-receptacle-configs';

// /calculators/dryer-calculator (WSZ-010c; spec: research/page-specs-held.md "WSZ-010"; data gate BUILD; withdrawn in
// WSZ-002, back as a new page): an electric dryer's load on a feeder or service (220.54, Table 220.54) kept apart from
// its own branch circuit, rated as the dryer's instructions give, with the wire and ground wire for that rating. The
// makers' values are quoted as theirs (D-42). 250.140, the NEC's dryer-frame rule, is unverified: the 4-wire sentence
// is Whirlpool's, quoted as Whirlpool's.
const ROUTE = '/calculators/dryer-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Dryer Calculator: Wire Size, Breaker and NEC 220.54 Load';
const DESCRIPTION =
  "An electric dryer's two numbers: its NEC 220.54 load on the service (5,000 W or the nameplate) and the wire and ground wire for its own 30 A circuit.";

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
const SMALL_SRC = 'nec-240-4-d';
const OCPD = 'nec-240-ocpd';
const EGC = 'nec-250-grounding';
const EXC = 'nec-2023-rule-excerpts';
const CALC = `calc:${ENGINE_ID}`;
const S = STANDARD_METHOD;
const [R4, R3] = WHIRLPOOL_DRYER.receptacles;
const N4 = nemaConfig(R4.config);
const N3 = nemaConfig(R3.config);
const C30 = WHIRLPOOL_DRYER.circuitA;
const COLD = TERMINATION_RULES.columnAtOrBelowLimit;
const WARM = TERMINATION_RULES.columnAboveLimit;

// the facts the copy states, checked when the page builds
if (EXAMPLE.perDryerW !== 5600 || SMALL.perDryerW !== S.dryerMinW || FIVE.demandPct !== 85) throw new Error('dryer page: the golden dryers changed');
if (GE_DRYER.circuitA !== C30 || GE_DBLR333EE.breakerA !== C30) throw new Error('dryer page: the makers no longer agree on the circuit');
if (WIRE_30.cuCable !== WHIRLPOOL_DRYER.directWireCu || WIRE_30.cuCable !== GE_DRYER.minCopper || WIRE_30.cuCable !== WHIRLPOOL_DRYER.cord.size) {
  throw new Error('dryer page: the 30 A copper size no longer matches the makers');
}
if (!N4.grounding || N3.grounding || N4.amps !== C30 || N3.amps !== C30) throw new Error('dryer page: the NEMA 14-30R and 10-30R facts changed');

const TOC: ([string, string] | [string, string, string])[] = [
  ['two-numbers', 'Two numbers for one dryer'],
  ['circuit', 'The circuit, its wire and the cord'],
  ['wiring', '3-wire or 4-wire'],
  ['several', 'Several dryers: Table 220.54'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Dryer Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Dryer Calculator', url: URL, description: DESCRIPTION };

export default function DryerCalculatorPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Dryer Calculator" sub="Dryer Wire Size and NEC 220.54 Load" joiner=": " src={L} />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            An electric dryer&apos;s load on the service under NEC 220.54, and the wire and ground wire for its own circuit.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <DryerTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={MFR_DOMAIN}>
            <strong>
              An electric dryer&apos;s own circuit is the one its instructions give: Whirlpool and GE call for{' '}
              <Val v={C30} unit="A" src={MFR_DOMAIN} />, with <Size s={WHIRLPOOL_DRYER.directWireCu} /> copper.
            </strong>{' '}
            <span data-src={L}>
              A service or feeder calculation counts the same dryer at <Val v={S.dryerMinW} unit="W" src={L} /> or its nameplate, whichever is larger
              (NEC 220.54).
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="two-numbers" className="space-y-5">
            <h2 id="two-numbers" className={H2}>
              Two numbers for one dryer
            </h2>
            <p className={P} data-src={L}>
              220.54 sets a dryer&apos;s load for a feeder or service at <Val v={S.dryerMinW} unit="W" src={L} /> or its nameplate rating, whichever is
              larger.{' '}
              <span data-src={CALC}>
                A <Val v={SMALL_NAMEPLATE_W} unit="W" src="input" /> dryer counts as <Val v={SMALL.perDryerW} unit="W" src={CALC} />; GE&apos;s{' '}
                {GE_DBLR333EE.model}, rated <Val v={GE_DBLR333EE.at240.w} unit="W" src={MFR_DOMAIN} /> at <Val v={240} unit="V" src="input" />, counts at
                its nameplate, <Val v={EXAMPLE.perDryerW} unit="W" src={CALC} />.
              </span>{' '}
              That number goes into a{' '}
              <Link href="/calculators/residential-load-calculator" className={LINK}>
                residential load calculation
              </Link>
              . It does not size the dryer&apos;s own circuit: that rating comes from the dryer&apos;s instructions, and the wire follows the rating.
            </p>
          </section>

          <section aria-labelledby="circuit" className="space-y-5">
            <h2 id="circuit" className={H2}>
              The circuit, its wire and the cord
            </h2>
            <p className={P} data-src={MFR_DOMAIN}>
              Whirlpool&apos;s dryer instructions ({WHIRLPOOL_DRYER.doc}) ask for a separate <Val v={C30} unit="A" src={MFR_DOMAIN} /> circuit, a{' '}
              <Val v={WHIRLPOOL_DRYER.cord.amps} unit="A" src={MFR_DOMAIN} /> cord rated {WHIRLPOOL_DRYER.cord.volts} V with{' '}
              <Size s={WHIRLPOOL_DRYER.cord.size} /> copper wires, and <Size s={WHIRLPOOL_DRYER.directWireCu} /> solid copper for direct wiring, not
              aluminum. GE&apos;s ({GE_DRYER.doc}) ask for a <Val v={GE_DRYER.circuitA} unit="A" src={MFR_DOMAIN} /> circuit with{' '}
              <Size s={GE_DRYER.minCopper} /> copper conductors at least; GE&apos;s {GE_DBLR333EE.model} sheet names a{' '}
              <Val v={GE_DBLR333EE.breakerA} unit="A" src={MFR_DOMAIN} /> breaker for a dryer rated <Val v={GE_DBLR333EE.at240.w} unit="W" src={MFR_DOMAIN} />{' '}
              and <Val v={GE_DBLR333EE.at240.a} unit="A" src={MFR_DOMAIN} /> at <Val v={240} unit="V" src="input" />, or{' '}
              <Val v={GE_DBLR333EE.at208.w} unit="W" src={MFR_DOMAIN} /> and <Val v={GE_DBLR333EE.at208.a} unit="A" src={MFR_DOMAIN} /> at{' '}
              <Val v={208} unit="V" src="input" />.
            </p>
            <DataTable id="wire-30" variant="ruled" src={CALC} caption={`Wire for the dryer circuit`} className="max-w-[34rem]">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    <Val v={C30} unit="A" src={MFR_DOMAIN} /> circuit
                  </th>
                  <th scope="col" className={RTH}>
                    Copper
                  </th>
                  <th scope="col" className={RTH}>
                    Aluminum
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, '!font-normal')}>
                    NM cable, <Val v={COLD} unit="°C" src={TERM} />
                  </th>
                  <td className={RTD}>
                    <Size s={WIRE_30.cuCable} />
                  </td>
                  <td className={RTD}>
                    <Size s={WIRE_30.alCable} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, '!font-normal')}>
                    Single conductors, <Val v={WARM} unit="°C" src={TERM} />
                  </th>
                  <td className={RTD}>
                    <Size s={WIRE_30.cuWarm} />
                  </td>
                  <td className={RTD}>
                    <Size s={WIRE_30.alWarm} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={clsx(RSTICKY_TD, '!font-normal')}>
                    Ground wire
                  </th>
                  <td className={RTD}>{WIRE_30.egcCu ? <Size s={WIRE_30.egcCu} /> : '–'}</td>
                  <td className={RTD}>{WIRE_30.egcAl ? <Size s={WIRE_30.egcAl} /> : '–'}</td>
                </tr>
              </tbody>
            </DataTable>
            <p className="text-[15px] leading-[1.6] text-[#333333]" data-src={SMALL_SRC}>
              240.4(D) holds <Size s={WIRE_30.cuCable} /> copper to <Val v={C30} unit="A" src={SMALL_SRC} />, so the copper size is the same in both
              columns. The aluminum sizes carry the rating, but Whirlpool&apos;s instructions rule out aluminum for direct wiring.
            </p>
            <SourceLine domains={[AMP, TERM, SMALL_SRC, EGC, MFR_DOMAIN]} />
          </section>

          <section aria-labelledby="wiring" className="space-y-5">
            <h2 id="wiring" className={H2}>
              3-wire or 4-wire
            </h2>
            <p className={P} data-src={NEMA_DOMAIN}>
              A dryer cord plugs into a NEMA {N4.config} (<Val v={N4.amps} unit="A" src={NEMA_DOMAIN} />, {N4.volts} V,{' '}
              <Num v={N4.poles} src={NEMA_DOMAIN} />
              -pole, <Num v={N4.wires} src={NEMA_DOMAIN} />
              -wire with a ground) or an older {N3.config} (<Num v={N3.wires} src={NEMA_DOMAIN} />
              -wire, no ground).{' '}
              <span data-src={MFR_DOMAIN}>
                Whirlpool&apos;s instructions list both, and say the NEC requires the 4-wire connection for homes built after 1996, dryer circuits
                remodeled after 1996 and all mobile homes.
              </span>
            </p>
            <h3 className={H3}>GFCI protection</h3>
            <p className={P} data-src={EXC}>
              The 2023 NEC requires GFCI protection for the branch circuit or outlet that supplies a clothes dryer (210.8(D)). States can amend that rule
              when they adopt the code:{' '}
              <Link href="/guides/nec-code-compliance" className={LINK}>
                NEC edition by state
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="several" className="space-y-5">
            <h2 id="several" className={H2}>
              Several dryers: Table 220.54
            </h2>
            <p className={P} data-src={L}>
              Where one feeder or service supplies several dwelling units, Table 220.54 lowers the dryers&apos; total.{' '}
              <span data-src={CALC}>
                Five dryers of <Val v={5000} unit="W" src="input" /> count at <Val v={FIVE.demandPct} unit="%" src={L} />, or{' '}
                <Val v={FIVE.feederW} unit="W" src={CALC} />.
              </span>
            </p>
            <DataTable id="dryer-table" variant="ruled" src={L} caption="NEC 2023 Table 220.54" className="max-w-[30rem]">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Dryers
                  </th>
                  <th scope="col" className={RTH}>
                    Demand factor
                  </th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((r) => (
                  <tr key={r.from}>
                    <th scope="row" className={clsx(RSTICKY_TD, '!font-normal')}>
                      <Num v={r.from} src={L} />
                      {r.to === null ? ' and over' : r.to !== r.from ? <> to <Num v={r.to} src={L} /></> : null}
                    </th>
                    <td className={clsx(RTD, '!whitespace-normal')}>
                      <Val v={r.pct} unit="%" src={L} />
                      {r.lessPct > 0 ? (
                        <>
                          {' '}
                          less <Val v={r.lessPct} unit="%" src={L} /> for each dryer over <Num v={r.over} src={L} />
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <SourceLine domains={[L]} />
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>What size wire for a dryer?</h3>
              <p className={P} data-src={CALC}>
                <Size s={WIRE_30.cuCable} /> copper for the <Val v={C30} unit="A" src={MFR_DOMAIN} /> circuit Whirlpool and GE call for, with{' '}
                {WIRE_30.egcCu ? <Size s={WIRE_30.egcCu} /> : null} copper as the ground wire.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What size breaker for a dryer?</h3>
              <p className={P} data-src={MFR_DOMAIN}>
                The one in the dryer&apos;s instructions: <Val v={C30} unit="A" src={MFR_DOMAIN} /> for the Whirlpool and GE dryers above. The wire must
                carry that rating.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How many amps does a dryer use?</h3>
              <p className={P} data-src={MFR_DOMAIN}>
                Its nameplate says. GE&apos;s {GE_DBLR333EE.model} draws <Val v={GE_DBLR333EE.at240.a} unit="A" src={MFR_DOMAIN} /> at{' '}
                <Val v={240} unit="V" src="input" /> and <Val v={GE_DBLR333EE.at208.a} unit="A" src={MFR_DOMAIN} /> at <Val v={208} unit="V" src="input" />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Can I use aluminum wire for a dryer?</h3>
              <p className={P} data-src={CALC}>
                <Size s={WIRE_30.alCable} /> aluminum carries a <Val v={C30} unit="A" src={MFR_DOMAIN} /> circuit, but Whirlpool&apos;s instructions say
                not to use aluminum for direct wiring. Follow the dryer&apos;s own instructions.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does a dryer need GFCI protection?</h3>
              <p className={P} data-src={EXC}>
                Under the 2023 NEC, yes: 210.8(D) covers the branch circuit or outlet of a clothes dryer. Check your state&apos;s adoption for amendments.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={NEMA_DOMAIN}>
                3-prong or 4-prong dryer outlet?
              </h3>
              <p className={P} data-src={MFR_DOMAIN}>
                The 4-prong {N4.config} has a ground; the 3-prong {N3.config} does not. Whirlpool&apos;s instructions say the NEC requires the 4-wire
                connection in homes built after 1996 and in all mobile homes.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[L, AMP, TERM, SMALL_SRC, OCPD, EGC, MFR_DOMAIN, NEMA_DOMAIN, EXC]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#dryer-method" className={LINK}>
                methodology page
              </Link>{' '}
              sets out each step and each source. Values from a maker&apos;s instructions apply to that maker&apos;s dryers. NFPA 70®, National Electrical
              Code® and NEC® are registered trademarks of the National Fire Protection Association; wiresizes.com is not affiliated with or endorsed by
              NFPA.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
