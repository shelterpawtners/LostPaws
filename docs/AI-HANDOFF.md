# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: MVP Design Hardening + Human Release Readiness
CURRENT_CHECKPOINT: Stream 3 — minimum deterministic design QA
NEXT_CHECKPOINT: Implement Issue #25, validate fast checks, move to READY_FOR_ACCEPTANCE for one Hosted design-QA run, then begin the Marketplace Sprint immediately after acceptance.
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE

## Completed foundation

- Phase 1 is complete.
- Phase 2 CP1–CP6 are complete.
- `main` is canonical and is the Vercel Production Branch.
- Stream 1 PR #22 merged to `main` at `eaa7b09edc3496eb8e52d57d081fce42d67f5151`; accepted SHA `0a48f446a103a8495ec2ce8a8c31c62bd9d02c3b`.
- Stream 2 PR #24 merged to `main` at `3e49f4c42fba2081b5bd6221c46ffd4b7fd1152c`; accepted SHA `1163e6c3deb07c5d20cd7a88961b213c4bd327f0`.
- Issue #23 is closed complete.
- ShelterPawtners DNS remains unchanged.
- Phase 3 remains owner-gated.

## Owner direction — design hardening

The owner wants the product to move quickly from functional/minimal to polished, professional, distinctive, valuable, accessible, and trustworthy, with the Marketplace as the highest design priority.

Authorized now:

1. Stream 1 — GitHub Copilot/repo-native build + design capability — COMPLETE;
2. Stream 2 — ChatGPT product/operator capability — COMPLETE;
3. Stream 3 — minimum shared deterministic design QA — IN PROGRESS;
4. Marketplace design sprint and visual implementation using already-approved product rules/data immediately after Stream 3 acceptance.

Visible product progress takes priority over process overhead. Figma is not a prerequisite. Storybook is introduced inside the Marketplace Sprint only when reusable component/state volume makes it faster.

## Stream 1 — complete

PR #22 delivered the post-Phase-2 Copilot/design-agent layer, `main`-target CI/QA control plane, current operating rules, Vercel/Supabase/Chrome DevTools guidance, Hosted QA artifact correction, and resilient Playwright Chromium installation.

## Stream 2 — complete

PR #24 delivered:

- `docs/CHATGPT-OPERATING-PROTOCOL.md`;
- `docs/prompts/CHATGPT-SESSION-BOOTSTRAP.md`;
- explicit ChatGPT/coding-agent/deterministic-automation role separation;
- connected GitHub/Vercel/Supabase routing and external-web research boundaries;
- cost/anti-duplication and RED decision rules.

Stream 2 accepted SHA: `1163e6c3deb07c5d20cd7a88961b213c4bd327f0`.

## Stream 3 — active

Issue #25 / branch `ops/stream3-design-qa`.

Minimum implementation scope:

- add hosted axe accessibility scans for the public shell and Marketplace using `@axe-core/playwright`;
- add a focused Hosted design-QA Playwright spec;
- capture full-page Marketplace screenshots at representative phone, tablet, and desktop viewports;
- fail on unexpected page errors and console errors;
- fail on meaningful network failures and HTTP 5xx responses while ignoring known navigation-abort noise;
- reuse the existing Hosted QA job and Chromium install;
- upload design evidence from the acceptance run only;
- keep axe as an exact pinned QA-only transient install rather than adding production/runtime dependency or root lockfile churn.

Exact QA-only axe package pin: `@axe-core/playwright@4.13.0`.

### Stream 3 acceptance strategy

1. Keep this implementation checkpoint `IN_PROGRESS` while normal deterministic CI validates the repository/workflow changes.
2. Heavy Hosted browser QA must remain skipped during ordinary implementation commits.
3. Once fast validation is green, set `STATUS: READY_FOR_ACCEPTANCE` in one batched handoff commit.
4. Run one Hosted acceptance cycle on the active PR.
5. Fix real accessibility/runtime/network defects exposed by that run; do not weaken tests just to make CI green.
6. When Hosted design QA passes and evidence artifacts exist, record the exact accepted SHA and set `STATUS: COMPLETE`.
7. Merge Stream 3 and start the Marketplace Sprint immediately.

## Marketplace Sprint timing

The Marketplace Sprint begins immediately after Stream 3 acceptance.

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

## Explicit Stream 3 non-goals

- no Figma prerequisite;
- no Storybook prerequisite;
- no paid visual-regression/device SaaS;
- no broad browser matrix yet;
- no Phase 3 feature work;
- no production DNS/domain changes.

## Still deferred / owner-gated

- `shelterpawtners.com` / `www.shelterpawtners.com` DNS changes;
- Phase 3 feature development;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` giving-provider selection/production charitable settlement;
- paid infrastructure/tooling;
- destructive operations;
- material legal/privacy/security/financial/product RED decisions.

## Next action

1. Commit the bounded Stream 3 implementation as one batch.
2. Open a draft PR to `main` carrying the active-build marker while handoff remains `IN_PROGRESS`.
3. Confirm normal CI passes and Hosted QA correctly stays lightweight/skipped.
4. Move to `READY_FOR_ACCEPTANCE` and run one real Hosted design-QA cycle.
5. Fix evidence-backed defects only, then complete/merge Issue #25.
6. Begin the Marketplace Sprint immediately.
