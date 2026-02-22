import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, 
  Zap, 
  ArrowRight, 
  AlertTriangle,
  FileText,
  Settings,
  Home,
  Car,
  Waves,
  Cpu,
  Power,
  Wrench,
  Building,
  Plug,
  CheckCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Electrical Calculators | Wire Size, Voltage Drop, Ampacity | WireSizes.com',
  description: 'Professional electrical calculators: wire size, voltage drop, ampacity, load calculations. NEC code compliant. 30+ free tools for electricians and contractors.',
  keywords: 'electrical calculator, wire size calculator, voltage drop, ampacity, NEC table 310.16, electrical load calculator',
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
      { name: 'kVA to Amps Calculator', slug: 'kva-to-amps-calculator', desc: 'Convert kilovolt-amperes to amps' },
      { name: 'Kilowatts to Amps Calculator', slug: 'kilowatts-to-amps-calculator', desc: 'Convert kilowatts to amperage' },
      { name: 'Horsepower to Amps Calculator', slug: 'horsepower-to-amps-calculator', desc: 'Motor amperage calculations' },
      { name: 'BTU to Watts Calculator', slug: 'btu-to-watts-calculator', desc: 'Convert BTU to electrical watts' },
    ]
  },
  {
    title: 'Equipment Sizing',
    icon: Settings,
    calculators: [
      { name: 'EV Charger Calculator', slug: 'ev-charger-calculator', desc: 'Electric vehicle charging circuit' },
      { name: 'Hot Tub Calculator', slug: 'hot-tub-calculator', desc: 'Spa electrical requirements' },
      { name: 'Air Conditioner Calculator', slug: 'air-conditioner-calculator', desc: 'AC unit wire sizing' },
      { name: 'Dryer Calculator', slug: 'dryer-calculator', desc: 'Electric dryer circuit sizing' },
      { name: 'Range Calculator', slug: 'range-calculator', desc: 'Electric range wire size' },
      { name: 'Welder Calculator', slug: 'welder-calculator', desc: 'Welding equipment circuits' },
    ]
  },
  {
    title: 'Specialized',
    icon: Cpu,
    calculators: [
      { name: 'Three Phase Calculator', slug: 'three-phase-calculator', desc: '3-phase power calculations' },
      { name: 'Low Voltage Calculator', slug: 'low-voltage-calculator', desc: '12V/24V DC applications' },
      { name: 'Pool Pump Calculator', slug: 'pool-pump-calculator', desc: 'Swimming pool pump circuits' },
      { name: 'Well Pump Calculator', slug: 'well-pump-calculator', desc: 'Water well pump sizing' },
      { name: 'RV Hookup Calculator', slug: 'rv-hookup-calculator', desc: 'RV electrical service' },
      { name: 'Garage Subpanel Calculator', slug: 'garage-subpanel-calculator', desc: 'Detached garage feeders' },
    ]
  }
];

// Quick reference data - compact tables
const COMMON_WIRE_SIZES = [
  { awg: '14', amps: '15A', use: 'Lights' },
  { awg: '12', amps: '20A', use: 'Outlets' },
  { awg: '10', amps: '30A', use: 'Dryer' },
  { awg: '8', amps: '40A', use: 'Range' },
  { awg: '6', amps: '50A', use: 'Hot Tub' },
  { awg: '4', amps: '70A', use: '100A Panel' },
];

const SERVICE_SIZES = [
  { service: '100A', copper: '4 AWG', aluminum: '2 AWG' },
  { service: '125A', copper: '2 AWG', aluminum: '1/0 AWG' },
  { service: '150A', copper: '1/0 AWG', aluminum: '2/0 AWG' },
  { service: '200A', copper: '2/0 AWG', aluminum: '4/0 AWG' },
];

const VOLTAGE_DROP_LIMITS = [
  { circuit: 'Branch', limit: '3%', reference: 'NEC 210.19' },
  { circuit: 'Feeder', limit: '5%', reference: 'NEC 215.2' },
  { circuit: 'Total', limit: '5%', reference: 'Combined' },
];

// NEC Table 310.16 - Complete Reference Data
const NEC_TABLE_310_16 = [
  { awg: '14', ampacity: 20, breaker: 15, circular_mils: 4110, resistance: 3.07 },
  { awg: '12', ampacity: 25, breaker: 20, circular_mils: 6530, resistance: 1.93 },
  { awg: '10', ampacity: 35, breaker: 30, circular_mils: 10380, resistance: 1.21 },
  { awg: '8', ampacity: 50, breaker: 40, circular_mils: 16510, resistance: 0.764 },
  { awg: '6', ampacity: 65, breaker: 50, circular_mils: 26240, resistance: 0.491 },
  { awg: '4', ampacity: 85, breaker: 70, circular_mils: 41740, resistance: 0.308 },
  { awg: '3', ampacity: 100, breaker: 90, circular_mils: 52620, resistance: 0.245 },
  { awg: '2', ampacity: 115, breaker: 100, circular_mils: 66360, resistance: 0.194 },
  { awg: '1/0', ampacity: 150, breaker: 125, circular_mils: 105600, resistance: 0.122 },
  { awg: '2/0', ampacity: 175, breaker: 150, circular_mils: 133100, resistance: 0.0967 },
  { awg: '3/0', ampacity: 200, breaker: 175, circular_mils: 167800, resistance: 0.0766 },
  { awg: '4/0', ampacity: 230, breaker: 200, circular_mils: 211600, resistance: 0.0608 },
];

// Equipment Load Requirements
const EQUIPMENT_LOADS = [
  { equipment: 'Electric Range', load: '8.75 kW', breaker: '40A', wire: '8 AWG' },
  { equipment: 'Electric Dryer', load: '5.5 kW', breaker: '30A', wire: '10 AWG' },
  { equipment: 'Hot Water Heater', load: '4.5 kW', breaker: '25A', wire: '12 AWG' },
  { equipment: 'Central AC (3 ton)', load: '7.2 kW', breaker: '35A', wire: '8 AWG' },
  { equipment: 'EV Charger (Level 2)', load: '7.7 kW', breaker: '40A', wire: '8 AWG' },
  { equipment: 'Hot Tub/Spa', load: '6-8 kW', breaker: '30-40A', wire: '8-10 AWG' },
];

// Conduit Fill Percentages
const CONDUIT_FILL = [
  { conductors: '1', fill: '53%' },
  { conductors: '2', fill: '31%' },
  { conductors: '3+', fill: '40%' },
];

// Wire Pricing Comparison (per foot estimates)
const WIRE_COSTS = [
  { awg: '12 AWG', copper: '$0.85/ft', aluminum: '$0.45/ft', savings: '47%' },
  { awg: '10 AWG', copper: '$1.20/ft', aluminum: '$0.65/ft', savings: '46%' },
  { awg: '8 AWG', copper: '$2.10/ft', aluminum: '$0.95/ft', savings: '55%' },
  { awg: '6 AWG', copper: '$3.80/ft', aluminum: '$1.65/ft', savings: '57%' },
  { awg: '4 AWG', copper: '$6.20/ft', aluminum: '$2.45/ft', savings: '60%' },
];

// Grounding Electrode Conductor Sizing
const GROUNDING_CONDUCTORS = [
  { service: '100A', copper: '#8 AWG', aluminum: '#6 AWG' },
  { service: '125A', copper: '#8 AWG', aluminum: '#6 AWG' },
  { service: '150A', copper: '#6 AWG', aluminum: '#4 AWG' },
  { service: '200A', copper: '#4 AWG', aluminum: '#2 AWG' },
];

// Motor Full Load Current (Single Phase)
const MOTOR_FLA = [
  { hp: '1/4', amps_115v: 5.8, amps_230v: 2.9 },
  { hp: '1/3', amps_115v: 7.2, amps_230v: 3.6 },
  { hp: '1/2', amps_115v: 9.8, amps_230v: 4.9 },
  { hp: '3/4', amps_115v: 13.8, amps_230v: 6.9 },
  { hp: '1', amps_115v: 16, amps_230v: 8 },
  { hp: '1.5', amps_115v: 20, amps_230v: 10 },
  { hp: '2', amps_115v: 24, amps_230v: 12 },
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
  "description": "Professional electrical calculators and wire sizing tools. NEC compliant calculations for electricians and contractors.",
  "sameAs": [],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Technical Support",
    "email": "support@wiresizes.com"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://wiresizes.com/#website",
  "url": "https://wiresizes.com",
  "name": "WireSizes.com",
  "description": "Professional electrical calculators and wire sizing tools",
  "publisher": {
    "@id": "https://wiresizes.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://wiresizes.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "en-US"
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "url": "https://wiresizes.com",
  "name": "Electrical Calculators & Wire Sizing Tools",
  "description": "Professional NEC-compliant electrical calculators: wire size, voltage drop, ampacity, load calculations. 30+ free tools for electricians and contractors.",
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
          <h1 className="text-2xl font-bold mb-2">Electrical Calculators & Wire Sizing Tools</h1>
          <p className="text-neutral-300 text-sm">
            Professional NEC-compliant calculators for electricians, contractors & engineers. 30+ free tools.
          </p>
        </div>
      </section>

      {/* Site Introduction */}
      <section className="py-8 bg-gradient-to-br from-blue-50 via-white to-green-50 border-b border-neutral-200">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Professional Electrical Engineering Tools</h2>
                    <div className="text-sm text-blue-600 font-semibold">NEC Code Compliant • Industry Standard</div>
                  </div>
                </div>
                <div className="space-y-4 text-neutral-700">
                  <p className="text-lg leading-relaxed">
                    <strong>Calculate with confidence.</strong> Our professional-grade tools eliminate guesswork in electrical design. 
                    From wire sizing to voltage drop analysis, every calculation follows NEC standards and includes detailed explanations.
                  </p>
                  <p className="leading-relaxed">
                    Whether you're sizing conductors for a 200A service, calculating motor circuits, or designing EV charging infrastructure, 
                    our calculators provide instant, code-compliant results with professional documentation.
                  </p>
                </div>
                <div className="flex items-center gap-6 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">30+</div>
                    <div className="text-xs text-neutral-600">Calculators</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">NEC</div>
                    <div className="text-xs text-neutral-600">Compliant</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">FREE</div>
                    <div className="text-xs text-neutral-600">Professional</div>
                  </div>
                </div>
              </div>
              <div className="lg:text-right">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">Table 310.16 Conductor Ampacities</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">Voltage Drop Compensation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">Continuous Load Derating</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">Grounding Requirements</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200">
                      <div className="text-xs text-neutral-500 text-center">
                        Trusted by electricians, contractors & engineers
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Calculators Grid */}
      <section className="py-6 bg-neutral-50">
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Professional Calculation Tools</h2>
            <p className="text-neutral-600">Choose from our comprehensive suite of NEC-compliant electrical calculators</p>
          </div>
          <div className="grid gap-6">
            {CALCULATOR_CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              const categoryColors: Record<string, { bg: string; border: string; accent: string }> = {
                'Wire & Cable': { bg: 'bg-blue-500', border: 'border-blue-200', accent: 'bg-blue-50' },
                'Load & Power': { bg: 'bg-green-500', border: 'border-green-200', accent: 'bg-green-50' },
                'Equipment Sizing': { bg: 'bg-purple-500', border: 'border-purple-200', accent: 'bg-purple-50' },
                'Specialized': { bg: 'bg-orange-500', border: 'border-orange-200', accent: 'bg-orange-50' },
              };
              const colors = categoryColors[category.title] || { bg: 'bg-gray-500', border: 'border-gray-200', accent: 'bg-gray-50' };
              
              return (
                <div key={category.title} className={`bg-white border ${colors.border} rounded-lg shadow-sm overflow-hidden`}>
                  <div className={`flex items-center gap-3 px-4 py-3 ${colors.accent} border-b ${colors.border}`}>
                    <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">{category.title}</h3>
                      <p className="text-xs text-neutral-600">{category.calculators.length} professional tools</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 p-3">
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

      {/* Hero Content - Wire Sizing Tutorial */}
      <section className="py-6 bg-blue-50 border-y border-blue-100">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Wire Sizing Made Simple</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-neutral-700 mb-4">
                  Proper wire sizing prevents fires, voltage drop, and code violations. Follow these professional steps:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <strong>Calculate Load:</strong> Determine actual amperage draw of connected equipment
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <strong>Apply Safety Factor:</strong> Multiply by 1.25 for continuous loads (NEC 210.19)
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <strong>Check Distance:</strong> Calculate voltage drop for runs over 50 feet
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    <div>
                      <strong>Select Wire Size:</strong> Choose larger of ampacity or voltage drop requirement
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-neutral-900 mb-3">Quick Wire Size Lookup</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2 bg-neutral-50 rounded">
                  <div className="font-mono font-bold">15A Circuit</div>
                  <div className="text-neutral-600">#14 AWG</div>
                  <div className="text-neutral-500">Lights, small outlets</div>
                </div>
                <div className="p-2 bg-neutral-50 rounded">
                  <div className="font-mono font-bold">20A Circuit</div>
                  <div className="text-neutral-600">#12 AWG</div>
                  <div className="text-neutral-500">General outlets</div>
                </div>
                <div className="p-2 bg-neutral-50 rounded">
                  <div className="font-mono font-bold">30A Circuit</div>
                  <div className="text-neutral-600">#10 AWG</div>
                  <div className="text-neutral-500">Dryer, window AC</div>
                </div>
                <div className="p-2 bg-neutral-50 rounded">
                  <div className="font-mono font-bold">40A Circuit</div>
                  <div className="text-neutral-600">#8 AWG</div>
                  <div className="text-neutral-500">Range, large AC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Electrical Mistakes */}
      <section className="py-6 bg-red-50 border-y border-red-100">
        <div className="container">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">⚠️ Common Wire Sizing Mistakes to Avoid</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <div className="text-red-600 font-semibold mb-2">Undersized Wire</div>
              <div className="text-sm text-neutral-700">
                Using #14 AWG for 20A circuits. Always match wire to breaker size per NEC Table 310.16.
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <div className="text-red-600 font-semibold mb-2">Ignoring Voltage Drop</div>
              <div className="text-sm text-neutral-700">
                Long runs need larger wire. 3% drop max for branch circuits, 5% for feeders.
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <div className="text-red-600 font-semibold mb-2">Wrong Breaker Size</div>
              <div className="text-sm text-neutral-700">
                Breaker must not exceed wire ampacity. #12 AWG = 20A max, #14 AWG = 15A max.
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <div className="text-red-600 font-semibold mb-2">Incorrect Grounding</div>
              <div className="text-sm text-neutral-700">
                Ground wire must match circuit. Use NEC Table 250.122 for equipment grounding.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Compliance Checklist */}
      <section className="py-6 bg-green-50 border-y border-green-100">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-4">✅ Code Compliance Checklist</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-600 text-white rounded flex items-center justify-center text-xs mt-0.5">✓</div>
                  <div>
                    <div className="font-semibold text-sm">Wire Ampacity Verification</div>
                    <div className="text-xs text-neutral-600">Check NEC Table 310.16 for correct ampacity rating</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-600 text-white rounded flex items-center justify-center text-xs mt-0.5">✓</div>
                  <div>
                    <div className="font-semibold text-sm">Voltage Drop Calculation</div>
                    <div className="text-xs text-neutral-600">Maximum 3% for branch circuits, 5% for feeders</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-600 text-white rounded flex items-center justify-center text-xs mt-0.5">✓</div>
                  <div>
                    <div className="font-semibold text-sm">Breaker Coordination</div>
                    <div className="text-xs text-neutral-600">Breaker rating must not exceed wire ampacity</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-600 text-white rounded flex items-center justify-center text-xs mt-0.5">✓</div>
                  <div>
                    <div className="font-semibold text-sm">Grounding Requirements</div>
                    <div className="text-xs text-neutral-600">Equipment grounding conductor per NEC 250.122</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-600 text-white rounded flex items-center justify-center text-xs mt-0.5">✓</div>
                  <div>
                    <div className="font-semibold text-sm">Conduit Fill Limits</div>
                    <div className="text-xs text-neutral-600">Maximum 40% fill for 3+ conductors (NEC Chapter 9)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-600 text-white rounded flex items-center justify-center text-xs mt-0.5">✓</div>
                  <div>
                    <div className="font-semibold text-sm">Temperature Rating</div>
                    <div className="text-xs text-neutral-600">Match wire and termination temperature ratings</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-neutral-900 mb-3">Inspector's Focus Areas</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Wire size vs breaker rating</span>
                  <span className="text-red-600 font-mono">Critical</span>
                </div>
                <div className="flex justify-between">
                  <span>Grounding continuity</span>
                  <span className="text-red-600 font-mono">Critical</span>
                </div>
                <div className="flex justify-between">
                  <span>Voltage drop compliance</span>
                  <span className="text-amber-600 font-mono">Important</span>
                </div>
                <div className="flex justify-between">
                  <span>Conduit fill percentage</span>
                  <span className="text-amber-600 font-mono">Important</span>
                </div>
                <div className="flex justify-between">
                  <span>Box fill calculation</span>
                  <span className="text-blue-600 font-mono">Standard</span>
                </div>
                <div className="flex justify-between">
                  <span>Wire labeling/marking</span>
                  <span className="text-blue-600 font-mono">Standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Wire Size Comparison */}
      <section className="py-6 bg-neutral-50 border-y border-neutral-200">
        <div className="container">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Wire Size Visual Comparison</h2>
          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { awg: '14', diameter: '12px', color: '#8B5CF6' },
                { awg: '12', diameter: '16px', color: '#3B82F6' },
                { awg: '10', diameter: '20px', color: '#10B981' },
                { awg: '8', diameter: '24px', color: '#F59E0B' },
                { awg: '6', diameter: '28px', color: '#EF4444' },
                { awg: '4', diameter: '32px', color: '#6366F1' },
              ].map((wire) => (
                <div key={wire.awg} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div 
                      className="rounded-full border-2 border-neutral-300"
                      style={{
                        width: wire.diameter,
                        height: wire.diameter,
                        backgroundColor: wire.color,
                      }}
                    />
                  </div>
                  <div className="font-mono font-bold text-sm">#{wire.awg} AWG</div>
                  <div className="text-xs text-neutral-500">{wire.diameter.replace('px', '')}mm</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-neutral-600 text-center">
              Approximate wire diameters for copper THWN conductors (not to scale)
            </div>
          </div>
        </div>
      </section>

      {/* Quick Reference Tables - Horizontal Layout */}
      <section className="py-4 bg-neutral-50">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Common Wire Sizes */}
            <div className="bg-white border border-neutral-200 rounded">
              <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-900 text-sm">Common Wire Sizes</h3>
              </div>
              <div className="p-2">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-neutral-500">
                      <th className="text-left font-medium">AWG</th>
                      <th className="text-left font-medium">Amps</th>
                      <th className="text-left font-medium">Use</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {COMMON_WIRE_SIZES.map((wire) => (
                      <tr key={wire.awg}>
                        <td className="py-1 font-mono">{wire.awg}</td>
                        <td className="py-1 font-mono">{wire.amps}</td>
                        <td className="py-1 text-neutral-600">{wire.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Service Entrance */}
            <div className="bg-white border border-neutral-200 rounded">
              <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-900 text-sm">Service Entrance</h3>
              </div>
              <div className="p-2">
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
            </div>

            {/* Voltage Drop Limits */}
            <div className="bg-white border border-neutral-200 rounded">
              <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-900 text-sm">Voltage Drop Limits</h3>
              </div>
              <div className="p-2">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-neutral-500">
                      <th className="text-left font-medium">Circuit</th>
                      <th className="text-left font-medium">Limit</th>
                      <th className="text-left font-medium">NEC Ref</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {VOLTAGE_DROP_LIMITS.map((limit) => (
                      <tr key={limit.circuit}>
                        <td className="py-1">{limit.circuit}</td>
                        <td className="py-1 font-mono">{limit.limit}</td>
                        <td className="py-1 text-neutral-500 text-xs">{limit.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEC Articles Quick Reference */}
      <section className="py-4">
        <div className="container">
          <div className="bg-white border border-neutral-200 rounded">
            <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-900 text-sm">NEC Code References</h2>
            </div>
            <div className="p-3">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="font-medium text-neutral-900">Article 310</div>
                  <div className="text-neutral-500">Conductors for general wiring</div>
                </div>
                <div>
                  <div className="font-medium text-neutral-900">Article 210</div>
                  <div className="text-neutral-500">Branch circuits</div>
                </div>
                <div>
                  <div className="font-medium text-neutral-900">Article 215</div>
                  <div className="text-neutral-500">Feeders</div>
                </div>
                <div>
                  <div className="font-medium text-neutral-900">Article 220</div>
                  <div className="text-neutral-500">Load calculations</div>
                </div>
                <div>
                  <div className="font-medium text-neutral-900">Article 250</div>
                  <div className="text-neutral-500">Grounding & bonding</div>
                </div>
                <div>
                  <div className="font-medium text-neutral-900">Article 430</div>
                  <div className="text-neutral-500">Motors & motor circuits</div>
                </div>
                <div>
                  <div className="font-medium text-neutral-900">Table 310.16</div>
                  <div className="text-neutral-500">Copper conductor ampacities</div>
                </div>
                <div>
                  <div className="font-medium text-neutral-900">Table 310.17</div>
                  <div className="text-neutral-500">Aluminum conductor ampacities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete NEC Table 310.16 */}
      <section className="py-4 bg-neutral-50">
        <div className="container">
          <div className="bg-white border border-neutral-200 rounded">
            <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-900 text-sm">NEC Table 310.16 - Complete Copper Conductor Data (75°C)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="px-3 py-2 text-left font-medium">AWG</th>
                    <th className="px-3 py-2 text-left font-medium">Ampacity</th>
                    <th className="px-3 py-2 text-left font-medium">Breaker</th>
                    <th className="px-3 py-2 text-left font-medium">CM</th>
                    <th className="px-3 py-2 text-left font-medium">Resistance (Ω/1000ft)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {NEC_TABLE_310_16.map((row) => (
                    <tr key={row.awg} className="hover:bg-neutral-50">
                      <td className="px-3 py-2 font-mono">{row.awg}</td>
                      <td className="px-3 py-2 font-mono">{row.ampacity}A</td>
                      <td className="px-3 py-2 font-mono">{row.breaker}A</td>
                      <td className="px-3 py-2 font-mono">{row.circular_mils.toLocaleString()}</td>
                      <td className="px-3 py-2 font-mono">{row.resistance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* NEC Article Summaries - Authority Content */}
      <section className="py-6 bg-blue-50 border-y border-blue-100">
        <div className="container">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">NEC Article Summaries - Essential Code Knowledge</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Article 310 - Conductors</h3>
              <div className="text-sm text-neutral-700 space-y-2">
                <p><strong>Table 310.16:</strong> Copper conductor ampacities at 75°C</p>
                <p><strong>Table 310.17:</strong> Aluminum conductor ampacities</p>
                <p><strong>Derating factors:</strong> Temperature and fill adjustments</p>
                <p><strong>Key requirement:</strong> Must not exceed 90% of ampacity for continuous loads</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Article 210 - Branch Circuits</h3>
              <div className="text-sm text-neutral-700 space-y-2">
                <p><strong>15A circuits:</strong> #14 AWG minimum, lighting and small appliances</p>
                <p><strong>20A circuits:</strong> #12 AWG minimum, general purpose outlets</p>
                <p><strong>Continuous loads:</strong> 125% safety factor required</p>
                <p><strong>Voltage drop:</strong> 3% maximum recommended</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Article 215 - Feeders</h3>
              <div className="text-sm text-neutral-700 space-y-2">
                <p><strong>Sizing:</strong> Based on calculated load per Article 220</p>
                <p><strong>Voltage drop:</strong> 5% maximum for feeder circuits</p>
                <p><strong>Grounding:</strong> Equipment grounding conductor required</p>
                <p><strong>Protection:</strong> Must have overcurrent protection</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Article 220 - Load Calculations</h3>
              <div className="text-sm text-neutral-700 space-y-2">
                <p><strong>General lighting:</strong> 3 VA per sq ft residential</p>
                <p><strong>Small appliances:</strong> 1500 VA per circuit minimum</p>
                <p><strong>Large appliances:</strong> Nameplate rating or standard loads</p>
                <p><strong>Demand factors:</strong> Applied to total calculated load</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Article 250 - Grounding</h3>
              <div className="text-sm text-neutral-700 space-y-2">
                <p><strong>Table 250.122:</strong> Equipment grounding conductor sizes</p>
                <p><strong>Grounding electrode:</strong> Connection to earth ground system</p>
                <p><strong>Bonding:</strong> Connecting metal parts to eliminate voltage differences</p>
                <p><strong>GEC sizing:</strong> Based on service conductor size</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Article 430 - Motors</h3>
              <div className="text-sm text-neutral-700 space-y-2">
                <p><strong>Conductor sizing:</strong> 125% of motor full load current</p>
                <p><strong>Overload protection:</strong> 115-125% of motor FLC</p>
                <p><strong>Short circuit protection:</strong> Based on motor type and starting method</p>
                <p><strong>Disconnect:</strong> Must be within sight of motor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Analysis & Material Comparison */}
      <section className="py-6 bg-amber-50 border-y border-amber-100">
        <div className="container">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">💰 Wire Cost Analysis & Material Selection</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">Copper vs Aluminum Cost Comparison</h3>
              <div className="bg-white p-4 rounded-lg border border-amber-200">
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-4 gap-2 font-semibold text-neutral-600 border-b border-neutral-200 pb-2">
                    <div>Size</div>
                    <div>Copper</div>
                    <div>Aluminum</div>
                    <div>Savings</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="font-mono">#8 AWG</div>
                    <div className="text-copper-600 font-mono">$2.10/ft</div>
                    <div className="text-aluminum-600 font-mono">$0.95/ft</div>
                    <div className="text-green-600 font-mono">55%</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="font-mono">#6 AWG</div>
                    <div className="text-copper-600 font-mono">$3.80/ft</div>
                    <div className="text-aluminum-600 font-mono">$1.65/ft</div>
                    <div className="text-green-600 font-mono">57%</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="font-mono">#4 AWG</div>
                    <div className="text-copper-600 font-mono">$6.20/ft</div>
                    <div className="text-aluminum-600 font-mono">$2.45/ft</div>
                    <div className="text-green-600 font-mono">60%</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="font-mono">2/0 AWG</div>
                    <div className="text-copper-600 font-mono">$12.50/ft</div>
                    <div className="text-aluminum-600 font-mono">$4.80/ft</div>
                    <div className="text-green-600 font-mono">62%</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-100 rounded text-xs text-amber-800">
                  <strong>Note:</strong> Prices are estimates and vary by supplier, quantity, and market conditions. Always verify current pricing.
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">Installation Considerations</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-copper-600 mb-2">Copper Advantages</h4>
                  <ul className="text-sm text-neutral-700 space-y-1">
                    <li>• Superior conductivity and ampacity</li>
                    <li>• Easier termination and splicing</li>
                    <li>• More compact installation</li>
                    <li>• Better long-term reliability</li>
                    <li>• Higher resale/scrap value</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-aluminum-600 mb-2">Aluminum Considerations</h4>
                  <ul className="text-sm text-neutral-700 space-y-1">
                    <li>• 30-60% cost savings on material</li>
                    <li>• Requires larger wire sizes</li>
                    <li>• Special termination requirements</li>
                    <li>• More conduit space needed</li>
                    <li>• Must use AL-rated devices</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting & Problem Solving */}
      <section className="py-6 bg-purple-50 border-y border-purple-100">
        <div className="container">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">🔧 Troubleshooting Common Wire Sizing Problems</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">Problem: Excessive Voltage Drop</h3>
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-red-600">Symptoms:</strong>
                    <ul className="mt-1 text-neutral-700">
                      <li>• Lights dimming when motors start</li>
                      <li>• Motors running hot or slow</li>
                      <li>• Voltage readings below nominal</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-blue-600">Causes:</strong>
                    <ul className="mt-1 text-neutral-700">
                      <li>• Wire too small for distance</li>
                      <li>• Poor connections at terminations</li>
                      <li>• Undersized service conductors</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-green-600">Solutions:</strong>
                    <ul className="mt-1 text-neutral-700">
                      <li>• Upsize conductors by one or two AWG</li>
                      <li>• Check and tighten all connections</li>
                      <li>• Consider higher voltage (240V vs 120V)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">Problem: Breaker Keeps Tripping</h3>
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-red-600">Symptoms:</strong>
                    <ul className="mt-1 text-neutral-700">
                      <li>• Breaker trips on motor startup</li>
                      <li>• Random tripping under load</li>
                      <li>• Immediate trip when energized</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-blue-600">Causes:</strong>
                    <ul className="mt-1 text-neutral-700">
                      <li>• Breaker undersized for load</li>
                      <li>• Ground fault or short circuit</li>
                      <li>• Overloaded circuit</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-green-600">Solutions:</strong>
                    <ul className="mt-1 text-neutral-700">
                      <li>• Calculate actual load requirements</li>
                      <li>• Test for ground faults and shorts</li>
                      <li>• Verify wire ampacity vs breaker size</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Best Practices */}
      <section className="py-6 bg-red-50 border-y border-red-100">
        <div className="container">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">⚡ Electrical Safety & Best Practices</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-3">Arc Flash Protection</h3>
              <div className="text-sm text-neutral-700 space-y-2">
                <p><strong>Required PPE by voltage level:</strong></p>
                <ul className="space-y-1">
                  <li>• 120V-240V: Safety glasses, leather gloves</li>
                  <li>• 480V-600V: Category 1 arc-rated clothing</li>
                  <li>• &gt;600V: Category 2+ protection required</li>
                </ul>
                <p className="text-red-600 font-semibold">Never work on energized circuits above 50V without proper PPE and training.</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-3">Lockout/Tagout (LOTO)</h3>
              <div className="text-sm text-neutral-700 space-y-2">
                <p><strong>Required steps:</strong></p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>De-energize and lock out all energy sources</li>
                  <li>Tag equipment with personal locks</li>
                  <li>Test to verify zero energy state</li>
                  <li>Only original person removes their lock</li>
                </ol>
                <p className="text-red-600 font-semibold">OSHA 1910.147 requires LOTO procedures for electrical maintenance.</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-3">Installation Standards</h3>
              <div className="text-sm text-neutral-700 space-y-2">
                <p><strong>Quality checkpoints:</strong></p>
                <ul className="space-y-1">
                  <li>• Use proper torque specifications</li>
                  <li>• Apply antioxidant compound on aluminum</li>
                  <li>• Maintain proper bend radius</li>
                  <li>• Support conductors per NEC requirements</li>
                </ul>
                <p className="text-blue-600 font-semibold">Poor workmanship causes 60% of electrical failures.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Load Requirements & Additional Reference Tables */}
      <section className="py-4">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Equipment Loads */}
            <div className="grid gap-4">
              <div className="bg-white border border-neutral-200 rounded">
                <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 text-sm">Common Equipment Loads</h3>
                </div>
                <div className="p-2">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-neutral-500">
                        <th className="text-left font-medium">Equipment</th>
                        <th className="text-left font-medium">Load</th>
                        <th className="text-left font-medium">Breaker</th>
                        <th className="text-left font-medium">Wire</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {EQUIPMENT_LOADS.map((item) => (
                        <tr key={item.equipment}>
                          <td className="py-1">{item.equipment}</td>
                          <td className="py-1 font-mono">{item.load}</td>
                          <td className="py-1 font-mono">{item.breaker}</td>
                          <td className="py-1 font-mono">{item.wire}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded">
                <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 text-sm">Grounding Electrode Conductors</h3>
                </div>
                <div className="p-2">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-neutral-500">
                        <th className="text-left font-medium">Service</th>
                        <th className="text-left font-medium">Copper</th>
                        <th className="text-left font-medium">Aluminum</th>
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
              </div>
            </div>

            {/* Motor & Wire Cost Data */}
            <div className="grid gap-4">
              <div className="bg-white border border-neutral-200 rounded">
                <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 text-sm">Motor Full Load Current (Single Phase)</h3>
                </div>
                <div className="p-2">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-neutral-500">
                        <th className="text-left font-medium">HP</th>
                        <th className="text-left font-medium">115V</th>
                        <th className="text-left font-medium">230V</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {MOTOR_FLA.map((motor) => (
                        <tr key={motor.hp}>
                          <td className="py-1 font-mono">{motor.hp}</td>
                          <td className="py-1 font-mono">{motor.amps_115v}A</td>
                          <td className="py-1 font-mono">{motor.amps_230v}A</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded">
                <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 text-sm">Wire Cost Comparison (Estimated)</h3>
                </div>
                <div className="p-2">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-neutral-500">
                        <th className="text-left font-medium">Size</th>
                        <th className="text-left font-medium">Copper</th>
                        <th className="text-left font-medium">Aluminum</th>
                        <th className="text-left font-medium">Savings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {WIRE_COSTS.map((cost) => (
                        <tr key={cost.awg}>
                          <td className="py-1 font-mono">{cost.awg}</td>
                          <td className="py-1 font-mono text-copper-600">{cost.copper}</td>
                          <td className="py-1 font-mono text-aluminum-600">{cost.aluminum}</td>
                          <td className="py-1 font-mono text-green-600">{cost.savings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Guides & Resources */}
      <section className="py-4 bg-neutral-50">
        <div className="container">
          <div className="bg-white border border-neutral-200 rounded">
            <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-900 text-sm">Professional Guides & Resources</h2>
            </div>
            <div className="p-3">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Link href="/guides/100-amp-wire-size" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">100 Amp Wire Size</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Complete guide for 100A services</div>
                </Link>
                <Link href="/guides/200-amp-wire-size" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">200 Amp Wire Size</div>
                  <div className="text-xs text-neutral-500 mt-0.5">200A service wire requirements</div>
                </Link>
                <Link href="/guides/voltage-drop" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Voltage Drop Guide</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Understanding voltage drop calculations</div>
                </Link>
                <Link href="/guides/conduit-fill" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Conduit Fill Guide</div>
                  <div className="text-xs text-neutral-500 mt-0.5">NEC conduit fill requirements</div>
                </Link>
                <Link href="/guides/grounding" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Grounding & Bonding</div>
                  <div className="text-xs text-neutral-500 mt-0.5">NEC Article 250 requirements</div>
                </Link>
                <Link href="/guides/motor-circuits" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Motor Circuits</div>
                  <div className="text-xs text-neutral-500 mt-0.5">NEC Article 430 motor sizing</div>
                </Link>
                <Link href="/guides/load-calculations" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Load Calculations</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Residential & commercial loads</div>
                </Link>
                <Link href="/guides/ev-charging" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">EV Charging Circuits</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Electric vehicle installation guide</div>
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
              <h2 className="font-semibold text-neutral-900 text-sm">Essential Tools & Charts</h2>
            </div>
            <div className="p-3">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Link href="/charts/awg-chart" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">AWG Wire Chart</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Complete AWG sizing reference</div>
                </Link>
                <Link href="/charts/conduit-chart" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Conduit Fill Chart</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Wire capacity by conduit size</div>
                </Link>
                <Link href="/charts/breaker-chart" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Circuit Breaker Chart</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Breaker sizing reference</div>
                </Link>
                <Link href="/charts/motor-chart" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Motor FLA Chart</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Full load amperage tables</div>
                </Link>
                <Link href="/charts/voltage-systems" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Voltage Systems</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Common electrical systems</div>
                </Link>
                <Link href="/charts/wire-colors" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Wire Color Codes</div>
                  <div className="text-xs text-neutral-500 mt-0.5">NEC wire identification</div>
                </Link>
                <Link href="/charts/box-fill" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Box Fill Calculator</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Junction box capacity</div>
                </Link>
                <Link href="/safety/arc-flash" className="block p-2 rounded hover:bg-neutral-50 transition-colors">
                  <div className="font-medium text-xs text-neutral-900">Arc Flash Safety</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Safety requirements & PPE</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment-Specific Installation Guides */}
      <section className="py-6 bg-indigo-50 border-y border-indigo-100">
        <div className="container">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">📋 Equipment-Specific Installation Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-indigo-900 mb-3">100 Amp Subpanel Wire Size</h3>
              <div className="text-sm text-neutral-700 space-y-2">
                <p><strong>Copper:</strong> 4 AWG for distances up to 60 feet</p>
                <p><strong>Aluminum:</strong> 2 AWG for equivalent ampacity</p>
                <p><strong>Ground wire:</strong> 8 AWG copper or 6 AWG aluminum</p>
                <p><strong>Conduit:</strong> 1¼" EMT minimum for 4 conductors</p>
                <div className="mt-3 p-2 bg-indigo-100 rounded text-xs">
                  <strong>Code reference:</strong> NEC 215.2, Table 310.16
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-indigo-900 mb-3">EV Charger Installation Requirements</h3>
              <div className="text-sm text-neutral-700 space-y-2">
                <p><strong>Level 2 (40A):</strong> 8 AWG copper, 50A breaker</p>
                <p><strong>Dedicated circuit:</strong> Required per NEC 625.42</p>
                <p><strong>GFCI protection:</strong> Required for all EV supply equipment</p>
                <p><strong>Disconnecting means:</strong> Must be readily accessible</p>
                <div className="mt-3 p-2 bg-indigo-100 rounded text-xs">
                  <strong>Code reference:</strong> NEC Article 625
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-indigo-900 mb-3">Hot Tub/Spa Wire Requirements</h3>
              <div className="text-sm text-neutral-700 space-y-2">
                <p><strong>Typical size:</strong> 8 AWG copper for 40A loads</p>
                <p><strong>GFCI protection:</strong> Required for all hot tub circuits</p>
                <p><strong>Disconnect:</strong> Within sight, 5-50 feet from spa</p>
                <p><strong>Grounding:</strong> 12 AWG copper to pump motor</p>
                <div className="mt-3 p-2 bg-indigo-100 rounded text-xs">
                  <strong>Code reference:</strong> NEC Article 680.42
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Questions & Problem Solving */}
      <section className="py-6 bg-gray-50 border-y border-gray-100">
        <div className="container">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">❓ Common Wire Sizing Questions & Answers</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Why does distance affect wire size?</h4>
                  <p className="text-sm text-neutral-700">
                    Longer wire runs have more resistance, causing voltage drop. When voltage drops below 97% of nominal, 
                    equipment operates inefficiently. NEC recommends upsizing wire to keep voltage drop under 3% for branch circuits.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Can I use aluminum wire in my house?</h4>
                  <p className="text-sm text-neutral-700">
                    Yes, but with precautions. Use only in larger sizes (8 AWG and above), use AL-rated devices, 
                    apply antioxidant compound, and ensure proper torque. Never use aluminum for 15A or 20A branch circuits.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-blue-900 mb-2">What's the difference between THHN and THWN wire?</h4>
                  <p className="text-sm text-neutral-700">
                    THHN is heat resistant (90°C dry), THWN is moisture resistant (75°C wet). THWN-2 combines both properties. 
                    Use THWN-2 for general wiring as it works in all conditions.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">Calculation Examples</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-green-900 mb-2">Example: 50A Load, 75 Feet</h4>
                  <div className="text-sm text-neutral-700 space-y-1">
                    <p><strong>Step 1:</strong> NEC Table 310.16 → 6 AWG (65A)</p>
                    <p><strong>Step 2:</strong> Voltage drop = (2 × 12.9 × 50 × 75) ÷ 26,240 = 1.85%</p>
                    <p><strong>Step 3:</strong> 1.85% &lt; 3% → 6 AWG is adequate</p>
                    <p><strong>Result:</strong> Use 6 AWG copper with 60A breaker</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-green-900 mb-2">Example: 30A Load, 150 Feet</h4>
                  <div className="text-sm text-neutral-700 space-y-1">
                    <p><strong>Step 1:</strong> NEC Table 310.16 → 10 AWG (35A)</p>
                    <p><strong>Step 2:</strong> Voltage drop = (2 × 12.9 × 30 × 150) ÷ 10,380 = 11.2%</p>
                    <p><strong>Step 3:</strong> 11.2% &gt; 3% → Upsize to 6 AWG</p>
                    <p><strong>Result:</strong> Use 6 AWG copper with 40A breaker</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-amber-600 mb-2">Pro Tip: The K Factor</h4>
                  <p className="text-sm text-neutral-700">
                    K = 12.9 for copper, 21.2 for aluminum. This constant accounts for resistivity. 
                    Formula: VD% = (2 × K × I × L) ÷ CM × 100
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Code Differences */}
      <section className="py-6 bg-yellow-50 border-y border-yellow-100">
        <div className="container">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">🗺️ Regional Code Differences & Local Requirements</h2>
          <div className="bg-white p-4 rounded-lg border border-yellow-200">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-yellow-900 mb-3">California (Title 24)</h3>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• Enhanced ampacity derating in hot climates</li>
                  <li>• Additional AFCI requirements</li>
                  <li>• Stricter EV charging provisions</li>
                  <li>• Solar-ready electrical panels required</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-3">Texas (Local Amendments)</h3>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• Hurricane tie-down requirements</li>
                  <li>• Enhanced grounding for storm protection</li>
                  <li>• Higher temperature derating factors</li>
                  <li>• Pool/spa bonding requirements</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-3">New York City</h3>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• Stricter conduit fill requirements</li>
                  <li>• Enhanced fire stopping provisions</li>
                  <li>• Additional GFCI applications</li>
                  <li>• Specific high-rise building requirements</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 rounded text-xs text-yellow-800">
              <strong>Important:</strong> Always verify local amendments with your Authority Having Jurisdiction (AHJ). 
              Local codes may be more restrictive than NEC minimum requirements.
            </div>
          </div>
        </div>
      </section>

      {/* Historical Code Changes */}
      <section className="py-6 bg-teal-50 border-y border-teal-100">
        <div className="container">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">📅 NEC Code Evolution: 2017 → 2020 → 2023</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-teal-200">
              <h3 className="font-semibold text-teal-900 mb-3">2017 NEC</h3>
              <ul className="text-sm text-neutral-700 space-y-1">
                <li>• AFCI required in most living areas</li>
                <li>• Ground fault protection for personnel (GFPP)</li>
                <li>• Emergency disconnect requirements</li>
                <li>• Energy storage system provisions</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border border-teal-200">
              <h3 className="font-semibold text-teal-900 mb-3">2020 NEC</h3>
              <ul className="text-sm text-neutral-700 space-y-1">
                <li>• AFCI expanded to all habitable rooms</li>
                <li>• Enhanced GFCI protection requirements</li>
                <li>• Surge protection device requirements</li>
                <li>• EV charging infrastructure updates</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border border-teal-200">
              <h3 className="font-semibold text-teal-900 mb-3">2023 NEC</h3>
              <ul className="text-sm text-neutral-700 space-y-1">
                <li>• Smart home device requirements</li>
                <li>• Enhanced cybersecurity provisions</li>
                <li>• Updated renewable energy standards</li>
                <li>• Expanded low-voltage system coverage</li>
              </ul>
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
              <strong>Disclaimer:</strong> For reference only. All electrical work must be performed by licensed electricians per local codes. Verify with NEC tables and AHJ requirements.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}