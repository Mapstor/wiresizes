import { Metadata } from 'next';
import { WellPumpCalculator } from '@/components/calculators';
import { Droplets, Calculator, AlertTriangle, Settings, Target, BookOpen, Users, Shield, Zap, Wrench, Home, DollarSign, MapPin, Cog, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Well Pump Calculator | Water Pump Electrical Calculator | Submersible Pump Circuit NEC 430',
  description: 'Calculate electrical requirements for well pumps and water systems. Professional pump electrical sizing with motor calculations, control box wiring, pressure switches, and NEC 430 compliance for submersible and jet pumps.',
  keywords: 'well pump calculator, water pump electrical calculator, submersible pump circuit, pump motor sizing, NEC 430, well pump wiring, control box calculator, pressure switch wiring, jet pump electrical',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Well Pump Wire Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Calculate wire size for submersible well pumps based on depth and horsepower.",
  "keywords": "well pump wiring, submersible pump, water pump electrical",
  "url": `https://wiresizes.com/calculators/well-pump-calculator`,
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

const WELL_PUMP_EXAMPLES = [
  {
    title: 'Residential Submersible Well Pump - 1 HP',
    scenario: '1 HP submersible pump, 150ft deep well, 200ft wire run',
    specs: 'Motor: 1 HP, 230V, 8.0A FLA, Single-phase',
    loads: 'Pump Motor: 8.0A, Starting: 48A (6× typical)',
    calculation: 'Single-Phase Well Pump Calculation:\nMotor FLA: 8.0A @ 230V single-phase\nStarting Current: 8.0A × 6 = 48A\nBranch Circuit: 8.0A × 2.5 = 20A minimum\nWire Sizing: 12 AWG minimum (20A)\nVoltage Drop Check: 8.0A × 400ft × 2Ω/1000ft ÷ 230V = 2.8%\nControl Box: Includes starting capacitor and overloads\nDisconnect: 20A switch within sight of control box\nGrounding: Equipment ground + well casing bond',
    result: '20A circuit, 12 AWG wire',
    control: '1 HP single-phase control box',
    cost: '$850 installation + trenching',
    compliance: 'NEC 430.52, 430.102'
  },
  {
    title: 'Deep Well Submersible - 2 HP Three-Phase',
    scenario: '2 HP 3-phase pump, 300ft deep, municipal supply',
    specs: 'Motor: 2 HP, 230V, 6.8A FLA, Three-phase',
    loads: '3-phase motor: 6.8A per phase, Control circuit: 2A',
    calculation: '3-Phase Deep Well System:\nMotor FLA: 6.8A per phase @ 230V\nStarting: Soft start or reduced voltage\nBranch Circuit: 6.8A × 2.5 = 17A → 20A\nWire: 12 AWG per phase + ground\nControl: 3-phase control box with VFD option\nPump Cable: Submersible-rated, 300ft + 50ft\nGrounding: Enhanced for deep well\nDisconnect: 3-pole, 30A rated\nBonding: Well casing per NEC 250.52',
    result: '30A 3-phase, 12 AWG',
    control: '2 HP 3-phase control box',
    cost: '$2,200 + deep well installation',
    compliance: 'NEC 430 motors, 250.52'
  },
  {
    title: 'Shallow Well Jet Pump - 3/4 HP',
    scenario: 'Above-ground jet pump, pressure tank system',
    specs: 'Motor: 3/4 HP, 115/230V, 6.9A FLA @ 230V',
    loads: 'Pump motor: 6.9A @ 230V, Pressure switch',
    calculation: 'Jet Pump Installation:\nMotor: 3/4 HP, 6.9A @ 230V\nStarting: Built-in starting switch\nCircuit: 6.9A × 2.5 = 17.25A → 20A\nWire: 12 AWG copper minimum\nProtection: 20A breaker + overload relay\nPressure Switch: 30/50 PSI typical\nTank: 82 gallon for 3/4 HP pump\nDisconnect: Combination starter preferred\nGFCI: Required if in wet location',
    result: '20A circuit, 12 AWG',
    control: 'Combination starter with overload',
    cost: '$650 pump system installation',
    compliance: 'NEC 430.32 overload protection'
  },
  {
    title: 'Commercial Irrigation - 5 HP',
    scenario: 'Irrigation system, multiple zones, 480V',
    specs: 'Motor: 5 HP, 480V, 7.6A FLA, Three-phase',
    loads: 'Main pump: 7.6A, Control system: 5A, Valves: 8A',
    calculation: 'Commercial Irrigation System:\nPump Motor: 5 HP = 7.6A @ 480V 3-phase\nControl Loads: 13A additional @ 120V\nMain Circuit: 7.6A × 2.5 = 19A → 25A\nControl Circuit: 20A for valves/controllers\nWire: 12 AWG for motor, 12 AWG for controls\nVFD: Variable speed for pressure control\nMulti-zone: Separate valve circuits\nLightning: Surge protection recommended\nGrounding: Agricultural enhanced grounding',
    result: '25A motor + 20A controls',
    control: 'VFD with irrigation controller',
    cost: '$4,500 complete irrigation electrical',
    compliance: 'NEC 430, 680 fountains'
  },
  {
    title: 'Municipal Water System - 25 HP',
    scenario: 'City water supply, backup pumps, SCADA',
    specs: 'Primary: 25 HP, Backup: 15 HP, 480V 3-phase',
    loads: 'Primary pump: 32A, Backup: 21A, Controls: 15A',
    calculation: 'Municipal Water Plant:\nPrimary Pump: 25 HP = 32A @ 480V\nBackup Pump: 15 HP = 21A @ 480V\nControl Systems: SCADA, telemetry = 15A\nService: 125A main with automatic transfer\nPump Circuits: 50A primary, 35A backup\nSoft Starters: Reduce starting current\nRedundancy: Dual power feeds\nMonitoring: Remote SCADA integration\nEmergency: Generator backup connection',
    result: '125A service, dual pumps',
    control: 'SCADA with soft starters',
    cost: '$25,000 complete system',
    compliance: 'NEC 430 + municipal codes'
  },
  {
    title: 'Agricultural Well System - 10 HP',
    scenario: 'Farm irrigation, pivot system, solar ready',
    specs: 'Motor: 10 HP, 230V, 50A FLA, Single-phase',
    loads: 'Pump: 50A, Pivot controls: 20A, Monitoring: 5A',
    calculation: 'Agricultural Well Pump:\nMotor: 10 HP single-phase = 50A @ 230V\nHigh starting current: 300A locked rotor\nSoft Start: Highly recommended\nService: 100A main panel at well site\nFeeder: From main farm panel, 2 AWG\nPivot Controls: Separate 30A circuit\nSolar Ready: Conduit and space for future\nLightning: Enhanced protection for open area\nGrounding: Agricultural grounding practices\nWeather: NEMA 3R enclosures minimum',
    result: '100A service, 2 AWG feeder',
    control: 'Soft start + irrigation controls',
    cost: '$8,500 farm well electrical',
    compliance: 'NEC 547 agricultural'
  }
];

const PUMP_TYPES_GUIDE = [
  {
    type: 'Submersible (1/2 - 3 HP)',
    application: 'Deep wells, residential',
    voltage: '230V single/3-phase',
    typical_fla: '2.5 - 9.6A',
    wire_requirements: 'Submersible pump cable',
    special_notes: 'Wet location rated, sealed motor'
  },
  {
    type: 'Jet Pump (1/3 - 1.5 HP)',
    application: 'Shallow wells, above ground',
    voltage: '115V or 230V',
    typical_fla: '3.2 - 12A',
    wire_requirements: 'Standard building wire',
    special_notes: 'Self-priming, pressure tank required'
  },
  {
    type: 'Centrifugal (2 - 50 HP)',
    application: 'Commercial, irrigation',
    voltage: '230V/480V 3-phase',
    typical_fla: '6.8 - 65A',
    wire_requirements: 'Motor feeder cable',
    special_notes: 'High flow, constant speed'
  },
  {
    type: 'Turbine (5 - 100+ HP)',
    application: 'Municipal, industrial',
    voltage: '480V 3-phase',
    typical_fla: '7.6 - 124A',
    wire_requirements: 'Heavy motor feeders',
    special_notes: 'High head, multiple stages'
  }
];

const MOTOR_PROTECTION = [
  {
    protection_type: 'Overload Protection',
    requirement: 'Required per NEC 430.32',
    typical_setting: '115-125% of FLA',
    devices: 'Thermal overload relays, electronic',
    installation: 'In control box or motor starter'
  },
  {
    protection_type: 'Short Circuit Protection',
    requirement: 'Required per NEC 430.52',
    typical_setting: 'Per NEC table (300-1700% FLA)',
    devices: 'Fuses, circuit breakers',
    installation: 'At panelboard or disconnect'
  },
  {
    protection_type: 'Ground Fault Protection',
    requirement: 'Required for personnel safety',
    typical_setting: '30mA for personnel, 1200mA equipment',
    devices: 'GFCI, ground fault relays',
    installation: 'Control circuits, wet locations'
  },
  {
    protection_type: 'Phase Protection',
    requirement: 'Recommended for 3-phase',
    typical_setting: 'Voltage/current monitoring',
    devices: 'Phase monitoring relays',
    installation: 'Control panel monitoring'
  },
  {
    protection_type: 'Lightning Protection',
    requirement: 'Recommended for wells',
    typical_setting: 'Surge protective devices',
    devices: 'SPDs, lightning arresters',
    installation: 'Service entrance, well head'
  }
];

const CONTROL_SYSTEMS = [
  {
    system: 'Pressure Switch Control',
    application: 'Basic residential systems',
    components: 'Pressure switch, tank, contacts',
    pressure_range: '20/40, 30/50, 40/60 PSI',
    advantages: 'Simple, reliable, low cost',
    limitations: 'Fixed pressure, frequent cycling'
  },
  {
    system: 'Pressure Tank System',
    application: 'Standard residential/commercial',
    components: 'Diaphragm tank, switch, gauge',
    pressure_range: 'Customizable based on tank',
    advantages: 'Reduced cycling, steady pressure',
    limitations: 'Tank maintenance, space required'
  },
  {
    system: 'Variable Frequency Drive (VFD)',
    application: 'Constant pressure systems',
    components: 'VFD, pressure transducer, controller',
    pressure_range: 'Fully adjustable, constant',
    advantages: 'Energy savings, constant pressure',
    limitations: 'Higher cost, complexity'
  },
  {
    system: 'Soft Start Control',
    application: 'Large motors, voltage sensitive',
    components: 'Soft starter, bypass contactor',
    pressure_range: 'Works with other controls',
    advantages: 'Reduced starting current, smooth start',
    limitations: 'Additional cost, maintenance'
  },
  {
    system: 'SCADA/Remote Control',
    application: 'Municipal, commercial systems',
    components: 'PLCs, communication, sensors',
    pressure_range: 'Fully programmable',
    advantages: 'Remote monitoring, data logging',
    limitations: 'High cost, technical expertise'
  }
];

const WIRE_SIZING_CHART = [
  {
    motor_hp: '1/3 HP (230V)',
    fla: '3.2A',
    circuit_breaker: '15A',
    wire_size: '14 AWG',
    conduit: '1/2"',
    max_run_100ft: '150ft @ 3% drop'
  },
  {
    motor_hp: '1/2 HP (230V)',
    fla: '4.9A',
    circuit_breaker: '15A',
    wire_size: '14 AWG',
    conduit: '1/2"',
    max_run_100ft: '100ft @ 3% drop'
  },
  {
    motor_hp: '3/4 HP (230V)',
    fla: '6.9A',
    circuit_breaker: '20A',
    wire_size: '12 AWG',
    conduit: '1/2"',
    max_run_100ft: '140ft @ 3% drop'
  },
  {
    motor_hp: '1 HP (230V)',
    fla: '8.0A',
    circuit_breaker: '20A',
    wire_size: '12 AWG',
    conduit: '1/2"',
    max_run_100ft: '120ft @ 3% drop'
  },
  {
    motor_hp: '1.5 HP (230V)',
    fla: '12.0A',
    circuit_breaker: '25A',
    wire_size: '10 AWG',
    conduit: '3/4"',
    max_run_100ft: '160ft @ 3% drop'
  },
  {
    motor_hp: '2 HP (230V 3φ)',
    fla: '6.8A',
    circuit_breaker: '25A',
    wire_size: '12 AWG',
    conduit: '3/4"',
    max_run_100ft: '170ft @ 3% drop'
  },
  {
    motor_hp: '3 HP (230V 3φ)',
    fla: '9.6A',
    circuit_breaker: '30A',
    wire_size: '10 AWG',
    conduit: '3/4"',
    max_run_100ft: '200ft @ 3% drop'
  },
  {
    motor_hp: '5 HP (230V 3φ)',
    fla: '15.2A',
    circuit_breaker: '40A',
    wire_size: '8 AWG',
    conduit: '1"',
    max_run_100ft: '250ft @ 3% drop'
  }
];

const INSTALLATION_COSTS = [
  {
    component: 'Submersible Pump Installation (1 HP)',
    range: '$800-$1,200',
    factors: 'Well depth, access, pump cost'
  },
  {
    component: 'Control Box (1 HP single-phase)',
    range: '$150-$300',
    factors: 'Brand, features, warranty'
  },
  {
    component: 'Electrical Service to Well',
    range: '$600-$1,500',
    factors: 'Distance, trenching, permits'
  },
  {
    component: 'Pressure Tank System (82 gallon)',
    range: '$300-$600',
    factors: 'Tank size, installation complexity'
  },
  {
    component: 'VFD Control System',
    range: '$800-$1,500',
    factors: 'HP rating, features, installation'
  },
  {
    component: 'Complete Well System (1 HP)',
    range: '$2,500-$4,500',
    factors: 'All components, professional installation'
  }
];

const TROUBLESHOOTING_GUIDE = [
  {
    problem: 'Pump won\'t start',
    causes: 'No power, bad pressure switch, overload trip',
    diagnosis: 'Check voltage, test switch, reset overloads',
    solution: 'Restore power, replace switch, check motor'
  },
  {
    problem: 'Pump runs continuously',
    causes: 'Leak in system, bad foot valve, low water',
    diagnosis: 'Check pressure, inspect valves, water level',
    solution: 'Repair leaks, replace valve, lower pump'
  },
  {
    problem: 'Low water pressure',
    causes: 'Clogged strainer, worn pump, pressure tank',
    diagnosis: 'Check strainer, pump performance, tank',
    solution: 'Clean strainer, rebuild pump, replace tank'
  },
  {
    problem: 'Pump cycles frequently',
    causes: 'Small pressure tank, bad tank, leak',
    diagnosis: 'Check tank precharge, inspect for leaks',
    solution: 'Recharge tank, replace bladder, fix leaks'
  },
  {
    problem: 'High electrical consumption',
    causes: 'Worn pump, voltage issues, mechanical binding',
    diagnosis: 'Amp readings, voltage check, pump inspection',
    solution: 'Replace pump, fix voltage, clear binding'
  },
  {
    problem: 'Breaker trips frequently',
    causes: 'Overload, short circuit, ground fault',
    diagnosis: 'Amp measurement, insulation testing',
    solution: 'Reduce load, repair wiring, replace pump'
  }
];

const REGIONAL_CONSIDERATIONS = [
  {
    region: 'Northern Climate Areas',
    challenges: 'Freeze protection, deep frost line',
    requirements: 'Heated well houses, below frost burial',
    solutions: 'Insulated enclosures, heat trace, deep trenches'
  },
  {
    region: 'Desert/Arid Regions',
    challenges: 'Deep wells, high temperatures, dust',
    requirements: 'High-temperature wire, dust protection',
    solutions: 'Heat-resistant materials, sealed enclosures'
  },
  {
    region: 'Coastal Areas',
    challenges: 'Salt air corrosion, high humidity',
    requirements: 'Corrosion-resistant materials',
    solutions: 'Stainless steel, sealed enclosures, coatings'
  },
  {
    region: 'Lightning-Prone Areas',
    challenges: 'Lightning strikes, power surges',
    requirements: 'Enhanced lightning protection',
    solutions: 'SPDs, bonding, shielded cables'
  },
  {
    region: 'Agricultural Areas',
    challenges: 'Chemicals, dust, irrigation schedules',
    requirements: 'Chemical-resistant materials',
    solutions: 'Sealed enclosures, remote controls, timers'
  }
];

const MAINTENANCE_SCHEDULE = [
  {
    interval: 'Monthly',
    task: 'Pressure gauge check',
    details: 'Verify system pressure, check for leaks',
    skill_level: 'Homeowner'
  },
  {
    interval: 'Quarterly',
    task: 'Pressure tank inspection',
    details: 'Check air pressure, tank condition',
    skill_level: 'Homeowner'
  },
  {
    interval: 'Annually',
    task: 'Control box inspection',
    details: 'Check connections, clean contacts',
    skill_level: 'Electrician'
  },
  {
    interval: 'Every 2 Years',
    task: 'Pump performance test',
    details: 'Flow rate, pressure, amp draw testing',
    skill_level: 'Professional'
  },
  {
    interval: 'Every 5 Years',
    task: 'Complete system inspection',
    details: 'Full electrical and mechanical check',
    skill_level: 'Professional'
  },
  {
    interval: 'As Needed',
    task: 'Well rehabilitation',
    details: 'Cleaning, pump replacement, repairs',
    skill_level: 'Well contractor'
  }
];

const COMPREHENSIVE_FAQS = [
  {
    question: 'What size circuit breaker do I need for a 1 HP well pump?',
    answer: 'A 1 HP single-phase pump typically draws 8 amps and requires a 20-amp circuit breaker. The motor also needs overload protection rated at 115-125% of full load amperage (9.2-10 amps) which is usually built into the control box. Always verify the actual nameplate amperage of your specific pump.'
  },
  {
    question: 'Can I use regular wire for a submersible pump installation?',
    answer: 'No, submersible pumps require special pump cable rated for wet locations and direct burial. This cable typically has heavier insulation and is designed to withstand constant moisture. Standard building wire like THWN is not suitable for submersible applications.'
  },
  {
    question: 'How deep can I install a submersible pump?',
    answer: 'Most residential submersible pumps can be installed up to 300-400 feet deep, though this varies by pump type and manufacturer. The main limitations are wire length/voltage drop and pump cable availability. For very deep wells, you may need larger wire sizes or higher voltage pumps.'
  },
  {
    question: 'What is the difference between a control box and a motor starter?',
    answer: 'A control box is specifically designed for well pumps and includes starting capacitors (for single-phase) and overload protection. A motor starter is more general-purpose and may require additional components. Control boxes are preferred for well pump installations as they provide complete protection.'
  },
  {
    question: 'Do I need a pressure tank with a VFD system?',
    answer: 'While not strictly required, a small pressure tank (even 2-5 gallons) is recommended with VFD systems to prevent rapid cycling from minor leaks and provide a small reserve. The tank prevents the VFD from starting for very small water demands like toilet fill valves.'
  },
  {
    question: 'What permits are required for well pump electrical work?',
    answer: 'Most jurisdictions require electrical permits for new well pump installations or major repairs. The work typically requires inspection to verify proper grounding, overcurrent protection, and compliance with NEC Article 430. Some areas also require well permits through health departments.'
  }
];

export default function WellPumpCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['pool-pump-calculator']} 
        
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
                <Droplets className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Well Pump Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-blue-50">
                Calculate electrical requirements for well pumps, water systems, and submersible pump installations. 
                Professional pump electrical sizing with NEC Article 430 compliance, control box calculations, and system design.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-blue-100">NEC Article 430</div>
                  <div className="font-semibold">Motor Protection</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-blue-100">Pump Types</div>
                  <div className="font-semibold">Submersible, Jet, Centrifugal</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-blue-100">Power Range</div>
                  <div className="font-semibold">1/3 HP - 100+ HP</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-blue-100">Control Systems</div>
                  <div className="font-semibold">Switch, VFD, SCADA</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Critical Safety Information */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Well Pump Safety Requirements</h2>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Use proper grounding for all water pump circuits per NEC 250</li>
                  <li>• Submersible pumps require wet location rated pump cable</li>
                  <li>• Control box and disconnect must be readily accessible per NEC 430.102</li>
                  <li>• Motor overload protection required per NEC 430.32</li>
                  <li>• Professional installation recommended for deep wells and large pumps</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <WellPumpCalculator />

          {/* Comprehensive Installation Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Well Pump Installation Examples</h2>
            </div>
            
            <div className="grid gap-8">
              {WELL_PUMP_EXAMPLES.map((example, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{example.title}</h3>
                      <p className="text-blue-700 font-medium mb-2">{example.scenario}</p>
                      <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Specifications:</span> {example.specs}</p>
                      <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Load Analysis:</span> {example.loads}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{example.result}</div>
                      <div className="text-sm text-gray-500 mb-1">{example.control}</div>
                      <div className="text-sm text-orange-600 mb-1">{example.cost}</div>
                      <div className="text-xs text-green-600">{example.compliance}</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">NEC 430 Motor Calculation:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-line font-mono">{example.calculation}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pump Types Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Pump Types & Applications</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Pump Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Application</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Voltage</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Typical FLA</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Wire Requirements</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Special Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {PUMP_TYPES_GUIDE.map((pump, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-purple-600">{pump.type}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{pump.application}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{pump.voltage}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-green-600">{pump.typical_fla}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{pump.wire_requirements}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{pump.special_notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Motor Protection Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">NEC Motor Protection Requirements</h2>
            </div>
            
            <div className="space-y-6">
              {MOTOR_PROTECTION.map((protection, idx) => (
                <div key={idx} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{protection.protection_type}</h3>
                    <span className="text-xs bg-red-100 px-2 py-1 rounded font-medium">{protection.requirement}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Setting:</span> {protection.typical_setting}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Devices:</span> {protection.devices}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600"><span className="font-medium">Installation:</span> {protection.installation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Control Systems */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Pump Control Systems</h2>
            </div>
            
            <div className="space-y-6">
              {CONTROL_SYSTEMS.map((system, idx) => (
                <div key={idx} className="border-l-4 border-green-500 bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{system.system}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Application:</span> {system.application}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Components:</span> {system.components}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Pressure Range:</span> {system.pressure_range}</p>
                      <p className="text-sm text-green-700"><span className="font-medium">Advantages:</span> {system.advantages}</p>
                    </div>
                    <div>
                      <p className="text-sm text-orange-700"><span className="font-medium">Limitations:</span> {system.limitations}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wire Sizing Chart */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Well Pump Wire Sizing Chart</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-yellow-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Motor HP/Voltage</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">FLA</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Circuit Breaker</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Wire Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Conduit</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Max Distance*</th>
                  </tr>
                </thead>
                <tbody>
                  {WIRE_SIZING_CHART.map((wire, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-yellow-600">{wire.motor_hp}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-blue-600">{wire.fla}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-red-600">{wire.circuit_breaker}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold">{wire.wire_size}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{wire.conduit}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm text-green-600">{wire.max_run_100ft}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">* Maximum distance for 3% voltage drop at full load</p>
          </div>

          {/* Installation Costs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Well Pump Installation Costs</h2>
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
                <span className="font-medium">Note:</span> Costs vary significantly by location, well depth, and site conditions. 
                Professional installation ensures code compliance and warranty coverage.
              </p>
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Well Pump Troubleshooting Guide</h2>
            </div>
            
            <div className="space-y-6">
              {TROUBLESHOOTING_GUIDE.map((issue, idx) => (
                <div key={idx} className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{issue.problem}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Common Causes:</h4>
                      <p className="text-sm text-gray-600">{issue.causes}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Diagnosis:</h4>
                      <p className="text-sm text-gray-600">{issue.diagnosis}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Solution:</h4>
                      <p className="text-sm text-gray-600">{issue.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Considerations */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Regional Installation Considerations</h2>
            </div>
            
            <div className="space-y-6">
              {REGIONAL_CONSIDERATIONS.map((region, idx) => (
                <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">{region.region}</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-purple-800 mb-1">Challenges:</h4>
                      <p className="text-sm text-gray-600">{region.challenges}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800 mb-1">Requirements:</h4>
                      <p className="text-sm text-gray-600">{region.requirements}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800 mb-1">Solutions:</h4>
                      <p className="text-sm text-gray-600">{region.solutions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Schedule */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Well Pump Maintenance Schedule</h2>
            </div>
            
            <div className="space-y-4">
              {MAINTENANCE_SCHEDULE.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="w-20 text-sm font-medium text-orange-600 flex-shrink-0">{item.interval}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{item.task}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                    <span className={`text-xs px-2 py-1 rounded ${item.skill_level === 'Homeowner' ? 'bg-green-100 text-green-800' : item.skill_level === 'Electrician' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                      {item.skill_level}
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
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Water System Calculators</h2>
              <p className="text-gray-600">Complete your water system electrical design</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Size Calculator</h3>
                <p className="text-xs text-gray-600">Calculate proper AWG</p>
              </Link>
              
              <Link href="/calculators/three-phase-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Target className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">3-Phase Calculator</h3>
                <p className="text-xs text-gray-600">Large pump systems</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Long wire runs</p>
              </Link>
              
              <Link href="/calculators/ampacity-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Ampacity</h3>
                <p className="text-xs text-gray-600">Wire capacity</p>
              </Link>
              
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service sizing</p>
              </Link>
              
              <Link href="/calculators/conduit-fill-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Settings className="w-8 h-8 text-teal-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Conduit Fill</h3>
                <p className="text-xs text-gray-600">Raceway sizing</p>
              </Link>
              
              <Link href="/calculators/garage-subpanel-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Home className="w-8 h-8 text-emerald-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Subpanel</h3>
                <p className="text-xs text-gray-600">Outbuilding service</p>
              </Link>
              
              <Link href="/calculators/rv-hookup-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Cog className="w-8 h-8 text-indigo-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">RV Hookup</h3>
                <p className="text-xs text-gray-600">RV electrical service</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}