import { Metadata } from 'next';
import { Suspense } from 'react';
import { KilowattsToAmpsCalculator } from '@/components/calculators';
import { Zap, Calculator, TrendingUp, AlertCircle, BookOpen, Settings } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Kilowatts to Amps Calculator | kW to Amperage Converter | Power to Current',
  description: 'Professional kilowatts to amps calculator for electrical contractors and engineers. Convert kW to amperage for single-phase and three-phase systems. Includes power factor calculations.',
  keywords: 'kilowatts to amps, kw to amperage calculator, power to current converter, electrical load calculator, three phase kw to amps, power factor calculator, electrical power conversion',
  openGraph: {
    title: 'Kilowatts to Amps Calculator - Convert kW to Amperage',
    description: 'Convert kilowatts to amps for electrical load calculations. Single and three-phase kW to amperage calculator with power factor.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/kilowatts-to-amps-calculator',
  },
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Kilowatts to Amps Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Convert kilowatts to amperage for large electrical loads and industrial applications.",
  "keywords": "kilowatts to amps, kW to amps, power conversion",
  "url": `https://wiresizes.com/calculators/kilowatts-to-amps-calculator`,
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

const kilowattsToAmpsFAQs = [
  {
    question: "How do I convert kilowatts to amps?",
    answer: "To convert kilowatts to amps, use the formula: Amps = (kW × 1000) ÷ (Voltage × Power Factor) for single-phase, or Amps = (kW × 1000) ÷ (Voltage × √3 × Power Factor) for three-phase. For example, 5kW at 240V single-phase with 1.0 power factor: Amps = (5 × 1000) ÷ (240 × 1.0) = 20.8 amps."
  },
  {
    question: "What is power factor and why does it matter?",
    answer: "Power factor is the ratio of real power (kW) to apparent power (kVA). It represents how efficiently electrical power is being used. A power factor of 1.0 means all power is useful (resistive loads), while lower values indicate reactive components. Poor power factor increases current requirements - a 10kW load at 0.8 PF requires 25% more current than at 1.0 PF."
  },
  {
    question: "How do I calculate amps for three-phase equipment?",
    answer: "For three-phase systems, use: Amps = (kW × 1000) ÷ (Line Voltage × 1.732 × Power Factor). The 1.732 factor accounts for the √3 relationship in balanced three-phase systems. For example, a 15kW three-phase load at 480V with 0.85 PF: Amps = (15 × 1000) ÷ (480 × 1.732 × 0.85) = 21.2 amps per phase."
  },
  {
    question: "Why do I get different current values for line and phase currents?",
    answer: "In three-phase systems, line current equals phase current in wye connections, but differs in delta connections. For wye: Line current = Phase current. For delta: Line current = Phase current × 1.732. Most three-phase equipment ratings refer to line current, which is what you measure on the conductors feeding the equipment."
  },
  {
    question: "What power factor should I use for different types of loads?",
    answer: "Typical power factors: Incandescent lighting (1.0), Fluorescent lighting (0.9), Motors at full load (0.8-0.9), Motors at partial load (0.5-0.8), Welders (0.5-0.8), Electronic equipment (0.7-0.95), Power supplies (0.6-0.95). When unknown, use 0.8 for motor loads and 0.9 for mixed commercial loads as conservative estimates."
  }
];

export default function KilowattsToAmpsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FAQSchema 
        items={calculatorFAQs['kilowatts-to-amps-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Kilowatts to Amps Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Convert kilowatts to amperage for electrical load calculations. Professional tool for sizing 
              conductors, breakers, and electrical equipment with power factor considerations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Zap className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real Power Conversion</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Convert kilowatts (real power) to current requirements for accurate electrical design.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Calculator className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Power Factor Integration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Accounts for power factor effects on current requirements for realistic calculations.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Settings className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multi-Phase Systems</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Supports single-phase and three-phase systems with proper phase relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="mb-16">
        <Suspense fallback={<div>Loading calculator...</div>}>
          <KilowattsToAmpsCalculator />
        </Suspense>
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
                <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-3">Leading Power Factor (PF &gt; 1.0)</h4>
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
            {/* Example 1: Commercial HVAC System */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Commercial HVAC System
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">System Specifications:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    50kW three-phase chiller unit, 480V supply, 0.85 power factor
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Power:</span> 50kW (50,000 watts)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Voltage:</span> 480V three-phase
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Power Factor:</span> 0.85 (typical for large motors)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Formula:</span> I = kW × 1000 ÷ (V × √3 × PF)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Calculation:</span> I = 50,000 ÷ (480 × 1.732 × 0.85)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Current:</span> 70.7 amps per phase
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">125% for Sizing:</span> 70.7 × 1.25 = 88.4A
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: Use 100A breaker and #3 AWG conductors minimum
                  </p>
                </div>
              </div>
            </div>

            {/* Example 2: Residential Electric Range */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Residential Electric Range
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Appliance Rating:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    12kW electric range, 240V single-phase, resistive load
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Power:</span> 12kW (12,000 watts)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Voltage:</span> 240V single-phase
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Power Factor:</span> 1.0 (resistive heating elements)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Formula:</span> I = kW × 1000 ÷ (V × PF)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Calculation:</span> I = 12,000 ÷ (240 × 1.0)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Current:</span> 50.0 amps
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">NEC Demand:</span> 8kW + 40% of remainder = 9.6kW
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Demand Current:</span> 40.0 amps
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: 50A breaker required, #6 AWG conductors adequate
                  </p>
                </div>
              </div>
            </div>

            {/* Example 3: Industrial Motor */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Industrial Motor Load
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Motor Specifications:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    75kW (100 HP) motor, 460V three-phase, 0.88 power factor at full load
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Power:</span> 75kW output (input power higher due to efficiency)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Efficiency:</span> 95% (0.95)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Input Power:</span> 75kW ÷ 0.95 = 78.9kW
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Voltage:</span> 460V three-phase
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Power Factor:</span> 0.88 at full load
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Calculation:</span> I = 78,900 ÷ (460 × 1.732 × 0.88)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Full Load Current:</span> 112.4 amps
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">NEC Table Value:</span> 124A (from Table 430.250)
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: Use NEC table value (124A) for conductor and overload sizing
                  </p>
                </div>
              </div>
            </div>

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
                    25kW LED lighting system, 277V single-phase, 0.95 power factor
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Power:</span> 25kW (25,000 watts)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Voltage:</span> 277V (277/480V system)
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Continuous Load:</span> 95.0 ÷ 0.8 = 118.8A capacity needed
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: 125A breaker and #1 AWG conductors for continuous operation
                  </p>
                </div>
              </div>
            </div>

            {/* Example 5: Data Center UPS */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Data Center UPS System
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">System Configuration:</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    500kVA UPS system with 400kW load, 480V three-phase output
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Apparent Power:</span> 500kVA
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Real Power:</span> 400kW
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Power Factor:</span> 400kW ÷ 500kVA = 0.8
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Output Voltage:</span> 480V three-phase
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">UPS Efficiency:</span> 96% at full load
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Output Current:</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      I = 400,000W ÷ (480V × 1.732 × 0.8) = 601A
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Input Current:</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Input Power = 400kW ÷ 0.96 = 417kW<br/>
                      I = 417,000W ÷ (480V × 1.732 × 0.95) = 527A
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Bypass Requirements:</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Bypass current = Output current = 601A<br/>
                      Size for 125% = 751A minimum
                    </p>
                  </div>
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
            {/* Common Equipment Power Factors */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Typical Power Factors by Equipment Type
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Equipment Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Power Factor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Incandescent Lighting</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.00</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Electric Heating</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.00</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">LED Lighting (with PFC)</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.95-0.98</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Fluorescent Lighting</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.90-0.95</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Motors (Full Load)</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.80-0.90</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Motors (Partial Load)</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.50-0.80</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Welding Equipment</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.50-0.80</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Transformers</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.95-0.99</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Power Supplies (SMPS)</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.60-0.95</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Computer Equipment</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.70-0.95</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

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
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.00</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.00</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0%</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.95</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.05</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">5%</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.90</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.11</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">11%</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.85</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.18</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">18%</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.80</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.25</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">25%</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.75</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.33</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">33%</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.70</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.43</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">43%</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.60</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.67</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">67%</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.50</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2.00</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">100%</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  <strong>Example:</strong> A 10kW load at 0.8 power factor requires 25% more current than 
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
                      <li>• Size conductors at 125% of motor FLC</li>
                      <li>• Consider motor starting current for voltage drop</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Power Factor Considerations:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Full load: 0.8-0.9 power factor typical</li>
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
                      <li>• Modern LEDs typically have 0.9+ power factor</li>
                      <li>• Check driver specifications for actual values</li>
                      <li>• Some dimming systems affect power factor</li>
                      <li>• Consider harmonic distortion with large LED loads</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Continuous Load Requirements:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Size circuits at 125% for continuous operation</li>
                      <li>• Applies to lighting operating &gt;3 hours continuously</li>
                      <li>• Critical for commercial and industrial lighting</li>
                      <li>• Affects both conductor and breaker sizing</li>
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
                      <li>• Larger conductors reduce long-term operating costs</li>
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
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  NEC Requirements
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Use actual connected load, not demand factors, for conductor sizing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Size conductors at 125% for continuous loads (&gt;3 hours operation)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Consider voltage drop limitations (5% for feeders, 3% for branch circuits)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Use NEC motor tables, not nameplate current, for motor circuits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Account for temperature derating factors</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Design Safety Factors
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Continuous Loads:</span>
                    <span className="text-gray-800 dark:text-gray-200">125% minimum sizing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Motor Loads:</span>
                    <span className="text-gray-800 dark:text-gray-200">Use NEC table values</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Future Growth:</span>
                    <span className="text-gray-800 dark:text-gray-200">Consider 20-25% spare capacity</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Power Factor:</span>
                    <span className="text-gray-800 dark:text-gray-200">Use conservative estimates</span>
                  </div>
                </div>
              </div>
            </div>

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
                  Professional Disclaimer
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
                Convert apparent power (kVA) to current for transformer sizing
              </p>
            </Link>
            
            <Link 
              href="/calculators/watts-to-amps"
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
              href="/calculators/horsepower-to-amps"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Settings className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Horsepower to Amps</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Calculate motor current from horsepower ratings
              </p>
            </Link>

            <Link 
              href="/calculators/three-phase"
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
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Size conductors based on calculated current loads
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
                Size overcurrent protection for calculated loads
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
              href="https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">NFPA 70 (NEC)</span>
            </a>
            <a 
              href="https://www.ieee.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Calculator className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">IEEE Standards</span>
            </a>
            <a 
              href="https://www.nema.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Settings className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">NEMA Guidelines</span>
            </a>
            <a 
              href="https://www.eia.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Zap className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">US Energy Information</span>
            </a>
            <a 
              href="https://www.ul.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">UL Standards</span>
            </a>
            <a 
              href="https://www.iec.ch/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">IEC Standards</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}