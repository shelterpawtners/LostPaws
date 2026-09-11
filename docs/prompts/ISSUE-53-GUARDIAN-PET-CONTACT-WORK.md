# Work handoff — Issue #53 Guardian pet-contact correction

Use this when ChatGPT Work / a browser-capable coding environment is available. GitHub Copilot cloud-agent assignment was attempted on 2026-09-11 but GitHub rejected the session because the separate GitHub AI Credits pool was exhausted. Do not retry Copilot repeatedly until that budget changes.

## Start

Repository: `shelterpawtners/LostPaws`

Read first:

- `docs/AI-HANDOFF.md`
- `docs/AI-OPERATING-PROTOCOL.md`
- `docs/CURRENT-WORK.md`
- GitHub Issue #53

Start from current `main` on a fresh branch.

## Scope — only this slice

1. In Guardian onboarding / Pet Basics, remove the misleading pet-level `Contact email` and `Instagram profile` inputs.
2. Preserve the Guardian's normal account email collected during Auth signup.
3. Preserve Shelter, PetBiz and RAVE vendor organization contact/email/social inputs unchanged.
4. Confirm `save_guardian_onboarding_pet` persists neither removed field. Do not invent a pet email/social model and do not add a schema migration unless a concrete existing persistence dependency proves one is required.
5. Preserve adoption verification, guardianship, RLS, persona continuity, existing Pet Passport behavior and all accepted LL-1–LL-6 behavior.
6. Add/update targeted regression coverage proving:
   - Guardian onboarding does not render pet Contact email / Instagram inputs;
   - pet save/reload still succeeds;
   - organization onboarding contact fields remain available for the personas that use them.
7. Do not redesign unrelated Guardian UI in this PR. The compact avatar/account-menu shell follows as the next slice.

## Known code finding

On current `main`, `StandardOnboard` in `src/main.tsx` renders generic `Contact email` and `Instagram profile` labels for every onboarding kind even though the Guardian `save_guardian_onboarding_pet` RPC call only submits pet/adoption fields and does not use those inputs. This is primarily a presentation correction, not evidence that a new schema field is needed.

## Acceptance

- focused diff;
- `npm run check` / build as required by repository policy;
- targeted Guardian onboarding regression;
- required CI / Hosted QA / Persona QA / Database QA / Dependency Review / Merge Gate green on final head;
- update `docs/AI-HANDOFF.md` before completion;
- create a focused PR referencing #53.

If Vercel preview creation remains blocked by the free-tier daily deployment limit, document that external blocker but complete all independent code/test work. Never purchase/upgrade to clear it.

## Protected constraints

Do not weaken tests/RLS, change Microsoft 365 mail DNS, alter production data, decide OD-003/OD-004, publish final legal documents, expose secrets, or perform the final `shelterpawtners.com` domain cutover.
