import { Metadata } from 'next';
import { AmpsToWattsCalculator } from '@/components/calculators';
import { Zap, Calculator, AlertTriangle, Settings, Target, BookOpen, Users, Wrench, TrendingUp, Power } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';

export const metadata: Metadata = {
  title: 'Amps to Watts Calculator — A → W',
  description: 'Convert amps to watts for AC and DC circuits. Single-phase, three-phase, and DC formulas with optional power-factor input for inductive loads.',
  keywords: 'amps to watts calculator, current to power converter, amperage to watts, electrical power calculator, single phase watts, three phase watts, power factor calculator',
  alternates: { canonical: '/calculators/amps-to-watts-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "Amps to Watts Calculator",
  url: "https://wiresizes.com/calculators/amps-to-watts-calculator",
  description: "Free amps to watts calculator for single-phase and three-phase circuits. Convert electrical current (amperage) to power (watts) with voltage and power factor calculations."
};

const AMPS_TO_WATTS_EXAMPLES = [
  {
    title: 'Residential Circuit Analysis',
    scenario: '15A circuit at 120V, PF=1.0 (resistive)',
    calculation: 'Single-Phase: P = V × I × PF\nPower = 120V × 15A × 1.0 = 1800W\nTypical loads: Lighting, general receptacles',
    result: '1800W maximum',
    usableCapacity: '',
    application: 'General lighting and receptacle circuits'
  },
  {
    title: 'Electric Range Circuit',
    scenario: '40A at 240V, PF=1.0 (heating elements)',
    calculation: 'Resistive Load: P = V × I\nPower = 240V × 40A = 9600W = 9.6kW\nHeat output: ~32,760 BTU/hr',
    result: '9600W (9.6kW)',
    usableCapacity: '32,760 BTU/hr heating',
    application: 'Electric ranges, cooktops, ovens'
  },
  {
    title: 'EV Charger Load',
    scenario: '32A at 240V, PF=1.0 (continuous)',
    calculation: 'EVSE Power: P = V × I\nPower = 240V × 32A = 7680W = 7.68kW',
    result: '7680W (7.68kW)',
    usableCapacity: '',
    application: 'Level 2 EV charging stations'
  },
  {
    title: 'LED Lighting System',
    scenario: '8A at 120V, PF=0.95',
    calculation: 'LED Power: P = V × I × PF\nPower = 120V × 8A × 0.95 = 912W',
    result: '912W',
    usableCapacity: '',
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
    example: '',
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
];

const ADVANCED_CALCULATIONS = [
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
    answer: 'For single-phase: Watts = Voltage × Amps × Power Factor. At 120V: 20A × 120V × 1.0 = 2400W. At 240V: 20A × 240V × 1.0 = 4800W. For motors or reactive loads, include the appropriate power factor.'
  },
  {
    question: 'How many watts can a 30 amp breaker handle?',
    answer: 'At 240V: 30A × 240V = 7200W maximum. At 120V: 30A × 120V = 3600W maximum. The voltage depends on whether it\'s a single or double-pole breaker.'
  },
  {
    question: 'Do I need to consider power factor?',
    answer: 'Yes, for inductive loads like motors, transformers, and some lighting. Resistive loads (heaters, incandescent bulbs) have power factor = 1.0. Poor power factor increases current draw and reduces circuit capacity.'
  },
  {
    question: 'What\'s the difference between watts and VA?',
    answer: 'Watts measure real power (actual work done). VA (Volt-Amperes) measure apparent power (total power including reactive component). For resistive loads, watts = VA. For reactive loads, watts = VA × power factor. Use VA for transformer and circuit sizing.'
  },
  {
    question: 'How do I calculate three-phase power?',
    answer: 'Three-phase power: P = √3 × V × I × PF. √3 = 1.732. Use line-to-line voltage. This is total three-phase power.'
  },
  {
    question: 'Can I add watts from multiple circuits?',
    answer: 'Yes, but consider demand factors. Not all loads operate simultaneously. NEC provides demand factors for different load types. For accurate service sizing, use load calculation methods in NEC Article 220 rather than simple addition.'
  },
  {
    question: 'Why does my motor draw more amps than calculated?',
    answer: 'Motor efficiency varies with load. A motor drawing rated current might be producing less than rated power due to low power factor or reduced efficiency at light loads.'
  },
];

export default function AmpsToWattsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CombinedSchema 
        webApp={webAppData} 
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
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">Power Analysis</div>
                  <div className="font-semibold">Real & Apparent Power</div>
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
                  <li>• Power factor significantly affects real power</li>
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
                  {formula.example && (
                    <div className="text-sm text-green-600 font-medium mb-2">Example: {formula.example}</div>
                  )}
                  <div className="text-sm text-gray-600 mb-1">Use when: {formula.when}</div>
                  <div className="text-sm text-gray-500">{formula.notes}</div>
                </div>
              ))}
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
              <h2 className="text-2xl font-bold text-gray-900">Related calculators</h2>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Link href="/calculators/watts-to-amps-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Power className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Watts to Amps</h3>
                <p className="text-xs text-gray-600">Reverse calculation</p>
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