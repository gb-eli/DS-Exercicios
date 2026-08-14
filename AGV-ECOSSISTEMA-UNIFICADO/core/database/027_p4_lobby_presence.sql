-- Applied live in Supabase on 2026-08-14.
create table if not exists public.lobby_presence (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  class_id uuid null references public.classes(id) on delete set null,
  display_name text not null default 'Aluno',
  x double precision not null default 0,
  y double precision not null default 0,
  area text not null default 'central',
  emote text null,
  emote_until timestamptz null,
  updated_at timestamptz not null default now(),
  constraint lobby_presence_x_chk check (x between 0 and 1600),
  constraint lobby_presence_y_chk check (y between 0 and 1000),
  constraint lobby_presence_area_chk check (area in ('central','1ds','2ds','3ds','sub')),
  constraint lobby_presence_emote_chk check (emote is null or emote in ('wave','like','spark'))
);
alter table public.lobby_presence enable row level security;
revoke all on public.lobby_presence from anon;
grant select,insert,update,delete on public.lobby_presence to authenticated;

drop policy if exists lobby_presence_read_authenticated on public.lobby_presence;
create policy lobby_presence_read_authenticated on public.lobby_presence for select to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.active=true and p.must_change_password=false));
drop policy if exists lobby_presence_insert_own on public.lobby_presence;
create policy lobby_presence_insert_own on public.lobby_presence for insert to authenticated
with check (student_id=auth.uid() and exists(select 1 from public.profiles p where p.id=auth.uid() and p.active=true and p.role='student' and p.must_change_password=false));
drop policy if exists lobby_presence_update_own on public.lobby_presence;
create policy lobby_presence_update_own on public.lobby_presence for update to authenticated
using (student_id=auth.uid()) with check (student_id=auth.uid());
drop policy if exists lobby_presence_delete_own on public.lobby_presence;
create policy lobby_presence_delete_own on public.lobby_presence for delete to authenticated using (student_id=auth.uid());

create or replace function private.normalize_lobby_presence()
returns trigger language plpgsql security definer set search_path='' as $$
declare v_name text; v_class uuid;
begin
  if new.student_id <> auth.uid() then raise exception 'student_mismatch'; end if;
  select split_part(coalesce(p.full_name,'Aluno'),' ',1) into v_name
  from public.profiles p where p.id=new.student_id and p.active=true and p.role='student';
  if v_name is null then raise exception 'student_not_ready'; end if;
  select cm.class_id into v_class from public.class_memberships cm
  where cm.user_id=new.student_id and cm.active=true
  order by cm.is_primary desc, cm.joined_at asc limit 1;
  new.display_name:=left(v_name,40);
  new.class_id:=v_class;
  new.updated_at:=now();
  if new.emote_until is not null and new.emote_until > now()+interval '15 seconds' then new.emote_until:=now()+interval '15 seconds'; end if;
  return new;
end$$;
revoke all on function private.normalize_lobby_presence() from public,anon,authenticated;
grant execute on function private.normalize_lobby_presence() to service_role;
drop trigger if exists trg_normalize_lobby_presence on public.lobby_presence;
create trigger trg_normalize_lobby_presence before insert or update on public.lobby_presence
for each row execute function private.normalize_lobby_presence();
create index if not exists lobby_presence_updated_idx on public.lobby_presence(updated_at desc);
create index if not exists lobby_presence_class_idx on public.lobby_presence(class_id,updated_at desc);
