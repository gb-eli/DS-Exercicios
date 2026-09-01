-- AGV World F84 — sessão aérea sincronizada + presença vertical.
-- Aplicar após 076_lobby_spawned_vehicles.sql.

alter table public.lobby_presence
  add column if not exists altitude double precision not null default 0,
  add column if not exists movement_mode text not null default 'ground';

do $$ begin
  alter table public.lobby_presence add constraint lobby_presence_altitude_chk
    check (altitude between 0 and 180);
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.lobby_presence add constraint lobby_presence_movement_mode_chk
    check (movement_mode in ('ground','plane','freefall','parachute'));
exception when duplicate_object then null; end $$;

create table if not exists public.lobby_airdrop_sessions (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'active',
  started_at timestamptz not null,
  expires_at timestamptz not null,
  altitude double precision not null default 96,
  flight_ms integer not null default 28000,
  from_x double precision not null default -72,
  from_z double precision not null default -28,
  to_x double precision not null default 72,
  to_z double precision not null default 28,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint lobby_airdrop_status_chk check (status in ('active','completed','cancelled')),
  constraint lobby_airdrop_altitude_chk check (altitude between 55 and 150),
  constraint lobby_airdrop_flight_ms_chk check (flight_ms between 16000 and 45000)
);

alter table public.lobby_airdrop_sessions enable row level security;
revoke all on table public.lobby_airdrop_sessions from anon, authenticated;

create index if not exists lobby_airdrop_sessions_active_idx
  on public.lobby_airdrop_sessions(status, expires_at desc);

comment on table public.lobby_airdrop_sessions is
  'AGV World: partidas aéreas iniciadas pela equipe. Acesso de cliente somente via Edge Function lobby-presence.';
