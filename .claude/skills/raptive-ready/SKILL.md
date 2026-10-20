---
name: raptive-ready
description: Raptive readiness gate for a site — hard requirements, red flags from past declines, trust and author-identity standard, readiness pass, onboarding. Use before applying or reapplying to Raptive.
---

# raptive-ready — get a site through Raptive review

Raptive declines without giving a reason (two sites in this portfolio, hvacbase and calculatemybmi; calculatemybmi was accepted after a full-site remediation). Several people review each application by hand and about 18% advance. The traffic minimum is 25,000 monthly pageviews unless the owner's Raptive tier waives it for additional sites (Platinum Elite does); either way, review turns on quality, trust and setup. "The owner" and "the author" are the people named in the site's DEVLOG §1.

## Hard requirements (Raptive's published rules, checked Oct 2026)
- Analytics: GA4 installed once and counting correctly. A hardcoded tag plus GTM or a plugin double-counts. Raptive gets view-only GA access with the application.
- Traffic: most of it from the US, Canada, UK, New Zealand and Australia. No purchased traffic for ad arbitrage, no non-human, fraudulent or suspicious sources.
- Content: original, engaging, brand-safe, in the creator's own voice. Prohibited: copyright infringement, low-value content, deceptive practices, misrepresentation, derogatory, dangerous or shocking, illegal, explicit.
- AI: allowed with meaningful human involvement — reviewed, fact-checked and edited by a person. "Little-to-no meaningful human involvement" is a listed violation. Disclosure is recommended when AI is used extensively.
- Domain: no advertising infringements with major ad providers. One application per domain.

## Red flags from this portfolio's own declines and remediations
1. Any wrong number. One wrong figure can sink the review. Every figure traces to the data-sourcing registry; an unconfirmed figure is removed, not softened.
2. Fabrications: invented personas, testimonials, experts or quotes; statistics attributed to a source that doesn't contain them; fake DOIs or ISSNs (hvacbase: 508 personas, 118 fabricated named-source stats).
3. Dead ends: 404s, orphan pages, dead outbound citations (hvacbase: 215 orphans, 133 dead citation URLs).
4. Thin or duplicate pages. Consolidate first (merge and 301/308), then rebuild the survivors. Never pad.
5. Policy pages that don't match the stack (calculatemybmi claimed AdSense 7+ times; it wasn't installed). The privacy policy names exactly what runs: GA4, Raptive, Raptive CMP, any affiliate program.
6. Missing trust frame: no About, author, contact, footer links or favicon (3delevationmap readiness pass: favicon, site-wide footer, trust pages).
7. Broken mobile: missing mobile nav (calculatemybmi: 13 of 29 pages), sideways scroll, clipped text. Reviewers use phones.
8. Advice beyond competence: medical, legal or financial advice past educational framing (earthquaketracker: advice layer cut, ~118K words, 32 routes).
9. Stale production: the live deploy isn't the reviewed code (hvacbase served a deployment 162 commits behind main).
10. Identity drift: pen names, inconsistent spelling of the author's name, different credentials page to page.

## Trust and author-identity standard (every site)
- Byline: the author named in DEVLOG §1, spelled one way (ASCII) on every page of the site. No pen names.
- Credentials: show the author's credentials that fit the site's topic (for example pharmacy for health and nutrition, physics for engineering and weather); all of them on the About page. Use the exact standing the author holds; never upgrade it to "registered" or "licensed".
- Person schema from §1: name, alumniOf, hasCredential, knowsAbout, sameAs (e.g. LinkedIn), plus a visible rel="me" link.
- Dates mark real events only. "Updated" when content changed. "Reviewed" only when a review happened and is logged in DEVLOG. Never auto-refresh dates.
- AI use: one plain "How this site is made" paragraph on About or the methodology page — AI-assisted drafting, every figure checked against primary sources, reviewed by the author. (Default from Raptive's recommendation; the owner can veto.)
- YMYL topics: educational framing, no diagnosis, dosing or treatment advice, link the authority (CDC, NIH, USGS, EPA …) for decisions.

## Readiness pass — in this order
1. Production = main: the deployed commit matches origin/main. Fix before anything else.
2. Inventory every URL: sitemap, route tree and GSC pages, including the homepage and every tool or calculator page (calculatemybmi's 8 tool pages were never swept).
3. Integrity: data-sourcing audit mode on every page — figures, citations, quotes, DOIs. Fix or remove.
4. Fabrication sweep: personas, testimonials, experts, unattributed stats.
5. Link health: 404s, orphans, dead outbound links.
6. Thin and duplicate pages: consolidation plan with redirects.
7. Trust frame: About (standard above), Contact with a working on-domain address, Privacy matching the stack, Terms, Methodology/sources, footer linking all of them, favicon and manifest, custom 404.
8. Mobile: the owner's phone test plus the 390 px Impeccable scan on the homepage, the top tool and the top article.
9. Prose: anti-slop-prose review on the top pages.
10. Human-review evidence: the author reads the top 30 pages by traffic (all pages if fewer) and logs the date and URLs in DEVLOG. That is the human involvement Raptive asks for, on record.
11. Analytics: single GA4 install, data flowing, last 28 days majority US/CA/UK/NZ/AU, no bot spikes (WAF geo rules on).
12. Apply: one application per domain, view-only GA access granted.

## Onboarding after acceptance (portfolio pattern)
- Raptive CMP as the only consent mechanism, Consent Mode v2 through it. Remove any other banner.
- /ads.txt redirects to Raptive's hosted file.
- Raptive script per their instructions. Design work never moves ad containers.
- Ad Block Recovery: declined (portfolio default).
- After ads go live, re-check CLS and INP on the top pages.

## After a decline
No reason will come. Run the full readiness pass again, fix everything it finds, log the evidence in DEVLOG, then reapply. Cosmetic changes don't justify a reapplication.

## Output
- Readiness report: hard requirements (pass/fail with evidence), red flags (URL · issue · fix), ordered fix list, go/no-go.
- Fixes go to Claude Code as prompts in devlog format. Owner-only steps (GA access, phone test, human review, the application form) go in the owner's manual list.
