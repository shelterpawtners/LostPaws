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

### 1.3 Legal routes are written but unpublished — **needs you**

Privacy, Terms, and Data Deletion drafts exist and `legalRoutesReadyForPublication` is still `false` in `src/lib/legal-routes.ts`. Meta app review (issue #119) depends on these being publicly reachable. This needs your and/or a lawyer's review before the flag flips — I have deliberately not flipped it.

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

## 3. Repository and process concerns

### 3.1 Eighty-seven remote branches, forty-six of them stale

`origin` carries 87 branches; 46 have had no commit in over a day, and spot checks show several are behind `main` rather than ahead of it (they predate current tests). Issue #107 already covers retiring historical branches. I have not deleted any, because branch deletion is destructive and several may hold work I cannot evaluate. Recommendation: you confirm a cutoff date and I retire everything merged or superseded before it in one pass.

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
- **No `/events` browsing page.** Schema, RLS, and tests exist; there is no UI to create or browse an event yet, so the Events feature is currently invisible to users.
- **Thin placeholder pages.** `/passport`, `/partners`, `/shelters`, `/about` each render one paragraph from a shared component while the new `/learn/*` articles cover the same subjects properly. See recommendation 5 in the site review.
- **No savings figures published anywhere**, by design, until OD-003 and the research in `PASSPORT-SAVINGS-IMPACT-MODEL.md` are done.
- **Annual impact reporting** is described as planned, not built, everywhere it appears.

## 5. Smaller open issues on GitHub

- #54 — content roadmap for RAVE Shelter stories and campaign content
- #48 — backlog: pet/person data integrations and import adapters
- #12 — AI ops live orchestration dashboard
- #10 — repo-native handoff workflow (largely superseded by current practice)
- #9 — lock profile/data requirements and vertical-slice test plan
- #7 — QA admin mode: secure persona switching and confirmed test accounts

## 6. What is genuinely healthy

Recorded so it does not get re-investigated: no `TODO`, `FIXME`, or `HACK` markers anywhere in `src/`, `e2e/`, or `supabase/`; 39 unit tests and 46 credential-free browser assertions passing; no broken images, HTTP errors, uncaught JavaScript errors, mobile overflow, or duplicate/missing page titles across the 25 public routes; RLS enforced and tested on every new table; no secrets in the repository; non-affiliation language present on every campaign surface.
