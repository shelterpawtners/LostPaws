# Admin QA Mode + Test Account Factory

Implement GitHub Issue #7 on the existing `qa/guardian-registration-personas` branch. Do not start Phase 2 Checkpoint 5 or Phase 3.

## Objective

Give authorized platform admins a hidden QA/support mode that preserves the real admin session while allowing them to act as deterministic demo/test personas using the real application and real Supabase RLS context. Also allow admins to create fresh, already-confirmed test accounts for each supported persona without using real inboxes.

## Non-negotiable security model

1. Never place service-role keys, admin API keys, test passwords, or privileged secrets in Vite/frontend code or public env variables.
2. Never globally disable normal public email verification as part of this feature.
3. All privileged actions must execute behind a trusted server boundary, preferably Supabase Edge Functions.
4. Every privileged request must validate the caller JWT and verify `platform_admin` server-side from authoritative database state.
5. Initial impersonation target scope is demo/test users only (`is_demo`, reserved test domain, or an explicit QA-user allowlist). Arbitrary production-user impersonation is not part of this implementation.
6. Admin and acting sessions must be distinct. The persisted/default Supabase client remains the admin session. The acting client must be a second Supabase client configured not to persist/overwrite the admin session.
7. Admin can always terminate QA mode and return to the intact admin session without credentials.
8. Audit every `start`, `switch`, `stop`, and `create_test_user` event with actor admin id, target id where applicable, timestamp, action, environment, and optional reason.

## Recommended session exchange

Use a server-side function such as `admin-qa-session` that:

- receives the caller bearer token and target QA user id;
- verifies caller is `platform_admin`;
- verifies the target is an allowed demo/test user;
- uses the Supabase Admin API server-side to generate a one-time login link/token for the target;
- returns only the one-time exchange material needed by the browser;
- never returns the service-role key or target password.

The frontend creates/uses a second Supabase client with session persistence disabled and exchanges the one-time material for the target user's session. All data operations while QA mode is active must use that acting client so `auth.uid()` and RLS behave exactly as the target user.

If a different implementation provides the same security properties and actual RLS identity fidelity, document why it is superior before using it.

## Admin eligibility

- UI is hidden unless the real/persisted session has authoritative `platform_admin` role.
- Do not authorize solely by email string.
- `jim@shelterpawtners.com` may receive `platform_admin` through the normal role system, but the authorization check is role-based.

## UI

Add a discreet admin-only entry point, preferably in the authenticated navigation/account menu.

Admin panel must provide:

- `Admin QA Mode` heading.
- Current real admin identity.
- Persona cards for deterministic seeded users:
  - Guardian A — `guardian-a@example.invalid` — Demo Pet A
  - Guardian B — `guardian-b@example.invalid` — Demo Pet B
  - Partner Admin — `partner-admin@example.invalid` — Demo PetBiz A
  - Partner B — `partner-b@example.invalid` — Demo PetBiz B
  - Shelter Admin — `shelter-admin@example.invalid` — Demo Shelter B
  - RAVE Vendor — `rave-vendor@example.invalid` — Demo RAVE Vendor
  - Platform Admin demo persona if useful
- Switch/Act as action.
- `Create fresh test account` by role: Guardian, Shelter, Pet Business, RAVE Vendor.

While active, render a fixed, unmistakable banner on every page:
`ADMIN QA MODE — Acting as <display name> (<role>)`
with:

- `Switch Persona`
- `Return to Admin`
- optional `Reason`/ticket note display if supplied

Do not hide this banner on mobile.

## Test Account Factory

Create an admin-only server-side action/function such as `admin-create-test-user`.

Required inputs:

- persona kind (`guardian`, `shelter`, `petbiz`, `rave_vendor`)
- display name (default generated)
- optional test label

Required behavior:

- authorize caller as `platform_admin` server-side;
- create a unique reserved-domain QA email (e.g. generated `@example.invalid` or another explicit non-deliverable QA domain);
- create the Supabase Auth user with email already confirmed;
- assign the correct onboarding metadata/roles;
- create any minimum required persona records only if the normal onboarding path requires them; otherwise return the new account at the correct onboarding start so the admin can test creation manually;
- return safe account metadata and a one-time acting-session exchange, not a reusable plaintext password unless there is a documented reason and it is confined to non-production test infrastructure;
- audit the creation.

The preferred workflow is: admin clicks `Create fresh Guardian test account` -> confirmed user is created -> admin immediately enters QA mode acting as that user -> normal Guardian onboarding starts without inbox verification.

## Database/audit

Use the existing private audit architecture where practical. If a new table is required, add a migration with RLS locked down from browser reads/writes except explicitly authorized admin views/RPCs.

Suggested event fields:

- id
- actor_user_id
- target_user_id nullable
- action enum/text
- reason nullable
- environment
- metadata jsonb
- created_at

## RLS and identity fidelity

This feature is successful only if acting as Guardian A causes existing RLS to see Guardian A's actual auth user id. A frontend-only role toggle/mock is not acceptable.

Test specifically:

- Guardian A cannot see Guardian B's pet.
- Partner Admin cannot mutate Partner B organization.
- Shelter Admin sees only shelter-authorized surfaces.
- returning to admin restores platform-admin permissions without a fresh login.

## Hosted QA / environment constraints

Current shared QA URL: `https://lost-paws-one.vercel.app/`
Current shared Supabase dev project ref: `jukmlmryykcnjtpblbja`

This feature may be enabled for the shared dev/QA environment. Production enablement is a separate explicit decision. Add an environment guard so accidental production deployment defaults Admin QA Mode OFF unless separately enabled.

Suggested public feature flag:
`VITE_ADMIN_QA_MODE_ENABLED=true` in QA only.
This flag controls UI visibility only; server authorization remains mandatory.

## Email verification

Do not globally turn off confirmation in production-like auth simply for QA convenience. The Admin Test Account Factory bypasses confirmation only for admin-created QA accounts. Existing normal signup should retain its normal confirmation behavior unless the shared-dev project's overall QA policy is later explicitly changed.

## Automated tests

Add tests covering at minimum:

1. non-admin cannot discover/use admin endpoints;
2. forged frontend role/email cannot authorize;
3. platform admin can list allowed QA personas;
4. target outside demo/test scope is denied;
5. acting session has target `auth.uid()`;
6. persisted admin session remains unchanged during acting session;
7. switch persona A -> B works;
8. return to admin works without credentials;
9. Guardian A/B RLS isolation remains correct;
10. Partner A/B RLS isolation remains correct;
11. test-account factory creates confirmed account for all four persona kinds;
12. normal public signup behavior remains unchanged;
13. audit event exists for start/switch/stop/create;
14. feature defaults OFF in production environment;
15. hosted QA smoke exercises Jim/admin -> Guardian -> Partner -> Shelter -> Return Admin.

## Documentation

Update:

- `docs/HOSTED-QA.md`
- `docs/QA-TEST-ACCOUNTS.md`
- `docs/SECURITY-AND-PRIVACY.md`
- `docs/DECISION-LOG.md`

Record the architecture decision that QA impersonation is delegated/test-only, role-authorized, audited, server-issued, and does not replace the original admin session.

## Completion gate

Do not claim complete until:

- build passes;
- unit/pgTAP/Playwright coverage passes;
- hosted deployment builds on Vercel;
- admin can switch among seeded personas without re-authentication;
- test account factory creates immediately usable confirmed QA users;
- non-admin access is denied;
- no service-role secret exists in frontend bundle/config;
- real admin session survives QA mode;
- audit evidence is verified.

Return final remote SHA, changed files, migration/function list, tests run/results, hosted URL, and any remaining blocker. Do not merge the PR without explicit user approval.
