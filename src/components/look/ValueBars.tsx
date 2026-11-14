// A result chart for values that are not wire sizes (WSZ-006d, the three-phase calculator; DESIGN.md "Result chart"):
// one labelled bar per value on a shared scale, each value in its own right-aligned column. One series, so the bars are
// Edition Mid gray (DESIGN.md "Neutral bars"; copper stays for metals), the row the result is about in bold. HTML, not
// SVG, so the text stays 15 px at every width; the bars grow once when the chart is drawn (viz-grow-once, off under
// reduced motion). The list reads as text: label and value per row.
import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import type { UnitSymbol, ValueFormat } from '@/lib/calculations/format';
import { Val } from '@/components/content/Val';

const BAR = '#57514c';

export interface ValueBarRow {
  key: string;
  label: ReactNode;
  value: number;
  unit: UnitSymbol;
  format?: ValueFormat;
  /** The value's data-src: a registry domain, calc:<engine> or input. */
  src: string;
  strong?: boolean;
}

export function ValueBars({ rows, label }: { rows: ValueBarRow[]; label: string }) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <ol aria-label={label} className="space-y-2.5">
      {rows.map((row) => {
        const pct = max > 0 ? (row.value / max) * 100 : 0;
        return (
          <li
            key={row.key}
            className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_6.75rem] items-center gap-x-3 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_7.5rem]"
          >
            <span className={clsx('text-[15px] leading-snug text-ink', row.strong ? 'font-bold' : 'font-normal')}>{row.label}</span>
            <span className="relative block min-w-0" aria-hidden="true">
              <span className="viz-grow-once block h-[14px] rounded-r-[4px]" style={{ width: `${Math.max(pct, 0.6).toFixed(2)}%`, background: BAR }} />
            </span>
            <span className={clsx('text-right font-mono text-[15px] tabular-nums text-ink', row.strong && 'font-bold')}>
              <Val v={row.value} unit={row.unit} src={row.src} format={row.format} />
            </span>
          </li>
        );
      })}
    </ol>
  );
}
