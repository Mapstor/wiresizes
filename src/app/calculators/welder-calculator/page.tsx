import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'Welder Calculator — NEC Article 630',
  path: '/calculators/welder-calculator',
});

export default function WelderCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'Professional Welder Calculator'}
      whatWasWrong={'it sized the circuit from estimated arc power instead of the welder\'s rated input current and duty cycle'}
      links={['/guides/nec-table-310-16', '/guides/awg-wire-size-chart']}
    />
  );
}
