'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Select } from '@/components/ui/Select';
import { VoltageInput } from '@/components/ui/VoltageInput';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { CalculatorResult } from './CalculatorResult';
import { WireComparison } from '@/components/visualizations/WireComparison';
import { calculateWireSize, WireSizeInput, WireSizeResult } from '@/lib/calculations/wire-sizing';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { RefreshCw, Calculator } from 'lucide-react';

const VOLTAGE_OPTIONS = [
  { value: '120', label: '120V' },
  { value: '208', label: '208V' },
  { value: '240', label: '240V' },
  { value: '277', label: '277V' },
  { value: '480', label: '480V' },
];

const PHASE_OPTIONS = [
  { value: 'single', label: 'Single-Phase' },
  { value: 'three', label: 'Three-Phase' },
];

interface WireSizeCalculatorProps {
  enableUrlSharing?: boolean;
}

export function WireSizeCalculator({ enableUrlSharing = true }: WireSizeCalculatorProps) {
  const [inputs, setInputs] = useState<WireSizeInput>({
    amps: 100,
    distance: 100,
    voltage: 240,
    phase: 'single',
  });

  const [copperResult, setCopperResult] = useState<WireSizeResult | null>(null);
  const [aluminumResult, setAluminumResult] = useState<WireSizeResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const shareableInputs = {
    amps: inputs.amps,
    distance: inputs.distance,
    voltage: inputs.voltage,
    phase: inputs.phase,
  };
  const { getShareableUrl } = useShareableUrl(shareableInputs, { enabled: enableUrlSharing });
  const { print } = usePrintExport();

  // Calculate both copper and aluminum
  const performCalculation = useCallback(() => {
    const copperCalc = calculateWireSize({ ...inputs, material: 'copper' });
    const aluminumCalc = calculateWireSize({ ...inputs, material: 'aluminum' });
    setCopperResult(copperCalc);
    setAluminumResult(aluminumCalc);
    setShowResults(true);
    
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
    if (!copperResult || !aluminumResult) return;
    print({
      title: 'Wire Size Calculation',
      inputs: {
        Amperage: `${inputs.amps}A`,
        Distance: `${inputs.distance} ft`,
        Voltage: `${inputs.voltage}V`,
        Phase: inputs.phase,
      },
      results: {
        'Copper Wire': `#${copperResult.awg} AWG`,
        'Copper Ampacity': `${copperResult.ampacity}A`,
        'Copper Voltage Drop': `${copperResult.voltageDropPercent.toFixed(2)}%`,
        'Aluminum Wire': `#${aluminumResult.awg} AWG`,
        'Aluminum Ampacity': `${aluminumResult.ampacity}A`,
        'Aluminum Voltage Drop': `${aluminumResult.voltageDropPercent.toFixed(2)}%`,
        'Ground Wire': `#${copperResult.groundWire} AWG`,
      },
      notes: [...(copperResult.warnings || []), ...(aluminumResult.warnings || [])],
    });
  }, [copperResult, aluminumResult, inputs, print]);

  const handleReset = () => {
    setInputs({
      amps: 100,
      distance: 100,
      voltage: 240,
      phase: 'single',
    });
    setShowResults(false);
  };

  return (
    <CalculatorLayout
      title="Wire Size Calculator"
      description="Calculate the correct AWG wire size for both copper and aluminum conductors"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Amperage Slider */}
            <Slider
              label="Amperage"
              value={inputs.amps}
              onChange={(amps) => setInputs((prev) => ({ ...prev, amps }))}
              min={15}
              max={400}
              step={5}
              suffix="A"
            />

            {/* Distance Slider */}
            <Slider
              label="Distance (one-way)"
              value={inputs.distance}
              onChange={(distance) => setInputs((prev) => ({ ...prev, distance }))}
              min={0}
              max={500}
              step={10}
              suffix=" ft"
            />

            {/* Voltage Input */}
            <VoltageInput
              label="Voltage"
              value={inputs.voltage}
              onChange={(voltage) => setInputs((prev) => ({ ...prev, voltage }))}
              min={1}
              max={1000}
            />

            {/* Phase Select */}
            <Select
              label="Phase"
              options={PHASE_OPTIONS}
              value={inputs.phase}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  phase: e.target.value as 'single' | 'three',
                }))
              }
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
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
        {showResults && (
          <div className="space-y-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold">Calculation Results</h2>
            
            {/* Wire Comparison Visualization */}
            {copperResult && aluminumResult && (
              <WireComparison
                copperAwg={copperResult.awg}
                aluminumAwg={aluminumResult.awg}
                amps={inputs.amps}
              />
            )}

            {/* Results Display for Both Materials */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Copper Result */}
              {copperResult && (
                <div>
                  <h3 className="text-sm font-semibold text-copper-600 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-copper-400 to-copper-600"></div>
                    Copper Wire
                  </h3>
                  <CalculatorResult
                    awg={copperResult.awg}
                    ampacity={copperResult.ampacity}
                    voltageDropPercent={copperResult.voltageDropPercent}
                    groundWire={copperResult.groundWire}
                    material="copper"
                    isCompliant={copperResult.isCompliant}
                    warnings={copperResult.warnings}
                    necReference={copperResult.necReference}
                  />
                </div>
              )}

              {/* Aluminum Result */}
              {aluminumResult && (
                <div>
                  <h3 className="text-sm font-semibold text-aluminum-600 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-aluminum-300 to-aluminum-500"></div>
                    Aluminum Wire
                  </h3>
                  <CalculatorResult
                    awg={aluminumResult.awg}
                    ampacity={aluminumResult.ampacity}
                    voltageDropPercent={aluminumResult.voltageDropPercent}
                    groundWire={aluminumResult.groundWire}
                    material="aluminum"
                    isCompliant={aluminumResult.isCompliant}
                    warnings={aluminumResult.warnings}
                    necReference={aluminumResult.necReference}
                  />
                </div>
              )}
            </div>

            {/* Cost Comparison Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Cost Tip:</strong> Aluminum wire costs 30-50% less than copper but requires larger sizes. 
                Consider installation complexity and connection requirements when choosing.
              </p>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}