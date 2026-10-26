'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { CalculatorLayout } from './CalculatorLayout';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { Activity, AlertTriangle, Info, Thermometer, Calculator, RefreshCw } from 'lucide-react';
import { diameterMm, formatSize, materialName } from '@/lib/calculations/sizes';
import type { Material, SizeKey } from '@/lib/calculations/sizes';
import {
  alpha,
  CIRCUIT_OPTIONS,
  fahrenheitToCelsius,
  maxLengthFt,
  powerLossWatts,
  r20,
  RESISTANCE_DEFAULTS,
  RESISTANCE_INPUT_MESSAGES,
  RESISTANCE_MODE_OPTIONS,
  RESISTANCE_NOTES,
  resistanceAt,
  resistanceSizes,
  wireResistance,
} from '@/lib/calculations/resistance';
import type { CircuitType, ResistanceMode } from '@/lib/calculations/resistance';

interface Inputs {
  mode: ResistanceMode;
  size: SizeKey;
  material: Material;
  /** Field text */
  lengthFt: string;
  /** Field text */
  tempF: string;
  /** Field text */
  amps: string;
  circuit: CircuitType;
  /** Field text */
  maxLoopOhms: string;
}

const DEFAULT_INPUTS: Inputs = {
  mode: RESISTANCE_DEFAULTS.mode,
  size: RESISTANCE_DEFAULTS.size,
  material: RESISTANCE_DEFAULTS.material,
  lengthFt: String(RESISTANCE_DEFAULTS.lengthFt),
  tempF: String(RESISTANCE_DEFAULTS.tempF),
  amps: String(RESISTANCE_DEFAULTS.amps),
  circuit: RESISTANCE_DEFAULTS.circuit,
  maxLoopOhms: String(RESISTANCE_DEFAULTS.maxLoopOhms),
};

const MATERIAL_OPTIONS: { value: Material; label: string }[] = [
  { value: 'Cu', label: 'Copper' },
  { value: 'Al', label: 'Aluminum' },
];

interface Row {
  label: string;
  value: string;
}

type FieldName = 'lengthFt' | 'tempF' | 'amps' | 'maxLoopOhms';

/** The fields each mode uses. */
function modeFields(mode: ResistanceMode): FieldName[] {
  if (mode === 'distance') return ['tempF', 'maxLoopOhms'];
  if (mode === 'power') return ['lengthFt', 'tempF', 'amps'];
  return ['lengthFt', 'tempF'];
}

/**
 * The mode's message for each invalid field of the current mode. A temperature that is not a number has no
 * message: the field is marked invalid and the result is left out.
 */
function fieldErrors(inputs: Inputs): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  const used = modeFields(inputs.mode);
  const message = RESISTANCE_INPUT_MESSAGES[inputs.mode];
  if (used.includes('lengthFt') && !(fieldNumber(inputs.lengthFt) > 0)) errors.lengthFt = message;
  if (used.includes('maxLoopOhms') && !(fieldNumber(inputs.maxLoopOhms) > 0)) errors.maxLoopOhms = message;
  if (used.includes('amps') && !(fieldNumber(inputs.amps) > 0)) errors.amps = message;
  if (!Number.isFinite(fieldNumber(inputs.tempF))) errors.tempF = '';
  return errors;
}

/** Inputs from a share link. */
function inputsFromQuery(params: URLSearchParams): Inputs {
  const material = choiceParam(params, 'material', ['Cu', 'Al'] as Material[]) ?? DEFAULT_INPUTS.material;
  return {
    mode: choiceParam(params, 'mode', RESISTANCE_MODE_OPTIONS.map((m) => m.value)) ?? DEFAULT_INPUTS.mode,
    material,
    size: choiceParam(params, 'wireSize', resistanceSizes(material)) ?? (material === 'Al' ? '12' : DEFAULT_INPUTS.size),
    lengthFt: numberParam(params, 'distance') ?? DEFAULT_INPUTS.lengthFt,
    tempF: numberParam(params, 'temperature') ?? DEFAULT_INPUTS.tempF,
    amps: numberParam(params, 'current') ?? DEFAULT_INPUTS.amps,
    circuit: choiceParam(params, 'circuitType', CIRCUIT_OPTIONS.map((c) => c.value)) ?? DEFAULT_INPUTS.circuit,
    maxLoopOhms: numberParam(params, 'maxResistance') ?? DEFAULT_INPUTS.maxLoopOhms,
  };
}

function sig(value: number): string {
  return value.toPrecision(4);
}

function celsius(tempF: number): string {
  return `${Number(fahrenheitToCelsius(tempF).toFixed(1))} °C`;
}

/** The result lines for the current mode (shown on screen and printed); valid inputs only. */
function computeRows(inputs: Inputs): Row[] {
  const tempC = fahrenheitToCelsius(fieldNumber(inputs.tempF));
  const lengthFt = fieldNumber(inputs.lengthFt);
  const perThousand = resistanceAt(inputs.size, inputs.material, tempC);
  if (perThousand === null) return [];
  const rows: Row[] = [{ label: 'Resistance per 1000 ft', value: `${sig(perThousand)} Ω` }];

  if (inputs.mode === 'distance') {
    const maxFt = maxLengthFt(inputs.size, inputs.material, tempC, fieldNumber(inputs.maxLoopOhms));
    if (maxFt !== null) rows.push({ label: 'Maximum distance (one way)', value: `${maxFt.toFixed(1)} ft` });
    return rows;
  }

  const wire = wireResistance(inputs.size, inputs.material, lengthFt, tempC);
  if (!wire) return rows;
  rows.push({ label: 'One conductor', value: `${sig(wire.conductorOhms)} Ω` });
  rows.push({ label: 'Loop (out and back)', value: `${sig(wire.loopOhms)} Ω` });

  if (inputs.mode === 'power') {
    rows.push({
      label: 'Power loss',
      value: `${sig(powerLossWatts(fieldNumber(inputs.amps), wire.ohmsPer1000ft, lengthFt, inputs.circuit))} W`,
    });
  }
  return rows;
}

/** Inputs each mode uses, with the labels shown on screen. */
function inputRows(inputs: Inputs): Row[] {
  const tempF = fieldNumber(inputs.tempF);
  const rows: Row[] = [
    { label: 'Calculation Mode', value: RESISTANCE_MODE_OPTIONS.find((m) => m.value === inputs.mode)?.label ?? '' },
    { label: 'Wire Size', value: formatSize(inputs.size) },
    { label: 'Wire Material', value: materialName(inputs.material) },
    { label: 'Temperature', value: `${tempF} °F (${celsius(tempF)})` },
  ];
  if (inputs.mode !== 'distance') rows.push({ label: 'Distance (one way)', value: `${fieldNumber(inputs.lengthFt)} ft` });
  if (inputs.mode === 'distance') rows.push({ label: 'Maximum loop resistance (out and back)', value: `${fieldNumber(inputs.maxLoopOhms)} Ω` });
  if (inputs.mode === 'power') {
    rows.push({ label: 'Current', value: `${fieldNumber(inputs.amps)} A` });
    rows.push({ label: 'Circuit Type', value: CIRCUIT_OPTIONS.find((c) => c.value === inputs.circuit)?.label ?? '' });
  }
  return rows;
}

export function WireResistanceCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const fields = useFieldErrors();

  const errors = fieldErrors(inputs);
  const valid = Object.keys(errors).length === 0;
  const rows = valid ? computeRows(inputs) : [];

  const query = buildQuery({
    mode: inputs.mode,
    wireSize: inputs.size,
    material: inputs.material,
    temperature: inputs.tempF.trim(),
    ...(inputs.mode !== 'distance' && { distance: inputs.lengthFt.trim() }),
    ...(inputs.mode === 'distance' && { maxResistance: inputs.maxLoopOhms.trim() }),
    ...(inputs.mode === 'power' && { current: inputs.amps.trim(), circuitType: inputs.circuit }),
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
    if (!valid) return;
    print({
      title: 'Wire Resistance Calculation',
      inputs: Object.fromEntries(inputRows(inputs).map((r) => [r.label, r.value])),
      results: Object.fromEntries(rows.map((r) => [r.label, r.value])),
      notes: RESISTANCE_NOTES,
    });
  };

  const sizeOptions = resistanceSizes(inputs.material).map((key) => ({ value: key, label: formatSize(key) }));
  const mode = RESISTANCE_MODE_OPTIONS.find((m) => m.value === inputs.mode) ?? RESISTANCE_MODE_OPTIONS[0];
  const tempF = fieldNumber(inputs.tempF);
  const tempValid = Number.isFinite(tempF);
  const tempC = fahrenheitToCelsius(tempF);
  const base = r20(inputs.size, inputs.material);
  const factor = 1 + alpha(inputs.material) * (tempC - 20);
  const diameter = diameterMm(inputs.size);
  const tempInvalidShown = errors.tempF !== undefined && fields.visible('tempF');

  return (
    <CalculatorLayout
      title="Wire Resistance Calculator"
      description="Calculate wire resistance and power loss for electrical conductors"
      shareUrl={shareUrl}
      onPrint={handlePrint}
      actionsDisabled={!valid}
    >
      <div className="space-y-6">
        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-800 mb-1">Wire Resistance Analysis</div>
            <div className="text-amber-700">
              Wire resistance calculations are critical for proper circuit design. High resistance causes
              voltage drop, power loss, and heating. Always consider temperature effects and use appropriate
              safety factors for critical applications.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6" ref={formRef}>
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              Wire Resistance Parameters
            </h2>

            <div className="space-y-4">
              <Select
                label="Calculation Mode"
                value={inputs.mode}
                onChange={(e) => update({ mode: e.target.value as ResistanceMode })}
                options={RESISTANCE_MODE_OPTIONS.map((m) => ({ value: m.value, label: m.label }))}
              />

              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <div className="font-medium mb-1">Calculation Method:</div>
                <div>{mode.description}</div>
              </div>

              <Select
                label="Wire Size"
                value={inputs.size}
                onChange={(e) => update({ size: e.target.value })}
                options={sizeOptions}
              />

              <Select
                label="Wire Material"
                value={inputs.material}
                onChange={(e) => {
                  const material = e.target.value as Material;
                  // awg.json has no aluminum value for 14 AWG
                  update({ material, size: resistanceSizes(material).includes(inputs.size) ? inputs.size : '12' });
                }}
                options={MATERIAL_OPTIONS}
              />

              {inputs.mode !== 'distance' && (
                <Input
                  label="Distance (one way)"
                  type="number"
                  value={inputs.lengthFt}
                  onChange={(e) => update({ lengthFt: e.target.value })}
                  onBlur={() => fields.touch('lengthFt')}
                  error={fields.shown('lengthFt', errors.lengthFt)}
                  suffix="feet"
                  min={1}
                  max={5000}
                />
              )}

              <div>
                <Input
                  label="Temperature"
                  type="number"
                  value={inputs.tempF}
                  onChange={(e) => update({ tempF: e.target.value })}
                  onBlur={() => fields.touch('tempF')}
                  aria-invalid={tempInvalidShown || undefined}
                  suffix="°F"
                  min={-40}
                  max={200}
                  hint={tempValid ? celsius(tempF) : undefined}
                />
              </div>

              {inputs.mode === 'distance' && (
                <Input
                  label="Maximum loop resistance (out and back)"
                  type="number"
                  value={inputs.maxLoopOhms}
                  onChange={(e) => update({ maxLoopOhms: e.target.value })}
                  onBlur={() => fields.touch('maxLoopOhms')}
                  error={fields.shown('maxLoopOhms', errors.maxLoopOhms)}
                  suffix="ohms"
                  min={0.001}
                  step={0.001}
                />
              )}

              {inputs.mode === 'power' && (
                <>
                  <Input
                    label="Current"
                    type="number"
                    value={inputs.amps}
                    onChange={(e) => update({ amps: e.target.value })}
                    onBlur={() => fields.touch('amps')}
                    error={fields.shown('amps', errors.amps)}
                    suffix="amps"
                    min={0.1}
                    step={0.1}
                  />
                  <Select
                    label="Circuit Type"
                    value={inputs.circuit}
                    onChange={(e) => update({ circuit: e.target.value as CircuitType })}
                    options={CIRCUIT_OPTIONS}
                  />
                </>
              )}

              {/* Wire Data */}
              {base !== null && (
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="font-medium text-neutral-900 mb-3 flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    Selected Wire Properties
                  </div>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <div>• Wire Size: {formatSize(inputs.size)}</div>
                    {diameter !== null && <div>• Diameter: {Number(diameter.toFixed(3))} mm</div>}
                    <div>• Resistance at 20 °C: {base} Ω/1000 ft</div>
                    {tempValid && <div>• Temperature Factor: {factor.toFixed(4)}</div>}
                    {tempValid && (
                      <div>• Resistance at {tempF} °F ({celsius(tempF)}): {sig(base * factor)} Ω/1000 ft</div>
                    )}
                  </div>
                </div>
              )}

              {/* Calculation Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Calculation Notes:</div>
                  <ul className="space-y-1 text-xs">
                    {RESISTANCE_NOTES.map((note) => (
                      <li key={note}>• {note}</li>
                    ))}
                  </ul>
                </div>
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
              Calculation Results
            </h2>

            {valid && rows.length > 0 && (
              <div className="space-y-6">
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 text-center mb-4">
                      {mode.label}
                    </h3>
                    <dl className="space-y-2 text-sm">
                      {rows.map((row) => (
                        <div key={row.label} className="flex justify-between gap-4">
                          <dt>{row.label}:</dt>
                          <dd className="font-mono font-semibold">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 pt-4 border-t border-neutral-200 space-y-1 text-xs text-neutral-600">
                      {inputRows(inputs).map((row) => (
                        <div key={row.label} className="flex justify-between gap-4">
                          <span>{row.label}:</span>
                          <span>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            )}

            {/* Temperature Effects Information */}
            {tempValid && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <Thermometer className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-amber-800 mb-1">Temperature Effects</div>
                <div className="text-amber-700">
                  Wire resistance increases with temperature. At {tempF} °F ({celsius(tempF)}), the
                  resistance factor is {factor.toFixed(4)} compared to the 20 °C (68 °F) reference.
                  High temperatures reduce current-carrying capacity and increase power losses.
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
