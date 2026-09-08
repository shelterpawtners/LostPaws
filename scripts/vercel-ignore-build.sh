#!/usr/bin/env bash
set -euo pipefail

# Vercel Ignored Build Step semantics:
#   exit 0 => skip build
#   exit 1 => proceed with build
#
# Build only when the deployed web artifact can actually change. Docs, GitHub
# workflows, E2E-only changes, and Supabase-only changes do not require a new
# frontend deployment.

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
  echo "No frontend/build-impacting changes detected; skip Vercel build."
  exit 0
fi

echo "Frontend/build-impacting changes detected; run Vercel build."
exit 1
