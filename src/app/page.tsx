import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import {
  Calculator,
  Zap,
  ArrowRight,
  AlertTriangle,
  Cpu,
  Power,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wire Size Calculator — NEC 310.16',
  description: 'Wire size, ampacity and voltage drop calculators with AWG and NEC reference tables.',
  keywords: 'electrical calculator, wire size calculator, voltage drop, ampacity, NEC table 310.16',
  alternates: { canonical: '/' },
};

// Featured calculators organized by category
const CALCULATOR_CATEGORIES = [
  {
    title: 'Wire & Cable',
    icon: Zap,
    calculators: [
      { name: 'Wire Size Calculator', slug: 'wire-size-calculator', desc: 'Calculate AWG wire size for any circuit' },
      { name: 'Voltage Drop Calculator', slug: 'voltage-drop-calculator', desc: 'Calculate voltage drop over distance' },
      { name: 'Ampacity Calculator', slug: 'ampacity-calculator', desc: 'Find wire current carrying capacity' },
      { name: 'Ground Wire Calculator', slug: 'ground-wire-calculator', desc: 'Equipment grounding conductor size' },
      { name: 'Wire Resistance Calculator', slug: 'wire-resistance-calculator', desc: 'Calculate conductor resistance' },
    ]
  },
  {
    title: 'Load & Power',
    icon: Power,
    calculators: [
      { name: 'Watts to Amps Calculator', slug: 'watts-to-amps-calculator', desc: 'Convert watts to amperage' },
      { name: 'Amps to Watts Calculator', slug: 'amps-to-watts-calculator', desc: 'Convert amperage to watts' },
      { name: 'Volts to Amps Calculator', slug: 'volts-to-amps-calculator', desc: 'Current from power and voltage' },
      { name: 'kVA to Amps Calculator', slug: 'kva-to-amps-calculator', desc: 'Convert kilovolt-amperes to amps' },
      { name: 'Kilowatts to Amps Calculator', slug: 'kilowatts-to-amps-calculator', desc: 'Convert kilowatts to amperage' },
      { name: 'BTU to Watts Calculator', slug: 'btu-to-watts-calculator', desc: 'Convert Btu/h, watts and tons' },
      { name: "Ohm's Law Calculator", slug: 'ohms-law-calculator', desc: 'Solve for volts, amps, ohms or watts' },
    ]
  },
  {
    title: 'Specialized',
    icon: Cpu,
    calculators: [
      { name: 'Three Phase Calculator', slug: 'three-phase-calculator', desc: '3-phase power calculations' },
      { name: 'Service Entrance Calculator', slug: 'service-entrance-calculator', desc: 'Dwelling service conductors from Table 310.12' },
      { name: 'Low Voltage Calculator', slug: 'low-voltage-calculator', desc: '12 V/24 V DC applications' },
    ]
  }
];

// NEC Table 310.12 (2023), 120/240 V single-phase dwelling services (data/verified/nec-310-12.json)
const SERVICE_SIZES = [
  { service: '100 A', copper: '4 AWG', aluminum: '2 AWG' },
  { service: '125 A', copper: '2 AWG', aluminum: '1/0 AWG' },
  { service: '150 A', copper: '1 AWG', aluminum: '2/0 AWG' },
  { service: '200 A', copper: '2/0 AWG', aluminum: '4/0 AWG' },
];

// NEC Table 250.66 for the Table 310.12 conductors above (data/verified/nec-250-66.json)
const GROUNDING_CONDUCTORS = [
  { service: '100 A', copper: '8 AWG', aluminum: '6 AWG' },
  { service: '125 A', copper: '8 AWG', aluminum: '6 AWG' },
  { service: '150 A', copper: '6 AWG', aluminum: '4 AWG' },
  { service: '200 A', copper: '4 AWG', aluminum: '2 AWG' },
];

// Organization and WebSite schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://wiresizes.com/#organization",
  "name": "WireSizes.com",
  "url": "https://wiresizes.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://wiresizes.com/icon.svg",
    "width": "512",
    "height": "512"
  },
  "description": "Wire gauge charts, NEC table values and calculators for sizing conductors.",
  "sameAs": []
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://wiresizes.com/#website",
  "url": "https://wiresizes.com",
  "name": "WireSizes.com",
  "description": "Wire gauge charts, NEC table values and calculators for sizing conductors.",
  "publisher": {
    "@id": "https://wiresizes.com/#organization"
  },
  "inLanguage": "en-US"
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "url": "https://wiresizes.com",
  "name": "Electrical Calculators & Wire Sizing Tools",
  "description": "Wire size, ampacity and voltage drop calculators with AWG and NEC reference tables.",
  "isPartOf": {
    "@id": "https://wiresizes.com/#website"
  },
  "about": {
    "@type": "Thing",
    "name": "Electrical Engineering Calculators"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://wiresizes.com"
      }
    ]
  }
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {/* Compact Header */}
      <section className="bg-neutral-900 text-white py-4">
        <div className="container">
          <h1 className="text-xl sm:text-2xl font-bold">Electrical Calculators & Wire Sizing Tools</h1>
        </div>
      </section>

      {/* Featured Calculators Grid */}
      <section className="py-6 bg-neutral-50">
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900">Calculators</h2>
          </div>
          <div className="grid gap-6">
            {CALCULATOR_CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              const categoryColors: Record<string, { bg: string; border: string; accent: string }> = {
                'Wire & Cable': { bg: 'bg-blue-500', border: 'border-blue-200', accent: 'bg-blue-50' },
                'Load & Power': { bg: 'bg-green-500', border: 'border-green-200', accent: 'bg-green-50' },
                'Specialized': { bg: 'bg-orange-500', border: 'border-orange-200', accent: 'bg-orange-50' },
              };
              const colors = categoryColors[category.title] || { bg: 'bg-gray-500', border: 'border-gray-200', accent: 'bg-gray-50' };
              
              return (
                <div key={category.title} className={`bg-white border ${colors.border} rounded-lg shadow-sm overflow-hidden`}>
                  <div className={`flex items-center gap-3 px-4 py-3 ${colors.accent} border-b ${colors.border}`}>
                    <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-neutral-900">{category.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-1 p-3">
                    {category.calculators.map((calc) => (
                      <Link
                        key={calc.slug}
                        href={`/calculators/${calc.slug}`}
                        className="group block p-3 rounded-lg hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all duration-200"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <div className={`w-6 h-6 ${colors.bg} rounded flex items-center justify-center flex-shrink-0 mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity`}>
                            <Calculator className="w-3 h-3 text-white" />
                          </div>
                          <div className="font-medium text-xs text-neutral-900 leading-tight group-hover:text-neutral-800">
                            {calc.name}
                          </div>
                        </div>
                        <div className="text-xs text-neutral-500 leading-relaxed group-hover:text-neutral-600">
                          {calc.desc}
                        </div>
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-3 h-3 text-neutral-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Wire Size Lookup */}
      <section className="py-6 bg-blue-50 border-y border-blue-100">
        <div className="container">
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h2 className="font-semibold text-neutral-900 mb-3">Quick Wire Size Lookup</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
              <div className="p-2 bg-neutral-50 rounded">
                <div className="font-mono font-bold">15 A Circuit</div>
                <div className="text-neutral-600">14 AWG</div>
              </div>
              <div className="p-2 bg-neutral-50 rounded">
                <div className="font-mono font-bold">20 A Circuit</div>
                <div className="text-neutral-600">12 AWG</div>
              </div>
              <div className="p-2 bg-neutral-50 rounded">
                <div className="font-mono font-bold">30 A Circuit</div>
                <div className="text-neutral-600">10 AWG</div>
              </div>
              <div className="p-2 bg-neutral-50 rounded">
                <div className="font-mono font-bold">40 A Circuit</div>
                <div className="text-neutral-600">8 AWG</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-neutral-600">
              Copper, 60 °C column of NEC Table 310.16 (2023), 30 °C ambient, up to three current-carrying conductors.
            </p>
          </div>
        </div>
      </section>

      {/* Service Entrance and Grounding Electrode Conductors */}
      <section className="py-4 bg-neutral-50">
        <div className="container">
          <div className="grid sm:grid-cols-2 gap-3 lg:gap-4">
            {/* Service Entrance */}
            <div className="bg-white border border-neutral-200 rounded">
              <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-900 text-sm">Service Entrance</h3>
              </div>
              <div className="p-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-neutral-500">
                        <th className="text-left font-medium">Service</th>
                        <th className="text-left font-medium">Copper</th>
                        <th className="text-left font-medium">Aluminum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {SERVICE_SIZES.map((service) => (
                        <tr key={service.service}>
                          <td className="py-1 font-mono">{service.service}</td>
                          <td className="py-1 font-mono text-xs">{service.copper}</td>
                          <td className="py-1 font-mono text-xs">{service.aluminum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-neutral-600">
                  120/240 V single-phase dwelling service or main power feeder, NEC Table 310.12 (2023).
                </p>
              </div>
            </div>

            {/* Grounding Electrode Conductors */}
            <div className="bg-white border border-neutral-200 rounded">
              <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-900 text-sm">Grounding Electrode Conductors</h3>
              </div>
              <div className="p-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-neutral-500">
                        <th className="text-left font-medium">Service</th>
                        <th className="text-left font-medium">Copper GEC</th>
                        <th className="text-left font-medium">Aluminum GEC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {GROUNDING_CONDUCTORS.map((item) => (
                        <tr key={item.service}>
                          <td className="py-1 font-mono">{item.service}</td>
                          <td className="py-1 font-mono">{item.copper}</td>
                          <td className="py-1 font-mono">{item.aluminum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-neutral-600">
                  NEC Table 250.66, for the Table 310.12 conductors (values from NFPA&apos;s 2020 grounding fact sheet).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="py-4 bg-neutral-50">
        <div className="container">
          <div className="bg-white border border-neutral-200 rounded">
            <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-900 text-sm">Guides</h2>
            </div>
            <div className="p-3">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Link href="/guides/wire-size-for-100-amp" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">100 Amp Wire Size</div>
                </Link>
                <Link href="/guides/wire-size-for-200-amp" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">200 Amp Wire Size</div>
                </Link>
                <Link href="/guides/wire-size-for-ev-charger" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">EV Charging Circuits</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools & Resources */}
      <section className="py-4">
        <div className="container">
          <div className="bg-white border border-neutral-200 rounded">
            <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-900 text-sm">Charts and references</h2>
            </div>
            <div className="p-3">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Link href="/guides/awg-wire-size-chart" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">AWG Wire Chart</div>
                </Link>
                <Link href="/guides/nec-table-310-16" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">NEC Table 310.16</div>
                </Link>
                <Link href="/guides/nec-code-compliance" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">NEC Code Compliance</div>
                </Link>
                <Link href="/guides/electrical-power-calculations" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Power Calculations</div>
                </Link>
                <Link href="/guides/power-factor-explained" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Power Factor</div>
                </Link>
                <Link href="/guides/single-vs-three-phase" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Single vs Three Phase</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Disclaimer */}
      <section className="py-3 bg-amber-50 border-t border-amber-200">
        <div className="container">
          <div className="flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div className="text-amber-800">
              <strong>Disclaimer:</strong> Reference values for planning. Check them against the NEC edition your jurisdiction enforces and the equipment&apos;s instructions. The author is a physicist, not a licensed electrician or engineer.
            </div>
          </div>
        </div>
      </section>
      
      <BreadcrumbSchema url="https://wiresizes.com" />
    </>
  );
}