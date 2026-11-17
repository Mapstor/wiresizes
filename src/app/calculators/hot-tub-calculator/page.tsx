import type { Metadata } from 'next';
import Link from 'next/link';
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
import { HotTubTool } from '@/components/calculators/HotTubTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { HotTubDropChart } from '@/components/look/Charts';
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
import { HT_CALC } from '@/lib/calculations/hot-tub';
import { articleDates } from '@/lib/page-dates';
import { BREAKER_ROWS, DROP_ROWS, HT_DROP_PCT, HT_HIGH, HT_LOW, HT_MAIN_A, LONG_RUN, LONG_RUN_FIRST_DROP, LONG_RUN_FT, breakerRow } from '@/lib/hot-tub-page';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { MFR_SPAS_DOMAIN, SPA_MAKERS } from '@/lib/verified/mfr-spas';

// /calculators/hot-tub-calculator (WSZ-011d; withdrawn in WSZ-002, back as a new page; makers' data WSZ-035): the
// copper circuit for the breaker a hot tub's manual asks for (the wire size engine: nec-310-16, nec-110-14c,
// nec-240-ocpd, nec-240-4-d, nec-250-grounding, conductor-resistance-20c) and the makers' own requirements (mfr-spas).
// No NEC Article 680 rule is stated (nec-680-pools-spas is a GAP).
const ROUTE = '/calculators/hot-tub-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Hot Tub Wire Size Calculator: 50 Amp Spa Wire, Breaker and GFCI';
const DESCRIPTION =
  'Copper wire size for a hot tub from the breaker its manual asks for and your run, with the ground wire, voltage drop and what Hot Spring, Bullfrog and Marquis require.';

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
const SPAS = MFR_SPAS_DOMAIN;
const CALC = HT_CALC;

const MAIN = breakerRow(240, HT_MAIN_A);
const SIXTY = breakerRow(240, 60);
const MARQUIS = SPA_MAKERS.find((m) => m.maker === 'Marquis' && m.volts === 240);
const HOTSPRING = SPA_MAKERS.find((m) => m.maker === 'Hot Spring' && m.volts === 240);
const BULLFROG = SPA_MAKERS.find((m) => m.maker === 'Bullfrog' && m.volts === 240);
if (!MARQUIS || !HOTSPRING || !BULLFROG) throw new Error('hot tub page: maker rows missing');

const TOC: ([string, string] | [string, string, string])[] = [
  ['wire-by-breaker', 'Wire for a hot tub, by breaker'],
  ['makers', 'What the makers ask for'],
  ['long-runs', 'Long runs and voltage drop'],
  ['gfci', 'GFCI and the disconnect'],
  ['plug-in', '120 V plug-in hot tubs', SPAS],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Hot Tub Wire Size Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Hot Tub Wire Size Calculator', url: URL, description: DESCRIPTION };

function A({ v, src = OCPD }: { v: number; src?: string }) {
  return <Val v={v} unit="A" src={src} />;
}
function C({ v }: { v: number }) {
  return <Val v={v} unit="°C" src={TERM} />;
}

function BreakerTable() {
  return (
    <DataTable id="ht-wire" variant="ruled" src={CALC} caption="Copper wire and ground wire for a hot tub circuit, by breaker">
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Breaker
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')} data-src={TERM}>
            Copper <C v={HT_LOW} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')} data-src={TERM}>
            Copper <C v={HT_HIGH} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Ground
          </th>
        </tr>
      </thead>
      <tbody>
        {BREAKER_ROWS.map((r) => (
          <tr key={`${r.volts}-${r.breakerA}`}>
            <th scope="row" className={clsx(RSTICKY_TD, '!whitespace-nowrap')} data-src={SPAS}>
              <A v={r.breakerA} src="input" />, <Val v={r.volts} unit="V" src={SPAS} />
            </th>
            <td className={RTD}>
              <Size s={r.cu60.size} />
            </td>
            <td className={RTD}>
              <Size s={r.cu75.size} />
            </td>
            <td className={RTD} data-src={GND}>
              <Size s={r.egc} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function MakerTable() {
  return (
    <DataTable id="ht-makers" variant="ruled" src={SPAS} caption="What three hot tub makers ask for (2026 manuals)">
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Maker
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Supply
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0 !whitespace-normal')}>
            GFCI
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0 !whitespace-normal')}>
            Wires
          </th>
        </tr>
      </thead>
      <tbody>
        {SPA_MAKERS.map((m) => (
          <tr key={`${m.maker}-${m.model}`}>
            <th scope="row" className={clsx(RSTICKY_TD, '!min-w-[8rem] !whitespace-normal !font-display !font-normal')} data-src={SPAS}>
              {m.maker} {m.model}
            </th>
            <td className={clsx(RTD, '!whitespace-nowrap')} data-src={SPAS}>
              <Val v={m.volts_printed} unit="V" src={SPAS} />,{' '}
              {m.breaker_a.map((a, k) => (
                <span key={a}>
                  {k > 0 ? ' or ' : ''}
                  <A v={a} src={SPAS} />
                </span>
              ))}
            </td>
            <td className={clsx(RTD, '!min-w-[12rem] !whitespace-normal !text-left !font-display')} data-src={SPAS}>
              {m.gfci}
            </td>
            <td className={clsx(RTD, '!min-w-[14rem] !whitespace-normal !text-left !font-display')} data-src={SPAS}>
              {m.conductors}
              {m.copper_only ? '; copper only' : ''}
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
      id="ht-drop"
      variant="ruled"
      src={CALC}
      caption={`One-way length at which a ${HT_MAIN_A} A, 240 V hot tub circuit drops ${HT_DROP_PCT} % at the full rating`}
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

export default function HotTubCalculatorPage() {
  const first = LONG_RUN.feeder.minSizeByAmpacity;
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Hot Tub Wire Size Calculator" sub="50 Amp Spa Wire, Breaker and GFCI" joiner=": " src={SPAS} />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            The copper wire for the breaker your hot tub&apos;s manual asks for, with the ground wire and the voltage drop over your run, and what
            the makers require for GFCI and the disconnect.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <HotTubTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={CALC}>
            <strong>
              A <A v={HT_MAIN_A} src={SPAS} /> hot tub circuit takes <Size s={MAIN.cu60.size} /> copper at <C v={HT_LOW} /> terminals, or{' '}
              <Size s={MAIN.cu75.size} /> where the breaker, the disconnect and the hot tub are listed for <C v={HT_HIGH} />, with a{' '}
              <Size s={MAIN.egc} /> copper ground wire and four wires in all.
            </strong>{' '}
            <span data-src={SPAS}>
              Hot Spring, Bullfrog and Marquis all ask for <A v={HT_MAIN_A} src={SPAS} />, a GFCI and copper wire.
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="wire-by-breaker" className="space-y-5">
            <h2 id="wire-by-breaker" className={H2}>
              Wire for a hot tub, by breaker
            </h2>
            <p className={P} data-src={TERM}>
              The circuit is sized by the breaker the hot tub&apos;s manual names, in Table 310.16. Under 110.14(C)(1)(a) a circuit of{' '}
              <A v={TERMINATION_RULES.limitA} src={TERM} /> or less is sized in the <C v={HT_LOW} /> column unless the breaker, the disconnect and
              the hot tub are all listed and identified for <C v={HT_HIGH} /> conductors; the site keeps NM and UF cable at <C v={HT_LOW} />. A{' '}
              <A v={60} src="input" /> circuit takes <Size s={SIXTY.cu60.size} /> or <Size s={SIXTY.cu75.size} />.
            </p>
            <BreakerTable />
          </section>

          <section aria-labelledby="makers" className="space-y-5">
            <h2 id="makers" className={H2}>
              What the makers ask for
            </h2>
            <p className={P} data-src={SPAS}>
              The hot tub&apos;s manual sets the breaker; the wire follows from it. Three makers&apos; 2026 manuals ask for{' '}
              <A v={HT_MAIN_A} src={SPAS} /> at <Val v={240} unit="V" src={SPAS} /> (Bullfrog also allows <A v={60} src={SPAS} />), four wires, GFCI
              protection and copper only. Marquis names the wire: three <Size s="6" /> copper conductors and an <Size s="8" /> copper ground, one
              size above the <Size s={MAIN.egc} /> of Table 250.122; follow the manual where it asks for more.
            </p>
            <MakerTable />
          </section>

          <section aria-labelledby="long-runs" className="space-y-5">
            <h2 id="long-runs" className={H2}>
              Long runs and voltage drop
            </h2>
            <p className={P} data-src={CALC}>
              Table 310.16 sizes for current, not distance. At the full <A v={HT_MAIN_A} src={SPAS} /> and <Val v={240} unit="V" src={SPAS} />, copper at{' '}
              <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} /> drops <Val v={HT_DROP_PCT} unit="%" src={SPAS} /> at the lengths below; Hot Spring
              asks for <Val v={HT_DROP_PCT} unit="%" src={SPAS} /> on long runs. Past your target, the calculator moves the wire up a size and the ground
              wire with it (250.122(B)).
            </p>
            <DropTable />
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    The longest one-way copper run for a <A v={HT_MAIN_A} src={SPAS} /> hot tub before the drop passes{' '}
                    <Val v={HT_DROP_PCT} unit="%" src={SPAS} />.
                  </span>
                  <SourceLine domains={[AMP, RES]} />
                </>
              }
            >
              <HotTubDropChart />
            </Figure>
          </section>

          <section aria-labelledby="gfci" className="space-y-5">
            <h2 id="gfci" className={H2}>
              GFCI and the disconnect
            </h2>
            <p className={P} data-src={SPAS}>
              Every reviewed maker asks for GFCI protection: Marquis a Class A GFCI, Hot Spring the GFCI breakers in the subpanel it ships with the
              hot tub, Bullfrog a GFCI-protected circuit. Marquis puts the disconnect within sight of the equipment and at least{' '}
              <Val v={5} unit="ft" src={SPAS} /> from the inside walls of the hot tub; Hot Spring puts its subpanel within sight and at least{' '}
              <Val v={5} unit="ft" src={SPAS} /> from the water&apos;s edge.
            </p>
            <p className={P}>
              The NEC&apos;s own hot tub rules are in Article 680. This site has not checked their 2023 text against NFPA&apos;s records, so it
              gives the makers&apos; requirements and not the code&apos;s; your inspector applies the edition your state adopted.
            </p>
          </section>

          <section aria-labelledby="plug-in" className="space-y-5">
            <h2 id="plug-in" className={H2} data-src={SPAS}>
              120 V plug-in hot tubs
            </h2>
            <p className={P} data-src={SPAS}>
              Plug-in hot tubs run on a dedicated <Val v={120} unit="V" src={SPAS} /> circuit: <A v={15} src={SPAS} /> for Bullfrog and Marquis, and{' '}
              <A v={20} src={SPAS} /> with a GFCI breaker and <Size s="12" /> wire for Hot Spring&apos;s <Val v={115} unit="V" src={SPAS} /> model. The
              cord&apos;s length is fixed; Marquis puts the receptacle at least <Val v={5} unit="ft" src={SPAS} /> from the hot tub and rules out
              extension cords.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SPAS}>
                What gauge wire for a <A v={HT_MAIN_A} src={SPAS} /> hot tub?
              </h3>
              <p className={P} data-src={CALC}>
                <Size s={MAIN.cu60.size} /> copper at <C v={HT_LOW} /> terminals, or <Size s={MAIN.cu75.size} /> where everything on the circuit is
                listed for <C v={HT_HIGH} />, with a <Size s={MAIN.egc} /> copper ground wire (Marquis asks for <Size s="8" />).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>What size breaker does a hot tub need?</h3>
              <p className={P} data-src={SPAS}>
                The one its manual names: <A v={HT_MAIN_A} src={SPAS} /> for the <Val v={240} unit="V" src={SPAS} /> models of Hot Spring, Bullfrog and
                Marquis, <A v={60} src={SPAS} /> as Bullfrog&apos;s other choice, and <A v={15} src={SPAS} /> or <A v={20} src={SPAS} /> for plug-in models.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does a hot tub need a GFCI?</h3>
              <p className={P} data-src={SPAS}>
                Yes, by every reviewed maker: a GFCI breaker or disconnect, a GFCI subpanel, or the cord&apos;s own GFCI on plug-in models.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={CALC}>
                What wire for a hot tub <Val v={LONG_RUN_FT} unit="ft" src={CALC} /> from the panel?
              </h3>
              <p className={P} data-src={CALC}>
                At <A v={HT_MAIN_A} src={SPAS} />, <Size s={LONG_RUN.feeder.size} /> copper keeps the drop to{' '}
                <Val v={LONG_RUN.feeder.vdPct} unit="%" src={CALC} format={{ fixed: 2 }} />; <Size s={first} /> would reach{' '}
                <Val v={LONG_RUN_FIRST_DROP} unit="%" src={CALC} format={{ fixed: 2 }} />. The ground wire grows with it, to{' '}
                <Size s={LONG_RUN.feeder.egc ?? MAIN.egc} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Can I use aluminum wire for a hot tub?</h3>
              <p className={P} data-src={SPAS}>
                Not by the makers&apos; manuals: Hot Spring, Bullfrog and Marquis all ask for copper wiring, and the calculator gives copper only.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, TERM, OCPD, SMALL, GND, RES, SPAS]}
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
              <Link href="/methodology#hot-tub-method" className={LINK}>
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
