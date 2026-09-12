# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: RAVE Shelter / LostPaws dual-marketplace sprint — Track 1 (mobile conversion + brand correction)
CURRENT_CHECKPOINT: Owner lifted the 2026-09-12 pause and authorized Track 1, then Track 2, per `docs/product/DUAL-MARKETPLACE-RAVE-SHELTER-EXECUTION-PLAN.md`
NEXT_CHECKPOINT: Track 1 PR ready for owner review
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_PRODUCT_SHA: bc14a3f6b839f4421781903c41d3c867f4bba848
ACCEPTANCE_RUNTIME: OWNER_RESUMED_2026_09_12

## Owner resume — 2026-09-12

The owner reviewed the plan under `docs/product/` and lifted the pause below. Current operating rules for this sprint:

- **Claude Code is the only active coding agent.** Codex is paused/out of scope for now; do not create or delegate Codex sessions until the owner explicitly re-authorizes Codex.
- Work **Track 1 first, then Track 2**, sequentially, not in parallel — Track 1 must merge and be verified live before Track 2 starts, since both tracks touch the same RAVE/LostPaws presentation components.
- **Doc creation is capped.** Update `docs/AI-HANDOFF.md`, `docs/CURRENT-WORK.md`, and the existing `docs/product/` files rather than creating new planning documents. Do not add another `docs/product/*.md` file without an explicit owner request.
- **Branch policy: fewer, longer-lived branches.** Reuse `feature/mobile-rave-lostpaws-claude` for the full Track 1 scope rather than opening a new branch per sub-task. Do not create a new branch for Track 2 until Track 1 has merged; when Track 2 starts, prefer continuing on one Track 2 branch rather than spawning several.
- Reduce duplicated/redundant QA: do not add new parallel QA workflows or test suites that overlap existing Persona QA / Hosted QA / CI coverage; extend existing suites instead.
- Automate routine execution; work around non-blocking obstacles and keep making progress on other in-scope Track 1 items rather than stopping to ask, but still respect the guardrails below (financial/legal claims, production config, secrets).

## Prior owner pause — 2026-09-12 (superseded)

The owner previously paused autonomous work after Issue #125 / PR #126 acceptance while the `docs/product/` plan was reviewed. That pause is now lifted by the resume above; this section is kept for history only.

At the time of the original pause there were no open pull requests and no queued or in-progress GitHub Actions runs.

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
