import type { Metadata } from 'next';
import { formatDate, pageDates } from '@/lib/page-dates';

// Copy from research/trust-pages-copy.md (/privacy), rendered verbatim.
const TITLE = 'Privacy notice';
const DESCRIPTION =
  'What wiresizes.com collects, which services process it, the legal basis, and how to use your data protection rights.';
// "Last updated": the route's modified date in src/data/page-dates.json (D-17).
const UPDATED = pageDates('/privacy').modified;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: '/privacy'
  },
  openGraph: {
    type: 'website',
    siteName: 'WireSizes.com',
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://wiresizes.com/privacy',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function PrivacyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl space-y-6 text-lg text-gray-700 leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy notice</h1>
        <p>
          Last updated: <time dateTime={UPDATED}>{formatDate(UPDATED)}</time>
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Who is responsible</h2>
        <p>
          Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia (company registration number 9041273000, VAT
          ID SI94001154), publishes wiresizes.com and is the controller of the personal data described here.
          Contact: contact@wiresizes.com.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">What runs on this site</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Hosting (Vercel).</strong> Vercel Inc. hosts the site. To deliver pages and protect the service,
            {" Vercel's"} servers receive your IP address and the details your browser sends with each request.
          </li>
          <li>
            <strong>Vercel Web Analytics.</strong> Counts page views without cookies. Vercel identifies a visit by a
            hash created from the request and discards it after 24 hours. It records the page, the referring page,
            the country and region, the browser, the operating system and the device type.
          </li>
          <li>
            <strong>Vercel Speed Insights.</strong> Measures how fast pages load, without cookies. It records the
            page, the browser, the operating system, the device type, the network speed, the country and the timing
            values.
          </li>
          <li>
            <strong>Google Analytics 4.</strong>
            {" Google's"} analytics service, used to see which pages people read. It sets two cookies in your
            browser: <code>_ga</code>, used to distinguish users, and <code>_ga_T871GVJZE2</code>, used to keep
            session state. Both expire after 2 years. Google receives your IP address and the page details and may
            process them outside the EU. Event data is kept for the retention period set in our Google Analytics
            account. If you visit from the EU, the EEA, the UK or Switzerland, Google Analytics runs only after you
            accept it in the cookie banner. Elsewhere it runs when a page loads. You can change your choice at any
            time under &quot;Cookie settings&quot; at the bottom of every page. Your choice is stored in your browser,
            so the banner does not come back on every page.
          </li>
        </ul>
        <p>
          The site has no ads, no comments, no accounts and no contact form. If you email us, we use your message
          and address only to reply.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Legal basis</h2>
        <p>
          Hosting, Vercel Web Analytics and Speed Insights: our legitimate interest in running a working website and
          knowing which pages are read and how fast they load (Article 6(1)(f) GDPR). Google Analytics: your consent
          where the banner asks for it (Article 6(1)(a) GDPR; for the cookies, the consent rule of the Slovenian
          Electronic Communications Act, ZEKom-2), and elsewhere our legitimate interest in knowing which pages are
          read (Article 6(1)(f) GDPR). Email: replying to you (Article 6(1)(f) GDPR).
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pt-4">Your rights</h2>
        <p>
          You can ask for access to your data, correction, erasure, restriction of processing and a copy in a
          portable format, and you can object to processing based on legitimate interest. You can withdraw your
          consent to Google Analytics at any time under &quot;Cookie settings&quot;; this does not affect processing
          before the withdrawal. Write to contact@wiresizes.com. You can also complain to the Information
          Commissioner of the Republic of Slovenia (Informacijski pooblaščenec, www.ip-rs.si) or to the data
          protection authority where you live.
        </p>
      </div>
    </div>
  );
}
