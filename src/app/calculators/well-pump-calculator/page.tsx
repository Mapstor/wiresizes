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
import { WellPumpTool } from '@/components/calculators/WellPumpTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { WellPumpLengthChart } from '@/components/look/Charts';
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
import { WP_CALC } from '@/lib/calculations/well-pump';
import { articleDates } from '@/lib/page-dates';
import { CHART_SIZE, COMBO, FAQ_2HP, FAQ_2HP_FT, F_15, LEAD, LEAD_FT, M_1, TABLE_ROWS, TABLE_SIZES, lengthsFor } from '@/lib/well-pump-page';
import { CABLE_RULES, CABLE_SIZES, FUSE_ROWS, MFR_WELL_PUMP_DOMAIN, MOTOR_ROWS, SOURCE, cableRow } from '@/lib/verified/mfr-well-pump';
import type { PumpHp } from '@/lib/verified/mfr-well-pump';

// /calculators/well-pump-calculator (WSZ-011c; withdrawn in WSZ-002, back as a new page; data: WSZ-034, Franklin
// Electric's AIM Manual, 2026 edition, registry domain mfr-well-pump): Franklin's 4-inch single-phase motors only.
// No NEC Article 430 rule is stated (nec-430-motors is a GAP); the page reports Franklin's own statements about the NEC.
const ROUTE = '/calculators/well-pump-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Well Pump Wire Size Calculator: Cable Length, Breaker and Amps';
const DESCRIPTION =
  "Wire size for a submersible well pump by cable length, with the breaker, fuses and motor amps, from Franklin Electric's 2026 AIM Manual tables.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const MFR = MFR_WELL_PUMP_DOMAIN;
const CALC = WP_CALC;

const TOC: ([string, string] | [string, string, string])[] = [
  ['by-length', 'Well pump wire size by length'],
  ['three-percent', 'A 3 % drop instead of 5 %', MFR],
  ['jacketed', 'Jacketed cable and shaded cells'],
  ['aluminum', 'Aluminum wire'],
  ['two-sizes', 'Two sizes in one run'],
  ['breakers', 'Breaker and fuse sizes'],
  ['amps', 'Motor amps'],
  ['not-covered', 'Three-phase and larger motors'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Well Pump Wire Size Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Well Pump Wire Size Calculator', url: URL, description: DESCRIPTION };

const AT = (size: string) => CABLE_SIZES.indexOf(size);
const LEAD_ROW = cableRow(230, '1');
if (!LEAD_ROW) throw new Error('well pump page: no 230 V 1 hp row');
const LEAD_12 = LEAD_ROW.ft[AT('12')] as number;
const LEAD_14 = LEAD_ROW.ft[AT('14')] as number;
const SHADED = TABLE_ROWS.flatMap((r) => r.shaded.map((size) => ({ hp: r.hp, size, ft: r.ft[AT(size)] as number })));
const ZERO = TABLE_ROWS.flatMap((r) => r.ft.flatMap((ft, i) => (ft === 0 ? [{ hp: r.hp, size: CABLE_SIZES[i] }] : [])));
if (SHADED.length !== 2 || ZERO.length !== 1) throw new Error('well pump page: the shaded and zero cells changed');

function Hp({ hp }: { hp: PumpHp }) {
  return (
    <span className="whitespace-nowrap" data-src={MFR}>
      {hp} hp
    </span>
  );
}
function Ft({ v, src = MFR }: { v: number; src?: string }) {
  return <Val v={v} unit="ft" src={src} format={{ upTo: 0 }} />;
}
function A({ v, fixed }: { v: number; fixed?: boolean }) {
  return <Val v={v} unit="A" src={MFR} format={fixed ? { fixed: 1 } : undefined} />;
}

function CableTable() {
  return (
    <DataTable
      id="wp-cable"
      variant="ruled"
      src={MFR}
      caption="Longest copper cable run, ft, at a 5 % drop: Franklin 4-inch single-phase motors, 75 °C cable (shaded cells marked †)"
    >
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Motor
          </th>
          {TABLE_SIZES.map((s) => (
            <th key={s} scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
              <Size s={s} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {TABLE_ROWS.map((r) => (
          <tr key={`${r.volts}-${r.hp}`}>
            <th scope="row" className={clsx(RSTICKY_TD, '!whitespace-nowrap')} data-src={MFR}>
              <Hp hp={r.hp} />, <Val v={r.volts} unit="V" src={MFR} />
            </th>
            {TABLE_SIZES.map((s) => {
              const ft = r.ft[AT(s)];
              const shaded = r.shaded.includes(s);
              return (
                <td key={s} className={clsx(RTD, shaded && 'bg-[#e8eef3]')}>
                  {ft === null ? '–' : ft === 0 ? <span data-src={MFR}>none</span> : <Ft v={ft} />}
                  {shaded ? ' †' : ''}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function BreakerTable() {
  return (
    <DataTable id="wp-breakers" variant="ruled" src={MFR} caption="Largest per the NEC / typical on submersibles, amps (Franklin AIM, 4-inch single-phase)">
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Motor
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Breaker
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Time-delay fuse
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Standard fuse
          </th>
        </tr>
      </thead>
      <tbody>
        {FUSE_ROWS.map((f) => (
          <tr key={f.model}>
            <th scope="row" className={clsx(RSTICKY_TD, '!whitespace-nowrap')} data-src={MFR}>
              <Hp hp={f.hp} />, <Val v={f.volts} unit="V" src={MFR} />, {f.wires}-wire
            </th>
            <td className={RTD}>
              <A v={f.max_nec.breaker} /> / <A v={f.typical.breaker} />
            </td>
            <td className={RTD}>
              <A v={f.max_nec.dual_element_fuse} /> / <A v={f.typical.dual_element_fuse} />
            </td>
            <td className={RTD}>
              <A v={f.max_nec.fuse} /> / <A v={f.typical.fuse} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function AmpsTable() {
  return (
    <DataTable id="wp-amps" variant="ruled" src={MFR} caption="Line amps of Franklin's standard 4-inch single-phase motors">
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Motor
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Full load
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Maximum load
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            Service factor
          </th>
        </tr>
      </thead>
      <tbody>
        {MOTOR_ROWS.map((m) => (
          <tr key={m.model}>
            <th scope="row" className={clsx(RSTICKY_TD, '!whitespace-nowrap')} data-src={MFR}>
              <Hp hp={m.hp} />, <Val v={m.volts} unit="V" src={MFR} />, {m.wires}-wire
            </th>
            <td className={RTD}>
              <A v={m.fl_amps} fixed />
            </td>
            <td className={RTD}>
              <A v={m.max_amps} fixed />
            </td>
            <td className={RTD} data-src={MFR}>
              {m.sf}
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function LengthList({ hp }: { hp: PumpHp }) {
  const rows = lengthsFor(hp);
  return (
    <>
      {rows.map((r, k) => (
        <span key={r.size}>
          {k > 0 ? (k === rows.length - 1 ? ' and ' : ', ') : ''}
          <Size s={r.size} /> to {r.ft ? <Ft v={r.ft} /> : '–'}
        </span>
      ))}
    </>
  );
}

export default function WellPumpCalculatorPage() {
  const threeFt = LEAD_12 * CABLE_RULES.threePctFactor;
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Well Pump Wire Size Calculator" sub="Cable Length, Breaker and Amps" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')} data-src={MFR}>
            The copper or aluminum cable for a submersible pump at your run, with its breaker, fuses and amps, from Franklin Electric&apos;s 2026
            tables for its 4-inch single-phase motors.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <WellPumpTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={MFR}>
            <strong>
              A <Hp hp="1" />, <Val v={230} unit="V" src={MFR} /> pump <Ft v={LEAD_FT} src="input" /> from the panel takes <Size s={LEAD.copper} />{' '}
              copper: Franklin&apos;s table allows <Ft v={LEAD_12} /> on it at a <Val v={CABLE_RULES.dropPct} unit="%" src={MFR} /> voltage drop, and{' '}
              <Size s="14" /> stops at <Ft v={LEAD_14} />.
            </strong>{' '}
            Its breaker is <A v={LEAD.fuses.max_nec.breaker} /> at most, per the NEC as Franklin lists it.
          </p>
          <p className={P} data-src={MFR}>
            The length is the whole cable, from the service entrance to the motor down the well. Franklin figures each length at the
            motor&apos;s maximum nameplate amps.
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="by-length" className="space-y-5">
            <h2 id="by-length" className={H2}>
              Well pump wire size by length
            </h2>
            <p className={P} data-src={MFR}>
              Franklin Electric&apos;s AIM Manual lists, for each motor, the longest copper cable at a{' '}
              <Val v={CABLE_RULES.dropPct} unit="%" src={MFR} /> voltage drop. The single-phase table covers its 4-inch motors, 2-wire and 3-wire
              alike. Cells marked † are shaded in Franklin&apos;s table (see below), and &ldquo;none&rdquo; means the size cannot be used.
            </p>
            <CableTable />
            <Figure
              caption={
                <>
                  <span data-src={MFR}>
                    The longest run on <Size s={CHART_SIZE} /> copper for each <Val v={230} unit="V" src={MFR} /> motor, at a{' '}
                    <Val v={CABLE_RULES.dropPct} unit="%" src={MFR} /> drop.
                  </span>
                  <SourceLine domains={[MFR]} />
                </>
              }
            >
              <WellPumpLengthChart />
            </Figure>
          </section>

          <section aria-labelledby="three-percent" className="space-y-5">
            <h2 id="three-percent" className={H2} data-src={MFR}>
              A 3 % drop instead of 5 %
            </h2>
            <p className={P} data-src={MFR}>
              For a <Val v={3} unit="%" src={MFR} /> drop, Franklin multiplies its lengths by {CABLE_RULES.threePctFactor}: a <Hp hp="1" />,{' '}
              <Val v={230} unit="V" src={MFR} /> motor on <Size s="12" /> goes from <Ft v={LEAD_12} /> to <Ft v={threeFt} src={CALC} />. The
              calculator&apos;s drop setting does the same.
            </p>
          </section>

          <section aria-labelledby="jacketed" className="space-y-5">
            <h2 id="jacketed" className={H2}>
              Jacketed cable and shaded cells
            </h2>
            <p className={P} data-src={MFR}>
              Franklin&apos;s unshaded cells meet the NEC ampacity requirements for single conductors or for jacketed{' '}
              <Val v={75} unit="°C" src={MFR} /> cable, in conduit or buried directly; flat molded and web (ribbon) cable count as jacketed. The
              shaded cells meet them only as single conductors. In the single-phase table two cells are shaded:{' '}
              {SHADED.map((c, k) => (
                <span key={c.hp}>
                  {k > 0 ? ' and ' : ''}
                  <Hp hp={c.hp} /> on <Size s={c.size} /> (<Ft v={c.ft} />)
                </span>
              ))}
              . With jacketed cable the calculator skips them and moves to the next size. A <Hp hp={ZERO[0].hp} /> motor cannot use{' '}
              <Size s={ZERO[0].size} /> at all.
            </p>
          </section>

          <section aria-labelledby="aluminum" className="space-y-5">
            <h2 id="aluminum" className={H2}>
              Aluminum wire
            </h2>
            <p className={P} data-src={MFR}>
              The lengths are for copper. Franklin asks for aluminum two sizes larger than the copper the table calls for, with an oxidation
              inhibitor on the connections: <Size s={CABLE_RULES.aluminumExample.copper} /> copper becomes{' '}
              <Size s={CABLE_RULES.aluminumExample.aluminum} /> aluminum.
            </p>
          </section>

          <section aria-labelledby="two-sizes" className="space-y-5">
            <h2 id="two-sizes" className={H2}>
              Two sizes in one run
            </h2>
            <p className={P} data-src={MFR}>
              An old buried cable and a new drop cable can share one run. Franklin divides each part&apos;s length by that size&apos;s maximum and
              adds the shares; the total must stay at or under one. Its own example is a <Hp hp="3" />, <Val v={230} unit="V" src={MFR} /> motor
              with <Ft v={COMBO.first.ft} /> of <Size s={COMBO.first.size} /> already buried (maximum <Ft v={COMBO.first.max} />, a share of{' '}
              <Val v={COMBO.shareFirst * 100} unit="%" src={CALC} format={{ fixed: 1 }} />) and <Ft v={COMBO.tryA.ft} /> down the well.{' '}
              <Size s={COMBO.tryA.size} /> there adds <Val v={COMBO.shareA * 100} unit="%" src={CALC} format={{ fixed: 1 }} />, which makes{' '}
              <Val v={COMBO.sumA * 100} unit="%" src={CALC} format={{ fixed: 1 }} />, too much; <Size s={COMBO.tryB.size} /> adds{' '}
              <Val v={COMBO.shareB * 100} unit="%" src={CALC} format={{ fixed: 1 }} />, for{' '}
              <Val v={COMBO.sumB * 100} unit="%" src={CALC} format={{ fixed: 1 }} />. The calculator&apos;s steps give the share of one size.
            </p>
          </section>

          <section aria-labelledby="breakers" className="space-y-5">
            <h2 id="breakers" className={H2}>
              Breaker and fuse sizes
            </h2>
            <p className={P} data-src={MFR}>
              Franklin lists the largest breaker and fuses the NEC allows for each motor, and the sizes typical on submersible pumps. Either size
              protects the circuit; never go above the NEC value. The sizes are the same for Franklin&apos;s standard, &ldquo;G&rdquo; and 700
              series motors.
            </p>
            <BreakerTable />
          </section>

          <section aria-labelledby="amps" className="space-y-5">
            <h2 id="amps" className={H2}>
              Motor amps
            </h2>
            <p className={P} data-src={MFR}>
              Line amps at full load and at the motor&apos;s maximum service factor load, the current the cable table is figured at. These are
              Franklin&apos;s standard motors without the &ldquo;G&rdquo; suffix; the motor&apos;s own nameplate decides.
            </p>
            <AmpsTable />
          </section>

          <section aria-labelledby="not-covered" className="space-y-5">
            <h2 id="not-covered" className={H2}>
              Three-phase and larger motors
            </h2>
            <p className={P} data-src={MFR}>
              The calculator covers Franklin&apos;s 4-inch single-phase motors. The{' '}
              <a href={SOURCE.landing} className={LINK}>
                AIM Manual
              </a>{' '}
              also has tables for 4-inch three-phase motors and for 6-inch and 8-inch motors, and other pump makers publish their own.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR}>
                What size wire for a <Hp hp="1" /> well pump?
              </h3>
              <p className={P} data-src={MFR}>
                It depends on the length. At <Val v={230} unit="V" src={MFR} />, Franklin allows <LengthList hp="1" /> at a{' '}
                <Val v={CABLE_RULES.dropPct} unit="%" src={MFR} /> drop.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR}>
                What size wire for a <Hp hp="1.5" /> well pump?
              </h3>
              <p className={P} data-src={MFR}>
                At <Val v={230} unit="V" src={MFR} />: <LengthList hp="1.5" /> at a <Val v={CABLE_RULES.dropPct} unit="%" src={MFR} /> drop.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR}>
                What size breaker for a <Hp hp="1.5" /> well pump?
              </h3>
              <p className={P} data-src={MFR}>
                <A v={F_15.max_nec.breaker} /> at most for Franklin&apos;s <Val v={230} unit="V" src={MFR} /> motors, the NEC limit as Franklin lists
                it, and <A v={F_15.typical.breaker} /> is also the typical size.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR}>
                How many amps does a <Hp hp="1" /> well pump draw?
              </h3>
              <p className={P} data-src={MFR}>
                Franklin&apos;s <Val v={230} unit="V" src={MFR} /> motor draws <A v={M_1.fl_amps} fixed /> at full load and up to{' '}
                <A v={M_1.max_amps} fixed /> at its maximum service factor load.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={MFR}>
                What wire for a <Hp hp="2" /> well pump <Ft v={FAQ_2HP_FT} src="input" /> away?
              </h3>
              <p className={P} data-src={MFR}>
                <Size s={FAQ_2HP.copper} /> copper: Franklin allows <Ft v={FAQ_2HP.copperMaxFt} /> on it at{' '}
                <Val v={230} unit="V" src={MFR} />.{' '}
                {FAQ_2HP.smaller ? (
                  <>
                    <Size s={FAQ_2HP.smaller.size} /> stops at <Ft v={FAQ_2HP.smaller.maxFt} />.
                  </>
                ) : null}
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Can a well pump use aluminum wire?</h3>
              <p className={P} data-src={MFR}>
                Yes, two sizes larger than the copper size, with an oxidation inhibitor on the connections (Franklin):{' '}
                <Size s={CABLE_RULES.aluminumExample.copper} /> copper becomes <Size s={CABLE_RULES.aluminumExample.aluminum} /> aluminum.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[MFR]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The values are Franklin Electric&apos;s, for its own motors; check your motor&apos;s nameplate and its maker&apos;s current manual. The{' '}
              <Link href="/methodology#well-pump-method" className={LINK}>
                methodology page
              </Link>{' '}
              describes how the calculator works and its source.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
