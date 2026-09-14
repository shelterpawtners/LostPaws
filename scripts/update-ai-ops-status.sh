#!/usr/bin/env bash
set -euo pipefail

: "${GH_TOKEN:?GH_TOKEN is required}"
: "${REPO:?REPO is required}"

STATUS_ISSUE="${STATUS_ISSUE:-12}"
ACTIVE_MARKER="${ACTIVE_MARKER:-<!-- ai-active-build-pr -->}"
QA_URL="${QA_URL:-}"
STALE_MINUTES="${STALE_MINUTES:-60}"
PAGES_WORKFLOW_FILE="${PAGES_WORKFLOW_FILE:-github-pages-staging.yml}"
PAGES_LOOKBACK="${PAGES_LOOKBACK:-20}"
STATUS_MARKER="<!-- ai-ops-live-status -->"

# --- Deployment + post-deploy live-verification health for `main`. -----------
# Computed unconditionally (not only when a build PR is active) because the
# GitHub Pages Staging failure this section exists to catch (issues #180/#181)
# went unnoticed across 8+ deploys precisely because nothing in this status
# looked at main's own deployment health while the repo was otherwise idle.
# Reads only public GitHub Actions run/job metadata: no secrets, no PII, no
# marketing-copy/DOM assertions -- job conclusions only.
pages_runs=$(gh api "repos/${REPO}/actions/workflows/${PAGES_WORKFLOW_FILE}/runs?branch=main&per_page=${PAGES_LOOKBACK}")
latest_pages_run=$(jq -c '.workflow_runs | sort_by(.created_at) | last // empty' <<<"${pages_runs}")

deploy_health="UNKNOWN"
build_line="not run"
deploy_line="not run"
verify_line="not run"
latest_failing_run_url=""
last_good_verify_at=""

job_conclusion_line() {
  local jobs_json="$1"
  local job_name="$2"
  local job
  job=$(jq -c --arg name "${job_name}" '[.jobs[] | select(.name == $name)] | last // empty' <<<"${jobs_json}")
  if [[ -z "${job}" ]]; then
    printf 'not run'
    return
  fi
  local st conclusion url
  st=$(jq -r '.status' <<<"${job}")
  conclusion=$(jq -r '.conclusion // ""' <<<"${job}")
  url=$(jq -r '.html_url' <<<"${job}")
  if [[ "${st}" == "completed" ]]; then
    printf '[%s](%s)' "${conclusion}" "${url}"
  else
    printf '[%s](%s)' "${st}" "${url}"
  fi
}

if [[ -n "${latest_pages_run}" ]]; then
  latest_run_id=$(jq -r '.id' <<<"${latest_pages_run}")
  latest_run_url=$(jq -r '.html_url' <<<"${latest_pages_run}")
  latest_run_status=$(jq -r '.status' <<<"${latest_pages_run}")

  latest_jobs=$(gh api "repos/${REPO}/actions/runs/${latest_run_id}/jobs")
  build_line=$(job_conclusion_line "${latest_jobs}" "build")
  deploy_line=$(job_conclusion_line "${latest_jobs}" "deploy")
  verify_line=$(job_conclusion_line "${latest_jobs}" "Verify live Pages site")

  build_conclusion=$(jq -r '[.jobs[] | select(.name == "build")] | last | .conclusion // ""' <<<"${latest_jobs}")
  deploy_conclusion=$(jq -r '[.jobs[] | select(.name == "deploy")] | last | .conclusion // ""' <<<"${latest_jobs}")
  verify_conclusion=$(jq -r '[.jobs[] | select(.name == "Verify live Pages site")] | last | .conclusion // ""' <<<"${latest_jobs}")

  if [[ "${latest_run_status}" != "completed" ]]; then
    deploy_health="IN_PROGRESS"
  elif [[ "${build_conclusion}" == "failure" || "${build_conclusion}" == "timed_out" || "${build_conclusion}" == "cancelled" ]]; then
    deploy_health="FAILED_BUILD"
    latest_failing_run_url="${latest_run_url}"
  elif [[ "${deploy_conclusion}" == "failure" || "${deploy_conclusion}" == "timed_out" || "${deploy_conclusion}" == "cancelled" ]]; then
    deploy_health="FAILED_DEPLOY"
    latest_failing_run_url="${latest_run_url}"
  elif [[ "${verify_conclusion}" == "failure" || "${verify_conclusion}" == "timed_out" || "${verify_conclusion}" == "cancelled" ]]; then
    deploy_health="DEGRADED"
    latest_failing_run_url="${latest_run_url}"
  elif [[ "${verify_conclusion}" == "success" ]]; then
    deploy_health="HEALTHY"
  fi

  # Bounded lookback (PAGES_LOOKBACK runs, default 20) for the most recent
  # successful live-verification timestamp, so a currently-degraded deploy
  # still shows Jim when it last actually worked rather than just "unknown".
  while IFS= read -r run_id; do
    [[ -z "${run_id}" ]] && continue
    if [[ "${run_id}" == "${latest_run_id}" ]]; then
      run_jobs="${latest_jobs}"
    else
      run_jobs=$(gh api "repos/${REPO}/actions/runs/${run_id}/jobs")
    fi
    found=$(jq -r '[.jobs[] | select(.name == "Verify live Pages site" and .conclusion == "success")] | last // empty' <<<"${run_jobs}")
    if [[ -n "${found}" ]]; then
      last_good_verify_at=$(jq -r '.completed_at' <<<"${found}")
      break
    fi
  done < <(jq -r '.workflow_runs | sort_by(.created_at) | reverse | .[].id' <<<"${pages_runs}")
fi

deployment_banner=""
case "${deploy_health}" in
  DEGRADED)
    deployment_banner=$'\n**\xE2\x9A\xA0 DEPLOYMENT DEGRADED -- `main` deployed successfully but live-site verification is failing.** See "Deployment & live verification" below.\n'
    ;;
  FAILED_BUILD)
    deployment_banner=$'\n**\xE2\x9C\x97 DEPLOYMENT FAILED -- the GitHub Pages Staging build is failing on `main`.** See below.\n'
    ;;
  FAILED_DEPLOY)
    deployment_banner=$'\n**\xE2\x9C\x97 DEPLOYMENT FAILED -- the GitHub Pages Staging deploy step is failing on `main`.** See below.\n'
    ;;
  UNKNOWN)
    deployment_banner=$'\n**? DEPLOYMENT STATUS UNKNOWN -- no GitHub Pages Staging run found for `main` in the last '"${PAGES_LOOKBACK}"' runs.**\n'
    ;;
esac

deployment_section=$(cat <<EOF

## Deployment & live verification (\`main\`)

| Signal | Current state |
| --- | --- |
| Deployment health | **${deploy_health}** |
| Pages Staging — build | ${build_line} |
| Pages Staging — deploy | ${deploy_line} |
| Pages Staging — live verification | ${verify_line} |
| Last successful live verification | ${last_good_verify_at:-not found in last ${PAGES_LOOKBACK} runs} |
| Latest failing run | ${latest_failing_run_url:-none currently} |
EOF
)
# ------------------------------------------------------------------------------

prs=$(gh api "repos/${REPO}/pulls?state=open&base=main&per_page=100")
active_prs=$(jq -c --arg marker "${ACTIVE_MARKER}" '[.[] | select((.body // "") | contains($marker))]' <<<"${prs}")
active_count=$(jq 'length' <<<"${active_prs}")

if [[ "${active_count}" == "0" ]]; then
  body=$(cat <<EOF
${STATUS_MARKER}
## LostPaws AI Ops — IDLE
${deployment_banner}
No open PR targeting \`main\` is currently marked as the active build lane.

- No AI agent was invoked by this status update.
- Native watchdog cadence: hourly, plus event-driven refresh when GitHub Pages Staging completes.
- Next action: open/mark the next bounded checkpoint PR when authorized.
${deployment_section}
EOF
)
else
  if [[ "${active_count}" != "1" ]]; then
    body=$(cat <<EOF
${STATUS_MARKER}
## LostPaws AI Ops — BLOCKED
${deployment_banner}
Found **${active_count}** open PRs carrying the active-build marker. Exactly one is allowed.

No AI agent was invoked. Remove the duplicate marker before automated supervision continues.
${deployment_section}
EOF
)
  else
    pr=$(jq -c '.[0]' <<<"${active_prs}")
    pr_number=$(jq -r '.number' <<<"${pr}")
    pr_url=$(jq -r '.html_url' <<<"${pr}")
    branch=$(jq -r '.head.ref' <<<"${pr}")
    head_sha=$(jq -r '.head.sha' <<<"${pr}")
    draft=$(jq -r '.draft' <<<"${pr}")

    release_state=$(gh api "repos/${REPO}/contents/docs/engineering/AI-RELEASE-STATE.md?ref=${branch}" --jq '.content' | base64 --decode)
    status=$(sed -n 's/^STATUS:[[:space:]]*//p' <<<"${release_state}" | head -n 1)
    phase=$(sed -n 's/^CURRENT_PHASE:[[:space:]]*//p' <<<"${release_state}" | head -n 1)
    checkpoint=$(sed -n 's/^CURRENT_CHECKPOINT:[[:space:]]*//p' <<<"${release_state}" | head -n 1)
    next_checkpoint=$(sed -n 's/^NEXT_CHECKPOINT:[[:space:]]*//p' <<<"${release_state}" | head -n 1)
    owner=$(sed -n 's/^OWNER_DECISION_REQUIRED:[[:space:]]*//p' <<<"${release_state}" | head -n 1)
    safe=$(sed -n 's/^SAFE_TO_CONTINUE:[[:space:]]*//p' <<<"${release_state}" | head -n 1)
    accepted_sha=$(sed -n 's/^ACCEPTED_CODE_SHA:[[:space:]]*//p' <<<"${release_state}" | head -n 1)

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
${deployment_banner}
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
${deployment_section}

This status is derived from observable GitHub state. It does not claim that an AI process is literally running when the platform does not expose that signal. No AI agent was invoked to produce this update. Native watchdog cadence: **hourly**, plus event-driven refresh when GitHub Pages Staging completes.
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
