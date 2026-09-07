-- Correct the initial-owner scope in the preceding QA policy.  Qualifying the
-- outer table is essential here: an unqualified organization_id inside the
-- subquery would bind to the inner membership row instead.
drop policy if exists member_add on public.organization_memberships;
create policy member_add on public.organization_memberships for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.organizations o
    where o.id = public.organization_memberships.organization_id
      and o.created_by = (select auth.uid())
  )
  and not exists (
    select 1
    from public.organization_memberships existing_membership
    where existing_membership.organization_id = public.organization_memberships.organization_id
  )
);
