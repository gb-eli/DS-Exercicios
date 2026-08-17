-- AGV Education Core — schema de referência v0.1.0
-- Revisar no projeto Supabase real antes de aplicar.

create extension if not exists pgcrypto;

create table if not exists public.platforms (
  id text primary key,
  name text not null,
  current_version text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  class_label text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('student','teacher','pedagogical','admin')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table if not exists public.activity_catalog (
  platform_id text not null references public.platforms(id),
  activity_id text not null,
  name text not null,
  reward_policy text not null default 'no_economic_reward' check (reward_policy in ('server_verified','rule_validated','evidence_required','teacher_approval','no_economic_reward')),
  max_xp integer not null default 0 check (max_xp >= 0),
  max_points integer not null default 0 check (max_points >= 0),
  max_coins integer not null default 0 check (max_coins >= 0),
  repeatable boolean not null default false,
  daily_limit integer,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  primary key (platform_id, activity_id)
);

create table if not exists public.progress_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform_id text not null references public.platforms(id),
  activity_id text,
  event_type text not null,
  progress numeric(5,2) check (progress is null or (progress >= 0 and progress <= 100)),
  score numeric,
  payload jsonb not null default '{}'::jsonb,
  idempotency_key text not null,
  occurred_at timestamptz not null,
  accepted_at timestamptz not null default now(),
  unique (user_id, platform_id, idempotency_key)
);

create index if not exists progress_events_user_platform_idx on public.progress_events(user_id, platform_id, accepted_at desc);

create table if not exists public.activity_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  platform_id text not null references public.platforms(id),
  activity_id text not null,
  status text not null default 'not_started' check (status in ('not_started','started','in_progress','completed','reviewed')),
  progress numeric(5,2) not null default 0 check (progress >= 0 and progress <= 100),
  best_score numeric,
  attempts integer not null default 0 check (attempts >= 0),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  primary key (user_id, platform_id, activity_id)
);

create table if not exists public.metric_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform_id text references public.platforms(id),
  activity_id text,
  metric text not null check (metric in ('xp','points')),
  delta integer not null,
  reason text not null,
  reference_type text,
  reference_id uuid,
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique (user_id, metric, idempotency_key)
);

create index if not exists metric_ledger_user_metric_idx on public.metric_ledger(user_id, metric, created_at desc);

create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance bigint not null default 0 check (balance >= 0),
  lifetime_earned bigint not null default 0 check (lifetime_earned >= 0),
  lifetime_spent bigint not null default 0 check (lifetime_spent >= 0),
  status text not null default 'active' check (status in ('active','restricted','frozen','closed')),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  entry_type text not null check (entry_type in ('reward','admin_credit','admin_debit','store_purchase','transfer_out','transfer_in','market_sale_out','market_sale_in','market_fee','refund','migration','adjustment')),
  direction text not null check (direction in ('credit','debit')),
  amount bigint not null check (amount > 0),
  balance_after bigint not null check (balance_after >= 0),
  platform_id text references public.platforms(id),
  counterparty_user_id uuid references auth.users(id),
  reference_type text,
  reference_id uuid,
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique (user_id, idempotency_key)
);

create index if not exists wallet_ledger_user_created_idx on public.wallet_ledger(user_id, created_at desc);

create table if not exists public.transaction_intents (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('coin_transfer','store_purchase','market_purchase')),
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','expired','failed')),
  payload jsonb not null,
  preview jsonb not null,
  idempotency_key text not null,
  expires_at timestamptz not null,
  confirmed_at timestamptz,
  result_reference_id uuid,
  created_at timestamptz not null default now(),
  unique (actor_user_id, kind, idempotency_key)
);

create table if not exists public.coin_transfers (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references auth.users(id),
  to_user_id uuid not null references auth.users(id),
  amount bigint not null check (amount > 0),
  status text not null check (status in ('completed','reversed')) default 'completed',
  intent_id uuid unique references public.transaction_intents(id),
  created_at timestamptz not null default now(),
  check (from_user_id <> to_user_id)
);

create table if not exists public.store_items (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  item_type text not null default 'skin',
  description text,
  price_coins bigint not null check (price_coins >= 0),
  rarity text,
  is_active boolean not null default true,
  is_transferable boolean not null default false,
  is_marketplace_sellable boolean not null default false,
  stackable boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_instances (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.store_items(id),
  owner_user_id uuid not null references auth.users(id),
  source_type text not null check (source_type in ('store','reward','marketplace','admin','migration')),
  source_reference_id uuid,
  acquired_at timestamptz not null default now(),
  locked boolean not null default false,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists inventory_owner_idx on public.inventory_instances(owner_user_id, acquired_at desc);


create table if not exists public.inventory_ownership_history (
  id uuid primary key default gen_random_uuid(),
  inventory_instance_id uuid not null references public.inventory_instances(id),
  from_user_id uuid references auth.users(id),
  to_user_id uuid not null references auth.users(id),
  event_type text not null check (event_type in ('store_purchase','reward','marketplace_sale','admin_transfer','migration')),
  reference_id uuid,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists inventory_history_instance_idx on public.inventory_ownership_history(inventory_instance_id, created_at);

create table if not exists public.store_purchases (
  id uuid primary key default gen_random_uuid(),
  buyer_user_id uuid not null references auth.users(id),
  item_id uuid not null references public.store_items(id),
  inventory_instance_id uuid not null unique references public.inventory_instances(id),
  price_paid bigint not null check (price_paid >= 0),
  intent_id uuid unique references public.transaction_intents(id),
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  inventory_instance_id uuid not null references public.inventory_instances(id),
  seller_user_id uuid not null references auth.users(id),
  asking_price bigint not null check (asking_price > 0),
  status text not null default 'active' check (status in ('active','sold','cancelled','expired')),
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create unique index if not exists marketplace_one_active_per_instance_idx
on public.marketplace_listings(inventory_instance_id)
where status = 'active';

create table if not exists public.marketplace_sales (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null unique references public.marketplace_listings(id),
  inventory_instance_id uuid not null references public.inventory_instances(id),
  seller_user_id uuid not null references auth.users(id),
  buyer_user_id uuid not null references auth.users(id),
  sale_price bigint not null check (sale_price > 0),
  fee_amount bigint not null default 0 check (fee_amount >= 0),
  intent_id uuid unique references public.transaction_intents(id),
  created_at timestamptz not null default now(),
  check (seller_user_id <> buyer_user_id),
  check (fee_amount <= sale_price)
);

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id),
  action text not null,
  target_type text,
  target_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  category text not null,
  severity text not null check (severity in ('info','low','medium','high','critical')),
  platform_id text references public.platforms(id),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
