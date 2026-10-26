import { Metadata } from 'next';
import ServiceEntranceCalculator from '@/components/calculators/ServiceEntranceCalculator';
import { Building, Shield, Zap, Calculator, Users } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';

export const metadata: Metadata = {
  title: 'Service Entrance — NEC 310.12',
  description: "120/240 V single-phase dwelling service or main power feeder, NEC Table 310.12 (2023). Grounding electrode conductor from NEC Table 250.66 (values from NFPA's 2020 grounding fact sheet).",
  keywords: 'service entrance calculator, service wire size, NEC 310.12, 200 amp service wire',
  alternates: { canonical: '/calculators/service-entrance-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "Service Entrance Calculator",
  url: "https://wiresizes.com/calculators/service-entrance-calculator",
  description: "120/240 V single-phase dwelling service or main power feeder, NEC Table 310.12 (2023). Grounding electrode conductor from NEC Table 250.66 (values from NFPA's 2020 grounding fact sheet)."
};

const COMPREHENSIVE_FAQS = [
  {
    question: 'What size wire do I need for 200 amp service entrance?',
    answer: 'For 200A residential service entrance, NEC Table 310.12 allows 2/0 AWG copper or 4/0 AWG aluminum for dwelling services.'
  },
  {
    question: 'What size ground wire for service entrance?',
    answer: 'Grounding electrode conductor sizing per NEC Table 250.66: 100A service needs 8 AWG copper, 200A needs 4 AWG copper, 400A needs 1/0 AWG copper.'
  },
];

export default function ServiceEntranceCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CombinedSchema webApp={webAppData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Service Entrance Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-purple-50">
                120/240 V single-phase dwelling service or main power feeder, NEC Table 310.12 (2023).
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="font-semibold">NEC Table 310.12 & Table 250.66</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Service Range</div>
                  <div className="font-semibold">100A to 400A</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <ServiceEntranceCalculator />

          {/* FAQs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {COMPREHENSIVE_FAQS.map((faq, idx) => (
                <details key={idx} className="group bg-gray-50 rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-100 rounded-lg">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Related calculators</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Wire Size</h3>
                <p className="text-sm text-gray-600">General wire sizing</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Voltage Drop</h3>
                <p className="text-sm text-gray-600">Check voltage loss</p>
              </Link>
              
              <Link href="/calculators/ground-wire-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Grounding</h3>
                <p className="text-sm text-gray-600">Ground wire sizing</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}