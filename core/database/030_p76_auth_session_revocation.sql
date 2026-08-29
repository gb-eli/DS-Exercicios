-- P7.6 — Revogação administrativa de sessões Auth (service-only)
-- NÃO aplicar sem conferir o schema live e rodar Security Advisors.
-- Esta função atua sobre auth.sessions para revogar refresh tokens/sessões do usuário.

create or replace function public.admin_auth_session_count_service(p_user_id uuid)
returns integer
language sql
security definer
set search_path = ''
as $$
  select count(*)::integer
  from auth.sessions s
  where s.user_id = p_user_id;
$$;

revoke all on function public.admin_auth_session_count_service(uuid) from public, anon, authenticated;
grant execute on function public.admin_auth_session_count_service(uuid) to service_role;

create or replace function public.admin_revoke_auth_sessions_service(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  if p_user_id is null then
    raise exception 'user_required';
  end if;

  select count(*)::integer into v_count
  from auth.sessions s
  where s.user_id = p_user_id;

  delete from auth.sessions s
  where s.user_id = p_user_id;

  return coalesce(v_count, 0);
end;
$$;

revoke all on function public.admin_revoke_auth_sessions_service(uuid) from public, anon, authenticated;
grant execute on function public.admin_revoke_auth_sessions_service(uuid) to service_role;

comment on function public.admin_revoke_auth_sessions_service(uuid) is
'P7.6 service-only: revoga as sessoes Auth persistidas de um usuario. Access JWT ja emitido pode continuar valido ate exp; endpoints altamente sensiveis devem validar session_id contra auth.sessions.';
