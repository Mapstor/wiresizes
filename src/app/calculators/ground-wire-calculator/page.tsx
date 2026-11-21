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
import { GroundWireTool } from '@/components/calculators/GroundWireTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { EgcStepChart, ServiceGroundDiscs } from '@/components/look/Charts';
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
import { ENGINE_ID, TABLE_250_122_ROWS, TABLE_250_66_ROWS, egcFor, isEgcError } from '@/lib/calculations/grounding';
import { egcCapCases, RATING_MAX_A, RATING_MIN_A } from '@/lib/calculations/conductor-sizing';
import type { EgcResult } from '@/lib/calculations/grounding';
import { serviceLookup } from '@/lib/calculations/service-lookup';
import type { ServiceLookupResult } from '@/lib/calculations/service-lookup';
import { articleDates } from '@/lib/page-dates';
import { areaCmil } from '@/lib/verified/awg';
import type { Material, SizeKey } from '@/lib/verified/awg';

// /calculators/ground-wire-calculator (WSZ-008a; spec: research/page-specs-held.md "WSZ-008"): the two ground wires kept
// apart. The equipment grounding conductor comes from NEC Table 250.122 by the breaker or fuse rating, grown by the
// 250.122(B) area ratio when the circuit wires were upsized (verified-sd2023); the grounding electrode conductor from
// Table 250.66 by the largest service-entrance conductor (NFPA's 2020 fact sheet). The dwelling-service rows come from
// Table 310.12 (golden "service-lookup" cases), the upsized examples from golden "wire-size-60c" cases. The 250.66(A)/(B)
// electrode limits and the 250.122 cap are not verified, so the page states neither. The old page's electrode, pool
// bonding, installation and inspection lists cited no source and are gone.
const ROUTE = '/calculators/ground-wire-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Ground Wire Size Calculator: EGC and GEC';
const DESCRIPTION =
  'EGC by breaker rating (NEC Table 250.122) or GEC by service conductor (Table 250.66): 12 AWG copper for 20 A, a 4 AWG copper GEC for a 200 A service.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const GND = 'nec-250-grounding';
const OCPD = 'nec-240-ocpd';
const SVC = 'nec-310-12';
const GEO = 'awg-geometry';
const CALC = `calc:${ENGINE_ID}`;
const LOOKUP = 'calc:service-lookup';
const SIZING = 'calc:conductor-sizing';
// 250.122(A), WSZ-038: the one rating and material where Table 250.122 lists a ground wire larger than the conductor
const CAP_CASES = egcCapCases();
if (CAP_CASES.length !== 1) throw new Error(`ground wire page: expected one 250.122(A) case, got ${CAP_CASES.length}`);
const CAP = CAP_CASES[0];

function egc(ocpdA: number, material: Material, minSize?: SizeKey, installedSize?: SizeKey): EgcResult {
  const r = egcFor(ocpdA, material, minSize && installedSize ? { minSize, installedSize } : null);
  if (isEgcError(r)) throw new Error(`ground wire page: no EGC for ${ocpdA} A (${r.error})`);
  return r;
}
function service(ratingA: number): ServiceLookupResult {
  const r = serviceLookup(ratingA);
  if (!r) throw new Error(`ground wire page: no Table 310.12 row for ${ratingA} A`);
  return r;
}

// golden "table-250-122" cases: 20 A, 30 A (the 60 A row), 50 A, 200 A
const EGC_20 = egc(20, 'Cu');
const EGC_30 = egc(30, 'Cu');
const EGC_50 = egc(50, 'Cu');
const EGC_200 = egc(200, 'Cu');
// golden "wire-size-60c" cases: 20 A, 16 A load, 150 ft, 120 V, Cu (12 → 6 AWG); 60 A, 48 A load, 200 ft, 240 V, Al (3 → 2 AWG)
const UP_CU = egc(20, 'Cu', '12', '6');
const UP_AL = egc(60, 'Al', '3', '2');
if (!UP_CU.upsized || !UP_AL.upsized) throw new Error('ground wire page: the upsized examples lost their 250.122(B) step');
if (UP_CU.upsized.capped || UP_AL.upsized.capped) throw new Error('ground wire page: an upsized example is now held by 250.122(A)');
const UPC = UP_CU.upsized;
const UPA = UP_AL.upsized;
// golden "service-lookup" cases
const SERVICE_RATINGS = [100, 125, 150, 200, 225, 300, 400];
const SERVICES = SERVICE_RATINGS.map(service);
const S100 = service(100);
const S150 = service(150);
const S200 = service(200);

const TOC: ([string, string] | [string, string, string])[] = [
  ['two', 'Two ground wires, two tables'],
  ['table-250-122', 'Table 250.122: equipment grounding conductors'],
  ['upsized', 'When the circuit wires are upsized'],
  ['table-250-66', 'Table 250.66: grounding electrode conductors'],
  ['services', 'Ground wires for a home’s service'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Ground Wire Size Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Ground Wire Size Calculator', url: URL, description: DESCRIPTION };

function Cmil({ v, src }: { v: number; src: string }) {
  return (
    <span data-src={src} className="whitespace-nowrap">
      <Num v={Math.round(v)} src={src} /> cmil
    </span>
  );
}

/** "2/0 AWG copper or 4/0 AWG aluminum": a service's Table 310.12 conductors. */
function ServiceWires({ s }: { s: ServiceLookupResult }) {
  return (
    <span data-src={SVC}>
      <Size s={s.cu} /> copper or <Size s={s.alCca} /> aluminum
    </span>
  );
}

/** "4 AWG copper or 2 AWG aluminum": the Table 250.66 electrode conductor for a service's copper conductors. */
function ServiceGec({ s }: { s: ServiceLookupResult }) {
  return (
    <span data-src={GND}>
      <Size s={s.gecForCuService.cu} /> copper or <Size s={s.gecForCuService.alCca} /> aluminum
    </span>
  );
}

export default function GroundWirePage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Ground Wire Calculator" sub="EGC and GEC Sizes" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            Size the equipment grounding conductor for a breaker or fuse, or the grounding electrode conductor for a service.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <GroundWireTool capCases={CAP_CASES} />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={GND}>
            <strong>
              Which ground wire it is decides the table. NEC Table 250.122 sizes the equipment grounding conductor by the rating of the breaker or
              fuse ahead of the circuit; Table 250.66 sizes the grounding electrode conductor by the largest service-entrance conductor.
            </strong>{' '}
            <span data-src={CALC}>
              A <AmpGuideLink a={EGC_20.ocpdA} className={LINK}><Val v={EGC_20.ocpdA} unit="A" src={GND} /> circuit</AmpGuideLink> takes <Size s={EGC_20.egc ?? EGC_20.tableEgc} /> copper;
            </span>{' '}
            <span data-src={LOOKUP}>
              a <AmpGuideLink a={S200.ratingA} className={LINK}><Val v={S200.ratingA} unit="A" src={SVC} /> dwelling service</AmpGuideLink> on <Size s={S200.cu} /> copper takes a{' '}
              <Size s={S200.gecForCuService.cu} /> copper electrode conductor.
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="two" className="space-y-4">
            <h2 id="two" className={H2}>
              Two ground wires, two tables
            </h2>
            <p className={P} data-src={GND}>
              NFPA&apos;s grounding fact sheet prints both tables. <strong>Table 250.122</strong> gives the minimum equipment grounding conductor
              of a circuit or feeder from the rating of the breaker or fuse ahead of it, read in the first row whose rating the device does not
              exceed. <strong>Table 250.66</strong> gives the grounding electrode conductor of a service from the largest ungrounded
              service-entrance conductor.
            </p>
            <p className={P} data-src={GND}>
              A <Val v={S200.ratingA} unit="A" src={SVC} /> service therefore has an answer from each table, and the two differ, as the cross
              sections below show.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={GND}>
                    A <Val v={S200.ratingA} unit="A" src={SVC} /> dwelling service&apos;s <Size s={S200.cu} /> copper conductor (Table 310.12),
                    its <Size s={S200.gecForCuService.cu} /> copper electrode conductor (Table 250.66), and the{' '}
                    <Size s={EGC_200.tableEgc} /> copper equipment grounding conductor of a <Val v={EGC_200.ocpdA} unit="A" src={GND} /> feeder
                    (Table 250.122), drawn to one scale as solid conductors.
                  </span>
                  <SourceLine domains={[SVC, GND, GEO]} />
                </>
              }
            >
              <ServiceGroundDiscs />
            </Figure>
          </section>

          <section aria-labelledby="table-250-122" className="space-y-5">
            <h2 id="table-250-122" className={H2}>
              Table 250.122: equipment grounding conductors
            </h2>
            <p className={P} data-src={GND}>
              The rating is the breaker&apos;s or fuse&apos;s, not the load&apos;s, and a rating between two rows reads the higher one. A{' '}
              <AmpGuideLink a={EGC_30.ocpdA} className={LINK}><Val v={EGC_30.ocpdA} unit="A" src={GND} /> breaker</AmpGuideLink> falls in the <Val v={EGC_30.rowA} unit="A" src={GND} /> row, so its ground
              wire is <Size s={EGC_30.table.cu} /> copper, the same as a <Val v={EGC_30.rowA} unit="A" src={GND} /> breaker&apos;s; at{' '}
              <Val v={EGC_50.ocpdA} unit="A" src={GND} /> it is <Size s={EGC_50.table.cu} /> copper or <Size s={EGC_50.table.alCca} />{' '}
              aluminum.
            </p>
            <p className={P} data-src={SIZING}>
              Section 250.122(A) adds that the ground wire does not have to be larger than the circuit wires it runs with. From{' '}
              <Val v={RATING_MIN_A} unit="A" src={OCPD} /> to <Val v={RATING_MAX_A} unit="A" src={OCPD} />, that matters at one rating:
              at <Val v={CAP.ocpdA} unit="A" src={OCPD} /> the aluminum column lists <Size s={CAP.tableEgc} />, while the smallest aluminum
              wire the rating allows is <Size s={CAP.size} />, so a <Size s={CAP.size} /> ground wire is enough on{' '}
              <Size s={CAP.size} /> circuit wires. The calculator above says so, and the{' '}
              <Link href="/calculators/wire-size-calculator" className={LINK}>
                wire size calculator
              </Link>{' '}
              applies it.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={GND}>
                    The equipment grounding conductor against the breaker or fuse rating, on logarithmic scales. Each step is a row of Table
                    250.122.
                  </span>
                  <SourceLine domains={[GND, GEO]} />
                </>
              }
            >
              <EgcStepChart />
            </Figure>
            <DataTable id="table-250-122-rows" variant="ruled" src={GND} caption="NEC Table 250.122, minimum size equipment grounding conductors">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Rating, not exceeding
                  </th>
                  <th scope="col" className={RTH}>
                    Copper
                  </th>
                  <th scope="col" className={RTH}>
                    Aluminum or CCA
                  </th>
                </tr>
              </thead>
              <tbody>
                {TABLE_250_122_ROWS.map((r) => (
                  <tr key={r.rowA}>
                    <th scope="row" className={RSTICKY_TD}>
                      <Val v={r.rowA} unit="A" src={GND} />
                    </th>
                    <td className={RTD}>
                      <Size s={r.cu} />
                    </td>
                    <td className={RTD}>
                      <Size s={r.alCca} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section aria-labelledby="upsized" className="space-y-4">
            <h2 id="upsized" className={H2}>
              When the circuit wires are upsized
            </h2>
            <p className={P} data-src={GND}>
              Section 250.122(B): when the circuit wires are made larger than the rating needs, for any reason other than the ambient temperature
              and bundling corrections, the equipment grounding conductor grows in proportion to their circular mil area. Voltage drop on a long
              run is the usual reason.
            </p>
            <p className={LOOK_FORMULA} data-src={GND}>
              ground wire area = table area × installed area ÷ minimum area
            </p>
            <h3 className={H3} data-src={CALC}>
              Copper, <Val v={UP_CU.ocpdA} unit="A" src={GND} />, <Size s={UPC.minSize} /> made <Size s={UPC.installedSize} />
            </h3>
            <p className={P} data-src={CALC}>
              The table gives <Size s={UP_CU.tableEgc} /> (<Cmil v={areaCmil(UP_CU.tableEgc)} src={GEO} />). With the circuit wires at{' '}
              <Size s={UPC.installedSize} /> instead of <Size s={UPC.minSize} />:{' '}
              <Cmil v={areaCmil(UP_CU.tableEgc)} src={GEO} /> × <Cmil v={areaCmil(UPC.installedSize)} src={GEO} /> ÷{' '}
              <Cmil v={areaCmil(UPC.minSize)} src={GEO} /> = <Cmil v={UPC.requiredCmil} src={CALC} />, which is{' '}
              <Size s={UPC.egc ?? UP_CU.tableEgc} />: the ground wire grows with the circuit wires, size for size.
            </p>
            <h3 className={H3} data-src={CALC}>
              Aluminum, <Val v={UP_AL.ocpdA} unit="A" src={GND} />, <Size s={UPA.minSize} /> made <Size s={UPA.installedSize} />
            </h3>
            <p className={P} data-src={CALC}>
              <Cmil v={areaCmil(UP_AL.tableEgc)} src={GEO} /> (<Size s={UP_AL.tableEgc} />) ×{' '}
              <Cmil v={areaCmil(UPA.installedSize)} src={GEO} /> ÷ <Cmil v={areaCmil(UPA.minSize)} src={GEO} /> ={' '}
              <Cmil v={UPA.requiredCmil} src={CALC} />. No size has exactly that area, so the result rounds up to the next one,{' '}
              <Size s={UPA.egc ?? UP_AL.tableEgc} /> aluminum.
            </p>
          </section>

          <section aria-labelledby="table-250-66" className="space-y-5">
            <h2 id="table-250-66" className={H2}>
              Table 250.66: grounding electrode conductors
            </h2>
            <p className={P} data-src={GND}>
              The row is set by the largest ungrounded service-entrance conductor, or the equivalent area of a parallel set, in its own material;
              the row then gives the electrode conductor in copper and in aluminum or copper-clad aluminum. The values are those of NFPA&apos;s
              2020 grounding fact sheet. A conductor that runs only to a rod, pipe, plate or concrete-encased electrode has rules of its own,
              which this page doesn&apos;t cover.
            </p>
            <DataTable id="table-250-66-rows" variant="ruled" src={GND} caption="NEC Table 250.66, grounding electrode conductors (sizes in AWG or kcmil)">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Copper service
                  </th>
                  <th scope="col" className={RTH}>
                    Aluminum or CCA service
                  </th>
                  <th scope="col" className={RTH}>
                    Copper GEC
                  </th>
                  <th scope="col" className={RTH}>
                    Aluminum or CCA GEC
                  </th>
                </tr>
              </thead>
              <tbody>
                {TABLE_250_66_ROWS.map((r) => (
                  <tr key={r.service_cu}>
                    <th scope="row" className={RSTICKY_TD}>
                      {r.service_cu}
                    </th>
                    <td className={RTD}>{r.service_al_cca}</td>
                    <td className={RTD}>
                      <Size s={r.gec_cu} />
                    </td>
                    <td className={RTD}>
                      <Size s={r.gec_al_cca} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section aria-labelledby="services" className="space-y-5">
            <h2 id="services" className={H2}>
              Ground wires for a home&apos;s service
            </h2>
            <p className={P} data-src={LOOKUP}>
              For a 120/240 V single-phase dwelling service, Table 310.12 gives the service conductors and Table 250.66 the electrode conductor
              for them. At <Val v={S200.ratingA} unit="A" src={SVC} />, <ServiceWires s={S200} /> takes a <ServiceGec s={S200} /> electrode
              conductor; the aluminum service gives the same row. A <Val v={EGC_200.ocpdA} unit="A" src={GND} /> feeder to a subpanel is the
              other case: its ground wire comes from Table 250.122, <Size s={EGC_200.table.cu} /> copper or <Size s={EGC_200.table.alCca} />{' '}
              aluminum.
            </p>
            <DataTable id="service-ground" variant="ruled" src={LOOKUP} caption="Dwelling services: conductors (Table 310.12) and electrode conductor (Table 250.66)">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Service
                  </th>
                  <th scope="col" className={RTH}>
                    Copper
                  </th>
                  <th scope="col" className={RTH}>
                    Aluminum
                  </th>
                  <th scope="col" className={RTH}>
                    GEC, copper
                  </th>
                  <th scope="col" className={RTH}>
                    GEC, aluminum
                  </th>
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((s) => (
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
                    <td className={RTD}>
                      <Size s={s.gecForCuService.alCca} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className={P} data-src={LOOKUP}>
              In every row the copper and the aluminum service give the same electrode conductor. The{' '}
              <Link href="/calculators/service-entrance-calculator" className={LINK}>
                service entrance calculator
              </Link>{' '}
              finds both for a rating.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SVC}>
                What size ground wire for a <Val v={S200.ratingA} unit="A" src={SVC} /> service?
              </h3>
              <p className={P} data-src={LOOKUP}>
                The electrode conductor follows the service conductors: on <ServiceWires s={S200} />, Table 250.66 gives{' '}
                <ServiceGec s={S200} />. <span data-src={GND}>The equipment ground wire of a <Val v={EGC_200.ocpdA} unit="A" src={GND} />{' '}
                feeder is <Size s={EGC_200.table.cu} /> copper or <Size s={EGC_200.table.alCca} /> aluminum (Table 250.122).</span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SVC}>
                What size ground wire for a <Val v={S100.ratingA} unit="A" src={SVC} /> service?
              </h3>
              <p className={P} data-src={LOOKUP}>
                On <ServiceWires s={S100} /> service conductors, the electrode conductor is <ServiceGec s={S100} />.{' '}
                <span data-src={GND}>
                  A <AmpGuideLink a={S100.ratingA} className={LINK}><Val v={S100.ratingA} unit="A" src={SVC} /> feeder&apos;s</AmpGuideLink> equipment ground wire is <Size s={egc(100, 'Cu').tableEgc} /> copper
                  or <Size s={egc(100, 'Al').tableEgc} /> aluminum.
                </span>
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SVC}>
                What size ground wire for a <Val v={S150.ratingA} unit="A" src={SVC} /> service entrance cable?
              </h3>
              <p className={P} data-src={LOOKUP}>
                Table 310.12 gives <ServiceWires s={S150} /> for <Val v={S150.ratingA} unit="A" src={SVC} />, and for them Table 250.66 gives an
                electrode conductor of <ServiceGec s={S150} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={GND}>
                What size ground wire for a <Val v={EGC_50.ocpdA} unit="A" src={GND} /> circuit?
              </h3>
              <p className={P} data-src={GND}>
                <Size s={EGC_50.table.cu} /> copper or <Size s={EGC_50.table.alCca} /> aluminum: <Val v={EGC_50.ocpdA} unit="A" src={GND} /> falls
                in the <Val v={EGC_50.rowA} unit="A" src={GND} /> row of Table 250.122. That holds for a{' '}
                <Val v={EGC_50.ocpdA} unit="A" src={GND} /> EV charger circuit too, unless its wires were upsized.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does the ground wire have to be as big as the hot wires?</h3>
              <p className={P} data-src={GND}>
                Table 250.122 ties it to the breaker rating, not to the circuit wires: a <Val v={EGC_50.rowA} unit="A" src={GND} /> breaker&apos;s
                ground wire is <Size s={egc(60, 'Cu').tableEgc} /> copper whatever size the circuit wires are, unless they were upsized past what
                the rating needs. Then it grows in proportion to their area (250.122(B)).
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[GND, OCPD, SVC, GEO]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#grounding" className={LINK}>
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
