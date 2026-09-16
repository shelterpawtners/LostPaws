-- Issue #283 P1-A: safe delete/archive for user-owned Events.
--
-- Offers already have a working soft-archive path
-- (set_partner_offer_state('archive'), added in
-- 20260909100000_phase_2_offer_and_redemption_engine.sql) that flips
-- offers.status to a terminal state, immediately excluding it from every
-- public read policy -- no gap there. Events have no equivalent removal
-- path at all (only publish/unpublish, added for #273's P0-A), so this
-- migration adds one.
--
-- Authorization is enforced entirely inside this SECURITY DEFINER
-- function via the same private.can_manage_org / creator check the
-- existing events_update policy already uses -- never UI-only, and no
-- direct DELETE grant is added to authenticated.
--
-- Hard delete is only taken when genuinely safe. event_participants and
-- event_attendees both declare ON DELETE CASCADE on event_id, so a DELETE
-- would silently wipe attendance/participation history with no FK error
-- to catch -- existence is checked explicitly before attempting a hard
-- delete, rather than relying on that (as offers safely can, since their
-- claim/redemption tables use the default RESTRICT). Otherwise the event is
-- archived (status -> 'expired'), which every existing public read policy
-- already excludes, so it disappears from public surfaces immediately
-- while preserving history and referential integrity.
create or replace function public.remove_event(p_event_id uuid) returns text
language plpgsql security definer set search_path='' as $$
declare e public.events;
begin
  select * into e from public.events where id=p_event_id for update;
  if e.id is null then raise exception 'Event not found' using errcode='P0002'; end if;
  if not (
    (e.organization_id is not null and private.can_manage_org(e.organization_id, array['owner','administrator','publisher']))
    or (e.organization_id is null and e.created_by = (select auth.uid()))
  ) then
    raise exception 'Not authorized' using errcode='42501';
  end if;
  if exists (select 1 from public.event_participants where event_id = p_event_id)
     or exists (select 1 from public.event_attendees where event_id = p_event_id) then
    update public.events set status='expired', updated_at=now() where id=p_event_id;
    insert into private.audit_events(actor_id,action,target_type,target_id,outcome)
      values(auth.uid(),'event.archive','event',p_event_id,'success');
    return 'archived';
  end if;
  delete from public.events where id=p_event_id;
  insert into private.audit_events(actor_id,action,target_type,target_id,outcome)
    values(auth.uid(),'event.delete','event',p_event_id,'success');
  return 'deleted';
end $$;
revoke all on function public.remove_event(uuid) from public, anon;
grant execute on function public.remove_event(uuid) to authenticated;
