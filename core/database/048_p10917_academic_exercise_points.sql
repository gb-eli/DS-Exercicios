-- P10.9.17 — Pontuação acadêmica confirmada por exercício
-- Fonte: títulos/prints do Classroom consolidados em 24/08/2026.
-- Não altera notas, progresso, student_exercises, claims ou arquivos dos alunos.
-- Armazena o valor máximo dentro de exercises.config para evitar um valor genérico por disciplina.

with confirmed_points(subject_slug, exercise_from, exercise_to, max_points) as (
  values
    ('introducao-programacao'::text, 1, 6, 0.75::numeric),
    ('programacao-front-end'::text, 1, 20, 0.20::numeric),
    ('programacao-desenvolvimento-sistemas'::text, 1, 8, 0.50::numeric)
)
update public.exercises e
set config = coalesce(e.config, '{}'::jsonb) || jsonb_build_object(
  'academic_max_points', cp.max_points,
  'academic_points_confirmed', true,
  'academic_points_source', 'classroom_prints_2026-08-24'
)
from public.subjects s
join confirmed_points cp on cp.subject_slug = s.slug
where e.subject_id = s.id
  and e.exercise_number between cp.exercise_from and cp.exercise_to;

-- Auditoria esperada: até 34 exercícios, se todos os catálogos confirmados existirem no banco.
select
  s.slug as subject_slug,
  e.exercise_number,
  e.title,
  e.config->>'academic_max_points' as academic_max_points,
  e.config->>'academic_points_confirmed' as academic_points_confirmed,
  e.config->>'academic_points_source' as academic_points_source
from public.exercises e
join public.subjects s on s.id = e.subject_id
where (s.slug = 'introducao-programacao' and e.exercise_number between 1 and 6)
   or (s.slug = 'programacao-front-end' and e.exercise_number between 1 and 20)
   or (s.slug = 'programacao-desenvolvimento-sistemas' and e.exercise_number between 1 and 8)
order by s.slug, e.exercise_number;
