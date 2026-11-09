import { Metadata } from 'next';
import { GroundWireCalculator } from '@/components/calculators/GroundWireCalculator';
import { Shield, Calculator, TrendingUp, AlertCircle, BookOpen, Zap } from 'lucide-react';
import Link from 'next/link';
import { CombinedSchema } from '@/components/seo/CombinedSchema';
import { Byline } from '@/components/content/Byline';
import { Sources } from '@/components/content/Sources';
import { DOMAINS as GROUNDING_DOMAINS, TABLE_250_122_ROWS } from '@/lib/calculations/grounding';
import { DOMAINS as SERVICE_LOOKUP_DOMAINS, SCOPE_LINES } from '@/lib/calculations/service-lookup';
import { formatSize } from '@/lib/verified/awg';
import { TABLE_250_66_ROWS } from '@/lib/verified/nec-250-66';

// Sources: the domains of the engines this page uses
const SOURCE_DOMAINS = [...GROUNDING_DOMAINS, ...SERVICE_LOOKUP_DOMAINS];

export const metadata: Metadata = {
  title: 'Ground Wire Calculator — NEC 250.122',
  description: 'Equipment grounding conductor (EGC) size by overcurrent device rating per NEC Table 250.122. Copper and aluminum, 15 A to 6000 A.',
  keywords: 'ground wire calculator, equipment grounding conductor, NEC 250.122, grounding conductor size, electrical grounding, bonding conductor, service grounding, ground wire sizing',
  openGraph: {
    title: 'Ground Wire Calculator - Equipment Grounding Conductor Sizing',
    description: 'Calculate equipment grounding conductor size per NEC requirements.',
    type: 'website',
    url: 'https://wiresizes.com/calculators/ground-wire-calculator',
    images: ['/opengraph-image']
  },
  alternates: { canonical: '/calculators/ground-wire-calculator' },
};


// Web application data for schema
const webAppData = {
  name: "Ground Wire Calculator",
  url: "https://wiresizes.com/calculators/ground-wire-calculator",
  description: "Calculate grounding conductor size per NEC Table 250.122."
};

const groundWireFAQs = [
  {
    question: "How do I determine the size of equipment grounding conductors?",
    answer: "Equipment grounding conductor size is determined by the rating of the circuit overcurrent protective device using NEC Table 250.122. For example, if the circuit breaker is 60 A, the equipment grounding conductor must be minimum 10 AWG copper or 8 AWG aluminum. This table provides minimum sizes - larger sizes may be used but are not required unless specified by other code sections."
  },
  {
    question: "What's the difference between grounding and bonding?",
    answer: "Grounding connects electrical systems to earth for safety and system operation. Bonding connects metallic parts together to ensure electrical continuity and create a low-impedance path for fault current. Grounding electrode conductors connect to earth, while equipment grounding conductors (bonding conductors) connect equipment to the grounding system."
  },
  {
    question: "When do I need to upsize the equipment grounding conductor?",
    answer: "NEC 250.122(B) requires upsizing the equipment grounding conductor when circuit conductors are increased in size for voltage drop or other reasons. The equipment grounding conductor must be increased proportionally. For example, if circuit conductors are increased by a factor of 2, the equipment grounding conductor must also be increased by a factor of 2."
  },
  {
    question: "Can I use the conduit as the equipment grounding conductor?",
    answer: "Yes, metallic conduits and raceways listed in NEC 250.118 can serve as equipment grounding conductors when properly installed with approved fittings and continuity. However, an equipment grounding conductor is still required in some applications like isolated ground circuits, certain flexible conduits, or where specifically required by other code sections."
  },
  {
    question: "How do I size the grounding electrode conductor?",
    answer: "Grounding electrode conductor size is based on the service conductor size per NEC Table 250.66. For example, 4/0 AWG copper service conductors require a minimum 2 AWG copper grounding electrode conductor."
  }
];

export default function GroundWireCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CombinedSchema 
        webApp={webAppData} 
      />
      
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 py-12 rounded-2xl mb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Ground Wire Calculator
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Calculate equipment grounding conductor sizes per NEC requirements.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Shield className="h-12 w-12 text-green-600 mb-4" />
              <p className="text-xl font-semibold mb-2">NEC Table 250.122</p>
              <p className="text-gray-600 dark:text-gray-400">
                Based on official NEC equipment grounding conductor sizing requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="mb-16">
        <GroundWireCalculator />
        <Byline route="/calculators/ground-wire-calculator" sources className="mt-4 px-6 text-sm text-gray-600 dark:text-gray-400" linkClassName="text-blue-600 hover:underline dark:text-blue-300" />
      </section>

      {/* Understanding Grounding Systems */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Understanding Electrical Grounding and Bonding
            </h2>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Electrical grounding and bonding systems provide essential safety functions in electrical 
              installations. Proper sizing of grounding and bonding conductors ensures effective fault 
              current paths, protects personnel from electrical hazards, and maintains system reliability 
              per National Electrical Code requirements.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Types of Grounding Conductors
            </h3>
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">Equipment Grounding Conductors</h4>
                <ul className="list-disc pl-4 space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                  <li><strong>Purpose:</strong> Connect non-current-carrying metal parts to ground</li>
                  <li><strong>Function:</strong> Provide fault current path back to source</li>
                  <li><strong>Sizing:</strong> Based on overcurrent device rating (NEC Table 250.122)</li>
                  <li><strong>Types:</strong> Wire, conduit, cable armor, or other listed methods</li>
                  <li><strong>Installation:</strong> Run with circuit conductors in same raceway</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-3">Grounding Electrode Conductors</h4>
                <ul className="list-disc pl-4 space-y-2 text-green-700 dark:text-green-300 text-sm">
                  <li><strong>Purpose:</strong> Connect electrical system to earth ground</li>
                  <li><strong>Function:</strong> Stabilize system voltage to ground</li>
                  <li><strong>Sizing:</strong> Based on service conductor size (NEC Table 250.66)</li>
                  <li><strong>Connection:</strong> To grounding electrodes (rods, pipes, plates)</li>
                  <li><strong>Protection:</strong> Limited physical protection required</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Grounding System Components
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">Grounding Electrodes</h4>
                <ul className="list-disc pl-4 space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>Ground rods (8 ft minimum)</li>
                  <li>Ground plates (2 sq ft minimum)</li>
                  <li>Concrete-encased electrodes (Ufer)</li>
                  <li>Metal water piping systems</li>
                  <li>Building steel (where available)</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">Bonding Conductors</h4>
                <ul className="list-disc pl-4 space-y-1 text-purple-700 dark:text-purple-300 text-sm">
                  <li>Main bonding jumpers</li>
                  <li>Equipment bonding jumpers</li>
                  <li>Intersystem bonding terminals</li>
                  <li>Supply-side bonding jumpers</li>
                  <li>Load-side equipment grounds</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-3">Grounded Conductors</h4>
                <ul className="list-disc pl-4 space-y-1 text-orange-700 dark:text-orange-300 text-sm">
                  <li>Neutral conductors (grounded)</li>
                  <li>One phase in corner-grounded systems</li>
                  <li>Center tap in single-phase systems</li>
                  <li>Wye point in three-phase systems</li>
                  <li>Identified by white or gray color</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-6">
              <h4 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">
                Critical Safety Functions
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-red-700 dark:text-red-300 text-sm">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Provides low-impedance fault current path</li>
                  <li>Enables overcurrent devices to operate quickly</li>
                  <li>Limits voltage rise on non-current-carrying parts</li>
                  <li>Protects against lightning and static charges</li>
                </ul>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Stabilizes system voltage during normal operation</li>
                  <li>Provides reference point for voltage measurements</li>
                  <li>Reduces electromagnetic interference</li>
                  <li>Ensures personnel safety through fault clearing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEC Grounding Tables */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            NEC Grounding Conductor Sizing Tables
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Equipment Grounding Conductors */}
            <div className="space-y-6 min-w-0">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Equipment Grounding Conductors (NEC Table 250.122)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Overcurrent Device
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Copper
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Aluminum or copper-clad aluminum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {TABLE_250_122_ROWS.map((row) => (
                      <tr key={row.rowA}>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{row.rowA} A</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{formatSize(row.cu)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{formatSize(row.alCca)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Grounding Electrode Conductors */}
            <div className="space-y-6 min-w-0">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Grounding Electrode Conductors (NEC Table 250.66)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Copper Service Conductor (AWG/kcmil)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Aluminum or Copper-Clad Aluminum Service Conductor (AWG/kcmil)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Copper GEC
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
                        Aluminum GEC
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {TABLE_250_66_ROWS.map((row) => (
                      <tr key={row.service_cu}>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{row.service_cu}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{row.service_al_cca}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{formatSize(row.gec_cu)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{formatSize(row.gec_al_cca)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> GEC = Grounding Electrode Conductor. Where multiple service disconnecting 
                  means are used, the grounding electrode conductor size is based on the sum of the circular mil 
                  areas of the largest service conductors.
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300 mt-2">{SCOPE_LINES[1]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grounding System Design */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Grounding System Design Guidelines
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-green-600" />
                  Service Grounding Requirements
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Grounding Electrode System:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Metal water piping (if available)</li>
                      <li>• Concrete-encased electrode (Ufer ground)</li>
                      <li>• Ground ring around building (if applicable)</li>
                      <li>• Rod, pipe, or plate electrodes</li>
                      <li>• Structural metal (where effectively grounded)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Installation Requirements:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• All available electrodes must be bonded together</li>
                      <li>• Grounding electrode conductor properly sized</li>
                      <li>• Main bonding jumper in service equipment only</li>
                      <li>• Equipment grounding conductors to all circuits</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-blue-600" />
                  Equipment Grounding Design
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Conductor Sizing:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Based on overcurrent device rating</li>
                      <li>• Minimum size per NEC Table 250.122</li>
                      <li>• Upsize when circuit conductors are upsized</li>
                      <li>• No splices except as specifically permitted</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Installation Methods:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Equipment grounding conductor in same raceway</li>
                      <li>• Metallic raceway systems (properly installed)</li>
                      <li>• Cable armor or sheath (where permitted)</li>
                      <li>• Isolated grounding for special applications</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  Special Applications
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Separate Buildings:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Equipment grounding conductor required</li>
                      <li>• Local grounding electrode at building</li>
                      <li>• Neutral and ground separated at subpanel</li>
                      <li>• Exception for livestock buildings with conditions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Swimming Pools:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Equipotential bonding required</li>
                      <li>• 8 AWG solid copper minimum for bonding</li>
                      <li>• All metallic components must be bonded</li>
                      <li>• Equipment grounding per standard requirements</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                  Common Installation Errors
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Avoid These Mistakes:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Bonding neutral and ground at subpanels</li>
                      <li>• Using undersized equipment grounding conductors</li>
                      <li>• Improper grounding electrode connections</li>
                      <li>• Missing equipment grounding conductors</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quality Assurance:</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Test continuity of grounding paths</li>
                      <li>• Verify proper conductor sizing</li>
                      <li>• Check all connections are tight</li>
                      <li>• Ensure proper identification of conductors</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety and Code Compliance */}
      <section className="mb-16">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Safety and Code Compliance
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Critical Safety Requirements
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Grounding and bonding are life safety systems - never compromise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Always use properly sized conductors per NEC tables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Ensure continuity of all grounding and bonding paths</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Verify all connections are properly torqued and secure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Test grounding systems for proper operation</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  NEC Article 250 Key Points
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Equipment Grounding:</span>
                    <span className="text-gray-800 dark:text-gray-200">Required for all circuits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Conductor Sizing:</span>
                    <span className="text-gray-800 dark:text-gray-200">Per Table 250.122</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Grounding Electrodes:</span>
                    <span className="text-gray-800 dark:text-gray-200">Bond all available types</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Installation Best Practices
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Use listed and approved grounding and bonding components</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Follow manufacturer torque specifications for connections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Protect grounding conductors from physical damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Keep grounding and bonding conductors as short as practical</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Document grounding system design and testing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Disclaimer
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Grounding and bonding systems are critical for electrical safety and must comply with 
                  NEC requirements and local codes. This calculator provides guidance based on standard 
                  applications. Consult qualified electrical professionals for complex installations or 
                  special circumstances. Proper testing and verification are essential after installation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {groundWireFAQs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <Sources
            domains={SOURCE_DOMAINS}
            headingClassName="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
            listClassName="space-y-2 text-gray-700 dark:text-gray-300"
            linkClassName="text-blue-600 hover:underline dark:text-blue-300"
            noteClassName="mt-4 text-sm text-gray-600 dark:text-gray-400"
          />
        </div>
      </section>

      {/* Related Calculators */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Related Electrical Calculators
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/calculators/wire-size-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Calculator className="h-6 w-6 text-blue-600" />
                <h3 data-name="" className="text-lg font-semibold text-gray-900 dark:text-white">Wire Size Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Size circuit conductors that work with grounding systems
              </p>
            </Link>
            

            <Link 
              href="/calculators/ampacity-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-purple-600" />
                <h3 data-name="" className="text-lg font-semibold text-gray-900 dark:text-white">Ampacity Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Determine current capacity of grounding conductors
              </p>
            </Link>


            <Link 
              href="/calculators/voltage-drop-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <h3 data-name="" className="text-lg font-semibold text-gray-900 dark:text-white">Voltage Drop Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Ensure proper grounding conductor performance
              </p>
            </Link>

            <Link 
              href="/calculators/service-entrance-calculator"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="h-6 w-6 text-yellow-600" />
                <h3 data-name="" className="text-lg font-semibold text-gray-900 dark:text-white">Service Entrance Calculator</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Design complete service grounding systems
              </p>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}