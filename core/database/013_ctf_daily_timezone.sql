-- Daily objective is keyed server-side by America/Sao_Paulo date.
-- The per-day idempotency key in ctf-core-actions is the authority; no UTC daily_limit.
update public.reward_rules rr
set daily_limit=null, metadata=coalesce(rr.metadata,'{}'::jsonb)||'{"server_daily_key":"America/Sao_Paulo"}'::jsonb, updated_at=now()
from public.platforms p
where rr.platform_id=p.id and p.code='ctf-ds' and rr.activity_id='daily-objective' and rr.event_type='daily.completed';
update public.activity_catalog ac
set daily_limit=null, metadata=coalesce(ac.metadata,'{}'::jsonb)||'{"timezone":"America/Sao_Paulo"}'::jsonb, updated_at=now()
from public.platforms p
where ac.platform_id=p.id and p.code='ctf-ds' and ac.activity_id='daily-objective';
