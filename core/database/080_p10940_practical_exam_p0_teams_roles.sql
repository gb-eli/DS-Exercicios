-- P10940 / F94.4 HF4 — prova prática P0 para uso em sala
-- Regras: equipes normais com 3–7 integrantes; exceção individual autorizada por equipe;
-- escolha atômica de cargo pelo próprio aluno; bloqueio de entrada e identidade controlados pelo professor.

alter table public.practical_exam_sessions
  add column if not exists min_clan_size smallint not null default 3;

alter table public.practical_exam_clans
  add column if not exists join_locked boolean not null default false,
  add column if not exists individual_allowed boolean not null default false,
  add column if not exists identity_locked boolean not null default false;

-- Remove apenas checks legados de UMA coluna cujo único alvo seja max_clan_size.
-- Não removemos silenciosamente checks compostos: em uma base divergente a migration deve
-- falhar de forma segura em vez de apagar uma regra que possa proteger outro campo.
do $$
declare r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    join pg_attribute a
      on a.attrelid=c.conrelid
     and a.attnum=c.conkey[1]
    where c.conrelid='public.practical_exam_sessions'::regclass
      and c.contype='c'
      and coalesce(array_length(c.conkey,1),0)=1
      and a.attname='max_clan_size'
  loop
    execute format('alter table public.practical_exam_sessions drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.practical_exam_sessions
  drop constraint if exists practical_exam_sessions_clan_size_range;
alter table public.practical_exam_sessions
  add constraint practical_exam_sessions_clan_size_range
  check (max_clan_size between 1 and 7 and min_clan_size between 1 and max_clan_size) not valid;

create index if not exists practical_exam_members_role_lookup_idx
  on public.practical_exam_members(session_id,clan_id,role_id)
  where role_id is not null and status <> 'removed';

-- Entrada/troca de equipe: respeita lotação, bloqueio individual prévio e bloqueio geral da equipe.
create or replace function public.practical_exam_join_clan(p_session_id uuid, p_clan_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_session practical_exam_sessions%rowtype;
  v_clan practical_exam_clans%rowtype;
  v_count integer;
  v_existing practical_exam_members%rowtype;
  v_has_existing boolean := false;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;

  select * into v_session
  from practical_exam_sessions
  where id=p_session_id
  for update;
  if not found then raise exception 'session_not_found'; end if;
  if v_session.status <> 'waiting_room' then raise exception 'waiting_room_closed'; end if;

  if not exists (
    select 1
    from profiles p
    join class_memberships cm on cm.user_id=p.id and cm.class_id=v_session.class_id and cm.active=true
    where p.id=v_uid and p.active=true and p.role='student'
  ) then
    raise exception 'student_out_of_scope';
  end if;

  select * into v_clan
  from practical_exam_clans
  where id=p_clan_id and session_id=p_session_id and active=true
  for update;
  if not found then raise exception 'clan_not_found'; end if;

  select * into v_existing
  from practical_exam_members
  where session_id=p_session_id and student_id=v_uid;
  v_has_existing := found;

  if v_clan.join_locked and (not v_has_existing or v_existing.clan_id is distinct from p_clan_id) then
    raise exception 'clan_join_locked';
  end if;

  if exists (
    select 1 from practical_exam_clan_blocks b
    where b.session_id=p_session_id and b.clan_id=p_clan_id and b.student_id=v_uid and b.active=true
  ) then
    raise exception 'blocked_from_clan';
  end if;

  if v_has_existing and v_existing.clan_id is distinct from p_clan_id and v_session.allow_student_switch_before_start=false then
    raise exception 'clan_switch_disabled';
  end if;

  select count(*) into v_count
  from practical_exam_members
  where session_id=p_session_id and clan_id=p_clan_id and status<>'removed' and student_id<>v_uid;
  if v_count >= v_session.max_clan_size then raise exception 'clan_full'; end if;

  insert into practical_exam_members(session_id,student_id,clan_id,role_id,role_selected_at,status,joined_at,last_seen_at,updated_at)
  values(p_session_id,v_uid,p_clan_id,null,null,'waiting',now(),now(),now())
  on conflict(session_id,student_id) do update set
    clan_id=excluded.clan_id,
    role_id=case when practical_exam_members.clan_id=excluded.clan_id then practical_exam_members.role_id else null end,
    role_selected_at=case when practical_exam_members.clan_id=excluded.clan_id then practical_exam_members.role_selected_at else null end,
    status=case when practical_exam_members.clan_id=excluded.clan_id and practical_exam_members.role_id is not null and practical_exam_members.role_selected_at is not null then 'ready' else 'waiting' end,
    last_seen_at=now(),
    updated_at=now();

  insert into practical_exam_events(session_id,student_id,clan_id,actor_id,event_type,metadata)
  values(p_session_id,v_uid,p_clan_id,v_uid,'clan_joined','{}'::jsonb);

  return jsonb_build_object('ok',true,'clan_id',p_clan_id);
end $$;

-- O próprio aluno escolhe o cargo. O advisory lock torna a reserva do cargo serializada
-- por sessão/equipe/cargo e evita duas escolhas simultâneas para a mesma função.
create or replace function public.practical_exam_select_role(p_session_id uuid, p_role_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_session practical_exam_sessions%rowtype;
  v_member practical_exam_members%rowtype;
  v_role practical_exam_roles%rowtype;
  v_taken uuid;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;

  select * into v_session
  from practical_exam_sessions
  where id=p_session_id;
  if not found then raise exception 'session_not_found'; end if;
  if v_session.status not in ('waiting_room','locked') or v_session.started_at is not null then
    raise exception 'role_selection_closed';
  end if;

  if not exists (
    select 1
    from profiles p
    join class_memberships cm on cm.user_id=p.id and cm.class_id=v_session.class_id and cm.active=true
    where p.id=v_uid and p.active=true and p.role='student'
  ) then
    raise exception 'student_out_of_scope';
  end if;

  select * into v_member
  from practical_exam_members
  where session_id=p_session_id and student_id=v_uid and status<>'removed'
  for update;
  if not found or v_member.clan_id is null then raise exception 'join_room_first'; end if;

  select * into v_role
  from practical_exam_roles
  where id=p_role_id and session_id=p_session_id and active=true;
  if not found then raise exception 'role_not_found'; end if;

  perform pg_advisory_xact_lock(hashtext(p_session_id::text || ':' || v_member.clan_id::text || ':' || p_role_id::text));

  select student_id into v_taken
  from practical_exam_members
  where session_id=p_session_id
    and clan_id=v_member.clan_id
    and role_id=p_role_id
    and student_id<>v_uid
    and status<>'removed'
  limit 1;
  if v_taken is not null then raise exception 'role_taken'; end if;

  update practical_exam_members
  set role_id=p_role_id,
      role_selected_at=now(),
      status='ready',
      updated_at=now()
  where session_id=p_session_id and student_id=v_uid;

  insert into practical_exam_events(session_id,student_id,clan_id,actor_id,event_type,metadata)
  values(p_session_id,v_uid,v_member.clan_id,v_uid,'role_self_selected',jsonb_build_object('role_id',p_role_id));

  return jsonb_build_object('ok',true,'role_id',p_role_id,'ready',true);
end $$;

revoke all on function public.practical_exam_join_clan(uuid,uuid) from public,anon;
revoke all on function public.practical_exam_select_role(uuid,uuid) from public,anon;
grant execute on function public.practical_exam_join_clan(uuid,uuid) to authenticated;
grant execute on function public.practical_exam_select_role(uuid,uuid) to authenticated;

comment on column public.practical_exam_sessions.min_clan_size is 'Mínimo normal de integrantes por equipe; exceções individuais são controladas em practical_exam_clans.individual_allowed.';
comment on column public.practical_exam_clans.join_locked is 'Quando true, alunos não podem entrar/trocar para esta equipe; professor continua com override via Edge Function.';
comment on column public.practical_exam_clans.individual_allowed is 'Autoriza esta equipe a iniciar com exatamente um integrante, para exceção pedagógica individual.';
comment on column public.practical_exam_clans.identity_locked is 'Bloqueia alterações de identidade/empresa pelo líder; professor mantém autoridade.';
