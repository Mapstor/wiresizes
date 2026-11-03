import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleFAQSchema } from '@/components/seo/ArticleFAQSchema'
import { getArticleDates } from '@/lib/article-dates';
import { formatSize, tableAmpacity } from '@/lib/calculations/sizes';
import { serviceConductors, TABLE_310_12_ROWS } from '@/lib/calculations/service-lookup';

import { Calculator, AlertTriangle, CheckCircle2, Info, Zap, Shield, Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wire Size for 200 Amp Service',
  description: '2/0 AWG copper or 4/0 AWG aluminum for a 120/240 V dwelling service (2023 NEC Table 310.12).',
  keywords: '200 amp wire size, 200 amp service wire, electrical service upgrade, NEC 200 amp requirements, 4/0 aluminum wire',
  alternates: {
    canonical: '/guides/wire-size-for-200-amp'
  }
}

// 200 A row of NEC Table 310.12 (data/verified/nec-310-12.json) and the 75 °C values of Table 310.16
const SERVICE_200A = serviceConductors(200);
const CU_200A = SERVICE_200A ? SERVICE_200A.cu : '2/0';
const AL_200A = SERVICE_200A ? SERVICE_200A.alCca : '4/0';

// Article data for schema
const articleData = {
  headline: 'Wire Size for 200 Amp Service',
  description: 'Complete guide to wire sizing for 200 amp electrical service. Learn NEC requirements, copper vs aluminum options, installation tips, and safety considerations.',
  url: 'https://wiresizes.com/guides/wire-size-for-200-amp',
  ...getArticleDates('src/app/guides/wire-size-for-200-amp/page.tsx'),
}

const faqs = [
  {
    question: "Can I use aluminum wire for 200 amp service?",
    answer: "Yes, aluminum wire is commonly used for 200 amp service. You'll need 4/0 AWG aluminum or aluminum alloy conductors. Aluminum requires rated connectors."
  },
  {
    question: "What size ground wire for 200 amp service?",
    answer: "Per NEC Table 250.66 (values from NFPA's 2020 grounding fact sheet), 200 amp service requires a 4 AWG copper or 2 AWG aluminum grounding electrode conductor. The equipment grounding conductor size depends on the overcurrent protection per NEC Table 250.122."
  },
  {
    question: "Do I need a permit to upgrade to 200 amp service?",
    answer: "Permit and licensing rules depend on where you live. Where your jurisdiction requires a permit, an inspection or a licensed electrician, those requirements apply."
  }
]

export default function WireSizeFor200AmpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Wire Size for 200 Amp Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete guide to selecting and installing the correct wire size for 200 amp electrical service 
              per 2023 NEC requirements.
            </p>
          </div>

          {/* Quick Answer Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-blue-900 mb-3">Quick Answer: 200 Amp Service Wire Size</h2>
                <p className="text-gray-700 mb-4">2/0 AWG copper or 4/0 AWG aluminum for a 120/240 V dwelling service (2023 NEC Table 310.12).</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Copper Wire</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-1">{formatSize(CU_200A)}</p>
                    <p className="text-sm text-gray-600">
                      {CU_200A} copper is {tableAmpacity(CU_200A, 'Cu', 75)} A in the 75 °C column of Table 310.16, and Table 310.12 permits it for a 200 A dwelling service.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Aluminum Wire</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-1">{formatSize(AL_200A)}</p>
                    <p className="text-sm text-gray-600">
                      {AL_200A} aluminum is {tableAmpacity(AL_200A, 'Al', 75)} A in the 75 °C column of Table 310.16, and Table 310.12 permits it for a 200 A dwelling service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Understanding 200 Amp Service */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Info className="w-5 h-5 text-purple-600" />
                </div>
                Understanding 200 Amp Service
              </h2>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  200 amp service has become the standard for modern homes, providing adequate capacity for 
                  today's electrical demands including electric vehicle charging, heat pumps, hot tubs, and 
                  multiple high-power appliances.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">When 200 Amp Service is Needed</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Electric vehicle charging installation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Heat pump or electric heating systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Hot tubs, pools, or workshop equipment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Home additions or major renovations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* NEC Requirements */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                NEC Code Requirements
              </h2>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3">Grounding Requirements</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>• Grounding electrode conductor: 4 AWG Cu or 2 AWG Al</li>
                      <li>• Equipment grounding: Based on breaker size</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Copper vs Aluminum Comparison */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Copper vs Aluminum: Detailed Comparison</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border-2 border-orange-200 rounded-lg overflow-hidden">
                  <div className="bg-orange-100 px-4 py-3">
                    <h3 className="font-semibold text-orange-900 text-lg">{formatSize(CU_200A)} Copper</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Advantages</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Superior conductivity and durability</li>
                        <li>• Smaller diameter, easier routing</li>
                        <li>• Better for long runs (less voltage drop)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Disadvantages</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Heavier and harder to pull</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3">
                    <h3 className="font-semibold text-gray-900 text-lg">4/0 AWG Aluminum</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Advantages</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Lighter weight, easier handling</li>
                        <li>• Readily available</li>
                        <li>• Proven reliability with proper installation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Disadvantages</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Larger diameter wire</li>
                        <li>• Special AL-rated connectors needed</li>
                        <li>• More expansion/contraction</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Installation Process */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wrench className="w-5 h-5 text-blue-600" />
                </div>
                Installation Process & Requirements
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Installation Guide</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">1</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Obtain Permits and Schedule Inspection</h4>
                        <p className="text-sm text-gray-600 mt-1">Apply for electrical permit from local building department. Schedule rough-in and final inspections.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">2</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Coordinate with Utility Company</h4>
                        <p className="text-sm text-gray-600 mt-1">Schedule power disconnect and reconnection. Verify meter base requirements.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">3</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Install Service Entrance Equipment</h4>
                        <p className="text-sm text-gray-600 mt-1">Mount meter base, install weatherhead, run service mast per utility requirements.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">4</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Run Service Entrance Conductors</h4>
                        <p className="text-sm text-gray-600 mt-1">Pull {CU_200A} copper or {AL_200A} aluminum through conduit.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">5</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Install Main Panel</h4>
                        <p className="text-sm text-gray-600 mt-1">Mount 200 amp panel, connect service conductors, install main breaker.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">6</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Complete Grounding System</h4>
                        <p className="text-sm text-gray-600 mt-1">Install ground rods, run grounding electrode conductor, bond water and gas pipes.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-3">Critical Installation Tips</h3>
                    <ul className="space-y-2 text-sm text-yellow-800">
                      <li>• Use proper wire pulling lubricant</li>
                      <li>• Torque all connections to manufacturer specs</li>
                      <li>• Use listed connectors rated for wire type</li>
                      <li>• Protect wire from physical damage</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-3">Common Mistakes to Avoid</h3>
                    <ul className="space-y-2 text-sm text-red-800">
                      <li>• Using undersized wire for the run length</li>
                      <li>• Mixing copper and aluminum improperly</li>
                      <li>• Insufficient torque on connections</li>
                      <li>• Improper grounding or bonding</li>
                      <li>• Not checking voltage drop calculations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Voltage Drop Calculations */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Voltage Drop Considerations</h2>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">When to Upsize Conductors</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Heavy continuous loads (EV charging, etc.)</li>
                  <li>• Voltage-sensitive equipment present</li>
                  <li>• Future expansion anticipated</li>
                  <li>• Local utility voltage fluctuations</li>
                </ul>
              </div>
            </section>

            {/* Safety Warnings */}
            <section className="bg-red-50 rounded-xl p-8 border-2 border-red-200">
              <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Critical Safety Information
              </h2>
              
              <div className="space-y-4 text-red-800">
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold mb-2">Electrical Hazards</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Service entrance work involves lethal voltages</li>
                    <li>• Power must be disconnected by utility company</li>
                    <li>• Never work on live service equipment</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold mb-2">Legal Requirements</h3>
                  <p className="text-sm">Where your jurisdiction requires a permit, an inspection or a licensed electrician, those requirements apply.</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold mb-2">Common Hazards</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Overhead power lines during installation</li>
                    <li>• Improper grounding creating shock hazards</li>
                    <li>• Aluminum connection failures from poor installation</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Calculator CTA */}
            <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200">
              <div className="text-center">
                <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Need the Wire Size for Your Circuit?
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Use our professional wire size calculator to verify the correct wire gauge for your specific 
                  installation, including voltage drop calculations.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link 
                    href="/calculators/wire-size-calculator"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Calculator className="w-5 h-5" />
                    Wire Size Calculator
                  </Link>
                  <Link 
                    href="/calculators/voltage-drop-calculator"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Voltage Drop Calculator
                  </Link>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Related Guides */}
            <section className="bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Guides</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Link href="/guides/wire-size-for-100-amp" className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-blue-600 mb-2">Wire Size for 100 Amp Service</h3>
                  <p className="text-sm text-gray-600">Learn about sizing requirements for 100 amp electrical service.</p>
                </Link>
                <Link href="/guides/wire-size-for-ev-charger" className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-blue-600 mb-2">EV Charger Wire Sizing</h3>
                  <p className="text-sm text-gray-600">Complete guide to wire sizing for electric vehicle charging stations.</p>
                </Link>
                <Link href="/guides/nec-table-310-16" className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-blue-600 mb-2">NEC Table 310.16 Guide</h3>
                  <p className="text-sm text-gray-600">Understanding ampacity tables and temperature ratings.</p>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* NEC 310.12 — the 83% dwelling-service rule */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mt-8 mb-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-3">NEC 310.12 — The 83 % Dwelling-Service Rule</h2>
        <p className="text-slate-700 mb-4">
          The single most important section of the NEC for residential
          200-amp service sizing is <strong>NEC 310.12</strong>, often
          called the &ldquo;83 % rule.&rdquo;
        </p>

        <div className="bg-white rounded-lg p-5 mb-4">
          <p className="text-sm text-slate-700">
            Specifically, Table 310.12 sizes service-entrance
            conductors and feeders that supply the entire load by allowing
            them to be sized for <strong>83 % of the service rating</strong> —
            hence the &ldquo;83 % rule&rdquo; nickname.
          </p>
        </div>

        <h3 className="font-bold text-blue-900 mb-2">NEC 310.12 Table — service / feeder conductor sizes for residential dwellings:</h3>
        <div className="bg-white rounded-lg overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 text-left">Service Rating</th>
                  <th className="px-4 py-2 text-center">Copper (AWG)</th>
                  <th className="px-4 py-2 text-center">Aluminum (AWG / kcmil)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TABLE_310_12_ROWS.map((row) => (
                  <tr key={row.ratingA} className={row.ratingA === 200 ? 'bg-blue-50 font-bold' : undefined}>
                    <td className="px-4 py-2 font-mono">{row.ratingA} A</td>
                    <td className="px-4 py-2 text-center">{formatSize(row.cu)}</td>
                    <td className="px-4 py-2 text-center">{formatSize(row.alCca)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h3 className="font-bold text-blue-900 mb-2">When NEC 310.12 does NOT apply</h3>
        <ul className="text-sm space-y-1 text-slate-700 list-disc list-inside mb-4">
          <li><strong>Multi-family dwellings serving more than one unit:</strong> the main service feeder must use full Table 310.16 ampacity. Only individual dwelling-unit feeders inside the building qualify for 310.12.</li>
          <li><strong>Commercial / industrial occupancies:</strong> retail, office, warehouse, manufacturing all use straight 310.16.</li>
          <li><strong>Three-phase services:</strong> 310.12 explicitly applies to single-phase 120/240 V dwellings only; three-phase services revert to straight 310.16.</li>
          <li><strong>208 Y / 120 V wye services:</strong> not covered by 310.12; multi-family buildings on 208 Y / 120 V cannot use the 83 % allowance for the main service.</li>
          <li><strong>Subpanel feeders that don&rsquo;t carry the entire service:</strong> only feeders supplying the entire dwelling load (typically the main service-entrance feeder from the meter to the main panel) qualify; downstream subpanels use full 310.16.</li>
        </ul>
      </div>

      <ArticleFAQSchema article={articleData} />
    </div>
  )
}