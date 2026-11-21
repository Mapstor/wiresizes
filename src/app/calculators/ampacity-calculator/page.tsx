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
import { AmpacityTool } from '@/components/calculators/AmpacityTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { AmpacityStepsChart } from '@/components/look/Charts';
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
import { ENGINE_ID, ampacityRun, isAmpacityError } from '@/lib/calculations/ampacity';
import type { AmpacityRun } from '@/lib/calculations/ampacity';
import { articleDates } from '@/lib/page-dates';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { max240_4D } from '@/lib/verified/nec-240-4-d';
import { AMBIENT_ROWS } from '@/lib/verified/nec-310-15-B-1-1';
import { AMPACITY_COLUMNS, COLUMN_TYPES, TABLE_310_16_ROWS, TABLE_AMBIENT } from '@/lib/verified/nec-310-16';
import type { AmpacityColumn } from '@/lib/verified/nec-310-16';
import type { Material, SizeKey } from '@/lib/verified/awg';

// /calculators/ampacity-calculator (WSZ-009a; spec: research/page-specs-held.md "WSZ-009"; data gate BUILD): a
// conductor's NEC Table 310.16 value corrected for heat (Table 310.15(B)(1)(1)) and bundling (Table 310.15(C)(1)), then
// shown against the termination columns of 110.14(C) and the 240.4(D) limit. Examples are golden "ampacity-arithmetic"
// cases (6 AWG copper at 90 °C, 41–45 °C, 4–6 conductors: 52.2 A; 3/0 AWG copper at 75 °C, 31–35 °C: 188 A). The rooftop
// adder of 310.15(B)(2) and the counting rules of 310.15(E)/(F) are not covered (registry nec-misc-installation and
// nec-cable-rules); NM and UF cable stay at 60 °C (engine rule nm-cable).
const ROUTE = '/calculators/ampacity-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Ampacity Calculator: NEC Table 310.16 With Corrections';
const DESCRIPTION =
  'Wire ampacity from NEC Table 310.16, corrected for heat and bundling, then capped by the terminals (110.14(C)) and 240.4(D). Copper and aluminum.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const AMP = 'nec-310-16';
const COR = 'nec-310-15-corrections';
const TERM = 'nec-110-14c';
const SMALL = 'nec-240-4-d';
const CALC = `calc:${ENGINE_ID}`;
const COLUMNS: AmpacityColumn[] = AMPACITY_COLUMNS;
const [C60, C75, C90] = COLUMNS;

function run(size: SizeKey, material: Material, column: AmpacityColumn, temp: number, count: number): AmpacityRun {
  const r = ampacityRun({ size, material, method: 'conductors', column, temp, unit: 'C', count });
  if (isAmpacityError(r) || r.result.ampacity === null) throw new Error(`ampacity page: no run for ${size} ${material}`);
  return r;
}
function cap(r: AmpacityRun, column: number): number {
  const c = r.caps.find((x) => x.column === column);
  if (!c || c.usableA === null || c.tableA === null) throw new Error(`ampacity page: no ${column} °C cap`);
  return c.usableA;
}
function limit(size: SizeKey, material: Material): number {
  const row = max240_4D(size, material);
  if (!row || row.conditions !== null) throw new Error(`ampacity page: no plain 240.4(D) row for ${size} ${material}`);
  return row.max_ocpd_a;
}

// golden "ampacity-arithmetic": 6 AWG cu_90 at 41–45 °C with 4–6 current-carrying conductors, and 3/0 AWG cu_75 at 31–35 °C
const HOT = run('6', 'Cu', 90, 45, 6);
const WARM = run('3/0', 'Cu', 75, 35, 3);
// 12 AWG copper at 90 °C in the 30 °C the table assumes: the terminals, not the heat, set its usable ampacity
const TWELVE = run('12', 'Cu', 90, 30, 3);
const COLD_COLUMN = TERMINATION_RULES.columnAtOrBelowLimit;
const WARM_COLUMN = TERMINATION_RULES.columnAboveLimit;

const COMMON_CU: SizeKey[] = ['14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0'];
const COMMON_AL: SizeKey[] = ['12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0'];
const ROW = new Map(TABLE_310_16_ROWS.map((r) => [r.size, r]));
function ampacity(size: SizeKey, material: Material, column: AmpacityColumn): number {
  const r = ROW.get(size);
  const v = r ? r[`${material === 'Cu' ? 'cu' : 'al'}_${column}`] : null;
  if (v === null || v === undefined) throw new Error(`ampacity page: no ${size} ${material} at ${column} °C`);
  return v;
}
const SMALL_ROWS: { size: SizeKey; material: Material }[] = [
  { size: '14', material: 'Cu' },
  { size: '12', material: 'Cu' },
  { size: '10', material: 'Cu' },
  { size: '12', material: 'Al' },
  { size: '10', material: 'Al' },
];
const THHN_90 = COLUMN_TYPES[C90].includes('THHN');
if (max240_4D('8', 'Cu') !== null) throw new Error('ampacity page: 240.4(D) now lists 8 AWG copper');
if (HOT.caps.some((c) => c.capped)) throw new Error('ampacity page: the hot example is now capped by its terminals');
if (WARM.caps.find((c) => c.column === WARM_COLUMN)?.capped !== false) throw new Error('ampacity page: the warm example is capped at 75 °C');
/** The lowest temperature of the row whose factors are 1.00: below it, the factors are above 1. */
const UNITY_FROM = (() => {
  const row = AMBIENT_ROWS.find((r) => r.f_60 === 1 && r.f_75 === 1 && r.f_90 === 1);
  const m = row ? /^(\d+)–/.exec(row.key) : null;
  if (!m) throw new Error('ampacity page: no row of factors 1.00');
  return Number(m[1]);
})();
if (!THHN_90) throw new Error('ampacity page: Table 310.16 no longer lists THHN at 90 °C');

const TOC: ([string, string] | [string, string, string])[] = [
  ['common-sizes', 'Ampacity of common sizes'],
  ['example', 'Heat, bundling and the terminals'],
  ['terminals', 'Why the terminals cap it'],
  ['small-conductors', 'Small conductors: 240.4(D)'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Ampacity Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Ampacity Calculator', url: URL, description: DESCRIPTION };

function SizesTable({ material }: { material: Material }) {
  const sizes = material === 'Cu' ? COMMON_CU : COMMON_AL;
  const name = material === 'Cu' ? 'Copper' : 'Aluminum or copper-clad aluminum';
  return (
    <DataTable id={`common-${material.toLowerCase()}`} variant="ruled" src={AMP} caption={`${name}, NEC Table 310.16, amperes`}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Size
          </th>
          {COLUMNS.map((c) => (
            <th key={c} scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
              <Val v={c} unit="°C" src={AMP} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sizes.map((s) => (
          <tr key={s}>
            <th scope="row" className={RSTICKY_TD}>
              <Size s={s} />
            </th>
            {COLUMNS.map((c) => (
              <td key={c} className={RTD}>
                <Num v={ampacity(s, material, c)} src={AMP} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function AmpacityCalculatorPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Ampacity Calculator" sub="NEC Table 310.16 With Corrections" joiner=": " src={AMP} />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            A conductor&apos;s ampacity from its size, material and insulation, corrected for heat and bundling, then held to the terminals.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <AmpacityTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={AMP}>
            <strong>
              NEC Table 310.16 lists the ampacity of each size in three insulation columns, for not more than three current-carrying conductors at{' '}
              <Val v={TABLE_AMBIENT.c} unit="°C" src={AMP} />.
            </strong>{' '}
            <span data-src={CALC}>
              Heat and bundling lower it, and the terminals cap it: <Size s="12" /> copper is listed at{' '}
              <Val v={ampacity('12', 'Cu', C90)} unit="A" src={AMP} /> at <Val v={C90} unit="°C" src={AMP} />, but with{' '}
              <Val v={COLD_COLUMN} unit="°C" src={TERM} /> terminals it may carry <Val v={cap(TWELVE, COLD_COLUMN)} unit="A" src={CALC} />.
            </span>
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="common-sizes" className="space-y-5">
            <h2 id="common-sizes" className={H2}>
              Ampacity of common sizes
            </h2>
            <p className={P} data-src={AMP}>
              The values of Table 310.16 for building wire from <Size s="14" /> to <Size s="4/0" />. THHN, for one, is among the types the table
              lists at <Val v={C90} unit="°C" src={AMP} />. The{' '}
              <Link href="/guides/nec-table-310-16" className={LINK}>
                Table 310.16 guide
              </Link>{' '}
              has every size to <Size s="2000" />, with both correction tables.
            </p>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              <SizesTable material="Cu" />
              <SizesTable material="Al" />
            </div>
          </section>

          <section aria-labelledby="example" className="space-y-5">
            <h2 id="example" className={H2}>
              Heat, bundling and the terminals
            </h2>
            <p className={P} data-src={CALC}>
              <Size s={HOT.size} /> copper at <Val v={HOT.column} unit="°C" src={AMP} /> starts at{' '}
              <Val v={HOT.result.tableAmpacity ?? 0} unit="A" src={AMP} />. At <Val v={HOT.temp} unit="°C" src="input" /> the factor is{' '}
              <Num v={HOT.result.correctionFactor ?? 0} src={COR} format={{ fixed: 2 }} />, and with <Num v={HOT.count} src="input" /> current-carrying
              conductors in the raceway the adjustment is <Val v={HOT.result.adjustmentPercent} unit="%" src={COR} />: the corrected ampacity is{' '}
              <Val v={HOT.result.ampacity ?? 0} unit="A" src={CALC} format={{ upTo: 2 }} />. That is below both termination limits, so it stands.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    <Size s={HOT.size} /> copper at <Val v={HOT.column} unit="°C" src={AMP} />, <Val v={HOT.temp} unit="°C" src="input" /> ambient
                    and <Num v={HOT.count} src="input" /> current-carrying conductors: the Table 310.16 value, after the ambient factor and after the
                    adjustment, with the size&apos;s <Val v={COLD_COLUMN} unit="°C" src={TERM} /> and <Val v={WARM_COLUMN} unit="°C" src={TERM} />{' '}
                    values as the terminal limits.
                  </span>
                  <SourceLine domains={[AMP, COR, TERM]} />
                </>
              }
            >
              <AmpacityStepsChart run={HOT} id="ampacity-hot" />
            </Figure>
            <p className={P} data-src={CALC}>
              Heat alone: <Size s={WARM.size} /> copper at <Val v={WARM.column} unit="°C" src={AMP} />, <Val v={WARM.result.tableAmpacity ?? 0} unit="A" src={AMP} /> in
              the table, carries <Val v={WARM.result.ampacity ?? 0} unit="A" src={CALC} format={{ upTo: 2 }} /> at <Val v={WARM.temp} unit="°C" src="input" />{' '}
              (factor <Num v={WARM.result.correctionFactor ?? 0} src={COR} format={{ fixed: 2 }} />). On a circuit rated over{' '}
              <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} />, its terminals default to <Val v={WARM_COLUMN} unit="°C" src={TERM} />, so that stands.
            </p>
          </section>

          <section aria-labelledby="terminals" className="space-y-4">
            <h2 id="terminals" className={H2}>
              Why the terminals cap it
            </h2>
            <p className={P} data-src={TERM}>
              Under 110.14(C), the temperature column used may not exceed the rating of any connected termination, conductor or device. Equipment
              for circuits rated <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} /> or less, or with terminals marked for <Size s="14" /> through{' '}
              <Size s="1" />, is used at the <Val v={COLD_COLUMN} unit="°C" src={TERM} /> ampacity unless it is listed and identified for higher-rated
              conductors; above <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} />, at the <Val v={WARM_COLUMN} unit="°C" src={TERM} /> ampacity.
              A conductor rated higher may start from its own column for the corrections, which is what the{' '}
              <Val v={C90} unit="°C" src={AMP} /> column is for.
            </p>
            <p className={P} data-src={CALC}>
              So <Size s={TWELVE.size} /> copper rated <Val v={TWELVE.column} unit="°C" src={AMP} /> keeps its{' '}
              <Val v={TWELVE.result.ampacity ?? 0} unit="A" src={CALC} /> only for the corrections; with <Val v={COLD_COLUMN} unit="°C" src={TERM} /> terminals
              it carries <Val v={cap(TWELVE, COLD_COLUMN)} unit="A" src={CALC} />, and with <Val v={WARM_COLUMN} unit="°C" src={TERM} /> terminals{' '}
              <Val v={cap(TWELVE, WARM_COLUMN)} unit="A" src={CALC} />. This site keeps NM and UF cable at <Val v={COLD_COLUMN} unit="°C" src={TERM} />,
              corrections included.
            </p>
          </section>

          <section aria-labelledby="small-conductors" className="space-y-5">
            <h2 id="small-conductors" className={H2}>
              Small conductors: 240.4(D)
            </h2>
            <p className={P} data-src={SMALL}>
              Whatever their ampacity, 240.4(D) limits the breaker or fuse on the smallest conductors. It is the reason{' '}
              <Size s="12" /> copper sits on a <Val v={limit('12', 'Cu')} unit="A" src={SMALL} /> breaker even where it carries more.
            </p>
            <DataTable id="limits-240-4-d" variant="ruled" src={SMALL} caption="NEC 240.4(D), the largest breaker or fuse">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Conductor
                  </th>
                  <th scope="col" className={RTH}>
                    Largest breaker or fuse
                  </th>
                </tr>
              </thead>
              <tbody>
                {SMALL_ROWS.map((r) => (
                  <tr key={`${r.size}-${r.material}`}>
                    <th scope="row" className={clsx(RSTICKY_TD, '!font-normal')}>
                      <Size s={r.size} /> {r.material === 'Cu' ? 'copper' : 'aluminum'}
                    </th>
                    <td className={RTD}>
                      <Val v={limit(r.size, r.material)} unit="A" src={SMALL} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            {(['12', '10', '14'] as SizeKey[]).map((s) => (
              <div key={s} className="space-y-1.5">
                <h3 className={H3} data-size={s}>
                  What is the ampacity of <Size s={s} /> wire?
                </h3>
                <p className={P} data-src={AMP}>
                  In Table 310.16, <Size s={s} /> copper carries <Val v={ampacity(s, 'Cu', C60)} unit="A" src={AMP} /> at <Val v={C60} unit="°C" src={AMP} />,{' '}
                  <Val v={ampacity(s, 'Cu', C75)} unit="A" src={AMP} /> at <Val v={C75} unit="°C" src={AMP} /> and{' '}
                  <Val v={ampacity(s, 'Cu', C90)} unit="A" src={AMP} /> at <Val v={C90} unit="°C" src={AMP} />.{' '}
                  <span data-src={SMALL}>
                    240.4(D) limits its breaker to <AmpGuideLink a={limit(s, 'Cu')} className={LINK}><Val v={limit(s, 'Cu')} unit="A" src={SMALL} /></AmpGuideLink>.
                  </span>
                </p>
              </div>
            ))}
            <div className="space-y-1.5">
              <h3 className={H3} data-size="8">
                What is the ampacity of <Size s="8" /> wire?
              </h3>
              <p className={P} data-src={AMP}>
                <Size s="8" /> copper carries <Val v={ampacity('8', 'Cu', C60)} unit="A" src={AMP} />, <Val v={ampacity('8', 'Cu', C75)} unit="A" src={AMP} />{' '}
                and <Val v={ampacity('8', 'Cu', C90)} unit="A" src={AMP} /> in the three columns; aluminum,{' '}
                <Val v={ampacity('8', 'Al', C60)} unit="A" src={AMP} />, <Val v={ampacity('8', 'Al', C75)} unit="A" src={AMP} /> and{' '}
                <Val v={ampacity('8', 'Al', C90)} unit="A" src={AMP} />. 240.4(D) does not reach it.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How do I derate wire for temperature?</h3>
              <p className={P} data-src={COR}>
                Multiply the Table 310.16 value by the factor of Table 310.15(B)(1)(1) for the ambient temperature, from the same column: at{' '}
                <Val v={WARM.temp} unit="°C" src="input" />, <Size s={WARM.size} /> copper at <Val v={WARM.column} unit="°C" src={AMP} /> goes from{' '}
                <Val v={WARM.result.tableAmpacity ?? 0} unit="A" src={AMP} /> to <Val v={WARM.result.ampacity ?? 0} unit="A" src={CALC} format={{ upTo: 2 }} />.
                Below <Val v={UNITY_FROM} unit="°C" src={COR} /> the factors are above 1.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How many conductors before derating?</h3>
              <p className={P} data-src={COR}>
                More than three current-carrying conductors in a raceway or cable: from four to six, Table 310.15(C)(1) takes{' '}
                <Val v={HOT.result.adjustmentPercent} unit="%" src={COR} /> of the value, and less for more.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[AMP, COR, TERM, SMALL]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The{' '}
              <Link href="/methodology#ampacity" className={LINK}>
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
