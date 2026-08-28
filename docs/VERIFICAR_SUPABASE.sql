-- Somente leitura. Confere a configuração aplicada no ambiente de produção.
select
  e.exercise_number,
  e.slug,
  e.config->'student_workspace' as student_workspace,
  count(rf.id) as reference_files
from public.exercises e
left join public.exercise_reference_files rf on rf.exercise_id = e.id
where e.subject_id = 'ad1f8cc9-d1ba-4e11-b61c-cf94219d5644'::uuid
  and e.slug in ('sub-fe-01','sub-fe-02','sub-fe-03','sub-fe-04','sub-fe-05','sub-fe-06','sub-fe-07')
group by e.id
order by e.exercise_number;

select
  e.exercise_number,
  e.slug,
  er.enabled,
  er.allow_html_base,
  er.allow_css_base,
  er.allow_js_base
from public.exercises e
join public.exercise_releases er on er.exercise_id = e.id
where er.class_id = '5192fbab-6ec9-4178-9f6d-e4b4b9619d4d'::uuid
  and er.student_id is null
  and e.subject_id = 'ad1f8cc9-d1ba-4e11-b61c-cf94219d5644'::uuid
order by e.exercise_number;
