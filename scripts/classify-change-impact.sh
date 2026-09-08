#!/usr/bin/env bash
set -euo pipefail

BASE_SHA="${1:-}"
HEAD_SHA="${2:-HEAD}"

if [[ -z "${BASE_SHA}" ]]; then
  echo "usage: $0 <base-sha> [head-sha]" >&2
  exit 2
fi

mapfile -t changed_files < <(git diff --name-only "${BASE_SHA}" "${HEAD_SHA}")

docs=false
web=false
frontend_artifact=false
shared_app=false
database=false
persona=false
e2e=false
workflow=false
dependency=false
deployment=false
unknown=false
package_json_changed=false

for file in "${changed_files[@]}"; do
  case "${file}" in
    docs/*|*.md|README*)
      docs=true
      ;;
    src/*)
      web=true
      frontend_artifact=true
      case "${file}" in
        src/main.tsx|src/lib/*|src/*auth*|src/*Auth*|src/*session*|src/*Session*)
          shared_app=true
          persona=true
          ;;
      esac
      ;;
    public/*|index.html|vite.config.*|tsconfig*.json)
      web=true
      frontend_artifact=true
      ;;
    supabase/migrations/*|supabase/tests/*|supabase/seed.sql|supabase/config.toml)
      database=true
      persona=true
      ;;
    supabase/functions/*)
      database=true
      persona=true
      web=true
      ;;
    e2e/*|playwright.config.*)
      e2e=true
      case "${file}" in
        e2e/persona-*|e2e/guardian-dashboard.spec.ts|e2e/admin-qa-mode.spec.ts|e2e/phase-2-offer-redemption.spec.ts)
          persona=true
          ;;
      esac
      ;;
    package-lock.json)
      dependency=true
      web=true
      frontend_artifact=true
      ;;
    package.json)
      dependency=true
      web=true
      package_json_changed=true
      ;;
    .github/workflows/persona-qa.yml)
      workflow=true
      persona=true
      ;;
    .github/workflows/database-qa.yml|scripts/supabase-cli.sh)
      workflow=true
      database=true
      ;;
    .github/workflows/hosted-qa.yml)
      workflow=true
      e2e=true
      ;;
    .github/workflows/*|.github/actions/*|scripts/*)
      workflow=true
      ;;
    .github/dependabot.yml|.github/instructions/*|.github/copilot-instructions.md|AGENTS.md|CLAUDE.md|.agents/*)
      workflow=true
      docs=true
      ;;
    vercel.json)
      deployment=true
      frontend_artifact=true
      ;;
    .gitignore|.prettierignore|.prettierrc*|eslint.config.*)
      workflow=true
      ;;
    *)
      unknown=true
      ;;
  esac
done

# package.json contains both deploy-impacting inputs and test/tooling scripts.
# Only dependencies/runtime/build configuration should force a Vercel build.
if [[ "${package_json_changed}" == "true" ]]; then
  before=$(mktemp)
  after=$(mktemp)
  trap 'rm -f "$before" "$after"' EXIT
  if git show "${BASE_SHA}:package.json" > "$before" 2>/dev/null && git show "${HEAD_SHA}:package.json" > "$after" 2>/dev/null; then
    before_sig=$(jq -Sc '{dependencies,devDependencies,peerDependencies,optionalDependencies,engines,packageManager,buildScript:(.scripts.build // null)}' "$before")
    after_sig=$(jq -Sc '{dependencies,devDependencies,peerDependencies,optionalDependencies,engines,packageManager,buildScript:(.scripts.build // null)}' "$after")
    if [[ "${before_sig}" != "${after_sig}" ]]; then
      frontend_artifact=true
    fi
  else
    frontend_artifact=true
  fi
fi

if [[ "${unknown}" == "true" ]]; then
  web=true
  e2e=true
  frontend_artifact=true
fi

product_change=false
if [[ "${web}" == "true" || "${database}" == "true" || "${e2e}" == "true" || "${dependency}" == "true" || "${deployment}" == "true" ]]; then
  product_change=true
fi

docs_only=false
if [[ "${#changed_files[@]}" -gt 0 && "${product_change}" == "false" && "${workflow}" == "false" && "${unknown}" == "false" ]]; then
  docs_only=true
fi

requires_web_ci=false
if [[ "${web}" == "true" || "${dependency}" == "true" || "${workflow}" == "true" || "${e2e}" == "true" || "${unknown}" == "true" ]]; then
  requires_web_ci=true
fi

requires_db_qa="${database}"
requires_persona_qa="${persona}"

requires_hosted_qa=false
if [[ "${web}" == "true" || "${database}" == "true" || "${e2e}" == "true" || "${deployment}" == "true" || "${unknown}" == "true" ]]; then
  requires_hosted_qa=true
fi

requires_dependency_review="${dependency}"

emit() {
  local key="$1"
  local value="$2"
  printf '%s=%s\n' "${key}" "${value}"
  if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    printf '%s=%s\n' "${key}" "${value}" >> "${GITHUB_OUTPUT}"
  fi
}

emit docs "${docs}"
emit web "${web}"
emit frontend_artifact "${frontend_artifact}"
emit shared_app "${shared_app}"
emit database "${database}"
emit persona "${persona}"
emit e2e "${e2e}"
emit workflow "${workflow}"
emit dependency "${dependency}"
emit deployment "${deployment}"
emit unknown "${unknown}"
emit product_change "${product_change}"
emit docs_only "${docs_only}"
emit requires_web_ci "${requires_web_ci}"
emit requires_db_qa "${requires_db_qa}"
emit requires_persona_qa "${requires_persona_qa}"
emit requires_hosted_qa "${requires_hosted_qa}"
emit requires_dependency_review "${requires_dependency_review}"

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  {
    echo "### Change impact"
    echo
    echo "- Files changed: ${#changed_files[@]}"
    echo "- Deployed frontend artifact: ${frontend_artifact}"
    echo "- Web CI: ${requires_web_ci}"
    echo "- Database QA: ${requires_db_qa}"
    echo "- Persona QA at acceptance: ${requires_persona_qa}"
    echo "- Hosted QA at acceptance: ${requires_hosted_qa}"
    echo "- Dependency review: ${requires_dependency_review}"
    echo "- Docs only: ${docs_only}"
  } >> "${GITHUB_STEP_SUMMARY}"
fi
