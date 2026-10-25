'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { VoltageDropVisual } from '@/components/visualizations/VoltageDropVisual';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, CheckCircle2, Calculator, RotateCcw } from 'lucide-react';
import { formatSize } from '@/lib/calculations/sizes';
import type { Material } from '@/lib/calculations/sizes';
import { voltageOptions, voltsAfterPhaseChange } from '@/lib/calculations/inputs';
import type { Phase } from '@/lib/calculations/inputs';
import {
  ALUMINUM_RESISTANCE_NOTE,
  LENGTH_MAX_FT,
  LENGTH_MIN_FT,
  RESISTANCE_BASIS_LABEL,
  targetTitle,
  VD_INPUT_INVALID_MESSAGE,
  VD_TARGET_OPTIONS,
  voltageDrop,
  voltageDropSizes,
  VOLTAGE_DROP_DEFAULTS,
} from '@/lib/calculations/voltage-drop';
import type { VoltageDropResult } from '@/lib/calculations/voltage-drop';

const WIRE_SIZE_OPTIONS = voltageDropSizes('Cu').map((key) => ({ value: key, label: formatSize(key) }));
const TARGET_OPTIONS = VD_TARGET_OPTIONS.map((pct) => ({ value: String(pct), label: `${pct} %` }));

const PHASE_OPTIONS = [
  { value: 'single', label: 'Single-Phase' },
  { value: 'three', label: 'Three-Phase' },
];

const MATERIALS: { material: Material; key: 'copper' | 'aluminum'; label: string }[] = [
  { material: 'Cu', key: 'copper', label: 'Copper Wire' },
  { material: 'Al', key: 'aluminum', label: 'Aluminum Wire' },
];

interface Inputs {
  awg: string;
  lengthFt: number | '';
  amps: number | '';
  voltage: number;
  phase: Phase;
  targetPct: number;
}

const DEFAULT_INPUTS: Inputs = {
  awg: VOLTAGE_DROP_DEFAULTS.size,
  lengthFt: VOLTAGE_DROP_DEFAULTS.lengthFt,
  amps: VOLTAGE_DROP_DEFAULTS.amps,
  voltage: VOLTAGE_DROP_DEFAULTS.volts,
  phase: VOLTAGE_DROP_DEFAULTS.phase,
  targetPct: VOLTAGE_DROP_DEFAULTS.targetPct,
};

interface Calculated {
  inputs: Inputs;
  error: string | null;
  results: { key: 'copper' | 'aluminum'; label: string; result: VoltageDropResult }[];
}

function calculate(inputs: Inputs): Calculated {
  const lengthOk = inputs.lengthFt !== '' && inputs.lengthFt >= LENGTH_MIN_FT && inputs.lengthFt <= LENGTH_MAX_FT;
  const ampsOk = inputs.amps !== '' && inputs.amps >= 0;
  if (!lengthOk || !ampsOk) return { inputs, error: VD_INPUT_INVALID_MESSAGE, results: [] };
  const results: Calculated['results'] = [];
  for (const m of MATERIALS) {
    // NEC Table 310.16 has no 14 AWG aluminum row: no aluminum result for 14 AWG
    const result = voltageDrop({
      size: inputs.awg,
      material: m.material,
      amps: inputs.amps as number,
      lengthFt: inputs.lengthFt as number,
      volts: inputs.voltage,
      phase: inputs.phase,
    });
    if (result) results.push({ key: m.key, label: m.label, result });
  }
  return { inputs, error: null, results };
}

export function VoltageDropCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [calculated, setCalculated] = useState<Calculated | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const performCalculation = useCallback(() => {
    setCalculated(calculate(inputs));

    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, [inputs]);

  useEffect(() => {
    setCalculated(calculate(DEFAULT_INPUTS));
  }, []);

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setCalculated(null);
  };

  const copper = calculated?.results.find((r) => r.key === 'copper')?.result ?? null;
  const shown = calculated?.inputs;

  return (
    <CalculatorLayout
      title="Voltage Drop Calculator"
      description="Calculate voltage drop for both copper and aluminum conductors"
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Wire Size Select */}
            <Select
              label="Wire Size"
              options={WIRE_SIZE_OPTIONS}
              value={inputs.awg}
              onChange={(e) => setInputs((p) => ({ ...p, awg: e.target.value }))}
            />

            <Input
              label="Current (Amps)"
              type="number"
              value={inputs.amps}
              onChange={(e) => setInputs((p) => ({ ...p, amps: e.target.value === '' ? '' : Number(e.target.value) }))}
              min={0}
              step="any"
              suffix="A"
            />

            <Input
              label="Distance (one-way)"
              type="number"
              value={inputs.lengthFt}
              onChange={(e) => setInputs((p) => ({ ...p, lengthFt: e.target.value === '' ? '' : Number(e.target.value) }))}
              min={LENGTH_MIN_FT}
              max={LENGTH_MAX_FT}
              step={1}
              suffix="ft"
            />

            <Select
              label="Voltage"
              options={voltageOptions(inputs.phase).map((v) => ({ value: String(v), label: `${v} V` }))}
              value={String(inputs.voltage)}
              onChange={(e) => setInputs((p) => ({ ...p, voltage: Number(e.target.value) }))}
            />

            {/* Phase Select */}
            <Select
              label="Phase"
              options={PHASE_OPTIONS}
              value={inputs.phase}
              onChange={(e) => {
                const phase = e.target.value as Phase;
                setInputs((p) => ({ ...p, phase, voltage: voltsAfterPhaseChange(p.voltage, phase) }));
              }}
            />

            <Select
              label="Voltage-drop target (your choice)"
              options={TARGET_OPTIONS}
              value={String(inputs.targetPct)}
              onChange={(e) => setInputs((p) => ({ ...p, targetPct: Number(e.target.value) }))}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <Button onClick={performCalculation} className="flex-1">
              <Calculator className="w-4 h-4" />
              Calculate Voltage Drop
            </Button>
            <Button variant="secondary" onClick={handleReset} className="flex-1">
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
          </div>

          {/* Prominent Result Display */}
          {shown && copper && (
            <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 shadow-lg">
              <h3 className="text-sm font-medium text-neutral-700 mb-2">Voltage Drop Result:</h3>
              <div className="text-3xl font-bold">
                <span className={copper.vdPct <= shown.targetPct ? 'text-green-600' : 'text-amber-600'}>
                  {copper.vdPct.toFixed(2)} %
                </span>
                <span className="text-lg font-medium text-neutral-600 ml-2">
                  ({copper.vdVolts.toFixed(2)} V drop)
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {targetTitle(copper.vdPct <= shown.targetPct)} ({shown.targetPct} %)
              </p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {calculated && shown && (
          <div className="space-y-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold">Calculation Results</h2>
            {calculated.error ? (
              <div className="rounded-xl p-6 bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
                {calculated.error}
              </div>
            ) : (
              <>
                {/* Voltage Drop Visualization - Show copper by default */}
                {copper && (
                  <VoltageDropVisual
                    sourceVoltage={shown.voltage}
                    loadVoltage={copper.loadVolts}
                    dropPercent={copper.vdPct}
                    distance={shown.lengthFt as number}
                    wireSize={shown.awg}
                    targetPct={shown.targetPct}
                  />
                )}

                {/* Results for Both Materials */}
                <div className="grid md:grid-cols-2 gap-4">
                  {calculated.results.map(({ key, label, result }) => {
                    const meets = result.vdPct <= shown.targetPct;
                    return (
                      <div key={key} className="bg-white border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3
                            className={`font-semibold flex items-center gap-2 ${
                              key === 'copper' ? 'text-copper-600' : 'text-aluminum-600'
                            }`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full bg-gradient-to-br ${
                                key === 'copper' ? 'from-copper-400 to-copper-600' : 'from-aluminum-300 to-aluminum-500'
                              }`}
                            ></div>
                            {label}
                          </h3>
                          <Badge variant={meets ? 'success' : 'warning'}>
                            {meets ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {result.vdPct.toFixed(2)} % Drop
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-neutral-700 mb-3">{targetTitle(meets)}</p>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-neutral-500">Voltage Drop:</span>
                            <p className="font-semibold font-mono">{result.vdVolts.toFixed(2)} V</p>
                          </div>
                          <div>
                            <span className="text-neutral-500">End Voltage:</span>
                            <p className="font-semibold font-mono">{result.loadVolts.toFixed(2)} V</p>
                          </div>
                          <div>
                            <span className="text-neutral-500">Power Loss:</span>
                            <p className="font-semibold font-mono">{result.powerLossW.toFixed(0)} W</p>
                          </div>
                          <div>
                            <span className="text-neutral-500">Wire Size:</span>
                            <p className="font-semibold">{formatSize(shown.awg)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Material Comparison Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-blue-800">
                    <strong>Material Comparison:</strong> Aluminum has {ALUMINUM_RESISTANCE_NOTE}.
                  </p>
                  <p className="text-xs text-blue-700">{RESISTANCE_BASIS_LABEL}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
