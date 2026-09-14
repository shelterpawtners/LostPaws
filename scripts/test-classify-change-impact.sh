#!/usr/bin/env bash
# Regression test for scripts/classify-change-impact.sh.
#
# Exercises the real classifier against a disposable, throwaway git repo so
# assertions run against actual `git diff` + bash `case` behavior rather than
# a manual trace. Covers the authority-chain precedence bug where an edit to
# AGENTS.md, CLAUDE.md, .github/copilot-instructions.md,
# .github/instructions/*, or .agents/* was classified docs_only (skipping web
# CI) because the generic `docs/*|*.md|README*` pattern matched first.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLASSIFY="${REPO_ROOT}/scripts/classify-change-impact.sh"

TMP_REPO="$(mktemp -d)"
trap 'rm -rf "${TMP_REPO}"' EXIT

cd "${TMP_REPO}"
git init --quiet
git config user.email "test@example.invalid"
git config user.name "classify-change-impact test"

commit_file() {
  local path="$1"
  local content="$2"
  mkdir -p "$(dirname "${path}")"
  printf '%s\n' "${content}" > "${path}"
  git add "${path}"
  git commit --quiet -m "commit ${path}"
}

run_classifier() {
  local base="$1"
  local head="$2"
  bash "${CLASSIFY}" "${base}" "${head}"
}

get_flag() {
  local output="$1"
  local key="$2"
  printf '%s\n' "${output}" | sed -n "s/^${key}=//p"
}

fail=0

assert_flag() {
  local label="$1"
  local output="$2"
  local key="$3"
  local expected="$4"
  local actual
  actual="$(get_flag "${output}" "${key}")"
  if [[ "${actual}" != "${expected}" ]]; then
    echo "FAIL: ${label}: expected ${key}=${expected}, got ${key}=${actual}" >&2
    fail=1
  else
    echo "PASS: ${label}: ${key}=${actual}"
  fi
}

# Base commit: a normal, uncontested docs file.
commit_file "docs/SOMETHING.md" "placeholder"
BASE_SHA="$(git rev-parse HEAD)"

# --- Case 1: a genuine docs-only change must remain docs_only (no regression). ---
commit_file "docs/SOMETHING.md" "placeholder v2"
HEAD_SHA="$(git rev-parse HEAD)"
out="$(run_classifier "${BASE_SHA}" "${HEAD_SHA}")"
assert_flag "plain docs edit stays docs_only" "${out}" docs_only true
assert_flag "plain docs edit does not force web CI" "${out}" requires_web_ci false
git reset --quiet --hard "${BASE_SHA}"

# --- Case 2-6: authority-chain files must receive workflow classification. ---
for path in AGENTS.md CLAUDE.md .github/copilot-instructions.md .github/instructions/example.instructions.md .agents/skills/example/SKILL.md; do
  commit_file "${path}" "authority content"
  HEAD_SHA="$(git rev-parse HEAD)"
  out="$(run_classifier "${BASE_SHA}" "${HEAD_SHA}")"
  assert_flag "${path} classified as workflow" "${out}" workflow true
  assert_flag "${path} triggers web CI" "${out}" requires_web_ci true
  assert_flag "${path} is not silently docs_only" "${out}" docs_only false
  git reset --quiet --hard "${BASE_SHA}"
done

if [[ "${fail}" -ne 0 ]]; then
  echo "classify-change-impact.sh authority-precedence regression test FAILED" >&2
  exit 1
fi

echo "classify-change-impact.sh authority-precedence regression test passed."
