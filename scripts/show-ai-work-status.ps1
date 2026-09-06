$ErrorActionPreference = "Continue"
$repo = Split-Path -Parent $PSScriptRoot
Write-Host "=== CURRENT WORK ==="
Get-Content (Join-Path $repo "docs\CURRENT-WORK.md")
Write-Host ""
Write-Host "=== GIT STATUS ==="
git -C $repo status --short --branch
Write-Host ""
Write-Host "=== RECENT COMMITS ==="
git -C $repo log -5 --oneline
