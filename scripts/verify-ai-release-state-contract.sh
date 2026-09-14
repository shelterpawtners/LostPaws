#!/usr/bin/env bash
set -euo pipefail

state_file="docs/engineering/AI-RELEASE-STATE.md"
adapter_file="docs/AI-HANDOFF.md"
required_fields=(
  STATUS
  CURRENT_PHASE
  CURRENT_CHECKPOINT
  NEXT_CHECKPOINT
  OWNER_DECISION_REQUIRED
  SAFE_TO_CONTINUE
  ACCEPTED_CODE_SHA
)
machine_consumers=(
  .github/workflows/merge-gate.yml
  .github/workflows/persona-qa.yml
  .github/workflows/hosted-qa.yml
  scripts/update-ai-ops-status.sh
)

for file in "$state_file" "$adapter_file"; do
  [[ -f "$file" ]] || { echo "Missing release-state file: $file" >&2; exit 1; }
done

field_value() {
  local file="$1"
  local field="$2"
  sed -n "s/^${field}:[[:space:]]*//p" "$file" | head -n 1
}

for field in "${required_fields[@]}"; do
  state_value=$(field_value "$state_file" "$field")
  adapter_value=$(field_value "$adapter_file" "$field")
  [[ -n "$state_value" ]] || { echo "Missing $field in $state_file" >&2; exit 1; }
  [[ "$state_value" == "$adapter_value" ]] || {
    echo "Adapter mismatch for $field" >&2
    exit 1
  }
done

for consumer in "${machine_consumers[@]}"; do
  grep -q 'docs/engineering/AI-RELEASE-STATE.md' "$consumer" || {
    echo "Machine consumer has not migrated: $consumer" >&2
    exit 1
  }
  if grep -q 'docs/AI-HANDOFF.md' "$consumer"; then
    echo "Machine consumer still reads legacy adapter: $consumer" >&2
    exit 1
  fi
done

echo "AI release-state contract and adapter are synchronized."
