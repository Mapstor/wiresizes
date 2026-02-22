import { Metadata } from 'next';
import ResidentialLoadCalculator from '@/components/calculators/ResidentialLoadCalculator';
import { Home, Calculator, FileText, Shield, AlertTriangle, CheckCircle, Users, Building, Zap, TrendingUp, Target } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Residential Load Calculator | NEC 220 Service Size Calculator & Panel Upgrade',
  description: 'Calculate residential electrical service size per NEC Article 220. Determine if 100A, 200A, or 400A service needed. Professional load calculations for permits, inspections, and panel upgrades.',
  keywords: 'residential load calculator, NEC 220, electrical service size, panel upgrade calculator, 200 amp service calculator, electrical load calculation, service entrance calculator, electrical permit calculator, home electrical capacity, electrical panel sizing',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Residential Load Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Calculate residential electrical service size per NEC Article 220 requirements.",
  "keywords": "residential load, home electrical, service sizing",
  "url": `https://wiresizes.com/calculators/residential-load-calculator`,
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
    question: 'How do I calculate electrical service size for my home?',
    answer: 'Use NEC Article 220.82 Optional Method: Start with 3 VA per square foot for general lighting, add 3,000 VA for small appliance circuits, 1,500 VA for laundry, then add all major appliances at nameplate ratings. Apply demand factors: first 10kVA at 100%, remainder at 40%. Add 25% of largest motor load. Divide by 240V to get service amperage needed.'
  },
  {
    question: 'What\'s the difference between 100A and 200A electrical service?',
    answer: '100A service provides ~20kW capacity, suitable for smaller homes with gas appliances and no central AC. 200A service provides ~40kW capacity, required for modern homes with electric appliances, central AC, and future needs like EV charging. Most new construction uses 200A service as standard.'
  },
  {
    question: 'When do I need to upgrade my electrical panel?',
    answer: 'Upgrade when: calculated load exceeds 80% of panel capacity, adding major appliances like AC/EV charger, frequent breaker trips, using extension cords regularly, or home inspection reveals outdated panel. Signs include burning smells, warm panels, flickering lights, or insurance requirements.'
  },
  {
    question: 'How much does electrical service upgrade cost?',
    answer: 'Service upgrades typically cost: 100A to 200A: $3,000-5,000, 200A to 400A: $5,000-8,000. Costs include: new meter base, service entrance conductors, main panel, permits ($200-500), labor (6-12 hours), utility connection fees. Complex installations or trenching add $1,000-3,000.'
  },
  {
    question: 'What appliances require the most electrical capacity?',
    answer: 'High-demand appliances: Electric furnace (15-25kW), EV charger Level 2 (7-19kW), Electric range (8-12kW), Central AC (4-8kW), Electric dryer (5kW), Hot tub (8-15kW), Heat pump water heater (4.5kW). Plan service size around simultaneous operation of multiple high-demand loads.'
  },
  {
    question: 'Do I need a permit for electrical service upgrade?',
    answer: 'Yes, electrical permits required for service upgrades in all jurisdictions. Process: apply with load calculations, pay fees ($150-500), schedule inspections (rough-in and final), coordinate utility disconnect/reconnect. Permits ensure code compliance and may be required for insurance/resale.'
  },
  {
    question: 'Can I add an EV charger to my existing 200A service?',
    answer: 'Usually yes if you have available capacity. Level 2 EV charger (40-80A) needs 40-60A of spare capacity. Calculate: 200A total - current loads = available capacity. If insufficient, consider: load management systems, time-of-use charging, or service upgrade. Smart panels can optimize EV charging timing.'
  },
  {
    question: 'What\'s NEC demand factor and why does it matter?',
    answer: 'Demand factors recognize that not all electrical loads operate simultaneously. NEC 220.82 allows: first 10kVA at 100% demand, remainder at 40%. This reduces calculated service size vs. adding all nameplate ratings. Example: 50kVA connected load becomes 26kVA demand load, requiring 125A vs 208A service.'
  },
  {
    question: 'How do I prepare for electrical inspection?',
    answer: 'Inspection preparation: provide load calculations, verify permit posted, ensure work accessibility, have code books available, confirm AFCI/GFCI compliance, test all circuits, verify proper grounding/bonding. Common failures: missing permits, incorrect calculations, code violations, poor workmanship.'
  },
  {
    question: 'What\'s the difference between connected load and demand load?',
    answer: 'Connected load is sum of all appliance nameplate ratings if operated simultaneously. Demand load applies NEC factors recognizing realistic usage patterns. Example: home with 45kVA connected load may have only 25kVA demand load after factors, requiring 125A vs 188A service - significant cost difference.'
  }
];

const PERMIT_REQUIREMENTS_BY_STATE = [
  { state: 'California', permitCost: '$300-600', inspectionRequired: 'Yes', licensedElectricianRequired: 'Yes', specialRequirements: 'Title 24 energy compliance, Arc-fault protection' },
  { state: 'Texas', permitCost: '$150-400', inspectionRequired: 'Yes', licensedElectricianRequired: 'Varies by city', specialRequirements: 'Local amendments, hurricane-rated equipment in coastal areas' },
  { state: 'Florida', permitCost: '$200-500', inspectionRequired: 'Yes', licensedElectricianRequired: 'Yes', specialRequirements: 'Hurricane/wind load ratings, surge protection required' },
  { state: 'New York', permitCost: '$250-500', inspectionRequired: 'Yes', licensedElectricianRequired: 'Yes', specialRequirements: 'NYC has stricter requirements than state code' },
  { state: 'Pennsylvania', permitCost: '$100-300', inspectionRequired: 'Yes', licensedElectricianRequired: 'Yes', specialRequirements: 'Uniform Construction Code (UCC) compliance' },
  { state: 'Illinois', permitCost: '$150-350', inspectionRequired: 'Yes', licensedElectricianRequired: 'Yes', specialRequirements: 'Chicago has separate electrical code' },
  { state: 'Ohio', permitCost: '$100-250', inspectionRequired: 'Yes', licensedElectricianRequired: 'Yes', specialRequirements: 'State follows NEC with minor amendments' },
  { state: 'Georgia', permitCost: '$125-300', inspectionRequired: 'Yes', licensedElectricianRequired: 'Yes', specialRequirements: 'International Residential Code adoption' },
  { state: 'North Carolina', permitCost: '$100-275', inspectionRequired: 'Yes', licensedElectricianRequired: 'Yes', specialRequirements: 'Coastal areas require additional wind/water protection' },
  { state: 'Michigan', permitCost: '$125-325', inspectionRequired: 'Yes', licensedElectricianRequired: 'Yes', specialRequirements: 'Residential Code based on IRC/NEC' }
];

const ELECTRICAL_SAFETY_CHECKLIST = [
  {
    category: 'Panel Safety',
    items: [
      'Panel labeled clearly with circuit descriptions',
      'No double-tap breakers (unless rated for it)',
      'Proper working clearances (3ft x 30" x 6.5ft)',
      'Panel cover secured and in good condition',
      'No corrosion or burnt connections visible',
      'Main breaker operates smoothly'
    ]
  },
  {
    category: 'Circuit Protection',
    items: [
      'AFCI protection on bedroom circuits (NEC 210.12)',
      'GFCI protection in bathrooms, kitchens, outdoors',
      'Proper breaker sizing for wire gauge',
      'No overfusing (breaker too large for wire)',
      'Surge protection at service entrance',
      'Emergency disconnect clearly marked'
    ]
  },
  {
    category: 'Grounding System',
    items: [
      'Grounding electrode conductor properly sized',
      'Water pipe bonding jumper installed',
      'Gas pipe bonding if metallic system present',
      'Equipment grounding in all circuits',
      'Neutral and ground separated in sub-panels',
      'Ground rods installed per code (8ft minimum)'
    ]
  },
  {
    category: 'Code Compliance',
    items: [
      'Dedicated circuits for major appliances',
      'Kitchen requires 2+ small appliance circuits',
      'Bathroom requires dedicated circuit',
      'Smoke detector circuits interconnected',
      'Outlet spacing per NEC (12ft maximum)',
      'Switch-controlled lighting in all habitable rooms'
    ]
  }
];

const APPLIANCE_LOAD_COMPARISON = [
  { appliance: 'LED Lighting (whole house)', watts: '800-1,500', amps_120v: '7-13', amps_240v: '3-6', notes: 'Very efficient, long-lasting' },
  { appliance: 'Refrigerator (modern)', watts: '400-800', amps_120v: '3-7', amps_240v: '2-3', notes: 'Energy Star rated use less' },
  { appliance: 'Microwave (countertop)', watts: '700-1,200', amps_120v: '6-10', amps_240v: '3-5', notes: 'Higher wattage = faster cooking' },
  { appliance: 'Dishwasher (built-in)', watts: '1,400-1,800', amps_120v: '12-15', amps_240v: '6-8', notes: 'Heating element uses most power' },
  { appliance: 'Garbage Disposal (1/2 HP)', watts: '400-600', amps_120v: '3-5', amps_240v: '2-3', notes: 'Motor starting current higher' },
  { appliance: 'Washing Machine', watts: '500-1,200', amps_120v: '4-10', amps_240v: '2-5', notes: 'Front-load more efficient' },
  { appliance: 'Electric Dryer', watts: '3,000-5,000', amps_120v: 'N/A', amps_240v: '13-21', notes: '240V required, 30A circuit typical' },
  { appliance: 'Electric Range/Cooktop', watts: '6,000-12,000', amps_120v: 'N/A', amps_240v: '25-50', notes: 'Induction most efficient' },
  { appliance: 'Electric Oven (built-in)', watts: '2,500-4,000', amps_120v: 'N/A', amps_240v: '10-17', notes: 'Convection uses less energy' },
  { appliance: 'Water Heater (electric)', watts: '3,000-5,500', amps_120v: 'N/A', amps_240v: '13-23', notes: 'Heat pump type most efficient' },
  { appliance: 'Central Air Conditioning (3 ton)', watts: '3,000-5,000', amps_120v: 'N/A', amps_240v: '13-21', notes: 'SEER rating affects efficiency' },
  { appliance: 'Heat Pump (3 ton)', watts: '2,500-4,000', amps_120v: 'N/A', amps_240v: '10-17', notes: 'More efficient than resistance heat' },
  { appliance: 'Electric Furnace (15kW)', watts: '15,000', amps_120v: 'N/A', amps_240v: '63', notes: 'Least efficient heating method' },
  { appliance: 'Pool Pump (1.5 HP)', watts: '1,200-1,800', amps_120v: '10-15', amps_240v: '5-8', notes: 'Variable speed most efficient' },
  { appliance: 'Hot Tub/Spa (6-person)', watts: '6,000-8,000', amps_120v: 'N/A', amps_240v: '25-33', notes: 'Insulation affects operating cost' },
  { appliance: 'EV Charger Level 2 (40A)', watts: '7,700-9,600', amps_120v: 'N/A', amps_240v: '32-40', notes: 'Smart charging reduces peak demand' }
];

const ENERGY_EFFICIENCY_UPGRADES = [
  {
    upgrade: 'LED Lighting Conversion',
    energySavings: '75-80%',
    cost: '$200-800',
    payback: '1-3 years',
    description: 'Replace all incandescent and CFL bulbs with LED equivalents. Reduces lighting load by 75% while improving light quality.',
    electricalImpact: 'Reduces general lighting load, may allow smaller service size'
  },
  {
    upgrade: 'ENERGY STAR Appliances',
    energySavings: '10-30%',
    cost: '$500-5,000',
    payback: '3-7 years',
    description: 'Upgrade to ENERGY STAR certified refrigerators, washers, dryers, and dishwashers for maximum efficiency.',
    electricalImpact: 'Lower operating loads, but nameplate ratings may be similar for load calculations'
  },
  {
    upgrade: 'Heat Pump Water Heater',
    energySavings: '60-70%',
    cost: '$1,500-3,500',
    payback: '4-8 years',
    description: 'Replace electric resistance water heater with heat pump model. Uses ambient air heat for efficiency.',
    electricalImpact: 'Same circuit requirements but much lower operating energy'
  },
  {
    upgrade: 'Smart Electrical Panel',
    energySavings: '10-20%',
    cost: '$2,500-5,000',
    payback: '5-10 years',
    description: 'Install smart panel with load monitoring, circuit control, and demand management features.',
    electricalImpact: 'Enables load shedding, may prevent need for service upgrade'
  },
  {
    upgrade: 'Induction Cooking',
    energySavings: '20-30%',
    cost: '$800-3,000',
    payback: '8-15 years',
    description: 'Replace electric coil or gas range with induction cooktop. Most efficient electric cooking method.',
    electricalImpact: 'Similar electrical requirements but faster heating, shorter operating times'
  },
  {
    upgrade: 'Variable Speed Pool Pump',
    energySavings: '50-70%',
    cost: '$800-1,500',
    payback: '2-4 years',
    description: 'Replace single-speed pool pump with variable speed model. Dramatically reduces pool equipment energy use.',
    electricalImpact: 'Lower average operating load, may qualify for utility rebates'
  }
];

const LOAD_MANAGEMENT_STRATEGIES = [
  {
    strategy: 'Time-of-Use Scheduling',
    description: 'Operate high-demand appliances during off-peak utility hours when rates are lower',
    savings: '20-40% on electric bill',
    implementation: 'Smart thermostats, EV charging timers, water heater controls',
    cost: '$200-800'
  },
  {
    strategy: 'Load Shedding Systems',
    description: 'Automatically turn off non-essential loads during peak demand to prevent service overload',
    savings: 'Prevents service upgrade costs',
    implementation: 'Smart panels, load shed relays, priority control systems',
    cost: '$1,000-3,000'
  },
  {
    strategy: 'Demand Response Participation',
    description: 'Allow utility to control certain loads during peak demand events for bill credits',
    savings: '$100-500/year credits',
    implementation: 'Smart thermostats, water heater controls, EV charging management',
    cost: 'Often free through utility programs'
  },
  {
    strategy: 'Energy Storage Integration',
    description: 'Use battery storage to reduce peak demand and provide backup power',
    savings: 'Peak shaving, backup power value',
    implementation: 'Tesla Powerwall, Enphase, LG Chem battery systems',
    cost: '$10,000-20,000'
  },
  {
    strategy: 'Smart Circuit Management',
    description: 'Individual circuit monitoring and control for optimized energy usage',
    savings: '5-15% through awareness and automation',
    implementation: 'Smart breakers, circuit-level monitors, automated controls',
    cost: '$500-2,000'
  }
];

export default function ResidentialLoadCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['residential-load-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Home className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Residential Load Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-indigo-50">
                Professional electrical service sizing per NEC Article 220. Calculate if your panel can handle new loads, 
                determine service upgrade requirements, and prepare accurate load calculations for permits and inspections.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-indigo-100">NEC Compliant</div>
                  <div className="font-semibold">Article 220.82</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-indigo-100">Professional Grade</div>
                  <div className="font-semibold">Permit Ready</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-indigo-100">Service Sizing</div>
                  <div className="font-semibold">100A-400A</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-indigo-100">Cost Analysis</div>
                  <div className="font-semibold">Upgrade Estimates</div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Compliance Notice */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-yellow-900 mb-2">Professional Load Calculations Required</h2>
                <ul className="text-yellow-800 space-y-1 text-sm">
                  <li>• Electrical permits require professional load calculations per local jurisdiction</li>
                  <li>• This calculator provides estimates - consult licensed electrician for official calculations</li>
                  <li>• Local codes may require larger service sizes than NEC minimum</li>
                  <li>• Service upgrades require utility coordination and professional installation</li>
                  <li>• Some jurisdictions require Professional Engineer (PE) approval for large services</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <ResidentialLoadCalculator />

          {/* Appliance Load Comparison Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Complete Appliance Load Reference</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Typical electrical loads for common household appliances. Use for accurate load calculations and circuit planning.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-yellow-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Appliance</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Power (Watts)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">120V Amps</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">240V Amps</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {APPLIANCE_LOAD_COMPARISON.map((appliance, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{appliance.appliance}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-yellow-600">
                        {appliance.watts}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{appliance.amps_120v}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{appliance.amps_240v}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{appliance.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Permit Requirements by State */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Electrical Permit Requirements by State</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Permit costs, inspection requirements, and special considerations for residential electrical work across major states.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">State</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Permit Cost</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Inspection Required</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Licensed Electrician</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Special Requirements</th>
                  </tr>
                </thead>
                <tbody>
                  {PERMIT_REQUIREMENTS_BY_STATE.map((state, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{state.state}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-blue-600">
                        {state.permitCost}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          state.inspectionRequired === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {state.inspectionRequired}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          state.licensedElectricianRequired === 'Yes' ? 'bg-green-100 text-green-700' : 
                          state.licensedElectricianRequired === 'Varies by city' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {state.licensedElectricianRequired}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{state.specialRequirements}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">General Permit Process:</h3>
              <ol className="text-blue-800 text-sm space-y-1">
                <li>1. Submit application with load calculations and electrical plans</li>
                <li>2. Pay permit fees and schedule inspections</li>
                <li>3. Rough-in inspection before covering wiring</li>
                <li>4. Final inspection after installation complete</li>
                <li>5. Utility service connection after approval</li>
              </ol>
            </div>
          </div>

          {/* Energy Efficiency Upgrades */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Energy Efficiency Upgrades</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Smart upgrades that reduce electrical demand while improving efficiency and comfort. May prevent need for service upgrade.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {ENERGY_EFFICIENCY_UPGRADES.map((upgrade, idx) => (
                <div key={idx} className="border rounded-lg p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{upgrade.upgrade}</h3>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium">
                      Save {upgrade.energySavings}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{upgrade.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Cost:</span>
                      <div className="font-medium text-gray-900">{upgrade.cost}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Payback:</span>
                      <div className="font-medium text-green-600">{upgrade.payback}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Savings:</span>
                      <div className="font-medium text-blue-600">{upgrade.energySavings}</div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded p-3">
                    <h4 className="text-xs font-medium text-purple-800 mb-1">Electrical Impact:</h4>
                    <p className="text-xs text-purple-700">{upgrade.electricalImpact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Load Management Strategies */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Smart Load Management Strategies</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Advanced strategies to optimize electrical usage, reduce peak demand, and potentially avoid service upgrades.
            </p>
            
            <div className="space-y-6">
              {LOAD_MANAGEMENT_STRATEGIES.map((strategy, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 bg-purple-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{strategy.strategy}</h3>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm font-medium">
                      {strategy.cost}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{strategy.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded p-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">Savings Potential</h4>
                      <p className="text-sm text-green-600 font-medium">{strategy.savings}</p>
                    </div>
                    
                    <div className="bg-white rounded p-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">Implementation</h4>
                      <p className="text-sm text-gray-600">{strategy.implementation}</p>
                    </div>
                    
                    <div className="bg-white rounded p-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">Investment Level</h4>
                      <p className="text-sm text-blue-600 font-medium">{strategy.cost}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Electrical Safety Checklist */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Residential Electrical Safety Checklist</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Essential safety items to verify during service upgrades and electrical inspections. Ensure code compliance and family safety.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {ELECTRICAL_SAFETY_CHECKLIST.map((category, idx) => (
                <div key={idx} className="border rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">{category.category}</h3>
                  <div className="space-y-2">
                    {category.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">⚠ When to Call an Electrician Immediately:</h3>
              <ul className="text-red-800 text-sm space-y-1">
                <li>• Burning smell from electrical panel or outlets</li>
                <li>• Frequent breaker trips or blown fuses</li>
                <li>• Warm or hot electrical panels, outlets, or switches</li>
                <li>• Flickering lights when appliances start</li>
                <li>• Electrical shocks from appliances or switches</li>
                <li>• Scorch marks around outlets or electrical equipment</li>
              </ul>
            </div>
          </div>

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

          {/* Professional Services Notice */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 border border-yellow-200">
            <div className="flex items-start gap-4">
              <Building className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">When to Hire Professional Electrical Engineer</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Engineering Required For:</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Services over 400A capacity
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Commercial or multi-family buildings
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Complex load calculations with multiple buildings
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Special occupancies (healthcare, schools, etc.)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Utility company requirements
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Professional Benefits:</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        Stamped calculations for permit approval
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        Liability protection and insurance coverage
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        Optimized system design for efficiency
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        Code compliance expertise
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        Future expansion planning
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Electrical Calculators</h2>
              <p className="text-gray-600">Complete your electrical planning with these professional tools</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Wire Size</h3>
                <p className="text-sm text-gray-600">Calculate wire gauge</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Voltage Drop</h3>
                <p className="text-sm text-gray-600">Check voltage loss</p>
              </Link>
              
              <Link href="/calculators/circuit-breaker-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Circuit Breaker</h3>
                <p className="text-sm text-gray-600">Size protection</p>
              </Link>
              
              <Link href="/calculators/ev-charger-wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Building className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900">EV Charger</h3>
                <p className="text-sm text-gray-600">EV charging wire</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}