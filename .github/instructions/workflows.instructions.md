---
applyTo: ".github/workflows/**"
---

# GitHub Actions instructions

- GitHub Actions is the zero-AI control plane. Workflows must not automatically invoke Copilot/Codex/Claude or another coding agent.
- Use `scripts/classify-change-impact.sh` instead of duplicating path/risk rules inside multiple workflows.
- Use concurrency + `cancel-in-progress` for obsolete PR checks.
- Upload heavy artifacts only on failure unless evidence retention is explicitly required.
- Event-driven workflow state changes are primary; the stale watchdog runs hourly.
- Do not add paid/larger runners or another CI provider.
- Keep acceptance workflows truth-preserving: a skipped heavy job must never be presented as a full acceptance pass.
