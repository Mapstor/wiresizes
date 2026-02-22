'use client';

import { useState, useEffect, useCallback , useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Shield, AlertTriangle, Calculator, RefreshCw } from 'lucide-react';

// NEC Table 250.122 - Equipment Grounding Conductor sizes
const GROUNDING_CONDUCTOR_TABLE = {
  '15': '14',
  '20': '12',
  '30': '10',
  '40': '10',
  '60': '10',
  '100': '8',
  '200': '6',
  '300': '4',
  '400': '3',
  '500': '2',
  '600': '1',
  '800': '1/0',
  '1000': '2/0',
  '1200': '3/0',
  '1600': '4/0',
  '2000': '250',
  '2500': '350',
  '3000': '400',
  '4000': '500',
  '5000': '700',
  '6000': '800',
} as const;

// Common wire sizes for dropdowns
const PHASE_CONDUCTOR_SIZES = [
  '14', '12', '10', '8', '6', '4', '3', '2', '1',
  '1/0', '2/0', '3/0', '4/0', '250', '300', '350', 
  '400', '500', '600', '750', '1000'
];

const BREAKER_SIZES = [
  '15', '20', '25', '30', '35', '40', '45', '50', '60',
  '70', '80', '90', '100', '110', '125', '150', '175',
  '200', '225', '250', '300', '350', '400', '450', '500',
  '600', '700', '800', '1000', '1200', '1600', '2000',
  '2500', '3000', '4000', '5000', '6000'
];

type CalculationMethod = 'breaker-size' | 'conductor-size';

interface GroundingResult {
  requiredSize: string;
  method: string;
  isUpsized: boolean;
  upsizeReason?: string;
  notes: string[];
  necReference: string;
}

export function GroundWireCalculator() {
  const [method, setMethod] = useState<CalculationMethod>('breaker-size');
  const [breakerSize, setBreakerSize] = useState('20');
  const [conductorSize, setConductorSize] = useState('12');
  const [isUpsized, setIsUpsized] = useState(false);
  const [upsizeRatio, setUpsizeRatio] = useState(1);
  const [installationType, setInstallationType] = useState<'standard' | 'flexible' | 'cord'>('standard');
  const [result, setResult] = useState<GroundingResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const findGroundSize = useCallback((amps: string): string => {
    const ampNumber = parseInt(amps);
    
    // Find the appropriate size from Table 250.122
    for (const [maxAmps, groundSize] of Object.entries(GROUNDING_CONDUCTOR_TABLE)) {
      if (ampNumber <= parseInt(maxAmps)) {
        return groundSize;
      }
    }
    
    // If over 6000A, use engineering supervision required
    return '800';
  }, []);

  const getConductorAmpacity = useCallback((awg: string): number => {
    // Approximate ampacities for 75°C copper conductors (NEC Table 310.16)
    const ampacities: Record<string, number> = {
      '14': 20, '12': 25, '10': 35, '8': 50, '6': 65, '4': 85,
      '3': 100, '2': 115, '1': 130, '1/0': 150, '2/0': 175,
      '3/0': 200, '4/0': 230, '250': 255, '300': 285, '350': 310,
      '400': 335, '500': 380, '600': 420, '750': 475, '1000': 545,
    };
    return ampacities[awg] || 0;
  }, []);

  const calculateGrounding = useCallback(() => {
    let baseGroundSize: string;
    let calculationMethod: string;
    let notes: string[] = [];
    let necRef = 'NEC 250.122';
    
    if (method === 'breaker-size') {
      baseGroundSize = findGroundSize(breakerSize);
      calculationMethod = `Based on ${breakerSize}A overcurrent device`;
    } else {
      // Method is conductor-size
      const conductorAmps = getConductorAmpacity(conductorSize);
      baseGroundSize = findGroundSize(conductorAmps.toString());
      calculationMethod = `Based on #${conductorSize} conductor (${conductorAmps}A)`;
    }

    let finalGroundSize = baseGroundSize;
    let upsizeRequired = false;
    let upsizeReason: string | undefined;

    // Check if phase conductors are upsized
    if (isUpsized && method === 'conductor-size') {
      // When phase conductors are upsized, ground must be proportionally upsized
      // per NEC 250.122(B)
      const originalConductorAmps = getConductorAmpacity(conductorSize) / upsizeRatio;
      const originalGroundSize = findGroundSize(originalConductorAmps.toString());
      
      // Calculate proportional increase needed
      const increaseNeeded = Math.ceil(upsizeRatio);
      
      upsizeRequired = true;
      upsizeReason = `Phase conductors upsized ${upsizeRatio}x for voltage drop`;
      necRef += ', 250.122(B)';
      
      notes.push(`Original ground size: #${originalGroundSize}`);
      notes.push(`Upsize required due to phase conductor upsizing`);
      
      // Apply upsizing logic (simplified - real calculation is more complex)
      const sizeIndex = PHASE_CONDUCTOR_SIZES.indexOf(baseGroundSize);
      if (sizeIndex >= 0 && sizeIndex < PHASE_CONDUCTOR_SIZES.length - increaseNeeded) {
        finalGroundSize = PHASE_CONDUCTOR_SIZES[sizeIndex + increaseNeeded];
      }
    }

    // Add installation-specific notes
    switch (installationType) {
      case 'flexible':
        notes.push('For flexible cord: use stranded conductor');
        notes.push('Maximum length per manufacturer specs');
        break;
      case 'cord':
        notes.push('Equipment grounding conductor must be same gauge as circuit conductors if in same cable');
        necRef += ', 400.23';
        break;
      default:
        notes.push('Standard installation requirements apply');
    }

    // Additional notes
    if (parseInt(breakerSize) > 1200) {
      notes.push('Over 1200A requires engineering supervision');
    }
    
    notes.push('Copper conductor assumed (aluminum requires larger size)');
    notes.push('Size based on 75°C temperature rating');

    setResult({
      requiredSize: finalGroundSize,
      method: calculationMethod,
      isUpsized: upsizeRequired,
      upsizeReason,
      notes,
      necReference: necRef,
    });
  }, [method, breakerSize, conductorSize, isUpsized, upsizeRatio, installationType, findGroundSize, getConductorAmpacity]);

  // Auto-calculation disabled - user must click Calculate button
  // useEffect(() => {
  //   calculateGrounding();
  // }, [calculateGrounding]);

  const performCalculation = useCallback(() => {
    calculateGrounding();
    setShowResults(true);
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }, [calculateGrounding]);

  const handleReset = () => {
    setShowResults(false);
    setMethod('breaker-size');
    setBreakerSize('20');
    setConductorSize('12');
    setIsUpsized(false);
    setUpsizeRatio(1);
    setInstallationType('standard');
    setResult(null);
  };

  const shareableInputs: Record<string, string | number | boolean> = {
    method,
    isUpsized,
    installationType,
    ...(method === 'breaker-size' && { breakerSize }),
    ...(method === 'conductor-size' && { conductorSize }),
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
      title: 'Equipment Grounding Conductor Calculation',
      inputs: {
        'Calculation Method': method === 'breaker-size' ? 'Overcurrent Device' : 'Phase Conductor',
        ...(method === 'breaker-size' 
          ? { 'Breaker Size': `${breakerSize}A` }
          : { 'Conductor Size': `#${conductorSize} AWG` }
        ),
        'Installation Type': installationType,
        'Phase Conductors Upsized': isUpsized ? 'Yes' : 'No',
      },
      results: {
        'Required Ground Wire': `#${result.requiredSize} AWG`,
        'Calculation Method': result.method,
        'NEC Reference': result.necReference,
      },
      notes: result.notes,
    });
  }, [result, method, breakerSize, conductorSize, installationType, isUpsized, print]);

  return (
    <CalculatorLayout
      title="Grounding Conductor Calculator"
      description="Calculate equipment grounding conductor size per NEC 250.122"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="grid lg:grid-cols-2 gap-6 p-6">
        {/* Inputs Column */}
        <div className="space-y-6">
          <Select
            label="Calculation Method"
            options={[
              { value: 'breaker-size', label: 'Based on Overcurrent Device' },
              { value: 'conductor-size', label: 'Based on Phase Conductor' },
            ]}
            value={method}
            onChange={(e) => setMethod(e.target.value as CalculationMethod)}
          />

          {method === 'breaker-size' ? (
            <Select
              label="Overcurrent Device Rating"
              options={BREAKER_SIZES.map(size => ({
                value: size,
                label: `${size}A`,
              }))}
              value={breakerSize}
              onChange={(e) => setBreakerSize(e.target.value)}
            />
          ) : (
            <Select
              label="Phase Conductor Size"
              options={PHASE_CONDUCTOR_SIZES.map(size => ({
                value: size,
                label: `#${size} AWG`,
              }))}
              value={conductorSize}
              onChange={(e) => setConductorSize(e.target.value)}
            />
          )}

          <Select
            label="Installation Type"
            options={[
              { value: 'standard', label: 'Standard Installation' },
              { value: 'flexible', label: 'Flexible Cord' },
              { value: 'cord', label: 'Equipment Cord' },
            ]}
            value={installationType}
            onChange={(e) => setInstallationType(e.target.value as any)}
          />

          {method === 'conductor-size' && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="upsized"
                  checked={isUpsized}
                  onChange={(e) => setIsUpsized(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="upsized" className="text-sm text-neutral-700">
                  Phase conductors upsized for voltage drop
                </label>
              </div>

              {isUpsized && (
                <Input
                  label="Upsize Ratio"
                  type="number"
                  value={upsizeRatio}
                  onChange={(e) => setUpsizeRatio(Number(e.target.value))}
                  min={1}
                  max={4}
                  step={0.1}
                  hint="How many times larger than minimum required"
                />
              )}
            </>
          )}

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
              <div>• Must be copper unless specifically allowed</div>
              <div>• Continuous path to ground required</div>
              <div>• Size increases if phase conductors upsized</div>
              <div>• Minimum #14 AWG for branch circuits</div>
            </div>
          </div>

          {/* Calculate Button */}
          <Button onClick={performCalculation} className="w-full">
            <Calculator className="w-4 h-4" />
            Calculate Ground Wire Size
          </Button>

          {/* Reset Button */}
          <Button variant="secondary" onClick={handleReset} className="w-full">
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Results Column */}
        <div className="space-y-6" ref={resultsRef}>
          {showResults && result && (
            <>
              {/* Main Result */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Equipment Grounding Conductor</span>
                </div>

                <div className="text-center mb-4">
                  <div className="text-4xl font-bold font-mono text-green-700">
                    #{result.requiredSize}
                  </div>
                  <div className="text-xl font-medium text-green-600 mt-1">AWG</div>
                  <div className="text-sm text-neutral-600 mt-2">{result.method}</div>
                </div>

                {result.isUpsized && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <div className="text-sm font-medium text-amber-800">Upsized Required</div>
                    <div className="text-sm text-amber-700">{result.upsizeReason}</div>
                  </div>
                )}
              </div>

              {/* Table 250.122 Reference */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">
                  NEC Table 250.122 (Partial)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-neutral-300">
                        <th className="text-left p-2">Overcurrent Device</th>
                        <th className="text-left p-2">Ground Wire</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {Object.entries(GROUNDING_CONDUCTOR_TABLE).slice(0, 8).map(([amps, wire]) => (
                        <tr 
                          key={amps} 
                          className={`${
                            (method === 'breaker-size' && breakerSize === amps) ||
                            result.requiredSize === wire
                              ? 'bg-green-100' 
                              : ''
                          }`}
                        >
                          <td className="p-2">{amps}A</td>
                          <td className="p-2 font-mono">#{wire} AWG</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Installation Notes */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Installation Notes</div>
                <div className="space-y-2">
                  {result.notes.map((note, index) => (
                    <div key={index} className="text-sm text-neutral-600 flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wire Comparison */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800 mb-3">Wire Size Comparison</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">
                      {method === 'breaker-size' ? 'Breaker Rating:' : 'Phase Conductor:'}
                    </span>
                    <p className="font-mono font-semibold">
                      {method === 'breaker-size' ? `${breakerSize}A` : `#${conductorSize} AWG`}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-600">Ground Conductor:</span>
                    <p className="font-mono font-semibold">#{result.requiredSize} AWG</p>
                  </div>
                </div>
              </div>

              {/* NEC Reference */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-2">Code Reference</div>
                <div className="text-sm text-neutral-600">{result.necReference}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}