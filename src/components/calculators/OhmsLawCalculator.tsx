'use client';

import { useState, useEffect, useCallback , useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Calculator, Zap, RefreshCw } from 'lucide-react';

type CalculationMode = 'voltage' | 'current' | 'resistance' | 'power';

const CALCULATION_OPTIONS = [
  { value: 'voltage', label: 'Calculate Voltage (V)' },
  { value: 'current', label: 'Calculate Current (I)' },
  { value: 'resistance', label: 'Calculate Resistance (R)' },
  { value: 'power', label: 'Calculate Power (P)' },
];

interface OhmsLawResults {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
}

export function OhmsLawCalculator() {
  const [mode, setMode] = useState<CalculationMode>('voltage');
  const [voltage, setVoltage] = useState<number | ''>('');
  const [current, setCurrent] = useState<number | ''>('');
  const [resistance, setResistance] = useState<number | ''>('');
  const [power, setPower] = useState<number | ''>('');
  const [results, setResults] = useState<OhmsLawResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculate = useCallback(() => {
    let v = typeof voltage === 'number' ? voltage : 0;
    let i = typeof current === 'number' ? current : 0;
    let r = typeof resistance === 'number' ? resistance : 0;
    let p = typeof power === 'number' ? power : 0;

    // Calculate based on mode and available inputs
    switch (mode) {
      case 'voltage':
        // V = I × R or V = √(P × R) or V = P / I
        if (i > 0 && r > 0) {
          v = i * r;
          p = i * i * r;
        } else if (p > 0 && r > 0) {
          v = Math.sqrt(p * r);
          i = v / r;
        } else if (p > 0 && i > 0) {
          v = p / i;
          r = v / i;
        }
        break;

      case 'current':
        // I = V / R or I = P / V or I = √(P / R)
        if (v > 0 && r > 0) {
          i = v / r;
          p = v * v / r;
        } else if (p > 0 && v > 0) {
          i = p / v;
          r = v / i;
        } else if (p > 0 && r > 0) {
          i = Math.sqrt(p / r);
          v = i * r;
        }
        break;

      case 'resistance':
        // R = V / I or R = V² / P or R = P / I²
        if (v > 0 && i > 0) {
          r = v / i;
          p = v * i;
        } else if (v > 0 && p > 0) {
          r = (v * v) / p;
          i = p / v;
        } else if (p > 0 && i > 0) {
          r = p / (i * i);
          v = i * r;
        }
        break;

      case 'power':
        // P = V × I or P = V² / R or P = I² × R
        if (v > 0 && i > 0) {
          p = v * i;
          r = v / i;
        } else if (v > 0 && r > 0) {
          p = (v * v) / r;
          i = v / r;
        } else if (i > 0 && r > 0) {
          p = i * i * r;
          v = i * r;
        }
        break;
    }

    if (v > 0 && i > 0 && r > 0 && p > 0) {
      setResults({
        voltage: Math.round(v * 1000) / 1000,
        current: Math.round(i * 1000) / 1000,
        resistance: Math.round(r * 1000) / 1000,
        power: Math.round(p * 1000) / 1000,
      });
    } else {
      setResults(null);
    }
  }, [mode, voltage, current, resistance, power]);

  // Auto-calculation disabled - user must click Calculate button
  // useEffect(() => {
  //   calculate();
  // }, [calculate]);

  const performCalculation = useCallback(() => {
    calculate();
    setShowResults(true);
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }, [calculate]);

  const shareableInputs: Record<string, string | number | boolean> = {
    mode,
    ...(typeof voltage === 'number' && { voltage }),
    ...(typeof current === 'number' && { current }),
    ...(typeof resistance === 'number' && { resistance }),
    ...(typeof power === 'number' && { power }),
  };
  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!results) return;
    print({
      title: 'Ohm\'s Law Calculation',
      inputs: {
        'Calculation Mode': mode,
      },
      results: {
        'Voltage': `${results.voltage} V`,
        'Current': `${results.current} A`,
        'Resistance': `${results.resistance} Ω`,
        'Power': `${results.power} W`,
      },
    });
  }, [results, mode, print]);

  const handleReset = () => {
    setVoltage('');
    setCurrent('');
    setResistance('');
    setPower('');
    setResults(null);
  };

  return (
    <CalculatorLayout
      title="Ohm's Law Calculator"
      description="Calculate voltage, current, resistance, or power using Ohm's Law"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Select
            label="What to Calculate?"
            options={CALCULATION_OPTIONS}
            value={mode}
            onChange={(e) => {
              setMode(e.target.value as CalculationMode);
              handleReset();
            }}
          />

          {/* Dynamic Input Fields Based on Mode */}
          <div className="space-y-4">
            {mode !== 'voltage' && (
              <Input
                label="Voltage"
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value ? Number(e.target.value) : '')}
                suffix="V"
                min={0}
                step={0.1}
                placeholder="Enter voltage"
              />
            )}

            {mode !== 'current' && (
              <Input
                label="Current"
                type="number"
                value={current}
                onChange={(e) => setCurrent(e.target.value ? Number(e.target.value) : '')}
                suffix="A"
                min={0}
                step={0.001}
                placeholder="Enter current"
              />
            )}

            {mode !== 'resistance' && (
              <Input
                label="Resistance"
                type="number"
                value={resistance}
                onChange={(e) => setResistance(e.target.value ? Number(e.target.value) : '')}
                suffix="Ω"
                min={0}
                step={0.1}
                placeholder="Enter resistance"
              />
            )}

            {mode !== 'power' && (
              <Input
                label="Power"
                type="number"
                value={power}
                onChange={(e) => setPower(e.target.value ? Number(e.target.value) : '')}
                suffix="W"
                min={0}
                step={0.1}
                placeholder="Enter power"
              />
            )}
          </div>

          {/* Formulas Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Ohm\'s Law Formulas</span>
            </div>
            <div className="text-xs font-mono text-blue-700 space-y-1">
              <div>V = I × R</div>
              <div>I = V ÷ R</div>
              <div>R = V ÷ I</div>
              <div>P = V × I = I² × R = V² ÷ R</div>
            </div>
          </div>
        

          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <Button onClick={performCalculation} className="flex-1">
              <Calculator className="w-4 h-4" />
              Calculate
            </Button>
            <Button variant="secondary" onClick={handleReset} className="flex-1">
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="space-y-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold">Calculation Results</h2>
            {results ? (
            <>
              {/* Ohm\'s Law Circle Visualization */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-primary-900">Calculated Values</h3>
                </div>
                
                {/* Results Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`bg-white rounded-lg p-4 text-center ${mode === 'voltage' ? 'ring-2 ring-primary-500' : ''}`}>
                    <div className="text-sm text-neutral-600">Voltage</div>
                    <div className="text-2xl font-bold font-mono text-primary-700">
                      {results.voltage}
                    </div>
                    <div className="text-sm text-neutral-500">V</div>
                  </div>

                  <div className={`bg-white rounded-lg p-4 text-center ${mode === 'current' ? 'ring-2 ring-primary-500' : ''}`}>
                    <div className="text-sm text-neutral-600">Current</div>
                    <div className="text-2xl font-bold font-mono text-primary-700">
                      {results.current}
                    </div>
                    <div className="text-sm text-neutral-500">A</div>
                  </div>

                  <div className={`bg-white rounded-lg p-4 text-center ${mode === 'resistance' ? 'ring-2 ring-primary-500' : ''}`}>
                    <div className="text-sm text-neutral-600">Resistance</div>
                    <div className="text-2xl font-bold font-mono text-primary-700">
                      {results.resistance}
                    </div>
                    <div className="text-sm text-neutral-500">Ω</div>
                  </div>

                  <div className={`bg-white rounded-lg p-4 text-center ${mode === 'power' ? 'ring-2 ring-primary-500' : ''}`}>
                    <div className="text-sm text-neutral-600">Power</div>
                    <div className="text-2xl font-bold font-mono text-primary-700">
                      {results.power}
                    </div>
                    <div className="text-sm text-neutral-500">W</div>
                  </div>
                </div>
              </div>

              {/* Additional Calculations */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Additional Information</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Power (kW):</span>
                    <span className="font-mono font-semibold">{(results.power / 1000).toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Current (mA):</span>
                    <span className="font-mono font-semibold">{(results.current * 1000).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Resistance (kΩ):</span>
                    <span className="font-mono font-semibold">{(results.resistance / 1000).toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Conductance (S):</span>
                    <span className="font-mono font-semibold">{(1 / results.resistance).toFixed(6)}</span>
                  </div>
                </div>
              </div>

              {/* Energy Cost Estimate */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Energy Cost Estimate</span>
                </div>
                <div className="text-xs text-amber-700 space-y-1">
                  <div>• Per Hour: {(results.power / 1000).toFixed(3)} kWh</div>
                  <div>• Per Day: {(results.power * 24 / 1000).toFixed(2)} kWh</div>
                  <div>• Per Month: {(results.power * 24 * 30 / 1000).toFixed(1)} kWh</div>
                  <div>• Monthly Cost @ $0.12/kWh: ${(results.power * 24 * 30 / 1000 * 0.12).toFixed(2)}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center">
              <Calculator className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600">Enter values to calculate</p>
              <p className="text-sm text-neutral-500 mt-2">
                Provide any two values to calculate the others
              </p>
            </div>
          )}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}