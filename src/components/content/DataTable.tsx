// A reference table in a horizontal scroller (WSZ-005a): the table never widens the page at 320 px, the first column
// stays in view while the rest scrolls, and the region is focusable and named by the caption above it, so keyboard
// users can scroll it. src is the table's default citation (data-src on <table>, D-15): cells that come from another source carry
// their own data-src, which the gates read first. Server component, no client JS.
import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface DataTableProps {
  id: string;
  caption: ReactNode;
  src: string;
  children: ReactNode;
  className?: string;
}

export function DataTable({ id, caption, src, children, className }: DataTableProps) {
  // The caption sits above the scroller, so it wraps to the screen instead of scrolling (and clipping) with a wide table
  return (
    <div data-src={src} className={clsx('space-y-2', className)}>
      <p id={`${id}-caption`} className="text-sm font-semibold text-gray-900">
        {caption}
      </p>
      <div
        role="region"
        aria-labelledby={`${id}-caption`}
        tabIndex={0}
        className="max-w-full overflow-x-auto rounded-md border border-gray-300 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <table id={id} data-src={src} aria-labelledby={`${id}-caption`} className="w-full border-collapse text-left text-sm tabular-nums">
          {children}
        </table>
      </div>
    </div>
  );
}

/** Header cell classes; STICKY on the first cell of each row keeps the row label in view while the table scrolls. */
export const TH = 'border-b border-gray-300 bg-gray-100 px-3 py-2 align-bottom font-semibold text-gray-900';
export const TD = 'border-b border-gray-200 px-3 py-1.5 text-gray-800';
export const STICKY = 'sticky left-0 z-10 border-r border-gray-200';
/** STICKY with the background of its row (a sticky cell needs one, or scrolled cells show through). */
export const STICKY_TH = clsx(STICKY, 'bg-gray-100');
export const STICKY_TD = clsx(STICKY, 'bg-white font-semibold text-gray-900');
