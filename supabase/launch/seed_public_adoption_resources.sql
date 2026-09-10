-- ShelterPawtners launch catalog: verified third-party public adoption benefits.
-- Verified against official provider sources on 2026-09-09.
--
-- This is launch content, not schema. Apply only to an environment that has a
-- platform_admin profile. It is idempotent by stable IDs and intentionally creates
-- no organization memberships or partner profiles, so these source organizations
-- are not represented as ShelterPawtners partners or public-directory members.

begin;

do $$
declare
  v_actor uuid;
begin
  select ur.user_id
  into v_actor
  from public.user_roles ur
  where ur.role_code = 'platform_admin'
  order by ur.user_id
  limit 1;

  if v_actor is null then
    raise exception 'A platform_admin profile is required before seeding public launch resources';
  end if;

  insert into public.organizations(
    id,created_by,organization_type,organization_type_code,public_name,description,
    website_url,status,is_demo
  ) values
    (
      '8b43f070-9a2f-4c95-81ee-2aa44d086493',v_actor,'pet_business','pet_business',
      'PetSmart',
      'Third-party public source record used only to attribute a public adoption-benefit listing. Not a ShelterPawtners partner record.',
      'https://www.petsmart.com/adoption','active',false
    ),
    (
      '57674342-f0cf-4e22-b76d-b91e21b7711f',v_actor,'pet_business','service_provider',
      'Adopt a Pet',
      'Third-party public source record used only to attribute a public adoption-benefit listing. Not a ShelterPawtners partner record.',
      'https://shelterplus.adoptapet.com/','active',false
    ),
    (
      'a4901c2d-ee7b-4c02-be41-7fc1389848c2',v_actor,'pet_business','service_provider',
      'PetPartners',
      'Third-party public source record used only to attribute a public adoption-benefit listing. Not a ShelterPawtners partner record.',
      'https://www.petpartners.com/30-day-pet-insurance-coverage','active',false
    ),
    (
      '185f498c-3d21-4133-a5bb-a7cd8c7aba24',v_actor,'pet_business','service_provider',
      'Trupanion',
      'Third-party public source record used only to attribute a public adoption-benefit listing. Not a ShelterPawtners partner record.',
      'https://www.trupanion.com/shelter','active',false
    ),
    (
      '3d17c12d-df3c-413b-be6b-a56fd69f2853',v_actor,'pet_business','nonprofit_foundation',
      'BISSELL Pet Foundation',
      'Third-party public source record used only to attribute a public adoption-benefit listing. Not a ShelterPawtners partner record.',
      'https://www.bissellpetfoundation.org/programs/empty-the-shelters/','active',false
    )
  on conflict (id) do update
  set public_name=excluded.public_name,
      description=excluded.description,
      website_url=excluded.website_url,
      organization_type_code=excluded.organization_type_code,
      status='active',
      is_demo=false,
      updated_at=now();

  insert into public.offers(
    id,organization_id,created_by,channel,title,summary,details,category,
    classification,destination_url,eligibility,redemption_instructions,
    starts_at,expires_at,last_verified_at,status,published_at,is_demo
  ) values
    (
      'c0e6cd08-80ad-4140-9629-baac8229e4ba','8b43f070-9a2f-4c95-81ee-2aa44d086493',v_actor,'pet',
      'PetSmart Adoption Kit coupon savings',
      'Eligible PetSmart adopters can receive an adoption kit or guide with pet-parent information and coupon savings.',
      'PetSmart currently references Adoption Kit coupons in its coupon policy, and current PetSmart adoption guidance states adopters can receive an adoption kit with tips and coupon savings. Exact contents and savings can change.',
      'adoption_savings','public_program','https://www.petsmart.com/adoption',
      'Availability is tied to eligible PetSmart adoption activity through approved adoption partners. Kit or guide contents, coupon eligibility, exclusions, and timing can vary.',
      'Use PetSmart adoption resources and the current Adoption Kit or guide provided through the eligible adoption process. Review each coupon and current PetSmart terms before purchase.',
      null,null,'2026-09-09T20:00:00-04:00','active',now(),false
    ),
    (
      '16cf5fbf-aae3-415a-97a4-f326f6b16c2f','57674342-f0cf-4e22-b76d-b91e21b7711f',v_actor,'pet',
      'Adopt a Pet Shelter Plus adopter savings',
      'Adopters from participating Shelter Plus shelters can access guidance and special discounts on food, supplies, and pet essentials.',
      'Adopt a Pet describes Shelter Plus as post-adoption support for adopters from participating Shelter Plus shelters, including trusted guidance and special discounts on commonly used pet products and essentials.',
      'adoption_savings','public_program','https://shelterplus.adoptapet.com/',
      'Available to adopters from participating Adopt a Pet Shelter Plus shelters. Individual brand offers and eligibility requirements may vary.',
      'Open the official Shelter Plus adopter site, create or use the required adopter account, and follow the provider instructions for currently available benefits.',
      null,null,'2026-09-09T20:00:00-04:00','active',now(),false
    ),
    (
      'f22ed3ec-d381-4921-8463-68ee734ce64c','a4901c2d-ee7b-4c02-be41-7fc1389848c2',v_actor,'pet',
      'PetPartners 30-day pet insurance coverage',
      'Newly adopted dogs and cats may qualify for 30 days of pet insurance coverage using an activation code from a participating shelter, rescue, or veterinarian.',
      'PetPartners currently offers 30-day coverage for eligible newly adopted dogs and cats, or pets receiving a qualifying exam, when an activation code is provided by a participating organization. No credit card is required to enroll in the 30-day coverage.',
      'pet_insurance','public_program','https://www.petpartners.com/30-day-pet-insurance-coverage',
      'An eligible dog or cat must have an activation code from a participating veterinarian, shelter, or rescue. Activation, U.S. residency, state availability, waiting periods, and other eligibility restrictions apply.',
      'Use the activation code supplied by the participating organization on the official PetPartners 30-day coverage page. Review the current policy terms before activating.',
      null,null,'2026-09-09T20:00:00-04:00','active',now(),false
    ),
    (
      '42033730-3176-442e-b9a6-2ec3cdacdd36','185f498c-3d21-4133-a5bb-a7cd8c7aba24',v_actor,'pet',
      'Trupanion Adoption Day 30-day coverage',
      'Participating shelters and rescues can send eligible adopted pets home with 30 days of immediate Trupanion coverage.',
      'Trupanion currently offers a free shelter and rescue support program that can include Adoption Day Offers providing eligible adopted pets with 30 days of immediate coverage. The exact offer available varies by organization.',
      'pet_insurance','public_program','https://www.trupanion.com/shelter',
      'The pet must be eligible through a participating shelter or rescue. Offer type, activation requirements, geography, and coverage terms vary by organization and current Trupanion rules.',
      'Ask the participating shelter or rescue whether a Trupanion Adoption Day Offer applies, then follow the official activation instructions and current coverage terms.',
      null,null,'2026-09-09T20:00:00-04:00','active',now(),false
    ),
    (
      '8807e24c-dd8f-4c9a-ba55-03ddd52ad308','3d17c12d-df3c-413b-be6b-a56fd69f2853',v_actor,'pet',
      'BISSELL Empty the Shelters — Fall 2026',
      'BISSELL Pet Foundation is sponsoring reduced adoption fees at participating shelters during its Fall National Adoption Event, September 18–30, 2026.',
      'The current Empty the Shelters page lists participating organizations for the September 18–30, 2026 national event. Each shelter controls its own adoption procedures, requirements, hours, and available pets.',
      'adoption_fee','public_program','https://www.bissellpetfoundation.org/programs/empty-the-shelters/',
      'Adoption must be completed through a participating organization under that shelter or rescue organization''s own procedures during the applicable event. Participation and pet availability vary by location.',
      'Use the official BISSELL Pet Foundation participant finder to choose a participating shelter and contact that organization for its adoption process and event details.',
      null,'2026-10-01T04:00:00Z','2026-09-09T20:00:00-04:00','active',now(),false
    )
  on conflict (id) do update
  set title=excluded.title,
      summary=excluded.summary,
      details=excluded.details,
      category=excluded.category,
      classification='public_program',
      destination_url=excluded.destination_url,
      eligibility=excluded.eligibility,
      redemption_instructions=excluded.redemption_instructions,
      starts_at=excluded.starts_at,
      expires_at=excluded.expires_at,
      last_verified_at=excluded.last_verified_at,
      status='active',
      published_at=coalesce(public.offers.published_at,now()),
      is_demo=false,
      updated_at=now();

  insert into public.offer_versions(
    id,offer_id,version_number,title,summary,details,terms,starts_at,ends_at,
    status,published_at,created_by,eligibility_kind,claim_window_days,
    redemption_instructions,source_url,disclosure
  ) values
    (
      '4aa4570e-1fd8-44ee-ad39-b0b2d82bbf9f','c0e6cd08-80ad-4140-9629-baac8229e4ba',1,
      'PetSmart Adoption Kit coupon savings',
      'Eligible PetSmart adopters can receive an adoption kit or guide with pet-parent information and coupon savings.',
      'PetSmart currently references Adoption Kit coupons in its coupon policy, and current PetSmart adoption guidance states adopters can receive an adoption kit with tips and coupon savings. Exact contents and savings can change.',
      'Adoption Kit coupons are subject to PetSmart''s current coupon policy, individual coupon expiration dates, exclusions, availability, and one-time-use rules. Official PetSmart terms control.',
      null,null,'published',now(),v_actor,'shelter_pet_enhanced',30,
      'Use PetSmart adoption resources and the current Adoption Kit or guide provided through the eligible adoption process. Review each coupon and current PetSmart terms before purchase.',
      'https://www.petsmart.com/help/payment-H0004e.html',
      'Publicly listed third-party program. ShelterPawtners is not affiliated with PetSmart, does not guarantee the availability or value of any coupon, and does not process this benefit. PetSmart''s current terms control.'
    ),
    (
      'd8804df5-323f-4cb6-8183-93ba7d6a75f2','16cf5fbf-aae3-415a-97a4-f326f6b16c2f',1,
      'Adopt a Pet Shelter Plus adopter savings',
      'Adopters from participating Shelter Plus shelters can access guidance and special discounts on food, supplies, and pet essentials.',
      'Adopt a Pet describes Shelter Plus as post-adoption support for adopters from participating Shelter Plus shelters, including trusted guidance and special discounts on commonly used pet products and essentials.',
      'Participation in Shelter Plus is required. Specific discounts, brands, redemption methods, availability, and terms can change. Official Adopt a Pet and participating-brand terms control.',
      null,null,'published',now(),v_actor,'shelter_pet_enhanced',30,
      'Open the official Shelter Plus adopter site, create or use the required adopter account, and follow the provider instructions for currently available benefits.',
      'https://shelterplus.adoptapet.com/',
      'Publicly listed third-party program. ShelterPawtners is not affiliated with Adopt a Pet or Shelter Plus and does not process or guarantee these benefits. Official program terms control.'
    ),
    (
      '0f0fded8-df0b-4e7e-bbe0-139441114204','f22ed3ec-d381-4921-8463-68ee734ce64c',1,
      'PetPartners 30-day pet insurance coverage',
      'Newly adopted dogs and cats may qualify for 30 days of pet insurance coverage using an activation code from a participating shelter, rescue, or veterinarian.',
      'PetPartners currently offers 30-day coverage for eligible newly adopted dogs and cats, or pets receiving a qualifying exam, when an activation code is provided by a participating organization. No credit card is required to enroll in the 30-day coverage.',
      'Coverage limits, deductible, coinsurance, waiting periods, exclusions, activation requirements, state availability, and other restrictions apply. This listing is not insurance advice. Official PetPartners policy terms control.',
      null,null,'published',now(),v_actor,'shelter_pet_enhanced',30,
      'Use the activation code supplied by the participating organization on the official PetPartners 30-day coverage page. Review the current policy terms before activating.',
      'https://www.petpartners.com/30-day-pet-insurance-coverage',
      'Publicly listed third-party insurance program. ShelterPawtners is not affiliated with PetPartners, is not offering or selling insurance, and does not process this coverage. Official eligibility and policy terms control.'
    ),
    (
      '521838c0-026c-4021-8da3-d34c32d13667','42033730-3176-442e-b9a6-2ec3cdacdd36',1,
      'Trupanion Adoption Day 30-day coverage',
      'Participating shelters and rescues can send eligible adopted pets home with 30 days of immediate Trupanion coverage.',
      'Trupanion currently offers a free shelter and rescue support program that can include Adoption Day Offers providing eligible adopted pets with 30 days of immediate coverage. The exact offer available varies by organization.',
      'Availability, eligibility, activation requirements, covered conditions, exclusions, and other insurance terms vary. This listing is not insurance advice. Official Trupanion terms and the participating organization''s offer control.',
      null,null,'published',now(),v_actor,'shelter_pet_enhanced',30,
      'Ask the participating shelter or rescue whether a Trupanion Adoption Day Offer applies, then follow the official activation instructions and current coverage terms.',
      'https://www.trupanion.com/shelter',
      'Publicly listed third-party insurance program. ShelterPawtners is not affiliated with Trupanion, is not offering or selling insurance, and does not process this coverage. Official eligibility and policy terms control.'
    ),
    (
      '8b8267e4-dce7-4ebf-a883-8bbdb8726e12','8807e24c-dd8f-4c9a-ba55-03ddd52ad308',1,
      'BISSELL Empty the Shelters — Fall 2026',
      'BISSELL Pet Foundation is sponsoring reduced adoption fees at participating shelters during its Fall National Adoption Event, September 18–30, 2026.',
      'The current Empty the Shelters page lists participating organizations for the September 18–30, 2026 national event. Each shelter controls its own adoption procedures, requirements, hours, and available pets.',
      'Event participation, reduced fees, pet availability, application requirements, and adoption procedures are controlled by each participating organization and may vary. Official BISSELL Pet Foundation and shelter terms control.',
      null,'2026-10-01T04:00:00Z','published',now(),v_actor,'shelter_pet_enhanced',30,
      'Use the official BISSELL Pet Foundation participant finder to choose a participating shelter and contact that organization for its adoption process and event details.',
      'https://www.bissellpetfoundation.org/programs/empty-the-shelters/',
      'Publicly listed third-party adoption event. ShelterPawtners is not affiliated with BISSELL Pet Foundation and does not control participating shelters, fees, or availability. Official event and shelter terms control.'
    )
  on conflict (id) do update
  set title=excluded.title,
      summary=excluded.summary,
      details=excluded.details,
      terms=excluded.terms,
      starts_at=excluded.starts_at,
      ends_at=excluded.ends_at,
      status='published',
      published_at=coalesce(public.offer_versions.published_at,now()),
      eligibility_kind=excluded.eligibility_kind,
      redemption_instructions=excluded.redemption_instructions,
      source_url=excluded.source_url,
      disclosure=excluded.disclosure;

  update public.offers set current_version_id='4aa4570e-1fd8-44ee-ad39-b0b2d82bbf9f'
    where id='c0e6cd08-80ad-4140-9629-baac8229e4ba';
  update public.offers set current_version_id='d8804df5-323f-4cb6-8183-93ba7d6a75f2'
    where id='16cf5fbf-aae3-415a-97a4-f326f6b16c2f';
  update public.offers set current_version_id='0f0fded8-df0b-4e7e-bbe0-139441114204'
    where id='f22ed3ec-d381-4921-8463-68ee734ce64c';
  update public.offers set current_version_id='521838c0-026c-4021-8da3-d34c32d13667'
    where id='42033730-3176-442e-b9a6-2ec3cdacdd36';
  update public.offers set current_version_id='8b8267e4-dce7-4ebf-a883-8bbdb8726e12'
    where id='8807e24c-dd8f-4c9a-ba55-03ddd52ad308';

  insert into public.offer_locations(offer_version_id,organization_location_id,applicability)
  values
    ('4aa4570e-1fd8-44ee-ad39-b0b2d82bbf9f',null,'national'),
    ('d8804df5-323f-4cb6-8183-93ba7d6a75f2',null,'national'),
    ('0f0fded8-df0b-4e7e-bbe0-139441114204',null,'national'),
    ('521838c0-026c-4021-8da3-d34c32d13667',null,'national'),
    ('8b8267e4-dce7-4ebf-a883-8bbdb8726e12',null,'national')
  on conflict do nothing;
end
$$;

commit;
