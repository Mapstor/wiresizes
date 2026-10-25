import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'Residential Load — NEC 220.82 / 220.83',
  path: '/calculators/residential-load-calculator',
});

export default function ResidentialLoadCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'Residential Load Calculator'}
      whatWasWrong={'it mixed the NEC\'s standard and optional dwelling methods and put air conditioning in the wrong load group'}
      links={['/guides/nec-table-310-16']}
    />
  );
}
