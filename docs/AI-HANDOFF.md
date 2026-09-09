# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: MVP Design Hardening + Human Release Readiness
CURRENT_CHECKPOINT: Stream 3 — minimum deterministic design QA
NEXT_CHECKPOINT: Run one Hosted design-QA acceptance cycle for Issue #25, fix real evidence-backed defects without weakening checks, then record acceptance and begin the Marketplace Sprint immediately.
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
3. Stream 3 — minimum shared deterministic design QA — READY FOR ACCEPTANCE;
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

## Stream 3 — implementation ready for acceptance

Issue #25 / PR #26 / branch `ops/stream3-design-qa`.

Implemented:

- hosted axe accessibility scans for the public shell and Marketplace using `@axe-core/playwright`;
- focused `e2e/hosted-design-qa.spec.ts`;
- full-page Marketplace screenshots at 390x844, 768x1024, and 1440x1000;
- unexpected browser page-error and console-error detection;
- meaningful request-failure and HTTP 5xx detection while ignoring known navigation-abort/favicon noise;
- reuse of the existing Hosted QA Chromium/browser job;
- acceptance-only `test-results/` artifact upload with seven-day retention;
- exact pinned QA-only transient `@axe-core/playwright@4.13.0` install without production/runtime dependency or root lockfile churn.

### Fast validation on implementation SHA `5c60c11a7d8b9cca142120787fe2cf989175364f`

- CI classification passed;
- shell validation passed;
- lint passed;
- unit tests passed;
- TypeScript/Vite production build passed;
- CI Gate passed;
- Database QA gate passed without unnecessary database execution;
- Persona QA gate passed with the heavy persona job skipped;
- Hosted QA gate passed with the heavy hosted job skipped while `STATUS: IN_PROGRESS`;
- Dependency Review gate passed;
- Merge Gate remained informational during implementation.

This proves the minimum design-QA additions do not add heavy browser cost to ordinary implementation commits.

## Stream 3 acceptance strategy

1. This `READY_FOR_ACCEPTANCE` commit activates one Hosted acceptance cycle on the active PR.
2. Hosted QA must install the exact QA-only axe package, install Chromium, run existing hosted golden paths, then run the new design-QA spec.
3. The design-QA spec must produce axe JSON evidence and phone/tablet/desktop Marketplace screenshots.
4. Fix real accessibility/runtime/network defects exposed by the run; do not weaken tests merely to make CI green.
5. When Hosted design QA passes and evidence artifacts exist, record the exact accepted SHA and set `STATUS: COMPLETE`.
6. Merge Stream 3 and start the Marketplace Sprint immediately.

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

1. Let the single Hosted design-QA acceptance cycle resolve.
2. Inspect its actual browser/axe/runtime evidence and uploaded artifact.
3. Fix real defects only and rerun as needed.
4. Record accepted SHA, set COMPLETE, merge PR #26, close Issue #25.
5. Begin Marketplace research/value architecture and code-first visual concepts immediately.
