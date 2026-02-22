'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { CalculatorResult } from './CalculatorResult';
import { WireComparison } from '@/components/visualizations/WireComparison';
import { calculateWireSize, WireSizeInput, WireSizeResult, VoltageLevel } from '@/lib/calculations/wire-sizing';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Snowflake, AlertTriangle, Info, Thermometer, Calculator, RotateCcw } from 'lucide-react';

// Air conditioner unit types and their typical ratings
const AC_UNIT_TYPES = [
  { 
    type: 'Window Unit - 5,000 BTU', 
    btu: 5000,
    tonnage: 0.42,
    voltage: 115,
    amps: 5.0,
    description: 'Small room cooling'
  },
  { 
    type: 'Window Unit - 8,000 BTU', 
    btu: 8000,
    tonnage: 0.67,
    voltage: 115,
    amps: 7.5,
    description: 'Medium room cooling'
  },
  { 
    type: 'Window Unit - 12,000 BTU', 
    btu: 12000,
    tonnage: 1.0,
    voltage: 115,
    amps: 11.0,
    description: 'Large room cooling'
  },
  { 
    type: 'Split System - 1.5 Ton', 
    btu: 18000,
    tonnage: 1.5,
    voltage: 240,
    amps: 8.5,
    description: 'Small home central air'
  },
  { 
    type: 'Split System - 2 Ton', 
    btu: 24000,
    tonnage: 2.0,
    voltage: 240,
    amps: 11.2,
    description: 'Medium home central air'
  },
  { 
    type: 'Split System - 2.5 Ton', 
    btu: 30000,
    tonnage: 2.5,
    voltage: 240,
    amps: 14.0,
    description: 'Large home central air'
  },
  { 
    type: 'Split System - 3 Ton', 
    btu: 36000,
    tonnage: 3.0,
    voltage: 240,
    amps: 16.8,
    description: 'Large home central air'
  },
  { 
    type: 'Split System - 3.5 Ton', 
    btu: 42000,
    tonnage: 3.5,
    voltage: 240,
    amps: 19.6,
    description: 'Very large home central air'
  },
  { 
    type: 'Split System - 4 Ton', 
    btu: 48000,
    tonnage: 4.0,
    voltage: 240,
    amps: 22.4,
    description: 'Large home central air'
  },
  { 
    type: 'Split System - 5 Ton', 
    btu: 60000,
    tonnage: 5.0,
    voltage: 240,
    amps: 28.0,
    description: 'Commercial/large residential'
  },
];

// Efficiency ratings and their impact on current
const EFFICIENCY_RATINGS = [
  {
    type: 'Standard Efficiency (10-12 SEER)',
    multiplier: 1.15,
    description: 'Older or basic units'
  },
  {
    type: 'High Efficiency (13-16 SEER)',
    multiplier: 1.0,
    description: 'Modern standard units'
  },
  {
    type: 'Very High Efficiency (17+ SEER)',
    multiplier: 0.9,
    description: 'Premium efficient units'
  },
  {
    type: 'Heat Pump Mode',
    multiplier: 1.25,
    description: 'Additional heating elements'
  },
];

// Installation types
const INSTALLATION_TYPES = [
  {
    type: 'Dedicated Circuit (Recommended)',
    description: 'AC unit only on this circuit',
    loadFactor: 1.0
  },
  {
    type: 'Shared Circuit',
    description: 'Other loads on same circuit',
    loadFactor: 0.8
  },
];

export function AirConditionerCalculator() {
  const [acUnit, setAcUnit] = useState(AC_UNIT_TYPES[4]); // Default to 2 ton split system
  const [efficiency, setEfficiency] = useState(EFFICIENCY_RATINGS[1]); // Default to high efficiency
  const [installation, setInstallation] = useState(INSTALLATION_TYPES[0]); // Default to dedicated
  const [distance, setDistance] = useState(75);
  const [includeDisconnect, setIncludeDisconnect] = useState(true);
  const [hasHeatStrip, setHasHeatStrip] = useState(false);
  const [heatStripAmps, setHeatStripAmps] = useState(15.0);
  const [copperResult, setCopperResult] = useState<WireSizeResult | null>(null);
  const [aluminumResult, setAluminumResult] = useState<WireSizeResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculate total circuit current
  const calculateTotalAmps = useCallback((): number => {
    let totalAmps = acUnit.amps * efficiency.multiplier;
    
    // Add heat strip load if applicable
    if (hasHeatStrip) {
      totalAmps += heatStripAmps;
    }
    
    // Apply circuit sizing per NEC 440.32 (125% of largest motor + 100% of other loads)
    if (hasHeatStrip) {
      const largestLoad = Math.max(acUnit.amps * efficiency.multiplier, heatStripAmps);
      const smallerLoad = Math.min(acUnit.amps * efficiency.multiplier, heatStripAmps);
      totalAmps = (largestLoad * 1.25) + smallerLoad;
    } else {
      totalAmps = totalAmps * 1.25; // 125% for motor load only
    }
    
    return Math.ceil(totalAmps * 100) / 100; // Round up to nearest 0.01A
  }, [acUnit, efficiency, hasHeatStrip, heatStripAmps]);

  const performCalculation = useCallback(() => {
    const totalAmps = calculateTotalAmps();
    
    // Calculate wire sizes for both materials
    const baseInput: Omit<WireSizeInput, 'material'> = {
      amps: totalAmps,
      distance,
      voltage: acUnit.voltage === 240 ? 240 : 120,
      phase: 'single',
    };

    const copperWire = calculateWireSize({ ...baseInput, material: 'copper' });
    const aluminumWire = calculateWireSize({ ...baseInput, material: 'aluminum' });

    // Add AC-specific warnings
    const acWarnings = [];
    
    if (acUnit.voltage === 115 && acUnit.amps > 10) {
      acWarnings.push('Consider 240V unit for improved efficiency on high-amperage loads');
    }
    
    if (!includeDisconnect) {
      acWarnings.push('Disconnect required within sight of outdoor unit per NEC 440.14');
    }
    
    if (installation.type.includes('Shared')) {
      acWarnings.push('Verify circuit capacity for additional loads - dedicated circuit recommended');
    }
    
    if (distance > 100 && acUnit.voltage === 115) {
      acWarnings.push('Long run on 115V may cause voltage drop issues - verify voltage at unit');
    }
    
    if (hasHeatStrip && heatStripAmps > acUnit.amps) {
      acWarnings.push('Heat strip amperage exceeds AC compressor - verify nameplate ratings');
    }
    
    if (acUnit.tonnage >= 3.0) {
      acWarnings.push('Large AC units may require time delay fuses or HACR breakers');
    }
    
    acWarnings.push('Install disconnect within sight of outdoor condensing unit');
    acWarnings.push('Verify minimum circuit ampacity (MCA) and maximum fuse size (MFS) on nameplate');
    acWarnings.push('HACR-rated breaker required for motor protection');

    setCopperResult({
      ...copperWire,
      warnings: [...copperWire.warnings, ...acWarnings]
    });
    
    setAluminumResult({
      ...aluminumWire,
      warnings: [...aluminumWire.warnings, ...acWarnings]
    });
    setShowResults(true);
    
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }, [acUnit, efficiency, installation, distance, includeDisconnect, hasHeatStrip, heatStripAmps, calculateTotalAmps]);

  useEffect(() => {
    performCalculation();
  }, []);

  const handleReset = () => {
    setAcUnit(AC_UNIT_TYPES[4]); // Reset to 2 ton split system
    setEfficiency(EFFICIENCY_RATINGS[1]); // Reset to high efficiency
    setInstallation(INSTALLATION_TYPES[0]); // Reset to dedicated
    setDistance(75);
    setIncludeDisconnect(true);
    setHasHeatStrip(false);
    setHeatStripAmps(15.0);
    setShowResults(false);
  };

  const totalAmps = calculateTotalAmps();

  // Shareable URL and Print functionality
  const shareableInputs = {
    unit: acUnit.type,
    efficiency: efficiency.type,
    installation: installation.type,
    distance,
    disconnect: includeDisconnect ? 'yes' : 'no',
    ...(hasHeatStrip && { heatStrip: 'yes', heatStripAmps }),
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
      title: 'Air Conditioner Circuit Calculation',
      inputs: {
        'AC Unit': acUnit.type,
        'Efficiency Rating': efficiency.type,
        'Installation Type': installation.type,
        'Distance': `${distance} feet`,
        'Disconnect': includeDisconnect ? 'Included' : 'Not included',
        ...(hasHeatStrip && { 
          'Heat Strip': 'Yes',
          'Heat Strip Amps': `${heatStripAmps}A`
        }),
      },
      results: {
        'Unit Current': `${acUnit.amps}A`,
        'Efficiency Factor': `${efficiency.multiplier}x`,
        'Total Circuit Load': `${totalAmps}A`,
        'Copper Wire': copperResult.awg + ' AWG',
        'Aluminum Wire': aluminumResult?.awg + ' AWG' || 'N/A',
      },
    });
  }, [acUnit, efficiency, installation, distance, includeDisconnect, hasHeatStrip, heatStripAmps, totalAmps, copperResult, aluminumResult, print]);

  return (
    <CalculatorLayout
      title="Air Conditioner Wire Size Calculator"
      description="Calculate wire size for air conditioning units per NEC Article 440"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="space-y-6">
        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-800 mb-1">HVAC Installation Safety</div>
            <div className="text-amber-700">
              Air conditioning electrical installations must comply with NEC Article 440 and manufacturer specifications. 
              Always verify nameplate Minimum Circuit Ampacity (MCA) and Maximum Fuse Size (MFS) ratings before installation.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-primary-600" />
              Air Conditioner Configuration
            </h2>

            <div className="space-y-4">
              <Select
                label="AC Unit Type"
                value={acUnit.type}
                onChange={(e) => {
                  const selected = AC_UNIT_TYPES.find(u => u.type === e.target.value);
                  if (selected) setAcUnit(selected);
                }}
                options={AC_UNIT_TYPES.map(unit => ({
                  value: unit.type,
                  label: `${unit.type} (${unit.voltage}V)`
                }))}
              />

              <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
                <div className="font-medium mb-1">Selected Unit Details:</div>
                <div>• Capacity: {acUnit.btu.toLocaleString()} BTU ({acUnit.tonnage} tons)</div>
                <div>• Voltage: {acUnit.voltage}V</div>
                <div>• Nameplate Current: {acUnit.amps}A</div>
                <div className="mt-1 text-xs text-neutral-500">{acUnit.description}</div>
              </div>

              <Select
                label="Efficiency Rating"
                value={efficiency.type}
                onChange={(e) => {
                  const selected = EFFICIENCY_RATINGS.find(eff => eff.type === e.target.value);
                  if (selected) setEfficiency(selected);
                }}
                options={EFFICIENCY_RATINGS.map(eff => ({
                  value: eff.type,
                  label: eff.type
                }))}
              />

              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <div className="font-medium mb-1">Efficiency Impact:</div>
                <div>• Rating: {efficiency.type}</div>
                <div>• Current Multiplier: {efficiency.multiplier}x</div>
                <div>• Adjusted Current: {Math.round(acUnit.amps * efficiency.multiplier * 100) / 100}A</div>
                <div className="mt-1 text-xs text-blue-600">{efficiency.description}</div>
              </div>

              <Select
                label="Installation Type"
                value={installation.type}
                onChange={(e) => {
                  const selected = INSTALLATION_TYPES.find(i => i.type === e.target.value);
                  if (selected) setInstallation(selected);
                }}
                options={INSTALLATION_TYPES.map(inst => ({
                  value: inst.type,
                  label: inst.type
                }))}
              />

              <Input
                label="Distance from Panel to Unit"
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                suffix="feet"
                min={1}
                max={500}
                placeholder="75"
              />

              <Select
                label="Disconnect Switch"
                value={includeDisconnect ? 'yes' : 'no'}
                onChange={(e) => setIncludeDisconnect(e.target.value === 'yes')}
                options={[
                  { value: 'yes', label: 'Yes (Required by code)' },
                  { value: 'no', label: 'No (Code violation)' }
                ]}
              />

              {/* Heat Strip Section */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Thermometer className="w-4 h-4 text-orange-600" />
                  <label className="font-medium text-neutral-900">Electric Heat Strip (Heat Pump)</label>
                </div>
                
                <Select
                  label="Heat Strip"
                  value={hasHeatStrip ? 'yes' : 'no'}
                  onChange={(e) => setHasHeatStrip(e.target.value === 'yes')}
                  options={[
                    { value: 'no', label: 'No heat strip' },
                    { value: 'yes', label: 'Has electric heat strip' }
                  ]}
                />

                {hasHeatStrip && (
                  <div className="mt-3">
                    <Input
                      label="Heat Strip Amperage"
                      type="number"
                      value={heatStripAmps}
                      onChange={(e) => setHeatStripAmps(Number(e.target.value))}
                      suffix="amps"
                      min={5}
                      max={50}
                      step={0.1}
                      placeholder="15.0"
                    />
                    <div className="mt-2 text-xs text-neutral-600">
                      Check nameplate for exact amperage rating
                    </div>
                  </div>
                )}
              </div>

              {/* Total Circuit Calculation */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-medium text-green-800 mb-2">Circuit Calculation (NEC 440.32):</div>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• AC Current: {acUnit.amps}A × {efficiency.multiplier} = {Math.round(acUnit.amps * efficiency.multiplier * 100) / 100}A</div>
                  {hasHeatStrip && (
                    <div>• Heat Strip: {heatStripAmps}A</div>
                  )}
                  <div>• Total Circuit Load: <strong>{totalAmps}A</strong></div>
                  <div className="text-xs mt-2 text-green-600">
                    125% of largest motor load + 100% of other loads
                  </div>
                </div>
              </div>

              {/* Calculate Button */}
              <Button onClick={performCalculation} className="w-full mb-4">
                <Calculator className="w-4 h-4" />
                Calculate AC Wire Size
              </Button>

              {/* Reset Button */}
              <Button variant="secondary" onClick={handleReset} className="w-full mb-4">
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </Button>

              {/* NEC Reference */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">NEC Requirements:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• NEC 440.32: Circuit sizing for AC equipment</li>
                    <li>• NEC 440.14: Disconnect required within sight of unit</li>
                    <li>• NEC 440.22: Overload protection requirements</li>
                    <li>• Always verify nameplate MCA and MFS ratings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold text-neutral-900">
              Wire Size Results
            </h2>

            {showResults && copperResult && aluminumResult && (
              <div className="space-y-6">
                <WireComparison
                  copperAwg={copperResult.awg}
                  aluminumAwg={aluminumResult.awg}
                  amps={totalAmps}
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
                    necReference="NEC 440.32, 440.14, Table 310.16"
                  />

                  <CalculatorResult
                    awg={aluminumResult.awg}
                    ampacity={aluminumResult.ampacity}
                    voltageDropPercent={aluminumResult.voltageDropPercent}
                    groundWire={aluminumResult.groundWire}
                    material="aluminum"
                    isCompliant={aluminumResult.isCompliant}
                    warnings={aluminumResult.warnings}
                    necReference="NEC 440.32, 440.14, Table 310.16"
                  />
                </div>

                {/* Additional AC Installation Information */}
                <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                  <div className="font-medium text-neutral-900 mb-2">AC Installation Requirements:</div>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• Use HACR-rated circuit breakers for motor protection</li>
                    <li>• Install disconnect within sight of outdoor unit</li>
                    <li>• Verify nameplate MCA (Minimum Circuit Ampacity) rating</li>
                    <li>• Do not exceed nameplate MFS (Maximum Fuse Size)</li>
                    <li>• Use properly sized liquid-tight conduit for connections</li>
                    <li>• Install surge protection for expensive equipment</li>
                    <li>• Bond equipment per NEC grounding requirements</li>
                  </ul>
                </div>

                {/* Efficiency Tip */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Snowflake className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-800 mb-1">Energy Efficiency Tip</div>
                    <div className="text-blue-700">
                      Higher SEER units typically have lower current draw and may allow for smaller wire sizes. 
                      Proper sizing reduces energy costs and improves equipment lifespan.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!showResults && (
              <div className="text-center py-8 text-neutral-500">
                Click "Calculate AC Wire Size" to see wire size recommendations
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}