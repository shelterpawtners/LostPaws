# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Phase 3 — Lost Lands MVP
CURRENT_CHECKPOINT: LL-3 / Issue #39 — Shelter adoption verification golden path
NEXT_CHECKPOINT: LL-4 — production auth/email, Google OAuth, and transactional email
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: LOCAL_HEAD

## Active task

Issue #39 — **LL-3: Shelter adoption verification golden path**

Agent: ChatGPT / GitHub operator

Branch: `phase3/shelter-verification`

PR: #43

## Owner authorization

The owner has authorized autonomous continuation through the Lost Lands MVP and standing merge authorization for green engineering PRs until revoked. Do not wait for the next hourly controller when safe work can continue; after a completed or externally blocked slice, immediately advance to the next authorized independent slice.

Protected gates remain: no paid upgrades, no destructive production-data changes, no Microsoft 365 mail DNS changes, no OD-003 customer-facing verified-savings rule invention, no OD-004 money movement/settlement decisions, no publication of final unreviewed Terms/Privacy, and no final `shelterpawtners.com` production web-domain DNS/custom-domain cutover.

## Completed launch slices

- LL-1 Guardian Digital Pet Passport merged via PR #37 at `0ae4b4d86f8f1083343d8e23357d64268ccce06c` after full required acceptance.
- LL-2 Premium Marketplace merged via PR #42 at `08bd137ea79b951e540b3f0c2909a4ea5adc82fc` after CI, Hosted QA/design/axe, full Persona claim/redemption regression, Admin QA, Dependency Review, and Merge Gate passed.

## LL-3 implementation contract

Reuse the existing `public.adoption_verification_requests` record and `private.secure_tokens` infrastructure. Do not create a parallel verification model.

Required boundaries:

- Guardian submission from an active-primary guardianship, with shelter/rescue contact information and no fabricated verified state.
- High-entropy 30-day responder token issued only through a service-only function; raw token is never exposed to the Guardian client.
- Anonymous responder lookup is token-scoped and returns only the minimum pet/adoption context needed to answer.
- Anonymous confirmation/decline consumes the token and cannot be replayed; invalid, expired, revoked, or consumed tokens cannot act.
- Confirmed response persists the approved adoption date/responder fields and sets the pet's shelter-confirmed marker.
- Guardian sees current verification state from their existing private request record.
- Reminder contract: first reminder no sooner than 10 days after successful delivery, maximum three reminders before the 30-day token expiry. Later reminder timing remains caller-supplied/service-controlled so this slice does not invent an unapproved cadence.
- Actual transactional delivery remains LL-4; LL-3 exposes/tests the service boundary needed by LL-4.

## Acceptance state

PR #43 is the active LL-3 acceptance PR. The first acceptance pass showed Hosted QA, Persona QA, and Merge Gate green but CI failed only at the repository Prettier check. A temporary self-deleting formatter workflow ran Prettier against the changed source/docs files and removed itself. The automation-authored formatter commit caused GitHub to mark the immediate pull-request workflow reruns `action_required`; this handoff commit intentionally retriggers the real required checks from the repository owner identity without weakening any gate.

## Acceptance required

Database migration/reset/pgTAP/RLS and RPC-execute boundaries; targeted Guardian → anonymous shelter responder → Guardian verified golden path; invalid/consumed token behavior; existing Passport, Marketplace, claim/redemption, Persona, Admin, Hosted design/runtime, CI, Dependency Review, and Merge Gate regressions.

## Next safe action

Observe the current PR #43 acceptance runs. Fix only reproducible in-scope defects without weakening tests/RLS. When all required gates are green, record the accepted SHA, merge #43 under standing owner authorization, close Issue #39 if appropriate, and immediately begin LL-4 production auth/email + Google OAuth readiness. For LL-4, current Supabase guidance requires custom SMTP for production auth email and permits Resend; Site URL and redirect URLs must constrain email/OAuth destinations. If provider/dashboard credentials are unavailable through connected tools, complete code/config/test preparation and document only the minimal external console action still required.
