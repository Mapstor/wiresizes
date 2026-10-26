'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { Calculator, RefreshCw } from 'lucide-react';
import type { Phase } from '@/lib/calculations/inputs';
import {
  currentByVoltage,
  fromRealPower,
  hasPowerInputError,
  isPowerError,
  PHASE_OPTIONS,
  POWER_FACTOR_NAMEPLATE_NOTE,
  powerInputErrors,
  VOLTS_TO_AMPS_COMPARISON_VOLTS,
  VOLTS_TO_AMPS_DEFAULTS,
} from '@/lib/calculations/power';
import type { PowerResult, VoltageRow } from '@/lib/calculations/power';

interface Inputs {
  /** Field text */
  volts: string;
  /** Field text */
  watts: string;
  phase: Phase;
  /** Field text */
  pf: string;
}

const DEFAULT_INPUTS: Inputs = {
  volts: String(VOLTS_TO_AMPS_DEFAULTS.volts),
  watts: String(VOLTS_TO_AMPS_DEFAULTS.watts),
  phase: VOLTS_TO_AMPS_DEFAULTS.phase,
  pf: String(VOLTS_TO_AMPS_DEFAULTS.pf),
};

/** Inputs from a share link; an old link's loadType is ignored. */
function inputsFromQuery(params: URLSearchParams): Inputs {
  return {
    volts: numberParam(params, 'voltage') ?? DEFAULT_INPUTS.volts,
    watts: numberParam(params, 'power') ?? DEFAULT_INPUTS.watts,
    phase: choiceParam(params, 'phase', ['single', 'three'] as Phase[]) ?? DEFAULT_INPUTS.phase,
    pf: numberParam(params, 'powerFactor') ?? DEFAULT_INPUTS.pf,
  };
}

/** The result for valid inputs, with the current at each comparison voltage. */
function calculate(inputs: Inputs): { result: PowerResult; rows: VoltageRow[] } | null {
  const watts = fieldNumber(inputs.watts);
  const pf = fieldNumber(inputs.pf);
  const r = fromRealPower({ watts, volts: fieldNumber(inputs.volts), circuit: inputs.phase, pf });
  if (isPowerError(r)) return null;
  // the selected phase's formula on every row; three-phase shows line-to-line voltages only
  return { result: r, rows: currentByVoltage({ watts }, inputs.phase, pf, VOLTS_TO_AMPS_COMPARISON_VOLTS) };
}

const phaseLabel = (phase: Phase) => (phase === 'single' ? 'Single-Phase' : 'Three-Phase');

export function VoltsToAmpsCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const fields = useFieldErrors();

  const errors = powerInputErrors({
    value: fieldNumber(inputs.watts),
    volts: fieldNumber(inputs.volts),
    circuit: inputs.phase,
    pf: fieldNumber(inputs.pf),
  });
  const calculated = hasPowerInputError(errors) ? null : calculate(inputs);

  const query = buildQuery({
    voltage: inputs.volts.trim(),
    power: inputs.watts.trim(),
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
      title: 'Volts to Amps Calculation',
      inputs: {
        'Voltage': `${fieldNumber(inputs.volts)} V`,
        'Power': `${fieldNumber(inputs.watts)} W`,
        'Phase Configuration': phaseLabel(inputs.phase),
        'Power Factor': fieldNumber(inputs.pf),
      },
      results: {
        'Current Draw': `${result.amps.toFixed(2)} A`,
        'Real Power (P)': `${Math.round(result.watts).toLocaleString('en-US')} W`,
        'Apparent Power (S)': `${Math.round(result.va).toLocaleString('en-US')} VA`,
        'Reactive Power (Q)': `${Math.round(result.vars).toLocaleString('en-US')} VAR`,
        'Power Factor': result.pf.toFixed(2),
        ...Object.fromEntries(rows.map((row) => [`Current at ${row.volts} V`, `${row.amps.toFixed(1)} A`])),
      },
    });
  };

  return (
    <CalculatorLayout
      title="Volts to Amps Calculator"
      description="Convert voltage and power to current for electrical circuits"
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
            label="Voltage"
            type="number"
            value={inputs.volts}
            onChange={(e) => change({ volts: e.target.value })}
            onBlur={() => fields.touch('volts')}
            error={fields.shown('volts', errors.volts)}
            suffix="V"
            min={0}
            step={1}
            hint="Line voltage (120V, 240V, 480V, etc.)"
          />

          <Input
            label="Power"
            type="number"
            value={inputs.watts}
            onChange={(e) => change({ watts: e.target.value })}
            onBlur={() => fields.touch('watts')}
            error={fields.shown('watts', errors.value)}
            suffix="W"
            min={0}
            step={1}
            hint="Real power consumption in watts"
          />

          <Select
            label="Phase Configuration"
            options={PHASE_OPTIONS}
            value={inputs.phase}
            onChange={(e) => change({ phase: e.target.value as Phase })}
          />

          <Input
            label="Power Factor"
            type="number"
            value={inputs.pf}
            onChange={(e) => change({ pf: e.target.value })}
            onBlur={() => fields.touch('pf')}
            error={fields.shown('pf', errors.pf)}
            hint={POWER_FACTOR_NAMEPLATE_NOTE}
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
                <div className="text-sm text-primary-600 font-medium mb-2">Current Draw</div>
                <div className="text-2xl sm:text-4xl font-bold font-mono text-primary-700 break-words min-w-0">
                  {calculated.result.amps.toFixed(2)}
                </div>
                <div className="text-xl font-medium text-primary-600 mt-1">Amps</div>
                <div className="text-sm text-primary-500 mt-2">
                  {phaseLabel(inputs.phase)}
                </div>
              </div>

              {/* Power Triangle */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Power Analysis</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-500">Real Power (P)</div>
                    <div className="text-sm sm:text-lg font-bold font-mono text-green-600 break-words">
                      {Math.round(calculated.result.watts).toLocaleString('en-US')}
                    </div>
                    <div className="text-sm text-neutral-600">W</div>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-500">Apparent Power (S)</div>
                    <div className="text-sm sm:text-lg font-bold font-mono text-blue-600 break-words">
                      {Math.round(calculated.result.va).toLocaleString('en-US')}
                    </div>
                    <div className="text-sm text-neutral-600">VA</div>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-500">Reactive Power (Q)</div>
                    <div className="text-sm sm:text-lg font-bold font-mono text-orange-600 break-words">
                      {Math.round(calculated.result.vars).toLocaleString('en-US')}
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
                        <tr key={row.volts} className={fieldNumber(inputs.volts) === row.volts ? 'bg-primary-100' : ''}>
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
      </div>
    </CalculatorLayout>
  );
}
