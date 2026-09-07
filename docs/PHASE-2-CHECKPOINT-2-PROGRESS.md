# Phase 2 Checkpoint 2 — Partner Profile + Public Directory

Status: complete pending product/QA review. Checkpoint 3 remains inactive.

| Requirement                         | Status      | Evidence                                                                                                                 |
| ----------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| Public/private Partner profile data | Complete    | `organization_partner_profiles` and private-contact table with separate RLS.                                             |
| Self-publication                    | Complete    | `publish_partner_profile` validates minimum safe profile requirements server-side.                                       |
| Moderation foundation               | Complete    | Published/draft/unpublished/suspended/removed states and moderation reason fields.                                       |
| Directory and public profile        | Complete    | `/directory`, `/partners/:id`, public RPCs expose only published fields.                                                 |
| Nationwide and service-area support | Complete    | Business-model values allow online, national, mobile, and service-area profiles without street addresses.                |
| UI maintainability                  | In progress | Directory and editor were extracted; onboarding refactor remains an intentionally limited follow-up before Checkpoint 3. |
| Automated validation                | In progress | Type/unit/build validation is required before acceptance; local Supabase/Playwright remains environment dependent.       |

## Known limitations

- Logo upload is deferred: storage policies are not expanded without a dedicated safe asset workflow.
- Admin moderation UI, full category/species/social/hours editing, and live offer indicators are deferred to later approved Partner/admin work.
