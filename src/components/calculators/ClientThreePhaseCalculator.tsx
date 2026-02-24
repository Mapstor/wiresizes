'use client';

import dynamic from 'next/dynamic';

const ThreePhaseCalculator = dynamic(
  () => import('./ThreePhaseCalculator').then(mod => ({ default: mod.ThreePhaseCalculator })),
  { 
    ssr: false,
    loading: () => <div className="text-center py-8">Loading calculator...</div>
  }
);

export default function ClientThreePhaseCalculator() {
  return <ThreePhaseCalculator />;
}