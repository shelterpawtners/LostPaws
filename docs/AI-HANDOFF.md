# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: RAVE Shelter / LostPaws dual-marketplace sprint — Track 2 (dual marketplace + Events)
CURRENT_CHECKPOINT: Track 1 merged to `main` (PR #130, squash commit `07ba8f1`, owner-authorized 2026-09-12). Track 2 schema-review proposal open on PR #131 (`feature/dual-marketplace-events`), now rebased onto post-merge `main`; awaiting owner answers to 3 open schema questions before migrations are written
NEXT_CHECKPOINT: Owner answers the 3 open questions in PR #131 / plan section 18a; implementation then proceeds on the same branch
OWNER_DECISION_REQUIRED: YES_SCHEMA_QUESTIONS
SAFE_TO_CONTINUE: YES
ACCEPTED_PRODUCT_SHA: 07ba8f17d2956957947470ce90b0b676268fe0fc
ACCEPTANCE_RUNTIME: OWNER_RESUMED_2026_09_12

Owner has also authorized Claude Code to merge PRs going forward without asking each time (2026-09-12), superseding the earlier merge-approval-per-PR default for this agent.

## Track 1 status — 2026-09-12

Branch: `feature/mobile-rave-lostpaws-claude`. Agent: Claude Code (sole active coding agent this sprint).

Implemented:

- RAVE Shelter renamed from "Rescue and Adoption Vendor Ecosystem" to **Rewarding Adoption with Vendor Exclusives**, with the tagline **"Rave with purpose. Shop with impact."** made prominent on `/rave`, `/lostpaws`, `/rave-vendors`, and home.
- LostPaws corrected from a generic, reusable "music-community activation" (Issue #100/#125 framing, still present in the shipped copy despite being marked accepted) to a RAVE Shelter initiative reserved specifically for the Lost Lands / Excision festival family, in `RaveShelterMission.tsx`, `LostPawsActivation.tsx`, and home.
- Soft-launch demand messaging ("right now, we need you to sign up and show demand...") added to the `/rave`, `/lostpaws`, and `/rave-vendors` heroes.
- Updated the authoritative brand/content docs that still stated the old acronym/hierarchy (`BRAND-DESIGN-SYSTEM.md`, `CONTENT-STANDARDS.md`, `FESTIVAL-MVP-AND-VERIFICATION.md`, `PRODUCT-VISION.md`, `LOSTPAWS-RAVE-LANDING-DIRECTION.md`) so a future agent reading them won't reintroduce the superseded framing; marked `RAVE-SHELTER-LOSTPAWS-MISSION.md` superseded.
- Non-affiliation language preserved verbatim; no schema/migration changes; no founding-business-promise wording added (owner has not finalized that commercial language yet, per `docs/product/OWNER-DECISIONS-NEXT-SPRINT.md`).

Not done / explicitly deferred:

- Founding-business free-account-before-2027 message — waiting on final commercial wording confirmation.
- Track 3 (Hero Vendor, Learn/FAQ, savings calculator) — not started, by design.

Tests run: `npm run typecheck`, `npm run build`, `npm test` (23 passed), `npx playwright test e2e/issue-125-rave-lostpaws-mobile.spec.ts` (9 passed, including mobile overflow at 320–768px on `/`, `/rave`, `/lostpaws`, and ≥44px touch targets) — all green.

Also fixed `.github/workflows/github-pages-mvp-acceptance.yml`'s `public-release-matrix` job, which asserted the old "A RAVE Shelter activation" / "Bring the mission into the music community." / "Explore the LostPaws activation" copy this PR replaced; updated its assertions to match and confirmed the full PR #130 check suite is green (Persona QA Gate, Hosted QA Gate, Database QA Gate, CodeQL, public-release-matrix, etc.).

Ran a live visual pass: built `dist/`, served it with `vite preview`, and screenshotted `/`, `/rave`, `/lostpaws`, and `/rave-vendors` at 390px width with Playwright. Copy, layout, and CTAs render correctly with no overflow. One finding, not fixed (approved brand asset, out of scope per the execution plan's "do not redraw logos" rule): `public/brand/rave-shelter-logo-static-v2.png` (used on `/rave`, `/lostpaws`, and reused as `rave-shelter-logo-animated-v2.gif` on `/rave-vendors`) has the superseded tagline **"Deals for ravers. Support for shelter pets."** baked into the image pixels, next to text that now correctly says "Rave with purpose. Shop with impact." Whoever owns brand assets should regenerate this logo lockup with the new tagline; recorded here rather than worked around.

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
