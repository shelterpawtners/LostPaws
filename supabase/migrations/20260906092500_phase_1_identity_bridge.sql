-- Bridge the festival prototype identity records to the Phase 1 role model.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path='' as $$
declare
  onboarding text := coalesce(new.raw_user_meta_data->>'onboarding_type', 'guardian');
  legacy_kind public.participant_type;
  role_code text;
begin
  insert into public.profiles(id,full_name)
  values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict(id) do nothing;

  if onboarding not in ('guardian','shelter','petbiz','rave_vendor') then onboarding := 'guardian'; end if;
  legacy_kind := onboarding::public.participant_type;
  role_code := case when onboarding='shelter' then 'shelter_member'
                    when onboarding in ('petbiz','rave_vendor') then 'partner_member'
                    else 'guardian' end;

  insert into public.participant_roles(user_id,participant_type)
  values(new.id,legacy_kind) on conflict do nothing;
  insert into public.user_roles(user_id,role_code)
  values(new.id,role_code) on conflict do nothing;
  return new;
end $$;
revoke all on function public.handle_new_user() from public,anon,authenticated;

create policy self_nonprivileged_role_add on public.user_roles for insert to authenticated
with check(
  user_id=(select auth.uid())
  and assigned_by is null
  and revoked_at is null
  and exists(select 1 from public.role_definitions r where r.code=role_code and not r.is_privileged)
);
