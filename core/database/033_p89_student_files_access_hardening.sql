-- P8.9 / Etapa 4 — impede escrita direta em student_files fora da turma/liberação efetiva.
-- A leitura dos próprios arquivos permanece separada para permitir recuperação e download posterior.

create or replace function private.student_can_work_on_exercise(p_student uuid, p_exercise uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    join public.class_memberships cm
      on cm.user_id = p.id
     and cm.active = true
     and cm.is_primary = true
    join public.exercises e
      on e.id = p_exercise
     and e.active = true
     and e.visible = true
    where p.id = p_student
      and p.active = true
      and p.role = 'student'::public.user_role
      and p.must_change_password = false
      and private.exercise_belongs_to_class(e.id, cm.class_id)
      and not exists (
        select 1 from public.student_exercises se
        where se.student_id = p_student
          and se.exercise_id = e.id
          and (se.security_locked = true or se.status = 'blocked'::public.exercise_status)
      )
      and (
        exists (
          select 1 from public.exercise_releases sr
          where sr.exercise_id = e.id and sr.student_id = p_student and sr.enabled = true
            and (sr.release_at is null or sr.release_at <= now())
            and (sr.lock_at is null or sr.lock_at > now())
        )
        or (
          not exists (
            select 1 from public.exercise_releases sr_any
            where sr_any.exercise_id = e.id and sr_any.student_id = p_student
          )
          and (
            exists (
              select 1 from public.exercise_releases cr
              where cr.exercise_id = e.id and cr.student_id is null and cr.class_id = cm.class_id and cr.enabled = true
                and (cr.release_at is null or cr.release_at <= now())
                and (cr.lock_at is null or cr.lock_at > now())
            )
            or (
              not exists (
                select 1 from public.exercise_releases cr_any
                where cr_any.exercise_id = e.id and cr_any.student_id is null and cr_any.class_id = cm.class_id
              )
              and e.default_locked = false
            )
          )
        )
      )
  );
$$;

revoke all on function private.student_can_work_on_exercise(uuid, uuid) from public;
grant execute on function private.student_can_work_on_exercise(uuid, uuid) to authenticated;

drop policy if exists student_files_insert_own on public.student_files;
create policy student_files_insert_own on public.student_files for insert to authenticated
with check (
  student_id = (select auth.uid())
  and private.student_can_work_on_exercise((select auth.uid()), exercise_id)
);

drop policy if exists student_files_update_own on public.student_files;
create policy student_files_update_own on public.student_files for update to authenticated
using (
  student_id = (select auth.uid())
  and private.student_can_work_on_exercise((select auth.uid()), exercise_id)
)
with check (
  student_id = (select auth.uid())
  and private.student_can_work_on_exercise((select auth.uid()), exercise_id)
);

drop policy if exists student_files_delete_own on public.student_files;
create policy student_files_delete_own on public.student_files for delete to authenticated
using (
  student_id = (select auth.uid())
  and private.student_can_work_on_exercise((select auth.uid()), exercise_id)
);
