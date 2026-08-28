-- v14.10.8.19 R4 — persistência de progresso pedagógico e hardening pós-auditoria
-- Pode ser aplicada após 049_p10919_pedagogical_adaptations.sql.

create table if not exists public.pedagogical_adaptation_progress (
  student_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  adaptation_key text not null,
  completed_steps jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key(student_id,exercise_id,adaptation_key),
  constraint pedagogical_adaptation_progress_object check (jsonb_typeof(completed_steps)='object')
);

create index if not exists pedagogical_adaptation_progress_exercise_idx
  on public.pedagogical_adaptation_progress(exercise_id,updated_at desc);

alter table public.pedagogical_adaptation_progress enable row level security;
revoke all on table public.pedagogical_adaptation_progress from anon;
grant select,insert,update on table public.pedagogical_adaptation_progress to authenticated;

drop policy if exists pedagogical_adaptation_progress_select_own on public.pedagogical_adaptation_progress;
create policy pedagogical_adaptation_progress_select_own on public.pedagogical_adaptation_progress
  for select to authenticated
  using (student_id=(select auth.uid()));

drop policy if exists pedagogical_adaptation_progress_insert_own on public.pedagogical_adaptation_progress;
create policy pedagogical_adaptation_progress_insert_own on public.pedagogical_adaptation_progress
  for insert to authenticated
  with check (student_id=(select auth.uid()));

drop policy if exists pedagogical_adaptation_progress_update_own on public.pedagogical_adaptation_progress;
create policy pedagogical_adaptation_progress_update_own on public.pedagogical_adaptation_progress
  for update to authenticated
  using (student_id=(select auth.uid()))
  with check (student_id=(select auth.uid()));

-- Índices para FKs do módulo pedagógico que podem crescer com solicitações/progresso.
create index if not exists pedagogical_adaptation_requests_resolved_by_idx
  on public.pedagogical_adaptation_requests(resolved_by) where resolved_by is not null;
create index if not exists pedagogical_adaptation_requests_class_idx
  on public.pedagogical_adaptation_requests(class_id) where class_id is not null;
