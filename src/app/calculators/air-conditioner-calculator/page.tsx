import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'AC Wire Size Calculator — NEC 440',
  path: '/calculators/air-conditioner-calculator',
});

export default function AirConditionerCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'Air Conditioner Calculator'}
      whatWasWrong={'it estimated amps from tonnage instead of using the unit\'s nameplate minimum circuit ampacity and maximum overcurrent protection'}
      links={['/guides/nec-table-310-16']}
    />
  );
}
