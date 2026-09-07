alter table public.pets
  add column if not exists onboarding_submission_id uuid;

create unique index if not exists pets_guardian_onboarding_submission_unique
  on public.pets(created_by,onboarding_submission_id)
  where onboarding_submission_id is not null;

create unique index if not exists guardianships_active_guardian_unique
  on public.guardianships(pet_id,guardian_id)
  where ended_at is null;

create or replace function public.save_guardian_onboarding_pet(
  p_submission_id uuid,
  p_name text,
  p_species text,
  p_adopted boolean default false,
  p_shelter_name text default null,
  p_shelter_email text default null,
  p_shelter_phone text default null,
  p_shelter_social text default null,
  p_adoption_date date default null,
  p_adoption_name text default null
) returns uuid
language plpgsql security definer set search_path='' as $$
declare
  v_user uuid := auth.uid();
  v_pet uuid;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;
  if p_submission_id is null then
    raise exception 'Submission identifier is required' using errcode='22023';
  end if;
  if coalesce(trim(p_name),'')='' or coalesce(trim(p_species),'')='' then
    raise exception 'Pet name and species are required' using errcode='22023';
  end if;
  if p_adopted and coalesce(trim(p_shelter_name),'')='' then
    raise exception 'Shelter name is required for adoption confirmation' using errcode='22023';
  end if;
  if p_adopted and nullif(trim(p_shelter_email),'') is null
    and nullif(trim(p_shelter_phone),'') is null
    and nullif(trim(p_shelter_social),'') is null then
    raise exception 'Provide a shelter email, phone, or website/social profile' using errcode='22023';
  end if;

  insert into public.pets(created_by,name,species,adopted_self_reported,onboarding_submission_id)
  values(v_user,trim(p_name),trim(p_species),coalesce(p_adopted,false),p_submission_id)
  on conflict (created_by,onboarding_submission_id) where onboarding_submission_id is not null
  do update set name=excluded.name,species=excluded.species,
    adopted_self_reported=excluded.adopted_self_reported,updated_at=now()
  returning id into v_pet;

  insert into public.guardianships(pet_id,guardian_id,relationship,status)
  values(v_pet,v_user,'primary','active')
  on conflict (pet_id,guardian_id) where ended_at is null do nothing;

  if p_adopted and not exists (
    select 1 from public.adoption_verification_requests
    where pet_id=v_pet and requested_by=v_user and status in ('draft','submitted')
  ) then
    insert into public.adoption_verification_requests(
      pet_id,requested_by,shelter_name,shelter_email,shelter_phone,
      shelter_website_or_social,approximate_adoption_date,pet_name_at_adoption,
      contact_consent_at,status
    ) values(
      v_pet,v_user,trim(p_shelter_name),nullif(trim(p_shelter_email),''),
      nullif(trim(p_shelter_phone),''),nullif(trim(p_shelter_social),''),
      p_adoption_date,nullif(trim(p_adoption_name),''),now(),'submitted'
    );
  end if;

  return v_pet;
end $$;

revoke all on function public.save_guardian_onboarding_pet(uuid,text,text,boolean,text,text,text,text,date,text) from public,anon;
grant execute on function public.save_guardian_onboarding_pet(uuid,text,text,boolean,text,text,text,text,date,text) to authenticated;
