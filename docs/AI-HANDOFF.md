# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: MVP Design Hardening + Human Release Readiness
CURRENT_CHECKPOINT: Stream 2 — ChatGPT product/operator capability
NEXT_CHECKPOINT: Finish Stream 2 documentation/validation, merge only after Stream 1 PR #22 is accepted/merged, then complete Stream 3 minimum deterministic design QA and begin the Marketplace Sprint immediately.
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE

## Completed foundation

- Phase 1 is complete.
- Phase 2 CP1–CP6 are complete.
- PR #1 merged the completed Phase 2 baseline to `main` at `fdc3b1e76063af86970f31a996740d29fa2024d1`.
- `main` is canonical.
- Vercel Production Branch is `main`.
- Vercel production deployment `dpl_7n3zhia8RF3DrJ4RjFi6SQWkQGdG` is READY and serves the accepted Phase 2 application build from `main` SHA `fdc3b1e76063af86970f31a996740d29fa2024d1`.
- `lost-paws-one.vercel.app` returns HTTP 200 from the main-backed production deployment.
- ShelterPawtners DNS remains unchanged.
- Phase 3 remains owner-gated.

## Stream 1 status

PR #22 (`ops/stream1-copilot-design-tooling` -> `main`) implements the Copilot/repo-native capability layer and the migration of live PR automation from the retired `build/festival-mvp` target to `main`.

Accepted/green evidence already observed on the Stream 1 acceptance head includes:

- CI/lint/shell/unit/build success;
- Merge Gate success;
- Database QA gate success with the actual database job skipped because no database change exists;
- Dependency Review gate success;
- Persona and Hosted acceptance lanes correctly activated for one deliberate proof cycle.

Stream 2 is intentionally developed as a temporary stacked branch from the Stream 1 acceptance head so the project does not sit idle. Do not merge Stream 2 ahead of Stream 1.

## Stream 2 implementation

Issue #23 on `ops/stream2-chatgpt-operator`.

Implemented:

- `docs/CHATGPT-OPERATING-PROTOCOL.md`:
  - source-of-truth order;
  - ChatGPT vs coding-agent vs deterministic-automation role split;
  - connected GitHub/Vercel/Supabase routing;
  - web-research boundary;
  - fresh-session startup sequence;
  - implementation handoff contract;
  - cost/speed rules;
  - owner/RED decision boundaries;
  - operator-session done criteria;
- `docs/prompts/CHATGPT-SESSION-BOOTSTRAP.md`:
  - reusable new-chat bootstrap;
  - forces repository/context recovery before asking the owner to restate project history;
  - routes current private/project state through connected tools;
  - prevents duplicate AI implementation work and preserves RED gates;
- `docs/CURRENT-WORK.md` updated with current Stream 1/2 state and stacked-branch operating rule;
- `docs/AI-TOOLING-AND-DESIGN-ROADMAP.md` updated with Stream 2 minimum viable deliverables and operating split.

## Stream 2 operating decision

ChatGPT is the product/controller/operator layer, not the default code builder.

Use ChatGPT for:

- product strategy/prioritization;
- current marketplace/competitive research;
- value and information architecture;
- independent critique;
- GitHub/Vercel/Supabase connected operations;
- architecture/release-readiness/cost decisions;
- concise implementation briefs.

Use Copilot/Codex/another coding surface for substantial source implementation, repetitive component construction, tests, migrations/functions after approval, and repository-local code debugging.

Use GitHub Actions/scripts for deterministic validation and supervision.

## Tooling decisions

### Figma

**Deferred; not a prerequisite.**

Use code-first design, the real React/Tailwind application, Vercel previews, screenshots, and reusable components. Reconsider Figma only when collaboration/design-system complexity makes it faster than maintaining code-first design alone.

### Storybook

**Planned for the Marketplace Sprint, not before it.**

Introduce Storybook after reusable Marketplace components/states emerge and isolated component iteration becomes faster than route-only work.

### Cost

Default to free/native/open-source tooling. Do not add paid visual-regression/device/design SaaS until native tools are demonstrably insufficient.

## Marketplace Sprint timing

The Marketplace Sprint is the **next product-design sprint** and starts immediately after Streams 1–3 have minimum viable setup.

Sprint sequence is documented in `docs/AI-TOOLING-AND-DESIGN-ROADMAP.md`:

1. research + value/information architecture;
2. 2–3 code-first visual concepts;
3. independent critique and direction selection;
4. reusable component system;
5. Storybook when justified by component/state volume;
6. flagship implementation;
7. responsive/accessibility/browser/Playwright QA;
8. brand propagation to the highest-value remaining screens;
9. Issue #5 broad release-readiness audit;
10. owner decision on domain cutover.

## Still deferred / owner-gated

- `shelterpawtners.com` / `www.shelterpawtners.com` DNS changes;
- Phase 3 feature development;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` giving-provider selection/production charitable settlement;
- paid infrastructure/tooling;
- destructive operations;
- material legal/privacy/security/financial/product RED decisions.

## Next action

1. Let the final Stream 1 Persona/Hosted proof cycle resolve.
2. Fix real Stream 1 acceptance failures if any; do not weaken checks.
3. When Stream 1 is accepted, record its exact accepted SHA and merge PR #22 under the owner's continuation authorization.
4. Validate Stream 2 formatting/CI through a small stacked PR.
5. After Stream 1 merge, retarget Stream 2 to `main`, merge when green, and close Issue #23.
6. Complete only the minimum Stream 3 QA setup required for the Marketplace Sprint.
7. Begin the Marketplace Sprint immediately; do not postpone it for Figma or Storybook.
