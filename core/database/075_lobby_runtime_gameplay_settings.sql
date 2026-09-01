-- AGV World F83 — configurações globais persistentes de jogabilidade.
-- Mantém somente valores administrativos que precisam sobreviver a novas sessões.
create table if not exists public.lobby_world_runtime_settings (
  id text primary key,
  movement_multiplier numeric(4,2) not null default 1.00,
  updated_by uuid null references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint lobby_world_runtime_settings_singleton check (id = 'main'),
  constraint lobby_world_runtime_settings_movement_chk check (movement_multiplier between 0.55 and 2.25)
);

alter table public.lobby_world_runtime_settings enable row level security;
revoke all on table public.lobby_world_runtime_settings from anon, authenticated;

insert into public.lobby_world_runtime_settings (id, movement_multiplier)
values ('main', 1.00)
on conflict (id) do nothing;

comment on table public.lobby_world_runtime_settings is
  'AGV World: configurações globais persistentes de runtime controladas por staff via Edge Function.';
