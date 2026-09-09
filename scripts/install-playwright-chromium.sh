#!/usr/bin/env bash
set -euo pipefail

# GitHub-hosted Ubuntu images can include a Google Chrome APT source. Playwright's
# Chromium dependency install does not require that source, and a transient
# metadata mismatch there can fail `apt update` before Playwright installs.
# Disable only that unrelated source for the duration of the install, then
# restore it so the runner remains otherwise unchanged.
disabled_sources=()

restore_sources() {
  local disabled original
  for disabled in "${disabled_sources[@]:-}"; do
    [[ -n "${disabled}" && -f "${disabled}" ]] || continue
    original="${disabled%.playwright-disabled}"
    sudo mv "${disabled}" "${original}"
  done
}

trap restore_sources EXIT

if [[ "${CI:-}" == "true" ]]; then
  for source in \
    /etc/apt/sources.list.d/google-chrome.list \
    /etc/apt/sources.list.d/google-chrome.sources; do
    if [[ -f "${source}" ]]; then
      disabled="${source}.playwright-disabled"
      sudo mv "${source}" "${disabled}"
      disabled_sources+=("${disabled}")
    fi
  done
fi

npx playwright install --with-deps chromium
