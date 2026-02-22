'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Calculator, Zap, AlertCircle, CheckCircle2, TrendingUp, Settings, Gauge, DollarSign, Wrench, Power } from 'lucide-react';

const HorsepowerToAmpsCalculator: React.FC = () => {
  const [horsepower, setHorsepower] = useState<string>('10');
  const [voltage, setVoltage] = useState<string>('230');
  const [phase, setPhase] = useState<'single' | 'three'>('single');
  const [efficiency, setEfficiency] = useState<string>('85');
  const [powerFactor, setPowerFactor] = useState<string>('0.85');
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [calculatedAmps, setCalculatedAmps] = useState<number>(0);
  const [flaCurrent, setFlaCurrent] = useState<number>(0);
  const [wireSize, setWireSize] = useState<string>('');
  const [breakerSize, setBrekaerSize] = useState<number>(0);
  const [starterSize, setStarterSize] = useState<string>('');

  const calculateAmps = useCallback(() => {
    const hp = parseFloat(horsepower) || 0;
    const v = parseFloat(voltage) || 1;
    const eff = (parseFloat(efficiency) || 85) / 100;
    const pf = parseFloat(powerFactor) || 0.85;

    if (hp <= 0 || v <= 0) {
      setCalculatedAmps(0);
      setFlaCurrent(0);
      setWireSize('Invalid input');
      setBrekaerSize(0);
      setStarterSize('Invalid input');
      return;
    }

    // Convert HP to watts (1 HP = 746 watts)
    const watts = hp * 746;
    
    let amps: number;
    if (phase === 'single') {
      // Single phase: I = (HP × 746) / (V × Efficiency × Power Factor)
      amps = watts / (v * eff * pf);
    } else {
      // Three phase: I = (HP × 746) / (√3 × V × Efficiency × Power Factor)
      amps = watts / (Math.sqrt(3) * v * eff * pf);
    }

    setCalculatedAmps(amps);
    
    // Calculate FLA (Full Load Amps) - typically 125% of calculated
    const fla = amps * 1.25;
    setFlaCurrent(fla);

    // Determine wire size based on NEC Table 310.16
    let wire = '14 AWG';
    if (fla <= 15) wire = '14 AWG';
    else if (fla <= 20) wire = '12 AWG';
    else if (fla <= 30) wire = '10 AWG';
    else if (fla <= 40) wire = '8 AWG';
    else if (fla <= 55) wire = '6 AWG';
    else if (fla <= 70) wire = '4 AWG';
    else if (fla <= 85) wire = '3 AWG';
    else if (fla <= 95) wire = '2 AWG';
    else if (fla <= 110) wire = '1 AWG';
    else if (fla <= 125) wire = '1/0 AWG';
    else if (fla <= 145) wire = '2/0 AWG';
    else if (fla <= 165) wire = '3/0 AWG';
    else if (fla <= 195) wire = '4/0 AWG';
    else if (fla <= 215) wire = '250 MCM';
    else if (fla <= 240) wire = '300 MCM';
    else if (fla <= 260) wire = '350 MCM';
    else if (fla <= 280) wire = '400 MCM';
    else if (fla <= 320) wire = '500 MCM';
    else wire = '600 MCM or larger';
    
    setWireSize(wire);

    // Calculate breaker size (typically 250% of FLA for motor circuits)
    const breaker = Math.ceil((amps * 2.5) / 5) * 5; // Round up to nearest 5
    setBrekaerSize(Math.min(breaker, 400)); // Cap at 400A

    // Determine NEMA starter size
    let starter = 'Size 00';
    if (hp <= 1.5 && v <= 240) starter = 'Size 00';
    else if (hp <= 3 && v <= 240) starter = 'Size 0';
    else if (hp <= 7.5 && v <= 240) starter = 'Size 1';
    else if (hp <= 15 && v <= 240) starter = 'Size 2';
    else if (hp <= 30 && v <= 240) starter = 'Size 3';
    else if (hp <= 50 && v <= 240) starter = 'Size 4';
    else if (hp <= 100 && v <= 240) starter = 'Size 5';
    else if (hp <= 200 && v <= 240) starter = 'Size 6';
    else if (hp <= 3 && v <= 480) starter = 'Size 00';
    else if (hp <= 7.5 && v <= 480) starter = 'Size 0';
    else if (hp <= 15 && v <= 480) starter = 'Size 1';
    else if (hp <= 30 && v <= 480) starter = 'Size 2';
    else if (hp <= 60 && v <= 480) starter = 'Size 3';
    else if (hp <= 100 && v <= 480) starter = 'Size 4';
    else if (hp <= 200 && v <= 480) starter = 'Size 5';
    else if (hp <= 400 && v <= 480) starter = 'Size 6';
    else starter = 'Size 7 or larger';
    
    setStarterSize(starter);
  }, [horsepower, voltage, phase, efficiency, powerFactor]);

  const performCalculation = useCallback(() => {
    calculateAmps();
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [calculateAmps]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-xl p-8 mb-8">
        <div className="flex items-center mb-6">
          <Power className="w-10 h-10 text-orange-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Horsepower to Amps Calculator</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Motor Horsepower (HP)
              </label>
              <input
                type="number"
                value={horsepower}
                onChange={(e) => setHorsepower(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter horsepower"
                min="0"
                step="0.5"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                System Voltage (V)
              </label>
              <select
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="115">115V</option>
                <option value="120">120V</option>
                <option value="208">208V</option>
                <option value="230">230V</option>
                <option value="240">240V</option>
                <option value="277">277V</option>
                <option value="460">460V</option>
                <option value="480">480V</option>
                <option value="575">575V</option>
                <option value="600">600V</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phase Configuration
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setPhase('single')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    phase === 'single'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Single Phase
                </button>
                <button
                  onClick={() => setPhase('three')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    phase === 'three'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Three Phase
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Motor Efficiency (%)
              </label>
              <input
                type="number"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Typical: 80-95%"
                min="50"
                max="100"
                step="1"
              />
              <p className="text-xs text-gray-500 mt-1">Standard efficiency: 82-85%, Premium: 90-95%</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Power Factor (cos φ)
              </label>
              <input
                type="number"
                value={powerFactor}
                onChange={(e) => setPowerFactor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Typical: 0.80-0.90"
                min="0.5"
                max="1"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">Typical motors: 0.80-0.85, High-efficiency: 0.85-0.95</p>
            </div>
          </div>
        </div>

        <button
          onClick={performCalculation}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors flex items-center justify-center"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calculate Current Draw
        </button>
      </div>

      {showResults && (
        <div ref={resultsRef} className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Zap className="w-8 h-8 text-yellow-500 mr-3" />
            Calculation Results
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Calculated Current</span>
                <Gauge className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {calculatedAmps.toFixed(2)} A
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Operating current draw
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Full Load Amps (FLA)</span>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {flaCurrent.toFixed(2)} A
              </div>
              <div className="text-sm text-gray-500 mt-2">
                125% safety factor applied
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Recommended Wire Size</span>
                <Settings className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {wireSize}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Based on NEC Table 310.16 (75°C)
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Circuit Breaker Size</span>
                <Wrench className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {breakerSize} A
              </div>
              <div className="text-sm text-gray-500 mt-2">
                250% of FLA (motor circuit)
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">NEMA Starter Size</span>
              <Power className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              {starterSize}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Motor starter contactor rating
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Important Motor Circuit Considerations:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Wire sizing includes 125% continuous load factor per NEC 430.22</li>
                  <li>Breaker sizing is for motor circuit protection (250% for inverse time breakers)</li>
                  <li>Consider voltage drop for long wire runs (&gt;100 feet)</li>
                  <li>Verify starter size with manufacturer specifications</li>
                  <li>Account for ambient temperature derating if needed</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <DollarSign className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Power Consumption</span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                {(parseFloat(horsepower) * 0.746).toFixed(2)} kW
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Apparent Power</span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                {phase === 'single' 
                  ? ((parseFloat(voltage) * calculatedAmps) / 1000).toFixed(2)
                  : ((Math.sqrt(3) * parseFloat(voltage) * calculatedAmps) / 1000).toFixed(2)
                } kVA
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Inrush Current</span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                ~{(calculatedAmps * 6).toFixed(0)} A
              </div>
              <div className="text-xs text-gray-500">6x starting current</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorsepowerToAmpsCalculator;