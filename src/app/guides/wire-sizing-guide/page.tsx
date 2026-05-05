import type { Metadata } from 'next';
import GuideClient from './GuideClient';
import { getArticleDates } from '@/lib/article-dates';

export const metadata: Metadata = {
  title: 'Complete Wire Sizing Guide | NEC AWG Selection Step-by-Step',
  description: 'Step-by-step wire sizing guide for any electrical circuit: ampacity from NEC Table 310.16, voltage drop, temperature derating, continuous loads, and copper vs aluminum trade-offs. Real residential, commercial, and industrial scenarios.',
  keywords: 'wire sizing guide, AWG selection guide, NEC wire size, wire gauge guide, ampacity table, voltage drop wire size, copper vs aluminum, electrical wire sizing',
  alternates: { canonical: '/guides/wire-sizing-guide' },
};

export default function WireSizingGuidePage() {
  return <GuideClient {...getArticleDates('src/app/guides/wire-sizing-guide/GuideClient.tsx')} />;
}
