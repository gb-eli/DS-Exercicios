# P1 — LAB Virtual DS no AGV Education Core — v7

Data: 13/08/2026

## Estado desta versão

O LAB Virtual mantém sua experiência 3D/360, módulos, PWA e exercícios, mas o AGV Education Core passa a ser a autoridade para identidade, progresso, XP e Créditos Tech das atividades integradas.

### Backend live verificado

- `lab-virtual-core` v2: ACTIVE, JWT obrigatório.
- 50/50 ferramentas em `activity_catalog`.
- 88/88 conclusões em `activity_catalog`.
- 88/88 regras `activity.completed` ativas.
- Trust level das conclusões: `rule_validated`.
- Totais do catálogo: 5.195 XP e 1.979 Créditos Tech.
- 3 regras server-side para primeira atividade validada por nível:
  - básico: +15 créditos;
  - intermediário: +30 créditos;
  - avançado: +50 créditos.
- 6 regras server-side para exploração:
  - 30%: +100;
  - 50%: +150;
  - 70%: +250;
  - 80%: +300;
  - 90%: +400;
  - 100%: +750 Créditos Tech.

## Fonte única de verdade

A Edge Function v2 deixou de duplicar a allowlist das 88 conclusões em TypeScript. Ela consulta `activity_catalog` para autorizar:

- `tool:<toolId>`;
- `completion:<completionId>`;
- `toolId` vinculado;
- categoria;
- tempo mínimo.

Assim, o catálogo central é a autoridade da regra, e o código cliente não fornece `xp`, `coins` ou `credits`.

## Fluxo de conclusão

1. O aluno abre uma ferramenta válida.
2. O Core registra `tool.opened` e preserva o primeiro `openedAt`.
3. A conclusão precisa existir no catálogo e apontar para a ferramenta correta.
4. O Core exige tempo mínimo da atividade.
5. O progresso é gravado em `progress_events`/`activity_progress`.
6. A recompensa exata é obtida de `reward_rules` e aplicada por `claim_core_reward_service` via service role da Edge Function.
7. Na primeira conclusão válida daquela ferramenta, o endpoint concede o bônus do nível com idempotência por `user + tool`.
8. Ao abrir ferramentas, o endpoint recalcula cobertura e concede os marcos já alcançados, cada um apenas uma vez.

## Compatibilidade local

As chamadas antigas dos módulos que carregam `{xp, credits}` continuam existindo para preservar compatibilidade de UX, mas esses valores não são enviados como autoridade ao backend. Em Core mode:

- `gainXP()` não cria XP oficial;
- `addCredits()` não cria moeda oficial;
- `spendCredits()` não movimenta carteira oficial;
- os 250 créditos iniciais locais não são importados;
- importação local não substitui saldo/XP/progresso central.

## Loja Tech e inventário

A Loja Tech local continua bloqueada para compras pagas no modo Core. A Loja Virtual DS permanece o destino canônico para economia/inventário compartilhados. Esta versão conclui a economia das atividades do LAB, não a migração final do catálogo de itens/inventário da Loja Tech.


## Modo Professor nesta versão

As 88 conclusões do LAB Virtual também possuem uma referência privada em `activity_teacher_content`. O professor autorizado pode abrir a atividade do aluno e ver resultado esperado, ferramenta, tempo mínimo, XP/créditos oficiais e critérios de validação. Para atividades de simulação, isso substitui o conceito de “código gabarito”.

A Edge Function `agv-teacher-activity` revalida papel e escopo de turma antes de retornar a referência. O frontend Professor não contém respostas embutidas.

Para DS1/DS2/DS3/Sub, `core/tools/build-teacher-content.py` transforma os pacotes Professor privados em referências com arquivos preenchidos, explicação, rubrica e intervenção, sem colocar os gabaritos no bundle do aluno.

## O que ainda não está encerrado

Não declarar o LAB Virtual 100% migrado enquanto restarem:

- migração final da Loja Tech para Loja Virtual DS/inventário universal;
- Arcade Minutes e usos equivalentes ainda locais/não econômicos;
- reconciliação explícita do progresso legado de alunos;
- definição da versão canônica 4.28.0 (manifesto/catálogo) versus runtime 4.21.0;
- CORS restrito ao domínio final;
- remoção/revogação do RPC legado `claim_core_reward(...)` do Core;
- ativação do Leaked Password Protection no Auth.

## Arquivos principais

- `core/catalog/lab-virtual-4.28.0.json`
- `core/database/016_lab_virtual_tools_50_applied.sql`
- `core/database/018_lab_virtual_full_economy_deployment.sql`
- `core/edge-functions/lab-virtual-core/index.ts`
- `sistemas/01-lab-virtual/LABDS/lab/js/agv-core-bridge.js`
- `sistemas/01-lab-virtual/LABDS/lab/js/v3/core.js`
