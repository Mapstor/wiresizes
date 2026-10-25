import { Metadata } from 'next';
import ClientThreePhaseCalculator from '@/components/calculators/ClientThreePhaseCalculator';
import { Zap, Calculator, Settings, Target, Users, AlertTriangle, Shield, Factory, TrendingUp, MapPin } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';

export const metadata: Metadata = {
  title: 'Three Phase Calculator — Δ / Y',
  description: 'Three-phase power, current, and wire size for delta and wye systems. P = √3 × V × I × PF. Balanced and unbalanced load support.',
  keywords: 'three phase calculator, 3-phase power calculator, industrial electrical calculator, three phase current, 3-phase voltage calculations, motor calculator, transformer sizing, power factor correction',
  alternates: { canonical: '/calculators/three-phase-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "Three Phase Calculator",
  url: "https://wiresizes.com/calculators/three-phase-calculator",
  description: "Calculate three-phase electrical power, current, voltage, and motor loads for industrial and commercial applications. Professional 3-phase electrical calculations with power factor correction, load balancing, and transformer sizing."
};

const THREE_PHASE_EXAMPLES = [
  {
    title: '50 HP Industrial Motor',
    scenario: '50 HP motor, 460V, 3-phase, 0.85 PF',
    specs: 'Power: 50 HP (37.3 kW), Voltage: 460V, Efficiency: 92%',
    calculation: '3-Phase Motor Calculation:\nRated Power: 50 HP = 37,300W\nActual Power: 37,300W ÷ 0.92 efficiency = 40,543W\nLine Current: 40,543W ÷ (460V × √3 × 0.85 PF) = 59.7A\nStarting Current: 59.7A × 6 = 358A (typical 6×)\nWire Size: 6 AWG copper (75A capacity)\nBreaker: 100A (125% of FLA per NEC 430.52)\nDisconnect: 100A motor-rated switch',
    result: '100A circuit, 6 AWG wire',
    starting: '358A starting current'
  },
  {
    title: 'Manufacturing Facility Load',
    scenario: 'Factory with mixed 3-phase loads, 480V system',
    specs: 'Motors: 200A, Lighting: 50A, HVAC: 75A, Other: 25A',
    calculation: 'Industrial Load Calculation:\nMotor Loads: 200A @ 0.8 PF\nLighting: 50A @ 0.95 PF (LED)\nHVAC: 75A @ 0.88 PF\nOther: 25A @ 0.9 PF\nTotal Apparent Power: √3 × V × I total\nPower Factor Correction needed\nMain Service: 400A minimum\nFeeder: 500 kcmil per phase\nTransformer: 480V to 208V/120V',
    result: '400A service, 500 kcmil',
    starting: 'Motor starting analysis required'
  },
  {
    title: 'Commercial Building HVAC',
    scenario: '3-phase rooftop units, 208V system',
    specs: '5 units, 15 HP each, variable loads',
    calculation: 'Commercial HVAC System:\nUnit Load: 15 HP = 11.2 kW each\nTotal Load: 5 × 11.2 kW = 56 kW\nLine Current per unit: 11,200W ÷ (208V × √3 × 0.85) = 36.6A\nTotal Current: 5 × 36.6A = 183A\nDemand Factor: 100% (critical loads)\nFeeder Size: 4/0 AWG copper\nMain Breaker: 225A\nIndividual Unit Breakers: 50A each',
    result: '225A feeder, 4/0 AWG',
    starting: 'Soft starters recommended'
  },
  {
    title: 'Data Center UPS System',
    scenario: '200kW UPS system, 480V input/output',
    specs: 'UPS: 200kW, Efficiency: 94%, Battery backup',
    calculation: 'Data Center UPS Calculation:\nUPS Input: 200kW ÷ 0.94 = 212.8kW\nInput Current: 212,800W ÷ (480V × √3 × 0.98 PF) = 260A\nBattery Charger: Additional 20A\nTotal Input: 280A\nBypass Circuit: 300A (125% of load)\nFeeder: 600 kcmil per phase\nRedundant Feeds: Dual 300A services\nGrounding: Enhanced for IT loads',
    result: '300A service, 600 kcmil',
    starting: 'Soft start for UPS input'
  },
  {
    title: 'Welding Shop Distribution',
    scenario: 'Multiple 3-phase welders, 480V supply',
    specs: '10 welding stations, 100A each, 60% duty cycle',
    calculation: 'Welding Shop Load Analysis:\nConnected Load: 10 × 100A = 1,000A\nDemand Factor: 100% first welder + 85% remainder\nDemand Calculation: 100A + (900A × 0.85) = 865A\nDuty Cycle Factor: 865A × √0.6 = 670A\nService Required: 800A main service\nFeeder per station: 4 AWG per phase\nMain Feeder: (2) 500 kcmil parallel\nGrounding: Enhanced for welding loads',
    result: '800A service, parallel feeders',
    starting: 'Arc starting consideration'
  },
  {
    title: 'Water Treatment Plant',
    scenario: 'Municipal water treatment, multiple pumps',
    specs: 'Primary: 100 HP, Secondary: 3 × 25 HP, Controls',
    calculation: 'Water Treatment Electrical:\nPrimary Pump: 100 HP = 74.6 kW\nSecondary Pumps: 3 × 25 HP = 55.9 kW\nControls & Instrumentation: 10 kW\nTotal Load: 140.5 kW\nPrimary Current: 112A @ 460V\nSecondary Current: 3 × 28A = 84A\nDiversity: Not all pumps run simultaneously\nService: 600A main service\nVFDs: Variable frequency drives for all pumps',
    result: '600A service with VFDs',
    starting: 'VFD controlled starting'
  }
];

const POWER_FORMULAS = [
  {
    type: 'Real Power (P)',
    formula: 'P = √3 × V × I × cos φ',
    units: 'Watts (W)',
    description: 'Actual power consumed by the load'
  },
  {
    type: 'Reactive Power (Q)',
    formula: 'Q = √3 × V × I × sin φ',
    units: 'Volt-Amperes Reactive (VAR)',
    description: 'Power required for magnetic fields'
  },
  {
    type: 'Apparent Power (S)',
    formula: 'S = √3 × V × I',
    units: 'Volt-Amperes (VA)',
    description: 'Total power supplied to the load'
  },
  {
    type: 'Line Current',
    formula: 'I = P ÷ (√3 × V × cos φ)',
    units: 'Amperes (A)',
    description: 'Current in each line conductor'
  },
  {
    type: 'Power Factor',
    formula: 'PF = P ÷ S = cos φ',
    units: 'Decimal (0-1)',
    description: 'Ratio of real to apparent power'
  }
];

const LOAD_BALANCING = [
  {
    issue: 'Unbalanced Current',
    cause: 'Unequal single-phase loads',
    effect: 'Neutral current, heating, inefficiency',
    solution: 'Redistribute loads across phases'
  },
  {
    issue: 'Voltage Imbalance',
    cause: 'System impedance differences',
    effect: 'Motor heating, reduced efficiency',
    solution: 'Check connections, balance transformers'
  },
  {
    issue: 'Harmonic Distortion',
    cause: 'Non-linear loads (VFDs, electronics)',
    effect: 'System heating, equipment damage',
    solution: 'Harmonic filters, K-rated transformers'
  },
  {
    issue: 'Phase Sequence',
    cause: 'Incorrect wiring connections',
    effect: 'Motor rotation direction',
    solution: 'Phase rotation meter, correct wiring'
  }
];

const MOTOR_PROTECTION = [
  {
    protection: 'Overload Protection',
    function: 'Protects against sustained overcurrent',
    devices: 'Thermal overload relays, electronic trips',
    setting: '115-125% of motor FLA'
  },
  {
    protection: 'Short Circuit Protection',
    function: 'Protects against faults and shorts',
    devices: 'Fuses, circuit breakers',
    setting: 'Per NEC 430.52 tables'
  },
  {
    protection: 'Ground Fault Protection',
    function: 'Protects against ground faults',
    devices: 'Ground fault relays, GFCI',
    setting: '30mA for personnel, higher for equipment'
  },
  {
    protection: 'Phase Loss Protection',
    function: 'Protects against single phasing',
    devices: 'Phase monitoring relays',
    setting: 'Voltage and current monitoring'
  },
  {
    protection: 'Under/Over Voltage',
    function: 'Protects against voltage variations',
    devices: 'Voltage monitoring relays',
    setting: '±10% of nominal voltage'
  }
];

const TROUBLESHOOTING_GUIDE = [
  {
    problem: 'Motor runs in wrong direction',
    causes: 'Incorrect phase sequence, miswiring',
    diagnosis: 'Check phase rotation with meter',
    solution: 'Swap any two line conductors'
  },
  {
    problem: 'High motor current draw',
    causes: 'Overload, voltage imbalance, mechanical binding',
    diagnosis: 'Check load, voltage balance, coupling',
    solution: 'Reduce load, balance voltage, check mechanics'
  },
  {
    problem: 'Motor overheating',
    causes: 'Overload, poor ventilation, voltage issues',
    diagnosis: 'Check current, airflow, voltage',
    solution: 'Reduce load, improve cooling, fix voltage'
  },
  {
    problem: 'Voltage imbalance',
    causes: 'Loose connections, unbalanced loads, transformer issues',
    diagnosis: 'Measure voltage at all points under load',
    solution: 'Tighten connections, balance loads, check transformer'
  },
  {
    problem: 'Low power factor',
    causes: 'Inductive loads, underloaded motors',
    diagnosis: 'Power factor measurement, load analysis',
    solution: 'Add capacitors, resize motors, VFDs'
  }
];

const REGIONAL_CODES = [
  {
    region: 'United States',
    standard: 'NEC (NFPA 70)',
    voltage: '208V, 240V, 480V, 600V common',
    frequency: '60 Hz',
    notes: 'State and local amendments vary'
  },
  {
    region: 'Canada',
    standard: 'CEC (Canadian Electrical Code)',
    voltage: '208V, 240V, 480V, 600V',
    frequency: '60 Hz',
    notes: 'Similar to NEC with provincial variations'
  },
  {
    region: 'Europe',
    standard: 'IEC Standards',
    voltage: '400V (230V phase-to-neutral)',
    frequency: '50 Hz',
    notes: 'Different voltage levels and practices'
  },
  {
    region: 'Industrial International',
    standard: 'IEC 60364, local codes',
    voltage: 'Various: 380V, 400V, 415V',
    frequency: '50/60 Hz depending on region',
    notes: 'Harmonized standards but local adoption'
  }
];

const COMPREHENSIVE_FAQS = [
  {
    question: 'What is the difference between line and phase voltage in 3-phase systems?',
    answer: 'In a wye (Y) connected system, line voltage is √3 (1.732) times the phase voltage. For example, a 208Y/120V system has 208V line-to-line and 120V line-to-neutral. In a delta system, line and phase voltages are equal, but line current is √3 times phase current.'
  },
  {
    question: 'How do I calculate motor starting current for 3-phase motors?',
    answer: 'Motor starting current (locked rotor amperage) is typically 6-8 times the full load amperage (FLA) for standard motors. Use motor nameplate LRA if available, or multiply FLA by the motor code factor. Starting protection must be sized according to NEC 430.52 tables.'
  },
  {
    question: 'Why is power factor important in 3-phase systems?',
    answer: 'Power factor affects system efficiency. Low power factor increases current draw for the same power, requiring larger wires and equipment.'
  },
  {
    question: 'What causes voltage imbalance in 3-phase systems?',
    answer: 'Voltage imbalance can be caused by loose connections, unequal single-phase loads, transformer problems, or utility supply issues. Even small voltage imbalances (2-3%) can cause significant current imbalances and motor heating problems.'
  },
  {
    question: 'When should I use a Variable Frequency Drive (VFD)?',
    answer: 'VFDs are beneficial for applications requiring speed control or soft starting. They reduce starting current and provide precise speed control.'
  },
  {
    question: 'How do I size a transformer for 3-phase loads?',
    answer: 'Calculate total kVA demand, apply appropriate demand factors, and add 25% safety margin minimum. Consider load growth, power factor, and harmonic content. For non-linear loads, use K-rated transformers and possibly oversizing by 50-100%.'
  }
];

export default function ThreePhaseCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CombinedSchema 
        webApp={webAppData} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Three Phase Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-red-50">
                Calculate three-phase electrical power, current, voltage, and motor loads for industrial and commercial 
                applications. Professional 3-phase electrical calculations with power factor correction and load analysis.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-red-100">Applications</div>
                  <div className="font-semibold">Motors, Industrial, Commercial</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-red-100">Voltage Systems</div>
                  <div className="font-semibold">208V, 480V, 600V</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-red-100">Calculations</div>
                  <div className="font-semibold">Power, Current, PF</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="font-semibold">NEC Articles 430, 440</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Safety Information */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-red-900 mb-2">Three-Phase System Safety</h2>
                <ul className="text-red-800 space-y-1 text-sm">
                  <li>• Three-phase systems carry high power - proper safety procedures critical</li>
                  <li>• Motor starting currents can be 6-8 times running current - size accordingly</li>
                  <li>• Phase rotation affects motor direction - verify before energizing</li>
                  <li>• Voltage imbalance causes motor heating - maintain balanced loads</li>
                  <li>• Professional installation required for industrial systems</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <ClientThreePhaseCalculator />

          {/* Comprehensive Installation Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Three-Phase Installation Examples</h2>
            </div>
            
            <div className="grid gap-8">
              {THREE_PHASE_EXAMPLES.map((example, idx) => (
                <div key={idx} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{example.title}</h3>
                      <p className="text-red-700 font-medium mb-2">{example.scenario}</p>
                      <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Specifications:</span> {example.specs}</p>
                    </div>
                    <div className="sm:text-right sm:ml-4 min-w-0">
                      <div className="text-2xl font-bold text-red-600 mb-1">{example.result}</div>
                      <div className="text-sm text-gray-500 mb-1">{example.starting}</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Detailed Calculation:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-line font-mono">{example.calculation}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Power Formulas */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Three-Phase Power Formulas</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {POWER_FORMULAS.map((formula, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{formula.type}</h3>
                  <div className="bg-white rounded-lg p-4 mb-3">
                    <code className="text-lg font-mono text-blue-700">{formula.formula}</code>
                  </div>
                  <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Units:</span> {formula.units}</p>
                  <p className="text-sm text-gray-600">{formula.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Load Balancing */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Load Balancing & System Issues</h2>
            </div>
            
            <div className="space-y-6">
              {LOAD_BALANCING.map((balance, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 bg-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{balance.issue}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-purple-800 mb-1">Cause:</h4>
                      <p className="text-sm text-gray-600">{balance.cause}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800 mb-1">Effect:</h4>
                      <p className="text-sm text-gray-600">{balance.effect}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800 mb-1">Solution:</h4>
                      <p className="text-sm text-gray-600">{balance.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motor Protection */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Motor Protection Requirements</h2>
            </div>
            
            <div className="space-y-6">
              {MOTOR_PROTECTION.map((protection, idx) => (
                <div key={idx} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{protection.protection}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Function:</span> {protection.function}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Devices:</span> {protection.devices}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600"><span className="font-medium">Setting:</span> {protection.setting}</p>
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
              <h2 className="text-2xl font-bold text-gray-900">Three-Phase System Troubleshooting</h2>
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

          {/* Regional Standards */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">International Standards & Practices</h2>
            </div>
            
            <div className="space-y-4">
              {REGIONAL_CODES.map((region, idx) => (
                <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">{region.region}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Standard:</span> {region.standard}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Common Voltages:</span> {region.voltage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Frequency:</span> {region.frequency}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Notes:</span> {region.notes}</p>
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
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Related calculators</h2>
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
                <p className="text-xs text-gray-600">Long run analysis</p>
              </Link>
              
              
              
              
              <Link href="/calculators/ampacity-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <TrendingUp className="w-8 h-8 text-indigo-600 mb-2" />
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
