# AI Handoff

STATUS: READY_FOR_FINAL_AUTH_AND_LEGAL_ACCEPTANCE
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Issue #125 mobile/campaign regression is merged and green; Google hosted callback + Guardian backend continuity verified; Facebook provider authorization reached but Supabase callback not yet accepted
NEXT_CHECKPOINT: Complete real password recovery, Google browser return/logout/re-login, Facebook callback continuity, owner legal review, and final ordinary-browser production smoke
OWNER_DECISION_REQUIRED: YES_FOR_INTERACTIVE_AUTH_AND_LEGAL_REVIEW_ONLY
SAFE_TO_CONTINUE: YES
ACCEPTED_PRODUCT_SHA: bc14a3f6b839f4421781903c41d3c867f4bba848
ACCEPTANCE_RUNTIME: ISSUE_125_PR_GATES_GREEN_AND_POST_MERGE_MAIN_ACCEPTANCE_RUNNING

## Read first

- `docs/CURRENT-WORK.md`
- `docs/AI-OPERATING-PROTOCOL.md`
- this file
- active GitHub issues before creating new work

GitHub `main` is the only release-candidate source of truth. Do not restart branch reconciliation, wholesale-merge historical branches, or reopen accepted Lost Lands slices without regression evidence.

## Domain / hosting state

The owner previously authorized and completed the production domain/Auth configuration on 2026-09-12:

- `shelterpawtners.com` and `www.shelterpawtners.com` validate on Vercel; apex is canonical.
- SiteGround web records were changed only to the Vercel-provided web records. Microsoft 365 and Auth/Resend mail DNS remained unchanged.
- Supabase Auth Site URL is the apex; the production redirect is allowed and GitHub Pages remains available for rollback/testing.
- Google OAuth includes the apex JavaScript origin and retains the Supabase callback.
- A Vercel production deployment was verified READY after the domain configuration.

Do not make additional production DNS/custom-domain changes without a new explicit owner authorization. Continue minimizing Vercel deployments because the Hobby account has hit the free daily deployment limit during launch work. Never upgrade solely for capacity.

## Current public product direction

### RAVE Shelter + LostPaws — Issue #125 / PR #126

Issue #125 is the newer controlling product direction and supersedes the earlier same-page `/rave` + `/lostpaws` interpretation from Issue #100 where they conflict.

- `/rave` = the evergreen **RAVE Shelter / Rescue and Adoption Vendor Ecosystem** mission and movement experience.
- `/lostpaws` = the distinct **LostPaws activation**, the first RAVE Shelter activation built for music/festival communities.
- `/rave-shelter` canonicalizes to `/rave`.
- Both experiences route into the shared RAVE Marketplace, Guardian, vendor/PetBiz, and shelter paths.
- LostPaws must clearly state it is independent and not affiliated with, sponsored by, endorsed by, or an official program of Lost Lands, Excision, or their affiliates.
- Do not imply unsupported donation percentages, charitable status, or tax deductibility.

PR #126 merged at `bc14a3f6b839f4421781903c41d3c867f4bba848` after CI, Database QA, Hosted QA, Persona QA, Merge Gate, Dependency Review, and the GitHub Pages public release matrix all passed on the PR head. The release matrix now independently verifies `/rave` and `/lostpaws` on mobile/tablet/desktop rather than forcing identical content. Explicit Issue #125 coverage checks 320/360/375/390/412/430px plus tablet portrait, horizontal overflow, `object-fit: contain` for the LostPaws hero, and >=44px primary action targets.

Approved brand artwork remains locked. Do not generatively redraw owner-approved LostPaws or RAVE Shelter artwork in product code.

## Auth / email state

Completed and accepted prerequisites:

- Resend free tier;
- `auth.shelterpawtners.com` transactional-email DNS;
- Microsoft 365 inbound/human-mail DNS intentionally unchanged;
- Supabase custom SMTP `ShelterPawtners <noreply@auth.shelterpawtners.com>`;
- hosted Supabase Site URL;
- real Guardian signup/confirmation through Supabase + Resend.

### Password recovery

PR #94 source/test readiness is complete: forgot-password entry, base-aware redirect, `/reset-password`, browser-scoped `PASSWORD_RECOVERY` gating, password update, forced sign-out, and safe invalid/expired/reused messaging.

Still required: one real hosted lifecycle using an actual safe inbox/account. Connected Gmail currently contains no ShelterPawtners password-recovery message that can be used to close this gate. Do not claim it complete from source tests alone.

### Google OAuth

Source readiness is complete through Issue #99 / PR #104, and production Google origin/callback configuration has been performed.

New read-only hosted evidence from 2026-09-12 confirms a recent real Google OAuth identity in the same Supabase project is associated with exactly one application profile, exactly one active `guardian` role, one Google identity total, and zero organization memberships/organizations. This materially verifies the Google provider callback, Guardian profile/persona creation, and absence of backend duplicate organization creation for that acceptance account.

Still required: ordinary-browser confirmation that Google returns to the apex application correctly, logout works, and re-login preserves the same account/persona.

### Facebook / Meta OAuth

Source readiness is complete through Issue #98 / PR #106. Facebook remains publicly feature-gated off through `VITE_FACEBOOK_AUTH_ENABLED=false` until live acceptance is complete.

Connected Gmail contains direct Meta evidence that a real Facebook account authorized/logged into the ShelterPawtners Meta app and shared basic identity/email information. However, read-only Supabase inspection currently shows no recent `facebook` identity. Therefore the Meta provider boundary was reached, but the Supabase callback/in-app account continuity gate is **not complete**.

Keep Facebook disabled publicly until the callback creates/links the expected Supabase identity and post-callback persona/duplicate-account behavior is verified. Do not request broad social permissions merely to authenticate. Do not claim Instagram consumer login exists.

Supabase external-provider callback:

`https://jukmlmryykcnjtpblbja.supabase.co/auth/v1/callback`

## Support OS / Issue #56

Supabase remains the operational support source of truth. Raw support content/PII must never auto-mirror to GitHub.

Accepted foundation includes authenticated Help & feedback under RLS, privacy-safe triage/delivery contracts, human escalation for privacy/safety/P0/P1, release context, aging/escalation regression, a private delivery ledger, service-role-only claim/complete RPCs, and provider-neutral server-side delivery worker source.

Do not deploy the Support OS delivery Edge Function until an approved owner-alert destination and managed `SUPPORT_DELIVERY_WEBHOOK_URL` / `SUPPORT_DELIVERY_INVOKE_SECRET` are available. Do not invent a webhook/transport or enable ad hoc `pg_cron` / `pg_net` scheduling.

## Legal state

Draft Privacy, Terms, and Data Deletion route contracts exist for owner/reviewer work. They are **not approved for final publication**. Do not publish final Privacy/Terms or represent them as legally approved without owner review. Do not decide OD-003 or OD-004.

## Remaining launch gates

1. Real password-recovery lifecycle acceptance.
2. Google ordinary-browser return/logout/re-login acceptance.
3. Facebook/Meta Supabase callback + post-callback persona/duplicate continuity acceptance; keep feature flag off until then.
4. Microsoft 365 human mailbox send/receive verification if still outstanding.
5. Support OS approved alert destination + managed secrets + reviewed Edge Function/runtime deployment, or explicitly defer that runtime without inventing transport.
6. Owner/legal review of draft Privacy/Terms/Data Deletion language before publication.
7. Final ordinary-browser production smoke on apex: mobile/direct routes, Guardian dashboard/passport, marketplace, auth/logout, `/rave`, and `/lostpaws`.

## Operating guidance

Prefer small atomic changes with clear completion boundaries. Do not spend agent capacity on branch reconciliation or reopening accepted Lost Lands work absent regression evidence.

When a large deterministic edit cannot be safely performed with direct tools, the proven fallback is a temporary **branch-only** patch/format workflow that applies exact expected changes, runs tests/build, commits only when successful, and is deleted before merge. Never leave temporary integration workflows/scripts on `main`.

## Guardrails

Never:

- purchase/upgrade paid services without owner approval;
- make destructive production-data changes;
- alter Microsoft 365 mail DNS;
- decide OD-003 or OD-004;
- weaken tests or RLS;
- expose secrets;
- publish final Terms/Privacy without owner review;
- make additional production web-domain DNS/custom-domain changes without separate owner authorization;
- auto-close/fix support cases solely from AI suggestions;
- bypass privacy/P0/P1 human escalation;
- wholesale-merge historical branches or create another long-lived release/integration branch.
