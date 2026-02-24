import { Metadata } from 'next';
import { EVChargerCalculator } from '@/components/calculators';
import { Zap, Car, Calculator, AlertTriangle, Settings, Target, BookOpen, Users, Shield, MapPin } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'EV Charger Calculator | Electric Vehicle Charging Circuit Calculator',
  description: 'Calculate wire size and circuit requirements for EV charging stations. NEC Article 625 compliant EV charger calculator for Level 1 and Level 2 charging installations.',
  keywords: 'EV charger calculator, electric vehicle charging, EVSE wire size, EV charging circuit, Level 2 charger installation, NEC Article 625, Tesla charger wire size',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Electric Vehicle Charger Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Complete EV charger installation calculator for wire, breaker, and outlet sizing.",
  "keywords": "EV charging, Tesla charger, NEMA 14-50",
  "url": `https://wiresizes.com/calculators/ev-charger-calculator`,
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

const EV_CHARGER_EXAMPLES = [
  {
    title: 'Tesla Model 3 Home Charging',
    scenario: '32A EVSE, 25ft garage run, 240V',
    calculation: 'Continuous Load: 32A × 1.25 = 40A circuit required\nWire Size: 8 AWG copper (50A capacity)\nVoltage Drop: 32A × 25ft × 2.6Ω/1000ft ÷ 240V = 0.87%\nBreaker: 40A double-pole GFCI\nConduit: 3/4" EMT for three 8 AWG + ground',
    result: '40A circuit, 8 AWG wire',
    chargingSpeed: '~30 miles per hour',
    cost: '$450 materials + installation',
    application: 'Residential Level 2 charging'
  },
  {
    title: 'Universal Level 2 EVSE',
    scenario: '40A EVSE, 50ft detached garage, underground',
    calculation: 'Continuous Load: 40A × 1.25 = 50A circuit\nWire Size: 6 AWG copper (65A capacity)\nVoltage Drop: 40A × 50ft × 1.6Ω/1000ft ÷ 240V = 1.33%\nUnderground: USE-2 direct burial\nGFCI Protection: 50A GFCI breaker required',
    result: '50A circuit, 6 AWG wire',
    chargingSpeed: '~40 miles per hour',
    cost: '$750 materials + trenching',
    application: 'Detached garage Level 2'
  },
  {
    title: 'Multiple EV Charging',
    scenario: 'Two 32A EVSEs, load sharing system',
    calculation: 'Without Load Management: 2 × 40A = 80A total\nWith Load Sharing: 60A circuit shared\nWire Size: 4 AWG copper (85A capacity)\nLoad sharing controller manages power\nEach EVSE: 32A maximum when both charging',
    result: '60A circuit, 4 AWG wire',
    chargingSpeed: '~25 miles/hr each when both active',
    cost: '$950 + load sharing controller',
    application: 'Dual EV household'
  },
  {
    title: 'Commercial EV Station',
    scenario: '48A three-phase EVSE, 100ft run',
    calculation: '3-Phase Load: 48A continuous\nCircuit: 48A × 1.25 = 60A minimum\nWire: 6 AWG × 3 phases + ground\nVoltage Drop: 48A × 100ft × 1.6Ω/1000ft ÷ (208V × √3) = 2.1%\nProtection: 60A 3-pole GFCI',
    result: '60A 3-phase, 6 AWG',
    chargingSpeed: '~50 miles per hour',
    cost: '$1200 materials + commercial installation',
    application: 'Commercial/workplace charging'
  },
  {
    title: 'High-Power DC Fast Charging',
    scenario: '125A DC fast charger, utility connection',
    calculation: 'Input Power: 50kW at 480V 3-phase\nInput Current: 50000W ÷ (480V × √3) = 60.1A\nCircuit: 60.1A × 1.25 = 75.1A → 80A circuit\nWire: 3 AWG per phase (100A capacity)\nDedicated transformer often required',
    result: '80A 3-phase, 3 AWG',
    chargingSpeed: '200+ miles in 30 minutes',
    cost: '$5000+ plus transformer',
    application: 'Commercial DC fast charging'
  },
  {
    title: 'RV Park EV Ready',
    scenario: '30A/50A combination outlet with EV capability',
    calculation: 'RV: 50A 240V service\nEV Add-on: 30A 240V EVSE\nShared Load: 50A main with load management\nWiring: 6 AWG to junction, separate circuits\nEV charges when RV load permits',
    result: '50A main, load managed',
    chargingSpeed: 'Variable based on RV usage',
    cost: '$650 + load controller',
    application: 'RV parks with EV charging'
  }
];

const EV_CHARGING_LEVELS = [
  {
    level: 'Level 1 (120V)',
    voltage: '120V AC',
    current: '12-16A',
    power: '1.4-1.9kW',
    chargingSpeed: '3-5 miles/hour',
    circuitReq: '20A dedicated',
    wireSize: '12 AWG',
    typical: 'Emergency/overnight charging',
    pros: 'Uses standard outlet, low cost',
    cons: 'Very slow charging'
  },
  {
    level: 'Level 2 (240V)',
    voltage: '240V AC',
    current: '16-80A',
    power: '3.8-19.2kW',
    chargingSpeed: '10-60 miles/hour',
    circuitReq: '20-100A',
    wireSize: '12-3 AWG',
    typical: 'Home and workplace',
    pros: 'Practical speed, reasonable cost',
    cons: 'Requires 240V installation'
  },
  {
    level: 'DC Fast (Level 3)',
    voltage: '400-800V DC',
    current: '50-350A',
    power: '20-350kW',
    chargingSpeed: '60-1000 miles/hour',
    circuitReq: 'Commercial 3-phase',
    wireSize: 'Large feeders',
    typical: 'Highway charging stations',
    pros: 'Rapid charging',
    cons: 'Very expensive, utility coordination'
  }
];

const NEC_625_REQUIREMENTS = [
  {
    requirement: 'Continuous Load Sizing',
    necSection: '625.41',
    rule: '125% of rated current',
    example: '32A EVSE needs 40A circuit',
    reasoning: 'EVs charge continuously for hours'
  },
  {
    requirement: 'GFCI Protection',
    necSection: '625.54',
    rule: 'Required for all EV outlets',
    example: 'GFCI breaker or GFCI outlet',
    reasoning: 'Personnel protection in potentially wet locations'
  },
  {
    requirement: 'Disconnecting Means',
    necSection: '625.43',
    rule: 'Within sight of EVSE',
    example: 'Circuit breaker serves as disconnect',
    reasoning: 'Service and emergency disconnection'
  },
  {
    requirement: 'Grounding',
    necSection: '625.15',
    rule: 'Equipment grounding required',
    example: '10 AWG ground for 50A circuit',
    reasoning: 'Fault protection and safety'
  },
  {
    requirement: 'Cord Length',
    necSection: '625.17',
    rule: '25 feet maximum for Level 2',
    example: 'Hardwired or cord-connected',
    reasoning: 'Flexibility vs. safety considerations'
  },
  {
    requirement: 'Load Management',
    necSection: '625.42',
    rule: 'Permitted for multiple EVSEs',
    example: 'Smart sharing between chargers',
    reasoning: 'Reduces electrical service requirements'
  }
];

const POPULAR_EV_MODELS = [
  {
    vehicle: 'Tesla Model 3/Y',
    onboardCharger: '11.5kW',
    maxLevel2Current: '48A',
    recommendedEVSE: '48A (60A circuit)',
    batterySize: '54-82 kWh',
    chargingTime0to100: '7-11 hours',
    milesPerHour: '44 miles/hour'
  },
  {
    vehicle: 'Tesla Model S/X',
    onboardCharger: '11.5kW',
    maxLevel2Current: '48A',
    recommendedEVSE: '48A (60A circuit)',
    batterySize: '95-100 kWh',
    chargingTime0to100: '8-11 hours',
    milesPerHour: '44 miles/hour'
  },
  {
    vehicle: 'Chevrolet Bolt',
    onboardCharger: '7.2kW',
    maxLevel2Current: '32A',
    recommendedEVSE: '32A (40A circuit)',
    batterySize: '65 kWh',
    chargingTime0to100: '9 hours',
    milesPerHour: '25 miles/hour'
  },
  {
    vehicle: 'Ford F-150 Lightning',
    onboardCharger: '9.6kW',
    maxLevel2Current: '40A',
    recommendedEVSE: '48A (60A circuit)',
    batterySize: '98-131 kWh',
    chargingTime0to100: '10-14 hours',
    milesPerHour: '30 miles/hour'
  },
  {
    vehicle: 'BMW i4/iX',
    onboardCharger: '11kW',
    maxLevel2Current: '46A',
    recommendedEVSE: '48A (60A circuit)',
    batterySize: '70-106 kWh',
    chargingTime0to100: '7-10 hours',
    milesPerHour: '40 miles/hour'
  },
  {
    vehicle: 'Nissan Leaf',
    onboardCharger: '6.6kW',
    maxLevel2Current: '27.5A',
    recommendedEVSE: '32A (40A circuit)',
    batterySize: '40-62 kWh',
    chargingTime0to100: '7.5-11 hours',
    milesPerHour: '22 miles/hour'
  }
];

const EVSE_INSTALLATION_COSTS = [
  {
    component: 'Basic Level 2 EVSE (32A)',
    cost: '$400-700',
    notes: 'Hardwired unit, basic features'
  },
  {
    component: 'Smart EVSE (32A)',
    cost: '$600-1200',
    notes: 'WiFi, app control, scheduling'
  },
  {
    component: 'High-Power EVSE (48A)',
    cost: '$800-1500',
    notes: 'Maximum charging speed'
  },
  {
    component: 'Electrical Panel Upgrade',
    cost: '$1500-3000',
    notes: 'If current panel insufficient'
  },
  {
    component: 'Circuit Installation (inside)',
    cost: '$300-800',
    notes: '50ft run, normal complexity'
  },
  {
    component: 'Circuit Installation (outside)',
    cost: '$500-1500',
    notes: 'Weather protection, trenching'
  },
  {
    component: 'Permits & Inspection',
    cost: '$100-400',
    notes: 'Varies by jurisdiction'
  },
  {
    component: 'Load Management System',
    cost: '$400-800',
    notes: 'For multiple EVSEs'
  }
];

const COMPREHENSIVE_FAQS = [
  {
    question: 'What size circuit do I need for a 32A EV charger?',
    answer: 'A 32A EVSE requires a 40A circuit per NEC 625.41 (125% continuous load rule). Use 8 AWG copper wire with a 40A breaker. This provides about 7.7kW charging power and 25-30 miles of range per hour for most EVs.'
  },
  {
    question: 'Can I install an EV charger myself?',
    answer: 'While some jurisdictions allow homeowner installation, most require a licensed electrician due to high-current 240V circuits and GFCI requirements. DIY is typically limited to plugging in a portable EVSE to an existing 240V outlet.'
  },
  {
    question: 'Do I need GFCI protection for EV charging?',
    answer: 'Yes, NEC Article 625 requires GFCI protection for all EV charging equipment. Use a GFCI breaker or GFCI outlet. This protects against electrical shock in potentially wet garage or outdoor locations.'
  },
  {
    question: 'What\'s the difference between EVSE and EV charger?',
    answer: 'EVSE (Electric Vehicle Supply Equipment) is the correct term for the "charging station." The actual charger is inside the vehicle. The EVSE provides power and communication to the vehicle\'s onboard charger.'
  },
  {
    question: 'Can I charge two EVs from one circuit?',
    answer: 'Yes, using load management systems that share available power between multiple EVSEs. This allows a 60A circuit to power two 32A EVSEs by automatically reducing current when both vehicles charge simultaneously.'
  },
  {
    question: 'What about voltage drop for long runs?',
    answer: 'Keep voltage drop under 3% for optimal charging. For a 32A EVSE over 50+ feet, upsize from 8 AWG to 6 AWG. Long underground runs may need 4 AWG or larger wire to maintain proper voltage.'
  },
  {
    question: 'How do I size my electrical panel for EV charging?',
    answer: 'Add the EVSE load to your existing calculated load. A 40A EVSE adds 9.6kW continuous load. Many homes need panel upgrades from 100A to 200A service to accommodate Level 2 charging.'
  },
  {
    question: 'What about charging in cold weather?',
    answer: 'Cold weather reduces battery efficiency and charging speed. EVSEs should be rated for outdoor use if installed outside. Some smart EVSEs can precondition the battery using grid power before driving.'
  }
];

export default function EVChargerCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['ev-charger-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-full px-4 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8 py-8 lg:py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="max-w-full lg:max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Car className="w-10 h-10" />
                <h1 className="text-4xl font-bold">EV Charger Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-green-50">
                Calculate circuit requirements for electric vehicle charging installations. NEC Article 625 compliant 
                calculations for Level 1, Level 2, and DC fast charging systems.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">NEC Article 625</div>
                  <div className="font-semibold">Code Compliant</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">Charging Levels</div>
                  <div className="font-semibold">Level 1, 2 & 3</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">Load Management</div>
                  <div className="font-semibold">Multiple EVSE</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">Installation Types</div>
                  <div className="font-semibold">Indoor & Outdoor</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Information */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-green-900 mb-2">EV Charging Installation Requirements</h2>
                <ul className="text-green-800 space-y-1 text-sm">
                  <li>• EV charging is continuous load - circuits must be sized at 125% of EVSE rating</li>
                  <li>• GFCI protection required per NEC 625.54 for all EV supply equipment</li>
                  <li>• Dedicated circuit required - no other loads on EV charging circuit</li>
                  <li>• Most installations require electrical permits and professional installation</li>
                  <li>• Consider future needs - installing higher capacity costs little more initially</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <EVChargerCalculator />

          {/* Real-World Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">EV Charging Installation Examples</h2>
            </div>
            
            <div className="grid gap-6">
              {EV_CHARGER_EXAMPLES.map((example, idx) => (
                <div key={idx} className="border-l-4 border-green-500 bg-green-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{example.title}</h3>
                      <p className="text-green-700 font-medium">{example.scenario}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{example.result}</div>
                      <div className="text-sm text-gray-500">{example.chargingSpeed}</div>
                      <div className="text-sm text-orange-600 font-medium">{example.cost}</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-line font-mono">{example.calculation}</pre>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Application: </span>{example.application}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EV Charging Levels */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">EV Charging Levels Comparison</h2>
            </div>
            
            <div className="grid gap-6">
              {EV_CHARGING_LEVELS.map((level, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-blue-50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl">{level.level}</h3>
                      <div className="text-blue-600 font-medium">{level.voltage} • {level.current} • {level.power}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{level.chargingSpeed}</div>
                      <div className="text-sm text-gray-500">charging speed</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Circuit: {level.circuitReq}</div>
                      <div className="text-sm font-medium text-gray-700">Wire: {level.wireSize}</div>
                      <div className="text-sm text-gray-600">Typical Use: {level.typical}</div>
                    </div>
                    <div>
                      <div className="text-sm text-green-600">✓ {level.pros}</div>
                      <div className="text-sm text-red-600">✗ {level.cons}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEC Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">NEC Article 625 Requirements</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-red-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Requirement</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">NEC Section</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Rule</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Example</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Reasoning</th>
                  </tr>
                </thead>
                <tbody>
                  {NEC_625_REQUIREMENTS.map((req, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{req.requirement}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-red-600">{req.necSection}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{req.rule}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-green-600">{req.example}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{req.reasoning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Popular EVs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Car className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Popular EV Models & Charging Specs</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Vehicle</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Onboard Charger</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Max Current</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Recommended EVSE</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Battery Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">0-100% Time</th>
                  </tr>
                </thead>
                <tbody>
                  {POPULAR_EV_MODELS.map((ev, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{ev.vehicle}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-blue-600">{ev.onboardCharger}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{ev.maxLevel2Current}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-green-600">{ev.recommendedEVSE}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{ev.batterySize}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-orange-600">{ev.chargingTime0to100}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Installation Costs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">EV Charger Installation Costs</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {EVSE_INSTALLATION_COSTS.map((cost, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-green-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{cost.component}</h3>
                    <div className="font-bold text-green-600">{cost.cost}</div>
                  </div>
                  <p className="text-sm text-gray-600">{cost.notes}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-green-100 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Total Installation Costs:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Basic Level 2 installation: $1,000-2,500 total</li>
                <li>• High-end smart charger: $1,500-3,500 total</li>
                <li>• Panel upgrade add: $1,500-3,000 additional</li>
                <li>• Detached garage: $2,000-4,000 total</li>
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
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Electrical Calculators</h2>
              <p className="text-gray-600">Complete your EV charging installation planning</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Sizing</h3>
                <p className="text-xs text-gray-600">Calculate AWG size</p>
              </Link>
              
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service sizing</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Target className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Check losses</p>
              </Link>
              
              <Link href="/calculators/conduit-fill-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Settings className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Conduit Fill</h3>
                <p className="text-xs text-gray-600">Wire capacity</p>
              </Link>
              
              <Link href="/calculators/garage-subpanel-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <MapPin className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Garage Subpanel</h3>
                <p className="text-xs text-gray-600">Detached garage</p>
              </Link>
              
              <Link href="/calculators/ampacity-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Ampacity</h3>
                <p className="text-xs text-gray-600">Wire capacity</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}