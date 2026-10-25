import { Metadata } from 'next';
import { AmpacityCalculator } from '@/components/calculators/AmpacityCalculator';
import { AlertTriangle, Calculator, Thermometer, BookOpen, Info, CheckCircle, ArrowRight, Gauge, AlertCircle, Shield, Activity } from 'lucide-react';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { AMBIENT_ROWS, ambientLabel } from '@/lib/calculations/ampacity';

export const metadata: Metadata = {
  title: 'Ampacity Calculator — NEC Table 310.16',
  description: 'NEC 310.16 ampacity for any AWG with temperature correction (Table 310.15(B)(1)(1)) and conductor-bundling adjustment (Table 310.15(C)(1)). Copper and aluminum.',
  keywords: 'ampacity calculator, wire current capacity, NEC table 310.16, conductor ampacity, temperature derating, conduit fill derating, wire amp rating, electrical ampacity',
  alternates: { canonical: '/calculators/ampacity-calculator' },
};

// Web application data for schema
const webAppData = {
  name: "Wire Ampacity Calculator - Current Carrying Capacity",
  url: "https://wiresizes.com/calculators/ampacity-calculator",
  description: "Calculate wire ampacity with temperature and conduit fill derating factors. Free ampacity calculator for copper and aluminum conductors at different temperature ratings."
};

// Conduit fill adjustment factors
const CONDUIT_FILL_FACTORS = [
  { conductors: "3 or less", adjustment: "100%" },
  { conductors: "4-6", adjustment: "80%" },
  { conductors: "7-9", adjustment: "70%" },
  { conductors: "10-20", adjustment: "50%" },
  { conductors: "21-30", adjustment: "45%" },
  { conductors: "31-40", adjustment: "40%" },
  { conductors: "41+", adjustment: "35%" }
];

// Special ampacity conditions
const SPECIAL_CONDITIONS = [
  {
    condition: "Wet locations",
    description: "May require different insulation types",
    details: [
      "THWN/THWN-2 for wet locations",
      "No ampacity reduction for wet-rated",
      "Consider corrosion protection",
      "Verify termination compatibility"
    ]
  },
  {
    condition: "Harmonic currents",
    description: "Non-linear loads affect neutral sizing",
    details: [
      "Neutral carries harmonic currents",
      "Count neutral as current-carrying",
      "Common with LED and electronic loads"
    ]
  }
];

// Wire insulation types and ratings
const INSULATION_TYPES = [
  { type: "TW", dryRating: "60°C", wetRating: "60°C", application: "Residential wiring in dry locations" },
  { type: "THW", dryRating: "75°C", wetRating: "75°C", application: "General purpose, wet or dry" },
  { type: "THWN", dryRating: "75°C", wetRating: "75°C", application: "Conduit and raceway, wet/dry" },
  { type: "THHN", dryRating: "90°C", wetRating: "—", application: "Dry and damp locations only" },
  { type: "THWN-2", dryRating: "90°C", wetRating: "90°C", application: "All locations, high temp" },
  { type: "XHHW", dryRating: "90°C", wetRating: "75°C", application: "Industrial, wet/dry locations" },
  { type: "XHHW-2", dryRating: "90°C", wetRating: "90°C", application: "All locations, industrial" },
  { type: "USE-2", dryRating: "90°C", wetRating: "90°C", application: "Underground service entrance" }
];

// Common ampacity mistakes
const AMPACITY_MISTAKES = [
  {
    mistake: "Forgetting ambient temperature derating",
    consequence: "Wire insulation breakdown, fire hazard",
    solution: "Apply temperature correction for ambients above 86°F"
  },
  {
    mistake: "Ignoring conduit fill derating",
    consequence: "Excessive heat buildup in raceways",
    solution: "Apply Table 310.15(C)(1) for more than 3 conductors"
  },
];

const faqItems = [
  {
    question: "What is ampacity in electrical terms?",
    answer: "Ampacity is the maximum current in amperes that a conductor can carry continuously under specific conditions without exceeding its temperature rating. It depends on conductor material, insulation type, ambient temperature, and installation method."
  },
  {
    question: "How do I derate wire for temperature?",
    answer: "Multiply the table ampacity by the temperature correction factor. Always use the correction factor for your wire's temperature rating."
  },
  {
    question: "How many conductors before derating is required?",
    answer: "More than 3 current-carrying conductors in a raceway or cable require derating per NEC Table 310.15(C)(1). Equipment grounding conductors don't count. Neutrals may or may not count depending on the load type."
  },
  {
    question: "How do I calculate ampacity for parallel conductors?",
    answer: "Add the ampacities of individual conductors, then apply any derating factors. For example, two parallel 1/0 AWG copper (150A each at 75°C) = 300A total before derating. All parallel conductors must be identical."
  },
  {
    question: "Does wire ampacity change with voltage?",
    answer: "No, ampacity is independent of voltage. A 12 AWG wire has the same 25A ampacity (at 75°C) whether used for 120V or 480V. Voltage affects insulation requirements, not current capacity."
  },
  {
    question: "What's the ampacity of aluminum vs copper?",
    answer: "Aluminum has about 61% of copper's conductivity. For the same ampacity, aluminum wire must be 1-2 sizes larger. Example: 1 AWG aluminum (100A) equals 3 AWG copper (100A) at 75°C."
  },
  {
    question: "Do I derate for conductors in separate conduits?",
    answer: "No, derating only applies to conductors in the same raceway or cable. Conductors in separate conduits dissipate heat independently. However, bundled conduits may require special consideration."
  },
  {
    question: "How does wet location affect ampacity?",
    answer: "Wet location doesn't directly reduce ampacity if using wet-rated insulation (THWN, XHHW). However, the wet rating temperature may be lower (75°C vs 90°C for XHHW), affecting available ampacity."
  },
  {
    question: "What is ampacity correction vs adjustment?",
    answer: "Correction factors apply to ambient temperature (Table 310.15(B)(1)(1)). Adjustment factors apply to number of conductors (Table 310.15(C)(1)). Both multiply together with base ampacity for final value."
  }
];

export default function AmpacityCalculatorPage() {
  return (
    <>
      {/* Quick Answer Section */}
      <section className="bg-blue-50 border-b border-blue-200">
        <div className="container py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              Wire Ampacity Calculator - Current Carrying Capacity
            </h1>
            <p className="text-lg text-neutral-700 mb-6">
              Calculate the actual ampacity of any AWG or kcmil conductor
              after applying NEC Table 310.15(B)(1)(1) ambient-temperature correction
              and NEC Table 310.15(C)(1) bundling adjustment for &gt; 3 current-
              carrying conductors in a raceway. Returns the derated ampacity
              that determines the maximum load the conductor can carry —
              not the table value.
            </p>
            
            {/* Quick Answer Box */}
            <div className="bg-white rounded-lg p-6 border border-blue-300 shadow-sm">
              <div className="flex items-start gap-3">
                <Gauge className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="w-full">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Reference: Common Wire Ampacities at 75°C</h2>
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-2">Copper Wire:</h3>
                      <ul className="space-y-1 text-sm text-neutral-600">
                        <li className="flex justify-between">
                          <span><strong>14 AWG:</strong></span>
                          <span className="font-mono">20A*</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>12 AWG:</strong></span>
                          <span className="font-mono">25A*</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>10 AWG:</strong></span>
                          <span className="font-mono">35A*</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>8 AWG:</strong></span>
                          <span className="font-mono">50A</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>6 AWG:</strong></span>
                          <span className="font-mono">65A</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-2">Aluminum Wire:</h3>
                      <ul className="space-y-1 text-sm text-neutral-600">
                        <li className="flex justify-between">
                          <span><strong>12 AWG:</strong></span>
                          <span className="font-mono">20A*</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>10 AWG:</strong></span>
                          <span className="font-mono">30A*</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>8 AWG:</strong></span>
                          <span className="font-mono">40A</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>6 AWG:</strong></span>
                          <span className="font-mono">50A</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>4 AWG:</strong></span>
                          <span className="font-mono">65A</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-2">Key Derating:</h3>
                      <ul className="space-y-1 text-sm text-neutral-600">
                        <li className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-orange-500" />
                          <span>104°F: × 0.88</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-red-500" />
                          <span>122°F: × 0.75</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-500" />
                          <span>4-6 wires: × 0.80</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-purple-500" />
                          <span>7-9 wires: × 0.70</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span>*240.4(D) limits</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Important:</strong> *Small conductor rule (NEC 240.4(D)) limits: 14 AWG copper to 15A, 12 AWG copper to 20A, 10 AWG copper to 30A, 12 AWG aluminum to 15A, 10 AWG aluminum to 25A maximum overcurrent protection. 
                      Always apply derating factors for actual conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <AmpacityCalculator />
          </div>
        </div>
      </section>

      {/* Understanding Ampacity Section */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Complete Guide to Wire Ampacity
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Understanding Ampacity</h3>
                <p className="text-neutral-700 mb-4">
                  Ampacity is the maximum current a conductor can carry continuously without damaging its insulation. 
                  This value depends on the conductor material, insulation temperature rating, ambient temperature, 
                  and the number of conductors bundled together. The NEC provides detailed tables and adjustment 
                  factors to ensure safe installations.
                </p>
                
                <div className="bg-white p-6 rounded-lg border border-neutral-200 mb-6">
                  <h4 className="text-lg font-semibold mb-3">Ampacity Calculation Steps</h4>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600">1.</span>
                      <div>
                        <strong>Base Ampacity:</strong> Start with Table 310.16 for the conductor size and temperature rating.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600">2.</span>
                      <div>
                        <strong>Temperature Correction:</strong> Apply factors from Table 310.15(B)(1)(1).
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600">3.</span>
                      <div>
                        <strong>Conductor Adjustment:</strong> Apply Table 310.15(C)(1) for more than 3 conductors.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600">4.</span>
                      <div>
                        <strong>Final Ampacity:</strong> Base × Temperature × Fill = Derated Ampacity.
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Temperature Correction Table */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Thermometer className="w-6 h-6 text-orange-600" />
              Temperature Correction Factors (NEC Table 310.15(B)(1)(1))
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th rowSpan={2} className="px-4 py-3 text-left font-medium text-neutral-700">Ambient Temp</th>
                      <th colSpan={3} className="px-4 py-3 text-center font-medium text-neutral-700 border-l">Correction Factors for Conductor Temperature Rating</th>
                    </tr>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-3 py-2 text-center text-xs border-l">60°C</th>
                      <th className="px-3 py-2 text-center text-xs">75°C</th>
                      <th className="px-3 py-2 text-center text-xs">90°C</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {AMBIENT_ROWS.map((row) => (
                      <tr key={row.key} className="hover:bg-neutral-50">
                        <td className="px-4 py-2 font-medium">{ambientLabel(row)}</td>
                        <td className="px-3 py-2 text-center font-mono border-l">{row.f_60 === null ? '—' : row.f_60.toFixed(2)}</td>
                        <td className="px-3 py-2 text-center font-mono">{row.f_75 === null ? '—' : row.f_75.toFixed(2)}</td>
                        <td className="px-3 py-2 text-center font-mono">{row.f_90 === null ? '—' : row.f_90.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conduit Fill Adjustment */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Conduit Fill Adjustment Factors (NEC Table 310.15(C)(1))
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200">
                          <th className="px-4 py-3 text-left font-medium text-neutral-700">Number of Conductors</th>
                          <th className="px-4 py-3 text-left font-medium text-neutral-700">Adjustment Factor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {CONDUIT_FILL_FACTORS.map((factor, idx) => (
                          <tr key={idx} className="hover:bg-neutral-50">
                            <td className="px-4 py-3 font-medium">{factor.conductors}</td>
                            <td className="px-4 py-3 font-mono font-bold text-purple-600">{factor.adjustment}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Counting Current-Carrying Conductors</h3>
                <div className="space-y-3">
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <strong>Example:</strong> Six 20A circuits in one conduit = 12 current-carrying conductors 
                      (not counting grounds). Apply 50% derating factor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Conditions */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Special Ampacity Conditions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {SPECIAL_CONDITIONS.map((condition, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 mb-2">{condition.condition}</h3>
                  <p className="text-sm text-neutral-600 mb-3">{condition.description}</p>
                  <ul className="space-y-1">
                    {condition.details.map((detail, i) => (
                      <li key={i} className="text-sm text-neutral-700 flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wire Insulation Types */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Wire Insulation Types and Temperature Ratings
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Dry Rating</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Wet Rating</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Application</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {INSULATION_TYPES.map((type, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 font-mono font-bold">{type.type}</td>
                        <td className="px-4 py-3">{type.dryRating}</td>
                        <td className="px-4 py-3">{type.wetRating}</td>
                        <td className="px-4 py-3 text-sm">{type.application}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-8 bg-red-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Common Ampacity Mistakes to Avoid
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {AMPACITY_MISTAKES.map((mistake, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold text-sm">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 mb-1">{mistake.mistake}</h3>
                      <p className="text-sm text-neutral-700 mb-2">
                        <strong>Consequence:</strong> {mistake.consequence}
                      </p>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-700">
                          <strong>Solution:</strong> {mistake.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              Ampacity Frequently Asked Questions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 mb-2 flex items-start gap-2">
                    <span className="text-blue-600 flex-shrink-0">Q:</span>
                    {item.question}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed pl-6">
                    <span className="text-green-600 font-semibold">A: </span>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Calculators */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Related Electrical Calculators
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/calculators/wire-size-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Wire Size Calculator</h3>
                <p className="text-sm text-neutral-600">Calculate proper AWG size for your electrical load</p>
              </a>
              <a href="/calculators/voltage-drop-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Voltage Drop Calculator</h3>
                <p className="text-sm text-neutral-600">Calculate voltage loss over distance</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <CombinedSchema webApp={webAppData} />
    </>
  );
}