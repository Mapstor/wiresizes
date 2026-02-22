'use client';

import { useState, useEffect, useCallback , useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { CheckCircle, XCircle, AlertTriangle , Calculator, RefreshCw } from 'lucide-react';

// NEC 314.16(A) - Box fill volumes (cubic inches)
const BOX_TYPES = {
  'octagonal': 'Octagonal Boxes',
  'square': 'Square Boxes', 
  'rectangular': 'Rectangular/Device Boxes',
  'round': 'Round Boxes',
  'weatherproof': 'Weatherproof Boxes',
  'gangable': 'Gangable Device Boxes',
};

// Common box sizes and their volumes in cubic inches
const BOX_VOLUMES = {
  octagonal: {
    '4x1.5': 15.5,
    '4x2.125': 21.5,
    '4x1.5-ext': 18.0,
    '4x2.125-ext': 25.5,
  },
  square: {
    '4x1.5': 21.0,
    '4x2.125': 30.3,
    '4-11/16x1.5': 25.5,
    '4-11/16x2.125': 42.0,
  },
  rectangular: {
    '3x2x1.5': 7.5,
    '3x2x2': 10.0,
    '3x2x2.25': 10.5,
    '3x2x2.5': 12.5,
    '3x2x2.75': 14.0,
    '3x2x3.5': 18.0,
  },
  round: {
    '4x1.25': 12.5,
    '4x1.5': 15.3,
    '4x2.125': 21.5,
  },
  weatherproof: {
    '4.75x4.75x2.375': 35.0,
    'FS-1': 14.0,
    'FS-2': 18.0,
    'FSS-1': 24.0,
  },
  gangable: {
    'single-gang': 18.0,
    'two-gang': 36.0,
    'three-gang': 54.0,
    'four-gang': 72.0,
  },
} as const;

// NEC 314.16(B) - Conductor fill allowances (cubic inches)
const CONDUCTOR_VOLUMES = {
  '14': 2.00,
  '12': 2.25,
  '10': 2.50,
  '8': 3.00,
  '6': 5.00,
  '4': 5.00,
  '3': 5.00,
  '2': 5.00,
  '1': 5.00,
} as const;

type BoxType = keyof typeof BOX_TYPES;
type BoxSize = string;
type WireSize = keyof typeof CONDUCTOR_VOLUMES;

interface BoxFillResult {
  totalVolume: number;
  usedVolume: number;
  fillPercent: number;
  remainingVolume: number;
  isCompliant: boolean;
  maxConductorsAllowed: number;
  recommendation: string;
}

interface Conductor {
  size: WireSize;
  count: number;
  type: 'current-carrying' | 'equipment-ground' | 'pigtail';
}

export function BoxFillCalculator() {
  const [boxType, setBoxType] = useState<BoxType>('rectangular');
  const [boxSize, setBoxSize] = useState<BoxSize>('3x2x2.5');
  const [conductors, setConductors] = useState<Conductor[]>([
    { size: '12', count: 2, type: 'current-carrying' },
    { size: '12', count: 1, type: 'equipment-ground' },
  ]);
  const [numSwitches, setNumSwitches] = useState(1);
  const [numReceptacles, setNumReceptacles] = useState(0);
  const [numWireNuts, setNumWireNuts] = useState(1);
  const [hasClamps, setHasClamps] = useState(true);
  const [result, setResult] = useState<BoxFillResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculateBoxFill = useCallback(() => {
    const boxVolume = BOX_VOLUMES[boxType][boxSize as keyof typeof BOX_VOLUMES[BoxType]];
    if (!boxVolume) return;

    let usedVolume = 0;

    // Calculate conductor volumes
    conductors.forEach(conductor => {
      const volume = CONDUCTOR_VOLUMES[conductor.size];
      if (conductor.type === 'equipment-ground') {
        // Count largest equipment grounding conductor once
        const largestGroundSize = conductors
          .filter(c => c.type === 'equipment-ground')
          .reduce((largest, current) => {
            const currentVolume = CONDUCTOR_VOLUMES[current.size];
            const largestVolume = CONDUCTOR_VOLUMES[largest];
            return currentVolume > largestVolume ? current.size : largest;
          }, '14' as WireSize);
        
        if (conductor.size === largestGroundSize) {
          usedVolume += volume;
        }
      } else {
        usedVolume += volume * conductor.count;
      }
    });

    // Device volumes - each counts as 2x largest connected conductor
    const largestConductorSize = conductors.reduce((largest, current) => {
      const currentVolume = CONDUCTOR_VOLUMES[current.size];
      const largestVolume = CONDUCTOR_VOLUMES[largest];
      return currentVolume > largestVolume ? current.size : largest;
    }, '14' as WireSize);

    const deviceVolume = CONDUCTOR_VOLUMES[largestConductorSize] * 2;
    usedVolume += (numSwitches + numReceptacles) * deviceVolume;

    // Cable clamps - one allowance regardless of number
    if (hasClamps) {
      usedVolume += CONDUCTOR_VOLUMES[largestConductorSize];
    }

    // Wire nuts don't count for volume but noted for reference
    
    const fillPercent = (usedVolume / boxVolume) * 100;
    const remainingVolume = boxVolume - usedVolume;
    const isCompliant = usedVolume <= boxVolume;

    // Calculate max #12 conductors for reference
    const maxConductorsAllowed = Math.floor(boxVolume / CONDUCTOR_VOLUMES['12']);

    let recommendation = '';
    if (!isCompliant) {
      recommendation = 'Box is overfilled. Use a larger box or reduce the number of conductors/devices.';
    } else if (fillPercent > 90) {
      recommendation = 'Box is near capacity. Consider a larger box for easier installation.';
    } else if (fillPercent < 50) {
      recommendation = 'Box has good capacity for future additions.';
    } else {
      recommendation = 'Box fill is within acceptable range.';
    }

    setResult({
      totalVolume: boxVolume,
      usedVolume,
      fillPercent,
      remainingVolume,
      isCompliant,
      maxConductorsAllowed,
      recommendation,
    });
  }, [boxType, boxSize, conductors, numSwitches, numReceptacles, numWireNuts, hasClamps]);

  const performCalculation = useCallback(() => {
    calculateBoxFill();
    setShowResults(true);
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }, [calculateBoxFill]);

  const handleReset = () => {
    setShowResults(false);
    // Reset form fields as needed
  };

  // Auto-calculation disabled - user must click Calculate button
  // useEffect(() => {
  //   calculate();
  // }, [calculate]);

  const addConductor = () => {
    setConductors([...conductors, { size: '12', count: 1, type: 'current-carrying' }]);
  };

  const removeConductor = (index: number) => {
    setConductors(conductors.filter((_, i) => i !== index));
  };

  const updateConductor = (index: number, field: keyof Conductor, value: any) => {
    const updated = [...conductors];
    updated[index] = { ...updated[index], [field]: value };
    setConductors(updated);
  };

  const shareableInputs = {
    boxType,
    boxSize,
    numSwitches,
    numReceptacles,
    hasClamps,
    conductors: conductors.length,
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
      title: 'Box Fill Calculation',
      inputs: {
        'Box Type': BOX_TYPES[boxType],
        'Box Size': boxSize,
        'Switches': numSwitches,
        'Receptacles': numReceptacles,
        'Cable Clamps': hasClamps ? 'Yes' : 'No',
      },
      results: {
        'Box Volume': `${result.totalVolume} in³`,
        'Used Volume': `${result.usedVolume.toFixed(2)} in³`,
        'Fill Percentage': `${result.fillPercent.toFixed(1)}%`,
        'Remaining Volume': `${result.remainingVolume.toFixed(2)} in³`,
        'Status': result.isCompliant ? 'Compliant' : 'Non-Compliant',
      },
      notes: [result.recommendation],
    });
  }, [result, boxType, boxSize, numSwitches, numReceptacles, hasClamps, print]);

  return (
    <CalculatorLayout
      title="Box Fill Calculator"
      description="Calculate electrical box fill per NEC 314.16"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="grid lg:grid-cols-2 gap-6 p-6">
        {/* Inputs Column */}
        <div className="space-y-6">
          <Select
            label="Box Type"
            options={Object.entries(BOX_TYPES).map(([key, label]) => ({
              value: key,
              label,
            }))}
            value={boxType}
            onChange={(e) => setBoxType(e.target.value as BoxType)}
          />

          <Select
            label="Box Size"
            options={Object.entries(BOX_VOLUMES[boxType]).map(([size, volume]) => ({
              value: size,
              label: `${size}" (${volume} in³)`,
            }))}
            value={boxSize}
            onChange={(e) => setBoxSize(e.target.value)}
          />

          {/* Devices */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Switches"
              type="number"
              value={numSwitches}
              onChange={(e) => setNumSwitches(Number(e.target.value))}
              min={0}
              max={10}
            />
            <Input
              label="Receptacles"
              type="number"
              value={numReceptacles}
              onChange={(e) => setNumReceptacles(Number(e.target.value))}
              min={0}
              max={10}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="clamps"
              checked={hasClamps}
              onChange={(e) => setHasClamps(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="clamps" className="text-sm text-neutral-700">
              Cable clamps present
            </label>
          </div>

          {/* Conductors */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-neutral-700">Conductors</label>
              <button
                onClick={addConductor}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                + Add Conductor
              </button>
            </div>
            <div className="space-y-2">
              {conductors.map((conductor, index) => (
                <div key={index} className="flex gap-2 items-center p-2 bg-neutral-50 rounded">
                  <Select
                    label=""
                    options={Object.keys(CONDUCTOR_VOLUMES).map(size => ({
                      value: size,
                      label: `#${size} AWG`,
                    }))}
                    value={conductor.size}
                    onChange={(e) => updateConductor(index, 'size', e.target.value as WireSize)}
                  />
                  <Input
                    label=""
                    type="number"
                    value={conductor.count}
                    onChange={(e) => updateConductor(index, 'count', Number(e.target.value))}
                    min={1}
                    max={20}
                  />
                  <Select
                    label=""
                    options={[
                      { value: 'current-carrying', label: 'Current' },
                      { value: 'equipment-ground', label: 'Ground' },
                      { value: 'pigtail', label: 'Pigtail' },
                    ]}
                    value={conductor.type}
                    onChange={(e) => updateConductor(index, 'type', e.target.value)}
                  />
                  <button
                    onClick={() => removeConductor(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* NEC Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-800 mb-2">NEC 314.16 Requirements</div>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• Each conductor = wire size volume</div>
              <div>• Equipment ground = largest size once</div>
              <div>• Each device = 2× largest conductor</div>
              <div>• Cable clamps = 1× largest conductor</div>
              <div>• Pigtails ≤ 6" don't count</div>
            </div>
          </div>
        

          {/* Calculate Button */}
          <Button onClick={performCalculation} className="w-full">
            <Calculator className="w-4 h-4" />
            Calculate
          </Button>

          {/* Reset Button */}
          <Button variant="secondary" onClick={handleReset} className="w-full">
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Results Column */}
        <div className="space-y-6">
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
                    {result.isCompliant ? 'NEC Compliant' : 'Overfilled'}
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold font-mono ${
                    result.isCompliant ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.fillPercent.toFixed(1)}%
                  </div>
                  <div className="text-sm text-neutral-600">Box Fill</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-neutral-600">Total Volume:</span>
                    <p className="font-mono font-semibold">{result.totalVolume} in³</p>
                  </div>
                  <div>
                    <span className="text-neutral-600">Used Volume:</span>
                    <p className="font-mono font-semibold">{result.usedVolume.toFixed(2)} in³</p>
                  </div>
                  <div>
                    <span className="text-neutral-600">Remaining:</span>
                    <p className="font-mono font-semibold">{result.remainingVolume.toFixed(2)} in³</p>
                  </div>
                  <div>
                    <span className="text-neutral-600">Max #12 AWG:</span>
                    <p className="font-mono font-semibold">{result.maxConductorsAllowed}</p>
                  </div>
                </div>
              </div>

              {/* Volume Breakdown */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Volume Breakdown</div>
                <div className="space-y-2 text-sm">
                  {conductors.map((conductor, index) => {
                    const volume = CONDUCTOR_VOLUMES[conductor.size];
                    const totalVolume = conductor.type === 'equipment-ground' 
                      ? volume 
                      : volume * conductor.count;
                    return (
                      <div key={index} className="flex justify-between">
                        <span className="text-neutral-600">
                          #{conductor.size} {conductor.type} ({conductor.count})
                        </span>
                        <span className="font-mono">{totalVolume.toFixed(2)} in³</span>
                      </div>
                    );
                  })}
                  
                  {(numSwitches > 0 || numReceptacles > 0) && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">
                        Devices ({numSwitches + numReceptacles})
                      </span>
                      <span className="font-mono">
                        {((numSwitches + numReceptacles) * CONDUCTOR_VOLUMES[
                          conductors.reduce((largest, current) => {
                            const currentVolume = CONDUCTOR_VOLUMES[current.size];
                            const largestVolume = CONDUCTOR_VOLUMES[largest];
                            return currentVolume > largestVolume ? current.size : largest;
                          }, '14' as WireSize)
                        ] * 2).toFixed(2)} in³
                      </span>
                    </div>
                  )}

                  {hasClamps && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Cable Clamps</span>
                      <span className="font-mono">
                        {CONDUCTOR_VOLUMES[
                          conductors.reduce((largest, current) => {
                            const currentVolume = CONDUCTOR_VOLUMES[current.size];
                            const largestVolume = CONDUCTOR_VOLUMES[largest];
                            return currentVolume > largestVolume ? current.size : largest;
                          }, '14' as WireSize)
                        ].toFixed(2)} in³
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fill Visualization */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Fill Visualization</div>
                <div className="relative h-8 bg-neutral-200 rounded-lg overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      result.isCompliant
                        ? 'bg-gradient-to-r from-green-400 to-green-600'
                        : 'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ width: `${Math.min(100, result.fillPercent)}%` }}
                  />
                  <div 
                    className="absolute top-0 h-full border-l-2 border-red-500"
                    style={{ left: '100%' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-600 mt-1">
                  <span>0%</span>
                  <span>100% limit</span>
                </div>
              </div>

              {/* Recommendation */}
              <div className={`border rounded-lg p-4 ${
                result.isCompliant 
                  ? result.fillPercent > 90 
                    ? 'bg-amber-50 border-amber-200' 
                    : 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    result.isCompliant 
                      ? result.fillPercent > 90 
                        ? 'text-amber-600' 
                        : 'text-green-600'
                      : 'text-red-600'
                  }`} />
                  <div>
                    <div className={`text-sm font-medium ${
                      result.isCompliant 
                        ? result.fillPercent > 90 
                          ? 'text-amber-800' 
                          : 'text-green-800'
                        : 'text-red-800'
                    }`}>
                      Recommendation
                    </div>
                    <div className={`text-sm mt-1 ${
                      result.isCompliant 
                        ? result.fillPercent > 90 
                          ? 'text-amber-700' 
                          : 'text-green-700'
                        : 'text-red-700'
                    }`}>
                      {result.recommendation}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}