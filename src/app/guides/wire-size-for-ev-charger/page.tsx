import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { ArticleSchema } from '@/components/seo/ArticleSchema'
import { articleDates } from '@/lib/page-dates';
import { Byline } from '@/components/content/Byline';

import { Car, Zap, AlertTriangle, Shield, Calculator } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wire Size for EV Charger — Level 2',
  description: 'Wire size for Level 2 EV chargers (NEC 625.42): 6 AWG cu standard for 50 A.',
  keywords: 'EV charger wire size, electric vehicle charging, Level 2 charger wire, NEC 625, 50 amp EV circuit',
  alternates: {
    canonical: '/guides/wire-size-for-ev-charger'
  }
}

// Article data for schema
const articleData = {
  headline: 'EV Charger Wire Size Guide',
  description: 'Complete guide to wire sizing for EV chargers. Learn NEC Article 625 requirements for Level 1, Level 2, and DC fast charging installations with safety tips.',
  url: 'https://wiresizes.com/guides/wire-size-for-ev-charger',
  ...articleDates('/guides/wire-size-for-ev-charger'),
}

const faqs = [
  {
    question: "What wire size do I need for a Level 2 EV charger?",
    answer: "Most Level 2 EV chargers require 6 AWG copper or 4 AWG aluminum wire for 50 amp circuits, or 8 AWG copper / 6 AWG aluminum for 40 amp circuits."
  },
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
            <Byline route="/guides/wire-size-for-ev-charger" className="mb-4 text-sm text-gray-600" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete guide to selecting the right wire size for electric vehicle charging stations, 
              from Level 1 to DC fast charging, following NEC Article 625 requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Badge variant="success">NEC Article 625</Badge>
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
                      <li>• 120 V standard outlet</li>
                      <li>• 12-16 amp current</li>
                      <li>• 1.4-1.9 kW power</li>
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
                      <li>• 240 V dedicated circuit</li>
                      <li>• 16-80 amp current</li>
                      <li>• 3.8-19.2 kW power</li>
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
                      <li>• 400-900 V DC</li>
                      <li>• 50-350+ kW power</li>
                      <li>• Commercial only</li>
                    </ul>
                    <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                      Best for: Highway corridors, fleets
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
                      <h4 className="font-semibold text-gray-900 mb-2">625.42 - Continuous Load</h4>
                      <p className="text-sm text-gray-700">
                        EV charging is considered a continuous load.
                      </p>
                    </div>
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
                        <li>• Max current: 48 A (60 A circuit)</li>
                        <li>• Power output: 11.5 kW</li>
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
                        <li>• 50 A circuit</li>
                        <li>• 6 AWG copper wire</li>
                        <li>• 4-wire connection (2 hots, neutral, ground)</li>
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
                        <li>• Adjustable: 16-50 A</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Federal credit */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    The federal home-charger credit (IRS §30C) covered equipment placed in service from January 1, 2023 through June 30, 2026, at homes in eligible census tracts.
                  </p>
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
                <h3 className="font-semibold text-yellow-900 mb-2">Common Installation Mistakes</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Undersizing wire for actual distance</li>
                  <li>• Improper torque on connections causing overheating</li>
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
                  Use the wire size calculator for your charger circuit and the voltage drop calculator for long runs.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
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
                  <h3 data-name="" className="font-semibold text-blue-600 mb-2">200 Amp Service Guide</h3>
                  <p className="text-sm text-gray-600">Upgrading to 200 A service for EV charging and modern homes.</p>
                </Link>
                <Link href="/guides/nec-code-compliance" className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h3 data-name="" className="font-semibold text-blue-600 mb-2">NEC Edition by State</h3>
                  <p className="text-sm text-gray-600">Which edition of the electrical code each state has adopted, and since when.</p>
                </Link>
                <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h3 data-name="" className="font-semibold text-blue-600 mb-2">Voltage Drop Calculator</h3>
                  <p className="text-sm text-gray-600">Calculate voltage drop for long wire runs to EV chargers.</p>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      <ArticleSchema article={articleData} />
    </div>
  )
}