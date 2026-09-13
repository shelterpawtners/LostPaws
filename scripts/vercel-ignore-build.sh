#!/usr/bin/env bash
set -euo pipefail

# Vercel Ignored Build Step semantics:
#   exit 0 => skip build
#   exit 1 => proceed with build
#
# Explicit commit-message controls:
#   [deploy]      => force a Vercel build even when the file diff would normally skip it
#   [skip deploy] => force a skip when it is intentionally safe to do so
#
# This lets automation trigger rebuilds for environment-variable-only changes
# without requiring an owner to manually toggle Vercel project settings.
#
# Root cause of the PR #135 miss (2026-09-12/13): this script used to diff
# only HEAD^ against HEAD — the single immediately-preceding commit — rather
# than the commit production was actually last built from. A large product
# merge (PR #135) followed by one or more docs-only commits meant every later
# commit's own one-step diff looked docs-only in isolation, so the script
# kept reporting "skip" even though the deployed site was still several
# commits behind main's real, undeployed frontend delta. Reproduced directly
# against git history: `classify-change-impact.sh <commit-before-135> HEAD`
# correctly reports frontend_artifact=true, while `classify-change-impact.sh
# HEAD^ HEAD` at any later docs-only commit reports false.
#
# Fix: compare against $VERCEL_GIT_PREVIOUS_SHA, which Vercel sets to the
# commit the previous deployment on this branch actually built from — i.e.
# what production currently has, not just the prior commit. If that variable
# is unset or unresolvable in this clone (a shallow checkout, a first-ever
# deployment, or a local/non-Vercel invocation), fail toward building rather
# than guessing, since an unverifiable baseline could otherwise hide a real
# undeployed delta the same way HEAD^ did.

commit_message="$(git log -1 --pretty=%B 2>/dev/null || true)"

if grep -Eqi '\[deploy\]' <<< "${commit_message}"; then
  echo "Explicit [deploy] marker found; run Vercel build."
  exit 1
fi

if grep -Eqi '\[skip[[:space:]]+deploy\]' <<< "${commit_message}"; then
  echo "Explicit [skip deploy] marker found; skip Vercel build."
  exit 0
fi

baseline="${VERCEL_GIT_PREVIOUS_SHA:-}"

if [[ -z "${baseline}" ]]; then
  echo "VERCEL_GIT_PREVIOUS_SHA is not set; build conservatively."
  exit 1
fi

if ! git cat-file -e "${baseline}^{commit}" 2>/dev/null; then
  echo "VERCEL_GIT_PREVIOUS_SHA (${baseline}) is not resolvable in this clone; build conservatively."
  exit 1
fi

echo "Comparing current HEAD against the last-deployed commit ${baseline}."

impact=$(mktemp)
trap 'rm -f "$impact"' EXIT

bash scripts/classify-change-impact.sh "${baseline}" HEAD > "$impact"

artifact=$(sed -n 's/^frontend_artifact=//p' "$impact" | tail -n 1)
deployment=$(sed -n 's/^deployment=//p' "$impact" | tail -n 1)
unknown=$(sed -n 's/^unknown=//p' "$impact" | tail -n 1)

if [[ "$artifact" == "true" || "$deployment" == "true" || "$unknown" == "true" ]]; then
  echo "Deployed frontend artifact changed since the last deployment; run Vercel build."
  exit 1
fi

echo "No deployed frontend artifact change since the last deployment; skip Vercel build."
exit 0
