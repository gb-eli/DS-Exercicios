-- P10.9.2 — infraestrutura para auditoria de entregas históricas via GitHub.
-- IMPORTANTE: migration candidata. Não aplicar antes do backup/preflight definidos no plano mestre.
-- A primeira auditoria real deve continuar read-only: esta estrutura existe para a segunda etapa controlada.

create table if not exists public.student_repository_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  repository_url text not null,
  repository_owner text,
  repository_name text,
  repository_slug text,
  default_branch text,
  source_type text not null default 'legacy_platform',
  source_metadata jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint student_repository_submissions_url_chk
    check (repository_url ~* '^https://github\\.com/[^/]+/[^/#?]+'),
  constraint student_repository_submissions_source_chk
    check (source_type in ('legacy_platform','current_portal','manual_teacher')),
  constraint student_repository_submissions_unique
    unique (student_id, subject_id, repository_url)
);

create index if not exists student_repository_submissions_student_idx
  on public.student_repository_submissions(student_id, active);
create index if not exists student_repository_submissions_subject_idx
  on public.student_repository_submissions(subject_id, active);
create index if not exists student_repository_submissions_slug_idx
  on public.student_repository_submissions(lower(repository_slug))
  where repository_slug is not null;

create table if not exists public.student_repository_audits (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.student_repository_submissions(id) on delete cascade,
  branch text not null default 'main',
  commit_sha text not null,
  status text not null default 'pending',
  analysis_version text not null,
  started_at timestamptz,
  completed_at timestamptz,
  repository_tree_hash text,
  summary_json jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  constraint student_repository_audits_commit_chk
    check (commit_sha ~ '^[0-9a-fA-F]{40,64}$'),
  constraint student_repository_audits_status_chk
    check (status in ('pending','running','completed','partial','failed','manual_review')),
  constraint student_repository_audits_unique
    unique (submission_id, commit_sha, analysis_version)
);

create index if not exists student_repository_audits_submission_idx
  on public.student_repository_audits(submission_id, created_at desc);
create index if not exists student_repository_audits_status_idx
  on public.student_repository_audits(status, created_at desc);

create table if not exists public.student_repository_exercise_audits (
  id uuid primary key default gen_random_uuid(),
  repository_audit_id uuid not null references public.student_repository_audits(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  repository_path text,
  mapping_confidence numeric(5,4),
  mapping_method text,
  matched_reference_version_id uuid references public.exercise_reference_file_versions(id) on delete set null,
  reference_similarity numeric(5,4),
  reference_match text,
  functional_status text not null default 'manual_review',
  severity smallint not null default 0,
  requirements_score numeric(6,2),
  suggested_score numeric(6,2),
  analysis_json jsonb not null default '{}'::jsonb,
  feedback_suggested text,
  teacher_decision text,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  constraint student_repository_exercise_audits_mapping_confidence_chk
    check (mapping_confidence is null or (mapping_confidence between 0 and 1)),
  constraint student_repository_exercise_audits_reference_similarity_chk
    check (reference_similarity is null or (reference_similarity between 0 and 1)),
  constraint student_repository_exercise_audits_severity_chk
    check (severity between 0 and 4),
  constraint student_repository_exercise_audits_functional_status_chk
    check (functional_status in (
      'correct','correct_historical','correct_custom','partial','mixed_versions',
      'incomplete','nonfunctional','not_found','manual_review'
    )),
  constraint student_repository_exercise_audits_reference_match_chk
    check (reference_match is null or reference_match in ('current','legacy','mixed','custom','indeterminate')),
  constraint student_repository_exercise_audits_teacher_decision_chk
    check (teacher_decision is null or teacher_decision in ('approved','score_adjusted','request_fix','mark_correct','not_corresponding','review')),
  constraint student_repository_exercise_audits_unique
    unique (repository_audit_id, exercise_id)
);

create index if not exists student_repository_exercise_audits_student_idx
  on public.student_repository_exercise_audits(student_id, created_at desc);
create index if not exists student_repository_exercise_audits_exercise_idx
  on public.student_repository_exercise_audits(exercise_id, created_at desc);
create index if not exists student_repository_exercise_audits_review_idx
  on public.student_repository_exercise_audits(functional_status, teacher_decision, created_at desc);

create table if not exists public.student_repository_audit_files (
  id uuid primary key default gen_random_uuid(),
  repository_exercise_audit_id uuid not null references public.student_repository_exercise_audits(id) on delete cascade,
  repository_path text not null,
  filename text not null,
  language text,
  blob_sha text,
  content_sha256 text,
  size_bytes bigint,
  analysis_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint student_repository_audit_files_unique
    unique (repository_exercise_audit_id, repository_path)
);

create index if not exists student_repository_audit_files_exercise_idx
  on public.student_repository_audit_files(repository_exercise_audit_id);

-- Nenhuma tabela histórica GitHub é gravável diretamente pelo cliente.
-- O fluxo de escrita deverá ser service-role/Edge Function e, para baixa/nota, com aprovação humana.

alter table public.student_repository_submissions enable row level security;
alter table public.student_repository_audits enable row level security;
alter table public.student_repository_exercise_audits enable row level security;
alter table public.student_repository_audit_files enable row level security;

revoke all on public.student_repository_submissions from anon, authenticated;
revoke all on public.student_repository_audits from anon, authenticated;
revoke all on public.student_repository_exercise_audits from anon, authenticated;
revoke all on public.student_repository_audit_files from anon, authenticated;

grant select on public.student_repository_submissions to authenticated;
grant select on public.student_repository_audits to authenticated;
grant select on public.student_repository_exercise_audits to authenticated;
grant select on public.student_repository_audit_files to authenticated;

-- Painel do professor/staff: leitura das evidências e resultados de auditoria.
drop policy if exists student_repository_submissions_staff_read on public.student_repository_submissions;
create policy student_repository_submissions_staff_read
on public.student_repository_submissions for select to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.active = true
      and p.role <> 'student'::public.user_role
  )
);

drop policy if exists student_repository_audits_staff_read on public.student_repository_audits;
create policy student_repository_audits_staff_read
on public.student_repository_audits for select to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.active = true
      and p.role <> 'student'::public.user_role
  )
);

drop policy if exists student_repository_exercise_audits_staff_read on public.student_repository_exercise_audits;
create policy student_repository_exercise_audits_staff_read
on public.student_repository_exercise_audits for select to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.active = true
      and p.role <> 'student'::public.user_role
  )
);

drop policy if exists student_repository_audit_files_staff_read on public.student_repository_audit_files;
create policy student_repository_audit_files_staff_read
on public.student_repository_audit_files for select to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.active = true
      and p.role <> 'student'::public.user_role
  )
);

-- Importação candidata dos vínculos existentes. Somente novas tabelas recebem dados.
-- legacy_exercise_claims e student_exercises NÃO são modificadas aqui.
insert into public.student_repository_submissions
  (student_id, subject_id, repository_url, repository_owner, repository_name, repository_slug, source_type, source_metadata)
select distinct
  lec.student_id,
  e.subject_id,
  lec.repository_url,
  split_part(regexp_replace(lec.repository_url, '^https?://github\\.com/', '', 'i'), '/', 1),
  regexp_replace(split_part(regexp_replace(lec.repository_url, '^https?://github\\.com/', '', 'i'), '/', 2), '\\.git$', '', 'i'),
  split_part(regexp_replace(lec.repository_url, '^https?://github\\.com/', '', 'i'), '/', 1)
    || '/' ||
  regexp_replace(split_part(regexp_replace(lec.repository_url, '^https?://github\\.com/', '', 'i'), '/', 2), '\\.git$', '', 'i'),
  'legacy_platform',
  jsonb_build_object(
    'legacy_claim_rows', (
      select count(*)
      from public.legacy_exercise_claims x
      join public.exercises ex on ex.id=x.exercise_id
      where x.student_id=lec.student_id
        and ex.subject_id=e.subject_id
        and x.repository_url=lec.repository_url
    ),
    'imported_from', 'legacy_exercise_claims'
  )
from public.legacy_exercise_claims lec
join public.exercises e on e.id=lec.exercise_id
where lec.repository_url ~* '^https://github\\.com/'
on conflict (student_id, subject_id, repository_url) do nothing;

-- Gatilho simples de updated_at apenas para o vínculo do repositório.
create or replace function private.set_student_repository_submission_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_student_repository_submission_updated_at() from public, anon, authenticated;

drop trigger if exists trg_student_repository_submissions_updated_at on public.student_repository_submissions;
create trigger trg_student_repository_submissions_updated_at
before update on public.student_repository_submissions
for each row execute function private.set_student_repository_submission_updated_at();
