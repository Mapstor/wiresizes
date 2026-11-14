// The wire resistance calculator's result chart (WSZ-006): the run's resistance for the chosen size and up to two
// thinner and two thicker sizes, one bar each on a shared scale, the chosen size in its metal's color (D-34) and the
// others in Strong Rule gray. Each value keeps the significant figures of its source (resistanceSig). HTML, not SVG, so its text stays 15 px at every width; the bars grow once when the chart
// is drawn (viz-grow-once, off under reduced motion). The list reads as text: size and value per row.
import { clsx } from 'clsx';
import type { Material, SizeKey } from '@/lib/verified/awg';
import { formatSize } from '@/lib/verified/awg';
import { Val } from '@/components/content/Val';

export const RUN_COPPER = '#a95a26';
export const RUN_ALUMINUM = '#2f6aa3';
const OTHER = '#8f877f';

export function RunBars({
  rows,
  chosen,
  material,
  src,
  label,
}: {
  rows: { size: SizeKey; conductor: number; sig: number }[];
  chosen: SizeKey;
  material: Material;
  src: string;
  /** What the list shows, for screen readers. */
  label: string;
}) {
  const max = Math.max(...rows.map((r) => r.conductor));
  const metal = material === 'Cu' ? RUN_COPPER : RUN_ALUMINUM;
  return (
    <ol aria-label={label} className="space-y-2.5">
      {rows.map((row) => {
        const isChosen = row.size === chosen;
        const pct = max > 0 ? (row.conductor / max) * 100 : 0;
        return (
          // one track column for every row, so all bars share one scale; the value sits in its own column after it
          <li
            key={row.size}
            className="grid grid-cols-[5.25rem_minmax(0,1fr)_6.75rem] items-center gap-x-3 sm:grid-cols-[6.5rem_minmax(0,1fr)_7.5rem]"
          >
            <span className={clsx('text-[15px] text-ink', isChosen ? 'font-bold' : 'font-normal')} data-size={row.size}>
              {formatSize(row.size)}
            </span>
            <span className="block min-w-0" aria-hidden="true">
              <span
                className="viz-grow-once block h-[14px] rounded-r-[4px]"
                style={{ width: `${Math.max(pct, 0.6).toFixed(2)}%`, background: isChosen ? metal : OTHER }}
              />
            </span>
            <span className={clsx('text-right font-mono text-[15px] tabular-nums text-ink', isChosen && 'font-bold')}>
              <Val v={row.conductor} unit="Ω" src={src} format={{ sig: row.sig }} />
            </span>
          </li>
        );
      })}
    </ol>
  );
}
