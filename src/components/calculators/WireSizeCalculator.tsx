'use client';

import { useRef, useState } from 'react';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { CalculatorResult } from './CalculatorResult';
import { WireComparison } from '@/components/visualizations/WireComparison';
import {
  BASIS_LINES,
  EGC_LARGER_THAN_CONDUCTOR_NOTE,
  EGC_NONE_MESSAGE,
  EGC_UPSIZED_NOTE,
  ENGINE_ID,
  isSizingError,
  sizeConductor,
  SIZING_ERROR_MESSAGES,
  WIRE_SIZE_DEFAULTS,
  WIRE_SIZE_RATINGS,
} from '@/lib/calculations/conductor-sizing';
import type { SizeConductorResult } from '@/lib/calculations/conductor-sizing';
import { formatSize } from '@/lib/verified/awg';
import type { Material } from '@/lib/verified/awg';
import { voltageOptions, voltsAfterPhaseChange } from '@/lib/calculations/inputs';
import type { Phase } from '@/lib/calculations/inputs';
import { LENGTH_MAX_FT, LENGTH_MIN_FT, targetTitle, VD_TARGET_OPTIONS } from '@/lib/calculations/voltage-drop';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { formatEntered, formatFixed } from '@/lib/calculations/format';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { RefreshCw, Calculator } from 'lucide-react';

const PHASE_OPTIONS = [
  { value: 'single', label: 'Single-Phase' },
  { value: 'three', label: 'Three-Phase' },
];

const RATING_OPTIONS = WIRE_SIZE_RATINGS.map((a) => ({ value: String(a), label: `${a} A` }));
const TARGET_OPTIONS = VD_TARGET_OPTIONS.map((pct) => ({ value: String(pct), label: `${pct} %` }));

const MATERIALS: { material: Material; key: 'copper' | 'aluminum'; label: string }[] = [
  { material: 'Cu', key: 'copper', label: 'Copper' },
  { material: 'Al', key: 'aluminum', label: 'Aluminum' },
];

const GROUND_WIRE_LABELS = {
  copper: 'Ground wire (copper)',
  aluminum: 'Ground wire (aluminum or copper-clad aluminum)',
};

interface Inputs {
  ocpdA: number;
  /** Field text; empty = use the rating */
  loadA: string;
  /** Field text */
  lengthFt: string;
  volts: number;
  phase: Phase;
  vdTargetPct: number;
}

const DEFAULT_INPUTS: Inputs = {
  ocpdA: WIRE_SIZE_DEFAULTS.ocpdA,
  loadA: '',
  lengthFt: String(WIRE_SIZE_DEFAULTS.lengthFt),
  volts: WIRE_SIZE_DEFAULTS.volts,
  phase: WIRE_SIZE_DEFAULTS.phase,
  vdTargetPct: WIRE_SIZE_DEFAULTS.vdTargetPct,
};

/** Inputs from a share link: rating, load, length, voltage, phase and target; old links carried amps and distance. */
function inputsFromQuery(params: URLSearchParams): Inputs {
  const next: Inputs = { ...DEFAULT_INPUTS };
  // the old amps value counts as the rating only when it is a standard rating from 15 to 400 A
  next.ocpdA = choiceParam(params, 'rating', WIRE_SIZE_RATINGS) ?? choiceParam(params, 'amps', WIRE_SIZE_RATINGS) ?? next.ocpdA;
  const load = numberParam(params, 'load');
  if (load !== null && Number(load) >= 0 && Number(load) <= next.ocpdA) next.loadA = load;
  const length = numberParam(params, 'length', 'distance');
  if (length !== null && Number(length) >= LENGTH_MIN_FT && Number(length) <= LENGTH_MAX_FT) next.lengthFt = length;
  next.phase = choiceParam(params, 'phase', ['single', 'three'] as Phase[]) ?? next.phase;
  next.volts = choiceParam(params, 'voltage', voltageOptions(next.phase)) ?? voltsAfterPhaseChange(next.volts, next.phase);
  next.vdTargetPct = choiceParam(params, 'target', VD_TARGET_OPTIONS) ?? next.vdTargetPct;
  return next;
}

/** The message for each invalid field. */
function fieldErrors(inputs: Inputs): { loadA: string | null; lengthFt: string | null } {
  const load = fieldNumber(inputs.loadA);
  const length = fieldNumber(inputs.lengthFt);
  return {
    loadA: inputs.loadA.trim() === '' || (load >= 0 && load <= inputs.ocpdA) ? null : SIZING_ERROR_MESSAGES['load-above-rating'],
    lengthFt: length >= LENGTH_MIN_FT && length <= LENGTH_MAX_FT ? null : SIZING_ERROR_MESSAGES['length-out-of-range'],
  };
}

function materialNotes(result: SizeConductorResult): string[] {
  const notes: string[] = [];
  if (result.egcUpsized) notes.push(EGC_UPSIZED_NOTE);
  if (result.egcLargerThanConductor) notes.push(EGC_LARGER_THAN_CONDUCTOR_NOTE);
  return notes;
}

interface Outcome {
  error: string | null;
  results: { material: Material; key: 'copper' | 'aluminum'; label: string; result: SizeConductorResult }[];
}

function calculate(inputs: Inputs): Outcome {
  const results: Outcome['results'] = [];
  for (const m of MATERIALS) {
    const result = sizeConductor({
      ocpdA: inputs.ocpdA,
      loadA: inputs.loadA.trim() === '' ? null : fieldNumber(inputs.loadA),
      lengthFt: fieldNumber(inputs.lengthFt),
      volts: inputs.volts,
      phase: inputs.phase,
      material: m.material,
      vdTargetPct: inputs.vdTargetPct,
    });
    if (isSizingError(result)) return { error: SIZING_ERROR_MESSAGES[result.error], results: [] };
    results.push({ ...m, result });
  }
  return { error: null, results };
}

interface WireSizeCalculatorProps {
  enableUrlSharing?: boolean;
}

export function WireSizeCalculator({ enableUrlSharing = true }: WireSizeCalculatorProps) {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const fields = useFieldErrors();

  const errors = fieldErrors(inputs);
  const invalid = errors.loadA !== null || errors.lengthFt !== null;
  const outcome = invalid ? null : calculate(inputs);
  const valid = outcome !== null && outcome.error === null;

  const query = buildQuery({
    rating: inputs.ocpdA,
    load: inputs.loadA.trim(),
    length: inputs.lengthFt.trim(),
    voltage: inputs.volts,
    phase: inputs.phase,
    target: inputs.vdTargetPct,
  });
  const { markChanged, shareUrl } = useUrlState(query, (params) => {
    if (enableUrlSharing) setInputs(inputsFromQuery(params));
  });
  const { print } = usePrintExport();

  const change = (patch: Partial<Inputs>) => {
    if (enableUrlSharing) markChanged();
    setInputs((prev) => ({ ...prev, ...patch }));
  };

  const handleCalculate = () => {
    if (valid) focusResults(resultsHeadingRef.current);
    else fields.revealAll(formRef.current);
  };

  const handlePrint = () => {
    if (!valid || !outcome) return;
    const results: Record<string, string> = {};
    const notes: string[] = [];
    for (const { key, label, result } of outcome.results) {
      results[label] = `${formatSize(result.size)} (${targetTitle(result.meetsTarget)})`;
      results[`${label} 60 °C ampacity`] = `${formatEntered(result.ampacity60)} A`;
      results[`${label} voltage drop`] = `${formatFixed(result.vdPct, 2)} % (${formatFixed(result.vdVolts, 2)} V)`;
      results[GROUND_WIRE_LABELS[key]] = result.egc ? formatSize(result.egc) : EGC_NONE_MESSAGE;
      notes.push(...materialNotes(result).map((note) => `${label}: ${note}`));
      notes.push(...result.steps.map((step, i) => `${label}, step ${i + 1}: ${step}`));
    }
    notes.push(...BASIS_LINES);
    print({
      title: 'Wire Size Calculation',
      inputs: {
        'Breaker or fuse rating': `${formatEntered(inputs.ocpdA)} A`,
        'Load current for voltage drop (A)': `${formatEntered(inputs.loadA.trim() === '' ? inputs.ocpdA : fieldNumber(inputs.loadA))} A`,
        'Length (one-way)': `${formatEntered(fieldNumber(inputs.lengthFt))} ft`,
        Voltage: `${formatEntered(inputs.volts)} V`,
        Phase: inputs.phase === 'three' ? 'Three-Phase' : 'Single-Phase',
        'Voltage-drop target (your choice)': `${inputs.vdTargetPct} %`,
      },
      results,
      notes,
    });
  };

  const handleReset = () => {
    if (enableUrlSharing) markChanged();
    fields.reset();
    setInputs(DEFAULT_INPUTS);
  };

  const voltageSelectOptions = voltageOptions(inputs.phase).map((v) => ({ value: String(v), label: `${v} V` }));

  return (
    <CalculatorLayout
      title="Wire Size Calculator"
      description="Calculate the correct AWG wire size for both copper and aluminum conductors"
      shareUrl={enableUrlSharing ? shareUrl : undefined}
      onPrint={handlePrint}
      actionsDisabled={!valid}
    >
      <div className="max-w-full px-4 sm:px-6 lg:max-w-4xl lg:mx-auto lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6" ref={formRef}>
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            <Select
              label="Breaker or fuse rating"
              options={RATING_OPTIONS}
              value={String(inputs.ocpdA)}
              onChange={(e) => change({ ocpdA: Number(e.target.value) })}
            />

            <Input
              label="Load current for voltage drop (A)"
              type="number"
              value={inputs.loadA}
              placeholder={String(inputs.ocpdA)}
              onChange={(e) => change({ loadA: e.target.value })}
              onBlur={() => fields.touch('loadA')}
              error={fields.shown('loadA', errors.loadA)}
              min={0}
              max={inputs.ocpdA}
              step="any"
              suffix="A"
            />

            <Input
              label="Length (one-way)"
              type="number"
              value={inputs.lengthFt}
              onChange={(e) => change({ lengthFt: e.target.value })}
              onBlur={() => fields.touch('lengthFt')}
              error={fields.shown('lengthFt', errors.lengthFt)}
              min={LENGTH_MIN_FT}
              max={LENGTH_MAX_FT}
              step={1}
              suffix="ft"
            />

            <Select
              label="Voltage"
              options={voltageSelectOptions}
              value={String(inputs.volts)}
              onChange={(e) => change({ volts: Number(e.target.value) })}
            />

            <Select
              label="Phase"
              options={PHASE_OPTIONS}
              value={inputs.phase}
              onChange={(e) => {
                const phase = e.target.value as Phase;
                change({ phase, volts: voltsAfterPhaseChange(inputs.volts, phase) });
              }}
            />

            <Select
              label="Voltage-drop target (your choice)"
              options={TARGET_OPTIONS}
              value={String(inputs.vdTargetPct)}
              onChange={(e) => change({ vdTargetPct: Number(e.target.value) })}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <Button onClick={handleCalculate} className="flex-1">
              <Calculator className="w-4 h-4" />
              Calculate Wire Size
            </Button>
            <Button variant="secondary" onClick={handleReset} className="flex-1">
              <RefreshCw className="w-4 h-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h2 ref={resultsHeadingRef} tabIndex={-1} className="text-lg font-semibold">Calculation Results</h2>

          {outcome && (
            outcome.error ? (
              <div className="rounded-xl p-6 bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
                {outcome.error}
              </div>
            ) : (
              <>
                {/* Wire Comparison Visualization */}
                <WireComparison
                  copperAwg={outcome.results[0].result.size}
                  aluminumAwg={outcome.results[1].result.size}
                  amps={inputs.ocpdA}
                />

                {/* Results Display for Both Materials */}
                <div className="grid lg:grid-cols-2 gap-4">
                  {outcome.results.map(({ key, label, result }) => (
                    <div key={key}>
                      <h3
                        className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                          key === 'copper' ? 'text-copper-600' : 'text-aluminum-600'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full bg-gradient-to-br ${
                            key === 'copper' ? 'from-copper-400 to-copper-600' : 'from-aluminum-300 to-aluminum-500'
                          }`}
                        ></div>
                        {label} Wire
                      </h3>
                      <CalculatorResult
                        awg={result.size}
                        ampacity={result.ampacity60}
                        ampacityLabel="60 °C ampacity"
                        voltageDropPercent={result.vdPct}
                        voltageDropVolts={result.vdVolts}
                        groundWire={result.egc ?? ''}
                        groundWireMessage={result.egc ? undefined : EGC_NONE_MESSAGE}
                        material={key}
                        isCompliant={result.meetsTarget}
                        meetsTarget={result.meetsTarget}
                        warnings={materialNotes(result)}
                        stepParts={result.stepParts}
                        valueSrc={`calc:${ENGINE_ID}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm text-neutral-600">
                  {BASIS_LINES.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
