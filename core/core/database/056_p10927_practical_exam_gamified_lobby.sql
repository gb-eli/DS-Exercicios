-- P10927 / v14.10.8.25 — lobby geral, salas, votação de líder e empresa fictícia
-- Mantém XP, notas e respostas protegidos no backend.

alter table public.practical_exam_clans
  add column if not exists leader_id uuid references public.profiles(id) on delete set null,
  add column if not exists leader_elected_at timestamptz,
  add column if not exists theme_key text not null default 'cyber',
  add column if not exists company_name text,
  add column if not exists company_cnpj text,
  add column if not exists company_city text,
  add column if not exists company_phone text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.practical_exam_clans
  drop constraint if exists practical_exam_clans_theme_check;
alter table public.practical_exam_clans
  add constraint practical_exam_clans_theme_check
  check (theme_key in ('cyber','neon','ocean','violet','sunset','matrix','corporate','mono'));

create table if not exists public.practical_exam_leader_votes (
  session_id uuid not null references public.practical_exam_sessions(id) on delete cascade,
  clan_id uuid not null references public.practical_exam_clans(id) on delete cascade,
  voter_id uuid not null references public.profiles(id) on delete cascade,
  candidate_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (session_id, voter_id)
);
create index if not exists practical_exam_leader_votes_clan_idx
  on public.practical_exam_leader_votes(session_id, clan_id, candidate_id);

create table if not exists public.practical_exam_clan_blocks (
  session_id uuid not null references public.practical_exam_sessions(id) on delete cascade,
  clan_id uuid not null references public.practical_exam_clans(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  kicked_by uuid references public.profiles(id) on delete set null,
  active boolean not null default true,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (session_id, clan_id, student_id)
);
create index if not exists practical_exam_clan_blocks_student_idx
  on public.practical_exam_clan_blocks(session_id, student_id, active);

alter table public.practical_exam_leader_votes enable row level security;
alter table public.practical_exam_clan_blocks enable row level security;
revoke all on table public.practical_exam_leader_votes from public, anon, authenticated;
revoke all on table public.practical_exam_clan_blocks from public, anon, authenticated;

-- Aluno pode entrar/trocar de sala somente no lobby, respeitando lotação e expulsão daquela sala.
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
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  select * into v_session from practical_exam_sessions where id=p_session_id for update;
  if not found then raise exception 'session_not_found'; end if;
  if v_session.status <> 'waiting_room' then raise exception 'waiting_room_closed'; end if;
  if not exists (
    select 1 from profiles p
    join class_memberships cm on cm.user_id=p.id and cm.class_id=v_session.class_id and cm.active=true
    where p.id=v_uid and p.active=true and p.role='student'
  ) then raise exception 'student_out_of_scope'; end if;
  select * into v_clan from practical_exam_clans where id=p_clan_id and session_id=p_session_id and active=true for update;
  if not found then raise exception 'clan_not_found'; end if;
  if exists (
    select 1 from practical_exam_clan_blocks b
    where b.session_id=p_session_id and b.clan_id=p_clan_id and b.student_id=v_uid and b.active=true
  ) then raise exception 'blocked_from_clan'; end if;
  select * into v_existing from practical_exam_members where session_id=p_session_id and student_id=v_uid;
  if found and v_existing.clan_id is distinct from p_clan_id and v_session.allow_student_switch_before_start=false then
    raise exception 'clan_switch_disabled';
  end if;
  select count(*) into v_count from practical_exam_members
    where session_id=p_session_id and clan_id=p_clan_id and status<>'removed' and student_id<>v_uid;
  if v_count >= v_session.max_clan_size then raise exception 'clan_full'; end if;
  insert into practical_exam_members(session_id,student_id,clan_id,role_id,status,joined_at,last_seen_at,updated_at)
  values(p_session_id,v_uid,p_clan_id,null,'waiting',now(),now(),now())
  on conflict(session_id,student_id) do update set
    clan_id=excluded.clan_id,
    role_id=case when practical_exam_members.clan_id=excluded.clan_id then practical_exam_members.role_id else null end,
    status='waiting',last_seen_at=now(),updated_at=now();
  insert into practical_exam_events(session_id,student_id,clan_id,actor_id,event_type,metadata)
  values(p_session_id,v_uid,p_clan_id,v_uid,'clan_joined','{}'::jsonb);
  return jsonb_build_object('ok',true,'clan_id',p_clan_id);
end $$;

-- A área/função passa a ser atribuída pelo líder via Edge Function.
revoke all on function public.practical_exam_select_role(uuid,uuid) from public, anon, authenticated;
revoke all on function public.practical_exam_join_clan(uuid,uuid) from public, anon;
grant execute on function public.practical_exam_join_clan(uuid,uuid) to authenticated;

comment on table public.practical_exam_leader_votes is 'Um voto por aluno no líder de sua sala durante o pré-lobby.';
comment on table public.practical_exam_clan_blocks is 'Bloqueios de reentrada na mesma sala após expulsão pelo líder antes da prova.';
