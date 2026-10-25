import { Metadata } from 'next';
import ServiceEntranceCalculator from '@/components/calculators/ServiceEntranceCalculator';
import { Building, Shield, AlertTriangle, Zap, Home, Calculator, Wrench, Users } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';

export const metadata: Metadata = {
  title: 'Service Entrance — NEC 310.12',
  description: 'Service-entrance conductor sizing for 100A, 150A, 200A, 320A residential services. Includes the NEC 310.12 dwelling-unit 83% allowance.',
  keywords: 'service entrance calculator, main electrical service, service wire size, meter base requirements, NEC 310.12, electrical service upgrade, 200 amp service wire, service entrance cable, main panel sizing, utility service requirements',
  alternates: { canonical: '/calculators/service-entrance-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "Service Entrance Calculator",
  url: "https://wiresizes.com/calculators/service-entrance-calculator",
  description: "Calculate service entrance requirements including wire size, grounding, meter base, and main panel specs per NEC 230 & 310.12. For 100A to 1200A residential and commercial services."
};

const COMPREHENSIVE_FAQS = [
  {
    question: 'What size wire do I need for 200 amp service entrance?',
    answer: 'For 200A residential service entrance, NEC Table 310.12 allows 2/0 AWG copper or 4/0 AWG aluminum for dwelling services. This is smaller than Table 310.16 would require due to residential diversity factors. The neutral can be the same size or one size smaller. Grounding electrode conductor must be 4 AWG copper minimum.'
  },
  {
    question: 'What\'s the difference between overhead and underground service?',
    answer: 'Overhead service uses aerial cables from utility pole to weatherhead, but is weather-exposed. Underground service uses buried cables, but provides better aesthetics and weather protection. Underground requires special cable types (USE-2, URD) and conduit protection.'
  },
  {
    question: 'How do I calculate service entrance size?',
    answer: 'Calculate total connected load per NEC 220, apply demand factors, add 25% for continuous loads and largest motor. Size service at 125% of calculated demand for growth. Example: 32kW demand = 133A at 240V, requires 200A service. Always include future loads like EV charging.'
  },
  {
    question: 'Can I install my own service entrance?',
    answer: 'Most jurisdictions require licensed electrician for service entrance work. DIY typically prohibited due to utility connection requirements and safety concerns. Some areas allow homeowner installation with permit but utility connection must be by licensed contractor. Check local codes.'
  },
  {
    question: 'What\'s included in service entrance installation?',
    answer: 'Complete installation includes: service drop/lateral from utility, weatherhead/riser (overhead) or underground conduit, meter base, service entrance conductors, main breaker panel, grounding electrode system, bonding of metal systems.'
  },
  {
    question: 'How long do service entrance cables last?',
    answer: 'Service entrance cables typically last 30-50 years. Aluminum cables from 1960s-1970s may need replacement due to oxidation. Signs of replacement need: warm connections, burning smell, flickering lights, corroded terminals. Underground cables in conduit last longer than direct burial.'
  },
  {
    question: 'What size ground wire for service entrance?',
    answer: 'Grounding electrode conductor sizing per NEC Table 250.66: 100A service needs 8 AWG copper, 200A needs 4 AWG copper, 400A needs 1/0 AWG copper. Must connect to ground rods (2 required), water pipe if metallic, and concrete-encased electrode if present.'
  },
  {
    question: 'Do I need surge protection on service entrance?',
    answer: 'NEC 2020 requires surge protection for dwelling units (230.67). Type 1 SPD at service entrance recommended, Type 2 at panel. Protects against utility surges, lightning.'
  },
  {
    question: 'What clearances are required for service entrance?',
    answer: 'Service drop must maintain: 10 ft above ground/sidewalk, 12 ft above residential driveways, 18 ft above roads. Meter base: 4-6 ft above grade. Working clearance at panel: 3 ft wide × 6.5 ft high × 36" deep. Service mast extends 18-24" above roof.'
  }
];

const WIRE_TYPE_COMPARISON = [
  {
    type: 'SE-R (Service Entrance Round)',
    application: 'Indoor panels from meter',
    advantages: 'Flexible, easy installation, no conduit needed',
    disadvantages: 'Indoor only, not for wet locations',
    ampRating: 'Full ampacity at 75°C'
  },
  {
    type: 'SE-U (Service Entrance Unarmored)',
    application: 'Overhead service drops',
    advantages: 'Sunlight resistant, direct burial rated',
    disadvantages: 'Requires conduit for physical protection',
    ampRating: 'Full ampacity at 75°C'
  },
  {
    type: 'USE-2/RHW-2',
    application: 'Underground service, wet locations',
    advantages: 'Direct burial, wet location rated, high temp',
    disadvantages: 'More expensive, requires pulling',
    ampRating: 'Full ampacity at 90°C wet'
  },
  {
    type: 'THWN-2',
    application: 'Conduit installations',
    advantages: 'Versatile, wet/dry rated, pulls easily',
    disadvantages: 'Requires conduit always',
    ampRating: 'Full ampacity at 75°C'
  },
  {
    type: 'XHHW-2',
    application: 'Commercial/industrial service',
    advantages: 'High temperature, wet/dry, tough jacket',
    disadvantages: 'Expensive, harder to pull',
    ampRating: 'Full ampacity at 90°C'
  },
  {
    type: 'Mobile Home Feeder',
    application: 'Manufactured homes',
    advantages: 'Listed for mobile homes, 4-wire',
    disadvantages: 'Limited to mobile home use',
    ampRating: 'Per manufacturer specs'
  }
];

const INSPECTION_CHECKLIST = [
  {
    category: 'Service Drop/Lateral',
    items: [
      'Proper clearances maintained (10-18 ft per location)',
      'Weatherhead above point of attachment',
      'Drip loops formed in overhead conductors',
      'Underground conduit sealed at entries',
      'Proper cable support and strain relief',
      'Service mast properly anchored'
    ]
  },
  {
    category: 'Meter Base',
    items: [
      'Correct meter base for service size',
      'Proper mounting height (4-6 ft)',
      'Hub connections tight and sealed',
      'Grounding/bonding connections made',
      'Utility sealing provisions intact',
      'Bypass lever in correct position (if equipped)'
    ]
  },
  {
    category: 'Service Equipment',
    items: [
      'Main breaker properly sized',
      'Service conductors terminated correctly',
      'Neutral and ground properly separated',
      'Main bonding jumper installed',
      'Panel labeled as service equipment',
      'Working clearances maintained'
    ]
  },
  {
    category: 'Grounding System',
    items: [
      'Two ground rods installed (8 ft minimum)',
      'Rods spaced 6 ft apart minimum',
      'Water pipe bond if metallic',
      'GEC protected where exposed',
      'Intersystem bonding terminal present',
      'Connections accessible for inspection'
    ]
  },
  {
    category: 'Documentation',
    items: [
      'Load calculation on file',
      'Permit properly displayed',
      'Panel schedule completed',
      'As-built drawings if required',
      'Utility approval documented',
      'Inspection stickers affixed'
    ]
  }
];

export default function ServiceEntranceCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CombinedSchema webApp={webAppData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Service Entrance Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-purple-50">
                Calculate complete service entrance requirements including wire sizing per NEC 310.12, grounding specifications, 
                meter base selection, and main panel sizing for residential and commercial installations.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="font-semibold">Article 230 & 310.12</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Service Range</div>
                  <div className="font-semibold">60A to 1200A</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Installation Types</div>
                  <div className="font-semibold">Overhead & Underground</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="font-semibold">Materials + Labor</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Information */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-red-900 mb-2">Service Entrance Installation Requirements</h2>
                <ul className="text-red-800 space-y-1 text-sm">
                  <li>• Service entrance work requires electrical permit and professional installation in most jurisdictions</li>
                  <li>• Utility company coordination required - allow 2-4 weeks for approvals</li>
                  <li>• Power will be disconnected during upgrade - plan accordingly</li>
                  <li>• NEC Table 310.12 allows reduced wire sizes for residential services only</li>
                  <li>• Improper installation can result in fire, electrocution, or utility rejection</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <ServiceEntranceCalculator />

          {/* Wire Type Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Service Entrance Cable Types</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Comparison of cable types approved for service entrance installations. Selection depends on installation method and local codes.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Cable Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Application</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Advantages</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Disadvantages</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Ampacity</th>
                  </tr>
                </thead>
                <tbody>
                  {WIRE_TYPE_COMPARISON.map((wire, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{wire.type}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{wire.application}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-green-600">{wire.advantages}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-red-600">{wire.disadvantages}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{wire.ampRating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inspection Checklist */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Service Entrance Inspection Checklist</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Critical items inspectors verify during service entrance installation. Use this checklist to ensure passing inspection.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {INSPECTION_CHECKLIST.map((category, idx) => (
                <div key={idx} className="border rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">{category.category}</h3>
                  <div className="space-y-2">
                    {category.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start gap-3">
                        <div className="w-5 h-5 border-2 border-gray-400 rounded mt-0.5 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-red-50 rounded-lg p-4 border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Common Inspection Failures:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Improper grounding electrode installation or connections</li>
                <li>• Insufficient working clearances at panel location</li>
                <li>• Missing main bonding jumper or neutral-ground separation</li>
                <li>• Incorrect wire size for service amperage</li>
                <li>• Missing surge protection (NEC 2020 requirement)</li>
              </ul>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {COMPREHENSIVE_FAQS.map((faq, idx) => (
                <details key={idx} className="group bg-gray-50 rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-100 rounded-lg">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Related calculators</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Wire Size</h3>
                <p className="text-sm text-gray-600">General wire sizing</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Voltage Drop</h3>
                <p className="text-sm text-gray-600">Check voltage loss</p>
              </Link>
              
              <Link href="/calculators/ground-wire-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Grounding</h3>
                <p className="text-sm text-gray-600">Ground wire sizing</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}