import { Metadata } from 'next';
import { VoltsToAmpsCalculator } from '@/components/calculators/VoltsToAmpsCalculator';
import { Zap, Calculator, TrendingUp, AlertCircle, Battery } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';

export const metadata: Metadata = {
  title: 'Volts to Amps Calculator — V → A',
  description: 'Current from power and voltage: I = P ÷ (V × PF) single-phase, I = P ÷ (√3 × V × PF) three-phase.',
  keywords: 'volts to amps, voltage to current, electrical conversion, V to A, voltage amperage calculator, electrical current calculator',
  openGraph: {
    title: 'Volts to Amps Calculator - Electrical Conversion Tool',
    description: 'Current from power and voltage: I = P ÷ (V × PF) single-phase, I = P ÷ (√3 × V × PF) three-phase.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/volts-to-amps-calculator',
    images: ['/opengraph-image']
  },
  alternates: { canonical: '/calculators/volts-to-amps-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "Volts to Amps Calculator",
  url: "https://wiresizes.com/calculators/volts-to-amps-calculator",
  description: "Current from power and voltage: I = P ÷ (V × PF) single-phase, I = P ÷ (√3 × V × PF) three-phase."
};

export default function VoltsToAmpsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CombinedSchema 
        webApp={webAppData} 
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
              Calculate electrical current (amperage) 
              from voltage and power for AC circuits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mb-2 mx-auto" />
                <p className="text-2xl leading-tight font-semibold text-gray-900 dark:text-white">Power Formula</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">P = V × I conversions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <VoltsToAmpsCalculator />
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
                    <span><strong>12 V Systems:</strong> Automotive, RV, Marine</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">▶</span>
                    <span><strong>24 V Systems:</strong> Trucks, Industrial controls</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">▶</span>
                    <span><strong>48 V Systems:</strong> Telecom, Data centers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">▶</span>
                    <span><strong>High Voltage DC:</strong> Solar strings, EV charging</span>
                  </li>
                </ul>
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
                  Example: 10 % voltage drop<br/>
                  = 11 % current increase
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
                  Example: 10 % overvoltage<br/>
                  = Reduced equipment life
                </p>
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
          <Link href="/calculators/amps-to-watts-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Zap className="h-8 w-8 text-yellow-600 mb-2" />
            <h3 className="font-semibold mb-1">Amps to Watts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Convert current to power</p>
          </Link>
          
          <Link href="/calculators/watts-to-amps-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Calculator className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold mb-1">Watts to Amps</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Power to current converter</p>
          </Link>
          
          <Link href="/calculators/ohms-law-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
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