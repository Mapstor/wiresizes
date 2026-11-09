## DEVLOG — mandatory
- Before any work: read DEVLOG.md §0–§5 + the last 10 §6 entries.
- After any task that changes files, data, config, deps or a decision: update DEVLOG.md per .claude/skills/devlog/SKILL.md and commit it with the work. Push only work branches; the owner merges.
- `done` only with verification that actually ran; skipped tests and UI behaviour = unverified. No secrets in DEVLOG.md.

## Workflow, DEVLOG and QA tracker

- Work runs in Claude cloud sessions only: no claude box, no local files. Claude pushes branches; the owner alone merges.
- Before any work: read DEVLOG.md §0–§5 and the last 10 §6 entries, then run `npm run progress` (or `pnpm run progress`).
- Branches: `claude/<ID>-<name>` (Vercel skips them, see vercel.json) or `preview/<ID>-<name>` when a Claude in Chrome check needs a preview build. Never push the default branch.
- After any task that changes files, data, config, deps or a decision: update DEVLOG.md per the devlog skill and the touched rows of `qa/pages.csv` (track status, 0–10 badness, date), and commit them with the work.
- Before every push: `rm -rf .next` and a clean build with the repo's gates, then `next start` on a free port and `npm run qa:tracker http://127.0.0.1:<port>`.
- `done` needs verification that actually ran. UI behaviour stays unverified until a Claude in Chrome check ran on a preview or production URL.
- Never kill processes or free ports; take the next free port. Start `next start` only after the build finishes.
