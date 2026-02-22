import { Metadata } from 'next';
import { Suspense } from 'react';
import { BTUToWattsCalculator } from '@/components/calculators';
import { Flame, Calculator, TrendingUp, AlertCircle, BookOpen, Snowflake } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'BTU to Watts Calculator | Convert BTU/hr to Electrical Power | HVAC Calculator',
  description: 'Professional BTU to watts converter for HVAC and electrical systems. Convert British Thermal Units to electrical power for heating, cooling, and energy calculations. Essential for electricians and HVAC technicians.',
  keywords: 'btu to watts, btu/hr to watts, hvac calculator, heating cooling conversion, thermal to electrical, energy converter, heat pump sizing, air conditioner watts',
  openGraph: {
    title: 'BTU to Watts Calculator - HVAC & Electrical Power Conversion',
    description: 'Convert BTU/hr to watts for HVAC equipment sizing and electrical load calculations. Professional tool for heating and cooling systems.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/btu-to-watts-calculator',
  },
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "BTU to Watts Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Convert BTU/hr to watts for HVAC and heating equipment electrical requirements.",
  "keywords": "BTU to watts, heating conversion, HVAC calculator",
  "url": `https://wiresizes.com/calculators/btu-to-watts-calculator`,
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

const btuToWattsFAQs = [
  {
    question: "How do I convert BTU to watts?",
    answer: "To convert BTU/hr to watts, multiply by 0.293071. For example, 12,000 BTU/hr × 0.293071 = 3,517 watts. This is the thermal power output. For electrical consumption, divide by the system's COP or EER rating. A 12,000 BTU AC with EER 10 uses 1,200 watts of electricity."
  },
  {
    question: "What's the difference between BTU thermal output and electrical watts consumed?",
    answer: "BTU thermal output is the heating or cooling capacity, while electrical watts consumed is the power drawn from the electrical system. Heat pumps and AC units move more heat energy than they consume in electricity. A heat pump with COP 3.0 provides 3 watts of heating for every 1 watt of electricity consumed."
  },
  {
    question: "How many BTUs equal 1 ton of cooling?",
    answer: "One ton of cooling equals 12,000 BTU/hr. This comes from the amount of heat required to melt one ton of ice in 24 hours. Common residential AC sizes are 1.5 tons (18,000 BTU), 2 tons (24,000 BTU), 2.5 tons (30,000 BTU), 3 tons (36,000 BTU), and 5 tons (60,000 BTU)."
  },
  {
    question: "What is COP and how does it affect BTU to watts conversion?",
    answer: "COP (Coefficient of Performance) is the ratio of heating/cooling output to electrical input. For heating: COP = BTU output ÷ (watts input × 3.412). Modern heat pumps have COPs of 2.5-4.0. Higher COP means more efficiency. To find electrical watts: Watts = (BTU/hr × 0.293071) ÷ COP."
  },
  {
    question: "How do I size electrical circuits for HVAC equipment rated in BTUs?",
    answer: "First convert BTU to thermal watts (BTU × 0.293071), then divide by the equipment's efficiency rating (EER for cooling, COP for heating) to get electrical watts. Add 25% for continuous load per NEC. For example, a 24,000 BTU mini-split with SEER 20 uses about 1,200 watts, requiring a 20A circuit."
  }
];

export default function BTUToWattsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FAQSchema 
        items={calculatorFAQs['btu-to-watts-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-orange-600 rounded-2xl shadow-xl">
                <Flame className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              BTU to Watts Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Professional BTU/hr to watts converter for HVAC systems and electrical load calculations. 
              Convert heating and cooling capacity to electrical power for proper circuit sizing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <Flame className="h-8 w-8 text-orange-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Heat Output</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">BTU/hr thermal capacity</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <Snowflake className="h-8 w-8 text-blue-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Cooling Power</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">AC & heat pump sizing</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <Calculator className="h-8 w-8 text-green-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Electrical Load</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Circuit requirements</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <Suspense fallback={<div>Loading calculator...</div>}>
            <BTUToWattsCalculator />
          </Suspense>
        </div>
      </section>

      {/* Quick Reference Tables */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <Calculator className="mr-3 h-8 w-8 text-blue-600" />
          Common BTU to Watts Conversions
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Air Conditioner Sizes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-600">Air Conditioner Sizes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2">Tons</th>
                    <th className="text-center py-2">BTU/hr</th>
                    <th className="text-center py-2">Thermal Watts</th>
                    <th className="text-center py-2">Elec. Watts (EER 10)</th>
                    <th className="text-center py-2">Circuit</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">0.75</td>
                    <td className="text-center">9,000</td>
                    <td className="text-center">2,638W</td>
                    <td className="text-center">900W</td>
                    <td className="text-center">15A/120V</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">1.0</td>
                    <td className="text-center">12,000</td>
                    <td className="text-center">3,517W</td>
                    <td className="text-center">1,200W</td>
                    <td className="text-center">15A/120V</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">1.5</td>
                    <td className="text-center">18,000</td>
                    <td className="text-center">5,275W</td>
                    <td className="text-center">1,800W</td>
                    <td className="text-center">20A/120V</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">2.0</td>
                    <td className="text-center">24,000</td>
                    <td className="text-center">7,034W</td>
                    <td className="text-center">2,400W</td>
                    <td className="text-center">15A/240V</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">2.5</td>
                    <td className="text-center">30,000</td>
                    <td className="text-center">8,792W</td>
                    <td className="text-center">3,000W</td>
                    <td className="text-center">20A/240V</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">3.0</td>
                    <td className="text-center">36,000</td>
                    <td className="text-center">10,551W</td>
                    <td className="text-center">3,600W</td>
                    <td className="text-center">20A/240V</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">3.5</td>
                    <td className="text-center">42,000</td>
                    <td className="text-center">12,309W</td>
                    <td className="text-center">4,200W</td>
                    <td className="text-center">25A/240V</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">4.0</td>
                    <td className="text-center">48,000</td>
                    <td className="text-center">14,067W</td>
                    <td className="text-center">4,800W</td>
                    <td className="text-center">30A/240V</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">5.0</td>
                    <td className="text-center">60,000</td>
                    <td className="text-center">17,584W</td>
                    <td className="text-center">6,000W</td>
                    <td className="text-center">35A/240V</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Heating Equipment */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-orange-600">Heating Equipment</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2">Equipment</th>
                    <th className="text-center py-2">BTU/hr</th>
                    <th className="text-center py-2">kW Heat</th>
                    <th className="text-center py-2">Elec. Draw</th>
                    <th className="text-center py-2">Efficiency</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Space Heater</td>
                    <td className="text-center">5,120</td>
                    <td className="text-center">1.5kW</td>
                    <td className="text-center">1.5kW</td>
                    <td className="text-center">100%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Baseboard 4ft</td>
                    <td className="text-center">3,413</td>
                    <td className="text-center">1.0kW</td>
                    <td className="text-center">1.0kW</td>
                    <td className="text-center">100%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Heat Pump 2T</td>
                    <td className="text-center">24,000</td>
                    <td className="text-center">7.0kW</td>
                    <td className="text-center">2.3kW</td>
                    <td className="text-center">COP 3.0</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Heat Pump 3T</td>
                    <td className="text-center">36,000</td>
                    <td className="text-center">10.5kW</td>
                    <td className="text-center">3.0kW</td>
                    <td className="text-center">COP 3.5</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Furnace 60k</td>
                    <td className="text-center">60,000</td>
                    <td className="text-center">17.6kW</td>
                    <td className="text-center">0.6kW</td>
                    <td className="text-center">Gas 95%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Furnace 80k</td>
                    <td className="text-center">80,000</td>
                    <td className="text-center">23.4kW</td>
                    <td className="text-center">0.8kW</td>
                    <td className="text-center">Gas 95%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Furnace 100k</td>
                    <td className="text-center">100,000</td>
                    <td className="text-center">29.3kW</td>
                    <td className="text-center">1.0kW</td>
                    <td className="text-center">Gas 95%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Elec Furnace</td>
                    <td className="text-center">68,260</td>
                    <td className="text-center">20kW</td>
                    <td className="text-center">20kW</td>
                    <td className="text-center">100%</td>
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
          Real-World BTU to Watts Examples
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example 1: Mini-Split System */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-400">
              Mini-Split Installation
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Equipment:</strong> 18,000 BTU mini-split</p>
              <p><strong>SEER Rating:</strong> 20</p>
              <p><strong>Thermal Output:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                18,000 BTU × 0.293071 = 5,275W<br/>
                (5.3kW cooling capacity)
              </div>
              <p><strong>Electrical Consumption:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                EER = SEER × 0.875 = 17.5<br/>
                Watts = 18,000 ÷ 17.5 = 1,029W
              </div>
              <p className="text-green-700 dark:text-green-400 font-semibold">
                Circuit: 15A @ 240V
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Wire Size:</strong> 14 AWG<br/>
                <strong>Disconnect:</strong> 30A fused<br/>
                <strong>MCA:</strong> 8.6A | <strong>MOP:</strong> 15A
              </p>
            </div>
          </div>

          {/* Example 2: Heat Pump Replacement */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-green-700 dark:text-green-400">
              Heat Pump Upgrade
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Old Unit:</strong> 3-ton, SEER 10</p>
              <p><strong>New Unit:</strong> 3-ton, SEER 18</p>
              <p><strong>Capacity:</strong> 36,000 BTU/hr</p>
              <p><strong>Old Power Draw:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                36,000 ÷ (10 × 0.875) = 4,114W<br/>
                Current = 4,114W ÷ 240V = 17.1A
              </div>
              <p><strong>New Power Draw:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                36,000 ÷ (18 × 0.875) = 2,286W<br/>
                Current = 2,286W ÷ 240V = 9.5A
              </div>
              <p className="text-green-700 dark:text-green-400 font-semibold">
                Energy Savings: 44%
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Annual Savings:</strong> ~$650<br/>
                <strong>Existing Circuit:</strong> Adequate<br/>
                <strong>ROI:</strong> 5-7 years
              </p>
            </div>
          </div>

          {/* Example 3: Restaurant Kitchen */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-orange-700 dark:text-orange-400">
              Commercial Kitchen HVAC
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Kitchen Size:</strong> 2,000 sq ft</p>
              <p><strong>Equipment Heat:</strong> 150,000 BTU/hr</p>
              <p><strong>Required Cooling:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                Base: 2,000 × 40 = 80,000 BTU<br/>
                Equipment: + 150,000 BTU<br/>
                Total: 230,000 BTU/hr (19 tons)
              </div>
              <p><strong>Electrical Load:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                230,000 ÷ 11 EER = 20,909W<br/>
                Three units @ 7kW each
              </div>
              <p className="text-orange-700 dark:text-orange-400 font-semibold">
                Power: 3× 40A @ 240V
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Makeup Air:</strong> Required<br/>
                <strong>Exhaust CFM:</strong> 8,000
              </p>
            </div>
          </div>

          {/* Example 4: Data Center Cooling */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-400">
              Server Room Cooling
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>IT Load:</strong> 20kW</p>
              <p><strong>Heat Generation:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                20kW × 3,412 = 68,240 BTU/hr<br/>
                Safety Factor × 1.3 = 88,712 BTU<br/>
                Required: 7.4 tons cooling
              </div>
              <p><strong>CRAC Unit Sizing:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                2× 5-ton units (redundancy)<br/>
                60,000 BTU each @ EER 12<br/>
                Power: 5kW each unit
              </div>
              <p className="text-purple-700 dark:text-purple-400 font-semibold">
                Total Cooling Power: 10kW
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>PUE:</strong> 1.5 (good efficiency)<br/>
                <strong>Circuit:</strong> 2× 30A @ 240V<br/>
                <strong>UPS Protected:</strong> Yes
              </p>
            </div>
          </div>

          {/* Example 5: Warehouse Heating */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-red-700 dark:text-red-400">
              Warehouse Unit Heaters
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Space:</strong> 10,000 sq ft × 20ft ceiling</p>
              <p><strong>Heat Loss:</strong> 400,000 BTU/hr</p>
              <p><strong>Gas vs Electric:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                Gas: 5× 80,000 BTU units<br/>
                Electric: 0.5kW each (fans)<br/>
                Total Electric: 2.5kW<br/>
                <br/>
                All Electric Alternative:<br/>
                400,000 BTU × 0.293 = 117kW<br/>
                Current: 282A @ 480V 3-phase
              </div>
              <p className="text-red-700 dark:text-red-400 font-semibold">
                Gas: More economical
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Operating Cost:</strong> $2,400/mo vs $8,500/mo<br/>
                <strong>Installation:</strong> Gas piping required
              </p>
            </div>
          </div>

          {/* Example 6: Pool Heating */}
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-cyan-700 dark:text-cyan-400">
              Pool Heat Pump Sizing
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Pool:</strong> 20,000 gallons</p>
              <p><strong>Temperature Rise:</strong> 15°F</p>
              <p><strong>Heat Required:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                20,000 gal × 8.33 lb/gal × 15°F<br/>
                = 2,499,000 BTU total<br/>
                24hr heating = 104,125 BTU/hr
              </div>
              <p><strong>Heat Pump Selection:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                120,000 BTU/hr unit<br/>
                COP 5.0 @ 80°F ambient<br/>
                Power: 120,000 ÷ (5×3,412)<br/>
                = 7.03kW electrical
              </div>
              <p className="text-cyan-700 dark:text-cyan-400 font-semibold">
                Circuit: 40A @ 240V
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Wire:</strong> 8 AWG THWN<br/>
                <strong>Runtime:</strong> 20 hrs initial<br/>
                <strong>Daily Cost:</strong> ~$8.50
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Efficiency Ratings Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="mr-3 h-8 w-8 text-green-600" />
          Understanding HVAC Efficiency Ratings
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">Cooling Efficiency Metrics</h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
                  <h4 className="font-semibold mb-2">EER (Energy Efficiency Ratio)</h4>
                  <p className="text-sm mb-2">BTU/hr cooling ÷ Watts input at 95°F</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span>Standard: 8-12</span>
                    <span>High-Eff: 12-16</span>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded">
                  <h4 className="font-semibold mb-2">SEER (Seasonal EER)</h4>
                  <p className="text-sm mb-2">Seasonal average efficiency</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span>Minimum: 14</span>
                    <span>ENERGY STAR: 15+</span>
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded">
                  <h4 className="font-semibold mb-2">SEER to EER Conversion</h4>
                  <p className="text-sm">EER ≈ SEER × 0.875</p>
                  <table className="w-full mt-2 text-xs">
                    <tr className="border-b">
                      <td>SEER 14</td>
                      <td className="text-right">EER 12.3</td>
                    </tr>
                    <tr className="border-b">
                      <td>SEER 16</td>
                      <td className="text-right">EER 14.0</td>
                    </tr>
                    <tr className="border-b">
                      <td>SEER 20</td>
                      <td className="text-right">EER 17.5</td>
                    </tr>
                    <tr>
                      <td>SEER 25</td>
                      <td className="text-right">EER 21.9</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-600">Heating Efficiency Metrics</h3>
              <div className="space-y-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded">
                  <h4 className="font-semibold mb-2">COP (Coefficient of Performance)</h4>
                  <p className="text-sm mb-2">Heat output ÷ Energy input</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span>Resistance: 1.0</span>
                    <span>Heat Pump: 2.5-4.5</span>
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded">
                  <h4 className="font-semibold mb-2">HSPF (Heating Seasonal Performance Factor)</h4>
                  <p className="text-sm mb-2">BTU heating ÷ Watt-hours (seasonal)</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span>Minimum: 8.2</span>
                    <span>High-Eff: 10+</span>
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                  <h4 className="font-semibold mb-2">AFUE (Annual Fuel Utilization Efficiency)</h4>
                  <p className="text-sm mb-2">For gas/oil furnaces</p>
                  <table className="w-full mt-2 text-xs">
                    <tr className="border-b">
                      <td>Standard</td>
                      <td className="text-right">80%</td>
                    </tr>
                    <tr className="border-b">
                      <td>High-Efficiency</td>
                      <td className="text-right">90-95%</td>
                    </tr>
                    <tr>
                      <td>Condensing</td>
                      <td className="text-right">95-98%</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heat Load Calculation */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Heat Load Calculation Guidelines
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-blue-600">Residential Rules of Thumb</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span>Cooling (South)</span>
                <span className="font-mono">600 sq ft/ton</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Cooling (North)</span>
                <span className="font-mono">800 sq ft/ton</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Heating (Mild)</span>
                <span className="font-mono">25 BTU/sq ft</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Heating (Moderate)</span>
                <span className="font-mono">35 BTU/sq ft</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Heating (Cold)</span>
                <span className="font-mono">45 BTU/sq ft</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Heating (Extreme)</span>
                <span className="font-mono">55 BTU/sq ft</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-green-600">Commercial Spaces</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span>Office</span>
                <span className="font-mono">250-300 sq ft/ton</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Retail</span>
                <span className="font-mono">200-250 sq ft/ton</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Restaurant</span>
                <span className="font-mono">150-200 sq ft/ton</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Data Center</span>
                <span className="font-mono">150 sq ft/ton</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Warehouse</span>
                <span className="font-mono">500-800 sq ft/ton</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Manufacturing</span>
                <span className="font-mono">300-400 sq ft/ton</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-purple-600">Additional Factors</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span>Windows (std)</span>
                <span className="font-mono">+1,000 BTU ea</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Windows (south)</span>
                <span className="font-mono">+2,000 BTU ea</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>People</span>
                <span className="font-mono">+600 BTU ea</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Kitchen</span>
                <span className="font-mono">+4,000 BTU</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Computers</span>
                <span className="font-mono">+400 BTU ea</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Poor Insulation</span>
                <span className="font-mono">+30%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Electrical Requirements Table */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          HVAC Electrical Requirements by BTU Rating
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2">BTU Rating</th>
                  <th className="text-center py-2">Tons</th>
                  <th className="text-center py-2">Typical Watts</th>
                  <th className="text-center py-2">MCA</th>
                  <th className="text-center py-2">MOP/Breaker</th>
                  <th className="text-center py-2">Wire Size</th>
                  <th className="text-center py-2">Voltage</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">9,000 BTU</td>
                  <td className="text-center">0.75</td>
                  <td className="text-center">900W</td>
                  <td className="text-center">7.5A</td>
                  <td className="text-center">15A</td>
                  <td className="text-center">14 AWG</td>
                  <td className="text-center">120V</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">12,000 BTU</td>
                  <td className="text-center">1.0</td>
                  <td className="text-center">1,200W</td>
                  <td className="text-center">10A</td>
                  <td className="text-center">15A</td>
                  <td className="text-center">14 AWG</td>
                  <td className="text-center">120V</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">18,000 BTU</td>
                  <td className="text-center">1.5</td>
                  <td className="text-center">1,800W</td>
                  <td className="text-center">8.6A</td>
                  <td className="text-center">15A</td>
                  <td className="text-center">14 AWG</td>
                  <td className="text-center">240V</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">24,000 BTU</td>
                  <td className="text-center">2.0</td>
                  <td className="text-center">2,400W</td>
                  <td className="text-center">11.5A</td>
                  <td className="text-center">20A</td>
                  <td className="text-center">12 AWG</td>
                  <td className="text-center">240V</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">30,000 BTU</td>
                  <td className="text-center">2.5</td>
                  <td className="text-center">3,000W</td>
                  <td className="text-center">14.4A</td>
                  <td className="text-center">20A</td>
                  <td className="text-center">12 AWG</td>
                  <td className="text-center">240V</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">36,000 BTU</td>
                  <td className="text-center">3.0</td>
                  <td className="text-center">3,600W</td>
                  <td className="text-center">17.3A</td>
                  <td className="text-center">25A</td>
                  <td className="text-center">10 AWG</td>
                  <td className="text-center">240V</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">48,000 BTU</td>
                  <td className="text-center">4.0</td>
                  <td className="text-center">4,800W</td>
                  <td className="text-center">23A</td>
                  <td className="text-center">30A</td>
                  <td className="text-center">10 AWG</td>
                  <td className="text-center">240V</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">60,000 BTU</td>
                  <td className="text-center">5.0</td>
                  <td className="text-center">6,000W</td>
                  <td className="text-center">28.8A</td>
                  <td className="text-center">40A</td>
                  <td className="text-center">8 AWG</td>
                  <td className="text-center">240V</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            * MCA = Minimum Circuit Ampacity | MOP = Maximum Overcurrent Protection<br/>
            * Values shown for typical SEER 14-16 equipment. High-efficiency units may require less power.
          </p>
        </div>
      </section>

      {/* Energy Cost Comparison */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Heating Cost Comparison by Fuel Type
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Cost to generate 1 million BTU of heat (assuming $0.12/kWh electricity, $1.50/therm gas, $3.00/gal propane):
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2">Heating Method</th>
                  <th className="text-center py-2">Efficiency</th>
                  <th className="text-center py-2">Cost/Million BTU</th>
                  <th className="text-center py-2">Annual Cost*</th>
                  <th className="text-center py-2">CO₂ Impact</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100 bg-green-50 dark:bg-green-900/20">
                  <td className="py-2 font-medium">Heat Pump (COP 3.5)</td>
                  <td className="text-center">350%</td>
                  <td className="text-center">$10.05</td>
                  <td className="text-center">$1,005</td>
                  <td className="text-center">Low-Medium</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">Heat Pump (COP 2.5)</td>
                  <td className="text-center">250%</td>
                  <td className="text-center">$14.07</td>
                  <td className="text-center">$1,407</td>
                  <td className="text-center">Medium</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">Natural Gas (95%)</td>
                  <td className="text-center">95%</td>
                  <td className="text-center">$15.79</td>
                  <td className="text-center">$1,579</td>
                  <td className="text-center">Medium</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">Natural Gas (80%)</td>
                  <td className="text-center">80%</td>
                  <td className="text-center">$18.75</td>
                  <td className="text-center">$1,875</td>
                  <td className="text-center">Medium-High</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">Propane (95%)</td>
                  <td className="text-center">95%</td>
                  <td className="text-center">$34.48</td>
                  <td className="text-center">$3,448</td>
                  <td className="text-center">High</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">Electric Resistance</td>
                  <td className="text-center">100%</td>
                  <td className="text-center">$35.17</td>
                  <td className="text-center">$3,517</td>
                  <td className="text-center">Highest</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">Oil (85%)</td>
                  <td className="text-center">85%</td>
                  <td className="text-center">$25.49</td>
                  <td className="text-center">$2,549</td>
                  <td className="text-center">High</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            * Annual cost based on 100 million BTU/year (typical 2,000 sq ft home in moderate climate)
          </p>
        </div>
      </section>

      {/* Related Calculators */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Related HVAC & Electrical Calculators
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/calculators/watts-to-amps" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Calculator className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold mb-1">Watts to Amps</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Convert power to current</p>
          </Link>
          
          <Link href="/calculators/wire-size-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-semibold mb-1">Wire Size</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Size conductors for HVAC</p>
          </Link>
          
          <Link href="/calculators/ac-wire-size" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Snowflake className="h-8 w-8 text-cyan-600 mb-2" />
            <h3 className="font-semibold mb-1">AC Wire Size</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Air conditioner circuits</p>
          </Link>
          
          <Link href="/calculators/electrical-load-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Flame className="h-8 w-8 text-orange-600 mb-2" />
            <h3 className="font-semibold mb-1">Load Calculator</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total electrical demand</p>
          </Link>
        </div>
      </section>

      {/* Authority Links */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Industry Standards & References
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="https://www.ashrae.org/technical-resources/standards-and-guidelines" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-blue-700 dark:text-blue-400">ASHRAE Standards</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Heating, ventilation, air conditioning, and refrigeration engineering standards
            </p>
          </a>
          
          <a href="https://www.energystar.gov/products/heating_cooling" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-green-700 dark:text-green-400">ENERGY STAR</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Energy efficiency ratings and certified HVAC equipment database
            </p>
          </a>
          
          <a href="https://www.acca.org/standards/technical-manuals" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-orange-700 dark:text-orange-400">ACCA Manuals</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Manual J load calculations and HVAC system design standards
            </p>
          </a>
          
          <a href="https://www.carrier.com/residential/en/us/products/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-purple-700 dark:text-purple-400">Carrier Corporation</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              HVAC equipment specifications and sizing resources
            </p>
          </a>
          
          <a href="https://www.trane.com/residential/en/resources/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-red-700 dark:text-red-400">Trane Technologies</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Heat pump and air conditioning technical resources
            </p>
          </a>
          
          <a href="https://www.nfpa.org/codes-and-standards/nfpa-90a-standard" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-yellow-700 dark:text-yellow-400">NFPA 90A</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Installation standards for air-conditioning and ventilation systems
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
              Professional HVAC Installation Required
            </h3>
            <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
              BTU calculations are critical for proper HVAC system sizing. Undersized equipment won't maintain comfort, 
              while oversized systems short-cycle, reducing efficiency and lifespan. Electrical circuits must be sized 
              per NEC Article 440 for air conditioning equipment. Always perform Manual J load calculations for accurate 
              sizing. Installation requires EPA 608 certification for refrigerant handling and electrical licensing for 
              power connections. Consult qualified HVAC professionals for system design and installation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}