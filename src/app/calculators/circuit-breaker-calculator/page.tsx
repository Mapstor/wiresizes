import { Metadata } from 'next';
import { Suspense } from 'react';
import { CircuitBreakerCalculator } from '@/components/calculators';
import { Shield, Calculator, TrendingUp, AlertCircle, BookOpen, Zap } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Circuit Breaker Calculator | Breaker Size Calculator | NEC Breaker Sizing',
  description: 'Professional circuit breaker calculator for electrical contractors and engineers. Calculate proper breaker size per NEC code requirements. Includes motor, continuous load, and OCPD sizing calculations.',
  keywords: 'circuit breaker calculator, breaker sizing, NEC breaker requirements, overcurrent protection, electrical breaker, OCPD calculator, motor breaker sizing, continuous load breaker',
  openGraph: {
    title: 'Circuit Breaker Calculator - NEC Compliant Breaker Sizing Tool',
    description: 'Calculate proper circuit breaker size per NEC requirements. Motor, continuous load, and standard circuit breaker sizing calculator.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/circuit-breaker-calculator',
  },
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Circuit Breaker Size Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Determine proper circuit breaker size for electrical loads and wire protection.",
  "keywords": "circuit breaker sizing, overcurrent protection, electrical protection",
  "url": `https://wiresizes.com/calculators/circuit-breaker-calculator`,
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

const circuitBreakerFAQs = [
  {
    question: "How do I calculate the correct circuit breaker size?",
    answer: "Circuit breaker sizing depends on the load type. For general loads, use 125% of continuous loads plus 100% of non-continuous loads. For motor circuits, use 250% of motor full load current per NEC 430.52. The breaker must protect the wire (not exceed wire ampacity) while allowing proper operation of the load."
  },
  {
    question: "What is the 80% rule for circuit breakers?",
    answer: "The 80% rule (NEC 210.20) states that continuous loads cannot exceed 80% of the circuit breaker rating unless the breaker is listed for 100% continuous operation. For example, a 20A breaker can only handle 16A of continuous load. This prevents nuisance tripping and ensures safe operation."
  },
  {
    question: "How do I size a breaker for motor circuits?",
    answer: "Motor circuit breakers are sized at 250% of the motor's full load current per NEC Table 430.52(C)(1) for inverse time breakers. For a 10A motor: 10 × 2.5 = 25A maximum. You can use the next standard size up if the calculated size isn't available. This provides short-circuit protection while allowing motor starting current."
  },
  {
    question: "What's the difference between OCPD and overload protection?",
    answer: "OCPD (overcurrent protective device) like circuit breakers protect against short circuits and ground faults with fast tripping. Overload protection (like motor overloads) protect against sustained overcurrent with time delay. Motors need both: OCPD for fault protection and overloads for thermal protection."
  },
  {
    question: "Can I use a larger breaker if the calculated size isn't available?",
    answer: "You can use the next standard size larger than calculated, but only if it doesn't exceed the wire's ampacity. NEC 240.4(B) allows this exception. However, for motor circuits, you cannot exceed the maximums in NEC 430.52 without engineering approval. Always verify the wire can handle the breaker size."
  }
];

export default function CircuitBreakerCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FAQSchema 
        items={calculatorFAQs['circuit-breaker-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Circuit Breaker Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Calculate proper circuit breaker sizes per NEC requirements. Professional tool for contractors, 
              engineers, and electricians for safe electrical installations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">NEC Compliant</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Calculations follow NEC 240.4, 430.52, and 210.20 requirements for proper overcurrent protection.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Calculator className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multiple Load Types</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Handles general loads, continuous loads, motor circuits, and combination loads.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <TrendingUp className="h-12 w-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professional Results</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Provides maximum breaker size, wire compatibility checks, and NEC code references.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="mb-16">
        <Suspense fallback={<div>Loading calculator...</div>}>
          <CircuitBreakerCalculator />
        </Suspense>
      </section>

      {/* Understanding Circuit Breaker Sizing */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Understanding Circuit Breaker Sizing
            </h2>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Proper circuit breaker sizing is critical for electrical safety and code compliance. Circuit breakers 
              serve as overcurrent protective devices (OCPD) that protect conductors and equipment from damage due 
              to excessive current flow. Understanding NEC requirements and calculation methods ensures safe, 
              reliable electrical installations.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              NEC Requirements for Circuit Breaker Sizing
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The National Electrical Code establishes specific requirements for overcurrent protection sizing:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li><strong>NEC 240.4(B):</strong> Overcurrent devices shall not exceed the ampacity of conductors</li>
              <li><strong>NEC 210.20:</strong> Continuous loads limited to 80% of breaker rating</li>
              <li><strong>NEC 430.52:</strong> Motor circuit short-circuit protection requirements</li>
              <li><strong>NEC 240.6:</strong> Standard ampere ratings for overcurrent devices</li>
              <li><strong>NEC 240.83:</strong> Requirements for marking and identification</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Load Classification for Breaker Sizing
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">Continuous Loads</h4>
                <p className="text-blue-700 dark:text-blue-300 mb-3">
                  Loads expected to operate for 3 hours or more at maximum current:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-blue-700 dark:text-blue-300">
                  <li>Commercial lighting systems</li>
                  <li>HVAC equipment</li>
                  <li>Some motor applications</li>
                  <li>Electric heating systems</li>
                </ul>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-3 font-medium">
                  Formula: Breaker Size ≥ Continuous Load ÷ 0.8
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-3">Non-Continuous Loads</h4>
                <p className="text-green-700 dark:text-green-300 mb-3">
                  Loads operating less than 3 hours at maximum current:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-green-700 dark:text-green-300">
                  <li>Residential outlets</li>
                  <li>Intermittent equipment</li>
                  <li>Short-duty motors</li>
                  <li>Temporary installations</li>
                </ul>
                <p className="text-sm text-green-600 dark:text-green-400 mt-3 font-medium">
                  Formula: Breaker Size = Load Current Rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Examples Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Real-World Circuit Breaker Sizing Examples
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Example 1: Commercial Lighting */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Commercial LED Lighting Circuit
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Office building LED lighting panel with 45A continuous load at 277V
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Load Type:</span> Continuous (&gt;3 hours operation)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">NEC Requirement:</span> 125% of continuous load (NEC 210.20)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Calculation:</span> 45A ÷ 0.8 = 56.25A minimum
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Standard Size:</span> 60A breaker (next standard size up)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Wire Required:</span> Minimum #6 AWG (65A ampacity at 75°C)
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: 60A breaker protects #6 AWG conductors for 45A continuous lighting load
                  </p>
                </div>
              </div>
            </div>

            {/* Example 2: Motor Circuit */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Three-Phase Motor Circuit
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    20 HP, 480V three-phase motor with 27A full load current
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Motor FLC:</span> 27A (from NEC Table 430.250)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Breaker Sizing:</span> 250% of FLC (NEC 430.52)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Calculation:</span> 27A × 2.5 = 67.5A maximum
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Standard Size:</span> 70A breaker (next size up)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Conductor Sizing:</span> 125% of FLC = 33.75A minimum
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Wire Required:</span> #8 AWG (50A ampacity)
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: 70A breaker with #8 AWG conductors and motor overload protection
                  </p>
                </div>
              </div>
            </div>

            {/* Example 3: Mixed Load Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                  <Calculator className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Mixed Load Feeder Circuit
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Panel feeder: 60A continuous + 40A non-continuous loads
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Continuous Load:</span> 60A (lighting, HVAC)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Non-Continuous:</span> 40A (outlets, intermittent equipment)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Calculation:</span> (60A ÷ 0.8) + 40A = 115A
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Standard Size:</span> 125A breaker
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Wire Required:</span> #1 AWG (130A ampacity at 75°C)
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: 125A main breaker with #1 AWG feeder conductors
                  </p>
                </div>
              </div>
            </div>

            {/* Example 4: Water Heater Circuit */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Electric Water Heater Circuit
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    4500W, 240V residential electric water heater
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Load Current:</span> 4500W ÷ 240V = 18.75A
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Load Type:</span> Continuous (operates &gt;3 hours)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Calculation:</span> 18.75A ÷ 0.8 = 23.4A minimum
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Standard Size:</span> 25A breaker (next standard size)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Wire Required:</span> #10 AWG (30A ampacity at 60°C)
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: 25A 2-pole breaker with #10 AWG conductors
                  </p>
                </div>
              </div>
            </div>

            {/* Example 5: Restaurant Equipment */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Commercial Kitchen Equipment Circuit
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Commercial oven: 15kW, 208V three-phase, operates continuously during service hours
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Load Current:</span> 15,000W ÷ (208V × 1.732) = 41.7A
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Load Classification:</span> Continuous load
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Breaker Calculation:</span> 41.7A ÷ 0.8 = 52.1A
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Final Sizing:</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">60A 3-pole breaker (standard size)</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Conductor Requirements:</p>
                    <p className="text-sm text-green-700 dark:text-green-300">#6 AWG THHN (65A ampacity)</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">Additional Requirements:</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">Equipment grounding conductor and disconnect switch within sight</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEC Reference Tables */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            NEC Reference Tables for Circuit Breaker Sizing
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Standard Breaker Sizes */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Standard Circuit Breaker Sizes (NEC 240.6)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Ampere Rating
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Common Applications
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">15A, 20A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Branch circuits, outlets</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">25A, 30A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Water heaters, dryers</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">40A, 50A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Ranges, large appliances</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">60A, 70A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Subpanels, large motors</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">80A, 90A, 100A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Service entrance, feeders</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">110A, 125A, 150A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Large feeders, services</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">175A, 200A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Main service panels</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">225A, 250A, 300A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Large commercial services</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Motor Circuit Protection */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Motor Circuit Protection (NEC Table 430.52)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Protection Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Single Phase
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        3-Phase
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Inverse Time Breaker</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">250%</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">250%</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Instantaneous Trip</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">800%</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">800%</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Inverse Time w/MCP</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">150%</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">150%</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Fuse - Non-Time Delay</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">300%</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">300%</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Fuse - Time Delay</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">175%</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">175%</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Note:</strong> Percentages are based on motor full load current (FLC) from NEC Tables 430.247-430.250. 
                  If calculated value doesn't match standard size, next larger size may be used up to maximum percentage.
                </p>
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
              Safety and Code Compliance Requirements
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Critical Safety Considerations
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Never exceed conductor ampacity when sizing circuit breakers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Ensure proper coordination between breaker size and equipment ratings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Consider ambient temperature derating factors for conductors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Verify interrupting capacity matches available fault current</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Motor circuits require both short-circuit protection and overload protection</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  NEC Article References
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Article 240:</span>
                    <span className="text-gray-800 dark:text-gray-200">Overcurrent Protection</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Article 210:</span>
                    <span className="text-gray-800 dark:text-gray-200">Branch Circuits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Article 430:</span>
                    <span className="text-gray-800 dark:text-gray-200">Motors and Controllers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Article 310:</span>
                    <span className="text-gray-800 dark:text-gray-200">Conductors</span>
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
                    <span>Label all circuit breakers clearly and accurately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Use appropriate breaker type for the application (GFCI, AFCI, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Maintain proper torque specifications on terminations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Consider future load growth when sizing feeders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Ensure adequate short-circuit current rating (SCCR)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Professional Disclaimer
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This calculator provides estimates based on NEC requirements. Always consult local codes, 
                  manufacturer specifications, and qualified electrical professionals. Electrical work should 
                  only be performed by licensed electricians in accordance with applicable codes and regulations.
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
            {circuitBreakerFAQs.map((faq, index) => (
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
              href="/calculators/wire-size-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Calculator className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wire Size Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Calculate proper conductor size for circuits and feeders
              </p>
            </Link>
            
            <Link 
              href="/calculators/voltage-drop-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Voltage Drop Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Calculate voltage drop over distance for electrical circuits
              </p>
            </Link>

            <Link 
              href="/calculators/ampacity-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ampacity Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Determine wire current carrying capacity with derating
              </p>
            </Link>

            <Link 
              href="/calculators/conduit-fill"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Conduit Fill Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Calculate conduit fill percentage per NEC requirements
              </p>
            </Link>

            <Link 
              href="/calculators/motor-circuit"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Motor Circuit Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Size conductors and protection for motor circuits
              </p>
            </Link>

            <Link 
              href="/calculators/ground-wire-size"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ground Wire Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Calculate equipment grounding conductor size
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Authority Links */}
      <section className="mb-16">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Professional Resources and References
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
              href="https://www.eia.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Zap className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">US Energy Information</span>
            </a>
            <a 
              href="https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.95"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Shield className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">OSHA Electrical Safety</span>
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
              href="https://www.ul.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">UL Standards</span>
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