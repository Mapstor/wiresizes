import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'RV Hookup Calculator — 30A / 50A',
  path: '/calculators/rv-hookup-calculator',
});

export default function RvHookupCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'RV Hookup Calculator'}
      whatWasWrong={'it overstated where GFCI protection is required and misapplied the RV-park demand factors'}
      links={['/guides/nec-table-310-16', '/guides/awg-wire-size-chart']}
    />
  );
}
