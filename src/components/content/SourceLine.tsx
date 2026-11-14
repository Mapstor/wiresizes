// "Source: …" under a table or drawing in the look (D-33, DESIGN.md "Source Line"): each domain's short attribution
// from the registry, inside its own data-src, so the line traces like any number. Server only (registry.ts).
import { attribution, attributionParts } from '@/lib/verified/registry';
import { LOOK_SRC } from '@/components/look/styles';

export function SourceLine({ domains, className = LOOK_SRC }: { domains: readonly string[]; className?: string }) {
  return (
    <p className={className}>
      Source:{' '}
      {domains.map((d, i) => (
        <span key={d} data-src={d}>
          {i > 0 && '; '}
          {attributionParts(attribution(d).text).short}
        </span>
      ))}
      .
    </p>
  );
}
