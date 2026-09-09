#!/usr/bin/env bash
set -euo pipefail

AXE_PLAYWRIGHT_VERSION="4.13.0"

npm install \
  --no-save \
  --package-lock=false \
  --ignore-scripts \
  --fund=false \
  --audit=false \
  "@axe-core/playwright@${AXE_PLAYWRIGHT_VERSION}"
