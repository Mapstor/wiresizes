import type { Metadata } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { Byline } from '@/components/content/Byline';
import { DataTable, RSTICKY_TD, RSTICKY_TH, RTD, RTH } from '@/components/content/DataTable';
import { Num } from '@/components/content/Num';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { BtuTool } from '@/components/calculators/BtuTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
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
import {
  BTU_PER_H_PER_TON,
  ENGINE_ID,
  W_PER_BTU_PER_H,
  W_PER_TON_REFRIGERATION,
  btuPerHourToTons,
  btuPerHourToWatts,
  wattsToBtuPerHour,
} from '@/lib/calculations/conversions';
import { articleDates } from '@/lib/page-dates';

// /calculators/btu-to-watts-calculator (WSZ-007d; spec: research/page-specs.md "WSZ-007"): the converter in the look
// (D-33, D-35), every number from the conversions engine with its source in data-src: NIST SP 811 Appendix B.8,
// 1 Btu_IT/h = 0.2930711 W and 1 ton of refrigeration = 12,000 Btu_IT/h = 3,516.853 W. Worked examples = golden
// "conversion" cases 12,000 and 9,000 Btu/h, 1,000 W and 1 ton. The MCA/MOP table, SEER/HSPF minimums, fuel prices,
// rules of thumb and "EER = SEER × 0.875" are gone: none had a source.
const ROUTE = '/calculators/btu-to-watts-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'BTU to Watts Calculator: Btu/h, Watts and Tons';
const DESCRIPTION =
  'Btu per hour to watts and tons: 1 Btu/h = 0.2930711 W (NIST SP 811). 12,000 Btu/h, one ton, is 3,516.85 W; 9,000 Btu/h is 2,637.6 W.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const SP811 = 'nist-sp811-conversions';
const CALC = `calc:${ENGINE_ID}`;
const W6 = (v: number) => Number(v.toPrecision(6));

/** Btu per hour to watts and tons, one row each. */
const TABLE_BTU = [5000, 6000, 8000, 9000, 10000, 12000, 14000, 15000, 18000, 24000, 30000, 36000, 42000, 48000, 60000];
const NINE = 9000;
const THOUSAND_W = 1000;

const TOC: ([string, string] | [string, string, string])[] = [
  ['factors', 'The factors'],
  ['table', 'Btu/h to watts and tons', CALC],
  ['heat', 'Heat, not electricity'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'BTU to Watts Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'BTU to Watts Calculator', url: URL, description: DESCRIPTION };

export default function BtuToWattsPage() {
  const W = (btu: number) => <Val v={W6(btuPerHourToWatts(btu))} unit="W" src={CALC} />;
  const B = (btu: number) => <Val v={btu} unit="Btu/h" src={CALC} />;
  const tons = (btu: number) => (
    <span data-src={CALC}>
      <Num v={W6(btuPerHourToTons(btu))} src={CALC} /> {btuPerHourToTons(btu) === 1 ? 'ton' : 'tons'}
    </span>
  );
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="BTU to Watts Calculator" sub="Btu/h, Watts and Tons" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>Enter a rate in Btu per hour, watts or tons of refrigeration to get the other two.</p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <BtuTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={SP811}>
            <strong>
              Multiply Btu per hour by <Num v={W_PER_BTU_PER_H} src={SP811} /> to get watts; divide by <Num v={BTU_PER_H_PER_TON} src={SP811} /> to get
              tons.
            </strong>{' '}
            <span data-src={CALC}>
              {B(BTU_PER_H_PER_TON)}, one ton, is {W(BTU_PER_H_PER_TON)}; {B(NINE)} is {W(NINE)}.
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="factors" className="space-y-4">
            <h2 id="factors" className={H2}>
              The factors
            </h2>
            <p className={LOOK_FORMULA} data-src={SP811}>
              1 Btu/h = <Val v={W_PER_BTU_PER_H} unit="W" src={SP811} />
            </p>
            <p className={LOOK_FORMULA} data-src={SP811}>
              1 ton of refrigeration = <Val v={BTU_PER_H_PER_TON} unit="Btu/h" src={SP811} /> = <Val v={W_PER_TON_REFRIGERATION} unit="W" src={SP811} />
            </p>
            <p className={P} data-src={SP811}>
              Both come from NIST Special Publication 811, the Guide for the Use of the International System of Units, Appendix B.8. The Btu
              is the International Table Btu. The other way, <span data-src={CALC}><Val v={THOUSAND_W} unit="W" src={CALC} /> is{' '}
              <Val v={W6(wattsToBtuPerHour(THOUSAND_W))} unit="Btu/h" src={CALC} /></span>.
            </p>
          </section>

          <section aria-labelledby="table" className="space-y-5">
            <h2 id="table" className={H2} data-src={CALC}>
              Btu/h to watts and tons
            </h2>
            <DataTable id="btu-table" variant="ruled" src={CALC} caption="Btu per hour in watts and tons">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Btu/h
                  </th>
                  <th scope="col" className={RTH}>
                    Watts
                  </th>
                  <th scope="col" className={RTH}>
                    Tons
                  </th>
                </tr>
              </thead>
              <tbody>
                {TABLE_BTU.map((btu) => (
                  <tr key={btu}>
                    <th scope="row" className={RSTICKY_TD}>
                      <Num v={btu} src={CALC} />
                    </th>
                    <td className={RTD}>{W(btu)}</td>
                    <td className={RTD}>
                      <Num v={W6(btuPerHourToTons(btu))} src={CALC} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section aria-labelledby="heat" className="space-y-4">
            <h2 id="heat" className={H2}>
              Heat, not electricity
            </h2>
            <p className={P} data-src={SP811}>
              Btu per hour, watts and tons here all measure the same thing: a rate of heat. The watts are the heat a heater gives off or an air
              conditioner or heat pump moves, not the electric power the unit draws. That comes from its nameplate, and the{' '}
              <Link href="/calculators/watts-to-amps-calculator" className={LINK}>
                watts to amps calculator
              </Link>{' '}
              turns it into a current for the{' '}
              <Link href="/calculators/wire-size-calculator" className={LINK}>
                wire size calculator
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3}>How many watts is {B(NINE)}?</h3>
              <p className={P} data-src={CALC}>
                {W(NINE)}, or {tons(NINE)}.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>
                How many Btu per hour is <Val v={THOUSAND_W} unit="W" src={CALC} />?
              </h3>
              <p className={P} data-src={CALC}>
                <Val v={W6(wattsToBtuPerHour(THOUSAND_W))} unit="Btu/h" src={CALC} />: divide the watts by{' '}
                <Num v={W_PER_BTU_PER_H} src={SP811} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How many watts is a ton?</h3>
              <p className={P} data-src={SP811}>
                A ton of refrigeration is <Val v={W_PER_TON_REFRIGERATION} unit="W" src={SP811} />, the same as{' '}
                <Val v={BTU_PER_H_PER_TON} unit="Btu/h" src={SP811} />. It is a rate of heat removal, not a weight.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Is a Btu the same as a Btu per hour?</h3>
              <p className={P} data-src={SP811}>
                No. A Btu is an amount of energy; a Btu per hour is a rate, like the watt. That is why Btu per hour converts to watts.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[SP811]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#conversions" className={LINK}>
                methodology page
              </Link>{' '}
              describes the source and how the values are derived.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
