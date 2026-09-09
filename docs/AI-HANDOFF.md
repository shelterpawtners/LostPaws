# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: MVP Design Hardening + Human Release Readiness
CURRENT_CHECKPOINT: Stream 1 — GitHub Copilot + repo-native design/build capability
NEXT_CHECKPOINT: Validate/merge Stream 1, configure Stream 2 ChatGPT capability, establish Stream 3 minimum QA tooling, then begin the Marketplace Sprint immediately.
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

## Owner direction — design hardening

The owner explicitly wants the product to move quickly from functional/minimal to polished, professional, valuable, and distinctive, with the Marketplace receiving the highest design priority.

The owner authorized setting up three capability streams before the large Marketplace redesign:

1. GitHub Copilot/repo-native build + design capability;
2. ChatGPT product/operator capability;
3. shared design + deterministic QA tooling.

The owner prefers visible product progress over design-process overhead. Figma must not block implementation.

## Stream 1 work on `ops/stream1-copilot-design-tooling`

Implemented so far:

- updated `AGENTS.md` from Phase-2 execution rules to design-hardening/release-readiness rules;
- updated `.github/copilot-instructions.md` for the current post-Phase-2 state;
- strengthened `.github/instructions/frontend.instructions.md` with design-hardening/Marketplace rules;
- added `docs/AI-TOOLING-AND-DESIGN-ROADMAP.md`;
- added `docs/COPILOT-LOCAL-SETUP.md`;
- added custom agents:
  - Marketplace Product Designer;
  - Frontend Design-System Engineer;
  - UX + Accessibility QA;
  - Product Critic;
- added project skills:
  - `shelterpawtners-brand-system`;
  - `marketplace-ux-design`;
  - `marketplace-value-merchandising`;
  - `responsive-visual-qa`;
  - `release-readiness-review`;
- added `.github/copilot/settings.json` enabling the official `vercel/vercel-plugin` declaratively for supported repository/cloud Copilot contexts;
- documented current official local setup paths for Vercel, Supabase Agent Skills, and Chrome DevTools.

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

1. Run deterministic CI/format validation on this Stream 1 branch.
2. Correct any configuration/formatting defects without weakening checks.
3. Open a bounded PR to `main` describing Stream 1 capability setup.
4. Merge only with explicit owner authority and green checks.
5. After merge, move immediately to Stream 2 ChatGPT capability setup, then Stream 3 minimum QA setup.
6. Begin Marketplace Sprint immediately after those minimum setups; do not postpone it for Figma or Storybook.
