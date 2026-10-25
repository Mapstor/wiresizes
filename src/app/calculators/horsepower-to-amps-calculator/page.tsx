import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'HP to Amps Calculator — NEC 430.248',
  path: '/calculators/horsepower-to-amps-calculator',
});

export default function HorsepowerToAmpsCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'Horsepower to Amps Calculator'}
      whatWasWrong={'it listed 115 V motor currents under a 230 V heading and mislabeled the NEC motor tables'}
      links={['/calculators/kilowatts-to-amps-calculator']}
    />
  );
}
