-- RLS policies on a table cannot query that same table directly without
-- recursion.  This narrowly-scoped helper lets the first-owner policy check
-- whether an organization has already been initialized.
create or replace function private.organization_has_membership(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(
    select 1
    from public.organization_memberships
    where organization_id = p_organization_id
  );
$$;
revoke all on function private.organization_has_membership(uuid) from public;
grant execute on function private.organization_has_membership(uuid) to authenticated;

drop policy if exists member_add on public.organization_memberships;
create policy member_add on public.organization_memberships for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.organizations o
    where o.id = organization_id
      and o.created_by = (select auth.uid())
  )
  and not private.organization_has_membership(organization_id)
);
