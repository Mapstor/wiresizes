# Code inventory: wiresizes.com

_WSZ-001 · 2026-10-20 · `main` @ `a99da4e` (= `origin/main`) · read only: nothing under `src/`, `public/` or config was changed._

Method: greps and throwaway scripts run in the box on 2026-10-20; line numbers refer to `a99da4e`. Search data, page findings and dispositions live in `research/AUDIT-2026-10.md` and `research/page-map.csv`; this file covers the code only.

## 1. Stack and tooling

| Item | Value | Where |
|---|---|---|
| Next.js | 16.1.4, **App Router only** (`src/app`, no `pages/`), Turbopack for dev and build | `package.json`, build log |
| React | 19.2.3 | `package.json` |
| TypeScript | 5.9.3 installed (`^5`), `strict: true`, paths `@/*` → `src/*` | `tsconfig.json` |
| Styling | Tailwind CSS 3.4.19 + PostCSS/autoprefixer; Google Fonts via CSS `@import` | `tailwind.config.ts`, `src/app/globals.css:2` |
| Icons / utils | lucide-react ^0.562.0, clsx ^2.1.1 | `package.json` |
| Scripts | `dev: next dev` · `build: next build` · `start: next start` · `lint: eslint` | `package.json:5-10` |
| Test runner | **none** (no `test` script, no jest/vitest/playwright). `node --test --experimental-strip-types` works on the box's Node v22.23.3; with no `"type"` in `package.json` it prints a `MODULE_TYPELESS_PACKAGE_JSON` warning | box check |
| devDependencies | @types/node ^20.19.30, @types/react ^19, @types/react-dom ^19, autoprefixer ^10.4.23, eslint ^9 (9.39.2), eslint-config-next 16.1.4, postcss ^8.5.6, puppeteer-core ^24.43.0, tailwindcss ^3.4.19, typescript ^5 | `package.json:20-31` |
| dependencies | @vercel/analytics ^2.0.1, @vercel/speed-insights ^2.0.0, clsx, lucide-react, next 16.1.4, react/react-dom 19.2.3 | `package.json:11-19` |
| next.config.ts | `reactStrictMode`; **`typescript.ignoreBuildErrors: true`** (`:5-8`); `output: 'standalone'` (`:9`); `optimizePackageImports: ['lucide-react']`; `images.remotePatterns` wiresizes.com; 11 permanent redirects (`:23-81`); headers X-Frame-Options DENY, nosniff, Referrer-Policy origin-when-cross-origin (`:83-103`) | `next.config.ts` |
| Middleware / proxy | none | — |
| vercel.json / .vercelignore | none; `.vercel/project.json` (gitignored) names project `wiresizes` | — |
| Browser scripts | `scripts/*.mjs` (31 puppeteer-core / HTTP audit scripts); Chrome path hard-coded to `/Applications/Google Chrome.app/…` or `CHROME_PATH`, so they run on the Mac only (no Chromium in the box) | `scripts/` |
| One-off codemods | `batch_update_layouts.sh`, `update_layouts.sh`, `update_remaining_schemas.sh` at the repo root | root |
| Type errors hidden by the build | `tsc --noEmit`: 3 errors: `WellPumpCalculator.tsx(129,5)` TS2554; `WireSizeCalculator.tsx(34,55)` and `(104,15)` TS2345 (`material` missing from the `WireSizeInput` initial state) | box check |

## 2. Routes (53, all prerendered static, no dynamic segments)

All 34 calculator components are `'use client'`, so every calculation runs in the browser. Server pages import them directly (**SSR + hydrate**: the form's initial HTML is in the prerendered page) except 5 that go through a `Client*Calculator.tsx` wrapper using `dynamic(…, { ssr: false })` (**client only**: the prerendered HTML holds only "Loading calculator…"). "(barrel)" = imported via `src/components/calculators/index.ts`. Engine = `src/lib/calculations/wire-sizing.ts`; tables = `src/lib/data/*.ts` (§5). Every `page.tsx` sets `alternates.canonical` to its own relative path.

| Route | File (src/app/…) | Calculator / client component | Rendering | Calculation functions | Shared engine / data | JSON-LD | og:url set |
|---|---|---|---|---|---|---|---|
| `/` | `page.tsx` | — | server | — | NEC_310_16 + inline tables | inline Organization + WebSite(SearchAction) + CollectionPage; BreadcrumbSchema | — |
| `/about` | `about/page.tsx` | — | server | — | — | inline AboutPage/Organization | — |
| `/calculators` | `calculators/page.tsx` | — | server (hub) | — | — | inline CollectionPage | yes |
| `/calculators/air-conditioner-calculator` | `calculators/air-conditioner-calculator/page.tsx` | components/calculators/AirConditionerCalculator.tsx (barrel) | client (SSR + hydrate) | calculateTotalAmps, performCalculation | calculateWireSize | CombinedSchema | — |
| `/calculators/ampacity-calculator` | `calculators/ampacity-calculator/page.tsx` | components/calculators/AmpacityCalculator.tsx | client (SSR + hydrate) | calculateAmpacity, performCalculation | NEC_TABLE_310_16, getAmpacity | CombinedSchema | — |
| `/calculators/amps-to-watts-calculator` | `calculators/amps-to-watts-calculator/page.tsx` | components/calculators/AmpsToWattsCalculator.tsx (barrel, default) | client (SSR + hydrate) | calculatePower, performCalculation | — (inline) | CombinedSchema | — |
| `/calculators/box-fill-calculator` | `calculators/box-fill-calculator/page.tsx` | components/calculators/ClientBoxFillCalculator.tsx → BoxFillCalculator.tsx | client only (dynamic, ssr:false) | calculateBoxFill, performCalculation | — (inline BOX_VOLUMES, CONDUCTOR_VOLUMES) | CombinedSchema | yes |
| `/calculators/btu-to-watts-calculator` | `calculators/btu-to-watts-calculator/page.tsx` | components/calculators/ClientBTUToWattsCalculator.tsx → BTUToWattsCalculator.tsx | client only (dynamic, ssr:false) | applyPreset, calculate, performCalculation | — (inline) | CombinedSchema | yes |
| `/calculators/circuit-breaker-calculator` | `calculators/circuit-breaker-calculator/page.tsx` | components/calculators/CircuitBreakerCalculator.tsx (barrel) | client (SSR + hydrate) | calculateBreakerSize, getConductorAmpacity, calculate, performCalculation | calculateWireSize | CombinedSchema | yes |
| `/calculators/conduit-fill-calculator` | `calculators/conduit-fill-calculator/page.tsx` | components/calculators/ConduitFillCalculator.tsx (barrel) | client (SSR + hydrate) | calculateFill, performCalculation | — (inline CONDUIT_FILL_AREAS, WIRE_AREAS) | CombinedSchema | — |
| `/calculators/dryer-calculator` | `calculators/dryer-calculator/page.tsx` | components/calculators/DryerCalculator.tsx (barrel) | client (SSR + hydrate) | getAdjustedAmperage, getRecommendedOutlet, calculate, performCalculation | calculateWireSize | CombinedSchema | — |
| `/calculators/electrical-load-calculator` | `calculators/electrical-load-calculator/page.tsx` | components/calculators/ClientElectricalLoadCalculator.tsx → ElectricalLoadCalculator.tsx | client only (dynamic, ssr:false) | calculateStandardLoad, calculateDetailedLoad, getTotalLoad, getServiceSize, calculate, performCalculation | calculateWireSize | CombinedSchema + inline legacyStructuredData | — |
| `/calculators/ev-charger-calculator` | `calculators/ev-charger-calculator/page.tsx` | components/calculators/EVChargerCalculator.tsx (barrel) | client (SSR + hydrate) | inline useEffect (preset amps × 1.25) | calculateWireSize | CombinedSchema | — |
| `/calculators/ev-charger-wire-size-calculator` | `calculators/ev-charger-wire-size-calculator/page.tsx` | components/calculators/EVChargerWireSizeCalculator.tsx | client (SSR + hydrate) | calculateWireSize (local), performCalculation | NEC_310_16, WIRE_PROPERTIES | CombinedSchema | — |
| `/calculators/garage-subpanel-calculator` | `calculators/garage-subpanel-calculator/page.tsx` | components/calculators/ClientGarageSubpanelCalculator.tsx → GarageSubpanelCalculator.tsx | client only (dynamic, ssr:false) | calculateTotalLoad, getRecommendedSubpanelSize, calculate, performCalculation | calculateWireSize | CombinedSchema | — |
| `/calculators/ground-wire-calculator` | `calculators/ground-wire-calculator/page.tsx` | components/calculators/GroundWireCalculator.tsx (barrel) | client (SSR + hydrate) | findGroundSize, getConductorAmpacity, calculateGrounding, performCalculation | — (inline GROUNDING_CONDUCTOR_TABLE, ampacities) | CombinedSchema | yes |
| `/calculators/horsepower-to-amps-calculator` | `calculators/horsepower-to-amps-calculator/page.tsx` | components/calculators/HorsepowerToAmpsCalculator.tsx (barrel, default) | client (SSR + hydrate) | calculateAmps, performCalculation | — (inline 746 W/hp, if-ladder sizes) | CombinedSchema | yes |
| `/calculators/hot-tub-calculator` | `calculators/hot-tub-calculator/page.tsx` | components/calculators/HotTubCalculator.tsx (barrel) | client (SSR + hydrate) | inline useEffect | calculateWireSize | CombinedSchema | — |
| `/calculators/hot-tub-wire-size-calculator` | `calculators/hot-tub-wire-size-calculator/page.tsx` | components/calculators/HotTubWireSizeCalculator.tsx | client (SSR + hydrate) | calculateWireSize (local), performCalculation | — (inline ladders + resistances) | CombinedSchema | — |
| `/calculators/kilowatts-to-amps-calculator` | `calculators/kilowatts-to-amps-calculator/page.tsx` | components/calculators/KilowattsToAmpsCalculator.tsx (barrel) | client (SSR + hydrate) | applyPreset, calculate, performCalculation | — (inline) | CombinedSchema | yes |
| `/calculators/kva-to-amps-calculator` | `calculators/kva-to-amps-calculator/page.tsx` | components/calculators/kVAToAmpsCalculator.tsx (barrel: KVAToAmpsCalculator) | client (SSR + hydrate) | applyPreset, calculate, performCalculation | — (inline) | CombinedSchema | yes |
| `/calculators/low-voltage-calculator` | `calculators/low-voltage-calculator/page.tsx` | components/calculators/LowVoltageCalculator.tsx (barrel) | client (SSR + hydrate) | getCalculatedCurrent, getEffectiveCurrent, calculateLowVoltage, getComplianceStatus, performCalculation | imports calculateWireSize, never calls it; inline LOW_VOLTAGE_WIRE_GAUGES | CombinedSchema | yes |
| `/calculators/motor-circuit` | `calculators/motor-circuit/page.tsx` | components/calculators/MotorCircuitCalculator.tsx | client (SSR + hydrate) | calculateMotorCircuit, performCalculation | — (inline motorFLC, protectionPercentages) | CombinedSchema | — |
| `/calculators/ohms-law-calculator` | `calculators/ohms-law-calculator/page.tsx` | components/calculators/OhmsLawCalculator.tsx (barrel) | client (SSR + hydrate) | calculate, performCalculation | — (inline) | CombinedSchema | yes |
| `/calculators/pool-pump-calculator` | `calculators/pool-pump-calculator/page.tsx` | components/calculators/PoolPumpCalculator.tsx (barrel, default) | client (SSR + hydrate) | calculateRequirements, performCalculation | — (inline poolPumpFLA, resistance) | CombinedSchema | — |
| `/calculators/range-calculator` | `calculators/range-calculator/page.tsx` | components/calculators/RangeCalculator.tsx (barrel) | client (SSR + hydrate) | getDemandLoad, getRecommendedBreakerSize, getRecommendedOutlet, calculate, performCalculation | calculateWireSize; inline DEMAND_FACTORS | CombinedSchema | — |
| `/calculators/residential-load-calculator` | `calculators/residential-load-calculator/page.tsx` | components/calculators/ResidentialLoadCalculator.tsx | client (SSR + hydrate) | calculateLoad, performCalculation | — (inline APPLIANCE_LOADS, NEC_DEMAND_FACTORS) | CombinedSchema | — |
| `/calculators/rv-hookup-calculator` | `calculators/rv-hookup-calculator/page.tsx` | components/calculators/RVHookupCalculator.tsx (barrel) | client (SSR + hydrate) | calculateTotalLoad, getRecommendedBreaker, calculate, performCalculation | calculateWireSize | CombinedSchema | — |
| `/calculators/service-entrance-calculator` | `calculators/service-entrance-calculator/page.tsx` | components/calculators/ServiceEntranceCalculator.tsx | client (SSR + hydrate) | calculateService, performCalculation | — (inline SERVICE_SIZES, GROUNDING_REQUIREMENTS) | CombinedSchema | — |
| `/calculators/three-phase-calculator` | `calculators/three-phase-calculator/page.tsx` | components/calculators/ClientThreePhaseCalculator.tsx → ThreePhaseCalculator.tsx | client only (dynamic, ssr:false) | calculateLineCurrent, calculateNeutralCurrent, calculateActualPower, calculate, performCalculation | calculateWireSize | CombinedSchema | — |
| `/calculators/voltage-drop-calculator` | `calculators/voltage-drop-calculator/page.tsx` | components/calculators/VoltageDropCalculator.tsx | client (SSR + hydrate) | performCalculation | calculateVoltageDrop, getAllWireSizes | CombinedSchema | — |
| `/calculators/volts-to-amps-calculator` | `calculators/volts-to-amps-calculator/page.tsx` | components/calculators/VoltsToAmpsCalculator.tsx (barrel) | client (SSR + hydrate) | calculate, performCalculation | — (inline) | CombinedSchema | yes |
| `/calculators/watts-to-amps-calculator` | `calculators/watts-to-amps-calculator/page.tsx` | components/calculators/WattsToAmpsCalculator.tsx (barrel) | client (SSR + hydrate) | performCalculation (inline I = P / (V·√3?·PF)) | calculateWireSize | CombinedSchema | — |
| `/calculators/welder-calculator` | `calculators/welder-calculator/page.tsx` | components/calculators/WelderCalculator.tsx (barrel) | client (SSR + hydrate) | applyPreset, calculate, performCalculation | calculateWireSize | CombinedSchema | — |
| `/calculators/well-pump-calculator` | `calculators/well-pump-calculator/page.tsx` | components/calculators/WellPumpCalculator.tsx (barrel) | client (SSR + hydrate) | getMotorCurrent, calculateCircuitAmps, calculate, performCalculation | calculateWireSize; inline MOTOR_FLC_TABLE | CombinedSchema | — |
| `/calculators/wire-resistance-calculator` | `calculators/wire-resistance-calculator/page.tsx` | components/calculators/WireResistanceCalculator.tsx (barrel) | client (SSR + hydrate) | getTemperatureFactor, getWireData, calculateResistance, findWireForVoltageDrop, calculateMaxDistance, performCalculations | imports calculateWireSize, never calls it; inline WIRE_RESISTANCE_DATA, TEMPERATURE_FACTORS | CombinedSchema | yes |
| `/calculators/wire-size-calculator` | `calculators/wire-size-calculator/page.tsx` | components/calculators/WireSizeCalculator.tsx | client (SSR + hydrate) | performCalculation | calculateWireSize | CombinedSchema | — |
| `/contact` | `contact/page.tsx` | — | server | — | — | inline ContactPage | yes |
| `/disclaimer` | `disclaimer/page.tsx` | — | server | — | — | BasicPageSchema | og block, no url |
| `/guides` | `guides/page.tsx` | — | server (hub; guides/layout.tsx sidebar) | — | — | inline CollectionPage | — |
| `/guides/awg-wire-size-chart` | `guides/awg-wire-size-chart/page.tsx` | — | server | — | NEC_310_16, WIRE_PROPERTIES | ArticleSchema + DatasetSchema | — |
| `/guides/electrical-power-calculations` | `guides/electrical-power-calculations/page.tsx` | — | server | — | — | ArticleSchema | — |
| `/guides/electrical-safety` | `guides/electrical-safety/page.tsx` | GuideClient.tsx ('use client' body) | client body | tab/step state only | — | HowToSchema + ArticleSchema (in GuideClient) | — |
| `/guides/nec-code-compliance` | `guides/nec-code-compliance/page.tsx` | — | server | — | — (inline tables) | ArticleSchema + HowToSchema | — |
| `/guides/nec-table-310-16` | `guides/nec-table-310-16/page.tsx` | — | server | — | NEC_310_16 | ArticleSchema + DatasetSchema | — |
| `/guides/power-factor-explained` | `guides/power-factor-explained/page.tsx` | GuideClient.tsx ('use client' body) | client body | interactive power-factor widget (useState 0.8) | — (inline) | ArticleSchema (in GuideClient) | — |
| `/guides/single-vs-three-phase` | `guides/single-vs-three-phase/page.tsx` | GuideClient.tsx ('use client' body) | client body | tab state | — (inline) | ArticleSchema (in GuideClient) | — |
| `/guides/wire-size-for-100-amp` | `guides/wire-size-for-100-amp/page.tsx` | — | server | — | — (inline tables) | ArticleSchema + HowToSchema | — |
| `/guides/wire-size-for-200-amp` | `guides/wire-size-for-200-amp/page.tsx` | — | server | — | — (inline) | ArticleFAQSchema + HowToSchema | — |
| `/guides/wire-size-for-ev-charger` | `guides/wire-size-for-ev-charger/page.tsx` | — | server | — | — (inline) | ArticleFAQSchema + HowToSchema | — |
| `/guides/wire-sizing-guide` | `guides/wire-sizing-guide/page.tsx` | GuideClient.tsx ('use client' body) | client body | interactive ampacity lookup (material/temp/size) | NEC_310_16 | HowToSchema + ArticleSchema (in GuideClient) | — |
| `/privacy` | `privacy/page.tsx` | — | server | — | — | BasicPageSchema | — |
| `/terms` | `terms/page.tsx` | — | server | — | — | BasicPageSchema | og block, no url |

Also in `src/app`: `layout.tsx` (root), `guides/layout.tsx` (guide sidebar from its own `GUIDES` list), `not-found.tsx` (inline JSON-LD), `error.tsx`, `opengraph-image.tsx` (next/og 1200×630), `twitter-image.tsx` (re-exports the OG image), `icon.svg`, `favicon.ico`, `sitemap.ts`.

Not routed: `src/components/calculators/GarageSubpanelWireSizeCalculator.tsx` (no importers, not in the barrel).

## 3. Routing and URL config

- **Sitemap:** `src/app/sitemap.ts`. Hard-coded slug lists: 3 hubs + 34 calculators (`:61-100`) + 11 guides (`:102-114`) + 5 static pages (`:170-181`) = 53 URLs. `baseUrl = 'https://wiresizes.com'` (`:6`). Priority and changefreq are hard-coded. The built `sitemap.xml` (53 `<loc>`) equals the route tree exactly.
- **robots:** static `public/robots.txt` (no `app/robots.ts`). `Sitemap: https://wiresizes.com/sitemap.xml`. It names and allows the AI crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot, PerplexityBot…) and disallows AhrefsBot, SemrushBot, DotBot, MJ12bot, PetalBot and BLEXBot.
- **Redirects:** only `next.config.ts` (11 × `permanent: true` → 308): `/calculators/{amps-to-watts, watts-to-amps, ohms-law, conduit-fill, three-phase, pool-pump, horsepower-to-amps}` → `…-calculator`; `kw-to-amps` → `kilowatts-to-amps-calculator`; `ground-wire-size` → `ground-wire-calculator`; `ac-wire-size` → `air-conditioner-calculator`; `garage-subpanel-wire-size` → `garage-subpanel-calculator`. No `vercel.json`, no middleware.
- **trailingSlash:** not set (Next default `false`).
- **Host in production (2026-10-20 09:02 UTC):** `https://www.wiresizes.com/*` → **308** → `https://wiresizes.com/*` (Vercel). `http://www…` → 308 → `https://www…`. Apex serves 200. AUDIT §2 (crawl 2026-10-19) recorded www as "200, no redirect"; that no longer holds.
- **Site-URL constants (all apex, no `www` anywhere in src/public):** `metadataBase: new URL('https://wiresizes.com')` (`src/app/layout.tsx:9`); `baseUrl` (`src/app/sitemap.ts:6`); `ORIGIN` in `src/components/seo/BasicPageSchema.tsx:14`, `DatasetSchema.tsx:45`, `HowToSchema.tsx:26`; `baseUrl` in `src/utils/breadcrumbs.ts:62`. Literal `https://wiresizes.com` appears 140× across 61 files in `src/`, plus 48× in `public/llms.txt` and 1× in `public/robots.txt`. A host change touches all of them.
- **Canonical:** `alternates: { canonical: '/<path>' }` in every `page.tsx` (relative, resolved against `metadataBase`).
- **OG/Twitter:** root `openGraph`/`twitter` blocks in `layout.tsx:38-51` (no `url`); 13 pages set an absolute apex `openGraph.url` (column "og:url set" in §2). The image comes from `src/app/opengraph-image.tsx`; `twitter-image.tsx:3` re-exports it.
- **JSON-LD builders:**
  - `src/components/seo/CombinedSchema.tsx`: WebApplication + FAQPage + BreadcrumbList; used on all 34 calculator pages. `url` comes from each page's `webAppData.url` literal.
  - `ArticleSchema.tsx` / `ArticleFAQSchema.tsx`: Article; author **and** publisher = Organization "WireSizes.com" (`ArticleSchema.tsx:31-45`, `ArticleFAQSchema.tsx:37-51`); image `https://wiresizes.com/opengraph-image`. No `Person` anywhere in the codebase.
  - `HowToSchema.tsx`, `DatasetSchema.tsx` (**`license: CC BY 4.0`, `creator: WireSizes.com`** at `:68-73`, applied to the NEC Table 310.16 data on `/guides/nec-table-310-16` and `/guides/awg-wire-size-chart`), `BasicPageSchema.tsx` (privacy/terms/disclaimer), `BreadcrumbSchema.tsx` + `src/utils/breadcrumbs.ts` (`generateBreadcrumbSchema`, `:101`).
  - Inline objects: `src/app/page.tsx:172-238` (Organization with `contactPoint` support@ at `:186-189`, WebSite + **SearchAction → `/search?q=`** at `:204-209`, CollectionPage); `src/app/not-found.tsx:225-242` (also SearchAction → `/search`); `about/page.tsx:28-…` (`foundingDate: "2024"` at `:54`); `contact/page.tsx:241-…` (contactPoint support@/consulting@/legal@/education@ at `:266-293`); `calculators/page.tsx:328`; `guides/page.tsx:97`; `calculators/electrical-load-calculator/page.tsx:24-58` (`legacyStructuredData`, see §8). There is **no `/search` route.**
  - Unused: `src/components/FAQSchema.tsx`, `src/components/seo/FAQSchema.tsx`, `src/components/seo/WebAppSchema.tsx`; the barrels `src/lib/data/index.ts` and `src/lib/calculations/index.ts` have no importers.
- **FAQ markup vs visible text:** 30 calculator pages pass `calculatorFAQs['<slug>']` (`src/data/calculator-faqs.ts`) to `CombinedSchema` as FAQPage JSON-LD, and none of them renders that array (no `calculatorFAQs[…].map` anywhere). The FAQPage answers are not the visible page text.

## 4. Shared layout, badge and hero components

- **Root layout** `src/app/layout.tsx`: gtag in `<head>` (`:79-90`), Google Fonts preconnects (`:93-94`), `<Header/>`, `<main>`, `<Footer/>`, `<Analytics/>` and `<SpeedInsights/>` (`:107-113`). Every page inherits the Header and Footer.
- **Header** `src/components/layout/Header.tsx` (`'use client'`, mobile-menu state). "Professional Trust Bar" at `:18-36`: "NEC Code Compliant" `:24`, "Professional Grade" `:28`, "Trusted by 50,000+ Electricians" `:32`. Logo tagline "Professional Tools" `:53`. "FREE / Always" at `:71-72` and `:80-81`. Mobile menu: "NEC Compliant" `:124`, "Professional" `:128`. Added in commit `851cdda` (2026-04-06, "Enhance header with professional credibility and trust indicators").
- **Footer** `src/components/layout/Footer.tsx` (server). Brand blurb `:87-90` ("…based on NEC 2023 requirements. Trusted by electricians, contractors, engineers, and electrical professionals worldwide."). Badge row `:91-95`: "🔥 30+ Professional Tools" `:92`, "⚡ NEC 2023 Compliant" `:93`, "🌍 Used in 50+ Countries" `:94`. Bottom line `:309` "Professional electrical calculation tools • NEC 2023 compliant • Trusted worldwide". © year = `new Date().getFullYear()` at build (`:70`).
- **Badge** `src/components/ui/Badge.tsx`: generic variant pill, not a trust badge. Used by `guides/wire-size-for-200-amp/page.tsx` (`:99` `<Badge variant="success">NEC Compliant</Badge>`), `guides/wire-size-for-ev-charger/page.tsx`, `calculators/motor-circuit/page.tsx`, `VoltageDropCalculator.tsx`, `CalculatorResult.tsx`.
- **Hero:** no shared component. Each page has an inline `{/* Hero … */}` section: `page.tsx:405`, `about:174`, `guides:151`, `guides/nec-code-compliance:144`, `guides/awg-wire-size-chart:70`, `guides/electrical-power-calculations:72`, the GuideClient files (`wire-sizing-guide:133`, `single-vs-three-phase:157`, `electrical-safety:208`, `power-factor-explained:101`), and 29 calculator pages (`…/page.tsx` at lines 59–579).
- **OG/Twitter image** `src/app/opengraph-image.tsx:115`: "Free • NEC 2023 compliant • Trusted by 50,000+ electricians". The text is baked into every share image (both og:image and twitter:image).

### 4.1 The four named badges: file and line

| Badge | Locations |
|---|---|
| "Trusted by…" | `Header.tsx:32` (50,000+ Electricians) · `Footer.tsx:89`, `:309` ("Trusted worldwide") · `opengraph-image.tsx:115` (50,000+ electricians) · `page.tsx:334` · `calculators/page.tsx:388` ("Trusted by over 100,000 electrical professionals worldwide") · `about/page.tsx:365` |
| "Used in 50+ Countries" | `Footer.tsx:94` · `about/page.tsx:78` (stat `'50+'` / `'Countries Served'`) |
| "30+ Professional Tools" | `Footer.tsx:92` · `terms/page.tsx:244` ("30+ Professional calculation tools") · `calculators/page.tsx:401` ("30+ Calculators") · `Header.tsx:53` (tagline "Professional Tools") |
| "NEC 2023 Compliant" | `Footer.tsx:93`, `:309` · `calculators/page.tsx:393` · `guides/nec-code-compliance/page.tsx:166` · `opengraph-image.tsx:115` · `guides/page.tsx:141` (stat `'NEC 2023'` / `'Code Compliant'`) · variants "NEC Code Compliant"/"NEC Compliant" at `Header.tsx:24`, `:124`, `page.tsx:277`, `:297`, `calculators/page.tsx:273`, `circuit-breaker-calculator/page.tsx:14` (title), `:79`, `service-entrance…:328`, `ev-charger-calculator:319`, `watts-to-amps…:265`, `hot-tub-wire-size…:205`, `residential-load…:253`, `air-conditioner…:557`, `ev-charger-wire-size…:181`, `dryer…:342`, `pool-pump…:438` ("NEC 680 Compliant"), `guides/wire-size-for-200-amp:99`; `public/images/og-template.html` |

Same class, other wording: `about/page.tsx:332` ("All calculations reviewed by licensed electrical engineers and master electricians"), `:423` ("Join thousands…"); `contact/page.tsx:569` ("our team includes licensed electrical engineers…"); `page.tsx:25` (meta description "30+ tools used by licensed electricians"); `calculators/page.tsx:337` (schema description); `public/llms.txt:3` ("Used by licensed electricians…"); `privacy/page.tsx:491-494` (Data Protection Officer `dpo@wiresizes.com`).

### 4.2 Baseline against `research/wsz002-banned-strings.txt` (fresh build, 2026-10-20)

Scope: 55 prerendered HTML files (raw HTML, so meta and JSON-LD included, plus tag-stripped text), `sitemap.xml`, `robots.txt`, `llms.txt` and the OG image source. **56 of 61 phrases are present.**
- On 54–55 of 55 HTML files (Header/Footer/root meta): Trusted by, 50,000+, NEC 2023 Compliant, 50+ Countries, 30+ Professional Tools, Professional Grade, NEC Code Compliant, FREE Always, Trusted worldwide.
- On 1–4 files: 100,000 (4), used by licensed electricians (3, incl. llms.txt), 24/7 (3), support@wiresizes (3), Sarah (3), 2-hour response, emergency@, JuiceBox, "1 AWG copper or 1/0 aluminum" (2 each); the about/contact service and endorsement phrases, Backyard Oasis, through 2032, Download NEC Table, 60% of electrical, NEC 2024, "4/0 copper or 250 kcmil aluminum", 6-25R, 408 V, 0.609 lb, "Generally not required for ranges", "remainder @ 80%", THHN-2, 3.5 VA per sq ft, Do AI assistants, llms.txt, git-derived (1 each).
- Absent as literals, but the claim is present in other wording, so a literal gate misses it: "PE stamp" → `disclaimer/page.tsx:199` "(PE) stamp"; "NEC 2026 publishes" → `guides/page.tsx:304` "NEC 2026 edition publishes"; "most recent edition" → `guides/page.tsx:302` and `public/llms.txt:102` "most recent published edition"; "2/0 aluminum per" → nearest is `calculators/wire-size-calculator/page.tsx:236` "2/0 aluminum for dwe…"; "408V" → present as "408 V" (`single-vs-three-phase/GuideClient.tsx:1165`).

## 5. NEC/AWG tables, electrical constants, calculation functions

### 5.1 Shared modules and their importers

| File | Holds | Importers |
|---|---|---|
| `src/lib/data/nec-tables.ts` (header `:4` "Source: NFPA 70 (NEC) 2023 edition") | `NEC_310_16` `:49-72` (14 AWG–1000 kcmil: area, diameter, `dc_resistance_ohms_per_1000ft` documented "at 25°C … Chapter 9 Table 8" `:31`, weight, Cu/Al 60/75/90 °C ampacity); `NEC_TABLE_310_16` alias `:80`; `getAmpacity` `:94`, `getMinWireSize` `:106`, `getWireDiameter` `:119`, `getAllWireSizes` `:124`; `NEC_240_4_D_MAX_OCPD` `:135-139`; `NEC_250_122` `:152-169` (15–2000 A); `NEC_310_15_TEMP_CORRECTION` `:186-197`; `NEC_310_15_C_1_BUNDLING` `:204-211`; `NEC_COMMON_REFERENCE_75C` `:226-231` | `src/app/page.tsx`, `calculators/wire-size-calculator/page.tsx`, `guides/awg-wire-size-chart/page.tsx`, `guides/nec-table-310-16/page.tsx`, `guides/wire-sizing-guide/GuideClient.tsx` (all `NEC_310_16`); `AmpacityCalculator.tsx` (`NEC_TABLE_310_16`, `getAmpacity`); `EVChargerWireSizeCalculator.tsx` (`NEC_310_16`); `VoltageDropCalculator.tsx` (`getAllWireSizes`); `src/lib/calculations/wire-sizing.ts` (`getMinWireSize`, `getAmpacity`, `NEC_TABLE_310_16`) |
| `src/lib/data/wire-properties.ts` (header `:4` "Resistance values at 20°C (68°F)") | `WIRE_PROPERTIES` `:20-219` (18 rows, 14 AWG–500 kcmil: diameter, cmil, mm², Cu/Al Ω/1000 ft, Cu/Al lb/1000 ft); `getWireResistance` `:224`, `getWireWeight` `:239`, `getWireDiameterMM` `:254`, `getWireArea` `:262`, `cmilToMm2` `:270` (×0.0005067), `mm2ToCmil` `:277` | `guides/awg-wire-size-chart/page.tsx`, `EVChargerWireSizeCalculator.tsx`, `src/lib/calculations/wire-sizing.ts` |
| `src/lib/calculations/wire-sizing.ts` (header "Based on NEC 2023") | `calculateWireSize` `:57` (smallest size by 75 °C ampacity, then VD check at 3 % default; `necReference: 'NEC 310.16 (75°C column)'` `:164`); `calculateVoltageDrop` `:181` (VD = 2 or √3 × I × R × D/1000 with R from `wire-properties` 20 °C; the comment at `:176` cites K = 12.9/21.2, which the code does not use; "acceptable" = ≤ 3 %); `getGroundWireSize` `:233` (its **own** 250.122 copy, 15–1200 A); `getNextLargerWireSize` `:263`, `createErrorResult` `:277`, `generateRecommendation` `:294`, `awgToNumeric` `:315`, `compareAwg` `:332` | `calculateWireSize` imported by 16 components and called by 14 (AirConditioner, CircuitBreaker, Dryer, EVCharger, ElectricalLoad, GarageSubpanel, HotTub, RVHookup, Range, ThreePhase, WattsToAmps, Welder, WellPump, WireSize); LowVoltage and WireResistance import it but never call it; `calculateVoltageDrop` is called by VoltageDropCalculator only |
| `src/data/calculator-faqs.ts` | `calculatorFAQs`: 5 Q&A × 30 slugs of prose with code values (e.g. `:21` 10 AWG ampacities) | 30 calculator `page.tsx` files → FAQPage JSON-LD only (§3) |

### 5.2 Tables inside calculator components (shipped to the browser)

| Component | Inline tables / constants |
|---|---|
| `AmpacityCalculator.tsx` | `AWG_OPTIONS` :15-36, `TEMPERATURE_OPTIONS` :38-42, `AMBIENT_TEMP_OPTIONS` :44-52, `CONDUIT_FILL_OPTIONS` :54-62 (+ shared 310.16) |
| `BoxFillCalculator.tsx` | `BOX_TYPES` :13-20, `BOX_VOLUMES` :23-61, `CONDUCTOR_VOLUMES` :64-74 |
| `ConduitFillCalculator.tsx` | `CONDUIT_TYPES` :13-20, `CONDUIT_FILL_AREAS` :22-47, `WIRE_AREAS` :50-69 |
| `GroundWireCalculator.tsx` | `GROUNDING_CONDUCTOR_TABLE` :13-35 (third copy of 250.122), `PHASE_CONDUCTOR_SIZES` :38-42, `BREAKER_SIZES` :44-50, `ampacities` map :90-… |
| `MotorCircuitCalculator.tsx` | `motorFLC` :52-…, `protectionPercentages` :65-…, `motorTypes`/`voltageOptions`/`protectionTypes`/`startingMethods` :21-51; conductor if-ladder in `calculateMotorCircuit` :103-… |
| `WellPumpCalculator.tsx` | `WELL_PUMP_TYPES` :16-65, `MOTOR_FLC_TABLE` :68-82, `CONTROL_BOXES` :85-101 |
| `PoolPumpCalculator.tsx` | `poolPumpFLA` :39-…, `resistance` :84-85 (Ω/kft), `standardBreakers` :117 |
| `HorsepowerToAmpsCalculator.tsx` | 746 W/hp × efficiency × PF formula + wire-size if-ladder in `calculateAmps` :21-… |
| `HotTubWireSizeCalculator.tsx` | `HOT_TUB_MODELS` :32-48; ampacity and resistance ternary ladders in local `calculateWireSize` :266-… |
| `WireResistanceCalculator.tsx` | `WIRE_RESISTANCE_DATA` :16-35, `TEMPERATURE_FACTORS` :38-53 |
| `LowVoltageCalculator.tsx` | `VOLTAGE_SYSTEMS` :16-77, `LOW_VOLTAGE_WIRE_GAUGES` :80-88, `LOAD_TYPES` :91-140 |
| `ServiceEntranceCalculator.tsx` | `SERVICE_TYPES` :39-72, `SERVICE_SIZES` :74-87 (Cu/Al/ground per service rating), `GROUNDING_REQUIREMENTS` :205-211, `sizes` :241 |
| `ResidentialLoadCalculator.tsx` | `APPLIANCE_LOADS` :28-49, `SERVICE_SIZE_GUIDE` :129-178, `NEC_DEMAND_FACTORS` :180-192 |
| `RangeCalculator.tsx` | `RANGE_TYPES` :16-81, `DEMAND_FACTORS` :84-100 |
| `DryerCalculator.tsx` | `DRYER_TYPES` :16-59, `OUTLET_TYPES` :62-87 |
| `CircuitBreakerCalculator.tsx` | `LOAD_TYPES` :16-52, `BREAKER_TYPES` :55-98, `standardSizes` :147 |
| `ElectricalLoadCalculator.tsx` | `BUILDING_TYPES` :16-71, `LOAD_CATEGORIES` :74-117 |
| `GarageSubpanelCalculator.tsx` | `SUBPANEL_SIZES` :16-47, `LOAD_CALCULATIONS` :50-72 |
| `AirConditionerCalculator.tsx` | `AC_UNIT_TYPES` :16-97, `EFFICIENCY_RATINGS` :100-121 |
| `EVChargerCalculator.tsx` | `EV_CHARGER_PRESETS` :13-23 (× 1.25 at :34, :56) |
| `EVChargerWireSizeCalculator.tsx` | `EV_MODELS` :32-48, `CHARGER_TYPES` :50-107, `WIRE_SIZES` :113-114, `breakerSizes` :303; local `calculateWireSize` :259 |
| `HotTubCalculator.tsx` | `HOT_TUB_SIZES` :13-18 |
| `ThreePhaseCalculator.tsx` | `VOLTAGE_SYSTEMS` :16-57, `CALCULATION_MODES` :113-132 |
| `WelderCalculator.tsx` | `WELDER_TYPES` :16-25, `WELDER_PRESETS` :39-47 |
| Converters | `KilowattsToAmpsCalculator.tsx` `APPLICATION_PRESETS` :26-33 · `kVAToAmpsCalculator.tsx` `EQUIPMENT_PRESETS` :29-40 · `BTUToWattsCalculator.tsx` `EQUIPMENT_PRESETS` :18-29 · `AmpsToWattsCalculator.tsx` `COMMON_POWER_FACTORS` :31-39 · `WattsToAmpsCalculator.tsx` formula :29-38 |
| Unused | `GarageSubpanelWireSizeCalculator.tsx`: `copperResistance` :40-…, `aluminumResistance` :61-…, local `calculateWireSize` :23 |
| Visuals / UI | `visualizations/WireVisualization.tsx` `WIRE_DIAMETERS` :5-24 · `visualizations/WireSizeScale.tsx` `COMMON_SIZES` :1 · `ui/VoltageInput.tsx` `COMMON_VOLTAGES` :14-25 |

### 5.3 Duplicates and drift (for WSZ-003)

- **Conductor resistance, five sources:** `nec-tables.ts` (`dc_resistance…`, labelled 25 °C), `wire-properties.ts` (labelled 20 °C, used by the voltage-drop engine), `WireResistanceCalculator.tsx`, the inline maps in `PoolPumpCalculator.tsx` / `HotTubWireSizeCalculator.tsx` / unused `GarageSubpanelWireSizeCalculator.tsx`, and `WIRE_RESISTANCE_DATA_EXTENDED` on `calculators/voltage-drop-calculator/page.tsx:153-174`.
- **Table 250.122, three copies:** `nec-tables.ts:152-169`, `wire-sizing.ts:233-261`, `GroundWireCalculator.tsx:13-35`.
- **Ampacity ladders outside 310.16:** `GroundWireCalculator.tsx:90`, `HorsepowerToAmpsCalculator.tsx` (`calculateAmps`), `MotorCircuitCalculator.tsx` (`calculateMotorCircuit`), `HotTubWireSizeCalculator.tsx:266-…`.
- **Motor currents, two tables:** `MotorCircuitCalculator.tsx` `motorFLC`, `WellPumpCalculator.tsx` `MOTOR_FLC_TABLE` (+ `PoolPumpCalculator.tsx` `poolPumpFLA`).
- **Page-level tables** (server-rendered numbers that bypass `src/lib`): every calculator and guide `page.tsx` defines its own constant arrays (examples, "requirements", cost, energy and regional tables). Full list with line ranges in Appendix A; data-bearing ones are flagged `[awg]`, `[nec]`, `[constants]` or `[ampsNumbers]`.

## 6. Third-party scripts and services (feeds /privacy)

Loaded on **every** page through the root layout, unconditionally (no consent banner, no CMP, no Consent Mode):
1. **Google Analytics 4 (gtag.js):** `<script async src="https://www.googletagmanager.com/gtag/js?id=G-T871GVJZE2">` + inline `gtag('config', 'G-T871GVJZE2')`, raw `<script>` in `<head>` (`src/app/layout.tsx:79-90`). No GTM container.
2. **Vercel Web Analytics:** `<Analytics />` from `@vercel/analytics/next` 2.0.1 (`layout.tsx:2`, `:112`); loads `/_vercel/insights/script.js`.
3. **Vercel Speed Insights:** `<SpeedInsights />` from `@vercel/speed-insights/next` 2.0.0 (`layout.tsx:3`, `:113`); loads `/_vercel/speed-insights/script.js`.
4. **Google Fonts:** `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap')` (`src/app/globals.css:2`): CSS from fonts.googleapis.com, font files from fonts.gstatic.com, so each visitor's IP reaches Google. Preconnects at `layout.tsx:93-94`.

Not present (0 hits in src/public/config): raptive, adthrive, cmp/consent, plausible, hotjar.
Verification only (no script): `google-site-verification` meta (`layout.tsx:52-53`) + `public/google12f8c2f9c03913a3.html`; `msvalidate.01` meta (`layout.tsx:54-56`) + `public/BingSiteAuth.xml`.
Build time only: next/og fetches a Google font for the "→" glyph in `opengraph-image.tsx`; the box firewall blocks it (§10).
Current `/privacy` names only Google Analytics ("anonymized IP addresses", `privacy/page.tsx:225`; 26-month retention `:400`) and a DPO `dpo@wiresizes.com` (`:491-494`); it does not mention Vercel Analytics, Speed Insights or Google Fonts.

## 7. llms.txt, PDFs, downloadable tables, other public files

- `public/llms.txt`: static and hand-written (8.6 KB). 48 links, all apex. Intro `:3` "Free, NEC-compliant… Used by licensed electricians… Calculations follow NEC 2023". "Authoritative quick-reference values (NEC 2023, 75 °C copper terminations)" breaker→wire table, 240.4(D), 310.12 "83% rule" ("200 A service can use 4/0 Cu / 250 kcmil Al"), 125 %, VD 3 %/5 %. `:102` "most recent published edition… Last full review: NEC 2023". None of these numbers traces to `data/verified/`.
- `public/*.pdf`: none (`public/pdfs/` holds only `.gitkeep`).
- Downloadable NEC table: none exists. `guides/nec-table-310-16/page.tsx:461-472` renders "Download NEC Table 310.16 PDF" with a `<button>` (`:468`) that has no link or handler.
- Also public: `public/images/og-template.html` (a crawlable HTML page carrying "NEC Compliant"), `public/images/og-image.svg`, `manifest.json`, favicons, Create-Next-App leftovers (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`).

## 8. Dates

- **Sitemap `lastmod`:** at build, `git log -1 --format=%aI` on the page's `page.tsx` and `GuideClient.tsx` (latest wins) → else fs mtime → else build time (`src/app/sitemap.ts:20-59`). Built values today: 2026-05-06 … 2026-05-13. Any commit touching a `page.tsx` moves its `lastmod`.
- **Article / ArticleFAQ / Dataset JSON-LD `datePublished`/`dateModified`:** `getArticleDates(file)` (`src/lib/article-dates.ts:47-79`) = first and last git commit of the file at build → else mtime → else `'2026-01-01'` (`:21`); the components have their own `FALLBACK_DATE '2026-01-01'` (`ArticleSchema.tsx:17`, `ArticleFAQSchema.tsx:23`). Used by all 11 guides (the GuideClient guides pass the dates into `ArticleSchema`). JSON-LD only: no page shows a visible date.
- **Hard-coded:** `calculators/electrical-load-calculator/page.tsx:57-58` (`datePublished: "2024-01-01"`, `dateModified: new Date()` = build day); `privacy/page.tsx:36-37` "Last Updated: February 4, 2026 • Effective Date: February 4, 2026"; `terms/page.tsx:195` "Last Updated: February 2026"; `about/page.tsx:54` `foundingDate: "2024"`.
- **Build time:** Footer © year (`Footer.tsx:70`). Runtime: `error.tsx:179` (error reference timestamp).

## 9. `research/page-map.csv` vs routes

- Routes 53 · page-map rows 55 (no duplicate slugs) · next.config redirect sources 11.
- **Map rows with no route (2):** `/calculators/ac-wire-size` (disposition merge → `/calculators/air-conditioner-calculator`, wave WSZ-002; it is already a `next.config.ts` 308 source) · `/methodology` (new, WSZ-004, not built yet).
- **Routes with no map row:** none.
- **Redirect sources with no map row (10, already 308 in `next.config.ts`):** `/calculators/{amps-to-watts, conduit-fill, garage-subpanel-wire-size, ground-wire-size, horsepower-to-amps, kw-to-amps, ohms-law, pool-pump, three-phase, watts-to-amps}`.
- Dispositions: rebuild 40 · merge 6 · rebuild-absorb 4 · rebuild-flagship 2 · repurpose 1 · cut 1 · new 1. `interim_wsz002`: fix / withdraw / redirect-308 / strip-fabrications per row.

## 10. Checks run 2026-10-20 (report only)

- `python3 -I research/check_sources.py research/data-sources.csv research/page-map.csv` → `RESULT: OK (14 warnings)` (registry 39 rows: verified 22, candidate 1, GAP 16; the 14 warnings are pages riding GAP domains).
- `rm -rf .next && npm run build` → **pass**, 1 min 52 s. Prerender manifest: **60 routes = 53 HTML pages + 7 non-page** (`/_global-error`, `/_not-found`, `/favicon.ico`, `/icon.svg`, `/opengraph-image`, `/sitemap.xml`, `/twitter-image`), all static. Warnings: "Skipping validation of types" (`ignoreBuildErrors`); "Failed to load dynamic font for →" ×2 (next/og → Google, ECONNREFUSED behind the box firewall, so box-built OG images can lack the glyph); caniuse-lite 10 months old.
- `node_modules/.bin/tsc --noEmit` → 3 errors (§1).
- `npm run dev -- -p 3022` → serves on `*:3022`. With the stale May `.next/dev` cache, `/calculators/wire-size-calculator` returned 404 (prod 200); after `rm -rf .next` it returned 200, as did `/calculators/voltage-drop-calculator` and `/guides/awg-wire-size-chart`.

## Appendix A: top-level constant tables per file

Generated by scanning `src/**/*.{ts,tsx}` for top-level `UPPER_CASE` constants; `@a-b` = line range; flags = the block contains AWG sizes `[awg]`, NEC section/table references `[nec]`, electrical constants such as 12.9, 21.2, 1.732, √3, 746, 3.412 `[constants]`, or amps/volts/watts-keyed numbers `[ampsNumbers]`. Lower-case tables inside components are listed in §5.2.

```
src/app/about/page.tsx (582L; file:awg,nec)
    PLATFORM_STATS@75-80  TEAM_VALUES@82-103  CALCULATOR_CATEGORIES@105-130  INDUSTRY_RECOGNITION@132-153  TECHNICAL_SPECIFICATIONS@155-164
src/app/calculators/air-conditioner-calculator/page.tsx (1055L; file:awg,nec,ampsNumbers)
    AC_UNIT_EXAMPLES@23-78[awg]  AC_UNIT_TYPES@80-146[awg]  HVAC_ELECTRICAL_REQUIREMENTS@148-198[awg,nec]  MANUFACTURER_SPECIFICATIONS@200-276[awg]  INSTALLATION_STEPS@278-327  COMMON_VIOLATIONS@329-365[nec]  ENERGY_EFFICIENCY_GUIDE@367-408  TROUBLESHOOTING_GUIDE@410-483  REGIONAL_CODE_VARIATIONS@485-526
src/app/calculators/ampacity-calculator/page.tsx (943L; file:awg,nec,ampsNumbers)
    DERATING_SCENARIOS@37-93[awg]  CONDUIT_FILL_FACTORS@96-104  TEMP_CORRECTION_DETAILED@107-119  SPECIAL_CONDITIONS@122-163  INSULATION_TYPES@166-175  AMPACITY_MISTAKES@178-209[nec]
src/app/calculators/amps-to-watts-calculator/page.tsx (835L; file:awg,nec,constants)
    AMPS_TO_WATTS_EXAMPLES@23-72[constants]  POWER_CALCULATION_FORMULAS@74-103[constants]  TYPICAL_POWER_FACTORS@105-114  CIRCUIT_CAPACITY_GUIDE@116-123  NEC_COMPLIANCE_INFO@125-168[nec]  ENERGY_COST_ANALYSIS@170-195  TROUBLESHOOTING_GUIDE@197-231  ADVANCED_CALCULATIONS@233-266  COMPREHENSIVE_FAQS@268-317[constants]
src/app/calculators/conduit-fill-calculator/page.tsx (533L; file:awg,nec)
    CONDUIT_FILL_EXAMPLES@23-78[awg]  CONDUIT_FILL_LIMITS@80-87[nec]  CONDUIT_TYPES_COMPARISON@89-138  WIRE_AREA_TABLE@140-153[awg]  COMMON_CONDUIT_SIZES@155-165  COMPREHENSIVE_FAQS@167-200[nec]
src/app/calculators/dryer-calculator/page.tsx (684L; file:awg,nec)
    DRYER_EXAMPLES@23-78[awg]  DRYER_TYPES@80-133[awg]  NEC_DRYER_REQUIREMENTS@135-171  DRYER_INSTALLATION_GUIDE@173-222[awg]  COMMON_DRYER_VIOLATIONS@224-260[awg,nec]  DRYER_TROUBLESHOOTING@262-311
src/app/calculators/electrical-load-calculator/page.tsx (712L; file:nec)
    LOAD_CALCULATION_EXAMPLES@61-107[nec]  NEC_LOAD_CALCULATION_METHODS@109-143  DEMAND_FACTORS_TABLE@145-194[nec]  SERVICE_SIZING_GUIDE@196-239  INSTALLATION_CONSIDERATIONS@241-270  COMMON_LOAD_MISTAKES@272-308[nec]
src/app/calculators/ev-charger-calculator/page.tsx (597L; file:awg,nec)
    EV_CHARGER_EXAMPLES@23-78[awg]  EV_CHARGING_LEVELS@80-117[awg]  NEC_625_REQUIREMENTS@119-162[awg,nec]  POPULAR_EV_MODELS@164-219  EVSE_INSTALLATION_COSTS@221-262  COMPREHENSIVE_FAQS@264-297[awg,nec]
src/app/calculators/ev-charger-wire-size-calculator/page.tsx (537L; file:awg,nec,constants)
    COMPREHENSIVE_FAQS@23-64[awg,nec]  VEHICLE_CHARGING_COMPARISON@66-77[constants]  STATE_INCENTIVES@79-90  CHARGER_BRAND_COMPARISON@92-141
src/app/calculators/garage-subpanel-calculator/page.tsx (721L; file:awg,nec)
    GARAGE_EXAMPLES@23-84[awg,nec]  NEC_225_REQUIREMENTS@86-143[nec]  FEEDER_SIZING_CHART@145-151[awg]  INSTALLATION_COSTS@153-160  VOLTAGE_DROP_TABLE@162-171[awg]  GROUNDING_REQUIREMENTS@173-195[awg,nec]  COMMON_MISTAKES@197-234[nec]  REGIONAL_VARIATIONS@236-267  MAINTENANCE_SCHEDULE@269-300  COMPREHENSIVE_FAQS@302-327[awg,nec]
src/app/calculators/hot-tub-calculator/page.tsx (1121L; file:awg,nec,ampsNumbers)
    DETAILED_HOT_TUB_EXAMPLES@23-130[awg,ampsNumbers]  COMPREHENSIVE_NEC_680_REQUIREMENTS@132-181[awg,nec]  SPA_WIRE_SIZING_TABLE@183-238[awg,ampsNumbers]  SPA_EQUIPMENT_COMPARISON@240-277  INSTALLATION_COST_BREAKDOWN@279-334[awg]  ENERGY_CONSUMPTION_ANALYSIS@336-367  TROUBLESHOOTING_GUIDE@369-434  MAINTENANCE_SCHEDULE@436-472  REGIONAL_CODE_VARIATIONS@474-511  COMPREHENSIVE_FAQS@513-544[awg,nec]  PROFESSIONAL_TIPS@546-571
src/app/calculators/hot-tub-wire-size-calculator/page.tsx (549L; file:awg,nec)
    COMPREHENSIVE_FAQS@23-64[awg,nec]  BRAND_COMPARISON_TABLE@66-75  INSTALLATION_COSTS_BREAKDOWN@77-88[awg]  ENERGY_EFFICIENCY_TIPS@90-133  SEASONAL_MAINTENANCE@135-180
src/app/calculators/page.tsx (577L; file:awg,nec)
    ALL_CALCULATORS@291-326
src/app/calculators/pool-pump-calculator/page.tsx (905L; file:awg,nec,ampsNumbers)
    POOL_PUMP_EXAMPLES@23-78[awg,nec,ampsNumbers]  POOL_PUMP_TYPES@80-123[awg]  NEC_680_REQUIREMENTS@125-175[awg,nec]  PUMP_MANUFACTURER_SPECS@177-226[awg]  INSTALLATION_STEPS@228-277[awg]  COMMON_VIOLATIONS@279-315[awg,nec]  ENERGY_EFFICIENCY_COMPARISON@317-345  TROUBLESHOOTING_GUIDE@347-411
src/app/calculators/range-calculator/page.tsx (766L; file:awg,nec)
    RANGE_EXAMPLES@23-84[awg,nec]  NEC_DEMAND_FACTORS@86-122[awg]  RECEPTACLE_GUIDE@124-160[awg]  MANUFACTURER_SPECS@162-203  INSTALLATION_COSTS@205-236[awg]  SAFETY_REQUIREMENTS@238-263  TROUBLESHOOTING_GUIDE@265-290  REGIONAL_CODES@292-323  ENERGY_EFFICIENCY@325-350  COMPREHENSIVE_FAQS@352-377[awg,nec]
src/app/calculators/residential-load-calculator/page.tsx (649L; file:nec,ampsNumbers)
    COMPREHENSIVE_FAQS@23-64[nec]  PERMIT_REQUIREMENTS_BY_STATE@66-77  ELECTRICAL_SAFETY_CHECKLIST@79-124  APPLIANCE_LOAD_COMPARISON@126-143[ampsNumbers]  ENERGY_EFFICIENCY_UPGRADES@145-194  LOAD_MANAGEMENT_STRATEGIES@196-232
src/app/calculators/rv-hookup-calculator/page.tsx (816L; file:awg,nec)
    RV_EXAMPLES@23-90[awg,nec]  RV_SERVICE_TYPES@92-125[awg]  PEDESTAL_COMPONENTS@127-158  CAMPGROUND_ELECTRICAL@160-189  GFCI_AFCI_REQUIREMENTS@191-213  INSTALLATION_COSTS@215-246  CODE_COMPLIANCE@248-273  MAINTENANCE_SCHEDULE@275-306  TROUBLESHOOTING_GUIDE@308-333  REGIONAL_VARIATIONS@335-360  COMPREHENSIVE_FAQS@362-387[nec]
src/app/calculators/service-entrance-calculator/page.tsx (648L; file:awg,nec)
    COMPREHENSIVE_FAQS@23-64[awg,nec]  SERVICE_UPGRADE_SCENARIOS@66-117  WIRE_TYPE_COMPARISON@119-168  INSPECTION_CHECKLIST@170-226  UTILITY_CONNECTION_PROCESS@228-294  COST_BREAKDOWN_TABLE@296-307
src/app/calculators/three-phase-calculator/page.tsx (872L; file:awg,nec,constants,ampsNumbers)
    THREE_PHASE_EXAMPLES@23-84[awg,nec,ampsNumbers]  POWER_FORMULAS@86-117  MOTOR_SIZING_GUIDE@119-174[awg,ampsNumbers]  TRANSFORMER_GUIDE@176-217[nec]  POWER_FACTOR_CORRECTION@219-248  INSTALLATION_COSTS@250-281  LOAD_BALANCING@283-308  MOTOR_PROTECTION@310-341[nec]  TROUBLESHOOTING_GUIDE@343-374  REGIONAL_CODES@376-405  COMPREHENSIVE_FAQS@407-432[nec,constants]
src/app/calculators/voltage-drop-calculator/page.tsx (1494L; file:awg,nec,constants,ampsNumbers)
    COMMON_SCENARIOS@39-150[awg]  WIRE_RESISTANCE_DATA_EXTENDED@153-174[awg,constants]  MOTOR_STARTING_DATA@177-187[ampsNumbers]  DISTANCE_RECOMMENDATIONS@190-196  TEMPERATURE_CORRECTIONS@199-208  VOLTAGE_DROP_EFFECTS@211-220  POWER_FACTOR_IMPACT@223-231  VOLTAGE_DROP_COST_ANALYSIS@234-240
src/app/calculators/watts-to-amps-calculator/page.tsx (642L; file:awg,nec,constants,ampsNumbers)
    WATTS_TO_AMPS_EXAMPLES@23-96[awg]  POWER_FORMULAS_TABLE@98-141[nec]  COMMON_APPLIANCE_WATTS@143-158[constants,ampsNumbers]  POWER_FACTOR_GUIDE@160-169  CIRCUIT_SIZING_GUIDELINES@171-179  VOLTAGE_LEVEL_COMPARISONS@181-188  COMPREHENSIVE_FAQS@190-231[nec,constants]
src/app/calculators/welder-calculator/page.tsx (1052L; file:awg,nec,ampsNumbers)
    COMPREHENSIVE_WELDER_EXAMPLES@23-147[awg]  DETAILED_NEC_REQUIREMENTS@149-198[nec]  WELDER_WIRE_SIZING_TABLE@200-246[awg,ampsNumbers]  POWER_FACTOR_ANALYSIS@248-281  WELDER_COST_ANALYSIS@283-332[awg]  TROUBLESHOOTING_GUIDE@334-399  MAINTENANCE_SCHEDULE@401-437  ENERGY_EFFICIENCY_ANALYSIS@439-467  COMPREHENSIVE_FAQS@469-482  PROFESSIONAL_TIPS@502-527
src/app/calculators/well-pump-calculator/page.tsx (860L; file:awg,nec,ampsNumbers)
    WELL_PUMP_EXAMPLES@23-90[awg,nec,ampsNumbers]  PUMP_TYPES_GUIDE@92-125  MOTOR_PROTECTION@127-163[nec]  CONTROL_SYSTEMS@165-206  WIRE_SIZING_CHART@208-273[awg,ampsNumbers]  INSTALLATION_COSTS@275-306  TROUBLESHOOTING_GUIDE@308-345  REGIONAL_CONSIDERATIONS@347-378  MAINTENANCE_SCHEDULE@380-417  COMPREHENSIVE_FAQS@419-444
src/app/calculators/wire-size-calculator/page.tsx (1215L; file:awg,nec,ampsNumbers)
    COMMON_WIRE_SIZES@40-113[awg,ampsNumbers]  WIRE_AMPACITY_TABLE@118-119[awg]  TEMP_CORRECTION@131-138  COMMON_MISTAKES@141-172[nec]  WIRE_COST_COMPARISON@175-183[awg]
src/app/contact/page.tsx (655L; file:)
    CONTACT_CHANNELS@46-87  SUPPORT_CATEGORIES@89-138  RESPONSE_EXPECTATIONS@140-169  PROFESSIONAL_SERVICES@171-208  INTERNATIONAL_SUPPORT@210-239
src/app/disclaimer/page.tsx (522L; file:)
    DISCLAIMER_CATEGORIES@45-98  TECHNICAL_LIMITATIONS@100-149  PROFESSIONAL_STANDARDS@151-180  USAGE_GUIDELINES@182-216
src/app/guides/awg-wire-size-chart/page.tsx (829L; file:awg,nec,constants)
    SUB_NEC_AWG@25-28[awg]  AWG_CHART_ROWS@33-34[awg]
src/app/guides/electrical-power-calculations/page.tsx (650L; file:awg,nec,constants,ampsNumbers)
    POWER_TRIANGLE_DATA@14-19  VOLTAGE_SYSTEMS@21-26  CALCULATION_EXAMPLES@28-59[nec,constants]
src/app/guides/electrical-safety/GuideClient.tsx (742L; file:nec)
    ARC_FLASH_BOUNDARIES@8-15  PPE_CATEGORIES@17-58  LOCKOUT_STEPS@60-133  SAFETY_SCENARIOS@135-186[nec]
src/app/guides/electrical-safety/page.tsx (70L; file:)
    HOWTO_LOTO_STEPS@13-54
src/app/guides/layout.tsx (147L; file:awg)
    GUIDES@10-59[awg]
src/app/guides/nec-code-compliance/page.tsx (955L; file:awg,nec,constants)
    HOWTO_NEC_COMPLIANCE_STEPS@7-44[awg,nec]  AMPACITY_TABLE_310_16@54-65[awg]  OVERCURRENT_PROTECTION@67-75[awg]  GROUNDING_CONDUCTOR_TABLE@77-83[awg]  LOAD_CALCULATION_FACTORS@85-93[nec]  VOLTAGE_DROP_STANDARDS@95-99  INSTALLATION_METHODS@101-107  SAFETY_REQUIREMENTS@109-131
src/app/guides/nec-table-310-16/page.tsx (640L; file:awg,nec,ampsNumbers)
    NEC_310_16_DATA@32-40[awg]  TEMP_DERATING@43-55  BUNDLE_DERATING@58-65  COMMON_APPLICATIONS@68-76[awg]
src/app/guides/page.tsx (524L; file:awg,nec)
    GUIDES@12-79[awg]  ALL_GUIDES@83-95[awg,nec]  STATS@137-142
src/app/guides/power-factor-explained/GuideClient.tsx (773L; file:)
    EQUIPMENT_POWER_FACTORS@8-18  CORRECTION_METHODS@20-48  COST_ANALYSIS_DATA@50-57
src/app/guides/single-vs-three-phase/GuideClient.tsx (1298L; file:awg,nec,constants,ampsNumbers)
    VOLTAGE_SYSTEMS@8-33  MOTOR_COMPARISON@35-41  COST_ANALYSIS@43-101  WIRING_CONFIGURATIONS@103-136
src/app/guides/wire-size-for-100-amp/page.tsx (567L; file:awg,nec)
    HOWTO_100A_STEPS@21-50[awg,nec]  WIRE_SIZE_BY_DISTANCE@69-76[awg]  APPLICATIONS_100A@79-112[awg]  COST_COMPARISON@115-120[awg]  INSTALLATION_REQUIREMENTS@123-130[awg,nec]
src/app/guides/wire-size-for-200-amp/page.tsx (826L; file:awg,nec)
    HOWTO_200A_STEPS@8-37[awg,nec]
src/app/guides/wire-size-for-ev-charger/page.tsx (809L; file:awg,nec)
    HOWTO_EV_STEPS@8-37[awg,nec]
src/app/guides/wire-sizing-guide/GuideClient.tsx (810L; file:awg,nec)
    AWG_TABLE@12-13[awg]  TEMPERATURE_CORRECTION_FACTORS@25-34  CONDUIT_FILL_TABLE@36-47  INSTALLATION_SCENARIOS@49-95[awg,nec]
src/app/guides/wire-sizing-guide/page.tsx (58L; file:awg,nec,constants)
    WIRE_SIZING_STEPS@13-42[awg,nec,constants]
src/app/opengraph-image.tsx (159L; file:awg)
    NAVY@12-12  BLUE@13-13  INDIGO@14-14  AMBER@15-15  SKY@16-16  SLATE_300@17-17  WHITE_10@18-18  WHITE_20@19-19
src/app/page.tsx (1463L; file:awg,nec,constants,ampsNumbers)
    CALCULATOR_CATEGORIES@31-79[awg]  COMMON_WIRE_SIZES@82-89[awg,ampsNumbers]  SERVICE_SIZES@91-96[awg]  VOLTAGE_DROP_LIMITS@98-102  HOMEPAGE_BREAKER_PAIRINGS@108-111[awg]  NEC_TABLE_310_16@115-116[awg]  EQUIPMENT_LOADS@126-133[awg,ampsNumbers]  CONDUIT_FILL@136-140  WIRE_COSTS@143-149[awg]  GROUNDING_CONDUCTORS@152-157[awg]  MOTOR_FLA@160-168
src/app/sitemap.ts (185L; file:awg)
    TOP_CALCULATORS@118-124  TOP_GUIDES@126-132[awg]
src/app/terms/page.tsx (541L; file:)
    PLATFORM_SERVICES@42-93  USER_RESPONSIBILITIES@95-126  PROHIBITED_ACTIVITIES@128-139  LIMITATION_AREAS@141-167
src/components/calculators/AirConditionerCalculator.tsx (559L; file:awg,nec,ampsNumbers)
    AC_UNIT_TYPES@16-97[ampsNumbers]  EFFICIENCY_RATINGS@100-121  INSTALLATION_TYPES@124-135
src/components/calculators/AmpacityCalculator.tsx (337L; file:awg,nec,ampsNumbers)
    AWG_OPTIONS@15-36[awg]  TEMPERATURE_OPTIONS@38-42  AMBIENT_TEMP_OPTIONS@44-52  CONDUIT_FILL_OPTIONS@54-62
src/components/calculators/AmpsToWattsCalculator.tsx (470L; file:constants,ampsNumbers)
    COMMON_VOLTAGES@19-29  COMMON_POWER_FACTORS@31-39
src/components/calculators/BTUToWattsCalculator.tsx (526L; file:constants,ampsNumbers)
    TIME_UNITS@12-16  EQUIPMENT_PRESETS@18-29  VOLTAGE_OPTIONS@31-37  PHASE_OPTIONS@39-42
src/components/calculators/BoxFillCalculator.tsx (577L; file:awg,nec)
    BOX_TYPES@13-20  BOX_VOLUMES@23-61  CONDUCTOR_VOLUMES@64-74
src/components/calculators/CircuitBreakerCalculator.tsx (619L; file:awg,nec,ampsNumbers)
    LOAD_TYPES@16-52  BREAKER_TYPES@55-98  COORDINATION_LEVELS@101-120
src/components/calculators/ConduitFillCalculator.tsx (426L; file:awg,nec)
    CONDUIT_TYPES@13-20  CONDUIT_FILL_AREAS@22-47  WIRE_AREAS@50-69[awg]
src/components/calculators/DryerCalculator.tsx (511L; file:awg,nec,ampsNumbers)
    DRYER_TYPES@16-59  OUTLET_TYPES@62-87  INSTALLATION_ENVIRONMENTS@90-111
src/components/calculators/EVChargerCalculator.tsx (210L; file:awg,nec,ampsNumbers)
    EV_CHARGER_PRESETS@13-23[ampsNumbers]
src/components/calculators/EVChargerWireSizeCalculator.tsx (991L; file:awg,nec)
    EV_MODELS@32-48  CHARGER_TYPES@50-107  WIRE_SIZES@113-114[awg]  REAL_WORLD_SCENARIOS@125-201[awg,nec]  INSTALLATION_GUIDE@203-242
src/components/calculators/ElectricalLoadCalculator.tsx (707L; file:awg,nec,ampsNumbers)
    BUILDING_TYPES@16-71[nec]  LOAD_CATEGORIES@74-117
src/components/calculators/GarageSubpanelCalculator.tsx (603L; file:awg,nec,ampsNumbers)
    SUBPANEL_SIZES@16-47  LOAD_CALCULATIONS@50-72  INSTALLATION_METHODS@75-100
src/components/calculators/GroundWireCalculator.tsx (471L; file:awg,nec,ampsNumbers)
    GROUNDING_CONDUCTOR_TABLE@13-35[awg]  PHASE_CONDUCTOR_SIZES@38-42[awg]  BREAKER_SIZES@44-50
src/components/calculators/HotTubCalculator.tsx (207L; file:awg,nec,ampsNumbers)
    HOT_TUB_SIZES@13-18[ampsNumbers]
src/components/calculators/HotTubWireSizeCalculator.tsx (1049L; file:awg,nec,constants)
    HOT_TUB_MODELS@32-48  INSTALLATION_TYPES@50-95  REAL_WORLD_SCENARIOS@97-173[awg,nec]  CLIMATE_CONSIDERATIONS@175-206  SAFETY_REQUIREMENTS@208-244[nec]
src/components/calculators/KilowattsToAmpsCalculator.tsx (453L; file:constants,ampsNumbers)
    VOLTAGE_OPTIONS@12-19  PHASE_OPTIONS@21-24  APPLICATION_PRESETS@26-33[ampsNumbers]
src/components/calculators/LowVoltageCalculator.tsx (671L; file:awg)
    VOLTAGE_SYSTEMS@16-77  LOW_VOLTAGE_WIRE_GAUGES@80-88[awg]  LOAD_TYPES@91-140
src/components/calculators/OhmsLawCalculator.tsx (378L; file:)
    CALCULATION_OPTIONS@14-19
src/components/calculators/RVHookupCalculator.tsx (539L; file:awg,nec,ampsNumbers)
    RV_HOOKUP_TYPES@16-53  INSTALLATION_ENVIRONMENTS@56-81  PEDESTAL_TYPES@84-100
src/components/calculators/RangeCalculator.tsx (568L; file:awg,nec,ampsNumbers)
    RANGE_TYPES@16-81[ampsNumbers]  DEMAND_FACTORS@84-100[nec]  INSTALLATION_TYPES@103-124
src/components/calculators/ResidentialLoadCalculator.tsx (965L; file:nec,ampsNumbers)
    APPLIANCE_LOADS@28-49  REAL_WORLD_SCENARIOS@51-127[nec]  SERVICE_SIZE_GUIDE@129-178  NEC_DEMAND_FACTORS@180-192
src/components/calculators/ServiceEntranceCalculator.tsx (1027L; file:awg,nec,constants)
    SERVICE_TYPES@39-72  SERVICE_SIZES@74-87[awg]  REAL_WORLD_SCENARIOS@89-165[nec]  UTILITY_REQUIREMENTS@167-203  GROUNDING_REQUIREMENTS@205-211[awg]
src/components/calculators/ThreePhaseCalculator.tsx (714L; file:awg,nec,constants,ampsNumbers)
    VOLTAGE_SYSTEMS@16-57  LOAD_BALANCE_TYPES@60-85  CONNECTION_TYPES@88-110  CALCULATION_MODES@113-132[constants]
src/components/calculators/VoltageDropCalculator.tsx (318L; file:awg,ampsNumbers)
    WIRE_SIZE_OPTIONS@16-19[awg]  VOLTAGE_OPTIONS@21-27  PHASE_OPTIONS@29-32
src/components/calculators/VoltsToAmpsCalculator.tsx (385L; file:constants)
    PHASE_OPTIONS@12-15  LOAD_TYPE_OPTIONS@17-21
src/components/calculators/WelderCalculator.tsx (575L; file:awg,nec,constants,ampsNumbers)
    WELDER_TYPES@16-25  VOLTAGE_OPTIONS@27-32  PHASE_OPTIONS@34-37  WELDER_PRESETS@39-47[ampsNumbers]
src/components/calculators/WellPumpCalculator.tsx (447L; file:awg,nec,ampsNumbers)
    WELL_PUMP_TYPES@16-65  MOTOR_FLC_TABLE@68-82  CONTROL_BOXES@85-101
src/components/calculators/WireResistanceCalculator.tsx (682L; file:awg,constants)
    WIRE_RESISTANCE_DATA@16-35[awg]  TEMPERATURE_FACTORS@38-53  CALCULATION_MODES@56-77  CIRCUIT_TYPES@80-84[constants]
src/components/calculators/WireSizeCalculator.tsx (252L; file:awg,ampsNumbers)
    VOLTAGE_OPTIONS@16-22  PHASE_OPTIONS@24-27
src/components/calculators/kVAToAmpsCalculator.tsx (533L; file:constants,ampsNumbers)
    VOLTAGE_OPTIONS@12-22  PHASE_OPTIONS@24-27  EQUIPMENT_PRESETS@29-40[ampsNumbers]
src/components/seo/ArticleFAQSchema.tsx (89L; file:)
    FALLBACK_DATE@23-23
src/components/seo/ArticleSchema.tsx (70L; file:)
    FALLBACK_DATE@17-17
src/components/seo/BasicPageSchema.tsx (49L; file:)
    ORIGIN@14-14
src/components/seo/DatasetSchema.tsx (100L; file:nec)
    ORIGIN@45-45
src/components/seo/HowToSchema.tsx (59L; file:)
    ORIGIN@26-26
src/components/ui/VoltageInput.tsx (169L; file:)
    COMMON_VOLTAGES@14-25
src/components/visualizations/WireSizeScale.tsx (49L; file:awg)
    COMMON_SIZES@1-1[awg]
src/components/visualizations/WireVisualization.tsx (143L; file:awg,constants)
    WIRE_DIAMETERS@5-24[awg,constants]
src/lib/article-dates.ts (80L; file:)
    FALLBACK_DATE@21-22
src/lib/data/nec-tables.ts (232L; file:awg,nec,constants,ampsNumbers)
    NEC_310_16@49-72[awg,constants]  NEC_TABLE_310_16@80-80  NEC_240_4_D_MAX_OCPD@135-139  NEC_250_122@152-169[awg]  NEC_310_15_TEMP_CORRECTION@186-197  NEC_310_15_C_1_BUNDLING@204-211  NEC_COMMON_REFERENCE_75C@226-231[awg]
src/lib/data/wire-properties.ts (279L; file:awg,constants)
    WIRE_PROPERTIES@20-219[awg,constants]
src/utils/breadcrumbs.ts (114L; file:awg,nec,ampsNumbers)
    STOP_WORDS@4-7  ACRONYMS@11-15[awg]  MIXED_CASE@18-23[ampsNumbers]  SLUG_OVERRIDES@27-29[nec]
```
