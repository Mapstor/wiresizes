import { Metadata } from 'next';
import { LowVoltageCalculator } from '@/components/calculators/LowVoltageCalculator';
import { Battery, Calculator, TrendingUp, AlertCircle, BookOpen, Zap } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { Sources } from '@/components/content/Sources';
import { DOMAINS as DC_SIZING_DOMAINS } from '@/lib/calculations/dc-sizing';
import { DOMAINS as VOLTAGE_DROP_DOMAINS } from '@/lib/calculations/voltage-drop';

// Sources: the domains of the engines this page uses (the calculator's targets come from voltage-drop.ts)
const SOURCE_DOMAINS = [...DC_SIZING_DOMAINS, ...VOLTAGE_DROP_DOMAINS];

export const metadata: Metadata = {
  title: 'Low Voltage Calculator — 12V / 24V DC',
  description: 'Wire size for 12 V and 24 V DC circuits from voltage drop and current: copper, NEC Table 310.16, 60 °C column.',
  keywords: 'low voltage calculator, 12v wire size, 24v dc calculator',
  openGraph: {
    title: 'Low Voltage Calculator - 12V 24V DC Wire Size Calculator',
    description: 'Wire size for 12 V and 24 V DC circuits from voltage drop and current: copper, NEC Table 310.16, 60 °C column.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/low-voltage-calculator',
    siteName: 'WireSizes.com',
    images: ['/opengraph-image']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Low Voltage Calculator - 12V 24V DC Wire Size Calculator',
    description: 'Wire size for 12 V and 24 V DC circuits from voltage drop and current: copper, NEC Table 310.16, 60 °C column.',
    images: ['/twitter-image']
  },
  alternates: { canonical: '/calculators/low-voltage-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "Low Voltage Calculator",
  url: "https://wiresizes.com/calculators/low-voltage-calculator",
  description: "Wire size for 12 V and 24 V DC circuits from voltage drop and current: copper, NEC Table 310.16, 60 °C column."
};

const lowVoltageFAQs = [
  {
    question: "Why are wire sizes larger in low voltage DC systems?",
    answer: "Low voltage DC systems carry much higher current for the same power level. Power = Voltage × Current, so at 12V instead of 120V, you need 10 times the current. For example, a 120W load requires 10A at 12V but only 1A at 120V. Higher current requires larger conductors to prevent excessive voltage drop and heat."
  },
];

export default function LowVoltageCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CombinedSchema 
        webApp={webAppData} 
      />
      
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Low Voltage Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Calculate wire sizes for 12V and 24V DC systems.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="mb-16">
        <LowVoltageCalculator />
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
              Unlike AC systems, DC power flows in one direction and
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
                  Disclaimer
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This calculator provides estimates for DC low voltage systems. Always consult manufacturer 
                  specifications, applicable codes, and qualified professionals. Installation should comply with 
                  local electrical codes and manufacturer requirements.
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

      {/* Sources */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <Sources
            domains={SOURCE_DOMAINS}
            headingClassName="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
            listClassName="space-y-2 text-gray-700 dark:text-gray-300"
            linkClassName="text-blue-600 hover:underline dark:text-blue-300"
            noteClassName="mt-4 text-sm text-gray-600 dark:text-gray-400"
          />
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
              href="/calculators/ohms-law-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ohm&apos;s Law Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Calculate voltage, current, resistance, and power
              </p>
            </Link>

            <Link 
              href="/calculators/watts-to-amps-calculator"
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

          </div>
        </div>
      </section>

    </div>
  );
}