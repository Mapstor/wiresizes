'use client';

import { useState, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { CalculatorResult } from './CalculatorResult';
import { WireComparison } from '@/components/visualizations/WireComparison';
import { calculateWireSize, WireSizeInput, WireSizeResult } from '@/lib/calculations/wire-sizing';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Calculator, RefreshCw } from 'lucide-react';

export function WattsToAmpsCalculator() {
  const [watts, setWatts] = useState(1000);
  const [voltage, setVoltage] = useState(120);
  const [phase, setPhase] = useState<'single' | 'three'>('single');
  const [powerFactor, setPowerFactor] = useState(1);
  const [distance, setDistance] = useState(50);
  const [amps, setAmps] = useState(0);
  const [copperResult, setCopperResult] = useState<WireSizeResult | null>(null);
  const [aluminumResult, setAluminumResult] = useState<WireSizeResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const performCalculation = useCallback(() => {
    // Single phase: I = P / (V × PF)
    // Three phase: I = P / (V × √3 × PF)
    const multiplier = phase === 'single' ? 1 : Math.sqrt(3);
    const calculated = watts / (voltage * multiplier * powerFactor);
    const calculatedAmps = Math.round(calculated * 100) / 100;
    setAmps(calculatedAmps);

    if (calculatedAmps > 0) {
      const wireInputs: WireSizeInput = {
        amps: Math.ceil(calculatedAmps * 1.25), // Apply 125% for continuous loads
        distance,
        voltage: voltage as 120 | 208 | 240 | 277 | 480,
        phase,
        material: 'copper',
      };
      
      const copperCalc = calculateWireSize({ ...wireInputs, material: 'copper' });
      const aluminumCalc = calculateWireSize({ ...wireInputs, material: 'aluminum' });
      
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
    }
  }, [watts, voltage, phase, powerFactor, distance]);

  const handleReset = () => {
    setWatts(1000);
    setVoltage(120);
    setPhase('single');
    setPowerFactor(1);
    setDistance(50);
    setShowResults(false);
    setAmps(0);
    setCopperResult(null);
    setAluminumResult(null);
  };

  const shareableInputs = {
    watts,
    voltage,
    phase,
    powerFactor,
    distance,
  };
  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!copperResult || !aluminumResult) return;
    print({
      title: 'Watts to Amps Calculation',
      inputs: {
        Power: `${watts}W`,
        Voltage: `${voltage}V`,
        Phase: phase,
        'Power Factor': powerFactor,
        'Calculated Amps': `${amps}A`,
        Distance: `${distance} ft`,
      },
      results: {
        'Copper Wire': `#${copperResult.awg} AWG`,
        'Copper Ampacity': `${copperResult.ampacity}A`,
        'Aluminum Wire': `#${aluminumResult.awg} AWG`,
        'Aluminum Ampacity': `${aluminumResult.ampacity}A`,
      },
    });
  }, [copperResult, aluminumResult, watts, voltage, phase, powerFactor, amps, distance, print]);

  return (
    <CalculatorLayout
      title="Watts to Amps Calculator"
      description="Convert watts to amps and find the correct wire size for both copper and aluminum"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Power (Watts)"
            type="number"
            value={watts}
            onChange={(e) => setWatts(Number(e.target.value))}
            suffix="W"
          />
          <Select
            label="Voltage"
            options={[
              { value: '120', label: '120V' },
              { value: '208', label: '208V' },
              { value: '240', label: '240V' },
              { value: '277', label: '277V' },
              { value: '480', label: '480V' },
            ]}
            value={String(voltage)}
            onChange={(e) => setVoltage(Number(e.target.value))}
          />
          <Select
            label="Phase"
            options={[
              { value: 'single', label: 'Single-Phase' },
              { value: 'three', label: 'Three-Phase' },
            ]}
            value={phase}
            onChange={(e) => setPhase(e.target.value as 'single' | 'three')}
          />
          <Input
            label="Power Factor"
            type="number"
            value={powerFactor}
            onChange={(e) => setPowerFactor(Number(e.target.value))}
            hint="1.0 for resistive loads, 0.8-0.9 for motors"
            min={0.1}
            max={1}
            step={0.1}
          />
          
          {/* Distance Slider for Wire Sizing */}
          <Slider
            label="Distance (for wire sizing)"
            value={distance}
            onChange={setDistance}
            min={0}
            max={500}
            step={10}
            suffix=" ft"
          />

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
        {showResults && (
          <div className="space-y-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold">Calculation Results</h2>
            {/* Amps Result */}
            <div className="text-center p-6 bg-primary-50 rounded-xl border-2 border-primary-200">
              <div className="text-sm text-primary-600 font-medium mb-2">Calculated Current</div>
              <div className="text-2xl sm:text-4xl font-bold font-mono text-primary-700 break-words min-w-0">
                {amps.toFixed(2)}
              </div>
              <div className="text-xl font-medium text-primary-600 mt-1">Amps</div>
              {amps > 0 && (
                <div className="text-sm text-primary-500 mt-3">
                  Wire sized for {(amps * 1.25).toFixed(1)}A (125% continuous load)
                </div>
              )}
            </div>
          )}

            {/* Wire Comparison Visualization */}
            {copperResult && aluminumResult && (
            <WireComparison
              copperAwg={copperResult.awg}
              aluminumAwg={aluminumResult.awg}
              amps={Math.ceil(amps * 1.25)}
            />
          )}

            {/* Wire Size Results */}
            {copperResult && aluminumResult && (
            <div className="grid gap-4">
              {/* Copper Result */}
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

              {/* Aluminum Result */}
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
            </div>
            )}
          </div>
        )}
    </CalculatorLayout>
  );
}