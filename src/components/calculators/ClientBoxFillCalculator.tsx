'use client';

import dynamic from 'next/dynamic';

const BoxFillCalculator = dynamic(
  () => import('./BoxFillCalculator').then(mod => ({ default: mod.BoxFillCalculator })),
  {
    ssr: false,
    loading: () => <div className="text-center py-8">Loading calculator...</div>
  }
);

export default function ClientBoxFillCalculator() {
  return <BoxFillCalculator />;
}
