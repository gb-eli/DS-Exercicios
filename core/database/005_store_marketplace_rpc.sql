-- Loja Universal + Marketplace — RPCs de referência v0.1.0
-- Validar no projeto Supabase real e executar testes de concorrência.

create or replace function public.request_store_purchase(
  p_item_id uuid,
  p_idempotency_key text
) returns public.transaction_intents
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_item public.store_items;
  v_wallet public.wallets;
  v_intent public.transaction_intents;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;
  if length(coalesce(p_idempotency_key,'')) < 8 then raise exception 'invalid_idempotency_key'; end if;

  select * into v_item from public.store_items where id=p_item_id and is_active=true;
  if not found then raise exception 'item_unavailable'; end if;

  select * into v_wallet from public.wallets where user_id=v_user;
  if not found or v_wallet.status <> 'active' then raise exception 'wallet_unavailable'; end if;
  if v_wallet.balance < v_item.price_coins then raise exception 'insufficient_balance'; end if;

  if not v_item.stackable and exists (
    select 1 from public.inventory_instances
    where owner_user_id=v_user and item_id=v_item.id
  ) then
    raise exception 'already_owned';
  end if;

  insert into public.transaction_intents(actor_user_id,kind,payload,preview,idempotency_key,expires_at)
  values(
    v_user,
    'store_purchase',
    jsonb_build_object('item_id',v_item.id,'price_coins',v_item.price_coins),
    jsonb_build_object('item_id',v_item.id,'sku',v_item.sku,'name',v_item.name,'price_coins',v_item.price_coins,'balance_before',v_wallet.balance,'balance_after_estimated',v_wallet.balance-v_item.price_coins),
    p_idempotency_key,
    now()+interval '5 minutes'
  )
  on conflict (actor_user_id,kind,idempotency_key) do update set idempotency_key=excluded.idempotency_key
  returning * into v_intent;

  return v_intent;
end;
$$;

revoke all on function public.request_store_purchase(uuid,text) from public, anon;
grant execute on function public.request_store_purchase(uuid,text) to authenticated;

create or replace function public.confirm_store_purchase(p_intent_id uuid)
returns public.store_purchases
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_intent public.transaction_intents;
  v_item public.store_items;
  v_wallet public.wallets;
  v_inventory public.inventory_instances;
  v_purchase public.store_purchases;
  v_item_id uuid;
  v_preview_price bigint;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;

  select * into v_intent from public.transaction_intents where id=p_intent_id for update;
  if not found then raise exception 'intent_not_found'; end if;
  if v_intent.actor_user_id<>v_user or v_intent.kind<>'store_purchase' then raise exception 'intent_forbidden'; end if;

  if v_intent.status='confirmed' then
    select * into v_purchase from public.store_purchases where intent_id=v_intent.id;
    if found then return v_purchase; end if;
    raise exception 'confirmed_intent_without_purchase';
  end if;
  if v_intent.status<>'pending' then raise exception 'intent_not_pending'; end if;
  if v_intent.expires_at<=now() then
    update public.transaction_intents set status='expired' where id=v_intent.id;
    raise exception 'intent_expired';
  end if;

  v_item_id := (v_intent.payload->>'item_id')::uuid;
  v_preview_price := (v_intent.payload->>'price_coins')::bigint;

  select * into v_item from public.store_items where id=v_item_id for share;
  if not found or not v_item.is_active then raise exception 'item_unavailable'; end if;
  if v_item.price_coins<>v_preview_price then raise exception 'price_changed_reconfirm'; end if;

  select * into v_wallet from public.wallets where user_id=v_user for update;
  if not found or v_wallet.status<>'active' then raise exception 'wallet_unavailable'; end if;
  if v_wallet.balance<v_item.price_coins then raise exception 'insufficient_balance'; end if;

  if not v_item.stackable and exists (
    select 1 from public.inventory_instances where owner_user_id=v_user and item_id=v_item.id
  ) then raise exception 'already_owned'; end if;

  if v_item.price_coins>0 then
    update public.wallets
    set balance=balance-v_item.price_coins,lifetime_spent=lifetime_spent+v_item.price_coins,updated_at=now()
    where user_id=v_user returning * into v_wallet;
  end if;

  insert into public.inventory_instances(item_id,owner_user_id,source_type)
  values(v_item.id,v_user,'store') returning * into v_inventory;

  insert into public.store_purchases(buyer_user_id,item_id,inventory_instance_id,price_paid,intent_id)
  values(v_user,v_item.id,v_inventory.id,v_item.price_coins,v_intent.id)
  returning * into v_purchase;

  update public.inventory_instances set source_reference_id=v_purchase.id where id=v_inventory.id;

  insert into public.inventory_ownership_history(inventory_instance_id,from_user_id,to_user_id,event_type,reference_id)
  values(v_inventory.id,null,v_user,'store_purchase',v_purchase.id);

  if v_item.price_coins>0 then
    insert into public.wallet_ledger(user_id,entry_type,direction,amount,balance_after,reference_type,reference_id,idempotency_key,metadata)
    values(v_user,'store_purchase','debit',v_item.price_coins,v_wallet.balance,'store_purchase',v_purchase.id,'store-purchase:'||v_purchase.id::text,jsonb_build_object('item_id',v_item.id,'sku',v_item.sku));
  end if;

  update public.transaction_intents set status='confirmed',confirmed_at=now(),result_reference_id=v_purchase.id where id=v_intent.id;
  return v_purchase;
end;
$$;

revoke all on function public.confirm_store_purchase(uuid) from public, anon;
grant execute on function public.confirm_store_purchase(uuid) to authenticated;

create or replace function public.create_marketplace_listing(
  p_inventory_instance_id uuid,
  p_asking_price bigint
) returns public.marketplace_listings
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_inventory public.inventory_instances;
  v_item public.store_items;
  v_listing public.marketplace_listings;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;
  if p_asking_price is null or p_asking_price<=0 then raise exception 'invalid_price'; end if;

  select * into v_inventory from public.inventory_instances where id=p_inventory_instance_id for update;
  if not found or v_inventory.owner_user_id<>v_user then raise exception 'not_owner'; end if;
  if v_inventory.locked then raise exception 'item_locked'; end if;

  select * into v_item from public.store_items where id=v_inventory.item_id;
  if not found or not v_item.is_marketplace_sellable then raise exception 'item_not_sellable'; end if;

  insert into public.marketplace_listings(inventory_instance_id,seller_user_id,asking_price)
  values(v_inventory.id,v_user,p_asking_price)
  returning * into v_listing;

  update public.inventory_instances set locked=true where id=v_inventory.id;
  return v_listing;
end;
$$;

revoke all on function public.create_marketplace_listing(uuid,bigint) from public, anon;
grant execute on function public.create_marketplace_listing(uuid,bigint) to authenticated;

create or replace function public.cancel_marketplace_listing(p_listing_id uuid)
returns public.marketplace_listings
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_listing public.marketplace_listings;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;
  select * into v_listing from public.marketplace_listings where id=p_listing_id for update;
  if not found or v_listing.seller_user_id<>v_user then raise exception 'listing_forbidden'; end if;
  if v_listing.status<>'active' then raise exception 'listing_not_active'; end if;

  update public.marketplace_listings set status='cancelled',closed_at=now() where id=v_listing.id returning * into v_listing;
  update public.inventory_instances set locked=false where id=v_listing.inventory_instance_id and owner_user_id=v_user;
  return v_listing;
end;
$$;

revoke all on function public.cancel_marketplace_listing(uuid) from public, anon;
grant execute on function public.cancel_marketplace_listing(uuid) to authenticated;

create or replace function public.request_market_purchase(
  p_listing_id uuid,
  p_idempotency_key text
) returns public.transaction_intents
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_listing public.marketplace_listings;
  v_seller public.profiles;
  v_item public.store_items;
  v_wallet public.wallets;
  v_intent public.transaction_intents;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;
  if length(coalesce(p_idempotency_key,''))<8 then raise exception 'invalid_idempotency_key'; end if;

  select * into v_listing from public.marketplace_listings where id=p_listing_id and status='active';
  if not found then raise exception 'listing_unavailable'; end if;
  if v_listing.seller_user_id=v_user then raise exception 'cannot_buy_own_item'; end if;

  select si.* into v_item
  from public.inventory_instances ii
  join public.store_items si on si.id=ii.item_id
  where ii.id=v_listing.inventory_instance_id
    and ii.owner_user_id=v_listing.seller_user_id
    and ii.locked=true;
  if not found or not v_item.is_marketplace_sellable then raise exception 'listing_integrity_error'; end if;

  select * into v_wallet from public.wallets where user_id=v_user;
  if not found or v_wallet.status<>'active' then raise exception 'wallet_unavailable'; end if;
  if v_wallet.balance<v_listing.asking_price then raise exception 'insufficient_balance'; end if;

  select * into v_seller from public.profiles where user_id=v_listing.seller_user_id and is_active=true;
  if not found then raise exception 'seller_unavailable'; end if;

  insert into public.transaction_intents(actor_user_id,kind,payload,preview,idempotency_key,expires_at)
  values(
    v_user,
    'market_purchase',
    jsonb_build_object('listing_id',v_listing.id,'asking_price',v_listing.asking_price),
    jsonb_build_object('listing_id',v_listing.id,'item_id',v_item.id,'item_name',v_item.name,'seller_user_id',v_listing.seller_user_id,'seller_display_name',v_seller.display_name,'price_coins',v_listing.asking_price,'balance_before',v_wallet.balance,'balance_after_estimated',v_wallet.balance-v_listing.asking_price),
    p_idempotency_key,
    now()+interval '5 minutes'
  )
  on conflict (actor_user_id,kind,idempotency_key) do update set idempotency_key=excluded.idempotency_key
  returning * into v_intent;
  return v_intent;
end;
$$;

revoke all on function public.request_market_purchase(uuid,text) from public, anon;
grant execute on function public.request_market_purchase(uuid,text) to authenticated;

create or replace function public.confirm_market_purchase(p_intent_id uuid)
returns public.marketplace_sales
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_buyer uuid := auth.uid();
  v_intent public.transaction_intents;
  v_listing public.marketplace_listings;
  v_inventory public.inventory_instances;
  v_item public.store_items;
  v_buyer_wallet public.wallets;
  v_seller_wallet public.wallets;
  v_sale public.marketplace_sales;
  v_listing_id uuid;
  v_preview_price bigint;
  v_first uuid;
  v_second uuid;
begin
  if v_buyer is null then raise exception 'not_authenticated'; end if;

  select * into v_intent from public.transaction_intents where id=p_intent_id for update;
  if not found then raise exception 'intent_not_found'; end if;
  if v_intent.actor_user_id<>v_buyer or v_intent.kind<>'market_purchase' then raise exception 'intent_forbidden'; end if;

  if v_intent.status='confirmed' then
    select * into v_sale from public.marketplace_sales where intent_id=v_intent.id;
    if found then return v_sale; end if;
    raise exception 'confirmed_intent_without_sale';
  end if;
  if v_intent.status<>'pending' then raise exception 'intent_not_pending'; end if;
  if v_intent.expires_at<=now() then
    update public.transaction_intents set status='expired' where id=v_intent.id;
    raise exception 'intent_expired';
  end if;

  v_listing_id := (v_intent.payload->>'listing_id')::uuid;
  v_preview_price := (v_intent.payload->>'asking_price')::bigint;

  select * into v_listing from public.marketplace_listings where id=v_listing_id for update;
  if not found or v_listing.status<>'active' then raise exception 'listing_unavailable'; end if;
  if v_listing.seller_user_id=v_buyer then raise exception 'cannot_buy_own_item'; end if;
  if v_listing.asking_price<>v_preview_price then raise exception 'price_changed_reconfirm'; end if;

  select * into v_inventory from public.inventory_instances where id=v_listing.inventory_instance_id for update;
  if not found or v_inventory.owner_user_id<>v_listing.seller_user_id or not v_inventory.locked then raise exception 'listing_integrity_error'; end if;

  select * into v_item from public.store_items where id=v_inventory.item_id;
  if not found or not v_item.is_marketplace_sellable then raise exception 'item_not_sellable'; end if;

  v_first := least(v_buyer,v_listing.seller_user_id);
  v_second := greatest(v_buyer,v_listing.seller_user_id);
  perform 1 from public.wallets where user_id=v_first for update;
  perform 1 from public.wallets where user_id=v_second for update;

  select * into v_buyer_wallet from public.wallets where user_id=v_buyer;
  select * into v_seller_wallet from public.wallets where user_id=v_listing.seller_user_id;
  if v_buyer_wallet.status<>'active' or v_seller_wallet.status<>'active' then raise exception 'wallet_unavailable'; end if;
  if v_buyer_wallet.balance<v_listing.asking_price then raise exception 'insufficient_balance'; end if;

  update public.wallets
  set balance=balance-v_listing.asking_price,lifetime_spent=lifetime_spent+v_listing.asking_price,updated_at=now()
  where user_id=v_buyer returning * into v_buyer_wallet;

  update public.wallets
  set balance=balance+v_listing.asking_price,lifetime_earned=lifetime_earned+v_listing.asking_price,updated_at=now()
  where user_id=v_listing.seller_user_id returning * into v_seller_wallet;

  update public.inventory_instances
  set owner_user_id=v_buyer,locked=false,source_type='marketplace'
  where id=v_inventory.id;

  update public.marketplace_listings set status='sold',closed_at=now() where id=v_listing.id;

  insert into public.marketplace_sales(listing_id,inventory_instance_id,seller_user_id,buyer_user_id,sale_price,fee_amount,intent_id)
  values(v_listing.id,v_inventory.id,v_listing.seller_user_id,v_buyer,v_listing.asking_price,0,v_intent.id)
  returning * into v_sale;

  update public.inventory_instances set source_reference_id=v_sale.id where id=v_inventory.id;

  insert into public.inventory_ownership_history(inventory_instance_id,from_user_id,to_user_id,event_type,reference_id)
  values(v_inventory.id,v_listing.seller_user_id,v_buyer,'marketplace_sale',v_sale.id);

  insert into public.wallet_ledger(user_id,entry_type,direction,amount,balance_after,counterparty_user_id,reference_type,reference_id,idempotency_key,metadata)
  values
    (v_buyer,'market_sale_out','debit',v_listing.asking_price,v_buyer_wallet.balance,v_listing.seller_user_id,'marketplace_sale',v_sale.id,'market-buy:'||v_sale.id::text,jsonb_build_object('item_id',v_item.id,'listing_id',v_listing.id)),
    (v_listing.seller_user_id,'market_sale_in','credit',v_listing.asking_price,v_seller_wallet.balance,v_buyer,'marketplace_sale',v_sale.id,'market-sell:'||v_sale.id::text,jsonb_build_object('item_id',v_item.id,'listing_id',v_listing.id));

  update public.transaction_intents set status='confirmed',confirmed_at=now(),result_reference_id=v_sale.id where id=v_intent.id;
  return v_sale;
end;
$$;

revoke all on function public.confirm_market_purchase(uuid) from public, anon;
grant execute on function public.confirm_market_purchase(uuid) to authenticated;
