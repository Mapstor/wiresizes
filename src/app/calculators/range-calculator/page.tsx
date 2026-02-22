import { Metadata } from 'next';
import { RangeCalculator } from '@/components/calculators';
import { Flame, Calculator, AlertTriangle, Settings, Target, BookOpen, Users, Shield, Zap, ChefHat, Home, DollarSign, MapPin } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Electric Range Calculator | Range Circuit Calculator | NEC 220.55 Kitchen Appliances',
  description: 'Calculate wire size and circuit requirements for electric ranges, cooktops, and ovens. Professional kitchen appliance electrical calculator with NEC 220.55 demand factors and 3-wire vs 4-wire installations.',
  keywords: 'range calculator, electric range circuit, cooktop wire size, kitchen appliance calculator, NEC 220.55, range demand factor, oven circuit calculator, electric stove wiring',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Electric Range Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Calculate wire size for electric ranges, ovens, and cooktops per NEC.",
  "keywords": "range wiring, stove electrical, kitchen appliances",
  "url": `https://wiresizes.com/calculators/range-calculator`,
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

const RANGE_EXAMPLES = [
  {
    title: 'Standard Electric Range - 40A',
    scenario: '8.5kW range, 240V single unit',
    specs: 'Power: 8,500W, Voltage: 240V, Connection: 4-wire',
    calculation: 'Basic Load: 8,500W ÷ 240V = 35.4A\nNEC 220.55 Demand: First 8kW @ 100% = 33.3A\nAdditional 0.5kW @ 80% = 1.7A\nTotal Demand: 33.3A + 1.7A = 35.0A\nCircuit Size: 35.0A → 40A breaker\nWire Size: 8 AWG copper (50A capacity)\nReceptacle: NEMA 14-50R (4-wire)',
    result: '40A circuit, 8 AWG wire',
    outlet: 'NEMA 14-50R receptacle',
    cost: '$350 circuit + installation',
    compliance: 'NEC 220.55, 210.19(A)(3)'
  },
  {
    title: 'Large Electric Range - 50A',
    scenario: '12kW high-end range with double ovens',
    specs: 'Power: 12,000W, Features: Convection, induction cooktop',
    calculation: 'Nameplate Rating: 12,000W ÷ 240V = 50A\nNEC 220.55 Demand Calculation:\nFirst 8kW @ 100% = 33.3A\nNext 4kW @ 80% = 13.3A\nTotal Demand: 33.3A + 13.3A = 46.6A\nCircuit: 46.6A → 50A breaker required\nWire: 6 AWG copper (65A capacity)\nDirect connection preferred for large units',
    result: '50A circuit, 6 AWG wire',
    outlet: 'Direct hardwired connection',
    cost: '$485 + hardwire installation',
    compliance: 'NEC 220.55, 422.16(B)(2)'
  },
  {
    title: 'Separate Cooktop & Wall Oven',
    scenario: '6kW cooktop + 5kW wall oven, separate circuits',
    specs: 'Cooktop: 6,000W induction, Oven: 5,000W convection',
    calculation: 'Cooktop Circuit:\n6,000W ÷ 240V = 25A → 30A circuit\nWire: 10 AWG copper\n\nWall Oven Circuit:\n5,000W ÷ 240V = 20.8A → 25A circuit\nWire: 12 AWG copper\n\nTotal Load (if combined): 11kW\nDemand: 8kW @ 100% + 3kW @ 80% = 43.3A\nSeparate circuits preferred for flexibility',
    result: '30A + 25A circuits',
    outlet: '6-30R + 6-25R outlets',
    cost: '$650 for both circuits',
    compliance: 'NEC 220.55, separate appliances'
  },
  {
    title: 'Commercial Range - 60A',
    scenario: '15kW commercial-style range, residential',
    specs: 'Power: 15,000W, 6 burners + double oven',
    calculation: 'Commercial-Style Residential:\nNameplate: 15,000W ÷ 240V = 62.5A\nNEC 220.55 Demand:\nFirst 8kW @ 100% = 33.3A\nNext 7kW @ 80% = 23.3A\nTotal: 56.6A → 60A circuit\nWire: 6 AWG copper (65A)\nRequires 60A rated receptacle or hardwire\nOften requires 208V 3-phase in commercial',
    result: '60A circuit, 6 AWG wire',
    outlet: 'Hardwired connection',
    cost: '$550 + heavy-duty installation',
    compliance: 'NEC 220.55, 422.11(E)'
  },
  {
    title: 'Apartment/Condo Range - 30A',
    scenario: '6kW compact electric range',
    specs: 'Power: 6,000W, Space-saving design, 4 burners',
    calculation: 'Compact Range Calculation:\nRated Load: 6,000W ÷ 240V = 25A\nNEC 220.55 applies: 6kW is under 8kW\nDemand Factor: 6kW @ 100% = 25A\nCircuit Size: 25A → 30A breaker\nWire Size: 10 AWG copper (30A)\nReceptacle: NEMA 14-30R (4-wire)\nIdeal for smaller kitchens',
    result: '30A circuit, 10 AWG wire',
    outlet: 'NEMA 14-30R receptacle',
    cost: '$285 + standard installation',
    compliance: 'NEC 220.55, under 8kW load'
  },
  {
    title: 'Vintage Range Conversion',
    scenario: 'Converting 3-wire to 4-wire for new range',
    specs: 'Existing: 3-wire NEMA 10-50, New: 4-wire requirement',
    calculation: 'Code Update Required:\nExisting: Hot-Hot-Neutral (3-wire)\nNew Code: Hot-Hot-Neutral-Ground (4-wire)\nConversion Options:\n1. Run new 4-wire circuit (preferred)\n2. Add ground wire to existing circuit\n\nNew Installation:\n40A circuit, 8 AWG + 8 AWG ground\nReceptacle upgrade: 10-50R → 14-50R\nPanel neutral/ground separation required',
    result: '4-wire circuit upgrade',
    outlet: 'NEMA 14-50R (4-wire)',
    cost: '$425 rewiring + outlet change',
    compliance: 'NEC 250.140 exceptions'
  }
];

const NEC_DEMAND_FACTORS = [
  {
    rangeSize: 'Under 3.5kW',
    demandFactor: '100%',
    calculation: 'Full nameplate rating',
    wireSize: '12-10 AWG',
    circuitSize: '20-30A'
  },
  {
    rangeSize: '3.5kW - 8kW',
    demandFactor: '100%',
    calculation: 'Full load under 8kW',
    wireSize: '10-8 AWG',
    circuitSize: '25-40A'
  },
  {
    rangeSize: '8kW - 12kW',
    demandFactor: '8kW + 80% excess',
    calculation: '8kW @ 100% + remainder @ 80%',
    wireSize: '8-6 AWG',
    circuitSize: '40-50A'
  },
  {
    rangeSize: '12kW - 16kW',
    demandFactor: '8kW + 80% excess',
    calculation: '8kW + (load-8kW) × 0.8',
    wireSize: '6-4 AWG',
    circuitSize: '50-60A'
  },
  {
    rangeSize: 'Over 16kW',
    demandFactor: 'Special calculation',
    calculation: 'Individual load analysis required',
    wireSize: '4 AWG+',
    circuitSize: '60A+'
  }
];

const RECEPTACLE_GUIDE = [
  {
    type: 'NEMA 6-30R',
    rating: '30A, 240V',
    wiring: '3-wire (no neutral)',
    use: 'Cooktop only, no 120V',
    wire: '10 AWG + ground'
  },
  {
    type: 'NEMA 14-30R',
    rating: '30A, 120/240V',
    wiring: '4-wire with neutral',
    use: 'Small ranges with 120V',
    wire: '10 AWG + neutral + ground'
  },
  {
    type: 'NEMA 6-50R',
    rating: '50A, 240V',
    wiring: '3-wire (no neutral)',
    use: 'Cooktop only applications',
    wire: '6 AWG + ground'
  },
  {
    type: 'NEMA 14-50R',
    rating: '50A, 120/240V',
    wiring: '4-wire with neutral',
    use: 'Standard range outlet',
    wire: '6 AWG + neutral + ground'
  },
  {
    type: 'NEMA 14-60R',
    rating: '60A, 120/240V',
    wiring: '4-wire with neutral',
    use: 'Large commercial-style ranges',
    wire: '4 AWG + neutral + ground'
  }
];

const MANUFACTURER_SPECS = [
  {
    brand: 'GE Profile',
    model: 'PHS930',
    power: '11.3kW',
    circuit: '50A',
    features: 'Induction, WiFi, Convection',
    price: '$2,800-$3,200'
  },
  {
    brand: 'Whirlpool',
    model: 'WEE750H0HZ',
    power: '6.4kW',
    circuit: '40A',
    features: 'Convection, Touch controls',
    price: '$1,200-$1,500'
  },
  {
    brand: 'Samsung',
    model: 'NE63T8911SS',
    power: '11kW',
    circuit: '50A',
    features: 'Flex Duo, Air Fry',
    price: '$1,800-$2,100'
  },
  {
    brand: 'KitchenAid',
    model: 'KODE500ESS',
    power: '12.2kW',
    circuit: '50A',
    features: 'Double oven, Even-Heat',
    price: '$2,400-$2,800'
  },
  {
    brand: 'Frigidaire',
    model: 'FGEH3047VF',
    power: '9.2kW',
    circuit: '40A',
    features: 'True Convection, Self-clean',
    price: '$800-$1,100'
  }
];

const INSTALLATION_COSTS = [
  {
    component: 'New 40A Circuit',
    range: '$200-$400',
    factors: 'Distance from panel, wire routing'
  },
  {
    component: '50A Receptacle & Box',
    range: '$35-$80',
    factors: 'NEMA type, surface vs flush mount'
  },
  {
    component: 'Wire (per foot)',
    range: '$3-$8',
    factors: '8 AWG vs 6 AWG copper pricing'
  },
  {
    component: 'Hardwire Connection',
    range: '$150-$300',
    factors: 'Junction box, flex conduit, permits'
  },
  {
    component: 'Panel Upgrade (if needed)',
    range: '$1,200-$2,500',
    factors: 'Main panel capacity, permit fees'
  },
  {
    component: 'Total Installation',
    range: '$350-$800',
    factors: 'Complete circuit with standard run'
  }
];

const SAFETY_REQUIREMENTS = [
  {
    requirement: 'GFCI Protection',
    applicability: 'Generally not required for ranges',
    exceptions: 'Check local codes, some require for accessible outlets',
    nec: 'NEC 210.8 - residential GFCI requirements'
  },
  {
    requirement: 'AFCI Protection',
    applicability: 'Required for kitchen circuits in some areas',
    exceptions: 'Large appliance circuits often exempt',
    nec: 'NEC 210.12 - AFCI requirements'
  },
  {
    requirement: 'Dedicated Circuit',
    applicability: 'Required for all range installations',
    exceptions: 'No other loads on range circuit',
    nec: 'NEC 210.23 - dedicated circuits'
  },
  {
    requirement: 'Grounding',
    applicability: 'Equipment grounding required',
    exceptions: '3-wire allowed only in specific existing conditions',
    nec: 'NEC 250.140 - grounding requirements'
  }
];

const TROUBLESHOOTING_GUIDE = [
  {
    problem: 'Range not heating properly',
    causes: 'Voltage drop, loose connections, undersized wire',
    diagnosis: 'Check voltage at outlet under load, tighten connections',
    solution: 'Upsize wire if voltage drop >3%, repair connections'
  },
  {
    problem: 'Tripping breaker frequently',
    causes: 'Overloaded circuit, defective breaker, short circuit',
    diagnosis: 'Check total load, test breaker, inspect wiring',
    solution: 'Upsize circuit if needed, replace breaker, repair shorts'
  },
  {
    problem: 'Only 120V available at outlet',
    causes: 'Lost leg, open breaker pole, wiring error',
    diagnosis: 'Test both legs to ground and leg-to-leg voltage',
    solution: 'Check panel connections, replace double-pole breaker'
  },
  {
    problem: 'Neutral-ground voltage present',
    causes: 'Improper neutral/ground bonding in subpanel',
    diagnosis: 'Measure neutral to ground voltage',
    solution: 'Separate neutral and ground bars in subpanel'
  }
];

const REGIONAL_CODES = [
  {
    region: 'California',
    requirement: 'Title 24 compliance for new construction',
    specifics: 'Energy efficiency requirements, cool roof credits',
    authority: 'California Energy Commission'
  },
  {
    region: 'New York City',
    requirement: 'Special permit requirements for kitchen work',
    specifics: 'DOB permits, gas work restrictions in some areas',
    authority: 'NYC Department of Buildings'
  },
  {
    region: 'Florida',
    requirement: 'Hurricane resistance for outdoor equipment',
    specifics: 'Wind load requirements, corrosion protection',
    authority: 'Florida Building Code'
  },
  {
    region: 'Massachusetts',
    requirement: 'Stretch Code adoption in many municipalities',
    specifics: 'Enhanced energy efficiency, all-electric requirements',
    authority: 'Massachusetts Board of Building Regulations'
  },
  {
    region: 'Texas',
    requirement: 'Local amendments vary by city',
    specifics: 'Some areas require AFCI for kitchen circuits',
    authority: 'Local Building Departments'
  }
];

const ENERGY_EFFICIENCY = [
  {
    type: 'Induction Cooktops',
    efficiency: '85-90%',
    benefits: 'Fast heating, precise control, cooler kitchen',
    electrical: 'Same circuit requirements as electric coil'
  },
  {
    type: 'Convection Ovens',
    efficiency: '20% faster cooking',
    benefits: 'Even heating, reduced cooking time',
    electrical: 'May have higher instantaneous load'
  },
  {
    type: 'Smart Ranges',
    efficiency: 'Load management features',
    benefits: 'Remote monitoring, energy tracking',
    electrical: 'May require neutral for 120V controls'
  },
  {
    type: 'Dual Fuel Ranges',
    efficiency: 'Gas cooktop + electric oven',
    benefits: 'Best of both fuel types',
    electrical: 'Reduced electrical load, gas line required'
  }
];

const COMPREHENSIVE_FAQS = [
  {
    question: 'What size circuit do I need for a 40 amp electric range?',
    answer: 'For a range rated at 40 amps nameplate, you need a 40A circuit with 8 AWG copper wire. However, check the actual wattage and apply NEC 220.55 demand factors. Many "40A" ranges actually need 50A circuits when properly calculated. Always use the demand calculation, not just the nameplate rating.'
  },
  {
    question: 'Can I use a 3-wire connection for a new electric range?',
    answer: 'No, new installations require 4-wire connections (2 hots, 1 neutral, 1 ground) per NEC 250.140. The 3-wire connection (which used the neutral as ground) is only allowed for existing installations in specific circumstances. Always install 4-wire for safety and code compliance.'
  },
  {
    question: 'What is the difference between NEMA 14-50 and 6-50 outlets?',
    answer: 'NEMA 14-50 is a 4-wire outlet (50A, 120/240V) with neutral, used for ranges that need both 240V and 120V. NEMA 6-50 is 3-wire (50A, 240V only) without neutral, used for cooktops that don\'t need 120V power for clocks or controls.'
  },
  {
    question: 'Do I need a separate circuit for a cooktop and wall oven?',
    answer: 'Yes, typically separate circuits are required. Each appliance needs its own dedicated circuit sized for its specific load. This also provides flexibility and better performance. A 30A circuit for cooktop and 25A circuit for wall oven are common configurations.'
  },
  {
    question: 'How do I calculate the demand load for multiple kitchen appliances?',
    answer: 'Use NEC 220.55 demand factors: apply 100% to the first 8kW and 80% to any excess. For multiple units, calculate each separately unless they\'re designed as a unit. Always follow manufacturer specifications and local electrical codes.'
  },
  {
    question: 'What permits are needed for range circuit installation?',
    answer: 'Most jurisdictions require electrical permits for new range circuits or circuit upgrades. The work must be inspected to ensure proper installation, grounding, and code compliance. Check with your local building department for specific requirements and whether DIY work is permitted.'
  }
];

export default function RangeCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['range-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Electric Range Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-red-50">
                Calculate electrical requirements for electric ranges, cooktops, and ovens. Professional kitchen 
                appliance sizing with NEC 220.55 demand factors and complete installation guidance.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-red-100">NEC Article 220.55</div>
                  <div className="font-semibold">Demand Calculations</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-red-100">Power Range</div>
                  <div className="font-semibold">3kW - 20kW+</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-red-100">Circuits</div>
                  <div className="font-semibold">20A - 60A</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-red-100">Connection</div>
                  <div className="font-semibold">3-wire / 4-wire</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Safety Information */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-red-900 mb-2">Range Installation Safety Requirements</h2>
                <ul className="text-red-800 space-y-1 text-sm">
                  <li>• New installations require 4-wire connections (2 hot + neutral + ground)</li>
                  <li>• Use NEC 220.55 demand factors - don't just use nameplate ratings</li>
                  <li>• Dedicated circuit required - no other loads on range circuit</li>
                  <li>• Large appliance circuits may require panel upgrades</li>
                  <li>• Professional installation recommended - high voltage and current involved</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <RangeCalculator />

          {/* Comprehensive Installation Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Range Installation Examples</h2>
            </div>
            
            <div className="grid gap-8">
              {RANGE_EXAMPLES.map((example, idx) => (
                <div key={idx} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{example.title}</h3>
                      <p className="text-red-700 font-medium mb-2">{example.scenario}</p>
                      <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Specifications:</span> {example.specs}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-red-600 mb-1">{example.result}</div>
                      <div className="text-sm text-gray-500 mb-1">{example.outlet}</div>
                      <div className="text-sm text-orange-600 mb-1">{example.cost}</div>
                      <div className="text-xs text-blue-600">{example.compliance}</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">NEC 220.55 Calculation:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-line font-mono">{example.calculation}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEC Demand Factors Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">NEC 220.55 Demand Factor Guide</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Range Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Demand Factor</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Calculation Method</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Typical Wire</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Circuit Size</th>
                  </tr>
                </thead>
                <tbody>
                  {NEC_DEMAND_FACTORS.map((factor, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium text-blue-600">{factor.rangeSize}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-green-600">{factor.demandFactor}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{factor.calculation}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{factor.wireSize}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-red-600">{factor.circuitSize}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Receptacle Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Range Receptacle Selection Guide</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">NEMA Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Rating</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Wiring</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Best Use</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Wire Required</th>
                  </tr>
                </thead>
                <tbody>
                  {RECEPTACLE_GUIDE.map((receptacle, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-purple-600">{receptacle.type}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{receptacle.rating}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{receptacle.wiring}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{receptacle.use}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-green-600">{receptacle.wire}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Manufacturer Specifications */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <ChefHat className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Popular Range Specifications</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {MANUFACTURER_SPECS.map((spec, idx) => (
                <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{spec.brand}</h3>
                      <p className="text-orange-600 font-medium">{spec.model}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{spec.power}</div>
                      <div className="text-sm text-gray-500">{spec.circuit}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{spec.features}</p>
                  <p className="text-sm font-medium text-blue-600">{spec.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Installation Costs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Installation Cost Guide</h2>
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

          {/* Safety Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Safety & Code Requirements</h2>
            </div>
            
            <div className="space-y-6">
              {SAFETY_REQUIREMENTS.map((req, idx) => (
                <div key={idx} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{req.requirement}</h3>
                    <span className="text-xs bg-red-100 px-2 py-1 rounded font-medium">{req.nec}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Applies to:</span> {req.applicability}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600"><span className="font-medium">Exceptions:</span> {req.exceptions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Troubleshooting Common Issues</h2>
            </div>
            
            <div className="space-y-6">
              {TROUBLESHOOTING_GUIDE.map((issue, idx) => (
                <div key={idx} className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{issue.problem}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Possible Causes:</h4>
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

          {/* Regional Code Variations */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Regional Code Variations</h2>
            </div>
            
            <div className="space-y-4">
              {REGIONAL_CODES.map((region, idx) => (
                <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">{region.region}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Requirement:</span> {region.requirement}</p>
                  <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Specifics:</span> {region.specifics}</p>
                  <p className="text-xs text-purple-600 font-medium">Authority: {region.authority}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Energy Efficiency */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Energy Efficiency Features</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {ENERGY_EFFICIENCY.map((feature, idx) => (
                <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{feature.type}</h3>
                    <span className="font-bold text-green-600">{feature.efficiency}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Benefits:</span> {feature.benefits}</p>
                  <p className="text-sm text-blue-600"><span className="font-medium">Electrical:</span> {feature.electrical}</p>
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
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Kitchen & Appliance Calculators</h2>
              <p className="text-gray-600">Complete your kitchen electrical design</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Size Calculator</h3>
                <p className="text-xs text-gray-600">Calculate AWG sizing</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Target className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Check voltage losses</p>
              </Link>
              
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service sizing</p>
              </Link>
              
              <Link href="/calculators/garage-subpanel-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Home className="w-8 h-8 text-emerald-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Subpanel</h3>
                <p className="text-xs text-gray-600">Outbuilding service</p>
              </Link>
              
              <Link href="/calculators/three-phase-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">3-Phase Power</h3>
                <p className="text-xs text-gray-600">Commercial ranges</p>
              </Link>
              
              <Link href="/calculators/hot-tub-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Settings className="w-8 h-8 text-cyan-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Hot Tub</h3>
                <p className="text-xs text-gray-600">Spa electrical</p>
              </Link>
              
              <Link href="/calculators/conduit-fill-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Conduit Fill</h3>
                <p className="text-xs text-gray-600">Raceway sizing</p>
              </Link>
              
              <Link href="/calculators/ampacity-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Target className="w-8 h-8 text-indigo-600 mb-2" />
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
