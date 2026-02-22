import { Metadata } from 'next';
import { Suspense } from 'react';
import { BoxFillCalculator } from '@/components/calculators';
import { Package, Calculator, AlertTriangle, AlertCircle, BookOpen, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Box Fill Calculator | NEC 314.16 Junction Box Capacity | Electrical Box Sizing',
  description: 'Professional box fill calculator per NEC Article 314.16. Calculate electrical box capacity for switches, outlets, and junction boxes. Ensure code-compliant installations with proper conductor fill calculations.',
  keywords: 'box fill calculator, nec 314.16, junction box sizing, electrical box capacity, outlet box fill, switch box calculator, conductor fill, box volume calculator',
  openGraph: {
    title: 'Box Fill Calculator - NEC 314.16 Electrical Box Capacity',
    description: 'Calculate electrical box fill capacity per NEC code. Ensure proper box sizing for switches, outlets, and junction boxes.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/box-fill-calculator',
  },
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Electrical Box Fill Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Calculate NEC-compliant junction box fill for safe electrical installations.",
  "keywords": "box fill, junction box sizing, NEC 314.16",
  "url": `https://wiresizes.com/calculators/box-fill-calculator`,
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

const boxFillFAQs = [
  {
    question: "How do I calculate electrical box fill per NEC?",
    answer: "NEC 314.16 requires counting each conductor that enters the box. Count each current-carrying conductor as one. All grounding conductors count as one total. Each device (switch/outlet) counts as two conductors of the largest size. Internal cable clamps count as one, and each fixture stud/hickey counts as one. Multiply the count by the volume allowance for each wire size from Table 314.16(B)."
  },
  {
    question: "What counts as conductors in box fill calculations?",
    answer: "Conductors 6 inches or longer count as one each. Conductors passing through without splice don't count. All equipment grounding conductors together count as one conductor of the largest size. Each device yoke counts as two conductors. Cable clamps, whether one or more, count as one conductor. Support fittings count as one conductor of the largest size."
  },
  {
    question: "What size box do I need for multiple switches?",
    answer: "For multiple switches, count each device as 2 conductors of the largest wire size, plus actual conductors, grounds (all count as one), and clamps. For example, a 3-gang box with three switches using #12 wire needs: 3 switches (6×2.25=13.5 cu.in) + 6 conductors (6×2.25=13.5 cu.in) + 1 ground (2.25 cu.in) + 1 clamp (2.25 cu.in) = 31.5 cubic inches minimum."
  },
  {
    question: "Do wire nuts count in box fill calculations?",
    answer: "No, wire nuts (wire connectors) do not count in box fill calculations per NEC 314.16. Only conductors, devices, clamps, support fittings, and equipment grounding conductors are counted. However, wire nuts do take up physical space, so proper box sizing ensures adequate room for connections."
  },
  {
    question: "What's the minimum box size for outlets and switches?",
    answer: "Per NEC, the minimum box depth for outlets and switches is typically 1.5 inches for devices up to 2.25 cubic inches per #14 conductor. Common minimums: Single gang switch/outlet with #14 wire requires 18 cu.in (3×6 deep box). With #12 wire requires 20.25 cu.in (3×7 deep box). These increase with additional conductors or devices."
  }
];

export default function BoxFillCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FAQSchema 
        items={calculatorFAQs['box-fill-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl">
                <Package className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Electrical Box Fill Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Professional NEC 314.16 compliant box fill calculator for electrical installations. 
              Ensure proper box sizing for switches, outlets, and junction boxes with accurate conductor volume calculations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <Package className="h-8 w-8 text-indigo-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white">NEC 314.16</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Code compliant sizing</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <Calculator className="h-8 w-8 text-purple-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Volume Calculator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cubic inch capacity</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Code Compliance</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pass inspections</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <Suspense fallback={<div>Loading calculator...</div>}>
            <BoxFillCalculator />
          </Suspense>
        </div>
      </section>

      {/* NEC Table 314.16(A) - Metal Boxes */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <Package className="mr-3 h-8 w-8 text-blue-600" />
          NEC Table 314.16(A) - Metal Box Volumes
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Standard Metal Boxes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-600">Standard Device Boxes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2">Box Type</th>
                    <th className="text-center py-2">Size (inches)</th>
                    <th className="text-center py-2">Volume (cu.in)</th>
                    <th className="text-center py-2">Max #12</th>
                    <th className="text-center py-2">Max #14</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">3×2×1½</td>
                    <td className="text-center">Device</td>
                    <td className="text-center">7.5</td>
                    <td className="text-center">3</td>
                    <td className="text-center">3</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">3×2×2</td>
                    <td className="text-center">Device</td>
                    <td className="text-center">10.0</td>
                    <td className="text-center">4</td>
                    <td className="text-center">5</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">3×2×2¼</td>
                    <td className="text-center">Device</td>
                    <td className="text-center">10.5</td>
                    <td className="text-center">4</td>
                    <td className="text-center">5</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">3×2×2½</td>
                    <td className="text-center">Device</td>
                    <td className="text-center">12.5</td>
                    <td className="text-center">5</td>
                    <td className="text-center">6</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">3×2×2¾</td>
                    <td className="text-center">Device</td>
                    <td className="text-center">14.0</td>
                    <td className="text-center">6</td>
                    <td className="text-center">7</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">3×2×3½</td>
                    <td className="text-center">Device</td>
                    <td className="text-center">18.0</td>
                    <td className="text-center">8</td>
                    <td className="text-center">9</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">4×2⅛×1⅞</td>
                    <td className="text-center">Device</td>
                    <td className="text-center">10.3</td>
                    <td className="text-center">4</td>
                    <td className="text-center">5</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">4×2⅛×2⅛</td>
                    <td className="text-center">Device</td>
                    <td className="text-center">14.5</td>
                    <td className="text-center">6</td>
                    <td className="text-center">7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Square and Octagonal Boxes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-green-600">Square & Octagonal Boxes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2">Box Type</th>
                    <th className="text-center py-2">Depth</th>
                    <th className="text-center py-2">Volume (cu.in)</th>
                    <th className="text-center py-2">Max #12</th>
                    <th className="text-center py-2">Max #14</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">4×1¼ Oct</td>
                    <td className="text-center">1¼"</td>
                    <td className="text-center">12.5</td>
                    <td className="text-center">5</td>
                    <td className="text-center">6</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">4×1½ Oct</td>
                    <td className="text-center">1½"</td>
                    <td className="text-center">15.5</td>
                    <td className="text-center">6</td>
                    <td className="text-center">7</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">4×2⅛ Oct</td>
                    <td className="text-center">2⅛"</td>
                    <td className="text-center">21.5</td>
                    <td className="text-center">9</td>
                    <td className="text-center">10</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">4×1¼ Square</td>
                    <td className="text-center">1¼"</td>
                    <td className="text-center">18.0</td>
                    <td className="text-center">8</td>
                    <td className="text-center">9</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">4×1½ Square</td>
                    <td className="text-center">1½"</td>
                    <td className="text-center">21.0</td>
                    <td className="text-center">9</td>
                    <td className="text-center">10</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">4×2⅛ Square</td>
                    <td className="text-center">2⅛"</td>
                    <td className="text-center">30.3</td>
                    <td className="text-center">13</td>
                    <td className="text-center">15</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">4¹¹⁄₁₆×1¼</td>
                    <td className="text-center">1¼"</td>
                    <td className="text-center">25.5</td>
                    <td className="text-center">11</td>
                    <td className="text-center">12</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">4¹¹⁄₁₆×1½</td>
                    <td className="text-center">1½"</td>
                    <td className="text-center">29.5</td>
                    <td className="text-center">13</td>
                    <td className="text-center">14</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">4¹¹⁄₁₆×2⅛</td>
                    <td className="text-center">2⅛"</td>
                    <td className="text-center">42.0</td>
                    <td className="text-center">18</td>
                    <td className="text-center">21</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Conductor Volume Allowances */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <Calculator className="mr-3 h-8 w-8 text-purple-600" />
          NEC Table 314.16(B) - Conductor Volume Allowances
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">Volume per Conductor</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2">Wire Size (AWG)</th>
                      <th className="text-center py-2">Volume (cu.in)</th>
                      <th className="text-center py-2">Metric (cm³)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium">18 AWG</td>
                      <td className="text-center">1.50</td>
                      <td className="text-center">24.6</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium">16 AWG</td>
                      <td className="text-center">1.75</td>
                      <td className="text-center">28.7</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-yellow-50 dark:bg-yellow-900/20">
                      <td className="py-2 font-medium">14 AWG</td>
                      <td className="text-center font-bold">2.00</td>
                      <td className="text-center">32.8</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-yellow-50 dark:bg-yellow-900/20">
                      <td className="py-2 font-medium">12 AWG</td>
                      <td className="text-center font-bold">2.25</td>
                      <td className="text-center">36.9</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium">10 AWG</td>
                      <td className="text-center">2.50</td>
                      <td className="text-center">41.0</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium">8 AWG</td>
                      <td className="text-center">3.00</td>
                      <td className="text-center">49.2</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium">6 AWG</td>
                      <td className="text-center">5.00</td>
                      <td className="text-center">81.9</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-600">Counting Rules</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
                  <h4 className="font-semibold mb-1">Conductors</h4>
                  <p className="text-sm">Each conductor originating outside the box = 1</p>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded">
                  <h4 className="font-semibold mb-1">Equipment Grounds</h4>
                  <p className="text-sm">All grounds together = 1 of largest size</p>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded">
                  <h4 className="font-semibold mb-1">Devices</h4>
                  <p className="text-sm">Each device yoke = 2 conductors</p>
                </div>
                
                <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded">
                  <h4 className="font-semibold mb-1">Clamps</h4>
                  <p className="text-sm">All cable clamps = 1 conductor</p>
                </div>
                
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded">
                  <h4 className="font-semibold mb-1">Fittings</h4>
                  <p className="text-sm">Each stud/hickey = 1 conductor</p>
                </div>
                
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                  <h4 className="font-semibold mb-1">Don't Count</h4>
                  <p className="text-sm">• Pigtails under 6"<br/>• Pass-through conductors<br/>• Wire nuts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <BookOpen className="mr-3 h-8 w-8 text-purple-600" />
          Real-World Box Fill Examples
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example 1: Single Switch */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-400">
              Single Switch Box
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Setup:</strong> Switch controlling one light</p>
              <p><strong>Wiring:</strong> 14-2 NM in, 14-2 NM out</p>
              <p><strong>Count Breakdown:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 text-xs">
                <table className="w-full">
                  <tr><td>Hot in:</td><td className="text-right">1</td></tr>
                  <tr><td>Neutral in:</td><td className="text-right">1</td></tr>
                  <tr><td>Hot out:</td><td className="text-right">1</td></tr>
                  <tr><td>Neutral out:</td><td className="text-right">1</td></tr>
                  <tr><td>Grounds (all):</td><td className="text-right">1</td></tr>
                  <tr><td>Switch device:</td><td className="text-right">2</td></tr>
                  <tr><td>Cable clamps:</td><td className="text-right">1</td></tr>
                  <tr className="font-bold border-t"><td>Total:</td><td className="text-right">8</td></tr>
                </table>
              </div>
              <p><strong>Volume:</strong> 8 × 2.00 = 16 cu.in</p>
              <p className="text-green-700 dark:text-green-400 font-semibold">
                Box Required: 3×2×2¾" (18 cu.in)
              </p>
            </div>
          </div>

          {/* Example 2: 3-Way Switch */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-green-700 dark:text-green-400">
              3-Way Switch Location
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Setup:</strong> 3-way switch with traveler</p>
              <p><strong>Wiring:</strong> 14-2 power, 14-3 traveler</p>
              <p><strong>Count Breakdown:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 text-xs">
                <table className="w-full">
                  <tr><td>Power hot:</td><td className="text-right">1</td></tr>
                  <tr><td>Power neutral:</td><td className="text-right">1</td></tr>
                  <tr><td>Traveler 1:</td><td className="text-right">1</td></tr>
                  <tr><td>Traveler 2:</td><td className="text-right">1</td></tr>
                  <tr><td>Common:</td><td className="text-right">1</td></tr>
                  <tr><td>Neutral (14-3):</td><td className="text-right">1</td></tr>
                  <tr><td>Grounds:</td><td className="text-right">1</td></tr>
                  <tr><td>3-way switch:</td><td className="text-right">2</td></tr>
                  <tr><td>Cable clamps:</td><td className="text-right">1</td></tr>
                  <tr className="font-bold border-t"><td>Total:</td><td className="text-right">10</td></tr>
                </table>
              </div>
              <p><strong>Volume:</strong> 10 × 2.00 = 20 cu.in</p>
              <p className="text-green-700 dark:text-green-400 font-semibold">
                Box Required: 3×2×3½" (18 cu.in) tight!
              </p>
              <p className="text-yellow-600">Better: 4" square (21 cu.in)</p>
            </div>
          </div>

          {/* Example 3: GFCI Outlet */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-400">
              GFCI Outlet Protection
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Setup:</strong> GFCI protecting downstream</p>
              <p><strong>Wiring:</strong> 12-2 in, 12-2 load out</p>
              <p><strong>Count Breakdown:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 text-xs">
                <table className="w-full">
                  <tr><td>Line hot:</td><td className="text-right">1</td></tr>
                  <tr><td>Line neutral:</td><td className="text-right">1</td></tr>
                  <tr><td>Load hot:</td><td className="text-right">1</td></tr>
                  <tr><td>Load neutral:</td><td className="text-right">1</td></tr>
                  <tr><td>Grounds:</td><td className="text-right">1</td></tr>
                  <tr><td>GFCI device:</td><td className="text-right">2</td></tr>
                  <tr><td>Cable clamps:</td><td className="text-right">1</td></tr>
                  <tr className="font-bold border-t"><td>Total:</td><td className="text-right">8</td></tr>
                </table>
              </div>
              <p><strong>Volume:</strong> 8 × 2.25 = 18 cu.in</p>
              <p className="text-purple-700 dark:text-purple-400 font-semibold">
                Box Required: 3×2×3½" (18 cu.in)
              </p>
              <p className="text-orange-600">Note: GFCIs are bulky!</p>
            </div>
          </div>

          {/* Example 4: Junction Box */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-orange-700 dark:text-orange-400">
              4-Circuit Junction Box
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Setup:</strong> Splicing 4 circuits</p>
              <p><strong>Wiring:</strong> 4× 12-2 NM cables</p>
              <p><strong>Count Breakdown:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 text-xs">
                <table className="w-full">
                  <tr><td>Circuit 1 (2 cond):</td><td className="text-right">2</td></tr>
                  <tr><td>Circuit 2 (2 cond):</td><td className="text-right">2</td></tr>
                  <tr><td>Circuit 3 (2 cond):</td><td className="text-right">2</td></tr>
                  <tr><td>Circuit 4 (2 cond):</td><td className="text-right">2</td></tr>
                  <tr><td>All grounds:</td><td className="text-right">1</td></tr>
                  <tr><td>Cable clamps:</td><td className="text-right">1</td></tr>
                  <tr className="font-bold border-t"><td>Total:</td><td className="text-right">10</td></tr>
                </table>
              </div>
              <p><strong>Volume:</strong> 10 × 2.25 = 22.5 cu.in</p>
              <p className="text-orange-700 dark:text-orange-400 font-semibold">
                Box: 4" square × 1½" (21 cu.in) - Too small!
              </p>
              <p className="text-green-600">Use: 4" × 2⅛" (30.3 cu.in)</p>
            </div>
          </div>

          {/* Example 5: Multi-Gang Box */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-red-700 dark:text-red-400">
              3-Gang Switch Box
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Setup:</strong> 3 switches, one location</p>
              <p><strong>Wiring:</strong> 14-2 feed, 3× 14-2 switch legs</p>
              <p><strong>Count Breakdown:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 text-xs">
                <table className="w-full">
                  <tr><td>Feed hot:</td><td className="text-right">1</td></tr>
                  <tr><td>Feed neutral:</td><td className="text-right">1</td></tr>
                  <tr><td>3 switch legs:</td><td className="text-right">3</td></tr>
                  <tr><td>3 neutrals:</td><td className="text-right">3</td></tr>
                  <tr><td>All grounds:</td><td className="text-right">1</td></tr>
                  <tr><td>3 switches:</td><td className="text-right">6</td></tr>
                  <tr><td>Cable clamps:</td><td className="text-right">1</td></tr>
                  <tr className="font-bold border-t"><td>Total:</td><td className="text-right">16</td></tr>
                </table>
              </div>
              <p><strong>Volume:</strong> 16 × 2.00 = 32 cu.in</p>
              <p className="text-red-700 dark:text-red-400 font-semibold">
                3-gang box typically 45-50 cu.in ✓
              </p>
            </div>
          </div>

          {/* Example 6: Ceiling Fan Box */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-yellow-700 dark:text-yellow-400">
              Ceiling Fan/Light Box
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Setup:</strong> Fan with light kit</p>
              <p><strong>Wiring:</strong> 14-3 from switch, 14-2 power</p>
              <p><strong>Count Breakdown:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 text-xs">
                <table className="w-full">
                  <tr><td>Power hot:</td><td className="text-right">1</td></tr>
                  <tr><td>Power neutral:</td><td className="text-right">1</td></tr>
                  <tr><td>Fan hot:</td><td className="text-right">1</td></tr>
                  <tr><td>Light hot:</td><td className="text-right">1</td></tr>
                  <tr><td>Switch neutral:</td><td className="text-right">1</td></tr>
                  <tr><td>All grounds:</td><td className="text-right">1</td></tr>
                  <tr><td>Support fitting:</td><td className="text-right">1</td></tr>
                  <tr><td>Cable clamps:</td><td className="text-right">1</td></tr>
                  <tr className="font-bold border-t"><td>Total:</td><td className="text-right">8</td></tr>
                </table>
              </div>
              <p><strong>Volume:</strong> 8 × 2.00 = 16 cu.in</p>
              <p className="text-yellow-700 dark:text-yellow-400 font-semibold">
                Use fan-rated 4" octagon (21.5 cu.in)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Box Types and Applications */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Common Electrical Box Types & Applications
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-blue-600">Device Boxes</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">Single Gang</p>
                <p className="text-xs">Switches, outlets, dimmers</p>
                <p className="text-xs text-gray-600">18-22 cu.in typical</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">2-Gang</p>
                <p className="text-xs">Double switches/outlets</p>
                <p className="text-xs text-gray-600">30-34 cu.in typical</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">3+ Gang</p>
                <p className="text-xs">Multiple devices</p>
                <p className="text-xs text-gray-600">45+ cu.in typical</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">Old Work</p>
                <p className="text-xs">Retrofit installations</p>
                <p className="text-xs text-gray-600">Swing clamps/wings</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-green-600">Junction Boxes</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">4" Square</p>
                <p className="text-xs">Most common junction</p>
                <p className="text-xs text-gray-600">21-42 cu.in range</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">4-11/16" Square</p>
                <p className="text-xs">Larger junctions</p>
                <p className="text-xs text-gray-600">29-42 cu.in range</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">Octagonal</p>
                <p className="text-xs">Ceiling fixtures</p>
                <p className="text-xs text-gray-600">12.5-21.5 cu.in</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">Round/Pan</p>
                <p className="text-xs">Shallow ceiling boxes</p>
                <p className="text-xs text-gray-600">6-10 cu.in typical</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-purple-600">Specialty Boxes</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">Ceiling Fan</p>
                <p className="text-xs">Rated for 35-70 lbs</p>
                <p className="text-xs text-gray-600">Reinforced mounting</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">Weatherproof</p>
                <p className="text-xs">Outdoor installations</p>
                <p className="text-xs text-gray-600">NEMA 3R/4X rated</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">Floor Boxes</p>
                <p className="text-xs">In-floor receptacles</p>
                <p className="text-xs text-gray-600">Adjustable depth</p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">Arlington Boxes</p>
                <p className="text-xs">Siding/exterior</p>
                <p className="text-xs text-gray-600">Built-in mounting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Box Fill Quick Reference Chart */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Quick Box Fill Reference Chart
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2">Installation Type</th>
                  <th className="text-center py-2">#14 Count</th>
                  <th className="text-center py-2">Volume Req'd</th>
                  <th className="text-center py-2">Min Box Size</th>
                  <th className="text-center py-2">Recommended</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="py-2">Single switch</td>
                  <td className="text-center">6-8</td>
                  <td className="text-center">12-16 cu.in</td>
                  <td className="text-center">3×2×2½"</td>
                  <td className="text-center">3×2×2¾"</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2">Single outlet</td>
                  <td className="text-center">6-8</td>
                  <td className="text-center">12-16 cu.in</td>
                  <td className="text-center">3×2×2½"</td>
                  <td className="text-center">3×2×2¾"</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2">GFCI outlet</td>
                  <td className="text-center">8-10</td>
                  <td className="text-center">16-20 cu.in</td>
                  <td className="text-center">3×2×2¾"</td>
                  <td className="text-center">3×2×3½"</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2">3-way switch</td>
                  <td className="text-center">9-11</td>
                  <td className="text-center">18-22 cu.in</td>
                  <td className="text-center">3×2×3½"</td>
                  <td className="text-center">4" square</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2">Dimmer switch</td>
                  <td className="text-center">6-8</td>
                  <td className="text-center">14-18 cu.in</td>
                  <td className="text-center">3×2×2¾"</td>
                  <td className="text-center">3×2×3½"</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2">2 switches</td>
                  <td className="text-center">10-12</td>
                  <td className="text-center">20-24 cu.in</td>
                  <td className="text-center">2-gang</td>
                  <td className="text-center">2-gang deep</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2">3 switches</td>
                  <td className="text-center">14-16</td>
                  <td className="text-center">28-32 cu.in</td>
                  <td className="text-center">3-gang</td>
                  <td className="text-center">3-gang deep</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2">Junction 3 cables</td>
                  <td className="text-center">7-8</td>
                  <td className="text-center">14-16 cu.in</td>
                  <td className="text-center">4×1¼"</td>
                  <td className="text-center">4×1½"</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2">Junction 4 cables</td>
                  <td className="text-center">9-10</td>
                  <td className="text-center">18-20 cu.in</td>
                  <td className="text-center">4×1½"</td>
                  <td className="text-center">4×2⅛"</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2">Ceiling fan/light</td>
                  <td className="text-center">8-10</td>
                  <td className="text-center">16-20 cu.in</td>
                  <td className="text-center">4" oct deep</td>
                  <td className="text-center">4" oct 2⅛"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Common Violations */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <AlertTriangle className="mr-3 h-8 w-8 text-red-600" />
          Common Box Fill Violations
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-red-700 dark:text-red-400">Counting Errors</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span><strong>Forgetting device count:</strong> Each device counts as 2 conductors</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span><strong>Counting grounds separately:</strong> All grounds = 1 conductor total</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span><strong>Missing cable clamps:</strong> Internal clamps count as 1 conductor</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span><strong>Counting pigtails:</strong> Pigtails under 6" don't count</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span><strong>Wrong wire size volume:</strong> Using #14 volume for #12 wire</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-yellow-700 dark:text-yellow-400">Installation Issues</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">⚠</span>
                <span><strong>Box too shallow:</strong> GFCIs and dimmers need deeper boxes</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">⚠</span>
                <span><strong>Overstuffing:</strong> Forcing wires damages insulation</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">⚠</span>
                <span><strong>Wrong box type:</strong> Using device boxes for junctions</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">⚠</span>
                <span><strong>Multiple circuits:</strong> Not accounting for all conductors</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">⚠</span>
                <span><strong>Plastic box limits:</strong> Exceeding manufacturer ratings</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Calculators */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Related Electrical Calculators
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/calculators/conduit-fill" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Package className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold mb-1">Conduit Fill</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Calculate conduit capacity</p>
          </Link>
          
          <Link href="/calculators/wire-size-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Calculator className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-semibold mb-1">Wire Size</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Size conductors properly</p>
          </Link>
          
          <Link href="/calculators/circuit-breaker-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
            <h3 className="font-semibold mb-1">Circuit Breaker</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Size overcurrent protection</p>
          </Link>
          
          <Link href="/calculators/electrical-load-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <CheckCircle className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold mb-1">Load Calculator</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Calculate circuit loads</p>
          </Link>
        </div>
      </section>

      {/* Authority Links */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Industry Standards & Resources
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="https://www.nfpa.org/codes-and-standards/nfpa-70-national-electrical-code" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-red-700 dark:text-red-400">NFPA 70 - NEC</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Article 314.16 box fill calculations and installation requirements
            </p>
          </a>
          
          <a href="https://www.legrand.us/wiringdevices/boxes-and-brackets" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-blue-700 dark:text-blue-400">Legrand/Pass & Seymour</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Electrical box specifications and installation guides
            </p>
          </a>
          
          <a href="https://www.hubbell.com/raco/en" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-green-700 dark:text-green-400">RACO/Hubbell</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Metal electrical boxes and box fill capacity charts
            </p>
          </a>
          
          <a href="https://www.carlon.com/boxes-and-covers" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-purple-700 dark:text-purple-400">Carlon/Thomas & Betts</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Non-metallic boxes and volume specifications
            </p>
          </a>
          
          <a href="https://www.aifittings.com/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-orange-700 dark:text-orange-400">Arlington Industries</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Specialty boxes and innovative mounting solutions
            </p>
          </a>
          
          <a href="https://www.ecmweb.com/national-electrical-code/code-basics/article/20898889/box-fill-calculations" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-yellow-700 dark:text-yellow-400">EC&M Magazine</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Box fill calculation guides and code interpretations
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
              Code Compliance Required
            </h3>
            <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
              Proper box fill calculations are mandatory per NEC 314.16 and critical for electrical safety. 
              Overcrowded boxes cause overheating, damaged wire insulation, and poor connections that can lead to fires. 
              Undersized boxes make device installation difficult and may fail inspection. Always verify calculations 
              and use boxes with adequate volume ratings. Local codes may have additional requirements. 
              Consult with licensed electricians for complex installations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}