'use client';

import { useState, useEffect, useCallback , useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { CalculatorLayout } from './CalculatorLayout';
import { CalculatorResult } from './CalculatorResult';
import { WireComparison } from '@/components/visualizations/WireComparison';
import { calculateWireSize, WireSizeInput, WireSizeResult, VoltageLevel } from '@/lib/calculations/wire-sizing';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Zap, AlertTriangle, Wrench , Calculator, RefreshCw } from 'lucide-react';

// NEC Table 630.11(A) - Arc Welders with Motor-Generator Sets
const WELDER_TYPES = {
  'arc-transformer': 'Transformer Arc Welder',
  'arc-rectifier': 'Rectifier Arc Welder',
  'motor-generator': 'Motor-Generator Arc Welder',
  'resistance': 'Resistance Welder',
  'tig': 'TIG Welder',
  'mig': 'MIG/MAG Welder',
  'stick': 'Stick/SMAW Welder',
  'plasma': 'Plasma Cutter',
} as const;

const VOLTAGE_OPTIONS = [
  { value: '208', label: '208V' },
  { value: '240', label: '240V' },
  { value: '480', label: '480V' },
  { value: '575', label: '575V' },
];

const PHASE_OPTIONS = [
  { value: 'single', label: 'Single-Phase' },
  { value: 'three', label: 'Three-Phase' },
];

const WELDER_PRESETS = [
  { name: 'Lincoln Ranger 225', type: 'motor-generator', kva: 11.5, voltage: 240, phase: 'single', dutyCycle: 60 },
  { name: 'Miller Syncrowave 200', type: 'tig', kva: 7.8, voltage: 208, phase: 'single', dutyCycle: 60 },
  { name: 'Miller XMT 350', type: 'arc-rectifier', kva: 18.2, voltage: 480, phase: 'three', dutyCycle: 100 },
  { name: 'Lincoln PowerWave 455M', type: 'mig', kva: 23.5, voltage: 480, phase: 'three', dutyCycle: 60 },
  { name: 'ESAB Rebel EMP 215ic', type: 'mig', kva: 5.9, voltage: 240, phase: 'single', dutyCycle: 30 },
  { name: 'Hypertherm Powermax85', type: 'plasma', kva: 12.0, voltage: 208, phase: 'single', dutyCycle: 100 },
  { name: 'Resistance Spot Welder', type: 'resistance', kva: 75, voltage: 480, phase: 'three', dutyCycle: 50 },
];

type WelderType = keyof typeof WELDER_TYPES;

interface WelderResult {
  inputCurrent: number;
  effectiveCurrent: number;
  kva: number;
  dutyCycle: number;
  welderType: WelderType;
  copperWire: WireSizeResult;
  aluminumWire: WireSizeResult;
  multipleFactor: number;
  necReference: string;
}

export function WelderCalculator() {
  const [welderType, setWelderType] = useState<WelderType>('arc-transformer');
  const [kva, setKva] = useState(15);
  const [voltage, setVoltage] = useState(240);
  const [phase, setPhase] = useState<'single' | 'three'>('single');
  const [dutyCycle, setDutyCycle] = useState(60);
  const [distance, setDistance] = useState(50);
  const [usePreset, setUsePreset] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(WELDER_PRESETS[0].name);
  const [result, setResult] = useState<WelderResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Apply preset values
  const applyPreset = useCallback(() => {
    if (usePreset) {
      const preset = WELDER_PRESETS.find(p => p.name === selectedPreset);
      if (preset) {
        setWelderType(preset.type as WelderType);
        setKva(preset.kva);
        setVoltage(preset.voltage);
        setPhase(preset.phase as 'single' | 'three');
        setDutyCycle(preset.dutyCycle);
      }
    }
  }, [usePreset, selectedPreset]);

  useEffect(() => {
    applyPreset();
  }, [applyPreset]);

  const calculate = useCallback(() => {
    if (kva <= 0 || voltage <= 0 || dutyCycle <= 0) {
      setResult(null);
      return;
    }

    // Calculate input current from kVA
    let inputCurrent: number;
    if (phase === 'single') {
      inputCurrent = (kva * 1000) / voltage;
    } else {
      inputCurrent = (kva * 1000) / (voltage * Math.sqrt(3));
    }

    // Calculate multiplier based on welder type and duty cycle (NEC 630.11)
    let multipleFactor: number;
    let necReference = 'NEC 630.11';

    switch (welderType) {
      case 'arc-transformer':
      case 'arc-rectifier':
        // Arc welders: Table 630.11(A)
        if (dutyCycle <= 20) multipleFactor = 0.45;
        else if (dutyCycle <= 30) multipleFactor = 0.55;
        else if (dutyCycle <= 40) multipleFactor = 0.63;
        else if (dutyCycle <= 50) multipleFactor = 0.71;
        else if (dutyCycle <= 60) multipleFactor = 0.78;
        else if (dutyCycle <= 70) multipleFactor = 0.84;
        else if (dutyCycle <= 80) multipleFactor = 0.89;
        else if (dutyCycle <= 90) multipleFactor = 0.95;
        else multipleFactor = 1.0;
        necReference = 'NEC 630.11(A)';
        break;

      case 'motor-generator':
        // Motor-generator sets: 630.12
        multipleFactor = 1.0; // Use full nameplate current
        necReference = 'NEC 630.12';
        break;

      case 'resistance':
        // Resistance welders: 630.31
        if (dutyCycle <= 50) multipleFactor = 0.7;
        else multipleFactor = 1.0;
        necReference = 'NEC 630.31';
        break;

      case 'tig':
      case 'mig':
      case 'stick':
        // Modern inverter-based welders (treat as arc welders)
        if (dutyCycle <= 20) multipleFactor = 0.45;
        else if (dutyCycle <= 30) multipleFactor = 0.55;
        else if (dutyCycle <= 40) multipleFactor = 0.63;
        else if (dutyCycle <= 50) multipleFactor = 0.71;
        else if (dutyCycle <= 60) multipleFactor = 0.78;
        else if (dutyCycle <= 70) multipleFactor = 0.84;
        else if (dutyCycle <= 80) multipleFactor = 0.89;
        else if (dutyCycle <= 90) multipleFactor = 0.95;
        else multipleFactor = 1.0;
        necReference = 'NEC 630.11(A)';
        break;

      case 'plasma':
        // Plasma cutters typically 100% duty cycle
        multipleFactor = 1.0;
        necReference = 'NEC 630.11(A)';
        break;

      default:
        multipleFactor = 1.0;
    }

    // Calculate effective current for conductor sizing
    const effectiveCurrent = inputCurrent * multipleFactor;

    // Calculate wire sizes for both materials
    const wireInputs: WireSizeInput = {
      amps: effectiveCurrent,
      distance,
      voltage: voltage === 575 ? 480 : (voltage as VoltageLevel),
      phase,
      material: 'copper',
    };

    const copperWire = calculateWireSize({ ...wireInputs, material: 'copper' });
    const aluminumWire = calculateWireSize({ ...wireInputs, material: 'aluminum' });

    setResult({
      inputCurrent: Math.round(inputCurrent * 100) / 100,
      effectiveCurrent: Math.round(effectiveCurrent * 100) / 100,
      kva,
      dutyCycle,
      welderType,
      copperWire,
      aluminumWire,
      multipleFactor,
      necReference,
    });
  }, [welderType, kva, voltage, phase, dutyCycle, distance]);

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

  const shareableInputs = {
    welderType,
    kva,
    voltage,
    phase,
    dutyCycle,
    distance,
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
      title: 'Welder Circuit Calculation',
      inputs: {
        'Welder Type': WELDER_TYPES[welderType],
        'kVA Rating': `${kva} kVA`,
        'Voltage': `${voltage}V`,
        'Phase': phase,
        'Duty Cycle': `${dutyCycle}%`,
        'Distance': `${distance} ft`,
      },
      results: {
        'Input Current': `${result.inputCurrent}A`,
        'Effective Current': `${result.effectiveCurrent}A`,
        'Copper Wire': `#${result.copperWire.awg} AWG`,
        'Aluminum Wire': `#${result.aluminumWire.awg} AWG`,
        'NEC Reference': result.necReference,
      },
    });
  }, [result, welderType, kva, voltage, phase, dutyCycle, distance, print]);

  return (
    <CalculatorLayout
      title="Welder Calculator"
      description="Calculate wire size and circuit requirements for welding equipment"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Input Parameters */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Input Parameters</h2>
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
              Use welder preset
            </label>
          </div>

          {usePreset && (
            <Select
              label="Welder Preset"
              options={WELDER_PRESETS.map(preset => ({
                value: preset.name,
                label: `${preset.name} (${preset.kva} kVA)`,
              }))}
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
            />
          )}

          <Select
            label="Welder Type"
            options={Object.entries(WELDER_TYPES).map(([key, label]) => ({
              value: key,
              label,
            }))}
            value={welderType}
            onChange={(e) => setWelderType(e.target.value as WelderType)}
            disabled={usePreset}
          />

          <Input
            label="kVA Rating"
            type="number"
            value={kva}
            onChange={(e) => setKva(Number(e.target.value))}
            suffix="kVA"
            min={1}
            step={0.1}
            disabled={usePreset}
            hint="Nameplate kVA rating"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Voltage"
              options={VOLTAGE_OPTIONS}
              value={String(voltage)}
              onChange={(e) => setVoltage(Number(e.target.value))}
              disabled={usePreset}
            />

            <Select
              label="Phase"
              options={PHASE_OPTIONS}
              value={phase}
              onChange={(e) => setPhase(e.target.value as 'single' | 'three')}
              disabled={usePreset}
            />
          </div>

          <Input
            label="Duty Cycle"
            type="number"
            value={dutyCycle}
            onChange={(e) => setDutyCycle(Number(e.target.value))}
            suffix="%"
            min={0}
            max={100}
            step={5}
            disabled={usePreset}
            hint="Percentage of time welder operates at rated capacity"
          />

          <Input
            label="Distance from Panel"
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            suffix="ft"
            min={0}
            max={500}
            step={10}
            hint="One-way distance for voltage drop calculation"
          />

          {/* Safety Information */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-red-800">Safety Requirements</div>
                <div className="text-sm text-red-700 mt-1 space-y-1">
                  <div>• GFCI protection may be required (NEC 630.12)</div>
                  <div>• Disconnect required within sight of welder</div>
                  <div>• Proper grounding and bonding essential</div>
                  <div>• Consider arc flash protection requirements</div>
                </div>
              </div>
            </div>
          </div>

          {/* NEC Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Wrench className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-blue-800">NEC 630 - Electric Welders</div>
                <div className="text-sm text-blue-700 mt-1 space-y-1">
                  <div>• Conductors sized based on effective current</div>
                  <div>• Duty cycle determines multiplier factor</div>
                  <div>• Different rules for different welder types</div>
                  <div>• Motor-generators use full nameplate current</div>
                </div>
              </div>
            </div>
          </div>
        

          </div>
          
          {/* Calculate and Reset Buttons */}
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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Calculation Results</h2>
            <div className="space-y-6">
              {/* Current Analysis */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Current Analysis</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-amber-600">Input Current:</span>
                    <p className="font-mono font-semibold text-lg">{result.inputCurrent}A</p>
                    <p className="text-xs text-amber-600">(Nameplate)</p>
                  </div>
                  <div>
                    <span className="text-amber-600">Effective Current:</span>
                    <p className="font-mono font-semibold text-lg">{result.effectiveCurrent}A</p>
                    <p className="text-xs text-amber-600">(For sizing)</p>
                  </div>
                  <div>
                    <span className="text-amber-600">Duty Cycle:</span>
                    <p className="font-mono font-semibold text-lg">{result.dutyCycle}%</p>
                  </div>
                  <div>
                    <span className="text-amber-600">Multiplier:</span>
                    <p className="font-mono font-semibold text-lg">{result.multipleFactor}</p>
                  </div>
                </div>
              </div>

              {/* Wire Comparison Visualization */}
              <WireComparison
                copperAwg={result.copperWire.awg}
                aluminumAwg={result.aluminumWire.awg}
                amps={result.effectiveCurrent}
              />

              {/* Wire Size Results */}
              <div className="grid gap-4">
                {/* Copper Result */}
                <div>
                  <h3 className="text-sm font-semibold text-copper-600 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-copper-400 to-copper-600"></div>
                    Copper Wire
                  </h3>
                  <CalculatorResult
                    awg={result.copperWire.awg}
                    ampacity={result.copperWire.ampacity}
                    voltageDropPercent={result.copperWire.voltageDropPercent}
                    groundWire={result.copperWire.groundWire}
                    material="copper"
                    isCompliant={result.copperWire.isCompliant}
                    warnings={result.copperWire.warnings}
                    necReference={result.necReference}
                  />
                </div>

                {/* Aluminum Result */}
                <div>
                  <h3 className="text-sm font-semibold text-aluminum-600 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-aluminum-300 to-aluminum-500"></div>
                    Aluminum Wire
                  </h3>
                  <CalculatorResult
                    awg={result.aluminumWire.awg}
                    ampacity={result.aluminumWire.ampacity}
                    voltageDropPercent={result.aluminumWire.voltageDropPercent}
                    groundWire={result.aluminumWire.groundWire}
                    material="aluminum"
                    isCompliant={result.aluminumWire.isCompliant}
                    warnings={result.aluminumWire.warnings}
                    necReference={result.necReference}
                  />
                </div>
              </div>

              {/* Duty Cycle Information */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-700 mb-3">Duty Cycle Impact</div>
                <div className="text-sm text-neutral-600 space-y-1">
                  <div>• <strong>Input Current:</strong> {result.inputCurrent}A (from {kva} kVA nameplate)</div>
                  <div>• <strong>Duty Cycle:</strong> {dutyCycle}% (welder operates {dutyCycle}% of time)</div>
                  <div>• <strong>NEC Multiplier:</strong> {result.multipleFactor} (per {result.necReference})</div>
                  <div>• <strong>Effective Current:</strong> {result.effectiveCurrent}A (for conductor sizing)</div>
                </div>
              </div>

              {/* Welder Type Specifics */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800 mb-3">
                  {WELDER_TYPES[welderType]} Characteristics
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  {welderType === 'arc-transformer' && (
                    <>
                      <div>• Simple, reliable transformer-based design</div>
                      <div>• Current varies significantly with duty cycle</div>
                      <div>• Typically used for stick welding applications</div>
                    </>
                  )}
                  {welderType === 'arc-rectifier' && (
                    <>
                      <div>• Rectifier converts AC to DC output</div>
                      <div>• Better arc stability than transformer welders</div>
                      <div>• Suitable for most welding processes</div>
                    </>
                  )}
                  {welderType === 'motor-generator' && (
                    <>
                      <div>• Motor drives generator for welding power</div>
                      <div>• Uses full nameplate current for sizing</div>
                      <div>• Often portable, engine-driven units</div>
                    </>
                  )}
                  {welderType === 'tig' && (
                    <>
                      <div>• Precision welding with tungsten electrode</div>
                      <div>• Requires clean, stable power supply</div>
                      <div>• Lower current but high precision</div>
                    </>
                  )}
                  {welderType === 'mig' && (
                    <>
                      <div>• Wire feed welding process</div>
                      <div>• High productivity for production work</div>
                      <div>• Consistent arc characteristics</div>
                    </>
                  )}
                  {welderType === 'resistance' && (
                    <>
                      <div>• Spot and seam welding applications</div>
                      <div>• Very high current, short duration</div>
                      <div>• Different NEC multiplier factors apply</div>
                    </>
                  )}
                  {welderType === 'plasma' && (
                    <>
                      <div>• Cutting application, not welding</div>
                      <div>• Typically 100% duty cycle rating</div>
                      <div>• Compressed air or inert gas required</div>
                    </>
                  )}
                </div>
              </div>

              {/* Installation Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800 mb-3">Installation Requirements</div>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• Conductor ampacity: {result.effectiveCurrent}A minimum</div>
                  <div>• Overcurrent protection: Per NEC 630.12</div>
                  <div>• Disconnect: Required within sight of welder</div>
                  <div>• Grounding: Equipment grounding conductor required</div>
                  <div>• Consider voltage drop for long runs</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}