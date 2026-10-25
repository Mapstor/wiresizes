import type { Metadata } from 'next';
import Link from 'next/link';

// Copy from research/trust-pages-copy.md (/about), rendered verbatim.
const TITLE = 'About wiresizes.com';
const DESCRIPTION =
  'Who writes wiresizes.com, which sources its numbers come from, how pages are checked, and the dated list of corrections.';

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
    <div className="container py-12">
      <div className="max-w-3xl space-y-6 text-lg text-gray-700 leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">About wiresizes.com</h1>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Who runs this site</h2>
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

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Where the numbers come from</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>NFPA 70, the National Electrical Code (NEC), 2023 edition, unless a page names another edition.</li>
          <li>
            NIST Handbook 100, Copper Wire Tables, for wire diameters, areas and copper resistance. NIST Handbook 109
            for aluminum.
          </li>
          <li>NIST Special Publication 811 for unit conversion factors.</li>
          <li>{"Manufacturers' installation instructions, for pages about specific equipment."}</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">How pages are made</h2>
        <p>
          Drafts are written with AI assistance. Pages are being rebuilt so that every figure traces to one of the
          sources above. Marko publishes every update, and when an error turns up he fixes it and adds a dated line
          to the list below.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Corrections</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            October 25, 2026: Audited every page. Removed the unsourced claims the audit found, including user counts,
            endorsements, expert reviews and response-time promises, and deleted or corrected the wrong values it
            found. Took 15 calculators offline until they are rebuilt from verified sources. Redirected 6 overlapping
            or retired pages to their closest page.
          </li>
        </ul>
        <p>To report an error, email contact@wiresizes.com.</p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Publisher</h2>
        <p>
          wiresizes.com is published by Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia. Company
          registration number 9041273000, VAT ID SI94001154. Email: contact@wiresizes.com. The{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            privacy notice
          </Link>{' '}
          lists what the site collects.
        </p>
      </div>
    </div>
  );
}
