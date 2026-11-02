# Rules shared by WSZ-008 to WSZ-011 (held waves)

These waves rebuild pages whose data was not verified when WSZ-002 ran. A page is built only when its sources are verified. Chat decides that, and the repo shows it in two files.

## 1. Data gate (run first)
- Write scripts/data-gate.mjs (Node built-ins only), or reuse it if an earlier wave wrote it. For the current wave it reads:
  - research/held-pages-domains.csv
  - research/data-sources.csv
- For each page in the wave it prints BUILD or HOLD:
  - BUILD: every domain in required_domains has status "verified".
  - HOLD: anything else. The line names the blocking domains and their status.
- Optional domains switch extra features on. Example: the 75 °C column is offered only when nec-110-14c is verified.
- Every engine group the page uses (engine_groups) must exist in research/golden-cases.json. A missing group means HOLD, with "golden cases missing — ask chat".
- Build only the BUILD pages. If none are BUILD, stop and report the gate output. Never build a HOLD page partially, and never work around the gate by writing content without the data.

## 2. Data and engines
- New data files load through src/lib/verified (WSZ-003). Typed accessors go there and nowhere else.
- New engines go in src/lib/calculations/ with ENGINE_ID and DOMAINS (D-13), and their golden groups go in tests/golden.test.ts.
- Values marked UNVERIFIED, do_not_publish, CONFLICTING or draft-only in a data file are never rendered. "Draft-only" means 2026-cycle draft text.
- Values marked verified-sd2023 render as 2023 NEC (decision D-09), including those whose data file says the 2022 Technical Meeting and Standards Council record was not seen. 625.54 stays held.
- A VERIFIED-other-edition value is rendered only with its edition named next to it.

## 3. Pages
- Build each BUILD page to its section in research/page-specs-held.md:
  - queries, intent, wedge, tool inputs and outputs, and FAQ from the listed real queries;
  - content-page anatomy (tool-first on tools, article anatomy on guides);
  - two SVGs per page per the svg-spec;
  - sources from <Sources>, the byline and real dates (WSZ-004).
- Every unit-bearing number goes through <Val>/<Size>. Every NEC reference must be in research/nec-sections-allowlist.csv.
- Section numbers come from the data files. Never write one from memory: the 2023 numbering differs from older editions in many places (430.52(C)(1)(a), 210.19, 680.10/680.12).
- A rebuilt page that WSZ-002 withdrew comes back:
  - remove noindex;
  - add it back to sitemap.ts, the hubs and the footer;
  - restore related links on the pages that link to it.
- Sibling pages must not share one H2 skeleton or one FAQ set.

## 4. Quality passes
- Run anti-slop-prose on all new copy and report the fix count.
- Run Impeccable's audit (/impeccable audit) on each new template at 390 px and fix what it finds. If .claude/skills/impeccable is missing, write "impeccable not installed" in DEVLOG and continue.
- Run the content-page prepublish checklist per page and fix every fail.
- Append one line per rebuilt page to src/data/corrections.json, saying what changed and which source it now uses.

## 5. Verify (every held wave)
- `npm run dates`
- `rm -rf .next && npm run build`. Gates enforce the rebuilt routes: add them to scripts/gates.config.json.
- `npm test`: all golden cases pass, 0 skipped.
- `npx tsc --noEmit`: 0 errors.
- `python3 -I research/check_sources.py research/data-sources.csv research/page-map.csv`
- A node script that reproduces every golden case in the wave's engine groups through each page's calculation path.
- The data-gate output, pasted.

## 6. Commit and DEVLOG
- One commit per wave. Don't push.
- Update DEVLOG per .claude/skills/devlog/SKILL.md, including the HOLD list. The HOLD pages go to DEVLOG §0 as "waiting on chat sourcing: <domains>".
