import { Metadata } from 'next';
import { GarageSubpanelCalculator } from '@/components/calculators';
import { Home, Calculator, AlertTriangle, Settings, Target, BookOpen, Users, Shield, Zap, Wrench, Car, MapPin, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Garage Subpanel Calculator | Detached Garage Feeder Calculator | NEC 225 Compliance',
  description: 'Calculate feeder wire size for garage subpanels and detached garage electrical service. NEC 225 compliant calculations for detached buildings with comprehensive code requirements.',
  keywords: 'garage subpanel calculator, detached garage feeder, garage electrical service, subpanel wire size, NEC 225, detached building electrical, garage feeder calculator, outbuilding electrical',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Garage Subpanel Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Complete garage subpanel sizing including feeders, grounding, and disconnect.",
  "keywords": "garage electrical, subpanel feeder, outbuilding power",
  "url": `https://wiresizes.com/calculators/garage-subpanel-calculator`,
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

const GARAGE_EXAMPLES = [
  {
    title: 'Standard 2-Car Detached Garage',
    scenario: '100A subpanel, 75ft run, mixed loads',
    loads: 'Lighting: 20A, Outlets: 40A, Garage Door: 15A, Welder: 50A',
    calculation: 'Total Connected Load: 125A\nDemand Calculation: 125A × 0.8 = 100A\nFeeder Size: 100A minimum\nVoltage Drop Check: 100A × 75ft × 2.6Ω/1000ft ÷ 240V = 8.1% (too high)\nUpsize to 2 AWG: 100A × 75ft × 1.6Ω/1000ft ÷ 240V = 5.0%\nGrounding: 6 AWG equipment ground required',
    result: '100A feeder, 2 AWG wire',
    grounding: '6 AWG equipment ground',
    cost: '$1,850 materials + trenching',
    compliance: 'NEC 225.39, 225.30'
  },
  {
    title: 'Workshop with Heavy Equipment',
    scenario: '200A subpanel, 100ft underground run',
    loads: 'Table Saw: 30A, Dust Collector: 20A, Compressor: 40A, Welder: 60A, General: 50A',
    calculation: 'Total Load: 200A nameplate\nDemand Factor (industrial): 200A × 1.0 = 200A\nFeeder: 200A service\nUnderground Run: USE-2 or RHW-2 required\nWire Size: 3/0 AWG copper (200A rating)\nVoltage Drop: 200A × 100ft × 1.0Ω/1000ft ÷ 240V = 8.3%\nUpsize: 250 kcmil → 6.7% drop\nGrounding: 4 AWG equipment ground',
    result: '200A feeder, 250 kcmil wire',
    grounding: '4 AWG equipment ground',
    cost: '$3,200 + underground installation',
    compliance: 'NEC 225.39, 310.15(B)(7)'
  },
  {
    title: 'Basic Garage with EV Charging',
    scenario: '60A subpanel, EV charger + basic loads',
    loads: 'EV Charger: 40A, Lighting: 15A, Outlets: 20A',
    calculation: 'EV Charger: 40A continuous load\nBasic Loads: 35A @ 75% demand = 26A\nTotal Demand: 40A + 26A = 66A\nFeeder Size: 70A → use 80A standard\nWire Size: 4 AWG copper (85A capacity)\nGrounding: 8 AWG equipment ground\nVoltage Drop: Acceptable for typical runs',
    result: '80A feeder, 4 AWG wire',
    grounding: '8 AWG equipment ground',
    cost: '$950 + EV outlet installation',
    compliance: 'NEC 625, 225.39'
  },
  {
    title: 'Detached Shop - 3-Phase Service',
    scenario: '100A 3-phase, metal fabrication shop',
    loads: 'Welder: 75A, Mill: 40A, Lathe: 30A, General: 55A',
    calculation: '3-Phase Load Analysis:\nTotal Load: 200A per phase\nDemand Factor: 200A × 0.85 = 170A\nBalanced Load: 170A per phase\nFeeder: 175A → 200A service\nWire: 3/0 AWG per phase + neutral\nGrounding: 4 AWG equipment ground\nService Disconnect: 200A 3-pole',
    result: '200A 3-phase, 3/0 AWG',
    grounding: '4 AWG equipment ground',
    cost: '$4,500 + transformer costs',
    compliance: 'NEC 225.30, 430 motors'
  },
  {
    title: 'RV Garage with Multiple Services',
    scenario: 'Large garage, RV hookup + workshop',
    loads: 'RV Service: 50A, Shop: 100A, Compressor: 30A, Welder: 60A',
    calculation: 'Multiple Services Analysis:\nRV Service: 50A dedicated (NEC 551)\nShop Loads: 190A connected\nShop Demand: 190A × 0.8 = 152A\nMain Feeder: 200A to handle both\nSeparate RV disconnect required\nFeeder Wire: 3/0 AWG copper\nMultiple disconnect rule: 6 max per NEC 225.33',
    result: '200A main + 50A RV',
    grounding: '4 AWG + 8 AWG for RV',
    cost: '$3,800 + RV pedestal',
    compliance: 'NEC 225.33, 551.77'
  },
  {
    title: 'Barn/Agricultural Building',
    scenario: 'Livestock facility, 150A service',
    loads: 'Ventilation: 60A, Lighting: 30A, Outlets: 40A, Water: 20A',
    calculation: 'Agricultural Load Calculation:\nTotal Connected: 150A\nDemand Factor (ag loads): varies by type\nContinuous Loads: Ventilation 60A × 1.25 = 75A\nOther loads: 90A × 0.8 = 72A\nTotal Demand: 75A + 72A = 147A → 150A\nFeeder: 1/0 AWG copper\nSpecial: GFCI for wet locations\nGrounding: Enhanced for livestock',
    result: '150A feeder, 1/0 AWG',
    grounding: '6 AWG + supplemental',
    cost: '$2,800 + agricultural requirements',
    compliance: 'NEC 547 agricultural'
  }
];

const NEC_225_REQUIREMENTS = [
  {
    requirement: 'Feeder Disconnect',
    section: '225.31',
    rule: 'Disconnect required at building',
    details: 'Must disconnect all ungrounded conductors, rated for feeder load, lockable',
    importance: 'Critical Safety'
  },
  {
    requirement: 'Service Entrance',
    section: '225.32',
    rule: 'Location of disconnect',
    details: 'Outside building or inside nearest point of entrance, readily accessible',
    importance: 'Code Compliance'
  },
  {
    requirement: 'Maximum Disconnects',
    section: '225.33',
    rule: '6 disconnect rule',
    details: 'Maximum 6 disconnects per building, each clearly marked',
    importance: 'Safety & Code'
  },
  {
    requirement: 'Grouping of Disconnects',
    section: '225.34',
    rule: 'Grouped together',
    details: 'All disconnects must be grouped, exception for large buildings',
    importance: 'Emergency Access'
  },
  {
    requirement: 'Grounding Requirements',
    section: '225.30',
    rule: 'Equipment grounding',
    details: 'Equipment grounding conductor required with feeder, sized per Table 250.122',
    importance: 'Electrical Safety'
  },
  {
    requirement: 'Overhead Clearances',
    section: '225.18',
    rule: 'Minimum clearances',
    details: '10ft min over driveways, 12ft over residential, 18ft over public areas',
    importance: 'Physical Safety'
  },
  {
    requirement: 'Underground Installation',
    section: '225.27',
    rule: 'Underground feeders',
    details: '24" burial depth, conduit required in most cases, warning tape recommended',
    importance: 'Installation Standard'
  },
  {
    requirement: 'Feeder Sizing',
    section: '225.39',
    rule: 'Minimum size',
    details: 'Sized for calculated load, 60A minimum for dwellings over 80A main service',
    importance: 'Load Capacity'
  }
];

const FEEDER_SIZING_CHART = [
  { service: '60A', wire: '6 AWG Cu / 4 AWG Al', ground: '10 AWG', conduit: '1.25"', application: 'Small garage, basic loads' },
  { service: '100A', wire: '3 AWG Cu / 1 AWG Al', ground: '8 AWG', conduit: '1.5"', application: 'Standard garage, moderate loads' },
  { service: '125A', wire: '1 AWG Cu / 2/0 AWG Al', ground: '8 AWG', conduit: '2"', application: 'Large garage with EV charging' },
  { service: '150A', wire: '1/0 AWG Cu / 3/0 AWG Al', ground: '6 AWG', conduit: '2"', application: 'Workshop with heavy equipment' },
  { service: '200A', wire: '3/0 AWG Cu / 250 kcmil Al', ground: '6 AWG', conduit: '2.5"', application: 'Professional shop, welding' }
];

const INSTALLATION_COSTS = [
  { component: 'Materials', range: '$800-$3,500', factors: 'Wire size, conduit, panel, disconnect' },
  { component: 'Trenching (100ft)', range: '$600-$1,200', factors: 'Depth, soil type, obstacles' },
  { component: 'Conduit Installation', range: '$400-$800', factors: 'Underground vs overhead, length' },
  { component: 'Panel Installation', range: '$300-$600', factors: 'Size, complexity, grounding' },
  { component: 'Inspection Fees', range: '$150-$300', factors: 'Local jurisdiction requirements' },
  { component: 'Total Project', range: '$2,250-$6,400', factors: 'Complete installation with permits' }
];

const VOLTAGE_DROP_TABLE = [
  { wireSize: '10 AWG Cu', resistance: '1.24 Ω/1000ft', maxAmps: '30A', max100ft: '24A (5% drop)' },
  { wireSize: '8 AWG Cu', resistance: '0.78 Ω/1000ft', maxAmps: '40A', max100ft: '39A (5% drop)' },
  { wireSize: '6 AWG Cu', resistance: '0.49 Ω/1000ft', maxAmps: '55A', max100ft: '62A (5% drop)' },
  { wireSize: '4 AWG Cu', resistance: '0.31 Ω/1000ft', maxAmps: '70A', max100ft: '98A (5% drop)' },
  { wireSize: '3 AWG Cu', resistance: '0.25 Ω/1000ft', maxAmps: '85A', max100ft: '122A (5% drop)' },
  { wireSize: '2 AWG Cu', resistance: '0.20 Ω/1000ft', maxAmps: '95A', max100ft: '152A (5% drop)' },
  { wireSize: '1 AWG Cu', resistance: '0.15 Ω/1000ft', maxAmps: '110A', max100ft: '203A (5% drop)' },
  { wireSize: '1/0 AWG Cu', resistance: '0.12 Ω/1000ft', maxAmps: '125A', max100ft: '253A (5% drop)' }
];

const GROUNDING_REQUIREMENTS = [
  {
    title: 'Equipment Grounding Conductor',
    requirement: 'Required with all feeders per NEC 225.30',
    sizing: 'Table 250.122 - based on feeder OCPD rating',
    installation: 'Run with feeder conductors in same raceway',
    connection: 'Bonded to main panel ground and building ground rod'
  },
  {
    title: 'Grounding Electrode',
    requirement: 'Required if no electrode exists at building',
    types: 'Ground rod, concrete-encased, metal water pipe',
    specifications: '8ft ground rod minimum, 6 AWG connection',
    separation: 'If multiple rods, 6ft minimum spacing'
  },
  {
    title: 'Bonding Requirements',
    requirement: 'Metal parts connected to electrical system',
    scope: 'Conduit, panel enclosures, disconnects, metal building frame',
    method: 'Equipment grounding conductor or bonding jumpers',
    verification: 'Continuity testing required'
  }
];

const COMMON_MISTAKES = [
  {
    mistake: 'Undersized Equipment Ground',
    consequence: 'Code violation, safety hazard',
    correction: 'Size per Table 250.122 based on OCPD rating, not wire size',
    cost: 'Rewiring required - $500-$1,500'
  },
  {
    mistake: 'No Disconnect at Building',
    consequence: 'Major code violation, failed inspection',
    correction: 'Install listed disconnect switch at building entrance',
    cost: 'Disconnect + installation - $400-$800'
  },
  {
    mistake: 'Improper Burial Depth',
    consequence: 'Safety hazard, code violation',
    correction: 'Dig up and reinstall at proper depth (24" minimum)',
    cost: 'Re-excavation + labor - $800-$1,600'
  },
  {
    mistake: 'Multiple Neutrals in Panel',
    consequence: 'Code violation, potential fire hazard',
    correction: 'Separate neutral and ground bars in subpanel',
    cost: 'Panel modification - $200-$400'
  },
  {
    mistake: 'No Ground Rod at Building',
    consequence: 'Incomplete grounding system',
    correction: 'Install grounding electrode system per NEC 250',
    cost: 'Ground rod + connection - $150-$300'
  },
  {
    mistake: 'Voltage Drop Not Calculated',
    consequence: 'Poor performance, equipment damage',
    correction: 'Calculate drop, upsize wire if necessary',
    cost: 'Wire upgrade - $300-$1,200'
  }
];

const REGIONAL_VARIATIONS = [
  {
    region: 'California',
    requirements: 'Title 24 energy compliance, seismic considerations',
    additions: 'EV-ready requirements, solar-ready provisions',
    authority: 'CEC (California Electrical Code)'
  },
  {
    region: 'Florida',
    requirements: 'Hurricane resistance, concrete encasement',
    additions: 'Special flood zone requirements, corrosion protection',
    authority: 'Local amendments to NEC'
  },
  {
    region: 'New York',
    requirements: 'Frost depth considerations (4ft+), city permits',
    additions: 'NYC has specific underground requirements',
    authority: 'NYS Electrical Code + local amendments'
  },
  {
    region: 'Texas',
    requirements: 'Heat considerations, expansive soil protection',
    additions: 'Some areas require concrete encasement',
    authority: 'NEC with local modifications'
  },
  {
    region: 'Minnesota',
    requirements: 'Deep frost protection, heating considerations',
    additions: 'Cold weather installation practices',
    authority: 'Minnesota Electrical Code'
  }
];

const MAINTENANCE_SCHEDULE = [
  {
    interval: 'Monthly',
    task: 'Visual inspection of disconnect and panel',
    details: 'Check for damage, corrosion, loose connections',
    diy: 'Yes - visual only'
  },
  {
    interval: 'Annually',
    task: 'GFCI testing (if present)',
    details: 'Test and reset all GFCI devices',
    diy: 'Yes - follow manufacturer instructions'
  },
  {
    interval: 'Every 3 Years',
    task: 'Electrical connection inspection',
    details: 'Check panel connections, torque specifications',
    diy: 'No - requires electrician'
  },
  {
    interval: 'Every 5 Years',
    task: 'Ground system testing',
    details: 'Test grounding electrode resistance',
    diy: 'No - requires test equipment'
  },
  {
    interval: 'Every 10 Years',
    task: 'Complete system inspection',
    details: 'Professional inspection of entire feeder system',
    diy: 'No - requires licensed electrician'
  }
];

const COMPREHENSIVE_FAQS = [
  {
    question: 'What size feeder do I need for a 100 amp garage subpanel?',
    answer: 'For a 100A subpanel, you need 3 AWG copper or 1 AWG aluminum feeder conductors, sized for 100A continuous load. The equipment grounding conductor must be 8 AWG copper minimum per NEC Table 250.122. Always check voltage drop calculations for your specific run length.'
  },
  {
    question: 'Can I run a subpanel feeder overhead vs underground?',
    answer: 'Yes, both overhead and underground feeders are allowed. Overhead requires minimum clearances per NEC 225.18 (10ft over driveways, 12ft residential). Underground requires 24" burial depth with proper conduit. Underground is often preferred for aesthetics and weather protection.'
  },
  {
    question: 'Do I need a separate ground rod for my detached garage?',
    answer: 'If the building has no existing grounding electrode (ground rod, water pipe, etc.), then yes, you must install a grounding electrode system per NEC 250.32. This is in addition to the equipment grounding conductor run with the feeder.'
  },
  {
    question: 'What is the maximum distance for a garage subpanel feeder?',
    answer: 'There is no NEC distance limit, but voltage drop becomes the limiting factor. For 100A loads, practical limits are typically 150-200 feet before wire upsizing becomes necessary to maintain acceptable voltage drop (3-5% maximum recommended).'
  },
  {
    question: 'Can I use the same feeder for garage and workshop loads?',
    answer: 'Yes, you can size one feeder for combined loads using demand factors. Calculate the total demand load, apply appropriate demand factors per NEC Article 220, and size the feeder accordingly. A single disconnect can serve multiple buildings if properly sized.'
  },
  {
    question: 'What permits are required for garage subpanel installation?',
    answer: 'Most jurisdictions require electrical permits for subpanel installation. The work typically requires inspection of the feeder installation, grounding system, and panel connections. Check with your local building department for specific requirements and fees.'
  }
];

export default function GarageSubpanelCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema items={calculatorFAQs['garage-subpanel-calculator']} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Home className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Garage Subpanel Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-green-50">
                Calculate feeder requirements for garage subpanels and detached building electrical service. 
                Complete NEC Article 225 compliant calculations for safe, code-compliant installations.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">NEC Article 225</div>
                  <div className="font-semibold">Detached Buildings</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">Service Range</div>
                  <div className="font-semibold">60A - 400A</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">Installation Types</div>
                  <div className="font-semibold">Underground/Overhead</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-green-100">Applications</div>
                  <div className="font-semibold">Garage, Shop, Barn</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Safety Information */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-green-900 mb-2">Detached Building Requirements</h2>
                <ul className="text-green-800 space-y-1 text-sm">
                  <li>• Feeder disconnect required at detached building per NEC 225.31</li>
                  <li>• Equipment grounding conductor required with ALL feeders per NEC 225.30</li>
                  <li>• Grounding electrode system required if none exists at building</li>
                  <li>• Maximum 6 disconnects per building location per NEC 225.33</li>
                  <li>• Professional installation recommended - improper grounding can be deadly</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <GarageSubpanelCalculator />

          {/* Comprehensive Installation Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Real-World Installation Examples</h2>
            </div>
            
            <div className="grid gap-8">
              {GARAGE_EXAMPLES.map((example, idx) => (
                <div key={idx} className="border-l-4 border-green-500 bg-green-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{example.title}</h3>
                      <p className="text-green-700 font-medium mb-2">{example.scenario}</p>
                      <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Load Breakdown:</span> {example.loads}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-green-600 mb-1">{example.result}</div>
                      <div className="text-sm text-gray-500 mb-1">{example.grounding}</div>
                      <div className="text-sm text-orange-600 mb-1">{example.cost}</div>
                      <div className="text-xs text-blue-600">{example.compliance}</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Calculation Details:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-line font-mono">{example.calculation}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEC Article 225 Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">NEC Article 225 - Detached Building Requirements</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {NEC_225_REQUIREMENTS.map((req, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-red-50">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{req.requirement}</h3>
                        <span className="text-xs bg-red-100 px-2 py-1 rounded">NEC {req.section}</span>
                      </div>
                      <p className="font-medium text-red-700 mb-2">{req.rule}</p>
                      <p className="text-sm text-gray-600 mb-2">{req.details}</p>
                      <span className="text-xs font-medium text-orange-600">{req.importance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feeder Sizing Chart */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Feeder Sizing Quick Reference</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Service Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Feeder Wire</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Equipment Ground</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Conduit Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Typical Application</th>
                  </tr>
                </thead>
                <tbody>
                  {FEEDER_SIZING_CHART.map((feeder, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-purple-600">{feeder.service}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{feeder.wire}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-green-600">{feeder.ground}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{feeder.conduit}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{feeder.application}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Voltage Drop Reference */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Voltage Drop Reference Table</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Maximum current capacity for 5% voltage drop at 100ft run, 240V single-phase
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-yellow-50">
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Wire Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Resistance</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Ampacity Rating</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Max Current (100ft)</th>
                  </tr>
                </thead>
                <tbody>
                  {VOLTAGE_DROP_TABLE.map((wire, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-yellow-600">{wire.wireSize}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{wire.resistance}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold">{wire.maxAmps}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-green-600">{wire.max100ft}</td>
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
              <h2 className="text-2xl font-bold text-gray-900">Installation Cost Breakdown</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {INSTALLATION_COSTS.map((cost, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{cost.component}</h3>
                    <span className="font-bold text-green-600">{cost.range}</span>
                  </div>
                  <p className="text-sm text-gray-600">{cost.factors}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-medium">Note:</span> Costs vary significantly by location, accessibility, and local labor rates. 
                Always obtain multiple quotes from licensed electricians for accurate pricing.
              </p>
            </div>
          </div>

          {/* Grounding Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Grounding System Requirements</h2>
            </div>
            
            <div className="space-y-6">
              {GROUNDING_REQUIREMENTS.map((req, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{req.title}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Requirement:</span> {req.requirement}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Sizing:</span> {req.sizing}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Installation:</span> {req.installation}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Connection:</span> {req.connection}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Installation Mistakes */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Common Installation Mistakes</h2>
            </div>
            
            <div className="space-y-6">
              {COMMON_MISTAKES.map((mistake, idx) => (
                <div key={idx} className="border border-red-200 rounded-lg p-6 bg-red-50">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold text-sm">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 mb-2">{mistake.mistake}</h3>
                      <p className="text-sm text-red-700 mb-2"><span className="font-medium">Consequence:</span> {mistake.consequence}</p>
                      <p className="text-sm text-gray-700 mb-2"><span className="font-medium">Correction:</span> {mistake.correction}</p>
                      <p className="text-sm text-orange-600 font-medium">Repair Cost: {mistake.cost}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Code Variations */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Regional Code Variations</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {REGIONAL_VARIATIONS.map((region, idx) => (
                <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">{region.region}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Requirements:</span> {region.requirements}</p>
                  <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Additions:</span> {region.additions}</p>
                  <p className="text-xs text-purple-600 font-medium">Authority: {region.authority}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Schedule */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Maintenance Schedule</h2>
            </div>
            
            <div className="space-y-4">
              {MAINTENANCE_SCHEDULE.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="w-20 text-sm font-medium text-orange-600 flex-shrink-0">{item.interval}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{item.task}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                    <span className={`text-xs px-2 py-1 rounded ${item.diy === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.diy === 'Yes' ? 'DIY Friendly' : 'Professional Required'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {COMPREHENSIVE_FAQS.map((faq, idx) => (
                <details key={idx} className="group bg-gray-50 rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-100 rounded-lg">
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
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
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Electrical Calculators</h2>
              <p className="text-gray-600">Complete your electrical system design</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Size Calculator</h3>
                <p className="text-xs text-gray-600">Calculate wire AWG</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Target className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Check voltage losses</p>
              </Link>
              
              <Link href="/calculators/three-phase-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">3-Phase Power</h3>
                <p className="text-xs text-gray-600">Industrial systems</p>
              </Link>
              
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service sizing</p>
              </Link>
              
              <Link href="/calculators/rv-hookup-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Car className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">RV Hookup</h3>
                <p className="text-xs text-gray-600">RV electrical service</p>
              </Link>
              
              <Link href="/calculators/welder-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Wrench className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Welder Calculator</h3>
                <p className="text-xs text-gray-600">Welding circuits</p>
              </Link>
              
              <Link href="/calculators/conduit-fill-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Settings className="w-8 h-8 text-teal-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Conduit Fill</h3>
                <p className="text-xs text-gray-600">Raceway capacity</p>
              </Link>
              
              <Link href="/calculators/ampacity-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-indigo-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Ampacity</h3>
                <p className="text-xs text-gray-600">Wire capacity</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
