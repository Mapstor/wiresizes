// The guides navigation's links (WSZ-005b, D-26), from the route list: every live guide by group and the calculators
// marked guidesNav. src/app/guides/layout.tsx passes them to GuidesFrame; a page that draws its own frame in the picked
// look (D-33, WSZ-025) passes them to GuidesNav. Only names and paths reach the client.
import { ROUTES, sectionGroups } from '@/lib/routes';

export interface NavLink {
  path: string;
  name: string;
}

export interface NavGroup {
  id: string;
  title: string;
  links: NavLink[];
}

export const GUIDE_GROUPS: NavGroup[] = sectionGroups('guides').map(({ group, routes }) => ({
  id: group.id,
  title: group.title,
  links: routes.map(({ path, name }) => ({ path, name })),
}));

export const GUIDE_CALCULATORS: NavLink[] = ROUTES.filter((r) => r.guidesNav).map(({ path, name }) => ({ path, name }));
