-- Auditoria READ-ONLY — links GitHub históricos registrados em legacy_exercise_claims.
-- Nenhuma instrução deste arquivo altera dados.

-- 1) Totais gerais.
select
  count(*) as claims,
  count(distinct student_id) as students,
  count(distinct repository_url) as raw_urls,
  count(*) filter (where status='pending') as pending
from public.legacy_exercise_claims;

-- 2) Repositórios normalizados. URLs /blob/... são agrupadas no mesmo repositório.
with claims as (
  select lec.*,
         regexp_replace(
           regexp_replace(
             regexp_replace(repository_url, '^https?://github\\.com/', '', 'i'),
             '/blob/.*$', '', 'i'
           ),
           '\\.git/?$', '', 'i'
         ) as repository_slug
  from public.legacy_exercise_claims lec
)
select repository_slug,
       count(*) as claims,
       count(distinct student_id) as students,
       count(distinct exercise_id) as exercises,
       count(distinct repository_url) as raw_urls
from claims
group by repository_slug
order by students desc, claims desc, repository_slug;

-- 3) Sinalizar repositório associado a mais de um aluno.
with claims as (
  select lec.*,
         regexp_replace(
           regexp_replace(
             regexp_replace(repository_url, '^https?://github\\.com/', '', 'i'),
             '/blob/.*$', '', 'i'
           ),
           '\\.git/?$', '', 'i'
         ) as repository_slug
  from public.legacy_exercise_claims lec
)
select repository_slug,
       count(distinct student_id) as students,
       array_agg(distinct student_id) as student_ids,
       count(*) as claims
from claims
group by repository_slug
having count(distinct student_id) > 1
order by students desc, claims desc;

-- 4) Inventário professor/aluno/exercício para a futura auditoria GitHub.
select p.full_name,
       c.code as class_code,
       s.slug as subject_slug,
       e.exercise_number,
       e.title,
       lec.repository_url,
       lec.status,
       lec.submitted_at
from public.legacy_exercise_claims lec
join public.profiles p on p.id=lec.student_id
join public.exercises e on e.id=lec.exercise_id
left join public.classes c on c.id=e.class_id
left join public.subjects s on s.id=e.subject_id
order by c.code, p.full_name, s.slug, e.exercise_number;
