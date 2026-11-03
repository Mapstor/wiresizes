// "Data as of Oct 2026" from a domain's verified_date in the source registry. Server only (registry.ts).
import { attribution } from '@/lib/verified/registry';

/** "Oct 2026" from "2026-10-19". */
export function monthOf(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function AsOf({ domain, className }: { domain: string; className?: string }) {
  const { verified_date } = attribution(domain);
  return (
    <p className={className}>
      Data as of <time dateTime={verified_date}>{monthOf(verified_date)}</time>
    </p>
  );
}
