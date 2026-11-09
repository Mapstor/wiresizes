import { Metadata } from 'next';
import { BTUToWattsCalculator } from '@/components/calculators/BTUToWattsCalculator';
import { Flame, Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { Byline } from '@/components/content/Byline';
import { Sources } from '@/components/content/Sources';
import { DOMAINS as CONVERSIONS_DOMAINS } from '@/lib/calculations/conversions';

const SOURCE_DOMAINS = CONVERSIONS_DOMAINS;

export const metadata: Metadata = {
  title: 'BTU to Watts Calculator',
  description: 'Convert BTU/hr to watts (1 W = 3.412 BTU/hr) for HVAC, heating, and electric resistance load calculations. Reverse direction supported.',
  keywords: 'btu to watts, btu/hr to watts, hvac calculator, heating cooling conversion, energy converter, air conditioner watts',
  openGraph: {
    title: 'BTU to Watts Calculator',
    description: 'Convert BTU/hr to watts for HVAC equipment.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/btu-to-watts-calculator',
    images: ['/opengraph-image']
  },
  alternates: { canonical: '/calculators/btu-to-watts-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "BTU to Watts Calculator",
  url: "https://wiresizes.com/calculators/btu-to-watts-calculator",
  description: "BTU to watts converter for HVAC and electrical systems. Essential for electricians and HVAC technicians."
};

export default function BTUToWattsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CombinedSchema 
        webApp={webAppData} 
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
              BTU/hr to watts converter for HVAC systems.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <Flame className="h-8 w-8 text-orange-600 mb-2 mx-auto" />
                <p className="text-2xl leading-tight font-semibold text-gray-900 dark:text-white">Heat Output</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">BTU/hr thermal capacity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <BTUToWattsCalculator />
        </div>
        <Byline route="/calculators/btu-to-watts-calculator" sources className="mt-4 px-8 text-sm text-gray-600 dark:text-gray-400" linkClassName="text-blue-600 hover:underline dark:text-blue-300" />
      </section>

      {/* Quick Reference Tables */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <Calculator className="mr-3 h-8 w-8 text-blue-600" />
          Common BTU to Watts Conversions
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Air Conditioner Sizes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 min-w-0">
            <h3 className="text-xl font-bold mb-4 text-blue-600">Air Conditioner Sizes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2">Tons</th>
                    <th className="text-center py-2">BTU/hr</th>
                    <th className="text-center py-2">Thermal Watts</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">0.75</td>
                    <td className="text-center">9,000</td>
                    <td className="text-center">2,638 W</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">1.0</td>
                    <td className="text-center">12,000</td>
                    <td className="text-center">3,517 W</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">1.5</td>
                    <td className="text-center">18,000</td>
                    <td className="text-center">5,275 W</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">2.0</td>
                    <td className="text-center">24,000</td>
                    <td className="text-center">7,034 W</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">2.5</td>
                    <td className="text-center">30,000</td>
                    <td className="text-center">8,792 W</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">3.0</td>
                    <td className="text-center">36,000</td>
                    <td className="text-center">10,551 W</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">3.5</td>
                    <td className="text-center">42,000</td>
                    <td className="text-center">12,309 W</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">4.0</td>
                    <td className="text-center">48,000</td>
                    <td className="text-center">14,067 W</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">5.0</td>
                    <td className="text-center">60,000</td>
                    <td className="text-center">17,584 W</td>
                  </tr>
                </tbody>
              </table>
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
                  <p className="text-sm mb-2">BTU/hr cooling ÷ Watts input at 95 °F</p>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded">
                  <h4 className="font-semibold mb-2">SEER (Seasonal EER)</h4>
                  <p className="text-sm mb-2">Seasonal average efficiency</p>
                </div>
                
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-600">Heating Efficiency Metrics</h3>
              <div className="space-y-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded">
                  <h4 className="font-semibold mb-2">COP (Coefficient of Performance)</h4>
                  <p className="text-sm mb-2">Heat output ÷ Energy input</p>
                </div>
                
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded">
                  <h4 className="font-semibold mb-2">HSPF (Heating Seasonal Performance Factor)</h4>
                  <p className="text-sm mb-2">BTU heating ÷ Watt-hours (seasonal)</p>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <Sources
            domains={SOURCE_DOMAINS}
            headingClassName="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
            listClassName="space-y-2 text-gray-700 dark:text-gray-300"
            linkClassName="text-blue-600 hover:underline dark:text-blue-300"
            noteClassName="mt-4 text-sm text-gray-600 dark:text-gray-400"
          />
        </div>
      </section>

      {/* Related Calculators */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Related HVAC & Electrical Calculators
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/calculators/watts-to-amps-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Calculator className="h-8 w-8 text-blue-600 mb-2" />
            <h3 data-name="" className="font-semibold mb-1">Watts to Amps</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Convert power to current</p>
          </Link>
          
          <Link href="/calculators/wire-size-calculator" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
            <h3 data-name="" className="font-semibold mb-1">Wire Size</h3>
          </Link>
          
          
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
              while oversized systems short-cycle, reducing efficiency and lifespan. Size the equipment from a Manual J load
              calculation. Installation requires EPA 608 certification for refrigerant handling and electrical licensing for 
              power connections. Consult qualified HVAC professionals for system design and installation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}