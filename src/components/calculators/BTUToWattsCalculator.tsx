'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { formatUpTo } from '@/lib/calculations/format';
import { Thermometer, Calculator, RefreshCw } from 'lucide-react';
import {
  BTU_DEFAULTS,
  BTU_INPUT_INVALID_MESSAGE,
  BTU_MODE_OPTIONS,
  BTU_PER_H_PER_TON,
  thermalConversion,
  W_PER_BTU_PER_H,
  wattsToBtuPerHour,
} from '@/lib/calculations/conversions';
import type { BtuMode, ThermalConversion } from '@/lib/calculations/conversions';

interface Inputs {
  mode: BtuMode;
  /** Field text */
  value: string;
}

const DEFAULT_INPUTS: Inputs = { mode: BTU_DEFAULTS.mode, value: String(BTU_DEFAULTS.value) };

/** Inputs from a share link. */
function inputsFromQuery(params: URLSearchParams): Inputs {
  return {
    mode: choiceParam(params, 'mode', BTU_MODE_OPTIONS.map((o) => o.value)) ?? DEFAULT_INPUTS.mode,
    value: numberParam(params, 'value') ?? DEFAULT_INPUTS.value,
  };
}

function resultRows(result: ThermalConversion): { label: string; value: string }[] {
  return [
    { label: 'Btu/h', value: formatUpTo(result.btuPerHour, 2) },
    { label: 'Watts', value: `${formatUpTo(result.watts, 2)} W` },
    { label: 'Kilowatts', value: `${formatUpTo(result.watts / 1000, 3)} kW` },
    { label: 'Tons (Btu/h ÷ 12,000)', value: formatUpTo(result.tons, 3) },
  ];
}

export function BTUToWattsCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const fields = useFieldErrors();

  const value = fieldNumber(inputs.value);
  const result = thermalConversion(inputs.mode, value);
  const error = result ? null : BTU_INPUT_INVALID_MESSAGE;

  const query = buildQuery({ mode: inputs.mode, value: inputs.value.trim() });
  const { markChanged, shareUrl } = useUrlState(query, (params) => setInputs(inputsFromQuery(params)));
  const { print } = usePrintExport();

  const change = (patch: Partial<Inputs>) => {
    markChanged();
    setInputs((p) => ({ ...p, ...patch }));
  };

  const handleCalculate = () => {
    if (result) focusResults(resultsHeadingRef.current);
    else fields.revealAll(formRef.current);
  };

  const handleReset = () => {
    markChanged();
    fields.reset();
    setInputs(DEFAULT_INPUTS);
  };

  const handlePrint = () => {
    if (!result) return;
    print({
      title: 'BTU to Watts Calculation',
      inputs: {
        'Conversion': BTU_MODE_OPTIONS.find((o) => o.value === inputs.mode)?.label ?? inputs.mode,
        [inputs.mode === 'btu-to-watts' ? 'Btu/h' : 'Watts']: formatUpTo(value, 2),
      },
      results: Object.fromEntries(resultRows(result).map((r) => [r.label, r.value])),
    });
  };

  return (
    <CalculatorLayout
      title="BTU to Watts Calculator"
      description="Convert Btu/h, watts and tons"
      shareUrl={shareUrl}
      onPrint={handlePrint}
      actionsDisabled={!result}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-6" ref={formRef}>
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Select
            label="Conversion"
            options={BTU_MODE_OPTIONS}
            value={inputs.mode}
            onChange={(e) => change({ mode: e.target.value as BtuMode })}
          />

          <Input
            label={inputs.mode === 'btu-to-watts' ? 'Btu/h' : 'Watts'}
            type="number"
            value={inputs.value}
            onChange={(e) => change({ value: e.target.value })}
            onBlur={() => fields.touch('value')}
            error={fields.shown('value', error)}
            min={0}
            step="any"
            suffix={inputs.mode === 'btu-to-watts' ? 'Btu/h' : 'W'}
          />

          {/* Conversion Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">BTU Conversion</span>
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• 1 Btu/h = {W_PER_BTU_PER_H} W (NIST SP 811)</div>
              <div>• 1 ton = {BTU_PER_H_PER_TON.toLocaleString('en-US')} Btu/h</div>
              <div>• 1 kW = {formatUpTo(wattsToBtuPerHour(1000), 2)} Btu/h</div>
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
          {result && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Thermometer className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Thermal Power</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {resultRows(result).map((row) => (
                  <div key={row.label}>
                    <span className="text-orange-600">{row.label}:</span>
                    <p className="font-mono font-semibold text-sm sm:text-lg break-words">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
