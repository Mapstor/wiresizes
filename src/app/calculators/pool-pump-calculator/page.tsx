import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'Pool Pump Calculator — NEC 680',
  path: '/calculators/pool-pump-calculator',
});

export default function PoolPumpCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'Pool Pump Calculator'}
      whatWasWrong={'its motor currents did not match the NEC motor tables and it cited the wrong pool sections'}
      links={['/guides/nec-table-310-16']}
    />
  );
}
