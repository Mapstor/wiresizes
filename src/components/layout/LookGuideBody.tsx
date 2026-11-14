// The body of a guide in the look (D-33): the content column beside the guides navigation (right column from lg,
// after the content on phones), inside <main> so check-structure 12 sees every guide link. GuidesFrame leaves these
// guides unframed (LOOK_GUIDES); the page renders its own title above this.
import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { GuidesNav } from '@/components/layout/GuidesFrame';
import { GUIDE_CALCULATORS, GUIDE_GROUPS } from '@/lib/guides-nav';

export function LookGuideBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]', className)}>
      <div className="min-w-0 space-y-14">{children}</div>
      <GuidesNav guides={GUIDE_GROUPS} calculators={GUIDE_CALCULATORS} look="look" />
    </div>
  );
}
