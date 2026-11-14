---
name: WireSizes
description: Wire gauge charts, NEC table values and calculators, drawn in ink and cut copper on white
colors:
  ink: "#111111"
  paper: "#ffffff"
  copper-light: "#f3c193"
  copper: "#d6904f"
  copper-dark: "#a95a26"
  copper-rim: "#6b3112"
  copper-glint: "#ffe2c4"
  copper-label: "#2a1205"
  copper-line: "#b0571f"
  copper-deep: "#8a3d10"
  graphite: "#2b2b2b"
  caption-gray: "#3d3d3d"
  muted-gray: "#555555"
  rule-strong: "#8f877f"
  hairline: "#ebe7e2"
  aluminum-blue: "#2f6aa3"
  chart-copper-light: "#c8803f"
  edition-dark: "#2b2826"
  edition-mid: "#57514c"
  edition-light: "#a39b93"
  connector-gray: "#c4bdb5"
typography:
  display:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "96px"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  display-sub:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "31px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "46px"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "19.5px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  caption:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "13.5px"
    fontWeight: 600
    lineHeight: 1.25
  figures:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.375
rounded:
  none: "0px"
  control: "6px"
spacing:
  gutter-phone: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "32px"
  cell-x: "14px"
  cell-y: "6px"
  block: "56px"
components:
  link:
    textColor: "{colors.ink}"
  link-hover:
    textColor: "{colors.copper-deep}"
  nav-link:
    textColor: "{colors.ink}"
    padding: "8px 0"
  menu-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px"
  consent-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 16px"
  consent-button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  table-header-cell:
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
    padding: "10px 14px"
  table-cell:
    textColor: "{colors.ink}"
    typography: "{typography.figures}"
    padding: "{spacing.cell-y} {spacing.cell-x}"
  source-line:
    textColor: "{colors.muted-gray}"
    typography: "{typography.caption}"
---

# Design System: WireSizes

## Overview

**Creative North Star: "The Cut Conductor"**

The look is a reference sheet you could hold up to a spool of wire. Every drawing is the wire itself: the cut end of a solid copper conductor, drawn at its true size from the site's diameter data, so the picture proves the number next to it. The AWG chart opens with all 44 gauges as cut copper ends wound into a spiral, each one gauge step smaller than the last.

The feel is exact, plain and warm. Exact, because every figure sits in a ruled table with its source line under it and every drawing is to scale. Plain, because nothing is decorative: no cards, no shadows, no icons, no tinted panels, just ink type on white separated by ruled lines of different weights. Warm, because the one color is the copper of the conductors themselves, and it shows up only where copper belongs: the drawn wire, the underline of a link, the text selection.

Type does the hierarchy. A very large, tightly set Archivo H1 runs across the top of the page; headings are heavy and short; prose sits at a reading measure; figures in tables are set in Azeret Mono so columns line up digit for digit.

**Key Characteristics:**
- Ink on white with cut copper as the only color; in charts, Aluminum Blue marks aluminum and nothing else.
- Drawings built from real data at true scale, never illustrations.
- Ruled tables: a double rule on top, a stronger line every five rows, a heavy closing rule.
- A source line under every table and drawing.
- Flat surfaces; depth comes from the weight of a rule, never from a shadow.
- One clear moment of motion per drawing, off under reduced motion; a chart's marks grow in as it scrolls into view.

## Colors

One metal on paper: ink for words and rules, white for the ground, and a cut-copper family that belongs to the conductors.

### Primary
- **Cut Copper** (copper): the face of every drawn conductor, lit from the top left from Copper Light through Copper to Copper Dark. Used only in drawings of wire.
- **Copper Light** (copper-light) and **Copper Dark** (copper-dark): the two ends of the conductor's face gradient (top left to bottom right).
- **Oxide Rim** (copper-rim): the thin outline of each conductor, so discs that touch stay distinct.
- **Glint** (copper-glint): the inner ring just inside the rim of larger discs.
- **Copper Shadow Ink** (copper-label): gauge labels printed on the copper face; about 7:1 against the face's middle tone.
- **Copper Line** (copper-line): the underline of every link, 2 px thick. Never used for text.
- **Deep Copper** (copper-deep): link text on hover.

### Neutral
- **Ink** (ink): all text, headings, the heavy rules (table heads and closes, section and figure rules, the footer's top rule), and the focus outline.
- **Paper** (paper): the only page ground, including header and footer.
- **Graphite** (graphite): table header text.
- **Caption Gray** (caption-gray): figure captions and the text under drawings.
- **Muted Gray** (muted-gray): bylines, source lines, labels in definition lists; 7.5:1 on white.
- **Strong Rule** (rule-strong): the line under every fifth table row.
- **Hairline** (hairline): row lines, section dividers, the header's bottom line, chart gridlines and the 100 % track behind a percent bar.

### Chart colors
Charts take their colors by the job the color does, and every set was checked with the dataviz palette validator against white.
- **Copper and Aluminum Blue** (copper-dark, aluminum-blue): the two metals, wherever a chart compares them (the resistance line, the copper-beside-aluminum chart, the bars in the homepage table). The pair passes the colorblind and normal-vision checks.
- **Temperature ramp** (chart-copper-light, copper-dark, copper-rim): the 60, 75 and 90 °C columns, light to dark in one copper family, because the columns are ordered.
- **Edition ramp** (copper-dark, edition-dark, edition-mid, edition-light): the newest NEC edition in copper, older editions in grays, darker for newer; all pairs at least 15.8 apart for normal vision and 10.3 for colorblind readers. The lightest gray is 2.7:1 on white, so every tile names its state and a table on the same page lists each one.
- **Connector Gray** (connector-gray): the line joining a pair of dots.
- **Neutral bars**: a single series of bars (the adjustment percents) in Edition Mid, so copper keeps its meaning.

### Named Rules
**The One Metal Rule.** Copper is the only accent color in a page's text, links and drawings. It appears as drawn conductors, link underlines and the text selection (Cut Copper at 30 %), never as a background behind prose or controls, and no second accent joins it outside charts.

**The Material Color Rule.** In a chart, a series that stands for a metal wears that metal's color: copper for copper, Aluminum Blue for aluminum or copper-clad aluminum. Aluminum Blue appears nowhere else on the site; every other chart color is copper or a gray from the ramps above, and text in a chart stays ink or Muted Gray.

**The Measured Copper Rule.** Outside charts, a copper disc always stands for a real conductor at a stated scale (diameter in inches from the data times a fixed pixels-per-inch). Copper circles are never ornament; in a chart a 10 px copper dot marks one copper value on an axis.

## Typography

**Display Font:** Archivo (with Arial, sans-serif)
**Body Font:** Archivo (with Arial, sans-serif)
**Label/Mono Font:** Azeret Mono (with ui-monospace, monospace)

**Character:** Archivo is a grotesque with real weight at 800 and clear, upright figures; it carries headlines and prose alike. Azeret Mono is a monospace with plain zeros, used only for figures in tables, where columns must line up.

### Hierarchy
- **Display** (800, 96 px on desktop, 76 px from 640 px, 54 px on phones and down to 40 px on a 320 px screen, so a long word fits; line height 0.92; tracking −0.04em): the H1's main line only, across the full width of the page.
- **Display sub** (500, 31 px, 23 px on phones; line height 1.15): the second line of the H1, after a colon kept for screen readers.
- **Headline** (800, 46 px, 34 px on phones; line height 1.04; tracking −0.035em): section headings (H2).
- **Title** (800, 22 px; line height 1.25; tracking −0.02em): H3s: a gauge's name, a question, a rule's heading word.
- **Lead** (400, 19.5 px, 18 px on phones; line height 1.6): the answer at the top of the page, its first sentence in bold.
- **Body** (400, 17 px; line height 1.65): prose, at most 35rem wide (about 70 characters a line).
- **Caption** (400, 15 px; line height 1.55): figure captions, definition lists, notes under tables.
- **Label** (600, 13.5 px; line height 1.25): table column headers, right-aligned over their figures.
- **Figures** (Azeret Mono 400, 14 px; the row label 600 at 14.5 px): every number inside a ruled table.

### Named Rules
**The Two Voices Rule.** Archivo speaks and Azeret Mono counts: inside ruled tables every figure is Azeret Mono; everywhere else, numbers included, the text is Archivo.

**The Measure Rule.** Prose stops at 35rem; tables, drawings and the H1 use the full width.

## Layout

A centered container with 16 px gutters on phones, 24 px from 640 px and 32 px from 1024 px, up to 1280 px wide. The header is sticky: 64 px tall with a hairline under it; in-page jumps land headings 80 to 96 px from the top so they clear it.

On the AWG chart the H1 runs across the top. Below it, from 1024 px, the answer sits in a 330 px column beside the drawing; from 1280 px the drawing's caption takes its own 230 px column at the right, and below 1280 px it drops under the drawing. Under the hero a hairline opens the body: the content column beside a 17rem guides column from 1024 px, 48 px apart; on phones the guides column follows the content.

Pages without a drawing of their own (the hubs, About, Contact, the legal pages, Methodology) keep the H1 across the top and set their text in one 35rem column under it; on the homepage the copper spiral takes the place of the AWG chart's. Sections are 56 px apart. Tables keep the full content width and scroll sideways inside their own frame on small screens, the first column staying in place. Gauge entries sit in two columns from 768 px, each a 96 px drawing column beside the values. Breakpoints: 640, 768, 1024 and 1280 px.

## Elevation & Depth

The system is flat. There are no shadows at all. Depth and grouping come from the weight of lines alone, in four steps: the hairline (1 px), the strong rule every fifth table row (1 px), the ink rule (2 px) that opens a figure caption, the table of contents, the source list and the footer, and the double rule (3 px) that heads a table.

### Named Rules
**The Flat Sheet Rule.** Nothing floats. If two things need separating, a rule separates them; if a thing needs emphasis, its rule gets heavier.

## Shapes

Square corners everywhere: tables, sections, the footer, chart tiles. Circles appear as conductors and, in charts, as 10 px data dots. The phone menu button is the single rounded control (6 px corners, hairline border). A chart bar has one rounded end: the value end, at a 4 px radius; its baseline end stays square.

## Components

### Buttons
Plain and quiet; the site's buttons are controls, not calls to action.
- **Shape:** gently rounded (6 px), hairline border.
- **Menu button:** white with an ink icon, 8 px padding; its border turns ink on hover. Its label reads "Open menu" or "Close menu" for screen readers.
- **Consent buttons:** white with a 1 px ink border, 8 by 16 px padding, Archivo 600 at 15 px; on hover they fill with ink and the text turns white. The banner itself is white over a 2 px ink rule at the bottom of the screen.
- **Focus:** a 2 px ink outline, 3 px from the element, on every focusable element in the body of a page in the look (the header and footer still show the browser's own focus ring).

### Navigation
- **Header:** the WireSizes wordmark in Archivo 800 at 24 px, ink, Deep Copper on hover; the section links in Archivo 500 at 16 px, ink, underlined in Copper Line (2 px, 6 px below the baseline). Phones: the same links stacked at 18 px behind the menu button.
- **Guides column:** the headings "Guides" and "Calculators" in Archivo 800 at 20 px, the group names in Archivo 600 at 14 px in Muted Gray, links underlined in Copper Line, the open guide in bold ink without an underline. On phones, where the column follows the content, a 2 px ink rule opens it.
- **Footer:** white, a 2 px ink rule on top, five link groups, the site pages, the trademark notice and the disclaimer; links underlined in Copper Line at 1 px, 2 px on hover.

### Links
Every link is underlined: ink text, a Copper Line underline 2 px thick and 3 px below the baseline, Deep Copper text on hover. Color alone never marks a link.

### Ruled Table (signature)
The reference table. A caption in Archivo 600 at 16 px above it. A 3 px double ink rule on top; column headers in the label style, right-aligned, over a 1 px ink rule; rows with hairlines, every fifth row with the strong rule; figures right-aligned in Azeret Mono with 14 px by 6 px cell padding; the first column (the size) left-aligned, semibold and fixed while the rest scrolls; a 2 px ink rule closes it. A missing value is a dash hidden from screen readers plus the words "no value" for them. Under the table, a source line.

### Figure
A drawing with its caption: no frame or panel; the caption sits under the drawing after a 2 px ink rule, in the caption style, at most 40rem wide. Schematic drawings (conductors in a raceway, a chain of correction factors, charts of counts, timelines) are drawn in ink and grays with square corners; copper is kept for conductors drawn to scale.

### Source Line
"Source:" and each source's short name from the registry, in 14 px Muted Gray, directly under a table or inside a figure caption. Every table and every drawing carries one.

### Charts
A chart sits in a Figure (caption, 2 px ink rule, source line) next to the ruled table that holds its numbers, so nothing depends on reading the picture.
- **Form follows the data's job:** a line on a logarithmic scale for resistance across all gauges; dots joined by a line for copper beside aluminum at each size; step lines for correction factors by temperature band; bars on a light 100 % track for adjustment percents; a tile map, one square per state, for editions; bars for counts; thin bars inside a ruled table for a column of amperes. Never a pie, a dual axis or a gradient fill.
- **Anatomy:** no frame or panel. Gridlines in Hairline, tick labels and axis titles in Archivo 13 px Muted Gray. Two or more series get a legend at the top left (10 px dots or 18 px line keys, Archivo 14 px ink); a few direct labels carry the story (the last value, a bracket over a ratio), never a number on every point.
- **Marks:** 2 px lines; 10 px dots with a 2 px white ring so neighbors stay apart; bars up to 24 px thick; tiles with a 2 px white gap (1 px on phones) and their state code in Archivo 700, white on dark tiles and ink on light ones.
- **Text:** at least 13 px on screen at every width; a chart wider than a phone gets its own narrow drawing (288 px) below 768 px (640 px for the tile map and the counts), swapped by visibility and size, never by display.
- **Hover:** pointing at a mark shows its values in a white box with a 1 px ink outline and no shadow.
- **Motion:** tied to the scroll. As a chart comes into view, its lines draw from the first point, bars grow from the baseline and dots and tiles appear, through CSS scroll-driven animation with no script. Every motion starts as its mark enters at the bottom of the screen and is finished within the bottom fifth to third of it (bars first, on an exponential ease-out, since a bar's length is its value), so a chart at rest shows true values. Browsers without scroll timelines, and readers who ask for reduced motion, see the finished chart.
- **Table bars:** under each figure in an ampere column, a 5 px bar on a fixed track (44 px on phones, 88 px from 640 px) that ends under the figure, so every column in the table shares one scale.

### Gauge Entry
One gauge per entry: a 96 px square column holding its conductor drawn at 200 px per inch, the gauge as a title, then a definition list (diameter, area, resistance, one row per ampacity column) in 15 px with tabular figures and Muted Gray terms, and a note when the code limits the size. A hairline above each entry.

### Copper Spiral (signature)
All 44 AWG sizes from 4/0 to 40 as cut conductors at one scale (455 px per inch on screens 640 px and wider, 268 px per inch below), each placed one 45° step further along a logarithmic spiral that shrinks by the same ratio as the gauges, so neighbors touch. Labels in Copper Shadow Ink at 13 px or more on screen (14 px in the narrow version, which may shrink to 94 % at 320 px). Motion: each disc grows in from nothing in 0.5 s on an exponential ease-out, 55 ms after the one before, starting with 4/0; from 3.4 s a soft highlight passes across the discs and repeats every 6 s. Reduced motion shows the finished spiral. The wide and narrow drawings swap with visibility and size, never with display.

## Do's and Don'ts

### Do:
- **Do** underline every link in Copper Line (2 px, 3 px offset) over ink text.
- **Do** draw conductors from the data at a stated pixels-per-inch, so the drawing proves the number.
- **Do** put a source line under every table and every drawing.
- **Do** keep text in drawings at 13 px or more on screen at every width; give a wide drawing a narrow version below 640 px rather than shrinking it.
- **Do** set figures in ruled tables in Azeret Mono and prose in Archivo at a 35rem measure.
- **Do** show drawings finished, without motion, when the reader asks for reduced motion.
- **Do** give every chart a source line, a legend when it has two or more series, and a table of its numbers on the same page.

### Don't:
- **Don't** add shadows, rounded cards, tinted panels or gradients behind text (The Flat Sheet Rule).
- **Don't** add a second accent color outside charts; the blue of the older pages goes as they move to this look (The One Metal Rule).
- **Don't** use Aluminum Blue for anything but aluminum in a chart (The Material Color Rule).
- **Don't** draw copper circles that are not conductors at a stated scale (The Measured Copper Rule).
- **Don't** put small capital-letter labels above headings, number the sections, or put icons beside links.
- **Don't** hide an animated drawing with display: none, even inside a media query that does not match: Chrome stops painting it while its animation runs.
