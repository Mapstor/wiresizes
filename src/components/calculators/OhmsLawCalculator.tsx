'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { focusResults, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
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

type Quantity = keyof OhmsLawValues;
const QUANTITIES: Quantity[] = ['voltage', 'current', 'resistance', 'power'];

interface Inputs {
  mode: OhmsLawMode;
  /** Field text of each quantity */
  values: Record<Quantity, string>;
}

const EMPTY_VALUES: Record<Quantity, string> = {
  voltage: String(OHMS_LAW_DEFAULTS.voltage),
  current: String(OHMS_LAW_DEFAULTS.current),
  resistance: String(OHMS_LAW_DEFAULTS.resistance),
  power: String(OHMS_LAW_DEFAULTS.power),
};

const DEFAULT_INPUTS: Inputs = { mode: OHMS_LAW_DEFAULTS.mode, values: EMPTY_VALUES };

/** A value counts when it is a number above 0. */
function usable(text: string): boolean {
  return fieldNumber(text) > 0;
}

function solve(inputs: Inputs): OhmsLawValues | null {
  const given = (q: Quantity) => (usable(inputs.values[q]) ? fieldNumber(inputs.values[q]) : null);
  return solveOhmsLaw(inputs.mode, {
    voltage: given('voltage'),
    current: given('current'),
    resistance: given('resistance'),
    power: given('power'),
  });
}

/** Inputs from a share link. */
function inputsFromQuery(params: URLSearchParams): Inputs {
  const values = { ...EMPTY_VALUES };
  for (const q of QUANTITIES) values[q] = numberParam(params, q) ?? values[q];
  return { mode: choiceParam(params, 'mode', OHMS_LAW_MODE_OPTIONS.map((o) => o.value)) ?? DEFAULT_INPUTS.mode, values };
}

export function OhmsLawCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const { mode, values } = inputs;
  // Values stay unrounded; display formats them to 4 significant figures
  const results = solve(inputs);

  const query = buildQuery({
    mode,
    ...Object.fromEntries(QUANTITIES.filter((q) => q !== mode).map((q) => [q, values[q].trim()])),
  });
  const { markChanged, shareUrl } = useUrlState(query, (params) => setInputs(inputsFromQuery(params)));
  const { print } = usePrintExport();

  const setValue = (q: Quantity, text: string) => {
    markChanged();
    setInputs((prev) => ({ ...prev, values: { ...prev.values, [q]: text } }));
  };

  // a new mode starts from empty fields
  const setMode = (next: OhmsLawMode) => {
    markChanged();
    setInputs({ mode: next, values: EMPTY_VALUES });
  };

  const handleCalculate = () => {
    if (results) {
      focusResults(resultsHeadingRef.current);
      return;
    }
    // fewer than two values: the empty-state lines stay, and the first field without a value takes focus
    const first = QUANTITIES.find((q) => q !== mode && !usable(values[q]));
    if (first) formRef.current?.querySelector<HTMLInputElement>(`input[name="${first}"]`)?.focus();
  };

  const handlePrint = () => {
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
  };

  const handleReset = () => {
    markChanged();
    setInputs(DEFAULT_INPUTS);
  };

  return (
    <CalculatorLayout
      title="Ohm's Law Calculator"
      description="Calculate voltage, current, resistance, or power using Ohm's Law"
      shareUrl={shareUrl}
      onPrint={handlePrint}
      actionsDisabled={!results}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-6" ref={formRef}>
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Select
            label="What to Calculate?"
            options={OHMS_LAW_MODE_OPTIONS}
            value={mode}
            onChange={(e) => setMode(e.target.value as OhmsLawMode)}
          />

          {/* Dynamic Input Fields Based on Mode */}
          <div className="space-y-4">
            {mode !== 'voltage' && (
              <Input
                label="Voltage"
                type="number"
                name="voltage"
                value={values.voltage}
                onChange={(e) => setValue('voltage', e.target.value)}
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
                name="current"
                value={values.current}
                onChange={(e) => setValue('current', e.target.value)}
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
                name="resistance"
                value={values.resistance}
                onChange={(e) => setValue('resistance', e.target.value)}
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
                name="power"
                value={values.power}
                onChange={(e) => setValue('power', e.target.value)}
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
        <div className="space-y-6">
          <h2 ref={resultsHeadingRef} tabIndex={-1} className="text-lg font-semibold">Calculation Results</h2>
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
      </div>
    </CalculatorLayout>
  );
}