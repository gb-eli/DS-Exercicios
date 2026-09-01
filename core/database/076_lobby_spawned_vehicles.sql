-- AGV World F83 — veículos spawnados pela equipe no Campus.
create table if not exists public.lobby_spawned_vehicles (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  name text not null,
  accent text not null default '#55d9ff',
  x numeric not null,
  z numeric not null,
  heading numeric not null default 0,
  seat_capacity integer not null default 2,
  active boolean not null default true,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lobby_spawned_vehicles_kind_chk check (kind in ('car','bike','van','bus')),
  constraint lobby_spawned_vehicles_seats_chk check (seat_capacity between 1 and 8),
  constraint lobby_spawned_vehicles_x_chk check (x between -56 and 56),
  constraint lobby_spawned_vehicles_z_chk check (z between -38 and 38)
);

create index if not exists lobby_spawned_vehicles_active_idx
  on public.lobby_spawned_vehicles (active, created_at desc);

alter table public.lobby_spawned_vehicles enable row level security;
revoke all on table public.lobby_spawned_vehicles from anon, authenticated;

comment on table public.lobby_spawned_vehicles is
  'AGV World: veículos criados pela equipe e sincronizados pelo lobby-presence.';
