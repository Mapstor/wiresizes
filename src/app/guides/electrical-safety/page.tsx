import type { Metadata } from 'next';
import GuideClient from './GuideClient';

export const metadata: Metadata = {
  title: 'Electrical Safety Fundamentals | Arc Flash, PPE & OSHA',
  description: 'Practical electrical safety guide: arc flash boundaries, incident energy, PPE categories, lockout/tagout procedures, and OSHA / NFPA 70E standards for safe electrical work and installations.',
  keywords: 'electrical safety, arc flash safety, NFPA 70E, PPE categories, OSHA electrical, lockout tagout, incident energy, electrical hazards',
  alternates: { canonical: '/guides/electrical-safety' },
};

export default function ElectricalSafetyPage() {
  return <GuideClient />;
}
