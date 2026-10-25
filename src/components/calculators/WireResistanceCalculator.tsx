'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
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
  RESISTANCE_INPUT_INVALID_MESSAGE,
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
  lengthFt: number;
  tempF: number;
  amps: number;
  circuit: CircuitType;
  maxLoopOhms: number;
}

const DEFAULT_INPUTS: Inputs = { ...RESISTANCE_DEFAULTS };

interface Row {
  label: string;
  value: string;
}

function sig(value: number): string {
  return value.toPrecision(4);
}

function celsius(tempF: number): string {
  return `${Number(fahrenheitToCelsius(tempF).toFixed(1))} °C`;
}

/** The result lines for the current mode (shown on screen and printed), or an error message. */
function computeRows(inputs: Inputs): { rows: Row[]; error: string | null } {
  const tempC = fahrenheitToCelsius(inputs.tempF);
  const perThousand = resistanceAt(inputs.size, inputs.material, tempC);
  if (perThousand === null || !Number.isFinite(tempC)) return { rows: [], error: RESISTANCE_INPUT_INVALID_MESSAGE };
  const rows: Row[] = [{ label: 'Resistance per 1000 ft', value: `${sig(perThousand)} Ω` }];

  if (inputs.mode === 'distance') {
    const maxFt = maxLengthFt(inputs.size, inputs.material, tempC, inputs.maxLoopOhms);
    if (maxFt === null) return { rows: [], error: RESISTANCE_INPUT_INVALID_MESSAGE };
    rows.push({ label: 'Maximum distance (one way)', value: `${maxFt.toFixed(1)} ft` });
    return { rows, error: null };
  }

  if (!(inputs.lengthFt > 0)) return { rows: [], error: RESISTANCE_INPUT_INVALID_MESSAGE };
  const wire = wireResistance(inputs.size, inputs.material, inputs.lengthFt, tempC);
  if (!wire) return { rows: [], error: RESISTANCE_INPUT_INVALID_MESSAGE };
  rows.push({ label: 'One conductor', value: `${sig(wire.conductorOhms)} Ω` });
  rows.push({ label: 'Loop (out and back)', value: `${sig(wire.loopOhms)} Ω` });

  if (inputs.mode === 'power') {
    if (!(inputs.amps > 0)) return { rows: [], error: RESISTANCE_INPUT_INVALID_MESSAGE };
    rows.push({
      label: 'Power loss',
      value: `${sig(powerLossWatts(inputs.amps, wire.ohmsPer1000ft, inputs.lengthFt, inputs.circuit))} W`,
    });
  }
  return { rows, error: null };
}

/** Inputs each mode uses, with the labels shown on screen. */
function inputRows(inputs: Inputs): Row[] {
  const rows: Row[] = [
    { label: 'Calculation Mode', value: RESISTANCE_MODE_OPTIONS.find((m) => m.value === inputs.mode)?.label ?? '' },
    { label: 'Wire Size', value: formatSize(inputs.size) },
    { label: 'Wire Material', value: materialName(inputs.material) },
    { label: 'Temperature', value: `${inputs.tempF} °F (${celsius(inputs.tempF)})` },
  ];
  if (inputs.mode !== 'distance') rows.push({ label: 'Distance (one way)', value: `${inputs.lengthFt} ft` });
  if (inputs.mode === 'distance') rows.push({ label: 'Maximum loop resistance (out and back)', value: `${inputs.maxLoopOhms} Ω` });
  if (inputs.mode === 'power') {
    rows.push({ label: 'Current', value: `${inputs.amps} A` });
    rows.push({ label: 'Circuit Type', value: CIRCUIT_OPTIONS.find((c) => c.value === inputs.circuit)?.label ?? '' });
  }
  return rows;
}

export function WireResistanceCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [calculated, setCalculated] = useState<{ inputs: Inputs; rows: Row[]; error: string | null } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const update = (patch: Partial<Inputs>) => setInputs((prev) => ({ ...prev, ...patch }));

  const performCalculation = useCallback(() => {
    setCalculated({ inputs, ...computeRows(inputs) });
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [inputs]);

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setCalculated(null);
  };

  const shareableInputs: Record<string, string | number> = {
    mode: inputs.mode,
    wireSize: inputs.size,
    material: inputs.material,
    temperature: inputs.tempF,
    ...(inputs.mode !== 'distance' && { distance: inputs.lengthFt }),
    ...(inputs.mode === 'distance' && { maxResistance: inputs.maxLoopOhms }),
    ...(inputs.mode === 'power' && { current: inputs.amps, circuitType: inputs.circuit }),
  };
  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!calculated || calculated.error) return;
    print({
      title: 'Wire Resistance Calculation',
      inputs: Object.fromEntries(inputRows(calculated.inputs).map((r) => [r.label, r.value])),
      results: Object.fromEntries(calculated.rows.map((r) => [r.label, r.value])),
      notes: RESISTANCE_NOTES,
    });
  }, [calculated, print]);

  const sizeOptions = resistanceSizes(inputs.material).map((key) => ({ value: key, label: formatSize(key) }));
  const mode = RESISTANCE_MODE_OPTIONS.find((m) => m.value === inputs.mode) ?? RESISTANCE_MODE_OPTIONS[0];
  const tempC = fahrenheitToCelsius(inputs.tempF);
  const base = r20(inputs.size, inputs.material);
  const factor = 1 + alpha(inputs.material) * (tempC - 20);
  const diameter = diameterMm(inputs.size);

  return (
    <CalculatorLayout
      title="Wire Resistance Calculator"
      description="Calculate wire resistance and power loss for electrical conductors"
      onShare={handleShare}
      onPrint={handlePrint}
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
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              Wire Resistance Parameters
            </h2>

            <div className="space-y-4">
              <Select
                label="Calculation Mode"
                value={inputs.mode}
                onChange={(e) => {
                  update({ mode: e.target.value as ResistanceMode });
                  setCalculated(null);
                }}
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
                options={[
                  { value: 'Cu', label: 'Copper' },
                  { value: 'Al', label: 'Aluminum' },
                ]}
              />

              {inputs.mode !== 'distance' && (
                <Input
                  label="Distance (one way)"
                  type="number"
                  value={inputs.lengthFt}
                  onChange={(e) => update({ lengthFt: Number(e.target.value) })}
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
                  onChange={(e) => update({ tempF: Number(e.target.value) })}
                  suffix="°F"
                  min={-40}
                  max={200}
                  hint={celsius(inputs.tempF)}
                />
              </div>

              {inputs.mode === 'distance' && (
                <Input
                  label="Maximum loop resistance (out and back)"
                  type="number"
                  value={inputs.maxLoopOhms}
                  onChange={(e) => update({ maxLoopOhms: Number(e.target.value) })}
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
                    onChange={(e) => update({ amps: Number(e.target.value) })}
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
                    <div>• Temperature Factor: {factor.toFixed(4)}</div>
                    <div>• Resistance at {inputs.tempF} °F ({celsius(inputs.tempF)}): {sig(base * factor)} Ω/1000 ft</div>
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
              Calculation Results
            </h2>

            {calculated && (
              <div className="space-y-6">
                {calculated.error ? (
                  <div className="rounded-xl p-6 bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
                    {calculated.error}
                  </div>
                ) : (
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 text-center mb-4">
                      {RESISTANCE_MODE_OPTIONS.find((m) => m.value === calculated.inputs.mode)?.label}
                    </h3>
                    <dl className="space-y-2 text-sm">
                      {calculated.rows.map((row) => (
                        <div key={row.label} className="flex justify-between gap-4">
                          <dt>{row.label}:</dt>
                          <dd className="font-mono font-semibold">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 pt-4 border-t border-neutral-200 space-y-1 text-xs text-neutral-600">
                      {inputRows(calculated.inputs).map((row) => (
                        <div key={row.label} className="flex justify-between gap-4">
                          <span>{row.label}:</span>
                          <span>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Temperature Effects Information */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <Thermometer className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-amber-800 mb-1">Temperature Effects</div>
                <div className="text-amber-700">
                  Wire resistance increases with temperature. At {inputs.tempF} °F ({celsius(inputs.tempF)}), the
                  resistance factor is {factor.toFixed(4)} compared to the 20 °C (68 °F) reference.
                  High temperatures reduce current-carrying capacity and increase power losses.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
