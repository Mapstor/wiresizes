import { Metadata } from 'next';
import { KVAToAmpsCalculator } from '@/components/calculators/kVAToAmpsCalculator';
import { Zap, Calculator, TrendingUp, AlertCircle, BookOpen, Shield } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';

export const metadata: Metadata = {
  title: 'kVA to Amps Calculator — Apparent Power',
  description: 'Convert apparent power (kVA) to current (amps) for single- and three-phase systems.',
  keywords: 'kva to amps, kilovolt amperes to amperage, transformer calculator, apparent power conversion, three phase kva, power factor calculator',
  openGraph: {
    title: 'kVA to Amps Calculator - Electrical Conversion Tool',
    description: 'Convert kVA to amps for transformers, generators, and electrical equipment. Single and three-phase calculations with power factor.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/kva-to-amps-calculator',
    images: ['/opengraph-image']
  },
  alternates: { canonical: '/calculators/kva-to-amps-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "kVA to Amps Calculator",
  url: "https://wiresizes.com/calculators/kva-to-amps-calculator",
  description: "kVA to amps calculator for electrical engineers and contractors. Convert kilovolt-amperes to amperage for single-phase and three-phase systems."
};

export default function KVAToAmpsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CombinedSchema 
        webApp={webAppData} 
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
              Kilovolt-amperes to amperage converter for transformers, generators, and electrical equipment.
              Calculate full load current for single-phase and three-phase systems.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <KVAToAmpsCalculator />
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
            <h3 className="text-xl font-bold mb-4 text-blue-600">Single-Phase @ 240 V</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2">kVA Rating</th>
                    <th className="text-center py-2">Full Load Amps</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">10 kVA</td>
                    <td className="text-center">41.7 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">15 kVA</td>
                    <td className="text-center">62.5 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">25 kVA</td>
                    <td className="text-center">104.2 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">37.5 kVA</td>
                    <td className="text-center">156.3 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">50 kVA</td>
                    <td className="text-center">208.3 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">75 kVA</td>
                    <td className="text-center">312.5 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">100 kVA</td>
                    <td className="text-center">416.7 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">167 kVA</td>
                    <td className="text-center">695.8 A</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Three Phase Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-green-600">Three-Phase @ 480 V</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2">kVA Rating</th>
                    <th className="text-center py-2">Full Load Amps</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">30 kVA</td>
                    <td className="text-center">36.1 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">45 kVA</td>
                    <td className="text-center">54.1 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">75 kVA</td>
                    <td className="text-center">90.2 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">112.5 kVA</td>
                    <td className="text-center">135.3 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">150 kVA</td>
                    <td className="text-center">180.4 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">225 kVA</td>
                    <td className="text-center">270.6 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">300 kVA</td>
                    <td className="text-center">360.8 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">500 kVA</td>
                    <td className="text-center">601.4 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">750 kVA</td>
                    <td className="text-center">902.1 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">1000 kVA</td>
                    <td className="text-center">1202.8 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">1500 kVA</td>
                    <td className="text-center">1804.2 A</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">2000 kVA</td>
                    <td className="text-center">2405.6 A</td>
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
              <p><strong>Voltage:</strong> 480 V, 3-phase</p>
              <p><strong>Calculation:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                I = 750 × 1000 / (480 × 1.732)<br/>
                I = 750,000 / 831.36<br/>
                I = 902.1 Amps
              </div>
              <p className="text-green-700 dark:text-green-400 font-semibold">
                Result: 902.1 A full load current
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
              <p><strong>Voltage:</strong> 480 V, 3-phase</p>
              <p><strong>Power Factor:</strong> 0.8 lagging</p>
              <p><strong>Calculation:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                I = 2000 × 1000 / (480 × 1.732)<br/>
                I = 2,000,000 / 831.36<br/>
                I = 2405.6 Amps
              </div>
              <p className="text-green-700 dark:text-green-400 font-semibold">
                Result: 2405.6 A rated current
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Real Power:</strong> 1600 kW @ 0.8 PF
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
              <p><strong>AC Output:</strong> 480 V, 3-phase</p>
              <p><strong>Power Factor:</strong> 0.95 leading</p>
              <p><strong>AC Current:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                I = 1500 × 1000 / (480 × 1.732)<br/>
                I = 1,500,000 / 831.36<br/>
                I = 1804.2 Amps
              </div>
              <p className="text-yellow-700 dark:text-yellow-400 font-semibold">
                AC Output: 1804.2 A
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Real Power:</strong> 1425 kW @ 0.95 PF
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
          <Link href="/calculators/kilowatts-to-amps-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Calculator className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold mb-1">kW to Amps</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Convert kilowatts to amperage</p>
          </Link>
          
          <Link href="/calculators/watts-to-amps-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Zap className="h-8 w-8 text-yellow-600 mb-2" />
            <h3 className="font-semibold mb-1">Watts to Amps</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Power to current converter</p>
          </Link>
          
          <Link href="/calculators/three-phase-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
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
              local codes. Improper sizing can lead to equipment damage, 
              fire hazards, and code violations. Always consult with qualified professionals 
              and verify calculations with manufacturer specifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}