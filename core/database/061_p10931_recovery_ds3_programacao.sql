-- P10931 / v14.10.8.30 — Recuperação 3DS: Programação no Desenvolvimento de Sistemas
alter table public.recovery_exam_sessions
  drop constraint if exists recovery_exam_sessions_subject_key_check;
alter table public.recovery_exam_sessions
  add constraint recovery_exam_sessions_subject_key_check
  check (subject_key in ('frontend_sub','mobile_sub','programacao_ds3'));
comment on column public.recovery_exam_sessions.subject_key is
  'Catálogo canônico da recuperação: Front-End Sub, Mobile Sub ou Programação no Desenvolvimento de Sistemas 3DS.';
