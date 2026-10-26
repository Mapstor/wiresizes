'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { focusResults, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { buildQuery, choiceParam } from '@/lib/calculations/fields';
import { Shield, AlertTriangle, Calculator, RefreshCw } from 'lucide-react';
import {
  egcForOcpd,
  GROUND_WIRE_DEFAULTS,
  GROUND_WIRE_RATINGS,
  PROPORTIONAL_NOTE,
  TABLE_250_122_ROWS,
} from '@/lib/calculations/grounding';
import { formatSize } from '@/lib/calculations/sizes';

const RATING_OPTIONS = GROUND_WIRE_RATINGS.map((a) => ({ value: String(a), label: `${a} A` }));
const COPPER_LABEL = 'Copper';
const ALUMINUM_LABEL = 'Aluminum or copper-clad aluminum';

export function GroundWireCalculator() {
  const [ocpdA, setOcpdA] = useState(GROUND_WIRE_DEFAULTS.ocpdA);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const row = egcForOcpd(ocpdA);

  const { markChanged, shareUrl } = useUrlState(buildQuery({ breakerSize: ocpdA }), (params) =>
    setOcpdA(choiceParam(params, 'breakerSize', GROUND_WIRE_RATINGS) ?? GROUND_WIRE_DEFAULTS.ocpdA),
  );
  const { print } = usePrintExport();

  const handleCalculate = () => focusResults(resultsHeadingRef.current);

  const handleReset = () => {
    markChanged();
    setOcpdA(GROUND_WIRE_DEFAULTS.ocpdA);
  };

  const handlePrint = () => {
    if (!row) return;
    print({
      title: 'Equipment Grounding Conductor Calculation',
      inputs: {
        'Overcurrent Device Rating': `${ocpdA} A`,
      },
      results: {
        [COPPER_LABEL]: formatSize(row.cu),
        [ALUMINUM_LABEL]: formatSize(row.alCca),
        'NEC Table 250.122 row': `${row.rowA} A`,
      },
      notes: [PROPORTIONAL_NOTE],
    });
  };

  return (
    <CalculatorLayout
      title="Grounding Conductor Calculator"
      description="Calculate equipment grounding conductor size per NEC 250.122"
      shareUrl={shareUrl}
      onPrint={handlePrint}
      actionsDisabled={!row}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Input Parameters */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Select
            label="Overcurrent Device Rating"
            options={RATING_OPTIONS}
            value={String(ocpdA)}
            onChange={(e) => {
              markChanged();
              setOcpdA(Number(e.target.value));
            }}
          />

          {/* Safety Notice */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-red-800">Safety Notice</div>
                <div className="text-sm text-red-700 mt-1">
                  Equipment grounding conductors are critical for safety. Always verify
                  calculations and consult NEC 250.122 for specific requirements.
                </div>
              </div>
            </div>
          </div>

          {/* NEC Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-800 mb-2">NEC 250.122 Key Points</div>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• Based on overcurrent device rating</div>
              <div>• Continuous path to ground required</div>
              <div>• {PROPORTIONAL_NOTE}</div>
            </div>
          </div>

          </div>

          {/* Calculate and Reset Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <Button onClick={handleCalculate} className="flex-1">
              <Calculator className="w-4 h-4" />
              Calculate Ground Wire Size
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
          {row && (
            <div className="space-y-6">
              {/* Main Result */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Equipment Grounding Conductor</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-sm text-neutral-600">{COPPER_LABEL}</div>
                    <div className="text-2xl sm:text-4xl font-bold font-mono text-green-700 break-words min-w-0">
                      {formatSize(row.cu)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">{ALUMINUM_LABEL}</div>
                    <div className="text-2xl sm:text-4xl font-bold font-mono text-green-700 break-words min-w-0">
                      {formatSize(row.alCca)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-neutral-600 mt-4 text-center">
                  Based on {ocpdA} A overcurrent device (NEC Table 250.122 row: {row.rowA} A)
                </div>
                <p className="text-sm text-neutral-700 mt-3 text-center">{PROPORTIONAL_NOTE}</p>
              </div>

              {/* Table 250.122 Reference */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">
                  NEC Table 250.122
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-neutral-300">
                        <th className="text-left p-2">Overcurrent Device (not exceeding)</th>
                        <th className="text-left p-2">{COPPER_LABEL}</th>
                        <th className="text-left p-2">{ALUMINUM_LABEL}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {TABLE_250_122_ROWS.map((r) => (
                        <tr key={r.rowA} className={r.rowA === row.rowA ? 'bg-green-100' : ''}>
                          <td className="p-2">{r.rowA} A</td>
                          <td className="p-2 font-mono">{formatSize(r.cu)}</td>
                          <td className="p-2 font-mono">{formatSize(r.alCca)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* NEC Reference */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-2">Code Reference</div>
                <div className="text-sm text-neutral-600">NEC Table 250.122</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
