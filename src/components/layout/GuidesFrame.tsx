'use client';

// The frame of the guide pages (WSZ-005b): the page first, then a navigation column with every live guide by group
// and a short list of calculators, all from the route list (src/lib/routes.ts, D-26, passed in by
// src/app/guides/layout.tsx). The column sits beside the page from lg up and below it on phones, so a guide's H1 and
// first table are the top of the screen; the page being read is marked aria-current. The /guides hub lists the same
// guides in its body, so there the frame shows the page alone.
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export interface NavLink {
  path: string;
  name: string;
}

export interface NavGroup {
  id: string;
  title: string;
  links: NavLink[];
}

interface GuidesFrameProps {
  guides: NavGroup[];
  calculators: NavLink[];
  children: ReactNode;
}

const HUB = '/guides';
const LINK =
  'inline-block py-1.5 text-blue-700 underline decoration-blue-300 decoration-1 underline-offset-4 hover:text-blue-900 hover:decoration-blue-700';
const CURRENT = 'inline-block py-1.5 font-semibold text-gray-900 no-underline';

export function GuidesFrame({ guides, calculators, children }: GuidesFrameProps) {
  const pathname = usePathname();
  if (pathname === HUB) return <div className="container py-10 lg:py-14">{children}</div>;
  return (
    <div className="bg-gray-50">
      <div className="container py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="min-w-0">{children}</div>
          <aside aria-label="Guides and calculators" className="min-w-0 border-t border-gray-300 pt-8 lg:border-t-0 lg:pt-0">
            <div className="space-y-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pb-4">
              <nav aria-labelledby="guides-nav-title">
                <h2 id="guides-nav-title" className="text-lg font-semibold text-gray-900">
                  Guides
                </h2>
                <div className="mt-3 space-y-5">
                  {guides.map((group) => (
                    <div key={group.id}>
                      <h3 id={`${group.id}-nav`} className="text-sm font-semibold text-gray-600">
                        {group.title}
                      </h3>
                      <ul aria-labelledby={`${group.id}-nav`} className="mt-1 text-[0.9375rem] leading-snug">
                        {group.links.map((link) => {
                          const current = link.path === pathname;
                          return (
                            <li key={link.path}>
                              <Link
                                href={link.path}
                                data-name=""
                                aria-current={current ? 'page' : undefined}
                                className={clsx(current ? CURRENT : LINK)}
                              >
                                {link.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                  <p className="text-[0.9375rem] leading-snug">
                    <Link href={HUB} className={LINK}>
                      All guides
                    </Link>
                  </p>
                </div>
              </nav>
              <nav aria-labelledby="calculators-nav-title">
                <h2 id="calculators-nav-title" className="text-lg font-semibold text-gray-900">
                  Calculators
                </h2>
                <ul className="mt-2 text-[0.9375rem] leading-snug">
                  {calculators.map((link) => (
                    <li key={link.path}>
                      <Link href={link.path} data-name="" className={LINK}>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/calculators" className={LINK}>
                      All calculators
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
