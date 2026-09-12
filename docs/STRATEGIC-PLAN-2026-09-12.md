# Strategic execution plan — 2026-09-12

Written to answer one question: what can be finished without Jim, and what genuinely cannot. Everything in section 1 is being executed now. Section 2 is queued and needs no decisions. Section 3 is blocked on a person and is the honest short list to bring to a human.

## The shape of the problem

The MVP is not short of code. Phases 1 and 2 are complete, Track 1 is merged, and Tracks 2 and 3 are built and verified. What separates this repository from a launched product is **deployment, external account verification, and a handful of commercial decisions** — none of which an agent can do. So the strategy is to drive every code-side item to done, leave `main` clean and green, and reduce the human list to the smallest possible set of real decisions.

## 1. Executing now, no decisions needed

| Item                      | Why it is safe to do alone                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Merge PR #131 into `main` | Owner granted standing merge authorization; all gates green                                                                                                                    |
| Retire ~72 stale branches | Each proven either content-identical to `main` or the head of a merged PR, and every one recorded with its SHA in `docs/BRANCH-RETIREMENT-2026-09-12.md` so it can be restored |
| Keep `main` green         | CI now runs the browser suites that were previously orphaned                                                                                                                   |

## 2. Queued work that needs no input

Ordered by value to a human validator, highest first.

1. **`/events` browsing and creation UI.** The schema, RLS, and 16 pgTAP assertions exist and pass, but there is no interface, so the entire Events feature is invisible. This is the largest gap between what is built and what can be seen, which makes it the most valuable thing to finish before a human review.
2. **Fill the four thin placeholder pages.** `/passport`, `/partners`, `/shelters`, and `/about` each render one paragraph from a shared component while the new `/learn/*` articles cover the same subjects properly. Either redirect them or give them real content; leaving them is the most obvious rough edge a validator will hit.
3. **Marketplace empty state.** With no published offers, the most important page for a demand-proving launch shows an error-ish void. A deliberate "nothing here yet, here is what is coming" state serves the soft launch far better.
4. **Onboarding audience opt-in.** Pet businesses should not see festival concepts unless they choose them. The data model supports it; the onboarding flow does not implement it.
5. **Route-level code splitting.** One 628 KB chunk ships the admin and dashboard code to a visitor reading the FAQ.
6. **Consolidate the documentation.** Over 100 files in `docs/`, several describing superseded direction behind a "superseded" banner.

## 3. Blocked on a person — the real short list

This is what to look at in the morning. Everything else above can proceed without it.

### Must happen before any launch

1. **Apply the two Track 2 migrations to the hosted Supabase project.** Needs credentials. Until then `public.events` does not exist in any environment and audience filtering silently falls back to unfiltered. This is the single largest gap between the repository and what is live.
2. **Four external acceptance gates:** a real password-recovery lifecycle, Google OAuth in an ordinary browser, Facebook/Meta callback and persona continuity, and Microsoft 365 mailbox send/receive. Each needs a real account or provider console.
3. **Publish the legal routes.** `legalRoutesReadyForPublication` is still `false` and Meta app review depends on them being reachable. Needs your and/or a lawyer's review; deliberately not flipped.

### Commercial and policy decisions

4. **Founding-business promise wording.** It is live in the FAQ as a binding commitment while account scope, transferability, abuse controls, and future paid add-ons are still open questions.
5. **OD-004, money movement.** Gates the entire Hero Vendor payout path, annual reporting, and any claim that money was donated. Track 3 was deliberately built to work without it, but cannot progress past recognition-only.
6. **OD-003, verified-savings standard.** The savings explorer sidesteps this by using only visitor-entered figures; publishing any actual savings figure needs OD-003 first.
7. **OD-002, Phase 3 authorization.**

### Small but yours

8. **Modal versus inline prompt.** Plan section 6 asks for a marketplace selector modal; it shipped as an inline prompt because the modal blocked clicks and broke the redemption flow. Confirm or reject.
9. **Thirteen remaining branches.** Listed in the retirement manifest. They hold content not in `main`, and whether that content is wanted is a judgement about intent, not something a diff can settle.
10. **The home hero's Passport card** is still a gradient placeholder where a pet image belongs. Needs a direction: photography, illustration, or a stylised graphic. Stock photos presented as real ShelterPawtners pets are ruled out by `docs/CONTENT-STANDARDS.md`.

## What "ready for human validation" will mean

When section 1 completes and as much of section 2 as time allows:

- `main` carries every track, green across CI.
- One open branch at most, not eighty-five.
- Every public route reachable, contrast-clean, free of mobile overflow, with its own page title and 44px touch targets, guarded by a hygiene suite so it stays that way.
- The database verified locally end to end, including the audience filtering contract.
- A validator's remaining complaints should be about **product judgement** — is this the right message, is this the right design — not about broken pages, which is the point.
