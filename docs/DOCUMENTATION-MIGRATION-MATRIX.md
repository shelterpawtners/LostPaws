# Documentation Migration Matrix

Status: **Phase-B planning artifact — no source documentation has been deleted or moved.**

Scope: current `main` at `64b13cb30216a3dd04db485e935f609837169c4b`; generated for Issue #136 after Issue #141/PR #142 merged.

## Operating rules

- This is a file-by-file disposition ledger, not authority to delete.
- Before any `CONSOLIDATE` or `REVIEW` item changes, identify inbound references with `rg`, migrate unique durable content, and validate affected links/build checks.
- Legal, security, support, data, architecture, and open owner-decision material stays explicit until reviewed.
- `docs/AI-CONTROLLER.md` remains the live status authority. No historical document may become a competing live control plane.
- Use one focused documentation PR per migration batch; do not mix product behavior, provider settings, Meta work, or branch retirement with document content changes.

## Canonical destinations proposed by the approved master plan

- Live state: `docs/AI-CONTROLLER.md`
- Agent operations: `docs/engineering/AGENT-OPERATIONS.md` (planned)
- Decisions: `docs/DECISIONS.md` (planned)
- Active task briefs: `docs/tasks/active/` (planned)
- Documentation map: `docs/README.md` (planned)

## File-by-file ledger

| Source | Disposition | Target | Required before changing |
|---|---|---|---|
| `docs/AI-CONTROLLER.md` | RETAIN — live authority | `docs/AI-CONTROLLER.md` | Keep short; remove historical diary during consolidation |
| `docs/AI-COST-AND-TESTING-GOVERNANCE.md` | CONSOLIDATE | `docs/engineering/AGENT-OPERATIONS.md (planned)` | Preserve current authority order, auth failsafe, validation/cost rules; thin tool adapters only |
| `docs/AI-EXECUTION-PLAN-2026-09-12.md` | CONSOLIDATE | `docs/engineering/AGENT-OPERATIONS.md (planned)` | Preserve current authority order, auth failsafe, validation/cost rules; thin tool adapters only |
| `docs/AI-HANDOFF.md` | CONSOLIDATE, then compatibility pointer | `docs/AI-CONTROLLER.md` | Extract only live blocker/next-action state; update inbound refs first |
| `docs/AI-OPERATING-PROTOCOL.md` | CONSOLIDATE | `docs/engineering/AGENT-OPERATIONS.md (planned)` | Preserve current authority order, auth failsafe, validation/cost rules; thin tool adapters only |
| `docs/AI-TOOLING-AND-DESIGN-ROADMAP.md` | CONSOLIDATE | `docs/engineering/AGENT-OPERATIONS.md (planned)` | Preserve current authority order, auth failsafe, validation/cost rules; thin tool adapters only |
| `docs/ARCHITECTURE.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/AUTONOMOUS-DECISIONS.md` | CONSOLIDATE | `docs/DECISIONS.md (planned)` | Preserve unresolved owner gates and durable decisions; archive micro-history in Git |
| `docs/AUTONOMOUS-EXECUTION-POLICY.md` | CONSOLIDATE | `docs/engineering/AGENT-OPERATIONS.md (planned)` | Preserve current authority order, auth failsafe, validation/cost rules; thin tool adapters only |
| `docs/BRANCH-CLEANUP-2026-09-11.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/BRANCH-RETIREMENT-2026-09-12.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/BRAND-DESIGN-SYSTEM.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/BUSINESS-STRUCTURE-AND-IMPACT.md` | REVIEW — retain until content audit | `Current path or canonical subtree` | Unique durable content and inbound references checked |
| `docs/CHATGPT-OPERATING-PROTOCOL.md` | CONSOLIDATE | `docs/engineering/AGENT-OPERATIONS.md (planned)` | Preserve current authority order, auth failsafe, validation/cost rules; thin tool adapters only |
| `docs/CONTENT-STANDARDS.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/COPILOT-LOCAL-SETUP.md` | CONSOLIDATE | `docs/engineering/AGENT-OPERATIONS.md (planned)` | Preserve current authority order, auth failsafe, validation/cost rules; thin tool adapters only |
| `docs/CURRENT-WORK.md` | CONSOLIDATE, then compatibility pointer | `docs/AI-CONTROLLER.md` | Extract only live blocker/next-action state; update inbound refs first |
| `docs/CUTOVER-SHELTERPAWTNERS-COM.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/DECISION-LOG.md` | CONSOLIDATE | `docs/DECISIONS.md (planned)` | Preserve unresolved owner gates and durable decisions; archive micro-history in Git |
| `docs/DEV-LOOP-V2.md` | CONSOLIDATE | `docs/engineering/AGENT-OPERATIONS.md (planned)` | Preserve current authority order, auth failsafe, validation/cost rules; thin tool adapters only |
| `docs/FESTIVAL-MVP-AND-VERIFICATION.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/FINANCIAL-LEDGER-AND-GIVING.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/HOSTED-QA.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/ISSUE-5-COVERAGE-MATRIX.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/JIM-LOCAL-PC-SETUP.md` | CONSOLIDATE | `docs/engineering/AGENT-OPERATIONS.md (planned)` | Preserve current authority order, auth failsafe, validation/cost rules; thin tool adapters only |
| `docs/LAUNCH-ACCOUNT-READINESS.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/LAUNCH-AUTH-EMAIL-READINESS.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/LAUNCH-CANDIDATE-PLAN.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/LAUNCH-CONTROLLER-CHECKPOINT-2026-09-11.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/LAUNCH-DATA-HYGIENE-FINDINGS.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/LAUNCH-PRE-CUTOVER-CHECKPOINT.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/LAUNCH-READINESS-CHECKLIST.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/LAUNCH-RESOURCE-PUBLISHING-RULES.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/LAUNCH-RESOURCE-RESEARCH.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/LAUNCH-RESOURCE-WAVE-1.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/LL4-AUTH-EMAIL-READINESS.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/LL5-META-SOCIAL-AUTH.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/LL6-LAUNCH-READINESS.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/LOSTPAWS-RAVE-LANDING-DIRECTION.md` | REVIEW — retain until content audit | `Current path or canonical subtree` | Unique durable content and inbound references checked |
| `docs/MAIN-PROTECTION-AND-BRANCH-RETIREMENT.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/MARKETPLACE-DESIGN-SPRINT.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/MARKETPLACE-RESEARCH.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/MVP-PROFILE-DATA-MODEL-REVIEW.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/OPEN-ITEMS-2026-09-12.md` | CONSOLIDATE, then compatibility pointer | `docs/AI-CONTROLLER.md` | Extract only live blocker/next-action state; update inbound refs first |
| `docs/OWNER-DECISION-BACKLOG.md` | CONSOLIDATE | `docs/DECISIONS.md (planned)` | Preserve unresolved owner gates and durable decisions; archive micro-history in Git |
| `docs/OWNER-REVIEW-DRAFTS-2026-09-12.md` | CONSOLIDATE | `docs/DECISIONS.md (planned)` | Preserve unresolved owner gates and durable decisions; archive micro-history in Git |
| `docs/PHASE-1-EXECUTION.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/PHASE-1-PROGRESS.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/PHASE-2-CHECKPOINT-1-PROGRESS.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/PHASE-2-CHECKPOINT-1-QA.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/PHASE-2-CHECKPOINT-2-PROGRESS.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/PHASE-2-CHECKPOINT-3-PROGRESS.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/PHASE-2-CHECKPOINT-4-PROGRESS.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/PHASE-2-CHECKPOINT-5-PROGRESS.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/PHASE-2-EXECUTION-PLAN.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/PRODUCT-REQUIREMENTS.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/PRODUCT-VISION.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/PROJECT-TECH-GLOSSARY.md` | REVIEW — retain until content audit | `Current path or canonical subtree` | Unique durable content and inbound references checked |
| `docs/QA-AUTOMATION-POLICY.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/QA-TEST-ACCOUNTS.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/RAVE-SHELTER-LOSTPAWS-MISSION.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/ROADMAP.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/SECURITY-AND-PRIVACY.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/SEVEN-STAR-SHELTERS-LANDING-BRIEF.md` | REVIEW — retain until content audit | `Current path or canonical subtree` | Unique durable content and inbound references checked |
| `docs/SHELTER-DATA-STANDARDS.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/SITE-REVIEW-2026-09-12.md` | REVIEW — historical/archive candidate | `Canonical domain doc or Git history` | Migrate unique durable rule; scan inbound links; no bulk deletion |
| `docs/STRATEGIC-PLAN-2026-09-12.md` | CONSOLIDATE, then compatibility pointer | `docs/AI-CONTROLLER.md` | Extract only live blocker/next-action state; update inbound refs first |
| `docs/USER-ROLES.md` | RETAIN — canonical candidate | `Future canonical subtree` | Rehome only after authority/index review; preserve references |
| `docs/legal/DRAFT-DATA-DELETION-INSTRUCTIONS.md` | RETAIN — high-stakes domain | `docs/legal/DRAFT-DATA-DELETION-INSTRUCTIONS.md` | No deletion without legal/support owner review and inbound-reference scan |
| `docs/legal/DRAFT-PRIVACY-NOTICE.md` | RETAIN — high-stakes domain | `docs/legal/DRAFT-PRIVACY-NOTICE.md` | No deletion without legal/support owner review and inbound-reference scan |
| `docs/legal/DRAFT-TERMS-OF-SERVICE.md` | RETAIN — high-stakes domain | `docs/legal/DRAFT-TERMS-OF-SERVICE.md` | No deletion without legal/support owner review and inbound-reference scan |
| `docs/legal/OWNER-LEGAL-REVIEW-CHECKLIST.md` | RETAIN — high-stakes domain | `docs/legal/OWNER-LEGAL-REVIEW-CHECKLIST.md` | No deletion without legal/support owner review and inbound-reference scan |
| `docs/meta/META-APP-REVIEW-READINESS.md` | REVIEW — retain until content audit | `Current path or canonical subtree` | Unique durable content and inbound references checked |
| `docs/phases/PHASE-2.md` | RETAIN — roadmap | `docs/phases/PHASE-2.md` | Confirm it does not duplicate live controller state |
| `docs/phases/PHASE-3.md` | RETAIN — roadmap | `docs/phases/PHASE-3.md` | Confirm it does not duplicate live controller state |
| `docs/phases/PHASE-4.md` | RETAIN — roadmap | `docs/phases/PHASE-4.md` | Confirm it does not duplicate live controller state |
| `docs/phases/PHASE-5.md` | RETAIN — roadmap | `docs/phases/PHASE-5.md` | Confirm it does not duplicate live controller state |
| `docs/product/AGENT-START-PROMPTS.md` | RETAIN — domain/proposal | `docs/product/AGENT-START-PROMPTS.md` | Classify proposal lifecycle and consolidate only accepted durable decisions |
| `docs/product/BUSINESS-GIVING-AND-TAX-CONSIDERATIONS.md` | RETAIN — domain/proposal | `docs/product/BUSINESS-GIVING-AND-TAX-CONSIDERATIONS.md` | Classify proposal lifecycle and consolidate only accepted durable decisions |
| `docs/product/CODEX-CLAUDE-COLLABORATION-PROTOCOL.md` | RETAIN — domain/proposal | `docs/product/CODEX-CLAUDE-COLLABORATION-PROTOCOL.md` | Classify proposal lifecycle and consolidate only accepted durable decisions |
| `docs/product/DONATION-TRACKING-SCHEMA-PROPOSAL.md` | RETAIN — domain/proposal | `docs/product/DONATION-TRACKING-SCHEMA-PROPOSAL.md` | Classify proposal lifecycle and consolidate only accepted durable decisions |
| `docs/product/DUAL-MARKETPLACE-RAVE-SHELTER-EXECUTION-PLAN.md` | RETAIN — domain/proposal | `docs/product/DUAL-MARKETPLACE-RAVE-SHELTER-EXECUTION-PLAN.md` | Classify proposal lifecycle and consolidate only accepted durable decisions |
| `docs/product/OFFER-LINK-PREVIEW-PROPOSAL.md` | RETAIN — domain/proposal | `docs/product/OFFER-LINK-PREVIEW-PROPOSAL.md` | Classify proposal lifecycle and consolidate only accepted durable decisions |
| `docs/product/OWNER-DECISIONS-NEXT-SPRINT.md` | RETAIN — domain/proposal | `docs/product/OWNER-DECISIONS-NEXT-SPRINT.md` | Classify proposal lifecycle and consolidate only accepted durable decisions |
| `docs/product/PASSPORT-SAVINGS-IMPACT-MODEL.md` | RETAIN — domain/proposal | `docs/product/PASSPORT-SAVINGS-IMPACT-MODEL.md` | Classify proposal lifecycle and consolidate only accepted durable decisions |
| `docs/product/README.md` | RETAIN — domain/proposal | `docs/product/README.md` | Classify proposal lifecycle and consolidate only accepted durable decisions |
| `docs/product/SOFT-LAUNCH-MESSAGING-DRAFT.md` | RETAIN — domain/proposal | `docs/product/SOFT-LAUNCH-MESSAGING-DRAFT.md` | Classify proposal lifecycle and consolidate only accepted durable decisions |
| `docs/progress/README.md` | REVIEW — retain until content audit | `Current path or canonical subtree` | Unique durable content and inbound references checked |
| `docs/prompts/ADMIN-QA-MODE-AND-TEST-ACCOUNT-FACTORY.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/CHATGPT-SESSION-BOOTSTRAP.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/GUARDIAN-DASHBOARD-MULTIPET-BLOCKER-FIX.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/GUARDIAN-PET-SAVE-BLOCKER-FIX.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/GUARDIAN-PET-SAVE-BUGFIX-AND-MULTIROLE-UX.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/ISSUE-11-PARTNER-PROFILE-PERSISTENCE-BLOCKER.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/ISSUE-53-GUARDIAN-PET-CONTACT-WORK.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/OVERNIGHT-CLAUDE-WORK-2026-09-12.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/PHASE-2-CHECKPOINT-1-CODEX.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/PHASE-2-CHECKPOINT-1-COPILOT-QA.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/PHASE-2-CHECKPOINT-2-CODEX.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/PHASE-2-CHECKPOINT-2-COMPLETION-QA.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/PHASE-2-CHECKPOINT-2-FINAL-COMPLETION.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/PHASE-2-CHECKPOINT-3-CODEX.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/PHASE-2-CONTINUOUS-EXECUTION.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/PHASE-2-PR-AUTOMATION-WORKFLOW.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/prompts/VERCEL-MARKETPLACE-FOOTER-SPRINT.md` | REVIEW — task brief/archive candidate | `docs/tasks/active or Git history (planned)` | Verify task is inactive and durable rules migrated before removal |
| `docs/support/ADOPTION-VERIFICATION-RUNBOOK.md` | RETAIN — high-stakes domain | `docs/support/ADOPTION-VERIFICATION-RUNBOOK.md` | No deletion without legal/support owner review and inbound-reference scan |
| `docs/support/AI-SUPPORT-GUARDRAILS.md` | RETAIN — high-stakes domain | `docs/support/AI-SUPPORT-GUARDRAILS.md` | No deletion without legal/support owner review and inbound-reference scan |
| `docs/support/AUTH-ACCOUNT-RUNBOOK.md` | RETAIN — high-stakes domain | `docs/support/AUTH-ACCOUNT-RUNBOOK.md` | No deletion without legal/support owner review and inbound-reference scan |
| `docs/support/BUG-REPRO-AND-ENGINEERING-HANDOFF.md` | RETAIN — high-stakes domain | `docs/support/BUG-REPRO-AND-ENGINEERING-HANDOFF.md` | No deletion without legal/support owner review and inbound-reference scan |
| `docs/support/HUMAN-ESCALATION.md` | RETAIN — high-stakes domain | `docs/support/HUMAN-ESCALATION.md` | No deletion without legal/support owner review and inbound-reference scan |
| `docs/support/MARKETPLACE-REDEMPTION-RUNBOOK.md` | RETAIN — high-stakes domain | `docs/support/MARKETPLACE-REDEMPTION-RUNBOOK.md` | No deletion without legal/support owner review and inbound-reference scan |
| `docs/support/NOTIFICATION-POLICY.md` | RETAIN — high-stakes domain | `docs/support/NOTIFICATION-POLICY.md` | No deletion without legal/support owner review and inbound-reference scan |
| `docs/support/PERSONA-PLAYBOOKS.md` | RETAIN — high-stakes domain | `docs/support/PERSONA-PLAYBOOKS.md` | No deletion without legal/support owner review and inbound-reference scan |
| `docs/support/SUPPORT-OPERATING-MODEL.md` | RETAIN — high-stakes domain | `docs/support/SUPPORT-OPERATING-MODEL.md` | No deletion without legal/support owner review and inbound-reference scan |
| `docs/support/TRIAGE-SEVERITY.md` | RETAIN — high-stakes domain | `docs/support/TRIAGE-SEVERITY.md` | No deletion without legal/support owner review and inbound-reference scan |

## Migration-batch order

1. Create the thin authority index and agent-operations/decisions destinations; do not delete legacy sources.
2. Convert `AI-HANDOFF.md` and `CURRENT-WORK.md` to compatibility pointers only after their still-live facts are in the controller.
3. Migrate one historical family at a time (prompts, phase/progress, launch snapshots), with link/build validation after each PR.
4. Delete only files whose matrix row has been upgraded from `REVIEW` to an evidence-backed archival decision.

## Validation checklist for every follow-up PR

- `rg` finds no unresolved inbound reference to a removed/moved path.
- `npm run check` remains green when changed documentation is subject to formatting/CI checks.
- `AGENTS.md`, the controller, and active issue/task brief still lead an agent to one current authority.
- No legal, security, support, provider, or product assertion became less precise.