-- P8.0 / v14.8 — 3DS: publica o novo Exercício 04 e retira exercícios futuros comprometidos da vitrine.
-- Este script NÃO contém gabarito nem regras privadas de correção.
-- Execute somente no projeto Supabase oficial após revisar o snapshot live.

begin;

update public.exercises e
set
  title = 'Exercício 04 — Painel de Prioridades com Filtro Interativo',
  visible = true,
  active = true,
  default_locked = true
from public.subjects s
where e.subject_id = s.id
  and s.slug = 'programacao-desenvolvimento-sistemas'
  and e.exercise_number = 4;

-- Exercícios 05+ da antiga sequência estavam publicados no bundle legado antes de serem solicitados.
-- Eles ficam invisíveis até serem reconstruídos um a um e receberem novo conteúdo/validação privada.
update public.exercises e
set visible = false
from public.subjects s
where e.subject_id = s.id
  and s.slug = 'programacao-desenvolvimento-sistemas'
  and e.exercise_number >= 5;

update public.activity_catalog ac
set name = 'Exercício 04 — Painel de Prioridades com Filtro Interativo', active = true, updated_at = now()
where ac.activity_id = 'exercise:programacao-desenvolvimento-sistemas:04';

update public.activity_catalog ac
set name = format('Exercício %s — Atividade futura ainda não publicada', lpad(split_part(ac.activity_id, ':', 3), 2, '0')),
    active = false,
    updated_at = now()
where ac.activity_id ~ '^exercise:programacao-desenvolvimento-sistemas:[0-9]+$'
  and split_part(ac.activity_id, ':', 3)::int >= 5;

commit;
