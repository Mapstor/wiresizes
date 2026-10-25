'use client';

import { useState, useCallback, useRef } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import {
  ADJUSTMENT_BANDS,
  AMBIENT_ROWS,
  ambientLabel,
  AMPACITY_DEFAULTS,
  AMPACITY_NEC_REFERENCES,
  AMPACITY_SIZES,
  bandLabel,
  calculateAmpacity,
  COLUMN_OPTIONS,
  NOT_PERMITTED_MESSAGE,
} from '@/lib/calculations/ampacity';
import type { AmpacityInput, AmpacityResult } from '@/lib/calculations/ampacity';
import { formatSize } from '@/lib/calculations/sizes';
import type { AmpacityColumn, Material } from '@/lib/calculations/sizes';

const SIZE_OPTIONS = AMPACITY_SIZES.map((key) => ({ value: key, label: formatSize(key) }));
const TEMPERATURE_OPTIONS = COLUMN_OPTIONS.map((c) => ({ value: String(c.value), label: c.label }));
const AMBIENT_OPTIONS = AMBIENT_ROWS.map((row) => ({ value: row.key, label: ambientLabel(row) }));
const BAND_OPTIONS = ADJUSTMENT_BANDS.map((band) => ({ value: band.key, label: bandLabel(band) }));

const MATERIALS: { material: Material; key: 'copper' | 'aluminum'; label: string }[] = [
  { material: 'Cu', key: 'copper', label: 'Copper Conductor' },
  { material: 'Al', key: 'aluminum', label: 'Aluminum Conductor' },
];

function amps(value: number): string {
  return `${Number(value.toFixed(2))} A`;
}

interface Row {
  label: string;
  value: string;
}

/** The lines the result panel shows for one material, also used for print. */
function resultRows(result: AmpacityResult, column: AmpacityColumn): Row[] {
  const rows: Row[] = [
    { label: `NEC Table 310.16, ${column} °C column`, value: amps(result.tableAmpacity as number) },
    {
      label: 'Ambient correction, Table 310.15(B)(1)(1)',
      value: result.correctionFactor === null ? '–' : String(result.correctionFactor),
    },
    { label: 'Adjustment, Table 310.15(C)(1)', value: `${result.adjustmentPercent} %` },
    { label: 'Ampacity', value: result.ampacity === null ? NOT_PERMITTED_MESSAGE : amps(result.ampacity) },
  ];
  if (result.ocpdLimit) rows.push({ label: 'NEC 240.4(D)', value: result.ocpdLimit });
  return rows;
}

export function AmpacityCalculator() {
  const [inputs, setInputs] = useState<AmpacityInput>(AMPACITY_DEFAULTS);
  const [calculated, setCalculated] = useState<{
    inputs: AmpacityInput;
    results: { key: 'copper' | 'aluminum'; label: string; result: AmpacityResult }[];
  } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const shareableInputs = {
    awg: inputs.size,
    temperature: inputs.column,
    ambient: inputs.ambientRow,
    conductors: inputs.band,
  };
  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const performCalculation = useCallback(() => {
    const results = MATERIALS.flatMap((m) => {
      const result = calculateAmpacity({ ...inputs, material: m.material });
      // no Table 310.16 value for this size and material (14 AWG aluminum)
      return result.tableAmpacity === null ? [] : [{ key: m.key, label: m.label, result }];
    });
    setCalculated({ inputs, results });
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [inputs]);

  const handleReset = useCallback(() => {
    setInputs(AMPACITY_DEFAULTS);
    setCalculated(null);
  }, []);

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!calculated) return;
    const shown = calculated.inputs;
    const results: Record<string, string> = {};
    for (const { label, result } of calculated.results) {
      for (const row of resultRows(result, shown.column)) results[`${label}: ${row.label}`] = row.value;
    }
    print({
      title: 'Wire Ampacity Calculation',
      inputs: {
        'Wire Size': formatSize(shown.size),
        'Temperature Rating': COLUMN_OPTIONS.find((c) => c.value === shown.column)?.label ?? '',
        'Ambient Temperature': AMBIENT_OPTIONS.find((o) => o.value === shown.ambientRow)?.label ?? '',
        'Number of Current-Carrying Conductors': BAND_OPTIONS.find((o) => o.value === shown.band)?.label ?? '',
      },
      results,
      notes: [`NEC References: ${AMPACITY_NEC_REFERENCES}`],
    });
  }, [calculated, print]);

  return (
    <CalculatorLayout
      title="Wire Ampacity Calculator"
      description="Calculate the current carrying capacity for copper and aluminum conductors"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Input Parameters */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Wire Size"
              options={SIZE_OPTIONS}
              value={inputs.size}
              onChange={(e) => setInputs((p) => ({ ...p, size: e.target.value }))}
            />

            <Select
              label="Temperature Rating"
              options={TEMPERATURE_OPTIONS}
              value={String(inputs.column)}
              onChange={(e) => setInputs((p) => ({ ...p, column: Number(e.target.value) as AmpacityColumn }))}
            />

            <Select
              label="Ambient Temperature"
              options={AMBIENT_OPTIONS}
              value={inputs.ambientRow}
              onChange={(e) => setInputs((p) => ({ ...p, ambientRow: e.target.value }))}
            />

            <Select
              label="Number of Current-Carrying Conductors"
              options={BAND_OPTIONS}
              value={inputs.band}
              onChange={(e) => setInputs((p) => ({ ...p, band: e.target.value }))}
            />
          </div>

          {/* Calculate and Reset Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <Button onClick={performCalculation} className="flex-1">
              <Calculator className="w-4 h-4" />
              Calculate Ampacity
            </Button>
            <Button variant="secondary" onClick={handleReset} className="flex-1">
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>

        {/* Results Section */}
        {calculated && calculated.results.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Calculation Results</h2>
            <div className="space-y-6">
              {calculated.results.map(({ key, label, result }) => (
                <div
                  key={key}
                  className={`border rounded-lg p-4 ${
                    key === 'copper' ? 'bg-copper-50 border-copper-200' : 'bg-aluminum-50 border-aluminum-200'
                  }`}
                >
                  <h3
                    className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                      key === 'copper' ? 'text-copper-700' : 'text-aluminum-700'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-gradient-to-br ${
                        key === 'copper' ? 'from-copper-400 to-copper-600' : 'from-aluminum-300 to-aluminum-500'
                      }`}
                    ></div>
                    {label}: {formatSize(calculated.inputs.size)}
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {resultRows(result, calculated.inputs.column).map((row) => (
                      <div key={row.label}>
                        <dt className="text-neutral-600">{row.label}:</dt>
                        <dd className={row.label === 'Ampacity' ? 'font-mono font-semibold text-lg' : 'font-mono'}>
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}

              {/* NEC Reference */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <p className="text-xs text-neutral-600">
                  <strong>NEC References:</strong> {AMPACITY_NEC_REFERENCES}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
