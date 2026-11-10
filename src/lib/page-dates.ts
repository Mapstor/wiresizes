// Page dates (D-17): src/data/page-dates.json holds, per live route, the day it was first published and the day its last
// body-text change went live. The sitemap's lastmod, the Article and Dataset JSON-LD dates, the byline and the "Last
// updated" lines of /privacy and /terms read this file; nothing in the build reads git, file times or the clock.
import PAGE_DATES from '@/data/page-dates.json';

export interface PageDates {
  /** YYYY-MM-DD */
  published: string;
  /** YYYY-MM-DD */
  modified: string;
}

const DATES: Record<string, PageDates> = PAGE_DATES;

/** A live route's dates. Throws, and so fails the build, for a route page-dates.json lacks. */
export function pageDates(route: string): PageDates {
  const dates = DATES[route];
  if (!dates) throw new Error(`src/data/page-dates.json has no entry for "${route}"`);
  return dates;
}

/** The Article and Dataset JSON-LD dates of a route. */
export function articleDates(route: string): { datePublished: string; dateModified: string } {
  const { published, modified } = pageDates(route);
  return { datePublished: published, dateModified: modified };
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "November 3, 2026" from "2026-11-03", read from the string itself: no Date object, no time zone. */
export function formatDate(isoDate: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  const month = m ? MONTHS[Number(m[2]) - 1] : undefined;
  const day = m ? Number(m[3]) : 0;
  if (!m || !month || day < 1 || day > 31) throw new Error(`not a YYYY-MM-DD date: "${isoDate}"`);
  return `${month} ${day}, ${m[1]}`;
}
