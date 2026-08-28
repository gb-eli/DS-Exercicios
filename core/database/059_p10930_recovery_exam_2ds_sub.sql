-- Recuperação 2DS Sub — Front-End + Mobile I
-- v1.0.0 / 2026-08-27
-- Gabarito, pontuação, tentativas, métricas e intervenções ficam no backend.

create extension if not exists pgcrypto;

create table if not exists public.recovery_exam_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  subject_key text not null check (subject_key in ('frontend_sub','mobile_sub')),
  subject_name text not null,
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','review','waiting','running','paused','finished','published','cancelled')),
  max_score numeric(5,2) not null default 5.00 check (max_score > 0),
  duration_minutes integer not null default 40 check (duration_minutes between 10 and 180),
  review_required boolean not null default true,
  review_card_count integer not null default 1 check (review_card_count > 0),
  started_at timestamptz,
  paused_at timestamptz,
  pause_total_seconds integer not null default 0,
  finished_at timestamptz,
  published_at timestamptz,
  double_xp_until timestamptz,
  global_message text,
  global_effect text,
  global_effect_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists recovery_exam_sessions_class_idx on public.recovery_exam_sessions(class_id,status,created_at desc);
create index if not exists recovery_exam_sessions_created_by_idx on public.recovery_exam_sessions(created_by);

create table if not exists public.recovery_exam_questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.recovery_exam_sessions(id) on delete cascade,
  question_key text not null,
  display_order integer not null,
  topic text not null,
  prompt text not null,
  question_type text not null check (question_type in ('single','order','match')),
  points numeric(5,2) not null default .25 check (points > 0),
  public_config jsonb not null default '{}'::jsonb,
  answer_key jsonb not null,
  hint text,
  explanation text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(session_id,question_key),
  unique(session_id,display_order)
);

create table if not exists public.recovery_exam_members (
  session_id uuid not null references public.recovery_exam_sessions(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'waiting' check (status in ('review','waiting','running','finished','removed')),
  review_step integer not null default 0,
  review_completed_at timestamptz,
  current_question integer not null default 1,
  attempt_no integer not null default 1,
  max_attempts integer not null default 1 check (max_attempts between 1 and 10),
  extra_time_seconds integer not null default 0,
  accommodation jsonb not null default '{}'::jsonb,
  seed integer not null default floor(random()*2147483640)::integer,
  started_at timestamptz,
  submitted_at timestamptz,
  last_seen_at timestamptz,
  score numeric(5,2),
  correct_count integer not null default 0,
  answered_count integer not null default 0,
  xp integer not null default 0,
  focus_loss_count integer not null default 0,
  fullscreen_exit_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key(session_id,student_id)
);
create index if not exists recovery_exam_members_student_idx on public.recovery_exam_members(student_id,updated_at desc);
alter table public.recovery_exam_members alter column status set default 'waiting';

create table if not exists public.recovery_exam_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.recovery_exam_sessions(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null references public.recovery_exam_questions(id) on delete cascade,
  attempt_no integer not null default 1,
  answer jsonb not null default '{}'::jsonb,
  is_correct boolean,
  score numeric(5,2),
  response_ms integer,
  first_viewed_at timestamptz,
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  unique(session_id,student_id,question_id,attempt_no)
);
create index if not exists recovery_exam_answers_metrics_idx on public.recovery_exam_answers(session_id,question_id,attempt_no,is_correct);
create index if not exists recovery_exam_answers_student_idx on public.recovery_exam_answers(student_id);
create index if not exists recovery_exam_answers_question_idx on public.recovery_exam_answers(question_id);

create table if not exists public.recovery_exam_events (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.recovery_exam_sessions(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);
create index if not exists recovery_exam_events_session_idx on public.recovery_exam_events(session_id,occurred_at desc);
create index if not exists recovery_exam_events_student_idx on public.recovery_exam_events(student_id) where student_id is not null;
create index if not exists recovery_exam_events_actor_idx on public.recovery_exam_events(actor_id) where actor_id is not null;

create table if not exists public.recovery_exam_interventions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.recovery_exam_sessions(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  intervention_type text not null check (intervention_type in ('message','hint','effect','extra_time','extra_attempt','reopen','accommodation','remove','double_xp')),
  payload jsonb not null default '{}'::jsonb,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);
create index if not exists recovery_exam_interventions_student_idx on public.recovery_exam_interventions(session_id,student_id,created_at desc);
create index if not exists recovery_exam_interventions_student_fk_idx on public.recovery_exam_interventions(student_id) where student_id is not null;
create index if not exists recovery_exam_interventions_created_by_idx on public.recovery_exam_interventions(created_by);

alter table public.recovery_exam_sessions enable row level security;
alter table public.recovery_exam_questions enable row level security;
alter table public.recovery_exam_members enable row level security;
alter table public.recovery_exam_answers enable row level security;
alter table public.recovery_exam_events enable row level security;
alter table public.recovery_exam_interventions enable row level security;

-- Toda leitura/gravação passa pela Edge Function com service role.
revoke all on public.recovery_exam_sessions from public,anon,authenticated;
revoke all on public.recovery_exam_questions from public,anon,authenticated;
revoke all on public.recovery_exam_members from public,anon,authenticated;
revoke all on public.recovery_exam_answers from public,anon,authenticated;
revoke all on public.recovery_exam_events from public,anon,authenticated;
revoke all on public.recovery_exam_interventions from public,anon,authenticated;

comment on table public.recovery_exam_questions is 'Banco privado das questões. answer_key nunca deve ser enviado ao aluno.';
comment on table public.recovery_exam_answers is 'Autosave e correção server-side por questão/tentativa.';
comment on table public.recovery_exam_interventions is 'Avisos, dicas, efeitos, tempo, oportunidades e acomodações aplicadas pelo professor.';
