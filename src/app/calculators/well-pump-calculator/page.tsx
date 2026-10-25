import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'Well Pump Calculator — Wire & Breaker',
  path: '/calculators/well-pump-calculator',
});

export default function WellPumpCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'Well Pump Calculator'}
      whatWasWrong={'it used invented current multipliers and motor currents that disagree with the NEC motor tables'}
      links={['/guides/awg-wire-size-chart', '/calculators/voltage-drop-calculator']}
    />
  );
}
