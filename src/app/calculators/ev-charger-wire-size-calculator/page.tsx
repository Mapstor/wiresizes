import { Metadata } from 'next';
import EVChargerWireSizeCalculator from '@/components/calculators/EVChargerWireSizeCalculator';
import { Car, Zap, DollarSign, Shield, Clock, TrendingUp, Calculator, Home, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'EV Charger Wire Size Calculator | Electric Vehicle Charging Installation',
  description: 'Calculate exact wire size, breaker requirements, and installation costs for EV chargers. Supports Tesla, Level 2, all electric vehicles. NEC Article 625 compliant with voltage drop analysis.',
  keywords: 'EV charger wire size, Tesla charger wire, Level 2 charger wiring, electric vehicle charger installation, EV charging wire gauge, NEMA 14-50 wire size, Tesla Wall Connector wire, EV charger breaker size, 240V charger wire, electric car charger cable size',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "EV Charger Wire Size Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Calculate proper wire size for Level 2 electric vehicle charging installations.",
  "keywords": "EV charger wiring, electric vehicle, Level 2 charger",
  "url": `https://wiresizes.com/calculators/ev-charger-wire-size-calculator`,
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
    question: 'What wire size do I need for a Tesla Wall Connector?',
    answer: 'For a Tesla Wall Connector at maximum 48A output, you need 60A circuit with 6 AWG copper or 4 AWG aluminum wire. The circuit must be sized at 125% of continuous load per NEC 625.41, so 48A × 1.25 = 60A minimum. For runs over 75 feet, consider 4 AWG copper to minimize voltage drop below 3%.'
  },
  {
    question: 'Can I use aluminum wire for EV charger installation?',
    answer: 'Yes, aluminum wire is acceptable and often more cost-effective for EV chargers. Use anti-oxidant compound on connections and ensure proper torque specifications. Aluminum requires one size larger than copper (e.g., 4 AWG aluminum instead of 6 AWG copper for 60A circuit). Many professional installers prefer aluminum for long runs due to significant cost savings.'
  },
  {
    question: 'Do I need a permit to install an EV charger?',
    answer: 'Yes, most jurisdictions require both building and electrical permits for EV charger installation. Some areas have specific EV charger permits. The permit ensures code compliance, safety inspection, and may be required for utility rebates. Cost typically ranges from $50-300 depending on location.'
  },
  {
    question: 'What\'s the difference between hardwired and plug-in EV chargers?',
    answer: 'Hardwired chargers connect directly to the electrical circuit and are required for installations over 50A or 250V per NEC 625.44. Plug-in chargers (like NEMA 14-50) are limited to 50A circuits, easier to replace, but have additional connection point that could fail. Hardwired is preferred for outdoor installations.'
  },
  {
    question: 'How much does professional EV charger installation cost?',
    answer: 'Professional installation typically costs $800-2,500, depending on: distance from panel ($10-20/foot), amperage (higher = more expensive), panel upgrade needs ($1,500-3,000), permit fees ($50-300), outdoor vs indoor (+$300-500), and local labor rates. Get multiple quotes and check for utility rebates.'
  },
  {
    question: 'Can my electrical panel handle an EV charger?',
    answer: 'Most 200A panels can handle a 40-50A EV charger if you have 50-60A available capacity. Calculate: Total panel amperage - current loads = available capacity. If insufficient, options include: load management systems, time-of-use scheduling, or panel upgrade. 100A panels often require upgrade.'
  },
  {
    question: 'What is the 80% rule for EV charging?',
    answer: 'The 80% rule (NEC 625.41) requires continuous loads like EV charging to not exceed 80% of circuit rating. A 50A circuit can continuously supply 40A, a 60A circuit supplies 48A. This prevents overheating and ensures safety. Always size the circuit at 125% of the charger\'s maximum current draw.'
  },
  {
    question: 'How far can I run wire for an EV charger?',
    answer: 'Distance depends on wire size and acceptable voltage drop (3% recommended). For 50A circuit: 6 AWG copper works to 75 feet, 4 AWG to 125 feet, 2 AWG to 200 feet. Aluminum requires larger sizes. Calculate voltage drop for your specific installation to ensure efficiency.'
  },
  {
    question: 'Should I install 50A or 60A circuit for future-proofing?',
    answer: 'Install the highest amperage your panel can support. 60A circuit (48A continuous) charges most EVs 20% faster than 50A (40A continuous) and costs marginally more. Consider: current EV capabilities, potential future EVs, available panel capacity, and installation cost difference (usually $50-150 more for 60A).'
  },
  {
    question: 'What conduit size do I need for EV charger wiring?',
    answer: '1" conduit for 6 AWG wire (50-60A circuits), 3/4" for 8 AWG (40A circuits), 1.25" for 4 AWG or parallel runs. EMT for indoor, rigid/PVC for outdoor/underground. Include ground wire in conduit fill calculations. Leave room for future wire pulls if possible.'
  }
];

const VEHICLE_CHARGING_COMPARISON = [
  { vehicle: 'Tesla Model 3 LR', battery: 82, level1: 58.6, level2_32a: 10.6, level2_48a: 7.1, dcfast: 0.33 },
  { vehicle: 'Tesla Model Y', battery: 75, level1: 53.6, level2_32a: 9.7, level2_48a: 6.5, dcfast: 0.30 },
  { vehicle: 'Ford F-150 Lightning', battery: 131, level1: 93.6, level2_32a: 17.0, level2_48a: 11.4, dcfast: 0.73 },
  { vehicle: 'Chevrolet Bolt EV', battery: 65, level1: 46.4, level2_32a: 8.4, level2_48a: 5.7, dcfast: 1.0 },
  { vehicle: 'Ford Mustang Mach-E', battery: 91, level1: 65.0, level2_32a: 11.8, level2_48a: 7.9, dcfast: 0.45 },
  { vehicle: 'Hyundai Ioniq 5', battery: 77, level1: 55.0, level2_32a: 10.0, level2_48a: 6.7, dcfast: 0.30 },
  { vehicle: 'Volkswagen ID.4', battery: 82, level1: 58.6, level2_32a: 10.6, level2_48a: 7.1, dcfast: 0.50 },
  { vehicle: 'Rivian R1T', battery: 135, level1: 96.4, level2_32a: 17.5, level2_48a: 11.7, dcfast: 0.75 },
  { vehicle: 'BMW iX', battery: 111, level1: 79.3, level2_32a: 14.4, level2_48a: 9.7, dcfast: 0.58 },
  { vehicle: 'Nissan Leaf Plus', battery: 62, level1: 44.3, level2_32a: 8.1, level2_48a: 5.4, dcfast: 0.75 }
];

const STATE_INCENTIVES = [
  { state: 'California', utility: 'Up to $1,500', tax: '30% Federal', additional: 'Time-of-use rates, CALeVIP program' },
  { state: 'New York', utility: '$500-1,500', tax: '30% Federal', additional: 'Drive Clean Rebate, Con Edison programs' },
  { state: 'Colorado', utility: '$500-1,000', tax: '30% Federal + State', additional: 'Xcel Energy rebates, HOV lane access' },
  { state: 'Texas', utility: '$250-500', tax: '30% Federal', additional: 'Austin Energy, Oncor rebates' },
  { state: 'Florida', utility: '$200-500', tax: '30% Federal', additional: 'FPL Evolution program, Duke Energy' },
  { state: 'Washington', utility: 'Up to $1,000', tax: '30% Federal', additional: 'No sales tax on EVs' },
  { state: 'Oregon', utility: '$500-750', tax: '30% Federal', additional: 'PGE, Pacific Power programs' },
  { state: 'Massachusetts', utility: 'Up to $700', tax: '30% Federal', additional: 'MOR-EV program, National Grid' },
  { state: 'Illinois', utility: '$500-1,000', tax: '30% Federal', additional: 'ComEd hourly pricing' },
  { state: 'New Jersey', utility: '$250-500', tax: '30% Federal', additional: 'PSE&G, JCP&L programs' }
];

const CHARGER_BRAND_COMPARISON = [
  { 
    brand: 'Tesla Wall Connector', 
    maxPower: '11.5kW (48A)', 
    price: '$475', 
    features: 'WiFi, load sharing, Tesla app integration, 24ft cable',
    compatibility: 'All EVs with adapter',
    warranty: '4 years'
  },
  {
    brand: 'ChargePoint Home Flex',
    maxPower: '12kW (50A)',
    price: '$749',
    features: 'WiFi, app control, Amazon Alexa, 23ft cable',
    compatibility: 'All EVs (J1772)',
    warranty: '3 years'
  },
  {
    brand: 'Grizzl-E Classic',
    maxPower: '9.6kW (40A)',
    price: '$399',
    features: 'Durable outdoor rated, adjustable amperage, 24ft cable',
    compatibility: 'All EVs (J1772)',
    warranty: '3 years'
  },
  {
    brand: 'JuiceBox 48',
    maxPower: '11.5kW (48A)',
    price: '$659',
    features: 'WiFi, smart grid ready, app control, 25ft cable',
    compatibility: 'All EVs (J1772)',
    warranty: '3 years'
  },
  {
    brand: 'Wallbox Pulsar Plus',
    maxPower: '11.5kW (48A)',
    price: '$699',
    features: 'WiFi, Bluetooth, compact design, app control',
    compatibility: 'All EVs (J1772)',
    warranty: '3 years'
  },
  {
    brand: 'Ford Charge Station Pro',
    maxPower: '19.2kW (80A)',
    price: '$1,310',
    features: 'Bidirectional charging, home backup capable',
    compatibility: 'All EVs, optimized for Lightning',
    warranty: '3 years'
  }
];

export default function EVChargerWireSizeCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['ev-charger-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Car className="w-10 h-10" />
                <h1 className="text-4xl font-bold">EV Charger Wire Size Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-green-50">
                Professional wire sizing for electric vehicle charger installation. Calculate exact wire gauge, 
                breaker size, installation costs, and charging times for any EV model.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">NEC Compliant</div>
                  <div className="font-semibold">Article 625</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">All EV Models</div>
                  <div className="font-semibold">15+ Brands</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">Cost Analysis</div>
                  <div className="font-semibold">ROI Calculator</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">Pro Accurate</div>
                  <div className="font-semibold">Voltage Drop</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <EVChargerWireSizeCalculator />

          {/* Comprehensive Vehicle Charging Time Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Complete EV Charging Time Comparison</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Actual charging times from 0-100% for popular electric vehicles across different charging speeds.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Vehicle Model</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Battery (kWh)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Level 1<br/><span className="text-xs font-normal">120V/12A</span></th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Level 2<br/><span className="text-xs font-normal">240V/32A</span></th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Level 2<br/><span className="text-xs font-normal">240V/48A</span></th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">DC Fast<br/><span className="text-xs font-normal">150kW+</span></th>
                  </tr>
                </thead>
                <tbody>
                  {VEHICLE_CHARGING_COMPARISON.map((vehicle, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{vehicle.vehicle}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{vehicle.battery}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-red-600">{vehicle.level1.toFixed(1)}h</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-yellow-600">{vehicle.level2_32a.toFixed(1)}h</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-green-600">{vehicle.level2_48a.toFixed(1)}h</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-blue-600">{vehicle.dcfast.toFixed(1)}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg p-3">
                <div className="text-sm font-medium text-red-800">Level 1 (Standard Outlet)</div>
                <div className="text-xs text-red-600">3-4 miles per hour • Emergency use only</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-sm font-medium text-yellow-800">Level 2 (Home Charger)</div>
                <div className="text-xs text-yellow-600">20-44 miles per hour • Recommended</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-800">DC Fast Charging</div>
                <div className="text-xs text-blue-600">180-300 miles per hour • Road trips</div>
              </div>
            </div>
          </div>

          {/* State Incentives Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">EV Charger Installation Incentives by State</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Federal tax credit covers 30% of installation costs (up to $1,000) through 2032. Additional state and utility incentives available.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">State</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Utility Rebates</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Tax Credits</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Additional Programs</th>
                  </tr>
                </thead>
                <tbody>
                  {STATE_INCENTIVES.map((state, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{state.state}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-green-600 font-medium">{state.utility}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{state.tax}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{state.additional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">How to Claim Incentives:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Check utility website for pre-installation requirements</li>
                <li>2. Use licensed electrician (often required for rebates)</li>
                <li>3. Submit application with itemized invoices</li>
                <li>4. File IRS Form 8911 for federal tax credit</li>
                <li>5. Keep all documentation for 5+ years</li>
              </ol>
            </div>
          </div>

          {/* Charger Brand Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Popular EV Charger Comparison</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Charger Model</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Max Power</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Price</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Key Features</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Compatibility</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Warranty</th>
                  </tr>
                </thead>
                <tbody>
                  {CHARGER_BRAND_COMPARISON.map((charger, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{charger.brand}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-purple-600 font-medium">{charger.maxPower}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold">{charger.price}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{charger.features}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">{charger.compatibility}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{charger.warranty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Installation Cost Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Detailed Installation Cost Breakdown</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Typical Installation Costs</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Charger Unit</span>
                    <span className="font-medium">$400-1,300</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Wire & Conduit (50ft run)</span>
                    <span className="font-medium">$200-500</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Circuit Breaker</span>
                    <span className="font-medium">$50-150</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Labor (4-8 hours)</span>
                    <span className="font-medium">$400-1,200</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Permits & Inspection</span>
                    <span className="font-medium">$100-300</span>
                  </div>
                  <div className="flex justify-between py-2 font-semibold text-lg">
                    <span>Total Range</span>
                    <span className="text-orange-600">$1,150-3,450</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Cost Factors & Upgrades</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-gray-800">Panel Upgrade</div>
                    <div className="text-sm text-gray-600">100A to 200A service</div>
                    <div className="text-orange-600 font-semibold">+$1,500-3,000</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-gray-800">Long Wire Run</div>
                    <div className="text-sm text-gray-600">Per additional 50ft</div>
                    <div className="text-orange-600 font-semibold">+$200-400</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-gray-800">Underground Trenching</div>
                    <div className="text-sm text-gray-600">Per 50ft trench</div>
                    <div className="text-orange-600 font-semibold">+$500-1,000</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-gray-800">Load Management System</div>
                    <div className="text-sm text-gray-600">Smart panel integration</div>
                    <div className="text-orange-600 font-semibold">+$500-1,500</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Mistakes Section */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border border-red-200">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Common Installation Mistakes to Avoid</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Undersizing the Circuit</h4>
                  <p className="text-sm text-gray-700">
                    Not applying the 125% continuous load rule. A 40A charger needs a 50A circuit, not 40A.
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    ✓ Always size at 125% of maximum charger current
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Ignoring Voltage Drop</h4>
                  <p className="text-sm text-gray-700">
                    Using minimum wire size without considering distance. Causes slow charging and inefficiency.
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    ✓ Calculate voltage drop, keep under 3%
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Wrong Wire Type</h4>
                  <p className="text-sm text-gray-700">
                    Using indoor-rated wire for outdoor runs or not using THWN-2 for wet locations.
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    ✓ Use proper wire ratings for environment
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Skipping the Permit</h4>
                  <p className="text-sm text-gray-700">
                    Installing without permits voids insurance, blocks rebates, and creates safety hazards.
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    ✓ Always get proper permits and inspections
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Inadequate Grounding</h4>
                  <p className="text-sm text-gray-700">
                    Incorrect ground wire size or missing equipment grounding conductor.
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    ✓ Follow NEC Table 250.122 for ground sizing
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Panel Overload</h4>
                  <p className="text-sm text-gray-700">
                    Not calculating total load before adding charger. Can trip main breaker or cause fires.
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    ✓ Perform load calculation, upgrade if needed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Section */}
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
              <p className="text-gray-600">Complete your EV charger installation with these professional tools</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Voltage Drop</h3>
                <p className="text-sm text-gray-600">Calculate voltage loss</p>
              </Link>
              
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Wire Size</h3>
                <p className="text-sm text-gray-600">General wire sizing</p>
              </Link>
              
              <Link href="/calculators/circuit-breaker-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Circuit Breaker</h3>
                <p className="text-sm text-gray-600">Breaker sizing tool</p>
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