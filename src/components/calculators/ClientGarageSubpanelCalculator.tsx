'use client';

import dynamic from 'next/dynamic';

const GarageSubpanelCalculator = dynamic(
  () => import('./GarageSubpanelCalculator').then(mod => ({ default: mod.GarageSubpanelCalculator })),
  { 
    ssr: false,
    loading: () => <div className="text-center py-8">Loading calculator...</div>
  }
);

export default function ClientGarageSubpanelCalculator() {
  return <GarageSubpanelCalculator />;
}