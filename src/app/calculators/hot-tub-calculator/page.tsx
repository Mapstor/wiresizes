import { Metadata } from 'next';
import { HotTubCalculator } from '@/components/calculators';
import { Droplets, Calculator, AlertTriangle, Settings, Target, BookOpen, Users, Shield, Thermometer, Wrench, Zap, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Hot Tub Calculator | Spa Electrical Requirements Calculator | NEC 680',
  description: 'Calculate wire size and electrical requirements for hot tubs and spas per NEC Article 680. Professional spa installation calculator for 240V hot tub circuits.',
  keywords: 'hot tub calculator, spa electrical requirements, NEC Article 680, hot tub wire size, spa circuit calculator, GFCI hot tub installation',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Hot Tub Electrical Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Size wire, breaker, and disconnect for hot tub installations with NEC compliance.",
  "keywords": "spa wiring, hot tub electrical, pool equipment",
  "url": `https://wiresizes.com/calculators/hot-tub-calculator`,
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

const DETAILED_HOT_TUB_EXAMPLES = [
  {
    title: 'Standard 6-Person Hot Tub - Residential',
    scenario: '40A spa pack, 50ft run from main panel, 240V installation',
    calculation: `Nameplate Rating: 40A continuous load
Load Calculation: 40A × 1.25 = 50A minimum circuit
Wire Selection: 6 AWG copper (65A ampacity @ 75°C)
Conduit: 1" PVC or EMT for underground/outdoor run
GFCI Protection: 50A GFCI breaker in main panel
Disconnect: 50A non-fused disconnect within sight
Voltage Drop Check: 40A × 50ft × 2.6Ω/1000ft ÷ 240V = 1.36% (acceptable)
Bonding: 8 AWG solid copper to all metal parts
Grounding: Equipment grounding conductor included in circuit`,
    result: '50A circuit, 6 AWG copper wire',
    gfciReq: '50A GFCI breaker required',
    cost: '$850-1,200 materials + $600-900 installation',
    application: 'Typical residential backyard spa',
    specialNotes: 'Most common installation type'
  },
  {
    title: 'High-End 8-Person Luxury Spa',
    scenario: '60A main pack + 20A auxiliary loads, dual pumps, LED lighting',
    calculation: `Main Spa Pack: 60A continuous load
Main Circuit: 60A × 1.25 = 75A → 80A breaker required
Main Wire: 4 AWG copper (85A ampacity)
Auxiliary Circuit: 20A for lighting, stereo, ozone
Aux Wire: 12 AWG copper (20A ampacity)
Subpanel: 100A spa subpanel recommended
Total Load: 60A + 20A = 80A demand
Service Impact: Check main panel capacity
GFCI: Both circuits require GFCI protection`,
    result: '80A main + 20A aux circuits',
    gfciReq: 'All circuits GFCI protected',
    cost: '$1,200-1,800 materials + $800-1,200 installation',
    application: 'Luxury spa with premium features',
    specialNotes: 'Subpanel simplifies installation and future service'
  },
  {
    title: 'Portable Hot Tub - NEMA 6-50 Connection',
    scenario: '32A portable spa, plug-in connection, 25ft from panel',
    calculation: `Nameplate Load: 32A continuous
Circuit Sizing: 32A × 1.25 = 40A minimum
Outlet Selection: NEMA 6-50R (50A rated)
Wire Size: 6 AWG copper (matches 50A outlet)
Breaker: 50A GFCI breaker
Conduit: 1" for outdoor/underground run
Voltage Drop: 32A × 25ft × 2.6Ω/1000ft ÷ 240V = 0.87%
Receptacle Location: Weather-protected enclosure`,
    result: '50A circuit, NEMA 6-50R outlet',
    gfciReq: 'GFCI breaker or outlet',
    cost: '$650-850 materials + $400-600 installation',
    application: 'Plug-in portable spas',
    specialNotes: 'Allows spa to be moved or replaced easily'
  },
  {
    title: 'Swim Spa Installation - Commercial Grade',
    scenario: '80A swim spa with resistance jets, 100ft run, concrete pad',
    calculation: `Swim Spa Load: 80A continuous
Circuit Required: 80A × 1.25 = 100A
Wire Size: 2 AWG copper (115A ampacity)
Conduit: 1.5" rigid PVC for long underground run
Voltage Drop: 80A × 100ft × 1.6Ω/1000ft ÷ 240V = 2.67%
Wire Upgrade: 1 AWG copper to reduce VD to 2.1%
Disconnect: 100A lockable disconnect
Bonding Grid: Required for large metal frame`,
    result: '100A circuit, 1 AWG copper',
    gfciReq: '100A GFCI breaker',
    cost: '$2,200-3,000 materials + $1,200-1,800 installation',
    application: 'Large swim spas and exercise pools',
    specialNotes: 'Voltage drop considerations critical for long runs'
  },
  {
    title: 'Indoor Hot Tub - Basement Installation',
    scenario: '45A spa in finished basement, ventilation requirements',
    calculation: `Indoor Spa Load: 45A continuous
Circuit Size: 45A × 1.25 = 56.25A → 60A breaker
Wire: 6 AWG copper in appropriate raceway
GFCI: 60A GFCI breaker mandatory
Ventilation: Mechanical exhaust required
Humidity Control: Consider dehumidification system
Bonding: All metal within 5 feet of spa
Disconnect: Within sight but not closer than 5 feet`,
    result: '60A circuit, 6 AWG copper',
    gfciReq: '60A GFCI breaker required',
    cost: '$900-1,300 materials + $700-1,000 installation',
    application: 'Indoor spa installations',
    specialNotes: 'Ventilation and humidity control critical'
  },
  {
    title: 'Multi-Zone Spa Complex',
    scenario: 'Two 40A spas + pool equipment on dedicated subpanel',
    calculation: `Spa #1: 40A continuous load
Spa #2: 40A continuous load  
Pool Pump: 20A load
Lighting: 15A load
Total Connected: 115A
Demand Factor: Apply 75% to largest + 65% to others
Calculated Load: 40A + (40×0.75) + (20×0.65) + (15×0.65) = 92.75A
Subpanel: 125A minimum
Feeder: 3 AWG copper (100A rated)
Main GFCI: Each spa circuit individually protected`,
    result: '125A subpanel, individual spa circuits',
    gfciReq: 'Each spa requires GFCI protection',
    cost: '$3,500-4,500 materials + $2,000-2,800 installation',
    application: 'Resort or large residential complexes',
    specialNotes: 'Demand factors may apply per NEC 220'
  }
];

const COMPREHENSIVE_NEC_680_REQUIREMENTS = [
  {
    requirement: 'GFCI Protection',
    section: '680.41(A)',
    rule: 'All hot tub and spa circuits require GFCI protection',
    details: 'Class A GFCI devices (5mA trip). Can be GFCI breaker in panel or GFCI receptacle.',
    violation: 'No GFCI protection - immediate safety hazard',
    compliance: 'Install appropriate GFCI device rated for the circuit amperage'
  },
  {
    requirement: 'Emergency Shutoff',
    section: '680.41(B)',
    rule: 'Disconnect switch within sight of spa',
    details: 'Must be readily accessible, lockable, and clearly labeled. 5-50 feet from spa.',
    violation: 'No disconnect or not within sight',
    compliance: 'Install approved disconnect switch with lock provision'
  },
  {
    requirement: 'Equipotential Bonding',
    section: '680.42',
    rule: 'All metal parts within 5 feet must be bonded',
    details: '8 AWG solid copper minimum. Connect to spa equipment bonding terminal.',
    violation: 'Unbonded metal creating shock hazard',
    compliance: 'Bond all metal with approved bonding conductor'
  },
  {
    requirement: 'Equipment Location',
    section: '680.43(A)',
    rule: 'Electrical equipment 5 feet from water edge',
    details: 'Applies to panels, disconnects, GFCI devices unless separated by barrier.',
    violation: 'Equipment too close to water',
    compliance: 'Relocate equipment or install approved barrier'
  },
  {
    requirement: 'Overhead Conductor Clearance',
    section: '680.8',
    rule: 'Minimum clearances above spa water',
    details: '22.5 feet for power lines over 600V, 10 feet for communication lines.',
    violation: 'Inadequate clearance overhead',
    compliance: 'Relocate spa or have utility relocate lines'
  },
  {
    requirement: 'Underwater Lighting',
    section: '680.23',
    rule: 'Special requirements for spa lighting',
    details: '12V or less, or approved for direct burial. GFCI protection required.',
    violation: 'Improper lighting installation',
    compliance: 'Use approved low voltage or wet location fixtures'
  }
];

const SPA_WIRE_SIZING_TABLE = [
  { 
    amperage: '20A', 
    wireCopper: '12 AWG', 
    wireAluminum: '10 AWG', 
    conduit: '3/4"', 
    breaker: '20A GFCI',
    typical: 'Small 2-3 person spas',
    heaterSize: '3-4 kW'
  },
  { 
    amperage: '30A', 
    wireCopper: '10 AWG', 
    wireAluminum: '8 AWG', 
    conduit: '3/4"', 
    breaker: '30A GFCI',
    typical: '4-5 person standard spas',
    heaterSize: '4-5.5 kW'
  },
  { 
    amperage: '40A', 
    wireCopper: '8 AWG', 
    wireAluminum: '6 AWG', 
    conduit: '1"', 
    breaker: '50A GFCI',
    typical: '6 person luxury spas',
    heaterSize: '5.5-6 kW'
  },
  { 
    amperage: '50A', 
    wireCopper: '6 AWG', 
    wireAluminum: '4 AWG', 
    conduit: '1"', 
    breaker: '60A GFCI',
    typical: '7-8 person deluxe spas',
    heaterSize: '6-7.5 kW'
  },
  { 
    amperage: '60A', 
    wireCopper: '4 AWG', 
    wireAluminum: '2 AWG', 
    conduit: '1.25"', 
    breaker: '80A GFCI',
    typical: '8+ person premium spas',
    heaterSize: '7.5-9 kW'
  },
  { 
    amperage: '80A', 
    wireCopper: '2 AWG', 
    wireAluminum: '1/0 AWG', 
    conduit: '1.5"', 
    breaker: '100A GFCI',
    typical: 'Swim spas, commercial',
    heaterSize: '9-15 kW'
  }
];

const SPA_EQUIPMENT_COMPARISON = [
  {
    category: 'Control System',
    standard: 'Basic electronic spa pack',
    premium: 'WiFi-enabled smart controls',
    features: 'Temperature, pump timing',
    smartFeatures: 'Remote monitoring, scheduling, diagnostics',
    electricalImpact: 'Minimal additional load',
    cost: '$200-500 vs $800-1500'
  },
  {
    category: 'Heating System',
    standard: '5.5kW flow-through heater',
    premium: 'Dual heating elements',
    features: 'Standard heat-up time',
    smartFeatures: 'Faster heating, backup redundancy',
    electricalImpact: 'May require larger circuit',
    cost: '$400-700 vs $1000-1800'
  },
  {
    category: 'Pump Configuration',
    standard: 'Single 2-speed pump',
    premium: 'Multiple dedicated pumps',
    features: 'Basic filtration and jets',
    smartFeatures: 'Separate circulation, therapy pumps',
    electricalImpact: 'Additional 15-20A circuits',
    cost: '$300-600 vs $800-1500'
  },
  {
    category: 'Lighting Package',
    standard: 'Basic LED perimeter',
    premium: 'Color-changing LED system',
    features: 'White light only',
    smartFeatures: 'RGB colors, synchronized shows',
    electricalImpact: 'Low voltage transformer load',
    cost: '$150-300 vs $500-1200'
  }
];

const INSTALLATION_COST_BREAKDOWN = [
  {
    component: 'Electrical Permit',
    typical: '$75-150',
    notes: 'Required in most jurisdictions',
    diy: 'Required regardless'
  },
  {
    component: 'GFCI Breaker (50A)',
    typical: '$180-250',
    notes: 'Square D, Siemens, or equivalent',
    diy: 'Same cost'
  },
  {
    component: 'Wire (6 AWG, 50ft)',
    typical: '$120-180',
    notes: 'THWN-2 copper conductor',
    diy: 'Bulk purchase savings'
  },
  {
    component: 'Conduit & Fittings',
    typical: '$80-150',
    notes: 'PVC Schedule 40 or EMT',
    diy: '30-50% savings possible'
  },
  {
    component: 'Disconnect Switch',
    typical: '$85-140',
    notes: '50A non-fused outdoor rated',
    diy: 'Same cost'
  },
  {
    component: 'Spa Panel Connection',
    typical: '$120-200',
    notes: 'Weatherproof enclosure',
    diy: 'Installation complexity'
  },
  {
    component: 'Trenching (50ft)',
    typical: '$300-600',
    notes: '18" deep minimum',
    diy: 'Significant labor savings'
  },
  {
    component: 'Labor (Professional)',
    typical: '$600-1200',
    notes: '6-10 hours typical',
    diy: 'Not applicable'
  },
  {
    component: 'Inspection Fee',
    typical: '$50-100',
    notes: 'Required final inspection',
    diy: 'Required regardless'
  }
];

const ENERGY_CONSUMPTION_ANALYSIS = [
  {
    spaSize: '5-6 Person (40A)',
    heaterSize: '5.5kW',
    avgMonthlyKwh: '400-600 kWh',
    winterUsage: '600-900 kWh',
    summerUsage: '200-400 kWh',
    monthlyCost: '$40-90',
    yearlyEstimate: '$480-1080',
    efficiencyTips: 'Good cover, timer controls'
  },
  {
    spaSize: '7-8 Person (50A)',
    heaterSize: '7.5kW',
    avgMonthlyKwh: '500-750 kWh',
    winterUsage: '750-1100 kWh',
    summerUsage: '300-500 kWh',
    monthlyCost: '$50-110',
    yearlyEstimate: '$600-1320',
    efficiencyTips: 'Insulation upgrade, smart controls'
  },
  {
    spaSize: 'Swim Spa (80A)',
    heaterSize: '12kW',
    avgMonthlyKwh: '800-1200 kWh',
    winterUsage: '1200-1800 kWh',
    summerUsage: '500-800 kWh',
    monthlyCost: '$80-180',
    yearlyEstimate: '$960-2160',
    efficiencyTips: 'Variable speed pumps, thermal covers'
  }
];

const TROUBLESHOOTING_GUIDE = [
  {
    problem: 'GFCI Breaker Trips Immediately',
    possibleCauses: [
      'Ground fault in wiring or equipment',
      'Moisture in electrical connections',
      'Damaged equipment or wiring',
      'Improper neutral connection'
    ],
    solutions: [
      'Check all connections for moisture',
      'Inspect spa pack for water intrusion',
      'Test individual components',
      'Verify proper neutral wiring'
    ],
    safety: 'Do not bypass GFCI - indicates dangerous condition'
  },
  {
    problem: 'Spa Not Heating Properly',
    possibleCauses: [
      'Insufficient electrical supply',
      'Voltage drop on long wire runs',
      'Faulty heating element',
      'Poor insulation or cover'
    ],
    solutions: [
      'Check voltage at spa pack',
      'Calculate and verify voltage drop',
      'Test heater element resistance',
      'Upgrade insulation and cover'
    ],
    safety: 'Verify proper electrical supply before heater replacement'
  },
  {
    problem: 'Pumps Running Continuously',
    possibleCauses: [
      'Control system malfunction',
      'Pressure switch failure',
      'Temperature sensor issues',
      'Programming errors'
    ],
    solutions: [
      'Check control panel programming',
      'Test pressure and temp sensors',
      'Inspect control wiring',
      'Reset system to defaults'
    ],
    safety: 'Continuous operation increases electrical consumption'
  },
  {
    problem: 'Lights Not Working',
    possibleCauses: [
      'Blown transformer',
      'Water in light fixtures',
      'Loose connections',
      'Failed LED modules'
    ],
    solutions: [
      'Test transformer output voltage',
      'Inspect fixtures for water damage',
      'Check all connection points',
      'Replace failed LED components'
    ],
    safety: 'Use only approved wet location fixtures'
  }
];

const MAINTENANCE_SCHEDULE = [
  {
    frequency: 'Weekly',
    task: 'Test GFCI Operation',
    procedure: 'Press test/reset buttons on GFCI device',
    importance: 'Critical safety check',
    diy: 'Yes - required by homeowner'
  },
  {
    frequency: 'Monthly',
    task: 'Inspect Electrical Connections',
    procedure: 'Visual check of disconnect, spa pack connections',
    importance: 'Prevent moisture damage',
    diy: 'Yes - visual only'
  },
  {
    frequency: 'Quarterly',
    task: 'Clean Electrical Enclosures',
    procedure: 'Remove debris from spa pack, disconnect areas',
    importance: 'Ensure proper ventilation',
    diy: 'Yes - power off first'
  },
  {
    frequency: 'Annually',
    task: 'Professional Electrical Inspection',
    procedure: 'Complete system check by qualified electrician',
    importance: 'Identify potential problems',
    diy: 'No - requires expertise'
  },
  {
    frequency: 'As Needed',
    task: 'Update Control Software',
    procedure: 'Install firmware updates for smart systems',
    importance: 'Maintain efficiency and features',
    diy: 'Often - follow manufacturer instructions'
  }
];

const REGIONAL_CODE_VARIATIONS = [
  {
    region: 'California',
    specificRequirements: [
      'Title 24 energy efficiency compliance',
      'Additional seismic considerations for electrical equipment',
      'Stricter GFCI requirements in some areas'
    ],
    notes: 'Check local amendments to NEC'
  },
  {
    region: 'Florida',
    specificRequirements: [
      'Hurricane/wind load considerations for overhead equipment',
      'Corrosion-resistant materials in coastal areas',
      'Flooding considerations for ground-level equipment'
    ],
    notes: 'Special provisions for high-wind areas'
  },
  {
    region: 'Northern States',
    specificRequirements: [
      'Frost protection for outdoor equipment',
      'Increased burial depth in freeze areas',
      'Equipment rated for temperature extremes'
    ],
    notes: 'Consider freeze/thaw cycle effects'
  },
  {
    region: 'Canadian Provinces',
    specificRequirements: [
      'CSA approved equipment required',
      'Metric measurements and different voltage standards',
      'Provincial electrical code variations'
    ],
    notes: 'Different standards than US NEC'
  }
];

const COMPREHENSIVE_FAQS = [
  {
    question: 'What size wire do I need for a 40 amp hot tub?',
    answer: 'A 40A hot tub requires 8 AWG copper wire on a 50A circuit (40A × 1.25 = 50A minimum). However, many electricians use 6 AWG for the 50A circuit to provide extra capacity and reduce voltage drop. The circuit must have GFCI protection and a disconnect switch within sight of the spa per NEC Article 680.',
    category: 'Wiring'
  },
  {
    question: 'Can I use aluminum wire for my hot tub installation?',
    answer: 'Yes, aluminum wire is permitted but requires larger sizes. For a 50A circuit, use 4 AWG aluminum instead of 6 AWG copper. Aluminum requires special connectors and anti-oxidant compound. Many electricians prefer copper for spa installations due to corrosion resistance in wet environments.',
    category: 'Materials'
  },
  {
    question: 'Do I need a subpanel for my hot tub?',
    answer: 'Not always required, but recommended for complex installations with multiple circuits (main power, auxiliary loads, lighting). A subpanel makes installation cleaner, provides convenient local disconnect capability, and simplifies future maintenance. Required when total spa load exceeds available main panel capacity.',
    category: 'Installation'
  },
  {
    question: 'What is the 5-foot rule for hot tubs?',
    answer: 'NEC 680.43 requires electrical equipment (panels, disconnects, GFCI devices) to be at least 5 feet from the water edge, unless separated by a permanent barrier. This protects against electrical hazards near water. The disconnect must also be within sight of the spa, creating a 5-50 foot installation zone.',
    category: 'Safety'
  },
  {
    question: 'Can I install a hot tub on existing deck wiring?',
    answer: 'Unlikely. Most deck outlets are 15A or 20A circuits, while hot tubs typically require 40-80A dedicated circuits. The existing wiring is also unlikely to have proper GFCI protection or meet NEC Article 680 requirements. A dedicated spa circuit is almost always required.',
    category: 'Installation'
  },
  {
    question: 'How deep should I bury the spa electrical conduit?',
    answer: 'Minimum 18 inches for residential installations in most areas. Some regions require 24 inches. Use rigid PVC conduit rated for direct burial. Include warning tape 12 inches above conduit. Check local codes as burial depth may vary based on conduit type and location.',
    category: 'Installation'
  }
];

const PROFESSIONAL_TIPS = [
  {
    category: 'Planning',
    tip: 'Size for Future Upgrades',
    detail: 'Install slightly larger conduit and wire than minimum required. This allows for future spa upgrades without rewiring.',
    cost: 'Minimal upfront cost saves major expense later'
  },
  {
    category: 'Safety',
    tip: 'Double-Check GFCI Operation',
    detail: 'Test GFCI devices monthly and after any electrical work. A non-functioning GFCI is a serious safety hazard around water.',
    cost: 'No cost but critical for safety'
  },
  {
    category: 'Efficiency',
    tip: 'Consider Smart Controls',
    detail: 'WiFi-enabled spa controls allow remote monitoring and scheduling, reducing energy costs through optimized operation.',
    cost: '$300-800 upgrade with significant energy savings'
  },
  {
    category: 'Maintenance',
    tip: 'Keep Electrical Dry',
    detail: 'Ensure spa pack and disconnect enclosures remain water-tight. Replace gaskets and seals as needed.',
    cost: 'Small maintenance prevents major repairs'
  }
];

export default function HotTubCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema items={calculatorFAQs['hot-tub-calculator']} />
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
                <Droplets className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Hot Tub Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-blue-50">
                Professional electrical calculations for hot tub and spa installations. Complete NEC Article 680 compliance 
                guide with wire sizing, GFCI protection, and safety requirements for residential and commercial spas.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-blue-100">NEC Article 680</div>
                  <div className="font-semibold">Spa Code Compliance</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-blue-100">GFCI Required</div>
                  <div className="font-semibold">All Spa Circuits</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-blue-100">Load Range</div>
                  <div className="font-semibold">20A - 100A+</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-blue-100">Safety Critical</div>
                  <div className="font-semibold">Bonding & Disconnect</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Safety Information */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-red-900 mb-3">CRITICAL: Hot Tub Safety Requirements - Lives Depend On This</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul className="text-red-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span><strong>GFCI Protection:</strong> Mandatory on ALL spa circuits - no exceptions per NEC 680</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Bonding:</strong> All metal within 5 feet bonded with 8 AWG copper minimum</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Emergency Disconnect:</strong> Within sight, lockable, properly labeled</span>
                    </li>
                  </ul>
                  <ul className="text-red-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span><strong>5-Foot Rule:</strong> No electrical equipment within 5 feet of water edge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Professional Install:</strong> Licensed electrician required - water + electricity = death</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Permit Required:</strong> All spa electrical work requires permits and inspection</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <HotTubCalculator />

          {/* Detailed Installation Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Professional Hot Tub Installation Examples</h2>
            </div>
            
            <div className="grid gap-8">
              {DETAILED_HOT_TUB_EXAMPLES.map((example, idx) => (
                <div key={idx} className="border-l-4 border-cyan-500 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{example.title}</h3>
                      <p className="text-cyan-700 font-medium mb-2">{example.scenario}</p>
                      <div className="text-sm text-blue-600 mb-2">
                        <span className="font-medium">Application:</span> {example.application}
                      </div>
                      {example.specialNotes && (
                        <div className="text-sm text-purple-600">
                          <span className="font-medium">Note:</span> {example.specialNotes}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-cyan-600">{example.result}</div>
                      <div className="text-sm text-red-600 font-medium">{example.gfciReq}</div>
                      <div className="text-sm text-orange-600 font-medium">{example.cost}</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-900 mb-2">Detailed Calculations:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-line font-mono leading-relaxed">{example.calculation}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comprehensive Wire Sizing Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Hot Tub Wire Sizing Reference Table</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-yellow-50">
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold">Spa Load</th>
                    <th className="border border-gray-300 px-3 py-3 text-center font-semibold">Copper Wire</th>
                    <th className="border border-gray-300 px-3 py-3 text-center font-semibold">Aluminum Wire</th>
                    <th className="border border-gray-300 px-3 py-3 text-center font-semibold">Conduit Size</th>
                    <th className="border border-gray-300 px-3 py-3 text-center font-semibold">GFCI Breaker</th>
                    <th className="border border-gray-300 px-3 py-3 text-center font-semibold">Typical Application</th>
                    <th className="border border-gray-300 px-3 py-3 text-center font-semibold">Heater Size</th>
                  </tr>
                </thead>
                <tbody>
                  {SPA_WIRE_SIZING_TABLE.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-3 font-bold text-yellow-600">{row.amperage}</td>
                      <td className="border border-gray-300 px-3 py-3 text-center font-bold text-green-600">{row.wireCopper}</td>
                      <td className="border border-gray-300 px-3 py-3 text-center font-medium text-gray-600">{row.wireAluminum}</td>
                      <td className="border border-gray-300 px-3 py-3 text-center">{row.conduit}</td>
                      <td className="border border-gray-300 px-3 py-3 text-center font-bold text-red-600">{row.breaker}</td>
                      <td className="border border-gray-300 px-3 py-3 text-center text-sm">{row.typical}</td>
                      <td className="border border-gray-300 px-3 py-3 text-center text-sm">{row.heaterSize}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Important Notes:</h4>
              <ul className="space-y-1">
                <li>• Circuit breaker size = Spa load × 1.25 (continuous load factor)</li>
                <li>• Wire must be rated for breaker size, not just spa load</li>
                <li>• Aluminum requires anti-oxidant compound and proper connectors</li>
                <li>• Conduit size based on NEC Chapter 9, Table 5 (PVC Schedule 40)</li>
                <li>• All installations require GFCI protection - no exceptions</li>
              </ul>
            </div>
          </div>

          {/* NEC 680 Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">NEC Article 680 Requirements - Complete Compliance Guide</h2>
            </div>
            
            <div className="grid gap-6">
              {COMPREHENSIVE_NEC_680_REQUIREMENTS.map((req, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-gradient-to-r from-red-50 to-orange-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <h3 className="font-bold text-gray-900 text-lg">{req.requirement}</h3>
                        <span className="text-sm bg-red-100 px-3 py-1 rounded-full font-medium">NEC {req.section}</span>
                      </div>
                      <p className="font-semibold text-red-700 mb-2">{req.rule}</p>
                      <p className="text-gray-700 mb-3">{req.details}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-100 rounded-lg p-3">
                      <h4 className="font-medium text-red-900 mb-1">Common Violation:</h4>
                      <p className="text-sm text-red-800">{req.violation}</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <h4 className="font-medium text-green-900 mb-1">Compliance Solution:</h4>
                      <p className="text-sm text-green-800">{req.compliance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Hot Tub Equipment Comparison & Electrical Impact</h2>
            </div>
            
            <div className="grid gap-6">
              {SPA_EQUIPMENT_COMPARISON.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-purple-50">
                  <h3 className="font-bold text-purple-900 text-lg mb-4">{item.category}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-semibold text-gray-900 mb-2">Standard Option</h4>
                      <p className="text-gray-700 mb-2">{item.standard}</p>
                      <p className="text-sm text-gray-600 mb-2">{item.features}</p>
                      <div className="text-sm">
                        <span className="font-medium text-blue-600">Electrical:</span> {item.electricalImpact}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2">Premium Option</h4>
                      <p className="text-purple-700 mb-2">{item.premium}</p>
                      <p className="text-sm text-purple-600 mb-2">{item.smartFeatures}</p>
                      <div className="text-sm">
                        <span className="font-medium text-orange-600">Cost:</span> {item.cost}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Installation Cost Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Hot Tub Installation Cost Breakdown</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Component</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Typical Cost</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Notes</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">DIY Potential</th>
                  </tr>
                </thead>
                <tbody>
                  {INSTALLATION_COST_BREAKDOWN.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{item.component}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-green-600">{item.typical}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{item.notes}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">{item.diy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-2">Professional Installation Total</h4>
                <p className="text-2xl font-bold text-blue-600">$1,610 - $2,970</p>
                <p className="text-sm text-blue-700">Includes permits, materials, labor, and inspection</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-bold text-orange-900 mb-2">DIY Materials Only</h4>
                <p className="text-2xl font-bold text-orange-600">$810 - $1,370</p>
                <p className="text-sm text-orange-700">Still requires licensed electrician final connection</p>
              </div>
            </div>
          </div>

          {/* Energy Consumption Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Thermometer className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Hot Tub Energy Consumption Analysis</h2>
            </div>
            
            <div className="grid gap-6">
              {ENERGY_CONSUMPTION_ANALYSIS.map((spa, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-orange-50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-orange-900 text-lg">{spa.spaSize}</h3>
                      <p className="text-orange-700">Heater: {spa.heaterSize}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{spa.monthlyCost}</div>
                      <div className="text-sm text-gray-600">Monthly average</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-600">Winter Usage</div>
                      <div className="font-bold text-blue-600">{spa.winterUsage}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-600">Summer Usage</div>
                      <div className="font-bold text-green-600">{spa.summerUsage}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-600">Yearly Estimate</div>
                      <div className="font-bold text-red-600">{spa.yearlyEstimate}</div>
                    </div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3">
                    <h4 className="font-medium text-green-900 mb-1">Efficiency Tips:</h4>
                    <p className="text-sm text-green-800">{spa.efficiencyTips}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Hot Tub Electrical Troubleshooting Guide</h2>
            </div>
            
            <div className="grid gap-6">
              {TROUBLESHOOTING_GUIDE.map((issue, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-blue-50">
                  <h3 className="font-bold text-blue-900 text-lg mb-4">{issue.problem}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Possible Causes:</h4>
                      <ul className="space-y-1">
                        {issue.possibleCauses.map((cause, causeIdx) => (
                          <li key={causeIdx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Solutions:</h4>
                      <ul className="space-y-1">
                        {issue.solutions.map((solution, solIdx) => (
                          <li key={solIdx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-yellow-100 rounded-lg p-3">
                    <h4 className="font-medium text-yellow-900 mb-1">Safety Warning:</h4>
                    <p className="text-sm text-yellow-800">{issue.safety}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Schedule */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Hot Tub Electrical Maintenance Schedule</h2>
            </div>
            
            <div className="space-y-4">
              {MAINTENANCE_SCHEDULE.map((task, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-green-900">{task.task}</h3>
                    <span className="bg-green-200 px-3 py-1 rounded-full text-sm font-medium text-green-800">
                      {task.frequency}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{task.procedure}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">
                      <strong>Importance:</strong> {task.importance}
                    </span>
                    <span className={task.diy.startsWith('Yes') ? 'text-blue-600' : 'text-red-600'}>
                      <strong>DIY:</strong> {task.diy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Code Variations */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">Regional Code Variations</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {REGIONAL_CODE_VARIATIONS.map((region, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-indigo-50">
                  <h3 className="font-bold text-indigo-900 text-lg mb-3">{region.region}</h3>
                  <ul className="space-y-2 mb-4">
                    {region.specificRequirements.map((req, reqIdx) => (
                      <li key={reqIdx} className="text-sm text-indigo-800 flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-yellow-100 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> {region.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Professional Installation Tips</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {PROFESSIONAL_TIPS.map((tip, idx) => (
                <div key={idx} className="bg-white rounded-lg p-6 border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <h3 className="font-bold text-purple-900">{tip.tip}</h3>
                  </div>
                  <p className="text-gray-700 mb-3">{tip.detail}</p>
                  <div className="text-sm">
                    <span className="font-medium text-green-600">Cost Impact:</span> {tip.cost}
                  </div>
                  <div className="mt-2 text-xs bg-purple-100 px-2 py-1 rounded text-purple-800">
                    {tip.category}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expanded FAQs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Hot Tub Electrical FAQ - Expert Answers</h2>
            </div>
            
            <div className="space-y-4">
              {COMPREHENSIVE_FAQS.map((faq, idx) => (
                <details key={idx} className="group bg-gray-50 rounded-lg border">
                  <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-100 rounded-lg">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-800">{faq.category}</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </div>
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Pool & Spa Electrical Calculators</h2>
              <p className="text-gray-600">Complete your pool and spa electrical planning with professional tools</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/calculators/pool-pump-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow group">
                <Droplets className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 text-sm">Pool Pump</h3>
                <p className="text-xs text-gray-600">Pool equipment sizing</p>
              </Link>
              
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow group">
                <Calculator className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Sizing</h3>
                <p className="text-xs text-gray-600">Calculate AWG</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow group">
                <Target className="w-8 h-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Check losses</p>
              </Link>
              
              <Link href="/calculators/garage-subpanel-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow group">
                <Settings className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 text-sm">Subpanel</h3>
                <p className="text-xs text-gray-600">Pool house panel</p>
              </Link>
              
              <Link href="/calculators/conduit-fill-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow group">
                <Shield className="w-8 h-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 text-sm">Conduit Fill</h3>
                <p className="text-xs text-gray-600">Underground runs</p>
              </Link>
              
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow group">
                <BookOpen className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service sizing</p>
              </Link>
            </div>
          </div>

          {/* External Authority Links */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Resources & Code References</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Official Code Resources:</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">NFPA 70: National Electrical Code</a></li>
                  <li><a href="https://iaei.org/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">International Association of Electrical Inspectors</a></li>
                  <li><a href="https://www.ul.com/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">UL Standards & Safety</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Industry Organizations:</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://www.neca.org/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">National Electrical Contractors Association</a></li>
                  <li><a href="https://www.phta.org/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">Pool & Hot Tub Alliance</a></li>
                  <li><a href="https://www.apsp.org/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">Association of Pool & Spa Professionals</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}