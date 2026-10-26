import Link from 'next/link';
import { Target, AlertTriangle, CheckCircle, Calculator, Zap, ArrowRight, Shield, Activity, Eye, TrendingUp, BarChart3 } from 'lucide-react';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { getArticleDates } from '@/lib/article-dates';

export const metadata = {
  title: 'NEC Code Compliance — 2023 Branch Circuits',
  description: 'Procedure for designing branch circuits: OCPD (240), grounding.',
  keywords: 'NEC code, National Electrical Code, electrical compliance, wire sizing code, circuit protection, electrical safety',
  alternates: { canonical: '/guides/nec-code-compliance' },
};

const SAFETY_REQUIREMENTS = [
  { 
    area: 'GFCI Protection', 
    requirement: 'Required in bathrooms, kitchens, outdoors, basements, garages', 
    nec_ref: '210.8', 
    violations: ['Missing GFCI in wet locations', 'Improper GFCI wiring'],
    solution: 'Install GFCI outlets or circuit breakers'
  },
];

// Article data for schema
const articleData = {
  headline: "NEC Code Compliance Guide",
  description: "Comprehensive NEC code compliance guide covering circuit protection, grounding, and safety requirements.",
  url: "https://wiresizes.com/guides/nec-code-compliance",
  ...getArticleDates('src/app/guides/nec-code-compliance/page.tsx'),
};

export default function NECCodeComplianceGuide() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border-2 border-amber-200">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-10 h-10 text-amber-600" />
            <h1 className="text-4xl font-bold text-gray-900">NEC Code Compliance Guide</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Master the National Electrical Code (NEC 2023) requirements for safe electrical installations.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/calculators/wire-size-calculator"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Wire Size Calculator
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Navigation</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="#overcurrent-protection" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-medium">Circuit Protection</span>
          </Link>
          <Link href="#grounding-systems" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="font-medium">Grounding Systems</span>
          </Link>
        </div>
      </div>

      {/* Overcurrent Protection */}
      <div id="overcurrent-protection" className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Overcurrent Protection Requirements</h2>
        </div>

        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-3">NEC 240.4 - Protection of Conductors</h3>
          <p className="text-sm text-green-700 mb-3">
            Conductors must be protected against overcurrent in accordance with their ampacities. 
            The overcurrent device rating cannot exceed the conductor ampacity, except for specific exceptions.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-800">Standard Sizes (Table 240.6(A)):</h4>
              <div className="font-mono text-green-700">10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100A...</div>
            </div>
            <div>
              <h4 className="font-medium text-green-800">Small Conductor Protection (240.4(D)):</h4>
              <div className="text-green-700">14 AWG Cu: 15A max, 12 AWG Cu: 20A max, 10 AWG Cu: 30A max</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Common Violations
            </h3>
            <ul className="space-y-2 text-sm text-red-700">
              <li>• Oversized breakers for wire capacity</li>
              <li>• Missing GFCI/AFCI protection</li>
              <li>• Shared neutrals without proper protection</li>
              <li>• Incorrect motor circuit protection</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Inspection Points
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Verify breaker size matches wire rating</li>
              <li>• Check for proper arc fault protection</li>
              <li>• Confirm GFCI in required locations</li>
              <li>• Validate motor overload protection</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Best Practices
            </h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li>• Apply derating factors properly</li>
              <li>• Install proper OCPD coordination</li>
              <li>• Document all calculations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Grounding Systems */}
      <div id="grounding-systems" className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Grounding & Bonding Systems</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">NEC Article 250 - Grounding Requirements</h3>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Grounding Electrode System (250.50)</h4>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li>• Metal water pipe (250.52(A)(1))</li>
                  <li>• Concrete-encased electrode (250.52(A)(3))</li>
                  <li>• Ground ring (250.52(A)(4))</li>
                  <li>• Rod and pipe electrodes (250.52(A)(5))</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Equipment Grounding (250.118)</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Equipment grounding conductors</li>
                  <li>• Conduit systems (rigid, IMC, EMT)</li>
                  <li>• Cable armor and sheaths</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200 p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">Grounding System Diagram</h3>
          <div className="bg-white rounded-lg p-4 mb-4">
            {/* SVG Grounding System Diagram */}
            <svg viewBox="0 0 600 400" className="w-full h-64">
              {/* Service Panel */}
              <rect x="50" y="50" width="100" height="150" fill="#e5e7eb" stroke="#374151" strokeWidth="2" />
              <text x="100" y="40" textAnchor="middle" className="text-sm font-semibold fill-gray-700">Service Panel</text>
              
              {/* Grounding Electrode Conductor */}
              <line x1="150" y1="125" x2="250" y2="125" stroke="#22c55e" strokeWidth="3" />
              <text x="200" y="115" textAnchor="middle" className="text-xs fill-green-600">GEC</text>
              
              {/* Grounding Electrode */}
              <circle cx="270" cy="125" r="15" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
              <text x="270" y="150" textAnchor="middle" className="text-xs fill-amber-600">Electrode</text>
              
              {/* Equipment Grounding Conductor */}
              <line x1="100" y1="200" x2="100" y2="300" stroke="#3b82f6" strokeWidth="3" />
              <line x1="100" y1="300" x2="200" y2="300" stroke="#3b82f6" strokeWidth="3" />
              
              {/* Load Equipment */}
              <rect x="200" y="280" width="60" height="40" fill="#f3f4f6" stroke="#6b7280" strokeWidth="2" />
              <text x="230" y="305" textAnchor="middle" className="text-xs fill-gray-600">Load</text>
              
              {/* Grounding symbols */}
              <g>
                <line x1="265" y1="140" x2="275" y2="140" stroke="#000" strokeWidth="2" />
                <line x1="267" y1="145" x2="273" y2="145" stroke="#000" strokeWidth="2" />
                <line x1="269" y1="150" x2="271" y2="150" stroke="#000" strokeWidth="2" />
              </g>
              
              {/* Labels */}
              <text x="400" y="80" className="text-sm font-semibold fill-gray-700">Grounding System Components:</text>
              <text x="400" y="105" className="text-xs fill-green-600">• GEC: Grounding Electrode Conductor</text>
              <text x="400" y="125" className="text-xs fill-blue-600">• EGC: Equipment Grounding Conductor</text>
              <text x="400" y="145" className="text-xs fill-amber-600">• Grounding Electrode (Rod, Ufer, etc.)</text>
              <text x="400" y="165" className="text-xs fill-gray-600">• Main Bonding Jumper in Panel</text>
            </svg>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-100 rounded p-3">
              <h4 className="font-medium text-green-800">Grounding Electrode Conductor</h4>
              <p className="text-green-700">Connects electrical system to earth via grounding electrodes</p>
            </div>
            <div className="bg-blue-100 rounded p-3">
              <h4 className="font-medium text-blue-800">Equipment Grounding Conductor</h4>
              <p className="text-blue-700">Provides fault current return path for safety</p>
            </div>
            <div className="bg-amber-100 rounded p-3">
              <h4 className="font-medium text-amber-800">Bonding Jumpers</h4>
              <p className="text-amber-700">Ensures electrical continuity in the grounding system</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/calculators/ground-wire-calculator"
            className="inline-flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
          >
            <Zap className="w-5 h-5" />
            Ground Wire Calculator
          </Link>
        </div>
      </div>

      {/* Voltage Drop Requirements */}
      <div className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Voltage Drop</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3">Voltage Drop Formula</h3>
            <div className="bg-white rounded p-3 mb-3">
              <div className="font-mono text-center">
                <div className="text-lg">VD = (2 × K × I × L) ÷ CM</div>
                <div className="text-sm text-gray-600 mt-2">
                  Single-phase and DC circuits
                </div>
              </div>
            </div>
            <div className="bg-white rounded p-3">
              <div className="font-mono text-center">
                <div className="text-lg">VD = (1.73 × K × I × L) ÷ CM</div>
                <div className="text-sm text-gray-600 mt-2">
                  Three-phase circuits
                </div>
              </div>
            </div>
            <div className="text-xs text-blue-700 mt-3">
              Where: VD = Voltage Drop, K = Resistance constant (10.371 Cu, 17.002 Al at 20 °C), 
              I = Current (A), L = Length (ft), CM = Circular Mils
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3">Impact of Excessive Voltage Drop</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500" />
                <span>Reduced equipment efficiency and lifespan</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500" />
                <span>Motor overheating and poor starting</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500" />
                <span>Lighting dimming and flickering</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500" />
                <span>Increased energy consumption</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500" />
                <span>Equipment malfunction or damage</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/calculators/voltage-drop-calculator"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            Voltage Drop Calculator
          </Link>
        </div>
      </div>

      {/* Safety Requirements */}
      <div className="bg-white rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Critical Safety Requirements</h2>
        </div>

        <div className="space-y-6">
          {SAFETY_REQUIREMENTS.map((req, index) => (
            <div key={index} className="border-l-4 border-red-500 bg-red-50 rounded-r-lg p-6">
              <h3 className="text-xl font-semibold text-red-900 mb-2">{req.area}</h3>
              <p className="text-red-800 mb-4">{req.requirement}</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">NEC Reference:</h4>
                  <div className="bg-white rounded p-2 font-mono text-blue-600">{req.nec_ref}</div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Common Violations:</h4>
                  <ul className="text-sm text-red-700">
                    {req.violations.map((violation, vIndex) => (
                      <li key={vIndex} className="flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {violation}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Solution:</h4>
                  <div className="text-sm text-red-700 bg-white rounded p-2">
                    {req.solution}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Tools */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related calculators</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Wire Size Calculator', slug: 'wire-size-calculator', icon: Calculator, color: 'blue', description: 'Wire sizing' },
            { name: 'Ampacity Calculator', slug: 'ampacity-calculator', icon: BarChart3, color: 'green', description: 'Derating factors included' },
            { name: 'Ground Wire Calculator', slug: 'ground-wire-calculator', icon: Zap, color: 'yellow', description: 'Table 250.122 sizing' },
            { name: 'Voltage Drop Calculator', slug: 'voltage-drop-calculator', icon: Activity, color: 'indigo' },
          ].map((calc, index) => {
            const IconComponent = calc.icon;
            return (
              <Link 
                key={index} 
                href={`/calculators/${calc.slug}`}
                className={`block p-6 rounded-lg border hover:shadow-lg transition-all hover:border-${calc.color}-300`}
              >
                <div className={`w-12 h-12 bg-${calc.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-6 h-6 text-${calc.color}-600`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{calc.name}</h3>
                {calc.description && <p className="text-sm text-gray-600 mb-3">{calc.description}</p>}
                <div className={`text-${calc.color}-600 text-sm flex items-center gap-1`}>
                  Try Calculator <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Your NEC Education</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/calculators/wire-size-calculator"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            Wire Size Calculator
          </Link>
          <Link 
            href="/guides"
            className="border border-amber-600 text-amber-700 px-6 py-3 rounded-lg font-medium hover:bg-amber-50 transition-colors"
          >
            Electrical Guides
          </Link>
          <Link 
            href="/guides/electrical-power-calculations"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Power Calculations
          </Link>
        </div>
      </div>

      <ArticleSchema article={articleData} />
    </div>
  );
}