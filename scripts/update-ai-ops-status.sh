#!/usr/bin/env bash
set -euo pipefail

: "${GH_TOKEN:?GH_TOKEN is required}"
: "${REPO:?REPO is required}"

STATUS_ISSUE="${STATUS_ISSUE:-12}"
ACTIVE_MARKER="${ACTIVE_MARKER:-<!-- ai-active-build-pr -->}"
QA_URL="${QA_URL:-}"
STALE_MINUTES="${STALE_MINUTES:-60}"
STATUS_MARKER="<!-- ai-ops-live-status -->"

prs=$(gh api "repos/${REPO}/pulls?state=open&base=build/festival-mvp&per_page=100")
active_prs=$(jq -c --arg marker "${ACTIVE_MARKER}" '[.[] | select((.body // "") | contains($marker))]' <<<"${prs}")
active_count=$(jq 'length' <<<"${active_prs}")

if [[ "${active_count}" == "0" ]]; then
  body=$(cat <<EOF
${STATUS_MARKER}
## LostPaws AI Ops — IDLE

No open PR targeting \`build/festival-mvp\` is currently marked as the active build lane.

- No AI agent was invoked by this status update.
- Native watchdog cadence: hourly.
- Next action: open/mark the next bounded checkpoint PR when authorized.
EOF
)
else
  if [[ "${active_count}" != "1" ]]; then
    body=$(cat <<EOF
${STATUS_MARKER}
## LostPaws AI Ops — BLOCKED

Found **${active_count}** open PRs carrying the active-build marker. Exactly one is allowed.

No AI agent was invoked. Remove the duplicate marker before automated supervision continues.
EOF
)
  else
    pr=$(jq -c '.[0]' <<<"${active_prs}")
    pr_number=$(jq -r '.number' <<<"${pr}")
    pr_url=$(jq -r '.html_url' <<<"${pr}")
    branch=$(jq -r '.head.ref' <<<"${pr}")
    head_sha=$(jq -r '.head.sha' <<<"${pr}")
    draft=$(jq -r '.draft' <<<"${pr}")

    handoff=$(gh api "repos/${REPO}/contents/docs/AI-HANDOFF.md?ref=${branch}" --jq '.content' | base64 --decode)
    status=$(sed -n 's/^STATUS:[[:space:]]*//p' <<<"${handoff}" | head -n 1)
    phase=$(sed -n 's/^CURRENT_PHASE:[[:space:]]*//p' <<<"${handoff}" | head -n 1)
    checkpoint=$(sed -n 's/^CURRENT_CHECKPOINT:[[:space:]]*//p' <<<"${handoff}" | head -n 1)
    next_checkpoint=$(sed -n 's/^NEXT_CHECKPOINT:[[:space:]]*//p' <<<"${handoff}" | head -n 1)
    owner=$(sed -n 's/^OWNER_DECISION_REQUIRED:[[:space:]]*//p' <<<"${handoff}" | head -n 1)
    safe=$(sed -n 's/^SAFE_TO_CONTINUE:[[:space:]]*//p' <<<"${handoff}" | head -n 1)
    accepted_sha=$(sed -n 's/^ACCEPTED_CODE_SHA:[[:space:]]*//p' <<<"${handoff}" | head -n 1)

    commit=$(gh api "repos/${REPO}/commits/${head_sha}")
    commit_time=$(jq -r '.commit.committer.date' <<<"${commit}")
    now_epoch=$(date -u +%s)
    commit_epoch=$(date -u -d "${commit_time}" +%s)
    age_minutes=$(( (now_epoch - commit_epoch) / 60 ))

    runs=$(gh api "repos/${REPO}/actions/runs?branch=${branch}&per_page=100")
    in_flight=$(jq '[.workflow_runs[] | select(.status == "queued" or .status == "in_progress")] | length' <<<"${runs}")

    latest_line() {
      local workflow="$1"
      local run
      run=$(jq -c --arg workflow "${workflow}" '[.workflow_runs[] | select(.name == $workflow)] | sort_by(.created_at) | last // empty' <<<"${runs}")
      if [[ -z "${run}" ]]; then
        printf '%s' "not run"
        return
      fi
      local st conclusion url sha
      st=$(jq -r '.status' <<<"${run}")
      conclusion=$(jq -r '.conclusion // ""' <<<"${run}")
      url=$(jq -r '.html_url' <<<"${run}")
      sha=$(jq -r '.head_sha' <<<"${run}")
      if [[ "${st}" == "completed" ]]; then
        printf '[%s](%s) — `%s`' "${conclusion}" "${url}" "${sha:0:8}"
      else
        printf '[%s](%s) — `%s`' "${st}" "${url}" "${sha:0:8}"
      fi
    }

    failure_count=$(jq --arg head "${head_sha}" '
      [.workflow_runs[]
        | select(.name == "CI" or .name == "Database QA" or .name == "Persona QA" or .name == "Hosted QA" or .name == "Merge Gate" or .name == "Dependency Review")]
      | sort_by(.name, .created_at)
      | group_by(.name)
      | map(last)
      | map(select(.head_sha == $head and (.conclusion == "failure" or .conclusion == "timed_out" or .conclusion == "action_required")))
      | length
    ' <<<"${runs}")

    if [[ "${owner}" == "YES" ]]; then
      overall="BLOCKED_OWNER"
    elif [[ "${failure_count}" -gt 0 || "${status}" == "FAILED" || "${status}" == "BLOCKED" ]]; then
      overall="FAILED"
    elif [[ "${in_flight}" -gt 0 ]]; then
      overall="ACTIVE"
    elif [[ "${status}" == "READY_FOR_ACCEPTANCE" ]]; then
      overall="WAITING_FOR_QA"
    elif [[ "${status}" == "COMPLETE" ]]; then
      overall="READY_TO_MERGE"
    elif (( age_minutes >= STALE_MINUTES )); then
      overall="STALLED"
    else
      overall="ACTIVE"
    fi

    qa_line=""
    if [[ -n "${QA_URL}" ]]; then
      qa_line="- QA URL: ${QA_URL}"
    fi

    body=$(cat <<EOF
${STATUS_MARKER}
## LostPaws AI Ops — ${overall}

| Signal | Current state |
| --- | --- |
| Phase | ${phase:-unknown} |
| Checkpoint | ${checkpoint:-unknown} |
| Active PR | [#${pr_number}](${pr_url}) |
| Branch | \`${branch}\` |
| Head | \`${head_sha}\` |
| Draft | ${draft} |
| Handoff | ${status:-unknown} |
| SAFE_TO_CONTINUE | ${safe:-unknown} |
| OWNER_DECISION_REQUIRED | ${owner:-unknown} |
| Accepted code SHA | ${accepted_sha:-NONE} |
| Last commit age | ${age_minutes} minutes |
| CI | $(latest_line "CI") |
| Database QA | $(latest_line "Database QA") |
| Persona QA | $(latest_line "Persona QA") |
| Hosted QA | $(latest_line "Hosted QA") |
| Merge Gate | $(latest_line "Merge Gate") |
| Dependency Review | $(latest_line "Dependency Review") |

**Next expected action:** ${next_checkpoint:-read the current handoff}

${qa_line}

This status is derived from observable GitHub state. It does not claim that an AI process is literally running when the platform does not expose that signal. No AI agent was invoked to produce this update. Native watchdog cadence: **hourly**.
EOF
)
  fi
fi

comments=$(gh api "repos/${REPO}/issues/${STATUS_ISSUE}/comments?per_page=100" --paginate)
comment_id=$(jq -r --arg marker "${STATUS_MARKER}" '[.[] | select(.body | contains($marker))] | last | .id // empty' <<<"${comments}")

if [[ -n "${comment_id}" ]]; then
  gh api --method PATCH "repos/${REPO}/issues/comments/${comment_id}" -f body="${body}" >/dev/null
  echo "Updated AI Ops status comment ${comment_id}."
else
  gh api --method POST "repos/${REPO}/issues/${STATUS_ISSUE}/comments" -f body="${body}" >/dev/null
  echo "Created AI Ops status comment on Issue #${STATUS_ISSUE}."
fi
