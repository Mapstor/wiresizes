'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { VoltageDropVisual } from '@/components/visualizations/VoltageDropVisual';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, CheckCircle2, Calculator, RotateCcw } from 'lucide-react';
import { formatSize, NO_14_AWG_ALUMINUM_NOTE } from '@/lib/calculations/sizes';
import type { Material } from '@/lib/calculations/sizes';
import { voltageOptions, voltsAfterPhaseChange } from '@/lib/calculations/inputs';
import type { Phase } from '@/lib/calculations/inputs';
import {
  ALUMINUM_RESISTANCE_NOTE,
  ampacityExceeded,
  ampacityNote,
  DROP_EXCEEDS_SUPPLY_MESSAGE,
  dropExceedsSupply,
  formatVdPct,
  formatVdVolts,
  LENGTH_MAX_FT,
  LENGTH_MIN_FT,
  RESISTANCE_BASIS_LABEL,
  targetTitle,
  VD_HEADLINE_LABELS,
  VD_INPUT_INVALID_MESSAGE,
  VD_TARGET_OPTIONS,
  voltageDrop,
  voltageDropSizes,
  VOLTAGE_DROP_DEFAULTS,
  WIRE_SIZE_CALCULATOR_LINK,
} from '@/lib/calculations/voltage-drop';
import type { VoltageDropResult } from '@/lib/calculations/voltage-drop';
import { fieldNumber } from '@/lib/calculations/fields';
import { formatFixed } from '@/lib/calculations/format';
import { focusResults, useFieldErrors } from '@/lib/hooks/useCalculatorForm';

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

type Results = { key: 'copper' | 'aluminum'; material: Material; label: string; result: VoltageDropResult }[];

interface Inputs {
  awg: string;
  /** Field text */
  lengthFt: string;
  /** Field text */
  amps: string;
  voltage: number;
  phase: Phase;
  targetPct: number;
}

const DEFAULT_INPUTS: Inputs = {
  awg: VOLTAGE_DROP_DEFAULTS.size,
  lengthFt: String(VOLTAGE_DROP_DEFAULTS.lengthFt),
  amps: String(VOLTAGE_DROP_DEFAULTS.amps),
  voltage: VOLTAGE_DROP_DEFAULTS.volts,
  phase: VOLTAGE_DROP_DEFAULTS.phase,
  targetPct: VOLTAGE_DROP_DEFAULTS.targetPct,
};

/** The message for each invalid field. */
function fieldErrors(inputs: Inputs): { amps: string | null; lengthFt: string | null } {
  const length = fieldNumber(inputs.lengthFt);
  const amps = fieldNumber(inputs.amps);
  return {
    amps: amps >= 0 ? null : VD_INPUT_INVALID_MESSAGE,
    lengthFt: length >= LENGTH_MIN_FT && length <= LENGTH_MAX_FT ? null : VD_INPUT_INVALID_MESSAGE,
  };
}

function calculate(inputs: Inputs): Results {
  const results: Results = [];
  for (const m of MATERIALS) {
    // NEC Table 310.16 has no 14 AWG aluminum row: no aluminum result for 14 AWG
    const result = voltageDrop({
      size: inputs.awg,
      material: m.material,
      amps: fieldNumber(inputs.amps),
      lengthFt: fieldNumber(inputs.lengthFt),
      volts: inputs.voltage,
      phase: inputs.phase,
    });
    if (result) results.push({ key: m.key, material: m.material, label: m.label, result });
  }
  return results;
}

/** Under a material's result when the current is above the size's 60 °C ampacity. */
function AmpacityNote({ size, material, ampacity, className }: { size: string; material: Material; ampacity: number; className: string }) {
  const note = ampacityNote(size, material, ampacity);
  return (
    <p className={`flex items-start gap-1.5 text-sm text-amber-700 ${className}`}>
      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>
        {note.before}
        <Link href={WIRE_SIZE_CALCULATOR_LINK.href} className="font-medium underline hover:text-amber-800">
          {note.link}
        </Link>
        {note.after}
      </span>
    </p>
  );
}

export function VoltageDropCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const fields = useFieldErrors();

  const errors = fieldErrors(inputs);
  const valid = errors.amps === null && errors.lengthFt === null;
  const results = valid ? calculate(inputs) : null;

  const change = (patch: Partial<Inputs>) => setInputs((p) => ({ ...p, ...patch }));

  const handleCalculate = () => {
    if (valid) focusResults(resultsHeadingRef.current);
    else fields.revealAll(formRef.current);
  };

  const handleReset = () => {
    fields.reset();
    setInputs(DEFAULT_INPUTS);
  };

  const copper = results?.find((r) => r.key === 'copper')?.result ?? null;
  const lengthFt = fieldNumber(inputs.lengthFt);
  const amps = fieldNumber(inputs.amps);

  return (
    <CalculatorLayout
      title="Voltage Drop Calculator"
      description="Calculate voltage drop for both copper and aluminum conductors"
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-6" ref={formRef}>
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Wire Size Select */}
            <Select
              label="Wire Size"
              options={WIRE_SIZE_OPTIONS}
              value={inputs.awg}
              onChange={(e) => change({ awg: e.target.value })}
            />

            <Input
              label="Current (Amps)"
              type="number"
              value={inputs.amps}
              onChange={(e) => change({ amps: e.target.value })}
              onBlur={() => fields.touch('amps')}
              error={fields.shown('amps', errors.amps)}
              min={0}
              step="any"
              suffix="A"
            />

            <Input
              label="Distance (one-way)"
              type="number"
              value={inputs.lengthFt}
              onChange={(e) => change({ lengthFt: e.target.value })}
              onBlur={() => fields.touch('lengthFt')}
              error={fields.shown('lengthFt', errors.lengthFt)}
              min={LENGTH_MIN_FT}
              max={LENGTH_MAX_FT}
              step={1}
              suffix="ft"
            />

            <Select
              label="Voltage"
              options={voltageOptions(inputs.phase).map((v) => ({ value: String(v), label: `${v} V` }))}
              value={String(inputs.voltage)}
              onChange={(e) => change({ voltage: Number(e.target.value) })}
            />

            {/* Phase Select */}
            <Select
              label="Phase"
              options={PHASE_OPTIONS}
              value={inputs.phase}
              onChange={(e) => {
                const phase = e.target.value as Phase;
                change({ phase, voltage: voltsAfterPhaseChange(inputs.voltage, phase) });
              }}
            />

            <Select
              label="Voltage-drop target (your choice)"
              options={TARGET_OPTIONS}
              value={String(inputs.targetPct)}
              onChange={(e) => change({ targetPct: Number(e.target.value) })}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <Button onClick={handleCalculate} className="flex-1">
              <Calculator className="w-4 h-4" />
              Calculate Voltage Drop
            </Button>
            <Button variant="secondary" onClick={handleReset} className="flex-1">
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
          </div>

          {/* Prominent Result Display: copper, then aluminum (no aluminum row for 14 AWG) */}
          {results && (
            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-neutral-200 shadow-lg space-y-4">
              {MATERIALS.map((m) => {
                const result = results.find((r) => r.material === m.material)?.result ?? null;
                const meets = result !== null && result.vdPct <= inputs.targetPct;
                const ampacity = result ? ampacityExceeded(inputs.awg, m.material, amps) : null;
                return (
                  <div key={m.key}>
                    <h3 className="text-sm font-medium text-neutral-700 mb-2">{VD_HEADLINE_LABELS[m.material]}</h3>
                    {result ? (
                      <>
                        {dropExceedsSupply(result) ? (
                          <p className="text-sm font-medium text-amber-700">{DROP_EXCEEDS_SUPPLY_MESSAGE}</p>
                        ) : (
                          <div className="text-3xl font-bold">
                            <span className={meets ? 'text-green-600' : 'text-amber-600'}>
                              {formatVdPct(result.vdPct)}
                            </span>
                            <span className="text-lg font-medium text-neutral-600 ml-2">
                              ({formatVdVolts(result.vdVolts)} drop)
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-neutral-500 mt-1">
                          {targetTitle(meets)} ({inputs.targetPct} %)
                        </p>
                        {ampacity !== null && (
                          <AmpacityNote size={inputs.awg} material={m.material} ampacity={ampacity} className="mt-2" />
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-neutral-700">{NO_14_AWG_ALUMINUM_NOTE}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h2 ref={resultsHeadingRef} tabIndex={-1} className="text-lg font-semibold">Calculation Results</h2>
          {results && (
              <>
                {/* Voltage Drop Visualization - Show copper by default */}
                {copper && (
                  dropExceedsSupply(copper) ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                      <p className="text-sm font-medium text-amber-700">{DROP_EXCEEDS_SUPPLY_MESSAGE}</p>
                    </div>
                  ) : (
                    <VoltageDropVisual
                      sourceVoltage={inputs.voltage}
                      loadVoltage={copper.loadVolts}
                      dropPercent={copper.vdPct}
                      distance={lengthFt}
                      wireSize={inputs.awg}
                      targetPct={inputs.targetPct}
                    />
                  )
                )}

                {/* Results for Both Materials */}
                <div className="grid md:grid-cols-2 gap-4">
                  {results.map(({ key, material, label, result }) => {
                    const meets = result.vdPct <= inputs.targetPct;
                    const exceeds = dropExceedsSupply(result);
                    const ampacity = ampacityExceeded(inputs.awg, material, amps);
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
                          {!exceeds && (
                            <Badge variant={meets ? 'success' : 'warning'}>
                              {meets ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                              {formatVdPct(result.vdPct)} Drop
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-neutral-700 mb-3">{targetTitle(meets)}</p>
                        {ampacity !== null && (
                          <AmpacityNote size={inputs.awg} material={material} ampacity={ampacity} className="mb-3" />
                        )}
                        {exceeds && <p className="text-sm font-medium text-amber-700 mb-3">{DROP_EXCEEDS_SUPPLY_MESSAGE}</p>}

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {!exceeds && (
                            <>
                              <div>
                                <span className="text-neutral-500">Voltage Drop:</span>
                                <p className="font-semibold font-mono">{formatVdVolts(result.vdVolts)}</p>
                              </div>
                              <div>
                                <span className="text-neutral-500">End Voltage:</span>
                                <p className="font-semibold font-mono">{formatFixed(result.loadVolts, 2)} V</p>
                              </div>
                              <div>
                                <span className="text-neutral-500">Power Loss:</span>
                                <p className="font-semibold font-mono">{formatFixed(result.powerLossW, 0)} W</p>
                              </div>
                            </>
                          )}
                          <div>
                            <span className="text-neutral-500">Wire Size:</span>
                            <p className="font-semibold">{formatSize(inputs.awg)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {!results.some((r) => r.material === 'Al') && (
                    <div className="bg-white border border-neutral-200 rounded-lg p-4">
                      <p className="text-sm text-neutral-700">{NO_14_AWG_ALUMINUM_NOTE}</p>
                    </div>
                  )}
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
      </div>
    </CalculatorLayout>
  );
}
