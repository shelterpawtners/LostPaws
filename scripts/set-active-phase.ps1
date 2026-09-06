param(
    [Parameter(Mandatory=$true)]
    [ValidateSet(1,2,3,4,5)]
    [int]$Phase
)

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $PSScriptRoot
$current = Join-Path $repo "docs\CURRENT-WORK.md"

$info = @{
    1 = @{
        Name = "Platform + Data Foundation"
        Spec = "Use the existing approved Phase 1 specification and docs/PHASE-1-EXECUTION.md if present."
        Progress = "docs/PHASE-1-PROGRESS.md"
        Next = "Phase 2 — Partner Marketplace MVP"
    }
    2 = @{
        Name = "Partner Marketplace MVP"
        Spec = "docs/phases/PHASE-2.md"
        Progress = "docs/progress/PHASE-2-PROGRESS.md"
        Next = "Phase 3 — Guardian + Shelter Passport MVP"
    }
    3 = @{
        Name = "Guardian + Shelter Passport MVP"
        Spec = "docs/phases/PHASE-3.md"
        Progress = "docs/progress/PHASE-3-PROGRESS.md"
        Next = "Phase 4 — Impact + Giving + Financial Intelligence"
    }
    4 = @{
        Name = "Impact + Giving + Financial Intelligence"
        Spec = "docs/phases/PHASE-4.md"
        Progress = "docs/progress/PHASE-4-PROGRESS.md"
        Next = "Phase 5 — Integrations + Marketplace + Production Launch"
    }
    5 = @{
        Name = "Integrations + Marketplace + Production Launch"
        Spec = "docs/phases/PHASE-5.md"
        Progress = "docs/progress/PHASE-5-PROGRESS.md"
        Next = "Production launch / post-MVP roadmap"
    }
}

$i = $info[$Phase]

$content = @"
# Current ShelterPawtners Work

## Active Phase
Phase $Phase - $($i.Name)

## Authoritative Specification
$($i.Spec)

## Current Status
Progress:
$($i.Progress)

If the progress file does not exist, create it from the active phase Definition of Done before substantial implementation.

## Current Objective
Execute the active phase specification efficiently without re-planning already approved business rules.

## Next Phase
$($i.Next)

## Handoff Rules
- Do not begin the next phase until the current phase is approved.
- Preserve valid existing work.
- Update the active phase progress file.
- Record autonomous implementation decisions in docs/DECISION-LOG.md.
- Test, fix, commit, and push at meaningful checkpoints so timeouts do not lose work.
"@

Set-Content -Path $current -Value $content -Encoding UTF8
Write-Host "Activated Phase $Phase - $($i.Name)"
Write-Host "Updated: $current"
