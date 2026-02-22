import { Metadata } from 'next';
import { AmpsToWattsCalculator } from '@/components/calculators';
import { Zap, Calculator, AlertTriangle, CheckCircle, Settings, Target, DollarSign, BookOpen, Users, Wrench, TrendingUp, Power } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Amps to Watts Calculator | Convert Amperage to Watts | Power Calculator',
  description: 'Free amps to watts calculator for single-phase and three-phase circuits. Convert electrical current (amperage) to power (watts) with voltage and power factor calculations.',
  keywords: 'amps to watts calculator, current to power converter, amperage to watts, electrical power calculator, single phase watts, three phase watts, power factor calculator',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Amps to Watts Converter",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Convert electrical current to power. Calculate watts from amps and voltage for any circuit.",
  "keywords": "amps to watts converter, current to power, electrical calculator",
  "url": `https://wiresizes.com/calculators/amps-to-watts-calculator`,
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

const AMPS_TO_WATTS_EXAMPLES = [
  {
    title: 'Residential Circuit Analysis',
    scenario: '15A circuit at 120V, PF=1.0 (resistive)',
    calculation: 'Single-Phase: P = V × I × PF\nPower = 120V × 15A × 1.0 = 1800W\nCapacity utilization: Safe to load to 80% = 1440W\nTypical loads: Lighting, general receptacles',
    result: '1800W maximum',
    usableCapacity: '1440W continuous',
    application: 'General lighting and receptacle circuits'
  },
  {
    title: 'Motor Load Calculation',
    scenario: '25A motor at 240V, PF=0.85',
    calculation: 'Motor Power: P = V × I × PF\nPower = 240V × 25A × 0.85 = 5100W = 5.1kW\nMotor HP equivalent: 5.1kW ÷ 746W/HP = 6.84HP\nNote: Motor nameplate should specify actual HP',
    result: '5100W (5.1kW)',
    usableCapacity: '~7HP equivalent',
    application: 'Industrial motors, compressors'
  },
  {
    title: 'Three-Phase Load',
    scenario: '50A at 480V 3-phase, PF=0.92',
    calculation: '3-Phase Power: P = √3 × V × I × PF\nPower = 1.732 × 480V × 50A × 0.92\nPower = 38,323W = 38.3kW\nEquivalent HP: 38.3kW ÷ 746W/HP = 51.3HP',
    result: '38.3kW',
    usableCapacity: '~51HP motor equivalent',
    application: 'Large industrial equipment, commercial HVAC'
  },
  {
    title: 'Electric Range Circuit',
    scenario: '40A at 240V, PF=1.0 (heating elements)',
    calculation: 'Resistive Load: P = V × I\nPower = 240V × 40A = 9600W = 9.6kW\nHeat output: ~32,760 BTU/hr\nTypical for large electric ranges',
    result: '9600W (9.6kW)',
    usableCapacity: '32,760 BTU/hr heating',
    application: 'Electric ranges, cooktops, ovens'
  },
  {
    title: 'EV Charger Load',
    scenario: '32A at 240V, PF=1.0 (continuous)',
    calculation: 'EVSE Power: P = V × I\nPower = 240V × 32A = 7680W = 7.68kW\nCharging rate: ~25-30 miles per hour\nCircuit must be sized for 40A (125% of load)',
    result: '7680W (7.68kW)',
    usableCapacity: '25-30 miles/hour charging',
    application: 'Level 2 EV charging stations'
  },
  {
    title: 'LED Lighting System',
    scenario: '8A at 120V, PF=0.95',
    calculation: 'LED Power: P = V × I × PF\nPower = 120V × 8A × 0.95 = 912W\nLight output: ~100-120 lumens per watt\nTotal output: ~91,200-109,440 lumens',
    result: '912W',
    usableCapacity: '~100,000 lumens',
    application: 'Commercial LED lighting systems'
  }
];

const POWER_CALCULATION_FORMULAS = [
  {
    system: 'Single-Phase AC',
    formula: 'P = V × I × PF',
    example: '120V × 10A × 1.0 = 1200W',
    when: 'Most residential circuits',
    notes: 'PF = 1.0 for resistive loads'
  },
  {
    system: 'Single-Phase DC',
    formula: 'P = V × I',
    example: '12V × 50A = 600W',
    when: 'Battery systems, automotive',
    notes: 'No power factor in DC systems'
  },
  {
    system: 'Three-Phase Balanced',
    formula: 'P = √3 × V × I × PF',
    example: '1.732 × 480V × 20A × 0.9 = 15,000W',
    when: 'Industrial/commercial loads',
    notes: 'V = line-to-line voltage'
  },
  {
    system: 'Apparent Power (VA)',
    formula: 'S = V × I',
    example: '240V × 15A = 3600VA',
    when: 'Transformer sizing',
    notes: 'Includes reactive power'
  }
];

const TYPICAL_POWER_FACTORS = [
  { loadType: 'Incandescent Lighting', pf: '1.00', characteristics: 'Purely resistive, in-phase current' },
  { loadType: 'Electric Heating', pf: '1.00', characteristics: 'Resistive elements, unity power factor' },
  { loadType: 'LED Lighting (quality)', pf: '0.90-0.98', characteristics: 'Electronic drivers with PFC' },
  { loadType: 'Fluorescent Lighting', pf: '0.85-0.95', characteristics: 'Depends on ballast type' },
  { loadType: 'Induction Motors (loaded)', pf: '0.80-0.90', characteristics: 'Good power factor when loaded' },
  { loadType: 'Induction Motors (unloaded)', pf: '0.15-0.30', characteristics: 'Poor PF at light loads' },
  { loadType: 'Welding Equipment', pf: '0.50-0.80', characteristics: 'Inductive, poor power factor' },
  { loadType: 'Computer Equipment', pf: '0.65-0.95', characteristics: 'Varies by power supply quality' }
];

const CIRCUIT_CAPACITY_GUIDE = [
  { circuitAmps: '15A', voltage: '120V', maxWatts: '1800W', continuousWatts: '1440W', typicalUse: 'General lighting, receptacles' },
  { circuitAmps: '20A', voltage: '120V', maxWatts: '2400W', continuousWatts: '1920W', typicalUse: 'Kitchen, bathroom, laundry' },
  { circuitAmps: '30A', voltage: '240V', maxWatts: '7200W', continuousWatts: '5760W', typicalUse: 'Clothes dryer, small AC' },
  { circuitAmps: '40A', voltage: '240V', maxWatts: '9600W', continuousWatts: '7680W', typicalUse: 'Electric range, large appliances' },
  { circuitAmps: '50A', voltage: '240V', maxWatts: '12000W', continuousWatts: '9600W', typicalUse: 'Electric range, large welders' },
  { circuitAmps: '60A', voltage: '240V', maxWatts: '14400W', continuousWatts: '11520W', typicalUse: 'Subpanels, large HVAC' }
];

const NEC_COMPLIANCE_INFO = [
  {
    code: 'NEC 210.19(A)(1)',
    requirement: 'Continuous Load Derating',
    description: 'Branch circuits must be sized at 125% of continuous loads (3+ hours operation)',
    application: 'Lighting, HVAC, commercial equipment',
    calculation: 'Circuit capacity = Load × 1.25 for continuous operation'
  },
  {
    code: 'NEC 220.82',
    requirement: 'Dwelling Load Calculation',
    description: 'Standard method for residential service sizing using demand factors',
    application: 'Whole house electrical service calculations',
    calculation: 'Applies demand factors to different load types'
  },
  {
    code: 'NEC 430.6(A)',
    requirement: 'Motor Full-Load Current',
    description: 'Use NEC tables for motor current, not nameplate values',
    application: 'Motor circuit sizing and protection',
    calculation: 'Reference Tables 430.247-430.250 for FLC values'
  },
  {
    code: 'NEC 625.41',
    requirement: 'EV Charging Load',
    description: 'Electric vehicle supply equipment load calculations',
    application: 'EV charger installations',
    calculation: 'Continuous load requiring 125% sizing'
  },
  {
    code: 'NEC 220.54',
    requirement: 'Cooking Equipment Demand',
    description: 'Demand factors for electric ranges and cooking units',
    application: 'Kitchen electrical load calculations',
    calculation: 'Column B demand factors for household cooking equipment'
  },
  {
    code: 'NEC 424.3(B)',
    requirement: 'Fixed Electric Space Heating',
    description: 'Sizing requirements for electric heating equipment',
    application: 'Electric baseboard, furnaces, heat pumps',
    calculation: 'No diversity factor - 100% demand for heating loads'
  }
];

const ENERGY_COST_ANALYSIS = [
  {
    scenario: 'Continuous Industrial Motor',
    power: '10kW (13.4 HP)',
    hours: '8760 hours/year (24/7)',
    calculation: '10kW × 8760 hours = 87,600 kWh/year\nAt $0.12/kWh: 87,600 × $0.12 = $10,512/year\nPower factor penalty (0.80): Additional ~15% = $1,577\nTotal annual cost: $12,089',
    costFactors: 'Power factor penalties, demand charges, time-of-use rates',
    savings: 'Power factor correction can save 10-20% on electricity costs'
  },
  {
    scenario: 'Commercial LED Lighting',
    power: '5kW lighting system',
    hours: '4380 hours/year (12 hours/day)',
    calculation: '5kW × 4380 hours = 21,900 kWh/year\nAt $0.15/kWh: 21,900 × $0.15 = $3,285/year\nvs Fluorescent (7kW): 7kW × 4380 × $0.15 = $4,599\nLED savings: $1,314/year',
    costFactors: 'Higher power factor, lower maintenance, longer life',
    savings: '30-50% energy reduction vs traditional lighting'
  },
  {
    scenario: 'Electric Water Heater',
    power: '4.5kW residential unit',
    hours: '2920 hours/year (8 hours/day)',
    calculation: '4.5kW × 2920 hours = 13,140 kWh/year\nAt $0.13/kWh: 13,140 × $0.13 = $1,708/year\nWith heat pump upgrade (1.5kW): $569/year\nSavings: $1,139/year',
    costFactors: 'Time-of-use rates, peak demand charges',
    savings: 'Heat pump water heaters use 60-70% less energy'
  }
];

const TROUBLESHOOTING_GUIDE = [
  {
    problem: 'Calculated power doesn\'t match actual consumption',
    causes: ['Incorrect power factor assumption', 'Variable loads', 'Motor efficiency variations', 'Voltage fluctuations'],
    solutions: [
      'Measure actual power with power meter',
      'Check motor nameplate for power factor',
      'Account for load variations throughout day',
      'Verify voltage at load terminals'
    ],
    prevention: 'Use measured values when possible, account for real-world conditions'
  },
  {
    problem: 'Circuit breaker trips despite correct calculations',
    causes: ['Starting currents not considered', '80% derating rule violated', 'Harmonic currents', 'Ambient temperature effects'],
    solutions: [
      'Size breaker for starting current (3-8x FLA for motors)',
      'Derate continuous loads to 80%',
      'Consider harmonic-rated breakers for non-linear loads',
      'Account for high ambient temperatures'
    ],
    prevention: 'Follow NEC sizing rules, consider all operating conditions'
  },
  {
    problem: 'High electricity bills despite efficient equipment',
    causes: ['Poor power factor', 'Peak demand charges', 'Time-of-use rate penalties', 'Inefficient system operation'],
    solutions: [
      'Install power factor correction capacitors',
      'Implement demand management controls',
      'Shift loads to off-peak hours when possible',
      'Regular maintenance and system optimization'
    ],
    prevention: 'Monitor power factor, demand patterns, and system efficiency'
  }
];

const ADVANCED_CALCULATIONS = [
  {
    title: 'Harmonic Distortion Effects on Power',
    description: 'Non-linear loads create harmonics that affect power calculations',
    formula: 'P_total = P_fundamental × √(1 + THD²)',
    example: 'Load with 20% THD: P_actual = 1000W × √(1 + 0.2²) = 1020W',
    applications: ['Variable frequency drives', 'Switch-mode power supplies', 'LED drivers', 'Computer equipment'],
    considerations: 'Harmonics increase heating, reduce power factor, affect neutral currents'
  },
  {
    title: 'Demand Factor Calculations',
    description: 'Not all connected loads operate simultaneously - apply demand factors',
    formula: 'Demand Load = Connected Load × Demand Factor',
    example: '10 apartments × 8kW each × 0.43 demand factor = 34.4kW demand',
    applications: ['Multi-unit residential', 'Commercial buildings', 'Industrial facilities'],
    considerations: 'NEC Article 220 provides standard demand factors for various load types'
  },
  {
    title: 'Power Factor Correction Sizing',
    description: 'Calculate capacitor size needed to improve power factor',
    formula: 'kVAR = kW × (tan θ₁ - tan θ₂)',
    example: 'Improve 100kW load from PF=0.8 to PF=0.95: kVAR = 100 × (0.75 - 0.33) = 42 kVAR',
    applications: ['Motor installations', 'Industrial facilities', 'Commercial buildings'],
    considerations: 'Over-correction can cause leading power factor issues'
  },
  {
    title: 'Load Growth Planning',
    description: 'Plan for future electrical load increases',
    formula: 'Future Load = Current Load × (1 + growth rate)^years',
    example: '200kW current, 3% annual growth, 10 years: 200kW × (1.03)^10 = 269kW',
    applications: ['Service upgrades', 'New construction', 'Industrial expansion'],
    considerations: 'Consider efficiency improvements, technology changes, business growth'
  }
];

const COMPREHENSIVE_FAQS = [
  {
    question: 'How do I convert 20 amps to watts?',
    answer: 'For single-phase: Watts = Voltage × Amps × Power Factor. At 120V: 20A × 120V × 1.0 = 2400W. At 240V: 20A × 240V × 1.0 = 4800W. For motors or reactive loads, include the appropriate power factor (typically 0.8-0.9 for motors).'
  },
  {
    question: 'What is the maximum watts on a 15 amp circuit?',
    answer: 'A 15A circuit at 120V can handle 1800W maximum (15A × 120V). However, NEC requires 80% derating for continuous loads, so practical limit is 1440W for loads operating 3+ hours continuously. This includes most appliances and lighting.'
  },
  {
    question: 'How many watts can a 30 amp breaker handle?',
    answer: 'At 240V: 30A × 240V = 7200W maximum. For continuous loads: 7200W × 0.8 = 5760W. At 120V: 30A × 120V = 3600W maximum, 2880W continuous. The voltage depends on whether it\'s a single or double-pole breaker.'
  },
  {
    question: 'Do I need to consider power factor?',
    answer: 'Yes, for inductive loads like motors, transformers, and some lighting. Resistive loads (heaters, incandescent bulbs) have power factor = 1.0. Motors typically have PF = 0.8-0.9. Poor power factor increases current draw and reduces circuit capacity.'
  },
  {
    question: 'What\'s the difference between watts and VA?',
    answer: 'Watts measure real power (actual work done). VA (Volt-Amperes) measure apparent power (total power including reactive component). For resistive loads, watts = VA. For reactive loads, watts = VA × power factor. Use VA for transformer and circuit sizing.'
  },
  {
    question: 'How do I calculate three-phase power?',
    answer: 'Three-phase power: P = √3 × V × I × PF. √3 = 1.732. Use line-to-line voltage. Example: 20A at 480V with 0.9 PF: P = 1.732 × 480 × 20 × 0.9 = 15,000W (15kW). This is total three-phase power.'
  },
  {
    question: 'Can I add watts from multiple circuits?',
    answer: 'Yes, but consider demand factors. Not all loads operate simultaneously. NEC provides demand factors for different load types. For accurate service sizing, use load calculation methods in NEC Article 220 rather than simple addition.'
  },
  {
    question: 'Why does my motor draw more amps than calculated?',
    answer: 'Starting current can be 3-8 times running current. Also, motor efficiency varies with load. A motor drawing rated current might be producing less than rated power due to low power factor or reduced efficiency at light loads.'
  },
  {
    question: 'How do harmonics affect power calculations?',
    answer: 'Harmonics from non-linear loads increase total power consumption. While fundamental power remains the same, harmonic distortion creates additional heating and losses. Total power = fundamental power × √(1 + THD²). This affects wire sizing and transformer capacity.'
  },
  {
    question: 'What causes power factor penalties on utility bills?',
    answer: 'Utilities charge penalties for power factors below 0.90-0.95 because reactive power requires additional generation and transmission capacity. Poor power factor increases current for the same real power, causing system losses and voltage regulation problems.'
  },
  {
    question: 'How do I size a generator for my calculated load?',
    answer: 'Size generator 25-30% larger than calculated running load to handle starting currents and future expansion. For motor loads, consider starting kVA = 6× running kW. Account for altitude derating (3% per 1000ft above sea level) and temperature derating.'
  },
  {
    question: 'Why is my UPS capacity different from my power calculation?',
    answer: 'UPS systems are rated in VA, not just watts. For IT equipment with power factor ~0.9, a 1000W load requires 1000W ÷ 0.9 = 1111VA capacity. Also consider battery runtime, efficiency losses, and startup surge currents.'
  }
];

export default function AmpsToWattsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['amps-to-watts-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Amps to Watts Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-green-50">
                Convert electrical current (amperage) to power (watts) for single-phase and three-phase systems. 
                Professional calculations with power factor correction for accurate power analysis.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">Power Analysis</div>
                  <div className="font-semibold">Real & Apparent Power</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">Circuit Capacity</div>
                  <div className="font-semibold">Load Assessment</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">Power Factor</div>
                  <div className="font-semibold">Reactive Load Correction</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">Energy Planning</div>
                  <div className="font-semibold">Cost Analysis Tools</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Information */}
          <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-teal-900 mb-2">Power Calculation Critical Factors</h2>
                <ul className="text-teal-800 space-y-1 text-sm">
                  <li>• Power factor significantly affects real power - motors and inductive loads require PF correction</li>
                  <li>• Circuit capacity limited to 80% for continuous loads (3+ hours operation)</li>
                  <li>• Starting current for motors can be 3-8x running current but doesn\'t affect power calculation</li>
                  <li>• Apparent power (VA) differs from real power (W) for reactive loads</li>
                  <li>• Three-phase power requires √3 multiplier and line-to-line voltage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <AmpsToWattsCalculator />

          {/* Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Real-World Power Calculations</h2>
            </div>
            
            <div className="grid gap-6">
              {AMPS_TO_WATTS_EXAMPLES.map((example, idx) => (
                <div key={idx} className="border-l-4 border-green-500 bg-green-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{example.title}</h3>
                      <p className="text-green-700 font-medium">{example.scenario}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{example.result}</div>
                      <div className="text-sm text-gray-500">{example.usableCapacity}</div>
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

          {/* Power Formulas */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Power Calculation Formulas</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {POWER_CALCULATION_FORMULAS.map((formula, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-blue-50">
                  <h3 className="font-semibold text-gray-900 mb-2">{formula.system}</h3>
                  <div className="font-mono text-lg text-blue-600 mb-2">{formula.formula}</div>
                  <div className="text-sm text-green-600 font-medium mb-2">Example: {formula.example}</div>
                  <div className="text-sm text-gray-600 mb-1">Use when: {formula.when}</div>
                  <div className="text-sm text-gray-500">{formula.notes}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Power Factors */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Power Factor Reference</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-red-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Load Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Power Factor</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Characteristics</th>
                  </tr>
                </thead>
                <tbody>
                  {TYPICAL_POWER_FACTORS.map((pf, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{pf.loadType}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-red-600">{pf.pf}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{pf.characteristics}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Circuit Capacity */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Circuit Capacity Reference</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-yellow-50">
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Circuit Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Voltage</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Max Watts</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Continuous Watts</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Typical Applications</th>
                  </tr>
                </thead>
                <tbody>
                  {CIRCUIT_CAPACITY_GUIDE.map((circuit, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold">{circuit.circuitAmps}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{circuit.voltage}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-orange-600">{circuit.maxWatts}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">{circuit.continuousWatts}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{circuit.typicalUse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* NEC Compliance */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">NEC Code Compliance for Power Calculations</h2>
            </div>
            
            <div className="grid gap-6">
              {NEC_COMPLIANCE_INFO.map((nec, idx) => (
                <div key={idx} className="border-l-4 border-indigo-500 bg-indigo-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{nec.code}</h3>
                      <p className="text-indigo-700 font-medium">{nec.requirement}</p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      NEC Code
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{nec.description}</p>
                  
                  <div className="bg-white rounded-lg p-4 mb-3">
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Application: </span>{nec.application}
                    </div>
                    <div className="text-sm text-gray-700 font-mono bg-gray-50 p-2 rounded">
                      {nec.calculation}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-indigo-100 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Key NEC Articles for Power Calculations</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-indigo-800">Residential Load Calculations</h4>
                  <ul className="text-gray-700 space-y-1 mt-1">
                    <li>• NEC 220.82 - Standard Method</li>
                    <li>• NEC 220.83 - Optional Method</li>
                    <li>• NEC 220.54 - Cooking Equipment</li>
                    <li>• NEC 220.60 - Non-linear Loads</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-indigo-800">Motor & Equipment Loads</h4>
                  <ul className="text-gray-700 space-y-1 mt-1">
                    <li>• NEC 430.6 - Motor Full-Load Current</li>
                    <li>• NEC 430.24 - Feeder Sizing</li>
                    <li>• NEC 625.41 - EV Charging Equipment</li>
                    <li>• NEC 424.3 - Fixed Electric Heating</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Energy Cost Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Energy Cost Analysis & Savings</h2>
            </div>
            
            <div className="grid gap-6">
              {ENERGY_COST_ANALYSIS.map((analysis, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-green-50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{analysis.scenario}</h3>
                      <p className="text-green-700 font-medium">{analysis.power} - {analysis.hours}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {analysis.calculation.match(/\$[\d,]+\/year/)?.[0] || 'Cost Analysis'}
                      </div>
                      <div className="text-sm text-gray-500">Annual Operating Cost</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-line font-mono">{analysis.calculation}</pre>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Cost Factors: </span>
                      <span className="text-gray-700">{analysis.costFactors}</span>
                    </div>
                    <div>
                      <span className="font-medium text-green-800">Energy Savings: </span>
                      <span className="text-green-700">{analysis.savings}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                Utility Rate Structures & Power Factor Impact
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-yellow-800 mb-2">Common Rate Structures</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• <strong>Time-of-Use (TOU):</strong> Higher rates during peak hours (2-8 PM)</li>
                    <li>• <strong>Demand Charges:</strong> Based on highest 15-minute kW usage</li>
                    <li>• <strong>Tiered Rates:</strong> Increasing cost per kWh with usage</li>
                    <li>• <strong>Seasonal Rates:</strong> Higher summer rates for cooling loads</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800 mb-2">Power Factor Penalties</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• <strong>Penalty Threshold:</strong> Typically PF &lt; 0.90-0.95</li>
                    <li>• <strong>Penalty Calculation:</strong> Additional 1-30% charge</li>
                    <li>• <strong>Correction Benefits:</strong> 5-20% bill reduction possible</li>
                    <li>• <strong>Payback Period:</strong> Capacitor banks: 1-3 years</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Calculations */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Advanced Power Calculations</h2>
            </div>
            
            <div className="grid gap-8">
              {ADVANCED_CALCULATIONS.map((calc, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 bg-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{calc.title}</h3>
                  <p className="text-purple-700 mb-4">{calc.description}</p>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="font-mono text-lg text-purple-600 mb-2">{calc.formula}</div>
                    <div className="text-sm text-green-600 font-medium bg-green-50 p-2 rounded">
                      Example: {calc.example}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Applications:</h4>
                      <ul className="text-gray-700">
                        {calc.applications.map((app, appIdx) => (
                          <li key={appIdx}>• {app}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Considerations:</h4>
                      <p className="text-gray-700">{calc.considerations}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-purple-100 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Professional Power Analysis Tools</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-purple-800 mb-2">Measurement Equipment</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• <strong>Power Quality Analyzer:</strong> Measures harmonics, power factor, demand</li>
                    <li>• <strong>Clamp-on Power Meter:</strong> Non-intrusive current and power measurement</li>
                    <li>• <strong>Data Logger:</strong> Long-term load monitoring and analysis</li>
                    <li>• <strong>Oscilloscope:</strong> Waveform analysis for harmonic distortion</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-purple-800 mb-2">Software Tools</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• <strong>Load Flow Analysis:</strong> Complex power system calculations</li>
                    <li>• <strong>Energy Management Systems:</strong> Real-time monitoring and optimization</li>
                    <li>• <strong>Power Factor Correction Software:</strong> Capacitor bank sizing</li>
                    <li>• <strong>Harmonic Analysis Tools:</strong> Filter design and THD calculations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Power Calculation Troubleshooting</h2>
            </div>
            
            <div className="grid gap-8">
              {TROUBLESHOOTING_GUIDE.map((guide, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-orange-50">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3 text-orange-800">
                    Problem: {guide.problem}
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Causes</span>
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {guide.causes.map((cause, causeIdx) => (
                          <li key={causeIdx}>• {cause}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Solutions</span>
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {guide.solutions.map((solution, solIdx) => (
                          <li key={solIdx}>• {solution}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Prevention</span>
                      </h4>
                      <p className="text-sm text-gray-700">{guide.prevention}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Safety Considerations for Power Measurements
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Electrical Safety</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Always use properly rated test equipment</li>
                    <li>• Verify equipment is in good working condition</li>
                    <li>• Use appropriate PPE (arc-rated clothing, safety glasses)</li>
                    <li>• Follow NFPA 70E electrical safety standards</li>
                    <li>• De-energize circuits when possible for connections</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Measurement Accuracy</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Account for measurement equipment accuracy (±0.5-2%)</li>
                    <li>• Consider temperature effects on measurements</li>
                    <li>• Ensure proper grounding of measurement equipment</li>
                    <li>• Allow equipment warm-up time for stable readings</li>
                    <li>• Document measurement conditions and methodology</li>
                  </ul>
                </div>
              </div>
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
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Power Calculators</h2>
              <p className="text-gray-600">Complete electrical power analysis with these tools</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/calculators/watts-to-amps-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Power className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Watts to Amps</h3>
                <p className="text-xs text-gray-600">Reverse calculation</p>
              </Link>
              
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service sizing</p>
              </Link>
              
              <Link href="/calculators/three-phase-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Settings className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">3-Phase Power</h3>
                <p className="text-xs text-gray-600">Industrial loads</p>
              </Link>
              
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Sizing</h3>
                <p className="text-xs text-gray-600">Calculate AWG size</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Check losses</p>
              </Link>
              
              <Link href="/calculators/ampacity-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Target className="w-8 h-8 text-orange-600 mb-2" />
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