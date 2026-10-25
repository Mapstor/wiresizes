import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'Conduit Fill Calculator — NEC Chapter 9',
  path: '/calculators/conduit-fill-calculator',
});

export default function ConduitFillCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'Conduit Fill Calculator'}
      whatWasWrong={'it said equipment grounding conductors are not counted in conduit fill, and several conduit and wire areas were wrong'}
      links={['/guides/awg-wire-size-chart']}
    />
  );
}
