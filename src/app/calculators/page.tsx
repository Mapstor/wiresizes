import { Metadata } from 'next';
import Link from 'next/link';
import {
  Calculator,
  Zap,
  Activity,
  AlertCircle,
  ArrowRight,
  Cpu,
  Gauge,
  Battery,
  FileText,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Electrical Calculators — NEC 2023',
  description: 'Free electrical calculators: wire size, voltage drop, ampacity.',
  keywords: [
    'electrical calculators',
    'wire size calculator',
    'voltage drop calculator',
    'ampacity calculator',
    'NEC calculators',
    'electrical engineering tools',
    'power conversion calculators',
    'three phase calculator'
  ],
  alternates: {
    canonical: '/calculators'
  },
  openGraph: {
    title: 'Electrical Calculators — NEC 2023',
    description: 'Electrical calculators for wire sizing, voltage drop, ampacity, and more.',
    url: 'https://wiresizes.com/calculators',
    siteName: 'WireSizes.com',
    locale: 'en_US',
    type: 'website',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electrical Calculators — NEC 2023',
    description: 'Electrical calculators',
    images: ['/twitter-image'],
  },
};

const calculatorCategories = [
  {
    name: 'Core Wire Sizing Tools',
    icon: Zap,
    description: 'Essential calculators for determining proper wire sizes based on current, voltage, and installation conditions',
    featured: true,
    color: 'blue',
    calculators: [
      {
        name: 'Wire Size Calculator',
        href: '/calculators/wire-size-calculator',
        desc: 'Determines wire gauge based on amperage, voltage, and distance',
      },
      {
        name: 'Voltage Drop Calculator',
        href: '/calculators/voltage-drop-calculator',
        desc: 'Calculates voltage drop percentage',
      },
      {
        name: 'Ampacity Calculator',
        href: '/calculators/ampacity-calculator',
        desc: 'Look up NEC Table 310.16 ampacity ratings with temperature and bundling adjustments',
      },
      {
        name: 'Ground Wire Size',
        href: '/calculators/ground-wire-calculator',
        desc: 'Determines equipment grounding conductor size per NEC Table 250.122',
      },
      {
        name: 'Wire Resistance Calculator',
        href: '/calculators/wire-resistance-calculator',
        desc: 'Resistance per 1000 ft and power loss',
      },
    ],
  },
  {
    name: 'Power Conversions',
    icon: Calculator,
    description: 'Convert between electrical units - watts, amps, volts, kilowatts, horsepower, and more',
    featured: true,
    color: 'green',
    calculators: [
      {
        name: 'Watts to Amps',
        href: '/calculators/watts-to-amps-calculator',
        desc: 'Convert power in watts to current in amps for any voltage',
      },
      {
        name: 'Amps to Watts',
        href: '/calculators/amps-to-watts-calculator',
        desc: 'Convert current in amps to power in watts',
      },
      {
        name: 'Volts to Amps Calculator',
        href: '/calculators/volts-to-amps-calculator',
        desc: 'Current from power and voltage',
      },
      {
        name: 'Ohm\'s Law Calculator',
        href: '/calculators/ohms-law-calculator',
        desc: 'Complete Ohm\'s Law and power calculations - solve for V, I, R, or P',
      },
      {
        name: 'kW to Amps',
        href: '/calculators/kilowatts-to-amps-calculator',
        desc: 'Convert kilowatts to amps',
      },
      {
        name: 'kVA to Amps Calculator',
        href: '/calculators/kva-to-amps-calculator',
        desc: 'Convert kVA to amps',
      },
      {
        name: 'BTU to Watts Calculator',
        href: '/calculators/btu-to-watts-calculator',
        desc: 'Convert Btu/h, watts and tons',
      },
    ],
  },
  {
    name: 'Advanced Calculators',
    icon: Cpu,
    color: 'orange',
    calculators: [
      {
        name: 'Three Phase Calculator',
        href: '/calculators/three-phase-calculator',
        desc: 'Three-phase power and current calculations',
      },
      {
        name: 'Service Entrance Calculator',
        href: '/calculators/service-entrance-calculator',
        desc: 'Size service entrance conductors',
      },
      {
        name: 'Low Voltage Calculator',
        href: '/calculators/low-voltage-calculator',
        desc: '12 V and 24 V DC wire size',
      },
    ],
  },
];

const featuredTools = [
  {
    title: 'Quick Convert',
    icon: Activity,
    href: '/calculators/watts-to-amps-calculator',
    description: 'Watts to Amps - Instant power to current conversion',
    cta: 'Open Calculator',
    color: 'green'
  },
  {
    title: 'EV Ready',
    icon: Battery,
    href: '/guides/wire-size-for-ev-charger',
    description: 'EV Charger Sizing - Level 2 charger installations',
    cta: 'Read the guide',
    color: 'orange'
  }
];

// Canonical, complete inventory of the 15 live calculators (used by the
// JSON-LD ItemList below). The card grid above shows the same 15.
const ALL_CALCULATORS = [
  { slug: 'wire-size-calculator', name: 'Wire Size Calculator' },
  { slug: 'voltage-drop-calculator', name: 'Voltage Drop Calculator' },
  { slug: 'ampacity-calculator', name: 'Ampacity Calculator' },
  { slug: 'ground-wire-calculator', name: 'Ground Wire Calculator' },
  { slug: 'wire-resistance-calculator', name: 'Wire Resistance Calculator' },
  { slug: 'watts-to-amps-calculator', name: 'Watts to Amps Calculator' },
  { slug: 'amps-to-watts-calculator', name: 'Amps to Watts Calculator' },
  { slug: 'volts-to-amps-calculator', name: 'Volts to Amps Calculator' },
  { slug: 'kilowatts-to-amps-calculator', name: 'Kilowatts to Amps Calculator' },
  { slug: 'kva-to-amps-calculator', name: 'kVA to Amps Calculator' },
  { slug: 'btu-to-watts-calculator', name: 'BTU to Watts Calculator' },
  { slug: 'ohms-law-calculator', name: 'Ohm’s Law Calculator' },
  { slug: 'service-entrance-calculator', name: 'Service Entrance Calculator' },
  { slug: 'three-phase-calculator', name: 'Three Phase Calculator' },
  { slug: 'low-voltage-calculator', name: 'Low Voltage Calculator' },
];

const calculatorsCollectionSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://wiresizes.com/calculators#webpage',
      url: 'https://wiresizes.com/calculators',
      name: 'Electrical Calculators',
      description: 'Electrical calculators for wire sizing, voltage drop and ampacity.',
      isPartOf: { '@id': 'https://wiresizes.com/#website' },
      publisher: { '@id': 'https://wiresizes.com/#organization' },
      inLanguage: 'en-US',
      breadcrumb: { '@id': 'https://wiresizes.com/calculators#breadcrumb' },
      mainEntity: { '@id': 'https://wiresizes.com/calculators#calculator-list' },
    },
    {
      '@type': 'ItemList',
      '@id': 'https://wiresizes.com/calculators#calculator-list',
      name: 'WireSizes.com electrical calculators',
      numberOfItems: ALL_CALCULATORS.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: ALL_CALCULATORS.map((calc, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://wiresizes.com/calculators/${calc.slug}`,
        name: calc.name,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://wiresizes.com/calculators#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wiresizes.com' },
        { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://wiresizes.com/calculators' },
      ],
    },
  ],
};

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-neutral-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorsCollectionSchema) }}
      />
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Electrical Calculators
            </h1>
          </div>
        </div>

        {/* Featured Tools */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quick Access Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.map((tool, index) => (
              <Link
                key={index}
                href={tool.href}
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-${tool.color}-100 text-${tool.color}-600 rounded-lg mb-4`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-sm text-gray-600">{tool.description}</p>
                <div className="flex items-center gap-1 mt-3 text-blue-600 group-hover:gap-2 transition-all">
                  <span className="text-sm font-medium">{tool.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Professional Notice */}
        <div className="mb-12">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Professional Use Notice</h3>
                <p className="text-amber-800">
                  All calculators provide reference values based on NEC 2023 standards. Results must be verified by 
                  licensed electrical professionals before implementation. Local codes may have more restrictive requirements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator Categories */}
        <div className="space-y-16">
          {calculatorCategories.map((category) => (
            <div key={category.name}>
              {/* Category Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                    <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {category.name}
                  </h2>
                  {category.featured && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      FEATURED
                    </span>
                  )}
                </div>
                {category.description && <p className="text-gray-600 max-w-3xl">{category.description}</p>}
              </div>

              {/* Calculator Cards */}
              <div className="grid lg:grid-cols-2 gap-6">
                {category.calculators.map((calc) => (
                  <div
                    key={calc.href}
                    className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group"
                  >
                    <Link href={calc.href} className="block p-6">
                      {/* Calculator Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {calc.name}
                          </h3>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {calc.desc}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/guides" className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <FileText className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Wire Sizing Guides</h3>
              <p className="text-sm text-gray-600 mb-3">
                Comprehensive guides for common wire sizing scenarios and installations
              </p>
              <span className="text-blue-600 text-sm font-medium">View All Guides →</span>
            </Link>
            
            <Link href="/guides/nec-table-310-16" className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <Gauge className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">NEC Ampacity Tables</h3>
              <p className="text-sm text-gray-600 mb-3">
                Complete NEC Table 310.16 ampacity ratings with temperature corrections
              </p>
              <span className="text-green-600 text-sm font-medium">View Tables →</span>
            </Link>

          </div>
        </div>

      </div>
      
    </div>
  );
}