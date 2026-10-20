# Tool & map pages — anatomy

Tool-intent queries want the tool. The page leads with it, then out-teaches
every competitor below it.

## Layout order

1. **H1** (primary keyword) + **2-line hook** (see intro-and-hooks.md).
2. **The tool** — above the fold, usable immediately.
3. **Direct-answer block** (40–60 words) right under the tool: what this
   calculates/shows and the headline fact.
4. **Prose section** — the full pain/stakes/promise material, then the
   extensive body: how it works, worked example, use cases, methodology,
   FAQ, sources. Length floor ~800–1,500 words below the tool — floors, not
   targets.

## Interaction pattern — button-gated results

- Inputs + a clear **"Calculate" / "Find"** button. **Results render only on
  click** — no live recomputation while typing. Benefits: a deliberate
  moment of delivery, no mid-typing jank (INP), and a clean before/after
  state.
- Inputs validated with friendly inline messages; sensible defaults
  prefilled so the first click always works; imperial inputs primary with
  metric toggles/parentheses.

## The results panel — extensive, never a bare number

When the button is hit, the results are a full explanation, not a figure:

1. **The headline result** — big, dual units.
2. **A chart graphic** — the result visualized against context (the range,
   the comparison, where the user's number falls). Built from the same
   registry-verified relationships as the page.
3. **Every output number explained**, using the number-context pattern:
   what it means in plain English · why it matters for the decision · how it
   relates to the other outputs and to typical values · what to do with it
   ("with 34,000 BTU (10 kW), you're at the top of the 2.5-ton range — get
   quotes for both 2.5 and 3 ton and ask about…").
4. **Assumptions disclosed** — what the calculation assumed, with the
   methodology link.
5. **Next-step links** — the 1–2 internal pages this result makes relevant.

Results copy is written by the same standards as page prose: 3–4 sentence
blocks, selective bolding, zero filler.

## The crawlable twin — mandatory

Button-gated results are invisible to crawlers, so the page carries the same
substance in server-rendered HTML:

- **A worked example**: one realistic input set walked through with its full
  results explanation, as static prose + a static chart.
- **Typical values table**: the common cases (e.g., BTU by home size) as a
  real HTML table with attribution.
- **"How to read your results"** prose covering every output the panel can
  produce.

The JS-off test (seo-visibility) must pass on every tool page: view-source
contains the data story. The gated panel personalizes; the page itself
already teaches.

## Use-case section

3–5 concrete scenarios showing why the tool/map is useful, each 2–4
sentences, each written to a real sub-intent from the deep-dive ("Buying a
window unit for a bedroom" / "Checking a contractor's quote" / "Sizing for a
finished basement"). Use cases double as fan-out coverage and as natural
homes for internal links.

## Maps specifically

Everything above plus the seo-visibility tool/map crawlability standard:
static data layer (top-N table, state/regional stats, definitions) from the
same dataset at build time; deep-linkable state/region routes rendering that
geography's data in HTML; static map preview as the LCP element with
MapLibre hydrating on interaction; attribution + data-as-of visible on the
map UI.

## Mini-tools on article pages

Where one cheap interactive element serves the intent mid-article (a unit
converter, a quick single-input calc), embed it — same button-gated pattern,
compressed results (headline + 2–3 explained numbers), same crawlable-twin
rule in miniature. A mini-tool is a differentiator and a magnet; it is never
an excuse to thin the prose.
