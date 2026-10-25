import type { Metadata } from 'next';

// Copy from research/trust-pages-copy.md (/contact), rendered verbatim.
const TITLE = 'Contact wiresizes.com';
const DESCRIPTION = 'Email address for corrections, questions about a page and privacy requests.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: '/contact'
  },
  openGraph: {
    type: 'website',
    siteName: 'WireSizes.com',
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://wiresizes.com/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ContactPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl space-y-6 text-lg text-gray-700 leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Contact</h1>
        <p>
          Email{' '}
          <a href="mailto:contact@wiresizes.com" className="text-blue-600 hover:underline">
            contact@wiresizes.com
          </a>{' '}
          for corrections, questions about a page, or privacy requests. One person runs this site, so a reply can
          take a few days.
        </p>
        <p>
          For an electrical emergency, call 911 or your electric utility. This site cannot give advice about a
          specific installation.
        </p>
        <p>
          Publisher: Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia. Company registration number
          9041273000, VAT ID SI94001154.
        </p>
      </div>
    </div>
  );
}
