'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  isSizingError,
  sizeConductor,
  SIZING_ERROR_MESSAGES,
  WIRE_SIZE_DEFAULTS,
  WIRE_SIZE_RATINGS,
} from '@/lib/calculations/conductor-sizing';
import type { SizeConductorResult } from '@/lib/calculations/conductor-sizing';
import { formatSize } from '@/lib/calculations/sizes';
import type { Material } from '@/lib/calculations/sizes';
import { voltageOptions, voltsAfterPhaseChange } from '@/lib/calculations/inputs';
import type { Phase } from '@/lib/calculations/inputs';
import { LENGTH_MAX_FT, LENGTH_MIN_FT, targetTitle, VD_TARGET_OPTIONS } from '@/lib/calculations/voltage-drop';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
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
  /** '' = use the rating */
  loadA: number | '';
  lengthFt: number | '';
  volts: number;
  phase: Phase;
  vdTargetPct: number;
}

const DEFAULT_INPUTS: Inputs = {
  ocpdA: WIRE_SIZE_DEFAULTS.ocpdA,
  loadA: '',
  lengthFt: WIRE_SIZE_DEFAULTS.lengthFt,
  volts: WIRE_SIZE_DEFAULTS.volts,
  phase: WIRE_SIZE_DEFAULTS.phase,
  vdTargetPct: WIRE_SIZE_DEFAULTS.vdTargetPct,
};

/** Inputs from a share link: rating, load, length, voltage, phase and target; old links carried amps and distance. */
function inputsFromQuery(query: string): Inputs | null {
  const params = new URLSearchParams(query);
  if ([...params.keys()].length === 0) return null;
  const num = (key: string): number | null => {
    const raw = params.get(key);
    if (raw === null || raw.trim() === '') return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  };
  const next: Inputs = { ...DEFAULT_INPUTS };
  // the old amps value counts as the rating only when it is a standard rating from 15 to 400 A
  const rating = num('rating') ?? num('amps');
  if (rating !== null && WIRE_SIZE_RATINGS.includes(rating)) next.ocpdA = rating;
  const load = num('load');
  if (load !== null && load >= 0 && load <= next.ocpdA) next.loadA = load;
  const length = num('length') ?? num('distance');
  if (length !== null && length >= LENGTH_MIN_FT && length <= LENGTH_MAX_FT) next.lengthFt = length;
  const phase = params.get('phase');
  if (phase === 'single' || phase === 'three') next.phase = phase;
  const volts = num('voltage');
  next.volts = volts !== null && voltageOptions(next.phase).includes(volts) ? volts : voltsAfterPhaseChange(next.volts, next.phase);
  const target = num('target');
  if (target !== null && VD_TARGET_OPTIONS.includes(target)) next.vdTargetPct = target;
  return next;
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
      loadA: inputs.loadA === '' ? null : inputs.loadA,
      lengthFt: inputs.lengthFt === '' ? Number.NaN : inputs.lengthFt,
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
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [calculatedFor, setCalculatedFor] = useState<Inputs | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Read a share link once on load
  useEffect(() => {
    if (!enableUrlSharing) return;
    const fromQuery = inputsFromQuery(window.location.search);
    if (fromQuery) setInputs(fromQuery);
  }, [enableUrlSharing]);

  const shareableInputs = {
    rating: inputs.ocpdA,
    load: inputs.loadA,
    length: inputs.lengthFt,
    voltage: inputs.volts,
    phase: inputs.phase,
    target: inputs.vdTargetPct,
  };
  const { getShareableUrl } = useShareableUrl(shareableInputs, { enabled: enableUrlSharing });
  const { print } = usePrintExport();

  const performCalculation = useCallback(() => {
    setOutcome(calculate(inputs));
    setCalculatedFor(inputs);

    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, [inputs]);

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!outcome || !calculatedFor || outcome.error) return;
    const results: Record<string, string> = {};
    const notes: string[] = [];
    for (const { key, label, result } of outcome.results) {
      results[label] = `${formatSize(result.size)} (${targetTitle(result.meetsTarget)})`;
      results[`${label} 60 °C ampacity`] = `${result.ampacity60} A`;
      results[`${label} voltage drop`] = `${result.vdPct.toFixed(2)} % (${result.vdVolts.toFixed(2)} V)`;
      results[GROUND_WIRE_LABELS[key]] = result.egc ? formatSize(result.egc) : EGC_NONE_MESSAGE;
      notes.push(...materialNotes(result).map((note) => `${label}: ${note}`));
      notes.push(...result.steps.map((step, i) => `${label}, step ${i + 1}: ${step}`));
    }
    notes.push(...BASIS_LINES);
    print({
      title: 'Wire Size Calculation',
      inputs: {
        'Breaker or fuse rating': `${calculatedFor.ocpdA} A`,
        'Load current for voltage drop (A)': `${calculatedFor.loadA === '' ? calculatedFor.ocpdA : calculatedFor.loadA} A`,
        'Length (one-way)': `${calculatedFor.lengthFt} ft`,
        Voltage: `${calculatedFor.volts} V`,
        Phase: calculatedFor.phase === 'three' ? 'Three-Phase' : 'Single-Phase',
        'Voltage-drop target (your choice)': `${calculatedFor.vdTargetPct} %`,
      },
      results,
      notes,
    });
  }, [outcome, calculatedFor, print]);

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setOutcome(null);
    setCalculatedFor(null);
  };

  const voltageSelectOptions = voltageOptions(inputs.phase).map((v) => ({ value: String(v), label: `${v} V` }));

  return (
    <CalculatorLayout
      title="Wire Size Calculator"
      description="Calculate the correct AWG wire size for both copper and aluminum conductors"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="max-w-full px-4 sm:px-6 lg:max-w-4xl lg:mx-auto lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            <Select
              label="Breaker or fuse rating"
              options={RATING_OPTIONS}
              value={String(inputs.ocpdA)}
              onChange={(e) => setInputs((prev) => ({ ...prev, ocpdA: Number(e.target.value) }))}
            />

            <Input
              label="Load current for voltage drop (A)"
              type="number"
              value={inputs.loadA}
              placeholder={String(inputs.ocpdA)}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, loadA: e.target.value === '' ? '' : Number(e.target.value) }))
              }
              min={0}
              max={inputs.ocpdA}
              step="any"
              suffix="A"
            />

            <Input
              label="Length (one-way)"
              type="number"
              value={inputs.lengthFt}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, lengthFt: e.target.value === '' ? '' : Number(e.target.value) }))
              }
              min={LENGTH_MIN_FT}
              max={LENGTH_MAX_FT}
              step={1}
              suffix="ft"
            />

            <Select
              label="Voltage"
              options={voltageSelectOptions}
              value={String(inputs.volts)}
              onChange={(e) => setInputs((prev) => ({ ...prev, volts: Number(e.target.value) }))}
            />

            <Select
              label="Phase"
              options={PHASE_OPTIONS}
              value={inputs.phase}
              onChange={(e) => {
                const phase = e.target.value as Phase;
                setInputs((prev) => ({ ...prev, phase, volts: voltsAfterPhaseChange(prev.volts, phase) }));
              }}
            />

            <Select
              label="Voltage-drop target (your choice)"
              options={TARGET_OPTIONS}
              value={String(inputs.vdTargetPct)}
              onChange={(e) => setInputs((prev) => ({ ...prev, vdTargetPct: Number(e.target.value) }))}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <Button onClick={performCalculation} className="flex-1">
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
        {outcome && calculatedFor && (
          <div className="space-y-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold">Calculation Results</h2>

            {outcome.error ? (
              <div className="rounded-xl p-6 bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
                {outcome.error}
              </div>
            ) : (
              <>
                {/* Wire Comparison Visualization */}
                <WireComparison
                  copperAwg={outcome.results[0].result.size}
                  aluminumAwg={outcome.results[1].result.size}
                  amps={calculatedFor.ocpdA}
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
                        steps={result.steps}
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
            )}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
