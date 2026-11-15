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
import { ServiceEntranceTool } from '@/components/calculators/ServiceEntranceTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { SERVICE_DROP, ServiceDropChart, ServiceStepChart } from '@/components/look/Charts';
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
import { egcFor, isEgcError } from '@/lib/calculations/grounding';
import type { EgcResult } from '@/lib/calculations/grounding';
import { ENGINE_ID, SERVICE_RATINGS, SERVICE_VOLTS, isServiceError, serviceEntrance, serviceLookup } from '@/lib/calculations/service-lookup';
import type { ServiceLookupResult, ServiceResult } from '@/lib/calculations/service-lookup';
import { RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { articleDates } from '@/lib/page-dates';
import { SERVICE_AMPACITY_PERCENT } from '@/lib/verified/nec-310-12';
import type { Material } from '@/lib/verified/awg';

// /calculators/service-entrance-calculator (WSZ-008b; spec: research/page-specs-held.md "WSZ-008"; data gate BUILD): the
// WSZ-002 lookup in the look, with the voltage drop the WSZ-008 prompt adds. A 120/240 V dwelling service rating gives
// the conductors (NEC Table 310.12, 83 % rule of 310.12(A)) and the electrode conductor (Table 250.66, NFPA's 2020 fact
// sheet); a length and a load add the drop at 75 °C (voltage drop engine, conductor-resistance-20c). The rows are golden
// "service-lookup" cases; the drop of 4/0 AWG aluminum at 200 A over 100 ft is a golden "voltage-drop" case. The 230.79
// minimum ratings and 230.24 clearances wait on nec-misc-installation (candidate), so the page states neither, and the
// load calculation waits on its own page (WSZ-010).
const ROUTE = '/calculators/service-entrance-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Service Entrance Calculator: Wire Size by Amps';
const DESCRIPTION =
  'Service entrance wire by rating (NEC Table 310.12), with the grounding electrode conductor and voltage drop: 200 A takes 2/0 AWG copper or 4/0 AWG aluminum.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const SVC = 'nec-310-12';
const GND = 'nec-250-grounding';
const RES = 'conductor-resistance-20c';
const GEO = 'awg-geometry';
const CALC = `calc:${ENGINE_ID}`;
const VD = 'calc:voltage-drop';

function lookup(ratingA: number): ServiceLookupResult {
  const r = serviceLookup(ratingA);
  if (!r) throw new Error(`service entrance page: no Table 310.12 row for ${ratingA} A`);
  return r;
}
function withRun(ratingA: number, material: Material, lengthFt: number): ServiceResult {
  const r = serviceEntrance(ratingA, material, { lengthFt, amps: ratingA });
  if (isServiceError(r) || !r.drop) throw new Error(`service entrance page: no drop for ${ratingA} A over ${lengthFt} ft`);
  return r;
}

const ROWS = SERVICE_RATINGS.map(lookup);
const S100 = lookup(100);
const S150 = lookup(150);
const S200 = lookup(200);
const S400 = lookup(400);
const MIN_200 = (S200.ratingA * SERVICE_AMPACITY_PERCENT) / 100;
// golden "voltage-drop" case: 4/0 AWG Al, 200 A, 100 ft one way, 240 V; the 175 ft run is a searched one
const CU_100 = withRun(200, 'Cu', 100);
const AL_100 = withRun(200, 'Al', 100);
const CU_175 = withRun(200, 'Cu', 175);
const AL_175 = withRun(200, 'Al', 175);
if (SERVICE_DROP.ratingA !== S200.ratingA) throw new Error('service entrance page: the drop chart is not the 200 A service');
// the feeder question: Table 250.122 for a 150 A overcurrent device (golden "egc" rows)
function egc(ocpdA: number): EgcResult {
  const r = egcFor(ocpdA, 'Cu');
  if (isEgcError(r)) throw new Error(`service entrance page: no Table 250.122 row for ${ocpdA} A`);
  return r;
}
const EGC_150 = egc(150);

const TOC: ([string, string] | [string, string, string])[] = [
  ['table-310-12', 'Table 310.12, with electrode conductors'],
  ['eighty-three', '83 % of the rating', SVC],
  ['voltage-drop', 'Voltage drop on a long run'],
  ['scope', 'Which services the table covers'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Service Entrance Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Service Entrance Calculator', url: URL, description: DESCRIPTION };

function Wires({ s }: { s: ServiceLookupResult }) {
  return (
    <span data-src={SVC}>
      <Size s={s.cu} /> copper or <Size s={s.alCca} /> aluminum
    </span>
  );
}
function Gec({ s }: { s: ServiceLookupResult }) {
  return (
    <span data-src={GND}>
      <Size s={s.gecForCuService.cu} /> copper or <Size s={s.gecForCuService.alCca} /> aluminum
    </span>
  );
}
function Pct({ r }: { r: ServiceResult }) {
  return <Val v={r.drop?.result.vdPct ?? 0} unit="%" src={VD} format={{ fixed: 2 }} />;
}
function Volts({ r }: { r: ServiceResult }) {
  return <Val v={r.drop?.result.vdVolts ?? 0} unit="V" src={VD} format={{ fixed: 2 }} />;
}

export default function ServiceEntrancePage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Service Entrance Calculator" sub="Wire Size by Amps" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')} data-src={SVC}>
            The service conductors and grounding electrode conductor for a 120/240 V dwelling service, and their voltage drop.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <ServiceEntranceTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={CALC}>
            <strong>
              For a 120/240 V dwelling service, NEC Table 310.12 lists the service conductors by rating, and Table 250.66 gives the electrode
              conductor for them.
            </strong>{' '}
            <Val v={S200.ratingA} unit="A" src={SVC} /> takes <Wires s={S200} />, with a <Gec s={S200} /> electrode conductor.
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="table-310-12" className="space-y-5">
            <h2 id="table-310-12" className={H2}>
              Table 310.12, with electrode conductors
            </h2>
            <p className={P} data-src={CALC}>
              Each rating from <Val v={ROWS[0].ratingA} unit="A" src={SVC} /> to <Val v={ROWS[ROWS.length - 1].ratingA} unit="A" src={SVC} /> has
              one copper and one aluminum size, and Table 250.66 turns either into the same electrode conductor. The electrode conductor values
              are those of NFPA&apos;s 2020 grounding fact sheet.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={SVC}>
                    Service conductor size against the service rating, the size on a logarithmic scale of area. Each step is a row of Table 310.12.
                  </span>
                  <SourceLine domains={[SVC, GEO]} />
                </>
              }
            >
              <ServiceStepChart />
            </Figure>
            <DataTable id="service-rows" variant="ruled" src={CALC} caption="NEC Table 310.12 conductors and their Table 250.66 electrode conductor">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Rating
                  </th>
                  <th scope="col" className={RTH}>
                    Copper
                  </th>
                  <th scope="col" className={RTH}>
                    Aluminum
                  </th>
                  <th scope="col" className={RTH}>
                    GEC, Cu
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((s) => (
                  <tr key={s.ratingA}>
                    <th scope="row" className={RSTICKY_TD}>
                      <Val v={s.ratingA} unit="A" src={SVC} />
                    </th>
                    <td className={RTD}>
                      <Size s={s.cu} />
                    </td>
                    <td className={RTD}>
                      <Size s={s.alCca} />
                    </td>
                    <td className={RTD}>
                      <Size s={s.gecForCuService.cu} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className={P} data-src={GND}>
              The table gives the copper electrode conductor. An aluminum or copper-clad aluminum one is larger in every row of Table 250.66:{' '}
              <Size s={S200.gecForCuService.alCca} /> for a <Val v={S200.ratingA} unit="A" src={SVC} /> service, against{' '}
              <Size s={S200.gecForCuService.cu} /> copper. The{' '}
              <Link href="/calculators/ground-wire-calculator" className={LINK}>
                ground wire calculator
              </Link>{' '}
              shows both.
            </p>
          </section>

          <section aria-labelledby="eighty-three" className="space-y-4">
            <h2 id="eighty-three" className={H2} data-src={SVC}>
              83 % of the rating
            </h2>
            <p className={P} data-src={SVC}>
              Section 310.12 lets the conductors of a dwelling service, and of a feeder that carries the dwelling&apos;s entire load, have an
              ampacity of not less than{' '}
              <Num v={SERVICE_AMPACITY_PERCENT} src={SVC} /> % of the rating. For{' '}
              <Val v={S200.ratingA} unit="A" src={SVC} /> that is <Val v={MIN_200} unit="A" src={CALC} />. The{' '}
              <Link href="/guides/wire-size-for-200-amp" className={LINK}>
                200 A guide
              </Link>{' '}
              sets Table 310.12 beside Table 310.16, which sizes every other feeder.
            </p>
          </section>

          <section aria-labelledby="voltage-drop" className="space-y-5">
            <h2 id="voltage-drop" className={H2}>
              Voltage drop on a long run
            </h2>
            <p className={P} data-src={VD}>
              The table sizes a service for its current, not for its length. At full load, <Val v={S200.ratingA} unit="A" src={SVC} /> over{' '}
              <Val v={CU_100.drop?.lengthFt ?? 0} unit="ft" src={VD} /> of <Size s={S200.cu} /> copper drops <Volts r={CU_100} />, <Pct r={CU_100} /> of{' '}
              <Val v={SERVICE_VOLTS} unit="V" src={SVC} />; <Size s={S200.alCca} /> aluminum drops <Volts r={AL_100} />, <Pct r={AL_100} />. The two
              sizes have nearly the same resistance, so the two lines nearly overlap. The calculator takes the resistance at{' '}
              <Val v={RESISTANCE_TEMP_C} unit="°C" src={RES} />, worked out from the values of NIST&apos;s copper and aluminum wire tables.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={VD}>
                    Voltage drop of a <Val v={S200.ratingA} unit="A" src={SVC} /> dwelling service at full load, single-phase at{' '}
                    <Val v={SERVICE_VOLTS} unit="V" src={SVC} />, against the one-way length of its Table 310.12 conductors.
                  </span>
                  <SourceLine domains={[SVC, RES]} />
                </>
              }
            >
              <ServiceDropChart />
            </Figure>
            <p className={P} data-src={VD}>
              Enter a load current in the calculator for the drop at less than the full rating. The{' '}
              <Link href="/calculators/voltage-drop-calculator" className={LINK}>
                voltage drop calculator
              </Link>{' '}
              finds the size that keeps a run under a target.
            </p>
          </section>

          <section aria-labelledby="scope" className="space-y-4">
            <h2 id="scope" className={H2}>
              Which services the table covers
            </h2>
            <p className={P} data-src={SVC}>
              Table 310.12 is for a 120/240 V single-phase service, or a feeder, that carries the entire load of a one-family dwelling or of one
              dwelling unit in a two-family or multifamily building, from <Val v={ROWS[0].ratingA} unit="A" src={SVC} /> to{' '}
              <Val v={ROWS[ROWS.length - 1].ratingA} unit="A" src={SVC} />. A feeder that carries part of the load, such as one to a garage
              subpanel, and every other service are sized from Table 310.16, which the{' '}
              <Link href="/calculators/wire-size-calculator" className={LINK}>
                wire size calculator
              </Link>{' '}
              uses.
            </p>
            <p className={P} data-src={SVC}>
              The table also assumes no corrections. Where the ambient temperature is above <Val v={30} unit="°C" src={SVC} />, or more than
              three current-carrying conductors share a raceway or cable, the factors of Tables 310.15(B)(1)(1) and 310.15(C)(1) apply, and the
              corrected ampacity must still reach <Val v={SERVICE_AMPACITY_PERCENT} unit="%" src={SVC} /> of the rating.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SVC}>
                What size wire for a <Val v={S200.ratingA} unit="A" src={SVC} /> service entrance?
              </h3>
              <p className={P} data-src={CALC}>
                <Wires s={S200} /> from Table 310.12, with a <Gec s={S200} /> electrode conductor from Table 250.66.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SVC}>
                What size wire for a <Val v={S100.ratingA} unit="A" src={SVC} /> service?
              </h3>
              <p className={P} data-src={CALC}>
                <Wires s={S100} />. The electrode conductor is <Gec s={S100} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SVC}>
                What size wire for a <Val v={S400.ratingA} unit="A" src={SVC} /> service?
              </h3>
              <p className={P} data-src={CALC}>
                <Wires s={S400} />, the largest row of Table 310.12, with an electrode conductor of <Gec s={S400} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={VD}>
                How much voltage drop on <Val v={CU_175.drop?.lengthFt ?? 0} unit="ft" src={VD} /> of entrance cable for a{' '}
                <Val v={S200.ratingA} unit="A" src={SVC} /> service?
              </h3>
              <p className={P} data-src={VD}>
                At the full <Val v={S200.ratingA} unit="A" src={SVC} />: <Volts r={CU_175} /> (<Pct r={CU_175} />) on <Size s={S200.cu} /> copper and{' '}
                <Volts r={AL_175} /> (<Pct r={AL_175} />) on <Size s={S200.alCca} /> aluminum. A smaller load drops less in proportion.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SVC}>
                What size ground wire for a <Val v={S150.ratingA} unit="A" src={SVC} /> service entrance cable?
              </h3>
              <p className={P} data-src={CALC}>
                Two wires go by that name. The grounding electrode conductor runs from the service to the ground rod or other electrode: Table
                250.66 gives <Gec s={S150} /> for service conductors of <Wires s={S150} />. A feeder from the service to another panel carries an
                equipment grounding conductor instead, from Table 250.122:{' '}
                <span data-src={GND}>
                  <Size s={EGC_150.table.cu} /> copper or <Size s={EGC_150.table.alCca} /> aluminum
                </span>{' '}
                for a <Val v={EGC_150.ocpdA} unit="A" src={GND} /> overcurrent device.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[SVC, GND, RES, GEO]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#service-conductors" className={LINK}>
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
