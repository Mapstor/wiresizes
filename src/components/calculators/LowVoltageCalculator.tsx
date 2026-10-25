'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Cpu, Calculator, RefreshCw } from 'lucide-react';
import {
  BASIS_LINE,
  DC_SIZING_DEFAULTS,
  DC_TEMPERATURE_OPTIONS,
  dcSizing,
  GOVERNS_LABELS,
  INPUT_INVALID_MESSAGE,
  NO_SIZE_MESSAGE,
} from '@/lib/calculations/dc-sizing';
import { formatSize } from '@/lib/calculations/sizes';

interface Inputs {
  volts: number;
  loads: number;
  wattsPerLoad: number;
  lengthFt: number;
  dropPct: number;
  tempC: number;
}

interface Row {
  label: string;
  value: string;
}

const DEFAULT_INPUTS: Inputs = { ...DC_SIZING_DEFAULTS };

function inputRows(inputs: Inputs): Row[] {
  return [
    { label: 'Voltage', value: `${inputs.volts} V` },
    { label: 'Number of Loads', value: String(inputs.loads) },
    { label: 'Watts per Load', value: `${inputs.wattsPerLoad} W` },
    { label: 'Distance (one way)', value: `${inputs.lengthFt} ft` },
    { label: 'Voltage-drop target (your choice)', value: `${inputs.dropPct} %` },
    { label: 'Conductor temperature', value: DC_TEMPERATURE_OPTIONS.find((t) => t.value === inputs.tempC)?.label ?? '' },
  ];
}

/** Result lines (screen and print) or a message when there is no result. */
function computeRows(inputs: Inputs): { rows: Row[]; resultSize: string | null; message: string | null } {
  const watts = inputs.loads * inputs.wattsPerLoad;
  const result = dcSizing({
    volts: inputs.volts,
    watts: inputs.loads > 0 ? watts : 0,
    lengthFt: inputs.lengthFt,
    dropPct: inputs.dropPct,
    tempC: inputs.tempC,
  });
  if ('error' in result) return { rows: [], resultSize: null, message: INPUT_INVALID_MESSAGE };
  const rows: Row[] = [
    { label: 'Total load', value: `${Number(watts.toFixed(3))} W` },
    { label: 'Current (I = W ÷ V)', value: `${Number(result.amps.toFixed(3))} A` },
    { label: 'Required area (CM = 2 × K × I × L ÷ VD)', value: `${Math.round(result.requiredCmil).toLocaleString('en-US')} cmil` },
    { label: 'Size for voltage drop', value: result.vdSize ? formatSize(result.vdSize) : '–' },
    { label: 'Size for current (60 °C column)', value: result.currentSize ? formatSize(result.currentSize) : '–' },
  ];
  if (!result.resultSize || !result.governs) return { rows, resultSize: null, message: NO_SIZE_MESSAGE };
  rows.push({ label: 'Governs', value: GOVERNS_LABELS[result.governs] });
  return { rows, resultSize: result.resultSize, message: null };
}

export function LowVoltageCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [calculated, setCalculated] = useState<
    ({ inputs: Inputs } & ReturnType<typeof computeRows>) | null
  >(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const update = (patch: Partial<Inputs>) => setInputs((prev) => ({ ...prev, ...patch }));

  const performCalculation = useCallback(() => {
    setCalculated({ inputs, ...computeRows(inputs) });
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, [inputs]);

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setCalculated(null);
  };

  const shareableInputs = {
    voltage: inputs.volts,
    numberOfLoads: inputs.loads,
    wattsPerLoad: inputs.wattsPerLoad,
    distance: inputs.lengthFt,
    maxVoltageDrop: inputs.dropPct,
    temperature: inputs.tempC,
  };
  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!calculated || calculated.rows.length === 0) return;
    const results: Record<string, string> = {};
    if (calculated.resultSize) results['Copper wire size'] = formatSize(calculated.resultSize);
    for (const row of calculated.rows) results[row.label] = row.value;
    print({
      title: 'Low Voltage Circuit Calculation',
      inputs: Object.fromEntries(inputRows(calculated.inputs).map((r) => [r.label, r.value])),
      results,
      notes: calculated.message ? [calculated.message, BASIS_LINE] : [BASIS_LINE],
    });
  }, [calculated, print]);

  return (
    <CalculatorLayout
      title="Low Voltage Calculator"
      description="Calculate wire size for low voltage electrical systems"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary-600" />
              Low Voltage Circuit
            </h2>

            <div className="space-y-4">
              <Input
                label="Voltage"
                type="number"
                value={inputs.volts}
                onChange={(e) => update({ volts: Number(e.target.value) })}
                suffix="V"
                min={0}
                step="any"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Number of Loads"
                  type="number"
                  value={inputs.loads}
                  onChange={(e) => update({ loads: Number(e.target.value) })}
                  suffix="units"
                  min={1}
                  step={1}
                />
                <Input
                  label="Watts per Load"
                  type="number"
                  value={inputs.wattsPerLoad}
                  onChange={(e) => update({ wattsPerLoad: Number(e.target.value) })}
                  suffix="W"
                  min={0}
                  step="any"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Distance (one way)"
                  type="number"
                  value={inputs.lengthFt}
                  onChange={(e) => update({ lengthFt: Number(e.target.value) })}
                  suffix="feet"
                  min={0}
                  step="any"
                />

                <Input
                  label="Voltage-drop target (your choice)"
                  type="number"
                  value={inputs.dropPct}
                  onChange={(e) => update({ dropPct: Number(e.target.value) })}
                  suffix="%"
                  min={0}
                  step={0.5}
                />
              </div>

              <Select
                label="Conductor temperature"
                value={String(inputs.tempC)}
                onChange={(e) => update({ tempC: Number(e.target.value) })}
                options={DC_TEMPERATURE_OPTIONS.map((t) => ({ value: String(t.value), label: t.label }))}
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
          </div>

          {/* Results Section */}
          <div className="space-y-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold text-neutral-900">
              Low Voltage Wire Size Results
            </h2>

            {calculated && (
              <div className="bg-neutral-50 rounded-xl p-6 space-y-4">
                {calculated.resultSize ? (
                  <div className="bg-blue-100 rounded-lg p-3 text-center">
                    <div className="text-blue-800 font-semibold">Copper wire size</div>
                    <div className="text-2xl font-bold text-blue-900">{formatSize(calculated.resultSize)}</div>
                  </div>
                ) : (
                  <div className="rounded-lg p-4 bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
                    {calculated.message}
                  </div>
                )}

                {calculated.rows.length > 0 && (
                  <dl className="space-y-2 text-sm">
                    {calculated.rows.map((row) => (
                      <div key={row.label} className="flex justify-between gap-4">
                        <dt>{row.label}:</dt>
                        <dd className="font-mono">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <p className="text-xs text-neutral-600">{BASIS_LINE}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
