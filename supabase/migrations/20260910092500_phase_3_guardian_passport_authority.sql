-- Phase 3 CP1: ongoing pet edit authority follows the active primary
-- guardianship, not historical row provenance. This keeps pets.created_by as
-- provenance and creates the authorization boundary needed before later
-- shelter-origin transfer work.
drop policy if exists pet_edit on public.pets;

create policy pet_edit
on public.pets
for update
to authenticated
using (
  exists (
    select 1
    from public.guardianships g
    where g.pet_id = pets.id
      and g.guardian_id = (select auth.uid())
      and g.relationship = 'primary'
      and g.status = 'active'
      and g.ended_at is null
  )
)
with check (
  exists (
    select 1
    from public.guardianships g
    where g.pet_id = pets.id
      and g.guardian_id = (select auth.uid())
      and g.relationship = 'primary'
      and g.status = 'active'
      and g.ended_at is null
  )
);
