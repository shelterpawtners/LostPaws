# Open items and concerns — 2026-09-12

A consolidated picture of what is still outstanding, gathered from open GitHub issues, the launch gates recorded in `docs/AI-HANDOFF.md` and `docs/CURRENT-WORK.md`, the owner decision backlog, the product plan under `docs/product/`, and a pass over the repository itself.

Ordered by what blocks a launch first. Items marked **needs you** cannot be completed by an agent.

## 1. Blocking a public launch

### 1.1 The two new migrations are not deployed anywhere — **needs you**

Track 2 added `supabase/migrations/20260912120000_track2_events_foundation.sql` and `20260912130000_track2_marketplace_channel_filter.sql`.

**They are now verified, not assumed.** Docker Desktop turned out to be installed but not running on this machine; starting it allowed a full local `supabase db reset` followed by `supabase test db`, and **all 26 pgTAP files and 308 assertions pass** against a database built from every migration in order. The audience filtering was then exercised end to end with real rows — through SQL, through the anon REST endpoint, and through the rendered marketplace — and returns exactly the contract in plan section 6: the Pet view shows pet plus shared offers, the RAVE view shows rave plus shared, and the unfiltered view shows everything.

That verification found two genuine defects that no amount of local reasoning had caught: an anon read could reach a `private.can_manage_org` call it has no privilege to execute, and two of my own test assertions expected an error where row level security silently filters the row instead. Both are fixed.

What remains is purely deployment: no hosted environment has these migrations. Until they are applied:

- audience filtering silently falls back to showing every offer (the marketplace says so on screen rather than pretending to filter);
- `public.events` and `public.event_participants` do not exist, so nothing can create an event.

Applying migrations to the hosted Supabase project needs credentials and an authorization decision I do not have. This is the single largest gap between what is in the repository and what is live.

### 1.2 Four external acceptance gates remain (issue #121)

None are code problems; each needs a real account, a provider console, or a mailbox:

1. One complete password-recovery lifecycle against a real inbox.
2. Google OAuth: real browser login, logout, and re-login returning to the apex domain.
3. Facebook/Meta: Supabase callback plus persona and duplicate-account continuity. Facebook stays publicly disabled until accepted.
4. Microsoft 365 human mailbox send and receive verification.

### 1.3 Legal routes: Privacy is live, Terms and Data Deletion are now placeholders — **needs you**

This moved since it was last written. A real Privacy Policy is now live at `/privacy`, published as a static `public/privacy.html` file with a Vercel rewrite (`vercel.json`) — that work landed on `main` from a parallel agent while this branch was in progress, outside the `src/lib/legal-routes.ts` / `legalRoutesReadyForPublication` mechanism this repo had built for gating legal publication. `legalRoutesReadyForPublication` is still `false` and nothing in the app reads it, so it is now dead scaffolding rather than the thing actually gating Privacy's publication — worth a decision on whether to keep it, since it no longer reflects reality for at least Privacy.

`/terms` and `/data-deletion` did not exist anywhere before this session; each is now a real route with placeholder content (not the old static drafts, which this session could not find committed anywhere) stating plainly that it is a placeholder, listing what the finished page needs to cover, and saying it will be drafted after the Lost Lands launch in a future phase. The footer now links to all three. Data Deletion in particular gates Meta/Facebook app review (issue #119) and should not be treated as launch-ready until it has real content and legal review.

One open question this raises: `/privacy` is reachable on Vercel via its rewrite, but this session did not verify it resolves correctly on the GitHub Pages target (which serves under a `/LostPaws/` base path and has no equivalent rewrite). That is deployment plumbing outside this session's lane; flagging it for whoever owns that configuration rather than changing it here.

### 1.4 The founding-business promise is live copy but not finally worded — **needs you**

The FAQ now states that businesses registering before 1 January 2027 keep a free founding account. That is your directed wording from the execution plan, but it is a binding commercial commitment and `docs/product/OWNER-DECISIONS-NEXT-SPRINT.md` still lists open questions about account scope, transferability, abuse controls, and whether paid add-ons are permitted later. Either confirm the wording or tell me to pull it from the FAQ.

## 2. Blocking owner decisions already on record

From `docs/OWNER-DECISION-BACKLOG.md`, all still `BLOCKING` with `PENDING` resolutions:

| ID     | Subject                                                | Why it matters now                                                                                                     |
| ------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| OD-002 | Phase 3 authorization                                  | Gates the next phase of platform work                                                                                  |
| OD-003 | Customer-facing verified-savings standard              | The savings explorer avoids this by using visitor inputs only; publishing any actual savings figure needs OD-003 first |
| OD-004 | Charitable giving provider / production money movement | Gates the entire Hero Vendor money path, annual reporting, and any "donated" claim                                     |

Track 3 was built to work without any of these being resolved, but the Hero Vendor program cannot move past recognition-only until OD-004 lands.

**New this session:** a business-facing giving UI (`PartnerGivingPanel`) and a Guardian-facing giving history now exist, built entirely on top of a donation-tracking schema and RPC set that was already in the database from Phase 2 Checkpoint 6 but had never had a UI. Neither surface moves money, selects a processor, or states a tax outcome — see `docs/product/DONATION-TRACKING-SCHEMA-PROPOSAL.md` for what already existed versus what was built, and `docs/product/BUSINESS-GIVING-AND-TAX-CONSIDERATIONS.md` for the business-facing explanation, which is explicitly a draft pending OD-004 and a CPA review before publication.

## 3. Repository and process concerns

### 3.1 Branch consolidation: 72 retired, 12 remain, one is a one-line deletion

The 87-branch sprawl from earlier in the session is retired: 72 branches proven content-identical to `main` or the head of a merged PR were deleted, each recorded with its SHA in `docs/BRANCH-RETIREMENT-2026-09-12.md`.

Of the 12 that remain past `main` itself:

- **`build/festival-mvp`** is content-identical to `main` and its own PR (#1) is merged. It is safe to delete, but deleting a remote branch is a destructive action, and this session's tooling correctly declined to do it unattended (`Permission for this action was denied by the Claude Code auto mode classifier. Reason: [Git Destructive]`). One command for you to run: `git push origin --delete build/festival-mvp`.
- The other 11 were re-checked against GitHub's PR history this session: 9 have a **closed, not merged** pull request, and 2 (`issue-58-lostpaws`, `ux/guardian-marketplace-launch-polish`) have no pull request at all. Their diffs are all small (1-4 files) and old — several add components (`LostPawsLanding.tsx`, `LostPawsCampaign.tsx`) that no longer exist in any form on `main`, having been superseded by later rewrites of the same page. That pattern suggests they are safe to retire too, but "closed without merging" can also mean genuinely abandoned work someone meant to come back to, which is exactly the judgement call a diff can't settle. Still listed as "kept for review" pending your call.

### 3.2a A gated spec had also silently drifted from the app

Separately from the orphaned specs below, `e2e/phase-3-guardian-passport.spec.ts` **is** wired into Persona QA and had been failing since 2026-09-11: PR #78 restructured the passport lead panel and moved "Private by default" into a sibling of the pet heading's parent, while the spec still scoped to that parent. The spec was last touched by the earlier PR #72. Fixed by scoping to the shared `.passportLead` panel.

The wider lesson is that a failing gate was tolerated for a day, which trains everyone to read red as normal. Worth deciding whether Persona QA should block merges outright.

There is also now a **local way to run these**: the credentials in the persona specs are the seeded demo accounts from `supabase/seed.sql`, so `supabase start`, `supabase db reset`, then pointing `PLAYWRIGHT_SUPABASE_URL` at `http://127.0.0.1:54321` runs the real persona suite offline. All 37 tests pass that way. This is much faster than waiting on CI and needs no hosted credentials.

### 3.2 CI's browser tests are an allow-list, and two specs had fallen out of it

Every Playwright invocation in `.github/workflows` names specific spec files. Two specs — `rave-shelter-mission.spec.ts` and `issue-125-rave-lostpaws-mobile.spec.ts` — were referenced by no workflow at all, so they silently rotted out of sync with the app and gave false confidence. Both now run through `npm run test:e2e:public` in CI's `web` job, alongside the new Track 3 and site-hygiene specs. **Any new spec file must be added to a script or it will never run.**

### 3.3 The bundle is one 628 KB chunk

Every build warns about it. Not urgent, but the whole app, including admin and dashboard code, ships to a first-time visitor reading the FAQ. Route-level code splitting would be the fix.

### 3.4 Documentation volume

There are now over 100 files in `docs/`. The doc-creation cap you set is in `AI-OPERATING-PROTOCOL.md` and is being honoured (this file and the site review were explicitly requested). Worth a future consolidation pass, since several historical documents describe superseded direction and only carry a "superseded" banner.

## 4. Product gaps deferred deliberately

These are known and intentional, not oversights:

- **Onboarding does not yet hide RAVE content from pet businesses** unless they opt in. Planned in Track 2's scope; the data model supports it, the onboarding flow does not implement it.
- ~~**No `/events` browsing page.**~~ Built: `/events` browses published events with audience filters and lets signed-in organizers add one. Publishing controls are still to come, so new events save as drafts and say so.
- **Thin placeholder pages.** `/passport`, `/partners`, `/shelters`, `/about` each render one paragraph from a shared component while the new `/learn/*` articles cover the same subjects properly. See recommendation 5 in the site review.
- **No savings figures published anywhere**, by design, until OD-003 and the research in `PASSPORT-SAVINGS-IMPACT-MODEL.md` are done.
- **Annual impact reporting** is described as planned, not built, everywhere it appears.
- **Offer link-preview / image scraping is proposed, not built.** The schema supports a confirmed offer image (`offers.image_url` plus provenance columns, added this session) and tiles already render one when present, but nothing yet writes to those columns — no vendor-facing or admin-facing UI sets an image today. The "paste a URL, we propose an image" flow the owner asked for needs a new, security-reviewed Edge Function first. See `docs/product/OFFER-LINK-PREVIEW-PROPOSAL.md`.

## 5. Smaller open issues on GitHub

- #54 — content roadmap for RAVE Shelter stories and campaign content
- #48 — backlog: pet/person data integrations and import adapters
- #12 — AI ops live orchestration dashboard
- #10 — repo-native handoff workflow (largely superseded by current practice)
- #9 — lock profile/data requirements and vertical-slice test plan
- #7 — QA admin mode: secure persona switching and confirmed test accounts

## 6. What is genuinely healthy

Recorded so it does not get re-investigated: no `TODO`, `FIXME`, or `HACK` markers anywhere in `src/`, `e2e/`, or `supabase/`; 39 unit tests and 46 credential-free browser assertions passing; no broken images, HTTP errors, uncaught JavaScript errors, mobile overflow, or duplicate/missing page titles across the 25 public routes; RLS enforced and tested on every new table; no secrets in the repository; non-affiliation language present on every campaign surface.
