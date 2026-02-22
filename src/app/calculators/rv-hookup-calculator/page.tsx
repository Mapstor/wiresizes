import { Metadata } from 'next';
import { RVHookupCalculator } from '@/components/calculators';
import { Truck, Calculator, AlertTriangle, Settings, Target, BookOpen, Users, Shield, Zap, Home, DollarSign, MapPin, Compass, Car } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'RV Hookup Calculator | RV Electrical Service Calculator | Campground Electrical Design',
  description: 'Calculate electrical requirements for RV hookups and service pedestals. Complete RV park electrical calculator with 30A/50A service, GFCI/AFCI requirements, and campground installation guidance.',
  keywords: 'RV hookup calculator, RV electrical service, RV park calculator, recreational vehicle hookup, 30 amp RV service, 50 amp RV service, RV pedestal electrical, campground electrical design',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "RV Hookup Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Calculate electrical requirements for RV outlet installations (30A/50A).",
  "keywords": "RV outlet, RV electrical, NEMA 14-50, TT-30",
  "url": `https://wiresizes.com/calculators/rv-hookup-calculator`,
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

const RV_EXAMPLES = [
  {
    title: 'Standard RV Site - 30A Service',
    scenario: 'Basic RV site with 30A service and utilities',
    specs: 'Service: 30A, Voltage: 120V, Pedestal: Standard',
    loads: 'RV Load: 24A typical, A/C: 13A, Misc: 7A',
    calculation: 'RV Service Requirements:\nNominal Load: 30A @ 120V = 3,600W\nTypical Use: 20-24A continuous\nCircuit: 30A single pole GFCI breaker\nWire: 10 AWG copper (30A rated)\nReceptacle: NEMA TT-30R (RV standard)\nGFCI Protection: Required per NEC 551.41\nPedestal: Weather-resistant enclosure',
    result: '30A GFCI circuit, 10 AWG wire',
    outlet: 'NEMA TT-30R receptacle',
    cost: '$450 pedestal + installation',
    compliance: 'NEC 551.77, 210.8(B)(3)'
  },
  {
    title: 'Premium RV Site - 50A Service',
    scenario: 'Full-service RV site with 50A and amenities',
    specs: 'Service: 50A, Voltage: 120/240V, Full utilities',
    loads: 'Main A/C: 15A, Aux A/C: 12A, Appliances: 18A, Other: 5A',
    calculation: '50A RV Service Calculation:\nTotal Service: 50A @ 240V = 12,000W\nSplit Phase: 25A per leg @ 120V each\nTypical Load: 35-45A total usage\nMain Circuit: 50A double pole GFCI\nWire: 6 AWG copper (65A rated)\nReceptacle: NEMA 14-50R (4-wire)\nNeutral Required: Yes (120V loads)\nGrounding: Equipment ground + ground rod',
    result: '50A GFCI circuit, 6 AWG wire',
    outlet: 'NEMA 14-50R receptacle',
    cost: '$685 pedestal + installation',
    compliance: 'NEC 551.77, 250.32'
  },
  {
    title: 'RV Park Multi-Site Distribution',
    scenario: '10-site RV park electrical distribution',
    specs: 'Mix of 30A/50A sites, main distribution panel',
    loads: '6 × 30A sites, 4 × 50A sites, park lighting, facilities',
    calculation: 'RV Park Load Calculation:\n30A Sites: 6 × 30A = 180A\n50A Sites: 4 × 50A = 200A\nTotal Connected: 380A\nDiversity Factor: 0.41 (NEC 551.73)\nDemand Load: 380A × 0.41 = 156A\nPark Facilities: 40A additional\nTotal Service: 196A → 200A main service\nFeeder: 3/0 AWG copper\nMain Panel: 200A with individual site breakers',
    result: '200A main service',
    outlet: 'Multiple site pedestals',
    cost: '$15,000 complete park electrical',
    compliance: 'NEC 551.73 demand factors'
  },
  {
    title: 'Residential RV Hookup',
    scenario: 'Home RV pad for family motorhome',
    specs: 'Detached RV pad, 50A service from main panel',
    loads: 'RV: 50A max, Pad lighting: 5A, Water pump: 3A',
    calculation: 'Residential RV Installation:\nRV Load: 50A dedicated service\nAuxiliary Loads: 8A (lights, pump)\nTotal Feeder: 58A → 60A circuit\nSubpanel Option: 60A panel at RV pad\nFeeder Wire: 6 AWG copper (main house to pad)\nDistance Consideration: Voltage drop\nGFCI Protection: Required for RV outlet\nSeparate Disconnect: Required if >50ft',
    result: '60A feeder, 6 AWG wire',
    outlet: '14-50R + 120V outlets',
    cost: '$850 + trenching/conduit',
    compliance: 'NEC 551.77, residential'
  },
  {
    title: 'Commercial RV Service Center',
    scenario: 'RV service facility with multiple bays',
    specs: '8 service bays, 50A each, 3-phase power',
    loads: 'Service bays: 8 × 50A, Lighting: 60A, Tools: 100A',
    calculation: 'Commercial RV Facility:\nRV Services: 8 × 50A = 400A\nFacility Loads: 160A\nTotal Connected: 560A\nRV Diversity: 400A × 0.5 = 200A\nCommercial Loads: 160A @ 100%\nTotal Demand: 360A\nMain Service: 400A, 3-phase\nFeeders: Multiple 50A circuits\nDistribution: 400A panelboard\nGrounding: Enhanced system',
    result: '400A 3-phase service',
    outlet: 'Multiple 50A outlets',
    cost: '$35,000 complete facility',
    compliance: 'NEC 551, commercial codes'
  },
  {
    title: 'Government/Military RV Facilities',
    scenario: 'Military base RV park, 20 sites',
    specs: 'Secure facility, standardized installations',
    loads: '20 × 50A sites, facilities, security systems',
    calculation: 'Military RV Park Design:\nRV Sites: 20 × 50A = 1,000A connected\nDiversity per NEC 551.73: 0.41\nRV Demand: 1,000A × 0.41 = 410A\nFacilities: 80A (laundry, office, security)\nTotal Load: 490A\nMain Service: 600A (growth factor)\nRedundancy: Dual feed consideration\nSecurity: Tamper-resistant pedestals\nCompliance: Military standards + NEC',
    result: '600A main service',
    outlet: '20 standardized pedestals',
    cost: '$55,000 complete installation',
    compliance: 'NEC + military specifications'
  }
];

const RV_SERVICE_TYPES = [
  {
    service: '20A Standard',
    voltage: '120V',
    outlet: 'NEMA 5-20R',
    wire: '12 AWG',
    use: 'Small travel trailers, tent camping',
    gfci: 'Required'
  },
  {
    service: '30A RV Service',
    voltage: '120V',
    outlet: 'NEMA TT-30R',
    wire: '10 AWG',
    use: 'Most travel trailers, small motorhomes',
    gfci: 'Required'
  },
  {
    service: '50A RV Service',
    voltage: '120/240V',
    outlet: 'NEMA 14-50R',
    wire: '6 AWG',
    use: 'Large motorhomes, luxury RVs',
    gfci: 'Required'
  },
  {
    service: '50A Welder Style',
    voltage: '240V',
    outlet: 'NEMA 6-50R',
    wire: '6 AWG',
    use: 'Specialty RVs (rare)',
    gfci: 'Required'
  }
];

const PEDESTAL_COMPONENTS = [
  {
    component: 'Main Enclosure',
    specification: 'NEMA 3R rated, stainless steel or aluminum',
    function: 'Weather protection, tamper resistance',
    cost: '$180-$350'
  },
  {
    component: 'Circuit Breakers',
    specification: '30A/50A GFCI breakers, UL listed',
    function: 'Overcurrent and ground fault protection',
    cost: '$85-$150'
  },
  {
    component: 'Receptacles',
    specification: 'TT-30R and/or 14-50R, weather-resistant',
    function: 'RV power connection points',
    cost: '$45-$85'
  },
  {
    component: 'Grounding System',
    specification: 'Ground rod, bonding conductors',
    function: 'Electrical safety and code compliance',
    cost: '$65-$120'
  },
  {
    component: 'Cable/Water/Sewer',
    specification: 'Coax, water, sewer connections',
    function: 'Complete RV site utilities',
    cost: '$150-$400'
  }
];

const CAMPGROUND_ELECTRICAL = [
  {
    capacity: '10 Sites (Mixed)',
    distribution: '6 × 30A, 4 × 50A',
    demand: '156A calculated',
    service: '200A main panel',
    cost: '$8,500-$12,000'
  },
  {
    capacity: '25 Sites (Standard)',
    distribution: '15 × 30A, 10 × 50A',
    demand: '365A calculated',
    service: '400A main service',
    cost: '$18,000-$25,000'
  },
  {
    capacity: '50 Sites (Large)',
    distribution: '20 × 30A, 30 × 50A',
    demand: '697A calculated',
    service: '800A service + transformers',
    cost: '$35,000-$50,000'
  },
  {
    capacity: '100+ Sites (Resort)',
    distribution: 'Multiple distribution points',
    demand: 'Sectioned load calculation',
    service: 'Multiple services/transformers',
    cost: '$75,000-$150,000'
  }
];

const GFCI_AFCI_REQUIREMENTS = [
  {
    protection: 'GFCI Protection',
    requirement: 'Required for all RV receptacles',
    standard: 'NEC 551.41, 210.8(B)(3)',
    implementation: 'GFCI breakers or receptacles',
    testing: 'Monthly test recommended'
  },
  {
    protection: 'AFCI Protection',
    requirement: 'Required in some jurisdictions',
    standard: 'NEC 210.12 - varies by location',
    implementation: 'AFCI/GFCI combination breakers',
    testing: 'Test per manufacturer instructions'
  },
  {
    protection: 'Surge Protection',
    requirement: 'Recommended for RV parks',
    standard: 'NEC 285 - optional but beneficial',
    implementation: 'Panel-mounted SPDs',
    testing: 'Annual inspection recommended'
  }
];

const INSTALLATION_COSTS = [
  {
    component: 'Basic 30A Pedestal',
    range: '$350-$550',
    factors: 'Enclosure, breaker, outlet, basic installation'
  },
  {
    component: 'Deluxe 50A Pedestal',
    range: '$550-$850',
    factors: '50A service, cable/water/sewer hookups'
  },
  {
    component: 'Underground Electrical',
    range: '$8-$15/ft',
    factors: 'Trenching, conduit, wire, backfill'
  },
  {
    component: 'Main Distribution Panel',
    range: '$2,500-$5,000',
    factors: 'Panel size, breakers, main disconnect'
  },
  {
    component: 'Site Preparation',
    range: '$200-$500',
    factors: 'Grading, gravel pad, site utilities'
  },
  {
    component: 'Complete Site (avg)',
    range: '$1,200-$2,200',
    factors: 'All utilities, installed and inspected'
  }
];

const CODE_COMPLIANCE = [
  {
    code: 'NEC Article 551',
    scope: 'Recreational Vehicles and Parks',
    keyRequirements: 'GFCI protection, proper outlets, grounding',
    inspection: 'Required for new installations'
  },
  {
    code: 'Local Building Codes',
    scope: 'Varies by jurisdiction',
    keyRequirements: 'Permits, setbacks, zoning compliance',
    inspection: 'Local authority having jurisdiction'
  },
  {
    code: 'NFPA 70',
    scope: 'National Electrical Code',
    keyRequirements: 'General electrical safety standards',
    inspection: 'Standard electrical inspection'
  },
  {
    code: 'State Amendments',
    scope: 'State-specific modifications',
    keyRequirements: 'Varies by state adoption',
    inspection: 'State or local inspector'
  }
];

const MAINTENANCE_SCHEDULE = [
  {
    interval: 'Weekly (Season)',
    task: 'Visual inspection of pedestals',
    details: 'Check for damage, loose covers, water intrusion',
    responsibility: 'Park maintenance staff'
  },
  {
    interval: 'Monthly',
    task: 'GFCI test all pedestals',
    details: 'Test/reset all GFCI devices, log results',
    responsibility: 'Qualified maintenance person'
  },
  {
    interval: 'Quarterly',
    task: 'Tighten electrical connections',
    details: 'Check and torque all connections to spec',
    responsibility: 'Licensed electrician recommended'
  },
  {
    interval: 'Annually',
    task: 'Complete electrical inspection',
    details: 'Professional inspection, testing, documentation',
    responsibility: 'Licensed electrician required'
  },
  {
    interval: 'As Needed',
    task: 'Replace damaged components',
    details: 'Outlets, breakers, enclosures as needed',
    responsibility: 'Qualified electrical contractor'
  }
];

const TROUBLESHOOTING_GUIDE = [
  {
    problem: 'GFCI keeps tripping',
    causes: 'Ground fault, moisture, damaged cord, faulty RV',
    diagnosis: 'Test with different RV, check for moisture',
    solution: 'Repair ground fault, seal pedestal, replace GFCI'
  },
  {
    problem: 'No power to RV',
    causes: 'Tripped breaker, bad connection, failed outlet',
    diagnosis: 'Check breaker, test outlet voltage',
    solution: 'Reset breaker, repair connections, replace outlet'
  },
  {
    problem: 'Low voltage at RV',
    causes: 'Voltage drop, loose connections, overloaded circuit',
    diagnosis: 'Measure voltage under load',
    solution: 'Upsize wire, repair connections, check main service'
  },
  {
    problem: 'Pedestal corrosion',
    causes: 'Salt air, poor drainage, damaged seals',
    diagnosis: 'Visual inspection of components',
    solution: 'Replace corroded parts, improve drainage, seal'
  }
];

const REGIONAL_VARIATIONS = [
  {
    region: 'Florida/Gulf Coast',
    challenges: 'Hurricane resistance, salt air corrosion',
    requirements: 'Wind load ratings, corrosion-resistant materials',
    solutions: 'Stainless steel pedestals, extra ground rods'
  },
  {
    region: 'Northern States',
    challenges: 'Frost heave, freeze protection',
    requirements: 'Deep burial, heated pedestals optional',
    solutions: 'Below frost line installation, heater options'
  },
  {
    region: 'Desert Southwest',
    challenges: 'UV exposure, extreme heat, dust',
    requirements: 'UV-rated materials, ventilation',
    solutions: 'Aluminum pedestals, dust sealing, ventilation'
  },
  {
    region: 'Mountain/High Altitude',
    challenges: 'Weather extremes, accessibility',
    requirements: 'Cold weather materials, snow load',
    solutions: 'Heavy-duty enclosures, accessible installation'
  }
];

const COMPREHENSIVE_FAQS = [
  {
    question: 'What is the difference between 30A and 50A RV service?',
    answer: '30A RV service provides 120V single-phase power through a NEMA TT-30R outlet, suitable for smaller RVs and travel trailers. 50A RV service provides 120/240V split-phase power through a NEMA 14-50R outlet, allowing larger RVs to run multiple air conditioners and high-power appliances simultaneously.'
  },
  {
    question: 'Do I need GFCI protection for RV outlets?',
    answer: 'Yes, NEC 551.41 requires GFCI protection for all RV receptacles. This can be provided by GFCI breakers in the panel or GFCI receptacles. The protection is critical for safety around RVs where people may be in contact with the ground and metal surfaces.'
  },
  {
    question: 'How do I calculate the electrical load for an RV park?',
    answer: 'Use NEC 551.73 diversity factors: calculate total connected load, then apply demand factors (typically 41% for the RV portion). Add any park facilities (lighting, laundry, office) at 100%. This determines the main service size needed for the park.'
  },
  {
    question: 'What type of pedestal should I use for RV sites?',
    answer: 'Use NEMA 3R rated pedestals with weather-resistant construction. Stainless steel or powder-coated aluminum are preferred. Include appropriate outlets (TT-30R and/or 14-50R), GFCI breakers, and provisions for cable/water/sewer connections as needed.'
  },
  {
    question: 'Can I install my own RV electrical hookup?',
    answer: 'While some areas allow homeowner electrical work, RV installations involve specialized outlets and GFCI requirements. Most jurisdictions require permits and inspection. For safety and code compliance, professional installation by a licensed electrician is strongly recommended.'
  },
  {
    question: 'How deep should RV park electrical be buried?',
    answer: 'Follow NEC Table 300.5 for burial depths. Typically 24" for direct burial cable or 18" for cable in conduit. In areas with frost, go below the frost line. Always check local codes as some areas require deeper burial or concrete encasement for protection.'
  }
];

export default function RVHookupCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['rv-hookup-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-10 h-10" />
                <h1 className="text-4xl font-bold">RV Hookup Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-indigo-50">
                Calculate electrical requirements for RV hookups and recreational vehicle service pedestals. 
                Complete campground electrical design with 30A/50A services, GFCI protection, and code compliance.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-indigo-100">NEC Article 551</div>
                  <div className="font-semibold">RV Electrical Code</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-indigo-100">Service Types</div>
                  <div className="font-semibold">30A / 50A</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-indigo-100">GFCI Required</div>
                  <div className="font-semibold">All RV Outlets</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-indigo-100">Applications</div>
                  <div className="font-semibold">Parks, Residential</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Safety Information */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-indigo-900 mb-2">RV Electrical Safety Requirements</h2>
                <ul className="text-indigo-800 space-y-1 text-sm">
                  <li>• All RV outlets must have GFCI protection per NEC 551.41</li>
                  <li>• Use proper NEMA outlets: TT-30R for 30A, 14-50R for 50A service</li>
                  <li>• Weather-resistant pedestals required for outdoor installations</li>
                  <li>• Proper grounding and bonding critical for RV safety</li>
                  <li>• Regular GFCI testing required - monthly recommended for parks</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <RVHookupCalculator />

          {/* Comprehensive Installation Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">RV Installation Examples</h2>
            </div>
            
            <div className="grid gap-8">
              {RV_EXAMPLES.map((example, idx) => (
                <div key={idx} className="border-l-4 border-indigo-500 bg-indigo-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{example.title}</h3>
                      <p className="text-indigo-700 font-medium mb-2">{example.scenario}</p>
                      <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Specifications:</span> {example.specs}</p>
                      <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Typical Loads:</span> {example.loads}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-indigo-600 mb-1">{example.result}</div>
                      <div className="text-sm text-gray-500 mb-1">{example.outlet}</div>
                      <div className="text-sm text-orange-600 mb-1">{example.cost}</div>
                      <div className="text-xs text-blue-600">{example.compliance}</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Installation Details:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-line font-mono">{example.calculation}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RV Service Types */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">RV Service Types & Requirements</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Service Rating</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Voltage</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Outlet Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Wire Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Typical Use</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">GFCI</th>
                  </tr>
                </thead>
                <tbody>
                  {RV_SERVICE_TYPES.map((service, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-purple-600">{service.service}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{service.voltage}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-blue-600">{service.outlet}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-green-600">{service.wire}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{service.use}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-red-600">{service.gfci}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pedestal Components */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">RV Pedestal Components</h2>
            </div>
            
            <div className="space-y-6">
              {PEDESTAL_COMPONENTS.map((component, idx) => (
                <div key={idx} className="border-l-4 border-orange-500 bg-orange-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{component.component}</h3>
                      <p className="text-orange-700 font-medium mb-2">{component.specification}</p>
                      <p className="text-sm text-gray-600">{component.function}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-green-600">{component.cost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campground Electrical Sizing */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Compass className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Campground Electrical Sizing Guide</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Park Capacity</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Site Distribution</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Demand Load</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Service Required</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Estimated Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {CAMPGROUND_ELECTRICAL.map((park, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-green-600">{park.capacity}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{park.distribution}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-blue-600">{park.demand}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-red-600">{park.service}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-green-600">{park.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GFCI/AFCI Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">GFCI & AFCI Protection Requirements</h2>
            </div>
            
            <div className="space-y-6">
              {GFCI_AFCI_REQUIREMENTS.map((req, idx) => (
                <div key={idx} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{req.protection}</h3>
                    <span className="text-xs bg-red-100 px-2 py-1 rounded font-medium">{req.standard}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Requirement:</span> {req.requirement}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Implementation:</span> {req.implementation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600"><span className="font-medium">Testing:</span> {req.testing}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Installation Costs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">RV Installation Cost Guide</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {INSTALLATION_COSTS.map((cost, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{cost.component}</h3>
                    <span className="font-bold text-green-600">{cost.range}</span>
                  </div>
                  <p className="text-sm text-gray-600">{cost.factors}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Code Compliance */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Code Compliance & Inspection</h2>
            </div>
            
            <div className="space-y-6">
              {CODE_COMPLIANCE.map((code, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{code.code}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Scope:</span> {code.scope}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Key Requirements:</span> {code.keyRequirements}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600"><span className="font-medium">Inspection:</span> {code.inspection}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Schedule */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">RV Park Maintenance Schedule</h2>
            </div>
            
            <div className="space-y-4">
              {MAINTENANCE_SCHEDULE.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="w-24 text-sm font-medium text-orange-600 flex-shrink-0">{item.interval}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{item.task}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                    <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800">
                      {item.responsibility}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Common RV Electrical Issues</h2>
            </div>
            
            <div className="space-y-6">
              {TROUBLESHOOTING_GUIDE.map((issue, idx) => (
                <div key={idx} className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{issue.problem}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Common Causes:</h4>
                      <p className="text-sm text-gray-600">{issue.causes}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Diagnosis:</h4>
                      <p className="text-sm text-gray-600">{issue.diagnosis}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Solution:</h4>
                      <p className="text-sm text-gray-600">{issue.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Considerations */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Regional Installation Considerations</h2>
            </div>
            
            <div className="space-y-6">
              {REGIONAL_VARIATIONS.map((region, idx) => (
                <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">{region.region}</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-purple-800 mb-1">Challenges:</h4>
                      <p className="text-sm text-gray-600">{region.challenges}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800 mb-1">Requirements:</h4>
                      <p className="text-sm text-gray-600">{region.requirements}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800 mb-1">Solutions:</h4>
                      <p className="text-sm text-gray-600">{region.solutions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {COMPREHENSIVE_FAQS.map((faq, idx) => (
                <details key={idx} className="group bg-gray-50 rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-100 rounded-lg">
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
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
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Electrical Calculators</h2>
              <p className="text-gray-600">Complete your outdoor electrical design</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Size Calculator</h3>
                <p className="text-xs text-gray-600">Calculate wire AWG</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Target className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Long run calculations</p>
              </Link>
              
              <Link href="/calculators/garage-subpanel-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Home className="w-8 h-8 text-emerald-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Subpanel</h3>
                <p className="text-xs text-gray-600">Detached building</p>
              </Link>
              
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service sizing</p>
              </Link>
              
              <Link href="/calculators/three-phase-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">3-Phase Power</h3>
                <p className="text-xs text-gray-600">Large RV parks</p>
              </Link>
              
              <Link href="/calculators/conduit-fill-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Conduit Fill</h3>
                <p className="text-xs text-gray-600">Underground runs</p>
              </Link>
              
              <Link href="/calculators/ampacity-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Settings className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Ampacity</h3>
                <p className="text-xs text-gray-600">Wire capacity</p>
              </Link>
              
              <Link href="/calculators/hot-tub-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Car className="w-8 h-8 text-cyan-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Hot Tub</h3>
                <p className="text-xs text-gray-600">Spa electrical</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
