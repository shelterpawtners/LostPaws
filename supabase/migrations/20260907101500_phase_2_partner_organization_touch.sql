-- Keep private onboarding and review records chronologically accurate.
create trigger organization_onboarding_drafts_touch
before update on public.organization_onboarding_drafts
for each row execute function private.touch();

create trigger organization_access_requests_touch
before update on public.organization_access_requests
for each row execute function private.touch();

create trigger organization_duplicate_review_cases_touch
before update on public.organization_duplicate_review_cases
for each row execute function private.touch();
