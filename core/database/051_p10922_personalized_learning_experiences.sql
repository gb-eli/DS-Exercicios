-- v14.10.8.20 — experiências pedagógicas personalizadas
-- Cria uma camada paralela ao fluxo convencional. Não altera, migra, recalcula,
-- apaga nem substitui student_exercises, student_files, notas, entregas ou histórico existente.

create table if not exists public.pedagogical_learning_preferences (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  adaptation_key text not null default 'support',
  programming_level text not null default 'guided'
    check (programming_level in ('essential','guided','autonomous','challenge')),
  support_focus text[] not null default '{}'::text[],
  explanation_style text not null default 'mixed'
    check (explanation_style in ('short_steps','examples','visual','mixed')),
  extra_challenges text not null default 'sometimes'
    check (extra_challenges in ('yes','sometimes','no')),
  preferred_mode text not null default 'last'
    check (preferred_mode in ('adapted','conventional','last')),
  onboarding_completed boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.pedagogical_learning_preferences enable row level security;
revoke all on table public.pedagogical_learning_preferences from anon;
grant select, insert, update on table public.pedagogical_learning_preferences to authenticated;

drop policy if exists pedagogical_learning_preferences_select_own on public.pedagogical_learning_preferences;
create policy pedagogical_learning_preferences_select_own
  on public.pedagogical_learning_preferences for select to authenticated
  using (student_id=(select auth.uid()));

drop policy if exists pedagogical_learning_preferences_insert_own on public.pedagogical_learning_preferences;
create policy pedagogical_learning_preferences_insert_own
  on public.pedagogical_learning_preferences for insert to authenticated
  with check (student_id=(select auth.uid()));

drop policy if exists pedagogical_learning_preferences_update_own on public.pedagogical_learning_preferences;
create policy pedagogical_learning_preferences_update_own
  on public.pedagogical_learning_preferences for update to authenticated
  using (student_id=(select auth.uid()))
  with check (student_id=(select auth.uid()));

create table if not exists public.pedagogical_experience_assignments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  adaptation_key text not null default 'support',
  subject_slug text not null,
  subject_name text not null,
  experience_key text not null,
  title text not null,
  purpose text not null default 'complementary'
    check (purpose in ('evaluation','recovery','complementary','extra','practice')),
  deadline timestamptz,
  extra_time_minutes integer not null default 0 check (extra_time_minutes between 0 and 1440),
  display_order integer not null default 0,
  active boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(student_id, experience_key)
);

create index if not exists pedagogical_experience_assignments_student_idx
  on public.pedagogical_experience_assignments(student_id, active, display_order, created_at);
create index if not exists pedagogical_experience_assignments_subject_idx
  on public.pedagogical_experience_assignments(student_id, subject_slug, active);

alter table public.pedagogical_experience_assignments enable row level security;
revoke all on table public.pedagogical_experience_assignments from anon, authenticated;
grant select on table public.pedagogical_experience_assignments to authenticated;

drop policy if exists pedagogical_experience_assignments_select_own on public.pedagogical_experience_assignments;
create policy pedagogical_experience_assignments_select_own
  on public.pedagogical_experience_assignments for select to authenticated
  using (student_id=(select auth.uid()));

create table if not exists public.pedagogical_experience_progress (
  assignment_id uuid not null references public.pedagogical_experience_assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'not_started'
    check (status in ('not_started','in_progress','completed')),
  progress_percent numeric(5,2) not null default 0 check (progress_percent between 0 and 100),
  completed_steps jsonb not null default '{}'::jsonb,
  responses jsonb not null default '{}'::jsonb,
  drafts jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  last_activity_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key(assignment_id, student_id),
  constraint pedagogical_experience_progress_steps_object check (jsonb_typeof(completed_steps)='object'),
  constraint pedagogical_experience_progress_responses_object check (jsonb_typeof(responses)='object'),
  constraint pedagogical_experience_progress_drafts_object check (jsonb_typeof(drafts)='object')
);

create index if not exists pedagogical_experience_progress_student_idx
  on public.pedagogical_experience_progress(student_id, updated_at desc);

alter table public.pedagogical_experience_progress enable row level security;
revoke all on table public.pedagogical_experience_progress from anon;
grant select, insert, update on table public.pedagogical_experience_progress to authenticated;

drop policy if exists pedagogical_experience_progress_select_own on public.pedagogical_experience_progress;
create policy pedagogical_experience_progress_select_own
  on public.pedagogical_experience_progress for select to authenticated
  using (student_id=(select auth.uid()));

drop policy if exists pedagogical_experience_progress_insert_own on public.pedagogical_experience_progress;
create policy pedagogical_experience_progress_insert_own
  on public.pedagogical_experience_progress for insert to authenticated
  with check (
    student_id=(select auth.uid())
    and exists (
      select 1 from public.pedagogical_experience_assignments a
      where a.id=assignment_id and a.student_id=(select auth.uid()) and a.active=true
    )
  );

drop policy if exists pedagogical_experience_progress_update_own on public.pedagogical_experience_progress;
create policy pedagogical_experience_progress_update_own
  on public.pedagogical_experience_progress for update to authenticated
  using (student_id=(select auth.uid()))
  with check (student_id=(select auth.uid()));

create table if not exists public.pedagogical_experience_events (
  id bigint generated by default as identity primary key,
  student_id uuid not null references public.profiles(id) on delete cascade,
  assignment_id uuid references public.pedagogical_experience_assignments(id) on delete set null,
  adaptation_key text,
  subject_slug text,
  event_type text not null check (event_type in (
    'offer_shown','mode_selected','experience_opened','experience_closed',
    'checkpoint_completed','checkpoint_reopened','help_requested','preference_updated',
    'assignment_started','assignment_completed','teacher_preview_opened'
  )),
  mode text check (mode is null or mode in ('adapted','conventional')),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists pedagogical_experience_events_student_idx
  on public.pedagogical_experience_events(student_id, occurred_at desc);
create index if not exists pedagogical_experience_events_assignment_idx
  on public.pedagogical_experience_events(assignment_id, occurred_at desc) where assignment_id is not null;

alter table public.pedagogical_experience_events enable row level security;
revoke all on table public.pedagogical_experience_events from anon;
grant select, insert on table public.pedagogical_experience_events to authenticated;

drop policy if exists pedagogical_experience_events_select_own on public.pedagogical_experience_events;
create policy pedagogical_experience_events_select_own
  on public.pedagogical_experience_events for select to authenticated
  using (student_id=(select auth.uid()));

drop policy if exists pedagogical_experience_events_insert_own on public.pedagogical_experience_events;
create policy pedagogical_experience_events_insert_own
  on public.pedagogical_experience_events for insert to authenticated
  with check (student_id=(select auth.uid()));

comment on table public.pedagogical_experience_assignments is
  'Atividades/experiências paralelas e individualizadas. Não substituem exercícios convencionais.';
comment on table public.pedagogical_experience_progress is
  'Progresso independente das experiências personalizadas; não altera student_exercises.';
comment on table public.pedagogical_experience_events is
  'Histórico pedagógico de escolha e uso de modos/experiências. Não é telemetria disciplinar.';
