-- v14.10.1 / P10.1
-- Trocas de guia/tela cheia continuam registradas, mas não devem bloquear automaticamente a atividade.
alter table public.exercise_security_policies
  drop constraint if exists exercise_security_policies_max_focus_violations_check;

alter table public.exercise_security_policies
  alter column max_focus_violations set default 1000000;

alter table public.exercise_security_policies
  add constraint exercise_security_policies_max_focus_violations_check
  check (max_focus_violations >= 1 and max_focus_violations <= 1000000);

create or replace function private.enforce_nonblocking_focus_policy()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
begin
  new.max_focus_violations := 1000000;
  return new;
end;
$$;

drop trigger if exists trg_enforce_nonblocking_focus_policy on public.exercise_security_policies;
create trigger trg_enforce_nonblocking_focus_policy
before insert or update of max_focus_violations on public.exercise_security_policies
for each row execute function private.enforce_nonblocking_focus_policy();

update public.exercise_security_policies
set max_focus_violations=1000000, updated_at=now()
where max_focus_violations<>1000000;

update public.student_exercises
set security_locked=false, security_lock_reason=null,
    status=case when status='blocked' then 'in_progress' else status end,
    last_activity_at=now()
where security_locked=true
  and (security_lock_reason ilike 'Limite de % saídas da atividade atingido.%'
       or security_lock_reason ilike 'Limite de % saidas da atividade atingido.%');

update public.activity_sessions
set locked=false, lock_reason=null, updated_at=now()
where locked=true
  and (lock_reason ilike 'Limite de % saídas da atividade atingido.%'
       or lock_reason ilike 'Limite de % saidas da atividade atingido.%');
