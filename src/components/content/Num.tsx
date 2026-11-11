// A number without a unit symbol and its source: <Num v={0.87} src="nec-310-15-corrections" format={{ fixed: 2 }} />
// renders <span data-src="nec-310-15-corrections">0.87</span>. For factors, ratios and table cells whose unit sits in a
// column heading; a number with a unit goes through <Val> (D-14). src as in <Val> (D-15).
import { formatValue } from '@/lib/calculations/format';
import type { ValueFormat } from '@/lib/calculations/format';

interface NumProps {
  v: number;
  src: string;
  format?: ValueFormat;
  /** Text before the number, inside the cited span ("×" for a ratio). */
  prefix?: string;
  svg?: boolean;
}

export function Num({ v, src, format, prefix = '', svg = false }: NumProps) {
  const text = `${prefix}${formatValue(v, format)}`;
  if (svg) return <tspan data-src={src}>{text}</tspan>;
  return (
    <span data-src={src} className="whitespace-nowrap">
      {text}
    </span>
  );
}
