import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { monthOf } from '@/components/content/AsOf';
import { Byline } from '@/components/content/Byline';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { OnThisPage } from '@/components/look/OnThisPage';
import {
  LOOK_BYLINE,
  LOOK_BYLINE_LINK,
  LOOK_H1,
  LOOK_H1_MAIN,
  LOOK_H1_SUB,
  LOOK_H2 as H2,
  LOOK_H3 as H3,
  LOOK_LEAD,
  LOOK_LINK as LINK,
  LOOK_P as P,
  LOOK_PAGE,
  LOOK_SOURCES_HEADING,
  LOOK_SOURCES_LIST,
  LOOK_SOURCES_SECTION,
} from '@/components/look/styles';
import { EditionSummary } from '@/components/content/EditionSummary';
import { Figure } from '@/components/content/Figure';
import { Num } from '@/components/content/Num';
import { Size } from '@/components/content/Size';
import { Sources } from '@/components/content/Sources';
import { Val } from '@/components/content/Val';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { articleDates, formatDate } from '@/lib/page-dates';
import {
  NEC_2026_DOMAIN,
  NEC_2026_EFFECTIVE,
  NEC_2026_ISSUANCE_DOMAIN,
  NEC_2026_ISSUED,
  NEC_2026_MIN_SIZES,
  NEC_2026_OUTDOOR_GFCI,
} from '@/lib/verified/nec-2026-edition';
import {
  adoption,
  adoptionByName,
  ADOPTION_AS_OF,
  editionGroups,
  editionLabel,
  editionQualifier,
  joinNames,
  JURISDICTION_TOTAL,
  LOCAL_LABEL,
  NEC_ADOPTION_DOMAIN,
  nextChangeParts,
  NOT_VERIFIED,
  OFFLINE_SOURCE_URLS,
  startDateRange,
  stateName,
  verifiedCount,
} from '@/lib/verified/nec-adoption';
import type { AdoptionRow, EditionGroup } from '@/lib/verified/nec-adoption';
import { attribution, attributionParts, nextCheck } from '@/lib/verified/registry';

// /guides/nec-code-compliance (WSZ-005c, D-25), slug unchanged: the NEC edition each state and DC has adopted, rendered
// per the rules array of data/verified/nec-adoption.json through src/lib/verified/nec-adoption.ts (verified rows only,
// per-jurisdiction counts, the local-adoption label, every row's scope, the next-change wording, the Tennessee
// qualifier, the not-verified list), the 2026 edition's dates (nec-2026-issuance) and the changes Minnesota's review of
// the issued edition lists (nec-2026-edition). Spec: research/page-specs.md "WSZ-005". Not here: the 2023 GFCI and EV
// rules the spec also names, whose values are not in data/verified (DEVLOG §5).
const ROUTE = '/guides/nec-code-compliance';
const URL = `https://wiresizes.com${ROUTE}`;

const ADOPT = NEC_ADOPTION_DOMAIN;
const ISSUE = NEC_2026_ISSUANCE_DOMAIN;
const ED = NEC_2026_DOMAIN;
const SOURCE_DOMAINS = [ADOPT, ISSUE, ED];

const monthYear = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const AS_OF = monthYear(ADOPTION_AS_OF);
const H1 = `NEC Edition by State (Verified ${AS_OF})`;
const TITLE = H1;
const DESCRIPTION =
  'The National Electrical Code edition each state and DC has adopted, with the date it took effect, who it covers and scheduled changes, from state records.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: {
    type: 'article',
    locale: 'en_US',
    siteName: 'WireSizes.com',
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    images: ['/opengraph-image'],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/twitter-image'] },
};


function required<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`nec-code-compliance page: no ${what}`);
  return value;
}

// ── Values the copy states, all from the data modules ─────────────────────────────────────────────────────────────
const GROUPS = editionGroups();
const EDITIONS = GROUPS.filter((g) => g.edition !== 'local');
const LOCAL = GROUPS.find((g) => g.edition === 'local') ?? null;
const NEWEST = required(EDITIONS[0], 'edition');
// The 2026 sections (dates, changes) are about this edition: a newer adopted edition needs new copy first
if (NEWEST.edition !== '2026') throw new Error(`nec-code-compliance page: the newest adopted edition is ${NEWEST.edition}, not 2026`);
const SECOND = required(EDITIONS[1], 'second edition');
const THIRD = required(EDITIONS[2], 'third edition');
const OLDER = EDITIONS.slice(3);
const COMMON = EDITIONS.reduce((a, b) => (b.states.length > a.states.length ? b : a));
const VERIFIED = verifiedCount();
const ON_EARLIER = EDITIONS.slice(1).reduce((n, g) => n + g.states.length, 0);

const NEWEST_ROWS = adoption().filter((r) => r.edition === NEWEST.edition);
const DATED = NEWEST_ROWS.filter((r): r is AdoptionRow & { effective: string } => r.effective !== null).sort((a, b) =>
  a.effective.localeCompare(b.effective),
);
const UNDATED = NEWEST_ROWS.filter((r) => r.effective === null);
const RANGE = required(startDateRange(NEWEST.edition), 'start dates for the newest edition');
const PERMIT_ROWS = adoptionByName().filter((r) => /\bpermit|grace period/i.test(r.scope));
const NYC = adoption().find((r) => r.state === 'NY-NYC') ?? null;
const NY = adoption().find((r) => r.state === 'NY') ?? null;
const OFFLINE = adoptionByName().filter((r) => OFFLINE_SOURCE_URLS.has(r.source_url));
const NEXT_CHECK = monthYear(nextCheck(ADOPT));

/** A state in running text: "the District of Columbia". */
const prose = (code: string) => (code === 'DC' ? 'the District of Columbia' : stateName(code));
const names = (codes: string[]) => joinNames(codes.map(prose));
const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const noun = (g: EditionGroup) => (g.states.length === 1 ? (g.states[0] === 'DC' ? 'jurisdiction' : 'state') : g.states.includes('DC') ? 'jurisdictions' : 'states');

function Count({ g }: { g: EditionGroup }) {
  return (
    <>
      <Num v={g.states.length} src={ADOPT} /> {noun(g)}
    </>
  );
}

function When({ iso, src, short = false }: { iso: string; src: string; short?: boolean }) {
  return (
    <time dateTime={iso} data-src={src}>
      {short ? shortDate(iso) : formatDate(iso)}
    </time>
  );
}

function NoValue({ label }: { label: string }) {
  return (
    <>
      <span aria-hidden="true">–</span>
      <span className="sr-only">{label}</span>
    </>
  );
}

// ── SVGs ──────────────────────────────────────────────────────────────────────────────────────────────────────────
// Tokens as on the two table guides: text #111827 and #374151, rules #9ca3af, accent #1d4ed8, ground #eff6ff with a
// #bfdbfe border. Labels 14 px or more where they render at full width; the narrow layouts (below sm) are 260 units wide,
// so a 320 px screen (a 254 px figure) still renders them at 13 px or more.

/** From NFPA's issue to each state's start date: one row per date, the undated adopters noted below. */
function AdoptionTimeline({ narrow = false }: { narrow?: boolean }) {
  const events = [
    { key: 'issued', date: NEC_2026_ISSUED, label: `NFPA issues the ${NEWEST.edition} NEC`, src: ISSUE, nfpa: true },
    { key: 'effective', date: NEC_2026_EFFECTIVE, label: 'NFPA effective date', src: ISSUE, nfpa: true },
    ...DATED.map((r) => ({ key: r.state, date: r.effective, label: cap(prose(r.state)), src: ADOPT, nfpa: false })),
  ];
  const id = narrow ? 'timeline-narrow-title' : 'timeline-title';
  const rowH = narrow ? 48 : 34;
  const top = narrow ? 14 : 18;
  const lineX = narrow ? 12 : 172;
  const w = narrow ? 260 : 560;
  const footer = UNDATED.length ? (narrow ? 58 : 40) : 8;
  const h = top + events.length * rowH + footer;
  const y = (i: number) => top + i * rowH + (narrow ? 10 : 12);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-labelledby={id}
      className={clsx('h-auto font-display', narrow ? 'max-w-[300px] sm:hidden' : 'hidden max-w-[560px] sm:block')}
      data-src={ADOPT}
    >
      <title id={id}>{`How the ${NEWEST.edition} NEC reached the states: NFPA's issue and effective dates, then the date each state's adoption took effect${UNDATED.length ? `; ${joinNames(UNDATED.map((r) => cap(prose(r.state))))} adopted it with no start date found` : ''}`}</title>
      <line x1={lineX} x2={lineX} y1={y(0)} y2={y(events.length - 1)} stroke="#8f877f" strokeWidth={2} aria-hidden="true" />
      {events.map((e, i) => (
        <g key={e.key} data-src={e.src}>
          <circle cx={lineX} cy={y(i)} r={6} fill={e.nfpa ? '#111111' : '#ffffff'} stroke="#111111" strokeWidth={2} aria-hidden="true" />
          {narrow ? (
            <>
              <text x={lineX + 18} y={y(i) - 4} fontSize={14} fontWeight={600} fill="#555555">
                <tspan data-src={e.src}>{shortDate(e.date)}</tspan>
              </text>
              <text x={lineX + 18} y={y(i) + 15} fontSize={15} fontWeight={e.nfpa ? 700 : 400} fill="#111111">
                {e.label}
              </text>
            </>
          ) : (
            <>
              <text x={lineX - 16} y={y(i) + 5} textAnchor="end" fontSize={14} fill="#555555">
                <tspan data-src={e.src}>{shortDate(e.date)}</tspan>
              </text>
              <text x={lineX + 18} y={y(i) + 5} fontSize={15} fontWeight={e.nfpa ? 700 : 400} fill="#111111">
                {e.label}
              </text>
            </>
          )}
        </g>
      ))}
      {UNDATED.length > 0 &&
        (narrow ? (
          <>
            <text x={0} y={h - 32} fontSize={14} fill="#555555">
              Also adopted, no start date found:
            </text>
            <text x={0} y={h - 12} fontSize={15} fill="#111111">
              {joinNames(UNDATED.map((r) => cap(prose(r.state))))}
            </text>
          </>
        ) : (
          <text x={lineX + 18} y={h - 12} fontSize={14} fill="#555555">
            Also adopted, no start date found: {joinNames(UNDATED.map((r) => cap(prose(r.state))))}
          </text>
        ))}
    </svg>
  );
}

/** How many jurisdictions are on each edition, with local adoption and the states not verified. */
function EditionBars({ narrow = false }: { narrow?: boolean }) {
  const bars = [
    ...EDITIONS.map((g) => ({ key: g.edition, label: editionLabel(g.edition), n: g.states.length, fill: g === NEWEST ? '#111111' : '#8f877f', dash: false })),
    ...(LOCAL ? [{ key: 'local', label: LOCAL_LABEL, n: LOCAL.states.length, fill: '#ffffff', dash: false }] : []),
    { key: 'not-verified', label: 'Not verified', n: NOT_VERIFIED.length, fill: '#ffffff', dash: true },
  ];
  const max = Math.max(...bars.map((b) => b.n));
  const id = narrow ? 'bars-narrow-title' : 'bars-title';
  const w = narrow ? 260 : 560;
  const rowH = narrow ? 46 : 32;
  const labelW = narrow ? 0 : 136;
  const barX = narrow ? 0 : labelW + 10;
  const barMax = narrow ? 210 : 360;
  const barH = narrow ? 16 : 18;
  const h = bars.length * rowH + 8;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-labelledby={id}
      className={clsx('h-auto font-display', narrow ? 'max-w-[300px] sm:hidden' : 'hidden max-w-[560px] sm:block')}
      data-src={ADOPT}
    >
      <title id={id}>{`Jurisdictions on each NEC edition, ${AS_OF}, each state and the District of Columbia counted once`}</title>
      {bars.map((b, i) => {
        const top = i * rowH + 4;
        const barY = narrow ? top + 20 : top + (rowH - barH) / 2 - 2;
        const bw = Math.max(2, (b.n / max) * barMax);
        return (
          <g key={b.key}>
            <text
              x={narrow ? 0 : labelW}
              y={narrow ? top + 14 : barY + barH - 4}
              textAnchor={narrow ? 'start' : 'end'}
              fontSize={narrow ? 15 : 14}
              fontWeight={b.key === NEWEST.edition ? 700 : 400}
              fill="#111111"
            >
              {b.label}
            </text>
            <rect
              x={barX}
              y={barY}
              width={bw}
              height={barH}
              fill={b.fill}
              stroke={b.fill === '#ffffff' ? '#111111' : b.fill}
              strokeWidth={1.5}
              strokeDasharray={b.dash ? '4 3' : undefined}
              aria-hidden="true"
            />
            <text x={barX + bw + 8} y={barY + barH - 4} fontSize={14} fontWeight={600} fill="#111111">
              <Num v={b.n} src={ADOPT} svg />
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** The direct answer's last sentence: the older editions by name, then the states with no single statewide code. */
function AnswerTail() {
  const older = OLDER.flatMap((g) => g.states);
  if (older.length > 0 && LOCAL) {
    return (
      <>
        {cap(names(older))} use older editions, and <Count g={LOCAL} /> have no single statewide electrical code.
      </>
    );
  }
  if (older.length > 0) return <>{cap(names(older))} use older editions.</>;
  if (LOCAL) {
    return (
      <>
        In <Count g={LOCAL} /> there is no single statewide electrical code.
      </>
    );
  }
  return null;
}

/** After the most common edition: the other two of the three largest groups, in one sentence. */
function OtherEditions() {
  const [a, b] = [NEWEST, SECOND, THIRD].filter((g) => g !== COMMON);
  if (!a || !b) return null;
  return (
    <>
      {' '}
      Of the others, <Count g={a} /> {a.states.length === 1 ? 'is' : 'are'} on the {editionLabel(a.edition)} and <Count g={b} /> on the{' '}
      {editionLabel(b.edition)}.
    </>
  );
}

const TOC: [string, string][] = [
  ['states', 'NEC edition in each state'],
  ['count', 'How many states use each edition'],
  ['which-applies', 'Which edition applies to your project'],
  ['changes', 'What changed in the 2026 NEC'],
  ['method', 'How the table was checked'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: H1, description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };

// "$" percent-encoded: Ohio's rule PDFs have it in their paths ("4101$1-35-01"), which reads like an unfilled "$1"
// placeholder to check-banned; both Ohio links answer 200 with %24 (checked 2026-11-12)
const sourceHref = (url: string) => url.replace(/\$/g, '%24');

function SourceCell({ row }: { row: AdoptionRow }) {
  if (OFFLINE_SOURCE_URLS.has(row.source_url)) return <span className="text-ink">{row.source_publisher}</span>;
  return (
    <a href={sourceHref(row.source_url)} className={LINK}>
      {row.source_publisher}
    </a>
  );
}

// The state table stacks below sm: each row becomes a card with the column names as labels (aria-hidden, since the table
// roles keep the header cells for assistive technology), so a phone shows the edition, date, scope and source of a state
// together instead of a 950 px table scrolled sideways. From sm up it is the usual scrolled table with a sticky first
// column. Explicit roles keep the table semantics when display changes.
// In the look (D-33): ruled rows, text cells in Archivo, left-aligned; on phones each state is a block between hairlines.
const TCELL = 'border-b border-cut-rule px-3.5 py-2 text-left align-top font-display text-[15px] leading-snug text-ink';
const THL = 'border-b border-ink bg-white px-3.5 py-2.5 text-left align-bottom font-display text-[13.5px] font-semibold leading-tight text-cut-graphite';
const CELL = clsx(TCELL, 'max-sm:block max-sm:border-0 max-sm:px-0 max-sm:py-0.5');
const LABEL = 'font-semibold text-cut-muted sm:hidden';

function Label({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden="true" className={LABEL}>
      {children}:{' '}
    </span>
  );
}

function StateRow({ row }: { row: AdoptionRow }) {
  const qualifier = editionQualifier(row);
  const next = nextChangeParts(row);
  return (
    <tr role="row" className="max-sm:block max-sm:border-b max-sm:border-cut-rule max-sm:py-3">
      <th
        role="rowheader"
        scope="row"
        className={clsx(TCELL, 'sticky left-0 z-10 bg-white font-semibold max-sm:static max-sm:block max-sm:border-0 max-sm:bg-transparent max-sm:px-0 max-sm:pb-1 max-sm:pt-0 max-sm:text-[17px]')}
      >
        {stateName(row.state)}
      </th>
      <td role="cell" className={CELL}>
        <Label>Edition</Label>
        <span className="whitespace-nowrap font-semibold text-ink">{editionLabel(row.edition)}</span>
        {qualifier && <span className="mt-0.5 block text-cut-muted max-sm:inline">{` ${qualifier}`}</span>}
      </td>
      {/* relative: the sr-only text of an empty cell stays inside the cell, so it cannot widen the page */}
      <td role="cell" className={clsx(CELL, 'relative')}>
        <Label>In force since</Label>
        {row.effective ? (
          <time dateTime={row.effective} className="whitespace-nowrap">
            {formatDate(row.effective)}
          </time>
        ) : row.edition === 'local' ? (
          <NoValue label="not applicable" />
        ) : (
          <span className="whitespace-nowrap text-cut-muted">No date found</span>
        )}
      </td>
      <td role="cell" className={CELL}>
        <Label>Scope</Label>
        {row.scope}
        {next && (
          <span className="mt-1 block font-medium text-ink">
            {cap(next.before)}
            {next.date && (
              <time dateTime={next.date} className="whitespace-nowrap">
                {formatDate(next.date)}
              </time>
            )}
            {next.after}.
          </span>
        )}
      </td>
      <td role="cell" className={CELL}>
        <Label>Source</Label>
        <SourceCell row={row} />
      </td>
    </tr>
  );
}

function Faq({ q, children, src }: { q: ReactNode; children: ReactNode; src: string }) {
  return (
    <div className="space-y-1">
      <h3 className={H3}>{q}</h3>
      <p className={P} data-src={src}>
        {children}
      </p>
    </div>
  );
}

export default function NecEditionByStatePage() {
  const adoptionSource = attributionParts(attribution(ADOPT).text).short;
  return (
    <div className={LOOK_PAGE}>
    <article className="container pb-16">
      <ArticleSchema article={articleData} />

      {/* The look (D-33): the H1 across the top, then the answer beside the timeline of the newest edition */}
      <header className="pt-10 sm:pt-12">
        <h1 className={LOOK_H1}>
          <span className={LOOK_H1_MAIN}>NEC Edition by State</span>{' '}
          <span className={LOOK_H1_SUB}>
            (Verified{' '}
            <time dateTime={ADOPTION_AS_OF} data-src={ADOPT}>
              {AS_OF}
            </time>
            )
          </span>
        </h1>
        <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
      </header>

      <div className="mt-6 grid items-start gap-8 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:gap-10">
        <div className="space-y-4">
          <p className={LOOK_LEAD} data-src={ADOPT}>
          <strong>
            As of{' '}
            <time dateTime={ADOPTION_AS_OF} data-src={ADOPT}>
              {AS_OF}
            </time>
            , <Count g={NEWEST} /> have adopted the {editionLabel(NEWEST.edition)}:
          </strong>{' '}
          {names(NEWEST.states)}. The {editionLabel(SECOND.edition)} is adopted in <Count g={SECOND} /> and the {editionLabel(THIRD.edition)} in{' '}
          <Num v={THIRD.states.length} src={ADOPT} />. <AnswerTail />
          </p>
            <p className={P}>
          An inspector checks electrical work against the edition of the National Electrical Code (NEC) adopted where the work is done, and that is
          often not the newest one. NFPA issued the {NEWEST.edition} edition on <When iso={NEC_2026_ISSUED} src={ISSUE} />, effective{' '}
          <When iso={NEC_2026_EFFECTIVE} src={ISSUE} />, but each state decides when to adopt it, and {ON_EARLIER > VERIFIED / 2 ? 'most' : 'many'} are
          still on an earlier edition. The table below gives each state&apos;s adopted edition, the date it took effect, who it covers and any change
          already scheduled, from the state&apos;s own records.
        </p>
        </div>
      <Figure
        caption={
          <span data-src={ADOPT}>
            NFPA&apos;s dates come from the minutes of the meeting that issued the edition, and each state&apos;s date from its own adoption record.
          </span>
        }
      >
        <AdoptionTimeline />
        <AdoptionTimeline narrow />
      </Figure>
      </div>

      <LookGuideBody className="mt-12 border-t border-cut-rule pt-10">
      <OnThisPage items={TOC} />

      <section aria-labelledby="states" className="space-y-4">
        <h2 id="states" className={H2}>
          NEC edition in each state
        </h2>
        <p className={P}>
          Find your state in the first column. The edition is the one the state has adopted, the scope says which buildings or work it covers,
          and the last column links the record the row was read from. Where no start date was found in the state&apos;s records, none is given.
        </p>
        <div data-src={ADOPT} className="space-y-2">
          <p id="state-table-caption" className="font-display text-base font-semibold text-ink">
            NEC edition adopted in each state and the District of Columbia, as of{' '}
            <time dateTime={ADOPTION_AS_OF} data-src={ADOPT}>
              {AS_OF}
            </time>
          </p>
          <div
            role="region"
            aria-labelledby="state-table-caption"
            tabIndex={0}
            className="relative max-w-full overflow-x-auto focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
          >
            <table
              id="state-table"
              role="table"
              data-src={ADOPT}
              aria-labelledby="state-table-caption"
              className="w-full border-collapse text-left text-[15px] [border-bottom:2px_solid_#111111] [border-top:3px_double_#111111] max-sm:block"
            >
              <thead role="rowgroup" className="max-sm:sr-only">
                <tr role="row">
                  <th role="columnheader" scope="col" className={clsx(THL, 'sticky left-0 z-20')}>
                    State
                  </th>
                  <th role="columnheader" scope="col" className={THL}>
                    Edition
                  </th>
                  <th role="columnheader" scope="col" className={THL}>
                    In force since
                  </th>
                  <th role="columnheader" scope="col" className={clsx(THL, 'min-w-[15rem]')}>
                    Scope and scheduled change
                  </th>
                  <th role="columnheader" scope="col" className={clsx(THL, 'min-w-[15rem]')}>
                    Source
                  </th>
                </tr>
              </thead>
              <tbody role="rowgroup" className="max-sm:block">
                {adoptionByName().map((row) => (
                  <StateRow key={`${row.state} ${row.scope}`} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h3 id="not-verified" className={H3}>
          Not verified
        </h3>
        <ul className="max-w-[35rem] list-disc space-y-1 pl-6 text-[17px] leading-[1.65] text-ink marker:text-cut-line" data-src={ADOPT}>
          {NOT_VERIFIED.map((n) => (
            <li key={n.state}>
              <strong>{stateName(n.state)}:</strong> {cap(n.reason)}
            </li>
          ))}
        </ul>
        <p className={P}>
          Cities and counties can amend the state code, and in states without a single statewide code they adopt their own. Before you rely on an
          edition shown here, ask the local building or electrical inspection office which edition and amendments it enforces.
        </p>
      </section>

      <section aria-labelledby="count" className="space-y-4">
        <h2 id="count" className={H2}>
          How many states use each edition
        </h2>
        <p className={P} data-src={ADOPT}>
          Each state and the District of Columbia counts once, and <Num v={VERIFIED} src={ADOPT} /> of the <Num v={JURISDICTION_TOTAL} src={ADOPT} />{' '}
          have a verified edition. New York City&apos;s own code is listed in the table but not counted, and Ohio&apos;s commercial and residential
          codes count as one state.
        </p>
        <Figure
          caption={
            <span data-src={ADOPT}>
              The {editionLabel(NEWEST.edition)} is the newest edition. {LOCAL_LABEL} means the state has no single statewide electrical code, so
              cities and counties choose one.
            </span>
          }
        >
          <EditionBars />
          <EditionBars narrow />
        </Figure>
        <div className="max-w-[44rem] border-t-2 border-ink pt-3" data-src={ADOPT}>
          <p className="font-display text-[19px] font-bold text-ink">
            The {editionLabel(COMMON.edition)} is the most common edition: <Count g={COMMON} /> had adopted it by {AS_OF}.
          </p>
          <p className="mt-1 text-sm text-cut-muted">Source: {adoptionSource}.</p>
        </div>
        <EditionSummary />
        <p className={P}>
          In some states the adopted code covers only some buildings or work, so a count by edition does not mean every project there follows
          it. The scope column of the table says what each code covers.
        </p>
      </section>

      <section aria-labelledby="which-applies" className="space-y-4">
        <h2 id="which-applies" className={H2}>
          Which edition applies to your project
        </h2>
        <p className={P}>
          The edition that applies is the one adopted where the work is done, and each state sets how its projects change over to a new
          edition. Examples from the table:
        </p>
        <ul className="max-w-[35rem] list-disc space-y-1 pl-6 text-[17px] leading-[1.65] text-ink marker:text-cut-line" data-src={ADOPT}>
          {PERMIT_ROWS.map((r) => (
            <li key={r.state}>
              <strong>{stateName(r.state)} ({editionLabel(r.edition)}):</strong> {r.scope}
            </li>
          ))}
        </ul>
        {LOCAL && (
          <p className={P} data-src={ADOPT}>
            In {names(LOCAL.states)}, there is no single statewide electrical code: cities and counties adopt their own, so the edition can change
            from one county to the next.
          </p>
        )}
        {NYC && NY && (
          <p className={P} data-src={ADOPT}>
            New York City has its own electrical code, based on the {editionLabel(NYC.edition)}, while the rest of New York State is on the{' '}
            {editionLabel(NY.edition)}.
          </p>
        )}
        <p className={P}>
          The calculators and code tables on this site, such as the{' '}
          <Link href="/calculators/wire-size-calculator" className={LINK}>
            wire size calculator
          </Link>
          , the{' '}
          <Link href="/calculators/ampacity-calculator" className={LINK}>
            ampacity calculator
          </Link>{' '}
          and the{' '}
          <Link href="/guides/nec-table-310-16" className={LINK}>
            NEC Table 310.16 page
          </Link>
          , use the 2023 NEC. If your state is on another edition, check the values your job depends on against that edition; the changes below
          are the 2026 ones that touch wire sizes, dwelling circuits and services.
        </p>
      </section>

      <section aria-labelledby="changes" className="space-y-4">
        <h2 id="changes" className={H2}>
          What changed in the 2026 NEC
        </h2>
        <p className={P}>
          Minnesota&apos;s Department of Labor and Industry reviewed the issued 2026 edition before the state adopted it. These changes from its
          summary affect wire sizes, dwelling circuits and services:
        </p>
        <ul className="max-w-[35rem] list-disc space-y-3 pl-6 text-[17px] leading-[1.65] text-ink marker:text-cut-line">
          <li>
            <span data-src={ED}>
              <strong>Minimum conductor sizes</strong> move from 310.3(A) to 310.5, with minimum sizes of <Size s={NEC_2026_MIN_SIZES.Cu} /> copper,{' '}
              <Size s={NEC_2026_MIN_SIZES.CCA} /> copper-clad aluminum and <Size s={NEC_2026_MIN_SIZES.Al} /> aluminum.
            </span>{' '}
            <span data-src={ISSUE}>NFPA&apos;s Standards Council decided on appeal that the issued edition includes this rule.</span>{' '}
            <span data-src={ED}>
              The 2026 Table 310.16 values for <Size s={NEC_2026_MIN_SIZES.Cu} /> copper and <Size s={NEC_2026_MIN_SIZES.CCA} /> copper-clad
              aluminum have been seen only in NFPA&apos;s drafts, so this site does not show them.
            </span>
          </li>
          <li data-src={ED}>
            <strong>Load calculations</strong> move from Article 220 to Article 120, so their section numbers change. Energy management systems are
            renamed power control systems (120.7).
          </li>
          <li data-src={ED}>
            <strong>GFCI protection for outdoor outlets</strong> at dwellings (210.8(F)) now covers single-phase branch circuits rated up to{' '}
            <Val v={NEC_2026_OUTDOOR_GFCI.toA} unit="A" src={ED} />, up from <Val v={NEC_2026_OUTDOOR_GFCI.fromA} unit="A" src={ED} />, where the
            circuit is <Val v={NEC_2026_OUTDOOR_GFCI.maxVoltsToGround} unit="V" src={ED} /> or less to ground.
          </li>
          <li data-src={ED}>
            <strong>The service disconnect</strong> of a one- or two-family dwelling must be in a readily accessible outdoor location (230.70).
          </li>
        </ul>
        <p className={P} data-src={ISSUE}>
          Minnesota&apos;s summary lists more changes than these. NFPA can also amend an edition after issuing it; none of the amendments issued for
          the 2026 edition by{' '}
          <time dateTime={attribution(ISSUE).verified_date.slice(0, 7)}>{monthOf(attribution(ISSUE).verified_date)}</time> changes the sections
          above.
        </p>
      </section>

      <section aria-labelledby="method" className="space-y-4">
        <h2 id="method" className={H2}>
          How the table was checked
        </h2>
        <p className={P} data-src={ADOPT}>
          Every row was read on a state or District of Columbia government source: a statute, an administrative rule, or a page of the agency that
          enforces the code. No third-party adoption map was used for any value. The rows were verified as of{' '}
          <When iso={ADOPTION_AS_OF} src={ADOPT} />, and the next check is due by{' '}
          <time dateTime={nextCheck(ADOPT).slice(0, 7)}>{NEXT_CHECK}</time>.
        </p>
        <p className={P}>
          A state is listed as not verified when no state record says which edition it enforces; no edition is guessed for it.
          {OFFLINE.length > 0 && (
            <>
              {' '}
              The records for {names(OFFLINE.map((r) => r.state))} are no longer online at the addresses they were read from, so {OFFLINE.length === 1 ? 'that row names its' : 'those rows name their'}{' '}
              publisher without a link.
            </>
          )}{' '}
          The{' '}
          <Link href="/methodology#nec-adoption" className={LINK}>
            methodology page
          </Link>{' '}
          describes every source the site uses.
        </p>
      </section>

      <section aria-labelledby="faq" className="space-y-5">
        <h2 id="faq" className={H2}>
          Questions
        </h2>
        <Faq q={`Which states have adopted the ${NEWEST.edition} NEC?`} src={ADOPT}>
          {cap(names(NEWEST.states))} had adopted it as of <When iso={ADOPTION_AS_OF} src={ADOPT} />. Their start dates run from{' '}
          <When iso={required(RANGE.first.effective, 'first start date')} src={ADOPT} /> in {prose(RANGE.first.state)} to{' '}
          <When iso={required(RANGE.last.effective, 'last start date')} src={ADOPT} /> in {prose(RANGE.last.state)}
          {UNDATED.length > 0 ? <>; no start date was found for {names(UNDATED.map((r) => r.state))}.</> : '.'}
        </Faq>
        <Faq q="What NEC edition does my state use?" src={ADOPT}>
          Look up your state in the table above. The {editionLabel(COMMON.edition)} is the most common edition, adopted in <Count g={COMMON} />.
          <OtherEditions />
        </Faq>
        <Faq q={`When did the ${NEWEST.edition} NEC take effect?`} src={ISSUE}>
          NFPA set <When iso={NEC_2026_EFFECTIVE} src={ISSUE} /> as the effective date of the {NEWEST.edition} edition, but it applies to work in a
          state only once that state adopts it. In the states that have, it took effect between{' '}
          <When iso={required(RANGE.first.effective, 'first start date')} src={ADOPT} /> and{' '}
          <When iso={required(RANGE.last.effective, 'last start date')} src={ADOPT} />.
        </Faq>
        {LOCAL && (
          <Faq q="Is the NEC the law in every state?" src={ADOPT}>
            Not by itself: the NEC applies where a state or local government adopts it. In <Count g={LOCAL} /> there is no single statewide
            electrical code, so cities and counties adopt one: {names(LOCAL.states)}.
          </Faq>
        )}
        {NYC && NY && (
          <Faq q="Can a city use a different edition than its state?" src={ADOPT}>
            Yes. Cities and counties can amend the state code, and some keep their own: New York City is on the {editionLabel(NYC.edition)}, while
            the rest of New York State is on the {editionLabel(NY.edition)}.
          </Faq>
        )}
        <Faq q={`Why ${NOT_VERIFIED.length === 1 ? 'is' : 'are'} ${joinNames(NOT_VERIFIED.map((n) => stateName(n.state)))} not in the table?`} src={ADOPT}>
          {NOT_VERIFIED.length === 1 ? 'It has' : 'Neither has'} a verified edition.{' '}
          {NOT_VERIFIED.map((n, i) => (
            <span key={n.state}>
              {i > 0 && ' '}For {stateName(n.state)}, {n.reason}
            </span>
          ))}
        </Faq>
      </section>

      <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
        <Sources
          domains={SOURCE_DOMAINS}
          hrefs={{ [ADOPT]: '#states' }}
          headingClassName={LOOK_SOURCES_HEADING}
          listClassName={LOOK_SOURCES_LIST}
          linkClassName={LINK}
        />
        <p>
          The{' '}
          <Link href="/methodology" className={LINK}>
            methodology page
          </Link>{' '}
          describes each source. NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the National Fire Protection
          Association; wiresizes.com is not affiliated with or endorsed by NFPA.
        </p>
      </section>
      </LookGuideBody>
    </article>
    </div>
  );
}
