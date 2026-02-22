import { Metadata } from 'next';
import { PoolPumpCalculator } from '@/components/calculators';
import { Droplets, Calculator, AlertTriangle, Settings, Target, BookOpen, Users, Shield, MapPin, Zap, Wrench, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Pool Pump Calculator | Swimming Pool Pump Circuit Calculator | NEC 680',
  description: 'Calculate wire size and circuit requirements for pool pumps per NEC Article 680. Professional pool equipment electrical calculator with comprehensive installation guidance.',
  keywords: 'pool pump calculator, swimming pool pump circuit, NEC Article 680, pool equipment electrical, pool pump wire size, pool pump installation, variable speed pump',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Pool Pump Electrical Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Size wire and breakers for pool pumps with GFCI protection requirements.",
  "keywords": "pool motor, pump wiring, swimming pool electrical",
  "url": `https://wiresizes.com/calculators/pool-pump-calculator`,
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

const POOL_PUMP_EXAMPLES = [
  {
    title: 'Standard Single Speed Pool Pump',
    scenario: '1.5 HP single speed pump, 50ft run from panel',
    calculation: 'Motor FLA: 1.5 HP × 746W/HP ÷ 240V ÷ 0.85 eff = 5.5A\nNEC Motor Current: Table 430.248 = 8.0A\nCircuit: 8.0A × 1.25 = 10A minimum → 15A circuit\nWire Size: 14 AWG copper (15A capacity)\nVoltage Drop: 8.0A × 50ft × 2.6Ω/1000ft ÷ 240V = 0.43%\nBreaker: 15A GFCI breaker required',
    result: '15A circuit, 14 AWG wire',
    efficiency: 'Standard efficiency, ~2800 RPM',
    cost: '$250 materials + installation',
    application: 'Basic residential pool circulation'
  },
  {
    title: 'Variable Speed Pool Pump',
    scenario: '2.7 HP variable speed pump, underground run',
    calculation: 'Max Motor Current: Table 430.248 = 12.0A (2.5 HP)\nCircuit: 12.0A × 1.25 = 15A minimum → 20A circuit\nWire Size: 12 AWG copper (20A capacity)\nUnderground: USE-2 direct burial cable\nGFCI Protection: 20A GFCI breaker\nTypical Operation: 6-8A at efficient speeds',
    result: '20A circuit, 12 AWG wire',
    efficiency: 'Energy Star certified, 30-90% energy savings',
    cost: '$400 materials + trenching',
    application: 'Energy efficient pool operation'
  },
  {
    title: 'Large Pool Pump System',
    scenario: '3 HP pump with automatic controls, 75ft run',
    calculation: 'Motor FLA: Table 430.248 = 15.2A\nCircuit: 15.2A × 1.25 = 19A → 20A circuit\nWire Size: 12 AWG copper (20A capacity)\nVoltage Drop: 15.2A × 75ft × 2.6Ω/1000ft ÷ 240V = 1.23%\nControls: Additional 5A for automation\nTotal Circuit: 25A with controls',
    result: '25A circuit, 10 AWG wire',
    efficiency: 'High volume circulation',
    cost: '$650 materials + controls',
    application: 'Large residential or commercial pool'
  },
  {
    title: 'Dual Speed Pool Pump',
    scenario: '2 HP dual speed pump with timer controls',
    calculation: 'High Speed: Table 430.248 = 12.0A\nLow Speed: Approximately 4.0A\nCircuit Sizing: Based on high speed × 1.25 = 15A\nWire Size: 14 AWG copper adequate\nTimer Control: 24V control circuit\nBreaker: 15A GFCI with control provisions',
    result: '15A circuit, 14 AWG wire',
    efficiency: '40-60% energy savings vs single speed',
    cost: '$350 materials + timer',
    application: 'Moderate efficiency upgrade'
  },
  {
    title: 'Pool Pump with Heater',
    scenario: '1.5 HP pump + 11kW electric heater combination',
    calculation: 'Pump Current: 8.0A\nHeater Current: 11000W ÷ 240V = 45.8A\nSeparate Circuits Required:\n- Pump: 15A GFCI circuit\n- Heater: 50A GFCI circuit\nFeeder: Consider both loads for sizing\nPanel: Dedicated pool panel recommended',
    result: 'Separate 15A and 50A circuits',
    efficiency: 'Coordinated heating and circulation',
    cost: '$800 materials + dedicated panel',
    application: 'Heated pool systems'
  },
  {
    title: 'Commercial Pool Pump Station',
    scenario: 'Two 5 HP pumps with backup switching',
    calculation: 'Each Pump: Table 430.248 = 28A\nIndividual Circuits: 28A × 1.25 = 35A → 40A each\nWire Size: 8 AWG per pump\nBackup System: Automatic transfer switch\nFeeder: Size for one pump operating\n3-Phase Option: More efficient for this size',
    result: 'Two 40A circuits, 8 AWG each',
    efficiency: 'Redundant operation capability',
    cost: '$1200 materials + transfer switch',
    application: 'Commercial pools, health clubs'
  }
];

const POOL_PUMP_TYPES = [
  {
    type: 'Single Speed',
    horsepower: '0.75-3.0 HP',
    speed: '3450 RPM (fixed)',
    efficiency: 'Standard',
    energyUse: 'High',
    typicalCurrent: '5-15A',
    circuitSize: '15-25A',
    wireSize: '14-10 AWG',
    cost: '$200-500',
    pros: 'Low initial cost, simple installation',
    cons: 'High energy consumption, loud operation',
    application: 'Basic pool circulation, budget installations'
  },
  {
    type: 'Dual Speed',
    horsepower: '1.0-2.5 HP',
    speed: '3450/1725 RPM',
    efficiency: 'Better',
    energyUse: 'Moderate',
    typicalCurrent: '4-12A',
    circuitSize: '15-20A',
    wireSize: '14-12 AWG',
    cost: '$300-700',
    pros: 'Energy savings, two operation modes',
    cons: 'Still limited speed options',
    application: 'Moderate efficiency upgrade'
  },
  {
    type: 'Variable Speed',
    horsepower: '1.5-3.0 HP',
    speed: '600-3450 RPM',
    efficiency: 'Highest',
    energyUse: 'Low',
    typicalCurrent: '2-12A',
    circuitSize: '15-20A',
    wireSize: '14-12 AWG',
    cost: '$800-1500',
    pros: 'Maximum efficiency, quiet, precise control',
    cons: 'Higher initial cost',
    application: 'Energy efficient operation, premium installations'
  }
];

const NEC_680_REQUIREMENTS = [
  {
    requirement: 'GFCI Protection',
    necSection: '680.22(B)',
    rule: 'All pool pump motors require GFCI',
    example: 'GFCI circuit breaker in panel',
    reasoning: 'Personnel protection in wet locations'
  },
  {
    requirement: 'Equipotential Bonding',
    necSection: '680.26',
    rule: 'All metallic components bonded together',
    example: '8 AWG copper bonding conductor',
    reasoning: 'Eliminate voltage differences between components'
  },
  {
    requirement: 'Motor Circuit Sizing',
    necSection: '680.21(A)',
    rule: 'Use NEC Table 430.248 for circuit sizing',
    example: '1.5 HP = 8.0A, circuit = 10A minimum',
    reasoning: 'Motor starting characteristics and protection'
  },
  {
    requirement: 'Overcurrent Protection',
    necSection: '680.21(B)',
    rule: 'Motor branch circuit protection required',
    example: '15A GFCI breaker for 1.5 HP pump',
    reasoning: 'Motor and conductor protection'
  },
  {
    requirement: 'Equipment Location',
    necSection: '680.22(A)(5)',
    rule: 'Motors 5 feet from pool edge minimum',
    example: 'Pool equipment pad 5+ feet from water',
    reasoning: 'Safety clearance from pool water'
  },
  {
    requirement: 'Wiring Methods',
    necSection: '680.21(A)(1)',
    rule: 'Permanent wiring required',
    example: 'No cord and plug connections',
    reasoning: 'Reliable connection in harsh environment'
  },
  {
    requirement: 'Grounding',
    necSection: '680.21(A)(2)',
    rule: 'Equipment grounding conductor required',
    example: '12 AWG ground with 20A circuit',
    reasoning: 'Fault current return path'
  }
];

const PUMP_MANUFACTURER_SPECS = [
  {
    manufacturer: 'Pentair',
    model: 'SuperFlo VS',
    type: 'Variable Speed',
    horsepower: '1.5 HP',
    maxCurrent: '8.6A',
    recommendedCircuit: '15A GFCI',
    wireSize: '14 AWG',
    features: 'Energy Star, Digital Controls, 8 Speeds',
    warranty: '3 Years',
    price: '$800-1000'
  },
  {
    manufacturer: 'Hayward',
    model: 'TriStar VS',
    type: 'Variable Speed',
    horsepower: '1.85 HP',
    maxCurrent: '9.8A',
    recommendedCircuit: '15A GFCI',
    wireSize: '14 AWG',
    features: 'TouchPad Controls, 24hr Timer, Quiet Operation',
    warranty: '3 Years',
    price: '$750-950'
  },
  {
    manufacturer: 'Jandy',
    model: 'FloPro Single Speed',
    type: 'Single Speed',
    horsepower: '2.0 HP',
    maxCurrent: '12.0A',
    recommendedCircuit: '20A GFCI',
    wireSize: '12 AWG',
    features: 'Heavy Duty Motor, Corrosion Resistant',
    warranty: '2 Years',
    price: '$350-450'
  },
  {
    manufacturer: 'Sta-Rite',
    model: 'Max-E-Pro VS',
    type: 'Variable Speed',
    horsepower: '2.7 HP',
    maxCurrent: '11.5A',
    recommendedCircuit: '20A GFCI',
    wireSize: '12 AWG',
    features: 'Premium Efficiency, 110-3450 RPM Range',
    warranty: '3 Years',
    price: '$900-1200'
  }
];

const INSTALLATION_STEPS = [
  {
    step: '1. Planning & Permits',
    description: 'Obtain electrical permit and plan installation',
    details: [
      'Check local code requirements and permit needs',
      'Plan circuit routing from panel to pump location',
      'Verify adequate panel capacity for new circuit',
      'Schedule electrical inspection if required'
    ],
    timeRequired: '1-2 hours planning',
    tools: 'Plans, permit applications'
  },
  {
    step: '2. Circuit Installation',
    description: 'Install dedicated circuit for pool pump',
    details: [
      'Install GFCI breaker in electrical panel',
      'Run appropriate wire size from panel to pump',
      'Use proper conduit for underground runs',
      'Maintain proper depth and protection'
    ],
    timeRequired: '2-4 hours',
    tools: 'Wire, conduit, trenching equipment'
  },
  {
    step: '3. Bonding Installation',
    description: 'Install equipotential bonding system',
    details: [
      'Run 8 AWG solid copper bonding conductor',
      'Connect all metallic pool components',
      'Bond pool structure, equipment, and ladders',
      'Use proper bonding lugs and connections'
    ],
    timeRequired: '2-3 hours',
    tools: 'Bonding wire, lugs, drill'
  },
  {
    step: '4. Pump Connection',
    description: 'Connect pump motor to electrical circuit',
    details: [
      'Connect supply wires to pump terminal box',
      'Ensure proper wire connections and torque',
      'Connect equipment grounding conductor',
      'Verify rotation direction and operation'
    ],
    timeRequired: '1 hour',
    tools: 'Wire nuts, torque wrench'
  }
];

const COMMON_VIOLATIONS = [
  {
    violation: 'No GFCI Protection',
    description: 'Pool pump connected without GFCI protection',
    consequence: 'Code violation, safety hazard',
    correction: 'Install GFCI breaker or GFCI receptacle',
    necReference: 'NEC 680.22(B)'
  },
  {
    violation: 'Improper Bonding',
    description: 'Missing or inadequate equipotential bonding',
    consequence: 'Shock hazard, code violation',
    correction: 'Install 8 AWG copper bonding system',
    necReference: 'NEC 680.26'
  },
  {
    violation: 'Cord and Plug Connection',
    description: 'Pool pump connected with extension cord',
    consequence: 'Code violation, unreliable connection',
    correction: 'Install permanent wiring to pump',
    necReference: 'NEC 680.21(A)(1)'
  },
  {
    violation: 'Inadequate Circuit Size',
    description: 'Circuit sized too small for motor load',
    consequence: 'Breaker tripping, motor damage',
    correction: 'Upgrade to properly sized circuit',
    necReference: 'NEC 680.21(A)'
  },
  {
    violation: 'Equipment Too Close',
    description: 'Pump motor within 5 feet of pool edge',
    consequence: 'Code violation, safety hazard',
    correction: 'Relocate equipment or install barriers',
    necReference: 'NEC 680.22(A)(5)'
  }
];

const ENERGY_EFFICIENCY_COMPARISON = [
  {
    pumpType: 'Single Speed 1.5 HP',
    dailyRuntime: '8 hours',
    powerConsumption: '1.5 kWh × 8 = 12 kWh/day',
    monthlyConsumption: '360 kWh',
    monthlyCost: '$43.20 @ $0.12/kWh',
    annualCost: '$518',
    notes: 'Constant high speed operation'
  },
  {
    pumpType: 'Dual Speed 1.5 HP',
    dailyRuntime: '4 hrs high + 4 hrs low',
    powerConsumption: '1.5 kWh × 4 + 0.4 kWh × 4 = 7.6 kWh/day',
    monthlyConsumption: '228 kWh',
    monthlyCost: '$27.36 @ $0.12/kWh',
    annualCost: '$328',
    notes: '37% energy savings vs single speed'
  },
  {
    pumpType: 'Variable Speed 1.5 HP',
    dailyRuntime: '12 hours at optimal speeds',
    powerConsumption: 'Average 0.5 kWh × 12 = 6 kWh/day',
    monthlyConsumption: '180 kWh',
    monthlyCost: '$21.60 @ $0.12/kWh',
    annualCost: '$259',
    notes: '50% energy savings vs single speed'
  }
];

const TROUBLESHOOTING_GUIDE = [
  {
    problem: 'Pump Won\'t Start',
    possibleCauses: [
      'No power to pump',
      'Tripped GFCI breaker',
      'Bad motor capacitor',
      'Seized impeller'
    ],
    diagnostics: [
      'Check voltage at pump terminals',
      'Test GFCI breaker operation',
      'Check motor capacitor with meter',
      'Try to rotate pump by hand'
    ],
    solutions: [
      'Check circuit breaker and wiring',
      'Reset GFCI, investigate cause',
      'Replace motor capacitor',
      'Clear debris, replace bearings'
    ]
  },
  {
    problem: 'Pump Trips GFCI',
    possibleCauses: [
      'Ground fault in motor',
      'Water in junction box',
      'Damaged wiring',
      'Defective GFCI breaker'
    ],
    diagnostics: [
      'Measure insulation resistance',
      'Inspect all connections',
      'Check for damaged wire insulation',
      'Test GFCI with known good load'
    ],
    solutions: [
      'Replace motor if ground fault found',
      'Seal connections, replace gaskets',
      'Replace damaged wiring',
      'Replace defective GFCI breaker'
    ]
  },
  {
    problem: 'High Energy Bills',
    possibleCauses: [
      'Single speed pump running too long',
      'Oversized pump for pool',
      'Dirty filter causing back pressure',
      'Old inefficient motor'
    ],
    diagnostics: [
      'Monitor actual runtime and power consumption',
      'Calculate required flow rate for pool',
      'Check filter pressure differential',
      'Test motor efficiency'
    ],
    solutions: [
      'Reduce runtime or upgrade to variable speed',
      'Replace with properly sized pump',
      'Clean or replace filter cartridges',
      'Upgrade to high efficiency motor'
    ]
  }
];

export default function PoolPumpCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['pool-pump-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <Droplets className="w-12 h-12" />
                <h1 className="text-4xl font-bold">Pool Pump Calculator</h1>
              </div>
              <p className="text-xl mb-8 text-blue-50">
                Calculate electrical requirements for swimming pool pumps and equipment per NEC Article 680 standards. 
                Professional calculator for safe and code-compliant pool electrical installations.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-500/20 rounded-lg p-4">
                  <Shield className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-2">NEC 680 Compliant</h3>
                  <p className="text-sm text-blue-100">All calculations follow National Electrical Code Article 680 for pool equipment</p>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-4">
                  <Calculator className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-2">Professional Results</h3>
                  <p className="text-sm text-blue-100">Accurate wire sizing, circuit protection, and GFCI requirements</p>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-4">
                  <Zap className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-2">Energy Efficient</h3>
                  <p className="text-sm text-blue-100">Compare pump types and optimize for energy savings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Warning */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-red-900 mb-2">Critical Pool Equipment Safety Requirements</h2>
                <div className="text-red-800 space-y-2 text-sm">
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-1">
                      <li>• GFCI protection required for ALL pool equipment per NEC 680.22(B)</li>
                      <li>• Equipotential bonding required for all metallic pool components</li>
                      <li>• Motors must be permanently wired - no cord connections at pool</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• Minimum 5-foot clearance from pool water edge required</li>
                      <li>• Pool pump installations require electrical permits and inspection</li>
                      <li>• Professional installation recommended for safety and code compliance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Component */}
          <PoolPumpCalculator />

          {/* Real-World Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Real-World Pool Pump Installation Examples</h2>
            <div className="grid gap-8">
              {POOL_PUMP_EXAMPLES.map((example, index) => (
                <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-600 mb-2">{example.title}</h3>
                      <p className="text-gray-700 mb-4">{example.scenario}</p>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Result:</span> {example.result}</div>
                        <div><span className="font-medium">Efficiency:</span> {example.efficiency}</div>
                        <div><span className="font-medium">Cost:</span> {example.cost}</div>
                        <div><span className="font-medium">Application:</span> {example.application}</div>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <h4 className="font-medium text-gray-900 mb-2">Electrical Calculations:</h4>
                      <pre className="bg-gray-50 p-4 rounded text-sm font-mono whitespace-pre-wrap overflow-x-auto">
{example.calculation}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pool Pump Types Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pool Pump Types & Specifications</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border p-3 text-left font-semibold">Pump Type</th>
                    <th className="border p-3 text-left font-semibold">Horsepower</th>
                    <th className="border p-3 text-left font-semibold">Speed Range</th>
                    <th className="border p-3 text-left font-semibold">Efficiency</th>
                    <th className="border p-3 text-left font-semibold">Current Draw</th>
                    <th className="border p-3 text-left font-semibold">Circuit Size</th>
                    <th className="border p-3 text-left font-semibold">Wire Size</th>
                    <th className="border p-3 text-left font-semibold">Cost Range</th>
                  </tr>
                </thead>
                <tbody>
                  {POOL_PUMP_TYPES.map((pump, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-3 font-medium text-blue-600">{pump.type}</td>
                      <td className="border p-3">{pump.horsepower}</td>
                      <td className="border p-3">{pump.speed}</td>
                      <td className="border p-3">{pump.efficiency}</td>
                      <td className="border p-3">{pump.typicalCurrent}</td>
                      <td className="border p-3">{pump.circuitSize}</td>
                      <td className="border p-3">{pump.wireSize}</td>
                      <td className="border p-3">{pump.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {POOL_PUMP_TYPES.map((pump, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{pump.type} Pumps</h3>
                  <div className="space-y-2 text-sm mb-4">
                    <div><span className="font-medium text-green-600">Pros:</span> {pump.pros}</div>
                    <div><span className="font-medium text-red-600">Cons:</span> {pump.cons}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Best for:</strong> {pump.application}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEC Article 680 Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">NEC Article 680 Requirements for Pool Pumps</h2>
            <div className="grid gap-6">
              {NEC_680_REQUIREMENTS.map((req, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{req.requirement}</h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                      {req.necSection}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-700 mb-2"><span className="font-medium">Rule:</span> {req.rule}</p>
                      <p className="text-gray-700"><span className="font-medium">Example:</span> {req.example}</p>
                    </div>
                    <div>
                      <p className="text-gray-600"><span className="font-medium">Reasoning:</span> {req.reasoning}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manufacturer Specifications */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Pool Pump Manufacturer Specifications</h2>
            <div className="grid gap-6">
              {PUMP_MANUFACTURER_SPECS.map((pump, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="grid lg:grid-cols-4 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600">{pump.manufacturer}</h3>
                      <p className="text-gray-700 font-medium">{pump.model}</p>
                      <p className="text-sm text-gray-600">{pump.type} • {pump.horsepower}</p>
                    </div>
                    <div>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Max Current:</span> {pump.maxCurrent}</div>
                        <div><span className="font-medium">Circuit:</span> {pump.recommendedCircuit}</div>
                        <div><span className="font-medium">Wire Size:</span> {pump.wireSize}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm">
                        <div><span className="font-medium">Features:</span></div>
                        <p className="text-gray-600">{pump.features}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm space-y-1">
                        <div><span className="font-medium">Warranty:</span> {pump.warranty}</div>
                        <div><span className="font-medium">Price:</span> {pump.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-sm text-gray-600 text-center">
              <p>Prices are approximate retail costs. Consult manufacturer specifications for exact electrical requirements.</p>
            </div>
          </div>

          {/* Installation Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pool Pump Electrical Installation Steps</h2>
            <div className="space-y-8">
              {INSTALLATION_STEPS.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.step}</h3>
                    <p className="text-gray-700 mb-4">{step.description}</p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Detailed Steps:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div><span className="font-medium">Time:</span> {step.timeRequired}</div>
                      <div><span className="font-medium">Tools:</span> {step.tools}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Code Violations */}
          <div className="bg-red-50 rounded-xl border border-red-200 p-8">
            <h2 className="text-3xl font-bold text-red-900 mb-8 text-center">Common Pool Pump Code Violations to Avoid</h2>
            <div className="grid gap-6">
              {COMMON_VIOLATIONS.map((violation, index) => (
                <div key={index} className="bg-white rounded-lg border-l-4 border-red-500 p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">{violation.violation}</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-700 mb-2"><span className="font-medium">Description:</span> {violation.description}</p>
                      <p className="text-red-600"><span className="font-medium">Consequence:</span> {violation.consequence}</p>
                    </div>
                    <div>
                      <p className="text-green-700 mb-2"><span className="font-medium">Correction:</span> {violation.correction}</p>
                      <p className="text-blue-600"><span className="font-medium">NEC Reference:</span> {violation.necReference}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Energy Efficiency Comparison */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-8">
            <h2 className="text-3xl font-bold text-green-900 mb-8 text-center">Pool Pump Energy Efficiency Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                <thead>
                  <tr className="bg-green-100">
                    <th className="border p-3 text-left font-semibold">Pump Type</th>
                    <th className="border p-3 text-left font-semibold">Daily Runtime</th>
                    <th className="border p-3 text-left font-semibold">Power Consumption</th>
                    <th className="border p-3 text-left font-semibold">Monthly kWh</th>
                    <th className="border p-3 text-left font-semibold">Monthly Cost</th>
                    <th className="border p-3 text-left font-semibold">Annual Cost</th>
                    <th className="border p-3 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {ENERGY_EFFICIENCY_COMPARISON.map((comparison, index) => (
                    <tr key={index} className="hover:bg-green-50">
                      <td className="border p-3 font-medium">{comparison.pumpType}</td>
                      <td className="border p-3">{comparison.dailyRuntime}</td>
                      <td className="border p-3">{comparison.powerConsumption}</td>
                      <td className="border p-3">{comparison.monthlyConsumption}</td>
                      <td className="border p-3 text-green-600 font-medium">{comparison.monthlyCost}</td>
                      <td className="border p-3 text-green-700 font-semibold">{comparison.annualCost}</td>
                      <td className="border p-3 text-sm">{comparison.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center text-sm text-green-700">
              <p>Variable speed pumps can save $200-300 annually compared to single speed pumps. Costs based on $0.12/kWh electricity rate.</p>
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pool Pump Troubleshooting Guide</h2>
            <div className="space-y-8">
              {TROUBLESHOOTING_GUIDE.map((item, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-red-600 mb-4">{item.problem}</h3>
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Possible Causes:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {item.possibleCauses.map((cause, causeIndex) => (
                          <li key={causeIndex} className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Diagnostic Steps:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {item.diagnostics.map((diagnostic, diagIndex) => (
                          <li key={diagIndex} className="flex items-start gap-2">
                            <Wrench className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            {diagnostic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Solutions:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {item.solutions.map((solution, solIndex) => (
                          <li key={solIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do I need GFCI protection for my pool pump?</h3>
                <p className="text-gray-700">Yes, NEC Article 680.22(B) requires GFCI protection for all pool pump motors. This is a critical safety requirement that protects against electric shock in wet locations. Use a GFCI circuit breaker in your electrical panel.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What wire size do I need for a 1.5 HP pool pump?</h3>
                <p className="text-gray-700">For a 1.5 HP pool pump, use NEC Table 430.248 which shows 8.0A full load current. The minimum circuit size is 8.0A × 1.25 = 10A, so a 15A circuit with 14 AWG wire is typically adequate. However, consider voltage drop for longer runs.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I use an extension cord for my pool pump?</h3>
                <p className="text-gray-700">No, NEC 680.21(A)(1) requires permanent wiring for pool pump motors. Extension cords are not permitted. The pump must be hard-wired to the electrical panel through proper wiring methods.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How close can pool equipment be to the pool?</h3>
                <p className="text-gray-700">Pool pump motors must be located at least 5 feet from the pool edge per NEC 680.22(A)(5). This clearance requirement ensures safety and reduces the risk of electrical hazards near the pool water.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What is equipotential bonding for pools?</h3>
                <p className="text-gray-700">Equipotential bonding connects all metallic pool components with 8 AWG copper wire to eliminate voltage differences. This includes the pump motor, pool structure, ladders, and other metal parts. It's required by NEC 680.26.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Are variable speed pumps worth the extra cost?</h3>
                <p className="text-gray-700">Yes, variable speed pumps typically save 50-90% in energy costs compared to single speed pumps. While they cost $300-800 more initially, they often pay for themselves within 1-2 years through reduced electricity bills.</p>
              </div>
            </div>
          </div>

          {/* Professional Installation Disclaimer */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-yellow-900 mb-2">Professional Installation Recommended</h2>
                <p className="text-yellow-800 text-sm mb-3">
                  Pool electrical installations involve complex safety requirements and local code compliance. This calculator provides guidance but does not replace professional electrical work or local code authority approval.
                </p>
                <ul className="text-yellow-800 space-y-1 text-sm">
                  <li>• Always obtain required electrical permits before starting work</li>
                  <li>• Have installations inspected by local electrical inspector</li>
                  <li>• Consider hiring licensed electrician familiar with pool codes</li>
                  <li>• Verify all calculations with local electrical code requirements</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related Calculators */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Pool & Electrical Calculators</h2>
              <p className="text-gray-600">Complete your pool electrical system design with these professional tools</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/calculators/hot-tub-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Droplets className="w-8 h-8 text-cyan-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Hot Tub Calculator</h3>
                <p className="text-xs text-gray-600">Spa equipment sizing</p>
              </Link>
              
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Size Calculator</h3>
                <p className="text-xs text-gray-600">AWG sizing tool</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Target className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop Calculator</h3>
                <p className="text-xs text-gray-600">Check line losses</p>
              </Link>
              
              <Link href="/calculators/conduit-fill-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Settings className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Conduit Fill Calculator</h3>
                <p className="text-xs text-gray-600">Underground runs</p>
              </Link>
              
              <Link href="/calculators/garage-subpanel-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Subpanel Calculator</h3>
                <p className="text-xs text-gray-600">Pool house panel</p>
              </Link>
              
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <BookOpen className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service sizing</p>
              </Link>
            </div>
          </div>

          {/* External Resources */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Professional Resources & References</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Industry Organizations</h3>
                <div className="space-y-3 text-sm">
                  <a href="https://www.nfpa.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    National Fire Protection Association (NFPA) - NEC Publisher
                  </a>
                  <a href="https://www.apsp.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    Association of Pool & Spa Professionals (APSP)
                  </a>
                  <a href="https://www.iaei.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    International Association of Electrical Inspectors
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Manufacturer Resources</h3>
                <div className="space-y-3 text-sm">
                  <a href="https://www.pentair.com/pool" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    Pentair Pool Products - Installation Guides
                  </a>
                  <a href="https://www.hayward-pool.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    Hayward Pool Products - Technical Support
                  </a>
                  <a href="https://www.jandy.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    Jandy Pool Products - Electrical Specifications
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}