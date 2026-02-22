'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Calculator, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Settings, Activity, ArrowRight, Target, Gauge, Home, Building2, Factory, DollarSign } from 'lucide-react';

const VOLTAGE_SYSTEMS = [
  {
    type: 'Single-Phase',
    voltages: ['120V', '240V'],
    phases: 1,
    waveform_description: 'Simple sinusoidal waveform',
    power_formula: 'P = V × I × PF',
    applications: ['Residential homes', 'Small commercial', 'Light industrial'],
    max_power: '25 kW typical',
    advantages: ['Simple installation', 'Lower cost', 'Familiar to electricians', 'Good for resistive loads'],
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
    max_power: '1000+ kW',
    advantages: ['Higher power density', 'Better motor performance', 'Balanced loading', 'More efficient transmission'],
    disadvantages: ['Higher installation cost', 'More complex wiring', 'Requires balanced loads', 'More expensive equipment'],
    color: 'purple'
  }
];

const MOTOR_COMPARISON = [
  { hp: 0.5, single_phase: { current: 6.9, starting_current: 35, torque: 'Poor', efficiency: '75%', cost: '$150' }, three_phase: { current: 1.4, starting_current: 8.5, torque: 'Excellent', efficiency: '85%', cost: '$200' } },
  { hp: 1, single_phase: { current: 13.8, starting_current: 70, torque: 'Poor', efficiency: '76%', cost: '$200' }, three_phase: { current: 2.8, starting_current: 17, torque: 'Excellent', efficiency: '86%', cost: '$250' } },
  { hp: 2, single_phase: { current: 24, starting_current: 120, torque: 'Fair', efficiency: '77%', cost: '$300' }, three_phase: { current: 5.6, starting_current: 34, torque: 'Excellent', efficiency: '87%', cost: '$350' } },
  { hp: 3, single_phase: { current: 36, starting_current: 180, torque: 'Fair', efficiency: '78%', cost: '$400' }, three_phase: { current: 8.4, starting_current: 50, torque: 'Excellent', efficiency: '88%', cost: '$450' } },
  { hp: 5, single_phase: { current: 56, starting_current: 280, torque: 'Poor', efficiency: '79%', cost: 'N/A' }, three_phase: { current: 14, starting_current: 84, torque: 'Excellent', efficiency: '89%', cost: '$600' } },
];

const COST_ANALYSIS = [
  { 
    scenario: 'Residential Home (5 kW)',
    single_phase: { 
      equipment_cost: '$2,000', 
      installation_cost: '$1,500', 
      annual_energy: '$1,200',
      total_5yr: '$8,500',
      pros: ['Lower upfront cost', 'Simple installation', 'Standard for residential'],
      cons: ['Higher operating costs', 'Limited expansion']
    },
    three_phase: { 
      equipment_cost: '$3,500', 
      installation_cost: '$2,500', 
      annual_energy: '$1,080',
      total_5yr: '$11,400',
      pros: ['10% energy savings', 'Better power quality', 'Future expansion ready'],
      cons: ['Higher initial cost', 'Not always available']
    }
  },
  {
    scenario: 'Small Commercial (25 kW)',
    single_phase: { 
      equipment_cost: '$8,000', 
      installation_cost: '$5,000', 
      annual_energy: '$6,000',
      total_5yr: '$43,000',
      pros: ['Lower equipment cost', 'Simpler maintenance'],
      cons: ['Poor motor performance', 'Voltage drop issues', 'Higher demand charges']
    },
    three_phase: { 
      equipment_cost: '$10,000', 
      installation_cost: '$6,000', 
      annual_energy: '$5,100',
      total_5yr: '$41,500',
      pros: ['15% energy savings', 'Better equipment performance', 'Lower demand charges'],
      cons: ['Higher upfront investment', 'More complex wiring']
    }
  },
  {
    scenario: 'Industrial Facility (100 kW)',
    single_phase: { 
      equipment_cost: 'N/A', 
      installation_cost: 'N/A', 
      annual_energy: 'N/A',
      total_5yr: 'Not Practical',
      pros: ['None at this scale'],
      cons: ['Impossible for large motors', 'Extreme current requirements', 'Voltage regulation issues']
    },
    three_phase: { 
      equipment_cost: '$25,000', 
      installation_cost: '$15,000', 
      annual_energy: '$18,000',
      total_5yr: '$130,000',
      pros: ['Only viable option', 'Excellent efficiency', 'Balanced loading', 'Motor compatibility'],
      cons: ['Higher complexity', 'Requires skilled technicians']
    }
  }
];

const WIRING_CONFIGURATIONS = [
  {
    name: 'Single-Phase 120V',
    wires: 2,
    description: 'Hot, Neutral',
    typical_use: 'Lighting, small appliances',
    current_rating: '15-20A',
    voltage: '120V'
  },
  {
    name: 'Single-Phase 240V',
    wires: 3,
    description: 'Hot, Hot, Ground',
    typical_use: 'Water heaters, dryers, AC',
    current_rating: '30-50A',
    voltage: '240V'
  },
  {
    name: 'Three-Phase Wye (Y)',
    wires: 4,
    description: '3 Hot, Neutral',
    typical_use: 'Balanced loads, lighting',
    current_rating: 'Varies',
    voltage: '208V/120V, 480V/277V'
  },
  {
    name: 'Three-Phase Delta (Δ)',
    wires: 3,
    description: '3 Hot wires only',
    typical_use: 'Motor loads, heating',
    current_rating: 'Varies',
    voltage: '240V, 480V'
  }
];

export default function SingleVsThreePhaseGuide() {
  const [selectedComparison, setSelectedComparison] = useState<'voltage' | 'cost' | 'motor' | 'wiring'>('voltage');
  const [selectedApplication, setSelectedApplication] = useState<'residential' | 'commercial' | 'industrial'>('residential');

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
            power calculations, applications, and economic considerations with interactive comparisons.
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
            <div className="flex items-center gap-2 text-sm text-purple-700">
              <DollarSign className="w-4 h-4" />
              Cost Analysis
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-700">
              <Activity className="w-4 h-4" />
              18 min read
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Comparison Tabs */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive System Comparison</h2>
        
        <div className="mb-6">
          <div className="flex space-x-4 border-b">
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
              onClick={() => setSelectedComparison('cost')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                selectedComparison === 'cost'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Cost Analysis
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
                higher efficiency, and lower operating current. Single-phase motors above 3 HP become impractical.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-4 py-3 text-left font-semibold" rowSpan={2}>Motor Size</th>
                    <th className="border px-4 py-3 text-center font-semibold" colSpan={5}>Single-Phase (240V)</th>
                    <th className="border px-4 py-3 text-center font-semibold" colSpan={5}>Three-Phase (240V)</th>
                  </tr>
                  <tr className="bg-gray-50 text-xs">
                    <th className="border px-2 py-2">Current</th>
                    <th className="border px-2 py-2">Starting</th>
                    <th className="border px-2 py-2">Torque</th>
                    <th className="border px-2 py-2">Efficiency</th>
                    <th className="border px-2 py-2">Cost</th>
                    <th className="border px-2 py-2">Current</th>
                    <th className="border px-2 py-2">Starting</th>
                    <th className="border px-2 py-2">Torque</th>
                    <th className="border px-2 py-2">Efficiency</th>
                    <th className="border px-2 py-2">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {MOTOR_COMPARISON.map((motor) => (
                    <tr key={motor.hp} className="hover:bg-gray-50">
                      <td className="border px-4 py-3 font-bold">{motor.hp} HP</td>
                      
                      {/* Single-phase data */}
                      <td className="border px-2 py-3 text-center font-mono text-sm">{motor.single_phase.current}A</td>
                      <td className="border px-2 py-3 text-center font-mono text-sm text-red-600">{motor.single_phase.starting_current}A</td>
                      <td className="border px-2 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          motor.single_phase.torque === 'Poor' ? 'bg-red-100 text-red-700' :
                          motor.single_phase.torque === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {motor.single_phase.torque}
                        </span>
                      </td>
                      <td className="border px-2 py-3 text-center font-mono text-sm">{motor.single_phase.efficiency}</td>
                      <td className="border px-2 py-3 text-center font-mono text-sm">{motor.single_phase.cost}</td>
                      
                      {/* Three-phase data */}
                      <td className="border px-2 py-3 text-center font-mono text-sm text-green-600">{motor.three_phase.current}A</td>
                      <td className="border px-2 py-3 text-center font-mono text-sm text-green-600">{motor.three_phase.starting_current}A</td>
                      <td className="border px-2 py-3 text-center">
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                          {motor.three_phase.torque}
                        </span>
                      </td>
                      <td className="border px-2 py-3 text-center font-mono text-sm text-green-600">{motor.three_phase.efficiency}</td>
                      <td className="border px-2 py-3 text-center font-mono text-sm">{motor.three_phase.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3">Single-Phase Motor Limitations</h4>
                <ul className="text-sm text-red-700 space-y-2">
                  <li>• High starting current (5-8x running current)</li>
                  <li>• Poor starting torque without capacitors</li>
                  <li>• Lower efficiency, especially at partial loads</li>
                  <li>• Practical limit around 3-5 HP</li>
                  <li>• Unbalanced magnetic field</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Three-Phase Motor Advantages</h4>
                <ul className="text-sm text-green-700 space-y-2">
                  <li>• Lower starting current (2-3x running current)</li>
                  <li>• Excellent starting torque</li>
                  <li>• Higher efficiency across load range</li>
                  <li>• Available in all sizes</li>
                  <li>• Balanced rotating magnetic field</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Current Comparison</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>1 HP Motor:</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Single-phase:</span>
                    <span className="font-mono text-red-600">13.8A</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Three-phase:</span>
                    <span className="font-mono text-green-600">2.8A</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <span className="font-semibold text-blue-700">80% Current Reduction!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cost Analysis */}
        {selectedComparison === 'cost' && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedApplication('residential')}
                className={`px-4 py-2 rounded-lg border font-medium flex items-center gap-2 ${
                  selectedApplication === 'residential'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Home className="w-4 h-4" />
                Residential
              </button>
              <button
                onClick={() => setSelectedApplication('commercial')}
                className={`px-4 py-2 rounded-lg border font-medium flex items-center gap-2 ${
                  selectedApplication === 'commercial'
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Commercial
              </button>
              <button
                onClick={() => setSelectedApplication('industrial')}
                className={`px-4 py-2 rounded-lg border font-medium flex items-center gap-2 ${
                  selectedApplication === 'industrial'
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Factory className="w-4 h-4" />
                Industrial
              </button>
            </div>

            {COST_ANALYSIS
              .filter((analysis) => 
                (selectedApplication === 'residential' && analysis.scenario.includes('Residential')) ||
                (selectedApplication === 'commercial' && analysis.scenario.includes('Commercial')) ||
                (selectedApplication === 'industrial' && analysis.scenario.includes('Industrial'))
              )
              .map((analysis, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">{analysis.scenario}</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Single-Phase */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4">Single-Phase System</h4>
                      
                      <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700">Equipment Cost:</span>
                            <div className="font-mono font-bold">{analysis.single_phase.equipment_cost}</div>
                          </div>
                          <div>
                            <span className="text-blue-700">Installation:</span>
                            <div className="font-mono font-bold">{analysis.single_phase.installation_cost}</div>
                          </div>
                          <div>
                            <span className="text-blue-700">Annual Energy:</span>
                            <div className="font-mono font-bold">{analysis.single_phase.annual_energy}</div>
                          </div>
                          <div>
                            <span className="text-blue-700">5-Year Total:</span>
                            <div className="font-mono font-bold text-lg">{analysis.single_phase.total_5yr}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">Advantages:</h5>
                          <ul className="space-y-1">
                            {analysis.single_phase.pros.map((pro, proIndex) => (
                              <li key={proIndex} className="text-sm text-blue-700 flex items-center gap-2">
                                <CheckCircle className="w-3 h-3" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">Disadvantages:</h5>
                          <ul className="space-y-1">
                            {analysis.single_phase.cons.map((con, conIndex) => (
                              <li key={conIndex} className="text-sm text-blue-700 flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Three-Phase */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-purple-800 mb-4">Three-Phase System</h4>
                      
                      <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-purple-700">Equipment Cost:</span>
                            <div className="font-mono font-bold">{analysis.three_phase.equipment_cost}</div>
                          </div>
                          <div>
                            <span className="text-purple-700">Installation:</span>
                            <div className="font-mono font-bold">{analysis.three_phase.installation_cost}</div>
                          </div>
                          <div>
                            <span className="text-purple-700">Annual Energy:</span>
                            <div className="font-mono font-bold">{analysis.three_phase.annual_energy}</div>
                          </div>
                          <div>
                            <span className="text-purple-700">5-Year Total:</span>
                            <div className="font-mono font-bold text-lg">{analysis.three_phase.total_5yr}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-purple-800 mb-2">Advantages:</h5>
                          <ul className="space-y-1">
                            {analysis.three_phase.pros.map((pro, proIndex) => (
                              <li key={proIndex} className="text-sm text-purple-700 flex items-center gap-2">
                                <CheckCircle className="w-3 h-3" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-purple-800 mb-2">Disadvantages:</h5>
                          <ul className="space-y-1">
                            {analysis.three_phase.cons.map((con, conIndex) => (
                              <li key={conIndex} className="text-sm text-purple-700 flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cost Comparison Summary */}
                  {analysis.single_phase.total_5yr !== 'Not Practical' && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h5 className="font-semibold text-yellow-800 mb-2">Economic Analysis:</h5>
                      <p className="text-sm text-yellow-700">
                        {parseFloat(analysis.three_phase.total_5yr.replace(/[$,]/g, '')) < parseFloat(analysis.single_phase.total_5yr.replace(/[$,]/g, '')) 
                          ? `Three-phase system saves $${(parseFloat(analysis.single_phase.total_5yr.replace(/[$,]/g, '')) - parseFloat(analysis.three_phase.total_5yr.replace(/[$,]/g, ''))).toLocaleString()} over 5 years due to energy efficiency.`
                          : `Single-phase system has ${((parseFloat(analysis.three_phase.total_5yr.replace(/[$,]/g, '')) - parseFloat(analysis.single_phase.total_5yr.replace(/[$,]/g, ''))) / parseFloat(analysis.single_phase.total_5yr.replace(/[$,]/g, '')) * 100).toFixed(1)}% higher cost but may be worth it for performance benefits.`
                        }
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Wiring Configurations */}
        {selectedComparison === 'wiring' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {WIRING_CONFIGURATIONS.map((config, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-3">{config.name}</h4>
                  
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
                      <span className="text-gray-600">Typical Rating:</span>
                      <span className="font-mono ml-2">{config.current_rating}</span>
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

      {/* Application Guide */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Selection Guide</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Home className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Residential Applications</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Single-Phase Recommended:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Homes under 200A service</li>
                  <li>• Standard appliances (dryer, range, AC)</li>
                  <li>• Pool pumps under 2 HP</li>
                  <li>• Workshop equipment under 3 HP</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Consider Three-Phase For:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Large homes (400A+ service)</li>
                  <li>• Multiple large motors</li>
                  <li>• Home workshops with industrial equipment</li>
                  <li>• Geothermal heat pump systems</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded border border-blue-300">
              <div className="text-sm">
                <strong>Cost Impact:</strong> Three-phase may add $2,000-5,000 but provides 10-15% energy savings
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Commercial Applications</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Three-Phase Strongly Recommended:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• HVAC systems over 5 tons</li>
                  <li>• Elevators and escalators</li>
                  <li>• Commercial kitchen equipment</li>
                  <li>• Compressors and pumps</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Single-Phase Acceptable For:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Small retail spaces under 2,000 sq ft</li>
                  <li>• Office lighting and receptacles</li>
                  <li>• Small restaurants without major equipment</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded border border-green-300">
              <div className="text-sm">
                <strong>Utility Requirement:</strong> Many utilities require three-phase for commercial services over 100A
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Factory className="w-8 h-8 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-900">Industrial Applications</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-purple-800 mb-2">Three-Phase Required:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• All motors over 3 HP</li>
                  <li>• Manufacturing equipment</li>
                  <li>• Welding operations</li>
                  <li>• Process control systems</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-800 mb-2">Voltage Selection:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• 208V: Light industrial, small motors</li>
                  <li>• 480V: Standard industrial, large motors</li>
                  <li>• 600V+: Heavy industrial applications</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded border border-purple-300">
              <div className="text-sm">
                <strong>Efficiency Gain:</strong> Three-phase can improve overall facility efficiency by 15-25%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Matrix */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Decision Matrix: Single vs Three Phase</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-3 text-left font-semibold">Factor</th>
                <th className="border px-4 py-3 text-center font-semibold">Weight</th>
                <th className="border px-4 py-3 text-center font-semibold">Single-Phase</th>
                <th className="border px-4 py-3 text-center font-semibold">Three-Phase</th>
                <th className="border px-4 py-3 text-left font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border px-4 py-3 font-medium">Initial Cost</td>
                <td className="border px-4 py-3 text-center">High</td>
                <td className="border px-4 py-3 text-center">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">Excellent</span>
                </td>
                <td className="border px-4 py-3 text-center">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm font-semibold">Fair</span>
                </td>
                <td className="border px-4 py-3 text-sm">Single-phase typically 30-50% lower upfront cost</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-4 py-3 font-medium">Operating Efficiency</td>
                <td className="border px-4 py-3 text-center">High</td>
                <td className="border px-4 py-3 text-center">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm font-semibold">Good</span>
                </td>
                <td className="border px-4 py-3 text-center">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">Excellent</span>
                </td>
                <td className="border px-4 py-3 text-sm">Three-phase 15-25% more efficient for motor loads</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-4 py-3 font-medium">Motor Performance</td>
                <td className="border px-4 py-3 text-center">Medium</td>
                <td className="border px-4 py-3 text-center">
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-semibold">Poor</span>
                </td>
                <td className="border px-4 py-3 text-center">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">Excellent</span>
                </td>
                <td className="border px-4 py-3 text-sm">Single-phase motors limited to ~3 HP practical max</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-4 py-3 font-medium">Installation Complexity</td>
                <td className="border px-4 py-3 text-center">Medium</td>
                <td className="border px-4 py-3 text-center">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">Simple</span>
                </td>
                <td className="border px-4 py-3 text-center">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm font-semibold">Complex</span>
                </td>
                <td className="border px-4 py-3 text-sm">Three-phase requires more skilled installation</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-4 py-3 font-medium">Power Capacity</td>
                <td className="border px-4 py-3 text-center">High</td>
                <td className="border px-4 py-3 text-center">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm font-semibold">Limited</span>
                </td>
                <td className="border px-4 py-3 text-center">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">Unlimited</span>
                </td>
                <td className="border px-4 py-3 text-sm">Single-phase practical limit ~25 kW residential</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-4 py-3 font-medium">Equipment Availability</td>
                <td className="border px-4 py-3 text-center">Low</td>
                <td className="border px-4 py-3 text-center">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">Excellent</span>
                </td>
                <td className="border px-4 py-3 text-center">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">Excellent</span>
                </td>
                <td className="border px-4 py-3 text-sm">Both readily available in most markets</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Choose Single-Phase When:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Residential application under 10 kW</li>
              <li>• Budget constraints are primary concern</li>
              <li>• No large motors (under 2 HP)</li>
              <li>• Utility three-phase not available</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">Choose Three-Phase When:</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Commercial or industrial application</li>
              <li>• Multiple motors over 2 HP</li>
              <li>• Long-term energy efficiency important</li>
              <li>• Power quality critical</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Consider Both When:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Large residential (200A+ service)</li>
              <li>• Small commercial under 50 kW</li>
              <li>• Mixed residential/commercial use</li>
              <li>• Future expansion planned</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Phase System Calculators</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Three Phase Calculator', slug: 'three-phase-calculator', icon: Zap, color: 'purple', description: 'Complete 3-phase calculations' },
            { name: 'Motor Amps Calculator', slug: 'horsepower-to-amps-calculator', icon: Settings, color: 'blue', description: 'Single vs three-phase motors' },
            { name: 'Load Calculator', slug: 'electrical-load-calculator', icon: Calculator, color: 'green', description: 'System load analysis' },
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
                <p className="text-sm text-gray-600 mb-3">{calc.description}</p>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Master Electrical System Design</h2>
        <p className="text-gray-600 mb-6">
          Continue learning about electrical systems with these comprehensive guides that build on 
          phase system knowledge for complete electrical engineering expertise.
        </p>
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
            href="/guides/wire-sizing-guide"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Wire Sizing Guide
          </Link>
        </div>
      </div>
    </div>
  );
}