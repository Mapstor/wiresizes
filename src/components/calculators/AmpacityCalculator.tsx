'use client';

import { useRef, useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { Size } from '@/components/content/Size';
import { ValText } from '@/components/content/ValText';
import { focusResults, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { buildQuery, choiceParam } from '@/lib/calculations/fields';
import { partsText } from '@/lib/calculations/format';
import type { TextPart, ValueFormat } from '@/lib/calculations/format';
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
  ENGINE_ID,
  formatFactor,
  NOT_PERMITTED_MESSAGE,
  ocpdLimitParts,
} from '@/lib/calculations/ampacity';
import type { AmpacityInput, AmpacityResult } from '@/lib/calculations/ampacity';
import { NO_14_AWG_ALUMINUM_NOTE, NO_14_AWG_ALUMINUM_NOTE_PARTS } from '@/lib/calculations/voltage-drop';
import { formatSize } from '@/lib/verified/awg';
import type { Material } from '@/lib/verified/awg';
import type { AmpacityColumn } from '@/lib/verified/nec-310-16';

const SIZE_OPTIONS = AMPACITY_SIZES.map((key) => ({ value: key, label: formatSize(key) }));
const TEMPERATURE_OPTIONS = COLUMN_OPTIONS.map((c) => ({ value: String(c.value), label: c.label }));
const AMBIENT_OPTIONS = AMBIENT_ROWS.map((row) => ({ value: row.key, label: ambientLabel(row) }));
const BAND_OPTIONS = ADJUSTMENT_BANDS.map((band) => ({ value: band.key, label: bandLabel(band) }));

const MATERIALS: { material: Material; key: 'copper' | 'aluminum'; label: string }[] = [
  { material: 'Cu', key: 'copper', label: 'Copper Conductor' },
  { material: 'Al', key: 'aluminum', label: 'Aluminum Conductor' },
];

const CALC = `calc:${ENGINE_ID}`;
/** Ampacities with at most two decimals. */
const AMPS: ValueFormat = { upTo: 2 };

interface Row {
  key: 'table' | 'correction' | 'adjustment' | 'ampacity' | 'ocpd';
  label: TextPart[];
  value: TextPart[];
}

/** The lines the result panel shows for one material, also used for print (partsText). */
function resultRows(result: AmpacityResult, column: AmpacityColumn): Row[] {
  const rows: Row[] = [
    {
      key: 'table',
      label: ['NEC Table 310.16, ', { v: column, unit: '°C', src: 'input' }, ' column'],
      value: [{ v: result.tableAmpacity as number, unit: 'A', src: CALC, format: AMPS }],
    },
    {
      key: 'correction',
      label: ['Ambient correction, Table 310.15(B)(1)(1)'],
      value: [formatFactor(result.correctionFactor)],
    },
    { key: 'adjustment', label: ['Adjustment, Table 310.15(C)(1)'], value: [{ v: result.adjustmentPercent, unit: '%', src: CALC }] },
    {
      key: 'ampacity',
      label: ['Ampacity'],
      value: result.ampacity === null ? [NOT_PERMITTED_MESSAGE] : [{ v: result.ampacity, unit: 'A', src: CALC, format: AMPS }],
    },
  ];
  if (result.ocpdLimitA !== null) rows.push({ key: 'ocpd', label: ['NEC 240.4(D)'], value: ocpdLimitParts(result.ocpdLimitA) });
  return rows;
}

/** Inputs from a share link: size, temperature column, ambient row and conductor band. */
function inputsFromQuery(params: URLSearchParams): AmpacityInput {
  return {
    ...AMPACITY_DEFAULTS,
    size: choiceParam(params, 'awg', AMPACITY_SIZES) ?? AMPACITY_DEFAULTS.size,
    column: choiceParam(params, 'temperature', COLUMN_OPTIONS.map((c) => c.value)) ?? AMPACITY_DEFAULTS.column,
    ambientRow: choiceParam(params, 'ambient', AMBIENT_ROWS.map((row) => row.key)) ?? AMPACITY_DEFAULTS.ambientRow,
    band: choiceParam(params, 'conductors', ADJUSTMENT_BANDS.map((band) => band.key)) ?? AMPACITY_DEFAULTS.band,
  };
}

function calculate(inputs: AmpacityInput) {
  return MATERIALS.flatMap((m) => {
    const result = calculateAmpacity({ ...inputs, material: m.material });
    // no Table 310.16 value for this size and material (14 AWG aluminum)
    return result.tableAmpacity === null ? [] : [{ key: m.key, label: m.label, result }];
  });
}

export function AmpacityCalculator() {
  const [inputs, setInputs] = useState<AmpacityInput>(AMPACITY_DEFAULTS);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const results = calculate(inputs);

  const query = buildQuery({
    awg: inputs.size,
    temperature: inputs.column,
    ambient: inputs.ambientRow,
    conductors: inputs.band,
  });
  const { markChanged, shareUrl } = useUrlState(query, (params) => setInputs(inputsFromQuery(params)));
  const { print } = usePrintExport();

  const change = (patch: Partial<AmpacityInput>) => {
    markChanged();
    setInputs((p) => ({ ...p, ...patch }));
  };

  const handleCalculate = () => focusResults(resultsHeadingRef.current);

  const handleReset = () => {
    markChanged();
    setInputs(AMPACITY_DEFAULTS);
  };

  const noAluminum = !results.some((r) => r.key === 'aluminum');

  const handlePrint = () => {
    const printed: Record<string, string> = {};
    for (const { label, result } of results) {
      for (const row of resultRows(result, inputs.column)) printed[`${label}: ${partsText(row.label)}`] = partsText(row.value);
    }
    const notes = [`NEC References: ${AMPACITY_NEC_REFERENCES}`];
    if (noAluminum) notes.unshift(NO_14_AWG_ALUMINUM_NOTE);
    print({
      title: 'Wire Ampacity Calculation',
      inputs: {
        'Wire Size': formatSize(inputs.size),
        'Temperature Rating': COLUMN_OPTIONS.find((c) => c.value === inputs.column)?.label ?? '',
        'Ambient Temperature': AMBIENT_OPTIONS.find((o) => o.value === inputs.ambientRow)?.label ?? '',
        'Number of Current-Carrying Conductors': BAND_OPTIONS.find((o) => o.value === inputs.band)?.label ?? '',
      },
      results: printed,
      notes,
    });
  };

  return (
    <CalculatorLayout
      title="Wire Ampacity Calculator"
      description="Calculate the current carrying capacity for copper and aluminum conductors"
      shareUrl={shareUrl}
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
              onChange={(e) => change({ size: e.target.value })}
            />

            <Select
              label="Temperature Rating"
              options={TEMPERATURE_OPTIONS}
              value={String(inputs.column)}
              onChange={(e) => change({ column: Number(e.target.value) as AmpacityColumn })}
            />

            <Select
              label="Ambient Temperature"
              options={AMBIENT_OPTIONS}
              value={inputs.ambientRow}
              onChange={(e) => change({ ambientRow: e.target.value })}
            />

            <Select
              label="Number of Current-Carrying Conductors"
              options={BAND_OPTIONS}
              value={inputs.band}
              onChange={(e) => change({ band: e.target.value })}
            />
          </div>

          {/* Calculate and Reset Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <Button onClick={handleCalculate} className="flex-1">
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
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 ref={resultsHeadingRef} tabIndex={-1} className="text-lg font-semibold text-gray-800 mb-6">Calculation Results</h2>
            <div className="space-y-6">
              {results.map(({ key, label, result }) => (
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
                    {/* one inline wrapper: the heading is a flex container, and the text must stay one item */}
                    <span>
                      {label}: <Size s={inputs.size} />
                    </span>
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {resultRows(result, inputs.column).map((row) => (
                      <div key={row.key}>
                        <dt className="text-neutral-600">
                          <ValText parts={row.label} />:
                        </dt>
                        <dd className={row.key === 'ampacity' ? 'font-mono font-semibold text-lg' : 'font-mono'}>
                          <ValText parts={row.value} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}

              {noAluminum && (
                <div className="border rounded-lg p-4 bg-aluminum-50 border-aluminum-200">
                  <p className="text-sm text-neutral-700">
                    <ValText parts={NO_14_AWG_ALUMINUM_NOTE_PARTS} />
                  </p>
                </div>
              )}

              {/* NEC Reference */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <p className="text-xs text-neutral-600">
                  <strong>NEC References:</strong> {AMPACITY_NEC_REFERENCES}
                </p>
              </div>
            </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
