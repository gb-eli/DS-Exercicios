# AGV Education Core — Estado do backend central

**Data:** 13/08/2026  
**Projeto Supabase:** `iresvqwyaqotghjssncg`  
**Marco:** Fase 1 parcial + fundação da Fase 2

## Compatibilidade adotada

O SQL de referência do pacote não foi aplicado literalmente porque o projeto já possuía `profiles`, `platforms` e `security_events`. A implementação real preserva essas estruturas existentes:

- identidade: `auth.users.id` + `public.profiles.id`;
- registro de plataforma: `public.platforms.id` UUID e `public.platforms.code` como identificador textual consumido pelo SDK;
- eventos de supervisão dos exercícios permanecem em `public.security_events`;
- eventos gerais do Core usam `public.agv_core_security_events`.

## Criado no Supabase

- `activity_catalog`;
- `progress_events`;
- `activity_progress`;
- `metric_ledger`;
- `wallets`;
- `wallet_ledger`;
- `reward_rules`;
- `admin_audit_log`;
- `agv_core_security_events`.

As tabelas expostas possuem RLS. Escritas em progresso, métricas e carteira foram removidas do navegador; a mutação oficial ocorre por fluxo server-side/RPC. `wallet_ledger` possui bloqueio de UPDATE/DELETE para manter comportamento append-only.

## Edge Functions ativas

- `agv-progress-event` **v2** — JWT obrigatório; autentica usuário e chama RPC de progresso com `service_role` somente dentro da função.
- `agv-reward-claim` **v1** — JWT obrigatório; rejeita payload contendo `amount`; recompensa é resolvida por `reward_rules`.

## Registro de plataformas

Foram registrados os códigos: `loja-virtual-ds`, `lab-virtual`, `ctf-ds`, `planetario-ds`, `desafio-ds`, `fliperama-ds`, `game-informatica`, `lab-sub`, `lab-ds1`, `lab-ds2`, `lab-ds3`.

## Estado vazio intencional

No fechamento desta etapa, `activity_catalog`, `reward_rules`, `wallets`, `wallet_ledger`, `progress_events`, `activity_progress` e `metric_ledger` estão vazios. Isso é proposital: ainda não foi liberada recompensa econômica nem migrado saldo legado antes da reconciliação dos catálogos/atividades.

## Advisor de segurança

Informações sem policy pública em `reward_rules`, `admin_audit_log` e `agv_core_security_events` são intencionais: são tabelas server-side.

Restam dois pontos para a próxima rodada:

1. `claim_core_reward` ainda aparece no linter como `SECURITY DEFINER` executável por `authenticated`. A função valida `auth.uid()`, regra de recompensa, idempotência, saldo e repetição, e não aceita `amount`; mesmo assim, a meta é movê-la para fluxo service-only como já foi feito em progresso.
2. Leaked Password Protection do Supabase Auth continua desabilitada.

## Não ativar ainda

A Loja continua com `AGV_CORE_CONFIG.enabled=false` até que:

- `activity_catalog` e `reward_rules` sejam populados;
- compra/inventário da Loja sejam migrados para intents/confirm;
- o saldo legado seja reconciliado em migration auditável.
