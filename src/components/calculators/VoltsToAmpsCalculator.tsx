'use client';

import { useState, useEffect, useCallback , useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Zap, Calculator, RefreshCw } from 'lucide-react';

const PHASE_OPTIONS = [
  { value: 'single', label: 'Single-Phase' },
  { value: 'three', label: 'Three-Phase' },
];

const LOAD_TYPE_OPTIONS = [
  { value: 'resistive', label: 'Resistive Load (Heaters, Incandescent)' },
  { value: 'inductive', label: 'Inductive Load (Motors, Transformers)' },
  { value: 'mixed', label: 'Mixed Load' },
];

interface ConversionResult {
  current: number;
  power: number;
  apparentPower: number;
  reactivePower: number;
  powerFactor: number;
}

export function VoltsToAmpsCalculator() {
  const [voltage, setVoltage] = useState(240);
  const [power, setPower] = useState(1000);
  const [phase, setPhase] = useState<'single' | 'three'>('single');
  const [powerFactor, setPowerFactor] = useState(1.0);
  const [loadType, setLoadType] = useState('resistive');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Update power factor based on load type
  useEffect(() => {
    switch (loadType) {
      case 'resistive':
        setPowerFactor(1.0);
        break;
      case 'inductive':
        setPowerFactor(0.85);
        break;
      case 'mixed':
        setPowerFactor(0.90);
        break;
    }
  }, [loadType]);

  const calculate = useCallback(() => {
    if (voltage <= 0 || power <= 0 || powerFactor <= 0) {
      setResult(null);
      return;
    }

    // Calculate apparent power (VA)
    const apparentPower = power / powerFactor;

    // Calculate current based on phase
    let current: number;
    if (phase === 'single') {
      // Single-phase: I = P / (V × PF)
      current = power / (voltage * powerFactor);
    } else {
      // Three-phase: I = P / (V × √3 × PF)
      current = power / (voltage * Math.sqrt(3) * powerFactor);
    }

    // Calculate reactive power
    const reactivePower = Math.sqrt(Math.max(0, apparentPower * apparentPower - power * power));

    setResult({
      current: Math.round(current * 100) / 100,
      power,
      apparentPower: Math.round(apparentPower),
      reactivePower: Math.round(reactivePower),
      powerFactor,
    });
  }, [voltage, power, phase, powerFactor]);

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

  const handleReset = () => {
    setShowResults(false);
    // Reset form fields as needed
  };

  // Auto-calculation disabled - user must click Calculate button
  // useEffect(() => {
  //   calculate();
  // }, [calculate]);

  const shareableInputs = {
    voltage,
    power,
    phase,
    powerFactor,
    loadType,
  };
  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!result) return;
    print({
      title: 'Volts to Amps Calculation',
      inputs: {
        'Voltage': `${voltage}V`,
        'Power': `${power}W`,
        'Phase': phase,
        'Power Factor': powerFactor,
        'Load Type': loadType,
      },
      results: {
        'Current': `${result.current}A`,
        'Real Power': `${result.power}W`,
        'Apparent Power': `${result.apparentPower} VA`,
        'Reactive Power': `${result.reactivePower} VAR`,
        'Power Factor': result.powerFactor,
      },
    });
  }, [result, voltage, power, phase, powerFactor, loadType, print]);

  return (
    <CalculatorLayout
      title="Volts to Amps Calculator"
      description="Convert voltage and power to current for electrical circuits"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Input Parameters */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Voltage"
            type="number"
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            suffix="V"
            min={1}
            step={1}
            hint="Line voltage (120V, 240V, 480V, etc.)"
          />

          <Input
            label="Power"
            type="number"
            value={power}
            onChange={(e) => setPower(Number(e.target.value))}
            suffix="W"
            min={1}
            step={1}
            hint="Real power consumption in watts"
          />

          <Select
            label="Phase Configuration"
            options={PHASE_OPTIONS}
            value={phase}
            onChange={(e) => setPhase(e.target.value as 'single' | 'three')}
          />

          <Select
            label="Load Type"
            options={LOAD_TYPE_OPTIONS}
            value={loadType}
            onChange={(e) => setLoadType(e.target.value)}
          />

          {loadType === 'mixed' && (
            <Input
              label="Power Factor"
              type="number"
              value={powerFactor}
              onChange={(e) => setPowerFactor(Number(e.target.value))}
              min={0.1}
              max={1}
              step={0.01}
              hint="0.1 to 1.0 (1.0 = purely resistive)"
            />
          )}

          {/* Formula Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Formula Used</span>
            </div>
            <div className="font-mono text-sm text-blue-700">
              {phase === 'single' 
                ? 'I = P ÷ (V × PF)'
                : 'I = P ÷ (V × √3 × PF)'
              }
            </div>
            <div className="text-xs text-blue-600 mt-2">
              Where: I = Current (A), P = Power (W), V = Voltage (V), PF = Power Factor
            </div>
          </div>

          {/* Load Type Guide */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="text-sm font-medium text-neutral-700 mb-2">Typical Power Factors</div>
            <div className="text-xs text-neutral-600 space-y-1">
              <div>• <strong>Resistive (1.0):</strong> Heaters, incandescent lights</div>
              <div>• <strong>Inductive (0.8-0.9):</strong> Motors, transformers</div>
              <div>• <strong>LED Lights (0.9-0.95):</strong> Modern LED fixtures</div>
              <div>• <strong>Fluorescent (0.5-0.9):</strong> Depends on ballast type</div>
              <div>• <strong>Computers (0.95-0.99):</strong> With power factor correction</div>
            </div>
          </div>
        

          </div>
          
          {/* Calculate and Reset Buttons */}
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
        {showResults && result && (
          <div className="bg-white rounded-lg border border-gray-200 p-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Calculation Results</h2>
            <div className="space-y-6">
              {/* Main Current Result */}
              <div className="text-center p-6 bg-primary-50 rounded-xl border-2 border-primary-200">
                <div className="text-sm text-primary-600 font-medium mb-2">Current Draw</div>
                <div className="text-2xl sm:text-4xl font-bold font-mono text-primary-700 break-words min-w-0">
                  {result.current}
                </div>
                <div className="text-xl font-medium text-primary-600 mt-1">Amps</div>
                <div className="text-sm text-primary-500 mt-2">
                  {phase === 'single' ? 'Single-Phase' : 'Three-Phase'}
                </div>
              </div>

              {/* Power Triangle */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Power Analysis</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-500">Real Power (P)</div>
                    <div className="text-sm sm:text-lg font-bold font-mono text-green-600 break-words">
                      {result.power.toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">W</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-500">Apparent Power (S)</div>
                    <div className="text-sm sm:text-lg font-bold font-mono text-blue-600 break-words">
                      {result.apparentPower.toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">VA</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-500">Reactive Power (Q)</div>
                    <div className="text-sm sm:text-lg font-bold font-mono text-orange-600 break-words">
                      {result.reactivePower.toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">VAR</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-500">Power Factor</div>
                    <div className="text-sm sm:text-lg font-bold font-mono text-purple-600 break-words">
                      {result.powerFactor.toFixed(2)}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {result.powerFactor === 1 ? 'Unity' : result.powerFactor > 0.95 ? 'Excellent' : result.powerFactor > 0.85 ? 'Good' : 'Poor'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Circuit Sizing Guide */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-amber-800">Circuit Sizing Guide</div>
                    <div className="text-sm text-amber-700 mt-1 space-y-1">
                      <div>• <strong>Breaker Size:</strong> {Math.ceil(result.current * 1.25)}A (125% of load)</div>
                      <div>• <strong>Wire Size:</strong> Check ampacity tables for {Math.ceil(result.current * 1.25)}A minimum</div>
                      <div>• <strong>Conduit:</strong> Consider voltage drop for long runs</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy Calculations */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800 mb-3">Energy Cost Estimate</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">Energy per Hour:</span>
                    <span className="font-mono font-semibold">{(result.power / 1000).toFixed(2)} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Daily (8 hours):</span>
                    <span className="font-mono font-semibold">{(result.power * 8 / 1000).toFixed(1)} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Monthly (30 days):</span>
                    <span className="font-mono font-semibold">{(result.power * 8 * 30 / 1000).toFixed(0)} kWh</span>
                  </div>
                  <div className="flex justify-between border-t border-green-200 pt-2">
                    <span className="text-green-600">Cost @ $0.12/kWh:</span>
                    <span className="font-mono font-semibold">${(result.power * 8 * 30 / 1000 * 0.12).toFixed(2)}/month</span>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Common Voltage Comparisons</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-neutral-300">
                        <th className="text-left p-1">Voltage</th>
                        <th className="text-left p-1">Current</th>
                        <th className="text-left p-1">Application</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr className={voltage === 120 ? 'bg-primary-100' : ''}>
                        <td className="p-1">120V</td>
                        <td className="p-1 font-mono">{(power / (120 * powerFactor)).toFixed(1)}A</td>
                        <td className="p-1">Residential outlets</td>
                      </tr>
                      <tr className={voltage === 240 ? 'bg-primary-100' : ''}>
                        <td className="p-1">240V</td>
                        <td className="p-1 font-mono">{(power / (240 * powerFactor)).toFixed(1)}A</td>
                        <td className="p-1">Appliances, HVAC</td>
                      </tr>
                      <tr className={voltage === 480 ? 'bg-primary-100' : ''}>
                        <td className="p-1">480V</td>
                        <td className="p-1 font-mono">{(power / (480 * powerFactor * (phase === 'three' ? Math.sqrt(3) : 1))).toFixed(1)}A</td>
                        <td className="p-1">Commercial/Industrial</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}