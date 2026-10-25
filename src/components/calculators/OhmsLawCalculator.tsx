'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Calculator, RefreshCw } from 'lucide-react';
import {
  formatSi,
  OHMS_LAW_DEFAULTS,
  OHMS_LAW_EMPTY_HINT,
  OHMS_LAW_EMPTY_TITLE,
  OHMS_LAW_MODE_OPTIONS,
  solveOhmsLaw,
} from '@/lib/calculations/ohms-law';
import type { OhmsLawMode, OhmsLawValues } from '@/lib/calculations/ohms-law';

export function OhmsLawCalculator() {
  const [mode, setMode] = useState<OhmsLawMode>(OHMS_LAW_DEFAULTS.mode);
  const [voltage, setVoltage] = useState<number | ''>(OHMS_LAW_DEFAULTS.voltage);
  const [current, setCurrent] = useState<number | ''>(OHMS_LAW_DEFAULTS.current);
  const [resistance, setResistance] = useState<number | ''>(OHMS_LAW_DEFAULTS.resistance);
  const [power, setPower] = useState<number | ''>(OHMS_LAW_DEFAULTS.power);
  const [results, setResults] = useState<OhmsLawValues | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Values stay unrounded; display formats them to 4 significant figures
  const calculate = useCallback(() => {
    const value = (v: number | '') => (typeof v === 'number' ? v : null);
    setResults(solveOhmsLaw(mode, {
      voltage: value(voltage),
      current: value(current),
      resistance: value(resistance),
      power: value(power),
    }));
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
        'What to Calculate?': OHMS_LAW_MODE_OPTIONS.find((o) => o.value === mode)?.label ?? mode,
      },
      results: {
        'Voltage': formatSi(results.voltage, 'V'),
        'Current': formatSi(results.current, 'A'),
        'Resistance': formatSi(results.resistance, 'Ω'),
        'Power': formatSi(results.power, 'W'),
        'Conductance (S)': formatSi(1 / results.resistance, 'S'),
      },
    });
  }, [results, mode, print]);

  const handleReset = () => {
    setVoltage(OHMS_LAW_DEFAULTS.voltage);
    setCurrent(OHMS_LAW_DEFAULTS.current);
    setResistance(OHMS_LAW_DEFAULTS.resistance);
    setPower(OHMS_LAW_DEFAULTS.power);
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
            options={OHMS_LAW_MODE_OPTIONS}
            value={mode}
            onChange={(e) => {
              setMode(e.target.value as OhmsLawMode);
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
              <span className="text-sm font-medium text-blue-800">Ohm&apos;s Law Formulas</span>
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
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
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
              {/* Ohm's Law Circle Visualization */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-primary-900">Calculated Values</h3>
                </div>
                
                {/* Results Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`bg-white rounded-lg p-4 text-center ${mode === 'voltage' ? 'ring-2 ring-primary-500' : ''}`}>
                    <div className="text-sm text-neutral-600">Voltage</div>
                    <div className="text-2xl font-bold font-mono text-primary-700">
                      {formatSi(results.voltage, 'V')}
                    </div>
                  </div>

                  <div className={`bg-white rounded-lg p-4 text-center ${mode === 'current' ? 'ring-2 ring-primary-500' : ''}`}>
                    <div className="text-sm text-neutral-600">Current</div>
                    <div className="text-2xl font-bold font-mono text-primary-700">
                      {formatSi(results.current, 'A')}
                    </div>
                  </div>

                  <div className={`bg-white rounded-lg p-4 text-center ${mode === 'resistance' ? 'ring-2 ring-primary-500' : ''}`}>
                    <div className="text-sm text-neutral-600">Resistance</div>
                    <div className="text-2xl font-bold font-mono text-primary-700">
                      {formatSi(results.resistance, 'Ω')}
                    </div>
                  </div>

                  <div className={`bg-white rounded-lg p-4 text-center ${mode === 'power' ? 'ring-2 ring-primary-500' : ''}`}>
                    <div className="text-sm text-neutral-600">Power</div>
                    <div className="text-2xl font-bold font-mono text-primary-700">
                      {formatSi(results.power, 'W')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Calculations */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Additional Information</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Conductance (S):</span>
                    <span className="font-mono font-semibold">{formatSi(1 / results.resistance, 'S')}</span>
                  </div>
                </div>
              </div>

            </>
          ) : (
            <div className="bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center">
              <Calculator className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600">{OHMS_LAW_EMPTY_TITLE}</p>
              <p className="text-sm text-neutral-500 mt-2">
                {OHMS_LAW_EMPTY_HINT}
              </p>
            </div>
          )}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}