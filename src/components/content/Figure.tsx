// A purpose-built SVG with its caption (WSZ-005a): the SVG carries its own <title>; the caption says what it shows in
// words, with every number through <Val>/<Num>/<Size>.
import type { ReactNode } from 'react';

export function Figure({ children, caption }: { children: ReactNode; caption: ReactNode }) {
  return (
    <figure className="space-y-2 rounded-md border border-gray-200 bg-white p-4">
      {children}
      <figcaption className="text-sm text-gray-700">{caption}</figcaption>
    </figure>
  );
}
