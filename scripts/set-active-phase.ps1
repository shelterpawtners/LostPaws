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
# Current ShelterPawtners Work (Compatibility Record)

> This retained path preserves existing inbound links and legacy script output.
> It is not the live project-status authority.
>
> For current blockers, active lanes, and next actions, read
> [`AI-CONTROLLER.md`](AI-CONTROLLER.md). For the active task's scope and
> acceptance criteria, read the current GitHub Issue or pull request. See
> [`README.md`](README.md) for the documentation authority map.

## Historical phase-selection record

`set-active-phase.ps1` was invoked with legacy Phase $Phase - $($i.Name).

This command preserves its legacy invocation and output path for compatibility.
It does not declare the active phase or change live project status.

## Legacy phase references

- Reference: $($i.Spec)
- Progress record: $($i.Progress)
- Legacy next phase: $($i.Next)

These references are historical aids only. Do not create or update phase-progress
files from this command. Use `docs/AI-CONTROLLER.md` and the active GitHub Issue
to determine authorized work.
"@

Set-Content -Path $current -Value $content -Encoding UTF8
Write-Warning "set-active-phase.ps1 is a compatibility command; it does not activate live work."
Write-Host "Recorded legacy Phase $Phase - $($i.Name) at: $current"
