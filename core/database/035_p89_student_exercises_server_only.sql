-- P8.9 / Etapa 4 — progresso e conclusão são mutações exclusivamente server-side.
-- O aluno mantém SELECT do próprio progresso, mas não INSERT/UPDATE/DELETE direto.
revoke insert, update, delete on table public.student_exercises from anon, authenticated;
drop policy if exists student_exercises_insert_own on public.student_exercises;
drop policy if exists student_exercises_update_own on public.student_exercises;
