-- RPCs econômicas de referência.
-- Estas funções são operações autorizadas ao próprio usuário e devem ser testadas/adaptadas no Supabase real.

create or replace function public.request_coin_transfer(
  p_to_user_id uuid,
  p_amount bigint,
  p_idempotency_key text
) returns public.transaction_intents
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_wallet public.wallets;
  v_target public.profiles;
  v_intent public.transaction_intents;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;
  if p_to_user_id is null or p_to_user_id = v_user then raise exception 'invalid_destination'; end if;
  if p_amount is null or p_amount <= 0 then raise exception 'invalid_amount'; end if;
  if length(coalesce(p_idempotency_key,'')) < 8 then raise exception 'invalid_idempotency_key'; end if;

  select * into v_wallet from public.wallets where user_id = v_user;
  if not found or v_wallet.status <> 'active' then raise exception 'wallet_unavailable'; end if;
  if v_wallet.balance < p_amount then raise exception 'insufficient_balance'; end if;

  select * into v_target from public.profiles where user_id = p_to_user_id and is_active = true;
  if not found then raise exception 'destination_unavailable'; end if;

  insert into public.transaction_intents(actor_user_id, kind, payload, preview, idempotency_key, expires_at)
  values (
    v_user,
    'coin_transfer',
    jsonb_build_object('to_user_id', p_to_user_id, 'amount', p_amount),
    jsonb_build_object('to_user_id', p_to_user_id, 'to_display_name', v_target.display_name, 'amount', p_amount, 'balance_before', v_wallet.balance, 'balance_after_estimated', v_wallet.balance - p_amount),
    p_idempotency_key,
    now() + interval '5 minutes'
  )
  on conflict (actor_user_id, kind, idempotency_key) do update set idempotency_key = excluded.idempotency_key
  returning * into v_intent;

  return v_intent;
end;
$$;

revoke all on function public.request_coin_transfer(uuid,bigint,text) from public, anon;
grant execute on function public.request_coin_transfer(uuid,bigint,text) to authenticated;

create or replace function public.confirm_coin_transfer(p_intent_id uuid)
returns public.coin_transfers
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_intent public.transaction_intents;
  v_to uuid;
  v_amount bigint;
  v_from_wallet public.wallets;
  v_to_wallet public.wallets;
  v_transfer public.coin_transfers;
  v_first uuid;
  v_second uuid;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;

  select * into v_intent from public.transaction_intents where id = p_intent_id for update;
  if not found then raise exception 'intent_not_found'; end if;
  if v_intent.actor_user_id <> v_user or v_intent.kind <> 'coin_transfer' then raise exception 'intent_forbidden'; end if;

  if v_intent.status = 'confirmed' then
    select * into v_transfer from public.coin_transfers where intent_id = v_intent.id;
    if found then return v_transfer; end if;
    raise exception 'confirmed_intent_without_transfer';
  end if;

  if v_intent.status <> 'pending' then raise exception 'intent_not_pending'; end if;
  if v_intent.expires_at <= now() then
    update public.transaction_intents set status = 'expired' where id = v_intent.id;
    raise exception 'intent_expired';
  end if;

  v_to := (v_intent.payload->>'to_user_id')::uuid;
  v_amount := (v_intent.payload->>'amount')::bigint;
  if v_to is null or v_to = v_user or v_amount <= 0 then raise exception 'invalid_intent_payload'; end if;

  -- lock determinístico para reduzir deadlocks
  v_first := least(v_user, v_to);
  v_second := greatest(v_user, v_to);
  perform 1 from public.wallets where user_id = v_first for update;
  perform 1 from public.wallets where user_id = v_second for update;

  select * into v_from_wallet from public.wallets where user_id = v_user;
  select * into v_to_wallet from public.wallets where user_id = v_to;
  if v_from_wallet.status <> 'active' or v_to_wallet.status <> 'active' then raise exception 'wallet_unavailable'; end if;
  if v_from_wallet.balance < v_amount then raise exception 'insufficient_balance'; end if;

  update public.wallets
  set balance = balance - v_amount, lifetime_spent = lifetime_spent + v_amount, updated_at = now()
  where user_id = v_user
  returning * into v_from_wallet;

  update public.wallets
  set balance = balance + v_amount, lifetime_earned = lifetime_earned + v_amount, updated_at = now()
  where user_id = v_to
  returning * into v_to_wallet;

  insert into public.coin_transfers(from_user_id,to_user_id,amount,intent_id)
  values(v_user,v_to,v_amount,v_intent.id)
  returning * into v_transfer;

  insert into public.wallet_ledger(user_id,entry_type,direction,amount,balance_after,counterparty_user_id,reference_type,reference_id,idempotency_key)
  values
    (v_user,'transfer_out','debit',v_amount,v_from_wallet.balance,v_to,'coin_transfer',v_transfer.id,'transfer-out:'||v_transfer.id::text),
    (v_to,'transfer_in','credit',v_amount,v_to_wallet.balance,v_user,'coin_transfer',v_transfer.id,'transfer-in:'||v_transfer.id::text);

  update public.transaction_intents
  set status='confirmed', confirmed_at=now(), result_reference_id=v_transfer.id
  where id=v_intent.id;

  return v_transfer;
end;
$$;

revoke all on function public.confirm_coin_transfer(uuid) from public, anon;
grant execute on function public.confirm_coin_transfer(uuid) to authenticated;
