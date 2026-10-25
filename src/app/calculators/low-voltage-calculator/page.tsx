import { Metadata } from 'next';
import { Suspense } from 'react';
import { LowVoltageCalculator } from '@/components/calculators';
import { Battery, Calculator, TrendingUp, AlertCircle, BookOpen, Zap } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';

export const metadata: Metadata = {
  title: 'Low Voltage Calculator — 12V / 24V DC',
  description: '12V and 24V DC circuit wire sizing for solar, battery banks, RV, and marine. Higher resistance per gauge requires upsized conductors.',
  keywords: 'low voltage calculator, 12v wire size, 24v dc calculator, automotive wire size, marine electrical, solar panel wiring, RV electrical, battery cable sizing',
  openGraph: {
    title: 'Low Voltage Calculator - 12V 24V DC Wire Size Calculator',
    description: 'Calculate wire size for low voltage DC systems. Automotive, marine, solar, and RV wire sizing calculator.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/low-voltage-calculator',
    images: ['/opengraph-image']
  },
  alternates: { canonical: '/calculators/low-voltage-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "Low Voltage Calculator",
  url: "https://wiresizes.com/calculators/low-voltage-calculator",
  description: "Professional low voltage DC wire calculator for 12V and 24V systems. Calculate wire size for automotive, marine, solar, and RV applications. Includes voltage drop calculations."
};

const lowVoltageFAQs = [
  {
    question: "Why are wire sizes larger in low voltage DC systems?",
    answer: "Low voltage DC systems carry much higher current for the same power level. Power = Voltage × Current, so at 12V instead of 120V, you need 10 times the current. For example, a 120W load requires 10A at 12V but only 1A at 120V. Higher current requires larger conductors to prevent excessive voltage drop and heat."
  },
  {
    question: "How do I size battery cables for automotive applications?",
    answer: "Battery cables must handle starter motor current, typically 150-400A depending on engine size. Use minimum #4 AWG for small engines, #2 AWG for mid-size, and #1/0 AWG for large engines. Keep positive and negative cables the same size and as short as possible. Consider upgrading to larger cables for performance applications."
  },
  {
    question: "What's different about marine low voltage wiring?",
    answer: "Marine wiring requires tinned copper conductors and appropriate insulation for marine environments. ABYC standards require larger wire sizes than automotive due to safety considerations. All connections must be waterproof, and circuits should have proper overcurrent protection. Use marine-grade wire rated for the environment (engine room, bilge, etc.)."
  }
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
              Calculate wire sizes for 12V and 24V DC systems. Professional tool for automotive, 
              marine, solar, and RV electrical applications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Battery className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">DC Power Systems</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Specialized calculations for 12V, 24V, and 48V DC electrical systems.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Calculator className="h-12 w-12 text-cyan-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multiple Applications</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automotive, marine, solar, RV, and off-grid system wire sizing.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Precision Results</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Accurate wire sizing with voltage drop calculations and safety factors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="mb-16">
        <Suspense fallback={<div>Loading calculator...</div>}>
          <LowVoltageCalculator />
        </Suspense>
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
              Low voltage DC systems operate at voltages below 50V DC and are commonly found in automotive, 
              marine, solar, and mobile applications. Unlike AC systems, DC power flows in one direction and 
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

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Common Low Voltage Applications
            </h3>
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">Automotive Systems</h4>
                <ul className="list-disc pl-4 space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>Engine control modules</li>
                  <li>Lighting circuits</li>
                  <li>Audio/entertainment systems</li>
                  <li>Charging systems</li>
                  <li>Starter motor circuits</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">Marine Electronics</h4>
                <ul className="list-disc pl-4 space-y-1 text-purple-700 dark:text-purple-300 text-sm">
                  <li>Navigation equipment</li>
                  <li>Radio communications</li>
                  <li>Fish finders/sonar</li>
                  <li>Bilge pumps</li>
                  <li>Cabin lighting</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-3">Solar/RV Systems</h4>
                <ul className="list-disc pl-4 space-y-1 text-orange-700 dark:text-orange-300 text-sm">
                  <li>Solar panel wiring</li>
                  <li>Battery bank connections</li>
                  <li>Inverter DC connections</li>
                  <li>LED lighting systems</li>
                  <li>DC appliances</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application-Specific Guidelines */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Application-Specific Wiring Guidelines
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Battery className="h-6 w-6 text-blue-600" />
                  Automotive Wiring Standards
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">SAE Standards:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use SAE J1128 rated automotive wire</li>
                      <li>• Temperature rating: -40°F to +200°F</li>
                      <li>• Voltage rating: 50V or higher for 12V systems</li>
                      <li>• Cross-linked polyethylene (XLPE) insulation preferred</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Protection Requirements:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Fuse within 18" of battery positive</li>
                      <li>• Use weatherproof fuse holders</li>
                      <li>• Ground connections to chassis or dedicated ground</li>
                      <li>• Protect wiring from heat, sharp edges, and moisture</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Zap className="h-6 w-6 text-cyan-600" />
                  Marine Electrical Standards
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">ABYC Requirements:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use tinned copper conductors only</li>
                      <li>• Marine-grade adhesive-lined heat shrink</li>
                      <li>• Voltage drop limited to 10% for lighting, 3% for electronics</li>
                      <li>• All connections above bilge level when possible</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Environmental Considerations:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use proper wire support every 18" maximum</li>
                      <li>• Seal all penetrations through bulkheads</li>
                      <li>• Route wiring away from bilge and exhaust</li>
                      <li>• Label all circuits at panel and connections</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                  Solar/Off-Grid Systems
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">NEC Article 690:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use THWN-2 or USE-2 for outdoor wiring</li>
                      <li>• Size conductors for 125% of maximum current</li>
                      <li>• Provide disconnects within sight of equipment</li>
                      <li>• Use properly rated DC circuit breakers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">System Design:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Keep DC wiring runs as short as possible</li>
                      <li>• Use MC4 connectors for panel connections</li>
                      <li>• Install proper grounding electrode system</li>
                      <li>• Consider rapid shutdown requirements</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-purple-600" />
                  RV/Mobile Applications
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">RVIA Standards:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use stranded copper wire for flexibility</li>
                      <li>• Secure wiring every 4.5 feet maximum</li>
                      <li>• Protect against vibration and movement</li>
                      <li>• Use appropriate connector types for environment</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Installation Practices:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Route wiring through protected raceways</li>
                      <li>• Use service loops at moving connections</li>
                      <li>• Install battery disconnect in accessible location</li>
                      <li>• Provide adequate ventilation for batteries</li>
                    </ul>
                  </div>
                </div>
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
                    <span className="text-gray-600 dark:text-gray-400">Copper vs Aluminum:</span>
                    <span className="text-gray-800 dark:text-gray-200">Always use copper for DC</span>
                  </div>
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ohms Law Calculator</h3>
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