---
name: data-sourcing
description: >-
  Verify the raw data behind a site before anything is built: turn a kw-research
  page map into a registry of verified primary sources with licenses cleared,
  samples pulled, attribution strings written, and gaps disclosed. Use whenever
  Marko says "data sourcing", "source the sitemap", "find data for [site or
  page]", "is there an API or dataset for", "verify sources", "data registry",
  or asks where a site's numbers will come from — and for auditing an existing
  page's citations or attribution. Runs in chat (research and live fetching
  happen here), after kw-research produces page-map.csv and before any build;
  claude-box never researches, it consumes the verified registry. Every number
  or fact on any page must trace to a verified primary source; a single
  credible primary suffices; missing data is disclosed, never synthesized.
  Consult the portfolio master registry first and reuse verified sources across
  sites. Escalate to Marko only when no credible primary source can be found.
---

# Data Sourcing — verified primaries before anything is built

Pipeline position: **kw-research → data-sourcing → build.** Input:
`research/page-map.csv`. Output: `research/data-sources.csv` (site registry)
plus updates to the portfolio **master registry** of verified sources. The
build phase consumes the registry; nothing gets built on data that has not
been verified here.

## Hard rules — never bend

1. **Every number and fact on any page traces to a verified primary source.**
   This applies to datasets powering tools/maps AND to individual facts cited
   in articles. One credible primary suffices — no multi-source corroboration
   requirement.
2. **Source hierarchy.** (A) Government, scientific, and official APIs or
   datasets. (B) High-authority institutions — universities, established
   organizations, standards bodies. (C) Wikipedia and comparable high-authority
   references — acceptable, but when the claim carries a footnote to a primary,
   follow the footnote and cite the primary instead.
3. **Cite what we actually use.** If we use an official aggregation of a
   paywalled or inaccessible primary, we cite the aggregation.
4. **License is a gate, not a note.** Public-domain and explicitly-licensed
   sources are in. Reuse forbidden by terms is out — no exceptions, no
   scraping around it. Unclear terms keep a source at `candidate` until
   judged.
5. **Attribution with working deep links.** Every attribution links to the
   page that actually shows the claim — never a homepage, never a 404. Verify
   each attribution URL resolves and displays the sourced data at write time.
6. **Missing data is disclosed, never synthesized or estimated.** Partial
   coverage ships with explicit coverage disclosure, and the page's promise is
   scoped to actual coverage.
7. **Derived values are allowed** when every input is a verified primary and
   the equation or methodology is published on the site. Label them as
   calculated.
8. **When source numbers change, the site changes.** Every registry row
   carries a re-check interval matched to its cadence.
9. **Escalate to Marko only when no credible primary exists** for something a
   page needs. A found, credible primary is auto-approved — do not queue
   routine sources for his sign-off.

## Unit of work: the data domain, not the page

Forty pages may ride on five sources. From `page-map.csv`, first extract the
distinct **data domains** the sitemap needs (e.g., for a wildfire site:
active-fire detection, incident metadata, smoke forecast, air quality,
historical fires, evacuation orders). Research domains; pages join them via
the registry.

## Phase A — extract the domain map

Read `page-map.csv`, list every distinct data need, note which slugs depend on
each. Present the domain map to Marko before researching — it is the work
plan, and it surfaces immediately which pages share a single point of failure.

## Phase B — discover and evaluate sources

Check the **master registry first** — a source verified for another site is
reused, not re-researched. For new domains, find candidates and evaluate:

| Criterion | What to record |
| --- | --- |
| Authority | hierarchy tier (A/B/C) and why this is the primary |
| License / terms | public domain, license name, or the restricting clause |
| Access mode | API / bulk download / page-only |
| Cadence | update frequency — and the **cadence-match rule**: the page's promise must match it (a "live" map needs a live feed; annual data means the page says annual) |
| Granularity | national / state / county / point — must cover what pages promise |
| Format | GeoJSON, CSV, raster, HTML table… |
| Historical depth | how far back it goes |
| Key / limits | API key required (record yes/no — never the key itself), rate limits |

## Phase C — verify

A source is not `verified` because its landing page looks official. Verified
means, concretely:

1. A real sample was fetched from the actual endpoint.
2. Fields were inspected against what the dependent pages need.
3. Coverage was checked against what the pages promise (for geographic data:
   spot-check at least 3 distinct regions).
4. Retrieval date recorded; sample findings noted in the registry row.

Anything less stays `candidate`. Domains with no usable source are `GAP`.

## Phase D — the registries

Two files, schemas in `references/registry.md`:

- `research/data-sources.csv` — this site's registry; `page-map.csv`'s
  `data_source` column references its `domain` values.
- Portfolio **master registry** — the accumulating union of verified sources
  across all sites (lives in the portfolio-os repo once it exists; until then
  Marko keeps the canonical copy and uploads it alongside the site files).
  Every newly verified source is added to it.

After **any** edit to the site registry: run
`python3 scripts/check_sources.py research/data-sources.csv research/page-map.csv`.
Exit 1 = fix before presenting. In chat, always return updated files for
download at session end.

## Phase E — gaps, in order of preference

1. **Reshape** the page to the data that does exist (an evacuation-orders page
   becomes "how to find official evacuation orders for your county", pointing
   to the authorities — honest utility, zero fake data).
2. **Transparent-gap page** — the page exists and states plainly what data is
   unavailable and why, with official pointers.
3. **Cut** the page.

Never the fourth option. `GAP` rows double as the roadmap: when a source
appears, the page is pre-planned.

## Phase F — attribution standard

- Format: `Source: {publisher}, {dataset} — retrieved {Mon YYYY}`, linked to
  the deep URL recorded in the registry.
- Placement: at every figure, chart, table, and data-driven claim — plus a
  site-level data-sources/methodology page generated from the registry.
- Attribution strings come **from the registry**, never hand-written per page
  — one source of truth, consistent everywhere.
- Derived values additionally link the methodology page that shows the
  equation.

## Maintenance

Re-check intervals by cadence class (recorded as `next_check`): live/daily
feeds → monthly; monthly/quarterly data → quarterly; annual data → yearly.
On re-check: sample again, confirm fields and values; if numbers changed,
flag every dependent page for update — rule 8 is a commitment, not a hope.

## Working loop with Marko

1. He names the site (or uploads `page-map.csv`) → present the domain map.
2. Research + verify → present the registry: verified sources, candidates
   with what blocks them, GAPs with the recommended treatment, and the (rare)
   escalations where no credible primary exists.
3. He rules on escalations and GAP treatments → statuses finalized → files
   handed back → build can start.

## Reference files

- `references/registry.md` — exact schemas and enums for both registries.
  Read before creating or editing them.
- `scripts/check_sources.py` — the invariant check. Run after every edit.
