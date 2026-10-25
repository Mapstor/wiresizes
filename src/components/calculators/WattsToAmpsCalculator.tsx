'use client';

import { useState, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Calculator, RefreshCw } from 'lucide-react';
import { voltageOptions, voltsAfterPhaseChange } from '@/lib/calculations/inputs';
import type { Phase } from '@/lib/calculations/inputs';
import {
  fromRealPower,
  isPowerError,
  PHASE_OPTIONS,
  POWER_ERROR_MESSAGES,
  WATTS_TO_AMPS_DEFAULTS,
} from '@/lib/calculations/power';

type Inputs = typeof WATTS_TO_AMPS_DEFAULTS;

export function WattsToAmpsCalculator() {
  const [inputs, setInputs] = useState<Inputs>(WATTS_TO_AMPS_DEFAULTS);
  const [calculated, setCalculated] = useState<{ inputs: Inputs; amps: number | null; error: string | null } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const performCalculation = useCallback(() => {
    // Single phase: I = P / (V × PF); three phase: I = P / (V × √3 × PF)
    const r = fromRealPower({ watts: inputs.watts, volts: inputs.volts, circuit: inputs.phase, pf: inputs.pf });
    setCalculated(
      isPowerError(r)
        ? { inputs, amps: null, error: POWER_ERROR_MESSAGES[r.error] }
        : { inputs, amps: r.amps, error: null },
    );

    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, [inputs]);

  const handleReset = () => {
    setInputs(WATTS_TO_AMPS_DEFAULTS);
    setCalculated(null);
  };

  const shareableInputs = {
    watts: inputs.watts,
    voltage: inputs.volts,
    phase: inputs.phase,
    powerFactor: inputs.pf,
  };
  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!calculated || calculated.amps === null) return;
    const shown = calculated.inputs;
    print({
      title: 'Watts to Amps Calculation',
      inputs: {
        'Power (Watts)': `${shown.watts} W`,
        Voltage: `${shown.volts} V`,
        Phase: shown.phase === 'single' ? 'Single-Phase' : 'Three-Phase',
        'Power Factor': shown.pf,
      },
      results: {
        'Calculated Current': `${calculated.amps.toFixed(2)} A`,
      },
    });
  }, [calculated, print]);

  return (
    <CalculatorLayout
      title="Watts to Amps Calculator"
      description="Convert watts to amps"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Inputs Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Power (Watts)"
            type="number"
            value={inputs.watts}
            onChange={(e) => setInputs((p) => ({ ...p, watts: Number(e.target.value) }))}
            suffix="W"
          />
          <Select
            label="Voltage"
            options={voltageOptions(inputs.phase).map((v) => ({ value: String(v), label: `${v}V` }))}
            value={String(inputs.volts)}
            onChange={(e) => setInputs((p) => ({ ...p, volts: Number(e.target.value) }))}
          />
          <Select
            label="Phase"
            options={PHASE_OPTIONS}
            value={inputs.phase}
            onChange={(e) => {
              const phase = e.target.value as Phase;
              setInputs((p) => ({ ...p, phase, volts: voltsAfterPhaseChange(p.volts, phase) }));
            }}
          />
          <Input
            label="Power Factor"
            type="number"
            value={inputs.pf}
            onChange={(e) => setInputs((p) => ({ ...p, pf: Number(e.target.value) }))}
            min={0}
            max={1}
            step={0.01}
          />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <Button onClick={performCalculation} className="flex-1">
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
        {calculated && (
          <div className="space-y-6" ref={resultsRef}>
            <h2 className="text-lg font-semibold">Calculation Results</h2>
            {calculated.amps === null ? (
              <div className="rounded-xl p-6 bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
                {calculated.error}
              </div>
            ) : (
              <div className="text-center p-6 bg-primary-50 rounded-xl border-2 border-primary-200">
                <div className="text-sm text-primary-600 font-medium mb-2">Calculated Current</div>
                <div className="text-2xl sm:text-4xl font-bold font-mono text-primary-700 break-words min-w-0">
                  {calculated.amps.toFixed(2)}
                </div>
                <div className="text-xl font-medium text-primary-600 mt-1">Amps</div>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
