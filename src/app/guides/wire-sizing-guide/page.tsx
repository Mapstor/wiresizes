import type { Metadata } from 'next';
import GuideClient from './GuideClient';
import { getArticleDates } from '@/lib/article-dates';
import { HowToSchema } from '@/components/seo/HowToSchema';

export const metadata: Metadata = {
  title: 'Wire Sizing Guide — NEC AWG Selection',
  description: 'Step-by-step wire sizing for any circuit: NEC 310.16 ampacity, voltage drop, temperature derating, continuous loads, copper vs aluminum.',
  keywords: 'wire sizing guide, AWG selection guide, NEC wire size, wire gauge guide, ampacity table, voltage drop wire size, copper vs aluminum, electrical wire sizing',
  alternates: { canonical: '/guides/wire-sizing-guide' },
};

const WIRE_SIZING_STEPS = [
  {
    name: 'Determine the load current in amps',
    text: 'Sum the connected load. For continuous loads (operating 3+ hours, e.g., EV chargers, water heaters, commercial lighting), use the actual current. For motors, use the NEC Table 430.247–430.250 full-load current, not the nameplate value (NEC 430.6).',
  },
  {
    name: 'Apply the 125% factor for continuous loads',
    text: 'Per NEC 210.19(A) (branch) and 215.2(A) (feeder), conductors supplying continuous loads must be sized at 125% of the load. A 40 A continuous load needs conductor ampacity of 50 A minimum.',
  },
  {
    name: 'Look up base ampacity in NEC Table 310.16',
    text: 'Select the column matching your termination temperature rating (75°C is standard for residential and most commercial). Pick the smallest conductor whose ampacity meets or exceeds the value from step 2. For copper at 75°C: 14 AWG = 20 A, 12 AWG = 25 A, 10 AWG = 35 A, 8 AWG = 50 A, 6 AWG = 65 A, 4 AWG = 85 A.',
  },
  {
    name: 'Apply ambient-temperature correction (NEC 310.15(B)(1))',
    text: 'If the conductor will operate above 30°C ambient (attics, conduit in sun, equipment rooms), multiply ampacity by the table factor. Example: 25 A 75°C conductor in a 41–45°C attic = 25 × 0.82 = 20.5 A adjusted ampacity.',
  },
  {
    name: 'Apply conductor-bundling adjustment (NEC 310.15(C)(1))',
    text: 'If more than 3 current-carrying conductors share a raceway or cable, multiply ampacity by: 0.80 (4–6 conductors), 0.70 (7–9), 0.50 (10–20). Neutrals on balanced 3-phase circuits and grounds are not counted as current-carrying.',
  },
  {
    name: 'Calculate voltage drop and upsize if necessary',
    text: 'For runs over 50 feet, calculate voltage drop using VD = (2 × L × I × R) ÷ 1000 (single-phase) or (1.732 × L × I × R) ÷ 1000 (three-phase). NEC informational notes recommend 3% maximum on branch circuits and 5% combined feeder + branch. Upsize one or two AWG steps if exceeded.',
  },
  {
    name: 'Verify NEC 240.4(D) small-conductor rule and finalize',
    text: 'Even if Table 310.16 ampacity is higher, NEC 240.4(D) caps overcurrent protection at 15 A for 14 AWG, 20 A for 12 AWG, and 30 A for 10 AWG (with limited exceptions for motors, taps, and specific applications). Confirm the conductor meets ampacity AND OCPD limits, then size the breaker.',
  },
];

export default function WireSizingGuidePage() {
  return (
    <>
      <HowToSchema
        path="/guides/wire-sizing-guide"
        name="How to Size a Wire for Any Electrical Circuit"
        description="Seven-step NEC-compliant procedure for selecting conductor size: load determination, continuous-load factor, ampacity lookup, temperature correction, bundling adjustment, voltage-drop check, and final verification."
        totalTime="PT15M"
        steps={WIRE_SIZING_STEPS}
      />
      <GuideClient {...getArticleDates('src/app/guides/wire-sizing-guide/GuideClient.tsx')} />
    </>
  );
}
