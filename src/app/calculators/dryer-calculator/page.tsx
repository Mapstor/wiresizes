import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'Dryer Calculator — Wire & Breaker Size',
  path: '/calculators/dryer-calculator',
});

export default function DryerCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'Electric Dryer Calculator'}
      whatWasWrong={'it cited the wrong NEC sections and left out the 2023 GFCI requirement for dryer circuits'}
      links={['/guides/nec-table-310-16']}
    />
  );
}
