'use client';

import { useState, useEffect, useCallback , useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Thermometer, Zap, Clock , Calculator, RefreshCw } from 'lucide-react';

const TIME_UNITS = [
  { value: 'hour', label: 'BTU/hr', multiplier: 1 },
  { value: 'minute', label: 'BTU/min', multiplier: 60 },
  { value: 'second', label: 'BTU/sec', multiplier: 3600 },
];

const EQUIPMENT_PRESETS = [
  { name: 'Window AC Unit - 5,000 BTU/hr', btu: 5000, timeUnit: 'hour' },
  { name: 'Window AC Unit - 12,000 BTU/hr', btu: 12000, timeUnit: 'hour' },
  { name: 'Central AC Unit - 24,000 BTU/hr', btu: 24000, timeUnit: 'hour' },
  { name: 'Central AC Unit - 36,000 BTU/hr', btu: 36000, timeUnit: 'hour' },
  { name: 'Heat Pump - 48,000 BTU/hr', btu: 48000, timeUnit: 'hour' },
  { name: 'Furnace - 60,000 BTU/hr', btu: 60000, timeUnit: 'hour' },
  { name: 'Furnace - 80,000 BTU/hr', btu: 80000, timeUnit: 'hour' },
  { name: 'Furnace - 100,000 BTU/hr', btu: 100000, timeUnit: 'hour' },
  { name: 'Boiler - 120,000 BTU/hr', btu: 120000, timeUnit: 'hour' },
  { name: 'Commercial HVAC - 200,000 BTU/hr', btu: 200000, timeUnit: 'hour' },
];

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

interface BTUResult {
  watts: number;
  kilowatts: number;
  btuPerHour: number;
  tons: number;
  current: number;
  powerCost: {
    hourly: number;
    daily: number;
    monthly: number;
    annual: number;
  };
}

export function BTUToWattsCalculator() {
  const [btu, setBtu] = useState(24000);
  const [timeUnit, setTimeUnit] = useState('hour');
  const [efficiency, setEfficiency] = useState(100);
  const [voltage, setVoltage] = useState(240);
  const [phase, setPhase] = useState<'single' | 'three'>('single');
  const [powerFactor, setPowerFactor] = useState(0.95);
  const [electricityRate, setElectricityRate] = useState(0.12);
  const [usePreset, setUsePreset] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(EQUIPMENT_PRESETS[0].name);
  const [result, setResult] = useState<BTUResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Apply preset values
  const applyPreset = useCallback(() => {
    if (usePreset) {
      const preset = EQUIPMENT_PRESETS.find(p => p.name === selectedPreset);
      if (preset) {
        setBtu(preset.btu);
        setTimeUnit(preset.timeUnit);
      }
    }
  }, [usePreset, selectedPreset]);

  useEffect(() => {
    applyPreset();
  }, [applyPreset]);

  const calculate = useCallback(() => {
    if (btu <= 0 || efficiency <= 0) {
      setResult(null);
      return;
    }

    // Convert to BTU/hr if needed
    const timeMultiplier = TIME_UNITS.find(unit => unit.value === timeUnit)?.multiplier || 1;
    const btuPerHour = btu * timeMultiplier;

    // Convert BTU/hr to watts
    // 1 BTU/hr = 0.293071 watts (thermal watts)
    const thermalWatts = btuPerHour * 0.293071;

    // Account for efficiency (electrical input = thermal output / efficiency)
    const electricalWatts = thermalWatts / (efficiency / 100);

    const kilowatts = electricalWatts / 1000;

    // Convert to refrigeration tons (1 ton = 12,000 BTU/hr cooling)
    const tons = btuPerHour / 12000;

    // Calculate electrical current
    let current: number;
    if (phase === 'single') {
      current = electricalWatts / (voltage * powerFactor);
    } else {
      current = electricalWatts / (voltage * Math.sqrt(3) * powerFactor);
    }

    // Calculate power costs
    const powerCost = {
      hourly: kilowatts * electricityRate,
      daily: kilowatts * 24 * electricityRate,
      monthly: kilowatts * 24 * 30 * electricityRate,
      annual: kilowatts * 24 * 365 * electricityRate,
    };

    setResult({
      watts: Math.round(electricalWatts),
      kilowatts: Math.round(kilowatts * 1000) / 1000,
      btuPerHour,
      tons: Math.round(tons * 100) / 100,
      current: Math.round(current * 100) / 100,
      powerCost,
    });
  }, [btu, timeUnit, efficiency, voltage, phase, powerFactor, electricityRate]);

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
    setShowResults(false);
    // Reset form fields as needed
  };

  // Auto-calculation disabled - user must click Calculate button
  // useEffect(() => {
  //   calculate();
  // }, [calculate]);

  const shareableInputs: Record<string, string | number | boolean> = {
    btu,
    timeUnit,
    efficiency,
    voltage,
    phase,
    powerFactor,
    electricityRate,
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
      title: 'BTU to Watts Calculation',
      inputs: {
        'BTU Rating': `${btu.toLocaleString()} BTU/${timeUnit}`,
        'Efficiency': `${efficiency}%`,
        'Voltage': `${voltage}V`,
        'Phase': phase,
        'Power Factor': powerFactor,
      },
      results: {
        'Electrical Power': `${result.watts.toLocaleString()}W (${result.kilowatts} kW)`,
        'BTU/Hour': `${result.btuPerHour.toLocaleString()} BTU/hr`,
        'Refrigeration Tons': result.tons,
        'Current Draw': `${result.current}A`,
        'Annual Operating Cost': `$${result.powerCost.annual.toFixed(0)}`,
      },
    });
  }, [result, btu, timeUnit, efficiency, voltage, phase, powerFactor, print]);

  return (
    <CalculatorLayout
      title="BTU to Watts Calculator"
      description="Convert BTU ratings to electrical power requirements"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
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
              Use equipment preset
            </label>
          </div>

          {usePreset && (
            <Select
              label="Equipment Preset"
              options={EQUIPMENT_PRESETS.map(preset => ({
                value: preset.name,
                label: preset.name,
              }))}
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
            />
          )}

          <Input
            label="BTU Rating"
            type="number"
            value={btu}
            onChange={(e) => setBtu(Number(e.target.value))}
            min={100}
            step={100}
            disabled={usePreset}
            hint="Thermal energy rating"
          />

          <Select
            label="Time Unit"
            options={TIME_UNITS.map(unit => ({
              value: unit.value,
              label: unit.label,
            }))}
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value)}
            disabled={usePreset}
          />

          <Input
            label="Efficiency"
            type="number"
            value={efficiency}
            onChange={(e) => setEfficiency(Number(e.target.value))}
            suffix="%"
            min={0}
            max={400}
            step={1}
            hint="Equipment efficiency: Heat pumps 300-400%, Furnaces 80-98%"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Voltage"
              options={VOLTAGE_OPTIONS}
              value={String(voltage)}
              onChange={(e) => setVoltage(Number(e.target.value))}
            />

            <Select
              label="Phase"
              options={PHASE_OPTIONS}
              value={phase}
              onChange={(e) => setPhase(e.target.value as 'single' | 'three')}
            />
          </div>

          <Input
            label="Power Factor"
            type="number"
            value={powerFactor}
            onChange={(e) => setPowerFactor(Number(e.target.value))}
            min={0.5}
            max={1}
            step={0.01}
            hint="Typical: 0.95 for modern equipment"
          />

          <Input
            label="Electricity Rate"
            type="number"
            value={electricityRate}
            onChange={(e) => setElectricityRate(Number(e.target.value))}
            suffix="$/kWh"
            min={0.01}
            max={1}
            step={0.01}
            hint="Your local electricity rate"
          />

          {/* Conversion Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">BTU Conversion</span>
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• 1 BTU/hr = 0.293 Watts (thermal)</div>
              <div>• 1 Ton cooling = 12,000 BTU/hr</div>
              <div>• 1 kW = 3,412 BTU/hr</div>
              <div>• Efficiency affects electrical input</div>
            </div>
          </div>

          {/* Equipment Efficiency Guide */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="text-sm font-medium text-neutral-700 mb-2">Typical Efficiencies</div>
            <div className="text-xs text-neutral-600 space-y-1">
              <div>• <strong>Electric Resistance:</strong> 100% (1:1 conversion)</div>
              <div>• <strong>Gas Furnace:</strong> 80-98% (combustion efficiency)</div>
              <div>• <strong>Heat Pump (heating):</strong> 250-400% (COP 2.5-4.0)</div>
              <div>• <strong>Air Conditioner:</strong> 300-500% (EER 10-17)</div>
              <div>• <strong>Boiler:</strong> 85-95% (combustion efficiency)</div>
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
              {/* Main Power Result */}
              <div className="text-center p-6 bg-primary-50 rounded-xl border-2 border-primary-200">
                <div className="text-sm text-primary-600 font-medium mb-2">Electrical Power Required</div>
                <div className="text-2xl sm:text-4xl font-bold font-mono text-primary-700 break-words min-w-0">
                  {result.kilowatts}
                </div>
                <div className="text-xl font-medium text-primary-600 mt-1">kW</div>
                <div className="text-lg font-mono text-primary-600 mt-2">
                  {result.watts.toLocaleString()} Watts
                </div>
              </div>

              {/* BTU Analysis */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Thermometer className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Thermal Analysis</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-orange-600">BTU/Hour:</span>
                    <p className="font-mono font-semibold text-sm sm:text-lg break-words">{result.btuPerHour.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-orange-600">Cooling Tons:</span>
                    <p className="font-mono font-semibold text-sm sm:text-lg break-words">{result.tons}</p>
                  </div>
                  <div>
                    <span className="text-orange-600">Efficiency:</span>
                    <p className="font-mono font-semibold text-sm sm:text-lg break-words">{efficiency}%</p>
                  </div>
                  <div>
                    <span className="text-orange-600">Thermal Watts:</span>
                    <p className="font-mono font-semibold text-sm sm:text-lg break-words">
                      {Math.round(result.btuPerHour * 0.293071).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Electrical Requirements */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Electrical Requirements</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-600">Current Draw:</span>
                    <span className="font-mono font-semibold">{result.current}A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-600">Circuit Size (125%):</span>
                    <span className="font-mono font-semibold">{Math.ceil(result.current * 1.25)}A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-600">Voltage/Phase:</span>
                    <span className="font-mono font-semibold">{voltage}V {phase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-600">Power Factor:</span>
                    <span className="font-mono font-semibold">{powerFactor}</span>
                  </div>
                </div>
              </div>

              {/* Operating Costs */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Operating Costs</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">Per Hour:</span>
                    <span className="font-mono font-semibold">${result.powerCost.hourly.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Per Day (24 hrs):</span>
                    <span className="font-mono font-semibold">${result.powerCost.daily.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Per Month:</span>
                    <span className="font-mono font-semibold">${result.powerCost.monthly.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between border-t border-green-200 pt-2">
                    <span className="text-green-600">Annual:</span>
                    <span className="font-mono font-semibold">${result.powerCost.annual.toFixed(0)}</span>
                  </div>
                </div>
                <div className="text-xs text-green-600 mt-2">
                  @ ${electricityRate}/kWh electricity rate
                </div>
              </div>

              {/* Comparison Table */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Common Equipment Comparison</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-neutral-300">
                        <th className="text-left p-1">Equipment</th>
                        <th className="text-left p-1">BTU/hr</th>
                        <th className="text-left p-1">kW</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr className={result.btuPerHour >= 5000 && result.btuPerHour <= 6000 ? 'bg-primary-100' : ''}>
                        <td className="p-1">Small Window AC</td>
                        <td className="p-1">5,000</td>
                        <td className="p-1">1.5</td>
                      </tr>
                      <tr className={result.btuPerHour >= 12000 && result.btuPerHour <= 15000 ? 'bg-primary-100' : ''}>
                        <td className="p-1">Large Window AC</td>
                        <td className="p-1">12,000</td>
                        <td className="p-1">3.5</td>
                      </tr>
                      <tr className={result.btuPerHour >= 24000 && result.btuPerHour <= 30000 ? 'bg-primary-100' : ''}>
                        <td className="p-1">Central AC (2 ton)</td>
                        <td className="p-1">24,000</td>
                        <td className="p-1">7.0</td>
                      </tr>
                      <tr className={result.btuPerHour >= 36000 && result.btuPerHour <= 42000 ? 'bg-primary-100' : ''}>
                        <td className="p-1">Central AC (3 ton)</td>
                        <td className="p-1">36,000</td>
                        <td className="p-1">10.5</td>
                      </tr>
                      <tr className={result.btuPerHour >= 60000 && result.btuPerHour <= 80000 ? 'bg-primary-100' : ''}>
                        <td className="p-1">Furnace</td>
                        <td className="p-1">60,000-80,000</td>
                        <td className="p-1">20-25</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Efficiency Impact */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800 mb-3">Efficiency Impact</div>
                <div className="text-sm text-blue-700">
                  {efficiency > 100 ? (
                    <div>
                      <strong>Heat Pump Operation:</strong> For every 1 kW of electrical input, 
                      this equipment provides {(efficiency / 100).toFixed(1)} kW of heating/cooling output.
                      This is {((efficiency - 100) / 100 * result.kilowatts).toFixed(1)} kW more than direct electric resistance.
                    </div>
                  ) : (
                    <div>
                      <strong>Combustion Equipment:</strong> {(100 - efficiency).toFixed(0)}% of the fuel energy 
                      is lost through exhaust and inefficiencies. Only {efficiency}% becomes useful heat.
                    </div>
                  )}
                </div>
              </div>
          </div>
        )}
        
        {/* No Results Placeholder */}
        {!showResults && (
          <div className="space-y-6">
            <div className="bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center">
              <Thermometer className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600">Enter BTU rating to calculate power requirements</p>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}