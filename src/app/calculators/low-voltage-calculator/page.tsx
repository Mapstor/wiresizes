import { Metadata } from 'next';
import { Suspense } from 'react';
import { LowVoltageCalculator } from '@/components/calculators';
import { Battery, Calculator, TrendingUp, AlertCircle, BookOpen, Zap } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Low Voltage Calculator | 12V 24V DC Wire Size Calculator | Marine Automotive',
  description: 'Professional low voltage DC wire calculator for 12V and 24V systems. Calculate wire size for automotive, marine, solar, and RV applications. Includes voltage drop calculations.',
  keywords: 'low voltage calculator, 12v wire size, 24v dc calculator, automotive wire size, marine electrical, solar panel wiring, RV electrical, battery cable sizing',
  openGraph: {
    title: 'Low Voltage Calculator - 12V 24V DC Wire Size Calculator',
    description: 'Calculate wire size for low voltage DC systems. Automotive, marine, solar, and RV wire sizing calculator.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/low-voltage-calculator',
  },
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Low Voltage Wire Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Calculate wire size for low voltage systems including landscape and LED lighting.",
  "keywords": "low voltage wiring, landscape lighting, LED wire sizing",
  "url": `https://wiresizes.com/calculators/low-voltage-calculator`,
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

const lowVoltageFAQs = [
  {
    question: "How do I calculate wire size for 12V DC circuits?",
    answer: "For 12V DC circuits, wire size depends on current draw and distance. Use the formula: Wire Gauge = (Current × Distance × 2) ÷ (Voltage Drop × 12V). For example, a 20A load over 10 feet with 3% voltage drop requires: (20 × 10 × 2) ÷ (0.36V) = #10 AWG minimum. Low voltage systems require larger wire sizes due to higher current."
  },
  {
    question: "What voltage drop is acceptable for low voltage DC systems?",
    answer: "For critical systems like navigation equipment, limit voltage drop to 3%. For general lighting and accessories, 5% is typically acceptable. However, some sensitive electronics may require less than 3%. Calculate actual voltage drop: VD = (Current × Distance × 2 × Resistance per foot) ÷ 1000."
  },
  {
    question: "Why are wire sizes larger in low voltage DC systems?",
    answer: "Low voltage DC systems carry much higher current for the same power level. Power = Voltage × Current, so at 12V instead of 120V, you need 10 times the current. For example, a 120W load requires 10A at 12V but only 1A at 120V. Higher current requires larger conductors to prevent excessive voltage drop and heat."
  },
  {
    question: "How do I size battery cables for automotive applications?",
    answer: "Battery cables must handle starter motor current, typically 150-400A depending on engine size. Use minimum #4 AWG for small engines, #2 AWG for mid-size, and #1/0 AWG for large engines. Keep positive and negative cables the same size and as short as possible. Consider upgrading to larger cables for performance applications."
  },
  {
    question: "What's different about marine low voltage wiring?",
    answer: "Marine wiring requires tinned copper conductors and appropriate insulation for marine environments. ABYC standards require larger wire sizes than automotive due to safety considerations. All connections must be waterproof, and circuits should have proper overcurrent protection. Use marine-grade wire rated for the environment (engine room, bilge, etc.)."
  }
];

export default function LowVoltageCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FAQSchema 
        items={calculatorFAQs['low-voltage-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Low Voltage Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Calculate wire sizes for 12V and 24V DC systems. Professional tool for automotive, 
              marine, solar, and RV electrical applications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Battery className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">DC Power Systems</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Specialized calculations for 12V, 24V, and 48V DC electrical systems.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Calculator className="h-12 w-12 text-cyan-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multiple Applications</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automotive, marine, solar, RV, and off-grid system wire sizing.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Precision Results</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Accurate wire sizing with voltage drop calculations and safety factors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="mb-16">
        <Suspense fallback={<div>Loading calculator...</div>}>
          <LowVoltageCalculator />
        </Suspense>
      </section>

      {/* Understanding Low Voltage Systems */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Understanding Low Voltage DC Systems
            </h2>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Low voltage DC systems operate at voltages below 50V DC and are commonly found in automotive, 
              marine, solar, and mobile applications. Unlike AC systems, DC power flows in one direction and 
              requires different calculations and considerations for proper wire sizing and system design.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Key Characteristics of Low Voltage DC Systems
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">Higher Current Requirements</h4>
                <p className="text-blue-700 dark:text-blue-300 mb-3">
                  Low voltage systems require much higher current to deliver the same power:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  <li>120W load at 12V = 10A current</li>
                  <li>120W load at 120V = 1A current</li>
                  <li>Higher current = larger wire requirements</li>
                  <li>More critical voltage drop considerations</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-3">Voltage Drop Sensitivity</h4>
                <p className="text-green-700 dark:text-green-300 mb-3">
                  Small voltage drops have large percentage impacts:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>1V drop in 12V system = 8.3% loss</li>
                  <li>1V drop in 120V system = 0.83% loss</li>
                  <li>Critical for equipment operation</li>
                  <li>Affects battery life and performance</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Common Low Voltage Applications
            </h3>
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">Automotive Systems</h4>
                <ul className="list-disc pl-4 space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>Engine control modules</li>
                  <li>Lighting circuits</li>
                  <li>Audio/entertainment systems</li>
                  <li>Charging systems</li>
                  <li>Starter motor circuits</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">Marine Electronics</h4>
                <ul className="list-disc pl-4 space-y-1 text-purple-700 dark:text-purple-300 text-sm">
                  <li>Navigation equipment</li>
                  <li>Radio communications</li>
                  <li>Fish finders/sonar</li>
                  <li>Bilge pumps</li>
                  <li>Cabin lighting</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-3">Solar/RV Systems</h4>
                <ul className="list-disc pl-4 space-y-1 text-orange-700 dark:text-orange-300 text-sm">
                  <li>Solar panel wiring</li>
                  <li>Battery bank connections</li>
                  <li>Inverter DC connections</li>
                  <li>LED lighting systems</li>
                  <li>DC appliances</li>
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
            Real-World Low Voltage Wiring Examples
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Example 1: Automotive Amplifier */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Car Audio Amplifier Installation
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    1000W amplifier at 12V, 15-foot run from battery to trunk
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Current Draw:</span> 1000W ÷ 12V = 83.3A
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Distance:</span> 15 feet one way (30 feet total)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Voltage Drop Target:</span> 3% = 0.36V
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Wire Calculation:</span> (83.3A × 30ft) ÷ 0.36V = 6,942 CM
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Required Wire:</span> #4 AWG (41,740 CM)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Fuse Size:</span> 100A ANL fuse at battery
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: #4 AWG power and ground wires with 100A fuse protection
                  </p>
                </div>
              </div>
            </div>

            {/* Example 2: Marine Electronics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg">
                  <Battery className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Marine Navigation System
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    GPS chartplotter: 5A at 12V, 25-foot run from battery
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Current Draw:</span> 5A continuous
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Distance:</span> 25 feet (50 feet total run)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Voltage Drop Target:</span> 3% (critical equipment)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Wire Calculation:</span> (5A × 50ft) ÷ 0.36V = 694 CM
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">ABYC Requirement:</span> Minimum #14 AWG for 5A load
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Wire Type:</span> Tinned copper, marine grade
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Protection:</span> 7.5A fuse or circuit breaker
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: #12 AWG tinned marine wire with 7.5A protection
                  </p>
                </div>
              </div>
            </div>

            {/* Example 3: Solar Panel Wiring */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Solar Panel DC Wiring
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    400W solar array at 12V, 40-foot run to charge controller
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Panel Output:</span> 400W ÷ 12V = 33.3A maximum
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Safety Factor:</span> 33.3A × 1.25 = 41.6A
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Distance:</span> 40 feet (80 feet total)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Voltage Drop Target:</span> 2% = 0.24V
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Wire Calculation:</span> (33.3A × 80ft) ÷ 0.24V = 11,100 CM
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Required Wire:</span> #10 AWG (10,380 CM) minimum
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Recommended:</span> #8 AWG for safety margin
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: #8 AWG DC wire with 50A breaker protection
                  </p>
                </div>
              </div>
            </div>

            {/* Example 4: RV Battery Bank */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <Calculator className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  RV House Battery Connection
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    3000W inverter connection, 4 feet from battery bank
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Inverter Draw:</span> 3000W ÷ 12V = 250A
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Distance:</span> 4 feet (8 feet total)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Voltage Drop Target:</span> 3% = 0.36V
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Wire Calculation:</span> (250A × 8ft) ÷ 0.36V = 5,556 CM
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Required Wire:</span> Multiple #4/0 AWG or bus bars
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Alternative:</span> (2) #2/0 AWG in parallel
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Protection:</span> 300A DC breaker or fuse
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Result: #4/0 AWG cables or (2) #2/0 AWG parallel with 300A protection
                  </p>
                </div>
              </div>
            </div>

            {/* Example 5: LED Light Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Off-Road LED Light Bar Installation
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Scenario:</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    42" LED light bar: 240W at 12V, 20-foot run with relay control
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Current Draw:</span> 240W ÷ 12V = 20A
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Distance:</span> 20 feet (40 feet total)
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Voltage Drop Target:</span> 5% = 0.6V
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Wire Calculation:</span> (20A × 40ft) ÷ 0.6V = 1,333 CM
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Power Circuit:</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">#12 AWG (relay to light bar)</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Control Circuit:</p>
                    <p className="text-sm text-green-700 dark:text-green-300">#18 AWG (switch to relay)</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">Protection:</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">25A fuse, 40A relay</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wire Sizing Reference Tables */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Low Voltage Wire Sizing Reference Tables
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* 12V Current Capacity */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                12V DC Current Capacity (3% Voltage Drop)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Wire Size
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        10 ft
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        20 ft
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        30 ft
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#18 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2.4A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.2A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">0.8A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#16 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">3.7A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.9A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.2A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#14 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">5.9A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2.9A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2.0A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#12 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">9.3A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">4.6A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">3.1A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#10 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">14.7A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">7.4A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">4.9A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#8 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">23.6A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">11.8A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">7.9A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#6 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">37.3A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">18.6A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">12.4A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#4 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">59.3A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">29.6A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">19.8A</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 24V Current Capacity */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                24V DC Current Capacity (3% Voltage Drop)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Wire Size
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        10 ft
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        20 ft
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        30 ft
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#18 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">4.8A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2.4A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1.6A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#16 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">7.4A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">3.7A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2.5A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#14 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">11.8A</td><td className="px-4 py-3 text-sm text-gray-gray-300">5.9A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">3.9A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#12 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">18.6A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">9.3A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">6.2A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#10 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">29.4A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">14.7A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">9.8A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#8 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">47.2A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">23.6A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">15.7A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#6 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">74.6A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">37.3A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">24.9A</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">#4 AWG</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">118.6A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">59.3A</td><td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">39.5A</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application-Specific Guidelines */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Application-Specific Wiring Guidelines
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Battery className="h-6 w-6 text-blue-600" />
                  Automotive Wiring Standards
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">SAE Standards:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use SAE J1128 rated automotive wire</li>
                      <li>• Temperature rating: -40°F to +200°F</li>
                      <li>• Voltage rating: 50V or higher for 12V systems</li>
                      <li>• Cross-linked polyethylene (XLPE) insulation preferred</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Protection Requirements:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Fuse within 18" of battery positive</li>
                      <li>• Use weatherproof fuse holders</li>
                      <li>• Ground connections to chassis or dedicated ground</li>
                      <li>• Protect wiring from heat, sharp edges, and moisture</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Zap className="h-6 w-6 text-cyan-600" />
                  Marine Electrical Standards
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">ABYC Requirements:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use tinned copper conductors only</li>
                      <li>• Marine-grade adhesive-lined heat shrink</li>
                      <li>• Voltage drop limited to 10% for lighting, 3% for electronics</li>
                      <li>• All connections above bilge level when possible</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Environmental Considerations:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use proper wire support every 18" maximum</li>
                      <li>• Seal all penetrations through bulkheads</li>
                      <li>• Route wiring away from bilge and exhaust</li>
                      <li>• Label all circuits at panel and connections</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                  Solar/Off-Grid Systems
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">NEC Article 690:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use THWN-2 or USE-2 for outdoor wiring</li>
                      <li>• Size conductors for 125% of maximum current</li>
                      <li>• Provide disconnects within sight of equipment</li>
                      <li>• Use properly rated DC circuit breakers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">System Design:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Keep DC wiring runs as short as possible</li>
                      <li>• Use MC4 connectors for panel connections</li>
                      <li>• Install proper grounding electrode system</li>
                      <li>• Consider rapid shutdown requirements</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-purple-600" />
                  RV/Mobile Applications
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">RVIA Standards:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use stranded copper wire for flexibility</li>
                      <li>• Secure wiring every 4.5 feet maximum</li>
                      <li>• Protect against vibration and movement</li>
                      <li>• Use appropriate connector types for environment</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Installation Practices:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Route wiring through protected raceways</li>
                      <li>• Use service loops at moving connections</li>
                      <li>• Install battery disconnect in accessible location</li>
                      <li>• Provide adequate ventilation for batteries</li>
                    </ul>
                  </div>
                </div>
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
              Low Voltage Safety and Best Practices
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
                    <span>High current in low voltage systems can cause fires and equipment damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Always use proper fuse or breaker protection near the power source</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Ensure all connections are tight to prevent arcing and heat buildup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Use appropriate wire insulation for the environment and temperature</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Protect wiring from physical damage, heat, and moisture</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Wire Selection Guidelines
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Copper vs Aluminum:</span>
                    <span className="text-gray-800 dark:text-gray-200">Always use copper for DC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Stranding:</span>
                    <span className="text-gray-800 dark:text-gray-200">Use stranded for flexibility</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Insulation:</span>
                    <span className="text-gray-800 dark:text-gray-200">Match environment requirements</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Temperature Rating:</span>
                    <span className="text-gray-800 dark:text-gray-200">Consider ambient + I²R heating</span>
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
                    <span>Use proper crimp connectors and tools for all connections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Apply dielectric grease to outdoor connections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Label all wiring for future maintenance and troubleshooting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Plan for thermal expansion in long wire runs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Test all circuits before energizing the complete system</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Professional Disclaimer
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This calculator provides estimates for DC low voltage systems. Always consult manufacturer 
                  specifications, applicable codes, and qualified professionals. Installation should comply with 
                  local electrical codes, manufacturer requirements, and industry standards.
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
            {lowVoltageFAQs.map((faq, index) => (
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
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
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
                Calculate voltage drop for AC and DC circuits
              </p>
            </Link>
            
            <Link 
              href="/calculators/wire-size-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Calculator className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wire Size Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Determine proper wire size for electrical circuits
              </p>
            </Link>

            <Link 
              href="/calculators/ohms-law"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ohms Law Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Calculate voltage, current, resistance, and power
              </p>
            </Link>

            <Link 
              href="/calculators/watts-to-amps"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Battery className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Watts to Amps</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Convert watts to amperage for power calculations
              </p>
            </Link>

            <Link 
              href="/calculators/ampacity-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ampacity Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Determine wire current carrying capacity
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
                Size circuit breakers for electrical protection
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
              href="https://www.abycinc.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">ABYC Marine Standards</span>
            </a>
            <a 
              href="https://www.sae.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Battery className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">SAE Automotive Standards</span>
            </a>
            <a 
              href="https://www.rvia.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">RVIA RV Standards</span>
            </a>
            <a 
              href="https://www.nrel.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Zap className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">NREL Solar Resources</span>
            </a>
            <a 
              href="https://www.ieee.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Calculator className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">IEEE Standards</span>
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