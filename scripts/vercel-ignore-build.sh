#!/usr/bin/env bash
set -euo pipefail

# Vercel Ignored Build Step semantics:
#   exit 0 => skip build
#   exit 1 => proceed with build
#
# Normal intermediate commits build only when the deployed web artifact can
# change. Acceptance-boundary commits always build so Hosted QA can prove the
# exact READY_FOR_ACCEPTANCE / COMPLETE SHA is what the stable QA URL serves.

if [[ -f docs/AI-HANDOFF.md ]]; then
  status=$(sed -n 's/^STATUS:[[:space:]]*//p' docs/AI-HANDOFF.md | head -n 1)
  if [[ "${status}" == "READY_FOR_ACCEPTANCE" || "${status}" == "COMPLETE" ]]; then
    echo "Acceptance-boundary handoff detected; deploy this exact SHA for Hosted QA."
    exit 1
  fi
fi

if ! git rev-parse HEAD^ >/dev/null 2>&1; then
  echo "No parent commit available; build conservatively."
  exit 1
fi

if git diff --quiet HEAD^ HEAD -- \
  src \
  public \
  index.html \
  package.json \
  package-lock.json \
  vite.config.ts \
  vite.config.js \
  tsconfig.json \
  tsconfig.app.json \
  tsconfig.node.json; then
  echo "No frontend/build-impacting changes detected; skip intermediate Vercel build."
  exit 0
fi

echo "Frontend/build-impacting changes detected; run Vercel build."
exit 1
