import Link from 'next/link';
import { Calculator, Zap, BarChart3, Target, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { getArticleDates } from '@/lib/article-dates';


export const metadata = {
  title: 'Electrical Power Calculations — W, A, V, PF',
  description: 'Watts, amps, volts, and power factor formulas. Single-phase, three-phase, DC; real, reactive, apparent power. Worked examples with NEC values.',
  keywords: 'electrical power calculations, watts amps volts, power factor, ohms law, electrical engineering',
  alternates: { canonical: '/guides/electrical-power-calculations' },
};

const POWER_TRIANGLE_DATA = [
  { angle: 0, realPower: 100, reactivePower: 0, apparentPower: 100, powerFactor: 1.0, description: 'Pure Resistive Load' },
  { angle: 30, realPower: 86.6, reactivePower: 50, apparentPower: 100, powerFactor: 0.866, description: 'Good Power Factor' },
  { angle: 45, realPower: 70.7, reactivePower: 70.7, apparentPower: 100, powerFactor: 0.707, description: 'Fair Power Factor' },
  { angle: 60, realPower: 50, reactivePower: 86.6, apparentPower: 100, powerFactor: 0.5, description: 'Poor Power Factor' },
];

const VOLTAGE_SYSTEMS = [
  { system: 'Single-Phase 120V', voltage: 120, phases: 1, applications: ['Residential outlets', 'Small appliances', 'Lighting'], maxPower: '1.8 kW' },
  { system: 'Single-Phase 240V', voltage: 240, phases: 1, applications: ['Water heaters', 'Dryers', 'AC units'], maxPower: '7.2 kW' },
  { system: 'Three-Phase 208V', voltage: 208, phases: 3, applications: ['Commercial lighting', 'Small motors', 'Office equipment'], maxPower: '12.5 kW' },
  { system: 'Three-Phase 480V', voltage: 480, phases: 3, applications: ['Industrial motors', 'Large HVAC', 'Manufacturing'], maxPower: '50+ kW' },
];

const CALCULATION_EXAMPLES = [
  {
    title: 'Residential Water Heater',
    scenario: 'A 4500W electric water heater on a 240V circuit',
    given: ['Power: 4500W', 'Voltage: 240V', 'Load Type: Resistive'],
    solution: 'I = P ÷ V = 4500W ÷ 240V = 18.75A',
    result: '18.75 Amps',
    powerFactor: 1.0,
    necCode: 'NEC 422.13',
    calculatorLink: '/calculators/watts-to-amps-calculator'
  },
  {
    title: 'Commercial LED Lighting',
    scenario: '50A LED lighting circuit at 277V with 0.95 power factor',
    given: ['Current: 50A', 'Voltage: 277V', 'Power Factor: 0.95'],
    solution: 'P = I × V × PF = 50A × 277V × 0.95 = 13,158W',
    result: '13.16 kW',
    powerFactor: 0.95,
    necCode: 'NEC 220.14',
    calculatorLink: '/calculators/amps-to-watts-calculator'
  },
  {
    title: 'Three-Phase Motor',
    scenario: '15HP motor at 480V, three-phase, 0.85 power factor',
    given: ['Power: 15HP (11.19kW)', 'Voltage: 480V', 'Power Factor: 0.85', 'Phases: 3'],
    solution: 'I = P ÷ (V × √3 × PF) = 11,190W ÷ (480V × 1.732 × 0.85) = 15.8A',
    result: '15.8 Amps',
    powerFactor: 0.85,
    necCode: 'NEC 430.250',
    calculatorLink: '/calculators/horsepower-to-amps-calculator'
  },
];

// Article data for schema
const articleData = {
  headline: "Electrical Power Calculations Guide",
  description: "Master electrical power calculations with this comprehensive guide covering watts, amps, volts, power factor, single-phase and three-phase systems with interactive examples.",
  url: "https://wiresizes.com/guides/electrical-power-calculations",
  ...getArticleDates('src/app/guides/electrical-power-calculations/page.tsx'),
};

export default function ElectricalPowerCalculationsGuide() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Electrical Power Calculations Guide
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Master the fundamental relationships between watts, amps, volts, and power factor. 
            Learn to perform accurate electrical calculations for any system or application.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/calculators/amps-to-watts-calculator"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Try Calculator
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4" />
              15 min read
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              Beginner to Intermediate
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference Table */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Reference: Electrical Formulas</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 bg-gray-50 font-semibold">To Find</th>
                <th className="text-left py-4 px-4 bg-gray-50 font-semibold">Single-Phase Formula</th>
                <th className="text-left py-4 px-4 bg-gray-50 font-semibold">Three-Phase Formula</th>
                <th className="text-left py-4 px-4 bg-gray-50 font-semibold">Calculator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4 font-medium">Watts (P)</td>
                <td className="py-4 px-4 font-mono text-sm">I × V × PF</td>
                <td className="py-4 px-4 font-mono text-sm">I × V × √3 × PF</td>
                <td className="py-4 px-4">
                  <Link href="/calculators/amps-to-watts-calculator" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                    Calculator <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4 font-medium">Amps (I)</td>
                <td className="py-4 px-4 font-mono text-sm">P ÷ (V × PF)</td>
                <td className="py-4 px-4 font-mono text-sm">P ÷ (V × √3 × PF)</td>
                <td className="py-4 px-4">
                  <Link href="/calculators/watts-to-amps-calculator" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                    Calculator <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4 font-medium">VA (Apparent)</td>
                <td className="py-4 px-4 font-mono text-sm">I × V</td>
                <td className="py-4 px-4 font-mono text-sm">I × V × √3</td>
                <td className="py-4 px-4">
                  <Link href="/calculators/kva-to-amps-calculator" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                    Calculator <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4 font-medium">VAR (Reactive)</td>
                <td className="py-4 px-4 font-mono text-sm">√(VA² - P²)</td>
                <td className="py-4 px-4 font-mono text-sm">√(VA² - P²)</td>
                <td className="py-4 px-4">
                  <span className="text-gray-500 text-sm">In main calculators</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Power Triangle Visualization */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding the Power Triangle</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Power Triangle</h3>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              {/* SVG Power Triangle */}
              <svg viewBox="0 0 400 300" className="w-full h-64">
                {/* Grid background */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="400" height="300" fill="url(#grid)" />
                
                {/* Power Triangle */}
                <path
                  d="M 50 250 L 350 250 L 350 100 Z"
                  fill="rgba(59, 130, 246, 0.1)"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="3"
                />
                
                {/* Labels */}
                <text x="200" y="275" textAnchor="middle" className="text-sm font-semibold fill-green-600">
                  Real Power (P) - Watts
                </text>
                <text x="375" y="175" textAnchor="middle" className="text-sm font-semibold fill-red-600" transform="rotate(90, 375, 175)">
                  Reactive Power (Q) - VAR
                </text>
                <text x="200" y="170" textAnchor="middle" className="text-sm font-semibold fill-blue-600" transform="rotate(-26, 200, 170)">
                  Apparent Power (S) - VA
                </text>
                
                {/* Power Factor Angle */}
                <path
                  d="M 50 250 A 40 40 0 0 0 90 230"
                  fill="none"
                  stroke="orange"
                  strokeWidth="2"
                />
                <text x="80" y="245" className="text-xs fill-orange-600">φ</text>
                <text x="20" y="265" className="text-xs fill-orange-600">cos φ = PF</text>
              </svg>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm"><strong>Real Power (P)</strong> - Actual work performed (Watts)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm"><strong>Reactive Power (Q)</strong> - Magnetic field energy (VAR)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm"><strong>Apparent Power (S)</strong> - Total power drawn (VA)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Power Factor Impact</h3>
            <div className="space-y-4">
              {POWER_TRIANGLE_DATA.map((data, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{data.description}</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      PF = {data.powerFactor}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                    <div>Real: {data.realPower}W</div>
                    <div>Reactive: {data.reactivePower}VAR</div>
                    <div>Apparent: {data.apparentPower}VA</div>
                  </div>
                  
                  {/* Mini progress bar for efficiency */}
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span>Efficiency:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            data.powerFactor >= 0.9 ? 'bg-green-500' :
                            data.powerFactor >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${data.powerFactor * 100}%` }}
                        />
                      </div>
                      <span>{(data.powerFactor * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Voltage Systems Comparison */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Voltage Systems</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VOLTAGE_SYSTEMS.map((system, index) => (
            <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-primary-600">{system.voltage}V</div>
                <div className="text-sm text-gray-600">{system.phases === 1 ? 'Single' : 'Three'} Phase</div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-3">{system.system}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="text-gray-600">Max Power:</span>
                  <span className="font-mono ml-2 text-green-600">{system.maxPower}</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Applications:</div>
                <ul className="space-y-1">
                  {system.applications.map((app, appIndex) => (
                    <li key={appIndex} className="text-xs text-gray-600 flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                      {app}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-World Calculation Examples */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Real-World Calculation Examples</h2>
        <div className="space-y-8">
          {CALCULATION_EXAMPLES.map((example, index) => (
            <div key={index} className="border-l-4 border-primary-500 bg-primary-50 rounded-r-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-primary-900">{example.title}</h3>
                <Link 
                  href={example.calculatorLink}
                  className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors flex items-center gap-1"
                >
                  <Calculator className="w-4 h-4" />
                  Try Calculator
                </Link>
              </div>
              
              <p className="text-primary-800 mb-4">{example.scenario}</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-primary-800 mb-2">Given:</h4>
                  <ul className="space-y-1">
                    {example.given.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-primary-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary-800 mb-2">Solution:</h4>
                  <div className="bg-white rounded-lg p-3 border">
                    <code className="text-sm text-gray-800">{example.solution}</code>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary-800 mb-2">Result:</h4>
                  <div className="text-2xl font-bold text-primary-600 mb-2">{example.result}</div>
                  <div className="text-xs text-primary-700">
                    <div>PF: {example.powerFactor}</div>
                    <div>{example.necCode}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Concepts Summary */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Concepts to Remember</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-4">Power Factor Impact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium">PF = 1.0 (Unity)</div>
                  <div className="text-sm text-gray-600">Most efficient - all power does useful work</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium">PF = 0.85-0.95</div>
                  <div className="text-sm text-gray-600">Good efficiency - typical for quality equipment</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <div className="font-medium">PF &lt; 0.85</div>
                  <div className="text-sm text-gray-600">Poor efficiency - consider power factor correction</div>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-4">Three-Phase Benefits</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium">73% More Power</div>
                  <div className="text-sm text-gray-600">Same conductor size carries more power</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <div className="font-medium">Balanced Loading</div>
                  <div className="text-sm text-gray-600">Even distribution reduces neutral current</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium">Motor Efficiency</div>
                  <div className="text-sm text-gray-600">Better starting torque and efficiency</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice with Our Calculators</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Amps to Watts', slug: 'amps-to-watts-calculator', icon: Calculator, color: 'blue' },
            { name: 'Watts to Amps', slug: 'watts-to-amps-calculator', icon: Zap, color: 'green' },
            { name: 'Ohms Law', slug: 'ohms-law-calculator', icon: BarChart3, color: 'purple' },
            { name: 'Three Phase', slug: 'three-phase-calculator', icon: Target, color: 'amber' },
            { name: 'kVA to Amps', slug: 'kva-to-amps-calculator', icon: TrendingUp, color: 'red' },
            { name: 'Horsepower to Amps', slug: 'horsepower-to-amps-calculator', icon: AlertTriangle, color: 'gray' },
          ].map((calc, index) => {
            const IconComponent = calc.icon;
            return (
              <Link 
                key={index} 
                href={`/calculators/${calc.slug}`}
                className={`block p-6 rounded-lg border hover:shadow-lg transition-all hover:border-${calc.color}-300`}
              >
                <div className={`w-12 h-12 bg-${calc.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-6 h-6 text-${calc.color}-600`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{calc.name}</h3>
                <div className={`text-${calc.color}-600 text-sm flex items-center gap-1`}>
                  Try Calculator <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Continue Your Learning Journey</h2>
        <p className="text-gray-600 mb-6">
          Now that you understand power calculations, explore these related topics to build your electrical engineering expertise.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/guides/single-vs-three-phase"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            Single vs Three Phase Systems
          </Link>
          <Link 
            href="/guides/power-factor-explained"
            className="border border-green-600 text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
          >
            Power Factor Deep Dive
          </Link>
          <Link 
            href="/guides/wire-sizing-guide"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Wire Sizing Guide
          </Link>
        </div>
      </div>

      {/* Worked Examples — full numerical walkthroughs */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-slate-200 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Worked Examples — Power Calculations With Real Numbers</h2>
        <p className="text-gray-600 mb-8">
          Every formula below is applied to a concrete circuit. All values are
          NEC-accurate at standard reference conditions (75&deg;C terminations,
          30&deg;C ambient, NEC 2023). Memorize the pattern, plug in your
          numbers.
        </p>

        <div className="space-y-8">
          {/* Example 1: Single-phase resistive load */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Example 1 — Resistive load on 120 V single-phase</h3>
            <p className="text-sm text-slate-600 mb-3"><strong>Scenario:</strong> A 1,500 W bathroom space heater on a 120 V branch circuit.</p>
            <div className="bg-blue-50 rounded p-4 font-mono text-sm space-y-1">
              <div>P = V &times; I        →   I = P / V</div>
              <div>I = 1500 W / 120 V = 12.5 A</div>
              <div>Continuous load? Yes (heaters run 3+ hr) → 1.25 &times; 12.5 = 15.6 A circuit minimum</div>
              <div>NEC 240.6 next standard breaker: 20 A</div>
              <div>NEC 310.16 conductor for 20 A @ 75&deg;C Cu = 12 AWG (capped at 20 A by NEC 240.4(D))</div>
            </div>
            <p className="text-sm text-slate-600 mt-3">
              <strong>Why it matters:</strong> A 15 A breaker would trip during
              normal operation because 12.5 A is 83 % of 15 A and the heater
              runs continuously. Sizing to 125 % of the load (NEC 210.19(A))
              prevents nuisance trips and overheats the conductor by no more
              than the insulation rating allows.
            </p>
          </div>

          {/* Example 2: Single-phase inductive load with PF */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Example 2 — Inductive load with power factor (240 V single-phase)</h3>
            <p className="text-sm text-slate-600 mb-3">
              <strong>Scenario:</strong> A 5-ton residential central A/C
              compressor: nameplate 7.2 kW (real power), power factor 0.85
              (typical for an unloaded scroll compressor). 240 V single-phase.
            </p>
            <div className="bg-blue-50 rounded p-4 font-mono text-sm space-y-1">
              <div>P (real) = V &times; I &times; PF       →   I = P / (V &times; PF)</div>
              <div>I = 7200 W / (240 V &times; 0.85) = 35.3 A</div>
              <div>Apparent power: S = V &times; I = 240 &times; 35.3 = 8,470 VA = 8.47 kVA</div>
              <div>Reactive power: Q = &radic;(S&sup2; &minus; P&sup2;) = &radic;(8.47&sup2; &minus; 7.2&sup2;) = 4.46 kVAR</div>
              <div>NEC 440.32: branch-circuit conductors at 125 % of compressor FLA = 1.25 &times; 35.3 = 44.1 A</div>
              <div>NEC 310.16 conductor: 8 AWG copper @ 75&deg;C (50 A ampacity) — meets 44.1 A required</div>
              <div>NEC 240.6 next standard breaker: 50 A</div>
            </div>
            <p className="text-sm text-slate-600 mt-3">
              <strong>Power-factor takeaway:</strong> the same compressor at
              PF 1.0 would draw only 30 A. The 0.85 PF forces 5.3 A of reactive
              current the conductor must carry but no real work is done — a
              full <strong>17 % current penalty</strong>. This is why utilities
              charge commercial customers a power-factor-correction fee when
              system PF drops below 0.95.
            </p>
          </div>

          {/* Example 3: Three-phase motor */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Example 3 — Three-phase motor (480 V industrial)</h3>
            <p className="text-sm text-slate-600 mb-3">
              <strong>Scenario:</strong> A 25 HP three-phase induction motor
              on a 480 V, 3&phi; system. Service-factor 1.15, efficiency 92 %,
              power factor 0.88 at full load.
            </p>
            <div className="bg-blue-50 rounded p-4 font-mono text-sm space-y-1">
              <div>NEC Table 430.250 FLC for 25 HP at 460 V = 34 A (use this, not nameplate, per NEC 430.6(A))</div>
              <div>P (output) = 25 HP &times; 746 W/HP = 18,650 W mechanical</div>
              <div>P (input) = 18,650 / 0.92 = 20,272 W electrical real power</div>
              <div>I (theory) = P / (&radic;3 &times; V &times; PF) = 20,272 / (1.732 &times; 480 &times; 0.88) = 27.7 A</div>
              <div>NEC FLC value (34 A) is conservative vs theoretical 27.7 A; <strong>always use NEC table</strong></div>
              <div>NEC 430.22 conductor: 1.25 &times; 34 = 42.5 A → 8 AWG Cu @ 75&deg;C (50 A) ✓</div>
              <div>NEC 430.52 short-circuit (inverse-time CB): 250 % &times; 34 = 85 A → 90 A breaker</div>
              <div>NEC 430.32 overload: 1.15 &times; 34 = 39 A overload heater</div>
            </div>
            <p className="text-sm text-slate-600 mt-3">
              <strong>Why three protection elements:</strong> overload (motor
              thermal protection at ~115 % of FLC) is separate from short-
              circuit/ground-fault (the breaker, sized large enough to ride
              through the 5-7&times; inrush current at start). NEC 430 is the
              one place in the Code where the overcurrent device is allowed
              to be larger than the conductor ampacity — because the overload
              relay is the conductor&rsquo;s real protection.
            </p>
          </div>

          {/* Example 4: Power factor correction */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Example 4 — Capacitor bank for PF correction</h3>
            <p className="text-sm text-slate-600 mb-3">
              <strong>Scenario:</strong> A small machine shop draws 80 kW at
              PF 0.78 lagging on 480 V three-phase. The utility imposes a
              0.95 PF threshold or charges a $0.85/kVAR-month penalty.
              Compute the kVAR of capacitors needed to correct PF to 0.95
              and the resulting current reduction.
            </p>
            <div className="bg-blue-50 rounded p-4 font-mono text-sm space-y-1">
              <div>Existing reactive power: Q1 = P &times; tan(arccos 0.78) = 80 &times; 0.802 = 64.2 kVAR</div>
              <div>Target reactive power: Q2 = P &times; tan(arccos 0.95) = 80 &times; 0.329 = 26.3 kVAR</div>
              <div>Capacitor bank size: Q1 &minus; Q2 = 64.2 &minus; 26.3 = <strong>37.9 kVAR</strong> (round up to 40 kVAR std)</div>
              <div>Pre-correction current: I = 80,000 / (1.732 &times; 480 &times; 0.78) = 123.4 A</div>
              <div>Post-correction current: I = 80,000 / (1.732 &times; 480 &times; 0.95) = 101.3 A</div>
              <div>Conductor relief: <strong>22.1 A reduction</strong> = 18 % less I&sup2;R loss in feeders</div>
              <div>Annual penalty saved: 38 kVAR &times; $0.85 &times; 12 = <strong>$387 / yr</strong></div>
              <div>40 kVAR capacitor bank cost: ~$2,500 → payback ~6.5 yr (utility penalty alone, before considering loss savings and conductor upgrade avoidance)</div>
            </div>
          </div>

          {/* Example 5: NEC 220.82 dwelling load calc */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Example 5 — NEC 220.82 dwelling-unit load calculation</h3>
            <p className="text-sm text-slate-600 mb-3">
              <strong>Scenario:</strong> 2,400 sq ft single-family home,
              electric range 12 kW, electric water heater 4.5 kW, electric
              dryer 5 kW, central A/C 5 ton (40 A @ 240 V), 50 A EV charger
              (continuous). Determine minimum service size per NEC 220.82
              Standard Method.
            </p>
            <div className="bg-blue-50 rounded p-4 font-mono text-sm space-y-1">
              <div>General lighting (NEC 220.12): 3 VA/sq ft &times; 2,400 = 7,200 VA</div>
              <div>Two small-appliance branches (220.52): 2 &times; 1,500 VA = 3,000 VA</div>
              <div>One laundry branch (220.52): 1,500 VA</div>
              <div>Subtotal: 7,200 + 3,000 + 1,500 = 11,700 VA</div>
              <div>Demand factor (220.82(B)(2)): first 10 kVA at 100 %, remainder at 35 %</div>
              <div>= 10,000 + (1,700 &times; 0.35) = 10,595 VA</div>
              <div>Fixed appliances (water heater 4,500 + dryer 5,000): 9,500 VA at 100 %</div>
              <div>Range (220.55, Col B for one range &le;12 kW): 8,000 VA at 100 %</div>
              <div>Largest of A/C vs heat (220.82(C)): A/C 40 A &times; 240 V &times; 1.0 = 9,600 VA</div>
              <div>EV charger (continuous, 220.82): 50 &times; 240 &times; 1.25 = 15,000 VA</div>
              <div className="font-bold pt-1 border-t border-blue-200">Total demand: 10,595 + 9,500 + 8,000 + 9,600 + 15,000 = 52,695 VA</div>
              <div className="font-bold">Minimum service amps: 52,695 / 240 = 219.6 A → <strong>200 A service is INSUFFICIENT</strong></div>
              <div className="font-bold">Required service: 225 A or 250 A panel</div>
            </div>
            <p className="text-sm text-slate-600 mt-3">
              <strong>Real implication:</strong> a typical 2,400 sq ft home
              with a 50 A EV charger plus electric range plus electric water
              heater plus central A/C exceeds 200 A standard service. This
              is why most NEC 2023-era dwellings adding EV charging need a
              service upgrade or load-management system (NEC 750.30, &ldquo;EVEMS&rdquo;).
            </p>
          </div>

          {/* Example 6: Energy cost */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Example 6 — Annual energy cost of a continuous load</h3>
            <p className="text-sm text-slate-600 mb-3">
              <strong>Scenario:</strong> 120 V, 1,200 W refrigerator runs at
              ~30 % duty cycle (about 7.2 hours equivalent full-load per day).
              Utility rate $0.16 /kWh. Annual energy cost?
            </p>
            <div className="bg-blue-50 rounded p-4 font-mono text-sm space-y-1">
              <div>Daily energy: 1.2 kW &times; 7.2 hr = 8.64 kWh/day</div>
              <div>Annual energy: 8.64 &times; 365 = 3,154 kWh/year</div>
              <div>Annual cost: 3,154 &times; $0.16 = <strong>$504.60 per year</strong></div>
              <div>If switched to a 600 W ENERGY STAR unit (50 % reduction): saves $252 / yr</div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900">
            <strong>Voltage drop reminder:</strong> All current values above
            assume the conductor is sized for ampacity only. For runs over
            ~50 ft on 120 V or ~100 ft on 240 V, also verify voltage drop is
            &le; 3 % per NEC informational note 210.19. Use the{' '}
            <Link href="/calculators/voltage-drop-calculator" className="text-blue-700 underline">
              Voltage Drop Calculator
            </Link>{' '}
            for any installation longer than these thresholds.
          </p>
        </div>
      </div>

      <ArticleSchema article={articleData} />
    </div>
  );
}