#!/usr/bin/env bash
set -euo pipefail

DEPLOYED_SHA=${1:-}
HEAD_SHA=${2:-}

[[ -n "$DEPLOYED_SHA" && -n "$HEAD_SHA" ]] || {
  echo "Usage: $0 <deployed-sha> <head-sha>" >&2
  exit 2
}

git merge-base --is-ancestor "$DEPLOYED_SHA" "$HEAD_SHA" || {
  echo "Acceptance deployment SHA must be an ancestor of the current head." >&2
  exit 1
}

changed=false
while IFS=$'\t' read -r status path extra; do
  [[ -n "$status" ]] || continue
  changed=true

  if [[ "$status" != "M" || -n "${extra:-}" ]]; then
    echo "Cannot reuse deployed frontend: non-modification change detected for ${path:-unknown} (${status})." >&2
    exit 1
  fi

  deployed_tmp=$(mktemp)
  head_tmp=$(mktemp)
  trap 'rm -f "$deployed_tmp" "$head_tmp"' EXIT

  git show "$DEPLOYED_SHA:$path" | npx prettier --stdin-filepath "$path" > "$deployed_tmp"
  git show "$HEAD_SHA:$path" | npx prettier --stdin-filepath "$path" > "$head_tmp"

  if ! cmp -s "$deployed_tmp" "$head_tmp"; then
    echo "Cannot reuse deployed frontend: ${path} differs after canonical Prettier formatting." >&2
    exit 1
  fi

  rm -f "$deployed_tmp" "$head_tmp"
  trap - EXIT
done < <(git diff --name-status "$DEPLOYED_SHA" "$HEAD_SHA" -- src)

if [[ "$changed" == "true" ]]; then
  echo "Frontend changes since ${DEPLOYED_SHA} are Prettier-equivalent to ${HEAD_SHA}."
else
  echo "No frontend changes since deployed SHA ${DEPLOYED_SHA}."
fi
