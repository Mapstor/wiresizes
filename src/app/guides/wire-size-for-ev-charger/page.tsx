import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { FAQSchema } from '@/components/seo/FAQSchema'
import { Car, Zap, AlertTriangle, CheckCircle2, Info, Shield, Calculator, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'EV Charger Wire Size Guide | Level 1, 2 & 3 Charging Requirements',
  description: 'Complete guide to wire sizing for EV chargers. Learn NEC Article 625 requirements for Level 1, Level 2, and DC fast charging installations with safety tips.',
  keywords: 'EV charger wire size, electric vehicle charging, Level 2 charger wire, NEC 625, Tesla charger wire size, 50 amp EV circuit',
  alternates: {
    canonical: 'https://wiresizes.com/guides/wire-size-for-ev-charger'
  }
}

const faqs = [
  {
    question: "What wire size do I need for a Level 2 EV charger?",
    answer: "Most Level 2 EV chargers require 6 AWG copper or 4 AWG aluminum wire for 50 amp circuits, or 8 AWG copper / 6 AWG aluminum for 40 amp circuits. Per NEC 625.42, the circuit must be sized at 125% of the charger's maximum current rating."
  },
  {
    question: "Can I install a 50 amp EV charger on a 100 amp panel?",
    answer: "It depends on your total electrical load. A 50A EV charger requires a 62.5A circuit capacity (125% per NEC). If your existing loads plus the EV charger don't exceed 80% of your 100A service, it may work. Most homes need 200A service for Level 2 charging."
  },
  {
    question: "What's the difference between hardwired and plug-in EV chargers?",
    answer: "Hardwired chargers connect directly to the electrical panel and can use the full circuit capacity. Plug-in chargers use a NEMA 14-50 or 6-50 outlet and are limited to 80% continuous load (40A on a 50A circuit). Hardwired installations are more reliable but less flexible."
  },
  {
    question: "Do I need a GFCI breaker for EV charging?",
    answer: "NEC 625.54 requires GFCI protection for all EV charger outlets. Hardwired chargers may have built-in GFCI protection. For outdoor installations, GFCI protection is always required regardless of the connection type."
  },
  {
    question: "How far can I run wire for an EV charger?",
    answer: "Distance depends on wire size and acceptable voltage drop. For a 50A charger with 6 AWG copper, runs up to 75 feet typically stay under 3% voltage drop. Longer runs require larger wire: 4 AWG for 100-150 feet, 2 AWG for 150-200 feet."
  },
  {
    question: "Can I share a circuit between two EV chargers?",
    answer: "Yes, with proper load management per NEC 625.42. Automatic Load Management Systems (ALMS) can share power between multiple chargers, preventing overload. Each charger must still have proper overcurrent protection."
  }
]

export default function WireSizeForEVChargerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Car className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              EV Charger Wire Size Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete guide to selecting the right wire size for electric vehicle charging stations, 
              from Level 1 to DC fast charging, following NEC Article 625 requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Badge variant="success">NEC Article 625</Badge>
              <Badge variant="info">All EV Brands</Badge>
              <Badge variant="warning">Professional Guide</Badge>
            </div>
          </div>

          {/* Quick Reference Table */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Wire Size Reference</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-white">
                        <th className="border border-gray-300 px-4 py-2 text-left">Charger Type</th>
                        <th className="border border-gray-300 px-4 py-2">Current</th>
                        <th className="border border-gray-300 px-4 py-2">Breaker</th>
                        <th className="border border-gray-300 px-4 py-2">Copper Wire</th>
                        <th className="border border-gray-300 px-4 py-2">Aluminum Wire</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Level 1 (120V)</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">12A</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">15A</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-bold">14 AWG</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">12 AWG</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Level 2 (240V/32A)</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">32A</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">40A</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-bold">8 AWG</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">6 AWG</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Level 2 (240V/40A)</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">40A</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">50A</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-bold">8 AWG</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">6 AWG</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Level 2 (240V/48A)</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">48A</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">60A</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-bold">6 AWG</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">4 AWG</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Level 2 (240V/80A)</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">80A</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">100A</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-bold">3 AWG</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">1 AWG</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p className="text-sm text-gray-600 mt-3">
                  * Circuit must be sized at 125% of continuous load per NEC 625.42
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Understanding EV Charging Levels */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                Understanding EV Charging Levels
              </h2>

              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-yellow-700">L1</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Level 1 Charging</h3>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 120V standard outlet</li>
                      <li>• 12-16 amp current</li>
                      <li>• 1.4-1.9 kW power</li>
                      <li>• 3-5 miles range/hour</li>
                      <li>• No special wiring needed</li>
                    </ul>
                    <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                      Best for: Overnight charging, PHEVs
                    </div>
                  </div>

                  <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-green-700">L2</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Level 2 Charging</h3>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 240V dedicated circuit</li>
                      <li>• 16-80 amp current</li>
                      <li>• 3.8-19.2 kW power</li>
                      <li>• 12-60 miles range/hour</li>
                      <li>• Professional installation</li>
                    </ul>
                    <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-800">
                      Best for: Home & workplace charging
                    </div>
                  </div>

                  <div className="border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-700">L3</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">DC Fast Charging</h3>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 400-900V DC</li>
                      <li>• 50-350+ kW power</li>
                      <li>• 100-200+ amp current</li>
                      <li>• 60-200 miles in 20 min</li>
                      <li>• Commercial only</li>
                    </ul>
                    <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                      Best for: Highway corridors, fleets
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Charging Speed Comparison</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">Level 1 (120V/12A)</span>
                        <span className="text-sm font-medium">40 hours for 150 miles</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">Level 2 (240V/32A)</span>
                        <span className="text-sm font-medium">6 hours for 150 miles</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">Level 2 (240V/48A)</span>
                        <span className="text-sm font-medium">4 hours for 150 miles</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">DC Fast (50kW)</span>
                        <span className="text-sm font-medium">30 min for 150 miles</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* NEC Article 625 Requirements */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                NEC Article 625 Requirements
              </h2>

              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Key Code Requirements</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">625.42 - Continuous Load Sizing</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        EV charging is considered a continuous load. Circuits must be sized at 125% of the maximum current.
                      </p>
                      <div className="bg-green-100 rounded p-2 text-xs">
                        <strong>Example:</strong> 40A charger requires 50A circuit (40A × 1.25 = 50A)
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">625.54 - GFCI Protection</h4>
                      <p className="text-sm text-gray-700">
                        All receptacles for EV charging must have GFCI protection. Hardwired units may have built-in GFCI.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">625.44 - Equipment Connection</h4>
                      <p className="text-sm text-gray-700">
                        Chargers can be cord-and-plug connected (≤50A) or permanently connected (any rating).
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">625.17 - Cable Length</h4>
                      <p className="text-sm text-gray-700">
                        Charging cable length limited to 25 feet unless equipped with cable management system.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3">Indoor Installation</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>• Height: 18" min, 48" max above floor</li>
                      <li>• Ventilation not required for Level 2</li>
                      <li>• Working clearance per NEC 110.26</li>
                      <li>• GFCI required for receptacles</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-3">Outdoor Installation</h3>
                    <ul className="space-y-2 text-sm text-orange-800">
                      <li>• NEMA 3R or 4X enclosure required</li>
                      <li>• GFCI protection mandatory</li>
                      <li>• In-use weatherproof cover for outlets</li>
                      <li>• Consider freeze protection in cold climates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Common EV Charger Installations */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular EV Charger Installations</h2>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tesla Wall Connector</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Gen 3 Specifications</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Max current: 48A (60A circuit)</li>
                        <li>• Power output: 11.5 kW</li>
                        <li>• Wire required: 6 AWG copper</li>
                        <li>• Hardwired installation</li>
                        <li>• Built-in GFCI & load sharing</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="font-medium text-blue-900 mb-2">Installation Tips</h4>
                      <ul className="text-xs text-blue-800 space-y-1">
                        <li>• Can configure for 15-60A circuits</li>
                        <li>• WiFi connectivity for updates</li>
                        <li>• Multiple units can share circuit</li>
                        <li>• 24-foot cable standard</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">NEMA 14-50 Outlet</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Standard Installation</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• 50A circuit (40A continuous)</li>
                        <li>• 6 AWG copper wire</li>
                        <li>• 4-wire connection (2 hots, neutral, ground)</li>
                        <li>• Industrial-grade outlet required</li>
                        <li>• Compatible with most portable chargers</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <h4 className="font-medium text-green-900 mb-2">Advantages</h4>
                      <ul className="text-xs text-green-800 space-y-1">
                        <li>• Universal compatibility</li>
                        <li>• Portable charger flexibility</li>
                        <li>• Can be used for RVs/welders</li>
                        <li>• Easy charger replacement</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">ChargePoint Home Flex</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Specifications</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Adjustable: 16-50A</li>
                        <li>• NEMA 14-50 or hardwired</li>
                        <li>• 6 AWG for 50A circuit</li>
                        <li>• WiFi enabled</li>
                        <li>• 23-foot cable</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <h4 className="font-medium text-purple-900 mb-2">Features</h4>
                      <ul className="text-xs text-purple-800 space-y-1">
                        <li>• Scheduled charging</li>
                        <li>• Energy monitoring</li>
                        <li>• Alexa compatible</li>
                        <li>• Outdoor rated</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Wire Sizing for Distance */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Wire Sizing for Long Runs</h2>
              
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">Voltage Drop Considerations</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-yellow-100">
                        <th className="border border-yellow-300 px-3 py-2 text-left">Distance</th>
                        <th className="border border-yellow-300 px-3 py-2" colSpan={2}>40A Circuit</th>
                        <th className="border border-yellow-300 px-3 py-2" colSpan={2}>50A Circuit</th>
                        <th className="border border-yellow-300 px-3 py-2" colSpan={2}>60A Circuit</th>
                      </tr>
                      <tr className="bg-yellow-100">
                        <th className="border border-yellow-300 px-3 py-2"></th>
                        <th className="border border-yellow-300 px-3 py-2">Copper</th>
                        <th className="border border-yellow-300 px-3 py-2">Aluminum</th>
                        <th className="border border-yellow-300 px-3 py-2">Copper</th>
                        <th className="border border-yellow-300 px-3 py-2">Aluminum</th>
                        <th className="border border-yellow-300 px-3 py-2">Copper</th>
                        <th className="border border-yellow-300 px-3 py-2">Aluminum</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr>
                        <td className="border border-yellow-300 px-3 py-2 font-medium">0-50 ft</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">8 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">6 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">6 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">4 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">6 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">4 AWG</td>
                      </tr>
                      <tr className="bg-yellow-50">
                        <td className="border border-yellow-300 px-3 py-2 font-medium">50-100 ft</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">6 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">4 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">4 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">2 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">4 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">2 AWG</td>
                      </tr>
                      <tr>
                        <td className="border border-yellow-300 px-3 py-2 font-medium">100-150 ft</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">4 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">2 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">3 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">1 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">2 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">1/0 AWG</td>
                      </tr>
                      <tr className="bg-yellow-50">
                        <td className="border border-yellow-300 px-3 py-2 font-medium">150-200 ft</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">3 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">1 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">2 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">1/0 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">1 AWG</td>
                        <td className="border border-yellow-300 px-3 py-2 text-center">2/0 AWG</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p className="text-sm text-yellow-800 mt-4">
                  * Sizes shown maintain &lt;3% voltage drop at 240V
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Cost-Saving Tips for Long Runs</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Consider aluminum wire for runs over 75 feet (saves 40-60% on wire cost)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Install a subpanel closer to charging location for very long runs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Use direct burial cable instead of conduit where allowed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Consider lower amperage charger if distance is extreme</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Load Management */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                Load Management & Panel Capacity
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Panel Capacity Assessment</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Quick Calculation Method</h4>
                    <ol className="text-sm text-gray-700 space-y-2">
                      <li>1. Main panel rating (e.g., 200A)</li>
                      <li>2. Subtract existing loads (use actual or NEC calc)</li>
                      <li>3. Apply 80% rule for continuous loads</li>
                      <li>4. Remaining capacity = Available for EV</li>
                    </ol>
                    
                    <div className="mt-3 p-2 bg-blue-100 rounded">
                      <p className="text-xs text-blue-900">
                        <strong>Example:</strong> 200A panel - 140A loads = 60A available<br/>
                        60A × 0.8 = 48A max EV charger (40A continuous)
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Load Management Solutions</h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <h4 className="font-medium text-green-900 mb-1">Smart Load Sharing</h4>
                      <p className="text-xs text-green-800">Multiple EVs share one circuit using communication between chargers</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="font-medium text-blue-900 mb-1">Time-of-Use Scheduling</h4>
                      <p className="text-xs text-blue-800">Charge during off-peak hours for lower rates and reduced grid stress</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <h4 className="font-medium text-purple-900 mb-1">Dynamic Load Management</h4>
                      <p className="text-xs text-purple-800">Automatically adjusts charging based on home's total electrical usage</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-orange-900 mb-3">When to Upgrade Service</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-orange-800">
                  <div>
                    <h4 className="font-medium mb-2">Consider 200A Upgrade If:</h4>
                    <ul className="space-y-1">
                      <li>• Current service is 100A or less</li>
                      <li>• Adding Level 2 charger (32A+)</li>
                      <li>• Multiple EVs in household</li>
                      <li>• Electric heat/hot water</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Consider 400A Service If:</h4>
                    <ul className="space-y-1">
                      <li>• Two or more fast chargers needed</li>
                      <li>• All-electric home over 3000 sq ft</li>
                      <li>• Home business with equipment</li>
                      <li>• Future solar + battery system</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Installation Costs */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Installation Cost Breakdown</h2>
              
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Component</th>
                        <th className="border border-gray-300 px-4 py-2">Basic Install</th>
                        <th className="border border-gray-300 px-4 py-2">Complex Install</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Charger Unit</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$400-600</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$600-1,200</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Wire (6 AWG, 30 ft)</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$150-200</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$300-600</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Circuit Breaker</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$50-75</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$75-150</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Conduit & Fittings</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$50-100</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$200-400</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Permit</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$100-200</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$150-300</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Labor (4-6 hours)</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$400-600</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$800-1,500</td>
                      </tr>
                      <tr className="font-semibold bg-green-50">
                        <td className="border border-gray-300 px-4 py-2">Total Range</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$1,150-1,775</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">$2,125-4,150</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-3">Available Incentives</h3>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li>• Federal tax credit: 30% up to $1,000</li>
                      <li>• State rebates: $250-1,500 (varies)</li>
                      <li>• Utility rebates: $200-800</li>
                      <li>• Time-of-use rate discounts</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3">Cost-Saving Tips</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>• Combine with other electrical work</li>
                      <li>• Install during construction/renovation</li>
                      <li>• Choose plug-in over hardwired</li>
                      <li>• Consider lower amperage if adequate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Safety Considerations */}
            <section className="bg-red-50 rounded-xl p-8 border-2 border-red-200">
              <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Critical Safety Considerations
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-3">Installation Safety</h3>
                  <ul className="text-sm text-red-800 space-y-2">
                    <li>• Must be installed by licensed electrician</li>
                    <li>• Permit and inspection required</li>
                    <li>• GFCI protection mandatory</li>
                    <li>• Proper grounding essential</li>
                    <li>• Torque connections to spec</li>
                    <li>• Use copper-rated or dual-rated lugs</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-3">Operational Safety</h3>
                  <ul className="text-sm text-red-800 space-y-2">
                    <li>• Inspect cable regularly for damage</li>
                    <li>• Keep connector clean and dry</li>
                    <li>• Don't use extension cords</li>
                    <li>• Ensure proper ventilation</li>
                    <li>• Install surge protection</li>
                    <li>• Follow manufacturer guidelines</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Common Installation Mistakes</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Undersizing wire for actual distance</li>
                  <li>• Using standard outlet instead of industrial grade</li>
                  <li>• Improper torque on connections causing overheating</li>
                  <li>• Missing GFCI protection</li>
                  <li>• Inadequate panel capacity assessment</li>
                </ul>
              </div>
            </section>

            {/* Calculator CTA */}
            <section className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border-2 border-green-200">
              <div className="text-center">
                <Calculator className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Calculate Your EV Charger Wire Size
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Use our specialized calculators to determine the exact wire size needed for your EV charger 
                  installation, including voltage drop calculations for long runs.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link 
                    href="/calculators/ev-charger-wire-size-calculator"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Car className="w-5 h-5" />
                    EV Charger Calculator
                  </Link>
                  <Link 
                    href="/calculators/wire-size-calculator"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Calculator className="w-5 h-5" />
                    Wire Size Calculator
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

            {/* Related Resources */}
            <section className="bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Resources</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Link href="/guides/wire-size-for-200-amp" className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-blue-600 mb-2">200 Amp Service Guide</h3>
                  <p className="text-sm text-gray-600">Upgrading to 200A service for EV charging and modern homes.</p>
                </Link>
                <Link href="/guides/nec-code-compliance" className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-blue-600 mb-2">NEC Code Compliance</h3>
                  <p className="text-sm text-gray-600">Understanding electrical code requirements for safe installations.</p>
                </Link>
                <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-blue-600 mb-2">Voltage Drop Calculator</h3>
                  <p className="text-sm text-gray-600">Calculate voltage drop for long wire runs to EV chargers.</p>
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