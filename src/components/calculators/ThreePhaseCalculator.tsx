'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Zap, AlertTriangle, Triangle, Calculator, RefreshCw } from 'lucide-react';
import {
  fromCurrent,
  fromRealPower,
  isPowerError,
  POWER_ERROR_MESSAGES,
  THREE_PHASE_DEFAULTS,
  THREE_PHASE_MODE_OPTIONS,
  THREE_PHASE_SYSTEMS,
} from '@/lib/calculations/power';
import type { PowerResult, ThreePhaseMode } from '@/lib/calculations/power';

type Inputs = typeof THREE_PHASE_DEFAULTS;

const FORMULAS: Record<ThreePhaseMode, string> = {
  power: 'I = P / (√3 × V × PF)',
  current: 'P = √3 × V × I × PF',
};

function lineVolts(system: string): number {
  return THREE_PHASE_SYSTEMS.find((s) => s.system === system)?.lineVolts ?? 208;
}

/** Balanced three-phase P ↔ I on line-to-line voltage; values are rounded for display only. */
function calculate(inputs: Inputs): { result: PowerResult | null; error: string | null } {
  const base = { volts: lineVolts(inputs.system), circuit: 'three' as const, pf: inputs.pf };
  const r = inputs.mode === 'power'
    ? fromRealPower({ ...base, watts: inputs.kilowatts * 1000 })
    : fromCurrent({ ...base, amps: inputs.amps });
  return isPowerError(r) ? { result: null, error: POWER_ERROR_MESSAGES[r.error] } : { result: r, error: null };
}

export function ThreePhaseCalculator() {
  const [inputs, setInputs] = useState<Inputs>(THREE_PHASE_DEFAULTS);
  const [calculated, setCalculated] = useState<({ inputs: Inputs } & ReturnType<typeof calculate>) | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const update = (patch: Partial<Inputs>) => setInputs((prev) => ({ ...prev, ...patch }));

  const performCalculation = useCallback(() => {
    setCalculated({ inputs, ...calculate(inputs) });
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, [inputs]);

  const handleReset = () => {
    setInputs(THREE_PHASE_DEFAULTS);
    setCalculated(null);
  };

  const shareableInputs = {
    system: inputs.system,
    mode: inputs.mode,
    powerFactor: inputs.pf,
    ...(inputs.mode === 'power' ? { power: inputs.kilowatts } : { current: inputs.amps }),
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
    const shown = calculated.inputs;
    print({
      title: 'Three-Phase Calculation',
      inputs: {
        'Voltage System': shown.system,
        'Calculation Mode': THREE_PHASE_MODE_OPTIONS.find((m) => m.value === shown.mode)?.label ?? shown.mode,
        'Power Factor': shown.pf.toString(),
        ...(shown.mode === 'power' ? { 'Power (kW)': `${shown.kilowatts} kW` } : { 'Line Current': `${shown.amps} A` }),
      },
      results: {
        'Line Current': `${calculated.result.amps.toFixed(2)} A`,
        'Power': `${(calculated.result.watts / 1000).toFixed(2)} kW`,
        'Line Voltage': `${lineVolts(shown.system)} V`,
      },
    });
  }, [calculated, print]);

  return (
    <CalculatorLayout
      title="Three-Phase Calculator"
      description="Calculate three-phase electrical circuits"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="space-y-6">
        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-800 mb-1">Three-Phase System Safety</div>
            <div className="text-amber-700">
              Three-phase electrical systems require specialized knowledge and safety procedures.
              All work must be performed by qualified electricians familiar with three-phase power systems.
              Verify phase rotation and proper connections before energizing equipment.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Triangle className="w-5 h-5 text-primary-600" />
              Three-Phase System Configuration
            </h2>

            <div className="space-y-4">
              <Select
                label="Voltage System"
                value={inputs.system}
                onChange={(e) => update({ system: e.target.value })}
                options={THREE_PHASE_SYSTEMS.map((s) => ({ value: s.system, label: s.system }))}
              />

              <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
                • Line Voltage: {lineVolts(inputs.system)}V
              </div>

              <Select
                label="Calculation Mode"
                value={inputs.mode}
                onChange={(e) => update({ mode: e.target.value as ThreePhaseMode })}
                options={THREE_PHASE_MODE_OPTIONS}
              />

              <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
                <div className="font-medium mb-1">Calculation Formula:</div>
                <div className="font-mono text-xs">{FORMULAS[inputs.mode]}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {inputs.mode === 'power' ? (
                  <Input
                    label="Power (kW)"
                    type="number"
                    value={inputs.kilowatts}
                    onChange={(e) => update({ kilowatts: Number(e.target.value) })}
                    suffix="kW"
                    min={0}
                    step={0.1}
                  />
                ) : (
                  <Input
                    label="Line Current"
                    type="number"
                    value={inputs.amps}
                    onChange={(e) => update({ amps: Number(e.target.value) })}
                    suffix="amps"
                    min={0}
                    step={0.1}
                  />
                )}

                <Input
                  label="Power Factor"
                  type="number"
                  value={inputs.pf}
                  onChange={(e) => update({ pf: Number(e.target.value) })}
                  min={0}
                  max={1.0}
                  step={0.01}
                />
              </div>

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
              Three-Phase Results
            </h2>

            {calculated && (calculated.error || !calculated.result ? (
              <div className="rounded-xl p-6 bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
                {calculated.error}
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <div className="text-blue-800 font-semibold">Line Current</div>
                    <div className="text-2xl font-bold text-blue-900">{calculated.result.amps.toFixed(2)}A</div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3">
                    <div className="text-green-800 font-semibold">Power</div>
                    <div className="text-2xl font-bold text-green-900">{(calculated.result.watts / 1000).toFixed(2)}kW</div>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-neutral-600 flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  {calculated.inputs.system} • {lineVolts(calculated.inputs.system)}V • PF: {calculated.inputs.pf}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
