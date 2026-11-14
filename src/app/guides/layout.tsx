import type { Metadata } from 'next';
import { GuidesFrame } from '@/components/layout/GuidesFrame';
import { GUIDE_CALCULATORS, GUIDE_GROUPS } from '@/lib/guides-nav';

// The guides' frame (WSZ-005b): the guide navigation from the route list (src/lib/routes.ts, D-26, via
// src/lib/guides-nav.ts), placed by GuidesFrame after each guide's content. Only names and paths reach the client frame.

// A title without a template: the guide pages below keep their titles as written, without the root layout's
// " | WireSizes.com" (the /guides hub, in this segment, still gets it). Every guide sets its own title and description.
export const metadata: Metadata = { title: 'Electrical Guides' };

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuidesFrame guides={GUIDE_GROUPS} calculators={GUIDE_CALCULATORS}>
      {children}
    </GuidesFrame>
  );
}
