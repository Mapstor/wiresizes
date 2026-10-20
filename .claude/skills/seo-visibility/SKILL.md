---
name: seo-visibility
description: >-
  The portfolio's SEO + AI-visibility standards layer: an evidence-graded
  rulebook for ranking on Google (goal 1) and getting cited by AI assistants
  (goal 2). Use whenever Marko asks about SEO, rankings, why a page isn't
  ranking, AI visibility or citations (AI Overviews, AI Mode, ChatGPT,
  Perplexity), schema or structured-data decisions, robots.txt and AI-crawler
  policy, titles and metadata, internal linking, Core Web Vitals or INP,
  backlink magnets, freshness, or crawlability of tools and maps — and when
  auditing or reviewing any page or site. Also consult it as the standards
  reference during content-page, kw-research, and build work. Hard rules come
  only from Google-confirmed or strong-empirical evidence; known myths are
  listed and never acted on. Includes the mandatory proactivity protocol:
  surface and propose anything on the always-flag list the moment it is
  noticed, whatever the current task. AI-citation mechanics are volatile —
  re-validate quarterly.
---

# SEO + AI Visibility — the standards layer

This skill is the **what's-true-and-required** layer for goals 1 and 2.
`content-page` is the process for building one page — it consumes these rules.
`kw-research` supplies the keyword/fan-out structure these rules assume.
`google-ai-content-policy` is the hard-stop gate and always wins. The
compliance envelope outranks everything here: no tactic in this skill is ever
worth a spam-policy violation.

**Evidence base:** the July 2026 deep-research report (evidence-graded factor
inventory: Google documentation, DOJ v. Google testimony, the May 2024 API
documentation leak, and large-scale studies — Ahrefs, Seer Interactive,
BrightEdge, seoClarity, the KDD 2024 GEO paper). Distilled inventory:
`references/evidence.md`. Actionable form: `references/checklists.md`.

## Evidence discipline

Every factor carries a grade: **(a)** Google-confirmed/documented ·
**(b)** strong empirical (leak, DOJ, controlled studies) · **(c)**
correlational · **(d)** myth/debunked.

- Hard rules in this skill come only from (a)/(b).
- (c) items are recommended, never presented as certainties.
- (d) items are **never acted on and never recommended**, even if Marko or a
  source suggests them — instead, name the grade and the evidence.
- AI-citation mechanics are volatile (the rank↔citation overlap roughly
  halved within ~15 months). Quarterly, in chat: re-validate the AI-visibility
  rules against current sources and update this skill. Record the check in the
  changelog at the bottom.

## Proactivity protocol — mandatory, any task

While doing ANY work on a site — content, code, research, review — surface
and propose the moment any of these is noticed. Never fix silently, never
ignore:

404s/broken links · orphaned or weakly interlinked pages · thin or
template-flat content · missing/invalid schema · title/meta gaps · stale data
presented as fresh · slow or broken mobile rendering · noindex/robots
accidents · tool/map pages failing the JS-off test (below) · fabricated or
unsourced numbers.

## Page-level rules

1. **Unique, defensible value per page** — original computation, tool, chart,
   or dataset. Near-duplicate templated text at scale is the scaled-content
   kill pattern. (a)
2. **Title tags**: specific, front-load the primary entity/keyword. Exact-ish
   match matters extra on Bing — which is ChatGPT's index. (b)
3. **Direct-answer block in the first ~100 words**: a 40–60 word extractable
   answer to the page's primary query. (b/c)
4. **GEO levers on every page** — the measured AI-citation lifts (up to ~40%
   in the KDD 2024 study): concrete statistics with dates; attributable
   quotations; visible cited sources. Keyword stuffing measurably *hurts*
   (−8–10%) and is forbidden. (b)
5. **Extractable structure**: real tables, definition blocks, clear H2/H3
   hierarchy. (b/c)
6. **Fan-out coverage**: the page (or its cluster) covers the adjacent
   sub-queries — comparisons, related entities, how/why/what forms. AI Mode
   and AIO decompose queries; single-keyword pages miss the synthesis. (a/b)
7. **Real author**: named author, bio, credentials, Person schema with
   `sameAs`. Anonymous content is systematically weaker in Google's quality
   systems. (b/c)
8. **Genuine freshness**: real updates with honest `dateModified`; cosmetic
   date changes are detectable and do nothing. (a/b)
9. **Original media**, not stock. (c)
10. **Never act on the myths**: LSI keywords, exact word counts,
    meta-description "ranking" (CTR only), social signals, dwell-time as a
    direct factor (the real mechanism is NavBoost click quality). (d)

## Site-level rules

1. **Thin-share is site-wide risk**: helpful-content signals are in core and
   site-level. A high share of unhelpful pages suppresses the whole domain —
   prune or upgrade, never accumulate. (a)
2. **Topic clusters with descriptive anchors; zero orphans; breadcrumbs**
   (with BreadcrumbList schema). Internal links follow the reasonable-surfer
   model — prominent, likely-clicked links pass more. (a/b)
3. **Entity foundation**: Organization schema + sameAs, About, Contact,
   editorial/data policy pages. (a/c)
4. **One flagship passive link-magnet per niche**: an original dataset (with
   Dataset schema), an always-updated statistics page, a free calculator, or
   an embeddable chart/widget with an attribution link. Stats pages are what
   journalists cite. No outreach — assets earn links or they don't. (b/c)
5. **YMYL-adjacent niches get extra rigor**: sourcing, credentials,
   transparency (health calculators, weather/safety data). (a)

## Technical rules

1. **SSG/SSR always** for primary content — never CSR-only. (a/b)
2. **Core Web Vitals at p75 field data**: LCP ≤ 2.5 s, INP ≤ 200 ms,
   CLS ≤ 0.1. INP is the one this stack fails first — React hydration plus
   ad scripts. Defer/lazy-hydrate heavy JS. (a/b)
3. **Clean plumbing**: XML sitemaps, canonicals, 301s, no soft-404s, crawl
   budget hygiene across large route counts. (a)
4. **Schema reality (as of Jul 2026)**: implement Article, Dataset,
   Breadcrumb, Organization/Person, SoftwareApplication, Product/Review,
   Video, Event where genuine. **FAQ and HowTo rich results are dead** (FAQ
   fully deprecated May 2026; HowTo 2023) — keep genuine FAQ *content* for
   users, PAA, and extractability; expect no rich result from the markup.
   **Dataset schema is mandatory on data pages** (Google Dataset Search).
   Schema must match visible content. (a)
5. **Schema is for comprehension and rich results, NOT AI citations** — a
   controlled 2026 study found no citation uplift from adding JSON-LD. Never
   sell schema as an AI-visibility lever. (a/b)

## Tool/map crawlability standard — portfolio-critical

Canvas/WebGL content never becomes indexable text, and AI crawlers barely
execute JS. Therefore: **every tool/map page ships as a complete
server-rendered document; the interactive tool is an enhancement on top,
never the content itself.**

- Static data layer from the same dataset at build time: answer block, key
  stats, a real HTML data table, definitions, methodology, attribution.
- Deep-linkable states as real SSG routes — a geo/state page exists only
  where it renders that geography's data *in HTML* (kw-research's geo rule).
- Static preview image as the LCP element (with alt text); lazy-hydrate the
  map on interaction/viewport. Fixes INP/LCP at the same time.
- Never gate critical content behind interaction or scroll-triggered loading.
- **The JS-off test**: view-source must contain the page's data story. Run it
  on every tool/map page before it ships. (Mechanical version lands in
  site-audit later; until then it is a manual gate.)

## AI-visibility rules

1. **robots.txt policy (crawlers-open)**: retrieval/search agents must be
   allowed everywhere — Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User,
   PerplexityBot, Claude-User, Claude-SearchBot. Training bots (GPTBot,
   ClaudeBot, CCBot, Google-Extended) follow the standing portfolio policy:
   allowed, unless Marko decides otherwise per site. Blocking GPTBot does NOT
   remove ChatGPT search visibility (OAI-SearchBot is separate); blocking
   Google-Extended does NOT affect AI Overviews or ranking (training-only).
   Also check host-level blockers — Cloudflare's AI-bot toggle and similar
   can silently block what robots.txt allows. Run `scripts/check_robots.py`
   on every site's robots.txt. (a)
2. **llms.txt: do not implement as a strategy.** No major AI vendor honors it
   as of Jul 2026 (Google explicitly; ~zero real bot hits in traffic
   studies). Harmless if present; zero payoff — spend the time on the GEO
   levers instead. This supersedes the earlier "llms.txt on every site"
   default. (a)
3. **Bing Webmaster Tools on every site**: verified, sitemaps submitted.
   ChatGPT citations match Bing's top-20 far more than Google's (~87% vs
   ~56% in the Seer study) — Bing is a second index worth its own hygiene. (b)
4. **AIO/AI Mode**: citation no longer follows rank (top-10 overlap fell from
   ~75% to roughly 17–38% by early 2026, source-dependent). Optimize for the
   fan-out set and extractability; track **citation share as its own KPI**
   alongside rankings. Being cited recovers the CTR that AIO otherwise
   takes. (b)
5. **Perplexity**: fast, non-JS-gated, non-paywalled pages; PerplexityBot
   allowed. (b/c)
6. **Measurement**: GA4 custom AI channel (regex on chatgpt.com,
   perplexity.ai, gemini.google.com, copilot.microsoft.com, claude.ai —
   placed above Referral; expect heavy undercounting into Direct). GSC
   "Generative AI features" report is impressions-only. Verify GA4's
   platform list against current docs before hard-coding. (a/b)

## To-avoid list — the site killers

Scaled templated near-duplicates · unedited AI content at scale · doorway /
geo fan-out pages without unique data · fake authors · ad-heavy layouts (UX
demotion + INP failure) · scraped aggregation without added value · letting
unhelpful pages accumulate site-wide. All grade (a) policy or (b)
post-mortem. When any of these is requested, invoke the
google-ai-content-policy hard-stop flow.

## Working with the other skills

- `kw-research`: attack-plan rows supply the fan-out set and (v1.1) SERP-
  feature targets these rules optimize for.
- `content-page`: builds pages that must pass every page-level rule here.
- `data-sourcing`: supplies the verified statistics and citations that the
  GEO levers require — sourcing IS an AI-visibility tactic.
- `google-ai-content-policy`: the envelope. Its hard stops override this
  skill.

## Reference files & script

- `references/evidence.md` — the distilled evidence-graded inventory with
  named sources and as-of dates. Read it before overriding or debating any
  rule here.
- `references/checklists.md` — page / site / technical / AI checklists in
  actionable form; every item carries its grade.
- `scripts/check_robots.py <robots.txt> [--require-training-open]` — verifies
  the crawlers-open policy; run on every site.

## Changelog

- 2026-07: v1 written from the July 2026 research report. Next AI-mechanics
  re-validation due: 2026-10.
