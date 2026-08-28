-- P7.7 — Guarda server-side de sessão Auth revogada (service-only)
-- Aplicar ANTES de republicar as Edge Functions P7.7.

create or replace function public.security_is_auth_session_active_service(
  p_user_id uuid,
  p_session_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.sessions s
    where s.id = p_session_id
      and s.user_id = p_user_id
      and (s.not_after is null or s.not_after > now())
  );
$$;

revoke all on function public.security_is_auth_session_active_service(uuid, uuid) from public, anon, authenticated;
grant execute on function public.security_is_auth_session_active_service(uuid, uuid) to service_role;

comment on function public.security_is_auth_session_active_service(uuid, uuid) is
'P7.7 service-only: confirma que o session_id do JWT ainda existe em auth.sessions para o mesmo usuario. Usado para invalidar operacoes criticas imediatamente apos revogacao administrativa.';
