import { Metadata } from 'next';
import { Zap, Calculator, AlertTriangle, CheckCircle, TrendingUp, Home, Wrench, Thermometer, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { articleDates } from '@/lib/page-dates';
import { Byline } from '@/components/content/Byline';
import { formatSize } from '@/lib/calculations/sizes';
import { gecForServiceConductor, serviceConductors } from '@/lib/calculations/service-lookup';
import { egcForOcpd } from '@/lib/calculations/grounding';
import { AMBIENT_ROWS } from '@/lib/calculations/ampacity';

// 100 A dwelling service: conductors from NEC Table 310.12 (data/verified/nec-310-12.json), grounding electrode
// conductor from Table 250.66, equipment grounding conductor from Table 250.122 for 100 A overcurrent protection
const SERVICE_100A = serviceConductors(100);
const CU_100A = formatSize(SERVICE_100A ? SERVICE_100A.cu : '4');
const AL_100A = formatSize(SERVICE_100A ? SERVICE_100A.alCca : '2');
const GEC_100A = gecForServiceConductor(SERVICE_100A ? SERVICE_100A.cu : '4', 'Cu');
const GEC_CU_100A = formatSize(GEC_100A ? GEC_100A.cu : '8');
const GEC_AL_100A = formatSize(GEC_100A ? GEC_100A.alCca : '6');
const EGC_100A = egcForOcpd(100);
const EGC_CU_100A = formatSize(EGC_100A ? EGC_100A.cu : '8');
const EGC_AL_100A = formatSize(EGC_100A ? EGC_100A.alCca : '6');
// Table 310.15(B)(1)(1), 41–45 °C row, 75 °C column (data/verified/nec-310-15-B-1-1.json)
const ATTIC_ROW = AMBIENT_ROWS.find((row) => row.key === '41–45');

export const metadata: Metadata = {
  title: 'Wire Size for 100 Amp Service',
  description: 'Wire size for a 100 A dwelling service: 4 AWG copper or 2 AWG aluminum (2023 NEC Table 310.12).',
  keywords: '100 amp wire size, wire for 100 amp service, 100 A electrical service, NEC 100 amp requirements',
  alternates: { canonical: '/guides/wire-size-for-100-amp' },
};

// Article data for schema
const articleData = {
  headline: '100 Amp Wire Size Guide',
  description: 'Complete guide for 100 amp wire sizing. Learn correct wire sizes for 100 A service entrance, copper vs aluminum, and NEC code requirements.',
  url: 'https://wiresizes.com/guides/wire-size-for-100-amp',
  ...articleDates('/guides/wire-size-for-100-amp'),
};

// Common 100A applications
const APPLICATIONS_100A = [
  {
    type: 'Main Service',
    description: 'Small home main panel',
    copper: CU_100A,
    aluminum: AL_100A,
    ground: `${GEC_CU_100A} copper`,
  },
];

// Installation requirements
const INSTALLATION_REQUIREMENTS = [
  { item: 'Main Breaker', spec: '100 A 2-pole breaker', code: 'NEC 230.79' },
  { item: 'Wire Size (Copper)', spec: `${CU_100A} (100 A dwelling service)`, code: 'NEC Table 310.12' },
  { item: 'Wire Size (Aluminum)', spec: `${AL_100A} (100 A dwelling service)`, code: 'NEC Table 310.12' },
  { item: 'Equipment grounding conductor (main power feeder)', spec: `${EGC_CU_100A} copper`, code: 'NEC Table 250.122' },
  { item: 'Grounding electrode conductor (service)', spec: `${GEC_CU_100A} copper`, code: 'NEC Table 250.66' },
];

export default function WireSizeFor100AmpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl font-bold">100 Amp Wire Size Guide</h1>
          </div>
          <Byline route="/guides/wire-size-for-100-amp" className="mb-4 text-sm text-blue-100" linkClassName="text-white underline" />
          <p className="text-xl text-blue-100">
            Complete specifications for 100 A service entrance
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-3xl font-bold text-yellow-400">{CU_100A}</div>
              <div className="text-sm text-blue-100">Copper Wire</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-3xl font-bold text-gray-300">{AL_100A}</div>
              <div className="text-sm text-blue-100">Aluminum Wire</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-3xl font-bold text-green-400">{EGC_CU_100A}</div>
              <div className="text-sm text-blue-100">Copper grounding conductor</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Answer Section */}
      <section className="py-6 bg-green-50 border-b border-green-200">
        <div className="container mx-auto px-4">
          <div className="flex gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h2 className="font-bold text-green-900 mb-2">Quick Answer: Wire Size for 100 Amp Service</h2>
              <p className="text-green-800">
                <strong>For a 100 A dwelling service or main power feeder, use {CU_100A} copper or {AL_100A} aluminum (2023 NEC Table 310.12).</strong>{' '}
                A service needs a grounding electrode conductor: {GEC_CU_100A} copper or {GEC_AL_100A} aluminum (NEC Table 250.66, values from NFPA&apos;s 2020 grounding fact sheet).
                If these conductors are the main power feeder, they carry an equipment grounding conductor instead: {EGC_CU_100A} copper or {EGC_AL_100A} aluminum (NEC Table 250.122).
                A feeder to a subpanel is sized from NEC Table 310.16: see the <Link href="/calculators/wire-size-calculator" className="text-primary-600 hover:text-primary-700 underline">wire size calculator</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Common Applications */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Home className="w-6 h-6 text-purple-600" />
              Common 100 Amp Applications
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {APPLICATIONS_100A.map((app, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-bold text-lg mb-2 text-purple-700">{app.type}</h3>
                  <p className="text-gray-600 mb-4">{app.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Copper:</span>
                      <span className="font-mono font-semibold text-orange-600">{app.copper}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Aluminum:</span>
                      <span className="font-mono font-semibold text-gray-600">{app.aluminum}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">GEC:</span>
                      <span className="font-mono text-green-600">{app.ground}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Installation Requirements */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-orange-600" />
              Installation Requirements & Code References
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-600 to-red-500 text-white">
                      <th className="px-4 py-3 text-left">Component</th>
                      <th className="px-4 py-3 text-left">Specification</th>
                      <th className="px-4 py-3 text-left">NEC Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {INSTALLATION_REQUIREMENTS.map((req, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-3 font-semibold">{req.item}</td>
                        <td className="px-4 py-3 font-mono text-sm">{req.spec}</td>
                        <td className="px-4 py-3 text-blue-600 font-mono text-sm">{req.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Step-by-Step Installation Guide */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              Step-by-Step Installation Guide
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Calculate Load Requirements</h3>
                    <p className="text-gray-600">Verify that 100 A is sufficient for your needs using NEC Article 220 load calculations.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Measure Distance</h3>
                    <p className="text-gray-600">Measure the actual wire run distance including vertical runs and bends.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Select Wire Size</h3>
                    <p className="text-gray-600">Choose wire based on distance: {CU_100A} copper or {AL_100A} aluminum for a 100 A dwelling service (Table 310.12), upsize for longer distances.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="font-semibold mb-1">Install Conduit</h3>
                    <p className="text-gray-600">Run conduit for the two ungrounded conductors and the neutral, plus an equipment grounding conductor if the run is the main power feeder.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
                  <div>
                    <h3 className="font-semibold mb-1">Pull Conductors</h3>
                    <p className="text-gray-600">Pull THHN/THWN-2 conductors through conduit, maintain proper color coding.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">6</div>
                  <div>
                    <h3 className="font-semibold mb-1">Make Terminations</h3>
                    <p className="text-gray-600">Use proper torque specs.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">7</div>
                  <div>
                    <h3 className="font-semibold mb-1">Install Grounding System</h3>
                    <p className="text-gray-600">Connect the {GEC_CU_100A} copper grounding electrode conductor at the service, or the {EGC_CU_100A} copper equipment grounding conductor on the main power feeder.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">8</div>
                  <div>
                    <h3 className="font-semibold mb-1">Test & Inspect</h3>
                    <p className="text-gray-600">Test insulation resistance, verify connections, and schedule inspection.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Temperature Considerations */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Thermometer className="w-6 h-6 text-red-600" />
              Temperature & Environmental Factors
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-lg mb-4 text-red-700">High Temperature Areas</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Attics at {ATTIC_ROW?.key} °C ({ATTIC_ROW?.ambientF} °F): {ATTIC_ROW?.f_75} in the 75 °C column (Table 310.15(B)(1)(1))</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Consider upsizing wire for extreme heat conditions</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-lg mb-4 text-blue-700">Wet Locations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Use THWN-2 or XHHW for wet locations</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Underground: USE-2 or direct burial cable</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Schedule 80 PVC for physical protection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Calculator Links */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-blue-600" />
              Related Calculators
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/calculators/wire-size-calculator" 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500">
                <Calculator className="w-8 h-8 text-blue-600 mb-3" />
                <h3 data-name="" className="font-semibold text-lg mb-2">Wire Size Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">Calculate the wire size for any amperage</p>
                <span className="text-blue-600 font-semibold flex items-center gap-1">
                  Calculate Now <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/calculators/voltage-drop-calculator" 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-500">
                <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
                <h3 data-name="" className="font-semibold text-lg mb-2">Voltage Drop Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">Check voltage drop for your installation</p>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  Check Drop <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/calculators/service-entrance-calculator" 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border-2 border-transparent hover:border-purple-500">
                <Home className="w-8 h-8 text-purple-600 mb-3" />
                <h3 data-name="" className="font-semibold text-lg mb-2">Service Calculator</h3>
                <span className="text-purple-600 font-semibold flex items-center gap-1">
                  Size Service <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              Common Mistakes to Avoid
            </h2>
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-amber-900 mb-3">Sizing Errors</h3>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li>❌ Forgetting voltage drop for long runs</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-3">Installation Errors</h3>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li>❌ Undersized conduit causing difficult pulls</li>
                    <li>❌ Incorrect torque on terminals</li>
                    <li>❌ Wrong ground wire size (10 AWG instead of 8 AWG)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      
      <ArticleSchema article={articleData} />
    </div>
  );
}