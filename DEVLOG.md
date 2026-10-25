# DEVLOG — wiresizes.com
> Handoff file. Read §0–§5 and the last 10 entries of §6 before any work. Rules: devlog skill (.claude/skills/devlog/SKILL.md).

## §0 Resume here
_last update: 2026-10-25 · WSZ-002_
- Phase: WSZ-002 STOPBLEED done in the box, not pushed: fabricated claims and costs removed, the 15 live calculators run on verified data with golden-case tests, 15 tools withdrawn, 6 new 308s, trust pages rewritten, GA4 behind consent. Rebuild waves (WSZ-003 onward) not started.
- Last confirmed: WSZ-002 STOPBLEED — done (commits ee3a82b…the DEVLOG commit; see §6). Before it: WSZ-013 DRAFTCHECK — done (36d0001); WSZ-001 BOOTSTRAP — done (506a451).
- In flight (handed, NOT confirmed): none
- impeccable not installed: `npx --yes impeccable@4.7.0 install -y --no-hooks --providers=claude --scope=project` (2026-10-25, WSZ-002 step 1) → "Download failed: Could not verify skill bundle: https://impeccable.style/api/download/bundle/universal: Connection Failed: Connect error: Network unreachable (os error 101). Nothing was installed". impeccable.style is not on the box firewall allowlist; before/after `git status --short --ignored` identical.
- Next action: chat's Chrome test of the local build (`npm run dev -- -p 3022`): calculator result panels, print and share, the cookie banner on both paths (`/?consent-region=eu`, `/?consent-region=other`, localhost only), keyboard reach, 320 px overflow. Apply the fixes chat sends, then WSZ-003.
- Waiting on owner:
  · push the local commits (506a451, the WSZ-013 commit 36d0001, and the WSZ-002 commits ee3a82b…the DEVLOG commit) after chat's Chrome test;
  · create the contact@wiresizes.com forwarding alias;
  · add the GSC Domain property and check Manual actions;
  · add the apex site in Bing Webmaster Tools;
  · let chat run its Chrome test of the local build and apply the fixes it sends.
- Open questions:
  - Raptive: applied, and what status? No ad script is in the code.
  - Box launcher: does it publish container port 3022 to the Mac? The repo's .devcontainer/devcontainer.json (untracked) still says `-p 3001:3000`.

## §1 Site card
- Domain · status (dev|live) · Raptive: wiresizes.com · live on Vercel (apex 200; www → 308 → apex on 2026-10-20) · Raptive: ?
- Owner (pushes, runs account steps) · machine: Marko Visic · his Mac (pushes from there)
- Author (byline · credentials · sameAs): Marko Visic · BSc Physics, Faculty of Mathematics and Physics, University of Ljubljana · https://www.linkedin.com/in/marko-visic/ (named on /about since WSZ-002; byline and Person/Organization schema come in WSZ-004)
- Publisher and data controller: Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia, company registration number 9041273000, VAT ID SI94001154 (D-03), on /about, /contact, /privacy and /terms
- Repo origin · branch: https://github.com/Mapstor/wiresizes.git · main (at bootstrap a99da4e = origin/main, 50 commits)
- Project folder · box project · preview port (.devcontainer/port): ~/dev/wiresizes (box: /workspace) · claude-sandbox-wiresizes · 3022 (.devcontainer/ is untracked)
- Stack · Node in box: Next.js 16.1.4 App Router + Turbopack, React 19.2.3, TypeScript 5.9.3 (strict; the build skips type checks), Tailwind 3.4.19, `output: 'standalone'`; 49 prerendered HTML pages (34 live, 15 withdrawal notices) + /api/consent-region; every calculator runs client-side · Node v22.23.3 / npm 10.9.9 (image node:22, linux-arm64)
- Commands (dev / build / test / lint): `npm run dev -- -p 3022` / `npm run build` (~2–4 min in box) / `npm test` (node --experimental-strip-types with tests/register.mjs; 136 tests) / `npm run lint` (eslint 9, not run yet). Gates after a fresh build: `node scripts/check-banned.mjs`, `node scripts/check-structure.mjs`. Types: `npx tsc --noEmit`. Registry: `python3 -I research/check_sources.py research/data-sources.csv research/page-map.csv`
- Deploy (host, project, trigger; owner pushes): Vercel project "wiresizes" (.vercel/project.json, gitignored); a push deploys (WSZ-001 prompt); owner pushes. Framework build: repo-root files 404 in production (checked 2026-10-20), so DEVLOG.md and research/ are not exposed.
- Analytics / Search Console / Bing: GA4 G-T871GVJZE2 loads only from src/components/analytics/Consent.tsx (Consent Mode v2, ad signals always denied; banner for EU/EEA/UK/CH or a missing country header via /api/consent-region; "Cookie settings" in the footer; D-10) + Vercel Web Analytics + Speed Insights. Fonts self-hosted (@fontsource). GSC verified by meta + public/google12f8c2f9c03913a3.html (Domain property ?). Bing verified by msvalidate.01 meta + public/BingSiteAuth.xml.
- Data sources (or registry path): research/data-sources.csv (pack v4: 45 rows — 32 verified, 2 candidate, 11 GAP) · data/verified/*.json · research/golden-cases.json (214 cases) · research/nec-sections-allowlist.csv · research/PACK_VERSION (v4)
- Key paths (pages, components, data/ETL, scripts): pages src/app/**/page.tsx · calculator UI src/components/calculators/ · engine src/lib/calculations/{sizes,inputs,conductor-sizing,voltage-drop,ampacity,grounding,resistance,dc-sizing,service-lookup,power,conversions,ohms-law}.ts (pure, tested) · legacy src/lib/calculations/wire-sizing.ts (withdrawn components only) and src/lib/data/nec-tables.ts (WSZ-003 replaces it) · withdrawal notice src/components/content/WithdrawnTool.tsx · consent src/components/analytics/Consent.tsx, src/app/api/consent-region/route.ts, src/lib/consent-region.ts · JSON-LD src/components/seo/ · Header/Footer src/components/layout/ · sitemap src/app/sitemap.ts · dates src/lib/article-dates.ts · public/robots.txt, public/llms.txt · tests tests/*.test.ts + tests/register.mjs · gates scripts/check-banned.mjs, scripts/check-structure.mjs, scripts/lib/build-output.mjs · audit scripts scripts/*.mjs (puppeteer-core, Mac Chrome)
- Skills in repo: .claude/skills/ → anti-slop-prose, content-page, data-sourcing, devlog, google-ai-content-policy, raptive-ready, seo-visibility, site-audit (impeccable: not installed)
- Design system (DESIGN.md / PRODUCT.md): none
- Other plans / ledgers: research/AUDIT-2026-10.md (findings; §7 plan, §8 GAPs, §9 decisions) · research/code-audit-2026-10.md (calculator logic) · research/page-map.csv (dispositions, waves, interim_wsz002) · research/page-specs.md · research/trust-pages-copy.md · research/trust-frame-spec.md · research/wsz002-banned-strings.txt · research/wsz002-withdrawals.csv · research/prompts/ (WSZ-002.txt, ALL-WSZ-002-011.txt) · research/inventory-2026-10.md (code inventory) · research/wsz002-draft-review.md
- Prompt code: WSZ

## §2 Decisions in force
- D-01 2026-10-20 · Canonical host stays https://wiresizes.com (apex); Vercel 308s www → apex, live since May 2026. Why: Google already moved to the apex, and switching now would start a second migration.
- D-02 2026-10-20 · 15 tools withdrawn (noindex, follow; dated notice; out of sitemap, hubs and links) until their sources are verified. Seven redirects (two new, five existing) land on withdrawal notices until WSZ-010/011. Why: their core outputs rested on unverified or wrong code rules, and a wrong number is worse than no page.
- D-03 2026-10-25 · The byline uses only the physics credential. The publisher is shown as Moving Data Systems d.o.o., Smolnik 62, 2342 Ruše, Slovenia, with company registration number 9041273000 and VAT ID SI94001154, on /about, /contact, /privacy and /terms. Why: ZEPT Article 5 requires the company and its seat, an email address, the registration number and the tax number, reachable from the home page (owner decision 2026-10-25, replacing the 2026-10-19 choice to leave the numbers out).
- D-04 2026-10-20 · Commits in the box use `git -c user.name="Mapstor" -c user.email="your-email@example.com"`. Why: it matches the 50 existing commits, and nothing is written to git config.
- D-05 2026-10-20 · Fonts are self-hosted via @fontsource, and tests run on Node 22 strip-types with tests/register.mjs. Why: no page makes a third-party font request, and there's no test framework dependency.
- D-06 2026-10-20 · In WSZ-002 the wire size calculator sizes from the 60 °C column only. WSZ-009 adds the 75 °C option under 110.14(C) (verified from NFPA's 2023-cycle Second Draft); NM and UF cable stay at 60 °C until 334.80/340.80 are verified. Why: the 60 °C column is never undersized for termination or cable-type limits; ambient and bundling corrections still apply, and the results say so.
- D-07 2026-10-20 · Impeccable is pinned to impeccable@4.7.0, the version chat inspected. Why: npx would otherwise run whatever the name resolves to that day; upgrades go through a chat prompt.
- D-08 2026-10-24 · The ground wire is not capped at the circuit conductor size. Table 250.122 gives 25 A aluminum an 8 AWG EGC on a 10 AWG conductor, and the tools show it with the note "For this rating, Table 250.122 lists a ground wire larger than the smallest conductor the rating allows." Why: the 250.122(A) sentence that caps it has been seen only in the 2026 Second Draft, not in 2023 text; a larger ground wire is conservative, and chat will lift this when the sentence is verified.
- D-09 2026-10-24 · Text marked verified-sd2023 (2023-cycle Second Draft, two pulls with planted wrong values rejected) renders as 2023 NEC even where the 2022 Technical Meeting and Standards Council record was not seen; each data file says which items that covers. 625.54 stays held. Why: NFPA lists the 2022 appeal topics (optical fiber cable, copper-clad aluminum wiring, surge protection, GFCI protection, pool bonding); 625.54 is a GFCI rule with no post-issuance 2023 source, and the only other overlap, the CCA items of 240.4(D), is covered by a post-issuance Minnesota review of the issued code. The owner can reverse this; chat closes items as post-issuance text arrives.
- D-10 2026-10-25 · Google Analytics 4 runs only after consent for visitors from the EU, the EEA, the UK and Switzerland (region from Vercel's x-vercel-ip-country header; missing header counts as covered), and by default elsewhere; Consent Mode v2 with ad signals always denied; "Cookie settings" in the footer for everyone. Why: Slovenia's ZEKom-2 Article 225 requires prior consent for non-essential cookies, and Raptive needs GA4 data when the site applies. Raptive's own consent tool replaces this banner after onboarding.

## §3 Rejected — don't re-propose
- none yet

## §4 Gotchas & hard rules
- No number goes on a page unless it traces to data/verified/*.json, research/golden-cases.json or an engine; no NEC section reference outside research/nec-sections-allowlist.csv.
- NFPA owns the NEC text: values as data with attribution, short quotes only, no PDFs of NEC tables.
- Research packs install only through a prompt's pack step: verify research/MANIFEST.sha256, copy, diff, check_sources, commit. research/PACK_VERSION names the installed pack.
- Box egress is an allowlist (/usr/local/bin/init-firewall.sh, ipset allowed-domains, IPs resolved once at init). Allowed: registry.npmjs.org, github.com, api.github.com, objects.githubusercontent.com, raw.githubusercontent.com, codeload.github.com, api.anthropic.com, statsig.anthropic.com, sentry.io, vercel.com, api.vercel.com, simplemaplab.com, www.simplemaplab.com. All other TCP 80/443 is refused (impeccable.style too). On 2026-10-20 `git fetch` / `git ls-remote origin` and `npm ping` worked. If they start failing, the IPs rotated: `sudo /usr/local/bin/init-firewall.sh` re-resolves them.
- wiresizes.com answers from the box only because it shares Vercel IP 216.150.1.1 with the allowlisted simplemaplab.com: production checks from the box are best-effort. fonts.googleapis.com is blocked, so the build logs "Failed to load dynamic font for →" (OG image glyph). Harmless; Vercel builds fetch it.
- node_modules is shared with the Mac. A plain `npm install <pkg>` in the box (WSZ-002 step 1) kept the darwin binaries and added linux-arm64 ones; anything beyond that waits for the owner.
- .gitignore has `.claude/*` + `!.claude/skills/` (WSZ-002): skill folders commit normally; .claude/settings.local.json stays ignored.
- The build skips type checking (next.config.ts `typescript.ignoreBuildErrors: true`). `npx tsc --noEmit` after `rm -rf .next && npm run build`: 1 error after WSZ-002 (WellPumpCalculator.tsx:129, a withdrawn component); the WSZ-002 baseline at ee3a82b was 3. Never end a wave above it.
  - Run tsc only after a fresh build. tsconfig includes every .tsx, unused components too, plus `.next/(dev/)types/validator.ts`, which imports every page file. A stale .next therefore breaks tsc once route folders are deleted.
- Tests import only pure .ts modules with erasable TypeScript (`import type`, no enums, namespaces or parameter properties); tests/register.mjs maps "@/" to src/, resolves extensionless imports and loads .json as ES modules. Calculator logic goes in src/lib/calculations/*.ts, never inside a component.
- Gates: scripts/check-banned.mjs (built HTML + text files + the TypeScript AST of live source modules, phrases from research/wsz002-banned-strings.txt matched literally, case-insensitive) and scripts/check-structure.mjs (10 structural checks). Both read a fresh `rm -rf .next && npm run build`. Paraphrased claims pass a literal phrase list, so read changed pages too.
- Calculator result panels render only after Calculate, and the BTU-to-watts and three-phase tools only in the browser: the HTML gates cannot see them; check-banned's source scan and the browser test cover them.
- WithdrawnTool.tsx maps each "Related pages" link to its target's H1 (PAGE_H1) and throws at build if one is missing: update PAGE_H1 when a target page's H1 changes.
- GA4 loads only from src/components/analytics/Consent.tsx; tests/consent.test.ts fails if "googletagmanager.com" appears anywhere else under src.
- A stale `.next/dev` cache made `next dev` 404 an existing route (2026-10-20). Run `rm -rf .next` before trusting a dev 404.
- Preview: `npm run dev -- -p 3022` (the `dev` script is plain `next dev` = port 3000; devcontainer.json's 3001:3000 is stale). The box has no Playwright/Chromium, and scripts/*.mjs audit scripts need Mac Chrome: browser and layout checks run on the Mac, so UI work done in the box stays unverified.
- Sitemap lastmod and Article dates come from `git log` at build (src/app/sitemap.ts, src/lib/article-dates.ts): a commit touching a page file re-dates it, so a mass edit re-dates every page.
- The box shell is zsh: an unmatched glob (e.g. `ls .env*`, `grep --include=*.tsx`) aborts the whole command. List with `ls -a | grep` instead.
- The box has no git identity (`git commit` fails with "Author identity unknown"); commit per D-04.

## §5 Backlog (priority order)
Waves from research/AUDIT-2026-10.md §7; drafts in research/prompts/ (ALL-WSZ-002-011.txt).
- [P2] WSZ-003 data layer and gates
- [P2] The BTU-to-watts and three-phase calculators render only in the browser, so their tools are missing from the HTML; server-render them when WSZ-003 rebuilds the engines.
- [P2] Before WSZ-002, 9 of 32 pages scrolled sideways at 320 px (chat's Chrome test, 2026-10-25); chat rechecks them on the new build.
- [P3] WSZ-004 trust frame + /methodology
- [P3] per-gauge pages (/awg/14 …). Decide after the chart rebuild, with a google-ai-content-policy pass (scaled-template risk).
- [P3] WSZ-002 items left for the rebuild waves (new content was out of scope): AWG chart rows for 20–40 AWG and kcmil (AUDIT §5 P1); EV guide statements of 625.40, 625.43 and 220.57 (AUDIT §5 P1 [V]); the EIA/DOE power-factor definitions and example (AUDIT §5 Fix [V]); 4/0 copper weight 0.6405 lb/ft on single-vs-three (its block was deleted in step 2).
- [P4] WSZ-005 flagships
- [P5] WSZ-006 physics tools
- [P6] WSZ-007 converters
- [held] WSZ-008 to WSZ-011: held until the GAPs in research/AUDIT-2026-10.md §8 are sourced (they rebuild the 15 withdrawn tools)
- [P7] WSZ-012 QA

## §6 Log (append-only, newest at bottom)
### 2026-10-20 · WSZ-001 BOOTSTRAP · CC · done
- What: bootstrapped DEVLOG.md and the CLAUDE.md block; installed the research pack (54 files, 0 conflicts; wsz-pack/ deleted); box, network and git checks; code inventory → research/inventory-2026-10.md. No page content changed.
- Files: DEVLOG.md, CLAUDE.md, research/ (26 pack files + inventory-2026-10.md), data/verified/ (9), .claude/skills/{anti-slop-prose,content-page,data-sourcing,devlog,google-ai-content-policy,raptive-ready,seo-visibility,site-audit} (force-added)
- Verified: `diff -r` pack vs installed → identical; `python3 -I research/check_sources.py research/data-sources.csv research/page-map.csv` → RESULT: OK (14 warnings); `rm -rf .next && npm run build` → pass, 60 prerendered (53 pages + 7 non-page), sitemap 53 = routes 53; throwaway `node --test --experimental-strip-types` → 1/1 pass (deleted); `git ls-remote origin HEAD`, `npm ping` → OK. The repo has no test suite (0 tests). Not run: `npm run lint`.
- Commit: "chore(wsz-001): DEVLOG, research pack, inventory" (this commit, parent a99da4e; pushed: no)
- Notes: www → apex 308 live on 2026-10-20 (AUDIT §2 said www 200). `tsc --noEmit` finds 3 errors the build hides. Fabricated badges are in Header.tsx, Footer.tsx and opengraph-image.tsx (inventory §4.1). 56 of 61 banned phrases are in the current build. page-map vs routes: only /calculators/ac-wire-size (already a 308) and /methodology (new) lack routes.

### 2026-10-24 · WSZ-013 DRAFTCHECK · CC · done
- What: checked each step of the WSZ-002 draft (research/prompts/WSZ-002.txt, marked "do not run") against the code at 506a451. Output: research/wsz002-draft-review.md, with 11 must-fix items, owner pre-steps, file:line for each draft item, the value check and a link appendix. Run on the owner's "continue" with no chat prompt; ID = highest in DEVLOG (WSZ-012) + 1. No page, config or data file changed.
- Files: research/wsz002-draft-review.md (new), DEVLOG.md
- Verified: the draft's replacement values match data/verified/*.json, research/data-sources.csv and golden-cases.json (21 scripted checks plus 3 read by hand, all pass). Every step-5 draft item was located in the source or reported. `git fetch`: origin/main still a99da4e. Production 2026-10-24 07:40 UTC: www → 308 → apex; apex 200 with apex canonical. Node v22.23.3 runs .ts with no flag (throwaway files, deleted). No build or tsc run (no code changed).
- Commit: "docs(wsz-013): WSZ-002 draft checked against the code" (this commit, parent 506a451; pushed: no)
- Notes: biggest gaps in the draft:
  - tsc can't pass until the 3 existing errors are fixed;
  - step 6 targets a formula the tool doesn't use: the bad formula is in the page's example and FAQ, and the tool recommends 10 AWG for 33 A (with a warning);
  - not covered: FAQPage JSON-LD on 30 pages, the Dataset CC BY license, the /search SearchAction;
  - the HTML-only banned scan misses the OG image, post-click and client-only text;
  - 3 of the 7 redirects point at pages the same prompt withdraws.

### 2026-10-25 · WSZ-002 STOPBLEED · CC · done
- What: pack v4 installed; housekeeping (.gitignore skills, self-hosted fonts, Node test runner); fabricated claims, costs and compliance wording removed site-wide; FAQPage, HowTo, SearchAction and the Dataset license dropped; 6 new 308s; 15 tools withdrawn (dated notice, noindex, follow); the 15 live calculators rebuilt on pure modules in src/lib/calculations (60 °C sizing with 240.4(D), EGC by OCPD and material with 250.122(B) scaling, 75 °C voltage drop, Table 310.12/250.66 service lookup) with labelled form controls; AUDIT §5 P0/P1 content fixes on 27 pages (run in four parallel helpers, every diff reviewed); trust pages verbatim from research/trust-pages-copy.md; GA4 behind consent (D-10). Impeccable not installed (§0).
- Files: research/, data/verified/, .gitignore, package.json, package-lock.json, tests/, scripts/check-banned.mjs, scripts/check-structure.mjs, scripts/lib/build-output.mjs, next.config.ts, src/app/** (6 route folders deleted, 15 withdrawn pages), src/components/**, src/lib/calculations/*.ts, src/lib/data/nec-tables.ts, src/lib/consent-region.ts, public/llms.txt, public/manifest.json, DEVLOG.md
- Verified: `rm -rf .next && npm run build` → pass (54/54 static pages); `node scripts/check-banned.mjs` → 0 hits (49 HTML files, 5 text files, 53 + 39 source modules); `node scripts/check-structure.mjs` → 10/10 pass; `npm test` → 136 pass, 0 fail, 0 skipped; `npx tsc --noEmit` errors 3 → 1; check_sources → RESULT: OK (13 warnings); `npm run dev -- -p 3022`: /, wire size, welder (withdrawn) → 200; the 6 new sources → 308 to their targets; /api/consent-region: US false, SI/GB/no header true, Cache-Control no-store; third-party origins in the built HTML of /, the AWG chart, wire size, /about and /privacy: none.
- Unverified: everything that needs a browser (result panels, print and share, cookie banner and its padding, keyboard reach, 320 px layout).
- Commit: ee3a82b, 5688470, a94a71b, 914a25a, 699de9a, 4af3d94 and this commit (pushed: no)
- Notes: couldn't do (§5 [P3]): coverage additions that would be new content, and the 4/0 weight whose block step 2 deleted. Withdrawn components and wire-sizing.ts stay unused until WSZ-008–011.

## §7 History & archive
- 2026-01 · 1 commit · 67f98af Create Next App scaffold (2026-01-21)
- 2026-02 · 16 commits (02-22…02-24) · full site build (6f58c08); build fixes incl. a676ef4 "Skip TypeScript errors during production build"; dynamic imports; Google/Bing verification; favicons; mobile overflow
- 2026-04 · 8 commits (04-06) · JSON-LD + sitemap; schema migration; 851cdda header "trust indicators" (the fabricated trust bar); favicon via the metadata API
- 2026-05 · 25 commits (05-05…05-13) · per-page canonicals + host alignment; OG generator; central nec-tables.ts; git-derived article dates; Vercel Analytics + Speed Insights; Dataset/HowTo schema; content sprints A–E; mobile-overflow and TDZ fixes; last a99da4e (05-13)
- 2026-06…2026-10-19 · no commits; 2026-10-19 chat audit → research pack, installed by WSZ-001
