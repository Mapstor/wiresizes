'use client';

import { useState, useCallback, useRef } from 'react';
import { Calculator, RotateCcw, Zap, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { CalculatorResult } from './CalculatorResult';

interface MotorCircuitResult {
  conductorSize: string;
  conductorAmpacity: number;
  overloadProtection: number;
  shortCircuitProtection: number;
  controlCircuitSize: string;
  controlProtection: number;
  groundingConductor: string;
  disconnectRating: number;
}

const motorTypes = [
  { value: 'single-phase', label: 'Single Phase' },
  { value: 'three-phase', label: 'Three Phase Induction' },
  { value: 'synchronous', label: 'Synchronous' },
  { value: 'wound-rotor', label: 'Wound Rotor' },
  { value: 'dc', label: 'DC Motor' },
];

const voltageOptions = [
  { value: '115', label: '115V (Single Phase)' },
  { value: '208', label: '208V' },
  { value: '230', label: '230V' },
  { value: '460', label: '460V' },
  { value: '575', label: '575V' },
];

const protectionTypes = [
  { value: 'time-delay-fuse', label: 'Time Delay Fuse' },
  { value: 'nontime-delay-fuse', label: 'Non-Time Delay Fuse' },
  { value: 'inverse-time-cb', label: 'Inverse Time Circuit Breaker' },
  { value: 'instant-trip-cb', label: 'Instantaneous Trip Circuit Breaker' },
];

const startingMethods = [
  { value: 'across-line', label: 'Across-the-Line (DOL)' },
  { value: 'soft-start', label: 'Soft Start' },
  { value: 'star-delta', label: 'Star-Delta' },
  { value: 'vfd', label: 'Variable Frequency Drive' },
];

// NEC Table values for common motor sizes (simplified)
const motorFLC: Record<string, Record<string, Record<number, number>>> = {
  'single-phase': {
    '115': { 0.25: 5.8, 0.33: 7.2, 0.5: 9.8, 0.75: 13.8, 1: 16, 1.5: 20, 2: 24, 3: 34 },
    '230': { 0.25: 2.9, 0.33: 3.6, 0.5: 4.9, 0.75: 6.9, 1: 8, 1.5: 10, 2: 12, 3: 17 }
  },
  'three-phase': {
    '208': { 0.5: 2.5, 0.75: 3.5, 1: 4.6, 1.5: 6.6, 2: 7.5, 3: 10.6, 5: 16.7, 7.5: 24.2 },
    '230': { 0.5: 2.2, 0.75: 3.2, 1: 4.2, 1.5: 6.0, 2: 6.8, 3: 9.6, 5: 15.2, 7.5: 22.0 },
    '460': { 0.5: 1.1, 0.75: 1.6, 1: 2.1, 1.5: 3.0, 2: 3.4, 3: 4.8, 5: 7.6, 7.5: 11.0, 10: 14, 15: 21, 20: 27, 25: 34, 30: 40, 40: 52, 50: 65, 60: 77, 75: 96, 100: 124 }
  }
};

// NEC 430.52 protection percentages
const protectionPercentages: Record<string, Record<string, number>> = {
  'single-phase': {
    'nontime-delay-fuse': 300,
    'time-delay-fuse': 175,
    'instant-trip-cb': 800,
    'inverse-time-cb': 250
  },
  'three-phase': {
    'nontime-delay-fuse': 300,
    'time-delay-fuse': 175,
    'instant-trip-cb': 800,
    'inverse-time-cb': 250
  },
  'wound-rotor': {
    'nontime-delay-fuse': 150,
    'time-delay-fuse': 150,
    'instant-trip-cb': 800,
    'inverse-time-cb': 150
  },
  'dc': {
    'nontime-delay-fuse': 150,
    'time-delay-fuse': 150,
    'instant-trip-cb': 250,
    'inverse-time-cb': 150
  }
};

export function MotorCircuitCalculator() {
  const [motorType, setMotorType] = useState('three-phase');
  const [voltage, setVoltage] = useState('460');
  const [horsepower, setHorsepower] = useState('10');
  const [protectionType, setProtectionType] = useState('time-delay-fuse');
  const [startingMethod, setStartingMethod] = useState('across-line');
  const [distance, setDistance] = useState('100');
  const [result, setResult] = useState<MotorCircuitResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculateMotorCircuit = useCallback(() => {
    const hp = parseFloat(horsepower);
    const volt = parseFloat(voltage);
    const dist = parseFloat(distance);
    
    // Get motor FLC from NEC tables
    const motorTable = motorFLC[motorType]?.[voltage];
    if (!motorTable) return null;
    
    const flc = motorTable[hp] || 0;
    if (flc === 0) return null;
    
    // Conductor sizing: 125% of FLC per NEC 430.22
    const conductorCurrent = flc * 1.25;
    
    // Simple conductor sizing (would need full AWG table in real application)
    let conductorSize = '#12';
    let conductorAmpacity = 20;
    
    if (conductorCurrent <= 15) {
      conductorSize = '#14';
      conductorAmpacity = 15;
    } else if (conductorCurrent <= 20) {
      conductorSize = '#12';
      conductorAmpacity = 20;
    } else if (conductorCurrent <= 30) {
      conductorSize = '#10';
      conductorAmpacity = 30;
    } else if (conductorCurrent <= 40) {
      conductorSize = '#8';
      conductorAmpacity = 40;
    } else if (conductorCurrent <= 55) {
      conductorSize = '#6';
      conductorAmpacity = 55;
    } else if (conductorCurrent <= 75) {
      conductorSize = '#4';
      conductorAmpacity = 75;
    } else if (conductorCurrent <= 95) {
      conductorSize = '#3';
      conductorAmpacity = 95;
    } else if (conductorCurrent <= 110) {
      conductorSize = '#2';
      conductorAmpacity = 110;
    } else if (conductorCurrent <= 125) {
      conductorSize = '#1';
      conductorAmpacity = 125;
    } else if (conductorCurrent <= 145) {
      conductorSize = '#1/0';
      conductorAmpacity = 145;
    } else if (conductorCurrent <= 165) {
      conductorSize = '#2/0';
      conductorAmpacity = 165;
    } else {
      conductorSize = '#3/0';
      conductorAmpacity = 185;
    }
    
    // Overload protection: 115-125% of motor nameplate (using FLC as approximation)
    const overloadProtection = Math.round(flc * 1.15);
    
    // Short circuit protection per NEC 430.52
    const protectionPercent = protectionPercentages[motorType]?.[protectionType] || 175;
    const shortCircuitProtection = Math.ceil((flc * protectionPercent) / 100);
    
    // Control circuit sizing (simplified)
    const controlCircuitSize = '#14';
    const controlProtection = 15;
    
    // Grounding conductor per NEC 250.122
    let groundingConductor = '#12';
    if (shortCircuitProtection <= 15) groundingConductor = '#14';
    else if (shortCircuitProtection <= 20) groundingConductor = '#12';
    else if (shortCircuitProtection <= 60) groundingConductor = '#10';
    else if (shortCircuitProtection <= 100) groundingConductor = '#8';
    else if (shortCircuitProtection <= 200) groundingConductor = '#6';
    else if (shortCircuitProtection <= 300) groundingConductor = '#4';
    else groundingConductor = '#3';
    
    // Disconnect rating: 115% of motor nameplate
    const disconnectRating = Math.ceil(flc * 1.15);
    
    return {
      conductorSize,
      conductorAmpacity,
      overloadProtection,
      shortCircuitProtection,
      controlCircuitSize,
      controlProtection,
      groundingConductor,
      disconnectRating,
    };
  }, [motorType, voltage, horsepower, protectionType, startingMethod, distance]);

  const performCalculation = useCallback(() => {
    const calcResult = calculateMotorCircuit();
    setResult(calcResult);
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [calculateMotorCircuit]);

  const handleReset = useCallback(() => {
    setMotorType('three-phase');
    setVoltage('460');
    setHorsepower('10');
    setProtectionType('time-delay-fuse');
    setStartingMethod('across-line');
    setDistance('100');
    setResult(null);
    setShowResults(false);
  }, []);

  // Get available horsepower options based on motor type and voltage
  const getHorsepowerOptions = () => {
    const table = motorFLC[motorType]?.[voltage];
    if (!table) return [];
    
    return Object.keys(table).map(hp => ({
      value: hp,
      label: `${hp} HP`
    }));
  };

  return (
    <CalculatorLayout
      title="Motor Circuit Calculator"
      description="Calculate motor circuit requirements per NEC Article 430"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Motor Specifications</h2>
                <p className="text-gray-600">Enter motor details for NEC calculations</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motor Type
                </label>
                <Select
                  value={motorType}
                  onChange={(e) => setMotorType(e.target.value)}
                  options={motorTypes}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voltage
                </label>
                <Select
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  options={voltageOptions}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horsepower
                </label>
                <Select
                  value={horsepower}
                  onChange={(e) => setHorsepower(e.target.value)}
                  options={getHorsepowerOptions()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protection Type
                </label>
                <Select
                  value={protectionType}
                  onChange={(e) => setProtectionType(e.target.value)}
                  options={protectionTypes}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Method
                </label>
                <Select
                  value={startingMethod}
                  onChange={(e) => setStartingMethod(e.target.value)}
                  options={startingMethods}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (feet)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="100"
                  min="0"
                  step="1"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <Button onClick={performCalculation} className="w-full mt-6">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Motor Circuit
            </Button>

            {/* Reset Button */}
            <Button variant="secondary" onClick={handleReset} className="w-full mt-4">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </div>

        {/* Results Column */}
        <div className="space-y-6" ref={resultsRef}>
          {showResults && result && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Motor Circuit Requirements
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-blue-800 font-semibold">Conductor Size</div>
                      <div className="text-2xl font-bold text-blue-900">{result.conductorSize} AWG</div>
                      <div className="text-sm text-blue-700">Ampacity: {result.conductorAmpacity}A</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-green-800 font-semibold">Ground Wire</div>
                      <div className="text-2xl font-bold text-green-900">{result.groundingConductor} AWG</div>
                      <div className="text-sm text-green-700">Equipment grounding</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-orange-800 font-semibold">Overload Protection</div>
                      <div className="text-xl font-bold text-orange-900">{result.overloadProtection}A</div>
                      <div className="text-sm text-orange-700">115% of motor FLC</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="text-red-800 font-semibold">Short Circuit Protection</div>
                      <div className="text-xl font-bold text-red-900">{result.shortCircuitProtection}A</div>
                      <div className="text-sm text-red-700">Per NEC 430.52</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-purple-800 font-semibold">Control Circuit</div>
                      <div className="text-xl font-bold text-purple-900">{result.controlCircuitSize} AWG</div>
                      <div className="text-sm text-purple-700">{result.controlProtection}A protection</div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="text-indigo-800 font-semibold">Disconnect Rating</div>
                      <div className="text-xl font-bold text-indigo-900">{result.disconnectRating}A</div>
                      <div className="text-sm text-indigo-700">Minimum rating</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEC References */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  NEC Code References
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Conductor Sizing</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• NEC 430.22: 125% of motor FLC</li>
                      <li>• NEC 430.6: Use table values, not nameplate</li>
                      <li>• NEC 310.16: Conductor ampacity tables</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Protection</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• NEC 430.32: Overload protection</li>
                      <li>• NEC 430.52: Short circuit protection</li>
                      <li>• NEC 430.72: Control circuit protection</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Installation</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• NEC 430.102: Disconnecting means</li>
                      <li>• NEC 250.122: Equipment grounding</li>
                      <li>• NEC 430.109: Controller markings</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Multiple Motors</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• NEC 430.24: Feeder conductors</li>
                      <li>• NEC 430.62: Feeder protection</li>
                      <li>• NEC 430.53: Multiple motor protection</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Installation Notes */}
              <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                <h3 className="text-lg font-bold text-yellow-800 mb-4">⚠️ Important Installation Notes</h3>
                <ul className="text-yellow-800 space-y-2 text-sm">
                  <li>• <strong>Use NEC table values:</strong> Motor FLC from NEC tables 430.247-430.250, not nameplate current</li>
                  <li>• <strong>Overload protection:</strong> Must be sized between 115-125% of motor nameplate current</li>
                  <li>• <strong>Disconnect switch:</strong> Must be within sight of motor and rated for motor load</li>
                  <li>• <strong>Control circuits:</strong> Require separate overcurrent protection per NEC 430.72</li>
                  <li>• <strong>Grounding:</strong> Equipment grounding conductor must run with circuit conductors</li>
                  <li>• <strong>Starting method:</strong> Consider supply capacity and mechanical requirements</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}