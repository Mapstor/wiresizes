import type { Metadata } from 'next'


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Motor Circuit Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Size motor branch circuits per NEC Article 430 including wire, breaker, and overload.",
  "keywords": "motor circuit, NEC 430, motor protection",
  "url": `https://wiresizes.com/calculators/motor-circuit`,
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
import { MotorCircuitCalculator } from '@/components/calculators/MotorCircuitCalculator'
import { Badge } from '@/components/ui/Badge'
import { FAQSchema } from '@/components/seo/FAQSchema'

export const metadata: Metadata = {
  title: 'Motor Circuit Calculator | NEC 430 Wire Size, Protection & Control',
  description: 'Professional motor circuit calculator per NEC Article 430. Calculate wire size, overload protection, short circuit protection, and control circuit requirements.',
  keywords: 'motor circuit calculator, NEC 430, motor wire size, motor protection, overload protection, short circuit protection, motor control circuit, FLC motor current',
  alternates: {
    canonical: 'https://wiresizes.com/calculators/motor-circuit'
  }
}

const faqs = [
  {
    question: "How do I calculate motor wire size per NEC 430?",
    answer: "Per NEC 430.6, use motor full-load current (FLC) from NEC tables, not nameplate current. Size conductors at 125% of motor FLC per NEC 430.22. For multiple motors, add 125% of largest motor FLC plus 100% of all other motor FLCs."
  },
  {
    question: "What's the difference between overload and short circuit protection?",
    answer: "Overload protection (typically 115-125% of FLC) protects the motor from sustained overcurrent. Short circuit protection (typically 175-300% of FLC) protects against faults and high inrush current during starting."
  },
  {
    question: "Can I use nameplate current instead of NEC table values?",
    answer: "No. NEC 430.6(A) specifically requires using full-load current from NEC tables 430.247-430.250, not nameplate current. Nameplate current may be used only for overload protection sizing per NEC 430.6(A) exception."
  },
  {
    question: "How do I size motor control circuits?",
    answer: "Control circuits must be sized per NEC 430.72. Minimum #14 AWG for most applications, with overcurrent protection not exceeding values in NEC 430.72(B). Consider voltage drop for long control circuit runs."
  },
  {
    question: "What are the different motor starting methods?",
    answer: "Common methods include across-the-line (DOL), reduced voltage (soft start), star-delta, and variable frequency drives (VFD). Each has different current and protection requirements per NEC 430."
  },
  {
    question: "How do I handle multiple motors on one circuit?",
    answer: "For multiple motors, size feeder conductors per NEC 430.24: 125% of largest motor FLC plus 100% of all other motor FLCs. Each motor needs individual overload protection, but short circuit protection can be shared if properly sized."
  }
]

export default function MotorCircuitCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Motor Circuit Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate motor circuit requirements per NEC Article 430. Includes wire sizing, 
              overload protection, short circuit protection, and control circuit design.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="success">NEC Article 430</Badge>
              <Badge variant="info">All Motor Types</Badge>
              <Badge variant="success">Protection Sizing</Badge>
              <Badge variant="info">Control Circuits</Badge>
            </div>
          </div>

          {/* Calculator */}
          <MotorCircuitCalculator />

          {/* Educational Content */}
          <div className="mt-16 space-y-12">
            {/* NEC Article 430 Overview */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-indigo-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">NEC Article 430: Motor Circuit Requirements</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-800">Key Requirements</h3>
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <ul className="space-y-2 text-indigo-800">
                      <li>• <strong>Conductor Sizing:</strong> 125% of motor FLC (NEC 430.22)</li>
                      <li>• <strong>Overload Protection:</strong> 115-125% of motor FLC (NEC 430.32)</li>
                      <li>• <strong>Short Circuit Protection:</strong> Per NEC 430.52 table</li>
                      <li>• <strong>Disconnecting Means:</strong> Within sight of motor (NEC 430.102)</li>
                      <li>• <strong>Control Circuits:</strong> Separate protection required (NEC 430.72)</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-800">Motor Circuit Components</h3>
                  <div className="bg-green-50 rounded-lg p-4">
                    <ul className="space-y-2 text-green-800">
                      <li>• <strong>Branch Circuit:</strong> From panel to motor controller</li>
                      <li>• <strong>Motor Controller:</strong> Contactor or starter</li>
                      <li>• <strong>Overload Relay:</strong> Thermal or electronic protection</li>
                      <li>• <strong>Disconnect Switch:</strong> Motor isolation</li>
                      <li>• <strong>Control Circuit:</strong> Start/stop controls</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                  ⚡ Critical: Use NEC Table Values, Not Nameplate
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-2">Why NEC Tables?</h4>
                    <ul className="text-yellow-800 space-y-1">
                      <li>• Standardized values for consistent application</li>
                      <li>• Account for motor design variations</li>
                      <li>• Ensure adequate conductor capacity</li>
                      <li>• Required by NEC 430.6(A)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-2">Exception for Overloads</h4>
                    <ul className="text-yellow-800 space-y-1">
                      <li>• Overload protection may use nameplate current</li>
                      <li>• Only when specifically permitted</li>
                      <li>• All other calculations use NEC tables</li>
                      <li>• Verify with local inspector</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Motor Types and Applications */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Motor Types and Applications</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Motor Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Voltage</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Starting Current</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Applications</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">NEC Table</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Single-Phase</td>
                      <td className="border border-gray-300 px-4 py-2">115V, 208V, 230V</td>
                      <td className="border border-gray-300 px-4 py-2">6-8 × FLC</td>
                      <td className="border border-gray-300 px-4 py-2">Residential, small commercial</td>
                      <td className="border border-gray-300 px-4 py-2">430.248</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-semibold">3-Phase Induction</td>
                      <td className="border border-gray-300 px-4 py-2">208V, 230V, 460V, 575V</td>
                      <td className="border border-gray-300 px-4 py-2">6-7 × FLC</td>
                      <td className="border border-gray-300 px-4 py-2">Industrial, commercial</td>
                      <td className="border border-gray-300 px-4 py-2">430.250</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Synchronous</td>
                      <td className="border border-gray-300 px-4 py-2">230V, 460V, 575V</td>
                      <td className="border border-gray-300 px-4 py-2">5-6 × FLC</td>
                      <td className="border border-gray-300 px-4 py-2">Large industrial, power factor correction</td>
                      <td className="border border-gray-300 px-4 py-2">430.250</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-semibold">DC Motors</td>
                      <td className="border border-gray-300 px-4 py-2">120V, 240V, 500V</td>
                      <td className="border border-gray-300 px-4 py-2">4-6 × FLC</td>
                      <td className="border border-gray-300 px-4 py-2">Variable speed, precise control</td>
                      <td className="border border-gray-300 px-4 py-2">430.247</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Wound Rotor</td>
                      <td className="border border-gray-300 px-4 py-2">230V, 460V, 575V</td>
                      <td className="border border-gray-300 px-4 py-2">2-4 × FLC</td>
                      <td className="border border-gray-300 px-4 py-2">High starting torque applications</td>
                      <td className="border border-gray-300 px-4 py-2">430.250</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Induction Motors</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Most common motor type</li>
                    <li>• Squirrel cage or wound rotor</li>
                    <li>• High starting current (locked rotor)</li>
                    <li>• Simple, reliable operation</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Synchronous Motors</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Constant speed operation</li>
                    <li>• Power factor correction capability</li>
                    <li>• Lower starting current than induction</li>
                    <li>• Used for large loads (&gt;100 HP)</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">DC Motors</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Excellent speed control</li>
                    <li>• High starting torque</li>
                    <li>• Series, shunt, or compound wound</li>
                    <li>• Being replaced by VFDs + AC motors</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Protection Coordination */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Motor Protection Coordination</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-orange-800 mb-4">Overload Protection</h3>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-900 mb-3">Purpose & Function</h4>
                      <ul className="text-sm text-orange-800 space-y-2">
                        <li>• <strong>Protects motor windings</strong> from overheating due to sustained overload</li>
                        <li>• <strong>Sized 115-125%</strong> of motor nameplate current (or FLC if higher)</li>
                        <li>• <strong>Time delay function</strong> allows for normal starting current</li>
                        <li>• <strong>Temperature compensation</strong> for accurate protection</li>
                      </ul>
                      
                      <h4 className="font-semibold text-orange-900 mb-3 mt-4">Types of Overload Devices</h4>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• <strong>Thermal:</strong> Bimetallic elements, heater coils</li>
                        <li>• <strong>Magnetic:</strong> Current transformers with electronic trip</li>
                        <li>• <strong>Electronic:</strong> Microprocessor-based protection</li>
                        <li>• <strong>Solid state:</strong> Phase loss, phase unbalance protection</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-4">Short Circuit Protection</h3>
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-semibold text-red-900 mb-3">Purpose & Function</h4>
                      <ul className="text-sm text-red-800 space-y-2">
                        <li>• <strong>Protects against faults</strong> and extremely high currents</li>
                        <li>• <strong>Must allow starting current</strong> but clear faults quickly</li>
                        <li>• <strong>Sized per NEC 430.52</strong> table based on motor type</li>
                        <li>• <strong>Instantaneous trip</strong> for fault conditions</li>
                      </ul>
                      
                      <h4 className="font-semibold text-red-900 mb-3 mt-4">Protection Device Types</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• <strong>Fuses:</strong> Time delay, dual element</li>
                        <li>• <strong>Circuit breakers:</strong> Inverse time, instantaneous</li>
                        <li>• <strong>Motor protectors:</strong> Combination devices</li>
                        <li>• <strong>Electronic:</strong> Ground fault, arc fault protection</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">NEC 430.52 Protection Device Sizing</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-3 py-2 text-left">Motor Type</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Nontime Delay Fuse</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Time Delay Fuse</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Instant Trip CB</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Inverse Time CB</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 font-medium">Single-phase</td>
                        <td className="border border-gray-300 px-3 py-2">300%</td>
                        <td className="border border-gray-300 px-3 py-2">175%</td>
                        <td className="border border-gray-300 px-3 py-2">800%</td>
                        <td className="border border-gray-300 px-3 py-2">250%</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">3-phase Induction</td>
                        <td className="border border-gray-300 px-3 py-2">300%</td>
                        <td className="border border-gray-300 px-3 py-2">175%</td>
                        <td className="border border-gray-300 px-3 py-2">800%</td>
                        <td className="border border-gray-300 px-3 py-2">250%</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 font-medium">Synchronous</td>
                        <td className="border border-gray-300 px-3 py-2">300%</td>
                        <td className="border border-gray-300 px-3 py-2">175%</td>
                        <td className="border border-gray-300 px-3 py-2">800%</td>
                        <td className="border border-gray-300 px-3 py-2">250%</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">Wound rotor</td>
                        <td className="border border-gray-300 px-3 py-2">150%</td>
                        <td className="border border-gray-300 px-3 py-2">150%</td>
                        <td className="border border-gray-300 px-3 py-2">800%</td>
                        <td className="border border-gray-300 px-3 py-2">150%</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 font-medium">DC (constant voltage)</td>
                        <td className="border border-gray-300 px-3 py-2">150%</td>
                        <td className="border border-gray-300 px-3 py-2">150%</td>
                        <td className="border border-gray-300 px-3 py-2">250%</td>
                        <td className="border border-gray-300 px-3 py-2">150%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Motor Starting Methods */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-purple-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Motor Starting Methods</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Across-the-Line (DOL) Starting</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Characteristics</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Full voltage applied instantly</li>
                          <li>• Highest starting torque</li>
                          <li>• Highest starting current (6-8 × FLC)</li>
                          <li>• Simplest and most economical</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Applications</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Small to medium motors (&lt;30 HP)</li>
                          <li>• Adequate supply capacity</li>
                          <li>• High starting torque required</li>
                          <li>• Simple operation preferred</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">Soft Start (Reduced Voltage)</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">Characteristics</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Gradual voltage ramp-up</li>
                          <li>• Reduced starting current (3-4 × FLC)</li>
                          <li>• Smooth acceleration</li>
                          <li>• Adjustable ramp time</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">Applications</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Large motors (&gt;30 HP)</li>
                          <li>• Limited supply capacity</li>
                          <li>• Mechanical stress reduction</li>
                          <li>• Pump and fan applications</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">Star-Delta Starting</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-2">Characteristics</h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                          <li>• Start in star, run in delta</li>
                          <li>• Current reduced to 1/3 of DOL</li>
                          <li>• Torque reduced to 1/3 of DOL</li>
                          <li>• Transition switching required</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-2">Applications</h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                          <li>• Large 3-phase motors</li>
                          <li>• Low starting torque loads</li>
                          <li>• Limited electrical supply</li>
                          <li>• International applications</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-orange-800 mb-4">Variable Frequency Drive (VFD)</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-orange-900 mb-2">Characteristics</h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Variable speed control</li>
                          <li>• Controlled starting current</li>
                          <li>• High efficiency operation</li>
                          <li>• Sophisticated control features</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-900 mb-2">Applications</h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Variable speed requirements</li>
                          <li>• Energy efficiency critical</li>
                          <li>• Process control applications</li>
                          <li>• Modern industrial systems</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Control Circuit Design */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-cyan-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Motor Control Circuit Design</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-800 mb-4">Control Circuit Requirements</h3>
                    <div className="bg-cyan-50 rounded-lg p-4">
                      <ul className="space-y-2 text-sm text-cyan-800">
                        <li>• <strong>NEC 430.72:</strong> Control circuit protection requirements</li>
                        <li>• <strong>Minimum #14 AWG:</strong> For most control applications</li>
                        <li>• <strong>Overcurrent Protection:</strong> Per NEC 430.72(B) table</li>
                        <li>• <strong>Class 1 Circuits:</strong> Run separately from power circuits</li>
                        <li>• <strong>Voltage Drop:</strong> Limit to 3% for reliable operation</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Control Voltage Selection</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="space-y-3 text-sm">
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">120V Control</h4>
                          <ul className="text-blue-800 space-y-1">
                            <li>• Most common in North America</li>
                            <li>• Good for moderate distances</li>
                            <li>• Standard pilot devices available</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">24V Control</h4>
                          <ul className="text-blue-800 space-y-1">
                            <li>• Safer for personnel</li>
                            <li>• Better for wet/hazardous locations</li>
                            <li>• Requires control transformer</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">Control Device Types</h3>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="space-y-3 text-sm">
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-1">Manual Controls</h4>
                          <ul className="text-purple-800 space-y-1">
                            <li>• Start/stop pushbuttons</li>
                            <li>• Selector switches</li>
                            <li>• Emergency stops</li>
                            <li>• Hand-off-auto switches</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-1">Automatic Controls</h4>
                          <ul className="text-purple-800 space-y-1">
                            <li>• Pressure switches</li>
                            <li>• Temperature controls</li>
                            <li>• Float switches</li>
                            <li>• Time delays</li>
                            <li>• PLC interfaces</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-4">Safety Considerations</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <ul className="space-y-2 text-sm text-green-800">
                        <li>• <strong>Emergency Stop:</strong> Required per NFPA 79</li>
                        <li>• <strong>Maintained Contact:</strong> Must hold motor in run position</li>
                        <li>• <strong>Control Power:</strong> Fused separately from motor</li>
                        <li>• <strong>Interlocks:</strong> Prevent unsafe operation</li>
                        <li>• <strong>Undervoltage Release:</strong> Stop on power loss</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                  🔴 Control Circuit Protection per NEC 430.72(B)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-red-100">
                        <th className="border border-red-300 px-3 py-2 text-left">Control Circuit Conductor AWG</th>
                        <th className="border border-red-300 px-3 py-2 text-left">Maximum Protection (Amps)</th>
                        <th className="border border-red-300 px-3 py-2 text-left">Typical Application</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-red-300 px-3 py-2 font-medium">#18</td>
                        <td className="border border-red-300 px-3 py-2">7</td>
                        <td className="border border-red-300 px-3 py-2">Pilot devices, short runs</td>
                      </tr>
                      <tr className="bg-red-50">
                        <td className="border border-red-300 px-3 py-2 font-medium">#16</td>
                        <td className="border border-red-300 px-3 py-2">10</td>
                        <td className="border border-red-300 px-3 py-2">Standard control circuits</td>
                      </tr>
                      <tr>
                        <td className="border border-red-300 px-3 py-2 font-medium">#14</td>
                        <td className="border border-red-300 px-3 py-2">15</td>
                        <td className="border border-red-300 px-3 py-2">Most control applications</td>
                      </tr>
                      <tr className="bg-red-50">
                        <td className="border border-red-300 px-3 py-2 font-medium">#12</td>
                        <td className="border border-red-300 px-3 py-2">20</td>
                        <td className="border border-red-300 px-3 py-2">Long runs, multiple devices</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Multiple Motor Installations */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-green-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Multiple Motor Installations</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-4">Feeder Sizing (NEC 430.24)</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-3">Calculation Method</h4>
                      <ol className="space-y-2 text-sm text-green-800">
                        <li><strong>1.</strong> Identify largest motor FLC</li>
                        <li><strong>2.</strong> Multiply largest motor FLC by 125%</li>
                        <li><strong>3.</strong> Add 100% of all other motor FLCs</li>
                        <li><strong>4.</strong> Size feeder conductors for total</li>
                        <li><strong>5.</strong> Apply correction factors if needed</li>
                      </ol>
                      
                      <h4 className="font-semibold text-green-900 mb-2 mt-4">Example Calculation</h4>
                      <div className="text-xs text-green-800 font-mono bg-white rounded p-2">
                        Motors: 50HP (65A), 25HP (34A), 10HP (14A)<br/>
                        Feeder = (65A × 1.25) + 34A + 14A = 129.25A<br/>
                        Use: #1 AWG copper (130A ampacity)
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-orange-800 mb-4">Feeder Protection (NEC 430.62)</h3>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-900 mb-3">Protection Sizing</h4>
                      <ul className="space-y-2 text-sm text-orange-800">
                        <li>• <strong>Start with largest motor:</strong> Use NEC 430.52 percentage</li>
                        <li>• <strong>Add other motors:</strong> 100% of FLC for each</li>
                        <li>• <strong>Next standard size:</strong> Round up to available rating</li>
                        <li>• <strong>Maximum limit:</strong> Must not exceed NEC table values</li>
                      </ul>
                      
                      <h4 className="font-semibold text-orange-900 mb-2 mt-4">Example Protection</h4>
                      <div className="text-xs text-orange-800 font-mono bg-white rounded p-2">
                        Largest: 65A × 175% = 113.75A (time delay fuse)<br/>
                        Others: 34A + 14A = 48A<br/>
                        Total: 113.75A + 48A = 161.75A<br/>
                        Use: 175A time delay fuses
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Motor Control Center (MCC) Design</h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Advantages</h4>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Centralized control</li>
                      <li>• Space efficient</li>
                      <li>• Standardized components</li>
                      <li>• Easy maintenance</li>
                      <li>• Better coordination</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Components</h4>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Motor starters</li>
                      <li>• Feeder breakers</li>
                      <li>• Control power transformers</li>
                      <li>• Metering equipment</li>
                      <li>• Communication modules</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Considerations</h4>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Heat dissipation</li>
                      <li>• Arc flash protection</li>
                      <li>• Maintenance access</li>
                      <li>• Future expansion</li>
                      <li>• Fault coordination</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Troubleshooting Common Issues */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-red-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Troubleshooting Motor Circuit Issues</h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">Problem: Motor Won't Start</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Possible Causes:</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Blown fuses or tripped breaker</li>
                        <li>• Overload relay tripped</li>
                        <li>• Control circuit fault</li>
                        <li>• Low voltage condition</li>
                        <li>• Mechanical binding</li>
                        <li>• Wrong rotation (3-phase)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Troubleshooting Steps:</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Check power supply voltage</li>
                        <li>• Verify control circuit continuity</li>
                        <li>• Test overload relay operation</li>
                        <li>• Measure motor resistance</li>
                        <li>• Check mechanical coupling</li>
                        <li>• Verify phase rotation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4">Problem: Motor Overheating</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">Possible Causes:</h4>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• Overloaded motor</li>
                        <li>• Poor ventilation</li>
                        <li>• Voltage imbalance</li>
                        <li>• Single phasing</li>
                        <li>• High ambient temperature</li>
                        <li>• Worn bearings</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">Corrective Actions:</h4>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• Reduce mechanical load</li>
                        <li>• Improve cooling airflow</li>
                        <li>• Balance three-phase voltages</li>
                        <li>• Check all connections</li>
                        <li>• Provide adequate ventilation</li>
                        <li>• Replace worn components</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Problem: Nuisance Tripping</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Possible Causes:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Overload relay sized too small</li>
                        <li>• High starting current application</li>
                        <li>• Voltage dips during starting</li>
                        <li>• Frequent start/stop cycles</li>
                        <li>• Ambient temperature effects</li>
                        <li>• Improper relay calibration</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Solutions:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Verify overload sizing per NEC</li>
                        <li>• Consider soft starting</li>
                        <li>• Check supply voltage adequacy</li>
                        <li>• Install time delay relays</li>
                        <li>• Compensate for temperature</li>
                        <li>• Recalibrate protection devices</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <FAQSchema items={faqs} />
    </div>
  )
}