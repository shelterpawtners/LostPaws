# AI Handoff

STATUS: EXTERNAL_LAUNCH_GATE_WITH_ACTIVE_GUARDIAN_UX_WORK
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Guardian launch UX + password-recovery/provider acceptance
NEXT_CHECKPOINT: Google OAuth, Facebook auth, integrated browser/mobile acceptance, owner legal review, cutover prep
OWNER_DECISION_REQUIRED: YES_FOR_PROVIDER_CONSOLES_AND_FINAL_CUTOVER_ONLY
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: 3c3e570f72999a64451bc684d4567de7d539a34d
ACCEPTANCE_RUNTIME: REPOSITORY_GATES_GREEN; VERCEL_DAILY_FREE_TIER_LIMIT_FOR_NEW_DEPLOYS

## Completed engineering

LL-1 through LL-6 remain accepted. Do not reopen them without regression evidence.

- Issue #49 / PR #50 — multi-photo Pet Passport + Guardian activity timeline — complete and merged.
- Issue #51 / PR #52 — Guardian Deal Moments — complete and merged.
- PR #57 — MVP Support OS foundation and guardrails — all six required gates green and merged; support migration `20260911002000_mvp_support_os_foundation.sql` is live in shared dev.
- Issue #53 Marketplace density slice — PR #59 merged to `main` at `50f328f0d50f30b3bd78dc70064a094dea451da7` after all six required gates passed.
- Issue #58 LostPaws campaign landing page — PR #60 passed CI, Hosted QA, Database QA, Persona QA, Dependency Review and Merge Gate, then squash-merged to `main` at `d67d6b072ef258e64aa166edfdf16592d078ba75`.
  - Exact owner-supplied LostPaws banner is stored at `public/brand/lostpaws-hero-16x9.png` and referenced locally by `/lostpaws`.
  - The prior binary-ingestion blocker is resolved. Do not recreate, compress, resize or generatively alter the locked artwork.
  - Hosted PR preview returned HTTP 200 and rendered the expected RAVE Shelter / raver / vendor / Pet Passport CTA structure before merge.
- Issue #54 RAVE Shelter vendor acquisition page — stacked PR #61 became non-mergeable after PR #60 was squash-merged, so it was closed without force/history rewrite. Clean PR #62 was rebuilt from current `main`, passed all six required repository gates, and squash-merged to `main` at `84a9786f5a25716b053614b3729a765a374f0baf`.
  - `/rave-vendors` is a standalone fast-conversion vendor page using existing RAVE brand assets, existing `rave_vendor` onboarding, truthful participation language and explicit non-affiliation wording.
- Issue #56 Support OS operating documentation is substantially complete:
  - PR #63 added AI support guardrails, sanitized bug/reproduction engineering handoff, human escalation and notification policy; all six required gates green; merged at `611462653f1b9a3287d24b908bf477d302a59a31`.
  - PR #64 added persona playbooks plus Auth/account, adoption-verification and Marketplace/redemption runbooks; all six required gates green; merged at `1751ddc401f1a4a723746a8b612b9eb408fe65c3`.
  - PR #66 added the first real authenticated Guardian `Help & feedback` intake/status UI against the live Support OS tables; all six required gates green on final head `a55ae09d7cb3f87715fa7e3050e892b7723156ce`; squash-merged to `main` at `3c3e570f72999a64451bc684d4567de7d539a34d`.
    - Guardian profile now exposes a secondary Support entry point.
    - Intake uses the approved categories and captures only bounded safe context: route, Guardian persona, device class and browser family.
    - Existing RLS/defaults prevent reporter-side severity/admin overrides; users receive a generated reference code and can see recent own-ticket status.
    - No screenshot/upload, raw GitHub mirroring, schema change, paid support SaaS or destructive automation was added.
    - A temporary no-secret format probe was used only to obtain exact Prettier output and was removed before final-head acceptance.
- Launch legal-review preparation — PR #65 added `docs/legal/OWNER-LEGAL-REVIEW-CHECKLIST.md`; all six required gates green; merged at `ea9767d7f92986122f822365519bd4e13d7b2ab5`. Draft Terms/Privacy remain unapproved and must not be published as final.
- `docs/LL6-LAUNCH-READINESS.md` was reconciled on `main` at `d22d43cd295db75cb44e5f5020a8d885d0108dfd` so completed Auth/campaign/support work is no longer shown as pending.
- Work handoff for the bounded Guardian pet-contact correction is committed at `docs/prompts/ISSUE-53-GUARDIAN-PET-CONTACT-WORK.md` (`0f59396ebd1cec9babf9609a4ee8b4417a4c2d6a`).

## Auth/email progress complete

Owner completed the following hosted prerequisites on 2026-09-10:

1. Resend free-tier setup complete.
2. `auth.shelterpawtners.com` verified with transactional-email-only DNS records.
3. Microsoft 365 inbound/human mail DNS intentionally left unchanged.
4. Supabase custom SMTP enabled with `ShelterPawtners <noreply@auth.shelterpawtners.com>`.
5. Supabase Site URL changed to `https://lost-paws-one.vercel.app`.
6. Production Vercel redirect wildcard replaced by exact pre-cutover routes; localhost wildcard remains only for development.
7. Hosted Auth visually verified: signup, Confirm Email and Email provider enabled.
8. Real Guardian signup delivered external confirmation email through Supabase/Resend.
9. Confirmation link returned the Guardian to expected Pet Basics/onboarding.

Do not reopen Resend/domain/SMTP/Guardian-confirmation work unless regression evidence appears.

## Remaining external launch gate

1. Execute real password-recovery acceptance: delivery, `/reset-password`, update, new-password sign-in, invalid/expired/reused-link behavior.
2. Verify Microsoft 365 human mailbox send/receive still behaves normally after transactional-email DNS additions. A connected Outlook search on 2026-09-11 found no relevant recent messages, which is not evidence of failure; this acceptance remains unverified until a real send/receive check is available.
3. Configure/live-test Google OAuth when provider-console credentials/access are available.
4. Configure/live-test supported Facebook Login when Meta console access is available.
5. Verify OAuth/email flows do not create duplicate profiles/organizations and preserve persona continuity.
6. Re-run integrated desktop/mobile/browser acceptance on the final configured release.
7. Present draft Terms/Privacy plus the owner-review checklist for owner/legal review; do not publish as final without approval.
8. Prepare but do not perform final `shelterpawtners.com` web-domain DNS/custom-domain cutover without separate authorization.

## Issue #53 — active launch UX polish

Owner direction remains hybrid consumer/dashboard leaning consumer-app, no Figma prerequisite.

Completed:

- Marketplace density/grid-list presentation via PR #59.
- Reusable Support intake/status component plus secondary Guardian-profile Help & feedback entry via PR #66. Future avatar/user-menu work should reuse this component rather than duplicate intake logic.

Active order:

1. Remove misleading Guardian pet `Contact email` / `Instagram profile` fields; `save_guardian_onboarding_pet` persists neither and communications belong to the responsible Guardian/Shelter contact.
2. Compact Guardian shell + avatar/account menu; surface the existing `HelpFeedback` component as the primary user-menu Support entry.
3. Photo-forward Guardian dashboard / Pet Passport density.

A GitHub Copilot cloud-agent assignment was correctly attempted for the bounded pet-contact-field task on 2026-09-11. GitHub rejected the session because the separate GitHub AI Credits pool has insufficient credits. The Copilot assignee was removed so the issue does not appear actively delegated. Do not repeatedly retry GitHub coding agents until that GitHub AI-credit budget changes.

This GitHub AI-credit blocker does not imply the owner's ChatGPT Work usage is exhausted. The repo-native Work handoff is ready at `docs/prompts/ISSUE-53-GUARDIAN-PET-CONTACT-WORK.md`. When ChatGPT Work is available in an interactive session, use it for this bounded UI/code/test slice from current `main`, then review the resulting PR and merge only after required gates are green.

Known code finding: `StandardOnboard` in `src/main.tsx` renders generic `Contact email` and `Instagram profile` fields for Guardian onboarding, while the Guardian `save_guardian_onboarding_pet` RPC path does not submit those fields. Shelter organization onboarding does persist its contact/social fields. Treat the Guardian fix as a presentation correction only; do not invent a pet-contact schema or guardianship model.

## LostPaws / RAVE Shelter campaign work

Issue #58 repository implementation is integrated. The canonical planned public QR destination remains `https://shelterpawtners.com/lostpaws`; final custom-domain/DNS cutover remains owner-gated.

Locked direction remains:

- exact owner artwork; no generative redraw or alteration;
- no normal ShelterPawtners global header/navigation on `/lostpaws`;
- premium dark/festival-aware pacing without copying Lost Lands assets/layout/code or implying official collaboration;
- RAVE Shelter — Rescue and Adoption Vendor Ecosystem — immediately after the banner;
- clear raver, vendor and Guardian/Pet Passport paths;
- explicit Lost Lands/Excision non-affiliation wording.

Issue #54 vendor acquisition implementation is integrated via PR #62. Lightweight stories/announcements remains roadmap work and must not add a paid/full CMS MVP dependency.

## Support OS

Issue #56 remains open for remaining automation/primary-shell integration. Foundation is live in shared dev:

- `support_tickets`, `support_ticket_messages`, `support_ticket_events`;
- reporter-owned ticket creation/read boundaries;
- reporter-visible append-only messages;
- privileged internal event/admin triage;
- raw support content/PII must never auto-mirror to GitHub.

Version-controlled MVP support policy/runbooks cover:

- operating model;
- severity/triage;
- AI support guardrails;
- sanitized bug/reproduction -> engineering handoff;
- human escalation;
- notification policy;
- persona playbooks;
- Auth/account recovery support;
- adoption verification support;
- Marketplace/redemption support.

Completed Support UI via PR #66:

- authenticated Guardian secondary `Help & feedback` entry;
- categorized ticket creation against live `support_tickets`;
- safe automatic context persistence;
- generated acknowledgement/reference;
- recent own-ticket status display.

Remaining Issue #56 implementation focus:

1. primary avatar/user-menu entry by reusing the existing `HelpFeedback` component during Issue #53 shell work;
2. bounded triage/deduplication/daily-digest plumbing;
3. targeted classification/digest automation regression coverage;
4. optional screenshot/storage support only in a later bounded slice when privacy/storage controls are explicitly ready.

## Legal review readiness

- Draft Terms: `docs/legal/DRAFT-TERMS-OF-SERVICE.md` — owner/legal review required; not approved for publication.
- Draft Privacy: `docs/legal/DRAFT-PRIVACY-NOTICE.md` — owner/legal review required; not approved for publication.
- Owner/legal decision checklist: `docs/legal/OWNER-LEGAL-REVIEW-CHECKLIST.md` — prepared and merged.

Do not decide legal entity/contact identity, minimum age, governing law, arbitration/class-action approach, retention/deletion policy, jurisdictional privacy obligations, OD-003 or OD-004 through automation.

## Connected tooling recheck — 2026-09-11

- GitHub: connected and authoritative for repository mutations and CI inspection. GitHub cloud coding-agent launch is currently blocked by insufficient GitHub AI Credits; normal GitHub repository/Actions operations remain available.
- Vercel: connected. PR #60 obtained a READY hosted preview and `/lostpaws` returned HTTP 200. Subsequent preview creation hit the Hobby/free-tier daily deployment limit (`api-deployments-free-per-day`, more than 100). Do not purchase/upgrade. Treat this as a transient external deployment blocker only; continue independent engineering and repository QA.
- Supabase: connected for database/documentation capabilities available in the current surface; hosted Auth provider-console writes are not exposed by the available connector actions.
- Plugin/provider recheck returned no installable/actionable Google OAuth, Meta/Facebook, DNS or Resend provider-console plugin in the current environment.
- Google OAuth and Meta/Facebook live configuration therefore still require authorized provider-console access/credentials.
- Connected Outlook search can inspect mail but did not produce sufficient evidence to close the Microsoft 365 send/receive acceptance gate.
- Browser automation available to an interactive ChatGPT Work session remains the preferred surface for provider-console flows, real password-recovery acceptance, visual QA and high-leverage multi-step UI work. The current automation runtime does not expose a browser executable suitable for those console flows.
- Figma remains unnecessary by owner direction.

## Protected restrictions

Never purchase/upgrade paid services, make destructive production-data changes, alter Microsoft 365 mail DNS, decide OD-003 or OD-004, weaken tests/RLS, publish unapproved final Terms/Privacy, expose secrets, or perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate owner authorization.

## Next safe action

1. Execute the Issue #53 Guardian pet-contact-field correction through ChatGPT Work when an interactive Work session is available, using `docs/prompts/ISSUE-53-GUARDIAN-PET-CONTACT-WORK.md`; review and merge only after required gates are green.
2. Continue with the compact Guardian avatar/account-menu shell and reuse the merged `HelpFeedback` component for the primary Support entry.
3. Continue Issue #56 with bounded triage/deduplication/daily-digest plumbing that does not expose raw user PII to GitHub or authorize destructive changes.
4. Re-check Vercel availability each run; after free-tier capacity resets, perform hosted desktop/mobile visual acceptance for `/lostpaws`, `/rave-vendors` and final app golden paths without purchasing an upgrade.
5. Re-check password-recovery/Google/Meta provider tooling each run and act immediately if an authorized prerequisite becomes actionable.
6. Present legal drafts/checklist for owner review at the appropriate launch-review point; keep final publication owner-gated.
7. Keep final production-domain cutover separately owner-gated.
