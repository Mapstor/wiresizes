'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Zap, Calculator, RefreshCw } from 'lucide-react';
import { voltageOptions, voltsAfterPhaseChange } from '@/lib/calculations/inputs';
import type { Phase } from '@/lib/calculations/inputs';
import {
  currentByVoltage,
  fromApparentPower,
  isPowerError,
  KVA_TO_AMPS_COMPARISON_VOLTS,
  KVA_TO_AMPS_DEFAULTS,
  PHASE_OPTIONS,
  POWER_ERROR_MESSAGES,
} from '@/lib/calculations/power';
import type { PowerResult, VoltageRow } from '@/lib/calculations/power';

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

type Inputs = typeof KVA_TO_AMPS_DEFAULTS;

interface Calculated {
  inputs: Inputs;
  error: string | null;
  result: PowerResult | null;
  primary: PowerResult | null;
  rows: VoltageRow[];
}

function calculate(inputs: Inputs): Calculated {
  const va = inputs.kva * 1000;
  const r = fromApparentPower({ va, volts: inputs.volts, circuit: inputs.phase, pf: inputs.pf });
  if (isPowerError(r)) return { inputs, error: POWER_ERROR_MESSAGES[r.error], result: null, primary: null, rows: [] };
  let primary: PowerResult | null = null;
  if (inputs.isTransformer) {
    const p = fromApparentPower({ va, volts: inputs.primaryVolts, circuit: inputs.phase, pf: inputs.pf });
    if (isPowerError(p)) return { inputs, error: POWER_ERROR_MESSAGES[p.error], result: null, primary: null, rows: [] };
    primary = p;
  }
  const rows = currentByVoltage({ va }, inputs.phase, inputs.pf, KVA_TO_AMPS_COMPARISON_VOLTS);
  return { inputs, error: null, result: r, primary, rows };
}

const phaseLabel = (phase: Phase) => (phase === 'single' ? 'Single-Phase' : 'Three-Phase');

export function KVAToAmpsCalculator() {
  const [inputs, setInputs] = useState<Inputs>(KVA_TO_AMPS_DEFAULTS);
  const [usePreset, setUsePreset] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(EQUIPMENT_PRESETS[0].name);
  const [calculated, setCalculated] = useState<Calculated | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Apply preset values
  const applyPreset = useCallback(() => {
    if (usePreset) {
      const preset = EQUIPMENT_PRESETS.find(p => p.name === selectedPreset);
      if (preset) {
        setInputs((p) => ({
          ...p,
          kva: preset.kva,
          volts: preset.voltage,
          phase: preset.phase as Phase,
          isTransformer: preset.name.toLowerCase().includes('transformer'),
        }));
      }
    }
  }, [usePreset, selectedPreset]);

  useEffect(() => {
    applyPreset();
  }, [applyPreset]);

  const performCalculation = useCallback(() => {
    setCalculated(calculate(inputs));
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, [inputs]);

  const handleReset = () => {
    setInputs(KVA_TO_AMPS_DEFAULTS);
    setUsePreset(false);
    setCalculated(null);
  };

  const shareableInputs: Record<string, string | number | boolean> = {
    kva: inputs.kva,
    voltage: inputs.volts,
    phase: inputs.phase,
    powerFactor: inputs.pf,
    isTransformer: inputs.isTransformer,
    ...(inputs.isTransformer && { primaryVoltage: inputs.primaryVolts }),
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
    if (!calculated?.result) return;
    const { inputs: shown, result, primary } = calculated;
    print({
      title: 'kVA to Amps Calculation',
      inputs: {
        'Apparent Power': `${shown.kva} kVA`,
        'Secondary Voltage': `${shown.volts} V`,
        'Phase Configuration': phaseLabel(shown.phase),
        'Power Factor': shown.pf,
        ...(shown.isTransformer && { 'Primary Voltage': `${shown.primaryVolts} V` }),
      },
      results: {
        [`${shown.isTransformer ? 'Secondary' : 'Load'} Current`]: `${result.amps.toFixed(2)} A`,
        ...(primary && { 'Primary Current': `${primary.amps.toFixed(2)} A` }),
        'Apparent Power (S)': `${shown.kva} kVA`,
        'Real Power (P)': `${(result.watts / 1000).toFixed(1)} kW`,
        'Reactive Power (Q)': `${(result.vars / 1000).toFixed(1)} kVAR`,
        'Power Factor': result.pf.toFixed(2),
        ...(primary && {
          'Current Ratio': `1:${(result.amps / primary.amps).toFixed(2)}`,
          'Line-to-line voltage ratio': `${Math.round((shown.primaryVolts / shown.volts) * 100) / 100}:1`,
        }),
        ...Object.fromEntries(calculated.rows.map((row) => [`Current at ${row.volts} V`, `${row.amps.toFixed(1)} A`])),
      },
    });
  }, [calculated, print]);

  const voltageSelectOptions = voltageOptions(inputs.phase).map((v) => ({ value: String(v), label: `${v}V` }));

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
            value={inputs.kva}
            onChange={(e) => setInputs((p) => ({ ...p, kva: Number(e.target.value) }))}
            suffix="kVA"
            min={0}
            step={0.1}
            disabled={usePreset}
            hint="Kilovolt-amperes rating"
          />

          <Select
            label="Secondary Voltage"
            options={voltageSelectOptions}
            value={String(inputs.volts)}
            onChange={(e) => setInputs((p) => ({ ...p, volts: Number(e.target.value) }))}
            disabled={usePreset}
          />

          <Select
            label="Phase Configuration"
            options={PHASE_OPTIONS}
            value={inputs.phase}
            onChange={(e) => {
              const phase = e.target.value as Phase;
              setInputs((p) => ({
                ...p,
                phase,
                volts: voltsAfterPhaseChange(p.volts, phase),
                primaryVolts: voltsAfterPhaseChange(p.primaryVolts, phase),
              }));
            }}
            disabled={usePreset}
          />

          <Input
            label="Power Factor"
            type="number"
            value={inputs.pf}
            onChange={(e) => setInputs((p) => ({ ...p, pf: Number(e.target.value) }))}
            min={0}
            max={1}
            step={0.01}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isTransformer"
              checked={inputs.isTransformer}
              onChange={(e) => setInputs((p) => ({ ...p, isTransformer: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="isTransformer" className="text-sm text-neutral-700">
              Transformer application (calculate primary current)
            </label>
          </div>

          {inputs.isTransformer && (
            <Select
              label="Primary Voltage"
              options={voltageSelectOptions}
              value={String(inputs.primaryVolts)}
              onChange={(e) => setInputs((p) => ({ ...p, primaryVolts: Number(e.target.value) }))}
            />
          )}

          {/* Formula Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Formula Used</span>
            </div>
            <div className="font-mono text-sm text-blue-700 space-y-1">
              <div>{inputs.phase === 'single'
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

          </div>

          {/* Calculate and Reset Buttons */}
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
        {calculated && (
          <div className="bg-white rounded-lg border border-gray-200 p-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Calculation Results</h2>
            {calculated.error || !calculated.result ? (
              <div className="rounded-xl p-6 bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
                {calculated.error}
              </div>
            ) : (
            <div className="space-y-6">
              {/* Main Current Result */}
              <div className="text-center p-6 bg-primary-50 rounded-xl border-2 border-primary-200">
                <div className="text-sm text-primary-600 font-medium mb-2">
                  {calculated.inputs.isTransformer ? 'Secondary' : 'Load'} Current
                </div>
                <div className="text-2xl sm:text-4xl font-bold font-mono text-primary-700 break-words min-w-0">
                  {calculated.result.amps.toFixed(2)}
                </div>
                <div className="text-xl font-medium text-primary-600 mt-1">Amps</div>
                <div className="text-sm text-primary-500 mt-2">
                  @ {calculated.inputs.volts}V {phaseLabel(calculated.inputs.phase)}
                </div>
              </div>

              {/* Transformer Primary Current */}
              {calculated.primary && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Primary Side</span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-amber-700">
                      {calculated.primary.amps.toFixed(2)}
                    </div>
                    <div className="text-lg font-medium text-amber-600">Amps</div>
                    <div className="text-sm text-amber-600 mt-1">
                      @ {calculated.inputs.primaryVolts}V Primary
                    </div>
                  </div>
                </div>
              )}

              {/* Power Analysis */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800 mb-3">Power Triangle</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Apparent Power (S):</span>
                    <span className="font-mono font-semibold">{calculated.inputs.kva} kVA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Real Power (P):</span>
                    <span className="font-mono font-semibold">{(calculated.result.watts / 1000).toFixed(1)} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Reactive Power (Q):</span>
                    <span className="font-mono font-semibold">{(calculated.result.vars / 1000).toFixed(1)} kVAR</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-2">
                    <span className="text-blue-600">Power Factor:</span>
                    <span className="font-mono font-semibold">{calculated.result.pf.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Transformer Ratios */}
              {calculated.primary && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-neutral-700 mb-3">Transformer Ratios</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Current Ratio:</span>
                      <span className="font-mono font-semibold">
                        1:{(calculated.result.amps / calculated.primary.amps).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Line-to-line voltage ratio:</span>
                      <span className="font-mono font-semibold">
                        {Math.round((calculated.inputs.primaryVolts / calculated.inputs.volts) * 100) / 100}:1
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-200">
                      {calculated.rows.map((row) => (
                        <tr key={row.volts} className={calculated.inputs.volts === row.volts ? 'bg-purple-100' : ''}>
                          <td className="p-1">{row.volts}V</td>
                          <td className="p-1 font-mono">{row.amps.toFixed(1)}A</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            )}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
