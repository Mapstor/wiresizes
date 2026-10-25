'use client';

import { useState, useCallback, useRef } from 'react';
import { Building, Calculator, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { formatSize } from '@/lib/calculations/sizes';
import {
  NO_ROW_MESSAGE,
  SCOPE_LINES,
  SERVICE_LOOKUP_DEFAULTS,
  SERVICE_RATINGS,
  serviceLookup,
} from '@/lib/calculations/service-lookup';
import type { ServiceLookupResult } from '@/lib/calculations/service-lookup';

const RATING_OPTIONS = SERVICE_RATINGS.map((a) => ({ value: String(a), label: `${a} A` }));

interface Row {
  label: string;
  value: string;
}

/** Result lines for the panel (and any copy of it). */
function resultRows(result: ServiceLookupResult): { conductors: Row[]; gec: Row[] } {
  return {
    conductors: [
      { label: 'Copper', value: formatSize(result.cu) },
      { label: 'Aluminum or copper-clad aluminum', value: formatSize(result.alCca) },
    ],
    gec: [
      { label: `For ${formatSize(result.cu)} copper service conductors: copper`, value: formatSize(result.gecForCuService.cu) },
      {
        label: `For ${formatSize(result.cu)} copper service conductors: aluminum or copper-clad aluminum`,
        value: formatSize(result.gecForCuService.alCca),
      },
      { label: `For ${formatSize(result.alCca)} aluminum service conductors: copper`, value: formatSize(result.gecForAlService.cu) },
      {
        label: `For ${formatSize(result.alCca)} aluminum service conductors: aluminum or copper-clad aluminum`,
        value: formatSize(result.gecForAlService.alCca),
      },
    ],
  };
}

export default function ServiceEntranceCalculator() {
  const [ratingA, setRatingA] = useState(SERVICE_LOOKUP_DEFAULTS.ratingA);
  const [lookup, setLookup] = useState<{ ratingA: number; result: ServiceLookupResult | null } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const performLookup = useCallback(() => {
    setLookup({ ratingA, result: serviceLookup(ratingA) });
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [ratingA]);

  const handleReset = useCallback(() => {
    setRatingA(SERVICE_LOOKUP_DEFAULTS.ratingA);
    setLookup(null);
  }, []);

  const rows = lookup?.result ? resultRows(lookup.result) : null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Inputs Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Select
            label="Service or main power feeder rating"
            options={RATING_OPTIONS}
            value={String(ratingA)}
            onChange={(e) => setRatingA(Number(e.target.value))}
          />
        </div>
        <div className="mt-4 space-y-2 text-sm text-neutral-600">
          {SCOPE_LINES.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
          <Button onClick={performLookup} className="flex-1">
            <Calculator className="w-4 h-4" />
            Look Up
          </Button>
          <Button variant="secondary" onClick={handleReset} className="flex-1">
            <RotateCcw className="w-4 h-4" />
            Reset Calculator
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {lookup && (
        <div className="space-y-6" ref={resultsRef}>
          <h2 className="text-lg font-semibold">Results</h2>
          {!rows ? (
            <div className="rounded-xl p-6 bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
              {NO_ROW_MESSAGE}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{lookup.ratingA} A, 120/240 V dwelling</h3>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Service conductors, NEC Table 310.12</div>
                <dl className="grid sm:grid-cols-2 gap-4">
                  {rows.conductors.map((row) => (
                    <div key={row.label} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <dt className="text-sm text-blue-700">{row.label}</dt>
                      <dd className="text-2xl font-bold text-blue-900 font-mono">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Grounding electrode conductor, NEC Table 250.66</div>
                <dl className="space-y-2 text-sm">
                  {rows.gec.map((row) => (
                    <div key={row.label} className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                      <dt className="text-gray-600">{row.label}</dt>
                      <dd className="font-mono font-semibold">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
