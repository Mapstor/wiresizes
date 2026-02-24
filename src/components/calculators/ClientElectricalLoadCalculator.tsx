'use client';

import dynamic from 'next/dynamic';

const ElectricalLoadCalculator = dynamic(
  () => import('./ElectricalLoadCalculator').then(mod => ({ default: mod.ElectricalLoadCalculator })),
  { 
    ssr: false,
    loading: () => <div className="text-center py-8">Loading calculator...</div>
  }
);

export default function ClientElectricalLoadCalculator() {
  return <ElectricalLoadCalculator />;
}