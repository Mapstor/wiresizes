import { Metadata } from 'next';
import { WattsToAmpsCalculator } from '@/components/calculators';
import { Zap, Calculator, AlertTriangle, Settings, Target, BookOpen, Users, TrendingUp, Power } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';

export const metadata: Metadata = {
  title: 'Watts to Amps Calculator — W → A',
  description: 'Convert watts to amps for AC single-phase and three-phase circuits. Includes power-factor adjustment for non-resistive loads.',
  keywords: 'watts to amps calculator, power to current converter, electrical power calculator, amperage from watts, single phase amps, three phase amps, power factor calculator',
  alternates: { canonical: '/calculators/watts-to-amps-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "Watts to Amps Calculator",
  url: "https://wiresizes.com/calculators/watts-to-amps-calculator",
  description: "Free watts to amps calculator for single-phase and three-phase circuits. Convert electrical power (watts) to current (amperage) with voltage and power factor calculations."
};

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
    notes: ''
  }
];

const COMPREHENSIVE_FAQS = [
  {
    question: 'How do I convert 1500 watts to amps?',
    answer: 'For single-phase: Amps = Watts ÷ Voltage. At 120V: 1500W ÷ 120V = 12.5A. At 240V: 1500W ÷ 240V = 6.25A. For three-phase: Amps = Watts ÷ (√3 × Voltage × Power Factor). Always check if power factor applies to your load type.'
  },
  {
    question: 'What is power factor and when do I use it?',
    answer: 'Power factor (PF) is the ratio of real power to apparent power, ranging from 0 to 1. Use PF for inductive loads like motors, fluorescent lights, and transformers. Resistive loads like heaters have PF = 1.0.'
  },
  {
    question: 'Why do I get different amps at 120V vs 240V?',
    answer: 'Same power at higher voltage requires lower current. This is why large appliances use 240V - it reduces current by half, allowing smaller wire sizes and reducing voltage drop. Example: 2400W load draws 20A at 120V but only 10A at 240V.'
  },
  {
    question: 'How do I calculate three-phase current?',
    answer: 'Three-phase formula: I = P ÷ (√3 × V × PF). √3 = 1.732. Use line-to-line voltage (480V, 208V). Result is current per line.'
  },
  {
    question: 'What if my appliance shows both watts and amps?',
    answer: 'Use the amp rating from the nameplate - it accounts for power factor and includes all electrical characteristics. Watts ÷ voltage might not match nameplate amps due to power factor, starting currents, or reactive components.'
  },
  {
    question: 'How does efficiency affect current calculations?',
    answer: 'Input current is higher than calculated from output power due to losses. For motors, use efficiency ratings: Input Watts = Output Watts ÷ Efficiency.'
  }
];

export default function WattsToAmpsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CombinedSchema webApp={webAppData} />
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
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Power Systems</div>
                  <div className="font-semibold">1Φ & 3Φ Calculations</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Voltage Levels</div>
                  <div className="font-semibold">120V - 480V Systems</div>
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
                  <li>• Three-phase calculations use line-to-line voltage, result is current per conductor</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <WattsToAmpsCalculator />

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
              <h2 className="text-2xl font-bold text-gray-900">Related calculators</h2>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
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