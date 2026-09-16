# ShelterPawtners AI Controller

This is the compact human control-plane document for Codex Work, Claude Code,
Copilot/VS Code, and the ChatGPT advisor.

## Current authority

1. Current GitHub `main` is implemented repository truth.
2. `AGENTS.md` is the universal startup contract.
3. This controller is the live human status, blocker, and next-action authority.
4. The active GitHub Issue/PR supplies task scope and acceptance.
5. `docs/engineering/AI-RELEASE-STATE.md` is the machine-readable workflow
   contract. `docs/AI-HANDOFF.md` is its field-compatible inbound adapter.

Use `docs/engineering/AGENT-OPERATIONS.md` for detailed operating rules. Do
not treat dated prompts or archived material under `docs/archive/**` as live
status.

## Active issue

**#283 — Launch P1 (User CRUD, Human/RAVE simple mode, media uploads).** P1-A Events/Offers CRUD (#287), P1-B/C Human/RAVE simple mode + Lost Lands default (#288), P1-D real image uploads for Events/Offers (#291, plus test-only follow-up #292), and migration `20260916070000` (event-offer-media storage + `image_path` columns) are merged and confirmed applied to hosted. Owner UAT then found the real hosted vendor offer stuck at `channel=pet`/no event/no image because `revise_partner_offer` silently dropped channel changes and photo uploads only attached on a later manual Save; fixed in #294 (also fixes a broken `\\.`-in-a-plain-string regex bug found while verifying `set_partner_offer_image_path`), merged to `main`. Remaining: apply migration `20260916090000_issue_283_offer_persistence_recovery.sql` to hosted — blocked on the same missing `SUPABASE_ACCESS_TOKEN`/linked project gap as before; needs the owner or credential-holder to run `bash scripts/supabase-cli.sh db push`, then run the hosted acceptance chain (upload photo -> select Lost Lands -> save/reload -> publish -> confirm on RAVE Marketplace + Lost Lands event surface) and report PASS/FAIL on #283. A narrow CRUD-completeness audit found two backlog-worthy gaps (pets/passports have no delete/archive path; store/swag requests can't be viewed/cancelled by their own requester) — detail on #283 and cross-referenced on #252, not launch-blocking. Do not duplicate the detailed plan here.

**#273 — Launch Stabilization (Vendor Account, Event Offers, LostPaws Messaging & Swag Requests).** P0-A returning business lifecycle (#275), P0-B Event→Offer republish clarity/regression (#277), Swag catalog requestability with signed-in autofill (#280), and LostPaws vendor messaging (#285) are merged and verified. The only remaining work is the final hosted chain on Issue #273; do not duplicate the detailed plan here.

## Current status

- The **AI-first documentation and operations migration is complete**
  (2026-09-14, PRs #172-#175 approximately — see the merge commits on
  `main` for exact SHAs). `docs/` root now holds only `README.md`,
  `AI-CONTROLLER.md`, `AI-HANDOFF.md`, and `DECISIONS.md`; every other
  document moved into a domain subtree (`engineering/`, `product/`,
  `security/`, `data/`, `design/`, alongside the existing `legal/` and
  `support/`) or `docs/archive/2026-mvp/**`. `docs/engineering/state/release-state.yaml`
  is now the single writable release-state authority;
  `docs/engineering/AI-RELEASE-STATE.md` and this file's own sibling
  `docs/AI-HANDOFF.md` are generated from it and drift-checked in CI
  (`scripts/check-doc-authority-drift.sh`, `scripts/release-state.mjs check`).
  A confirmed classifier bug (authority-chain file edits silently skipping
  web CI) is fixed and regression-tested. See
  `docs/archive/2026-mvp/retired-plans/DOCUMENTATION-MIGRATION-MATRIX.md`
  and `docs/archive/2026-mvp/retired-plans/REPOSITORY-INFORMATION-ARCHITECTURE-PLAN.md`
  for the full historical audit trail and planning record behind this
  migration; both are archived now that the migration they scoped is done.
- Issue #136 and Issue #107 (repository normalization, branch-protection
  hardening) are **complete**, historically superseded by the migration
  above for anything documentation-shaped. 18 stale branches were deleted
  in #107; 11 branches with closed-but-unmerged PRs remain, per
  `docs/archive/2026-mvp/checkpoints/BRANCH-CLEANUP-2026-09-11.md`'s own
  "kept for your review" judgment call — not touched, and should not be
  deleted without a content review first.
- Current product work already merged on `main` includes Store MVP, navigation
  and UX polish, event attendance/event-scoped offers, rich vendor media and
  external-commerce links, and database-backed Swag requestability with
  signed-in requester autofill (#280). Do not reopen accepted behavior without
  regression evidence.
- Owner-approved legal policy decisions are merged. Draft/reconciliation work
  may continue; final legal publication remains owner/legal-gated.
- Meta/Facebook remains intentionally deferred. Keep Facebook disabled and do
  not spend work cycles on Meta.
- Google OAuth is accepted; do not repeat OAuth acceptance unless auth changes.
- Documentation-only commits do not justify Vercel inspection. For a
  product-affecting pending deployment, inspect Vercel at most once; do not poll
  or force deployment.

## Remaining closeout actions

Repo-side documentation/operations normalization is complete. What remains is
intentionally non-blocking or owner-gated, not implementation work:

1. #10's native GitHub-event → Work webhook gap, #12's dashboard re-scope,
   and #48/#54's backlog items remain open by design — see their own triage
   comments.
2. #119 (Meta/final legal publication) remains owner/legal-gated.
3. **OD-005** in `docs/DECISIONS.md`: the ShelterPawtners legal-entity/LLC
   formation question is still genuinely unresolved in the real world —
   confirm with the owner before any product surface asserts it as complete.
4. `docs/engineering/TECHNICAL-DEBT.md` records the known frontend-bundle
   and dead-legal-scaffolding debt found during the migration; neither
   blocks anything, both are tracked there rather than in a dated status
   narrative.
5. **Recommended freeze SHA: the merge commit that lands the last of the
   AI-first migration PRs.** `npm run check` (lint/typecheck/release-state
   check/50 unit tests) and `npm run build` both pass on every migration
   branch prior to merge.

## Boundaries

Do not change production DNS, secrets, RLS, production data, payments, paid
services, Meta/Facebook enablement, or final legal publication without explicit
owner authority. If provider authentication is unavailable, do not spin: record
the exact pending action and continue independent safe work.
