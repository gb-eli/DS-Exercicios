-- v14.10.8.19 — perfis pedagógicos individualizados (R2 hardened)
-- IMPORTANTE: este cadastro armazena SOMENTE necessidades de interface/apoio pedagógico.
-- Informações clínicas sensíveis não são gravadas no frontend nem nas tabelas de preferência.

create schema if not exists private;

create or replace function public.normalize_student_name(p_value text)
returns text
language sql
immutable
as $$
  select trim(regexp_replace(
    translate(lower(coalesce(p_value,'')),
      'áàâãäéèêëíìîïóòôõöúùûüçñ',
      'aaaaaeeeeiiiiooooouuuucn'),
    '[^a-z0-9]+',' ','g'));
$$;

-- Roster nominal fica fora do schema público exposto pelo PostgREST.
create table if not exists private.pedagogical_adaptation_roster (
  roster_key text primary key,
  student_name text not null,
  normalized_name text not null,
  class_code text,
  profile_key text not null,
  config jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
revoke all on table private.pedagogical_adaptation_roster from public, anon, authenticated;

-- Compatibilidade: converte o modelo antigo "adapted_mode" para o novo contrato sem perder dados.
-- O default permanece convencional; perfis que devem iniciar adaptados são definidos no seed privado.
update public.student_accommodations
set accommodation_type='learning_mode',
    config = coalesce(config,'{}'::jsonb)
      || jsonb_build_object(
           'profile_key', case when coalesce(config->>'level','')='intensive' then 'reinforced' else 'guided' end,
           'default_mode', coalesce(config->>'default_mode','conventional'),
           'allow_switch', true,
           'offer_prompt', true,
           'features', jsonb_build_object(
             'short_instructions', coalesce((config->>'short_instructions')::boolean,true),
             'step_by_step', coalesce((config->>'chunk_steps')::boolean,true),
             'focus_cues', true,
             'larger_controls', coalesce((config->>'highlight_ui')::boolean,false),
             'reduced_visual_load', true,
             'predictable_feedback', true,
             'extra_checkpoints', coalesce((config->>'repeat_key_actions')::boolean,false)
           )
         ),
    updated_at=now()
where accommodation_type='adapted_mode';

update public.student_accommodation_presets
set accommodation_type='learning_mode',
    config = coalesce(config,'{}'::jsonb)
      || jsonb_build_object(
           'profile_key', case when coalesce(config->>'level','')='intensive' then 'reinforced' else 'guided' end,
           'default_mode', coalesce(config->>'default_mode','conventional'),
           'allow_switch', true,
           'offer_prompt', true,
           'features', jsonb_build_object(
             'short_instructions', coalesce((config->>'short_instructions')::boolean,true),
             'step_by_step', coalesce((config->>'chunk_steps')::boolean,true),
             'focus_cues', true,
             'larger_controls', coalesce((config->>'highlight_ui')::boolean,false),
             'reduced_visual_load', true,
             'predictable_feedback', true,
             'extra_checkpoints', coalesce((config->>'repeat_key_actions')::boolean,false)
           )
         ),
    updated_at=now()
where accommodation_type='adapted_mode';

-- Pedido do próprio aluno: registra somente que deseja apoio, sem justificativa sensível.
create table if not exists public.pedagogical_adaptation_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid references public.classes(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','approved','declined','closed')),
  request_source text not null default 'student' check (request_source in ('student','teacher','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles(id) on delete set null
);
create unique index if not exists pedagogical_adaptation_requests_one_pending
  on public.pedagogical_adaptation_requests(student_id) where status='pending';
create index if not exists pedagogical_adaptation_requests_student_created_idx
  on public.pedagogical_adaptation_requests(student_id,created_at desc);
alter table public.pedagogical_adaptation_requests enable row level security;
revoke all on table public.pedagogical_adaptation_requests from anon;
grant select,insert on table public.pedagogical_adaptation_requests to authenticated;
drop policy if exists pedagogical_adaptation_requests_select_own on public.pedagogical_adaptation_requests;
create policy pedagogical_adaptation_requests_select_own on public.pedagogical_adaptation_requests
  for select to authenticated using (student_id=(select auth.uid()));
drop policy if exists pedagogical_adaptation_requests_insert_own on public.pedagogical_adaptation_requests;
create policy pedagogical_adaptation_requests_insert_own on public.pedagogical_adaptation_requests
  for insert to authenticated with check (student_id=(select auth.uid()) and status='pending' and request_source='student' and class_id is null);

-- Preferência de modo: guarda somente "adapted"/"conventional" para persistir a escolha entre dispositivos.
create table if not exists public.pedagogical_adaptation_preferences (
  student_id uuid not null references public.profiles(id) on delete cascade,
  adaptation_key text not null,
  mode text not null check (mode in ('adapted','conventional')),
  updated_at timestamptz not null default now(),
  primary key(student_id,adaptation_key)
);
alter table public.pedagogical_adaptation_preferences enable row level security;
revoke all on table public.pedagogical_adaptation_preferences from anon;
grant select,insert,update on table public.pedagogical_adaptation_preferences to authenticated;
drop policy if exists pedagogical_adaptation_preferences_select_own on public.pedagogical_adaptation_preferences;
create policy pedagogical_adaptation_preferences_select_own on public.pedagogical_adaptation_preferences
  for select to authenticated using (student_id=(select auth.uid()));
drop policy if exists pedagogical_adaptation_preferences_insert_own on public.pedagogical_adaptation_preferences;
create policy pedagogical_adaptation_preferences_insert_own on public.pedagogical_adaptation_preferences
  for insert to authenticated with check (student_id=(select auth.uid()));
drop policy if exists pedagogical_adaptation_preferences_update_own on public.pedagogical_adaptation_preferences;
create policy pedagogical_adaptation_preferences_update_own on public.pedagogical_adaptation_preferences
  for update to authenticated using (student_id=(select auth.uid())) with check (student_id=(select auth.uid()));

-- O roster individual é cadastrado diretamente no banco por operação administrativa.
-- Nomes de alunos e informações de origem pedagógica NÃO são versionados no GitHub.

create or replace function public.apply_pedagogical_adaptation_for_profile(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path=public,private
as $$
declare
  v_name text;
  v_class_code text;
  v_row private.pedagogical_adaptation_roster%rowtype;
  v_existing uuid;
  v_applied boolean := false;
begin
  select full_name into v_name from public.profiles where id=p_user_id and active=true;
  if v_name is null then return false; end if;

  select c.code into v_class_code
  from public.class_memberships cm
  join public.classes c on c.id=cm.class_id
  where cm.user_id=p_user_id and cm.active=true and c.active=true
  order by cm.is_primary desc, cm.joined_at asc
  limit 1;

  for v_row in
    select * from private.pedagogical_adaptation_roster r
    where r.active=true
      and r.normalized_name=public.normalize_student_name(v_name)
      and (r.class_code is null or r.class_code=v_class_code)
  loop
    select id into v_existing
    from public.student_accommodations
    where student_id=p_user_id
      and exercise_id is null
      and accommodation_type='learning_mode'
    order by updated_at desc nulls last, created_at desc
    limit 1;

    if v_existing is null then
      insert into public.student_accommodations(student_id,exercise_id,accommodation_type,config,reason,active,created_by)
      values(p_user_id,null,'learning_mode',v_row.config,'Plano pedagógico individualizado definido pelo professor.',true,null);
    else
      update public.student_accommodations
      set config=v_row.config,
          reason='Plano pedagógico individualizado definido pelo professor.',
          active=true,
          updated_at=now()
      where id=v_existing;
    end if;
    v_applied:=true;
  end loop;
  return v_applied;
end;
$$;

revoke all on function public.apply_pedagogical_adaptation_for_profile(uuid) from public, anon, authenticated;

create or replace function public.trg_apply_pedagogical_adaptation_profile()
returns trigger
language plpgsql
security definer
set search_path=public,private
as $$
begin
  perform public.apply_pedagogical_adaptation_for_profile(new.id);
  return new;
end;
$$;

create or replace function public.trg_apply_pedagogical_adaptation_membership()
returns trigger
language plpgsql
security definer
set search_path=public,private
as $$
begin
  perform public.apply_pedagogical_adaptation_for_profile(new.user_id);
  return new;
end;
$$;

revoke all on function public.trg_apply_pedagogical_adaptation_profile() from public, anon, authenticated;
revoke all on function public.trg_apply_pedagogical_adaptation_membership() from public, anon, authenticated;

drop trigger if exists on_profile_apply_pedagogical_adaptation on public.profiles;
create trigger on_profile_apply_pedagogical_adaptation
after insert or update of full_name,active on public.profiles
for each row execute function public.trg_apply_pedagogical_adaptation_profile();

drop trigger if exists on_membership_apply_pedagogical_adaptation on public.class_memberships;
create trigger on_membership_apply_pedagogical_adaptation
after insert or update of class_id,active,is_primary on public.class_memberships
for each row execute function public.trg_apply_pedagogical_adaptation_membership();

-- Aplica imediatamente aos perfis que já existem; os demais serão aplicados pelo trigger ao serem cadastrados/vinculados.
do $$
declare r record;
begin
  for r in select id from public.profiles where active=true loop
    perform public.apply_pedagogical_adaptation_for_profile(r.id);
  end loop;
end $$;
