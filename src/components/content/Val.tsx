// A number with its unit and its source: <Val v={20} unit="A" src="calc:conductor-sizing" /> renders
// <span data-src="calc:conductor-sizing" class="whitespace-nowrap">20 A</span>. The number comes from
// src/lib/calculations/format.ts, a plain space separates it from the unit, and nowrap keeps the two on one line
// (D-14). src is a verified registry domain, calc:<ENGINE_ID> for an engine output, or "input" for a value the reader
// entered that the page repeats back (D-15). No registry or fs import: client and server components both use it.
import { withUnit } from '@/lib/calculations/format';
import type { ValueFormat } from '@/lib/calculations/format';

interface ValProps {
  v: number;
  unit: string;
  src: string;
  /** How the number is written; as entered (grouped, unrounded) when left out. */
  format?: ValueFormat;
  /** Inside an SVG <text>: a <tspan>, since a <span> does not render there. */
  svg?: boolean;
}

export function Val({ v, unit, src, format, svg = false }: ValProps) {
  const text = withUnit(v, unit, format);
  if (svg) return <tspan data-src={src}>{text}</tspan>;
  return (
    <span data-src={src} className="whitespace-nowrap">
      {text}
    </span>
  );
}
