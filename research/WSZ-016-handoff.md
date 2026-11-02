# WSZ-003 to WSZ-005 drafts vs the code

_WSZ-016 · 2026-11-02 · `main` @ `c96ca91` (= origin/main after the owner's push) · read only. Input for chat's final WSZ-003. The drafts are `research/prompts/WSZ-003.txt` (identical to its section in `ALL-WSZ-002-011.txt`), `WSZ-004.txt` and `WSZ-005.txt`. This file and `research/WSZ-003.next.txt` are in `research/`, the folder WSZ-013 used for its report (`research/wsz002-draft-review.md`); there is no `research/drafts/`._

Method: every step and bullet of WSZ-003 checked against the source with greps and read-only commands in the box; data names checked against `data/verified/*.json`, `research/data-sources.csv`, `research/golden-cases.json` and `research/nec-sections-allowlist.csv`. The gate estimates in §1.10 come from a throwaway script that read the existing WSZ-015 build output (`.next`, built 08:34 UTC on 2026-11-02 from `b8c746b`, whose code equals `c96ca91`). Nothing was built, served or changed under `src/`, `scripts/`, `tests/`, `data/`, `public/` or config. Line numbers refer to `c96ca91`. `L` = line in `research/prompts/WSZ-003.txt`; `calc/` = `src/lib/calculations/`.

## 0. Summary

- **WSZ-003, 71 items:** NEEDED 40 · PARTLY DONE 18 · DONE 6 · CONFLICT 6 · STALE 1.
- **WSZ-004 and WSZ-005 scan, 26 lines:** NEEDED 18 · PARTLY DONE 6 · CONFLICT 1 · STALE 1 · DONE 0 (the work earlier waves did sits inside PARTLY DONE steps; §2 names it).
- **tsc:** `npx tsc --noEmit 2>&1 | grep -c "error TS"` → `1` (`WellPumpCalculator.tsx:129`, a withdrawn component).
- **15 CHAT questions** (§3): 13 for WSZ-003, 2 for WSZ-004/005.
- Biggest gaps in WSZ-003:
  1. The draft moves the engines to `src/lib/engine/`, but DEVLOG §4 and D-11 name `src/lib/calculations/` (Q6).
  2. Deleting `nec-tables.ts` and `wire-properties.ts` breaks `calc/wire-sizing.ts` and the nine withdrawn components that import it, so step 6's "0 errors" fails (Q5).
  3. `golden.test.ts` must map all 25 groups, but no step-2 engine covers `motor-flc` (16 cases) or `breaker-sizing` (8) (Q7).
  4. `<Val>` and `<Size>` as server components can't be used inside the `'use client'` calculators, whose default results gate b reads (Q8).
  5. Enforcing gate a site-wide today means about 458 unit spacing fixes on 25 pages, plus a word in chat-written trust copy (Q12).
  6. The draft is about the size WSZ-013 flagged for WSZ-002. The proposed split is in §1.8 (Q1).

## 1. WSZ-003 step by step

Statuses: NEEDED (still to do as drafted) · DONE (commit) · PARTLY DONE (what remains) · CONFLICT (with what) · STALE (reference that doesn't exist or was renamed). The "Change" column is applied in `research/WSZ-003.next.txt`; "Q" points to §3.

### 1.1 Header lines, Read first, Tooling

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| H1 | L3 REPO GUARD | NEEDED | `git remote get-url origin` → `https://github.com/Mapstor/wiresizes.git`; DEVLOG §1 domain wiresizes.com | none |
| H2 | L4 PRECONDITION "WSZ-002 STOPBLEED as done" | NEEDED | true today (DEVLOG §6), but WSZ-014, WSZ-015 and WSZ-016 ran since | name WSZ-016 DRAFTCHECK |
| H3 | L5 SYNC | NEEDED | `git fetch origin` then `git log --oneline main..origin/main` → no output | none |
| H4 | L6 COMMIT IDENTITY | NEEDED | matches D-04 | none |
| H5 | L7 PACK SYNC | NEEDED | no `wsz-pack-*` folder in the repo root; `research/PACK_VERSION` → `v4`; `research/INSTALL.md` exists. INSTALL.md step 3 deletes repo files in `research/` that a pack lacks, except `inventory-2026-10.md` and `wsz002-draft-review.md`, so a new pack would delete this file and `WSZ-003.next.txt` | Q3 |
| H6 | L9–17 Read first | NEEDED | every path exists. Missing: `calc/fields.ts` (WSZ-014, 235cedc), `calc/format.ts` (WSZ-015, bca8d7f), `src/lib/hooks/useCalculatorForm.ts` and `useShareLink.ts` (235cedc), and the gate code `scripts/lib/build-output.mjs`, `check-banned.mjs`, `check-structure.mjs`, which steps 4–5 build on | add those paths |
| H7 | L19–22 Tooling | NEEDED | `package.json:10` test = `node --experimental-strip-types --import ./tests/register.mjs --test "tests/**/*.test.ts"`; consistent with D-05 and DEVLOG §4 (erasable TypeScript, shared node_modules) | none |

### 1.2 Step 1: verified data module

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| 1.1 | L25 create `src/lib/verified/`; imports `data/verified/*.json` with types | PARTLY DONE | folder doesn't exist. The JSON is already imported with types (`resolveJsonModule`) by 7 modules: `calc/sizes.ts:4-5`, `ampacity.ts:3-5`, `grounding.ts:3-4`, `conductor-sizing.ts:9`, `dc-sizing.ts:5`, `resistance.ts:5`, `service-lookup.ts:5-6`; and by 3 pages: `guides/nec-table-310-16/page.tsx:7-9`, `guides/awg-wire-size-chart/page.tsx:7,10`, `calculators/ground-wire-calculator/page.tsx:6` | Q4 (the pages) |
| 1.2 | L26 `awgRow`/`kcmilRow` taking nec-310-16 keys; sizes.ts mapping and display formatting move here, one copy | PARTLY DONE | one copy today: `calc/sizes.ts:14-29` (key ↔ awg.json name), `:31-33` `formatSize`, `:81-83` `conductor()` (AWG and kcmil merged: area, diameter, R20/R75 Cu and Al). No accessor returns the raw awg.json row (`diameter_in`, weights, IEC sizes, `r20_cu_ohm_per_km`). A second, legacy size formatter: `src/lib/utils/formatters.ts:1-5` `formatAwg` ("#14 AWG"), used only by `DistanceTable.tsx`, which no page renders. Golden `awg-table`, `awg-geometry` and `weight` use awg.json names ("0000") | none in the draft (the move remains) |
| 1.3 | L27 `table31016(size, column)` | PARTLY DONE | `tableAmpacity(key, material, column)` `calc/sizes.ts:118-123`; golden `ampacity-arithmetic` passes `column: "cu_90"`, which carries the material | add "It replaces tableAmpacity (sizes.ts)" |
| 1.4 | L28 `correction(ambientRow, column)`, null where no factor | PARTLY DONE | `correctionFactor` `calc/ampacity.ts:35-39` (null where no factor; throws on an unknown row); golden `ampacity-correction` (8) passes in `tests/wsz002-calculators.test.ts` | add "It replaces correctionFactor (ampacity.ts)" |
| 1.5 | L29 `adjustment(nConductors)` | PARTLY DONE | `adjustmentPercent(band)` `calc/ampacity.ts:48-52` takes a band key ("4–6"). `nec-310-15-C-1.json` rows are keyed `conductors: "4–6"` …, golden inputs use `ccc_band`, and the draft's own derating input is `cccBand` (L48) | rename to `adjustment(cccBand)`; "It replaces adjustmentPercent" |
| 1.6 | L30 `table31012(ratingA)`, null, never interpolate | PARTLY DONE | `serviceConductors` `calc/service-lookup.ts:32-34` (null, no interpolation); golden `table-310-12` (5) passes | add "It replaces serviceConductors" |
| 1.7 | L31 `egc(ocpdA, material)`, first row not exceeded, null above 6000 A | PARTLY DONE | `egcSize` `calc/grounding.ts:28-32` (via `egcForOcpd` `:23-26`: `find(row.rowA >= ocpdA)`, null above 6000 A); golden `table-250-122` (11) passes | add "It replaces egcSize" |
| 1.8 | L32 `egcProportional`, multiply first | PARTLY DONE | multiply-first is inline in step 6 of `sizeConductor`, `calc/conductor-sizing.ts:199-209` (`areaCmil(tableEgc) * areaCmil(size) / areaCmil(step2)`); `nec-250-122.json` `rule_250_122_b.method` exists; the three ratio-first catchers in `wire-size-60c` pass (PACK-CHANGES v3) | add "It replaces step 6 of sizeConductor" |
| 1.9 | L33 `gec(serviceConductorSize, material)`, awg.json area thresholds | PARTLY DONE | `gecForServiceConductor` `calc/service-lookup.ts:81-85` returns `{ cu, alCca }`; cells parsed to cmil ranges `:45-67`; golden `table-250-66` (5) passes | add "It replaces gecForServiceConductor" |
| 1.10 | L34 `max240_4D` → `{ max_ocpd_a, conditions, status }`; sizing uses rows with conditions null | PARTLY DONE | `maxOcpd240_4D` `calc/ampacity.ts:61-64` already returns that shape; `conductor-sizing.ts:148` breaks on `conditions !== null`; golden `240-4-D` (8) passes | add "(ampacity.ts)"; rename and move remain |
| 1.11 | L35 `ocpdRatings()` Table 240.6(A) | PARTLY DONE | `nec-240-6-a.json` (38 ratings from 10 A) is read directly at `calc/conductor-sizing.ts:9,51` (`STANDARD_RATINGS`), `calc/grounding.ts:4,35` (`GROUND_WIRE_RATINGS`) and `guides/nec-table-310-16/page.tsx:9` | add "It replaces the direct reads in conductor-sizing.ts and grounding.ts" |
| 1.12 | L36 `loadCalc2023` | NEEDED | no importer of `nec-220-2023.json` (status "verified") in `src/` | none |
| 1.13 | L37 `adoption()` verified rows only | NEEDED | no importer of `nec-adoption.json`; 52 rows: 51 `verified`, 1 `conflicting` (HI); `not_verified: ["HI","MS"]`; its `rules[0]` says "Render only rows with status 'verified'" | none |
| 1.14 | L38 move every importer of `nec-tables.ts` / `wire-properties.ts`, delete both; withdrawn components stay unused | CONFLICT (step 6: 0 tsc errors; tsconfig includes every `.ts`/`.tsx`) | `grep -rn "lib/data/nec-tables\|lib/data/wire-properties" src` → `calculators/wire-size-calculator/page.tsx:5` (`NEC_310_16`, used at `:40`; live route), `calc/wire-sizing.ts:6`, `:7`. `wire-sizing.ts` is imported by 9 withdrawn components (Range, Welder, WellPump, HotTub, AirConditioner, Dryer, CircuitBreaker, RVHookup, GarageSubpanel; no page imports them). Barrels `src/lib/data/index.ts` and `calc/index.ts` re-export both (no importers) | name the importers; Q5 |
| 1.15 | L39 `registry.ts`: RFC 4180 parser; `attribution(domain)` → `{ text, url, verified_date, status }`; throws on non-verified | NEEDED | `research/data-sources.csv` has the columns `attribution`, `url`, `verified_date`, `status` (45 rows: 32 verified, 2 candidate, 11 GAP; no "verified-sd2023" status at registry level, so D-09 data is unaffected). A parser exists: `scripts/lib/build-output.mjs:38-71` `parseCsv` (the gates use it) | add "scripts/lib/build-output.mjs already has one (parseCsv); keep one copy" |

### 1.3 Step 2: engines

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| 2.1 | L41 engines in `src/lib/engine/`, ENGINE_ID + DOMAINS, move WSZ-002's `src/lib/calculations/*`, no second copy of a formula | CONFLICT (DEVLOG §4 "Calculator logic goes in src/lib/calculations/*.ts", since 6164f90; §4 and D-11 name `calc/fields.ts` and `calc/format.ts`) | no `ENGINE_ID`/`DOMAINS` in `src/`. `research/held-waves-rules.md` §2 expects `src/lib/engine/`. The wildcard would also sweep `fields.ts` (WSZ-014), `format.ts` (WSZ-015), legacy `wire-sizing.ts` and `index.ts`; WSZ-002 created 12 modules (914a25a): ampacity, conductor-sizing, conversions, dc-sizing, grounding, inputs, ohms-law, power, resistance, service-lookup, sizes, voltage-drop. Second copies exist today: `COPPER_ALPHA` at `dc-sizing.ts:10` and `resistance.ts:9`; power loss at `voltage-drop.ts:90` and `resistance.ts:66`. The tests import all 12 by path, plus `fields.ts` and `format.ts` | list the 12 modules; name the two duplicates; Q6 |
| 2.2 | L42 awg-geometry | NEEDED | no `92^` formula in `src/`; awg.json `definition` has the formula and `d_0000_in`, `d_36_in`, `steps` 39; golden `awg-geometry` (8), `awg-table` (11) and `weight` (1) are not in any test | none |
| 2.3 | L43 resistance: R(T) Cu and EC-H19, per run, per 1000 ft, per km, loop | PARTLY DONE | `calc/resistance.ts:16-30` R(T), `:50-55` per 1000 ft, conductor and loop ohms, `:58-62` max length; per km missing (awg.json AWG rows carry `r20_cu_ohm_per_km`); golden `resistance` (8) passes | none (per km remains) |
| 2.4 | L44 voltage-drop: formula, parallel sets, smallest size for a target | PARTLY DONE | formula `calc/voltage-drop.ts:79-92` (75 °C R; golden `voltage-drop` (6) passes); no parallel sets (golden `parallel` (3) untested); the step-up loop exists only inside `conductor-sizing.ts:178-196`. WSZ-015's ampacity note and over-100 % guard live here (`:94-115`) and must survive | none (parallel sets and the size search remain) |
| 2.5 | L45 dc-sizing | DONE (914a25a) | `calc/dc-sizing.ts:54-76` (larger of the voltage-drop and 60 °C current sizes); golden `dc-sizing` (6) passes | drop; listed under "move these as they are" |
| 2.6 | L46 conductor-sizing + termination and wiringMethod | PARTLY DONE | base engine `calc/conductor-sizing.ts:119-226` (golden `wire-size-60c` 34 and `wire-size-errors` 7 pass); no termination input; `nec-110-14c.json` has `engine_rules` (column-cap, default-100A-or-less, default-over-100A, 75C-at-100A-or-less, 90C-final, …). Golden `wire-size-termination` (20, untested) keys: `column_c`, `size`, `ampacity`, `limited_by_240_4_D`, `egc`, as drafted | none |
| 2.7 | L47 `terminationColumn` | NEEDED | none in `src/` | none |
| 2.8 | L48 derating mode | NEEDED | golden `wire-size-derated` (4, untested) keys match the drafted fields (`vd_percent` ↔ the existing `vdPct`); `ambient_c_row` and `ccc_band` keys match the two nec-310-15 files | none |
| 2.9 | L49 ampacity-arithmetic | DONE (914a25a) | `calculateAmpacity` `calc/ampacity.ts:96-109`: table × factor × percent, `ocpdLimit` separate (14/12/10 AWG Cu, 12/10 AWG Al). Golden `ampacity-arithmetic` (4) is not yet in a test (step 3) | drop; "move these as they are" |
| 2.10 | L50 service-lookup | DONE (914a25a) | `serviceLookup` `calc/service-lookup.ts:95-102`; golden `service-lookup` (7) passes | drop; "move these as they are" |
| 2.11 | L51 power + PF correction | PARTLY DONE | kW ↔ A ↔ kVA `calc/power.ts:85-109` (golden `power` (10) passes); no PF correction (no `tan` in `src/lib`; golden `pf-correction` (2) untested) | mark kW ↔ A ↔ kVA as existing |
| 2.12 | L52 conversions | DONE (914a25a) | `calc/conversions.ts:5-8` (0.2930711, 746, 745.6999, 3516.853); golden `conversion` (5) passes | drop; "move these as they are" |
| 2.13 | L53 load-calc-2023 "if chat adds them" | NEEDED | the cases exist: `load-calc-2023` (16) and `load-calc-2023-standard` (1). `held-pages-domains.csv` notes that the standard-method group "waits on the 220.52 sentence" | replace "if chat adds them" with the two groups |

Not in the draft's list: `ohms-law.ts` and `inputs.ts` (move with the others; no golden group covers Ohm's law).

### 1.4 Steps 3 and 4: golden tests, rendering components

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| 3.1 | L56 `tests/golden.test.ts`, `count`, tolerance, `exact` | PARTLY DONE | `golden-cases.json`: `count` 214, 25 groups, per-case `tolerance` with `{"exact": true}` or `"other": "exact"`. `tests/wsz002-calculators.test.ts:115-407` already runs 13 groups (120 cases). The other 12 groups (94 cases): awg-geometry 8, awg-table 11, ampacity-arithmetic 4, pf-correction 2, parallel 3, weight 1, load-calc-2023 16, load-calc-2023-standard 1, motor-flc 16, breaker-sizing 8, wire-size-termination 20, wire-size-derated 4 | none |
| 3.2 | L57 fails if a group has no mapping | CONFLICT (step 2 lists no engine for two groups) | `motor-flc` (16; registry `nec-430-flc`, verified; data `nec-430-440-2023.json` tables 430.247–430.249 `verified-sd2023`) and `breaker-sizing` (8; `nec-continuous-load` and `nec-240-ocpd`, verified). `held-pages-domains.csv` assigns them to WSZ-011 and WSZ-009 | Q7 |
| 3.3 | L58 wsz002 test stays, rewired | NEEDED | `tests/wsz014-calculator-ui.test.ts` and `tests/wsz015-retest.test.ts` also import `calc/` (ampacity, conductor-sizing, dc-sizing, fields, format, ohms-law, power, resistance, sizes, voltage-drop) | name both files |
| 4.0 | L60 "(server components)" | CONFLICT (D-11) | all 15 live calculators are `'use client'` components whose form and default result are server-rendered, so gate b reads their numbers; a component that imports the registry (fs at build) can't run in them | Q8 |
| 4.1 | L61 `<Val>`; "the non-breaking space and the units come from one formatter" | NEEDED | no `<Val>` in `src/`. The formatter is `calc/format.ts` (D-11; 17 importers), which formats numbers only. Units are appended at call sites with U+0020 (`formatVdVolts` → "4.86 V", `tests/wsz015-retest.test.ts:209`); no U+00A0 anywhere in `src/` | name `src/lib/calculations/format.ts (D-11)`; Q9 |
| 4.2 | L62 `calc:<ENGINE_ID>` | NEEDED | depends on 2.1 | none |
| 4.3 | L63 `<Sources>` | NEEDED | none in `src/`; the `attribution` column holds the strings | none |
| 4.4 | L64 `<AsOf>` | NEEDED | `verified_date` filled for the 32 verified rows | none |
| 4.5 | L65 `<Size>` | NEEDED | `formatSize` `calc/sizes.ts:31-33` ("250 kcmil", ungrouped per D-11) is the one size formatter to use | none |

### 1.5 Step 5: gates

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| 5.1 | L68 shared parsing: tokenizer with the open-element stack; skip style, noscript, non-JSON-LD scripts; never scan the RSC payload | PARTLY DONE (6164f90) | `scripts/lib/build-output.mjs:123-195` `tokenizeHtml` (stack, script and style as raw events), `:197` `isJsonLd`, `:201` `visibleText`, `:211` `jsonLdStrings`, `:28` `htmlPages`, `:73` `withdrawnRoutes`; check-banned skips non-JSON-LD script bodies (`check-banned.mjs:6-8`, `:86-94`). `<noscript>` is not skipped, but no built page has one (0 of 49) | point to build-output.mjs; add the noscript skip there |
| 5.2 | L69 copy poolsolver's check-rendered-text.mjs (search ~ to depth 4) | STALE | `find ~ -maxdepth 4 -name check-rendered-text.mjs` → nothing (HOME=/home/node; the box mounts only the repo). The content-page skill (SKILL.md:201-208) says to reuse that poolsolver script | Q10 |
| 5.3 | L70–74 what gate a scans | NEEDED | check-banned already scans the same inputs (visible text, every attribute, JSON-LD strings, llms.txt, the OG image source; `check-banned.mjs:5-17`). The content-page spec also lists OG-image sources | build on build-output.mjs (5.1) |
| 5.4 | L75–80 what gate a flags | NEEDED | approximate counts on today's build in §1.10 | Q12 |
| 5.5 | L81 allowlist with reasons | NEEDED | check-banned has the format `<file> \| <matched text> \| <reason>` (`check-banned.mjs:21`, `:43-54`); `scripts/check-banned.allow.txt` doesn't exist | none |
| 5.6 | L82–85 gate b number trace | NEEDED | the build has no `data-src` attribute; about 1,350 unit-bearing numbers in the visible text of the 34 live pages (§1.10) | none |
| 5.7 | L86 gate c NEC refs | NEEDED | allowlist: 67 refs (64 verified, 2 verified-other-edition, 1 held: 625.54), written "310.16", "Article 120", … (kinds table, section, article). Refs outside it on live pages in §1.10 | none |
| 5.8 | L87–89 `scripts/gates.config.json` enforce/reportOnly | NEEDED | file doesn't exist; the seven routes are live. None would pass gate b today (22–161 unit-bearing numbers each); six would pass gate c (ground-wire: "NEC Article 250", "NEC 250.118") | Q11 |
| 5.9 | L90 withdrawn routes skipped | PARTLY DONE | `withdrawnRoutes()` reads `research/wsz002-withdrawals.csv` (15 slugs); check-structure and check-banned use it | none |
| 5.10 | L91 gate a site-wide, fix or allowlist | NEEDED | §1.10. DEVLOG §4: a commit touching a page file re-dates it (sitemap lastmod, Article dates) | Q12 |
| 5.11 | L91 "$" and banned strings stay site-wide | DONE (6164f90; extended by c6f6037 and b8c746b) | `check-banned.mjs:67-79` (phrases + `\$\d` over HTML, text files and live source; 0 hits at WSZ-015) | none |
| 5.12 | L92 `postbuild` runs five gates | NEEDED | `package.json:5-11` has no `postbuild`. Vercel's `npm run build` will run it too, so an enforced failure fails the deploy; check-banned needs the `typescript` devDependency there | none |

### 1.6 Steps 6–10, definition of done, DEVLOG step

| # | Draft | Status | Evidence | Change |
|---|---|---|---|---|
| 6.1 | L95 fix every tsc error ("WSZ-001 found 3; WSZ-002 may have changed the count") | NEEDED | `npx tsc --noEmit 2>&1 \| grep -c "error TS"` → `1`: `src/components/calculators/WellPumpCalculator.tsx(129,5): error TS2554: Expected 2 arguments, but got 0.` (`calculateCircuitAmps()`). It goes away if Q5 deletes the component | state the one error |
| 6.2 | L96 delete `typescript: { ignoreBuildErrors: true }` | NEEDED | `grep -n "ignoreBuildErrors" next.config.*` → `7:    ignoreBuildErrors: true,`; the block is `next.config.ts:5-8` with a comment | add "(lines 5–8, with its comment)" |
| 7.1 | L98 x-build meta | NEEDED | no `x-build` in `src/app/layout.tsx` (metadata `:15-75`; `other` exists only under `verification`) | none |
| 8.1 | L100 record "unverified: overflow (box has no browser)" in §4 | DONE (506a451) | DEVLOG §4: "The box has no Playwright/Chromium, and scripts/*.mjs audit scripts need Mac Chrome: layout checks run on the Mac, so UI work done in the box stays unverified." | drop the sentence |
| 8.2 | L100 list the exact `check-overflow-local.mjs` command in §1 Commands | CONFLICT (D-12) | `scripts/check-overflow-local.mjs:4-10`: Mac Chrome path, URLs from `/tmp/wsaudit/urls.txt` (not in the repo), rewritten to `http://localhost:3001`, 375 px viewport. D-12: the box's server is the Mac's `localhost:3022`. `check-overflow-320.mjs` is the 320 px variant (same URL file) | Q13 |
| 9.1 | L103 `rm -rf .next && npm run build` | NEEDED | not run here. A `next start -p 3000 -H 0.0.0.0` listens on container port 3000 (`/tmp/serve.log`, about 10:12 UTC); DEVLOG §4 says a rebuild under it leaves it serving pages without the new CSS and JS | Q2 |
| 9.2 | L104 `npm test`, all golden cases, 0 skipped | NEEDED | today: `# tests 170`, `# pass 170`, `# fail 0`, `# skipped 0`; 120 of the 214 golden cases run | none |
| 9.3 | L105 tsc 0 errors | NEEDED | today 1 (6.1) | none |
| 9.4 | L106 check_sources | NEEDED | today `RESULT: OK (13 warnings)` | none |
| 10.1 | L108 commit | NEEDED | — | none |
| D.1 | L110–116 definition of done | NEEDED | today the grep at L115 prints 3 lines (1.14); no x-build meta yet | none |
| L.1 | L120 §4 note: `<Val>`/`<Size>` with data-src, per-route enforcement | NEEDED | — | none |
| L.2 | L121 §4 note: golden and data files generated in chat | NEEDED | the rule is in `research/INSTALL.md:15`, not in DEVLOG §4 | none |
| L.3 | L122 §4 note: "The build type-checks now…" | CONFLICT (DEVLOG §4 "The build skips type checking (next.config.ts `typescript.ignoreBuildErrors: true`)…" and §1 Stack "the build skips type checks") | §0–§5 are rewritten in place (devlog skill) | say it replaces those two texts |
| L.4 | L123 §1 Key paths | NEEDED | §1 Key paths names `src/lib/calculations/{…}` as the engine | say the entry is rewritten |

### 1.7 Against D-01 to D-12 and the WSZ-014/WSZ-015 build

| Decision | WSZ-003 |
|---|---|
| D-01 apex | consistent (no host change; registry URLs untouched) |
| D-02 withdrawals | consistent: gates skip the 15 routes and their components stay unused. Q5: deleting the legacy data files breaks those components |
| D-03 byline, publisher | not touched |
| D-04 commit identity | same line |
| D-05 fonts, Node test runner | consistent ("add no packages"; tests on strip-types) |
| D-06 60 °C until WSZ-009 | consistent: new inputs default to 60 °C results and pages keep the 60 °C inputs |
| D-07 Impeccable | not used |
| D-08 EGC not capped | consistent: `egcLargerThanConductor` stays; the golden rules say the same |
| D-09 verified-sd2023 | consistent: `max240_4D` keeps `status`; registry statuses are only verified/candidate/GAP, so `attribution()` throwing on non-verified doesn't touch sd2023 data |
| D-10 GA4 consent | not touched |
| D-11 calculator behaviour | step 4 must use `calc/format.ts` (applied); Q9 (space before units); Q8 (`<Val>` in client components); Q6 (folder named in D-11) |
| D-12 port | Q13 (overflow script port) |

What WSZ-003 could undo or duplicate from WSZ-014 and WSZ-015:
- **Live results and server-rendered forms** (235cedc; check-structure 11; DEVLOG §4 "never wrap a calculator in `<Suspense>` or `dynamic(…, { ssr: false })`"): step 4 must add `<Val>` inside the client components without either wrapper (Q8).
- **Share helper** (`useShareLink.ts`, 235cedc): untouched by the draft; keep `CalculatorLayout`'s `shareUrl` and `actionsDisabled`.
- **`format.ts`** (bca8d7f, 2373fbe): `<Val>` must not become a second number formatter (applied). The legacy `src/lib/utils/formatters.ts` (`formatAmps` → "20A", `formatVoltage` → "120V") is already a second one; only the unrendered `DistanceTable.tsx` uses it.
- **Per-field messages** (`RESISTANCE_INPUT_MESSAGES`, `SIZING_ERROR_MESSAGES`, `POWER_ERROR_MESSAGES`, the `OHMS_LAW_*` constants; `useFieldErrors` in `useCalculatorForm.ts`): they live in the modules that move, and tests assert them. Move them with the modules.
- **WSZ-015 behaviour inside the engines:** the voltage-drop ampacity note and over-100 % guard (`voltage-drop.ts:94-115`), the wire resistance ranges (`resistance.ts:88-125`), Ohm's law's two-value rule (`ohms-law.ts`). Keep them when rebuilding.
- **check-banned's dialog check and source scan** (c6f6037, b8c746b): they stay in postbuild. Gate a reads the same inputs, so it should share `build-output.mjs` (applied).
- **check-structure's 16 checks:** they stay in postbuild. Check 7 (no "110.14(C)" or "334.80" on a rendered page, `check-structure.mjs:209-221`) means termination text in engine steps must not reach the default results before WSZ-008 and WSZ-009. WSZ-004's check-jsonld.mjs would repeat checks 4 and 5 (Q14).

### 1.8 Size: proposed split (Q1)

As drafted, WSZ-003 is about the size WSZ-013 flagged for WSZ-002. It covers:
- a new data module with 13 accessors plus a registry;
- 12 modules moved, plus new engines (geometry, PF correction, parallel sets, per km, termination, derating, load calculation, maybe motor and breaker);
- 94 newly mapped golden cases;
- four components and three gates with a config and an allowlist;
- site-wide gate-a fixes (about 500 spots on 25+ pages: §1.10);
- strict types, the build stamp and the legacy deletions.

Proposal:
- **WSZ-003a DATALAYER**: steps 1, 2, 3, 6 and 7. It touches `src/lib`, `tests/`, `next.config.ts`, the root layout and the legacy files, and no page text. Suggested extra check: the prerendered HTML of the 34 live pages is byte-identical before and after, apart from the x-build meta, which proves the move changed no number.
- **WSZ-003b GATES**: steps 4, 5 and 8, plus whatever Q12 decides for gate a. It needs 3a's ENGINE_ID, DOMAINS and registry.

Each part gets its own build, gate run and DEVLOG entry.

### 1.9 Commands run (read only)

```
$ git remote get-url origin                  → https://github.com/Mapstor/wiresizes.git
$ git log --oneline -1                       → c96ca91 docs(wsz-015): DEVLOG
$ git status --short                         → ?? .devcontainer/
$ git fetch origin; git status -sb           → ## main...origin/main   (exit 0; HEAD = origin/main = c96ca91)
$ git log --oneline a99da4e..c96ca91 | wc -l → 23
$ git log --oneline main..origin/main        → (no output)
$ cat research/PACK_VERSION                  → v4   (no wsz-pack-* folder)
$ npx tsc --noEmit 2>&1 | grep -c "error TS" → 1
  src/components/calculators/WellPumpCalculator.tsx(129,5): error TS2554: Expected 2 arguments, but got 0.
$ grep -n "ignoreBuildErrors" next.config.*  → 7:    ignoreBuildErrors: true,
$ grep -rn "lib/data/nec-tables\|lib/data/wire-properties" src
  src/app/calculators/wire-size-calculator/page.tsx:5:import { NEC_310_16 } from '@/lib/data/nec-tables';
  src/lib/calculations/wire-sizing.ts:6:import { getMinWireSize, getAmpacity, NEC_TABLE_310_16 } from '@/lib/data/nec-tables';
  src/lib/calculations/wire-sizing.ts:7:import { getWireResistance, WIRE_PROPERTIES } from '@/lib/data/wire-properties';
$ npm test                                   → # tests 170 / # pass 170 / # fail 0 / # skipped 0
$ python3 -I research/check_sources.py research/data-sources.csv research/page-map.csv → RESULT: OK (13 warnings)
$ find ~ -maxdepth 4 -name check-rendered-text.mjs → (no output)
```
Not run: `rm -rf .next && npm run build` (the prompt builds nothing), any server or browser.

### 1.10 Gate baseline on today's build (throwaway scan, approximate)

A scratch script used `scripts/lib/build-output.mjs` to read the 34 live prerendered pages (the 15 withdrawn ones skipped) and `public/llms.txt`. It used the draft's word lists and simple regexes. The real gates will differ in detail.

- **Gate a:**
  - **Units run into numbers:** about 458 visible-text tokens where a number runs straight into its unit, on 25 pages. The most common are "240V" ×39, "120V" ×31, "12V" ×29, "480V" ×18, "15A" ×15, "20A" ×15, "208V" ×12 and "100A" ×12. These include §5's form labels ("120V AC", "480V") and system names such as "208Y/120V". Attribute and JSON-LD URLs with hashes (`opengraph-image?b3d387…`) need an exemption.
  - **Inline tag run into a letter:** 30 cases, all FAQ `<span class="text-blue-600 flex-shrink-0">Q:</span>What…`: ampacity 9, voltage drop 12, wire size 9. The gap on screen is CSS, but the text reads "Q:What".
  - **Self-praise:** "accurate" 5 (amps-to-watts, btu-to-watts, kilowatts-to-amps, wire-resistance "Accurate resistance calculations", electrical-power-calculations); "comprehensive guide" 5 (3 guides); "exact" 4 ("Calculate exact wire size…" cards on 4 guides).
  - **Spec vocabulary:** "promise" 4, in the /terms meta description, also used as og and twitter text (`research/trust-pages-copy.md:97`), and in `public/llms.txt:43`. Also "promises" in the /about Corrections line (`trust-pages-copy.md:36`), if plurals count.
  - **Not found:** any status note, UK spelling, "engine", "registry", "cluster", "LLM", "honest", "trusted" or "compliant".
- **Gate b:** 0 elements with `data-src`; about 1,350 unit-bearing numbers in visible text. On the seven candidate routes: ampacity 161, wire-size 150, ground-wire 108, voltage-drop 102, wire-resistance 98, low-voltage 38, service-entrance 22.
- **Gate c:** refs outside the allowlist on live pages:
  - /guides/nec-code-compliance: 240.4, Article 250, 250.50, 250.52(A)(1)/(3)/(4)/(5), 250.118, 210.8 (as §5 says);
  - /calculators/ground-wire-calculator: Article 250, 250.118;
  - /guides/nec-table-310-16: Article 310, 310.17, 310.21;
  - /guides/single-vs-three-phase: 220.61(C);
  - /guides/wire-size-for-100-amp: 230.79;
  - /guides/wire-size-for-ev-charger: Article 625 ×3.

  Constants such as "17.002 against 10.371 Ω·cmil/ft" also matched, so gate c needs a tighter pattern than "digits.digits".

## 2. WSZ-004 and WSZ-005 scan

**WSZ-004 TRUSTFRAME**
- Header: NEEDED. Same REPO GUARD, SYNC, COMMIT IDENTITY and PACK SYNC lines as WSZ-003; the PRECONDITION names WSZ-003 DATALAYER (rename if Q1 splits it).
- Read first: NEEDED. All exist: `research/trust-frame-spec.md`, `research/trust-pages-copy.md`, raptive-ready "Trust and author-identity standard (every site)" (`SKILL.md:29`), seo-visibility, anti-slop-prose.
- 1 Real dates: NEEDED.
  - No `scripts/update-page-dates.mjs`, no `src/data/page-dates.json` (`src/data/` holds only `.gitkeep`) and no `dates` script.
  - Still to delete: git and mtime in `sitemap.ts:2,22,49`; `article-dates.ts:21` ('2026-01-01'); `FALLBACK_DATE` in `ArticleSchema.tsx:17` and `ArticleFAQSchema.tsx:17`.
- 2 Byline: NEEDED. No byline in `src/`; "Sources below" needs WSZ-003's `<Sources>`.
- 3 Schema: PARTLY DONE.
  - Done: no FAQPage, HowTo, SearchAction, Review or aggregateRating since WSZ-002 (a94a71b), enforced by check-structure 5; site URLs enforced by check-structure 4.
  - Remaining: Organization is still `name: "WireSizes.com"` with no legalName, address or vatID (`src/app/page.tsx:74-88`); Article author and publisher are that Organization (`ArticleSchema.tsx:31-45`, same in `ArticleFAQSchema.tsx`); no Person; BreadcrumbList on 27 of the 32 live pages, missing on /about, /contact, /privacy, /terms and /disclaimer.
  - Q14 (check-jsonld.mjs).
- 4 /about: PARTLY DONE.
  - Done: the honest WSZ-002 text is live (699de9a), with "Where the numbers come from" (`about/page.tsx:47`) and a hand-typed Corrections list (`:65-73`).
  - Remaining: the rel="me" LinkedIn link (none), `src/data/corrections.json` (absent), the /methodology link.
- 5 /methodology: NEEDED. No route; needs WSZ-003's `registry.ts`.
- 6 Footer and housekeeping: PARTLY DONE.
  - Done: the Footer lists About, Contact, Privacy, Terms and Disclaimer (`Footer.tsx:47-51`) and the NFPA trademark notice (`:209-210`); the 404 has one `<main>` since WSZ-015 (b8c746b).
  - Remaining: Methodology in the footer. `public/manifest.json:17,22` still lists `/icons/icon-192.png` and `/icons/icon-512.png`, and `public/icons/` holds only `.gitkeep`.
- 7 anti-slop: NEEDED.
- 8 Verify: NEEDED. The enforce list is WSZ-003's `scripts/gates.config.json`; `npm run dates` comes from step 1.
- 9 Commit: NEEDED.
- DEVLOG note: NEEDED.

**WSZ-005 FLAGSHIPS**
- Header: NEEDED. PRECONDITION: WSZ-004 TRUSTFRAME.
- Read first: NEEDED. `research/page-specs.md` "WSZ-005" (`:18-73`) and the content-page references (`formatting-system.md`, `svg-spec.md`, `prepublish-checklist.md`) exist.
- Pages: NEEDED. All six routes are live.
- Hard rules: NEEDED. They depend on WSZ-003's `<Val>`, `<Size>` and `<Sources>`; the "110.14(C)" and "334.80" ban is check-structure 7, still in force.
- 1 Build to spec: PARTLY DONE.
  - Done: the AWG chart H1 "AWG Wire Size Chart & Reference Guide" and its meta "AWG chart from 18 AWG to 4/0…" (WSZ-014, 13cfad1). The spec's "Remove" items are gone from the AWG chart (334.10, Chapter 9 Table 8, heat balance, costs), the 310.16 page (Download PDF, PE stamp, 310.15(B)(7)/(B)(5), 210.19(A), EV example) and the homepage (215.2, 90 %, arc flash, 60 %, regional, timeline), all in WSZ-002 (a94a71b, 699de9a). The homepage 150 A row was corrected (1 AWG Cu, 2/0 AWG Al) rather than removed. Both table pages keep a Dataset without a license (a94a71b).
  - Remaining: the rebuilds themselves.
  - STALE: `page-specs.md:60` says the wire size calculator "is held until its sources close. Do not imply it exists", but it has been live since 914a25a and both hubs link it (Q15).
  - The homepage title "Wire Size Calculator — NEC 310.16" still duplicates the calculator's (§5).
- 2 NFPA rules: PARTLY DONE. The trademark notice is in the site-wide footer (`Footer.tsx:209-210`); attribution needs WSZ-003's `<Sources>`.
- 3 Edition panel and editions page: NEEDED. No importer of `nec-adoption.json`; uses WSZ-003's `adoption()`.
- 4 Homepage and hubs: PARTLY DONE.
  - Done: / and /calculators link all 15 live calculators and /guides all 9 guides (WSZ-014, 13cfad1), checked by check-structure 12.
  - Remaining: the links come from hand-kept arrays (`guides/page.tsx:32` `GUIDES`; 16 hrefs in `calculators/page.tsx`), so "derived from the route list" remains; the two lines under the H1 too.
- 5 Gates, anti-slop, Impeccable: STALE. "installed in WSZ-002": Impeccable was installed in WSZ-014 (789e3e0, D-07), and its launcher has never run, so "/impeccable audit" means following the skill text. `gates.config.json` comes from WSZ-003.
- 6 Prepublish checklist: NEEDED. `references/prepublish-checklist.md` exists.
- 7 corrections.json line: NEEDED. Depends on WSZ-004.
- 8 Verify: CONFLICT (D-12). "the check-overflow script if it exists": it exists, but it runs only on the Mac (`/tmp/wsaudit/urls.txt`, `localhost:3001`; Q13). `npm run dates` comes from WSZ-004.
- 9 Commit: NEEDED.
- DEVLOG note: NEEDED.

Dependencies on WSZ-003's output:
- WSZ-004 needs `registry.ts`/`attribution()` (/methodology, "Sources below"), `<Sources>`, `scripts/gates.config.json`, the engine formulas (/methodology) and strict types.
- WSZ-005 needs `<Val>`, `<Size>`, `<Sources>`, `gates.config.json`, the engines (worked examples, gauge ratios), `adoption()` and the `nec-2026-edition` registry row.

References that don't exist yet: WSZ-004 creates its own (`update-page-dates.mjs`, `page-dates.json`, `corrections.json`, `check-jsonld.mjs`, /methodology, `npm run dates`); WSZ-005 relies on those plus WSZ-003's `gates.config.json`. Stale: "Impeccable … installed in WSZ-002" and `page-specs.md:60`.

## 3. CHAT questions

1. **(Q1) Split.** Split WSZ-003 into WSZ-003a (steps 1–3, 6 and 7) and WSZ-003b (steps 4, 5 and 8), each with its own build and gate run (§1.8)?
2. **(Q2) Running server.** Add WSZ-016's PROCESSES line ("never stop, kill or signal a process")? A `next start -p 3000 -H 0.0.0.0` (`/tmp/serve.log`, started about 10:12 UTC on 2026-11-02) listens on container port 3000, and step 9's `rm -rf .next` leaves it serving pages without their new CSS and JS (DEVLOG §4). Does anyone still need that server?
3. **(Q3) Pack install.** INSTALL.md step 3 deletes every `research/` file that a new pack lacks, except `inventory-2026-10.md` and `wsz002-draft-review.md`, and step 4's diff would list the extra files. Add `research/WSZ-003.next.txt` and `research/WSZ-016-handoff.md` to the next pack's exceptions, or delete them once WSZ-003 is final?
4. **(Q4) Pages that read the data files.** Three pages import `data/verified/*.json` directly: `src/app/guides/nec-table-310-16/page.tsx:7-9`, `src/app/guides/awg-wire-size-chart/page.tsx:7,10` and `src/app/calculators/ground-wire-calculator/page.tsx:6`. Move them to `src/lib/verified` in this wave, or in their rebuild waves (WSZ-005, WSZ-008)?
5. **(Q5) Legacy sizing code.** Rewire `wire-sizing.ts` onto `src/lib/verified`, or delete it with both `index.ts` files and the nine components? No route imports them, but tsc checks them, and step 6 needs 0 errors.
6. **(Q6) Engine folder.** DEVLOG §4 ("Calculator logic goes in src/lib/calculations/*.ts") and D-11 (`src/lib/calculations/format.ts`) name the current folder, while `research/held-waves-rules.md` §2 names `src/lib/engine/`. Move the engines and revise D-11 and §4, or keep `src/lib/calculations/` as the engine folder? Either way, do `fields.ts` and `format.ts` (form and display helpers, not engines) stay in `src/lib/calculations/`?
7. **(Q7) Golden groups without an engine.** No step-2 engine covers group `motor-flc` (16 cases; registry domain `nec-430-flc`, verified) or group `breaker-sizing` (8 cases; `nec-continuous-load` and `nec-240-ocpd`, verified). Add both engines to step 2, or exempt the two groups until WSZ-011 and WSZ-009 (then the rule above and "0 skipped" change)?
8. **(Q8) `<Val>` in the calculators.** The 15 live calculators are `'use client'` components whose default results are server-rendered (D-11), so gate b reads their numbers. May `<Val>` and `<Size>` be imported by `'use client'` components (no registry or fs import), with only `<Sources>` and `<AsOf>` server-only?
9. **(Q9) Space before units.** The calculators put a plain space (U+0020) before units, and the tests assert it ("4.86 V", `tests/wsz015-retest.test.ts:209`). Non-breaking or plain space, site-wide?
10. **(Q10) Poolsolver script.** No copy is reachable from the box (`find ~ -maxdepth 4 -name check-rendered-text.mjs` finds nothing; only the repo is mounted). Does the owner put poolsolver's `scripts/check-rendered-text.mjs` into this repo before the run, or does CC write it from the spec?
11. **(Q11) Enforce lists.** One enforce list for both gates, or one per gate? Today none of the seven routes would pass gate b (the build has no `data-src` attribute; 22 to 161 unit-bearing numbers per route), while six would pass gate c (ground-wire shows "NEC Article 250" and "NEC 250.118").
12. **(Q12) Gate a scope.** On today's build gate a would flag:
    - about 458 numbers run into their unit in visible text ("240V", "15A", "1500W") on 25 of the 34 live pages;
    - 30 FAQ "Q:" labels run into the question on 3 pages;
    - words in current copy: "accurate" 5, "comprehensive guide" 5, "exact" 4, and "promise" in the /terms meta description (`research/trust-pages-copy.md:97`) and `public/llms.txt:43`.

    Enforce site-wide in this wave (fix the spacing; allowlist or reword the words, and give the wording), or report-only until each page's rebuild? Every fixed page gets a new lastmod and dateModified (DEVLOG §4).
13. **(Q13) Overflow command.** The script reads `/tmp/wsaudit/urls.txt` (not in the repo) and opens `http://localhost:3001` at 375 px, but the box's server is the Mac's `localhost:3022` (D-12), and `scripts/check-overflow-320.mjs` is the 320 px variant. Which command goes in §1 (script, URL list, host and port), or should this step make the script read its routes from the build and take a base URL argument?
14. **(Q14, WSZ-004 step 3)** check-structure already enforces the JSON-LD URL host (check 4) and the banned types (check 5). Put WSZ-004's required-keys check there instead of a new `scripts/check-jsonld.mjs`?
15. **(Q15, WSZ-005 step 1)** `research/page-specs.md:60` says the wire size calculator "is held until its sources close. Do not imply it exists." It has been live since WSZ-002 (914a25a) and both hubs link it. What should the homepage spec say instead (next pack)?

## 4. tsc

`npx tsc --noEmit 2>&1 | grep -c "error TS"` → **1** (2026-11-02, on the WSZ-015 build's `.next/types`):
`src/components/calculators/WellPumpCalculator.tsx(129,5): error TS2554: Expected 2 arguments, but got 0.`
That equals the DEVLOG §4 baseline (3 at ee3a82b, 1 since WSZ-002).

## Appendix: full text of research/WSZ-003.next.txt

```text
WSZ-003 DATALAYER — wiresizes.com: verified data module, calculation engines, golden tests, three build gates, zero type errors
CHAT: (Q1) split this into WSZ-003a (steps 1–3, 6 and 7) and WSZ-003b (steps 4, 5 and 8), each with its own build and gate run (WSZ-016 handoff §1.8)?

REPO GUARD: `git remote get-url origin` must contain "wiresizes", and the DEVLOG.md §1 domain must be wiresizes.com. Otherwise stop.
PRECONDITION: DEVLOG §6 shows WSZ-016 DRAFTCHECK as done. Otherwise stop.
SYNC: `git fetch origin`, then `git log --oneline main..origin/main`. If origin/main has commits that main lacks, stop and report.
COMMIT IDENTITY: `git -c user.name="Mapstor" -c user.email="your-email@example.com" commit ...`.
CHAT: (Q2) add WSZ-016's PROCESSES line ("never stop, kill or signal a process")? A `next start -p 3000 -H 0.0.0.0` (/tmp/serve.log, started about 10:12 UTC on 2026-11-02) listens on container port 3000, and step 9's `rm -rf .next` leaves it serving pages without their new CSS and JS (DEVLOG §4). Does anyone still need that server?
PACK SYNC: if the repo root holds a wsz-pack-vN/ folder whose N is higher than research/PACK_VERSION, install it first per its research/INSTALL.md (its own commit), then continue with this prompt.
CHAT: (Q3) INSTALL.md step 3 deletes every research/ file that a new pack lacks, except inventory-2026-10.md and wsz002-draft-review.md, and step 4's diff would list the extra files. Add research/WSZ-003.next.txt and research/WSZ-016-handoff.md to the next pack's exceptions, or delete them once WSZ-003 is final?

Read first:
- DEVLOG §0–§5 and the last 10 §6 entries
- research/golden-cases.json
- research/nec-sections-allowlist.csv
- research/data-sources.csv
- data/verified/*.json (read the notes in each file)
- the pure modules WSZ-002 created in src/lib/calculations/ (including sizes.ts and conversions.ts), fields.ts (WSZ-014), format.ts (WSZ-015), src/lib/hooks/useCalculatorForm.ts and useShareLink.ts (WSZ-014), and tests/register.mjs
- scripts/lib/build-output.mjs, scripts/check-banned.mjs and scripts/check-structure.mjs (WSZ-002, WSZ-014, WSZ-015)
- .claude/skills/content-page/SKILL.md ("Rendering rules")
- .claude/skills/data-sourcing/SKILL.md

Tooling:
- npm works in the box, but add no packages unless this prompt names one.
- Tests use the WSZ-002 runner: `npm test`, which is node --experimental-strip-types with tests/register.mjs.
- Engine code must use erasable TypeScript only: no enums, no namespaces, no parameter properties.

1. Verified data module: one import point for every number on the site
   - Create src/lib/verified/ and record it in DEVLOG §1 Key paths. It imports data/verified/*.json with TypeScript types and exposes:
CHAT: (Q4) three pages also import data/verified/*.json directly: src/app/guides/nec-table-310-16/page.tsx:7-9, src/app/guides/awg-wire-size-chart/page.tsx:7,10 and src/app/calculators/ground-wire-calculator/page.tsx:6. Move them to src/lib/verified in this wave, or in their rebuild waves (WSZ-005, WSZ-008)?
     · awgRow(size) and kcmilRow(size), taking nec-310-16.json keys. The size-key mapping and display formatting from WSZ-002's src/lib/calculations/sizes.ts move here; keep one copy.
     · table31016(size, column). It replaces tableAmpacity (sizes.ts).
     · correction(ambientRow, column). Returns null where the table has no factor. It replaces correctionFactor (ampacity.ts).
     · adjustment(cccBand): a nec-310-15-C-1.json row key, as golden ccc_band and the derating input cccBand use. It replaces adjustmentPercent (ampacity.ts).
     · table31012(ratingA). Returns null when the rating isn't a table row. Never interpolate. It replaces serviceConductors (service-lookup.ts).
     · egc(ocpdA, material). Uses the first row not exceeded; returns null above 6000 A. It replaces egcSize (grounding.ts).
     · egcProportional(egcSize, minSize, installedSize): the 250.122(B) method in nec-250-122.json. Multiply before dividing (WSZ-002's golden cases catch the other order). It replaces step 6 of sizeConductor (conductor-sizing.ts).
     · gec(serviceConductorSize, material): Table 250.66, using area thresholds from awg.json. It replaces gecForServiceConductor (service-lookup.ts).
     · max240_4D(size, material) → { max_ocpd_a, conditions, status } for any nec-240-4-d.json row, or null. It replaces WSZ-002's maxOcpd240_4D (ampacity.ts). The sizing engine uses a row only when conditions is null; pages render only what the allowlist permits.
     · ocpdRatings(): Table 240.6(A). It replaces the direct nec-240-6-a.json reads in conductor-sizing.ts and grounding.ts.
     · loadCalc2023: typed access to nec-220-2023.json.
     · adoption(): verified rows only.
   - Move every importer of src/lib/data/nec-tables.ts and src/lib/data/wire-properties.ts to the new module, then delete both files. Withdrawn pages keep their old components unused. No live route may import the old files. The importers are src/app/calculators/wire-size-calculator/page.tsx (NEC_310_16) and src/lib/calculations/wire-sizing.ts, which nine withdrawn components import (Range, Welder, WellPump, HotTub, AirConditioner, Dryer, CircuitBreaker, RVHookup and GarageSubpanel); src/lib/data/index.ts and src/lib/calculations/index.ts re-export them.
CHAT: (Q5) rewire wire-sizing.ts onto src/lib/verified, or delete it with both index.ts files and the nine components? No route imports them, but tsc checks them, and step 6 needs 0 errors.
   - registry.ts: parse research/data-sources.csv at build time with a small RFC 4180 parser (quoted fields contain commas). scripts/lib/build-output.mjs already has one (parseCsv); keep one copy. Expose attribution(domain) → { text, url, verified_date, status }. It throws during the build if a page asks for a domain whose status is not "verified".

2. Engines in src/lib/engine/: pure functions, no React. Each module exports ENGINE_ID and DOMAINS (the registry domains it uses, all verified). Move WSZ-002's src/lib/calculations/* modules (ampacity, conductor-sizing, conversions, dc-sizing, grounding, inputs, ohms-law, power, resistance, service-lookup, sizes and voltage-drop) here and rebuild them on src/lib/verified. Don't write a second copy of any formula: today COPPER_ALPHA is in both dc-sizing.ts and resistance.ts, and the conductor power-loss formula in both voltage-drop.ts and resistance.ts.
CHAT: (Q6) DEVLOG §4 ("Calculator logic goes in src/lib/calculations/*.ts") and D-11 (src/lib/calculations/format.ts) name the current folder, while research/held-waves-rules.md §2 names src/lib/engine/. Move the engines and revise D-11 and §4, or keep src/lib/calculations/ as the engine folder? Either way, do fields.ts and format.ts (form and display helpers, not engines) stay in src/lib/calculations/?
   - Move these as they are (built in WSZ-002; their golden groups pass): dc-sizing, ampacity-arithmetic (ampacity.ts), service-lookup and conversions.
   - awg-geometry: d = 0.005 in × 92^((36 − n)/39); area in cmil and mm²; step ratios.
   - resistance: R(T) for copper and EC-H19 aluminum from the awg.json constants; per run, per 1000 ft and per km; loop resistance.
   - voltage-drop: k × L × I × R / 1000 (k = 2 single-phase, √3 three-phase); parallel sets (areas add); smallest size for a target %.
   - conductor-sizing (from WSZ-002): 60 °C column, 240.4(D), EGC by OCPD and material, voltage-drop upsizing, 250.122(B). Add optional inputs termination ('unknown' | '60' | '75') and wiringMethod ('cable' | 'conductors') that choose the column per the engine_rules in data/verified/nec-110-14c.json (cable always 60 °C; unknown → 60 °C at 100 A or less, 75 °C above; '75' only when the reader confirmed listed and identified terminations). The defaults ('unknown', 'cable') keep today's 60 °C results for every WSZ-002 golden case. Pages keep the 60 °C-only inputs until WSZ-009 adds the new ones. Golden group: wire-size-termination. For that group the result adds columnC (the column used), ampacity (the returned size's ampacity in that column) and limitedBy240_4D (true only when 240.4(D) moved the size above the first size whose column ampacity reaches the rating); golden keys column_c, ampacity, limited_by_240_4_D and egc map to them.
     · terminationColumn(ocpdA, termination, wiringMethod) is exported on its own, for the ampacity tool.
     · Derating inputs (optional): ambientRow (a Table 310.15(B)(1)(1) row key from nec-310-15-B-1-1.json) and cccBand (a Table 310.15(C)(1) row key, or null for 1–3 conductors). Start column: 90 °C for individual conductors, 60 °C for cable. Derated ampacity = start-column ampacity × the Table 310.15(B)(1)(1) factor for the start column × the Table 310.15(C)(1) percent, capped at the termination-column ampacity. The step-2 baseline becomes the smallest size whose derated ampacity is at least the rating, then 240.4(D); voltage-drop upsizing and the 250.122(B) scaling start from that baseline (increases needed for correction and adjustment never scale the EGC). Without derating inputs the results equal the plain mode. Golden group: wire-size-derated (result fields columnC, startColumnC, minSizeByAmpacity, deratedAmpacity, size, vdVolts, vdPct, meetsTarget, egc, egcUpsized, egcLargerThanConductor). Pages get these inputs in WSZ-009.
   - power: kW ↔ A ↔ kVA for single- and three-phase with PF (in power.ts since WSZ-002); PF correction (kVAR = P × (tan φ1 − tan φ2); current reduction = 1 − PF1/PF2).
   - load-calc-2023: the standard and optional dwelling methods and Table 220.55, from nec-220-2023.json. No page uses it until WSZ-010; it must still pass its golden cases (group load-calc-2023, 16 cases, and group load-calc-2023-standard, 1 case).

3. Golden tests
   - tests/golden.test.ts loads research/golden-cases.json and runs every case through the matching data function or engine, within each case's tolerance. The file's "count" field gives the number of cases; "exact" means equality.
   - It fails if any group in the file has no test mapping.
CHAT: (Q7) no step-2 engine covers group motor-flc (16 cases; registry domain nec-430-flc, verified) or group breaker-sizing (8 cases; nec-continuous-load and nec-240-ocpd, verified). Add both engines to step 2, or exempt the two groups until WSZ-011 and WSZ-009 (then the rule above and "0 skipped" change)?
   - WSZ-002's tests/wsz002-calculators.test.ts stays, rewired to the engines, and so do tests/wsz014-calculator-ui.test.ts and tests/wsz015-retest.test.ts.

4. Rendering components (server components)
CHAT: (Q8) the 15 live calculators are 'use client' components whose default results are server-rendered (D-11), so gate b reads their numbers. May <Val> and <Size> be imported by 'use client' components (no registry or fs import), with only <Sources> and <AsOf> server-only?
   - <Val v={number} unit="A" src="nec-310-16" digits={…}/> renders <span data-src="nec-310-16">20 A</span>. The non-breaking space and the units come from one formatter, src/lib/calculations/format.ts (D-11): US style, imperial first, metric in parentheses where both are shown.
CHAT: (Q9) the calculators put a plain space (U+0020) before units, and the tests assert it ("4.86 V", tests/wsz015-retest.test.ts:209). Non-breaking or plain space, site-wide?
   - Engine outputs use src="calc:<ENGINE_ID>".
   - <Sources domains={[…]} /> renders registry attribution strings, each linked to its registry URL. Never hand-typed.
   - <AsOf domain="…" /> renders "Data as of {Mon YYYY}" from verified_date.
   - Size names (14 AWG, 4/0, 250 kcmil) are names, not measurements. Render them through <Size s="4/0"/>, which checks that the size exists in awg.json or nec-310-16.json.

5. Gates (scripts/*.mjs, Node built-ins only)
   Shared parsing: the HTML tokenizer in scripts/lib/build-output.mjs (tokenizeHtml, which tracks the open-element stack, with isJsonLd, visibleText, jsonLdStrings, htmlPages and withdrawnRoutes), which check-banned.mjs and check-structure.mjs already use; add the <noscript> skip there. It skips <style>, <noscript> and every <script> except type="application/ld+json"; gates a and c read those JSON-LD blocks as JSON strings. The Next.js RSC payload contains $-prefixed tokens and must never be scanned.
   a. check-rendered-text.mjs. If a check-rendered-text.mjs from poolsolver exists on this machine (search ~ to depth 4), copy and extend it. Otherwise write it to the content-page "Rendering rules" spec.
CHAT: (Q10) no copy is reachable from the box (`find ~ -maxdepth 4 -name check-rendered-text.mjs` finds nothing; only the repo is mounted). Does the owner put poolsolver's scripts/check-rendered-text.mjs into this repo before the run, or does CC write it from the spec?
      What it scans:
      · title, meta description, og:* and twitter:* tags;
      · alt, title and aria-label attributes;
      · visible text, SVG <text> and JSON-LD string values;
      · llms.txt.
      What it flags:
      · spec vocabulary: hook, promise, wedge, information gain, fan-out, attack plan, ledger, registry, archetype, cluster, flagship, money query, engine, single-sourced, by construction, build pipeline, crawlable, crawler, LLM, citation-worthy, "cite us";
      · status notes: "coming soon", "shipping later", "now shipped", "when … ships";
      · self-praise: trusted, professional-grade, ultimate, comprehensive guide, rigorous, honest, exact, accurate (as self-description), compliant;
      · UK spellings: colour, behaviour, metre, litre, centre, aluminium, analyse, modelling;
      · joined words: a digit or a closing inline tag running straight into a letter.
      Keep an allowlist file with a reason per entry.
   b. check-number-trace.mjs. Every unit-bearing number in visible text must sit inside an element with data-src. That data-src must be a verified registry domain, or calc:<ENGINE_ID> whose DOMAINS are all verified.
      · Units: A, amps, V, volts, kV, W, kW, kVA, kVAR, VA, Ω, ohms, °C, °F, %, ft, feet, in, inches, mm, mm², m, km, cmil, kcmil, lb, kg, hp, Btu/h, ton.
      · A "$" amount counts as unit-bearing.
      · Exempt: size names inside <Size>, years, dates and NEC section numbers.
   c. check-nec-refs.mjs. Every NEC reference in rendered text ("Table 310.16", "310.12", "240.4(D)", "Article 120") must match a ref in research/nec-sections-allowlist.csv. A number followed by a unit is not a reference.
   - Staged rollout: scripts/gates.config.json has:
     · enforce: [routes] for gates b and c. Start with the WSZ-002 calculator routes whose numbers all come from engines now (wire-size, voltage-drop, ampacity, wire-resistance, low-voltage, ground-wire, service-entrance) if they pass. Otherwise start empty, and each rebuild wave adds its routes.
CHAT: (Q11) one enforce list for both gates, or one per gate? Today none of the seven routes would pass gate b (the build has no data-src attribute; 22 to 161 unit-bearing numbers per route), while six would pass gate c (ground-wire shows "NEC Article 250" and "NEC 250.118").
     · reportOnly: everything else.
     Withdrawn (noindex) routes are skipped.
   - Gate a enforces site-wide from now on: fix or allowlist what it finds. The "$" and banned-string checks from WSZ-002 also stay site-wide.
CHAT: (Q12) on today's build gate a would flag about 458 numbers run into their unit in visible text ("240V", "15A", "1500W") on 25 of the 34 live pages, 30 FAQ "Q:" labels run into the question on 3 pages, and words in current copy: "accurate" 5, "comprehensive guide" 5, "exact" 4, and "promise" in the /terms meta description (research/trust-pages-copy.md:97) and public/llms.txt:43. Enforce site-wide in this wave (fix the spacing; allowlist or reword the words, and give the wording), or report-only until each page's rebuild? Every fixed page gets a new lastmod and dateModified (DEVLOG §4).
   - package.json "postbuild" runs the three gates plus check-banned.mjs and check-structure.mjs. Report-only routes print a count; enforced routes fail the build.

6. Type safety
   - Fix every `npx tsc --noEmit` error. One is left: src/components/calculators/WellPumpCalculator.tsx:129, in a withdrawn component (WSZ-001 found 3).
   - Then delete `typescript: { ignoreBuildErrors: true }` from next.config.ts (lines 5–8, with its comment), so the build type-checks.

7. Build stamp: add <meta name="x-build" content={first 7 chars of process.env.VERCEL_GIT_COMMIT_SHA, or "local"}> to the root layout, so chat can confirm that production equals main by fetching a page.

8. Layout check: the box has no Chromium, and npm can't download one through the firewall. Don't add a browser here. The owner's Mac already has scripts/check-overflow-local.mjs (puppeteer-core with the Mac Chrome path); list the exact command in DEVLOG §1 Commands.
CHAT: (Q13) the script reads /tmp/wsaudit/urls.txt (not in the repo) and opens http://localhost:3001 at 375 px, but the box's server is the Mac's localhost:3022 (D-12), and scripts/check-overflow-320.mjs is the 320 px variant. Which command goes in §1 (script, URL list, host and port), or should this step make the script read its routes from the build and take a base URL argument?

9. Verify
   - `rm -rf .next && npm run build` (gates run in postbuild; the build now type-checks)
   - `npm test`: all golden cases pass, 0 skipped
   - `npx tsc --noEmit` reports 0 errors
   - `python3 -I research/check_sources.py research/data-sources.csv research/page-map.csv`

10. Commit "feat(wsz-003): verified data layer, engines, golden tests, rendered-text/number-trace/NEC-ref gates, strict types". Don't push.

Definition of done (paste each output):
- the golden test summary (passed = the file's count, 0 failed, 0 skipped)
- gate output: gate a hits (must be 0 after fixes/allowlist); gates b and c per route (enforced routes 0, report-only counts listed)
- the "$" and banned-string checks (0)
- the build, tsc (0 errors) and check_sources result lines
- `grep -rn "lib/data/nec-tables\|lib/data/wire-properties" src` (no output)
- the x-build meta from one built HTML file

DEVLOG (last step): update DEVLOG.md per .claude/skills/devlog/SKILL.md for ID WSZ-003 DATALAYER. Status is done only if the verification ran and passed. Skipped tests and UI behaviour count as unverified. Also record these chat notes:
- §4 Gotchas:
  · "Every unit-bearing number renders through <Val>/<Size> with data-src; gates b/c enforce per route via scripts/gates.config.json — add a route when its rebuild lands."
  · "golden-cases.json and data/verified/*.json are generated in chat; regenerate, never hand-edit."
  · "The build type-checks now; never re-add ignoreBuildErrors." It replaces the §4 line that starts "The build skips type checking" and the words "the build skips type checks" in §1 Stack.
- §1 Key paths: verified module, engines, components, gates, tests (rewrite the entry that names src/lib/calculations/ as the engine).
Commit DEVLOG.md with the work. Don't push. End with the §6 entry, `git status --short` and `git log --oneline -3`.
```

## 5. Chat answers (2026-11-02)

1. Split: yes. WSZ-003a DATALAYER = steps 1–3, 6 and 7 plus the Q5 deletions. WSZ-003b GATES = steps 4, 5 and 8 plus the rendered-text fixes; chat writes it after 3a's browser check. registry.ts moves to 3b with `<Sources>` and `<AsOf>`, its first users.
2. Running server: nobody needs it. 3a carries a PROCESSES line; rm -rf .next under it is fine; 3a serves its build on port 3000 once the port is free.
3. Pack install: WSZ-003.next.txt is deleted in 3a (its text stays in the appendix). This file stays as the WSZ-016 record; chat adds it to the next pack's INSTALL.md exceptions.
4. Pages reading data files: ground-wire-calculator moves to src/lib/verified in 3a. The two table guides move in WSZ-005, their rebuild, so an import change doesn't re-date them.
5. Legacy sizing code: deleted in 3a with both barrels, the nine withdrawn components, DistanceTable.tsx and utils/formatters.ts. Those pages get new components from the engines in WSZ-009 to WSZ-011.
6. Engine folder: src/lib/calculations/ stays (D-13); fields.ts, format.ts and inputs.ts stay there as helpers.
7. motor-flc and breaker-sizing: both engines are built in 3a; the golden rule stays at 214 cases, 0 skipped.
8. `<Val>` and `<Size>` may be used in 'use client' components; `<Sources>` and `<AsOf>` are server-only (D-15).
9. Space before units: plain U+0020 site-wide; `<Val>` keeps value and unit on one line with white-space: nowrap (D-14).
10. Poolsolver script: not needed; 3b writes check-rendered-text.mjs from the spec on build-output.mjs.
11. Enforce lists: one per gate (D-15).
12. Rendered-text gate: enforced site-wide from 3b, which fixes the number–unit spacing and the "Q:" joins and rewords the flagged words with wording chat gives from 3a's list. Those pages' visible text changes, so re-dating them (DEVLOG §4) is accurate.
13. Overflow command: none (D-16).
14. WSZ-004: the required-key checks go into check-structure.mjs as new numbered checks; no check-jsonld.mjs.
15. WSZ-005: the next pack's page-specs.md homepage line reads: "The wire size calculator is live at /calculators/wire-size-calculator (WSZ-002). The homepage links to it near the top. The homepage title and H1 must not repeat the calculator's title (today both are 'Wire Size Calculator — NEC 310.16')."
