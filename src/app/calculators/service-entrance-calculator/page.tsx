import { Metadata } from 'next';
import ServiceEntranceCalculator from '@/components/calculators/ServiceEntranceCalculator';
import { Building, Shield, DollarSign, FileText, AlertTriangle, CheckCircle, Zap, Home, Factory, Calculator, Target, Wrench, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Service Entrance Calculator | Electrical Service Wire Size & Main Panel',
  description: 'Calculate service entrance requirements including wire size, grounding, meter base, and main panel specs per NEC 230 & 310.12. For 100A to 1200A residential and commercial services.',
  keywords: 'service entrance calculator, main electrical service, service wire size, meter base requirements, NEC 310.12, electrical service upgrade, 200 amp service wire, service entrance cable, main panel sizing, utility service requirements',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Service Entrance Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Size electrical service entrance conductors and equipment for buildings.",
  "keywords": "service entrance, main electrical, utility connection",
  "url": `https://wiresizes.com/calculators/service-entrance-calculator`,
  "inLanguage": "en-US",
  "creator": {
    "@type": "Organization",
    "name": "WireSizes.com",
    "url": "https://wiresizes.com"
  },
  "publisher": {
    "@type": "Organization", 
    "name": "WireSizes.com",
    "url": "https://wiresizes.com"
  },
  "featureList": [
    "NEC code compliant calculations",
    "Real-time results",
    "Mobile responsive design", 
    "Free to use",
    "No registration required"
  ],
  "softwareVersion": "2.0",
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString().split('T')[0]
};

const COMPREHENSIVE_FAQS = [
  {
    question: 'What size wire do I need for 200 amp service entrance?',
    answer: 'For 200A residential service entrance, NEC Table 310.12 allows 2/0 AWG copper or 4/0 AWG aluminum for dwelling services. This is smaller than Table 310.16 would require due to residential diversity factors. The neutral can be the same size or one size smaller. Grounding electrode conductor must be 4 AWG copper minimum.'
  },
  {
    question: 'What\'s the difference between overhead and underground service?',
    answer: 'Overhead service uses aerial cables from utility pole to weatherhead, costs less ($2,000-4,000), but is weather-exposed. Underground service uses buried cables, costs more ($3,500-6,000) due to trenching, but provides better aesthetics and weather protection. Underground requires special cable types (USE-2, URD) and conduit protection.'
  },
  {
    question: 'How do I calculate service entrance size?',
    answer: 'Calculate total connected load per NEC 220, apply demand factors, add 25% for continuous loads and largest motor. Size service at 125% of calculated demand for growth. Example: 32kW demand = 133A at 240V, requires 200A service. Always include future loads like EV charging.'
  },
  {
    question: 'What permits are required for service entrance upgrade?',
    answer: 'Service upgrades require electrical permit ($200-500), utility coordination/approval, and inspection. Process: submit load calculations with permit application, schedule utility disconnect, complete installation, pass rough-in and final inspections, utility reconnects service. Timeline typically 2-4 weeks.'
  },
  {
    question: 'Can I install my own service entrance?',
    answer: 'Most jurisdictions require licensed electrician for service entrance work. DIY typically prohibited due to utility connection requirements and safety concerns. Some areas allow homeowner installation with permit but utility connection must be by licensed contractor. Check local codes.'
  },
  {
    question: 'What\'s included in service entrance installation?',
    answer: 'Complete installation includes: service drop/lateral from utility, weatherhead/riser (overhead) or underground conduit, meter base, service entrance conductors, main breaker panel, grounding electrode system, bonding of metal systems. Cost typically $3,000-8,000 depending on size and type.'
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
    answer: 'NEC 2020 requires surge protection for dwelling units (230.67). Type 1 SPD at service entrance recommended, Type 2 at panel. Protects against utility surges, lightning. Cost $200-500, prevents damage to electronics, HVAC, appliances worth thousands.'
  },
  {
    question: 'What clearances are required for service entrance?',
    answer: 'Service drop must maintain: 10 ft above ground/sidewalk, 12 ft above residential driveways, 18 ft above roads. Meter base: 4-6 ft above grade. Working clearance at panel: 3 ft wide × 6.5 ft high × 36" deep. Service mast extends 18-24" above roof.'
  }
];

const SERVICE_UPGRADE_SCENARIOS = [
  {
    current: '60A',
    upgrade: '200A',
    reason: 'Fuse box to modern breaker panel',
    typicalHome: 'Pre-1960s homes',
    drivers: 'Safety, insurance requirements, modern appliances',
    cost: '$3,500-5,000',
    timeframe: '1-2 days',
    benefits: 'Eliminates fire hazard, enables AFCI/GFCI, increases home value $5,000-8,000'
  },
  {
    current: '100A',
    upgrade: '200A',
    reason: 'Capacity for modern loads',
    typicalHome: '1960s-1980s homes',
    drivers: 'Central AC, electric appliances, EV charging',
    cost: '$3,000-4,500',
    timeframe: '1-2 days',
    benefits: 'Supports modern lifestyle, eliminates overload, enables additions'
  },
  {
    current: '150A',
    upgrade: '200A',
    reason: 'Future-proofing',
    typicalHome: '1990s homes',
    drivers: 'Home additions, hot tub, workshop',
    cost: '$2,500-3,500',
    timeframe: '1 day',
    benefits: 'Growth capacity, supports multiple high-demand loads'
  },
  {
    current: '200A',
    upgrade: '400A',
    reason: 'Luxury features or large home',
    typicalHome: '4,000+ sq ft homes',
    drivers: 'Pool/spa, multiple EVs, workshop, guest house',
    cost: '$5,000-8,000',
    timeframe: '2-3 days',
    benefits: 'Unlimited electrical capacity, commercial-grade service'
  },
  {
    current: '200A',
    upgrade: '320A/400A',
    reason: 'All-electric home conversion',
    typicalHome: 'Gas to electric conversion',
    drivers: 'Electrification, heat pumps, induction cooking',
    cost: '$4,500-7,000',
    timeframe: '2 days',
    benefits: 'Eliminates gas bills, qualifies for electrification incentives'
  }
];

const WIRE_TYPE_COMPARISON = [
  {
    type: 'SE-R (Service Entrance Round)',
    application: 'Indoor panels from meter',
    advantages: 'Flexible, easy installation, no conduit needed',
    disadvantages: 'Indoor only, not for wet locations',
    cost: '$$',
    ampRating: 'Full ampacity at 75°C'
  },
  {
    type: 'SE-U (Service Entrance Unarmored)',
    application: 'Overhead service drops',
    advantages: 'Sunlight resistant, direct burial rated',
    disadvantages: 'Requires conduit for physical protection',
    cost: '$',
    ampRating: 'Full ampacity at 75°C'
  },
  {
    type: 'USE-2/RHW-2',
    application: 'Underground service, wet locations',
    advantages: 'Direct burial, wet location rated, high temp',
    disadvantages: 'More expensive, requires pulling',
    cost: '$$$',
    ampRating: 'Full ampacity at 90°C wet'
  },
  {
    type: 'THWN-2',
    application: 'Conduit installations',
    advantages: 'Versatile, wet/dry rated, pulls easily',
    disadvantages: 'Requires conduit always',
    cost: '$$',
    ampRating: 'Full ampacity at 75°C'
  },
  {
    type: 'XHHW-2',
    application: 'Commercial/industrial service',
    advantages: 'High temperature, wet/dry, tough jacket',
    disadvantages: 'Expensive, harder to pull',
    cost: '$$$',
    ampRating: 'Full ampacity at 90°C'
  },
  {
    type: 'Mobile Home Feeder',
    application: 'Manufactured homes',
    advantages: 'Listed for mobile homes, 4-wire',
    disadvantages: 'Limited to mobile home use',
    cost: '$$',
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

const UTILITY_CONNECTION_PROCESS = [
  {
    step: 1,
    phase: 'Pre-Installation',
    tasks: [
      'Submit service application to utility',
      'Provide load calculation and site plan',
      'Pay utility connection fees',
      'Schedule utility engineering review',
      'Receive approval and service design'
    ],
    timeline: '2-4 weeks',
    cost: '$250-1,500'
  },
  {
    step: 2,
    phase: 'Coordination',
    tasks: [
      'Pull electrical permit',
      'Order meter base from utility-approved list',
      'Schedule utility disconnect (if upgrade)',
      'Coordinate with utility for new transformer if needed',
      'Arrange temporary power if required'
    ],
    timeline: '1-2 weeks',
    cost: '$200-500 permits'
  },
  {
    step: 3,
    phase: 'Installation',
    tasks: [
      'Install service entrance equipment',
      'Run service conductors',
      'Install grounding system',
      'Complete all electrical connections',
      'Self-inspection before official inspection'
    ],
    timeline: '1-3 days',
    cost: 'Per contractor quote'
  },
  {
    step: 4,
    phase: 'Inspection',
    tasks: [
      'Schedule rough-in inspection if required',
      'Complete any corrections',
      'Schedule final electrical inspection',
      'Obtain inspection approval',
      'Notify utility of passed inspection'
    ],
    timeline: '3-5 days',
    cost: 'Included in permit'
  },
  {
    step: 5,
    phase: 'Utility Connection',
    tasks: [
      'Utility schedules connection crew',
      'Utility installs meter and makes connection',
      'Utility energizes service',
      'Test all circuits and equipment',
      'Utility seals meter'
    ],
    timeline: '3-10 days',
    cost: 'Connection fees if applicable'
  }
];

const COST_BREAKDOWN_TABLE = [
  { component: 'Meter Base', size100A: '$150', size200A: '$250', size400A: '$600', sizeCT: '$1,500', notes: 'Utility-approved models only' },
  { component: 'Service Cable (per ft)', size100A: '$3', size200A: '$8', size400A: '$18', sizeCT: '$35', notes: 'Copper prices fluctuate' },
  { component: 'Main Breaker', size100A: '$75', size200A: '$150', size400A: '$500', sizeCT: '$800', notes: 'Quality brands recommended' },
  { component: 'Panel Cabinet', size100A: '$150', size200A: '$300', size400A: '$800', sizeCT: '$1,200', notes: 'Spaces affect price' },
  { component: 'Weatherhead/Mast', size100A: '$100', size200A: '$150', size400A: '$300', sizeCT: '$500', notes: 'Overhead only' },
  { component: 'Ground System', size100A: '$150', size200A: '$200', size400A: '$300', sizeCT: '$400', notes: 'Rods, clamps, wire' },
  { component: 'Conduit/Fittings', size100A: '$100', size200A: '$200', size400A: '$400', sizeCT: '$600', notes: 'PVC or rigid metal' },
  { component: 'Labor (typical)', size100A: '$1,200', size200A: '$1,800', size400A: '$3,500', sizeCT: '$5,000', notes: 'Varies by region' },
  { component: 'Permit/Inspection', size100A: '$200', size200A: '$300', size400A: '$500', sizeCT: '$750', notes: 'Local fees vary' },
  { component: 'Utility Fees', size100A: '$250', size200A: '$250', size400A: '$500', sizeCT: '$1,000', notes: 'New service or upgrade' }
];

export default function ServiceEntranceCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['service-entrance-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
                  <div className="text-sm text-purple-100">NEC Compliant</div>
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
                  <div className="text-sm text-purple-100">Cost Estimates</div>
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

          {/* Service Upgrade Scenarios */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Common Service Upgrade Scenarios</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Typical residential service upgrades, costs, and benefits. Most homes built before 1990 need upgrades for modern electrical demands.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Current → Upgrade</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Typical Home</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Drivers</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Cost</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Timeline</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Benefits</th>
                  </tr>
                </thead>
                <tbody>
                  {SERVICE_UPGRADE_SCENARIOS.map((scenario, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">
                        {scenario.current} → {scenario.upgrade}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{scenario.typicalHome}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{scenario.drivers}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-green-600">
                        {scenario.cost}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{scenario.timeframe}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{scenario.benefits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Cost</th>
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
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{wire.cost}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{wire.ampRating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Breakdown Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Service Installation Cost Breakdown</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Typical component costs for different service sizes. Prices vary by location and market conditions.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Component</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">100A Service</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">200A Service</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">400A Service</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">CT Metering</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_BREAKDOWN_TABLE.map((item, idx) => (
                    <tr key={idx} className={idx === COST_BREAKDOWN_TABLE.length - 3 ? 'font-semibold bg-gray-50' : 'hover:bg-gray-50'}>
                      <td className="border border-gray-300 px-4 py-3">{item.component}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.size100A}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.size200A}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.size400A}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.sizeCT}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-green-100 font-bold">
                    <td className="border border-gray-300 px-4 py-3">Typical Total</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">$2,500</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">$3,800</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">$7,500</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">$12,000</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">Overhead service</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Utility Connection Process */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Utility Connection Process Timeline</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Step-by-step process for coordinating service installation with utility company. Timeline varies by utility and location.
            </p>
            
            <div className="space-y-6">
              {UTILITY_CONNECTION_PROCESS.map((phase, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 bg-purple-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium mb-2">
                        Step {phase.step}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-lg">{phase.phase}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Timeline</div>
                      <div className="font-semibold text-purple-600">{phase.timeline}</div>
                      <div className="text-sm text-gray-500">Cost</div>
                      <div className="font-medium text-green-600">{phase.cost}</div>
                    </div>
                  </div>
                  
                  <ul className="space-y-2">
                    {phase.tasks.map((task, taskIdx) => (
                      <li key={taskIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Timeline Notes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Total process typically takes 4-8 weeks from application to energization</li>
                <li>• Utility engineering review can add 2-4 weeks for complex installations</li>
                <li>• Weather and utility crew availability affect connection timeline</li>
                <li>• Expedited service may be available for additional fees</li>
              </ul>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Electrical Calculators</h2>
              <p className="text-gray-600">Complete your electrical service planning with these tools</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/calculators/residential-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Home className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Load Calculator</h3>
                <p className="text-sm text-gray-600">Calculate service size</p>
              </Link>
              
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