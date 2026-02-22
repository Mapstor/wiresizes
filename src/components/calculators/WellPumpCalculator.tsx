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
import { Droplets, AlertTriangle, Info, Zap , Calculator, RefreshCw } from 'lucide-react';

// Well pump motor types and their typical ratings
const WELL_PUMP_TYPES = [
  { 
    type: 'Shallow Well - 1/3 HP', 
    horsepower: 0.33, 
    voltage: 115,
    description: 'Wells up to 25 feet deep'
  },
  { 
    type: 'Shallow Well - 1/2 HP', 
    horsepower: 0.5, 
    voltage: 115,
    description: 'Wells up to 25 feet deep'
  },
  { 
    type: 'Shallow Well - 3/4 HP', 
    horsepower: 0.75, 
    voltage: 230,
    description: 'High capacity shallow wells'
  },
  { 
    type: 'Deep Well - 1/2 HP', 
    horsepower: 0.5, 
    voltage: 230,
    description: 'Wells 25-150 feet deep'
  },
  { 
    type: 'Deep Well - 3/4 HP', 
    horsepower: 0.75, 
    voltage: 230,
    description: 'Wells 25-200 feet deep'
  },
  { 
    type: 'Deep Well - 1 HP', 
    horsepower: 1.0, 
    voltage: 230,
    description: 'Wells 100-250 feet deep'
  },
  { 
    type: 'Deep Well - 1.5 HP', 
    horsepower: 1.5, 
    voltage: 230,
    description: 'Wells 200-350 feet deep'
  },
  { 
    type: 'Deep Well - 2 HP', 
    horsepower: 2.0, 
    voltage: 230,
    description: 'Wells 300+ feet deep'
  },
];

// Motor amperage lookup table (full-load current from NEC Table 430.248)
const MOTOR_FLC_TABLE = {
  115: {
    0.33: 7.2,
    0.5: 9.8,
    0.75: 13.8,
  },
  230: {
    0.33: 3.6,
    0.5: 4.9,
    0.75: 6.9,
    1.0: 8.0,
    1.5: 10.0,
    2.0: 12.0,
  },
};

// Control box types and their typical amperage multipliers
const CONTROL_BOXES = [
  {
    type: '2-Wire Control Box',
    multiplier: 1.0,
    description: 'Standard submersible pump control'
  },
  {
    type: '3-Wire Control Box',
    multiplier: 1.15,
    description: 'With start relay and capacitor'
  },
  {
    type: 'VFD (Variable Frequency Drive)',
    multiplier: 1.25,
    description: 'Soft start and speed control'
  },
];

export function WellPumpCalculator() {
  const [pumpType, setPumpType] = useState(WELL_PUMP_TYPES[5]); // Default to 1 HP deep well
  const [controlBox, setControlBox] = useState(CONTROL_BOXES[1]); // Default to 3-wire control
  const [distance, setDistance] = useState(100);
  const [installationType, setInstallationType] = useState<'underground' | 'overhead'>('underground');
  const [wellDepth, setWellDepth] = useState(150);
  const [copperResult, setCopperResult] = useState<WireSizeResult | null>(null);
  const [aluminumResult, setAluminumResult] = useState<WireSizeResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculate motor current based on NEC table
  const getMotorCurrent = useCallback((hp: number, voltage: number): number => {
    const voltageTable = MOTOR_FLC_TABLE[voltage as keyof typeof MOTOR_FLC_TABLE];
    if (!voltageTable) return 0;
    
    const current = voltageTable[hp as keyof typeof voltageTable];
    return current || 0;
  }, []);

  // Calculate circuit requirements per NEC 430.22 (125% of motor FLC) plus control box factor
  const calculateCircuitAmps = useCallback((motorCurrent: number, controlMultiplier: number): number => {
    return Math.ceil(motorCurrent * controlMultiplier * 1.25 * 100) / 100; // Round up to nearest 0.01A
  }, []);

  const performCalculation = useCallback(() => {
    calculateCircuitAmps();
    setShowResults(true);
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }, [calculateCircuitAmps]);

  const handleReset = () => {
    setShowResults(false);
    // Reset other states as needed
  };

  const calculate = useCallback(() => {
    const motorCurrent = getMotorCurrent(pumpType.horsepower, pumpType.voltage);
    if (motorCurrent === 0) {
      setCopperResult(null);
      setAluminumResult(null);
      return;
    }

    const circuitAmps = calculateCircuitAmps(motorCurrent, controlBox.multiplier);
    
    // Calculate wire sizes for both materials
    const baseInput: WireSizeInput = {
      amps: circuitAmps,
      distance,
      voltage: pumpType.voltage === 230 ? 240 : 120,
      phase: 'single',
      material: 'copper'
    };

    const copperWire = calculateWireSize({ ...baseInput, material: 'copper' });
    const aluminumWire = calculateWireSize({ ...baseInput, material: 'aluminum' });

    // Add well pump specific warnings
    const wellWarnings = [];
    
    if (installationType === 'underground' && distance > 100) {
      wellWarnings.push('Consider direct burial rated THWN-2 or USE-2 conductors');
    }
    
    if (wellDepth > 200 && pumpType.horsepower < 1.0) {
      wellWarnings.push('Verify pump capacity is adequate for well depth');
    }
    
    if (pumpType.voltage === 115 && distance > 50) {
      wellWarnings.push('Consider 230V motor for improved efficiency on long runs');
    }
    
    if (controlBox.type.includes('VFD')) {
      wellWarnings.push('VFD may require additional input filtering for EMI compliance');
    }
    
    wellWarnings.push('Install disconnect switch within sight of control box');
    wellWarnings.push('Bond well casing to electrical grounding system');
    wellWarnings.push('Verify local code requirements for well pump installations');

    setCopperResult({
      ...copperWire,
      warnings: [...copperWire.warnings, ...wellWarnings]
    });
    
    setAluminumResult({
      ...aluminumWire,
      warnings: [...aluminumWire.warnings, ...wellWarnings]
    });
  }, [pumpType, controlBox, distance, installationType, wellDepth, getMotorCurrent, calculateCircuitAmps]);

  // Auto-calculation disabled - user must click Calculate button
  // useEffect(() => {
  //   calculate();
  // }, [calculate]);

  const motorCurrent = getMotorCurrent(pumpType.horsepower, pumpType.voltage);
  const circuitAmps = calculateCircuitAmps(motorCurrent, controlBox.multiplier);

  // Shareable URL and Print functionality
  const shareableInputs = {
    type: pumpType.type,
    controlBox: controlBox.type,
    distance,
    installationType,
    wellDepth,
  };

  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!copperResult) return;
    print({
      title: 'Well Pump Circuit Calculation',
      inputs: {
        'Pump Type': pumpType.type,
        'Horsepower': `${pumpType.horsepower} HP`,
        'Voltage': `${pumpType.voltage}V`,
        'Control Box': controlBox.type,
        'Distance to Control Box': `${distance} feet`,
        'Installation Type': installationType === 'underground' ? 'Underground' : 'Overhead',
        'Well Depth': `${wellDepth} feet`,
      },
      results: {
        'Motor FLC': `${motorCurrent}A`,
        'Control Box Factor': `${controlBox.multiplier}x`,
        'Circuit Requirement': `${circuitAmps}A`,
        'Copper Wire': copperResult.awg + ' AWG',
        'Aluminum Wire': aluminumResult?.awg + ' AWG' || 'N/A',
      },
    });
  }, [pumpType, controlBox, distance, installationType, wellDepth, copperResult, aluminumResult, motorCurrent, circuitAmps, print]);

  return (
    <CalculatorLayout
      title="Well Pump Wire Size Calculator"
      description="Calculate wire size for well pump installations per NEC Article 430"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="space-y-6">
        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-800 mb-1">Well Pump Installation Safety</div>
            <div className="text-amber-700">
              Well pump electrical installations must comply with NEC Article 430 and local codes. 
              All work should be performed by licensed electricians familiar with well pump systems 
              and local water well regulations.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary-600" />
              Well Pump Configuration
            </h2>

            <div className="space-y-4">
              <Select
                label="Well Pump Type"
                value={pumpType.type}
                onChange={(e) => {
                  const selected = WELL_PUMP_TYPES.find(t => t.type === e.target.value);
                  if (selected) setPumpType(selected);
                }}
                options={WELL_PUMP_TYPES.map(pump => ({
                  value: pump.type,
                  label: `${pump.type} (${pump.voltage}V)`
                }))}
              />

              <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
                <div className="font-medium mb-1">Selected Pump Details:</div>
                <div>• Power: {pumpType.horsepower} HP</div>
                <div>• Voltage: {pumpType.voltage}V</div>
                <div>• Full Load Current: {motorCurrent}A</div>
                <div className="mt-1 text-xs text-neutral-500">{pumpType.description}</div>
              </div>

              <Select
                label="Control Box Type"
                value={controlBox.type}
                onChange={(e) => {
                  const selected = CONTROL_BOXES.find(c => c.type === e.target.value);
                  if (selected) setControlBox(selected);
                }}
                options={CONTROL_BOXES.map(control => ({
                  value: control.type,
                  label: control.type
                }))}
              />

              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <div className="font-medium mb-1">Control Box Impact:</div>
                <div>• Type: {controlBox.type}</div>
                <div>• Current Multiplier: {controlBox.multiplier}x</div>
                <div>• Circuit Requirement: {circuitAmps}A (125% × FLC × multiplier)</div>
                <div className="mt-1 text-xs text-blue-600">{controlBox.description}</div>
              </div>

              <Input
                label="Distance from Panel to Control Box"
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                suffix="feet"
                min={1}
                max={1000}
                placeholder="100"
              />

              <Input
                label="Well Depth (for reference)"
                type="number"
                value={wellDepth}
                onChange={(e) => setWellDepth(Number(e.target.value))}
                suffix="feet"
                min={0}
                max={1000}
                placeholder="150"
              />

              <Select
                label="Installation Type"
                value={installationType}
                onChange={(e) => setInstallationType(e.target.value as 'underground' | 'overhead')}
                options={[
                  { value: 'underground', label: 'Underground (direct burial/conduit)' },
                  { value: 'overhead', label: 'Overhead/exposed conduit' }
                ]}
              />

              {/* NEC Reference */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">NEC Requirements:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• NEC 430.22: Motor circuits sized at 125% of full-load current</li>
                    <li>• NEC 430.102: Disconnect required within sight of control box</li>
                    <li>• NEC 250.112: Well casing bonding requirements</li>
                    <li>• Motor current from NEC Table 430.248</li>
                    <li>• Consider local well code requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Wire Size Results
            </h2>

            {copperResult && aluminumResult && (
              <div className="space-y-6">
                <WireComparison
                  copperAwg={copperResult.awg}
                  aluminumAwg={aluminumResult.awg}
                  amps={circuitAmps}
                />

                <div className="grid gap-4">
                  <CalculatorResult
                    awg={copperResult.awg}
                    ampacity={copperResult.ampacity}
                    voltageDropPercent={copperResult.voltageDropPercent}
                    groundWire={copperResult.groundWire}
                    material="copper"
                    isCompliant={copperResult.isCompliant}
                    warnings={copperResult.warnings}
                    necReference="NEC 430.22, 430.102, Table 430.248"
                  />

                  <CalculatorResult
                    awg={aluminumResult.awg}
                    ampacity={aluminumResult.ampacity}
                    voltageDropPercent={aluminumResult.voltageDropPercent}
                    groundWire={aluminumResult.groundWire}
                    material="aluminum"
                    isCompliant={aluminumResult.isCompliant}
                    warnings={aluminumResult.warnings}
                    necReference="NEC 430.22, 430.102, Table 430.248"
                  />
                </div>

                {/* Additional Well Pump Information */}
                <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                  <div className="font-medium text-neutral-900 mb-2">Well Pump Installation Notes:</div>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• Use THWN-2 conductors in conduit or USE-2 for direct burial</li>
                    <li>• Install surge protection at panel and control box</li>
                    <li>• Verify control box is rated for motor horsepower</li>
                    <li>• Bond well casing to electrical grounding system</li>
                    <li>• Install disconnect within sight of control box</li>
                    <li>• Consider pressure switch location and wiring</li>
                    <li>• Underground wiring depth per NEC Table 300.5</li>
                  </ul>
                </div>

                {/* Pump Performance Note */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <Zap className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-green-800 mb-1">Performance Tip</div>
                    <div className="text-green-700">
                      For wells over {Math.round(pumpType.horsepower * 200)} feet deep, consider a higher 
                      horsepower pump or verify current pump specifications with manufacturer.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!copperResult && (
              <div className="text-center py-8 text-neutral-500">
                Select a pump type to see wire size recommendations
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}