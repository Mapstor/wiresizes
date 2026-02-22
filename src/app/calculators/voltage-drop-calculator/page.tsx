import { Metadata } from 'next';
import { VoltageDropCalculator } from '@/components/calculators/VoltageDropCalculator';
import { 
  AlertTriangle, 
  Calculator, 
  Zap, 
  TrendingDown,
  DollarSign,
  BookOpen,
  Info,
  CheckCircle,
  XCircle,
  ArrowRight,
  Thermometer,
  Activity,
  Settings,
  Gauge,
  Battery,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Voltage Drop Calculator | NEC Compliant Wire Sizing | Calculate Electrical Voltage Loss',
  description: 'Calculate voltage drop in electrical circuits instantly. Free NEC-compliant calculator for copper and aluminum wire. Includes distance calculations, 3% rule compliance, and wire size recommendations. Accurate voltage drop calculations for residential, commercial, and industrial applications.',
  keywords: 'voltage drop calculator, electrical voltage drop, NEC voltage drop, wire voltage loss, voltage drop formula, 3 percent rule, copper wire voltage drop, aluminum wire voltage drop, voltage drop calculation, electrical wire calculator',
};

// Structured data for rich results
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Voltage Drop Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Professional voltage drop calculator for electrical circuits. Calculate voltage loss over distance for copper and aluminum conductors.",
  "featureList": [
    "NEC compliant calculations",
    "Copper and aluminum wire support",
    "Single and three-phase circuits",
    "Automatic wire size recommendations",
    "Distance-based calculations",
    "Real-time results",
    "Temperature compensation",
    "Power factor corrections"
  ]
};

// Real voltage drop scenarios data - expanded
const COMMON_SCENARIOS = [
  { 
    application: "Garage Subpanel", 
    distance: 75, 
    current: 60, 
    voltage: 240, 
    wireSize: "6 AWG",
    copperDrop: "2.8%",
    aluminumDrop: "4.6%",
    recommendation: "Use 4 AWG aluminum or 6 AWG copper",
    notes: "Common for detached garage workshops"
  },
  { 
    application: "Pool Equipment", 
    distance: 100, 
    current: 30, 
    voltage: 240, 
    wireSize: "10 AWG",
    copperDrop: "2.5%",
    aluminumDrop: "4.1%",
    recommendation: "Use 8 AWG aluminum or 10 AWG copper",
    notes: "Includes pump and lighting circuits"
  },
  { 
    application: "Outdoor Lighting", 
    distance: 150, 
    current: 15, 
    voltage: 120, 
    wireSize: "12 AWG",
    copperDrop: "5.8%",
    aluminumDrop: "9.5%",
    recommendation: "Upsize to 8 AWG for this distance",
    notes: "Landscape and security lighting"
  },
  { 
    application: "EV Charger", 
    distance: 50, 
    current: 48, 
    voltage: 240, 
    wireSize: "6 AWG",
    copperDrop: "1.8%",
    aluminumDrop: "3.0%",
    recommendation: "6 AWG copper meets requirements",
    notes: "Level 2 charger at 11.5kW"
  },
  { 
    application: "Shed/Workshop", 
    distance: 100, 
    current: 20, 
    voltage: 120, 
    wireSize: "12 AWG",
    copperDrop: "6.5%",
    aluminumDrop: "10.6%",
    recommendation: "Requires 8 AWG minimum",
    notes: "Power tools and lighting"
  },
  { 
    application: "Hot Tub", 
    distance: 60, 
    current: 40, 
    voltage: 240, 
    wireSize: "8 AWG",
    copperDrop: "2.0%",
    aluminumDrop: "3.2%",
    recommendation: "8 AWG copper is adequate",
    notes: "50A GFCI breaker required"
  },
  { 
    application: "Barn/Agricultural", 
    distance: 200, 
    current: 100, 
    voltage: 240, 
    wireSize: "2 AWG",
    copperDrop: "3.2%",
    aluminumDrop: "5.3%",
    recommendation: "1/0 aluminum or 2 AWG copper",
    notes: "Farm equipment and lighting"
  },
  { 
    application: "RV Pedestal", 
    distance: 80, 
    current: 50, 
    voltage: 240, 
    wireSize: "6 AWG",
    copperDrop: "2.5%",
    aluminumDrop: "4.0%",
    recommendation: "6 AWG copper or 4 AWG aluminum",
    notes: "50A RV service connection"
  },
  { 
    application: "Solar Array", 
    distance: 150, 
    current: 40, 
    voltage: 240, 
    wireSize: "6 AWG",
    copperDrop: "3.7%",
    aluminumDrop: "6.1%",
    recommendation: "4 AWG copper recommended",
    notes: "DC circuits need special consideration"
  },
  { 
    application: "Well Pump", 
    distance: 250, 
    current: 15, 
    voltage: 240, 
    wireSize: "10 AWG",
    copperDrop: "3.9%",
    aluminumDrop: "6.4%",
    recommendation: "8 AWG copper or 6 AWG aluminum",
    notes: "Deep well submersible pump"
  }
];

// Extended wire resistance data with temperature coefficients
const WIRE_RESISTANCE_DATA_EXTENDED = [
  { awg: "18", copperOhms: 7.95, aluminumOhms: 13.1, diameter: 1.02, area: 1620 },
  { awg: "16", copperOhms: 5.00, aluminumOhms: 8.23, diameter: 1.29, area: 2580 },
  { awg: "14", copperOhms: 3.14, aluminumOhms: 5.17, diameter: 1.63, area: 4110 },
  { awg: "12", copperOhms: 1.98, aluminumOhms: 3.25, diameter: 2.05, area: 6530 },
  { awg: "10", copperOhms: 1.24, aluminumOhms: 2.04, diameter: 2.59, area: 10380 },
  { awg: "8", copperOhms: 0.778, aluminumOhms: 1.28, diameter: 3.26, area: 16510 },
  { awg: "6", copperOhms: 0.491, aluminumOhms: 0.808, diameter: 4.12, area: 26240 },
  { awg: "4", copperOhms: 0.308, aluminumOhms: 0.508, diameter: 5.19, area: 41740 },
  { awg: "3", copperOhms: 0.245, aluminumOhms: 0.403, diameter: 5.83, area: 52620 },
  { awg: "2", copperOhms: 0.194, aluminumOhms: 0.319, diameter: 6.54, area: 66360 },
  { awg: "1", copperOhms: 0.154, aluminumOhms: 0.253, diameter: 7.35, area: 83690 },
  { awg: "1/0", copperOhms: 0.122, aluminumOhms: 0.201, diameter: 8.25, area: 105600 },
  { awg: "2/0", copperOhms: 0.0967, aluminumOhms: 0.159, diameter: 9.27, area: 133100 },
  { awg: "3/0", copperOhms: 0.0766, aluminumOhms: 0.126, diameter: 10.4, area: 167800 },
  { awg: "4/0", copperOhms: 0.0608, aluminumOhms: 0.100, diameter: 11.7, area: 211600 },
  { awg: "250", copperOhms: 0.0515, aluminumOhms: 0.0847, diameter: 12.7, area: 250000 },
  { awg: "300", copperOhms: 0.0429, aluminumOhms: 0.0707, diameter: 13.9, area: 300000 },
  { awg: "350", copperOhms: 0.0367, aluminumOhms: 0.0605, diameter: 15.0, area: 350000 },
  { awg: "400", copperOhms: 0.0321, aluminumOhms: 0.0529, diameter: 16.0, area: 400000 },
  { awg: "500", copperOhms: 0.0258, aluminumOhms: 0.0424, diameter: 17.9, area: 500000 }
];

// Motor starting voltage drop considerations
const MOTOR_STARTING_DATA = [
  { hp: "1/2", flc: 4.9, lrc: 29.4, startingDrop: "15-20%" },
  { hp: "3/4", flc: 6.9, lrc: 41.4, startingDrop: "15-20%" },
  { hp: "1", flc: 8, lrc: 48, startingDrop: "15-20%" },
  { hp: "1.5", flc: 10, lrc: 60, startingDrop: "15-20%" },
  { hp: "2", flc: 12, lrc: 72, startingDrop: "15-20%" },
  { hp: "3", flc: 17, lrc: 102, startingDrop: "15-20%" },
  { hp: "5", flc: 28, lrc: 168, startingDrop: "20-25%" },
  { hp: "7.5", flc: 40, lrc: 240, startingDrop: "20-25%" },
  { hp: "10", flc: 50, lrc: 300, startingDrop: "20-25%" }
];

// Distance-based recommendations
const DISTANCE_RECOMMENDATIONS = [
  { range: "0-50 ft", recommendation: "Standard sizing usually adequate", voltageConsideration: "Minimal concern" },
  { range: "50-100 ft", recommendation: "Check voltage drop calculation", voltageConsideration: "May need one size larger" },
  { range: "100-200 ft", recommendation: "Voltage drop often controls", voltageConsideration: "Usually need 1-2 sizes larger" },
  { range: "200-300 ft", recommendation: "Careful calculation required", voltageConsideration: "Consider 240V over 120V" },
  { range: "300+ ft", recommendation: "Consider voltage boosting", voltageConsideration: "May need transformer" }
];

// Temperature correction factors
const TEMPERATURE_CORRECTIONS = [
  { tempC: "10", tempF: "50", copperFactor: 0.97, aluminumFactor: 0.97 },
  { tempC: "20", tempF: "68", copperFactor: 0.99, aluminumFactor: 0.99 },
  { tempC: "25", tempF: "77", copperFactor: 1.00, aluminumFactor: 1.00 },
  { tempC: "30", tempF: "86", copperFactor: 1.01, aluminumFactor: 1.01 },
  { tempC: "40", tempF: "104", copperFactor: 1.04, aluminumFactor: 1.04 },
  { tempC: "50", tempF: "122", copperFactor: 1.06, aluminumFactor: 1.06 },
  { tempC: "60", tempF: "140", copperFactor: 1.08, aluminumFactor: 1.08 },
  { tempC: "75", tempF: "167", copperFactor: 1.12, aluminumFactor: 1.12 }
];

// Voltage drop effects at different percentages
const VOLTAGE_DROP_EFFECTS = [
  { percentage: "1%", effect: "Optimal efficiency", impact: "No noticeable effect on equipment" },
  { percentage: "2%", effect: "Good efficiency", impact: "Slight reduction in motor torque" },
  { percentage: "3%", effect: "Acceptable (NEC recommendation)", impact: "Minor efficiency loss, compliant with standards" },
  { percentage: "4%", effect: "Marginal performance", impact: "Noticeable dimming, motor heating increases" },
  { percentage: "5%", effect: "Poor performance", impact: "Equipment damage risk, significant energy waste" },
  { percentage: "6%", effect: "Unacceptable", impact: "Motors may fail to start, electronics malfunction" },
  { percentage: "8%", effect: "Dangerous", impact: "Fire hazard, immediate correction required" },
  { percentage: "10%", effect: "Critical failure", impact: "Equipment damage likely, code violation" }
];

// Power factor impact on voltage drop
const POWER_FACTOR_IMPACT = [
  { pf: "1.0", type: "Resistive (heaters, incandescent)", multiplier: "1.0", notes: "No reactive component" },
  { pf: "0.95", type: "Electronic loads", multiplier: "1.05", notes: "Computers, LED drivers" },
  { pf: "0.90", type: "Fluorescent lighting", multiplier: "1.11", notes: "Commercial lighting" },
  { pf: "0.85", type: "Small motors", multiplier: "1.18", notes: "Fans, pumps under 5 HP" },
  { pf: "0.80", type: "Large motors", multiplier: "1.25", notes: "Industrial motors" },
  { pf: "0.75", type: "Welders", multiplier: "1.33", notes: "Arc welding equipment" },
  { pf: "0.70", type: "Heavily loaded motors", multiplier: "1.43", notes: "Starting or stalled motors" }
];

// Cost analysis for voltage drop
const VOLTAGE_DROP_COST_ANALYSIS = [
  { drop: "1%", annualLoss120V20A: "$21", annualLoss240V50A: "$131", paybackMonths: "48" },
  { drop: "2%", annualLoss120V20A: "$42", annualLoss240V50A: "$262", paybackMonths: "24" },
  { drop: "3%", annualLoss120V20A: "$63", annualLoss240V50A: "$394", paybackMonths: "16" },
  { drop: "4%", annualLoss120V20A: "$84", annualLoss240V50A: "$525", paybackMonths: "12" },
  { drop: "5%", annualLoss120V20A: "$105", annualLoss240V50A: "$656", paybackMonths: "10" }
];

const faqItems = [
  {
    question: "What is acceptable voltage drop for a 120V circuit?",
    answer: "For a 120V circuit, the NEC recommends maximum 3% voltage drop (3.6V) for branch circuits and 5% total (6V) from service to final outlet. This ensures equipment operates efficiently and prevents premature failure."
  },
  {
    question: "How do you calculate voltage drop for a 100 foot run?",
    answer: "For single-phase: Voltage Drop = (2 × Length × Current × Resistance) ÷ 1000. For a 100ft run at 20A using 12 AWG copper: VD = (2 × 100 × 20 × 1.98) ÷ 1000 = 7.92V or 6.6% at 120V."
  },
  {
    question: "Why is my voltage drop so high with aluminum wire?",
    answer: "Aluminum wire has approximately 61% of the conductivity of copper, meaning it has 64% more resistance. For the same ampacity, aluminum wire must be 1-2 sizes larger than copper to achieve similar voltage drop."
  },
  {
    question: "Does voltage drop affect 240V circuits?",
    answer: "Yes, but the percentage impact is half that of 120V circuits. A 7.2V drop is 6% on a 120V circuit but only 3% on a 240V circuit. This is why 240V is preferred for long-distance, high-current applications."
  },
  {
    question: "What happens if voltage drop exceeds 5%?",
    answer: "Excessive voltage drop causes: dimming lights, motors running hot and inefficiently, reduced equipment lifespan, potential failure to start motors, and increased energy costs. Electronic equipment may malfunction or shut down."
  },
  {
    question: "How much does wire size affect voltage drop?",
    answer: "Each AWG size increase (smaller number) roughly halves the resistance. Upgrading from 12 AWG to 10 AWG reduces voltage drop by about 37%, while going from 10 AWG to 8 AWG reduces it by another 37%."
  },
  {
    question: "Should I calculate voltage drop for LED lighting?",
    answer: "Yes, LED drivers are sensitive to voltage variations. While LEDs use less current than incandescent bulbs, voltage drop still affects driver efficiency and can cause flickering or premature driver failure."
  },
  {
    question: "What's the voltage drop formula for 3-phase circuits?",
    answer: "For 3-phase: VD = (√3 × Length × Current × Resistance) ÷ 1000. The factor is 1.732 instead of 2, making 3-phase more efficient for long-distance power transmission."
  },
  {
    question: "Can I use voltage drop to size my wire?",
    answer: "Voltage drop is one factor in wire sizing. You must also consider ampacity (NEC Table 310.16), overcurrent protection, and grounding requirements. Always use the larger wire size when multiple factors apply."
  },
  {
    question: "Why does distance matter more at 12V than 120V?",
    answer: "The same voltage drop has 10x more impact at 12V. A 1.2V drop is 1% at 120V but 10% at 12V. Low voltage systems require significantly larger conductors to maintain acceptable voltage drop percentages."
  },
  {
    question: "How does temperature affect voltage drop?",
    answer: "Wire resistance increases about 0.4% per degree Celsius above 20°C. In a hot attic (50°C), resistance can be 12% higher than at room temperature, increasing voltage drop proportionally."
  },
  {
    question: "What size wire for 200 amp service 150 feet away?",
    answer: "For 200A service at 150 feet with 3% voltage drop, you need 350 MCM copper or 500 MCM aluminum. This accounts for the 240V service voltage and keeps drop under 7.2V."
  },
  {
    question: "How do I calculate voltage drop for DC circuits?",
    answer: "DC voltage drop uses the same formula as single-phase AC: VD = (2 × L × I × R) ÷ 1000. However, DC circuits don't have power factor considerations, making calculations simpler."
  },
  {
    question: "Does conduit type affect voltage drop?",
    answer: "Conduit type doesn't directly affect resistance, but metal conduit can increase wire temperature, raising resistance. PVC conduit in sunlight can reach 70°C, increasing resistance by 20%."
  },
  {
    question: "What is voltage drop for parallel conductors?",
    answer: "For parallel conductors, divide the resistance by the number of conductors. Two parallel 1/0 AWG conductors have half the resistance of a single 1/0, effectively acting like one 3/0 AWG conductor."
  },
  {
    question: "How do I measure actual voltage drop?",
    answer: "Measure voltage at the panel and at the load while under full current. The difference is your voltage drop. For accuracy, use a true RMS meter and ensure connections are tight."
  },
  {
    question: "Can voltage drop damage motors?",
    answer: "Yes, voltage drop reduces motor torque proportionally to voltage squared. A 10% voltage drop causes 19% torque loss, leading to overheating, increased current draw, and premature failure."
  },
  {
    question: "What's the voltage drop for a 50 amp hot tub 75 feet away?",
    answer: "Using 6 AWG copper at 240V: VD = (2 × 75 × 50 × 0.491) ÷ 1000 = 3.68V or 1.53%. This is well within the 3% recommendation. 8 AWG would give 2.43% drop."
  },
  {
    question: "Should I oversize wire for future loads?",
    answer: "Yes, oversizing by one AWG size typically adds 30-40% to material cost but provides headroom for future loads and reduces energy losses. The payback period is usually 2-4 years from energy savings alone."
  },
  {
    question: "How does voltage drop affect solar panels?",
    answer: "Solar DC circuits are particularly sensitive to voltage drop because MPPT controllers need minimum voltage to operate. Keep DC voltage drop under 2% to maintain optimal power harvest from panels."
  }
];

export default function VoltageDropCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Quick Answer Section - Full Width */}
      <section className="bg-blue-50 border-b border-blue-200">
        <div className="container py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              Voltage Drop Calculator
            </h1>
            <p className="text-lg text-neutral-700 mb-6">
              Calculate electrical voltage drop over distance for any wire size and load. 
              Ensure NEC compliance with the 3% rule for branch circuits and 5% total drop.
            </p>
            
            {/* Quick Answer Box */}
            <div className="bg-white rounded-lg p-6 border border-blue-300 shadow-sm">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="w-full">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Answer: Common Voltage Drop Values</h2>
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-2">12 AWG Copper at 120V, 20A:</h3>
                      <ul className="space-y-1 text-sm text-neutral-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>25 ft = 1.65% drop (excellent)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>50 ft = 3.3% drop (acceptable)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span>75 ft = 4.95% drop (marginal)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span>100 ft = 6.6% drop (too high)</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-2">10 AWG Copper at 240V, 30A:</h3>
                      <ul className="space-y-1 text-sm text-neutral-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>50 ft = 1.55% drop (excellent)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>100 ft = 3.1% drop (acceptable)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span>150 ft = 4.65% drop (marginal)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span>200 ft = 6.2% drop (too high)</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-2">6 AWG Copper at 240V, 50A:</h3>
                      <ul className="space-y-1 text-sm text-neutral-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>50 ft = 1.02% drop (excellent)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>100 ft = 2.05% drop (good)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>150 ft = 3.07% drop (acceptable)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span>200 ft = 4.09% drop (marginal)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Instant recommendation */}
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Rule of Thumb:</strong> For every 50 feet of distance at 120V, expect roughly 1.65% voltage drop per 10 amps on 12 AWG copper. 
                      Double the voltage (240V) cuts the percentage in half. Larger wire significantly reduces drop.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component - Constrained Width */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <VoltageDropCalculator />
          </div>
        </div>
      </section>

      {/* Understanding Voltage Drop Section - Expanded */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Complete Guide to Understanding Voltage Drop
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">What is Voltage Drop?</h3>
                <p className="text-neutral-700 mb-4">
                  Voltage drop is the reduction in voltage that occurs as electricity travels through a conductor. 
                  This loss happens because all conductors have resistance, which opposes the flow of current. 
                  The longer the wire and the higher the current, the more voltage is lost along the way.
                </p>
                
                <div className="bg-white p-6 rounded-lg border border-neutral-200 mb-6">
                  <h4 className="text-lg font-semibold mb-3">The Voltage Drop Formula</h4>
                  <div className="bg-neutral-100 p-4 rounded font-mono text-sm mb-4">
                    <div className="text-center mb-4">
                      <div className="text-lg mb-2">Single-Phase Circuits:</div>
                      <div className="text-blue-600 font-bold text-xl">VD = (2 × L × I × R) ÷ 1000</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <strong>Where:</strong>
                        <ul className="mt-1 space-y-1 text-xs">
                          <li>VD = Voltage drop (volts)</li>
                          <li>L = One-way length (feet)</li>
                        </ul>
                      </div>
                      <div>
                        <ul className="mt-1 space-y-1 text-xs">
                          <li>I = Current (amps)</li>
                          <li>R = Resistance (ohms/1000 ft)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-4">
                    <h5 className="font-semibold text-blue-900 mb-2">Three-Phase Formula:</h5>
                    <div className="font-mono text-blue-600 font-bold text-center mb-2">
                      VD = (1.732 × L × I × R) ÷ 1000
                    </div>
                    <p className="text-sm text-blue-800">
                      The factor 1.732 (√3) replaces 2 because three-phase power is more efficient.
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded border border-amber-200">
                    <p className="text-sm text-amber-900">
                      <strong>Important:</strong> The factor of 2 accounts for both the hot and neutral conductors 
                      in single-phase circuits. Current flows out through the hot and returns through the neutral, 
                      doubling the effective wire length.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Why Voltage Drop Matters</h3>
                
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Effects of Excessive Voltage Drop
                    </h4>
                    <ul className="text-sm space-y-2 text-red-800">
                      <li>• <strong>Motors:</strong> Overheat, reduced torque, premature failure</li>
                      <li>• <strong>Lights:</strong> Dimming, flickering, reduced lifespan</li>
                      <li>• <strong>Electronics:</strong> Malfunction, random resets, data corruption</li>
                      <li>• <strong>Energy waste:</strong> Higher electric bills from I²R losses</li>
                      <li>• <strong>Fire hazard:</strong> Overheated connections and conductors</li>
                      <li>• <strong>Equipment damage:</strong> Compressors, pumps fail to start</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Benefits of Proper Voltage Management
                    </h4>
                    <ul className="text-sm space-y-2 text-green-800">
                      <li>• <strong>Efficiency:</strong> Equipment operates at rated performance</li>
                      <li>• <strong>Longevity:</strong> Extended equipment lifespan</li>
                      <li>• <strong>Savings:</strong> Lower energy consumption</li>
                      <li>• <strong>Reliability:</strong> Stable voltage for sensitive electronics</li>
                      <li>• <strong>Compliance:</strong> Meets NEC and local codes</li>
                      <li>• <strong>Safety:</strong> Reduced fire and equipment hazard</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Voltage Drop vs Equipment Type</h4>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• <strong>Resistive loads (heaters):</strong> Tolerate up to 10%</li>
                      <li>• <strong>Incandescent lights:</strong> 5% causes noticeable dimming</li>
                      <li>• <strong>Motors:</strong> 5% maximum, 3% recommended</li>
                      <li>• <strong>Electronic equipment:</strong> 3% maximum</li>
                      <li>• <strong>LED drivers:</strong> 2-3% for stable operation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Voltage Drop Effects Table */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Voltage Drop Impact Analysis</h3>
              <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200">
                        <th className="px-4 py-3 text-left font-medium text-neutral-700">Voltage Drop %</th>
                        <th className="px-4 py-3 text-left font-medium text-neutral-700">Performance Level</th>
                        <th className="px-4 py-3 text-left font-medium text-neutral-700">Equipment Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {VOLTAGE_DROP_EFFECTS.map((effect, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50">
                          <td className="px-4 py-3 font-mono font-semibold">
                            <span className={
                              parseFloat(effect.percentage) <= 3 ? 'text-green-600' :
                              parseFloat(effect.percentage) <= 5 ? 'text-amber-600' :
                              'text-red-600'
                            }>
                              {effect.percentage}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium">{effect.effect}</td>
                          <td className="px-4 py-3 text-neutral-600">{effect.impact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Common Scenarios Table */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-blue-600" />
              Real-World Voltage Drop Scenarios
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Application</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Distance</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Current</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Voltage</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Copper Drop</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Aluminum Drop</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Recommendation</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {COMMON_SCENARIOS.map((scenario, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 font-medium">{scenario.application}</td>
                        <td className="px-4 py-3">{scenario.distance} ft</td>
                        <td className="px-4 py-3">{scenario.current}A</td>
                        <td className="px-4 py-3">{scenario.voltage}V</td>
                        <td className="px-4 py-3">
                          <span className={`font-mono font-semibold ${parseFloat(scenario.copperDrop) <= 3 ? 'text-green-600' : 'text-amber-600'}`}>
                            {scenario.copperDrop}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-mono font-semibold ${parseFloat(scenario.aluminumDrop) <= 3 ? 'text-green-600' : parseFloat(scenario.aluminumDrop) <= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                            {scenario.aluminumDrop}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-600">{scenario.recommendation}</td>
                        <td className="px-4 py-3 text-xs text-neutral-500">{scenario.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> These calculations assume 75°C rated conductors at 30°C ambient temperature. 
                Actual voltage drop may vary based on installation conditions, conductor temperature, and power factor.
                Always verify with actual measurements after installation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEC Code Requirements - Expanded */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Complete NEC Voltage Drop Requirements & References
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-neutral-900">Branch Circuits</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-mono">
                      Max: 3%
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    Recommended maximum for branch circuits to ensure reasonable efficiency of operation.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <BookOpen className="w-3 h-3" />
                    <span className="font-mono">NEC 210.19(A) Informational Note No. 4</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-neutral-900">Feeders</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-mono">
                      Max: 3%
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    Recommended maximum for feeders where maximum total drop is 5%.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <BookOpen className="w-3 h-3" />
                    <span className="font-mono">NEC 215.2(A) Informational Note No. 2</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-neutral-900">Combined Total</h3>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-mono">
                      Max: 5%
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    Total voltage drop from service point to furthest outlet for feeders and branch circuits combined.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <BookOpen className="w-3 h-3" />
                    <span className="font-mono">NEC 210.19(A) & 215.2(A)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-orange-900">Fire Pumps</h3>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-mono">
                      Max: 15%
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    Maximum allowed voltage drop during motor starting conditions.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <BookOpen className="w-3 h-3" />
                    <span className="font-mono">NEC 695.7</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-red-900">Emergency Systems</h3>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-mono">
                      Max: 5%
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    Mandatory maximum for emergency system feeders.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <BookOpen className="w-3 h-3" />
                    <span className="font-mono">NEC 700.31</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-purple-900">Sensitive Equipment</h3>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-mono">
                      Max: 2%
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    Recommended for sensitive electronic equipment and data centers.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <BookOpen className="w-3 h-3" />
                    <span className="font-mono">IEEE Std 1100 (Emerald Book)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <strong>Important Distinction:</strong> NEC voltage drop values are <em>recommendations</em> (Informational Notes) 
                  except for specific applications like emergency systems (700.31) and fire pumps (695.7) where they are <em>mandatory requirements</em>. 
                  However, many local jurisdictions and engineering specifications enforce the 3%/5% limits as mandatory. 
                  Always verify with your Authority Having Jurisdiction (AHJ) and project specifications.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Wire Resistance Reference */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Complete Wire Resistance Reference Table
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">AWG/MCM</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Copper (Ω/1000ft)</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Aluminum (Ω/1000ft)</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Diameter (mm)</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Area (CM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {WIRE_RESISTANCE_DATA_EXTENDED.map((wire) => (
                      <tr key={wire.awg} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 font-mono font-medium">
                          {wire.awg.includes('/') || parseInt(wire.awg) >= 250 ? wire.awg : `#${wire.awg}`}
                        </td>
                        <td className="px-4 py-3 font-mono text-copper-600">{wire.copperOhms}</td>
                        <td className="px-4 py-3 font-mono text-aluminum-600">{wire.aluminumOhms}</td>
                        <td className="px-4 py-3 font-mono text-neutral-500">{wire.diameter}</td>
                        <td className="px-4 py-3 font-mono text-neutral-500">{wire.area.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Temperature and Power Factor Effects */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Temperature Correction Factors</h3>
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200">
                        <th className="px-3 py-2 text-left">Temp °C</th>
                        <th className="px-3 py-2 text-left">Temp °F</th>
                        <th className="px-3 py-2 text-left">Copper</th>
                        <th className="px-3 py-2 text-left">Aluminum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {TEMPERATURE_CORRECTIONS.map((temp) => (
                        <tr key={temp.tempC} className="hover:bg-neutral-50">
                          <td className="px-3 py-2">{temp.tempC}°C</td>
                          <td className="px-3 py-2">{temp.tempF}°F</td>
                          <td className="px-3 py-2 font-mono">{temp.copperFactor}</td>
                          <td className="px-3 py-2 font-mono">{temp.aluminumFactor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Power Factor Impact</h3>
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200">
                        <th className="px-3 py-2 text-left">PF</th>
                        <th className="px-3 py-2 text-left">Load Type</th>
                        <th className="px-3 py-2 text-left">Multiplier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {POWER_FACTOR_IMPACT.map((pf) => (
                        <tr key={pf.pf} className="hover:bg-neutral-50">
                          <td className="px-3 py-2 font-mono">{pf.pf}</td>
                          <td className="px-3 py-2">{pf.type}</td>
                          <td className="px-3 py-2 font-mono">{pf.multiplier}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motor Starting Considerations */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              Motor Starting & Voltage Drop
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Motor Starting Current Impact</h3>
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200">
                        <th className="px-3 py-2 text-left">HP</th>
                        <th className="px-3 py-2 text-left">FLC (240V)</th>
                        <th className="px-3 py-2 text-left">LRC</th>
                        <th className="px-3 py-2 text-left">Starting Drop</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {MOTOR_STARTING_DATA.map((motor) => (
                        <tr key={motor.hp} className="hover:bg-neutral-50">
                          <td className="px-3 py-2 font-mono">{motor.hp}</td>
                          <td className="px-3 py-2">{motor.flc}A</td>
                          <td className="px-3 py-2">{motor.lrc}A</td>
                          <td className="px-3 py-2 text-amber-600">{motor.startingDrop}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-neutral-600 mt-3">
                  <strong>FLC:</strong> Full Load Current | <strong>LRC:</strong> Locked Rotor Current (starting)
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Motor Voltage Drop Guidelines</h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-neutral-200">
                    <h4 className="font-semibold text-neutral-800 mb-2">Running Conditions</h4>
                    <ul className="text-sm space-y-1 text-neutral-600">
                      <li>• Maximum 3% drop at full load current</li>
                      <li>• 5% drop reduces torque by 10%</li>
                      <li>• 10% drop reduces torque by 19%</li>
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-2">Starting Conditions</h4>
                    <ul className="text-sm space-y-1 text-amber-800">
                      <li>• 15% drop acceptable during start (NEC 695.7)</li>
                      <li>• 20% may prevent motor from starting</li>
                      <li>• Consider soft starters for large motors</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Wire Sizing for Motors</h4>
                    <p className="text-sm text-blue-800">
                      Size conductors for 125% of motor FLC (NEC 430.22), then verify voltage drop 
                      at both running and starting conditions. May need to upsize for long runs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Distance-Based Recommendations */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Gauge className="w-6 h-6 text-blue-600" />
              Distance-Based Wire Sizing Guidelines
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="px-4 py-3 text-left font-medium text-neutral-700">Distance Range</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-700">General Recommendation</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-700">Voltage Consideration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {DISTANCE_RECOMMENDATIONS.map((rec, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 font-semibold">{rec.range}</td>
                      <td className="px-4 py-3">{rec.recommendation}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{rec.voltageConsideration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Short Runs (0-50 ft)</h3>
                <p className="text-sm text-green-800">
                  Ampacity typically controls wire size. Voltage drop rarely an issue unless high current.
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-2">Medium Runs (50-150 ft)</h3>
                <p className="text-sm text-amber-800">
                  Always calculate voltage drop. Often need one size larger than ampacity requires.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-900 mb-2">Long Runs (150+ ft)</h3>
                <p className="text-sm text-red-800">
                  Voltage drop usually controls. Consider 240V circuits or local step-down transformers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Analysis Section */}
      <section className="py-8 bg-green-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Voltage Drop Cost Analysis & ROI
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Annual Energy Loss from Voltage Drop</h3>
                <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-green-50 border-b border-green-200">
                        <th className="px-3 py-2 text-left">Drop %</th>
                        <th className="px-3 py-2 text-left">120V/20A Loss</th>
                        <th className="px-3 py-2 text-left">240V/50A Loss</th>
                        <th className="px-3 py-2 text-left">Payback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {VOLTAGE_DROP_COST_ANALYSIS.map((cost) => (
                        <tr key={cost.drop} className="hover:bg-green-50">
                          <td className="px-3 py-2 font-mono">{cost.drop}</td>
                          <td className="px-3 py-2 text-red-600">{cost.annualLoss120V20A}/yr</td>
                          <td className="px-3 py-2 text-red-600">{cost.annualLoss240V50A}/yr</td>
                          <td className="px-3 py-2 text-green-600">{cost.paybackMonths} mo</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-neutral-600 mt-3">
                  Based on $0.12/kWh, 8 hours/day operation, 365 days/year
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Wire Upgrade Cost vs Benefit</h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-neutral-200">
                    <h4 className="font-semibold text-neutral-800 mb-2">Typical Wire Cost Increases</h4>
                    <ul className="text-sm space-y-1 text-neutral-600">
                      <li>• 12 → 10 AWG: +$0.35/ft (+40%)</li>
                      <li>• 10 → 8 AWG: +$0.90/ft (+75%)</li>
                      <li>• 8 → 6 AWG: +$1.70/ft (+80%)</li>
                      <li>• 6 → 4 AWG: +$2.40/ft (+60%)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">Example ROI Calculation</h4>
                    <p className="text-sm text-green-800">
                      100ft run, 30A @ 240V continuous:<br/>
                      • 10 AWG: 3.1% drop, $130/yr loss<br/>
                      • 8 AWG: 1.9% drop, $80/yr loss<br/>
                      • Upgrade cost: $90 additional<br/>
                      • <strong>Annual savings: $50</strong><br/>
                      • <strong>Payback: 1.8 years</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Hidden Costs of Voltage Drop</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
                <div>
                  <strong>Equipment Life:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Motors: -30% life per 5% drop</li>
                    <li>• LED drivers: -20% life</li>
                    <li>• Compressors: -25% life</li>
                  </ul>
                </div>
                <div>
                  <strong>Productivity:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Slower motor speeds</li>
                    <li>• Dimmer lighting</li>
                    <li>• Equipment malfunctions</li>
                  </ul>
                </div>
                <div>
                  <strong>Maintenance:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• More frequent repairs</li>
                    <li>• Overheated connections</li>
                    <li>• Nuisance trips</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting Section */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              Troubleshooting Voltage Drop Problems
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">Diagnosing Excessive Voltage Drop</h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-neutral-200">
                    <h4 className="font-semibold text-red-600 mb-2">Symptoms to Watch For</h4>
                    <ul className="text-sm space-y-1 text-neutral-700">
                      <li>• Lights dim when motors start</li>
                      <li>• Lights brighten when loads turn off</li>
                      <li>• Motors struggle to start or overheat</li>
                      <li>• Electronic equipment randomly resets</li>
                      <li>• Flickering lights, especially at end of circuit</li>
                      <li>• Circuit breakers trip without overload</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-neutral-200">
                    <h4 className="font-semibold text-blue-600 mb-2">Testing Procedure</h4>
                    <ol className="text-sm space-y-2 text-neutral-700">
                      <li><strong>1.</strong> Measure voltage at panel with no load</li>
                      <li><strong>2.</strong> Apply full rated load to circuit</li>
                      <li><strong>3.</strong> Measure voltage at load while running</li>
                      <li><strong>4.</strong> Calculate: Drop = (V₁ - V₂) ÷ V₁ × 100</li>
                      <li><strong>5.</strong> Check all connections with IR camera</li>
                      <li><strong>6.</strong> Verify wire size matches circuit rating</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">Common Causes & Solutions</h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-neutral-200">
                    <h4 className="font-semibold text-amber-600 mb-2">Poor Connections</h4>
                    <p className="text-sm text-neutral-700 mb-2">
                      <strong>Cause:</strong> Loose terminals, corrosion, improper torque
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Solution:</strong> Retorque all connections to manufacturer specs, 
                      use antioxidant on aluminum, replace corroded terminals
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-neutral-200">
                    <h4 className="font-semibold text-amber-600 mb-2">Undersized Conductors</h4>
                    <p className="text-sm text-neutral-700 mb-2">
                      <strong>Cause:</strong> Wire sized for ampacity only, not distance
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Solution:</strong> Replace with larger wire, add parallel conductor, 
                      or relocate panel closer to load
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-neutral-200">
                    <h4 className="font-semibold text-amber-600 mb-2">Damaged Conductors</h4>
                    <p className="text-sm text-neutral-700 mb-2">
                      <strong>Cause:</strong> Nicked wire, water damage, overheating
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Solution:</strong> Megger test insulation, check for hot spots, 
                      replace damaged sections
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <strong>Safety Warning:</strong> Voltage drop testing requires working on energized circuits. 
                  Only qualified electricians should perform these tests. Use appropriate PPE, lockout/tagout procedures, 
                  and follow NFPA 70E requirements for arc flash protection.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Calculations */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-blue-600" />
              Advanced Voltage Drop Calculations
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Parallel Conductor Calculations</h3>
                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <div className="bg-neutral-100 p-3 rounded font-mono text-sm mb-4">
                    R<sub>parallel</sub> = R<sub>single</sub> ÷ N
                  </div>
                  <p className="text-sm text-neutral-700 mb-3">
                    Where N = number of parallel conductors per phase
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>2 × 1/0 AWG =</span>
                      <span className="font-mono">3/0 AWG equivalent</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2 × 2/0 AWG =</span>
                      <span className="font-mono">4/0 AWG equivalent</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2 × 4/0 AWG =</span>
                      <span className="font-mono">350 MCM equivalent</span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-amber-50 rounded text-xs text-amber-800">
                    <strong>NEC 310.10(G):</strong> Parallel conductors must be same length, material, 
                    size, and termination method. Minimum 1/0 AWG for parallel runs.
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">DC Circuit Calculations</h3>
                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <div className="bg-neutral-100 p-3 rounded font-mono text-sm mb-4">
                    VD<sub>DC</sub> = (2 × L × I × R) ÷ 1000
                  </div>
                  <p className="text-sm text-neutral-700 mb-3">
                    Same as single-phase AC, but no power factor
                  </p>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Solar/Battery Systems</h4>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Keep DC voltage drop under 2%</li>
                      <li>• MPPT controllers need minimum voltage</li>
                      <li>• Battery charging efficiency critical</li>
                      <li>• Consider 48V systems for long runs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold text-neutral-900 mb-3">Voltage Drop with Reactive Loads</h3>
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-2">AC Impedance Formula</h4>
                    <div className="bg-neutral-100 p-3 rounded font-mono text-sm mb-3">
                      Z = √(R² + X²)
                    </div>
                    <p className="text-sm text-neutral-700">
                      Where X = inductive reactance (ohms)<br/>
                      For most building wire: X ≈ 0.05 ohms/1000ft
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-2">Power Factor Correction</h4>
                    <div className="bg-neutral-100 p-3 rounded font-mono text-sm mb-3">
                      VD = VD<sub>calc</sub> × (0.85 + 0.15/PF)
                    </div>
                    <p className="text-sm text-neutral-700">
                      Approximate correction for power factors 0.7 to 1.0
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Best Practices */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              Installation Best Practices to Minimize Voltage Drop
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Design Phase
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Locate panels centrally to minimize runs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Use 240V for high-current or long-distance loads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Consider multiple circuits vs one large feeder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Plan for 20% future load growth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Use voltage drop software for complex systems</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Installation Phase
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Torque all terminals to manufacturer specs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Use compression lugs for large conductors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Apply antioxidant on all aluminum connections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Minimize splices and junction points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Keep conductors away from heat sources</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Verification Phase
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Measure actual voltage at source first</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Test voltage drop under full load conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Document readings for future reference</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>IR scan connections after 30 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Re-torque connections after thermal cycling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Expanded */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              Comprehensive Voltage Drop FAQ
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

      {/* Related Tools & Resources */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Related Calculators & Tools
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <a href="/calculators/wire-size-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Wire Size Calculator</h3>
                <p className="text-sm text-neutral-600">Calculate proper AWG wire size for your electrical load and distance</p>
              </a>
              <a href="/calculators/ampacity-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Ampacity Calculator</h3>
                <p className="text-sm text-neutral-600">Find current carrying capacity with temperature and fill derating</p>
              </a>
              <a href="/calculators/circuit-breaker-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Circuit Breaker Calculator</h3>
                <p className="text-sm text-neutral-600">Size circuit breakers for proper overcurrent protection</p>
              </a>
              <a href="/calculators/three-phase-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Three Phase Calculator</h3>
                <p className="text-sm text-neutral-600">Calculate three-phase power, current, and voltage drop</p>
              </a>
              <a href="/calculators/motor-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Motor Wire Calculator</h3>
                <p className="text-sm text-neutral-600">Size conductors for motor circuits with starting considerations</p>
              </a>
              <a href="/calculators/conduit-fill-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Conduit Fill Calculator</h3>
                <p className="text-sm text-neutral-600">Calculate conduit size for multiple conductors</p>
              </a>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-neutral-900 mb-3">Professional Resources</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">NEC References</h4>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• Article 210 - Branch Circuits</li>
                    <li>• Article 215 - Feeders</li>
                    <li>• Article 220 - Load Calculations</li>
                    <li>• Table 310.16 - Ampacities</li>
                    <li>• Chapter 9, Table 8 - Conductor Properties</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">Industry Standards</h4>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• IEEE Std 141 (Red Book) - Industrial Power</li>
                    <li>• IEEE Std 1100 (Emerald Book) - Sensitive Equipment</li>
                    <li>• NFPA 70E - Electrical Safety</li>
                    <li>• ANSI C84.1 - Voltage Ratings</li>
                    <li>• IEC 60364 - International Standards</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSchema items={faqItems} />
    </>
  );
}