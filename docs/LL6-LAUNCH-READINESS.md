# LL-6 Launch Readiness

Status: pre-cutover preparation
Issue: #46

## Purpose

This document is the final Lost Lands MVP release checklist. It prepares the production launch without performing the protected `shelterpawtners.com` web-domain DNS/custom-domain cutover.

## Integrated MVP acceptance

The final candidate must preserve all previously accepted slices:

- LL-1 Guardian Digital Pet Passport vertical slice.
- LL-2 premium Marketplace and offer experience.
- LL-3 shelter adoption-verification golden path.
- LL-4 production Auth/email readiness, Google preservation path, confirmation/recovery templates, and exact redirect contract.
- LL-5 truthful Meta social-auth capability: Facebook general sign-in path, no misleading universal Instagram login.

Required repository gates on the exact release candidate head:

- [ ] CI
- [ ] Database QA
- [ ] Persona QA
- [ ] Hosted QA
- [ ] Dependency Review
- [ ] Merge Gate

Do not merge a final acceptance PR with a failed, cancelled, stale, or head-mismatched required run.

Recent post-MVP launch slices (#59 Marketplace density, #60 LostPaws, #62 RAVE vendor acquisition, #63/#64 Support OS runbooks and #65 legal-owner review checklist) were each merged only after their required repository gates were green.

## Browser/mobile/accessibility acceptance

Validate the active hosted candidate at minimum on:

- [ ] desktop Chromium golden paths;
- [ ] mobile-width Chromium for login/onboarding, Passport, Marketplace and shelter verification;
- [ ] keyboard navigation for primary flows;
- [ ] no serious/critical automated accessibility violations in the Hosted QA audit;
- [ ] no uncaught console errors on the golden paths;
- [ ] no horizontal overflow or inaccessible primary CTA at mobile width.

Where Safari/Firefox device/browser execution is unavailable to the current automation surface, record that explicitly as a manual acceptance item rather than claiming coverage.

## Production Auth/provider prerequisites

Before production web cutover, complete the external-console checklist from `docs/LL4-AUTH-EMAIL-READINESS.md`:

- [x] Resend free-tier sending domain `auth.shelterpawtners.com` verified.
- [x] Only Resend-provided subdomain DNS records added; Microsoft 365 apex mail DNS intentionally unchanged.
- [x] Supabase custom SMTP configured with `ShelterPawtners <noreply@auth.shelterpawtners.com>`.
- [x] Email confirmation enabled and verified in hosted Auth settings.
- [x] Real external Guardian signup confirmation delivered through Supabase/Resend and returned to the expected Pet Basics flow.
- [x] Supabase Site URL and production redirect allowlist narrowed to the approved Vercel origin and exact pre-cutover routes; localhost development allowance remains intentionally separate.
- [ ] Execute real password-recovery acceptance: delivery, `/reset-password`, password update, new-password sign-in, invalid/expired/reused-link behavior.
- [ ] Verify Microsoft 365 human mailbox send/receive remains normal after transactional-email subdomain DNS additions.
- [ ] Google provider configured and live-tested if credentials/provider-console access are available.
- [ ] Facebook provider configured and live-tested if credentials/provider-console access are available.
- [ ] `VITE_GOOGLE_AUTH_ENABLED` / `VITE_FACEBOOK_AUTH_ENABLED` enabled only where the corresponding provider is actually configured.
- [ ] Existing account login does not create duplicate app profiles/organizations; verify persona continuity across enabled email/OAuth paths.

Leaked-password protection remains a post-MVP candidate while it requires a paid Supabase tier; do not upgrade solely to enable it.

## Security/data checks

- [ ] No API keys, SMTP passwords, OAuth secrets, service-role keys, test passwords or customer PII committed.
- [ ] Existing private audit/token tables remain intentionally inaccessible through RLS where designed.
- [ ] SECURITY DEFINER RPCs are changed only after function-specific contract review; no blanket revocation/conversion.
- [ ] No destructive production migration is part of the cutover.
- [ ] RLS and regression assertions remain at least as strong as previously accepted.

## Support readiness

Support OS foundation is live in shared dev and repository policy/runbooks are now present for:

- [x] support operating model;
- [x] severity/triage policy;
- [x] AI support guardrails;
- [x] sanitized bug/reproduction -> engineering handoff;
- [x] human escalation;
- [x] notification policy;
- [x] persona playbooks;
- [x] Auth/account support;
- [x] adoption-verification support;
- [x] Marketplace/redemption support.

Remaining MVP support implementation:

- [ ] authenticated `Help & feedback` entry;
- [ ] categorized intake and safe context persistence against live Support OS tables;
- [ ] user acknowledgement/reference/status UI;
- [ ] bounded triage/deduplication/digest plumbing;
- [ ] targeted RLS/submission/classification regression coverage.

Raw support content/PII must never auto-mirror to GitHub.

## Legal owner-review gate

Repository drafts may be prepared for review, but they are not approved legal documents and must not be presented as final Terms or Privacy Notice until the owner reviews/approves them.

- [x] Owner/legal review checklist prepared at `docs/legal/OWNER-LEGAL-REVIEW-CHECKLIST.md`.
- [ ] `docs/legal/DRAFT-TERMS-OF-SERVICE.md` reviewed by owner/legal counsel as appropriate.
- [ ] `docs/legal/DRAFT-PRIVACY-NOTICE.md` reviewed by owner/legal counsel as appropriate.
- [ ] Legal entity/contact, launch geography/age, retention/deletion, actual provider inventory and privacy-rights operations approved.
- [ ] OD-003/OD-004-dependent language remains absent or is updated only after those protected decisions are made.
- [ ] Owner explicitly approves publication of final legal documents.

## LostPaws / RAVE campaign readiness

- [x] `/lostpaws` implementation merged via PR #60 with exact owner-supplied local banner, deterministic QR, clear RAVE/Guardian/vendor paths and explicit Lost Lands/Excision non-affiliation.
- [x] `/rave-vendors` implementation merged via PR #62 with existing RAVE assets, direct vendor onboarding CTA, truthful expectations and explicit non-affiliation.
- [ ] Re-run hosted desktop/mobile visual acceptance after Vercel free-tier deployment capacity resets.
- [ ] Final `https://shelterpawtners.com/lostpaws` domain routing remains part of the separately owner-gated production web cutover.

## Main-domain pre-cutover checklist

Prepare these items but do **not** perform the final production domain/DNS/custom-domain change without separate owner authorization.

1. Confirm the exact production deployment SHA and hosted URL.
2. Confirm the deployment is green on all required repository gates.
3. Confirm production environment variables point to the intended Supabase project and contain no preview-only values.
4. Confirm exact auth redirect paths are configured for the production domain.
5. Confirm transactional confirmation/recovery emails and configured social-provider callbacks work from safe test accounts.
6. Capture the current `shelterpawtners.com` DNS/custom-domain state needed for rollback.
7. Confirm Vercel/custom-domain ownership and certificate readiness without changing apex/web routing.
8. Confirm the prior public site remains recoverable until the new deployment is accepted.
9. Prepare a post-cutover smoke checklist: home, register/login, Guardian onboarding, Passport, Marketplace, shelter verification response page, password recovery and configured social login.
10. Stop here and obtain the separately required authorization for the final web-domain cutover.

## Current hosted/repository evidence — 2026-09-11

- PR #60 LostPaws head `8a27e4911d5e7b92265a6acc3a2422afbaf0b95b` passed all six required gates; its Vercel preview was READY and `/lostpaws` returned HTTP 200 before merge. It squash-merged to `main` at `d67d6b072ef258e64aa166edfdf16592d078ba75`.
- PR #62 RAVE vendor acquisition passed all six required repository gates and squash-merged at `84a9786f5a25716b053614b3729a765a374f0baf`.
- Subsequent Vercel preview creation hit the Hobby/free-tier daily deployment limit (`api-deployments-free-per-day`, more than 100). Do not purchase/upgrade solely to clear this limit. Repository engineering/QA may continue while capacity resets.
- Support runbook PRs #63 and #64 and legal-review checklist PR #65 also passed required repository gates before merge.
- `docs/AI-HANDOFF.md` is the current operational source for the latest integrated repository head and exact next safe action.

## Rollback plan

If the eventual authorized cutover fails acceptance:

1. restore the prior web-domain routing/custom-domain target using the pre-cutover values captured immediately before change;
2. do not roll back Microsoft 365 mail DNS because it is outside this web cutover;
3. leave database migrations in place unless a separately reviewed reversible migration plan exists — never improvise destructive production rollback;
4. disable newly exposed OAuth feature flags if their provider path is failing while preserving email/password login;
5. verify the previous public site and authentication entry points are reachable;
6. document the failure and exact release SHA before attempting another cutover.

## Protected stop point

LL-6 can be marked engineering-ready after the final candidate is green and the checklist/external prerequisites are documented. It must stop before the final `shelterpawtners.com` production web-domain DNS/custom-domain change unless the owner separately authorizes that exact action.
