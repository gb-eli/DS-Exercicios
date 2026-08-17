-- Applied in production on 2026-08-13.
-- Allows authorized staff to read revision history for students inside their staff scope.
-- Uses the existing private.staff_can_access_student(uuid) authorization helper.

drop policy if exists student_file_history_select_staff on public.student_file_history;
create policy student_file_history_select_staff
on public.student_file_history
for select
to authenticated
using (private.staff_can_access_student(student_id));
