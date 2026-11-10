import type { Metadata } from 'next';
import { BasicPageSchema } from '@/components/seo/BasicPageSchema';

// Copy from research/trust-pages-copy.md (/disclaimer), rendered verbatim.
const TITLE = 'Disclaimer';
const DESCRIPTION =
  'The limits of the tables and calculators on wiresizes.com, and who has the final word on an installation.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: '/disclaimer'
  },
  openGraph: {
    type: 'website',
    siteName: 'WireSizes.com',
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://wiresizes.com/disclaimer',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function DisclaimerPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl space-y-6 text-lg text-gray-700 leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Disclaimer</h1>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Reference values</h2>
        <p>
          The tables and calculators on this site show values from the NEC edition named on each page and from NIST
          publications. Use them for planning and learning.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Your jurisdiction decides</h2>
        <p>
          States and cities adopt different NEC editions, some years apart, and amend them. Your local electrical
          inspector, the authority having jurisdiction, has the final word on what an installation needs.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Equipment instructions</h2>
        <p>
          Listed equipment comes with installation instructions that can be stricter than a general table, for
          example on breaker size, wire size or terminal temperature. Follow them.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Who writes this site</h2>
        <p>
          The author is a physicist, not a licensed electrician or engineer. Have a licensed electrician do the work
          wherever your jurisdiction requires one.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Errors</h2>
        <p>
          If you find an error, email contact@wiresizes.com. Corrections are listed with dates on the About page.
        </p>
      </div>
      <BasicPageSchema path="/disclaimer" name={TITLE} description={DESCRIPTION} />
    </div>
  );
}
