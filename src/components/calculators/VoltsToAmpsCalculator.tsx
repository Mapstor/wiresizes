'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Calculator, RefreshCw } from 'lucide-react';
import type { Phase } from '@/lib/calculations/inputs';
import {
  currentByVoltage,
  fromRealPower,
  isPowerError,
  PHASE_OPTIONS,
  POWER_ERROR_MESSAGES,
  VOLTS_TO_AMPS_COMPARISON_VOLTS,
  VOLTS_TO_AMPS_DEFAULTS,
} from '@/lib/calculations/power';
import type { LoadType, PowerResult, VoltageRow } from '@/lib/calculations/power';

const LOAD_TYPE_OPTIONS = [
  { value: 'resistive', label: 'Resistive Load (Heaters, Incandescent)' },
  { value: 'inductive', label: 'Inductive Load (Motors, Transformers)' },
  { value: 'mixed', label: 'Mixed Load' },
];

const LOAD_TYPE_PF: Record<LoadType, number> = { resistive: 1.0, inductive: 0.85, mixed: 0.9 };

type Inputs = typeof VOLTS_TO_AMPS_DEFAULTS;

interface Calculated {
  inputs: Inputs;
  error: string | null;
  result: PowerResult | null;
  rows: VoltageRow[];
}

function calculate(inputs: Inputs): Calculated {
  const r = fromRealPower({ watts: inputs.watts, volts: inputs.volts, circuit: inputs.phase, pf: inputs.pf });
  if (isPowerError(r)) return { inputs, error: POWER_ERROR_MESSAGES[r.error], result: null, rows: [] };
  // the selected phase's formula on every row; three-phase shows line-to-line voltages only
  const rows = currentByVoltage({ watts: inputs.watts }, inputs.phase, inputs.pf, VOLTS_TO_AMPS_COMPARISON_VOLTS);
  return { inputs, error: null, result: r, rows };
}

const phaseLabel = (phase: Phase) => (phase === 'single' ? 'Single-Phase' : 'Three-Phase');

export function VoltsToAmpsCalculator() {
  const [inputs, setInputs] = useState<Inputs>(VOLTS_TO_AMPS_DEFAULTS);
  const [calculated, setCalculated] = useState<Calculated | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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
    setInputs(VOLTS_TO_AMPS_DEFAULTS);
    setCalculated(null);
  };

  const shareableInputs = {
    voltage: inputs.volts,
    power: inputs.watts,
    phase: inputs.phase,
    powerFactor: inputs.pf,
    loadType: inputs.loadType,
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
    const { inputs: shown, result } = calculated;
    print({
      title: 'Volts to Amps Calculation',
      inputs: {
        'Voltage': `${shown.volts} V`,
        'Power': `${shown.watts} W`,
        'Phase Configuration': phaseLabel(shown.phase),
        'Load Type': LOAD_TYPE_OPTIONS.find((o) => o.value === shown.loadType)?.label ?? shown.loadType,
        'Power Factor': shown.pf,
      },
      results: {
        'Current Draw': `${result.amps.toFixed(2)} A`,
        'Real Power (P)': `${Math.round(result.watts).toLocaleString()} W`,
        'Apparent Power (S)': `${Math.round(result.va).toLocaleString()} VA`,
        'Reactive Power (Q)': `${Math.round(result.vars).toLocaleString()} VAR`,
        'Power Factor': result.pf.toFixed(2),
        ...Object.fromEntries(calculated.rows.map((row) => [`Current at ${row.volts} V`, `${row.amps.toFixed(1)} A`])),
      },
    });
  }, [calculated, print]);

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
            value={inputs.volts}
            onChange={(e) => setInputs((p) => ({ ...p, volts: Number(e.target.value) }))}
            suffix="V"
            min={0}
            step={1}
            hint="Line voltage (120V, 240V, 480V, etc.)"
          />

          <Input
            label="Power"
            type="number"
            value={inputs.watts}
            onChange={(e) => setInputs((p) => ({ ...p, watts: Number(e.target.value) }))}
            suffix="W"
            min={0}
            step={1}
            hint="Real power consumption in watts"
          />

          <Select
            label="Phase Configuration"
            options={PHASE_OPTIONS}
            value={inputs.phase}
            onChange={(e) => setInputs((p) => ({ ...p, phase: e.target.value as Phase }))}
          />

          <Select
            label="Load Type"
            options={LOAD_TYPE_OPTIONS}
            value={inputs.loadType}
            onChange={(e) => {
              const loadType = e.target.value as LoadType;
              setInputs((p) => ({ ...p, loadType, pf: LOAD_TYPE_PF[loadType] }));
            }}
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

          {/* Formula Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Formula Used</span>
            </div>
            <div className="font-mono text-sm text-blue-700">
              {inputs.phase === 'single'
                ? 'I = P ÷ (V × PF)'
                : 'I = P ÷ (V × √3 × PF)'
              }
            </div>
            <div className="text-xs text-blue-600 mt-2">
              Where: I = Current (A), P = Power (W), V = Voltage (V), PF = Power Factor
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
                <div className="text-sm text-primary-600 font-medium mb-2">Current Draw</div>
                <div className="text-2xl sm:text-4xl font-bold font-mono text-primary-700 break-words min-w-0">
                  {calculated.result.amps.toFixed(2)}
                </div>
                <div className="text-xl font-medium text-primary-600 mt-1">Amps</div>
                <div className="text-sm text-primary-500 mt-2">
                  {phaseLabel(calculated.inputs.phase)}
                </div>
              </div>

              {/* Power Triangle */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Power Analysis</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-500">Real Power (P)</div>
                    <div className="text-sm sm:text-lg font-bold font-mono text-green-600 break-words">
                      {Math.round(calculated.result.watts).toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">W</div>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-500">Apparent Power (S)</div>
                    <div className="text-sm sm:text-lg font-bold font-mono text-blue-600 break-words">
                      {Math.round(calculated.result.va).toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">VA</div>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-500">Reactive Power (Q)</div>
                    <div className="text-sm sm:text-lg font-bold font-mono text-orange-600 break-words">
                      {Math.round(calculated.result.vars).toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">VAR</div>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-500">Power Factor</div>
                    <div className="text-sm sm:text-lg font-bold font-mono text-purple-600 break-words">
                      {calculated.result.pf.toFixed(2)}
                    </div>
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {calculated.rows.map((row) => (
                        <tr key={row.volts} className={calculated.inputs.volts === row.volts ? 'bg-primary-100' : ''}>
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
