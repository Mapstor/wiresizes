'use client';

import { useRef, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { Calculator, RefreshCw } from 'lucide-react';
import { voltageOptions, voltsAfterPhaseChange } from '@/lib/calculations/inputs';
import type { Phase } from '@/lib/calculations/inputs';
import {
  fromRealPower,
  hasPowerInputError,
  isPowerError,
  PHASE_OPTIONS,
  powerInputErrors,
  WATTS_TO_AMPS_DEFAULTS,
} from '@/lib/calculations/power';

interface Inputs {
  /** Field text */
  watts: string;
  volts: number;
  phase: Phase;
  /** Field text */
  pf: string;
}

const DEFAULT_INPUTS: Inputs = {
  watts: String(WATTS_TO_AMPS_DEFAULTS.watts),
  volts: WATTS_TO_AMPS_DEFAULTS.volts,
  phase: WATTS_TO_AMPS_DEFAULTS.phase,
  pf: String(WATTS_TO_AMPS_DEFAULTS.pf),
};

/** Inputs from a share link. */
function inputsFromQuery(params: URLSearchParams): Inputs {
  const phase = choiceParam(params, 'phase', ['single', 'three'] as Phase[]) ?? DEFAULT_INPUTS.phase;
  return {
    watts: numberParam(params, 'watts') ?? DEFAULT_INPUTS.watts,
    phase,
    volts: choiceParam(params, 'voltage', voltageOptions(phase)) ?? voltsAfterPhaseChange(DEFAULT_INPUTS.volts, phase),
    pf: numberParam(params, 'powerFactor') ?? DEFAULT_INPUTS.pf,
  };
}

export function WattsToAmpsCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const fields = useFieldErrors();

  const watts = fieldNumber(inputs.watts);
  const pf = fieldNumber(inputs.pf);
  const errors = powerInputErrors({ value: watts, volts: inputs.volts, circuit: inputs.phase, pf });
  // Single phase: I = P / (V × PF); three phase: I = P / (V × √3 × PF)
  const r = hasPowerInputError(errors) ? null : fromRealPower({ watts, volts: inputs.volts, circuit: inputs.phase, pf });
  const amps = r && !isPowerError(r) ? r.amps : null;

  const query = buildQuery({
    watts: inputs.watts.trim(),
    voltage: inputs.volts,
    phase: inputs.phase,
    powerFactor: inputs.pf.trim(),
  });
  const { markChanged, shareUrl } = useUrlState(query, (params) => setInputs(inputsFromQuery(params)));
  const { print } = usePrintExport();

  const change = (patch: Partial<Inputs>) => {
    markChanged();
    setInputs((p) => ({ ...p, ...patch }));
  };

  const handleCalculate = () => {
    if (amps !== null) focusResults(resultsHeadingRef.current);
    else fields.revealAll(formRef.current);
  };

  const handleReset = () => {
    markChanged();
    fields.reset();
    setInputs(DEFAULT_INPUTS);
  };

  const handlePrint = () => {
    if (amps === null) return;
    print({
      title: 'Watts to Amps Calculation',
      inputs: {
        'Power (Watts)': `${watts} W`,
        Voltage: `${inputs.volts} V`,
        Phase: inputs.phase === 'single' ? 'Single-Phase' : 'Three-Phase',
        'Power Factor': pf,
      },
      results: {
        'Calculated Current': `${amps.toFixed(2)} A`,
      },
    });
  };

  return (
    <CalculatorLayout
      title="Watts to Amps Calculator"
      description="Convert watts to amps"
      shareUrl={shareUrl}
      onPrint={handlePrint}
      actionsDisabled={amps === null}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-6" ref={formRef}>
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Power (Watts)"
            type="number"
            value={inputs.watts}
            onChange={(e) => change({ watts: e.target.value })}
            onBlur={() => fields.touch('watts')}
            error={fields.shown('watts', errors.value)}
            suffix="W"
          />
          <Select
            label="Voltage"
            options={voltageOptions(inputs.phase).map((v) => ({ value: String(v), label: `${v}V` }))}
            value={String(inputs.volts)}
            onChange={(e) => change({ volts: Number(e.target.value) })}
          />
          <Select
            label="Phase"
            options={PHASE_OPTIONS}
            value={inputs.phase}
            onChange={(e) => {
              const phase = e.target.value as Phase;
              change({ phase, volts: voltsAfterPhaseChange(inputs.volts, phase) });
            }}
          />
          <Input
            label="Power Factor"
            type="number"
            value={inputs.pf}
            onChange={(e) => change({ pf: e.target.value })}
            onBlur={() => fields.touch('pf')}
            error={fields.shown('pf', errors.pf)}
            min={0}
            max={1}
            step={0.01}
          />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <Button onClick={handleCalculate} className="flex-1">
              <Calculator className="w-4 h-4" />
              Calculate
            </Button>
            <Button variant="secondary" onClick={handleReset} className="flex-1">
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h2 ref={resultsHeadingRef} tabIndex={-1} className="text-lg font-semibold">Calculation Results</h2>
          {amps !== null && (
            <div className="text-center p-6 bg-primary-50 rounded-xl border-2 border-primary-200">
              <div className="text-sm text-primary-600 font-medium mb-2">Calculated Current</div>
              <div className="text-2xl sm:text-4xl font-bold font-mono text-primary-700 break-words min-w-0">
                {amps.toFixed(2)}
              </div>
              <div className="text-xl font-medium text-primary-600 mt-1">Amps</div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
