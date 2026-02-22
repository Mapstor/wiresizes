import { Metadata } from 'next';
import { ConduitFillCalculator } from '@/components/calculators';
import { Settings, Calculator, AlertTriangle, CheckCircle, Wrench, Target, BookOpen, Users, Shield, Package } from 'lucide-react';
import Link from 'next/link';
import { calculatorFAQs } from '@/data/calculator-faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'Conduit Fill Calculator | NEC Chapter 9 Wire Fill Calculator',
  description: 'Professional conduit fill calculator per NEC Chapter 9. Calculate wire fill percentage for EMT, PVC, rigid, and flexible conduit. Ensure code compliance.',
  keywords: 'conduit fill calculator, NEC chapter 9, wire fill percentage, EMT conduit fill, PVC conduit capacity, rigid conduit fill, electrical conduit sizing',
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Electrical Conduit Fill Calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Determine proper conduit size based on wire count and NEC fill requirements.",
  "keywords": "conduit calculator, raceway fill, electrical conduit",
  "url": `https://wiresizes.com/calculators/conduit-fill-calculator`,
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

const CONDUIT_FILL_EXAMPLES = [
  {
    title: 'Residential Service Entrance',
    scenario: '4 AWG copper THHN in 1.25" EMT',
    calculation: 'Wire area: 4 AWG THHN = 0.0824 sq in × 3 wires = 0.2472 sq in\nConduit area: 1.25" EMT = 1.496 sq in\nFill percentage: 0.2472 ÷ 1.496 = 16.5%\nNEC limit: 40% for 3+ wires = 0.598 sq in\nResult: Well within code limits',
    result: '16.5% fill',
    necLimit: '40% maximum',
    status: 'Code compliant',
    application: 'Service entrance feeders'
  },
  {
    title: 'Branch Circuit Wiring',
    scenario: '6 × 12 AWG THWN in 3/4" EMT',
    calculation: 'Wire area: 12 AWG THWN = 0.0133 sq in × 6 wires = 0.0798 sq in\nConduit area: 3/4" EMT = 0.533 sq in\nFill percentage: 0.0798 ÷ 0.533 = 15.0%\nNEC limit: 40% for 3+ wires = 0.213 sq in\nRemaining capacity: 0.213 - 0.0798 = 0.133 sq in',
    result: '15.0% fill',
    necLimit: '40% maximum',
    status: 'Code compliant',
    application: 'Lighting and receptacle circuits'
  },
  {
    title: 'Motor Control Circuit',
    scenario: '12 × 14 AWG THHN in 1" EMT',
    calculation: 'Wire area: 14 AWG THHN = 0.0097 sq in × 12 wires = 0.1164 sq in\nConduit area: 1" EMT = 0.864 sq in\nFill percentage: 0.1164 ÷ 0.864 = 13.5%\nNEC limit: 40% for 3+ wires = 0.346 sq in\nCan add more: (0.346 - 0.1164) ÷ 0.0097 = 24 more 14 AWG',
    result: '13.5% fill',
    necLimit: '40% maximum',
    status: 'Room for expansion',
    application: 'Motor control and automation'
  },
  {
    title: 'High-Fill Commercial Run',
    scenario: '20 × 12 AWG THWN in 1.25" EMT',
    calculation: 'Wire area: 12 AWG THWN = 0.0133 sq in × 20 wires = 0.266 sq in\nConduit area: 1.25" EMT = 1.496 sq in\nFill percentage: 0.266 ÷ 1.496 = 17.8%\nNEC limit: 40% for 3+ wires = 0.598 sq in\nMargin: 0.598 - 0.266 = 0.332 sq in remaining',
    result: '17.8% fill',
    necLimit: '40% maximum',
    status: 'Good utilization',
    application: 'Commercial lighting panels'
  },
  {
    title: 'Mixed Wire Size Installation',
    scenario: '2 × 8 AWG + 4 × 12 AWG THHN in 1" EMT',
    calculation: '8 AWG THHN: 0.0366 sq in × 2 = 0.0732 sq in\n12 AWG THHN: 0.0197 sq in × 4 = 0.0788 sq in\nTotal area: 0.0732 + 0.0788 = 0.152 sq in\nConduit area: 1" EMT = 0.864 sq in\nFill: 0.152 ÷ 0.864 = 17.6%',
    result: '17.6% fill',
    necLimit: '40% maximum',
    status: 'Code compliant',
    application: 'Mixed circuit applications'
  },
  {
    title: 'Large Feeder in RGS',
    scenario: '3 × 500 kcmil + 1 × 250 kcmil in 4" RGS',
    calculation: '500 kcmil: 0.7073 sq in × 3 = 2.122 sq in\n250 kcmil: 0.3718 sq in × 1 = 0.372 sq in\nTotal: 2.122 + 0.372 = 2.494 sq in\nConduit: 4" RGS = 12.72 sq in\nFill: 2.494 ÷ 12.72 = 19.6%',
    result: '19.6% fill',
    necLimit: '40% maximum',
    status: 'Efficient design',
    application: 'Large service feeders'
  }
];

const CONDUIT_FILL_LIMITS = [
  { wireCount: '1', fillPercent: '53%', notes: 'Single conductor only' },
  { wireCount: '2', fillPercent: '31%', notes: 'Two conductors total' },
  { wireCount: '3 or more', fillPercent: '40%', notes: 'Most common scenario' },
  { wireCount: 'Nipples ≤24"', fillPercent: '60%', notes: 'Short sections only' },
  { wireCount: 'Equipment grounds', fillPercent: 'Not counted', notes: 'Per NEC 250.122' },
  { wireCount: 'Fixture wires', fillPercent: 'Special rules', notes: 'NEC Table 402.3' }
];

const CONDUIT_TYPES_COMPARISON = [
  { 
    type: 'EMT', 
    material: 'Steel', 
    advantages: 'Lightweight, easy bends, economical', 
    disadvantages: 'Not suitable for wet locations', 
    applications: 'Dry locations, commercial/industrial',
    fillFactor: 'Standard NEC tables'
  },
  { 
    type: 'PVC Schedule 40', 
    material: 'Plastic', 
    advantages: 'Corrosion resistant, low cost', 
    disadvantages: 'UV degradation, temperature limits', 
    applications: 'Underground, wet locations',
    fillFactor: 'Standard NEC tables'
  },
  { 
    type: 'PVC Schedule 80', 
    material: 'Plastic', 
    advantages: 'Higher crush strength than Sch 40', 
    disadvantages: 'Smaller ID, more expensive', 
    applications: 'Concrete encasement, high stress',
    fillFactor: 'Smaller internal diameter'
  },
  { 
    type: 'RGS (Rigid Steel)', 
    material: 'Steel', 
    advantages: 'Maximum protection, threaded', 
    disadvantages: 'Heavy, expensive, corrosion', 
    applications: 'Hazardous locations, high abuse',
    fillFactor: 'Standard NEC tables'
  },
  { 
    type: 'IMC', 
    material: 'Steel', 
    advantages: 'Lighter than RGS, same protection', 
    disadvantages: 'More expensive than EMT', 
    applications: 'Wet locations, lighter than RGS',
    fillFactor: 'Standard NEC tables'
  },
  { 
    type: 'Flexible Metal', 
    material: 'Steel', 
    advantages: 'Flexible routing, equipment connections', 
    disadvantages: 'Limited lengths, grounding issues', 
    applications: 'Motor connections, final drops',
    fillFactor: 'Special calculations'
  }
];

const WIRE_AREA_TABLE = [
  { awg: '14', thhn: '0.0097', thwn: '0.0097', xhhw: '0.0139', uf: 'N/A' },
  { awg: '12', thhn: '0.0133', thwn: '0.0133', xhhw: '0.0181', uf: '0.0243' },
  { awg: '10', thhn: '0.0211', thwn: '0.0211', xhhw: '0.0259', uf: '0.0333' },
  { awg: '8', thhn: '0.0366', thwn: '0.0366', xhhw: '0.0437', uf: '0.0556' },
  { awg: '6', thhn: '0.0507', thwn: '0.0507', xhhw: '0.0590', uf: '0.0814' },
  { awg: '4', thhn: '0.0824', thwn: '0.0824', xhhw: '0.0973', uf: '0.1225' },
  { awg: '2', thhn: '0.1158', thwn: '0.1158', xhhw: '0.1333', uf: '0.1750' },
  { awg: '1', thhn: '0.1562', thwn: '0.1562', xhhw: '0.1901', uf: '0.2223' },
  { awg: '1/0', thhn: '0.1855', thwn: '0.1855', xhhw: '0.2223', uf: '0.2679' },
  { awg: '2/0', thhn: '0.2223', thwn: '0.2223', xhhw: '0.2642', uf: '0.3237' },
  { awg: '3/0', thhn: '0.2679', thwn: '0.2679', xhhw: '0.3117', uf: '0.3904' },
  { awg: '4/0', thhn: '0.3237', thwn: '0.3237', xhhw: '0.3718', uf: '0.4754' }
];

const COMMON_CONDUIT_SIZES = [
  { size: '1/2"', emt: '0.304', pvc40: '0.300', pvc80: '0.235', rgs: '0.355' },
  { size: '3/4"', emt: '0.533', pvc40: '0.511', pvc80: '0.408', rgs: '0.610' },
  { size: '1"', emt: '0.864', pvc40: '0.832', pvc80: '0.684', rgs: '1.049' },
  { size: '1-1/4"', emt: '1.496', pvc40: '1.453', pvc80: '1.237', rgs: '1.769' },
  { size: '1-1/2"', emt: '2.036', pvc40: '1.986', pvc80: '1.711', rgs: '2.445' },
  { size: '2"', emt: '3.356', pvc40: '3.291', pvc80: '2.874', rgs: '4.011' },
  { size: '2-1/2"', emt: '5.858', pvc40: '5.818', pvc80: '5.176', rgs: '6.733' },
  { size: '3"', emt: '8.846', pvc40: '8.688', pvc80: '7.786', rgs: '10.010' },
  { size: '4"', emt: '14.753', pvc40: '14.314', pvc80: '13.158', rgs: '15.949' }
];

const COMPREHENSIVE_FAQS = [
  {
    question: 'What is the 40% conduit fill rule?',
    answer: 'NEC limits conduit fill to 40% of internal cross-sectional area when 3 or more conductors are present. This prevents overheating and allows for wire pulling. Single conductor = 53%, two conductors = 31%, three or more = 40%.'
  },
  {
    question: 'How do I calculate conduit fill percentage?',
    answer: 'Add up the cross-sectional areas of all conductors (from NEC Chapter 9 tables), divide by the conduit\'s internal area, multiply by 100. Example: 0.20 sq in of wire ÷ 0.864 sq in conduit = 23.1% fill.'
  },
  {
    question: 'Do ground wires count toward conduit fill?',
    answer: 'Equipment grounding conductors sized per NEC 250.122 do not count toward fill calculations. However, grounding conductors larger than required (for voltage drop, etc.) do count. Isolated grounding conductors always count.'
  },
  {
    question: 'Can I exceed 40% fill in short sections?',
    answer: 'Yes, nipples 24 inches or less can be filled to 60% per NEC 314.17(B). This applies only to short conduit sections, not regular raceways. Still must consider heat generation and pulling difficulty.'
  },
  {
    question: 'What\'s the difference between Schedule 40 and 80 PVC?',
    answer: 'Schedule 80 has thicker walls for higher strength but smaller internal diameter. Use Sch 80 for concrete encasement or high-stress applications. Sch 40 adequate for most underground and general use applications.'
  },
  {
    question: 'How do I size conduit for different wire types?',
    answer: 'Each insulation type has different cross-sectional area. THHN is smallest, THWN slightly larger, XHHW larger still. Use NEC Chapter 9 Table 5 for conductor areas. Insulation type affects how many wires fit.'
  },
  {
    question: 'What about wire pulling difficulty?',
    answer: 'While NEC sets maximum fill percentages, practical pulling becomes difficult above 30-35% fill. Consider using larger conduit for easier installation, especially with multiple bends or long runs.'
  },
  {
    question: 'Do fixture wires count the same as branch circuit wires?',
    answer: 'No, fixture wires have special fill rules per NEC Table 402.3. They\'re typically much smaller and counted differently. Control wires and fixture wires often have reduced impact on fill calculations.'
  }
];

export default function ConduitFillCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQSchema 
        items={calculatorFAQs['conduit-fill-calculator']} 
        
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Conduit Fill Calculator</h1>
              </div>
              <p className="text-xl mb-6 text-orange-50">
                Calculate conduit fill percentage per NEC Chapter 9 requirements. Ensure code compliance for EMT, PVC, 
                rigid, and flexible conduit installations with professional accuracy.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-orange-100">NEC Chapter 9</div>
                  <div className="font-semibold">Code Compliance</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-orange-100">Fill Limits</div>
                  <div className="font-semibold">40% Maximum</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-orange-100">Conduit Types</div>
                  <div className="font-semibold">EMT, PVC, RGS, IMC</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <div className="text-sm text-orange-100">Wire Types</div>
                  <div className="font-semibold">All Insulation Types</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Information */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-red-900 mb-2">NEC Conduit Fill Requirements</h2>
                <ul className="text-red-800 space-y-1 text-sm">
                  <li>• Maximum 40% fill for 3 or more conductors - exceeding this violates electrical code</li>
                  <li>• Different limits apply: 1 conductor = 53%, 2 conductors = 31%, nipples ≤24" = 60%</li>
                  <li>• Equipment grounding conductors sized per NEC 250.122 do not count toward fill</li>
                  <li>• Practical limit is often 30-35% for difficult pulls or multiple bends</li>
                  <li>• Always use actual conductor dimensions from NEC Chapter 9 Table 5</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <ConduitFillCalculator />

          {/* Real-World Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Conduit Fill Calculation Examples</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Practical examples showing conduit fill calculations for typical electrical installations.
            </p>
            
            <div className="grid gap-6">
              {CONDUIT_FILL_EXAMPLES.map((example, idx) => (
                <div key={idx} className="border-l-4 border-orange-500 bg-orange-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{example.title}</h3>
                      <p className="text-orange-700 font-medium">{example.scenario}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{example.result}</div>
                      <div className="text-sm text-gray-500">{example.necLimit}</div>
                      <div className="text-sm font-medium text-green-600">{example.status}</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Calculation Steps:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-line font-mono">{example.calculation}</pre>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Application: </span>{example.application}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fill Limits Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">NEC Conduit Fill Limits</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Number of Conductors</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Maximum Fill</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {CONDUIT_FILL_LIMITS.map((limit, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{limit.wireCount}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-blue-600">{limit.fillPercent}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{limit.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conduit Types */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Conduit Types & Characteristics</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {CONDUIT_TYPES_COMPARISON.map((conduit, idx) => (
                <div key={idx} className="border rounded-lg p-6 bg-purple-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <h3 className="font-semibold text-gray-900 text-lg">{conduit.type}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Material: </span>
                      <span className="text-sm text-gray-600">{conduit.material}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-green-700 text-sm">Advantages:</h4>
                      <p className="text-sm text-green-600">{conduit.advantages}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-red-700 text-sm">Disadvantages:</h4>
                      <p className="text-sm text-red-600">{conduit.disadvantages}</p>
                    </div>
                    
                    <div className="bg-white rounded p-2">
                      <div className="text-sm font-medium">Applications: {conduit.applications}</div>
                      <div className="text-xs text-gray-600">Fill: {conduit.fillFactor}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wire Area Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Conductor Cross-Sectional Areas</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              NEC Chapter 9 Table 5 wire areas in square inches for common conductor types.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">AWG Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">THHN/THWN<br />(sq in)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">THWN-2<br />(sq in)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">XHHW<br />(sq in)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">UF Cable<br />(sq in)</th>
                  </tr>
                </thead>
                <tbody>
                  {WIRE_AREA_TABLE.map((wire, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold">{wire.awg}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-blue-600">{wire.thhn}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">{wire.thwn}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-purple-600">{wire.xhhw}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-orange-600">{wire.uf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conduit Size Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Conduit Internal Areas</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Internal cross-sectional areas in square inches for common conduit types per NEC Chapter 9.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-red-50">
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Trade Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">EMT<br />(sq in)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">PVC Sch 40<br />(sq in)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">PVC Sch 80<br />(sq in)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">RGS<br />(sq in)</th>
                  </tr>
                </thead>
                <tbody>
                  {COMMON_CONDUIT_SIZES.map((size, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold">{size.size}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-blue-600">{size.emt}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">{size.pvc40}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-orange-600">{size.pvc80}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-purple-600">{size.rgs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {COMPREHENSIVE_FAQS.map((faq, idx) => (
                <details key={idx} className="group bg-gray-50 rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-100 rounded-lg">
                    <span className="font-medium text-gray-900">{faq.question}</span>
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
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Electrical Calculators</h2>
              <p className="text-gray-600">Complete your electrical installation planning with these tools</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/calculators/wire-size-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Settings className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Wire Sizing</h3>
                <p className="text-xs text-gray-600">Calculate AWG size</p>
              </Link>
              
              <Link href="/calculators/ampacity-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Calculator className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Ampacity</h3>
                <p className="text-xs text-gray-600">Wire capacity</p>
              </Link>
              
              <Link href="/calculators/voltage-drop-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Target className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Voltage Drop</h3>
                <p className="text-xs text-gray-600">Check losses</p>
              </Link>
              
              <Link href="/calculators/electrical-load-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Load Calculator</h3>
                <p className="text-xs text-gray-600">Service sizing</p>
              </Link>
              
              <Link href="/calculators/box-fill-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Package className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Box Fill</h3>
                <p className="text-xs text-gray-600">Junction boxes</p>
              </Link>
              
              <Link href="/calculators/three-phase-calculator" className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                <Wrench className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">3-Phase Power</h3>
                <p className="text-xs text-gray-600">Industrial loads</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}