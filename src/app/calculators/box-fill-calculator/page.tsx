import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'Box Fill Calculator — NEC 314.16',
  path: '/calculators/box-fill-calculator',
});

export default function BoxFillCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'Electrical Box Fill Calculator'}
      whatWasWrong={'some of its box volumes and conductor-counting rules did not match the NEC'}
      links={['/guides/awg-wire-size-chart']}
    />
  );
}
