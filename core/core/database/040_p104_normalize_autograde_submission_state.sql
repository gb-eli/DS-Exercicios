-- P10.4 — normaliza estados históricos do autograde sem retirar aceite legado.
-- Entrega parcial não-legada permanece em andamento e usa a melhor nota entregue como progresso oficial.
update public.student_exercises
set
  status = 'in_progress',
  progress_percent = least(99, greatest(0, coalesce(submitted_score, auto_score, 0))),
  completed_at = null,
  completion_source = 'autograde_submission_partial',
  last_activity_at = coalesce(last_activity_at, submitted_at, now())
where completion_source = 'autograde_submission'
  and coalesce(submitted_score, 0) < 100
  and coalesce((metadata ->> 'legacy_version_accepted')::boolean, false) = false;

-- Uma entrega oficial com 100% deve aparecer como concluída.
update public.student_exercises
set
  status = 'completed',
  progress_percent = 100,
  completed_at = coalesce(completed_at, submitted_at, now()),
  completion_source = 'autograde_submission',
  last_activity_at = coalesce(last_activity_at, submitted_at, now())
where completion_source in ('autograde_submission', 'autograde_submission_partial')
  and coalesce(submitted_score, 0) >= 100
  and status <> 'completed';
