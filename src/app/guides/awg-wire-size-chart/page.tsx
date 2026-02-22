import { Metadata } from 'next';
import { 
  Table, 
  Gauge, 
  Calculator, 
  BookOpen, 
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  DollarSign,
  Zap,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AWG Wire Size Chart | Complete American Wire Gauge Reference Table',
  description: 'Comprehensive AWG wire size chart with diameters, resistance, ampacity ratings for copper and aluminum. Includes metric conversions, NEC ampacity tables, and wire selection guide.',
  keywords: 'AWG chart, wire size chart, American wire gauge, wire diameter table, AWG to mm conversion, wire resistance table, copper wire sizes, aluminum wire sizes, electrical wire chart',
};

export default function AWGWireSizeChartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">
              Complete AWG Wire Size Chart & Reference Guide
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              American Wire Gauge (AWG) comprehensive reference table with diameters, resistance, 
              ampacity ratings, and metric conversions for electrical installations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/calculators/wire-size-calculator" 
                className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Wire Size Calculator
              </Link>
              <Link 
                href="/guides/nec-table-310-16" 
                className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
              >
                <Table className="w-5 h-5" />
                NEC Table 310.16
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Reference Card */}
      <section className="py-8 -mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl p-6 border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Gauge className="w-6 h-6 text-blue-600" />
                Quick AWG Reference - Most Common Sizes
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">14 AWG</h3>
                  <ul className="text-sm space-y-1 text-blue-700">
                    <li>• Diameter: 1.628 mm</li>
                    <li>• 15A circuits</li>
                    <li>• Lighting & outlets</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">12 AWG</h3>
                  <ul className="text-sm space-y-1 text-green-700">
                    <li>• Diameter: 2.053 mm</li>
                    <li>• 20A circuits</li>
                    <li>• Kitchen & bathroom</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-2">10 AWG</h3>
                  <ul className="text-sm space-y-1 text-amber-700">
                    <li>• Diameter: 2.588 mm</li>
                    <li>• 30A circuits</li>
                    <li>• Dryers & A/C</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">6 AWG</h3>
                  <ul className="text-sm space-y-1 text-purple-700">
                    <li>• Diameter: 4.116 mm</li>
                    <li>• 60A circuits</li>
                    <li>• EV chargers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete AWG Table */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Table className="w-6 h-6 text-blue-600" />
              Complete AWG Wire Size Table
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <th className="px-4 py-3 text-left">AWG</th>
                      <th className="px-4 py-3 text-center">Diameter (mm)</th>
                      <th className="px-4 py-3 text-center">Diameter (inch)</th>
                      <th className="px-4 py-3 text-center">Area (mm²)</th>
                      <th className="px-4 py-3 text-center">Resistance (Ω/1000ft)</th>
                      <th className="px-4 py-3 text-center">Cu Ampacity 75°C</th>
                      <th className="px-4 py-3 text-center">Al Ampacity 75°C</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono font-bold">18</td>
                      <td className="px-4 py-3 text-center">1.024</td>
                      <td className="px-4 py-3 text-center">0.0403</td>
                      <td className="px-4 py-3 text-center">0.823</td>
                      <td className="px-4 py-3 text-center">6.385</td>
                      <td className="px-4 py-3 text-center">—</td>
                      <td className="px-4 py-3 text-center">—</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono font-bold">16</td>
                      <td className="px-4 py-3 text-center">1.291</td>
                      <td className="px-4 py-3 text-center">0.0508</td>
                      <td className="px-4 py-3 text-center">1.31</td>
                      <td className="px-4 py-3 text-center">4.016</td>
                      <td className="px-4 py-3 text-center">—</td>
                      <td className="px-4 py-3 text-center">—</td>
                    </tr>
                    <tr className="hover:bg-blue-50 bg-yellow-50">
                      <td className="px-4 py-3 font-mono font-bold">14</td>
                      <td className="px-4 py-3 text-center">1.628</td>
                      <td className="px-4 py-3 text-center">0.0641</td>
                      <td className="px-4 py-3 text-center">2.08</td>
                      <td className="px-4 py-3 text-center">2.525</td>
                      <td className="px-4 py-3 text-center font-semibold">20*</td>
                      <td className="px-4 py-3 text-center">—</td>
                    </tr>
                    <tr className="hover:bg-blue-50 bg-yellow-50">
                      <td className="px-4 py-3 font-mono font-bold">12</td>
                      <td className="px-4 py-3 text-center">2.053</td>
                      <td className="px-4 py-3 text-center">0.0808</td>
                      <td className="px-4 py-3 text-center">3.31</td>
                      <td className="px-4 py-3 text-center">1.588</td>
                      <td className="px-4 py-3 text-center font-semibold">25*</td>
                      <td className="px-4 py-3 text-center">20*</td>
                    </tr>
                    <tr className="hover:bg-blue-50 bg-yellow-50">
                      <td className="px-4 py-3 font-mono font-bold">10</td>
                      <td className="px-4 py-3 text-center">2.588</td>
                      <td className="px-4 py-3 text-center">0.1019</td>
                      <td className="px-4 py-3 text-center">5.26</td>
                      <td className="px-4 py-3 text-center">0.9989</td>
                      <td className="px-4 py-3 text-center font-semibold">35*</td>
                      <td className="px-4 py-3 text-center">30*</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono font-bold">8</td>
                      <td className="px-4 py-3 text-center">3.264</td>
                      <td className="px-4 py-3 text-center">0.1285</td>
                      <td className="px-4 py-3 text-center">8.37</td>
                      <td className="px-4 py-3 text-center">0.6282</td>
                      <td className="px-4 py-3 text-center font-semibold">50</td>
                      <td className="px-4 py-3 text-center">40</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono font-bold">6</td>
                      <td className="px-4 py-3 text-center">4.116</td>
                      <td className="px-4 py-3 text-center">0.1620</td>
                      <td className="px-4 py-3 text-center">13.30</td>
                      <td className="px-4 py-3 text-center">0.3951</td>
                      <td className="px-4 py-3 text-center font-semibold">65</td>
                      <td className="px-4 py-3 text-center">50</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono font-bold">4</td>
                      <td className="px-4 py-3 text-center">5.189</td>
                      <td className="px-4 py-3 text-center">0.2043</td>
                      <td className="px-4 py-3 text-center">21.15</td>
                      <td className="px-4 py-3 text-center">0.2485</td>
                      <td className="px-4 py-3 text-center font-semibold">85</td>
                      <td className="px-4 py-3 text-center">65</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono font-bold">3</td>
                      <td className="px-4 py-3 text-center">5.827</td>
                      <td className="px-4 py-3 text-center">0.2294</td>
                      <td className="px-4 py-3 text-center">26.67</td>
                      <td className="px-4 py-3 text-center">0.1970</td>
                      <td className="px-4 py-3 text-center font-semibold">100</td>
                      <td className="px-4 py-3 text-center">75</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono font-bold">2</td>
                      <td className="px-4 py-3 text-center">6.544</td>
                      <td className="px-4 py-3 text-center">0.2576</td>
                      <td className="px-4 py-3 text-center">33.62</td>
                      <td className="px-4 py-3 text-center">0.1563</td>
                      <td className="px-4 py-3 text-center font-semibold">115</td>
                      <td className="px-4 py-3 text-center">90</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono font-bold">1</td>
                      <td className="px-4 py-3 text-center">7.348</td>
                      <td className="px-4 py-3 text-center">0.2893</td>
                      <td className="px-4 py-3 text-center">42.41</td>
                      <td className="px-4 py-3 text-center">0.1239</td>
                      <td className="px-4 py-3 text-center font-semibold">130</td>
                      <td className="px-4 py-3 text-center">100</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono font-bold">1/0</td>
                      <td className="px-4 py-3 text-center">8.252</td>
                      <td className="px-4 py-3 text-center">0.3249</td>
                      <td className="px-4 py-3 text-center">53.49</td>
                      <td className="px-4 py-3 text-center">0.0983</td>
                      <td className="px-4 py-3 text-center font-semibold">150</td>
                      <td className="px-4 py-3 text-center">120</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono font-bold">2/0</td>
                      <td className="px-4 py-3 text-center">9.266</td>
                      <td className="px-4 py-3 text-center">0.3648</td>
                      <td className="px-4 py-3 text-center">67.43</td>
                      <td className="px-4 py-3 text-center">0.0779</td>
                      <td className="px-4 py-3 text-center font-semibold">175</td>
                      <td className="px-4 py-3 text-center">135</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono font-bold">3/0</td>
                      <td className="px-4 py-3 text-center">10.40</td>
                      <td className="px-4 py-3 text-center">0.4096</td>
                      <td className="px-4 py-3 text-center">85.01</td>
                      <td className="px-4 py-3 text-center">0.0618</td>
                      <td className="px-4 py-3 text-center font-semibold">200</td>
                      <td className="px-4 py-3 text-center">155</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono font-bold">4/0</td>
                      <td className="px-4 py-3 text-center">11.68</td>
                      <td className="px-4 py-3 text-center">0.4600</td>
                      <td className="px-4 py-3 text-center">107.2</td>
                      <td className="px-4 py-3 text-center">0.0490</td>
                      <td className="px-4 py-3 text-center font-semibold">230</td>
                      <td className="px-4 py-3 text-center">180</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 bg-amber-50 border-t border-amber-200">
                <p className="text-xs text-amber-800">
                  <strong>*</strong> Limited by NEC 240.4(D) small conductor rule. 14 AWG max 15A, 12 AWG max 20A, 10 AWG max 30A protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Conversion Section */}
      <section className="py-8 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              AWG to Metric Wire Size Conversion
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">Common AWG to mm² Conversions</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">AWG</th>
                      <th className="text-center py-2">mm²</th>
                      <th className="text-center py-2">Nearest Metric</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 font-mono">14 AWG</td>
                      <td className="py-2 text-center">2.08</td>
                      <td className="py-2 text-center">2.5 mm²</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono">12 AWG</td>
                      <td className="py-2 text-center">3.31</td>
                      <td className="py-2 text-center">4 mm²</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono">10 AWG</td>
                      <td className="py-2 text-center">5.26</td>
                      <td className="py-2 text-center">6 mm²</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono">8 AWG</td>
                      <td className="py-2 text-center">8.37</td>
                      <td className="py-2 text-center">10 mm²</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono">6 AWG</td>
                      <td className="py-2 text-center">13.3</td>
                      <td className="py-2 text-center">16 mm²</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono">4 AWG</td>
                      <td className="py-2 text-center">21.2</td>
                      <td className="py-2 text-center">25 mm²</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono">2 AWG</td>
                      <td className="py-2 text-center">33.6</td>
                      <td className="py-2 text-center">35 mm²</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono">1/0 AWG</td>
                      <td className="py-2 text-center">53.5</td>
                      <td className="py-2 text-center">50 mm²</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">AWG System Explained</h3>
                <div className="space-y-3 text-sm text-neutral-700">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p>
                      The AWG system is logarithmic - each 3-gauge decrease doubles the cross-sectional area.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p>
                      Smaller AWG numbers = larger wire diameters. AWG 0000 (4/0) is the largest standard size.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p>
                      For sizes larger than 4/0, kcmil (MCM) is used, representing thousands of circular mils.
                    </p>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong>Formula:</strong> Diameter(n) = 0.005 × 92^((36-n)/39) inches
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Guide */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-600" />
              Wire Size Selection by Application
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold text-green-900 mb-3">Residential Circuits</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Lighting (15A)</span>
                    <span className="font-mono font-semibold">14 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Outlets (20A)</span>
                    <span className="font-mono font-semibold">12 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Kitchen GFCI (20A)</span>
                    <span className="font-mono font-semibold">12 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Bathroom (20A)</span>
                    <span className="font-mono font-semibold">12 AWG</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold text-blue-900 mb-3">Appliances</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Dryer (30A)</span>
                    <span className="font-mono font-semibold">10 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Range (50A)</span>
                    <span className="font-mono font-semibold">6 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Water Heater (30A)</span>
                    <span className="font-mono font-semibold">10 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>A/C Unit (20-30A)</span>
                    <span className="font-mono font-semibold">12-10 AWG</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold text-purple-900 mb-3">Special Applications</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>EV Charger (60A)</span>
                    <span className="font-mono font-semibold">6 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Hot Tub (50A)</span>
                    <span className="font-mono font-semibold">6 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sub Panel (100A)</span>
                    <span className="font-mono font-semibold">2 AWG</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Service (200A)</span>
                    <span className="font-mono font-semibold">3/0 AWG</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-900">
                <AlertCircle className="inline w-4 h-4 mr-2" />
                <strong>Important:</strong> These are typical sizes. Always calculate based on actual load, distance, 
                and voltage drop. Consult NEC and local codes for specific requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="py-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Wire Cost Comparison by Size
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <th className="px-4 py-3 text-left">Wire Size</th>
                    <th className="px-4 py-3 text-center">Copper $/ft</th>
                    <th className="px-4 py-3 text-center">Aluminum $/ft</th>
                    <th className="px-4 py-3 text-center">Savings %</th>
                    <th className="px-4 py-3 text-center">100ft Cost Cu</th>
                    <th className="px-4 py-3 text-center">100ft Cost Al</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr className="hover:bg-green-50">
                    <td className="px-4 py-3 font-mono font-semibold">14 AWG</td>
                    <td className="px-4 py-3 text-center">$0.45</td>
                    <td className="px-4 py-3 text-center">—</td>
                    <td className="px-4 py-3 text-center">—</td>
                    <td className="px-4 py-3 text-center font-semibold">$45</td>
                    <td className="px-4 py-3 text-center">—</td>
                  </tr>
                  <tr className="hover:bg-green-50">
                    <td className="px-4 py-3 font-mono font-semibold">12 AWG</td>
                    <td className="px-4 py-3 text-center">$0.65</td>
                    <td className="px-4 py-3 text-center">$0.35</td>
                    <td className="px-4 py-3 text-center text-green-600">46%</td>
                    <td className="px-4 py-3 text-center font-semibold">$65</td>
                    <td className="px-4 py-3 text-center">$35</td>
                  </tr>
                  <tr className="hover:bg-green-50">
                    <td className="px-4 py-3 font-mono font-semibold">10 AWG</td>
                    <td className="px-4 py-3 text-center">$0.95</td>
                    <td className="px-4 py-3 text-center">$0.45</td>
                    <td className="px-4 py-3 text-center text-green-600">53%</td>
                    <td className="px-4 py-3 text-center font-semibold">$95</td>
                    <td className="px-4 py-3 text-center">$45</td>
                  </tr>
                  <tr className="hover:bg-green-50">
                    <td className="px-4 py-3 font-mono font-semibold">8 AWG</td>
                    <td className="px-4 py-3 text-center">$1.55</td>
                    <td className="px-4 py-3 text-center">$0.75</td>
                    <td className="px-4 py-3 text-center text-green-600">52%</td>
                    <td className="px-4 py-3 text-center font-semibold">$155</td>
                    <td className="px-4 py-3 text-center">$75</td>
                  </tr>
                  <tr className="hover:bg-green-50">
                    <td className="px-4 py-3 font-mono font-semibold">6 AWG</td>
                    <td className="px-4 py-3 text-center">$2.80</td>
                    <td className="px-4 py-3 text-center">$1.20</td>
                    <td className="px-4 py-3 text-center text-green-600">57%</td>
                    <td className="px-4 py-3 text-center font-semibold">$280</td>
                    <td className="px-4 py-3 text-center">$120</td>
                  </tr>
                  <tr className="hover:bg-green-50">
                    <td className="px-4 py-3 font-mono font-semibold">2 AWG</td>
                    <td className="px-4 py-3 text-center">$5.50</td>
                    <td className="px-4 py-3 text-center">$2.20</td>
                    <td className="px-4 py-3 text-center text-green-600">60%</td>
                    <td className="px-4 py-3 text-center font-semibold">$550</td>
                    <td className="px-4 py-3 text-center">$220</td>
                  </tr>
                  <tr className="hover:bg-green-50">
                    <td className="px-4 py-3 font-mono font-semibold">2/0 AWG</td>
                    <td className="px-4 py-3 text-center">$12.50</td>
                    <td className="px-4 py-3 text-center">$4.80</td>
                    <td className="px-4 py-3 text-center text-green-600">62%</td>
                    <td className="px-4 py-3 text-center font-semibold">$1,250</td>
                    <td className="px-4 py-3 text-center">$480</td>
                  </tr>
                </tbody>
              </table>
              <div className="px-4 py-3 bg-green-50 border-t border-green-200">
                <p className="text-xs text-green-800">
                  *Prices are approximate 2024 market averages for THHN/THWN-2 wire and may vary by location and supplier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Resources */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Technical Resources & Standards
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-3">NEC Standards</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.nfpa.org/codes-and-standards/nfpa-70-national-electrical-code" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:underline flex items-center gap-1">
                      NFPA 70 - NEC
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li className="text-neutral-600">• Article 310 - Conductors</li>
                  <li className="text-neutral-600">• Table 310.16 - Ampacities</li>
                  <li className="text-neutral-600">• Chapter 9, Table 8 - Properties</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-3">Industry Standards</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.astm.org/b0258-18.html" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:underline flex items-center gap-1">
                      ASTM B258 - AWG Sizes
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.ul.com/resources/wire-cable-guide" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:underline flex items-center gap-1">
                      UL Wire & Cable Guide
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li className="text-neutral-600">• IEC 60228 - Metric sizes</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-3">Manufacturer Data</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.southwire.com/wire-cable" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:underline flex items-center gap-1">
                      Southwire Specifications
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.generalcable.com/na/resources" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:underline flex items-center gap-1">
                      General Cable Resources
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li className="text-neutral-600">• Wire specification sheets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Related Calculators & Guides
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                href="/calculators/wire-size-calculator"
                className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors"
              >
                <h3 className="font-semibold mb-2">Wire Size Calculator</h3>
                <p className="text-sm text-blue-100">Calculate exact wire size for any load</p>
              </Link>
              
              <Link 
                href="/calculators/voltage-drop-calculator"
                className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors"
              >
                <h3 className="font-semibold mb-2">Voltage Drop Calculator</h3>
                <p className="text-sm text-blue-100">Check voltage loss over distance</p>
              </Link>
              
              <Link 
                href="/calculators/ampacity-calculator"
                className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors"
              >
                <h3 className="font-semibold mb-2">Ampacity Calculator</h3>
                <p className="text-sm text-blue-100">Derate wire for temperature & fill</p>
              </Link>
              
              <Link 
                href="/guides/nec-table-310-16"
                className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors"
              >
                <h3 className="font-semibold mb-2">NEC Table 310.16</h3>
                <p className="text-sm text-blue-100">Complete ampacity reference table</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}