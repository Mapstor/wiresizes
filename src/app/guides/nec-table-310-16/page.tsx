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

export const metadata: Metadata = {
  title: 'NEC Table 310.16 Complete Reference | Copper & Aluminum Ampacities',
  description: 'Complete NEC Table 310.16 reference with copper and aluminum conductor ampacities at 60°C, 75°C, and 90°C. Derating factors, correction calculations, and code compliance guide.',
  keywords: 'NEC Table 310.16, ampacity table, wire ampacity, conductor ampacity, NEC 2023, electrical code, copper ampacity, aluminum ampacity',
};

// Complete NEC Table 310.16 Data
const NEC_310_16_DATA = [
  { awg: '14', copper60: 15, copper75: 20, copper90: 25, aluminum60: '—', aluminum75: '—', aluminum90: '—' },
  { awg: '12', copper60: 20, copper75: 25, copper90: 30, aluminum60: 15, aluminum75: 20, aluminum90: 25 },
  { awg: '10', copper60: 30, copper75: 35, copper90: 40, aluminum60: 25, aluminum75: 30, aluminum90: 35 },
  { awg: '8', copper60: 40, copper75: 50, copper90: 55, aluminum60: 35, aluminum75: 40, aluminum90: 45 },
  { awg: '6', copper60: 55, copper75: 65, copper90: 75, aluminum60: 40, aluminum75: 50, aluminum90: 55 },
  { awg: '4', copper60: 70, copper75: 85, copper90: 95, aluminum60: 55, aluminum75: 65, aluminum90: 75 },
  { awg: '3', copper60: 85, copper75: 100, copper90: 115, aluminum60: 65, aluminum75: 75, aluminum90: 85 },
  { awg: '2', copper60: 95, copper75: 115, copper90: 130, aluminum60: 75, aluminum75: 90, aluminum90: 100 },
  { awg: '1', copper60: 110, copper75: 130, copper90: 145, aluminum60: 85, aluminum75: 100, aluminum90: 115 },
  { awg: '1/0', copper60: 125, copper75: 150, copper90: 170, aluminum60: 100, aluminum75: 120, aluminum90: 135 },
  { awg: '2/0', copper60: 145, copper75: 175, copper90: 195, aluminum60: 115, aluminum75: 135, aluminum90: 150 },
  { awg: '3/0', copper60: 165, copper75: 200, copper90: 225, aluminum60: 130, aluminum75: 155, aluminum90: 175 },
  { awg: '4/0', copper60: 195, copper75: 230, copper90: 260, aluminum60: 150, aluminum75: 180, aluminum90: 205 },
  { awg: '250', copper60: 215, copper75: 255, copper90: 290, aluminum60: 170, aluminum75: 205, aluminum90: 230 },
  { awg: '300', copper60: 240, copper75: 285, copper90: 320, aluminum60: 190, aluminum75: 230, aluminum90: 260 },
  { awg: '350', copper60: 260, copper75: 310, copper90: 350, aluminum60: 210, aluminum75: 250, aluminum90: 280 },
  { awg: '400', copper60: 280, copper75: 335, copper90: 380, aluminum60: 225, aluminum75: 270, aluminum90: 305 },
  { awg: '500', copper60: 320, copper75: 380, copper90: 430, aluminum60: 260, aluminum75: 310, aluminum90: 350 },
  { awg: '600', copper60: 350, copper75: 420, copper90: 475, aluminum60: 285, aluminum75: 340, aluminum90: 385 },
  { awg: '750', copper60: 385, copper75: 460, copper90: 520, aluminum60: 315, aluminum75: 375, aluminum90: 425 },
  { awg: '1000', copper60: 445, copper75: 535, copper90: 615, aluminum60: 370, aluminum75: 445, aluminum90: 500 },
];

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
    </div>
  );
}