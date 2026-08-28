-- P10.9.11 — PREDEPLOY READ-ONLY CHECK
-- Seguro para executar antes da migration 047. Não altera dados.

select
  now() as checked_at,
  current_database() as database_name,
  current_setting('server_version') as postgres_version,
  to_regclass('public.profiles') is not null as has_profiles,
  to_regclass('public.classes') is not null as has_classes,
  to_regclass('public.class_memberships') is not null as has_class_memberships,
  to_regclass('public.teacher_classes') is not null as has_teacher_classes,
  to_regclass('public.staff_allowlist') is not null as has_staff_allowlist,
  to_regclass('public.weekend_bonus_vouchers') as voucher_table_before_deploy;

select
  exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='class_memberships' and column_name='is_primary'
  ) as class_memberships_has_is_primary,
  exists (
    select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname='security_consume_rate_limit'
  ) as has_rate_limit_rpc,
  exists (
    select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname='security_is_auth_session_active_service'
  ) as has_live_session_guard_rpc;

select
  (select count(*) from public.legacy_exercise_claims) as legacy_claims,
  (select count(*) from public.legacy_exercise_claims where status='pending') as legacy_pending,
  (select count(*) from public.student_files) as student_files,
  (select count(*) from public.student_file_history) as student_file_history,
  (select count(*) from public.student_exercises) as student_exercises;
