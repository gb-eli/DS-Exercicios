# Edge Functions — AGV Education Core

Snapshot de produção em 13/08/2026, Supabase `iresvqwyaqotghjssncg`.

- `agv-progress-event` — **v3**, JWT obrigatório. Evento genérico; não aceita conclusão de atividade server-verified sem `metadata.client_progress_allowed=true`.
- `agv-reward-claim` — **v4**, JWT obrigatório. Rejeita `amount` do cliente e só permite regra com `metadata.client_claimable=true`.
- `ctf-complete-challenge` — **v1**, JWT obrigatório. Autoridade das 68 missões CTF, respostas seladas/regras estruturais, pré-requisitos e checkpoints.
- `ctf-core-actions` — **v1**, JWT obrigatório. Aulas, ferramentas, diário, hints e Cyber Store.
- `lab-virtual-core` — **v2**, JWT obrigatório. Autoridade das ferramentas/conclusões do LAB, recompensa central e marcos.
- `agv-teacher-activity` — **v3**, JWT obrigatório. Entrega referência privada somente após validar papel e escopo professor→turma.

Nunca copie `SUPABASE_SERVICE_ROLE_KEY` para frontend. Ela é lida apenas pelo runtime das Edge Functions.

## Validação live pendente

O snapshot SQL contém revogação explícita do RPC legado `public.claim_core_reward(...)` para `authenticated` em `028_p4_lobby_staff_moderation_security.sql`. Como os Security Advisors não puderam ser executados na P7.6, o estado **ao vivo** ainda deve ser revalidado antes de declarar o Core econômico sem ressalvas.

## v8 — LABs DS + Modo Professor
- `lab-exercises-core` v1: Auth/progresso dos portais DS1/DS2/DS3/Sub, com escopo por turma e sem recompensa econômica.
- `lab-analysis-validate` v1: correção server-side das três atividades de Análise e Método do 1DS; nunca retorna a chave de respostas.
- `agv-teacher-activity` live v3: consulta protegida, aprovação/ajustes e importação privada de gabaritos em lotes (admin/super_admin).

## admin-profile-user (v3)

Endpoint administrativo JWT-only criado para o ciclo ADM P0/P1/P2.

Ações atuais:
- `private_detail`
- `update_profile` (nome, turma e CGM cadastral)
- `set_active`
- `force_password_change`
- `end_activity_sessions`

Não usa `auth.admin.*`. Operações Auth administrativas que exigem service role específico permanecem pendentes porque a camada de segurança do conector bloqueou o deploy desses endpoints.

## P7.6 — admin-auth-sessions (v14.5)
- Novo snapshot `admin-auth-sessions`: Admin/Super Admin, JWT obrigatório, gate `must_change_password`.
- Depende da migration `030_p76_auth_session_revocation.sql`.
- Fecha `activity_sessions`, revoga sessões Auth persistidas e grava `admin_audit_log`.
- Não publicado live nesta rodada por indisponibilidade do conector.

## P7.7
As funções críticas usam `session-guard.ts` para rejeitar JWTs cuja sessão Auth foi revogada. A migration 031 deve ser aplicada antes do deploy dessas funções.
