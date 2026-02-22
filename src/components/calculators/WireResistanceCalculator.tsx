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
import { Activity, AlertTriangle, Info, Zap, Thermometer , Calculator, RefreshCw } from 'lucide-react';

// Wire resistance data (ohms per 1000 feet at 20°C/68°F)
const WIRE_RESISTANCE_DATA = [
  { awg: '14', copper_ohms: 2.525, aluminum_ohms: 4.148, diameter_mils: 64.1 },
  { awg: '12', copper_ohms: 1.588, aluminum_ohms: 2.609, diameter_mils: 80.8 },
  { awg: '10', copper_ohms: 0.999, aluminum_ohms: 1.640, diameter_mils: 101.9 },
  { awg: '8', copper_ohms: 0.628, aluminum_ohms: 1.031, diameter_mils: 128.5 },
  { awg: '6', copper_ohms: 0.395, aluminum_ohms: 0.648, diameter_mils: 162.0 },
  { awg: '4', copper_ohms: 0.249, aluminum_ohms: 0.408, diameter_mils: 204.3 },
  { awg: '3', copper_ohms: 0.197, aluminum_ohms: 0.323, diameter_mils: 229.4 },
  { awg: '2', copper_ohms: 0.156, aluminum_ohms: 0.256, diameter_mils: 257.6 },
  { awg: '1', copper_ohms: 0.124, aluminum_ohms: 0.203, diameter_mils: 289.3 },
  { awg: '1/0', copper_ohms: 0.098, aluminum_ohms: 0.161, diameter_mils: 325.0 },
  { awg: '2/0', copper_ohms: 0.078, aluminum_ohms: 0.128, diameter_mils: 365.0 },
  { awg: '3/0', copper_ohms: 0.062, aluminum_ohms: 0.101, diameter_mils: 409.6 },
  { awg: '4/0', copper_ohms: 0.049, aluminum_ohms: 0.080, diameter_mils: 460.0 },
  { awg: '250', copper_ohms: 0.042, aluminum_ohms: 0.069, diameter_mils: 500.0 },
  { awg: '300', copper_ohms: 0.035, aluminum_ohms: 0.057, diameter_mils: 547.6 },
  { awg: '350', copper_ohms: 0.030, aluminum_ohms: 0.049, diameter_mils: 591.2 },
  { awg: '400', copper_ohms: 0.026, aluminum_ohms: 0.043, diameter_mils: 632.5 },
  { awg: '500', copper_ohms: 0.021, aluminum_ohms: 0.034, diameter_mils: 707.1 },
];

// Temperature correction factors for resistance
const TEMPERATURE_FACTORS = [
  { temp_f: -40, temp_c: -40, copper_factor: 0.781, aluminum_factor: 0.776 },
  { temp_f: -20, temp_c: -28.9, copper_factor: 0.850, aluminum_factor: 0.848 },
  { temp_f: 0, temp_c: -17.8, copper_factor: 0.919, aluminum_factor: 0.919 },
  { temp_f: 20, temp_c: -6.7, copper_factor: 0.988, aluminum_factor: 0.991 },
  { temp_f: 32, temp_c: 0, copper_factor: 1.031, aluminum_factor: 1.035 },
  { temp_f: 50, temp_c: 10, copper_factor: 1.100, aluminum_factor: 1.107 },
  { temp_f: 68, temp_c: 20, copper_factor: 1.000, aluminum_factor: 1.000 }, // Reference temperature
  { temp_f: 86, temp_c: 30, copper_factor: 1.070, aluminum_factor: 1.072 },
  { temp_f: 104, temp_c: 40, copper_factor: 1.140, aluminum_factor: 1.144 },
  { temp_f: 122, temp_c: 50, copper_factor: 1.210, aluminum_factor: 1.216 },
  { temp_f: 140, temp_c: 60, copper_factor: 1.280, aluminum_factor: 1.287 },
  { temp_f: 158, temp_c: 70, copper_factor: 1.350, aluminum_factor: 1.359 },
  { temp_f: 176, temp_c: 80, copper_factor: 1.420, aluminum_factor: 1.431 },
  { temp_f: 194, temp_c: 90, copper_factor: 1.490, aluminum_factor: 1.503 },
];

// Calculation modes
const CALCULATION_MODES = [
  {
    mode: 'Resistance from Wire Size',
    description: 'Calculate resistance for known wire and distance',
    inputs: ['wire_size', 'distance', 'temperature']
  },
  {
    mode: 'Wire Size from Voltage Drop',
    description: 'Find wire size for maximum voltage drop',
    inputs: ['current', 'distance', 'max_voltage_drop', 'voltage', 'temperature']
  },
  {
    mode: 'Distance from Resistance',
    description: 'Calculate maximum distance for resistance limit',
    inputs: ['wire_size', 'max_resistance', 'temperature']
  },
  {
    mode: 'Power Loss Analysis',
    description: 'Analyze power loss in conductor',
    inputs: ['wire_size', 'current', 'distance', 'temperature']
  },
];

// Circuit types for voltage drop calculations
const CIRCUIT_TYPES = [
  { type: 'DC Circuit', multiplier: 2, description: 'DC or single-phase AC (round trip)' },
  { type: 'Single-Phase AC', multiplier: 2, description: 'Single-phase alternating current' },
  { type: 'Three-Phase', multiplier: Math.sqrt(3), description: 'Three-phase system (√3 factor)' },
];

export function WireResistanceCalculator() {
  const [calculationMode, setCalculationMode] = useState(CALCULATION_MODES[0]);
  const [wireSize, setWireSize] = useState('12');
  const [material, setMaterial] = useState<'copper' | 'aluminum'>('copper');
  const [distance, setDistance] = useState(100);
  const [temperature, setTemperature] = useState(68); // Fahrenheit
  const [current, setCurrent] = useState(20);
  const [voltage, setVoltage] = useState(240);
  const [maxVoltageDrop, setMaxVoltageDrop] = useState(3.0);
  const [maxResistance, setMaxResistance] = useState(0.5);
  const [circuitType, setCircuitType] = useState(CIRCUIT_TYPES[1]); // Single-phase AC
  
  // Results
  const [calculatedResistance, setCalculatedResistance] = useState(0);
  const [voltageDropValue, setVoltageDropValue] = useState(0);
  const [voltageDropPercent, setVoltageDropPercent] = useState(0);
  const [powerLoss, setPowerLoss] = useState(0);
  const [recommendedWire, setRecommendedWire] = useState<string>('');
  const [maxDistance, setMaxDistance] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Get temperature correction factor
  const getTemperatureFactor = useCallback((temp_f: number, material: 'copper' | 'aluminum'): number => {
    // Linear interpolation between temperature points
    const sortedTemps = TEMPERATURE_FACTORS.sort((a, b) => a.temp_f - b.temp_f);
    
    if (temp_f <= sortedTemps[0].temp_f) {
      return material === 'copper' ? sortedTemps[0].copper_factor : sortedTemps[0].aluminum_factor;
    }
    
    if (temp_f >= sortedTemps[sortedTemps.length - 1].temp_f) {
      return material === 'copper' ? 
        sortedTemps[sortedTemps.length - 1].copper_factor : 
        sortedTemps[sortedTemps.length - 1].aluminum_factor;
    }
    
    for (let i = 0; i < sortedTemps.length - 1; i++) {
      const lower = sortedTemps[i];
      const upper = sortedTemps[i + 1];
      
      if (temp_f >= lower.temp_f && temp_f <= upper.temp_f) {
        const ratio = (temp_f - lower.temp_f) / (upper.temp_f - lower.temp_f);
        const lowerFactor = material === 'copper' ? lower.copper_factor : lower.aluminum_factor;
        const upperFactor = material === 'copper' ? upper.copper_factor : upper.aluminum_factor;
        return lowerFactor + (upperFactor - lowerFactor) * ratio;
      }
    }
    
    return 1.0; // Fallback
  }, []);

  // Get wire resistance data
  const getWireData = useCallback((awg: string) => {
    return WIRE_RESISTANCE_DATA.find(wire => wire.awg === awg);
  }, []);

  // Calculate resistance for given wire, distance, and temperature
  const calculateResistance = useCallback((awg: string, dist: number, temp: number, mat: 'copper' | 'aluminum'): number => {
    const wireData = getWireData(awg);
    if (!wireData) return 0;
    
    const baseResistance = mat === 'copper' ? wireData.copper_ohms : wireData.aluminum_ohms;
    const tempFactor = getTemperatureFactor(temp, mat);
    const circuitMultiplier = circuitType.multiplier;
    
    return (baseResistance * tempFactor * dist * circuitMultiplier) / 1000;
  }, [getWireData, getTemperatureFactor, circuitType]);

  // Find wire size for voltage drop requirement
  const findWireForVoltageDrop = useCallback((): string => {
    const targetVoltageDrop = (maxVoltageDrop / 100) * voltage;
    const maxAllowedResistance = targetVoltageDrop / current;
    
    for (const wire of WIRE_RESISTANCE_DATA) {
      const resistance = calculateResistance(wire.awg, distance, temperature, material);
      if (resistance <= maxAllowedResistance) {
        return wire.awg;
      }
    }
    
    return WIRE_RESISTANCE_DATA[WIRE_RESISTANCE_DATA.length - 1].awg; // Largest available
  }, [maxVoltageDrop, voltage, current, distance, temperature, material, calculateResistance]);

  // Calculate maximum distance for resistance limit
  const calculateMaxDistance = useCallback((): number => {
    const wireData = getWireData(wireSize);
    if (!wireData) return 0;
    
    const baseResistance = material === 'copper' ? wireData.copper_ohms : wireData.aluminum_ohms;
    const tempFactor = getTemperatureFactor(temperature, material);
    const circuitMultiplier = circuitType.multiplier;
    
    return (maxResistance * 1000) / (baseResistance * tempFactor * circuitMultiplier);
  }, [wireSize, material, temperature, maxResistance, getWireData, getTemperatureFactor, circuitType]);

  // Perform calculations based on mode
  const performCalculations = useCallback(() => {
    switch (calculationMode.mode) {
      case 'Resistance from Wire Size':
        const resistance = calculateResistance(wireSize, distance, temperature, material);
        setCalculatedResistance(Math.round(resistance * 10000) / 10000);
        
        if (current > 0) {
          const voltageDrop = resistance * current;
          const voltageDropPct = (voltageDrop / voltage) * 100;
          const powerLoss = Math.pow(current, 2) * resistance;
          
          setVoltageDropValue(Math.round(voltageDrop * 100) / 100);
          setVoltageDropPercent(Math.round(voltageDropPct * 100) / 100);
          setPowerLoss(Math.round(powerLoss * 100) / 100);
        }
        break;
        
      case 'Wire Size from Voltage Drop':
        const recommendedSize = findWireForVoltageDrop();
        setRecommendedWire(recommendedSize);
        
        const recResistance = calculateResistance(recommendedSize, distance, temperature, material);
        const recVoltageDrop = recResistance * current;
        const recVoltageDropPct = (recVoltageDrop / voltage) * 100;
        
        setCalculatedResistance(Math.round(recResistance * 10000) / 10000);
        setVoltageDropValue(Math.round(recVoltageDrop * 100) / 100);
        setVoltageDropPercent(Math.round(recVoltageDropPct * 100) / 100);
        break;
        
      case 'Distance from Resistance':
        const maxDist = calculateMaxDistance();
        setMaxDistance(Math.round(maxDist));
        
        const distResistance = calculateResistance(wireSize, maxDist, temperature, material);
        setCalculatedResistance(Math.round(distResistance * 10000) / 10000);
        break;
        
      case 'Power Loss Analysis':
        const analysiResistance = calculateResistance(wireSize, distance, temperature, material);
        const analysisVoltageDrop = analysiResistance * current;
        const analysisVoltageDropPct = (analysisVoltageDrop / voltage) * 100;
        const analysisPowerLoss = Math.pow(current, 2) * analysiResistance;
        const efficiency = ((voltage - analysisVoltageDrop) / voltage) * 100;
        
        setCalculatedResistance(Math.round(analysiResistance * 10000) / 10000);
        setVoltageDropValue(Math.round(analysisVoltageDrop * 100) / 100);
        setVoltageDropPercent(Math.round(analysisVoltageDropPct * 100) / 100);
        setPowerLoss(Math.round(analysisPowerLoss * 100) / 100);
        break;
    }
  }, [
    calculationMode, wireSize, material, distance, temperature, current, voltage, 
    maxVoltageDrop, maxResistance, calculateResistance, findWireForVoltageDrop, calculateMaxDistance
  ]);

  useEffect(() => {
    performCalculations();
  }, [performCalculations]);

  // Shareable URL and Print functionality
  const shareableInputs = {
    mode: calculationMode.mode,
    wireSize,
    material,
    distance,
    temperature,
    circuitType: circuitType.type,
    ...(calculationMode.inputs.includes('current') && { current }),
    ...(calculationMode.inputs.includes('voltage') && { voltage }),
    ...(calculationMode.inputs.includes('max_voltage_drop') && { maxVoltageDrop }),
    ...(calculationMode.inputs.includes('max_resistance') && { maxResistance }),
  };

  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    const results: Record<string, string> = {
      'Calculation Mode': calculationMode.mode,
      'Wire Size': wireSize + ' AWG',
      'Material': material.charAt(0).toUpperCase() + material.slice(1),
      'Circuit Type': circuitType.type,
      'Temperature': `${temperature}°F`,
    };

    if (calculationMode.mode === 'Resistance from Wire Size') {
      results['Distance'] = `${distance} feet`;
      results['Resistance'] = `${calculatedResistance} Ω`;
      if (current > 0) {
        results['Voltage Drop'] = `${voltageDropValue}V (${voltageDropPercent}%)`;
        results['Power Loss'] = `${powerLoss}W`;
      }
    } else if (calculationMode.mode === 'Wire Size from Voltage Drop') {
      results['Distance'] = `${distance} feet`;
      results['Current'] = `${current}A`;
      results['Max Voltage Drop'] = `${maxVoltageDrop}%`;
      results['Recommended Wire'] = recommendedWire + ' AWG';
      results['Actual Voltage Drop'] = `${voltageDropValue}V (${voltageDropPercent}%)`;
    } else if (calculationMode.mode === 'Distance from Resistance') {
      results['Max Resistance'] = `${maxResistance} Ω`;
      results['Maximum Distance'] = `${maxDistance} feet`;
    } else if (calculationMode.mode === 'Power Loss Analysis') {
      results['Distance'] = `${distance} feet`;
      results['Current'] = `${current}A`;
      results['Resistance'] = `${calculatedResistance} Ω`;
      results['Voltage Drop'] = `${voltageDropValue}V (${voltageDropPercent}%)`;
      results['Power Loss'] = `${powerLoss}W`;
      results['Efficiency'] = `${((voltage - voltageDropValue) / voltage * 100).toFixed(2)}%`;
    }

    print({
      title: 'Wire Resistance Calculation',
      inputs: shareableInputs,
      results,
    });
  }, [calculationMode, wireSize, material, circuitType, temperature, distance, calculatedResistance, current, voltageDropValue, voltageDropPercent, powerLoss, maxVoltageDrop, recommendedWire, maxResistance, maxDistance, voltage, print, shareableInputs]);

  return (
    <CalculatorLayout
      title="Wire Resistance Calculator"
      description="Calculate wire resistance, voltage drop, and power loss for electrical conductors"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="space-y-6">
        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-800 mb-1">Wire Resistance Analysis</div>
            <div className="text-amber-700">
              Wire resistance calculations are critical for proper circuit design. High resistance causes 
              voltage drop, power loss, and heating. Always consider temperature effects and use appropriate 
              safety factors for critical applications.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              Wire Resistance Parameters
            </h2>

            <div className="space-y-4">
              <Select
                label="Calculation Mode"
                value={calculationMode.mode}
                onChange={(e) => {
                  const selected = CALCULATION_MODES.find(m => m.mode === e.target.value);
                  if (selected) setCalculationMode(selected);
                }}
                options={CALCULATION_MODES.map(mode => ({
                  value: mode.mode,
                  label: mode.mode
                }))}
              />

              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <div className="font-medium mb-1">Calculation Method:</div>
                <div>{calculationMode.description}</div>
              </div>

              {calculationMode.inputs.includes('wire_size') && (
                <Select
                  label="Wire Size (AWG)"
                  value={wireSize}
                  onChange={(e) => setWireSize(e.target.value)}
                  options={WIRE_RESISTANCE_DATA.map(wire => ({
                    value: wire.awg,
                    label: `${wire.awg} AWG`
                  }))}
                />
              )}

              <Select
                label="Wire Material"
                value={material}
                onChange={(e) => setMaterial(e.target.value as 'copper' | 'aluminum')}
                options={[
                  { value: 'copper', label: 'Copper' },
                  { value: 'aluminum', label: 'Aluminum' }
                ]}
              />

              <Select
                label="Circuit Type"
                value={circuitType.type}
                onChange={(e) => {
                  const selected = CIRCUIT_TYPES.find(c => c.type === e.target.value);
                  if (selected) setCircuitType(selected);
                }}
                options={CIRCUIT_TYPES.map(circuit => ({
                  value: circuit.type,
                  label: circuit.type
                }))}
              />

              <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
                <div className="font-medium mb-1">Circuit Factor:</div>
                <div>• Type: {circuitType.type}</div>
                <div>• Multiplier: {circuitType.multiplier.toFixed(3)}</div>
                <div>• Description: {circuitType.description}</div>
              </div>

              {calculationMode.inputs.includes('distance') && (
                <Input
                  label="Distance"
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  suffix="feet"
                  min={1}
                  max={5000}
                  placeholder="100"
                />
              )}

              {calculationMode.inputs.includes('temperature') && (
                <div>
                  <Input
                    label="Temperature"
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    suffix="°F"
                    min={-40}
                    max={200}
                    placeholder="68"
                  />
                  <div className="mt-2 text-xs text-neutral-600">
                    Reference temperature: 68°F (20°C). Factor: {getTemperatureFactor(temperature, material).toFixed(3)}
                  </div>
                </div>
              )}

              {calculationMode.inputs.includes('current') && (
                <Input
                  label="Current"
                  type="number"
                  value={current}
                  onChange={(e) => setCurrent(Number(e.target.value))}
                  suffix="amps"
                  min={0.1}
                  max={1000}
                  step={0.1}
                  placeholder="20"
                />
              )}

              {calculationMode.inputs.includes('voltage') && (
                <Input
                  label="System Voltage"
                  type="number"
                  value={voltage}
                  onChange={(e) => setVoltage(Number(e.target.value))}
                  suffix="volts"
                  min={12}
                  max={1000}
                  placeholder="240"
                />
              )}

              {calculationMode.inputs.includes('max_voltage_drop') && (
                <Input
                  label="Maximum Voltage Drop"
                  type="number"
                  value={maxVoltageDrop}
                  onChange={(e) => setMaxVoltageDrop(Number(e.target.value))}
                  suffix="%"
                  min={0.5}
                  max={10}
                  step={0.1}
                  placeholder="3.0"
                />
              )}

              {calculationMode.inputs.includes('max_resistance') && (
                <Input
                  label="Maximum Resistance"
                  type="number"
                  value={maxResistance}
                  onChange={(e) => setMaxResistance(Number(e.target.value))}
                  suffix="ohms"
                  min={0.001}
                  max={10}
                  step={0.001}
                  placeholder="0.5"
                />
              )}

              {/* Wire Data Table */}
              {calculationMode.inputs.includes('wire_size') && (
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="font-medium text-neutral-900 mb-3 flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    Selected Wire Properties
                  </div>
                  {(() => {
                    const wireData = getWireData(wireSize);
                    if (!wireData) return <div>Wire data not found</div>;
                    
                    const baseResistance = material === 'copper' ? wireData.copper_ohms : wireData.aluminum_ohms;
                    const adjustedResistance = baseResistance * getTemperatureFactor(temperature, material);
                    
                    return (
                      <div className="text-sm text-neutral-600 space-y-1">
                        <div>• Wire Size: {wireData.awg} AWG</div>
                        <div>• Diameter: {wireData.diameter_mils} mils</div>
                        <div>• Base Resistance: {baseResistance} Ω/1000ft (at 68°F)</div>
                        <div>• Temperature Factor: {getTemperatureFactor(temperature, material).toFixed(3)}</div>
                        <div>• Adjusted Resistance: {adjustedResistance.toFixed(4)} Ω/1000ft (at {temperature}°F)</div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Reference Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Calculation Notes:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• Resistance values at 68°F (20°C) reference temperature</li>
                    <li>• Temperature correction applied using material coefficients</li>
                    <li>• Circuit multiplier accounts for conductor configuration</li>
                    <li>• Voltage drop = Current × Resistance</li>
                    <li>• Power loss = Current² × Resistance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Calculation Results
            </h2>

            <div className="space-y-6">
              {/* Results Summary */}
              <div className="bg-neutral-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-neutral-900 text-center mb-4">
                  {calculationMode.mode}
                </h3>
                
                {calculationMode.mode === 'Resistance from Wire Size' && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <div className="text-blue-800 font-semibold">Resistance</div>
                      <div className="text-2xl font-bold text-blue-900">{calculatedResistance} Ω</div>
                    </div>
                    {current > 0 && (
                      <div className="bg-red-100 rounded-lg p-3">
                        <div className="text-red-800 font-semibold">Voltage Drop</div>
                        <div className="text-2xl font-bold text-red-900">{voltageDropPercent}%</div>
                      </div>
                    )}
                  </div>
                )}

                {calculationMode.mode === 'Wire Size from Voltage Drop' && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-green-100 rounded-lg p-3">
                      <div className="text-green-800 font-semibold">Recommended Wire</div>
                      <div className="text-2xl font-bold text-green-900">{recommendedWire} AWG</div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3">
                      <div className="text-blue-800 font-semibold">Actual Drop</div>
                      <div className="text-2xl font-bold text-blue-900">{voltageDropPercent}%</div>
                    </div>
                  </div>
                )}

                {calculationMode.mode === 'Distance from Resistance' && (
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-lg p-4">
                      <div className="text-purple-800 font-semibold">Maximum Distance</div>
                      <div className="text-3xl font-bold text-purple-900">{maxDistance} ft</div>
                    </div>
                  </div>
                )}

                {calculationMode.mode === 'Power Loss Analysis' && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-orange-100 rounded-lg p-3">
                      <div className="text-orange-800 font-semibold">Power Loss</div>
                      <div className="text-2xl font-bold text-orange-900">{powerLoss}W</div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <div className="text-green-800 font-semibold">Efficiency</div>
                      <div className="text-2xl font-bold text-green-900">
                        {voltage > 0 ? ((voltage - voltageDropValue) / voltage * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 text-center text-sm text-neutral-600">
                  {wireSize} AWG {material} • {circuitType.type} • {temperature}°F
                </div>
              </div>

              {/* Detailed Results Table */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="font-medium text-neutral-900 mb-3">Detailed Results</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Wire Size:</span>
                    <span className="font-mono">{calculationMode.mode === 'Wire Size from Voltage Drop' ? recommendedWire : wireSize} AWG</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Material:</span>
                    <span className="capitalize">{material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Circuit Type:</span>
                    <span>{circuitType.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <span>{temperature}°F ({((temperature - 32) * 5/9).toFixed(1)}°C)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resistance:</span>
                    <span>{calculatedResistance} Ω</span>
                  </div>
                  {calculationMode.inputs.includes('distance') && (
                    <div className="flex justify-between">
                      <span>Distance:</span>
                      <span>{calculationMode.mode === 'Distance from Resistance' ? maxDistance : distance} feet</span>
                    </div>
                  )}
                  {current > 0 && voltageDropValue > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>Voltage Drop:</span>
                        <span>{voltageDropValue}V ({voltageDropPercent}%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Power Loss:</span>
                        <span>{powerLoss}W</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Analysis and Recommendations */}
              <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                <div className="font-medium text-neutral-900 mb-2">Analysis & Recommendations:</div>
                <ul className="space-y-1 text-neutral-600">
                  {voltageDropPercent > 5 && (
                    <li className="text-red-600">• High voltage drop detected - consider larger wire size</li>
                  )}
                  {powerLoss > 100 && (
                    <li className="text-orange-600">• Significant power loss - efficiency may be poor</li>
                  )}
                  {temperature > 140 && (
                    <li className="text-red-600">• High temperature increases resistance significantly</li>
                  )}
                  {temperature < 32 && (
                    <li className="text-blue-600">• Low temperature reduces resistance</li>
                  )}
                  <li>• Consider ambient temperature in conduit sizing</li>
                  <li>• Verify actual vs. calculated resistance with measurements</li>
                  <li>• Account for connection resistance in critical applications</li>
                </ul>
              </div>

              {/* Temperature Effects Information */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <Thermometer className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-amber-800 mb-1">Temperature Effects</div>
                  <div className="text-amber-700">
                    Wire resistance increases with temperature. At {temperature}°F, the resistance factor is{' '}
                    {getTemperatureFactor(temperature, material).toFixed(3)} compared to the 68°F reference.
                    High temperatures reduce current-carrying capacity and increase power losses.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}