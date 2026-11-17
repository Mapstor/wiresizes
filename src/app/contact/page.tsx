import type { Metadata } from 'next';
import { BasicPageSchema } from '@/components/seo/BasicPageSchema';
import { PageTitle } from '@/components/look/PageTitle';
import { LOOK_LINK, LOOK_PAGE } from '@/components/look/styles';

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
    <div className={LOOK_PAGE}>
    <div className="container pb-16">
      <header className="pt-10 sm:pt-12">
        <PageTitle main="Contact" />
      </header>
      <div className="mt-10 max-w-[35rem] space-y-6 text-[17px] leading-[1.65] text-ink">
        <p>
          Email{' '}
          <a href="mailto:info@wiresizes.com" className={LOOK_LINK}>
            info@wiresizes.com
          </a>{' '}
          for corrections, questions about a page, or privacy requests. One person runs this site, so a reply can
          take a few days.
        </p>
        <p>
          For an electrical emergency, call{' '}
          <a href="tel:911" className={LOOK_LINK}>
            911
          </a>{' '}
          or your electric utility. This site cannot give advice about a specific installation.
        </p>
        <address className="not-italic">
          Publisher: Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia. Company registration number
          9041273000, VAT ID SI94001154.
        </address>
      </div>
      <BasicPageSchema path="/contact" name={TITLE} description={DESCRIPTION} />
    </div>
    </div>
  );
}
