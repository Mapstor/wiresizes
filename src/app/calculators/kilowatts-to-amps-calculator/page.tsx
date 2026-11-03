import { Metadata } from 'next';
import { KilowattsToAmpsCalculator } from '@/components/calculators/KilowattsToAmpsCalculator';
import { Zap, Calculator, TrendingUp, AlertCircle, BookOpen, Settings } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';

export const metadata: Metadata = {
  title: 'Kilowatts to Amps Calculator — kW → A',
  description: 'Convert kilowatts to amps for single-phase and three-phase circuits. Includes power-factor input for motors and inductive loads.',
  keywords: 'kilowatts to amps, kw to amperage calculator, power to current converter, three phase kw to amps, power factor calculator, electrical power conversion',
  openGraph: {
    title: 'Kilowatts to Amps Calculator - Convert kW to Amperage',
    description: 'Convert kilowatts to amps for electrical load calculations. Single and three-phase kW to amperage calculator with power factor.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/kilowatts-to-amps-calculator',
    images: ['/opengraph-image']
  },
  alternates: { canonical: '/calculators/kilowatts-to-amps-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "Kilowatts to Amps Calculator",
  url: "https://wiresizes.com/calculators/kilowatts-to-amps-calculator",
  description: "Kilowatts to amps calculator for electrical contractors and engineers. Convert kW to amperage for single-phase and three-phase systems. Includes power factor calculations."
};

const kilowattsToAmpsFAQs = [
  {
    question: "How do I convert kilowatts to amps?",
    answer: "To convert kilowatts to amps, use the formula: Amps = (kW × 1000) ÷ (Voltage × Power Factor) for single-phase, or Amps = (kW × 1000) ÷ (Voltage × √3 × Power Factor) for three-phase. For example, 5 kW at 240 V single-phase with 1.0 power factor: Amps = (5 × 1000) ÷ (240 × 1.0) = 20.8 amps."
  },
  {
    question: "What is power factor and why does it matter?",
    answer: "Power factor is the ratio of real power (kW) to apparent power (kVA). A power factor of 1.0 means all power is useful (resistive loads), while lower values indicate reactive components. Poor power factor increases current requirements - a 10 kW load at 0.8 PF requires 25 % more current than at 1.0 PF."
  },
  {
    question: "How do I calculate amps for three-phase equipment?",
    answer: "For three-phase systems, use: Amps = (kW × 1000) ÷ (Line Voltage × 1.732 × Power Factor). The 1.732 factor accounts for the √3 relationship in balanced three-phase systems. For example, a 15 kW three-phase load at 480 V with 0.85 PF: Amps = (15 × 1000) ÷ (480 × 1.732 × 0.85) = 21.2 amps per phase."
  },
  {
    question: "Why do I get different current values for line and phase currents?",
    answer: "In three-phase systems, line current equals phase current in wye connections, but differs in delta connections. For wye: Line current = Phase current. For delta: Line current = Phase current × 1.732. Most three-phase equipment ratings refer to line current, which is what you measure on the conductors feeding the equipment."
  },
];

export default function KilowattsToAmpsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CombinedSchema 
        webApp={webAppData} 
      />
      
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Kilowatts to Amps Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Convert kilowatts to amperage for electrical load calculations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Zap className="h-12 w-12 text-green-600 mb-4" />
              <p className="text-xl font-semibold mb-2">Real Power Conversion</p>
              <p className="text-gray-600 dark:text-gray-400">
                Convert kilowatts (real power) to amps for single-phase and three-phase circuits.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Calculator className="h-12 w-12 text-emerald-600 mb-4" />
              <p className="text-xl font-semibold mb-2">Power Factor Integration</p>
              <p className="text-gray-600 dark:text-gray-400">
                Accounts for power factor effects on current requirements for realistic calculations.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Settings className="h-12 w-12 text-blue-600 mb-4" />
              <p className="text-xl font-semibold mb-2">Multi-Phase Systems</p>
              <p className="text-gray-600 dark:text-gray-400">
                Supports single-phase and three-phase systems with proper phase relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="mb-16">
        <KilowattsToAmpsCalculator />
      </section>

      {/* Understanding Power and Current Relationships */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Understanding Power and Current Relationships
            </h2>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Converting kilowatts to amps is fundamental to electrical system design. This conversion determines 
              conductor sizing, overcurrent protection, and equipment ratings. Understanding the relationship 
              between power, voltage, current, and power factor is essential for safe and efficient electrical installations.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Basic Power Relationships
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">Single-Phase Power</h4>
                <div className="space-y-3 text-blue-700 dark:text-blue-300">
                  <div className="text-lg font-mono">P = V × I × PF</div>
                  <div className="text-sm">Where:</div>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>P = Power in watts</li>
                    <li>V = Voltage in volts</li>
                    <li>I = Current in amps</li>
                    <li>PF = Power Factor</li>
                  </ul>
                  <div className="text-sm font-medium mt-3">
                    Rearranged: I = P ÷ (V × PF)
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-3">Three-Phase Power</h4>
                <div className="space-y-3 text-green-700 dark:text-green-300">
                  <div className="text-lg font-mono">P = V × I × √3 × PF</div>
                  <div className="text-sm">Where:</div>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>√3 = 1.732 (three-phase factor)</li>
                    <li>V = Line-to-line voltage</li>
                    <li>I = Line current</li>
                    <li>Other terms same as single-phase</li>
                  </ul>
                  <div className="text-sm font-medium mt-3">
                    Rearranged: I = P ÷ (V × 1.732 × PF)
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Power Factor and Its Impact
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Power factor represents the phase relationship between voltage and current in AC circuits. It directly 
              affects the current required to deliver a given amount of real power (kilowatts).
            </p>
            
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">Unity Power Factor (PF = 1.0)</h4>
                <ul className="list-disc pl-4 space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>Voltage and current in phase</li>
                  <li>All power is real power (resistive loads)</li>
                  <li>Minimum current for given power</li>
                  <li>Examples: Incandescent lighting, heating elements</li>
                  <li>Most efficient power transfer</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-3">Leading Power Factor</h4>
                <ul className="list-disc pl-4 space-y-1 text-orange-700 dark:text-orange-300 text-sm">
                  <li>Current leads voltage</li>
                  <li>Capacitive reactive power</li>
                  <li>Less common in typical loads</li>
                  <li>Examples: Over-excited synchronous motors</li>
                  <li>Can help correct lagging power factor</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">Lagging Power Factor (PF &lt; 1.0)</h4>
                <ul className="list-disc pl-4 space-y-1 text-purple-700 dark:text-purple-300 text-sm">
                  <li>Current lags voltage</li>
                  <li>Inductive reactive power</li>
                  <li>Higher current for given power</li>
                  <li>Examples: Motors, transformers, fluorescent lighting</li>
                  <li>Most common in industrial settings</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-6">
              <h4 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">
                Impact of Poor Power Factor
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-red-700 dark:text-red-300 text-sm">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Increased current requirements</li>
                  <li>Higher I²R losses in conductors</li>
                  <li>Reduced transformer capacity</li>
                  <li>Voltage drop issues</li>
                </ul>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Utility power factor penalties</li>
                  <li>Oversized electrical infrastructure</li>
                  <li>Reduced system efficiency</li>
                  <li>Equipment overheating</li>
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
            Real-World Kilowatts to Amps Calculations
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Example 4: LED Lighting System */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
                  <Calculator className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  LED Lighting System
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Lighting Load:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    25 kW LED lighting system, 277 V single-phase, 0.95 power factor
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Power:</span> 25 kW (25,000 watts)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Voltage:</span> 277 V (277/480 V system)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Power Factor:</span> 0.95 (LED drivers with PFC)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Formula:</span> I = kW × 1000 ÷ (V × PF)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Calculation:</span> I = 25,000 ÷ (277 × 0.95)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Current:</span> 95.0 amps
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Power Factor Reference Tables */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Power Factor Reference Tables
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Power Factor Impact on Current */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Current Multiplication Factors
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Power Factor
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Current Multiplier
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        % Increase
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.00</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.00</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0 %</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.95</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.05</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">5 %</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.90</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.11</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">11 %</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.85</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.18</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">18 %</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.80</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.25</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">25 %</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.75</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.33</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">33 %</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.70</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.43</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">43 %</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.60</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.67</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">67 %</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.50</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2.00</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">100 %</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  <strong>Example:</strong> A 10 kW load at 0.8 power factor requires 25 % more current than 
                  the same load at 1.0 power factor. This directly impacts conductor sizing and system losses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Guidelines */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Application Guidelines and Best Practices
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-green-600" />
                  Motor Load Calculations
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">NEC Requirements:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use NEC Table 430.250 for motor full load current</li>
                      <li>• Don't use nameplate current for conductor sizing</li>
                      <li>• Consider motor starting current for voltage drop</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Power Factor Considerations:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Partial load: Power factor decreases significantly</li>
                      <li>• Variable frequency drives improve power factor</li>
                      <li>• Consider power factor correction for large motors</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Zap className="h-6 w-6 text-blue-600" />
                  Lighting System Design
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">LED Considerations:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Check driver specifications for actual values</li>
                      <li>• Some dimming systems affect power factor</li>
                      <li>• Consider harmonic distortion with large LED loads</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Settings className="h-6 w-6 text-purple-600" />
                  Power Quality Considerations
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Harmonic Effects:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Non-linear loads create harmonics</li>
                      <li>• Harmonics increase effective current</li>
                      <li>• May require conductor derating</li>
                      <li>• Consider K-rated transformers for harmonic loads</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-300 mb-2">Power Factor Correction:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Capacitors improve power factor</li>
                      <li>• Reduces current requirements</li>
                      <li>• May eliminate utility penalties</li>
                      <li>• Consider automatic power factor correction</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                  System Efficiency
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Loss Calculations:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• I²R losses increase with current</li>
                      <li>• Poor power factor increases losses</li>
                      <li>• Consider economic analysis of conductor sizing</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Load Growth Planning:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Design for anticipated load growth</li>
                      <li>• Consider spare capacity in calculations</li>
                      <li>• Plan for changing power factor with new equipment</li>
                      <li>• Document actual vs calculated loads</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety and Code Compliance */}
      <section className="mb-16">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Safety and Code Compliance
            </h2>
          </div>
          
          <div className="grid gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Installation Considerations
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Verify actual equipment power factor with manufacturer data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Consider load diversity and demand factors appropriately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Plan for worst-case loading conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Document power factor assumptions for future reference</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Consider harmonic effects on neutral conductors</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Disclaimer
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This calculator provides estimates based on ideal conditions. Actual current requirements 
                  may vary due to equipment characteristics, operating conditions, and system harmonics. 
                  Always verify with manufacturer data and actual measurements. Consult local electrical 
                  codes and qualified professionals for installation requirements.
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
            {kilowattsToAmpsFAQs.map((faq, index) => (
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
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Related Electrical Calculators
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/calculators/kva-to-amps-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Calculator className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">kVA to Amps Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Convert apparent power (kVA) to current
              </p>
            </Link>
            
            <Link 
              href="/calculators/watts-to-amps-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Watts to Amps</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Convert watts to amperage for smaller electrical loads
              </p>
            </Link>


            <Link 
              href="/calculators/three-phase-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Three Phase Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Comprehensive three-phase power calculations
              </p>
            </Link>

            <Link 
              href="/calculators/wire-size-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wire Size Calculator</h3>
              </div>
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}