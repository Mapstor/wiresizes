import { Metadata } from 'next';
import { WireResistanceCalculator } from '@/components/calculators/WireResistanceCalculator';
import { Zap, Calculator, TrendingUp, AlertCircle, BookOpen, Settings } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { conductor, formatSize, TABLE_310_16_SIZES } from '@/lib/calculations/sizes';
import type { ConductorData } from '@/lib/calculations/sizes';
import { RESISTANCE_NOTES } from '@/lib/calculations/resistance';

export const metadata: Metadata = {
  title: 'Wire Resistance Calculator — Ω / 1000 ft',
  description: 'DC resistance of copper and aluminum conductors per AWG and length. For voltage-drop calculations.',
  keywords: 'wire resistance calculator, conductor resistance, ohms per foot, wire impedance, electrical resistance, copper wire resistance, aluminum wire resistance, voltage drop resistance',
  openGraph: {
    title: 'Wire Resistance Calculator - Conductor Resistance Tool',
    description: 'Calculate electrical resistance of wire conductors. Copper and aluminum wire resistance calculator.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/wire-resistance-calculator',
    images: ['/opengraph-image']
  },
  alternates: { canonical: '/calculators/wire-resistance-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "Wire Resistance Calculator",
  url: "https://wiresizes.com/calculators/wire-resistance-calculator",
  description: "Calculate wire resistance and power loss for copper and aluminum conductors."
};

// Ω per 1000 ft from data/verified/awg.json, 18 AWG to 500 kcmil
const RESISTANCE_ROWS: ConductorData[] = TABLE_310_16_SIZES.slice(0, TABLE_310_16_SIZES.indexOf('500') + 1)
  .map((key) => conductor(key))
  .filter((row): row is ConductorData => row !== null);

const wireResistanceFAQs = [
  {
    question: "How do I calculate the resistance of a wire?",
    answer: "Wire resistance is calculated using R = ρL/A, where R is resistance, ρ (rho) is resistivity, L is length, and A is cross-sectional area. For practical calculations, use: R = (Resistance per 1000 feet × Length in feet) ÷ 1000. For example, 12 AWG copper has 1.93 ohms per 1000 feet at 75°C, so 100 feet = 0.193 ohms."
  },
  {
    question: "What's the difference between resistance and impedance?",
    answer: "Resistance is the opposition to DC current flow, measured in ohms. Impedance is the total opposition to AC current flow, including both resistance and reactance (inductive and capacitive)."
  },
  {
    question: "How does temperature affect wire resistance?",
    answer: "Wire resistance increases with temperature for copper and aluminum. The formula is: R₂ = R₁[1 + α(T₂ - T₁)], where α is the temperature coefficient (0.00393/°C for copper, 0.00403/°C for aluminum). For every 1°C increase, copper resistance increases by about 0.39%. At 75°C vs 20°C, resistance increases by approximately 22%."
  },
  {
    question: "Why is copper wire resistance lower than aluminum?",
    answer: "Aluminum EC-H19 has about 64 % higher resistance than copper of the same size: 17.002 against 10.371 Ω·cmil/ft at 20 °C (NIST Handbooks 109 and 100)."
  },
  {
    question: "How do I calculate voltage drop from wire resistance?",
    answer: "Voltage drop equals current times resistance: VD = I × R. For single-phase: VD = I × R × 2 (accounting for both conductors). For three-phase: VD = I × R × 1.732."
  }
];

export default function WireResistanceCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CombinedSchema 
        webApp={webAppData} 
      />
      
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Wire Resistance Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Calculate electrical resistance of wire conductors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Zap className="h-12 w-12 text-purple-600 mb-4" />
              <p className="text-xl font-semibold mb-2">Precise Calculations</p>
              <p className="text-gray-600 dark:text-gray-400">
                Accurate resistance calculations for copper and aluminum conductors at various temperatures.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Calculator className="h-12 w-12 text-indigo-600 mb-4" />
              <p className="text-xl font-semibold mb-2">Multiple Parameters</p>
              <p className="text-gray-600 dark:text-gray-400">
                Calculate resistance and power loss for any conductor.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Settings className="h-12 w-12 text-blue-600 mb-4" />
              <p className="text-xl font-semibold mb-2">Engineering Data</p>
              <p className="text-gray-600 dark:text-gray-400">
                Access comprehensive resistance tables and technical specifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="mb-16">
        <WireResistanceCalculator />
      </section>

      {/* Understanding Wire Resistance */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Understanding Wire Resistance and Impedance
            </h2>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Wire resistance is the opposition to electrical current flow in conductors, causing voltage 
              drop and power loss. Understanding resistance characteristics is essential for proper circuit 
              design, voltage drop calculations, and ensuring efficient power transmission in electrical systems.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Fundamental Principles of Wire Resistance
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Wire resistance depends on four primary factors governed by the fundamental equation:
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
              <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">Resistance Formula</h4>
              <div className="text-center">
                <div className="text-2xl font-mono text-blue-800 dark:text-blue-300 mb-4">
                  R = ρL/A
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>R = Resistance (ohms)</div>
                  <div>ρ = Resistivity (ohm-meters)</div>
                  <div>L = Length (meters)</div>
                  <div>A = Cross-sectional area (square meters)</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-3">Material Properties</h4>
                <div className="space-y-3 text-green-700 dark:text-green-300">
                  <div>
                    <span className="font-medium">Copper Resistivity:</span> 1.72 × 10⁻⁸ Ω⋅m at 20°C
                  </div>
                  <div>
                    <span className="font-medium">Temperature Coefficient:</span> Increases with temperature
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-orange-800 dark:text-orange-300 mb-3">Geometric Factors</h4>
                <div className="space-y-3 text-orange-700 dark:text-orange-300">
                  <div>
                    <span className="font-medium">Length:</span> Resistance increases proportionally
                  </div>
                  <div>
                    <span className="font-medium">Cross-sectional Area:</span> Resistance decreases proportionally
                  </div>
                  <div>
                    <span className="font-medium">Wire Gauge:</span> Smaller AWG = larger area = lower resistance
                  </div>
                  <div>
                    <span className="font-medium">Stranding:</span> Slight increase due to lay factor
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              AC vs DC Resistance Characteristics
            </h3>
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">DC Resistance</h4>
                <ul className="list-disc pl-4 space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                  <li>Current distributed evenly across conductor</li>
                  <li>Only material resistivity affects resistance</li>
                  <li>Temperature is primary variable factor</li>
                  <li>Used for low-frequency and DC applications</li>
                  <li>Base reference for all calculations</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">AC Impedance</h4>
                <ul className="list-disc pl-4 space-y-2 text-purple-700 dark:text-purple-300 text-sm">
                  <li>Includes resistance plus reactance</li>
                  <li>Skin effect concentrates current at surface</li>
                  <li>Proximity effect from nearby conductors</li>
                  <li>Frequency-dependent characteristics</li>
                  <li>Important for high-frequency applications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Examples Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Real-World Wire Resistance Calculations
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Example 5: Temperature Effects */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Temperature Effect on Conductor Resistance
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Analysis:</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    4/0 AWG copper conductor resistance at various operating temperatures
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Base Resistance (20°C):</span> 0.0490 Ω/1000ft
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Temperature Coefficient:</span> 0.00393/°C
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Resistance vs Temperature:</h4>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex justify-between">
                          <span>20°C:</span><span>0.0490 Ω/1000ft (100%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>60°C:</span><span>0.0567 Ω/1000ft (116%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>75°C:</span><span>0.0596 Ω/1000ft (122%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>90°C:</span><span>0.0625 Ω/1000ft (128%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Impact on System:</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Higher operating temperatures increase losses</li>
                      <li>• Voltage drop increases with temperature</li>
                      <li>• Critical for hot climates and loaded conductors</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Design Considerations:</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Use conductor temperature ratings for calculations</li>
                      <li>• Consider ambient temperature and I²R heating</li>
                      <li>• Size conductors for worst-case conditions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resistance Reference Tables */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Wire Resistance Reference Tables
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                    Copper, 20 °C (NIST Handbook 100; kcmil calculated), Ω/1000 ft
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                    Copper, 75 °C (calculated), Ω/1000 ft
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                    Aluminum EC-H19, 20 °C (calculated), Ω/1000 ft
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                    Aluminum EC-H19, 75 °C (calculated), Ω/1000 ft
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {RESISTANCE_ROWS.map((row) => (
                  <tr key={row.key}>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{formatSize(row.key)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{row.r20Cu}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{row.r75Cu}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{row.r20Al ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{row.r75Al ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{RESISTANCE_NOTES[0]}</p>

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
              Temperature Correction Factors
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base leading-tight font-medium text-blue-800 dark:text-blue-300 mb-2">Copper Temperature Coefficient</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  R₂ = R₁ × [1 + 0.00393(T₂ - T₁)]
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                  <div>• 0°C: 0.92× resistance at 20°C</div>
                  <div>• 20°C: 1.00× reference temperature</div>
                  <div>• 75°C: 1.22× resistance at 20°C</div>
                  <div>• 90°C: 1.28× resistance at 20°C</div>
                </div>
              </div>
              <div>
                <h4 className="text-base leading-tight font-medium text-blue-800 dark:text-blue-300 mb-2">Aluminum Temperature Coefficient</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  R₂ = R₁ × [1 + 0.00403(T₂ - T₁)]
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                  <div>• 0°C: 0.92× resistance at 20°C</div>
                  <div>• 20°C: 1.00× reference temperature</div>
                  <div>• 75°C: 1.22× resistance at 20°C</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Applications */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Technical Applications and Considerations
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Zap className="h-6 w-6 text-purple-600" />
                  Power System Design
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Loss Calculations:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Power loss = I² × R (watts per conductor)</li>
                      <li>• Critical for high-current, long-distance applications</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Design Considerations:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use worst-case temperature for resistance calculations</li>
                      <li>• Consider load growth and future expansion</li>
                      <li>• Account for parallel conductor skin effect</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Settings className="h-6 w-6 text-indigo-600" />
                  Measurement and Testing
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Test Methods:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• DC resistance: Wheatstone bridge or digital ohmmeter</li>
                      <li>• AC impedance: LCR meter at specific frequency</li>
                      <li>• Four-wire (Kelvin) measurement for accuracy</li>
                      <li>• Temperature correction for field measurements</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quality Control:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Verify conductor cross-sectional area</li>
                      <li>• Check for strand breakage or defects</li>
                      <li>• Validate resistance within specification limits</li>
                      <li>• Document test conditions and results</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-blue-600" />
                  Frequency Effects
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Skin Effect:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Current concentrates at conductor surface at higher frequencies</li>
                      <li>• Skin depth δ = √(2/(ωμσ))</li>
                      <li>• Resistance increases with √frequency</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Proximity Effect:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Magnetic field from adjacent conductors</li>
                      <li>• Increases AC resistance beyond skin effect</li>
                      <li>• Critical in parallel conductor installations</li>
                      <li>• Consider conductor spacing and arrangement</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Safety and Standards */}
      <section className="mb-16">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Standards and Safety Considerations
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Testing Requirements
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Acceptance Testing:</span>
                    <span className="text-gray-800 dark:text-gray-200">Field verification of installed cable</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Maintenance Testing:</span>
                    <span className="text-gray-800 dark:text-gray-200">Periodic resistance monitoring</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Fault Analysis:</span>
                    <span className="text-gray-800 dark:text-gray-200">Resistance measurement for diagnosis</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Design Safety Factors
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Use conservative temperature assumptions for resistance calculations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Account for aging effects and corrosion over system life</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Consider connection resistance in addition to conductor resistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Verify adequate short-circuit current capability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Design for thermal cycling and mechanical stress</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Disclaimer
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This calculator provides theoretical resistance values. Actual measurements may vary due to 
                  manufacturing tolerances, temperature, aging, and installation conditions. Always verify 
                  calculations with actual measurements and consult applicable standards and specifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {wireResistanceFAQs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Calculators */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Related Electrical Calculators
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/calculators/voltage-drop-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Voltage Drop Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Calculate voltage drop using wire resistance values
              </p>
            </Link>
            
            <Link 
              href="/calculators/ohms-law-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Calculator className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ohm&apos;s Law Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Apply Ohm&apos;s law with resistance calculations
              </p>
            </Link>

            <Link 
              href="/calculators/wire-size-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wire Size Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Size conductors based on resistance requirements
              </p>
            </Link>

            <Link 
              href="/calculators/ampacity-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Settings className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ampacity Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Determine current capacity with heating effects
              </p>
            </Link>

            <Link 
              href="/calculators/three-phase-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Three Phase Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Three-phase power and resistance calculations
              </p>
            </Link>

            <Link 
              href="/calculators/low-voltage-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Low Voltage Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                DC resistance calculations for low voltage systems
              </p>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}