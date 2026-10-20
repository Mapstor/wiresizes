# Formatting system — built for skim readers

Nobody reads walls of text. The page must deliver its story to a reader who
only skims bold text, headings, callouts, and visuals — while rewarding the
one who reads everything.

## Paragraphs & sentences

- **3–4 sentences per paragraph, hard maximum.** One idea per paragraph.
- Short sentences dominate; vary rhythm; no nested clauses stacking.
- Zero filler sentences. Every sentence either informs, contextualizes a
  number, or moves the reader.

## Bolding — the skim layer

- Bold the **key phrases and numbers** such that reading only the bold
  reconstructs the page's argument.
- Budget: roughly one bolded phrase per paragraph, two where a number and
  its implication both matter. If everything is bold, nothing is.
- Bold phrases, not whole sentences. Never bold generic words ("important",
  "note that").
- Primary/secondary keywords get bolded where they naturally appear — never
  forced repetition (keyword stuffing measurably hurts AI visibility and is
  a policy risk).

## Stat callout boxes

- **1–2 per long page**: the page's most quotable verified numbers, visually
  distinct, with the registry attribution line inside the box.
- Callouts are the page-level magnet — written to be screenshotted, quoted,
  and cited ("According to…"). Include the source so the citation travels.

## Table of contents

- Mandatory over ~1,500 rendered words: jump links to every H2, near the
  top, collapsed or compact on mobile. Earns sitelinks and serves skimmers.

## Headings

- H2s come from the deep-dive's demand-ordered set — highest-volume phrasing
  as the heading text. H3s absorb tertiary phrasings and question forms.
- Headings state findings where possible ("Oversizing costs more than
  undersizing") rather than labels ("Sizing considerations").

## Tables

- Real HTML tables wherever data compares — crawlable, extractable, and the
  format AI assistants lift.
- Wide tables: contained horizontal scroll wrapper with a visible affordance
  — the PAGE never scrolls sideways.
- Every table: caption or lead-in sentence + source attribution.

## Units — always dual

- **Imperial primary (US market), metric secondary in parentheses**, every
  time a unit appears: "3.5 tons (12.3 kW)", "2,000 sq ft (186 m²)".
- Consistent rounding; conversions computed, never guessed.

## Numbers in prose — the context pattern

Every number, everywhere (body, results, callouts):
1. the figure (dual units),
2. plain-English meaning,
3. relation ("that's roughly double the…", "compared to the median…"),
4. reader action ("which means for a 2,000 sq ft home you'd…").
A naked number is a build failure.

## Mobile rules — automatic gate failures

- **No horizontal overflow at 360 px.** Test it. Common culprits: unwrapped
  tables, fixed-width SVGs, long unbroken strings, absolutely positioned
  elements.
- Every image/SVG/embed has explicit width/height or aspect-ratio (CLS).
- Tap targets and font sizes sane at mobile widths; TOC compact on mobile.
- Below-fold visuals lazy-load; the hero does not tank LCP.
