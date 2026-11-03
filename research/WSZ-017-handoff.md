# WSZ-004 draft vs the code, and a WSZ-005 scan

_WSZ-017 · 2026-11-03 · `main` @ `689a764` (origin/main = `e689101`; the 7 commits 1d1e349 … 689a764 are not pushed) · read only. Input for chat's final WSZ-004. The drafts are `research/prompts/WSZ-004.txt` and `WSZ-005.txt`; each is byte-identical to its section of `research/prompts/ALL-WSZ-002-011.txt` (lines 681–773 and 777–856; the combined file only adds two blank lines after each section). This file and `research/WSZ-004.next.txt` sit in `research/`, beside the WSZ-016 handoff._

Method: every step and bullet of WSZ-004 checked against the source with greps and read-only commands in the box. The built output was read, never changed, from the WSZ-003c build in `.next` (BUILD_ID `MiXoJghFAq1aMF0zDkq30`). Production was fetched read-only from the box at 12:00 UTC (it answers through the Vercel IP it shares with simplemaplab.com, DEVLOG §4). Five throwaway scripts in the session scratchpad, not committed, used the gates' own `scripts/lib/build-output.mjs` and `gate-rules.mjs`. Nothing was built or served, no process was touched, and nothing under `src/`, `scripts/`, `tests/`, `data/`, `public/`, `package.json` or `next.config.ts` changed. Line numbers refer to `689a764`. `L` = line in `research/prompts/WSZ-004.txt`.

## 0. Summary

- **WSZ-004, 58 items:** NEEDED 41 · PARTLY DONE 5 · DONE 2 · CONFLICT 5 · STALE 5. Plus 10 things the draft doesn't cover (§1.9).
- **WSZ-005 scan, 15 lines:** NEEDED 7 · PARTLY DONE 5 · STALE 2 · CONFLICT 1 · DONE 0 (§4).
- **Commands:** `npx tsc --noEmit 2>&1 | grep -c "error TS"` → `0`; `npm test` → 336 pass, 0 fail, 0 skipped; check_sources → `RESULT: OK (13 warnings)` (§6).
- **18 CHAT questions** (§5): 17 for WSZ-004, 1 for WSZ-005.
- Biggest findings:
  1. Production's sitemap.xml has a lastmod on all 32 URLs (fetched 12:00 UTC); "no lastmod at all" did not reproduce. Production (build e689101) shows datePublished = dateModified = 2026-11-02 on all nine guides and lastmod 2026-11-02T08:30:40Z on 29 URLs. That is commit 2373fbe, the 10th commit back from e689101. The 2026-10-26 chat saw on 2026-11-02 is 56f2edb, the 10th commit back from c96ca91, the deployment then. Vercel clones 10 commits deep: the draft's premise holds, and the comment in `article-dates.ts:16-18` ("Vercel does deep clones for production") is wrong (§2.2).
  2. All 32 live page files were added on 2026-02-22 in 6f58c08; the home page's file came with the 2026-01-21 scaffold and got its content in 6f58c08. The repo holds no per-page publish record; the dated outside evidence is site-level (search-engine verification files on 2026-02-24, GSC www impressions from March 2026). Chat decides datePublished (Q4, §2.3).
  3. Under the drafted date rule, this wave's own byline edit dates every content and tool page to the WSZ-004 commit (DEVLOG §4), and a script run before a commit can't see that commit (Q5).
  4. "Sources below" would be false on 17 of the 24 content and tool pages: only the seven WSZ-003b calculators have a Sources section (Q7).
  5. /methodology as drafted fails two existing gates: nec-110-14c's attribution prints "110.14(C)" (check-structure 7), and the attributions of nec-continuous-load (210.19(A), 210.20(A), 215.2(A), 230.42(A)) and doe-efficiency-standards (430.32(c)) are outside the NEC allowlist (gate c) (Q10, Q12).
  6. Step 8's "enforce list" is one list per gate since D-15. necRefs.enforce already has the five trust pages; numberTrace.enforce is empty, and every page counts "100 Amp" and "200 Amp" from the footer, so the trust pages can't join it as drafted (Q12).
  7. The drafted footer list leaves out "Cookie settings" (D-10), and the drafted check-jsonld rule "every URL starts with https://wiresizes.com" would fail on the Person's LinkedIn sameAs; check-structure 4 already checks the right keys (WSZ-016 answer 14 applied).
- Proposed split (Q1): WSZ-004a TRUSTFRAME (steps 1–4 and 6) and WSZ-004b METHODOLOGY (step 5 and its links) (§1.11).

## 1. WSZ-004 step by step

Statuses: NEEDED (still to do as drafted) · DONE (commit) · PARTLY DONE (what remains) · CONFLICT (with what) · STALE (a reference that doesn't exist or was renamed). The "Change" column is applied in `research/WSZ-004.next.txt`; "Q" points to §5. Paths without a folder are under `src/app/` (pages) or `src/components/seo/` (schema components) unless named.

### 1.1 Header lines and Read first

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| H1 | L3 REPO GUARD | NEEDED | `git remote get-url origin` → `https://github.com/Mapstor/wiresizes.git`; DEVLOG.md:18 domain wiresizes.com | none |
| H2 | L4 PRECONDITION "WSZ-003 DATALAYER as done" | STALE | WSZ-003 was split (WSZ-016 answer 1). §6 has "WSZ-003a DATALAYER" (DEVLOG.md:168), "WSZ-003b GATES" (:176) and "WSZ-003c FIXES" (:184); no entry is called "WSZ-003 DATALAYER" | name WSZ-017 DRAFTCHECK; Q2 |
| H3 | L5 SYNC | NEEDED | after `git fetch origin`: `git log --oneline main..origin/main` → no output; `origin/main..main` → 7 commits, 1d1e349 … 689a764 (WSZ-003b and c, not pushed) | none (Q2) |
| H4 | L6 COMMIT IDENTITY | NEEDED | the D-04 line (DEVLOG.md:39) | none |
| H5 | L7 PACK SYNC | NEEDED | no `wsz-pack-*` folder; `research/PACK_VERSION` → v4. `sha256sum -c --quiet research/MANIFEST.sha256` → 4 FAILED: held-waves-rules.md (WSZ-003a), trust-pages-copy.md (74ac215), nec-sections-allowlist.csv and wsz002-banned-strings.txt (37985a6). Outside the manifest: WSZ-016-handoff.md, WSZ-003b-report.md and this run's two files. A pack install overwrites the first four with the pack's copies (INSTALL.md:6) and deletes the others (INSTALL.md:7; exceptions only inventory-2026-10.md and wsz002-draft-review.md) | Q3 |
| H6 | L9–15 Read first | NEEDED | all six exist: trust-frame-spec.md, trust-pages-copy.md, raptive-ready "Trust and author-identity standard (every site)" (SKILL.md:29), seo-visibility schema rules ("Technical rules" 4–5, SKILL.md:115-124), anti-slop-prose. Missing: the code the steps change or build on (article-dates.ts, sitemap.ts, the seo components, the home page JSON-LD, layout.tsx, Footer.tsx, about/page.tsx, registry.ts and csv.mjs, Sources.tsx and AsOf.tsx, check-structure.mjs, gates.config.json, build-output.mjs and gate-rules.mjs), research/data-sources.csv and this handoff | add those paths |

### 1.2 Step 1: real dates

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| 1.1 | L18 `scripts/update-page-dates.mjs`: per live route `git log -1 --format=%cs -- <the route's files and the data/verified files it imports>` → `src/data/page-dates.json` | NEEDED | no such script or JSON; `src/data/` holds only `.gitkeep` (tsconfig maps `@/data/*` to it). Since WSZ-003a, routes reach `data/verified/*.json` through `src/lib/verified` modules (D-13); only the two table guides import data files directly (`guides/nec-table-310-16/page.tsx:7-9`, `guides/awg-wire-size-chart/page.tsx:7,10`) until WSZ-005. `data/verified/` last changed in ee3a82b (2026-10-25). Every reading of "the route's files" gives 2026-11-03 for 29 routes today (§2.4). This wave's byline edit touches every content and tool page file | "the data/verified files it imports" → "the data/verified/*.json files it reaches through src/lib/verified (D-13)"; Q4, Q5 |
| 1.2 | L19 runs in the box before each content commit; Vercel's shallow clone | NEEDED | confirmed: production's lastmod and Article dates equal the 10th commit back from the deployed commit (§2.2). Run before a commit, `git log -1` can't see the commit being made | Q5 |
| 1.3 | L20 `sitemap.ts`: lastmod from page-dates.json; delete the execSync git and mtime fallbacks; never the build time | NEEDED | `sitemap.ts:2-3` imports; `:20-31` gitLastModified (`%aI`, the author date); `:33-59` lastmod() over page.tsx and GuideClient.tsx, mtime fallback `:48-52`, build-time `new Date()` `:54-56`. The route lists are hand-kept (`:61-92`, `:145-150`) | add the line numbers |
| 1.4 | L21 delete `article-dates.ts` and the FALLBACK_DATE constants; every date from page-dates.json, none where it has none | NEEDED | `article-dates.ts:21` FALLBACK_DATE '2026-01-01'; `:54-55` first and last `%aI` commit, without `--follow`. Callers: getArticleDates in seven guide pages (`nec-code-compliance:28`, `wire-size-for-200-amp:29`, `nec-table-310-16:70`, `wire-size-for-ev-charger:23`, `awg-wire-size-chart:80`, `electrical-power-calculations:53`, `wire-size-for-100-amp:37`) and, with the GuideClient.tsx path, `single-vs-three-phase/page.tsx:13` and `power-factor-explained/page.tsx:13`. FALLBACK_DATE: `ArticleSchema.tsx:17` and `:49-50`, `ArticleFAQSchema.tsx:17` and `:49-50` (inventory-2026-10.md's `:23` is older). DatasetSchema prints the same dates on the two table guides (`nec-table-310-16/page.tsx:411-412`, `awg-wire-size-chart/page.tsx:439-440`). Visible dates today: none from git; hand-typed "Last updated: October 25, 2026" (`privacy/page.tsx:33`, `terms/page.tsx:33`) and the Corrections date (`about/page.tsx:68`) | name the callers and DatasetSchema; Q5 (d) |
| 1.5 | L22 npm script "dates" | NEEDED | `package.json` scripts: dev, build, postbuild, start, lint, test | none |

### 1.3 Step 2: byline

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| 2.1 | L24 every content and tool page; above the fold on guides, below the tool on tool pages | NEEDED | no byline in `src/` ("By Marko" → no match). Content and tool pages: 15 calculators + 9 guides = 24; step 8 checks "every live page" (32). Two guides render their hero in a `'use client'` GuideClient.tsx (power-factor-explained, single-vs-three-phase). Below the tool means inside page.tsx after the calculator, with no `<Suspense>` or `dynamic()` wrapper (DEVLOG §4, check-structure 11) | Q6 |
| 2.2 | L25 "By Marko Visic, BSc Physics · Updated {date} · Sources below"; the name links to /about | CONFLICT (trust-frame-spec.md:4: no claim of anything that doesn't exist) | `<Sources>` renders only on the seven WSZ-003b calculators (wire size, voltage drop, ampacity, ground wire, wire resistance, low voltage, service entrance). The eight converters and the nine guides have no Sources section, and the heading in `Sources.tsx:30` has no id to link to. {date} has no format; the site's visible dates read "October 25, 2026" (trust-pages-copy.md:5, "US style") | Q7; Q6 (format) |
| 2.3 | L26 "Reviewed" only after a review DEVLOG logs | NEEDED | no "Reviewed" in `src/`; DEVLOG logs no review | none |
| 2.4 | L27 withdrawn pages get no byline | NEEDED | the 15 routes of `research/wsz002-withdrawals.csv` render `src/components/content/WithdrawnTool.tsx` | name them |

### 1.4 Step 3: schema

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| 3.1 | L30 Organization: name and legalName, url, PostalAddress, vatID, no sameAs | NEEDED | the Organization is "WireSizes.com" (`page.tsx:74-88`: no legalName, address or vatID; logo /icon.svg declared 512×512; `"sameAs": []` at `:87`), printed again inline as Article author and publisher (`ArticleSchema.tsx:31-48`, `ArticleFAQSchema.tsx:31-48`). All carry `@id` `https://wiresizes.com/#organization`, which WebSite (`page.tsx:90-101`), DatasetSchema (`:68`) and BasicPageSchema reference; an @id reference finds nothing on a page that doesn't print the node, so the node belongs on every page that references it. /icon.svg is the 32×32 `src/app/icon.svg` (6.2) | name the nodes it replaces; keep the @id; Q13 |
| 3.2 | L31–35 Person | NEEDED | no Person node in `src/`; facts in §3. check-structure 4 checks only url, @id, item, logo and image values (`URL_KEYS`, `check-structure.mjs:20`): sameAs passes, an off-site `url` on alumniOf would fail | note check 4 |
| 3.3 | L36–37 Article or WebPage: author → Person, publisher → Organization | NEEDED | the nine guides: Article author = publisher = Organization "WireSizes.com" (built JSON-LD). The 15 calculators: WebApplication (`CombinedSchema.tsx:14-27`) without author or publisher. The five trust pages: no JSON-LD. Every page: meta author, creator and publisher "WireSizes.com" (`layout.tsx:35-37`) | Q14 |
| 3.4 | L38 datePublished only if git shows a real first-publish date | CONFLICT (step 1: no git at build, and page-dates.json holds one date per route) | git: 6f58c08 (2026-02-22) added 31 of the 32 page files; `/` came with the scaffold (67f98af, 2026-01-21). The build shows 2026-02-22 on seven guides and 2026-05-05 on the two GuideClient guides (the first commit of their GuideClient.tsx path is the copy d2d24c2); production shows 2026-11-02 (§2) | Q4 |
| 3.5 | L39 dateModified from page-dates.json | NEEDED | depends on 1.1 | none |
| 3.6 | L40 BreadcrumbList on every non-home page | PARTLY DONE | present on the 15 calculators (CombinedSchema), the 9 guides (Article graphs), /calculators and /guides. Missing on /about, /contact, /privacy, /terms and /disclaimer (no JSON-LD since 699de9a) and on the new /methodology. `BasicPageSchema.tsx:16-48` (WebPage + BreadcrumbList) has no user | name the pages and BasicPageSchema |
| 3.7 | L41 no aggregateRating, Review, HowTo or FAQPage | DONE (a94a71b) | none in the built JSON-LD; check-structure 5 (6164f90) fails on them | drop (check 5 enforces it) |
| 3.8 | L42 "scripts/check-jsonld.mjs … Add it to postbuild." | CONFLICT (WSZ-016 answer 14) | chat answered: new numbered checks in check-structure.mjs, no check-jsonld.mjs. postbuild already runs check-structure (`package.json:7`) | checks 17 onward in check-structure |
| 3.9 | L42 required keys are present | NEEDED | no such check | keep, in check-structure |
| 3.10 | L42 every URL starts with https://wiresizes.com | PARTLY DONE (6164f90) | check 4 (`check-structure.mjs:130-166`) holds canonicals, sitemap `<loc>` and JSON-LD url, @id, item, logo and image values to the apex. "Every URL" would fail on the Person's sameAs (LinkedIn), the draft's own field, and on WSZ-005's isBasedOn | "every URL" → check 4's keys |
| 3.11 | L42 none of the banned types appear | DONE (6164f90) | check 5 (`check-structure.mjs:169-198`) | drop |

### 1.5 Step 4: /about

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| 4.0 | L44 keep the WSZ-002 text | NEEDED | `about/page.tsx:33-84` renders trust-pages-copy.md's /about verbatim; WSZ-003b changed one word of the Corrections line ("promises" → "claims", 74ac215) | note the 74ac215 wording |
| 4.1 | L45 a visible rel="me" link to the LinkedIn profile | NEEDED | no `rel="me"` in `src/`; the URL is in DEVLOG.md:20 and trust-frame-spec.md:9 | Q8 |
| 4.2 | L46 Corrections from `src/data/corrections.json`; move the WSZ-002 line; later waves append | PARTLY DONE (699de9a) | the section and its one line exist, hand-typed (`about/page.tsx:65-73`, "October 25, 2026: Audited every page…"); no corrections.json | name the lines; Q9 |
| 4.3 | L47 a link to /methodology in "Where the numbers come from" | NEEDED | `about/page.tsx:47-56`; in WSZ-002 the page linked nothing but /privacy (trust-pages-copy.md:43) | Q8 |

### 1.6 Step 5: /methodology

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| 5.1 | L49 new page; add it to the sitemap and the footer | NEEDED | no route (page-map.csv:56: new, WSZ-004). Sitemap: `staticPages`, `sitemap.ts:145-150`; footer: `sitePages`, `Footer.tsx:46-52` | name both places |
| 5.2 | L50 generated from data-sources.csv: one section per verified domain | PARTLY DONE (1d1e349) | `src/lib/verified/registry.ts` reads the CSV (server only; the one parser is `csv.mjs`). `attribution()` (`:41-49`) throws for a row that isn't verified, and `registryRows()` (`:20-26`) isn't exported. 45 rows: 32 verified, 2 candidate, 11 GAP. Live pages use about 10 verified domains: the seven calculators' Sources (WSZ-003b report §6) plus power-definitions and nist-sp811-conversions from the converters' engines. 21 verified domains feed no live page's engines or data today, and nec-110-14c stays off pages (check-structure 7) | name registry.ts, csv.mjs and the missing accessor; Q10, Q11 |
| 5.3 | L51 what it is | NEEDED | the nearest column, `source`, is technical ("NFPA 70-2023 Table 310.16 (reprinted in NFPA TIA 1691 circulation; TIA failed)") | Q11 |
| 5.4 | L52 publisher | NEEDED | column `publisher` | none |
| 5.5 | L53 edition or date | STALE | no edition column (the columns: domain, source, publisher, url, endpoint, access, license, tier, cadence, granularity, format, key_required, attribution, verified_date, next_check, coverage, sample_note, status, pages_served, notes). The edition sits in `source` and `attribution` ("NFPA 70 (NEC) 2023, Table 310.16") | say where it comes from |
| 5.6 | L54 deep link | NEEDED | column `url` | none |
| 5.7 | L55 retrieved date | NEEDED | `verified_date` (2026-10-19 or 2026-10-20 on verified rows); `<Sources>` shows "Retrieved Oct 2026." through `monthOf()` (`src/components/content/AsOf.tsx:5-7`) | name monthOf |
| 5.8 | L56 what the site calculates from it, with the formula | NEEDED | not in the registry; the engines hold it (5.11) | Q11 |
| 5.9 | L57 known limits from the coverage and notes fields | NEEDED | that text cites NEC sections outside the allowlist on 20 rows (gate c), and three rows hold "110.14(C)" or "334.80" in some field (nec-110-14c, nec-misc-installation, nec-cable-rules: check-structure 7) | Q11, Q12 |
| 5.10 | L58 "Not covered yet" from the GAP and candidate rows; no status words, no build talk | NEEDED | 11 GAP + 2 candidate rows, which `attribution()` can't read (5.2). Gate a fails site-wide on "registry", "engine", status notes and self-praise (`gate-rules.mjs:7-49`); check 7 on "334.80" and "110.14(C)" (nec-cable-rules, nec-misc-installation) | add the check 7, gate a and gate c constraints |
| 5.11 | L59–66 the seven formulas | PARTLY DONE (7331e8b, 23088f5) | AWG: `awg-geometry.ts` gaugeGeometry, and `awg.json` `definition.formula` "d(n) = 0.005 in × 92^((36 − n)/39); n = −3, −2, −1, 0 for 0000, 000, 00, 0". R(T): `resistance.ts` alpha, atTemperature, resistanceAt. Voltage drop: `voltage-drop.ts` voltageDrop, phaseFactor. DC circular mils: `dc-sizing.ts` resistivityK, dcSizing. Ampacity: `ampacity.ts` correctedAmpacity, adjustmentPercent. The 60 °C method with 240.4(D) and the 250.122(B) ground: `conductor-sizing.ts` sizeConductor. Power and PF correction: `power.ts` fromRealPower, fromApparentPower, fromCurrent, pfCorrection. Every unit-bearing number on the page renders through `<Val>` with data-src (DEVLOG §4:68) | name the engine modules |
| 5.12 | L67 attribution strings from the registry, never hand-typed | CONFLICT (gate c; check-structure 7) | `attribution()` and `attributionParts()` (`registry.ts:33-49`) exist and `<Sources>` uses them (1d1e349, 4bfdffd). Printed verbatim, nec-continuous-load's attribution cites 210.19(A), 210.20(A), 215.2(A) and 230.42(A), and doe-efficiency-standards' cites 430.32(c) (a 10 CFR section the gate reads as NEC); none is on the allowlist, so /methodology fails gate c once it is in necRefs.enforce. nec-110-14c's prints "110.14(C)" (check 7) | name the functions; Q10, Q12 |

### 1.7 Step 6: footer and housekeeping

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| 6.1 | L70 Footer: About · Methodology · Contact · Privacy · Terms · Disclaimer, plus the NFPA notice | CONFLICT (D-10) | the five links (`Footer.tsx:46-52`, 699de9a) and the notice (`:208-211`) exist, and so does the "Cookie settings" button (`:204-206`), which D-10 puts in the footer for everyone and the drafted list leaves out. Methodology is the one link missing | add Methodology; keep Cookie settings |
| 6.2 | L71 manifest PNGs: remove both, or generate them from public/icon.svg without a new dependency | NEEDED | `public/manifest.json:16-25`; `public/icons/` holds only `.gitkeep`. `public/icon.svg` (512, #2563eb) exists, but `/icon.svg` is served from `src/app/icon.svg` (32×32, #0ea5e9; the build's `icon.svg.body` equals it), so the manifest's own SVG entry (`:10-15`) and the Article and Organization logos point at the 32 px icon. next/og, part of next and used by `opengraph-image.tsx`, renders PNGs with no new dependency; sharp resolves only as next's optional dependency | Q13 |
| 6.3 | L72 favicon set and custom 404 work (report) | NEEDED | the built `<head>` lists each favicon link twice (`layout.tsx:93-98` repeats `metadata.icons`, `:72-82`), plus `/favicon.ico?favicon.0b3bf435.ico` from `src/app/favicon.ico`, which is byte-identical to `public/favicon.ico`. Files present: favicon.ico, favicon.svg, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png. The 404 (`/_not-found`) has robots noindex and one `<main>` (check-structure 16); chat's production check of 2026-11-02 saw a 404 status with noindex | none (report these) |

### 1.8 Steps 7–9, definition of done, DEVLOG step

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| 7.1 | L74 anti-slop-prose on every new or changed sentence; fix count | NEEDED | `.claude/skills/anti-slop-prose/SKILL.md` (legal pages are outside its scope) | none |
| 8.1 | L77 `npm run dates` | NEEDED | from 1.5 | none |
| 8.2 | L78 `rm -rf .next && npm run build` (all gates) | NEEDED | postbuild runs the five gates (`package.json:7`). A `next start` holds container port 3000 for chat's test (§1.9 N1) | Q2 |
| 8.3 | L78 "add /about, /methodology, /contact, /privacy, /terms and /disclaimer to the gates' enforce list" | STALE (D-15) | one list per gate. `necRefs.enforce` already holds /about (`gates.config.json:10`), /contact (`:26`), /disclaimer (`:27`), /privacy (`:33`) and /terms (`:34`); gate a has no list (site-wide). `numberTrace.enforce` is empty (`:2-4`), and every page counts "100 Amp" and "200 Amp" from the footer's guide links (`Footer.tsx:31-32`): gate b on the WSZ-003c build finds those two, and nothing else, on each trust page and the 404 | necRefs.enforce: add /methodology; Q12 |
| 8.4 | L79 `npm test` | NEEDED | today 336 pass, 0 fail, 0 skipped | none |
| 8.5 | L80 `npx tsc --noEmit` (0 errors) | NEEDED | today 0 | none |
| 8.6 | L81 check-jsonld.mjs | STALE (WSZ-016 answer 14) | the checks go into check-structure | → `node scripts/check-structure.mjs` |
| 8.7 | L82 a script: every live page has the byline and an "Updated" date equal to page-dates.json | NEEDED | "every live page" (32) is not step 2's "content and tool page" (24) | Q6 |
| 9.1 | L84 commit | NEEDED | — | none |
| D.1 | L87 the byline/date script result | NEEDED | — | none |
| D.2 | L88 the check-jsonld result | STALE (answer 14) | — | → the check-structure result |
| D.3 | L89–91 gates with enforced routes, test and tsc lines, /methodology sections | NEEDED | — | none |
| L.1 | L93 DEVLOG step and its §4 note | NEEDED | the note replaces DEVLOG §4:85 ("Sitemap lastmod and Article dates come from `git log` at build…"); §1 Key paths names "dates src/lib/article-dates.ts" (DEVLOG.md:29); §5 lines 100 and 108 close with this wave | say so |

### 1.9 Not in the draft

| # | Finding | Evidence | Where it goes |
|---|---|---|---|
| N1 | PROCESSES line and serving | `ps`, read only: a `next start -p 3000 -H 0.0.0.0` since 10:39:21 UTC (WSZ-003b's, 6 h timeout, about 16:39 UTC) and the watcher `sh -c 'while curl -s -o /dev/null http://127.0.0.1:3000/; do sleep 20; done; exec timeout 21600 npm run start -- -p 3000 -H 0.0.0.0'` since 11:27:48 UTC, which then serves the WSZ-003c build until about 22:39 UTC. Step 8's `rm -rf .next` under that server leaves its pages without CSS and JS (DEVLOG §4:83). WSZ-003a carried a PROCESSES line (WSZ-016 answer 2) | Q2 |
| N2 | D-16: layout at 320 and 390 px is chat's check after each UI wave; the byline, the footer link and /methodology are UI | DEVLOG.md:51 | added to step 8 |
| N3 | Impeccable | the devlog skill (SKILL.md:115) asks a design prompt to name an Impeccable command when §1 lists it (DEVLOG.md:30); D-07: skill text only | Q16 |
| N4 | Author, creator and publisher metadata; the site name | `layout.tsx:35-37` sets meta author, creator and publisher "WireSizes.com" on every page. The site name is "WireSizes.com" in titles (`layout.tsx:22-23`), og:site_name (`:53`, `about/page.tsx:17`), the WebSite node (`page.tsx:95`), the footer logo (`Footer.tsx:70`) and the manifest (`manifest.json:2-3`), and "wiresizes.com" in the trust copy. Raptive red flag 10 is identity drift | Q14 |
| N5 | Logo size | the Article publisher logo (`ArticleSchema.tsx:42-47`) and the Organization logo (`page.tsx:80-85`) declare /icon.svg as 512×512; the served file is 32×32 | Q13 |
| N6 | Two copies of one component | `ArticleFAQSchema.tsx` equals `ArticleSchema.tsx` apart from its names since a94a71b dropped the FAQ, so step 3 edits both | note (one component would do) |
| N7 | /about item 3 of the spec | trust-frame-spec.md:22 ("Which NEC edition", link /guides/nec-code-compliance) is in neither the live /about nor the draft | Q8 |
| N8 | Credentials on /about | raptive-ready SKILL.md:31: the credentials that fit the topic, "all of them on the About page"; trust-frame-spec.md:8 and D-03 keep the physics credential only | Q15 |
| N9 | contact@wiresizes.com | DEVLOG §0 (DEVLOG.md:11) still lists the forwarding alias as not checked; /about, /contact, /privacy, /terms and /disclaimer print the address | owner item, already in §0 |
| N10 | Snapshot | `scripts/snapshot-pages.mjs` before and after would show whether anything changed beyond the byline, the JSON-LD, the footer and /about | Q17 |

### 1.10 Against D-01 to D-16 and what WSZ-002 to WSZ-003c built

| Decision | WSZ-004 |
|---|---|
| D-01 apex | consistent: Organization url https://wiresizes.com; check 4 keeps JSON-LD URLs on the apex |
| D-02 withdrawals | consistent: no byline on the 15 (2.4); /methodology's "Not covered yet" names the topics their rebuilds wait for |
| D-03 byline, publisher | consistent: "BSc Physics" only; the Organization uses the same name, address and VAT ID (the registration number stays on the four pages and is not in the drafted schema); Q15 |
| D-04 commit identity | same line |
| D-05 fonts, tests | consistent: "no new dependency" (6.2); any new test stays erasable TypeScript (DEVLOG §4) |
| D-06 60 °C until WSZ-009 | consistent: /methodology describes the 60 °C method with 240.4(D); 110.14(C) stays off pages (check 7; Q10) |
| D-07 Impeccable | not named (Q16) |
| D-08 EGC not capped | /methodology's 250.122(B) text must not say the ground wire is capped at the conductor size |
| D-09 verified-sd2023 | /methodology's "edition or date" says 2023 NEC for those items; registry statuses stay verified, candidate and GAP |
| D-10 GA4 consent | the drafted footer list leaves out "Cookie settings" (6.1, applied) |
| D-11 calculators | the byline goes below the tool without `<Suspense>` or `dynamic()` (check 11); dates don't go through format.ts |
| D-12 port | serving for chat: container port 3000 with -H 0.0.0.0 (Q2) |
| D-13 src/lib/verified | page-dates reaches data files through it (1.1, applied); /methodology reads the registry through registry.ts |
| D-14 spacing | the byline has no units; /methodology's formulas follow D-14, and gate a checks them |
| D-15 gates config | one list per gate (8.3, applied); `<Sources>` and `<AsOf>` are server only, so "Sources below" is plain text |
| D-16 layout checks | chat's 320 and 390 px check added to step 8 (N2) |

What WSZ-004 could undo or duplicate:
- **postbuild's five gates** (`package.json:7`): a check-jsonld.mjs would be a sixth script repeating checks 4 and 5 (answer 14 applied).
- **scripts/gates.config.json** (D-15): "the gates' enforce list" (8.3, applied; Q12).
- **check-structure's 16 checks:** 4 and 5 already cover URL hosts and banned types; 7 forbids "110.14(C)" and "334.80" on /methodology; 11 (no wrapper around a calculator) fixes where the byline goes on tool pages; 13 needs the byline's /about link and the footer's /methodology link to resolve; 14 (heading order) applies if the byline or /methodology add headings; 16 (one `<main>`) applies to /methodology.
- **registry.ts** (1d1e349): /methodology must not add a second CSV parser (csv.mjs is the one) and needs an accessor for the GAP and candidate rows.
- **`<Sources>` and `<AsOf>`** (1d1e349, 4bfdffd): "Sources below" only where `<Sources>` renders (Q7); "Retrieved Oct 2026." comes from monthOf().
- **The snapshot script:** WSZ-004 is not a refactor, but a before/after diff can bound what it changed (Q17).
- **D-14 and gate a:** new text is checked site-wide; "registry", "engine", "exact", "accurate" and "trusted" fail it (`gate-rules.mjs:7-49`).
- **DEVLOG §4:85 dating:** under the drafted rule the byline edit re-dates every content and tool page (Q5 b).
- **WSZ-003b answer 1:** nec-110-14c stays off pages until WSZ-009 (Q10).

### 1.11 Size: proposed split (Q1)

As drafted, WSZ-004 covers:
- a dates script and JSON, and the removal of git dates from the build (the sitemap, nine guide callers, three schema components);
- a byline on 24 pages, two of them inside client components;
- Organization, Person and Article changes, BreadcrumbList on six pages and new structure checks;
- the /about changes and corrections.json;
- a new page generated from the 45 registry rows, with seven formulas;
- the footer, manifest and favicon work, and a verification script.

The open questions cluster in two places: the date rule (Q4–Q6) and /methodology (Q10–Q12, Q16).

Proposal:
- **WSZ-004a TRUSTFRAME:** steps 1–4 and 6 without the links to /methodology: dates, byline, schema, /about, footer housekeeping. It touches every content and tool page once.
- **WSZ-004b METHODOLOGY:** step 5, the footer and /about links to /methodology, its sitemap entry and its enforce lists, after chat answers Q10–Q12.

Each part gets its own build, gate run, DEVLOG entry and chat's D-16 check.

## 2. Dates

### 2.1 How the dates are computed today

- **`src/lib/article-dates.ts`** (c547eda, 2026-05-05): getArticleDates(file) takes the first line of `git log --reverse --format=%aI -- <file>` as datePublished and `git log -1 --format=%aI -- <file>` as dateModified: author dates, no `--follow`, cached per file. Fallbacks: the file's mtime, then '2026-01-01' (`:21`). Callers: the nine guides (1.4). The two GuideClient guides pass `GuideClient.tsx`, which d2d24c2 (2026-05-05) copied from page.tsx (C100), so their datePublished is 2026-05-05 though their page dates from 2026-02-22. ArticleSchema and ArticleFAQSchema fall back once more to FALLBACK_DATE '2026-01-01' (`:17`, `:49-50`); DatasetSchema prints the same dates on the two table guides. Calculators, hubs, the home page and the trust pages carry no Article dates, and no page shows a date that comes from git.
- **`src/app/sitemap.ts`:** 32 URLs from hand-kept lists; lastmod is the later of `git log -1 --format=%aI` on page.tsx and GuideClient.tsx, else the file's mtime, else the build time.
- **Hand-set visible dates:** "Last updated: October 25, 2026" (`privacy/page.tsx:33`, `terms/page.tsx:33`) and the Corrections item "October 25, 2026" (`about/page.tsx:68`).
- **The box's build** (BUILD_ID MiXoJghFAq1aMF0zDkq30, full clone): lastmod 2026-11-03T10:13:17Z (74ac215, WSZ-003b's spacing commit) on 28 URLs, 2026-11-03T11:23:41Z (4bfdffd) on the voltage drop calculator, 2026-10-25T15:32:40Z (699de9a) on /contact, /privacy and /disclaimer. Guides: datePublished 2026-02-22 on seven and 2026-05-05 on the two GuideClient guides; dateModified 2026-11-03 on all nine (74ac215 touched them).

### 2.2 What production shows

Fetched read-only from the box, 2026-11-03 12:00:40 UTC:
- every page carries `<meta name="x-build" content="e689101">`: production is origin/main;
- `https://wiresizes.com/sitemap.xml`: 200, application/xml, 5,698 bytes, 32 `<url>` and 32 `<lastmod>`. It does have lastmod. Values: 2026-11-02T08:30:40.000Z on 29 URLs, 2026-11-02T08:34:36.000Z on /guides, 2026-11-02T16:15:06.000Z on the wire size and ground wire calculators;
- the nine guides: datePublished = dateModified = 2026-11-02.

Why: 2026-11-02T08:30:40Z is the author date of 2373fbe, the 10th commit back from e689101 (e689101, 95a6add, 23088f5, 7331e8b, 23b11f2, c96ca91, b8c746b, 88bee2b, 42c8d49, 2373fbe). In a 10-commit clone 2373fbe is a root, so every file untouched since then dates from it: lastmod for 29 routes, and both Article dates for the nine guides. /guides changed in b8c746b (08:34:36) and the two calculators in 7331e8b (16:15:06), inside the 10. Chat's reading on 2026-11-02 (2026-10-26 on three guides) fits the deployment then, c96ca91, whose 10th commit back is 56f2edb (2026-10-26T21:34:23Z). Every push therefore moves production's dates to the date of the 10th commit back. The comment at `article-dates.ts:16-18` is wrong for this project. Where chat saw no lastmod: not reproduced; the file served at 12:00 UTC has them.

### 2.3 First-publish evidence per live route

Legend:
- **A** = 6f58c08 · 2026-02-22 · "Complete pre-deployment SEO optimization & full site implementation" (added the file)
- **S** = 67f98af · 2026-01-21 · "Initial commit from Create Next App" (scaffold)
- **G** = d2d24c2 · 2026-05-05 · "SEO foundation: per-page canonicals, host alignment, full schema coverage" (GuideClient.tsx copied from page.tsx, C100)
- build lastmod: **b1** 2026-11-03T10:13:17Z (74ac215) · **b2** 2026-11-03T11:23:41Z (4bfdffd) · **b3** 2026-10-25T15:32:40Z (699de9a)
- production lastmod: **p1** 2026-11-02T08:30:40Z (2373fbe, the clone's oldest commit) · **p2** 2026-11-02T08:34:36Z (b8c746b) · **p3** 2026-11-02T16:15:06Z (7331e8b)
- page-map.csv cells read "Bing impressions/clicks; GSC www impressions"; inventory = research/inventory-2026-10.md

`git log --follow --reverse` and `git log --diff-filter=A` agree on every page file, and no page file was renamed or moved (`git log -M --diff-filter=R -- src/app` → none).

| Route | First commit touching it | Earliest other evidence | Build now | Production now |
|---|---|---|---|---|
| / | S (page.tsx scaffold); its content: A (M) | page-map.csv:2 (15,369/284; 433); inventory:33 | b1 | p1 |
| /calculators | A | page-map.csv:35 (34/1; 0); inventory:35 | b1 | p1 |
| /guides | A | page-map.csv:43 (9/0; 0); inventory:72 | b1 | p2 |
| /calculators/wire-size-calculator | A | page-map.csv:32 (49/1; 0); inventory:69 | b1 | p3 |
| /calculators/voltage-drop-calculator | A | page-map.csv:31 (9/1; 0); inventory:63 | b2 | p1 |
| /calculators/ampacity-calculator | A | page-map.csv:12 (1,502/22; 0); inventory:37 | b1 | p1 |
| /calculators/ground-wire-calculator | A | page-map.csv:28 (299/2; 0); inventory:48 | b1 | p3 |
| /calculators/wire-resistance-calculator | A | page-map.csv:6 (8,389/256; 0); inventory:68 | b1 | p1 |
| /calculators/watts-to-amps-calculator | A | page-map.csv:40 (11/0; 0); inventory:65 | b1 | p1 |
| /calculators/amps-to-watts-calculator | A | page-map.csv:37 (31/0; 0); inventory:38 | b1 | p1 |
| /calculators/volts-to-amps-calculator | A | page-map.csv:22 (422/3; 0); inventory:64 | b1 | p1 |
| /calculators/kilowatts-to-amps-calculator | A | page-map.csv:16 (1,023/3; 0); inventory:52 | b1 | p1 |
| /calculators/kva-to-amps-calculator | A | page-map.csv:24 (355/0; 0); inventory:53 | b1 | p1 |
| /calculators/btu-to-watts-calculator | A | page-map.csv:26 (335/2; 0); inventory:40 | b1 | p1 |
| /calculators/ohms-law-calculator | A | page-map.csv:41 (10/0; 0); inventory:56 | b1 | p1 |
| /calculators/service-entrance-calculator | A | page-map.csv:9 (3,877/124; 884); inventory:61 | b1 | p1 |
| /calculators/three-phase-calculator | A | page-map.csv:30 (161/7; 0); inventory:62 | b1 | p1 |
| /calculators/low-voltage-calculator | A | page-map.csv:42 (2/0; 0); inventory:54 | b1 | p1 |
| /guides/awg-wire-size-chart | A | page-map.csv:3 (222,588/4,248; 0); inventory:73 | b1; Article 2026-02-22 / 2026-11-03 | p1; Article 2026-11-02 / 2026-11-02 |
| /guides/nec-table-310-16 | A | page-map.csv:4 (26,196/1,512; 0); inventory:77 | b1; Article 2026-02-22 / 2026-11-03 | p1; Article 2026-11-02 / 2026-11-02 |
| /guides/nec-code-compliance | A | page-map.csv:29 (176/1; 0); inventory:76 | b1; Article 2026-02-22 / 2026-11-03 | p1; Article 2026-11-02 / 2026-11-02 |
| /guides/wire-size-for-100-amp | A | page-map.csv:7 (5,013/65; 0); inventory:80 | b1; Article 2026-02-22 / 2026-11-03 | p1; Article 2026-11-02 / 2026-11-02 |
| /guides/wire-size-for-200-amp | A | page-map.csv:5 (10,776/188; 0); inventory:81 | b1; Article 2026-02-22 / 2026-11-03 | p1; Article 2026-11-02 / 2026-11-02 |
| /guides/wire-size-for-ev-charger | A | page-map.csv:10 (3,478/167; 0); inventory:82 | b1; Article 2026-02-22 / 2026-11-03 | p1; Article 2026-11-02 / 2026-11-02 |
| /guides/electrical-power-calculations | A | page-map.csv:20 (494/4; 231); inventory:74 | b1; Article 2026-02-22 / 2026-11-03 | p1; Article 2026-11-02 / 2026-11-02 |
| /guides/single-vs-three-phase | A (page.tsx); G (GuideClient.tsx) | page-map.csv:8 (4,097/20; 0); inventory:79 | b1; Article 2026-05-05 / 2026-11-03 | p1; Article 2026-11-02 / 2026-11-02 |
| /guides/power-factor-explained | A (page.tsx); G (GuideClient.tsx) | page-map.csv:11 (1,576/21; 0); inventory:78 | b1; Article 2026-05-05 / 2026-11-03 | p1; Article 2026-11-02 / 2026-11-02 |
| /about | A | page-map.csv:44 (0/0; 0); inventory:34 | b1 | p1 |
| /contact | A | page-map.csv:45 (0/0; 0); inventory:70 | b3 | p1 |
| /privacy | A | page-map.csv:46 (0/0; 0); inventory:84 | b3 | p1 |
| /terms | A | page-map.csv:47 (0/0; 8); inventory:85 | b1 | p1 |
| /disclaimer | A | page-map.csv:48 (0/0; 0); inventory:71 | b3 | p1 |

What the "other evidence" proves, and what it doesn't:
- **page-map.csv Bing figures:** the Bing Webmaster export of the www site, 97 % of impressions on www URLs (AUDIT-2026-10.md:3, :23), covering 12 months (`research/prompts/WSZ-005.txt:10`). Not dated per page.
- **page-map.csv GSC figures:** the GSC URL-prefix property https://www.wiresizes.com/, last 12 months (AUDIT-2026-10.md:13). Site-wide monthly impressions: 2,638 in March 2026, 2,194 April, 1,165 May, 230 June, 36 July, then 0 from 2026-07-06 (:18, :22). Four live routes have www impressions: / 433, the service entrance calculator 884, the electrical power calculations guide 231, /terms 8. Not dated per page.
- **inventory-2026-10.md §2 (lines 33–85):** each route existed at a99da4e (2026-05-13); `:209` gives the built lastmod values then as 2026-05-06 … 2026-05-13 (git-derived).
- **AUDIT-2026-10.md:3:** all 53 sitemap URLs crawled on 2026-10-19.
- **Site level, from git:** 6f58c08's subject says "pre-deployment"; a676ef4 (2026-02-22) "Skip TypeScript errors during production build to enable deployment"; 60ac814 and c0c540a (2026-02-24) added the Google and Bing verification files (`public/google12f8c2f9c03913a3.html`, `public/BingSiteAuth.xml`); d2d24c2 (2026-05-05) moved the canonical host to the apex (AUDIT-2026-10.md:21, D-01).
- **No old sitemap, export or audit file in research/ has per-page dates.** A grep for lastmod, datePublished, dateModified and "published" in `research/*.md` and `*.csv` finds only inventory-2026-10.md:209-211, AUDIT-2026-10.md:41 and wsz002-draft-review.md:148, all about the git mechanism.

### 2.4 dateModified under the drafted rule, today

Last commit under three readings of "the route's files" (the static imports reachable from the route's page files, followed by a scratch script):
- **(a) the page file(s) only** (today's sitemap): 74ac215 (2026-11-03) on 28 routes, 4bfdffd (2026-11-03) on the voltage drop calculator, 699de9a (2026-10-25) on /contact, /privacy and /disclaimer.
- **(b) plus the data/verified/*.json files reached:** the same as (a); the data files last changed on 2026-10-25 (ee3a82b).
- **(c) the whole local import closure** (components, engines, src/lib/verified, data; not the root layout, Header and Footer, which every route shares): 4bfdffd on 18 routes (the 15 calculators, the AWG chart, NEC 310.16, the 100 A guide), 74ac215 on 11, 699de9a on the same three.

So every reading dates 29 of the 32 routes to 2026-11-03, the day of WSZ-003b's spacing and wording commit (chat's answer 12 called that re-dating accurate). The readings differ only in which 2026-11-03 commit they pick.

## 3. Identity facts (none added)

Every author, publisher or company fact the draft (L) or the spec uses, with where it comes from and where it shows today:

1. **Author name "Marko Visic"** (ASCII, one spelling): DEVLOG.md:19 (owner), :20 (author); trust-frame-spec.md:7, :14, :52; trust-pages-copy.md:22, :33; L25, L31. Shown: `about/page.tsx:37`, `:61` ("Marko"). Not yet in any byline or JSON-LD.
2. **Credential "BSc Physics"** (byline, hasCredential) / "BSc in Physics" (prose): DEVLOG.md:20, :38 (D-03); trust-frame-spec.md:7, :14, :52; trust-pages-copy.md:22; L25, L33. Shown: `about/page.tsx:37`.
3. **School:** DEVLOG.md:20 "Faculty of Mathematics and Physics, University of Ljubljana"; trust-frame-spec.md:7 "Faculty of Mathematics and Physics, University of Ljubljana (Slovenia)" and :52 "University of Ljubljana (Faculty of Mathematics and Physics)"; trust-pages-copy.md:22 "the Faculty of Mathematics and Physics, University of Ljubljana, Slovenia"; L32 "University of Ljubljana, Faculty of Mathematics and Physics". Shown: `about/page.tsx:37-38`. One fact in four word orders.
4. **A credential left off:** trust-frame-spec.md:8 "Physics credential only on this site (pharmacy degree left off, same as hvacptcharts.com)"; D-03 (DEVLOG.md:38) "The byline uses only the physics credential". Not shown anywhere (Q15).
5. **Standing:** not a licensed electrician or engineer: trust-frame-spec.md:11; trust-pages-copy.md:24, :140, :153. Shown: `about/page.tsx:42-43`, the /disclaimer page, `Footer.tsx:220`.
6. **knowsAbout** ["conductor resistance", "electrical units and conversions", "wire gauge geometry"]: L34; trust-frame-spec.md:52. Not shown.
7. **sameAs https://www.linkedin.com/in/marko-visic/**: DEVLOG.md:20; trust-frame-spec.md:9; L35. Not in `src/` or `public/`.
8. **Owner who pushes:** Marko Visic, from his Mac: DEVLOG.md:19.
9. **Publisher and data controller "Moving Data Systems d.o.o."** (name and legalName in L30): DEVLOG.md:21, :38; trust-frame-spec.md:10, :25, :34, :39, :51; trust-pages-copy.md:41, :58, :74, :104, :113, :158; page-map.csv:44, :46. Shown: `about/page.tsx:78`, `contact/page.tsx:45`, `privacy/page.tsx:37`, `terms/page.tsx:37`, `:58`, `Footer.tsx:229`.
10. **Address "Smolnik 62, 2342 Ruše, Slovenia"** (L30 "SI"): DEVLOG.md:21, :38; trust-frame-spec.md:10, :34, :51; trust-pages-copy.md:41, :58, :74, :104. Shown: `about/page.tsx:78`, `contact/page.tsx:45`, `privacy/page.tsx:37`, `terms/page.tsx:37`.
11. **Company registration number 9041273000:** DEVLOG.md:21, :38; trust-frame-spec.md:10, :34; trust-pages-copy.md:41, :58, :74, :104. Shown: `about/page.tsx:78-79`, `contact/page.tsx:45-46`, `privacy/page.tsx:37`, `terms/page.tsx:37-38`. Not in the drafted Organization.
12. **VAT ID SI94001154** (vatID in L30): DEVLOG.md:21, :38; trust-frame-spec.md:10, :34, :51; trust-pages-copy.md:41, :58, :74, :104. Shown: `about/page.tsx:79`, `contact/page.tsx:46`, `privacy/page.tsx:37-38`, `terms/page.tsx:38`.
13. **Contact address contact@wiresizes.com** (a forwarding alias with no mailbox): trust-frame-spec.md:29; DEVLOG.md:11 (the alias is still an owner task, not checked); trust-pages-copy.md:38, :41, :54, :74, :88, :104, :143. Shown: `about/page.tsx:74`, `:79`, `contact/page.tsx:34-35` (mailto), `privacy/page.tsx:39`, `:89`, `terms/page.tsx:38`, `disclaimer/page.tsx:60`.
14. **Organization url https://wiresizes.com** (the apex, D-01): L30; trust-frame-spec.md:51.
15. **Governing law: Slovenia:** trust-frame-spec.md:39; trust-pages-copy.md:118-119. Shown on /terms.
16. **Site name:** "WireSizes.com" in `layout.tsx:22-23`, `:35-37`, `:53`, `:60`; `page.tsx:78`, `:95`; `ArticleSchema.tsx:34`, `:40`; `ArticleFAQSchema.tsx:34`, `:40`; `about/page.tsx:17`; `Footer.tsx:70`; `manifest.json:2-3` ("WireSizes.com - Wire Size Calculator", "WireSizes"). "wiresizes.com" in the trust copy, `about/page.tsx:5`, `:33` and `Footer.tsx:210` (Q14).

No fact the draft or the spec uses lacks a source in the repo. "SI" is the ISO code for Slovenia, and the PostalAddress parts (streetAddress, postalCode, addressLocality, addressCountry) split the same string.

## 4. WSZ-005 scan

`research/prompts/WSZ-005.txt` (identical to ALL-WSZ-002-011.txt lines 777–856); `L` = its line.

- **Header (L3–7): NEEDED.** The PRECONDITION names WSZ-004 TRUSTFRAME (rename if Q1 splits WSZ-004); PACK SYNC as in WSZ-004 (Q3).
- **Read first (L8–15): NEEDED.** All exist: page-specs.md "WSZ-005" (`:18-75`), the content-page references (formatting-system.md, svg-spec.md, prepublish-checklist.md), anti-slop-prose, google-ai-content-policy, `data/verified/*.json` (23 files), golden-cases.json. Missing what it builds on: `src/lib/verified/` (D-13), `src/components/content/{Val,Size,ValText,Sources,AsOf}.tsx`, `scripts/gates.config.json`, WSZ-003b report §6 (Sources per page).
- **Pages (L17–23): NEEDED.** All six routes are live; their files date from 6f58c08 (2026-02-22).
- **Hard rules (L25–36): PARTLY DONE.** `<Val>`/`<Size>` with data-src and `<Sources>` exist (1d1e349; D-15); gate c already enforces the allowlist on 4 of the 6 routes (/, /calculators, /guides, the AWG chart). STALE inside: "check-structure bans it until WSZ-008 lifts the ban" → WSZ-009 adds nec-110-14c with the termination inputs (D-06, DEVLOG §5 line 98, WSZ-003b answer 1); "verified in pack v3" → registry row nec-110-14c, pack v4.
- **1 Build to spec (L38–47): PARTLY DONE.** Done: the AWG chart's H1 and meta (13cfad1), the spec's "Remove" items (a94a71b, 699de9a), Dataset without a license (a94a71b), the engines for worked examples and gauge rows (`awg-geometry.ts` gaugeGeometry, 7331e8b), `<Val svg>`/`<Size svg>` for SVG labels (1d1e349). Remaining: the rebuilds, isBasedOn (none in `src/`; the Datasets carry `citation` text), the byline (WSZ-004). Not in the draft: the two table guides still import `data/verified/*.json` directly (`nec-table-310-16/page.tsx:7-9`, `awg-wire-size-chart/page.tsx:7,10`) and move to `src/lib/verified` in this wave (D-13, WSZ-016 answer 4). STALE: `page-specs.md:60` still says the wire size calculator is held; WSZ-016 answer 15 gives the new line for the next pack (still v4).
- **2 NFPA rules (L48–51): PARTLY DONE.** The trademark notice is in the site-wide footer (`Footer.tsx:208-211`); `<Sources>` gives the attribution.
- **3 Edition panel and editions page (L52–56): PARTLY DONE.** `adoption()` (`src/lib/verified/nec-adoption.ts`, verified rows only) exists and no page imports it; the nec-2026-edition row is verified. /guides/nec-code-compliance has 8 references outside the allowlist today (WSZ-003b report §12).
- **4 Homepage and hubs (L57–60): PARTLY DONE.** The links are complete (13cfad1; check-structure 12). Remaining: one source of truth instead of six hand-kept lists (`page.tsx:21` CALCULATOR_CATEGORIES, `calculators/page.tsx:172` ALL_CALCULATORS, `guides/page.tsx:32` and `guides/layout.tsx:10` GUIDES, `sitemap.ts:61-92`, `Footer.tsx:5-43`); the two lines under the H1 link /methodology (WSZ-004). WSZ-016 answer 15: the home title "Wire Size Calculator — NEC 310.16" (`page.tsx:14`) next to the calculator's "Wire Size Calculator — AWG / NEC 310.16" (`calculators/wire-size-calculator/page.tsx:16`).
- **5 Gates, anti-slop, Impeccable (L61): STALE.** "scripts/gates.config.json enforce" is one list per gate (D-15): necRefs.enforce has 4 of the 6 routes; numberTrace.enforce is empty, and the six count 19 (/), 5 (/calculators), 11 (/guides), 54 (AWG chart), 75 (310.16) and 9 (editions) untraced numbers on the WSZ-003c build, the footer's "100 Amp" and "200 Amp" included. "Impeccable … installed in WSZ-002" → WSZ-014 (789e3e0, D-07); its launcher has never run.
- **6 Prepublish checklist (L62): NEEDED.** `.claude/skills/content-page/references/prepublish-checklist.md` exists.
- **7 corrections.json line (L63): NEEDED.** Needs WSZ-004's corrections.json. On /about its "250–2000 kcmil" is a unit-bearing number for gate b, and "0000–40 AWG" needs `<Size>` or data-size (Q12 b).
- **8 Verify (L64–69): CONFLICT (D-16).** "the check-overflow script if it exists" → layout checks run in chat at 320 and 390 px (D-16). `npm run dates` comes from WSZ-004; "golden tests" are `npm test` (214 cases in tests/golden.test.ts).
- **9 Commit (L70): NEEDED.**
- **Definition of done (L72–78): NEEDED.** "six routes enforced with 0 hits" depends on line 5's lists.
- **DEVLOG note (L80): STALE.** "After WSZ-008 lifts the check-structure ban" → WSZ-009 (D-06; DEVLOG §5 line 98).

Not in the draft: DEVLOG §5 (line 99) gives the duplicate SVG id `wire-shadow` to WSZ-005, but it sits on the wire size calculator page (WireSizeCalculator → WireComparison → WireVisualization), which page-map.csv:32 rebuilds in WSZ-009 (Q18).

## 5. CHAT questions

Q1–Q17 concern WSZ-004 and appear as "CHAT:" lines in `research/WSZ-004.next.txt`, where they apply; Q18 concerns WSZ-005.

1. **(Q1) Split.** Split WSZ-004 into WSZ-004a TRUSTFRAME (steps 1–4 and 6, without the Methodology link) and WSZ-004b METHODOLOGY (step 5, the footer and /about links to /methodology, its sitemap entry and its enforce lists), each with its own build, gate run, DEVLOG entry and D-16 check (§1.11)?
2. **(Q2) Header lines.** Should the PRECONDITION also require that the owner pushed WSZ-003b, WSZ-003c and WSZ-017 (`git log --oneline origin/main..main` prints nothing after the fetch) and that chat's browser check of the WSZ-003c build is done? And add WSZ-017's PROCESSES line ("never stop, kill or signal a process")? The watcher started at 11:27:48 UTC on 2026-11-03 serves the WSZ-003c build on container port 3000 from about 16:39 to about 22:39 UTC, and step 8's `rm -rf .next` under it leaves its pages without CSS and JS (DEVLOG §4). Does this wave wait for that server to end, and serve its own build on container port 3000 with -H 0.0.0.0 for chat's D-16 check (D-12)?
3. **(Q3) Pack.** A pack v5 would overwrite four research files the box edited since v4 (held-waves-rules.md in WSZ-003a, trust-pages-copy.md in WSZ-003b, nec-sections-allowlist.csv and wsz002-banned-strings.txt in WSZ-003c) and delete WSZ-016-handoff.md, WSZ-003b-report.md, WSZ-017-handoff.md and WSZ-004.next.txt (INSTALL.md steps 2 and 3). Does v5 carry the four edits (and WSZ-016 answer 15's page-specs.md line) and list the four reports as exceptions?
4. **(Q4) datePublished.** Which datePublished does each route get (§2.3), or none, and where does it live: a `published` field in page-dates.json, or a hand-set list?
5. **(Q5) The date rule.** (a) Which files are "the route's files": the page file and GuideClient.tsx only (today's sitemap), plus the calculator component, the engines, the src/lib/verified modules and the data files they reach, research/data-sources.csv (it prints the Sources text), shared components such as format.ts and the Footer? Every reading gives 2026-11-03 for 29 of the 32 routes today (§2.4). (b) Which commits don't count as content changes? This wave's byline and schema edits touch every content and tool page and would date all of them to WSZ-004 (DEVLOG §4); so would WSZ-003a's import moves and WSZ-005's move of the two table guides to src/lib/verified. A list of commit hashes the script skips? (c) Run before the commit, `git log -1` can't see the commit being made, so a page changed in it keeps its old date. Date the files with uncommitted changes as today, or run the script after the commit and commit page-dates.json on its own? (d) Do the visible "Last updated: October 25, 2026" lines on /privacy and /terms (`privacy/page.tsx:33`, `terms/page.tsx:33`) come from page-dates.json, or stay hand-set and change only with the notice? /terms' file changed on 2026-11-03 for its meta description only.
6. **(Q6) Byline scope.** Which routes get the byline: the 24 content and tool pages (15 calculators, 9 guides), or also /, /calculators, /guides, the five trust pages and /methodology? Step 8 checks "every live page" (32 routes now). The {date} format: "October 25, 2026", like /privacy, /terms and the /about Corrections? Does step 8's byline check become a numbered check-structure check, like the JSON-LD checks?
7. **(Q7) "Sources below".** Only the seven calculators WSZ-003b gave a Sources section have one; the eight converters and nine guides have none, so "Sources below" would be false on 17 pages. Drop " · Sources below" there, or give those pages `<Sources>` in this wave (the converters' engines name power-definitions and nist-sp811-conversions; the guides' domains are chat's call)?
8. **(Q8) /about texts.** The rel="me" link's text and place (for example in "Who runs this site"), and the sentence that links /methodology? And trust-frame-spec.md:22 (/about item 3, "Which NEC edition", linking /guides/nec-code-compliance) is neither live nor drafted: add it now with chat's text, or leave it to WSZ-005's editions page?
9. **(Q9) Corrections log.** Besides the WSZ-002 line, does corrections.json get dated lines for later waves that changed what readers saw, such as WSZ-014 (results that no longer matched the inputs on 14 tools), WSZ-015 (the voltage drop guard and number formats) or WSZ-003b and c (unit spacing and wording)? If so, chat gives the dates and text.
10. **(Q10) /methodology scope.** One section per verified domain (32, of which 21 feed no live page today, so "what the site calculates from it" is empty), or only the domains live pages use (about 10)? And nec-110-14c: its attribution prints "110.14(C)", which check-structure 7 fails and WSZ-003b answer 1 keeps off pages until WSZ-009. Leave it out until then?
11. **(Q11) /methodology text.** Who writes "what it is", "what the site calculates" (with the formulas), "known limits" and the "Not covered yet" list: CC from the registry fields and the engines, as drafted (with the anti-slop pass), or chat, as with trust-pages-copy.md?
12. **(Q12) Gates on the new and trust pages.** (a) nec-continuous-load's attribution cites 210.19(A), 210.20(A), 215.2(A) and 230.42(A), and doe-efficiency-standards' cites 430.32(c) (10 CFR, which the gate reads as NEC); none is on the allowlist, and the coverage and notes text of 20 rows cites more (625.54, held, among them). With /methodology in necRefs.enforce, printing them fails the build. Extend the allowlist or reword the attributions in the next pack, leave those domains off the page, or keep /methodology out of necRefs.enforce? (b) numberTrace.enforce is empty, and every page counts "100 Amp" and "200 Amp" from the footer's guide links (`Footer.tsx:31-32`), so /about, /contact, /privacy, /terms, /disclaimer and /methodology would fail it as drafted; /methodology's formulas need data-src too, and WSZ-005 step 7's corrections line puts "250–2000 kcmil" on /about. Reword or trace the footer links, let gate b skip them, or leave these pages out of numberTrace.enforce for now?
13. **(Q13) Site icon.** /icon.svg is served from src/app/icon.svg (32×32, #0ea5e9), which takes the path over public/icon.svg (512, #2563eb). The manifest lists /icon.svg, and the Organization and Article logos declare it as 512×512. Which design is the site icon, for the two manifest PNGs and the logo?
14. **(Q14) Identity in metadata and tool schema.** The root metadata names "WireSizes.com" as author, creator and publisher on every page (`layout.tsx:35-37`), and the site name is "WireSizes.com" in titles, og:site_name, the WebSite node, the footer logo and the manifest, but "wiresizes.com" in the trust copy. Change author and creator to Marko Visic and publisher to Moving Data Systems d.o.o. in this wave, and which spelling does the site name take? Do the calculators' WebApplication nodes (`CombinedSchema.tsx:14-27`) get author → Person and publisher → Organization to match their byline?
15. **(Q15) Credentials.** raptive-ready (SKILL.md:31) asks for all of the author's credentials on the About page; trust-frame-spec.md:8 and D-03 show the physics credential only (the spec names a pharmacy degree it leaves off). Keep /about as it is?
16. **(Q16) Impeccable.** The devlog skill asks a design prompt to name an Impeccable command (§1 lists Impeccable; D-07: skill text only, launcher not run). Which command for the byline block and /methodology?
17. **(Q17) Snapshot.** Add `node scripts/snapshot-pages.mjs` before and after, with a `diff -r` that may differ only in the byline, JSON-LD, footer, /about and the new /methodology?
18. **(Q18, WSZ-005) `wire-shadow`.** DEVLOG §5 (line 99) gives the duplicate SVG filter id to WSZ-005, but it sits on the wire size calculator page (WireSizeCalculator → WireComparison → WireVisualization), which page-map.csv:32 rebuilds in WSZ-009. Which wave fixes it?

## 6. Commands run (read only)

```
$ git remote get-url origin                   → https://github.com/Mapstor/wiresizes.git
$ git log --oneline -1                        → 689a764 docs(wsz-003c): DEVLOG, WSZ-003b answers
$ git status --short                          → ?? .devcontainer/
$ git fetch origin                            → exit 0
$ git log --oneline main..origin/main         → (no output)
$ git log --oneline origin/main..main         → 689a764 37985a6 4bfdffd 4dadbbc 63925d1 74ac215 1d1e349
$ diff <(sed -n '681,773p' research/prompts/ALL-WSZ-002-011.txt) research/prompts/WSZ-004.txt → (no output)
$ diff <(sed -n '777,856p' research/prompts/ALL-WSZ-002-011.txt) research/prompts/WSZ-005.txt → (no output)
$ npx tsc --noEmit 2>&1 | grep -c "error TS"  → 0
$ npm test 2>&1 | tail -8
# tests 336
# suites 53
# pass 336
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 652.164333
$ python3 -I research/check_sources.py research/data-sources.csv research/page-map.csv
registry rows: 45
status: GAP=11  candidate=2  verified=32
WARN: registry 'nec-cable-rules': unknown access 'n/a'
WARN: registry 'nec-feeders-outbuildings': unknown access 'n/a'
WARN: registry 'nec-grounding-rules': unknown access 'n/a'
WARN: page '/calculators/rv-hookup-calculator': rides a GAP domain 'nec-551-rv-demand' — page must carry the gap treatment
WARN: page '/calculators/well-pump-calculator': rides a GAP domain 'nec-430-motors' — page must carry the gap treatment
WARN: page '/calculators/hot-tub-calculator': rides a GAP domain 'nec-680-pools-spas' — page must carry the gap treatment
WARN: page '/calculators/welder-calculator': rides a GAP domain 'nec-630-welders' — page must carry the gap treatment
WARN: page '/calculators/box-fill-calculator': rides a GAP domain 'nec-314-16-box-fill' — page must carry the gap treatment
WARN: page '/calculators/motor-circuit': rides a GAP domain 'nec-430-motors' — page must carry the gap treatment
WARN: page '/calculators/air-conditioner-calculator': rides a GAP domain 'nec-440-hvac' — page must carry the gap treatment
WARN: page '/calculators/horsepower-to-amps-calculator': rides a GAP domain 'nec-430-motors' — page must carry the gap treatment
WARN: page '/calculators/conduit-fill-calculator': rides a GAP domain 'nec-ch9-fill' — page must carry the gap treatment
WARN: page '/calculators/pool-pump-calculator': rides a GAP domain 'nec-680-pools-spas' — page must carry the gap treatment

RESULT: OK (13 warnings)
$ sha256sum -c --quiet research/MANIFEST.sha256 → FAILED: held-waves-rules.md, nec-sections-allowlist.csv, trust-pages-copy.md, wsz002-banned-strings.txt
$ cat .next/BUILD_ID                          → MiXoJghFAq1aMF0zDkq30
$ curl -s https://wiresizes.com/sitemap.xml   → 200 application/xml, 5,698 bytes, 32 <url>, 32 <lastmod> (12:00 UTC)
$ curl -s https://wiresizes.com/<the nine guides and /> → x-build e689101; guides: datePublished = dateModified = 2026-11-02
$ ps -eo pid,etimes,lstart,args (read only)   → next start -p 3000 since 10:39:21 UTC; the watcher since 11:27:48 UTC
```

Also run, read only, from the session scratchpad (not committed): a per-route git history and build/production date script (§2.3), a JSON-LD scan of the built pages (§1.4), a gate b listing of untraced numbers (8.3, §4), an import-closure date script (§2.4) and a gate c pass over the registry text (5.9, 5.12). Not run: build, server, browser, eslint.

## Appendix: full text of research/WSZ-004.next.txt

```text
WSZ-004 TRUSTFRAME — wiresizes.com: byline and real dates on every page, Person/Organization schema, /methodology built from the registry, corrections log, footer
CHAT: (Q1) Split WSZ-004 into WSZ-004a TRUSTFRAME (steps 1–4 and 6, without the Methodology link) and WSZ-004b METHODOLOGY (step 5, the footer and /about links to /methodology, its sitemap entry and its enforce lists), each with its own build, gate run, DEVLOG entry and D-16 check (WSZ-017 handoff §1.11)?

REPO GUARD: `git remote get-url origin` must contain "wiresizes", and the DEVLOG.md §1 domain must be wiresizes.com. Otherwise stop.
PRECONDITION: DEVLOG §6 shows WSZ-017 DRAFTCHECK as done. Otherwise stop.
CHAT: (Q2) Should the PRECONDITION also require that the owner pushed WSZ-003b, WSZ-003c and WSZ-017 (`git log --oneline origin/main..main` prints nothing after the fetch) and that chat's browser check of the WSZ-003c build is done? And add WSZ-017's PROCESSES line ("never stop, kill or signal a process")? The watcher started at 11:27:48 UTC on 2026-11-03 serves the WSZ-003c build on container port 3000 from about 16:39 to about 22:39 UTC, and step 8's `rm -rf .next` under it leaves its pages without CSS and JS (DEVLOG §4). Does this wave wait for that server to end, and serve its own build on container port 3000 with -H 0.0.0.0 for chat's D-16 check (D-12)?
SYNC: `git fetch origin`, then `git log --oneline main..origin/main`. If origin/main has commits that main lacks, stop and report.
COMMIT IDENTITY: `git -c user.name="Mapstor" -c user.email="your-email@example.com" commit ...`.
PACK SYNC: if the repo root holds a wsz-pack-vN/ folder whose N is higher than research/PACK_VERSION, install it first per its research/INSTALL.md (its own commit), then continue with this prompt.
CHAT: (Q3) A pack v5 would overwrite four research files the box edited since v4 (held-waves-rules.md in WSZ-003a, trust-pages-copy.md in WSZ-003b, nec-sections-allowlist.csv and wsz002-banned-strings.txt in WSZ-003c) and delete WSZ-016-handoff.md, WSZ-003b-report.md, WSZ-017-handoff.md and WSZ-004.next.txt (INSTALL.md steps 2 and 3). Does v5 carry the four edits (and WSZ-016 answer 15's page-specs.md line) and list the four reports as exceptions?

Read first:
- DEVLOG §0–§5 and the last 10 §6 entries
- research/WSZ-017-handoff.md (this draft checked against the code at 689a764)
- research/trust-frame-spec.md (the spec for this wave)
- research/trust-pages-copy.md (the WSZ-002 text now live on /about, /contact, /privacy, /terms, /disclaimer; WSZ-003b reworded one word of the /about Corrections line, 74ac215)
- research/data-sources.csv (the registry /methodology is generated from)
- .claude/skills/raptive-ready/SKILL.md ("Trust and author-identity standard (every site)")
- .claude/skills/seo-visibility/SKILL.md (schema guidance: "Technical rules" 4 and 5)
- .claude/skills/anti-slop-prose/SKILL.md
- the code this wave changes or builds on: src/lib/article-dates.ts, src/app/sitemap.ts, src/components/seo/ (ArticleSchema, ArticleFAQSchema, CombinedSchema, DatasetSchema, BasicPageSchema), src/app/page.tsx (Organization and WebSite JSON-LD), src/app/layout.tsx, src/components/layout/Footer.tsx, src/app/about/page.tsx, src/lib/verified/registry.ts and csv.mjs, src/components/content/Sources.tsx and AsOf.tsx, scripts/check-structure.mjs, scripts/gates.config.json, scripts/lib/build-output.mjs and gate-rules.mjs

1. Real dates
   - scripts/update-page-dates.mjs takes, for each live route, the last commit date: `git log -1 --format=%cs -- <the route's files and the data/verified/*.json files it reaches through src/lib/verified (D-13)>`. It writes the dates to src/data/page-dates.json (src/data/ holds only .gitkeep; tsconfig maps @/data/* to it).
   CHAT: (Q5a) Which files are "the route's files": the page file and GuideClient.tsx only (today's sitemap), plus the calculator component, the engines, the src/lib/verified modules and the data files they reach, research/data-sources.csv (it prints the Sources text), shared components such as format.ts and the Footer? Every reading gives 2026-11-03 for 29 of the 32 routes today (handoff §2.4).
   CHAT: (Q5b) Which commits don't count as content changes? This wave's byline and schema edits touch every content and tool page and would date all of them to WSZ-004 (DEVLOG §4); so would WSZ-003a's import moves and WSZ-005's move of the two table guides to src/lib/verified. A list of commit hashes the script skips?
   CHAT: (Q4) Which datePublished does each route get (handoff §2.3), or none, and where does it live: a `published` field in page-dates.json, or a hand-set list?
   - It runs in the box before each content commit. Vercel builds use a shallow clone, so git dates there can't be trusted.
   CHAT: (Q5c) Run before the commit, `git log -1` can't see the commit being made, so a page changed in it keeps its old date. Date the files with uncommitted changes as today, or run the script after the commit and commit page-dates.json on its own?
   - src/app/sitemap.ts: lastmod reads page-dates.json. Delete its execSync git and mtime fallbacks (sitemap.ts:2-3 and 20-59, with the build-time `new Date()` at :54-56). Never use the build time as a content date.
   - The same goes for schema and visible dates: delete src/lib/article-dates.ts (git at build time on Vercel's shallow clone, then file mtime, then a made-up '2026-01-01') and the FALLBACK_DATE constants in src/components/seo/ArticleSchema.tsx and ArticleFAQSchema.tsx (:17 and :49-50 in each). Its callers: getArticleDates in the seven guide page.tsx files and, with the GuideClient.tsx path, in single-vs-three-phase/page.tsx:13 and power-factor-explained/page.tsx:13; DatasetSchema prints the same dates on the two table guides (nec-table-310-16/page.tsx:411-412, awg-wire-size-chart/page.tsx:439-440). Every date comes from page-dates.json; where it has none, the page and its schema show none.
   CHAT: (Q5d) Do the visible "Last updated: October 25, 2026" lines on /privacy and /terms (privacy/page.tsx:33, terms/page.tsx:33) come from page-dates.json, or stay hand-set and change only with the notice? /terms' file changed on 2026-11-03 for its meta description only.
   - Add an npm script "dates".

2. Byline block, visible on every content and tool page: above the fold on guides, below the tool on tool pages.
   CHAT: (Q6) Which routes get the byline: the 24 content and tool pages (15 calculators, 9 guides), or also /, /calculators, /guides, the five trust pages and /methodology? Step 8 checks "every live page" (32 routes now). The {date} format: "October 25, 2026", like /privacy, /terms and the /about Corrections? Does step 8's byline check become a numbered check-structure check, like the JSON-LD checks?
   - Text: "By Marko Visic, BSc Physics · Updated {date} · Sources below". The name links to /about.
   CHAT: (Q7) Only the seven calculators WSZ-003b gave a Sources section have one; the eight converters and nine guides have none, so "Sources below" would be false on 17 pages. Drop " · Sources below" there, or give those pages <Sources> in this wave (the converters' engines name power-definitions and nist-sp811-conversions; the guides' domains are chat's call)?
   - "Reviewed" never appears unless DEVLOG logs a dated review.
   - Withdrawn pages get no byline (the 15 routes in research/wsz002-withdrawals.csv, which render WithdrawnTool.tsx).

3. Schema (JSON-LD, site level plus per page)
   - Organization: name and legalName "Moving Data Systems d.o.o.", url https://wiresizes.com, address (PostalAddress: Smolnik 62, 2342 Ruše, SI), vatID "SI94001154", no sameAs unless a real profile exists. It replaces the Organization "WireSizes.com" in src/app/page.tsx:74-88 (with "sameAs": [] at :87) and the Organization that ArticleSchema.tsx and ArticleFAQSchema.tsx print inline as author and publisher (:31-48). Keep its @id https://wiresizes.com/#organization, which WebSite (page.tsx:90-101), DatasetSchema (:68) and BasicPageSchema reference, and print the node on every page that references it.
   CHAT: (Q13) /icon.svg is served from src/app/icon.svg (32×32, #0ea5e9), which takes the path over public/icon.svg (512, #2563eb). The manifest lists /icon.svg, and the Organization and Article logos declare it as 512×512. Which design is the site icon, for the two manifest PNGs and the logo?
   - Person: Marko Visic.
     · alumniOf: CollegeOrUniversity "University of Ljubljana, Faculty of Mathematics and Physics"
     · hasCredential: EducationalOccupationalCredential "BSc Physics"
     · knowsAbout: ["conductor resistance", "electrical units and conversions", "wire gauge geometry"]
     · sameAs: https://www.linkedin.com/in/marko-visic/
     (check-structure 4 checks url, @id, item, logo and image values: an off-site url on alumniOf would fail it; sameAs isn't checked.)
   - Article or WebPage on content pages:
     · author → Person; publisher → Organization
     · datePublished only if git shows a real first-publish date
     CHAT: (Q4) see step 1.
     · dateModified from page-dates.json
   CHAT: (Q14) The root metadata names "WireSizes.com" as author, creator and publisher on every page (layout.tsx:35-37), and the site name is "WireSizes.com" in titles, og:site_name, the WebSite node, the footer logo and the manifest, but "wiresizes.com" in the trust copy. Change author and creator to Marko Visic and publisher to Moving Data Systems d.o.o. in this wave, and which spelling does the site name take? Do the calculators' WebApplication nodes (CombinedSchema.tsx:14-27) get author → Person and publisher → Organization to match their byline?
   - BreadcrumbList on every non-home page. Missing on /about, /contact, /privacy, /terms and /disclaimer (no JSON-LD since 699de9a) and on the new /methodology; src/components/seo/BasicPageSchema.tsx (WebPage + BreadcrumbList) has no user.
   - New numbered checks in scripts/check-structure.mjs (17 onward; postbuild already runs it) validate the shape: required keys are present (the fields this step lists). No scripts/check-jsonld.mjs (WSZ-016 answer 14). Check 4 already holds every url, @id, item, logo and image value to https://wiresizes.com, and check 5 fails on FAQPage, HowTo, SearchAction, Review and aggregateRating.

4. /about: keep the WSZ-002 text and add three things:
   - a visible rel="me" link to the LinkedIn profile;
   - the Corrections section, rendered as a dated list from src/data/corrections.json. Move the WSZ-002 line into that file; each later wave appends one line (today the line is hand-typed at about/page.tsx:65-73);
   - a link to /methodology in "Where the numbers come from" (about/page.tsx:47-56).
   CHAT: (Q8) The rel="me" link's text and place (for example in "Who runs this site"), and the sentence that links /methodology? And trust-frame-spec.md:22 (/about item 3, "Which NEC edition", linking /guides/nec-code-compliance) is neither live nor drafted: add it now with chat's text, or leave it to WSZ-005's editions page?
   CHAT: (Q9) Besides the WSZ-002 line, does corrections.json get dated lines for later waves that changed what readers saw, such as WSZ-014 (results that no longer matched the inputs on 14 tools), WSZ-015 (the voltage drop guard and number formats) or WSZ-003b and c (unit spacing and wording)? If so, chat gives the dates and text.
   CHAT: (Q15) raptive-ready (SKILL.md:31) asks for all of the author's credentials on the About page; trust-frame-spec.md:8 and D-03 show the physics credential only (the spec names a pharmacy degree it leaves off). Keep /about as it is?

5. /methodology (new page; add it to the sitemap and the footer: staticPages in src/app/sitemap.ts, sitePages in src/components/layout/Footer.tsx:46-52)
   - Generated from research/data-sources.csv through src/lib/verified/registry.ts (server only; the one CSV parser is src/lib/verified/csv.mjs; attribution() throws on rows that aren't verified, so the GAP and candidate rows need a new accessor there): one section per verified domain, giving:
     · what it is;
     · publisher;
     · edition or date (the registry has no edition column: the edition is in the source and attribution text);
     · deep link;
     · retrieved date (verified_date, as monthOf() in src/components/content/AsOf.tsx shows it);
     · what the site calculates from it, with the formula in plain notation;
     · known limits, rewritten for readers from the coverage and notes fields.
   CHAT: (Q10) One section per verified domain (32, of which 21 feed no live page today, so "what the site calculates from it" is empty), or only the domains live pages use (about 10)? And nec-110-14c: its attribution prints "110.14(C)", which check-structure 7 fails and WSZ-003b answer 1 keeps off pages until WSZ-009. Leave it out until then?
   CHAT: (Q11) Who writes "what it is", "what the site calculates" (with the formulas), "known limits" and the "Not covered yet" list: CC from the registry fields and the engines, as drafted (with the anti-slop pass), or chat, as with trust-pages-copy.md?
   - A short "Not covered yet" section lists, in plain words, the topics whose sources are still open (from the GAP and candidate rows). No status words, no build talk. (check-structure 7 fails on "110.14(C)" and "334.80", which nec-cable-rules and nec-misc-installation hold; gate a fails on "registry", "engine" and status notes site-wide; gate c on NEC references outside research/nec-sections-allowlist.csv.)
   - Formulas published here (engines in src/lib/calculations, D-13):
     · AWG diameter definition (awg-geometry.ts; awg.json definition.formula)
     · R(T) for copper and aluminum (resistance.ts)
     · voltage drop (single- and three-phase) (voltage-drop.ts)
     · DC circular mils (dc-sizing.ts)
     · ampacity correction and adjustment arithmetic (ampacity.ts)
     · the 60 °C sizing method with 240.4(D) and the 250.122(B) proportional ground (conductor-sizing.ts)
     · power and PF correction (power.ts)
     Every unit-bearing number renders through <Val> with data-src (DEVLOG §4).
   - Attribution strings come from the registry, never hand-typed (attribution() and attributionParts() in registry.ts, as <Sources> uses them).
   CHAT: (Q12a) nec-continuous-load's attribution cites 210.19(A), 210.20(A), 215.2(A) and 230.42(A), and doe-efficiency-standards' cites 430.32(c) (10 CFR, which the gate reads as NEC); none is on the allowlist, and the coverage and notes text of 20 rows cites more (625.54, held, among them). With /methodology in necRefs.enforce, printing them fails the build. Extend the allowlist or reword the attributions in the next pack, leave those domains off the page, or keep /methodology out of necRefs.enforce?

6. Footer and housekeeping
   - Footer: About · Methodology · Contact · Privacy · Terms · Disclaimer, plus the NFPA trademark notice. All but Methodology are there (sitePages, Footer.tsx:46-52; notice :208-211): add Methodology after About, and keep the "Cookie settings" button (:204-206, D-10).
   - public/manifest.json lists /icons/icon-192.png and /icons/icon-512.png, which don't exist. Remove those two entries, or generate the PNGs from public/icon.svg if that needs no new dependency. (public/manifest.json:16-25; public/icons/ holds only .gitkeep; next/og, part of next, renders PNGs.)
   CHAT: (Q13) see step 3.
   - Check that the favicon set and the custom 404 page work (report).

7. Prose: run anti-slop-prose on every new or changed sentence in this wave and report the fix count.

8. Verify
   - `npm run dates`
   - `rm -rf .next && npm run build` (all gates; add /methodology to necRefs.enforce in scripts/gates.config.json, which already holds /about, /contact, /privacy, /terms and /disclaimer; D-15: one list per gate, and gate a is enforced site-wide)
   CHAT: (Q12b) numberTrace.enforce is empty, and every page counts "100 Amp" and "200 Amp" from the footer's guide links (Footer.tsx:31-32), so /about, /contact, /privacy, /terms, /disclaimer and /methodology would fail it as drafted; /methodology's formulas need data-src too, and WSZ-005 step 7's corrections line puts "250–2000 kcmil" on /about. Reword or trace the footer links, let gate b skip them, or leave these pages out of numberTrace.enforce for now?
   CHAT: (Q2) see the header: the server on port 3000.
   - `npm test`
   - `npx tsc --noEmit` (0 errors)
   - `node scripts/check-structure.mjs` (its new required-key checks; it replaces check-jsonld.mjs)
   - a script that confirms every live page's HTML contains the byline text and an "Updated" date equal to page-dates.json
   CHAT: (Q6) see step 2.
   - Layout at 320 and 390 px: chat's browser check (D-16); in the box it stays unverified.
   CHAT: (Q16) The devlog skill asks a design prompt to name an Impeccable command (§1 lists Impeccable; D-07: skill text only, launcher not run). Which command for the byline block and /methodology?
   CHAT: (Q17) Add `node scripts/snapshot-pages.mjs` before and after, with a `diff -r` that may differ only in the byline, JSON-LD, footer, /about and the new /methodology?

9. Commit "feat(wsz-004): byline, dates, schema, methodology, corrections log". Don't push.

Definition of done (paste each output):
- the byline/date script result (live pages checked = live route count)
- the check-structure result (its new JSON-LD checks)
- the gate results with the enforced routes
- the test and tsc lines
- the /methodology section list

DEVLOG (last step): update DEVLOG.md per .claude/skills/devlog/SKILL.md for ID WSZ-004 TRUSTFRAME. Mark it done only if the verification ran and passed. Skipped tests and UI behaviour count as unverified. Also record this chat note under §4 Gotchas: "Run `npm run dates` before every content commit; append a line to src/data/corrections.json for every substantive correction." It replaces the §4 line that starts "Sitemap lastmod and Article dates come from `git log` at build"; rewrite the §1 Key paths entry "dates src/lib/article-dates.ts", and close §5's datePublished line and "[P3] WSZ-004 trust frame + /methodology". Commit DEVLOG.md with the work, and don't push. End with the §6 entry, `git status --short` and `git log --oneline -3`.
```
