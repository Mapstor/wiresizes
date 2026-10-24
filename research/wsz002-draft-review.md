# WSZ-002 draft vs the code

_WSZ-013 · 2026-10-24 · `main` @ `506a451` (page code identical to `a99da4e`) · read only. Input for chat's final WSZ-002; the draft is `research/prompts/WSZ-002.txt`._

Method: each draft step checked against the source with greps and throwaway scripts in the box (not committed); every replacement value checked against `data/verified/*.json`; production checked 2026-10-24 07:40 UTC. Line numbers refer to `506a451`. `p` = the route's `page.tsx`, `GC` = its `GuideClient.tsx`, `C` = its calculator component in `src/components/calculators/`. Nothing under `src/`, `public/` or config was changed.

## 1. Fix in the draft before issuing it

1. **The tsc check in step 8 can't pass as drafted.**
   - 3 errors exist today, and no step fixes them:
     - `WellPumpCalculator.tsx:129`: `calculateCircuitAmps()` is called with no arguments, and its return value is discarded.
     - `WireSizeCalculator.tsx:34` and `:104`: the `WireSizeInput` state literal lacks `material`.
   - `tsconfig.json` includes `**/*.tsx`, so a withdrawn, unused component is still type-checked.
   - Fix: add a line that fixes these three.
2. **Step 6 starts from a wrong premise.**
   - `LowVoltageCalculator.tsx` contains no circular-mil formula. `calculateLowVoltage` (`:171-213`) computes VD = 2·I·R·L/1000 from an inline 7-row table (`:80-88`: 22–10 AWG, R ≈ 20 °C, 12 AWG diameter 2.053 mm).
   - It skips sizes by invented `max_amps_12v` / `max_amps_24v` limits. When nothing fits, it still recommends 10 AWG and only adds a warning: for 33.3 A over 40 ft at 2 %, it recommends 10 AWG and warns that the drop (about 22 %) exceeds the limit.
   - The "CM = I × L / VD" error is in the page text:
     - worked example `low-voltage-calculator/p:313-341` ("(33.3A × 80ft) ÷ 0.24V = 11,100 CM", #10/#8, "50A breaker");
     - FAQ `p:34` ("Wire Gauge = (Current × Distance × 2) ÷ (Voltage Drop × 12V)");
     - two ampacity/distance tables at `p:460-530`.
   - Suggested wording for step 6:
     - delete the example, the FAQ and the tables;
     - make the tool compute CM = 2·K·I·L/VD at 75 °C (the UI has no temperature input) and pick the smallest `awg.json` size with `area_cmil` ≥ CM. The size list must reach 0000, because the golden answer is 3/0;
     - remove `max_amps_*`;
     - when no listed size meets the drop, say so instead of recommending the largest.
3. **The golden test can't import the logic as drafted.**
   - The logic sits in a React hook inside a `'use client'` `.tsx` file.
   - Node v22.23.3 in the box strips TypeScript types with no flag. Checked 2026-10-24: both `node x.ts` and an `.mjs` importing a `.ts` run.
   - Suggested approach:
     - put the pure function in `src/lib/calculations/low-voltage.ts`, with no `@/` imports, no JSX and no enums;
     - pass the size rows in as an argument: the component imports `awg.json`, and the script reads it with `fs`;
     - `scripts/golden-lowvoltage.mjs` then imports `../src/lib/calculations/low-voltage.ts`.
   - Passing the rows in avoids differences in JSON import attributes between Node and Turbopack.
4. **FAQPage JSON-LD is missing from step 1.**
   - 30 calculator pages emit FAQPage built from `src/data/calculator-faqs.ts` (150 answers) through `CombinedSchema`. None of these pages shows the answers.
   - The answers carry unverified values (e.g. `:123` and `:577` give R = 10.4 × L ÷ cmil).
   - Hidden FAQ markup breaks Google's structured-data rules, and step 5's value rules can't be applied to text no reader sees.
   - Add: stop emitting FAQPage on calculator pages. trust-frame-spec marks FAQPage as optional.
5. **Other JSON-LD the draft doesn't name:**
   - **Dataset:** `license: CC BY 4.0` and `creator: WireSizes.com` on the NEC Table 310.16 data (`src/components/seo/DatasetSchema.tsx:68-73`, used on /guides/nec-table-310-16 and /guides/awg-wire-size-chart). That relicenses NFPA's table, which the DEVLOG §4 rule forbids. Remove the license and creator, or drop the Dataset until WSZ-005.
   - **WebSite SearchAction → `/search?q=`** (`src/app/page.tsx:204-209`, `src/app/not-found.tsx:225-242`): no /search route exists. "Keep WebSite if accurate" needs "remove the SearchAction".
   - **Organization contactPoints:** support@ (`src/app/page.tsx:186-189`); support@, consulting@, legal@, education@ (`contact/p:266-293`); `foundingDate: "2024"` (`about/p:54`).
   - **Article / ArticleFAQ author and publisher** = Organization "WireSizes.com" (`ArticleSchema.tsx:31-45`, `ArticleFAQSchema.tsx:37-51`). That isn't a legal entity. Say whether WSZ-002 deletes both or switches now to Person Marko Visic + Organization Moving Data Systems d.o.o. (trust-frame-spec; otherwise WSZ-004).
   - **aggregateRating and Review:** none in the code, so that item is a no-op.
   - **HowTo:** `HowToSchema` runs on 6 guides; 4 of them survive (100-amp, 200-amp, ev-charger, nec-code-compliance). Their `HOWTO_*_STEPS` arrays feed only the schema, so the arrays go too.
6. **The banned list misses live variants** (it is matched literally):
   - Already listed in inventory §4.2:
     - "(PE) stamp" (`disclaimer/p:199`);
     - "NEC 2026 edition publishes" (`guides/p:304`);
     - "most recent published edition" (`guides/p:302`, `public/llms.txt:102`);
     - "2/0 aluminum for dwe…" (`wire-size-calculator/p:236`).
   - "NEC Compliant" and "NEC 680 Compliant":
     - mobile menu `Header.tsx:124`;
     - `<Badge>` at `guides/wire-size-for-200-amp/p:99`;
     - og:title at `circuit-breaker-calculator/p:14`;
     - 10 more calculator pages, the home page and the /calculators hub (inventory §4.1).
   - `privacy@wiresizes.com` (4×) and `dpo@wiresizes.com` (2×) are not on the list. A simpler gate: any `@wiresizes.com` address other than contact@ fails.
7. **check-banned can't see three places where claims live:**
   - (a) the OG/Twitter image text is drawn into a PNG (`src/app/opengraph-image.tsx:115`);
   - (b) result panels render only after "Calculate", so their text never reaches the prerendered HTML;
   - (c) 5 calculators are client-only (`dynamic(…, { ssr: false })`), and their HTML holds only "Loading calculator…": three-phase, box-fill, btu-to-watts, electrical-load, garage-subpanel.

   Fixes:
   - add a scan of `src/**/*.{ts,tsx}` and `public/` text files for the phrase list. Keep the "$ + digit" rule HTML-only.
   - delete `public/images/og-template.html`: a crawlable static page carrying "NEC Compliant" that the build scan never reads.
8. **Redirect facts:**
   - `/calculators/ac-wire-size` → `/calculators/air-conditioner-calculator` already exists (`next.config.ts:71-75`) and has no route folder. So 6 folders get deleted, not 7.
   - No new rule chains onto an existing one.
   - But 3 of the 7 targets are pages this same prompt withdraws (noindex):
     - hot-tub-wire-size → hot-tub-calculator;
     - electrical-load → residential-load-calculator;
     - ac-wire-size → air-conditioner-calculator.
   - Three older redirects also land on withdrawn pages (`next.config.ts:42-60`): /calculators/conduit-fill, /pool-pump and /horsepower-to-amps.
   - If that's intended (the merged pages return in WSZ-010/011), say so, so that CC doesn't "fix" it.
9. **Withdrawn pages keep their old Open Graph text.**
   - The draft keeps the meta title and rewrites the description.
   - 3 withdrawn pages set their own `openGraph` block: box-fill, horsepower-to-amps and circuit-breaker. The circuit-breaker one says "NEC Compliant Breaker Sizing Tool".
   - The other 11 inherit the root block (`src/app/layout.tsx`: "Professional tools for electricians and DIY").
   - Say: og:title and og:description follow the new meta, or the per-page block is dropped.
10. **`awg.json` field names differ for kcmil rows** (step 5, wire resistance):
    - AWG rows have `r20_cu_ohm_per_1000ft` (HB100) and `r75_cu_solid_ohm_per_1000ft_derived`.
    - kcmil rows have `r20_cu_ohm_per_1000ft_derived` and `r75_cu_solid_equiv_ohm_per_1000ft_derived`, so kcmil copper at 20 °C is also "calculated".
    - The component's table includes 250 kcmil labelled `awg: '250'` (`WireResistanceCalculator.tsx:30`).
11. **The prompt is very large.** As drafted, WSZ-002 edits about 45 page files plus the Header, Footer, OG image, JSON-LD, sitemap and llms.txt, and adds two scripts.
    - Consider splitting it into two prompts, each with its own build and gate run:
      - A: site-wide claims, redirects, withdrawals, trust pages and gates;
      - B: per-page fixes and the low-voltage rewrite.

## 2. Before running: owner steps and decisions

- **Push WSZ-001.** `git fetch` on 2026-10-24: `origin/main` is still `a99da4e` (`506a451` not pushed).
- **Canonical host (D-01) is still open.**
  - Production on 2026-10-24 07:40 UTC is unchanged since 2026-10-20: `https://www.wiresizes.com/guides/awg-wire-size-chart` → 308 → apex, and the apex serves 200 with an apex canonical.
  - If www canonicals deploy before the Vercel primary domain is flipped, every canonical and sitemap URL points at a URL that redirects to a page declaring the other host.
  - The owner steps should say: flip the primary domain to www (apex → 308 → www) in the same sitting as the push. If the owner keeps the apex, step 2 drops out.
- **contact@wiresizes.com alias:** step 7 makes it the only published address (/contact, /privacy, Organization schema). It has to exist before the push.
- **GA4 and the "lawful basis" line on /privacy:**
  - gtag (`src/app/layout.tsx:79-90`) loads on every page and sets cookies with no consent step.
  - /privacy can't name an honest lawful basis for that until the owner picks: drop GA4 (Vercel Web Analytics stays), or add consent before it loads.
  - Google Fonts via CSS `@import` also sends each visitor's IP to Google. Self-hosting needs the font files fetched outside the box, because fonts.googleapis.com is blocked here.
- **D-03 "no registration number or VAT ID":** AUDIT §9 item 4 leaves this to the accountant (EU e-commerce disclosure). The draft's DEVLOG notes record it as decided.

## 3. Step-by-step notes

### Step 1: site-wide
- **Badge map:** inventory §4.1. Main sources:
  - Header trust bar `Header.tsx:18-36`, "FREE / Always" `:71-72` and `:80-81`, mobile `:124` and `:128`;
  - Footer blurb `:87-90`, badge row `:91-95`, bottom line `:309`;
  - OG image `opengraph-image.tsx:115` (`twitter-image.tsx` re-exports it).
- **Footer "Industry Standards & Authority Links":** starts at `Footer.tsx:238`. It links the homepages of NFPA, UL, copper.org, aluminum.org and IAEI.
- **Usage bars:** `popularity:` fields in `calculators/p:73-…`.
- **Read-time and level badges:** `GUIDES` in `guides/p:12-79`.
- **Stats:** `guides/p:137-142` ("50,000+ Engineers Educated", "29 Professional Calculators", "6 Comprehensive Guides", "NEC 2023 / Code Compliant").
- **Emoji:** 127 emoji/pictograph characters (U+2600–27BF, U+1F300–1FAFF) in 26 `src` files; 29 headings in 7 files contain one. The heaviest files are 200-amp (20), privacy (16), home (15), ev-charger-wire-size (12) and box-fill (11).
- **NEC table PDF:** none exists. "Download NEC Table 310.16 PDF" is a dead `<button>` in `nec-table-310-16/p:461-472`.
- **Metas:** home description `src/app/page.tsx:25` ("30+ tools used by licensed electricians"); root description in `layout.tsx` ("Professional tools for electricians and DIY").
- **llms.txt:** 20 of its entries point at redirected or withdrawn pages (Appendix A).

### Step 2: www
- **No single site constant.** The apex literal appears 140× in 61 `src` files, 48× in llms.txt and once in robots.txt. Constants:
  - `metadataBase` (`layout.tsx:9`);
  - `sitemap.ts:6`;
  - `ORIGIN` in `BasicPageSchema.tsx:14`, `DatasetSchema.tsx:45` and `HowToSchema.tsx:26`;
  - `src/utils/breadcrumbs.ts:62`;
  - per-page `webAppData.url` literals (34 calculator pages) and absolute `openGraph.url` on 13 pages.
- **Suggestion:** export one `SITE_URL`, use it everywhere, and gate on zero `https://wiresizes.com` in `src/`, `public/` and the build output. Step 8 checks only canonicals and the sitemap, so og:url, JSON-LD and llms.txt would slip through.
- `next.config.ts` `images.remotePatterns` names only `wiresizes.com`.

### Step 3: redirects
- `trailingSlash` is unset (false): write sources without a slash, like the 11 existing rules.
- **Folders to delete:**
  - `calculators/{ev-charger-calculator, ev-charger-wire-size-calculator, hot-tub-wire-size-calculator, electrical-load-calculator}`;
  - `guides/{wire-sizing-guide, electrical-safety}`.
- **Components orphaned by the deletions:** `EVChargerCalculator.tsx`, `EVChargerWireSizeCalculator.tsx`, `HotTubWireSizeCalculator.tsx`, `ClientElectricalLoadCalculator.tsx`, `ElectricalLoadCalculator.tsx`. Say whether to delete them or leave them unused (tsc still checks them).
- **sitemap.ts:** hard-coded lists at `:61-114`. `TOP_CALCULATORS` (`:118-124`) and `TOP_GUIDES` (`:126-132`) name three redirect sources.
- **Internal links:** 26 surviving files reference a redirected or withdrawn slug (Appendix A). Heaviest: Footer (20), llms.txt (20), /calculators (19) and home (12). The guides sidebar is `src/app/guides/layout.tsx:44` and `:52`.

### Step 4: withdrawals
- All 14 slugs are routes. Every `links` target stays live: /guides/nec-table-310-16, /guides/awg-wire-size-chart, /calculators/voltage-drop-calculator and /calculators/kilowatts-to-amps-calculator.
- **Anchor H1s:** "NEC Table 310.16", "Complete AWG Wire Size Chart & Reference Guide", "Voltage Drop Calculator", "Kilowatts to Amps Calculator". The AWG chart isn't complete (it stops at 18 AWG and 4/0, per the audit).
- **Kept H1s:** the welder page's H1 is "Professional Welder Calculator", which is self-praise.
- **Kept meta titles:** 11 of the 14 carry NEC references that aren't in `nec-sections-allowlist.csv` (well-pump, dryer and rv-hookup don't):
  - "— NEC 220.55", "— NEC Article 630", "— NEC 314.16", "— NEC Article 680", "— NEC 680", "— NEC 440";
  - "— NEC Article 430", "— NEC 430.248", "— NEC 240", "— NEC Chapter 9", "— NEC 220.82 / 220.83".

  WSZ-003's reference gate will flag them. Decide now: keep or trim.
- **Dates:** `sitemap.ts` and `src/lib/article-dates.ts` read `git log` per page file. Every page WSZ-002 touches will get the WSZ-002 commit date as its lastmod and dateModified.

### Step 5: where each item is
"Not in the draft" = audit P0/P1 items on the same page that the draft's list leaves out. The draft says to apply every P0/P1 item, so say whether these go too.

| Page | Draft items found at | Not in the draft / notes |
|---|---|---|
| /guides/wire-size-for-200-amp | meta+intro `p:42`; "NEC 2024" `p:96`; "3/0 Cu and 4/0 Al … 200 A" `p:60`; VD table `p:456-465`; conduit sizes `p:293-296`, `:413`, `:547`, `:718`; costs `p:72`, `:330-364`, `:536-548`; "2,000 sq ft" / "60–70%" `p:155`, `:209` | Badge "NEC Compliant" `p:99`; HowTo `p:817` + `HOWTO_200A_STEPS p:8-37` |
| /guides/wire-size-for-100-amp | meta `p:32`, `:55`; attic 88% `p:421`; GEC #6 `p:129`, `:395`; `WIRE_SIZE_BY_DISTANCE p:69-76`; "THHN-2" `p:425`; `COST_COMPARISON p:115-120` | "#4 Cu only 85 A" `p:501` (P1) |
| /guides/nec-table-310-16 | 200 A row `p:75` (`COMMON_APPLICATIONS p:68-76`); EV example `p:73`, `:515-520`; PE line `p:571`; 310.15(B)(7) `p:565`, `:569`; 310.15(B)(5) `p:597`; 210.19(A)/215.2(A) `p:613`; download block `p:461-472` | Rows come from `NEC_310_16` (`src/lib/data/nec-tables.ts`, no 700/800/900 or >1000 kcmil) and `TEMP_DERATING p:43-55`. Adding the rows means this page reads `data/verified/nec-310-16.json` and `nec-310-15-B-1-1.json` |
| /guides/awg-wire-size-chart | resistance header `p:167`; 2.053 `p:122`, 4.116 `p:138` (quick cards); stranding `p:732`; 334.10 `p:731`; heat balance `p:762`; costs `p:427-…` | "R20 = 1.588 (Chapter 9 Table 8)" `p:518`, `:772-773`; "8–15% larger", "19 strands above 1/0" `p:726-733`; "NEC Chapter 9 Table 10" `p:732` (not allowlisted); card "6 AWG → 60A, EV chargers" `p:140`. The chart rows come from `src/lib/data/wire-properties.ts` / `nec-tables.ts` (`p:20-21`). Editing those also moves the voltage-drop engine, so point the page at `awg.json` instead |
| /calculators/wire-size-calculator | `TEMP_CORRECTION p:131-138` (`:613`); ×0.82 `p:134-136`, `:630`; ground 14 AWG `p:228`; 2/0 Al `p:236`; max distance `p:219`, `:520`; 13% `p:220`; halves `p:248`; `WIRE_COST_COMPARISON p:175-183` | tsc fix `C:34`, `:104` |
| /calculators/ampacity-calculator | factors `p:44-88`, `:111-119`; 130 A `p:76`, `:262`; 110/125/150 °C `p:598-600`; rooftop `p:124`, `:230`, `:868`; altitude `p:144`, `:249-250`; 20 °F `p:62`, `:69`, `:628`; burial `p:72`, `:101`, `:174`, `:285-286`, `:854` | — |
| /calculators/garage-subpanel-calculator | 125 A EGC `p:48-50`, `:148`; `VOLTAGE_DROP_TABLE p:162-171`; `INSTALLATION_COSTS p:153-160` + example costs; 225.x `p:32-…`, `NEC_225_REQUIREMENTS p:86-143`; demand factors `p:28-78`, `C:118` | Client-only page: the tool's text isn't in the HTML |
| /calculators/wire-resistance-calculator | table `C:16-35`; 0.206 `p:251`, `:257`; RF/3.31 `p:38`, `:204`, `:374-409`, `:629`, `:684`; default 0 `C:99-104`; kcmil as AWG `C:30` | "0.410", "2.57", Al 1.29 `p:293`, `:341`, `:344`, `:592` |
| /guides/single-vs-three-phase | 0.609 `GC:1282`; matrix/costs `GC:35-101`; 3 hp / 25 kW `GC:16`, `:64`, `:405`, `:828`, …; 408 V `GC:1165` | "1/3 the wire diameter", "70% less copper", 50 hp sentence `GC:1186-1222` (P1) |
| /guides/wire-size-for-ev-charger | credit `p:670`; rebates/costs `p:629-650`; "Most homes need 200A service" `p:64` (FAQ); long-run table `p:445-524`; "6 AWG … 75 ft" `p:76`, `:520` | "Sarah", "JuiceBox" `p:11`, `:23`; Tesla/ChargePoint specs `p:43`, `:367`, `:417`. There is no `data/verified` file for mfr-evse, so they're deleted under the draft's rule |
| /calculators/kva-to-amps-calculator | wire/breaker columns `p:127-…`; 450.3 `p:645`, `C:512-514` | — |
| /calculators/three-phase-calculator | `MOTOR_SIZING_GUIDE p:119-174`; 50 hp `p:25-28`, `:148`, `:252`, `:272`; `POWER_FACTOR_CORRECTION p:219-248`; tool calls `calculateWireSize` (`C`) | Client-only page |
| /calculators/kilowatts-to-amps-calculator | 8 kW `p:324`; PF table; "PF > 1.0" / leading `p:186`, `:312`, `:525-562`, `:829` | "VD 5% feeders / 3% branch" `p:734` (P0) |
| /calculators/amps-to-watts-calculator | "6.84HP" `p:35` (the audit's "≈ 7 hp"); 220.54 `p:155`, `:537` | — |
| /calculators/volts-to-amps-calculator | EV on 10 AWG `p:214-244`, `:392`; 83.3 A on 3 AWG `p:255-256`; 36.6 A `p:763`, `:768` | — |
| /calculators/watts-to-amps-calculator | The audit names no specific wrong example for this page | Name what to delete, or drop it from this line |
| /calculators/ohms-law-calculator | "+40%" `p:346` | — |
| /calculators/btu-to-watts-calculator | MCA/MOP `p:308`, `:681-682`, `:764`; SEER/HSPF `p:50`, `:291-320`, `:486-496`; fuel / $ `p:336`, `:424`, `:457`, …; 0.875 `p:299`, `:324`, `:329`, `:496`; rules of thumb `p:349`, `:408`, `:580-600` | Client-only page |
| /guides/power-factor-explained | `EQUIPMENT_POWER_FACTORS GC:8-18` (`:333`); `COST_ANALYSIS_DATA GC:50-57` (`:434-496`) | — |
| /guides/electrical-power-calculations | Example 5 `p:582-602`; refrigerator `p:620-627`; "efficiency" `p:240-243`, `:370-404`, `:536`; 73% `p:389`; 25 hp `p:535-541` | "18 % less I²R" + "$2,500 capacitor bank, payback ~6.5 yr" `p:576-578` |
| /calculators/voltage-drop-calculator | `TEMPERATURE_CORRECTIONS p:199-208`; PF `p:164-166`, `:223-231`, `:864`, `:1286`; parallel `p:1228-1237`; 8% / 10% `p:46`, `:68`, `:79`, `:211-220`; costs `p:234-240`, `:1037-…` | "200 A at 150 ft" is written "350 MCM" (FAQ `p:289`), not "350 kcmil" |
| /calculators/service-entrance-calculator | utility `C:167-203`, `p:228-294`, `:510`; costs `p:296-307`, `p:30-117`; 220.82 `C:95`, `:110` and `calculator-faqs.ts:629`; GEC 4 AWG `C:205-211`; "3 ft wide" `p:62`; load path `calculateService` `C:234-247` (demand amps plus a growth factor, size picked at 80 % of rating) | The tool's voltage drop uses a flat 0.05 Ω/1000 ft (0.025 for parallel runs; `C:254`, "Simplified"). `SERVICE_SIZES C:74-87`: rows 100–225 A match Table 310.12. 300 and 400 A use 350/500 and 500/750 (310.12: 250/350, 400/600). 60 A and 600–1200 A have no verified source. 110, 175, 250 and 350 A are missing. Ground column matches 250.66 except 800 / 1000 / 1200 A (3/0, 4/0, 250 vs 2/0, 3/0, 3/0) |
| /calculators/ground-wire-calculator | meta "through 2000 A" `p:11`; "must be copper" `C:345`; rebar `p:424`, `:438` | Component table stops at 1200 A (`C:13-35`); `nec-250-122.json` runs to 6000 A |
| /guides/nec-code-compliance | `AMPACITY_TABLE_310_16 p:54-65`; `GROUNDING_CONDUCTOR_TABLE p:77-83`; `LOAD_CALCULATION_FACTORS p:85-93`; AFCI `p:118-122`, `:373`; FPN `p:98` | HowTo `p:946` + `HOWTO_NEC_COMPLIANCE_STEPS p:7-44` |
| / (home) | 150 A `p:94`; breakers `p:108-123`; 215.2 `p:98-102`, `:1273`; 90% `p:813`; `EQUIPMENT_LOADS p:126-133`; 100 A subpanel `p:1266`; VD examples `p:1343`, `:1352`; visuals `p:589-610`; arc-flash PPE `p:1016-1024`; "60% of electrical failures" `p:1050`; regional `p:1370-1373`; NEC timeline `p:1418-1436` | `WIRE_COSTS p:143-149` (falls under the cost rule); `MOTOR_FLA p:160-168` (GAP G6); `CONDUIT_FILL p:136-140` (GAP G3); `COMMON_WIRE_SIZES p:82-89` ("4 AWG, 70A, 100A Panel" mixes the 60 °C column with the 310.12 service rule). `GROUNDING_CONDUCTORS p:152-157` matches Table 250.66: no change |
| /calculators | counts `p:27`, `:44`, `:54`, `:337`, `:348`, `:401`; usage bars `p:73-…`; AI/schema FAQ `p:328-373` | No 2026-edition statement on this hub |
| /guides | stats `p:137-142`; read-time/level `p:12-79`; AI/llms.txt FAQ `p:331-335`, `:438`; edition text `p:300-305` | — |

### Step 6: low voltage
See §1 items 2–3. Golden case (`research/golden-cases.json`, group dc-sizing):
- inputs: 12 V, 400 W, 40 ft one way, 2 % drop, copper at 75 °C;
- expected: 33.333 A, `required_cmil` 140,141 ± 50, smallest size 000 (167,800 cmil);
- companion case at 20 °C: 115,233 cmil → 00.

### Step 7: trust pages
- **Addresses published today:** emergency@ (6), support@ (5), privacy@ (4), consulting@ (4), international@ (3), education@ (3), legal@ (2), dpo@ (2). No contact@ anywhere.
- **/contact:** mailto links only; no form.
- **/disclaimer:** `p:483` (emergency@), `p:489` ("Available 24/7 • 2-hour response guarantee").
- **/terms:** `p:199` ("Jurisdiction: United States").
- **Hard-coded dates:** /privacy `p:36-37` ("Last Updated: February 4, 2026"); /terms `p:195`. The draft's "Last updated = this commit's date" replaces them.

### Step 8: verify
- **Baseline under the draft's check-banned scope** (fresh build of 2026-10-20; script bodies skipped except JSON-LD):
  - 55 of 61 phrases present;
  - "$ + digit": 692 hits in 31 of 55 HTML files. Largest: service-entrance 60, hot-tub 43, ev-charger-wire-size 43, hot-tub-wire-size 41, rv-hookup 36, residential-load 31, garage-subpanel 30.
- Run tsc only after `rm -rf .next && npm run build`. `.next/types/validator.ts` and `.next/dev/types/validator.ts` are in tsconfig's `include` and import every page file, so copies left over from before the folder deletions make tsc fail.
- Add the host gate from step 2 and the source scan from §1 item 7.

### Step 9 / DEVLOG notes
- D-01's reason (98 % of Bing clicks on www) dates from before the current www → apex redirect. If D-01 stands, the owner's Vercel flip belongs in the same sitting as the push (§2).

## 4. Replacement values checked against `data/verified` (all pass: 21 scripted checks, plus 3 read off the files: 2026 NEC dates, §30C window, the low-voltage golden case)

| Draft value | File: value |
|---|---|
| 200 A service 2/0 Cu / 4/0 Al; 100 A 4 Cu / 2 Al; 150 A 1 Cu / 2/0 Al | `nec-310-12.json`: same |
| 4/0 Al 180 A at 75 °C; 1 AWG Al 100 A at 75 °C | `nec-310-16.json`: same |
| Rows 700, 800, 900, 1250, 1500, 1750, 2000 kcmil | `nec-310-16.json`: present (30 rows, 18 AWG–2000 kcmil) |
| 41–45 °C, 75 °C column = 0.82; 16 correction rows incl. 61–85 °C | `nec-310-15-B-1-1.json`: same (16 rows, to 81–85 °C) |
| EGC 15 A → 14 Cu, 20 A → 12 Cu, 125 A → 6 Cu (200 A row) | `nec-250-122.json`: same (19 rows, 15–6000 A) |
| GEC 8 Cu for a 3 AWG Cu service ("2 or smaller") | `nec-250-66.json`: same |
| 4/0 Cu 640.5 lb/1000 ft; 12 AWG 2.052 mm; 6 AWG 4.115 mm; 4/0 107.2 mm² | `awg.json`: same |
| Cu 10.371 Ω·cmil/ft, α 0.00393 | `awg.json` constants: same |
| 2026 NEC issued 2025-08-20, effective 2025-09-09 | `research/data-sources.csv` nec-2026-edition: same (TIA 26-3, 527 CMR 12.00) |
| §30C window 2023-01-01 to 2026-06-30, eligible census tracts | `research/data-sources.csv` irs-30c-credit: same |

## Appendix A: surviving files that link to a redirected (R) or withdrawn (W) slug

Excluding the withdrawn and redirected route folders themselves, `sitemap.ts`, `next.config.ts` and the `calculator-faqs.ts` keys.

- `public/llms.txt`: all 6 R + all 14 W (`:16-67`)
- `src/components/layout/Footer.tsx`: all 6 R + all 14 W (`:11-61`)
- `src/app/calculators/page.tsx`: R ev-charger `:308`, ev-charger-wire-size `:167`, `:282`, `:309`, hot-tub-wire-size `:175`, `:311`, electrical-load `:320`, electrical-safety `:548`; all 14 W (`:150-325`)
- `src/app/page.tsx`: R ev-charger `:59`, wire-sizing-guide `:1207`, electrical-safety `:1211`; W range `:63`, welder `:64`, well-pump `:74`, hot-tub `:60`, pool-pump `:73`, air-conditioner `:61`, dryer `:62`, horsepower `:51`, rv-hookup `:75`
- `src/app/guides/page.tsx`: R electrical-load `:33`, wire-sizing-guide `:58`, `:84`, `:345`, electrical-safety `:69`, `:92`; W horsepower `:55`, circuit-breaker `:77`
- `src/app/guides/layout.tsx`: R wire-sizing-guide `:44`, electrical-safety `:52`
- `src/app/guides/nec-code-compliance/page.tsx`: R electrical-load `:674`, `:890`, wire-sizing-guide `:924`, electrical-safety `:931`; W circuit-breaker `:408`, `:892`
- `src/app/guides/power-factor-explained/GuideClient.tsx`: R electrical-load `:716`, wire-sizing-guide `:762`; W horsepower `:715`
- `src/app/guides/single-vs-three-phase/GuideClient.tsx`: R electrical-load `:1046`, wire-sizing-guide `:1094`; W horsepower `:1045`
- `src/app/guides/electrical-power-calculations/page.tsx`: R wire-sizing-guide `:465`; W horsepower `:57`, `:422`
- `src/app/guides/wire-size-for-ev-charger/page.tsx`: R ev-charger-wire-size `:747`
- `src/app/about/page.tsx`: R wire-sizing-guide `:527`
- `src/app/calculators/garage-subpanel-calculator/page.tsx`: R electrical-load `:685`; W welder `:697`, conduit-fill `:703`, rv-hookup `:691`
- `src/app/calculators/three-phase-calculator/page.tsx`: R electrical-load `:836`; W welder `:830`, well-pump `:860`, conduit-fill `:842`
- `src/app/calculators/wire-size-calculator/page.tsx`: R electrical-load `:1203`; W circuit-breaker `:1199`, conduit-fill `:1191`
- `src/app/calculators/voltage-drop-calculator/page.tsx`: W motor-circuit `:1452`, circuit-breaker `:1444`, conduit-fill `:1456`
- `src/app/calculators/btu-to-watts-calculator/page.tsx`: R electrical-load `:875`; W air-conditioner `:869`
- `src/app/calculators/kilowatts-to-amps-calculator/page.tsx`: W horsepower `:872`, circuit-breaker `:911`
- `src/app/calculators/ground-wire-calculator/page.tsx`: W circuit-breaker `:825`, conduit-fill `:851`
- `src/app/calculators/amps-to-watts-calculator/page.tsx`: R electrical-load `:800`
- `src/app/calculators/watts-to-amps-calculator/page.tsx`: R electrical-load `:625`
- `src/app/calculators/ampacity-calculator/page.tsx`: W conduit-fill `:931`
- `src/app/calculators/low-voltage-calculator/page.tsx`: W circuit-breaker `:857`
- `src/app/calculators/ohms-law-calculator/page.tsx`: W circuit-breaker `:753`
- `src/app/calculators/service-entrance-calculator/page.tsx`: W residential-load `:619`
- `src/lib/article-dates.ts:45`: doc comment only
