'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Calculator, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Activity, ArrowRight, Target } from 'lucide-react';
import { ArticleSchema } from '@/components/seo/ArticleSchema';

const VOLTAGE_SYSTEMS = [
  {
    type: 'Single-Phase',
    voltages: ['120V', '240V'],
    phases: 1,
    waveform_description: 'Simple sinusoidal waveform',
    power_formula: 'P = V × I × PF',
    applications: ['Residential homes', 'Small commercial', 'Light industrial'],
    advantages: ['Simple installation', 'Familiar to electricians', 'Good for resistive loads'],
    disadvantages: ['Limited power capacity', 'Motor starting issues', 'Voltage fluctuations', 'Higher current for same power'],
    color: 'blue'
  },
  {
    type: 'Three-Phase',
    voltages: ['208V', '240V', '480V', '600V'],
    phases: 3,
    waveform_description: 'Three sinusoidal waves 120° apart',
    power_formula: 'P = √3 × V × I × PF',
    applications: ['Industrial facilities', 'Large commercial', 'Motor drives', 'Heavy equipment'],
    advantages: ['Higher power density', 'Better motor performance', 'Balanced loading', 'More efficient transmission'],
    disadvantages: ['More complex wiring', 'Requires balanced loads'],
    color: 'purple'
  }
];

const WIRING_CONFIGURATIONS = [
  {
    name: 'Single-Phase 120V',
    wires: 2,
    description: 'Hot, Neutral',
    typical_use: 'Lighting, small appliances',
    voltage: '120V'
  },
  {
    name: 'Single-Phase 240V',
    wires: 3,
    description: 'Hot, Hot, Ground',
    typical_use: 'Water heaters, dryers, AC',
    voltage: '240V'
  },
  {
    name: 'Three-Phase Wye (Y)',
    wires: 4,
    description: '3 Hot, Neutral',
    typical_use: 'Balanced loads, lighting',
    voltage: '208V/120V, 480V/277V'
  },
  {
    name: 'Three-Phase Delta (Δ)',
    wires: 3,
    description: '3 Hot wires only',
    typical_use: 'Motor loads, heating',
    voltage: '240V, 480V'
  }
];

// Article data for schema
interface GuideProps {
  datePublished?: string;
  dateModified?: string;
}

export default function SingleVsThreePhaseGuide({ datePublished, dateModified }: GuideProps = {}) {
  const articleData = {
    headline: "Single vs Three Phase Systems",
    description: "Understanding the fundamental differences between single-phase and three-phase electrical systems is crucial for proper system design. This comprehensive guide covers voltage configurations, power calculations and applications with interactive comparisons.",
    url: "https://wiresizes.com/guides/single-vs-three-phase",
    datePublished,
    dateModified,
  };
  const [selectedComparison, setSelectedComparison] = useState<'voltage' | 'motor' | 'wiring'>('voltage');

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 border-2 border-purple-200">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Single vs Three Phase Systems</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Understanding the fundamental differences between single-phase and three-phase electrical systems 
            is crucial for proper system design. This comprehensive guide covers voltage configurations, 
            power calculations and applications with interactive comparisons.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/calculators/three-phase-calculator"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Three Phase Calculator
            </Link>
            <div className="flex items-center gap-2 text-sm text-purple-700">
              <Target className="w-4 h-4" />
              System Comparison
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Comparison Tabs */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive System Comparison</h2>
        
        <div className="mb-6">
          <div className="flex space-x-4 border-b overflow-x-auto -mx-2 px-2 whitespace-nowrap">
            <button
              onClick={() => setSelectedComparison('voltage')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                selectedComparison === 'voltage'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Voltage & Power
            </button>
            <button
              onClick={() => setSelectedComparison('motor')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                selectedComparison === 'motor'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Motor Performance
            </button>
            <button
              onClick={() => setSelectedComparison('wiring')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                selectedComparison === 'wiring'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Wiring Configurations
            </button>
          </div>
        </div>

        {/* Voltage & Power Comparison */}
        {selectedComparison === 'voltage' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {VOLTAGE_SYSTEMS.map((system) => (
                <div key={system.type} className={`bg-${system.color}-50 border border-${system.color}-200 rounded-lg p-6`}>
                  <h3 className={`text-xl font-bold text-${system.color}-900 mb-4`}>{system.type} Systems</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className={`font-semibold text-${system.color}-800`}>Common Voltages:</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {system.voltages.map((voltage) => (
                          <span key={voltage} className={`px-2 py-1 bg-${system.color}-200 text-${system.color}-800 rounded text-sm font-mono`}>
                            {voltage}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold text-${system.color}-800`}>Power Formula:</h4>
                      <div className={`bg-white rounded p-3 mt-2 border border-${system.color}-300`}>
                        <code className="font-mono text-sm">{system.power_formula}</code>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold text-${system.color}-800`}>Advantages:</h4>
                      <ul className="mt-2 space-y-1">
                        {system.advantages.map((advantage, index) => (
                          <li key={index} className={`text-sm text-${system.color}-700 flex items-center gap-2`}>
                            <CheckCircle className="w-4 h-4" />
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold text-${system.color}-800`}>Disadvantages:</h4>
                      <ul className="mt-2 space-y-1">
                        {system.disadvantages.map((disadvantage, index) => (
                          <li key={index} className={`text-sm text-${system.color}-700 flex items-center gap-2`}>
                            <AlertTriangle className="w-4 h-4" />
                            {disadvantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Waveform Visualization */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Voltage Waveform Comparison</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Single-Phase Waveform</h4>
                  <svg viewBox="0 0 400 200" className="w-full h-32 bg-white rounded border">
                    <defs>
                      <pattern id="grid-single" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="400" height="200" fill="url(#grid-single)" />
                    
                    {/* Single sine wave */}
                    <path
                      d={`M 0 100 ${Array.from({length: 400}, (_, i) => {
                        const x = i;
                        const y = 100 + 60 * Math.sin((i / 400) * 4 * Math.PI);
                        return `L ${x} ${y}`;
                      }).join(' ')}`}
                      fill="none"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="3"
                    />
                    
                    <text x="200" y="190" textAnchor="middle" className="text-xs fill-blue-600">
                      Single sinusoidal wave (120V or 240V)
                    </text>
                  </svg>
                </div>
                
                <div>
                  <h4 className="font-medium text-purple-800 mb-2">Three-Phase Waveform</h4>
                  <svg viewBox="0 0 400 200" className="w-full h-32 bg-white rounded border">
                    <defs>
                      <pattern id="grid-three" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="400" height="200" fill="url(#grid-three)" />
                    
                    {/* Three sine waves 120° apart */}
                    <path
                      d={`M 0 100 ${Array.from({length: 400}, (_, i) => {
                        const x = i;
                        const y = 100 + 40 * Math.sin((i / 400) * 4 * Math.PI);
                        return `L ${x} ${y}`;
                      }).join(' ')}`}
                      fill="none"
                      stroke="rgb(239, 68, 68)"
                      strokeWidth="2"
                    />
                    <path
                      d={`M 0 100 ${Array.from({length: 400}, (_, i) => {
                        const x = i;
                        const y = 100 + 40 * Math.sin((i / 400) * 4 * Math.PI + 2 * Math.PI / 3);
                        return `L ${x} ${y}`;
                      }).join(' ')}`}
                      fill="none"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="2"
                    />
                    <path
                      d={`M 0 100 ${Array.from({length: 400}, (_, i) => {
                        const x = i;
                        const y = 100 + 40 * Math.sin((i / 400) * 4 * Math.PI + 4 * Math.PI / 3);
                        return `L ${x} ${y}`;
                      }).join(' ')}`}
                      fill="none"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                    />
                    
                    <text x="200" y="190" textAnchor="middle" className="text-xs fill-purple-600">
                      Three waves 120° apart (L1, L2, L3)
                    </text>
                  </svg>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Phase A (L1)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Phase B (L2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Phase C (L3)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Motor Performance Comparison */}
        {selectedComparison === 'motor' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Motor Performance Impact</h3>
              <p className="text-sm text-yellow-700">
                Three-phase motors offer significant advantages over single-phase motors including better starting torque, 
                higher efficiency, and lower operating current.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3">Single-Phase Motor Limitations</h4>
                <ul className="text-sm text-red-700 space-y-2">
                  <li>• Poor starting torque without capacitors</li>
                  <li>• Lower efficiency, especially at partial loads</li>
                  <li>• Unbalanced magnetic field</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Three-Phase Motor Advantages</h4>
                <ul className="text-sm text-green-700 space-y-2">
                  <li>• Excellent starting torque</li>
                  <li>• Higher efficiency across load range</li>
                  <li>• Available in all sizes</li>
                  <li>• Balanced rotating magnetic field</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Wiring Configurations */}
        {selectedComparison === 'wiring' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {WIRING_CONFIGURATIONS.map((config, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl leading-tight font-semibold text-gray-900 mb-3">{config.name}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Conductors:</span>
                      <span className="font-semibold ml-2">{config.wires} wire{config.wires > 1 ? 's' : ''}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Configuration:</span>
                      <span className="font-mono ml-2">{config.description}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Voltage:</span>
                      <span className="font-mono ml-2">{config.voltage}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Use:</span>
                      <span className="ml-2">{config.typical_use}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Wiring Diagrams */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Wiring Configuration Diagrams</h3>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Single-Phase Diagram */}
                <div>
                  <h4 className="font-medium text-blue-800 mb-4">Single-Phase 240V (Split-Phase)</h4>
                  <svg viewBox="0 0 400 300" className="w-full h-64 bg-white rounded border">
                    {/* Panel representation */}
                    <rect x="50" y="50" width="80" height="120" fill="#e5e7eb" stroke="#374151" strokeWidth="2" />
                    <text x="90" y="40" textAnchor="middle" className="text-sm font-semibold fill-gray-700">Panel</text>
                    
                    {/* Hot wires */}
                    <line x1="130" y1="80" x2="250" y2="80" stroke="#dc2626" strokeWidth="3" />
                    <line x1="130" y1="140" x2="250" y2="140" stroke="#000000" strokeWidth="3" />
                    
                    {/* Load */}
                    <rect x="250" y="100" width="80" height="40" fill="#f3f4f6" stroke="#6b7280" strokeWidth="2" />
                    <text x="290" y="125" textAnchor="middle" className="text-sm fill-gray-700">Load</text>
                    
                    {/* Labels */}
                    <text x="190" y="75" textAnchor="middle" className="text-xs fill-red-600">L1 (Hot) 120V</text>
                    <text x="190" y="135" textAnchor="middle" className="text-xs fill-black">L2 (Hot) 120V</text>
                    <text x="350" y="125" className="text-xs fill-gray-600">240V Load</text>
                    
                    {/* Voltage indication */}
                    <text x="200" y="180" textAnchor="middle" className="text-sm font-semibold fill-blue-700">
                      240V between L1 and L2
                    </text>
                  </svg>
                </div>

                {/* Three-Phase Diagram */}
                <div>
                  <h4 className="font-medium text-purple-800 mb-4">Three-Phase (Wye Configuration)</h4>
                  <svg viewBox="0 0 400 300" className="w-full h-64 bg-white rounded border">
                    {/* Panel representation */}
                    <rect x="50" y="50" width="80" height="150" fill="#e5e7eb" stroke="#374151" strokeWidth="2" />
                    <text x="90" y="40" textAnchor="middle" className="text-sm font-semibold fill-gray-700">Panel</text>
                    
                    {/* Three hot wires */}
                    <line x1="130" y1="80" x2="250" y2="80" stroke="#dc2626" strokeWidth="3" />
                    <line x1="130" y1="120" x2="250" y2="120" stroke="#16a34a" strokeWidth="3" />
                    <line x1="130" y1="160" x2="250" y2="160" stroke="#2563eb" strokeWidth="3" />
                    <line x1="130" y1="180" x2="250" y2="180" stroke="#6b7280" strokeWidth="2" />
                    
                    {/* Load */}
                    <rect x="250" y="110" width="80" height="60" fill="#f3f4f6" stroke="#6b7280" strokeWidth="2" />
                    <text x="290" y="145" textAnchor="middle" className="text-sm fill-gray-700">3φ Load</text>
                    
                    {/* Labels */}
                    <text x="190" y="75" textAnchor="middle" className="text-xs fill-red-600">L1 (A)</text>
                    <text x="190" y="115" textAnchor="middle" className="text-xs fill-green-600">L2 (B)</text>
                    <text x="190" y="155" textAnchor="middle" className="text-xs fill-blue-600">L3 (C)</text>
                    <text x="190" y="175" textAnchor="middle" className="text-xs fill-gray-600">N</text>
                    
                    {/* Voltage indication */}
                    <text x="200" y="220" textAnchor="middle" className="text-sm font-semibold fill-purple-700">
                      208V/480V between phases
                    </text>
                    <text x="200" y="235" textAnchor="middle" className="text-xs fill-purple-600">
                      120V/277V line to neutral
                    </text>
                  </svg>
                </div>
              </div>
              
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-800 mb-2">Single-Phase Notes:</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Two hot wires (L1, L2) at 120V each to neutral</li>
                    <li>• 240V available between hot wires</li>
                    <li>• Neutral carries unbalanced current</li>
                    <li>• Ground wire always required for safety</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h5 className="font-semibold text-purple-800 mb-2">Three-Phase Notes:</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Three hot wires 120° apart electrically</li>
                    <li>• Balanced loads result in zero neutral current</li>
                    <li>• Higher line voltages available</li>
                    <li>• More complex but more efficient</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Phase System Calculators</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Three Phase Calculator', slug: 'three-phase-calculator', icon: Zap, color: 'purple' },
            { name: 'Voltage Drop', slug: 'voltage-drop-calculator', icon: TrendingUp, color: 'red', description: 'Multi-phase voltage drop' },
            { name: 'Wire Size Calculator', slug: 'wire-size-calculator', icon: BarChart3, color: 'amber', description: 'Phase-specific sizing' },
            { name: 'Power Calculator', slug: 'amps-to-watts-calculator', icon: Activity, color: 'indigo', description: 'Single & three-phase power' },
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
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Master Electrical System Design</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/guides/electrical-power-calculations"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            Power Calculations Guide
          </Link>
          <Link 
            href="/guides/power-factor-explained"
            className="border border-purple-600 text-purple-700 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors"
          >
            Power Factor Deep Dive
          </Link>
          <Link 
            href="/calculators/wire-size-calculator"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Wire Size Calculator
          </Link>
        </div>
      </div>

      {/* Deep dive — three-phase configurations and worked numbers */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-200 mt-12 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Three-Phase Deep Dive — Wye, Delta, and the Math</h2>
        <p className="text-gray-600 mb-8">
          Three-phase power is not one system — it is a family of
          configurations. The conductor count, voltage relationships,
          neutral behavior, and grounding each depend on whether you have
          wye (Y, also written &ldquo;star&rdquo;) or delta (&Delta;), with
          or without a neutral, with or without a high-leg. Pick the wrong
          one for your equipment and you can drop a 480 V motor onto 277 V
          windings or vice-versa.
        </p>

        <div className="space-y-8">
          {/* Wye (Y) configuration */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-200">
            <h3 className="text-xl font-bold text-purple-900 mb-3">Wye (Y) configuration — what most North American services use</h3>
            <p className="text-sm text-slate-700 mb-3">
              Three-phase windings join at a common neutral point.
              Line-to-line voltage is &radic;3 times the line-to-neutral
              voltage. Single-phase loads connect line-to-neutral; three-
              phase motors connect line-to-line.
            </p>
            <div className="bg-purple-50 rounded p-4 font-mono text-sm space-y-1">
              <div>Common North-American wye services:</div>
              <div>  120 / 208 V wye  →  L-N = 120 V, L-L = 208 V (light commercial)</div>
              <div>  277 / 480 V wye →  L-N = 277 V, L-L = 480 V (industrial; 277 V is standard fluorescent ballast voltage)</div>
              <div>  347 / 600 V wye →  Canadian commercial</div>
              <div></div>
              <div>Single-phase load on wye: I_line = P / (V_LN &times; PF)</div>
              <div>Three-phase load on wye: I_line = P / (&radic;3 &times; V_LL &times; PF)</div>
              <div></div>
              <div>Phase relation: each line is 120&deg; out of phase from the next</div>
              <div>Sum of three balanced phase currents at neutral = 0 (no neutral current!)</div>
            </div>
            <p className="text-sm text-slate-700 mt-3">
              <strong>Key practical fact:</strong> a balanced wye system
              draws zero current in the neutral. This is why feeder neutrals
              can be downsized in NEC 220.61 (&ldquo;reduced neutral&rdquo;
              allowance) — the neutral only carries unbalanced single-phase
              load. With heavy harmonic loads (LED dimmers, computer power
              supplies, VFDs), the neutral can paradoxically carry MORE than
              line current due to triplen harmonics adding rather than
              canceling — which is why NEC 220.61(C) prohibits reducing the
              neutral for non-linear loads.
            </p>
          </div>

          {/* Delta configuration */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-200">
            <h3 className="text-xl font-bold text-purple-900 mb-3">Delta (&Delta;) configuration — older / industrial</h3>
            <p className="text-sm text-slate-700 mb-3">
              Three windings connect end-to-end forming a triangle. Line-to-
              line voltage equals winding voltage (no &radic;3 multiplier).
              No inherent neutral; some delta systems are grounded at one
              corner (&ldquo;corner-grounded delta&rdquo;) or center-tapped on
              one winding (&ldquo;high-leg delta&rdquo;).
            </p>
            <div className="bg-purple-50 rounded p-4 font-mono text-sm space-y-1">
              <div>Common delta services:</div>
              <div>  240 V delta (3-wire) →  no neutral, all loads L-L (older industrial)</div>
              <div>  240 / 120 V high-leg delta (4-wire) →  one winding center-tapped</div>
              <div>     L1-N = 120 V, L2-N = 120 V, <strong>L3-N = 208 V (the &ldquo;high leg&rdquo; or &ldquo;wild leg&rdquo;)</strong></div>
              <div>  480 V delta — industrial, no neutral, all motor loads</div>
              <div></div>
              <div>Phase / line relations in delta:</div>
              <div>  V_phase = V_line</div>
              <div>  I_phase = I_line / &radic;3</div>
              <div>  Same total power formula: P = &radic;3 &times; V_LL &times; I_line &times; PF</div>
            </div>
            <p className="text-sm text-slate-700 mt-3">
              <strong>The high-leg trap:</strong> on a 240 / 120 V high-leg
              delta, never connect a 120 V single-phase load to L3 — you'll
              put 208 V on a device rated 120 V and let the magic smoke out
              instantly.
            </p>
          </div>

        </div>
      </div>

      <ArticleSchema article={articleData} />
    </div>
  );
}