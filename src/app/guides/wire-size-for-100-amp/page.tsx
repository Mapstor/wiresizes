import { Metadata } from 'next';
import { 
  Zap, 
  Calculator, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Home,
  Wrench,
  DollarSign,
  Thermometer,
  MapPin,
  ArrowRight,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Wire Size for 100 Amp Service & Subpanel | Complete Guide 2024',
  description: 'Complete guide for 100 amp wire sizing. Learn correct wire sizes for 100A service entrance, subpanels, copper vs aluminum, distance considerations, and NEC code requirements.',
  keywords: '100 amp wire size, wire for 100 amp service, 100 amp subpanel wire, 100A electrical service, NEC 100 amp requirements',
};

// Distance-based wire sizing for 100A
const WIRE_SIZE_BY_DISTANCE = [
  { distance: '0-50 ft', copper: '3 AWG', aluminum: '1 AWG', voltageDrop: '<1%' },
  { distance: '50-100 ft', copper: '2 AWG', aluminum: '1/0 AWG', voltageDrop: '1-2%' },
  { distance: '100-150 ft', copper: '1 AWG', aluminum: '2/0 AWG', voltageDrop: '2-3%' },
  { distance: '150-200 ft', copper: '1/0 AWG', aluminum: '3/0 AWG', voltageDrop: '2.5-3.5%' },
  { distance: '200-250 ft', copper: '2/0 AWG', aluminum: '4/0 AWG', voltageDrop: '3-4%' },
  { distance: '250-300 ft', copper: '3/0 AWG', aluminum: '250 kcmil', voltageDrop: '3.5-4.5%' },
];

// Common 100A applications
const APPLICATIONS_100A = [
  { 
    type: 'Main Service', 
    description: 'Small home main panel', 
    copper: '3 AWG THHN', 
    aluminum: '1 AWG XHHW',
    conduit: '1¼" EMT',
    ground: '8 AWG copper'
  },
  { 
    type: 'Garage Subpanel', 
    description: 'Detached garage workshop', 
    copper: '3 AWG THHN', 
    aluminum: '1 AWG USE-2',
    conduit: '1¼" PVC',
    ground: '8 AWG copper'
  },
  { 
    type: 'Mobile Home', 
    description: 'Manufactured home feeder', 
    copper: '2 AWG SE cable', 
    aluminum: '1/0 AWG SE cable',
    conduit: 'Not required',
    ground: 'Included in cable'
  },
  { 
    type: 'Pool House', 
    description: 'Pool equipment subpanel', 
    copper: '3 AWG THWN', 
    aluminum: '1 AWG XHHW',
    conduit: '1¼" PVC',
    ground: '8 AWG copper'
  },
];

// Cost comparison
const COST_COMPARISON = [
  { material: 'Copper 3 AWG', costPerFoot: '$8.50', cost100ft: '$850', cost200ft: '$1,700' },
  { material: 'Copper 2 AWG', costPerFoot: '$11.20', cost100ft: '$1,120', cost200ft: '$2,240' },
  { material: 'Aluminum 1 AWG', costPerFoot: '$3.85', cost100ft: '$385', cost200ft: '$770' },
  { material: 'Aluminum 1/0 AWG', costPerFoot: '$4.60', cost100ft: '$460', cost200ft: '$920' },
];

// Installation requirements
const INSTALLATION_REQUIREMENTS = [
  { item: 'Main Breaker', spec: '100A 2-pole breaker', code: 'NEC 230.79' },
  { item: 'Wire Size (Copper)', spec: '#3 AWG minimum', code: 'NEC Table 310.16' },
  { item: 'Wire Size (Aluminum)', spec: '#1 AWG minimum', code: 'NEC Table 310.16' },
  { item: 'Ground Wire', spec: '#8 AWG copper', code: 'NEC Table 250.122' },
  { item: 'Conduit Size', spec: '1¼" minimum for 4 wires', code: 'NEC Chapter 9' },
  { item: 'Grounding Electrode', spec: '#6 AWG copper GEC', code: 'NEC 250.66' },
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
          <p className="text-xl text-blue-100">
            Complete specifications for 100A service entrance and subpanel installations
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-3xl font-bold text-yellow-400">#3 AWG</div>
              <div className="text-sm text-blue-100">Copper Wire</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-3xl font-bold text-gray-300">#1 AWG</div>
              <div className="text-sm text-blue-100">Aluminum Wire</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-3xl font-bold text-green-400">#8 AWG</div>
              <div className="text-sm text-blue-100">Ground Wire</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-3xl font-bold text-orange-400">1¼"</div>
              <div className="text-sm text-blue-100">Conduit Size</div>
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
                <strong>For 100 amp service, use #3 AWG copper wire or #1 AWG aluminum wire.</strong> For runs over 100 feet, 
                increase to #2 AWG copper or #1/0 AWG aluminum to compensate for voltage drop. Always use #8 AWG copper for 
                the equipment grounding conductor per NEC Table 250.122.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Wire Size by Distance Table */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Wire Size by Distance - 100 Amp Service
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                    <th className="px-4 py-3 text-left">Distance</th>
                    <th className="px-4 py-3 text-center">Copper Wire</th>
                    <th className="px-4 py-3 text-center">Aluminum Wire</th>
                    <th className="px-4 py-3 text-center">Voltage Drop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {WIRE_SIZE_BY_DISTANCE.map((row, index) => (
                    <tr key={index} className={index === 0 ? 'bg-green-50' : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 font-semibold">{row.distance}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono font-bold text-orange-600">{row.copper}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono font-bold text-gray-600">{row.aluminum}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-mono ${
                          parseFloat(row.voltageDrop) <= 3 ? 'text-green-600' : 'text-amber-600'
                        }`}>
                          {row.voltageDrop}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-blue-50 border-t border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> NEC recommends maximum 3% voltage drop for branch circuits, 5% total for feeders and branch circuits combined.
                </p>
              </div>
            </div>
          </div>

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
                      <span className="text-gray-500">Conduit:</span>
                      <span className="font-mono">{app.conduit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ground:</span>
                      <span className="font-mono text-green-600">{app.ground}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Cost Comparison - Copper vs Aluminum
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 to-emerald-500 text-white">
                    <th className="px-4 py-3 text-left">Wire Type</th>
                    <th className="px-4 py-3 text-center">Per Foot</th>
                    <th className="px-4 py-3 text-center">100 ft Run</th>
                    <th className="px-4 py-3 text-center">200 ft Run</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {COST_COMPARISON.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 font-semibold">
                        {row.material.includes('Copper') ? (
                          <span className="text-orange-600">{row.material}</span>
                        ) : (
                          <span className="text-gray-600">{row.material}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center font-mono">{row.costPerFoot}</td>
                      <td className="px-4 py-3 text-center font-mono font-semibold">{row.cost100ft}</td>
                      <td className="px-4 py-3 text-center font-mono font-semibold">{row.cost200ft}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-green-50 border-t border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Savings:</strong> Aluminum wire typically costs 50-65% less than copper for the same ampacity. 
                  Consider total project cost including terminations and labor.
                </p>
              </div>
            </div>
          </div>

          {/* Installation Requirements */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-orange-600" />
              Installation Requirements & Code References
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                    <p className="text-gray-600">Verify that 100A is sufficient for your needs using NEC Article 220 load calculations.</p>
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
                    <p className="text-gray-600">Choose wire based on distance: #3 AWG copper for short runs, upsize for longer distances.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="font-semibold mb-1">Install Conduit</h3>
                    <p className="text-gray-600">Run 1¼" conduit for 4 conductors (2 hots, 1 neutral, 1 ground).</p>
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
                    <p className="text-gray-600">Use proper torque specs and anti-oxidant compound for aluminum connections.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">7</div>
                  <div>
                    <h3 className="font-semibold mb-1">Install Grounding System</h3>
                    <p className="text-gray-600">Connect #8 AWG equipment ground and #6 AWG grounding electrode conductor.</p>
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
                    <span>Attics over 40°C (104°F): Derate to 88% capacity</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Use THHN-2 rated for 90°C in dry locations</span>
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
                <h3 className="font-semibold text-lg mb-2">Wire Size Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">Calculate exact wire size for any amperage</p>
                <span className="text-blue-600 font-semibold flex items-center gap-1">
                  Calculate Now <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/calculators/voltage-drop-calculator" 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-500">
                <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Voltage Drop Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">Check voltage drop for your installation</p>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  Check Drop <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/calculators/service-entrance-calculator" 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border-2 border-transparent hover:border-purple-500">
                <Home className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Service Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">Size complete service entrance</p>
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
                    <li>❌ Using #4 AWG copper (only rated for 85A at 75°C)</li>
                    <li>❌ Forgetting voltage drop for long runs</li>
                    <li>❌ Not accounting for continuous loads (125% rule)</li>
                    <li>❌ Using 60°C column instead of 75°C</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-3">Installation Errors</h3>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li>❌ Undersized conduit causing difficult pulls</li>
                    <li>❌ Missing anti-oxidant on aluminum connections</li>
                    <li>❌ Incorrect torque on terminals</li>
                    <li>❌ Wrong ground wire size (#10 instead of #8)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Authority References */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Professional Resources & Standards</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <a href="https://www.nfpa.org/codes-and-standards/nfpa-70-national-electrical-code" 
                target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-lg p-3 shadow hover:shadow-md transition-shadow">
                <Shield className="w-5 h-5 text-red-600 mb-1" />
                <div className="text-sm font-semibold">NFPA 70</div>
                <div className="text-xs text-gray-600">National Electrical Code</div>
              </a>
              <a href="https://www.mikeholt.com/" 
                target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-lg p-3 shadow hover:shadow-md transition-shadow">
                <Shield className="w-5 h-5 text-blue-600 mb-1" />
                <div className="text-sm font-semibold">Mike Holt</div>
                <div className="text-xs text-gray-600">NEC Training Resources</div>
              </a>
              <a href="https://iaei.org/" 
                target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-lg p-3 shadow hover:shadow-md transition-shadow">
                <Shield className="w-5 h-5 text-green-600 mb-1" />
                <div className="text-sm font-semibold">IAEI</div>
                <div className="text-xs text-gray-600">Electrical Inspectors</div>
              </a>
              <a href="https://www.southwire.com/calculator-conduit" 
                target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-lg p-3 shadow hover:shadow-md transition-shadow">
                <Shield className="w-5 h-5 text-orange-600 mb-1" />
                <div className="text-sm font-semibold">Southwire</div>
                <div className="text-xs text-gray-600">Wire & Cable Tools</div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}