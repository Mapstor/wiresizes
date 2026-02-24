'use client';

import { useState, useEffect, useCallback , useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Zap, Calculator, AlertCircle, RefreshCw } from 'lucide-react';

const VOLTAGE_OPTIONS = [
  { value: '120', label: '120V' },
  { value: '208', label: '208V' },
  { value: '240', label: '240V' },
  { value: '277', label: '277V' },
  { value: '480', label: '480V' },
  { value: '600', label: '600V' },
  { value: '4160', label: '4.16 kV' },
  { value: '12470', label: '12.47 kV' },
  { value: '13800', label: '13.8 kV' },
];

const PHASE_OPTIONS = [
  { value: 'single', label: 'Single-Phase' },
  { value: 'three', label: 'Three-Phase' },
];

const EQUIPMENT_PRESETS = [
  { name: 'Transformer - 25 kVA', kva: 25, voltage: 480, phase: 'three' },
  { name: 'Transformer - 50 kVA', kva: 50, voltage: 480, phase: 'three' },
  { name: 'Transformer - 75 kVA', kva: 75, voltage: 480, phase: 'three' },
  { name: 'Transformer - 112.5 kVA', kva: 112.5, voltage: 480, phase: 'three' },
  { name: 'Transformer - 225 kVA', kva: 225, voltage: 480, phase: 'three' },
  { name: 'Transformer - 500 kVA', kva: 500, voltage: 480, phase: 'three' },
  { name: 'Generator - 20 kVA', kva: 20, voltage: 240, phase: 'single' },
  { name: 'Generator - 100 kVA', kva: 100, voltage: 480, phase: 'three' },
  { name: 'UPS System - 10 kVA', kva: 10, voltage: 208, phase: 'single' },
  { name: 'Motor Control Center', kva: 800, voltage: 480, phase: 'three' },
];

interface kVAResult {
  current: number;
  kva: number;
  watts: number;
  vars: number;
  powerFactor: number;
  primaryCurrent?: number;
  primaryVoltage?: number;
  circuitAmps: number;
  breakerSize: number;
}

export function KVAToAmpsCalculator() {
  const [kva, setKva] = useState(50);
  const [voltage, setVoltage] = useState(480);
  const [phase, setPhase] = useState<'single' | 'three'>('three');
  const [powerFactor, setPowerFactor] = useState(0.85);
  const [isTransformer, setIsTransformer] = useState(false);
  const [primaryVoltage, setPrimaryVoltage] = useState(4160);
  const [usePreset, setUsePreset] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(EQUIPMENT_PRESETS[0].name);
  const [result, setResult] = useState<kVAResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Apply preset values
  const applyPreset = useCallback(() => {
    if (usePreset) {
      const preset = EQUIPMENT_PRESETS.find(p => p.name === selectedPreset);
      if (preset) {
        setKva(preset.kva);
        setVoltage(preset.voltage);
        setPhase(preset.phase as 'single' | 'three');
        setIsTransformer(preset.name.toLowerCase().includes('transformer'));
      }
    }
  }, [usePreset, selectedPreset]);

  useEffect(() => {
    applyPreset();
  }, [applyPreset]);

  const calculate = useCallback(() => {
    if (kva <= 0 || voltage <= 0 || powerFactor <= 0) {
      setResult(null);
      return;
    }

    // Calculate secondary current from kVA
    let current: number;
    if (phase === 'single') {
      // Single-phase: I = S / V
      current = (kva * 1000) / voltage;
    } else {
      // Three-phase: I = S / (V × √3)
      current = (kva * 1000) / (voltage * Math.sqrt(3));
    }

    // Calculate real and reactive power
    const watts = kva * 1000 * powerFactor;
    const vars = kva * 1000 * Math.sin(Math.acos(powerFactor));

    // Calculate primary current for transformers
    let primaryCurrent: number | undefined;
    if (isTransformer && primaryVoltage > 0) {
      if (phase === 'single') {
        primaryCurrent = (kva * 1000) / primaryVoltage;
      } else {
        primaryCurrent = (kva * 1000) / (primaryVoltage * Math.sqrt(3));
      }
    }

    // Calculate circuit requirements (125% for continuous loads on transformers)
    const circuitAmps = isTransformer ? Math.ceil(current * 1.25) : Math.ceil(current);

    // Determine breaker size
    const standardBreakers = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600, 700, 800, 1000, 1200, 1600, 2000, 2500, 3000, 4000, 5000, 6000];
    const breakerSize = standardBreakers.find(size => size >= circuitAmps) || circuitAmps;

    setResult({
      current: Math.round(current * 100) / 100,
      kva,
      watts: Math.round(watts),
      vars: Math.round(vars),
      powerFactor,
      primaryCurrent: primaryCurrent ? Math.round(primaryCurrent * 100) / 100 : undefined,
      primaryVoltage: isTransformer ? primaryVoltage : undefined,
      circuitAmps,
      breakerSize,
    });
  }, [kva, voltage, phase, powerFactor, isTransformer, primaryVoltage]);

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

  const shareableInputs: Record<string, string | number | boolean> = {
    kva,
    voltage,
    phase,
    powerFactor,
    isTransformer,
    ...(isTransformer && { primaryVoltage }),
    usePreset,
    ...(usePreset && { selectedPreset }),
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
      title: 'kVA to Amps Calculation',
      inputs: {
        'Apparent Power': `${kva} kVA`,
        'Voltage': `${voltage}V`,
        'Phase': phase,
        'Power Factor': powerFactor,
        ...(isTransformer && { 'Primary Voltage': `${primaryVoltage}V` }),
      },
      results: {
        'Secondary Current': `${result.current}A`,
        ...(result.primaryCurrent && { 'Primary Current': `${result.primaryCurrent}A` }),
        'Circuit Amperage': `${result.circuitAmps}A`,
        'Breaker Size': `${result.breakerSize}A`,
        'Real Power': `${result.watts}W`,
        'Reactive Power': `${result.vars} VAR`,
      },
    });
  }, [result, kva, voltage, phase, powerFactor, isTransformer, primaryVoltage, print]);

  return (
    <CalculatorLayout
      title="kVA to Amps Calculator"
      description="Convert kilovolt-amperes to current for transformers, generators, and electrical equipment"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Input Parameters */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          {/* Preset Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="usePreset"
              checked={usePreset}
              onChange={(e) => setUsePreset(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="usePreset" className="text-sm text-neutral-700">
              Use equipment preset
            </label>
          </div>

          {usePreset && (
            <Select
              label="Equipment Preset"
              options={EQUIPMENT_PRESETS.map(preset => ({
                value: preset.name,
                label: preset.name,
              }))}
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
            />
          )}

          <Input
            label="Apparent Power"
            type="number"
            value={kva}
            onChange={(e) => setKva(Number(e.target.value))}
            suffix="kVA"
            min={0.1}
            step={0.1}
            disabled={usePreset}
            hint="Kilovolt-amperes rating"
          />

          <Select
            label="Secondary Voltage"
            options={VOLTAGE_OPTIONS}
            value={String(voltage)}
            onChange={(e) => setVoltage(Number(e.target.value))}
            disabled={usePreset}
          />

          <Select
            label="Phase Configuration"
            options={PHASE_OPTIONS}
            value={phase}
            onChange={(e) => setPhase(e.target.value as 'single' | 'three')}
            disabled={usePreset}
          />

          <Input
            label="Power Factor"
            type="number"
            value={powerFactor}
            onChange={(e) => setPowerFactor(Number(e.target.value))}
            min={0.1}
            max={1}
            step={0.01}
            hint="Typical: Unity for resistive loads, 0.8-0.9 for inductive"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isTransformer"
              checked={isTransformer}
              onChange={(e) => setIsTransformer(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="isTransformer" className="text-sm text-neutral-700">
              Transformer application (calculate primary current)
            </label>
          </div>

          {isTransformer && (
            <Select
              label="Primary Voltage"
              options={VOLTAGE_OPTIONS}
              value={String(primaryVoltage)}
              onChange={(e) => setPrimaryVoltage(Number(e.target.value))}
            />
          )}

          {/* Formula Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Formula Used</span>
            </div>
            <div className="font-mono text-sm text-blue-700 space-y-1">
              <div>{phase === 'single' 
                ? 'I = S ÷ V'
                : 'I = S ÷ (V × √3)'
              }</div>
              <div>P = S × PF (real power)</div>
              <div>Q = S × sin(cos⁻¹(PF)) (reactive power)</div>
            </div>
            <div className="text-xs text-blue-600 mt-2">
              Where: I = Current (A), S = Apparent Power (VA), V = Voltage (V), PF = Power Factor
            </div>
          </div>

          {/* kVA Applications */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="text-sm font-medium text-neutral-700 mb-2">Common kVA Ratings</div>
            <div className="text-xs text-neutral-600 space-y-1">
              <div>• <strong>Transformers:</strong> 25, 50, 75, 112.5, 225, 500 kVA</div>
              <div>• <strong>Generators:</strong> 20, 60, 100, 150, 250 kVA</div>
              <div>• <strong>UPS Systems:</strong> 10, 20, 40, 80 kVA</div>
              <div>• <strong>Motor Starters:</strong> Based on motor HP</div>
              <div>• <strong>Service Entrance:</strong> 100, 200, 400 kVA</div>
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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Calculation Results</h2>
            <div className="space-y-6">
              {/* Main Current Result */}
              <div className="text-center p-6 bg-primary-50 rounded-xl border-2 border-primary-200">
                <div className="text-sm text-primary-600 font-medium mb-2">
                  {isTransformer ? 'Secondary' : 'Load'} Current
                </div>
                <div className="text-2xl sm:text-4xl font-bold font-mono text-primary-700 break-words min-w-0">
                  {result.current}
                </div>
                <div className="text-xl font-medium text-primary-600 mt-1">Amps</div>
                <div className="text-sm text-primary-500 mt-2">
                  @ {voltage}V {phase === 'single' ? 'Single-Phase' : 'Three-Phase'}
                </div>
              </div>

              {/* Transformer Primary Current */}
              {isTransformer && result.primaryCurrent && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Primary Side</span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-amber-700">
                      {result.primaryCurrent}
                    </div>
                    <div className="text-lg font-medium text-amber-600">Amps</div>
                    <div className="text-sm text-amber-600 mt-1">
                      @ {primaryVoltage}V Primary
                    </div>
                  </div>
                </div>
              )}

              {/* Circuit Requirements */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800 mb-3">Circuit Requirements</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-green-600">Circuit Amperage:</span>
                    <p className="font-mono font-semibold text-sm sm:text-lg break-words">{result.circuitAmps}A</p>
                    {isTransformer && (
                      <p className="text-xs text-green-600">(125% of load)</p>
                    )}
                  </div>
                  <div>
                    <span className="text-green-600">Breaker Size:</span>
                    <p className="font-mono font-semibold text-sm sm:text-lg break-words">{result.breakerSize}A</p>
                    <p className="text-xs text-green-600">(Next standard size)</p>
                  </div>
                </div>
              </div>

              {/* Power Analysis */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800 mb-3">Power Triangle</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Apparent Power (S):</span>
                    <span className="font-mono font-semibold">{result.kva} kVA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Real Power (P):</span>
                    <span className="font-mono font-semibold">{(result.watts / 1000).toFixed(1)} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Reactive Power (Q):</span>
                    <span className="font-mono font-semibold">{(result.vars / 1000).toFixed(1)} kVAR</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-2">
                    <span className="text-blue-600">Power Factor:</span>
                    <span className="font-mono font-semibold">{result.powerFactor.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Transformer Turns Ratio */}
              {isTransformer && result.primaryVoltage && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-neutral-700 mb-3">Transformer Ratios</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Voltage Ratio:</span>
                      <span className="font-mono font-semibold">
                        {(result.primaryVoltage / voltage).toFixed(2)}:1
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Current Ratio:</span>
                      <span className="font-mono font-semibold">
                        1:{(result.current / (result.primaryCurrent || 1)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Turns Ratio:</span>
                      <span className="font-mono font-semibold">
                        {Math.round(result.primaryVoltage / voltage * 100) / 100}:1
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Voltage Comparison */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-sm font-medium text-purple-800 mb-3">Current at Different Voltages</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-purple-300">
                        <th className="text-left p-1">Voltage</th>
                        <th className="text-left p-1">Current</th>
                        <th className="text-left p-1">Application</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-200">
                      {[
                        { v: 208, app: 'Commercial' },
                        { v: 240, app: 'Residential' },
                        { v: 480, app: 'Industrial' },
                        { v: 4160, app: 'Distribution' },
                      ].map(({ v, app }) => {
                        const current = phase === 'single' 
                          ? (result.kva * 1000) / v
                          : (result.kva * 1000) / (v * Math.sqrt(3));
                        return (
                          <tr key={v} className={voltage === v ? 'bg-purple-100' : ''}>
                            <td className="p-1">{v}V</td>
                            <td className="p-1 font-mono">{current.toFixed(1)}A</td>
                            <td className="p-1">{app}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Power Factor Warning */}
              {result.powerFactor < 0.85 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-red-800">Low Power Factor Warning</div>
                      <div className="text-sm text-red-700 mt-1">
                        Power factor of {result.powerFactor.toFixed(2)} may result in:
                        <ul className="mt-1 ml-4 text-xs space-y-1">
                          <li>• Higher current draw and heating</li>
                          <li>• Utility power factor penalties</li>
                          <li>• Reduced transformer capacity utilization</li>
                          <li>• Consider power factor correction equipment</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sizing Guidelines */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800 mb-3">Equipment Sizing Guidelines</div>
                <div className="text-sm text-green-700 space-y-1">
                  {isTransformer ? (
                    <>
                      <div>• Primary protection: 125% of rated current (NEC 450.3)</div>
                      <div>• Secondary protection: 125% of rated current</div>
                      <div>• Conductor sizing: 125% of rated current (NEC 450.3(B))</div>
                      <div>• Consider inrush current for breaker selection</div>
                    </>
                  ) : (
                    <>
                      <div>• Conductor ampacity: Equal to or greater than load current</div>
                      <div>• Breaker sizing: 125% for continuous loads</div>
                      <div>• Consider starting current for motors</div>
                      <div>• Account for ambient temperature derating</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}