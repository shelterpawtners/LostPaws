-- Issue #283 hosted acceptance blocker.
-- Human/RAVE mode intentionally hides redemption_instructions, so publishing a
-- RAVE offer must not require that Pet-specific field. Pet offers retain the
-- existing stricter publish contract.
create or replace function public.set_partner_offer_state(p_offer_id uuid,p_action text) returns text
language plpgsql security definer set search_path='' as $$
declare o public.offers; v public.offer_versions; s text;
begin
  o:=private.assert_offer_manager(p_offer_id);
  select * into v from public.offer_versions where id=o.current_version_id for update;
  if p_action='publish' or p_action='resume' then
    if coalesce(trim(v.title),'')='' or coalesce(trim(v.summary),'')='' or coalesce(trim(v.terms),'')='' then
      raise exception 'Title, summary, and terms are required';
    end if;
    if o.channel='pet' and coalesce(trim(v.redemption_instructions),'')='' then
      raise exception 'Redemption instructions are required for Pet offers';
    end if;
    if v.ends_at is not null and v.ends_at<=now() then raise exception 'Expired terms cannot be published'; end if;
    s:=case when v.starts_at is not null and v.starts_at>now() then 'scheduled' else 'published' end;
    update public.offer_versions set status=s,published_at=coalesce(published_at,now()) where id=v.id;
    update public.offers set status='active',published_at=coalesce(published_at,now()),suspended_at=null where id=o.id;
  elsif p_action='pause' then s:='paused'; update public.offer_versions set status=s where id=v.id; update public.offers set status='suspended',suspended_at=now() where id=o.id;
  elsif p_action='archive' then s:='archived'; update public.offer_versions set status=s where id=v.id; update public.offers set status='expired' where id=o.id;
  elsif p_action='expire' then s:='expired'; update public.offer_versions set status=s where id=v.id; update public.offers set status='expired' where id=o.id;
  else raise exception 'Unsupported offer action'; end if;
  insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context) values(auth.uid(),'offer.'||p_action,'offer',o.id,'success',jsonb_build_object('version_id',v.id));
  return s;
end $$;
