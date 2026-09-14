#!/usr/bin/env bash
# Deterministic, non-semantic checks against a small set of known
# authority-duplication/contradiction failure modes. This intentionally does
# NOT attempt to compare prose meaning across documents -- only structural
# facts: does an authority-chain entry point still name a document that has
# already been marked superseded, and does an archived document (once
# docs/archive/ exists) get referenced back in as if it were live authority.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

fail=0

# Files an agent reads at the very start of routine work, before it would
# ever reach a detailed operations doc. If one of these starts naming a
# superseded protocol doc as something to read, that is exactly the
# "two authorities" failure mode this check exists to catch.
#
# docs/engineering/AGENT-OPERATIONS.md is deliberately NOT in this list: its
# own header legitimately names every doc it supersedes ("Supersedes: ..."),
# which is a correct one-time declaration, not a live routing instruction.
authority_files=(
  "AGENTS.md"
  "CLAUDE.md"
  "docs/README.md"
  "docs/AI-CONTROLLER.md"
)

# Docs explicitly marked superseded by docs/engineering/AGENT-OPERATIONS.md's
# own header ("Supersedes: ..."). Update this list only when a doc's
# supersession status itself changes -- not when it moves/archives, since an
# archived file is covered by the separate archive check below.
superseded_docs=(
  "docs/AI-OPERATING-PROTOCOL.md"
  "docs/AUTONOMOUS-EXECUTION-POLICY.md"
  "docs/CHATGPT-OPERATING-PROTOCOL.md"
  "docs/DEV-LOOP-V2.md"
  "docs/AI-COST-AND-TESTING-GOVERNANCE.md"
)

for authority_file in "${authority_files[@]}"; do
  [[ -f "${authority_file}" ]] || continue
  for superseded in "${superseded_docs[@]}"; do
    superseded_name="$(basename "${superseded}")"
    if grep -q "${superseded_name}" "${authority_file}"; then
      echo "FAIL: ${authority_file} references superseded doc ${superseded_name} as if it were current authority" >&2
      fail=1
    fi
  done
done

# Once docs/archive/ exists (Phase 6+ of the AI-first migration), nothing
# under it may be referenced from an authority-chain entry point -- archive
# is evidence, never live instruction.
if [[ -d "docs/archive" ]]; then
  while IFS= read -r -d '' archived_file; do
    archived_name="$(basename "${archived_file}")"
    for authority_file in "${authority_files[@]}"; do
      [[ -f "${authority_file}" ]] || continue
      if grep -q "${archived_name}" "${authority_file}"; then
        echo "FAIL: ${authority_file} references archived doc ${archived_name} as if it were current authority" >&2
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

if [[ "${fail}" -ne 0 ]]; then
  echo "Documentation authority drift check FAILED." >&2
  exit 1
fi

echo "Documentation authority drift check passed."
