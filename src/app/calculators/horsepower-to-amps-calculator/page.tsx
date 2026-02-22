import { Metadata } from 'next';
import { Suspense } from 'react';
import { HorsepowerToAmpsCalculator } from '@/components/calculators';
import { Settings, Calculator, TrendingUp, AlertCircle, BookOpen, Zap } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Horsepower to Amps Calculator | Motor Current Calculator | HP to Amperage',
  description: 'Professional horsepower to amps calculator for motor applications. Convert HP to amperage for single-phase and three-phase motors. NEC motor full load current tables included.',
  keywords: 'horsepower to amps, HP to amperage, motor current calculator, motor FLC calculator, NEC motor tables, electric motor sizing, motor circuit calculator',
  openGraph: {
    title: 'Horsepower to Amps Calculator - Motor Current Calculator',
    description: 'Convert horsepower to amps for motor applications. Single and three-phase motor current calculator with NEC tables.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/horsepower-to-amps-calculator',
  },
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "HP to Amps Converter",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Calculate electrical current from motor horsepower for proper circuit protection.",
  "keywords": "horsepower to amps, motor calculator, hp conversion",
  "url": `https://wiresizes.com/calculators/horsepower-to-amps-calculator`,
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

const horsepowerToAmpsFAQs = [
  {
    question: "How do I convert horsepower to amps for motors?",
    answer: "Motor current depends on horsepower, voltage, efficiency, and power factor. Use the formula: Amps = (HP × 746) ÷ (Voltage × Efficiency × Power Factor) for single-phase, or Amps = (HP × 746) ÷ (Voltage × 1.732 × Efficiency × Power Factor) for three-phase. However, the NEC requires using standardized full load current values from Tables 430.247-430.250, not calculated values."
  },
  {
    question: "Why use NEC motor tables instead of nameplate current?",
    answer: "NEC motor tables provide standardized full load current (FLC) values that are consistent across manufacturers and slightly conservative. Nameplate current can vary between manufacturers and may not include service factor. NEC 430.6(A)(1) requires using table values for conductor sizing, overload protection, and some motor control applications."
  },
  {
    question: "What's the difference between FLC and nameplate current?",
    answer: "Full Load Current (FLC) from NEC tables is standardized for each HP and voltage rating. Nameplate current is the actual current the specific motor draws and may be 10-15% lower than FLC. Use FLC for conductor sizing and overload protection per NEC 430, but nameplate current may be used for motor control circuit sizing and some protection devices."
  },
  {
    question: "How do I size conductors for motor circuits?",
    answer: "Size motor conductors at 125% of the motor's full load current from NEC tables. For a 10 HP, 460V three-phase motor with FLC of 14A: conductor ampacity must be at least 14A × 1.25 = 17.5A. This ensures conductors can handle continuous operation without overheating. Use NEC Table 310.16 to select the appropriate conductor size."
  },
  {
    question: "What about motor starting current?",
    answer: "Motor starting (inrush) current is typically 4-8 times the full load current and lasts 5-30 seconds. This affects voltage drop calculations and utility coordination but not steady-state conductor sizing. Some applications require reduced voltage starting or soft starters to limit inrush current. Consider starting current when calculating voltage drop for motor circuits."
  }
];

export default function HorsepowerToAmpsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FAQSchema 
        items={calculatorFAQs['horsepower-to-amps-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Horsepower to Amps Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Convert horsepower to amperage for motor applications. Professional tool for electrical 
              contractors and engineers with NEC motor full load current tables.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Settings className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">NEC Compliance</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Uses NEC motor tables for accurate full load current values per code requirements.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Calculator className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Motor Types</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Supports single-phase and three-phase motors with various voltage ratings.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Circuit Design</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Provides conductor sizing, protection requirements, and circuit calculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="mb-16">
        <Suspense fallback={<div>Loading calculator...</div>}>
          <HorsepowerToAmpsCalculator />
        </Suspense>
      </section>

      {/* Understanding Motor Current Calculations */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Understanding Motor Current Calculations
            </h2>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Converting horsepower to amperage is fundamental to motor circuit design. The National 
              Electrical Code provides standardized full load current tables that must be used for 
              conductor sizing, overload protection, and motor control applications, ensuring safe 
              and reliable motor installations.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Motor Power Relationships
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">Electrical Power Formula</h4>
                <div className="space-y-3 text-blue-700 dark:text-blue-300">
                  <div className="text-lg font-mono">P = 1.732 × V × I × PF × Eff</div>
                  <div className="text-sm">For three-phase motors:</div>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>P = Mechanical power output (watts)</li>
                    <li>V = Line voltage (volts)</li>
                    <li>I = Line current (amps)</li>
                    <li>PF = Power factor</li>
                    <li>Eff = Motor efficiency</li>
                  </ul>
                  <div className="text-sm font-medium mt-3">
                    1 HP = 746 watts (mechanical output)
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-3">Current Calculation</h4>
                <div className="space-y-3 text-green-700 dark:text-green-300">
                  <div className="text-lg font-mono">I = (HP × 746) ÷ (V × 1.732 × PF × Eff)</div>
                  <div className="text-sm">Rearranged for current:</div>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>Calculate electrical input power</li>
                    <li>Account for motor inefficiencies</li>
                    <li>Include power factor effects</li>
                    <li>Apply three-phase relationships</li>
                  </ul>
                  <div className="text-sm font-medium mt-3 text-red-600">
                    Note: Use NEC tables, not calculations
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              NEC Motor Current Tables
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The National Electrical Code provides standardized motor current tables that must be used 
              instead of calculated values for most applications. These tables are based on typical motor 
              characteristics and provide consistent values across different manufacturers.
            </p>
            
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">When to Use NEC Tables</h4>
                <ul className="list-disc pl-4 space-y-2 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li><strong>Conductor sizing:</strong> Always use table values per NEC 430.22</li>
                  <li><strong>Overload protection:</strong> Use table values per NEC 430.32</li>
                  <li><strong>Motor control circuits:</strong> May use nameplate or table values</li>
                  <li><strong>Short-circuit protection:</strong> Base calculations on table values</li>
                  <li><strong>Feeder calculations:</strong> Sum of table values per NEC 430.24</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-3">Table Locations in NEC</h4>
                <ul className="list-disc pl-4 space-y-2 text-orange-700 dark:text-orange-300 text-sm">
                  <li><strong>Table 430.247:</strong> Single-phase motors, 115V and 230V</li>
                  <li><strong>Table 430.248:</strong> Three-phase motors, 115V and 200V</li>
                  <li><strong>Table 430.249:</strong> Three-phase motors, 230V and 460V</li>
                  <li><strong>Table 430.250:</strong> Three-phase motors, 575V and 2300V</li>
                  <li><strong>Table 430.251(A):</strong> Multispeed motors</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-6">
              <h4 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">
                Important Code Requirements
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-red-700 dark:text-red-300 text-sm">
                <ul className="list-disc pl-4 space-y-1">
                  <li>NEC 430.6(A)(1): Use table FLC for most applications</li>
                  <li>NEC 430.22: Size conductors at 125% of table FLC</li>
                  <li>NEC 430.32: Size overloads based on table FLC</li>
                  <li>NEC 430.52: Size short-circuit protection from table FLC</li>
                </ul>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Exception: Nameplate current allowed for some applications</li>
                  <li>Motor control circuit sizing may use nameplate values</li>
                  <li>Special motor types may require manufacturer data</li>
                  <li>Energy efficient motors use same table values</li>
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
            Real-World Motor Current Calculations
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Example 1: Industrial Motor */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Industrial Pump Motor
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Motor Specifications:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    25 HP, three-phase, 460V motor for centrifugal pump application
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Motor Rating:</span> 25 HP, 460V, 3-phase
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">NEC Table:</span> 430.250 (460V, 3-phase motors)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Table FLC:</span> 34 amps
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Conductor Sizing:</span> 34A × 1.25 = 42.5A minimum
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Conductor Selection:</span> #8 AWG THWN (50A @ 75°C)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Overload Protection:</span> 34A × 1.15 = 39.1A maximum
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Short Circuit Protection:</span> 34A × 2.5 = 85A maximum (inverse time CB)
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: #8 AWG conductors, 39A overloads, 90A circuit breaker
                  </p>
                </div>
              </div>
            </div>

            {/* Example 2: Single Phase Motor */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <Calculator className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Single-Phase Compressor
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Motor Application:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    5 HP single-phase air compressor motor, 230V residential installation
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Motor Rating:</span> 5 HP, 230V, single-phase
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">NEC Table:</span> 430.247 (single-phase motors)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Table FLC:</span> 28 amps at 230V
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Conductor Sizing:</span> 28A × 1.25 = 35A minimum
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Conductor Selection:</span> #8 AWG (40A @ 60°C terminals)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Overload Protection:</span> 28A × 1.25 = 35A maximum (service factor ≥1.15)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Branch Circuit Protection:</span> 40A maximum (next standard size)
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: #8 AWG conductors, 35A overloads, 40A circuit breaker
                  </p>
                </div>
              </div>
            </div>

            {/* Example 3: High Voltage Motor */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  High Voltage Motor
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Large Motor Application:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    500 HP, 2300V three-phase motor for industrial process application
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Motor Rating:</span> 500 HP, 2300V, 3-phase
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">NEC Table:</span> 430.250 (2300V column)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Table FLC:</span> 130 amps
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Conductor Sizing:</span> 130A × 1.25 = 162.5A minimum
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Conductor Selection:</span> 4/0 AWG (230A @ 75°C)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Overload Protection:</span> 130A × 1.15 = 149.5A maximum
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Short Circuit Protection:</span> 130A × 2.5 = 325A maximum
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: 4/0 AWG conductors, 150A overloads, 350A circuit breaker
                  </p>
                </div>
              </div>
            </div>

            {/* Example 4: Variable Speed Drive */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  VFD Application
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">VFD System:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    75 HP motor with Variable Frequency Drive, 480V system
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Motor Rating:</span> 75 HP, 480V, 3-phase
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Table FLC:</span> 96 amps (NEC Table 430.250)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Input Conductors:</span> Size for VFD input rating
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">VFD Input Current:</span> Typically 96A × 1.1 = 106A
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Input Conductor Sizing:</span> 106A × 1.25 = 132.5A minimum
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Motor Conductors:</span> 96A × 1.25 = 120A minimum
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Protection:</span> Per VFD manufacturer requirements
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: #1 AWG input, #2 AWG motor conductors, per VFD manual
                  </p>
                </div>
              </div>
            </div>

            {/* Example 5: Motor Feeder Calculation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Multiple Motor Feeder Calculation
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Motor Load Summary:</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Feeder supplying multiple motors in industrial facility
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Motor 1:</span> 50 HP, 65A FLC
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Motor 2:</span> 30 HP, 40A FLC
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Motor 3:</span> 20 HP, 27A FLC
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Motor 4:</span> 15 HP, 21A FLC
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Motors 5-8:</span> 5 HP each, 7.6A FLC each
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">NEC 430.24 Calculation:</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Largest motor × 1.25 + Sum of other motors<br/>
                      = (65A × 1.25) + (40 + 27 + 21 + 30.4)A<br/>
                      = 81.25A + 118.4A = 199.65A
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Feeder Requirements:</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Minimum feeder ampacity: 200A<br/>
                      Conductor: 4/0 AWG (230A @ 75°C)<br/>
                      Protection: 225A circuit breaker
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Additional Considerations:</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      • Consider demand factors if applicable<br/>
                      • Check voltage drop at full load<br/>
                      • Verify starting current coordination
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEC Motor Tables */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            NEC Motor Full Load Current Tables
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Three-Phase Motors - 460V */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Three-Phase Motors - 460V (NEC Table 430.250)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        HP Rating
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Full Load Amps
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1/2</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.1</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">3/4</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.6</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2.1</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1-1/2</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">3.0</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">3.9</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">3</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">5.7</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">5</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">7.6</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">7-1/2</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">11</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">10</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">14</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">15</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">21</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">20</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">27</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">25</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">34</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">30</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">40</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">40</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">52</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">50</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">65</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">60</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">77</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">75</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">96</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">100</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">124</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Single-Phase Motors - 230V */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Single-Phase Motors - 230V (NEC Table 430.247)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        HP Rating
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Full Load Amps
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1/6</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">4.4</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1/4</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">5.8</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1/3</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">7.2</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1/2</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">9.8</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">3/4</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">13.8</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">16</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1-1/2</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">20</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">24</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">3</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">34</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">5</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">56</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">7-1/2</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">80</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">10</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">100</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> For 115V motors, multiply the 230V values by 2. Single-phase 
                  motors above 10 HP are uncommon in standard applications due to starting current 
                  and utility limitations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motor Circuit Components */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Motor Circuit Components and Sizing
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-blue-600" />
                  Conductor Sizing (NEC 430.22)
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Single Motor:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Size at 125% of table FLC minimum</li>
                      <li>• Use NEC Table 310.16 for ampacity</li>
                      <li>• Consider terminal temperature ratings</li>
                      <li>• Apply derating factors if applicable</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Multiple Motors:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Largest motor × 125% + sum of others</li>
                      <li>• Each motor circuit sized individually</li>
                      <li>• Consider demand factors if applicable</li>
                      <li>• Size feeder overcurrent protection</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Settings className="h-6 w-6 text-purple-600" />
                  Overload Protection (NEC 430.32)
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sizing Requirements:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Service Factor ≥1.15: 125% of table FLC</li>
                      <li>• Service Factor &lt;1.15: 115% of table FLC</li>
                      <li>• Temperature rise ≤40°C: 125% of table FLC</li>
                      <li>• Temperature rise &gt;40°C: 115% of table FLC</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Types Available:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Thermal overload relays (bimetal)</li>
                      <li>• Electronic overload relays</li>
                      <li>• Fuses (time-delay type required)</li>
                      <li>• Circuit breakers with overload trip</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Zap className="h-6 w-6 text-orange-600" />
                  Short-Circuit Protection (NEC 430.52)
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Protection Types and Percentages:</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-300 dark:border-gray-600">
                            <th className="text-left py-2 text-gray-900 dark:text-white">Type</th>
                            <th className="text-left py-2 text-gray-900 dark:text-white">Single Phase</th>
                            <th className="text-left py-2 text-gray-900 dark:text-white">3 Phase</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 dark:text-gray-300">
                          <tr><td className="py-1">Inverse Time CB</td><td>250%</td><td>250%</td></tr>
                          <tr><td className="py-1">Instantaneous Trip CB</td><td>800%</td><td>800%</td></tr>
                          <tr><td className="py-1">Time-Delay Fuse</td><td>175%</td><td>175%</td></tr>
                          <tr><td className="py-1">Non-Time-Delay Fuse</td><td>300%</td><td>300%</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Special Considerations:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Next standard size up allowed if calculated size doesn't trip motor</li>
                      <li>• Design E motors may require reduced percentages</li>
                      <li>• Torque motors have special requirements</li>
                      <li>• Consider coordination with downstream devices</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  Motor Control Requirements
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Disconnect Requirements:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Within sight of motor and controller</li>
                      <li>• Rated at least 115% of table FLC</li>
                      <li>• Must open all ungrounded conductors</li>
                      <li>• Lockable in open position</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Controller Sizing:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Size for motor nameplate or table FLC</li>
                      <li>• Must match motor horsepower rating</li>
                      <li>• Consider starting method requirements</li>
                      <li>• Verify interrupting capacity</li>
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
                  Critical NEC Requirements
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Always use NEC table FLC values, not nameplate current, for most applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Size conductors at 125% of table FLC for continuous duty motors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Provide both overload and short-circuit/ground-fault protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Install disconnecting means within sight of motor and controller</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Consider voltage drop effects on motor performance</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Motor Safety Considerations
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Starting Current:</span>
                    <span className="text-gray-800 dark:text-gray-200">4-8× FLC for 5-30 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Service Factor:</span>
                    <span className="text-gray-800 dark:text-gray-200">Affects overload sizing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ambient Temperature:</span>
                    <span className="text-gray-800 dark:text-gray-200">Consider derating factors</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duty Cycle:</span>
                    <span className="text-gray-800 dark:text-gray-200">Continuous, intermittent, or varying</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Installation Best Practices
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Verify motor nameplate data matches NEC table assumptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Test overload settings after installation and under load</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Consider power quality effects on motor current</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Plan for motor maintenance and replacement accessibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Document motor circuit design for future reference</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Professional Disclaimer
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This calculator provides guidance based on NEC requirements and typical motor 
                  characteristics. Actual installations may require additional considerations for 
                  specific motors, applications, or local code requirements. Always verify motor 
                  nameplate data and consult qualified professionals for motor circuit design.
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
            {horsepowerToAmpsFAQs.map((faq, index) => (
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Related Electrical Calculators
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/calculators/kilowatts-to-amps-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Calculator className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kilowatts to Amps</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Convert kilowatts to amperage for power calculations
              </p>
            </Link>
            
            <Link 
              href="/calculators/motor-circuit"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Settings className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Motor Circuit Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Complete motor circuit design and component sizing
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
                Size conductors based on motor current requirements
              </p>
            </Link>

            <Link 
              href="/calculators/voltage-drop-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Voltage Drop Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Calculate voltage drop for motor circuits
              </p>
            </Link>

            <Link 
              href="/calculators/circuit-breaker-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Circuit Breaker Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Size overcurrent protection for motor circuits
              </p>
            </Link>

            <Link 
              href="/calculators/three-phase"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Three Phase Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Three-phase power and motor calculations
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
              href="https://www.nema.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Settings className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">NEMA Motor Standards</span>
            </a>
            <a 
              href="https://www.ieee.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Calculator className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">IEEE Standards</span>
            </a>
            <a 
              href="https://www.iec.ch/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Zap className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">IEC Motor Standards</span>
            </a>
            <a 
              href="https://www.ul.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">UL Motor Safety</span>
            </a>
            <a 
              href="https://www.energy.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Energy Efficiency</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}