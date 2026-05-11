import { Metadata } from 'next';
import { 
  FileText, 
  Calculator, 
  AlertTriangle, 
  CheckCircle,
  Thermometer,
  BookOpen,
  Shield,
  Download,
  ArrowRight,
  Info,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { DatasetSchema } from '@/components/seo/DatasetSchema';
import { getArticleDates } from '@/lib/article-dates';
import { NEC_310_16 } from '@/lib/data/nec-tables';


export const metadata: Metadata = {
  title: 'NEC Table 310.16 — Conductor Ampacities',
  description: 'Full NEC 2023 Table 310.16 ampacity for copper and aluminum at 60/75/90°C, plus ambient correction (310.15(B)(1)) and bundling (310.15(C)(1)).',
  keywords: 'NEC Table 310.16, ampacity table, wire ampacity, conductor ampacity, NEC 2023, electrical code, copper ampacity, aluminum ampacity',
  alternates: { canonical: '/guides/nec-table-310-16' },
};

// Complete NEC Table 310.16 Data
// NEC Table 310.16 — derived from the canonical data source so this
// page can never drift from other tables on the site.
const NEC_310_16_DATA = NEC_310_16.map((row) => ({
  awg: row.awg,
  copper60: row.copper_60c,
  copper75: row.copper_75c,
  copper90: row.copper_90c,
  aluminum60: row.aluminum_60c ?? '—',
  aluminum75: row.aluminum_75c ?? '—',
  aluminum90: row.aluminum_90c ?? '—',
}));

// Temperature Derating Factors
const TEMP_DERATING = [
  { ambient: '10°C or less', factor60: 1.29, factor75: 1.20, factor90: 1.15 },
  { ambient: '11-15°C', factor60: 1.22, factor75: 1.15, factor90: 1.12 },
  { ambient: '16-20°C', factor60: 1.15, factor75: 1.11, factor90: 1.08 },
  { ambient: '21-25°C', factor60: 1.08, factor75: 1.05, factor90: 1.04 },
  { ambient: '26-30°C', factor60: 1.00, factor75: 1.00, factor90: 1.00 },
  { ambient: '31-35°C', factor60: 0.91, factor75: 0.94, factor90: 0.96 },
  { ambient: '36-40°C', factor60: 0.82, factor75: 0.88, factor90: 0.91 },
  { ambient: '41-45°C', factor60: 0.71, factor75: 0.82, factor90: 0.87 },
  { ambient: '46-50°C', factor60: 0.58, factor75: 0.75, factor90: 0.82 },
  { ambient: '51-55°C', factor60: 0.41, factor75: 0.67, factor90: 0.76 },
  { ambient: '56-60°C', factor60: '—', factor75: 0.58, factor90: 0.71 },
];

// Bundle Derating (More than 3 conductors)
const BUNDLE_DERATING = [
  { conductors: '4-6', factor: 0.80 },
  { conductors: '7-9', factor: 0.70 },
  { conductors: '10-20', factor: 0.50 },
  { conductors: '21-30', factor: 0.45 },
  { conductors: '31-40', factor: 0.40 },
  { conductors: '41+', factor: 0.35 },
];

// Common Applications
const COMMON_APPLICATIONS = [
  { circuit: '15A General Purpose', copper: '14 AWG', aluminum: '12 AWG', temp: '60°C', use: 'Lighting, receptacles' },
  { circuit: '20A Kitchen/Bath', copper: '12 AWG', aluminum: '10 AWG', temp: '60°C', use: 'Small appliances, bathroom' },
  { circuit: '30A Dryer', copper: '10 AWG', aluminum: '8 AWG', temp: '75°C', use: 'Electric dryer, window AC' },
  { circuit: '40A Range', copper: '8 AWG', aluminum: '6 AWG', temp: '75°C', use: 'Electric range, cooktop' },
  { circuit: '50A Hot Tub', copper: '6 AWG', aluminum: '4 AWG', temp: '75°C', use: 'Spa, EV charger' },
  { circuit: '100A Subpanel', copper: '3 AWG', aluminum: '1 AWG', temp: '75°C', use: 'Garage, workshop' },
  { circuit: '200A Service', copper: '3/0 AWG', aluminum: '4/0 AWG', temp: '75°C', use: 'Main service entrance' },
];

// Article data for schema
const articleData = {
  headline: "NEC Table 310.16",
  description: "Complete NEC Table 310.16 reference with copper and aluminum conductor ampacities at 60°C, 75°C, and 90°C. Derating factors, correction calculations, and code compliance guide.",
  url: "https://wiresizes.com/guides/nec-table-310-16",
  ...getArticleDates('src/app/guides/nec-table-310-16/page.tsx'),
};

export default function NECTable310_16Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8" />
            <h1 className="text-4xl font-bold">NEC Table 310.16</h1>
          </div>
          <p className="text-xl text-blue-100">
            Complete Conductor Ampacities Reference (2023 Edition)
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm text-blue-100">Standard</span>
              <div className="text-xl font-bold">NFPA 70</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm text-blue-100">Article</span>
              <div className="text-xl font-bold">310.16</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm text-blue-100">Temperature Range</span>
              <div className="text-xl font-bold">60°C - 90°C</div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-6 bg-amber-50 border-b border-amber-200">
        <div className="container mx-auto px-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h2 className="font-bold text-amber-900 mb-1">Critical Code Requirements</h2>
              <p className="text-sm text-amber-800">
                This table is based on not more than three current-carrying conductors in raceway, cable, or earth 
                (directly buried), based on an ambient temperature of 30°C (86°F). Adjustments required for different conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Complete Ampacity Table */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-600" />
              Complete Ampacity Table - Copper & Aluminum
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                      <th rowSpan={2} className="px-4 py-3 text-left border-r border-blue-400">AWG/kcmil</th>
                      <th colSpan={3} className="px-4 py-2 text-center border-r border-blue-400 bg-orange-600">Copper</th>
                      <th colSpan={3} className="px-4 py-2 text-center bg-gray-600">Aluminum/Copper-Clad</th>
                    </tr>
                    <tr className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
                      <th className="px-3 py-2 text-center border-r border-blue-300 bg-orange-500">60°C</th>
                      <th className="px-3 py-2 text-center border-r border-blue-300 bg-orange-500">75°C</th>
                      <th className="px-3 py-2 text-center border-r border-blue-400 bg-orange-500">90°C</th>
                      <th className="px-3 py-2 text-center border-r border-gray-300 bg-gray-500">60°C</th>
                      <th className="px-3 py-2 text-center border-r border-gray-300 bg-gray-500">75°C</th>
                      <th className="px-3 py-2 text-center bg-gray-500">90°C</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {NEC_310_16_DATA.map((row, index) => (
                      <tr key={row.awg} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-3 font-mono font-bold text-gray-900 border-r border-gray-200">
                          {row.awg.includes('/') ? (
                            <span className="text-blue-600">{row.awg}</span>
                          ) : parseInt(row.awg) >= 250 ? (
                            <span className="text-purple-600">{row.awg} kcmil</span>
                          ) : (
                            row.awg
                          )}
                        </td>
                        <td className="px-3 py-3 text-center font-mono border-r border-orange-100 bg-orange-50">
                          {row.copper60}
                        </td>
                        <td className="px-3 py-3 text-center font-mono font-semibold text-orange-700 border-r border-orange-100 bg-orange-50">
                          {row.copper75}
                        </td>
                        <td className="px-3 py-3 text-center font-mono border-r border-gray-200 bg-orange-50">
                          {row.copper90}
                        </td>
                        <td className="px-3 py-3 text-center font-mono border-r border-gray-100 bg-gray-50">
                          {row.aluminum60}
                        </td>
                        <td className="px-3 py-3 text-center font-mono font-semibold text-gray-700 border-r border-gray-100 bg-gray-50">
                          {row.aluminum75}
                        </td>
                        <td className="px-3 py-3 text-center font-mono bg-gray-50">
                          {row.aluminum90}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-blue-50 border-t border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> 75°C column (highlighted) is most commonly used for residential and commercial applications.
                  Terminations typically rated at 75°C per NEC 110.14(C).
                </p>
              </div>
            </div>
          </div>

          {/* Temperature Correction Factors */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Thermometer className="w-6 h-6 text-red-600" />
              Temperature Correction Factors
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
                      <th className="px-4 py-3 text-left">Ambient Temperature</th>
                      <th className="px-4 py-3 text-center">60°C</th>
                      <th className="px-4 py-3 text-center">75°C</th>
                      <th className="px-4 py-3 text-center">90°C</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {TEMP_DERATING.map((row, index) => (
                      <tr key={index} className={
                        row.ambient === '26-30°C' 
                          ? 'bg-green-100 font-semibold' 
                          : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }>
                        <td className="px-4 py-3">
                          {row.ambient}
                          {row.ambient === '26-30°C' && <span className="text-green-600 ml-2">(Standard)</span>}
                        </td>
                        <td className="px-4 py-3 text-center font-mono">{row.factor60}</td>
                        <td className="px-4 py-3 text-center font-mono">{row.factor75}</td>
                        <td className="px-4 py-3 text-center font-mono">{row.factor90}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-red-50 border-t border-red-200">
                <p className="text-sm text-red-800">
                  <strong>Example:</strong> #12 AWG copper at 75°C = 25A. In 40°C ambient: 25A × 0.88 = 22A adjusted ampacity
                </p>
              </div>
            </div>
          </div>

          {/* Bundle Adjustment Factors */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              Conductor Bundle Adjustment Factors
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Current-Carrying Conductors</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-purple-100">
                          <th className="px-3 py-2 text-left">Number of Conductors</th>
                          <th className="px-3 py-2 text-center">Adjustment Factor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="bg-green-50">
                          <td className="px-3 py-2">1-3</td>
                          <td className="px-3 py-2 text-center font-mono font-semibold">1.00</td>
                        </tr>
                        {BUNDLE_DERATING.map((row) => (
                          <tr key={row.conductors} className="hover:bg-gray-50">
                            <td className="px-3 py-2">{row.conductors}</td>
                            <td className="px-3 py-2 text-center font-mono">{row.factor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4">Calculation Example</h3>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm mb-3">
                      <strong>Scenario:</strong> Six #10 AWG THHN copper conductors in conduit
                    </p>
                    <ol className="text-sm space-y-2">
                      <li>1. Base ampacity (75°C): 35A</li>
                      <li>2. Bundle factor (6 conductors): 0.80</li>
                      <li>3. Adjusted ampacity: 35A × 0.80 = <strong className="text-purple-700">28A</strong></li>
                    </ol>
                    <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                      <Info className="w-4 h-4 text-purple-600 inline mr-2" />
                      <span className="text-xs">Neutral conductors carrying only unbalanced load are not counted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Applications Reference */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Common Circuit Applications
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-600 to-teal-500 text-white">
                      <th className="px-4 py-3 text-left">Circuit Type</th>
                      <th className="px-4 py-3 text-center">Copper Wire</th>
                      <th className="px-4 py-3 text-center">Aluminum Wire</th>
                      <th className="px-4 py-3 text-center">Temp Rating</th>
                      <th className="px-4 py-3 text-left">Common Uses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {COMMON_APPLICATIONS.map((app, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-3 font-semibold">{app.circuit}</td>
                        <td className="px-4 py-3 text-center font-mono text-orange-600">{app.copper}</td>
                        <td className="px-4 py-3 text-center font-mono text-gray-600">{app.aluminum}</td>
                        <td className="px-4 py-3 text-center">{app.temp}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{app.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Calculator & Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-blue-600" />
              Related Calculators & Tools
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/calculators/wire-size-calculator" 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500">
                <Calculator className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Wire Size Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">Calculate proper wire size for any circuit</p>
                <span className="text-blue-600 font-semibold flex items-center gap-1">
                  Try Calculator <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/calculators/voltage-drop-calculator" 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-500">
                <Zap className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Voltage Drop Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">Check voltage drop for long runs</p>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  Calculate Drop <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/calculators/ampacity-calculator" 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border-2 border-transparent hover:border-purple-500">
                <FileText className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Ampacity Lookup</h3>
                <p className="text-sm text-gray-600 mb-4">Quick ampacity reference tool</p>
                <span className="text-purple-600 font-semibold flex items-center gap-1">
                  Look Up <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>

          {/* Key Points & Notes */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Important Notes & Exceptions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-semibold text-lg mb-4 text-indigo-700">Terminal Temperature Limitations</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Conductors with 90°C insulation can use 90°C ampacity only if terminations are rated 90°C</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Most residential/commercial equipment has 75°C terminations</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Circuits 100A or less: assume 60°C unless marked otherwise</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Circuits over 100A: may use 75°C if equipment is rated</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-semibold text-lg mb-4 text-red-700">When NOT to Use This Table</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Conductors in free air (use Table 310.17)</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Bare or covered conductors (use Table 310.21)</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Underground installations with specific conditions</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Motor circuits (see Article 430 for special requirements)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Authority References */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Authority References & Standards</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <a href="https://www.nfpa.org/codes-and-standards/nfpa-70-national-electrical-code" 
                target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-lg p-3 shadow hover:shadow-md transition-shadow">
                <Shield className="w-5 h-5 text-red-600 mb-1" />
                <div className="text-sm font-semibold">NFPA 70</div>
                <div className="text-xs text-gray-600">National Electrical Code</div>
              </a>
              <a href="https://www.ul.com/news/understanding-wire-and-cable" 
                target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-lg p-3 shadow hover:shadow-md transition-shadow">
                <Shield className="w-5 h-5 text-blue-600 mb-1" />
                <div className="text-sm font-semibold">UL Standards</div>
                <div className="text-xs text-gray-600">Wire & Cable Testing</div>
              </a>
              <a href="https://www.copper.org/applications/electrical/building/" 
                target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-lg p-3 shadow hover:shadow-md transition-shadow">
                <Shield className="w-5 h-5 text-orange-600 mb-1" />
                <div className="text-sm font-semibold">Copper Institute</div>
                <div className="text-xs text-gray-600">Technical Resources</div>
              </a>
              <a href="https://www.aluminum.org/resources/electrical" 
                target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-lg p-3 shadow hover:shadow-md transition-shadow">
                <Shield className="w-5 h-5 text-gray-600 mb-1" />
                <div className="text-sm font-semibold">Aluminum Assoc.</div>
                <div className="text-xs text-gray-600">Electrical Applications</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Download NEC Table 310.16 PDF</h3>
            <p className="text-gray-600 mb-4">Get a printable reference for field use</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Download PDF Reference
            </button>
          </div>
        </div>
      </section>

      {/* How to actually use NEC 310.16 — full step-by-step */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">How to Read and Apply NEC Table 310.16 — End-to-End</h2>
            <p className="text-gray-600 mb-8">
              Looking up a number in 310.16 is the easy part. Translating
              that number into a code-compliant conductor selection requires
              understanding which column to use, which derating factors
              apply, and how the table interacts with NEC 240.4(D), NEC
              110.14(C), NEC 310.15(B)(1) ambient correction, and NEC
              310.15(C)(1) bundling adjustment. This section walks through
              the full procedure with worked numbers.
            </p>

            {/* Anatomy */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Anatomy of NEC Table 310.16 — six columns, one row per AWG</h3>
              <p className="text-sm text-slate-700 mb-3">
                The table organizes ampacities by conductor material (copper
                or aluminum) and insulation temperature class (60&deg;C,
                75&deg;C, or 90&deg;C). The 90&deg;C column is the highest
                ampacity but is rarely the operative number — most equipment
                is rated for terminations at 75&deg;C maximum.
              </p>
              <div className="bg-blue-50 rounded p-4 text-sm space-y-2">
                <div className="font-semibold">Decision tree to pick the column:</div>
                <ol className="list-decimal list-inside space-y-1 text-slate-700">
                  <li>What is the LOWEST temperature rating in the circuit? (Conductor, breaker terminals, panel lugs, equipment terminals.) Per NEC 110.14(C), that lowest rating is the column you use.</li>
                  <li>Standard residential breakers (15&ndash;100 A frame) are rated 60&deg;C / 75&deg;C: use the 75&deg;C column for circuits 100 A and below per 110.14(C)(1)(a).</li>
                  <li>Standard breakers above 100 A frame are rated 75&deg;C only: use the 75&deg;C column.</li>
                  <li>The 90&deg;C column is used <strong>only</strong> as a starting point for derating calculations, never as the final ampacity unless every termination is rated 90&deg;C (rare; UL listed industrial equipment).</li>
                </ol>
              </div>
            </div>

            {/* Step-by-step calculation */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Worked example — 8 AWG THHN in a 105&deg;F attic with 6 conductors in conduit</h3>
              <p className="text-sm text-slate-700 mb-3">
                <strong>Scenario:</strong> 60 A continuous load (an EV
                charger). Run is 8 AWG THHN copper through 1&Prime; EMT in a
                hot attic. Ambient peaks at 105&deg;F = 41&deg;C. Six total
                current-carrying conductors in the same conduit (two parallel
                3-conductor cable runs, neutral counted as current-carrying
                because the load is non-linear, e.g., switch-mode EV charger).
              </p>
              <div className="bg-blue-50 rounded p-4 font-mono text-sm space-y-1">
                <div>Step 1 — Continuous-load 125% (NEC 210.19):</div>
                <div>     1.25 &times; 60 A = 75 A required circuit ampacity</div>
                <div></div>
                <div>Step 2 — Look up base ampacity in 90&deg;C column for derating start:</div>
                <div>     8 AWG THHN copper @ 90&deg;C = 55 A (per NEC 310.16)</div>
                <div></div>
                <div>Step 3 — Ambient-temperature correction (310.15(B)(1) at 41&deg;C ambient, 90&deg;C column):</div>
                <div>     factor = 0.87 → 55 &times; 0.87 = 47.85 A</div>
                <div></div>
                <div>Step 4 — Conductor-bundling adjustment (310.15(C)(1) for 6 CCCs):</div>
                <div>     factor = 0.80 → 47.85 &times; 0.80 = <strong>38.3 A adjusted ampacity</strong></div>
                <div></div>
                <div>Step 5 — Compare to required (75 A):</div>
                <div>     38.3 A &lt; 75 A → 8 AWG IS NOT ADEQUATE</div>
                <div></div>
                <div>Step 6 — Try 6 AWG THHN @ 90&deg;C = 75 A:</div>
                <div>     75 &times; 0.87 &times; 0.80 = <strong>52.2 A — still inadequate</strong></div>
                <div></div>
                <div>Step 7 — Try 4 AWG THHN @ 90&deg;C = 95 A:</div>
                <div>     95 &times; 0.87 &times; 0.80 = <strong>66.1 A — still under 75 A</strong></div>
                <div></div>
                <div>Step 8 — Try 3 AWG THHN @ 90&deg;C = 115 A:</div>
                <div>     115 &times; 0.87 &times; 0.80 = <strong>80.0 A &ge; 75 A ✓</strong></div>
                <div></div>
                <div>Step 9 — Cap at 75&deg;C termination column (NEC 110.14(C)):</div>
                <div>     3 AWG @ 75&deg;C = 100 A (above derated 80 A — termination is not the limit here)</div>
                <div></div>
                <div className="font-bold">Final answer: 3 AWG THHN copper, 60 A breaker, 4 AWG NEC 250.122 EGC</div>
              </div>
              <p className="text-sm text-slate-700 mt-3">
                Without derating, you might naively pick 6 AWG (rated 65 A
                at 75&deg;C, &gt; 60 A load with 125 % factor). The combined
                hot-attic + bundled-conductor derate eats into ampacity so
                fast that you have to upsize <strong>two AWG steps</strong>.
                This is why every NEC-compliant calculator must check ambient
                and bundling — picking from the table alone routinely
                undersizes hot-attic runs.
              </p>
            </div>

            {/* Engineering supervision exception */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-3">NEC 310.15(B)(7) — engineering supervision exception</h3>
              <p className="text-sm text-slate-700 mb-3">
                Industrial occupancies under engineering supervision can
                replace the tabular ampacity values with calculations from
                the Neher-McGrath equation (NEC 310.15(B)(7)). This produces
                higher ampacities for buried conductors with favorable thermal
                conditions but requires a registered professional engineer&rsquo;s
                stamp on the calculation.
              </p>
              <div className="bg-blue-50 rounded p-3 font-mono text-xs space-y-1">
                <div>Neher-McGrath form: I&sup2; = (T_c &minus; T_a &minus; &Delta;T_d) / (R_dc &times; (1 + Y_c) &times; R&sub;CA&sub;)</div>
                <div>where:</div>
                <div>  T_c = max conductor temp, T_a = ambient, &Delta;T_d = dielectric loss heating</div>
                <div>  R_dc = DC resistance, Y_c = AC/DC resistance ratio (skin + proximity effects)</div>
                <div>  R&sub;CA&sub; = thermal resistance of insulation, jacket, and surrounding earth</div>
              </div>
              <p className="text-sm text-slate-700 mt-3">
                For most field work, the tabular values in NEC 310.16 are
                conservative and adequate. The Neher-McGrath exception comes
                up almost exclusively in utility duct-bank design and large
                data-center power distribution.
              </p>
            </div>

            {/* Common errors */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Five common 310.16 mistakes</h3>
              <ol className="text-sm list-decimal list-inside space-y-2 text-slate-700">
                <li><strong>Reading the wrong column.</strong> Pulling 8 AWG copper at 55 A (90&deg;C column) for a 50 A circuit when the breaker terminals are rated 75&deg;C and the actual ampacity is 50 A. NEC 110.14(C) caps at the lowest termination temperature.</li>
                <li><strong>Forgetting NEC 240.4(D).</strong> 12 AWG&rsquo;s 75&deg;C ampacity is 25 A but the maximum OCPD is 20 A. The conductor can carry 25 A, but you can&rsquo;t install a 25 A breaker on it.</li>
                <li><strong>Skipping NEC 334.80 for NM-B (Romex).</strong> NM-B cable conductors are 90&deg;C insulated but NEC 334.80 explicitly requires the 60&deg;C ampacity column for sizing. 12 AWG NM-B has 20 A ampacity, not 25 A.</li>
                <li><strong>Cumulative derating in the wrong order.</strong> 90&deg;C ampacity &times; ambient factor &times; bundling factor → then compare to 75&deg;C termination cap. Some practitioners skip the 90&deg;C starting point and derate from the 75&deg;C value, which under-utilizes high-temperature insulation.</li>
                <li><strong>Counting neutrals incorrectly.</strong> A balanced 3-phase wye circuit&rsquo;s neutral is NOT current-carrying for derating purposes (NEC 310.15(B)(5)). But on a 3-phase circuit with a major non-linear (harmonic) load, the neutral DOES count due to triplen harmonic current. Get this wrong and you over-derate or under-derate.</li>
              </ol>
            </div>

            {/* Connection to NEC 240.4 */}
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-amber-900 mb-3">NEC 310.16 only sets ampacity — overcurrent protection is a separate calculation</h3>
              <p className="text-sm text-slate-700 mb-2">
                The output of NEC 310.16 (after all derating) is the maximum
                continuous current the conductor can carry. It is NOT the
                breaker size. To pick the breaker:
              </p>
              <ol className="text-sm list-decimal list-inside space-y-1 text-slate-700">
                <li><strong>NEC 240.4(D)</strong> — small-conductor rule caps OCPD at 15/20/30 A for 14/12/10 AWG copper.</li>
                <li><strong>NEC 240.6(A)</strong> — standard breaker sizes are 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 500, 600, 700, 800, 1000, 1200, 1600, 2000, 2500, 3000, 4000, 5000, 6000.</li>
                <li><strong>NEC 240.4(B)</strong> — next standard size up is OK if the conductor ampacity falls between standard sizes (the &ldquo;next-size-up rule&rdquo;).</li>
                <li><strong>NEC 210.19(A) / 215.2(A)</strong> — for continuous loads, the OCPD must be at least 125 % of the continuous portion.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <ArticleSchema article={articleData} />
      <DatasetSchema
        path="/guides/nec-table-310-16"
        name="NEC Table 310.16 — Allowable Ampacities of Insulated Conductors"
        alternateName={['NEC 310.16 Conductor Ampacity Table', 'NEC 2023 Table 310.16']}
        description="Complete NEC 2023 Table 310.16 ampacity data for copper and aluminum conductors at 60°C, 75°C, and 90°C insulation temperatures, from 14 AWG through 1000 kcmil. Includes ambient-temperature correction factors per NEC 310.15(B)(1) and conductor-bundling adjustment factors per NEC 310.15(C)(1)."
        variableMeasured={[
          { name: 'AWG / kcmil size', description: 'Conductor size designation (AWG for 14–4/0, kcmil thereafter)' },
          { name: 'Conductor material', description: 'Copper or aluminum / copper-clad aluminum' },
          { name: 'Insulation temperature rating', description: '60°C, 75°C, or 90°C insulation system', unitText: 'degree Celsius', unitCode: 'CEL' },
          { name: 'Allowable ampacity', description: 'Maximum continuous current per NEC 310.16 at 30°C ambient, ≤3 current-carrying conductors in raceway / cable / earth', unitText: 'ampere', unitCode: 'AMP' },
        ]}
        keywords={['NEC 310.16', 'wire ampacity', 'AWG ampacity table', 'electrical conductor capacity', 'copper ampacity', 'aluminum ampacity', 'NEC 2023', 'electrical code']}
        citation="NFPA 70 (National Electrical Code) 2023 edition, Article 310, Table 310.16"
        spatialCoverage="United States"
        datePublished={articleData.datePublished}
        dateModified={articleData.dateModified}
      />
    </div>
  );
}