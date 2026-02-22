import { Metadata } from 'next';
import { AirConditionerCalculator } from '@/components/calculators';
import { Thermometer, Calculator, AlertTriangle, Settings, Target, BookOpen, Users, Shield, MapPin, Zap, Wrench, CheckCircle, Snowflake, Sun, Wind } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Air Conditioner Calculator | AC Unit Wire Size Calculator | HVAC Electrical',
  description: 'Calculate wire size and circuit requirements for air conditioning units and HVAC equipment. Professional HVAC electrical calculator with comprehensive installation guidance.',
  keywords: 'air conditioner calculator, AC unit wire size, HVAC electrical calculator, air conditioning circuit, central air installation, ductless mini split',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Air Conditioner Electrical Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Size electrical components for AC installations including disconnect requirements.",
  "keywords": "AC electrical, cooling equipment, HVAC calculator",
  "url": `https://wiresizes.com/calculators/air-conditioner-calculator`,
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

const AC_UNIT_EXAMPLES = [
  {
    title: 'Central Air 3 Ton Unit',
    scenario: '36,000 BTU central AC, 75ft run, 240V system',
    calculation: 'Power Draw: 36000 BTU ÷ 10 SEER = 3600W\nCurrent: 3600W ÷ 240V = 15A\nMinimum Circuit: 15A × 1.25 = 18.75A → 20A\nWire Size: 12 AWG copper (20A capacity)\nVoltage Drop: 15A × 75ft × 2.6Ω/1000ft ÷ 240V = 1.22%\nBreaker: 20A double-pole\nDisconnect: 30A non-fused at unit',
    result: '20A circuit, 12 AWG wire',
    efficiency: '10 SEER, standard efficiency',
    cost: '$350 materials + installation',
    application: 'Typical residential central air'
  },
  {
    title: 'High Efficiency 4 Ton Heat Pump',
    scenario: '48,000 BTU heat pump, 50ft run, emergency heat',
    calculation: 'AC Mode: 48000 BTU ÷ 16 SEER = 3000W = 12.5A\nHeat Pump: Similar current draw\nEmergency Heat: 15kW = 62.5A additional\nAC Circuit: 12.5A × 1.25 = 15.6A → 20A\nEmerg Heat: 62.5A × 1.25 = 78A → 90A\nTotal Load: Consider diversity factor',
    result: '20A for AC, 90A for heat strips',
    efficiency: '16 SEER heat pump with backup',
    cost: '$800 materials + dual circuits',
    application: 'High efficiency residential system'
  },
  {
    title: 'Ductless Mini-Split 18,000 BTU',
    scenario: 'Single zone mini-split, 30ft lineSet run',
    calculation: 'Cooling Power: 18000 BTU ÷ 22 SEER = 818W\nCurrent Draw: 818W ÷ 240V = 3.4A\nMinimum Circuit: 3.4A × 1.25 = 4.25A → 15A\nWire Size: 14 AWG adequate\nVoltage Drop: 3.4A × 30ft × 2.6Ω/1000ft ÷ 240V = 0.11%\nBreaker: 15A double-pole\nWhip: Flexible conduit to unit',
    result: '15A circuit, 14 AWG wire',
    efficiency: '22+ SEER high efficiency',
    cost: '$200 materials + whip connection',
    application: 'Ductless zone cooling/heating'
  },
  {
    title: 'Window AC Unit 12,000 BTU',
    scenario: '120V window unit, existing outlet',
    calculation: 'Power Draw: 12000 BTU ÷ 10 EER = 1200W\nCurrent: 1200W ÷ 120V = 10A\nStarting Current: 10A × 3 = 30A surge\nCircuit Required: 15A minimum (10A × 1.5)\nWire Size: 14 AWG to dedicated outlet\nGFCI: Required if within 6ft of sink\nCord: 6ft maximum per UL standards',
    result: '15A circuit, dedicated outlet',
    efficiency: '10 EER window unit',
    cost: '$150 outlet installation',
    application: 'Room air conditioner'
  },
  {
    title: 'Commercial Rooftop Unit 10 Ton',
    scenario: '120,000 BTU 3-phase commercial unit',
    calculation: '3-Phase Power: 120000 BTU ÷ 12 SEER = 10000W\n3-Phase Current: 10000W ÷ (208V × √3) = 27.7A\nMinimum Circuit: 27.7A × 1.25 = 34.6A → 40A\nWire Size: 8 AWG × 3 phases + ground\nVoltage Drop: Check at full load distance\nProtection: 50A 3-pole breaker\nDisconnect: Lockable at unit location',
    result: '40A 3-phase, 8 AWG wire',
    efficiency: '12 SEER commercial efficiency',
    cost: '$600 materials + 3-phase connection',
    application: 'Commercial rooftop package unit'
  },
  {
    title: 'Multi-Zone Mini-Split System',
    scenario: '4 indoor units, 48,000 BTU total capacity',
    calculation: 'Outdoor Unit: 48000 BTU ÷ 20 SEER = 2400W\nOperating Current: 2400W ÷ 240V = 10A\nMaximum Current: 15A (manufacturer spec)\nCircuit Required: 15A × 1.25 = 18.75A → 20A\nIndoor Units: Low voltage control wiring\nLinesets: Individual refrigerant lines\nPower: Only outdoor unit needs 240V',
    result: '20A circuit to outdoor unit only',
    efficiency: '20+ SEER variable speed',
    cost: '$400 materials + multi-zone setup',
    application: 'Multi-zone ductless system'
  }
];

const AC_UNIT_TYPES = [
  {
    type: 'Central Air Split System',
    capacity: '18,000-60,000 BTU',
    voltage: '240V single phase',
    efficiency: '14-20 SEER',
    typicalCurrent: '8-25A',
    circuitSize: '15-30A',
    wireSize: '14-10 AWG',
    cost: '$300-800 electrical',
    pros: 'Whole house cooling, established technology',
    cons: 'Requires ductwork, less efficient than mini-splits',
    application: 'Residential whole-house cooling'
  },
  {
    type: 'Heat Pump System',
    capacity: '18,000-60,000 BTU',
    voltage: '240V + aux heat',
    efficiency: '14-22 SEER',
    typicalCurrent: '8-25A + heat strips',
    circuitSize: '20A + 60-100A heat',
    wireSize: '12 AWG + larger for heat',
    cost: '$500-1200 electrical',
    pros: 'Heating and cooling, efficient in mild climates',
    cons: 'Requires backup heat in cold climates',
    application: 'Year-round climate control'
  },
  {
    type: 'Ductless Mini-Split',
    capacity: '9,000-36,000 BTU',
    voltage: '240V to outdoor unit',
    efficiency: '16-30+ SEER',
    typicalCurrent: '3-15A',
    circuitSize: '15-20A',
    wireSize: '14-12 AWG',
    cost: '$200-400 electrical',
    pros: 'High efficiency, zone control, no ductwork',
    cons: 'Indoor unit visible, refrigerant lines',
    application: 'Zone cooling, additions, efficiency upgrades'
  },
  {
    type: 'Window/Wall Units',
    capacity: '5,000-24,000 BTU',
    voltage: '120V or 240V',
    efficiency: '8-15 EER',
    typicalCurrent: '5-20A',
    circuitSize: '15-30A',
    wireSize: '14-10 AWG',
    cost: '$100-250 electrical',
    pros: 'Low cost, easy installation, portable',
    cons: 'Lower efficiency, window obstruction, noise',
    application: 'Single room cooling, temporary solutions'
  },
  {
    type: 'Commercial Package Units',
    capacity: '60,000-600,000 BTU',
    voltage: '208V/480V 3-phase',
    efficiency: '10-16 SEER',
    typicalCurrent: '25-150A',
    circuitSize: '30-200A',
    wireSize: '10 AWG-250 MCM',
    cost: '$800-3000 electrical',
    pros: 'All components in one unit, easier service',
    cons: 'Less efficient than split systems, roof mounting',
    application: 'Commercial buildings, rooftop installations'
  }
];

const HVAC_ELECTRICAL_REQUIREMENTS = [
  {
    requirement: 'Dedicated Circuit',
    necSection: '440.62',
    rule: 'Each AC unit requires dedicated circuit',
    example: 'No other loads on AC circuit',
    reasoning: 'High starting current and continuous operation'
  },
  {
    requirement: 'Disconnecting Means',
    necSection: '440.14',
    rule: 'Disconnect within sight of AC unit',
    example: 'Pull-out disconnect at condensing unit',
    reasoning: 'Safety for service personnel'
  },
  {
    requirement: 'Overcurrent Protection',
    necSection: '440.22',
    rule: 'Circuit breaker sized per nameplate',
    example: 'Maximum fuse/breaker rating on nameplate',
    reasoning: 'Motor starting characteristics protection'
  },
  {
    requirement: 'Branch Circuit Sizing',
    necSection: '440.32',
    rule: 'Minimum 125% of rated load current',
    example: '15A RLA requires 18.75A → 20A circuit',
    reasoning: 'Continuous load operation requirements'
  },
  {
    requirement: 'Equipment Grounding',
    necSection: '440.61',
    rule: 'Equipment grounding conductor required',
    example: '12 AWG ground with 20A circuit',
    reasoning: 'Personnel protection and fault clearing'
  },
  {
    requirement: 'Working Space',
    necSection: '110.26',
    rule: '3 feet clear in front of electrical equipment',
    example: 'Condensing unit access clearance',
    reasoning: 'Safe working conditions for service'
  },
  {
    requirement: 'GFCI Protection',
    necSection: '210.8',
    rule: 'GFCI required for outdoor receptacles',
    example: 'GFCI protection for service receptacle',
    reasoning: 'Personnel protection in wet locations'
  }
];

const MANUFACTURER_SPECIFICATIONS = [
  {
    manufacturer: 'Carrier',
    model: 'Infinity 19VS',
    type: 'Variable Speed Heat Pump',
    capacity: '24,000 BTU',
    voltage: '240V',
    ratedCurrent: '8.5A',
    maxCurrent: '12.0A',
    minCircuit: '15A',
    maxBreaker: '20A',
    wireSize: '14 AWG',
    efficiency: '20.5 SEER',
    features: 'Variable speed compressor, Wi-Fi enabled',
    price: '$4500-6000'
  },
  {
    manufacturer: 'Trane',
    model: 'XV20i',
    type: 'Variable Speed AC',
    capacity: '36,000 BTU',
    voltage: '240V',
    ratedCurrent: '12.8A',
    maxCurrent: '18.2A',
    minCircuit: '20A',
    maxBreaker: '30A',
    wireSize: '12 AWG',
    efficiency: '22 SEER',
    features: 'TruComfort technology, ComfortLink II',
    price: '$5000-7000'
  },
  {
    manufacturer: 'Mitsubishi',
    model: 'MSZ-FH18NA',
    type: 'Ductless Mini-Split',
    capacity: '18,000 BTU',
    voltage: '240V',
    ratedCurrent: '3.4A',
    maxCurrent: '5.5A',
    minCircuit: '15A',
    maxBreaker: '20A',
    wireSize: '14 AWG',
    efficiency: '22 SEER',
    features: 'Hyper-Heating, Wi-Fi control',
    price: '$1800-2500'
  },
  {
    manufacturer: 'Rheem',
    model: 'RA1048AJ1NA',
    type: 'Central Air Conditioner',
    capacity: '48,000 BTU',
    voltage: '240V',
    ratedCurrent: '17.5A',
    maxCurrent: '25.0A',
    minCircuit: '25A',
    maxBreaker: '35A',
    wireSize: '10 AWG',
    efficiency: '16 SEER',
    features: 'EcoNet enabled, scroll compressor',
    price: '$2800-3800'
  },
  {
    manufacturer: 'Daikin',
    model: 'DX16SA',
    type: 'Split System AC',
    capacity: '24,000 BTU',
    voltage: '240V',
    ratedCurrent: '9.6A',
    maxCurrent: '14.0A',
    minCircuit: '20A',
    maxBreaker: '25A',
    wireSize: '12 AWG',
    efficiency: '16 SEER',
    features: 'Quiet operation, corrosion protection',
    price: '$2200-3200'
  }
];

const INSTALLATION_STEPS = [
  {
    step: '1. Planning & Load Calculation',
    description: 'Calculate cooling load and select appropriate equipment',
    details: [
      'Perform Manual J load calculation for accurate sizing',
      'Review manufacturer electrical specifications',
      'Plan circuit routing and disconnect locations',
      'Obtain necessary electrical permits'
    ],
    timeRequired: '2-3 hours planning',
    tools: 'Load calculation software, plans'
  },
  {
    step: '2. Electrical Circuit Installation',
    description: 'Install dedicated circuit for AC equipment',
    details: [
      'Install appropriate breaker in electrical panel',
      'Run wire from panel to disconnect location',
      'Install disconnect switch within sight of unit',
      'Verify voltage and phase at disconnect'
    ],
    timeRequired: '2-4 hours',
    tools: 'Wire, conduit, disconnect switch, multimeter'
  },
  {
    step: '3. Equipment Connections',
    description: 'Connect AC unit to electrical supply',
    details: [
      'Connect supply wires to unit per wiring diagram',
      'Install equipment grounding conductor',
      'Connect low voltage control wiring if applicable',
      'Verify all connections are tight and secure'
    ],
    timeRequired: '1-2 hours',
    tools: 'Wire nuts, torque wrench, voltage tester'
  },
  {
    step: '4. Testing & Commissioning',
    description: 'Test system operation and electrical connections',
    details: [
      'Verify correct voltage at unit terminals',
      'Test compressor and fan motor operation',
      'Check current draw against nameplate ratings',
      'Commission control systems and thermostats'
    ],
    timeRequired: '1-2 hours',
    tools: 'Clamp meter, thermometer, pressure gauges'
  }
];

const COMMON_VIOLATIONS = [
  {
    violation: 'Undersized Circuit',
    description: 'Circuit breaker too small for AC unit nameplate requirements',
    consequence: 'Breaker trips repeatedly, equipment damage',
    correction: 'Upgrade to properly sized circuit per nameplate',
    necReference: 'NEC 440.22'
  },
  {
    violation: 'Missing Disconnect',
    description: 'No disconnecting means within sight of outdoor unit',
    consequence: 'Code violation, unsafe service conditions',
    correction: 'Install lockable disconnect within sight of unit',
    necReference: 'NEC 440.14'
  },
  {
    violation: 'Shared Circuit',
    description: 'AC unit sharing circuit with other loads',
    consequence: 'Voltage drop, nuisance tripping, efficiency loss',
    correction: 'Install dedicated circuit for AC equipment only',
    necReference: 'NEC 440.62'
  },
  {
    violation: 'Improper Grounding',
    description: 'Missing or inadequate equipment grounding',
    consequence: 'Shock hazard, equipment damage risk',
    correction: 'Install proper equipment grounding conductor',
    necReference: 'NEC 440.61'
  },
  {
    violation: 'Wrong Wire Size',
    description: 'Wire too small for circuit ampacity requirements',
    consequence: 'Voltage drop, overheating, fire hazard',
    correction: 'Upgrade to appropriate wire size for load',
    necReference: 'NEC 440.32'
  }
];

const ENERGY_EFFICIENCY_GUIDE = [
  {
    seerRating: '10 SEER',
    efficiency: 'Minimum Legal (phased out)',
    annualCost: '$850 (3 ton system)',
    description: 'Old systems, very inefficient',
    recommendation: 'Replace immediately',
    savings: 'Baseline'
  },
  {
    seerRating: '14 SEER',
    efficiency: 'Standard Efficiency',
    annualCost: '$607 (3 ton system)',
    description: 'Minimum new system efficiency',
    recommendation: 'Basic replacement option',
    savings: '29% vs 10 SEER'
  },
  {
    seerRating: '16 SEER',
    efficiency: 'High Efficiency',
    annualCost: '$531 (3 ton system)',
    description: 'Good efficiency, moderate premium',
    recommendation: 'Good value for most applications',
    savings: '38% vs 10 SEER'
  },
  {
    seerRating: '18-20 SEER',
    efficiency: 'Very High Efficiency',
    annualCost: '$425-472 (3 ton system)',
    description: 'Variable speed, premium features',
    recommendation: 'Long-term savings, comfort',
    savings: '44-50% vs 10 SEER'
  },
  {
    seerRating: '20+ SEER',
    efficiency: 'Ultra High Efficiency',
    annualCost: '$350-425 (3 ton system)',
    description: 'Inverter technology, maximum efficiency',
    recommendation: 'Best for high usage, utility rebates',
    savings: '50-59% vs 10 SEER'
  }
];

const TROUBLESHOOTING_GUIDE = [
  {
    problem: 'AC Unit Won\'t Start',
    possibleCauses: [
      'Tripped circuit breaker',
      'Blown fuse in disconnect',
      'Failed contactor',
      'Thermostat issues',
      'Low voltage problems'
    ],
    diagnostics: [
      'Check circuit breaker and reset if needed',
      'Test voltage at disconnect and unit',
      'Check contactor operation and contacts',
      'Verify thermostat calls for cooling',
      'Measure control voltage (24V typically)'
    ],
    solutions: [
      'Reset breaker, investigate overload cause',
      'Replace blown fuses, check for shorts',
      'Replace failed contactor',
      'Repair or replace thermostat',
      'Check transformer and control wiring'
    ]
  },
  {
    problem: 'Frequent Breaker Tripping',
    possibleCauses: [
      'Undersized circuit breaker',
      'Dirty condenser coil',
      'Failed compressor',
      'Electrical shorts',
      'Overcharged system'
    ],
    diagnostics: [
      'Compare breaker size to nameplate requirements',
      'Check condenser coil condition',
      'Test compressor amp draw',
      'Inspect all wiring for damage',
      'Check refrigerant pressures'
    ],
    solutions: [
      'Upgrade to properly sized breaker/circuit',
      'Clean condenser coil thoroughly',
      'Replace failed compressor',
      'Repair damaged wiring',
      'Adjust refrigerant charge'
    ]
  },
  {
    problem: 'High Electric Bills',
    possibleCauses: [
      'Low system efficiency (old unit)',
      'Dirty air filter',
      'Refrigerant leak',
      'Ductwork leaks',
      'Oversized or undersized unit'
    ],
    diagnostics: [
      'Check SEER rating and age of system',
      'Inspect air filter condition',
      'Check refrigerant levels and pressures',
      'Test ductwork for leaks',
      'Verify proper system sizing'
    ],
    solutions: [
      'Upgrade to high efficiency system',
      'Replace filters regularly',
      'Repair leaks, recharge system',
      'Seal ductwork leaks',
      'Install properly sized equipment'
    ]
  }
];

const REGIONAL_CODE_VARIATIONS = [
  {
    region: 'Hot Climate Zones (Southeast, Southwest)',
    requirements: [
      'Higher SEER requirements (14+ SEER minimum)',
      'Additional condenser protection requirements',
      'Enhanced grounding for outdoor equipment',
      'Special considerations for hurricane/wind zones'
    ],
    considerations: 'Focus on cooling efficiency, storm protection'
  },
  {
    region: 'Cold Climate Zones (North, Mountain States)',
    requirements: [
      'Heat pump low-ambient protection',
      'Emergency heat circuit requirements',
      'Cold weather startup provisions',
      'Freeze protection for equipment'
    ],
    considerations: 'Heating efficiency, cold weather operation'
  },
  {
    region: 'Coastal Areas',
    requirements: [
      'Corrosion-resistant equipment and wiring',
      'Enhanced grounding systems',
      'Special conduit and connector requirements',
      'Storm surge and flooding considerations'
    ],
    considerations: 'Salt air corrosion, storm resilience'
  },
  {
    region: 'Urban Areas',
    requirements: [
      'Noise ordinance compliance',
      'Space-constrained installation requirements',
      'Enhanced electrical safety measures',
      'Building code variations'
    ],
    considerations: 'Space constraints, noise control'
  }
];

export default function AirConditionerCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['electrical-load-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <Thermometer className="w-12 h-12" />
                <h1 className="text-4xl font-bold">Air Conditioner Calculator</h1>
              </div>
              <p className="text-xl mb-8 text-cyan-50">
                Calculate electrical requirements for air conditioning units and HVAC equipment. 
                Professional calculator for sizing circuits and wire for residential and commercial AC systems.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-cyan-500/20 rounded-lg p-4">
                  <Snowflake className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-2">All AC Types</h3>
                  <p className="text-sm text-cyan-100">Central air, heat pumps, mini-splits, and commercial units</p>
                </div>
                <div className="bg-cyan-500/20 rounded-lg p-4">
                  <Calculator className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-2">NEC Compliant</h3>
                  <p className="text-sm text-cyan-100">Calculations follow NEC Article 440 for AC equipment</p>
                </div>
                <div className="bg-cyan-500/20 rounded-lg p-4">
                  <Wind className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-2">Energy Efficient</h3>
                  <p className="text-sm text-cyan-100">Compare SEER ratings and optimize for energy savings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Warning */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-yellow-900 mb-2">HVAC Electrical Safety Requirements</h2>
                <div className="text-yellow-800 space-y-2 text-sm">
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-1">
                      <li>• Dedicated circuits required for all AC equipment per NEC 440.62</li>
                      <li>• Disconnect switch within sight of outdoor unit required</li>
                      <li>• Equipment must be properly grounded per NEC 440.61</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• Circuit sizing based on nameplate ratings, not BTU capacity</li>
                      <li>• HVAC installations require electrical permits and inspection</li>
                      <li>• Professional installation recommended for safety and warranty</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Component */}
          <AirConditionerCalculator />

          {/* Real-World Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Real-World Air Conditioner Installation Examples</h2>
            <div className="grid gap-8">
              {AC_UNIT_EXAMPLES.map((example, index) => (
                <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-600 mb-2">{example.title}</h3>
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

          {/* AC Unit Types Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Air Conditioner Types & Electrical Specifications</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-cyan-50">
                    <th className="border p-3 text-left font-semibold">AC Type</th>
                    <th className="border p-3 text-left font-semibold">Capacity Range</th>
                    <th className="border p-3 text-left font-semibold">Voltage</th>
                    <th className="border p-3 text-left font-semibold">Efficiency</th>
                    <th className="border p-3 text-left font-semibold">Current Draw</th>
                    <th className="border p-3 text-left font-semibold">Circuit Size</th>
                    <th className="border p-3 text-left font-semibold">Wire Size</th>
                    <th className="border p-3 text-left font-semibold">Installation Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {AC_UNIT_TYPES.map((unit, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-3 font-medium text-cyan-600">{unit.type}</td>
                      <td className="border p-3">{unit.capacity}</td>
                      <td className="border p-3">{unit.voltage}</td>
                      <td className="border p-3">{unit.efficiency}</td>
                      <td className="border p-3">{unit.typicalCurrent}</td>
                      <td className="border p-3">{unit.circuitSize}</td>
                      <td className="border p-3">{unit.wireSize}</td>
                      <td className="border p-3">{unit.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AC_UNIT_TYPES.slice(0, 5).map((unit, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{unit.type}</h3>
                  <div className="space-y-2 text-sm mb-4">
                    <div><span className="font-medium text-green-600">Pros:</span> {unit.pros}</div>
                    <div><span className="font-medium text-red-600">Cons:</span> {unit.cons}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Best for:</strong> {unit.application}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEC Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">NEC Article 440 Requirements for Air Conditioning Equipment</h2>
            <div className="grid gap-6">
              {HVAC_ELECTRICAL_REQUIREMENTS.map((req, index) => (
                <div key={index} className="border-l-4 border-cyan-500 pl-6 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{req.requirement}</h3>
                    <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded text-sm font-medium">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular AC Unit Manufacturer Specifications</h2>
            <div className="grid gap-6">
              {MANUFACTURER_SPECIFICATIONS.map((unit, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="grid lg:grid-cols-5 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-cyan-600">{unit.manufacturer}</h3>
                      <p className="text-gray-700 font-medium">{unit.model}</p>
                      <p className="text-sm text-gray-600">{unit.type}</p>
                    </div>
                    <div>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Capacity:</span> {unit.capacity}</div>
                        <div><span className="font-medium">Voltage:</span> {unit.voltage}</div>
                        <div><span className="font-medium">Efficiency:</span> {unit.efficiency}</div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">RLA:</span> {unit.ratedCurrent}</div>
                        <div><span className="font-medium">MCA:</span> {unit.maxCurrent}</div>
                        <div><span className="font-medium">Min Circuit:</span> {unit.minCircuit}</div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Max Breaker:</span> {unit.maxBreaker}</div>
                        <div><span className="font-medium">Wire Size:</span> {unit.wireSize}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm space-y-1">
                        <div><span className="font-medium">Features:</span></div>
                        <p className="text-gray-600 text-xs">{unit.features}</p>
                        <div className="font-medium text-green-600">{unit.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-sm text-gray-600 text-center">
              <p>RLA = Rated Load Amperage, MCA = Minimum Circuit Ampacity. Always follow manufacturer nameplate specifications.</p>
            </div>
          </div>

          {/* Installation Steps */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Professional AC Electrical Installation Steps</h2>
            <div className="space-y-8">
              {INSTALLATION_STEPS.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
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
            <h2 className="text-3xl font-bold text-red-900 mb-8 text-center">Common AC Electrical Code Violations</h2>
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

          {/* Energy Efficiency Guide */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-8">
            <h2 className="text-3xl font-bold text-green-900 mb-8 text-center">Air Conditioner Energy Efficiency Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                <thead>
                  <tr className="bg-green-100">
                    <th className="border p-3 text-left font-semibold">SEER Rating</th>
                    <th className="border p-3 text-left font-semibold">Efficiency Level</th>
                    <th className="border p-3 text-left font-semibold">Annual Cost</th>
                    <th className="border p-3 text-left font-semibold">Description</th>
                    <th className="border p-3 text-left font-semibold">Recommendation</th>
                    <th className="border p-3 text-left font-semibold">Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {ENERGY_EFFICIENCY_GUIDE.map((guide, index) => (
                    <tr key={index} className="hover:bg-green-50">
                      <td className="border p-3 font-medium text-green-700">{guide.seerRating}</td>
                      <td className="border p-3">{guide.efficiency}</td>
                      <td className="border p-3 font-medium">{guide.annualCost}</td>
                      <td className="border p-3 text-sm">{guide.description}</td>
                      <td className="border p-3 text-sm">{guide.recommendation}</td>
                      <td className="border p-3 text-green-600 font-medium">{guide.savings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center text-sm text-green-700">
              <p>Costs based on 2000 hours annual operation, $0.12/kWh electricity rate. Higher SEER systems qualify for utility rebates.</p>
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">AC Electrical Troubleshooting Guide</h2>
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

          {/* Regional Code Variations */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Regional Code Variations for AC Systems</h2>
            <div className="grid gap-6">
              {REGIONAL_CODE_VARIATIONS.map((region, index) => (
                <div key={index} className="bg-white rounded-lg border-l-4 border-blue-500 p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">{region.region}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Special Requirements:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {region.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Considerations:</h4>
                      <p className="text-sm text-gray-700">{region.considerations}</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What size circuit do I need for a 3-ton central air conditioner?</h3>
                <p className="text-gray-700">A 3-ton (36,000 BTU) central air conditioner typically requires a 20-25A circuit. Check the unit nameplate for exact requirements, as this varies by manufacturer and efficiency rating. The nameplate shows the Minimum Circuit Ampacity (MCA) and Maximum Overcurrent Protection Device (MOPD).</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I use the same circuit for the indoor and outdoor units?</h3>
                <p className="text-gray-700">For most residential split systems, yes. The outdoor unit typically draws the most current and the indoor air handler is often supplied by the same circuit through control wiring. However, some systems require separate circuits, especially those with electric heat strips.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do I need a disconnect switch for my AC unit?</h3>
                <p className="text-gray-700">Yes, NEC 440.14 requires a disconnecting means within sight of the AC equipment. This is typically a pull-out disconnect box mounted near the outdoor unit. The disconnect must be lockable and rated for the full load current of the equipment.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What's the difference between RLA and MCA on the nameplate?</h3>
                <p className="text-gray-700">RLA (Rated Load Amperage) is the current draw during normal operation. MCA (Minimum Circuit Ampacity) includes safety factors and is what you use to size the circuit conductors. Always use MCA for wire sizing and circuit calculations.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How much more efficient are newer AC units?</h3>
                <p className="text-gray-700">Modern AC units are significantly more efficient. A new 16 SEER unit uses about 38% less energy than an old 10 SEER unit. High-efficiency 20+ SEER units can save 50-60% compared to older systems, though they require proper electrical sizing for optimal operation.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I install a mini-split system myself?</h3>
                <p className="text-gray-700">While the electrical connections can be straightforward (often just a 240V circuit), mini-split installation involves refrigerant work that typically requires EPA certification. The electrical portion must still meet local code requirements and may require permits and inspection.</p>
              </div>
            </div>
          </div>

          {/* Professional Installation Note */}
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-orange-900 mb-2">Professional Installation Recommended</h2>
                <p className="text-orange-800 text-sm mb-3">
                  AC electrical installations involve high-current circuits and specialized requirements. This calculator provides guidance but professional installation ensures safety, efficiency, and warranty compliance.
                </p>
                <ul className="text-orange-800 space-y-1 text-sm">
                  <li>• Always follow manufacturer specifications and local electrical codes</li>
                  <li>• Obtain electrical permits and schedule inspections as required</li>
                  <li>• Consider hiring licensed HVAC contractors for complete installations</li>
                  <li>• Verify warranty requirements before beginning electrical work</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related Calculators */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related HVAC & Electrical Calculators</h2>
              <p className="text-gray-600">Complete your HVAC electrical system design with these professional tools</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <BookOpen className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service sizing</p>
              </Link>
              
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Size Calculator</h3>
                <p className="text-xs text-gray-600">AWG sizing</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Target className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Long runs</p>
              </Link>
              
              <Link href="/calculators/conduit-fill-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Settings className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Conduit Fill</h3>
                <p className="text-xs text-gray-600">Wire management</p>
              </Link>
              
              <Link href="/calculators/three-phase-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Three Phase</h3>
                <p className="text-xs text-gray-600">Commercial units</p>
              </Link>
              
              <Link href="/calculators/garage-subpanel-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Subpanel</h3>
                <p className="text-xs text-gray-600">Workshop cooling</p>
              </Link>
            </div>
          </div>

          {/* External Resources */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Professional Resources & References</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-cyan-600 mb-4">Industry Organizations</h3>
                <div className="space-y-3 text-sm">
                  <a href="https://www.nfpa.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    National Fire Protection Association - NEC Standards
                  </a>
                  <a href="https://www.acca.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    Air Conditioning Contractors of America (ACCA)
                  </a>
                  <a href="https://www.ashrae.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    American Society of Heating, Refrigerating and AC Engineers
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-cyan-600 mb-4">Manufacturer Resources</h3>
                <div className="space-y-3 text-sm">
                  <a href="https://www.carrier.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    Carrier Corporation - Installation Manuals
                  </a>
                  <a href="https://www.trane.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    Trane Technologies - Technical Support
                  </a>
                  <a href="https://www.mitsubishipro.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    Mitsubishi Electric - Mini-Split Resources
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
