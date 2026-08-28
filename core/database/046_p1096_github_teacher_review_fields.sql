-- P10.9.6 — campos candidatos para revisão humana das auditorias GitHub.
-- NÃO APLICAR em produção antes do backup/preflight do plano mestre.
-- Esta migration não altera legacy_exercise_claims, student_exercises, student_files ou notas.

alter table public.student_repository_exercise_audits
  add column if not exists review_score numeric(6,2),
  add column if not exists teacher_feedback text,
  add column if not exists reviewed_by uuid references public.profiles(id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists review_metadata jsonb not null default '{}'::jsonb;

do $$ begin
  alter table public.student_repository_exercise_audits
    add constraint student_repository_exercise_audits_review_score_chk
    check (review_score is null or (review_score between 0 and 10));
exception when duplicate_object then null; end $$;

create index if not exists student_repository_exercise_audits_teacher_review_idx
  on public.student_repository_exercise_audits(teacher_decision, reviewed_at desc);

comment on column public.student_repository_exercise_audits.review_score is
  'Nota revisada pelo professor, escala 0-10. Não equivale a baixa/nota aplicada em student_exercises.';
