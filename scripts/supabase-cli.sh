#!/usr/bin/env bash
set -euo pipefail

# Central exact pin for the Supabase CLI used by local/CI automation.
# Keeping this in one wrapper avoids repeated version strings and avoids adding
# a large CLI dependency tree to the application lockfile.
SUPABASE_CLI_VERSION="${SUPABASE_CLI_VERSION:-2.117.0}"

exec npx --yes "supabase@${SUPABASE_CLI_VERSION}" "$@"
