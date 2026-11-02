'use client';

import { useRef, useState } from 'react';
import { Calculator, Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { THREE_PHASE_VOLTS } from '@/lib/calculations/inputs';
import {
  AMPS_TO_WATTS_DEFAULTS,
  fromCurrent,
  hasPowerInputError,
  isPowerError,
  powerInputErrors,
} from '@/lib/calculations/power';
import type { Circuit } from '@/lib/calculations/power';
import { wattsToElectricalHorsepower } from '@/lib/calculations/conversions';
import { fieldNumber } from '@/lib/calculations/fields';
import { formatEntered, formatFixed } from '@/lib/calculations/format';
import { focusResults, useFieldErrors } from '@/lib/hooks/useCalculatorForm';

const DC_VOLTAGES = [12, 24, 48];
const AC_VOLTAGES = [120, 208, 240, 277, 480, 600];
const CUSTOM = 'custom';

type PowerType = 'ac' | 'dc';
type PhaseType = 'single' | 'three';

interface Inputs {
  /** Field text */
  amps: string;
  volts: number;
  /** Field text */
  customVoltage: string;
  useCustomVoltage: boolean;
  powerType: PowerType;
  phaseType: PhaseType;
  /** Field text */
  pf: string;
}

const DEFAULT_INPUTS: Inputs = {
  amps: String(AMPS_TO_WATTS_DEFAULTS.amps),
  volts: AMPS_TO_WATTS_DEFAULTS.volts,
  customVoltage: '',
  useCustomVoltage: false,
  powerType: AMPS_TO_WATTS_DEFAULTS.circuit === 'dc' ? 'dc' : 'ac',
  phaseType: AMPS_TO_WATTS_DEFAULTS.circuit === 'three' ? 'three' : 'single',
  pf: String(AMPS_TO_WATTS_DEFAULTS.pf),
};

/** Voltages offered for the power type and phase; three-phase offers line-to-line voltages only. */
function voltageChoices(powerType: PowerType, phaseType: PhaseType): number[] {
  if (powerType === 'dc') return DC_VOLTAGES;
  return phaseType === 'three' ? THREE_PHASE_VOLTS : AC_VOLTAGES;
}

function circuitOf(inputs: Inputs): Circuit {
  return inputs.powerType === 'dc' ? 'dc' : inputs.phaseType;
}

function withValidVoltage(inputs: Inputs): Inputs {
  const choices = voltageChoices(inputs.powerType, inputs.phaseType);
  if (inputs.powerType === 'ac' && inputs.phaseType === 'three') {
    return choices.includes(inputs.volts) && !inputs.useCustomVoltage
      ? inputs
      : { ...inputs, useCustomVoltage: false, volts: 240 };
  }
  return choices.includes(inputs.volts) || inputs.useCustomVoltage ? inputs : { ...inputs, volts: choices[0] };
}

function formulaText(inputs: Inputs, volts: number, watts: number): string {
  const amps = formatEntered(fieldNumber(inputs.amps));
  const v = formatEntered(volts);
  const w = formatFixed(watts, 2);
  if (inputs.powerType === 'dc') return `P = I × V = ${amps} A × ${v} V = ${w} W`;
  const pf = formatEntered(fieldNumber(inputs.pf));
  if (inputs.phaseType === 'single') {
    return `P = I × V × PF = ${amps} A × ${v} V × ${pf} = ${w} W`;
  }
  return `P = I × V × √3 × PF = ${amps} A × ${v} V × 1.732 × ${pf} = ${w} W`;
}

export default function AmpsToWattsCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const fields = useFieldErrors();

  const amps = fieldNumber(inputs.amps);
  const pf = fieldNumber(inputs.pf);
  const volts = inputs.useCustomVoltage ? fieldNumber(inputs.customVoltage) : inputs.volts;
  const circuit = circuitOf(inputs);
  const errors = powerInputErrors({ value: amps, volts, circuit, pf });
  const r = hasPowerInputError(errors) ? null : fromCurrent({ amps, volts, circuit, pf });
  const result = r && !isPowerError(r) ? r : null;

  const update = (patch: Partial<Inputs>) => setInputs((prev) => withValidVoltage({ ...prev, ...patch }));

  const handleCalculate = () => {
    if (result) focusResults(resultsHeadingRef.current);
    else fields.revealAll(formRef.current);
  };

  const handleReset = () => {
    fields.reset();
    setInputs(DEFAULT_INPUTS);
  };

  const choices = voltageChoices(inputs.powerType, inputs.phaseType);
  const allowCustom = !(inputs.powerType === 'ac' && inputs.phaseType === 'three');
  const voltageSelectOptions = [
    ...choices.map((v) => ({ value: String(v), label: `${v}V ${inputs.powerType === 'dc' ? 'DC' : 'AC'}` })),
    ...(allowCustom ? [{ value: CUSTOM, label: 'Custom Voltage...' }] : []),
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Inputs Section */}
      <div className="bg-gray-50 rounded-lg p-6" ref={formRef}>
        <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Input
              label="Current (Amps)"
              type="number"
              value={inputs.amps}
              onChange={(e) => update({ amps: e.target.value })}
              onBlur={() => fields.touch('amps')}
              error={fields.shown('amps', errors.value)}
              min={0}
              max={10000}
              step={0.1}
              hint="Line current for three-phase systems"
            />

            <div className="space-y-3">
              <Select
                label="Voltage"
                options={voltageSelectOptions}
                value={inputs.useCustomVoltage ? CUSTOM : String(inputs.volts)}
                onChange={(e) =>
                  e.target.value === CUSTOM
                    ? update({ useCustomVoltage: true })
                    : update({ useCustomVoltage: false, volts: Number(e.target.value) })
                }
                hint="Line-to-line voltage for three-phase"
              />
              {inputs.useCustomVoltage && (
                <Input
                  aria-label="Custom voltage in volts"
                  type="number"
                  value={inputs.customVoltage}
                  onChange={(e) => update({ customVoltage: e.target.value })}
                  onBlur={() => fields.touch('customVoltage')}
                  error={fields.shown('customVoltage', errors.volts)}
                  placeholder="Enter custom voltage"
                  min={0}
                  step={0.1}
                  suffix="V"
                />
              )}
            </div>

            <Select
              label="Power Type"
              options={[
                { value: 'ac', label: 'AC Power' },
                { value: 'dc', label: 'DC Power' },
              ]}
              value={inputs.powerType}
              onChange={(e) => update({ powerType: e.target.value as PowerType })}
            />

            {/* Phase Type (AC only) */}
            {inputs.powerType === 'ac' && (
              <Select
                label="Phase Configuration"
                options={[
                  { value: 'single', label: 'Single Phase' },
                  { value: 'three', label: 'Three Phase' },
                ]}
                value={inputs.phaseType}
                onChange={(e) => update({ phaseType: e.target.value as PhaseType })}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Power Factor (AC only) */}
            {inputs.powerType === 'ac' && (
              <Input
                label="Power Factor"
                type="number"
                value={inputs.pf}
                onChange={(e) => update({ pf: e.target.value })}
                onBlur={() => fields.touch('pf')}
                error={fields.shown('pf', errors.pf)}
                min={0}
                max={1}
                step={0.01}
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
          <Button onClick={handleCalculate} className="flex-1">
            <Calculator className="w-4 h-4" />
            Calculate Power
          </Button>

          <Button variant="secondary" onClick={handleReset} className="flex-1">
            <RotateCcw className="w-4 h-4" />
            Reset Calculator
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <h2 ref={resultsHeadingRef} tabIndex={-1} className="text-lg font-semibold">Calculation Results</h2>
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Conversion Results</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Real Power */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="text-sm text-blue-600 mb-1">Real Power</div>
                <div className="text-2xl font-bold text-blue-900">{formatFixed(result.watts, 2)} W</div>
                <div className="text-sm text-blue-700 mt-1">{formatFixed(result.watts / 1000, 3)} kW</div>
              </div>

              {/* Apparent Power */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="text-sm text-purple-600 mb-1">Apparent Power</div>
                <div className="text-2xl font-bold text-purple-900">{formatFixed(result.va, 2)} VA</div>
                <div className="text-sm text-purple-700 mt-1">{formatFixed(result.va / 1000, 3)} kVA</div>
              </div>

              {/* Electrical horsepower */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="text-sm text-orange-600 mb-1">Electrical horsepower (746 W)</div>
                <div className="text-2xl font-bold text-orange-900">
                  {formatFixed(wattsToElectricalHorsepower(result.watts), 2)} hp
                </div>
              </div>

              {/* Power factor (AC only) */}
              {inputs.powerType === 'ac' && (
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg p-4 border border-neutral-200">
                  <div className="text-sm text-neutral-600 mb-1">Power factor (PF = P/S)</div>
                  <div className="text-2xl font-bold text-neutral-900">{formatFixed(result.pf, 2)}</div>
                </div>
              )}
            </div>

            {/* Formula Display */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-2">Calculation Formula:</div>
              <div className="font-mono text-sm text-gray-800">{formulaText(inputs, volts, result.watts)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
