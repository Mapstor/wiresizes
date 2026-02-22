import { Metadata } from 'next';
import { Suspense } from 'react';
import { WireResistanceCalculator } from '@/components/calculators';
import { Zap, Calculator, TrendingUp, AlertCircle, BookOpen, Settings } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Wire Resistance Calculator | Conductor Resistance Calculator | Ohms per Foot',
  description: 'Professional wire resistance calculator for electrical engineers and contractors. Calculate conductor resistance, impedance, and voltage drop for copper and aluminum wires.',
  keywords: 'wire resistance calculator, conductor resistance, ohms per foot, wire impedance, electrical resistance, copper wire resistance, aluminum wire resistance, voltage drop resistance',
  openGraph: {
    title: 'Wire Resistance Calculator - Conductor Resistance and Impedance Tool',
    description: 'Calculate electrical resistance of wire conductors. Copper and aluminum wire resistance calculator with impedance calculations.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/wire-resistance-calculator',
  },
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Wire Resistance Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Calculate electrical resistance of copper and aluminum conductors by length and gauge.",
  "keywords": "wire resistance, conductor resistance, electrical impedance",
  "url": `https://wiresizes.com/calculators/wire-resistance-calculator`,
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

const wireResistanceFAQs = [
  {
    question: "How do I calculate the resistance of a wire?",
    answer: "Wire resistance is calculated using R = ρL/A, where R is resistance, ρ (rho) is resistivity, L is length, and A is cross-sectional area. For practical calculations, use: R = (Resistance per 1000 feet × Length in feet) ÷ 1000. For example, #12 AWG copper has 1.93 ohms per 1000 feet, so 100 feet = 0.193 ohms."
  },
  {
    question: "What's the difference between resistance and impedance?",
    answer: "Resistance is the opposition to DC current flow, measured in ohms. Impedance is the total opposition to AC current flow, including both resistance and reactance (inductive and capacitive). For power frequencies (50-60 Hz), wire resistance and impedance are nearly equal, but at higher frequencies, impedance becomes significantly higher due to skin effect and proximity effect."
  },
  {
    question: "How does temperature affect wire resistance?",
    answer: "Wire resistance increases with temperature for copper and aluminum. The formula is: R₂ = R₁[1 + α(T₂ - T₁)], where α is the temperature coefficient (0.00393/°C for copper, 0.00403/°C for aluminum). For every 1°C increase, copper resistance increases by about 0.39%. At 75°C vs 20°C, resistance increases by approximately 22%."
  },
  {
    question: "Why is copper wire resistance lower than aluminum?",
    answer: "Copper has lower resistivity than aluminum: 1.72 × 10⁻⁸ ohm-meters vs 2.82 × 10⁻⁸ ohm-meters. This means aluminum has about 64% higher resistance than copper for the same size conductor. However, aluminum is lighter and less expensive, making it suitable for transmission lines where weight and cost are important factors."
  },
  {
    question: "How do I calculate voltage drop from wire resistance?",
    answer: "Voltage drop equals current times resistance: VD = I × R. For single-phase: VD = I × R × 2 (accounting for both conductors). For three-phase: VD = I × R × 1.732. The total circuit resistance includes both hot and neutral (or ground) conductors. Use this to verify voltage drop stays within acceptable limits (typically 3-5%)."
  }
];

export default function WireResistanceCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FAQSchema 
        items={calculatorFAQs['wire-resistance-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Wire Resistance Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Calculate electrical resistance and impedance of wire conductors. Professional tool for 
              engineers, electricians, and designers working with power and signal transmission.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Zap className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Precise Calculations</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Accurate resistance calculations for copper and aluminum conductors at various temperatures.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Calculator className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multiple Parameters</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Calculate resistance, impedance, voltage drop, and power loss for any conductor.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Settings className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Engineering Data</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access comprehensive resistance tables and technical specifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="mb-16">
        <Suspense fallback={<div>Loading calculator...</div>}>
          <WireResistanceCalculator />
        </Suspense>
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
                    <span className="font-medium">Aluminum Resistivity:</span> 2.82 × 10⁻⁸ Ω⋅m at 20°C
                  </div>
                  <div>
                    <span className="font-medium">Silver Resistivity:</span> 1.59 × 10⁻⁸ Ω⋅m at 20°C
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
                  <li>Includes resistance plus reactance (X = jωL)</li>
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
            {/* Example 1: Power Transmission Line */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Transmission Line Analysis
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    500 MCM aluminum conductor, 2 miles long, 75°C operating temperature
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Conductor Size:</span> 500 MCM = 500,000 CM = 253.4 mm²
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Length:</span> 2 miles = 10,560 feet
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Material:</span> Aluminum (ρ = 2.82 × 10⁻⁸ Ω⋅m at 20°C)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">DC Resistance (20°C):</span> 0.206 ohms/1000ft
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Temperature Correction:</span> R₇₅ = R₂₀ × [1 + 0.00403 × (75-20)]
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Resistance at 75°C:</span> 0.206 × 1.222 = 0.252 ohms/1000ft
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Total Resistance:</span> 0.252 × 10.56 = 2.66 ohms
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: 2.66 ohms total resistance at 75°C operating temperature
                  </p>
                </div>
              </div>
            </div>

            {/* Example 2: Motor Feeder Circuit */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Motor Feeder Resistance
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    #6 AWG copper feeder, 150 feet to motor, 480V 3-phase, 65A load
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Conductor:</span> #6 AWG copper (26,240 CM)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">DC Resistance:</span> 0.410 ohms per 1000 feet at 75°C
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">AC Resistance:</span> 0.491 ohms per 1000 feet at 75°C
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Reactance:</span> 0.0590 ohms per 1000 feet
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Per-phase Resistance:</span> 0.491 × 0.15 = 0.0737 ohms
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Voltage Drop:</span> √3 × 65A × 0.0737Ω = 8.3V
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Percentage Drop:</span> 8.3V ÷ 480V = 1.73%
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: 1.73% voltage drop - within acceptable limits for motor circuits
                  </p>
                </div>
              </div>
            </div>

            {/* Example 3: Control Circuit */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                  <Settings className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Control Circuit Analysis
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    #14 AWG copper control wire, 300 feet, 24V DC, 0.5A load
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Conductor:</span> #14 AWG copper (4,110 CM)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">DC Resistance:</span> 2.57 ohms per 1000 feet at 75°C
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">One-way Resistance:</span> 2.57 × 0.30 = 0.771 ohms
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Loop Resistance:</span> 0.771 × 2 = 1.542 ohms
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Voltage Drop:</span> 0.5A × 1.542Ω = 0.771V
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Percentage Drop:</span> 0.771V ÷ 24V = 3.2%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Power Loss:</span> 0.5² × 1.542 = 0.386W
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: 3.2% voltage drop acceptable for control circuits
                  </p>
                </div>
              </div>
            </div>

            {/* Example 4: High-Frequency Application */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                  <Calculator className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  RF/High-Frequency Analysis
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    #12 AWG copper at 1 MHz frequency, skin effect analysis
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Conductor:</span> #12 AWG copper (3.31mm diameter)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">DC Resistance:</span> 5.21 ohms per 1000m at 20°C
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Frequency:</span> 1 MHz
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Skin Depth:</span> δ = √(2/(ωμσ)) = 66.1 μm
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Wire Radius:</span> 1.655 mm
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Ratio:</span> radius/skin depth = 25.0
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">AC Resistance:</span> ~25× DC resistance = 130 ohms/1000m
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Result: Significant skin effect requires special consideration for RF applications
                  </p>
                </div>
              </div>
            </div>

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
                    #4/0 AWG copper conductor resistance at various operating temperatures
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
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Copper Wire Resistance */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Copper Wire DC Resistance (75°C)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        AWG Size
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Ω/1000ft
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Ω/km
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#18</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">8.08</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">26.5</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#16</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">5.08</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">16.7</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#14</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">3.19</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">10.5</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#12</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2.01</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">6.59</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#10</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.26</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">4.14</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#8</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.786</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2.58</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#6</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.491</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.61</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#4</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.308</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.01</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#2</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.194</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.636</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#1/0</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.122</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.400</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#2/0</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.0967</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.317</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#4/0</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.0608</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.199</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Aluminum Wire Resistance */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Aluminum Wire DC Resistance (75°C)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        AWG Size
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Ω/1000ft
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Ω/km
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#12</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">3.28</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">10.8</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#10</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2.07</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">6.79</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#8</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.30</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">4.26</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#6</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.808</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2.65</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#4</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.508</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.67</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#2</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.319</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.05</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#1/0</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.201</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.659</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#2/0</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.159</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.522</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#3/0</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.126</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.413</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#4/0</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.100</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.328</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">250 MCM</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.0847</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.278</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">500 MCM</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.0424</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.139</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
              Temperature Correction Factors
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Copper Temperature Coefficient</h5>
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
                <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Aluminum Temperature Coefficient</h5>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  R₂ = R₁ × [1 + 0.00403(T₂ - T₁)]
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                  <div>• 0°C: 0.92× resistance at 20°C</div>
                  <div>• 20°C: 1.00× reference temperature</div>
                  <div>• 75°C: 1.22× resistance at 20°C</div>
                  <div>• 90°C: 1.29× resistance at 20°C</div>
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
                      <li>• Annual energy loss = Loss × 8760 hours</li>
                      <li>• Economic optimization balances conductor cost vs losses</li>
                      <li>• Critical for high-current, long-distance applications</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Design Considerations:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use worst-case temperature for resistance calculations</li>
                      <li>• Consider load growth and future expansion</li>
                      <li>• Account for parallel conductor skin effect</li>
                      <li>• Evaluate conductor material economics</li>
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
                      <li>• Significant above ~1 kHz for large conductors</li>
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

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  Economic Analysis
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Life-Cycle Costing:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Initial conductor cost vs ongoing loss costs</li>
                      <li>• Energy cost escalation over system life</li>
                      <li>• Optimal conductor size minimizes total cost</li>
                      <li>• Consider maintenance and reliability factors</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Material Selection:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Copper: Lower resistance, higher cost</li>
                      <li>• Aluminum: Higher resistance, lower cost, lighter</li>
                      <li>• Consider termination requirements and connections</li>
                      <li>• Evaluate thermal expansion differences</li>
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
                  Industry Standards
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>IEEE 738: Calculating Current-Temperature Relationships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>ASTM B193: Test Method for Resistivity of Electrical Conductor Materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>IEC 60287: Electric cables - Calculation of current rating</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>NEMA WC 70: Power Cables Rated 2000 Volts or Less</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>ICEA specifications for conductor resistance limits</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Testing Requirements
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Manufacturing QC:</span>
                    <span className="text-gray-800 dark:text-gray-200">Every conductor lot tested</span>
                  </div>
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
                  Professional Disclaimer
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
              href="/calculators/ohms-law"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Calculator className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ohms Law Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Apply Ohms law with resistance calculations
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
              href="/calculators/three-phase"
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
              href="https://www.astm.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Calculator className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">ASTM International</span>
            </a>
            <a 
              href="https://www.iec.ch/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Zap className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">IEC Standards</span>
            </a>
            <a 
              href="https://www.nema.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Settings className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">NEMA Standards</span>
            </a>
            <a 
              href="https://www.icea.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">ICEA Cable Standards</span>
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
          </div>
        </div>
      </section>
    </div>
  );
}