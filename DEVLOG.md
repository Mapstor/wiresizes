# DEVLOG — wiresizes.com
> Handoff file. Read §0–§5 and the last 10 entries of §6 before any work. Rules: devlog skill (.claude/skills/devlog/SKILL.md).

## §0 Resume here
_last update: 2026-10-24 · WSZ-013_
- Phase: audit done 2026-10-19 (research/AUDIT-2026-10.md); research pack installed and code inventoried; WSZ-002 draft checked against the code; rebuild not started.
- Last confirmed: WSZ-013 DRAFTCHECK — WSZ-002 draft checked against the code → research/wsz002-draft-review.md — done (commit "docs(wsz-013): WSZ-002 draft checked against the code", parent 506a451). Before it: WSZ-001 BOOTSTRAP — done (506a451).
- In flight (handed, NOT confirmed): none
- Next action: chat revises WSZ-002 STOP-THE-BLEED from research/wsz002-draft-review.md (§1 must-fix list, §2 owner pre-steps) and research/inventory-2026-10.md, then hands it. Draft: research/prompts/WSZ-002.txt, which says "do not run".
- Waiting on owner: push the WSZ-001 and WSZ-013 commits (origin/main is still a99da4e on 2026-10-24). Before WSZ-002 is pushed: create the contact@ alias; decide the host and, if www, flip the Vercel primary domain in the same sitting as that push; answer the open questions below.
- Open questions:
  - Canonical host: www or apex? Chat recommends www (AUDIT §2: 98% of Bing clicks land on www). Fact on 2026-10-20 and again 2026-10-24: Vercel 308s every www URL → apex, and metadataBase, sitemap, canonicals, JSON-LD and llms.txt are all apex. AUDIT §2's "www 200, no redirect" no longer holds.
  - Does the contact@wiresizes.com forwarding alias exist? The site publishes support@, consulting@, legal@, education@, emergency@, international@, privacy@ and dpo@, but no contact@.
  - GA4 (gtag, src/app/layout.tsx:79-90) sets cookies on every page with no consent step. Drop it (Vercel Web Analytics stays) or add consent before /privacy names a lawful basis?
  - Raptive: applied, and what status? No ad script is in the code.
  - Search Console: does a Domain property exist? AUDIT §2's export was the www URL-prefix property.
  - Box launcher: does it publish container port 3022 to the Mac? The repo's .devcontainer/devcontainer.json still says `-p 3001:3000`.
  - Pending decisions from research/AUDIT-2026-10.md §9: 2 (withdraw 14 tools now), 3 (physics-only byline), 4 (publisher/controller + postal address on /privacy, VAT display; the audit says ask the accountant, while the WSZ-002 draft's D-03 records "no registration number or VAT ID"), 6 (cut /guides/electrical-safety, merge 5 duplicates), 7 (per-gauge pages).

## §1 Site card
- Domain · status (dev|live) · Raptive: wiresizes.com · live on Vercel (apex 200; www → 308 → apex on 2026-10-20) · Raptive: ?
- Owner (pushes, runs account steps) · machine: Marko Visic · his Mac (pushes from there)
- Author (byline · credentials · sameAs): Marko Visic · BSc Physics, Faculty of Mathematics and Physics, University of Ljubljana · https://www.linkedin.com/in/marko-visic/ (the site shows no author today: Article author = Organization "WireSizes.com")
- Publisher and data controller: Moving Data Systems d.o.o., Maribor, Slovenia (not named anywhere in the code on 2026-10-20)
- Repo origin · branch: https://github.com/Mapstor/wiresizes.git · main (at bootstrap a99da4e = origin/main, 50 commits)
- Project folder · box project · preview port (.devcontainer/port): ~/dev/wiresizes (box: /workspace) · claude-sandbox-wiresizes · 3022 (.devcontainer/ is untracked)
- Stack · Node in box: Next.js 16.1.4 App Router + Turbopack, React 19.2.3, TypeScript 5.9.3 (strict; the build skips type checks), Tailwind 3.4.19, `output: 'standalone'`; 53 static routes, every calculator runs client-side · Node v22.23.3 / npm 10.9.9 (image node:22, linux-arm64)
- Commands (dev / build / test / lint): `npm run dev -- -p 3022` / `npm run build` (~2 min in box) / none: no test runner; `node --test --experimental-strip-types` works / `npm run lint` (eslint 9, not run yet). Types: `node_modules/.bin/tsc --noEmit`. Registry: `python3 -I research/check_sources.py research/data-sources.csv research/page-map.csv`
- Deploy (host, project, trigger; owner pushes): Vercel project "wiresizes" (.vercel/project.json, gitignored); a push deploys (WSZ-001 prompt); owner pushes. Framework build: repo-root files 404 in production (checked 2026-10-20), so DEVLOG.md and research/ are not exposed.
- Analytics / Search Console / Bing: GA4 G-T871GVJZE2 via gtag (src/app/layout.tsx:79-90) + Vercel Web Analytics + Speed Insights, all unconditional (no consent banner); Google Fonts via CSS @import. GSC verified by meta + public/google12f8c2f9c03913a3.html (Domain property ?). Bing verified by msvalidate.01 meta + public/BingSiteAuth.xml.
- Data sources (or registry path): research/data-sources.csv (39 domains: 22 verified, 1 candidate, 16 GAP) · data/verified/*.json (9 tables) · research/golden-cases.json (85 cases) · research/nec-sections-allowlist.csv
- Key paths (pages, components, data/ETL, scripts): pages src/app/**/page.tsx · calculators src/components/calculators/ · shared tables src/lib/data/nec-tables.ts, wire-properties.ts · engine src/lib/calculations/wire-sizing.ts · FAQ JSON-LD data src/data/calculator-faqs.ts · JSON-LD src/components/seo/ · Header/Footer src/components/layout/ · sitemap src/app/sitemap.ts · dates src/lib/article-dates.ts · public/robots.txt, public/llms.txt · audit scripts scripts/*.mjs (puppeteer-core, Mac Chrome)
- Skills in repo: .claude/skills/ → anti-slop-prose, content-page, data-sourcing, devlog, google-ai-content-policy, raptive-ready, seo-visibility, site-audit (impeccable: not installed)
- Design system (DESIGN.md / PRODUCT.md): none
- Other plans / ledgers: research/AUDIT-2026-10.md (findings; §7 plan, §8 GAPs, §9 decisions) · research/page-map.csv (dispositions, waves, interim_wsz002) · research/page-specs.md · research/trust-frame-spec.md · research/wsz002-banned-strings.txt · research/wsz002-withdrawals.csv · research/prompts/WSZ-001…007.txt · research/inventory-2026-10.md (code inventory) · research/wsz002-draft-review.md (WSZ-002 draft checked against the code)
- Prompt code: WSZ

## §2 Decisions in force
- none recorded yet. Owner decisions are pending (§0 Open questions; research/AUDIT-2026-10.md §9).

## §3 Rejected — don't re-propose
- none yet

## §4 Gotchas & hard rules
- No number goes on a page unless it traces to data/verified/*.json, research/golden-cases.json or an engine; no NEC section reference outside research/nec-sections-allowlist.csv.
- NFPA owns the NEC text: values as data with attribution, short quotes only, no PDFs of NEC tables.
- Box egress is an allowlist (/usr/local/bin/init-firewall.sh, ipset allowed-domains, IPs resolved once at init). Allowed: registry.npmjs.org, github.com, api.github.com, objects.githubusercontent.com, raw.githubusercontent.com, codeload.github.com, api.anthropic.com, statsig.anthropic.com, sentry.io, vercel.com, api.vercel.com, simplemaplab.com, www.simplemaplab.com. All other TCP 80/443 is refused. On 2026-10-20 `git fetch` / `git ls-remote origin` and `npm ping` worked. If they start failing, the IPs rotated: `sudo /usr/local/bin/init-firewall.sh` re-resolves them.
- wiresizes.com answers from the box only because it shares Vercel IP 216.150.1.1 with the allowlisted simplemaplab.com: production checks from the box are best-effort. fonts.googleapis.com is blocked, so the build logs "Failed to load dynamic font for →" (OG image glyph). Harmless; Vercel builds fetch it.
- node_modules was installed on the Mac (only @next/swc-darwin-arm64); the first `next dev`/`next build` in the box downloads @next/swc-linux-arm64-* into ~/.cache/next-swc. node_modules is shared with the Mac: no `npm install` in the box without the owner.
- `.claude/` is gitignored (.gitignore:47). The skills are tracked through `git add -f`, and new files under .claude/skills/ need `git add -f` too. Never commit .claude/settings.local.json.
- The build skips type checking (next.config.ts `typescript.ignoreBuildErrors: true`). Run `node_modules/.bin/tsc --noEmit`: 3 errors on 2026-10-20 and 2026-10-24 (WellPumpCalculator.tsx:129, WireSizeCalculator.tsx:34 and :104).
  - Run tsc only after `rm -rf .next && npm run build`. tsconfig includes every .tsx, unused components too, plus `.next/(dev/)types/validator.ts`, which imports every page file. A stale .next therefore breaks tsc once route folders are deleted.
- Node v22.23.3 in the box strips TypeScript types with no flag: `node x.ts` runs, and so does an .mjs that imports a .ts file (checked 2026-10-24). Logic that a node script must test goes in a plain .ts module (no JSX, no `@/` imports, no enums), not inside a component.
- Text gates that scan only the built HTML miss three things:
  - the OG/Twitter image text, which src/app/opengraph-image.tsx draws into a PNG;
  - calculator result panels, which render only after Calculate;
  - the 5 client-only calculators, whose prerendered HTML is just "Loading calculator…".
  Scan src/ as well.
- A stale `.next/dev` cache made `next dev` 404 an existing route (2026-10-20). Run `rm -rf .next` before trusting a dev 404.
- Preview: `npm run dev -- -p 3022` (the `dev` script is plain `next dev` = port 3000; devcontainer.json's 3001:3000 is stale). The box has no Playwright/Chromium, and scripts/*.mjs need Mac Chrome: browser and layout checks run on the Mac, so UI work done in the box stays unverified.
- Sitemap lastmod and Article dates come from `git log` at build (src/app/sitemap.ts, src/lib/article-dates.ts): a commit touching a page file re-dates it, so a mass edit re-dates every page.
- research/wsz002-banned-strings.txt is matched literally. Four live claims use other wording ("(PE) stamp", "NEC 2026 edition publishes", "most recent published edition", "2/0 aluminum for dwe…"), so WSZ-002 must catch those variants (research/inventory-2026-10.md §4.2).
- The box shell is zsh: an unmatched glob (e.g. `ls .env*`) aborts the whole command. List with `ls -a | grep` instead.
- The box has no git identity (`git commit` fails with "Author identity unknown"). All history is `Mapstor <your-email@example.com>`, so commit with `git -c user.name=Mapstor -c user.email=your-email@example.com commit …` (persists nothing) unless the owner sets another identity.

## §5 Backlog (priority order)
Waves from research/AUDIT-2026-10.md §7; drafts in research/prompts/.
- [P1] WSZ-002 stop-the-bleed. Chat revises it using research/wsz002-draft-review.md and research/inventory-2026-10.md. The draft (WSZ-002.txt) says do not run it.
- [P2] WSZ-003 data layer and gates (draft WSZ-003.txt)
- [P3] WSZ-004 trust frame + /methodology (draft WSZ-004.txt)
- [P4] WSZ-005 flagships (draft WSZ-005.txt)
- [P5] WSZ-006 physics tools (draft WSZ-006.txt)
- [P6] WSZ-007 converters (draft WSZ-007.txt)
- [held] WSZ-008 to WSZ-011: held until the GAPs in research/AUDIT-2026-10.md §8 are sourced
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

## §7 History & archive
- 2026-01 · 1 commit · 67f98af Create Next App scaffold (2026-01-21)
- 2026-02 · 16 commits (02-22…02-24) · full site build (6f58c08); build fixes incl. a676ef4 "Skip TypeScript errors during production build"; dynamic imports; Google/Bing verification; favicons; mobile overflow
- 2026-04 · 8 commits (04-06) · JSON-LD + sitemap; schema migration; 851cdda header "trust indicators" (the fabricated trust bar); favicon via the metadata API
- 2026-05 · 25 commits (05-05…05-13) · per-page canonicals + host alignment; OG generator; central nec-tables.ts; git-derived article dates; Vercel Analytics + Speed Insights; Dataset/HowTo schema; content sprints A–E; mobile-overflow and TDZ fixes; last a99da4e (05-13)
- 2026-06…2026-10-19 · no commits; 2026-10-19 chat audit → research pack, installed by WSZ-001
