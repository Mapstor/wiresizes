import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'Motor Circuit — NEC Article 430',
  path: '/calculators/motor-circuit',
});

export default function MotorCircuitPage() {
  return (
    <WithdrawnTool
      heading={'Motor Circuit Calculator'}
      whatWasWrong={'it rounded feeder protection up and stated overload settings incorrectly'}
      links={['/guides/nec-table-310-16']}
    />
  );
}
