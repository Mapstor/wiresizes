'use client';

import { useState, useEffect, useCallback , useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { AlertTriangle, CheckCircle, XCircle , Calculator, RefreshCw } from 'lucide-react';

// NEC Chapter 9 Table 4 - Conduit Fill Areas (in²)
const CONDUIT_TYPES = {
  'emt': 'Electrical Metallic Tubing (EMT)',
  'pvc': 'PVC Schedule 40',
  'rigid': 'Rigid Metal Conduit (RMC)',
  'imc': 'Intermediate Metal Conduit (IMC)',
  'pvc80': 'PVC Schedule 80',
  'flex': 'Flexible Metal Conduit (FMC)',
};

const CONDUIT_FILL_AREAS = {
  emt: {
    '1/2': 0.304, '3/4': 0.533, '1': 0.864, '1-1/4': 1.496, '1-1/2': 2.036,
    '2': 3.356, '2-1/2': 5.858, '3': 8.846, '3-1/2': 11.545, '4': 14.753,
  },
  pvc: {
    '1/2': 0.285, '3/4': 0.508, '1': 0.832, '1-1/4': 1.453, '1-1/2': 1.986,
    '2': 3.291, '2-1/2': 5.793, '3': 8.688, '3-1/2': 11.365, '4': 14.513,
  },
  rigid: {
    '1/2': 0.314, '3/4': 0.549, '1': 0.887, '1-1/4': 1.526, '1-1/2': 2.071,
    '2': 3.408, '2-1/2': 5.939, '3': 8.957, '3-1/2': 11.663, '4': 14.918,
  },
  imc: {
    '1/2': 0.342, '3/4': 0.586, '1': 0.959, '1-1/4': 1.638, '1-1/2': 2.225,
    '2': 3.647, '2-1/2': 6.442, '3': 9.737, '3-1/2': 12.692, '4': 16.269,
  },
  pvc80: {
    '1/2': 0.217, '3/4': 0.409, '1': 0.688, '1-1/4': 1.237, '1-1/2': 1.711,
    '2': 2.874, '2-1/2': 5.153, '3': 7.792, '3-1/2': 10.239, '4': 13.171,
  },
  flex: {
    '1/2': 0.304, '3/4': 0.533, '1': 0.864, '1-1/4': 1.496, '1-1/2': 2.036,
    '2': 3.356, '2-1/2': 5.858, '3': 8.846, '3-1/2': 11.545, '4': 14.753,
  },
} as const;

// Wire cross-sectional areas (in²) from NEC Chapter 9 Table 5
const WIRE_AREAS = {
  '14': { thw: 0.0139, thwn: 0.0097, xhhw: 0.0097 },
  '12': { thw: 0.0181, thwn: 0.0133, xhhw: 0.0133 },
  '10': { thw: 0.0243, thwn: 0.0211, xhhw: 0.0211 },
  '8': { thw: 0.0437, thwn: 0.0366, xhhw: 0.0366 },
  '6': { thw: 0.0726, thwn: 0.0507, xhhw: 0.0507 },
  '4': { thw: 0.1041, thwn: 0.0824, xhhw: 0.0824 },
  '3': { thw: 0.1134, thwn: 0.0973, xhhw: 0.0973 },
  '2': { thw: 0.1333, thwn: 0.1158, xhhw: 0.1158 },
  '1': { thw: 0.1901, thwn: 0.1562, xhhw: 0.1562 },
  '1/0': { thw: 0.2223, thwn: 0.1855, xhhw: 0.1855 },
  '2/0': { thw: 0.2624, thwn: 0.2223, xhhw: 0.2223 },
  '3/0': { thw: 0.3117, thwn: 0.2679, xhhw: 0.2679 },
  '4/0': { thw: 0.3718, thwn: 0.3237, xhhw: 0.3237 },
  '250': { thw: 0.4596, thwn: 0.3904, xhhw: 0.3904 },
  '300': { thw: 0.5281, thwn: 0.4536, xhhw: 0.4536 },
  '350': { thw: 0.5958, thwn: 0.5166, xhhw: 0.5166 },
  '400': { thw: 0.6619, thwn: 0.5782, xhhw: 0.5782 },
  '500': { thw: 0.7901, thwn: 0.6984, xhhw: 0.6984 },
} as const;

type ConduitType = keyof typeof CONDUIT_TYPES;
type ConduitSize = keyof typeof CONDUIT_FILL_AREAS.emt;
type WireSize = keyof typeof WIRE_AREAS;
type InsulationType = keyof typeof WIRE_AREAS[WireSize];

interface FillResult {
  conductorArea: number;
  conduitArea: number;
  fillPercent: number;
  isCompliant: boolean;
  maxAllowed: number;
  recommendation: string;
}

export function ConduitFillCalculator() {
  const [conduitType, setConduitType] = useState<ConduitType>('emt');
  const [conduitSize, setConduitSize] = useState<ConduitSize>('3/4');
  const [wireSize, setWireSize] = useState<WireSize>('12');
  const [insulation, setInsulation] = useState<InsulationType>('thwn');
  const [numConductors, setNumConductors] = useState(4);
  const [result, setResult] = useState<FillResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculateFill = useCallback(() => {
    const conduitArea = CONDUIT_FILL_AREAS[conduitType][conduitSize];
    const wireArea = WIRE_AREAS[wireSize][insulation];
    const totalConductorArea = wireArea * numConductors;
    
    // NEC 314.16(B) fill percentages:
    // 1 conductor: 53%, 2 conductors: 31%, 3+ conductors: 40%
    let maxFillPercent: number;
    if (numConductors === 1) {
      maxFillPercent = 53;
    } else if (numConductors === 2) {
      maxFillPercent = 31;
    } else {
      maxFillPercent = 40;
    }
    
    const maxAllowedArea = conduitArea * (maxFillPercent / 100);
    const fillPercent = (totalConductorArea / conduitArea) * 100;
    const isCompliant = totalConductorArea <= maxAllowedArea;
    
    let recommendation = '';
    if (!isCompliant) {
      recommendation = 'Conduit size is too small. Consider larger conduit or fewer conductors.';
    } else if (fillPercent > 35) {
      recommendation = 'Near capacity. Consider next size up for easier installation.';
    } else if (fillPercent < 15) {
      recommendation = 'Conduit is oversized. Smaller conduit may be acceptable.';
    } else {
      recommendation = 'Good conduit fill ratio for installation.';
    }

    setResult({
      conductorArea: totalConductorArea,
      conduitArea,
      fillPercent,
      isCompliant,
      maxAllowed: maxFillPercent,
      recommendation,
    });
  }, [conduitType, conduitSize, wireSize, insulation, numConductors]);

  const performCalculation = useCallback(() => {
    calculateFill();
    setShowResults(true);
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }, [calculateFill]);

  const handleReset = () => {
    setShowResults(false);
    // Reset form fields as needed
  };

  // Auto-calculation disabled - user must click Calculate button
  // useEffect(() => {
  //   calculate();
  // }, [calculate]);

  const shareableInputs = {
    conduitType,
    conduitSize,
    wireSize,
    insulation,
    numConductors,
  };
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
      title: 'Conduit Fill Calculation',
      inputs: {
        'Conduit Type': CONDUIT_TYPES[conduitType],
        'Conduit Size': `${conduitSize}"`,
        'Wire Size': `#${wireSize} AWG`,
        'Insulation': insulation.toUpperCase(),
        'Number of Conductors': numConductors,
      },
      results: {
        'Fill Percentage': `${result.fillPercent.toFixed(1)}%`,
        'Max Allowed': `${result.maxAllowed}%`,
        'Status': result.isCompliant ? 'Compliant' : 'Non-Compliant',
        'Conduit Area': `${result.conduitArea} in²`,
        'Conductor Area': `${result.conductorArea.toFixed(4)} in²`,
      },
      notes: [result.recommendation],
    });
  }, [result, conduitType, conduitSize, wireSize, insulation, numConductors, print]);

  return (
    <CalculatorLayout
      title="Conduit Fill Calculator"
      description="Calculate conduit fill percentage per NEC Chapter 9"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Select
            label="Conduit Type"
            options={Object.entries(CONDUIT_TYPES).map(([key, label]) => ({
              value: key,
              label,
            }))}
            value={conduitType}
            onChange={(e) => setConduitType(e.target.value as ConduitType)}
          />

          <Select
            label="Conduit Size"
            options={Object.keys(CONDUIT_FILL_AREAS[conduitType]).map(size => ({
              value: size,
              label: `${size}"`,
            }))}
            value={conduitSize}
            onChange={(e) => setConduitSize(e.target.value as ConduitSize)}
          />

          <Select
            label="Wire Size"
            options={Object.keys(WIRE_AREAS).map(size => ({
              value: size,
              label: `#${size} AWG`,
            }))}
            value={wireSize}
            onChange={(e) => setWireSize(e.target.value as WireSize)}
          />

          <Select
            label="Insulation Type"
            options={Object.keys(WIRE_AREAS[wireSize]).map(type => ({
              value: type,
              label: type.toUpperCase(),
            }))}
            value={insulation}
            onChange={(e) => setInsulation(e.target.value as InsulationType)}
          />

          <Input
            label="Number of Conductors"
            type="number"
            value={numConductors}
            onChange={(e) => setNumConductors(Number(e.target.value))}
            min={1}
            max={50}
          />

          {/* NEC Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-800 mb-2">NEC Reference</div>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• <strong>Chapter 9, Table 4:</strong> Conduit dimensions</div>
              <div>• <strong>Chapter 9, Table 5:</strong> Wire dimensions</div>
              <div>• <strong>314.16(B):</strong> Fill percentages</div>
              <div>• <strong>1 conductor:</strong> 53% max fill</div>
              <div>• <strong>2 conductors:</strong> 31% max fill</div>
              <div>• <strong>3+ conductors:</strong> 40% max fill</div>
            </div>
          </div>
        

          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
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

        {/* Results Section */}
        {showResults && result && (
          <div className="space-y-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold">Calculation Results</h2>
          {result && (
            <>
              {/* Main Result */}
              <div className={`rounded-xl p-6 border-2 ${
                result.isCompliant 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  {result.isCompliant ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    result.isCompliant ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.isCompliant ? 'NEC Compliant' : 'Not Compliant'}
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold font-mono ${
                    result.isCompliant ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.fillPercent.toFixed(1)}%
                  </div>
                  <div className="text-sm text-neutral-600">Fill Percentage</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-neutral-600">Max Allowed:</span>
                    <p className="font-mono font-semibold">{result.maxAllowed}%</p>
                  </div>
                  <div>
                    <span className="text-neutral-600">Remaining:</span>
                    <p className="font-mono font-semibold">
                      {Math.max(0, result.maxAllowed - result.fillPercent).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Fill Progress Bar */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Fill Visualization</div>
                <div className="relative h-8 bg-neutral-200 rounded-lg overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      result.fillPercent <= result.maxAllowed
                        ? 'bg-gradient-to-r from-green-400 to-green-600'
                        : 'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ width: `${Math.min(100, result.fillPercent)}%` }}
                  />
                  <div 
                    className="absolute top-0 h-full border-l-2 border-amber-500"
                    style={{ left: `${result.maxAllowed}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-600 mt-1">
                  <span>0%</span>
                  <span className="text-amber-600">{result.maxAllowed}% limit</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Detailed Areas */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Area Details</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Conduit Internal Area:</span>
                    <span className="font-mono font-semibold">{result.conduitArea} in²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Conductor Area:</span>
                    <span className="font-mono font-semibold">{result.conductorArea.toFixed(4)} in²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Area per Conductor:</span>
                    <span className="font-mono font-semibold">
                      {WIRE_AREAS[wireSize][insulation].toFixed(4)} in²
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-300 pt-2">
                    <span className="text-neutral-600">Available Space:</span>
                    <span className="font-mono font-semibold">
                      {Math.max(0, result.conduitArea - result.conductorArea).toFixed(4)} in²
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className={`border rounded-lg p-4 ${
                result.isCompliant 
                  ? result.fillPercent > 35 
                    ? 'bg-amber-50 border-amber-200' 
                    : 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    result.isCompliant 
                      ? result.fillPercent > 35 
                        ? 'text-amber-600' 
                        : 'text-green-600'
                      : 'text-red-600'
                  }`} />
                  <div>
                    <div className={`text-sm font-medium ${
                      result.isCompliant 
                        ? result.fillPercent > 35 
                          ? 'text-amber-800' 
                          : 'text-green-800'
                        : 'text-red-800'
                    }`}>
                      Recommendation
                    </div>
                    <div className={`text-sm mt-1 ${
                      result.isCompliant 
                        ? result.fillPercent > 35 
                          ? 'text-amber-700' 
                          : 'text-green-700'
                        : 'text-red-700'
                    }`}>
                      {result.recommendation}
                    </div>
                  </div>
                </div>
              </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}