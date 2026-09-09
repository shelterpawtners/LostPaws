# Phase 2 Checkpoint 2 — Partner Profile + Public Directory

Status: engineering-complete pending product/QA acceptance. Checkpoint 3 remains inactive.

| Requirement                         | Status                                | Evidence                                                                                                                                                                                                      |
| ----------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public/private Partner profile data | Complete                              | `organization_partner_profiles` and private-contact table with separate RLS.                                                                                                                                  |
| Self-publication                    | Complete                              | `publish_partner_profile` validates minimum safe profile requirements server-side.                                                                                                                            |
| Moderation foundation               | Complete                              | Published/draft/unpublished/suspended/removed states and moderation reason fields.                                                                                                                            |
| Directory and public profile        | Complete                              | `/directory`, `/partners/:id`, public RPCs expose only published fields.                                                                                                                                      |
| Nationwide and service-area support | Complete                              | Business-model values allow online, national, mobile, and service-area profiles without street addresses.                                                                                                     |
| Authenticated profile editor        | Complete                              | `/business` saves public description/about/contact paths, model, service area, categories, species, social links, hours, location context, and private primary/operational contacts.                          |
| Directory filters                   | Complete                              | `/directory` exposes category, city, state, model, and species parameters already supported by `public_partner_directory`.                                                                                    |
| Save/publish/unpublish              | Complete                              | Editor preserves saved profile data, calls server-side `publish_partner_profile`, and unpublishes without deleting the profile.                                                                               |
| UI maintainability                  | Complete                              | Directory, public profile, and editor are isolated components; Partner onboarding remains behaviorally unchanged and its supporting matching logic is already isolated in `src/lib/organization-matching.ts`. |
| Automated validation                | Complete / environment-blocked replay | Added `supabase/tests/phase_2_checkpoint_2_rls.sql`; `npm run check` and `npm run build` pass. Local Supabase/Playwright execution requires unavailable Docker and authenticated test credentials.            |

## Known limitations

- Logo upload is deferred: storage policies are not expanded without a dedicated safe asset workflow.
- Admin moderation UI and live offer indicators are deferred to their already assigned later Partner/admin work. Category, species, social-link, and hours editing are complete in the authenticated Partner editor.
- Completion QA verified that the public profile-details RPC allowlists only public profile, organization, location, social, and hours data.
