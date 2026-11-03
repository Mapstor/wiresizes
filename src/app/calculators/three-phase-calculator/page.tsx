import { Metadata } from 'next';
import { ThreePhaseCalculator } from '@/components/calculators/ThreePhaseCalculator';
import { Zap, Calculator, Settings, Target, Users, AlertTriangle, TrendingUp, MapPin } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { Byline } from '@/components/content/Byline';
import { Sources } from '@/components/content/Sources';
import { DOMAINS as POWER_DOMAINS } from '@/lib/calculations/power';

const SOURCE_DOMAINS = POWER_DOMAINS;

export const metadata: Metadata = {
  title: 'Three Phase Calculator — Δ / Y',
  description: 'Three-phase power and current for delta and wye systems. P = √3 × V × I × PF.',
  keywords: 'three phase calculator, 3-phase power calculator, industrial electrical calculator, three phase current, 3-phase voltage calculations',
  alternates: { canonical: '/calculators/three-phase-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "Three Phase Calculator",
  url: "https://wiresizes.com/calculators/three-phase-calculator",
  description: "Calculate three-phase electrical power and current for industrial and commercial applications."
};

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
    voltage: '208 V, 240 V, 480 V, 600 V common',
    frequency: '60 Hz',
    notes: 'State and local amendments vary'
  },
  {
    region: 'Canada',
    standard: 'CEC (Canadian Electrical Code)',
    voltage: '208 V, 240 V, 480 V, 600 V',
    frequency: '60 Hz',
    notes: 'Similar to NEC with provincial variations'
  },
  {
    region: 'Europe',
    standard: 'IEC Standards',
    voltage: '400 V (230 V phase-to-neutral)',
    frequency: '50 Hz',
    notes: 'Different voltage levels and practices'
  },
  {
    region: 'Industrial International',
    standard: 'IEC 60364, local codes',
    voltage: 'Various: 380 V, 400 V, 415 V',
    frequency: '50/60 Hz depending on region',
    notes: 'Harmonized standards but local adoption'
  }
];

const COMPREHENSIVE_FAQS = [
  {
    question: 'What is the difference between line and phase voltage in 3-phase systems?',
    answer: 'In a wye (Y) connected system, line voltage is √3 (1.732) times the phase voltage. For example, a 208Y/120 V system has 208 V line-to-line and 120 V line-to-neutral. In a delta system, line and phase voltages are equal, but line current is √3 times phase current.'
  },
  {
    question: 'Why is power factor important in 3-phase systems?',
    answer: 'Power factor affects system efficiency. Low power factor increases current draw for the same power, requiring larger wires and equipment.'
  },
  {
    question: 'What causes voltage imbalance in 3-phase systems?',
    answer: 'Voltage imbalance can be caused by loose connections, unequal single-phase loads, transformer problems, or utility supply issues.'
  },
  {
    question: 'When should I use a Variable Frequency Drive (VFD)?',
    answer: 'VFDs are beneficial for applications requiring speed control or soft starting. They reduce starting current and provide precise speed control.'
  },
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
                Calculate three-phase electrical power and current for industrial and commercial 
                applications.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-red-100">Voltage Systems</div>
                  <div className="font-semibold">208 V, 480 V, 600 V</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-red-100">Calculations</div>
                  <div className="font-semibold">Power, Current, PF</div>
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
                  <li>• Phase rotation affects motor direction - verify before energizing</li>
                  <li>• Voltage imbalance causes motor heating - maintain balanced loads</li>
                  <li>• Professional installation required for industrial systems</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <div>
            <ThreePhaseCalculator />
            <Byline route="/calculators/three-phase-calculator" sources className="mt-4 text-sm text-gray-600" />
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

          {/* Sources */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Sources
              domains={SOURCE_DOMAINS}
              headingClassName="text-2xl font-bold text-gray-900 mb-6"
              listClassName="space-y-2 text-sm text-gray-700"
              linkClassName="text-blue-600 hover:underline"
              noteClassName="mt-4 text-sm text-gray-600"
            />
          </div>

          {/* Related Tools */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Related calculators</h2>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-green-600 mb-2" />
                <h3 data-name="" className="font-semibold text-gray-900 text-sm">Wire Size Calculator</h3>
                <p className="text-xs text-gray-600">Calculate wire AWG</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Target className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 data-name="" className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Long run analysis</p>
              </Link>
              
              
              
              
              <Link href="/calculators/ampacity-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <TrendingUp className="w-8 h-8 text-indigo-600 mb-2" />
                <h3 data-name="" className="font-semibold text-gray-900 text-sm">Ampacity</h3>
                <p className="text-xs text-gray-600">Wire capacity</p>
              </Link>
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
