'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Calculator, Zap, AlertCircle, CheckCircle2, TrendingUp, Settings, Gauge, DollarSign, Wrench, Waves } from 'lucide-react';

const PoolPumpCalculator: React.FC = () => {
  const [horsepower, setHorsepower] = useState<string>('2');
  const [voltage, setVoltage] = useState<string>('230');
  const [distance, setDistance] = useState<string>('50');
  const [pumpType, setPumpType] = useState<'single' | 'variable' | 'twospeed'>('single');
  const [installation, setInstallation] = useState<'underground' | 'overhead'>('underground');
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [wireSize, setWireSize] = useState<string>('');
  const [breakerSize, setBreAkerSize] = useState<number>(0);
  const [conduitSize, setConduitSize] = useState<string>('');
  const [gfciRequired, setGfciRequired] = useState<boolean>(true);
  const [operatingCurrent, setOperatingCurrent] = useState<number>(0);
  const [voltageDrop, setVoltageDrop] = useState<number>(0);
  const [annualCost, setAnnualCost] = useState<number>(0);

  const calculateRequirements = useCallback(() => {
    const hp = parseFloat(horsepower) || 0;
    const volts = parseFloat(voltage) || 230;
    const dist = parseFloat(distance) || 0;

    if (hp <= 0 || volts <= 0) {
      setWireSize('Invalid input');
      setBreAkerSize(0);
      setConduitSize('Invalid input');
      setOperatingCurrent(0);
      setVoltageDrop(0);
      setAnnualCost(0);
      return;
    }

    // Pool pump FLA values from NEC Table 430.148 (single phase) and 430.150 (three phase)
    const poolPumpFLA: { [key: string]: { [key: string]: number } } = {
      '115': {
        '0.5': 9.8, '0.75': 13.8, '1': 16, '1.5': 20, '2': 24, '3': 34, '5': 56
      },
      '230': {
        '0.5': 4.9, '0.75': 6.9, '1': 8, '1.5': 10, '2': 12, '3': 17, '5': 28, '7.5': 40, '10': 50
      }
    };

    // Get FLA for the pump
    let fla = 0;
    const voltageKey = volts.toString();
    const hpKey = hp.toString();
    
    if (poolPumpFLA[voltageKey] && poolPumpFLA[voltageKey][hpKey]) {
      fla = poolPumpFLA[voltageKey][hpKey];
    } else {
      // Estimate if not in table
      fla = (hp * 746) / (volts * 0.85);
    }

    // Adjust for pump type
    if (pumpType === 'variable') {
      // Variable speed pumps typically draw 50-80% of single speed at normal operation
      fla = fla * 0.65;
    } else if (pumpType === 'twospeed') {
      // Two-speed pumps - use high speed rating
      fla = fla * 1.1;
    }

    setOperatingCurrent(fla);

    // Wire sizing based on 125% of FLA (continuous load)
    const wireAmps = fla * 1.25;
    let wire = '14 AWG';
    
    if (wireAmps <= 15) wire = '14 AWG';
    else if (wireAmps <= 20) wire = '12 AWG';
    else if (wireAmps <= 30) wire = '10 AWG';
    else if (wireAmps <= 40) wire = '8 AWG';
    else if (wireAmps <= 55) wire = '6 AWG';
    else if (wireAmps <= 70) wire = '4 AWG';
    else wire = '2 AWG or larger';

    // Check voltage drop and upsize if necessary
    const resistance: { [key: string]: number } = {
      '14': 3.14, '12': 1.98, '10': 1.24, '8': 0.778, '6': 0.491, '4': 0.308, '2': 0.194
    };

    let finalWire = wire;
    let wireGauge = wire.split(' ')[0];
    let vDrop = 0;

    if (resistance[wireGauge]) {
      // Voltage drop calculation: VD = 2 × L × I × R / 1000
      vDrop = (2 * dist * fla * resistance[wireGauge]) / 1000;
      const vDropPercent = (vDrop / volts) * 100;

      // If voltage drop > 3%, upsize wire
      if (vDropPercent > 3) {
        if (wireGauge === '14') { finalWire = '12 AWG'; wireGauge = '12'; }
        else if (wireGauge === '12') { finalWire = '10 AWG'; wireGauge = '10'; }
        else if (wireGauge === '10') { finalWire = '8 AWG'; wireGauge = '8'; }
        else if (wireGauge === '8') { finalWire = '6 AWG'; wireGauge = '6'; }
        else if (wireGauge === '6') { finalWire = '4 AWG'; wireGauge = '4'; }
        else if (wireGauge === '4') { finalWire = '2 AWG'; wireGauge = '2'; }
        
        // Recalculate voltage drop with new wire
        if (resistance[wireGauge]) {
          vDrop = (2 * dist * fla * resistance[wireGauge]) / 1000;
        }
      }
    }

    setWireSize(finalWire);
    setVoltageDrop((vDrop / volts) * 100);

    // Breaker sizing - 250% max for motor circuits, but consider standard sizes
    const standardBreakers = [15, 20, 25, 30, 35, 40, 45, 50, 60];
    let breaker = Math.ceil(wireAmps);
    
    // Find next standard size
    for (const size of standardBreakers) {
      if (size >= breaker && size <= fla * 2.5) {
        breaker = size;
        break;
      }
    }
    setBreAkerSize(breaker);

    // Conduit size (simplified)
    let conduit = '1/2"';
    if (wireAmps <= 15) conduit = '1/2"';
    else if (wireAmps <= 30) conduit = '3/4"';
    else if (wireAmps <= 50) conduit = '1"';
    else conduit = '1-1/4"';
    setConduitSize(conduit);

    // GFCI always required for pool pumps
    setGfciRequired(true);

    // Calculate annual operating cost
    const powerKW = (volts * fla * 0.85) / 1000; // Assuming 85% power factor
    const hoursPerDay = pumpType === 'variable' ? 16 : 8; // Variable speed runs longer at lower speed
    const dailyKWh = powerKW * hoursPerDay;
    const annualKWh = dailyKWh * 365;
    const costPerKWh = 0.12; // National average
    setAnnualCost(annualKWh * costPerKWh);

  }, [horsepower, voltage, distance, pumpType]);

  const performCalculation = useCallback(() => {
    calculateRequirements();
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [calculateRequirements]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-xl p-8 mb-8">
        <div className="flex items-center mb-6">
          <Waves className="w-10 h-10 text-blue-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Pool Pump Electrical Calculator</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pump Motor Size (HP)
              </label>
              <select
                value={horsepower}
                onChange={(e) => setHorsepower(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="0.5">0.5 HP</option>
                <option value="0.75">0.75 HP</option>
                <option value="1">1 HP</option>
                <option value="1.5">1.5 HP</option>
                <option value="2">2 HP</option>
                <option value="2.5">2.5 HP</option>
                <option value="3">3 HP</option>
                <option value="5">5 HP</option>
                <option value="7.5">7.5 HP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Voltage
              </label>
              <select
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="115">115V</option>
                <option value="230">230V (Recommended)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">230V recommended for pumps 1 HP and larger</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Distance from Panel (feet)
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter distance in feet"
                min="0"
                step="5"
              />
              <p className="text-xs text-gray-500 mt-1">One-way distance to pump location</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pump Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setPumpType('single')}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors text-sm ${
                    pumpType === 'single'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Single Speed
                </button>
                <button
                  onClick={() => setPumpType('variable')}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors text-sm ${
                    pumpType === 'variable'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Variable Speed
                </button>
                <button
                  onClick={() => setPumpType('twospeed')}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors text-sm ${
                    pumpType === 'twospeed'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Two Speed
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Installation Method
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setInstallation('underground')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    installation === 'underground'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Underground
                </button>
                <button
                  onClick={() => setInstallation('overhead')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    installation === 'overhead'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Overhead
                </button>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-xs text-red-700">
                  <p className="font-semibold mb-1">NEC Article 680 Requirements:</p>
                  <ul className="list-disc list-inside">
                    <li>GFCI protection required</li>
                    <li>Equipment must be 5+ feet from pool edge</li>
                    <li>Equipotential bonding required</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={performCalculation}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors flex items-center justify-center"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calculate Pool Pump Requirements
        </button>
      </div>

      {showResults && (
        <div ref={resultsRef} className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Zap className="w-8 h-8 text-yellow-500 mr-3" />
            Pool Pump Electrical Requirements
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Wire Size Required</span>
                <Settings className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">
                {wireSize}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Copper THHN/THWN
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Circuit Breaker</span>
                <Wrench className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {breakerSize}A GFCI
              </div>
              <div className="text-sm text-gray-500 mt-2">
                GFCI breaker required
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Operating Current</span>
                <Gauge className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {operatingCurrent.toFixed(1)}A
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Full load amperage
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Conduit Size</span>
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600">
                {conduitSize}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                PVC Schedule 40 minimum
              </div>
            </div>
          </div>

          {voltageDrop > 0 && (
            <div className="mt-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Voltage Drop Analysis</span>
                <CheckCircle2 className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-yellow-700 text-sm">Voltage Drop:</span>
                  <div className="text-2xl font-bold text-yellow-700">
                    {voltageDrop.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {voltageDrop <= 3 ? 'Within NEC recommendations' : 'Consider larger wire'}
                  </div>
                </div>
                <div>
                  <span className="text-yellow-700 text-sm">Voltage at Pump:</span>
                  <div className="text-2xl font-bold text-yellow-700">
                    {(parseFloat(voltage) * (1 - voltageDrop / 100)).toFixed(1)}V
                  </div>
                  <div className="text-xs text-gray-500">Available at motor</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Annual Operating Cost</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              ${annualCost.toFixed(0)}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Estimated at $0.12/kWh
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1 text-red-800">Critical NEC Article 680 Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>GFCI protection required for all pool pump circuits</li>
                  <li>Disconnect switch required within sight of pump, 5+ feet from pool edge</li>
                  <li>Equipment grounding conductor required throughout circuit</li>
                  <li>Equipotential bonding required - connect pump motor to bonding grid</li>
                  <li>
                    {installation === 'underground' 
                      ? 'Underground conduit: 18" burial depth minimum for rigid PVC'
                      : 'Overhead installation: maintain proper clearances from pool area'}
                  </li>
                  <li>Hard-wired connection preferred; if cord-connected, max 3 feet cord length</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Power Consumption</span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                {((parseFloat(voltage) * operatingCurrent * 0.85) / 1000).toFixed(2)} kW
              </div>
              <div className="text-xs text-gray-500">At full load</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Starting Current</span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                ~{(operatingCurrent * 6).toFixed(0)}A
              </div>
              <div className="text-xs text-gray-500">6x full load (typical)</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Daily Runtime</span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                {pumpType === 'variable' ? '16' : '8'} hours
              </div>
              <div className="text-xs text-gray-500">
                {pumpType === 'variable' ? 'Variable speed - lower power' : 'Single speed typical'}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">Installation Checklist:</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <ul className="space-y-1">
                <li>✓ Install GFCI breaker at panel</li>
                <li>✓ Run proper sized wire in conduit</li>
                <li>✓ Install disconnect switch (5+ ft from pool)</li>
                <li>✓ Connect equipment grounding conductor</li>
              </ul>
              <ul className="space-y-1">
                <li>✓ Bond pump motor to equipotential grid</li>
                <li>✓ Install motor overload protection</li>
                <li>✓ Verify proper burial depth/clearances</li>
                <li>✓ Test GFCI operation before use</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolPumpCalculator;