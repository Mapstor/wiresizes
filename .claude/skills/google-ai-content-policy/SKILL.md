---
name: google-ai-content-policy
description: Use this skill BEFORE generating, templating, or scaling any web page, content cluster, meta description, title, alt text, structured data, or programmatic SEO template intended for a public website. Use this skill whenever the task involves creating pages at scale (more than a handful), designing pSEO templates, planning URL patterns, writing AI-assisted editorial content, generating fan-out keyword variants, or making content-strategy decisions for any site in the portfolio. Trigger this skill on phrases like "generate pages", "programmatic SEO", "create a template", "scale content", "write articles for", "build out a content cluster", "fan-out keywords", "long-tail variants", "write meta descriptions for", or whenever a new pSEO site is being designed. The skill enforces Google's Search Essentials, spam policies (especially scaled content abuse), and the AI optimization guide. HARD-STOP enforcement: when a policy-risky pattern is detected, refuse to generate until the user explicitly approves the risk.
---

# Google AI Content Policy — Hard-Stop Enforcement

This skill is the gatekeeper for any AI-generated content shipped to public websites in Marko's portfolio. The portfolio's monetization (Raptive, AdSense) and AI/LLM citation visibility both depend on staying on the right side of Google's scaled content abuse line. Sites in scope include but are not limited to: every Next.js property on Vercel, every WordPress site on SiteGround, every domain in the Namecheap portfolio.

## Core principle

Google does NOT prohibit AI-generated content. Google prohibits **scaled content without added value**, regardless of how it's produced. The test is never "was AI used" — the test is "does this page exist primarily to manipulate rankings, or because it genuinely helps a user?"

If the answer to "what unique data, perspective, format, or insight does this specific page add that the user couldn't get from existing sources?" is weak, the page is at risk.

## When this skill activates

Run the pre-flight checklist below BEFORE generating any of:

- Programmatic page templates (any pattern that will produce more than ~5 pages from one template)
- Editorial articles, blog posts, "how to" content, listicles
- Meta titles, meta descriptions, OG tags at scale
- Image alt text generated at scale
- Structured data (JSON-LD) generated at scale
- Author personas, author bios, E-E-A-T signals
- Content cluster plans, topic maps, internal linking schemes
- URL pattern proposals for new sites
- New site concepts before scaffolding begins

If the user request is a single one-off page, a code task, a data pipeline, or a non-content task, this skill does not apply — proceed normally.

## Pre-flight checklist — the non-commodity test

Before generating, Claude MUST answer all six questions explicitly in the response. If any answer is weak, vague, or "this page exists because we templated it," HARD-STOP.

1. **Unique data slice.** What specific verified data, computed metric, or first-party signal makes THIS page different from every other page in the template? (e.g., "this page renders the actual population pyramid for Slovenia from UN WPP data" = strong; "this page targets the keyword 'Slovenia demographics'" = HARD-STOP.)

2. **Non-commodity insight.** Does the prose go beyond what a generic AI model could produce from the page topic alone? Per Google's AI optimization guide, "7 Tips for First-Time Homebuyers" is commodity. "Why We Waived the Inspection & Saved Money: A Look Inside the Sewer Line" is non-commodity. Which side is this page on?

3. **User intent match.** What query is this page answering, and would a real user finishing this page feel their question was resolved — or would they immediately need to keep searching?

4. **Verified-or-omitted compliance.** Are all factual claims, numbers, dates, prices, and statistics either sourced from a verified dataset or omitted? No fabricated filler, no plausible-sounding hallucinations. (This is Marko's existing standing rule across the portfolio — reinforce it here.)

5. **Fan-out check.** Is this page a genuine new piece, or is it a keyword-variant of an existing page? Patterns to flag as HARD-STOP:
   - `/{topic}` and `/{topic}-2026` and `/best-{topic}` and `/{topic}-near-me` all rendering substantially similar content
   - `/x-vs-y` pages where x and y are interchangeable and the comparison adds no original analysis
   - Locality pages (`/topic-in-{city}` × 1000) where the only difference is the city name swapped in
   - Question-variant pages targeting fan-out queries the user might ask, generated to capture each variant
   - Google explicitly calls this out in the AI optimization guide as scaled content abuse.

6. **Format/UX differentiator.** Does this page offer something a competitor's plain-text article can't — interactive visualization, calculator, map, comparison tool, original chart, downloadable resource? (UX-as-differentiator is the portfolio's core playbook; if the answer is "no," ask whether the page deserves to exist.)

## Hard-stop triggers

If ANY of these are present, STOP and surface to Marko before generating a single page:

- **Pure prose pages with no underlying unique data.** Any template that produces 100+ pages of mostly-text content where the only variable is a keyword or place name in the heading.
- **Scraped/synonymized content.** Any plan that involves taking source X, running it through paraphrasing, and republishing.
- **Stitched content.** Combining paragraphs from multiple sources without genuine added analysis.
- **Doorway patterns.** Multiple URL variations (`/cheap-x`, `/best-x`, `/x-deals`) all routing user value to the same destination.
- **Site reputation abuse.** Adding third-party-style content to an established site purely to capitalize on its ranking signals (Marko has noted lekarnar.com specifically — never publish third-party-shaped content on it that wouldn't naturally belong on a pharmacy site).
- **Manipulation of fan-out queries.** Generating a separate page for every "people also ask" variant.
- **Editorial overlays on data sites with no real expertise.** Health advice, legal advice, medical claims, financial recommendations wrapped around data pages, written by an AI persona with no demonstrable expertise. (Especially YMYL topics.)
- **Author personas making expertise claims.** A persona like "Jonathan S." can exist as a byline, but never have the persona make first-person experience claims ("I tested this," "When I visited") that aren't true. That's deceptive.

When hard-stopping, format the response as:

```
🛑 GOOGLE POLICY HARD-STOP

Detected pattern: [name the pattern]
Risk: [which spam policy this touches — scaled content abuse, doorway, site reputation abuse, etc.]
Why this fails the non-commodity test: [specific explanation]

Options to proceed:
  A) [concrete reshape that would make the pages compliant]
  B) [scope reduction — e.g., generate 20 pages instead of 2000]
  C) Override — confirm you accept the risk and want to proceed anyway

Awaiting explicit go before generating anything.
```

Do not generate the content. Wait for Marko's explicit response.

## Required outputs for any AI-generated content

When generation IS approved and proceeds, every page or batch must satisfy:

### Accuracy and metadata

- Titles, meta descriptions, structured data, and image alt text are accurate, specific to the page's actual content, and not templated boilerplate with a variable swapped in.
- Structured data validates against schema.org and Google's structured data guidelines. No fake `aggregateRating`, no fabricated `Review` entities, no `Author` with claimed credentials that don't exist.
- No keyword-stuffed meta descriptions. Each one is written for a human.

### Provenance (optional but recommended)

Google's guidance: "consider adding information on how your content was created in a way that makes sense for your audience." This is not required, but for editorial-shaped pages on data sites, a brief note in the footer or author box explaining "this page is generated from [dataset name], updated [date]" satisfies the spirit of E-E-A-T transparency.

### E-commerce specifics (applies to lekarnar.com and any future commerce work)

Per Google Merchant Center policy:
- AI-generated product images must include IPTC `DigitalSourceType: TrainedAlgorithmicMedia` metadata.
- AI-generated product titles and descriptions must be specified separately in the feed and labeled as AI-generated where the feed schema supports it.
- Never cite competitor pharmacies (Marko's standing rule: never cite moja-lekarna.com; never self-cite lekarnar.com as a source in published content).

## What you don't need to do (mythbusting)

Per Google's own AI optimization guide, these are NOT required and Claude should not propose them as fixes:

- `llms.txt` files or other "AI-specific" markup files.
- "Chunking" content into tiny pieces "for AI to better understand it."
- Rewriting content in a special way "for AI search."
- Seeking inauthentic mentions, fake reviews, paid mentions.
- Excessive structured data beyond what the page actually justifies.

If Marko asks for any of these, push back — they're commonly-recommended hacks that Google has explicitly said are ineffective.

## Portfolio-specific notes

- **Data-first sites** (populationpyramids.org, populationdensitymaps.com, bridgereport.org, earthquaketracker.org, worldtradeflows.com, walkabilityscore.org, viewmygpx.com, trailvisualizer.com, mytravelmaps.org, flyto.city, simplemaplab.com, mapwithradius.com, volcanosatlas.com, worldofaquariums.com, barometricpressure.org, powderforecast.org): The "unique data slice" question (#1) is usually answered cleanly. The risk is the editorial wrapper. Keep prose tight, factual, and tied to the data on the page.

- **Editorial/article sites** (hvacbase.org, content arms of any site): Question #2 (non-commodity insight) is the live wire. Default to HARD-STOP unless the article has either (a) original research/data, (b) a genuine specific perspective, or (c) a format/calculator/tool a plain article can't offer.

- **E-commerce** (lekarnar.com): Follow Merchant Center AI labeling rules. Never publish editorial-style content that competes with pharmacy editorial sites — that's site reputation abuse adjacent.

- **WordPress portfolio**: Same rules apply. AdSense publisher ID `ca-pub-3093026304369835` is shared; one site getting flagged for scaled content can affect the others.

## When in doubt

Default to HARD-STOP. The cost of a false-positive (Marko pauses, reshapes, ships) is a day. The cost of a false-negative (a site gets nuked in a core update or HCU) is months of traffic and Raptive revenue across a portfolio.

The bar: "Would a Google search rater, reading the Search Quality Rater Guidelines section 4.6.5 and 4.6.6, rate this page as adding meaningful value?" If you can't answer yes with a straight face, hard-stop.
