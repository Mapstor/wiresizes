import { Metadata } from 'next';
import { AmpacityCalculator } from '@/components/calculators/AmpacityCalculator';
import { 
  AlertTriangle, 
  Calculator, 
  Zap, 
  Thermometer,
  DollarSign,
  BookOpen,
  Info,
  CheckCircle,
  XCircle,
  ArrowRight,
  Gauge,
  AlertCircle,
  Shield,
  Lightbulb,
  Activity
} from 'lucide-react';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Ampacity Calculator | Wire Current Capacity | NEC Table 310.16 Calculator',
  description: 'Calculate wire ampacity with temperature and conduit fill derating factors. Free NEC-compliant ampacity calculator for copper and aluminum conductors at different temperature ratings.',
  keywords: 'ampacity calculator, wire current capacity, NEC table 310.16, conductor ampacity, temperature derating, conduit fill derating, wire amp rating, electrical ampacity',
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Ampacity Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Professional ampacity calculator for electrical conductors. Calculate current carrying capacity with temperature and fill derating per NEC requirements.",
  "featureList": [
    "NEC Table 310.16 ampacity values",
    "Temperature derating calculations",
    "Conduit fill adjustments",
    "Copper and aluminum conductors",
    "60°C, 75°C, and 90°C ratings",
    "Real-time derating calculations",
    "Multiple conductor configurations"
  ]
};

// Ampacity derating scenarios
const DERATING_SCENARIOS = [
  {
    scenario: "Attic wiring in summer",
    ambientTemp: "140°F (60°C)",
    conductors: "3",
    wireType: "12 AWG THHN",
    baseAmpacity: "30A (90°C)",
    tempFactor: "0.58",
    fillFactor: "1.00",
    finalAmpacity: "17.4A",
    notes: "Severe derating in hot attics"
  },
  {
    scenario: "Conduit with 6 circuits",
    ambientTemp: "86°F (30°C)",
    conductors: "12",
    wireType: "10 AWG THHN",
    baseAmpacity: "40A (90°C)",
    tempFactor: "0.94",
    fillFactor: "0.50",
    finalAmpacity: "18.8A",
    notes: "50% derating for 10-20 conductors"
  },
  {
    scenario: "Outdoor conduit in sun",
    ambientTemp: "95°F + 20°F sun",
    conductors: "6",
    wireType: "8 AWG THHN",
    baseAmpacity: "55A (90°C)",
    tempFactor: "0.76",
    fillFactor: "0.80",
    finalAmpacity: "33.4A",
    notes: "Add 20°F for sunlight exposure"
  },
  {
    scenario: "Underground direct burial",
    ambientTemp: "68°F (20°C)",
    conductors: "3",
    wireType: "2 AWG USE",
    baseAmpacity: "130A (90°C)",
    tempFactor: "1.04",
    fillFactor: "1.00",
    finalAmpacity: "135A",
    notes: "Higher ampacity in cool earth"
  },
  {
    scenario: "Industrial high ambient",
    ambientTemp: "104°F (40°C)",
    conductors: "9",
    wireType: "4 AWG THHN",
    baseAmpacity: "95A (90°C)",
    tempFactor: "0.87",
    fillFactor: "0.70",
    finalAmpacity: "57.9A",
    notes: "Multiple derating factors apply"
  }
];

// Conduit fill adjustment factors
const CONDUIT_FILL_FACTORS = [
  { conductors: "3 or less", adjustment: "100%", notes: "No derating required" },
  { conductors: "4-6", adjustment: "80%", notes: "Minimal heat buildup" },
  { conductors: "7-9", adjustment: "70%", notes: "Moderate derating" },
  { conductors: "10-20", adjustment: "50%", notes: "Significant derating" },
  { conductors: "21-30", adjustment: "45%", notes: "Major heat concerns" },
  { conductors: "31-40", adjustment: "40%", notes: "Maximum fill conditions" },
  { conductors: "41+", adjustment: "35%", notes: "Special calculations required" }
];

// Temperature correction factors expanded
const TEMP_CORRECTION_DETAILED = [
  { celsius: "10°C", fahrenheit: "50°F", factor60C: "1.29", factor75C: "1.20", factor90C: "1.15", factor110C: "1.13", factor125C: "1.11", factor150C: "1.10" },
  { celsius: "15°C", fahrenheit: "59°F", factor60C: "1.22", factor75C: "1.15", factor90C: "1.12", factor110C: "1.10", factor125C: "1.09", factor150C: "1.08" },
  { celsius: "20°C", fahrenheit: "68°F", factor60C: "1.15", factor75C: "1.11", factor90C: "1.08", factor110C: "1.07", factor125C: "1.06", factor150C: "1.05" },
  { celsius: "25°C", fahrenheit: "77°F", factor60C: "1.08", factor75C: "1.05", factor90C: "1.04", factor110C: "1.04", factor125C: "1.03", factor150C: "1.03" },
  { celsius: "30°C", fahrenheit: "86°F", factor60C: "1.00", factor75C: "1.00", factor90C: "1.00", factor110C: "1.00", factor125C: "1.00", factor150C: "1.00" },
  { celsius: "35°C", fahrenheit: "95°F", factor60C: "0.91", factor75C: "0.94", factor90C: "0.96", factor110C: "0.97", factor125C: "0.97", factor150C: "0.98" },
  { celsius: "40°C", fahrenheit: "104°F", factor60C: "0.82", factor75C: "0.88", factor90C: "0.91", factor110C: "0.93", factor125C: "0.94", factor150C: "0.95" },
  { celsius: "45°C", fahrenheit: "113°F", factor60C: "0.71", factor75C: "0.82", factor90C: "0.87", factor110C: "0.89", factor125C: "0.91", factor150C: "0.92" },
  { celsius: "50°C", fahrenheit: "122°F", factor60C: "0.58", factor75C: "0.75", factor90C: "0.82", factor110C: "0.86", factor125C: "0.87", factor150C: "0.89" },
  { celsius: "55°C", fahrenheit: "131°F", factor60C: "0.41", factor75C: "0.67", factor90C: "0.76", factor110C: "0.82", factor125C: "0.84", factor150C: "0.86" },
  { celsius: "60°C", fahrenheit: "140°F", factor60C: "—", factor75C: "0.58", factor90C: "0.71", factor110C: "0.77", factor125C: "0.80", factor150C: "0.83" }
];

// Special ampacity conditions
const SPECIAL_CONDITIONS = [
  {
    condition: "Rooftop installations",
    description: "Add temperature adder based on height above roof",
    details: [
      "0-1/2 inch: Add 33°C (60°F)",
      "1/2-3.5 inches: Add 22°C (40°F)",
      "3.5-12 inches: Add 17°C (30°F)",
      "12-36 inches: Add 14°C (25°F)"
    ]
  },
  {
    condition: "Wet locations",
    description: "May require different insulation types",
    details: [
      "THWN/THWN-2 for wet locations",
      "No ampacity reduction for wet-rated",
      "Consider corrosion protection",
      "Verify termination compatibility"
    ]
  },
  {
    condition: "High altitude",
    description: "Derating may be required above 3000 feet",
    details: [
      "Reduced cooling efficiency",
      "Consult manufacturer data",
      "Consider oversizing conductors",
      "Motor loads especially affected"
    ]
  },
  {
    condition: "Harmonic currents",
    description: "Non-linear loads affect neutral sizing",
    details: [
      "Neutral carries harmonic currents",
      "Count neutral as current-carrying",
      "Consider 200% neutral sizing",
      "Common with LED and electronic loads"
    ]
  }
];

// Wire insulation types and ratings
const INSULATION_TYPES = [
  { type: "TW", dryRating: "60°C", wetRating: "60°C", application: "Residential wiring in dry locations", notes: "Older installations" },
  { type: "THW", dryRating: "75°C", wetRating: "75°C", application: "General purpose, wet or dry", notes: "Common in commercial" },
  { type: "THWN", dryRating: "75°C", wetRating: "75°C", application: "Conduit and raceway, wet/dry", notes: "Most common today" },
  { type: "THHN", dryRating: "90°C", wetRating: "—", application: "Dry and damp locations only", notes: "High temperature rating" },
  { type: "THWN-2", dryRating: "90°C", wetRating: "90°C", application: "All locations, high temp", notes: "Dual rated THHN/THWN" },
  { type: "XHHW", dryRating: "90°C", wetRating: "75°C", application: "Industrial, wet/dry locations", notes: "Chemical resistant" },
  { type: "XHHW-2", dryRating: "90°C", wetRating: "90°C", application: "All locations, industrial", notes: "Best for harsh conditions" },
  { type: "USE-2", dryRating: "90°C", wetRating: "90°C", application: "Underground service entrance", notes: "Direct burial rated" }
];

// Common ampacity mistakes
const AMPACITY_MISTAKES = [
  {
    mistake: "Using 90°C ampacity with 75°C terminals",
    consequence: "Overheating at terminations, equipment damage",
    solution: "Always use the lowest temperature rating in the circuit"
  },
  {
    mistake: "Forgetting ambient temperature derating",
    consequence: "Wire insulation breakdown, fire hazard",
    solution: "Apply temperature correction for ambients above 86°F"
  },
  {
    mistake: "Not counting neutral as current-carrying",
    consequence: "Overheating with non-linear loads",
    solution: "Count neutral with unbalanced or harmonic loads"
  },
  {
    mistake: "Ignoring conduit fill derating",
    consequence: "Excessive heat buildup in raceways",
    solution: "Apply Table 310.15(C)(1) for more than 3 conductors"
  },
  {
    mistake: "Using wrong table for cable assemblies",
    consequence: "Incorrect ampacity values",
    solution: "Use 334.80 for NM cable, not Table 310.16"
  },
  {
    mistake: "Not considering continuous loads",
    consequence: "Conductor overheating during extended operation",
    solution: "Apply 125% factor or use 90°C ampacity at 75°C terminals"
  }
];

const faqItems = [
  {
    question: "What is ampacity in electrical terms?",
    answer: "Ampacity is the maximum current in amperes that a conductor can carry continuously under specific conditions without exceeding its temperature rating. It depends on conductor material, insulation type, ambient temperature, and installation method."
  },
  {
    question: "How do I derate wire for temperature?",
    answer: "Multiply the table ampacity by the temperature correction factor. For example, 12 AWG THHN (30A at 90°C) in 104°F ambient: 30A × 0.87 = 26.1A. Always use the correction factor for your wire's temperature rating."
  },
  {
    question: "What's the ampacity of 12 AWG THHN wire?",
    answer: "12 AWG THHN has 30A ampacity at 90°C rating, but when terminated on 75°C devices (standard breakers), you must use 25A from the 75°C column. For 15A or 20A circuits, use the small conductor rule in 240.4(D)."
  },
  {
    question: "How many conductors before derating is required?",
    answer: "More than 3 current-carrying conductors in a raceway or cable require derating per NEC 310.15(C)(1). Equipment grounding conductors don't count. Neutrals may or may not count depending on the load type."
  },
  {
    question: "Does conduit in sunlight require derating?",
    answer: "Yes, add temperature adders per Table 310.15(B)(2)(c): rooftop conduits need 33°F to 60°F added to ambient temperature based on height above roof. This significantly impacts ampacity in hot climates."
  },
  {
    question: "What's the difference between 75°C and 90°C ampacity?",
    answer: "90°C ampacity is about 15-20% higher than 75°C, but you can only use it when all components are 90°C rated. Most devices are 75°C rated, limiting you to 75°C ampacity at terminations even with 90°C wire."
  },
  {
    question: "How do I calculate ampacity for parallel conductors?",
    answer: "Add the ampacities of individual conductors, then apply any derating factors. For example, two parallel 1/0 AWG copper (150A each at 75°C) = 300A total before derating. All parallel conductors must be identical."
  },
  {
    question: "Does wire ampacity change with voltage?",
    answer: "No, ampacity is independent of voltage. A 12 AWG wire has the same 25A ampacity (at 75°C) whether used for 120V or 480V. Voltage affects insulation requirements, not current capacity."
  },
  {
    question: "What is continuous load derating?",
    answer: "Continuous loads (3+ hours) require conductors sized at 125% of the load per NEC 210.19(A). Alternatively, you can use the 90°C ampacity for derating calculations when terminated on 75°C devices."
  },
  {
    question: "How does altitude affect ampacity?",
    answer: "High altitude reduces cooling efficiency. Above 3000 feet, consider derating factors: 3000-5000 ft (0.96), 5000-7000 ft (0.93), 7000-9000 ft (0.90). Consult manufacturer data for specific requirements."
  },
  {
    question: "Can I use NM cable ampacity from Table 310.16?",
    answer: "No, NM (Romex) cable ampacity comes from the 60°C column of Table 310.16 per NEC 334.80, not the 90°C rating of the conductors. This significantly reduces ampacity compared to individual THHN wires."
  },
  {
    question: "How do harmonics affect ampacity?",
    answer: "Harmonic currents from non-linear loads (LED, electronic ballasts) cause neutral current even with balanced phases. Count the neutral as a current-carrying conductor for derating when harmonics exceed 50% of load."
  },
  {
    question: "What's the ampacity of aluminum vs copper?",
    answer: "Aluminum has about 61% of copper's conductivity. For the same ampacity, aluminum wire must be 1-2 sizes larger. Example: 1 AWG aluminum (130A) equals 2 AWG copper (115A) at 75°C."
  },
  {
    question: "Do I derate for conductors in separate conduits?",
    answer: "No, derating only applies to conductors in the same raceway or cable. Conductors in separate conduits dissipate heat independently. However, bundled conduits may require special consideration."
  },
  {
    question: "How does wet location affect ampacity?",
    answer: "Wet location doesn't directly reduce ampacity if using wet-rated insulation (THWN, XHHW). However, the wet rating temperature may be lower (75°C vs 90°C for XHHW), affecting available ampacity."
  },
  {
    question: "What's the 10% rule for ampacity?",
    answer: "NEC 310.15(A)(2) Exception: If the derated ampacity doesn't correspond to a standard overcurrent device rating, you can use the next higher standard size if the load doesn't exceed the derated ampacity."
  },
  {
    question: "Can I use 90°C ampacity for voltage drop?",
    answer: "Yes, you can use 90°C ampacity for voltage drop calculations since this relates to conductor resistance, not termination temperature. This is beneficial for long runs where voltage drop controls sizing."
  },
  {
    question: "How do I size conductors for motor loads?",
    answer: "Use 125% of motor full-load current from NEC tables, not nameplate. Apply this before any derating. For multiple motors, size for 125% of largest plus 100% of others."
  },
  {
    question: "Does burial depth affect underground ampacity?",
    answer: "Yes, Table 310.16 assumes 30-inch burial depth. Shallower burial may require derating due to higher earth temperature. Deeper burial may allow higher ampacity in some conditions."
  },
  {
    question: "What is ampacity correction vs adjustment?",
    answer: "Correction factors apply to ambient temperature (Table 310.15(B)(1)). Adjustment factors apply to number of conductors (Table 310.15(C)(1)). Both multiply together with base ampacity for final value."
  }
];

export default function AmpacityCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Quick Answer Section */}
      <section className="bg-blue-50 border-b border-blue-200">
        <div className="container py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              Wire Ampacity Calculator - Current Carrying Capacity
            </h1>
            <p className="text-lg text-neutral-700 mb-6">
              Calculate the current carrying capacity (ampacity) of electrical wires with temperature and conduit fill derating. 
              NEC Table 310.16 compliant calculations for all conductor types and conditions.
            </p>
            
            {/* Quick Answer Box */}
            <div className="bg-white rounded-lg p-6 border border-blue-300 shadow-sm">
              <div className="flex items-start gap-3">
                <Gauge className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="w-full">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Reference: Common Wire Ampacities at 75°C</h2>
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-2">Copper Wire:</h3>
                      <ul className="space-y-1 text-sm text-neutral-600">
                        <li className="flex justify-between">
                          <span><strong>14 AWG:</strong></span>
                          <span className="font-mono">20A*</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>12 AWG:</strong></span>
                          <span className="font-mono">25A*</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>10 AWG:</strong></span>
                          <span className="font-mono">35A*</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>8 AWG:</strong></span>
                          <span className="font-mono">50A</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>6 AWG:</strong></span>
                          <span className="font-mono">65A</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-2">Aluminum Wire:</h3>
                      <ul className="space-y-1 text-sm text-neutral-600">
                        <li className="flex justify-between">
                          <span><strong>12 AWG:</strong></span>
                          <span className="font-mono">20A*</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>10 AWG:</strong></span>
                          <span className="font-mono">30A*</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>8 AWG:</strong></span>
                          <span className="font-mono">40A</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>6 AWG:</strong></span>
                          <span className="font-mono">50A</span>
                        </li>
                        <li className="flex justify-between">
                          <span><strong>4 AWG:</strong></span>
                          <span className="font-mono">65A</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-2">Key Derating:</h3>
                      <ul className="space-y-1 text-sm text-neutral-600">
                        <li className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-orange-500" />
                          <span>104°F: × 0.88</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-red-500" />
                          <span>122°F: × 0.75</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-500" />
                          <span>4-6 wires: × 0.80</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-purple-500" />
                          <span>7-9 wires: × 0.70</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span>*240.4(D) limits</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Important:</strong> *Small conductor rule (NEC 240.4(D)) limits: 14 AWG to 15A, 12 AWG to 20A, 10 AWG to 30A maximum overcurrent protection regardless of calculated ampacity. 
                      Always apply derating factors for actual conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <AmpacityCalculator />
          </div>
        </div>
      </section>

      {/* Understanding Ampacity Section */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Complete Guide to Wire Ampacity
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Understanding Ampacity</h3>
                <p className="text-neutral-700 mb-4">
                  Ampacity is the maximum current a conductor can carry continuously without damaging its insulation. 
                  This value depends on the conductor material, insulation temperature rating, ambient temperature, 
                  and the number of conductors bundled together. The NEC provides detailed tables and adjustment 
                  factors to ensure safe installations.
                </p>
                
                <div className="bg-white p-6 rounded-lg border border-neutral-200 mb-6">
                  <h4 className="text-lg font-semibold mb-3">Ampacity Calculation Steps</h4>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600">1.</span>
                      <div>
                        <strong>Base Ampacity:</strong> Start with Table 310.16 for the conductor size and temperature rating.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600">2.</span>
                      <div>
                        <strong>Temperature Correction:</strong> Apply factors from Table 310.15(B)(1) for ambient above 86°F.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600">3.</span>
                      <div>
                        <strong>Conductor Adjustment:</strong> Apply Table 310.15(C)(1) for more than 3 conductors.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600">4.</span>
                      <div>
                        <strong>Final Ampacity:</strong> Base × Temperature × Fill = Derated Ampacity.
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Temperature Ratings Explained</h3>
                
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-2">60°C (140°F) Rating</h4>
                    <p className="text-sm text-yellow-800">
                      Older wire types like TW and UF. NM (Romex) cable limited to 60°C ampacity. 
                      Lower ampacity but adequate for most residential branch circuits.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">75°C (167°F) Rating</h4>
                    <p className="text-sm text-blue-800">
                      Standard for most modern installations. THW, THWN, XHHW in wet locations. 
                      Most circuit breakers and equipment rated for 75°C maximum.
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">90°C (194°F) Rating</h4>
                    <p className="text-sm text-red-800">
                      THHN, THWN-2, XHHW-2. Higher ampacity but limited by termination temperature. 
                      Useful for derating calculations starting from higher base.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">The 75°C Rule</h4>
                  <p className="text-sm text-green-800">
                    Even with 90°C rated wire, you must use 75°C ampacity at device terminations unless all components 
                    (breakers, lugs, devices) are rated and listed for 90°C. This is rarely the case in standard installations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Derating Scenarios Table */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-blue-600" />
              Real-World Ampacity Derating Examples
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Scenario</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Temperature</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Conductors</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Wire</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Base</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Temp Factor</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Fill Factor</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Final</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {DERATING_SCENARIOS.map((scenario, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 font-medium">{scenario.scenario}</td>
                        <td className="px-4 py-3 text-xs">{scenario.ambientTemp}</td>
                        <td className="px-4 py-3">{scenario.conductors}</td>
                        <td className="px-4 py-3 font-mono">{scenario.wireType}</td>
                        <td className="px-4 py-3 font-mono">{scenario.baseAmpacity}</td>
                        <td className="px-4 py-3 font-mono text-orange-600">{scenario.tempFactor}</td>
                        <td className="px-4 py-3 font-mono text-purple-600">{scenario.fillFactor}</td>
                        <td className="px-4 py-3 font-mono font-bold text-red-600">{scenario.finalAmpacity}</td>
                        <td className="px-4 py-3 text-xs text-neutral-500">{scenario.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                <strong>Critical:</strong> These examples show how severely ampacity can be reduced. 
                A 12 AWG wire rated for 30A at 90°C can be derated to just 17.4A in a hot attic—below the 20A circuit rating!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Temperature Correction Table */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Thermometer className="w-6 h-6 text-orange-600" />
              Temperature Correction Factors (NEC Table 310.15(B)(1))
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th rowSpan={2} className="px-4 py-3 text-left font-medium text-neutral-700">Ambient Temp</th>
                      <th colSpan={6} className="px-4 py-3 text-center font-medium text-neutral-700 border-l">Correction Factors for Conductor Temperature Rating</th>
                    </tr>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-3 py-2 text-center text-xs border-l">60°C</th>
                      <th className="px-3 py-2 text-center text-xs">75°C</th>
                      <th className="px-3 py-2 text-center text-xs">90°C</th>
                      <th className="px-3 py-2 text-center text-xs">110°C</th>
                      <th className="px-3 py-2 text-center text-xs">125°C</th>
                      <th className="px-3 py-2 text-center text-xs">150°C</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {TEMP_CORRECTION_DETAILED.map((temp) => (
                      <tr key={temp.celsius} className="hover:bg-neutral-50">
                        <td className="px-4 py-2">
                          <span className="font-medium">{temp.fahrenheit}</span>
                          <span className="text-neutral-500 ml-2">({temp.celsius})</span>
                        </td>
                        <td className="px-3 py-2 text-center font-mono border-l">{temp.factor60C}</td>
                        <td className="px-3 py-2 text-center font-mono font-semibold text-blue-600">{temp.factor75C}</td>
                        <td className="px-3 py-2 text-center font-mono">{temp.factor90C}</td>
                        <td className="px-3 py-2 text-center font-mono text-neutral-400">{temp.factor110C}</td>
                        <td className="px-3 py-2 text-center font-mono text-neutral-400">{temp.factor125C}</td>
                        <td className="px-3 py-2 text-center font-mono text-neutral-400">{temp.factor150C}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-900 mb-2">Hot Location Examples</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Attics in summer: 120-140°F</li>
                  <li>• Boiler rooms: 100-120°F</li>
                  <li>• Outdoor desert: 110-125°F</li>
                  <li>• Near heat sources: Add 20-40°F</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Cool Location Benefits</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Underground (68°F): +8% ampacity</li>
                  <li>• Air-conditioned spaces: No derating</li>
                  <li>• Outdoor winter: Potential increase</li>
                  <li>• Water-cooled: Special calculations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conduit Fill Adjustment */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Conduit Fill Adjustment Factors (NEC 310.15(C)(1))
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200">
                        <th className="px-4 py-3 text-left font-medium text-neutral-700">Number of Conductors</th>
                        <th className="px-4 py-3 text-left font-medium text-neutral-700">Adjustment Factor</th>
                        <th className="px-4 py-3 text-left font-medium text-neutral-700">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {CONDUIT_FILL_FACTORS.map((factor, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50">
                          <td className="px-4 py-3 font-medium">{factor.conductors}</td>
                          <td className="px-4 py-3 font-mono font-bold text-purple-600">{factor.adjustment}</td>
                          <td className="px-4 py-3 text-xs text-neutral-500">{factor.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Counting Current-Carrying Conductors</h3>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-1">Don't Count:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Equipment grounding conductors</li>
                      <li>• Neutral in balanced 3-phase</li>
                      <li>• Travelers between 3-way switches</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-1">Must Count:</h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• All ungrounded (hot) conductors</li>
                      <li>• Neutral with unbalanced loads</li>
                      <li>• Neutral with harmonic loads</li>
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <strong>Example:</strong> Six 20A circuits in one conduit = 12 current-carrying conductors 
                      (not counting grounds). Apply 50% derating factor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Conditions */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Special Ampacity Conditions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {SPECIAL_CONDITIONS.map((condition, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 mb-2">{condition.condition}</h3>
                  <p className="text-sm text-neutral-600 mb-3">{condition.description}</p>
                  <ul className="space-y-1">
                    {condition.details.map((detail, i) => (
                      <li key={i} className="text-sm text-neutral-700 flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wire Insulation Types */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Wire Insulation Types and Temperature Ratings
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Dry Rating</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Wet Rating</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Application</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {INSULATION_TYPES.map((type, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 font-mono font-bold">{type.type}</td>
                        <td className="px-4 py-3">{type.dryRating}</td>
                        <td className="px-4 py-3">{type.wetRating}</td>
                        <td className="px-4 py-3 text-sm">{type.application}</td>
                        <td className="px-4 py-3 text-xs text-neutral-500">{type.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Pro Tip:</strong> THWN-2 (dual rated THHN/THWN) is the most versatile choice for modern installations. 
                It provides 90°C dry rating for ampacity calculations and maintains rating in wet locations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-8 bg-red-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Common Ampacity Mistakes to Avoid
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {AMPACITY_MISTAKES.map((mistake, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold text-sm">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 mb-1">{mistake.mistake}</h3>
                      <p className="text-sm text-neutral-700 mb-2">
                        <strong>Consequence:</strong> {mistake.consequence}
                      </p>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-700">
                          <strong>Solution:</strong> {mistake.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Practical Examples */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              Practical Ampacity Examples
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <h3 className="font-semibold text-blue-900 mb-3">Residential Kitchen</h3>
                <p className="text-sm text-neutral-700 mb-3">
                  12 AWG THWN in conduit, 6 circuits (12 conductors), 86°F ambient
                </p>
                <div className="bg-neutral-50 p-3 rounded text-sm font-mono">
                  <div>Base: 30A (90°C)</div>
                  <div>Temp: × 1.00</div>
                  <div>Fill: × 0.50</div>
                  <div className="font-bold text-red-600">Final: 15A</div>
                </div>
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Below 20A breaker rating! Need larger wire or fewer circuits per conduit.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <h3 className="font-semibold text-green-900 mb-3">Underground Feeder</h3>
                <p className="text-sm text-neutral-700 mb-3">
                  2/0 AWG USE-2 direct burial, 3 conductors, 68°F earth
                </p>
                <div className="bg-neutral-50 p-3 rounded text-sm font-mono">
                  <div>Base: 195A (90°C)</div>
                  <div>Temp: × 1.04</div>
                  <div>Fill: × 1.00</div>
                  <div className="font-bold text-green-600">Final: 203A</div>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  ✓ Cool earth increases ampacity above table value.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <h3 className="font-semibold text-orange-900 mb-3">Rooftop Equipment</h3>
                <p className="text-sm text-neutral-700 mb-3">
                  6 AWG THWN in conduit on roof, 3 conductors, 95°F + 33°F adder
                </p>
                <div className="bg-neutral-50 p-3 rounded text-sm font-mono">
                  <div>Base: 75A (90°C)</div>
                  <div>Temp: × 0.67 (128°F)</div>
                  <div>Fill: × 1.00</div>
                  <div className="font-bold text-orange-600">Final: 50A</div>
                </div>
                <p className="text-xs text-orange-600 mt-2">
                  ⚠️ Significant derating on hot roofs. Consider larger wire or different routing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              Ampacity Frequently Asked Questions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 mb-2 flex items-start gap-2">
                    <span className="text-blue-600 flex-shrink-0">Q:</span>
                    {item.question}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed pl-6">
                    <span className="text-green-600 font-semibold">A: </span>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Calculators */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Related Electrical Calculators
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/calculators/wire-size-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Wire Size Calculator</h3>
                <p className="text-sm text-neutral-600">Calculate proper AWG size for your electrical load</p>
              </a>
              <a href="/calculators/voltage-drop-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Voltage Drop Calculator</h3>
                <p className="text-sm text-neutral-600">Calculate voltage loss over distance</p>
              </a>
              <a href="/calculators/conduit-fill-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Conduit Fill Calculator</h3>
                <p className="text-sm text-neutral-600">Determine conduit size for multiple wires</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <FAQSchema items={faqItems} />
    </>
  );
}