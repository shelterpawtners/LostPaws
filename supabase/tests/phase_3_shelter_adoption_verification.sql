begin;
create extension if not exists pgtap with schema extensions;
select plan(19);

select ok(has_function_privilege('authenticated','public.request_adoption_verification(uuid,text,text,text,text,text,text,date)','execute'),'authenticated Guardian can request verification');
select ok(not has_function_privilege('anon','public.request_adoption_verification(uuid,text,text,text,text,text,text,date)','execute'),'anonymous caller cannot create verification request');
select ok(has_function_privilege('service_role','public.issue_adoption_verification_token(uuid)','execute'),'service role can issue responder token');
select ok(not has_function_privilege('authenticated','public.issue_adoption_verification_token(uuid)','execute'),'authenticated client cannot issue responder token');
select ok(has_function_privilege('anon','public.adoption_verification_by_token(text)','execute'),'anonymous responder can inspect a valid token');
select ok(has_function_privilege('anon','public.respond_to_adoption_verification(text,boolean,date,text,text,text)','execute'),'anonymous responder can answer through token boundary');

create temp table verification_vars(request_id uuid, token text, expires_at timestamptz);
grant select,insert,update on verification_vars to authenticated,anon,service_role;

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
insert into verification_vars(request_id)
values(public.request_adoption_verification(
  '30000000-0000-0000-0000-000000000001',
  'Demo Shelter B','Shelter Responder','verify@example.invalid',null,null,
  'Demo Pet A','2024-06-15'
));
select is((select status::text from public.adoption_verification_requests where id=(select request_id from verification_vars limit 1)),'submitted','Guardian request starts submitted, not verified');
select is(public.request_adoption_verification('30000000-0000-0000-0000-000000000001','Demo Shelter B','Shelter Responder','verify@example.invalid',null,null,'Demo Pet A','2024-06-15'),(select request_id from verification_vars limit 1),'open request is idempotent');

select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',true);
select throws_ok(
  $$select public.request_adoption_verification('30000000-0000-0000-0000-000000000001','Wrong Shelter',null,'wrong@example.invalid',null,null,null,null)$$,
  '42501',
  'Primary Guardian authority is required',
  'another Guardian cannot request verification for the pet'
);

reset role;
update verification_vars v
set token=t.responder_token,expires_at=t.expires_at
from public.issue_adoption_verification_token((select request_id from verification_vars limit 1)) t;
select is(length((select token from verification_vars limit 1)),64,'service receives a 64-character high-entropy responder token');
select isnt((select token from verification_vars limit 1),(select token_digest from public.adoption_verification_requests where id=(select request_id from verification_vars limit 1)),'raw token is not stored in the public request record');
select is((select count(*) from private.secure_tokens where purpose='adoption_verification' and target_id=(select request_id from verification_vars limit 1) and token_digest=encode(extensions.digest((select token from verification_vars limit 1),'sha256'),'hex'))::bigint,1::bigint,'private token store contains only the token digest');
select lives_ok($$select public.record_adoption_verification_delivery((select request_id from verification_vars limit 1),true)$$,'service records successful delivery');
select is((select extract(day from (next_reminder_at-sent_at))::integer from public.adoption_verification_requests where id=(select request_id from verification_vars limit 1)),10,'first reminder is scheduled ten days after delivery');

set local role anon;
select is((select pet_name from public.adoption_verification_by_token((select token from verification_vars limit 1))),'Demo Pet A','anonymous valid token returns minimum pet context');
select is(public.respond_to_adoption_verification((select token from verification_vars limit 1),true,'2024-06-15','Shelter Responder','Adoption coordinator','Confirmed from shelter record'),'confirmed','valid responder token confirms adoption');
select is(public.respond_to_adoption_verification((select token from verification_vars limit 1),true,'2024-06-15','Shelter Responder',null,null),'unavailable','consumed responder token cannot be replayed');

reset role;
select ok((select shelter_confirmed_at is not null from public.pets where id='30000000-0000-0000-0000-000000000001'),'confirmed response marks the pet shelter-confirmed');
select is((select status::text from public.adoption_verification_requests where id=(select request_id from verification_vars limit 1)),'confirmed','Guardian-owned request persists confirmed state');

select * from finish();
rollback;
