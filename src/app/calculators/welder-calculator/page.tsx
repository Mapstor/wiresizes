import { Metadata } from 'next';
import { WelderCalculator } from '@/components/calculators';
import { Wrench, Calculator, AlertTriangle, Settings, Target, BookOpen, Users, Shield, Zap, Thermometer, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Welder Calculator | Welding Equipment Circuit Calculator | Arc Welder Sizing',
  description: 'Calculate electrical requirements for welding equipment and arc welders. Professional welder circuit calculator for 240V and 480V welding machines.',
  keywords: 'welder calculator, welding equipment circuit, arc welder sizing, welding machine electrical requirements, welder wire size calculator',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Welder Wire Size Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Calculate electrical requirements for welding machines and outlets.",
  "keywords": "welder wiring, welding electrical, welder outlet",
  "url": `https://wiresizes.com/calculators/welder-calculator`,
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

const COMPREHENSIVE_WELDER_EXAMPLES = [
  {
    title: '200A Stick Welder (SMAW) - Professional Shop',
    scenario: '200A output, 240V single-phase input, 60% duty cycle, transformer-based',
    calculation: `Nameplate Rating: 200A output @ 60% duty cycle
Primary Input Calculation:
- Arc Power: 200A × 25V = 5,000W (typical arc voltage)
- Efficiency: 80% (transformer welder)
- Power Factor: 0.75 (inductive load)
- Input Power: 5,000W ÷ 0.80 = 6,250W
- Input Current: 6,250W ÷ (240V × 0.75) = 34.7A actual
- Circuit Sizing: 34.7A × 1.25 = 43.4A → 50A breaker
- Wire Size: 6 AWG copper (65A @ 75°C)
- Duty Cycle Factor: Applied to continuous rating only
- Disconnect: 60A non-fused switch (next standard size)`,
    result: '50A circuit, 6 AWG copper',
    dutyCycle: '60% rated (6 min on, 4 min off)',
    application: 'Professional stick welding, structural work',
    cost: '$450-650 installation',
    specialNotes: 'Power factor correction improves efficiency'
  },
  {
    title: 'MIG Welder - Light Industrial (GMAW)',
    scenario: '300A output, 480V 3-phase, 60% duty, inverter-based',
    calculation: `Industrial MIG Welder Analysis:
Output Power: 300A × 28V = 8,400W (typical MIG arc)
Inverter Efficiency: 90% (modern IGBT technology)
Power Factor: 0.95 (inverter with PFC)
3-Phase Input Power: 8,400W ÷ 0.90 = 9,333W
Line Current: 9,333W ÷ (480V × √3 × 0.95) = 11.8A per phase
Circuit Sizing: 11.8A × 1.25 = 14.8A → 20A minimum
Wire Feeding Motor: Additional 5A load
Total Circuit: 20A + 5A = 25A → 30A breaker
Wire Size: 10 AWG copper per phase
Gas Solenoid: Additional 2A (included in 30A)`,
    result: '30A 3-phase, 10 AWG copper',
    dutyCycle: '60% industrial rated',
    application: 'Production MIG welding, manufacturing',
    cost: '$800-1,200 installation',
    specialNotes: 'Modern inverter technology dramatically reduces power requirements'
  },
  {
    title: 'Heavy-Duty Stick Welder - 400A Industrial',
    scenario: '400A output, 480V 3-phase, 100% duty cycle, industrial',
    calculation: `Heavy Industrial Stick Welder:
Maximum Output: 400A × 32V = 12,800W
Continuous Duty: 100% rating required
Transformer Efficiency: 85% (industrial grade)
Power Factor: 0.78 (large transformer)
Input Power: 12,800W ÷ 0.85 = 15,059W
3-Phase Current: 15,059W ÷ (480V × √3 × 0.78) = 23.2A
Continuous Load Factor: 23.2A × 1.25 = 29A
Circuit Size: 30A 3-phase minimum
Wire: 10 AWG copper (30A @ 75°C)
Cooling Fan: Additional 3A motor load
Total Circuit: 35A → 40A breaker recommended`,
    result: '40A 3-phase, 8 AWG copper',
    dutyCycle: '100% continuous duty',
    application: 'Heavy structural welding, shipbuilding',
    cost: '$1,000-1,500 installation',
    specialNotes: 'Continuous duty requires larger circuit sizing'
  },
  {
    title: 'Portable 120V Hobby Welder',
    scenario: '140A output, 120V input, 20% duty cycle, flux-core',
    calculation: `Hobby/Light Duty Welder:
Output Rating: 140A × 20V = 2,800W
Light Duty Cycle: 20% (2 min on, 8 min off)
Inverter Efficiency: 85% (basic inverter)
Power Factor: 0.85 (basic PFC)
Input Power: 2,800W ÷ 0.85 = 3,294W
Input Current: 3,294W ÷ (120V × 0.85) = 32.3A
Circuit Required: 32.3A × 1.25 = 40.4A → 50A
Wire Size: 6 AWG copper (note: 120V limits available)
Recommendation: Upgrade to 240V for better performance
240V Current: 3,294W ÷ (240V × 0.85) = 16.2A
240V Circuit: 16.2A × 1.25 = 20.3A → 25A breaker`,
    result: '25A at 240V preferred (50A at 120V)',
    dutyCycle: '20% hobby rated',
    application: 'Home hobby welding, light repair work',
    cost: '$200-400 installation',
    specialNotes: '240V operation significantly more efficient than 120V'
  },
  {
    title: 'TIG Welder (GTAW) - Precision Applications',
    scenario: '250A output, 240V input, 40% duty, AC/DC capability',
    calculation: `Precision TIG Welder Analysis:
AC/DC Output: 250A × 15V = 3,750W (typical TIG arc)
High-Frequency Start: Additional 200W for HF unit
Total Output Power: 3,950W
Inverter Efficiency: 88% (precision control reduces efficiency)
Power Factor: 0.92 (excellent PFC for TIG quality)
Input Power: 3,950W ÷ 0.88 = 4,489W
Input Current: 4,489W ÷ (240V × 0.92) = 20.3A
Circuit Size: 20.3A × 1.25 = 25.4A → 30A breaker
Wire: 10 AWG copper (30A @ 75°C)
Gas Solenoid: 2A additional load (included)
Water Cooler: If equipped, add 8A for pump`,
    result: '30A circuit, 10 AWG copper',
    dutyCycle: '40% precision rated',
    application: 'Precision welding, aerospace, nuclear',
    cost: '$500-800 installation',
    specialNotes: 'Water-cooled torches require additional circuit for cooler'
  },
  {
    title: 'Plasma Cutter - Heavy Industrial',
    scenario: '100A cut capacity, 480V 3-phase, compressed air',
    calculation: `Industrial Plasma Cutter System:
Cutting Power: 100A × 150V = 15,000W (high voltage arc)
Power Supply Efficiency: 82% (high-frequency switching)
Power Factor: 0.98 (excellent for plasma)
Air Compressor: 5 HP × 746W = 3,730W (integral compressor)
Total System Power: 15,000W ÷ 0.82 + 3,730W = 22,024W
3-Phase Current: 22,024W ÷ (480V × √3 × 0.98) = 27.1A
Circuit Sizing: 27.1A × 1.25 = 33.9A → 40A breaker
Wire Size: 8 AWG copper per phase
Control Circuit: Additional 5A for CNC control
Cooling System: 3A for coolant pump if equipped`,
    result: '40A 3-phase, 8 AWG copper',
    dutyCycle: '100% (cutting applications)',
    application: 'Metal cutting, fabrication, CNC',
    cost: '$1,200-1,800 installation',
    specialNotes: 'Requires compressed air system and proper ventilation'
  }
];

const DETAILED_NEC_REQUIREMENTS = [
  {
    requirement: 'Dedicated Circuits',
    section: '630.11',
    rule: 'Welders require dedicated branch circuits',
    details: 'No other loads permitted on welding machine circuits. Prevents voltage fluctuations affecting other equipment.',
    violation: 'Sharing welder circuit with other loads',
    compliance: 'Install dedicated circuit for each welder'
  },
  {
    requirement: 'Overcurrent Protection',
    section: '630.12',
    rule: 'Circuit breakers sized for primary current',
    details: 'Breaker rating based on primary input current × 125% for continuous loads. Magnetic-only breakers preferred.',
    violation: 'Undersized or thermal-magnetic breakers',
    compliance: 'Size breaker for actual input current with 125% factor'
  },
  {
    requirement: 'Conductor Sizing',
    section: '630.11',
    rule: 'Conductors sized for primary full-load current',
    details: 'Wire ampacity must meet primary FLA. Cannot use welding duty cycle for wire sizing.',
    violation: 'Undersized conductors based on duty cycle',
    compliance: 'Size wire for full primary current rating'
  },
  {
    requirement: 'Disconnect Requirements',
    section: '630.33',
    rule: 'Disconnecting means required within sight',
    details: 'Must be readily accessible, lockable, and rated for welder current. Motor-circuit switch acceptable.',
    violation: 'No disconnect or not within sight of welder',
    compliance: 'Install approved disconnect switch within sight'
  },
  {
    requirement: 'Grounding',
    section: '630.15',
    rule: 'Equipment grounding conductor required',
    details: 'EGC must be included in supply circuit. Work piece grounding separate requirement.',
    violation: 'Missing or inadequate equipment grounding',
    compliance: 'Include properly sized EGC in supply circuit'
  },
  {
    requirement: 'Multiple Welder Installations',
    section: '630.11(B)',
    rule: 'Demand factors may apply to multiple welders',
    details: 'When 3+ welders on same feeder, demand factors can reduce feeder size requirements.',
    violation: 'Not applying allowed demand factors',
    compliance: 'Calculate feeder using NEC Table 630.11(B) demand factors'
  }
];

const WELDER_WIRE_SIZING_TABLE = [
  {
    welderSize: '120V Hobby (up to 140A output)',
    primaryCurrent: '15-35A',
    wireSize: '12-8 AWG',
    breaker: '20-50A',
    receptacle: 'NEMA 5-50 or 6-50',
    typical: 'Home hobby welding',
    notes: '240V preferred for efficiency'
  },
  {
    welderSize: '200A Stick/MIG (240V)',
    primaryCurrent: '25-50A',
    wireSize: '10-6 AWG',
    breaker: '30-60A',
    receptacle: 'NEMA 6-50 or direct wire',
    typical: 'Professional shop work',
    notes: 'Most common size range'
  },
  {
    welderSize: '300A Industrial (240V)',
    primaryCurrent: '50-80A',
    wireSize: '6-4 AWG',
    breaker: '60-100A',
    receptacle: 'Direct wire recommended',
    typical: 'Production welding',
    notes: 'May require 480V for efficiency'
  },
  {
    welderSize: '400A Heavy Duty (480V)',
    primaryCurrent: '30-50A per phase',
    wireSize: '10-6 AWG',
    breaker: '40-60A 3-pole',
    receptacle: '3-phase disconnect',
    typical: 'Heavy structural work',
    notes: '3-phase required above 300A'
  },
  {
    welderSize: '500A+ Industrial (480V)',
    primaryCurrent: '50-100A+ per phase',
    wireSize: '6 AWG - 2/0 AWG',
    breaker: '60-125A+ 3-pole',
    receptacle: 'Hardwired with disconnect',
    typical: 'Shipbuilding, large fabrication',
    notes: 'Custom engineering often required'
  }
];

const POWER_FACTOR_ANALYSIS = [
  {
    welderType: 'Traditional Transformer (SMAW)',
    powerFactor: '0.65-0.75',
    kvaRating: 'High (poor efficiency)',
    currentDraw: 'High reactive current',
    solutions: ['Power factor correction capacitors', 'Upgrade to inverter technology'],
    impact: 'Increases utility costs, larger wire sizes needed'
  },
  {
    welderType: 'Basic Inverter (MIG/TIG)',
    powerFactor: '0.85-0.90',
    kvaRating: 'Moderate',
    currentDraw: 'Reduced reactive current',
    solutions: ['Built-in PFC circuits', 'Modern switching technology'],
    impact: 'Better efficiency, smaller wire sizes'
  },
  {
    welderType: 'Advanced Inverter with PFC',
    powerFactor: '0.95-0.98',
    kvaRating: 'Low (excellent efficiency)',
    currentDraw: 'Minimal reactive current',
    solutions: ['Active power factor correction', 'High-frequency switching'],
    impact: 'Optimal efficiency, minimum installation costs'
  },
  {
    welderType: 'Plasma Cutting Systems',
    powerFactor: '0.92-0.98',
    kvaRating: 'Low to moderate',
    currentDraw: 'Well-controlled reactive current',
    solutions: ['Integrated PFC', 'High-frequency inverters'],
    impact: 'Efficient operation, predictable power draw'
  }
];

const WELDER_COST_ANALYSIS = [
  {
    component: 'Electrical Permit',
    cost: '$50-125',
    notes: 'Required for new circuits over 20A',
    diyPotential: 'Not applicable'
  },
  {
    component: '50A Breaker (240V)',
    cost: '$45-85',
    notes: 'Standard residential welder size',
    diyPotential: 'Electrician installation required'
  },
  {
    component: '6 AWG Wire (50 ft)',
    cost: '$75-120',
    notes: 'THWN-2 copper conductor',
    diyPotential: 'Can purchase, install requires permit'
  },
  {
    component: 'NEMA 6-50R Outlet',
    cost: '$35-60',
    notes: 'Heavy-duty welding receptacle',
    diyPotential: 'DIY-friendly component'
  },
  {
    component: 'Disconnect Switch (60A)',
    cost: '$65-120',
    notes: 'Non-fused safety switch',
    diyPotential: 'Professional installation recommended'
  },
  {
    component: 'Conduit & Fittings',
    cost: '$40-80',
    notes: 'EMT or PVC protection',
    diyPotential: '50% DIY savings possible'
  },
  {
    component: 'Labor - Standard Install',
    cost: '$300-500',
    notes: '4-6 hours professional work',
    diyPotential: 'Major DIY savings'
  },
  {
    component: 'Inspection Fee',
    cost: '$50-100',
    notes: 'Required final inspection',
    diyPotential: 'Required regardless'
  }
];

const TROUBLESHOOTING_GUIDE = [
  {
    problem: 'Welder Trips Breaker Immediately',
    causes: [
      'Breaker undersized for starting current',
      'Short circuit in welder or wiring',
      'Wrong breaker type (thermal vs magnetic)',
      'Poor connection causing arcing'
    ],
    solutions: [
      'Check breaker sizing against welder specs',
      'Test welder on known good circuit',
      'Use magnetic-only or motor-rated breaker',
      'Inspect all connections for tightness'
    ],
    safety: 'Never bypass overcurrent protection - indicates dangerous fault condition'
  },
  {
    problem: 'Poor Arc Starting or Welding Performance',
    causes: [
      'Voltage drop due to undersized wire',
      'Long wire runs without compensation',
      'Poor power quality from utility',
      'Shared circuit with other loads'
    ],
    solutions: [
      'Calculate and verify voltage drop under load',
      'Upgrade to larger wire size',
      'Install dedicated circuit for welder',
      'Check utility voltage during welding'
    ],
    safety: 'Poor performance may indicate electrical supply problems'
  },
  {
    problem: 'Intermittent Operation or Shutdowns',
    causes: [
      'Thermal overload from exceeding duty cycle',
      'Loose connections causing heating',
      'Inadequate ventilation around welder',
      'Input voltage fluctuations'
    ],
    solutions: [
      'Monitor duty cycle and allow cooling periods',
      'Check and tighten all electrical connections',
      'Improve ventilation around equipment',
      'Install voltage monitoring equipment'
    ],
    safety: 'Overheating can cause fires - address immediately'
  },
  {
    problem: 'High Electricity Bills',
    causes: [
      'Poor power factor increasing demand charges',
      'Oversized welder for actual needs',
      'Leaving equipment on when not welding',
      'Inefficient older transformer technology'
    ],
    solutions: [
      'Install power factor correction if needed',
      'Right-size welder to actual usage',
      'Use timers or automatic shutoffs',
      'Consider upgrading to modern inverter welder'
    ],
    safety: 'No safety issues, but economic optimization important'
  }
];

const MAINTENANCE_SCHEDULE = [
  {
    frequency: 'Before Each Use',
    task: 'Visual Inspection of Electrical Connections',
    procedure: 'Check power cord, plug, and welder case for damage',
    importance: 'Prevent electrical hazards',
    diyFriendly: 'Yes - basic safety check'
  },
  {
    frequency: 'Monthly',
    task: 'Test Emergency Stop and Controls',
    procedure: 'Verify all switches and emergency stops function properly',
    importance: 'Ensure safety systems work',
    diyFriendly: 'Yes - operational check only'
  },
  {
    frequency: 'Quarterly',
    task: 'Clean Electrical Enclosures',
    procedure: 'Remove metal dust and debris from welder internals',
    importance: 'Prevent overheating and shorts',
    diyFriendly: 'Caution - power off, some skill required'
  },
  {
    frequency: 'Semi-Annually',
    task: 'Torque Electrical Connections',
    procedure: 'Check tightness of all power connections',
    importance: 'Prevent arcing and overheating',
    diyFriendly: 'Professional recommended'
  },
  {
    frequency: 'Annually',
    task: 'Professional Electrical Inspection',
    procedure: 'Complete system check by qualified technician',
    importance: 'Identify potential problems early',
    diyFriendly: 'No - requires expertise'
  }
];

const ENERGY_EFFICIENCY_ANALYSIS = [
  {
    welderType: 'Old Transformer Welder (1990s)',
    efficiency: '65-75%',
    powerFactor: '0.65',
    monthlyKwh: '800-1200 kWh (heavy use)',
    costPerMonth: '$80-180',
    upgradeRecommendation: 'High priority - major savings available',
    modernEquivalent: 'Modern inverter uses 40% less power'
  },
  {
    welderType: 'Basic Inverter (2000s)',
    efficiency: '80-85%',
    powerFactor: '0.85',
    monthlyKwh: '500-800 kWh (heavy use)',
    costPerMonth: '$50-120',
    upgradeRecommendation: 'Moderate priority - some savings available',
    modernEquivalent: 'Advanced inverter uses 20% less power'
  },
  {
    welderType: 'Modern Inverter with PFC (2010+)',
    efficiency: '90-95%',
    powerFactor: '0.95',
    monthlyKwh: '400-600 kWh (heavy use)',
    costPerMonth: '$40-90',
    upgradeRecommendation: 'Current technology - optimize usage patterns',
    modernEquivalent: 'Already efficient - focus on duty cycle management'
  }
];

const COMPREHENSIVE_FAQS = [
  {
    question: 'What size breaker do I need for a 200 amp welder?',
    answer: 'For a 200A output welder, you need to calculate the primary (input) current, not the output. A typical 200A stick welder draws about 50A primary current at 240V. You would need a 60A breaker (50A × 1.25 = 62.5A, rounded up to next standard size). Always check the welder nameplate for exact primary current requirements.',
    category: 'Circuit Sizing'
  },
  {
    question: 'Can I run a welder on a 30 amp RV outlet?',
    answer: 'Most welders cannot safely operate on a 30A RV outlet. RV outlets are typically 120V/30A, providing only 3,600W maximum power. Even small hobby welders often require 4,000-6,000W. A 50A RV outlet (240V) provides 12,000W and can handle medium-sized welders. Check your welder\'s power requirements against outlet capacity.',
    category: 'Power Requirements'
  },
  {
    question: 'Why does my welder keep tripping the breaker?',
    answer: 'Breaker tripping can be caused by: 1) Undersized breaker for the welder\'s inrush current, 2) Using a thermal breaker instead of magnetic-only, 3) Defective welder with internal short, 4) Loose connections causing arcing. Check the welder nameplate current against breaker size, and ensure you\'re using the correct breaker type for welding loads.',
    category: 'Troubleshooting'
  },
  {
    question: 'Do I need 240V for welding, or can I use 120V?',
    answer: '240V is strongly recommended for welding over 100A output. 120V welders are limited to about 140A maximum and are very inefficient, drawing high current and causing voltage sag. 240V welders draw half the current for the same power, reducing wire size requirements and improving performance. Most professional welders require 240V or 480V three-phase.',
    category: 'Voltage Selection'
  },
  {
    question: 'What\'s the difference between duty cycle ratings?',
    answer: 'Duty cycle indicates how long a welder can operate continuously. 20% = 2 minutes on, 8 minutes off. 60% = 6 minutes on, 4 minutes off. 100% = continuous operation. Higher duty cycles require larger electrical circuits because they represent continuous loads under NEC requirements. A 200A welder at 20% duty draws less average current than the same welder at 60% duty.',
    category: 'Duty Cycle'
  },
  {
    question: 'Can I install welder wiring myself?',
    answer: 'Welder circuit installation typically requires: 1) Electrical permit, 2) Licensed electrician for panel connections, 3) Inspection for final approval. You may be able to run conduit and pull wire in some jurisdictions, but panel work and final connections must be done by licensed professionals. Check local codes - some areas allow homeowner electrical work with permits.',
    category: 'Installation'
  }
];

const PROFESSIONAL_TIPS = [
  {
    category: 'Circuit Design',
    tip: 'Use Magnetic-Only Breakers for Welders',
    detail: 'Welders have high inrush currents that can nuisance-trip thermal breakers. Magnetic-only or motor-circuit breakers handle welder characteristics better.',
    costImpact: '$20-40 more than standard breaker, prevents nuisance tripping'
  },
  {
    category: 'Wire Sizing',
    tip: 'Consider Voltage Drop on Long Runs',
    detail: 'Welders are sensitive to voltage drop. For runs over 50 feet, calculate voltage drop and upsize wire to maintain proper voltage at the welder.',
    costImpact: 'Extra wire cost prevents poor welding performance'
  },
  {
    category: 'Power Quality',
    tip: 'Install Dedicated Transformer for Multiple Welders',
    detail: 'Large welding shops benefit from dedicated transformer to isolate welding loads from sensitive equipment and improve power quality.',
    costImpact: '$2,000-5,000 investment improves overall power quality'
  },
  {
    category: 'Energy Efficiency',
    tip: 'Upgrade to Modern Inverter Technology',
    detail: 'Modern inverter welders use 30-50% less power than old transformer units while providing better arc characteristics and portability.',
    costImpact: 'Equipment upgrade pays for itself through energy savings'
  }
];

export default function WelderCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['welder-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Enhanced Hero Section */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Wrench className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Professional Welder Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-orange-50">
                Comprehensive electrical calculations for welding equipment installations. Professional-grade circuit sizing 
                for stick (SMAW), MIG (GMAW), TIG (GTAW), and plasma cutting systems with NEC compliance guidance.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-orange-100">Welder Types</div>
                  <div className="font-semibold">SMAW, GMAW, GTAW, Plasma</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-orange-100">Duty Cycles</div>
                  <div className="font-semibold">20% to 100%</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-orange-100">Power Systems</div>
                  <div className="font-semibold">120V to 480V 3Φ</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-orange-100">Applications</div>
                  <div className="font-semibold">Hobby to Heavy Industrial</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Safety Information */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-red-900 mb-3">CRITICAL: Welder Electrical Safety - Professional Installation Required</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul className="text-red-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Dedicated Circuits:</strong> Welders require dedicated circuits per NEC 630.11</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Proper Breakers:</strong> Magnetic-only breakers handle high inrush currents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Equipment Grounding:</strong> Proper EGC critical for safety and weld quality</span>
                    </li>
                  </ul>
                  <ul className="text-red-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span><strong>No Shared Circuits:</strong> Never share welding circuits with other loads</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Voltage Drop Kills Performance:</strong> Undersized wire ruins weld quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Power Factor Matters:</strong> Poor PF increases costs and wire sizes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <WelderCalculator />

          {/* Comprehensive Installation Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Professional Welder Installation Examples</h2>
            </div>
            
            <div className="grid gap-8">
              {COMPREHENSIVE_WELDER_EXAMPLES.map((example, idx) => (
                <div key={idx} className="border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{example.title}</h3>
                      <p className="text-orange-700 font-medium mb-2">{example.scenario}</p>
                      <div className="text-sm text-blue-600 mb-2">
                        <span className="font-medium">Application:</span> {example.application}
                      </div>
                      {example.specialNotes && (
                        <div className="text-sm text-purple-600">
                          <span className="font-medium">Pro Tip:</span> {example.specialNotes}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-orange-600">{example.result}</div>
                      <div className="text-sm text-gray-500 font-medium">{example.dutyCycle}</div>
                      <div className="text-sm text-green-600 font-medium">{example.cost}</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-900 mb-2">Detailed Engineering Calculations:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-line font-mono leading-relaxed">{example.calculation}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEC 630 Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">NEC Article 630 - Welding Equipment Requirements</h2>
            </div>
            
            <div className="grid gap-6">
              {DETAILED_NEC_REQUIREMENTS.map((req, idx) => (
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
                      <h4 className="font-medium text-green-900 mb-1">Code Compliance:</h4>
                      <p className="text-sm text-green-800">{req.compliance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wire Sizing Reference Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Welder Wire Sizing Reference Guide</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-yellow-50">
                    <th className="border border-gray-300 px-3 py-3 text-left font-semibold">Welder Size/Type</th>
                    <th className="border border-gray-300 px-3 py-3 text-center font-semibold">Primary Current</th>
                    <th className="border border-gray-300 px-3 py-3 text-center font-semibold">Wire Size</th>
                    <th className="border border-gray-300 px-3 py-3 text-center font-semibold">Breaker Size</th>
                    <th className="border border-gray-300 px-3 py-3 text-center font-semibold">Connection</th>
                    <th className="border border-gray-300 px-3 py-3 text-center font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {WELDER_WIRE_SIZING_TABLE.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-3 font-medium">{row.welderSize}</td>
                      <td className="border border-gray-300 px-3 py-3 text-center font-bold text-yellow-600">{row.primaryCurrent}</td>
                      <td className="border border-gray-300 px-3 py-3 text-center font-bold text-green-600">{row.wireSize}</td>
                      <td className="border border-gray-300 px-3 py-3 text-center font-bold text-red-600">{row.breaker}</td>
                      <td className="border border-gray-300 px-3 py-3 text-center text-sm">{row.receptacle}</td>
                      <td className="border border-gray-300 px-3 py-3 text-center text-sm text-gray-600">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Critical Installation Notes:</h4>
              <ul className="space-y-1">
                <li>• Wire size based on primary (input) current, not welding output current</li>
                <li>• Breaker size includes 125% factor for continuous loads per NEC 630.12</li>
                <li>• Use magnetic-only breakers for welding loads to prevent nuisance tripping</li>
                <li>• Calculate voltage drop for runs over 50 feet - welders sensitive to low voltage</li>
                <li>• All welding circuits require dedicated use - no other loads permitted</li>
              </ul>
            </div>
          </div>

          {/* Power Factor Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Power Factor Impact Analysis</h2>
            </div>
            
            <div className="grid gap-6">
              {POWER_FACTOR_ANALYSIS.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-purple-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-purple-900 text-lg mb-2">{item.welderType}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Power Factor: <span className="font-bold text-purple-600">{item.powerFactor}</span></div>
                          <div className="text-sm text-gray-600">KVA Rating: <span className="font-medium">{item.kvaRating}</span></div>
                          <div className="text-sm text-gray-600">Current Draw: <span className="font-medium">{item.currentDraw}</span></div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Improvement Solutions:</h4>
                          <ul className="text-sm text-gray-700">
                            {item.solutions.map((solution, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-1">
                                <span className="text-purple-500">•</span>
                                {solution}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-3">
                    <h4 className="font-medium text-yellow-900 mb-1">Economic Impact:</h4>
                    <p className="text-sm text-yellow-800">{item.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Installation Cost Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Welder Installation Cost Analysis</h2>
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
                  {WELDER_COST_ANALYSIS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{item.component}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-green-600">{item.cost}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{item.notes}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">{item.diyPotential}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-2">Professional Installation Total</h4>
                <p className="text-2xl font-bold text-blue-600">$660 - $1,200</p>
                <p className="text-sm text-blue-700">Standard 240V/50A welder circuit installed</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-bold text-orange-900 mb-2">Heavy Industrial (480V)</h4>
                <p className="text-2xl font-bold text-orange-600">$1,200 - $2,500</p>
                <p className="text-sm text-orange-700">3-phase installation with disconnect and protection</p>
              </div>
            </div>
          </div>

          {/* Energy Efficiency Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Thermometer className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Welder Energy Efficiency & Operating Costs</h2>
            </div>
            
            <div className="grid gap-6">
              {ENERGY_EFFICIENCY_ANALYSIS.map((welder, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-orange-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-orange-900 text-lg mb-2">{welder.welderType}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Efficiency: <span className="font-bold text-orange-600">{welder.efficiency}</span></div>
                          <div className="text-sm text-gray-600 mb-1">Power Factor: <span className="font-bold text-blue-600">{welder.powerFactor}</span></div>
                          <div className="text-sm text-gray-600">Monthly Usage: <span className="font-medium">{welder.monthlyKwh}</span></div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600">{welder.costPerMonth}</div>
                          <div className="text-sm text-gray-600">Monthly operating cost</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-yellow-100 rounded-lg p-3">
                      <h4 className="font-medium text-yellow-900 mb-1">Upgrade Priority:</h4>
                      <p className="text-sm text-yellow-800">{welder.upgradeRecommendation}</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <h4 className="font-medium text-green-900 mb-1">Modern Equivalent:</h4>
                      <p className="text-sm text-green-800">{welder.modernEquivalent}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Welder Electrical Troubleshooting Guide</h2>
            </div>
            
            <div className="grid gap-6">
              {TROUBLESHOOTING_GUIDE.map((issue, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-blue-50">
                  <h3 className="font-bold text-blue-900 text-lg mb-4">{issue.problem}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Possible Causes:</h4>
                      <ul className="space-y-1">
                        {issue.causes.map((cause, causeIdx) => (
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
                    <h4 className="font-medium text-yellow-900 mb-1">Safety Consideration:</h4>
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
              <h2 className="text-2xl font-bold text-gray-900">Welder Electrical Maintenance Schedule</h2>
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
                    <span className={task.diyFriendly.startsWith('Yes') ? 'text-blue-600' : 'text-red-600'}>
                      <strong>DIY:</strong> {task.diyFriendly}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Professional Welder Installation Tips</h2>
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
                    <span className="font-medium text-green-600">Cost Impact:</span> {tip.costImpact}
                  </div>
                  <div className="mt-2 text-xs bg-purple-100 px-2 py-1 rounded text-purple-800">
                    {tip.category}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comprehensive FAQs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Welder Electrical FAQ - Expert Answers</h2>
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

          {/* Related Industrial Tools */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Industrial & Commercial Calculators</h2>
              <p className="text-gray-600">Professional electrical tools for industrial and commercial installations</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/calculators/three-phase-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow group">
                <Zap className="w-8 h-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 text-sm">3-Phase Power</h3>
                <p className="text-xs text-gray-600">Industrial power calculations</p>
              </Link>
              
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow group">
                <Calculator className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Sizing</h3>
                <p className="text-xs text-gray-600">Calculate AWG requirements</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow group">
                <Target className="w-8 h-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Critical for welders</p>
              </Link>
              
              <Link href="/calculators/ampacity-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow group">
                <Shield className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 text-sm">Ampacity</h3>
                <p className="text-xs text-gray-600">Wire current capacity</p>
              </Link>
              
              <Link href="/calculators/conduit-fill-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow group">
                <Settings className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 text-sm">Conduit Fill</h3>
                <p className="text-xs text-gray-600">Raceway sizing</p>
              </Link>
              
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow group">
                <BookOpen className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service panel sizing</p>
              </Link>
            </div>
          </div>

          {/* External Authority Links */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Welding & Electrical Resources</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Electrical Code Resources:</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">NFPA 70: National Electrical Code</a></li>
                  <li><a href="https://www.neca.org/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">National Electrical Contractors Association</a></li>
                  <li><a href="https://iaei.org/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">International Association of Electrical Inspectors</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Welding Industry Organizations:</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://www.aws.org/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">American Welding Society (AWS)</a></li>
                  <li><a href="https://www.lincolnelectric.com/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">Lincoln Electric - Technical Resources</a></li>
                  <li><a href="https://www.millerwelds.com/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">Miller Electric - Installation Guides</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}