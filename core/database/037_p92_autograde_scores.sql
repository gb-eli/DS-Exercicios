-- P9.2 / v14.9.0 — notas de autocorreção e entrega parcial
alter table public.student_exercises
  add column if not exists auto_score numeric not null default 0 check (auto_score between 0 and 100),
  add column if not exists auto_score_at timestamptz,
  add column if not exists submitted_score numeric check (submitted_score is null or submitted_score between 0 and 100),
  add column if not exists submitted_at timestamptz,
  add column if not exists autograde_details jsonb not null default '{}'::jsonb;

comment on column public.student_exercises.auto_score is 'Latest server-side auto-correction score 0-100.';
comment on column public.student_exercises.submitted_score is 'Score recorded at the most recent student submission; partial submissions are allowed.';
