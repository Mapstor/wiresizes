# Trust frame spec — wiresizes.com (applies site-wide)

Status: decisions proposed in chat 2026-10-19; owner confirms in DEVLOG (§2 Decisions).
Rule: nothing on this page set may claim a person, credential, review, endorsement, user count, response time or office that does not exist.

## Identity (render exactly; one spelling everywhere)
- Author / editor: **Marko Visic** — BSc Physics, Faculty of Mathematics and Physics, University of Ljubljana (Slovenia).
- Physics credential only on this site (pharmacy degree left off, same as hvacptcharts.com).
- sameAs: https://www.linkedin.com/in/marko-visic/  (visible rel="me" link on /about)
- Publisher and data controller: **Moving Data Systems d.o.o., Maribor, Slovenia** (EU) — the same wording the owner chose for populationpyramids.org in Oct 2026: company name and city, no registration number or VAT ID. Contact for privacy requests: the single contact address below.
- He is **not** a licensed electrician or professional engineer. Say so once, plainly, on /about and in the page-footer disclaimer line. Never use "licensed", "certified", "master", "PE", "reviewed by electricians" or similar.

## Byline block (every content and tool page, visible, above the fold on articles, below the tool on tools)
- "By Marko Visic, BSc Physics · Updated {date of last substantive change} · Sources below"
- Date = last commit date that touched that page's content or its data file (not build date, not auto-refresh). "Reviewed" appears only when a review is logged in DEVLOG with a date.
- Link the name to /about.

## /about (rewrite from zero)
Sections (reader-facing, plain):
1. Who runs this site — Marko Visic, physics background; what that covers (resistance, heat, temperature coefficients, unit conversion) and what it does not (code interpretation is cited to NFPA 70, not claimed as expertise). Not a licensed electrician.
2. What the numbers are based on — NFPA 70 (NEC) tables by edition; NIST Handbook 100 copper wire tables; NIST SP 811 conversion factors; manufacturer installation manuals for equipment pages. Link /methodology.
3. Which NEC edition — pages show the 2023 NEC numbers and flag 2026 renumbering where it changed; state adoption differs — link /guides/nec-code-compliance.
4. How this site is made — one paragraph: drafting is AI-assisted; every figure comes from the cited source files in the site's data layer; Marko checks the pages and keeps a dated correction log. (Raptive-recommended disclosure.)
5. Corrections — how to report (the single contact address), and a dated public changelog of substantive corrections (start it with the Oct 2026 rebuild entry).
6. Publisher — Moving Data Systems d.o.o. (link /privacy for controller details).
Delete entirely: "reviewed by licensed electrical engineers and master electricians", "Industry Recognition" quotes (NECA/IAEI/EC&M/IEEE), "100,000+ calculations/month", "99.9% uptime SLA", "±0.1% precision", "Accuracy Guarantee", "monthly code review cycles", tool-count claims, "built by electrical professionals", roadmap/promises with deadlines.

## /contact
- One address: contact@wiresizes.com (a forwarding alias to the owner's inbox — no mailbox; the owner sets it up at the DNS host). Nothing else.
- Delete: emergency@, consulting@, legal@, education@, international@, "24/7", "2-hour response guarantee", "Headquarters: United States", regional desks, hours tables.
- One line: "For electrical emergencies call 911 or your utility. This site cannot give site-specific advice."

## /privacy
- Controller: Moving Data Systems d.o.o., Maribor, Slovenia + contact@wiresizes.com. No "DPO" unless one is appointed.
- List exactly what runs (verify in code: GA4? Vercel Analytics? Raptive? any consent tool?). Nothing that doesn't run.
- GDPR rights + lawful basis; Last updated = real date.

## /terms
- Operator Moving Data Systems d.o.o.; governing law Slovenia; "as is"; no professional relationship.

## /disclaimer
- Keep the substance (reference values, verify with AHJ/licensed electrician, local amendments, edition differences). Remove all "24/7 / emergency@" content.

## Site-wide removals (header, footer, metas, OG/Twitter, JSON-LD)
- "Trusted by 50,000+ Electricians", "Trusted by over 100,000…", "Used by over 50,000 professionals monthly", "Used in 50+ Countries", "30+ Professional Tools", "Professional Grade", "Industry Standard", "NEC Code Compliant", "NEC 2023 Compliant", "FREE Always", "used by licensed electricians", per-tool usage % bars, "50,000+ engineers educated", read-time badges with levels, emoji in headings.
- Replace the generic "Industry Standards & Authority Links" footer block (homepages of NFPA/UL/CDA/AA/IAEI/NECA) with: link to /methodology and the NFPA trademark notice.
- NFPA notice (footer, /methodology, the two NEC table pages): "NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the National Fire Protection Association. wiresizes.com is not affiliated with or endorsed by NFPA."
- Remove "Download NEC Table 310.16 PDF". Present values as our own data tables with attribution; never reproduce NEC text beyond short quotes.

## Schema (site-level)
- Organization: Moving Data Systems d.o.o. (name, url https://www.wiresizes.com, sameAs only real profiles).
- Person: Marko Visic — alumniOf University of Ljubljana (Faculty of Mathematics and Physics), hasCredential "BSc Physics" (EducationalOccupationalCredential), knowsAbout ["electrical conductor physics","unit conversion","wire resistance"], sameAs LinkedIn.
- Article/WebPage author → Person; publisher → Organization. Dataset on the AWG chart and NEC 310.16 pages. SoftwareApplication (applicationCategory "UtilitiesApplication", offers price 0) on tool pages only if it matches visible content. No aggregateRating, no Review, no HowTo; FAQPage optional (no rich result).

## New page: /methodology (generated from research/data-sources.csv)
- One section per data domain: what it is, publisher, edition, deep link, retrieved date, what we compute from it (formula), known limits/gaps. Attribution strings come from the registry, never hand-typed.
