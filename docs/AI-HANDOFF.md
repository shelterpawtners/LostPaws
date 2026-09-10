# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Lost Lands MVP launch readiness + owner-requested launch UX polish
CURRENT_CHECKPOINT: Issue #53 bounded Marketplace density slice / PR #55 acceptance
NEXT_CHECKPOINT: Merge PR #55 when green, then continue Issue #53 Guardian dashboard + Pet Passport profile hierarchy while external Google/Facebook acceptance remains blocked
OWNER_DECISION_REQUIRED: YES_FOR_PROVIDER_CONSOLES_LEGAL_AND_FINAL_CUTOVER_ONLY
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: fae7a4cf7a24117868558f7cc4b65987e6e40928
ACCEPTANCE_DEPLOYED_SHA: fae7a4cf7a24117868558f7cc4b65987e6e40928
ACCEPTANCE_RUNTIME: VERCEL_PRODUCTION
ACTIVE_ISSUE: 53
ACTIVE_PR: 55
ACTIVE_BRANCH: launch/ux-polish-53

## Completed Lost Lands engineering

LL-1 through LL-6 remain accepted. Do not reopen them without evidence of a regression.

Issue #49 / PR #50 — multi-photo Pet Passport + Guardian activity timeline — is complete and merged.

Issue #51 / PR #52 — Guardian Deal Moments — is complete and merged to `main` at `fae7a4cf7a24117868558f7cc4b65987e6e40928`. Deal Moment media remains outside the five-photo Passport cap and private to the owning Guardian under the accepted RLS/storage contract.

## Live hosted Auth acceptance now evidenced

Owner completed the hosted Auth URL and first real-account email-confirmation path successfully on 2026-09-10:

1. Hosted Supabase Site URL changed from localhost to `https://lost-paws-one.vercel.app` for pre-cutover acceptance.
2. Redirect allowlist was narrowed to exact hosted onboarding/reset paths plus the local-development wildcard; the broad production Vercel wildcard was removed.
3. Email provider is enabled.
4. New-user signup is enabled.
5. Confirm email is enabled.
6. Minimum password length was identified for tightening from 6 to the repository contract of at least 8 characters; verify saved hosted value before final public launch acceptance.
7. A real Guardian signup produced an external confirmation email through Supabase Auth -> Resend using the verified `auth.shelterpawtners.com` sending setup.
8. The confirmation link worked and returned the Guardian to the expected Pet Basics/onboarding flow.

This is evidence that the core signup -> transactional email -> confirmation -> persona onboarding route works. Do not repeat Resend/domain setup absent a regression.

Still required for LL-4/LL-6 external acceptance:

- verify hosted minimum password length is saved at 8+;
- password-recovery external inbox/click-through acceptance;
- invalid/expired recovery behavior against a real external link;
- mobile email/link rendering check;
- verify Microsoft 365 human mailbox behavior remains unaffected;
- Google OAuth live provider setup and persona-continuity acceptance when Google console access is available;
- Facebook Login live provider setup and persona-continuity acceptance when Meta console access is available;
- duplicate profile/organization checks after OAuth acceptance.

## Transactional email state

The Resend prerequisite is materially complete:

- free-tier Resend setup complete;
- `auth.shelterpawtners.com` sending domain verified;
- required DKIM/sending DNS records verified;
- Resend Receiving remains disabled;
- Microsoft 365 apex mail DNS was not intentionally changed;
- hosted Supabase custom SMTP enabled using `ShelterPawtners <noreply@auth.shelterpawtners.com>`;
- secrets remain outside the repository.

## Active owner-requested UX work — Issue #53

Owner's live acceptance review found the core flows functional but identified launch-quality UX improvements:

- Marketplace cards are too large and sparse for the primary acquisition/value surface;
- Marketplace should support denser scanability and practical Grid/List views;
- Guardian dashboard is too text-heavy/long and should surface key pet/profile/value/next-action information above the fold;
- photos should be first-class on Guardian and Pet Passport surfaces;
- Guardian area should use horizontal navigation separating human Guardian Profile from Pet Passport Profiles;
- ordinary Guardian dashboard real estate should not be consumed by role-management controls;
- the pet onboarding concept must not imply that a pet owns an email address; communications should resolve through the responsible Guardian/Shelter relationship using the existing approved identity model rather than inventing a new guardianship model.

PR #55 is the first bounded Issue #53 implementation slice. It adds accessible Grid/List Marketplace controls, increases default grid density, and adds a responsive compact list mode without changing offer truth, source/eligibility logic, claim/redemption mechanics, database schema, OD-003, or OD-004.

PR #55 acceptance workflows were running at handoff. Merge only when required checks are green. Then continue the Guardian/Pet UI hierarchy in a separate bounded slice rather than expanding PR #55 indefinitely.

## RAVE/content roadmap

Issue #54 records the owner-requested RAVE Shelter Lost Lands hub and lightweight stories/announcements capability. Keep it planned, but do not let a full CMS delay launch-critical Auth/UX work. Prefer existing repository/Supabase infrastructure before introducing paid CMS dependencies.

## Current hosted/runtime health

Vercel project `lost-paws` remains on the Hobby/free plan. Runtime-error inspection on 2026-09-10 found no production runtime errors in the latest 24-hour window.

Supabase project `shelterpawtners-dev` remains `ACTIVE_HEALTHY`.

Latest security-advisor recheck found no evidence-backed new schema regression. Existing notices remain:

- two intentionally locked private RLS/no-policy INFO notices (`private.audit_events`, `private.secure_tokens`);
- four anonymous SECURITY DEFINER warnings for the intentionally public discovery RPC surface;
- authenticated SECURITY DEFINER application RPC warnings that require function-by-function intent review rather than blanket revocation;
- leaked-password protection disabled (paid-plan limitation under the no-paid-upgrade guardrail).

Do not weaken RLS or blanket-change SECURITY DEFINER grants merely to silence advisor warnings.

## Connected tooling recheck

Rechecked this run:

- GitHub: connected and authoritative; read/write/PR actions available.
- Vercel: connected; project/deployment/runtime inspection available.
- Supabase: connected for project/database/migration/functions/advisors, but current actions still do not expose hosted Auth Site URL/provider-console writes.
- Plugin discovery found no installable Resend, hosted Supabase Auth-settings, Google OAuth console, Meta/Facebook Developer, SiteGround DNS, or provider-console browser-automation tool.

Therefore Google/Meta/provider-console setup remains an external owner/browser gate. Continue independent launch engineering/QA instead of stopping.

## Protected restrictions

Never purchase or upgrade paid services, make destructive production-data changes, alter Microsoft 365 mail DNS, decide OD-003 or OD-004, weaken tests/RLS, publish unapproved final Terms/Privacy, expose secrets, or perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate owner authorization.

## Next safe action

1. Watch PR #55 acceptance.
2. Fix evidence-backed PR #55 failures without weakening tests.
3. Merge PR #55 when all required gates are green.
4. Continue Issue #53 with a fresh bounded Guardian-dashboard/Profile/Passport UI slice from updated `main`.
5. In parallel on each run, re-check provider tooling. If Google/Meta/Auth-provider console access becomes actionable, resume LL-4/LL-5 live acceptance immediately.
6. Keep Issue #54 planned behind launch-critical UX/Auth work.

Continue automatically until the owner explicitly disables the controller.