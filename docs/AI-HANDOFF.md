# AI Handoff

STATUS: PAUSED_BY_OWNER
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Owner-requested pause after Issue #125 / PR #126 acceptance and launch-doc cleanup
NEXT_CHECKPOINT: Resume only on explicit owner instruction, then re-read `docs/CURRENT-WORK.md`, this handoff, and current open issues before taking any action
OWNER_DECISION_REQUIRED: YES_TO_RESUME
SAFE_TO_CONTINUE: NO
ACCEPTED_PRODUCT_SHA: bc14a3f6b839f4421781903c41d3c867f4bba848
ACCEPTANCE_RUNTIME: OWNER_PAUSED_2026_09_12

## Owner pause — 2026-09-12

The owner explicitly paused autonomous work and asked to stop further automated tasks.

Until the owner explicitly resumes work:

- do not start new coding, QA, deployment, provider-console, DNS, legal-publication, or launch tasks;
- do not create or delegate Copilot/Codex/Work coding sessions;
- do not auto-merge or create new implementation branches/PRs;
- do not change production configuration;
- scheduled ChatGPT controllers/briefs are disabled;
- the GitHub `AI Ops Status` hourly schedule is disabled and remains manual-dispatch only;
- event-driven CI/QA safety workflows may remain configured, but they should have nothing to execute unless a human explicitly changes the repository.

At the time of pause there were no open pull requests and no queued or in-progress GitHub Actions runs.

## Stable product / hosting state at pause

GitHub `main` is the only release-candidate source of truth.

Accepted product SHA: `bc14a3f6b839f4421781903c41d3c867f4bba848`.

Current production/domain state had already been owner-authorized and completed before this pause:

- `shelterpawtners.com` and `www.shelterpawtners.com` validate on Vercel; apex is canonical;
- Supabase Auth Site URL points to the apex;
- Google OAuth production origin/callback configuration is in place;
- Resend/custom SMTP and `auth.shelterpawtners.com` transactional-email DNS are configured;
- Microsoft 365 human-mail DNS remains intentionally unchanged;
- no additional DNS/custom-domain work is authorized during the pause.

Issue #125 / PR #126 established the current public product direction:

- `/rave` is the evergreen RAVE Shelter / Rescue and Adoption Vendor Ecosystem mission experience;
- `/lostpaws` is the distinct LostPaws music/festival-community activation;
- `/rave-shelter` canonicalizes to `/rave`;
- LostPaws must remain clearly independent from Lost Lands, Excision, and their affiliates;
- approved LostPaws and RAVE Shelter artwork remains locked.

## Remaining launch gates when work resumes

1. Complete one real password-recovery lifecycle with a safe inbox/account.
2. Confirm Google ordinary-browser return to the apex, logout, and re-login continuity.
3. Complete Facebook/Meta Supabase callback + post-callback persona/duplicate-account continuity; keep Facebook publicly disabled until accepted.
4. Verify Microsoft 365 human mailbox send/receive if still outstanding.
5. Decide Support OS runtime path: approved alert destination + managed secrets + reviewed Edge Function/runtime deployment, or explicitly defer runtime.
6. Owner/legal review of draft Privacy, Terms, and Data Deletion language before publication.
7. Final ordinary-browser production smoke on the apex: mobile/direct routes, Guardian dashboard/passport, marketplace, auth/logout, `/rave`, and `/lostpaws`.

## Resume procedure

On explicit owner instruction to resume:

1. read `docs/CURRENT-WORK.md`, `docs/AI-OPERATING-PROTOCOL.md`, this file, and current GitHub issues;
2. inspect `main`, current deployment/runtime state, and latest CI evidence;
3. do not resurrect historical branches or accepted slices without regression evidence;
4. restart only the smallest required controller/automation, rather than re-enabling every previous automation by default;
5. continue from the remaining launch gates above.

## Guardrails retained during and after pause

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
