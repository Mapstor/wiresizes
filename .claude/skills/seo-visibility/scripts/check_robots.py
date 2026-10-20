#!/usr/bin/env python3
"""check_robots.py — verify a site's robots.txt against the crawlers-open policy.

Usage:
    python3 check_robots.py path/to/robots.txt [--require-training-open]

Policy (seo-visibility skill, Jul 2026):
- Retrieval/search agents must NOT be blocked from the site:
  Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot,
  Claude-User, Claude-SearchBot.
- Training bots (GPTBot, ClaudeBot, CCBot, Google-Extended) follow the
  standing portfolio policy (default: allowed). With --require-training-open,
  blocking a training bot is reported as FAIL instead of INFO.
- A Sitemap: directive should be present (WARN if absent).

Exit 0 = clean (warnings allowed). Exit 1 = FAIL. Stdlib only.
Note: this checks robots.txt only — host-level blockers (Cloudflare AI
toggles, WAF rules) must be checked separately.
"""

import sys

RETRIEVAL = ["googlebot", "bingbot", "oai-searchbot", "chatgpt-user",
             "perplexitybot", "claude-user", "claude-searchbot"]
TRAINING = ["gptbot", "claudebot", "ccbot", "google-extended"]

fails, warns, infos = [], [], []


def parse(path):
    """Return list of (agents:[str], disallows:[str], allows:[str]) groups and sitemap flag."""
    groups, sitemap = [], False
    cur_agents, cur_dis, cur_allow, agents_open = [], [], [], False
    try:
        with open(path, encoding="utf-8-sig") as f:
            lines = f.readlines()
    except FileNotFoundError:
        fails.append(f"file not found: {path}")
        return [], False
    except Exception as e:
        fails.append(f"could not read {path}: {e}")
        return [], False
    for raw in lines:
        line = raw.split("#", 1)[0].strip()
        if not line or ":" not in line:
            continue
        key, val = [p.strip() for p in line.split(":", 1)]
        k = key.lower()
        if k == "user-agent":
            if cur_agents and not agents_open:
                groups.append((cur_agents, cur_dis, cur_allow))
                cur_agents, cur_dis, cur_allow = [], [], []
            cur_agents.append(val.lower())
            agents_open = True
        elif k in ("disallow", "allow"):
            agents_open = False
            if not cur_agents:
                warns.append(f"{key} rule before any User-agent — ignored by crawlers")
                continue
            (cur_dis if k == "disallow" else cur_allow).append(val)
        elif k == "sitemap":
            sitemap = True
    if cur_agents:
        groups.append((cur_agents, cur_dis, cur_allow))
    return groups, sitemap


def effective_group(groups, bot):
    """robots protocol: a bot obeys the most specific matching group, else *."""
    best, best_len = None, -1
    for agents, dis, allow in groups:
        for a in agents:
            if a != "*" and a in bot and len(a) > best_len:
                best, best_len = (dis, allow), len(a)
    if best:
        return best
    for agents, dis, allow in groups:
        if "*" in agents:
            return (dis, allow)
    return ([], [])


def fully_blocked(dis, allow):
    """Disallow: / with no Allow: / override."""
    return any(d.strip() == "/" for d in dis) and "/" not in [a.strip() for a in allow]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    strict_training = "--require-training-open" in sys.argv
    path = args[0] if args else "robots.txt"

    groups, sitemap = parse(path)
    if fails:
        report()
        return 1
    if not groups:
        warns.append("no User-agent groups found — all bots implicitly allowed")

    for bot in RETRIEVAL:
        dis, allow = effective_group(groups, bot)
        if fully_blocked(dis, allow):
            fails.append(f"retrieval agent '{bot}' is fully blocked (Disallow: /)")
        elif any(d.strip() == "/" for d in dis):
            warns.append(f"retrieval agent '{bot}': Disallow: / present but offset by Allow — verify intent")
        elif dis and any(d.strip() for d in dis):
            infos.append(f"retrieval agent '{bot}': partial disallows {sorted(set(d for d in dis if d.strip()))} — verify none cover content paths")

    for bot in TRAINING:
        dis, allow = effective_group(groups, bot)
        if fully_blocked(dis, allow):
            msg = f"training bot '{bot}' fully blocked"
            (fails if strict_training else infos).append(
                msg + ("" if strict_training else " — allowed by policy only if Marko chose this for the site"))

    if not sitemap:
        warns.append("no Sitemap: directive")

    return report()


def report():
    for i in infos:
        print(f"INFO: {i}")
    for w in warns:
        print(f"WARN: {w}")
    for f_ in fails:
        print(f"FAIL: {f_}")
    if fails:
        print(f"\nRESULT: FAIL ({len(fails)} violations, {len(warns)} warnings)")
        return 1
    print(f"\nRESULT: OK ({len(warns)} warnings, {len(infos)} info)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
