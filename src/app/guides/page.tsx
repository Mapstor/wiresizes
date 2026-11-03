import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, Zap, Target, BarChart3, Table, FileText, Home, Car } from 'lucide-react';

const TITLE = 'Electrical Guides — NEC, AWG';
const DESCRIPTION = 'Guides to wire sizing, NEC ampacity tables, dwelling service sizes, voltage drop and power calculations.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: 'electrical guides, NEC compliance guide, wire sizing guide, voltage drop guide, electrical code, ampacity guide, electrical engineering',
  alternates: { canonical: '/guides' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'WireSizes.com',
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://wiresizes.com/guides',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/twitter-image'],
  },
};

// Canonical, complete list of the 9 live guides (used by both the in-page
// rendering below and the JSON-LD ItemList).
const GUIDES = [
  {
    slug: 'awg-wire-size-chart',
    title: 'AWG Wire Size Chart & Reference Guide',
    description: 'Diameter, area, resistance and ampacity by AWG size',
    icon: Table,
    color: 'blue',
  },
  {
    slug: 'nec-table-310-16',
    title: 'NEC Table 310.16',
    description: 'Copper and aluminum ampacity at 60, 75 and 90 °C',
    icon: FileText,
    color: 'green',
  },
  {
    slug: 'wire-size-for-200-amp',
    title: 'Wire Size for 200 Amp Service',
    description: 'Table 310.12 conductor sizes for a 200 A dwelling service',
    icon: Home,
    color: 'amber',
  },
  {
    slug: 'wire-size-for-100-amp',
    title: '100 Amp Wire Size Guide',
    description: 'Table 310.12 conductor sizes for a 100 A dwelling service',
    icon: Home,
    color: 'amber',
  },
  {
    slug: 'wire-size-for-ev-charger',
    title: 'EV Charger Wire Size Guide',
    description: 'Wire size for Level 2 charger circuits',
    icon: Car,
    color: 'purple',
  },
  {
    slug: 'electrical-power-calculations',
    title: 'Electrical Power Calculations',
    description: 'Master the fundamentals of electrical power, current, voltage, and energy calculations.',
    icon: Calculator,
    color: 'blue',
    topics: ['Watts, Amps, Volts Relationships', 'Power Factor Analysis', 'Single & Three Phase Systems', "Ohm's Law Applications"],
    calculators: ['amps-to-watts-calculator', 'watts-to-amps-calculator', 'ohms-law-calculator']
  },
  {
    slug: 'nec-code-compliance',
    title: 'NEC Code Compliance Guide',
    description: 'Navigate the National Electrical Code requirements for safe electrical installations with detailed code references.',
    icon: Target,
    color: 'amber',
    topics: ['Circuit Protection Requirements', 'Grounding Systems'],
    calculators: ['wire-size-calculator', 'ground-wire-calculator']
  },
  {
    slug: 'power-factor-explained',
    title: 'Power Factor Explained',
    description: 'Understanding reactive power, apparent power, and power factor correction for efficient electrical systems.',
    icon: BarChart3,
    color: 'green',
    topics: ['Real vs Apparent Power', 'Inductive & Capacitive Loads', 'Power Factor Correction', 'Energy Efficiency'],
    calculators: ['amps-to-watts-calculator', 'kva-to-amps-calculator', 'three-phase-calculator']
  },
  {
    slug: 'single-vs-three-phase',
    title: 'Single vs Three Phase Systems',
    description: 'Compare electrical distribution systems, their applications, and advantages in residential and commercial settings.',
    icon: Zap,
    color: 'purple',
    topics: ['Voltage System Configurations', 'Load Distribution Methods', 'Motor Applications', 'Power Transmission Efficiency'],
    calculators: ['three-phase-calculator', 'voltage-drop-calculator']
  },
];

const guidesCollectionSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://wiresizes.com/guides#webpage',
      url: 'https://wiresizes.com/guides',
      name: 'Electrical Guides',
      description: DESCRIPTION,
      isPartOf: { '@id': 'https://wiresizes.com/#website' },
      publisher: { '@id': 'https://wiresizes.com/#organization' },
      inLanguage: 'en-US',
      breadcrumb: { '@id': 'https://wiresizes.com/guides#breadcrumb' },
      mainEntity: { '@id': 'https://wiresizes.com/guides#guide-list' },
    },
    {
      '@type': 'ItemList',
      '@id': 'https://wiresizes.com/guides#guide-list',
      name: 'WireSizes.com electrical guides',
      numberOfItems: GUIDES.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: GUIDES.map((g, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://wiresizes.com/guides/${g.slug}`,
        name: g.title,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://wiresizes.com/guides#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wiresizes.com' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://wiresizes.com/guides' },
      ],
    },
  ],
};

export default function GuidesHomePage() {
  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guidesCollectionSchema) }}
      />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Electrical Guides
          </h1>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/guides/electrical-power-calculations"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Start Learning
            </Link>
            <Link 
              href="/calculators"
              className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Browse Calculators
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Guides Grid */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Engineering Guide Library</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {GUIDES.map((guide) => {
            const IconComponent = guide.icon;
            return (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <div className="bg-white rounded-xl border hover:shadow-lg transition-shadow p-8 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 bg-${guide.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-6 h-6 text-${guide.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  
                  {guide.topics && guide.calculators && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Topics Covered:</h4>
                        <ul className="space-y-1">
                          {guide.topics.map((topic, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Related Calculators:</h4>
                        <div className="flex flex-wrap gap-1">
                          {guide.calculators.map((calc, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {calc.replace(/-/g, ' ').replace(/calculator/g, '').trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <span className={`text-${guide.color}-600 font-medium hover:text-${guide.color}-700`}>
                      Read Guide →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick FAQ — citations, AI, and how to navigate */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions About These Guides</h2>
        <div className="space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Which NEC edition do these guides reference?</h3>
            <p className="text-sm text-slate-700">
              The guides cite the 2023 NEC unless a page names another edition. The 2026 NEC was issued by NFPA on August 20, 2025 and took effect September 9, 2025.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Are these guides authoritative for code-compliance work?</h3>
            <p className="text-sm text-slate-700">
              These guides are educational references. The authoritative
              source is the NEC document published by NFPA, available at
              nfpa.org. Local jurisdictions may adopt the current NEC
              edition with amendments (state-specific articles), or remain
              on an older edition. Always confirm with your local Authority
              Having Jurisdiction (AHJ) before installing.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">How are these guides different from each other?</h3>
            <p className="text-sm text-slate-700">
              The NEC Table 310.16 page is the
              canonical ampacity reference. The AWG wire size chart is
              the physical-properties reference (diameter, area, resistance).
              The per-amperage guides (100 A, 200 A, EV charger) are
              installation-specific. Power Calculations,
              Single-vs-Three-Phase, and Power Factor are theory references
              that support the practical guides.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}