import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, 
  Zap, 
  Home, 
  Car, 
  Plug, 
  Wrench,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Cpu,
  Gauge,
  Battery,
  Thermometer,
  Building,
  Shield,
  FileText,
  Settings
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Professional Electrical Calculators - Wire Size, Voltage Drop, Ampacity & More | WireSizes.com',
  description: 'Comprehensive suite of 30+ professional electrical calculators for wire sizing, voltage drop, ampacity, power conversions, and NEC-compliant calculations. Trusted by electricians and engineers worldwide.',
  keywords: [
    'electrical calculators',
    'wire size calculator',
    'voltage drop calculator',
    'ampacity calculator',
    'NEC calculators',
    'electrical engineering tools',
    'power conversion calculators',
    'three phase calculator',
    'conduit fill calculator'
  ],
  alternates: {
    canonical: 'https://wiresizes.com/calculators'
  },
  openGraph: {
    title: 'Professional Electrical Calculators | WireSizes.com',
    description: '30+ NEC-compliant electrical calculators for wire sizing, voltage drop, ampacity, and more.',
    url: 'https://wiresizes.com/calculators',
    siteName: 'WireSizes.com',
    images: [
      {
        url: 'https://wiresizes.com/images/og-image.png',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Electrical Calculators',
    description: '30+ NEC-compliant electrical calculators',
    images: ['https://wiresizes.com/images/og-image.png'],
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
        desc: 'Determines proper wire gauge based on amperage, voltage, distance, and installation method',
        example: 'Example: 50A circuit at 240V over 100 feet → Recommends 6 AWG copper or 4 AWG aluminum',
        features: ['NEC 2023 compliant', 'Voltage drop included', 'Temperature derating', 'Conduit fill check'],
        popularity: 95
      },
      { 
        name: 'Voltage Drop Calculator', 
        href: '/calculators/voltage-drop-calculator', 
        desc: 'Calculates voltage drop percentage to ensure compliance with 3% branch and 5% feeder limits',
        example: 'Example: 100 ft of 12 AWG copper carrying 20A at 120V → 3.2% voltage drop',
        features: ['Single & three phase', 'AC/DC calculations', 'Wire size recommendations', 'NEC compliance check'],
        popularity: 88
      },
      { 
        name: 'Ampacity Calculator', 
        href: '/calculators/ampacity-calculator', 
        desc: 'Look up NEC Table 310.16 ampacity ratings with temperature and bundling adjustments',
        example: 'Example: 10 AWG THHN at 90°C in conduit → 40A ampacity (derated to 35A at 30°C ambient)',
        features: ['NEC Table 310.16', 'Temperature correction', 'Bundling derating', 'All conductor types'],
        popularity: 82
      },
      { 
        name: 'Ground Wire Size', 
        href: '/calculators/ground-wire-size', 
        desc: 'Determines equipment grounding conductor size per NEC Table 250.122',
        example: 'Example: 100A circuit breaker → Requires 8 AWG copper or 6 AWG aluminum ground',
        features: ['NEC Table 250.122', 'Service entrance grounds', 'Equipment grounds', 'Grounding electrode conductors'],
        popularity: 75
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
        href: '/calculators/watts-to-amps', 
        desc: 'Convert power in watts to current in amps for any voltage',
        example: 'Example: 1500W heater at 120V → 12.5 amps',
        features: ['Single phase', 'Three phase', 'Power factor', 'DC circuits'],
        popularity: 92
      },
      { 
        name: 'Amps to Watts', 
        href: '/calculators/amps-to-watts', 
        desc: 'Convert current in amps to power in watts',
        example: 'Example: 20A at 240V → 4800 watts',
        features: ['AC/DC conversion', 'Power factor adjustment', 'Three phase option', 'Efficiency calculation'],
        popularity: 90
      },
      { 
        name: 'Ohm\'s Law Calculator', 
        href: '/calculators/ohms-law', 
        desc: 'Complete Ohm\'s Law and power calculations - solve for V, I, R, or P',
        example: 'Example: 120V with 10Ω resistance → 12A current, 1440W power',
        features: ['Voltage calculation', 'Current calculation', 'Resistance calculation', 'Power calculation'],
        popularity: 85
      },
      { 
        name: 'kW to Amps', 
        href: '/calculators/kw-to-amps', 
        desc: 'Convert kilowatts to amps for sizing circuits and breakers',
        example: 'Example: 10kW at 240V three-phase → 24.1 amps per phase',
        features: ['Single phase', 'Three phase', 'Power factor correction', 'Line vs phase current'],
        popularity: 78
      },
      { 
        name: 'Kilowatts to Amps', 
        href: '/calculators/kilowatts-to-amps', 
        desc: 'Extended kilowatt to amp conversion with detailed calculations',
        example: 'Example: 5.5kW motor at 480V three-phase → 6.6 amps',
        features: ['Motor calculations', 'Efficiency factors', 'Starting current', 'Demand factors'],
        popularity: 72
      },
      { 
        name: 'Horsepower to Amps', 
        href: '/calculators/horsepower-to-amps', 
        desc: 'Convert motor horsepower to full load amps per NEC',
        example: 'Example: 10 HP motor at 240V → 38 amps full load current',
        features: ['NEC Table 430.248', 'Single & three phase', 'Motor efficiency', 'Service factor'],
        popularity: 70
      },
    ],
  },
  {
    name: 'Equipment Specific',
    icon: Home,
    description: 'Specialized calculators for common residential and commercial equipment installations',
    featured: true,
    color: 'purple',
    calculators: [
      { 
        name: 'EV Charger Wire Size', 
        href: '/calculators/ev-charger-wire-size-calculator', 
        desc: 'Calculate wire size for Level 2 electric vehicle charging stations',
        example: 'Example: 48A charger at 50 feet → 6 AWG copper or 4 AWG aluminum required',
        features: ['Level 2 chargers', 'Continuous load factor', 'NEMA outlet types', 'Installation guidance'],
        popularity: 88
      },
      { 
        name: 'Hot Tub Wire Size', 
        href: '/calculators/hot-tub-wire-size-calculator', 
        desc: 'Determine wire and breaker size for spa and hot tub installations',
        example: 'Example: 50A hot tub at 75 feet → 6 AWG copper in conduit',
        features: ['GFCI requirements', 'Disconnect sizing', 'Burial depth', 'Bonding requirements'],
        popularity: 82
      },
      { 
        name: 'Garage Subpanel', 
        href: '/calculators/garage-subpanel-wire-size', 
        desc: 'Size feeder wire for detached garage and workshop subpanels',
        example: 'Example: 60A subpanel at 150 feet → 4 AWG aluminum URD cable',
        features: ['Subpanel sizing', 'Ground rod requirements', 'Feeder protection', 'Load calculations'],
        popularity: 76
      },
      { 
        name: 'AC Wire Size', 
        href: '/calculators/ac-wire-size', 
        desc: 'Calculate wire size for air conditioner and heat pump circuits',
        example: 'Example: 3-ton AC unit → 30A breaker with 10 AWG wire',
        features: ['BTU to tonnage', 'MCA/MOP values', 'Disconnect requirements', 'Whip specifications'],
        popularity: 80
      },
      { 
        name: 'Pool Pump Calculator', 
        href: '/calculators/pool-pump-calculator', 
        desc: 'Wire sizing for pool pumps and equipment',
        example: 'Example: 2 HP pump at 230V → 20A circuit with 12 AWG wire',
        features: ['GFCI protection', 'Bonding requirements', 'Timer circuits', 'Multiple pump support'],
        popularity: 68
      },
    ],
  },
  {
    name: 'Advanced Calculators',
    icon: Cpu,
    description: 'Professional tools for complex electrical calculations and commercial installations',
    color: 'orange',
    calculators: [
      { 
        name: 'Three Phase Calculator', 
        href: '/calculators/three-phase-calculator', 
        desc: 'Comprehensive three-phase power, current, and wire size calculations',
        example: 'Example: 100kW at 480V → 120.3A per phase, recommends 1/0 AWG',
        features: ['Delta/Wye systems', 'Power factor', 'Unbalanced loads', 'Voltage imbalance'],
        popularity: 74
      },
      { 
        name: 'Conduit Fill Calculator', 
        href: '/calculators/conduit-fill-calculator', 
        desc: 'Calculate conduit fill percentage per NEC Chapter 9 requirements',
        example: 'Example: Three 10 AWG THHN in 3/4" EMT → 16% fill (40% max allowed)',
        features: ['NEC Chapter 9', 'Multiple conductor types', 'All conduit types', 'Jam ratio check'],
        popularity: 71
      },
      { 
        name: 'Electrical Load Calculator', 
        href: '/calculators/residential-load-calculator', 
        desc: 'Residential service load calculation per NEC Article 220',
        example: 'Example: 2000 sq ft home → 150A service recommended',
        features: ['NEC Article 220', 'Demand factors', 'Optional calculations', 'Service sizing'],
        popularity: 69
      },
      { 
        name: 'Service Entrance Calculator', 
        href: '/calculators/service-entrance-calculator', 
        desc: 'Size service entrance conductors and equipment',
        example: 'Example: 200A service → 2/0 copper or 4/0 aluminum service entrance cable',
        features: ['Service conductor sizing', 'Meter base requirements', 'Grounding electrode', 'Main breaker sizing'],
        popularity: 66
      },
      { 
        name: 'Motor Circuit Calculator', 
        href: '/calculators/motor-circuit-calculator', 
        desc: 'Complete motor circuit design including wire, breaker, and overload sizing',
        example: 'Example: 25 HP motor → 40A wire, 70A breaker, 38A overloads',
        features: ['NEC Article 430', 'Overload protection', 'Short circuit protection', 'Control circuits'],
        popularity: 63
      },
    ],
  },
];

const featuredTools = [
  {
    title: 'Most Popular',
    icon: TrendingUp,
    href: '/calculators/wire-size-calculator',
    description: 'Wire Size Calculator - Used by over 50,000 professionals monthly',
    color: 'blue'
  },
  {
    title: 'Quick Convert',
    icon: Activity,
    href: '/calculators/watts-to-amps',
    description: 'Watts to Amps - Instant power to current conversion',
    color: 'green'
  },
  {
    title: 'NEC Compliant',
    icon: Shield,
    href: '/calculators/ampacity-calculator',
    description: 'Ampacity Tables - Official NEC 2023 ampacity ratings',
    color: 'purple'
  },
  {
    title: 'EV Ready',
    icon: Battery,
    href: '/calculators/ev-charger-wire-size-calculator',
    description: 'EV Charger Sizing - Level 2 charger installations',
    color: 'orange'
  }
];

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-neutral-50">
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Professional Electrical Calculators
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Complete suite of NEC 2023 compliant electrical calculators for wire sizing, voltage drop, 
            ampacity, and power conversions. Trusted by over 100,000 electrical professionals worldwide.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>NEC 2023 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Professional Grade</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span>30+ Calculators</span>
            </div>
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
                  <span className="text-sm font-medium">Open Calculator</span>
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
                <p className="text-gray-600 max-w-3xl">{category.description}</p>
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
                          {calc.popularity && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all"
                                  style={{ width: `${calc.popularity}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{calc.popularity}% usage</span>
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {calc.desc}
                      </p>

                      {/* Example */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
                        <p className="text-xs text-gray-700">
                          <span className="font-medium">📊 {calc.example}</span>
                        </p>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2">
                        {calc.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span className="text-xs text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
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
          <div className="grid md:grid-cols-3 gap-6">
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
            
            <Link href="/guides/electrical-safety" className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <Shield className="w-8 h-8 text-red-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Safety Guidelines</h3>
              <p className="text-sm text-gray-600 mb-3">
                Essential electrical safety information and best practices for installations
              </p>
              <span className="text-red-600 text-sm font-medium">Learn More →</span>
            </Link>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Need help choosing the right calculator for your project?
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Contact Our Support Team
          </Link>
        </div>

      </div>
    </div>
  );
}