# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

Lost Lands MVP LL-1 through LL-6 are **accepted** and must not be reopened without regression evidence.

**Current state: release-candidate source reconciliation is complete on `main`; final GitHub Pages integrated acceptance is green. Remaining work is limited to explicit external/owner gates and the Support OS delivery-runtime gap.**

Current accepted release-candidate/source baseline: `53978542abae1e40b253e79cc82dcc2354b08406`.

Current verified browser acceptance surface: GitHub Pages at `https://shelterpawtners.github.io/LostPaws`.

Current Vercel production frontend remains the older READY PR #78 deployment at SHA `5bf64450a598fa19126fc9069632dea2d3cf4601`; newer branch/production attempts are still constrained by the Hobby deployment limit. Do not purchase or upgrade Vercel to bypass this.

Production `shelterpawtners.com` web-domain cutover remains explicitly owner-gated.

## Final source reconciliation / Issue #87

Issue #87 established `main` as the only release-candidate source of truth. Historical branches were audited by tree/functionality rather than blindly merged. No known accepted MVP product delta remains stranded solely on an old branch.

Accepted final acceptance work includes:

- PR #88 — final GitHub Pages MVP release matrix across mobile/tablet/desktop and critical public routes/workflows.
- PR #90 — non-destructive authenticated Guardian live smoke.
- `main` commit `53978542abae1e40b253e79cc82dcc2354b08406` — mobile Guardian responsive navigation fix for the authenticated live smoke.
- GitHub Pages MVP Acceptance run #12 passed on that exact SHA, including signed-in Guardian Account/Help & feedback, protected Passport navigation, sign-out, and protected-route redirect.
- PR #92 became conflict-stale after the same mobile navigation fix landed on `main`; it was closed unmerged rather than force-merging duplicate/superseded QA code.

Do not merge historical branches wholesale merely to make ancestry look clean.

## Accepted launch-readiness engineering

Recent accepted work includes:

- multi-photo Pet Passport + Guardian activity improvements and Guardian Deal Moments;
- denser Marketplace presentation;
- LostPaws campaign landing and RAVE Shelter vendor acquisition surface;
- Guardian pet-contact correction, compact account/avatar menu, private Guardian profile avatars, and photo-first Guardian Passport;
- global launch navigation cleanup and homepage LostPaws/RAVE feature;
- Support OS foundation/runbooks, Help & feedback intake/status, duplicate/digest plumbing, privacy-safe triage/classification/owner-digest views, deployed release context, delivery contract, and cross-day aging/escalation regression;
- launch legal-review checklist; draft Terms/Privacy remain unapproved and must not be published as final.

Issue #53 remains **closed/completed**.

Issue #80 remains **closed/completed in source**.

## Auth/email status

Completed hosted prerequisites:

- Resend free-tier setup is complete.
- `auth.shelterpawtners.com` transactional-email-only DNS is verified.
- Microsoft 365 inbound/human-mail DNS remains intentionally unchanged.
- Supabase custom SMTP is enabled with `ShelterPawtners <noreply@auth.shelterpawtners.com>`.
- Hosted Supabase Site URL is configured.
- Real Guardian signup/confirmation through Supabase + Resend was accepted.

Do not redo Resend/domain/SMTP/Guardian-confirmation work without regression evidence.

## Active Issue #56 — Support OS

Supabase remains the operational support source of truth. Raw support content/PII must never auto-mirror to GitHub.

Accepted capabilities include:

1. authenticated Help & feedback intake/status under RLS;
2. privacy-safe duplicate, triage, classification, owner-digest and delivery-candidate views;
3. bounded human-escalation policy with no autonomous closure/fix behavior;
4. deployed release/version captured in `support_tickets.app_release`;
5. immediate vs daily-digest delivery boundaries;
6. persistent 24h / 48h / 7d aging and escalation regression coverage.

Shared-dev verification remains valid:

- `private.support_delivery_candidates` exists;
- neither `anon` nor `authenticated` can SELECT it;
- no raw reporter/text/AI payload columns are exposed;
- no new Support OS-specific security-advisor finding was introduced.

Remaining #56 work:

1. Implement the actual repository-backed, least-privilege scheduler/delivery worker only when a supported runtime plus approved owner-alert transport credential/destination and hosted secret path are available.
2. Consume only the accepted privacy-minimized delivery contract; do not transport raw ticket content/PII.
3. Do not enable `pg_cron`/`pg_net` ad hoc or create a shared-dev-only scheduler outside repository review/tests.
4. Optional screenshot/storage support remains later and requires explicit privacy/storage controls.

## Hosted runtime state

### GitHub Pages

- Current release-candidate SHA: `53978542abae1e40b253e79cc82dcc2354b08406`.
- Final public mobile/tablet/desktop matrix is green.
- Authenticated Guardian mobile + desktop smoke is green on the live Pages release candidate.
- GitHub Pages is therefore the current verified acceptance surface.

### Vercel

- Project `lost-paws` is connected on Hobby.
- Current READY production deployment remains PR #78 at SHA `5bf64450a598fa19126fc9069632dea2d3cf4601`.
- Recent newer deployments are canceled/rate-limited; do not purchase or upgrade to bypass the limit.
- Vercel staleness does not invalidate the GitHub Pages acceptance result, but final Vercel production freshness should be rechecked when free-tier capacity becomes available.

## Remaining external launch gate

1. Execute real password-recovery acceptance: delivery, `/reset-password`, password update, new-password sign-in, invalid/expired/reused-link behavior.
2. Verify Microsoft 365 human mailbox send/receive remains normal after transactional-email DNS additions.
3. Configure/live-test Google OAuth when provider-console access/tooling is available.
4. Configure/live-test supported Facebook Login when Meta console access/tooling is available.
5. Verify OAuth/email flows do not create duplicate profiles/organizations and preserve persona continuity.
6. Recheck Vercel production freshness when the free-tier deployment window is available; do not upgrade the plan.
7. Present draft Terms/Privacy and owner checklist for owner/legal review; do not publish as final without approval.
8. Prepare but do not perform final production web-domain/custom-domain cutover without separate authorization.

Current connected Supabase tooling still does not expose hosted Google/Meta provider configuration. Meta phone/provider interaction must not block independent repository, database, QA or launch-readiness work.

## Current next sequence

1. Treat `main` as the locked release-candidate source of truth; do not merge stale historical branches without regression evidence.
2. Continue Issue #56 only through a repository-backed, least-privilege delivery mechanism once its legitimate secret/transport/runtime prerequisites exist.
3. Re-check password-recovery/Google/Meta/Vercel tooling each run and act immediately if an authorized prerequisite becomes actionable.
4. Keep legal publication and final production-domain cutover owner-gated.
5. If all external lanes remain blocked, continue only useful non-destructive launch verification/documentation; do not invent privileged production mechanisms.

## Guardrails still in force

Never:

- purchase/upgrade paid services without owner approval;
- make destructive production-data changes;
- alter Microsoft 365 mail DNS;
- decide OD-003 or OD-004;
- weaken tests or RLS;
- publish unapproved final Terms/Privacy;
- expose secrets;
- perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate authorization.
