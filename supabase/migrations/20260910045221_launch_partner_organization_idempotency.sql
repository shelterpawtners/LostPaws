-- Prevent retry/double-submit races from creating more than one Partner
-- organization from the same onboarding draft. Exact retries return the
-- already-created organization; attempts to reuse a resolved draft with
-- a different payload are rejected.
create or replace function public.create_partner_organization(
  p_partner_kind text,
  p_form jsonb,
  p_draft_id uuid
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_organization_id uuid;
  v_location jsonb;
  v_location_index integer := 0;
  v_parent_id uuid;
  v_draft public.organization_onboarding_drafts%rowtype;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication is required' using errcode = '42501';
  end if;

  select *
  into v_draft
  from public.organization_onboarding_drafts
  where id = p_draft_id
  for update;

  if not found or v_draft.created_by <> (select auth.uid()) then
    raise exception 'Onboarding draft not found or not owned by caller' using errcode = '42501';
  end if;
  if v_draft.partner_kind <> p_partner_kind then
    raise exception 'Partner kind does not match onboarding draft' using errcode = '22023';
  end if;

  if v_draft.status = 'resolved_new' and v_draft.resolved_organization_id is not null then
    if coalesce(v_draft.form_data, '{}'::jsonb) = coalesce(p_form, '{}'::jsonb) then
      return v_draft.resolved_organization_id;
    end if;
    raise exception 'Onboarding draft is already resolved with a different payload' using errcode = '22023';
  end if;

  if v_draft.status <> 'editing' then
    raise exception 'Onboarding draft is not available for organization creation' using errcode = '22023';
  end if;
  if p_partner_kind not in ('petbiz', 'rave_vendor') then
    raise exception 'Unsupported partner kind' using errcode = '22023';
  end if;
  if nullif(trim(coalesce(p_form->>'name', '')), '') is null then
    raise exception 'Public business name is required' using errcode = '22023';
  end if;

  v_parent_id := nullif(p_form->>'parentId', '')::uuid;
  insert into public.organizations(
    created_by, organization_type, organization_type_code, public_name,
    legal_name, website_url, public_phone, public_email, instagram_handle,
    parent_organization_id, status
  ) values (
    (select auth.uid()),
    case when p_partner_kind = 'rave_vendor' then 'rave_vendor'::public.organization_type else 'pet_business'::public.organization_type end,
    case when p_partner_kind = 'rave_vendor' then 'community_partner' else 'pet_business' end,
    trim(p_form->>'name'),
    nullif(trim(coalesce(p_form->>'legalName', '')), ''),
    nullif(trim(coalesce(p_form->>'website', '')), ''),
    nullif(trim(coalesce(p_form->>'phone', '')), ''),
    nullif(trim(coalesce(p_form->>'email', '')), ''),
    nullif(trim(coalesce(p_form->>'instagram', '')), ''),
    case when p_form->>'relationship' = 'corporate_child' then v_parent_id else null end,
    'active'
  ) returning id into v_organization_id;

  insert into public.organization_memberships(organization_id, user_id, role)
  values (v_organization_id, (select auth.uid()), 'owner');

  for v_location in
    select value from jsonb_array_elements(
      jsonb_build_array(
        jsonb_build_object(
          'street', coalesce(p_form->>'street', ''),
          'city', coalesce(p_form->>'city', ''),
          'state', coalesce(p_form->>'state', ''),
          'postal', coalesce(p_form->>'postal', '')
        )
      ) || coalesce(p_form->'additionalLocations', '[]'::jsonb)
    )
  loop
    if nullif(trim(coalesce(v_location->>'street', '')), '') is not null
      or nullif(trim(coalesce(v_location->>'city', '')), '') is not null
      or nullif(trim(coalesce(v_location->>'state', '')), '') is not null
      or nullif(trim(coalesce(v_location->>'postal', '')), '') is not null
    then
      insert into public.organization_locations(
        organization_id, location_type, is_primary, street_address_1, city,
        state_province, postal_code, created_by
      ) values (
        v_organization_id, 'physical', v_location_index = 0,
        nullif(trim(coalesce(v_location->>'street', '')), ''),
        nullif(trim(coalesce(v_location->>'city', '')), ''),
        nullif(trim(coalesce(v_location->>'state', '')), ''),
        nullif(trim(coalesce(v_location->>'postal', '')), ''),
        (select auth.uid())
      );
      v_location_index := v_location_index + 1;
    end if;
  end loop;

  if p_form->>'relationship' = 'franchise' and v_parent_id is not null then
    insert into public.organization_relationships(
      source_organization_id, target_organization_id, relationship_type_code,
      status, created_by
    ) values (
      v_organization_id, v_parent_id, 'franchise_of', 'pending', (select auth.uid())
    );
  end if;

  update public.organization_onboarding_drafts
  set status = 'resolved_new',
      resolved_organization_id = v_organization_id,
      form_data = p_form,
      resolution_note = 'Created as a separate organization after matching review.',
      updated_at = now()
  where id = p_draft_id;

  return v_organization_id;
end;
$$;

revoke all on function public.create_partner_organization(text, jsonb, uuid) from public, anon;
grant execute on function public.create_partner_organization(text, jsonb, uuid) to authenticated;
