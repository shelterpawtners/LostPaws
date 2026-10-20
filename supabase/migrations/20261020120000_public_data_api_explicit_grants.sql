-- Data API opt-in compatibility (Supabase October 30, 2026).
-- Additive GRANT-only migration: no DML, DDL drops, RLS/policy rewrites, or data mutation.
-- Based on the read-only hosted role-privilege inventory of 2026-10-20.
-- Preserves the existing table-grant envelope for reset/preview deployments that
-- no longer inherit the historical defaults. RLS remains the row-level boundary.
-- Historical applied migrations are intentionally left unchanged.
-- Do not generalize this legacy grant snapshot to new tables: new migrations
-- must grant only needed operations alongside their RLS policies.

DO $safety$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
      AND NOT c.relrowsecurity
  ) THEN
    RAISE EXCEPTION 'Refusing Data API grants: public table without RLS';
  END IF;
END
$safety$;

-- Hosted parity: 55 table(s) for anon.
GRANT select, insert, update, delete ON TABLE
  public.adoption_verification_requests,
  public.conversation_participants,
  public.conversations,
  public.donation_allocations,
  public.donation_intents,
  public.donation_recipients,
  public.donation_transactions,
  public.economic_event_lines,
  public.economic_events,
  public.event_attendees,
  public.event_participants,
  public.events,
  public.giving_providers,
  public.guardianships,
  public.import_jobs,
  public.lifecycle_event_types,
  public.messages,
  public.offer_claims,
  public.offer_comments,
  public.offer_eligibility_rules,
  public.offer_locations,
  public.offer_versions,
  public.organization_access_requests,
  public.organization_business_hours,
  public.organization_candidate_dismissals,
  public.organization_categories,
  public.organization_connections,
  public.organization_duplicate_review_cases,
  public.organization_memberships,
  public.organization_onboarding_drafts,
  public.organization_partner_profiles,
  public.organization_private_contacts,
  public.organization_relationship_types,
  public.organization_relationships,
  public.organization_social_links,
  public.organization_types,
  public.participant_roles,
  public.partner_categories,
  public.partner_contribution_commitments,
  public.partner_contribution_evidence_reviews,
  public.partner_contribution_settlement_evidence,
  public.partner_good_standing_reviews,
  public.pet_external_identifiers,
  public.pet_identifiers,
  public.pet_lifecycle_events,
  public.pets,
  public.profiles,
  public.provenance_types,
  public.redemption_events,
  public.redemptions,
  public.role_definitions,
  public.source_systems,
  public.store_products,
  public.store_requests,
  public.user_roles
TO anon;

-- Hosted parity: 2 table(s) for anon.
GRANT insert, update, delete ON TABLE
  public.organization_locations,
  public.organizations
TO anon;

-- Hosted parity: 50 table(s) for authenticated.
GRANT select, insert, update, delete ON TABLE
  public.adoption_verification_requests,
  public.conversation_participants,
  public.conversations,
  public.donation_allocations,
  public.donation_intents,
  public.donation_recipients,
  public.donation_transactions,
  public.economic_event_lines,
  public.economic_events,
  public.event_attendees,
  public.event_participants,
  public.events,
  public.giving_providers,
  public.guardianships,
  public.import_jobs,
  public.lifecycle_event_types,
  public.messages,
  public.offer_comments,
  public.organization_access_requests,
  public.organization_business_hours,
  public.organization_candidate_dismissals,
  public.organization_categories,
  public.organization_connections,
  public.organization_duplicate_review_cases,
  public.organization_locations,
  public.organization_memberships,
  public.organization_onboarding_drafts,
  public.organization_partner_profiles,
  public.organization_private_contacts,
  public.organization_relationship_types,
  public.organization_relationships,
  public.organization_social_links,
  public.organization_types,
  public.organizations,
  public.participant_roles,
  public.partner_categories,
  public.pet_external_identifiers,
  public.pet_identifiers,
  public.pet_lifecycle_events,
  public.pets,
  public.profiles,
  public.provenance_types,
  public.role_definitions,
  public.source_systems,
  public.store_products,
  public.store_requests,
  public.support_ticket_events,
  public.support_ticket_messages,
  public.support_tickets,
  public.user_roles
TO authenticated;

-- Hosted parity: 11 table(s) for authenticated.
GRANT select ON TABLE
  public.offer_claims,
  public.offer_eligibility_rules,
  public.offer_locations,
  public.offer_versions,
  public.offers,
  public.partner_contribution_commitments,
  public.partner_contribution_evidence_reviews,
  public.partner_contribution_settlement_evidence,
  public.partner_good_standing_reviews,
  public.redemption_events,
  public.redemptions
TO authenticated;

-- Hosted parity: 1 table(s) for authenticated.
GRANT select, insert, update ON TABLE
  public.pet_media
TO authenticated;

-- Hosted parity: 62 table(s) for service_role.
GRANT select, insert, update, delete ON TABLE
  public.adoption_verification_requests,
  public.conversation_participants,
  public.conversations,
  public.donation_allocations,
  public.donation_intents,
  public.donation_recipients,
  public.donation_transactions,
  public.economic_event_lines,
  public.economic_events,
  public.event_attendees,
  public.event_participants,
  public.events,
  public.giving_providers,
  public.guardianships,
  public.import_jobs,
  public.lifecycle_event_types,
  public.messages,
  public.offer_claims,
  public.offer_comments,
  public.offer_eligibility_rules,
  public.offer_locations,
  public.offer_versions,
  public.offers,
  public.organization_access_requests,
  public.organization_business_hours,
  public.organization_candidate_dismissals,
  public.organization_categories,
  public.organization_connections,
  public.organization_duplicate_review_cases,
  public.organization_locations,
  public.organization_memberships,
  public.organization_onboarding_drafts,
  public.organization_partner_profiles,
  public.organization_private_contacts,
  public.organization_relationship_types,
  public.organization_relationships,
  public.organization_social_links,
  public.organization_types,
  public.organizations,
  public.participant_roles,
  public.partner_categories,
  public.partner_contribution_commitments,
  public.partner_contribution_evidence_reviews,
  public.partner_contribution_settlement_evidence,
  public.partner_good_standing_reviews,
  public.pet_external_identifiers,
  public.pet_identifiers,
  public.pet_lifecycle_events,
  public.pet_media,
  public.pets,
  public.profiles,
  public.provenance_types,
  public.redemption_events,
  public.redemptions,
  public.role_definitions,
  public.source_systems,
  public.store_products,
  public.store_requests,
  public.support_ticket_events,
  public.support_ticket_messages,
  public.support_tickets,
  public.user_roles
TO service_role;

-- Numeric identity/sequence privileges required in fresh databases.
-- These sequences are pre-existing; no sequence is reset or advanced here.
GRANT USAGE, SELECT ON SEQUENCE
  public.economic_event_lines_id_seq,
  public.partner_contribution_evidence_reviews_id_seq,
  public.partner_good_standing_reviews_id_seq,
  public.redemption_events_id_seq
TO authenticated, service_role;
