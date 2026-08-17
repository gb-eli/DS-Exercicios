# P1 — CTF DS NO AGV EDUCATION CORE

**Data:** 13/08/2026  
**CTF canônico:** `sistemas/02-ctf-ds/ctf` — v3.2.0  
**Core:** Supabase `iresvqwyaqotghjssncg`

## Estado atual

O CTF DS é a primeira plataforma P1 integrada ao AGV Education Core com autoridade central sobre:

- autenticação institucional;
- conclusão das 68 missões;
- 10 aulas;
- 7 checkpoints de bloco;
- objetivo diário;
- XP;
- Cyber Coins;
- uso de hints com débito de XP;
- compras da Cyber Store;
- propriedade dos cosméticos pagos derivada do ledger central.

O catálogo live foi verificado com **86/86 atividades** e **86 reward rules**:

- 68 `challenge:*`;
- 10 `lesson:*`;
- 7 `block:*`;
- 1 `daily-objective`.

## Autoridade das missões

`ctf-complete-challenge` v1 é o único caminho oficial de conclusão das missões. A função valida JWT, atividade, pré-requisitos e resposta no servidor.

- 62 missões: selos AES-GCM originais;
- 6 missões: regras estruturais originais;
- resposta errada: sem progresso econômico;
- resposta correta: progresso idempotente + reward rule server-side;
- checkpoints são avaliados no servidor.

O endpoint genérico `agv-progress-event` foi atualizado para **v3**: conclusão/progresso 100% é recusado quando a atividade não possui `metadata.client_progress_allowed=true`.

## Recompensas

`agv-reward-claim` v4:

- rejeita qualquer `amount` fornecido pelo cliente;
- só aceita claim genérico se a regra possuir `metadata.client_claimable=true`;
- não permite claim genérico de `server_verified`, `teacher_approval` ou `no_economic_reward`.

As regras CTF não são client-claimable. Missões/aulas/blocos/diário são emitidos por verificadores server-side.

## Aulas

`ctf-core-actions` v1 registra início e conclusão/revisão.

Primeira conclusão:

- +40 XP;
- +15 Cyber Coins;
- conclusão oficial em `activity_progress`.

Revisões posteriores podem contar como atividade de aula do protocolo diário, mas não repetem a recompensa da primeira conclusão.

## Protocolo diário

A data é calculada no servidor em **America/Sao_Paulo**.

Requisitos no mesmo dia:

1. pelo menos 1 missão concluída;
2. pelo menos 1 aula concluída/revisada;
3. pelo menos 1 ferramenta CTF utilizada.

Ao cumprir os três requisitos, o Core concede +50 Cyber Coins com idempotency key vinculada à data local. O antigo `daily_limit` UTC foi removido para evitar conflito em torno da meia-noite de São Paulo.

## Hints

O navegador envia somente `challengeId`. O custo é calculado no servidor a partir da dificuldade do catálogo:

- Recruta: 0 XP;
- Básico: 0 XP;
- Iniciante: 5 XP;
- Intermediário: 15 XP;
- Avançado: 25 XP;
- Especialista: 40 XP.

`ctf_spend_xp_service` é service-only, usa advisory lock por usuário, verifica saldo global de XP, é idempotente e grava débito em `metric_ledger` com `reason='hint.used'`.

## Cyber Store

Os 11 itens e preços oficiais do CTF 3.2.0 foram preservados. O cliente envia apenas `itemId`; o preço é resolvido em `ctf-core-actions`.

Para item pago, `ctf_store_purchase_service`:

1. trava o wallet central;
2. verifica saldo;
3. impede compra duplicada do mesmo cosmético;
4. debita `wallets.balance` atomicamente;
5. registra `wallet_ledger.entry_type='store_purchase'`;
6. grava `metadata.item_id` para comprovar propriedade.

### Estado transitório do inventário

A criação das novas tabelas canônicas de inventário foi bloqueada pela camada de segurança do conector Supabase. Portanto, **a propriedade no CTF é atualmente derivada do ledger central**, não de `inventory_instances`.

Itens gratuitos são sempre possuídos:

- `theme-neon`;
- `avatar-ghost`;
- `effect-matrix`.

Itens pagos são considerados possuídos somente quando há entrada `store_purchase` no ledger central para o usuário/item. Isso mantém a autoridade no servidor e permite migração futura para instâncias de inventário sem confiar em `localStorage`/IndexedDB.

## Cache local

IndexedDB criptografado continua para UX:

- drafts;
- preferências;
- narrativa;
- item equipado;
- cache de perfil.

Ao entrar, o perfil é reidratado do Core:

- missões concluídas;
- aulas concluídas;
- hints utilizados;
- XP;
- Cyber Coins;
- itens possuídos;
- diário atual.

Se um item localmente equipado não estiver presente na propriedade server-side, o sistema volta ao item padrão correspondente.

## Serviços live

- `agv-progress-event` v3 — JWT;
- `agv-reward-claim` v4 — JWT;
- `ctf-complete-challenge` v1 — JWT;
- `ctf-core-actions` v1 — JWT.

Serviços internos:

- `record_core_progress_event(...)` — service-only;
- `claim_core_reward_service(...)` — service-only;
- `ctf_spend_xp_service(...)` — service-only;
- `ctf_store_purchase_service(...)` — service-only.

A verificação de privilégios confirmou que `authenticated` não executa diretamente os dois serviços CTF; `service_role` executa.

## Pendências conhecidas

1. O RPC legado `claim_core_reward(text,...)` ainda é apontado pelo Security Advisor como `SECURITY DEFINER` executável por `authenticated`. A aplicação nova não o utiliza, mas a superfície precisa ser revogada/removida. A migration de revogação foi bloqueada pela camada de segurança do conector.
2. Leaked Password Protection do Supabase Auth continua desabilitada.
3. O inventário canônico final (`store_items`/`inventory_instances`) ainda precisa ser criado quando a camada de deploy permitir; até lá a propriedade é derivada do ledger.
4. Progresso/economia legados do CTF não são promovidos automaticamente. Reconciliação histórica precisa ser explícita e auditável.

## Próximo P1

Com o CTF fechado como plataforma piloto, a próxima integração recomendada é **LAB Virtual DS**, começando por identidade/progresso/XP e mantendo 3D/360 intacto.
