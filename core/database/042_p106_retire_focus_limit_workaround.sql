-- P10.6 — aposenta o workaround da v14.10.1 agora que supervision v4 é não bloqueante.
-- max_focus_violations volta a ser um limiar de alerta, nunca um gatilho de bloqueio automático.

drop trigger if exists trg_enforce_nonblocking_focus_policy on public.exercise_security_policies;
drop function if exists private.enforce_nonblocking_focus_policy();

alter table public.exercise_security_policies
  drop constraint if exists exercise_security_policies_max_focus_violations_check;

alter table public.exercise_security_policies
  alter column max_focus_violations set default 3;

update public.exercise_security_policies
set max_focus_violations = 3,
    updated_at = now()
where max_focus_violations <> 3;

alter table public.exercise_security_policies
  add constraint exercise_security_policies_max_focus_violations_check
  check (max_focus_violations >= 1 and max_focus_violations <= 20);
