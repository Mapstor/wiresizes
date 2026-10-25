import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'Circuit Breaker Calculator — NEC 240',
  path: '/calculators/circuit-breaker-calculator',
});

export default function CircuitBreakerCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'Circuit Breaker Calculator'}
      whatWasWrong={'its default example contradicted itself and one of its NEC table rows does not exist'}
      links={['/guides/nec-table-310-16']}
    />
  );
}
