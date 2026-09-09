# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: MVP Design Hardening + Human Release Readiness
CURRENT_CHECKPOINT: Stream 2 — ChatGPT product/operator capability
NEXT_CHECKPOINT: Validate and merge Stream 2 PR #24 to main, then implement minimum Stream 3 Issue #25 and begin the Marketplace Sprint immediately.
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE

## Completed foundation

- Phase 1 is complete.
- Phase 2 CP1–CP6 are complete.
- `main` is canonical and is the Vercel Production Branch.
- PR #22 — Stream 1 Copilot/repo-native design and build capability — merged to `main` at `eaa7b09edc3496eb8e52d57d081fce42d67f5151`.
- Stream 1 accepted configuration/code SHA is `0a48f446a103a8495ec2ce8a8c31c62bd9d02c3b`.
- Stream 1 acceptance included CI, Hosted QA, Persona QA, Database/RLS evidence, dependency review, and final deterministic Merge Gate success.
- ShelterPawtners DNS remains unchanged.
- Phase 3 remains owner-gated.

## Owner direction — design hardening

The owner wants the product to move quickly from functional/minimal to polished, professional, distinctive, valuable, accessible, and trustworthy, with the Marketplace as the highest design priority.

Authorized now:

1. Stream 1 — GitHub Copilot/repo-native build + design capability — COMPLETE;
2. Stream 2 — ChatGPT product/operator capability — IN PROGRESS;
3. Stream 3 — minimum shared deterministic design QA — NEXT;
4. Marketplace design sprint and visual implementation using already-approved product rules/data immediately after Streams 1–3 reach minimum viable setup.

Visible product progress takes priority over process overhead. Figma is not a prerequisite. Storybook is introduced inside the Marketplace Sprint only when reusable component/state volume makes it faster.

## Stream 1 — complete

PR #22 delivered:

- post-Phase-2 `AGENTS.md` and Copilot instructions;
- Marketplace Product Designer, Frontend Design-System Engineer, UX + Accessibility QA, and Product Critic agents;
- ShelterPawtners brand, Marketplace UX/value, responsive QA, and release-readiness skills;
- repository-level Vercel plugin configuration and local Copilot setup guidance;
- `main`-target CI/QA/AI-Ops control-plane migration;
- Hosted QA PR-head/Vercel artifact correction;
- resilient shared Playwright Chromium installation;
- current operating docs aligned to the post-Phase-2 branch model.

Stream 1 accepted SHA:

`0a48f446a103a8495ec2ce8a8c31c62bd9d02c3b`

Merged to main:

`eaa7b09edc3496eb8e52d57d081fce42d67f5151`

## Stream 2 — current

Issue #23 / PR #24 / branch `ops/stream2-chatgpt-operator`.

Purpose: make ChatGPT the ShelterPawtners product/operator/controller layer without duplicating Copilot/Codex coding work or adding paid tooling.

Implemented:

- `docs/CHATGPT-OPERATING-PROTOCOL.md`:
  - source-of-truth order;
  - ChatGPT vs coding-agent vs deterministic-automation role split;
  - GitHub/Vercel/Supabase connected-tool routing;
  - web-research boundary;
  - fresh-session startup sequence;
  - coding-agent implementation handoff contract;
  - cost/speed rules;
  - owner/RED decision boundaries;
  - operator-session done criteria;
- `docs/prompts/CHATGPT-SESSION-BOOTSTRAP.md`:
  - reusable fresh-chat bootstrap;
  - repository/context recovery before asking the owner to restate history;
  - connected-tool routing for current project state;
  - anti-duplication and RED-gate rules;
- `docs/CURRENT-WORK.md` and `docs/AI-TOOLING-AND-DESIGN-ROADMAP.md` integrated with the Stream 2 operating model.

### Stream 2 operating split

- ChatGPT = product/controller/research/operator/release reasoning.
- Copilot/Codex/another coding surface = substantial source implementation, repetitive engineering, tests, migrations/functions after approved rules, and repo-local debugging.
- GitHub Actions/scripts = deterministic validation and supervision.
- Connected GitHub/Vercel/Supabase tools = current private/project state and authorized operations.
- Web = current external research, standards, pricing, documentation, and competitive evidence.

Do not spend multiple AI systems on the same ordinary implementation task.

## Stream 3 — next

Issue #25 defines the minimum remaining QA gap before the Marketplace Sprint:

- axe accessibility integration using `@axe-core/playwright`;
- focused Marketplace/public-shell design QA;
- representative phone/tablet/desktop screenshots;
- meaningful browser console/page error checks;
- meaningful failed-network-request checks;
- reuse the existing Hosted QA browser pass rather than introducing another heavy workflow/platform.

Explicit non-goals:

- no Figma prerequisite;
- no Storybook prerequisite;
- no paid visual-regression/device SaaS;
- no broad browser matrix yet;
- no Phase 3 feature work;
- no production DNS/domain changes.

## Marketplace Sprint timing

The Marketplace Sprint begins immediately after Stream 3 minimum QA setup is accepted.

Sequence:

1. current Marketplace/competitive research + Guardian value/information architecture;
2. 2–3 materially different code-first visual concepts;
3. independent product/design critique and direction selection;
4. reusable Marketplace component system;
5. Storybook when reusable component/state volume justifies it;
6. flagship Marketplace implementation;
7. responsive/accessibility/browser/Playwright QA;
8. brand-system propagation to the highest-value remaining Guardian/PetBiz screens;
9. Issue #5 broad release-readiness/human-style audit;
10. owner decision on ShelterPawtners domain cutover.

## Still deferred / owner-gated

- `shelterpawtners.com` / `www.shelterpawtners.com` DNS changes;
- Phase 3 feature development;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` giving-provider selection/production charitable settlement;
- paid infrastructure/tooling;
- destructive operations;
- material legal/privacy/security/financial/product RED decisions.

## Next action

1. Reconcile Stream 2 branch with merged Stream 1/main history without losing the five-file bounded Stream 2 diff.
2. Validate PR #24 against `main` using normal deterministic CI; Stream 2 is docs/operator configuration and must not trigger unnecessary heavy browser work.
3. Mark Stream 2 complete and merge PR #24 when green under the owner's continuation authorization.
4. Create/implement only the minimum Stream 3 Issue #25 scope.
5. Begin the Marketplace Sprint immediately after Stream 3 acceptance.
