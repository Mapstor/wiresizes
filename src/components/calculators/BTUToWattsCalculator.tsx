'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
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

type Inputs = typeof BTU_DEFAULTS;

function format(value: number, digits: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: digits });
}

function resultRows(result: ThermalConversion): { label: string; value: string }[] {
  return [
    { label: 'Btu/h', value: format(result.btuPerHour, 2) },
    { label: 'Watts', value: `${format(result.watts, 2)} W` },
    { label: 'Kilowatts', value: `${format(result.watts / 1000, 3)} kW` },
    { label: 'Tons (Btu/h ÷ 12,000)', value: format(result.tons, 3) },
  ];
}

export function BTUToWattsCalculator() {
  const [inputs, setInputs] = useState<Inputs>(BTU_DEFAULTS);
  const [calculated, setCalculated] = useState<{ inputs: Inputs; result: ThermalConversion | null } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const performCalculation = useCallback(() => {
    setCalculated({ inputs, result: thermalConversion(inputs.mode, inputs.value) });
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, [inputs]);

  const handleReset = () => {
    setInputs(BTU_DEFAULTS);
    setCalculated(null);
  };

  const shareableInputs = { mode: inputs.mode, value: inputs.value };
  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!calculated?.result) return;
    const shown = calculated.inputs;
    print({
      title: 'BTU to Watts Calculation',
      inputs: {
        'Conversion': BTU_MODE_OPTIONS.find((o) => o.value === shown.mode)?.label ?? shown.mode,
        [shown.mode === 'btu-to-watts' ? 'Btu/h' : 'Watts']: format(shown.value, 2),
      },
      results: Object.fromEntries(resultRows(calculated.result).map((r) => [r.label, r.value])),
    });
  }, [calculated, print]);

  return (
    <CalculatorLayout
      title="BTU to Watts Calculator"
      description="Convert Btu/h, watts and tons"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Select
            label="Conversion"
            options={BTU_MODE_OPTIONS}
            value={inputs.mode}
            onChange={(e) => setInputs((p) => ({ ...p, mode: e.target.value as BtuMode }))}
          />

          <Input
            label={inputs.mode === 'btu-to-watts' ? 'Btu/h' : 'Watts'}
            type="number"
            value={inputs.value}
            onChange={(e) => setInputs((p) => ({ ...p, value: Number(e.target.value) }))}
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
              <div>• 1 kW = {format(wattsToBtuPerHour(1000), 2)} Btu/h</div>
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
        {calculated && (
          <div className="space-y-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold">Calculation Results</h2>
            {!calculated.result ? (
              <div className="rounded-xl p-6 bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
                {BTU_INPUT_INVALID_MESSAGE}
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Thermometer className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Thermal Power</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {resultRows(calculated.result).map((row) => (
                    <div key={row.label}>
                      <span className="text-orange-600">{row.label}:</span>
                      <p className="font-mono font-semibold text-sm sm:text-lg break-words">{row.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
