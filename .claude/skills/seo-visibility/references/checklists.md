# Checklists — actionable form

Every item carries its evidence grade. Use these during page builds, site
audits, launches, and reviews. Items marked ■ are hard gates; □ are
recommended.

## Page-level (run per page, at build and at review)

- ■ Unique defensible value: original computation, tool, chart, table, or
  dataset — never near-duplicate template text. (a)
- ■ Title tag: specific, primary entity front-loaded. (b)
- ■ Direct-answer block (40–60 words) within the first ~100 words. (b/c)
- ■ GEO levers present: ≥3 dated statistics; ≥1 attributable quotation where
  sensible; visible cited sources (from the data-sourcing registry). (b)
- ■ Real HTML table or definition block where the page has data. (b/c)
- ■ Fan-out coverage: the page + its cluster answer the adjacent sub-queries
  from the attack-plan row. (a/b)
- ■ Author: real name, bio link, Person schema + sameAs. (b/c)
- ■ Honest dates: dateModified only with genuine updates. (a/b)
- □ Original images with descriptive alt text. (c)
- ■ Zero myths acted on: no LSI lists, no word-count padding, no
  meta-description "optimization for ranking", no social-signal chasing. (d)

## Site-level (run at launch and quarterly)

- ■ Thin-share audit: identify pages a human wouldn't bookmark; upgrade,
  merge, or prune — unhelpful share is site-wide risk. (a)
- ■ No doorway/geo fan-out pages without unique rendered data. (a)
- ■ Cluster integrity: every page reachable from its hub, descriptive
  anchors, zero orphans, breadcrumbs + BreadcrumbList. (a/b)
- ■ Entity foundation: Organization schema + sameAs, About, Contact,
  editorial/data policy pages. (a/c)
- □ One flagship passive link-magnet per niche: original dataset (Dataset
  schema) / living statistics page / free tool / embeddable widget with
  attribution link. (b/c)
- ■ YMYL-adjacent pages: sources + credentials + disclosure present. (a)

## Technical (run at launch and after major changes)

- ■ Primary content is SSG/SSR — verify with the JS-off test. (a/b)
- ■ CWV at p75: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 — profile INP with ad
  scripts loaded. (a/b)
- ■ Sitemaps current; canonicals correct; 301s only; no soft-404s. (a)
- ■ Schema: Article / Dataset / Breadcrumb / Organization / Person (+
  SoftwareApplication, Product, Review, Video, Event where genuine), matching
  visible content. Dataset schema on every data page. (a)
- ■ No reliance on FAQ/HowTo rich results; genuine FAQ content kept for
  users and extractability. (a)
- □ Do not pitch schema as an AI-citation lever. (b)

## Tool/map crawlability (run per tool/map page)

- ■ Server-rendered data story: answer block + stats + real table +
  methodology + attribution in build-time HTML. (a/b)
- ■ Deep-linkable states as SSG routes rendering that state's data in HTML. (a/b)
- ■ Static preview image as LCP; map lazy-hydrates. (b)
- ■ No critical content gated behind interaction or scroll-loading. (a/b)
- ■ JS-off test passes: view-source contains the data story. (a/b)

## AI-visibility (run at launch and quarterly)

- ■ robots.txt: retrieval agents allowed (Googlebot, Bingbot, OAI-SearchBot,
  ChatGPT-User, PerplexityBot, Claude-User, Claude-SearchBot); training-bot
  lines per portfolio policy; `scripts/check_robots.py` passes. (a)
- ■ Host-level bot blockers checked (Cloudflare AI toggle, WAF rules). (a/b)
- ■ Bing Webmaster Tools: site verified, sitemap submitted. (b)
- ■ llms.txt NOT relied on; time goes to GEO levers instead. (a)
- □ GA4 AI channel group configured (regex above Referral; expect
  undercount); GSC Generative-AI report monitored. (a/b)
- □ AIO/AI citation share tracked as a KPI per site alongside rankings. (b)

## Escalation

Any request that collides with the to-avoid list (scaled near-dupes, doorway
pages, fake authors, scraped aggregation) → google-ai-content-policy
hard-stop flow. Evidence disputes → references/evidence.md first, fresh
sources second, then update the skill via a diff — never a silent exception.
