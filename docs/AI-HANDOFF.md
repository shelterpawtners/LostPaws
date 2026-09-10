# AI Handoff

STATUS: BLOCKED
CURRENT_PHASE: Phase 3 — Lost Lands MVP engineering complete
CURRENT_CHECKPOINT: Post-LL-6 external provider acceptance / owner-gated production cutover
NEXT_CHECKPOINT: Complete external provider setup/acceptance, then perform final production cutover only with separate owner authorization
OWNER_DECISION_REQUIRED: YES
SAFE_TO_CONTINUE: NO
ACCEPTED_CODE_SHA: 0bee999152e4bc84b910dfeccf7a11074a14445b
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: MAIN

## Completed Lost Lands MVP slices

- LL-1 Guardian Digital Pet Passport merged via PR #37.
- LL-2 Premium Marketplace merged via PR #42.
- LL-3 Shelter adoption verification merged via PR #43 after full required acceptance.
- LL-4 provider-independent production Auth/email readiness merged via PR #44 after CI, Hosted QA, Database QA, Persona QA, Dependency Review, and Merge Gate passed.
- LL-5 Meta social-auth capability prep merged via PR #45 after the same required acceptance stack passed. Facebook is the truthful general Meta sign-in path; universal consumer Instagram login is not advertised.
- LL-6 final regression/launch-readiness preparation merged via PR #47 at `0bee999152e4bc84b910dfeccf7a11074a14445b` after CI, Hosted QA, Database QA, Persona QA, Dependency Review, and Merge Gate were all green on the exact PR head.

## Launch-readiness artifacts

- `docs/LL4-AUTH-EMAIL-READINESS.md` — production Auth/email/provider setup and live acceptance contract.
- `docs/LL6-LAUNCH-READINESS.md` — integrated regression, browser/mobile/accessibility, security, provider prerequisites, main-domain pre-cutover, and rollback checklist.
- `docs/legal/DRAFT-TERMS-OF-SERVICE.md` — owner/legal-review draft only; not approved for publication.
- `docs/legal/DRAFT-PRIVACY-NOTICE.md` — owner/legal-review draft only; not approved for publication.

## Exact external blocker

The remaining work requires provider-console/browser access that is not exposed by the current connected tools:

1. Create/sign into the Resend free-tier account and verify `auth.shelterpawtners.com` using only Resend-provided subdomain DNS records; do not alter Microsoft 365 apex mail DNS.
2. Generate Resend SMTP credentials and configure Supabase Auth custom SMTP for `no-reply@auth.shelterpawtners.com`.
3. Configure the hosted Supabase Auth Site URL and exact redirect allowlist; enable/test confirmation and recovery templates.
4. Configure Google OAuth credentials/provider and run live persona/duplicate-prevention acceptance if credentials are available.
5. Configure Meta/Facebook app credentials/provider and run live Facebook sign-in acceptance. Do not add a misleading universal Instagram-login path.
6. Perform safe external inbox signup/confirmation/recovery click-through tests.
7. Review/approve the draft Terms and Privacy Notice before any final publication.
8. Separately authorize the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover after the above acceptance is complete.

Leaked-password protection remains a post-MVP candidate while it requires a paid Supabase tier; the MVP guardrail prohibits purchasing/upgrading solely for it.

## Protected stop

No independent repository engineering task remains in the agreed LL-1 through LL-6 launch order. Do not perform the final production web-domain DNS/custom-domain cutover, publish the legal drafts as final, make OD-003/OD-004 decisions, purchase paid services, make destructive production-data changes, or alter Microsoft 365 mail DNS without the separately required owner action/authorization.
