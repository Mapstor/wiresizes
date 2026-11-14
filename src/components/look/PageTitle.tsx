// The H1 of a page in the look (D-33): the main line at the display size across the top, and an optional second line.
// The H1's text stays the page's title as written: `joiner` is what reads between the two lines (": " for a title
// with a colon, " " otherwise), and only its non-space part is hidden from view.
import { LOOK_H1, LOOK_H1_MAIN, LOOK_H1_SUB } from '@/components/look/styles';

export function PageTitle({ main, sub, joiner = ' ' }: { main: string; sub?: string; joiner?: string }) {
  const mark = joiner.trim();
  return (
    <h1 className={LOOK_H1}>
      <span className={LOOK_H1_MAIN}>
        {main}
        {sub && mark && <span className="sr-only">{mark}</span>}
      </span>
      {sub && (
        <>
          {' '}
          <span className={LOOK_H1_SUB}>{sub}</span>
        </>
      )}
    </h1>
  );
}
