#!/usr/bin/env bash
# Deterministic, non-semantic checks against a small set of known
# authority-duplication/contradiction failure modes. This intentionally does
# NOT attempt to compare prose meaning across documents -- only a structural
# fact: does an archived document get referenced back in from an
# authority-chain entry point as if it were live authority.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

fail=0

# Files an agent reads at the very start of routine work, before it would
# ever reach a detailed operations doc. If one of these starts naming an
# archived document as something to read, that is exactly the "archive
# leaking back in as authority" failure mode this check exists to catch.
#
# docs/engineering/AGENT-OPERATIONS.md is deliberately NOT in this list: its
# own header legitimately names every doc it supersedes ("Supersedes: ..."),
# which is a correct one-time historical declaration, not a live routing
# instruction.
authority_files=(
  "AGENTS.md"
  "CLAUDE.md"
  "docs/README.md"
  "docs/AI-CONTROLLER.md"
)

# Nothing under docs/archive/ may be referenced from an authority-chain entry
# point as if it were live -- archive is evidence, never live instruction. A
# line that mentions an archived file's name is fine as long as that same
# line also spells out the archive/ path (i.e. it is clearly pointing INTO
# the archive, historical-record style); it only fails when the name shows
# up with no archive/ qualifier, which is what a stale pre-archive routing
# instruction looks like. Every doc formerly checked here by a hardcoded
# "superseded" list is covered by this same check once it is archived, so
# no separate list is needed.
#
# Generically-named files (README.md and similar) are skipped: several
# legitimate, non-archived directories have their own README.md, so a bare
# basename match on "README.md" would false-positive on any authority file
# that mentions any of those, not just the one under docs/archive/.
generic_basenames=("README.md")

if [[ -d "docs/archive" ]]; then
  while IFS= read -r -d '' archived_file; do
    archived_name="$(basename "${archived_file}")"
    is_generic=0
    for generic in "${generic_basenames[@]}"; do
      [[ "${archived_name}" == "${generic}" ]] && is_generic=1
    done
    [[ "${is_generic}" -eq 1 ]] && continue
    for authority_file in "${authority_files[@]}"; do
      [[ -f "${authority_file}" ]] || continue
      unqualified_hits="$(grep -F "${archived_name}" "${authority_file}" | grep -vF "archive/" || true)"
      if [[ -n "${unqualified_hits}" ]]; then
        echo "FAIL: ${authority_file} references archived doc ${archived_name} without an archive/ path, as if it were current authority" >&2
        fail=1
      fi
    done
  done < <(find docs/archive -type f -name "*.md" -print0)
fi

# The machine-readable release-state contract (AI-RELEASE-STATE.md as the
# source of truth, AI-HANDOFF.md as its field-compatible legacy adapter)
# must not be allowed to drift into two independently-writable copies.
if [[ -x "scripts/verify-ai-release-state-contract.sh" ]]; then
  if ! bash scripts/verify-ai-release-state-contract.sh; then
    fail=1
  fi
fi

# docs/engineering/state/release-state.yaml is the actual writable source of
# truth; AI-RELEASE-STATE.md and AI-HANDOFF.md's status block are generated
# from it. Fail if either generated file has drifted -- a hand-edit of the
# generated Markdown, or a YAML change nobody regenerated from.
if [[ -f "docs/engineering/state/release-state.yaml" ]]; then
  if ! node scripts/release-state.mjs check; then
    fail=1
  fi
fi

if [[ "${fail}" -ne 0 ]]; then
  echo "Documentation authority drift check FAILED." >&2
  exit 1
fi

echo "Documentation authority drift check passed."
