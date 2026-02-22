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
import { Home, AlertTriangle, Info, Zap, Car , Calculator, RefreshCw } from 'lucide-react';

// Subpanel sizes and their typical applications
const SUBPANEL_SIZES = [
  {
    size: '60A',
    amperage: 60,
    description: 'Basic garage lighting, outlets, and small tools',
    applications: ['LED lighting', 'Standard outlets', 'Small air compressor']
  },
  {
    size: '100A',
    amperage: 100,
    description: 'Standard garage with moderate tools and EV charging',
    applications: ['Level 2 EV charger (40A)', 'Welding outlet', 'Multiple 240V tools']
  },
  {
    size: '125A',
    amperage: 125,
    description: 'Large garage with heavy equipment',
    applications: ['Multiple EV chargers', 'Large air compressor', 'Heavy machinery']
  },
  {
    size: '150A',
    amperage: 150,
    description: 'Workshop or commercial garage',
    applications: ['Multiple 50A circuits', 'Commercial equipment', 'Large HVAC units']
  },
  {
    size: '200A',
    amperage: 200,
    description: 'Full workshop or multi-bay garage',
    applications: ['Complete workshop setup', 'Multiple high-amp circuits', 'Commercial applications']
  },
];

// Load calculation for different garage types
const LOAD_CALCULATIONS = [
  {
    type: 'Basic Garage',
    lighting: 3, // VA per sq ft
    outlets: 180, // VA per outlet
    continuous: 0.8, // 80% continuous load factor
    description: 'Minimal electrical loads'
  },
  {
    type: 'Home Workshop',
    lighting: 5,
    outlets: 180,
    continuous: 0.85,
    description: 'Moderate tool usage'
  },
  {
    type: 'Professional Workshop',
    lighting: 7,
    outlets: 180,
    continuous: 0.9,
    description: 'Heavy equipment and tools'
  },
];

// Installation methods
const INSTALLATION_METHODS = [
  {
    type: 'Underground (Direct Burial)',
    description: 'USE-2 cable direct buried',
    tempRating: 90,
    notes: 'Most common for detached garages'
  },
  {
    type: 'Underground (in Conduit)',
    description: 'THWN-2 in underground conduit',
    tempRating: 90,
    notes: 'Better protection, easier maintenance'
  },
  {
    type: 'Overhead (Service Drop)',
    description: 'Overhead triplex or individual conductors',
    tempRating: 75,
    notes: 'Less expensive installation'
  },
  {
    type: 'Attached Garage (Interior)',
    description: 'THWN-2 in conduit through structure',
    tempRating: 90,
    notes: 'For garages attached to house'
  },
];

export function GarageSubpanelCalculator() {
  const [subpanelSize, setSubpanelSize] = useState(SUBPANEL_SIZES[1]); // Default to 100A
  const [loadType, setLoadType] = useState(LOAD_CALCULATIONS[1]); // Default to home workshop
  const [installationMethod, setInstallationMethod] = useState(INSTALLATION_METHODS[0]); // Default to direct burial
  const [distance, setDistance] = useState(100);
  const [garageSize, setGarageSize] = useState(600); // Square feet
  const [numOutlets, setNumOutlets] = useState(8);
  const [hasEVCharger, setHasEVCharger] = useState(false);
  const [evChargerAmps, setEVChargerAmps] = useState(40);
  const [has240VTools, setHas240VTools] = useState(false);
  const [toolAmps, setToolAmps] = useState(30);
  const [copperResult, setCopperResult] = useState<WireSizeResult | null>(null);
  const [aluminumResult, setAluminumResult] = useState<WireSizeResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculate total load demand
  const calculateTotalLoad = useCallback((): number => {
    // Base loads
    const lightingLoad = garageSize * loadType.lighting; // VA
    const outletLoad = numOutlets * loadType.outlets; // VA
    let totalLoad = lightingLoad + outletLoad;

    // Add major appliances at full load
    if (hasEVCharger) {
      totalLoad += (evChargerAmps * 240); // Convert to VA
    }

    if (has240VTools) {
      totalLoad += (toolAmps * 240); // Convert to VA
    }

    // Apply continuous load factor per NEC 220.83
    const demandLoad = totalLoad * loadType.continuous;

    // Convert to amperage (VA ÷ 240V)
    return Math.ceil((demandLoad / 240) * 100) / 100;
  }, [garageSize, loadType, numOutlets, hasEVCharger, evChargerAmps, has240VTools, toolAmps]);

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

  // Get recommended subpanel size based on calculated load
  const getRecommendedSubpanelSize = useCallback((): typeof SUBPANEL_SIZES[0] => {
    const calculatedLoad = calculateTotalLoad();
    
    // Add 25% safety margin per NEC 220.87
    const requiredCapacity = Math.ceil(calculatedLoad * 1.25);
    
    // Find smallest subpanel that meets requirement
    const recommended = SUBPANEL_SIZES.find(panel => panel.amperage >= requiredCapacity);
    return recommended || SUBPANEL_SIZES[SUBPANEL_SIZES.length - 1];
  }, [calculateTotalLoad]);

  const calculate = useCallback(() => {
    // Use the larger of selected size or calculated requirement
    const totalLoad = calculateTotalLoad();
    const recommendedPanel = getRecommendedSubpanelSize();
    const feederAmps = Math.max(subpanelSize.amperage, totalLoad);
    
    // Calculate wire sizes for both materials
    const baseInput: Omit<WireSizeInput, 'material'> = {
      amps: feederAmps,
      distance,
      voltage: 240,
      phase: 'single',
    };

    const copperWire = calculateWireSize({ ...baseInput, material: 'copper' });
    const aluminumWire = calculateWireSize({ ...baseInput, material: 'aluminum' });

    // Add subpanel-specific warnings
    const subpanelWarnings = [];
    
    if (subpanelSize.amperage < recommendedPanel.amperage) {
      subpanelWarnings.push(`Consider ${recommendedPanel.size} subpanel for calculated ${totalLoad.toFixed(1)}A load`);
    }
    
    if (distance > 150) {
      subpanelWarnings.push('Long feeder runs may require larger conductors for voltage drop');
    }
    
    if (installationMethod.type.includes('Underground') && distance > 100) {
      subpanelWarnings.push('Consider PVC conduit for protection on long underground runs');
    }
    
    if (installationMethod.type.includes('Overhead') && distance > 75) {
      subpanelWarnings.push('Overhead spans may require intermediate support poles');
    }
    
    if (hasEVCharger && evChargerAmps >= subpanelSize.amperage * 0.5) {
      subpanelWarnings.push('EV charger load is significant - verify panel sizing');
    }
    
    if (garageSize > 800 && subpanelSize.amperage < 100) {
      subpanelWarnings.push('Large garages typically require 100A+ service');
    }
    
    subpanelWarnings.push('Install main disconnect at subpanel per NEC 225.31');
    subpanelWarnings.push('Subpanel requires separate grounding electrode per NEC 250.32');
    subpanelWarnings.push('Install GFCI protection for all 120V outlets in garage');
    subpanelWarnings.push('Separate neutral and ground in subpanel');

    setCopperResult({
      ...copperWire,
      warnings: [...copperWire.warnings, ...subpanelWarnings]
    });
    
    setAluminumResult({
      ...aluminumWire,
      warnings: [...aluminumWire.warnings, ...subpanelWarnings]
    });
  }, [subpanelSize, loadType, installationMethod, distance, garageSize, numOutlets, hasEVCharger, evChargerAmps, has240VTools, toolAmps, calculateTotalLoad, getRecommendedSubpanelSize]);

  // Auto-calculation disabled - user must click Calculate button
  // useEffect(() => {
  //   calculate();
  // }, [calculate]);

  const totalLoad = calculateTotalLoad();
  const recommendedPanel = getRecommendedSubpanelSize();

  // Shareable URL and Print functionality
  const shareableInputs = {
    subpanel: subpanelSize.size,
    loadType: loadType.type,
    installation: installationMethod.type,
    distance,
    garageSize,
    outlets: numOutlets,
    ...(hasEVCharger && { evCharger: `${evChargerAmps}A` }),
    ...(has240VTools && { tools: `${toolAmps}A` }),
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
      title: 'Garage Subpanel Feeder Calculation',
      inputs: {
        'Subpanel Size': subpanelSize.size,
        'Load Type': loadType.type,
        'Installation Method': installationMethod.type,
        'Distance': `${distance} feet`,
        'Garage Size': `${garageSize} sq ft`,
        'Number of Outlets': numOutlets.toString(),
        ...(hasEVCharger && { 'EV Charger': `${evChargerAmps}A` }),
        ...(has240VTools && { '240V Tools': `${toolAmps}A` }),
      },
      results: {
        'Calculated Load': `${totalLoad.toFixed(1)}A`,
        'Recommended Panel': recommendedPanel.size,
        'Feeder Ampacity': `${Math.max(subpanelSize.amperage, totalLoad).toFixed(1)}A`,
        'Copper Wire': copperResult.awg + ' AWG',
        'Aluminum Wire': aluminumResult?.awg + ' AWG' || 'N/A',
      },
    });
  }, [subpanelSize, loadType, installationMethod, distance, garageSize, numOutlets, hasEVCharger, evChargerAmps, has240VTools, toolAmps, totalLoad, recommendedPanel, copperResult, aluminumResult, print]);

  return (
    <CalculatorLayout
      title="Garage Subpanel Calculator"
      description="Calculate feeder size for garage subpanels per NEC Article 225"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="space-y-6">
        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-800 mb-1">Subpanel Installation Safety</div>
            <div className="text-amber-700">
              Garage subpanels require proper grounding electrode systems and must comply with NEC Article 225. 
              Feeders to outbuildings have specific requirements for disconnecting means and grounding. 
              All work should be performed by licensed electricians.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Home className="w-5 h-5 text-primary-600" />
              Garage Subpanel Configuration
            </h2>

            <div className="space-y-4">
              <Select
                label="Subpanel Size"
                value={subpanelSize.size}
                onChange={(e) => {
                  const selected = SUBPANEL_SIZES.find(s => s.size === e.target.value);
                  if (selected) setSubpanelSize(selected);
                }}
                options={SUBPANEL_SIZES.map(panel => ({
                  value: panel.size,
                  label: `${panel.size} (${panel.amperage}A)`
                }))}
              />

              <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
                <div className="font-medium mb-1">Selected Panel Details:</div>
                <div>• Size: {subpanelSize.size} ({subpanelSize.amperage}A)</div>
                <div>• Description: {subpanelSize.description}</div>
                <div className="mt-2 text-xs">
                  <div className="font-medium text-neutral-700 mb-1">Typical Applications:</div>
                  {subpanelSize.applications.map((app, index) => (
                    <div key={index}>• {app}</div>
                  ))}
                </div>
              </div>

              <Select
                label="Load Type"
                value={loadType.type}
                onChange={(e) => {
                  const selected = LOAD_CALCULATIONS.find(l => l.type === e.target.value);
                  if (selected) setLoadType(selected);
                }}
                options={LOAD_CALCULATIONS.map(load => ({
                  value: load.type,
                  label: load.type
                }))}
              />

              <Select
                label="Installation Method"
                value={installationMethod.type}
                onChange={(e) => {
                  const selected = INSTALLATION_METHODS.find(i => i.type === e.target.value);
                  if (selected) setInstallationMethod(selected);
                }}
                options={INSTALLATION_METHODS.map(method => ({
                  value: method.type,
                  label: method.type
                }))}
              />

              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <div className="font-medium mb-1">Installation Details:</div>
                <div>• Method: {installationMethod.type}</div>
                <div>• Description: {installationMethod.description}</div>
                <div>• Temperature Rating: {installationMethod.tempRating}°C</div>
                <div className="mt-1 text-xs text-blue-600">{installationMethod.notes}</div>
              </div>

              <Input
                label="Distance from Main Panel"
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                suffix="feet"
                min={0}
                max={500}
                placeholder="100"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Garage Size"
                  type="number"
                  value={garageSize}
                  onChange={(e) => setGarageSize(Number(e.target.value))}
                  suffix="sq ft"
                  min={200}
                  max={5000}
                  placeholder="600"
                />

                <Input
                  label="Number of Outlets"
                  type="number"
                  value={numOutlets}
                  onChange={(e) => setNumOutlets(Number(e.target.value))}
                  suffix="outlets"
                  min={4}
                  max={50}
                  placeholder="8"
                />
              </div>

              {/* EV Charger Section */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Car className="w-4 h-4 text-green-600" />
                  <label className="font-medium text-neutral-900">EV Charger</label>
                </div>
                
                <Select
                  label="EV Charger"
                  value={hasEVCharger ? 'yes' : 'no'}
                  onChange={(e) => setHasEVCharger(e.target.value === 'yes')}
                  options={[
                    { value: 'no', label: 'No EV charger' },
                    { value: 'yes', label: 'EV charger planned' }
                  ]}
                />

                {hasEVCharger && (
                  <div className="mt-3">
                    <Input
                      label="EV Charger Amperage"
                      type="number"
                      value={evChargerAmps}
                      onChange={(e) => setEVChargerAmps(Number(e.target.value))}
                      suffix="amps"
                      min={16}
                      max={80}
                      step={4}
                      placeholder="40"
                    />
                  </div>
                )}
              </div>

              {/* 240V Tools Section */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <label className="font-medium text-neutral-900">240V Tools/Equipment</label>
                </div>
                
                <Select
                  label="240V Tools"
                  value={has240VTools ? 'yes' : 'no'}
                  onChange={(e) => setHas240VTools(e.target.value === 'yes')}
                  options={[
                    { value: 'no', label: 'No 240V equipment' },
                    { value: 'yes', label: '240V tools/equipment' }
                  ]}
                />

                {has240VTools && (
                  <div className="mt-3">
                    <Input
                      label="Largest 240V Load"
                      type="number"
                      value={toolAmps}
                      onChange={(e) => setToolAmps(Number(e.target.value))}
                      suffix="amps"
                      min={15}
                      max={60}
                      step={5}
                      placeholder="30"
                    />
                    <div className="mt-1 text-xs text-neutral-600">
                      Enter amperage of largest single 240V tool or equipment
                    </div>
                  </div>
                )}
              </div>

              {/* Load Calculation Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-medium text-green-800 mb-2">Load Calculation Summary:</div>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• Lighting: {garageSize} sq ft × {loadType.lighting} VA/sq ft = {(garageSize * loadType.lighting).toLocaleString()} VA</div>
                  <div>• Outlets: {numOutlets} × {loadType.outlets} VA = {(numOutlets * loadType.outlets).toLocaleString()} VA</div>
                  {hasEVCharger && <div>• EV Charger: {evChargerAmps}A × 240V = {(evChargerAmps * 240).toLocaleString()} VA</div>}
                  {has240VTools && <div>• 240V Tools: {toolAmps}A × 240V = {(toolAmps * 240).toLocaleString()} VA</div>}
                  <div className="pt-1 border-t border-green-300">
                    <strong>Total Demand: {totalLoad.toFixed(1)}A</strong>
                  </div>
                  <div>Recommended Panel: <strong>{recommendedPanel.size}</strong></div>
                </div>
              </div>

              {/* NEC Reference */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">NEC Requirements:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• NEC Article 225: Feeders to outbuildings</li>
                    <li>• NEC 225.31: Disconnecting means at subpanel</li>
                    <li>• NEC 250.32: Grounding electrode required</li>
                    <li>• NEC 220.83: Load calculations for feeders</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Feeder Wire Size Results
            </h2>

            {copperResult && aluminumResult && (
              <div className="space-y-6">
                <WireComparison
                  copperAwg={copperResult.awg}
                  aluminumAwg={aluminumResult.awg}
                  amps={Math.max(subpanelSize.amperage, totalLoad)}
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
                    necReference="NEC Article 225, 250.32, Table 310.16"
                  />

                  <CalculatorResult
                    awg={aluminumResult.awg}
                    ampacity={aluminumResult.ampacity}
                    voltageDropPercent={aluminumResult.voltageDropPercent}
                    groundWire={aluminumResult.groundWire}
                    material="aluminum"
                    isCompliant={aluminumResult.isCompliant}
                    warnings={aluminumResult.warnings}
                    necReference="NEC Article 225, 250.32, Table 310.16"
                  />
                </div>

                {/* Installation Requirements */}
                <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                  <div className="font-medium text-neutral-900 mb-2">Subpanel Installation Requirements:</div>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• Install main disconnect at subpanel location</li>
                    <li>• Install separate grounding electrode (rod or plate)</li>
                    <li>• Keep neutrals and grounds separate in subpanel</li>
                    <li>• Install GFCI protection for all 120V outlets</li>
                    <li>• Label all circuits clearly in subpanel</li>
                    <li>• Install weatherproof enclosure if outdoors</li>
                    <li>• Maintain proper working clearances (NEC 110.26)</li>
                    <li>• Underground burial depth per NEC Table 300.5</li>
                  </ul>
                </div>

                {/* Panel Size Recommendation */}
                {subpanelSize.amperage < recommendedPanel.amperage && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-amber-800 mb-1">Panel Size Recommendation</div>
                      <div className="text-amber-700">
                        Based on your calculated load of {totalLoad.toFixed(1)}A, consider upgrading to a {recommendedPanel.size} subpanel 
                        to provide adequate capacity and allow for future expansion.
                      </div>
                    </div>
                  </div>
                )}

                {/* Installation Method Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-800 mb-1">Installation Tips</div>
                    <div className="text-blue-700">
                      {installationMethod.type.includes('Underground') ? 
                        'Underground installations provide better protection from weather but require proper burial depth and conduit protection.' :
                        'Overhead installations are more economical but may require additional support structures for long spans.'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!copperResult && (
              <div className="text-center py-8 text-neutral-500">
                Configure subpanel parameters to see feeder wire recommendations
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}