-- AGV Ecossistema Unificado v11.3 / P4.3
-- Hardening: privilégios mínimos, IP/telemetria, geo-PR, rate limit e retenção.

-- 1) Privilégios mínimos: Lobby somente leitura direta; catálogo somente leitura.
revoke all on table public.lobby_presence from anon;
revoke truncate, references, trigger, insert, update, delete on table public.lobby_presence from authenticated;
grant select on table public.lobby_presence to authenticated;

revoke all on table public.activity_catalog from anon, authenticated;
grant select on table public.activity_catalog to authenticated;

-- 2) Escopo de turma: class_id explícito nunca cai em fallback por disciplina.
create or replace function private.exercise_belongs_to_class(p_exercise uuid,p_class uuid)
returns boolean language sql stable security definer set search_path='public','pg_temp' as $$
 select exists(
   select 1 from public.exercises e
   left join public.class_subjects cs on cs.class_id=p_class and cs.subject_id=e.subject_id and cs.active=true
   where e.id=p_exercise and e.active=true and e.visible=true
     and (e.class_id=p_class or (e.class_id is null and cs.class_id is not null))
 );
$$;

create or replace function private.staff_can_access_student_exercise(p_student uuid,p_exercise uuid)
returns boolean language sql stable security definer set search_path='public','private','pg_temp' as $$
 select private.staff_can_access_student(p_student)
   and exists(
     select 1 from public.class_memberships cm
     join public.exercises e on e.id=p_exercise and e.active=true
     left join public.class_subjects cs on cs.class_id=cm.class_id and cs.subject_id=e.subject_id and cs.active=true
     where cm.user_id=p_student and cm.active=true
       and (e.class_id=cm.class_id or (e.class_id is null and cs.class_id is not null))
   );
$$;

drop policy if exists exercise_student_content_read on public.exercise_student_content;
create policy exercise_student_content_read on public.exercise_student_content
for select to authenticated
using (
 exists (
   select 1
   from public.exercises e
   join public.class_memberships cm on cm.user_id=(select auth.uid()) and cm.active=true
   join public.profiles p on p.id=cm.user_id and p.active=true and p.must_change_password=false
   where e.id=exercise_student_content.exercise_id and e.active=true and e.visible=true
     and (
       e.class_id=cm.class_id
       or (
         e.class_id is null and exists (
           select 1 from public.class_subjects cs
           where cs.class_id=cm.class_id and cs.subject_id=e.subject_id and cs.active=true
         )
       )
     )
 )
);

-- 3) Telemetria central de segurança.
alter table public.agv_core_security_events
  add column if not exists ip_address inet,
  add column if not exists country_code text,
  add column if not exists region text,
  add column if not exists region_code text,
  add column if not exists city text,
  add column if not exists asn text,
  add column if not exists organization text,
  add column if not exists request_id text,
  add column if not exists user_agent text,
  add column if not exists risk_code text,
  add column if not exists acknowledged_by uuid references auth.users(id) on delete set null,
  add column if not exists acknowledged_at timestamptz;
create index if not exists agv_core_security_events_created_idx on public.agv_core_security_events(created_at desc);
create index if not exists agv_core_security_events_user_idx on public.agv_core_security_events(user_id,created_at desc);
create index if not exists agv_core_security_events_ip_idx on public.agv_core_security_events(ip_address,created_at desc);
create index if not exists agv_core_security_events_severity_idx on public.agv_core_security_events(severity,created_at desc);
create index if not exists agv_core_security_events_region_idx on public.agv_core_security_events(country_code,region_code,created_at desc);
create index if not exists agv_core_security_events_open_idx on public.agv_core_security_events(created_at desc) where acknowledged_at is null;

-- 4) Cache minimizado de geolocalização de IP; sem payload bruto do provedor.
create table if not exists public.security_ip_cache(
  ip_address inet primary key,
  country_code text,
  region text,
  region_code text,
  city text,
  asn text,
  organization text,
  lookup_ok boolean not null default false,
  raw jsonb not null default '{}'::jsonb,
  looked_up_at timestamptz not null default now(),
  expires_at timestamptz not null default now()
);
alter table public.security_ip_cache enable row level security;
revoke all on table public.security_ip_cache from public,anon,authenticated;
grant select,insert,update,delete on table public.security_ip_cache to service_role;
create index if not exists security_ip_cache_expiry_idx on public.security_ip_cache(expires_at);

create or replace function public.security_ip_cache_minimize_raw()
returns trigger language plpgsql security definer set search_path='public','pg_temp' as $$
begin
  new.raw='{}'::jsonb;
  return new;
end;
$$;
revoke all on function public.security_ip_cache_minimize_raw() from public,anon,authenticated;
drop trigger if exists trg_security_ip_cache_minimize_raw on public.security_ip_cache;
create trigger trg_security_ip_cache_minimize_raw
before insert or update on public.security_ip_cache
for each row execute function public.security_ip_cache_minimize_raw();
update public.security_ip_cache set raw='{}'::jsonb where raw <> '{}'::jsonb;

-- 5) Rate limit atômico usado somente pelo backend service_role.
create table if not exists public.security_rate_limits(
  rate_key text primary key,
  window_started_at timestamptz not null default now(),
  hit_count integer not null default 0,
  blocked_until timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.security_rate_limits enable row level security;
revoke all on table public.security_rate_limits from public,anon,authenticated;
grant select,insert,update,delete on table public.security_rate_limits to service_role;
create index if not exists security_rate_limits_updated_idx on public.security_rate_limits(updated_at);

create or replace function public.security_consume_rate_limit(p_key text,p_limit integer,p_window_seconds integer,p_block_seconds integer default 60)
returns jsonb language plpgsql security definer set search_path='public','pg_temp' as $$
declare
  v public.security_rate_limits%rowtype;
  v_now timestamptz:=now();
  v_retry integer:=0;
begin
  if p_key is null or length(trim(p_key))<3 or length(p_key)>500 then raise exception 'invalid_rate_key'; end if;
  if p_limit<1 or p_limit>5000 or p_window_seconds<1 or p_window_seconds>86400 or p_block_seconds<1 or p_block_seconds>86400 then raise exception 'invalid_rate_parameters'; end if;
  insert into public.security_rate_limits(rate_key,window_started_at,hit_count,updated_at)
  values(p_key,v_now,0,v_now) on conflict(rate_key) do nothing;
  select * into v from public.security_rate_limits where rate_key=p_key for update;
  if v.blocked_until is not null and v.blocked_until>v_now then
    v_retry:=greatest(1,ceil(extract(epoch from (v.blocked_until-v_now)))::integer);
    return jsonb_build_object('allowed',false,'count',v.hit_count,'retry_after',v_retry,'blocked_until',v.blocked_until);
  end if;
  if v.window_started_at + make_interval(secs=>p_window_seconds) <= v_now then
    update public.security_rate_limits set window_started_at=v_now,hit_count=1,blocked_until=null,updated_at=v_now where rate_key=p_key;
    return jsonb_build_object('allowed',true,'count',1,'retry_after',0);
  end if;
  v.hit_count:=v.hit_count+1;
  if v.hit_count>p_limit then
    update public.security_rate_limits set hit_count=v.hit_count,blocked_until=v_now+make_interval(secs=>p_block_seconds),updated_at=v_now where rate_key=p_key;
    return jsonb_build_object('allowed',false,'count',v.hit_count,'retry_after',p_block_seconds,'blocked_until',v_now+make_interval(secs=>p_block_seconds));
  end if;
  update public.security_rate_limits set hit_count=v.hit_count,blocked_until=null,updated_at=v_now where rate_key=p_key;
  return jsonb_build_object('allowed',true,'count',v.hit_count,'retry_after',0);
end;
$$;
revoke all on function public.security_consume_rate_limit(text,integer,integer,integer) from public,anon,authenticated;
grant execute on function public.security_consume_rate_limit(text,integer,integer,integer) to service_role;

-- 6) Presença do Lobby gravada somente por Edge Function service_role.
create or replace function private.normalize_lobby_presence()
returns trigger language plpgsql security definer set search_path='' as $$
declare
  v_name text;
  v_role text;
  v_class uuid;
begin
  if current_user <> 'service_role' and new.student_id <> auth.uid() then raise exception 'participant_mismatch'; end if;
  select split_part(trim(coalesce(p.full_name,'')),' ',1), p.role::text into v_name,v_role
  from public.profiles p where p.id=new.student_id and p.active=true and p.must_change_password=false;
  if coalesce(v_name,'')='' or v_role not in ('student','teacher','admin','super_admin') then raise exception 'participant_not_ready'; end if;
  if v_role='student' and exists(select 1 from public.lobby_blocks b where b.student_id=new.student_id and b.blocked_until>now()) then raise exception 'lobby_access_blocked'; end if;
  v_class:=null;
  if v_role='student' then
    select cm.class_id into v_class from public.class_memberships cm where cm.user_id=new.student_id and cm.active=true order by cm.is_primary desc,cm.joined_at asc limit 1;
    if v_class is null then raise exception 'student_without_class'; end if;
    new.display_name:=left(v_name,40);
  elsif v_role='teacher' then new.display_name:=left('Prof. '||v_name,40);
  elsif v_role='super_admin' then new.display_name:=left('ADM+ '||v_name,40);
  else new.display_name:=left('ADM '||v_name,40);
  end if;
  if new.interaction_target_id=new.student_id then new.interaction_target_id:=null; end if;
  if new.interaction_target_id is not null and not exists(select 1 from public.profiles t where t.id=new.interaction_target_id and t.active=true) then new.interaction_target_id:=null; end if;
  new.participant_role:=v_role; new.class_id:=v_class; new.updated_at:=now();
  if new.emote_until is not null and new.emote_until>now()+interval '15 seconds' then new.emote_until:=now()+interval '15 seconds'; end if;
  return new;
end$$;

-- 7) Trigger functions não são RPCs públicas.
revoke execute on function public.capture_student_file_revision() from public,anon,authenticated;
revoke execute on function public.set_teacher_classes_updated_at() from public,anon,authenticated;

-- 8) Retenção/minimização automática (a função é chamada pela Edge security-telemetry).
create table if not exists public.security_maintenance_state(
  task_name text primary key,
  last_run_at timestamptz not null default '1970-01-01'::timestamptz
);
alter table public.security_maintenance_state enable row level security;
revoke all on table public.security_maintenance_state from public,anon,authenticated;
grant select,insert,update,delete on table public.security_maintenance_state to service_role;

create or replace function public.security_prune_telemetry_service()
returns jsonb language plpgsql security definer set search_path='public','pg_temp' as $$
declare
  v_last timestamptz;
  v_events integer:=0;
  v_cache integer:=0;
  v_limits integer:=0;
begin
  insert into public.security_maintenance_state(task_name,last_run_at) values('security_prune','1970-01-01'::timestamptz) on conflict(task_name) do nothing;
  select last_run_at into v_last from public.security_maintenance_state where task_name='security_prune' for update;
  if v_last>now()-interval '1 day' then return jsonb_build_object('ok',true,'skipped',true,'last_run_at',v_last); end if;
  update public.security_maintenance_state set last_run_at=now() where task_name='security_prune';
  delete from public.agv_core_security_events where created_at<now()-interval '180 days'; get diagnostics v_events=row_count;
  delete from public.security_ip_cache where expires_at<now()-interval '7 days'; get diagnostics v_cache=row_count;
  delete from public.security_rate_limits where updated_at<now()-interval '2 days'; get diagnostics v_limits=row_count;
  return jsonb_build_object('ok',true,'skipped',false,'events_deleted',v_events,'cache_deleted',v_cache,'rate_limits_deleted',v_limits);
end;
$$;
revoke all on function public.security_prune_telemetry_service() from public,anon,authenticated;
grant execute on function public.security_prune_telemetry_service() to service_role;

-- 9) Otimização das policies autenticadas mais quentes: auth.uid() inicializado uma vez por query.
drop policy if exists legacy_claims_select_scoped on public.legacy_exercise_claims;
create policy legacy_claims_select_scoped on public.legacy_exercise_claims
for select to authenticated
using ((student_id=(select auth.uid())) or private.staff_can_access_student(student_id));

drop policy if exists activity_sessions_select_scoped on public.activity_sessions;
create policy activity_sessions_select_scoped on public.activity_sessions
for select to authenticated
using ((student_id=(select auth.uid())) or private.staff_can_access_student(student_id));

drop policy if exists exercise_releases_read_scoped_or_staff on public.exercise_releases;
create policy exercise_releases_read_scoped_or_staff on public.exercise_releases
for select to authenticated
using (
  student_id=(select auth.uid())
  or exists (
    select 1 from public.class_memberships cm
    where cm.user_id=(select auth.uid()) and cm.class_id=exercise_releases.class_id and cm.active=true
  )
  or (class_id is not null and private.staff_can_access_class(class_id))
  or (student_id is not null and private.staff_can_access_student(student_id))
);

-- 10) Índices focados nos caminhos quentes de sessão/auditoria/segurança.
create index if not exists activity_sessions_class_idx on public.activity_sessions(class_id);
create index if not exists activity_sessions_exercise_idx on public.activity_sessions(exercise_id);
create index if not exists security_events_session_idx on public.security_events(session_id);
create index if not exists security_events_ack_by_idx on public.security_events(acknowledged_by);
create index if not exists admin_audit_log_actor_idx on public.admin_audit_log(actor_user_id);
create index if not exists admin_audit_log_target_idx on public.admin_audit_log(target_user_id);
create index if not exists agv_core_security_events_ack_by_idx on public.agv_core_security_events(acknowledged_by);
create index if not exists agv_core_security_events_platform_idx on public.agv_core_security_events(platform_id);
create index if not exists lobby_blocks_actor_idx on public.lobby_blocks(actor_id);
