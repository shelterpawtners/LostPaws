#!/usr/bin/env bash
set -euo pipefail

BASE_SHA="${1:-}"
HEAD_SHA="${2:-HEAD}"

if [[ -z "${BASE_SHA}" ]]; then
  echo "usage: $0 <base-sha> [head-sha]" >&2
  exit 2
fi

while read -r sha; do
  [[ -n "${sha}" ]] || continue
  parent=$(git rev-parse "${sha}^" 2>/dev/null || true)
  [[ -n "${parent}" ]] || continue
  impact=$(bash scripts/classify-change-impact.sh "${parent}" "${sha}")
  artifact=$(sed -n 's/^frontend_artifact=//p' <<<"${impact}" | tail -n 1)
  if [[ "${artifact}" == "true" ]]; then
    echo "${sha}"
    exit 0
  fi
done < <(git rev-list "${HEAD_SHA}" "^${BASE_SHA}")

exit 0
