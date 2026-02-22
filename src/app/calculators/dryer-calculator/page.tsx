import { Metadata } from 'next';
import { DryerCalculator } from '@/components/calculators';
import { Zap, Calculator, AlertTriangle, Settings, Target, BookOpen, Users, Shield, MapPin, Wrench, CheckCircle, Flame } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Electric Dryer Calculator | 240V Dryer Circuit Calculator | Clothes Dryer Wire Size',
  description: 'Calculate wire size and circuit requirements for electric clothes dryers. Professional 240V dryer electrical calculator with comprehensive installation guidance.',
  keywords: 'dryer calculator, electric dryer circuit, dryer wire size, 240V dryer installation, clothes dryer electrical, laundry room wiring',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Dryer Circuit Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Size wire and breaker for electric clothes dryers per NEC requirements.",
  "keywords": "dryer wiring, dryer outlet, NEMA 14-30",
  "url": `https://wiresizes.com/calculators/dryer-calculator`,
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

const DRYER_EXAMPLES = [
  {
    title: 'Standard Electric Dryer',
    scenario: '5000W electric dryer, 30ft run, 240V circuit',
    calculation: 'Power: 5000W\nCurrent: 5000W ÷ 240V = 20.8A\nMinimum Circuit: 20.8A × 1.25 = 26A → 30A\nWire Size: 10 AWG copper (30A capacity)\nVoltage Drop: 20.8A × 30ft × 1.6Ω/1000ft ÷ 240V = 0.42%\nBreaker: 30A double-pole\nReceptacle: NEMA 10-30R or 14-30R',
    result: '30A circuit, 10 AWG wire',
    efficiency: 'Standard residential dryer',
    cost: '$150 materials + installation',
    application: 'Most common residential installation'
  },
  {
    title: 'High-Efficiency Heat Pump Dryer',
    scenario: '2400W heat pump dryer, 25ft run',
    calculation: 'Power: 2400W (much lower than standard)\nCurrent: 2400W ÷ 240V = 10A\nMinimum Circuit: 10A × 1.25 = 12.5A → 15A\nWire Size: 14 AWG copper adequate\nVoltage Drop: 10A × 25ft × 2.6Ω/1000ft ÷ 240V = 0.27%\nBreaker: 15A double-pole\nReceptacle: Can use standard 240V outlet',
    result: '15A circuit, 14 AWG wire',
    efficiency: 'Energy Star certified, 50% energy savings',
    cost: '$100 materials + outlet',
    application: 'Energy-efficient upgrade option'
  },
  {
    title: 'Large Capacity Commercial Dryer',
    scenario: '7500W commercial dryer, 40ft run',
    calculation: 'Power: 7500W\nCurrent: 7500W ÷ 240V = 31.25A\nMinimum Circuit: 31.25A × 1.25 = 39A → 40A\nWire Size: 8 AWG copper (40A capacity)\nVoltage Drop: 31.25A × 40ft × 1.2Ω/1000ft ÷ 240V = 0.63%\nBreaker: 40A double-pole\nReceptacle: NEMA 14-50R',
    result: '40A circuit, 8 AWG wire',
    efficiency: 'Heavy-duty commercial unit',
    cost: '$200 materials + heavy-duty outlet',
    application: 'Laundromats, apartment buildings'
  },
  {
    title: 'Gas Dryer with Electric Ignition',
    scenario: 'Gas dryer with 120V electric ignition, 20ft run',
    calculation: 'Power: 400W (ignition and controls only)\nCurrent: 400W ÷ 120V = 3.33A\nMinimum Circuit: 15A dedicated or shared\nWire Size: 14 AWG copper\nVoltage Drop: 3.33A × 20ft × 2.6Ω/1000ft ÷ 120V = 1.44%\nBreaker: 15A single-pole\nReceptacle: Standard 120V NEMA 5-15R',
    result: '15A 120V circuit, 14 AWG wire',
    efficiency: 'Lower electrical load, gas heating',
    cost: '$75 materials + standard outlet',
    application: 'Homes with natural gas availability'
  },
  {
    title: 'Stackable Washer/Dryer Combo',
    scenario: '4500W combo unit, 35ft run, shared laundry circuit',
    calculation: 'Dryer Power: 4500W\nWasher Power: 1200W (separate circuit recommended)\nDryer Current: 4500W ÷ 240V = 18.75A\nMinimum Circuit: 18.75A × 1.25 = 23.4A → 30A\nWire Size: 10 AWG copper\nNote: Washer needs separate 20A 120V circuit',
    result: '30A for dryer, 20A 120V for washer',
    efficiency: 'Space-saving apartment solution',
    cost: '$200 materials + dual circuits',
    application: 'Apartments, condos, small spaces'
  },
  {
    title: '240V Dryer with Long Run',
    scenario: '5500W dryer, 75ft basement run',
    calculation: 'Power: 5500W\nCurrent: 5500W ÷ 240V = 22.9A\nMinimum Circuit: 22.9A × 1.25 = 28.6A → 30A\nVoltage Drop Check: 22.9A × 75ft × 1.6Ω/1000ft ÷ 240V = 1.15%\nWire Size: 10 AWG minimum, consider 8 AWG for voltage drop\nBreaker: 30A double-pole',
    result: '30A circuit, 8 AWG wire recommended',
    efficiency: 'Standard dryer with long run consideration',
    cost: '$250 materials + conduit for basement',
    application: 'Basement laundry rooms, long runs'
  }
];

const DRYER_TYPES = [
  {
    type: 'Standard Electric',
    powerRange: '4000-6000W',
    voltage: '240V',
    current: '17-25A',
    circuitSize: '30A',
    wireSize: '10 AWG',
    receptacle: 'NEMA 10-30R or 14-30R',
    cost: '$300-800',
    pros: 'Fast drying, widely available, lower purchase cost',
    cons: 'High energy consumption, generates heat',
    application: 'Most residential installations'
  },
  {
    type: 'Heat Pump Electric',
    powerRange: '2000-3000W',
    voltage: '240V',
    current: '8-12A',
    circuitSize: '15-20A',
    wireSize: '14-12 AWG',
    receptacle: 'Standard 240V',
    cost: '$1000-1800',
    pros: '50% energy savings, gentler on clothes, cool operation',
    cons: 'Higher purchase cost, longer drying times',
    application: 'Energy-efficient homes, hot climates'
  },
  {
    type: 'Gas with Electric',
    powerRange: '300-500W',
    voltage: '120V',
    current: '3-5A',
    circuitSize: '15A',
    wireSize: '14 AWG',
    receptacle: 'NEMA 5-15R',
    cost: '$400-900',
    pros: 'Lower operating cost, faster drying than heat pump',
    cons: 'Requires gas line, ventilation concerns',
    application: 'Homes with natural gas service'
  },
  {
    type: 'Commercial Electric',
    powerRange: '6000-10000W',
    voltage: '240V or 480V',
    current: '25-50A',
    circuitSize: '40-60A',
    wireSize: '8-4 AWG',
    receptacle: 'NEMA 14-50R or hardwired',
    cost: '$1500-4000',
    pros: 'Heavy-duty construction, fast cycle times',
    cons: 'High power consumption, expensive installation',
    application: 'Laundromats, multi-family housing'
  }
];

const NEC_DRYER_REQUIREMENTS = [
  {
    requirement: 'Dedicated Circuit',
    necSection: '210.11(C)(6)',
    rule: 'Dryer outlet requires dedicated 30A circuit minimum',
    example: 'No other loads on dryer circuit',
    reasoning: 'High current draw and continuous operation'
  },
  {
    requirement: 'Circuit Sizing',
    necSection: '210.19(A)(3)',
    rule: 'Circuit capacity minimum 125% of dryer load',
    example: '5000W dryer needs 26A minimum → 30A circuit',
    reasoning: 'Account for heating element inrush current'
  },
  {
    requirement: 'Grounding',
    necSection: '250.140',
    rule: 'Equipment grounding conductor required',
    example: '4-wire circuit with equipment ground',
    reasoning: 'Safety protection for metal appliance'
  },
  {
    requirement: 'Receptacle Type',
    necSection: '210.50(C)',
    rule: 'Proper NEMA configuration for voltage/amperage',
    example: 'NEMA 14-30R for 30A 240V circuit',
    reasoning: 'Prevent incorrect appliance connections'
  },
  {
    requirement: 'Location Requirements',
    necSection: '210.52(F)',
    rule: 'Receptacle within 6 feet of dryer location',
    example: 'Outlet positioned for easy access',
    reasoning: 'Accommodate standard appliance cords'
  }
];

const DRYER_INSTALLATION_GUIDE = [
  {
    step: '1. Planning & Load Calculation',
    description: 'Determine dryer electrical requirements and plan circuit',
    details: [
      'Check dryer nameplate for exact power requirements',
      'Measure distance from electrical panel to dryer location',
      'Verify panel has adequate space and capacity',
      'Obtain electrical permit if required by local code'
    ],
    timeRequired: '1-2 hours planning',
    tools: 'Tape measure, calculator, permit application'
  },
  {
    step: '2. Circuit Installation',
    description: 'Install dedicated circuit from panel to dryer location',
    details: [
      'Install appropriate double-pole breaker in panel',
      'Run 10 AWG (or larger) wire to dryer location',
      'Use proper conduit or cable protection',
      'Install 4-wire circuit (hot-hot-neutral-ground)'
    ],
    timeRequired: '2-4 hours',
    tools: 'Wire, conduit, breaker, wire strippers'
  },
  {
    step: '3. Receptacle Installation',
    description: 'Install proper dryer receptacle',
    details: [
      'Mount outlet box at appropriate height (3-4 feet)',
      'Install NEMA 14-30R or 14-50R receptacle',
      'Connect wires per NEC code (X-Y-W-G configuration)',
      'Verify all connections are tight and secure'
    ],
    timeRequired: '1 hour',
    tools: 'Outlet box, receptacle, wire nuts, voltage tester'
  },
  {
    step: '4. Testing & Final Connection',
    description: 'Test circuit and connect dryer',
    details: [
      'Test voltage at receptacle (should read 240V)',
      'Verify proper grounding with continuity tester',
      'Connect dryer cord to unit per manufacturer instructions',
      'Test dryer operation and heating function'
    ],
    timeRequired: '30 minutes',
    tools: 'Multimeter, continuity tester'
  }
];

const COMMON_DRYER_VIOLATIONS = [
  {
    violation: '3-Wire Circuit Installation',
    description: 'Installing old-style 3-wire circuit without equipment ground',
    consequence: 'Code violation, safety hazard, failed inspection',
    correction: 'Install 4-wire circuit with equipment grounding conductor',
    necReference: 'NEC 250.140'
  },
  {
    violation: 'Undersized Circuit',
    description: 'Using 20A circuit for standard electric dryer',
    consequence: 'Breaker trips, poor dryer performance, potential fire',
    correction: 'Upgrade to minimum 30A circuit with 10 AWG wire',
    necReference: 'NEC 210.19(A)(3)'
  },
  {
    violation: 'Shared Circuit',
    description: 'Dryer sharing circuit with other appliances',
    consequence: 'Voltage drop, nuisance tripping, code violation',
    correction: 'Install dedicated circuit for dryer only',
    necReference: 'NEC 210.11(C)(6)'
  },
  {
    violation: 'Wrong Receptacle Type',
    description: 'Using NEMA 10-30R instead of 14-30R',
    consequence: 'No equipment grounding, safety concern',
    correction: 'Install proper 4-prong NEMA 14-30R receptacle',
    necReference: 'NEC 210.50(C)'
  },
  {
    violation: 'Improper Wire Size',
    description: 'Using 12 AWG wire on 30A dryer circuit',
    consequence: 'Overheating, fire hazard, code violation',
    correction: 'Install minimum 10 AWG wire for 30A circuit',
    necReference: 'NEC Table 310.16'
  }
];

const DRYER_TROUBLESHOOTING = [
  {
    problem: 'Dryer Not Heating',
    possibleCauses: [
      'No power to unit',
      'Tripped circuit breaker',
      'Blown thermal fuse',
      'Failed heating element',
      'Bad thermostat'
    ],
    diagnostics: [
      'Check voltage at dryer outlet (should be 240V)',
      'Test circuit breaker operation',
      'Check thermal fuse continuity',
      'Test heating element resistance',
      'Verify thermostat operation'
    ],
    solutions: [
      'Reset breaker, check for proper connections',
      'Replace tripped breaker if faulty',
      'Replace blown thermal fuse, check for airflow restrictions',
      'Replace failed heating element',
      'Replace faulty thermostat'
    ]
  },
  {
    problem: 'Circuit Breaker Tripping',
    possibleCauses: [
      'Overloaded circuit',
      'Short circuit in dryer',
      'Ground fault',
      'Undersized breaker',
      'Loose connections'
    ],
    diagnostics: [
      'Check dryer amp draw with clamp meter',
      'Inspect dryer wiring for damage',
      'Test insulation resistance',
      'Verify breaker size matches circuit requirements',
      'Check all electrical connections'
    ],
    solutions: [
      'Remove other loads from circuit',
      'Repair damaged wiring in dryer',
      'Replace dryer if internal ground fault exists',
      'Upgrade to properly sized breaker and wire',
      'Tighten all loose connections'
    ]
  }
];

export default function DryerCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['dryer-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-12 h-12" />
                <h1 className="text-4xl font-bold">Electric Dryer Calculator</h1>
              </div>
              <p className="text-xl mb-8 text-yellow-50">
                Calculate circuit requirements for electric clothes dryers. Professional calculator for sizing 240V circuits and wire for dryer installations.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-yellow-500/20 rounded-lg p-4">
                  <Flame className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-2">All Dryer Types</h3>
                  <p className="text-sm text-yellow-100">Standard, heat pump, commercial, and gas dryers</p>
                </div>
                <div className="bg-yellow-500/20 rounded-lg p-4">
                  <Calculator className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-2">NEC Compliant</h3>
                  <p className="text-sm text-yellow-100">Calculations follow current electrical code requirements</p>
                </div>
                <div className="bg-yellow-500/20 rounded-lg p-4">
                  <Shield className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-2">Safety First</h3>
                  <p className="text-sm text-yellow-100">4-wire circuits with proper grounding</p>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Warning */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-red-900 mb-2">Dryer Electrical Safety Requirements</h2>
                <div className="text-red-800 space-y-2 text-sm">
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-1">
                      <li>• Dedicated 30A circuit required for electric dryers</li>
                      <li>• 4-wire circuit with equipment grounding conductor mandatory</li>
                      <li>• Proper NEMA receptacle installation required</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• Circuit must be sized at 125% of dryer nameplate rating</li>
                      <li>• Electrical permits may be required for new circuits</li>
                      <li>• Professional installation recommended for safety</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Component */}
          <DryerCalculator />

          {/* Real-World Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Real-World Electric Dryer Installation Examples</h2>
            <div className="grid gap-8">
              {DRYER_EXAMPLES.map((example, index) => (
                <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-orange-600 mb-2">{example.title}</h3>
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

          {/* Dryer Types Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Dryer Types & Electrical Requirements</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-orange-50">
                    <th className="border p-3 text-left font-semibold">Dryer Type</th>
                    <th className="border p-3 text-left font-semibold">Power Range</th>
                    <th className="border p-3 text-left font-semibold">Voltage</th>
                    <th className="border p-3 text-left font-semibold">Current</th>
                    <th className="border p-3 text-left font-semibold">Circuit Size</th>
                    <th className="border p-3 text-left font-semibold">Wire Size</th>
                    <th className="border p-3 text-left font-semibold">Receptacle</th>
                    <th className="border p-3 text-left font-semibold">Cost Range</th>
                  </tr>
                </thead>
                <tbody>
                  {DRYER_TYPES.map((dryer, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-3 font-medium text-orange-600">{dryer.type}</td>
                      <td className="border p-3">{dryer.powerRange}</td>
                      <td className="border p-3">{dryer.voltage}</td>
                      <td className="border p-3">{dryer.current}</td>
                      <td className="border p-3">{dryer.circuitSize}</td>
                      <td className="border p-3">{dryer.wireSize}</td>
                      <td className="border p-3">{dryer.receptacle}</td>
                      <td className="border p-3">{dryer.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DRYER_TYPES.map((dryer, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{dryer.type}</h3>
                  <div className="space-y-2 text-sm mb-4">
                    <div><span className="font-medium text-green-600">Pros:</span> {dryer.pros}</div>
                    <div><span className="font-medium text-red-600">Cons:</span> {dryer.cons}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Best for:</strong> {dryer.application}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEC Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">NEC Requirements for Electric Dryers</h2>
            <div className="grid gap-6">
              {NEC_DRYER_REQUIREMENTS.map((req, index) => (
                <div key={index} className="border-l-4 border-orange-500 pl-6 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{req.requirement}</h3>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium">
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

          {/* Installation Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Professional Dryer Circuit Installation Guide</h2>
            <div className="space-y-8">
              {DRYER_INSTALLATION_GUIDE.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
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

          {/* Common Violations */}
          <div className="bg-red-50 rounded-xl border border-red-200 p-8">
            <h2 className="text-3xl font-bold text-red-900 mb-8 text-center">Common Dryer Electrical Code Violations</h2>
            <div className="grid gap-6">
              {COMMON_DRYER_VIOLATIONS.map((violation, index) => (
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

          {/* Troubleshooting */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Dryer Electrical Troubleshooting Guide</h2>
            <div className="space-y-8">
              {DRYER_TROUBLESHOOTING.map((item, index) => (
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What size circuit do I need for an electric dryer?</h3>
                <p className="text-gray-700">Most electric dryers require a dedicated 30A, 240V circuit with 10 AWG wire. Check your specific dryer's nameplate for exact requirements, as some high-capacity models may need 40A or 50A circuits.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I use a 3-wire circuit for a new dryer installation?</h3>
                <p className="text-gray-700">No, current NEC code requires 4-wire circuits (hot-hot-neutral-ground) for all new dryer installations. The 4th wire is the equipment grounding conductor, which is essential for safety.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What's the difference between NEMA 10-30 and 14-30 outlets?</h3>
                <p className="text-gray-700">NEMA 10-30 is the older 3-prong outlet, while NEMA 14-30 is the current 4-prong outlet with equipment grounding. New installations must use NEMA 14-30 outlets for safety compliance.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How much does it cost to install a dryer circuit?</h3>
                <p className="text-gray-700">Professional installation typically costs $200-500 depending on distance from panel, accessibility, and local rates. DIY material costs are usually $75-150 for a basic installation.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do heat pump dryers need different electrical requirements?</h3>
                <p className="text-gray-700">Yes, heat pump dryers typically use 50% less power (2000-3000W vs 5000W) and may only need a 15A or 20A circuit. Always check the manufacturer's specifications for exact requirements.</p>
              </div>
            </div>
          </div>

          {/* Related Calculators */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Electrical Calculators</h2>
              <p className="text-gray-600">Complete your laundry room electrical planning</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <BookOpen className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service sizing</p>
              </Link>
              
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Size</h3>
                <p className="text-xs text-gray-600">AWG sizing</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Target className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Long runs</p>
              </Link>
              
              <Link href="/calculators/range-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Flame className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Range Calculator</h3>
                <p className="text-xs text-gray-600">Electric ranges</p>
              </Link>
              
              <Link href="/calculators/garage-subpanel-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Subpanel</h3>
                <p className="text-xs text-gray-600">Additional panels</p>
              </Link>
              
              <Link href="/calculators/conduit-fill-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Settings className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Conduit Fill</h3>
                <p className="text-xs text-gray-600">Wire management</p>
              </Link>
            </div>
          </div>

          {/* Professional Installation Note */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-yellow-900 mb-2">Professional Installation Recommended</h2>
                <p className="text-yellow-800 text-sm mb-3">
                  Dryer electrical installations involve high-current 240V circuits that can be dangerous if installed incorrectly. This calculator provides guidance but professional installation ensures safety and code compliance.
                </p>
                <ul className="text-yellow-800 space-y-1 text-sm">
                  <li>• Always follow local electrical codes and obtain required permits</li>
                  <li>• Use proper 4-wire circuits with equipment grounding conductor</li>
                  <li>• Consider hiring licensed electrician for 240V installations</li>
                  <li>• Verify installation with electrical inspector if required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
