'use client';

import { WireVisualization } from './WireVisualization';

interface WireComparisonProps {
  copperAwg: string;
  aluminumAwg: string;
  amps: number;
}

export function WireComparison({ copperAwg, aluminumAwg, amps }: WireComparisonProps) {
  return (
    <div className="bg-neutral-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-neutral-900 text-center mb-6">
        Wire Size Comparison for {amps}A
      </h3>
      
      <div className="flex justify-center items-end gap-8 md:gap-16">
        {/* Copper */}
        <div className="flex flex-col items-center">
          <WireVisualization 
            awg={copperAwg} 
            material="copper" 
            size="lg"
          />
          <div className="mt-4 px-4 py-2 bg-copper-100 rounded-lg">
            <span className="text-copper-700 font-medium">Copper</span>
          </div>
        </div>

        {/* VS */}
        <div className="text-2xl font-bold text-neutral-300 self-center mb-16">
          vs
        </div>

        {/* Aluminum */}
        <div className="flex flex-col items-center">
          <WireVisualization 
            awg={aluminumAwg} 
            material="aluminum" 
            size="lg"
          />
          <div className="mt-4 px-4 py-2 bg-aluminum-100 rounded-lg">
            <span className="text-aluminum-700 font-medium">Aluminum</span>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-neutral-500 mt-6">
        Aluminum wire must be larger than copper for the same ampacity
      </p>
    </div>
  );
}