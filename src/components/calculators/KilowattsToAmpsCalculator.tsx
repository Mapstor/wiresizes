'use client';

import { useRef, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { formatEntered, formatFixed } from '@/lib/calculations/format';
import { Calculator, RefreshCw } from 'lucide-react';
import { voltageOptions, voltsAfterPhaseChange } from '@/lib/calculations/inputs';
import type { Phase } from '@/lib/calculations/inputs';
import {
  currentByVoltage,
  fromRealPower,
  hasPowerInputError,
  isPowerError,
  KILOWATTS_TO_AMPS_COMPARISON_VOLTS,
  KILOWATTS_TO_AMPS_DEFAULTS,
  PHASE_OPTIONS,
  powerInputErrors,
} from '@/lib/calculations/power';
import type { PowerResult, VoltageRow } from '@/lib/calculations/power';

interface Inputs {
  /** Field text */
  kilowatts: string;
  volts: number;
  phase: Phase;
  /** Field text */
  pf: string;
}

const DEFAULT_INPUTS: Inputs = {
  kilowatts: String(KILOWATTS_TO_AMPS_DEFAULTS.kilowatts),
  volts: KILOWATTS_TO_AMPS_DEFAULTS.volts,
  phase: KILOWATTS_TO_AMPS_DEFAULTS.phase,
  pf: String(KILOWATTS_TO_AMPS_DEFAULTS.pf),
};

/** Inputs from a share link. */
function inputsFromQuery(params: URLSearchParams): Inputs {
  const phase = choiceParam(params, 'phase', ['single', 'three'] as Phase[]) ?? DEFAULT_INPUTS.phase;
  return {
    kilowatts: numberParam(params, 'kilowatts') ?? DEFAULT_INPUTS.kilowatts,
    phase,
    volts: choiceParam(params, 'voltage', voltageOptions(phase)) ?? voltsAfterPhaseChange(DEFAULT_INPUTS.volts, phase),
    pf: numberParam(params, 'powerFactor') ?? DEFAULT_INPUTS.pf,
  };
}

/** The result for valid inputs, with the current at each comparison voltage. */
function calculate(inputs: Inputs): { result: PowerResult; rows: VoltageRow[] } | null {
  const watts = fieldNumber(inputs.kilowatts) * 1000;
  const pf = fieldNumber(inputs.pf);
  const r = fromRealPower({ watts, volts: inputs.volts, circuit: inputs.phase, pf });
  if (isPowerError(r)) return null;
  return { result: r, rows: currentByVoltage({ watts }, inputs.phase, pf, KILOWATTS_TO_AMPS_COMPARISON_VOLTS) };
}

const phaseLabel = (phase: Phase) => (phase === 'single' ? 'Single-Phase' : 'Three-Phase');

export function KilowattsToAmpsCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const fields = useFieldErrors();

  const errors = powerInputErrors({
    value: fieldNumber(inputs.kilowatts),
    volts: inputs.volts,
    circuit: inputs.phase,
    pf: fieldNumber(inputs.pf),
  });
  const calculated = hasPowerInputError(errors) ? null : calculate(inputs);

  const query = buildQuery({
    kilowatts: inputs.kilowatts.trim(),
    voltage: inputs.volts,
    phase: inputs.phase,
    powerFactor: inputs.pf.trim(),
  });
  const { markChanged, shareUrl } = useUrlState(query, (params) => setInputs(inputsFromQuery(params)));
  const { print } = usePrintExport();

  const change = (patch: Partial<Inputs>) => {
    markChanged();
    setInputs((p) => ({ ...p, ...patch }));
  };

  const handleCalculate = () => {
    if (calculated) focusResults(resultsHeadingRef.current);
    else fields.revealAll(formRef.current);
  };

  const handleReset = () => {
    markChanged();
    fields.reset();
    setInputs(DEFAULT_INPUTS);
  };

  const handlePrint = () => {
    if (!calculated) return;
    const { result, rows } = calculated;
    print({
      title: 'Kilowatts to Amps Calculation',
      inputs: {
        'Power': `${formatEntered(fieldNumber(inputs.kilowatts))} kW`,
        'Voltage': `${formatEntered(inputs.volts)} V`,
        'Phase Configuration': phaseLabel(inputs.phase),
        'Power Factor': formatEntered(fieldNumber(inputs.pf)),
      },
      results: {
        'Load Current': `${formatFixed(result.amps, 2)} A`,
        'Real Power (P)': `${formatEntered(fieldNumber(inputs.kilowatts))} kW`,
        'Apparent Power (S)': `${formatFixed(result.va / 1000, 1)} kVA`,
        'Reactive Power (Q)': `${formatFixed(result.vars / 1000, 1)} kVAR`,
        'Power Factor': formatFixed(result.pf, 2),
        ...Object.fromEntries(rows.map((row) => [`Current at ${formatEntered(row.volts)} V`, `${formatFixed(row.amps, 1)} A`])),
      },
    });
  };

  return (
    <CalculatorLayout
      title="Kilowatts to Amps Calculator"
      description="Convert kilowatts to amperage for electrical loads and equipment"
      shareUrl={shareUrl}
      onPrint={handlePrint}
      actionsDisabled={!calculated}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Input Parameters */}
        <div className="bg-gray-50 rounded-lg p-6" ref={formRef}>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Power"
            type="number"
            value={inputs.kilowatts}
            onChange={(e) => change({ kilowatts: e.target.value })}
            onBlur={() => fields.touch('kilowatts')}
            error={fields.shown('kilowatts', errors.value)}
            suffix="kW"
            min={0}
            step={0.1}
            hint="Power consumption in kilowatts"
          />

          <Select
            label="Voltage"
            options={voltageOptions(inputs.phase).map((v) => ({ value: String(v), label: `${v} V` }))}
            value={String(inputs.volts)}
            onChange={(e) => change({ volts: Number(e.target.value) })}
          />

          <Select
            label="Phase Configuration"
            options={PHASE_OPTIONS}
            value={inputs.phase}
            onChange={(e) => {
              const phase = e.target.value as Phase;
              change({ phase, volts: voltsAfterPhaseChange(inputs.volts, phase) });
            }}
          />

          <Input
            label="Power Factor"
            type="number"
            value={inputs.pf}
            onChange={(e) => change({ pf: e.target.value })}
            onBlur={() => fields.touch('pf')}
            error={fields.shown('pf', errors.pf)}
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
            <Button onClick={handleCalculate} className="flex-1">
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
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 ref={resultsHeadingRef} tabIndex={-1} className="text-lg font-semibold text-gray-800 mb-6">Calculation Results</h2>
          {calculated && (
            <div className="space-y-6">
              {/* Main Current Result */}
              <div className="text-center p-6 bg-primary-50 rounded-xl border-2 border-primary-200">
                <div className="text-sm text-primary-600 font-medium mb-2">Load Current</div>
                <div className="text-2xl sm:text-4xl font-bold font-mono text-primary-700 break-words min-w-0">
                  {formatFixed(calculated.result.amps, 2)}
                </div>
                <div className="text-xl font-medium text-primary-600 mt-1">Amps</div>
                <div className="text-sm text-primary-500 mt-2">
                  {phaseLabel(inputs.phase)} @ {formatEntered(inputs.volts)} V
                </div>
              </div>

              {/* Power Analysis */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Power Analysis</div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Real Power (P):</span>
                    <span className="font-mono font-semibold">{formatEntered(fieldNumber(inputs.kilowatts))} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Apparent Power (S):</span>
                    <span className="font-mono font-semibold">{formatFixed(calculated.result.va / 1000, 1)} kVA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Reactive Power (Q):</span>
                    <span className="font-mono font-semibold">{formatFixed(calculated.result.vars / 1000, 1)} kVAR</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-300 pt-2">
                    <span className="text-neutral-600">Power Factor:</span>
                    <span className="font-mono font-semibold">{formatFixed(calculated.result.pf, 2)}</span>
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
                        <tr key={row.volts} className={inputs.volts === row.volts ? 'bg-blue-100' : ''}>
                          <td className="p-1">{formatEntered(row.volts)} V</td>
                          <td className="p-1 font-mono">{formatFixed(row.amps, 1)} A</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
