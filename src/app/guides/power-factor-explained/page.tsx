'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, Zap, TrendingUp, AlertTriangle, CheckCircle, Calculator, Activity, Eye, Target, ArrowRight, Lightbulb, Settings, DollarSign, Clock } from 'lucide-react';

const EQUIPMENT_POWER_FACTORS = [
  { equipment: 'Incandescent Lights', pf: 1.0, type: 'resistive', color: 'green', efficiency: 'Perfect', cost_impact: 'None' },
  { equipment: 'Electric Heaters', pf: 1.0, type: 'resistive', color: 'green', efficiency: 'Perfect', cost_impact: 'None' },
  { equipment: 'LED Lights (Quality)', pf: 0.95, type: 'capacitive', color: 'green', efficiency: 'Excellent', cost_impact: 'Minimal' },
  { equipment: 'Fluorescent (Electronic Ballast)', pf: 0.90, type: 'slightly_inductive', color: 'green', efficiency: 'Good', cost_impact: 'Low' },
  { equipment: 'Computer Power Supplies', pf: 0.98, type: 'corrected', color: 'green', efficiency: 'Excellent', cost_impact: 'None' },
  { equipment: 'Induction Motors (Loaded)', pf: 0.85, type: 'inductive', color: 'yellow', efficiency: 'Good', cost_impact: 'Moderate' },
  { equipment: 'Induction Motors (Unloaded)', pf: 0.65, type: 'inductive', color: 'orange', efficiency: 'Poor', cost_impact: 'High' },
  { equipment: 'Welding Equipment', pf: 0.60, type: 'inductive', color: 'red', efficiency: 'Poor', cost_impact: 'High' },
  { equipment: 'Fluorescent (Magnetic Ballast)', pf: 0.50, type: 'inductive', color: 'red', efficiency: 'Very Poor', cost_impact: 'Very High' },
];

const CORRECTION_METHODS = [
  { 
    method: 'Capacitor Banks', 
    effectiveness: 'High', 
    cost: 'Medium', 
    maintenance: 'Low',
    applications: ['Industrial facilities', 'Large commercial buildings'],
    pros: ['Improves voltage regulation', 'Reduces losses', 'Can be automated'],
    cons: ['Can create harmonic issues', 'Requires switching equipment', 'May overcompensate at light loads']
  },
  { 
    method: 'Synchronous Motors', 
    effectiveness: 'Very High', 
    cost: 'High', 
    maintenance: 'High',
    applications: ['Large industrial loads', 'Constant-speed applications'],
    pros: ['Provides leading power factor', 'Constant speed', 'High efficiency'],
    cons: ['High initial cost', 'Complex control', 'Requires DC excitation']
  },
  { 
    method: 'Power Factor Correction Equipment', 
    effectiveness: 'High', 
    cost: 'Low', 
    maintenance: 'Very Low',
    applications: ['Individual equipment', 'Electronic devices'],
    pros: ['Built into equipment', 'No external components', 'Automatic operation'],
    cons: ['Equipment-specific', 'May not be available for all loads', 'Slightly higher equipment cost']
  },
];

const COST_ANALYSIS_DATA = [
  { pf: 0.5, apparent_power: 200, real_power: 100, reactive_power: 173, line_losses: 400, relative_cost: 4.0 },
  { pf: 0.6, apparent_power: 167, real_power: 100, reactive_power: 133, line_losses: 278, relative_cost: 2.78 },
  { pf: 0.7, apparent_power: 143, real_power: 100, reactive_power: 102, line_losses: 204, relative_cost: 2.04 },
  { pf: 0.8, apparent_power: 125, real_power: 100, reactive_power: 75, line_losses: 156, relative_cost: 1.56 },
  { pf: 0.9, apparent_power: 111, real_power: 100, reactive_power: 48, line_losses: 123, relative_cost: 1.23 },
  { pf: 1.0, apparent_power: 100, real_power: 100, reactive_power: 0, line_losses: 100, relative_cost: 1.0 },
];

export default function PowerFactorExplainedGuide() {
  const [selectedPowerFactor, setSelectedPowerFactor] = useState(0.8);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationFrame(frame => (frame + 1) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const calculatePowerComponents = (pf: number) => {
    const realPower = 100;
    const apparentPower = realPower / pf;
    const reactivePower = Math.sqrt(Math.pow(apparentPower, 2) - Math.pow(realPower, 2));
    const angle = Math.acos(pf) * (180 / Math.PI);
    
    return {
      realPower: Math.round(realPower),
      apparentPower: Math.round(apparentPower),
      reactivePower: Math.round(reactivePower),
      angle: Math.round(angle),
    };
  };

  const powerComponents = calculatePowerComponents(selectedPowerFactor);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-10 h-10 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Power Factor Explained</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Understanding power factor is crucial for electrical efficiency and cost management. 
            This comprehensive guide explains reactive power, apparent power, and power factor correction 
            with interactive visualizations and real-world examples.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/calculators/amps-to-watts-calculator"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Power Factor Calculator
            </Link>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <TrendingUp className="w-4 h-4" />
              Improve Efficiency
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <DollarSign className="w-4 h-4" />
              Reduce Costs
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Clock className="w-4 h-4" />
              20 min read
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Power Triangle */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Power Triangle Visualization</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adjust Power Factor</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Power Factor: {selectedPowerFactor.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.01"
                  value={selectedPowerFactor}
                  onChange={(e) => setSelectedPowerFactor(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor (0.3)</span>
                  <span>Unity (1.0)</span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-2 ${
                selectedPowerFactor >= 0.95 ? 'bg-green-50 border-green-300' :
                selectedPowerFactor >= 0.85 ? 'bg-yellow-50 border-yellow-300' :
                selectedPowerFactor >= 0.70 ? 'bg-orange-50 border-orange-300' :
                'bg-red-50 border-red-300'
              }`}>
                <h4 className="font-semibold mb-2">
                  {selectedPowerFactor >= 0.95 ? 'Excellent Power Factor' :
                   selectedPowerFactor >= 0.85 ? 'Good Power Factor' :
                   selectedPowerFactor >= 0.70 ? 'Fair Power Factor' :
                   'Poor Power Factor'}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Real Power (P):</div>
                    <div className="font-mono text-green-600">{powerComponents.realPower} W</div>
                  </div>
                  <div>
                    <div className="font-medium">Apparent Power (S):</div>
                    <div className="font-mono text-blue-600">{powerComponents.apparentPower} VA</div>
                  </div>
                  <div>
                    <div className="font-medium">Reactive Power (Q):</div>
                    <div className="font-mono text-red-600">{powerComponents.reactivePower} VAR</div>
                  </div>
                  <div>
                    <div className="font-medium">Phase Angle (φ):</div>
                    <div className="font-mono text-orange-600">{powerComponents.angle}°</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Power Triangle</h3>
            {/* Interactive SVG Power Triangle */}
            <svg viewBox="0 0 400 300" className="w-full h-64">
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#grid)" />
              
              {/* Calculate triangle points based on power factor */}
              {(() => {
                const baseWidth = 200;
                const realPowerLength = baseWidth;
                const angle = Math.acos(selectedPowerFactor);
                const apparentPowerLength = realPowerLength / selectedPowerFactor;
                const reactivePowerHeight = apparentPowerLength * Math.sin(angle);
                
                const startX = 50;
                const startY = 250;
                const endX = startX + realPowerLength;
                const topY = startY - reactivePowerHeight;
                
                return (
                  <>
                    {/* Power Triangle */}
                    <path
                      d={`M ${startX} ${startY} L ${endX} ${startY} L ${endX} ${topY} Z`}
                      fill="rgba(59, 130, 246, 0.2)"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                    />
                    
                    {/* Animated pulsing dot for apparent power */}
                    <circle
                      cx={startX + realPowerLength * selectedPowerFactor / 2}
                      cy={startY - reactivePowerHeight * selectedPowerFactor / 2}
                      r={4 + 2 * Math.sin(animationFrame * Math.PI / 180)}
                      fill="rgb(59, 130, 246)"
                    />
                    
                    {/* Real Power (P) - Green */}
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={startY}
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="4"
                    />
                    <text x={startX + realPowerLength/2} y={startY + 20} textAnchor="middle" className="text-sm font-semibold fill-green-600">
                      P = {powerComponents.realPower} W
                    </text>
                    
                    {/* Reactive Power (Q) - Red */}
                    <line
                      x1={endX}
                      y1={startY}
                      x2={endX}
                      y2={topY}
                      stroke="rgb(239, 68, 68)"
                      strokeWidth="4"
                    />
                    <text x={endX + 20} y={startY - reactivePowerHeight/2} textAnchor="start" className="text-sm font-semibold fill-red-600">
                      Q = {powerComponents.reactivePower} VAR
                    </text>
                    
                    {/* Apparent Power (S) - Blue */}
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={topY}
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="4"
                    />
                    <text x={startX + realPowerLength/2 - 30} y={startY - reactivePowerHeight/2 - 10} textAnchor="middle" className="text-sm font-semibold fill-blue-600">
                      S = {powerComponents.apparentPower} VA
                    </text>
                    
                    {/* Power Factor Angle */}
                    <path
                      d={`M ${startX + 30} ${startY} A 30 30 0 0 0 ${startX + 30 * Math.cos(angle)} ${startY - 30 * Math.sin(angle)}`}
                      fill="none"
                      stroke="orange"
                      strokeWidth="2"
                    />
                    <text x={startX + 45} y={startY - 10} className="text-xs fill-orange-600">
                      φ = {powerComponents.angle}°
                    </text>
                    <text x={startX} y={startY + 45} className="text-xs fill-orange-600">
                      cos φ = {selectedPowerFactor.toFixed(2)}
                    </text>
                  </>
                );
              })()}
            </svg>
            
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div className="bg-green-100 rounded p-2">
                <div className="text-xs text-green-700">Real Power</div>
                <div className="font-semibold text-green-800">Useful Work</div>
              </div>
              <div className="bg-red-100 rounded p-2">
                <div className="text-xs text-red-700">Reactive Power</div>
                <div className="font-semibold text-red-800">Magnetic Fields</div>
              </div>
              <div className="bg-blue-100 rounded p-2">
                <div className="text-xs text-blue-700">Apparent Power</div>
                <div className="font-semibold text-blue-800">Total Drawn</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Power Factor Table */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Equipment Power Factor Reference</h2>
        
        <div className="overflow-x-auto mb-6">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-3 text-left font-semibold">Equipment Type</th>
                <th className="border px-4 py-3 text-center font-semibold">Power Factor</th>
                <th className="border px-4 py-3 text-center font-semibold">Load Type</th>
                <th className="border px-4 py-3 text-center font-semibold">Efficiency</th>
                <th className="border px-4 py-3 text-center font-semibold">Cost Impact</th>
                <th className="border px-4 py-3 text-center font-semibold">Action Needed</th>
              </tr>
            </thead>
            <tbody>
              {EQUIPMENT_POWER_FACTORS.map((equipment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 font-medium">{equipment.equipment}</td>
                  <td className="border px-4 py-3 text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      equipment.color === 'green' ? 'bg-green-100 text-green-800' :
                      equipment.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      equipment.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {equipment.pf.toFixed(2)}
                    </div>
                  </td>
                  <td className="border px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      equipment.type === 'resistive' ? 'bg-blue-100 text-blue-700' :
                      equipment.type === 'inductive' ? 'bg-red-100 text-red-700' :
                      equipment.type === 'capacitive' ? 'bg-green-100 text-green-700' :
                      equipment.type === 'corrected' ? 'bg-purple-100 text-purple-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {equipment.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="border px-4 py-3 text-center text-sm">{equipment.efficiency}</td>
                  <td className="border px-4 py-3 text-center text-sm">{equipment.cost_impact}</td>
                  <td className="border px-4 py-3 text-center">
                    {equipment.pf < 0.85 ? (
                      <span className="text-red-600 font-medium">Correction Recommended</span>
                    ) : equipment.pf < 0.95 ? (
                      <span className="text-yellow-600 font-medium">Monitor</span>
                    ) : (
                      <span className="text-green-600 font-medium">Acceptable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Resistive Loads
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Convert electrical energy directly to heat, light, or mechanical work with perfect power factor.
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Incandescent lights</li>
              <li>• Electric heaters</li>
              <li>• Heating elements</li>
              <li>• Resistors</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Inductive Loads
            </h3>
            <p className="text-sm text-red-700 mb-3">
              Create magnetic fields that lag voltage, resulting in poor power factor and reactive power.
            </p>
            <ul className="text-xs text-red-600 space-y-1">
              <li>• Induction motors</li>
              <li>• Transformers</li>
              <li>• Magnetic ballasts</li>
              <li>• Welding equipment</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Power Factor Corrected
            </h3>
            <p className="text-sm text-green-700 mb-3">
              Modern equipment with built-in correction circuits to maintain high power factor.
            </p>
            <ul className="text-xs text-green-600 space-y-1">
              <li>• Modern computers</li>
              <li>• LED drivers</li>
              <li>• Electronic ballasts</li>
              <li>• Variable frequency drives</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cost Analysis Chart */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Economic Impact of Power Factor</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Comparison Chart</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-4">
                {COST_ANALYSIS_DATA.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded ${
                        data.pf >= 0.95 ? 'bg-green-500' :
                        data.pf >= 0.85 ? 'bg-yellow-500' :
                        data.pf >= 0.70 ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-mono text-sm">PF: {data.pf.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>S: {data.apparent_power} VA</span>
                      <span>Q: {data.reactive_power} VAR</span>
                      <span className="font-semibold text-red-600">
                        Cost: {data.relative_cost.toFixed(1)}x
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Key Insight:</h4>
                <p className="text-sm text-yellow-700">
                  A facility with 0.5 power factor pays <strong>4x more</strong> for line losses 
                  compared to unity power factor, while doing the same useful work.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Cost Calculator</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Monthly kW Demand: 100 kW
                  </label>
                  <div className="bg-white rounded p-3">
                    <div className="text-sm">Base electrical cost calculation:</div>
                    <div className="font-mono text-xs text-gray-600 mt-1">
                      Demand charges + Energy charges + Power factor penalties
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded p-3">
                    <div className="text-sm font-medium text-green-800">Good PF (0.95)</div>
                    <div className="text-lg font-bold text-green-600">$1,200/mo</div>
                    <div className="text-xs text-green-600">No penalties</div>
                  </div>
                  <div className="bg-white rounded p-3">
                    <div className="text-sm font-medium text-red-800">Poor PF (0.65)</div>
                    <div className="text-lg font-bold text-red-600">$1,680/mo</div>
                    <div className="text-xs text-red-600">40% penalty</div>
                  </div>
                </div>

                <div className="bg-green-100 rounded p-3">
                  <div className="text-sm font-semibold text-green-800">Annual Savings Potential:</div>
                  <div className="text-xl font-bold text-green-700">$5,760</div>
                  <div className="text-xs text-green-600">
                    From improving power factor from 0.65 to 0.95
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Power Factor Correction Methods */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Power Factor Correction Methods</h2>
        
        <div className="space-y-8">
          {CORRECTION_METHODS.map((method, index) => (
            <div key={index} className="border-l-4 border-green-500 bg-green-50 rounded-r-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-green-900">{method.method}</h3>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    method.effectiveness === 'Very High' ? 'bg-green-200 text-green-800' :
                    method.effectiveness === 'High' ? 'bg-blue-200 text-blue-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {method.effectiveness} Effectiveness
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    method.cost === 'Low' ? 'bg-green-200 text-green-800' :
                    method.cost === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {method.cost} Cost
                  </span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Applications:</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    {method.applications.map((app, appIndex) => (
                      <li key={appIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Advantages:</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    {method.pros.map((pro, proIndex) => (
                      <li key={proIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Disadvantages:</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    {method.cons.map((con, conIndex) => (
                      <li key={conIndex} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-600" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Measurement and Monitoring */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Measuring and Monitoring Power Factor</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Measurement Methods</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Power Quality Meters
                </h4>
                <p className="text-sm text-blue-700 mb-2">
                  Digital meters that measure voltage, current, power, and power factor simultaneously.
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Real-time monitoring</li>
                  <li>• Data logging capabilities</li>
                  <li>• Harmonic analysis</li>
                  <li>• Alarm functions</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Clamp Meters
                </h4>
                <p className="text-sm text-purple-700 mb-2">
                  Portable meters for spot measurements of power factor in existing installations.
                </p>
                <ul className="text-xs text-purple-600 space-y-1">
                  <li>• True RMS measurements</li>
                  <li>• Single and three-phase</li>
                  <li>• Quick assessments</li>
                  <li>• Troubleshooting tool</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Energy Management Systems
                </h4>
                <p className="text-sm text-green-700 mb-2">
                  Integrated systems for continuous monitoring and automatic correction.
                </p>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>• Continuous monitoring</li>
                  <li>• Automatic switching</li>
                  <li>• Historical data</li>
                  <li>• Cost analysis</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring Best Practices</h3>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-3">Regular Assessment Schedule</h4>
                <div className="space-y-2 text-sm text-yellow-700">
                  <div className="flex justify-between">
                    <span>Daily:</span>
                    <span>Automated monitoring alerts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly:</span>
                    <span>Review power factor trends</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly:</span>
                    <span>Analyze cost impact</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quarterly:</span>
                    <span>Equipment assessment</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annually:</span>
                    <span>System optimization review</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Warning Signs
                </h4>
                <ul className="text-sm text-red-700 space-y-2">
                  <li>• Power factor below 0.85</li>
                  <li>• Increasing utility penalties</li>
                  <li>• Voltage fluctuations</li>
                  <li>• Equipment overheating</li>
                  <li>• Higher than expected energy costs</li>
                  <li>• Harmonics distortion &gt; 5%</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Target Goals
                </h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex justify-between">
                    <span>Minimum Acceptable:</span>
                    <span className="font-semibold">0.85</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Good Performance:</span>
                    <span className="font-semibold">0.90-0.95</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Excellent:</span>
                    <span className="font-semibold">0.95+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avoid Overcompensation:</span>
                    <span className="font-semibold">&lt; 1.05</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Power Factor Calculators & Tools</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Amps to Watts', slug: 'amps-to-watts-calculator', icon: Calculator, color: 'blue', description: 'Calculate with power factor' },
            { name: 'kVA to Amps', slug: 'kva-to-amps-calculator', icon: TrendingUp, color: 'green', description: 'Apparent power calculations' },
            { name: 'Three Phase', slug: 'three-phase-calculator', icon: Zap, color: 'purple', description: 'Multi-phase power factor' },
            { name: 'Motor Calculator', slug: 'horsepower-to-amps-calculator', icon: Settings, color: 'amber', description: 'Motor power factor analysis' },
            { name: 'Load Calculator', slug: 'electrical-load-calculator', icon: BarChart3, color: 'red', description: 'System-wide analysis' },
            { name: 'Efficiency Calculator', slug: 'btu-to-watts-calculator', icon: Lightbulb, color: 'green', description: 'Energy efficiency metrics' },
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
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Master Electrical Efficiency</h2>
        <p className="text-gray-600 mb-6">
          Continue building your electrical engineering expertise with these related topics 
          that complement power factor knowledge.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/guides/electrical-power-calculations"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            Power Calculations Guide
          </Link>
          <Link 
            href="/guides/single-vs-three-phase"
            className="border border-green-600 text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
          >
            Three-Phase Systems
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