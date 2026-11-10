# WSZ-004a TRUSTFRAME: report

_2026-11-03 · `main` @ `4aa27f9` (127f98f, 268a880, 4aa27f9; the DEVLOG commit follows) · origin/main = `af00b7c` · final build BUILD_ID `U1y6VvNsFixqD5ZTZKJRT`. The prompt: steps 1–4 and 6 of `research/WSZ-004.next.txt` with chat's answers (§7 of `research/WSZ-017-handoff.md`)._

## 0. Summary

- **Page dates (D-17):** `src/data/page-dates.json`, 32 routes. published is 2026-02-22 on every route. modified is 2026-11-03 on 28 routes and 2026-11-02 on /contact, /privacy, /terms and /disclaimer. The sitemap, the Article and Dataset dates, the byline and the "Last updated" lines read it. The build no longer reads git, file times or the clock for a page date.
- **Byline (D-18):** on the 15 calculators (below the tool, with " · Sources below") and the 9 guides (under the H1). The text is "By Marko Visic, BSc Physics · Updated November 3, 2026". It appears on no other page.
- **Schema:** one identity module, `src/lib/identity.ts`. The Organization is Moving Data Systems d.o.o. and the Person is Marko Visic. Article, Dataset and WebApplication have author → Person and publisher → Organization. Each JSON-LD block that references a node also prints it. The five trust pages now have WebPage and BreadcrumbList. Root metadata: author and creator Marko Visic, publisher Moving Data Systems d.o.o.
- **Sources on the eight converters:** power-definitions on all of them except BTU, plus nist-sp811-conversions on amps to watts and BTU. Now all 15 calculators have Sources.
- **/about:** the line "Marko Visic on LinkedIn" (rel="me"). Corrections render from `src/data/corrections.json` as "November 2, 2026: Audited every page. …".
- **Icons (D-19):** /icon.svg is now `public/icon.svg`. `public/icons/icon-192.png` and `icon-512.png` are rendered from it with next/og. /favicon.ico is a 2,410-byte ICO holding 16, 32 and 48 px images; the old one was the 25,931-byte Next.js triangle. Each icon link appears once.
- **Gate b (D-20):** text inside `[data-name]` is skipped. `numberTrace.enforce` now holds /_global-error, /_not-found, /about, /contact, /disclaimer, /privacy and /terms.
- **Verify:** clean build passes (postbuild: check-banned 0 hits; check-structure 23/23; gates a, b and c pass). tsc 0 errors. `npm test` 345 pass, 0 fail, 0 skipped, "golden: 214 of 214 cases run". check_sources: RESULT: OK (13 warnings). Normalized snapshot comparison: only the allowed body-text differences (§4). /favicon.ico served at 2,410 bytes, and its three images decode (§6).
- **6 CHAT questions** (§7).

## 1. Page dates

`src/data/page-dates.json`, read by `src/lib/page-dates.ts` (pageDates, articleDates, formatDate). formatDate turns "2026-11-03" into "November 3, 2026" from the string itself, without a Date object.

| Route | published | modified | Why modified |
|---|---|---|---|
| / | 2026-02-22 | 2026-11-03 | WSZ-003b body text (report §4), live with the af00b7c push |
| /calculators | 2026-02-22 | 2026-11-03 | same |
| /guides | 2026-02-22 | 2026-11-03 | same |
| /calculators/wire-size-calculator | 2026-02-22 | 2026-11-03 | same (WSZ-003c 4bfdffd too) |
| /calculators/voltage-drop-calculator | 2026-02-22 | 2026-11-03 | same |
| /calculators/ampacity-calculator | 2026-02-22 | 2026-11-03 | same |
| /calculators/ground-wire-calculator | 2026-02-22 | 2026-11-03 | same |
| /calculators/wire-resistance-calculator | 2026-02-22 | 2026-11-03 | same |
| /calculators/watts-to-amps-calculator | 2026-02-22 | 2026-11-03 | same, and this wave's Sources (commit day) |
| /calculators/amps-to-watts-calculator | 2026-02-22 | 2026-11-03 | same, and this wave's Sources |
| /calculators/volts-to-amps-calculator | 2026-02-22 | 2026-11-03 | same, and this wave's Sources |
| /calculators/kilowatts-to-amps-calculator | 2026-02-22 | 2026-11-03 | same, and this wave's Sources |
| /calculators/kva-to-amps-calculator | 2026-02-22 | 2026-11-03 | same, and this wave's Sources |
| /calculators/btu-to-watts-calculator | 2026-02-22 | 2026-11-03 | same, and this wave's Sources |
| /calculators/ohms-law-calculator | 2026-02-22 | 2026-11-03 | same, and this wave's Sources |
| /calculators/service-entrance-calculator | 2026-02-22 | 2026-11-03 | WSZ-003b |
| /calculators/three-phase-calculator | 2026-02-22 | 2026-11-03 | same, and this wave's Sources |
| /calculators/low-voltage-calculator | 2026-02-22 | 2026-11-03 | WSZ-003b |
| /guides/awg-wire-size-chart | 2026-02-22 | 2026-11-03 | WSZ-003b |
| /guides/nec-table-310-16 | 2026-02-22 | 2026-11-03 | WSZ-003b |
| /guides/nec-code-compliance | 2026-02-22 | 2026-11-03 | WSZ-003b |
| /guides/wire-size-for-100-amp | 2026-02-22 | 2026-11-03 | WSZ-003b |
| /guides/wire-size-for-200-amp | 2026-02-22 | 2026-11-03 | WSZ-003b |
| /guides/wire-size-for-ev-charger | 2026-02-22 | 2026-11-03 | WSZ-003b |
| /guides/electrical-power-calculations | 2026-02-22 | 2026-11-03 | WSZ-003b |
| /guides/single-vs-three-phase | 2026-02-22 | 2026-11-03 | WSZ-003b |
| /guides/power-factor-explained | 2026-02-22 | 2026-11-03 | WSZ-003b |
| /about | 2026-02-22 | 2026-11-03 | WSZ-003b ("promises" → "claims"), and this wave's LinkedIn line and Corrections date |
| /contact | 2026-02-22 | 2026-11-02 | WSZ-002 trust text (699de9a), live with the c96ca91 push |
| /privacy | 2026-02-22 | 2026-11-02 | same |
| /terms | 2026-02-22 | 2026-11-02 | same (WSZ-003b changed only its meta description) |
| /disclaimer | 2026-02-22 | 2026-11-02 | same |

The reflog lines used (`git reflog show --date=iso refs/remotes/origin/main`):

```
af00b7c refs/remotes/origin/main@{2026-11-03 15:09:45 +0100}: update by push
e689101 refs/remotes/origin/main@{2026-11-03 10:33:24 +0100}: update by push
c96ca91 refs/remotes/origin/main@{2026-11-02 12:10:06 +0100}: update by push
a99da4e refs/remotes/origin/main@{2026-05-13 21:00:24 +0200}: update by push
```

Which push carried each commit (`git merge-base --is-ancestor`):
- 74ac215 and 4bfdffd: in af00b7c, but not in e689101, c96ca91 or a99da4e. So they went live with the push of 2026-11-03 15:09 +0100, which is 2026-11-03 in UTC as well.
- 699de9a: in c96ca91, not in a99da4e. So it went live with the push of 2026-11-02.
- e689101 (WSZ-003a, 2026-11-03 10:33) changed no body text (its snapshot was unchanged), so it counts for no route.
- published: 6f58c08 (2026-02-22 15:47 +0100) added the page files and a676ef4 (2026-02-22 16:39 +0100) deployed them, both in a99da4e (answer 4).
- This wave's body-text changes (/about and the eight converters) take the commit day, 2026-11-03, which equals the date they already had (CHAT 4).

Removed:
- `src/lib/article-dates.ts`.
- `ArticleFAQSchema.tsx` (its two guides now use ArticleSchema).
- ArticleSchema's FALLBACK_DATE; its dates are now required.
- `scripts/wire-article-dates.mjs`, the one-off script that wired getArticleDates in.
- In sitemap.ts: the execSync git code, the mtime fallback and the build-time `new Date()`.
- `grep -rn "execSync|child_process|statSync|mtime" src` → none.

Left as they are (none is a page date):
- the footer's "© {current year}" (`new Date().getFullYear()`, as trust-pages-copy.md asks);
- the runtime timestamps on the error page and the print footer;
- `monthOf()` in AsOf.tsx, which formats a registry verified_date.

## 2. check-structure's new checks

The final build passes 23/23. Each new check was then broken on purpose by editing `src/data/page-dates.json` or a built page, and each file was restored byte-identical (`cmp`), after which the run passed 23/23 again.

| # | Check | Final build | Planted violation → result |
|---|---|---|---|
| 17 | page-dates.json has one entry per live route, real YYYY-MM-DD dates, published ≤ modified ≤ today (today = the date at UTC+14, so a local push day never counts as future) | PASS: 32 entries, 32 live routes | /disclaimer removed → FAIL "/disclaimer: no entry" (19 fails too). /terms published 2026-11-05 → FAIL "published 2026-11-05 after modified 2026-11-02" |
| 18 | every Article, Dataset and WebApplication: author = {"@id": Person}, publisher = {"@id": Organization}; Article and Dataset dates equal page-dates.json; one Article per live guide, one WebApplication per live calculator, Datasets on the two table guides | PASS: 9 Article, 2 Dataset, 15 WebApplication | /guides/nec-table-310-16 modified 2026-11-01 → FAIL on its Article and Dataset dateModified |
| 19 | every sitemap `<url>` has a `<lastmod>` equal to its route's modified date, and the sitemap lists every dated route | PASS: 32 URLs | same plant → FAIL |
| 20 | exactly the 15 live calculators and 9 live guides render one `[data-byline]`; its text is "By Marko Visic, BSc Physics · Updated {page-dates modified}" with " · Sources below" iff the page renders `<Sources>` (h2#sources); links /about (and #sources); `<time datetime>` = modified; "Sources below" appears nowhere else | PASS: 24 bylines, 15 with "Sources below" | byline removed on BTU → FAIL "0 [data-byline] blocks". " · Sources below" added to the NEC compliance guide → FAIL "page does not render <Sources>" |
| 21 | every live route but / has a BreadcrumbList from Home (position 1) to the page | PASS: 31 routes, 31 lists | /about's BreadcrumbList retyped → FAIL "/about: no BreadcrumbList" |
| 22 | Organization and Person carry their required keys and values (Organization without sameAs); every JSON-LD block that references one by @id prints it; every printed copy identical; no other Organization or Person node | PASS: 60 printed nodes, 60 block references | vatID changed and the Person removed on the AWG chart → FAIL ×3 (vatID, copy differs, block references the Person without printing it) |
| 23 | (beyond the prompt's list; D-19) each icon link once per page; the Organization logo and the manifest PNGs decode at their declared sizes; /favicon.ico (src/app/favicon.ico, as built) holds 16, 32 and 48 px PNG images; src/app/icon.svg and public/favicon.ico are gone | PASS: 289 icon links on 49 pages, 3 manifest icons | duplicate /favicon.svg link on /terms, the old triangle favicon, src/app/icon.svg recreated → FAIL ×3 |

Check 4 is unchanged; sameAs is not one of its keys. Check 13 follows 39 more links: the 24 byline links to /about and the 15 to #sources, 1,572 → 1,611. It has 73 targets, 71 before: the two new icon PNGs. /favicon.ico and /icon.svg were already targets through their other copies. Check 14 reads 8 more headings, the converters' Sources h2: 914 → 922.

## 3. Gates and their enforce lists

| Gate | Enforce list | Final build |
|---|---|---|
| check-banned | site-wide | 0 hits (137 phrases); 0 alert/confirm/prompt calls in 157 modules; 49 HTML files, 5 text files |
| check-structure | all checks | 23/23 |
| a, check-rendered-text | site-wide (no list) | 0 hits; 34 live pages; 6 allowlist lines in use |
| b, check-number-trace | numberTrace.enforce: /_global-error, /_not-found, /about, /contact, /disclaimer, /privacy, /terms | 0 untraced on the 7 enforced routes; 107 traced and 1,236 untraced site-wide; 1,324 before. The 88 now skipped are page names: the footer's "100 Amp" and "200 Amp" on 33 pages (66), the same two names in the guide navigation on /guides and the 9 guides (20), and one each in the related links of the 200 A and EV guides (2) |
| c, check-nec-refs | necRefs.enforce: the 28 routes of WSZ-003c, unchanged | 0 hits on the 28 enforced routes |

Gate b before and after on the newly enforced routes: /about, /contact, /privacy, /terms, /disclaimer and /_not-found went from 2 to 0 (the footer's two guide names), and /_global-error stayed at 0. Every other live route still has numbers to trace. A planted "20 A" on /about makes gate b fail (FAIL /about: "20 A"); after the restore it passes again.

`[data-name]` sits on these link labels:
- **Header:** the logo name and the three navigation links, desktop and mobile.
- **Footer:** the logo name, the 28 links of its five lists ("View All" links included), and the 5 site-page links.
- **Guides layout:** the "Guide Topics" names and the 4 "Quick Calculators" links.
- **Related-links blocks:** 90 label elements in the source of the 15 calculators (58) and the 9 guides (32, four of them inside `.map()` loops): the card `<h3>`, or the link itself for button links. Plus WithdrawnTool's "Related pages".
- **Descriptions** inside those cards stay counted.
- **Not marked:** the home page's and the hubs' own cards (CHAT 5).

## 4. Snapshot comparison

`node scripts/snapshot-pages.mjs /tmp/wsz004a/before` (baseline build of af00b7c) and `…/after` (the final build), then `diff -r`: 32 of 49 files differ, 1,342 diff lines. The 17 unchanged files are the 15 withdrawn pages, /_not-found and /_global-error. Snapshot lines are text runs and JSON-LD strings, so new links, spans and JSON-LD nodes add lines.

Normalized comparison (scratch script, not committed): each page's `<body>` text is joined into one line per block (inline tags do not split a block), and the before and after pages are diffed. 27 of 49 pages differ, 56 lines. Every one is on the allowed list:

| Route | Raw snapshot −/+ | Body text, normalized |
|---|---:|---|
| 15 calculators | 0 / 34–40 | + the byline "By Marko Visic, BSc Physics · Updated November 3, 2026 · Sources below" |
| of which the 8 converters | (39–40) | + "Sources", the item(s) ("U.S. EIA Glossary; U.S. DOE Motor Challenge fact sheets; NIST SP 330"; "NIST SP 811, Appendix B.8" on amps to watts and BTU), "Retrieved Oct 2026." |
| 9 guides | 9–11 / 31–60 | + the byline "By Marko Visic, BSc Physics · Updated November 3, 2026" |
| /about | 1 / 33 | + "Marko Visic on LinkedIn"; "October 25, 2026: Audited every page. …" → "November 2, 2026: Audited every page. …" |
| /privacy, /terms | 1 / 32 | "Last updated: October 25, 2026" → "Last updated: November 2, 2026" |
| /, /calculators, /guides | 10 / 13, 0 / 13, 0 / 13 | none (JSON-LD only) |
| /contact, /disclaimer | 0 / 30 | none (JSON-LD only) |

Links, inputs, selects, options and forms on all 49 pages: 2,515 elements before and 2,564 after, with no attribute changes. The 49 added are all links: 24 byline links to /about, 15 links to #sources, 7 + 2 Sources items, and 1 LinkedIn link.

JSON-LD differences, by node and key:
- **Dates:** only the two GuideClient guides changed, datePublished 2026-05-05 → 2026-02-22. Every other Article and Dataset date already matched page-dates.json in the box's full clone. Production showed 2026-11-02 on both dates of all nine guides (WSZ-017 §2.2).
- **Identity nodes:**
  - the Organization changes from "WireSizes.com" (logo /icon.svg declared 512×512, site description, empty sameAs) to Moving Data Systems d.o.o. with address, vatID and the icon-512.png logo;
  - the Person is new;
  - the Article author and publisher change from inline Organization nodes to @id references;
  - the WebApplication and Dataset gain author, and the Dataset becomes a @graph with the two nodes;
  - the home page's separate Organization block is now part of the WebSite graph;
  - /calculators and /guides print the Organization in their graphs.
- **Breadcrumbs:** new WebPage and BreadcrumbList (Home → page) on /about, /contact, /privacy, /terms and /disclaimer.

Head and meta differences (not in the snapshot):
- **48 pages:**
  - `<meta name="author">`, `creator` and `publisher` change from "WireSizes.com" to "Marko Visic", "Marko Visic" and "Moving Data Systems d.o.o.", plus a new `<link rel="author" href="https://wiresizes.com/about">`;
  - the five `<head>` icon links that repeated metadata.icons, the metadata `/favicon.ico sizes="any"` entry and `rel="shortcut icon" /favicon.svg` are gone;
  - `/favicon.ico?favicon.0b3bf435.ico 256x256` becomes `/favicon.ico?favicon.521692bb.ico 48x48`.
- **/_global-error:** the favicon link only.

## 5. JSON-LD as built

One node per line, exactly as the final build prints it.

#### /guides/nec-table-310-16 (2 JSON-LD blocks)

```json
{"@context":"https://schema.org","@graph":[
  {"@type":"Article","@id":"https://wiresizes.com/guides/nec-table-310-16#article","headline":"NEC Table 310.16","description":"Complete NEC Table 310.16 reference with copper and aluminum conductor ampacities at 60 °C, 75 °C, and 90 °C. Derating factors and correction calculations.","image":{"@type":"ImageObject","url":"https://wiresizes.com/opengraph-image","width":1200,"height":630},"author":{"@id":"https://wiresizes.com/about#marko-visic"},"publisher":{"@id":"https://wiresizes.com/#organization"},"datePublished":"2026-02-22","dateModified":"2026-11-03","mainEntityOfPage":{"@type":"WebPage","@id":"https://wiresizes.com/guides/nec-table-310-16"}},
  {"@type":"BreadcrumbList","@id":"https://wiresizes.com/guides/nec-table-310-16#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://wiresizes.com"},{"@type":"ListItem","position":2,"name":"Guides","item":"https://wiresizes.com/guides"},{"@type":"ListItem","position":3,"name":"NEC Table 310.16","item":"https://wiresizes.com/guides/nec-table-310-16"}]},
  {"@type":"Person","@id":"https://wiresizes.com/about#marko-visic","name":"Marko Visic","url":"https://wiresizes.com/about","alumniOf":{"@type":"CollegeOrUniversity","name":"University of Ljubljana, Faculty of Mathematics and Physics"},"hasCredential":{"@type":"EducationalOccupationalCredential","credentialCategory":"degree","name":"BSc Physics"},"knowsAbout":["conductor resistance","electrical units and conversions","wire gauge geometry"],"sameAs":["https://www.linkedin.com/in/marko-visic/"]},
  {"@type":"Organization","@id":"https://wiresizes.com/#organization","name":"Moving Data Systems d.o.o.","legalName":"Moving Data Systems d.o.o.","url":"https://wiresizes.com","address":{"@type":"PostalAddress","streetAddress":"Smolnik 62","postalCode":"2342","addressLocality":"Ruše","addressCountry":"SI"},"vatID":"SI94001154","logo":{"@type":"ImageObject","url":"https://wiresizes.com/icons/icon-512.png","width":512,"height":512}}
]}
{"@context":"https://schema.org","@graph":[
  {"@type":"Dataset","@id":"https://wiresizes.com/guides/nec-table-310-16#dataset","name":"NEC Table 310.16 — Allowable Ampacities of Insulated Conductors","description":"Complete NEC 2023 Table 310.16 ampacity data for copper and aluminum conductors at 60 °C, 75 °C, and 90 °C insulation temperatures, from 18 AWG through 2000 kcmil. Includes ambient-temperature correction factors per NEC Table 310.15(B)(1)(1) and conductor-bundling adjustment factors per NEC Table 310.15(C)(1).","url":"https://wiresizes.com/guides/nec-table-310-16","isAccessibleForFree":true,"author":{"@id":"https://wiresizes.com/about#marko-visic"},"publisher":{"@id":"https://wiresizes.com/#organization"},"inLanguage":"en-US","datePublished":"2026-02-22","dateModified":"2026-11-03","alternateName":["NEC 310.16 Conductor Ampacity Table","NEC 2023 Table 310.16"],"variableMeasured":[{"@type":"PropertyValue","name":"AWG / kcmil size","description":"Conductor size designation (AWG for 18–4/0, kcmil thereafter)"},{"@type":"PropertyValue","name":"Conductor material","description":"Copper or aluminum / copper-clad aluminum"},{"@type":"PropertyValue","name":"Insulation temperature rating","description":"60 °C, 75 °C, or 90 °C insulation system","unitText":"degree Celsius","unitCode":"CEL"},{"@type":"PropertyValue","name":"Allowable ampacity","description":"Maximum continuous current per NEC 310.16 at 30 °C ambient, ≤3 current-carrying conductors in raceway / cable / earth","unitText":"ampere","unitCode":"AMP"}],"keywords":["NEC 310.16","wire ampacity","AWG ampacity table","electrical conductor capacity","copper ampacity","aluminum ampacity","NEC 2023","electrical code"],"citation":"NFPA 70 (National Electrical Code) 2023 edition, Article 310, Table 310.16","spatialCoverage":{"@type":"Place","name":"United States"}},
  {"@type":"Person","@id":"https://wiresizes.com/about#marko-visic","name":"Marko Visic","url":"https://wiresizes.com/about","alumniOf":{"@type":"CollegeOrUniversity","name":"University of Ljubljana, Faculty of Mathematics and Physics"},"hasCredential":{"@type":"EducationalOccupationalCredential","credentialCategory":"degree","name":"BSc Physics"},"knowsAbout":["conductor resistance","electrical units and conversions","wire gauge geometry"],"sameAs":["https://www.linkedin.com/in/marko-visic/"]},
  {"@type":"Organization","@id":"https://wiresizes.com/#organization","name":"Moving Data Systems d.o.o.","legalName":"Moving Data Systems d.o.o.","url":"https://wiresizes.com","address":{"@type":"PostalAddress","streetAddress":"Smolnik 62","postalCode":"2342","addressLocality":"Ruše","addressCountry":"SI"},"vatID":"SI94001154","logo":{"@type":"ImageObject","url":"https://wiresizes.com/icons/icon-512.png","width":512,"height":512}}
]}
```

#### /calculators/ohms-law-calculator (1 JSON-LD block)

```json
{"@context":"https://schema.org","@graph":[
  {"@type":"WebApplication","@id":"https://wiresizes.com/calculators/ohms-law-calculator#webapp","name":"Ohm's Law Calculator","url":"https://wiresizes.com/calculators/ohms-law-calculator","applicationCategory":"UtilitiesApplication","operatingSystem":"All","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"description":"Ohm's law calculator for electrical engineers and technicians. Calculate voltage, current, resistance, and power using V=IR and P=VI formulas. AC and DC circuit calculations.","author":{"@id":"https://wiresizes.com/about#marko-visic"},"publisher":{"@id":"https://wiresizes.com/#organization"}},
  {"@type":"BreadcrumbList","@id":"https://wiresizes.com/calculators/ohms-law-calculator#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://wiresizes.com"},{"@type":"ListItem","position":2,"name":"Calculators","item":"https://wiresizes.com/calculators"},{"@type":"ListItem","position":3,"name":"Ohm's Law Calculator","item":"https://wiresizes.com/calculators/ohms-law-calculator"}]},
  {"@type":"Person","@id":"https://wiresizes.com/about#marko-visic","name":"Marko Visic","url":"https://wiresizes.com/about","alumniOf":{"@type":"CollegeOrUniversity","name":"University of Ljubljana, Faculty of Mathematics and Physics"},"hasCredential":{"@type":"EducationalOccupationalCredential","credentialCategory":"degree","name":"BSc Physics"},"knowsAbout":["conductor resistance","electrical units and conversions","wire gauge geometry"],"sameAs":["https://www.linkedin.com/in/marko-visic/"]},
  {"@type":"Organization","@id":"https://wiresizes.com/#organization","name":"Moving Data Systems d.o.o.","legalName":"Moving Data Systems d.o.o.","url":"https://wiresizes.com","address":{"@type":"PostalAddress","streetAddress":"Smolnik 62","postalCode":"2342","addressLocality":"Ruše","addressCountry":"SI"},"vatID":"SI94001154","logo":{"@type":"ImageObject","url":"https://wiresizes.com/icons/icon-512.png","width":512,"height":512}}
]}
```

#### /about (1 JSON-LD block)

```json
{"@context":"https://schema.org","@graph":[
  {"@type":"WebPage","@id":"https://wiresizes.com/about","url":"https://wiresizes.com/about","name":"About wiresizes.com","description":"Who writes wiresizes.com, which sources its numbers come from, how pages are checked, and the dated list of corrections.","isPartOf":{"@id":"https://wiresizes.com/#website"},"inLanguage":"en-US","publisher":{"@id":"https://wiresizes.com/#organization"}},
  {"@type":"BreadcrumbList","@id":"https://wiresizes.com/about#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://wiresizes.com"},{"@type":"ListItem","position":2,"name":"About wiresizes.com","item":"https://wiresizes.com/about"}]},
  {"@type":"Organization","@id":"https://wiresizes.com/#organization","name":"Moving Data Systems d.o.o.","legalName":"Moving Data Systems d.o.o.","url":"https://wiresizes.com","address":{"@type":"PostalAddress","streetAddress":"Smolnik 62","postalCode":"2342","addressLocality":"Ruše","addressCountry":"SI"},"vatID":"SI94001154","logo":{"@type":"ImageObject","url":"https://wiresizes.com/icons/icon-512.png","width":512,"height":512}}
]}
```

## 6. Icon and favicon files

| File | Size | What it shows |
|---|---|---|
| `public/icon.svg` (unchanged; now served at /icon.svg) | 690 B, viewBox 512 | the site icon (D-19): #2563eb square, corner radius 64, yellow (#fbbf24, #f59e0b stroke) bolt, white wire coil (two rings and a bar) |
| `public/icons/icon-192.png` (new) | 4,313 B, 192×192 RGBA | public/icon.svg rendered with next/og; transparent outside the rounded square |
| `public/icons/icon-512.png` (new) | 12,730 B, 512×512 RGBA | the same at 512; the Organization logo and the manifest's 512 icon |
| `src/app/favicon.ico` (replaced; served at /favicon.ico) | 2,410 B: 3 PNG images, 16, 32, 48 px, 32 bpp | 16 = `public/favicon-16x16.png` (403 B), 32 = `public/favicon-32x32.png` (808 B), 48 = a next/og render of public/icon.svg. It replaces the default Next.js triangle (25,931 B) |
| `public/apple-touch-icon.png` (unchanged) | 4,869 B, 180×180 | the same design (checked by eye before step 7) |
| `public/favicon-16x16.png`, `favicon-32x32.png` (unchanged) | 403 B, 808 B | the same design at 16 and 32 px |
| `public/favicon.svg` (unchanged, still linked) | 179 B, viewBox 16 | a simpler bolt-only variant: square corners, no coil (CHAT 2) |
| deleted: `src/app/icon.svg` | 206 B, 32×32 | the #0ea5e9 sky-blue variant that served /icon.svg |
| deleted: `public/favicon.ico` | 25,931 B | the default Next.js triangle, byte-identical to the old src/app/favicon.ico |

`scripts/render-icons.mjs` (next/og and Node built-ins) writes the two PNGs and the ICO from public/icon.svg. Re-run it when the icon changes.

Served by a `next start` on port 3100 (127.0.0.1, 300 s timeout, ended by itself) from the final build:
- `curl -s http://127.0.0.1:3100/favicon.ico | wc -c` → `2410`, not 25931;
- the response is image/x-icon and is byte-identical to src/app/favicon.ico;
- /icon.svg returns public/icon.svg (690 B); /icons/icon-192.png, /icons/icon-512.png and /manifest.json all return 200;
- /about, a calculator, a guide, /sitemap.xml and the CSS return 200.

Decoding the served ICO (scratch script: directory entries, chunk CRCs with zlib.crc32, IDAT inflate, scanline unfiltering):

```
ICO: 2410 bytes, 3 images
image 0: entry 16×16 32 bpp, PNG 16×16 RGBA, 4 chunks CRC ok, 256 pixels decoded; corner alpha 75,73,73,72; centre RGB 250,188,33
image 1: entry 32×32 32 bpp, PNG 32×32 RGBA, 4 chunks CRC ok, 1024 pixels decoded; corner alpha 0,0,0,0; centre RGB 251,191,36
image 2: entry 48×48 32 bpp, PNG 48×48 RGBA, 3 chunks CRC ok, 2304 pixels decoded; corner alpha 0,0,0,0; centre RGB 251,191,36
```

The 16 px image is the existing favicon-16x16.png. Its corners are partly opaque, as in that file.

Icon links on every page now, each once:
- `/favicon.ico?favicon.521692bb.ico` 48x48 (Next.js, from src/app/favicon.ico);
- `/favicon.svg`;
- `/icon.svg`;
- `/favicon-32x32.png`;
- `/favicon-16x16.png`;
- `apple-touch-icon /apple-touch-icon.png`;
- plus the manifest link.

The custom 404 (/_not-found) keeps one `<main>` (check 16) and the robots "noindex" meta that Next.js adds. It also prints the root layout's "index, follow" robots meta, as it did before this wave. That was found, not changed: search engines apply the more restrictive directive, and DEVLOG §5 has a line for it.

## 7. CHAT questions

1. **Person on /about.** The Person's @id is https://wiresizes.com/about#marko-visic. /about prints WebPage, BreadcrumbList and the Organization, as step 5 asks, but not the Person. Should /about's WebPage carry `mainEntity` → the Person (or be an AboutPage), so the Person node is printed at its own @id?
2. **favicon.svg.** `public/favicon.svg` is still linked as an icon beside /icon.svg. It is a 16-unit bolt-only variant: square corners, no wire coil, same colours. `public/apple-touch-icon.svg` (unlinked) is another bolt-only variant. Keep favicon.svg, replace it with a copy of icon.svg, or drop its link and both files (D-19)?
3. **trust-pages-copy.md for pack v5.** Only the Corrections date changed, as asked. The file's {DATE} placeholder still says "the WSZ-002 commit date" for the /privacy and /terms "Last updated" lines, which now read page-dates.json (November 2, 2026). The file also lacks the "Marko Visic on LinkedIn" line. Should v5 carry both changes (answer 3)?
4. **Push day.** /about and the eight converters changed body text in this wave and carry modified 2026-11-03, the commit day. Under D-17 their date is the push day. If the owner pushes after 2026-11-03, does the next wave set them to the push day, or does the commit day stand for this wave?
5. **Hub cards.** Page names in the home page's and the hubs' own cards are not marked `[data-name]`, because they are not header, footer or related-links blocks. Examples: "100 Amp Wire Size" and "200 Amp Wire Size" on /, and "100 Amp Wire Size Guide" and "Wire Size for 200 Amp Service" on /guides. Gate b still counts them. Mark them in WSZ-005, which rebuilds those pages, or now?
6. **Link class.** The byline uses the site's link class `text-blue-600 hover:underline`, as step 3 asks. Blue-600 against the gray-600 byline text is 1.46:1, so the links differ by colour only until hover. WCAG 1.4.1 asks for 3:1 or a non-colour cue. Each colour on its ground passes: gray-600 7.56:1 and blue-600 5.17:1 on white. Add an underline to the site's link class, site-wide or in the byline only?

## 8. Commands and outputs

```
$ git remote get-url origin                      → https://github.com/Mapstor/wiresizes.git
$ git log --oneline -1 (start)                   → af00b7c docs(wsz-017): WSZ-004 draft checked against the code
$ git status --short (start)                     → ?? .devcontainer/
$ git fetch origin; git log --oneline main..origin/main; git log --oneline origin/main..main → (no output) (no output)
$ rm -rf .next && npm run build (baseline, af00b7c)  → pass, postbuild 0 hits / 16/16 / gates pass; BUILD_ID HcFwdEdVTJkBLaPz0YQRX
$ node scripts/snapshot-pages.mjs /tmp/wsz004a/before → 49 files
$ rm -rf .next && npm run build (127f98f)        → pass; check-structure 19/19
$ rm -rf .next && npm run build (268a880)        → pass; check-structure 22/22
$ rm -rf .next && npm run build (4aa27f9, final) → pass; check-banned 0 hits; check-structure 23/23; check-rendered-text 0 hits;
                                                   check-number-trace 0 on 7 enforced routes; check-nec-refs 0 on 28; 53/53 static pages
$ cat .next/BUILD_ID                             → U1y6VvNsFixqD5ZTZKJRT
$ npx tsc --noEmit 2>&1 | grep -c "error TS"     → 0
$ npm test                                       → # golden: 214 of 214 cases run, 25 groups, 0 skipped
                                                   # tests 345 · pass 345 · fail 0 · cancelled 0 · skipped 0 · todo 0
$ python3 -I research/check_sources.py research/data-sources.csv research/page-map.csv → RESULT: OK (13 warnings)
$ node scripts/snapshot-pages.mjs /tmp/wsz004a/after → 49 files; diff -r: 32 files, 1,342 lines (§4)
$ curl -s http://127.0.0.1:3100/favicon.ico | wc -c → 2410
```

The 345 tests are the 336 from before plus 9 new ones in `tests/wsz004a-trustframe.test.ts`: formatDate; the page-dates rules; pageDates and articleDates; the sitemap reading page-dates.json; the Organization; the Person; corrections.json; gate b skipping `[data-name]`. Each commit passed `npm test` and its own clean build before it was made.

Not run: a browser. Layout at 320 and 390 px, the look of the byline on each surface, the #sources jump under the sticky header, dark mode and the favicon in a tab are chat's check (D-16). eslint was not run either.

## 9. Notes

- **Impeccable** (D-07: skill text only, launcher not run), for the byline:
  - SKILL.md "How to design" (refinement preserves) and "Modes" (Read on the guides, Operate on the tools);
  - reference/craft-floor.md "Verify" (contrast, spacing, type, browser surfaces);
  - reference/typeset.md "Visitor mode" and "Apply" (one role, kept the same everywhere);
  - reference/polish.md "1. Establish the system" and "4. Polish the whole path" (Layout and type, Color).
- **The byline's style:** one `<p>` in text-sm, using the colour the page already uses for muted text: gray-600 on gray and white pages, neutral-600 on the three neutral calculator pages, blue-100 on the three dark heroes. Pages that have dark-mode variants also get gray-400 and blue-300 there, as their Sources sections do. Links use text-blue-600 hover:underline, or white underlined on the dark heroes. Contrast: gray-600 on white 7.56:1, neutral-600 7.81:1, blue-100 on blue-700 5.49:1, white on blue-700 6.70:1, dark mode gray-400 on gray-900 6.99:1.
- **Byline placement:**
  - On guides it sits right after the H1, or after the H1's icon row, with mb-4 before the subtitle.
  - On tools it follows the calculator inside the same section, with mt-4.
  - On the four pages that stack sections with space-y-12, the calculator and its byline share a `<div>`, so the byline is not pushed 3rem away. No `<Suspense>` or `dynamic()` was added.
- **Sources heading:** it is now `<h2 id="sources">` with `scroll-mt-20`, so the "Sources below" jump does not land under the 64 px sticky header. Nothing else in `<Sources>` changed.
- **Beyond the letter:**
  - check 23 (icons);
  - the D-20 `data-name` labels in the guides layout navigation and on WithdrawnTool's "Related pages", besides the header, footer and related-links blocks;
  - deleting `scripts/wire-article-dates.mjs`;
  - dropping the metadata `/favicon.ico` entry and the `shortcut` icon, which would otherwise repeat the favicon.ico and favicon.svg links;
  - `scripts/render-icons.mjs`.
- **Every JSON-LD block that references a node prints it.** So the two table guides print the Person and the Organization twice, once in the Article graph and once in the Dataset graph. The copies are identical (check 22).
- **anti-slop:** 0 fixes. All new reader-facing text is the prompt's wording or registry text.
