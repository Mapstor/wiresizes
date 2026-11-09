#!/bin/bash
# SessionStart hook: installs dependencies in Claude cloud sessions only (CLAUDE_CODE_REMOTE=true).
# Skips the install while the package files and this script are unchanged.
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi
cd "$CLAUDE_PROJECT_DIR" || exit 0
corepack enable >/dev/null 2>&1 || true
hashes=node_modules/.cloud-setup.sha256
if [ -f pnpm-lock.yaml ]; then lock=pnpm-lock.yaml; cmd="pnpm install --frozen-lockfile"
elif [ -f package-lock.json ]; then lock=package-lock.json; cmd="npm ci"
elif [ -f yarn.lock ]; then lock=yarn.lock; cmd="yarn install --frozen-lockfile"
else exit 0; fi
if ! sha256sum --check --status "$hashes" 2>/dev/null; then
  rm -f "$hashes"
  if $cmd >/dev/null 2>&1; then
    mkdir -p node_modules && sha256sum scripts/qa/cloud-setup.sh package.json "$lock" > "$hashes" || rm -f "$hashes"
  fi
fi
exit 0
