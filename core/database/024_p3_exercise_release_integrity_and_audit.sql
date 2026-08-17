-- P3 — integridade e auditoria de liberações de atividades.
-- Aplicado no projeto iresvqwyaqotghjssncg em 2026-08-13.
create unique index if not exists exercise_releases_unique_class
on public.exercise_releases (exercise_id, class_id)
where class_id is not null and student_id is null;

create unique index if not exists exercise_releases_unique_student
on public.exercise_releases (exercise_id, student_id)
where student_id is not null and class_id is null;

alter table public.exercise_releases
  drop constraint if exists exercise_releases_exactly_one_scope;
alter table public.exercise_releases
  add constraint exercise_releases_exactly_one_scope
  check (((class_id is not null)::int + (student_id is not null)::int) = 1);

alter table public.exercise_releases
  drop constraint if exists exercise_releases_schedule_order;
alter table public.exercise_releases
  add constraint exercise_releases_schedule_order
  check (release_at is null or lock_at is null or lock_at > release_at);

create or replace function private.audit_exercise_release_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid;
  row_data public.exercise_releases;
  action_name text;
begin
  row_data := case when tg_op = 'DELETE' then old else new end;
  actor := coalesce(auth.uid(), row_data.created_by);
  action_name := case tg_op
    when 'INSERT' then 'exercise_release_created'
    when 'UPDATE' then 'exercise_release_updated'
    when 'DELETE' then 'exercise_release_deleted'
  end;
  insert into public.admin_audit_log(actor_user_id, action, target_user_id, payload)
  values (actor, action_name, row_data.student_id,
    jsonb_build_object(
      'release_id',row_data.id,'exercise_id',row_data.exercise_id,'class_id',row_data.class_id,'student_id',row_data.student_id,
      'enabled',row_data.enabled,'release_at',row_data.release_at,'lock_at',row_data.lock_at,
      'allow_html_base',row_data.allow_html_base,'allow_css_base',row_data.allow_css_base,'allow_js_base',row_data.allow_js_base,
      'allow_extra_hints',row_data.allow_extra_hints,'allow_guided_support',row_data.allow_guided_support,'operation',tg_op));
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;
revoke all on function private.audit_exercise_release_change() from public, anon, authenticated;

drop trigger if exists trg_audit_exercise_releases on public.exercise_releases;
create trigger trg_audit_exercise_releases
after insert or update or delete on public.exercise_releases
for each row execute function private.audit_exercise_release_change();

drop policy if exists exercise_releases_staff_delete on public.exercise_releases;
create policy exercise_releases_staff_delete
on public.exercise_releases
for delete
to authenticated
using (
  ((student_id is null) and (class_id is not null) and private.staff_can_access_class(class_id))
  or ((student_id is not null) and private.staff_can_access_student_exercise(student_id, exercise_id))
);
grant delete on public.exercise_releases to authenticated;
