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
import { Cpu, AlertTriangle, Info, Signal, Camera , Calculator, RefreshCw } from 'lucide-react';

// Low voltage system types
const VOLTAGE_SYSTEMS = [
  {
    system: 'Class 2 - 12VDC',
    voltage: 12,
    type: 'DC',
    max_power: 100,
    description: 'LED lighting, small controls',
    applications: ['LED strips', 'Security sensors', 'Low power devices'],
    wire_types: ['Stranded copper', 'Solid copper', 'Thermostat wire'],
    notes: 'Most common low voltage system'
  },
  {
    system: 'Class 2 - 24VDC',
    voltage: 24,
    type: 'DC',
    max_power: 100,
    description: 'HVAC controls, automation',
    applications: ['Thermostats', 'HVAC dampers', 'Building automation'],
    wire_types: ['Thermostat wire', 'Control cable', 'Plenum rated'],
    notes: 'Common for HVAC and building controls'
  },
  {
    system: 'Class 2 - 24VAC',
    voltage: 24,
    type: 'AC',
    max_power: 100,
    description: 'Doorbell, irrigation, HVAC',
    applications: ['Doorbells', 'Irrigation valves', 'HVAC controls'],
    wire_types: ['Thermostat wire', 'Doorbell wire', 'Irrigation wire'],
    notes: 'Traditional low voltage AC systems'
  },
  {
    system: 'PoE - 48VDC',
    voltage: 48,
    type: 'DC',
    max_power: 90,
    description: 'Power over Ethernet',
    applications: ['IP cameras', 'VoIP phones', 'Wireless access points'],
    wire_types: ['Cat5e', 'Cat6', 'Cat6a'],
    notes: 'IEEE 802.3at standard'
  },
  {
    system: 'Landscape - 12VAC',
    voltage: 12,
    type: 'AC',
    max_power: 300,
    description: 'Outdoor landscape lighting',
    applications: ['Path lights', 'Spotlights', 'Garden lighting'],
    wire_types: ['Direct burial', 'Landscape wire', 'Low voltage cable'],
    notes: 'Outdoor lighting systems'
  },
  {
    system: 'Audio/Video - 75Ω',
    voltage: 12,
    type: 'DC',
    max_power: 50,
    description: 'AV equipment, coax systems',
    applications: ['Security cameras', 'Audio systems', 'Video distribution'],
    wire_types: ['RG6 coax', 'Speaker wire', 'AV cable'],
    notes: 'Impedance-matched systems'
  },
];

// Wire gauges for low voltage (AWG)
const LOW_VOLTAGE_WIRE_GAUGES = [
  { awg: '22', diameter_mm: 0.644, resistance_ohm_1000ft: 16.14, max_amps_12v: 0.92, max_amps_24v: 1.84 },
  { awg: '20', diameter_mm: 0.812, resistance_ohm_1000ft: 10.15, max_amps_12v: 1.5, max_amps_24v: 3.0 },
  { awg: '18', diameter_mm: 1.024, resistance_ohm_1000ft: 6.39, max_amps_12v: 2.3, max_amps_24v: 4.6 },
  { awg: '16', diameter_mm: 1.291, resistance_ohm_1000ft: 4.02, max_amps_12v: 3.7, max_amps_24v: 7.4 },
  { awg: '14', diameter_mm: 1.628, resistance_ohm_1000ft: 2.53, max_amps_12v: 5.9, max_amps_24v: 11.8 },
  { awg: '12', diameter_mm: 2.053, resistance_ohm_1000ft: 1.59, max_amps_12v: 9.3, max_amps_24v: 18.6 },
  { awg: '10', diameter_mm: 2.588, resistance_ohm_1000ft: 1.00, max_amps_12v: 15.0, max_amps_24v: 30.0 },
];

// Load types for low voltage systems
const LOAD_TYPES = [
  {
    type: 'LED Lighting',
    power_per_unit: 3, // Watts
    typical_current_12v: 0.25, // Amps at 12V
    typical_current_24v: 0.125, // Amps at 24V
    description: 'LED strips, bulbs, fixtures',
    voltage_drop_sensitivity: 'High'
  },
  {
    type: 'Security Camera',
    power_per_unit: 12,
    typical_current_12v: 1.0,
    typical_current_24v: 0.5,
    description: 'IP cameras, DVR systems',
    voltage_drop_sensitivity: 'Medium'
  },
  {
    type: 'HVAC Control',
    power_per_unit: 8,
    typical_current_12v: 0.67,
    typical_current_24v: 0.33,
    description: 'Thermostats, dampers, sensors',
    voltage_drop_sensitivity: 'Low'
  },
  {
    type: 'Irrigation Valve',
    power_per_unit: 20,
    typical_current_12v: 1.67,
    typical_current_24v: 0.83,
    description: 'Solenoid valves, timers',
    voltage_drop_sensitivity: 'Low'
  },
  {
    type: 'Access Control',
    power_per_unit: 5,
    typical_current_12v: 0.42,
    typical_current_24v: 0.21,
    description: 'Card readers, door strikes',
    voltage_drop_sensitivity: 'Medium'
  },
  {
    type: 'Audio Equipment',
    power_per_unit: 15,
    typical_current_12v: 1.25,
    typical_current_24v: 0.625,
    description: 'Speakers, amplifiers',
    voltage_drop_sensitivity: 'High'
  },
];

export function LowVoltageCalculator() {
  const [voltageSystem, setVoltageSystem] = useState(VOLTAGE_SYSTEMS[0]); // Default to 12VDC
  const [loadType, setLoadType] = useState(LOAD_TYPES[0]); // Default to LED lighting
  const [totalCurrent, setTotalCurrent] = useState(2.0); // Total circuit current
  const [distance, setDistance] = useState(100); // Distance in feet
  const [maxVoltageDrop, setMaxVoltageDrop] = useState(3.0); // Max voltage drop percentage
  const [numberOfLoads, setNumberOfLoads] = useState(8);
  const [useCalculatedCurrent, setUseCalculatedCurrent] = useState(true);
  const [recommendedWire, setRecommendedWire] = useState<typeof LOW_VOLTAGE_WIRE_GAUGES[0] | null>(null);
  const [voltageDropPercent, setVoltageDropPercent] = useState(0);
  const [voltageAtLoad, setVoltageAtLoad] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculate total current based on load type and quantity
  const getCalculatedCurrent = useCallback((): number => {
    const currentPerLoad = voltageSystem.voltage === 12 ? 
      loadType.typical_current_12v : 
      loadType.typical_current_24v;
    
    return Math.ceil(currentPerLoad * numberOfLoads * 100) / 100;
  }, [voltageSystem, loadType, numberOfLoads]);

  // Get effective current for calculation
  const getEffectiveCurrent = useCallback((): number => {
    return useCalculatedCurrent ? getCalculatedCurrent() : totalCurrent;
  }, [useCalculatedCurrent, getCalculatedCurrent, totalCurrent]);

  // Calculate voltage drop and wire size
  const calculateLowVoltage = useCallback(() => {
    const effectiveCurrent = getEffectiveCurrent();
    let selectedWire = null;
    let calculatedVoltageDrop = 0;
    let calculatedVoltageAtLoad = 0;

    // Find the smallest wire gauge that meets voltage drop requirements
    for (const wire of LOW_VOLTAGE_WIRE_GAUGES) {
      // Check current capacity first
      const maxCurrentForVoltage = voltageSystem.voltage === 12 ? 
        wire.max_amps_12v : 
        wire.max_amps_24v;

      if (effectiveCurrent > maxCurrentForVoltage) {
        continue; // Wire too small for current
      }

      // Calculate voltage drop: VD = 2 × I × R × L / 1000
      // Factor of 2 for round trip, R is resistance per 1000ft, L is distance
      const voltageDrop = (2 * effectiveCurrent * wire.resistance_ohm_1000ft * distance) / 1000;
      const voltageDropPercentage = (voltageDrop / voltageSystem.voltage) * 100;

      if (voltageDropPercentage <= maxVoltageDrop) {
        selectedWire = wire;
        calculatedVoltageDrop = voltageDropPercentage;
        calculatedVoltageAtLoad = voltageSystem.voltage - voltageDrop;
        break;
      }
    }

    // If no wire meets requirements, use the largest available
    if (!selectedWire) {
      const largestWire = LOW_VOLTAGE_WIRE_GAUGES[LOW_VOLTAGE_WIRE_GAUGES.length - 1];
      const voltageDrop = (2 * effectiveCurrent * largestWire.resistance_ohm_1000ft * distance) / 1000;
      selectedWire = largestWire;
      calculatedVoltageDrop = (voltageDrop / voltageSystem.voltage) * 100;
      calculatedVoltageAtLoad = voltageSystem.voltage - voltageDrop;
    }

    setRecommendedWire(selectedWire);
    setVoltageDropPercent(Math.ceil(calculatedVoltageDrop * 100) / 100);
    setVoltageAtLoad(Math.ceil(calculatedVoltageAtLoad * 100) / 100);
  }, [voltageSystem, distance, maxVoltageDrop, getEffectiveCurrent]);

  const performCalculation = useCallback(() => {
    calculateLowVoltage();
    setShowResults(true);
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }, [calculateLowVoltage]);

  const handleReset = () => {
    setShowResults(false);
    // Reset form fields as needed
  };

  // Auto-calculation disabled - user must click Calculate button
  // useEffect(() => {
  //   getCalculatedCurrent();
  // }, [getCalculatedCurrent]);

  const effectiveCurrent = getEffectiveCurrent();
  const calculatedCurrent = getCalculatedCurrent();

  // Shareable URL and Print functionality
  const shareableInputs = {
    system: voltageSystem.system,
    loadType: loadType.type,
    current: useCalculatedCurrent ? `calculated-${calculatedCurrent}` : totalCurrent,
    distance,
    maxVoltageDrop,
    ...(useCalculatedCurrent && { numberOfLoads }),
  };

  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!recommendedWire) return;
    print({
      title: 'Low Voltage Circuit Calculation',
      inputs: {
        'Voltage System': voltageSystem.system,
        'Load Type': loadType.type,
        'Circuit Current': `${effectiveCurrent}A`,
        'Distance': `${distance} feet`,
        'Max Voltage Drop': `${maxVoltageDrop}%`,
        ...(useCalculatedCurrent && { 'Number of Loads': numberOfLoads.toString() }),
      },
      results: {
        'Recommended Wire': `${recommendedWire.awg} AWG`,
        'Wire Resistance': `${recommendedWire.resistance_ohm_1000ft} Ω/1000ft`,
        'Voltage Drop': `${voltageDropPercent}%`,
        'Voltage at Load': `${voltageAtLoad}V`,
        'Current Capacity': `${voltageSystem.voltage === 12 ? recommendedWire.max_amps_12v : recommendedWire.max_amps_24v}A`,
      },
    });
  }, [voltageSystem, loadType, effectiveCurrent, distance, maxVoltageDrop, useCalculatedCurrent, numberOfLoads, recommendedWire, voltageDropPercent, voltageAtLoad, print]);

  // Get compliance status
  const getComplianceStatus = useCallback((): { isCompliant: boolean; warnings: string[] } => {
    const warnings: string[] = [];
    let isCompliant = true;

    if (voltageDropPercent > maxVoltageDrop) {
      warnings.push(`Voltage drop (${voltageDropPercent}%) exceeds maximum (${maxVoltageDrop}%)`);
      isCompliant = false;
    }

    if (voltageAtLoad < voltageSystem.voltage * 0.9) {
      warnings.push('Voltage at load may be insufficient for proper operation');
    }

    if (loadType.voltage_drop_sensitivity === 'High' && voltageDropPercent > 2) {
      warnings.push(`${loadType.type} is sensitive to voltage drop - consider larger wire`);
    }

    if (distance > 500) {
      warnings.push('Long low voltage runs may require special consideration');
    }

    if (voltageSystem.system.includes('PoE') && distance > 328) {
      warnings.push('PoE has maximum distance limitation of 328 feet (100 meters)');
    }

    if (voltageSystem.system.includes('Landscape') && voltageSystem.type === 'AC') {
      warnings.push('Use direct burial rated wire for outdoor installations');
    }

    if (voltageSystem.voltage <= 12 && effectiveCurrent > 10) {
      warnings.push('High current at low voltage - verify power supply capacity');
    }

    warnings.push('Verify power supply capacity for total connected load');
    warnings.push('Use appropriate wire type for installation environment');
    warnings.push('Follow manufacturer specifications for connections');

    return { isCompliant, warnings };
  }, [voltageDropPercent, maxVoltageDrop, voltageAtLoad, voltageSystem, loadType, distance, effectiveCurrent]);

  const compliance = getComplianceStatus();

  return (
    <CalculatorLayout
      title="Low Voltage Calculator"
      description="Calculate wire size for low voltage and Class 2 electrical systems"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="space-y-6">
        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-800 mb-1">Low Voltage System Safety</div>
            <div className="text-amber-700">
              Low voltage systems under 50V are generally safer but still require proper installation practices. 
              Use appropriate wire types for the environment, verify power supply capacity, and follow 
              manufacturer specifications. Class 2 circuits are limited to 100VA per NEC Article 725.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary-600" />
              Low Voltage System Configuration
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
                <div className="font-medium mb-1">System Details:</div>
                <div>• Voltage: {voltageSystem.voltage}V {voltageSystem.type}</div>
                <div>• Max Power: {voltageSystem.max_power}W (Class 2)</div>
                <div>• Description: {voltageSystem.description}</div>
                <div className="mt-2 text-xs">
                  <div className="font-medium text-neutral-700 mb-1">Applications:</div>
                  {voltageSystem.applications.map((app, index) => (
                    <div key={index}>• {app}</div>
                  ))}
                </div>
                <div className="mt-2 text-xs">
                  <div className="font-medium text-neutral-700 mb-1">Wire Types:</div>
                  {voltageSystem.wire_types.map((wire, index) => (
                    <div key={index}>• {wire}</div>
                  ))}
                </div>
                <div className="mt-1 text-xs text-neutral-500">{voltageSystem.notes}</div>
              </div>

              <Select
                label="Load Type"
                value={loadType.type}
                onChange={(e) => {
                  const selected = LOAD_TYPES.find(l => l.type === e.target.value);
                  if (selected) setLoadType(selected);
                }}
                options={LOAD_TYPES.map(load => ({
                  value: load.type,
                  label: load.type
                }))}
              />

              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <div className="font-medium mb-1">Load Characteristics:</div>
                <div>• Type: {loadType.type}</div>
                <div>• Power per Unit: {loadType.power_per_unit}W</div>
                <div>• Current at {voltageSystem.voltage}V: {voltageSystem.voltage === 12 ? loadType.typical_current_12v : loadType.typical_current_24v}A</div>
                <div>• Voltage Drop Sensitivity: {loadType.voltage_drop_sensitivity}</div>
                <div className="mt-1 text-xs text-blue-600">{loadType.description}</div>
              </div>

              {/* Current Calculation Method */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="font-medium text-neutral-900 mb-3">Current Calculation</div>
                
                <Select
                  label="Current Method"
                  value={useCalculatedCurrent ? 'calculated' : 'manual'}
                  onChange={(e) => setUseCalculatedCurrent(e.target.value === 'calculated')}
                  options={[
                    { value: 'calculated', label: 'Calculate from load quantity' },
                    { value: 'manual', label: 'Enter total current manually' }
                  ]}
                />

                {useCalculatedCurrent ? (
                  <div className="mt-3">
                    <Input
                      label="Number of Loads"
                      type="number"
                      value={numberOfLoads}
                      onChange={(e) => setNumberOfLoads(Number(e.target.value))}
                      suffix="units"
                      min={1}
                      max={100}
                      placeholder="8"
                    />
                    <div className="mt-2 p-3 bg-neutral-50 rounded text-sm text-neutral-600">
                      Calculated Total Current: <strong>{calculatedCurrent}A</strong>
                      <br />({numberOfLoads} × {voltageSystem.voltage === 12 ? loadType.typical_current_12v : loadType.typical_current_24v}A per unit)
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <Input
                      label="Total Circuit Current"
                      type="number"
                      value={totalCurrent}
                      onChange={(e) => setTotalCurrent(Number(e.target.value))}
                      suffix="amps"
                      min={0.1}
                      max={50}
                      step={0.1}
                      placeholder="2.0"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Distance"
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  suffix="feet"
                  min={1}
                  max={1000}
                  placeholder="100"
                />

                <Input
                  label="Max Voltage Drop"
                  type="number"
                  value={maxVoltageDrop}
                  onChange={(e) => setMaxVoltageDrop(Number(e.target.value))}
                  suffix="%"
                  min={1}
                  max={10}
                  step={0.5}
                  placeholder="3.0"
                />
              </div>

              {/* Wire Gauge Reference Table */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="font-medium text-neutral-900 mb-3">Wire Gauge Reference</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-neutral-300">
                        <th className="px-2 py-1 text-left">AWG</th>
                        <th className="px-2 py-1 text-left">Resistance</th>
                        <th className="px-2 py-1 text-left">12V Max</th>
                        <th className="px-2 py-1 text-left">24V Max</th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-600">
                      {LOW_VOLTAGE_WIRE_GAUGES.map((wire) => (
                        <tr key={wire.awg} className={`border-b border-neutral-200 ${recommendedWire?.awg === wire.awg ? 'bg-green-100' : ''}`}>
                          <td className="px-2 py-1 font-mono">{wire.awg}</td>
                          <td className="px-2 py-1">{wire.resistance_ohm_1000ft.toFixed(2)} Ω</td>
                          <td className="px-2 py-1">{wire.max_amps_12v}A</td>
                          <td className="px-2 py-1">{wire.max_amps_24v}A</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* NEC Reference */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Code References:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• NEC Article 725: Class 1, 2, and 3 circuits</li>
                    <li>• NEC 725.121: Class 2 circuit power limitations</li>
                    <li>• NEC 725.136: Installation requirements</li>
                    <li>• Industry standards for voltage drop limits</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Low Voltage Wire Size Results
            </h2>

            {recommendedWire && (
              <div className="space-y-6">
                {/* Low Voltage Summary */}
                <div className="bg-neutral-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 text-center mb-4">
                    Low Voltage Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <div className="text-blue-800 font-semibold">Recommended Wire</div>
                      <div className="text-2xl font-bold text-blue-900">{recommendedWire.awg} AWG</div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <div className="text-green-800 font-semibold">Voltage Drop</div>
                      <div className="text-2xl font-bold text-green-900">{voltageDropPercent}%</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                    <div className="bg-purple-100 rounded-lg p-2">
                      <div className="text-purple-800 font-semibold text-sm">Current</div>
                      <div className="text-lg font-bold text-purple-900">{effectiveCurrent}A</div>
                    </div>
                    <div className="bg-orange-100 rounded-lg p-2">
                      <div className="text-orange-800 font-semibold text-sm">Voltage at Load</div>
                      <div className="text-lg font-bold text-orange-900">{voltageAtLoad}V</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm text-neutral-600">
                    {voltageSystem.system} • {loadType.type} • {distance} feet
                  </div>
                </div>

                {/* Wire Specifications */}
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="font-medium text-neutral-900 mb-3 flex items-center gap-2">
                    <Signal className="w-4 h-4" />
                    Wire Specifications
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
                    <div>
                      <div className="font-medium">Wire Gauge:</div>
                      <div>{recommendedWire.awg} AWG</div>
                    </div>
                    <div>
                      <div className="font-medium">Wire Diameter:</div>
                      <div>{recommendedWire.diameter_mm} mm</div>
                    </div>
                    <div>
                      <div className="font-medium">Resistance:</div>
                      <div>{recommendedWire.resistance_ohm_1000ft} Ω/1000ft</div>
                    </div>
                    <div>
                      <div className="font-medium">Current Capacity:</div>
                      <div>{voltageSystem.voltage === 12 ? recommendedWire.max_amps_12v : recommendedWire.max_amps_24v}A at {voltageSystem.voltage}V</div>
                    </div>
                  </div>
                </div>

                {/* Results Display */}
                <div className="grid gap-4">
                  <div className={`rounded-lg p-4 border-2 ${compliance.isCompliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-neutral-900">Circuit Analysis</div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${compliance.isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {compliance.isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Recommended Wire:</span>
                        <span className="font-mono">{recommendedWire.awg} AWG</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Voltage Drop:</span>
                        <span className={voltageDropPercent > maxVoltageDrop ? 'text-red-600 font-medium' : ''}>{voltageDropPercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Voltage at Load:</span>
                        <span>{voltageAtLoad}V</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wire Resistance:</span>
                        <span>{recommendedWire.resistance_ohm_1000ft} Ω/1000ft</span>
                      </div>
                    </div>

                    {compliance.warnings.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-neutral-300">
                        <div className="font-medium text-neutral-900 mb-2">Considerations:</div>
                        <ul className="space-y-1 text-xs text-neutral-600">
                          {compliance.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Installation Guidelines */}
                <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                  <div className="font-medium text-neutral-900 mb-2">Installation Guidelines:</div>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• Use appropriate wire type for installation environment</li>
                    <li>• Verify power supply capacity for total connected load</li>
                    <li>• Keep low voltage wiring separated from high voltage</li>
                    <li>• Use proper connectors and junction methods</li>
                    <li>• Consider future expansion when sizing power supply</li>
                    <li>• Test voltage at loads before final connections</li>
                    <li>• Label circuits for identification and maintenance</li>
                  </ul>
                </div>

                {/* System Specific Notes */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                  <Camera className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-purple-800 mb-1">{voltageSystem.system} Considerations</div>
                    <div className="text-purple-700">
                      {voltageSystem.system.includes('PoE') && 'PoE systems require Cat5e or better cable and have distance limitations. Use PoE-rated equipment.'}
                      {voltageSystem.system.includes('Landscape') && 'Outdoor installations require direct burial or conduit-rated wire. Consider GFCI protection.'}
                      {voltageSystem.system.includes('Class 2') && 'Class 2 circuits are power-limited for safety. Keep separate from Class 1 and power circuits.'}
                      {voltageSystem.system.includes('Audio') && 'Audio systems may require impedance matching and shielded cables to prevent interference.'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!recommendedWire && (
              <div className="text-center py-8 text-neutral-500">
                Configure low voltage parameters to see wire size recommendations
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}