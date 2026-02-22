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
import { ChefHat, AlertTriangle, Info, Flame , Calculator, RefreshCw } from 'lucide-react';

// Range/cooktop types and their typical ratings
const RANGE_TYPES = [
  {
    type: 'Small Electric Range',
    nameplate: 20.0,
    voltage: 240,
    kw: 4.8,
    description: 'Compact apartment-size range',
    notes: 'Basic 2-3 burner units'
  },
  {
    type: 'Standard Electric Range',
    nameplate: 40.0,
    voltage: 240,
    kw: 9.6,
    description: 'Most common residential range',
    notes: '4 burners with standard oven'
  },
  {
    type: 'Large Electric Range',
    nameplate: 50.0,
    voltage: 240,
    kw: 12.0,
    description: 'Large residential range',
    notes: '4-6 burners with large oven'
  },
  {
    type: 'Commercial-Style Range',
    nameplate: 60.0,
    voltage: 240,
    kw: 14.4,
    description: 'High-end residential range',
    notes: 'Professional-style features'
  },
  {
    type: 'Electric Cooktop (4-burner)',
    nameplate: 30.0,
    voltage: 240,
    kw: 7.2,
    description: 'Separate cooktop installation',
    notes: 'Requires separate oven circuit'
  },
  {
    type: 'Induction Cooktop',
    nameplate: 35.0,
    voltage: 240,
    kw: 8.4,
    description: 'Energy efficient induction',
    notes: 'Higher efficiency than standard electric'
  },
  {
    type: 'Gas Range',
    nameplate: 15.0,
    voltage: 120,
    kw: 1.8,
    description: 'Gas cooking with electric ignition',
    notes: 'Requires gas line installation'
  },
  {
    type: 'Dual Fuel Range',
    nameplate: 45.0,
    voltage: 240,
    kw: 10.8,
    description: 'Gas cooktop, electric oven',
    notes: 'Requires both gas and 240V electric'
  },
];

// Demand factors per NEC Table 220.55
const DEMAND_FACTORS = [
  {
    type: 'Single Range (Standard)',
    factor: 0.8,
    description: 'NEC Table 220.55 - 80% demand for most ranges'
  },
  {
    type: 'High-End Range',
    factor: 1.0,
    description: 'No demand factor for premium units'
  },
  {
    type: 'Cooktop Only',
    factor: 0.8,
    description: '80% demand factor for cooktops'
  },
];

// Installation types
const INSTALLATION_TYPES = [
  {
    type: 'Hardwired',
    description: 'Direct connection to junction box',
    preferred: true
  },
  {
    type: 'Outlet (NEMA 14-50)',
    description: '50A outlet with range cord',
    preferred: true
  },
  {
    type: 'Outlet (NEMA 14-40)',
    description: '40A outlet (older installations)',
    preferred: false
  },
  {
    type: 'Outlet (NEMA 10-50)',
    description: '3-wire outlet (not for new installations)',
    preferred: false
  },
];

export function RangeCalculator() {
  const [rangeType, setRangeType] = useState(RANGE_TYPES[1]); // Default to standard electric
  const [demandFactor, setDemandFactor] = useState(DEMAND_FACTORS[0]); // Default to standard
  const [installationType, setInstallationType] = useState(INSTALLATION_TYPES[0]); // Default to hardwired
  const [distance, setDistance] = useState(40);
  const [hasExistingCircuit, setHasExistingCircuit] = useState(false);
  const [existingBreakerSize, setExistingBreakerSize] = useState(40);
  const [copperResult, setCopperResult] = useState<WireSizeResult | null>(null);
  const [aluminumResult, setAluminumResult] = useState<WireSizeResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculate demand load per NEC
  const getDemandLoad = useCallback((): number => {
    const demandLoad = rangeType.nameplate * demandFactor.factor;
    return Math.ceil(demandLoad * 100) / 100;
  }, [rangeType, demandFactor]);

  // Get recommended breaker size
  const getRecommendedBreakerSize = useCallback((): number => {
    const demandLoad = getDemandLoad();
    
    // Breaker sizing per NEC 210.19(A)(3) and 422.11(A)
    if (demandLoad <= 30) return 40;
    if (demandLoad <= 40) return 50;
    if (demandLoad <= 50) return 60;
    return Math.ceil(demandLoad / 10) * 10 + 10; // Round up to next 10A + 10A margin
  }, [getDemandLoad]);

  // Get recommended outlet type
  const getRecommendedOutlet = useCallback((): string => {
    const breakerSize = getRecommendedBreakerSize();
    
    if (rangeType.voltage === 120) {
      return 'NEMA 5-20R (120V, 20A)';
    } else if (breakerSize >= 60) {
      return 'NEMA 14-50R (240V, 50A) - Hardwired preferred';
    } else if (breakerSize >= 50) {
      return 'NEMA 14-50R (240V, 50A)';
    } else {
      return 'NEMA 14-40R (240V, 40A) or hardwired';
    }
  }, [rangeType, getRecommendedBreakerSize]);

  const calculate = useCallback(() => {
    const demandLoad = getDemandLoad();
    
    // Calculate wire sizes for both materials
    const baseInput: Omit<WireSizeInput, 'material'> = {
      amps: demandLoad,
      distance,
      voltage: rangeType.voltage === 240 ? 240 : 120,
      phase: 'single',
    };

    const copperWire = calculateWireSize({ ...baseInput, material: 'copper' });
    const aluminumWire = calculateWireSize({ ...baseInput, material: 'aluminum' });

    // Add range-specific warnings
    const rangeWarnings = [];
    
    const breakerSize = getRecommendedBreakerSize();
    
    if (hasExistingCircuit && existingBreakerSize < breakerSize) {
      rangeWarnings.push(`Existing ${existingBreakerSize}A breaker insufficient - need ${breakerSize}A minimum`);
    }
    
    if (installationType.type.includes('NEMA 10-50') || installationType.type.includes('NEMA 14-40')) {
      rangeWarnings.push('Consider upgrading to NEMA 14-50 outlet for better compatibility');
    }
    
    if (rangeType.voltage === 240 && demandLoad > 40) {
      rangeWarnings.push('High-amperage ranges often require hardwired connection');
    }
    
    if (distance > 75) {
      rangeWarnings.push('Long runs may affect range performance - verify voltage at appliance');
    }
    
    if (rangeType.type.includes('Gas') || rangeType.type.includes('Dual Fuel')) {
      rangeWarnings.push('Gas ranges require proper gas line installation');
      rangeWarnings.push('Ensure adequate combustion air supply');
    }
    
    if (rangeType.type.includes('Induction')) {
      rangeWarnings.push('Induction cooktops may require dedicated EMI filtering');
    }
    
    rangeWarnings.push('Install dedicated circuit - no other loads permitted');
    rangeWarnings.push('Ensure proper grounding per NEC requirements');
    rangeWarnings.push(`Use ${breakerSize}A breaker minimum for this range`);

    setCopperResult({
      ...copperWire,
      warnings: [...copperWire.warnings, ...rangeWarnings]
    });
    
    setAluminumResult({
      ...aluminumWire,
      warnings: [...aluminumWire.warnings, ...rangeWarnings]
    });
  }, [rangeType, demandFactor, installationType, distance, hasExistingCircuit, existingBreakerSize, getDemandLoad, getRecommendedBreakerSize]);

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

  const demandLoad = getDemandLoad();
  const recommendedBreakerSize = getRecommendedBreakerSize();
  const recommendedOutlet = getRecommendedOutlet();

  // Shareable URL and Print functionality
  const shareableInputs = {
    range: rangeType.type,
    demandFactor: demandFactor.type,
    installation: installationType.type,
    distance,
    existingCircuit: hasExistingCircuit ? `${existingBreakerSize}A` : 'none',
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
      title: 'Range/Cooktop Circuit Calculation',
      inputs: {
        'Range Type': rangeType.type,
        'Nameplate Current': `${rangeType.nameplate}A`,
        'kW Rating': `${rangeType.kw} kW`,
        'Voltage': `${rangeType.voltage}V`,
        'Demand Factor': demandFactor.type,
        'Installation Type': installationType.type,
        'Distance': `${distance} feet`,
        'Existing Circuit': hasExistingCircuit ? `${existingBreakerSize}A` : 'None',
      },
      results: {
        'Nameplate Load': `${rangeType.nameplate}A`,
        'Demand Load': `${demandLoad}A`,
        'Recommended Breaker': `${recommendedBreakerSize}A`,
        'Recommended Outlet': recommendedOutlet,
        'Copper Wire': copperResult.awg + ' AWG',
        'Aluminum Wire': aluminumResult?.awg + ' AWG' || 'N/A',
      },
    });
  }, [rangeType, demandFactor, installationType, distance, hasExistingCircuit, existingBreakerSize, demandLoad, recommendedBreakerSize, recommendedOutlet, copperResult, aluminumResult, print]);

  return (
    <CalculatorLayout
      title="Range/Cooktop Wire Size Calculator"
      description="Calculate wire size for electric ranges and cooktops per NEC Table 220.55"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="space-y-6">
        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-800 mb-1">Range Installation Safety</div>
            <div className="text-amber-700">
              Range circuits require dedicated high-amperage wiring and proper grounding. 
              Always verify nameplate requirements and local code compliance. 
              Gas ranges require additional gas line installation by qualified professionals.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary-600" />
              Range Configuration
            </h2>

            <div className="space-y-4">
              <Select
                label="Range/Cooktop Type"
                value={rangeType.type}
                onChange={(e) => {
                  const selected = RANGE_TYPES.find(r => r.type === e.target.value);
                  if (selected) setRangeType(selected);
                }}
                options={RANGE_TYPES.map(range => ({
                  value: range.type,
                  label: `${range.type} (${range.nameplate}A, ${range.kw}kW)`
                }))}
              />

              <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
                <div className="font-medium mb-1">Selected Appliance Details:</div>
                <div>• Type: {rangeType.type}</div>
                <div>• Nameplate Current: {rangeType.nameplate}A</div>
                <div>• Power Rating: {rangeType.kw} kW</div>
                <div>• Voltage: {rangeType.voltage}V</div>
                <div>• Description: {rangeType.description}</div>
                <div className="mt-1 text-xs text-neutral-500">{rangeType.notes}</div>
              </div>

              <Select
                label="Demand Factor (NEC Table 220.55)"
                value={demandFactor.type}
                onChange={(e) => {
                  const selected = DEMAND_FACTORS.find(d => d.type === e.target.value);
                  if (selected) setDemandFactor(selected);
                }}
                options={DEMAND_FACTORS.map(factor => ({
                  value: factor.type,
                  label: `${factor.type} (${(factor.factor * 100).toFixed(0)}%)`
                }))}
              />

              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <div className="font-medium mb-1">Demand Calculation:</div>
                <div>• Nameplate Load: {rangeType.nameplate}A</div>
                <div>• Demand Factor: {(demandFactor.factor * 100).toFixed(0)}%</div>
                <div>• Demand Load: <strong>{demandLoad}A</strong></div>
                <div className="mt-1 text-xs text-blue-600">{demandFactor.description}</div>
              </div>

              <Select
                label="Installation Type"
                value={installationType.type}
                onChange={(e) => {
                  const selected = INSTALLATION_TYPES.find(i => i.type === e.target.value);
                  if (selected) setInstallationType(selected);
                }}
                options={INSTALLATION_TYPES.map(inst => ({
                  value: inst.type,
                  label: inst.type + (inst.preferred ? '' : ' (not recommended)')
                }))}
              />

              <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
                <div className="font-medium mb-1">Installation Details:</div>
                <div>• Type: {installationType.type}</div>
                <div>• Description: {installationType.description}</div>
                {!installationType.preferred && (
                  <div className="text-amber-600 mt-1 text-xs font-medium">
                    ⚠ Not recommended for new installations
                  </div>
                )}
              </div>

              <Input
                label="Distance from Panel to Range"
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                suffix="feet"
                min={1}
                max={150}
                placeholder="40"
              />

              {/* Existing Circuit Section */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="font-medium text-neutral-900 mb-3">Existing Circuit</div>
                
                <Select
                  label="Existing Circuit"
                  value={hasExistingCircuit ? 'yes' : 'no'}
                  onChange={(e) => setHasExistingCircuit(e.target.value === 'yes')}
                  options={[
                    { value: 'no', label: 'New installation' },
                    { value: 'yes', label: 'Existing circuit present' }
                  ]}
                />

                {hasExistingCircuit && (
                  <div className="mt-3">
                    <Input
                      label="Existing Breaker Size"
                      type="number"
                      value={existingBreakerSize}
                      onChange={(e) => setExistingBreakerSize(Number(e.target.value))}
                      suffix="amps"
                      min={15}
                      max={100}
                      step={5}
                      placeholder="40"
                    />
                    
                    {existingBreakerSize < recommendedBreakerSize && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                        <div className="font-medium">⚠ Breaker Undersized</div>
                        <div>Existing {existingBreakerSize}A breaker is too small. Need minimum {recommendedBreakerSize}A.</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Circuit Requirements */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Circuit Requirements
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• Demand Load: {demandLoad}A</div>
                  <div>• Recommended Breaker: {recommendedBreakerSize}A</div>
                  <div>• Recommended Outlet: {recommendedOutlet}</div>
                </div>
              </div>

              {/* NEC Reference */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">NEC Requirements:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• NEC Table 220.55: Range demand factors</li>
                    <li>• NEC 210.19(A)(3): Branch circuit sizing</li>
                    <li>• NEC 422.11(A): Range overcurrent protection</li>
                    <li>• NEC 250.140: Grounding requirements</li>
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
                  amps={demandLoad}
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
                    necReference="NEC Table 220.55, 210.19(A)(3), Table 310.16"
                  />

                  <CalculatorResult
                    awg={aluminumResult.awg}
                    ampacity={aluminumResult.ampacity}
                    voltageDropPercent={aluminumResult.voltageDropPercent}
                    groundWire={aluminumResult.groundWire}
                    material="aluminum"
                    isCompliant={aluminumResult.isCompliant}
                    warnings={aluminumResult.warnings}
                    necReference="NEC Table 220.55, 210.19(A)(3), Table 310.16"
                  />
                </div>

                {/* Installation Information */}
                <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                  <div className="font-medium text-neutral-900 mb-2">Installation Requirements:</div>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• Install dedicated circuit breaker - no other loads</li>
                    <li>• Use proper range cord or hardwired connection</li>
                    <li>• Ensure outlet is accessible but not directly behind range</li>
                    <li>• Bond appliance to equipment grounding conductor</li>
                    <li>• Install anti-tip bracket per manufacturer instructions</li>
                    <li>• Verify outlet height per manufacturer specifications</li>
                    <li>• For gas ranges: install gas shut-off valve within 6 feet</li>
                    <li>• Test all connections before energizing circuit</li>
                  </ul>
                </div>

                {/* NEC Demand Factor Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-800 mb-1">NEC Demand Factors</div>
                    <div className="text-blue-700">
                      NEC Table 220.55 allows reduced demand factors for ranges because all burners 
                      and the oven are rarely used simultaneously at full capacity. This results 
                      in smaller wire sizes than the full nameplate rating would require.
                    </div>
                  </div>
                </div>

                {/* Induction Cooktop Note */}
                {rangeType.type.includes('Induction') && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                    <ChefHat className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-purple-800 mb-1">Induction Technology</div>
                      <div className="text-purple-700">
                        Induction cooktops are more efficient than traditional electric, converting 
                        ~90% of energy to heat vs ~70% for electric coil. This can result in 
                        faster cooking and lower overall energy consumption.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!copperResult && (
              <div className="text-center py-8 text-neutral-500">
                Select a range type to see wire size recommendations
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}