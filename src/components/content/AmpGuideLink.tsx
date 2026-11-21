import Link from 'next/link';
import type { ReactNode } from 'react';
import { ampGuideHref } from '@/lib/amp-guide-links';

/** A rating's words linked to its wire size guide where one is live; plain text otherwise. */
export function AmpGuideLink({ a, className, children }: { a: number; className: string; children: ReactNode }) {
  const href = ampGuideHref(a);
  if (!href) return <>{children}</>;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
