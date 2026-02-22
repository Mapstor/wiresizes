import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { FAQSchema } from '@/components/seo/FAQSchema'
import { Calculator, AlertTriangle, CheckCircle2, Info, Zap, Shield, Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wire Size for 200 Amp Service | Complete NEC Guide 2024',
  description: 'Complete guide to wire sizing for 200 amp electrical service. Learn NEC requirements, copper vs aluminum options, installation tips, and safety considerations.',
  keywords: '200 amp wire size, 200 amp service wire, electrical service upgrade, NEC 200 amp requirements, 3/0 copper wire, 4/0 aluminum wire',
  alternates: {
    canonical: 'https://wiresizes.com/guides/wire-size-for-200-amp'
  }
}

const faqs = [
  {
    question: "What wire size do I need for 200 amp service?",
    answer: "For 200 amp service at typical residential distances, you need 3/0 AWG copper wire or 4/0 AWG aluminum wire per NEC Table 310.16. These sizes are rated for 200A at 75°C temperature rating, which is standard for service entrance conductors."
  },
  {
    question: "Can I use aluminum wire for 200 amp service?",
    answer: "Yes, aluminum wire is commonly used for 200 amp service. You'll need 4/0 AWG aluminum or aluminum alloy conductors. Aluminum is more cost-effective than copper for large services but requires proper anti-oxidant compound and rated connectors."
  },
  {
    question: "What size ground wire for 200 amp service?",
    answer: "Per NEC Table 250.66, 200 amp service requires a #4 AWG copper or #2 AWG aluminum grounding electrode conductor. The equipment grounding conductor size depends on the overcurrent protection per NEC Table 250.122."
  },
  {
    question: "How much does 200 amp wire cost?",
    answer: "200 amp service wire costs vary: 3/0 copper runs $8-12 per foot, while 4/0 aluminum costs $3-5 per foot. For a typical 100-foot service run, expect $2,400-3,600 for copper or $900-1,500 for aluminum, plus installation."
  },
  {
    question: "What's the voltage drop for 200 amp service?",
    answer: "Voltage drop should not exceed 3% for feeders. At 200 amps over 100 feet, 3/0 copper has about 2.4% drop, while 4/0 aluminum has about 2.8% drop. For longer runs, you may need to upsize conductors."
  },
  {
    question: "Do I need a permit to upgrade to 200 amp service?",
    answer: "Yes, upgrading to 200 amp service requires an electrical permit in virtually all jurisdictions. The work must be performed by a licensed electrician and will require inspection before the utility company connects the service."
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
              per NEC 2024 requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Badge variant="success">NEC Compliant</Badge>
              <Badge variant="info">Residential & Commercial</Badge>
              <Badge variant="warning">Professional Guide</Badge>
            </div>
          </div>

          {/* Quick Answer Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-blue-900 mb-3">Quick Answer: 200 Amp Service Wire Size</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Copper Wire</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-1">3/0 AWG</p>
                    <p className="text-sm text-gray-600">200A @ 75°C rating</p>
                    <p className="text-xs text-gray-500 mt-1">More expensive, easier to work with</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Aluminum Wire</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-1">4/0 AWG</p>
                    <p className="text-sm text-gray-600">200A @ 75°C rating</p>
                    <p className="text-xs text-gray-500 mt-1">Cost-effective, requires special handling</p>
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
                        <span>Homes over 2,000 sq ft with electric appliances</span>
                      </li>
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

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Typical Load Calculation</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">General Lighting & Receptacles</span>
                        <span className="font-medium">30-40A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kitchen Circuits</span>
                        <span className="font-medium">40-50A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">HVAC System</span>
                        <span className="font-medium">30-50A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Water Heater</span>
                        <span className="font-medium">20-30A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">EV Charger</span>
                        <span className="font-medium">40-60A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Other Appliances</span>
                        <span className="font-medium">20-40A</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Connected Load</span>
                          <span>180-220A</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          *Actual demand typically 60-70% due to diversity
                        </p>
                      </div>
                    </div>
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
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Service Entrance Conductor Sizing</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-green-100">
                          <th className="border border-green-300 px-4 py-2 text-left">Wire Type</th>
                          <th className="border border-green-300 px-4 py-2">Size (AWG)</th>
                          <th className="border border-green-300 px-4 py-2">75°C Ampacity</th>
                          <th className="border border-green-300 px-4 py-2">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr>
                          <td className="border border-green-300 px-4 py-2 font-medium">Copper THWN</td>
                          <td className="border border-green-300 px-4 py-2 text-center font-bold">3/0</td>
                          <td className="border border-green-300 px-4 py-2 text-center">200A</td>
                          <td className="border border-green-300 px-4 py-2">Standard choice</td>
                        </tr>
                        <tr className="bg-green-50">
                          <td className="border border-green-300 px-4 py-2 font-medium">Aluminum XHHW</td>
                          <td className="border border-green-300 px-4 py-2 text-center font-bold">4/0</td>
                          <td className="border border-green-300 px-4 py-2 text-center">200A</td>
                          <td className="border border-green-300 px-4 py-2">Cost-effective option</td>
                        </tr>
                        <tr>
                          <td className="border border-green-300 px-4 py-2 font-medium">Copper THHN</td>
                          <td className="border border-green-300 px-4 py-2 text-center">2/0</td>
                          <td className="border border-green-300 px-4 py-2 text-center">175A</td>
                          <td className="border border-green-300 px-4 py-2 text-red-600">Too small</td>
                        </tr>
                        <tr className="bg-green-50">
                          <td className="border border-green-300 px-4 py-2 font-medium">Aluminum THHN</td>
                          <td className="border border-green-300 px-4 py-2 text-center">3/0</td>
                          <td className="border border-green-300 px-4 py-2 text-center">175A</td>
                          <td className="border border-green-300 px-4 py-2 text-red-600">Too small</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 text-sm text-green-800">
                    <p className="font-semibold mb-2">Key NEC References:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• NEC 230.42: Service entrance conductor sizing</li>
                      <li>• NEC 310.16: Conductor ampacity tables</li>
                      <li>• NEC 230.90: Overcurrent protection requirements</li>
                      <li>• NEC 250.66: Grounding electrode conductor sizing</li>
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3">Grounding Requirements</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>• Grounding electrode conductor: #4 Cu or #2 Al</li>
                      <li>• Equipment grounding: Based on breaker size</li>
                      <li>• Bonding jumper: Same size as GEC</li>
                      <li>• Ground rods: Two required, 6 feet apart minimum</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-3">Conduit Requirements</h3>
                    <ul className="space-y-2 text-sm text-orange-800">
                      <li>• 2" conduit for 3/0 copper (3 conductors)</li>
                      <li>• 2.5" conduit for 4/0 aluminum (3 conductors)</li>
                      <li>• Schedule 80 PVC below ground</li>
                      <li>• Weatherproof fittings at all connections</li>
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
                    <h3 className="font-semibold text-orange-900 text-lg">3/0 AWG Copper</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">✓ Advantages</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Superior conductivity and durability</li>
                        <li>• Smaller diameter, easier routing</li>
                        <li>• No special anti-oxidant required</li>
                        <li>• Better for long runs (less voltage drop)</li>
                        <li>• Higher resale value</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">✗ Disadvantages</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• 2-3x more expensive than aluminum</li>
                        <li>• Heavier and harder to pull</li>
                        <li>• Higher material cost ($8-12/ft)</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 rounded p-3">
                      <p className="text-sm font-medium text-orange-900">Typical Cost: $2,400-3,600 per 100ft</p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3">
                    <h3 className="font-semibold text-gray-900 text-lg">4/0 AWG Aluminum</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">✓ Advantages</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Significantly lower cost</li>
                        <li>• Lighter weight, easier handling</li>
                        <li>• Industry standard for services</li>
                        <li>• Readily available</li>
                        <li>• Proven reliability with proper installation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">✗ Disadvantages</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Requires anti-oxidant compound</li>
                        <li>• Larger diameter wire</li>
                        <li>• Special AL-rated connectors needed</li>
                        <li>• More expansion/contraction</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-sm font-medium text-gray-900">Typical Cost: $900-1,500 per 100ft</p>
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
                        <p className="text-sm text-gray-600 mt-1">Pull 3/0 copper or 4/0 aluminum through conduit. Apply anti-oxidant if using aluminum.</p>
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
                    <h3 className="font-semibold text-yellow-900 mb-3">⚠️ Critical Installation Tips</h3>
                    <ul className="space-y-2 text-sm text-yellow-800">
                      <li>• Use proper wire pulling lubricant</li>
                      <li>• Maintain minimum bend radius (5x cable diameter)</li>
                      <li>• Torque all connections to manufacturer specs</li>
                      <li>• Apply anti-oxidant to all aluminum connections</li>
                      <li>• Use listed connectors rated for wire type</li>
                      <li>• Protect wire from physical damage</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-3">⛔ Common Mistakes to Avoid</h3>
                    <ul className="space-y-2 text-sm text-red-800">
                      <li>• Using undersized wire for the run length</li>
                      <li>• Mixing copper and aluminum improperly</li>
                      <li>• Insufficient torque on connections</li>
                      <li>• Forgetting anti-oxidant on aluminum</li>
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
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Voltage Drop at Various Distances</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="border border-blue-300 px-4 py-2 text-left">Distance</th>
                        <th className="border border-blue-300 px-4 py-2">3/0 Copper</th>
                        <th className="border border-blue-300 px-4 py-2">4/0 Aluminum</th>
                        <th className="border border-blue-300 px-4 py-2">Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr>
                        <td className="border border-blue-300 px-4 py-2">50 feet</td>
                        <td className="border border-blue-300 px-4 py-2 text-center">1.2%</td>
                        <td className="border border-blue-300 px-4 py-2 text-center">1.4%</td>
                        <td className="border border-blue-300 px-4 py-2 text-green-600">Both OK</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="border border-blue-300 px-4 py-2">100 feet</td>
                        <td className="border border-blue-300 px-4 py-2 text-center">2.4%</td>
                        <td className="border border-blue-300 px-4 py-2 text-center">2.8%</td>
                        <td className="border border-blue-300 px-4 py-2 text-green-600">Both OK</td>
                      </tr>
                      <tr>
                        <td className="border border-blue-300 px-4 py-2">150 feet</td>
                        <td className="border border-blue-300 px-4 py-2 text-center">3.6%</td>
                        <td className="border border-blue-300 px-4 py-2 text-center">4.2%</td>
                        <td className="border border-blue-300 px-4 py-2 text-orange-600">Consider upsizing Al</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="border border-blue-300 px-4 py-2">200 feet</td>
                        <td className="border border-blue-300 px-4 py-2 text-center">4.8%</td>
                        <td className="border border-blue-300 px-4 py-2 text-center">5.6%</td>
                        <td className="border border-blue-300 px-4 py-2 text-red-600">Upsize both</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p className="text-sm text-blue-800 mt-4">
                  <strong>Note:</strong> NEC recommends maximum 3% voltage drop for feeders and 5% total for feeder plus branch circuits.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">When to Upsize Conductors</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Service runs exceeding 125 feet</li>
                  <li>• Heavy continuous loads (EV charging, etc.)</li>
                  <li>• Voltage-sensitive equipment present</li>
                  <li>• Future expansion anticipated</li>
                  <li>• Local utility voltage fluctuations</li>
                </ul>
              </div>
            </section>

            {/* Cost Analysis */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cost Analysis & Budget Planning</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-4">Typical Project Costs</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Wire (100ft run)</span>
                      <span className="font-medium">$900-3,600</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">200A Panel</span>
                      <span className="font-medium">$500-1,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Meter Base</span>
                      <span className="font-medium">$200-400</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Conduit & Fittings</span>
                      <span className="font-medium">$300-600</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Grounding Materials</span>
                      <span className="font-medium">$150-300</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Permits & Inspections</span>
                      <span className="font-medium">$200-500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Labor (if hired)</span>
                      <span className="font-medium">$2,000-4,000</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-green-900">
                        <span>Total Project Range</span>
                        <span>$4,250-10,600</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">Money-Saving Tips</h3>
                  <ul className="space-y-3 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">1.</span>
                      <span>Use aluminum wire instead of copper (save $1,500-2,100)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">2.</span>
                      <span>Buy materials yourself, hire labor only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">3.</span>
                      <span>Combine with other electrical work</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">4.</span>
                      <span>Get multiple contractor quotes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">5.</span>
                      <span>Schedule during slow seasons</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">6.</span>
                      <span>Check for utility company rebates</span>
                    </li>
                  </ul>
                </div>
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
                  <h3 className="font-semibold mb-2">⚡ Electrical Hazards</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Service entrance work involves lethal voltages</li>
                    <li>• Power must be disconnected by utility company</li>
                    <li>• Never work on live service equipment</li>
                    <li>• Use proper PPE and insulated tools</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold mb-2">📋 Legal Requirements</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Must be performed by licensed electrician</li>
                    <li>• Requires electrical permit and inspections</li>
                    <li>• Must meet all local code amendments</li>
                    <li>• Utility company coordination required</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold mb-2">⚠️ Common Hazards</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Overhead power lines during installation</li>
                    <li>• Improper grounding creating shock hazards</li>
                    <li>• Aluminum connection failures from poor installation</li>
                    <li>• Arc flash potential during energization</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Calculator CTA */}
            <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200">
              <div className="text-center">
                <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Need to Calculate Exact Wire Size?
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Use our professional wire size calculator to verify the correct wire gauge for your specific 
                  installation, including voltage drop calculations and NEC derating factors.
                </p>
                <div className="flex gap-4 justify-center">
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

      <FAQSchema items={faqs} />
    </div>
  )
}