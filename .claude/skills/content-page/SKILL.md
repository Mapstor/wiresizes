---
name: "content-page"
description: "Use BEFORE writing, structuring, expanding, or reviewing ANY content page meant to rank on Google and be cited by AI — articles, calculators/tools, maps, data or reference pages, guides — on a monetized (Raptive) site. Trigger on creating a new page, fleshing out a thin page, planning page structure, \"write an article\", \"build a page\", \"this page is thin\", \"help it rank\", drafting page copy, or reviewing a built page. v2: consumes the kw-research attack-plan row (keywords, FAQ demand, fan-out set), the data-sourcing registry (every number pre-verified), and the seo-visibility standards layer (schema reality, GEO levers, crawlability, myths) — then adds what only this skill owns: the intro formula, the skim/formatting system, the 2-SVG spec with QA, tool-page anatomy with button-gated extensive results, interlinking mechanics, and the pre-publish gate. Goal: page #100 is as good as page #1 — extensive because complete, never padded, never generic, never thin."
---

# Content Page v2.1 — the build standard

The standard for one page that ranks, gets cited, hooks the reader, and
survives review. v2 sits inside the skill system: `kw-research` decides what
the page targets, `data-sourcing` supplies every verified number,
`seo-visibility` supplies the evidence-graded standards, and
`google-ai-content-policy` is the hard gate over everything. This skill owns
the craft: structure, prose, visuals, and the shipping gate.

## Three gates that never bend

1. **Compliance (hard-stop).** `google-ai-content-policy` governs
   scaled-content, Search Essentials, and spam. If it hard-stops, nothing
   here overrides it.
2. **Verified-or-omitted.** Every number and factual claim traces to the
   `data-sourcing` registry or a verified primary with a working deep link.
   No data → say so on the page. This applies *hardest in the hook*: an
   invented statistic in the first 100 words is the worst fabrication on the
   site. Hook stats come from the registry or the hook is reframed without a
   number.
3. **Reader-only rendering.** The spec is for building; the page is for the
   reader. Nothing written for the builder — spec vocabulary, structural
   labels, IDs, code, build or status notes, SEO talk — ever renders: not in
   titles, metas, headings, eyebrow labels, body, captions, SVG text, alt
   text, OG images, JSON-LD or llms.txt. Enforced mechanically by the
   rendered-text gate (see Rendering rules). One leak fails the page the same
   way one fabricated number does.

## The pipeline

Never write first.

```
Phase 0  Row intake        → read the page's attack-plan row + deep-dive data
Phase 1  SERP + intent     → references/serp-and-intent.md
Phase 2  Page spec         → approved before building
Phase 3  Build             → anatomy + quality bar + rendering rules + reference specs
Phase 4  Pre-publish gate  → references/prepublish-checklist.md + v2.1 additions + rendered-text gate
```

### Phase 0 — Row intake (v2: read, don't re-research)

The keyword work lives in `kw-research`. Load the page's row from
`page-map.csv` + its keywords from `keyword-ledger.csv` (primary, secondaries,
tertiaries, anchors owed to other pages) and the Tier-2 deep-dive output
(demand-ordered FAQ list, H2 set and order, exact phrasings). If the row or
deep-dive is missing, run kw-research's page deep-dive first — never improvise
keywords, and never re-litigate assignments the ledger already records. For a
one-off page with no site map, fall back to kw-research's batch procedure.

### Phase 1 — SERP + intent audit

The highest-leverage step and the one most often skipped. Full procedure in
`references/serp-and-intent.md`: SERP features present, top-10 content type,
intent classification, entity coverage, and the information-gain wedge. KWP
data says what people want and how they phrase it; the SERP says what format
Google rewards. Both, always.

### Phase 2 — Page spec (approved before building)

One short spec: primary + secondaries (from the row) · intent in one
sentence · content type matched to SERP · the named information-gain wedge ·
target snippet block · SVG concepts (hero + supporting) · internal links in
AND out (from the ledger anchor plan) · data domains used (from the
registry) · for tools: inputs, outputs, and the results-explanation plan.
The spec's vocabulary stays in the spec — see Rendering rules.

## Page anatomy (Phase 3)

Order matters — it front-loads the answer for skimmers and AI extractors.

**Article/guide pages:**

1. **H1** — primary keyword, reads human.
2. **Intro formula** — pain → stakes → promise, per
   `references/intro-and-hooks.md`. Three short paragraphs maximum, written
   as plain prose: the beat names never appear on the page.
3. **Direct-answer block** — 40–60 words answering the primary query, key
   phrase bolded. Snippet bait + the cleanest unit an LLM can cite.
4. **Hero SVG** — conceptual illustration of the topic, high up, per
   `references/svg-spec.md`. (On tool pages it goes below the tool.)
5. **TOC with jump links** — mandatory over ~1,500 words.
6. **Body sections** — H2s from the deep-dive's demand-ordered set; each
   section = finding → context (see quality bar). Tertiary phrasings live in
   H3s and body text.
7. **Supporting SVG** (the second of the two) + data charts as needed (charts
   don't count toward the 2).
8. **1–2 stat callout boxes** — the shareable, quotable numbers.
9. **Use-case section** where a tool/map exists on the site — concrete
   scenarios that link to it.
10. **FAQ** — demand-ordered from the deep-dive; each answer self-contained
    and citable. FAQPage markup optional (no rich result since May 2026 —
    the *content* is what matters for PAA and AI extraction).
11. **Methodology / sources block** — registry-generated attributions,
    visible "data as of", author + credential, honest gap disclosure.
12. **Related block** — one, at the end; no sidebar widgets.
13. **Schema** — per seo-visibility's supported list (Article / Dataset /
    SoftwareApplication + BreadcrumbList; Person/Organization site-level;
    never aggregateRating, never HowTo expectations). Validate.
14. **OG image** — distinct per page: title + one real data point, derived
    from the site's SVG tokens.

**Tool/map pages:** different anatomy — tool first, full spec in
`references/tool-pages.md`. Above the tool: the H1 and at most two plain
lines (pain + promise fused, then the credibility line). Nothing else — no
labels, no input diagram, no "what you'll need" block, no methodology, no
hero SVG. The first input sits within ~60 rendered words of the H1. The full
intro material, the hero SVG and the extensive prose live *below* the tool;
results are button-gated and extensively explained; the crawlable twin
(worked example, typical values, how-to-read-results) keeps the JS-off test
passing.

## The quality bar

- **Every number gets the full treatment**: the figure (dual units — imperial
  primary, metric secondary), what it means in plain English, how it compares
  or relates to other numbers on the page, and what the reader should do with
  it. "Optimal tilt is 34°" is thin; "Optimal tilt is **34°** — but anywhere
  from 25–45° costs under 2% a year, so your existing roof pitch is almost
  certainly fine" is the standard. This is simultaneously the GEO stats
  lever.
- **Scenario figures carry their assumptions.** A number computed for one
  example (a pool size, a fuel price, a climate) is quoted with its
  assumptions in the same sentence everywhere it appears — hubs, homepage,
  metas and OG images included. Never promote an example result to a general
  claim.
- **One source per number.** A figure that appears in prose, tables, FAQs
  and examples renders from the same data or engine call — never retyped.
  Site-wide counts ("22 calculators") are derived from data.
- **Skimmable, never a wall.** 3–4 sentence paragraphs. Bold the key phrases
  so the bold alone tells the story — never over-bold. Callouts, tables,
  subheads, whitespace. Full system: `references/formatting-system.md`.
- **Extensive because complete.** Depth = the fan-out set covered, every
  number contextualized, the real FAQs answered, the wedge delivered. Length
  floors are sanity checks, NEVER targets: data pages ~1,200–2,500 rendered
  words, articles ~1,500–3,000, tool pages ~800–1,500 below the tool. Padding
  to hit a floor is a build failure — cut or add substance instead.
- **No template quotas.** Section sets and the number of examples, FAQs and
  tables follow each page's own deep-dive. Sibling pages must not share an
  identical H2 skeleton; a section that exists because the template has it
  is padding.
- **One information-gain wedge per page**, named in the spec and delivered on
  the page as a plain-language insight where the reader needs it. "Visible"
  means the insight is on the page — never the word "wedge", a label
  announcing it, or a heading tag like "(the key insight)". It is what earns
  links, snippets, and citations.
- **Voice**: conversational-expert. "You" and "we", contractions fine, short
  sentences, zero fluff. Confident because sourced — so no self-description
  ("honest", "rigorous", "exact"), no competitor-bashing ("clone
  calculators", "what generic pages miss", "most calculators get this
  wrong") unless it names a specific, sourced comparison, and none of these
  tics: "Here's the deal", "Here's the thing", "finally explained", stacked
  "X — not Y" constructions, ALL-CAPS emphasis.
- **Spelling and units follow the site's market.** US sites: US spelling,
  imperial primary with metric secondary.
- **E-E-A-T per page**: real author (real name + credential) and reviewed
  date *visible on the page*, not only in metadata; methodology link. State
  credentials once, factually. Show first-hand experience (photos, real
  readings, tested products) where the author has it — never imply
  experience that isn't there. Non-negotiable on YMYL-adjacent pages.
- **Interlinked, both directions**: 3–8 inline contextual anchors using the
  ledger's anchor plan (keywords owned elsewhere become links to their
  owners), links up to the hub, and — at ship time — links *into* the new
  page from existing high-authority pages. Link only to live pages; never
  mention unbuilt pages or build status.
- **Mobile-first**: the mobile render is what Google judges. Explicit
  dimensions on every visual (CLS), lazy-load below-fold SVGs, and **never
  horizontal overflow** — wide tables get a contained scroll wrapper; test at
  360 px. Page-level right-overflow is an automatic gate failure.
- **Freshness as a system**: visible "data as of", registry `next_check`
  drives updates, and dateModified only moves with genuine changes.

## Rendering rules — nothing written for the builder reaches the reader

Spec vocabulary is for planning. None of this renders anywhere on a page or
in its metadata:

- **Spec and structure words:** hook, promise, pain/stakes, wedge,
  information gain, fan-out, attack plan, ledger, registry row, archetype,
  spoke, hub/sub-hub, cluster, orchestration, capstone, centerpiece,
  flagship, "the page's identity", "money query". Examples and tables get
  reader titles ("Example: 20,000-gallon inground pool", "Table: salt
  needed by pool size"), never IDs (E1, T1, F12, §4.1).
- **Code and build notes:** file paths, function or constant names,
  test/assert names, "engine", "single-sourced", "by construction", "build
  pipeline", "every push", refactor notes. Methodology is explained as
  formula + source in reader terms.
- **Status notes:** "shipping later", "coming in a later phase", "now
  shipped", "when X ships". Mention only pages that exist, and link them.
- **SEO and AI talk:** search intent, crawlable, crawler, LLM,
  citation-worthy, "cite us". A reuse license gets one plain line.
- **Notes to an editor:** "must not be buried", "shape only · no numeric
  values", "documenting this so…".

**The rendered-text gate (mechanical, every build).** After the production
build, a script scans every prerendered page — title, meta description,
og/twitter tags, alt/title/aria-label, visible text, SVG text, JSON-LD
strings — plus llms.txt and OG-image sources, for the patterns above,
self-praise words, the site market's wrong-spelling list, and joined words
(digits or inline markup running into the next word, e.g. "23calculators",
"</strong>Every"). Any hit fails the build; genuine false positives go in an
allowlist with a reason. Reuse the script first built for poolsolver.com
(`scripts/check-rendered-text.mjs`) and extend its list with each site's own
spec vocabulary.

## Reference overrides (v2.1)

The reference files predate the rendering rules. Read them through them:

- `intro-and-hooks.md` and `tool-pages.md`: "hook", "promise" and "pain →
  stakes → promise" name beats of unlabeled prose — never on-page labels.
- `prepublish-checklist.md` "The named wedge is on the page and visible":
  the insight is stated in plain words where the reader needs it — never
  labeled.
- Add these lines to the pre-publish gate:
  - ■ Rendered-text gate passes with zero hits.
  - ■ Tool pages: first input within ~60 rendered words of the H1; only two
    plain lines above the tool.
  - ■ No template quotas: sibling pages' H2 skeletons differ; example, FAQ
    and table counts follow each page's deep-dive.
  - ■ Scenario figures carry their assumptions wherever quoted, including
    hubs, homepage, metas and OG images.
  - ■ Repeated figures render from one data source; site-wide counts are
    derived from data.
  - ■ Byline and reviewed date visible on the page itself.
  - ■ Every internal link resolves to a live page; no build-status mentions.

## Working loop with Marko

1. Page named → Phase 0 row intake → Phase 1 SERP audit → Phase 2 spec for
   approval.
2. On approval → build to anatomy + references. Render and self-check both
   SVGs against the QA checklist; flag heroes for Marko's spot-check.
3. Run `references/prepublish-checklist.md` — every line — plus the v2.1
   lines above and the rendered-text gate. Surface failures and fixes; never
   ship around the gate.
4. Ship with the reverse-link injection list (which existing pages now link
   here, with which anchors).

## Proactive extras that raise ranking odds

Win the snippet deliberately (match its format, beat its clarity) · mine PAA
into H2s/FAQ · make the wedge embeddable/quotable (the page-level magnet) ·
suggest a mini-tool on article pages where one cheap interactive element
serves the intent · propose new pages when the deep-dive reveals split
intents (route to kw-research, never stuff).

## Reference files

- `references/intro-and-hooks.md` — the intro formula per archetype, hook
  rules, voice.
- `references/formatting-system.md` — the skim system: paragraphs, bolding,
  callouts, TOC, tables, units, mobile rules.
- `references/svg-spec.md` — the 2-SVG rule, per-site tokens, the collision
  QA checklist, charts policy, OG derivation.
- `references/tool-pages.md` — tool-page anatomy: tool-first layout,
  button-gated extensive results, crawlable twin, use cases, mini-tools.
- `references/serp-and-intent.md` — the full Phase 1 procedure.
- `references/prepublish-checklist.md` — the Phase 4 gate.

Consult `seo-visibility` for any standards question (schema reality, GEO
levers, crawler policy, myths) — do not restate or contradict it here.

## Changelog

- v2.1 (Sep 2026): Added gate 3 (reader-only rendering), the rendering rules
  and the mechanical rendered-text gate, tool-first enforcement (at most two
  plain lines above the tool), the no-template-quotas rule for sibling pages,
  the scenario-assumption and one-source-per-number rules, and the visible
  byline/date rule. Trigger: poolsolver.com shipped spec labels ("Hook",
  "Promise", "the wedge"), file paths, test names and status notes on public
  pages, with one fixed section template across all 22 calculators and the
  tool ~200–400 words below the H1.