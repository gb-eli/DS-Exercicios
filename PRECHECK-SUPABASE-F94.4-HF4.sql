-- F94.4 HF4 / P10940 — PRECHECK SOMENTE LEITURA
-- Execute antes da migration 080_p10940_practical_exam_p0_teams_roles.sql.
-- Não altera dados.

select
  current_database() as database_name,
  now() as checked_at;

select table_name
from information_schema.tables
where table_schema='public'
  and table_name in (
    'practical_exam_sessions','practical_exam_clans','practical_exam_members',
    'practical_exam_roles','practical_exam_events','profiles','class_memberships'
  )
order by table_name;

select table_name,column_name,data_type,is_nullable,column_default
from information_schema.columns
where table_schema='public'
  and table_name in ('practical_exam_sessions','practical_exam_clans','practical_exam_members')
  and column_name in (
    'id','status','started_at','class_id','max_clan_size','min_clan_size',
    'join_locked','individual_allowed','identity_locked',
    'session_id','student_id','clan_id','role_id','role_selected_at','active'
  )
order by table_name,ordinal_position;

select
  c.conname,
  pg_get_constraintdef(c.oid) as definition,
  array(
    select a.attname
    from unnest(c.conkey) with ordinality k(attnum,ord)
    join pg_attribute a on a.attrelid=c.conrelid and a.attnum=k.attnum
    order by k.ord
  ) as columns
from pg_constraint c
where c.conrelid='public.practical_exam_sessions'::regclass
  and c.contype='c'
order by c.conname;

select
  p.proname,
  pg_get_function_identity_arguments(p.oid) as arguments,
  p.prosecdef as security_definer
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public'
  and p.proname in ('practical_exam_join_clan','practical_exam_select_role')
order by p.proname;

select status,count(*)
from public.practical_exam_sessions
group by status
order by status;
