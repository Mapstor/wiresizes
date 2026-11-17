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
import { ConduitFillTool } from '@/components/calculators/ConduitFillTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { ConduitRacewayChart } from '@/components/look/Charts';
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
import { CONDUIT_FILL_CALC, racewayInSentence } from '@/lib/calculations/conduit-fill';
import { articleDates } from '@/lib/page-dates';
import {
  ANSWER,
  COMPACT_EXAMPLE,
  COMPACT_FIRST,
  COMPACT_THHN_FIRST,
  COMPARE,
  COMPARE_SIZE,
  COMPARE_TRADE,
  FAQ_10_12,
  FAQ_12_34,
  NO_TRADE_ONE,
  QUICK,
  QUICK_TRADES,
  SIZE_EXAMPLE,
} from '@/lib/conduit-fill-page';
import { CONDUIT_FILL_DOMAIN, FILL_NOTES, FILL_PERCENT, RACEWAYS, TABLE_1 } from '@/lib/verified/nec-annex-c';

// /calculators/conduit-fill-calculator (WSZ-039; withdrawn in WSZ-002, back as a new page): NEC 2023 Informative
// Annex C, Tables C.1 to C.13(A), and Chapter 9 Table 1 with its Notes. Every count comes from
// data/verified/nec-ch9-annex-c.json through src/lib/verified/nec-annex-c.ts and the engine
// (src/lib/calculations/conduit-fill.ts), by way of src/lib/conduit-fill-page.ts. One source domain: nec-ch9-fill.
// Conductors of different sizes are not calculated (Table 4 other than IMC and Table 5 are unverified); the page says so.
const ROUTE = '/calculators/conduit-fill-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Conduit Fill Calculator: How Many Wires Fit, NEC Annex C';
const DESCRIPTION =
  'How many THHN, XHHW or THW wires fit in EMT, PVC, rigid or flexible conduit: the NEC 2023 Annex C counts for each trade size, and the size you need.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const SRC = CONDUIT_FILL_DOMAIN;
const CALC = CONDUIT_FILL_CALC;
const EMT = QUICK[0];
const PVC40 = QUICK[1];
if (EMT.raceway.id !== 'emt' || PVC40.raceway.id !== 'pvc-40') throw new Error('conduit fill page: the quick tables moved');
const [A14, A12, A10] = ANSWER;
const MOST = COMPARE[0];
const FEWEST = COMPARE[COMPARE.length - 1];
function must<T>(v: T | null | undefined, what: string): T {
  if (v === null || v === undefined) throw new Error(`conduit fill page: ${what}`);
  return v;
}
const EMT_ONE = must(COMPARE.find((r) => r.id === 'emt'), 'EMT left the comparison');
const PVC40_ONE = must(COMPARE.find((r) => r.id === 'pvc-40'), 'Schedule 40 PVC left the comparison');
const SIZE_EMT = must(SIZE_EXAMPLE.emt.smallest, 'the EMT size example has no answer');
const SIZE_PVC = must(SIZE_EXAMPLE.pvc40.smallest, 'the PVC size example has no answer');

const TOC: ([string, string] | [string, string, string])[] = [
  ['limits', 'Fill limits and the notes'],
  ['thhn-tables', 'THHN in EMT and PVC'],
  ['raceways', 'Raceway types compared'],
  ['conduit-size', 'Choosing a conduit size'],
  ['compact', 'Compact conductors'],
  ['mixed', 'Wires of different sizes'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Conduit Fill Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Conduit Fill Calculator', url: URL, description: DESCRIPTION };

function Pct({ v }: { v: number }) {
  return <Val v={v} unit="%" src={SRC} />;
}

function QuickTable({ q }: { q: (typeof QUICK)[number] }) {
  return (
    <DataTable
      id={`thhn-${q.raceway.id}`}
      variant="ruled"
      src={SRC}
      caption={`THHN, THWN, THWN-2 in ${racewayInSentence(q.raceway.name)}: the most conductors of one size, NEC Annex C Table ${q.raceway.table}`}
    >
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Wire
          </th>
          {QUICK_TRADES.map((t) => (
            <th key={t} scope="col" className={clsx(RTH, '!min-w-[3.6em] !px-2')}>
              {t}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {q.rows.map((r) => (
          <tr key={r.size}>
            <th scope="row" className={clsx(RSTICKY_TD, '!whitespace-nowrap')}>
              <Size s={r.size} />
            </th>
            {r.counts.map((n, k) => (
              <td key={k} className={clsx(RTD, '!min-w-[3.6em] !px-2')}>
                <Num v={n} src={SRC} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function ConduitFillCalculatorPage() {
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Conduit Fill Calculator" sub="How Many Wires Fit, NEC Annex C" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')} data-src={SRC}>
            The most wires of one size that fit in each trade size of {RACEWAYS.length} kinds of conduit and tubing, from the tables in the
            2023 NEC&apos;s Annex C, and the smallest trade size for the wires you need to pull.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <ConduitFillTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={SRC}>
            <strong>
              In EMT, <Size s={A12.size} /> THHN fits <Num v={A12.counts[0].n} src={SRC} /> to a trade size {A12.counts[0].trade},{' '}
              <Num v={A12.counts[1].n} src={SRC} /> to a {A12.counts[1].trade} and <Num v={A12.counts[2].n} src={SRC} /> to a{' '}
              {A12.counts[2].trade}. <Size s={A14.size} /> fits <Num v={A14.counts[0].n} src={SRC} />, <Num v={A14.counts[1].n} src={SRC} /> and{' '}
              <Num v={A14.counts[2].n} src={SRC} />; <Size s={A10.size} /> fits <Num v={A10.counts[0].n} src={SRC} />,{' '}
              <Num v={A10.counts[1].n} src={SRC} /> and <Num v={A10.counts[2].n} src={SRC} /> (NEC Annex C, Table {EMT.raceway.table}).
            </strong>
          </p>
          <p className={P} data-src={SRC}>
            The counts are for conductors all of one size, and a ground wire of the same size is one of them. They follow Chapter 9,
            Table 1, which lets more than two conductors fill <Pct v={FILL_PERCENT.overTwo} /> of the inside of a conduit.
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="limits" className="space-y-5">
            <h2 id="limits" className={H2}>
              Fill limits and the notes
            </h2>
            <p className={P} data-src={SRC}>
              Chapter 9, Table 1 sets how much of a conduit&apos;s cross section the conductors may take: <Pct v={FILL_PERCENT.one} /> for a
              single conductor, <Pct v={FILL_PERCENT.two} /> for two and <Pct v={FILL_PERCENT.overTwo} /> for more.
            </p>
            <DataTable id="table-1" variant="ruled" src={SRC} caption="NEC Chapter 9, Table 1: percent of cross section for conductors and cables">
              <thead>
                <tr>
                  <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
                    Conductors or cables
                  </th>
                  <th scope="col" className={RTH}>
                    Fill
                  </th>
                </tr>
              </thead>
              <tbody>
                {TABLE_1.map((r) => (
                  <tr key={r.conductors}>
                    <th scope="row" className={RSTICKY_TD}>
                      {r.conductors === 'over 2' ? 'More than two' : r.conductors === '1' ? 'One' : 'Two'}
                    </th>
                    <td className={RTD}>
                      <Pct v={r.percent} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className={P} data-src={SRC}>
              The notes to the tables carry the rest of the rule. Equipment grounding and bonding conductors count in the fill, at their
              actual size, bare or insulated (Note 3). A nipple between boxes or enclosures no longer than{' '}
              <Val v={FILL_NOTES.nippleMaxIn} unit="in" src={SRC} /> may be filled to <Pct v={FILL_NOTES.nipplePercent} />, and the adjustment
              factors of Table 310.15(C)(1) need not apply to it (Note 4). A multiconductor cable or a flexible cord counts as one conductor
              (Note 9). The limits apply to complete conduit systems, not to a short sleeve that only protects a cable (Note 2).
            </p>
            <p className={P} data-src={SRC}>
              Annex C rounds a count up when the calculation ends in a decimal of <Num v={FILL_NOTES.roundUpDecimal} src={SRC} /> or more
              (Note 7), which is why some counts sit a little above a strict <Pct v={FILL_PERCENT.overTwo} />. An informational note to Table 1
              adds a warning for three conductors: when the conduit&apos;s inside diameter is between <Num v={FILL_NOTES.jamLow} src={SRC} /> and{' '}
              <Num v={FILL_NOTES.jamHigh} src={SRC} /> times the conductor&apos;s outside diameter, they can jam on the pull.
            </p>
          </section>

          <section aria-labelledby="thhn-tables" className="space-y-5">
            <h2 id="thhn-tables" className={H2}>
              THHN in EMT and PVC
            </h2>
            <p className={P} data-src={SRC}>
              These are Annex C&apos;s counts for THHN, THWN and THWN-2 in EMT and in Schedule 40 PVC, trade sizes {QUICK_TRADES[0]} to{' '}
              {QUICK_TRADES[QUICK_TRADES.length - 1]}; the calculator covers every size and trade size the tables list, for all{' '}
              {RACEWAYS.length} raceways.
            </p>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6 [&>*]:min-w-0">
              <QuickTable q={EMT} />
              <QuickTable q={PVC40} />
            </div>
            <SourceLine domains={[SRC]} />
          </section>

          <section aria-labelledby="raceways" className="space-y-5">
            <h2 id="raceways" className={H2}>
              Raceway types compared
            </h2>
            <p className={P} data-src={SRC}>
              The same trade size holds different counts in different raceways, because Annex C works from each one&apos;s own inside area
              (Table 4). In trade size{' '}
              {COMPARE_TRADE}, {racewayInSentence(MOST.name)} holds the most <Size s={COMPARE_SIZE} /> THHN, <Num v={MOST.n} src={SRC} />, and{' '}
              {racewayInSentence(FEWEST.name)} the fewest, <Num v={FEWEST.n} src={SRC} />. EMT holds <Num v={EMT_ONE.n} src={SRC} /> and
              Schedule 40 PVC <Num v={PVC40_ONE.n} src={SRC} />.{' '}
              {NO_TRADE_ONE.length > 0 && <>{NO_TRADE_ONE.map((r) => r.name).join(', ')} has no trade size {COMPARE_TRADE} in its table.</>}
            </p>
            <Figure
              caption={
                <>
                  <span data-src={SRC}>
                    The most <Size s={COMPARE_SIZE} /> THHN conductors in trade size {COMPARE_TRADE} of each raceway, from Annex C; EMT and
                    Schedule 40 PVC in copper.
                  </span>
                  <SourceLine domains={[SRC]} />
                </>
              }
            >
              <ConduitRacewayChart />
            </Figure>
          </section>

          <section aria-labelledby="conduit-size" className="space-y-5">
            <h2 id="conduit-size" className={H2}>
              Choosing a conduit size
            </h2>
            <p className={P} data-src={CALC}>
              Count every conductor you will pull, the ground wire included, then take the smallest trade size whose count reaches that
              number: the calculator&apos;s &ldquo;Conduit size&rdquo; does this. Four <Size s={SIZE_EXAMPLE.size} /> THHN, three hots and a
              ground of the same size, need trade size {SIZE_EMT.trade.trade} in EMT, which holds <Num v={SIZE_EMT.max} src={SRC} />, and{' '}
              {SIZE_PVC.trade.trade} in Schedule 40 PVC, which holds <Num v={SIZE_PVC.max} src={SRC} />.
            </p>
            <p className={P} data-src={CALC}>
              A ground wire smaller than the circuit wires is a different size, which Annex C does not cover. Counting it as one more wire of
              the larger size errs on the safe side: it can only take up less room than that.
            </p>
          </section>

          <section aria-labelledby="compact" className="space-y-5">
            <h2 id="compact" className={H2}>
              Compact conductors
            </h2>
            <p className={P} data-src={SRC}>
              Compact stranding presses the strands together until the gaps between them are nearly gone, so a compact conductor takes less
              room than a concentric one of the same size. Each raceway has a second Annex C table for compact THHN, XHHW and THW, based on
              Table 5A: in trade size {COMPACT_EXAMPLE.trade} EMT, <Size s={COMPACT_EXAMPLE.size} /> XHHW fits{' '}
              <Num v={COMPACT_EXAMPLE.regular} src={SRC} /> concentric or <Num v={COMPACT_EXAMPLE.compact} src={SRC} /> compact. The compact
              tables start at <Size s={COMPACT_FIRST} />, and compact THHN at <Size s={COMPACT_THHN_FIRST} />. Choose &ldquo;Compact&rdquo; in
              the calculator when the wire is marked compact.
            </p>
          </section>

          <section aria-labelledby="mixed" className="space-y-5">
            <h2 id="mixed" className={H2}>
              Wires of different sizes
            </h2>
            <p className={P} data-src={SRC}>
              For conductors of different sizes, Note 6 sends you to the areas: each conductor&apos;s area from Table 5 (Table 5A for compact
              stranding), added up, against the conduit&apos;s allowed area in Table 4. This calculator does not do that yet. Its numbers all
              come from NFPA&apos;s own records of the 2023 code, and no NFPA record we have found prints Table 5. Until one does, size a
              mixed pull from those two tables in the NEC itself, or count the smaller wires as the
              larger size, as above.
            </p>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SRC}>
                How many 12 gauge wires fit in 3/4 EMT?
              </h3>
              <p className={P} data-src={SRC}>
                <Num v={FAQ_12_34.thhn} src={SRC} /> THHN or THWN-2, <Num v={FAQ_12_34.xhhw} src={SRC} /> XHHW and{' '}
                <Num v={FAQ_12_34.thw} src={SRC} /> THW or TW, by Annex C Table {EMT.raceway.table}.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SRC}>
                How many 10 gauge THHN fit in 1/2 EMT?
              </h3>
              <p className={P} data-src={SRC}>
                <Num v={FAQ_10_12} src={SRC} />. Trade size 3/4 holds <Num v={A10.counts[1].n} src={SRC} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Does the ground wire count in conduit fill?</h3>
              <p className={P} data-src={SRC}>
                Yes. Note 3 to the Chapter 9 tables counts equipment grounding and bonding conductors in the fill, bare or insulated, at their
                actual size.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={SRC}>
                What is the 40 percent rule?
              </h3>
              <p className={P} data-src={SRC}>
                Chapter 9, Table 1: more than two conductors may fill no more than <Pct v={FILL_PERCENT.overTwo} /> of a conduit&apos;s cross
                section. One conductor may fill <Pct v={FILL_PERCENT.one} />, two <Pct v={FILL_PERCENT.two} />.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Can a short nipple hold more wires?</h3>
              <p className={P} data-src={SRC}>
                Yes. A nipple of up to <Val v={FILL_NOTES.nippleMaxIn} unit="in" src={SRC} /> between boxes, cabinets or similar enclosures may
                be filled to <Pct v={FILL_NOTES.nipplePercent} /> of its cross section (Note 4).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Do more wires in one conduit lower their ampacity?</h3>
              <p className={P} data-src={SRC}>
                Yes: more than three current-carrying conductors in a raceway take the adjustment factors of Table 310.15(C)(1). The{' '}
                <Link href="/calculators/ampacity-calculator" className={LINK}>
                  ampacity calculator
                </Link>{' '}
                applies them; a nipple filled under Note 4 is exempt.
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[SRC]}
              headingClassName={LOOK_SOURCES_HEADING}
              listClassName={LOOK_SOURCES_LIST}
              linkClassName={LINK}
              noteClassName={LOOK_SOURCES_NOTE}
            />
            <p>
              The counts are the 2023 NEC&apos;s; the{' '}
              <Link href="/guides/nec-code-compliance" className={LINK}>
                NEC edition by state
              </Link>{' '}
              shows which edition applies where you live. The{' '}
              <Link href="/methodology#conduit-fill-method" className={LINK}>
                methodology page
              </Link>{' '}
              describes how the calculator works and its source. NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the
              National Fire Protection Association; wiresizes.com is not affiliated with or endorsed by NFPA.
            </p>
          </section>
        </LookGuideBody>
      </article>
    </div>
  );
}
