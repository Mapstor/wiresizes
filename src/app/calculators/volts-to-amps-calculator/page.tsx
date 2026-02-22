import { Metadata } from 'next';
import { Suspense } from 'react';
import { VoltsToAmpsCalculator } from '@/components/calculators';
import { Zap, Calculator, TrendingUp, AlertCircle, BookOpen, Battery } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Volts to Amps Calculator | Convert Voltage to Current | Ohms Law Calculator',
  description: 'Professional volts to amps calculator using Ohms Law. Convert voltage to amperage for electrical circuits with power or resistance. Essential tool for electricians and engineers.',
  keywords: 'volts to amps, voltage to current, ohms law calculator, electrical conversion, V to A, voltage amperage calculator, electrical current calculator',
  openGraph: {
    title: 'Volts to Amps Calculator - Professional Electrical Conversion Tool',
    description: 'Convert volts to amps using Ohms Law. Calculate current from voltage and power or resistance for electrical circuits.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/volts-to-amps-calculator',
  },
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Volts to Amps Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Calculate current from voltage and power or resistance. Essential for circuit design.",
  "keywords": "volts to amps, voltage to current, ohms law calculator",
  "url": `https://wiresizes.com/calculators/volts-to-amps-calculator`,
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

const voltsToAmpsFAQs = [
  {
    question: "How do I convert volts to amps?",
    answer: "To convert volts to amps, you need either power (watts) or resistance (ohms). Using power: Amps = Watts ÷ Volts. Using resistance: Amps = Volts ÷ Ohms. For example, a 1200W appliance on 120V uses 10 amps (1200W ÷ 120V = 10A)."
  },
  {
    question: "Can you convert volts directly to amps without other information?",
    answer: "No, you cannot convert volts directly to amps without knowing either the power (watts) or resistance (ohms) of the circuit. Voltage is electrical pressure, while current (amps) is the flow rate. You need to know either how much power is being consumed or the resistance to calculate current flow."
  },
  {
    question: "What is Ohm's Law and how does it relate volts to amps?",
    answer: "Ohm's Law states that V = I × R, where V is voltage, I is current (amps), and R is resistance (ohms). This fundamental law shows the relationship between voltage, current, and resistance. Rearranged for current: I = V ÷ R. This means current is directly proportional to voltage and inversely proportional to resistance."
  },
  {
    question: "How do I calculate amps for three-phase systems?",
    answer: "For three-phase systems, the formula is: Amps = Watts ÷ (Volts × √3 × Power Factor). The √3 (approximately 1.732) accounts for the three-phase configuration. For example, a 10kW three-phase motor at 480V with 0.85 power factor: I = 10,000 ÷ (480 × 1.732 × 0.85) = 14.1 amps."
  },
  {
    question: "What's the difference between AC and DC when converting volts to amps?",
    answer: "For DC circuits, the conversion is straightforward: Amps = Watts ÷ Volts. For AC circuits, you must consider power factor: Amps = Watts ÷ (Volts × Power Factor). AC circuits with inductive loads (motors, transformers) have power factors less than 1.0, requiring more current for the same power."
  }
];

export default function VoltsToAmpsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FAQSchema 
        items={calculatorFAQs['volts-to-amps-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-yellow-600 rounded-2xl shadow-xl">
                <Zap className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Volts to Amps Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Professional voltage to current converter using Ohm's Law. Calculate electrical current (amperage) 
              from voltage and power or resistance for AC and DC circuits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <Battery className="h-8 w-8 text-yellow-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Ohm's Law</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">V = I × R calculations</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Power Formula</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">P = V × I conversions</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <Calculator className="h-8 w-8 text-blue-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white">AC/DC Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Single & three-phase</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <Suspense fallback={<div>Loading calculator...</div>}>
            <VoltsToAmpsCalculator />
          </Suspense>
        </div>
      </section>

      {/* Quick Reference Tables */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <Calculator className="mr-3 h-8 w-8 text-blue-600" />
          Common Volts to Amps Conversions
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* 120V Household Appliances */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-600">120V Household Appliances</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2">Appliance</th>
                    <th className="text-center py-2">Power (W)</th>
                    <th className="text-center py-2">Current (A)</th>
                    <th className="text-center py-2">Wire Size</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">LED Bulb (60W eq)</td>
                    <td className="text-center">9W</td>
                    <td className="text-center">0.08A</td>
                    <td className="text-center">14 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Phone Charger</td>
                    <td className="text-center">20W</td>
                    <td className="text-center">0.17A</td>
                    <td className="text-center">14 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Laptop</td>
                    <td className="text-center">90W</td>
                    <td className="text-center">0.75A</td>
                    <td className="text-center">14 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">TV (55" LED)</td>
                    <td className="text-center">150W</td>
                    <td className="text-center">1.25A</td>
                    <td className="text-center">14 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Coffee Maker</td>
                    <td className="text-center">900W</td>
                    <td className="text-center">7.5A</td>
                    <td className="text-center">14 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Microwave</td>
                    <td className="text-center">1200W</td>
                    <td className="text-center">10A</td>
                    <td className="text-center">12 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Space Heater</td>
                    <td className="text-center">1500W</td>
                    <td className="text-center">12.5A</td>
                    <td className="text-center">12 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Hair Dryer</td>
                    <td className="text-center">1800W</td>
                    <td className="text-center">15A</td>
                    <td className="text-center">12 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Window AC</td>
                    <td className="text-center">1440W</td>
                    <td className="text-center">12A</td>
                    <td className="text-center">12 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Vacuum Cleaner</td>
                    <td className="text-center">1400W</td>
                    <td className="text-center">11.7A</td>
                    <td className="text-center">12 AWG</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 240V Major Appliances */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-green-600">240V Major Appliances</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2">Appliance</th>
                    <th className="text-center py-2">Power (W)</th>
                    <th className="text-center py-2">Current (A)</th>
                    <th className="text-center py-2">Wire Size</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Level 2 EV Charger</td>
                    <td className="text-center">7200W</td>
                    <td className="text-center">30A</td>
                    <td className="text-center">10 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Electric Dryer</td>
                    <td className="text-center">5000W</td>
                    <td className="text-center">20.8A</td>
                    <td className="text-center">10 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Electric Range</td>
                    <td className="text-center">12000W</td>
                    <td className="text-center">50A</td>
                    <td className="text-center">6 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Water Heater (50 gal)</td>
                    <td className="text-center">4500W</td>
                    <td className="text-center">18.8A</td>
                    <td className="text-center">10 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Central AC (3-ton)</td>
                    <td className="text-center">3600W</td>
                    <td className="text-center">15A</td>
                    <td className="text-center">12 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Hot Tub</td>
                    <td className="text-center">6000W</td>
                    <td className="text-center">25A</td>
                    <td className="text-center">10 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Tankless Water Heater</td>
                    <td className="text-center">27000W</td>
                    <td className="text-center">112.5A</td>
                    <td className="text-center">2 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Electric Furnace</td>
                    <td className="text-center">20000W</td>
                    <td className="text-center">83.3A</td>
                    <td className="text-center">3 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Welder (220V)</td>
                    <td className="text-center">8000W</td>
                    <td className="text-center">33.3A</td>
                    <td className="text-center">8 AWG</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Pool Pump (2 HP)</td>
                    <td className="text-center">1864W</td>
                    <td className="text-center">7.8A</td>
                    <td className="text-center">14 AWG</td>
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
          Real-World Volts to Amps Examples
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example 1: Kitchen Circuit */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-400">
              Kitchen Circuit Loading
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Scenario:</strong> Multiple appliances on 120V circuit</p>
              <p><strong>Appliances:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Microwave: 1200W</li>
                <li>• Coffee Maker: 900W</li>
                <li>• Toaster: 800W</li>
              </ul>
              <p><strong>Calculations:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                Microwave: 1200W ÷ 120V = 10A<br/>
                Coffee: 900W ÷ 120V = 7.5A<br/>
                Toaster: 800W ÷ 120V = 6.7A<br/>
                Total: 24.2A (overload!)
              </div>
              <p className="text-red-700 dark:text-red-400 font-semibold">
                Result: Requires two 20A circuits
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Solution:</strong> Split appliances across two circuits to prevent overload
              </p>
            </div>
          </div>

          {/* Example 2: EV Charging */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-green-700 dark:text-green-400">
              EV Charger Installation
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Scenario:</strong> Level 2 home charger</p>
              <p><strong>Specifications:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Voltage: 240V</li>
                <li>• Power: 9600W (40A charger)</li>
                <li>• Efficiency: 95%</li>
              </ul>
              <p><strong>Calculation:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                I = P ÷ V<br/>
                I = 9600W ÷ 240V = 40A<br/>
                Circuit = 40A × 1.25 = 50A
              </div>
              <p className="text-green-700 dark:text-green-400 font-semibold">
                Result: 50A circuit required
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Wire Size:</strong> 6 AWG copper<br/>
                <strong>Breaker:</strong> 50A double-pole<br/>
                <strong>Charging Speed:</strong> 25-30 miles/hour
              </p>
            </div>
          </div>

          {/* Example 3: Workshop Setup */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-400">
              Workshop Power Planning
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Scenario:</strong> Home workshop tools</p>
              <p><strong>Equipment:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Table Saw: 1800W @ 120V</li>
                <li>• Dust Collector: 1100W @ 120V</li>
                <li>• Air Compressor: 3700W @ 240V</li>
              </ul>
              <p><strong>Current Draw:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                Saw: 1800W ÷ 120V = 15A<br/>
                Dust: 1100W ÷ 120V = 9.2A<br/>
                Compressor: 3700W ÷ 240V = 15.4A
              </div>
              <p className="text-purple-700 dark:text-purple-400 font-semibold">
                Result: Multiple circuits needed
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Setup:</strong> Two 20A/120V + one 20A/240V circuit
              </p>
            </div>
          </div>

          {/* Example 4: Solar System */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-yellow-700 dark:text-yellow-400">
              Solar Panel String
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Scenario:</strong> Residential solar array</p>
              <p><strong>Configuration:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• 10 panels in series</li>
                <li>• Voc: 40V per panel = 400V</li>
                <li>• Power: 3500W total</li>
              </ul>
              <p><strong>DC Current:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                I = P ÷ V<br/>
                I = 3500W ÷ 400V = 8.75A<br/>
                Wire sizing: 8.75A × 1.56 = 13.7A
              </div>
              <p className="text-yellow-700 dark:text-yellow-400 font-semibold">
                Result: 10 AWG DC wire
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>NEC 690:</strong> 1.56 safety factor<br/>
                <strong>Wire Type:</strong> THWN-2 or PV wire<br/>
                <strong>Protection:</strong> 15A DC breaker
              </p>
            </div>
          </div>

          {/* Example 5: Data Center */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-red-700 dark:text-red-400">
              Server Rack Power
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Scenario:</strong> 42U server rack</p>
              <p><strong>Load Analysis:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Servers: 4800W</li>
                <li>• Network: 600W</li>
                <li>• Storage: 1200W</li>
              </ul>
              <p><strong>208V 3-Phase PDU:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                Total: 6600W<br/>
                I = 6600W ÷ (208V × √3)<br/>
                I = 6600W ÷ 360.3V = 18.3A
              </div>
              <p className="text-red-700 dark:text-red-400 font-semibold">
                Result: 30A 3-phase circuit
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Redundancy:</strong> A+B power feeds<br/>
                <strong>PDUs:</strong> 2× 30A L21-30 outlets
              </p>
            </div>
          </div>

          {/* Example 6: HVAC System */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-orange-700 dark:text-orange-400">
              Heat Pump Installation
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Scenario:</strong> 4-ton heat pump system</p>
              <p><strong>Components:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Outdoor Unit: 240V</li>
                <li>• MCA: 28.5A</li>
                <li>• MOP: 40A</li>
              </ul>
              <p><strong>Power Calculation:</strong></p>
              <div className="bg-white/70 dark:bg-gray-900/70 rounded p-3 font-mono text-xs">
                P = V × I × PF<br/>
                P = 240V × 28.5A × 0.85<br/>
                P = 5814W (running)
              </div>
              <p className="text-orange-700 dark:text-orange-400 font-semibold">
                Result: 40A circuit, 8 AWG wire
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Disconnect:</strong> 60A weatherproof<br/>
                <strong>Wire Type:</strong> THHN in conduit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ohm's Law Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <Battery className="mr-3 h-8 w-8 text-green-600" />
          Understanding Ohm's Law & Power Formulas
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">Fundamental Formulas</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <h4 className="font-bold mb-2">Ohm's Law</h4>
                  <p className="font-mono text-lg mb-2">V = I × R</p>
                  <ul className="text-sm space-y-1">
                    <li>• V = Voltage (volts)</li>
                    <li>• I = Current (amps)</li>
                    <li>• R = Resistance (ohms)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <h4 className="font-bold mb-2">Power Law</h4>
                  <p className="font-mono text-lg mb-2">P = V × I</p>
                  <ul className="text-sm space-y-1">
                    <li>• P = Power (watts)</li>
                    <li>• V = Voltage (volts)</li>
                    <li>• I = Current (amps)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <h4 className="font-bold mb-2">Combined Formula</h4>
                  <p className="font-mono text-lg mb-2">P = I² × R = V² ÷ R</p>
                  <ul className="text-sm space-y-1">
                    <li>• Use when missing voltage or current</li>
                    <li>• Critical for power loss calculations</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-600">Formula Wheel</h3>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 to-gray-800 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white dark:bg-gray-900 rounded p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400">To find Voltage:</p>
                    <p className="font-mono text-sm font-bold">V = I × R</p>
                    <p className="font-mono text-sm font-bold">V = P ÷ I</p>
                    <p className="font-mono text-sm font-bold">V = √(P × R)</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400">To find Current:</p>
                    <p className="font-mono text-sm font-bold">I = V ÷ R</p>
                    <p className="font-mono text-sm font-bold">I = P ÷ V</p>
                    <p className="font-mono text-sm font-bold">I = √(P ÷ R)</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400">To find Resistance:</p>
                    <p className="font-mono text-sm font-bold">R = V ÷ I</p>
                    <p className="font-mono text-sm font-bold">R = V² ÷ P</p>
                    <p className="font-mono text-sm font-bold">R = P ÷ I²</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400">To find Power:</p>
                    <p className="font-mono text-sm font-bold">P = V × I</p>
                    <p className="font-mono text-sm font-bold">P = I² × R</p>
                    <p className="font-mono text-sm font-bold">P = V² ÷ R</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AC vs DC Calculations */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          AC vs DC Current Calculations
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-600">DC Circuit Calculations</h3>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold mb-2">Simple Formula:</p>
                <p className="font-mono text-lg">I = P ÷ V</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  No power factor consideration needed
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Common DC Applications:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">▶</span>
                    <span><strong>12V Systems:</strong> Automotive, RV, Marine</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">▶</span>
                    <span><strong>24V Systems:</strong> Trucks, Industrial controls</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">▶</span>
                    <span><strong>48V Systems:</strong> Telecom, Data centers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">▶</span>
                    <span><strong>High Voltage DC:</strong> Solar strings, EV charging</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                <p className="text-sm">
                  <strong>Note:</strong> DC systems require larger conductors for same power due to no RMS advantage
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-green-600">AC Circuit Calculations</h3>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold mb-2">Single-Phase Formula:</p>
                <p className="font-mono text-lg">I = P ÷ (V × PF)</p>
                <p className="font-semibold mb-2 mt-3">Three-Phase Formula:</p>
                <p className="font-mono text-lg">I = P ÷ (V × √3 × PF)</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Power Factor Impact:</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1">Load Type</th>
                      <th className="text-center py-1">PF Range</th>
                      <th className="text-center py-1">Current Increase</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-1">Resistive</td>
                      <td className="text-center">1.0</td>
                      <td className="text-center">0%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1">LED Lighting</td>
                      <td className="text-center">0.9-0.95</td>
                      <td className="text-center">5-11%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1">Motors</td>
                      <td className="text-center">0.8-0.9</td>
                      <td className="text-center">11-25%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1">Old Fluorescent</td>
                      <td className="text-center">0.5-0.7</td>
                      <td className="text-center">43-100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voltage Drop Impact */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Impact of Voltage on Current Draw
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Understanding how voltage variations affect current is critical for proper circuit design:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
              <h3 className="font-bold text-red-700 dark:text-red-400 mb-3">Low Voltage Effects</h3>
              <ul className="space-y-2 text-sm">
                <li>• Motors draw MORE current</li>
                <li>• Increased heat generation</li>
                <li>• Reduced equipment life</li>
                <li>• Potential motor stalling</li>
                <li>• Dimming lights</li>
              </ul>
              <div className="mt-3 p-2 bg-white dark:bg-gray-900 rounded">
                <p className="text-xs font-mono">
                  Example: 10% voltage drop<br/>
                  = 11% current increase
                </p>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
              <h3 className="font-bold text-green-700 dark:text-green-400 mb-3">Nominal Voltage</h3>
              <ul className="space-y-2 text-sm">
                <li>• Equipment runs as designed</li>
                <li>• Optimal efficiency</li>
                <li>• Expected lifespan</li>
                <li>• Proper power output</li>
                <li>• Normal operating temp</li>
              </ul>
              <div className="mt-3 p-2 bg-white dark:bg-gray-900 rounded">
                <p className="text-xs font-mono">
                  Acceptable range:<br/>
                  ±5% of nominal
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
              <h3 className="font-bold text-yellow-700 dark:text-yellow-400 mb-3">High Voltage Effects</h3>
              <ul className="space-y-2 text-sm">
                <li>• Motors draw LESS current</li>
                <li>• Increased insulation stress</li>
                <li>• Shortened bulb life</li>
                <li>• Electronic damage risk</li>
                <li>• Overvoltage trips</li>
              </ul>
              <div className="mt-3 p-2 bg-white dark:bg-gray-900 rounded">
                <p className="text-xs font-mono">
                  Example: 10% overvoltage<br/>
                  = Reduced equipment life
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motor Starting Currents */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Motor Starting Current Calculations
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">Inrush Current Multipliers</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2">Starting Method</th>
                    <th className="text-center py-2">Multiplier</th>
                    <th className="text-center py-2">Typical Use</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Direct On Line</td>
                    <td className="text-center font-mono">6-8×</td>
                    <td className="text-center">Small motors</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Star-Delta</td>
                    <td className="text-center font-mono">2-3×</td>
                    <td className="text-center">Medium motors</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Soft Starter</td>
                    <td className="text-center font-mono">2-4×</td>
                    <td className="text-center">Pumps, fans</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">VFD</td>
                    <td className="text-center font-mono">1.5×</td>
                    <td className="text-center">Variable speed</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Autotransformer</td>
                    <td className="text-center font-mono">3-4×</td>
                    <td className="text-center">Large motors</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-600">Example: 10 HP Motor</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="font-semibold mb-3">240V Single-Phase Motor</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Running Current:</strong></p>
                  <p className="font-mono bg-white dark:bg-gray-900 p-2 rounded">
                    I = (10 HP × 746W) ÷ (240V × 0.85)<br/>
                    I = 7460W ÷ 204V = 36.6A
                  </p>
                  
                  <p className="mt-3"><strong>Starting Current (DOL):</strong></p>
                  <p className="font-mono bg-white dark:bg-gray-900 p-2 rounded">
                    Istart = 36.6A × 6 = 219.6A
                  </p>
                  
                  <p className="mt-3"><strong>Circuit Requirements:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Wire: 8 AWG (125% FLA)</li>
                    <li>• Breaker: 50A (time-delay)</li>
                    <li>• Starter: NEMA Size 2</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Calculators */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Related Electrical Calculators
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/calculators/amps-to-watts" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Zap className="h-8 w-8 text-yellow-600 mb-2" />
            <h3 className="font-semibold mb-1">Amps to Watts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Convert current to power</p>
          </Link>
          
          <Link href="/calculators/watts-to-amps" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Calculator className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold mb-1">Watts to Amps</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Power to current converter</p>
          </Link>
          
          <Link href="/calculators/ohms-law" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Battery className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-semibold mb-1">Ohm's Law</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Complete V-I-R-P calculator</p>
          </Link>
          
          <Link href="/calculators/voltage-drop-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold mb-1">Voltage Drop</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Calculate circuit voltage loss</p>
          </Link>
        </div>
      </section>

      {/* Authority Links */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Industry Standards & References
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="https://www.nfpa.org/codes-and-standards/nfpa-70-national-electrical-code" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-red-700 dark:text-red-400">NFPA 70 - NEC</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              National Electrical Code for circuit calculations and conductor sizing
            </p>
          </a>
          
          <a href="https://www.ieee.org/standards/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-blue-700 dark:text-blue-400">IEEE Standards</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Electrical and electronics engineering standards
            </p>
          </a>
          
          <a href="https://www.fluke.com/en-us/learn/blog/electrical" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-yellow-700 dark:text-yellow-400">Fluke Corporation</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Electrical measurement and testing resources
            </p>
          </a>
          
          <a href="https://www.mikeholt.com/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-green-700 dark:text-green-400">Mike Holt Enterprises</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Electrical training and code education
            </p>
          </a>
          
          <a href="https://www.ecmweb.com/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-purple-700 dark:text-purple-400">EC&M Magazine</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Electrical construction and maintenance resources
            </p>
          </a>
          
          <a href="https://www.osha.gov/electrical" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2 text-orange-700 dark:text-orange-400">OSHA Electrical Safety</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Workplace electrical safety standards and guidelines
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
              Important Safety Information
            </h3>
            <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
              Electrical calculations must be verified by qualified professionals before implementation. 
              Current calculations determine wire size, breaker ratings, and equipment specifications. 
              Undersized conductors can cause fires, while oversized protection may not trip during faults. 
              Always follow NEC requirements, consider all derating factors, and have work inspected 
              by local authorities. Never work on live circuits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}