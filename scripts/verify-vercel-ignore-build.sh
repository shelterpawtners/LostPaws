#!/usr/bin/env bash
set -euo pipefail

# Regression coverage for scripts/vercel-ignore-build.sh, built around the
# real PR #135 failure mode: a product-changing merge followed by one or more
# docs-only commits must still trigger a build until production actually has
# the product delta, even though each individual later commit's own diff
# looks docs-only in isolation. Runs entirely inside a throwaway temp repo so
# it never touches this repository's own history.

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "${work}"' EXIT

failures=0

check() {
  local description="$1"
  local expected_exit="$2"
  shift 2
  local actual_exit=0
  "$@" >/tmp/verify-vercel-ignore-build.out 2>&1 || actual_exit=$?
  if [[ "${actual_exit}" -eq "${expected_exit}" ]]; then
    echo "PASS: ${description}"
  else
    echo "FAIL: ${description} (expected exit ${expected_exit}, got ${actual_exit})"
    sed 's/^/  | /' /tmp/verify-vercel-ignore-build.out
    failures=$((failures + 1))
  fi
}

git init -q "${work}"
cd "${work}"
git config user.email "test@example.invalid"
git config user.name "Regression Test"
git config core.autocrlf false

mkdir -p scripts src docs
cp "${repo_root}/scripts/vercel-ignore-build.sh" scripts/
cp "${repo_root}/scripts/classify-change-impact.sh" scripts/

echo "root" > README.md
git add -A
git commit -q -m "initial commit"
before_product="$(git rev-parse HEAD)"

echo "export const x = 1;" > src/App.tsx
git add -A
git commit -q -m "feat: add a real product change"
after_product="$(git rev-parse HEAD)"

echo "notes" >> docs/NOTES.md
git add -A
git commit -q -m "docs: unrelated follow-up commit"
after_docs="$(git rev-parse HEAD)"

# 1. No baseline available at all: fail toward building, not skipping.
check "no VERCEL_GIT_PREVIOUS_SHA => build" 1 \
  env -u VERCEL_GIT_PREVIOUS_SHA bash scripts/vercel-ignore-build.sh

# 2. Baseline set but unresolvable in this clone: fail toward building.
check "unresolvable VERCEL_GIT_PREVIOUS_SHA => build" 1 \
  env VERCEL_GIT_PREVIOUS_SHA="0000000000000000000000000000000000dead" \
  bash scripts/vercel-ignore-build.sh

# 3. The PR #135 failure mode itself: production's last deployment predates
#    the product commit, and a docs-only commit landed after it. The old
#    HEAD^-only comparison would see only the docs commit and skip; the
#    fix must still see the real undeployed product delta and build.
check "product commit + docs-only follow-up, prod behind => build" 1 \
  env VERCEL_GIT_PREVIOUS_SHA="${before_product}" \
  bash scripts/vercel-ignore-build.sh

# 4. Production already has the product commit; only docs changed since.
#    Must be allowed to skip.
check "docs-only since last deploy, prod current => skip" 0 \
  env VERCEL_GIT_PREVIOUS_SHA="${after_product}" \
  bash scripts/vercel-ignore-build.sh

# 5. Explicit [deploy] always forces a build, regardless of baseline.
git commit -q --allow-empty -m "chore: forced rebuild $(printf '[%s]' deploy)"
check "[deploy] marker => build regardless of baseline" 1 \
  env VERCEL_GIT_PREVIOUS_SHA="${after_docs}" \
  bash scripts/vercel-ignore-build.sh
git reset -q --hard HEAD^

# 6. Explicit [skip deploy] always forces a skip, regardless of baseline.
git commit -q --allow-empty -m "chore: forced skip $(printf '[skip %s]' deploy)"
check "[skip deploy] marker => skip regardless of baseline" 0 \
  env VERCEL_GIT_PREVIOUS_SHA="${before_product}" \
  bash scripts/vercel-ignore-build.sh
git reset -q --hard HEAD^

if [[ "${failures}" -gt 0 ]]; then
  echo ""
  echo "${failures} vercel-ignore-build.sh regression check(s) failed."
  exit 1
fi

echo ""
echo "All vercel-ignore-build.sh regression checks passed."
