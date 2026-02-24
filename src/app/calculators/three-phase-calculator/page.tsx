import { Metadata } from 'next';
import ClientThreePhaseCalculator from '@/components/calculators/ClientThreePhaseCalculator';
import { Zap, Calculator, Settings, Target, BookOpen, Users, AlertTriangle, Shield, Factory, Cog, TrendingUp, DollarSign, MapPin } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Three Phase Calculator | 3-Phase Power Calculator | Industrial Motor & Load Calculator',
  description: 'Calculate three-phase electrical power, current, voltage, and motor loads for industrial and commercial applications. Professional 3-phase electrical calculations with power factor correction, load balancing, and transformer sizing.',
  keywords: 'three phase calculator, 3-phase power calculator, industrial electrical calculator, three phase current, 3-phase voltage calculations, motor calculator, transformer sizing, power factor correction',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Three Phase Power Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Complete three-phase electrical calculations including current, voltage, and power.",
  "keywords": "3 phase power, three phase current, industrial power",
  "url": `https://wiresizes.com/calculators/three-phase-calculator`,
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

const THREE_PHASE_EXAMPLES = [
  {
    title: '50 HP Industrial Motor',
    scenario: '50 HP motor, 460V, 3-phase, 0.85 PF',
    specs: 'Power: 50 HP (37.3 kW), Voltage: 460V, Efficiency: 92%',
    calculation: '3-Phase Motor Calculation:\nRated Power: 50 HP = 37,300W\nActual Power: 37,300W ÷ 0.92 efficiency = 40,543W\nLine Current: 40,543W ÷ (460V × √3 × 0.85 PF) = 59.7A\nStarting Current: 59.7A × 6 = 358A (typical 6×)\nWire Size: 6 AWG copper (75A capacity)\nBreaker: 100A (125% of FLA per NEC 430.52)\nDisconnect: 100A motor-rated switch',
    result: '100A circuit, 6 AWG wire',
    starting: '358A starting current',
    cost: '$2,200 motor circuit installation',
    compliance: 'NEC Article 430 motors'
  },
  {
    title: 'Manufacturing Facility Load',
    scenario: 'Factory with mixed 3-phase loads, 480V system',
    specs: 'Motors: 200A, Lighting: 50A, HVAC: 75A, Other: 25A',
    calculation: 'Industrial Load Calculation:\nMotor Loads: 200A @ 0.8 PF\nLighting: 50A @ 0.95 PF (LED)\nHVAC: 75A @ 0.88 PF\nOther: 25A @ 0.9 PF\nTotal Apparent Power: √3 × V × I total\nPower Factor Correction needed\nMain Service: 400A minimum\nFeeder: 500 kcmil per phase\nTransformer: 480V to 208V/120V',
    result: '400A service, 500 kcmil',
    starting: 'Motor starting analysis required',
    cost: '$15,000 main service installation',
    compliance: 'NEC 220 load calculations'
  },
  {
    title: 'Commercial Building HVAC',
    scenario: '3-phase rooftop units, 208V system',
    specs: '5 units, 15 HP each, variable loads',
    calculation: 'Commercial HVAC System:\nUnit Load: 15 HP = 11.2 kW each\nTotal Load: 5 × 11.2 kW = 56 kW\nLine Current per unit: 11,200W ÷ (208V × √3 × 0.85) = 36.6A\nTotal Current: 5 × 36.6A = 183A\nDemand Factor: 100% (critical loads)\nFeeder Size: 4/0 AWG copper\nMain Breaker: 225A\nIndividual Unit Breakers: 50A each',
    result: '225A feeder, 4/0 AWG',
    starting: 'Soft starters recommended',
    cost: '$8,500 HVAC electrical system',
    compliance: 'NEC 440 air conditioning'
  },
  {
    title: 'Data Center UPS System',
    scenario: '200kW UPS system, 480V input/output',
    specs: 'UPS: 200kW, Efficiency: 94%, Battery backup',
    calculation: 'Data Center UPS Calculation:\nUPS Input: 200kW ÷ 0.94 = 212.8kW\nInput Current: 212,800W ÷ (480V × √3 × 0.98 PF) = 260A\nBattery Charger: Additional 20A\nTotal Input: 280A\nBypass Circuit: 300A (125% of load)\nFeeder: 600 kcmil per phase\nRedundant Feeds: Dual 300A services\nGrounding: Enhanced for IT loads',
    result: '300A service, 600 kcmil',
    starting: 'Soft start for UPS input',
    cost: '$25,000 UPS electrical installation',
    compliance: 'NEC 645 IT equipment'
  },
  {
    title: 'Welding Shop Distribution',
    scenario: 'Multiple 3-phase welders, 480V supply',
    specs: '10 welding stations, 100A each, 60% duty cycle',
    calculation: 'Welding Shop Load Analysis:\nConnected Load: 10 × 100A = 1,000A\nDemand Factor: 100% first welder + 85% remainder\nDemand Calculation: 100A + (900A × 0.85) = 865A\nDuty Cycle Factor: 865A × √0.6 = 670A\nService Required: 800A main service\nFeeder per station: 4 AWG per phase\nMain Feeder: (2) 500 kcmil parallel\nGrounding: Enhanced for welding loads',
    result: '800A service, parallel feeders',
    starting: 'Arc starting consideration',
    cost: '$35,000 welding shop electrical',
    compliance: 'NEC 630 welding equipment'
  },
  {
    title: 'Water Treatment Plant',
    scenario: 'Municipal water treatment, multiple pumps',
    specs: 'Primary: 100 HP, Secondary: 3 × 25 HP, Controls',
    calculation: 'Water Treatment Electrical:\nPrimary Pump: 100 HP = 74.6 kW\nSecondary Pumps: 3 × 25 HP = 55.9 kW\nControls & Instrumentation: 10 kW\nTotal Load: 140.5 kW\nPrimary Current: 112A @ 460V\nSecondary Current: 3 × 28A = 84A\nDiversity: Not all pumps run simultaneously\nService: 600A main service\nVFDs: Variable frequency drives for all pumps',
    result: '600A service with VFDs',
    starting: 'VFD controlled starting',
    cost: '$45,000 treatment plant electrical',
    compliance: 'NEC 430 + local codes'
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

const MOTOR_SIZING_GUIDE = [
  {
    horsepower: '5 HP',
    kw: '3.7 kW',
    amps460v: '4.8A',
    amps208v: '16.7A',
    wireSize: '12 AWG',
    breaker: '15A',
    starter: 'Size 0'
  },
  {
    horsepower: '10 HP',
    kw: '7.5 kW',
    amps460v: '9.6A',
    amps208v: '33.4A',
    wireSize: '12 AWG',
    breaker: '25A',
    starter: 'Size 0'
  },
  {
    horsepower: '25 HP',
    kw: '18.7 kW',
    amps460v: '24.2A',
    amps208v: '83.6A',
    wireSize: '10 AWG',
    breaker: '50A',
    starter: 'Size 1'
  },
  {
    horsepower: '50 HP',
    kw: '37.3 kW',
    amps460v: '48.3A',
    amps208v: '167.2A',
    wireSize: '6 AWG',
    breaker: '100A',
    starter: 'Size 2'
  },
  {
    horsepower: '100 HP',
    kw: '74.6 kW',
    amps460v: '96.6A',
    amps208v: '334.4A',
    wireSize: '3 AWG',
    breaker: '175A',
    starter: 'Size 3'
  },
  {
    horsepower: '200 HP',
    kw: '149.1 kW',
    amps460v: '193.1A',
    amps208v: '668.8A',
    wireSize: '4/0 AWG',
    breaker: '350A',
    starter: 'Size 4'
  }
];

const TRANSFORMER_GUIDE = [
  {
    capacity: '15 kVA',
    primary: '480V',
    secondary: '208Y/120V',
    primaryAmps: '18.0A',
    secondaryAmps: '41.7A',
    application: 'Small commercial, lighting'
  },
  {
    capacity: '45 kVA',
    primary: '480V',
    secondary: '208Y/120V',
    primaryAmps: '54.1A',
    secondaryAmps: '125.0A',
    application: 'Medium commercial, mixed loads'
  },
  {
    capacity: '112.5 kVA',
    primary: '480V',
    secondary: '208Y/120V',
    primaryAmps: '135.2A',
    secondaryAmps: '312.5A',
    application: 'Large commercial buildings'
  },
  {
    capacity: '225 kVA',
    primary: '480V',
    secondary: '208Y/120V',
    primaryAmps: '270.3A',
    secondaryAmps: '625.0A',
    application: 'Industrial facilities'
  },
  {
    capacity: '500 kVA',
    primary: '4160V',
    secondary: '480Y/277V',
    primaryAmps: '69.4A',
    secondaryAmps: '601.0A',
    application: 'Large industrial, distribution'
  }
];

const POWER_FACTOR_CORRECTION = [
  {
    originalPF: '0.70',
    targetPF: '0.95',
    improvement: '35.7%',
    kvarRequired: '51.4 kVAR per 100kW',
    savings: 'Significant utility penalty reduction'
  },
  {
    originalPF: '0.80',
    targetPF: '0.95',
    improvement: '18.8%',
    kvarRequired: '32.9 kVAR per 100kW',
    savings: 'Moderate utility penalty reduction'
  },
  {
    originalPF: '0.85',
    targetPF: '0.95',
    improvement: '11.8%',
    kvarRequired: '22.3 kVAR per 100kW',
    savings: 'Good practice for efficiency'
  },
  {
    originalPF: '0.90',
    targetPF: '0.95',
    improvement: '5.6%',
    kvarRequired: '11.0 kVAR per 100kW',
    savings: 'Fine tuning for optimal PF'
  }
];

const INSTALLATION_COSTS = [
  {
    component: '50 HP Motor Circuit',
    range: '$1,800-$2,500',
    factors: 'Wire, conduit, disconnect, starter'
  },
  {
    component: '100A 3-Phase Panel',
    range: '$1,200-$2,000',
    factors: 'Panel, breakers, installation'
  },
  {
    component: '480V to 208V Transformer (45kVA)',
    range: '$2,500-$4,000',
    factors: 'Transformer, pad, connections'
  },
  {
    component: 'Power Factor Correction (100kVAR)',
    range: '$3,000-$5,000',
    factors: 'Capacitors, controls, installation'
  },
  {
    component: 'VFD Installation (50 HP)',
    range: '$4,500-$7,000',
    factors: 'VFD, bypass, programming'
  },
  {
    component: 'Industrial Service Upgrade (400A)',
    range: '$15,000-$25,000',
    factors: 'Service entrance, meter, main panel'
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
    answer: 'Power factor affects system efficiency and utility costs. Low power factor increases current draw for the same power, requiring larger wires and equipment. Many utilities charge penalties for power factor below 0.90-0.95. Power factor correction using capacitors can reduce these costs.'
  },
  {
    question: 'What causes voltage imbalance in 3-phase systems?',
    answer: 'Voltage imbalance can be caused by loose connections, unequal single-phase loads, transformer problems, or utility supply issues. Even small voltage imbalances (2-3%) can cause significant current imbalances and motor heating problems.'
  },
  {
    question: 'When should I use a Variable Frequency Drive (VFD)?',
    answer: 'VFDs are beneficial for applications requiring speed control, energy savings, or soft starting. They reduce starting current, provide precise speed control, and can significantly reduce energy consumption in variable load applications like pumps and fans.'
  },
  {
    question: 'How do I size a transformer for 3-phase loads?',
    answer: 'Calculate total kVA demand, apply appropriate demand factors, and add 25% safety margin minimum. Consider load growth, power factor, and harmonic content. For non-linear loads, use K-rated transformers and possibly oversizing by 50-100%.'
  }
];

export default function ThreePhaseCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['three-phase-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
                  <div className="text-sm text-red-100">Code Compliance</div>
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
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{example.title}</h3>
                      <p className="text-red-700 font-medium mb-2">{example.scenario}</p>
                      <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Specifications:</span> {example.specs}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-red-600 mb-1">{example.result}</div>
                      <div className="text-sm text-gray-500 mb-1">{example.starting}</div>
                      <div className="text-sm text-orange-600 mb-1">{example.cost}</div>
                      <div className="text-xs text-blue-600">{example.compliance}</div>
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

          {/* Motor Sizing Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Cog className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Motor Sizing Reference</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">HP Rating</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">kW</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">460V FLA</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">208V FLA</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Wire Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Breaker</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Starter</th>
                  </tr>
                </thead>
                <tbody>
                  {MOTOR_SIZING_GUIDE.map((motor, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-green-600">{motor.horsepower}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{motor.kw}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-blue-600">{motor.amps460v}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-purple-600">{motor.amps208v}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold">{motor.wireSize}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-red-600">{motor.breaker}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{motor.starter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transformer Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Factory className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Transformer Sizing Guide</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Capacity</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Primary</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Secondary</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Primary FLA</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Secondary FLA</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Application</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSFORMER_GUIDE.map((transformer, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-purple-600">{transformer.capacity}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{transformer.primary}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{transformer.secondary}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-blue-600">{transformer.primaryAmps}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-green-600">{transformer.secondaryAmps}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{transformer.application}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Power Factor Correction */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Power Factor Correction Guide</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-orange-50">
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Original PF</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Target PF</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Current Reduction</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">kVAR Required</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Economic Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {POWER_FACTOR_CORRECTION.map((pf, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-red-600">{pf.originalPF}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-green-600">{pf.targetPF}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-blue-600">{pf.improvement}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{pf.kvarRequired}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{pf.savings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Installation Costs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Industrial Installation Costs</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Industrial Calculators</h2>
              <p className="text-gray-600">Complete your industrial electrical design</p>
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
              
              <Link href="/calculators/welder-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Cog className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Welder Calculator</h3>
                <p className="text-xs text-gray-600">Industrial welding</p>
              </Link>
              
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service sizing</p>
              </Link>
              
              <Link href="/calculators/conduit-fill-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Conduit Fill</h3>
                <p className="text-xs text-gray-600">Raceway sizing</p>
              </Link>
              
              <Link href="/calculators/ampacity-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <TrendingUp className="w-8 h-8 text-indigo-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Ampacity</h3>
                <p className="text-xs text-gray-600">Wire capacity</p>
              </Link>
              
              <Link href="/calculators/garage-subpanel-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Factory className="w-8 h-8 text-emerald-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Subpanel</h3>
                <p className="text-xs text-gray-600">Industrial buildings</p>
              </Link>
              
              <Link href="/calculators/well-pump-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Settings className="w-8 h-8 text-cyan-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Well Pump</h3>
                <p className="text-xs text-gray-600">Water systems</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
