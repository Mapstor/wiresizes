import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'Range Calculator — NEC 220.55',
  path: '/calculators/range-calculator',
});

export default function RangeCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'Electric Range Calculator'}
      whatWasWrong={'its demand-factor rule did not match NEC Table 220.55, it put a wall oven on a breaker larger than its wire allows, and it said ranges generally don\'t need GFCI protection, which the 2023 NEC requires'}
      links={['/guides/nec-table-310-16', '/guides/awg-wire-size-chart']}
    />
  );
}
