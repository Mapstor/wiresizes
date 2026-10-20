# SVG spec — two per page, clean every time

## The 2-SVG rule

- **Every content page carries exactly two purpose-built SVGs minimum:**
  1. **Hero** — a *conceptual illustration* of what the page is about,
     placed high (immediately after the intro/answer block on articles;
     tool pages' hero duty is served by the tool itself plus one concept
     SVG in the prose section). People are visual; the hero captures focus
     and earns the scroll.
  2. **Supporting** — deeper in the body, illustrating the page's key
     mechanism, comparison, or process (often the wedge made visible).
- **Data charts do NOT count toward the two.** Charts (from real registry
  data) come on top, as many as the data deserves.

## Style — per-site tokens

- Each site defines its SVG tokens once: palette (3–5 colors from the site
  theme), stroke weight, corner radius, typography (one family, 2 sizes),
  spacing unit, background treatment. Every SVG on the site uses them —
  coherent look, recognizable when shared.
- Subtle animation is welcome where it aids understanding (a flow, a cycle,
  a before/after); decorative motion is not. Static is always acceptable.
- Conceptual ≠ clip-art: depict the actual subject matter (the airflow, the
  water hardness scale, the fire spread pattern), not generic decoration.

## The collision QA checklist — run on every SVG, every time

Render the SVG and check visually (this is a self-check; Marko spot-checks
heroes only):

- [ ] **No text over text.** No label overlaps another label.
- [ ] **No text over elements** unless on a dedicated label background with
      clear contrast; no text crossing strokes or sitting on busy fills.
- [ ] Labels fit their containers — no clipping, no ellipsis, no overflow
      outside the viewBox.
- [ ] Contrast: every text readable against what's behind it (including in
      dark mode if the site has one).
- [ ] viewBox set; width/height or aspect-ratio explicit (CLS); scales
      cleanly at 360 px — text still legible, nothing collides when narrow.
- [ ] Spelling and units in labels correct; numbers in the SVG match the
      registry (an SVG is a claim — sourced like any other).
- [ ] Accessible: `<title>`/`aria-label` present; decorative parts hidden
      from AT.
- [ ] File inline in the page (crawlable, styleable), not an external
      raster.

Any failed line → fix and re-render before proceeding. Text collisions are
the known recurring failure; check them first.

## OG images

- Distinct per page, generated from the site's SVG tokens: page title + one
  real data point from the page. Never one generic template site-wide.
- 1200×630, text legible at thumbnail size, same collision rules apply.

## Shareability

The hero and callout-adjacent SVGs are page-level link magnets: clean enough
to be screenshotted or embedded elsewhere. Where a visual is genuinely
reference-worthy, offer an embed snippet with an attribution link back to
the page (the passive-magnet pattern).
