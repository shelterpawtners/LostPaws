#!/usr/bin/env bash
set -euo pipefail

# Vercel Ignored Build Step semantics:
#   exit 0 => skip build
#   exit 1 => proceed with build

if ! git rev-parse HEAD^ >/dev/null 2>&1; then
  echo "No parent commit available; build conservatively."
  exit 1
fi

impact=$(mktemp)
trap 'rm -f "$impact"' EXIT

bash scripts/classify-change-impact.sh HEAD^ HEAD > "$impact"

web=$(sed -n 's/^web=//p' "$impact" | tail -n 1)
deployment=$(sed -n 's/^deployment=//p' "$impact" | tail -n 1)
unknown=$(sed -n 's/^unknown=//p' "$impact" | tail -n 1)

if [[ "$web" == "true" || "$deployment" == "true" || "$unknown" == "true" ]]; then
  echo "Frontend/deployment-impacting change detected; run Vercel build."
  exit 1
fi

echo "No deployed-web impact detected; skip Vercel build."
exit 0
