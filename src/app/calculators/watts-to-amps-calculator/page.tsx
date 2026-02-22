import { Metadata } from 'next';
import { WattsToAmpsCalculator } from '@/components/calculators';
import { Zap, Calculator, AlertTriangle, CheckCircle, Settings, Target, DollarSign, BookOpen, Users, Wrench, TrendingUp, Power } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Watts to Amps Calculator | Convert Watts to Amperage | Electrical Power',
  description: 'Free watts to amps calculator for single-phase and three-phase circuits. Convert electrical power (watts) to current (amperage) with voltage and power factor calculations.',
  keywords: 'watts to amps calculator, power to current converter, electrical power calculator, amperage from watts, single phase amps, three phase amps, power factor calculator, electrical load calculator',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Watts to Amps Converter",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Professional watts to amps conversion calculator for electrical installations and circuit design.",
  "keywords": "watts to amps converter, power to current, electrical conversion",
  "url": `https://wiresizes.com/calculators/watts-to-amps-calculator`,
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

const WATTS_TO_AMPS_EXAMPLES = [
  {
    title: 'Household Microwave Oven',
    scenario: '1200 watts, 120V single-phase, PF=1.0',
    calculation: 'Single-Phase Formula: I = P ÷ V\nCurrent = 1200W ÷ 120V = 10 Amps\nCircuit size: 10A × 1.25 = 12.5A minimum\nRecommended: 15A circuit with 14 AWG wire',
    result: '10 Amps',
    circuitSize: '15A circuit required',
    wireSize: '14 AWG minimum',
    application: 'Kitchen appliances, countertop equipment'
  },
  {
    title: 'Electric Water Heater',
    scenario: '4500 watts, 240V single-phase, PF=1.0',
    calculation: 'Single-Phase Formula: I = P ÷ V\nCurrent = 4500W ÷ 240V = 18.75 Amps\nContinuous load: 18.75A × 1.25 = 23.4A\nCircuit size: 25A or 30A circuit\nWire size: 12 AWG for 25A, 10 AWG for 30A',
    result: '18.75 Amps',
    circuitSize: '30A circuit (continuous)',
    wireSize: '10 AWG copper',
    application: 'Water heaters, baseboard heating'
  },
  {
    title: 'LED Light Array',
    scenario: '480 watts, 120V single-phase, PF=0.95',
    calculation: 'With Power Factor: I = P ÷ (V × PF)\nCurrent = 480W ÷ (120V × 0.95) = 4.21 Amps\nCircuit load: Well within 15A or 20A circuit\nWire size: 14 AWG adequate\nNote: LEDs typically have high power factor',
    result: '4.21 Amps',
    circuitSize: '15A circuit adequate',
    wireSize: '14 AWG copper',
    application: 'LED lighting systems, commercial lighting'
  },
  {
    title: 'Industrial Motor - 3-Phase',
    scenario: '10,000 watts, 480V three-phase, PF=0.85',
    calculation: '3-Phase Formula: I = P ÷ (√3 × V × PF)\nCurrent = 10000W ÷ (1.73 × 480V × 0.85)\nCurrent = 10000 ÷ 706.32 = 14.16 Amps\nMotor sizing: Use motor FLA tables for wire sizing\nCircuit protection: 175% for motor starting',
    result: '14.16 Amps',
    circuitSize: '20A motor circuit',
    wireSize: '12 AWG per phase',
    application: 'Industrial motors, HVAC equipment'
  },
  {
    title: 'Electric Vehicle Charger',
    scenario: '7200 watts, 240V single-phase, PF=1.0',
    calculation: 'Single-Phase: I = P ÷ V\nCurrent = 7200W ÷ 240V = 30 Amps\nContinuous load: 30A × 1.25 = 37.5A circuit\nCircuit size: 40A circuit minimum\nWire size: 8 AWG copper (50A capacity)',
    result: '30 Amps',
    circuitSize: '40A circuit (continuous)',
    wireSize: '8 AWG copper',
    application: 'EV charging, continuous duty loads'
  },
  {
    title: 'Air Conditioner Condenser',
    scenario: '3600 watts, 240V single-phase, PF=0.9',
    calculation: 'With Power Factor: I = P ÷ (V × PF)\nCurrent = 3600W ÷ (240V × 0.9) = 16.67 Amps\nMotor load: Size for nameplate FLA\nCircuit protection: Use manufacturer specs\nWire size: Typically 12 AWG for <20A',
    result: '16.67 Amps',
    circuitSize: '20A motor circuit',
    wireSize: '12 AWG copper',
    application: 'Air conditioners, heat pumps'
  },
  {
    title: 'Commercial Kitchen Equipment',
    scenario: '2400 watts, 208V three-phase, PF=0.95',
    calculation: '3-Phase: I = P ÷ (√3 × V × PF)\nCurrent = 2400W ÷ (1.73 × 208V × 0.95)\nCurrent = 2400 ÷ 342.17 = 7.01 Amps\nCircuit size: 15A three-phase adequate\nWire size: 14 AWG per phase',
    result: '7.01 Amps per phase',
    circuitSize: '15A 3-phase circuit',
    wireSize: '14 AWG × 3',
    application: 'Commercial cooking, food service'
  },
  {
    title: 'Welding Machine',
    scenario: '5000 watts, 240V single-phase, PF=0.7 (inductive)',
    calculation: 'Inductive Load: I = P ÷ (V × PF)\nCurrent = 5000W ÷ (240V × 0.7) = 29.76 Amps\nWelding duty cycle affects circuit sizing\nTypical: 30A circuit for light duty\nWire size: 10 AWG copper minimum',
    result: '29.76 Amps',
    circuitSize: '30A circuit',
    wireSize: '10 AWG copper',
    application: 'Welding equipment, inductive loads'
  }
];

const POWER_FORMULAS_TABLE = [
  { 
    systemType: 'Single-Phase AC', 
    formula: 'I = P ÷ (V × PF)', 
    example: '1200W ÷ (120V × 1.0) = 10A', 
    applications: 'Residential loads, small appliances',
    notes: 'Most common residential calculation'
  },
  { 
    systemType: 'Single-Phase DC', 
    formula: 'I = P ÷ V', 
    example: '1200W ÷ 12V = 100A', 
    applications: 'Battery systems, automotive, solar',
    notes: 'No power factor consideration'
  },
  { 
    systemType: 'Three-Phase Balanced', 
    formula: 'I = P ÷ (√3 × V × PF)', 
    example: '10kW ÷ (1.73 × 480V × 0.85) = 14.2A', 
    applications: 'Industrial motors, commercial loads',
    notes: 'V is line-to-line voltage'
  },
  { 
    systemType: 'Three-Phase Line Current', 
    formula: 'I_line = P ÷ (3 × V_phase × PF)', 
    example: '10kW ÷ (3 × 277V × 0.85) = 14.2A', 
    applications: 'Wye-connected loads',
    notes: 'V_phase = V_line ÷ √3'
  },
  { 
    systemType: 'Apparent Power (VA)', 
    formula: 'I = S ÷ V (single-phase)', 
    example: '1500VA ÷ 120V = 12.5A', 
    applications: 'Transformers, reactive loads',
    notes: 'Includes reactive power component'
  },
  { 
    systemType: 'Motor Full Load', 
    formula: 'Use NEC Table 430.248/250', 
    example: '5HP 480V 3Φ = 7.6A (table)', 
    applications: 'Motor circuit design',
    notes: 'Always use table values, not nameplate'
  }
];

const COMMON_APPLIANCE_WATTS = [
  { appliance: 'Microwave Oven', watts: '700-1200', voltage: '120V', amps: '5.8-10A', circuit: '15A', powerFactor: '1.0' },
  { appliance: 'Electric Range (large burner)', watts: '2500-3500', voltage: '240V', amps: '10.4-14.6A', circuit: '50A total', powerFactor: '1.0' },
  { appliance: 'Clothes Dryer', watts: '3000-5000', voltage: '240V', amps: '12.5-20.8A', circuit: '30A', powerFactor: '1.0' },
  { appliance: 'Water Heater', watts: '3500-4500', voltage: '240V', amps: '14.6-18.8A', circuit: '25-30A', powerFactor: '1.0' },
  { appliance: 'Central Air Conditioner', watts: '2000-5000', voltage: '240V', amps: '8.3-20.8A', circuit: '15-30A', powerFactor: '0.85-0.95' },
  { appliance: 'Heat Pump', watts: '3000-6000', voltage: '240V', amps: '12.5-25A', circuit: '30-40A', powerFactor: '0.85-0.95' },
  { appliance: 'Electric Oven', watts: '2000-5000', voltage: '240V', amps: '8.3-20.8A', circuit: '40-50A', powerFactor: '1.0' },
  { appliance: 'Window AC Unit', watts: '500-1500', voltage: '120V', amps: '4.2-12.5A', circuit: '15-20A', powerFactor: '0.85-0.90' },
  { appliance: 'Refrigerator', watts: '100-800', voltage: '120V', amps: '0.8-6.7A', circuit: '15A', powerFactor: '0.85-0.95' },
  { appliance: 'Dishwasher', watts: '1200-1800', voltage: '120V', amps: '10-15A', circuit: '20A', powerFactor: '0.95-1.0' },
  { appliance: 'Garbage Disposal', watts: '400-900', voltage: '120V', amps: '3.3-7.5A', circuit: '15A', powerFactor: '0.85-0.90' },
  { appliance: 'Pool Pump (1HP)', watts: '750-1000', voltage: '240V', amps: '3.1-4.2A', circuit: '20A', powerFactor: '0.85-0.90' },
  { appliance: 'Hot Tub Heater', watts: '3000-6000', voltage: '240V', amps: '12.5-25A', circuit: '30-50A', powerFactor: '1.0' },
  { appliance: 'EV Charger Level 2', watts: '3300-7200', voltage: '240V', amps: '13.8-30A', circuit: '20-50A', powerFactor: '1.0' }
];

const POWER_FACTOR_GUIDE = [
  { loadType: 'Resistive Loads', powerFactor: '1.00', examples: 'Heaters, incandescent lights, toasters', characteristics: 'Current in phase with voltage' },
  { loadType: 'LED Lighting', powerFactor: '0.90-0.98', examples: 'LED fixtures, drivers, controls', characteristics: 'High-quality LEDs have good PF' },
  { loadType: 'Fluorescent Lighting', powerFactor: '0.85-0.95', examples: 'T8/T5 fixtures with ballasts', characteristics: 'Electronic ballasts better than magnetic' },
  { loadType: 'Electric Motors', powerFactor: '0.75-0.90', examples: 'Pumps, fans, compressors', characteristics: 'Varies with load, lower when lightly loaded' },
  { loadType: 'Transformers (unloaded)', powerFactor: '0.10-0.30', examples: 'No-load transformers', characteristics: 'Very low PF when unloaded' },
  { loadType: 'Welding Equipment', powerFactor: '0.50-0.80', examples: 'Arc welders, induction heating', characteristics: 'Highly inductive, poor PF' },
  { loadType: 'Computer Equipment', powerFactor: '0.60-0.95', examples: 'Servers, UPS systems', characteristics: 'Switching power supplies' },
  { loadType: 'Variable Frequency Drives', powerFactor: '0.96-0.98', examples: 'VFDs, motor controls', characteristics: 'Active PF correction' }
];

const CIRCUIT_SIZING_GUIDELINES = [
  { loadType: 'General Lighting', sizingRule: '100%', continuousFactor: 'N/A', example: '10A load = 10A circuit', notes: 'Non-continuous loads' },
  { loadType: 'Continuous Loads (3+ hrs)', sizingRule: '125%', continuousFactor: '1.25', example: '10A load = 12.5A circuit min', notes: 'Most appliances' },
  { loadType: 'Motor Loads', sizingRule: '125% of FLA', continuousFactor: '1.25', example: '10A motor = 12.5A circuit', notes: 'Use NEC motor tables' },
  { loadType: 'Air Conditioning', sizingRule: '125% of FLA', continuousFactor: '1.25', example: '15A AC = 18.75A circuit', notes: 'Continuous motor load' },
  { loadType: 'Electric Heating', sizingRule: '125%', continuousFactor: '1.25', example: '20A heater = 25A circuit', notes: 'Continuous resistive load' },
  { loadType: 'Welding Receptacles', sizingRule: '100%', continuousFactor: 'N/A', example: '50A welder = 50A circuit', notes: 'Intermittent duty' },
  { loadType: 'EV Charging', sizingRule: '125%', continuousFactor: '1.25', example: '32A EVSE = 40A circuit', notes: 'Continuous duty per NEC 625' }
];

const VOLTAGE_LEVEL_COMPARISONS = [
  { voltage: '120V Single-Phase', applications: 'Lighting, small appliances, receptacles', advantages: 'Safe, standard residential', disadvantages: 'Limited power capacity', maxPracticalAmps: '20A' },
  { voltage: '240V Single-Phase', applications: 'Large appliances, HVAC, water heaters', advantages: 'Higher power, lower current', disadvantages: 'Higher voltage hazard', maxPracticalAmps: '60A' },
  { voltage: '208V Three-Phase', applications: 'Commercial lighting, small motors', advantages: 'Balanced loads, efficient', disadvantages: 'Lower voltage than 240V', maxPracticalAmps: '100A+' },
  { voltage: '240V Three-Phase', applications: 'Residential services, small commercial', advantages: 'Higher voltage, balanced', disadvantages: 'Less common than 208V', maxPracticalAmps: '200A+' },
  { voltage: '480V Three-Phase', applications: 'Industrial motors, large equipment', advantages: 'High power, low current', disadvantages: 'High voltage hazard', maxPracticalAmps: '800A+' },
  { voltage: '277V Single-Phase', applications: 'Commercial lighting (480V systems)', advantages: 'Good for lighting loads', disadvantages: 'Dangerous if miswired', maxPracticalAmps: '30A' }
];

const COMPREHENSIVE_FAQS = [
  {
    question: 'How do I convert 1500 watts to amps?',
    answer: 'For single-phase: Amps = Watts ÷ Voltage. At 120V: 1500W ÷ 120V = 12.5A. At 240V: 1500W ÷ 240V = 6.25A. For three-phase: Amps = Watts ÷ (√3 × Voltage × Power Factor). Always check if power factor applies to your load type.'
  },
  {
    question: 'What is power factor and when do I use it?',
    answer: 'Power factor (PF) is the ratio of real power to apparent power, ranging from 0 to 1. Use PF for inductive loads like motors (0.8-0.9), fluorescent lights (0.85-0.95), and transformers. Resistive loads like heaters have PF = 1.0. LED lights typically have PF 0.9-0.98.'
  },
  {
    question: 'Why do I get different amps at 120V vs 240V?',
    answer: 'Same power at higher voltage requires lower current. This is why large appliances use 240V - it reduces current by half, allowing smaller wire sizes and reducing voltage drop. Example: 2400W load draws 20A at 120V but only 10A at 240V.'
  },
  {
    question: 'How do I calculate three-phase current?',
    answer: 'Three-phase formula: I = P ÷ (√3 × V × PF). √3 = 1.732. Use line-to-line voltage (480V, 208V). Result is current per line. Example: 10kW at 480V with 0.85 PF: 10000 ÷ (1.732 × 480 × 0.85) = 14.1A per line.'
  },
  {
    question: 'Do I need to upsize the circuit for the calculated current?',
    answer: 'Yes, for continuous loads (operate 3+ hours), multiply by 1.25. Non-continuous loads use calculated current directly. Motors require 125% sizing. Example: 16A continuous load needs 20A circuit minimum (16 × 1.25 = 20A).'
  },
  {
    question: 'What if my appliance shows both watts and amps?',
    answer: 'Use the amp rating from the nameplate - it accounts for power factor and includes all electrical characteristics. Watts ÷ voltage might not match nameplate amps due to power factor, starting currents, or reactive components.'
  },
  {
    question: 'How do I handle variable loads like motors?',
    answer: 'For motors, use NEC Table 430.248 (single-phase) or 430.250 (three-phase) full load currents, not nameplate or calculated values. Size conductors at 125% of table FLA. Motor starting current is much higher but handled by protective devices.'
  },
  {
    question: 'Can I add up watts from multiple appliances?',
    answer: 'Yes, but apply demand factors per NEC Article 220. Not all loads operate simultaneously. Use diversity factors: kitchen appliances (less than 100%), general lighting (various factors), motors (largest + others at reduced factors).'
  },
  {
    question: 'What about inrush current vs running current?',
    answer: 'Calculated current is typically running current. Inrush (starting) current can be 3-8x higher for motors, transformers. Circuit protection handles inrush, but consider voltage drop during starting for long wire runs or weak supply systems.'
  },
  {
    question: 'How does efficiency affect current calculations?',
    answer: 'Input current is higher than calculated from output power due to losses. For motors, use efficiency ratings: Input Watts = Output Watts ÷ Efficiency. Example: 1HP motor (746W output) at 85% efficiency needs 746 ÷ 0.85 = 877W input.'
  }
];

export default function WattsToAmpsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['watts-to-amps-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Power className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Watts to Amps Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-purple-50">
                Convert electrical power (watts) to current (amperage) for single-phase and three-phase systems. 
                Professional calculations with power factor correction for accurate circuit design.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Power Systems</div>
                  <div className="font-semibold">1Φ & 3Φ Calculations</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Power Factor</div>
                  <div className="font-semibold">Reactive Load Correction</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Voltage Levels</div>
                  <div className="font-semibold">120V - 480V Systems</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Circuit Sizing</div>
                  <div className="font-semibold">NEC Compliant Design</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Information */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Important Power-to-Current Conversion Notes</h2>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Always use nameplate values when available - calculated values may not account for all factors</li>
                  <li>• Power factor significantly affects current - motors and fluorescent lights are not unity power factor</li>
                  <li>• Continuous loads (3+ hours operation) require 125% circuit sizing per NEC</li>
                  <li>• Motor starting current can be 3-8x running current - affects circuit protection and voltage drop</li>
                  <li>• Three-phase calculations use line-to-line voltage, result is current per conductor</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <WattsToAmpsCalculator />

          {/* Real-World Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Watts to Amps Calculation Examples</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Real-world examples showing how to convert watts to amps for common electrical loads and equipment.
            </p>
            
            <div className="grid gap-6">
              {WATTS_TO_AMPS_EXAMPLES.map((example, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 bg-purple-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{example.title}</h3>
                      <p className="text-purple-700 font-medium">{example.scenario}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{example.result}</div>
                      <div className="text-sm text-gray-500">{example.circuitSize}</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Calculation Steps:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-line font-mono">{example.calculation}</pre>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">Wire Size: </span>
                      <span className="text-sm font-medium text-green-700">{example.wireSize}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Application: </span>
                      <span className="text-sm font-medium">{example.application}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Power Formulas Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Electrical Power Formulas Reference</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Complete formula reference for converting watts to amps across different electrical systems.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">System Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Formula</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Example Calculation</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Common Applications</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Important Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {POWER_FORMULAS_TABLE.map((formula, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{formula.systemType}</td>
                      <td className="border border-gray-300 px-4 py-3 font-mono text-sm bg-gray-50">{formula.formula}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-green-600">{formula.example}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{formula.applications}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{formula.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Formula Key:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• I = Current in Amperes • P = Power in Watts • V = Voltage • PF = Power Factor</li>
                <li>• √3 = 1.732 (square root of 3 for three-phase calculations)</li>
                <li>• For three-phase, use line-to-line voltage (480V, 208V, etc.)</li>
                <li>• Power factor ranges from 0.1 to 1.0, with 1.0 being purely resistive loads</li>
              </ul>
            </div>
          </div>

          {/* Common Appliance Reference */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Common Appliance Power & Current Chart</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Typical power consumption and current draw for common household and commercial appliances.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Appliance</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Power (Watts)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Voltage</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Current (Amps)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Circuit Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Power Factor</th>
                  </tr>
                </thead>
                <tbody>
                  {COMMON_APPLIANCE_WATTS.map((appliance, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{appliance.appliance}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-orange-600">{appliance.watts}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{appliance.voltage}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-blue-600">{appliance.amps}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{appliance.circuit}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">{appliance.powerFactor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Appliance Notes:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Power ratings are typical - always check appliance nameplate for exact specifications</li>
                <li>• Motor-driven appliances may have lower power factors affecting current draw</li>
                <li>• Starting current for motors can be 3-8 times running current</li>
                <li>• Electric heating elements are purely resistive (power factor = 1.0)</li>
              </ul>
            </div>
          </div>

          {/* Power Factor Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Power Factor Reference Guide</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Power factor values for different types of electrical loads. Critical for accurate current calculations.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-red-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Load Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Typical Power Factor</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Common Examples</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Characteristics</th>
                  </tr>
                </thead>
                <tbody>
                  {POWER_FACTOR_GUIDE.map((load, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{load.loadType}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-red-600">{load.powerFactor}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{load.examples}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{load.characteristics}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 bg-red-50 rounded-lg p-4 border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Power Factor Impact:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Lower power factor increases current for same real power consumption</li>
                <li>• Poor power factor causes higher energy costs and reduces system capacity</li>
                <li>• Power factor correction capacitors can improve PF for inductive loads</li>
                <li>• Utilities may charge penalties for poor power factor in commercial installations</li>
              </ul>
            </div>
          </div>

          {/* Circuit Sizing Guidelines */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Circuit Sizing Guidelines</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              NEC requirements for sizing circuits based on calculated current draw from different load types.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Load Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Sizing Rule</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Factor</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Example</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">NEC Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {CIRCUIT_SIZING_GUIDELINES.map((guideline, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{guideline.loadType}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-purple-600">{guideline.sizingRule}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold">{guideline.continuousFactor}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-green-600">{guideline.example}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{guideline.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Circuit Sizing Rules:</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Continuous loads operate for 3 or more hours - most appliances qualify</li>
                <li>• Non-continuous loads: general lighting, most receptacles (except kitchen)</li>
                <li>• Motor loads always require 125% sizing regardless of duty cycle</li>
                <li>• Always use next standard circuit breaker size above calculated requirement</li>
              </ul>
            </div>
          </div>

          {/* Voltage Level Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Voltage Level Applications & Characteristics</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Common voltage levels used in electrical systems and their typical applications.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-yellow-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Voltage Level</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Typical Applications</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Advantages</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Disadvantages</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Max Practical Amps</th>
                  </tr>
                </thead>
                <tbody>
                  {VOLTAGE_LEVEL_COMPARISONS.map((voltage, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-yellow-700">{voltage.voltage}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{voltage.applications}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-green-600">{voltage.advantages}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-red-600">{voltage.disadvantages}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold">{voltage.maxPracticalAmps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Voltage Selection Considerations:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Higher voltage reduces current for same power, allowing smaller wire sizes</li>
                <li>• 240V single-phase common for residential large appliances</li>
                <li>• Three-phase provides more efficient power distribution for balanced loads</li>
                <li>• 480V three-phase standard for industrial and large commercial applications</li>
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
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Electrical Calculators</h2>
              <p className="text-gray-600">Complete your electrical calculations with these professional tools</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/calculators/amps-to-watts-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Power className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Amps to Watts</h3>
                <p className="text-xs text-gray-600">Reverse calculation</p>
              </Link>
              
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Sizing</h3>
                <p className="text-xs text-gray-600">Calculate AWG size</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <TrendingUp className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Check voltage loss</p>
              </Link>
              
              <Link href="/calculators/three-phase-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Settings className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">3-Phase Power</h3>
                <p className="text-xs text-gray-600">Industrial loads</p>
              </Link>
              
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service sizing</p>
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