-- Phase 2 Checkpoint 6: bind provider-agnostic Partner contribution accruals
-- to trusted redemption state without replacing the CP5 confirmation RPC.

create or replace function private.accrue_partner_redemption_contributions(p_redemption_id uuid)
returns void
language plpgsql security definer set search_path='' as $$
declare
  r public.redemptions;
  c public.partner_contribution_commitments;
  amount bigint;
  event_id uuid;
begin
  select rr.* into r
  from public.redemptions rr
  join public.organizations o on o.id=rr.partner_organization_id
  where rr.id=p_redemption_id
    and rr.status='confirmed'
    and rr.is_demo=false
    and o.is_demo=false;
  if r.id is null then return; end if;

  for c in
    select *
    from public.partner_contribution_commitments pc
    where pc.partner_organization_id=r.partner_organization_id
      and pc.status='active'
      and pc.is_demo=false
      and pc.commitment_kind in ('fixed_per_redemption','percent_of_paid_amount')
      and (pc.starts_at is null or pc.starts_at<=coalesce(r.confirmed_at,now()))
      and (pc.ends_at is null or pc.ends_at>coalesce(r.confirmed_at,now()))
    order by pc.created_at,pc.id
  loop
    if c.commitment_kind='fixed_per_redemption' then
      amount:=c.amount_minor;
    elsif r.paid_amount_minor is not null then
      amount:=floor((r.paid_amount_minor::numeric*c.percentage_bps::numeric)/10000)::bigint;
    else
      amount:=null;
    end if;

    if coalesce(amount,0)>0 and not exists(
      select 1 from public.donation_intents di
      where di.commitment_id=c.id and di.redemption_id=r.id
    ) then
      event_id:=gen_random_uuid();
      insert into public.economic_events(
        id,event_type,source_type,source_id,status,effective_at,finalized_at,created_by,is_demo,metadata
      ) values(
        event_id,'donation_intent','partner_contribution_commitment',c.id,'finalized',
        coalesce(r.confirmed_at,now()),now(),r.confirmed_by,false,
        jsonb_build_object(
          'redemption_id',r.id,
          'partner_organization_id',r.partner_organization_id,
          'commitment_id',c.id,
          'designated_recipient_organization_id',c.designated_recipient_organization_id
        )
      );
      insert into public.economic_event_lines(
        economic_event_id,line_type,account_reference,amount_minor,currency_code
      ) values(event_id,'partner_contribution_accrual',r.partner_organization_id::text,amount,c.currency_code);
      insert into public.donation_intents(
        partner_organization_id,source_type,source_id,amount_minor,currency_code,status,is_demo,
        commitment_id,designated_recipient_organization_id,redemption_id,economic_event_id
      ) values(
        r.partner_organization_id,'redemption',r.id,amount,c.currency_code,'accrued',false,
        c.id,c.designated_recipient_organization_id,r.id,event_id
      );
      insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
      values(r.confirmed_by,'partner_contribution.accrue','redemption',r.id,'success',
        jsonb_build_object('commitment_id',c.id,'amount_minor',amount,'currency_code',c.currency_code));
    end if;
  end loop;
end $$;
revoke all on function private.accrue_partner_redemption_contributions(uuid) from public,anon,authenticated;

create or replace function private.reverse_partner_redemption_contributions(p_redemption_id uuid)
returns void
language plpgsql security definer set search_path='' as $$
declare
  i public.donation_intents;
  reversal_event_id uuid;
begin
  for i in
    select *
    from public.donation_intents di
    where di.redemption_id=p_redemption_id
      and di.status in ('accrued','ready')
      and di.is_demo=false
    order by di.created_at,di.id
    for update
  loop
    reversal_event_id:=gen_random_uuid();
    insert into public.economic_events(
      id,event_type,source_type,source_id,reverses_event_id,status,effective_at,finalized_at,
      created_by,is_demo,metadata
    ) values(
      reversal_event_id,'reversal','donation_intent',i.id,i.economic_event_id,'finalized',
      now(),now(),auth.uid(),false,
      jsonb_build_object('redemption_id',p_redemption_id,'reason_code','redemption_reversed')
    );
    insert into public.economic_event_lines(
      economic_event_id,line_type,account_reference,amount_minor,currency_code
    ) values(
      reversal_event_id,'partner_contribution_accrual_reversal',i.partner_organization_id::text,
      -i.amount_minor,i.currency_code
    );
    update public.donation_intents
      set status='cancelled',cancelled_at=now(),cancellation_reason='redemption_reversed'
      where id=i.id;
    insert into private.audit_events(actor_id,action,target_type,target_id,outcome,context)
    values(auth.uid(),'partner_contribution.accrual_reverse','donation_intent',i.id,'success',
      jsonb_build_object('redemption_id',p_redemption_id,'reversal_event_id',reversal_event_id));
  end loop;
end $$;
revoke all on function private.reverse_partner_redemption_contributions(uuid) from public,anon,authenticated;

create or replace function private.sync_partner_contribution_accruals()
returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if tg_op='INSERT' and new.status='confirmed' then
    perform private.accrue_partner_redemption_contributions(new.id);
  elsif tg_op='UPDATE' and old.status='confirmed' and new.status='reversed' then
    perform private.reverse_partner_redemption_contributions(new.id);
  end if;
  return new;
end $$;
revoke all on function private.sync_partner_contribution_accruals() from public,anon,authenticated;

drop trigger if exists redemptions_partner_contribution_accruals on public.redemptions;
create trigger redemptions_partner_contribution_accruals
after insert or update of status on public.redemptions
for each row execute function private.sync_partner_contribution_accruals();
