-- P10.6 — sessão supervisionada resiliente e limpeza de sessões abandonadas
-- A contagem de saídas volta a 3 apenas como limiar de alerta; supervision v4 não bloqueia por quantidade.

update public.exercise_security_policies
set max_focus_violations = 3
where max_focus_violations <> 3;

-- Sessões sem heartbeat recente são histórico, não presença ao vivo.
update public.activity_sessions
set ended_at = coalesce(ended_at, now()),
    updated_at = now()
where ended_at is null
  and coalesce(last_seen_at, started_at) < now() - interval '2 minutes';
