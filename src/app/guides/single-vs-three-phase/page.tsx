import type { Metadata } from 'next';
import GuideClient from './GuideClient';
import { getArticleDates } from '@/lib/article-dates';

export const metadata: Metadata = {
  title: 'Single Phase vs Three Phase: Voltage, Wiring & Cost Compared',
  description: 'Compare single-phase and three-phase electrical systems: voltage configurations (120/240V vs 208/480V), power formulas, motor performance, wiring complexity, and total cost. Choose the right system for residential, commercial, or industrial loads.',
  keywords: 'single phase vs three phase, three phase power, 240V vs 480V, three-phase wiring, single phase 240V, three phase 208V, three phase calculator',
  alternates: { canonical: '/guides/single-vs-three-phase' },
};

export default function SingleVsThreePhasePage() {
  return <GuideClient {...getArticleDates('src/app/guides/single-vs-three-phase/GuideClient.tsx')} />;
}
