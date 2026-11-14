// The picked look (D-33; DESIGN.md "The Cut Conductor"): the classes every page in the look shares, so the type
// ramp, the links and the source lines read the same on every page. Values are DESIGN.md's tokens; change them
// there first. Pages wrap their content in LOOK_PAGE (the .look scope in globals.css gives selection and focus).
// This file sits under src/components so Tailwind's content globs (tailwind.config.ts) see every class in it.

export const LOOK_PAGE = 'look bg-white font-display text-ink';

/** H1: the main line at the display size, an optional second line at display-sub (components/look/PageTitle). */
export const LOOK_H1 = 'font-display font-extrabold tracking-[-0.04em] text-ink';
export const LOOK_H1_MAIN = 'block text-balance text-[54px] leading-[0.92] sm:text-[76px] lg:text-[96px]';
export const LOOK_H1_SUB = 'mt-4 block text-[23px] font-medium leading-[1.15] tracking-[-0.015em] text-cut-graphite sm:text-[31px]';

export const LOOK_H2 =
  'scroll-mt-24 text-balance font-display text-[34px] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink sm:text-[46px]';
export const LOOK_H3 = 'text-balance font-display text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-ink';

/** Prose at about 70 characters a line (The Measure Rule). */
export const LOOK_P = 'max-w-[35rem] text-[17px] leading-[1.65] text-ink';
/** The answer under the H1. */
export const LOOK_LEAD = 'max-w-[38rem] text-[18px] leading-[1.6] text-ink sm:text-[19.5px]';
export const LOOK_LIST = 'max-w-[35rem] list-disc space-y-2 pl-6 text-[17px] leading-[1.65] text-ink marker:text-cut-line';
export const LOOK_CAPTION = 'text-[15px] leading-[1.55] text-cut-caption';
/** Every link: ink text, a 2 px copper underline 3 px below the baseline, deep copper on hover. */
export const LOOK_LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px] hover:text-cut-deep';
/** "Source: …" under a table or drawing. */
export const LOOK_SRC = 'mt-2 text-sm text-cut-muted';
/** A block opened by the 2 px ink rule (figure captions, the table of contents, notes, the source list). */
export const LOOK_RULED = 'border-t-2 border-ink pt-3';
/** Formulas and other set-apart figures in running text. */
export const LOOK_FORMULA = 'max-w-[35rem] border-t-2 border-ink pt-3 font-figures text-[15px] leading-relaxed text-ink';

/** The byline's text and link classes on a page in the look. */
export const LOOK_BYLINE = 'mt-5 text-[15px] text-cut-muted';
export const LOOK_BYLINE_LINK = 'text-ink decoration-cut-line decoration-2 hover:text-cut-deep';

/** Sources at the foot of a page: the section, its heading, the list and the "Retrieved" note. */
export const LOOK_SOURCES_SECTION = 'space-y-3 border-t-2 border-ink pt-4 text-[15.5px] text-[#333333] [&_p]:max-w-[34rem]';
export const LOOK_SOURCES_HEADING = 'font-display text-[32px] font-extrabold tracking-[-0.035em] text-ink';
export const LOOK_SOURCES_LIST = 'list-disc space-y-1 pl-6';
export const LOOK_SOURCES_NOTE = 'text-sm text-cut-muted';
