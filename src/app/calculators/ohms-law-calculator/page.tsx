import { Metadata } from 'next';
import { Suspense } from 'react';
import { OhmsLawCalculator } from '@/components/calculators';
import { Zap, Calculator, TrendingUp, AlertCircle, BookOpen, Settings } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Ohms Law Calculator | Voltage Current Resistance Power Calculator | V=IR',
  description: 'Professional Ohms Law calculator for electrical engineers and technicians. Calculate voltage, current, resistance, and power using V=IR and P=VI formulas. AC and DC circuit calculations.',
  keywords: 'ohms law calculator, voltage current resistance power, V=IR calculator, electrical calculations, circuit analysis, power calculations, electrical formulas',
  openGraph: {
    title: 'Ohms Law Calculator - Voltage Current Resistance Power Calculator',
    description: 'Calculate voltage, current, resistance, and power using Ohms Law. Professional electrical calculations tool.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/ohms-law-calculator',
  },
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Ohms Law Calculator Pro",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Professional Ohms Law calculator with power calculations and circuit analysis.",
  "keywords": "ohms law calculator, electrical formulas, circuit analysis",
  "url": `https://wiresizes.com/calculators/ohms-law-calculator`,
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

const ohmsLawFAQs = [
  {
    question: "What is Ohms Law and how do I use it?",
    answer: "Ohms Law states that voltage equals current times resistance (V = I × R). It's fundamental to electrical calculations. Given any two values, you can calculate the third: V = I × R, I = V ÷ R, or R = V ÷ I. Additionally, power relationships are P = V × I, P = I² × R, or P = V² ÷ R. These formulas apply to DC circuits and AC circuits with resistive loads."
  },
  {
    question: "How do I calculate power using Ohms Law?",
    answer: "Power can be calculated using three formulas: P = V × I (power = voltage × current), P = I² × R (power = current squared × resistance), or P = V² ÷ R (power = voltage squared ÷ resistance). Choose the formula based on which values you know. For example, if you know voltage (120V) and current (10A), then P = 120 × 10 = 1200 watts."
  },
  {
    question: "Does Ohms Law apply to AC circuits?",
    answer: "Ohms Law applies to AC circuits, but with important considerations. For purely resistive AC circuits, use RMS values for voltage and current. For reactive circuits (with inductance or capacitance), impedance (Z) replaces resistance: V = I × Z. The phase relationship between voltage and current also affects power calculations, requiring the power factor: P = V × I × cos(φ)."
  },
  {
    question: "What's the difference between resistance and impedance?",
    answer: "Resistance (R) is opposition to current flow in DC circuits or AC circuits with pure resistive loads, measured in ohms. Impedance (Z) is the total opposition to current flow in AC circuits, including both resistance and reactance (from inductance and capacitance), also measured in ohms. At DC and low frequencies, R ≈ Z, but they differ significantly at higher frequencies."
  },
  {
    question: "How do I use Ohms Law for series and parallel circuits?",
    answer: "In series circuits: total voltage = sum of individual voltages, current is the same throughout, total resistance = sum of individual resistances. In parallel circuits: voltage is the same across all branches, total current = sum of branch currents, 1/Rtotal = 1/R1 + 1/R2 + 1/R3... Apply Ohms Law to each component individually and to the total circuit."
  }
];

export default function OhmsLawCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FAQSchema 
        items={calculatorFAQs['ohms-law-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Ohms Law Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Calculate voltage, current, resistance, and power using fundamental electrical laws. 
              Professional tool for electrical analysis and circuit design.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Zap className="h-12 w-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Four-Way Calculations</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Calculate any electrical parameter when given two others: V, I, R, or P.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Calculator className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multiple Formulas</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Uses all Ohms Law and power formulas for comprehensive electrical analysis.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Settings className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AC/DC Applications</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Applicable to DC circuits and AC circuits with proper considerations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="mb-16">
        <Suspense fallback={<div>Loading calculator...</div>}>
          <OhmsLawCalculator />
        </Suspense>
      </section>

      {/* Understanding Ohms Law */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Understanding Ohms Law and Power Relationships
            </h2>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Ohms Law is the fundamental relationship governing electrical circuits, establishing the 
              connection between voltage, current, and resistance. Combined with power formulas, these 
              relationships form the foundation of electrical engineering and circuit analysis.
            </p>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-blue-800 dark:text-blue-300 mb-4">
                  Ohms Law Formulas
                </h3>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-mono text-blue-800 dark:text-blue-300 mb-2">V = I × R</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Voltage = Current × Resistance</div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-mono text-blue-800 dark:text-blue-300 mb-2">I = V ÷ R</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Current = Voltage ÷ Resistance</div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-mono text-blue-800 dark:text-blue-300 mb-2">R = V ÷ I</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Resistance = Voltage ÷ Current</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-4">
                  Power Formulas
                </h3>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-mono text-green-800 dark:text-green-300 mb-2">P = V × I</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Power = Voltage × Current</div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-mono text-green-800 dark:text-green-300 mb-2">P = I² × R</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Power = Current² × Resistance</div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-mono text-green-800 dark:text-green-300 mb-2">P = V² ÷ R</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Power = Voltage² ÷ Resistance</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300 mb-4">
                Ohms Law Wheel - The Complete Picture
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                The Ohms Law wheel shows all 12 possible calculations using the fundamental relationships. 
                Any two known values allow calculation of the remaining two parameters.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">If you know V and I:</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• R = V ÷ I</li>
                    <li>• P = V × I</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">If you know V and R:</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• I = V ÷ R</li>
                    <li>• P = V² ÷ R</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">If you know V and P:</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• I = P ÷ V</li>
                    <li>• R = V² ÷ P</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">If you know I and R:</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• V = I × R</li>
                    <li>• P = I² × R</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real World Examples */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Real-World Ohms Law Applications
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Example 1: Heater Element */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Electric Heater Element
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Given Values:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    1500W heater element operating at 240V
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Known:</span> P = 1500W, V = 240V
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Find Current:</span> I = P ÷ V = 1500W ÷ 240V = 6.25A
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Find Resistance:</span> R = V² ÷ P = 240² ÷ 1500 = 38.4Ω
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Verification:</span> P = I² × R = 6.25² × 38.4 = 1500W ✓
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: Element draws 6.25A and has 38.4Ω resistance
                  </p>
                </div>
              </div>
            </div>

            {/* Example 2: LED Circuit */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  LED Current Limiting Resistor
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Design Requirement:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    LED (3.2V forward voltage, 20mA) powered from 12V supply
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Supply Voltage:</span> 12V
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">LED Voltage Drop:</span> 3.2V
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Resistor Voltage:</span> 12V - 3.2V = 8.8V
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Required Current:</span> 20mA = 0.02A
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Resistor Value:</span> R = V ÷ I = 8.8V ÷ 0.02A = 440Ω
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Power Rating:</span> P = I² × R = 0.02² × 440 = 0.176W
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: Use 470Ω resistor (next standard value), 1/4W rating
                  </p>
                </div>
              </div>
            </div>

            {/* Example 3: Motor Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Motor Winding Resistance
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Motor Test:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Motor winding resistance measurement with locked rotor test
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Test Voltage:</span> 24V DC applied to winding
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Measured Current:</span> 8.5A
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Winding Resistance:</span> R = V ÷ I = 24V ÷ 8.5A = 2.82Ω
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Test Power:</span> P = V × I = 24V × 8.5A = 204W
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Temperature Note:</span> Resistance increases ~40% from cold to hot
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: Winding resistance 2.82Ω cold, expect ~3.95Ω at operating temperature
                  </p>
                </div>
              </div>
            </div>

            {/* Example 4: Voltage Divider */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Voltage Divider Circuit
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Circuit Design:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Create 5V output from 12V supply using voltage divider
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Input Voltage:</span> 12V
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Output Voltage:</span> 5V desired
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Voltage Ratio:</span> 5V ÷ 12V = 0.417
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Using R1 = 10kΩ (top):</span> R2 = R1 × (Vout ÷ (Vin - Vout))
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">R2 Calculation:</span> R2 = 10kΩ × (5V ÷ 7V) = 7.14kΩ
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Total Current:</span> I = 12V ÷ 17.14kΩ = 0.7mA
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: Use 10kΩ and 6.8kΩ resistors (standard values) for ~4.85V output
                  </p>
                </div>
              </div>
            </div>

            {/* Example 5: Power Supply Design */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Linear Power Supply Design
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Design Requirements:</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    5V regulated output, 2A maximum current, input voltage 12V
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Input Voltage:</span> 12V
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Output Voltage:</span> 5V
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Maximum Current:</span> 2A
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Voltage Drop Across Regulator:</span> 12V - 5V = 7V
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Power Calculations:</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Output Power: P = V × I = 5V × 2A = 10W<br/>
                      Regulator Dissipation: P = 7V × 2A = 14W<br/>
                      Total Input Power: 10W + 14W = 24W<br/>
                      Efficiency: 10W ÷ 24W = 41.7%
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">Thermal Considerations:</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Heat sink required for 14W dissipation<br/>
                      Thermal resistance calculation needed<br/>
                      Consider switching regulator for higher efficiency
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Circuit Analysis Tables */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Circuit Analysis Reference Tables
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Series Circuit Rules */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Series Circuit Relationships
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Parameter
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Relationship
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Current (I)</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Same throughout circuit</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Voltage (V)</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">V_total = V1 + V2 + V3...</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Resistance (R)</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">R_total = R1 + R2 + R3...</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Power (P)</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">P_total = P1 + P2 + P3...</td></tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Series Example:</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Three resistors: 10Ω, 20Ω, 30Ω in series with 12V supply:<br/>
                  • R_total = 10 + 20 + 30 = 60Ω<br/>
                  • I = 12V ÷ 60Ω = 0.2A<br/>
                  • V1 = 0.2A × 10Ω = 2V<br/>
                  • V2 = 0.2A × 20Ω = 4V<br/>
                  • V3 = 0.2A × 30Ω = 6V<br/>
                  • Total: 2V + 4V + 6V = 12V ✓
                </p>
              </div>
            </div>

            {/* Parallel Circuit Rules */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Parallel Circuit Relationships
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Parameter
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Relationship
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Voltage (V)</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Same across all branches</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Current (I)</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">I_total = I1 + I2 + I3...</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Resistance (R)</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1/R_total = 1/R1 + 1/R2 + 1/R3...</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Power (P)</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">P_total = P1 + P2 + P3...</td></tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Parallel Example:</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Three resistors: 10Ω, 20Ω, 30Ω in parallel with 12V supply:<br/>
                  • 1/R_total = 1/10 + 1/20 + 1/30 = 0.183<br/>
                  • R_total = 5.45Ω<br/>
                  • I1 = 12V ÷ 10Ω = 1.2A<br/>
                  • I2 = 12V ÷ 20Ω = 0.6A<br/>
                  • I3 = 12V ÷ 30Ω = 0.4A<br/>
                  • I_total = 1.2 + 0.6 + 0.4 = 2.2A
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety and Best Practices */}
      <section className="mb-16">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Safety and Best Practices
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Electrical Safety Considerations
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Always de-energize circuits before making resistance measurements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Use proper PPE and follow lockout/tagout procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Verify meter settings and ranges before measurements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Consider power dissipation in components to prevent overheating</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Account for temperature effects on component values</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Measurement Accuracy
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Voltage Measurement:</span>
                    <span className="text-gray-800 dark:text-gray-200">Use high-impedance meters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Current Measurement:</span>
                    <span className="text-gray-800 dark:text-gray-200">Account for meter burden</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Resistance Measurement:</span>
                    <span className="text-gray-800 dark:text-gray-200">Use 4-wire method for low values</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">AC Measurements:</span>
                    <span className="text-gray-800 dark:text-gray-200">Use true RMS meters</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Application Limitations
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Ohms Law applies directly to linear, resistive circuits only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>For reactive AC circuits, use impedance (Z) instead of resistance (R)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Power calculations in AC circuits require power factor considerations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Semiconductor devices have non-linear voltage-current relationships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>High-frequency effects may invalidate simple resistance models</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Professional Disclaimer
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This calculator provides theoretical calculations based on ideal conditions. 
                  Actual circuit behavior may vary due to component tolerances, temperature effects, 
                  frequency dependencies, and parasitic elements. Always verify calculations with 
                  actual measurements and follow applicable safety standards.
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
            {ohmsLawFAQs.map((faq, index) => (
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
        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Related Electrical Calculators
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/calculators/watts-to-amps"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Calculator className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Watts to Amps</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Convert power to current using Ohms Law relationships
              </p>
            </Link>
            
            <Link 
              href="/calculators/voltage-drop-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Voltage Drop Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Apply Ohms Law to calculate voltage drop in conductors
              </p>
            </Link>

            <Link 
              href="/calculators/wire-resistance-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Settings className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wire Resistance</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Calculate conductor resistance for Ohms Law applications
              </p>
            </Link>

            <Link 
              href="/calculators/kilowatts-to-amps-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">kW to Amps</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Convert kilowatts to amperage using power formulas
              </p>
            </Link>

            <Link 
              href="/calculators/three-phase"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Three Phase Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Apply Ohms Law to three-phase power systems
              </p>
            </Link>

            <Link 
              href="/calculators/circuit-breaker-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Circuit Breaker Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Size protection based on Ohms Law current calculations
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Authority Links */}
      <section className="mb-16">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Professional Resources and Standards
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="https://www.ieee.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">IEEE Standards</span>
            </a>
            <a 
              href="https://www.iec.ch/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Calculator className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">IEC Standards</span>
            </a>
            <a 
              href="https://www.nist.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Settings className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">NIST Measurements</span>
            </a>
            <a 
              href="https://www.nfpa.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Zap className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">NFPA Electrical Safety</span>
            </a>
            <a 
              href="https://www.ul.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">UL Safety Standards</span>
            </a>
            <a 
              href="https://www.nema.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">NEMA Guidelines</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}