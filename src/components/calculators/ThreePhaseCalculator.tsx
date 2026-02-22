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
import { Zap, AlertTriangle, Info, Triangle, Settings , Calculator, RefreshCw } from 'lucide-react';

// Three-phase voltage systems
const VOLTAGE_SYSTEMS = [
  {
    system: '208Y/120V',
    line_voltage: 208,
    phase_voltage: 120,
    description: 'Commercial wye system',
    applications: ['Commercial buildings', 'Light industrial', 'Mixed loads'],
    notes: 'Most common commercial system'
  },
  {
    system: '240Δ/120V',
    line_voltage: 240,
    phase_voltage: 120,
    description: 'High-leg delta system',
    applications: ['Older commercial', 'Industrial with 120V needs', 'Mixed residential/commercial'],
    notes: 'High leg at 208V to neutral'
  },
  {
    system: '480Y/277V',
    line_voltage: 480,
    phase_voltage: 277,
    description: 'Industrial wye system',
    applications: ['Industrial facilities', 'Large commercial', 'Fluorescent lighting'],
    notes: 'Common industrial system'
  },
  {
    system: '480Δ',
    line_voltage: 480,
    phase_voltage: 480,
    description: 'Industrial delta system',
    applications: ['Motors only', 'Industrial equipment', 'No neutral loads'],
    notes: 'Three-wire system, no neutral'
  },
  {
    system: '600Y/347V',
    line_voltage: 600,
    phase_voltage: 347,
    description: 'High voltage system',
    applications: ['Large industrial', 'HID lighting', 'High power equipment'],
    notes: 'Higher efficiency for large loads'
  },
];

// Load balance scenarios
const LOAD_BALANCE_TYPES = [
  {
    type: 'Balanced Load',
    description: 'Equal load on all three phases',
    unbalance_factor: 1.0,
    notes: 'Ideal condition, minimal neutral current'
  },
  {
    type: 'Slightly Unbalanced',
    description: '5-10% load difference between phases',
    unbalance_factor: 1.05,
    notes: 'Typical commercial installation'
  },
  {
    type: 'Moderately Unbalanced',
    description: '10-20% load difference between phases',
    unbalance_factor: 1.15,
    notes: 'Mixed loads, some single-phase equipment'
  },
  {
    type: 'Severely Unbalanced',
    description: 'Over 20% load difference between phases',
    unbalance_factor: 1.25,
    notes: 'Requires neutral sizing consideration'
  },
];

// Connection types
const CONNECTION_TYPES = [
  {
    type: 'Wye (Star)',
    description: 'Four-wire system with neutral',
    neutral_required: true,
    voltage_relationship: 'Line voltage = √3 × Phase voltage',
    applications: ['Mixed loads', 'Single and three-phase loads', 'Lighting circuits']
  },
  {
    type: 'Delta',
    description: 'Three-wire system, no neutral',
    neutral_required: false,
    voltage_relationship: 'Line voltage = Phase voltage',
    applications: ['Motor loads only', 'Heating elements', 'Three-phase only loads']
  },
  {
    type: 'High-Leg Delta',
    description: 'Delta with center-tapped transformer',
    neutral_required: true,
    voltage_relationship: 'Two legs at 120V, one leg at 208V to neutral',
    applications: ['Mixed single and three-phase loads', 'Older commercial buildings']
  },
];

// Power calculation modes
const CALCULATION_MODES = [
  {
    mode: 'Known Power (kW)',
    description: 'Calculate current from known power',
    primary_input: 'power',
    formula: 'I = P / (√3 × V × PF)'
  },
  {
    mode: 'Known Current',
    description: 'Calculate power from known current',
    primary_input: 'current',
    formula: 'P = √3 × V × I × PF'
  },
  {
    mode: 'Motor Load',
    description: 'Motor nameplate calculations',
    primary_input: 'motor',
    formula: 'I = HP × 746 / (√3 × V × Eff × PF)'
  },
];

export function ThreePhaseCalculator() {
  const [voltageSystem, setVoltageSystem] = useState(VOLTAGE_SYSTEMS[0]); // Default to 208Y/120V
  const [loadBalance, setLoadBalance] = useState(LOAD_BALANCE_TYPES[0]);
  const [connectionType, setConnectionType] = useState(CONNECTION_TYPES[0]);
  const [calculationMode, setCalculationMode] = useState(CALCULATION_MODES[0]);
  const [distance, setDistance] = useState(150);
  
  // Input parameters
  const [power, setPower] = useState(50); // kW
  const [current, setCurrent] = useState(100); // Amps
  const [powerFactor, setPowerFactor] = useState(0.85);
  const [efficiency, setEfficiency] = useState(0.9);
  const [horsepower, setHorsepower] = useState(75);
  
  const [includeNeutral, setIncludeNeutral] = useState(true);
  const [copperResult, setCopperResult] = useState<WireSizeResult | null>(null);
  const [aluminumResult, setAluminumResult] = useState<WireSizeResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculate line current based on selected mode
  const calculateLineCurrent = useCallback((): number => {
    const lineVoltage = voltageSystem.line_voltage;
    let lineCurrent = 0;

    switch (calculationMode.mode) {
      case 'Known Power (kW)':
        // I = P / (√3 × V × PF)
        lineCurrent = (power * 1000) / (Math.sqrt(3) * lineVoltage * powerFactor);
        break;
      case 'Known Current':
        lineCurrent = current;
        break;
      case 'Motor Load':
        // I = HP × 746 / (√3 × V × Eff × PF)
        lineCurrent = (horsepower * 746) / (Math.sqrt(3) * lineVoltage * efficiency * powerFactor);
        break;
    }

    // Apply load unbalance factor
    lineCurrent *= loadBalance.unbalance_factor;

    return Math.ceil(lineCurrent * 100) / 100;
  }, [voltageSystem, calculationMode, power, current, powerFactor, efficiency, horsepower, loadBalance]);

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

  // Calculate neutral current for unbalanced loads
  const calculateNeutralCurrent = useCallback((): number => {
    if (!connectionType.neutral_required || loadBalance.type === 'Balanced Load') {
      return 0;
    }

    const lineCurrent = calculateLineCurrent();
    
    // Simplified neutral current calculation for unbalanced loads
    // In reality, this requires vector analysis
    const unbalancePercent = (loadBalance.unbalance_factor - 1.0) * 100;
    const neutralCurrent = lineCurrent * (unbalancePercent / 100) * 0.5;
    
    return Math.ceil(neutralCurrent * 100) / 100;
  }, [connectionType, loadBalance, calculateLineCurrent]);

  // Calculate actual power based on current mode
  const calculateActualPower = useCallback((): number => {
    const lineCurrent = calculateLineCurrent();
    const lineVoltage = voltageSystem.line_voltage;
    
    // P = √3 × V × I × PF (convert to kW)
    return Math.ceil((Math.sqrt(3) * lineVoltage * lineCurrent * powerFactor) / 10) / 100;
  }, [voltageSystem, powerFactor, calculateLineCurrent]);

  const calculate = useCallback(() => {
    const lineCurrent = calculateLineCurrent();
    const neutralCurrent = calculateNeutralCurrent();
    
    // Use higher of line current or neutral current for conductor sizing
    const conductorCurrent = Math.max(lineCurrent, neutralCurrent);
    
    // Calculate wire sizes for both materials
    const baseInput: WireSizeInput = {
      amps: conductorCurrent,
      distance,
      voltage: voltageSystem.line_voltage === 600 ? 480 : (voltageSystem.line_voltage >= 480 ? 480 : 240),
      phase: 'three',
      material: 'copper'
    };

    const copperWire = calculateWireSize({ ...baseInput, material: 'copper' });
    const aluminumWire = calculateWireSize({ ...baseInput, material: 'aluminum' });

    // Add three-phase specific warnings
    const threePhaseWarnings = [];
    
    if (loadBalance.unbalance_factor > 1.1) {
      threePhaseWarnings.push('Significant load unbalance may require neutral upsizing');
    }
    
    if (connectionType.type === 'High-Leg Delta') {
      threePhaseWarnings.push('High-leg delta: One leg measures 208V to neutral, not 120V');
    }
    
    if (voltageSystem.line_voltage >= 480 && distance > 200) {
      threePhaseWarnings.push('Long high-voltage runs may require special consideration');
    }
    
    if (powerFactor < 0.8) {
      threePhaseWarnings.push('Low power factor - consider power factor correction');
    }
    
    if (neutralCurrent > lineCurrent * 0.2) {
      threePhaseWarnings.push('High neutral current - verify neutral conductor sizing');
    }
    
    if (calculationMode.mode === 'Motor Load' && efficiency < 0.85) {
      threePhaseWarnings.push('Low motor efficiency - verify motor nameplate data');
    }
    
    if (connectionType.type === 'Delta' && includeNeutral) {
      threePhaseWarnings.push('Delta systems typically do not require neutral conductors');
    }
    
    threePhaseWarnings.push('Verify load balance to minimize neutral current');
    threePhaseWarnings.push('Install appropriate three-phase overcurrent protection');
    threePhaseWarnings.push('Consider power quality issues for sensitive equipment');

    setCopperResult({
      ...copperWire,
      warnings: [...copperWire.warnings, ...threePhaseWarnings]
    });
    
    setAluminumResult({
      ...aluminumWire,
      warnings: [...aluminumWire.warnings, ...threePhaseWarnings]
    });
  }, [voltageSystem, loadBalance, connectionType, calculationMode, distance, power, current, powerFactor, efficiency, horsepower, includeNeutral, calculateLineCurrent, calculateNeutralCurrent]);

  // Auto-calculation disabled - user must click Calculate button
  // useEffect(() => {
  //   calculate();
  // }, [calculate]);

  const lineCurrent = calculateLineCurrent();
  const neutralCurrent = calculateNeutralCurrent();
  const actualPower = calculateActualPower();

  // Shareable URL and Print functionality
  const shareableInputs = {
    system: voltageSystem.system,
    balance: loadBalance.type,
    connection: connectionType.type,
    mode: calculationMode.mode,
    distance,
    powerFactor,
    ...(calculationMode.mode === 'Known Power (kW)' && { power }),
    ...(calculationMode.mode === 'Known Current' && { current }),
    ...(calculationMode.mode === 'Motor Load' && { horsepower, efficiency }),
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
      title: 'Three-Phase Circuit Calculation',
      inputs: {
        'Voltage System': voltageSystem.system,
        'Connection Type': connectionType.type,
        'Load Balance': loadBalance.type,
        'Calculation Mode': calculationMode.mode,
        'Distance': `${distance} feet`,
        'Power Factor': powerFactor.toString(),
        ...(calculationMode.mode === 'Known Power (kW)' && { 'Power': `${power} kW` }),
        ...(calculationMode.mode === 'Known Current' && { 'Current': `${current}A` }),
        ...(calculationMode.mode === 'Motor Load' && { 
          'Horsepower': `${horsepower} HP`,
          'Efficiency': `${(efficiency * 100).toFixed(0)}%`
        }),
      },
      results: {
        'Line Current': `${lineCurrent}A`,
        'Neutral Current': `${neutralCurrent}A`,
        'Actual Power': `${actualPower} kW`,
        'Line Voltage': `${voltageSystem.line_voltage}V`,
        'Phase Voltage': `${voltageSystem.phase_voltage}V`,
        'Copper Wire': copperResult.awg + ' AWG',
        'Aluminum Wire': aluminumResult?.awg + ' AWG' || 'N/A',
      },
    });
  }, [voltageSystem, connectionType, loadBalance, calculationMode, distance, powerFactor, power, current, horsepower, efficiency, lineCurrent, neutralCurrent, actualPower, copperResult, aluminumResult, print]);

  return (
    <CalculatorLayout
      title="Three-Phase Calculator"
      description="Calculate three-phase electrical circuits and wire sizing"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="space-y-6">
        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-800 mb-1">Three-Phase System Safety</div>
            <div className="text-amber-700">
              Three-phase electrical systems require specialized knowledge and safety procedures. 
              All work must be performed by qualified electricians familiar with three-phase power systems. 
              Verify phase rotation and proper connections before energizing equipment.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Triangle className="w-5 h-5 text-primary-600" />
              Three-Phase System Configuration
            </h2>

            <div className="space-y-4">
              <Select
                label="Voltage System"
                value={voltageSystem.system}
                onChange={(e) => {
                  const selected = VOLTAGE_SYSTEMS.find(v => v.system === e.target.value);
                  if (selected) setVoltageSystem(selected);
                }}
                options={VOLTAGE_SYSTEMS.map(system => ({
                  value: system.system,
                  label: system.system
                }))}
              />

              <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
                <div className="font-medium mb-1">Voltage System Details:</div>
                <div>• System: {voltageSystem.system}</div>
                <div>• Line Voltage: {voltageSystem.line_voltage}V</div>
                <div>• Phase Voltage: {voltageSystem.phase_voltage}V</div>
                <div>• Description: {voltageSystem.description}</div>
                <div className="mt-2 text-xs">
                  <div className="font-medium text-neutral-700 mb-1">Applications:</div>
                  {voltageSystem.applications.map((app, index) => (
                    <div key={index}>• {app}</div>
                  ))}
                </div>
                <div className="mt-1 text-xs text-neutral-500">{voltageSystem.notes}</div>
              </div>

              <Select
                label="Connection Type"
                value={connectionType.type}
                onChange={(e) => {
                  const selected = CONNECTION_TYPES.find(c => c.type === e.target.value);
                  if (selected) {
                    setConnectionType(selected);
                    setIncludeNeutral(selected.neutral_required);
                  }
                }}
                options={CONNECTION_TYPES.map(connection => ({
                  value: connection.type,
                  label: connection.type
                }))}
              />

              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <div className="font-medium mb-1">Connection Details:</div>
                <div>• Type: {connectionType.type}</div>
                <div>• Neutral Required: {connectionType.neutral_required ? 'Yes' : 'No'}</div>
                <div>• Voltage Relationship: {connectionType.voltage_relationship}</div>
                <div className="mt-2 text-xs text-blue-600">{connectionType.description}</div>
              </div>

              <Select
                label="Load Balance"
                value={loadBalance.type}
                onChange={(e) => {
                  const selected = LOAD_BALANCE_TYPES.find(l => l.type === e.target.value);
                  if (selected) setLoadBalance(selected);
                }}
                options={LOAD_BALANCE_TYPES.map(balance => ({
                  value: balance.type,
                  label: balance.type
                }))}
              />

              <Select
                label="Calculation Mode"
                value={calculationMode.mode}
                onChange={(e) => {
                  const selected = CALCULATION_MODES.find(c => c.mode === e.target.value);
                  if (selected) setCalculationMode(selected);
                }}
                options={CALCULATION_MODES.map(mode => ({
                  value: mode.mode,
                  label: mode.mode
                }))}
              />

              <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
                <div className="font-medium mb-1">Calculation Formula:</div>
                <div className="font-mono text-xs">{calculationMode.formula}</div>
                <div className="mt-1 text-xs text-green-600">{calculationMode.description}</div>
              </div>

              {/* Input fields based on calculation mode */}
              <div className="grid grid-cols-2 gap-4">
                {calculationMode.mode === 'Known Power (kW)' && (
                  <Input
                    label="Power (kW)"
                    type="number"
                    value={power}
                    onChange={(e) => setPower(Number(e.target.value))}
                    suffix="kW"
                    min={0.1}
                    max={5000}
                    step={0.1}
                  />
                )}

                {calculationMode.mode === 'Known Current' && (
                  <Input
                    label="Line Current"
                    type="number"
                    value={current}
                    onChange={(e) => setCurrent(Number(e.target.value))}
                    suffix="amps"
                    min={1}
                    max={5000}
                    step={0.1}
                  />
                )}

                {calculationMode.mode === 'Motor Load' && (
                  <>
                    <Input
                      label="Horsepower"
                      type="number"
                      value={horsepower}
                      onChange={(e) => setHorsepower(Number(e.target.value))}
                      suffix="HP"
                      min={0.25}
                      max={1000}
                      step={0.25}
                    />
                    <Input
                      label="Efficiency (%)"
                      type="number"
                      value={efficiency * 100}
                      onChange={(e) => setEfficiency(Number(e.target.value) / 100)}
                      suffix="%"
                      min={50}
                      max={98}
                      step={0.5}
                    />
                  </>
                )}

                <Input
                  label="Power Factor"
                  type="number"
                  value={powerFactor}
                  onChange={(e) => setPowerFactor(Number(e.target.value))}
                  min={0.5}
                  max={1.0}
                  step={0.01}
                />
              </div>

              <Input
                label="Distance"
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                suffix="feet"
                min={0}
                max={2000}
                placeholder="150"
              />

              {connectionType.neutral_required && (
                <Select
                  label="Include Neutral"
                  value={includeNeutral ? 'yes' : 'no'}
                  onChange={(e) => setIncludeNeutral(e.target.value === 'yes')}
                  options={[
                    { value: 'yes', label: 'Yes (4-wire system)' },
                    { value: 'no', label: 'No (3-wire system)' }
                  ]}
                />
              )}

              {/* Calculation Results Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Three-Phase Calculation Results
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• Line Current: <strong>{lineCurrent}A</strong></div>
                  <div>• Neutral Current: <strong>{neutralCurrent}A</strong></div>
                  <div>• Actual Power: <strong>{actualPower} kW</strong></div>
                  <div>• Line Voltage: {voltageSystem.line_voltage}V</div>
                  <div>• Phase Voltage: {voltageSystem.phase_voltage}V</div>
                  <div>• Power Factor: {powerFactor}</div>
                  <div>• Load Balance Factor: {loadBalance.unbalance_factor}x</div>
                </div>
              </div>

              {/* NEC Reference */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">NEC References:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• NEC 220.61: Neutral load calculations</li>
                    <li>• NEC 430.6: Motor full-load currents</li>
                    <li>• NEC 215.2: Feeder load calculations</li>
                    <li>• NEC 220.22: Neutral conductor sizing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Three-Phase Wire Size Results
            </h2>

            {copperResult && aluminumResult && (
              <div className="space-y-6">
                {/* Three-Phase Summary */}
                <div className="bg-neutral-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 text-center mb-4">
                    Three-Phase Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <div className="text-blue-800 font-semibold">Line Current</div>
                      <div className="text-2xl font-bold text-blue-900">{lineCurrent}A</div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <div className="text-green-800 font-semibold">Power</div>
                      <div className="text-2xl font-bold text-green-900">{actualPower}kW</div>
                    </div>
                  </div>
                  {neutralCurrent > 0 && (
                    <div className="mt-4 text-center">
                      <div className="bg-orange-100 rounded-lg p-2">
                        <div className="text-orange-800 font-semibold">Neutral Current</div>
                        <div className="text-xl font-bold text-orange-900">{neutralCurrent}A</div>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 text-center text-sm text-neutral-600">
                    {voltageSystem.system} • {connectionType.type} • PF: {powerFactor}
                  </div>
                </div>

                <WireComparison
                  copperAwg={copperResult.awg}
                  aluminumAwg={aluminumResult.awg}
                  amps={Math.max(lineCurrent, neutralCurrent)}
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
                    necReference="NEC 220.61, 215.2, 430.6, Table 310.16"
                  />

                  <CalculatorResult
                    awg={aluminumResult.awg}
                    ampacity={aluminumResult.ampacity}
                    voltageDropPercent={aluminumResult.voltageDropPercent}
                    groundWire={aluminumResult.groundWire}
                    material="aluminum"
                    isCompliant={aluminumResult.isCompliant}
                    warnings={aluminumResult.warnings}
                    necReference="NEC 220.61, 215.2, 430.6, Table 310.16"
                  />
                </div>

                {/* Three-Phase Installation Notes */}
                <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                  <div className="font-medium text-neutral-900 mb-2">Three-Phase Installation Guidelines:</div>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• Verify phase rotation before connecting motors</li>
                    <li>• Balance loads across all three phases when possible</li>
                    <li>• Size neutral conductor for unbalanced loads</li>
                    <li>• Install appropriate three-phase overcurrent protection</li>
                    <li>• Consider power quality and harmonic distortion</li>
                    <li>• Use proper phase identification and labeling</li>
                    <li>• Install surge protection for sensitive equipment</li>
                  </ul>
                </div>

                {/* Power Factor Information */}
                {powerFactor < 0.9 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
                    <Settings className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-orange-800 mb-1">Power Factor Consideration</div>
                      <div className="text-orange-700">
                        Power factor of {powerFactor} is below optimal (0.9+). Consider power factor correction 
                        to reduce current draw, improve efficiency, and potentially avoid utility penalties.
                      </div>
                    </div>
                  </div>
                )}

                {/* Load Balance Warning */}
                {loadBalance.unbalance_factor > 1.1 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-red-800 mb-1">Load Unbalance Warning</div>
                      <div className="text-red-700">
                        Significant load unbalance detected. This can cause increased neutral current, 
                        voltage fluctuations, and reduced equipment efficiency. Consider redistributing loads 
                        across phases for better balance.
                      </div>
                    </div>
                  </div>
                )}

                {/* Voltage System Information */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                  <Triangle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-purple-800 mb-1">Voltage System Information</div>
                    <div className="text-purple-700">
                      {voltageSystem.system} is commonly used for {voltageSystem.applications.join(', ').toLowerCase()}. 
                      Line-to-line voltage is {voltageSystem.line_voltage}V, line-to-neutral is {voltageSystem.phase_voltage}V.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!copperResult && (
              <div className="text-center py-8 text-neutral-500">
                Configure three-phase parameters to see wire size recommendations
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}