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
import { Calculator, AlertTriangle, Info, TrendingUp, Building, RefreshCw } from 'lucide-react';

// Building types with their load characteristics
const BUILDING_TYPES = [
  {
    type: 'Single Family Dwelling',
    description: 'Residential home per NEC 220.82',
    generalLighting: 3, // VA per sq ft
    smallAppliances: 3000, // VA (2 circuits minimum)
    laundry: 1500, // VA
    demandFactor: 0.4, // 40% demand after first 10kVA
    notes: 'Standard method per NEC 220.82'
  },
  {
    type: 'Multifamily Dwelling',
    description: 'Apartment building per NEC 220.84',
    generalLighting: 3,
    smallAppliances: 3000,
    laundry: 1500,
    demandFactor: 0.35,
    notes: 'Optional method with diversity factors'
  },
  {
    type: 'Office Building',
    description: 'Commercial office space',
    generalLighting: 3.5,
    smallAppliances: 0,
    laundry: 0,
    demandFactor: 0.9,
    notes: 'Higher lighting loads, office equipment'
  },
  {
    type: 'Retail Store',
    description: 'Commercial retail space',
    generalLighting: 3,
    smallAppliances: 0,
    laundry: 0,
    demandFactor: 0.8,
    notes: 'Display lighting, point of sale equipment'
  },
  {
    type: 'Restaurant',
    description: 'Food service establishment',
    generalLighting: 2,
    smallAppliances: 0,
    laundry: 0,
    demandFactor: 0.95,
    notes: 'High kitchen equipment loads'
  },
  {
    type: 'Industrial Facility',
    description: 'Manufacturing or industrial',
    generalLighting: 2,
    smallAppliances: 0,
    laundry: 0,
    demandFactor: 0.85,
    notes: 'Motor loads, process equipment'
  },
];

// Load categories for detailed calculation
const LOAD_CATEGORIES = [
  {
    category: 'Lighting',
    description: 'General and task lighting',
    typical_va: 3,
    continuous: true,
    demand_factor: 1.0
  },
  {
    category: 'Receptacle Outlets',
    description: 'General use receptacles',
    typical_va: 180,
    continuous: false,
    demand_factor: 1.0
  },
  {
    category: 'HVAC Equipment',
    description: 'Heating, ventilation, AC',
    typical_va: 0,
    continuous: true,
    demand_factor: 1.0
  },
  {
    category: 'Motor Loads',
    description: 'Motors and motor-driven equipment',
    typical_va: 0,
    continuous: true,
    demand_factor: 1.0
  },
  {
    category: 'Kitchen Equipment',
    description: 'Commercial kitchen appliances',
    typical_va: 0,
    continuous: false,
    demand_factor: 0.8
  },
  {
    category: 'Other Equipment',
    description: 'Miscellaneous equipment',
    typical_va: 0,
    continuous: false,
    demand_factor: 0.75
  },
];

// Load entry interface
interface LoadEntry {
  id: string;
  category: string;
  description: string;
  va: number;
  quantity: number;
  continuous: boolean;
  demand_factor: number;
}

export function ElectricalLoadCalculator() {
  const [buildingType, setBuildingType] = useState(BUILDING_TYPES[0]);
  const [buildingArea, setBuildingArea] = useState(2000); // sq ft
  const [voltage, setVoltage] = useState<240 | 120 | 480>(240);
  const [phase, setPhase] = useState<'single' | 'three'>('single');
  const [distance, setDistance] = useState(100);
  const [useDetailedMethod, setUseDetailedMethod] = useState(false);
  const [loads, setLoads] = useState<LoadEntry[]>([]);
  const [copperResult, setCopperResult] = useState<WireSizeResult | null>(null);
  const [aluminumResult, setAluminumResult] = useState<WireSizeResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Add a new load entry
  const addLoad = useCallback(() => {
    const newLoad: LoadEntry = {
      id: Math.random().toString(36).substr(2, 9),
      category: LOAD_CATEGORIES[0].category,
      description: '',
      va: 0,
      quantity: 1,
      continuous: false,
      demand_factor: 1.0
    };
    setLoads(prev => [...prev, newLoad]);
  }, []);

  // Update a load entry
  const updateLoad = useCallback((id: string, field: keyof LoadEntry, value: any) => {
    setLoads(prev => prev.map(load => 
      load.id === id ? { ...load, [field]: value } : load
    ));
  }, []);

  // Remove a load entry
  const removeLoad = useCallback((id: string) => {
    setLoads(prev => prev.filter(load => load.id !== id));
  }, []);

  // Calculate total load using standard method
  const calculateStandardLoad = useCallback((): number => {
    const lightingLoad = buildingArea * buildingType.generalLighting;
    const smallApplianceLoad = buildingType.smallAppliances;
    const laundryLoad = buildingType.laundry;
    
    const baseLoad = lightingLoad + smallApplianceLoad + laundryLoad;
    
    // Apply demand factors per NEC 220.82/220.84
    let demandLoad = 0;
    if (baseLoad <= 10000) {
      demandLoad = baseLoad;
    } else {
      demandLoad = 10000 + ((baseLoad - 10000) * buildingType.demandFactor);
    }
    
    // Convert to amperage
    return Math.ceil((demandLoad / voltage) * 100) / 100;
  }, [buildingArea, buildingType, voltage]);

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

  // Calculate total load using detailed method
  const calculateDetailedLoad = useCallback((): number => {
    let totalVA = 0;
    let continuousVA = 0;
    
    loads.forEach(load => {
      const loadVA = load.va * load.quantity * load.demand_factor;
      totalVA += loadVA;
      
      if (load.continuous) {
        continuousVA += loadVA;
      }
    });
    
    // Apply 125% factor to continuous loads
    const adjustedVA = continuousVA * 1.25 + (totalVA - continuousVA);
    
    // Convert to amperage
    return Math.ceil((adjustedVA / voltage) * 100) / 100;
  }, [loads, voltage]);

  // Get total calculated load
  const getTotalLoad = useCallback((): number => {
    return useDetailedMethod ? calculateDetailedLoad() : calculateStandardLoad();
  }, [useDetailedMethod, calculateDetailedLoad, calculateStandardLoad]);

  // Calculate service size recommendation
  const getServiceSize = useCallback((): number => {
    const totalLoad = getTotalLoad();
    
    // Standard service sizes
    const serviceSizes = [100, 125, 150, 200, 225, 300, 400, 600, 800, 1000, 1200, 1600, 2000];
    
    // Add 25% safety margin
    const requiredCapacity = totalLoad * 1.25;
    
    return serviceSizes.find(size => size >= requiredCapacity) || serviceSizes[serviceSizes.length - 1];
  }, [getTotalLoad]);

  const calculate = useCallback(() => {
    const totalLoad = getTotalLoad();
    
    // Calculate wire sizes for both materials
    const baseInput: Omit<WireSizeInput, 'material'> = {
      amps: totalLoad,
      distance,
      voltage: voltage === 480 ? 480 : (voltage === 240 ? 240 : 120),
      phase,
    };

    const copperWire = calculateWireSize({ ...baseInput, material: 'copper' });
    const aluminumWire = calculateWireSize({ ...baseInput, material: 'aluminum' });

    // Add load calculation warnings
    const loadWarnings = [];
    
    const serviceSize = getServiceSize();
    
    if (serviceSize > 400) {
      loadWarnings.push('Large service size may require utility coordination');
    }
    
    if (!useDetailedMethod && buildingType.type.includes('Commercial')) {
      loadWarnings.push('Consider detailed load calculation for commercial buildings');
    }
    
    if (useDetailedMethod && loads.length < 3) {
      loadWarnings.push('Add more load categories for accurate detailed calculation');
    }
    
    if (totalLoad > serviceSize * 0.8) {
      loadWarnings.push('Load approaches service capacity - consider larger service');
    }
    
    if (buildingType.type.includes('Dwelling') && totalLoad < 100) {
      loadWarnings.push('Minimum 100A service required for dwellings per NEC 230.79');
    }
    
    if (phase === 'single' && totalLoad > 200) {
      loadWarnings.push('Consider three-phase service for large loads');
    }
    
    loadWarnings.push(`Recommended service size: ${serviceSize}A minimum`);
    loadWarnings.push('Verify local code requirements and utility standards');
    loadWarnings.push('Consider future load growth in service sizing');

    setCopperResult({
      ...copperWire,
      warnings: [...copperWire.warnings, ...loadWarnings]
    });
    
    setAluminumResult({
      ...aluminumWire,
      warnings: [...aluminumWire.warnings, ...loadWarnings]
    });
  }, [buildingType, buildingArea, voltage, phase, distance, useDetailedMethod, loads, getTotalLoad, getServiceSize]);

  // Auto-calculation disabled - user must click Calculate button
  // useEffect(() => {
  //   calculate();
  // }, [calculate]);

  const totalLoad = getTotalLoad();
  const serviceSize = getServiceSize();

  // Shareable URL and Print functionality
  const shareableInputs = {
    buildingType: buildingType.type,
    buildingArea,
    voltage,
    phase,
    distance,
    method: useDetailedMethod ? 'detailed' : 'standard',
    ...(useDetailedMethod && { loadCount: loads.length }),
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
    
    const loadSummary = useDetailedMethod ? 
      loads.reduce((acc, load) => {
        acc[load.description || load.category] = `${load.va * load.quantity}VA`;
        return acc;
      }, {} as Record<string, string>) :
      {
        'Lighting Load': `${buildingArea * buildingType.generalLighting}VA`,
        'Small Appliances': `${buildingType.smallAppliances}VA`,
        'Laundry': `${buildingType.laundry}VA`
      };

    print({
      title: 'Electrical Load Calculation',
      inputs: {
        'Building Type': buildingType.type,
        'Building Area': `${buildingArea} sq ft`,
        'Voltage': `${voltage}V`,
        'Phase': phase,
        'Distance': `${distance} feet`,
        'Calculation Method': useDetailedMethod ? 'Detailed' : 'Standard',
        ...loadSummary,
      },
      results: {
        'Total Load': `${totalLoad}A`,
        'Recommended Service': `${serviceSize}A`,
        'Load Density': `${(totalLoad * voltage / buildingArea).toFixed(2)} VA/sq ft`,
        'Copper Service Wire': copperResult.awg + ' AWG',
        'Aluminum Service Wire': aluminumResult?.awg + ' AWG' || 'N/A',
      },
    });
  }, [buildingType, buildingArea, voltage, phase, distance, useDetailedMethod, loads, totalLoad, serviceSize, copperResult, aluminumResult, print]);

  return (
    <CalculatorLayout
      title="Electrical Load Calculator"
      description="Calculate electrical service loads per NEC Articles 220.82 and 220.84"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="space-y-6">
        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-800 mb-1">Load Calculation Notice</div>
            <div className="text-amber-700">
              Electrical load calculations must comply with NEC Articles 220.82-220.87 and local code requirements. 
              These calculations determine minimum service size requirements. Always consult with qualified engineers 
              for complex installations and verify with local authorities.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary-600" />
              Load Calculation Parameters
            </h2>

            <div className="space-y-4">
              <Select
                label="Building Type"
                value={buildingType.type}
                onChange={(e) => {
                  const selected = BUILDING_TYPES.find(b => b.type === e.target.value);
                  if (selected) setBuildingType(selected);
                }}
                options={BUILDING_TYPES.map(building => ({
                  value: building.type,
                  label: building.type
                }))}
              />

              <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
                <div className="font-medium mb-1">Building Characteristics:</div>
                <div>• Type: {buildingType.type}</div>
                <div>• General Lighting: {buildingType.generalLighting} VA/sq ft</div>
                <div>• Small Appliances: {buildingType.smallAppliances} VA</div>
                <div>• Laundry: {buildingType.laundry} VA</div>
                <div>• Demand Factor: {(buildingType.demandFactor * 100).toFixed(0)}%</div>
                <div className="mt-1 text-xs text-neutral-500">{buildingType.notes}</div>
              </div>

              <Input
                label="Building Area"
                type="number"
                value={buildingArea}
                onChange={(e) => setBuildingArea(Number(e.target.value))}
                suffix="sq ft"
                min={100}
                max={50000}
                placeholder="2000"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Voltage"
                  value={voltage.toString()}
                  onChange={(e) => setVoltage(Number(e.target.value) as 120 | 240 | 480)}
                  options={[
                    { value: '120', label: '120V' },
                    { value: '240', label: '240V' },
                    { value: '480', label: '480V' }
                  ]}
                />

                <Select
                  label="Phase"
                  value={phase}
                  onChange={(e) => setPhase(e.target.value as 'single' | 'three')}
                  options={[
                    { value: 'single', label: 'Single Phase' },
                    { value: 'three', label: 'Three Phase' }
                  ]}
                />
              </div>

              <Input
                label="Service Distance"
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                suffix="feet"
                min={0}
                max={1000}
                placeholder="100"
              />

              {/* Calculation Method Selection */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="font-medium text-neutral-900 mb-3">Calculation Method</div>
                
                <Select
                  label="Method"
                  value={useDetailedMethod ? 'detailed' : 'standard'}
                  onChange={(e) => setUseDetailedMethod(e.target.value === 'detailed')}
                  options={[
                    { value: 'standard', label: 'Standard Method (NEC 220.82/220.84)' },
                    { value: 'detailed', label: 'Detailed Load-by-Load Method' }
                  ]}
                />

                <div className="mt-3 p-3 bg-neutral-50 rounded text-sm text-neutral-600">
                  {useDetailedMethod ? 
                    'Detailed method allows custom load entries with specific demand factors and continuous load considerations.' :
                    'Standard method uses NEC demand factors based on building type and area.'
                  }
                </div>
              </div>

              {/* Detailed Load Entries */}
              {useDetailedMethod && (
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-neutral-900">Load Entries</div>
                    <button
                      onClick={addLoad}
                      className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
                    >
                      Add Load
                    </button>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {loads.map((load) => (
                      <div key={load.id} className="grid grid-cols-6 gap-2 items-end">
                        <div className="col-span-2">
                          <Select
                            label="Category"
                            value={load.category}
                            onChange={(e) => updateLoad(load.id, 'category', e.target.value)}
                            options={LOAD_CATEGORIES.map(cat => ({
                              value: cat.category,
                              label: cat.category
                            }))}
                          />
                        </div>
                        <div>
                          <Input
                            label="VA"
                            type="number"
                            value={load.va}
                            onChange={(e) => updateLoad(load.id, 'va', Number(e.target.value))}
                            min={0}
                          />
                        </div>
                        <div>
                          <Input
                            label="Qty"
                            type="number"
                            value={load.quantity}
                            onChange={(e) => updateLoad(load.id, 'quantity', Number(e.target.value))}
                            min={1}
                          />
                        </div>
                        <div>
                          <Input
                            label="Demand %"
                            type="number"
                            value={load.demand_factor * 100}
                            onChange={(e) => updateLoad(load.id, 'demand_factor', Number(e.target.value) / 100)}
                            min={0}
                            max={100}
                          />
                        </div>
                        <div>
                          <button
                            onClick={() => removeLoad(load.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 h-10"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Load Calculation Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Load Calculation Summary
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  {useDetailedMethod ? (
                    <>
                      <div>• Total Load Entries: {loads.length}</div>
                      <div>• Total Connected Load: {loads.reduce((sum, load) => sum + (load.va * load.quantity), 0).toLocaleString()} VA</div>
                    </>
                  ) : (
                    <>
                      <div>• Building Area: {buildingArea.toLocaleString()} sq ft</div>
                      <div>• Base Load: {((buildingArea * buildingType.generalLighting) + buildingType.smallAppliances + buildingType.laundry).toLocaleString()} VA</div>
                    </>
                  )}
                  <div className="pt-1 border-t border-green-300">
                    <strong>Calculated Load: {totalLoad}A @ {voltage}V</strong>
                  </div>
                  <div>Load Density: <strong>{(totalLoad * voltage / buildingArea).toFixed(2)} VA/sq ft</strong></div>
                  <div>Recommended Service: <strong>{serviceSize}A</strong></div>
                </div>
              </div>

              {/* NEC Reference */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">NEC References:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• NEC 220.82: Dwelling unit load calculations</li>
                    <li>• NEC 220.84: Multifamily dwelling calculations</li>
                    <li>• NEC 220.87: Determining existing loads</li>
                    <li>• NEC 230.79: Minimum service entrance ratings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Service Size & Wire Results
            </h2>

            {copperResult && aluminumResult && (
              <div className="space-y-6">
                {/* Service Sizing Summary */}
                <div className="bg-neutral-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 text-center mb-4">
                    Service Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <div className="text-blue-800 font-semibold">Calculated Load</div>
                      <div className="text-2xl font-bold text-blue-900">{totalLoad}A</div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <div className="text-green-800 font-semibold">Service Size</div>
                      <div className="text-2xl font-bold text-green-900">{serviceSize}A</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm text-neutral-600">
                    {buildingType.type} • {(totalLoad * voltage / buildingArea).toFixed(2)} VA/sq ft
                  </div>
                </div>

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
                    necReference="NEC 220.82, 220.84, 230.79, Table 310.16"
                  />

                  <CalculatorResult
                    awg={aluminumResult.awg}
                    ampacity={aluminumResult.ampacity}
                    voltageDropPercent={aluminumResult.voltageDropPercent}
                    groundWire={aluminumResult.groundWire}
                    material="aluminum"
                    isCompliant={aluminumResult.isCompliant}
                    warnings={aluminumResult.warnings}
                    necReference="NEC 220.82, 220.84, 230.79, Table 310.16"
                  />
                </div>

                {/* Load Analysis */}
                <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                  <div className="font-medium text-neutral-900 mb-2">Load Analysis:</div>
                  <div className="text-neutral-600 space-y-1">
                    <div>• Load per sq ft: {(totalLoad * voltage / buildingArea).toFixed(2)} VA/sq ft</div>
                    <div>• Service utilization: {((totalLoad / serviceSize) * 100).toFixed(1)}%</div>
                    <div>• Growth capacity: {(serviceSize - totalLoad).toFixed(1)}A available</div>
                    <div>• Calculation method: {useDetailedMethod ? 'Detailed load-by-load' : 'Standard NEC method'}</div>
                  </div>
                </div>

                {/* Installation Guidelines */}
                <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                  <div className="font-medium text-neutral-900 mb-2">Service Installation Guidelines:</div>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• Coordinate service size with utility company</li>
                    <li>• Install appropriate main overcurrent protection</li>
                    <li>• Verify service equipment ratings and listings</li>
                    <li>• Consider future load growth requirements</li>
                    <li>• Ensure adequate working space per NEC 110.26</li>
                    <li>• Install appropriate grounding electrode system</li>
                    <li>• Comply with local utility and code requirements</li>
                  </ul>
                </div>

                {/* Building Type Specific Notes */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                  <Building className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-purple-800 mb-1">Building Type Considerations</div>
                    <div className="text-purple-700">
                      {buildingType.type} buildings have specific load characteristics per NEC requirements. 
                      {buildingType.type.includes('Dwelling') && ' Dwelling units require minimum 100A service and include specific demand factors for appliances.'}
                      {buildingType.type.includes('Commercial') && ' Commercial buildings may have additional requirements for emergency systems and fire pumps.'}
                      {buildingType.type.includes('Industrial') && ' Industrial facilities often require detailed load analysis and may need higher capacity services.'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!copperResult && (
              <div className="text-center py-8 text-neutral-500">
                Configure building parameters to see load calculation results
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}