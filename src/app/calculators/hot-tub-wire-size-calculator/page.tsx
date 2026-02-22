import { Metadata } from 'next';
import HotTubWireSizeCalculator from '@/components/calculators/HotTubWireSizeCalculator';
import { Waves, Shield, DollarSign, Thermometer, AlertTriangle, CheckCircle, Home, Zap, Calculator, Timer, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Hot Tub Wire Size Calculator | Spa Electrical Requirements & GFCI',
  description: 'Calculate exact wire size, GFCI breaker requirements, disconnect placement for hot tub installation. Supports all spa brands, 120V/240V systems. NEC 680 compliant with heating cost analysis.',
  keywords: 'hot tub wire size, spa electrical requirements, hot tub GFCI breaker, 50 amp hot tub wire, jacuzzi electrical hookup, hot tub disconnect box, spa wire gauge calculator, 240V hot tub wiring, hot tub installation cost, outdoor spa electrical',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Hot Tub Wire Size Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Calculate electrical requirements for hot tub and spa installations per NEC.",
  "keywords": "hot tub wiring, spa electrical, GFCI protection",
  "url": `https://wiresizes.com/calculators/hot-tub-wire-size-calculator`,
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

const COMPREHENSIVE_FAQS = [
  {
    question: 'What wire size do I need for a 50 amp hot tub?',
    answer: 'For a 50A hot tub circuit, you need 6 AWG copper wire or 4 AWG aluminum wire minimum. Unlike continuous loads, hot tubs don\'t require 125% sizing per NEC 680.42. However, for runs over 75 feet, consider 4 AWG copper to minimize voltage drop below 3%. Always use THWN-2 rated wire for wet locations.'
  },
  {
    question: 'Is GFCI protection required for hot tubs?',
    answer: 'Yes, GFCI protection is mandatory for all hot tubs per NEC 680.42. You need either a GFCI circuit breaker in the main panel or a GFCI disconnect at the hot tub location. The GFCI must be rated for the circuit amperage and tested monthly. This protection prevents electrocution from ground faults.'
  },
  {
    question: 'Where should the disconnect switch be located?',
    answer: 'The disconnect must be within sight of the hot tub and at least 5 feet away but not more than 50 feet per NEC 680.13. It cannot be located behind a door or require reaching over the hot tub. Most installers place it 5-10 feet away on an adjacent wall or post for easy emergency access.'
  },
  {
    question: 'Can I use aluminum wire for hot tub installation?',
    answer: 'Yes, aluminum wire is acceptable and often more economical for hot tub circuits. Use anti-oxidant compound on all connections and proper AL-rated terminals. Aluminum requires one size larger than copper (4 AWG aluminum vs 6 AWG copper for 50A). Many professionals use aluminum for cost savings on longer runs.'
  },
  {
    question: 'Do I need a permit for hot tub electrical installation?',
    answer: 'Yes, most jurisdictions require both building and electrical permits for hot tub installation. The permit ensures code compliance, proper GFCI protection, and bonding requirements. Inspection is typically required before energizing. Permit costs range from $75-300 depending on location.'
  },
  {
    question: 'What\'s the difference between 120V and 240V hot tubs?',
    answer: '120V "plug-and-play" hot tubs plug into standard outlets but heat slowly (1-2°F per hour) and can\'t run heater and jets simultaneously. 240V hot tubs heat faster (6-8°F per hour), maintain temperature better, and run all features simultaneously. 240V is strongly recommended for year-round use.'
  },
  {
    question: 'How much does hot tub electrical installation cost?',
    answer: 'Professional installation typically costs $1,500-3,500 including: materials ($400-800), labor ($800-1,500), permit ($75-300), GFCI breaker/disconnect ($250-500). Factors affecting cost: distance from panel, trenching needs, panel capacity, and local labor rates. Get multiple quotes.'
  },
  {
    question: 'What is equipotential bonding for hot tubs?',
    answer: 'Equipotential bonding connects all metal parts within 5 feet of the hot tub to eliminate voltage gradients per NEC 680.26. This includes metal piping, rebar in concrete, metal fences, and equipment. Use #8 solid copper bonding wire. This critical safety feature prevents electric shock from stray currents.'
  },
  {
    question: 'Can my 100 amp electrical panel handle a hot tub?',
    answer: 'It depends on your existing loads. Calculate: 100A panel - existing loads = available capacity. Most 50A hot tubs need 50-60A available. If insufficient, options include: load shedding, time-of-use controls, or panel upgrade ($1,500-3,000). Many 100A panels require upgrade for hot tub addition.'
  },
  {
    question: 'How much does it cost to run a hot tub monthly?',
    answer: 'Operating costs vary by climate, usage, and electricity rates. Typical ranges: Warm climate: $30-50/month, Moderate: $50-80/month, Cold climate: $80-120/month. Factors include: heater runtime, cover quality, ambient temperature, and usage frequency. Energy-efficient models with good insulation cost less.'
  }
];

const BRAND_COMPARISON_TABLE = [
  { brand: 'Hot Spring', models: '15+', powerRange: '30-60A', heaterSize: '4-6kW', avgPrice: '$8,000-20,000', efficiency: 'Excellent', warranty: '5 years', features: 'Smart controls, energy efficient' },
  { brand: 'Jacuzzi', models: '20+', powerRange: '40-60A', heaterSize: '5.5-6kW', avgPrice: '$6,000-18,000', efficiency: 'Very Good', warranty: '5 years', features: 'Italian design, hydrotherapy jets' },
  { brand: 'Caldera', models: '12+', powerRange: '30-50A', heaterSize: '4-5.5kW', avgPrice: '$7,000-16,000', efficiency: 'Excellent', warranty: '5 years', features: 'FiberCor insulation, comfort control' },
  { brand: 'Sundance', models: '15+', powerRange: '40-60A', heaterSize: '5.5-6kW', avgPrice: '$8,000-18,000', efficiency: 'Very Good', warranty: '5 years', features: 'Fluidix jets, UV-C sanitation' },
  { brand: 'Bullfrog', models: '10+', powerRange: '30-60A', heaterSize: '4-6kW', avgPrice: '$7,000-15,000', efficiency: 'Good', warranty: '5 years', features: 'JetPak therapy system' },
  { brand: 'Master Spas', models: '25+', powerRange: '40-60A', heaterSize: '5.5-6kW', avgPrice: '$5,000-20,000', efficiency: 'Good', warranty: '5 years', features: 'Mast3rPur water system' },
  { brand: 'Arctic Spas', models: '20+', powerRange: '40-60A', heaterSize: '5.5-6kW', avgPrice: '$6,000-15,000', efficiency: 'Excellent', warranty: '5 years', features: 'Cold weather package, thick insulation' },
  { brand: 'Coleman', models: '5+', powerRange: '15-30A', heaterSize: '1.3-4kW', avgPrice: '$500-3,000', efficiency: 'Fair', warranty: '1 year', features: 'Inflatable, portable, budget-friendly' }
];

const INSTALLATION_COSTS_BREAKDOWN = [
  { item: 'GFCI Breaker (50A)', lowCost: 200, highCost: 350, notes: 'Required by code, test monthly' },
  { item: 'Disconnect Box', lowCost: 150, highCost: 300, notes: 'Weatherproof, lockable recommended' },
  { item: 'Wire (6 AWG copper, 50ft)', lowCost: 250, highCost: 400, notes: 'THWN-2 for wet locations' },
  { item: 'Conduit & Fittings', lowCost: 150, highCost: 300, notes: 'PVC for underground, EMT for exposed' },
  { item: 'Ground Wire & Bonding', lowCost: 75, highCost: 150, notes: '#8 solid copper for bonding grid' },
  { item: 'Labor - Basic Install', lowCost: 800, highCost: 1500, notes: '4-8 hours typical' },
  { item: 'Permit & Inspection', lowCost: 75, highCost: 300, notes: 'Required in most areas' },
  { item: 'Trenching (if needed)', lowCost: 300, highCost: 800, notes: 'Per 50ft, depth 18-24"' },
  { item: 'Panel Upgrade (if needed)', lowCost: 1500, highCost: 3000, notes: 'From 100A to 200A service' },
  { item: 'Concrete Pad', lowCost: 500, highCost: 1500, notes: 'Level, reinforced base' }
];

const ENERGY_EFFICIENCY_TIPS = [
  { 
    tip: 'Use a Quality Cover', 
    savings: '50-70%', 
    description: 'A well-fitting, insulated cover prevents 50-70% of heat loss. Replace when waterlogged or damaged.',
    cost: '$300-600',
    payback: '6 months'
  },
  { 
    tip: 'Lower Temperature When Away', 
    savings: '5-10%', 
    description: 'Reduce temperature by 5°F when not using for several days. Don\'t turn off completely.',
    cost: 'Free',
    payback: 'Immediate'
  },
  { 
    tip: 'Optimize Filtration Cycles', 
    savings: '10-20%', 
    description: 'Run filtration during off-peak hours. Most tubs only need 4-6 hours daily.',
    cost: 'Free',
    payback: 'Immediate'
  },
  { 
    tip: 'Wind Barriers', 
    savings: '10-15%', 
    description: 'Install privacy panels or landscaping to block wind. Wind dramatically increases heat loss.',
    cost: '$200-1000',
    payback: '1 year'
  },
  { 
    tip: 'Regular Maintenance', 
    savings: '15-25%', 
    description: 'Clean filters weekly, balance water chemistry. Poor maintenance makes heater work harder.',
    cost: '$20/month',
    payback: 'Ongoing'
  },
  { 
    tip: 'Upgrade to Variable Speed Pumps', 
    savings: '30-50%', 
    description: 'VS pumps use less energy during filtration. Significant savings over single-speed.',
    cost: '$800-1200',
    payback: '2 years'
  }
];

const SEASONAL_MAINTENANCE = [
  {
    season: 'Spring',
    tasks: [
      'Deep clean after winter use',
      'Inspect cover for winter damage',
      'Check and clean filters thoroughly',
      'Test GFCI protection',
      'Balance water chemistry',
      'Inspect cabinet for pest intrusion'
    ]
  },
  {
    season: 'Summer',
    tasks: [
      'Monitor sanitizer levels (heavy use)',
      'Clean filters weekly',
      'Check pH twice weekly',
      'Ensure adequate ventilation',
      'Monitor for algae growth',
      'Adjust filtration cycles'
    ]
  },
  {
    season: 'Fall',
    tasks: [
      'Winterization prep (cold climates)',
      'Inspect/replace cover before winter',
      'Check heater operation',
      'Clean leaves from equipment area',
      'Test freeze protection systems',
      'Stock winter chemicals'
    ]
  },
  {
    season: 'Winter',
    tasks: [
      'Monitor for freezing conditions',
      'Keep water circulating in cold snaps',
      'Clear snow from cover (carefully)',
      'Check heater cycling frequency',
      'Maintain proper water level',
      'Test backup power if available'
    ]
  }
];

export default function HotTubWireSizeCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['hot-tub-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Waves className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Hot Tub Wire Size Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-blue-50">
                Professional electrical sizing for hot tub and spa installations. Calculate wire gauge, 
                GFCI requirements, disconnect placement, and operating costs for any hot tub model.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-blue-100">Code Compliant</div>
                  <div className="font-semibold">NEC 680</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-blue-100">All Brands</div>
                  <div className="font-semibold">15+ Models</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-blue-100">Safety First</div>
                  <div className="font-semibold">GFCI Required</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-blue-100">Cost Analysis</div>
                  <div className="font-semibold">Energy Calculator</div>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Warning */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-red-900 mb-2">Critical Safety Requirements</h2>
                <ul className="text-red-800 space-y-1">
                  <li>• Hot tub electrical work requires permits and professional installation in most areas</li>
                  <li>• GFCI protection is mandatory - never bypass or remove GFCI devices</li>
                  <li>• Improper installation can cause electrocution, fire, or death</li>
                  <li>• All metal within 5 feet must be bonded per NEC 680.26</li>
                  <li>• Disconnect switch must be within sight but at least 5 feet from hot tub</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <HotTubWireSizeCalculator />

          {/* Brand Comparison Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Waves className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Hot Tub Brand Electrical Requirements</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Compare electrical requirements and specifications across major hot tub brands to plan your installation.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Brand</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Models</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Power Range</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Heater Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Price Range</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Efficiency</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Warranty</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Key Features</th>
                  </tr>
                </thead>
                <tbody>
                  {BRAND_COMPARISON_TABLE.map((brand, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{brand.brand}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{brand.models}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-blue-600 font-medium">{brand.powerRange}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{brand.heaterSize}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{brand.avgPrice}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          brand.efficiency === 'Excellent' ? 'bg-green-100 text-green-700' :
                          brand.efficiency === 'Very Good' ? 'bg-blue-100 text-blue-700' :
                          brand.efficiency === 'Good' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {brand.efficiency}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{brand.warranty}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{brand.features}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Installation Cost Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Complete Installation Cost Breakdown</h2>
            </div>
            
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Item</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Low Cost</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">High Cost</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {INSTALLATION_COSTS_BREAKDOWN.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{item.item}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-green-600 font-medium">${item.lowCost}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-red-600 font-medium">${item.highCost}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-semibold">
                    <td className="border border-gray-300 px-4 py-3">Total (Basic Install)</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-green-700">$1,900</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-red-700">$3,700</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">Excludes hot tub unit</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Budget Installation</h3>
                <div className="text-2xl font-bold text-green-700">$1,500-2,000</div>
                <p className="text-sm text-green-600 mt-2">
                  Short run (&lt;30ft), existing capacity, DIY possible
                </p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">Average Installation</h3>
                <div className="text-2xl font-bold text-yellow-700">$2,500-3,500</div>
                <p className="text-sm text-yellow-600 mt-2">
                  50-75ft run, professional install, permit included
                </p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-red-800 mb-2">Complex Installation</h3>
                <div className="text-2xl font-bold text-red-700">$4,000-6,000+</div>
                <p className="text-sm text-red-600 mt-2">
                  Long run, panel upgrade, trenching, sub-panel
                </p>
              </div>
            </div>
          </div>

          {/* Energy Efficiency Tips */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Energy Efficiency & Cost Savings</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {ENERGY_EFFICIENCY_TIPS.map((tip, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{tip.tip}</h3>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                      Save {tip.savings}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Investment:</span>
                      <div className="font-medium text-gray-900">{tip.cost}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Payback:</span>
                      <div className="font-medium text-purple-600">{tip.payback}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Smart Tip: Time-of-Use Rates</h3>
              <p className="text-purple-700 text-sm">
                If your utility offers time-of-use rates, program filtration and heating for off-peak hours. 
                This can save 30-50% on operating costs. Peak hours are typically 4-9 PM weekdays.
              </p>
            </div>
          </div>

          {/* Seasonal Maintenance Schedule */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Timer className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Seasonal Maintenance Schedule</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SEASONAL_MAINTENANCE.map((season, idx) => {
                const colors = ['green', 'yellow', 'orange', 'blue'];
                const color = colors[idx];
                
                return (
                  <div key={idx} className={`bg-${color}-50 rounded-lg p-4 border border-${color}-200`}>
                    <h3 className={`font-semibold text-${color}-800 mb-3`}>
                      {season.season} Maintenance
                    </h3>
                    <ul className="space-y-2">
                      {season.tasks.map((task, taskIdx) => (
                        <li key={taskIdx} className="text-sm text-gray-700 flex items-start gap-2">
                          <CheckCircle className={`w-4 h-4 text-${color}-600 mt-0.5 flex-shrink-0`} />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">Pro Tip: Create a Maintenance Log</h3>
              <p className="text-orange-700 text-sm">
                Keep a log of water tests, filter cleanings, and chemical additions. This helps identify patterns, 
                prevents problems, and can be valuable for warranty claims. Many issues are prevented with consistent maintenance.
              </p>
            </div>
          </div>

          {/* Common Problems & Solutions */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border border-red-200">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Common Electrical Problems & Solutions</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 mb-2">GFCI Tripping Frequently</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Causes:</strong> Moisture in connections, damaged heating element, faulty pump motor
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Solution:</strong> Check all connections for moisture, test components individually, replace faulty parts
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                <h3 className="font-semibold text-orange-800 mb-2">Heater Not Working</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Causes:</strong> Low water flow, dirty filter, failed high-limit switch
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Solution:</strong> Clean filter, check water level, test high-limit switch, verify proper voltage
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
                <h3 className="font-semibold text-yellow-800 mb-2">Pumps Running Weakly</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Causes:</strong> Voltage drop, undersized wire, loose connections
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Solution:</strong> Check voltage at equipment, tighten connections, upgrade wire size if needed
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-800 mb-2">Display Shows Error Codes</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Common Codes:</strong> FLO (flow), SN (sensor), OH (overheat), FL (flow switch)
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Solution:</strong> Reference manual for specific codes, most relate to flow or temperature sensors
                </p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Electrical Calculators</h2>
              <p className="text-gray-600">Complete your hot tub installation with these professional tools</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Wire Size</h3>
                <p className="text-sm text-gray-600">General wire sizing</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Voltage Drop</h3>
                <p className="text-sm text-gray-600">Calculate voltage loss</p>
              </Link>
              
              <Link href="/calculators/ground-wire-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Grounding</h3>
                <p className="text-sm text-gray-600">Bonding requirements</p>
              </Link>
              
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Home className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Load Calculator</h3>
                <p className="text-sm text-gray-600">Panel capacity check</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}