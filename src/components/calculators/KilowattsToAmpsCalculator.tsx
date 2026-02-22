'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Zap, Calculator, TrendingUp, RefreshCw } from 'lucide-react';

const VOLTAGE_OPTIONS = [
  { value: '120', label: '120V (Residential)' },
  { value: '208', label: '208V (Commercial)' },
  { value: '240', label: '240V (Residential/Light Commercial)' },
  { value: '277', label: '277V (Commercial Lighting)' },
  { value: '480', label: '480V (Industrial)' },
  { value: '600', label: '600V (Industrial)' },
];

const PHASE_OPTIONS = [
  { value: 'single', label: 'Single-Phase' },
  { value: 'three', label: 'Three-Phase' },
];

const APPLICATION_PRESETS = [
  { name: 'HVAC Unit - 5 Ton', kw: 6, pf: 0.85, phase: 'three', voltage: 480 },
  { name: 'Industrial Motor - 10HP', kw: 7.5, pf: 0.85, phase: 'three', voltage: 480 },
  { name: 'Residential Heat Pump', kw: 4, pf: 0.90, phase: 'single', voltage: 240 },
  { name: 'Commercial Kitchen', kw: 15, pf: 0.95, phase: 'three', voltage: 208 },
  { name: 'Data Center Rack', kw: 10, pf: 0.99, phase: 'single', voltage: 208 },
  { name: 'Manufacturing Equipment', kw: 25, pf: 0.80, phase: 'three', voltage: 480 },
];

interface KilowattResult {
  current: number;
  watts: number;
  kilowatts: number;
  apparentPower: number;
  reactivePower: number;
  powerFactor: number;
  circuitAmps: number;
  breakerSize: number;
}

export function KilowattsToAmpsCalculator() {
  const [kilowatts, setKilowatts] = useState(5);
  const [voltage, setVoltage] = useState(480);
  const [phase, setPhase] = useState<'single' | 'three'>('three');
  const [powerFactor, setPowerFactor] = useState(0.85);
  const [usePreset, setUsePreset] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(APPLICATION_PRESETS[0].name);
  const [result, setResult] = useState<KilowattResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Apply preset values
  const applyPreset = useCallback(() => {
    if (usePreset) {
      const preset = APPLICATION_PRESETS.find(p => p.name === selectedPreset);
      if (preset) {
        setKilowatts(preset.kw);
        setPowerFactor(preset.pf);
        setPhase(preset.phase as 'single' | 'three');
        setVoltage(preset.voltage);
      }
    }
  }, [usePreset, selectedPreset]);

  useEffect(() => {
    applyPreset();
  }, [applyPreset]);

  const calculate = useCallback(() => {
    if (voltage <= 0 || kilowatts <= 0 || powerFactor <= 0) {
      setResult(null);
      return;
    }

    const watts = kilowatts * 1000;
    
    // Calculate current based on phase
    let current: number;
    if (phase === 'single') {
      // Single-phase: I = P / (V × PF)
      current = watts / (voltage * powerFactor);
    } else {
      // Three-phase: I = P / (V × √3 × PF)
      current = watts / (voltage * Math.sqrt(3) * powerFactor);
    }

    // Calculate apparent power (VA)
    const apparentPower = watts / powerFactor;

    // Calculate reactive power (VAR)
    const reactivePower = Math.sqrt(Math.max(0, apparentPower * apparentPower - watts * watts));

    // Calculate circuit amperage (125% for continuous loads)
    const circuitAmps = Math.ceil(current * 1.25);

    // Determine breaker size (next standard size above circuit amps)
    const standardBreakers = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600, 700, 800, 1000, 1200, 1600, 2000];
    const breakerSize = standardBreakers.find(size => size >= circuitAmps) || circuitAmps;

    setResult({
      current: Math.round(current * 100) / 100,
      watts,
      kilowatts,
      apparentPower: Math.round(apparentPower),
      reactivePower: Math.round(reactivePower),
      powerFactor,
      circuitAmps,
      breakerSize,
    });
  }, [voltage, kilowatts, phase, powerFactor]);

  const performCalculation = useCallback(() => {
    calculate();
    setShowResults(true);
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }, [calculate]);

  const handleReset = () => {
    setKilowatts(5);
    setVoltage(480);
    setPhase('three');
    setPowerFactor(0.85);
    setUsePreset(false);
    setShowResults(false);
    setResult(null);
  };

  const shareableInputs: Record<string, string | number | boolean> = {
    kilowatts,
    voltage,
    phase,
    powerFactor,
    usePreset,
    ...(usePreset && { selectedPreset }),
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
      title: 'Kilowatts to Amps Calculation',
      inputs: {
        'Power': `${kilowatts} kW`,
        'Voltage': `${voltage}V`,
        'Phase': phase,
        'Power Factor': powerFactor,
      },
      results: {
        'Load Current': `${result.current}A`,
        'Circuit Current (125%)': `${result.circuitAmps}A`,
        'Breaker Size': `${result.breakerSize}A`,
        'Apparent Power': `${result.apparentPower} VA`,
        'Reactive Power': `${result.reactivePower} VAR`,
      },
    });
  }, [result, kilowatts, voltage, phase, powerFactor, print]);

  return (
    <CalculatorLayout
      title="Kilowatts to Amps Calculator"
      description="Convert kilowatts to amperage for electrical loads and equipment"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="grid lg:grid-cols-2 gap-6 p-6">
        {/* Inputs Column */}
        <div className="space-y-6">
          {/* Preset Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="usePreset"
              checked={usePreset}
              onChange={(e) => setUsePreset(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="usePreset" className="text-sm text-neutral-700">
              Use application preset
            </label>
          </div>

          {usePreset && (
            <Select
              label="Application Preset"
              options={APPLICATION_PRESETS.map(preset => ({
                value: preset.name,
                label: `${preset.name} (${preset.kw} kW)`,
              }))}
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
            />
          )}

          <Input
            label="Power"
            type="number"
            value={kilowatts}
            onChange={(e) => setKilowatts(Number(e.target.value))}
            suffix="kW"
            min={0.1}
            step={0.1}
            disabled={usePreset}
            hint="Power consumption in kilowatts"
          />

          <Select
            label="Voltage"
            options={VOLTAGE_OPTIONS}
            value={String(voltage)}
            onChange={(e) => setVoltage(Number(e.target.value))}
            disabled={usePreset}
          />

          <Select
            label="Phase Configuration"
            options={PHASE_OPTIONS}
            value={phase}
            onChange={(e) => setPhase(e.target.value as 'single' | 'three')}
            disabled={usePreset}
          />

          <Input
            label="Power Factor"
            type="number"
            value={powerFactor}
            onChange={(e) => setPowerFactor(Number(e.target.value))}
            min={0.1}
            max={1}
            step={0.01}
            disabled={usePreset}
            hint="Typical: Motors 0.8-0.9, Heaters 1.0, LED 0.95"
          />

          {/* Formula Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Formula Used</span>
            </div>
            <div className="font-mono text-sm text-blue-700 space-y-1">
              <div>{phase === 'single' 
                ? 'I = (kW × 1000) ÷ (V × PF)'
                : 'I = (kW × 1000) ÷ (V × √3 × PF)'
              }</div>
              <div className="text-xs">Circuit Amps = Load Amps × 1.25</div>
            </div>
          </div>

          {/* Load Categories */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="text-sm font-medium text-neutral-700 mb-2">Typical kW Ranges</div>
            <div className="text-xs text-neutral-600 space-y-1">
              <div>• <strong>Residential:</strong> 1-10 kW (Heat pumps, ranges)</div>
              <div>• <strong>Commercial HVAC:</strong> 5-50 kW</div>
              <div>• <strong>Industrial Motors:</strong> 10-500 kW</div>
              <div>• <strong>Data Centers:</strong> 5-100 kW per rack</div>
              <div>• <strong>Manufacturing:</strong> 25-1000+ kW</div>
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
        <div className="space-y-6" ref={resultsRef}>
          {showResults && result ? (
            <>
              {/* Main Current Result */}
              <div className="text-center p-6 bg-primary-50 rounded-xl border-2 border-primary-200">
                <div className="text-sm text-primary-600 font-medium mb-2">Load Current</div>
                <div className="text-4xl font-bold font-mono text-primary-700">
                  {result.current}
                </div>
                <div className="text-xl font-medium text-primary-600 mt-1">Amps</div>
                <div className="text-sm text-primary-500 mt-2">
                  {phase === 'single' ? 'Single-Phase' : 'Three-Phase'} @ {voltage}V
                </div>
              </div>

              {/* Circuit Requirements */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Circuit Requirements</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-amber-600">Circuit Amperage:</span>
                    <p className="font-mono font-semibold text-lg">{result.circuitAmps}A</p>
                    <p className="text-xs text-amber-600">(125% of load)</p>
                  </div>
                  <div>
                    <span className="text-amber-600">Breaker Size:</span>
                    <p className="font-mono font-semibold text-lg">{result.breakerSize}A</p>
                    <p className="text-xs text-amber-600">(Standard size)</p>
                  </div>
                </div>
              </div>

              {/* Power Analysis */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Power Analysis</div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Real Power (P):</span>
                    <span className="font-mono font-semibold">{result.kilowatts} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Apparent Power (S):</span>
                    <span className="font-mono font-semibold">{(result.apparentPower / 1000).toFixed(1)} kVA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Reactive Power (Q):</span>
                    <span className="font-mono font-semibold">{(result.reactivePower / 1000).toFixed(1)} kVAR</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-300 pt-2">
                    <span className="text-neutral-600">Power Factor:</span>
                    <span className="font-mono font-semibold">{result.powerFactor.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Efficiency Rating */}
              <div className={`border rounded-lg p-4 ${
                result.powerFactor >= 0.95 ? 'bg-green-50 border-green-200' :
                result.powerFactor >= 0.85 ? 'bg-amber-50 border-amber-200' :
                'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`w-4 h-4 ${
                    result.powerFactor >= 0.95 ? 'text-green-600' :
                    result.powerFactor >= 0.85 ? 'text-amber-600' :
                    'text-red-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    result.powerFactor >= 0.95 ? 'text-green-800' :
                    result.powerFactor >= 0.85 ? 'text-amber-800' :
                    'text-red-800'
                  }`}>
                    Power Factor: {
                      result.powerFactor >= 0.95 ? 'Excellent' :
                      result.powerFactor >= 0.85 ? 'Good' :
                      result.powerFactor >= 0.75 ? 'Fair' : 'Poor'
                    }
                  </span>
                </div>
                <div className={`text-sm ${
                  result.powerFactor >= 0.95 ? 'text-green-700' :
                  result.powerFactor >= 0.85 ? 'text-amber-700' :
                  'text-red-700'
                }`}>
                  {result.powerFactor >= 0.95 
                    ? 'Efficient operation with minimal reactive power'
                    : result.powerFactor >= 0.85
                    ? 'Acceptable power factor for most applications'
                    : 'Consider power factor correction to improve efficiency'
                  }
                </div>
              </div>

              {/* Voltage Comparison */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800 mb-3">Current at Different Voltages</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-blue-300">
                        <th className="text-left p-1">Voltage</th>
                        <th className="text-left p-1">Current</th>
                        <th className="text-left p-1">Circuit Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-200">
                      {[120, 208, 240, 480].map(v => {
                        const current = phase === 'single' 
                          ? (result.watts / (v * result.powerFactor))
                          : (result.watts / (v * Math.sqrt(3) * result.powerFactor));
                        const circuitAmps = Math.ceil(current * 1.25);
                        return (
                          <tr key={v} className={voltage === v ? 'bg-blue-100' : ''}>
                            <td className="p-1">{v}V</td>
                            <td className="p-1 font-mono">{current.toFixed(1)}A</td>
                            <td className="p-1 font-mono">{circuitAmps}A</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800 mb-3">Operating Cost Estimate</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">Cost per Hour @ $0.12/kWh:</span>
                    <span className="font-mono font-semibold">${(result.kilowatts * 0.12).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Daily (8 hours):</span>
                    <span className="font-mono font-semibold">${(result.kilowatts * 8 * 0.12).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Monthly (22 days):</span>
                    <span className="font-mono font-semibold">${(result.kilowatts * 8 * 22 * 0.12).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between border-t border-green-200 pt-2">
                    <span className="text-green-600">Annual:</span>
                    <span className="font-mono font-semibold">${(result.kilowatts * 8 * 250 * 0.12).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center">
              <Calculator className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600">Enter power and voltage to calculate current</p>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}