import type { Metadata } from 'next';
import Link from 'next/link';

// Withdrawn calculators (research/wsz002-withdrawals.csv): the URL keeps answering 200 with a dated notice,
// noindex/follow, until the tool is rebuilt from verified sources (WSZ-008 to WSZ-011).
// Copy from research/trust-pages-copy.md ("Withdrawn calculator body", "Withdrawn meta description").

const WITHDRAWN_ON = 'October 25, 2026';
const WITHDRAWN_DESCRIPTION = 'This calculator is offline while it is rebuilt from verified sources.';

// Anchor text for "Related pages" links: each target page's H1.
const PAGE_H1: Record<string, string> = {
  '/guides/nec-table-310-16': 'NEC Table 310.16 Ampacity Chart (2023 NEC)',
  '/guides/awg-wire-size-chart': 'AWG Wire Size Chart: Diameter, Area, Resistance and Ampacity',
  '/calculators/voltage-drop-calculator': 'Voltage Drop Calculator',
  '/calculators/kilowatts-to-amps-calculator': 'Kilowatts to Amps Calculator',
  '/guides/wire-size-for-100-amp': '100 Amp Wire Size Guide',
  '/calculators/ground-wire-calculator': 'Ground Wire Calculator',
};

export function withdrawnMetadata({ title, path }: { title: string; path: string }): Metadata {
  return {
    title,
    description: WITHDRAWN_DESCRIPTION,
    alternates: { canonical: path },
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description: WITHDRAWN_DESCRIPTION,
      url: `https://wiresizes.com${path}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: WITHDRAWN_DESCRIPTION,
    },
  };
}

interface WithdrawnToolProps {
  /** The page's existing H1. */
  heading: string;
  /** The what_was_wrong text of the page's row in research/wsz002-withdrawals.csv. */
  whatWasWrong: string;
  /** The row's links. */
  links: string[];
}

export function WithdrawnTool({ heading, whatWasWrong, links }: WithdrawnToolProps) {
  return (
    <div className="container py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{heading}</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          {`We took this calculator offline on ${WITHDRAWN_ON} after an audit found that ${whatWasWrong}. Until it is rebuilt, follow the equipment's installation instructions and the electrical code your jurisdiction enforces.`}
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Related pages</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          {links.map((href) => {
            const label = PAGE_H1[href];
            if (!label) throw new Error(`WithdrawnTool: no H1 recorded for ${href}`);
            return (
              <li key={href}>
                <Link data-name="" href={href} className="text-blue-600 hover:underline">
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
