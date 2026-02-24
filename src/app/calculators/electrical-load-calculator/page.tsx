import { Metadata } from 'next';
import { Suspense } from 'react';
import ClientElectricalLoadCalculator from '@/components/calculators/ClientElectricalLoadCalculator';
import { Calculator, TrendingUp, Target, BookOpen, Users, Shield, MapPin, Zap, Wrench, CheckCircle, AlertTriangle, Settings, Home, Building } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Electrical Load Calculator | Service Load Calculator | NEC Article 220',
  description: 'Calculate electrical load for residential and commercial services per NEC Article 220. Professional load calculations for service sizing and demand factors.',
  keywords: 'electrical load calculator, service load calculator, NEC Article 220, demand load calculation, electrical service sizing, connected load, electrical panel sizing',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Electrical Load Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Calculate total electrical load for residential and commercial service sizing.",
  "keywords": "electrical load, service calculation, NEC 220",
  "url": `https://wiresizes.com/calculators/electrical-load-calculator`,
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

const LOAD_CALCULATION_EXAMPLES = [
  {
    title: 'Standard 2000 sq ft Home',
    scenario: '3BR/2BA house, electric heat, standard appliances',
    calculation: 'General Lighting: 2000 sq ft × 3VA = 6000VA\nSmall Appliance: 2 circuits × 1500VA = 3000VA\nLaundry: 1 circuit × 1500VA = 1500VA\nGeneral Use Subtotal: 10500VA\nFirst 3000VA at 100%: 3000VA\nRemainder at 35%: 7500VA × 0.35 = 2625VA\nGeneral Demand: 5625VA\n\nFixed Appliances:\n- Range: 12kW → 8kW (demand)\n- Dryer: 5kW\n- Water Heater: 4.5kW\n- A/C: 3.5kW (nameplate)\n- Heat: 10kW (omit - A/C larger)\n\nTotal Calculated Load: 29.625kW\nService Size: 30kW ÷ 240V = 125A → 150A service',
    result: '150A service, 200A panel recommended',
    serviceSize: '150A minimum, 200A recommended',
    cost: '$2500-4000 service upgrade',
    application: 'Typical modern home electrical service'
  },
  {
    title: 'Large Custom Home',
    scenario: '4500 sq ft, 5BR/4BA, pool, workshop, EV charger',
    calculation: 'General Lighting: 4500 sq ft × 3VA = 13500VA\nSmall Appliance: 2 circuits × 1500VA = 3000VA\nLaundry: 1 circuit × 1500VA = 1500VA\nGeneral Use Subtotal: 18000VA\nDemand Calculation:\nFirst 3000VA at 100%: 3000VA\nRemainder at 35%: 15000VA × 0.35 = 5250VA\n\nFixed Appliances:\n- Range: 16kW → 11.2kW (70% demand)\n- Dryer: 7kW\n- Water Heater: 6kW\n- A/C: 5.5kW (largest load)\n- Pool Pump: 1.5kW\n- EV Charger: 11.5kW\n- Workshop: 8kW\n\nTotal: 59.45kW\nService: 59450W ÷ 240V = 248A → 300A service',
    result: '300A service with 400A panel',
    serviceSize: '300A service minimum',
    cost: '$8000-12000 service installation',
    application: 'High-end residential with multiple large loads'
  },
  {
    title: 'Small Commercial Office',
    scenario: '3000 sq ft office building, 15 workstations',
    calculation: 'General Lighting: 3000 sq ft × 3.5VA = 10500VA\nReceptacles: 3000 sq ft × 1VA = 3000VA\nFirst 10kVA at 100%: 10000VA\nRemainder at 50%: 3500VA × 0.5 = 1750VA\nLighting/Receptacle Demand: 11750VA\n\nHVAC: 20kW (nameplate)\nOffice Equipment: 8kW\nEmergency/Exit Lighting: 2kW\n\nTotal Connected: 41.75kW\nDemand Factor Applied: 35kW calculated\nService: 35000W ÷ (208V × √3) = 97A\nService Size: 100A minimum → 150A recommended',
    result: '150A 3-phase service',
    serviceSize: '150A 3-phase, 208/120V',
    cost: '$4000-6000 commercial service',
    application: 'Small commercial office building'
  },
  {
    title: 'Multi-Family Dwelling',
    scenario: '12-unit apartment building, each unit 800 sq ft',
    calculation: 'Per Unit Load:\nGeneral: 800 sq ft × 3VA = 2400VA\nSmall Appliance: 2 × 1500VA = 3000VA\nLaundry: 1500VA per unit\nRange: 8kW per unit\nA/C: 3.5kW per unit\n\nPer Unit Total: 18.4kW\n12 Units Connected Load: 220.8kW\n\nDemand Factors (NEC Table 220.84):\n- First 8 units at 100%\n- Remaining 4 units at 75%\n\nCalculated Demand:\n8 × 18.4kW = 147.2kW\n4 × 18.4kW × 0.75 = 55.2kW\nTotal: 202.4kW\n\n3-Phase Service: 202400W ÷ (208V × √3) = 560A\nService: 600A 3-phase',
    result: '600A 3-phase service',
    serviceSize: '600A 208/120V 3-phase',
    cost: '$15000-25000 service installation',
    application: 'Multi-family residential building'
  },
  {
    title: 'Restaurant Kitchen',
    scenario: 'Commercial kitchen with multiple cooking equipment',
    calculation: 'Connected Loads:\n- Electric Range: 25kW\n- Convection Oven: 12kW\n- Fryer: 15kW\n- Dishwasher: 9kW\n- Hood Fans: 3kW\n- Refrigeration: 8kW\n- Lighting: 4kW\n\nTotal Connected: 76kW\n\nDemand Factors (NEC Table 220.56):\nCooking Equipment > 3 units:\nDemand = 65% + 5% per unit over 3\nDemand = 65% + (1 × 5%) = 70%\nCooking Demand: 52kW × 0.70 = 36.4kW\n\nOther loads: 24kW at 100%\nTotal Demand: 60.4kW\n\n3-Phase Service: 60400W ÷ (208V × √3) = 167A\nService: 200A 3-phase',
    result: '200A 3-phase service',
    serviceSize: '200A 208V 3-phase',
    cost: '$5000-8000 commercial service',
    application: 'Commercial restaurant kitchen'
  }
];

const NEC_LOAD_CALCULATION_METHODS = [
  {
    method: 'Standard Method',
    necSection: 'Article 220 Part III',
    description: 'Traditional calculation method with specific demand factors',
    applicableTo: 'All residential and most commercial',
    complexity: 'Moderate',
    accuracy: 'Conservative (usually higher loads)',
    steps: [
      'Calculate general lighting and receptacle loads',
      'Apply demand factors per NEC tables',
      'Add fixed appliance loads',
      'Apply largest of heating or cooling load',
      'Sum all demand loads for service sizing'
    ],
    pros: 'Well established, conservative results, code inspector familiarity',
    cons: 'May oversize service, doesn\'t account for modern usage patterns'
  },
  {
    method: 'Optional Method',
    necSection: 'Article 220 Part IV',
    description: 'Alternative method for residential calculations',
    applicableTo: 'Single-family dwellings',
    complexity: 'Simpler',
    accuracy: 'More realistic for modern homes',
    steps: [
      'Calculate total connected load',
      'Apply single demand factor based on total load',
      'Include largest of heating or cooling',
      'No separate calculations for different load types'
    ],
    pros: 'Simpler calculation, often results in smaller service',
    cons: 'Limited to residential, may require engineering judgment'
  }
];

const DEMAND_FACTORS_TABLE = [
  {
    loadType: 'General Lighting (Residential)',
    calculation: 'First 3kVA at 100%, remainder at 35%',
    necReference: '220.42',
    example: '10kVA → 3kVA + (7kVA × 0.35) = 5.45kVA'
  },
  {
    loadType: 'Small Appliance Circuits',
    calculation: 'First 3kVA at 100%, remainder at 35%',
    necReference: '220.52',
    example: '4.5kVA → 3kVA + (1.5kVA × 0.35) = 3.525kVA'
  },
  {
    loadType: 'Electric Ranges (Residential)',
    calculation: 'Per NEC Table 220.55',
    necReference: '220.55',
    example: '12kW range → 8kW demand (Column C)'
  },
  {
    loadType: 'Clothes Dryers',
    calculation: '5kW or nameplate, whichever is larger',
    necReference: '220.54',
    example: '4.5kW dryer → 5kW demand'
  },
  {
    loadType: 'Water Heaters',
    calculation: '100% of nameplate rating',
    necReference: '220.51',
    example: '4.5kW water heater → 4.5kW demand'
  },
  {
    loadType: 'Air Conditioning',
    calculation: '100% of largest motor + 25% of others',
    necReference: '220.50',
    example: '5kW A/C + 1.5kW fans → 5kW + 0.375kW = 5.375kW'
  },
  {
    loadType: 'Electric Heat',
    calculation: '100% of connected load (omit if A/C larger)',
    necReference: '220.51',
    example: '15kW heat → 15kW (but omit if A/C > 15kW)'
  },
  {
    loadType: 'Motors (Commercial)',
    calculation: '125% of largest + 100% of others',
    necReference: '220.50',
    example: '10HP + 5HP + 3HP → 12.5HP + 8HP = 20.5HP equivalent'
  }
];

const SERVICE_SIZING_GUIDE = [
  {
    calculatedLoad: '0-10kW',
    recommendedService: '60A',
    panelSize: '100A',
    typicalApplication: 'Small apartments, older homes',
    notes: 'Minimum service, limited expansion capability'
  },
  {
    calculatedLoad: '10-15kW',
    recommendedService: '100A',
    panelSize: '125A',
    typicalApplication: 'Small homes, condos without electric heat',
    notes: 'Adequate for basic electrical needs'
  },
  {
    calculatedLoad: '15-25kW',
    recommendedService: '150A',
    panelSize: '200A',
    typicalApplication: 'Average homes, some electric appliances',
    notes: 'Most common residential service size'
  },
  {
    calculatedLoad: '25-35kW',
    recommendedService: '200A',
    panelSize: '200A',
    typicalApplication: 'Large homes, electric heat, central A/C',
    notes: 'Standard for modern electric homes'
  },
  {
    calculatedLoad: '35-50kW',
    recommendedService: '300A',
    panelSize: '400A',
    typicalApplication: 'Large homes with pools, workshops, EV charging',
    notes: 'High-end residential applications'
  },
  {
    calculatedLoad: '50kW+',
    recommendedService: '400A+',
    panelSize: '600A+',
    typicalApplication: 'Luxury homes, small commercial',
    notes: 'May require engineering review'
  }
];

const INSTALLATION_CONSIDERATIONS = [
  {
    factor: 'Future Expansion',
    description: 'Plan for 25% additional capacity',
    impact: 'Avoids costly service upgrades later',
    recommendation: 'Size panel 25% larger than calculated load',
    example: '150A calculated → 200A service recommended'
  },
  {
    factor: 'Load Diversity',
    description: 'Not all loads operate simultaneously',
    impact: 'Allows smaller service than connected load total',
    recommendation: 'Use proper demand factors per NEC',
    example: '50kW connected → 30kW demand with factors'
  },
  {
    factor: 'Voltage Selection',
    description: 'Higher voltage reduces current for same power',
    impact: 'Smaller wire and equipment for same load',
    recommendation: '240V for residential, 480V for large commercial',
    example: '100kW at 240V = 417A vs 480V = 120A'
  },
  {
    factor: 'Load Factor',
    description: 'Average load vs maximum load over time',
    impact: 'High load factor improves economics',
    recommendation: 'Consider time-of-use rates',
    example: 'Constant 80% load vs 100% peak for 2 hours'
  }
];

const COMMON_LOAD_MISTAKES = [
  {
    mistake: 'Adding All Connected Loads',
    description: 'Summing all nameplate ratings without demand factors',
    consequence: 'Oversized service, unnecessary cost',
    correction: 'Apply proper NEC demand factors',
    necReference: 'Article 220 Parts III & IV'
  },
  {
    mistake: 'Including Both Heating and Cooling',
    description: 'Adding both heat pump and electric heat to demand',
    consequence: 'Double-counting largest loads',
    correction: 'Use only the larger of heating or cooling',
    necReference: 'NEC 220.60'
  },
  {
    mistake: 'Ignoring Motor Starting Current',
    description: 'Using only running current for motor calculations',
    consequence: 'Undersized circuit protection',
    correction: 'Size conductors at 125% of motor FLA',
    necReference: 'NEC 430.22'
  },
  {
    mistake: 'Wrong Demand Factors',
    description: 'Using residential demand factors for commercial',
    consequence: 'Incorrect load calculations',
    correction: 'Apply appropriate demand factors for occupancy',
    necReference: 'NEC Tables 220.42-220.56'
  },
  {
    mistake: 'Forgetting Code Updates',
    description: 'Using outdated NEC demand factor tables',
    consequence: 'Code violations, failed inspections',
    correction: 'Always use current NEC edition',
    necReference: 'Current NEC Article 220'
  }
];

export default function ElectricalLoadCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['electrical-load-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-12 h-12" />
                <h1 className="text-4xl font-bold">Electrical Load Calculator</h1>
              </div>
              <p className="text-xl mb-8 text-purple-50">
                Calculate electrical load requirements for residential and commercial services per NEC Article 220 standards. 
                Professional load calculations for accurate service sizing and electrical system design.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-purple-500/20 rounded-lg p-4">
                  <Home className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-2">Residential Loads</h3>
                  <p className="text-sm text-purple-100">Single family, multi-family, and apartment calculations</p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-4">
                  <Building className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-2">Commercial Loads</h3>
                  <p className="text-sm text-purple-100">Office, retail, restaurant, and industrial calculations</p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-4">
                  <BookOpen className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-2">NEC Article 220</h3>
                  <p className="text-sm text-purple-100">Standard and optional calculation methods</p>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Warning */}
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-orange-900 mb-2">Professional Load Calculation Requirements</h2>
                <div className="text-orange-800 space-y-2 text-sm">
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-1">
                      <li>• Load calculations must comply with NEC Article 220</li>
                      <li>• Engineering review required for complex installations</li>
                      <li>• Local codes may have additional requirements</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• Permits required for new electrical services</li>
                      <li>• Professional calculations required for commercial work</li>
                      <li>• Utility coordination needed for large services</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Component */}
          <ClientElectricalLoadCalculator />

          {/* Load Calculation Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Professional Load Calculation Examples</h2>
            <div className="grid gap-8">
              {LOAD_CALCULATION_EXAMPLES.map((example, index) => (
                <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-600 mb-2">{example.title}</h3>
                      <p className="text-gray-700 mb-4">{example.scenario}</p>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Result:</span> {example.result}</div>
                        <div><span className="font-medium">Service Size:</span> {example.serviceSize}</div>
                        <div><span className="font-medium">Cost:</span> {example.cost}</div>
                        <div><span className="font-medium">Application:</span> {example.application}</div>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <h4 className="font-medium text-gray-900 mb-2">Load Calculations (NEC Article 220):</h4>
                      <pre className="bg-gray-50 p-4 rounded text-sm font-mono whitespace-pre-wrap overflow-x-auto">
{example.calculation}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEC Calculation Methods */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">NEC Article 220 Calculation Methods</h2>
            <div className="grid gap-8">
              {NEC_LOAD_CALCULATION_METHODS.map((method, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-600 mb-2">{method.method}</h3>
                      <div className="space-y-3 text-sm">
                        <div><span className="font-medium">NEC Section:</span> {method.necSection}</div>
                        <div><span className="font-medium">Description:</span> {method.description}</div>
                        <div><span className="font-medium">Applicable To:</span> {method.applicableTo}</div>
                        <div><span className="font-medium">Complexity:</span> {method.complexity}</div>
                        <div><span className="font-medium">Accuracy:</span> {method.accuracy}</div>
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <div><span className="font-medium text-green-600">Pros:</span> {method.pros}</div>
                        <div><span className="font-medium text-red-600">Cons:</span> {method.cons}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Calculation Steps:</h4>
                      <ol className="space-y-2 text-sm">
                        {method.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {stepIndex + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demand Factors Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">NEC Demand Factors Reference Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="border p-3 text-left font-semibold">Load Type</th>
                    <th className="border p-3 text-left font-semibold">Demand Factor Calculation</th>
                    <th className="border p-3 text-left font-semibold">NEC Reference</th>
                    <th className="border p-3 text-left font-semibold">Example Calculation</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMAND_FACTORS_TABLE.map((factor, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-3 font-medium text-purple-600">{factor.loadType}</td>
                      <td className="border p-3 text-sm">{factor.calculation}</td>
                      <td className="border p-3 text-sm font-medium">{factor.necReference}</td>
                      <td className="border p-3 text-sm font-mono bg-gray-50">{factor.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-sm text-gray-600 text-center">
              <p>Always verify demand factors with current NEC edition. Local codes may impose additional requirements.</p>
            </div>
          </div>

          {/* Service Sizing Guide */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Electrical Service Sizing Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border p-3 text-left font-semibold">Calculated Load</th>
                    <th className="border p-3 text-left font-semibold">Minimum Service</th>
                    <th className="border p-3 text-left font-semibold">Recommended Panel</th>
                    <th className="border p-3 text-left font-semibold">Typical Application</th>
                    <th className="border p-3 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {SERVICE_SIZING_GUIDE.map((guide, index) => (
                    <tr key={index} className="hover:bg-blue-50">
                      <td className="border p-3 font-medium">{guide.calculatedLoad}</td>
                      <td className="border p-3 font-semibold text-blue-600">{guide.recommendedService}</td>
                      <td className="border p-3">{guide.panelSize}</td>
                      <td className="border p-3 text-sm">{guide.typicalApplication}</td>
                      <td className="border p-3 text-sm text-gray-600">{guide.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 bg-blue-100 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Service Sizing Best Practices:</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Always size service at least 25% above calculated load for future expansion</li>
                <li>• Panel capacity should exceed service size to allow for additional circuits</li>
                <li>• Commercial installations often require engineering review above 400A</li>
                <li>• Utility coordination required for services above 400A in most areas</li>
              </ul>
            </div>
          </div>

          {/* Installation Considerations */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Load Calculation Considerations</h2>
            <div className="grid gap-6">
              {INSTALLATION_CONSIDERATIONS.map((consideration, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{consideration.factor}</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-700 mb-2"><span className="font-medium">Description:</span> {consideration.description}</p>
                      <p className="text-gray-700"><span className="font-medium">Impact:</span> {consideration.impact}</p>
                    </div>
                    <div>
                      <p className="text-green-700 mb-2"><span className="font-medium">Recommendation:</span> {consideration.recommendation}</p>
                      <p className="text-blue-600"><span className="font-medium">Example:</span> {consideration.example}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="bg-red-50 rounded-xl border border-red-200 p-8">
            <h2 className="text-3xl font-bold text-red-900 mb-8 text-center">Common Load Calculation Mistakes</h2>
            <div className="grid gap-6">
              {COMMON_LOAD_MISTAKES.map((mistake, index) => (
                <div key={index} className="bg-white rounded-lg border-l-4 border-red-500 p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">{mistake.mistake}</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-700 mb-2"><span className="font-medium">Description:</span> {mistake.description}</p>
                      <p className="text-red-600"><span className="font-medium">Consequence:</span> {mistake.consequence}</p>
                    </div>
                    <div>
                      <p className="text-green-700 mb-2"><span className="font-medium">Correction:</span> {mistake.correction}</p>
                      <p className="text-blue-600"><span className="font-medium">NEC Reference:</span> {mistake.necReference}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What's the difference between connected load and demand load?</h3>
                <p className="text-gray-700">Connected load is the sum of all electrical equipment nameplate ratings. Demand load applies NEC demand factors recognizing that not all equipment operates simultaneously at full capacity. Demand load is always smaller and used for service sizing.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">When should I use the Standard vs Optional calculation method?</h3>
                <p className="text-gray-700">Use the Standard Method (NEC Part III) for all installations. The Optional Method (Part IV) can only be used for single-family dwellings and often results in smaller calculated loads. Both are acceptable, but Standard Method is more universally applicable.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I handle both electric heat and air conditioning?</h3>
                <p className="text-gray-700">Per NEC 220.60, include only the larger of the two loads in your demand calculation. Don't add them together since they don't operate simultaneously. This prevents oversizing the electrical service.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What size service do I need for a typical 2000 sq ft home?</h3>
                <p className="text-gray-700">A typical 2000 sq ft home with standard electric appliances usually calculates to 25-30kW demand load, requiring a minimum 150A service. Most professionals recommend a 200A service for future expansion and convenience.</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do I need an engineer for load calculations?</h3>
                <p className="text-gray-700">Engineering calculations are typically required for commercial buildings, multi-family dwellings above certain sizes, and complex industrial installations. Simple residential calculations can be performed by qualified electricians using NEC methods.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How often do NEC demand factors change?</h3>
                <p className="text-gray-700">The NEC is updated every three years, but demand factors in Article 220 remain relatively stable. However, always use the current adopted NEC edition in your jurisdiction, as local amendments may apply additional requirements.</p>
              </div>
            </div>
          </div>

          {/* Professional Note */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-purple-900 mb-2">Professional Engineering Review</h2>
                <p className="text-purple-800 text-sm mb-3">
                  Complex electrical load calculations may require professional engineering review and stamped calculations. This calculator provides guidance for educational purposes but does not replace professional electrical design services.
                </p>
                <ul className="text-purple-800 space-y-1 text-sm">
                  <li>• Commercial buildings typically require professional calculations</li>
                  <li>• Local building departments may require stamped calculations</li>
                  <li>• Utility companies may require detailed load studies for large services</li>
                  <li>• Consider professional consultation for complex installations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related Calculators */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Electrical Calculators</h2>
              <p className="text-gray-600">Complete your electrical system design with these professional tools</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Size Calculator</h3>
                <p className="text-xs text-gray-600">Service wire sizing</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Target className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Service entrance</p>
              </Link>
              
              <Link href="/calculators/conduit-fill-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Settings className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Conduit Fill</h3>
                <p className="text-xs text-gray-600">Service conduits</p>
              </Link>
              
              <Link href="/calculators/three-phase-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Three Phase</h3>
                <p className="text-xs text-gray-600">Commercial loads</p>
              </Link>
              
              <Link href="/calculators/garage-subpanel-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Subpanel</h3>
                <p className="text-xs text-gray-600">Distribution panels</p>
              </Link>
              
              <Link href="/calculators/ampacity-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <TrendingUp className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Ampacity Calculator</h3>
                <p className="text-xs text-gray-600">Wire capacity</p>
              </Link>
            </div>
          </div>

          {/* External Resources */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Professional Resources & References</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-purple-600 mb-4">Code & Standards Organizations</h3>
                <div className="space-y-3 text-sm">
                  <a href="https://www.nfpa.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    National Fire Protection Association - NEC Publisher
                  </a>
                  <a href="https://www.ieee.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    Institute of Electrical and Electronics Engineers
                  </a>
                  <a href="https://www.ul.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    Underwriters Laboratories - Safety Standards
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-600 mb-4">Professional Organizations</h3>
                <div className="space-y-3 text-sm">
                  <a href="https://www.neca.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    National Electrical Contractors Association
                  </a>
                  <a href="https://www.ibew.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    International Brotherhood of Electrical Workers
                  </a>
                  <a href="https://www.iaei.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <MapPin className="w-4 h-4" />
                    International Association of Electrical Inspectors
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
