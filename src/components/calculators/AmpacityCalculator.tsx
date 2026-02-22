'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CalculatorLayout } from './CalculatorLayout';
import { CalculatorResult } from './CalculatorResult';
import { WireComparison } from '@/components/visualizations/WireComparison';
import { NEC_TABLE_310_16, getAmpacity } from '@/lib/data/nec-310-16';
import { useShareableUrl } from '@/lib/hooks/useShareableUrl';
import { usePrintExport } from '@/lib/hooks/usePrintExport';
import { Info } from 'lucide-react';

const AWG_OPTIONS = [
  { value: '14', label: '#14 AWG' },
  { value: '12', label: '#12 AWG' },
  { value: '10', label: '#10 AWG' },
  { value: '8', label: '#8 AWG' },
  { value: '6', label: '#6 AWG' },
  { value: '4', label: '#4 AWG' },
  { value: '3', label: '#3 AWG' },
  { value: '2', label: '#2 AWG' },
  { value: '1', label: '#1 AWG' },
  { value: '1/0', label: '#1/0 AWG' },
  { value: '2/0', label: '#2/0 AWG' },
  { value: '3/0', label: '#3/0 AWG' },
  { value: '4/0', label: '#4/0 AWG' },
  { value: '250', label: '250 MCM' },
  { value: '300', label: '300 MCM' },
  { value: '350', label: '350 MCM' },
  { value: '400', label: '400 MCM' },
  { value: '500', label: '500 MCM' },
  { value: '600', label: '600 MCM' },
  { value: '750', label: '750 MCM' },
];

const TEMPERATURE_OPTIONS = [
  { value: '60', label: '60°C (140°F)' },
  { value: '75', label: '75°C (167°F)' },
  { value: '90', label: '90°C (194°F)' },
];

const AMBIENT_TEMP_OPTIONS = [
  { value: '26-30', label: '78-86°F (Standard)', factor: 1.0 },
  { value: '31-35', label: '87-95°F', factor: 0.94 },
  { value: '36-40', label: '96-104°F', factor: 0.88 },
  { value: '41-45', label: '105-113°F', factor: 0.82 },
  { value: '46-50', label: '114-122°F', factor: 0.75 },
  { value: '51-55', label: '123-131°F', factor: 0.67 },
  { value: '56-60', label: '132-140°F', factor: 0.58 },
];

const CONDUIT_FILL_OPTIONS = [
  { value: '1-3', label: '1-3 Conductors', factor: 1.0 },
  { value: '4-6', label: '4-6 Conductors', factor: 0.8 },
  { value: '7-9', label: '7-9 Conductors', factor: 0.7 },
  { value: '10-20', label: '10-20 Conductors', factor: 0.5 },
  { value: '21-30', label: '21-30 Conductors', factor: 0.45 },
  { value: '31-40', label: '31-40 Conductors', factor: 0.40 },
  { value: '41+', label: '41+ Conductors', factor: 0.35 },
];

interface AmpacityResult {
  baseAmpacity: number;
  derated: number;
  tempCorrection: number;
  fillCorrection: number;
  totalDerating: number;
}

export function AmpacityCalculator() {
  const [awg, setAwg] = useState('12');
  const [temperature, setTemperature] = useState('75');
  const [ambientTemp, setAmbientTemp] = useState('26-30');
  const [conduitFill, setConduitFill] = useState('1-3');
  const [copperResult, setCopperResult] = useState<AmpacityResult | null>(null);
  const [aluminumResult, setAluminumResult] = useState<AmpacityResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculateAmpacity = useCallback((material: 'copper' | 'aluminum') => {
    const baseAmpacity = getAmpacity(awg, material, Number(temperature) as 60 | 75 | 90);
    if (!baseAmpacity) return null;

    const ambientFactor = AMBIENT_TEMP_OPTIONS.find(opt => opt.value === ambientTemp)?.factor || 1;
    const fillFactor = CONDUIT_FILL_OPTIONS.find(opt => opt.value === conduitFill)?.factor || 1;

    const tempCorrected = Math.floor(baseAmpacity * ambientFactor);
    const fillCorrected = Math.floor(baseAmpacity * fillFactor);
    const derated = Math.floor(baseAmpacity * ambientFactor * fillFactor);

    return {
      baseAmpacity,
      derated,
      tempCorrection: tempCorrected,
      fillCorrection: fillCorrected,
      totalDerating: Math.round((1 - ambientFactor * fillFactor) * 100),
    };
  }, [awg, temperature, ambientTemp, conduitFill]);

  useEffect(() => {
    setCopperResult(calculateAmpacity('copper'));
    setAluminumResult(calculateAmpacity('aluminum'));
  }, [calculateAmpacity]);

  const shareableInputs = {
    awg,
    temperature,
    ambientTemp,
    conduitFill,
  };
  const { getShareableUrl } = useShareableUrl(shareableInputs);
  const { print } = usePrintExport();

  const performCalculation = useCallback(() => {
    setCopperResult(calculateAmpacity('copper'));
    setAluminumResult(calculateAmpacity('aluminum'));
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [calculateAmpacity]);

  const handleReset = useCallback(() => {
    setAwg('12');
    setTemperature('75');
    setAmbientTemp('30');
    setConduitFill('3');
    setCopperResult(null);
    setAluminumResult(null);
    setShowResults(false);
  }, []);

  const handleShare = useCallback(async () => {
    const url = getShareableUrl();
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, [getShareableUrl]);

  const handlePrint = useCallback(() => {
    if (!copperResult || !aluminumResult) return;
    print({
      title: 'Wire Ampacity Calculation',
      inputs: {
        'Wire Size': `#${awg} AWG`,
        'Temperature Rating': `${temperature}°C`,
        'Ambient Temperature': AMBIENT_TEMP_OPTIONS.find(opt => opt.value === ambientTemp)?.label || '',
        'Conduit Fill': CONDUIT_FILL_OPTIONS.find(opt => opt.value === conduitFill)?.label || '',
      },
      results: {
        'Copper Base Ampacity': `${copperResult.baseAmpacity}A`,
        'Copper Derated': `${copperResult.derated}A`,
        'Aluminum Base Ampacity': `${aluminumResult.baseAmpacity}A`,
        'Aluminum Derated': `${aluminumResult.derated}A`,
      },
    });
  }, [copperResult, aluminumResult, awg, temperature, ambientTemp, conduitFill, print]);

  return (
    <CalculatorLayout
      title="Wire Ampacity Calculator"
      description="Calculate the current carrying capacity for copper and aluminum conductors"
      onShare={handleShare}
      onPrint={handlePrint}
    >
      <div className="grid lg:grid-cols-2 gap-6 p-6">
        {/* Inputs Column */}
        <div className="space-y-6">
          {/* Wire Size Select */}
          <Select
            label="Wire Size"
            options={AWG_OPTIONS}
            value={awg}
            onChange={(e) => setAwg(e.target.value)}
          />

          {/* Temperature Rating */}
          <Select
            label="Temperature Rating"
            options={TEMPERATURE_OPTIONS}
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />

          {/* Ambient Temperature */}
          <Select
            label="Ambient Temperature"
            options={AMBIENT_TEMP_OPTIONS.map(opt => ({
              value: opt.value,
              label: opt.label,
            }))}
            value={ambientTemp}
            onChange={(e) => setAmbientTemp(e.target.value)}
          />

          {/* Conduit Fill */}
          <Select
            label="Number of Current-Carrying Conductors"
            options={CONDUIT_FILL_OPTIONS.map(opt => ({
              value: opt.value,
              label: opt.label,
            }))}
            value={conduitFill}
            onChange={(e) => setConduitFill(e.target.value)}
          />

          {/* Calculate Button */}
          <Button onClick={performCalculation} className="w-full mb-4">
            <Calculator className="w-4 h-4" />
            Calculate Ampacity
          </Button>

          {/* Reset Button */}
          <Button variant="secondary" onClick={handleReset} className="w-full">
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <strong>NEC 310.15(B):</strong> Ampacities must be adjusted for ambient temperature 
                and number of conductors in a raceway. The derated ampacity accounts for both corrections.
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="space-y-6" ref={resultsRef}>
          {/* Wire Comparison Visualization */}
          {showResults && copperResult && aluminumResult && (
            <WireComparison
              copperAwg={awg}
              aluminumAwg={awg}
              amps={Math.max(copperResult.derated, aluminumResult.derated)}
            />
          )}

          {/* Copper Results */}
          {showResults && copperResult && (
            <div className="bg-copper-50 border border-copper-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-copper-700 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-copper-400 to-copper-600"></div>
                Copper Conductor
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-copper-600">Base Ampacity:</span>
                  <p className="font-mono font-semibold text-lg">{copperResult.baseAmpacity}A</p>
                </div>
                <div>
                  <span className="text-copper-600">Derated Ampacity:</span>
                  <p className="font-mono font-semibold text-lg text-copper-700">
                    {copperResult.derated}A
                  </p>
                </div>
                <div>
                  <span className="text-copper-600">Temp Corrected:</span>
                  <p className="font-mono">{copperResult.tempCorrection}A</p>
                </div>
                <div>
                  <span className="text-copper-600">Fill Corrected:</span>
                  <p className="font-mono">{copperResult.fillCorrection}A</p>
                </div>
              </div>
              {copperResult.totalDerating > 0 && (
                <div className="mt-3 pt-3 border-t border-copper-200">
                  <span className="text-xs text-copper-600">
                    Total Derating: {copperResult.totalDerating}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Aluminum Results */}
          {showResults && aluminumResult && (
            <div className="bg-aluminum-50 border border-aluminum-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-aluminum-700 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-aluminum-300 to-aluminum-500"></div>
                Aluminum Conductor
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-aluminum-600">Base Ampacity:</span>
                  <p className="font-mono font-semibold text-lg">{aluminumResult.baseAmpacity}A</p>
                </div>
                <div>
                  <span className="text-aluminum-600">Derated Ampacity:</span>
                  <p className="font-mono font-semibold text-lg text-aluminum-700">
                    {aluminumResult.derated}A
                  </p>
                </div>
                <div>
                  <span className="text-aluminum-600">Temp Corrected:</span>
                  <p className="font-mono">{aluminumResult.tempCorrection}A</p>
                </div>
                <div>
                  <span className="text-aluminum-600">Fill Corrected:</span>
                  <p className="font-mono">{aluminumResult.fillCorrection}A</p>
                </div>
              </div>
              {aluminumResult.totalDerating > 0 && (
                <div className="mt-3 pt-3 border-t border-aluminum-200">
                  <span className="text-xs text-aluminum-600">
                    Total Derating: {aluminumResult.totalDerating}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* NEC Reference */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <p className="text-xs text-neutral-600">
              <strong>NEC References:</strong> Table 310.16, 310.15(B)(1) Ambient Temperature Correction,
              310.15(B)(2) Adjustment for More Than Three Conductors
            </p>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}