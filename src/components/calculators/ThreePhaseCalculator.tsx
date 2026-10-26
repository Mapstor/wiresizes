'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { CalculatorLayout } from './CalculatorLayout';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { Zap, AlertTriangle, Triangle, Calculator, RefreshCw } from 'lucide-react';
import {
  fromCurrent,
  fromRealPower,
  hasPowerInputError,
  isPowerError,
  powerInputErrors,
  THREE_PHASE_DEFAULTS,
  THREE_PHASE_MODE_OPTIONS,
  THREE_PHASE_SYSTEMS,
} from '@/lib/calculations/power';
import type { PowerResult, ThreePhaseMode } from '@/lib/calculations/power';

interface Inputs {
  system: string;
  mode: ThreePhaseMode;
  /** Field text */
  kilowatts: string;
  /** Field text */
  amps: string;
  /** Field text */
  pf: string;
}

const DEFAULT_INPUTS: Inputs = {
  system: THREE_PHASE_DEFAULTS.system,
  mode: THREE_PHASE_DEFAULTS.mode,
  kilowatts: String(THREE_PHASE_DEFAULTS.kilowatts),
  amps: String(THREE_PHASE_DEFAULTS.amps),
  pf: String(THREE_PHASE_DEFAULTS.pf),
};

/** Inputs from a share link. */
function inputsFromQuery(params: URLSearchParams): Inputs {
  return {
    system: choiceParam(params, 'system', THREE_PHASE_SYSTEMS.map((s) => s.system)) ?? DEFAULT_INPUTS.system,
    mode: choiceParam(params, 'mode', THREE_PHASE_MODE_OPTIONS.map((m) => m.value)) ?? DEFAULT_INPUTS.mode,
    kilowatts: numberParam(params, 'power') ?? DEFAULT_INPUTS.kilowatts,
    amps: numberParam(params, 'current') ?? DEFAULT_INPUTS.amps,
    pf: numberParam(params, 'powerFactor') ?? DEFAULT_INPUTS.pf,
  };
}

const FORMULAS: Record<ThreePhaseMode, string> = {
  power: 'I = P / (√3 × V × PF)',
  current: 'P = √3 × V × I × PF',
};

function lineVolts(system: string): number {
  return THREE_PHASE_SYSTEMS.find((s) => s.system === system)?.lineVolts ?? 208;
}

/** Balanced three-phase P ↔ I on line-to-line voltage; values are rounded for display only. */
function calculate(inputs: Inputs): PowerResult | null {
  const base = { volts: lineVolts(inputs.system), circuit: 'three' as const, pf: fieldNumber(inputs.pf) };
  const r = inputs.mode === 'power'
    ? fromRealPower({ ...base, watts: fieldNumber(inputs.kilowatts) * 1000 })
    : fromCurrent({ ...base, amps: fieldNumber(inputs.amps) });
  return isPowerError(r) ? null : r;
}

export function ThreePhaseCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const fields = useFieldErrors();

  const valueField = inputs.mode === 'power' ? 'kilowatts' : 'amps';
  const errors = powerInputErrors({
    value: fieldNumber(inputs[valueField]),
    volts: lineVolts(inputs.system),
    circuit: 'three',
    pf: fieldNumber(inputs.pf),
  });
  const result = hasPowerInputError(errors) ? null : calculate(inputs);

  const query = buildQuery({
    system: inputs.system,
    mode: inputs.mode,
    powerFactor: inputs.pf.trim(),
    ...(inputs.mode === 'power' ? { power: inputs.kilowatts.trim() } : { current: inputs.amps.trim() }),
  });
  const { markChanged, shareUrl } = useUrlState(query, (params) => setInputs(inputsFromQuery(params)));
  const { print } = usePrintExport();

  const update = (patch: Partial<Inputs>) => {
    markChanged();
    setInputs((prev) => ({ ...prev, ...patch }));
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
      title: 'Three-Phase Calculation',
      inputs: {
        'Voltage System': inputs.system,
        'Calculation Mode': THREE_PHASE_MODE_OPTIONS.find((m) => m.value === inputs.mode)?.label ?? inputs.mode,
        'Power Factor': fieldNumber(inputs.pf).toString(),
        ...(inputs.mode === 'power'
          ? { 'Power (kW)': `${fieldNumber(inputs.kilowatts)} kW` }
          : { 'Line Current': `${fieldNumber(inputs.amps)} A` }),
      },
      results: {
        'Line Current': `${result.amps.toFixed(2)} A`,
        'Power': `${(result.watts / 1000).toFixed(2)} kW`,
        'Line Voltage': `${lineVolts(inputs.system)} V`,
      },
    });
  };

  return (
    <CalculatorLayout
      title="Three-Phase Calculator"
      description="Calculate three-phase electrical circuits"
      shareUrl={shareUrl}
      onPrint={handlePrint}
      actionsDisabled={!result}
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
          <div className="space-y-6" ref={formRef}>
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
                    onChange={(e) => update({ kilowatts: e.target.value })}
                    onBlur={() => fields.touch('kilowatts')}
                    error={fields.shown('kilowatts', errors.value)}
                    suffix="kW"
                    min={0}
                    step={0.1}
                  />
                ) : (
                  <Input
                    label="Line Current"
                    type="number"
                    value={inputs.amps}
                    onChange={(e) => update({ amps: e.target.value })}
                    onBlur={() => fields.touch('amps')}
                    error={fields.shown('amps', errors.value)}
                    suffix="amps"
                    min={0}
                    step={0.1}
                  />
                )}

                <Input
                  label="Power Factor"
                  type="number"
                  value={inputs.pf}
                  onChange={(e) => update({ pf: e.target.value })}
                  onBlur={() => fields.touch('pf')}
                  error={fields.shown('pf', errors.pf)}
                  min={0}
                  max={1.0}
                  step={0.01}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <h2 ref={resultsHeadingRef} tabIndex={-1} className="text-lg font-semibold text-neutral-900">
              Three-Phase Results
            </h2>

            {result && (
              <div className="bg-neutral-50 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <div className="text-blue-800 font-semibold">Line Current</div>
                    <div className="text-2xl font-bold text-blue-900">{result.amps.toFixed(2)}A</div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3">
                    <div className="text-green-800 font-semibold">Power</div>
                    <div className="text-2xl font-bold text-green-900">{(result.watts / 1000).toFixed(2)}kW</div>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-neutral-600 flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  {inputs.system} • {lineVolts(inputs.system)}V • PF: {fieldNumber(inputs.pf)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
