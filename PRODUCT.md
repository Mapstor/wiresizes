# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two readers share every page (owner, 2026-11-13: serve both, answer first, depth below):

- Homeowners and DIYers who searched one question (the size of a gauge, what wire a circuit or service needs, a table value) and want the number in seconds, in plain words.
- Electricians, apprentices and other trade readers who need the exact code column, the edition, the full table and the source, further down the same page.

Most arrive from US search results (research/page-specs.md: Bing keyword export and Google Search Console, 2026-10). They read on phones and desktops.

## Product Purpose

wiresizes.com publishes wire gauge charts, NEC table values and calculators for sizing conductors (public/llms.txt). It exists so a reader can find a correct, sourced wire size without buying the code book or trusting an unsourced chart. Success means more US readers find the answer here, trust it, and come back. The site is free to read and is funded by display ads; ad placement is left to the ad network (Raptive) rather than designed page by page.

## Positioning

Confirmed by the owner on 2026-11-13 as what a visitor should remember the site for:

- **Complete tables.** Full ranges where other charts stop: AWG 4/0 to 40 plus 250 to 2,000 kcmil, all 30 rows of NEC Table 310.16, both correction tables.
- **A source on every number.** Each value names its primary source where it appears (NIST, NFPA, IEC, state records), the Sources list on every page links them, and /methodology gives each formula.
- **Drawings from real data.** Pictures people would share or link to, each one drawn from the site's own numbers rather than illustrated.

## Operating Context

- A reader lands on one page from search with one question, scans for the number, and often checks a neighboring row or the code column before leaving.
- Pages are reference documents and calculators: tables, short explanations, worked examples, FAQs and a Sources list.
- The numbers come from verified data files (data/verified/*.json), research/golden-cases.json and the calculation engines in src/lib/calculations; the source registry is research/data-sources.csv.
- Work on the site runs through DEVLOG.md (the notebook), qa/pages.csv (the per-page QA tracker) and the build gates in scripts/.

## Capabilities and Constraints

- Charts and guides: AWG chart, NEC Table 310.16, NEC edition by state, service and EV guides, power guides. Calculators are rebuilt from verified sources; 15 tools stay withdrawn until their sources are verified (DEVLOG D-02).
- No number appears on a page unless it traces to a verified data file, a golden case or an engine; a tool goes offline rather than show an unverified number (DEVLOG §4, D-02).
- NFPA owns the NEC text: values are shown as data with attribution, quotes stay short, NEC section references come only from research/nec-sections-allowlist.csv, and every NEC page carries the NFPA trademark notice.
- Fixed rules for every page (owner, 2026-11-13):
  - Fast on phones: movement and pictures never delay the main numbers.
  - US English, with inches, feet and AWG first and metric second.
  - Readable for everyone: text contrast of 4.5:1 or better, underlined links, and full keyboard and screen-reader use.
- Analytics run behind a consent banner for visitors from the EU, the EEA, the UK and Switzerland (DEVLOG D-10).
- The repository is public: no private notes, account details or deployment IDs in files or commits (DEVLOG §4).
- Undecided: when Raptive's ad script goes live; the site has none yet (DEVLOG §0).

## Brand Commitments

- Name: WireSizes, at wiresizes.com.
- Author: "By Marko Visic, BSc Physics" on every content and tool page, with the update date (DEVLOG D-03, D-18).
- Publisher: Moving Data Systems d.o.o., shown with its legal details on /about, /contact, /privacy and /terms (DEVLOG D-03).
- Voice: plain, exact and dated; no hype, no claims the data does not support (anti-slop-prose skill).

## Evidence on Hand

- Verified data: data/verified/*.json (NIST Handbooks 100 and 109, NFPA 70 2023 tables, IEC 60228 sizes, state NEC adoption records).
- Source registry: research/data-sources.csv; worked cases: research/golden-cases.json (214 cases).
- Public proof pages: /methodology (sources and formulas), /about (author, sources, dated corrections).
- Absent, and never to be invented: user counts, testimonials, endorsements, expert reviews, response times. The 2026-11-02 audit removed the ones the site used to show.

## Product Principles

1. Answer first, depth below: the number a homeowner needs leads, and the code column, edition and source an electrician needs follow on the same page.
2. Every number carries its source where it appears; when a number cannot be verified, it does not appear.
3. Complete over convenient: full ranges and every row, not the popular subset.
4. A picture earns its place by being built from the data it explains.

## Accessibility & Inclusion

Text contrast of 4.5:1 or better, links underlined, every control usable by keyboard and screen reader (owner, 2026-11-13).
