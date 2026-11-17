import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { BasicPageSchema } from '@/components/seo/BasicPageSchema';
import CORRECTIONS from '@/data/corrections.json';
import { AUTHOR_LINKEDIN } from '@/lib/identity';
import { formatDate } from '@/lib/page-dates';
import { PageTitle } from '@/components/look/PageTitle';
import { LOOK_H2, LOOK_LINK, LOOK_PAGE } from '@/components/look/styles';

// Copy from research/trust-pages-copy.md (/about), rendered verbatim. WSZ-004a: the rel="me" LinkedIn line, and the
// Corrections list from src/data/corrections.json (one dated line per error readers could see on the live site, dated
// the day its fix went live). WSZ-004b: the sentence linking /methodology under "Where the numbers come from".
const TITLE = 'About wiresizes.com';
const DESCRIPTION =
  'Who writes wiresizes.com, which sources its numbers come from, how pages are checked, and the dated list of corrections.';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// A correction line as text, with a month-and-day date ("the November 2 audit") as <time> in the line's own year, and a
// three-phase system name ("208Y/120 V") traced to the U.S. nominal voltages it is checked against.
const CORRECTION_PARTS = new RegExp(`\\b(${MONTHS.join('|')}) (\\d{1,2})\\b|\\b\\d{3}Y/\\d{3} V\\b`, 'g');

function CorrectionText({ date, text }: { date: string; text: string }) {
  const year = date.slice(0, 4);
  const parts: ReactNode[] = [];
  let at = 0;
  for (const m of text.matchAll(CORRECTION_PARTS)) {
    const i = m.index ?? 0;
    if (i > at) parts.push(text.slice(at, i));
    if (m[1]) {
      const month = String(MONTHS.indexOf(m[1]) + 1).padStart(2, '0');
      parts.push(
        <time key={i} dateTime={`${year}-${month}-${m[2].padStart(2, '0')}`}>
          {m[0]}
        </time>,
      );
    } else {
      parts.push(
        <span key={i} data-src="us-nominal-voltages">
          {m[0]}
        </span>,
      );
    }
    at = i + m[0].length;
  }
  if (at < text.length) parts.push(text.slice(at));
  return <>{parts}</>;
}

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: '/about'
  },
  openGraph: {
    type: 'website',
    siteName: 'WireSizes.com',
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://wiresizes.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function AboutPage() {
  return (
    <div className={LOOK_PAGE}>
    <div className="container pb-16">
      <header className="pt-10 sm:pt-12">
        <PageTitle main="About wiresizes.com" />
      </header>
      <div className="mt-10 max-w-[35rem] space-y-6 text-[17px] leading-[1.65] text-ink">

        <h2 className={`${LOOK_H2} pt-6`}>Who runs this site</h2>
        <p>
          Marko Visic writes and maintains wiresizes.com. He holds a BSc in Physics from the Faculty of Mathematics
          and Physics, University of Ljubljana, Slovenia.
        </p>
        <p>
          Physics covers the measurement side of this site: conductor resistance, how it changes with temperature,
          wire gauge geometry and unit conversions. It does not make him an authority on the electrical code. He is
          not a licensed electrician or engineer, so the site reports what the code and the measurement standards say
          and does not give opinions on code questions.
        </p>
        <p>
          <a href={AUTHOR_LINKEDIN} rel="me" className={LOOK_LINK}>
            Marko Visic on LinkedIn
          </a>
        </p>

        <h2 className={`${LOOK_H2} pt-6`}>Where the numbers come from</h2>
        <ul className="list-disc space-y-2 pl-6 marker:text-cut-line">
          <li>NFPA 70, the National Electrical Code (NEC), 2023 edition, unless a page names another edition.</li>
          <li>
            <a href="/methodology#wire-gauge" data-src="awg-geometry" className={LOOK_LINK}>
              NIST Handbook 100
            </a>
            , Copper Wire Tables, for wire diameters, areas and copper resistance.{' '}
            <a href="/methodology#resistance" data-src="conductor-resistance-20c" className={LOOK_LINK}>
              NIST Handbook 109
            </a>{' '}
            for aluminum.
          </li>
          <li>
            <a href="/methodology#conversions" data-src="nist-sp811-conversions" className={LOOK_LINK}>
              NIST Special Publication 811
            </a>{' '}
            for unit conversion factors.
          </li>
          <li>{"Manufacturers' installation instructions, for pages about specific equipment."}</li>
        </ul>
        <p>
          The{' '}
          <Link href="/methodology" className={LOOK_LINK}>
            methodology page
          </Link>{' '}
          gives the edition of each source, the formulas the calculators use and their limits.
        </p>

        <h2 className={`${LOOK_H2} pt-6`}>How pages are made</h2>
        <p>
          Drafts are written with AI assistance. Pages are being rebuilt so that every figure traces to one of the
          sources above. Marko publishes every update, and when an error turns up he fixes it and adds a dated line
          to the list below.
        </p>

        <h2 className={`${LOOK_H2} pt-6`}>Corrections</h2>
        <ul className="list-disc space-y-2 pl-6 marker:text-cut-line">
          {CORRECTIONS.map((correction) => (
            <li key={`${correction.date} ${correction.text}`}>
              <time dateTime={correction.date}>{formatDate(correction.date)}</time>: <CorrectionText date={correction.date} text={correction.text} />
            </li>
          ))}
        </ul>
        <p>To report an error, email info@wiresizes.com.</p>

        <h2 className={`${LOOK_H2} pt-6`}>Publisher</h2>
        <address className="not-italic">
          wiresizes.com is published by Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia. Company
          registration number 9041273000, VAT ID SI94001154. Email: info@wiresizes.com.
        </address>
        <p>
          The{' '}
          <Link href="/privacy" className={LOOK_LINK}>
            privacy notice
          </Link>{' '}
          lists what the site collects.
        </p>
      </div>
      <BasicPageSchema path="/about" name={TITLE} description={DESCRIPTION} />
    </div>
    </div>
  );
}
