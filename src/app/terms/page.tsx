import type { Metadata } from 'next';
import { formatDate, pageDates } from '@/lib/page-dates';

// Copy from research/trust-pages-copy.md (/terms), rendered verbatim.
const TITLE = 'Terms of use';
const DESCRIPTION =
  "Who operates wiresizes.com, what its tables and calculators are for, and what they don't cover.";
// "Last updated": the route's modified date in src/data/page-dates.json (D-17).
const UPDATED = pageDates('/terms').modified;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: '/terms'
  },
  openGraph: {
    type: 'website',
    siteName: 'WireSizes.com',
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://wiresizes.com/terms',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function TermsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl space-y-6 text-lg text-gray-700 leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Terms of use</h1>
        <p>
          Last updated: <time dateTime={UPDATED}>{formatDate(UPDATED)}</time>
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Operator</h2>
        <p>
          wiresizes.com is operated by Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia (company
          registration number 9041273000, VAT ID SI94001154). Contact: contact@wiresizes.com.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">What the site provides</h2>
        <p>
          Free reference tables and calculators about electrical conductors. Code values are quoted from the NEC
          edition named on each page; physical values come from NIST publications; calculators apply the formulas
          shown on their pages.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">No professional advice</h2>
        <p>
          Using this site does not create a professional relationship. The information is provided as is, without
          any warranty. Check every result against the code edition your jurisdiction enforces and the
          {" equipment's"} installation instructions. Where your jurisdiction requires a permit, an inspection or a
          licensed electrician, those requirements apply.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Liability</h2>
        <p>
          To the extent the law allows, Moving Data Systems d.o.o. is not liable for any loss that results from
          using this site.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Trademarks</h2>
        <p>
          NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the National Fire Protection
          Association. wiresizes.com is not affiliated with or endorsed by NFPA.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Governing law</h2>
        <p>These terms are governed by the law of the Republic of Slovenia.</p>
      </div>
    </div>
  );
}
