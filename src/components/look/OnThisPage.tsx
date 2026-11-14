// "On this page" in the look (D-33, DESIGN.md "Navigation"): a 2 px ink rule, the label beside the section links in
// two columns from 640 px.
import { LOOK_LINK } from '@/components/look/styles';

export function OnThisPage({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <nav aria-label="On this page" className="grid gap-3 border-t-2 border-ink pt-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
      <p className="text-[15px] font-bold">On this page</p>
      <ol className="gap-x-8 text-[16.5px] sm:columns-2">
        {items.map(([id, label]) => (
          <li key={id} className="mb-1.5 break-inside-avoid">
            <a href={`#${id}`} className={LOOK_LINK}>
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
