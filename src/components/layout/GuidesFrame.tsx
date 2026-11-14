'use client';

// The frame of the guide pages (WSZ-005b): the page first, then a navigation column with every live guide by group
// and a short list of calculators, all from the route list (src/lib/routes.ts, D-26, passed in by
// src/app/guides/layout.tsx). The column sits beside the page from lg up and below it on phones, so a guide's H1 and
// first table are the top of the screen; the page being read is marked aria-current. The /guides hub lists the same
// guides in its body, so there the frame shows the page alone. A guide in the picked look (D-33, WSZ-025) also gets
// the page alone: it opens with a full-width hero and places GuidesNav itself, in the look's type.
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import type { NavGroup, NavLink } from '@/lib/guides-nav';

interface GuidesFrameProps {
  guides: NavGroup[];
  calculators: NavLink[];
  children: ReactNode;
}

const HUB = '/guides';
/** Guides that draw their own frame in the picked look (D-33). */
const LOOK_GUIDES = new Set(['/guides/awg-wire-size-chart']);

const STYLES = {
  classic: {
    link: 'inline-block py-1.5 text-blue-700 underline decoration-blue-300 decoration-1 underline-offset-4 hover:text-blue-900 hover:decoration-blue-700',
    current: 'inline-block py-1.5 font-semibold text-gray-900 no-underline',
    title: 'text-lg font-semibold text-gray-900',
    group: 'text-sm font-semibold text-gray-600',
  },
  look: {
    link: 'inline-block py-1.5 text-ink underline decoration-cut-line decoration-2 underline-offset-[3px] hover:text-cut-deep',
    current: 'inline-block py-1.5 font-bold text-ink no-underline',
    title: 'font-display text-xl font-extrabold tracking-tight text-ink',
    group: 'font-display text-sm font-semibold text-cut-muted',
  },
} as const;

export function GuidesFrame({ guides, calculators, children }: GuidesFrameProps) {
  const pathname = usePathname();
  if (pathname === HUB) return <div className="container py-10 lg:py-14">{children}</div>;
  if (LOOK_GUIDES.has(pathname)) return <>{children}</>;
  return (
    <div className="bg-gray-50">
      <div className="container py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="min-w-0">{children}</div>
          <GuidesNav guides={guides} calculators={calculators} />
        </div>
      </div>
    </div>
  );
}

/** The guides and calculators column; look="look" sets it in the picked look's type (D-33). */
export function GuidesNav({ guides, calculators, look = 'classic' }: { guides: NavGroup[]; calculators: NavLink[]; look?: 'classic' | 'look' }) {
  const pathname = usePathname();
  const s = STYLES[look];
  return (
    <aside
      aria-label="Guides and calculators"
      className={clsx(
        'min-w-0 pt-8 lg:pt-0',
        look === 'look' ? 'border-t-2 border-ink font-display lg:border-t-0' : 'border-t border-gray-300 lg:border-t-0',
      )}
    >
      <div className="space-y-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pb-4">
        <nav aria-labelledby="guides-nav-title">
          <h2 id="guides-nav-title" className={s.title}>
            Guides
          </h2>
          <div className="mt-3 space-y-5">
            {guides.map((group) => (
              <div key={group.id}>
                <h3 id={`${group.id}-nav`} className={s.group}>
                  {group.title}
                </h3>
                <ul aria-labelledby={`${group.id}-nav`} className="mt-1 text-[0.9375rem] leading-snug">
                  {group.links.map((link) => {
                    const current = link.path === pathname;
                    return (
                      <li key={link.path}>
                        <Link href={link.path} data-name="" aria-current={current ? 'page' : undefined} className={current ? s.current : s.link}>
                          {link.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <p className="text-[0.9375rem] leading-snug">
              <Link href={HUB} className={s.link}>
                All guides
              </Link>
            </p>
          </div>
        </nav>
        <nav aria-labelledby="calculators-nav-title">
          <h2 id="calculators-nav-title" className={s.title}>
            Calculators
          </h2>
          <ul className="mt-2 text-[0.9375rem] leading-snug">
            {calculators.map((link) => (
              <li key={link.path}>
                <Link href={link.path} data-name="" className={s.link}>
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/calculators" className={s.link}>
                All calculators
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
