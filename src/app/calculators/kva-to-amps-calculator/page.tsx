import { Metadata } from 'next';
import { Suspense } from 'react';
import { KVAToAmpsCalculator } from '@/components/calculators';
import { Zap, Calculator, TrendingUp, AlertCircle, BookOpen, Shield } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'kVA to Amps Calculator | Convert Kilovolt-Amperes to Amperage | Transformer Sizing',
  description: 'Professional kVA to amps calculator for electrical engineers and contractors. Convert kilovolt-amperes to amperage for single-phase and three-phase systems with power factor correction. NEC compliant transformer and generator sizing.',
  keywords: 'kva to amps, kilovolt amperes to amperage, transformer calculator, apparent power conversion, three phase kva, generator sizing, power factor calculator, electrical load calculator',
  openGraph: {
    title: 'kVA to Amps Calculator - Professional Electrical Conversion Tool',
    description: 'Convert kVA to amps for transformers, generators, and electrical equipment. Single and three-phase calculations with power factor.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/kva-to-amps',
  },
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "kVA to Amps Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Convert kilovolt-amperes to amperage for transformer and generator sizing.",
  "keywords": "kVA to amps, apparent power, transformer sizing",
  "url": `https://wiresizes.com/calculators/kva-to-amps-calculator`,
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

const kvaToAmpsFAQs = [
  {
    question: "What is kVA and how does it relate to amps?",
    answer: "kVA (kilovolt-amperes) is a unit of apparent power in electrical systems. It represents the total power (both real and reactive) in an AC circuit. To convert kVA to amps, you divide the kVA by the voltage and multiply by 1000. For three-phase systems, you also divide by √3 (1.732). The relationship is: Amps = (kVA × 1000) / (Voltage × √3 for 3-phase)."
  },
  {
    question: "How do I calculate amps from kVA for a three-phase transformer?",
    answer: "For a three-phase transformer: Amps = (kVA × 1000) / (Voltage × 1.732). For example, a 500 kVA transformer at 480V three-phase: Amps = (500 × 1000) / (480 × 1.732) = 601.4 amps. This gives you the full load current rating of the transformer."
  },
  {
    question: "What's the difference between kVA and kW?",
    answer: "kVA measures apparent power (total power), while kW measures real power (usable power). They're related by power factor: kW = kVA × Power Factor. In resistive loads (PF = 1.0), kVA equals kW. In inductive loads like motors (PF = 0.8-0.9), kW is less than kVA. This difference is crucial for proper equipment sizing."
  },
  {
    question: "Why do generators and transformers use kVA ratings instead of kW?",
    answer: "Generators and transformers are rated in kVA because they must handle the total current regardless of power factor. The manufacturer doesn't know what power factor the load will have, so they rate equipment based on the maximum current it can safely carry. This ensures proper sizing for any type of load - resistive, inductive, or capacitive."
  },
  {
    question: "How does power factor affect kVA to amp calculations?",
    answer: "Power factor doesn't directly affect the kVA to amps conversion, but it's crucial when converting between kVA and kW. A lower power factor means more current (amps) is needed to deliver the same real power (kW). For example, a 100kW load at 0.8 PF requires 125 kVA, while at 1.0 PF it only needs 100 kVA."
  }
];

export default function KVAToAmpsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FAQSchema 
        items={calculatorFAQs['kva-to-amps-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-xl">
                <Zap className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              kVA to Amps Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Professional kilovolt-amperes to amperage converter for transformers, generators, and electrical equipment sizing. 
              Calculate full load current for single-phase and three-phase systems with power factor correction.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Transformer Sizing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">NEC Article 450 compliant</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <Shield className="h-8 w-8 text-blue-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Generator Ratings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">IEEE Standard 446</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <Calculator className="h-8 w-8 text-purple-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Power Factor</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">0.7 to 1.0 PF range</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <Suspense fallback={<div>Loading calculator...</div>}>
            <KVAToAmpsCalculator />
          </Suspense>
        </div>
      </section>

      {/* Quick Reference Table */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <Calculator className="mr-3 h-8 w-8 text-blue-600" />
          Common kVA to Amps Conversions
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Single Phase Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-600">Single-Phase @ 240V</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2">kVA Rating</th>
                    <th className="text-center py-2">Full Load Amps</th>
                    <th className="text-center py-2">Wire Size (Cu)</th>
                    <th className="text-center py-2">Breaker Size</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">10 kVA</td>
                    <td className="text-center">41.7 A</td>
                    <td className="text-center">8 AWG</td>
                    <td className="text-center">50 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">15 kVA</td>
                    <td className="text-center">62.5 A</td>
                    <td className="text-center">6 AWG</td>
                    <td className="text-center">80 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">25 kVA</td>
                    <td className="text-center">104.2 A</td>
                    <td className="text-center">2 AWG</td>
                    <td className="text-center">125 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">37.5 kVA</td>
                    <td className="text-center">156.3 A</td>
                    <td className="text-center">2/0 AWG</td>
                    <td className="text-center">200 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">50 kVA</td>
                    <td className="text-center">208.3 A</td>
                    <td className="text-center">4/0 AWG</td>
                    <td className="text-center">250 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">75 kVA</td>
                    <td className="text-center">312.5 A</td>
                    <td className="text-center">350 kcmil</td>
                    <td className="text-center">400 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">100 kVA</td>
                    <td className="text-center">416.7 A</td>
                    <td className="text-center">600 kcmil</td>
                    <td className="text-center">500 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">167 kVA</td>
                    <td className="text-center">695.8 A</td>
                    <td className="text-center">2×350 kcmil</td>
                    <td className="text-center">800 A</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Three Phase Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-green-600">Three-Phase @ 480V</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2">kVA Rating</th>
                    <th className="text-center py-2">Full Load Amps</th>
                    <th className="text-center py-2">Wire Size (Cu)</th>
                    <th className="text-center py-2">Breaker Size</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">30 kVA</td>
                    <td className="text-center">36.1 A</td>
                    <td className="text-center">8 AWG</td>
                    <td className="text-center">50 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">45 kVA</td>
                    <td className="text-center">54.1 A</td>
                    <td className="text-center">6 AWG</td>
                    <td className="text-center">70 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">75 kVA</td>
                    <td className="text-center">90.2 A</td>
                    <td className="text-center">3 AWG</td>
                    <td className="text-center">110 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">112.5 kVA</td>
                    <td className="text-center">135.3 A</td>
                    <td className="text-center">1/0 AWG</td>
                    <td className="text-center">175 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">150 kVA</td>
                    <td className="text-center">180.4 A</td>
                    <td className="text-center">3/0 AWG</td>
                    <td className="text-center">225 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">225 kVA</td>
                    <td className="text-center">270.6 A</td>
                    <td className="text-center">300 kcmil</td>
                    <td className="text-center">350 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">300 kVA</td>
                    <td className="text-center">360.8 A</td>
                    <td className="text-center">500 kcmil</td>
                    <td className="text-center">450 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">500 kVA</td>
                    <td className="text-center">601.4 A</td>
                    <td className="text-center">2×300 kcmil</td>
                    <td className="text-center">700 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">750 kVA</td>
                    <td className="text-center">902.1 A</td>
                    <td className="text-center">3×300 kcmil</td>
                    <td className="text-center">1000 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">1000 kVA</td>
                    <td className="text-center">1202.8 A</td>
                    <td className="text-center">4×300 kcmil</td>
                    <td className="text-center">1600 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">1500 kVA</td>
                    <td className="text-center">1804.2 A</td>
                    <td className="text-center">6×350 kcmil</td>
                    <td className="text-center">2000 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">2000 kVA</td>
                    <td className="text-center">2405.6 A</td>
                    <td className="text-center">8×400 kcmil</td>
                    <td className="text-center">3000 A</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <BookOpen className="mr-3 h-8 w-8 text-purple-600" />
          Real-World kVA to Amps Examples
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example 1: Office Building Transformer */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-400">
              Office Building Transformer
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Scenario:</strong> 750 kVA transformer for commercial building</p>
              <p><strong>Voltage:</strong> 480V, 3-phase</p>
              <p><strong>Calculation:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                I = 750 × 1000 / (480 × 1.732)<br/>
                I = 750,000 / 831.36<br/>
                I = 902.1 Amps
              </div>
              <p className="text-green-700 dark:text-green-400 font-semibold">
                Result: 902.1A full load current
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Wire Required:</strong> 3 sets of 300 kcmil copper<br/>
                <strong>Main Breaker:</strong> 1000A frame<br/>
                <strong>Application:</strong> Powers entire office building
              </p>
            </div>
          </div>

          {/* Example 2: Hospital Generator */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-green-700 dark:text-green-400">
              Hospital Emergency Generator
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Scenario:</strong> 2000 kVA standby generator</p>
              <p><strong>Voltage:</strong> 480V, 3-phase</p>
              <p><strong>Power Factor:</strong> 0.8 lagging</p>
              <p><strong>Calculation:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                I = 2000 × 1000 / (480 × 1.732)<br/>
                I = 2,000,000 / 831.36<br/>
                I = 2405.6 Amps
              </div>
              <p className="text-green-700 dark:text-green-400 font-semibold">
                Result: 2405.6A rated current
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Real Power:</strong> 1600 kW @ 0.8 PF<br/>
                <strong>Transfer Switch:</strong> 3000A<br/>
                <strong>Critical Loads:</strong> Life safety systems
              </p>
            </div>
          </div>

          {/* Example 3: Data Center UPS */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-400">
              Data Center UPS System
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Scenario:</strong> 500 kVA UPS module</p>
              <p><strong>Input:</strong> 480V, 3-phase</p>
              <p><strong>Output:</strong> 480V, 3-phase</p>
              <p><strong>Input Calculation:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                I = 500 × 1000 / (480 × 1.732)<br/>
                I = 500,000 / 831.36<br/>
                I = 601.4 Amps
              </div>
              <p className="text-purple-700 dark:text-purple-400 font-semibold">
                Result: 601.4A input current
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Efficiency:</strong> 95% at full load<br/>
                <strong>Battery Runtime:</strong> 15 minutes<br/>
                <strong>N+1 Config:</strong> Redundant modules
              </p>
            </div>
          </div>

          {/* Example 4: Manufacturing Facility */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-orange-700 dark:text-orange-400">
              Manufacturing Plant Substation
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Scenario:</strong> 5000 kVA main transformer</p>
              <p><strong>Primary:</strong> 13.8kV</p>
              <p><strong>Secondary:</strong> 480V, 3-phase</p>
              <p><strong>Secondary Current:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                I = 5000 × 1000 / (480 × 1.732)<br/>
                I = 5,000,000 / 831.36<br/>
                I = 6013.9 Amps
              </div>
              <p className="text-orange-700 dark:text-orange-400 font-semibold">
                Secondary: 6013.9A
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Switchgear:</strong> 6000A main bus<br/>
                <strong>Distribution:</strong> Multiple MCCs<br/>
                <strong>Loads:</strong> Motors, welders, HVAC
              </p>
            </div>
          </div>

          {/* Example 5: Solar Farm Inverter */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-yellow-700 dark:text-yellow-400">
              Solar Farm Central Inverter
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Scenario:</strong> 1500 kVA solar inverter</p>
              <p><strong>AC Output:</strong> 480V, 3-phase</p>
              <p><strong>Power Factor:</strong> 0.95 leading</p>
              <p><strong>AC Current:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                I = 1500 × 1000 / (480 × 1.732)<br/>
                I = 1,500,000 / 831.36<br/>
                I = 1804.2 Amps
              </div>
              <p className="text-yellow-700 dark:text-yellow-400 font-semibold">
                AC Output: 1804.2A
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Real Power:</strong> 1425 kW @ 0.95 PF<br/>
                <strong>DC Input:</strong> 1000V, 1500A<br/>
                <strong>Grid Tie:</strong> Utility interconnect
              </p>
            </div>
          </div>

          {/* Example 6: Apartment Complex */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-red-700 dark:text-red-400">
              Apartment Building Service
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Scenario:</strong> 300 kVA pad-mount transformer</p>
              <p><strong>Service:</strong> 208V, 3-phase</p>
              <p><strong>Load Type:</strong> Residential mixed</p>
              <p><strong>Service Current:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                I = 300 × 1000 / (208 × 1.732)<br/>
                I = 300,000 / 360.26<br/>
                I = 832.7 Amps
              </div>
              <p className="text-red-700 dark:text-red-400 font-semibold">
                Service Size: 832.7A
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Main Panel:</strong> 1000A bus<br/>
                <strong>Meter Bank:</strong> 48 units<br/>
                <strong>Demand Factor:</strong> 60-70%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Power Factor Impact Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="mr-3 h-8 w-8 text-green-600" />
          Power Factor Impact on kVA
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">Understanding Power Triangle</h3>
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                  The relationship between kVA (apparent power), kW (real power), and kVAR (reactive power) 
                  forms the power triangle:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">▶</span>
                    <span><strong>kVA²</strong> = kW² + kVAR² (Pythagorean theorem)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">▶</span>
                    <span><strong>Power Factor</strong> = kW / kVA = cos(θ)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">▶</span>
                    <span><strong>kVAR</strong> = kVA × sin(θ)</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6">
                <h4 className="font-bold mb-3">Common Power Factors by Load Type</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b">
                    <span>Incandescent Lighting</span>
                    <span className="font-mono">1.0</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Fluorescent Lighting</span>
                    <span className="font-mono">0.85-0.95</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Motors (loaded)</span>
                    <span className="font-mono">0.80-0.90</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Motors (unloaded)</span>
                    <span className="font-mono">0.35-0.60</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Welding Equipment</span>
                    <span className="font-mono">0.50-0.70</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Data Centers</span>
                    <span className="font-mono">0.90-0.95</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-600">kVA Requirements vs Power Factor</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                For a 100 kW load at different power factors:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2">Power Factor</th>
                      <th className="text-center py-2">kVA Required</th>
                      <th className="text-center py-2">Current @ 480V</th>
                      <th className="text-center py-2">% Increase</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-mono">1.00</td>
                      <td className="text-center">100 kVA</td>
                      <td className="text-center">120.3 A</td>
                      <td className="text-center text-green-600">Baseline</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-mono">0.95</td>
                      <td className="text-center">105.3 kVA</td>
                      <td className="text-center">126.6 A</td>
                      <td className="text-center">+5.3%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-mono">0.90</td>
                      <td className="text-center">111.1 kVA</td>
                      <td className="text-center">133.6 A</td>
                      <td className="text-center">+11.1%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-mono">0.85</td>
                      <td className="text-center">117.6 kVA</td>
                      <td className="text-center">141.5 A</td>
                      <td className="text-center">+17.6%</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-yellow-50">
                      <td className="py-2 font-mono">0.80</td>
                      <td className="text-center">125.0 kVA</td>
                      <td className="text-center">150.3 A</td>
                      <td className="text-center text-orange-600">+25.0%</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-red-50">
                      <td className="py-2 font-mono">0.70</td>
                      <td className="text-center">142.9 kVA</td>
                      <td className="text-center">171.8 A</td>
                      <td className="text-center text-red-600">+42.9%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <p className="text-sm">
                  <strong className="text-yellow-700 dark:text-yellow-400">Impact:</strong> 
                  Poor power factor significantly increases current draw, requiring larger cables, 
                  transformers, and switchgear. Power factor correction can reduce equipment costs 
                  and utility penalties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformer Sizing Guidelines */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Transformer Sizing Guidelines (NEC Article 450)
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-600">Standard Transformer Sizes</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Single-Phase (kVA)</h4>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">10</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">15</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">25</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">37.5</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">50</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">75</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">100</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">167</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Three-Phase (kVA)</h4>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">15</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">30</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">45</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">75</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">112.5</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">150</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">225</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">300</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">500</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">750</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">1000</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">1500</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">2000</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">2500</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">3750</span>
                  <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">5000</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-green-600">Overcurrent Protection</h3>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <h4 className="font-semibold mb-2">Primary Protection (&gt;1000V)</h4>
                <p className="text-sm">Not more than 125% of transformer rated current</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Next standard size allowed if calculated value doesn't correspond
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <h4 className="font-semibold mb-2">Primary Protection (≤1000V)</h4>
                <p className="text-sm">Not more than 125% of transformer rated current</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Up to 250% allowed for transformers with ≤9A primary current
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <h4 className="font-semibold mb-2">Secondary Protection</h4>
                <p className="text-sm">Not more than 125% of transformer rated current</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Next higher standard rating permitted (NEC 450.3)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generator Sizing Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Generator kVA Sizing Guidelines
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-3 text-blue-600">Starting kVA</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Motor starting requires 3-6 times running kVA:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span>NEMA Code G</span>
                  <span className="font-mono">5.6-6.3×</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>NEMA Code H</span>
                  <span className="font-mono">6.3-7.1×</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>NEMA Code J</span>
                  <span className="font-mono">7.1-8.0×</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>NEMA Code K</span>
                  <span className="font-mono">8.0-9.0×</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3 text-green-600">Load Types</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Typical demand factors:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span>Lighting</span>
                  <span className="font-mono">100%</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Receptacles</span>
                  <span className="font-mono">50-70%</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>HVAC</span>
                  <span className="font-mono">80-100%</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Elevators</span>
                  <span className="font-mono">100%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3 text-purple-600">Derating Factors</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Environmental conditions:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span>Altitude &gt;1000m</span>
                  <span className="font-mono">-3%/300m</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Temp &gt;40°C</span>
                  <span className="font-mono">-3.5%/5°C</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Power Factor</span>
                  <span className="font-mono">Size for kVA</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Future Growth</span>
                  <span className="font-mono">+20-25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Calculators */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Related Electrical Calculators
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/calculators/kw-to-amps" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Calculator className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold mb-1">kW to Amps</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Convert kilowatts to amperage</p>
          </Link>
          
          <Link href="/calculators/watts-to-amps" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Zap className="h-8 w-8 text-yellow-600 mb-2" />
            <h3 className="font-semibold mb-1">Watts to Amps</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Power to current converter</p>
          </Link>
          
          <Link href="/calculators/three-phase" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-semibold mb-1">Three Phase</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">3-phase power calculations</p>
          </Link>
          
          <Link href="/calculators/wire-size-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Shield className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold mb-1">Wire Size</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Calculate required wire gauge</p>
          </Link>
        </div>
      </section>

      {/* Authority Links */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Industry Standards & References
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="https://www.nfpa.org/codes-and-standards/nfpa-70-national-electrical-code" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-red-700 dark:text-red-400">NFPA 70 - NEC</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              National Electrical Code Article 450 for transformer installations and protection requirements
            </p>
          </a>
          
          <a href="https://standards.ieee.org/ieee/446/7298/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-blue-700 dark:text-blue-400">IEEE 446</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Recommended Practice for Emergency and Standby Power Systems
            </p>
          </a>
          
          <a href="https://www.schneider-electric.com/en/work/solutions/power-and-energy-monitoring/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-green-700 dark:text-green-400">Schneider Electric</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Power system design guides and transformer selection tools
            </p>
          </a>
          
          <a href="https://www.eaton.com/us/en-us/products/electrical-circuit-protection/molded-case-circuit-breakers.html" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-purple-700 dark:text-purple-400">Eaton Corporation</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Circuit protection and power distribution equipment specifications
            </p>
          </a>
          
          <a href="https://new.abb.com/power-converters-inverters" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-orange-700 dark:text-orange-400">ABB Group</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Industrial transformers and power conversion systems
            </p>
          </a>
          
          <a href="https://www.generac.com/industrial/products/diesel-generators" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-yellow-700 dark:text-yellow-400">Generac Power Systems</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Industrial generator sizing and application guides
            </p>
          </a>
        </div>
      </section>

      {/* Educational Alert */}
      <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl p-6">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-2">
              Professional Installation Required
            </h3>
            <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
              kVA calculations are critical for proper equipment sizing and electrical safety. 
              Transformers and generators must be installed by licensed electricians following 
              NEC Article 450 and local codes. Improper sizing can lead to equipment damage, 
              fire hazards, and code violations. Always consult with qualified professionals 
              and verify calculations with manufacturer specifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}