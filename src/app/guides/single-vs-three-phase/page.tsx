import type { Metadata } from 'next';
import GuideClient from './GuideClient';
import { getArticleDates } from '@/lib/article-dates';

export const metadata: Metadata = {
  title: 'Single Phase vs Three Phase',
  description: '120/240 V single-phase vs 208/480 V three-phase: voltage configurations, motor performance and wiring complexity compared.',
  keywords: 'single phase vs three phase, three phase power, 240 V vs 480 V, three-phase wiring, single phase 240 V, three phase 208 V, three phase calculator',
  alternates: { canonical: '/guides/single-vs-three-phase' },
};

export default function SingleVsThreePhasePage() {
  return <GuideClient {...getArticleDates('src/app/guides/single-vs-three-phase/GuideClient.tsx')} />;
}
