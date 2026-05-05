import type { Metadata } from 'next';
import GuideClient from './GuideClient';

export const metadata: Metadata = {
  title: 'Power Factor Explained: Real, Reactive & Apparent Power',
  description: 'Plain-English guide to power factor, reactive power, and apparent power. Understand kVA vs kW, why low PF inflates utility bills, and how capacitor banks correct lagging loads.',
  keywords: 'power factor, reactive power, apparent power, kVA vs kW, power factor correction, capacitor bank, lagging power factor, leading power factor',
  alternates: { canonical: '/guides/power-factor-explained' },
};

export default function PowerFactorExplainedPage() {
  return <GuideClient />;
}
