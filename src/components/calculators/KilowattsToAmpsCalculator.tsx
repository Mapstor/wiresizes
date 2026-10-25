'use client';

import { useState, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Calculator, RefreshCw } from 'lucide-react';
import { voltageOptions, voltsAfterPhaseChange } from '@/lib/calculations/inputs';
import type { Phase } from '@/lib/calculations/inputs';
import {
  currentByVoltage,
  fromRealPower,
  isPowerError,
  KILOWATTS_TO_AMPS_COMPARISON_VOLTS,
  KILOWATTS_TO_AMPS_DEFAULTS,
  PHASE_OPTIONS,
  POWER_ERROR_MESSAGES,
} from '@/lib/calculations/power';
import type { PowerResult, VoltageRow } from '@/lib/calculations/power';

type Inputs = typeof KILOWATTS_TO_AMPS_DEFAULTS;

interface Calculated {
  inputs: Inputs;
  error: string | null;
  result: PowerResult | null;
  rows: VoltageRow[];
}

function calculate(inputs: Inputs): Calculated {
  const r = fromRealPower({ watts: inputs.kilowatts * 1000, volts: inputs.volts, circuit: inputs.phase, pf: inputs.pf });
  if (isPowerError(r)) return { inputs, error: POWER_ERROR_MESSAGES[r.error], result: null, rows: [] };
  const rows = currentByVoltage({ watts: inputs.kilowatts * 1000 }, inputs.phase, inputs.pf, KILOWATTS_TO_AMPS_COMPARISON_VOLTS);
  return { inputs, error: null, result: r, rows };
}

const phaseLabel = (phase: Phase) => (phase === 'single' ? 'Single-Phase' : 'Three-Phase');

export function KilowattsToAmpsCalculator() {
  const [inputs, setInputs] = useState<Inputs>(KILOWATTS_TO_AMPS_DEFAULTS);
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
    setInputs(KILOWATTS_TO_AMPS_DEFAULTS);
    setCalculated(null);
  };

  const shareableInputs = {
    kilowatts: inputs.kilowatts,
    voltage: inputs.volts,
    phase: inputs.phase,
    powerFactor: inputs.pf,
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
      title: 'Kilowatts to Amps Calculation',
      inputs: {
        'Power': `${shown.kilowatts} kW`,
        'Voltage': `${shown.volts} V`,
        'Phase Configuration': phaseLabel(shown.phase),
        'Power Factor': shown.pf,
      },
      results: {
        'Load Current': `${result.amps.toFixed(2)} A`,
        'Real Power (P)': `${shown.kilowatts} kW`,
        'Apparent Power (S)': `${(result.va / 1000).toFixed(1)} kVA`,
        'Reactive Power (Q)': `${(result.vars / 1000).toFixed(1)} kVAR`,
        'Power Factor': result.pf.toFixed(2),
        ...Object.fromEntries(calculated.rows.map((row) => [`Current at ${row.volts} V`, `${row.amps.toFixed(1)} A`])),
      },
    });
  }, [calculated, print]);

  return (
    <CalculatorLayout
      title="Kilowatts to Amps Calculator"
      description="Convert kilowatts to amperage for electrical loads and equipment"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Input Parameters */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Power"
            type="number"
            value={inputs.kilowatts}
            onChange={(e) => setInputs((p) => ({ ...p, kilowatts: Number(e.target.value) }))}
            suffix="kW"
            min={0}
            step={0.1}
            hint="Power consumption in kilowatts"
          />

          <Select
            label="Voltage"
            options={voltageOptions(inputs.phase).map((v) => ({ value: String(v), label: `${v} V` }))}
            value={String(inputs.volts)}
            onChange={(e) => setInputs((p) => ({ ...p, volts: Number(e.target.value) }))}
          />

          <Select
            label="Phase Configuration"
            options={PHASE_OPTIONS}
            value={inputs.phase}
            onChange={(e) => {
              const phase = e.target.value as Phase;
              setInputs((p) => ({ ...p, phase, volts: voltsAfterPhaseChange(p.volts, phase) }));
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
            <div className="font-mono text-sm text-blue-700 space-y-1">
              <div>{inputs.phase === 'single'
                ? 'I = (kW × 1000) ÷ (V × PF)'
                : 'I = (kW × 1000) ÷ (V × √3 × PF)'
              }</div>
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
                <div className="text-sm text-primary-600 font-medium mb-2">Load Current</div>
                <div className="text-2xl sm:text-4xl font-bold font-mono text-primary-700 break-words min-w-0">
                  {calculated.result.amps.toFixed(2)}
                </div>
                <div className="text-xl font-medium text-primary-600 mt-1">Amps</div>
                <div className="text-sm text-primary-500 mt-2">
                  {phaseLabel(calculated.inputs.phase)} @ {calculated.inputs.volts}V
                </div>
              </div>

              {/* Power Analysis */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Power Analysis</div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Real Power (P):</span>
                    <span className="font-mono font-semibold">{calculated.inputs.kilowatts} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Apparent Power (S):</span>
                    <span className="font-mono font-semibold">{(calculated.result.va / 1000).toFixed(1)} kVA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Reactive Power (Q):</span>
                    <span className="font-mono font-semibold">{(calculated.result.vars / 1000).toFixed(1)} kVAR</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-300 pt-2">
                    <span className="text-neutral-600">Power Factor:</span>
                    <span className="font-mono font-semibold">{calculated.result.pf.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Voltage Comparison */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800 mb-3">Current at Different Voltages</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-blue-300">
                        <th className="text-left p-1">Voltage</th>
                        <th className="text-left p-1">Current</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-200">
                      {calculated.rows.map((row) => (
                        <tr key={row.volts} className={calculated.inputs.volts === row.volts ? 'bg-blue-100' : ''}>
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
