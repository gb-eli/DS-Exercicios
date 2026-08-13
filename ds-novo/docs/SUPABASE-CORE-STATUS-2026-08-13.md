# AGV Education Core — Estado do backend central

**Data:** 13/08/2026  
**Projeto Supabase:** `iresvqwyaqotghjssncg`  
**Marco:** Fase 0 concluída + CTF P1 + LAB Virtual P1 + fundação do Modo Professor

## Compatibilidade adotada

O schema de referência foi adaptado ao projeto existente, preservando:

- `auth.users.id` + `public.profiles.id` como identidade central;
- `public.platforms.id` UUID + `platforms.code` textual para SDKs;
- `public.security_events` para supervisão dos exercícios;
- `public.agv_core_security_events` para eventos gerais do Core.

## Estruturas do Core

- `activity_catalog`;
- `progress_events`;
- `activity_progress`;
- `metric_ledger`;
- `wallets`;
- `wallet_ledger`;
- `reward_rules`;
- `admin_audit_log`;
- `agv_core_security_events`;
- `activity_teacher_content` — conteúdo docente privado.

`wallet_ledger` permanece append-only. Conteúdo docente não é consultável diretamente por `anon`/`authenticated`.

## Edge Functions ativas verificadas

- `staff-dashboard` v6 — JWT obrigatório, escopo de professor por turma;
- `staff-directory` v2;
- `supervision` v1;
- `activity-progress` v1;
- `student-files` v2;
- `agv-progress-event` v3;
- `agv-reward-claim` v4;
- `ctf-complete-challenge` v1;
- `ctf-core-actions` v1;
- `lab-virtual-core` v2;
- `agv-teacher-activity` v1.

## CTF

- 86/86 atividades centrais;
- 68/68 missões conhecidas pelo verificador;
- aulas/hints/diário/ferramentas/store centralizados;
- economia local não é autoridade.

## LAB Virtual

- 50/50 ferramentas no catálogo;
- 88/88 conclusões no catálogo;
- 88/88 regras de conclusão;
- totais preservados: 5.195 XP / 1.979 Créditos Tech;
- 3 regras de primeira atividade validada: 15/30/50 créditos;
- 6 marcos de exploração: 100/150/250/300/400/750 créditos;
- 88 referências privadas de professor em `activity_teacher_content`;
- `activity_progress` ainda tinha 0 linhas de LAB Virtual no momento da auditoria, portanto nenhuma migração de aluno real precisou de backfill nesta etapa.

## Modo Professor

`activity_teacher_content` possui RLS ativo. A auditoria de grants mostrou somente `service_role`; `anon` e `authenticated` não possuem privilégio direto de tabela.

`agv-teacher-activity` v1:

- exige JWT;
- exige `teacher/admin/super_admin` ativo em `profiles`;
- admin/super_admin: escopo global;
- professor comum: valida `class_memberships` contra `teacher_classes`;
- retorna atividade recente e referência privada somente depois da autorização.

## Security Advisor

INFOs `rls_enabled_no_policy` em tabelas server-side são intencionais quando o acesso direto do cliente é proibido, incluindo `activity_teacher_content`, `reward_rules`, `admin_audit_log`, `agv_core_security_events`, `staff_allowlist`, `student_preregistrations` e `teacher_classes`. Referência: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy

Restam dois WARNs conhecidos:

1. RPC legado `claim_core_reward(...)` ainda é `SECURITY DEFINER` executável por `authenticated`; o fluxo oficial novo não o utiliza. Referência: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
2. Leaked Password Protection do Supabase Auth está desabilitada. Referência: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

## Próximos movimentos

- migrar Loja Tech/inventário do LAB para Loja Universal;
- migrar Desafio DS e Game Informática;
- depois migrar Planetário/Fliperama;
- integrar LAB Sub/DS1/DS2/DS3 com IDs canônicos e ingestão das referências privadas Professor;
- restringir CORS ao domínio de produção;
- encerrar RPC legado e habilitar leaked-password protection.
