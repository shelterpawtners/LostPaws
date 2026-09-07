# Phase 2 Checkpoint 2 — Partner Profile + Public Directory

Status: complete pending product/QA review. Checkpoint 3 remains inactive.

| Requirement                         | Status                 | Evidence                                                                                                       |
| ----------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| Public/private Partner profile data | Complete               | `organization_partner_profiles` and private-contact table with separate RLS.                                   |
| Self-publication                    | Complete               | `publish_partner_profile` validates minimum safe profile requirements server-side.                             |
| Moderation foundation               | Complete               | Published/draft/unpublished/suspended/removed states and moderation reason fields.                             |
| Directory and public profile        | Complete               | `/directory`, `/partners/:id`, public RPCs expose only published fields.                                       |
| Nationwide and service-area support | Complete               | Business-model values allow online, national, mobile, and service-area profiles without street addresses.      |
| UI maintainability                  | Complete               | Directory, public profile, and editor are separate components; accepted onboarding behavior remains unchanged. |
| Automated validation                | Blocked by environment | `npm run check` and `npm run build` pass; local Supabase/Playwright need unavailable Docker and credentials.   |

## Known limitations

- Logo upload is deferred: storage policies are not expanded without a dedicated safe asset workflow.
- Admin moderation UI, full category/species/social/hours editing, and live offer indicators are deferred to later approved Partner/admin work.
- Completion QA verified that the public profile-details RPC allowlists only public profile, organization, location, social, and hours data.
