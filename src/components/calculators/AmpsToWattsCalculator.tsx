'use client';

import { useState, useCallback, useRef } from 'react';
import { Calculator, Zap, AlertCircle, Info, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CalculationResult {
  watts: number;
  kilowatts: number;
  voltAmperes: number;
  kilovoltAmperes: number;
  horsepowerOutput: number;
  monthlyEnergyCost: number;
  yearlyEnergyCost: number;
  formula: string;
  efficiency: number;
}

const COMMON_VOLTAGES = [
  { value: 12, label: '12V DC', type: 'dc' },
  { value: 24, label: '24V DC', type: 'dc' },
  { value: 48, label: '48V DC', type: 'dc' },
  { value: 120, label: '120V AC', type: 'ac' },
  { value: 208, label: '208V AC', type: 'ac' },
  { value: 240, label: '240V AC', type: 'ac' },
  { value: 277, label: '277V AC', type: 'ac' },
  { value: 480, label: '480V AC', type: 'ac' },
  { value: 600, label: '600V AC', type: 'ac' },
];

const COMMON_POWER_FACTORS = [
  { value: 1.0, label: '1.00 - Resistive (heaters, lights)', color: 'green' },
  { value: 0.95, label: '0.95 - Modern electronics', color: 'green' },
  { value: 0.90, label: '0.90 - LED lighting', color: 'yellow' },
  { value: 0.85, label: '0.85 - Loaded motors', color: 'yellow' },
  { value: 0.80, label: '0.80 - Typical motors', color: 'orange' },
  { value: 0.70, label: '0.70 - Lightly loaded motors', color: 'red' },
  { value: 0.60, label: '0.60 - Welding equipment', color: 'red' },
];

export default function AmpsToWattsCalculator() {
  const [current, setCurrent] = useState(20);
  const [voltage, setVoltage] = useState(120);
  const [customVoltage, setCustomVoltage] = useState('');
  const [useCustomVoltage, setUseCustomVoltage] = useState(false);
  const [powerType, setPowerType] = useState<'ac' | 'dc'>('ac');
  const [phaseType, setPhaseType] = useState<'single' | 'three'>('single');
  const [powerFactor, setPowerFactor] = useState(0.90);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [electricityRate, setElectricityRate] = useState(0.12);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculatePower = useCallback(() => {
    const actualVoltage = useCustomVoltage && customVoltage ? parseFloat(customVoltage) : voltage;
    
    let watts = 0;
    let formula = '';
    
    if (powerType === 'dc') {
      // DC calculation
      watts = current * actualVoltage;
      formula = `P = I × V = ${current}A × ${actualVoltage}V = ${watts.toFixed(2)}W`;
    } else {
      // AC calculation
      if (phaseType === 'single') {
        watts = current * actualVoltage * powerFactor;
        formula = `P = I × V × PF = ${current}A × ${actualVoltage}V × ${powerFactor} = ${watts.toFixed(2)}W`;
      } else {
        // Three-phase
        watts = current * actualVoltage * Math.sqrt(3) * powerFactor;
        formula = `P = I × V × √3 × PF = ${current}A × ${actualVoltage}V × 1.732 × ${powerFactor} = ${watts.toFixed(2)}W`;
      }
    }
    
    const kilowatts = watts / 1000;
    const voltAmperes = powerType === 'dc' ? watts : 
                        phaseType === 'single' ? current * actualVoltage :
                        current * actualVoltage * Math.sqrt(3);
    const kilovoltAmperes = voltAmperes / 1000;
    
    // Convert to mechanical horsepower (746W per HP)
    const horsepowerOutput = watts / 746;
    
    // Calculate energy costs
    const dailyKWh = (kilowatts * hoursPerDay);
    const monthlyKWh = dailyKWh * 30;
    const yearlyKWh = dailyKWh * 365;
    const monthlyEnergyCost = monthlyKWh * electricityRate;
    const yearlyEnergyCost = yearlyKWh * electricityRate;
    
    // Calculate efficiency (power factor for AC)
    const efficiency = powerType === 'dc' ? 100 : powerFactor * 100;
    
    setResult({
      watts,
      kilowatts,
      voltAmperes,
      kilovoltAmperes,
      horsepowerOutput,
      monthlyEnergyCost,
      yearlyEnergyCost,
      formula,
      efficiency,
    });
  }, [current, voltage, customVoltage, useCustomVoltage, powerType, phaseType, powerFactor, hoursPerDay, electricityRate]);

  const performCalculation = useCallback(() => {
    calculatePower();
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [calculatePower]);

  const handleReset = useCallback(() => {
    setCurrent(20);
    setVoltage(120);
    setCustomVoltage('');
    setUseCustomVoltage(false);
    setPowerType('ac');
    setPhaseType('single');
    setPowerFactor(0.90);
    setHoursPerDay(8);
    setElectricityRate(0.12);
    setShowResults(false);
    setResult(null);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Inputs Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Current Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current (Amps)
              </label>
              <input
                type="number"
                value={current}
                onChange={(e) => setCurrent(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="10000"
                step="0.1"
              />
              <p className="text-xs text-gray-500 mt-1">Line current for three-phase systems</p>
            </div>

            {/* Voltage Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voltage
              </label>
              <div className="space-y-3">
                <select
                  value={useCustomVoltage ? 'custom' : voltage}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setUseCustomVoltage(true);
                    } else {
                      setUseCustomVoltage(false);
                      setVoltage(Number(e.target.value));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {COMMON_VOLTAGES.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.label}
                    </option>
                  ))}
                  <option value="custom">Custom Voltage...</option>
                </select>
                
                {useCustomVoltage && (
                  <input
                    type="number"
                    value={customVoltage}
                    onChange={(e) => setCustomVoltage(e.target.value)}
                    placeholder="Enter custom voltage"
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                    min="1"
                    max="100000"
                    step="0.1"
                  />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Line-to-line voltage for three-phase</p>
            </div>

            {/* Power Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Power Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPowerType('ac')}
                  className={`py-2 px-4 rounded-lg border transition-colors ${
                    powerType === 'ac'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  AC Power
                </button>
                <button
                  onClick={() => setPowerType('dc')}
                  className={`py-2 px-4 rounded-lg border transition-colors ${
                    powerType === 'dc'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  DC Power
                </button>
              </div>
            </div>

            {/* Phase Type (AC only) */}
            {powerType === 'ac' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phase Configuration
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPhaseType('single')}
                    className={`py-2 px-4 rounded-lg border transition-colors ${
                      phaseType === 'single'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Single Phase
                  </button>
                  <button
                    onClick={() => setPhaseType('three')}
                    className={`py-2 px-4 rounded-lg border transition-colors ${
                      phaseType === 'three'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Three Phase
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Power Factor (AC only) */}
            {powerType === 'ac' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Power Factor
                </label>
                <input
                  type="number"
                  value={powerFactor}
                  onChange={(e) => setPowerFactor(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0.5"
                  max="1"
                  step="0.01"
                />
                <div className="mt-3 space-y-1">
                  {COMMON_POWER_FACTORS.map((pf) => (
                    <button
                      key={pf.value}
                      onClick={() => setPowerFactor(pf.value)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        Math.abs(powerFactor - pf.value) < 0.01
                          ? 'bg-blue-50 text-blue-700 border border-blue-300'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {pf.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Energy Cost Calculation */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">Energy Cost Calculation</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Hours per Day
                  </label>
                  <input
                    type="number"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    max="24"
                    step="0.5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Electricity Rate ($/kWh)
                  </label>
                  <input
                    type="number"
                    value={electricityRate}
                    onChange={(e) => setElectricityRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    max="1"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>
        
        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <Button onClick={performCalculation} className="flex-1">
            <Calculator className="w-4 h-4" />
            Calculate Power
          </Button>
          
          <Button variant="secondary" onClick={handleReset} className="flex-1">
            <RotateCcw className="w-4 h-4" />
            Reset Calculator
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {showResults && result && (
        <div className="space-y-6" ref={resultsRef}>
          <h2 className="text-lg font-semibold">Calculation Results</h2>
          {/* Primary Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Conversion Results</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Real Power */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="text-sm text-blue-600 mb-1">Real Power</div>
                <div className="text-2xl font-bold text-blue-900">{result.watts.toFixed(2)} W</div>
                <div className="text-sm text-blue-700 mt-1">{result.kilowatts.toFixed(3)} kW</div>
              </div>
              
              {/* Apparent Power */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="text-sm text-purple-600 mb-1">Apparent Power</div>
                <div className="text-2xl font-bold text-purple-900">{result.voltAmperes.toFixed(2)} VA</div>
                <div className="text-sm text-purple-700 mt-1">{result.kilovoltAmperes.toFixed(3)} kVA</div>
              </div>
              
              {/* Mechanical Power */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="text-sm text-orange-600 mb-1">Mechanical Power</div>
                <div className="text-2xl font-bold text-orange-900">{result.horsepowerOutput.toFixed(2)} HP</div>
                <div className="text-sm text-orange-700 mt-1">@ 100% efficiency</div>
              </div>
              
              {/* Efficiency */}
              <div className={`bg-gradient-to-br rounded-lg p-4 border ${
                result.efficiency >= 90 ? 'from-green-50 to-green-100 border-green-200' :
                result.efficiency >= 80 ? 'from-yellow-50 to-yellow-100 border-yellow-200' :
                'from-red-50 to-red-100 border-red-200'
              }`}>
                <div className={`text-sm mb-1 ${
                  result.efficiency >= 90 ? 'text-green-600' :
                  result.efficiency >= 80 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {powerType === 'dc' ? 'DC Efficiency' : 'Power Factor'}
                </div>
                <div className={`text-2xl font-bold ${
                  result.efficiency >= 90 ? 'text-green-900' :
                  result.efficiency >= 80 ? 'text-yellow-900' :
                  'text-red-900'
                }`}>
                  {result.efficiency.toFixed(1)}%
                </div>
              </div>
            </div>
            
            {/* Formula Display */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-2">Calculation Formula:</div>
              <div className="font-mono text-sm text-gray-800">{result.formula}</div>
            </div>
          </div>
          
          {/* Energy Cost Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Energy Cost Analysis</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm text-green-600 mb-1">Daily Energy</div>
                <div className="text-xl font-bold text-green-900">
                  {(result.kilowatts * hoursPerDay).toFixed(2)} kWh
                </div>
                <div className="text-sm text-green-700 mt-1">
                  ${(result.kilowatts * hoursPerDay * electricityRate).toFixed(2)}/day
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm text-blue-600 mb-1">Monthly Cost</div>
                <div className="text-xl font-bold text-blue-900">
                  ${result.monthlyEnergyCost.toFixed(2)}
                </div>
                <div className="text-sm text-blue-700 mt-1">
                  {(result.kilowatts * hoursPerDay * 30).toFixed(1)} kWh/month
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="text-sm text-purple-600 mb-1">Yearly Cost</div>
                <div className="text-xl font-bold text-purple-900">
                  ${result.yearlyEnergyCost.toFixed(2)}
                </div>
                <div className="text-sm text-purple-700 mt-1">
                  {(result.kilowatts * hoursPerDay * 365).toFixed(0)} kWh/year
                </div>
              </div>
            </div>
            
            {/* Cost Savings Tips */}
            {powerType === 'ac' && powerFactor < 0.90 && (
              <div className="mt-4 bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-amber-800 mb-1">Power Factor Improvement Opportunity</div>
                    <p className="text-sm text-amber-700">
                      Improving power factor from {powerFactor.toFixed(2)} to 0.95 would reduce current by{' '}
                      {((1 - powerFactor / 0.95) * 100).toFixed(1)}%, allowing smaller conductors and reducing losses.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}