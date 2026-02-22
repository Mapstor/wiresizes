'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { VoltageInput } from '@/components/ui/VoltageInput';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { VoltageDropVisual } from '@/components/visualizations/VoltageDropVisual';
import { calculateVoltageDrop, VoltageDropResult } from '@/lib/calculations/wire-sizing';
import { getAllWireSizes } from '@/lib/data/nec-310-16';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, CheckCircle2, Calculator, RotateCcw } from 'lucide-react';

const WIRE_SIZE_OPTIONS = getAllWireSizes().map((awg) => ({
  value: awg,
  label: awg.includes('/') || parseInt(awg) >= 250 ? awg : `#${awg} AWG`,
}));

const VOLTAGE_OPTIONS = [
  { value: '120', label: '120V' },
  { value: '208', label: '208V' },
  { value: '240', label: '240V' },
  { value: '277', label: '277V' },
  { value: '480', label: '480V' },
];

const PHASE_OPTIONS = [
  { value: 'single', label: 'Single-Phase' },
  { value: 'three', label: 'Three-Phase' },
];

export function VoltageDropCalculator() {
  const [inputs, setInputs] = useState({
    awg: '10',
    distance: 100,
    amps: 20,
    voltage: 240,
    phase: 'single' as 'single' | 'three',
  });

  const [copperResult, setCopperResult] = useState<VoltageDropResult | null>(null);
  const [aluminumResult, setAluminumResult] = useState<VoltageDropResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const performCalculation = useCallback(() => {
    const copperCalc = calculateVoltageDrop({ ...inputs, material: 'copper' });
    const aluminumCalc = calculateVoltageDrop({ ...inputs, material: 'aluminum' });
    setCopperResult(copperCalc);
    setAluminumResult(aluminumCalc);
    setShowResults(true);
    
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }, [inputs]);

  useEffect(() => {
    performCalculation();
  }, []);

  const handleReset = () => {
    setInputs({
      awg: '10',
      distance: 100,
      amps: 20,
      voltage: 240,
      phase: 'single',
    });
    setShowResults(false);
  };

  return (
    <CalculatorLayout
      title="Voltage Drop Calculator"
      description="Calculate voltage drop for both copper and aluminum conductors"
    >
      <div className="grid lg:grid-cols-2 gap-6 p-6">
        {/* Inputs Column */}
        <div className="space-y-6">
          {/* Wire Size Select */}
          <Select
            label="Wire Size"
            options={WIRE_SIZE_OPTIONS}
            value={inputs.awg}
            onChange={(e) => setInputs((p) => ({ ...p, awg: e.target.value }))}
          />

          {/* Current Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-neutral-700">
              Current (Amps)
            </label>
            <Input
              type="number"
              value={inputs.amps}
              onChange={(e) => setInputs((p) => ({ ...p, amps: Number(e.target.value) || 0 }))}
              min={0}
              max={1000}
              suffix="A"
            />
          </div>

          {/* Distance Slider */}
          <Slider
            label="Distance (one-way)"
            value={inputs.distance}
            onChange={(distance) => setInputs((p) => ({ ...p, distance }))}
            min={0}
            max={500}
            step={10}
            suffix=" ft"
          />

          {/* Voltage Input */}
          <VoltageInput
            label="Voltage"
            value={inputs.voltage}
            onChange={(voltage) => setInputs((p) => ({ ...p, voltage }))}
            min={1}
            max={1000}
          />

          {/* Phase Select */}
          <Select
            label="Phase"
            options={PHASE_OPTIONS}
            value={inputs.phase}
            onChange={(e) => setInputs((p) => ({ 
              ...p, 
              phase: e.target.value as 'single' | 'three' 
            }))}
          />

          {/* Calculate Button */}
          <Button onClick={performCalculation} className="w-full mb-4">
            <Calculator className="w-4 h-4" />
            Calculate Voltage Drop
          </Button>

          {/* Reset Button */}
          <Button variant="secondary" onClick={handleReset} className="w-full">
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>

          {/* Divider Line */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
          </div>

          {/* Prominent Result Display with Animation */}
          {showResults && copperResult && (
            <motion.div 
              className="mt-2 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 shadow-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              key={`${copperResult?.voltageDropPercent}`} // Re-animate on result change
            >
              <h3 className="text-sm font-medium text-neutral-700 mb-2">Voltage Drop Result:</h3>
              <motion.div 
                className="text-3xl font-bold"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className={`
                  ${copperResult.voltageDropPercent <= 3 ? 'text-green-600' : 
                    copperResult.voltageDropPercent <= 5 ? 'text-amber-600' : 'text-red-600'}
                `}>
                  {copperResult.voltageDropPercent.toFixed(2)}%
                </span>
                <span className="text-lg font-medium text-neutral-600 ml-2">
                  ({copperResult.voltageDrop.toFixed(1)}V drop)
                </span>
              </motion.div>
              <motion.p 
                className="text-xs text-neutral-500 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {copperResult.voltageDropPercent <= 3 
                  ? '✓ Within NEC 3% recommendation' 
                  : copperResult.voltageDropPercent <= 5
                  ? '⚠ Exceeds 3% but within 5% limit'
                  : '✕ Exceeds recommended limits'}
              </motion.p>
            </motion.div>
          )}
        </div>

        {/* Results Column */}
        <div className="space-y-6" ref={resultsRef}>
          {/* Voltage Drop Visualization - Show copper by default */}
          {showResults && copperResult && (
            <VoltageDropVisual
              sourceVoltage={inputs.voltage}
              loadVoltage={copperResult.voltageAtLoad}
              dropPercent={copperResult.voltageDropPercent}
              distance={inputs.distance}
              wireSize={inputs.awg}
            />
          )}

          {/* Results for Both Materials */}
          {showResults && (
            <div className="grid gap-4">
              {/* Copper Result */}
              {copperResult && (
                <div className="bg-white border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-copper-600 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-copper-400 to-copper-600"></div>
                      Copper Wire
                    </h3>
                    <Badge
                      variant={copperResult.voltageDropPercent <= 3 ? 'success' : 'warning'}
                    >
                      {copperResult.voltageDropPercent <= 3 ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {copperResult.voltageDropPercent.toFixed(2)}% Drop
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-neutral-500">Voltage Drop:</span>
                      <p className="font-semibold font-mono">{copperResult.voltageDrop.toFixed(2)}V</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">End Voltage:</span>
                      <p className="font-semibold font-mono">{copperResult.voltageAtLoad.toFixed(2)}V</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Power Loss:</span>
                      <p className="font-semibold font-mono">
                        {(copperResult.voltageDrop * inputs.amps).toFixed(0)}W
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Wire Size:</span>
                      <p className="font-semibold">
                        {inputs.awg.includes('/') || parseInt(inputs.awg) >= 250 ? inputs.awg : `#${inputs.awg}`} AWG
                      </p>
                    </div>
                  </div>

                  {copperResult.voltageDropPercent > 3 && (
                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      Voltage drop exceeds NEC recommendation of 3%
                    </div>
                  )}
                </div>
              )}

              {/* Aluminum Result */}
              {aluminumResult && (
                <div className="bg-white border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-aluminum-600 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-aluminum-300 to-aluminum-500"></div>
                      Aluminum Wire
                    </h3>
                    <Badge
                      variant={aluminumResult.voltageDropPercent <= 3 ? 'success' : 'warning'}
                    >
                      {aluminumResult.voltageDropPercent <= 3 ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {aluminumResult.voltageDropPercent.toFixed(2)}% Drop
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-neutral-500">Voltage Drop:</span>
                      <p className="font-semibold font-mono">{aluminumResult.voltageDrop.toFixed(2)}V</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">End Voltage:</span>
                      <p className="font-semibold font-mono">{aluminumResult.voltageAtLoad.toFixed(2)}V</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Power Loss:</span>
                      <p className="font-semibold font-mono">
                        {(aluminumResult.voltageDrop * inputs.amps).toFixed(0)}W
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Wire Size:</span>
                      <p className="font-semibold">
                        {inputs.awg.includes('/') || parseInt(inputs.awg) >= 250 ? inputs.awg : `#${inputs.awg}`} AWG
                      </p>
                    </div>
                  </div>

                  {aluminumResult.voltageDropPercent > 3 && (
                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      Voltage drop exceeds NEC recommendation of 3%
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Material Comparison Note */}
          {showResults && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Material Comparison:</strong> Aluminum has approximately 61% higher resistance than copper, 
                resulting in {copperResult && aluminumResult ? 
                  ((aluminumResult.voltageDropPercent / copperResult.voltageDropPercent * 100 - 100).toFixed(0)) : '61'}% 
                more voltage drop for the same wire size.
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}