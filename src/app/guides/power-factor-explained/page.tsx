import type { Metadata } from 'next';
import GuideClient from './GuideClient';
import { articleDates } from '@/lib/page-dates';
import { Byline } from '@/components/content/Byline';

export const metadata: Metadata = {
  title: 'Power Factor Explained — kVA, kW, PF',
  description: 'Power factor, reactive power, apparent power. kVA vs kW, capacitor-bank correction for inductive loads.',
  keywords: 'power factor, reactive power, apparent power, kVA vs kW, power factor correction, capacitor bank, lagging power factor, leading power factor',
  alternates: { canonical: '/guides/power-factor-explained' },
};

export default function PowerFactorExplainedPage() {
  return (
    <GuideClient
      {...articleDates('/guides/power-factor-explained')}
      byline={<Byline route="/guides/power-factor-explained" className="mb-4 text-sm text-gray-600" />}
    />
  );
}
