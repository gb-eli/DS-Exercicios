-- AGV Education Core — blueprint compatível com o projeto de Exercícios Práticos DS
-- Este arquivo documenta a adaptação. As migrations efetivamente aplicadas foram executadas em 13/08/2026.
-- Diferença central em relação a 001_core_schema.sql:
--   * profiles existente é reutilizado;
--   * platforms usa UUID e code UNIQUE;
--   * security_events existente é preservado; Core usa agv_core_security_events.

-- Tabelas implantadas:
-- activity_catalog, progress_events, activity_progress, metric_ledger,
-- wallets, wallet_ledger, reward_rules, admin_audit_log, agv_core_security_events.

-- RPC de progresso atual:
-- public.record_core_progress_event(p_user_id uuid, p_platform_code text, ...),
-- EXECUTE somente service_role.

-- Reward claim atual ainda usa public.claim_core_reward(...) com auth.uid();
-- próximo hardening: mover execução para service-only sem alterar o contrato da Edge Function.
