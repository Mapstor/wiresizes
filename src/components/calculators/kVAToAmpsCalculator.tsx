'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { formatEntered, formatFixed, formatUpTo } from '@/lib/calculations/format';
import { Zap, Calculator, RefreshCw } from 'lucide-react';
import { voltageOptions, voltsAfterPhaseChange } from '@/lib/calculations/inputs';
import type { Phase } from '@/lib/calculations/inputs';
import {
  currentByVoltage,
  fromApparentPower,
  hasPowerInputError,
  isPowerError,
  KVA_TO_AMPS_COMPARISON_VOLTS,
  KVA_TO_AMPS_DEFAULTS,
  PHASE_OPTIONS,
  powerInputErrors,
} from '@/lib/calculations/power';
import type { PowerResult, VoltageRow } from '@/lib/calculations/power';

const EQUIPMENT_PRESETS = [
  { name: 'Transformer - 25 kVA', kva: 25, voltage: 480, phase: 'three' },
  { name: 'Transformer - 50 kVA', kva: 50, voltage: 480, phase: 'three' },
  { name: 'Transformer - 75 kVA', kva: 75, voltage: 480, phase: 'three' },
  { name: 'Transformer - 112.5 kVA', kva: 112.5, voltage: 480, phase: 'three' },
  { name: 'Transformer - 225 kVA', kva: 225, voltage: 480, phase: 'three' },
  { name: 'Transformer - 500 kVA', kva: 500, voltage: 480, phase: 'three' },
  { name: 'Generator - 20 kVA', kva: 20, voltage: 240, phase: 'single' },
  { name: 'Generator - 100 kVA', kva: 100, voltage: 480, phase: 'three' },
  { name: 'UPS System - 10 kVA', kva: 10, voltage: 208, phase: 'single' },
  { name: 'Motor Control Center', kva: 800, voltage: 480, phase: 'three' },
];

interface Inputs {
  /** Field text */
  kva: string;
  volts: number;
  phase: Phase;
  /** Field text */
  pf: string;
  isTransformer: boolean;
  primaryVolts: number;
  usePreset: boolean;
  selectedPreset: string;
}

const DEFAULT_INPUTS: Inputs = {
  kva: String(KVA_TO_AMPS_DEFAULTS.kva),
  volts: KVA_TO_AMPS_DEFAULTS.volts,
  phase: KVA_TO_AMPS_DEFAULTS.phase,
  pf: String(KVA_TO_AMPS_DEFAULTS.pf),
  isTransformer: KVA_TO_AMPS_DEFAULTS.isTransformer,
  primaryVolts: KVA_TO_AMPS_DEFAULTS.primaryVolts,
  usePreset: false,
  selectedPreset: EQUIPMENT_PRESETS[0].name,
};

/** With a preset on, its apparent power, voltage and phase replace the inputs. */
function withPreset(inputs: Inputs): Inputs {
  if (!inputs.usePreset) return inputs;
  const preset = EQUIPMENT_PRESETS.find((p) => p.name === inputs.selectedPreset);
  if (!preset) return inputs;
  const phase = preset.phase as Phase;
  return {
    ...inputs,
    kva: String(preset.kva),
    volts: preset.voltage,
    phase,
    primaryVolts: voltsAfterPhaseChange(inputs.primaryVolts, phase),
    isTransformer: preset.name.toLowerCase().includes('transformer'),
  };
}

/** Inputs from a share link. */
function inputsFromQuery(params: URLSearchParams): Inputs {
  const phase = choiceParam(params, 'phase', ['single', 'three'] as Phase[]) ?? DEFAULT_INPUTS.phase;
  return withPreset({
    kva: numberParam(params, 'kva') ?? DEFAULT_INPUTS.kva,
    phase,
    volts: choiceParam(params, 'voltage', voltageOptions(phase)) ?? voltsAfterPhaseChange(DEFAULT_INPUTS.volts, phase),
    pf: numberParam(params, 'powerFactor') ?? DEFAULT_INPUTS.pf,
    isTransformer: choiceParam(params, 'isTransformer', ['true', 'false']) === 'true',
    primaryVolts:
      choiceParam(params, 'primaryVoltage', voltageOptions(phase)) ?? voltsAfterPhaseChange(DEFAULT_INPUTS.primaryVolts, phase),
    usePreset: choiceParam(params, 'usePreset', ['true', 'false']) === 'true',
    selectedPreset: choiceParam(params, 'selectedPreset', EQUIPMENT_PRESETS.map((p) => p.name)) ?? DEFAULT_INPUTS.selectedPreset,
  });
}

interface Calculated {
  result: PowerResult;
  primary: PowerResult | null;
  rows: VoltageRow[];
}

/** The result for valid inputs: load or secondary current, primary current for a transformer, comparison rows. */
function calculate(inputs: Inputs): Calculated | null {
  const va = fieldNumber(inputs.kva) * 1000;
  const pf = fieldNumber(inputs.pf);
  const r = fromApparentPower({ va, volts: inputs.volts, circuit: inputs.phase, pf });
  if (isPowerError(r)) return null;
  let primary: PowerResult | null = null;
  if (inputs.isTransformer) {
    const p = fromApparentPower({ va, volts: inputs.primaryVolts, circuit: inputs.phase, pf });
    if (isPowerError(p)) return null;
    primary = p;
  }
  const rows = currentByVoltage({ va }, inputs.phase, pf, KVA_TO_AMPS_COMPARISON_VOLTS);
  return { result: r, primary, rows };
}

const phaseLabel = (phase: Phase) => (phase === 'single' ? 'Single-Phase' : 'Three-Phase');

export function KVAToAmpsCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const fields = useFieldErrors();

  const errors = powerInputErrors({
    value: fieldNumber(inputs.kva),
    volts: inputs.volts,
    circuit: inputs.phase,
    pf: fieldNumber(inputs.pf),
  });
  const calculated = hasPowerInputError(errors) ? null : calculate(inputs);

  const query = buildQuery({
    kva: inputs.kva.trim(),
    voltage: inputs.volts,
    phase: inputs.phase,
    powerFactor: inputs.pf.trim(),
    isTransformer: inputs.isTransformer,
    ...(inputs.isTransformer && { primaryVoltage: inputs.primaryVolts }),
    usePreset: inputs.usePreset,
    ...(inputs.usePreset && { selectedPreset: inputs.selectedPreset }),
  });
  const { markChanged, shareUrl } = useUrlState(query, (params) => setInputs(inputsFromQuery(params)));
  const { print } = usePrintExport();

  const change = (patch: Partial<Inputs>) => {
    markChanged();
    setInputs(withPreset({ ...inputs, ...patch }));
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
    const { result, primary, rows } = calculated;
    const kva = fieldNumber(inputs.kva);
    print({
      title: 'kVA to Amps Calculation',
      inputs: {
        'Apparent Power': `${formatEntered(kva)} kVA`,
        'Secondary Voltage': `${formatEntered(inputs.volts)} V`,
        'Phase Configuration': phaseLabel(inputs.phase),
        'Power Factor': formatEntered(fieldNumber(inputs.pf)),
        ...(inputs.isTransformer && { 'Primary Voltage': `${formatEntered(inputs.primaryVolts)} V` }),
      },
      results: {
        [`${inputs.isTransformer ? 'Secondary' : 'Load'} Current`]: `${formatFixed(result.amps, 2)} A`,
        ...(primary && { 'Primary Current': `${formatFixed(primary.amps, 2)} A` }),
        'Apparent Power (S)': `${formatEntered(kva)} kVA`,
        'Real Power (P)': `${formatFixed(result.watts / 1000, 1)} kW`,
        'Reactive Power (Q)': `${formatFixed(result.vars / 1000, 1)} kVAR`,
        'Power Factor': formatFixed(result.pf, 2),
        ...(primary && {
          'Current Ratio': `1:${formatFixed(result.amps / primary.amps, 2)}`,
          'Line-to-line voltage ratio': `${formatUpTo(inputs.primaryVolts / inputs.volts, 2)}:1`,
        }),
        ...Object.fromEntries(rows.map((row) => [`Current at ${formatEntered(row.volts)} V`, `${formatFixed(row.amps, 1)} A`])),
      },
    });
  };

  const voltageSelectOptions = voltageOptions(inputs.phase).map((v) => ({ value: String(v), label: `${v} V` }));

  return (
    <CalculatorLayout
      title="kVA to Amps Calculator"
      description="Convert kilovolt-amperes to current for transformers, generators, and electrical equipment"
      shareUrl={shareUrl}
      onPrint={handlePrint}
      actionsDisabled={!calculated}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Input Parameters */}
        <div className="bg-gray-50 rounded-lg p-6" ref={formRef}>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          {/* Preset Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="usePreset"
              checked={inputs.usePreset}
              onChange={(e) => change({ usePreset: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="usePreset" className="text-sm text-neutral-700">
              Use equipment preset
            </label>
          </div>

          {inputs.usePreset && (
            <Select
              label="Equipment Preset"
              options={EQUIPMENT_PRESETS.map(preset => ({
                value: preset.name,
                label: preset.name,
              }))}
              value={inputs.selectedPreset}
              onChange={(e) => change({ selectedPreset: e.target.value })}
            />
          )}

          <Input
            label="Apparent Power"
            type="number"
            value={inputs.kva}
            onChange={(e) => change({ kva: e.target.value })}
            onBlur={() => fields.touch('kva')}
            error={fields.shown('kva', errors.value)}
            suffix="kVA"
            min={0}
            step={0.1}
            disabled={inputs.usePreset}
            hint="Kilovolt-amperes rating"
          />

          <Select
            label="Secondary Voltage"
            options={voltageSelectOptions}
            value={String(inputs.volts)}
            onChange={(e) => change({ volts: Number(e.target.value) })}
            disabled={inputs.usePreset}
          />

          <Select
            label="Phase Configuration"
            options={PHASE_OPTIONS}
            value={inputs.phase}
            onChange={(e) => {
              const phase = e.target.value as Phase;
              change({
                phase,
                volts: voltsAfterPhaseChange(inputs.volts, phase),
                primaryVolts: voltsAfterPhaseChange(inputs.primaryVolts, phase),
              });
            }}
            disabled={inputs.usePreset}
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isTransformer"
              checked={inputs.isTransformer}
              onChange={(e) => change({ isTransformer: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="isTransformer" className="text-sm text-neutral-700">
              Transformer application (calculate primary current)
            </label>
          </div>

          {inputs.isTransformer && (
            <Select
              label="Primary Voltage"
              options={voltageSelectOptions}
              value={String(inputs.primaryVolts)}
              onChange={(e) => change({ primaryVolts: Number(e.target.value) })}
            />
          )}

          {/* Formula Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Formula Used</span>
            </div>
            <div className="font-mono text-sm text-blue-700 space-y-1">
              <div>{inputs.phase === 'single'
                ? 'I = S ÷ V'
                : 'I = S ÷ (V × √3)'
              }</div>
              <div>P = S × PF (real power)</div>
              <div>Q = S × sin(cos⁻¹(PF)) (reactive power)</div>
            </div>
            <div className="text-xs text-blue-600 mt-2">
              Where: I = Current (A), S = Apparent Power (VA), V = Voltage (V), PF = Power Factor
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
                <div className="text-sm text-primary-600 font-medium mb-2">
                  {inputs.isTransformer ? 'Secondary' : 'Load'} Current
                </div>
                <div className="text-2xl sm:text-4xl font-bold font-mono text-primary-700 break-words min-w-0">
                  {formatFixed(calculated.result.amps, 2)}
                </div>
                <div className="text-xl font-medium text-primary-600 mt-1">Amps</div>
                <div className="text-sm text-primary-500 mt-2">
                  @ {formatEntered(inputs.volts)} V {phaseLabel(inputs.phase)}
                </div>
              </div>

              {/* Transformer Primary Current */}
              {calculated.primary && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Primary Side</span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-amber-700">
                      {formatFixed(calculated.primary.amps, 2)}
                    </div>
                    <div className="text-lg font-medium text-amber-600">Amps</div>
                    <div className="text-sm text-amber-600 mt-1">
                      @ {formatEntered(inputs.primaryVolts)} V Primary
                    </div>
                  </div>
                </div>
              )}

              {/* Power Analysis */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800 mb-3">Power Triangle</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Apparent Power (S):</span>
                    <span className="font-mono font-semibold">{formatEntered(fieldNumber(inputs.kva))} kVA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Real Power (P):</span>
                    <span className="font-mono font-semibold">{formatFixed(calculated.result.watts / 1000, 1)} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Reactive Power (Q):</span>
                    <span className="font-mono font-semibold">{formatFixed(calculated.result.vars / 1000, 1)} kVAR</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-2">
                    <span className="text-blue-600">Power Factor:</span>
                    <span className="font-mono font-semibold">{formatFixed(calculated.result.pf, 2)}</span>
                  </div>
                </div>
              </div>

              {/* Transformer Ratios */}
              {calculated.primary && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-neutral-700 mb-3">Transformer Ratios</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Current Ratio:</span>
                      <span className="font-mono font-semibold">
                        1:{formatFixed(calculated.result.amps / calculated.primary.amps, 2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Line-to-line voltage ratio:</span>
                      <span className="font-mono font-semibold">
                        {formatUpTo(inputs.primaryVolts / inputs.volts, 2)}:1
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Voltage Comparison */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-sm font-medium text-purple-800 mb-3">Current at Different Voltages</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-purple-300">
                        <th className="text-left p-1">Voltage</th>
                        <th className="text-left p-1">Current</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-200">
                      {calculated.rows.map((row) => (
                        <tr key={row.volts} className={inputs.volts === row.volts ? 'bg-purple-100' : ''}>
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
