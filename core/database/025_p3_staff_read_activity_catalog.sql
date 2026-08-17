-- P3 — leitura do catálogo por professor/admin, preservando escopo de turma.
-- Aplicado no projeto iresvqwyaqotghjssncg em 2026-08-13.
drop policy if exists class_subjects_staff_read on public.class_subjects;
create policy class_subjects_staff_read
on public.class_subjects
for select
to authenticated
using (private.staff_can_access_class(class_id));

drop policy if exists exercises_staff_read on public.exercises;
create policy exercises_staff_read
on public.exercises
for select
to authenticated
using (
  active = true
  and (
    (class_id is not null and private.staff_can_access_class(class_id))
    or (
      class_id is null
      and exists (
        select 1 from public.class_subjects cs
        where cs.subject_id = exercises.subject_id
          and cs.active = true
          and private.staff_can_access_class(cs.class_id)
      )
    )
  )
);
