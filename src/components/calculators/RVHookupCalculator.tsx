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
import { Truck, AlertTriangle, Info, Plug, Zap , Calculator, RefreshCw } from 'lucide-react';

// RV hookup types and their specifications
const RV_HOOKUP_TYPES = [
  {
    type: '30A RV Hookup (TT-30)',
    amperage: 30,
    voltage: 120,
    configuration: '3-wire (Hot-Neutral-Ground)',
    description: 'Standard RV hookup for smaller units',
    outlet: 'NEMA TT-30R',
    typical_loads: ['Lighting', 'Small appliances', 'One AC unit']
  },
  {
    type: '50A RV Hookup (14-50)',
    amperage: 50,
    voltage: 240,
    configuration: '4-wire (Hot-Hot-Neutral-Ground)',
    description: 'Large RV hookup for big rigs',
    outlet: 'NEMA 14-50R',
    typical_loads: ['Multiple AC units', 'Electric water heater', 'Full kitchen appliances']
  },
  {
    type: 'Multiple 30A Hookups',
    amperage: 30,
    voltage: 120,
    configuration: '3-wire per hookup',
    description: 'Multiple 30A pedestals',
    outlet: 'Multiple TT-30R outlets',
    typical_loads: ['Multiple RV sites', 'Campground applications']
  },
  {
    type: 'Multiple 50A Hookups',
    amperage: 50,
    voltage: 240,
    configuration: '4-wire per hookup',
    description: 'Multiple 50A pedestals',
    outlet: 'Multiple 14-50R outlets',
    typical_loads: ['Premium RV sites', 'Commercial campgrounds']
  },
];

// Installation environments
const INSTALLATION_ENVIRONMENTS = [
  {
    type: 'Residential Driveway',
    description: 'Single RV hookup at home',
    demand_factor: 1.0,
    notes: 'Full load expected'
  },
  {
    type: 'Small Campground (2-5 sites)',
    description: 'Small recreational facility',
    demand_factor: 0.9,
    notes: 'High occupancy expected'
  },
  {
    type: 'Medium Campground (6-20 sites)',
    description: 'Medium recreational facility',
    demand_factor: 0.8,
    notes: 'Moderate diversity factor'
  },
  {
    type: 'Large Campground (21+ sites)',
    description: 'Large commercial facility',
    demand_factor: 0.7,
    notes: 'Significant diversity factor per NEC 551.73'
  },
];

// Pedestal types and features
const PEDESTAL_TYPES = [
  {
    type: 'Basic Utility Post',
    features: ['Weather-resistant outlet', 'GFCI protection'],
    description: 'Simple post-mounted outlet'
  },
  {
    type: 'Standard RV Pedestal',
    features: ['Weather-resistant outlet', 'GFCI protection', 'Circuit breaker', 'Metering capability'],
    description: 'Commercial-grade pedestal with breaker'
  },
  {
    type: 'Premium RV Pedestal',
    features: ['Multiple outlets', 'Individual metering', 'Surge protection', 'LED lighting', 'Cable/phone connections'],
    description: 'Full-service pedestal with amenities'
  },
];

export function RVHookupCalculator() {
  const [hookupType, setHookupType] = useState(RV_HOOKUP_TYPES[1]); // Default to 50A
  const [environment, setEnvironment] = useState(INSTALLATION_ENVIRONMENTS[0]); // Default to residential
  const [pedestalType, setPedestalType] = useState(PEDESTAL_TYPES[1]); // Default to standard
  const [distance, setDistance] = useState(150);
  const [numHookups, setNumHookups] = useState(1);
  const [hasGFCI, setHasGFCI] = useState(true);
  const [hasSurgeProtection, setHasSurgeProtection] = useState(false);
  const [copperResult, setCopperResult] = useState<WireSizeResult | null>(null);
  const [aluminumResult, setAluminumResult] = useState<WireSizeResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculate total load with demand factors
  const calculateTotalLoad = useCallback((): number => {
    const baseLoad = hookupType.amperage * numHookups;
    
    // Apply demand factor per NEC 551.73 for multiple sites
    const demandLoad = baseLoad * environment.demand_factor;
    
    return Math.ceil(demandLoad * 100) / 100;
  }, [hookupType, numHookups, environment]);

  const performCalculation = useCallback(() => {
    calculateTotalLoad();
    setShowResults(true);
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }, [calculateTotalLoad]);

  const handleReset = () => {
    setShowResults(false);
    // Reset other states as needed
  };

  // Get recommended breaker size
  const getRecommendedBreaker = useCallback((): number => {
    if (hookupType.amperage === 30) {
      return 30; // 30A breaker for TT-30
    } else if (hookupType.amperage === 50) {
      return 50; // 50A breaker for 14-50
    }
    return hookupType.amperage;
  }, [hookupType]);

  const calculate = useCallback(() => {
    const totalLoad = calculateTotalLoad();
    
    // Calculate wire sizes for both materials
    const baseInput: Omit<WireSizeInput, 'material'> = {
      amps: totalLoad,
      distance,
      voltage: hookupType.voltage === 240 ? 240 : 120,
      phase: 'single',
    };

    const copperWire = calculateWireSize({ ...baseInput, material: 'copper' });
    const aluminumWire = calculateWireSize({ ...baseInput, material: 'aluminum' });

    // Add RV-specific warnings
    const rvWarnings = [];
    
    if (!hasGFCI) {
      rvWarnings.push('GFCI protection required for all RV outlets per NEC 551.71');
    }
    
    if (distance > 200) {
      rvWarnings.push('Long runs may require larger conductors - verify voltage at pedestal');
    }
    
    if (numHookups > 1 && environment.demand_factor === 1.0) {
      rvWarnings.push('Consider demand factors for multiple RV hookups per NEC 551.73');
    }
    
    if (hookupType.voltage === 120 && distance > 100) {
      rvWarnings.push('120V circuits over 100 feet may have voltage drop issues');
    }
    
    if (!hasSurgeProtection && hookupType.amperage >= 50) {
      rvWarnings.push('Consider surge protection for expensive RV electronics');
    }
    
    if (hookupType.type.includes('Multiple') && numHookups < 2) {
      rvWarnings.push('Multiple hookup type selected but only 1 hookup specified');
    }
    
    rvWarnings.push('Install weatherproof outlet rated for outdoor use');
    rvWarnings.push('Use proper RV-rated outlet (TT-30R or 14-50R)');
    rvWarnings.push('Install at proper height (18-24 inches above ground)');
    rvWarnings.push('Provide adequate working space per NEC 110.26');

    setCopperResult({
      ...copperWire,
      warnings: [...copperWire.warnings, ...rvWarnings]
    });
    
    setAluminumResult({
      ...aluminumWire,
      warnings: [...aluminumWire.warnings, ...rvWarnings]
    });
  }, [hookupType, environment, pedestalType, distance, numHookups, hasGFCI, hasSurgeProtection, calculateTotalLoad]);

  // Auto-calculation disabled - user must click Calculate button
  // useEffect(() => {
  //   calculate();
  // }, [calculate]);

  const totalLoad = calculateTotalLoad();
  const recommendedBreaker = getRecommendedBreaker();

  // Shareable URL and Print functionality
  const shareableInputs = {
    hookup: hookupType.type,
    environment: environment.type,
    pedestal: pedestalType.type,
    distance,
    numHookups,
    gfci: hasGFCI ? 'yes' : 'no',
    surge: hasSurgeProtection ? 'yes' : 'no',
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
      title: 'RV Hookup Circuit Calculation',
      inputs: {
        'Hookup Type': hookupType.type,
        'Environment': environment.type,
        'Pedestal Type': pedestalType.type,
        'Distance': `${distance} feet`,
        'Number of Hookups': numHookups.toString(),
        'GFCI Protection': hasGFCI ? 'Yes' : 'No',
        'Surge Protection': hasSurgeProtection ? 'Yes' : 'No',
      },
      results: {
        'Individual Load': `${hookupType.amperage}A`,
        'Total Load': `${totalLoad}A`,
        'Demand Factor': `${(environment.demand_factor * 100).toFixed(0)}%`,
        'Recommended Breaker': `${recommendedBreaker}A`,
        'Copper Wire': copperResult.awg + ' AWG',
        'Aluminum Wire': aluminumResult?.awg + ' AWG' || 'N/A',
      },
    });
  }, [hookupType, environment, pedestalType, distance, numHookups, hasGFCI, hasSurgeProtection, totalLoad, recommendedBreaker, copperResult, aluminumResult, print]);

  return (
    <CalculatorLayout
      title="RV Hookup Calculator"
      description="Calculate wire size for RV electrical hookups per NEC Article 551"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="space-y-6">
        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-800 mb-1">RV Hookup Installation Safety</div>
            <div className="text-amber-700">
              RV electrical hookups must comply with NEC Article 551 and local codes. 
              All outdoor outlets require GFCI protection and weather-resistant enclosures. 
              Use only RV-rated outlets (TT-30R or 14-50R) for proper connections.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary-600" />
              RV Hookup Configuration
            </h2>

            <div className="space-y-4">
              <Select
                label="RV Hookup Type"
                value={hookupType.type}
                onChange={(e) => {
                  const selected = RV_HOOKUP_TYPES.find(h => h.type === e.target.value);
                  if (selected) setHookupType(selected);
                }}
                options={RV_HOOKUP_TYPES.map(hookup => ({
                  value: hookup.type,
                  label: `${hookup.type} (${hookup.amperage}A)`
                }))}
              />

              <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
                <div className="font-medium mb-1">Selected Hookup Details:</div>
                <div>• Type: {hookupType.type}</div>
                <div>• Amperage: {hookupType.amperage}A</div>
                <div>• Voltage: {hookupType.voltage}V</div>
                <div>• Configuration: {hookupType.configuration}</div>
                <div>• Outlet: {hookupType.outlet}</div>
                <div className="mt-2 text-xs">
                  <div className="font-medium text-neutral-700 mb-1">Typical Loads:</div>
                  {hookupType.typical_loads.map((load, index) => (
                    <div key={index}>• {load}</div>
                  ))}
                </div>
              </div>

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

              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <div className="font-medium mb-1">Environment Details:</div>
                <div>• Type: {environment.type}</div>
                <div>• Demand Factor: {(environment.demand_factor * 100).toFixed(0)}%</div>
                <div>• Description: {environment.description}</div>
                <div className="mt-1 text-xs text-blue-600">{environment.notes}</div>
              </div>

              <Input
                label="Number of Hookups"
                type="number"
                value={numHookups}
                onChange={(e) => setNumHookups(Number(e.target.value))}
                suffix="hookups"
                min={1}
                max={100}
                placeholder="1"
              />

              <Input
                label="Distance from Panel to Hookup"
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                suffix="feet"
                min={0}
                max={1000}
                placeholder="150"
              />

              <Select
                label="Pedestal Type"
                value={pedestalType.type}
                onChange={(e) => {
                  const selected = PEDESTAL_TYPES.find(p => p.type === e.target.value);
                  if (selected) setPedestalType(selected);
                }}
                options={PEDESTAL_TYPES.map(pedestal => ({
                  value: pedestal.type,
                  label: pedestal.type
                }))}
              />

              <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
                <div className="font-medium mb-1">Pedestal Features:</div>
                <div className="space-y-1">
                  {pedestalType.features.map((feature, index) => (
                    <div key={index}>• {feature}</div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-green-600">{pedestalType.description}</div>
              </div>

              {/* Protection Features */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="font-medium text-neutral-900 mb-3">Protection Features</div>
                
                <div className="space-y-3">
                  <Select
                    label="GFCI Protection"
                    value={hasGFCI ? 'yes' : 'no'}
                    onChange={(e) => setHasGFCI(e.target.value === 'yes')}
                    options={[
                      { value: 'yes', label: 'Yes (Required by code)' },
                      { value: 'no', label: 'No (Code violation)' }
                    ]}
                  />

                  <Select
                    label="Surge Protection"
                    value={hasSurgeProtection ? 'yes' : 'no'}
                    onChange={(e) => setHasSurgeProtection(e.target.value === 'yes')}
                    options={[
                      { value: 'no', label: 'No surge protection' },
                      { value: 'yes', label: 'Surge protection included' }
                    ]}
                  />
                </div>
              </div>

              {/* Load Calculation */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Load Calculation
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• Individual Hookup: {hookupType.amperage}A</div>
                  <div>• Number of Hookups: {numHookups}</div>
                  <div>• Base Load: {hookupType.amperage * numHookups}A</div>
                  <div>• Demand Factor: {(environment.demand_factor * 100).toFixed(0)}%</div>
                  <div className="pt-1 border-t border-green-300">
                    <strong>Total Demand: {totalLoad}A</strong>
                  </div>
                  <div>Recommended Breaker: <strong>{recommendedBreaker}A per hookup</strong></div>
                </div>
              </div>

              {/* NEC Reference */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">NEC Requirements:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• NEC Article 551: Recreational vehicles and parks</li>
                    <li>• NEC 551.71: GFCI protection required for all outlets</li>
                    <li>• NEC 551.73: Demand factors for multiple hookups</li>
                    <li>• NEC 551.77: Receptacle outlets and ratings</li>
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
                  amps={totalLoad}
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
                    necReference="NEC Article 551, 551.71, Table 310.16"
                  />

                  <CalculatorResult
                    awg={aluminumResult.awg}
                    ampacity={aluminumResult.ampacity}
                    voltageDropPercent={aluminumResult.voltageDropPercent}
                    groundWire={aluminumResult.groundWire}
                    material="aluminum"
                    isCompliant={aluminumResult.isCompliant}
                    warnings={aluminumResult.warnings}
                    necReference="NEC Article 551, 551.71, Table 310.16"
                  />
                </div>

                {/* Installation Requirements */}
                <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                  <div className="font-medium text-neutral-900 mb-2">RV Hookup Installation Requirements:</div>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• Use only RV-rated outlets (TT-30R or 14-50R)</li>
                    <li>• Install GFCI protection at panel or outlet</li>
                    <li>• Mount outlet 18-24 inches above ground</li>
                    <li>• Use weatherproof outlet cover rated for outdoor use</li>
                    <li>• Install proper grounding electrode if required</li>
                    <li>• Provide adequate working space around pedestal</li>
                    <li>• Use underground rated conductors for buried runs</li>
                    <li>• Label circuits clearly for identification</li>
                  </ul>
                </div>

                {/* RV Connection Types */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Plug className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-800 mb-1">RV Connection Standards</div>
                    <div className="text-blue-700">
                      <strong>30A (TT-30):</strong> 3-prong connection for smaller RVs, travel trailers<br/>
                      <strong>50A (14-50):</strong> 4-prong connection for large RVs with multiple AC units and electric appliances
                    </div>
                  </div>
                </div>

                {/* Demand Factor Information */}
                {numHookups > 1 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                    <Info className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-purple-800 mb-1">Multiple Hookup Demand Factors</div>
                      <div className="text-purple-700">
                        NEC 551.73 allows reduced demand factors for campgrounds because not all sites 
                        operate at full load simultaneously. This results in smaller feeder requirements 
                        for multiple hookup installations.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!copperResult && (
              <div className="text-center py-8 text-neutral-500">
                Configure RV hookup parameters to see wire size recommendations
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}