'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Shield, AlertTriangle, Calculator, RefreshCw } from 'lucide-react';
import {
  egcForOcpd,
  GROUND_WIRE_DEFAULTS,
  GROUND_WIRE_RATINGS,
  PROPORTIONAL_NOTE,
  TABLE_250_122_ROWS,
} from '@/lib/calculations/grounding';
import type { EgcRow } from '@/lib/calculations/grounding';
import { formatSize } from '@/lib/calculations/sizes';

const RATING_OPTIONS = GROUND_WIRE_RATINGS.map((a) => ({ value: String(a), label: `${a} A` }));
const COPPER_LABEL = 'Copper';
const ALUMINUM_LABEL = 'Aluminum or copper-clad aluminum';

export function GroundWireCalculator() {
  const [ocpdA, setOcpdA] = useState(GROUND_WIRE_DEFAULTS.ocpdA);
  const [result, setResult] = useState<{ ocpdA: number; row: EgcRow } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const performCalculation = useCallback(() => {
    const row = egcForOcpd(ocpdA);
    setResult(row ? { ocpdA, row } : null);
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, [ocpdA]);

  const handleReset = () => {
    setOcpdA(GROUND_WIRE_DEFAULTS.ocpdA);
    setResult(null);
  };

  const shareableInputs = { breakerSize: ocpdA };
  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!result) return;
    print({
      title: 'Equipment Grounding Conductor Calculation',
      inputs: {
        'Overcurrent Device Rating': `${result.ocpdA} A`,
      },
      results: {
        [COPPER_LABEL]: formatSize(result.row.cu),
        [ALUMINUM_LABEL]: formatSize(result.row.alCca),
        'NEC Table 250.122 row': `${result.row.rowA} A`,
      },
      notes: [PROPORTIONAL_NOTE],
    });
  }, [result, print]);

  return (
    <CalculatorLayout
      title="Grounding Conductor Calculator"
      description="Calculate equipment grounding conductor size per NEC 250.122"
      onShare={handleShare}
      onPrint={handlePrint}
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
            onChange={(e) => setOcpdA(Number(e.target.value))}
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
            <Button onClick={performCalculation} className="flex-1">
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
        {result && (
          <div className="bg-white rounded-lg border border-gray-200 p-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Calculation Results</h2>
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
                      {formatSize(result.row.cu)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">{ALUMINUM_LABEL}</div>
                    <div className="text-2xl sm:text-4xl font-bold font-mono text-green-700 break-words min-w-0">
                      {formatSize(result.row.alCca)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-neutral-600 mt-4 text-center">
                  Based on {result.ocpdA} A overcurrent device (NEC Table 250.122 row: {result.row.rowA} A)
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
                      {TABLE_250_122_ROWS.map((row) => (
                        <tr key={row.rowA} className={row.rowA === result.row.rowA ? 'bg-green-100' : ''}>
                          <td className="p-2">{row.rowA} A</td>
                          <td className="p-2 font-mono">{formatSize(row.cu)}</td>
                          <td className="p-2 font-mono">{formatSize(row.alCca)}</td>
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
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
