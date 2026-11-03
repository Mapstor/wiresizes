import { Metadata } from 'next';
import { FileText, Calculator, AlertTriangle, CheckCircle, Thermometer, BookOpen, Shield, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { DatasetSchema } from '@/components/seo/DatasetSchema';
import { articleDates } from '@/lib/page-dates';
import { Byline } from '@/components/content/Byline';
import table31016 from '../../../../data/verified/nec-310-16.json';
import corrections from '../../../../data/verified/nec-310-15-B-1-1.json';
import ratings from '../../../../data/verified/nec-240-6-a.json';
import { formatSize, isKcmil } from '@/lib/calculations/sizes';
import { ambientLabel } from '@/lib/calculations/ampacity';
import { serviceConductors } from '@/lib/calculations/service-lookup';

export const metadata: Metadata = {
  title: 'NEC Table 310.16 — Conductor Ampacities',
  description: 'Full NEC 2023 Table 310.16 ampacity for copper and aluminum at 60/75/90 °C, plus ambient correction (Table 310.15(B)(1)(1)) and bundling (Table 310.15(C)(1)).',
  keywords: 'NEC Table 310.16, ampacity table, wire ampacity, conductor ampacity, NEC 2023, electrical code, copper ampacity, aluminum ampacity',
  alternates: { canonical: '/guides/nec-table-310-16' },
};

// All 30 rows of NEC Table 310.16 (2023) from data/verified/nec-310-16.json
const NEC_310_16_DATA = table31016.rows.map((row) => ({
  size: row.size,
  copper60: row.cu_60 ?? '—',
  copper75: row.cu_75 ?? '—',
  copper90: row.cu_90 ?? '—',
  aluminum60: row.al_60 ?? '—',
  aluminum75: row.al_75 ?? '—',
  aluminum90: row.al_90 ?? '—',
}));

// All 16 rows of Table 310.15(B)(1)(1) from data/verified/nec-310-15-B-1-1.json
const factor = (value: number | null) => (value === null ? '—' : value.toFixed(2));
const TEMP_DERATING = corrections.rows.map((row) => ({
  key: row.ambient_c,
  ambient: ambientLabel({ key: row.ambient_c, ambientF: row.ambient_f, f_60: row.f_60, f_75: row.f_75, f_90: row.f_90 }),
  factor60: factor(row.f_60),
  factor75: factor(row.f_75),
  factor90: factor(row.f_90),
}));

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
const SERVICE_200A = serviceConductors(200);
const COMMON_APPLICATIONS = [
  { circuit: '15 A General Purpose', copper: '14 AWG', aluminum: '12 AWG', use: 'Lighting, receptacles' },
  { circuit: '20 A Kitchen/Bath', copper: '12 AWG', aluminum: '10 AWG', use: 'Small appliances, bathroom' },
  {
    circuit: '200 A Dwelling Service (Table 310.12)',
    copper: SERVICE_200A ? formatSize(SERVICE_200A.cu) : '—',
    aluminum: SERVICE_200A ? formatSize(SERVICE_200A.alCca) : '—',
    use: 'Main service entrance',
  },
];

// Article data for schema
const articleData = {
  headline: "NEC Table 310.16",
  description: "Complete NEC Table 310.16 reference with copper and aluminum conductor ampacities at 60 °C, 75 °C, and 90 °C. Derating factors and correction calculations.",
  url: "https://wiresizes.com/guides/nec-table-310-16",
  ...articleDates('/guides/nec-table-310-16'),
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
          <Byline route="/guides/nec-table-310-16" className="mb-4 text-sm text-blue-100" linkClassName="text-white underline" />
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
              <div className="text-xl font-bold">60 °C - 90 °C</div>
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
                (directly buried), based on an ambient temperature of 30 °C (86 °F). Adjustments required for different conditions.
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
                      <th className="px-3 py-2 text-center border-r border-blue-300 bg-orange-500">60 °C</th>
                      <th className="px-3 py-2 text-center border-r border-blue-300 bg-orange-500">75 °C</th>
                      <th className="px-3 py-2 text-center border-r border-blue-400 bg-orange-500">90 °C</th>
                      <th className="px-3 py-2 text-center border-r border-gray-300 bg-gray-500">60 °C</th>
                      <th className="px-3 py-2 text-center border-r border-gray-300 bg-gray-500">75 °C</th>
                      <th className="px-3 py-2 text-center bg-gray-500">90 °C</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {NEC_310_16_DATA.map((row, index) => (
                      <tr key={row.size} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-3 font-mono font-bold text-gray-900 border-r border-gray-200">
                          {row.size.includes('/') ? (
                            <span className="text-blue-600">{formatSize(row.size)}</span>
                          ) : isKcmil(row.size) ? (
                            <span className="text-purple-600">{formatSize(row.size)}</span>
                          ) : (
                            formatSize(row.size)
                          )}
                        </td>
                        <td className="px-3 py-3 text-center font-mono border-r border-orange-100 bg-orange-50">
                          {row.copper60}
                        </td>
                        <td className="px-3 py-3 text-center font-mono border-r border-orange-100 bg-orange-50">
                          {row.copper75}
                        </td>
                        <td className="px-3 py-3 text-center font-mono border-r border-gray-200 bg-orange-50">
                          {row.copper90}
                        </td>
                        <td className="px-3 py-3 text-center font-mono border-r border-gray-100 bg-gray-50">
                          {row.aluminum60}
                        </td>
                        <td className="px-3 py-3 text-center font-mono border-r border-gray-100 bg-gray-50">
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
                      <th className="px-4 py-3 text-center">60 °C</th>
                      <th className="px-4 py-3 text-center">75 °C</th>
                      <th className="px-4 py-3 text-center">90 °C</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {TEMP_DERATING.map((row, index) => (
                      <tr key={row.key} className={
                        row.key === '26–30'
                          ? 'bg-green-100 font-semibold'
                          : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }>
                        <td className="px-4 py-3">
                          {row.ambient}
                          {row.key === '26–30' && <span className="text-green-600 ml-2">(Standard)</span>}
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
                  <strong>Example:</strong> 12 AWG copper at 75 °C = 25 A. In 40 °C ambient: 25 A × 0.88 = 22 A adjusted ampacity
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
                      <th className="px-4 py-3 text-left">Common Uses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {COMMON_APPLICATIONS.map((app, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-3 font-semibold">{app.circuit}</td>
                        <td className="px-4 py-3 text-center font-mono text-orange-600">{app.copper}</td>
                        <td className="px-4 py-3 text-center font-mono text-gray-600">{app.aluminum}</td>
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
                <h3 data-name="" className="font-semibold text-lg mb-2">Wire Size Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">Calculate proper wire size for any circuit</p>
                <span className="text-blue-600 font-semibold flex items-center gap-1">
                  Try Calculator <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/calculators/voltage-drop-calculator" 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-500">
                <Zap className="w-8 h-8 text-green-600 mb-3" />
                <h3 data-name="" className="font-semibold text-lg mb-2">Voltage Drop Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">Check voltage drop for long runs</p>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  Calculate Drop <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/calculators/ampacity-calculator" 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border-2 border-transparent hover:border-purple-500">
                <FileText className="w-8 h-8 text-purple-600 mb-3" />
                <h3 data-name="" className="font-semibold text-lg mb-2">Ampacity Lookup</h3>
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to actually use NEC 310.16 — full step-by-step */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">How to Read and Apply NEC Table 310.16 — End-to-End</h2>

            {/* Anatomy */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Anatomy of NEC Table 310.16 — six columns, one row per AWG</h3>
              <p className="text-sm text-slate-700 mb-3">
                The table organizes ampacities by conductor material (copper
                or aluminum) and insulation temperature class (60 &deg;C,
                75 &deg;C, or 90 &deg;C).
              </p>
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
                <li><strong>NEC Table 240.6(A)</strong> — standard breaker sizes are {ratings.ratings_a.join(', ')}.</li>
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
        description="Complete NEC 2023 Table 310.16 ampacity data for copper and aluminum conductors at 60 °C, 75 °C, and 90 °C insulation temperatures, from 18 AWG through 2000 kcmil. Includes ambient-temperature correction factors per NEC Table 310.15(B)(1)(1) and conductor-bundling adjustment factors per NEC Table 310.15(C)(1)."
        variableMeasured={[
          { name: 'AWG / kcmil size', description: 'Conductor size designation (AWG for 18–4/0, kcmil thereafter)' },
          { name: 'Conductor material', description: 'Copper or aluminum / copper-clad aluminum' },
          { name: 'Insulation temperature rating', description: '60 °C, 75 °C, or 90 °C insulation system', unitText: 'degree Celsius', unitCode: 'CEL' },
          { name: 'Allowable ampacity', description: 'Maximum continuous current per NEC 310.16 at 30 °C ambient, ≤3 current-carrying conductors in raceway / cable / earth', unitText: 'ampere', unitCode: 'AMP' },
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