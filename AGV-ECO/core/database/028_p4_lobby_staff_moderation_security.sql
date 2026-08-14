-- P4.1 — Lobby com equipe, moderação e hardening de primeiro acesso.
-- Aplicar após 027_p4_lobby_presence.sql.

alter table public.lobby_presence
  add column if not exists participant_role text not null default 'student',
  add column if not exists interaction_target_id uuid null references public.profiles(id) on delete set null;

do $$ begin
  alter table public.lobby_presence add constraint lobby_presence_participant_role_chk
    check (participant_role in ('student','teacher','admin','super_admin'));
exception when duplicate_object then null; end $$;

create table if not exists public.lobby_blocks (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  blocked_until timestamptz not null,
  reason text not null default 'Removido temporariamente do Lobby pela equipe.',
  actor_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lobby_blocks_reason_chk check (char_length(reason) between 1 and 300)
);
alter table public.lobby_blocks enable row level security;
revoke all on public.lobby_blocks from anon,authenticated;
grant select on public.lobby_blocks to authenticated;
drop policy if exists lobby_blocks_read_own on public.lobby_blocks;
create policy lobby_blocks_read_own on public.lobby_blocks for select to authenticated
using (student_id=(select auth.uid()));

-- A presença passa a aceitar aluno, professor e administrador autenticados.
drop policy if exists lobby_presence_read_authenticated on public.lobby_presence;
create policy lobby_presence_read_authenticated on public.lobby_presence for select to authenticated
using (
  exists(select 1 from public.profiles p
         where p.id=(select auth.uid()) and p.active=true and p.must_change_password=false)
  and not exists(select 1 from public.lobby_blocks b
                 where b.student_id=(select auth.uid()) and b.blocked_until>now())
);

drop policy if exists lobby_presence_insert_own on public.lobby_presence;
create policy lobby_presence_insert_own on public.lobby_presence for insert to authenticated
with check (
  student_id=(select auth.uid())
  and exists(select 1 from public.profiles p
             where p.id=(select auth.uid()) and p.active=true and p.must_change_password=false
               and p.role::text in ('student','teacher','admin','super_admin'))
  and not exists(select 1 from public.lobby_blocks b
                 where b.student_id=(select auth.uid()) and b.blocked_until>now())
);

drop policy if exists lobby_presence_update_own on public.lobby_presence;
create policy lobby_presence_update_own on public.lobby_presence for update to authenticated
using (student_id=(select auth.uid()))
with check (
  student_id=(select auth.uid())
  and not exists(select 1 from public.lobby_blocks b
                 where b.student_id=(select auth.uid()) and b.blocked_until>now())
);

drop policy if exists lobby_presence_delete_own on public.lobby_presence;
create policy lobby_presence_delete_own on public.lobby_presence for delete to authenticated
using (student_id=(select auth.uid()));

create or replace function private.normalize_lobby_presence()
returns trigger language plpgsql security definer set search_path='' as $$
declare
  v_name text;
  v_role text;
  v_class uuid;
begin
  if new.student_id <> auth.uid() then raise exception 'participant_mismatch'; end if;

  select split_part(trim(coalesce(p.full_name,'')),' ',1), p.role::text
    into v_name,v_role
  from public.profiles p
  where p.id=new.student_id and p.active=true and p.must_change_password=false;

  if coalesce(v_name,'')='' or v_role not in ('student','teacher','admin','super_admin') then
    raise exception 'participant_not_ready';
  end if;

  if v_role='student' and exists(
    select 1 from public.lobby_blocks b
    where b.student_id=new.student_id and b.blocked_until>now()
  ) then raise exception 'lobby_access_blocked'; end if;

  v_class:=null;
  if v_role='student' then
    select cm.class_id into v_class from public.class_memberships cm
    where cm.user_id=new.student_id and cm.active=true
    order by cm.is_primary desc, cm.joined_at asc limit 1;
    if v_class is null then raise exception 'student_without_class'; end if;
    new.display_name:=left(v_name,40);
  elsif v_role='teacher' then
    new.display_name:=left('Prof. '||v_name,40);
  elsif v_role='super_admin' then
    new.display_name:=left('ADM+ '||v_name,40);
  else
    new.display_name:=left('ADM '||v_name,40);
  end if;

  if new.interaction_target_id=new.student_id then new.interaction_target_id:=null; end if;
  if new.interaction_target_id is not null and not exists(
    select 1 from public.profiles t where t.id=new.interaction_target_id and t.active=true
  ) then new.interaction_target_id:=null; end if;

  new.participant_role:=v_role;
  new.class_id:=v_class;
  new.updated_at:=now();
  if new.emote_until is not null and new.emote_until > now()+interval '15 seconds' then
    new.emote_until:=now()+interval '15 seconds';
  end if;
  return new;
end$$;
revoke all on function private.normalize_lobby_presence() from public,anon,authenticated;
grant execute on function private.normalize_lobby_presence() to service_role;

create index if not exists lobby_presence_role_updated_idx on public.lobby_presence(participant_role,updated_at desc);
create index if not exists lobby_presence_target_idx on public.lobby_presence(interaction_target_id) where interaction_target_id is not null;
create index if not exists lobby_blocks_until_idx on public.lobby_blocks(blocked_until);

-- Remove a superfície econômica legada do cliente. Fluxos oficiais usam claim_core_reward_service via Edge Functions.
revoke execute on function public.claim_core_reward(text,text,text,text,text,jsonb,text) from public,anon,authenticated;
grant execute on function public.claim_core_reward(text,text,text,text,text,jsonb,text) to service_role;

-- Equipe não pode mais criar a própria conta usando segredo compartilhado.
-- Somente criação feita com service-role/admin e app_metadata.provisioned_by_admin=true.
create or replace function public.handle_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path to 'public','extensions'
as $$
declare
  v_staff public.staff_allowlist%rowtype;
  v_pre public.student_preregistrations%rowtype;
  v_cgm text := nullif(new.raw_user_meta_data ->> 'cgm','');
  v_email text := lower(coalesce(new.email,''));
  v_staff_provisioned boolean := coalesce((new.raw_app_meta_data ->> 'provisioned_by_admin')::boolean,false);
begin
  select * into v_staff from public.staff_allowlist
  where lower(email)=v_email and active=true limit 1;

  if found then
    if not v_staff_provisioned then raise exception 'STAFF_SELF_SIGNUP_DISABLED'; end if;
    update auth.users set email_confirmed_at=coalesce(email_confirmed_at,now()) where id=new.id;
    insert into public.profiles(id,full_name,email,role,active,must_change_password)
    values(new.id,v_staff.full_name,new.email,v_staff.role,true,true)
    on conflict(id) do update set
      full_name=excluded.full_name,email=excluded.email,role=excluded.role,
      active=true,must_change_password=true,updated_at=now();
    update public.teacher_classes set teacher_id=new.id
      where lower(teacher_email)=v_email and teacher_id is null;
    return new;
  end if;

  if v_cgm is null then raise exception 'CGM_REQUIRED'; end if;
  select * into v_pre from public.student_preregistrations
  where lower(institutional_email)=v_email and cgm=v_cgm and active=true
  limit 1 for update;
  if not found then raise exception 'STUDENT_NOT_PREREGISTERED'; end if;
  if v_pre.claimed_user_id is not null and v_pre.claimed_user_id<>new.id then
    raise exception 'STUDENT_ALREADY_CLAIMED';
  end if;

  update auth.users set email_confirmed_at=coalesce(email_confirmed_at,now()) where id=new.id;
  insert into public.profiles(id,full_name,email,cgm,role,active,must_change_password)
  values(new.id,v_pre.full_name,new.email,v_pre.cgm,'student'::user_role,true,true)
  on conflict(id) do update set
    full_name=excluded.full_name,email=excluded.email,cgm=excluded.cgm,
    role='student'::user_role,active=true,must_change_password=true,updated_at=now();
  insert into public.class_memberships(class_id,user_id,is_primary,active)
  values(v_pre.class_id,new.id,true,true)
  on conflict(class_id,user_id) do update set is_primary=true,active=true;
  update public.student_preregistrations set claimed_user_id=new.id,
    claimed_at=coalesce(claimed_at,now()),updated_at=now() where id=v_pre.id;
  return new;
end;
$$;

-- Permite ao staff resolver IDs/códigos das turmas no Lobby respeitando o escopo do professor.
drop policy if exists classes_lobby_staff_read on public.classes;
create policy classes_lobby_staff_read on public.classes for select to authenticated
using (private.staff_can_access_class(id));
