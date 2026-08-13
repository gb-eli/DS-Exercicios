-- Applied to iresvqwyaqotghjssncg on 2026-08-13.
-- Transitional CTF services. Store ownership is derived from wallet_ledger until
-- canonical inventory_instances can be deployed.

create or replace function public.ctf_spend_xp_service(
  p_user_id uuid, p_platform_code text, p_challenge_id text,
  p_cost integer, p_idempotency_key text
) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_platform uuid; v_balance bigint; v_existing public.metric_ledger;
begin
  if p_user_id is null then raise exception 'user_required'; end if;
  if p_cost<0 then raise exception 'invalid_cost'; end if;
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));
  select id into v_platform from public.platforms where code=p_platform_code and active=true limit 1;
  if v_platform is null then raise exception 'platform_not_registered'; end if;
  select * into v_existing from public.metric_ledger where user_id=p_user_id and metric='xp' and idempotency_key=p_idempotency_key;
  if found then
    select coalesce(sum(delta),0) into v_balance from public.metric_ledger where user_id=p_user_id and metric='xp';
    return jsonb_build_object('ok',true,'duplicate',true,'xp',v_balance,'cost',p_cost);
  end if;
  select coalesce(sum(delta),0) into v_balance from public.metric_ledger where user_id=p_user_id and metric='xp';
  if v_balance<p_cost then raise exception 'insufficient_xp'; end if;
  insert into public.metric_ledger(user_id,platform_id,activity_id,metric,delta,reason,idempotency_key,metadata)
  values(p_user_id,v_platform,'challenge:'||p_challenge_id,'xp',-p_cost,'hint.used',p_idempotency_key,jsonb_build_object('challenge_id',p_challenge_id,'cost',p_cost));
  return jsonb_build_object('ok',true,'duplicate',false,'xp',v_balance-p_cost,'cost',p_cost);
end; $$;
revoke all on function public.ctf_spend_xp_service(uuid,text,text,integer,text) from public,anon,authenticated;
grant execute on function public.ctf_spend_xp_service(uuid,text,text,integer,text) to service_role;

create or replace function public.ctf_store_purchase_service(
  p_user_id uuid, p_platform_code text, p_item_id text,
  p_price bigint, p_idempotency_key text, p_metadata jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_platform uuid; v_wallet public.wallets; v_existing public.wallet_ledger; v_entry public.wallet_ledger; v_new_balance bigint;
begin
  if p_user_id is null then raise exception 'user_required'; end if;
  if p_price<=0 then raise exception 'paid_item_required'; end if;
  if length(coalesce(p_idempotency_key,''))<8 then raise exception 'invalid_idempotency_key'; end if;
  select id into v_platform from public.platforms where code=p_platform_code and active=true limit 1;
  if v_platform is null then raise exception 'platform_not_registered'; end if;
  select * into v_existing from public.wallet_ledger where user_id=p_user_id and idempotency_key=p_idempotency_key;
  if found then return jsonb_build_object('ok',true,'duplicate',true,'item_id',p_item_id,'wallet',jsonb_build_object('balance',v_existing.balance_after)); end if;
  if exists(select 1 from public.wallet_ledger where user_id=p_user_id and entry_type='store_purchase' and platform_id=v_platform and metadata->>'item_id'=p_item_id) then
    select * into v_wallet from public.wallets where user_id=p_user_id;
    return jsonb_build_object('ok',true,'duplicate',true,'already_owned',true,'item_id',p_item_id,'wallet',jsonb_build_object('balance',coalesce(v_wallet.balance,0)));
  end if;
  insert into public.wallets(user_id) values(p_user_id) on conflict(user_id) do nothing;
  select * into v_wallet from public.wallets where user_id=p_user_id for update;
  if v_wallet.status<>'active' then raise exception 'wallet_unavailable'; end if;
  if v_wallet.balance<p_price then raise exception 'insufficient_balance'; end if;
  v_new_balance:=v_wallet.balance-p_price;
  update public.wallets set balance=v_new_balance,lifetime_spent=lifetime_spent+p_price,updated_at=now() where user_id=p_user_id;
  insert into public.wallet_ledger(user_id,entry_type,direction,amount,balance_after,platform_id,event_type,reference_type,idempotency_key,metadata)
  values(p_user_id,'store_purchase','debit',p_price,v_new_balance,v_platform,'store.purchase','ctf_store',p_idempotency_key,coalesce(p_metadata,'{}'::jsonb)||jsonb_build_object('item_id',p_item_id)) returning * into v_entry;
  return jsonb_build_object('ok',true,'duplicate',false,'item_id',p_item_id,'transaction_id',v_entry.id,'wallet',jsonb_build_object('balance',v_new_balance,'lifetime_spent',v_wallet.lifetime_spent+p_price));
end; $$;
revoke all on function public.ctf_store_purchase_service(uuid,text,text,bigint,text,jsonb) from public,anon,authenticated;
grant execute on function public.ctf_store_purchase_service(uuid,text,text,bigint,text,jsonb) to service_role;
