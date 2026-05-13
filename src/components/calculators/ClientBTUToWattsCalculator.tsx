'use client';

import dynamic from 'next/dynamic';

const BTUToWattsCalculator = dynamic(
  () => import('./BTUToWattsCalculator').then(mod => ({ default: mod.BTUToWattsCalculator })),
  {
    ssr: false,
    loading: () => <div className="text-center py-8">Loading calculator...</div>
  }
);

export default function ClientBTUToWattsCalculator() {
  return <BTUToWattsCalculator />;
}
