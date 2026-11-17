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
import { BoxFillTool } from '@/components/calculators/BoxFillTool';
import { LookGuideBody } from '@/components/layout/LookGuideBody';
import { BoxFillBars } from '@/components/look/Charts';
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
import { BOX_FILL_CALC, KIND_ORDER } from '@/lib/calculations/box-fill';
import { articleDates } from '@/lib/page-dates';
import {
  DEEP_SQUARE_BOX,
  EXAMPLE_12,
  EXAMPLE_14,
  EXAMPLE_BOX,
  QUARTER_12,
  ROUND_SHALLOW_BOX,
  SQUARE_BOX,
  VOLUME_ROWS,
  WITH_DEVICE_12,
  WITH_DEVICE_CLAMPS_12,
} from '@/lib/box-fill-page';
import { BOX_FILL_DOMAIN, BOX_SIZES, FILL_RULES, METAL_BOXES, VOLUME_PER_CONDUCTOR } from '@/lib/verified/nec-314-16';
import type { BoxKind } from '@/lib/verified/nec-314-16';

// /calculators/box-fill-calculator (WSZ-009d; spec: research/page-specs-held.md "WSZ-009"; data gate BUILD since
// WSZ-032; withdrawn in WSZ-002, back as a new page): NEC 2023 314.16. Every number comes from
// data/verified/nec-314-16.json through src/lib/verified/nec-314-16.ts (Table 314.16(A), Table 314.16(B)(1), the
// counting rules (B)(1) to (B)(6) and 314.27(E)) or from the engine (src/lib/calculations/box-fill.ts) on those values.
// One source domain: nec-314-16-box-fill. No terminal block input (the result says so), no conduit bodies (314.16(C)).
const ROUTE = '/calculators/box-fill-calculator';
const URL = `https://wiresizes.com${ROUTE}`;
const TITLE = 'Box Fill Calculator: NEC 314.16 Box Size and Wire Count';
const DESCRIPTION =
  'How many wires fit in an electrical box: the NEC 314.16 fill for conductors, devices, ground wires and clamps against the volume of a metal or plastic box.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'WireSizes.com', url: URL, title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const BOX = BOX_FILL_DOMAIN;
const CALC = BOX_FILL_CALC;
const V12 = VOLUME_PER_CONDUCTOR['12'];
const V14 = VOLUME_PER_CONDUCTOR['14'];
const KIND_NAME: Record<BoxKind, string> = {
  device: 'device',
  square: 'square',
  'round/octagonal': 'round or octagonal',
  'masonry box/gang': 'masonry box or gang',
  'FS/FD box': 'FS or FD',
};

const TOC: ([string, string] | [string, string, string])[] = [
  ['per-conductor', 'Volume for each conductor'],
  ['counting', 'What counts in box fill'],
  ['metal-boxes', 'Metal box volumes'],
  ['marked', 'Plastic boxes, rings and covers'],
  ['changes', 'What changed in 2023'],
  ['faq', 'Questions'],
  ['sources', 'Sources'],
];

const articleData = { headline: 'Box Fill Calculator', description: DESCRIPTION, url: URL, ...articleDates(ROUTE) };
const webAppData = { name: 'Box Fill Calculator', url: URL, description: DESCRIPTION };

function In3({ v, src = BOX, fixed = 2 }: { v: number; src?: string; fixed?: number }) {
  return <Val v={v} unit="in³" src={src} format={{ fixed }} />;
}
/** A box from Table 314.16(A) in words: "3 × 2 × 3½ in device box". */
function BoxName({ box }: { box: (typeof METAL_BOXES)[number] }) {
  return (
    <>
      {box.inches} in {KIND_NAME[box.kind]} box
    </>
  );
}

function PerConductorTable() {
  return (
    <DataTable id="box-per-conductor" variant="ruled" src={BOX} caption="Volume for each conductor, NEC Table 314.16(B)(1)">
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Conductor
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            in³
          </th>
          <th scope="col" className={clsx(RTH, 'max-sm:!min-w-0')}>
            cm³
          </th>
        </tr>
      </thead>
      <tbody>
        {VOLUME_ROWS.map((r) => (
          <tr key={r.size}>
            <th scope="row" className={RSTICKY_TD}>
              <Size s={r.size} />
            </th>
            <td className={RTD}>
              <Num v={r.in3} src={BOX} format={{ fixed: 2 }} />
            </td>
            <td className={RTD}>
              <Num v={r.cm3} src={BOX} format={{ fixed: 1 }} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function MetalBoxTable() {
  const sizes = BOX_SIZES;
  const NUM = '!min-w-[3.4em] !px-2';
  return (
    <DataTable id="box-metal" variant="ruled" src={BOX} caption="Metal boxes, NEC Table 314.16(A): volume and the most conductors of one size">
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH, '!whitespace-normal')}>
            Box, in
          </th>
          <th scope="col" className={clsx(RTH, '!min-w-[7rem] !text-left !whitespace-normal')}>
            Type
          </th>
          <th scope="col" className={clsx(RTH, NUM)}>
            in³
          </th>
          <th scope="col" className={clsx(RTH, NUM)}>
            cm³
          </th>
          {sizes.map((s) => (
            <th key={s} scope="col" className={clsx(RTH, NUM, '!whitespace-normal')}>
              <Size s={s} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {KIND_ORDER.flatMap((kind) => METAL_BOXES.filter((b) => b.kind === kind)).map((b) => (
          <tr key={b.id}>
            <th scope="row" className={clsx(RSTICKY_TD, '!whitespace-nowrap')} data-src={BOX}>
              {b.inches}
            </th>
            <td className={clsx(RTD, '!min-w-[7rem] !text-left !whitespace-normal !font-display')}>{b.kind === 'FS/FD box' ? b.kindLabel : KIND_NAME[b.kind]}</td>
            <td className={clsx(RTD, NUM)}>
              <Num v={b.in3} src={BOX} format={{ fixed: 1 }} />
            </td>
            <td className={clsx(RTD, NUM)}>
              <Num v={b.cm3} src={BOX} />
            </td>
            {sizes.map((s) => (
              <td key={s} className={clsx(RTD, NUM)}>
                <Num v={b.max[s]} src={BOX} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export default function BoxFillCalculatorPage() {
  const device12 = EXAMPLE_12.lines.find((l) => l.rule === '(B)(4)');
  if (!device12) throw new Error('box fill page: the example has no device line');
  return (
    <div className={LOOK_PAGE}>
      <article className="container pb-16">
        <ArticleSchema article={articleData} />
        <CombinedSchema webApp={webAppData} />

        <header className="pt-10 sm:pt-12">
          <PageTitle main="Box Fill Calculator" sub="NEC 314.16 Box Size and Wire Count" joiner=": " />
          <p className={clsx(LOOK_LEAD, 'mt-5')}>
            How many wires fit in an electrical box: the fill NEC 314.16 counts for conductors, devices, ground wires and clamps, against the
            volume of a metal box from Table 314.16(A) or the volume marked on a plastic one.
          </p>
          <Byline route={ROUTE} sources className={LOOK_BYLINE} linkClassName={LOOK_BYLINE_LINK} />
        </header>

        <section aria-label="Calculator" className="mt-8 border-t-2 border-ink pt-7">
          <BoxFillTool />
        </section>

        <div className="mt-14 max-w-[44rem] space-y-4">
          <p className={LOOK_LEAD} data-src={BOX}>
            <strong>
              Each conductor takes <In3 v={V14.in3} /> at <Size s="14" /> and <In3 v={V12.in3} /> at <Size s="12" /> (Table 314.16(B)(1)). A switch
              or receptacle takes two of those for its yoke, up to {FILL_RULES.egcSingleUpTo === 4 ? 'four' : FILL_RULES.egcSingleUpTo} ground
              wires take one, and internal cable clamps one.
            </strong>
          </p>
          <p className={P} data-src={CALC}>
            A receptacle fed by two <Size s="12" /> cables, each with a ground wire, fills a <BoxName box={EXAMPLE_BOX} /> (
            <In3 v={EXAMPLE_BOX.in3} fixed={1} />) exactly when the box has internal clamps: <In3 v={EXAMPLE_12.fillIn3} src={CALC} />. On{' '}
            <Size s="14" /> the same box keeps <In3 v={EXAMPLE_14.spareIn3} src={CALC} /> free.
          </p>
        </div>

        <LookGuideBody className="mt-14 border-t border-cut-rule pt-10">
          <OnThisPage items={TOC} />

          <section aria-labelledby="per-conductor" className="space-y-5">
            <h2 id="per-conductor" className={H2}>
              Volume for each conductor
            </h2>
            <p className={P} data-src={BOX}>
              Table 314.16(B)(1) sets the free space a box needs for each conductor, from <In3 v={VOLUME_PER_CONDUCTOR['18'].in3} /> at{' '}
              <Size s="18" /> to <In3 v={VOLUME_PER_CONDUCTOR['6'].in3} /> at <Size s="6" />. Box fill adds these volumes up, and under 314.16 the
              box&apos;s volume may not be less than the total.
            </p>
            <div className="max-w-[24rem]">
              <PerConductorTable />
            </div>
          </section>

          <section aria-labelledby="counting" className="space-y-5">
            <h2 id="counting" className={H2}>
              What counts in box fill
            </h2>
            <ul className={clsx(P, 'list-disc space-y-2 pl-6')} data-src={BOX}>
              <li>
                <strong>Conductors, 314.16(B)(1).</strong> A wire that comes in from outside and ends or is spliced in the box counts once, and
                so does one that passes through. A loop or coil at least twice the free length 300.14 asks for counts twice. A conductor that
                never leaves the box, such as a pigtail, is not counted.
              </li>
              <li>
                <strong>Clamps, 314.16(B)(2).</strong> One allowance for all internal cable clamps together, sized on the largest conductor in
                the box; none for a connector whose clamp sits outside the box.
              </li>
              <li>
                <strong>Support fittings, 314.16(B)(3).</strong> One allowance for each type, luminaire studs or hickeys, on the largest
                conductor in the box.
              </li>
              <li>
                <strong>Devices, 314.16(B)(4).</strong> Two allowances for each yoke or strap, sized on the largest conductor connected to the
                device or devices it carries. A device wider than a single 2 in device box takes two for each gang it needs.
              </li>
              <li>
                <strong>Ground wires, 314.16(B)(5).</strong> One allowance for up to {FILL_RULES.egcSingleUpTo === 4 ? 'four' : FILL_RULES.egcSingleUpTo}{' '}
                equipment grounding conductors entering, sized on the largest of them, and a quarter allowance for each one more: a fifth{' '}
                <Size s="12" /> ground wire adds <Val v={QUARTER_12} unit="in³" src={CALC} format={{ fixed: 4 }} />.
              </li>
              <li>
                <strong>Terminal blocks, 314.16(B)(6).</strong> One allowance for each terminal block assembly, on the largest conductor
                terminated to it. A weight-supporting ceiling receptacle counts as a device (314.27(E)).
              </li>
            </ul>
            <p className={P} data-src={BOX}>
              Small fittings such as locknuts and bushings take no allowance, and each space of a box divided by a barrier is calculated on its
              own.
            </p>
            <Figure
              caption={
                <>
                  <span data-src={CALC}>
                    The worked example in the <In3 v={EXAMPLE_BOX.in3} fixed={1} /> device box, to scale: four conductors, the receptacle&apos;s
                    double allowance (<In3 v={device12.in3} src={CALC} /> on <Size s="12" />), the ground wires and the clamps. On{' '}
                    <Size s="12" /> they fill <In3 v={EXAMPLE_12.fillIn3} src={CALC} />; on <Size s="14" />, <In3 v={EXAMPLE_14.fillIn3} src={CALC} />
                    .
                  </span>
                  <SourceLine domains={[BOX]} />
                </>
              }
            >
              <BoxFillBars />
            </Figure>
          </section>

          <section aria-labelledby="metal-boxes" className="space-y-5">
            <h2 id="metal-boxes" className={H2}>
              Metal box volumes
            </h2>
            <p className={P} data-src={BOX}>
              Table 314.16(A) lists the volume of {METAL_BOXES.length === 24 ? 'twenty-four' : METAL_BOXES.length} standard metal boxes and the
              most conductors of one size each may hold. Those counts hold only where nothing else in the box needs an allowance: no clamps,
              fittings, devices or ground wires. With any of them, add the allowances, as the calculator does.
            </p>
            <MetalBoxTable />
          </section>

          <section aria-labelledby="marked" className="space-y-5">
            <h2 id="marked" className={H2}>
              Plastic boxes, rings and covers
            </h2>
            <p className={P} data-src={BOX}>
              Under 314.16(A)(2), nonmetallic boxes, and other boxes of <Val v={100} unit="in³" src={BOX} /> or less that are not in Table
              314.16(A), are marked by the maker with their volume. Use that marked volume. A box&apos;s volume also includes plaster rings,
              extension rings and domed covers that are marked with their volume or made from a box in the table (314.16(A)); enter them under
              rings and covers.
            </p>
          </section>

          <section aria-labelledby="changes" className="space-y-5">
            <h2 id="changes" className={H2}>
              What changed in 2023
            </h2>
            <ul className={clsx(P, 'list-disc space-y-2 pl-6')} data-src={BOX}>
              <li>Equipment bonding jumpers left the ground wire count of 314.16(B)(5); it now names equipment grounding conductors only.</li>
              <li>Terminal blocks got their own allowance, 314.16(B)(6).</li>
              <li>The paragraph on clamp assemblies with a cable termination was removed from 314.16(B)(2).</li>
              <li>
                Table 314.16(A) corrected the <BoxName box={ROUND_SHALLOW_BOX} />: its <Size s="8" /> column now reads{' '}
                <Num v={ROUND_SHALLOW_BOX.max['8']} src={BOX} />, the most its <In3 v={ROUND_SHALLOW_BOX.in3} fixed={1} /> holds at{' '}
                <In3 v={VOLUME_PER_CONDUCTOR['8'].in3} /> each.
              </li>
            </ul>
          </section>

          <section aria-labelledby="faq" className="space-y-6">
            <h2 id="faq" className={H2}>
              Questions
            </h2>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={BOX}>
                How many <Size s="12" /> wires can go in a single-gang box?
              </h3>
              <p className={P} data-src={CALC}>
                It depends on the box&apos;s volume. A <BoxName box={EXAMPLE_BOX} /> (<In3 v={EXAMPLE_BOX.in3} fixed={1} />) holds{' '}
                <Num v={EXAMPLE_BOX.max['12']} src={BOX} /> with nothing else in it. With a receptacle and its ground wires it holds{' '}
                <Num v={WITH_DEVICE_12} src={CALC} />, and <Num v={WITH_DEVICE_CLAMPS_12} src={CALC} /> if the box also has internal clamps.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3} data-src={BOX}>
                How many wires fit in a 4 in square box?
              </h3>
              <p className={P} data-src={BOX}>
                With nothing else in it, a <BoxName box={SQUARE_BOX} /> (<In3 v={SQUARE_BOX.in3} fixed={1} />) holds{' '}
                <Num v={SQUARE_BOX.max['14']} src={BOX} /> conductors of <Size s="14" /> or <Num v={SQUARE_BOX.max['12']} src={BOX} /> of{' '}
                <Size s="12" />, and a <BoxName box={DEEP_SQUARE_BOX} /> (<In3 v={DEEP_SQUARE_BOX.in3} fixed={1} />){' '}
                <Num v={DEEP_SQUARE_BOX.max['14']} src={BOX} /> or <Num v={DEEP_SQUARE_BOX.max['12']} src={BOX} /> (Table 314.16(A)). Devices,
                ground wires and clamps take their allowances from those numbers.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Do ground wires count in box fill?</h3>
              <p className={P} data-src={BOX}>
                Yes. Up to {FILL_RULES.egcSingleUpTo === 4 ? 'four' : FILL_RULES.egcSingleUpTo} equipment grounding conductors entering the box
                count as one allowance, sized on the largest of them; each one more adds a quarter allowance (314.16(B)(5)).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Do pigtails count in box fill?</h3>
              <p className={P} data-src={BOX}>
                No. A conductor no part of which leaves the box is not counted (314.16(B)(1)). The wires the pigtail is spliced to count once
                each.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>How does a switch or receptacle count?</h3>
              <p className={P} data-src={BOX}>
                As two conductors for each yoke or strap, sized on the largest conductor connected to it: <In3 v={2 * V14.in3} src={CALC} /> on{' '}
                <Size s="14" />, <In3 v={2 * V12.in3} src={CALC} /> on <Size s="12" /> (314.16(B)(4)).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className={H3}>Do cable clamps count in box fill?</h3>
              <p className={P} data-src={BOX}>
                Internal clamps count once in all, sized on the largest conductor in the box, however many there are. A cable connector whose
                clamp sits outside the box counts nothing (314.16(B)(2)).
              </p>
            </div>
          </section>

          <section aria-label="Sources and notices" className={LOOK_SOURCES_SECTION}>
            <Sources
              domains={[BOX]}
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
              <Link href="/methodology#box-fill-method" className={LINK}>
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
