import type { Metadata } from 'next';
import { GuidesFrame } from '@/components/layout/GuidesFrame';
import type { NavGroup, NavLink } from '@/components/layout/GuidesFrame';
import { ROUTES, sectionGroups } from '@/lib/routes';

// The guides' frame (WSZ-005b): the guide navigation from the route list (src/lib/routes.ts, D-26), placed by
// GuidesFrame after each guide's content. Only names and paths reach the client frame.
const GUIDES: NavGroup[] = sectionGroups('guides').map(({ group, routes }) => ({
  id: group.id,
  title: group.title,
  links: routes.map(({ path, name }) => ({ path, name })),
}));

const CALCULATORS: NavLink[] = ROUTES.filter((r) => r.guidesNav).map(({ path, name }) => ({ path, name }));

// A title without a template: the guide pages below keep their titles as written, without the root layout's
// " | WireSizes.com" (the /guides hub, in this segment, still gets it). Every guide sets its own title and description.
export const metadata: Metadata = { title: 'Electrical Guides' };

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuidesFrame guides={GUIDES} calculators={CALCULATORS}>
      {children}
    </GuidesFrame>
  );
}
