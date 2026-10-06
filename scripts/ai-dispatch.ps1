param([Parameter(Mandatory)][ValidateSet('claude','codex')]$Tool,[Parameter(Mandatory)]$Brief,[Parameter(Mandatory)]$Worktree,[string]$Extra='')
# Runs a headless coding agent on its own subscription (claude.ai / ChatGPT login). Refuses API-key billing.
if($env:ANTHROPIC_API_KEY -or $env:OPENAI_API_KEY){ Write-Error 'API key env var set: would bill per token. Unset it first.'; exit 2 }
$log = Join-Path (Split-Path $PSScriptRoot) ".ai-runs"; New-Item -ItemType Directory -Force $log | Out-Null
$out = Join-Path $log ("{0}-{1:yyyyMMdd-HHmmss}.log" -f (Split-Path $Brief -LeafBase), (Get-Date))
$prompt = "Read AGENTS.md then $Brief and implement it fully in this working directory. Edit only files the brief allows. Run npm run check and npm run build, fix failures, commit locally with a conventional message. Do not push. $Extra"
Push-Location $Worktree
try {
  if($Tool -eq 'claude'){ claude -p $prompt --permission-mode acceptEdits --allowedTools "Bash(npm run *)" "Bash(git add*)" "Bash(git commit*)" "Bash(git status*)" "Bash(git diff*)" "Bash(grep*)" "Read" "Edit" "Write" 2>&1 | Tee-Object $out }
  else { codex exec --full-auto $prompt 2>&1 | Tee-Object $out }
} finally { Pop-Location }
