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
import { Shirt, AlertTriangle, Info, Zap , Calculator, RefreshCw } from 'lucide-react';

// Dryer types and their typical ratings
const DRYER_TYPES = [
  {
    type: 'Gas Dryer (Standard)',
    amperage: 15.0,
    voltage: 120,
    description: 'Gas heating with electric motor and controls',
    notes: 'Requires gas line and 120V electrical'
  },
  {
    type: 'Electric Dryer (Compact)',
    amperage: 24.0,
    voltage: 240,
    description: 'Apartment/condo sized electric dryer',
    notes: 'Typically 3.8-5.0 kW heating element'
  },
  {
    type: 'Electric Dryer (Standard)',
    amperage: 30.0,
    voltage: 240,
    description: 'Standard home electric dryer',
    notes: 'Most common residential electric dryer'
  },
  {
    type: 'Electric Dryer (Large Capacity)',
    amperage: 30.0,
    voltage: 240,
    description: 'Large capacity home dryer',
    notes: 'Higher capacity, same electrical requirements'
  },
  {
    type: 'Commercial Electric Dryer',
    amperage: 50.0,
    voltage: 240,
    description: 'Commercial/multi-family applications',
    notes: 'Heavy-duty commercial units'
  },
  {
    type: 'Heat Pump Dryer',
    amperage: 15.0,
    voltage: 240,
    description: 'Energy efficient heat pump technology',
    notes: 'Lower amperage, higher efficiency'
  },
];

// Outlet types for different dryer configurations
const OUTLET_TYPES = [
  {
    type: 'NEMA 14-30R (4-wire)',
    description: 'Current standard for 30A electric dryers',
    wires: '2 hot, 1 neutral, 1 ground',
    required: true
  },
  {
    type: 'NEMA 10-30R (3-wire)',
    description: 'Older 3-wire outlet (not for new installations)',
    wires: '2 hot, 1 neutral',
    required: false
  },
  {
    type: 'NEMA 14-50R (4-wire)',
    description: 'For commercial 50A dryers',
    wires: '2 hot, 1 neutral, 1 ground',
    required: true
  },
  {
    type: 'NEMA 5-20R (120V)',
    description: 'For gas dryers',
    wires: '1 hot, 1 neutral, 1 ground',
    required: true
  },
];

// Installation environments
const INSTALLATION_ENVIRONMENTS = [
  {
    type: 'Indoor Laundry Room',
    tempFactor: 1.0,
    description: 'Standard indoor installation'
  },
  {
    type: 'Garage/Unheated Space',
    tempFactor: 1.0,
    description: 'Unheated but enclosed space'
  },
  {
    type: 'Basement',
    tempFactor: 0.95,
    description: 'Cooler basement installation'
  },
  {
    type: 'Hot Utility Room',
    tempFactor: 1.15,
    description: 'Near water heater or HVAC equipment'
  },
];

export function DryerCalculator() {
  const [dryerType, setDryerType] = useState(DRYER_TYPES[2]); // Default to standard electric
  const [distance, setDistance] = useState(50);
  const [environment, setEnvironment] = useState(INSTALLATION_ENVIRONMENTS[0]);
  const [hasExistingOutlet, setHasExistingOutlet] = useState(false);
  const [existingOutletType, setExistingOutletType] = useState(OUTLET_TYPES[1]); // Old 3-wire
  const [copperResult, setCopperResult] = useState<WireSizeResult | null>(null);
  const [aluminumResult, setAluminumResult] = useState<WireSizeResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculate adjusted amperage based on environment
  const getAdjustedAmperage = useCallback((): number => {
    return Math.ceil(dryerType.amperage * environment.tempFactor * 100) / 100;
  }, [dryerType, environment]);

  // Get recommended outlet type
  const getRecommendedOutlet = useCallback((): typeof OUTLET_TYPES[0] => {
    if (dryerType.voltage === 120) {
      return OUTLET_TYPES[3]; // NEMA 5-20R for gas dryers
    } else if (dryerType.amperage >= 50) {
      return OUTLET_TYPES[2]; // NEMA 14-50R for commercial
    } else {
      return OUTLET_TYPES[0]; // NEMA 14-30R for standard electric
    }
  }, [dryerType]);

  const calculate = useCallback(() => {
    const adjustedAmps = getAdjustedAmperage();
    
    // Calculate wire sizes for both materials
    const baseInput: WireSizeInput = {
      amps: adjustedAmps,
      distance,
      voltage: dryerType.voltage === 240 ? 240 : 120,
      phase: 'single',
      material: 'copper'
    };

    const copperWire = calculateWireSize({ ...baseInput, material: 'copper' });
    const aluminumWire = calculateWireSize({ ...baseInput, material: 'aluminum' });

    // Add dryer-specific warnings
    const dryerWarnings = [];
    
    if (dryerType.voltage === 240 && dryerType.amperage === 30) {
      dryerWarnings.push('Use NEMA 14-30R outlet for new installations (4-wire with ground)');
    }
    
    if (hasExistingOutlet && !existingOutletType.required) {
      dryerWarnings.push('Existing 3-wire outlet should be upgraded to 4-wire per current code');
    }
    
    if (environment.tempFactor > 1.0) {
      dryerWarnings.push('High temperature environment may require ampacity derating');
    }
    
    if (distance > 100) {
      dryerWarnings.push('Long runs may cause voltage drop - verify dryer performance');
    }
    
    if (dryerType.type.includes('Gas')) {
      dryerWarnings.push('Gas dryer also requires proper gas line installation');
      dryerWarnings.push('Ensure adequate combustion air supply');
    }
    
    if (dryerType.type.includes('Commercial')) {
      dryerWarnings.push('Commercial dryers may require hardwired connection');
    }
    
    dryerWarnings.push('Install dedicated circuit - no other loads permitted');
    dryerWarnings.push('Use proper dryer cord rated for amperage');
    dryerWarnings.push('Ensure proper grounding and GFCI if required by local code');

    setCopperResult({
      ...copperWire,
      warnings: [...copperWire.warnings, ...dryerWarnings]
    });
    
    setAluminumResult({
      ...aluminumWire,
      warnings: [...aluminumWire.warnings, ...dryerWarnings]
    });
  }, [dryerType, distance, environment, hasExistingOutlet, existingOutletType, getAdjustedAmperage]);

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

  const adjustedAmps = getAdjustedAmperage();
  const recommendedOutlet = getRecommendedOutlet();

  // Shareable URL and Print functionality
  const shareableInputs = {
    dryer: dryerType.type,
    distance,
    environment: environment.type,
    existingOutlet: hasExistingOutlet ? existingOutletType.type : 'none',
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
      title: 'Dryer Circuit Calculation',
      inputs: {
        'Dryer Type': dryerType.type,
        'Nameplate Current': `${dryerType.amperage}A`,
        'Voltage': `${dryerType.voltage}V`,
        'Distance': `${distance} feet`,
        'Environment': environment.type,
        'Existing Outlet': hasExistingOutlet ? existingOutletType.type : 'None',
      },
      results: {
        'Adjusted Current': `${adjustedAmps}A`,
        'Recommended Outlet': recommendedOutlet.type,
        'Copper Wire': copperResult.awg + ' AWG',
        'Aluminum Wire': aluminumResult?.awg + ' AWG' || 'N/A',
      },
    });
  }, [dryerType, distance, environment, hasExistingOutlet, existingOutletType, adjustedAmps, recommendedOutlet, copperResult, aluminumResult, print]);

  return (
    <CalculatorLayout
      title="Dryer Wire Size Calculator"
      description="Calculate wire size for electric and gas dryer installations"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="space-y-6">
        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-800 mb-1">Dryer Installation Safety</div>
            <div className="text-amber-700">
              Dryer circuits must be dedicated (no other loads) and properly grounded. 
              Always verify nameplate requirements and use appropriate outlet types. 
              Gas dryers require both electrical and gas line installation by qualified professionals.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Shirt className="w-5 h-5 text-primary-600" />
              Dryer Configuration
            </h2>

            <div className="space-y-4">
              <Select
                label="Dryer Type"
                value={dryerType.type}
                onChange={(e) => {
                  const selected = DRYER_TYPES.find(d => d.type === e.target.value);
                  if (selected) setDryerType(selected);
                }}
                options={DRYER_TYPES.map(dryer => ({
                  value: dryer.type,
                  label: `${dryer.type} (${dryer.amperage}A, ${dryer.voltage}V)`
                }))}
              />

              <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
                <div className="font-medium mb-1">Selected Dryer Details:</div>
                <div>• Type: {dryerType.type}</div>
                <div>• Current: {dryerType.amperage}A</div>
                <div>• Voltage: {dryerType.voltage}V</div>
                <div>• Description: {dryerType.description}</div>
                <div className="mt-1 text-xs text-neutral-500">{dryerType.notes}</div>
              </div>

              <Input
                label="Distance from Panel to Dryer"
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                suffix="feet"
                min={1}
                max={200}
                placeholder="50"
              />

              <Select
                label="Installation Environment"
                value={environment.type}
                onChange={(e) => {
                  const selected = INSTALLATION_ENVIRONMENTS.find(env => env.type === e.target.value);
                  if (selected) setEnvironment(selected);
                }}
                options={INSTALLATION_ENVIRONMENTS.map(env => ({
                  value: env.type,
                  label: env.type
                }))}
              />

              {environment.tempFactor !== 1.0 && (
                <div className="bg-orange-50 rounded-lg p-3 text-sm text-orange-800">
                  <div className="font-medium mb-1">Temperature Adjustment:</div>
                  <div>• Environment: {environment.type}</div>
                  <div>• Temperature Factor: {environment.tempFactor}x</div>
                  <div>• Adjusted Current: {adjustedAmps}A</div>
                  <div className="mt-1 text-xs text-orange-600">{environment.description}</div>
                </div>
              )}

              {/* Existing Outlet Section */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="font-medium text-neutral-900 mb-3">Existing Outlet</div>
                
                <Select
                  label="Existing Outlet"
                  value={hasExistingOutlet ? 'yes' : 'no'}
                  onChange={(e) => setHasExistingOutlet(e.target.value === 'yes')}
                  options={[
                    { value: 'no', label: 'New installation' },
                    { value: 'yes', label: 'Existing outlet present' }
                  ]}
                />

                {hasExistingOutlet && (
                  <div className="mt-3">
                    <Select
                      label="Existing Outlet Type"
                      value={existingOutletType.type}
                      onChange={(e) => {
                        const selected = OUTLET_TYPES.find(outlet => outlet.type === e.target.value);
                        if (selected) setExistingOutletType(selected);
                      }}
                      options={OUTLET_TYPES.map(outlet => ({
                        value: outlet.type,
                        label: outlet.type
                      }))}
                    />
                    
                    <div className="mt-2 p-3 bg-neutral-50 rounded text-sm">
                      <div className="font-medium text-neutral-800 mb-1">Outlet Details:</div>
                      <div className="text-neutral-600">• Wiring: {existingOutletType.wires}</div>
                      <div className="text-neutral-600">• Description: {existingOutletType.description}</div>
                      {!existingOutletType.required && (
                        <div className="text-amber-600 mt-1 text-xs font-medium">
                          ⚠ This outlet type is not compliant with current code
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Outlet */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Recommended Outlet
                </div>
                <div className="text-sm text-green-700">
                  <div>• Type: {recommendedOutlet.type}</div>
                  <div>• Wiring: {recommendedOutlet.wires}</div>
                  <div>• Description: {recommendedOutlet.description}</div>
                </div>
              </div>

              {/* NEC Reference */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Code Requirements:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• NEC 210.11(C)(2): Dedicated 30A circuit for electric dryers</li>
                    <li>• NEC 250.140: Grounding requirements for appliances</li>
                    <li>• NEC 422.16(B)(2): Individual branch circuits required</li>
                    <li>• Always check manufacturer's installation requirements</li>
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
                  amps={adjustedAmps}
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
                    necReference="NEC 210.11(C)(2), 250.140, Table 310.16"
                  />

                  <CalculatorResult
                    awg={aluminumResult.awg}
                    ampacity={aluminumResult.ampacity}
                    voltageDropPercent={aluminumResult.voltageDropPercent}
                    groundWire={aluminumResult.groundWire}
                    material="aluminum"
                    isCompliant={aluminumResult.isCompliant}
                    warnings={aluminumResult.warnings}
                    necReference="NEC 210.11(C)(2), 250.140, Table 310.16"
                  />
                </div>

                {/* Installation Information */}
                <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                  <div className="font-medium text-neutral-900 mb-2">Installation Requirements:</div>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• Install dedicated circuit breaker (no other loads)</li>
                    <li>• Use proper dryer cord rated for amperage</li>
                    <li>• Ensure outlet height 3-4 feet from floor</li>
                    <li>• Provide proper ventilation for dryer exhaust</li>
                    <li>• Bond appliance to equipment grounding conductor</li>
                    <li>• Test outlet polarity and grounding before connection</li>
                    <li>• For gas dryers: install gas shut-off valve within 6 feet</li>
                  </ul>
                </div>

                {/* Outlet Upgrade Notice */}
                {hasExistingOutlet && !existingOutletType.required && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-amber-800 mb-1">Outlet Upgrade Required</div>
                      <div className="text-amber-700">
                        Existing 3-wire outlets should be upgraded to 4-wire (with equipment ground) 
                        per current code requirements. This improves safety and appliance protection.
                      </div>
                    </div>
                  </div>
                )}

                {/* Energy Efficiency Tip */}
                {dryerType.type.includes('Heat Pump') && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                    <Shirt className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-green-800 mb-1">Energy Efficiency</div>
                      <div className="text-green-700">
                        Heat pump dryers use significantly less energy than traditional electric dryers, 
                        typically reducing energy consumption by 50% or more.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!copperResult && (
              <div className="text-center py-8 text-neutral-500">
                Select a dryer type to see wire size recommendations
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}