import type { Metadata } from 'next';
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
import { RvHookupTool } from '@/components/calculators/RvHookupTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { RvDemandChart } from '@/components/look/Charts';
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
import { RV_CALC } from '@/lib/calculations/rv-hookup';
import { articleDates } from '@/lib/page-dates';
import { DROP_ROWS, LONG_RUN, LONG_RUN_FIRST_DROP, LONG_RUN_FT, NEC_EXAMPLE_PARK, OUTLET_ROWS, RV_DROP_PCT, RV_HIGH, RV_LOW, outletRow } from '@/lib/rv-page';
import { RV_OUTLETS } from '@/lib/calculations/rv-hookup';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { max240_4D } from '@/lib/verified/nec-240-4-d';
import { DEMAND_FACTORS } from '@/lib/verified/nec-551';
import type { SizeKey } from '@/lib/verified/awg';
import { OUTDOOR_GFCI } from '@/lib/verified/nec-210-8-f';
import { NEC_EXAMPLE, NEC_551_DOMAIN, RECEPTACLE_SHARES, SITE_VA } from '@/lib/verified/nec-551';
import { nemaConfig } from '@/lib/verified/nema-receptacle-configs';

// /calculators/rv-hookup-calculator (WSZ-011b; spec: research/page-specs-held.md; data gate BUILD since WSZ-033;
// withdrawn in WSZ-002, back as a new page): one RV outlet at a house (the wire size engine: nec-310-16, nec-110-14c,
// nec-240-4-d, nec-240-ocpd, nec-250-grounding, conductor-resistance-20c; NEMA ratings: nema-receptacle-configs; GFCI:
// 210.8(F), nec-2023-rule-excerpts) and an RV park feeder (551.71 and 551.73: nec-551-rv-demand). No tent-site,
// two-vehicle or amenity loads, no 551.77, no 2026 rewrite of 551.71.
const ROUTE = '/calculators/rv-hookup-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'RV Hookup Calculator: 30 and 50 Amp RV Wire Size and Park Load';
const DESCRIPTION =
  'Wire size for a 30 A or 50 A RV outlet with the voltage drop over your run, GFCI, and the NEC 551.73 calculated load of an RV park feeder.';

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
const NEMA = 'nema-receptacle-configs';
const GFCI = 'nec-2023-rule-excerpts';
const RV = NEC_551_DOMAIN;
const CALC = RV_CALC;

const R50 = outletRow('1450');
const R30 = outletRow('tt30');
const TT30 = nemaConfig('TT-30R');
const N1450 = nemaConfig('14-50R');
const LAST = DEMAND_FACTORS[DEMAND_FACTORS.length - 1];
const CU10 = (() => {
  const r = max240_4D('10', 'Cu');
  if (!r) throw new Error('rv page: no 240.4(D) row for 10 AWG copper');
  return r;
})();

const TOC: ([string, string] | [string, string, string])[] = [
  ['outlet-wire', 'Wire for a 30 A and a 50 A RV outlet', NEMA],
  ['long-runs', 'Long runs and voltage drop'],
  ['receptacles', 'TT-30R and 14-50R', NEMA],
  ['gfci', 'GFCI for an RV outlet'],
  ['park-load', 'RV park feeders: Table 551.73(A)'],
  ['park-receptacles', 'Receptacles an RV park provides'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'RV Hookup Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'RV Hookup Calculator', url: URL, description: DESCRIPTION };

function A({ v, src = OCPD }: { v: number; src?: string }) {
  return <Val v={v} unit="A" src={src} />;
}
function C({ v }: { v: number }) {
  return <Val v={v} unit="°C" src={TERM} />;
}
/** A receptacle name kept on one line: a browser may otherwise break "TT-30R" after its hyphen. */
function Cfg({ c }: { c: string }) {
  return <span className="whitespace-nowrap">{c}</span>;
}
function Pair({ cu, al }: { cu: SizeKey; al: SizeKey }) {
  return (
    <>
      <Size s={cu} /> copper or <Size s={al} /> aluminum
    </>
  );
}

function OutletTable() {
  return (
    <DataTable id="rv-outlet-wire" variant="ruled" src={CALC} caption="Wire and ground wire for an RV outlet circuit">
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Outlet
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')} data-src={TERM}>
            Copper <C v={RV_LOW} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')} data-src={TERM}>
            Copper <C v={RV_HIGH} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')} data-src={TERM}>
            Aluminum <C v={RV_LOW} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')} data-src={TERM}>
            Aluminum <C v={RV_HIGH} />
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Ground
          </th>
        </tr>
      </thead>
      <tbody>
        {OUTLET_ROWS.map((r) => (
          <tr key={r.outlet}>
            <th scope="row" className={clsx(RSTICKY_TD, '!whitespace-nowrap')} data-src={NEMA}>
              <A v={r.breakerA} src={NEMA} /> {r.config}
            </th>
            <td className={RTD}>
              <Size s={r.cu60.size} />
            </td>
            <td className={RTD}>
              <Size s={r.cu75.size} />
            </td>
            <td className={RTD}>
              <Size s={r.al60.size} />
            </td>
            <td className={RTD}>
              <Size s={r.al75.size} />
            </td>
            <td className={RTD} data-src={GND}>
              <Size s={r.egcCu} /> / <Size s={r.egcAl} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function DropTable() {
  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-6 [&>*]:min-w-0">
      {DROP_ROWS.map((d) => (
        <DataTable
          key={d.outlet}
          id={`rv-drop-${d.outlet}`}
          variant="ruled"
          src={CALC}
          caption={`${d.config}: one-way length at which the full rating drops ${RV_DROP_PCT} %`}
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
            {d.rows.map((r) => (
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
      ))}
    </div>
  );
}

function SiteLoadTable() {
  const rows = [
    { what: 'Site with 50 A, 120/240 V or 208Y/120 V supply', va: SITE_VA.site50 },
    { what: 'Site with both 20 A and 30 A supply', va: SITE_VA.site30 },
    { what: 'Site with only 20 A supply', va: SITE_VA.site20 },
    { what: 'Tent site with only 20 A supply', va: SITE_VA.tent },
  ];
  return (
    <DataTable id="rv-site-va" variant="ruled" src={RV} caption="Calculated load per site, NEC 551.73(A)">
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH, '!whitespace-normal')}>
            Site
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Load
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.what}>
            <th scope="row" className={clsx(RSTICKY_TD, '!min-w-[10rem] max-w-[22rem] !whitespace-normal !font-display !font-normal')} data-src={RV}>
              {r.what}
            </th>
            <td className={RTD}>
              <Val v={r.va} unit="VA" src={RV} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function RvHookupCalculatorPage() {
  const longFirst = LONG_RUN.feeder.minSizeByAmpacity;
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="RV Hookup Calculator" sub="30 and 50 Amp RV Wire Size and Park Load" joiner=": " src={NEMA} />
          <p className={clsx(LOOK_LEAD, 'mt-5')} data-src={NEMA}>
            The wire for a 30 A or 50 A RV outlet at a house, with the voltage drop over your run, and the calculated load of an RV park feeder
            from NEC 551.73.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <RvHookupTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={CALC}>
            <strong>
              A <A v={R50.breakerA} src={NEMA} /> RV outlet (<Cfg c="14-50R" />) takes <Pair cu={R50.cu60.size} al={R50.al60.size} /> at <C v={RV_LOW} />{' '}
              terminals, or <Pair cu={R50.cu75.size} al={R50.al75.size} /> where the breaker and receptacle are listed for <C v={RV_HIGH} />. A{' '}
              <A v={R30.breakerA} src={NEMA} /> outlet (<Cfg c="TT-30R" />) takes <Pair cu={R30.cu60.size} al={R30.al60.size} />.
            </strong>{' '}
            <span data-src={GND}>
              Both take a <Size s={R50.egcCu} /> copper ground wire (Table 250.122).
            </span>
          </p>
          <p className={P} data-src={CALC}>
            A long run needs more: at <Val v={LONG_RUN_FT} unit="ft" src={CALC} /> a <A v={R50.breakerA} src={NEMA} /> outlet on{' '}
            <Size s={longFirst} /> copper drops more than <Val v={RV_DROP_PCT} unit="%" src="input" /> at the full rating, so it takes{' '}
            <Size s={LONG_RUN.feeder.size} /> (<Val v={LONG_RUN.feeder.vdPct} unit="%" src={CALC} format={{ fixed: 2 }} />).
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="outlet-wire" className="space-y-5">
            <h2 id="outlet-wire" className={H2} data-src={NEMA}>
              Wire for a 30 A and a 50 A RV outlet
            </h2>
            <p className={P} data-src={TERM}>
              An RV outlet circuit is sized by its breaker in Table 310.16. Under 110.14(C)(1)(a) a circuit of{' '}
              <A v={TERMINATION_RULES.limitA} src={TERM} /> or less is sized in the <C v={RV_LOW} /> column unless the breaker, the receptacle and every other
              termination are listed and identified for <C v={RV_HIGH} /> conductors. The site keeps NM and UF cable at <C v={RV_LOW} />. 240.4(D) holds{' '}
              <Size s="10" /> copper to <A v={CU10.max_ocpd_a} src={SMALL} />.
            </p>
            <OutletTable />
          </section>

          <section aria-labelledby="long-runs" className="space-y-5">
            <h2 id="long-runs" className={H2}>
              Long runs and voltage drop
            </h2>
            <p className={P} data-src={CALC}>
              Table 310.16 sizes for current, not distance. The tables below give the one-way length at which copper at{' '}
              <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} /> drops <Val v={RV_DROP_PCT} unit="%" src="input" /> at the full rating:{' '}
              <Val v={RV_OUTLETS.tt30.volts} unit="V" src={CALC} /> for a <Cfg c="TT-30R" />, <Val v={RV_OUTLETS['1450'].volts} unit="V" src={CALC} />{' '}
              between the hots for a <Cfg c="14-50R" />. An RV that draws less than the rating drops less. Past your target, the calculator moves
              the wire up a size and the ground wire with it (250.122(B)).
            </p>
            <DropTable />
          </section>

          <section aria-labelledby="receptacles" className="space-y-5">
            <h2 id="receptacles" className={H2} data-src={NEMA}>
              <Cfg c="TT-30R" /> and <Cfg c="14-50R" />
            </h2>
            <p className={P} data-src={NEMA}>
              The <Cfg c="TT-30R" /> is rated <Val v={TT30.amps} unit="A" src={NEMA} />, {TT30.volts} V, {TT30.poles}-pole {TT30.wires}-wire grounding: one
              hot, a neutral and a ground. The <Cfg c="14-50R" /> is rated <Val v={N1450.amps} unit="A" src={NEMA} />, {N1450.volts} V, {N1450.poles}-pole{' '}
              {N1450.wires}-wire grounding: two hots, a neutral and a ground. The calculator sizes each for a breaker of its own rating.
            </p>
          </section>

          <section aria-labelledby="gfci" className="space-y-5">
            <h2 id="gfci" className={H2}>
              GFCI for an RV outlet
            </h2>
            <p className={P} data-src={GFCI}>
              At a house, 210.8(F) asks for GFCI protection at outdoor outlets on single-phase circuits of up to{' '}
              <A v={OUTDOOR_GFCI.maxA} src={GFCI} /> and <Val v={OUTDOOR_GFCI.maxVoltsToGround} unit="V" src={GFCI} /> to ground, so an outdoor{' '}
              <Cfg c="TT-30R" /> or <Cfg c="14-50R" /> needs it.
            </p>
            <p className={P} data-src={RV}>
              At an RV park, 551.71(F) asks for GFCI protection in site equipment only for the 125 V, single-phase, 15 A and 20 A receptacles; the
              30 A and 50 A receptacles there do not need it.
            </p>
          </section>

          <section aria-labelledby="park-load" className="space-y-5">
            <h2 id="park-load" className={H2}>
              RV park feeders: Table 551.73(A)
            </h2>
            <p className={P} data-src={RV}>
              551.73(A) sets a load for each site by its supply, and Table 551.73(A) the lowest demand factor allowed for the number of sites. Under
              551.73(B) the factor for the number of sites applies to all of them: the NEC&apos;s example is <Num v={NEC_EXAMPLE.sites} src={RV} />{' '}
              sites at <Val v={NEC_EXAMPLE.pct} unit="%" src={RV} /> of <Val v={NEC_EXAMPLE.site_va} unit="VA" src={RV} />, which is{' '}
              <Val v={NEC_EXAMPLE.per_site_va} unit="VA" src={RV} /> a site and <Val v={NEC_EXAMPLE.total_va} unit="VA" src={RV} /> in all, or{' '}
              <Val v={NEC_EXAMPLE_PARK.amps240} unit="A" src={CALC} format={{ fixed: 1 }} /> at <Val v={240} unit="V" src={RV} />.
            </p>
            <SiteLoadTable />
            <Figure
              caption={
                <>
                  <span data-src={RV}>
                    Table 551.73(A): the share of the sites&apos; load a park feeder or service is calculated for, from{' '}
                    <Val v={DEMAND_FACTORS[0].pct} unit="%" src={RV} /> for one site to <Val v={LAST.pct} unit="%" src={RV} /> for{' '}
                    <Num v={LAST.from} src={RV} /> or more.
                  </span>
                  <SourceLine domains={[RV]} />
                </>
              }
            >
              <RvDemandChart />
            </Figure>
            <p className={P} data-src={RV}>
              Service buildings, recreational buildings and pools are calculated on their own and added where they share the service. Where one
              supply serves two RVs, 551.73(A) counts only its two highest-rated receptacles.
            </p>
          </section>

          <section aria-labelledby="park-receptacles" className="space-y-5">
            <h2 id="park-receptacles" className={H2}>
              Receptacles an RV park provides
            </h2>
            <p className={P} data-src={RV}>
              Under 551.71 every site with electrical supply has a 20 A, 125 V receptacle. At least{' '}
              <Val v={RECEPTACLE_SHARES.min30Pct} unit="%" src={RV} /> of the sites also have a 30 A, 125 V receptacle, and at least{' '}
              <Val v={RECEPTACLE_SHARES.min50PctExisting} unit="%" src={RV} /> of existing and <Val v={RECEPTACLE_SHARES.min50PctNew} unit="%" src={RV} />{' '}
              of new sites a 50 A, 125/250 V receptacle, each of those with a 30 A receptacle as well. Tent sites with only 15 A or 20 A supply may
              be left out of these shares (551.71(D)).
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={NEMA}>What size wire for a 50 amp RV outlet?</h3>
              <p className={P} data-src={CALC}>
                <Pair cu={R50.cu60.size} al={R50.al60.size} /> at <C v={RV_LOW} /> terminals; <Pair cu={R50.cu75.size} al={R50.al75.size} /> where
                the breaker and the <Cfg c="14-50R" /> are listed for <C v={RV_HIGH} />. The ground wire is <Size s={R50.egcCu} /> copper or{' '}
                <Size s={R50.egcAl} /> aluminum, and the circuit runs four wires.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={NEMA}>What size wire for a 30 amp RV outlet?</h3>
              <p className={P} data-src={CALC}>
                <Pair cu={R30.cu60.size} al={R30.al60.size} />, with a <Size s={R30.egcCu} /> copper or <Size s={R30.egcAl} /> aluminum ground wire;
                the <Cfg c="TT-30R" /> circuit runs three wires.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={CALC}>
                What wire for a 50 amp RV outlet <Val v={LONG_RUN_FT} unit="ft" src={CALC} /> away?
              </h3>
              <p className={P} data-src={CALC}>
                <Size s={LONG_RUN.feeder.size} /> copper keeps the drop at the full <A v={R50.breakerA} src={NEMA} /> to{' '}
                <Val v={LONG_RUN.feeder.vdPct} unit="%" src={CALC} format={{ fixed: 2 }} />; <Size s={longFirst} /> would reach{' '}
                <Val v={LONG_RUN_FIRST_DROP} unit="%" src={CALC} format={{ fixed: 2 }} />.
                With the larger wire the ground wire grows too: <Size s={LONG_RUN.feeder.egc ?? R50.egcCu} /> copper.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does an RV outlet need GFCI protection?</h3>
              <p className={P} data-src={GFCI}>
                Outdoors at a house, yes: 210.8(F) covers outdoor outlets up to <A v={OUTDOOR_GFCI.maxA} src={GFCI} />. In RV park site equipment,
                only the 125 V, 15 A and 20 A receptacles need it (551.71(F)).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={RV}>
                How much load do <Num v={NEC_EXAMPLE.sites} src={RV} /> RV sites put on a feeder?
              </h3>
              <p className={P} data-src={RV}>
                With 20 A and 30 A supply at each, <Val v={NEC_EXAMPLE.total_va} unit="VA" src={RV} /> (the NEC&apos;s own example in 551.73(B)), or{' '}
                <Val v={NEC_EXAMPLE_PARK.amps240} unit="A" src={CALC} format={{ fixed: 1 }} /> at <Val v={240} unit="V" src={RV} />.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, TERM, OCPD, SMALL, GND, RES, NEMA, GFCI, RV]}
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
              <Link href="/methodology#rv-method" className={LINK}>
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

