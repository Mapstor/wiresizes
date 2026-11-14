// A calculator's result chart in the look (WSZ-006; DESIGN.md "Result chart"): one value per nearby size, one bar each on
// a shared scale, the chosen size in its metal's color (D-34) and the others in Strong Rule gray. Each value keeps the
// format its source allows (the significant figures of a resistance). An optional target (the reader's voltage-drop
// target) is a 2 px ink mark across every track at its value, and the scale stretches to include it. HTML, not SVG, so
// the text stays 15 px at every width; the bars grow once when the chart is drawn (viz-grow-once, off under reduced
// motion). The list reads as text: size and value per row.
import { clsx } from 'clsx';
import type { Material, SizeKey } from '@/lib/verified/awg';
import { formatSize } from '@/lib/verified/awg';
import type { UnitSymbol, ValueFormat } from '@/lib/calculations/format';
import { Val } from '@/components/content/Val';

export const RUN_COPPER = '#a95a26';
export const RUN_ALUMINUM = '#2f6aa3';
const OTHER = '#8f877f';

export interface RunBarRow {
  size: SizeKey;
  value: number;
  format?: ValueFormat;
}

export function RunBars({
  rows,
  chosen,
  material,
  src,
  unit,
  label,
  target,
}: {
  rows: RunBarRow[];
  chosen: SizeKey;
  material: Material;
  src: string;
  unit: UnitSymbol;
  /** What the list shows, for screen readers. */
  label: string;
  /** A mark at this value on every track. */
  target?: number;
}) {
  const max = Math.max(...rows.map((r) => r.value), target ?? 0);
  const metal = material === 'Cu' ? RUN_COPPER : RUN_ALUMINUM;
  const targetPct = target !== undefined && max > 0 ? (target / max) * 100 : null;
  return (
    <ol aria-label={label} className="space-y-2.5">
      {rows.map((row) => {
        const isChosen = row.size === chosen;
        const pct = max > 0 ? (row.value / max) * 100 : 0;
        return (
          // one track column for every row, so all bars share one scale; the value sits in its own column after it
          <li
            key={row.size}
            className="grid grid-cols-[5.25rem_minmax(0,1fr)_6.75rem] items-center gap-x-3 sm:grid-cols-[6.5rem_minmax(0,1fr)_7.5rem]"
          >
            <span className={clsx('text-[15px] text-ink', isChosen ? 'font-bold' : 'font-normal')} data-size={row.size}>
              {formatSize(row.size)}
            </span>
            <span className="relative block min-w-0" aria-hidden="true">
              <span
                className="viz-grow-once block h-[14px] rounded-r-[4px]"
                style={{ width: `${Math.max(pct, 0.6).toFixed(2)}%`, background: isChosen ? metal : OTHER }}
              />
              {targetPct !== null && (
                <span className="absolute -top-1 h-[22px] w-[2px] bg-ink" style={{ left: `calc(${targetPct.toFixed(2)}% - 1px)` }} />
              )}
            </span>
            <span className={clsx('text-right font-mono text-[15px] tabular-nums text-ink', isChosen && 'font-bold')}>
              <Val v={row.value} unit={unit} src={src} format={row.format} />
            </span>
          </li>
        );
      })}
    </ol>
  );
}
