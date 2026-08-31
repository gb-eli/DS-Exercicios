-- AGV World F67 / v14.10.8.69
-- Sessões efêmeras de veículos multiplayer do Lobby.
-- Escrita exclusivamente pelo Edge Function lobby-presence (service_role).

create table if not exists public.lobby_vehicle_sessions (
  driver_id uuid primary key references public.profiles(id) on delete cascade,
  vehicle_id text not null unique,
  vehicle_name text not null,
  vehicle_kind text not null,
  seat_capacity integer not null check (seat_capacity between 1 and 12),
  x double precision not null,
  z double precision not null,
  heading double precision not null default 0,
  speed_kmh double precision not null default 0,
  updated_at timestamptz not null default now(),
  constraint lobby_vehicle_sessions_x_chk check (x between -56 and 56),
  constraint lobby_vehicle_sessions_z_chk check (z between -38 and 38),
  constraint lobby_vehicle_sessions_heading_chk check (heading between -25.2 and 25.2),
  constraint lobby_vehicle_sessions_speed_chk check (speed_kmh between -12 and 60)
);

create table if not exists public.lobby_vehicle_passengers (
  passenger_id uuid primary key references public.profiles(id) on delete cascade,
  driver_id uuid not null references public.lobby_vehicle_sessions(driver_id) on delete cascade,
  seat_index integer not null check (seat_index between 1 and 11),
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(driver_id, seat_index),
  constraint lobby_vehicle_passengers_not_driver_chk check (passenger_id <> driver_id)
);

alter table public.lobby_vehicle_sessions enable row level security;
alter table public.lobby_vehicle_passengers enable row level security;

revoke all on public.lobby_vehicle_sessions from anon, authenticated;
revoke all on public.lobby_vehicle_passengers from anon, authenticated;
grant select on public.lobby_vehicle_sessions to authenticated;
grant select on public.lobby_vehicle_passengers to authenticated;

create or replace function private.lobby_vehicle_active_user(uid uuid)
returns boolean
language sql
stable
security definer
set search_path=''
as $$
  select exists(
    select 1 from public.profiles p
    where p.id=uid and p.active=true and p.must_change_password=false
      and p.role in ('student','teacher','admin','super_admin')
  );
$$;
revoke all on function private.lobby_vehicle_active_user(uuid) from public, anon, authenticated;
grant execute on function private.lobby_vehicle_active_user(uuid) to authenticated, service_role;

drop policy if exists lobby_vehicle_sessions_read_active on public.lobby_vehicle_sessions;
create policy lobby_vehicle_sessions_read_active
on public.lobby_vehicle_sessions for select to authenticated
using (private.lobby_vehicle_active_user(auth.uid()));

drop policy if exists lobby_vehicle_passengers_read_active on public.lobby_vehicle_passengers;
create policy lobby_vehicle_passengers_read_active
on public.lobby_vehicle_passengers for select to authenticated
using (private.lobby_vehicle_active_user(auth.uid()));

create index if not exists lobby_vehicle_sessions_updated_idx on public.lobby_vehicle_sessions(updated_at desc);
create index if not exists lobby_vehicle_passengers_driver_idx on public.lobby_vehicle_passengers(driver_id, seat_index);

-- Realtime: o cliente apenas lê os estados validados pelo servidor.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='lobby_vehicle_sessions'
  ) then
    alter publication supabase_realtime add table public.lobby_vehicle_sessions;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='lobby_vehicle_passengers'
  ) then
    alter publication supabase_realtime add table public.lobby_vehicle_passengers;
  end if;
end $$;
