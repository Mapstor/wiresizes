'use client';

import { useState, useEffect , useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { CalculatorLayout } from './CalculatorLayout';
import { CalculatorResult } from './CalculatorResult';
import { WireComparison } from '@/components/visualizations/WireComparison';
import { calculateWireSize } from '@/lib/calculations/wire-sizing';
import { Droplets, AlertTriangle , Calculator, RefreshCw } from 'lucide-react';

const HOT_TUB_SIZES = [
  { name: 'Small (2-3 person)', amps: 30, gallons: 300 },
  { name: 'Medium (4-5 person)', amps: 40, gallons: 400 },
  { name: 'Large (6+ person)', amps: 50, gallons: 500 },
  { name: 'Extra Large (8+ person)', amps: 60, gallons: 600 },
];

export function HotTubCalculator() {
  const [size, setSize] = useState(HOT_TUB_SIZES[2]);
  const [distance, setDistance] = useState(50);
  const [copperResult, setCopperResult] = useState<ReturnType<typeof calculateWireSize> | null>(null);
  const [aluminumResult, setAluminumResult] = useState<ReturnType<typeof calculateWireSize> | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const copperCalc = calculateWireSize({
      amps: size.amps,
      distance,
      voltage: 240,
      material: 'copper',
      phase: 'single',
    });
    
    const aluminumCalc = calculateWireSize({
      amps: size.amps,
      distance,
      voltage: 240,
      material: 'aluminum',
      phase: 'single',
    });
    
    setCopperResult(copperCalc);
    setAluminumResult(aluminumCalc);
  }, [size, distance]);

  return (
    <CalculatorLayout
      title="Hot Tub Wire Size Calculator"
      description="Calculate wire size for spa and hot tub installations"
    >
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Safety Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <strong>NEC 680.42 Requirements:</strong> Hot tubs require GFCI protection, 
            a disconnect within sight (5-50 ft), and proper bonding. Always consult a licensed electrician.
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-6">
            <Select
              label="Hot Tub Size"
              options={HOT_TUB_SIZES.map((s) => ({
                value: s.name,
                label: `${s.name} - ${s.amps}A`,
              }))}
              value={size.name}
              onChange={(e) => {
                const found = HOT_TUB_SIZES.find((s) => s.name === e.target.value);
                if (found) setSize(found);
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

            {/* Hot Tub Specifications */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-neutral-700 font-medium">
                <Droplets className="w-4 h-4" />
                Typical Specifications
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm min-w-0">
                <div>
                  <span className="text-neutral-500">Current Draw:</span>
                  <p className="font-semibold">{size.amps}A @ 240V</p>
                </div>
                <div>
                  <span className="text-neutral-500">Power:</span>
                  <p className="font-semibold">{(size.amps * 240 / 1000).toFixed(1)} kW</p>
                </div>
                <div>
                  <span className="text-neutral-500">Capacity:</span>
                  <p className="font-semibold">~{size.gallons} gallons</p>
                </div>
                <div>
                  <span className="text-neutral-500">Breaker Size:</span>
                  <p className="font-semibold">{size.amps}A GFCI</p>
                </div>
              </div>
            </div>

            {/* Required Components */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Required Components:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {size.amps}A GFCI breaker (2-pole)</li>
                <li>• Spa disconnect panel (within sight)</li>
                <li>• Ground fault protection device</li>
                <li>• #8 AWG bonding wire (minimum)</li>
                <li>• Weatherproof conduit and fittings</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            {/* Wire Comparison Visualization */}
            {copperResult && aluminumResult && (
              <WireComparison
                copperAwg={copperResult.awg}
                aluminumAwg={aluminumResult.awg}
                amps={size.amps}
              />
            )}

            {/* Results for Both Materials */}
            <div className="grid gap-4">
              {/* Copper Result */}
              {copperResult && (
                <div>
                  <h3 className="text-sm font-semibold text-copper-600 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-copper-400 to-copper-600"></div>
                    Copper Wire (Recommended)
                  </h3>
                  <CalculatorResult
                    awg={copperResult.awg}
                    ampacity={copperResult.ampacity}
                    voltageDropPercent={copperResult.voltageDropPercent}
                    groundWire={copperResult.groundWire}
                    material="copper"
                    isCompliant={copperResult.isCompliant}
                    warnings={[
                      'GFCI protection required',
                      'Disconnect required within sight',
                      'Bonding wire required',
                      ...copperResult.warnings
                    ]}
                    necReference="NEC 680.42, 310.16"
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
                    warnings={[
                      'GFCI protection required',
                      'Disconnect required within sight',
                      'Bonding wire required',
                      'Use AL-rated terminals',
                      ...aluminumResult.warnings
                    ]}
                    necReference="NEC 680.42, 310.16"
                  />
                </div>
              )}
            </div>

            {/* Installation Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Installation Note:</strong> Hot tub installations require special considerations 
                for wet locations. {copperResult && copperResult.awg && (
                  <>Use THWN-2 or XHHW-2 rated wire. </>
                )}
                All metal parts within 5 feet must be bonded with #8 AWG copper wire minimum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}