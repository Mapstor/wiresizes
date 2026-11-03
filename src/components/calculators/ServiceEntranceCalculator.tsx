'use client';

import { useRef, useState } from 'react';
import { Building, Calculator, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Val } from '@/components/content/Val';
import { ValText } from '@/components/content/ValText';
import type { TextPart } from '@/lib/calculations/format';
import {
  NO_ROW_MESSAGE,
  SCOPE_LINES,
  SERVICE_LOOKUP_DEFAULTS,
  SERVICE_RATINGS,
  serviceLookup,
} from '@/lib/calculations/service-lookup';
import type { ServiceLookupResult } from '@/lib/calculations/service-lookup';
import { focusResults } from '@/lib/hooks/useCalculatorForm';

const RATING_OPTIONS = SERVICE_RATINGS.map((a) => ({ value: String(a), label: `${a} A` }));

interface Row {
  key: string;
  label: TextPart[];
  value: TextPart[];
}

/** Result lines for the panel (and any copy of it). */
function resultRows(result: ServiceLookupResult): { conductors: Row[]; gec: Row[] } {
  return {
    conductors: [
      { key: 'cu', label: ['Copper'], value: [{ size: result.cu }] },
      { key: 'al', label: ['Aluminum or copper-clad aluminum'], value: [{ size: result.alCca }] },
    ],
    gec: [
      {
        key: 'cu-service-cu',
        label: ['For ', { size: result.cu }, ' copper service conductors: copper'],
        value: [{ size: result.gecForCuService.cu }],
      },
      {
        key: 'cu-service-al',
        label: ['For ', { size: result.cu }, ' copper service conductors: aluminum or copper-clad aluminum'],
        value: [{ size: result.gecForCuService.alCca }],
      },
      {
        key: 'al-service-cu',
        label: ['For ', { size: result.alCca }, ' aluminum service conductors: copper'],
        value: [{ size: result.gecForAlService.cu }],
      },
      {
        key: 'al-service-al',
        label: ['For ', { size: result.alCca }, ' aluminum service conductors: aluminum or copper-clad aluminum'],
        value: [{ size: result.gecForAlService.alCca }],
      },
    ],
  };
}

export default function ServiceEntranceCalculator() {
  const [ratingA, setRatingA] = useState(SERVICE_LOOKUP_DEFAULTS.ratingA);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const result = serviceLookup(ratingA);
  const rows = result ? resultRows(result) : null;

  const handleLookup = () => focusResults(resultsHeadingRef.current);

  const handleReset = () => setRatingA(SERVICE_LOOKUP_DEFAULTS.ratingA);

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
          <Button onClick={handleLookup} className="flex-1">
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
      <div className="space-y-6">
        <h2 ref={resultsHeadingRef} tabIndex={-1} className="text-lg font-semibold">Results</h2>
        {!rows ? (
          <div className="rounded-xl p-6 bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
            {NO_ROW_MESSAGE}
          </div>
        ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  <Val v={ratingA} unit="A" src="input" />, 120/240 V dwelling
                </h3>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Service conductors, NEC Table 310.12</div>
                <dl className="grid sm:grid-cols-2 gap-4">
                  {rows.conductors.map((row) => (
                    <div key={row.key} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <dt className="text-sm text-blue-700">
                        <ValText parts={row.label} />
                      </dt>
                      <dd className="text-2xl font-bold text-blue-900 font-mono">
                        <ValText parts={row.value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Grounding electrode conductor, NEC Table 250.66</div>
                <dl className="space-y-2 text-sm">
                  {rows.gec.map((row) => (
                    <div key={row.key} className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                      <dt className="text-gray-600">
                        <ValText parts={row.label} />
                      </dt>
                      <dd className="font-mono font-semibold">
                        <ValText parts={row.value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

            </div>
        )}
      </div>
    </div>
  );
}
