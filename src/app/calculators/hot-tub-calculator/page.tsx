import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'Hot Tub Calculator — NEC Article 680',
  path: '/calculators/hot-tub-calculator',
});

export default function HotTubCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'Hot Tub Calculator'}
      whatWasWrong={'it estimated the circuit from the number of seats instead of the spa\'s rated load, and its voltage-drop examples used wrong resistance values'}
      links={['/guides/nec-table-310-16', '/calculators/voltage-drop-calculator']}
    />
  );
}
