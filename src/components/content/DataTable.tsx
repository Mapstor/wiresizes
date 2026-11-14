// A reference table in a horizontal scroller (WSZ-005a): the table never widens the page at 320 px, the first column
// stays in view while the rest scrolls, and the region is focusable and named by the caption above it, so keyboard
// users can scroll it. src is the table's default citation (data-src on <table>, D-15): cells that come from another source carry
// their own data-src, which the gates read first. Server component, no client JS.
// variant "ruled" is the picked look's table (D-33, WSZ-025): a double rule on top, a darker line every five rows, a
// 2 px close, numbers in Azeret Mono; cells use the R* classes below.
import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface DataTableProps {
  id: string;
  caption: ReactNode;
  src: string;
  children: ReactNode;
  className?: string;
  variant?: 'boxed' | 'ruled';
}

export function DataTable({ id, caption, src, children, className, variant = 'boxed' }: DataTableProps) {
  const ruled = variant === 'ruled';
  // The caption sits above the scroller, so it wraps to the screen instead of scrolling (and clipping) with a wide table.
  // The scroller is relative, so a cell's sr-only text is placed inside it and never widens the page (DEVLOG §4).
  return (
    <div data-src={src} className={clsx('space-y-2', className)}>
      <p id={`${id}-caption`} className={ruled ? 'font-display text-base font-semibold text-ink' : 'text-sm font-semibold text-gray-900'}>
        {caption}
      </p>
      <div
        role="region"
        aria-labelledby={`${id}-caption`}
        tabIndex={0}
        className={clsx(
          'relative max-w-full overflow-x-auto focus:outline-none',
          ruled ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink' : 'rounded-md border border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-600',
        )}
      >
        <table
          id={id}
          data-src={src}
          aria-labelledby={`${id}-caption`}
          className={clsx(
            'w-full border-collapse text-left',
            ruled
              ? '[border-bottom:2px_solid_#111111] [border-top:3px_double_#111111] text-[15px] leading-snug [&>tbody>tr:nth-child(5n)>*]:border-cut-rule-dark'
              : 'text-sm tabular-nums',
          )}
        >
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

/** The ruled variant's cells (D-33): headers in Archivo, figures right-aligned in Azeret Mono, the row label sticky. */
export const RTH =
  'min-w-[7.5em] border-b border-ink bg-white px-3.5 py-2.5 text-right align-bottom font-display text-[13.5px] font-semibold leading-tight text-[#2b2b2b] first:min-w-0 first:text-left';
export const RTD = 'whitespace-nowrap border-b border-cut-rule px-3.5 py-1.5 text-right font-figures text-sm text-ink';
export const RSTICKY_TH = 'sticky left-0 z-20';
export const RSTICKY_TD =
  'sticky left-0 z-10 whitespace-nowrap border-b border-cut-rule bg-white px-3.5 py-1.5 text-left font-figures text-[14.5px] font-semibold text-ink';
