'use client';

import { useState, useEffect , useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { CalculatorLayout } from './CalculatorLayout';
import { CalculatorResult } from './CalculatorResult';
import { WireComparison } from '@/components/visualizations/WireComparison';
import { calculateWireSize } from '@/lib/calculations/wire-sizing';
import { Zap, Car , Calculator, RefreshCw } from 'lucide-react';

const EV_CHARGER_PRESETS = [
  { name: 'Level 1 (Standard Outlet)', amps: 12, voltage: 120 },
  { name: 'Level 2 - 16A', amps: 16, voltage: 240 },
  { name: 'Level 2 - 24A', amps: 24, voltage: 240 },
  { name: 'Level 2 - 32A', amps: 32, voltage: 240 },
  { name: 'Level 2 - 40A (Tesla Gen 2)', amps: 40, voltage: 240 },
  { name: 'Level 2 - 48A (Tesla Wall Connector)', amps: 48, voltage: 240 },
  { name: 'Level 2 - 50A', amps: 50, voltage: 240 },
  { name: 'Level 2 - 60A', amps: 60, voltage: 240 },
  { name: 'Level 2 - 80A (Commercial)', amps: 80, voltage: 240 },
];

export function EVChargerCalculator() {
  const [preset, setPreset] = useState(EV_CHARGER_PRESETS[4]);
  const [distance, setDistance] = useState(50);
  const [copperResult, setCopperResult] = useState<ReturnType<typeof calculateWireSize> | null>(null);
  const [aluminumResult, setAluminumResult] = useState<ReturnType<typeof calculateWireSize> | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const circuitAmps = Math.ceil(preset.amps * 1.25);
    
    const copperCalc = calculateWireSize({
      amps: circuitAmps,
      distance,
      voltage: preset.voltage as 120 | 240,
      material: 'copper',
      phase: 'single',
    });
    
    const aluminumCalc = calculateWireSize({
      amps: circuitAmps,
      distance,
      voltage: preset.voltage as 120 | 240,
      material: 'aluminum',
      phase: 'single',
    });
    
    setCopperResult(copperCalc);
    setAluminumResult(aluminumCalc);
  }, [preset, distance]);

  const circuitAmps = Math.ceil(preset.amps * 1.25);
  const breakerSize = circuitAmps <= 15 ? 15 :
                      circuitAmps <= 20 ? 20 :
                      circuitAmps <= 30 ? 30 :
                      circuitAmps <= 40 ? 40 :
                      circuitAmps <= 50 ? 50 :
                      circuitAmps <= 60 ? 60 :
                      circuitAmps <= 70 ? 70 :
                      circuitAmps <= 80 ? 80 :
                      circuitAmps <= 90 ? 90 : 100;

  return (
    <CalculatorLayout
      title="EV Charger Wire Size Calculator"
      description="Calculate wire size for electric vehicle charging stations"
    >
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <Zap className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <strong>NEC 625.41:</strong> EV charging circuits must be rated for 125% of the charger's maximum current.
            A {preset.amps}A charger requires a {circuitAmps}A circuit with a {breakerSize}A breaker.
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-6">
            <Select
              label="Charger Type"
              options={EV_CHARGER_PRESETS.map((p) => ({
                value: p.name,
                label: `${p.name} (${p.amps}A)`,
              }))}
              value={preset.name}
              onChange={(e) => {
                const found = EV_CHARGER_PRESETS.find((p) => p.name === e.target.value);
                if (found) setPreset(found);
              }}
            />
            
            <Input
              label="Distance from Panel"
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              suffix="ft"
              min={0}
              max={500}
            />

            {/* Charging Info */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-neutral-700 font-medium">
                <Car className="w-4 h-4" />
                Charging Speed Estimate
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm min-w-0">
                <div>
                  <span className="text-neutral-500">Power Output:</span>
                  <p className="font-semibold">
                    {((preset.voltage * preset.amps) / 1000).toFixed(1)} kW
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">Miles/Hour:</span>
                  <p className="font-semibold">
                    ~{Math.round((preset.voltage * preset.amps) / 1000 * 3.5)} mph
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">Required Circuit:</span>
                  <p className="font-semibold">{circuitAmps}A</p>
                </div>
                <div>
                  <span className="text-neutral-500">Breaker Size:</span>
                  <p className="font-semibold">{breakerSize}A</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Wire Comparison Visualization */}
            {copperResult && aluminumResult && (
              <WireComparison
                copperAwg={copperResult.awg}
                aluminumAwg={aluminumResult.awg}
                amps={circuitAmps}
              />
            )}

            {/* Results for Both Materials */}
            <div className="grid gap-4">
              {/* Copper Result */}
              {copperResult && (
                <div>
                  <h3 className="text-sm font-semibold text-copper-600 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-copper-400 to-copper-600"></div>
                    Copper Wire
                  </h3>
                  <CalculatorResult
                    awg={copperResult.awg}
                    ampacity={copperResult.ampacity}
                    voltageDropPercent={copperResult.voltageDropPercent}
                    groundWire={copperResult.groundWire}
                    material="copper"
                    isCompliant={copperResult.isCompliant}
                    warnings={copperResult.warnings}
                    necReference="NEC 625.41, 310.16"
                  />
                </div>
              )}

              {/* Aluminum Result */}
              {aluminumResult && (
                <div>
                  <h3 className="text-sm font-semibold text-aluminum-600 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-aluminum-300 to-aluminum-500"></div>
                    Aluminum Wire
                  </h3>
                  <CalculatorResult
                    awg={aluminumResult.awg}
                    ampacity={aluminumResult.ampacity}
                    voltageDropPercent={aluminumResult.voltageDropPercent}
                    groundWire={aluminumResult.groundWire}
                    material="aluminum"
                    isCompliant={aluminumResult.isCompliant}
                    warnings={aluminumResult.warnings}
                    necReference="NEC 625.41, 310.16"
                  />
                </div>
              )}
            </div>

            {/* Installation Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Installation Tips:</strong> 
                {aluminumResult && copperResult && parseInt(aluminumResult.awg) <= 6 && (
                  <> Use aluminum-rated terminals and anti-oxidant compound for aluminum wire.</>
                )}
                {distance > 100 && (
                  <> Consider installing a subpanel closer to the charger for long runs.</>
                )}
                {preset.amps >= 48 && (
                  <> High-power chargers may require electrical service upgrade.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}