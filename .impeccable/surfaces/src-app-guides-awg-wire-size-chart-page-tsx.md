---
version: 1
slug: "src-app-guides-awg-wire-size-chart-page-tsx"
primary_target: "src/app/guides/awg-wire-size-chart/page.tsx"
related_targets: []
---

## Scope

/guides/awg-wire-size-chart, the site's busiest page (research/page-map.csv: 222,588 Bing impressions, 4,248 clicks). Visitor mode: Read. It is build step 1 of the new look; the other pages follow in steps 2 and 3.

## Audience and job

A homeowner wants a gauge's diameter or area in seconds; an electrician wants the full chart, the kcmil rows, the Table 310.16 excerpt and the sources. Proof is the data itself: awg.json (NIST Handbook 100), nec-310-16.json, nec-240-4-d.json, the awg-geometry engine.

## Constraints

PRODUCT.md fixed rules: fast on phones, US English with inches first, contrast of 4.5:1 or better and underlined links. Every number keeps its data-src. No ad boxes on the page: Raptive places ads itself; the layout keeps a free right column on desktop.

## Direction contract

THESIS: the AWG chart as a reference document whose drawing proves the scale: 44 cut copper ends, each one gauge step smaller, wound into a spiral. It refuses the category default, a grey stock table under a stock hero.

OWN-WORLD: white ground, near-black ink, cut copper as the only color; Archivo for text and very large headings, Azeret Mono for table numbers; ruled tables with a double rule on top, a darker line every five rows and a 2 px close; links underlined in copper.

STORY: the reader sees the whole scale at once, reads that a smaller number is a thicker wire, and finds the row in the full chart below.

FIRST VIEWPORT: H1 in Archivo 800 at about 96 px across the top, then the byline; below, three columns: answer paragraph, the spiral at about 570 px in the center, caption with its source on the right. Phone: H1, byline, answer, spiral at about 340 px, caption. Motion: the discs grow in from 4/0 inward in about 3 s, then light passes across them; reduced motion shows the finished spiral.

FORM: pinned by the owner on 2026-11-13 on the page-looks canvas (https://claude.ai/artifact/BSGCuZBgW737B8WUG1iQUz): look B, the copper spiral, with look C's ruled tables. seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Whether the header and footer take the new look in step 1 (shared by every page) or in step 2.
- The other sections of the page (gauge cards, AWG to mm², resistance and weight, all eight questions) take the same system; the canvas showed only part of them.
