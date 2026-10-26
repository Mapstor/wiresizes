import { Metadata } from 'next';
import { VoltageDropCalculator } from '@/components/calculators/VoltageDropCalculator';
import { Calculator, Zap, BookOpen, Info, CheckCircle, XCircle, ArrowRight, Settings, Gauge, Battery, Lightbulb } from 'lucide-react';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { formatVdPct, voltageDrop } from '@/lib/calculations/voltage-drop';

export const metadata: Metadata = {
  title: 'Voltage Drop Calculator',
  description: 'Single- and three-phase voltage drop per wire size and distance. Copper and aluminum at 75°C.',
  keywords: 'voltage drop calculator, electrical voltage drop, NEC voltage drop, wire voltage loss, voltage drop formula, copper wire voltage drop, aluminum wire voltage drop, voltage drop calculation, electrical wire calculator',
  alternates: { canonical: '/calculators/voltage-drop-calculator' },
};

// Web application data for schema
const webAppData = {
  name: "Voltage Drop Calculator",
  url: "https://wiresizes.com/calculators/voltage-drop-calculator",
  description: "Calculate voltage drop in electrical circuits instantly. Free calculator for copper and aluminum wire. Includes distance calculations."
};

// Quick answer: single-phase drop of solid copper at 75 °C from voltage-drop.ts, the calculator's own numbers
const QUICK_ANSWER_CIRCUITS = [
  { title: '12 AWG Copper at 120V, 20A:', size: '12', volts: 120, amps: 20, lengthsFt: [25, 50, 75, 100] },
  { title: '10 AWG Copper at 240V, 30A:', size: '10', volts: 240, amps: 30, lengthsFt: [50, 100, 150, 200] },
  { title: '6 AWG Copper at 240V, 50A:', size: '6', volts: 240, amps: 50, lengthsFt: [50, 100, 150, 200] },
].map((circuit) => ({
  title: circuit.title,
  rows: circuit.lengthsFt.map((lengthFt) => {
    const result = voltageDrop({ size: circuit.size, material: 'Cu', amps: circuit.amps, lengthFt, volts: circuit.volts, phase: 'single' });
    if (!result) throw new Error(`No voltage drop for ${circuit.size} AWG copper`);
    return { lengthFt, pct: formatVdPct(result.vdPct) };
  }),
}));

const faqItems = [
  {
    question: "How do you calculate voltage drop for a 100 foot run?",
    answer: "For single-phase: Voltage Drop = (2 × Length × Current × Resistance) ÷ 1000."
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
    question: "Should I calculate voltage drop for LED lighting?",
    answer: "Yes, LED drivers are sensitive to voltage variations. While LEDs use less current than incandescent bulbs, voltage drop still affects driver efficiency and can cause flickering or premature driver failure."
  },
  {
    question: "What's the voltage drop formula for 3-phase circuits?",
    answer: "For 3-phase: VD = (√3 × Length × Current × Resistance) ÷ 1000. The factor is 1.732 instead of 2."
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
    question: "How do I calculate voltage drop for DC circuits?",
    answer: "DC voltage drop uses the same formula as single-phase AC: VD = (2 × L × I × R) ÷ 1000. However, DC circuits don't have power factor considerations, making calculations simpler."
  },
  {
    question: "What is voltage drop for parallel conductors?",
    answer: "For parallel conductors, divide the resistance by the number of conductors. Two parallel 1/0 AWG conductors have half the resistance of a single 1/0."
  },
  {
    question: "How do I measure actual voltage drop?",
    answer: "Measure voltage at the panel and at the load while under full current. The difference is your voltage drop. For accuracy, use a true RMS meter and ensure connections are tight."
  },
  {
    question: "How does voltage drop affect solar panels?",
    answer: "Solar DC circuits are particularly sensitive to voltage drop because MPPT controllers need minimum voltage to operate."
  }
];

export default function VoltageDropCalculatorPage() {
  return (
    <>
      {/* Quick Answer Section - Full Width */}
      <section className="bg-blue-50 border-b border-blue-200">
        <div className="container py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              Voltage Drop Calculator
            </h1>
            <p className="text-lg text-neutral-700 mb-6">
              Calculate voltage drop in volts and percent for any conductor
              run. Single-phase formula VD = (2 &times; L &times; I &times; R) &divide; 1000;
              three-phase formula VD = (1.732 &times; L &times; I &times; R) &divide; 1000.
            </p>
            
            {/* Quick Answer Box */}
            <div className="bg-white rounded-lg p-6 border border-blue-300 shadow-sm">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="w-full">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Answer: Common Voltage Drop Values</h2>
                  <div className="grid lg:grid-cols-3 gap-6">
                    {QUICK_ANSWER_CIRCUITS.map((circuit) => (
                      <div key={circuit.title}>
                        <h3 className="font-semibold text-neutral-800 mb-2">{circuit.title}</h3>
                        <ul className="space-y-1 text-sm text-neutral-600">
                          {circuit.rows.map((row) => (
                            <li key={row.lengthFt} className="flex items-center gap-2">
                              <span>{row.lengthFt} ft = {row.pct} drop</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-neutral-600">
                    Solid copper at 75 °C, calculated from NIST Handbook 100 constants, as in the calculator. Stranded
                    conductors measure slightly higher.
                  </p>
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
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded border border-amber-200">
                    <p className="text-sm text-amber-900">
                      <strong>Important:</strong> The factor of 2 counts both conductors of a single-phase or DC circuit:
                      current goes out on one and returns on the other.
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
                      <li>• <strong>Reliability:</strong> Stable voltage for sensitive electronics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wire resistance: see the wire resistance calculator */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <p className="text-neutral-700">
              The{' '}
              <a href="/calculators/wire-resistance-calculator" className="text-blue-600 hover:underline">
                wire resistance calculator
              </a>{' '}
              lists the resistance of each size and the basis of each column.
            </p>
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
                      replace corroded terminals
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
                  <p className="text-sm text-neutral-700">
                    Where N = number of parallel conductors per phase
                  </p>
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
                <h4 className="font-semibold text-neutral-800 mb-2">AC Impedance Formula</h4>
                <div className="bg-neutral-100 p-3 rounded font-mono text-sm mb-3">
                  Z = √(R² + X²)
                </div>
                <p className="text-sm text-neutral-700">
                  Where X = inductive reactance (ohms)
                </p>
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
              <a href="/calculators/three-phase-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Three Phase Calculator</h3>
                <p className="text-sm text-neutral-600">Calculate three-phase power and current</p>
              </a>
            </div>
            
          </div>
        </div>
      </section>

      <CombinedSchema webApp={webAppData} />
    </>
  );
}