// A purpose-built SVG with its caption (WSZ-005a): the SVG carries its own <title>; the caption says what it shows in
// words, with every number through <Val>/<Num>/<Size>. In the look (D-33, WSZ-027): no frame; the caption sits under
// the drawing after a 2 px ink rule.
import type { ReactNode } from 'react';

export function Figure({ children, caption }: { children: ReactNode; caption: ReactNode }) {
  return (
    <figure className="space-y-3">
      {children}
      <figcaption className="max-w-[40rem] border-t-2 border-ink pt-3 text-[15px] leading-[1.55] text-cut-caption">{caption}</figcaption>
    </figure>
  );
}
