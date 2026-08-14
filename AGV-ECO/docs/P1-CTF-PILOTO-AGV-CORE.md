> **HISTÓRICO:** este documento descreve o corte piloto anterior. O estado atual está em `docs/P1-CTF-CORE-v3.2.0.md`.

# P1 — CTF DS PILOTO NO AGV EDUCATION CORE

**Data:** 13/08/2026  
**CTF canônico:** `sistemas/02-ctf-ds/ctf` — v3.2.0  
**Core:** Supabase `iresvqwyaqotghjssncg`

## Objetivo

Transformar o CTF DS na primeira plataforma P1 em que uma vitória no navegador deixa de ser autoridade econômica. A interface, campanha, 3D, ferramentas e conteúdo foram preservados; autenticação, conclusão oficial das missões, XP e moedas passam a depender do Core.

## Login central

O CTF não pede mais nome/turma/senha local como identidade oficial. O formulário usa:

1. e-mail institucional `@escola.pr.gov.br`;
2. senha pessoal;
3. no primeiro acesso do aluno, CGM como senha temporária;
4. se `must_change_password=true`, o próprio CTF exige nova senha com 8+ caracteres, letra e número;
5. nome e turma são carregados de `profiles` + `class_memberships/classes`.

Tokens ficam em `sessionStorage`. O código do Supabase não é carregado por CDN: o bridge usa `fetch` direto para Auth/REST/Edge Functions, permitindo manter `script-src 'self'` na CSP.

## Cache local

O IndexedDB criptografado continua existindo para:

- drafts;
- preferências;
- narrativa/UI;
- dados de experiência ainda não centralizados.

Conta vinculada ao Core usa `accountId = core_<uuid>`. Perfis locais antigos não são promovidos automaticamente. Se a senha central mudar e a chave local antiga não puder ser aberta, o cache Core pode ser recriado e o progresso oficial é reidratado do backend.

## Autoridade de XP e moedas

Quando `profile.core.authority === 'agv-core'`:

- `profile.coins` espelha `wallets.balance`;
- `profile.xp` é derivado de `metric_ledger`;
- `awardToProfile()` não pode criar XP/moedas oficiais;
- rewards locais não migrados são anotados como pendentes locais, sem alterar o saldo central;
- `spendXp()` é bloqueado até hints migrarem;
- compras locais são bloqueadas até a Loja/inventário central estar integrado;
- estrelas/badges podem continuar locais por não representarem a moeda oficial do Core nesta etapa.

## Verificação server-side das missões

Edge Function: `ctf-complete-challenge` v1, `verify_jwt=true`.

Cobertura lógica:

- 62 missões usam os selos AES-GCM originais;
- 6 missões usam regras estruturais originais;
- total: 68 missões conhecidas pelo verificador.

O servidor:

1. identifica o usuário pelo JWT;
2. exige `ctf-ds` registrado;
3. exige a atividade no `activity_catalog`;
4. verifica pré-requisitos em `activity_progress`;
5. valida resposta no servidor;
6. resposta incorreta registra `challenge.failed`, sem reward;
7. resposta correta grava conclusão idempotente;
8. chama `claim_core_reward_service` com regra do backend;
9. devolve wallet e métricas oficiais;
10. tenta conceder checkpoint de bloco quando o bloco estiver provisionado e todas as missões tiverem sido concluídas.

O cliente nunca envia `amount` para decidir recompensa.

## Readiness atual

Backend live em 13/08/2026:

- verificador: 68/68 missões conhecidas;
- catálogo live: 45/68 missões;
- reward rules live: 45;
- catálogo planejado no pacote: 86 itens (68 missões + 10 aulas + 7 blocos + 1 objetivo diário).

O frontend consulta o catálogo ao entrar. Missão ausente do catálogo recebe **Aguardando Core** e não pode obter progresso/moeda local como fallback.

## Segurança residual conhecida

O Security Advisor ainda sinaliza o RPC legado `claim_core_reward(...)` como `SECURITY DEFINER` executável por `authenticated`. A aplicação oficial usa somente `claim_core_reward_service(...)` via `agv-reward-claim`/verificadores server-side. Tentativas do conector de revogar/substituir o RPC legado foram bloqueadas pela camada de segurança da integração; remover essa superfície permanece tarefa obrigatória antes de declarar o Core econômico final.

Também permanece desabilitado no Auth o recurso **Leaked Password Protection**.

## Próximo corte

1. provisionar as 23 missões restantes;
2. provisionar aulas, blocos e objetivo diário;
3. mover lesson rewards para Edge Function;
4. mover gasto de hints para Core;
5. integrar Store/Inventário central;
6. criar fluxo explícito professor/admin para reconciliar progresso legado.
