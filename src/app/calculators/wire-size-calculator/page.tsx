import { Metadata } from 'next';
import { WireSizeCalculator } from '@/components/calculators/WireSizeCalculator';
import { AlertTriangle, Calculator, Zap, BookOpen, Info, CheckCircle, ArrowRight, Gauge, AlertCircle, Shield, Lightbulb, Wrench } from 'lucide-react';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { Sources } from '@/components/content/Sources';
import { AMBIENT_ROWS, ambientLabel, DOMAINS as AMPACITY_DOMAINS } from '@/lib/calculations/ampacity';
import { DOMAINS as SIZING_DOMAINS } from '@/lib/calculations/conductor-sizing';
import { DOMAINS as VOLTAGE_DROP_DOMAINS } from '@/lib/calculations/voltage-drop';
import { TABLE_310_16_ROWS } from '@/lib/verified/nec-310-16';

// Sources: the domains of the engines this page uses. nec-110-14c (the 110.14(C) termination rules) stays off the
// page until WSZ-009 adds the termination inputs: its attribution prints "110.14(C)", which check-structure 7 fails.
const SOURCE_DOMAINS = [...SIZING_DOMAINS, ...VOLTAGE_DROP_DOMAINS, ...AMPACITY_DOMAINS].filter((domain) => domain !== 'nec-110-14c');

export const metadata: Metadata = {
  title: 'Wire Size Calculator — AWG / NEC 310.16',
  description: 'Copper and aluminum wire size for a 15–400 A breaker or fuse from the 60 °C column of NEC Table 310.16, limited by 240.4(D), with the ground wire and a voltage-drop check.',
  keywords: 'wire size calculator, AWG calculator, electrical wire sizing, cable size calculator, conductor sizing, NEC wire size, copper wire calculator, aluminum wire calculator',
  alternates: { canonical: '/calculators/wire-size-calculator' },
  openGraph: {
    title: 'Wire Size Calculator — AWG / NEC 310.16',
    description: 'Copper and aluminum wire size for a 15–400 A breaker or fuse from the 60 °C column of NEC Table 310.16, limited by 240.4(D), with the ground wire and a voltage-drop check.',
    url: 'https://wiresizes.com/calculators/wire-size-calculator',
    siteName: 'WireSizes.com',
    locale: 'en_US',
    type: 'website',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wire Size Calculator — AWG / NEC 310.16',
    description: 'Copper and aluminum wire size for a 15–400 A breaker or fuse from the 60 °C column of NEC Table 310.16, limited by 240.4(D), with the ground wire and a voltage-drop check.',
    images: ['/twitter-image'],
  },
};

// Web application data for schema
const webAppData = {
  name: "Wire Size Calculator - AWG Electrical Wire Sizing",
  url: "https://wiresizes.com/calculators/wire-size-calculator",
  description: "Calculate the correct AWG wire size for any electrical circuit. Free wire size calculator for copper and aluminum conductors. Includes voltage drop, ampacity, and distance calculations."
};

// Wire ampacity table — NEC Table 310.16 (src/lib/verified/nec-310-16.ts). Limited to
// 14 AWG through 4/0 since this calculator is for branch / feeder
// circuits typical in residential and small-commercial work.
const WIRE_AMPACITY_TABLE = TABLE_310_16_ROWS
  .filter((row) => /^(14|12|10|8|6|4|3|2|1|[1234]\/0)$/.test(row.size))
  .map((row) => ({
    awg: row.size,
    copper60C: row.cu_60,
    copper75C: row.cu_75,
    copper90C: row.cu_90,
    aluminum60C: row.al_60 ?? '—',
    aluminum75C: row.al_75 ?? '—',
    aluminum90C: row.al_90 ?? '—',
  }));

// Common mistakes in wire sizing
const COMMON_MISTAKES = [
  {
    mistake: "Ignoring voltage drop for long runs",
    consequence: "Equipment malfunction, dimming lights, motor failure",
    solution: "Always calculate voltage drop"
  },
  {
    mistake: "Mixing copper and aluminum connections",
    consequence: "Corrosion, high resistance, connection failure",
    solution: "Use proper connectors rated for both materials"
  },
  {
    mistake: "Undersizing neutral in multi-wire circuits",
    consequence: "Neutral overload with non-linear loads",
    solution: "Size neutral for maximum unbalanced load"
  },
  {
    mistake: "Forgetting derating for bundled conductors",
    consequence: "Overheating when multiple wires in conduit",
    solution: "Apply NEC Table 310.15(C)(1) adjustment factors"
  }
];

const faqItems = [
  {
    question: "What size wire for 20 amp circuit?",
    answer: "A 20 amp circuit requires 12 AWG copper wire or 10 AWG aluminum wire per NEC Table 310.16."
  },
  {
    question: "How do I calculate wire size for distance?",
    answer: "For distance calculations: 1) Start with ampacity-based size from NEC 310.16, 2) Calculate voltage drop using VD = (2 × L × I × R) ÷ 1000. Distance often requires larger wire than ampacity alone."
  },
  {
    question: "Can I use aluminum wire instead of copper?",
    answer: "Yes. Aluminum carries less current than copper of the same size, so it often needs a larger one: for a 30 A breaker, the 60 °C column of NEC Table 310.16 gives 10 AWG copper and 8 AWG aluminum. The calculator shows both."
  },
  {
    question: "How many amps can 12 gauge wire handle?",
    answer: "12 AWG copper wire is rated for 25 amps at 75 °C per NEC Table 310.16, but must be protected at 20 amps maximum per NEC 240.4(D)."
  },
  {
    question: "What size ground wire do I need?",
    answer: "Equipment grounding conductor size is based on overcurrent device per NEC Table 250.122: 15 A circuits need 14 AWG, 20 A circuits need 12 AWG, 30-60 A need 10 AWG, 100 A needs 8 AWG, 200 A needs 6 AWG copper ground."
  },
  {
    question: "What wire size for 200 amp service entrance?",
    answer: "2/0 AWG copper or 4/0 aluminum (dwelling service, Table 310.12). Verify local requirements."
  },
  {
    question: "Can I use 14 gauge wire on a 20 amp circuit?",
    answer: "No. NEC 240.4(D) limits 14 AWG copper to 15 A overcurrent protection, even though Table 310.16 lists 20 A for it in the 75 °C column."
  },
  {
    question: "What affects wire ampacity ratings?",
    answer: "Wire ampacity is affected by: conductor material (copper vs aluminum), insulation temperature rating (60/75/90 °C), ambient temperature (derating required above 86 °F), number of conductors in raceway (derating for heat), and installation method."
  },
  {
    question: "What's the difference between stranded and solid wire?",
    answer: "Stranded wire is more flexible and resistant to fatigue, ideal for vibration or frequent movement. Solid wire is easier to terminate, and preferred for permanent building wiring. Both have identical ampacity ratings."
  },
];

export default function WireSizeCalculatorPage() {
  return (
    <>
      
      {/* Quick Answer Section */}
      <section className="bg-blue-50 border-b border-blue-200">
        <div className="container py-4 sm:py-8">
          <div className="max-w-full px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              Wire Size Calculator - AWG Electrical Wire Sizing
            </h1>
            <p className="text-lg text-neutral-700 mb-6">
              Copper and aluminum conductor sizes for a 15–400 A breaker or fuse, from the 60 °C column of NEC
              Table 310.16, with a voltage-drop check.
            </p>
            
            {/* Quick Answer Box */}
            <div className="bg-white rounded-lg p-6 border border-blue-300 shadow-sm">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="w-full">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Reference: Common Wire Sizes</h2>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-2">Residential Circuits:</h3>
                      <ul className="space-y-1 text-sm text-neutral-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span><strong>15 A:</strong> 14 AWG copper</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span><strong>20 A:</strong> 12 AWG copper</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span><strong>30 A:</strong> 10 AWG copper</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span><strong>50 A:</strong> 6 AWG copper</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-2">Service/Feeders:</h3>
                      <ul className="space-y-1 text-sm text-neutral-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span><strong>60 A Sub:</strong> 4 AWG copper</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span><strong>100 A Sub:</strong> 1 AWG copper</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span><strong>200 A Service:</strong> 2/0 copper or 4/0 aluminum (dwelling service, Table 310.12)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span>Check voltage drop!</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Important:</strong> These sizes are based on ampacity alone. Check voltage drop, and apply the
                      correction for ambient temperature and the adjustment for more than three current-carrying conductors.
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
          <div className="max-w-full px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <WireSizeCalculator />
          </div>
        </div>
      </section>

      {/* Understanding Wire Sizing Section */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-full px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Complete Guide to Wire Sizing
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">How Wire Sizing Works</h3>
                <p className="text-neutral-700 mb-4">
                  Wire sizing involves selecting the correct conductor size based on several factors: 
                  current carrying capacity (ampacity), voltage drop over distance, temperature conditions, 
                  and installation method. The National Electrical Code (NEC) provides tables and rules 
                  to ensure safe and efficient electrical installations.
                </p>
                
                <div className="bg-white p-6 rounded-lg border border-neutral-200 mb-6">
                  <h4 className="text-lg font-semibold mb-3">Key Factors in Wire Sizing</h4>
                  <p>
                    <strong>Ampacity:</strong> The maximum current a conductor can carry continuously without exceeding its temperature rating.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">NEC Wire Sizing Rules</h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Table 310.16</h4>
                    <p className="text-sm text-blue-800">
                      Primary ampacity table for conductors rated 0-2000 V in raceway, cable, or earth.
                      Most residential and commercial wiring references this table.
                    </p>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-2">NEC 240.4(D)</h4>
                    <p className="text-sm text-amber-800">
                      Small conductor rule: 14 AWG copper limited to 15 A, 12 AWG copper to 20 A, 10 AWG copper to 30 A
                      overcurrent protection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wire Ampacity Reference */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-full px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              NEC Table 310.16 - Wire Ampacity Ratings
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th rowSpan={2} className="px-4 py-3 text-left font-medium text-neutral-700">AWG</th>
                      <th colSpan={3} className="px-4 py-3 text-center font-medium text-neutral-700 border-l">Copper (Amps)</th>
                      <th colSpan={3} className="px-4 py-3 text-center font-medium text-neutral-700 border-l">Aluminum (Amps)</th>
                    </tr>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-3 py-2 text-center text-xs border-l">60 °C</th>
                      <th className="px-3 py-2 text-center text-xs">75 °C</th>
                      <th className="px-3 py-2 text-center text-xs">90 °C</th>
                      <th className="px-3 py-2 text-center text-xs border-l">60 °C</th>
                      <th className="px-3 py-2 text-center text-xs">75 °C</th>
                      <th className="px-3 py-2 text-center text-xs">90 °C</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {WIRE_AMPACITY_TABLE.map((row) => (
                      <tr key={row.awg} className="hover:bg-neutral-50">
                        <td className="px-4 py-2 font-mono font-semibold">{row.awg}</td>
                        <td className="px-3 py-2 text-center border-l">{row.copper60C}</td>
                        <td className="px-3 py-2 text-center">{row.copper75C}</td>
                        <td className="px-3 py-2 text-center">{row.copper90C}</td>
                        <td className="px-3 py-2 text-center border-l">{row.aluminum60C}</td>
                        <td className="px-3 py-2 text-center">{row.aluminum75C}</td>
                        <td className="px-3 py-2 text-center">{row.aluminum90C}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6 grid gap-4">
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-2">Ambient Temperature Correction</h3>
                <p className="text-sm text-amber-800">
                  Ampacity is corrected when the ambient temperature differs from 30 °C (86 °F). Multiply by the
                  factor for the {"conductor's"} temperature column.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Temperature Correction Factors */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-full px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Gauge className="w-6 h-6 text-orange-600" />
              Temperature Correction Factors
            </h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Ambient Temperature</th>
                      <th className="px-4 py-3 text-center font-medium text-neutral-700">60 °C Wire</th>
                      <th className="px-4 py-3 text-center font-medium text-neutral-700">75 °C Wire</th>
                      <th className="px-4 py-3 text-center font-medium text-neutral-700">90 °C Wire</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {AMBIENT_ROWS.map((row) => (
                      <tr key={row.key} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 font-medium">{ambientLabel(row)}</td>
                        <td className="px-4 py-3 text-center font-mono">{row.f_60 === null ? '—' : row.f_60.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center font-mono">{row.f_75 === null ? '—' : row.f_75.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center font-mono">{row.f_90 === null ? '—' : row.f_90.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">How to Apply Temperature Correction</h3>
              <p className="text-sm text-orange-800 mb-2">
                Multiply the table ampacity by the correction factor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="py-8 bg-red-50 border-y">
        <div className="container">
          <div className="max-w-full px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Common Wire Sizing Mistakes to Avoid
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-4">
              {COMMON_MISTAKES.map((mistake, idx) => (
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

      {/* Special Considerations */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-full px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Special Wire Sizing Considerations
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">More Than Three Current-Carrying Conductors</h3>
                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <p className="text-sm text-neutral-700 mb-3">
                    With more than three current-carrying conductors together, multiply the ampacity by the adjustment
                    factor in NEC Table 310.15(C)(1).
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>4-6 conductors</span>
                      <span className="font-mono font-semibold">80 % ampacity</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>7-9 conductors</span>
                      <span className="font-mono font-semibold">70 % ampacity</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>10-20 conductors</span>
                      <span className="font-mono font-semibold">50 % ampacity</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Tips */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-full px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-blue-600" />
              Professional Installation Tips
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Planning Phase
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Calculate both ampacity and voltage drop</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Consider future expansion needs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Check local code amendments</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Best Practices
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Label wire runs clearly at both ends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Use proper torque specifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Document calculations for inspector</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Common Issues
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Undersized neutrals in MWBC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Missing derating in hot attics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Wrong insulation type for wet areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Mixing wire types in same circuit</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-full px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              Wire Sizing Frequently Asked Questions
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 mb-2 flex items-start gap-2">
                    <span className="text-blue-600 flex-shrink-0">Q: </span>
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

      {/* Sources */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-full px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <Sources
              domains={SOURCE_DOMAINS}
              headingClassName="text-2xl font-bold text-neutral-900 mb-6"
              listClassName="space-y-2 text-sm text-neutral-600"
              linkClassName="text-blue-600 hover:underline"
              noteClassName="mt-4 text-sm text-neutral-600"
            />
          </div>
        </div>
      </section>

      {/* Related Calculators */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-full px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Related Electrical Calculators
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              <a href="/calculators/voltage-drop-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Voltage Drop Calculator</h3>
                <p className="text-sm text-neutral-600">Calculate voltage loss over distance for any wire size</p>
              </a>
              <a href="/calculators/ampacity-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Ampacity Calculator</h3>
                <p className="text-sm text-neutral-600">Find current carrying capacity with derating factors</p>
              </a>
              <a href="/calculators/ground-wire-calculator" className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">Ground Wire Calculator</h3>
                <p className="text-sm text-neutral-600">Size equipment grounding conductors per NEC 250.122</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <CombinedSchema webApp={webAppData} />
    </>
  );
}