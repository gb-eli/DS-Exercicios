# P1 — LAB VIRTUAL DS NO AGV EDUCATION CORE — PILOTO v6

**Data:** 13/08/2026  
**Raiz canônica:** `sistemas/01-lab-virtual/LABDS`  
**Core:** Supabase `iresvqwyaqotghjssncg`  
**Edge Function:** `lab-virtual-core` v1 — ACTIVE — JWT obrigatório

## Estado da integração

O LAB Virtual DS foi conectado ao AGV Education Core preservando a experiência 3D/360, os módulos, o hardware 3D, os simuladores e o PWA.

Nesta etapa, o Core é autoridade de:

- autenticação institucional;
- identidade usada pelo LAB (nome/e-mail/turma);
- saldo oficial da carteira;
- XP global exibido no LAB;
- abertura das 50 ferramentas;
- conclusão das 88 atividades conhecidas pelo endpoint;
- idempotência do progresso;
- regras econômicas das 10 conclusões provisionadas no piloto.

O navegador **não é autoridade** para XP ou Créditos Tech no modo oficial.

## Fonte de verdade econômica

O `v3/core.js` original possui economia local e começava com **250 Créditos Tech**. Esses 250 créditos **não são importados** para a carteira central.

Em `authority: agv-core`:

- `state.credits` espelha `wallets.balance` do Core;
- `state.xp` espelha o total global do `metric_ledger`;
- `gainXP`, `addCredits` e `spendCredits` deixam de alterar a economia oficial;
- `complete(..., {xp, credits})` mantém os números legados somente como contexto diagnóstico; os valores não são enviados como autoridade;
- importação de progresso local não sobrescreve XP, créditos ou conclusões oficiais;
- bônus locais de cobertura podem manter UX/conquista, mas não criam créditos oficiais;
- a Loja Tech local fica somente leitura para compras pagas no modo Core;
- Arcade Minutes locais não são autoridade nesta fase.

A Loja Virtual DS continua sendo a loja universal canônica do ecossistema.

## Autenticação central

Foi criado `lab/js/agv-core-bridge.js` sem CDN e sem biblioteca externa.

Fluxo:

1. login com e-mail institucional `@escola.pr.gov.br`;
2. senha pessoal;
3. primeiro acesso pode usar CGM ou a credencial temporária de staff já definida pelo Core;
4. se `must_change_password=true`, exige criação da senha pessoal;
5. carrega `profiles` e a turma principal;
6. alinha a sessão local do LAB ao usuário autenticado.

O nome e a turma deixam de ser identidade independente no modo oficial. Cores/avatar continuam preferência local.

Ao usar **Trocar estudante**, a sessão central também é encerrada antes do reload.

## Catálogo de ferramentas

O Supabase foi verificado com **50/50 ferramentas** em `activity_catalog` para `platforms.code='lab-virtual'`.

Essas linhas são `no_economic_reward`: abrir uma ferramenta registra uso/progresso, mas não gera moeda por si só.

A Edge Function possui a mesma allowlist das 50 ferramentas e recusa IDs externos ao catálogo lógico.

## Conclusões conhecidas

A Edge Function `lab-virtual-core` conhece **88 IDs de conclusão**. Eles cobrem atividades explícitas e conjuntos dinâmicos, incluindo:

- Sistema Solar;
- IPTV;
- Blocos;
- Mercado Tech;
- sensores do dispositivo;
- gráficos;
- produtividade;
- impressão 3D;
- radar/trânsito;
- clima/sensores;
- BioMonitor;
- AudioLab;
- energia;
- sorteios/organização escolar;
- 25 tutoriais;
- 17 perfis de VM;
- VoxelCraft;
- 7 jogos/simuladores do Arcade.

O endpoint rejeita qualquer conclusão fora da allowlist.

## Modelo de validação

As conclusões do LAB Virtual são tratadas como **`rule_validated`**, e não como `server_verified` completo.

Motivo: a simulação ocorre no navegador e o servidor não reproduz fisicamente/3D toda a interação. O Core valida:

- JWT e usuário real;
- `completionId` conhecido;
- ferramenta correspondente;
- existência de `tool_open` central;
- tempo mínimo conforme a atividade;
- idempotência;
- regra econômica existente no servidor.

Essa classificação evita afirmar um nível de verificação que a arquitetura ainda não oferece.

## Recompensas do piloto

Nesta v6, **10/88 conclusões** possuem regra econômica oficial. As outras 78 podem registrar conclusão/progresso no Core, mas recebem **0 recompensa econômica oficial** e não caem para o wallet local.

| Conclusão | XP | Créditos |
|---|---:|---:|
| `solar:rocket-launch` | 110 | 58 |
| `printing3d:successful-print-v40` | 110 | 62 |
| `productivity:sheet-formulas` | 80 | 35 |
| `traffic:signal-safe` | 70 | 25 |
| `thermal-panel:limits` | 70 | 30 |
| `biomonitor:comparison` | 65 | 25 |
| `iptv:stable` | 60 | 25 |
| `audio:classification:440` | 25 | 10 |
| `vm:installed:windows11` | 120 | 45 |
| `voxelcraft:challenge:mission` | 80 | 18 |

Todas estão com:

- `trust_level='rule_validated'`;
- `client_claimable=false`;
- `event_type='activity.completed'`;
- emissão somente após `lab-virtual-core` validar a conclusão.

## Comportamento fail-closed

O endpoint `complete` recusa campos `xp`, `coins` ou `credits` enviados pelo cliente.

Se a conclusão for válida, mas ainda não possuir uma `reward_rule`:

- progresso central: **sim**;
- conclusão central: **sim**;
- XP/moeda local: **não**;
- recompensa oficial: **não**, até o provisionamento da regra.

Isso permite migrar a plataforma progressivamente sem criar economia paralela.

## Interface preservada

Foram alteradas somente as camadas de integração e autoridade:

- `lab/js/agv-core-bridge.js` — novo;
- `lab/js/core/bootstrap.js`;
- `lab/js/v3/core.js`;
- `lab/js/app.js`;
- `lab/js/v3/shell.js`;
- `lab/index.html` — CSP/connect-src;
- `lab/service-worker.js` — bridge no cache e cache bust;
- `modules/code-games-lab/index.js` — não apresenta créditos locais como oficiais em Core mode.

Nenhum módulo 3D foi removido.

## PWA e CSP

A integração não adiciona CDN.

`connect-src` permite o projeto Supabase central. O bridge é um arquivo local servido pelo próprio LAB.

O Service Worker inclui `js/agv-core-bridge.js` e mantém o marcador de fase A5.5 exigido pela suíte existente.

## Versões — inconsistência de fonte preservada

As fontes do pacote divergem:

- `manifesto-plataformas.json`: LAB Virtual **4.28.0**;
- `lab/js/config.js`: runtime **4.21.0**;
- Service Worker base: `labds-v4.21.0...`.

O catálogo congelado foi nomeado `lab-virtual-4.28.0.json` seguindo o manifesto, mas a integração **não altera silenciosamente** o runtime para 4.28.0. Essa divergência deve ser reconciliada em uma etapa específica de versionamento.

## Banco — o que foi aplicado

Arquivos que representam o estado live seguro desta etapa:

- `core/database/016_lab_virtual_tools_50_applied.sql` — 50 ferramentas, sem recompensa econômica;
- `core/database/017_lab_virtual_pilot_reward_rules_applied.sql` — 10 regras piloto `rule_validated`.

Drafts bloqueados/experimentais ficam isolados em:

`core/database/pending-lab-virtual/`

Eles têm extensão `.draft` e **não devem ser aplicados automaticamente**.

A função SQL `lab_virtual_apply_completion_service(...)` chegou a ser desenhada, mas **não foi implantada** porque a camada de segurança do conector bloqueou a migration. A Edge Function usa operações server-side e `claim_core_reward_service` para as 10 recompensas provisionadas.

## Testes

Foram executados 9 testes reais com sucesso:

1. `test-agv-core-p1.mjs`;
2. `test-hardware-case-structure.mjs`;
3. `test-hardware-family-inspection-cinema.mjs`;
4. `test-hardware-layout-engine.mjs` — 19.200 layouts;
5. `test-hardware-material-engine.mjs`;
6. `test-hardware-peripheral-engine.mjs` — 5.850 combinações;
7. `test-hardware-system-benchmark-incident.mjs`;
8. `test-hardware-thermal-engine.mjs`;
9. `test-module-registration.mjs` — 42 módulos.

`validate-project.mjs` continua falhando por um problema **pré-existente no pacote-base**: ele referencia `tools/test-hardware-assembly.mjs`, arquivo que não existe na árvore recebida. O marcador do Service Worker afetado durante a integração foi restaurado; não restou falha nova de integração nesse validador.

## Pendências

1. Provisionar as regras econômicas das outras 78 conclusões após revisão pedagógica.
2. Centralizar bônus de primeira validação por ferramenta.
3. Centralizar marcos de cobertura 30/50/70/80/90/100%.
4. Migrar Loja Tech/inventário para a Loja Virtual DS canônica; até lá, compra paga local fica bloqueada no Core mode.
5. Definir Arcade Minutes/Study Gate no Core antes de reativar consumo oficial.
6. Reconciliar explicitamente dados legados; não promover 250 créditos nem XP local automaticamente.
7. Restringir CORS das Edge Functions ao domínio final quando a hospedagem estiver definida.
8. Resolver o RPC legado `claim_core_reward(...)` ainda apontado pelo Security Advisor; a aplicação nova não o utiliza.
9. Ativar Leaked Password Protection no Supabase Auth.
10. Resolver a divergência 4.28.0 (manifesto) × 4.21.0 (runtime).

## Critério para declarar LAB Virtual totalmente migrado

Não declarar 100% migrado até:

- 88/88 regras econômicas revisadas ou explicitamente marcadas sem recompensa;
- bônus de ferramenta/cobertura centralizados;
- Loja Tech substituída pela propriedade/inventário universal;
- Arcade Minutes centralizados;
- reconciliação de legado concluída;
- pendências de segurança críticas resolvidas;
- versionamento canônico reconciliado.

> **Histórico:** este documento descreve o piloto v6. O estado corrente está em `P1-LAB-VIRTUAL-CORE-v7.md`; na v7 o backend passou para 88/88 regras de conclusão e centralizou bônus de primeira ferramenta e marcos de exploração.
