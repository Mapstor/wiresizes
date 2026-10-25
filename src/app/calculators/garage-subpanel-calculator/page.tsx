import type { Metadata } from 'next';
import { WithdrawnTool, withdrawnMetadata } from '@/components/content/WithdrawnTool';

export const metadata: Metadata = withdrawnMetadata({
  title: 'Garage Subpanel — NEC 250.32',
  path: '/calculators/garage-subpanel-calculator',
});

export default function GarageSubpanelCalculatorPage() {
  return (
    <WithdrawnTool
      heading={'Garage Subpanel Calculator'}
      whatWasWrong={'it estimated the garage\'s load with invented demand factors credited to NEC sections that say something else, could recommend a panel smaller than the load it had just calculated, and showed the copper ground wire size on its aluminum results'}
      links={['/guides/wire-size-for-100-amp', '/calculators/ground-wire-calculator']}
    />
  );
}
