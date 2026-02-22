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
import { Shield, AlertTriangle, Info, Zap, Settings , Calculator, RefreshCw } from 'lucide-react';

// Load types and their characteristics
const LOAD_TYPES = [
  {
    type: 'Resistive Load',
    description: 'Heating elements, incandescent lighting',
    factor: 1.0,
    characteristics: ['Steady current', 'No inrush', 'Linear load'],
    examples: ['Electric heaters', 'Incandescent bulbs', 'Resistive heating']
  },
  {
    type: 'Inductive Load (Motor)',
    description: 'Motors, transformers, inductors',
    factor: 1.25,
    characteristics: ['High inrush current', 'Power factor < 1', 'May require time delay'],
    examples: ['AC motors', 'Pumps', 'Compressors', 'Transformers']
  },
  {
    type: 'Capacitive Load',
    description: 'Power factor correction, electronic loads',
    factor: 1.1,
    characteristics: ['High inrush current', 'Leading power factor'],
    examples: ['Capacitor banks', 'Some electronic drives', 'LED drivers']
  },
  {
    type: 'Electronic Load',
    description: 'Switching power supplies, VFDs',
    factor: 1.15,
    characteristics: ['Harmonic distortion', 'Non-linear current'],
    examples: ['Computers', 'VFDs', 'LED lighting', 'Electronic equipment']
  },
  {
    type: 'Mixed Commercial Load',
    description: 'Typical commercial building mix',
    factor: 1.2,
    characteristics: ['Combination of load types', 'Diversity factor'],
    examples: ['Office buildings', 'Retail stores', 'Mixed use facilities']
  },
];

// Breaker types and their applications
const BREAKER_TYPES = [
  {
    type: 'Standard Thermal-Magnetic',
    description: 'Basic overcurrent protection',
    applications: ['Residential', 'Light commercial', 'General purpose'],
    features: ['Fixed trip curve', 'Thermal and magnetic trip', 'Cost effective'],
    interrupt_rating: '10kA'
  },
  {
    type: 'HACR (Motor Protection)',
    description: 'Heating, Air Conditioning, Refrigeration',
    applications: ['Motor loads', 'HVAC equipment', 'Inductive loads'],
    features: ['Higher magnetic trip', 'Withstands motor inrush', 'UL listed for HACR'],
    interrupt_rating: '10kA'
  },
  {
    type: 'High Interrupt Capacity',
    description: 'Commercial/industrial applications',
    applications: ['Commercial panels', 'Industrial facilities', 'High fault current'],
    features: ['22kA interrupt rating', 'Enhanced fault handling', 'Commercial grade'],
    interrupt_rating: '22kA'
  },
  {
    type: 'Electronic Trip',
    description: 'Programmable protection',
    applications: ['Critical loads', 'Data centers', 'Precision protection'],
    features: ['Adjustable trip curves', 'Ground fault protection', 'Digital monitoring'],
    interrupt_rating: '35kA'
  },
  {
    type: 'Arc Fault Circuit Interrupter (AFCI)',
    description: 'Arc fault protection',
    applications: ['Residential bedrooms', 'Living areas', 'NEC required locations'],
    features: ['Arc fault detection', 'Enhanced safety', 'Code required'],
    interrupt_rating: '10kA'
  },
  {
    type: 'Ground Fault Circuit Interrupter (GFCI)',
    description: 'Ground fault protection',
    applications: ['Wet locations', 'Outdoor circuits', 'Personnel protection'],
    features: ['Ground fault detection', 'Personnel safety', 'Required by code'],
    interrupt_rating: '10kA'
  },
];

// Protection coordination considerations
const COORDINATION_LEVELS = [
  {
    level: 'Basic Protection',
    description: 'Simple overcurrent protection',
    selectivity: 'Limited',
    notes: 'Adequate for small installations'
  },
  {
    level: 'Selective Coordination',
    description: 'Upstream/downstream coordination',
    selectivity: 'Partial',
    notes: 'Prevents nuisance tripping'
  },
  {
    level: 'Full Selective Coordination',
    description: 'Complete system coordination',
    selectivity: 'Complete',
    notes: 'Critical for emergency systems'
  },
];

export function CircuitBreakerCalculator() {
  const [loadCurrent, setLoadCurrent] = useState(20.0);
  const [loadType, setLoadType] = useState(LOAD_TYPES[0]); // Default to resistive
  const [breakerType, setBreakerType] = useState(BREAKER_TYPES[0]); // Default to standard
  const [coordinationLevel, setCoordinationLevel] = useState(COORDINATION_LEVELS[0]);
  const [voltage, setVoltage] = useState<240 | 120 | 480>(240);
  const [phase, setPhase] = useState<'single' | 'three'>('single');
  const [distance, setDistance] = useState(100);
  const [hasMotorLoad, setHasMotorLoad] = useState(false);
  const [motorFLA, setMotorFLA] = useState(15.0);
  const [results, setResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculate required breaker size
  const calculateBreakerSize = useCallback((): number => {
    let requiredSize = loadCurrent * loadType.factor;
    
    // Motor load considerations per NEC 430.52
    if (hasMotorLoad) {
      const motorBreaker = motorFLA * 2.5; // Inverse time breaker sizing
      requiredSize = Math.max(requiredSize, motorBreaker);
    }
    
    // Round up to standard breaker size
    const standardSizes = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600, 700, 800];
    return standardSizes.find(size => size >= requiredSize) || standardSizes[standardSizes.length - 1];
  }, [loadCurrent, loadType, hasMotorLoad, motorFLA]);

  // Get conductor ampacity requirement
  const getConductorAmpacity = useCallback((): number => {
    let conductorAmps = loadCurrent;
    
    // Apply continuous load factor (125% per NEC 210.19)
    if (loadType.type.includes('Resistive') || loadType.type.includes('Electronic')) {
      conductorAmps *= 1.25; // Assume continuous for these load types
    }
    
    // Motor load considerations
    if (hasMotorLoad) {
      conductorAmps = Math.max(conductorAmps, motorFLA * 1.25);
    }
    
    return Math.ceil(conductorAmps * 100) / 100;
  }, [loadCurrent, loadType, hasMotorLoad, motorFLA]);

  const calculate = useCallback(() => {
    const baseInput: WireSizeInput = {
      amps: loadCurrent,
      voltage: voltage as VoltageLevel,
      distance,
      material: 'copper',
      phase: phase === 'single' ? 'single' : 'three'
    };

    const copperWire = calculateWireSize({ ...baseInput, material: 'copper' });
    const aluminumWire = calculateWireSize({ ...baseInput, material: 'aluminum' });

    const ampacityRequirement = getConductorAmpacity();
    const breakerSize = calculateBreakerSize();

    const recommendation = {
      copperSize: copperWire.awg,
      aluminumSize: aluminumWire.awg,
      ampacityRequired: ampacityRequirement,
      breakerSize,
      notes: [
        'Conductor must be rated for breaker size minimum',
        hasMotorLoad ? 'Motor loads require 125% conductor sizing per NEC 430.22' : '',
        loadType.type.includes('continuous') ? '125% safety factor applied for continuous loads' : '',
        coordinationLevel.selectivity === 'Complete' ? 'Time-current coordination considered' : ''
      ].filter(note => note)
    };

    setResults({
      copperWire,
      aluminumWire,
      ampacityRequirement,
      breakerSize,
      recommendation,
      notes: []
    });
  }, [loadCurrent, loadType, breakerType, coordinationLevel, voltage, phase, distance, hasMotorLoad, motorFLA, calculateBreakerSize, getConductorAmpacity]);

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

  const breakerSize = calculateBreakerSize();
  const conductorAmps = getConductorAmpacity();

  // Shareable URL and Print functionality
  const shareableInputs = {
    loadCurrent,
    loadType: loadType.type,
    breakerType: breakerType.type,
    coordination: coordinationLevel.level,
    voltage,
    phase,
    distance,
    ...(hasMotorLoad && { motorFLA }),
  };

  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!results) return;
    print({
      title: 'Circuit Breaker Selection Calculation',
      inputs: {
        'Load Current': `${loadCurrent}A`,
        'Load Type': loadType.type,
        'Breaker Type': breakerType.type,
        'Voltage': `${voltage}V`,
        'Phase': phase,
        'Distance': `${distance} feet`,
        'Coordination Level': coordinationLevel.level,
        ...(hasMotorLoad && { 'Motor FLA': `${motorFLA}A` }),
      },
      results: {
        'Load Current': `${loadCurrent}A`,
        'Conductor Requirement': `${conductorAmps}A`,
        'Recommended Breaker': `${breakerSize}A`,
        'Breaker Type': breakerType.type,
        'Copper Wire': results?.copperWire?.awg + ' AWG' || 'N/A',
        'Aluminum Wire': results?.aluminumWire?.awg + ' AWG' || 'N/A',
      },
    });
  }, [loadCurrent, loadType, breakerType, coordinationLevel, voltage, phase, distance, hasMotorLoad, motorFLA, conductorAmps, breakerSize, results, print]);

  return (
    <CalculatorLayout
      title="Circuit Breaker Calculator"
      description="Calculate breaker size and conductor requirements for electrical circuits"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="space-y-6">
        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-800 mb-1">Circuit Protection Safety</div>
            <div className="text-amber-700">
              Proper circuit breaker selection requires consideration of load characteristics, fault current levels, 
              and coordination with other protective devices. Always verify interrupt ratings and consult with 
              qualified engineers for complex installations.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-600" />
              Circuit Protection Configuration
            </h2>

            <div className="space-y-4">
              <Input
                label="Load Current"
                type="number"
                value={loadCurrent}
                onChange={(e) => setLoadCurrent(Number(e.target.value))}
                suffix="amps"
                min={1}
                max={1000}
                step={0.1}
                placeholder="20.0"
              />

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

              <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
                <div className="font-medium mb-1">Load Characteristics:</div>
                <div>• Type: {loadType.type}</div>
                <div>• Sizing Factor: {loadType.factor}x</div>
                <div>• Description: {loadType.description}</div>
                <div className="mt-2 text-xs">
                  <div className="font-medium text-neutral-700 mb-1">Characteristics:</div>
                  {loadType.characteristics.map((char, index) => (
                    <div key={index}>• {char}</div>
                  ))}
                </div>
                <div className="mt-2 text-xs">
                  <div className="font-medium text-neutral-700 mb-1">Examples:</div>
                  {loadType.examples.map((example, index) => (
                    <div key={index}>• {example}</div>
                  ))}
                </div>
              </div>

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
                label="Distance to Load"
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                suffix="feet"
                min={0}
                max={1000}
                placeholder="100"
              />

              <Select
                label="Breaker Type"
                value={breakerType.type}
                onChange={(e) => {
                  const selected = BREAKER_TYPES.find(b => b.type === e.target.value);
                  if (selected) setBreakerType(selected);
                }}
                options={BREAKER_TYPES.map(breaker => ({
                  value: breaker.type,
                  label: breaker.type
                }))}
              />

              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <div className="font-medium mb-1">Breaker Specifications:</div>
                <div>• Type: {breakerType.type}</div>
                <div>• Interrupt Rating: {breakerType.interrupt_rating}</div>
                <div>• Description: {breakerType.description}</div>
                <div className="mt-2 text-xs">
                  <div className="font-medium text-blue-700 mb-1">Applications:</div>
                  {breakerType.applications.map((app, index) => (
                    <div key={index}>• {app}</div>
                  ))}
                </div>
                <div className="mt-2 text-xs">
                  <div className="font-medium text-blue-700 mb-1">Features:</div>
                  {breakerType.features.map((feature, index) => (
                    <div key={index}>• {feature}</div>
                  ))}
                </div>
              </div>

              <Select
                label="Coordination Level"
                value={coordinationLevel.level}
                onChange={(e) => {
                  const selected = COORDINATION_LEVELS.find(c => c.level === e.target.value);
                  if (selected) setCoordinationLevel(selected);
                }}
                options={COORDINATION_LEVELS.map(coord => ({
                  value: coord.level,
                  label: coord.level
                }))}
              />

              {/* Motor Load Section */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4 text-orange-600" />
                  <label className="font-medium text-neutral-900">Motor Load Considerations</label>
                </div>
                
                <Select
                  label="Motor Load Present"
                  value={hasMotorLoad ? 'yes' : 'no'}
                  onChange={(e) => setHasMotorLoad(e.target.value === 'yes')}
                  options={[
                    { value: 'no', label: 'No motor loads' },
                    { value: 'yes', label: 'Motor load present' }
                  ]}
                />

                {hasMotorLoad && (
                  <div className="mt-3">
                    <Input
                      label="Motor Full Load Amps (FLA)"
                      type="number"
                      value={motorFLA}
                      onChange={(e) => setMotorFLA(Number(e.target.value))}
                      suffix="amps"
                      min={1}
                      max={200}
                      step={0.1}
                      placeholder="15.0"
                    />
                    <div className="mt-2 text-xs text-neutral-600">
                      Motor breaker sizing per NEC 430.52 (typically 250% of FLA for inverse time breakers)
                    </div>
                  </div>
                )}
              </div>

              {/* Calculation Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Protection Calculation Summary
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• Load Current: {loadCurrent}A</div>
                  <div>• Load Factor: {loadType.factor}x ({loadType.type})</div>
                  <div>• Conductor Requirement: {conductorAmps}A</div>
                  {hasMotorLoad && (
                    <div>• Motor Breaker Requirement: {(motorFLA * 2.5).toFixed(1)}A</div>
                  )}
                  <div className="pt-1 border-t border-green-300">
                    <strong>Recommended Breaker: {breakerSize}A</strong>
                  </div>
                  <div>Breaker Type: <strong>{breakerType.type}</strong></div>
                </div>
              </div>

              {/* NEC Reference */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">NEC References:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• NEC 210.19: Branch circuit conductor sizing</li>
                    <li>• NEC 210.20: Overcurrent protection rating</li>
                    <li>• NEC 430.52: Motor branch circuit protection</li>
                    <li>• NEC 240.4: Protection of conductors</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Protection & Wire Size Results
            </h2>

            {results && (
              <div className="space-y-6">
                {/* Breaker Selection Summary */}
                <div className="bg-neutral-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 text-center mb-4">
                    Protection Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-red-100 rounded-lg p-3">
                      <div className="text-red-800 font-semibold">Breaker Size</div>
                      <div className="text-2xl font-bold text-red-900">{results.breakerSize}A</div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3">
                      <div className="text-blue-800 font-semibold">Conductor Amps</div>
                      <div className="text-2xl font-bold text-blue-900">{results.ampacityRequirement}A</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm text-neutral-600">
                    {breakerType.type} • {breakerType.interrupt_rating} Interrupt Rating
                  </div>
                </div>

                <WireComparison
                  copperAwg={results.copperWire?.awg || '12'}
                  aluminumAwg={results.aluminumWire?.awg || '10'}
                  amps={results.ampacityRequirement}
                />

                <div className="grid gap-4">
                  <CalculatorResult
                    awg={results.copperWire?.awg || '12'}
                    ampacity={results.copperWire?.ampacity || 25}
                    voltageDropPercent={results.copperWire?.voltageDropPercent || 2.5}
                    groundWire={results.copperWire?.groundWire || '12'}
                    material="copper"
                    isCompliant={results.copperWire?.isCompliant || true}
                    warnings={results.copperWire?.warnings || []}
                    necReference="NEC 210.19, 210.20, 240.4, Table 310.16"
                  />

                  <CalculatorResult
                    awg={results.aluminumWire?.awg || '10'}
                    ampacity={results.aluminumWire?.ampacity || 25}
                    voltageDropPercent={results.aluminumWire?.voltageDropPercent || 2.5}
                    groundWire={results.aluminumWire?.groundWire || '10'}
                    material="aluminum"
                    isCompliant={results.aluminumWire?.isCompliant || true}
                    warnings={results.aluminumWire?.warnings || []}
                    necReference="NEC 210.19, 210.20, 240.4, Table 310.16"
                  />
                </div>

                {/* Coordination Information */}
                <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                  <div className="font-medium text-neutral-900 mb-2">Protection Coordination:</div>
                  <div className="text-neutral-600 space-y-1">
                    <div>• Level: {coordinationLevel.level}</div>
                    <div>• Selectivity: {coordinationLevel.selectivity}</div>
                    <div>• Notes: {coordinationLevel.notes}</div>
                  </div>
                </div>

                {/* Installation Guidelines */}
                <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                  <div className="font-medium text-neutral-900 mb-2">Installation Guidelines:</div>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• Verify breaker interrupt rating meets available fault current</li>
                    <li>• Consider load inrush characteristics when selecting trip curve</li>
                    <li>• Ensure proper torque on breaker connections</li>
                    <li>• Label circuits clearly at panel</li>
                    <li>• Consider ambient temperature derating if applicable</li>
                    <li>• Verify compatibility with panel bus rating</li>
                    <li>• Install arc flash warning labels per NFPA 70E</li>
                  </ul>
                </div>

                {/* Load Type Considerations */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                  <Settings className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-purple-800 mb-1">Load Type Considerations</div>
                    <div className="text-purple-700">
                      {loadType.type} loads have specific characteristics that affect breaker selection. 
                      {loadType.type.includes('Motor') && ' Motor loads require special consideration for inrush current and may need time-delay features.'}
                      {loadType.type.includes('Electronic') && ' Electronic loads may produce harmonics and benefit from electronic trip breakers.'}
                      {loadType.type.includes('Resistive') && ' Resistive loads have steady current draw and are compatible with standard thermal-magnetic breakers.'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Button onClick={performCalculation} className="w-full sm:w-auto">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Protection Requirements
              </Button>
            </div>

            {!results && (
              <div className="text-center py-8 text-neutral-500">
                Configure load parameters and click Calculate to see breaker and wire recommendations
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}