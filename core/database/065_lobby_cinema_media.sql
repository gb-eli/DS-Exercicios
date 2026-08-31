-- v14.10.8.66 — Cinema AGV
-- Programação persistente da tela principal. Leitura por usuários ativos;
-- escrita somente por professor/admin/super_admin.

create or replace function private.lobby_cinema_active_user(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = p_user
      and p.active = true
      and p.must_change_password = false
      and p.role in ('student'::public.user_role,'teacher'::public.user_role,'admin'::public.user_role,'super_admin'::public.user_role)
  );
$$;

create or replace function private.lobby_cinema_staff(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = p_user
      and p.active = true
      and p.must_change_password = false
      and p.role in ('teacher'::public.user_role,'admin'::public.user_role,'super_admin'::public.user_role)
  );
$$;

revoke all on function private.lobby_cinema_active_user(uuid) from public, anon;
revoke all on function private.lobby_cinema_staff(uuid) from public, anon;
grant execute on function private.lobby_cinema_active_user(uuid) to authenticated;
grant execute on function private.lobby_cinema_staff(uuid) to authenticated;

create table if not exists public.lobby_cinema_media (
  id text primary key,
  enabled boolean not null default false,
  title text not null default '',
  source_type text not null default 'none',
  source_url text,
  loop boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint lobby_cinema_media_singleton check (id = 'main'),
  constraint lobby_cinema_media_source_type check (source_type in ('none','direct','youtube','vimeo')),
  constraint lobby_cinema_media_title_length check (char_length(title) <= 120),
  constraint lobby_cinema_media_url_length check (source_url is null or char_length(source_url) <= 2048),
  constraint lobby_cinema_media_enabled_source check (
    enabled = false
    or (enabled = true and source_type in ('direct','youtube','vimeo') and source_url is not null)
  )
);

insert into public.lobby_cinema_media(id,enabled,title,source_type,source_url,loop,updated_at)
values ('main',false,'','none',null,false,now())
on conflict (id) do nothing;

alter table public.lobby_cinema_media enable row level security;

revoke all on public.lobby_cinema_media from anon;
revoke all on public.lobby_cinema_media from authenticated;
grant select, insert, update on public.lobby_cinema_media to authenticated;

drop policy if exists "lobby_cinema_media_active_read" on public.lobby_cinema_media;
create policy "lobby_cinema_media_active_read"
on public.lobby_cinema_media
for select
to authenticated
using (private.lobby_cinema_active_user(auth.uid()));

drop policy if exists "lobby_cinema_media_staff_insert" on public.lobby_cinema_media;
create policy "lobby_cinema_media_staff_insert"
on public.lobby_cinema_media
for insert
to authenticated
with check (
  id = 'main'
  and updated_by = auth.uid()
  and private.lobby_cinema_staff(auth.uid())
);

drop policy if exists "lobby_cinema_media_staff_update" on public.lobby_cinema_media;
create policy "lobby_cinema_media_staff_update"
on public.lobby_cinema_media
for update
to authenticated
using (private.lobby_cinema_staff(auth.uid()))
with check (
  id = 'main'
  and updated_by = auth.uid()
  and private.lobby_cinema_staff(auth.uid())
);

comment on table public.lobby_cinema_media is
  'Programação persistente do Cinema AGV; Realtime serve só como invalidação e o cliente recarrega o estado via RLS.';
