# Edge Functions — AGV Education Core

Snapshot de produção em 13/08/2026, Supabase `iresvqwyaqotghjssncg`.

- `agv-progress-event` — **v3**, JWT obrigatório. Evento genérico; não aceita conclusão de atividade server-verified sem `metadata.client_progress_allowed=true`.
- `agv-reward-claim` — **v4**, JWT obrigatório. Rejeita `amount` do cliente e só permite regra com `metadata.client_claimable=true`.
- `ctf-complete-challenge` — **v1**, JWT obrigatório. Autoridade das 68 missões CTF, respostas seladas/regras estruturais, pré-requisitos e checkpoints.
- `ctf-core-actions` — **v1**, JWT obrigatório. Aulas, ferramentas, diário, hints e Cyber Store.
- `lab-virtual-core` — **v2**, JWT obrigatório. Autoridade das ferramentas/conclusões do LAB, recompensa central e marcos.
- `agv-teacher-activity` — **v3**, JWT obrigatório. Entrega referência privada somente após validar papel e escopo professor→turma.

Nunca copie `SUPABASE_SERVICE_ROLE_KEY` para frontend. Ela é lida apenas pelo runtime das Edge Functions.

## Pendência conhecida

O RPC legado `public.claim_core_reward(text,...)` ainda é apontado pelo Security Advisor como `SECURITY DEFINER` executável por `authenticated`. O código oficial acima **não utiliza** esse RPC; usa `claim_core_reward_service(...)`. A revogação do RPC legado foi bloqueada pela camada de segurança do conector e continua obrigatória antes de declarar o Core econômico final sem ressalvas.

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
