'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { CalculatorLayout } from './CalculatorLayout';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
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
  /** Field text */
  volts: string;
  /** Field text */
  loads: string;
  /** Field text */
  wattsPerLoad: string;
  /** Field text */
  lengthFt: string;
  /** Field text */
  dropPct: string;
  tempC: number;
}

interface Row {
  label: string;
  value: string;
}

const DEFAULT_INPUTS: Inputs = {
  volts: String(DC_SIZING_DEFAULTS.volts),
  loads: String(DC_SIZING_DEFAULTS.loads),
  wattsPerLoad: String(DC_SIZING_DEFAULTS.wattsPerLoad),
  lengthFt: String(DC_SIZING_DEFAULTS.lengthFt),
  dropPct: String(DC_SIZING_DEFAULTS.dropPct),
  tempC: DC_SIZING_DEFAULTS.tempC,
};

type FieldName = 'volts' | 'loads' | 'wattsPerLoad' | 'lengthFt' | 'dropPct';
const NUMBER_FIELDS: FieldName[] = ['volts', 'loads', 'wattsPerLoad', 'lengthFt', 'dropPct'];

/** Every number must be greater than 0; the message names them all. */
function fieldErrors(inputs: Inputs): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  for (const name of NUMBER_FIELDS) if (!(fieldNumber(inputs[name]) > 0)) errors[name] = INPUT_INVALID_MESSAGE;
  return errors;
}

/** Inputs from a share link. */
function inputsFromQuery(params: URLSearchParams): Inputs {
  return {
    volts: numberParam(params, 'voltage') ?? DEFAULT_INPUTS.volts,
    loads: numberParam(params, 'numberOfLoads') ?? DEFAULT_INPUTS.loads,
    wattsPerLoad: numberParam(params, 'wattsPerLoad') ?? DEFAULT_INPUTS.wattsPerLoad,
    lengthFt: numberParam(params, 'distance') ?? DEFAULT_INPUTS.lengthFt,
    dropPct: numberParam(params, 'maxVoltageDrop') ?? DEFAULT_INPUTS.dropPct,
    tempC: choiceParam(params, 'temperature', DC_TEMPERATURE_OPTIONS.map((t) => t.value)) ?? DEFAULT_INPUTS.tempC,
  };
}

function inputRows(inputs: Inputs): Row[] {
  return [
    { label: 'Voltage', value: `${fieldNumber(inputs.volts)} V` },
    { label: 'Number of Loads', value: String(fieldNumber(inputs.loads)) },
    { label: 'Watts per Load', value: `${fieldNumber(inputs.wattsPerLoad)} W` },
    { label: 'Distance (one way)', value: `${fieldNumber(inputs.lengthFt)} ft` },
    { label: 'Voltage-drop target (your choice)', value: `${fieldNumber(inputs.dropPct)} %` },
    { label: 'Conductor temperature', value: DC_TEMPERATURE_OPTIONS.find((t) => t.value === inputs.tempC)?.label ?? '' },
  ];
}

/** Result lines (screen and print) or a message when there is no result. */
function computeRows(inputs: Inputs): { rows: Row[]; resultSize: string | null; message: string | null } {
  const volts = fieldNumber(inputs.volts);
  const loads = fieldNumber(inputs.loads);
  const watts = loads * fieldNumber(inputs.wattsPerLoad);
  const result = dcSizing({
    volts,
    watts: loads > 0 ? watts : 0,
    lengthFt: fieldNumber(inputs.lengthFt),
    dropPct: fieldNumber(inputs.dropPct),
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
  const formRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const fields = useFieldErrors();

  const errors = fieldErrors(inputs);
  const valid = Object.keys(errors).length === 0;
  const computed = valid ? computeRows(inputs) : null;

  const query = buildQuery({
    voltage: inputs.volts.trim(),
    numberOfLoads: inputs.loads.trim(),
    wattsPerLoad: inputs.wattsPerLoad.trim(),
    distance: inputs.lengthFt.trim(),
    maxVoltageDrop: inputs.dropPct.trim(),
    temperature: inputs.tempC,
  });
  const { markChanged, shareUrl } = useUrlState(query, (params) => setInputs(inputsFromQuery(params)));
  const { print } = usePrintExport();

  const update = (patch: Partial<Inputs>) => {
    markChanged();
    setInputs((prev) => ({ ...prev, ...patch }));
  };

  const handleCalculate = () => {
    if (valid) focusResults(resultsHeadingRef.current);
    else fields.revealAll(formRef.current);
  };

  const handleReset = () => {
    markChanged();
    fields.reset();
    setInputs(DEFAULT_INPUTS);
  };

  const handlePrint = () => {
    if (!computed || computed.rows.length === 0) return;
    const results: Record<string, string> = {};
    if (computed.resultSize) results['Copper wire size'] = formatSize(computed.resultSize);
    for (const row of computed.rows) results[row.label] = row.value;
    print({
      title: 'Low Voltage Circuit Calculation',
      inputs: Object.fromEntries(inputRows(inputs).map((r) => [r.label, r.value])),
      results,
      notes: computed.message ? [computed.message, BASIS_LINE] : [BASIS_LINE],
    });
  };

  const numberField = (name: FieldName) => ({
    value: inputs[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => update({ [name]: e.target.value }),
    onBlur: () => fields.touch(name),
    error: fields.shown(name, errors[name]),
  });

  return (
    <CalculatorLayout
      title="Low Voltage Calculator"
      description="Calculate wire size for low voltage electrical systems"
      shareUrl={shareUrl}
      onPrint={handlePrint}
      actionsDisabled={!valid}
    >
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6" ref={formRef}>
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary-600" />
              Low Voltage Circuit
            </h2>

            <div className="space-y-4">
              <Input
                label="Voltage"
                type="number"
                {...numberField('volts')}
                suffix="V"
                min={0}
                step="any"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Number of Loads"
                  type="number"
                  {...numberField('loads')}
                  suffix="units"
                  min={1}
                  step={1}
                />
                <Input
                  label="Watts per Load"
                  type="number"
                  {...numberField('wattsPerLoad')}
                  suffix="W"
                  min={0}
                  step="any"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Distance (one way)"
                  type="number"
                  {...numberField('lengthFt')}
                  suffix="feet"
                  min={0}
                  step="any"
                />

                <Input
                  label="Voltage-drop target (your choice)"
                  type="number"
                  {...numberField('dropPct')}
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
              Low Voltage Wire Size Results
            </h2>

            {computed && (
              <div className="bg-neutral-50 rounded-xl p-6 space-y-4">
                {computed.resultSize ? (
                  <div className="bg-blue-100 rounded-lg p-3 text-center">
                    <div className="text-blue-800 font-semibold">Copper wire size</div>
                    <div className="text-2xl font-bold text-blue-900">{formatSize(computed.resultSize)}</div>
                  </div>
                ) : (
                  <div className="rounded-lg p-4 bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
                    {computed.message}
                  </div>
                )}

                {computed.rows.length > 0 && (
                  <dl className="space-y-2 text-sm">
                    {computed.rows.map((row) => (
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
