-- Checkpoint 1 QA: `created_by` bootstraps the first owner only. It must not
-- let a former owner regain authority after an administrator has revoked them.
drop policy if exists member_add on public.organization_memberships;
create policy member_add on public.organization_memberships for insert to authenticated
with check (
  (
    user_id = (select auth.uid())
    and exists (
      select 1
      from public.organizations o
      where o.id = organization_id
        and o.created_by = (select auth.uid())
    )
    and not exists (
      select 1
      from public.organization_memberships m
      where m.organization_id = organization_id
    )
  )
);
