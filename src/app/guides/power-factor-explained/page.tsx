import type { Metadata } from 'next';
import GuideClient from './GuideClient';
import { getArticleDates } from '@/lib/article-dates';

export const metadata: Metadata = {
  title: 'Power Factor Explained — kVA, kW, PF',
  description: 'Power factor, reactive power, apparent power. kVA vs kW, why low PF inflates utility bills, capacitor-bank correction for inductive loads.',
  keywords: 'power factor, reactive power, apparent power, kVA vs kW, power factor correction, capacitor bank, lagging power factor, leading power factor',
  alternates: { canonical: '/guides/power-factor-explained' },
};

export default function PowerFactorExplainedPage() {
  return <GuideClient {...getArticleDates('src/app/guides/power-factor-explained/GuideClient.tsx')} />;
}
