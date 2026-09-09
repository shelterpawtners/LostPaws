-- Complete the Phase 1 foreign-key index pass after advisory verification.
create index if not exists organizations_type_code_idx
  on public.organizations(organization_type_code);
create index if not exists pet_identifiers_provenance_idx
  on public.pet_identifiers(provenance_code);
create index if not exists pet_lifecycle_provenance_idx
  on public.pet_lifecycle_events(provenance_code);
create index if not exists redemptions_confirmed_by_idx
  on public.redemptions(confirmed_by);
create index if not exists user_roles_role_code_idx
  on public.user_roles(role_code);
