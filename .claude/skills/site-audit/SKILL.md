---
name: "site-audit"
description: "Audit-then-fix runbook for an existing site and the 80-site review sweep — production check, full inventory, prioritized findings, fix waves, close-out. Use when reviewing or remediating a live site."
---

# site-audit — review and fix an existing site

For the portfolio review sweep and any "audit this site" request. Audit everything first, then fix in waves (caloriedeficitcalc rule). Never fix while inventorying.

## Inputs — ask once, in one message
- The site's DEVLOG.md (run the devlog bootstrap if the repo has none).
- GSC: Performance export (16 months, pages and queries) and the Pages (indexing) report. Bing Webmaster export if there is one.
- GA4, last 28 days: landing pages and countries, when the site runs ads or is applying.
- What is live: domain, Vercel project, Raptive status.

## Phase 0 — is production the code we think it is?
- Deployed commit vs origin/main vs local HEAD (hvacbase served a deployment 162 commits behind; calculatemybmi's Vercel project wasn't connected to git).
- Vercel project linked to the right repo, production branch main, last deploy succeeded (an invalid vercel.json rule fails silently), commit author email matches the GitHub account (otherwise pushes never deploy).
- Fix this first. Auditing code that isn't live wastes the pass.

## Phase 1 — inventory every URL
- Union of the sitemap, the app route tree (dynamic routes with their params), the GSC Pages export and an internal-link crawl. Flag sitemap-only, route-only and GSC-only URLs.
- Per URL: type (tool, calculator, article, data page, hub, legal), 16-month clicks and impressions, index status, word count, last change.
- The homepage and every tool and calculator page are in scope. They are the pages that get skipped (calculatemybmi: 8 never swept).

## Phase 2 — findings, no fixes yet
Severity: P0 breaks trust or rankings, P1 hurts, P2 polish.
1. Integrity (P0): data-sourcing audit mode — every figure, citation, quote, DOI and ISSN against its primary source. The box can't verify figures; chat does (CC mis-sourced the calculatemybmi homepage stat).
2. Fabrications (P0): personas, testimonials, experts, fabricated named-source statistics.
3. Accuracy drift (P0): rules, laws and rates that changed after writing (thegreenwatt: the 30% credit dropped to 0% after the OBBBA repeal took effect Dec 31, 2025).
4. Advice risk (P0 on YMYL): medical, legal or financial advice past educational framing.
5. Link health (P1): 404s, redirect chains, orphans, dead outbound citations.
6. Thin, duplicate, cannibalizing (P1): pages competing for one query or carrying no unique data. Plan: consolidate first (merge plus 301/308), then rebuild survivors (calculatemybmi: 33 posts → 16).
7. Technical SEO (P1): titles and meta, schema validity, canonicals, robots, sitemap parity, internal links, content rendered client-side that should be server-rendered (seo-visibility is the rulebook).
8. Trust frame (P1): the author-identity standard from raptive-ready; About, Contact and Privacy matching the real stack; footer; favicon; custom 404.
9. Mobile and render (P1): mobile nav on every page, no overflow at 390 px, tables scroll-wrapped, tooltips and SVGs intact. The owner's phone test is the final word; automated checks have missed big errors before.
10. Search reality (P1): queries at positions 8–20 with real impressions (title and content upgrades), pages whose impressions collapsed, queries lost to AI Overviews (populationpyramids), branded vs non-branded split.
11. Prose (P2): anti-slop-prose review mode on the top pages by clicks.
12. Design (P2): Impeccable audit on the main templates.

## Phase 3 — fix waves
- Order: P0 integrity → consolidation and redirects → trust frame → technical SEO → mobile → prose and design.
- One Claude Code prompt per wave, in devlog format: ID, REPO GUARD, definition-of-done proof, DEVLOG step.
- Verify each wave's diff against the instruction, not the report. A fix that was instructed but never executed is the most common failure (calculatemybmi Phase 1b).
- Redirects: one hop, permanent, exact trailing-slash form (Vercel matches redirect sources strictly on the trailing slash).
- Push a wave only after the previous one is verified. Where indexing is fragile, hold each wave until GSC shows the previous one indexed (3delevationmap rule).
- After deploy: GSC Validate Fix for stale 404s that are now redirects.
- No exact number goes back on a page unless a primary source confirms it (hvacbase rule).

## Phase 4 — close
- Re-run Phase 0 and spot-check every P0 fix on production.
- DEVLOG AUDIT entry: pages audited; P0/P1/P2 found and fixed; redirects added; the owner's phone-test result; next review date.
- One row in the sweep tracker: site · date · pages · open P0 · status (audited / fixing / done / blocked).

## Rules
- Audit every page, not a sample. Report counts so nothing drops out silently.
- Don't rewrite live pages without an audit finding behind the change.
- Raptive sites, or sites about to apply, end with a raptive-ready pass.
- CC prompts follow devlog; prose fixes follow content-page and anti-slop-prose.